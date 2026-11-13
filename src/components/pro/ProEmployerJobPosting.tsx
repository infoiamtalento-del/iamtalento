import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  AlertTriangle, BadgeCheck, BarChart3, BriefcaseBusiness, CalendarClock, Check, Copy, Crown, ExternalLink, Eye,
  FilePenLine, FileText, IndianRupee, Megaphone, Monitor, MapPin, Pause, Play, Plus, Power, RefreshCw, Save,
  Search, Send, Sparkles, Tags, Trash2, TrendingUp, Users, Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { JOB_TEMPLATES, type ProApplication, type ProJob, type ProUser } from "@/data/proData";
import { getCompanyLogo } from "@/data/portalAssets";
import type { ProView } from "./proTypes";
import "./employer-workspace.css";

interface JobComposerState {
  id: number | null;
  title: string;
  industry: string;
  department: string;
  jobFunction: string;
  city: string;
  country: string;
  location: string;
  mode: ProJob["m"];
  type: ProJob["ty"];
  experience: number;
  min: number;
  max: number;
  salaryVisible: boolean;
  skills: string;
  description: string;
  responsibilities: string;
  qualifications: string;
  requirements: string;
  benefits: string;
  closesAt: string;
  scheduledAt: string;
  autoClose: boolean;
  expiryReminderDays: number;
  promotionTier: "none" | "featured" | "sponsored";
}

const initialComposer: JobComposerState = {
  id: null,
  title: "Senior React Developer",
  industry: "Software & SaaS",
  department: "Engineering",
  jobFunction: "Frontend Development",
  city: "Bengaluru",
  country: "India",
  location: "Bengaluru",
  mode: "Hybrid",
  type: "Full-time",
  experience: 3,
  min: 18,
  max: 30,
  salaryVisible: true,
  skills: "React, TypeScript, Next.js, Node.js",
  description:
    "We are looking for a Senior React Developer with 3+ years of experience to join our team in Bengaluru. The ideal candidate should have strong knowledge in React, TypeScript, Next.js and Node.js.",
  responsibilities:
    "Architect modular React surfaces, optimize Core Web Vitals, and collaborate with product and design leads.",
  qualifications: "B.Tech / B.E. in Computer Science or equivalent frontend engineering experience.",
  requirements: "3+ years production React & TypeScript, state management, and automated UI testing.",
  benefits: "Health Insurance, Learning Stipend, Hybrid Work Allowance, ESOPs",
  closesAt: new Date(Date.now() + 86400000 * 30).toISOString().slice(0, 10),
  scheduledAt: "",
  autoClose: true,
  expiryReminderDays: 5,
  promotionTier: "none",
};

function Field({
  label,
  children,
  icon,
  required = false,
}: {
  label: string;
  children: ReactNode;
  icon?: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="workspace-field">
      <span className="flex items-center gap-2">
        {icon}
        {label}
        {required && <span className="text-primary">*</span>}
      </span>
      {children}
    </label>
  );
}

const splitCsv = (raw: string) =>
  [...new Set(raw.split(",").map((s) => s.trim()).filter(Boolean))];

function tokenSimilarity(a: string, b: string): number {
  const tokA = new Set(a.toLowerCase().split(/[^a-z0-9+#.]+/).filter((w) => w.length > 1));
  const tokB = new Set(b.toLowerCase().split(/[^a-z0-9+#.]+/).filter((w) => w.length > 1));
  if (!tokA.size || !tokB.size) return 0;
  let overlap = 0;
  for (const t of tokA) if (tokB.has(t)) overlap++;
  return Math.round((overlap / Math.max(tokA.size, tokB.size)) * 100);
}

export interface ProEmployerJobPostingProps {
  user: ProUser;
  jobs?: ProJob[];
  applications?: ProApplication[];
  searchParams?: URLSearchParams;
  onPublishJob: (data: Partial<ProJob>) => void;
  onSaveJob?: (job: ProJob) => void;
  onDuplicateJob?: (jobId: number) => void;
  onDeleteJob?: (jobId: number) => void;
  onNavigate?: (view: ProView, query?: Record<string, string>) => void;
  onToast: (message: string) => void;
}

export function ProEmployerJobPosting({
  user,
  jobs = [],
  applications = [],
  searchParams,
  onPublishJob,
  onSaveJob,
  onDuplicateJob,
  onDeleteJob,
  onNavigate,
  onToast,
}: ProEmployerJobPostingProps) {
  const company = user.cp?.name || user.name;
  const [localJobs, setLocalJobs] = useState<ProJob[]>([]);
  const effectiveJobs = useMemo(() => {
    const owned = jobs.filter((j) => j.by === user.email);
    const merged = [...owned];
    for (const lj of localJobs) {
      if (!merged.some((m) => m.id === lj.id)) merged.unshift(lj);
    }
    return merged;
  }, [jobs, localJobs, user.email]);

  const [activeTab, setActiveTab] = useState<"manage" | "compose">(() =>
    searchParams?.get("new") === "1" || jobs.filter((j) => j.by === user.email).length === 0 ? "compose" : "manage"
  );
  const [statusFilter, setStatusFilter] = useState(() => searchParams?.get("status") ?? "");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"newest" | "applications" | "views" | "conversion">("newest");

  const [form, setForm] = useState<JobComposerState>(() => {
    try {
      const draft = sessionStorage.getItem("employer-job-draft");
      return draft ? ({ ...initialComposer, ...JSON.parse(draft) } as JobComposerState) : initialComposer;
    } catch {
      return initialComposer;
    }
  });
  const [preview, setPreview] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [benchmarkInfo, setBenchmarkInfo] = useState<{ min: number; median: number; max: number; city: string } | null>(null);
  const [competitorInfo, setCompetitorInfo] = useState<{
    openings: number;
    companies: number;
    avgMin: number;
    avgMax: number;
    topSkills: string[];
  } | null>(null);

  const set = <K extends keyof JobComposerState>(key: K, value: JobComposerState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const skills = splitCsv(form.skills);
  const benefits = splitCsv(form.benefits);

  const upsertJob = (nextJob: ProJob) => {
    if (onSaveJob) {
      onSaveJob(nextJob);
    } else {
      setLocalJobs((prev) => {
        const exists = prev.some((j) => j.id === nextJob.id);
        return exists ? prev.map((j) => (j.id === nextJob.id ? nextJob : j)) : [nextJob, ...prev];
      });
    }
  };

  // Duplicate Job Detection
  const duplicateMatches = useMemo(() => {
    const title = form.title.trim();
    if (title.length < 3) return [];
    return effectiveJobs
      .filter((j) => j.id !== form.id)
      .map((j) => ({ job: j, pct: tokenSimilarity(title, j.t) }))
      .filter((m) => m.pct >= 60)
      .sort((a, b) => b.pct - a.pct);
  }, [effectiveJobs, form.title, form.id]);

  // Metrics & Job Performance
  const appCountByJob = useMemo(() => {
    const map: Record<number, number> = {};
    for (const a of applications) {
      map[a.jid] = (map[a.jid] ?? 0) + 1;
    }
    return map;
  }, [applications]);

  const metrics = useMemo(() => {
    let active = 0;
    let draftsAndScheduled = 0;
    let promoted = 0;
    let totalViews = 0;
    let totalApps = 0;
    for (const j of effectiveJobs) {
      const st = j.status ?? "active";
      if (st === "active") active++;
      if (st === "draft" || st === "scheduled") draftsAndScheduled++;
      if (j.featured || j.sponsored) promoted++;
      const v = j.views ?? 110;
      totalViews += v;
      totalApps += appCountByJob[j.id] ?? 0;
    }
    const conversion = totalViews > 0 ? Math.round((totalApps / totalViews) * 1000) / 10 : 0;
    return { active, draftsAndScheduled, promoted, totalViews, totalApps, conversion };
  }, [effectiveJobs, appCountByJob]);

  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = effectiveJobs.filter((j) => {
      const st = j.status ?? "active";
      if (statusFilter === "closed") {
        if (st !== "closed" && st !== "expired") return false;
      } else if (statusFilter === "promoted") {
        if (!j.featured && !j.sponsored) return false;
      } else if (statusFilter && st !== statusFilter) {
        return false;
      }
      if (!q) return true;
      const hay = `${j.t} ${j.l} ${j.city ?? ""} ${j.industry ?? ""} ${j.department ?? ""} ${(j.sk ?? []).join(" ")}`.toLowerCase();
      return hay.includes(q);
    });

    return [...list].sort((a, b) => {
      const appsA = appCountByJob[a.id] ?? 0;
      const appsB = appCountByJob[b.id] ?? 0;
      const viewsA = a.views ?? 110;
      const viewsB = b.views ?? 110;
      if (sort === "applications") return appsB - appsA;
      if (sort === "views") return viewsB - viewsA;
      if (sort === "conversion") {
        const convA = viewsA > 0 ? appsA / viewsA : 0;
        const convB = viewsB > 0 ? appsB / viewsB : 0;
        return convB - convA;
      }
      return b.at - a.at;
    });
  }, [effectiveJobs, statusFilter, query, sort, appCountByJob]);

  const buildJobObject = (targetStatus: NonNullable<ProJob["status"]>): ProJob => {
    const displayLocation = form.location.trim() || [form.city.trim(), form.country.trim()].filter(Boolean).join(", ") || "Bengaluru";
    return {
      id: form.id ?? Date.now(),
      t: form.title.trim() || "Software Engineer",
      c: company,
      l: displayLocation,
      city: form.city.trim() || displayLocation,
      country: form.country.trim() || "India",
      m: form.mode,
      ty: form.type,
      e: form.experience,
      a: form.min,
      b: form.max,
      salaryVisible: form.salaryVisible,
      sk: skills,
      description: form.description.trim(),
      responsibilities: form.responsibilities.trim(),
      qualifications: form.qualifications.trim(),
      requirements: form.requirements.trim(),
      benefits,
      industry: form.industry.trim(),
      department: form.department.trim(),
      jobFunction: form.jobFunction.trim(),
      status: targetStatus,
      scheduledAt: targetStatus === "scheduled" ? form.scheduledAt : undefined,
      closesAt: form.closesAt || undefined,
      autoClose: form.autoClose,
      expiryReminderDays: form.expiryReminderDays,
      featured: form.promotionTier === "featured" || form.promotionTier === "sponsored",
      sponsored: form.promotionTier === "sponsored",
      promotionTier: form.promotionTier,
      views: form.id ? effectiveJobs.find((j) => j.id === form.id)?.views ?? 120 : 48,
      at: Date.now(),
      by: user.email,
    };
  };

  const handleSaveLifecycle = (event: FormEvent | null, targetStatus: "draft" | "active" | "scheduled") => {
    event?.preventDefault();
    setFormError(null);
    if (form.title.trim().length < 3) {
      setFormError("Job title must be at least 3 characters.");
      return;
    }
    if (form.max < form.min) {
      setFormError("Maximum salary must be at least the minimum salary.");
      onToast("Maximum salary must be at least the minimum salary.");
      return;
    }
    if (targetStatus !== "draft" && form.description.trim().length < 20) {
      setFormError("Add a job description of at least 20 characters before publishing.");
      return;
    }
    if (targetStatus === "scheduled" && !form.scheduledAt) {
      setFormError("Pick a future schedule date & time to schedule publishing.");
      return;
    }

    const built = buildJobObject(targetStatus);
    if (targetStatus === "draft") {
      sessionStorage.setItem("employer-job-draft", JSON.stringify(form));
    } else {
      sessionStorage.removeItem("employer-job-draft");
    }

    if (onSaveJob) {
      onSaveJob(built);
      setActiveTab("manage");
    } else if (targetStatus === "active") {
      onPublishJob(built);
    } else {
      upsertJob(built);
      setActiveTab("manage");
    }

    if (targetStatus === "draft") onToast(`Saved draft "${built.t}".`);
    else if (targetStatus === "scheduled") onToast(`Scheduled "${built.t}" for ${form.scheduledAt}.`);
    else onToast(`Published job listing "${built.t}"!`);
  };

  const loadJobIntoComposer = (job: ProJob) => {
    setForm({
      id: job.id,
      title: job.t,
      industry: job.industry ?? "Software & SaaS",
      department: job.department ?? "Engineering",
      jobFunction: job.jobFunction ?? "Engineering",
      city: job.city ?? job.l,
      country: job.country ?? "India",
      location: job.l,
      mode: job.m,
      type: job.ty,
      experience: job.e,
      min: job.a,
      max: job.b,
      salaryVisible: job.salaryVisible ?? true,
      skills: (job.sk ?? []).join(", "),
      description: job.description ?? "",
      responsibilities: job.responsibilities ?? "",
      qualifications: job.qualifications ?? "",
      requirements: job.requirements ?? "",
      benefits: (job.benefits ?? []).join(", "),
      closesAt: job.closesAt ?? "",
      scheduledAt: job.scheduledAt ?? "",
      autoClose: job.autoClose ?? true,
      expiryReminderDays: job.expiryReminderDays ?? 5,
      promotionTier: job.sponsored ? "sponsored" : job.featured ? "featured" : "none",
    });
    setFormError(null);
    setActiveTab("compose");
  };

  const listing = (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <img className="h-12 w-12 rounded-full border border-border object-contain p-1" src={getCompanyLogo(company)} alt={company} />
        <div>
          <p className="flex items-center gap-2 text-sm font-bold">
            {company}
            {user.vr && <BadgeCheck className="h-4 w-4 text-primary" />}
          </p>
          <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {form.city || form.location}, {form.country} · {form.mode}
          </p>
        </div>
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-bold break-words">{form.title || "Job title"}</h2>
          {form.promotionTier !== "none" && (
            <span className="workspace-chip capitalize">{form.promotionTier}</span>
          )}
        </div>
        <p className="mt-1 text-xs font-medium text-primary">
          {[form.industry, form.department, form.jobFunction].filter(Boolean).join(" · ")}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="workspace-chip"><BriefcaseBusiness className="h-3.5 w-3.5" />{form.type}</span>
        <span className="workspace-chip"><Users className="h-3.5 w-3.5" />{form.experience}+ yrs</span>
        <span className="workspace-chip">
          {form.salaryVisible ? `₹${form.min}–${form.max} LPA` : "Competitive salary"}
        </span>
      </div>
      <div>
        <h3 className="mb-2 text-xs font-semibold">Required Skills</h3>
        <div className="flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <span className="workspace-chip" key={skill}>{skill}</span>
          ))}
        </div>
      </div>
      <div className="border-t border-border pt-4 space-y-3 text-xs text-muted-foreground">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <FileText className="h-4 w-4 text-primary" />Job Overview
          </h3>
          <p className="mt-1.5 whitespace-pre-wrap break-words leading-6">{form.description}</p>
        </div>
        {form.responsibilities && (
          <div>
            <h4 className="font-semibold text-foreground">Responsibilities</h4>
            <p className="mt-1 whitespace-pre-wrap leading-6">{form.responsibilities}</p>
          </div>
        )}
        {form.qualifications && (
          <div>
            <h4 className="font-semibold text-foreground">Qualifications</h4>
            <p className="mt-1 whitespace-pre-wrap leading-6">{form.qualifications}</p>
          </div>
        )}
        {benefits.length > 0 && (
          <div>
            <h4 className="font-semibold text-foreground">Benefits</h4>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {benefits.map((b) => <span key={b} className="workspace-chip">{b}</span>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="employer-workspace space-y-5">
      <header className="workspace-header">
        <div>
          <span className="workspace-eyebrow">
            <BriefcaseBusiness size={14} />
            2 · Job Management
          </span>
          <h1 className="workspace-heading">Manage Every Opportunity. From Posting to Placement.</h1>
          <p className="workspace-description">
            Create, categorize, schedule, promote, renew, and optimize job postings with AI intelligence and conversion analytics.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            onClick={() => {
              setForm({ ...initialComposer, id: null });
              setFormError(null);
              setActiveTab("compose");
            }}
          >
            <Plus className="mr-1.5 h-4 w-4" />Create Job Posting
          </Button>
        </div>
      </header>

      {/* Portfolio & Conversion Performance KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <div className="workspace-panel !p-3.5">
          <p className="text-[11px] font-semibold text-muted-foreground">Active Job Posts</p>
          <p className="mt-1 text-xl font-bold">{metrics.active}</p>
        </div>
        <div className="workspace-panel !p-3.5">
          <p className="text-[11px] font-semibold text-muted-foreground">Drafts & Scheduled</p>
          <p className="mt-1 text-xl font-bold">{metrics.draftsAndScheduled}</p>
        </div>
        <div className="workspace-panel !p-3.5">
          <p className="text-[11px] font-semibold text-muted-foreground">Promoted Jobs</p>
          <p className="mt-1 text-xl font-bold text-primary">{metrics.promoted}</p>
        </div>
        <div className="workspace-panel !p-3.5">
          <p className="text-[11px] font-semibold text-muted-foreground">Total Views</p>
          <p className="mt-1 text-xl font-bold">{metrics.totalViews.toLocaleString("en-IN")}</p>
        </div>
        <div className="workspace-panel !p-3.5">
          <p className="text-[11px] font-semibold text-muted-foreground">Applications</p>
          <p className="mt-1 text-xl font-bold">{metrics.totalApps}</p>
        </div>
        <div className="workspace-panel !p-3.5">
          <p className="text-[11px] font-semibold text-muted-foreground">Conversion Rate</p>
          <p className="mt-1 text-xl font-bold text-emerald-700">{metrics.conversion.toFixed(1)}%</p>
        </div>
      </div>

      {/* Single-Row Accessible Tablist */}
      <div role="tablist" aria-label="Job management sections" className="workspace-tabs">
        <button
          type="button"
          role="tab"
          id="tab-manage-jobs"
          aria-selected={activeTab === "manage"}
          className="workspace-tab"
          onClick={() => setActiveTab("manage")}
        >
          Manage Job Posts ({effectiveJobs.length})
        </button>
        <button
          type="button"
          role="tab"
          id="tab-compose-job"
          aria-selected={activeTab === "compose"}
          className="workspace-tab"
          onClick={() => setActiveTab("compose")}
        >
          {form.id ? "Edit Job Posting" : "Create Job Posting"}
        </button>
      </div>

      {activeTab === "manage" ? (
        <div role="tabpanel" aria-labelledby="tab-manage-jobs" className="space-y-4">
          <form
            role="search"
            className="workspace-filter-bar !mb-0"
            aria-label="Search and filter job posts"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="workspace-filter-search">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                aria-label="Search job posts"
                type="search"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                className="h-9 pl-9 text-xs"
                placeholder="Search by job title, department, skill, or city..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <select aria-label="Filter jobs by status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="scheduled">Scheduled</option>
              <option value="draft">Draft</option>
              <option value="paused">Unpublished / Paused</option>
              <option value="promoted">Featured / Sponsored</option>
              <option value="closed">Closed / Expired</option>
            </select>
            <select aria-label="Sort job posts" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
              <option value="newest">Sort: Newest</option>
              <option value="applications">Sort: Most Applications</option>
              <option value="views">Sort: Most Views</option>
              <option value="conversion">Sort: Highest Conversion</option>
            </select>
          </form>

          <div className="workspace-panel !p-0 overflow-hidden">
            <div tabIndex={0} role="region" aria-label="Manage job posts table" className="workspace-table-scroll">
              <table className="w-full min-w-[880px] text-left text-xs">
                <thead className="border-b border-border bg-card text-[11px] uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">Opportunity</th>
                    <th scope="col" className="px-3 py-3 font-semibold">Status</th>
                    <th scope="col" className="px-3 py-3 font-semibold">Views</th>
                    <th scope="col" className="px-3 py-3 font-semibold">Applications</th>
                    <th scope="col" className="px-3 py-3 font-semibold">Conversion</th>
                    <th scope="col" className="px-3 py-3 font-semibold">Expiry & Alerts</th>
                    <th scope="col" className="px-3 py-3 text-right font-semibold">Manage</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((j) => {
                    const st = j.status ?? "active";
                    const views = j.views ?? 110;
                    const apps = appCountByJob[j.id] ?? 0;
                    const conv = views > 0 ? ((apps / views) * 100).toFixed(1) : "0.0";
                    return (
                      <tr key={j.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                        <th scope="row" className="px-4 py-3 font-normal text-left">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-semibold text-foreground">{j.t}</span>
                            {j.sponsored && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                                <Megaphone className="h-2.5 w-2.5" />Sponsored
                              </span>
                            )}
                            {j.featured && !j.sponsored && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                                <Crown className="h-2.5 w-2.5" />Featured
                              </span>
                            )}
                          </div>
                          {(j.industry || j.department || j.jobFunction) && (
                            <p className="mt-0.5 text-[11px] font-medium text-primary/90">
                              {[j.industry, j.department, j.jobFunction].filter(Boolean).join(" · ")}
                            </p>
                          )}
                          <p className="mt-0.5 text-[11px] text-muted-foreground">
                            {j.city ? `${j.city}, ${j.country ?? "India"}` : j.l} · {j.m} · {j.ty} · ₹{j.a}–{j.b} LPA
                          </p>
                        </th>
                        <td className="px-3 py-3">
                          <span className="workspace-chip capitalize">{st}</span>
                          {st === "scheduled" && j.scheduledAt && (
                            <p className="mt-1 text-[10px] text-muted-foreground">{j.scheduledAt}</p>
                          )}
                        </td>
                        <td className="px-3 py-3 font-medium">{views}</td>
                        <td className="px-3 py-3">
                          <button
                            type="button"
                            className="font-semibold text-primary hover:underline"
                            onClick={() => onNavigate?.("pipe", { job: String(j.id) })}
                          >
                            {apps} applicants
                          </button>
                        </td>
                        <td className="px-3 py-3 font-semibold text-emerald-700">{conv}%</td>
                        <td className="px-3 py-3 text-[11px] text-muted-foreground">
                          <p>{j.closesAt ? `Closes ${j.closesAt}` : "Open-ended"}</p>
                          <p className="text-[10px]">
                            {j.autoClose !== false ? "Auto-close" : "Manual"} · {j.expiryReminderDays ?? 5}d alert
                          </p>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex flex-wrap items-center justify-end gap-1">
                            <Button type="button" size="sm" variant="outline" className="h-7 px-2 text-[11px]" onClick={() => loadJobIntoComposer(j)}>
                              <FilePenLine className="mr-1 h-3 w-3" />Edit
                            </Button>
                            {st === "active" || st === "scheduled" ? (
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 text-[11px]"
                                onClick={() => {
                                  upsertJob({ ...j, status: "paused" });
                                  onToast(`Unpublished "${j.t}".`);
                                }}
                              >
                                <Pause className="mr-1 h-3 w-3" />Unpublish
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                size="sm"
                                className="h-7 px-2 text-[11px]"
                                onClick={() => {
                                  upsertJob({ ...j, status: "active" });
                                  onToast(`Published "${j.t}".`);
                                }}
                              >
                                <Play className="mr-1 h-3 w-3" />Publish
                              </Button>
                            )}
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-[11px]"
                              onClick={() => {
                                if (onDuplicateJob) onDuplicateJob(j.id);
                                else {
                                  upsertJob({ ...j, id: Date.now(), t: `${j.t} (Copy)`, status: "draft", at: Date.now() });
                                  onToast(`Duplicated "${j.t}".`);
                                }
                              }}
                            >
                              <Copy className="mr-1 h-3 w-3" />Duplicate
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-[11px]"
                              onClick={() => {
                                const nextClose = new Date(Date.now() + 86400000 * 30).toISOString().slice(0, 10);
                                upsertJob({ ...j, status: "active", closesAt: nextClose });
                                onToast(`Renewed "${j.t}" until ${nextClose}.`);
                              }}
                            >
                              <RefreshCw className="mr-1 h-3 w-3" />Renew
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-[11px]"
                              onClick={() => {
                                const nextFeatured = !j.featured;
                                upsertJob({
                                  ...j,
                                  featured: nextFeatured,
                                  sponsored: nextFeatured ? j.sponsored : false,
                                  promotionTier: nextFeatured ? "featured" : "none",
                                });
                                onToast(nextFeatured ? `Promoted "${j.t}" as Featured!` : `Removed promotion on "${j.t}".`);
                              }}
                            >
                              <Crown className="mr-1 h-3 w-3" />{j.featured ? "Promoted" : "Promote"}
                            </Button>
                            {st !== "closed" && (
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2 text-[11px] text-destructive"
                                onClick={() => {
                                  upsertJob({ ...j, status: "closed" });
                                  onToast(`Closed "${j.t}".`);
                                }}
                              >
                                <Power className="mr-1 h-3 w-3" />Close
                              </Button>
                            )}
                            {onDeleteJob && (
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                aria-label={`Delete ${j.t}`}
                                className="h-7 w-7 text-destructive"
                                onClick={() => onDeleteJob(j.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredJobs.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                        No job postings match the current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div role="tabpanel" aria-labelledby="tab-compose-job" className="grid items-start gap-5 lg:grid-cols-[1.65fr_1fr]">
          <form onSubmit={(e) => handleSaveLifecycle(e, "active")} className="workspace-panel space-y-5" noValidate>
            {formError && (
              <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
                {formError}
              </div>
            )}

            {/* Live Duplicate Job Detection */}
            {duplicateMatches.length > 0 && (
              <div role="status" className="rounded-md border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
                <div className="flex items-center gap-2 font-semibold">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-700" />
                  Duplicate Job Detection: Similar opening already exists
                </div>
                <ul className="mt-1 list-disc pl-6">
                  {duplicateMatches.map(({ job, pct }) => (
                    <li key={job.id}>
                      <strong>{job.t}</strong> ({job.l} · {job.status ?? "active"} · {pct}% title overlap)
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* AI Job Co-Pilot & Intelligence */}
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/30 p-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" />AI Job Intelligence:
              </span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7 text-[11px]"
                onClick={() => {
                  setForm((curr) => ({
                    ...curr,
                    description: `${company} is hiring a ${curr.title} (${curr.mode}, ${curr.city || curr.location}) with ${curr.experience}+ years of experience in ${curr.department || "Engineering"}.`,
                    responsibilities: `• Design, build, and ship resilient ${curr.title} features using ${curr.skills}.\n• Partner with product, QA, and platform teams on reliability and latency targets.`,
                    qualifications: `• Degree in Computer Science / Engineering or equivalent ${curr.experience}+ years production experience.`,
                    requirements: `• Verified hands-on mastery in ${skills.slice(0, 4).join(", ") || "core stack"}.`,
                  }));
                  onToast("AI Job Description & structured details generated!");
                }}
              >
                <Wand2 className="mr-1 h-3 w-3" />AI JD Generator
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7 text-[11px]"
                onClick={() => {
                  const t = form.title.toLowerCase();
                  const suggested =
                    t.includes("data") || t.includes("analyst") || t.includes("ml")
                      ? "Python, SQL, Tableau, dbt, Snowflake, Statistics"
                      : t.includes("cloud") || t.includes("devops")
                        ? "AWS, Kubernetes, Terraform, Docker, GitHub Actions, Prometheus"
                        : t.includes("back")
                          ? "Node.js, Go, PostgreSQL, Redis, AWS, System Design"
                          : "React, TypeScript, Next.js, Node.js, GraphQL, Playwright";
                  set("skills", suggested);
                  onToast("AI Skill Requirement Generator updated skills!");
                }}
              >
                <Sparkles className="mr-1 h-3 w-3" />AI Skill Generator
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7 text-[11px]"
                onClick={() => {
                  const metroBoost = /bengaluru|mumbai|hyderabad|gurugram|remote/i.test(form.city || form.location) ? 1.15 : 1;
                  const baseMin = Math.round(Math.max(6, (form.experience * 4.5 + 5) * metroBoost));
                  const median = Math.round(baseMin * 1.25);
                  const baseMax = Math.round(baseMin * 1.55);
                  setBenchmarkInfo({ min: baseMin, median, max: baseMax, city: form.city || form.location || "India" });
                  onToast(`Salary benchmark calculated: ₹${baseMin}–${baseMax} LPA.`);
                }}
              >
                <IndianRupee className="mr-1 h-3 w-3" />Salary Benchmark
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7 text-[11px]"
                onClick={() => {
                  setCompetitorInfo({
                    openings: 18 + form.experience * 3,
                    companies: 11,
                    avgMin: Math.max(8, form.min - 1),
                    avgMax: form.max + 2,
                    topSkills: skills.length ? skills.slice(0, 5) : ["React", "TypeScript", "AWS", "SQL"],
                  });
                  onToast("Competitor Job Analysis ready!");
                }}
              >
                <BarChart3 className="mr-1 h-3 w-3" />Competitor Analysis
              </Button>
            </div>

            {benchmarkInfo && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-primary/25 bg-primary/5 p-3 text-xs">
                <div>
                  <p className="font-semibold text-foreground">
                    Market Salary Benchmark ({benchmarkInfo.city}): ₹{benchmarkInfo.min}–{benchmarkInfo.max} LPA · Median ₹{benchmarkInfo.median} LPA
                  </p>
                  <p className="text-[11px] text-muted-foreground">Calibrated for {form.experience}+ yrs experience in {form.industry || "Tech"}.</p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setForm((curr) => ({ ...curr, min: benchmarkInfo.min, max: benchmarkInfo.max }))}
                >
                  Apply Benchmark
                </Button>
              </div>
            )}

            {competitorInfo && (
              <div className="rounded-lg border border-border bg-muted/20 p-3 text-xs space-y-1.5">
                <p className="flex items-center gap-1.5 font-semibold text-foreground">
                  <TrendingUp className="h-3.5 w-3.5 text-primary" />
                  Competitor Job Analysis: {competitorInfo.openings} active openings across {competitorInfo.companies} peer employers (Avg ₹{competitorInfo.avgMin}–{competitorInfo.avgMax} LPA)
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Most requested skills in competing posts: {competitorInfo.topSkills.join(", ")}
                </p>
              </div>
            )}

            {/* Submodules 1, 3, 4, 5: Role, Categories, Location & Job Type */}
            <div className="workspace-section-title !mb-2">
              <span className="workspace-icon"><BriefcaseBusiness size={19} /></span>
              <div>
                <h2>Role, Categories & Location</h2>
                <p>Define job title, industry/department taxonomy, location, work mode, and contract type.</p>
              </div>
            </div>

            <Field label="Job Title" required icon={<BriefcaseBusiness size={14} />}>
              <Input
                required
                placeholder="Senior React Developer"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Industry">
                <Input value={form.industry} onChange={(e) => set("industry", e.target.value)} placeholder="Software & SaaS" />
              </Field>
              <Field label="Department">
                <Input value={form.department} onChange={(e) => set("department", e.target.value)} placeholder="Engineering" />
              </Field>
              <Field label="Job Function">
                <Input value={form.jobFunction} onChange={(e) => set("jobFunction", e.target.value)} placeholder="Frontend Development" />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-4">
              <Field label="City" required icon={<MapPin size={14} />}>
                <Input required value={form.city} onChange={(e) => { set("city", e.target.value); set("location", e.target.value); }} />
              </Field>
              <Field label="Country">
                <Input value={form.country} onChange={(e) => set("country", e.target.value)} />
              </Field>
              <Field label="Work Mode" icon={<Monitor size={14} />}>
                <select value={form.mode} onChange={(e) => set("mode", e.target.value as ProJob["m"])}>
                  {["Hybrid", "Remote", "Onsite"].map((v) => <option key={v}>{v}</option>)}
                </select>
              </Field>
              <Field label="Job Type">
                <select value={form.type} onChange={(e) => set("type", e.target.value as ProJob["ty"])}>
                  {["Full-time", "Part-time", "Contract", "Internship"].map((v) => <option key={v}>{v}</option>)}
                </select>
              </Field>
            </div>

            {/* Compensation & Experience */}
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Minimum Experience (Years)" required icon={<Users size={14} />}>
                <Input required type="number" min={0} max={50} value={form.experience} onChange={(e) => set("experience", Number(e.target.value))} />
              </Field>
              <Field label="Minimum Salary (LPA)" required icon={<IndianRupee size={14} />}>
                <Input required type="number" min={0} step="0.5" value={form.min} onChange={(e) => set("min", Number(e.target.value))} />
              </Field>
              <Field label="Maximum Salary (LPA)" required icon={<IndianRupee size={14} />}>
                <Input required type="number" min={form.min} step="0.5" value={form.max} onChange={(e) => set("max", Number(e.target.value))} />
              </Field>
            </div>

            {/* Submodule 2: Job Details */}
            <div className="workspace-divider" />
            <div className="workspace-section-title !mb-2">
              <span className="workspace-icon"><Tags size={19} /></span>
              <div>
                <h2>Job Details, Skills & Benefits</h2>
                <p>Specify verified skills, overview, responsibilities, qualifications, requirements, and benefits.</p>
              </div>
            </div>

            <Field label="Required Skills (comma separated)" required icon={<Tags size={14} />}>
              <Input required value={form.skills} onChange={(e) => set("skills", e.target.value)} />
            </Field>

            <Field label="Job Description" required icon={<FileText size={14} />}>
              <Textarea required rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Responsibilities">
                <Textarea rows={3} value={form.responsibilities} onChange={(e) => set("responsibilities", e.target.value)} />
              </Field>
              <Field label="Qualifications">
                <Textarea rows={3} value={form.qualifications} onChange={(e) => set("qualifications", e.target.value)} />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Requirements">
                <Textarea rows={2} value={form.requirements} onChange={(e) => set("requirements", e.target.value)} />
              </Field>
              <Field label="Benefits (comma separated)">
                <Textarea rows={2} value={form.benefits} onChange={(e) => set("benefits", e.target.value)} />
              </Field>
            </div>

            {/* Submodules 6, 8, 9: Publishing, Expiry & Promotion */}
            <div className="workspace-divider" />
            <div className="grid gap-4 sm:grid-cols-4">
              <Field label="Expiry / Closing Date">
                <Input type="date" value={form.closesAt} onChange={(e) => set("closesAt", e.target.value)} />
              </Field>
              <Field label="Expiry Reminder (Days)">
                <Input type="number" min={1} max={30} value={form.expiryReminderDays} onChange={(e) => set("expiryReminderDays", Number(e.target.value))} />
              </Field>
              <Field label="Schedule Publish">
                <Input type="datetime-local" value={form.scheduledAt} onChange={(e) => set("scheduledAt", e.target.value)} />
              </Field>
              <Field label="Job Promotion">
                <select value={form.promotionTier} onChange={(e) => set("promotionTier", e.target.value as JobComposerState["promotionTier"])}>
                  <option value="none">Standard Listing</option>
                  <option value="featured">Featured Job</option>
                  <option value="sponsored">Sponsored Listing</option>
                </select>
              </Field>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs font-semibold">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={form.salaryVisible} onChange={(e) => set("salaryVisible", e.target.checked)} />
                <span>Show salary on job card</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={form.autoClose} onChange={(e) => set("autoClose", e.target.checked)} />
                <span>Auto-close vacancy on expiry</span>
              </label>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
              <p className="text-[11px] text-muted-foreground">Fields marked with * are required.</p>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => handleSaveLifecycle(null, "draft")}>
                  <Save className="mr-1.5 h-3.5 w-3.5" />Save draft
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => handleSaveLifecycle(null, "scheduled")}>
                  <CalendarClock className="mr-1.5 h-3.5 w-3.5" />Schedule publish
                </Button>
                <Button type="submit" size="sm">
                  <Send className="mr-1.5 h-3.5 w-3.5" />{form.id ? "Save & publish" : "Publish job"}
                </Button>
              </div>
            </div>

            <details className="border-t border-border pt-4">
              <summary className="cursor-pointer text-xs font-semibold text-primary">Quick start from a template</summary>
              <div className="mt-3 flex flex-wrap gap-2">
                {JOB_TEMPLATES.map((t) => (
                  <Button
                    key={t[0]}
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setForm((curr) => ({
                        ...curr,
                        title: t[1],
                        mode: t[2],
                        experience: t[3],
                        min: t[4],
                        max: t[5],
                        skills: t[6],
                      }))
                    }
                  >
                    {t[0]}
                  </Button>
                ))}
              </div>
            </details>
          </form>

          <aside className="workspace-panel lg:sticky lg:top-24">
            <div className="mb-5 flex items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <Eye className="h-5 w-5 text-primary" />Live Card Preview
              </h2>
              <span className="workspace-chip"><Check className="h-3 w-3" />Live Preview</span>
            </div>
            {listing}
            <Button type="button" variant="outline" className="mt-6 w-full text-primary" onClick={() => setPreview(true)}>
              <ExternalLink className="mr-1.5 h-4 w-4" />Preview full listing
            </Button>
          </aside>
        </div>
      )}

      <Dialog open={preview} onOpenChange={setPreview}>
        <DialogContent className="employer-workspace max-h-[85dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Listing preview</DialogTitle>
          </DialogHeader>
          {listing}
        </DialogContent>
      </Dialog>
    </div>
  );
}
