import { ExternalLink, Pencil, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompanyProfileView, type CompanyJob } from "@/components/company/CompanyProfileView";
import { toCompanyView } from "@/components/company/companyView";
import { findShowcaseCompany, slugifyCompanyName } from "@/data/showcaseCompanies";
import type { ProJob, ProUser } from "@/data/proData";

interface Props {
  user: ProUser;
  jobs: ProJob[];
  onEdit: () => void;
  onToast: (msg: string) => void;
  onOpenJob?: (id: number) => void;
}

/**
 * Employer "Company Profile" inside Talento Pro — rendered with the unified editorial
 * CompanyProfileView so the in-workspace view and `/company/:slug` public preview match 100%.
 */
export function ProEmployerProfileView({ user, jobs, onEdit, onToast }: Props) {
  const cp = user.cp || {};
  const showcase = findShowcaseCompany("super30-technologies");
  const baseView = showcase ? toCompanyView(showcase) : null;

  const companyName = cp.name || baseView?.name || user.name || "Super30 Technologies";
  const publicSlug = showcase?.slug || slugifyCompanyName(companyName) || "super30-technologies";
  const publicPath = `/company/${publicSlug}`;

  const employerJobs = jobs.filter(
    (j) =>
      j.by === user.email ||
      j.c.toLowerCase().includes("super30") ||
      j.c.toLowerCase() === companyName.toLowerCase()
  );

  const mappedJobs: CompanyJob[] =
    employerJobs.length > 0
      ? employerJobs.map((job) => ({
          id: String(job.id),
          title: job.t,
          department: job.department || "Engineering",
          location: job.l,
          mode: job.m,
          type: job.ty,
          experience: `${job.e}+ yrs`,
          salary: `₹${job.a}–${job.b} LPA`,
          skills: job.sk,
          summary: job.description,
          postedAt: "Active role",
        }))
      : (showcase?.jobs ?? []);

  const copyPublicLink = () => {
    const fullUrl = `${window.location.origin}${publicPath}`;
    void navigator.clipboard?.writeText(fullUrl);
    onToast(`Copied public preview link: ${fullUrl}`);
  };

  return (
    <CompanyProfileView
      company={{
        ...(baseView ?? { name: companyName, verified: true }),
        name: companyName,
        logoUrl: user.avatar || baseView?.logoUrl || "/company-logos/super30-mark.svg",
        coverUrl: baseView?.coverUrl,
        about: cp.about || baseView?.about,
        mission: cp.mission || baseView?.mission,
        industry: cp.ind || baseView?.industry || "Software & Cloud Infrastructure",
        size: cp.size || baseView?.size || "201-500",
        hq: cp.hq || baseView?.hq || "Bengaluru, Karnataka, India",
        website: cp.site || baseView?.website || "https://super30.ai",
        benefits: cp.ben && cp.ben.length > 0 ? cp.ben : baseView?.benefits,
      }}
      jobs={mappedJobs}
      openRolesCount={mappedJobs.length}
      jobHref={(job) => `/jobs?q=${encodeURIComponent(job.title)}`}
      actions={
        <>
          <Button type="button" size="sm" variant="outline" onClick={copyPublicLink}>
            <Share2 className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            Copy public link
          </Button>
          <Button asChild size="sm" variant="outline">
            <a href={publicPath} target="_blank" rel="noopener noreferrer">
              Open public preview
              <ExternalLink className="ml-1.5 h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </Button>
          <Button type="button" size="sm" onClick={onEdit}>
            <Pencil className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            Edit Profile
          </Button>
        </>
      }
    />
  );
}

export default ProEmployerProfileView;
