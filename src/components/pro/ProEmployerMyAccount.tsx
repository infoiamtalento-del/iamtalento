import { useState } from "react";
import {
  UserRound,
  Building2,
  BriefcaseBusiness,
  Users,
  CalendarDays,
  ArrowRight,
  Mail,
  MapPin,
  ShieldCheck,
  Phone,
  Pencil,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  Shield,
  Smartphone,
  Check,
  Copy,
  QrCode,
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
import { type ProUser, type ProJob, type ProApplication } from "@/data/proData";
import { getCandidatePhoto } from "@/data/portalAssets";
import type { ProView } from "./proTypes";
import "./employer-workspace.css";

interface Props {
  user: ProUser;
  jobs: ProJob[];
  applications: ProApplication[];
  onNavigate: (view: ProView) => void;
  onUpdateUser?: (updated: ProUser) => void;
  onToast?: (msg: string) => void;
}

export function ProEmployerMyAccount({
  user,
  jobs,
  applications,
  onNavigate,
  onUpdateUser,
  onToast,
}: Props) {
  const myJobs = jobs.filter((j) => j.by === user.email);
  const apps = applications.filter((a) => myJobs.some((j) => j.id === a.jid));

  // Edit Account Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || user.ph || "+91 98450 12345",
    companyName: user.cp?.name || user.name || "Super30 Technologies",
    hq: user.cp?.hq || "Bengaluru",
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
  const [copiedKey, setCopiedKey] = useState(false);
  const secretAuthKey = "SUPER30-REC-9482-K839";

  const handleOpenEditModal = () => {
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || user.ph || "+91 98450 12345",
      companyName: user.cp?.name || user.name || "Super30 Technologies",
      hq: user.cp?.hq || "Bengaluru",
    });
    setEditError("");
    setIsEditModalOpen(true);
  };

  const handleSaveAccountInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.name.trim()) {
      setEditError("Name cannot be empty.");
      return;
    }
    if (!editForm.email.trim() || !editForm.email.includes("@")) {
      setEditError("Please enter a valid email address.");
      return;
    }

    const updated: ProUser = {
      ...user,
      name: editForm.name.trim(),
      email: editForm.email.trim(),
      phone: editForm.phone.trim(),
      ph: editForm.phone.trim(),
      cp: {
        ...(user.cp || {}),
        name: editForm.companyName.trim(),
        hq: editForm.hq.trim(),
      },
    };

    if (onUpdateUser) {
      onUpdateUser(updated);
    }
    setIsEditModalOpen(false);
    onToast?.("Employer account details updated successfully!");
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPw) {
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

    const updated: ProUser = {
      ...user,
      pw: newPw,
      passwordLastChanged: Date.now(),
    };

    if (onUpdateUser) {
      onUpdateUser(updated);
    }

    setIsPasswordModalOpen(false);
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
    setPwError("");
    onToast?.("Password changed successfully!");
  };

  const handleToggle2FA = (checked: boolean) => {
    if (checked) {
      setTwoFactorOtp("");
      setIs2FAModalOpen(true);
    } else {
      const updated: ProUser = {
        ...user,
        twoFactor: false,
      };
      if (onUpdateUser) onUpdateUser(updated);
      onToast?.("2-Step Verification disabled.");
    }
  };

  const handleVerify2FA = () => {
    if (twoFactorOtp.trim().length < 6) {
      onToast?.("Please enter the 6-digit verification code.");
      return;
    }
    const updated: ProUser = {
      ...user,
      twoFactor: true,
      twoFactorMethod,
    };
    if (onUpdateUser) onUpdateUser(updated);
    setIs2FAModalOpen(false);
    onToast?.("2-Step Verification enabled successfully!");
  };

  return (
    <div className="employer-workspace space-y-6">
      <header className="workspace-header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="workspace-eyebrow flex items-center gap-1.5">
            <UserRound size={14} className="text-primary" />
            Employer account · Company Admin
          </span>
          <h1 className="workspace-heading text-2xl font-bold">My Account</h1>
          <p className="workspace-description text-sm text-muted-foreground">
            Your company profile, recruiter credentials, hiring activity, and account security.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={handleOpenEditModal} className="cursor-pointer gap-1.5">
            <Pencil className="h-4 w-4 text-primary" />
            Edit Account Info
          </Button>
          <Button onClick={() => onNavigate("cp")} className="cursor-pointer gap-1.5">
            <Building2 className="h-4 w-4" />
            Company Profile
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-5">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center border-2 border-primary/20 shrink-0 overflow-hidden shadow-xs">
                <img
                  src={user.avatar || getCandidatePhoto(user.name)}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
                <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                  Employer Admin · Verified Hiring Partner
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleOpenEditModal} className="cursor-pointer gap-1.5">
              <Pencil className="h-3.5 w-3.5 text-primary" />
              Edit
            </Button>
          </div>

          <h3 className="text-sm font-bold text-foreground">Account Information</h3>
          <dl className="grid gap-4 sm:grid-cols-2 text-xs">
            <div className="p-3.5 rounded-lg border border-border/70 bg-muted/20">
              <dt className="mb-1 flex items-center gap-1.5 font-medium text-muted-foreground">
                <UserRound size={14} className="text-primary" />
                Account Admin Name
              </dt>
              <dd className="font-semibold text-sm text-foreground">{user.name}</dd>
            </div>

            <div className="p-3.5 rounded-lg border border-border/70 bg-muted/20">
              <dt className="mb-1 flex items-center gap-1.5 font-medium text-muted-foreground">
                <Mail size={14} className="text-primary" />
                Email ID (Mail id)
              </dt>
              <dd className="font-semibold text-sm text-foreground truncate">{user.email}</dd>
            </div>

            <div className="p-3.5 rounded-lg border border-border/70 bg-muted/20">
              <dt className="mb-1 flex items-center gap-1.5 font-medium text-muted-foreground">
                <Phone size={14} className="text-primary" />
                Mobile Number
              </dt>
              <dd className="font-semibold text-sm text-foreground">{user.phone || user.ph || "+91 98450 12345"}</dd>
            </div>

            <div className="p-3.5 rounded-lg border border-border/70 bg-muted/20">
              <dt className="mb-1 flex items-center gap-1.5 font-medium text-muted-foreground">
                <Building2 size={14} className="text-primary" />
                Company
              </dt>
              <dd className="font-semibold text-sm text-foreground">{user.cp?.name || user.name}</dd>
            </div>

            <div className="p-3.5 rounded-lg border border-border/70 bg-muted/20 sm:col-span-2">
              <dt className="mb-1 flex items-center gap-1.5 font-medium text-muted-foreground">
                <MapPin size={14} className="text-primary" />
                Headquarters
              </dt>
              <dd className="font-semibold text-sm text-foreground">{user.cp?.hq || "Bengaluru, India"}</dd>
            </div>
          </dl>

          {/* Security & 2FA Quick Section */}
          <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold text-foreground">2-Step Verification (2FA)</span>
                {user.twoFactor ? (
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[10px]">Active</Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px]">Disabled</Badge>
                )}
              </div>
              <Switch checked={Boolean(user.twoFactor)} onCheckedChange={handleToggle2FA} className="cursor-pointer" />
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-muted-foreground">Password protection & credentials</span>
              <Button variant="secondary" size="sm" onClick={() => setIsPasswordModalOpen(true)} className="cursor-pointer text-xs gap-1.5">
                <KeyRound className="h-3.5 w-3.5" />
                Change Password
              </Button>
            </div>
          </div>

          <div className="border-t border-border pt-4 flex items-center justify-between">
            <Button variant="outline" onClick={() => onNavigate("cp")} className="cursor-pointer text-xs">
              Manage Company Profile
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </section>

        <aside className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-5">
          <div className="workspace-section-title mb-4">
            <span className="workspace-icon">
              <ShieldCheck />
            </span>
            <div>
              <h2 className="text-sm font-bold text-foreground">Hiring Workspace Overview</h2>
              <p className="text-xs text-muted-foreground">Your active job listings and pipeline stats.</p>
            </div>
          </div>

          <div className="divide-y divide-border">
            {[
              {
                label: "Active job openings",
                value: myJobs.length,
                icon: BriefcaseBusiness,
                target: "dash" as ProView,
              },
              {
                label: "Candidate applications",
                value: apps.length,
                icon: Users,
                target: "pipe" as ProView,
              },
              {
                label: "Scheduled interviews",
                value: apps.filter((a) => a.st === "Interview").length,
                icon: CalendarDays,
                target: "interviews" as ProView,
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

          <Button className="mt-4 w-full cursor-pointer gap-2" onClick={() => onNavigate("post")}>
            <BriefcaseBusiness className="h-4 w-4" />
            Create a New Job Opening
          </Button>
        </aside>
      </div>

      <section className="rounded-xl border border-border bg-card p-5 shadow-xs flex flex-wrap items-center gap-4">
        <div className="mr-auto">
          <h2 className="text-sm font-bold text-foreground">Recruiter Preferences</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Manage hiring settings, notifications, and company billing.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => onNavigate("settings")} className="cursor-pointer text-xs">
          Hiring Settings
          <ArrowRight className="h-3.5 w-3.5 ml-1" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => onNavigate("support")} className="cursor-pointer text-xs">
          Contact Support
          <ArrowRight className="h-3.5 w-3.5 ml-1" />
        </Button>
      </section>

      {/* EDIT MODAL */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSaveAccountInfo}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Pencil className="h-4 w-4 text-primary" />
                Edit Employer Account Info
              </DialogTitle>
              <DialogDescription>
                Update your employer admin email, phone number, and company name.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4 text-xs">
              {editError && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {editError}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="emp-edit-name" className="text-xs font-semibold">Account Admin Name</Label>
                <Input
                  id="emp-edit-name"
                  value={editForm.name}
                  onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="emp-edit-email" className="text-xs font-semibold">Email ID (Mail id)</Label>
                <Input
                  id="emp-edit-email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="emp-edit-phone" className="text-xs font-semibold">Mobile Number</Label>
                <Input
                  id="emp-edit-phone"
                  value={editForm.phone}
                  onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="emp-edit-company" className="text-xs font-semibold">Company Name</Label>
                <Input
                  id="emp-edit-company"
                  value={editForm.companyName}
                  onChange={(e) => setEditForm((p) => ({ ...p, companyName: e.target.value }))}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="cursor-pointer">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* CHANGE PASSWORD MODAL */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSavePassword}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-primary" />
                Change Password
              </DialogTitle>
              <DialogDescription>
                Ensure your hiring organization account uses a secure password.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4 text-xs">
              {pwError && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {pwError}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="emp-curr-pw" className="text-xs font-semibold">Current Password</Label>
                <div className="relative">
                  <Input
                    id="emp-curr-pw"
                    type={showCurrentPw ? "text" : "password"}
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
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
                <Label htmlFor="emp-new-pw" className="text-xs font-semibold">New Password</Label>
                <div className="relative">
                  <Input
                    id="emp-new-pw"
                    type={showNewPw ? "text" : "password"}
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    placeholder="Min 8 characters"
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
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="emp-conf-pw" className="text-xs font-semibold">Confirm Password</Label>
                <Input
                  id="emp-conf-pw"
                  type="password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  required
                />
              </div>
            </div>

            <DialogFooter>
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

      {/* 2FA SETUP MODAL */}
      <Dialog open={is2FAModalOpen} onOpenChange={setIs2FAModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Two-Step Verification (2FA)
            </DialogTitle>
            <DialogDescription>
              Protect your employer workspace with two-factor authentication.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3 text-xs">
            <div className="p-4 rounded-lg bg-muted/40 border border-border space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-background rounded-lg border border-border shrink-0">
                  <QrCode className="h-10 w-10 text-foreground" />
                </div>
                <div className="space-y-1">
                  <strong className="text-foreground">Scan or copy secret key</strong>
                  <p className="text-muted-foreground text-[11px]">Use Google Authenticator or Duo Mobile.</p>
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

            <div className="space-y-1.5">
              <Label htmlFor="emp-2fa-otp" className="text-xs font-semibold">Enter 6-digit passcode</Label>
              <Input
                id="emp-2fa-otp"
                maxLength={6}
                value={twoFactorOtp}
                onChange={(e) => setTwoFactorOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="font-mono tracking-widest text-center text-lg"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIs2FAModalOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleVerify2FA} className="cursor-pointer">
              Enable 2FA
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
