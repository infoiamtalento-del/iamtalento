import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { siteLogo } from "@/assets/logo";
import { establishProSessionForUser, formatAuthError, normalizeEmail } from "@/services/authSession";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isResetRoute = location.pathname === "/reset-password";

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sentEmail, setSentEmail] = useState<string | null>(null);
  const [cooldownSec, setCooldownSec] = useState(0);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(isResetRoute);

  useEffect(() => {
    if (cooldownSec <= 0) return;
    const t = setInterval(() => setCooldownSec((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [cooldownSec]);

  useEffect(() => {
    if (!isResetRoute) {
      setCheckingSession(false);
      return;
    }
    let active = true;

    const initRecovery = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (code) {
        const { data: current } = await supabase.auth.getSession();
        if (!current.session) {
          await supabase.auth.exchangeCodeForSession(code).catch(() => {});
        }
      }
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      setHasRecoverySession(Boolean(data.session));
      setCheckingSession(false);
    };

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN" || session) {
        setHasRecoverySession(Boolean(session));
        setCheckingSession(false);
      }
    });

    void initRecovery();
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [isResetRoute]);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = normalizeEmail(email);
    if (!cleaned) {
      toast.error("Please enter your email address");
      return;
    }
    if (cooldownSec > 0) return;

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(cleaned, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);

    if (error) {
      if (/rate limit|over_email_send_rate_limit|429/i.test(error.message)) {
        setCooldownSec(60);
      }
      toast.error(formatAuthError(error));
      return;
    }

    setSentEmail(cleaned);
    setCooldownSec(60);
    toast.success("Password reset instructions sent.");
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 10) {
      toast.error("New password must be at least 10 characters and include uppercase, lowercase letters and numbers");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);

    if (error) {
      toast.error(formatAuthError(error));
      return;
    }

    toast.success("Password updated successfully!");
    if (data.user) {
      const target = await establishProSessionForUser(data.user);
      navigate(target, { replace: true });
    } else {
      navigate("/auth", { replace: true });
    }
  };

  const showNewPasswordForm = isResetRoute && hasRecoverySession;

  return (
    <>
      <Helmet>
        <title>{showNewPasswordForm ? "Set New Password" : "Forgot Password"} | IAmTalento</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="inline-flex items-center gap-2">
              <img src={siteLogo.url} alt="I Am Talento" className="h-9 w-auto" />
            </Link>
            <Link to="/auth" className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Sign In
            </Link>
          </div>

          {checkingSession ? (
            <div className="py-8 text-center space-y-3">
              <div className="mx-auto h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <p className="text-sm text-muted-foreground">Verifying recovery session...</p>
            </div>
          ) : showNewPasswordForm ? (
            <form onSubmit={handleUpdatePassword} className="space-y-5">
              <div>
                <h1 className="text-2xl font-bold font-display mb-1">Set a New Password</h1>
                <p className="text-sm text-muted-foreground">
                  Choose a strong password of at least 6 characters for your IAmTalento account.
                </p>
              </div>
              <div>
                <Label htmlFor="new-password" className="text-sm font-medium">New Password</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="new-password"
                    name="new-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Min 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 pr-10"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full h-11 gap-2">
                {loading ? "Updating Password..." : "Save New Password"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </Button>
            </form>
          ) : sentEmail ? (
            <div className="space-y-5 text-center py-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold font-display">Check Your Email</h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  If an account exists for <span className="font-medium text-foreground">{sentEmail}</span>, we sent a password reset link that opens directly on{" "}
                  <span className="font-mono text-xs">{window.location.origin}/reset-password</span>.
                </p>
              </div>
              <div className="space-y-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={cooldownSec > 0 || loading}
                  onClick={handleRequestReset}
                  className="w-full"
                >
                  {cooldownSec > 0 ? `Resend available in ${cooldownSec}s` : "Resend Reset Email"}
                </Button>
                <Button asChild variant="ghost" className="w-full">
                  <Link to="/auth">Return to Sign In</Link>
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRequestReset} className="space-y-5">
              <div>
                <h1 className="text-2xl font-bold font-display mb-1">Reset Your Password</h1>
                <p className="text-sm text-muted-foreground">
                  {isResetRoute
                    ? "Your reset link expired or hasn't been opened yet. Enter your email to request a fresh reset link."
                    : "Enter the email address associated with your account and we'll send you a reset link."}
                </p>
              </div>
              <div>
                <Label htmlFor="reset-email" className="text-sm font-medium">Email</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="reset-email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    spellCheck={false}
                    enterKeyHint="done"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button type="submit" disabled={loading || cooldownSec > 0} className="w-full h-11 gap-2">
                {loading
                  ? "Sending Reset Link..."
                  : cooldownSec > 0
                    ? `Please wait ${cooldownSec}s`
                    : "Send Reset Link"}
                {!loading && cooldownSec <= 0 && <ArrowRight className="h-4 w-4" />}
              </Button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
