import { db, rpc } from "@/services/db";

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

/** Anonymous-safe public company projection */
export async function getPublicCompany(slug: string): Promise<PublicCompanyData | null> {
  const data = await rpc("get_public_company", { p_slug: slug });
  return data as unknown as PublicCompanyData | null;
}

export interface CompanyJobRow {
  id: string;
  title: string;
  location: string | null;
  mode: string | null;
  type: string | null;
  skills: string[];
  postedAt: string | null;
}

/** Publicly listed, active openings for one employer (RLS only exposes active + public jobs). */
export async function fetchCompanyJobs(employerId: string): Promise<CompanyJobRow[]> {
  const { data, error } = await db
    .from("employer_job_openings")
    .select("id, designation, job_location, work_mode, job_type, skills, published_at")
    .eq("employer_id", employerId)
    .eq("status", "active")
    .eq("is_public", true)
    .is("deleted_at", null)
    .order("published_at", { ascending: false })
    .limit(50);
  if (error) throw new Error(error.message);
  return (data ?? []).map((j: Record<string, unknown>) => ({
    id: String(j.id),
    title: String(j.designation),
    location: (j.job_location as string) || null,
    mode: (j.work_mode as string) || null,
    type: (j.job_type as string) || null,
    skills: (j.skills as string[]) ?? [],
    postedAt: (j.published_at as string) || null,
  }));
}
