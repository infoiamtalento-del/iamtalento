import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Zap, Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight,
  CheckCircle2, ShieldCheck, Award, Target, Sparkles, Building2, UserCircle,
} from "lucide-react";
import { toast } from "sonner";

type AuthMode = "login" | "signup";
type UserRole = "employee" | "employer";

const trustItems = [
  { icon: ShieldCheck, text: "SOC 2 Compliant" },
  { icon: Award, text: "AI-Verified Scores" },
  { icon: Target, text: "Industry Readiness Score" },
  { icon: Sparkles, text: "Trusted by 10,000+ Professionals" },
];

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>("employee");
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [experienceLevel, setExperienceLevel] = useState<"fresher" | "experienced" | "">("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  // Employer-specific
  const [companyName, setCompanyName] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter email and password");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    // Check user role to redirect appropriately
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id);
    
    const isEmployer = roles?.some((r: any) => r.role === "employer");
    toast.success("Welcome back!");
    navigate(isEmployer ? "/employer-profile" : "/profile");
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          full_name: fullName,
          phone,
          experience_level: role === "employee" ? experienceLevel : undefined,
          role,
          company_name: role === "employer" ? companyName : undefined,
        },
      },
    });
    if (error) {
      setLoading(false);
      toast.error(error.message);
      return;
    }
    // Insert user role
    if (data.user) {
      await supabase.from("user_roles").insert({ user_id: data.user.id, role });
      // If employer, also create employer profile stub
      if (role === "employer") {
        await supabase.from("employers").insert({
          user_id: data.user.id,
          contact_name: fullName,
          official_email: email,
          phone,
          company_name: companyName,
        });
      }
    }
    setLoading(false);
    toast.success("Account created! Please check your email to verify.");
  };

  return (
    <>
      <Helmet>
        <title>{mode === "login" ? "Login" : "Sign Up"} — IAmTalento</title>
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
                <div className="h-10 w-10 rounded-lg bg-primary-foreground/15 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold font-display text-primary-foreground tracking-tight">
                  IAm<span className="text-primary-foreground/70">Talento</span>
                </span>
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
              {trustItems.map(({ icon: Icon, text }, i) => (
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
                <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
                  <Zap className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold font-display tracking-tight">
                  IAm<span className="text-primary">Talento</span>
                </span>
              </Link>
            </div>

            {/* Mode tabs */}
            <div className="flex gap-1 bg-secondary rounded-xl p-1 mb-8">
              {(["login", "signup"] as AuthMode[]).map((m) => (
                <button key={m} onClick={() => setMode(m)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold font-display transition-all ${
                    mode === m ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}>
                  {m === "login" ? "Login" : "Sign Up"}
                </button>
              ))}
            </div>

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
                        <Input id="login-email" type="email" placeholder="you@example.com"
                          value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center">
                        <Label htmlFor="login-password" className="text-sm font-medium">Password</Label>
                        <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
                      </div>
                      <div className="relative mt-1.5">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="login-password" type={showPassword ? "text" : "password"} placeholder="••••••••"
                          value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10" required />
                        <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <Button type="submit" disabled={loading} className="w-full h-11 gap-2">
                    {loading ? "Signing in..." : "Sign In"}
                    {!loading && <ArrowRight className="h-4 w-4" />}
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <button type="button" onClick={() => setMode("signup")} className="text-primary font-semibold hover:underline">Sign Up</button>
                  </p>
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
                        <Input id="signup-name" type="text" placeholder="Your full name"
                          value={fullName} onChange={(e) => setFullName(e.target.value)} className="pl-10" required maxLength={100} />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="signup-email" className="text-sm font-medium">
                        {role === "employer" ? "Official Email *" : "Email *"}
                      </Label>
                      <div className="relative mt-1.5">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="signup-email" type="email" placeholder="you@example.com"
                          value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required maxLength={255} />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="signup-phone" className="text-sm font-medium">Mobile Number</Label>
                      <div className="relative mt-1.5">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="signup-phone" type="tel" placeholder="+91 98765 43210"
                          value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10" maxLength={15} />
                      </div>
                    </div>

                    {/* Employer: Company Name */}
                    {role === "employer" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                        <Label htmlFor="signup-company" className="text-sm font-medium">Company Name *</Label>
                        <div className="relative mt-1.5">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="signup-company" type="text" placeholder="Your company name"
                            value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="pl-10" required maxLength={200} />
                        </div>
                      </motion.div>
                    )}

                    <div>
                      <Label htmlFor="signup-password" className="text-sm font-medium">Password *</Label>
                      <div className="relative mt-1.5">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="signup-password" type={showPassword ? "text" : "password"} placeholder="Min 6 characters"
                          value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10" required minLength={6} />
                        <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}>
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
                        I accept the{" "}<a href="#" className="text-primary hover:underline">Terms of Service</a>,{" "}
                        <a href="#" className="text-primary hover:underline">Privacy Policy</a>
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
