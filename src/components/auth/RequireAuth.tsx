import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { isDemoOnlySession } from "@/services/authSession";
import { EmailVerificationBanner } from "./EmailVerificationBanner";

export interface RequireAuthProps {
  children: React.ReactNode;
  role?: "employee" | "employer" | "admin";
  requireVerified?: boolean;
  requireAal2?: boolean;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({
  children,
  role,
  requireVerified = false,
  requireAal2 = false,
}) => {
  const { user, loading, role: userRole, emailVerified, aal, isAdmin } = useAuth();
  const location = useLocation();
  const isDemo = isDemoOnlySession();

  // Allow demo sessions only for /talento-pro routes
  if (isDemo && location.pathname.startsWith("/talento-pro")) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/auth" state={{ from: location.pathname + location.search }} replace />;
  }

  // Role check
  if (role) {
    if (role === "admin" && !isAdmin) {
      return <Navigate to="/talento-pro" replace />;
    }
    if (role === "employer" && userRole !== "employer" && !isAdmin) {
      return <Navigate to="/talento-pro?view=dash" replace />;
    }
    if (role === "employee" && userRole !== "employee" && !isAdmin) {
      return <Navigate to="/talento-pro?view=dash&role=employer" replace />;
    }
  }

  // MFA check
  if (requireAal2 && aal !== "aal2" && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="max-w-md w-full p-6 border border-border rounded-2xl bg-card text-center space-y-4">
          <h2 className="text-xl font-bold font-display">Two-Factor Authentication Required</h2>
          <p className="text-sm text-muted-foreground">
            This section contains sensitive actions that require two-factor authentication. Please verify your second factor in your account settings.
          </p>
        </div>
      </div>
    );
  }

  // Unverified email check
  if (requireVerified && !emailVerified && !isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <EmailVerificationBanner />
        <div className="max-w-3xl mx-auto py-16 px-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto text-2xl">
            ✉
          </div>
          <h2 className="text-2xl font-bold font-display">Email Verification Required</h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
            Please check your inbox at <span className="font-semibold text-foreground">{user.email}</span> and click the confirmation link to unlock this feature.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {!emailVerified && !isAdmin && <EmailVerificationBanner />}
      {children}
    </>
  );
};
