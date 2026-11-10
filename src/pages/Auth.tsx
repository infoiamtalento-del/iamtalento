import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight,
  CheckCircle2, ShieldCheck, Award, Target, Sparkles, Building2, UserCircle, LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { DEFAULT_USERS } from "@/data/proData";
import { getCandidatePhoto } from "@/data/portalAssets";
import { siteLogo } from "@/assets/logo";
import {
  establishProSessionForUser,
  formatAuthError,
  isDemoOnlySession,
  openDemoWorkspace,
  signUpWithEmail,
  signInWithEmail,
  recordConsent,
} from "@/services/authSession";

type AuthMode = "login" | "signup";
type UserRole = "employee" | "employer";

const trustItems = [
  { icon: ShieldCheck, text: "SOC 2 Compliant" },
  { icon: Award, text: "AI-Verified Scores" },
  { icon: Target, text: "Industry Readiness Score" },
  { icon: Sparkles, text: "Trusted by 10,000+ Professionals" },
];

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialMode: AuthMode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const initialRole: UserRole = searchParams.get("role") === "employer" ? "employer" : "employee";
  const redirectParam = searchParams.get("redirect") || searchParams.get("next");

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>(initialRole);
  const [existingUser, setExistingUser] = useState<SupabaseUser | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [experienceLevel, setExperienceLevel] = useState<"fresher" | "experienced" | "">("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  // Employer-specific
  const [companyName, setCompanyName] = useState("");
  const [awaitingVerificationEmail, setAwaitingVerificationEmail] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  useEffect(() => {
    const reqMode = searchParams.get("mode");
    if (reqMode === "signup" || reqMode === "login") setMode(reqMode);
    const reqRole = searchParams.get("role");
    if (reqRole === "employer" || reqRole === "employee") setRole(reqRole);
  }, [searchParams]);

  useEffect(() => {
    // Handle auth callback tokens or hash errors if an email link pointed directly to /auth
    const hash = window.location.hash;
    const code = searchParams.get("code");
    if (code || /access_token=|error_code=|error_description=/.test(hash)) {
      navigate(`/auth/callback${window.location.search}${hash}`, { replace: true });
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user && !isDemoOnlySession()) {
        setExistingUser(data.session.user);
      }
    });
  }, [navigate, searchParams]);

  const openDemoProfile = () => {
    const dest = openDemoWorkspace(role);
    navigate(dest);
  };
  const demoUser = DEFAULT_USERS[role === "employer" ? "demo.employer@talento.app" : "demo.candidate@talento.app"];

  const handleContinueExisting = async () => {
    if (!existingUser) return;
    setLoading(true);
    try {
      const target = await establishProSessionForUser(existingUser, role, redirectParam);
      navigate(target);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchAccount = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("tq_sess");
    setExistingUser(null);
    toast.success("Signed out. You can now sign in with another account.");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Please enter your email and password");
      return;
    }
    setLoading(true);
    try {
      const { user } = await signInWithEmail(email, password);
      const target = await establishProSessionForUser(user, role, redirectParam);
      toast.success("Welcome back!");
      navigate(target);
    } catch (err) {
      toast.error(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: "google") => {
    setLoading(true);
    try {
      const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${siteUrl}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err) {
      toast.error(formatAuthError(err));
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!awaitingVerificationEmail || resendCooldown > 0) return;
    try {
      const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: awaitingVerificationEmail,
        options: {
          emailRedirectTo: `${siteUrl}/auth/callback`,
        },
      });
      if (error) throw error;
      toast.success("Verification link resent! Check your inbox.");
      setResendCooldown(60);
    } catch (err) {
      toast.error(formatAuthError(err));
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (password.length < 10) {
      toast.error("Password must be at least 10 characters long");
      return;
    }
    if (role === "employee" && !experienceLevel) {
      toast.error("Please select your experience level");
      return;
    }
    if (role === "employer" && !companyName.trim()) {
      toast.error("Please enter your company name");
      return;
    }
    if (!acceptTerms) {
      toast.error("Please accept the terms & conditions");
      return;
    }

    setLoading(true);
    try {
      const result = await signUpWithEmail({
        email,
        password,
        fullName,
        phone,
        role,
        experienceLevel,
        companyName,
      });

      // Record DPDP consents
      void recordConsent("terms", "1.0");
      void recordConsent("privacy", "1.0");

      if (result.needsEmailVerification) {
        setAwaitingVerificationEmail(email);
        setResendCooldown(60);
        toast.success("Account created! Please check your inbox to verify your email.");
        return;
      }

      if (result.user && result.session) {
        const target = await establishProSessionForUser(result.user, role, redirectParam, {
          isNewSignup: true,
        });
        toast.success(
          role === "employee"
            ? "Account created! Complete verification & your profile setup."
            : "Employer account created! Complete your company profile."
        );
        navigate(target);
        return;
      }

      toast.success("Account created! Please check your email to confirm your account.");
      setAwaitingVerificationEmail(email);
    } catch (err) {
      toast.error(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{mode === "login" ? "Login" : "Sign Up"} | IAmTalento</title>
      </Helmet>
      <div className="min-h-screen flex bg-background">
        {/* Left Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-primary relative flex-col justify-between p-12 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary-foreground/5 blur-[100px]"
            animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-primary-foreground/5 blur-[100px]"
            animate={{ x: [0, -20, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative z-10">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Link to="/" className="flex items-center gap-2 mb-20">
                <span className="rounded-md bg-background px-3 py-2"><img src={siteLogo.url} alt="I Am Talento" className="h-10 w-auto" /></span>
              </Link>
            </motion.div>
            <motion.h2 className="text-4xl font-bold font-display text-primary-foreground leading-tight mb-4"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
              Your Career.<br />Verified.
            </motion.h2>
            <motion.p className="text-primary-foreground/50 text-sm leading-relaxed max-w-sm mb-12"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}>
              AI-powered assessments. Industry readiness scores. Proof that speaks for itself.
            </motion.p>
            <div className="space-y-3">
              {trustItems.map(({ text }, i) => (
                <motion.div key={text} className="flex items-center gap-3 text-primary-foreground/60"
                  initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.35 + i * 0.08 }}>
                  <CheckCircle2 className="h-4 w-4 text-primary-foreground/40 shrink-0" />
                  <span className="text-sm">{text}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <motion.p className="relative z-10 text-primary-foreground/30 text-xs"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.8 }}>
            © 2026 IAmTalento. All rights reserved.
          </motion.p>
        </div>

        {/* Right Form */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-2 mb-8">
              <Link to="/" className="flex items-center gap-2">
                <img src={siteLogo.url} alt="I Am Talento" className="h-10 w-auto" />
              </Link>
            </div>

            {existingUser && (
              <div className="mb-6 rounded-xl border border-primary/25 bg-primary/5 p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">Active Session</p>
                    <p className="text-sm font-medium text-foreground truncate">{existingUser.email}</p>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={handleSwitchAccount} className="gap-1.5 text-xs shrink-0">
                    <LogOut className="h-3.5 w-3.5" />
                    Switch
                  </Button>
                </div>
                <Button type="button" onClick={handleContinueExisting} disabled={loading} className="w-full h-10 gap-2">
                  Continue to Workspace
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {awaitingVerificationEmail ? (
              <div className="rounded-2xl border border-border bg-card p-6 text-center space-y-4 shadow-sm mb-6">
                <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto text-xl">
                  <Mail className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold font-display text-foreground">Check Your Inbox</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We've sent a verification link to <span className="font-semibold text-foreground">{awaitingVerificationEmail}</span>.
                  Click the link in the email to activate your account.
                </p>
                <div className="pt-2 space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResendVerification}
                    disabled={resendCooldown > 0}
                    className="w-full text-xs h-10"
                  >
                    {resendCooldown > 0 ? `Resend link in ${resendCooldown}s` : "Resend Verification Link"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setAwaitingVerificationEmail(null);
                      setMode("login");
                    }}
                    className="w-full text-xs h-9 text-muted-foreground"
                  >
                    Back to Sign In
                  </Button>
                </div>
              </div>
            ) : null}

            {/* Mode tabs */}
            <div className="flex gap-1 bg-secondary rounded-xl p-1 mb-8">
              {(["login", "signup"] as AuthMode[]).map((m) => (
                <button key={m} type="button" onClick={() => setMode(m)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold font-display transition-all ${
                    mode === m ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}>
                  {m === "login" ? "Login" : "Sign Up"}
                </button>
              ))}
            </div>

            {mode === "login" && <div className="mb-6 grid grid-cols-2 gap-3" aria-label="Account type">
              {(["employee", "employer"] as const).map((value) => <Button key={value} type="button" variant="outline" aria-pressed={role === value} onClick={() => setRole(value)} className={role === value ? "border-primary bg-primary/10 text-primary hover:bg-primary/15" : "text-muted-foreground"}>
                {value === "employee" ? <UserCircle /> : <Building2 />}{value === "employee" ? "Employee" : "Employer"}
              </Button>)}
            </div>}

            <AnimatePresence mode="wait">
              {mode === "login" ? (
                <motion.form key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}
                  onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <h1 className="text-2xl font-bold font-display mb-1">Welcome Back</h1>
                    <p className="text-sm text-muted-foreground">Sign in to your IAmTalento account</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="login-email" className="text-sm font-medium">Email</Label>
                      <div className="relative mt-1.5">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-email"
                          name="email"
                          type="email"
                          autoComplete="username"
                          spellCheck={false}
                          enterKeyHint="next"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center">
                        <Label htmlFor="login-password" className="text-sm font-medium">Password</Label>
                        <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
                      </div>
                      <div className="relative mt-1.5">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          enterKeyHint="done"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <Button type="submit" disabled={loading} className="w-full h-11 gap-2">
                    {loading ? "Signing in..." : "Sign In"}
                    {!loading && <ArrowRight className="h-4 w-4" />}
                  </Button>

                  <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or</span></div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    disabled={loading}
                    onClick={() => handleOAuthSignIn("google")}
                    className="w-full h-10 gap-2.5 font-normal border-border/80"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    Continue with Google
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <button type="button" onClick={() => setMode("signup")} className="text-primary font-semibold hover:underline">Sign Up</button>
                  </p>
                  <div className="border-t border-border pt-5">
                    <p className="mb-3 text-xs font-semibold uppercase text-muted-foreground">Demo account</p>
                    <Button type="button" variant="outline" onClick={openDemoProfile} className="h-auto w-full justify-start gap-3 whitespace-normal border-primary/30 bg-primary/5 p-4 text-left hover:bg-primary/10">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-primary-foreground">
                        <img src={getCandidatePhoto(demoUser.name)} alt={demoUser.name} className="h-full w-full object-cover" />
                      </span>
                      <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-primary">Quick login as {demoUser.name}</span><span className="mt-1 block text-xs text-muted-foreground">{role === "employer" ? "Employer company profile" : "Employee profile"}</span></span>
                      <ArrowRight className="text-primary" />
                    </Button>
                  </div>
                </motion.form>
              ) : (
                <motion.form key="signup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
                  onSubmit={handleSignUp} className="space-y-5">
                  <div>
                    <h1 className="text-2xl font-bold font-display mb-1">Create Your Account</h1>
                    <p className="text-sm text-muted-foreground">
                      {role === "employee" ? "Join IAmTalento and prove your industry readiness" : "Hire pre-verified talent with confidence"}
                    </p>
                  </div>

                  {/* Role Toggle */}
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      { value: "employee" as UserRole, icon: UserCircle, label: "I'm a Candidate", sub: "Find opportunities" },
                      { value: "employer" as UserRole, icon: Building2, label: "I'm an Employer", sub: "Hire talent" },
                    ]).map(({ value, icon: Icon, label, sub }) => (
                      <button key={value} type="button" onClick={() => setRole(value)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          role === value
                            ? "border-primary bg-accent"
                            : "border-border bg-card hover:border-primary/30"
                        }`}>
                        <Icon className={`h-5 w-5 mb-2 ${role === value ? "text-primary" : "text-muted-foreground"}`} />
                        <p className={`text-sm font-semibold ${role === value ? "text-primary" : "text-foreground"}`}>{label}</p>
                        <p className="text-xs text-muted-foreground">{sub}</p>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="signup-name" className="text-sm font-medium">Full Name *</Label>
                      <div className="relative mt-1.5">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          enterKeyHint="next"
                          placeholder="Your full name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="pl-10"
                          required
                          maxLength={100}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="signup-email" className="text-sm font-medium">
                        {role === "employer" ? "Official Email *" : "Email *"}
                      </Label>
                      <div className="relative mt-1.5">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          name="email"
                          type="email"
                          autoComplete="username"
                          spellCheck={false}
                          enterKeyHint="next"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                          maxLength={255}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="signup-phone" className="text-sm font-medium">Mobile Number</Label>
                      <div className="relative mt-1.5">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-phone"
                          name="tel"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          enterKeyHint="next"
                          placeholder="+91 98765 43210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="pl-10"
                          maxLength={18}
                        />
                      </div>
                    </div>

                    {/* Employer: Company Name */}
                    {role === "employer" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                        <Label htmlFor="signup-company" className="text-sm font-medium">Company Name *</Label>
                        <div className="relative mt-1.5">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signup-company"
                            name="organization"
                            type="text"
                            autoComplete="organization"
                            enterKeyHint="next"
                            placeholder="Your company name"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="pl-10"
                            required
                            maxLength={200}
                          />
                        </div>
                      </motion.div>
                    )}

                    <div>
                      <Label htmlFor="signup-password" className="text-sm font-medium">Password *</Label>
                      <div className="relative mt-1.5">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          name="new-password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          enterKeyHint="done"
                          placeholder="Min 10 characters (A-Z, a-z, 0-9)"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10"
                          required
                          minLength={10}
                        />
                        <button
                          type="button"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Employee: Experience Level */}
                    {role === "employee" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                        <Label className="text-sm font-medium">Experience Level *</Label>
                        <div className="grid grid-cols-2 gap-3 mt-1.5">
                          {(["fresher", "experienced"] as const).map((level) => (
                            <button key={level} type="button" onClick={() => setExperienceLevel(level)}
                              className={`p-3 rounded-xl border text-sm font-medium text-center transition-all ${
                                experienceLevel === level
                                  ? "border-primary bg-accent text-primary"
                                  : "border-border bg-card text-muted-foreground hover:border-primary/30"
                              }`}>
                              {level === "fresher" ? "Fresher" : "Experienced"}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary" />
                      <span className="text-xs text-muted-foreground leading-relaxed">
                        I accept the{" "}<Link to="/docs" className="text-primary hover:underline">Terms of Service</Link>,{" "}
                        <Link to="/docs" className="text-primary hover:underline">Privacy Policy</Link>
                        {role === "employee" && ", and consent to AI-proctored assessments"}.
                      </span>
                    </label>
                  </div>

                  <Button type="submit" disabled={loading} className="w-full h-11 gap-2">
                    {loading ? "Creating Account..." : "Create Account"}
                    {!loading && <ArrowRight className="h-4 w-4" />}
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <button type="button" onClick={() => setMode("login")} className="text-primary font-semibold hover:underline">Sign In</button>
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
