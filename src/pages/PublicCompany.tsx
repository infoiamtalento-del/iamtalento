import React from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Briefcase, ExternalLink, Share2 } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { CompanyProfileView } from "@/components/company/CompanyProfileView";
import { toCompanyView } from "@/components/company/companyView";
import { useAsync } from "@/hooks/useAsync";
import { fetchCompanyJobs, getPublicCompany } from "@/services/employer/profile";

const PublicCompany: React.FC = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const { data, loading, error } = useAsync(() => getPublicCompany(slug), [slug]);
  const jobs = useAsync(() => (data ? fetchCompanyJobs(data.id) : Promise.resolve([])), [data?.id]);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: data?.name ? `${data.name} · Employer Profile | IAmTalento` : "Company Profile",
          url: shareUrl,
        });
        return;
      } catch {
        // User cancelled native share sheet; fall back to clipboard
      }
    }
    await navigator.clipboard?.writeText(shareUrl);
    toast.success("Public company profile link copied!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Helmet>
        <title>{data?.name ? `${data.name} · Employer Profile | TalentCIR` : "Company Profile | TalentCIR"}</title>
        {data?.about && <meta name="description" content={data.about.slice(0, 155)} />}
      </Helmet>
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container">
          {loading ? (
            <div
              role="status"
              className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground"
            >
              Loading company profile…
            </div>
          ) : error || !data ? (
            <div className="space-y-3 rounded-2xl border border-border bg-card p-10 text-center">
              <h1 className="text-xl font-bold">Company profile unavailable</h1>
              <p className="text-sm text-muted-foreground">
                This company profile does not exist or is not publicly listed.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                <Button asChild variant="outline">
                  <Link to="/jobs">Browse open roles</Link>
                </Button>
                <Button asChild>
                  <Link to="/company/super30-technologies">View featured employer</Link>
                </Button>
              </div>
            </div>
          ) : (
            <CompanyProfileView
              company={toCompanyView(data)}
              jobs={(jobs.data ?? []).map((j) => ({
                id: j.id,
                title: j.title,
                department: j.department,
                location: j.location,
                mode: j.mode,
                type: j.type,
                experience: j.experience,
                salary: j.salary,
                skills: j.skills,
                summary: j.summary,
                postedAt: j.postedAt,
              }))}
              jobsLoading={jobs.loading}
              openRolesCount={jobs.data?.length || data.active_jobs_count}
              jobHref={(j) => `/jobs?q=${encodeURIComponent(j.title)}`}
              actions={
                <>
                  {data.website && (
                    <Button asChild variant="outline" size="sm">
                      <a
                        href={/^https?:\/\//i.test(data.website) ? data.website : `https://${data.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit website
                        <ExternalLink className="ml-1.5 h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    </Button>
                  )}
                  <Button type="button" variant="outline" size="sm" onClick={() => void handleShare()}>
                    <Share2 className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                    Share profile
                  </Button>
                  <Button asChild size="sm">
                    <a href="#company-jobs">
                      <Briefcase className="mr-1.5 h-4 w-4" aria-hidden="true" />
                      {(jobs.data?.length || data.active_jobs_count) > 0
                        ? `View ${jobs.data?.length || data.active_jobs_count} open roles`
                        : "Explore jobs"}
                    </a>
                  </Button>
                </>
              }
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PublicCompany;
