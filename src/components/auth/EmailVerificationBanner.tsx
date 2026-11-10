import React, { useState } from "react";
import { AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const EmailVerificationBanner: React.FC = () => {
  const { user, emailVerified, isAdmin } = useAuth();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  if (!user || emailVerified || isAdmin) return null;

  const handleResend = async () => {
    if (sending || cooldown > 0 || !user.email) return;
    setSending(true);
    try {
      const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
      await supabase.auth.resend({
        type: "signup",
        email: user.email,
        options: {
          emailRedirectTo: `${siteUrl}/auth/callback`,
        },
      });
      setSent(true);
      setCooldown(60);
      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (_e) {
      /* ignore rate limit errors */
    } finally {
      setSending(false);
    }
  };

  return (
    <aside aria-label="Email verification status" className="w-full bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5 text-xs text-amber-900 dark:text-amber-200">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Your email (<span className="font-semibold">{user.email}</span>) is not yet verified. Please verify your email to unlock all features.
          </span>
        </div>
        <div className="flex items-center gap-2">
          {sent ? (
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verification email sent!
            </span>
          ) : null}
          <Button
            size="sm"
            variant="outline"
            onClick={handleResend}
            disabled={sending || cooldown > 0}
            className="h-7 text-xs bg-background/80 hover:bg-background border-amber-500/30"
          >
            {sending ? (
              <RefreshCw className="w-3 h-3 animate-spin mr-1" />
            ) : cooldown > 0 ? (
              `Resend in ${cooldown}s`
            ) : (
              "Resend Verification Link"
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
};
