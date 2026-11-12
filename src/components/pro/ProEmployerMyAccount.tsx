import React, { useCallback, useEffect, useRef, useState } from "react";
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
  Shield,
  Check,
  Copy,
  QrCode,
  Bell,
  Clock,
  Globe,
  MonitorSmartphone,
  Download,
  Trash2,
  LogOut,
  UserPlus,
  Layers,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { db, rpc } from "@/services/db";
import {
  getEmployerSettings,
  saveEmployerSettings,
  type EmployerSettings,
} from "@/services/employer/ats";
import { getEmployerProfile, saveEmployerProfile } from "@/services/employer/profile";
import { type ProUser, type ProJob, type ProApplication } from "@/data/proData";
import { INITIAL_EMPLOYER_DEMO, type EmployerDemoState } from "@/data/employerDemo";
import { getCandidatePhoto } from "@/data/portalAssets";
import type { ProView } from "./proTypes";
import "./employer-workspace.css";

export type EmployerAccountTab = "profile" | "security" | "preferences";

interface AuthEvent {
  id: string;
  kind: string;
  created_at: string;
  ua: string | null;
}

const EVENT_LABEL: Record<string, string> = {
  login: "Signed in",
  login_new_device: "Signed in from a new device",
  password_changed: "Password changed",
  mfa_enrolled: "Two-step verification enabled",
  mfa_removed: "Two-step verification removed",
  email_changed: "Email changed",
  session_revoked: "Other sessions signed out",
  account_deletion_requested: "Account deletion requested",
};

const DEFAULT_SECURITY = {
  twoStep: true,
  pwAt: Date.now() - 86400000 * 36,
  sessions: [
    { id: 1, device: "Chrome · Windows (this device)", at: Date.now() },
    { id: 2, device: "Safari · iPhone", at: Date.now() - 3600000 * 5 },
  ],
  team: 4,
};

const fmtDate = (ts: number) =>
  new Date(ts).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const fmtDateTimeStr = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

interface Props {
  user: ProUser;
  jobs: ProJob[];
  applications: ProApplication[];
  state?: EmployerDemoState;
  onChange?: (next: EmployerDemoState) => void;
  isLive?: boolean;
  initialTab?: EmployerAccountTab;
  onNavigate: (view: ProView, query?: Record<string, string>) => void;
  onUpdateUser?: (updated: ProUser) => void;
  onToast?: (msg: string) => void;
  onSignedOut?: () => void;
}

const TABS: Array<{ id: EmployerAccountTab; label: string; icon: typeof UserRound }> = [
  { id: "profile", label: "Account & Organization", icon: UserRound },
  { id: "security", label: "Security & Access", icon: ShieldCheck },
  { id: "preferences", label: "Notifications & Privacy", icon: Bell },
];

export function ProEmployerMyAccount({
  user,
  jobs,
  applications,
  state,
  onChange,
  isLive = false,
  initialTab = "profile",
  onNavigate,
  onUpdateUser,
  onToast,
  onSignedOut,
}: Props) {
  const demoState = state ?? INITIAL_EMPLOYER_DEMO;
  const sec = demoState.security ?? DEFAULT_SECURITY;
  const cp = user.cp || {};

  const [activeTab, setActiveTab] = useState<EmployerAccountTab>(initialTab);
  const tabRefs = useRef<Record<EmployerAccountTab, HTMLButtonElement | null>>({
    profile: null,
    security: null,
    preferences: null,
  });

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const myJobs = jobs.filter((j) => j.by === user.email);
  const apps = applications.filter((a) => myJobs.some((j) => j.id === a.jid));
  const interviewCount = apps.filter((a) => a.st === "Interview").length;

  // Live backend settings state (populated when isLive === true)
  const [liveSettings, setLiveSettings] = useState<EmployerSettings | null>(null);
  const [liveEmail, setLiveEmail] = useState(user.email || "");
  const [liveEmailVerified, setLiveEmailVerified] = useState(true);
  const [authEvents, setAuthEvents] = useState<AuthEvent[]>([]);
  const [newEmailInput, setNewEmailInput] = useState("");
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [deletionRequested, setDeletionRequested] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  // Local follow-up & privacy state for demo mode (synced with liveSettings when live)
  const [demoFollowups, setDemoFollowups] = useState({
    enabled: true,
    pendingDays: 3,
    shortlistDays: 5,
    holdDays: 14,
  });
  const [demoPrivacy, setDemoPrivacy] = useState({
    showContactPublic: false,
    showHiringActivity: true,
  });
  const [demoNotifyExtra, setDemoNotifyExtra] = useState({
    followups: true,
    status: demoState.preferences?.status ?? true,
  });

  // Inline organization edit state
  const [editingOrg, setEditingOrg] = useState(false);
  const [orgForm, setOrgForm] = useState({
    name: cp.name || user.name || "Super30 Technologies",
    ind: cp.ind || "Information Technology",
    size: cp.size || "51–200 employees",
    site: cp.site || "https://super30.tech",
    hq: cp.hq || "Bengaluru, India",
  });

  // Edit Account Info Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name || "",
    email: user.pemail || user.email || "",
    phone: user.phone || user.ph || "+91 98450 12345",
    companyName: cp.name || user.name || "Super30 Technologies",
    hq: cp.hq || "Bengaluru, India",
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
  const [twoFactorOtp, setTwoFactorOtp] = useState("");
  const [copiedKey, setCopiedKey] = useState(false);
  const secretAuthKey = "SUPER30-REC-9482-K839";

  // Team invite input
  const [inviteEmail, setInviteEmail] = useState("");

  const loadLiveAccount = useCallback(async () => {
    if (!isLive) return;
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user?.email) {
        setLiveEmail(userData.user.email);
      }
      setLiveEmailVerified(Boolean(userData.user?.email_confirmed_at ?? true));
      const [s, profile, ev, me] = await Promise.all([
        getEmployerSettings(),
        getEmployerProfile(),
        db
          .from("auth_events")
          .select("id, kind, created_at, ua")
          .order("created_at", { ascending: false })
          .limit(6),
        db
          .from("profiles")
          .select("deletion_requested_at")
          .eq("id", userData.user?.id ?? "")
          .maybeSingle(),
      ]);
      setLiveSettings(s);
      if (profile) {
        setOrgForm({
          name: profile.company_name || cp.name || user.name,
          ind: profile.industry || cp.ind || "",
          size: profile.num_employees || cp.size || "",
          site: profile.website || cp.site || "",
          hq: profile.hq_city || profile.address || cp.hq || "",
        });
      }
      setAuthEvents((ev.data ?? []) as AuthEvent[]);
      setDeletionRequested(Boolean(me.data?.deletion_requested_at));
    } catch {
      /* fallback cleanly to local user props if backend query fails */
    }
  }, [isLive, cp.hq, cp.ind, cp.name, cp.site, cp.size, user.name]);

  useEffect(() => {
    void loadLiveAccount();
  }, [loadLiveAccount]);

  const updateDemoSec = (nextSec: typeof sec, toastMsg?: string) => {
    onChange?.({ ...demoState, security: nextSec });
    if (toastMsg) onToast?.(toastMsg);
  };

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const idx = TABS.findIndex((t) => t.id === activeTab);
    if (idx === -1) return;
    let nextIdx = idx;
    if (event.key === "ArrowRight") {
      nextIdx = (idx + 1) % TABS.length;
    } else if (event.key === "ArrowLeft") {
      nextIdx = (idx - 1 + TABS.length) % TABS.length;
    } else if (event.key === "Home") {
      nextIdx = 0;
    } else if (event.key === "End") {
      nextIdx = TABS.length - 1;
    } else {
      return;
    }
    event.preventDefault();
    const nextTab = TABS[nextIdx].id;
    setActiveTab(nextTab);
    tabRefs.current[nextTab]?.focus();
  };

  const handleOpenEditModal = () => {
    setEditForm({
      name: user.name || "",
      email: isLive ? liveEmail : user.pemail || user.email || "",
      phone: user.phone || user.ph || "+91 98450 12345",
      companyName: cp.name || user.name || "Super30 Technologies",
      hq: cp.hq || "Bengaluru, India",
    });
    setEditError("");
    setIsEditModalOpen(true);
  };

  const handleSaveAccountInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.name.trim()) {
      setEditError("Account admin name cannot be empty.");
      return;
    }
    if (!editForm.email.trim() || !/^\S+@\S+\.\S+$/.test(editForm.email.trim())) {
      setEditError("Please enter a valid work email address.");
      return;
    }

    const prevPhone = user.phone || user.ph || "";
    const phoneChanged = editForm.phone.trim() !== prevPhone;

    const updated: ProUser = {
      ...user,
      name: editForm.name.trim(),
      email: isLive ? user.email : editForm.email.trim(),
      pemail: editForm.email.trim(),
      phone: editForm.phone.trim(),
      ph: editForm.phone.trim(),
      phv: phoneChanged ? false : user.phv ?? true,
      cp: {
        ...cp,
        name: editForm.companyName.trim(),
        hq: editForm.hq.trim(),
      },
    };

    onUpdateUser?.(updated);

    if (isLive) {
      try {
        await saveEmployerProfile({
          contact_name: editForm.name.trim(),
          phone: editForm.phone.trim(),
          company_name: editForm.companyName.trim(),
          hq_city: editForm.hq.trim(),
        });
      } catch {
        /* ignore if offline */
      }
    }

    setIsEditModalOpen(false);
    onToast?.(
      phoneChanged
        ? "Account details updated. Verify your new phone number."
        : "Employer account details updated."
    );
  };

  const handleSaveOrgInline = async () => {
    if (!orgForm.name.trim()) {
      onToast?.("Company name is required.");
      return;
    }
    onUpdateUser?.({
      ...user,
      cp: {
        ...cp,
        name: orgForm.name.trim(),
        ind: orgForm.ind.trim(),
        size: orgForm.size.trim(),
        site: orgForm.site.trim(),
        hq: orgForm.hq.trim(),
      },
    });
    if (isLive) {
      try {
        await saveEmployerProfile({
          company_name: orgForm.name.trim(),
          industry: orgForm.ind.trim(),
          num_employees: orgForm.size.trim(),
          website: orgForm.site.trim(),
          hq_city: orgForm.hq.trim(),
        });
      } catch {
        /* ignore */
      }
    }
    setEditingOrg(false);
    onToast?.("Organization summary updated.");
  };

  const handleLiveEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(newEmailInput.trim())) {
      onToast?.("Enter a valid email address.");
      return;
    }
    setBusyKey("email");
    try {
      if (isLive) {
        const { error } = await supabase.auth.updateUser({ email: newEmailInput.trim() });
        if (error) throw new Error(error.message);
        setNewEmailInput("");
        onToast?.("Check your inbox to confirm your new sign-in email.");
      } else {
        onUpdateUser?.({ ...user, email: newEmailInput.trim(), pemail: newEmailInput.trim() });
        setNewEmailInput("");
        onToast?.("Work sign-in email updated.");
      }
    } catch (err) {
      onToast?.(err instanceof Error ? err.message : "Could not update email.");
    } finally {
      setBusyKey(null);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
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

    setBusyKey("password");
    try {
      if (isLive) {
        const { error: authErr } = await supabase.auth.signInWithPassword({
          email: liveEmail,
          password: currentPw,
        });
        if (authErr) throw new Error("Your current password is incorrect.");
        const { error: updErr } = await supabase.auth.updateUser({ password: newPw });
        if (updErr) throw new Error(updErr.message);
        await loadLiveAccount();
      } else {
        onUpdateUser?.({
          ...user,
          pw: newPw,
          passwordLastChanged: Date.now(),
        });
        updateDemoSec({ ...sec, pwAt: Date.now() });
      }
      setIsPasswordModalOpen(false);
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      setPwError("");
      onToast?.("Password updated successfully.");
    } catch (err) {
      setPwError(err instanceof Error ? err.message : "Could not update password.");
    } finally {
      setBusyKey(null);
    }
  };

  const is2FAEnabled = Boolean(user.twoFactor ?? sec.twoStep);

  const handleToggle2FA = (checked: boolean) => {
    if (checked) {
      setTwoFactorOtp("");
      setIs2FAModalOpen(true);
    } else {
      onUpdateUser?.({ ...user, twoFactor: false });
      updateDemoSec({ ...sec, twoStep: false }, "Two-step verification disabled.");
    }
  };

  const handleVerify2FA = () => {
    if (twoFactorOtp.trim().length < 6) {
      onToast?.("Please enter the 6-digit verification code.");
      return;
    }
    onUpdateUser?.({ ...user, twoFactor: true, twoFactorMethod: "authenticator" });
    updateDemoSec({ ...sec, twoStep: true });
    setIs2FAModalOpen(false);
    onToast?.("Two-step verification enabled.");
  };

  const handleSignOutOthers = async () => {
    setBusyKey("others");
    try {
      if (isLive) {
        const { error } = await supabase.auth.signOut({ scope: "others" });
        if (error) throw new Error(error.message);
        await loadLiveAccount();
      } else {
        updateDemoSec({ ...sec, sessions: sec.sessions.slice(0, 1) });
      }
      onToast?.("Signed out of all other devices.");
    } catch (err) {
      onToast?.(err instanceof Error ? err.message : "Could not sign out other sessions.");
    } finally {
      setBusyKey(null);
    }
  };

  const handleSignOutEverywhere = async () => {
    setBusyKey("everywhere");
    try {
      if (isLive) {
        await supabase.auth.signOut({ scope: "global" });
      }
      if (onSignedOut) {
        onSignedOut();
      } else {
        onToast?.("All active sessions signed out.");
      }
    } catch (err) {
      onToast?.(err instanceof Error ? err.message : "Could not sign out.");
    } finally {
      setBusyKey(null);
    }
  };

  const handleInviteTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !/^\S+@\S+\.\S+$/.test(inviteEmail.trim())) {
      onToast?.("Enter a teammate's work email to send an invite.");
      return;
    }
    updateDemoSec(
      { ...sec, team: sec.team + 1 },
      `Workspace invite sent to ${inviteEmail.trim()}.`
    );
    setInviteEmail("");
  };

  const handleToggleNotifyPref = async (
    key: "applications" | "interviews" | "followups" | "status" | "weekly_digest",
    checked: boolean
  ) => {
    if (isLive && liveSettings) {
      setBusyKey("settings");
      try {
        if (key === "applications" || key === "followups" || key === "weekly_digest") {
          const next = await saveEmployerSettings({ notify_prefs: { [key]: checked } });
          setLiveSettings(next);
        } else if (key === "interviews" || key === "status") {
          const next = await saveEmployerSettings({ notify_prefs: { email: checked } });
          setLiveSettings(next);
        }
        onToast?.("Notification preference saved.");
      } catch (err) {
        onToast?.(err instanceof Error ? err.message : "Could not save notification preference.");
      } finally {
        setBusyKey(null);
      }
      return;
    }

    const nextPrefs = { ...(demoState.preferences ?? { email: true, interviews: true, digest: true }) };
    if (key === "applications") nextPrefs.email = checked;
    if (key === "interviews") nextPrefs.interviews = checked;
    if (key === "weekly_digest") nextPrefs.digest = checked;
    if (key === "status") {
      nextPrefs.status = checked;
      setDemoNotifyExtra((p) => ({ ...p, status: checked }));
    }
    if (key === "followups") {
      setDemoNotifyExtra((p) => ({ ...p, followups: checked }));
    }
    onChange?.({ ...demoState, preferences: nextPrefs });
    onToast?.("Notification preference saved.");
  };

  const handleFollowupToggle = async (checked: boolean) => {
    if (isLive && liveSettings) {
      setBusyKey("settings");
      try {
        const next = await saveEmployerSettings({ followups_enabled: checked });
        setLiveSettings(next);
        onToast?.(checked ? "Automatic follow-ups enabled." : "Automatic follow-ups paused.");
      } catch (err) {
        onToast?.(err instanceof Error ? err.message : "Could not update follow-ups.");
      } finally {
        setBusyKey(null);
      }
      return;
    }
    setDemoFollowups((p) => ({ ...p, enabled: checked }));
    onToast?.(checked ? "Automatic follow-ups enabled." : "Automatic follow-ups paused.");
  };

  const handleFollowupDays = async (
    field: "followup_pending_days" | "followup_shortlist_days" | "followup_hold_days",
    days: number
  ) => {
    if (isLive && liveSettings) {
      setBusyKey("settings");
      try {
        const next = await saveEmployerSettings({ [field]: days });
        setLiveSettings(next);
        onToast?.("Follow-up timing saved.");
      } catch (err) {
        onToast?.(err instanceof Error ? err.message : "Could not update timing.");
      } finally {
        setBusyKey(null);
      }
      return;
    }
    setDemoFollowups((p) => ({
      ...p,
      pendingDays: field === "followup_pending_days" ? days : p.pendingDays,
      shortlistDays: field === "followup_shortlist_days" ? days : p.shortlistDays,
      holdDays: field === "followup_hold_days" ? days : p.holdDays,
    }));
    onToast?.("Follow-up timing saved.");
  };

  const handlePrivacyToggle = async (
    field: "show_contact_public" | "show_hiring_activity",
    checked: boolean
  ) => {
    if (isLive && liveSettings) {
      setBusyKey("settings");
      try {
        const next = await saveEmployerSettings({ privacy: { [field]: checked } });
        setLiveSettings(next);
        onToast?.("Company page privacy updated.");
      } catch (err) {
        onToast?.(err instanceof Error ? err.message : "Could not update privacy.");
      } finally {
        setBusyKey(null);
      }
      return;
    }
    setDemoPrivacy((p) => ({
      ...p,
      showContactPublic: field === "show_contact_public" ? checked : p.showContactPublic,
      showHiringActivity: field === "show_hiring_activity" ? checked : p.showHiringActivity,
    }));
    onToast?.("Company page privacy updated.");
  };

  const handleExportData = async () => {
    setBusyKey("export");
    try {
      const payload = isLive
        ? await rpc("export_my_data")
        : {
            exported_at: new Date().toISOString(),
            account: {
              name: user.name,
              email: user.pemail || user.email,
              phone: user.phone || user.ph,
              company: cp,
            },
            jobs: myJobs,
            applications: apps,
          };
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "employer-account-export.json";
      anchor.click();
      URL.revokeObjectURL(url);
      onToast?.("Your account data export was downloaded.");
    } catch (err) {
      onToast?.(err instanceof Error ? err.message : "Could not export data.");
    } finally {
      setBusyKey(null);
    }
  };

  const handleRequestDeletion = async () => {
    setBusyKey("delete");
    try {
      if (isLive) {
        await rpc("request_account_deletion");
      }
      setDeletionRequested(true);
      onToast?.("Account deletion scheduled. You can cancel anytime during the grace period.");
    } catch (err) {
      onToast?.(err instanceof Error ? err.message : "Could not request deletion.");
    } finally {
      setBusyKey(null);
    }
  };

  const handleCancelDeletion = async () => {
    setBusyKey("cancel");
    try {
      if (isLive) {
        await rpc("cancel_account_deletion");
      }
      setDeletionRequested(false);
      onToast?.("Scheduled account deletion cancelled.");
    } catch (err) {
      onToast?.(err instanceof Error ? err.message : "Could not cancel deletion.");
    } finally {
      setBusyKey(null);
    }
  };

  const displayEmail = isLive ? liveEmail || user.email : user.pemail || user.email;
  const displayPhone = user.phone || user.ph || "+91 98450 12345";
  const phoneVerified = user.phv ?? true;
  const pwUpdatedAt = user.passwordLastChanged ?? sec.pwAt;

  const notifyValues = {
    applications: isLive
      ? (liveSettings?.notify_prefs.applications ?? true)
      : (demoState.preferences?.email ?? true),
    interviews: isLive
      ? (liveSettings?.notify_prefs.email ?? true)
      : (demoState.preferences?.interviews ?? true),
    followups: isLive
      ? (liveSettings?.notify_prefs.followups ?? true)
      : demoNotifyExtra.followups,
    status: isLive ? (liveSettings?.notify_prefs.email ?? true) : demoNotifyExtra.status,
    weekly_digest: isLive
      ? (liveSettings?.notify_prefs.weekly_digest ?? true)
      : (demoState.preferences?.digest ?? true),
  };

  const followupsEnabled = isLive
    ? (liveSettings?.followups_enabled ?? true)
    : demoFollowups.enabled;
  const pendingDays = isLive
    ? (liveSettings?.followup_pending_days ?? 3)
    : demoFollowups.pendingDays;
  const shortlistDays = isLive
    ? (liveSettings?.followup_shortlist_days ?? 5)
    : demoFollowups.shortlistDays;
  const holdDays = isLive ? (liveSettings?.followup_hold_days ?? 14) : demoFollowups.holdDays;

  const showContactPublic = isLive
    ? (liveSettings?.privacy.show_contact_public ?? false)
    : demoPrivacy.showContactPublic;
  const showHiringActivity = isLive
    ? (liveSettings?.privacy.show_hiring_activity ?? true)
    : demoPrivacy.showHiringActivity;

  const renderDayOptions = (max: number) =>
    Array.from({ length: max }, (_, i) => i + 1)
      .filter((n) => n <= 7 || n % 7 === 0 || n === max)
      .map((n) => (
        <option key={n} value={n}>
          {n} day{n === 1 ? "" : "s"}
        </option>
      ));

  return (
    <div className="employer-workspace space-y-6">
      {/* Page Header */}
      <header className="workspace-header flex flex-col sm:flex-row sm:items-center justify-between gap-4 !mb-0">
        <div>
          <span className="workspace-eyebrow">
            <UserRound size={13} />
            My Account
          </span>
          <h1 className="workspace-heading text-2xl font-bold">Account, Security &amp; Preferences</h1>
          <p className="workspace-description text-sm text-muted-foreground">
            Manage your admin profile, sign-in security, active sessions, follow-up rules, and notifications in one place.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleOpenEditModal} className="cursor-pointer gap-1.5">
            <Pencil className="h-3.5 w-3.5 text-primary" />
            Edit Account
          </Button>
          <Button size="sm" onClick={() => onNavigate("cp")} className="cursor-pointer gap-1.5">
            <Building2 className="h-3.5 w-3.5" />
            Company Profile
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </header>

      {/* Top Identity & Quick Hiring Counters Strip (Single unified horizontal bar — no 4-card grid) */}
      <section className="rounded-xl border border-border bg-card p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-4 min-w-0">
            <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center border-2 border-primary/20 shrink-0 overflow-hidden">
              <img
                src={user.avatar || getCandidatePhoto(user.name)}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-foreground truncate">{user.name}</h2>
                <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-500/30 text-[10px]">
                  Verified Hiring Partner
                </Badge>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground truncate">
                {cp.name || user.name} · {displayEmail}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {[
              {
                label: "Active Jobs",
                value: myJobs.length,
                icon: BriefcaseBusiness,
                target: "post" as ProView,
              },
              {
                label: "Applications",
                value: apps.length,
                icon: Users,
                target: "pipe" as ProView,
              },
              {
                label: "Interviews",
                value: interviewCount,
                icon: CalendarDays,
                target: "pipe" as ProView,
                query: { stage: "Interview" },
              },
            ].map(({ label, value, icon: Icon, target, query }) => (
              <button
                key={label}
                type="button"
                onClick={() => onNavigate(target, query)}
                className="inline-flex items-center gap-2.5 rounded-lg border border-border bg-muted/30 px-3.5 py-2 text-left transition-colors hover:border-primary/50 cursor-pointer"
              >
                <Icon className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <span className="block text-[11px] text-muted-foreground leading-none">{label}</span>
                  <strong className="mt-1 block text-sm font-bold text-foreground leading-none">{value}</strong>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Single-Column Tabbed Container (Zero 2x2 Card Grid) */}
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        <div
          role="tablist"
          aria-label="My Account sections"
          onKeyDown={handleTabKeyDown}
          className="workspace-tabs px-4 pt-2 bg-muted/20"
        >
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              ref={(el) => {
                tabRefs.current[id] = el;
              }}
              type="button"
              role="tab"
              id={`emp-acct-tab-${id}`}
              aria-selected={activeTab === id}
              aria-controls={`emp-acct-panel-${id}`}
              tabIndex={activeTab === id ? 0 : -1}
              onClick={() => setActiveTab(id)}
              className="workspace-tab"
            >
              <Icon size={15} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: ACCOUNT & ORGANIZATION */}
        <div
          role="tabpanel"
          id="emp-acct-panel-profile"
          aria-labelledby="emp-acct-tab-profile"
          hidden={activeTab !== "profile"}
        >
          <div className="divide-y divide-border p-5 sm:p-6">
            {/* Admin Credentials Section */}
            <div className="pb-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-foreground">Admin &amp; Sign-In Credentials</h3>
                  <p className="text-xs text-muted-foreground">
                    Your primary recruiter identity, verified work email, and contact number.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleOpenEditModal} className="gap-1.5 text-xs">
                  <Pencil className="h-3.5 w-3.5 text-primary" />
                  Edit Details
                </Button>
              </div>

              <div className="divide-y divide-border rounded-lg border border-border px-4">
                <div className="flex flex-wrap items-center justify-between gap-3 py-3.5 text-xs">
                  <span className="flex items-center gap-2 font-medium text-muted-foreground">
                    <UserRound size={15} className="text-primary" />
                    Account Admin Name
                  </span>
                  <span className="font-semibold text-sm text-foreground">{user.name}</span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 py-3.5 text-xs">
                  <span className="flex items-center gap-2 font-medium text-muted-foreground">
                    <Mail size={15} className="text-primary" />
                    Sign-in Work Email
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-sm text-foreground">{displayEmail}</span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                        liveEmailVerified
                          ? "bg-emerald-500/10 text-emerald-700"
                          : "bg-amber-500/15 text-amber-700"
                      }`}
                    >
                      {liveEmailVerified ? "Verified" : "Unverified"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 py-3.5 text-xs">
                  <span className="flex items-center gap-2 font-medium text-muted-foreground">
                    <Phone size={15} className="text-primary" />
                    Mobile Number
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-sm text-foreground">{displayPhone}</span>
                    {phoneVerified ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
                        Verified
                      </span>
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-6 px-2.5 text-[11px]"
                        onClick={() => {
                          onUpdateUser?.({ ...user, phv: true });
                          onToast?.("Phone number verified.");
                        }}
                      >
                        Verify phone
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 py-3.5 text-xs">
                  <span className="flex items-center gap-2 font-medium text-muted-foreground">
                    <ShieldCheck size={15} className="text-primary" />
                    Workspace Role
                  </span>
                  <span className="font-semibold text-sm text-foreground">Hiring Administrator</span>
                </div>
              </div>

              {isLive && (
                <form onSubmit={handleLiveEmailChange} className="mt-4 flex flex-wrap items-end gap-3">
                  <label className="workspace-field min-w-[220px] flex-1">
                    <span>Update sign-in email</span>
                    <Input
                      type="email"
                      value={newEmailInput}
                      onChange={(e) => setNewEmailInput(e.target.value)}
                      placeholder="new@company.com"
                      autoComplete="email"
                    />
                  </label>
                  <Button type="submit" variant="outline" size="sm" disabled={busyKey === "email"}>
                    <Mail className="mr-1.5 h-3.5 w-3.5" />
                    Send Confirmation
                  </Button>
                </form>
              )}
            </div>

            {/* Organization Summary Section */}
            <div className="pt-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-foreground">Organization Summary</h3>
                  <p className="text-xs text-muted-foreground">
                    Core company details displayed across your job postings and candidate invites.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {editingOrg ? (
                    <>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingOrg(false)}
                        className="text-xs"
                      >
                        Cancel
                      </Button>
                      <Button type="button" size="sm" onClick={() => void handleSaveOrgInline()} className="text-xs">
                        Save Organization
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingOrg(true)}
                        className="gap-1.5 text-xs"
                      >
                        <Pencil className="h-3.5 w-3.5 text-primary" />
                        Quick Edit
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onNavigate("cp")}
                        className="gap-1 text-xs"
                      >
                        Full Company Profile
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {editingOrg ? (
                <div className="grid gap-4 sm:grid-cols-2 rounded-lg border border-border p-4 bg-muted/15">
                  <label className="workspace-field">
                    <span>Company Name</span>
                    <Input
                      value={orgForm.name}
                      onChange={(e) => setOrgForm((p) => ({ ...p, name: e.target.value }))}
                    />
                  </label>
                  <label className="workspace-field">
                    <span>Industry</span>
                    <Input
                      value={orgForm.ind}
                      onChange={(e) => setOrgForm((p) => ({ ...p, ind: e.target.value }))}
                    />
                  </label>
                  <label className="workspace-field">
                    <span>Company Size</span>
                    <Input
                      value={orgForm.size}
                      onChange={(e) => setOrgForm((p) => ({ ...p, size: e.target.value }))}
                    />
                  </label>
                  <label className="workspace-field">
                    <span>Website</span>
                    <Input
                      value={orgForm.site}
                      onChange={(e) => setOrgForm((p) => ({ ...p, site: e.target.value }))}
                    />
                  </label>
                  <label className="workspace-field sm:col-span-2">
                    <span>Headquarters</span>
                    <Input
                      value={orgForm.hq}
                      onChange={(e) => setOrgForm((p) => ({ ...p, hq: e.target.value }))}
                    />
                  </label>
                </div>
              ) : (
                <div className="divide-y divide-border rounded-lg border border-border px-4">
                  {[
                    { icon: Building2, label: "Company Name", value: cp.name || orgForm.name },
                    { icon: Layers, label: "Industry", value: cp.ind || orgForm.ind || "—" },
                    { icon: Users, label: "Company Size", value: cp.size || orgForm.size || "—" },
                    { icon: Globe, label: "Website", value: cp.site || orgForm.site || "—" },
                    { icon: MapPin, label: "Headquarters", value: cp.hq || orgForm.hq || "—" },
                  ].map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="flex flex-wrap items-center justify-between gap-3 py-3 text-xs"
                    >
                      <span className="flex items-center gap-2 font-medium text-muted-foreground">
                        <Icon size={15} className="text-primary" />
                        {label}
                      </span>
                      <span className="font-semibold text-sm text-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TAB 2: SECURITY & ACCESS */}
        <div
          role="tabpanel"
          id="emp-acct-panel-security"
          aria-labelledby="emp-acct-tab-security"
          hidden={activeTab !== "security"}
        >
          <div className="divide-y divide-border p-5 sm:p-6">
            {/* Password Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6">
              <div className="flex items-start gap-3.5 min-w-0">
                <span className="workspace-icon !h-10 !w-10 shrink-0">
                  <KeyRound size={18} />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Password &amp; Authentication</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Last updated {fmtDate(pwUpdatedAt)}. Use at least 8 characters with letters and numbers.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPwError("");
                  setIsPasswordModalOpen(true);
                }}
                className="gap-1.5 text-xs"
              >
                <Lock className="h-3.5 w-3.5 text-primary" />
                Change Password
              </Button>
            </div>

            {/* Two-Step Verification Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-6">
              <div className="flex items-start gap-3.5 min-w-0">
                <span className="workspace-icon !h-10 !w-10 shrink-0">
                  <Shield size={18} />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-foreground">Two-Step Verification (2FA)</h3>
                    <Badge
                      variant={is2FAEnabled ? "default" : "outline"}
                      className={
                        is2FAEnabled
                          ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 text-[10px]"
                          : "text-[10px]"
                      }
                    >
                      {is2FAEnabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Require an authenticator code whenever someone signs in to your hiring workspace.
                  </p>
                </div>
              </div>
              <Switch
                aria-label="Two-step verification"
                checked={is2FAEnabled}
                onCheckedChange={handleToggle2FA}
              />
            </div>

            {/* Active Devices & Sessions */}
            <div className="py-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-start gap-3.5 min-w-0">
                  <span className="workspace-icon !h-10 !w-10 shrink-0">
                    <MonitorSmartphone size={18} />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Devices &amp; Active Sessions</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Review signed-in browsers and sign out of devices you no longer use.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={busyKey === "others"}
                    onClick={() => void handleSignOutOthers()}
                    className="text-xs gap-1.5"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign out other devices
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={busyKey === "everywhere"}
                    onClick={() => void handleSignOutEverywhere()}
                    className="text-xs"
                  >
                    Sign out everywhere
                  </Button>
                </div>
              </div>

              {isLive ? (
                <div className="rounded-lg border border-border px-4 py-3">
                  <p className="text-xs font-semibold text-foreground mb-2">Recent account activity</p>
                  {authEvents.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No recent sign-in events recorded.</p>
                  ) : (
                    <ul className="divide-y divide-border">
                      {authEvents.map((ev) => (
                        <li
                          key={ev.id}
                          className="flex items-center justify-between gap-3 py-2 text-xs"
                        >
                          <span className="font-medium text-foreground">
                            {EVENT_LABEL[ev.kind] ?? ev.kind}
                          </span>
                          <time className="text-muted-foreground" dateTime={ev.created_at}>
                            {fmtDateTimeStr(ev.created_at)}
                          </time>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-border rounded-lg border border-border px-4">
                  {sec.sessions.map((s, idx) => (
                    <div
                      key={s.id}
                      className="flex flex-wrap items-center justify-between gap-3 py-3 text-xs"
                    >
                      <div>
                        <p className="font-semibold text-foreground">{s.device}</p>
                        <p className="text-[11px] text-muted-foreground">
                          Last active {new Date(s.at).toLocaleString("en-GB")}
                        </p>
                      </div>
                      {idx === 0 ? (
                        <Badge variant="outline" className="text-[10px]">
                          Current session
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() =>
                            updateDemoSec(
                              {
                                ...sec,
                                sessions: sec.sessions.filter((item) => item.id !== s.id),
                              },
                              "Device signed out."
                            )
                          }
                        >
                          Sign out
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Team & Workspace Access */}
            <div className="pt-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-start gap-3.5 min-w-0">
                  <span className="workspace-icon !h-10 !w-10 shrink-0">
                    <Users size={18} />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Team &amp; Workspace Access</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Hiring team · <strong>{sec.team}</strong> active seat{sec.team === 1 ? "" : "s"} with recruiter access.
                    </p>
                  </div>
                </div>
                {sec.team > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => updateDemoSec({ ...sec, team: sec.team - 1 }, "Team seat removed.")}
                  >
                    Remove seat
                  </Button>
                )}
              </div>

              <form onSubmit={handleInviteTeamMember} className="flex flex-wrap items-center gap-2.5">
                <Input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="teammate@company.com"
                  className="max-w-xs h-9 text-xs"
                  aria-label="Teammate work email"
                />
                <Button type="submit" variant="outline" size="sm" className="gap-1.5 text-xs">
                  <UserPlus className="h-3.5 w-3.5 text-primary" />
                  Invite Member
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* TAB 3: NOTIFICATIONS & PRIVACY */}
        <div
          role="tabpanel"
          id="emp-acct-panel-preferences"
          aria-labelledby="emp-acct-tab-preferences"
          hidden={activeTab !== "preferences"}
        >
          <div className="divide-y divide-border p-5 sm:p-6">
            {/* Hiring Notifications */}
            <div className="pb-6">
              <div className="mb-3">
                <h3 className="text-sm font-bold text-foreground">Hiring Notification Alerts</h3>
                <p className="text-xs text-muted-foreground">
                  Choose which applicant, interview, and pipeline updates we send you.
                </p>
              </div>
              <div className="divide-y divide-border rounded-lg border border-border px-4">
                {(
                  [
                    [
                      "applications",
                      "New application alerts",
                      "Alert me immediately when a candidate applies to an active job.",
                    ],
                    [
                      "interviews",
                      "Interview reminders",
                      "Receive reminders ahead of scheduled candidate interviews.",
                    ],
                    [
                      "followups",
                      "Follow-up reminders",
                      "Notify me when candidates are waiting on a stage decision.",
                    ],
                    [
                      "status",
                      "Candidate status updates",
                      "Keep me informed when a teammate moves a candidate across stages.",
                    ],
                    [
                      "weekly_digest",
                      "Weekly hiring digest",
                      "Receive a weekly summary of job views, applications, and hires.",
                    ],
                  ] as const
                ).map(([key, title, desc]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between gap-4 py-3.5"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground">{title}</p>
                      <p className="text-[11px] text-muted-foreground">{desc}</p>
                    </div>
                    <Switch
                      aria-label={title}
                      checked={Boolean(notifyValues[key])}
                      disabled={busyKey === "settings"}
                      onCheckedChange={(checked) => void handleToggleNotifyPref(key, checked)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Follow-up Timing */}
            <div className="py-6 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <span className="workspace-icon !h-9 !w-9 shrink-0">
                    <Clock size={16} />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Automatic Follow-up Timing</h3>
                    <p className="text-xs text-muted-foreground">
                      Set how many days an applicant can wait before triggering a follow-up reminder.
                    </p>
                  </div>
                </div>
                <Switch
                  aria-label="Automatic follow-ups"
                  checked={followupsEnabled}
                  disabled={busyKey === "settings"}
                  onCheckedChange={(checked) => void handleFollowupToggle(checked)}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-3 rounded-lg border border-border bg-muted/15 p-4">
                <label className="workspace-field">
                  <span>Pending application after</span>
                  <select
                    aria-label="Pending application after"
                    value={pendingDays}
                    disabled={!followupsEnabled || busyKey === "settings"}
                    onChange={(e) =>
                      void handleFollowupDays("followup_pending_days", Number(e.target.value))
                    }
                  >
                    {renderDayOptions(14)}
                  </select>
                </label>

                <label className="workspace-field">
                  <span>Shortlisted candidate after</span>
                  <select
                    aria-label="Shortlisted candidate after"
                    value={shortlistDays}
                    disabled={!followupsEnabled || busyKey === "settings"}
                    onChange={(e) =>
                      void handleFollowupDays("followup_shortlist_days", Number(e.target.value))
                    }
                  >
                    {renderDayOptions(14)}
                  </select>
                </label>

                <label className="workspace-field">
                  <span>On hold after</span>
                  <select
                    aria-label="On hold after"
                    value={holdDays}
                    disabled={!followupsEnabled || busyKey === "settings"}
                    onChange={(e) =>
                      void handleFollowupDays("followup_hold_days", Number(e.target.value))
                    }
                  >
                    {renderDayOptions(28)}
                  </select>
                </label>
              </div>
            </div>

            {/* Public Company Page Privacy */}
            <div className="py-6">
              <div className="mb-3">
                <h3 className="text-sm font-bold text-foreground">Public Company Page Privacy</h3>
                <p className="text-xs text-muted-foreground">
                  Control what candidates and visitors can see on your public employer profile.
                </p>
              </div>
              <div className="divide-y divide-border rounded-lg border border-border px-4">
                <div className="flex items-center justify-between gap-4 py-3.5">
                  <div>
                    <p className="text-xs font-semibold text-foreground">Show contact details publicly</p>
                    <p className="text-[11px] text-muted-foreground">
                      Display your official email and phone number on your public company page.
                    </p>
                  </div>
                  <Switch
                    aria-label="Show contact details publicly"
                    checked={showContactPublic}
                    disabled={busyKey === "settings"}
                    onCheckedChange={(checked) =>
                      void handlePrivacyToggle("show_contact_public", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between gap-4 py-3.5">
                  <div>
                    <p className="text-xs font-semibold text-foreground">Show open roles count</p>
                    <p className="text-[11px] text-muted-foreground">
                      Let visitors see how many active job openings your organization is hiring for.
                    </p>
                  </div>
                  <Switch
                    aria-label="Show open roles count"
                    checked={showHiringActivity}
                    disabled={busyKey === "settings"}
                    onCheckedChange={(checked) =>
                      void handlePrivacyToggle("show_hiring_activity", checked)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Data Export & Account Closure */}
            <div className="pt-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-foreground">Account Data &amp; Closure</h3>
                <p className="text-xs text-muted-foreground">
                  Download a JSON archive of your hiring workspace data or schedule account closure.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={busyKey === "export"}
                  onClick={() => void handleExportData()}
                  className="gap-1.5 text-xs"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export My Data
                </Button>

                {deletionRequested ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-amber-700">Deletion scheduled</span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={busyKey === "cancel"}
                      onClick={() => void handleCancelDeletion()}
                      className="text-xs"
                    >
                      Cancel Deletion
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConfirmDeleteOpen(true)}
                    className="gap-1.5 text-xs text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete Account
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT ACCOUNT MODAL */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={(e) => void handleSaveAccountInfo(e)}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Pencil className="h-4 w-4 text-primary" />
                Edit Employer Account Info
              </DialogTitle>
              <DialogDescription>
                Update your recruiter name, work email, phone number, and company details.
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
                <Label htmlFor="emp-edit-name" className="text-xs font-semibold">
                  Account Admin Name
                </Label>
                <Input
                  id="emp-edit-name"
                  value={editForm.name}
                  onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="emp-edit-email" className="text-xs font-semibold">
                  Work Email
                </Label>
                <Input
                  id="emp-edit-email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="emp-edit-phone" className="text-xs font-semibold">
                  Mobile Number
                </Label>
                <Input
                  id="emp-edit-phone"
                  value={editForm.phone}
                  onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="emp-edit-company" className="text-xs font-semibold">
                  Company Name
                </Label>
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
          <form onSubmit={(e) => void handleSavePassword(e)}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-primary" />
                Change Password
              </DialogTitle>
              <DialogDescription>
                Confirm your current password to set a new password for your employer account.
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
                <Label htmlFor="emp-curr-pw" className="text-xs font-semibold">
                  Current Password
                </Label>
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
                <Label htmlFor="emp-new-pw" className="text-xs font-semibold">
                  New Password
                </Label>
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
                <Label htmlFor="emp-conf-pw" className="text-xs font-semibold">
                  Confirm New Password
                </Label>
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
              <Button type="submit" disabled={busyKey === "password"} className="cursor-pointer">
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
              Protect your employer workspace with an authenticator verification code.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3 text-xs">
            <div className="p-4 rounded-lg bg-muted/40 border border-border space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-background rounded-lg border border-border shrink-0">
                  <QrCode className="h-10 w-10 text-foreground" />
                </div>
                <div className="space-y-1 min-w-0">
                  <strong className="text-foreground">Scan or copy secret key</strong>
                  <p className="text-muted-foreground text-[11px]">
                    Use Google Authenticator, Authy, or Duo Mobile.
                  </p>
                  <div className="flex items-center gap-1.5 font-mono text-[11px] bg-background p-1.5 rounded border border-border">
                    <span className="truncate">{secretAuthKey}</span>
                    <button
                      type="button"
                      onClick={() => {
                        void navigator.clipboard.writeText(secretAuthKey);
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
              <Label htmlFor="emp-2fa-otp" className="text-xs font-semibold">
                Enter 6-digit passcode
              </Label>
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

      {/* DELETE ACCOUNT CONFIRMATION DIALOG */}
      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete your employer account?</AlertDialogTitle>
            <AlertDialogDescription>
              Your account will be scheduled for deletion and permanently removed after the grace period. You can cancel from My Account anytime until then.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep my account</AlertDialogCancel>
            <AlertDialogAction onClick={() => void handleRequestDeletion()}>
              Request deletion
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
