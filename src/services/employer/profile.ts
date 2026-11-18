import { db, rpc } from "@/services/db";
import {
  findShowcaseCompany,
  slugifyCompanyName,
  type CompanyHighlightItem,
  type CompanyHiringStep,
  type CompanyLeaderItem,
  type CompanyWorkplacePhoto,
} from "@/data/showcaseCompanies";

export interface EmployerProfileData {
  id: string;
  employer_id: string;
  tenant_id: string | null;
  company_name: string;
  contact_name: string | null;
  official_email: string | null;
  phone: string | null;
  company_type: string | null;
  registration_type: string | null;
  website: string | null;
  num_employees: string | null;
  address: string | null;
  hq_city: string | null;
  multiple_locations: string[];
  logo_url: string | null;
  cover_url: string | null;
  description: string | null;
  mission: string | null;
  established_year: number | null;
  industry: string | null;
  benefits: string[];
  culture_tags: string[];
  hiring_regions: string[];
  social_links: Record<string, string>;
  alt_emails: string[];
  alt_phones: string[];
  company_category: string | null;
  gstin: string | null;
  pan: string | null;
  billing_address: Record<string, unknown>;
  slug: string;
  email_verified: boolean;
  phone_verified: boolean;
  verification_status: "pending" | "verified" | "rejected" | "suspended";
  profile_completion: number;
  created_at: string;
  updated_at: string;
}

export interface PublicCompanyData {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  cover_url: string | null;
  about: string | null;
  mission: string | null;
  industry: string | null;
  size: string | null;
  hq: string | null;
  website: string | null;
  established_year: number | null;
  benefits: string[];
  culture_tags: string[];
  hiring_regions: string[];
  social_links: Record<string, string>;
  active_jobs_count: number;
  verified: boolean;
  company_type: string | null;
  category: string | null;
  locations: string[];
  contact: { email: string | null; phone: string | null; alt_emails: string[]; alt_phones: string[] } | null;
  tagline?: string | null;
  employer_code?: string | null;
  registration_type?: string | null;
  gstin_verified?: boolean;
  address?: string | null;
  highlights?: CompanyHighlightItem[];
  leadership?: CompanyLeaderItem[];
  workplace_photos?: CompanyWorkplacePhoto[];
  hiring_steps?: CompanyHiringStep[];
}

/** Fetches caller's authenticated employer profile */
export async function getEmployerProfile(): Promise<EmployerProfileData | null> {
  const data = await rpc("get_employer_profile");
  return data as unknown as EmployerProfileData | null;
}

/** Updates caller's employer profile with validation */
export async function saveEmployerProfile(
  updates: Partial<EmployerProfileData>
): Promise<EmployerProfileData> {
  const data = await rpc("save_employer_profile", {
    p: updates as Record<string, unknown>,
  });
  return data as unknown as EmployerProfileData;
}

function applyLocalDemoEmployerEdits(base: PublicCompanyData): PublicCompanyData {
  if (typeof window === "undefined" || base.id !== "showcase-super30") return base;
  try {
    const raw = window.localStorage.getItem("tq_users");
    if (!raw) return base;
    const parsed = JSON.parse(raw) as Record<string, { cp?: Record<string, unknown> }>;
    const cp = parsed?.["demo.employer@talento.app"]?.cp;
    if (!cp) return base;
    return {
      ...base,
      name: typeof cp.name === "string" && cp.name.trim() ? cp.name.trim() : base.name,
      about: typeof cp.about === "string" && cp.about.trim() ? cp.about.trim() : base.about,
      mission: typeof cp.mission === "string" && cp.mission.trim() ? cp.mission.trim() : base.mission,
      industry: typeof cp.ind === "string" && cp.ind.trim() ? cp.ind.trim() : base.industry,
      size: typeof cp.size === "string" && cp.size.trim() ? cp.size.trim() : base.size,
      hq: typeof cp.hq === "string" && cp.hq.trim() ? cp.hq.trim() : base.hq,
      website: typeof cp.site === "string" && cp.site.trim() ? cp.site.trim() : base.website,
      benefits: Array.isArray(cp.ben) && cp.ben.length > 0 ? (cp.ben as string[]) : base.benefits,
    };
  } catch {
    return base;
  }
}

/** Anonymous-safe public company projection with showcase & pre-migration fallback */
export async function getPublicCompany(slug: string): Promise<PublicCompanyData | null> {
  const cleanSlug = (slug || "").trim();
  if (!cleanSlug) return null;

  try {
    const data = (await rpc("get_public_company", { p_slug: cleanSlug })) as unknown as PublicCompanyData | null;
    if (data && data.id) {
      return data;
    }
  } catch {
    // Remote schema may not yet expose get_public_company; fall through to owner/showcase lookup
  }

  // If a signed-in employer visits their own public preview before RPC migration is applied
  try {
    const sessionRes = await db.auth?.getSession?.();
    const uid = sessionRes?.data?.session?.user?.id;
    if (uid) {
      const { data: emp } = await db.from("employers").select("*").eq("user_id", uid).maybeSingle();
      if (emp) {
        const empSlug = (emp as Record<string, unknown>).slug
          ? String((emp as Record<string, unknown>).slug)
          : slugifyCompanyName(String(emp.company_name || ""));
        if (
          cleanSlug.toLowerCase() === String(emp.id).toLowerCase() ||
          cleanSlug.toLowerCase() === String(emp.employer_id || "").toLowerCase() ||
          (empSlug && slugifyCompanyName(cleanSlug) === empSlug)
        ) {
          return {
            id: emp.id,
            name: emp.company_name || "Employer",
            slug: empSlug || emp.id,
            logo_url: emp.logo_url || null,
            cover_url: ((emp as Record<string, unknown>).cover_url as string) || null,
            about: emp.description || null,
            mission: ((emp as Record<string, unknown>).mission as string) || null,
            industry: emp.industry || null,
            size: emp.num_employees || null,
            hq: ((emp as Record<string, unknown>).hq_city as string) || emp.address || null,
            address: emp.address || null,
            website: emp.website || null,
            established_year: emp.established_year || null,
            benefits: (((emp as Record<string, unknown>).benefits as string[]) ?? []),
            culture_tags: (((emp as Record<string, unknown>).culture_tags as string[]) ?? []),
            hiring_regions: (((emp as Record<string, unknown>).hiring_regions as string[]) ?? []),
            social_links: (((emp as Record<string, unknown>).social_links as Record<string, string>) ?? {}),
            active_jobs_count: 0,
            verified: emp.verification_status === "verified",
            company_type: emp.company_type || null,
            registration_type: emp.registration_type || null,
            category: ((emp as Record<string, unknown>).company_category as string) || null,
            employer_code: emp.employer_id || null,
            locations: emp.multiple_locations ?? [],
            contact: emp.official_email || emp.phone
              ? { email: emp.official_email || null, phone: emp.phone || null, alt_emails: [], alt_phones: [] }
              : null,
          };
        }
      }
    }
  } catch {
    // Ignore auth/table lookup errors for anonymous visitors
  }

  const showcase = findShowcaseCompany(cleanSlug);
  if (showcase) {
    return applyLocalDemoEmployerEdits(showcase);
  }

  return null;
}

export interface CompanyJobRow {
  id: string;
  title: string;
  department?: string | null;
  location: string | null;
  mode: string | null;
  type: string | null;
  experience?: string | null;
  salary?: string | null;
  skills: string[];
  summary?: string | null;
  postedAt: string | null;
}

/** Publicly listed, active openings for one employer (RLS only exposes active + public jobs). */
export async function fetchCompanyJobs(employerId: string): Promise<CompanyJobRow[]> {
  const showcase = findShowcaseCompany(employerId);
  if (showcase) {
    const baseJobs = [...showcase.jobs];
    if (typeof window !== "undefined" && showcase.id === "showcase-super30") {
      try {
        const raw = window.localStorage.getItem("tq_jobs");
        if (raw) {
          const parsed = JSON.parse(raw) as Array<Record<string, unknown>>;
          const custom = parsed
            .filter(
              (j) =>
                j.by === "demo.employer@talento.app" &&
                (j.status === undefined || j.status === "active") &&
                !baseJobs.some((b) => b.id === String(j.id))
            )
            .map((j) => ({
              id: String(j.id),
              title: String(j.t || "Open Role"),
              department: typeof j.department === "string" ? j.department : "Engineering",
              location: typeof j.l === "string" ? j.l : null,
              mode: typeof j.m === "string" ? j.m : null,
              type: typeof j.ty === "string" ? j.ty : null,
              experience: j.e !== undefined ? `${j.e}+ yrs` : null,
              salary: j.a && j.b ? `₹${j.a}–${j.b} LPA` : null,
              skills: Array.isArray(j.sk) ? (j.sk as string[]) : [],
              summary: typeof j.description === "string" ? j.description : null,
              postedAt: "Recently posted",
            }));
          return [...custom, ...baseJobs];
        }
      } catch {
        // ignore malformed local demo jobs
      }
    }
    return baseJobs;
  }

  try {
    const { data, error } = await db
      .from("employer_job_openings")
      .select("id, designation, job_location, work_mode, job_type, skills, published_at")
      .eq("employer_id", employerId)
      .eq("status", "active")
      .eq("is_public", true)
      .is("deleted_at", null)
      .order("published_at", { ascending: false })
      .limit(50);
    if (!error && data) {
      return data.map((j: Record<string, unknown>) => ({
        id: String(j.id),
        title: String(j.designation),
        location: (j.job_location as string) || null,
        mode: (j.work_mode as string) || null,
        type: (j.job_type as string) || null,
        skills: (j.skills as string[]) ?? [],
        postedAt: (j.published_at as string) || null,
      }));
    }
  } catch {
    // Fall back to base columns on pre-migration remote schema
  }

  const { data: fallbackData, error: fallbackErr } = await db
    .from("employer_job_openings")
    .select("id, designation, job_location, experience_years, salary_min, salary_max, job_description, created_at")
    .eq("employer_id", employerId)
    .eq("status", "active")
    .limit(50);
  if (fallbackErr) return [];
  return (fallbackData ?? []).map((j: Record<string, unknown>) => ({
    id: String(j.id),
    title: String(j.designation),
    location: (j.job_location as string) || null,
    mode: null,
    type: "Full-time",
    experience: j.experience_years ? `${j.experience_years} yrs` : null,
    salary:
      j.salary_min && j.salary_max
        ? `₹${Math.round(Number(j.salary_min) / 100000)}–${Math.round(Number(j.salary_max) / 100000)} LPA`
        : null,
    skills: [],
    summary: (j.job_description as string) || null,
    postedAt: (j.created_at as string) || null,
  }));
}
