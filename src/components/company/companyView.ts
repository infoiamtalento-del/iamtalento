import type { EmployerProfileData, PublicCompanyData } from "@/services/employer/profile";
import type { CompanyView } from "./CompanyProfileView";

/** Public projection (what candidates and visitors see). */
export const toCompanyView = (d: PublicCompanyData): CompanyView => ({
  name: d.name,
  slug: d.slug,
  tagline: d.tagline,
  employerCode: d.employer_code,
  logoUrl: d.logo_url,
  coverUrl: d.cover_url,
  verified: d.verified,
  gstinVerified: d.gstin_verified,
  industry: d.industry,
  category: d.category,
  type: d.company_type,
  registrationType: d.registration_type,
  size: d.size,
  hq: d.hq,
  address: d.address,
  founded: d.established_year,
  website: d.website,
  about: d.about,
  mission: d.mission,
  benefits: d.benefits,
  culture: d.culture_tags,
  regions: d.hiring_regions,
  locations: d.locations,
  social: d.social_links,
  highlights: d.highlights,
  leadership: d.leadership,
  workplacePhotos: d.workplace_photos,
  hiringSteps: d.hiring_steps,
  contact: d.contact
    ? {
        email: d.contact.email,
        phone: d.contact.phone,
        altEmails: d.contact.alt_emails,
        altPhones: d.contact.alt_phones,
      }
    : null,
});

/** The employer's own (unsaved or saved) data rendered through the same public layout. */
export const profileToCompanyView = (p: Partial<EmployerProfileData>, showContact: boolean): CompanyView => ({
  name: p.company_name || "Your company",
  slug: p.slug,
  employerCode: p.employer_id,
  logoUrl: p.logo_url,
  coverUrl: p.cover_url,
  verified: p.verification_status === "verified",
  gstinVerified: Boolean(p.gstin),
  industry: p.industry,
  category: p.company_category,
  type: p.company_type,
  registrationType: p.registration_type,
  size: p.num_employees,
  hq: p.hq_city || p.address,
  address: p.address,
  founded: p.established_year,
  website: p.website,
  about: p.description,
  mission: p.mission,
  benefits: p.benefits,
  culture: p.culture_tags,
  regions: p.hiring_regions,
  locations: p.multiple_locations,
  social: p.social_links,
  contact: showContact
    ? {
        email: p.official_email,
        phone: p.phone,
        altEmails: p.alt_emails,
        altPhones: p.alt_phones,
      }
    : null,
});
