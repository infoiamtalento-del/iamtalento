import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AlertCircle, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { siteLogo } from "@/assets/logo";
import { establishProSessionForUser, formatAuthError } from "@/services/authSession";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const completeCallback = async () => {
      try {
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
        const errCode = searchParams.get("error_code") || hashParams.get("error_code");
        const errDesc = searchParams.get("error_description") || hashParams.get("error_description");
        const flowType = searchParams.get("type") || hashParams.get("type");
        const nextPath = searchParams.get("next") || searchParams.get("redirect");

        if (errCode || errDesc) {
          if (window.location.hash) {
            window.history.replaceState(null, "", window.location.pathname + window.location.search);
          }
          if (!active) return;
          setErrorMsg(formatAuthError(errDesc || errCode || "Verification link expired"));
          return;
        }

        const code = searchParams.get("code");
        if (code) {
          const { data: current } = await supabase.auth.getSession();
          if (!current.session) {
            const { error } = await supabase.auth.exchangeCodeForSession(code);
            if (error) {
              if (!active) return;
              setErrorMsg(formatAuthError(error));
              return;
            }
          }
        }

        const { data, error } = await supabase.auth.getSession();
        if (error) {
          if (!active) return;
          setErrorMsg(formatAuthError(error));
          return;
        }

        if (window.location.hash) {
          window.history.replaceState(null, "", window.location.pathname + window.location.search);
        }

        if (flowType === "recovery") {
          if (!active) return;
          navigate("/reset-password", { replace: true });
          return;
        }

        if (data.session?.user) {
          const target = await establishProSessionForUser(data.session.user, undefined, nextPath);
          if (!active) return;
          toast.success("Email verified! Welcome to IAmTalento.");
          navigate(target, { replace: true });
          return;
        }

        // Even if the token was consumed without creating a browser session,
        // the user's email is now verified and they can sign in directly.
        if (!active) return;
        toast.success("Account verified! Please sign in with your email and password.");
        navigate("/auth?verified=1", { replace: true });
      } catch (err) {
        if (!active) return;
        setErrorMsg(formatAuthError(err));
      }
    };

    void completeCallback();
    return () => {
      active = false;
    };
  }, [navigate, searchParams]);

  return (
    <>
      <Helmet>
        <title>Verifying Account | IAmTalento</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm text-center space-y-5">
          <Link to="/" className="inline-flex items-center justify-center">
            <img src={siteLogo.url} alt="I Am Talento" className="h-10 w-auto" />
          </Link>

          {errorMsg ? (
            <>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h1 className="text-xl font-bold font-display text-foreground">Verification Link Issue</h1>
                <p className="text-sm text-muted-foreground leading-relaxed">{errorMsg}</p>
              </div>
              <div className="pt-2 space-y-3">
                <Button asChild className="w-full h-11 gap-2">
                  <Link to="/auth">
                    Continue to Sign In
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <p className="text-xs text-muted-foreground">
                  Already created your account? Signing in with your password will automatically complete verification.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
              <div className="space-y-1.5">
                <h1 className="text-xl font-bold font-display text-foreground">Completing Sign-In</h1>
                <p className="text-sm text-muted-foreground">
                  Setting up your verified IAmTalento workspace...
                </p>
              </div>
              <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                <span>Securing session credentials</span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AuthCallback;
