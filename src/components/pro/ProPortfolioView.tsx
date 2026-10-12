import React, { useState } from "react";
import {
  Linkedin,
  Github,
  MapPin,
  Briefcase,
  Award,
  Layers,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  BadgeCheck,
  Copy,
  User,
  Plus,
  X,
  Check,
  Code2,
  FolderGit2,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ProUser, ProJob } from "@/data/proData";
import { getCompanyLogo } from "@/data/portalAssets";
import { ProDrawerState } from "./proTypes";

interface ProPortfolioViewProps {
  user: ProUser;
  jobs: ProJob[];
  onOpenDrawer: (drawer: ProDrawerState) => void;
  onToast: (msg: string) => void;
  onUpdateUser?: (updated: ProUser) => void;
}

export const ProPortfolioView: React.FC<ProPortfolioViewProps> = ({
  user,
  jobs,
  onOpenDrawer,
  onToast,
  onUpdateUser,
}) => {
  const isEmployer = user.role === "employer";

  if (isEmployer) {
    // EMPLOYER PORTFOLIO
    const cp = user.cp || {};
    const companyJobs = jobs.filter((j) => j.by === user.email);

    return (
      <div className="space-y-6">
        {/* Company Header Banner */}
        <div className="bg-card border border-border/80 rounded-2xl overflow-hidden shadow-sm">
          <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-background border-b border-border/60 relative" />
          <div className="px-6 pb-6 pt-0 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12">
              <div className="flex items-end gap-4">
                <div className="w-24 h-24 rounded-2xl bg-card border-2 border-border shadow-md flex items-center justify-center p-2 shrink-0">
                  <img
                    src={getCompanyLogo(user.name)}
                    alt={user.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-display flex items-center gap-2">
                    {cp.name || user.name}
                    <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                  </h1>
                  <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                    <span>{cp.ind || "Technology"}</span>
                    <span>•</span>
                    <span>{cp.size || "Mid"} Company</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {cp.hq || "Bengaluru, India"}
                    </span>
                    {cp.site && (
                      <>
                        <span>•</span>
                        <a
                          href={`https://${cp.site}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1 font-medium"
                        >
                          {cp.site} <ExternalLink className="w-3 h-3" />
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company About & Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-foreground text-base">About {cp.name || user.name}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
              {cp.about ||
                "Super30 Technologies is building developer tooling and autonomous engineering platforms for modern software teams worldwide."}
            </p>

            {cp.mission && (
              <div className="pt-2 border-t border-border/60 space-y-1">
                <span className="text-xs font-semibold text-foreground">Our Mission</span>
                <p className="text-xs text-muted-foreground leading-relaxed">{cp.mission}</p>
              </div>
            )}
          </div>

          {/* Benefits & Perks */}
          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> Perks & Culture
            </h3>
            <div className="flex flex-wrap gap-2">
              {(cp.ben || ["Remote work", "Health insurance", "Learning budget", "Flexible hours", "Stock options"]).map(
                (perk) => (
                  <span
                    key={perk}
                    className="px-2.5 py-1 rounded-lg bg-muted text-foreground text-xs font-medium border border-border/60"
                  >
                    {perk}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* Open Job Listings */}
        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground text-base flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" /> Open Opportunities ({companyJobs.length})
            </h3>
          </div>

          <div className="divide-y divide-border/60">
            {companyJobs.length === 0 ? (
              <p className="text-xs text-muted-foreground py-6 text-center">No active positions posted yet.</p>
            ) : (
              companyJobs.map((j) => (
                <div
                  key={j.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <h4
                      className="font-bold text-foreground text-sm hover:text-primary transition-colors cursor-pointer"
                      onClick={() => onOpenDrawer({ type: "job", id: j.id })}
                    >
                      {j.t}
                    </h4>
                    <div className="text-muted-foreground text-[11px] flex items-center gap-2 mt-0.5">
                      <span>{j.l}</span>
                      <span>•</span>
                      <span>{j.m}</span>
                      <span>•</span>
                      <span>₹{j.a}–{j.b} LPA</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="rounded-xl text-xs h-8"
                    onClick={() => onOpenDrawer({ type: "job", id: j.id })}
                  >
                    Apply Now
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // CANDIDATE PORTFOLIO
  return <CandidatePortfolio user={user} onToast={onToast} onUpdateUser={onUpdateUser} />;
};

const tile = "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary";
const card = "rounded-2xl border border-border bg-card p-5 shadow-sm";
const outlineRed =
  "h-8 gap-1.5 rounded-lg border-primary/40 bg-background px-3 text-xs font-semibold text-primary hover:bg-primary/5 hover:text-primary";
const labelCls = "mb-1 block text-[11px] font-medium text-muted-foreground";
const inputCls = "h-9 rounded-lg text-xs";
const heroGhost =
  "inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200/90 px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer";

const initialsOf = (s: string) =>
  s
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

const stripProto = (u: string) => u.replace(/^https?:\/\//, "");

type PortfolioProject = { t: string; l?: string; d?: string; s?: string; m?: string };

const SAMPLE_PROJECTS: PortfolioProject[] = [
  { t: "OpenUI Component Library", l: "github.com/vignesh/openui", d: "Tree-shakeable, WCAG AA compliant headless UI system.", s: "React, TypeScript, Tailwind CSS", m: "1.2k GitHub stars" },
  { t: "Pulse Health Tracker", l: "pulse-demo.app", d: "Realtime health tracking PWA built with Next.js and WebSockets.", s: "Next.js, IndexedDB, WebSockets", m: "99.9% uptime" },
];

const CandidatePortfolio: React.FC<{
  user: ProUser;
  onToast: (msg: string) => void;
  onUpdateUser?: (updated: ProUser) => void;
}> = ({ user, onToast, onUpdateUser }) => {
  const [projects, setProjects] = useState<PortfolioProject[]>(user.pj && user.pj.length ? user.pj : SAMPLE_PROJECTS);
  const [showAddProj, setShowAddProj] = useState(false);
  const [newProj, setNewProj] = useState({ t: "", l: "", d: "", s: "", m: "" });
  const [openProject, setOpenProject] = useState<number | null>(null);
  const [showAllCerts, setShowAllCerts] = useState(false);

  const skills = user.sk || [];
  const experience = user.ex || [];
  const certs = (user.ce || []).map((c, index) => {
    const p = String(c).split(" · ");
    return { index, title: p[0] || String(c), issuer: p[1] || "Accredited provider", year: p[2] || "" };
  });

  const persistProjects = (next: PortfolioProject[]) => {
    setProjects(next);
    onUpdateUser?.({ ...user, pj: next });
  };

  const handleAddProj = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProj.t.trim()) return;
    persistProjects([...projects, { ...newProj }]);
    setNewProj({ t: "", l: "", d: "", s: "", m: "" });
    setShowAddProj(false);
    onToast("Project added");
  };

  const copyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    onToast("Profile link copied to clipboard!");
  };

  const location = [user.city, user.state].filter(Boolean).join(", ") || "Location not set";
  const expLabel = `${user.exp ?? 0} ${user.exp === 1 ? "Year" : "Years"}`;
  const topSkills = skills.slice(0, 11);
  const linkedin = user.links?.li;
  const github = user.links?.gh;

  return (
    <div className="space-y-5">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-blue-200/80 bg-gradient-to-r from-[#dbeafe] via-[#eff6ff] to-[#dbeafe] p-6 sm:p-8 shadow-xs text-slate-900">
        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4 sm:gap-5">
            <span className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-blue-50 text-blue-600 border border-blue-200/80 font-display text-3xl font-extrabold sm:h-24 sm:w-24 sm:text-4xl shadow-2xs">
              {(user.name.charAt(0) || "U").toUpperCase()}
            </span>
            <div className="min-w-0 space-y-1.5">
              <h1 className="flex items-center gap-2 font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl text-slate-900">
                <span className="truncate">{user.name}</span>
                <BadgeCheck className="h-5 w-5 shrink-0 text-blue-600" aria-label="Verified profile" />
              </h1>
              <p className="text-xs text-slate-600 sm:text-sm">
                {user.head || "Add a headline to tell recruiters what you do"}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Briefcase className="h-3 w-3" /> {expLabel} Experience
                </span>
                {github && (
                  <span className="inline-flex items-center gap-1">
                    <Github className="h-3 w-3" /> {stripProto(github)}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <button type="button" onClick={copyLink} className={heroGhost}>
              <Copy className="h-3.5 w-3.5" /> Copy link
            </button>
            {linkedin ? (
              <a href={`https://${stripProto(linkedin)}`} target="_blank" rel="noopener noreferrer" className={heroGhost}>
                <Linkedin className="h-3.5 w-3.5" /> LinkedIn
              </a>
            ) : (
              <button type="button" onClick={() => onToast("Add your LinkedIn link in your profile settings")} className={heroGhost}>
                <Linkedin className="h-3.5 w-3.5" /> LinkedIn
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[3fr_2fr]">
        <div className="space-y-5">
          {/* About */}
          <div className={cn(card, "space-y-3")}>
            <div className="flex items-center gap-3">
              <span className={tile}>
                <User className="h-4 w-4" />
              </span>
              <h3 className="font-display text-sm font-semibold text-foreground">About Me</h3>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {user.about || "Write a short summary so recruiters know who you are and what you specialize in."}
            </p>
            {topSkills.length > 0 && (
              <div className="space-y-2 border-t border-border pt-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-foreground">Skills</div>
                <div className="flex flex-wrap gap-1.5">
                  {topSkills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-border bg-muted/50 px-2.5 py-1 text-[11px] font-medium text-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Experience */}
          <div className={cn(card, "space-y-4")}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className={tile}>
                  <Briefcase className="h-4 w-4" />
                </span>
                <h3 className="font-display text-sm font-semibold text-foreground">Experience</h3>
              </div>
              <span className="text-[11px] text-muted-foreground">{expLabel}</span>
            </div>
            {experience.length === 0 ? (
              <p className="text-xs text-muted-foreground">No experience added yet.</p>
            ) : (
              <ol className="space-y-4">
                {experience.map((x, idx) => (
                  <li key={`${x.co}-${x.role}-${idx}`} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className={cn("mt-1 h-2.5 w-2.5 rounded-full", idx === 0 ? "bg-primary" : "bg-muted-foreground/40")} />
                      {idx < experience.length - 1 && <span className="mt-1 w-px flex-1 bg-border" />}
                    </div>
                    <div className="min-w-0 flex-1 pb-1">
                      <div className="font-display text-sm font-semibold text-foreground">{x.role}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {x.co} · {x.fr} – {x.to}
                      </div>
                      {x.d && <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{x.d}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        {/* Certifications */}
        <div className={cn(card, "space-y-3")}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className={tile}>
                <Award className="h-4 w-4" />
              </span>
              <h3 className="font-display text-sm font-semibold text-foreground">Certifications</h3>
            </div>
            {certs.length > 5 && (
              <button
                type="button"
                onClick={() => setShowAllCerts((v) => !v)}
                className="text-xs font-semibold text-primary hover:underline"
              >
                {showAllCerts ? "Show less" : "View All"}
              </button>
            )}
          </div>

          {certs.length === 0 ? (
            <p className="text-xs text-muted-foreground">No certifications yet. Add one from the Certifications page.</p>
          ) : (
            <div className="divide-y divide-border">
              {(showAllCerts ? certs : certs.slice(0, 5)).map((c) => (
                <div key={c.index} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      aria-hidden
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 font-display text-xs font-bold text-primary"
                    >
                      {initialsOf(c.issuer)}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate text-xs font-semibold text-foreground">{c.title}</div>
                      <div className="truncate text-[11px] text-muted-foreground">
                        {c.issuer}
                        {c.year && ` · ${c.year}`}
                      </div>
                    </div>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                    <Check className="h-3 w-3" /> Verified
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Skills */}
      <div className={cn(card, "space-y-3")}>
        <div className="flex items-center gap-3">
          <span className={tile}>
            <Code2 className="h-4 w-4" />
          </span>
          <h3 className="font-display text-sm font-semibold text-foreground">Skills</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.length === 0 && <p className="text-xs text-muted-foreground">No skills added yet.</p>}
          {skills.map((s) => (
            <span
              key={s}
              className="rounded-full border border-border bg-muted/50 px-3 py-1 text-[11px] font-medium text-foreground"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className={cn(card, "space-y-4")}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className={tile}>
              <Layers className="h-4 w-4" />
            </span>
            <h3 className="font-display text-sm font-semibold text-foreground">Projects</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-muted-foreground">
              {projects.length} {projects.length === 1 ? "Project" : "Projects"}
            </span>
            <Button variant="outline" size="sm" className={outlineRed} onClick={() => setShowAddProj((v) => !v)}>
              <Plus className="h-3.5 w-3.5" /> Add Project
            </Button>
          </div>
        </div>

        {showAddProj && (
          <form onSubmit={handleAddProj} className="space-y-3 rounded-xl border border-primary/30 bg-primary/5 p-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Project name</label>
                <Input value={newProj.t} onChange={(e) => setNewProj({ ...newProj, t: e.target.value })} className={inputCls} required />
              </div>
              <div>
                <label className={labelCls}>Link</label>
                <Input value={newProj.l} onChange={(e) => setNewProj({ ...newProj, l: e.target.value })} placeholder="github.com/you/project" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Tech stack (comma separated)</label>
                <Input value={newProj.s} onChange={(e) => setNewProj({ ...newProj, s: e.target.value })} placeholder="React, Node.js" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Impact metric</label>
                <Input value={newProj.m} onChange={(e) => setNewProj({ ...newProj, m: e.target.value })} placeholder="35% faster reporting" className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Description</label>
              <Textarea rows={2} value={newProj.d} onChange={(e) => setNewProj({ ...newProj, d: e.target.value })} className="text-xs" />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" className="rounded-lg text-xs" onClick={() => setShowAddProj(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="rounded-lg text-xs">
                Save project
              </Button>
            </div>
          </form>
        )}

        {projects.length === 0 ? (
          <p className="text-xs text-muted-foreground">No projects yet. Showcase your best work.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
            {projects.map((p, idx) => {
              const stack = (p.s || "")
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean);
              const isLastOdd = idx === projects.length - 1 && projects.length % 2 === 1 && projects.length > 1;
              const isOpen = openProject === idx;
              return (
                <div
                  key={`${p.t}-${idx}`}
                  className={cn(
                    "relative flex flex-col justify-between gap-3 rounded-xl border border-border bg-background p-4",
                    isLastOdd && "md:col-span-2"
                  )}
                >
                  <button
                    type="button"
                    aria-label={`Remove ${p.t}`}
                    onClick={() => {
                      persistProjects(projects.filter((_, i) => i !== idx));
                      if (openProject === idx) setOpenProject(null);
                    }}
                    className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <div className="space-y-2 pr-6">
                    <div className="flex items-start gap-3">
                      <span className={tile}>
                        <FolderGit2 className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <div className="font-display text-sm font-semibold text-foreground">{p.t}</div>
                        {p.d && <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{p.d}</p>}
                      </div>
                    </div>
                    {stack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pl-12">
                        {stack.map((t) => (
                          <span
                            key={t}
                            className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-foreground"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {isOpen && p.l && (
                    <a
                      href={`https://${stripProto(p.l)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 pl-12 text-[11px] font-semibold text-primary hover:underline"
                    >
                      {p.l} <ExternalLink className="h-3 w-3" />
                    </a>
                  )}

                  <div className="flex items-center justify-between gap-3 pl-12">
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                      {p.m && (
                        <>
                          <TrendingUp className="h-3 w-3" /> {p.m}
                        </>
                      )}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className={outlineRed}
                      onClick={() => setOpenProject(isOpen ? null : idx)}
                    >
                      {isOpen ? "Hide Details" : "View Details"} <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
