import { rpc } from "@/services/db";

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
