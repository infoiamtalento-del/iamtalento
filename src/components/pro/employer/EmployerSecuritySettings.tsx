import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Bell, Clock, Download, KeyRound, Lock, LogOut, Mail, MonitorSmartphone, ShieldCheck, Trash2, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { db, rpc } from "@/services/db";
import { getEmployerSettings, saveEmployerSettings, type EmployerSettings } from "@/services/employer/ats";
import { getEmployerProfile, saveEmployerProfile } from "@/services/employer/profile";
import { ErrorState, Loading, PageHeader, fmtDateTime } from "./employerUi";

interface Props {
  onToast: (message: string) => void;
  onSignedOut: () => void;
}

interface AuthEvent { id: string; kind: string; created_at: string; ua: string | null }

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

function Card({ icon, title, desc, children }: { icon: ReactNode; title: string; desc: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">
      <div className="flex items-start gap-4 border-b border-border pb-5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-muted text-primary">{icon}</span>
        <div className="min-w-0"><h2 className="text-base font-bold">{title}</h2><p className="mt-1 text-sm text-muted-foreground">{desc}</p></div>
      </div>
      <div className="pt-5">{children}</div>
    </section>
  );
}

const passwordProblem = (pw: string): string | null => {
  if (pw.length < 8) return "Use at least 8 characters.";
  if (!/[A-Za-z]/.test(pw) || !/[0-9]/.test(pw)) return "Include at least one letter and one number.";
  return null;
};

export function EmployerSecuritySettings({ onToast, onSignedOut }: Props) {
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [phone, setPhone] = useState("");
  const [settings, setSettings] = useState<EmployerSettings | null>(null);
  const [events, setEvents] = useState<AuthEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [newEmail, setNewEmail] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [deletionRequested, setDeletionRequested] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const { data: userData } = await supabase.auth.getUser();
      setEmail(userData.user?.email ?? "");
      setEmailVerified(Boolean(userData.user?.email_confirmed_at));
      const [s, profile, ev, me] = await Promise.all([
        getEmployerSettings(),
        getEmployerProfile(),
        db.from("auth_events").select("id, kind, created_at, ua").order("created_at", { ascending: false }).limit(8),
        db.from("profiles").select("deletion_requested_at").eq("id", userData.user?.id ?? "").maybeSingle(),
      ]);
      setSettings(s);
      setPhone(profile?.phone ?? "");
      setEvents((ev.data ?? []) as AuthEvent[]);
      setDeletionRequested(Boolean(me.data?.deletion_requested_at));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load your settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const guard = async (key: string, success: string, action: () => Promise<unknown>) => {
    setBusy(key);
    try {
      await action();
      onToast(success);
    } catch (e) {
      onToast(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(null);
    }
  };

  const changePassword = (event: FormEvent) => {
    event.preventDefault();
    const problem = passwordProblem(pw.next);
    if (!pw.current) return onToast("Enter your current password.");
    if (problem) return onToast(problem);
    if (pw.next !== pw.confirm) return onToast("The new passwords do not match.");
    if (pw.next === pw.current) return onToast("Choose a password you have not used here.");
    void guard("password", "Password updated.", async () => {
      // Re-authenticate first: a stolen session must not be able to change the password.
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password: pw.current });
      if (authError) throw new Error("Your current password is incorrect.");
      const { error: updateError } = await supabase.auth.updateUser({ password: pw.next });
      if (updateError) throw new Error(updateError.message);
      setPw({ current: "", next: "", confirm: "" });
      await load();
    });
  };

  const changeEmail = (event: FormEvent) => {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(newEmail)) return onToast("Enter a valid email address.");
    if (newEmail.toLowerCase() === email.toLowerCase()) return onToast("That is already your email.");
    void guard("email", "Check your inbox. Confirm the new address to finish the change.", async () => {
      const { error: updateError } = await supabase.auth.updateUser({ email: newEmail });
      if (updateError) throw new Error(updateError.message);
      setNewEmail("");
    });
  };

  const savePhone = () => {
    if (phone && !/^\+?[0-9][0-9 ()-]{6,18}$/.test(phone)) return onToast("Enter a valid phone number.");
    void guard("phone", "Phone number saved.", () => saveEmployerProfile({ phone }));
  };

  const update = (patch: Parameters<typeof saveEmployerSettings>[0], message: string) =>
    guard("settings", message, async () => setSettings(await saveEmployerSettings(patch)));

  const signOutOthers = () =>
    guard("others", "Signed out of all other devices.", async () => {
      const { error: outError } = await supabase.auth.signOut({ scope: "others" });
      if (outError) throw new Error(outError.message);
      await load();
    });

  const signOutEverywhere = async () => {
    setBusy("everywhere");
    try {
      await supabase.auth.signOut({ scope: "global" });
      onSignedOut();
    } catch (e) {
      onToast(e instanceof Error ? e.message : "Could not sign out.");
      setBusy(null);
    }
  };

  const exportData = () =>
    guard("export", "Your data export was downloaded.", async () => {
      const data = await rpc("export_my_data");
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "my-data-export.json";
      a.click();
      URL.revokeObjectURL(url);
    });

  const requestDeletion = () =>
    guard("delete", "Deletion requested. You can cancel it from this page.", async () => {
      await rpc("request_account_deletion");
      setDeletionRequested(true);
    });

  const cancelDeletion = () =>
    guard("cancel", "Deletion cancelled.", async () => {
      await rpc("cancel_account_deletion");
      setDeletionRequested(false);
    });

  if (loading) return <div className="employer-workspace"><Loading label="Loading settings" /></div>;
  if (error || !settings) return <div className="employer-workspace"><ErrorState message={error ?? "Settings unavailable."} onRetry={load} /></div>;

  const prefRow = (key: keyof EmployerSettings["notify_prefs"], title: string, desc: string) => (
    <div className="flex items-center justify-between gap-4 border-b border-border py-3 last:border-0">
      <div className="min-w-0"><p className="text-sm font-semibold">{title}</p><p className="text-xs text-muted-foreground">{desc}</p></div>
      <Switch aria-label={title} checked={settings.notify_prefs[key]} disabled={busy === "settings"}
        onCheckedChange={(v) => void update({ notify_prefs: { [key]: v } }, "Notification preference saved.")} />
    </div>
  );

  const days = (key: "followup_pending_days" | "followup_shortlist_days" | "followup_hold_days", label: string, max: number) => (
    <label className="workspace-field"><span>{label}</span>
      <select aria-label={label} value={settings[key]} onChange={(e) => void update({ [key]: Number(e.target.value) }, "Follow-up timing saved.")}>
        {Array.from({ length: max }, (_, i) => i + 1).filter((n) => n <= 7 || n % 7 === 0 || n === max).map((n) => <option key={n} value={n}>{n} day{n === 1 ? "" : "s"}</option>)}
      </select></label>
  );

  return (
    <div className="employer-workspace space-y-6">
      <PageHeader eyebrow="Security & settings" icon={<ShieldCheck size={13} />} title="Security & settings" description="Manage your sign-in, devices, notifications and privacy." />

      <div className="grid gap-5 xl:grid-cols-2">
        <Card icon={<UserRound size={20} />} title="Account" desc="Your sign-in email and contact phone.">
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3"><dt className="text-muted-foreground">Sign-in email</dt>
              <dd className="flex items-center gap-2 font-semibold break-all">{email}<span className={`rounded-full px-2 py-0.5 text-[10px] ${emailVerified ? "bg-success/10 text-success" : "bg-warning/15 text-warning"}`}>{emailVerified ? "Verified" : "Unverified"}</span></dd></div>
          </dl>
          <form onSubmit={changeEmail} className="mt-4 flex flex-wrap items-end gap-3">
            <label className="workspace-field min-w-[220px] flex-1"><span>Change email</span><Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="new@company.com" autoComplete="email" /></label>
            <Button type="submit" variant="outline" disabled={busy === "email"}><Mail className="mr-1.5 h-4 w-4" />Send confirmation</Button>
          </form>
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <label className="workspace-field min-w-[220px] flex-1"><span>Phone number</span><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" autoComplete="tel" /></label>
            <Button variant="outline" disabled={busy === "phone"} onClick={savePhone}>Save phone</Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Alternate company emails and phone numbers are managed in Company Profile.</p>
        </Card>

        <Card icon={<KeyRound size={20} />} title="Password" desc="Confirm your current password to set a new one.">
          <form onSubmit={changePassword} className="grid gap-3">
            <label className="workspace-field"><span>Current password</span><Input type="password" autoComplete="current-password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} /></label>
            <label className="workspace-field"><span>New password</span><Input type="password" autoComplete="new-password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} /></label>
            <label className="workspace-field"><span>Confirm new password</span><Input type="password" autoComplete="new-password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} /></label>
            <p className="text-xs text-muted-foreground">At least 8 characters with a letter and a number.</p>
            <div><Button type="submit" disabled={busy === "password"}><Lock className="mr-1.5 h-4 w-4" />Update password</Button></div>
          </form>
        </Card>

        <Card icon={<MonitorSmartphone size={20} />} title="Devices & sessions" desc="Sign out of devices you no longer use.">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" disabled={busy === "others"} onClick={() => void signOutOthers()}><LogOut className="mr-1.5 h-4 w-4" />Sign out other devices</Button>
            <Button variant="outline" disabled={busy === "everywhere"} onClick={() => void signOutEverywhere()}>Sign out everywhere</Button>
          </div>
          <h3 className="mt-5 text-sm font-semibold">Recent account activity</h3>
          {events.length === 0 ? <p className="mt-2 text-xs text-muted-foreground">No recent activity recorded.</p> : (
            <ul className="mt-2 divide-y divide-border">
              {events.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-3 py-2 text-xs">
                  <span className="font-medium">{EVENT_LABEL[e.kind] ?? e.kind}</span>
                  <time className="text-muted-foreground" dateTime={e.created_at}>{fmtDateTime(e.created_at)}</time>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card icon={<Bell size={20} />} title="Notification preferences" desc="Choose what we tell you about.">
          {prefRow("applications", "New applications", "Alert me when a candidate applies.")}
          {prefRow("followups", "Follow-up reminders", "Remind me when candidates are waiting on a decision.")}
          {prefRow("email", "Email notifications", "Send important alerts to my email as well.")}
          {prefRow("weekly_digest", "Weekly hiring digest", "A summary of applications and decisions each week.")}
        </Card>

        <Card icon={<Clock size={20} />} title="Follow-up timing" desc="When should a candidate waiting on you trigger a reminder?">
          <div className="mb-4 flex items-center justify-between gap-4 border-b border-border pb-3">
            <div><p className="text-sm font-semibold">Automatic follow-ups</p><p className="text-xs text-muted-foreground">Create reminders for stalled applications and passed interviews.</p></div>
            <Switch aria-label="Automatic follow-ups" checked={settings.followups_enabled} disabled={busy === "settings"}
              onCheckedChange={(v) => void update({ followups_enabled: v }, v ? "Follow-ups enabled." : "Follow-ups paused.")} />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {days("followup_pending_days", "Pending application after", 14)}
            {days("followup_shortlist_days", "Shortlisted candidate after", 14)}
            {days("followup_hold_days", "On hold after", 28)}
          </div>
        </Card>

        <Card icon={<ShieldCheck size={20} />} title="Privacy" desc="Control what appears on your public company page.">
          <div className="flex items-center justify-between gap-4 border-b border-border py-3">
            <div><p className="text-sm font-semibold">Show contact details publicly</p><p className="text-xs text-muted-foreground">Display your email and phone numbers on the company page.</p></div>
            <Switch aria-label="Show contact details publicly" checked={settings.privacy.show_contact_public} disabled={busy === "settings"}
              onCheckedChange={(v) => void update({ privacy: { show_contact_public: v } }, "Privacy setting saved.")} />
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <div><p className="text-sm font-semibold">Show open roles count</p><p className="text-xs text-muted-foreground">Let visitors see how many roles you are hiring for.</p></div>
            <Switch aria-label="Show open roles count" checked={settings.privacy.show_hiring_activity} disabled={busy === "settings"}
              onCheckedChange={(v) => void update({ privacy: { show_hiring_activity: v } }, "Privacy setting saved.")} />
          </div>
        </Card>
      </div>

      <Card icon={<Trash2 size={20} />} title="Account management" desc="Download your data or close your account.">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" disabled={busy === "export"} onClick={() => void exportData()}><Download className="mr-1.5 h-4 w-4" />Export my data</Button>
          {deletionRequested ? (
            <>
              <span className="text-sm text-warning">Account deletion is scheduled.</span>
              <Button variant="outline" disabled={busy === "cancel"} onClick={() => void cancelDeletion()}>Cancel deletion</Button>
            </>
          ) : (
            <Button variant="outline" className="text-destructive" onClick={() => setConfirmDelete(true)}><Trash2 className="mr-1.5 h-4 w-4" />Delete my account</Button>
          )}
        </div>
      </Card>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete your account?</AlertDialogTitle>
            <AlertDialogDescription>Your account is scheduled for deletion and permanently removed after the grace period. You can cancel from this page until then.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep my account</AlertDialogCancel>
            <AlertDialogAction onClick={() => void requestDeletion()}>Request deletion</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
