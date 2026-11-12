import React from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Briefcase } from "lucide-react";
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

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Helmet>
        <title>{data?.name ? `${data.name} · Company Profile | TalentCIR` : "Company Profile | TalentCIR"}</title>
        {data?.about && <meta name="description" content={data.about.slice(0, 155)} />}
      </Helmet>
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-5xl">
          {loading ? (
            <div role="status" className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">Loading company profile…</div>
          ) : error || !data ? (
            <div className="space-y-3 rounded-2xl border border-border bg-card p-10 text-center">
              <h1 className="text-xl font-bold">Company profile unavailable</h1>
              <p className="text-sm text-muted-foreground">This company profile does not exist or is not publicly listed.</p>
              <Button asChild variant="outline"><Link to="/jobs">Browse open roles</Link></Button>
            </div>
          ) : (
            <CompanyProfileView
              company={toCompanyView(data)}
              jobs={(jobs.data ?? []).map((j) => ({ id: j.id, title: j.title, location: j.location, mode: j.mode, type: j.type, skills: j.skills }))}
              jobsLoading={jobs.loading}
              openRolesCount={data.active_jobs_count}
              jobHref={(j) => `/jobs?q=${encodeURIComponent(j.title)}`}
              actions={
                <Button asChild size="sm">
                  <Link to={`/jobs?q=${encodeURIComponent(data.name)}`}><Briefcase className="mr-1.5 h-4 w-4" />{data.active_jobs_count > 0 ? `View ${data.active_jobs_count} open roles` : "Explore jobs"}</Link>
                </Button>
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
