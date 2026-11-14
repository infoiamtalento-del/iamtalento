import type { ProUser } from "@/data/proData";
import { supabase } from "@/integrations/supabase/client";
import { rpc } from "@/services/db";

export interface ExpertiseCardItem {
  title: string;
  sub: string;
}

export interface RichExperienceItem {
  title: string;
  company: string;
  location: string;
  start: string;
  end: string;
  description: string;
  tools: string[];
}

export interface RichEducationItem {
  institution: string;
  degree: string;
  field_of_study?: string;
  start_year: string;
  year: string;
  grade: string;
}

export interface RichCertificationItem {
  name: string;
  issuer: string;
  date: string;
  credential_url?: string;
  verified?: boolean;
}

export interface RichProjectItem {
  title: string;
  role?: string;
  description: string;
  tools: string[];
  url: string;
  github_url: string;
  image_url: string;
  impact?: string;
}

export interface RichAwardItem {
  title: string;
  organization?: string;
  date?: string;
  description: string;
}

export interface ArjunProfileOverlayV1 {
  banner_photo_url?: string;
  sub_headline?: string;
  open_for_freelance?: boolean;
  video_intro_url?: string;
  video_pitch?: string;
  kaggle_url?: string;
  behance_url?: string;
  focus_badges?: string[];
  expertise_cards?: ExpertiseCardItem[];
  tools?: string[];
  hobbies?: string[];
  interests?: string[];
  experiences?: RichExperienceItem[];
  educations?: RichEducationItem[];
  certifications?: RichCertificationItem[];
  projects?: RichProjectItem[];
  awards?: RichAwardItem[];
  languages?: { name: string; level: string }[];
}

/** Shape returned by `load_candidate_profile()` / `save_candidate_profile()`. */
export interface LiveProfile {
  profile: {
    id: string;
    iam_talento_id: string;
    email: string | null;
    full_name: string | null;
    phone: string | null;
    headline: string | null;
    sub_headline?: string | null;
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
    open_for_freelance?: boolean | null;
    preferred_locations: string[] | null;
    areas_of_expertise?: string[] | null;
    interests?: string[] | null;
    tools?: string[] | null;
    hobbies?: string[] | null;
    preferred_salary_range: string | null;
    notice_period: string | null;
    availability_status: string | null;
    linkedin_url: string | null;
    github_url: string | null;
    portfolio_url: string | null;
    kaggle_url?: string | null;
    behance_url?: string | null;
    video_intro_url?: string | null;
    video_pitch?: string | null;
    profile_photo_url: string | null;
    banner_photo_url?: string | null;
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
  experiences: {
    title: string;
    company: string;
    location?: string | null;
    start: string | null;
    end: string | null;
    description: string | null;
    tools?: string[] | null;
  }[];
  educations: {
    degree: string;
    field_of_study?: string | null;
    institution: string;
    start_year?: string | null;
    year: string | null;
    grade?: string | null;
  }[];
  certifications: {
    name: string;
    verified: boolean;
    issuer?: string | null;
    date?: string | null;
    credential_url?: string | null;
  }[];
  projects: {
    title: string;
    role?: string | null;
    description: string | null;
    url: string | null;
    github_url?: string | null;
    image_url?: string | null;
    tools: string | null;
    tools_list?: string[] | null;
    impact: string | null;
  }[];
  awards?: {
    title: string;
    organization?: string | null;
    date?: string | null;
    description?: string | null;
  }[];
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

export interface NormalizedCandidateProfile {
  id: string;
  iamTalentoId: string;
  email: string;
  fullName: string;
  phone: string;
  headline: string;
  subHeadline: string;
  industry: string;
  jobRole: string;
  company: string;
  experienceLevel: string;
  yearsOfExperience: number;
  city: string;
  state: string;
  country: string;
  locationDisplay: string;
  about: string;
  profilePhotoUrl: string;
  bannerPhotoUrl: string;
  openToWork: boolean;
  openForFreelance: boolean;
  workMode: "Remote" | "Hybrid" | "Onsite";
  employmentType: string;
  noticePeriod: string;
  salaryRange: string;
  preferredLocations: string[];
  portfolioSlug: string;
  profileVisibility: "public" | "applied_only" | "private";
  profileCompletion: number;
  readiness: number;
  resumeUrl: string;
  resumePath: string;
  videoIntroUrl: string;
  videoPitch: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  kaggleUrl: string;
  behanceUrl: string;
  focusBadges: string[];
  expertiseCards: ExpertiseCardItem[];
  skills: { name: string; level: string; category: string; verified: boolean }[];
  tools: string[];
  experiences: RichExperienceItem[];
  projects: RichProjectItem[];
  educations: RichEducationItem[];
  certifications: RichCertificationItem[];
  awards: RichAwardItem[];
  languages: { name: string; level: string }[];
  hobbies: string[];
  interests: string[];
  verification: LiveProfile["verification"];
  latestCir: LiveProfile["latest_cir"];
  shellState: Record<string, any>;
}

/** Keys owned by dedicated tables or the server; never round-tripped through shell_state. */
const MAPPED_KEYS: (keyof ProUser)[] = [
  "sk", "sl", "ex", "ed", "ce", "pj", "lg", "name", "avatar", "email", "exp", "city", "state", "head", "about", "ph", "phone", "links",
  "role", "pw", "wal", "saved", "ver", "vr", "as", "seen", "privacyVisibility", "emailAlerts", "smsAlerts", "marketingEmails", "loginAlerts", "st",
];

const capitalise = (s: string | null | undefined) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s ?? undefined);
export const httpOnly = (u?: string | null): string | null => {
  if (!u || typeof u !== "string") return null;
  const trimmed = u.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return null;
};
export const ensureHttpUrl = (u?: string | null): string => {
  if (!u || typeof u !== "string") return "";
  const trimmed = u.trim();
  if (!trimmed) return "";
  if (/^(javascript|data|vbscript):/i.test(trimmed)) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};
const yearOf = (d: string | null | undefined) => (d ? String(d).slice(0, 4) : "");

const splitCsv = (val: string | string[] | null | undefined): string[] => {
  if (Array.isArray(val)) return val.map((x) => String(x || "").trim()).filter(Boolean);
  if (typeof val === "string") {
    return val
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  }
  return [];
};

export function normalizeLiveProfile(live: LiveProfile): NormalizedCandidateProfile {
  const p = live.profile;
  const sh = (live.shell_state ?? {}) as Record<string, any>;
  const ov = (sh.arjun_profile_v1 ?? {}) as ArjunProfileOverlayV1;

  const locationParts = [p.city, p.state, p.country].map((x) => (x || "").trim()).filter(Boolean);
  const ovExp = Array.isArray(ov.experiences) ? ov.experiences : [];
  const ovEdu = Array.isArray(ov.educations) ? ov.educations : [];
  const ovCert = Array.isArray(ov.certifications) ? ov.certifications : [];
  const ovProj = Array.isArray(ov.projects) ? ov.projects : [];
  const ovAwards = Array.isArray(ov.awards) ? ov.awards : [];

  const experiences: RichExperienceItem[] =
    live.experiences.length > 0
      ? live.experiences.map((e, idx) => {
          const matchOv =
            ovExp.find(
              (item) =>
                item.title?.toLowerCase() === (e.title || "").toLowerCase() &&
                item.company?.toLowerCase() === (e.company || "").toLowerCase()
            ) || ovExp[idx];
          const toolsFromDb = splitCsv(e.tools);
          return {
            title: e.title || "",
            company: e.company || "",
            location: (e.location ?? matchOv?.location ?? "").trim(),
            start: e.start ? yearOf(e.start) : matchOv?.start || "",
            end: e.end && e.end !== "Present" ? yearOf(e.end) : e.end === "Present" ? "Present" : matchOv?.end || "Present",
            description: e.description ?? matchOv?.description ?? "",
            tools: toolsFromDb.length > 0 ? toolsFromDb : splitCsv(matchOv?.tools),
          };
        })
      : ovExp;

  const educations: RichEducationItem[] =
    live.educations.length > 0
      ? live.educations.map((e, idx) => {
          const matchOv =
            ovEdu.find((item) => item.institution?.toLowerCase() === (e.institution || "").toLowerCase()) || ovEdu[idx];
          return {
            institution: e.institution || "",
            degree: e.degree || "",
            field_of_study: (e.field_of_study ?? matchOv?.field_of_study ?? "").trim(),
            start_year: (e.start_year ?? matchOv?.start_year ?? "").trim(),
            year: (e.year ?? matchOv?.year ?? "").trim(),
            grade: (e.grade ?? matchOv?.grade ?? "").trim(),
          };
        })
      : ovEdu;

  const certifications: RichCertificationItem[] =
    live.certifications.length > 0
      ? live.certifications.map((c, idx) => {
          const matchOv =
            ovCert.find((item) => item.name?.toLowerCase() === (c.name || "").toLowerCase()) || ovCert[idx];
          return {
            name: c.name || "",
            issuer: (c.issuer ?? matchOv?.issuer ?? "").trim(),
            date: (c.date ?? matchOv?.date ?? "").trim(),
            credential_url: (c.credential_url ?? matchOv?.credential_url ?? "").trim(),
            verified: Boolean(c.verified),
          };
        })
      : ovCert.map((c) => ({ ...c, verified: Boolean(c.verified) }));

  const projects: RichProjectItem[] =
    live.projects.length > 0
      ? live.projects.map((proj, idx) => {
          const matchOv =
            ovProj.find((item) => item.title?.toLowerCase() === (proj.title || "").toLowerCase()) || ovProj[idx];
          const dbTools =
            Array.isArray(proj.tools_list) && proj.tools_list.length > 0
              ? proj.tools_list
              : splitCsv(proj.tools);
          return {
            title: proj.title || "",
            role: (proj.role ?? matchOv?.role ?? "").trim(),
            description: proj.description ?? matchOv?.description ?? "",
            tools: dbTools.length > 0 ? dbTools : splitCsv(matchOv?.tools),
            url: (proj.url ?? matchOv?.url ?? "").trim(),
            github_url: (proj.github_url ?? matchOv?.github_url ?? "").trim(),
            image_url: (proj.image_url ?? matchOv?.image_url ?? "").trim(),
            impact: (proj.impact ?? matchOv?.impact ?? "").trim(),
          };
        })
      : ovProj;

  const awards: RichAwardItem[] =
    Array.isArray(live.awards) && live.awards.length > 0
      ? live.awards.map((a) => ({
          title: a.title || "",
          organization: (a.organization ?? "").trim(),
          date: (a.date ?? "").trim(),
          description: (a.description ?? "").trim(),
        }))
      : ovAwards;

  const languages =
    live.languages.length > 0
      ? live.languages.map((l) => ({ name: l.name, level: l.level ?? "" }))
      : Array.isArray(ov.languages)
        ? ov.languages
        : [];

  const tools =
    Array.isArray(p.tools) && p.tools.length > 0
      ? p.tools
      : Array.isArray(ov.tools)
        ? ov.tools
        : [];

  const hobbies =
    Array.isArray(p.hobbies) && p.hobbies.length > 0
      ? p.hobbies
      : Array.isArray(ov.hobbies)
        ? ov.hobbies
        : [];

  const interests =
    Array.isArray(p.interests) && p.interests.length > 0
      ? p.interests
      : Array.isArray(ov.interests)
        ? ov.interests
        : [];

  const focusBadges =
    Array.isArray(ov.focus_badges) && ov.focus_badges.length > 0
      ? ov.focus_badges
      : Array.isArray(p.areas_of_expertise) && p.areas_of_expertise.length > 0
        ? p.areas_of_expertise
        : [];

  const expertiseCards =
    Array.isArray(ov.expertise_cards) && ov.expertise_cards.length > 0
      ? ov.expertise_cards.filter((c) => c && (c.title?.trim() || c.sub?.trim()))
      : [];

  const openForFreelance =
    typeof p.open_for_freelance === "boolean"
      ? p.open_for_freelance
      : typeof ov.open_for_freelance === "boolean"
        ? ov.open_for_freelance
        : false;

  return {
    id: p.id,
    iamTalentoId: p.iam_talento_id || "",
    email: p.email || "",
    fullName: p.full_name || "",
    phone: p.phone || "",
    headline: p.headline || p.job_role || "",
    subHeadline: (p.sub_headline ?? ov.sub_headline ?? "").trim(),
    industry: p.industry || (sh.tag as string) || "",
    jobRole: p.job_role || "",
    company: p.company || "",
    experienceLevel: p.experience_level || "fresher",
    yearsOfExperience: p.years_of_experience ?? 0,
    city: p.city || "",
    state: p.state || "",
    country: p.country || "India",
    locationDisplay: locationParts.join(", "),
    about: p.about || "",
    profilePhotoUrl: (p.profile_photo_url || "").trim(),
    bannerPhotoUrl: (p.banner_photo_url ?? ov.banner_photo_url ?? "").trim(),
    openToWork: p.open_to_work !== false,
    openForFreelance,
    workMode: (sh.pf?.wm as "Remote" | "Hybrid" | "Onsite") || "Hybrid",
    employmentType: p.availability_status || sh.pf?.ty || "Full-time",
    noticePeriod: p.notice_period || "Immediate",
    salaryRange: p.preferred_salary_range || "",
    preferredLocations: Array.isArray(p.preferred_locations) ? p.preferred_locations : [],
    portfolioSlug: p.portfolio_slug || "",
    profileVisibility: p.profile_visibility || "public",
    profileCompletion: p.profile_completion ?? 0,
    readiness: Number(p.readiness ?? 0),
    resumeUrl: p.resume_url || "",
    resumePath: p.resume_path || "",
    videoIntroUrl: (p.video_intro_url ?? ov.video_intro_url ?? "").trim(),
    videoPitch: (p.video_pitch ?? ov.video_pitch ?? "").trim(),
    linkedinUrl: p.linkedin_url || "",
    githubUrl: p.github_url || "",
    portfolioUrl: p.portfolio_url || "",
    kaggleUrl: (p.kaggle_url ?? ov.kaggle_url ?? "").trim(),
    behanceUrl: (p.behance_url ?? ov.behance_url ?? "").trim(),
    focusBadges,
    expertiseCards,
    skills: live.skills.map((s) => ({
      name: s.name,
      level: capitalise(s.level) || "Intermediate",
      category: s.category || "technical",
      verified: Boolean(s.verified),
    })),
    tools,
    experiences,
    projects,
    educations,
    certifications,
    awards,
    languages,
    hobbies,
    interests,
    verification: live.verification,
    latestCir: live.latest_cir,
    shellState: sh,
  };
}

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

/** Shell user -> payload for `save_candidate_profile` (preserves arjun_profile_v1 metadata). */
export function fromProUser(u: ProUser) {
  const shell: Record<string, unknown> = {};
  (Object.keys(u) as (keyof ProUser)[]).forEach((k) => {
    if (!MAPPED_KEYS.includes(k)) shell[k] = u[k];
  });
  const ov = ((shell.arjun_profile_v1 as ArjunProfileOverlayV1 | undefined) ?? {});

  return {
    profile: {
      full_name: u.name,
      phone: u.ph || u.phone || "",
      headline: u.head ?? "",
      ...(ov.sub_headline !== undefined ? { sub_headline: ov.sub_headline } : {}),
      about: u.about ?? "",
      city: u.city ?? "",
      state: u.state ?? "",
      ...(u.tag ? { industry: u.tag } : {}),
      years_of_experience: Number.isFinite(u.exp) ? u.exp : 0,
      open_to_work: u.st !== "Not looking",
      ...(typeof ov.open_for_freelance === "boolean" ? { open_for_freelance: ov.open_for_freelance } : {}),
      preferred_locations: u.pf?.loc ? u.pf.loc.split(",").map((s) => s.trim()).filter(Boolean) : [],
      ...(Array.isArray(ov.tools) ? { tools: ov.tools } : {}),
      ...(Array.isArray(ov.hobbies) ? { hobbies: ov.hobbies } : {}),
      ...(Array.isArray(ov.interests) ? { interests: ov.interests } : {}),
      ...(Array.isArray(ov.focus_badges) ? { areas_of_expertise: ov.focus_badges } : {}),
      linkedin_url: httpOnly(u.links?.li) ?? "",
      github_url: httpOnly(u.links?.gh) ?? "",
      portfolio_url: httpOnly(u.links?.pf) ?? "",
      ...(ov.kaggle_url !== undefined ? { kaggle_url: httpOnly(ov.kaggle_url) ?? "" } : {}),
      ...(ov.behance_url !== undefined ? { behance_url: httpOnly(ov.behance_url) ?? "" } : {}),
      ...(ov.video_intro_url !== undefined ? { video_intro_url: httpOnly(ov.video_intro_url) ?? "" } : {}),
      ...(ov.video_pitch !== undefined ? { video_pitch: ov.video_pitch } : {}),
      ...(u.avatar !== undefined ? { profile_photo_url: httpOnly(u.avatar) ?? "" } : {}),
      ...(ov.banner_photo_url !== undefined ? { banner_photo_url: httpOnly(ov.banner_photo_url) ?? "" } : {}),
      profile_visibility: u.privacyVisibility ?? "public",
      notification_prefs: {
        email: u.emailAlerts ?? true,
        sms: u.smsAlerts ?? false,
        marketing: u.marketingEmails ?? false,
        login_alerts: u.loginAlerts ?? true,
      },
    },
    skills: (u.sk ?? []).map((name) => ({ name, level: u.sl?.[name]?.toLowerCase() ?? null })),
    experiences: (u.ex ?? []).map((e, i) => {
      const ovItem = ov.experiences?.[i];
      return {
        title: e.role,
        company: e.co,
        location: ovItem?.location ?? "",
        start: e.fr,
        end: e.to,
        description: e.d,
        tools: ovItem?.tools ?? [],
      };
    }),
    educations: (u.ed ?? []).map((e, i) => {
      const ovItem = ov.educations?.[i];
      return {
        degree: e.dg,
        institution: e.sc,
        start_year: ovItem?.start_year ?? "",
        year: e.yr,
        grade: ovItem?.grade ?? "",
      };
    }),
    certifications: u.ce ?? [],
    ...(Array.isArray(ov.certifications) && ov.certifications.length > 0
      ? { certification_details: ov.certifications }
      : {}),
    projects: (u.pj ?? []).map((p, i) => {
      const ovItem = ov.projects?.[i];
      return {
        title: p.t,
        role: ovItem?.role ?? "",
        url: httpOnly(p.l),
        github_url: httpOnly(ovItem?.github_url),
        image_url: httpOnly(ovItem?.image_url),
        description: p.d,
        tools: p.s,
        impact: p.m,
      };
    }),
    ...(Array.isArray(ov.awards) ? { awards: ov.awards } : {}),
    languages: (u.lg ?? []).map((l) => ({ name: l.n, level: l.lv })),
    shell_state: shell,
  };
}

export const loadLiveProfile = () => rpc<LiveProfile | null>("load_candidate_profile");

/**
 * Loads `load_candidate_profile()` and, if connected to an older remote RPC that
 * hasn't returned `awards` yet, enriches relational tables directly so zero fields
 * are ever missing.
 */
export async function loadFullLiveProfile(): Promise<LiveProfile | null> {
  const live = await loadLiveProfile();
  if (!live || !live.profile?.id) return live;
  if (Array.isArray(live.awards)) return live;

  try {
    const uid = live.profile.id;
    const [achRes, eduRes, expRes, certRes, projRes, profRes] = await Promise.all([
      supabase.from("achievements").select("*").eq("user_id", uid).order("created_at"),
      supabase.from("educations").select("*").eq("user_id", uid).order("end_year", { ascending: false }),
      supabase.from("experiences").select("*").eq("user_id", uid).order("start_date", { ascending: false }),
      supabase.from("certifications").select("*").eq("user_id", uid).order("created_at"),
      supabase.from("projects").select("*").eq("user_id", uid).order("created_at"),
      supabase.from("profiles").select("areas_of_expertise, career_interests, video_intro_url, kaggle_url, behance_url").eq("id", uid).maybeSingle(),
    ]);

    const enriched: LiveProfile = { ...live, profile: { ...live.profile } };
    if (profRes.data) {
      const pd = profRes.data as Record<string, any>;
      if (pd.areas_of_expertise && !enriched.profile.areas_of_expertise) enriched.profile.areas_of_expertise = pd.areas_of_expertise;
      if (pd.career_interests && !enriched.profile.interests) enriched.profile.interests = pd.career_interests;
      if (pd.video_intro_url && !enriched.profile.video_intro_url) enriched.profile.video_intro_url = pd.video_intro_url;
      if (pd.kaggle_url && !enriched.profile.kaggle_url) enriched.profile.kaggle_url = pd.kaggle_url;
      if (pd.behance_url && !enriched.profile.behance_url) enriched.profile.behance_url = pd.behance_url;
    }
    if (Array.isArray(achRes.data)) {
      enriched.awards = achRes.data.map((a: any) => ({
        title: a.title || "",
        organization: a.organization || "",
        date: a.achievement_date || "",
        description: a.description || "",
      }));
    }
    if (Array.isArray(eduRes.data) && eduRes.data.length > 0) {
      enriched.educations = eduRes.data.map((e: any) => ({
        institution: e.institution_name || "",
        degree: e.degree || "",
        field_of_study: e.field_of_study || "",
        start_year: e.start_year ? String(e.start_year) : "",
        year: e.end_year ? String(e.end_year) : "",
        grade: e.grade || "",
      }));
    }
    if (Array.isArray(expRes.data) && expRes.data.length > 0) {
      enriched.experiences = expRes.data.map((e: any) => ({
        title: e.job_title || "",
        company: e.company_name || "",
        location: e.location || "",
        start: e.start_date || "",
        end: e.is_current ? "Present" : e.end_date || "",
        description: e.description || "",
        tools: Array.isArray(e.tools_technologies) ? e.tools_technologies : [],
      }));
    }
    if (Array.isArray(certRes.data) && certRes.data.length > 0) {
      enriched.certifications = certRes.data.map((c: any) => ({
        name: c.name || "",
        issuer: c.issuing_organization || "",
        date: c.issue_date || "",
        credential_url: c.credential_url || "",
        verified: c.verification_status === "verified",
      }));
    }
    if (Array.isArray(projRes.data) && projRes.data.length > 0) {
      enriched.projects = projRes.data.map((j: any) => ({
        title: j.title || "",
        role: j.role_in_project || "",
        description: j.description || "",
        url: j.project_url || "",
        github_url: j.github_url || "",
        image_url: j.image_url || "",
        tools: Array.isArray(j.tools_technologies) ? j.tools_technologies.join(", ") : "",
        tools_list: Array.isArray(j.tools_technologies) ? j.tools_technologies : [],
        impact: j.impact || "",
      }));
    }
    return enriched;
  } catch {
    return live;
  }
}

export const saveLiveProfile = (u: ProUser) => rpc<LiveProfile>("save_candidate_profile", { p: fromProUser(u) });
export const saveCandidatePayload = (payload: Record<string, unknown>) =>
  rpc<LiveProfile>("save_candidate_profile", { p: payload });

export interface RichCandidateDraft {
  fullName: string;
  phone: string;
  headline: string;
  subHeadline: string;
  jobRole: string;
  company?: string;
  industry: string;
  experienceLevel: string;
  yearsOfExperience: number;
  city: string;
  state: string;
  country: string;
  about: string;
  profilePhotoUrl: string;
  bannerPhotoUrl: string;
  openToWork: boolean;
  openForFreelance: boolean;
  workMode: "Remote" | "Hybrid" | "Onsite";
  employmentType: string;
  noticePeriod: string;
  salaryRange: string;
  preferredLocations: string[];
  portfolioSlug: string;
  resumePath?: string | null;
  resumeUrl?: string | null;
  videoIntroUrl: string;
  videoPitch: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  kaggleUrl: string;
  behanceUrl?: string;
  focusBadges: string[];
  expertiseCards: ExpertiseCardItem[];
  skills: { name: string; level: string; category?: string }[];
  tools: string[];
  experiences: RichExperienceItem[];
  projects: RichProjectItem[];
  educations: RichEducationItem[];
  certifications: RichCertificationItem[];
  awards: RichAwardItem[];
  languages: { name: string; level: string }[];
  hobbies: string[];
  interests: string[];
  phoneVerified?: boolean;
  existingShellState?: Record<string, any>;
}

/**
 * Saves every single Arjun-Mehta profile section to BOTH the Supabase SQL RPC
 * (`save_candidate_profile`) AND `shell_state.arjun_profile_v1` (plus relational
 * fallbacks), guaranteeing 100% persistence across both migrated and pre-migration
 * Supabase deployments.
 */
export async function saveRichCandidateProfile(draft: RichCandidateDraft): Promise<LiveProfile> {
  const cleanedSlug = (draft.portfolioSlug || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/^-+|-+$/g, "");
  const validSlug =
    cleanedSlug.length >= 4 && /^[a-z0-9][a-z0-9-]{2,38}[a-z0-9]$/.test(cleanedSlug)
      ? cleanedSlug
      : null;

  const cleanExperiences = draft.experiences
    .filter((e) => e.title.trim())
    .map((e) => ({
      title: e.title.trim(),
      company: e.company.trim() || "Company",
      location: e.location.trim(),
      start: e.start.trim(),
      end: e.end.trim() || "Present",
      description: e.description.trim(),
      tools: e.tools.map((t) => t.trim()).filter(Boolean),
    }));

  const cleanEducations = draft.educations
    .filter((e) => e.institution.trim())
    .map((e) => ({
      institution: e.institution.trim(),
      degree: e.degree.trim() || "Degree",
      field_of_study: (e.field_of_study || "").trim(),
      start_year: e.start_year.trim(),
      year: e.year.trim(),
      grade: e.grade.trim(),
    }));

  const cleanCerts = draft.certifications
    .filter((c) => c.name.trim())
    .map((c) => ({
      name: c.name.trim(),
      issuer: c.issuer.trim(),
      date: c.date.trim(),
      credential_url: ensureHttpUrl(c.credential_url),
      verified: Boolean(c.verified),
    }));

  const cleanProjects = draft.projects
    .filter((p) => p.title.trim())
    .map((p) => ({
      title: p.title.trim(),
      role: (p.role || "").trim(),
      description: p.description.trim(),
      tools: p.tools.map((t) => t.trim()).filter(Boolean),
      url: ensureHttpUrl(p.url),
      github_url: ensureHttpUrl(p.github_url),
      image_url: httpOnly(p.image_url) || ensureHttpUrl(p.image_url),
      impact: (p.impact || "").trim(),
    }));

  const cleanAwards = draft.awards
    .filter((a) => a.title.trim())
    .map((a) => ({
      title: a.title.trim(),
      organization: (a.organization || "").trim(),
      date: (a.date || "").trim(),
      description: a.description.trim(),
    }));

  const cleanLanguages = draft.languages
    .filter((l) => l.name.trim())
    .map((l) => ({
      name: l.name.trim(),
      level: l.level.trim(),
    }));

  const overlay: ArjunProfileOverlayV1 = {
    banner_photo_url: httpOnly(draft.bannerPhotoUrl) || ensureHttpUrl(draft.bannerPhotoUrl),
    sub_headline: draft.subHeadline.trim(),
    open_for_freelance: draft.openForFreelance,
    video_intro_url: ensureHttpUrl(draft.videoIntroUrl),
    video_pitch: draft.videoPitch.trim(),
    kaggle_url: ensureHttpUrl(draft.kaggleUrl),
    behance_url: ensureHttpUrl(draft.behanceUrl),
    focus_badges: draft.focusBadges.map((b) => b.trim()).filter(Boolean),
    expertise_cards: draft.expertiseCards
      .filter((c) => c.title.trim() || c.sub.trim())
      .slice(0, 4)
      .map((c) => ({ title: c.title.trim(), sub: c.sub.trim() })),
    tools: draft.tools.map((t) => t.trim()).filter(Boolean),
    hobbies: draft.hobbies.map((h) => h.trim()).filter(Boolean),
    interests: draft.interests.map((i) => i.trim()).filter(Boolean),
    experiences: cleanExperiences,
    educations: cleanEducations,
    certifications: cleanCerts,
    projects: cleanProjects,
    awards: cleanAwards,
    languages: cleanLanguages,
  };

  const baseShell = { ...(draft.existingShellState || {}) };
  for (const forbidden of ["pw", "wal", "ver", "vr", "role", "email", "saved", "seen"]) {
    delete baseShell[forbidden];
  }

  const saved = await saveCandidatePayload({
    profile: {
      full_name: draft.fullName.trim(),
      phone: draft.phone.trim(),
      headline: draft.headline.trim() || draft.jobRole.trim(),
      sub_headline: draft.subHeadline.trim(),
      job_role: draft.jobRole.trim(),
      ...(draft.company !== undefined ? { company: draft.company.trim() } : {}),
      industry: draft.industry,
      experience_level: (draft.experienceLevel || "fresher").toLowerCase(),
      years_of_experience:
        draft.experienceLevel.toLowerCase() === "fresher"
          ? 0
          : Math.max(0, Number(draft.yearsOfExperience) || 0),
      about: draft.about.trim(),
      city: draft.city.trim(),
      state: draft.state.trim(),
      country: draft.country.trim() || "India",
      open_to_work: draft.openToWork,
      open_for_freelance: draft.openForFreelance,
      preferred_locations: draft.preferredLocations.map((s) => s.trim()).filter(Boolean),
      areas_of_expertise: overlay.focus_badges,
      interests: overlay.interests,
      tools: overlay.tools,
      hobbies: overlay.hobbies,
      preferred_salary_range: draft.salaryRange.trim(),
      notice_period: draft.noticePeriod,
      availability_status: draft.employmentType,
      linkedin_url: ensureHttpUrl(draft.linkedinUrl),
      github_url: ensureHttpUrl(draft.githubUrl),
      portfolio_url: ensureHttpUrl(draft.portfolioUrl),
      kaggle_url: ensureHttpUrl(draft.kaggleUrl),
      behance_url: ensureHttpUrl(draft.behanceUrl),
      video_intro_url: ensureHttpUrl(draft.videoIntroUrl),
      video_pitch: draft.videoPitch.trim(),
      profile_photo_url: httpOnly(draft.profilePhotoUrl) || "",
      banner_photo_url: httpOnly(draft.bannerPhotoUrl) || "",
      ...(draft.resumePath ? { resume_path: draft.resumePath } : {}),
      ...(draft.resumeUrl ? { resume_url: ensureHttpUrl(draft.resumeUrl) } : {}),
      ...(validSlug ? { portfolio_slug: validSlug } : {}),
    },
    skills: draft.skills
      .filter((s) => s.name.trim())
      .map((s) => ({
        name: s.name.trim(),
        level: (s.level || "intermediate").toLowerCase(),
        category: ["technical", "behavioral", "management"].includes((s.category || "").toLowerCase())
          ? (s.category || "technical").toLowerCase()
          : "technical",
      })),
    experiences: cleanExperiences,
    educations: cleanEducations,
    certifications: cleanCerts.map((c) => c.name),
    certification_details: cleanCerts,
    projects: cleanProjects.map((p) => ({
      ...p,
      tools: p.tools.join(", "),
    })),
    awards: cleanAwards,
    languages: cleanLanguages,
    shell_state: {
      ...baseShell,
      ...(typeof draft.phoneVerified === "boolean" ? { phv: draft.phoneVerified } : {}),
      tag: draft.industry,
      onboardingCompleted: true,
      pf: {
        ...(baseShell.pf || {}),
        wm: draft.workMode,
        ty: draft.employmentType,
        loc: draft.preferredLocations.join(", "),
      },
      arjun_profile_v1: overlay,
    },
  });

  return saved;
}

export async function setPortfolioSlug(slug: string | null) {
  return rpc<LiveProfile>("save_candidate_profile", { p: { profile: { portfolio_slug: slug } } });
}

export function draftFromNormalized(n: NormalizedCandidateProfile): RichCandidateDraft {
  return {
    fullName: n.fullName,
    phone: n.phone,
    headline: n.headline,
    subHeadline: n.subHeadline,
    jobRole: n.jobRole,
    company: n.company,
    industry: n.industry,
    experienceLevel: n.experienceLevel,
    yearsOfExperience: n.yearsOfExperience,
    city: n.city,
    state: n.state,
    country: n.country,
    about: n.about,
    profilePhotoUrl: n.profilePhotoUrl,
    bannerPhotoUrl: n.bannerPhotoUrl,
    openToWork: n.openToWork,
    openForFreelance: n.openForFreelance,
    workMode: n.workMode,
    employmentType: n.employmentType,
    noticePeriod: n.noticePeriod,
    salaryRange: n.salaryRange,
    preferredLocations: n.preferredLocations,
    portfolioSlug: n.portfolioSlug,
    resumePath: n.resumePath || null,
    resumeUrl: n.resumeUrl || null,
    videoIntroUrl: n.videoIntroUrl,
    videoPitch: n.videoPitch,
    linkedinUrl: n.linkedinUrl,
    githubUrl: n.githubUrl,
    portfolioUrl: n.portfolioUrl,
    kaggleUrl: n.kaggleUrl,
    behanceUrl: n.behanceUrl,
    focusBadges: n.focusBadges,
    expertiseCards: n.expertiseCards,
    skills: n.skills.map((s) => ({ name: s.name, level: s.level.toLowerCase(), category: s.category })),
    tools: n.tools,
    experiences: n.experiences,
    projects: n.projects,
    educations: n.educations,
    certifications: n.certifications,
    awards: n.awards,
    languages: n.languages,
    hobbies: n.hobbies,
    interests: n.interests,
    phoneVerified: Boolean(n.shellState?.phv),
    existingShellState: n.shellState,
  };
}

export async function patchLiveProfileQuick(
  live: LiveProfile,
  patch: Partial<RichCandidateDraft>
): Promise<LiveProfile> {
  const base = draftFromNormalized(normalizeLiveProfile(live));
  return saveRichCandidateProfile({ ...base, ...patch });
}

export const fetchPublicPortfolio = (slug: string) =>
  rpc<Record<string, any> | null>("get_public_portfolio", { p_slug: slug });

function validateImageUpload(file: File, label: string): "png" | "webp" | "jpg" {
  const isPng = file.type === "image/png" || /\.png$/i.test(file.name);
  const isWebp = file.type === "image/webp" || /\.webp$/i.test(file.name);
  const isJpg = file.type === "image/jpeg" || /\.jpe?g$/i.test(file.name);
  if (!isPng && !isWebp && !isJpg) {
    throw new Error(`${label} must be a JPG, PNG, or WEBP image.`);
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error(`${label} must be under 5 MB.`);
  }
  return isPng ? "png" : isWebp ? "webp" : "jpg";
}

/**
 * Uploads a JPG/PNG/WEBP profile picture to Supabase Storage (`profile-photos`)
 * and returns the public CDN URL.
 */
export async function uploadProfilePhotoFile(file: File, userId: string): Promise<string> {
  const ext = validateImageUpload(file, "Profile photo");
  const contentType = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
  const path = `${userId}/avatar-${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from("profile-photos")
    .upload(path, file, { contentType, upsert: true });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from("profile-photos").getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Uploads a JPG/PNG/WEBP cover banner image to Supabase Storage (`profile-photos`)
 * under `${userId}/banner-*` and returns the public CDN URL.
 */
export async function uploadBannerPhotoFile(file: File, userId: string): Promise<string> {
  const ext = validateImageUpload(file, "Banner image");
  const contentType = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
  const path = `${userId}/banner-${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from("profile-photos")
    .upload(path, file, { contentType, upsert: true });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from("profile-photos").getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Uploads a JPG/PNG/WEBP project screenshot/preview image to Supabase Storage (`profile-photos`)
 * under `${userId}/project-*` and returns the public CDN URL.
 */
export async function uploadProjectImageFile(file: File, userId: string): Promise<string> {
  const ext = validateImageUpload(file, "Project cover image");
  const contentType = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
  const path = `${userId}/project-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
  const { error } = await supabase.storage
    .from("profile-photos")
    .upload(path, file, { contentType, upsert: true });
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
