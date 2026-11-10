import React from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Building2,
  MapPin,
  Globe,
  Briefcase,
  Users,
  CheckCircle2,
  ExternalLink,
  Calendar,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAsync } from "@/hooks/useAsync";
import { getPublicCompany } from "@/services/employer/profile";

const PublicCompany: React.FC = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const { data, loading, error } = useAsync(() => getPublicCompany(slug), [slug]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Helmet>
        <title>
          {data?.name
            ? `${data.name} · Verified Company Profile | TalentCIR`
            : "Company Profile | TalentCIR"}
        </title>
      </Helmet>
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-4xl space-y-6">
          {loading ? (
            <div className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
              Loading company profile…
            </div>
          ) : error || !data ? (
            <div className="rounded-2xl border border-border bg-card p-10 text-center space-y-3">
              <h1 className="text-xl font-bold">Company profile unavailable</h1>
              <p className="text-sm text-muted-foreground">
                This company profile does not exist or is not publicly listed.
              </p>
              <Button asChild variant="outline">
                <Link to="/jobs">Browse Open Roles</Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Header card with cover & identity */}
              <section className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                {data.cover_url && (
                  <div className="h-40 w-full overflow-hidden bg-muted">
                    <img
                      src={data.cover_url}
                      alt={`${data.name} cover`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6 sm:p-8 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                    <div className="h-20 w-20 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-2xl flex items-center justify-center shrink-0 overflow-hidden border border-border">
                      {data.logo_url ? (
                        <img
                          src={data.logo_url}
                          alt={data.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Building2 className="w-10 h-10 text-primary-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-2xl font-bold font-display tracking-tight text-foreground truncate">
                          {data.name}
                        </h1>
                        {data.verified && (
                          <Badge
                            variant="secondary"
                            className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Verified Employer
                          </Badge>
                        )}
                      </div>
                      {data.industry && (
                        <p className="text-sm text-muted-foreground font-medium">
                          {data.industry}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                        {data.hq && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            {data.hq}
                          </span>
                        )}
                        {data.size && (
                          <span className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" />
                            {data.size} employees
                          </span>
                        )}
                        {data.established_year && (
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            Est. {data.established_year}
                          </span>
                        )}
                        {data.website && (
                          <a
                            href={data.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-primary hover:underline"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            Website
                            <ExternalLink className="w-3 h-3 ml-0.5" />
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="sm:self-start">
                      <Button asChild size="sm">
                        <Link to={`/jobs?q=${encodeURIComponent(data.name)}`}>
                          <Briefcase className="w-4 h-4 mr-1.5" />
                          {data.active_jobs_count > 0
                            ? `View ${data.active_jobs_count} Open Roles`
                            : "Explore Jobs"}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </section>

              {/* About & Mission */}
              {(data.about || data.mission) && (
                <section className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm">
                  <h2 className="text-xs font-bold font-display uppercase tracking-wider text-muted-foreground">
                    About the Company
                  </h2>
                  {data.about && (
                    <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
                      {data.about}
                    </p>
                  )}
                  {data.mission && (
                    <div className="pt-2 border-t border-border">
                      <h3 className="text-xs font-bold font-display uppercase tracking-wider text-muted-foreground mb-1.5">
                        Our Mission
                      </h3>
                      <p className="text-sm text-foreground/80 leading-relaxed italic">
                        "{data.mission}"
                      </p>
                    </div>
                  )}
                </section>
              )}

              {/* Culture Tags & Benefits */}
              {(data.culture_tags?.length > 0 || data.benefits?.length > 0) && (
                <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.culture_tags?.length > 0 && (
                    <div className="rounded-2xl border border-border bg-card p-6 space-y-3 shadow-sm">
                      <h2 className="text-xs font-bold font-display uppercase tracking-wider text-muted-foreground">
                        Culture & Values
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {data.culture_tags.map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs px-2.5 py-1">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {data.benefits?.length > 0 && (
                    <div className="rounded-2xl border border-border bg-card p-6 space-y-3 shadow-sm">
                      <h2 className="text-xs font-bold font-display uppercase tracking-wider text-muted-foreground">
                        Benefits & Perks
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {data.benefits.map((ben, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs px-2.5 py-1">
                            {ben}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PublicCompany;
