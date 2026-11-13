import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import {
  AlertCircle, AlertTriangle, BarChart3, Briefcase, CalendarClock, ChevronLeft, ChevronRight, Copy, Crown, Eye,
  FilePenLine, IndianRupee, Megaphone, MoreHorizontal, Pause, Play, Plus, Power, RefreshCw, Save, Search,
  Send, Sparkles, TrendingUp, Trash2, Users, Wand2, XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  checkDuplicateJobs, closeJob, createJob, deleteJob, duplicateJob, generateJobAiAssist, getCompetitorJobAnalysis,
  getJobForEdit, getSalaryBenchmark, listMyJobs, pauseJob, promoteJob, publishJob, renewJob, resumeJob,
  scheduleJobPublish, updateJob,
  type CompetitorJobAnalysis, type CreateJobInput, type DuplicateJobMatch, type EmployerJobRecord, type SalaryBenchmark,
} from "@/services/employer/jobs";
import { getPublishReadiness, type PublishReadiness } from "@/services/employer/ats";
import type { NavigateFn } from "./EmployerOverview";
import { EmptyState, ErrorState, JobStatusBadge, Loading, PageHeader, fmtDate, fmtDateTime } from "./employerUi";

type ListedJob = EmployerJobRecord;

interface Props {
  companyName: string;
  searchParams: URLSearchParams;
  onNavigate: NavigateFn;
  onToast: (message: string) => void;
}

const PAGE_SIZE = 10;
const STATUS_FILTERS = [
  { value: "", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "scheduled", label: "Scheduled" },
  { value: "draft", label: "Draft" },
  { value: "paused", label: "Paused" },
  { value: "featured", label: "Promoted (Featured / Sponsored)" },
  { value: "pending_review", label: "In review" },
  { value: "closed", label: "Closed / expired" },
];
const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "title", label: "Title A–Z" },
  { value: "applications", label: "Most applications" },
  { value: "views", label: "Most views" },
  { value: "conversion", label: "Highest conversion rate" },
];

interface FormState {
  designation: string;
  job_description: string;
  qualifications: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
  industry: string;
  department: string;
  job_function: string;
  city: string;
  country: string;
  job_location: string;
  work_mode: "Remote" | "Hybrid" | "Onsite";
  job_type: "Full-time" | "Part-time" | "Internship" | "Contract";
  salary_min: string;
  salary_max: string;
  experience_min: string;
  skills: string;
  salary_visible: boolean;
  closes: string;
  scheduled_publish_at: string;
  auto_close_on_expiry: boolean;
  expiry_reminder_days: string;
  promotion_tier: "none" | "featured" | "sponsored";
}

const EMPTY_FORM: FormState = {
  designation: "",
  job_description: "",
  qualifications: "",
  responsibilities: "",
  requirements: "",
  benefits: "",
  industry: "",
  department: "",
  job_function: "",
  city: "",
  country: "India",
  job_location: "",
  work_mode: "Hybrid",
  job_type: "Full-time",
  salary_min: "",
  salary_max: "",
  experience_min: "0",
  skills: "",
  salary_visible: true,
  closes: "",
  scheduled_publish_at: "",
  auto_close_on_expiry: true,
  expiry_reminder_days: "5",
  promotion_tier: "none",
};

const deriveLocation = (f: FormState) =>
  f.job_location.trim() || [f.city.trim(), f.country.trim()].filter(Boolean).join(", ");

const splitCsv = (raw: string) =>
  [...new Set(raw.split(",").map((s) => s.trim()).filter(Boolean))];

const toInput = (f: FormState): CreateJobInput => ({
  designation: f.designation.trim(),
  job_description: f.job_description.trim(),
  job_location: deriveLocation(f),
  work_mode: f.work_mode,
  job_type: f.job_type,
  salary_min: f.salary_min === "" ? undefined : Number(f.salary_min),
  salary_max: f.salary_max === "" ? undefined : Number(f.salary_max),
  experience_min: Number(f.experience_min) || 0,
  skills: splitCsv(f.skills),
  salary_visible: f.salary_visible,
  qualifications: f.qualifications.trim() || undefined,
  responsibilities: f.responsibilities.trim() || undefined,
  requirements: f.requirements.trim() || undefined,
  benefits: splitCsv(f.benefits),
  industry: f.industry.trim() || undefined,
  department: f.department.trim() || undefined,
  job_function: f.job_function.trim() || undefined,
  city: f.city.trim() || undefined,
  country: f.country.trim() || undefined,
  auto_close_on_expiry: f.auto_close_on_expiry,
  expiry_reminder_days: Math.max(1, Math.min(30, Number(f.expiry_reminder_days) || 5)),
});

const fromRecord = (j: EmployerJobRecord & { salary_visible?: boolean }): FormState => ({
  designation: j.designation ?? "",
  job_description: j.job_description ?? "",
  qualifications: j.qualifications ?? "",
  responsibilities: j.responsibilities ?? "",
  requirements: j.requirements ?? "",
  benefits: (j.benefits ?? []).join(", "),
  industry: j.industry ?? "",
  department: j.department ?? "",
  job_function: j.job_function ?? "",
  city: j.city ?? "",
  country: j.country ?? "India",
  job_location: j.job_location ?? "",
  work_mode: (j.work_mode as FormState["work_mode"]) || "Hybrid",
  job_type: (j.job_type as FormState["job_type"]) || "Full-time",
  salary_min: j.salary_min == null ? "" : String(j.salary_min),
  salary_max: j.salary_max == null ? "" : String(j.salary_max),
  experience_min: String(j.experience_min ?? 0),
  skills: (j.skills ?? []).join(", "),
  salary_visible: j.salary_visible ?? true,
  closes: j.closes_at ? j.closes_at.slice(0, 10) : "",
  scheduled_publish_at: j.scheduled_publish_at ? j.scheduled_publish_at.slice(0, 16) : "",
  auto_close_on_expiry: j.auto_close_on_expiry ?? true,
  expiry_reminder_days: String(j.expiry_reminder_days ?? 5),
  promotion_tier: j.is_sponsored
    ? "sponsored"
    : j.is_featured
      ? "featured"
      : ((j.promotion_tier as FormState["promotion_tier"]) || "none"),
});

const calcConversion = (j: Pick<ListedJob, "views_count" | "applications_count" | "conversion_rate">) => {
  if (typeof j.conversion_rate === "number") return j.conversion_rate;
  const views = j.views_count ?? 0;
  const apps = j.applications_count ?? 0;
  return views > 0 ? Math.round((apps / views) * 1000) / 10 : 0;
};

export function EmployerJobs({ companyName, searchParams, onNavigate, onToast }: Props) {
  const [jobs, setJobs] = useState<ListedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState(searchParams.get("status") ?? "");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState<string | null>(null);
  const [editor, setEditor] = useState<{ id: string | null; form: FormState } | null>(null);
  const [preview, setPreview] = useState<FormState | null>(null);
  const [confirm, setConfirm] = useState<{ kind: "delete" | "close"; job: ListedJob } | null>(null);
  const [readiness, setReadiness] = useState<PublishReadiness | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // AI & Market Intelligence states inside the Job Composer
  const [duplicates, setDuplicates] = useState<DuplicateJobMatch[]>([]);
  const [benchmark, setBenchmark] = useState<SalaryBenchmark | null>(null);
  const [competitor, setCompetitor] = useState<CompetitorJobAnalysis | null>(null);
  const [aiBusy, setAiBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setJobs((await listMyJobs({ limit: 100 })) as unknown as ListedJob[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load your jobs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { getPublishReadiness().then(setReadiness).catch(() => setReadiness(null)); }, []);
  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setEditor((cur) => cur ?? { id: null, form: EMPTY_FORM });
    }
  }, [searchParams]);
  useEffect(() => { setPage(1); }, [query, status, sort]);

  // Live Duplicate Job Detection (debounced)
  const editorTitle = editor?.form.designation ?? "";
  const editorId = editor?.id ?? null;
  useEffect(() => {
    if (!editor || editorTitle.trim().length < 3 || typeof checkDuplicateJobs !== "function") {
      setDuplicates([]);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(() => {
      Promise.resolve(checkDuplicateJobs({ title: editorTitle.trim(), excludeJobId: editorId }))
        .then((res) => {
          if (!cancelled && res?.matches) setDuplicates(res.matches);
        })
        .catch(() => {
          if (!cancelled) setDuplicates([]);
        });
    }, 320);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [editor, editorTitle, editorId]);

  const metrics = useMemo(() => {
    const active = jobs.filter((j) => j.status === "active").length;
    const drafts = jobs.filter((j) => j.status === "draft").length;
    const scheduled = jobs.filter((j) => j.status === "scheduled").length;
    const promoted = jobs.filter((j) => j.is_featured || j.is_sponsored).length;
    const views = jobs.reduce((sum, j) => sum + (j.views_count ?? 0), 0);
    const apps = jobs.reduce((sum, j) => sum + (j.applications_count ?? 0), 0);
    const conversion = views > 0 ? Math.round((apps / views) * 1000) / 10 : 0;
    return { active, drafts, scheduled, promoted, views, apps, conversion };
  }, [jobs]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = jobs.filter((j) => {
      if (status === "closed") {
        if (!["closed", "expired"].includes(j.status)) return false;
      } else if (status === "featured") {
        if (!j.is_featured && !j.is_sponsored) return false;
      } else if (status && j.status !== status) {
        return false;
      }
      if (!q) return true;
      const haystack = [
        j.designation,
        j.job_location,
        j.city,
        j.country,
        j.industry,
        j.department,
        j.job_function,
        ...(j.skills ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
    rows = [...rows].sort((a, b) => {
      switch (sort) {
        case "title":
          return a.designation.localeCompare(b.designation);
        case "applications":
          return b.applications_count - a.applications_count;
        case "views":
          return b.views_count - a.views_count;
        case "conversion":
          return calcConversion(b) - calcConversion(a);
        default:
          return +new Date(b.created_at) - +new Date(a.created_at);
      }
    });
    return rows;
  }, [jobs, query, status, sort]);

  const pages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const rows = visible.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const run = async (id: string, label: string, action: () => Promise<unknown>) => {
    setBusy(id);
    try {
      await action();
      onToast(label);
      await load();
      getPublishReadiness().then(setReadiness).catch(() => undefined);
    } catch (e) {
      onToast(e instanceof Error ? e.message : "Action failed.");
    } finally {
      setBusy(null);
    }
  };

  const openEditor = async (job?: ListedJob) => {
    setFormError(null);
    setDuplicates([]);
    setBenchmark(null);
    setCompetitor(null);
    if (!job) return setEditor({ id: null, form: EMPTY_FORM });
    try {
      const full = await getJobForEdit(job.id);
      setEditor({ id: job.id, form: fromRecord(full) });
    } catch (e) {
      onToast(e instanceof Error ? e.message : "Could not open this job.");
    }
  };

  const validate = (f: FormState, forPublish: boolean, forSchedule = false): string | null => {
    if (f.designation.trim().length < 3) return "Job title must be at least 3 characters.";
    if (f.salary_min !== "" && f.salary_max !== "" && Number(f.salary_max) < Number(f.salary_min)) {
      return "Maximum salary must be at least the minimum salary.";
    }
    if (forPublish) {
      if (f.job_description.trim().length < 20) return "Add a job description of at least 20 characters before publishing.";
      if (!f.skills.trim()) return "Add at least one skill before publishing.";
      if (f.work_mode !== "Remote" && deriveLocation(f).length < 2) return "Add a location or city for non-remote roles.";
      if (f.closes && new Date(f.closes) <= new Date()) return "Application deadline must be in the future.";
    }
    if (forSchedule) {
      if (!f.scheduled_publish_at) return "Choose a future publish date and time to schedule this job.";
      if (new Date(f.scheduled_publish_at) <= new Date()) return "Scheduled publish time must be in the future.";
    }
    return null;
  };

  const persist = async (form: FormState, id: string | null): Promise<EmployerJobRecord> =>
    id ? updateJob(id, toInput(form)) : createJob(toInput(form));

  const submit = async (event: FormEvent | null, mode: "draft" | "publish" | "schedule") => {
    event?.preventDefault();
    if (!editor) return;
    const problem = validate(editor.form, mode !== "draft", mode === "schedule");
    if (problem) return setFormError(problem);

    if (mode !== "draft") {
      const latest = await getPublishReadiness().catch(() => readiness);
      setReadiness(latest);
      if (latest && !latest.ready) {
        return setFormError("Complete your company profile before publishing. You can still save this job as a draft.");
      }
    }

    setSaving(true);
    setFormError(null);
    try {
      const saved = await persist(editor.form, editor.id);
      const closesAt = editor.form.closes ? new Date(`${editor.form.closes}T23:59:59`).toISOString() : undefined;

      if (editor.form.promotion_tier !== "none" && typeof promoteJob === "function") {
        await promoteJob(saved.id, editor.form.promotion_tier, 30);
      }

      if (mode === "schedule") {
        await scheduleJobPublish(saved.id, new Date(editor.form.scheduled_publish_at).toISOString(), closesAt);
        onToast("Job scheduled for publishing.");
      } else if (mode === "publish") {
        const out = await publishJob(saved.id, closesAt);
        onToast(out.status === "pending_review" ? "Submitted for review. It goes live once approved." : "Job published.");
      } else {
        onToast(editor.id ? "Draft updated." : "Draft saved.");
      }
      setEditor(null);
      await load();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Could not save this job.");
    } finally {
      setSaving(false);
    }
  };

  const publishExisting = async (job: ListedJob) => {
    const latest = await getPublishReadiness().catch(() => readiness);
    setReadiness(latest);
    if (latest && !latest.ready) {
      onToast(`Complete your company profile first. Missing: ${latest.missing.join(", ")}.`);
      return;
    }
    await run(job.id, "Job published.", () => publishJob(job.id));
  };

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setEditor((cur) => (cur ? { ...cur, form: { ...cur.form, [key]: value } } : cur));

  // AI & Market Intelligence Handlers
  const handleGenerateJd = async () => {
    if (!editor) return;
    const f = editor.form;
    const designation = f.designation.trim() || "Software Engineer";
    setAiBusy("jd");
    try {
      const res = await generateJobAiAssist({
        designation,
        company_name: companyName || undefined,
        industry: f.industry || "Technology",
        department: f.department || "Engineering",
        experience_min: Number(f.experience_min) || 2,
        work_mode: f.work_mode,
        job_type: f.job_type,
        job_location: deriveLocation(f) || "Bengaluru",
        city: f.city || undefined,
        skills: splitCsv(f.skills),
      });
      setEditor((cur) =>
        cur
          ? {
              ...cur,
              form: {
                ...cur.form,
                job_description: res.job_description,
                responsibilities: res.responsibilities,
                qualifications: res.qualifications,
                requirements: res.requirements,
                benefits: cur.form.benefits || res.benefits.join(", "),
                skills: cur.form.skills || res.suggested_skills.join(", "),
              },
            }
          : cur
      );
      onToast("AI Job Description & role details generated.");
    } catch (e) {
      onToast(e instanceof Error ? e.message : "Could not generate job description.");
    } finally {
      setAiBusy(null);
    }
  };

  const handleGenerateSkills = async () => {
    if (!editor) return;
    const f = editor.form;
    const designation = f.designation.trim() || "Software Engineer";
    setAiBusy("skills");
    try {
      const res = await generateJobAiAssist({
        designation,
        company_name: companyName || undefined,
        industry: f.industry || "Technology",
        department: f.department || "Engineering",
        experience_min: Number(f.experience_min) || 2,
        work_mode: f.work_mode,
        job_type: f.job_type,
        job_location: deriveLocation(f) || "Bengaluru",
        city: f.city || undefined,
        skills: splitCsv(f.skills),
      });
      const merged = [...new Set([...splitCsv(f.skills), ...(res.suggested_skills ?? [])])];
      setField("skills", merged.join(", "));
      onToast("AI recommended skill requirements applied.");
    } catch (e) {
      onToast(e instanceof Error ? e.message : "Could not generate skill requirements.");
    } finally {
      setAiBusy(null);
    }
  };

  const handleFetchBenchmark = async () => {
    if (!editor) return;
    const f = editor.form;
    setAiBusy("salary");
    try {
      const res = await getSalaryBenchmark({
        title: f.designation.trim() || "Software Engineer",
        location: deriveLocation(f) || "Bengaluru",
        experienceMin: Number(f.experience_min) || 2,
      });
      setBenchmark(res);
      onToast(`Salary benchmark loaded (${res.min_lpa}–${res.max_lpa} LPA).`);
    } catch (e) {
      onToast(e instanceof Error ? e.message : "Could not load salary benchmark.");
    } finally {
      setAiBusy(null);
    }
  };

  const handleFetchCompetitor = async () => {
    if (!editor) return;
    const f = editor.form;
    setAiBusy("competitor");
    try {
      const res = await getCompetitorJobAnalysis({
        title: f.designation.trim() || "Software Engineer",
        location: deriveLocation(f),
        skills: splitCsv(f.skills),
      });
      setCompetitor(res);
      onToast(`Analysed ${res.competing_openings} competing openings across ${res.active_employers} employers.`);
    } catch (e) {
      onToast(e instanceof Error ? e.message : "Could not run competitor job analysis.");
    } finally {
      setAiBusy(null);
    }
  };

  const salary = (j: ListedJob) =>
    j.salary_min || j.salary_max ? `₹${j.salary_min ?? "—"} – ${j.salary_max ?? "—"} LPA` : "Not specified";

  return (
    <div className="employer-workspace space-y-5">
      <PageHeader
        eyebrow="2 · Job Management"
        icon={<Briefcase size={13} />}
        title="Manage Every Opportunity. From Posting to Placement."
        description="Create, schedule, promote, renew, and track performance across every vacancy with AI job intelligence."
        actions={<Button onClick={() => void openEditor()}><Plus className="mr-1.5 h-4 w-4" />Create job</Button>}
      />

      {readiness && !readiness.ready && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-warning/40 bg-warning/10 p-4 text-sm" role="status">
          <AlertCircle className="h-4 w-4 shrink-0 text-warning" />
          <p className="mr-auto min-w-0">
            <strong>Your company profile is incomplete, so jobs cannot be published yet.</strong>{" "}
            <span className="text-muted-foreground">Missing: {readiness.missing.join(", ")}. Drafts can still be saved.</span>
          </p>
          <Button size="sm" onClick={() => onNavigate("cp", { edit: "1" })}>Complete company profile</Button>
        </div>
      )}

      {/* Job Performance & Portfolio KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <div className="workspace-panel !p-3.5">
          <p className="text-[11px] font-semibold text-muted-foreground">Active Posts</p>
          <p className="mt-1 text-xl font-bold">{metrics.active}</p>
        </div>
        <div className="workspace-panel !p-3.5">
          <p className="text-[11px] font-semibold text-muted-foreground">Drafts & Scheduled</p>
          <p className="mt-1 text-xl font-bold">{metrics.drafts + metrics.scheduled}</p>
        </div>
        <div className="workspace-panel !p-3.5">
          <p className="text-[11px] font-semibold text-muted-foreground">Featured / Sponsored</p>
          <p className="mt-1 text-xl font-bold text-primary">{metrics.promoted}</p>
        </div>
        <div className="workspace-panel !p-3.5">
          <p className="text-[11px] font-semibold text-muted-foreground">Total Views</p>
          <p className="mt-1 text-xl font-bold">{metrics.views.toLocaleString("en-IN")}</p>
        </div>
        <div className="workspace-panel !p-3.5">
          <p className="text-[11px] font-semibold text-muted-foreground">Total Applications</p>
          <p className="mt-1 text-xl font-bold">{metrics.apps.toLocaleString("en-IN")}</p>
        </div>
        <div className="workspace-panel !p-3.5">
          <p className="text-[11px] font-semibold text-muted-foreground">Conversion Rate</p>
          <p className="mt-1 text-xl font-bold text-emerald-700">{metrics.conversion.toFixed(1)}%</p>
        </div>
      </div>

      <form
        role="search"
        aria-label="Search and filter jobs"
        className="workspace-filter-bar !mb-0"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="workspace-filter-search">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Search jobs"
            type="search"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            className="h-9 pl-9 text-xs"
            placeholder="Search by title, category, skill, or location"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUS_FILTERS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select aria-label="Sort jobs" value={sort} onChange={(e) => setSort(e.target.value)}>
          {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </form>

      {loading ? (
        <Loading label="Loading jobs" />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : rows.length === 0 ? (
        <div className="workspace-panel">
          <EmptyState
            icon={<Briefcase />}
            title={jobs.length === 0 ? "No jobs yet" : "No jobs match your filters"}
            hint={jobs.length === 0 ? "Create your first opening. You can save it as a draft, schedule publishing, or go live immediately." : "Try a different search or status."}
            action={jobs.length === 0 ? <Button onClick={() => void openEditor()}><Plus className="mr-1.5 h-4 w-4" />Create job</Button> : undefined}
          />
        </div>
      ) : (
        <div className="workspace-panel !p-0 overflow-hidden">
          <div tabIndex={0} role="region" aria-label="Job postings table" className="workspace-table-scroll">
            <table className="w-full min-w-[860px] text-left text-xs">
              <thead className="border-b border-border bg-card text-[11px] uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Job</th>
                  <th scope="col" className="px-3 py-3 font-semibold">Status</th>
                  <th scope="col" className="px-3 py-3 font-semibold">Applications</th>
                  <th scope="col" className="px-3 py-3 font-semibold">Views</th>
                  <th scope="col" className="px-3 py-3 font-semibold">Conversion</th>
                  <th scope="col" className="px-3 py-3 font-semibold">Expiry / Created</th>
                  <th scope="col" className="px-3 py-3 text-right font-semibold"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((j) => {
                  const categoryLine = [j.industry, j.department, j.job_function].filter(Boolean).join(" · ");
                  const locationLine = j.city
                    ? [j.city, j.country].filter(Boolean).join(", ")
                    : j.job_location || j.work_mode;
                  const conv = calcConversion(j);
                  return (
                    <tr key={j.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <th scope="row" className="px-4 py-3 font-normal text-left">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <p className="font-semibold text-foreground">{j.designation}</p>
                          {j.is_sponsored && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                              <Megaphone className="h-2.5 w-2.5" />Sponsored
                            </span>
                          )}
                          {j.is_featured && !j.is_sponsored && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                              <Crown className="h-2.5 w-2.5" />Featured
                            </span>
                          )}
                        </div>
                        {categoryLine && (
                          <p className="mt-0.5 text-[11px] font-medium text-primary/90">{categoryLine}</p>
                        )}
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {locationLine} · {j.work_mode} · {j.job_type} · {salary(j)}
                        </p>
                        {j.closes_at && (
                          <p className="mt-0.5 text-[10px] text-muted-foreground">
                            Closes {fmtDate(j.closes_at)}
                            {j.auto_close_on_expiry !== false ? " · Auto-close on" : " · Manual close"}
                            {j.expiry_reminder_days ? ` · ${j.expiry_reminder_days}d reminder` : ""}
                          </p>
                        )}
                        {j.moderation_note && <p className="mt-0.5 text-[11px] text-warning">{j.moderation_note}</p>}
                      </th>
                      <td className="px-3 py-3">
                        <JobStatusBadge status={j.status} />
                        {j.status === "scheduled" && j.scheduled_publish_at && (
                          <p className="mt-1 text-[10px] text-muted-foreground">
                            {fmtDateTime(j.scheduled_publish_at)}
                          </p>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
                          onClick={() => onNavigate("pipe", { job: j.id })}
                        >
                          <Users className="h-3.5 w-3.5" />{j.applications_count}
                        </button>
                      </td>
                      <td className="px-3 py-3">{j.views_count}</td>
                      <td className="px-3 py-3 font-semibold text-emerald-700">{conv.toFixed(1)}%</td>
                      <td className="px-3 py-3 text-muted-foreground">
                        {j.closes_at ? `Exp ${fmtDate(j.closes_at)}` : fmtDate(j.created_at)}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          {j.status === "draft" && (
                            <Button size="sm" disabled={busy === j.id} onClick={() => void publishExisting(j)}>
                              <Send className="mr-1.5 h-3.5 w-3.5" />Publish
                            </Button>
                          )}
                          {(j.status === "active" || j.status === "scheduled") && (
                            <Button size="sm" variant="outline" disabled={busy === j.id} onClick={() => void run(j.id, "Job unpublished.", () => pauseJob(j.id))}>
                              <Pause className="mr-1.5 h-3.5 w-3.5" />Unpublish
                            </Button>
                          )}
                          {j.status === "paused" && (
                            <Button size="sm" disabled={busy === j.id} onClick={() => void run(j.id, "Job activated.", () => resumeJob(j.id))}>
                              <Play className="mr-1.5 h-3.5 w-3.5" />Activate
                            </Button>
                          )}
                          {["closed", "expired"].includes(j.status) && (
                            <Button size="sm" variant="outline" disabled={busy === j.id} onClick={() => void run(j.id, "Job renewed for 30 days.", () => renewJob(j.id, 30))}>
                              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />Renew
                            </Button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost" aria-label={`More actions for ${j.designation}`}>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onSelect={() => void openEditor(j)}>
                                <FilePenLine className="mr-2 h-4 w-4" />Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={async () => { try { setPreview(fromRecord(await getJobForEdit(j.id))); } catch (e) { onToast(e instanceof Error ? e.message : "Could not preview."); } }}>
                                <Eye className="mr-2 h-4 w-4" />Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => onNavigate("pipe", { job: j.id })}>
                                <Users className="mr-2 h-4 w-4" />View applicants
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => void run(j.id, "Draft copy created.", () => duplicateJob(j.id))}>
                                <Copy className="mr-2 h-4 w-4" />Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => void run(j.id, "Job renewed (+30 days).", () => renewJob(j.id, 30))}>
                                <RefreshCw className="mr-2 h-4 w-4" />Renew (+30 days)
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onSelect={() => void run(j.id, "Job marked as Featured.", () => promoteJob(j.id, "featured", 30))}>
                                <Crown className="mr-2 h-4 w-4" />Promote: Featured job
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => void run(j.id, "Job marked as Sponsored.", () => promoteJob(j.id, "sponsored", 30))}>
                                <Megaphone className="mr-2 h-4 w-4" />Promote: Sponsored listing
                              </DropdownMenuItem>
                              {(j.is_featured || j.is_sponsored) && (
                                <DropdownMenuItem onSelect={() => void run(j.id, "Promotion removed.", () => promoteJob(j.id, "none"))}>
                                  <XCircle className="mr-2 h-4 w-4" />Remove promotion
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              {["active", "scheduled", "paused", "pending_review"].includes(j.status) && (
                                <DropdownMenuItem onSelect={() => setConfirm({ kind: "close", job: j })}>
                                  <Power className="mr-2 h-4 w-4" />Close job
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-destructive" onSelect={() => setConfirm({ kind: "delete", job: j })}>
                                <Trash2 className="mr-2 h-4 w-4" />Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-xs text-muted-foreground">
            <span>{visible.length} job{visible.length === 1 ? "" : "s"}</span>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="outline" aria-label="Previous page" disabled={current <= 1} onClick={() => setPage(current - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span>Page {current} of {pages}</span>
              <Button size="icon" variant="outline" aria-label="Next page" disabled={current >= pages} onClick={() => setPage(current + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Job Modal */}
      <Dialog open={Boolean(editor)} onOpenChange={(open) => { if (!open && !saving) setEditor(null); }}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editor?.id ? "Edit job" : "Create job"}</DialogTitle>
            <DialogDescription>
              Save as a draft, schedule a future publish date, or publish immediately with AI job intelligence.
            </DialogDescription>
          </DialogHeader>
          {editor && (
            <form className="employer-workspace space-y-4" onSubmit={(e) => void submit(e, "publish")} noValidate>
              {formError && (
                <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
                  {formError}
                </div>
              )}

              {/* Duplicate Job Detection Alert */}
              {duplicates.length > 0 && (
                <div role="status" className="rounded-md border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
                  <div className="flex items-center gap-2 font-semibold">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-700" />
                    Duplicate Job Detection: {duplicates.length} similar opening{duplicates.length === 1 ? "" : "s"} found
                  </div>
                  <ul className="mt-1.5 space-y-1 pl-6 list-disc">
                    {duplicates.slice(0, 3).map((d) => (
                      <li key={d.id}>
                        <strong>{d.designation}</strong> ({d.status} · {d.job_location || "Remote"} · {Math.round(d.similarity_pct)}% match)
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* AI Job Intelligence Co-Pilot Toolbar */}
              <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/30 p-2.5">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                  <Sparkles className="h-3.5 w-3.5" />AI Co-Pilot:
                </span>
                <Button type="button" size="sm" variant="outline" className="h-7 text-[11px]" disabled={aiBusy !== null} onClick={() => void handleGenerateJd()}>
                  <Wand2 className="mr-1 h-3 w-3" />{aiBusy === "jd" ? "Generating…" : "AI JD Generator"}
                </Button>
                <Button type="button" size="sm" variant="outline" className="h-7 text-[11px]" disabled={aiBusy !== null} onClick={() => void handleGenerateSkills()}>
                  <Sparkles className="mr-1 h-3 w-3" />{aiBusy === "skills" ? "Suggesting…" : "AI Skill Generator"}
                </Button>
                <Button type="button" size="sm" variant="outline" className="h-7 text-[11px]" disabled={aiBusy !== null} onClick={() => void handleFetchBenchmark()}>
                  <IndianRupee className="mr-1 h-3 w-3" />{aiBusy === "salary" ? "Checking…" : "Salary Benchmark"}
                </Button>
                <Button type="button" size="sm" variant="outline" className="h-7 text-[11px]" disabled={aiBusy !== null} onClick={() => void handleFetchCompetitor()}>
                  <BarChart3 className="mr-1 h-3 w-3" />{aiBusy === "competitor" ? "Analysing…" : "Competitor Analysis"}
                </Button>
              </div>

              {benchmark && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-primary/25 bg-primary/5 p-3 text-xs">
                  <div>
                    <p className="font-semibold text-foreground">
                      Salary Benchmark ({benchmark.currency}): ₹{benchmark.min_lpa} – {benchmark.max_lpa} LPA (Median ₹{benchmark.median_lpa} LPA)
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      Based on {benchmark.sample_size} comparable listings.
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setField("salary_min", String(benchmark.min_lpa));
                      setField("salary_max", String(benchmark.max_lpa));
                    }}
                  >
                    Apply benchmark
                  </Button>
                </div>
              )}

              {competitor && (
                <div className="rounded-lg border border-border bg-muted/20 p-3 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                      <TrendingUp className="h-3.5 w-3.5 text-primary" />
                      Competitor Job Analysis: {competitor.competing_openings} openings across {competitor.active_employers} employers
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Avg ₹{competitor.avg_salary_min ?? "—"}–{competitor.avg_salary_max ?? "—"} LPA
                    </span>
                  </div>
                  {competitor.top_skills.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] text-muted-foreground">Top market skills:</span>
                      {competitor.top_skills.slice(0, 6).map((s) => (
                        <span key={s} className="workspace-chip !px-2 !py-0.5 !text-[10px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Create Job Posting & Job Categories */}
              <label className="workspace-field">
                <span>Job title *</span>
                <Input
                  value={editor.form.designation}
                  onChange={(e) => setField("designation", e.target.value)}
                  placeholder="Senior React Developer"
                  maxLength={120}
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="workspace-field">
                  <span>Industry</span>
                  <Input value={editor.form.industry} onChange={(e) => setField("industry", e.target.value)} placeholder="Software & SaaS" />
                </label>
                <label className="workspace-field">
                  <span>Department</span>
                  <Input value={editor.form.department} onChange={(e) => setField("department", e.target.value)} placeholder="Engineering" />
                </label>
                <label className="workspace-field">
                  <span>Job function</span>
                  <Input value={editor.form.job_function} onChange={(e) => setField("job_function", e.target.value)} placeholder="Frontend Development" />
                </label>
              </div>

              {/* Job Location & Job Type */}
              <div className="grid gap-4 sm:grid-cols-4">
                <label className="workspace-field">
                  <span>Work mode</span>
                  <select value={editor.form.work_mode} onChange={(e) => setField("work_mode", e.target.value as FormState["work_mode"])}>
                    <option>Remote</option>
                    <option>Hybrid</option>
                    <option>Onsite</option>
                  </select>
                </label>
                <label className="workspace-field">
                  <span>Job type</span>
                  <select value={editor.form.job_type} onChange={(e) => setField("job_type", e.target.value as FormState["job_type"])}>
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </label>
                <label className="workspace-field">
                  <span>City</span>
                  <Input value={editor.form.city} onChange={(e) => setField("city", e.target.value)} placeholder="Bengaluru" />
                </label>
                <label className="workspace-field">
                  <span>Country</span>
                  <Input value={editor.form.country} onChange={(e) => setField("country", e.target.value)} placeholder="India" />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-4">
                <label className="workspace-field">
                  <span>Display location</span>
                  <Input value={editor.form.job_location} onChange={(e) => setField("job_location", e.target.value)} placeholder="Bengaluru, India" />
                </label>
                <label className="workspace-field">
                  <span>Min. experience (years)</span>
                  <Input type="number" min={0} max={40} value={editor.form.experience_min} onChange={(e) => setField("experience_min", e.target.value)} />
                </label>
                <label className="workspace-field">
                  <span>Salary min (LPA)</span>
                  <Input type="number" min={0} value={editor.form.salary_min} onChange={(e) => setField("salary_min", e.target.value)} />
                </label>
                <label className="workspace-field">
                  <span>Salary max (LPA)</span>
                  <Input type="number" min={0} value={editor.form.salary_max} onChange={(e) => setField("salary_max", e.target.value)} />
                </label>
              </div>

              <label className="workspace-field">
                <span>Skills (comma separated) *</span>
                <Input value={editor.form.skills} onChange={(e) => setField("skills", e.target.value)} placeholder="React, TypeScript, Node.js" />
              </label>

              {/* Job Details: Description, Responsibilities, Qualifications, Requirements, Benefits */}
              <label className="workspace-field">
                <span>Description *</span>
                <Textarea
                  rows={5}
                  value={editor.form.job_description}
                  onChange={(e) => setField("job_description", e.target.value)}
                  placeholder="Role overview, team mission, and impact."
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="workspace-field">
                  <span>Responsibilities</span>
                  <Textarea
                    rows={3}
                    value={editor.form.responsibilities}
                    onChange={(e) => setField("responsibilities", e.target.value)}
                    placeholder="Key deliverables and day-to-day ownership."
                  />
                </label>
                <label className="workspace-field">
                  <span>Qualifications</span>
                  <Textarea
                    rows={3}
                    value={editor.form.qualifications}
                    onChange={(e) => setField("qualifications", e.target.value)}
                    placeholder="Educational background or domain credentials."
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="workspace-field">
                  <span>Requirements</span>
                  <Textarea
                    rows={2}
                    value={editor.form.requirements}
                    onChange={(e) => setField("requirements", e.target.value)}
                    placeholder="Must-have technical depth and tooling."
                  />
                </label>
                <label className="workspace-field">
                  <span>Benefits (comma separated)</span>
                  <Textarea
                    rows={2}
                    value={editor.form.benefits}
                    onChange={(e) => setField("benefits", e.target.value)}
                    placeholder="Health Insurance, Learning Budget, ESOPs"
                  />
                </label>
              </div>

              {/* Job Expiry, Scheduling & Promotion */}
              <div className="grid gap-4 sm:grid-cols-4">
                <label className="workspace-field">
                  <span>Application deadline</span>
                  <Input type="date" value={editor.form.closes} onChange={(e) => setField("closes", e.target.value)} />
                </label>
                <label className="workspace-field">
                  <span>Expiry reminder (days)</span>
                  <Input type="number" min={1} max={30} value={editor.form.expiry_reminder_days} onChange={(e) => setField("expiry_reminder_days", e.target.value)} />
                </label>
                <label className="workspace-field">
                  <span>Schedule publish (optional)</span>
                  <Input type="datetime-local" value={editor.form.scheduled_publish_at} onChange={(e) => setField("scheduled_publish_at", e.target.value)} />
                </label>
                <label className="workspace-field">
                  <span>Job promotion</span>
                  <select value={editor.form.promotion_tier} onChange={(e) => setField("promotion_tier", e.target.value as FormState["promotion_tier"])}>
                    <option value="none">Standard listing</option>
                    <option value="featured">Featured job</option>
                    <option value="sponsored">Sponsored listing</option>
                  </select>
                </label>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-xs font-semibold">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={editor.form.salary_visible} onChange={(e) => setField("salary_visible", e.target.checked)} />
                  <span>Show salary to candidates</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={editor.form.auto_close_on_expiry} onChange={(e) => setField("auto_close_on_expiry", e.target.checked)} />
                  <span>Auto-close vacancy on expiry</span>
                </label>
              </div>

              <div className="flex flex-wrap justify-end gap-2 border-t border-border pt-4">
                <Button type="button" variant="outline" onClick={() => setPreview(editor.form)}>
                  <Eye className="mr-1.5 h-4 w-4" />Preview
                </Button>
                <Button type="button" variant="outline" disabled={saving} onClick={() => void submit(null, "draft")}>
                  <Save className="mr-1.5 h-4 w-4" />{saving ? "Saving…" : "Save as draft"}
                </Button>
                {editor.form.scheduled_publish_at && (
                  <Button type="button" variant="outline" disabled={saving} onClick={() => void submit(null, "schedule")}>
                    <CalendarClock className="mr-1.5 h-4 w-4" />Schedule publish
                  </Button>
                )}
                <Button type="submit" disabled={saving}>
                  <Send className="mr-1.5 h-4 w-4" />{editor.id ? "Save & publish" : "Publish job"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Preview */}
      <Dialog open={Boolean(preview)} onOpenChange={(open) => { if (!open) setPreview(null); }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{preview?.designation || "Untitled job"}</DialogTitle>
            <DialogDescription>
              {companyName} · {(preview && deriveLocation(preview)) || preview?.work_mode} · {preview?.job_type}
            </DialogDescription>
          </DialogHeader>
          {preview && (
            <div className="space-y-4 text-sm">
              <div className="flex flex-wrap gap-2">
                {splitCsv(preview.skills).map((s) => <span key={s} className="workspace-chip">{s}</span>)}
              </div>
              <dl className="grid grid-cols-2 gap-3 text-xs">
                <div><dt className="text-muted-foreground">Experience</dt><dd className="font-semibold">{preview.experience_min}+ years</dd></div>
                <div><dt className="text-muted-foreground">Salary</dt><dd className="font-semibold">{preview.salary_visible && (preview.salary_min || preview.salary_max) ? `₹${preview.salary_min || "—"} – ${preview.salary_max || "—"} LPA` : "Not disclosed"}</dd></div>
                {(preview.industry || preview.department) && (
                  <div className="col-span-2">
                    <dt className="text-muted-foreground">Category</dt>
                    <dd className="font-semibold">{[preview.industry, preview.department, preview.job_function].filter(Boolean).join(" · ")}</dd>
                  </div>
                )}
              </dl>
              <p className="whitespace-pre-line text-muted-foreground">{preview.job_description || "No description yet."}</p>
              {preview.responsibilities && (
                <div>
                  <h4 className="text-xs font-semibold text-foreground">Responsibilities</h4>
                  <p className="mt-1 whitespace-pre-line text-xs text-muted-foreground">{preview.responsibilities}</p>
                </div>
              )}
              {preview.qualifications && (
                <div>
                  <h4 className="text-xs font-semibold text-foreground">Qualifications</h4>
                  <p className="mt-1 whitespace-pre-line text-xs text-muted-foreground">{preview.qualifications}</p>
                </div>
              )}
              {preview.requirements && (
                <div>
                  <h4 className="text-xs font-semibold text-foreground">Requirements</h4>
                  <p className="mt-1 whitespace-pre-line text-xs text-muted-foreground">{preview.requirements}</p>
                </div>
              )}
              {splitCsv(preview.benefits).length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-foreground">Benefits</h4>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {splitCsv(preview.benefits).map((b) => <span key={b} className="workspace-chip">{b}</span>)}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmations */}
      <AlertDialog open={Boolean(confirm)} onOpenChange={(open) => { if (!open) setConfirm(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirm?.kind === "delete" ? "Delete this job?" : "Close this job?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirm?.kind === "delete"
                ? `“${confirm.job.designation}” will be removed. Jobs that already have applications cannot be deleted, close them instead.`
                : `“${confirm?.job.designation}” will stop accepting applications. Existing applicants stay in your pipeline.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!confirm) return;
                const { kind, job } = confirm;
                void run(job.id, kind === "delete" ? "Job deleted." : "Job closed.", () => (kind === "delete" ? deleteJob(job.id) : closeJob(job.id)));
              }}
            >
              {confirm?.kind === "delete" ? <><Trash2 className="mr-1.5 h-4 w-4" />Delete</> : <><XCircle className="mr-1.5 h-4 w-4" />Close job</>}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
