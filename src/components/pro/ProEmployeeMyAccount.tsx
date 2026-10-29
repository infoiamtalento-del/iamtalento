import { useState, useEffect } from "react";
import {
  UserRound,
  UserCheck,
  Briefcase,
  FileText,
  GraduationCap,
  ArrowRight,
  Mail,
  MapPin,
  ShieldCheck,
  Sparkles,
  Phone,
  KeyRound,
  Shield,
  Smartphone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Download,
  Bell,
  Sliders,
  Laptop,
  LogOut,
  Pencil,
  QrCode,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type ProUser, type ProJob, type ProApplication } from "@/data/proData";
import { getCandidatePhoto } from "@/data/portalAssets";
import { supabase } from "@/integrations/supabase/client";
import { loadLiveProfile } from "@/services/candidate/profile";
import { claimReferral } from "@/services/candidate/wallet";
import { backendErrorMessage } from "@/hooks/useCandidateBackend";
import type { ProView } from "./proTypes";
import "./employer-workspace.css";

interface Props {
  user: ProUser;
  jobs: ProJob[];
  applications: ProApplication[];
  isLive?: boolean;
  initialTab?: "info" | "security" | "settings";
  onNavigate: (view: ProView) => void;
  onUpdateUser?: (updated: ProUser) => void;
  onToast?: (msg: string) => void;
}

export function ProEmployeeMyAccount({
  user,
  jobs,
  applications,
  isLive = false,
  initialTab = "info",
  onNavigate,
  onUpdateUser,
  onToast,
}: Props) {
  const myApps = applications.filter((a) => a.who === user.email);
  const myInterviews = myApps.filter((a) => a.st === "Interview");
  const avatarUrl = user.avatar || (isLive ? undefined : getCandidatePhoto(user.name));
  const [liveMeta, setLiveMeta] = useState<{ iamTalentoId: string; referralCode: string; referralClaimed: boolean } | null>(null);
  const [referralInput, setReferralInput] = useState("");
  const [claimingRef, setClaimingRef] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    if (!isLive) { setLiveMeta(null); return; }
    let alive = true;
    loadLiveProfile().then((lp) => {
      if (!alive || !lp) return;
      setLiveMeta({
        iamTalentoId: lp.profile.iam_talento_id,
        referralCode: lp.profile.referral_code,
        referralClaimed: lp.profile.referral_claimed,
      });
    }).catch(() => {});
    return () => { alive = false; };
  }, [isLive]);

  const handlePhotoUpload = async (file?: File | null) => {
    if (!file || !isLive) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      onToast?.("Upload a JPG, PNG, or WEBP photo.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      onToast?.("Photo must be under 5 MB.");
      return;
    }
    setUploadingPhoto(true);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error("Not signed in");
      const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
      const path = `${authUser.id}/avatar-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("profile-photos").upload(path, file, { contentType: file.type, upsert: true });
      if (error) throw error;
      const { data: pub } = supabase.storage.from("profile-photos").getPublicUrl(path);
      if (onUpdateUser) onUpdateUser({ ...user, avatar: pub.publicUrl });
      onToast?.("Profile photo updated!");
    } catch (err) {
      onToast?.(backendErrorMessage(err));
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleClaimReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referralInput.trim()) return;
    setClaimingRef(true);
    try {
      const msg = await claimReferral(referralInput.trim().toUpperCase());
      setReferralInput("");
      setLiveMeta((prev) => (prev ? { ...prev, referralClaimed: true } : prev));
      onToast?.(msg);
    } catch (err) {
      onToast?.(backendErrorMessage(err));
    } finally {
      setClaimingRef(false);
    }
  };

  // Active Tab
  const [activeTab, setActiveTab] = useState<"info" | "security" | "settings">(initialTab);
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Edit Account Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || user.ph || "+91 98765 43210",
    head: user.head || "Frontend Developer · React · 2.5 yrs",
    city: user.city || "Bengaluru",
  });
  const [editError, setEditError] = useState("");

  // Change Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwError, setPwError] = useState("");

  // 2FA Setup Modal State
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [twoFactorMethod, setTwoFactorMethod] = useState<"authenticator" | "sms">(
    user.twoFactorMethod || "authenticator"
  );
  const [twoFactorOtp, setTwoFactorOtp] = useState("");
  const [twoFactorStep, setTwoFactorStep] = useState<"configure" | "verify" | "recovery">("configure");
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);

  // Security Sessions
  const [sessionsSignedOut, setSessionsSignedOut] = useState(false);

  // Account Settings state
  const [privacyVisibility, setPrivacyVisibility] = useState<"public" | "applied_only" | "private">(
    user.privacyVisibility || "public"
  );
  const [emailAlerts, setEmailAlerts] = useState<boolean>(user.emailAlerts !== false);
  const [smsAlerts, setSmsAlerts] = useState<boolean>(user.smsAlerts !== false);
  const [marketingEmails, setMarketingEmails] = useState<boolean>(user.marketingEmails || false);
  const [loginAlerts, setLoginAlerts] = useState<boolean>(user.loginAlerts !== false);

  const backupCodes = ["8392-1049", "4829-5710", "3910-8274", "5519-3820"];
  const secretAuthKey = "TALENTO-SEC-9482-K839";

  // Password strength calculation
  const getPasswordStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const pwStrength = getPasswordStrength(newPw);

  // Open Edit Modal with fresh user info
  const handleOpenEditModal = () => {
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || user.ph || "+91 98765 43210",
      head: user.head || "Frontend Developer · React · 2.5 yrs",
      city: user.city || "Bengaluru",
    });
    setEditError("");
    setIsEditModalOpen(true);
  };

  // Save Account Info
  const handleSaveAccountInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.name.trim()) {
      setEditError("Name cannot be empty.");
      return;
    }
    if (!editForm.email.trim() || !editForm.email.includes("@") || !editForm.email.includes(".")) {
      setEditError("Please enter a valid email address.");
      return;
    }
    if (!editForm.phone.trim() || editForm.phone.replace(/\D/g, "").length < 8) {
      setEditError("Please enter a valid mobile number (min 10 digits).");
      return;
    }

    const updated: ProUser = {
      ...user,
      name: editForm.name.trim(),
      email: editForm.email.trim(),
      phone: editForm.phone.trim(),
      ph: editForm.phone.trim(),
      phv: true,
      head: editForm.head.trim(),
      city: editForm.city.trim(),
    };

    if (onUpdateUser) {
      onUpdateUser(updated);
    }
    setIsEditModalOpen(false);
    onToast?.("Account details updated successfully! Email and mobile verified.");
  };

  // Save Password
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLive && !currentPw) {
      setPwError("Please enter your current password.");
      return;
    }
    if (newPw.length < 8) {
      setPwError("New password must be at least 8 characters long.");
      return;
    }
    if (newPw !== confirmPw) {
      setPwError("New password and confirmation do not match.");
      return;
    }

    if (isLive) {
      const { error } = await supabase.auth.updateUser({ password: newPw });
      if (error) {
        setPwError(error.message);
        return;
      }
    } else {
      const updated: ProUser = {
        ...user,
        pw: newPw,
        passwordLastChanged: Date.now(),
      };
      if (onUpdateUser) onUpdateUser(updated);
    }

    setIsPasswordModalOpen(false);
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
    setPwError("");
    onToast?.("Password changed successfully! Keep your credentials safe.");
  };

  // Handle 2FA Toggle
  const handleToggle2FA = (checked: boolean) => {
    if (checked) {
      setTwoFactorStep("configure");
      setTwoFactorOtp("");
      setIs2FAModalOpen(true);
    } else {
      const updated: ProUser = {
        ...user,
        twoFactor: false,
      };
      if (onUpdateUser) onUpdateUser(updated);
      onToast?.("2-Step Verification has been disabled.");
    }
  };

  // Verify and confirm 2FA
  const handleVerify2FA = () => {
    if (twoFactorOtp.trim().length < 6) {
      onToast?.("Please enter the 6-digit verification code.");
      return;
    }

    const updated: ProUser = {
      ...user,
      twoFactor: true,
      twoFactorMethod,
      twoFactorPhone: user.phone || user.ph || editForm.phone,
    };

    if (onUpdateUser) onUpdateUser(updated);
    setTwoFactorStep("recovery");
    onToast?.("2-Step Verification verified and activated successfully!");
  };

  // Save Basic Settings
  const handleSaveSettings = (
    visibility: "public" | "applied_only" | "private",
    eAlerts: boolean,
    sAlerts: boolean,
    mEmails: boolean,
    lAlerts: boolean
  ) => {
    setPrivacyVisibility(visibility);
    setEmailAlerts(eAlerts);
    setSmsAlerts(sAlerts);
    setMarketingEmails(mEmails);
    setLoginAlerts(lAlerts);

    const updated: ProUser = {
      ...user,
      privacyVisibility: visibility,
      emailAlerts: eAlerts,
      smsAlerts: sAlerts,
      marketingEmails: mEmails,
      loginAlerts: lAlerts,
    };

    if (onUpdateUser) onUpdateUser(updated);
    onToast?.("Account preferences saved successfully.");
  };

  // Download user profile data
  const handleDownloadData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(user, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `talento-account-${user.email || "data"}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onToast?.("Your account data file has been downloaded.");
  };

  return (
    <div className="employer-workspace space-y-6">
      {/* HEADER */}
      <header className="workspace-header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="workspace-eyebrow flex items-center gap-1.5">
            <UserRound size={14} className="text-primary" />
            Employee account · Security & Settings
          </span>
          <h1 className="workspace-heading text-2xl font-bold tracking-tight">My Account</h1>
          <p className="workspace-description text-sm text-muted-foreground">
            Manage your personal profile, contact credentials, password, and two-step verification security.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="outline" onClick={handleOpenEditModal} className="cursor-pointer gap-2">
            <Pencil className="h-4 w-4 text-primary" />
            Edit Account Info
          </Button>
          <Button onClick={() => onNavigate("profile")} className="cursor-pointer gap-1.5">
            <UserCheck className="h-4 w-4 mr-1" />
            Candidate Profile
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </header>

      {/* TOP USER CARD BANNER */}
      <div className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="relative h-18 w-18 sm:h-20 sm:w-20 rounded-full bg-primary/10 text-primary font-bold text-2xl flex items-center justify-center shrink-0 overflow-hidden border-2 border-primary/20 shadow-xs">
              {avatarUrl ? (
                <img src={avatarUrl} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                (user.name?.charAt(0) || "Y").toUpperCase()
              )}
              <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-card" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">{user.name}</h2>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 gap-1 text-xs">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified Candidate
                </Badge>
                {user.twoFactor ? (
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 gap-1 text-xs">
                    <ShieldCheck className="h-3 w-3" />
                    2FA Protected
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30 gap-1 text-xs">
                    <AlertTriangle className="h-3 w-3" />
                    2FA Disabled
                  </Badge>
                )}
              </div>

              <p className="mt-1 text-sm font-medium text-foreground/80">{user.head || "Frontend Developer · React · 2.5 yrs"}</p>
              
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                  {user.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  {user.phone || user.ph || "+91 98765 43210"}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  {user.city || "Bengaluru, India"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto justify-end border-t md:border-t-0 pt-4 md:pt-0 border-border">
            {isLive && (
              <label className="inline-flex">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={(e) => handlePhotoUpload(e.target.files?.[0])}
                />
                <span className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-3 text-xs font-medium hover:bg-accent cursor-pointer">
                  {uploadingPhoto ? "Uploading…" : "Upload Photo"}
                </span>
              </label>
            )}
            <Button variant="secondary" size="sm" onClick={() => setIsPasswordModalOpen(true)} className="cursor-pointer gap-1.5">
              <KeyRound className="h-3.5 w-3.5" />
              Change Password
            </Button>
            <Button size="sm" onClick={handleOpenEditModal} className="cursor-pointer gap-1.5">
              <Pencil className="h-3.5 w-3.5" />
              Edit Details
            </Button>
          </div>
        </div>
        {isLive && liveMeta && (
          <div className="mt-5 pt-4 border-t border-border flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="rounded-lg bg-muted px-2.5 py-1 font-mono font-semibold">
                ID: {liveMeta.iamTalentoId}
              </span>
              <span className="inline-flex items-center gap-2 rounded-lg bg-primary/10 text-primary px-2.5 py-1 font-semibold">
                Referral Code: <strong className="font-mono">{liveMeta.referralCode}</strong>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(liveMeta.referralCode);
                      setCopiedRef(true);
                      setTimeout(() => setCopiedRef(false), 1800);
                    } catch { /* ignore */ }
                  }}
                  className="inline-flex items-center gap-1 underline"
                >
                  {copiedRef ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copiedRef ? "Copied" : "Copy"}
                </button>
              </span>
            </div>
            {!liveMeta.referralClaimed ? (
              <form onSubmit={handleClaimReferral} method="post" className="flex items-center gap-2">
                <Label htmlFor="claim-referral-input" className="sr-only">
                  Friend referral code
                </Label>
                <Input
                  id="claim-referral-input"
                  name="referral_code"
                  value={referralInput}
                  onChange={(e) => setReferralInput(e.target.value.toUpperCase())}
                  placeholder="Enter friend's referral code"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  maxLength={20}
                  className="h-8 w-48 text-xs font-mono uppercase"
                />
                <Button type="submit" size="sm" variant="outline" disabled={claimingRef} className="h-8 text-xs">
                  {claimingRef ? "Saving…" : "Apply Referral"}
                </Button>
              </form>
            ) : (
              <span className="text-xs font-semibold text-emerald-600 inline-flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Referral linked (₹100 unlocks on first ≥ ₹99 purchase)
              </span>
            )}
          </div>
        )}
      </div>

      {/* TABS NAVIGATION */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md h-10 mb-6">
          <TabsTrigger value="info" className="cursor-pointer text-xs sm:text-sm gap-1.5">
            <UserRound className="h-3.5 w-3.5" />
            Account Info
          </TabsTrigger>
          <TabsTrigger value="security" className="cursor-pointer text-xs sm:text-sm gap-1.5">
            <Shield className="h-3.5 w-3.5" />
            Security & 2FA
          </TabsTrigger>
          <TabsTrigger value="settings" className="cursor-pointer text-xs sm:text-sm gap-1.5">
            <Sliders className="h-3.5 w-3.5" />
            Basic Settings
          </TabsTrigger>
        </TabsList>

        {/* ================= TAB 1: ACCOUNT INFO ================= */}
        <TabsContent value="info" className="space-y-6 mt-0">
          <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            {/* Left Column: Account Details Grid */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h3 className="text-base font-bold text-foreground">Contact & Identity Details</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Your primary contact information visible to verified hiring partners.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleOpenEditModal} className="cursor-pointer gap-1.5">
                  <Pencil className="h-3.5 w-3.5 text-primary" />
                  Edit
                </Button>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="p-3.5 rounded-lg border border-border/70 bg-muted/20">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1">
                    <UserRound className="h-3.5 w-3.5 text-primary" />
                    Account Full Name
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">{user.name}</span>
                    <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">Active</Badge>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg border border-border/70 bg-muted/20">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1">
                    <Mail className="h-3.5 w-3.5 text-primary" />
                    Email ID (Mail id)
                  </span>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-sm font-semibold text-foreground truncate">{user.email}</span>
                    <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/30 shrink-0">Verified</Badge>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg border border-border/70 bg-muted/20">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1">
                    <Phone className="h-3.5 w-3.5 text-primary" />
                    Mobile Number
                  </span>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-sm font-semibold text-foreground">{user.phone || user.ph || "+91 98765 43210"}</span>
                    <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/30 shrink-0">Verified</Badge>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg border border-border/70 bg-muted/20">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    Current Location
                  </span>
                  <span className="text-sm font-semibold text-foreground">{user.city || "Bengaluru, India"}</span>
                </div>

                <div className="p-3.5 rounded-lg border border-border/70 bg-muted/20 sm:col-span-2">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1">
                    <Briefcase className="h-3.5 w-3.5 text-primary" />
                    Designation & Professional Headline
                  </span>
                  <span className="text-sm font-semibold text-foreground">{user.head || "Frontend Developer · React · 2.5 yrs"}</span>
                </div>
              </div>

              {/* Quick Actions Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  Email & Mobile numbers are verified for direct recruiter outreach.
                </div>
                <Button variant="outline" size="sm" onClick={() => onNavigate("profile")} className="cursor-pointer gap-1.5">
                  Candidate Profile & Skills
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Right Column: Career Overview & Actions */}
            <div className="space-y-6">
              <aside className="rounded-xl border border-border bg-card p-6 shadow-xs">
                <div className="workspace-section-title mb-4">
                  <span className="workspace-icon">
                    <ShieldCheck />
                  </span>
                  <div>
                    <h2 className="text-sm font-bold text-foreground">Career Overview</h2>
                    <p className="text-xs text-muted-foreground">Your job applications and assessment status.</p>
                  </div>
                </div>

                <div className="divide-y divide-border">
                  {[
                    {
                      label: "Applications submitted",
                      value: myApps.length,
                      icon: FileText,
                      target: "applied" as ProView,
                    },
                    {
                      label: "Interview invitations",
                      value: myInterviews.length,
                      icon: Briefcase,
                      target: "applied" as ProView,
                    },
                    {
                      label: "Verified assessments",
                      value: 4,
                      icon: GraduationCap,
                      target: "cert" as ProView,
                    },
                  ].map(({ label, value, icon: Icon, target }) => (
                    <Button
                      variant="ghost"
                      key={label}
                      onClick={() => onNavigate(target)}
                      className="flex h-14 w-full justify-between items-center rounded-none px-1 cursor-pointer hover:bg-muted/40"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="text-primary h-4 w-4" />
                        <span className="text-xs font-medium text-foreground">{label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <strong className="text-base text-foreground">{value}</strong>
                        <ArrowRight className="text-muted-foreground h-3.5 w-3.5" />
                      </div>
                    </Button>
                  ))}
                </div>

                <Button className="mt-5 w-full cursor-pointer gap-2" onClick={() => onNavigate("resume")}>
                  <Sparkles className="h-4 w-4" />
                  AI Resume Builder
                </Button>
              </aside>
            </div>
          </div>
        </TabsContent>

        {/* ================= TAB 2: SECURITY & 2-STEP VERIFICATION ================= */}
        <TabsContent value="security" className="space-y-6 mt-0">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            {/* Left: 2-Step Verification and Password */}
            <div className="space-y-6">
              {/* 2-STEP VERIFICATION CARD */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
                      <Shield className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-foreground">Two-Step Verification (2FA)</h3>
                        {user.twoFactor ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs">
                            Active & Protecting
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground text-xs">
                            Not Configured
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Add an extra layer of defense to keep your candidate profile and salary disclosures secure.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Label htmlFor="twofactor-toggle" className="text-xs font-semibold cursor-pointer">
                      {user.twoFactor ? "Enabled" : "Disabled"}
                    </Label>
                    <Switch
                      id="twofactor-toggle"
                      checked={Boolean(user.twoFactor)}
                      onCheckedChange={handleToggle2FA}
                      className="cursor-pointer"
                    />
                  </div>
                </div>

                {user.twoFactor ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20 flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                      <div className="text-xs space-y-1">
                        <strong className="text-foreground font-semibold">2FA is currently active</strong>
                        <p className="text-muted-foreground">
                          Method: {user.twoFactorMethod === "sms" ? `SMS Verification (${user.phone || user.ph || "+91 98765 43210"})` : "Authenticator App (TOTP · Google/Microsoft)"}
                        </p>
                        <p className="text-muted-foreground">Each new login from unknown browsers requires a one-time verification token.</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2.5 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setTwoFactorStep("recovery");
                          setIs2FAModalOpen(true);
                        }}
                        className="cursor-pointer gap-1.5 text-xs"
                      >
                        <KeyRound className="h-3.5 w-3.5 text-primary" />
                        View Recovery Backup Codes
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggle2FA(false)}
                        className="cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10 text-xs"
                      >
                        Turn Off 2FA
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      When two-step verification is enabled, entering your password will be followed by a unique 6-digit passcode sent to your phone or authenticator app.
                    </p>
                    <Button onClick={() => handleToggle2FA(true)} className="cursor-pointer gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      Enable 2-Step Verification Now
                    </Button>
                  </div>
                )}
              </div>

              {/* CHANGE PASSWORD CARD */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
                      <Lock className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground">Password & Credentials</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Last changed: {user.passwordLastChanged ? new Date(user.passwordLastChanged).toLocaleDateString() : "3 weeks ago"}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setIsPasswordModalOpen(true)} className="cursor-pointer gap-1.5">
                    <KeyRound className="h-3.5 w-3.5 text-primary" />
                    Change Password
                  </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 text-xs">
                  <div className="p-3 rounded-lg border border-border/70 bg-muted/20">
                    <span className="text-muted-foreground block mb-1">Current Password Status</span>
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      Protected & Encrypted (SHA-256)
                    </span>
                  </div>
                  <div className="p-3 rounded-lg border border-border/70 bg-muted/20">
                    <span className="text-muted-foreground block mb-1">Session Security</span>
                    <span className="font-semibold text-foreground">Active single-device authentication</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Active Sessions & Login Alerts */}
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                  <Laptop className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">Active Browser Sessions</h3>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 flex items-start justify-between gap-2">
                    <div className="space-y-0.5 text-xs">
                      <div className="flex items-center gap-1.5 font-semibold text-foreground">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Windows 11 · Chrome (This Device)
                      </div>
                      <p className="text-muted-foreground">Bengaluru, India · Active now</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30">Current</Badge>
                  </div>

                  {!sessionsSignedOut && (
                    <div className="p-3 rounded-lg border border-border bg-muted/20 flex items-start justify-between gap-2">
                      <div className="space-y-0.5 text-xs">
                        <div className="font-medium text-foreground">iPhone 15 · Safari Mobile</div>
                        <p className="text-muted-foreground">Chennai, India · 2 days ago</p>
                      </div>
                      <Badge variant="outline" className="text-[10px] text-muted-foreground">Saved</Badge>
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSessionsSignedOut(true);
                    onToast?.("All other sessions have been signed out.");
                  }}
                  disabled={sessionsSignedOut}
                  className="w-full cursor-pointer text-xs gap-1.5 text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  {sessionsSignedOut ? "Other Sessions Signed Out" : "Sign Out All Other Sessions"}
                </Button>
              </div>

              {/* Login Alerts Switch */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-xs flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Bell className="h-3.5 w-3.5 text-primary" />
                    Security & Login Alerts
                  </span>
                  <p className="text-[11px] text-muted-foreground">Notify when a new login occurs from an unrecognized device.</p>
                </div>
                <Switch
                  checked={loginAlerts}
                  onCheckedChange={(c) => handleSaveSettings(privacyVisibility, emailAlerts, smsAlerts, marketingEmails, c)}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ================= TAB 3: BASIC SETTINGS ================= */}
        <TabsContent value="settings" className="space-y-6 mt-0">
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            {/* Left: Preferences & Notifications */}
            <div className="space-y-6">
              {/* Privacy and Visibility */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
                <div className="border-b border-border pb-3">
                  <h3 className="text-base font-bold text-foreground">Candidate Profile Visibility</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Control who can discover your candidate profile and reach out with career opportunities.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: "public" as const,
                      title: "Public to Verified Recruiters (Recommended)",
                      desc: "Visible in talent search. High priority for direct interview invitations.",
                    },
                    {
                      id: "applied_only" as const,
                      title: "Visible Only to Applied Companies",
                      desc: "Only companies where you explicitly submitted applications can review your credentials.",
                    },
                    {
                      id: "private" as const,
                      title: "Private / Not Actively Looking",
                      desc: "Hide your profile from search completely. Retain access to tests and certifications.",
                    },
                  ].map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-colors ${
                        privacyVisibility === option.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/30"
                      }`}
                    >
                      <input
                        type="radio"
                        name="privacyVisibility"
                        value={option.id}
                        checked={privacyVisibility === option.id}
                        onChange={() =>
                          handleSaveSettings(option.id, emailAlerts, smsAlerts, marketingEmails, loginAlerts)
                        }
                        className="mt-1 text-primary focus:ring-primary h-4 w-4"
                      />
                      <div className="space-y-0.5 text-xs">
                        <strong className="text-foreground font-semibold block">{option.title}</strong>
                        <p className="text-muted-foreground">{option.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
                <div className="border-b border-border pb-3">
                  <h3 className="text-base font-bold text-foreground">Communication & Notification Preferences</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Choose how and when Talento Pro alerts you about job applications and test results.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-0.5 text-xs">
                      <strong className="text-foreground font-semibold block">Email Job Alerts & SLA Updates</strong>
                      <p className="text-muted-foreground">Receive instant alerts when 24h review SLA milestones trigger.</p>
                    </div>
                    <Switch
                      checked={emailAlerts}
                      onCheckedChange={(c) =>
                        handleSaveSettings(privacyVisibility, c, smsAlerts, marketingEmails, loginAlerts)
                      }
                      className="cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-border pt-3">
                    <div className="space-y-0.5 text-xs">
                      <strong className="text-foreground font-semibold block">SMS & WhatsApp Interview Notifications</strong>
                      <p className="text-muted-foreground">Receive interview scheduling links directly on {user.phone || user.ph || "+91 98765 43210"}.</p>
                    </div>
                    <Switch
                      checked={smsAlerts}
                      onCheckedChange={(c) =>
                        handleSaveSettings(privacyVisibility, emailAlerts, c, marketingEmails, loginAlerts)
                      }
                      className="cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-border pt-3">
                    <div className="space-y-0.5 text-xs">
                      <strong className="text-foreground font-semibold block">Weekly Career Insights & Mentor Invites</strong>
                      <p className="text-muted-foreground">Curated salary benchmarks, assessment challenges, and tech webinars.</p>
                    </div>
                    <Switch
                      checked={marketingEmails}
                      onCheckedChange={(c) =>
                        handleSaveSettings(privacyVisibility, emailAlerts, smsAlerts, c, loginAlerts)
                      }
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Data Export & Account Closure */}
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
                <div className="border-b border-border pb-3">
                  <h3 className="text-sm font-bold text-foreground">Account Data & Export</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Download an archive of your profile, verified test scores, and application records.
                  </p>
                </div>

                <p className="text-xs text-muted-foreground">
                  Your data is protected under GDPR and IT Act standards. You can export your data at any time in machine-readable JSON format.
                </p>

                <Button variant="outline" size="sm" onClick={handleDownloadData} className="w-full cursor-pointer gap-2 text-xs">
                  <Download className="h-3.5 w-3.5 text-primary" />
                  Download My Account Data
                </Button>
              </div>

              {/* Support & Assistance */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-foreground">Need Assistance?</h3>
                <p className="text-xs text-muted-foreground">
                  Have questions about your verification badge, assessment retakes, or account settings?
                </p>
                <Button variant="secondary" size="sm" onClick={() => onNavigate("support")} className="w-full cursor-pointer text-xs">
                  Contact Support Center
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* ================= EDIT ACCOUNT INFO DIALOG ================= */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleSaveAccountInfo}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Pencil className="h-4 w-4 text-primary" />
                Edit Account Information
              </DialogTitle>
              <DialogDescription>
                Update your primary contact email address, mobile number, and personal details.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {editError && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {editError}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="edit-name" className="text-xs font-semibold">
                  Account Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-name"
                  value={editForm.name}
                  onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Yogesh Sharma"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-email" className="text-xs font-semibold flex items-center justify-between">
                  <span>Mail ID (Email Address) <span className="text-destructive">*</span></span>
                  <span className="text-[11px] text-muted-foreground">Primary login & communications</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
                    placeholder="name@example.com"
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-phone" className="text-xs font-semibold flex items-center justify-between">
                  <span>Mobile Number <span className="text-destructive">*</span></span>
                  <span className="text-[11px] text-muted-foreground">Used for SMS & 2FA</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-phone"
                    value={editForm.phone}
                    onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-city" className="text-xs font-semibold">
                    Location / City
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="edit-city"
                      value={editForm.city}
                      onChange={(e) => setEditForm((p) => ({ ...p, city: e.target.value }))}
                      placeholder="Bengaluru"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-head" className="text-xs font-semibold">
                    Current Designation
                  </Label>
                  <Input
                    id="edit-head"
                    value={editForm.head}
                    onChange={(e) => setEditForm((p) => ({ ...p, head: e.target.value }))}
                    placeholder="Frontend Developer"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="cursor-pointer">
                Save Account Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================= CHANGE PASSWORD DIALOG ================= */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSavePassword}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-primary" />
                Change Password
              </DialogTitle>
              <DialogDescription>
                Create a strong, unique password with at least 8 characters to secure your account.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {pwError && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {pwError}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="current-pw" className="text-xs font-semibold">
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    id="current-pw"
                    type={showCurrentPw ? "text" : "password"}
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    placeholder="Enter existing password"
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPw(!showCurrentPw)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="new-pw" className="text-xs font-semibold">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="new-pw"
                    type={showNewPw ? "text" : "password"}
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    placeholder="At least 8 characters"
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw(!showNewPw)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {newPw && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">Password strength:</span>
                      <span
                        className={
                          pwStrength <= 1
                            ? "text-destructive font-semibold"
                            : pwStrength === 2
                            ? "text-amber-500 font-semibold"
                            : "text-emerald-500 font-semibold"
                        }
                      >
                        {pwStrength <= 1 ? "Weak" : pwStrength <= 3 ? "Good" : "Strong"}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 h-1.5 rounded-full overflow-hidden bg-muted">
                      <div className={`h-full ${pwStrength >= 1 ? (pwStrength === 1 ? "bg-destructive" : "bg-primary") : "bg-transparent"}`} />
                      <div className={`h-full ${pwStrength >= 2 ? (pwStrength === 2 ? "bg-amber-500" : "bg-primary") : "bg-transparent"}`} />
                      <div className={`h-full ${pwStrength >= 3 ? "bg-emerald-500" : "bg-transparent"}`} />
                      <div className={`h-full ${pwStrength >= 4 ? "bg-emerald-600" : "bg-transparent"}`} />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirm-pw" className="text-xs font-semibold">
                  Confirm New Password
                </Label>
                <Input
                  id="confirm-pw"
                  type="password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  placeholder="Re-type new password"
                  required
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setIsPasswordModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="cursor-pointer">
                Update Password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================= TWO-FACTOR SETUP DIALOG ================= */}
      <Dialog open={is2FAModalOpen} onOpenChange={setIs2FAModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Two-Step Verification (2FA)
            </DialogTitle>
            <DialogDescription>
              {twoFactorStep === "recovery"
                ? "Save your backup codes in a safe place."
                : "Protect your account with a secondary verification step."}
            </DialogDescription>
          </DialogHeader>

          {twoFactorStep === "configure" && (
            <div className="space-y-4 py-3">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Choose Verification Method</Label>
                <div className="grid grid-cols-2 gap-2.5">
                  <div
                    onClick={() => setTwoFactorMethod("authenticator")}
                    className={`p-3 rounded-lg border cursor-pointer text-xs space-y-1 transition-colors ${
                      twoFactorMethod === "authenticator" ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <Smartphone className="h-4 w-4 text-primary" />
                    <strong className="block text-foreground">Authenticator App</strong>
                    <p className="text-[11px] text-muted-foreground">Google Authenticator, Authy, Microsoft</p>
                  </div>

                  <div
                    onClick={() => setTwoFactorMethod("sms")}
                    className={`p-3 rounded-lg border cursor-pointer text-xs space-y-1 transition-colors ${
                      twoFactorMethod === "sms" ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <Phone className="h-4 w-4 text-primary" />
                    <strong className="block text-foreground">SMS OTP</strong>
                    <p className="text-[11px] text-muted-foreground">Codes sent to {user.phone || user.ph || "+91 98765 43210"}</p>
                  </div>
                </div>
              </div>

              {twoFactorMethod === "authenticator" ? (
                <div className="p-4 rounded-lg bg-muted/40 border border-border space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-background rounded-lg border border-border shrink-0 flex items-center justify-center">
                      <QrCode className="h-12 w-12 text-foreground" />
                    </div>
                    <div className="text-xs space-y-1">
                      <strong className="text-foreground">Scan QR or enter key</strong>
                      <p className="text-muted-foreground">Open your authenticator app and scan this QR code or copy key:</p>
                      <div className="flex items-center gap-1.5 font-mono text-[11px] bg-background p-1.5 rounded border border-border">
                        <span className="truncate">{secretAuthKey}</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(secretAuthKey);
                            setCopiedKey(true);
                            setTimeout(() => setCopiedKey(false), 2000);
                          }}
                          className="text-primary hover:text-primary/80 shrink-0 cursor-pointer ml-auto"
                        >
                          {copiedKey ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-lg bg-muted/40 border border-border text-xs space-y-1.5">
                  <strong className="text-foreground">Verify mobile number</strong>
                  <p className="text-muted-foreground">
                    A test verification token will be sent to <strong>{user.phone || user.ph || "+91 98765 43210"}</strong>.
                  </p>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="2fa-otp" className="text-xs font-semibold flex items-center justify-between">
                  <span>Enter 6-Digit Passcode</span>
                  <span className="text-[11px] text-muted-foreground">e.g. 492817</span>
                </Label>
                <Input
                  id="2fa-otp"
                  maxLength={6}
                  value={twoFactorOtp}
                  onChange={(e) => setTwoFactorOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="font-mono tracking-widest text-center text-lg"
                />
              </div>

              <DialogFooter className="gap-2 sm:gap-0 pt-2">
                <Button type="button" variant="outline" onClick={() => setIs2FAModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleVerify2FA} className="cursor-pointer">
                  Verify & Enable 2FA
                </Button>
              </DialogFooter>
            </div>
          )}

          {twoFactorStep === "recovery" && (
            <div className="space-y-4 py-3">
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                2-Step Verification is active and protecting your account!
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">One-Time Backup Recovery Codes</Label>
                <p className="text-[11px] text-muted-foreground">
                  If you lose access to your phone or authenticator app, use these codes to regain access. Each code can be used once.
                </p>
                <div className="grid grid-cols-2 gap-2 bg-muted/40 p-3 rounded-lg border border-border font-mono text-xs text-center">
                  {backupCodes.map((code) => (
                    <div key={code} className="bg-background py-1.5 rounded border border-border/60">
                      {code}
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(backupCodes.join("\n"));
                  setCopiedCodes(true);
                  setTimeout(() => setCopiedCodes(false), 2000);
                  onToast?.("Backup recovery codes copied to clipboard.");
                }}
                className="w-full cursor-pointer gap-2 text-xs"
              >
                {copiedCodes ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedCodes ? "Codes Copied!" : "Copy All Recovery Codes"}
              </Button>

              <DialogFooter className="pt-2">
                <Button onClick={() => setIs2FAModalOpen(false)} className="w-full cursor-pointer">
                  Done & Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
