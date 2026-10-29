import React from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { BadgeCheck, MapPin, ShieldCheck, ExternalLink, Github, Linkedin, Globe, Briefcase, Award, FolderGit2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAsync } from "@/hooks/useAsync";
import { fetchPublicPortfolio } from "@/services/candidate/profile";

const PublicPortfolio: React.FC = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const { data, loading, error } = useAsync(() => fetchPublicPortfolio(slug), [slug]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Helmet>
        <title>{data?.name ? `${data.name} · Verified Portfolio | IAmTalento` : "Candidate Portfolio | IAmTalento"}</title>
      </Helmet>
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-4xl space-y-6">
          {loading ? (
            <div className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
              Loading verified portfolio…
            </div>
          ) : error || !data ? (
            <div className="rounded-2xl border border-border bg-card p-10 text-center space-y-3">
              <h1 className="text-xl font-bold">Portfolio unavailable</h1>
              <p className="text-sm text-muted-foreground">
                This portfolio handle does not exist or its owner has set their profile visibility to private.
              </p>
              <Button asChild variant="outline">
                <Link to="/jobs">Browse Open Roles</Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Identity Header */}
              <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                  <div className="h-20 w-20 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-2xl flex items-center justify-center shrink-0 overflow-hidden">
                    {data.photo ? (
                      <img src={data.photo} alt={data.name || "Candidate"} className="h-full w-full object-cover" />
                    ) : (
                      (data.name?.charAt(0) || "T").toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-2xl font-bold font-display">{data.name || "Verified Candidate"}</h1>
                      {data.verified && (
                        <Badge className="bg-emerald-600 text-white hover:bg-emerald-600 gap-1">
                          <BadgeCheck className="h-3.5 w-3.5" /> Identity Verified
                        </Badge>
                      )}
                      {data.open_to_work && (
                        <Badge variant="secondary">Open to Work</Badge>
                      )}
                    </div>
                    {data.headline && <p className="text-sm font-medium text-foreground/90">{data.headline}</p>}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      {data.city && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" /> {data.city}
                        </span>
                      )}
                      {data.cir && (
                        <span className="inline-flex items-center gap-1 font-semibold text-primary">
                          <ShieldCheck className="h-3.5 w-3.5" /> CIR {Math.round(Number(data.cir.score))}/100 ({data.cir.tier})
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                      {data.linkedin && (
                        <a href={data.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
                          <Linkedin className="h-3.5 w-3.5" /> LinkedIn
                        </a>
                      )}
                      {data.github && (
                        <a href={data.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
                          <Github className="h-3.5 w-3.5" /> GitHub
                        </a>
                      )}
                      {data.website && (
                        <a href={data.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
                          <Globe className="h-3.5 w-3.5" /> Website
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                {data.about && <p className="mt-5 pt-5 border-t border-border text-sm leading-relaxed text-muted-foreground whitespace-pre-line">{data.about}</p>}
              </section>

              {/* Skills */}
              {Array.isArray(data.skills) && data.skills.length > 0 && (
                <section className="rounded-2xl border border-border bg-card p-6 space-y-3">
                  <h2 className="text-base font-bold">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((s: { name: string; verified: boolean }) => (
                      <Badge key={s.name} variant={s.verified ? "default" : "secondary"} className="gap-1 py-1 px-2.5">
                        {s.verified && <BadgeCheck className="h-3.5 w-3.5" />}
                        {s.name}
                      </Badge>
                    ))}
                  </div>
                </section>
              )}

              {/* Experience */}
              {Array.isArray(data.experiences) && data.experiences.length > 0 && (
                <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
                  <h2 className="text-base font-bold flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" /> Experience
                  </h2>
                  <div className="divide-y divide-border">
                    {data.experiences.map((e: { title: string; company: string; description?: string }, i: number) => (
                      <div key={i} className="py-3 first:pt-0 last:pb-0">
                        <p className="font-semibold text-sm">{e.title} · <span className="text-primary">{e.company}</span></p>
                        {e.description && <p className="text-xs text-muted-foreground mt-1">{e.description}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Projects */}
              {Array.isArray(data.projects) && data.projects.length > 0 && (
                <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
                  <h2 className="text-base font-bold flex items-center gap-2">
                    <FolderGit2 className="h-4 w-4 text-primary" /> Projects
                  </h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {data.projects.map((p: { title: string; description?: string; url?: string }, i: number) => (
                      <div key={i} className="rounded-xl border border-border p-4 space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-sm">{p.title}</p>
                          {p.url && (
                            <a href={p.url} target="_blank" rel="noreferrer" className="text-primary hover:underline" aria-label={`Open ${p.title}`}>
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                        {p.description && <p className="text-xs text-muted-foreground">{p.description}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Certifications */}
              {Array.isArray(data.certifications) && data.certifications.length > 0 && (
                <section className="rounded-2xl border border-border bg-card p-6 space-y-3">
                  <h2 className="text-base font-bold flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" /> Certifications
                  </h2>
                  <ul className="space-y-2 text-sm">
                    {data.certifications.map((c: { name: string; verified: boolean }, i: number) => (
                      <li key={i} className="flex items-center gap-2">
                        {c.verified ? <BadgeCheck className="h-4 w-4 text-emerald-600 shrink-0" /> : <Award className="h-4 w-4 text-muted-foreground shrink-0" />}
                        <span>{c.name}</span>
                      </li>
                    ))}
                  </ul>
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

export default PublicPortfolio;
