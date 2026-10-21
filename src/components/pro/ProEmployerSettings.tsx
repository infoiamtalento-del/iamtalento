import { useEffect, useState, type ReactNode } from "react";
import { Bell, Building2, CalendarDays, ChevronRight, Globe, KeyRound, Layers, Lock, Mail, MapPin, Monitor, Pencil, Phone, Send, Settings, ShieldCheck, Smartphone, UserRound, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { ProUser } from "@/data/proData";
import type { EmployerDemoState } from "@/data/employerDemo";
import "./employer-workspace.css";

interface Props { user: ProUser; state: EmployerDemoState; onChange: (s: EmployerDemoState) => void; onUpdateUser?: (u: ProUser) => void; onToast: (m: string) => void }

const DEFAULT_SECURITY = { twoStep: true, pwAt: Date.now() - 86400000 * 36, sessions: [{ id: 1, device: "Chrome · Windows (this device)", at: Date.now() }, { id: 2, device: "Safari · iPhone", at: Date.now() - 3600000 * 5 }], team: 4 };
const fmt = (t: number) => new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

function Card({ icon: Icon, title, desc, action, children }: { icon: typeof Bell; title: string; desc: string; action?: ReactNode; children: ReactNode }) {
  return <section className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">
    <div className="flex flex-wrap items-start gap-4 border-b border-border pb-5"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-muted text-primary"><Icon size={20} /></span><div className="mr-auto min-w-0 flex-1"><h2 className="text-lg font-bold">{title}</h2><p className="mt-1 text-sm text-muted-foreground">{desc}</p></div>{action}</div>
    {children}
  </section>;
}

export function ProEmployerSettings({ user, state, onChange, onUpdateUser, onToast }: Props) {
  const cp = user.cp || {};
  const sec = state.security || DEFAULT_SECURITY;
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: cp.name || user.name, ind: cp.ind || "", size: cp.size || "", site: cp.site || "", hq: cp.hq || "" });
  const [acct, setAcct] = useState(false);
  const [contact, setContact] = useState({ email: user.pemail || user.email, ph: user.ph || "" });
  const [panel, setPanel] = useState<string | null>(null);
  const [prefs, setPrefs] = useState({ status: true, ...state.preferences });
  const dirty = JSON.stringify(prefs) !== JSON.stringify({ status: true, ...state.preferences });
  useEffect(() => { setPrefs({ status: true, ...state.preferences }); }, [state.preferences]);

  const initials = (form.name || "C").split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase();
  const saveProfile = () => {
    if (!form.name.trim()) return onToast("Company name is required.");
    onUpdateUser?.({ ...user, cp: { ...cp, ...form, name: form.name.trim() } }); setEditing(false); onToast("Company profile updated.");
  };
  const saveAccount = () => {
    if (!/^\S+@\S+\.\S+$/.test(contact.email)) return onToast("Enter a valid email.");
    const phChanged = contact.ph !== (user.ph || "");
    onUpdateUser?.({ ...user, pemail: contact.email, ph: contact.ph, phv: phChanged ? false : user.phv }); setAcct(false); onToast(phChanged ? "Account updated. Verify your new phone number." : "Account updated.");
  };
  const setSec = (next: typeof sec, msg: string) => { onChange({ ...state, security: next }); onToast(msg); };
  const field = (Icon: typeof Bell, label: string, value: ReactNode) => <div className="flex items-start gap-3"><Icon size={18} className="mt-0.5 shrink-0 text-muted-foreground" /><div className="min-w-0"><p className="text-xs text-muted-foreground">{label}</p><div className="mt-1 break-words text-sm font-semibold">{value || "-"}</div></div></div>;
  const row = (Icon: typeof Bell, label: string, desc: string, id: string, right?: ReactNode) => <button type="button" onClick={() => setPanel(panel === id ? null : id)} className="flex w-full items-center gap-4 border-b border-border py-4 text-left last:border-0"><Icon size={18} className="shrink-0 text-muted-foreground" /><span className="mr-auto min-w-0"><span className="block text-sm font-semibold">{label}</span><span className="block text-xs text-muted-foreground">{desc}</span></span>{right}<ChevronRight size={16} className={`text-muted-foreground transition-transform ${panel === id ? "rotate-90" : ""}`} /></button>;

  return <div className="employer-workspace space-y-6">
    <header><h1 className="text-3xl font-bold">Settings</h1><p className="mt-1 text-sm text-muted-foreground">Manage your company profile, account security and hiring notifications.</p></header>
    <div className="grid gap-5 xl:grid-cols-2">
      <Card icon={Building2} title="Company Profile" desc="Update your company information so candidates can learn more about your organization." action={<Button variant="outline" onClick={() => editing ? saveProfile() : setEditing(true)}><Pencil />{editing ? "Save profile" : "Edit profile"}</Button>}>
        {editing ? <div className="grid gap-3 pt-5 sm:grid-cols-2">{([["name", "Company name"], ["ind", "Industry"], ["size", "Company size"], ["site", "Website"], ["hq", "Location"]] as const).map(([k, l]) => <label key={k} className="workspace-field"><span>{l}</span><Input value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} /></label>)}<Button variant="ghost" className="self-end" onClick={() => { setEditing(false); setForm({ name: cp.name || user.name, ind: cp.ind || "", size: cp.size || "", site: cp.site || "", hq: cp.hq || "" }); }}>Cancel</Button></div> : <>
          <div className="flex items-center gap-5 py-5"><span className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-primary text-xl font-bold text-primary-foreground">{initials}</span><div><p className="text-xs text-muted-foreground">Company name</p><p className="mt-1 text-base font-bold">{form.name}</p></div></div>
          <div className="grid gap-5 sm:grid-cols-2">{field(Layers, "Industry", form.ind)}{field(Users, "Company size", form.size)}{field(Globe, "Website", form.site && <a className="text-primary hover:underline" href={form.site.startsWith("http") ? form.site : `https://${form.site}`} target="_blank" rel="noreferrer">{form.site}</a>)}{field(MapPin, "Location", form.hq)}</div>
        </>}
      </Card>

      <Card icon={UserRound} title="Account Settings" desc="Manage your login details and account information." action={<Button variant="outline" onClick={() => acct ? saveAccount() : setAcct(true)}><Settings />{acct ? "Save account" : "Manage account"}</Button>}>
        {acct ? <div className="grid gap-3 pt-5 sm:grid-cols-2"><label className="workspace-field"><span>Work email</span><Input type="email" value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} /></label><label className="workspace-field"><span>Phone</span><Input value={contact.ph} onChange={e => setContact({ ...contact, ph: e.target.value })} /></label></div> :
          <div className="space-y-4 pt-5">{([[Mail, "Work email", user.pemail || user.email], [Phone, "Phone", user.ph || "Not added"], [UserRound, "Account role", "Hiring Administrator"], [CalendarDays, "Last password update", fmt(sec.pwAt)]] as const).map(([I, l, v]) => <div key={l} className="grid grid-cols-[20px_1fr_1.4fr] items-center gap-3 text-sm"><I size={18} className="text-muted-foreground" /><span className="text-muted-foreground">{l}</span><span className="break-words font-medium">{v}</span></div>)}</div>}
        <div className="mt-5 border-t border-border pt-5"><p className="flex items-center gap-2 text-sm font-semibold"><ShieldCheck size={18} className="text-primary" />Verification status</p><div className="mt-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success"><Mail size={13} />Email verified</span>
          {user.phv ? <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success"><Phone size={13} />Phone verified</span> : <button type="button" disabled={!user.ph} onClick={() => { onUpdateUser?.({ ...user, phv: true }); onToast("Phone verified (demo code accepted)."); }} className="inline-flex items-center gap-1.5 rounded-full bg-warning/10 px-3 py-1 text-xs font-medium text-warning disabled:opacity-60"><Phone size={13} />{user.ph ? "Verify phone" : "Add a phone to verify"}</button>}
        </div></div>
      </Card>

      <Card icon={ShieldCheck} title="Security & Privacy" desc="Keep your account and company data safe with strong security settings." action={<Button variant="outline" onClick={() => onToast(`Security review: 2-step ${sec.twoStep ? "on" : "off"}, ${sec.sessions.length} active session(s).`)}><Lock />Review security</Button>}>
        <div className="pt-1">
          {row(KeyRound, "Password & authentication", "Manage your password and authentication methods", "pw")}
          {panel === "pw" && <div className="pb-4"><Button size="sm" onClick={() => setSec({ ...sec, pwAt: Date.now() }, "Password reset link sent (demo). Updated date recorded.")}>Reset password</Button></div>}
          {row(ShieldCheck, "Two-step verification", "Add an extra layer of security to your account", "2fa", <span className={`rounded-full px-3 py-1 text-xs font-medium ${sec.twoStep ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{sec.twoStep ? "Enabled" : "Disabled"}</span>)}
          {panel === "2fa" && <div className="flex items-center gap-3 pb-4 text-sm"><Switch checked={sec.twoStep} onCheckedChange={c => setSec({ ...sec, twoStep: c }, c ? "Two-step verification enabled." : "Two-step verification disabled.")} />Require a code at sign-in</div>}
          {row(Smartphone, "Active sessions", "View and manage devices that are signed in", "sess", <span className="text-sm">{sec.sessions.length} device{sec.sessions.length === 1 ? "" : "s"}</span>)}
          {panel === "sess" && <div className="space-y-2 pb-4">{sec.sessions.map((s, i) => <div key={s.id} className="flex items-center gap-3 text-sm"><Monitor size={16} className="text-muted-foreground" /><span className="mr-auto">{s.device}<span className="block text-xs text-muted-foreground">Last active {new Date(s.at).toLocaleString("en-GB")}</span></span>{i > 0 && <Button size="sm" variant="outline" onClick={() => setSec({ ...sec, sessions: sec.sessions.filter(x => x.id !== s.id) }, "Device signed out.")}>Sign out</Button>}</div>)}</div>}
          {row(Users, "Account access", "Manage who can access your company account", "team", <span className="text-sm">Hiring team · {sec.team} members</span>)}
          {panel === "team" && <div className="flex gap-2 pb-4"><Button size="sm" variant="outline" onClick={() => setSec({ ...sec, team: sec.team + 1 }, "Team invite sent (demo).")}>Invite member</Button><Button size="sm" variant="outline" disabled={sec.team <= 1} onClick={() => setSec({ ...sec, team: sec.team - 1 }, "Member removed.")}>Remove member</Button></div>}
        </div>
      </Card>

      <Card icon={Bell} title="Hiring Notifications" desc="Stay updated with important hiring activity and candidate updates.">
        {([[Send, "email", "New application alerts", "Get notified when a new candidate applies for your jobs."], [CalendarDays, "interviews", "Interview reminders", "Receive reminders for upcoming interviews."], [Mail, "digest", "Weekly hiring digest", "Get a summary of your weekly hiring activity."], [UserRound, "status", "Candidate status updates", "Be notified when a candidate's status changes."]] as const).map(([I, k, l, d]) => <div key={k} className="flex items-center gap-4 border-b border-border py-4"><I size={18} className="shrink-0 text-muted-foreground" /><label htmlFor={`n-${k}`} className="mr-auto"><span className="block text-sm font-semibold">{l}</span><span className="block text-xs text-muted-foreground">{d}</span></label><Switch id={`n-${k}`} checked={!!prefs[k]} onCheckedChange={c => setPrefs({ ...prefs, [k]: c })} /></div>)}
        <div className="flex items-center justify-end gap-3 pt-4">{dirty && <span className="text-xs text-muted-foreground">Unsaved changes</span>}<Button disabled={!dirty} onClick={() => { onChange({ ...state, preferences: prefs }); onToast("Notification preferences saved."); }}>Save changes</Button></div>
      </Card>
    </div>
  </div>;
}
