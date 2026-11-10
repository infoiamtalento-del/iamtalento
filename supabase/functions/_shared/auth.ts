import { createClient, SupabaseClient, User } from "https://esm.sh/@supabase/supabase-js@2.49.1";

export interface AuthContext {
  user: User;
  token: string;
  userClient: SupabaseClient;
  admin: SupabaseClient;
}

export class HttpAuthError extends Error {
  status: number;
  code: string;
  constructor(message: string, status = 401, code = "28000") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export async function requireUser(req: Request): Promise<AuthContext> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new HttpAuthError("Missing or malformed Authorization header", 401, "28000");
  }

  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !anonKey) {
    throw new HttpAuthError("Supabase configuration missing", 500, "50000");
  }

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await userClient.auth.getUser();
  if (error || !data?.user) {
    throw new HttpAuthError("Invalid or expired session token", 401, "28000");
  }

  const admin = serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : userClient;

  return {
    user: data.user,
    token,
    userClient,
    admin,
  };
}

export async function requireRole(
  ctx: AuthContext,
  allowedRoles: string[]
): Promise<void> {
  // Check if platform admin
  const { data: isAdmin } = await ctx.admin.rpc("is_admin");
  if (isAdmin === true) {
    return;
  }

  // Check user_roles table
  const { data: roleRow } = await ctx.admin
    .from("user_roles")
    .select("role")
    .eq("user_id", ctx.user.id)
    .maybeSingle();

  const userRole = roleRow?.role ?? ctx.user.app_metadata?.role ?? ctx.user.user_metadata?.role;
  if (!userRole || !allowedRoles.includes(userRole)) {
    throw new HttpAuthError(
      `Access denied: required role ${allowedRoles.join(" or ")}`,
      403,
      "42501"
    );
  }
}
