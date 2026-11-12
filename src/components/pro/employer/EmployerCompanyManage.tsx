import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import {
  AlertCircle, Building2, Eye, ExternalLink, ImagePlus, Loader2, Mail, Phone, Plus, Save, Settings2, Sparkles, Trash2, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CompanyProfileView } from "@/components/company/CompanyProfileView";
import { profileToCompanyView } from "@/components/company/companyView";
import { supabase } from "@/integrations/supabase/client";
import { getEmployerSettings, saveEmployerSettings, type EmployerSettings } from "@/services/employer/ats";
import { fetchCompanyJobs, getEmployerProfile, saveEmployerProfile, type CompanyJobRow, type EmployerProfileData } from "@/services/employer/profile";
import { ErrorState, Loading, PageHeader } from "./employerUi";

interface Props {
  searchParams: URLSearchParams;
  onToast: (message: string) => void;
  /** Lets the shell refresh its cached company name/logo after a save. */
  onSaved?: (profile: EmployerProfileData) => void;
}

const SIZES = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];
const TYPES = ["Private Limited", "Public Limited", "Startup", "MNC", "Government", "Non-profit", "Partnership", "Proprietorship"];
const SOCIAL_KEYS = ["linkedin", "twitter", "facebook", "instagram", "youtube", "github"] as const;

type Form = {
  company_name: string; industry: string; company_category: string; company_type: string; num_employees: string; established_year: string;
  website: string; description: string; mission: string; hq_city: string; address: string; multiple_locations: string[];
  contact_name: string; official_email: string; phone: string; alt_emails: string[]; alt_phones: string[];
  social_links: Record<string, string>; benefits: string[]; hiring_regions: string[]; culture_tags: string[];
  logo_url: string; cover_url: string; slug: string; gstin: string; pan: string; registration_type: string;
};

const toForm = (p: EmployerProfileData): Form => ({
  company_name: p.company_name ?? "", industry: p.industry ?? "", company_category: p.company_category ?? "", company_type: p.company_type ?? "",
  num_employees: p.num_employees ?? "", established_year: p.established_year ? String(p.established_year) : "", website: p.website ?? "",
  description: p.description ?? "", mission: p.mission ?? "", hq_city: p.hq_city ?? "", address: p.address ?? "",
  multiple_locations: p.multiple_locations ?? [], contact_name: p.contact_name ?? "", official_email: p.official_email ?? "", phone: p.phone ?? "",
  alt_emails: p.alt_emails ?? [], alt_phones: p.alt_phones ?? [], social_links: p.social_links ?? {}, benefits: p.benefits ?? [],
  hiring_regions: p.hiring_regions ?? [], culture_tags: p.culture_tags ?? [], logo_url: p.logo_url ?? "", cover_url: p.cover_url ?? "",
  slug: p.slug ?? "", gstin: p.gstin ?? "", pan: p.pan ?? "", registration_type: p.registration_type ?? "",
});

function Panel({ icon, title, desc, children, highlight, id }: { icon: ReactNode; title: string; desc: string; children: ReactNode; highlight?: boolean; id?: string }) {
  return (
    <section id={id} className={`workspace-panel scroll-mt-24 ${highlight ? "!border-primary/50 !bg-primary/[0.03] shadow-sm" : ""}`}>
      <div className="workspace-section-title">
        <span className="workspace-icon">{icon}</span>
        <div><h2>{title}</h2><p>{desc}</p></div>
      </div>
      {children}
    </section>
  );
}

/** Add / remove list editor used for emails, phones, benefits, regions and locations. */
function ListEditor({ label, items, onChange, placeholder, type = "text", validate, icon }: {
  label: string; items: string[]; onChange: (next: string[]) => void; placeholder: string; type?: string; validate?: (v: string) => string | null; icon?: ReactNode;
}) {
  const [draft, setDraft] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const add = () => {
    const v = draft.trim();
    if (!v) return;
    const problem = validate?.(v) ?? null;
    if (problem) return setErr(problem);
    if (items.some((i) => i.toLowerCase() === v.toLowerCase())) return setErr("Already added.");
    onChange([...items, v]);
    setDraft("");
    setErr(null);
  };
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold">{label}</p>
      {items.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label={label}>
          {items.map((i) => (
            <li key={i} className="workspace-chip">
              {icon}{i}
              <button type="button" aria-label={`Remove ${i}`} className="ml-1 cursor-pointer rounded-full hover:text-destructive" onClick={() => onChange(items.filter((x) => x !== i))}><X className="h-3 w-3" /></button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <Input type={type} value={draft} placeholder={placeholder} aria-label={`Add ${label}`} onChange={(e) => { setDraft(e.target.value); setErr(null); }}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} />
        <Button type="button" variant="outline" onClick={add}><Plus className="mr-1 h-4 w-4" />Add</Button>
      </div>
      {err && <p role="alert" className="text-xs text-destructive">{err}</p>}
    </div>
  );
}

const emailOk = (v: string) => (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) ? null : "Enter a valid email address.");
const phoneOk = (v: string) => (/^\+?[0-9][0-9 ()-]{6,18}$/.test(v) ? null : "Enter a valid phone number.");

export function EmployerCompanyManage({ searchParams, onToast, onSaved }: Props) {
  const [profile, setProfile] = useState<EmployerProfileData | null>(null);
  const [form, setForm] = useState<Form | null>(null);
  const [settings, setSettings] = useState<EmployerSettings | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"logo" | "cover" | null>(null);
  const [preview, setPreview] = useState(false);
  const [previewJobs, setPreviewJobs] = useState<CompanyJobRow[]>([]);
  const logoInput = useRef<HTMLInputElement>(null);
  const coverInput = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [p, s] = await Promise.all([getEmployerProfile(), getEmployerSettings()]);
      if (!p) throw new Error("No company profile found for this account.");
      setProfile(p);
      setForm(toForm(p));
      setSettings(s);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load your company profile.");
    }
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { if (searchParams.get("edit") === "1") document.getElementById("company-basics")?.scrollIntoView({ behavior: "smooth" }); }, [searchParams, form]);

  const dirty = useMemo(() => Boolean(profile && form && JSON.stringify(toForm(profile)) !== JSON.stringify(form)), [profile, form]);

  const set = <K extends keyof Form>(key: K, value: Form[K]) => setForm((f) => (f ? { ...f, [key]: value } : f));

  const upload = async (kind: "logo" | "cover", event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !profile?.tenant_id) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return onToast("Use a JPG, PNG or WebP image.");
    if (file.size > 2 * 1024 * 1024) return onToast("Images must be 2 MB or smaller.");
    setUploading(kind);
    try {
      const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
      const path = `${profile.tenant_id}/${kind}-${Date.now()}.${ext}`;
      const { error: upError } = await supabase.storage.from("company-logos").upload(path, file, { contentType: file.type, upsert: true });
      if (upError) throw new Error(upError.message);
      set(kind === "logo" ? "logo_url" : "cover_url", supabase.storage.from("company-logos").getPublicUrl(path).data.publicUrl);
      onToast(`${kind === "logo" ? "Logo" : "Cover image"} uploaded. Save to apply.`);
    } catch (e) {
      onToast(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(null);
    }
  };

  const save = async () => {
    if (!form) return;
    if (form.company_name.trim().length < 2) return onToast("Company name is required.");
    if (form.official_email && emailOk(form.official_email)) return onToast("Primary contact email is not valid.");
    if (form.phone && phoneOk(form.phone)) return onToast("Primary phone number is not valid.");
    if (form.website && !/^https?:\/\//i.test(form.website)) return onToast("Website must start with http:// or https://");
    if (form.established_year && (Number(form.established_year) < 1800 || Number(form.established_year) > new Date().getFullYear())) return onToast("Enter a valid founding year.");
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        company_name: form.company_name.trim(), industry: form.industry, company_category: form.company_category, company_type: form.company_type,
        num_employees: form.num_employees, website: form.website, description: form.description, mission: form.mission, hq_city: form.hq_city,
        address: form.address, multiple_locations: form.multiple_locations, contact_name: form.contact_name, official_email: form.official_email,
        phone: form.phone, alt_emails: form.alt_emails, alt_phones: form.alt_phones, benefits: form.benefits, hiring_regions: form.hiring_regions,
        culture_tags: form.culture_tags, social_links: Object.fromEntries(Object.entries(form.social_links).filter(([, v]) => v.trim())),
        logo_url: form.logo_url, cover_url: form.cover_url, registration_type: form.registration_type,
      };
      if (form.established_year) payload.established_year = Number(form.established_year);
      if (form.slug && form.slug !== profile?.slug) payload.slug = form.slug;
      if (form.gstin && form.gstin !== profile?.gstin) payload.gstin = form.gstin;
      if (form.pan && form.pan !== profile?.pan) payload.pan = form.pan;
      const saved = await saveEmployerProfile(payload as Partial<EmployerProfileData>);
      setProfile(saved);
      setForm(toForm(saved));
      onSaved?.(saved);
      onToast("Company profile saved.");
    } catch (e) {
      onToast(e instanceof Error ? e.message : "Could not save your profile.");
    } finally {
      setSaving(false);
    }
  };

  const saveSettings = async (patch: Parameters<typeof saveEmployerSettings>[0], message: string) => {
    try {
      setSettings(await saveEmployerSettings(patch));
      onToast(message);
    } catch (e) {
      onToast(e instanceof Error ? e.message : "Could not save this setting.");
    }
  };

  const openPreview = async () => {
    setPreview(true);
    if (profile) fetchCompanyJobs(profile.id).then(setPreviewJobs).catch(() => setPreviewJobs([]));
  };

  if (error) return <div className="employer-workspace"><ErrorState message={error} onRetry={load} /></div>;
  if (!form || !profile || !settings) return <div className="employer-workspace"><Loading label="Loading company profile" /></div>;

  const field = (label: string, key: keyof Form, props: { type?: string; placeholder?: string; maxLength?: number } = {}) => (
    <label className="workspace-field"><span>{label}</span>
      <Input value={form[key] as string} onChange={(e) => set(key, e.target.value as never)} {...props} /></label>
  );

  const completion = profile.profile_completion;

  return (
    <div className="employer-workspace space-y-5">
      <PageHeader
        eyebrow="Manage company profile"
        icon={<Building2 size={13} />}
        title="Company profile"
        description="This is your private workspace. What you save here is shown on your public company page."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => void openPreview()}><Eye className="mr-1.5 h-4 w-4" />Preview public page</Button>
            <Button variant="outline" size="sm" asChild><a href={`/company/${profile.slug}`} target="_blank" rel="noopener noreferrer"><ExternalLink className="mr-1.5 h-4 w-4" />Open public page</a></Button>
            <Button size="sm" disabled={!dirty || saving} onClick={() => void save()}>
              {saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}Save changes
            </Button>
          </>
        }
      />

      <div className="workspace-panel !p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="min-w-[200px] flex-1">
            <p className="text-xs font-semibold">Profile completeness: {completion}%</p>
            <progress className="mt-2 h-2 w-full" value={completion} max={100} aria-label="Profile completeness" />
          </div>
          {completion < 100 && <p className="flex items-center gap-2 text-xs text-muted-foreground"><AlertCircle className="h-4 w-4" />Jobs can be published once the required details are filled in.</p>}
        </div>
      </div>

      {/* Hiring settings: first and highlighted */}
      <Panel id="hiring-settings" highlight icon={<Sparkles />} title="Hiring settings" desc="Preferences that shape how you hire. Toggles and timings save immediately.">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4 border-b border-border py-3">
              <div><p className="text-sm font-semibold">Notify me about new applications</p><p className="text-xs text-muted-foreground">Get an alert as soon as someone applies.</p></div>
              <Switch aria-label="Notify me about new applications" checked={settings.notify_prefs.applications} onCheckedChange={(v) => void saveSettings({ notify_prefs: { applications: v } }, "Preference saved.")} />
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-border py-3">
              <div><p className="text-sm font-semibold">Follow-up reminders</p><p className="text-xs text-muted-foreground">Remind me about candidates waiting for a decision.</p></div>
              <Switch aria-label="Follow-up reminders" checked={settings.followups_enabled} onCheckedChange={(v) => void saveSettings({ followups_enabled: v }, v ? "Follow-ups enabled." : "Follow-ups paused.")} />
            </div>
            <label className="workspace-field pt-3"><span>Remind me about pending applications after</span>
              <select aria-label="Pending reminder days" value={settings.followup_pending_days} onChange={(e) => void saveSettings({ followup_pending_days: Number(e.target.value) }, "Reminder timing saved.")}>
                {[1, 2, 3, 5, 7, 14].map((n) => <option key={n} value={n}>{n} day{n === 1 ? "" : "s"}</option>)}
              </select></label>
          </div>
          <div className="space-y-5">
            <ListEditor label="Hiring regions" items={form.hiring_regions} onChange={(v) => set("hiring_regions", v)} placeholder="e.g. Bengaluru, Remote India" />
            <ListEditor label="Benefits offered" items={form.benefits} onChange={(v) => set("benefits", v)} placeholder="e.g. Health insurance" />
          </div>
        </div>
        {dirty && <p className="mt-4 text-xs text-muted-foreground">Regions and benefits are saved with “Save changes”.</p>}
      </Panel>

      {/* Branding */}
      <Panel icon={<ImagePlus />} title="Logo & cover image" desc="JPG, PNG or WebP up to 2 MB.">
        <div className="grid gap-6 md:grid-cols-[160px_1fr]">
          <div>
            <p className="mb-2 text-[11px] font-semibold">Logo</p>
            <div className="grid h-32 w-32 place-items-center overflow-hidden rounded-xl border border-border bg-muted">
              {form.logo_url ? <img src={form.logo_url} alt="Company logo" className="h-full w-full object-contain" /> : <Building2 className="h-8 w-8 text-muted-foreground" />}
            </div>
            <div className="mt-2 flex gap-2">
              <Button type="button" size="sm" variant="outline" disabled={uploading === "logo"} onClick={() => logoInput.current?.click()}>{uploading === "logo" ? <Loader2 className="h-4 w-4 animate-spin" /> : form.logo_url ? "Replace" : "Upload"}</Button>
              {form.logo_url && <Button type="button" size="icon" variant="ghost" aria-label="Remove logo" onClick={() => set("logo_url", "")}><Trash2 className="h-4 w-4" /></Button>}
            </div>
            <input ref={logoInput} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" aria-label="Upload logo" onChange={(e) => void upload("logo", e)} />
          </div>
          <div>
            <p className="mb-2 text-[11px] font-semibold">Cover image</p>
            <div className="grid h-32 w-full place-items-center overflow-hidden rounded-xl border border-border bg-muted">
              {form.cover_url ? <img src={form.cover_url} alt="Cover" className="h-full w-full object-cover" /> : <ImagePlus className="h-8 w-8 text-muted-foreground" />}
            </div>
            <div className="mt-2 flex gap-2">
              <Button type="button" size="sm" variant="outline" disabled={uploading === "cover"} onClick={() => coverInput.current?.click()}>{uploading === "cover" ? <Loader2 className="h-4 w-4 animate-spin" /> : form.cover_url ? "Replace" : "Upload"}</Button>
              {form.cover_url && <Button type="button" size="icon" variant="ghost" aria-label="Remove cover image" onClick={() => set("cover_url", "")}><Trash2 className="h-4 w-4" /></Button>}
            </div>
            <input ref={coverInput} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" aria-label="Upload cover image" onChange={(e) => void upload("cover", e)} />
          </div>
        </div>
      </Panel>

      <Panel id="company-basics" icon={<Building2 />} title="Company information" desc="Tell candidates who you are.">
        <div className="grid gap-4 md:grid-cols-2">
          {field("Company name *", "company_name", { maxLength: 200 })}
          {field("Industry", "industry", { placeholder: "e.g. Software" })}
          {field("Business category", "company_category", { placeholder: "e.g. B2B SaaS" })}
          <label className="workspace-field"><span>Company type</span>
            <select value={form.company_type} onChange={(e) => set("company_type", e.target.value)}><option value="">Select</option>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></label>
          <label className="workspace-field"><span>Company size</span>
            <select value={form.num_employees} onChange={(e) => set("num_employees", e.target.value)}><option value="">Select</option>{SIZES.map((t) => <option key={t}>{t}</option>)}</select></label>
          {field("Year established", "established_year", { type: "number", placeholder: "2015" })}
          {field("Website", "website", { placeholder: "https://example.com" })}
          {field("Headquarters (city)", "hq_city")}
        </div>
        <div className="mt-4 grid gap-4">
          <label className="workspace-field"><span>Company description</span>
            <Textarea rows={5} maxLength={5000} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="What does your company do and why would someone join?" /></label>
          <label className="workspace-field"><span>Mission</span>
            <Textarea rows={2} maxLength={2000} value={form.mission} onChange={(e) => set("mission", e.target.value)} /></label>
          <label className="workspace-field"><span>Company address</span>
            <Textarea rows={2} value={form.address} onChange={(e) => set("address", e.target.value)} /></label>
          <ListEditor label="Other office locations" items={form.multiple_locations} onChange={(v) => set("multiple_locations", v)} placeholder="Add a city" />
        </div>
      </Panel>

      <Panel icon={<Mail />} title="Contact details" desc="Add as many alternate emails and phone numbers as you need.">
        <div className="grid gap-4 md:grid-cols-3">
          {field("Contact person", "contact_name")}
          {field("Primary email *", "official_email", { type: "email" })}
          {field("Primary phone", "phone", { type: "tel", placeholder: "+91 98765 43210" })}
        </div>
        <div className="mt-5 grid gap-6 md:grid-cols-2">
          <ListEditor label="Alternate emails" items={form.alt_emails} onChange={(v) => set("alt_emails", v)} placeholder="hr@company.com" type="email" validate={emailOk} icon={<Mail className="h-3 w-3" />} />
          <ListEditor label="Alternate phone numbers" items={form.alt_phones} onChange={(v) => set("alt_phones", v)} placeholder="+91 …" type="tel" validate={phoneOk} icon={<Phone className="h-3 w-3" />} />
        </div>
        <label className="mt-5 flex items-center gap-3 text-xs">
          <Switch aria-label="Show contact details publicly" checked={settings.privacy.show_contact_public} onCheckedChange={(v) => void saveSettings({ privacy: { show_contact_public: v } }, "Privacy setting saved.")} />
          Show these contact details on my public company page
        </label>
      </Panel>

      <Panel icon={<ExternalLink />} title="Social links" desc="Shown on your public page.">
        <div className="grid gap-4 md:grid-cols-2">
          {SOCIAL_KEYS.map((k) => (
            <label key={k} className="workspace-field"><span className="capitalize">{k}</span>
              <Input value={form.social_links[k] ?? ""} placeholder={`https://${k}.com/…`} onChange={(e) => set("social_links", { ...form.social_links, [k]: e.target.value })} /></label>
          ))}
        </div>
      </Panel>

      {/* Advanced settings: below the main editing area */}
      <Panel id="advanced-settings" icon={<Settings2 />} title="Advanced settings" desc="Public address, culture tags and registration details.">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="workspace-field"><span>Public page address</span>
            <div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">/company/</span><Input value={form.slug} onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} /></div></label>
          {field("Registration type", "registration_type")}
          {field("GSTIN", "gstin", { placeholder: "22AAAAA0000A1Z5" })}
          {field("PAN", "pan", { placeholder: "ABCDE1234F" })}
        </div>
        <div className="mt-5"><ListEditor label="Culture tags" items={form.culture_tags} onChange={(v) => set("culture_tags", v)} placeholder="e.g. Remote-first" /></div>
      </Panel>

      <div className="sticky bottom-0 z-10 -mx-1 flex items-center justify-end gap-3 border-t border-border bg-background/95 p-3 backdrop-blur">
        {dirty && <span className="text-xs text-muted-foreground">You have unsaved changes</span>}
        <Button variant="outline" disabled={!dirty || saving} onClick={() => setForm(toForm(profile))}>Discard</Button>
        <Button disabled={!dirty || saving} onClick={() => void save()}>{saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}Save changes</Button>
      </div>

      <Dialog open={preview} onOpenChange={setPreview}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-5xl">
          <DialogHeader><DialogTitle>Public page preview</DialogTitle><DialogDescription>{dirty ? "Showing your unsaved changes." : "This is what candidates see."}</DialogDescription></DialogHeader>
          <CompanyProfileView
            company={profileToCompanyView({ ...profile, ...form, established_year: form.established_year ? Number(form.established_year) : null, verification_status: profile.verification_status }, settings.privacy.show_contact_public)}
            jobs={previewJobs.map((j) => ({ id: j.id, title: j.title, location: j.location, mode: j.mode, type: j.type, skills: j.skills }))}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
