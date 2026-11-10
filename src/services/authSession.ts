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
    return "Too many authentication requests right now. Please wait a few minutes and try again.";
  }
  if (/invalid login credentials/i.test(raw)) {
    return "Incorrect email or password. Please check your credentials and try again.";
  }
  if (/email not confirmed/i.test(raw)) {
    return "Please verify your email address to sign in. Check your inbox for the confirmation link.";
  }
  if (/user already registered|already exists/i.test(raw)) {
    return "An account with this email already exists. Please sign in instead.";
  }
  if (/otp_expired|link is invalid or has expired/i.test(raw)) {
    return "That email verification link has expired or was already used. Please request a new link.";
  }
  if (/password should be at least/i.test(raw) || /password/i.test(raw) && /length/i.test(raw)) {
    return "Password must be at least 10 characters long and include upper, lower case letters and numbers.";
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
  captchaToken?: string;
}

export interface SignUpResult {
  user: User | null;
  session: Session | null;
  needsEmailVerification: boolean;
}

/**
 * Signs up via standard Supabase Auth (GoTrue), enforcing email confirmation.
 */
export async function signUpWithEmail(input: SignUpInput): Promise<SignUpResult> {
  const email = normalizeEmail(input.email);
  const fullName = input.fullName.trim();
  const phone = input.phone?.trim() || undefined;
  const companyName = input.role === "employer" ? input.companyName?.trim() || undefined : undefined;
  const experienceLevel =
    input.role === "employee" && (input.experienceLevel === "fresher" || input.experienceLevel === "experienced")
      ? input.experienceLevel
      : undefined;

  const siteUrl = import.meta.env.VITE_SITE_URL || (typeof window !== "undefined" ? window.location.origin : "");
  const redirectUrl = `${siteUrl}/auth/callback`;

  const { data, error } = await supabase.auth.signUp({
    email,
    password: input.password,
    options: {
      emailRedirectTo: redirectUrl,
      data: {
        full_name: fullName,
        phone,
        experience_level: experienceLevel,
        role: input.role,
        company_name: companyName,
      },
      captchaToken: input.captchaToken,
    },
  });

  if (error) throw new Error(formatAuthError(error));

  return {
    user: data.user,
    session: data.session,
    needsEmailVerification: !data.session,
  };
}

// Backwards-compatible alias for existing imports
export const registerAndSignIn = signUpWithEmail;

/**
 * Standard Supabase Auth password sign in.
 */
export async function signInWithEmail(
  rawEmail: string,
  password: string
): Promise<{ user: User; session: Session }> {
  const email = normalizeEmail(rawEmail);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(formatAuthError(error));
  if (!data.user || !data.session) throw new Error("No session returned from authentication");

  // Record login event in background
  if (typeof window !== "undefined") {
    try {
      const deviceHash = `${navigator.userAgent}_${screen.width}x${screen.height}`;
      await recordLoginEvent(deviceHash);
    } catch {
      /* ignore telemetry errors */
    }
  }

  return { user: data.user, session: data.session };
}

// Backwards-compatible alias for existing imports
export const signInWithPasswordAndRecover = signInWithEmail;

/**
 * Retrieves caller's verified context directly from Postgres via RPC get_my_context
 */
export async function getMyContext(): Promise<any> {
  try {
    const { data, error } = await (supabase as any).rpc("get_my_context");
    if (error || !data || data.authenticated === false) return null;
    return data;
  } catch {
    return null;
  }
}

/**
 * Records device login and checks for new device logins
 */
export async function recordLoginEvent(deviceHash: string): Promise<string> {
  try {
    const { data } = await (supabase as any).rpc("record_login_event", {
      p_device_hash: deviceHash,
      p_ua: typeof navigator !== "undefined" ? navigator.userAgent : null,
    });
    return (data as string) || "login";
  } catch {
    return "login";
  }
}

/**
 * Records terms / privacy consents
 */
export async function recordConsent(kind: string, version: string): Promise<void> {
  try {
    await (supabase as any).rpc("record_consent", {
      p_kind: kind,
      p_version: version,
    });
  } catch (_err) {
    // Non-blocking consent record error
  }
}

/**
 * Completes onboarding/signup role assignment for OAuth users
 */
export async function completeSignup(
  role: "employer" | "employee",
  fullName: string,
  companyName?: string,
  phone?: string
): Promise<any> {
  const { data, error } = await (supabase as any).rpc("complete_signup", {
    p_role: role,
    p_full_name: fullName,
    p_company_name: companyName ?? null,
    p_phone: phone ?? null,
  });
  if (error) throw new Error(formatAuthError(error));
  return data;
}

/**
 * Requests account deletion
 */
export async function requestAccountDeletion(): Promise<any> {
  const { data, error } = await (supabase as any).rpc("request_account_deletion");
  if (error) throw new Error(formatAuthError(error));
  return data;
}

/**
 * Cancels account deletion
 */
export async function cancelAccountDeletion(): Promise<any> {
  const { data, error } = await (supabase as any).rpc("cancel_account_deletion");
  if (error) throw new Error(formatAuthError(error));
  return data;
}

/**
 * Exports user's complete data document (DPDP Act)
 */
export async function exportMyData(): Promise<any> {
  const { data, error } = await (supabase as any).rpc("export_my_data");
  if (error) throw new Error(formatAuthError(error));
  return data;
}

export interface EstablishSessionOptions {
  isNewSignup?: boolean;
}

/**
 * Hydrates the Pro workspace pointer (`tq_sess`) for an authenticated Supabase user.
 */
export async function establishProSessionForUser(
  user: User,
  fallbackRole?: SelfServeRole,
  redirectTo?: string | null,
  options?: EstablishSessionOptions
): Promise<string> {
  clearDemoOnlySession();

  const realEmail = normalizeEmail(user.email || `${user.id}@live.local`);
  let isEmployer = false;
  let candidateNeedsOnboarding = false;

  const ctx = await getMyContext();
  if (ctx) {
    isEmployer = ctx.role === "employer";
    candidateNeedsOnboarding = !ctx.onboarding_completed && ctx.profile_completion < 35;
  } else {
    const metaRole = (user.user_metadata?.role as string | undefined) || fallbackRole;
    isEmployer = metaRole === "employer";
  }

  if (typeof window !== "undefined") {
    try {
      if (isEmployer) {
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
          ctx?.employer?.contact_name ||
          ctx?.full_name ||
          (user.user_metadata?.full_name as string | undefined) ||
          existing?.name ||
          realEmail.split("@")[0];
        const companyName =
          ctx?.employer?.company_name ||
          (user.user_metadata?.company_name as string | undefined) ||
          existing?.cp?.name ||
          "My Company";

        parsedUsers[realEmail] = {
          ...template,
          ...existing,
          email: realEmail,
          role: "employer",
          name: displayName,
          phone: ctx?.phone || (user.user_metadata?.phone as string | undefined) || existing?.phone || "",
          wal: existing?.wal || { bal: 0, hist: [], tx: [] },
          cp: {
            ...(existing?.cp || {}),
            name: companyName,
            ind: existing?.cp?.ind || "Technology",
            size: existing?.cp?.size || "1-50",
            hq: existing?.cp?.hq || "",
            site: existing?.cp?.site || "",
            about: existing?.cp?.about || "",
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

  if (options?.isNewSignup) {
    return isEmployer ? "/employer-profile" : "/onboarding";
  }

  if (!isEmployer && candidateNeedsOnboarding) {
    return "/onboarding";
  }

  return isEmployer ? "/talento-pro?view=dash&role=employer" : "/talento-pro?view=dash";
}
