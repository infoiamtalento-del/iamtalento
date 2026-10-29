import type { ProUser } from "@/data/proData";
import { supabase } from "@/integrations/supabase/client";
import { rpc } from "@/services/db";

/** Shape returned by `load_candidate_profile()` / `save_candidate_profile()`. */
export interface LiveProfile {
  profile: {
    id: string;
    iam_talento_id: string;
    email: string | null;
    full_name: string | null;
    phone: string | null;
    headline: string | null;
    about: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    job_role: string | null;
    company: string | null;
    industry: string | null;
    years_of_experience: number | null;
    experience_level: string | null;
    open_to_work: boolean | null;
    preferred_locations: string[] | null;
    preferred_salary_range: string | null;
    notice_period: string | null;
    availability_status: string | null;
    linkedin_url: string | null;
    github_url: string | null;
    portfolio_url: string | null;
    profile_photo_url: string | null;
    resume_url: string | null;
    resume_path: string | null;
    portfolio_slug: string | null;
    profile_visibility: "public" | "applied_only" | "private";
    notification_prefs: Record<string, boolean> | null;
    profile_completion: number;
    readiness: number | null;
    referral_code: string;
    referral_claimed: boolean;
    created_at?: string;
  };
  skills: { name: string; level: string | null; category?: string | null; years?: number | null; verified: boolean }[];
  experiences: { title: string; company: string; start: string | null; end: string | null; description: string | null }[];
  educations: { degree: string; institution: string; year: string | null }[];
  certifications: { name: string; verified: boolean; issuer?: string | null }[];
  projects: { title: string; description: string | null; url: string | null; tools: string | null; impact: string | null }[];
  languages: { name: string; level: string | null }[];
  shell_state: Record<string, any> | null;
  verification: {
    profile_status: string;
    identity_status: string | null;
    face_match: string | null;
    rejection_reason: string | null;
    submitted_at: string | null;
  };
  latest_cir: { id: string; score: number; tier: string; percentile: number; generated_at?: string } | null;
}

/** Keys owned by dedicated tables or the server; never round-tripped through shell_state. */
const MAPPED_KEYS: (keyof ProUser)[] = [
  "sk", "sl", "ex", "ed", "ce", "pj", "lg", "name", "avatar", "email", "exp", "city", "state", "head", "about", "ph", "phone", "links",
  "role", "pw", "wal", "saved", "ver", "vr", "as", "seen", "privacyVisibility", "emailAlerts", "smsAlerts", "marketingEmails", "loginAlerts", "st",
];

const capitalise = (s: string | null | undefined) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s ?? undefined);
const httpOnly = (u?: string | null): string | null => (u && /^https?:\/\//i.test(u.trim()) ? u.trim() : null);
const yearOf = (d: string | null) => (d ? d.slice(0, 4) : "");

/** Database profile -> the user object the Pro screens already understand. */
export function toProUser(live: LiveProfile, base?: Partial<ProUser>): ProUser {
  const p = live.profile;
  const prefs = p.notification_prefs ?? {};
  const sl: Record<string, string> = {};
  live.skills.forEach((s) => { if (s.level) sl[s.name] = capitalise(s.level)!; });
  const shell = (live.shell_state ?? {}) as Partial<ProUser>;

  return {
    ...(base ?? {}),
    ...shell,
    email: p.email ?? base?.email ?? "",
    role: "candidate",
    name: p.full_name || base?.name || (p.email ? p.email.split("@")[0] : "Candidate"),
    avatar: p.profile_photo_url ?? base?.avatar,
    exp: p.years_of_experience ?? 0,
    city: p.city ?? undefined,
    state: p.state ?? undefined,
    head: p.headline || p.job_role || undefined,
    tag: p.industry ?? (shell as any)?.tag ?? undefined,
    about: p.about ?? undefined,
    ph: p.phone ?? undefined,
    phone: p.phone ?? undefined,
    st: p.open_to_work === false ? "Not looking" : shell.st || "Actively looking",
    sk: live.skills.map((s) => s.name),
    sl,
    ex: live.experiences.map((e) => ({
      co: e.company,
      role: e.title,
      fr: yearOf(e.start),
      to: e.end && e.end !== "Present" ? yearOf(e.end) : "Present",
      d: e.description ?? "",
    })),
    ed: live.educations.map((e) => ({ sc: e.institution, dg: e.degree, yr: e.year ?? "" })),
    ce: live.certifications.map((c) => c.name),
    pj: live.projects.map((j) => ({
      t: j.title,
      l: j.url ?? undefined,
      d: j.description ?? undefined,
      s: j.tools ?? undefined,
      m: j.impact ?? undefined,
    })),
    lg: live.languages.map((l) => ({ n: l.name, lv: l.level ?? "" })),
    links: {
      li: p.linkedin_url ?? undefined,
      gh: p.github_url ?? undefined,
      pf: p.portfolio_url ?? undefined,
    },
    privacyVisibility: p.profile_visibility,
    emailAlerts: prefs.email ?? true,
    smsAlerts: prefs.sms ?? false,
    marketingEmails: prefs.marketing ?? false,
    loginAlerts: prefs.login_alerts ?? true,
    ver: { id: live.verification.identity_status === "verified", test: Boolean(live.latest_cir), exp: false },
    vr: live.verification.profile_status === "verified" ? { at: Date.now(), id: p.iam_talento_id } : undefined,
    as: live.latest_cir ? { "CIR composite": Math.round(Number(live.latest_cir.score)) } : (base?.as ?? {}),
    saved: base?.saved ?? [],
    wal: base?.wal ?? { bal: 0, hist: [] },
  } as ProUser;
}

/** Shell user -> payload for `save_candidate_profile`. */
export function fromProUser(u: ProUser) {
  const shell: Record<string, unknown> = {};
  (Object.keys(u) as (keyof ProUser)[]).forEach((k) => {
    if (!MAPPED_KEYS.includes(k)) shell[k] = u[k];
  });

  return {
    profile: {
      full_name: u.name,
      phone: u.ph || u.phone || "",
      headline: u.head ?? "",
      about: u.about ?? "",
      city: u.city ?? "",
      state: u.state ?? "",
      ...(u.tag ? { industry: u.tag } : {}),
      years_of_experience: Number.isFinite(u.exp) ? u.exp : 0,
      open_to_work: u.st !== "Not looking",
      preferred_locations: u.pf?.loc ? u.pf.loc.split(",").map((s) => s.trim()).filter(Boolean) : [],
      linkedin_url: httpOnly(u.links?.li) ?? "",
      github_url: httpOnly(u.links?.gh) ?? "",
      portfolio_url: httpOnly(u.links?.pf) ?? "",
      ...(u.avatar !== undefined ? { profile_photo_url: httpOnly(u.avatar) ?? "" } : {}),
      profile_visibility: u.privacyVisibility ?? "public",
      notification_prefs: {
        email: u.emailAlerts ?? true,
        sms: u.smsAlerts ?? false,
        marketing: u.marketingEmails ?? false,
        login_alerts: u.loginAlerts ?? true,
      },
    },
    skills: (u.sk ?? []).map((name) => ({ name, level: u.sl?.[name]?.toLowerCase() ?? null })),
    experiences: (u.ex ?? []).map((e) => ({ title: e.role, company: e.co, start: e.fr, end: e.to, description: e.d })),
    educations: (u.ed ?? []).map((e) => ({ degree: e.dg, institution: e.sc, year: e.yr })),
    certifications: u.ce ?? [],
    projects: (u.pj ?? []).map((p) => ({ title: p.t, url: httpOnly(p.l), description: p.d, tools: p.s, impact: p.m })),
    languages: (u.lg ?? []).map((l) => ({ name: l.n, level: l.lv })),
    shell_state: shell,
  };
}

export const loadLiveProfile = () => rpc<LiveProfile | null>("load_candidate_profile");
export const saveLiveProfile = (u: ProUser) => rpc<LiveProfile>("save_candidate_profile", { p: fromProUser(u) });
export const saveCandidatePayload = (payload: Record<string, unknown>) =>
  rpc<LiveProfile>("save_candidate_profile", { p: payload });

export async function setPortfolioSlug(slug: string | null) {
  return rpc<LiveProfile>("save_candidate_profile", { p: { profile: { portfolio_slug: slug } } });
}

export const fetchPublicPortfolio = (slug: string) =>
  rpc<Record<string, any> | null>("get_public_portfolio", { p_slug: slug });

/**
 * Uploads a JPG/PNG/WEBP profile picture to Supabase Storage (`profile-photos`)
 * and returns the public CDN URL.
 */
export async function uploadProfilePhotoFile(file: File, userId: string): Promise<string> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error("Please upload a JPG, PNG, or WEBP image.");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Profile photo must be under 5 MB.");
  }
  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `${userId}/avatar-${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from("profile-photos")
    .upload(path, file, { contentType: file.type, upsert: true });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from("profile-photos").getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Uploads a PDF or DOCX resume to private Supabase Storage (`resumes`)
 * and returns the storage path + a signed preview/download URL.
 */
export async function uploadResumeFile(
  file: File,
  userId: string
): Promise<{ path: string; signedUrl: string }> {
  const allowed = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const isDocxExt = /\.docx$/i.test(file.name);
  const isPdfExt = /\.pdf$/i.test(file.name);
  if (!allowed.includes(file.type) && !isPdfExt && !isDocxExt) {
    throw new Error("Please upload a PDF or DOCX resume file.");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Resume file must be under 5 MB.");
  }
  const ext = isDocxExt || file.type.includes("wordprocessingml") ? "docx" : "pdf";
  const contentType =
    ext === "docx"
      ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      : "application/pdf";
  const path = `${userId}/resume-${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from("resumes")
    .upload(path, file, { contentType, upsert: true });
  if (error) throw new Error(error.message);
  const { data: signed } = await supabase.storage.from("resumes").createSignedUrl(path, 3600);
  return { path, signedUrl: signed?.signedUrl || "" };
}

export async function getResumeSignedUrl(path: string | null | undefined): Promise<string | null> {
  if (!path) return null;
  const { data, error } = await supabase.storage.from("resumes").createSignedUrl(path, 3600);
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}
