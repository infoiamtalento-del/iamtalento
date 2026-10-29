import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_USERS, type ProUser } from "@/data/proData";

export type SelfServeRole = "employee" | "employer";

const DEMO_ONLY_KEY = "tq_demo_only";

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export function isSafeInternalPath(path: string | null | undefined): path is string {
  if (!path || typeof path !== "string") return false;
  const trimmed = path.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return false;
  if (trimmed.startsWith("/auth")) return false;
  return true;
}

export function isDemoOnlySession(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(DEMO_ONLY_KEY) === "1";
  } catch {
    return false;
  }
}

export function clearDemoOnlySession(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(DEMO_ONLY_KEY);
  } catch {
    /* ignore storage errors */
  }
}

/**
 * Enters the local dummy profile without touching or exposing any private Supabase session.
 */
export function openDemoWorkspace(role: SelfServeRole): string {
  const demoEmail = role === "employer" ? "demo.employer@talento.app" : "demo.candidate@talento.app";
  try {
    sessionStorage.setItem(DEMO_ONLY_KEY, "1");
    localStorage.setItem("tq_sess", JSON.stringify(demoEmail));
  } catch {
    /* ignore storage errors */
  }
  return role === "employer" ? "/talento-pro?view=dash&role=employer" : "/talento-pro?view=dash";
}

export function formatAuthError(err: unknown): string {
  const raw =
    typeof err === "string"
      ? err
      : err && typeof err === "object" && "message" in err && typeof (err as { message?: unknown }).message === "string"
        ? (err as { message: string }).message
        : "Authentication failed. Please try again.";

  if (/rate limit|over_email_send_rate_limit|too many requests|p0429/i.test(raw)) {
    return "Too many email or authentication requests right now. Please wait a few minutes and try again.";
  }
  if (/invalid login credentials/i.test(raw)) {
    return "Incorrect email or password. Please check your credentials and try again.";
  }
  if (/email not confirmed/i.test(raw)) {
    return "Your email address was awaiting confirmation. Please try signing in again.";
  }
  if (/user already registered|already exists/i.test(raw)) {
    return "An account with this email already exists. Please sign in instead.";
  }
  if (/otp_expired|link is invalid or has expired/i.test(raw)) {
    return "That email verification link has expired or was already used. Sign in directly with your email and password.";
  }
  return raw;
}

export interface SignUpInput {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role: SelfServeRole;
  experienceLevel?: "fresher" | "experienced" | "";
  companyName?: string;
}

export interface SignUpResult {
  user: User | null;
  session: Session | null;
  needsEmailVerification: boolean;
}

/**
 * Registers an account via the rate-limit-proof PostgreSQL RPC (`register_user_account`)
 * and immediately signs in with `signInWithPassword`, avoiding GoTrue's 2-email/hr
 * built-in SMTP bottleneck and `http://localhost:3000` redirect dead-ends.
 */
export async function registerAndSignIn(input: SignUpInput): Promise<SignUpResult> {
  const email = normalizeEmail(input.email);
  const fullName = input.fullName.trim();
  const phone = input.phone?.trim() || undefined;
  const companyName = input.role === "employer" ? input.companyName?.trim() || undefined : undefined;
  const experienceLevel =
    input.role === "employee" && (input.experienceLevel === "fresher" || input.experienceLevel === "experienced")
      ? input.experienceLevel
      : undefined;

  const { error: rpcError } = await (supabase as any).rpc("register_user_account", {
    p_email: email,
    p_password: input.password,
    p_full_name: fullName,
    p_phone: phone ?? null,
    p_role: input.role,
    p_experience_level: experienceLevel ?? null,
    p_company_name: companyName ?? null,
  });

  if (!rpcError) {
    const { data, error: signInErr } = await supabase.auth.signInWithPassword({
      email,
      password: input.password,
    });
    if (signInErr) throw new Error(formatAuthError(signInErr));
    return {
      user: data.user,
      session: data.session,
      needsEmailVerification: false,
    };
  }

  // Fallback only if the database migration hasn't been applied yet
  const isMissingFn =
    rpcError.code === "PGRST202" ||
    rpcError.code === "42883" ||
    /could not find the function|register_user_account/i.test(rpcError.message || "");

  if (!isMissingFn) {
    throw new Error(formatAuthError(rpcError));
  }

  const redirectOrigin = typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined;
  const { data, error } = await supabase.auth.signUp({
    email,
    password: input.password,
    options: {
      emailRedirectTo: redirectOrigin,
      data: {
        full_name: fullName,
        phone,
        experience_level: experienceLevel,
        role: input.role,
        company_name: companyName,
      },
    },
  });
  if (error) throw new Error(formatAuthError(error));

  return {
    user: data.user,
    session: data.session,
    needsEmailVerification: !data.session,
  };
}

/**
 * Signs in with email & password, transparently recovering any account stuck in
 * `email_confirmed_at IS NULL` (from an earlier localhost confirmation link) by
 * verifying the password server-side via `confirm_unverified_account`.
 */
export async function signInWithPasswordAndRecover(
  rawEmail: string,
  password: string
): Promise<{ user: User; session: Session }> {
  const email = normalizeEmail(rawEmail);
  const first = await supabase.auth.signInWithPassword({ email, password });
  if (!first.error && first.data.user && first.data.session) {
    return { user: first.data.user, session: first.data.session };
  }

  if (first.error && /email not confirmed/i.test(first.error.message)) {
    const { data: confirmed } = await (supabase as any).rpc("confirm_unverified_account", {
      p_email: email,
      p_password: password,
    });
    if (confirmed === true) {
      const retry = await supabase.auth.signInWithPassword({ email, password });
      if (!retry.error && retry.data.user && retry.data.session) {
        return { user: retry.data.user, session: retry.data.session };
      }
      if (retry.error) throw new Error(formatAuthError(retry.error));
    }
  }

  throw new Error(formatAuthError(first.error));
}

/**
 * Hydrates the Pro workspace pointer (`tq_sess` & real employer stub if needed)
 * for an authenticated Supabase user without touching demo accounts.
 */
export async function establishProSessionForUser(
  user: User,
  fallbackRole?: SelfServeRole,
  redirectTo?: string | null
): Promise<string> {
  clearDemoOnlySession();

  const realEmail = normalizeEmail(user.email || `${user.id}@live.local`);
  let isEmployer = false;

  try {
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    if (roles && roles.length > 0) {
      const hasEmployer = roles.some((r: { role: string }) => r.role === "employer");
      const hasEmployee = roles.some((r: { role: string }) => r.role === "employee");
      isEmployer = hasEmployer && !hasEmployee;
    } else {
      const metaRole = (user.user_metadata?.role as string | undefined) || fallbackRole;
      isEmployer = metaRole === "employer";
    }
  } catch {
    const metaRole = (user.user_metadata?.role as string | undefined) || fallbackRole;
    isEmployer = metaRole === "employer";
  }

  if (typeof window !== "undefined") {
    try {
      if (isEmployer) {
        // Hydrate a dedicated employer shell entry keyed by the real employer's email
        // so demo.employer@talento.app sample records remain completely untouched.
        const [{ data: empRow }, { data: profRow }] = await Promise.all([
          (supabase as any)
            .from("employers")
            .select("company_name, contact_name, phone, industry, company_size, headquarters, website_url, company_description")
            .eq("user_id", user.id)
            .maybeSingle(),
          supabase
            .from("profiles")
            .select("full_name, phone")
            .eq("id", user.id)
            .maybeSingle(),
        ]);

        let parsedUsers: Record<string, ProUser> = {};
        const rawUsers = localStorage.getItem("tq_users");
        if (rawUsers) {
          const decoded = JSON.parse(rawUsers);
          if (decoded && typeof decoded === "object" && !Array.isArray(decoded)) {
            parsedUsers = decoded;
          }
        }

        const existing = parsedUsers[realEmail];
        const template = DEFAULT_USERS["demo.employer@talento.app"];
        const displayName =
          empRow?.contact_name ||
          profRow?.full_name ||
          (user.user_metadata?.full_name as string | undefined) ||
          existing?.name ||
          realEmail.split("@")[0];
        const companyName =
          empRow?.company_name ||
          (user.user_metadata?.company_name as string | undefined) ||
          existing?.cp?.name ||
          "My Company";

        parsedUsers[realEmail] = {
          ...template,
          ...existing,
          email: realEmail,
          role: "employer",
          name: displayName,
          phone: empRow?.phone || profRow?.phone || (user.user_metadata?.phone as string | undefined) || existing?.phone || "",
          wal: existing?.wal || { bal: 0, hist: [], tx: [] },
          cp: {
            ...(existing?.cp || {}),
            name: companyName,
            ind: empRow?.industry || existing?.cp?.ind || "Technology",
            size: empRow?.company_size || existing?.cp?.size || "1-50",
            hq: empRow?.headquarters || existing?.cp?.hq || "",
            site: empRow?.website_url || existing?.cp?.site || "",
            about: empRow?.company_description || existing?.cp?.about || "",
          },
        };
        localStorage.setItem("tq_users", JSON.stringify(parsedUsers));
      }

      localStorage.setItem("tq_sess", JSON.stringify(realEmail));
    } catch {
      /* ignore localStorage quota/access errors */
    }
  }

  if (isSafeInternalPath(redirectTo)) {
    return redirectTo;
  }

  return isEmployer ? "/talento-pro?view=dash&role=employer" : "/talento-pro?view=dash";
}
