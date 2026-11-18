import React, { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ArrowUpRight,
  Award,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Facebook,
  Github,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Target,
  Twitter,
  Users,
  Youtube,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  CompanyHighlightItem,
  CompanyHiringStep,
  CompanyLeaderItem,
  CompanyWorkplacePhoto,
} from "@/data/showcaseCompanies";

export interface CompanyView {
  name: string;
  slug?: string | null;
  tagline?: string | null;
  employerCode?: string | null;
  logoUrl?: string | null;
  coverUrl?: string | null;
  verified?: boolean;
  gstinVerified?: boolean;
  industry?: string | null;
  category?: string | null;
  type?: string | null;
  registrationType?: string | null;
  size?: string | null;
  hq?: string | null;
  address?: string | null;
  founded?: number | null;
  website?: string | null;
  about?: string | null;
  mission?: string | null;
  benefits?: string[];
  culture?: string[];
  regions?: string[];
  locations?: string[];
  social?: Record<string, string>;
  highlights?: CompanyHighlightItem[];
  leadership?: CompanyLeaderItem[];
  workplacePhotos?: CompanyWorkplacePhoto[];
  hiringSteps?: CompanyHiringStep[];
  contact?: { email?: string | null; phone?: string | null; altEmails?: string[]; altPhones?: string[] } | null;
}

export interface CompanyJob {
  id: string;
  title: string;
  department?: string | null;
  location?: string | null;
  mode?: string | null;
  type?: string | null;
  experience?: string | null;
  salary?: string | null;
  skills?: string[];
  summary?: string | null;
  postedAt?: string | null;
}

interface Props {
  company: CompanyView;
  jobs: CompanyJob[];
  jobsLoading?: boolean;
  /** Primary actions rendered in the header (visit jobs, edit, share…). */
  actions?: ReactNode;
  /** Builds the link for an individual job. */
  jobHref?: (job: CompanyJob) => string;
  /** Total open roles to display when the list is hidden by privacy settings. */
  openRolesCount?: number | null;
}

const SOCIAL: Record<string, { icon: typeof Globe; label: string }> = {
  linkedin: { icon: Linkedin, label: "LinkedIn" },
  twitter: { icon: Twitter, label: "X / Twitter" },
  facebook: { icon: Facebook, label: "Facebook" },
  instagram: { icon: Instagram, label: "Instagram" },
  youtube: { icon: Youtube, label: "YouTube" },
  github: { icon: Github, label: "GitHub" },
};

const safeUrl = (u: string) => (/^https?:\/\//i.test(u) ? u : `https://${u}`);
const cleanHost = (u: string) => u.replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "");

/**
 * LinkedIn-caliber editorial company profile: architectural cover banner, verified brand identity header,
 * sticky horizontal section bar, and structured sections for Overview, About & Leadership, Open Roles,
 * Culture & Workplace, Locations, and Official Contact.
 * Used for both the public `/company/:slug` page and the employer's workspace preview.
 */
export function CompanyProfileView({ company: c, jobs, jobsLoading, actions, jobHref, openRolesCount }: Props) {
  const sections = useMemo(() => {
    const list: Array<{ id: string; label: string }> = [{ id: "overview", label: "Overview" }];
    if (c.about || c.mission) list.push({ id: "about", label: "About" });
    list.push({ id: "jobs", label: `Jobs${openRolesCount ?? jobs.length ? ` (${openRolesCount ?? jobs.length})` : ""}` });
    if (c.benefits?.length || c.culture?.length) list.push({ id: "culture", label: "Culture & benefits" });
    if ((c.locations?.length ?? 0) > 0 || (c.regions?.length ?? 0) > 0) list.push({ id: "locations", label: "Locations" });
    if (c.contact || Object.values(c.social ?? {}).some(Boolean)) list.push({ id: "contact", label: "Contact" });
    return list;
  }, [c, jobs.length, openRolesCount]);

  const [active, setActive] = useState("overview");
  const refs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id.replace("company-", ""));
      },
      { rootMargin: "-120px 0px -60% 0px" }
    );
    sections.forEach((s) => {
      const el = refs.current[s.id];
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  const go = (id: string) => {
    setActive(id);
    refs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const sizeLabel = c.size ? (/employee/i.test(c.size) ? c.size : `${c.size} employees`) : null;

  const facts: Array<{ icon: typeof Globe; label: string; value: string }> = [
    c.industry ? { icon: Building2, label: "Industry", value: c.industry } : null,
    c.category ? { icon: Briefcase, label: "Business category", value: c.category } : null,
    c.type ? { icon: Building2, label: "Company type", value: c.type } : null,
    c.registrationType ? { icon: ShieldCheck, label: "Registration", value: c.registrationType } : null,
    sizeLabel ? { icon: Users, label: "Company size", value: sizeLabel } : null,
    c.hq ? { icon: MapPin, label: "Headquarters", value: c.hq } : null,
    c.founded ? { icon: Calendar, label: "Founded", value: String(c.founded) } : null,
    c.website ? { icon: Globe, label: "Official website", value: cleanHost(c.website) } : null,
  ].filter((x): x is { icon: typeof Globe; label: string; value: string } => x !== null);

  const sectionShell = (id: string, title: string, icon: ReactNode, body: ReactNode, badge?: ReactNode) => (
    <section
      id={`company-${id}`}
      ref={(el) => {
        refs.current[id] = el;
      }}
      className="scroll-mt-32 rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </span>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">{title}</h2>
        </div>
        {badge}
      </div>
      {body}
    </section>
  );

  const aboutParagraphs = (c.about || "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="space-y-6">
      {/* ===== HERO BRAND HEADER ===== */}
      <header className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
        <div className="h-44 w-full bg-[#002C66]/10 sm:h-60 lg:h-72 overflow-hidden" aria-hidden={!c.coverUrl}>
          {c.coverUrl && (
            <img
              src={c.coverUrl}
              alt={`${c.name} workplace cover`}
              width={1920}
              height={512}
              {...({ fetchpriority: "high" } as React.ImgHTMLAttributes<HTMLImageElement>)}
              className="h-full w-full object-cover object-center"
            />
          )}
        </div>

        <div className="px-5 pb-6 sm:px-8 lg:px-10">
          <div className="-mt-12 flex flex-wrap items-end justify-between gap-4 sm:-mt-16">
            <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-2xl border-4 border-card bg-card p-1.5 text-primary shadow-md sm:h-32 sm:w-32">
              {c.logoUrl ? (
                <img
                  src={c.logoUrl}
                  alt={`${c.name} logo`}
                  width={120}
                  height={120}
                  className="h-full w-full rounded-xl bg-card object-contain"
                />
              ) : (
                <div className="grid h-full w-full place-items-center rounded-xl bg-primary text-primary-foreground">
                  <Building2 className="h-11 w-11" aria-hidden="true" />
                </div>
              )}
            </div>

            {actions && <div className="flex flex-wrap items-center gap-2.5 pb-1">{actions}</div>}
          </div>

          <div className="mt-5 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-[34px]">
                {c.name}
              </h1>
              {c.verified && (
                <Badge
                  variant="secondary"
                  className="gap-1.5 rounded-full border border-emerald-600/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-800"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                  Verified employer
                </Badge>
              )}
              {c.gstinVerified && (
                <Badge
                  variant="outline"
                  className="gap-1 rounded-full border-primary/25 bg-primary/5 px-2.5 py-1 text-[11px] font-semibold text-primary"
                >
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  CIN &amp; GSTIN Verified
                </Badge>
              )}
              {c.employerCode && (
                <span className="rounded-full bg-muted px-2.5 py-1 font-mono text-[11px] font-semibold text-muted-foreground">
                  {c.employerCode}
                </span>
              )}
            </div>

            {(c.tagline || c.mission || c.industry) && (
              <p className="mt-2 max-w-3xl text-sm sm:text-base font-medium text-foreground/85 break-words">
                {c.tagline || c.mission || c.industry}
              </p>
            )}

            <div className="mt-3.5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-[13px] text-muted-foreground">
              {c.industry && (
                <span className="inline-flex items-center gap-1.5 font-medium text-foreground/80">
                  <Building2 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  {c.industry}
                </span>
              )}
              {c.hq && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                  {c.hq}
                </span>
              )}
              {sizeLabel && (
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                  {sizeLabel}
                </span>
              )}
              {c.founded && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                  Est. {c.founded}
                </span>
              )}
              {c.website && (
                <a
                  href={safeUrl(c.website)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
                >
                  <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                  {cleanHost(c.website)}
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              )}
            </div>

            {c.culture && c.culture.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {c.culture.slice(0, 5).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-foreground/85"
                  >
                    <Sparkles className="h-3 w-3 text-primary" aria-hidden="true" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <nav
          aria-label="Company sections"
          className="sticky top-16 z-20 border-t border-border bg-card/95 backdrop-blur"
        >
          <ul className="flex gap-1 overflow-x-auto px-4 sm:px-8 lg:px-10">
            {sections.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => go(s.id)}
                  aria-current={active === s.id ? "true" : undefined}
                  className={cn(
                    "cursor-pointer whitespace-nowrap border-b-2 px-3.5 py-3.5 text-sm font-semibold transition-colors min-h-[44px]",
                    active === s.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* ===== 1. OVERVIEW ===== */}
      {sectionShell(
        "overview",
        "Overview",
        <Building2 className="h-4 w-4" aria-hidden="true" />,
        facts.length === 0 && !(c.highlights?.length) ? (
          <p className="text-sm text-muted-foreground">Company details have not been added yet.</p>
        ) : (
          <div className="space-y-6">
            {c.highlights && c.highlights.length > 0 && (
              <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
                {c.highlights.map((h) => (
                  <div
                    key={h.label}
                    className="rounded-xl border border-border/70 bg-muted/35 p-4"
                  >
                    <p className="text-2xl font-extrabold tracking-tight text-primary tabular-nums">
                      {h.value}
                    </p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-wider text-foreground/90">
                      {h.label}
                    </p>
                    {h.sub && (
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {h.sub}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {facts.length > 0 && (
              <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {facts.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/60 p-3.5"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <dt className="text-xs text-muted-foreground">{label}</dt>
                      <dd className="mt-0.5 text-sm font-semibold text-foreground break-words">
                        {value}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            )}
          </div>
        )
      )}

      {/* ===== 2. ABOUT US & LEADERSHIP ===== */}
      {(c.about || c.mission) &&
        sectionShell(
          "about",
          "About us",
          <Sparkles className="h-4 w-4" aria-hidden="true" />,
          <div className="space-y-6">
            {aboutParagraphs.length > 0 && (
              <div className="space-y-3.5 text-sm sm:text-[15px] leading-relaxed text-foreground/90 max-w-[78ch]">
                {aboutParagraphs.map((para, idx) => (
                  <p key={idx} className="break-words">
                    {para}
                  </p>
                ))}
              </div>
            )}

            {c.mission && (
              <div className="flex items-start gap-3.5 rounded-xl border border-primary/20 bg-primary/[0.04] p-4 sm:p-5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
                  <Target className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                    Our Mission
                  </h3>
                  <p className="mt-1 text-sm sm:text-[15px] font-medium leading-relaxed text-foreground break-words">
                    {c.mission}
                  </p>
                </div>
              </div>
            )}

            {c.leadership && c.leadership.length > 0 && (
              <div className="pt-2">
                <h3 className="mb-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Leadership &amp; Talent Acquisition Team
                </h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  {c.leadership.map((leader) => (
                    <article
                      key={leader.name}
                      className="flex flex-col justify-between rounded-xl border border-border/80 bg-background/60 p-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={leader.photoUrl}
                          alt={leader.name}
                          width={56}
                          height={56}
                          loading="lazy"
                          className="h-14 w-14 shrink-0 rounded-full border border-border object-cover"
                        />
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-foreground break-words">
                            {leader.name}
                          </h4>
                          <p className="text-xs font-semibold text-primary break-words">
                            {leader.role}
                          </p>
                        </div>
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-muted-foreground break-words">
                        {leader.focus}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      {/* ===== 3. OPEN ROLES ===== */}
      {sectionShell(
        "jobs",
        "Open roles",
        <Briefcase className="h-4 w-4" aria-hidden="true" />,
        jobsLoading ? (
          <p className="text-sm text-muted-foreground" role="status">
            Loading open roles…
          </p>
        ) : jobs.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {openRolesCount
              ? `${openRolesCount} open role${openRolesCount === 1 ? "" : "s"}.`
              : "No open roles right now."}
          </p>
        ) : (
          <div className="grid gap-3.5 md:grid-cols-2">
            {jobs.map((j) => {
              const href = jobHref?.(j);
              const metaParts = [j.location, j.mode, j.type, j.experience].filter(Boolean);
              return (
                <article
                  key={j.id}
                  className="flex flex-col justify-between rounded-xl border border-border/80 bg-background/60 p-4 sm:p-5 transition-colors hover:border-primary/40"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        {j.department && (
                          <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                            {j.department}
                          </p>
                        )}
                        <h3 className="mt-0.5 text-base font-bold text-foreground break-words">
                          {j.title}
                        </h3>
                      </div>
                      {j.salary && (
                        <span className="shrink-0 rounded-full border border-emerald-600/25 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-800 tabular-nums">
                          {j.salary}
                        </span>
                      )}
                    </div>

                    {metaParts.length > 0 && (
                      <p className="mt-1.5 text-xs font-medium text-muted-foreground">
                        {metaParts.join(" · ")}
                      </p>
                    )}

                    {j.summary && (
                      <p className="mt-2.5 text-xs leading-relaxed text-foreground/80 break-words">
                        {j.summary}
                      </p>
                    )}

                    {j.skills && j.skills.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {j.skills.slice(0, 5).map((sk) => (
                          <span
                            key={sk}
                            className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground/85"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {(href || j.postedAt) && (
                    <footer className="mt-4 flex items-center justify-between gap-3 border-t border-border/60 pt-3">
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                        {j.postedAt && (
                          <>
                            <Clock className="h-3 w-3" aria-hidden="true" />
                            {j.postedAt}
                          </>
                        )}
                      </span>
                      {href && (
                        <a
                          href={href}
                          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                        >
                          View &amp; Apply
                          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                      )}
                    </footer>
                  )}
                </article>
              );
            })}
          </div>
        ),
        jobs.length > 0 ? (
          <Badge variant="secondary" className="rounded-full text-xs font-semibold">
            {openRolesCount ?? jobs.length} Active Opening{(openRolesCount ?? jobs.length) === 1 ? "" : "s"}
          </Badge>
        ) : undefined
      )}

      {/* ===== 4. CULTURE, BENEFITS, WORKPLACE & HIRING PROCESS ===== */}
      {(c.benefits?.length || c.culture?.length)
        ? sectionShell(
            "culture",
            "Culture & benefits",
            <Award className="h-4 w-4" aria-hidden="true" />,
            <div className="space-y-7">
              {c.culture && c.culture.length > 0 && (
                <div>
                  <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Engineering &amp; Workplace Values
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {c.culture.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {c.benefits && c.benefits.length > 0 && (
                <div>
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Perks &amp; Benefits
                  </h3>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {c.benefits.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-background/60 p-3.5 text-sm font-medium text-foreground"
                      >
                        <CheckCircle2
                          className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                          aria-hidden="true"
                        />
                        <span className="break-words">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {c.workplacePhotos && c.workplacePhotos.length > 0 && (
                <div>
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Inside {c.name}
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {c.workplacePhotos.map((photo) => (
                      <figure
                        key={photo.caption}
                        className="overflow-hidden rounded-xl border border-border/80 bg-background/60"
                      >
                        <img
                          src={photo.imageUrl}
                          alt={photo.alt}
                          width={640}
                          height={400}
                          loading="lazy"
                          className="aspect-[16/10] w-full object-cover"
                        />
                        <figcaption className="p-3 text-xs leading-relaxed text-muted-foreground">
                          {photo.caption}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </div>
              )}

              {c.hiringSteps && c.hiringSteps.length > 0 && (
                <div>
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    How We Hire (Skill-First Candidate Journey)
                  </h3>
                  <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
                    {c.hiringSteps.map((st) => (
                      <article
                        key={st.step}
                        className="rounded-xl border border-border/70 bg-muted/30 p-4"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-extrabold text-primary-foreground">
                            {st.step}
                          </span>
                          <span className="rounded-full bg-background px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                            {st.duration}
                          </span>
                        </div>
                        <h4 className="mt-3 text-sm font-bold text-foreground">{st.title}</h4>
                        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                          {st.description}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        : null}

      {/* ===== 5. LOCATIONS & HIRING REGIONS ===== */}
      {((c.locations?.length ?? 0) > 0 || (c.regions?.length ?? 0) > 0) &&
        sectionShell(
          "locations",
          "Locations & hiring regions",
          <MapPin className="h-4 w-4" aria-hidden="true" />,
          <div className="space-y-5 text-sm">
            {c.address && (
              <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Registered Corporate Headquarters
                </h3>
                <p className="mt-1 text-sm font-medium text-foreground break-words">{c.address}</p>
              </div>
            )}

            {c.locations && c.locations.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Office Hubs
                </h3>
                <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2">
                  {c.locations.map((l) => (
                    <div
                      key={l}
                      className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-background/60 px-3.5 py-2.5 text-xs font-semibold text-foreground"
                    >
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                      <span className="break-words">{l}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {c.regions && c.regions.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Active Hiring Regions
                </h3>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {c.regions.map((l) => (
                    <span
                      key={l}
                      className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-foreground"
                    >
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      {/* ===== 6. CONTACT & SOCIAL CHANNELS ===== */}
      {(c.contact || Object.values(c.social ?? {}).some(Boolean)) &&
        sectionShell(
          "contact",
          "Contact",
          <Mail className="h-4 w-4" aria-hidden="true" />,
          <div className="grid gap-6 sm:grid-cols-2">
            {c.contact && (
              <div>
                <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Talent Acquisition &amp; Official Desk
                </h3>
                <ul className="space-y-2.5 text-sm">
                  {c.contact.email && (
                    <li className="flex items-center gap-2.5">
                      <Mail className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      <a
                        className="font-medium text-primary hover:underline break-all"
                        href={`mailto:${c.contact.email}`}
                      >
                        {c.contact.email}
                      </a>
                    </li>
                  )}
                  {c.contact.altEmails?.map((e) => (
                    <li key={e} className="flex items-center gap-2.5">
                      <Mail className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                      <a
                        className="text-primary hover:underline break-all"
                        href={`mailto:${e}`}
                      >
                        {e}
                      </a>
                    </li>
                  ))}
                  {c.contact.phone && (
                    <li className="flex items-center gap-2.5 font-medium text-foreground">
                      <Phone className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      {c.contact.phone}
                    </li>
                  )}
                  {c.contact.altPhones?.map((p) => (
                    <li key={p} className="flex items-center gap-2.5 text-muted-foreground">
                      <Phone className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {Object.values(c.social ?? {}).some(Boolean) && (
              <div>
                <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Official Channels
                </h3>
                <ul className="flex flex-wrap items-start gap-2.5">
                  {Object.entries(c.social ?? {})
                    .filter(([, v]) => v)
                    .map(([k, v]) => {
                      const meta = SOCIAL[k] ?? { icon: Globe, label: k };
                      const Icon = meta.icon;
                      return (
                        <li key={k}>
                          <a
                            href={safeUrl(v)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
                          >
                            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                            {meta.label}
                          </a>
                        </li>
                      );
                    })}
                </ul>
              </div>
            )}
          </div>
        )}
    </div>
  );
}
