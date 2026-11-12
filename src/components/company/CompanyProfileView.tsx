import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Briefcase, Building2, Calendar, CheckCircle2, ExternalLink, Facebook, Github, Globe, Instagram, Linkedin, Mail, MapPin, Phone, Twitter, Users, Youtube,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface CompanyView {
  name: string;
  logoUrl?: string | null;
  coverUrl?: string | null;
  verified?: boolean;
  industry?: string | null;
  category?: string | null;
  type?: string | null;
  size?: string | null;
  hq?: string | null;
  founded?: number | null;
  website?: string | null;
  about?: string | null;
  mission?: string | null;
  benefits?: string[];
  culture?: string[];
  regions?: string[];
  locations?: string[];
  social?: Record<string, string>;
  contact?: { email?: string | null; phone?: string | null; altEmails?: string[]; altPhones?: string[] } | null;
}

export interface CompanyJob {
  id: string;
  title: string;
  location?: string | null;
  mode?: string | null;
  type?: string | null;
  skills?: string[];
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

/**
 * LinkedIn-style company page: cover, identity header, a single horizontal section bar and one smooth
 * vertical scroll. Used for both the public page and the employer's preview so they cannot drift apart.
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
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id.replace("company-", ""));
      },
      { rootMargin: "-120px 0px -60% 0px" },
    );
    sections.forEach((s) => { const el = refs.current[s.id]; if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [sections]);

  const go = (id: string) => {
    setActive(id);
    refs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const facts: Array<{ icon: typeof Globe; label: string; value: string }> = [
    c.industry ? { icon: Building2, label: "Industry", value: c.industry } : null,
    c.category ? { icon: Briefcase, label: "Category", value: c.category } : null,
    c.type ? { icon: Building2, label: "Company type", value: c.type } : null,
    c.size ? { icon: Users, label: "Company size", value: `${c.size} employees` } : null,
    c.hq ? { icon: MapPin, label: "Headquarters", value: c.hq } : null,
    c.founded ? { icon: Calendar, label: "Founded", value: String(c.founded) } : null,
  ].filter((x): x is { icon: typeof Globe; label: string; value: string } => x !== null);

  const sectionShell = (id: string, title: string, body: ReactNode) => (
    <section id={`company-${id}`} ref={(el) => { refs.current[id] = el; }} className="scroll-mt-32 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold">{title}</h2>
      {body}
    </section>
  );

  return (
    <div className="space-y-5">
      <header className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="h-36 w-full bg-primary/15 sm:h-48" aria-hidden={!c.coverUrl}>
          {c.coverUrl && <img src={c.coverUrl} alt={`${c.name} cover`} className="h-full w-full object-cover" />}
        </div>
        <div className="px-5 pb-5 sm:px-8">
          <div className="-mt-12 flex flex-wrap items-end gap-4 sm:-mt-14">
            <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-2xl border-4 border-card bg-primary text-primary-foreground shadow sm:h-28 sm:w-28">
              {c.logoUrl ? <img src={c.logoUrl} alt={`${c.name} logo`} className="h-full w-full bg-card object-contain" /> : <Building2 className="h-10 w-10" />}
            </div>
            <div className="ml-auto flex flex-wrap items-center gap-2 pb-1">{actions}</div>
          </div>
          <div className="mt-4 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{c.name}</h1>
              {c.verified && (
                <Badge variant="secondary" className="gap-1 border border-success/30 bg-success/10 text-success"><CheckCircle2 className="h-3.5 w-3.5" />Verified employer</Badge>
              )}
            </div>
            {(c.mission || c.industry) && <p className="mt-1 text-sm text-muted-foreground">{c.mission || c.industry}</p>}
            <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {c.hq && <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{c.hq}</span>}
              {c.size && <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{c.size} employees</span>}
              {c.website && (
                <a href={safeUrl(c.website)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-primary hover:underline">
                  <Globe className="h-3.5 w-3.5" />Website<ExternalLink className="h-3 w-3" />
                </a>
              )}
            </p>
          </div>
        </div>
        <nav aria-label="Company sections" className="sticky top-16 z-20 border-t border-border bg-card/95 backdrop-blur">
          <ul className="flex gap-1 overflow-x-auto px-3 sm:px-6">
            {sections.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => go(s.id)}
                  aria-current={active === s.id ? "true" : undefined}
                  className={cn(
                    "cursor-pointer whitespace-nowrap border-b-2 px-3 py-3 text-sm font-semibold transition-colors",
                    active === s.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {sectionShell("overview", "Overview", facts.length === 0 ? (
        <p className="text-sm text-muted-foreground">Company details have not been added yet.</p>
      ) : (
        <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {facts.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-muted text-primary"><Icon className="h-4 w-4" /></span>
              <div className="min-w-0"><dt className="text-xs text-muted-foreground">{label}</dt><dd className="text-sm font-semibold">{value}</dd></div>
            </div>
          ))}
        </dl>
      ))}

      {(c.about || c.mission) && sectionShell("about", "About us", (
        <div className="space-y-4 text-sm leading-relaxed">
          {c.about && <p className="whitespace-pre-line">{c.about}</p>}
          {c.mission && <div><h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Mission</h3><p className="mt-1 whitespace-pre-line">{c.mission}</p></div>}
        </div>
      ))}

      {sectionShell("jobs", "Open roles", jobsLoading ? (
        <p className="text-sm text-muted-foreground" role="status">Loading open roles…</p>
      ) : jobs.length === 0 ? (
        <p className="text-sm text-muted-foreground">{openRolesCount ? `${openRolesCount} open role${openRolesCount === 1 ? "" : "s"}.` : "No open roles right now."}</p>
      ) : (
        <ul className="divide-y divide-border">
          {jobs.map((j) => {
            const href = jobHref?.(j);
            const body = (
              <>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{j.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{[j.location, j.mode, j.type].filter(Boolean).join(" · ")}</p>
                  {j.skills && j.skills.length > 0 && <p className="mt-1 truncate text-[11px] text-muted-foreground">{j.skills.slice(0, 5).join(" · ")}</p>}
                </div>
                {href && <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />}
              </>
            );
            return (
              <li key={j.id}>
                {href ? <a href={href} className="flex items-center justify-between gap-4 py-3 hover:bg-muted/40">{body}</a> : <div className="flex items-center justify-between gap-4 py-3">{body}</div>}
              </li>
            );
          })}
        </ul>
      ))}

      {(c.benefits?.length || c.culture?.length) ? sectionShell("culture", "Culture & benefits", (
        <div className="space-y-5">
          {c.culture && c.culture.length > 0 && <div className="flex flex-wrap gap-2">{c.culture.map((t) => <span key={t} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{t}</span>)}</div>}
          {c.benefits && c.benefits.length > 0 && (
            <ul className="grid gap-2 sm:grid-cols-2">{c.benefits.map((b) => <li key={b} className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 shrink-0 text-success" />{b}</li>)}</ul>
          )}
        </div>
      )) : null}

      {((c.locations?.length ?? 0) > 0 || (c.regions?.length ?? 0) > 0) && sectionShell("locations", "Locations & hiring regions", (
        <div className="space-y-4 text-sm">
          {c.locations && c.locations.length > 0 && <div><h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Offices</h3><div className="mt-2 flex flex-wrap gap-2">{c.locations.map((l) => <span key={l} className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs"><MapPin className="h-3 w-3" />{l}</span>)}</div></div>}
          {c.regions && c.regions.length > 0 && <div><h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Hiring in</h3><div className="mt-2 flex flex-wrap gap-2">{c.regions.map((l) => <span key={l} className="rounded-full bg-muted px-3 py-1 text-xs">{l}</span>)}</div></div>}
        </div>
      ))}

      {(c.contact || Object.values(c.social ?? {}).some(Boolean)) && sectionShell("contact", "Contact", (
        <div className="grid gap-6 sm:grid-cols-2">
          {c.contact && (
            <ul className="space-y-2 text-sm">
              {c.contact.email && <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /><a className="text-primary hover:underline" href={`mailto:${c.contact.email}`}>{c.contact.email}</a></li>}
              {c.contact.altEmails?.map((e) => <li key={e} className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /><a className="text-primary hover:underline" href={`mailto:${e}`}>{e}</a></li>)}
              {c.contact.phone && <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" />{c.contact.phone}</li>}
              {c.contact.altPhones?.map((p) => <li key={p} className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" />{p}</li>)}
            </ul>
          )}
          <ul className="flex flex-wrap items-start gap-2">
            {Object.entries(c.social ?? {}).filter(([, v]) => v).map(([k, v]) => {
              const meta = SOCIAL[k] ?? { icon: Globe, label: k };
              const Icon = meta.icon;
              return (
                <li key={k}>
                  <a href={safeUrl(v)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:border-primary hover:text-primary">
                    <Icon className="h-3.5 w-3.5" />{meta.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
