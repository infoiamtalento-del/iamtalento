import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getMyContext, isDemoOnlySession } from "@/services/authSession";

export interface EmployerContext {
  id: string;
  company_name: string;
  contact_name: string;
  official_email: string;
  verification_status: string;
  verified_domain?: string | null;
}

export interface UserContext {
  authenticated: boolean;
  user_id: string;
  email: string;
  email_verified: boolean;
  email_verified_at: string | null;
  role: "employee" | "employer";
  is_admin: boolean;
  aal: "aal1" | "aal2";
  employer: EmployerContext | null;
  tenant: { id: string; role: string } | null;
  profile_completion: number;
  onboarding_completed: boolean;
  full_name: string;
  phone?: string | null;
  flags: {
    deletion_requested: boolean;
    deletion_requested_at: string | null;
  };
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  ctx: UserContext | null;
  loading: boolean;
  role: "employee" | "employer" | "guest";
  emailVerified: boolean;
  aal: "aal1" | "aal2";
  isAdmin: boolean;
  isDemo: boolean;
  refresh: () => Promise<void>;
  signOut: (options?: { scope?: "global" | "local" | "others" }) => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [ctx, setCtx] = useState<UserContext | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchContext = useCallback(async () => {
    try {
      const serverCtx = await getMyContext();
      setCtx(serverCtx);
    } catch (_e) {
      setCtx(null);
    }
  }, []);

  const refresh = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    setSession(data.session);
    setUser(data.session?.user ?? null);
    if (data.session?.user) {
      await fetchContext();
    } else {
      setCtx(null);
    }
  }, [fetchContext]);

  useEffect(() => {
    // 1. Initial session check
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        await fetchContext();
      }
      setLoading(false);
    });

    // 2. Auth state subscription
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        await fetchContext();
      } else {
        setCtx(null);
      }
      if (event === "SIGNED_OUT") {
        // Clear real session cache
        try {
          localStorage.removeItem("tq_sess");
        } catch (_err) {
          // ignore localStorage access errors
        }
      }
      setLoading(false);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, [fetchContext]);

  const signOut = useCallback(async (options?: { scope?: "global" | "local" | "others" }) => {
    try {
      await supabase.auth.signOut(options);
    } catch (_err) {
      // ignore network errors on signout
    }
    // Clear any real session storage keys while preserving demo isolation
    if (!isDemoOnlySession()) {
      try {
        localStorage.removeItem("tq_sess");
      } catch (_err) {
        // ignore localStorage errors
      }
    }
    setUser(null);
    setSession(null);
    setCtx(null);
  }, []);

  const isDemo = isDemoOnlySession();

  const role = useMemo(() => {
    if (ctx?.role) return ctx.role;
    if (user?.user_metadata?.role === "employer") return "employer";
    if (user) return "employee";
    return "guest";
  }, [ctx, user]);

  const emailVerified = useMemo(() => {
    if (ctx) return ctx.email_verified;
    return Boolean(user?.email_confirmed_at);
  }, [ctx, user]);

  const aal = ctx?.aal ?? "aal1";
  const isAdmin = ctx?.is_admin ?? false;

  const value = useMemo<AuthState>(
    () => ({
      user,
      session,
      ctx,
      loading,
      role,
      emailVerified,
      aal,
      isAdmin,
      isDemo,
      refresh,
      signOut,
    }),
    [user, session, ctx, loading, role, emailVerified, aal, isAdmin, isDemo, refresh, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
