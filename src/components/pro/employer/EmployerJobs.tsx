import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import {
  AlertCircle, Briefcase, ChevronLeft, ChevronRight, Copy, Eye, FilePenLine, MoreHorizontal, Pause, Play, Plus, Power, Save, Search,
  Send, Trash2, Users, XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  closeJob, createJob, deleteJob, duplicateJob, getJobForEdit, listMyJobs, pauseJob, publishJob, resumeJob, updateJob,
  type CreateJobInput, type EmployerJobRecord,
} from "@/services/employer/jobs";
import { getPublishReadiness, type PublishReadiness } from "@/services/employer/ats";
import type { NavigateFn } from "./EmployerOverview";
import { EmptyState, ErrorState, JobStatusBadge, Loading, PageHeader, fmtDate } from "./employerUi";

type ListedJob = Pick<EmployerJobRecord, "id" | "designation" | "status" | "work_mode" | "job_type" | "job_location" | "skills" | "views_count" | "applications_count" | "published_at" | "closes_at" | "created_at" | "moderation_note" | "salary_min" | "salary_max">;

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
  { value: "draft", label: "Draft" },
  { value: "paused", label: "Paused" },
  { value: "pending_review", label: "In review" },
  { value: "closed", label: "Closed / expired" },
];
const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "title", label: "Title A–Z" },
  { value: "applications", label: "Most applications" },
  { value: "views", label: "Most views" },
];

interface FormState {
  designation: string;
  job_description: string;
  job_location: string;
  work_mode: "Remote" | "Hybrid" | "Onsite";
  job_type: "Full-time" | "Internship" | "Contract" | "Part-time";
  salary_min: string;
  salary_max: string;
  experience_min: string;
  skills: string;
  salary_visible: boolean;
  closes: string;
}
const EMPTY_FORM: FormState = {
  designation: "", job_description: "", job_location: "", work_mode: "Hybrid", job_type: "Full-time",
  salary_min: "", salary_max: "", experience_min: "0", skills: "", salary_visible: true, closes: "",
};

const toInput = (f: FormState): CreateJobInput => ({
  designation: f.designation.trim(),
  job_description: f.job_description.trim(),
  job_location: f.job_location.trim(),
  work_mode: f.work_mode,
  job_type: f.job_type,
  salary_min: f.salary_min === "" ? undefined : Number(f.salary_min),
  salary_max: f.salary_max === "" ? undefined : Number(f.salary_max),
  experience_min: Number(f.experience_min) || 0,
  skills: [...new Set(f.skills.split(",").map((s) => s.trim()).filter(Boolean))],
  salary_visible: f.salary_visible,
});

const fromRecord = (j: EmployerJobRecord & { salary_visible?: boolean }): FormState => ({
  designation: j.designation ?? "",
  job_description: j.job_description ?? "",
  job_location: j.job_location ?? "",
  work_mode: (j.work_mode as FormState["work_mode"]) || "Hybrid",
  job_type: (j.job_type as FormState["job_type"]) || "Full-time",
  salary_min: j.salary_min == null ? "" : String(j.salary_min),
  salary_max: j.salary_max == null ? "" : String(j.salary_max),
  experience_min: String(j.experience_min ?? 0),
  skills: (j.skills ?? []).join(", "),
  salary_visible: j.salary_visible ?? true,
  closes: j.closes_at ? j.closes_at.slice(0, 10) : "",
});

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
  useEffect(() => { if (searchParams.get("new") === "1") setEditor((cur) => cur ?? { id: null, form: EMPTY_FORM }); }, [searchParams]);
  useEffect(() => { setPage(1); }, [query, status, sort]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = jobs.filter((j) => {
      if (status === "closed" ? !["closed", "expired"].includes(j.status) : status && j.status !== status) return false;
      return !q || `${j.designation} ${j.job_location ?? ""}`.toLowerCase().includes(q);
    });
    rows = [...rows].sort((a, b) => {
      switch (sort) {
        case "title": return a.designation.localeCompare(b.designation);
        case "applications": return b.applications_count - a.applications_count;
        case "views": return b.views_count - a.views_count;
        default: return +new Date(b.created_at) - +new Date(a.created_at);
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
    if (!job) return setEditor({ id: null, form: EMPTY_FORM });
    try {
      const full = await getJobForEdit(job.id);
      setEditor({ id: job.id, form: fromRecord(full) });
    } catch (e) {
      onToast(e instanceof Error ? e.message : "Could not open this job.");
    }
  };

  const validate = (f: FormState, forPublish: boolean): string | null => {
    if (f.designation.trim().length < 3) return "Job title must be at least 3 characters.";
    if (f.salary_min !== "" && f.salary_max !== "" && Number(f.salary_max) < Number(f.salary_min)) return "Maximum salary must be at least the minimum salary.";
    if (forPublish) {
      if (f.job_description.trim().length < 20) return "Add a job description of at least 20 characters before publishing.";
      if (!f.skills.trim()) return "Add at least one skill before publishing.";
      if (f.work_mode !== "Remote" && f.job_location.trim().length < 2) return "Add a location for non-remote roles.";
      if (f.closes && new Date(f.closes) <= new Date()) return "Application deadline must be in the future.";
    }
    return null;
  };

  const persist = async (form: FormState, id: string | null): Promise<EmployerJobRecord> =>
    id ? updateJob(id, toInput(form)) : createJob(toInput(form));

  const submit = async (event: FormEvent, mode: "draft" | "publish") => {
    event.preventDefault();
    if (!editor) return;
    const problem = validate(editor.form, mode === "publish");
    if (problem) return setFormError(problem);
    if (mode === "publish") {
      const latest = await getPublishReadiness().catch(() => readiness);
      setReadiness(latest);
      if (latest && !latest.ready) return setFormError("Complete your company profile before publishing. You can still save this job as a draft.");
    }
    setSaving(true);
    setFormError(null);
    try {
      const saved = await persist(editor.form, editor.id);
      if (mode === "publish") {
        const closesAt = editor.form.closes ? new Date(`${editor.form.closes}T23:59:59`).toISOString() : undefined;
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

  const salary = (j: ListedJob) =>
    j.salary_min || j.salary_max ? `${j.salary_min ?? "—"} – ${j.salary_max ?? "—"}` : "Not specified";

  return (
    <div className="employer-workspace space-y-5">
      <PageHeader
        eyebrow="Jobs"
        icon={<Briefcase size={13} />}
        title="Job listings"
        description="Create drafts, publish when you are ready and manage every opening in one place."
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

      <div className="workspace-panel !p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input aria-label="Search jobs" className="pl-9" placeholder="Search by title or location" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)} className="!w-auto min-w-[150px]">
            {STATUS_FILTERS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <select aria-label="Sort jobs" value={sort} onChange={(e) => setSort(e.target.value)} className="!w-auto min-w-[150px]">
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {loading ? <Loading label="Loading jobs" /> : error ? <ErrorState message={error} onRetry={load} /> : rows.length === 0 ? (
        <div className="workspace-panel">
          <EmptyState
            icon={<Briefcase />}
            title={jobs.length === 0 ? "No jobs yet" : "No jobs match your filters"}
            hint={jobs.length === 0 ? "Create your first opening. You can save it as a draft and publish later." : "Try a different search or status."}
            action={jobs.length === 0 ? <Button onClick={() => void openEditor()}><Plus className="mr-1.5 h-4 w-4" />Create job</Button> : undefined}
          />
        </div>
      ) : (
        <div className="workspace-panel !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-xs">
              <thead className="border-b border-border bg-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Job</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                  <th className="px-3 py-3 font-semibold">Applications</th>
                  <th className="px-3 py-3 font-semibold">Views</th>
                  <th className="px-3 py-3 font-semibold">Created</th>
                  <th className="px-3 py-3 text-right font-semibold"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((j) => (
                  <tr key={j.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-foreground">{j.designation}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{j.job_location || j.work_mode} · {j.job_type} · {salary(j)}</p>
                      {j.moderation_note && <p className="mt-0.5 text-[11px] text-warning">{j.moderation_note}</p>}
                    </td>
                    <td className="px-3 py-3"><JobStatusBadge status={j.status} /></td>
                    <td className="px-3 py-3">
                      <button type="button" className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline" onClick={() => onNavigate("pipe", { job: j.id })}>
                        <Users className="h-3.5 w-3.5" />{j.applications_count}
                      </button>
                    </td>
                    <td className="px-3 py-3">{j.views_count}</td>
                    <td className="px-3 py-3 text-muted-foreground">{fmtDate(j.created_at)}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {j.status === "draft" && (
                          <Button size="sm" disabled={busy === j.id} onClick={() => void publishExisting(j)}><Send className="mr-1.5 h-3.5 w-3.5" />Publish</Button>
                        )}
                        {j.status === "active" && (
                          <Button size="sm" variant="outline" disabled={busy === j.id} onClick={() => void run(j.id, "Job unpublished.", () => pauseJob(j.id))}><Pause className="mr-1.5 h-3.5 w-3.5" />Unpublish</Button>
                        )}
                        {j.status === "paused" && (
                          <Button size="sm" disabled={busy === j.id} onClick={() => void run(j.id, "Job activated.", () => resumeJob(j.id))}><Play className="mr-1.5 h-3.5 w-3.5" />Activate</Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" aria-label={`More actions for ${j.designation}`}><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => void openEditor(j)}><FilePenLine className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                            <DropdownMenuItem onSelect={async () => { try { setPreview(fromRecord(await getJobForEdit(j.id))); } catch (e) { onToast(e instanceof Error ? e.message : "Could not preview."); } }}><Eye className="mr-2 h-4 w-4" />Preview</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => onNavigate("pipe", { job: j.id })}><Users className="mr-2 h-4 w-4" />View applicants</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => void run(j.id, "Draft copy created.", () => duplicateJob(j.id))}><Copy className="mr-2 h-4 w-4" />Duplicate</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {["active", "paused", "pending_review"].includes(j.status) && (
                              <DropdownMenuItem onSelect={() => setConfirm({ kind: "close", job: j })}><Power className="mr-2 h-4 w-4" />Close job</DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-destructive" onSelect={() => setConfirm({ kind: "delete", job: j })}><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-xs text-muted-foreground">
            <span>{visible.length} job{visible.length === 1 ? "" : "s"}</span>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="outline" aria-label="Previous page" disabled={current <= 1} onClick={() => setPage(current - 1)}><ChevronLeft className="h-4 w-4" /></Button>
              <span>Page {current} of {pages}</span>
              <Button size="icon" variant="outline" aria-label="Next page" disabled={current >= pages} onClick={() => setPage(current + 1)}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>
      )}

      {/* Create / edit */}
      <Dialog open={Boolean(editor)} onOpenChange={(open) => { if (!open && !saving) setEditor(null); }}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editor?.id ? "Edit job" : "Create job"}</DialogTitle>
            <DialogDescription>Save as a draft any time. Publishing needs a complete company profile.</DialogDescription>
          </DialogHeader>
          {editor && (
            <form className="employer-workspace space-y-4" onSubmit={(e) => void submit(e, "publish")} noValidate>
              {formError && <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">{formError}</div>}
              <label className="workspace-field"><span>Job title *</span>
                <Input value={editor.form.designation} onChange={(e) => setField("designation", e.target.value)} placeholder="Senior React Developer" maxLength={120} /></label>
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="workspace-field"><span>Work mode</span>
                  <select value={editor.form.work_mode} onChange={(e) => setField("work_mode", e.target.value as FormState["work_mode"])}>
                    <option>Remote</option><option>Hybrid</option><option>Onsite</option></select></label>
                <label className="workspace-field"><span>Job type</span>
                  <select value={editor.form.job_type} onChange={(e) => setField("job_type", e.target.value as FormState["job_type"])}>
                    <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option></select></label>
                <label className="workspace-field"><span>Location</span>
                  <Input value={editor.form.job_location} onChange={(e) => setField("job_location", e.target.value)} placeholder="Bengaluru" /></label>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="workspace-field"><span>Min. experience (years)</span>
                  <Input type="number" min={0} max={40} value={editor.form.experience_min} onChange={(e) => setField("experience_min", e.target.value)} /></label>
                <label className="workspace-field"><span>Salary min</span>
                  <Input type="number" min={0} value={editor.form.salary_min} onChange={(e) => setField("salary_min", e.target.value)} /></label>
                <label className="workspace-field"><span>Salary max</span>
                  <Input type="number" min={0} value={editor.form.salary_max} onChange={(e) => setField("salary_max", e.target.value)} /></label>
              </div>
              <label className="workspace-field"><span>Skills (comma separated)</span>
                <Input value={editor.form.skills} onChange={(e) => setField("skills", e.target.value)} placeholder="React, TypeScript, Node.js" /></label>
              <label className="workspace-field"><span>Description</span>
                <Textarea rows={7} value={editor.form.job_description} onChange={(e) => setField("job_description", e.target.value)} placeholder="Responsibilities, requirements and what makes the role great." /></label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="workspace-field"><span>Application deadline (optional)</span>
                  <Input type="date" value={editor.form.closes} onChange={(e) => setField("closes", e.target.value)} /></label>
                <label className="flex items-end gap-2 pb-2 text-xs font-semibold">
                  <input type="checkbox" checked={editor.form.salary_visible} onChange={(e) => setField("salary_visible", e.target.checked)} />Show salary to candidates</label>
              </div>
              <div className="flex flex-wrap justify-end gap-2 border-t border-border pt-4">
                <Button type="button" variant="outline" onClick={() => setPreview(editor.form)}><Eye className="mr-1.5 h-4 w-4" />Preview</Button>
                <Button type="button" variant="outline" disabled={saving} onClick={(e) => void submit(e, "draft")}><Save className="mr-1.5 h-4 w-4" />{saving ? "Saving…" : "Save as draft"}</Button>
                <Button type="submit" disabled={saving}><Send className="mr-1.5 h-4 w-4" />{editor.id ? "Save & publish" : "Publish job"}</Button>
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
            <DialogDescription>{companyName} · {preview?.job_location || preview?.work_mode} · {preview?.job_type}</DialogDescription>
          </DialogHeader>
          {preview && (
            <div className="space-y-4 text-sm">
              <div className="flex flex-wrap gap-2">
                {preview.skills.split(",").map((s) => s.trim()).filter(Boolean).map((s) => <span key={s} className="workspace-chip">{s}</span>)}
              </div>
              <dl className="grid grid-cols-2 gap-3 text-xs">
                <div><dt className="text-muted-foreground">Experience</dt><dd className="font-semibold">{preview.experience_min}+ years</dd></div>
                <div><dt className="text-muted-foreground">Salary</dt><dd className="font-semibold">{preview.salary_visible && (preview.salary_min || preview.salary_max) ? `${preview.salary_min || "—"} – ${preview.salary_max || "—"}` : "Not disclosed"}</dd></div>
              </dl>
              <p className="whitespace-pre-line text-muted-foreground">{preview.job_description || "No description yet."}</p>
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
