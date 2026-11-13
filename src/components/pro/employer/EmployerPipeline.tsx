import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Award,
  CheckCheck,
  Columns3,
  Download,
  FileDown,
  FileSpreadsheet,
  GripVertical,
  History,
  Kanban,
  Layers,
  List,
  MapPin,
  MoreHorizontal,
  RotateCcw,
  Search,
  Sparkles,
  StickyNote,
  UserCheck,
  UserPlus,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  APPLICATION_BUCKETS,
  APPLICATION_STAGES,
  STAGE_LABEL,
  applicationsToCsv,
  assignRecruiter,
  bulkChangeStage,
  changeStage,
  compareApplications,
  exportApplications,
  getApplication,
  listApplications,
  listTenantRecruiters,
  markApplicationHired,
  releaseHold,
  saveApplicationNote,
  setApplicationWorkflowFlags,
  triggerTextDownload,
  type ApplicationBucket,
  type ApplicationDetail,
  type ApplicationList,
  type ComparedApplication,
  type ExportedApplicationRow,
  type LiveApplication,
  type TenantRecruiter,
} from "@/services/employer/ats";
import { listMyJobs } from "@/services/employer/jobs";
import {
  Avatar,
  EmptyState,
  ErrorState,
  Loading,
  PageHeader,
  StageBadge,
  fmtDateTime,
  relativeTime,
} from "./employerUi";
import { EmployerApplicantDetail } from "./EmployerApplicantDetail";
import type { NavigateFn } from "./EmployerOverview";
import "../employer-workspace.css";

interface Props {
  searchParams: URLSearchParams;
  contact?: { name?: string; email?: string };
  onNavigate: NavigateFn;
  onToast: (message: string) => void;
}

function matchesBucketFallback(a: LiveApplication, bucket: ApplicationBucket): boolean {
  switch (bucket) {
    case "all":
      return a.stage !== "Withdrawn";
    case "new":
      return a.stage === "Applied";
    case "ai_screened":
      return Boolean(a.ai_screened) || a.match_score != null;
    case "shortlisted":
      return a.stage === "Shortlisted";
    case "rejected":
      return a.stage === "Rejected";
    case "on_hold":
      return a.stage === "On Hold";
    case "interview_scheduled":
      return a.stage === "Interview" || Boolean(a.interview_at);
    case "assessment_pending":
      return a.assessment_status === "pending";
    case "assessment_completed":
      return a.assessment_status === "completed" || Boolean(a.cir_score);
    case "offer_released":
      return (a.stage === "Offer" || Boolean(a.offer_released)) && !a.is_hired;
    case "hired":
      return Boolean(a.is_hired);
    default:
      return true;
  }
}

export function EmployerPipeline({ searchParams, contact, onNavigate, onToast }: Props) {
  const applicationId = searchParams.get("application");
  const stageFilter = searchParams.get("stage") ?? "";
  const jobFilter = searchParams.get("job") ?? "";

  const [mode, setMode] = useState<"board" | "list">("board");
  const [bucket, setBucket] = useState<ApplicationBucket>(
    () => (searchParams.get("bucket") as ApplicationBucket) || "all"
  );
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"recent" | "match">("recent");
  const [minMatch, setMinMatch] = useState<number>(0);
  const [recruiterFilter, setRecruiterFilter] = useState("");
  const [data, setData] = useState<ApplicationList | null>(null);
  const [jobs, setJobs] = useState<Array<{ id: string; designation: string }>>([]);
  const [recruiters, setRecruiters] = useState<TenantRecruiter[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [moving, setMoving] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);

  // Selection & Advanced Option Modals
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [noteModal, setNoteModal] = useState<{ app: LiveApplication; text: string } | null>(null);
  const [assignModal, setAssignModal] = useState<{ ids: string[]; recruiterId: string; customName: string } | null>(null);
  const [historyModal, setHistoryModal] = useState<{ app: LiveApplication; detail: ApplicationDetail | null; loading: boolean } | null>(null);
  const [compareModal, setCompareModal] = useState<{ items: ComparedApplication[]; loading: boolean } | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await listApplications({
        job: jobFilter || null,
        stage: mode === "list" ? stageFilter || null : null,
        bucket: bucket === "all" ? null : bucket,
        search: query,
        minMatch: minMatch > 0 ? minMatch : null,
        recruiter: recruiterFilter || null,
        sort,
        limit: 200,
      });
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load applications.");
    } finally {
      setLoading(false);
    }
  }, [jobFilter, stageFilter, bucket, query, minMatch, recruiterFilter, sort, mode]);

  useEffect(() => {
    const t = setTimeout(() => void load(), query ? 250 : 0);
    return () => clearTimeout(t);
  }, [load, query]);

  useEffect(() => {
    listMyJobs({ limit: 100 })
      .then((rows) => setJobs(rows.map((r) => ({ id: r.id, designation: r.designation }))))
      .catch(() => setJobs([]));
    if (typeof listTenantRecruiters === "function") {
      Promise.resolve(listTenantRecruiters())
        .then((rows) => {
          if (Array.isArray(rows)) setRecruiters(rows);
        })
        .catch(() => setRecruiters([]));
    }
  }, []);

  const baseQuery = () =>
    Object.fromEntries(
      [...searchParams.entries()].filter(([k]) => !["view", "role", "application"].includes(k))
    );

  const setParam = (key: string, value: string) => {
    const next = baseQuery();
    if (value) next[key] = value;
    else delete next[key];
    onNavigate("pipe", next);
  };

  const move = async (app: LiveApplication, stage: string) => {
    if (app.stage === stage) return;
    setMoving(app.id);
    try {
      await changeStage(app.id, stage);
      onToast(`${app.name} moved to ${STAGE_LABEL[stage] ?? stage}.`);
      await load();
    } catch (e) {
      onToast(e instanceof Error ? e.message : "Could not move the candidate.");
    } finally {
      setMoving(null);
    }
  };

  const open = (id: string) => onNavigate("pipe", { ...baseQuery(), application: id });

  const counts = useMemo(() => data?.counts ?? {}, [data?.counts]);
  const total = useMemo(
    () =>
      Object.entries(counts).reduce(
        (sum, [stage, n]) => (stage === "Withdrawn" ? sum : sum + n),
        0
      ),
    [counts]
  );

  const rawItems = useMemo(() => data?.items ?? [], [data?.items]);
  const listItems = useMemo(() => {
    let items = rawItems;
    if (!data?.buckets && bucket !== "all") {
      items = items.filter((a) => matchesBucketFallback(a, bucket));
    }
    if (minMatch > 0) {
      items = items.filter((a) => (a.match_score ?? 0) >= minMatch);
    }
    if (recruiterFilter) {
      items = items.filter((a) =>
        recruiterFilter === "__unassigned__"
          ? !a.assigned_recruiter_id && !a.assigned_recruiter_name
          : a.assigned_recruiter_id === recruiterFilter || a.assigned_recruiter_name === recruiterFilter
      );
    }
    return items;
  }, [rawItems, data?.buckets, bucket, minMatch, recruiterFilter]);

  const bucketCounts = useMemo(() => {
    if (data?.buckets) return data.buckets;
    const map = {} as Record<ApplicationBucket, number>;
    for (const b of APPLICATION_BUCKETS) {
      map[b.key] = b.key === "all" ? total || rawItems.length : rawItems.filter((a) => matchesBucketFallback(a, b.key)).length;
    }
    return map;
  }, [data?.buckets, rawItems, total]);

  const toggleSelected = (id: string, checked: boolean) => {
    setSelectedIds((cur) => (checked ? [...new Set([...cur, id])] : cur.filter((x) => x !== id)));
  };

  // Bulk Stage Action (Bulk Shortlist / Bulk Reject / Mark Hired)
  const handleBulkStage = async (targetStage: string, label: string) => {
    if (!selectedIds.length) return;
    setBulkBusy(true);
    try {
      const res = await bulkChangeStage(selectedIds, targetStage);
      onToast(`${label}: updated ${res?.updated ?? selectedIds.length} candidate(s).`);
      setSelectedIds([]);
      await load();
    } catch (e) {
      onToast(e instanceof Error ? e.message : "Bulk update failed.");
    } finally {
      setBulkBusy(false);
    }
  };

  // Download Resumes (Single or Bulk)
  const handleDownloadResumes = (targets: LiveApplication[]) => {
    if (!targets.length) {
      onToast("Select at least one candidate to download resumes.");
      return;
    }
    let openedUrls = 0;
    for (const t of targets) {
      if (t.resume_url) {
        window.open(t.resume_url, "_blank", "noopener,noreferrer");
        openedUrls++;
      }
    }
    const dossier = targets
      .map(
        (t, idx) =>
          `#${idx + 1} ${t.name} (${t.talent_cir_id ?? "Candidate"})\n` +
          `Role Applied: ${t.job_title}\n` +
          `Stage: ${t.is_hired ? "Hired" : (STAGE_LABEL[t.stage] ?? t.stage)} | Match Score: ${t.match_score ?? "—"}% | CIR Score: ${t.cir_score ?? "—"}\n` +
          `Experience: ${t.experience_years ?? 0} years | Skills: ${(t.skills ?? []).join(", ") || "—"}\n` +
          `Assigned Recruiter: ${t.assigned_recruiter_name || "Unassigned"}\n` +
          `Resume Path: ${t.resume_url || "Profile summary attached"}\n` +
          `Internal Note: ${t.recruiter_note || "None"}\n`
      )
      .join("\n------------------------------------------------------------\n\n");
    triggerTextDownload(
      targets.length === 1
        ? `${targets[0].name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-resume-summary.txt`
        : `candidate-resumes-pack-${targets.length}.txt`,
      dossier,
      "text/plain;charset=utf-8"
    );
    onToast(
      openedUrls > 0
        ? `Opened ${openedUrls} CV file(s) and downloaded resume dossier.`
        : `Downloaded resume summary dossier for ${targets.length} candidate(s).`
    );
  };

  // Save Internal Note
  const handleSaveNote = async () => {
    if (!noteModal) return;
    setBulkBusy(true);
    try {
      await saveApplicationNote(noteModal.app.id, noteModal.text.trim());
      onToast(`Internal note saved for ${noteModal.app.name}.`);
      setNoteModal(null);
      await load();
    } catch (e) {
      onToast(e instanceof Error ? e.message : "Could not save note.");
    } finally {
      setBulkBusy(false);
    }
  };

  // Assign Recruiter
  const handleSaveRecruiter = async () => {
    if (!assignModal || !assignModal.ids.length) return;
    setBulkBusy(true);
    try {
      const chosenMember = recruiters.find((r) => r.user_id === assignModal.recruiterId);
      const name = assignModal.customName.trim() || chosenMember?.name || null;
      const uid = assignModal.customName.trim() ? null : chosenMember?.user_id || null;
      await assignRecruiter(assignModal.ids, uid, name);
      onToast(name ? `Assigned ${name} to ${assignModal.ids.length} application(s).` : "Cleared recruiter assignment.");
      setAssignModal(null);
      setSelectedIds([]);
      await load();
    } catch (e) {
      onToast(e instanceof Error ? e.message : "Could not assign recruiter.");
    } finally {
      setBulkBusy(false);
    }
  };

  // Open Application History Timeline
  const handleOpenHistory = async (app: LiveApplication) => {
    setHistoryModal({ app, detail: null, loading: true });
    try {
      const d = await getApplication(app.id);
      setHistoryModal({ app, detail: d, loading: false });
    } catch {
      setHistoryModal({ app, detail: null, loading: false });
    }
  };

  // Open Side-by-Side Candidate Comparison
  const handleOpenCompare = async () => {
    const ids =
      selectedIds.length >= 2
        ? selectedIds.slice(0, 4)
        : listItems.slice(0, Math.min(3, listItems.length)).map((a) => a.id);
    if (ids.length < 2) {
      onToast("Need at least 2 candidates to compare side by side.");
      return;
    }
    setCompareModal({ items: [], loading: true });
    try {
      const rows = await compareApplications(ids);
      if (Array.isArray(rows) && rows.length > 0) {
        setCompareModal({ items: rows, loading: false });
        return;
      }
    } catch {
      // Fall back to building comparison items from loaded listItems
    }
    const fallback: ComparedApplication[] = ids
      .map((id) => listItems.find((x) => x.id === id))
      .filter((x): x is LiveApplication => Boolean(x))
      .map((a) => ({
        id: a.id,
        job_id: a.job_id,
        job_title: a.job_title,
        candidate_id: a.candidate_id,
        name: a.name,
        headline: a.headline,
        city: null,
        experience_years: a.experience_years ?? 0,
        skills: a.skills ?? [],
        certifications: [],
        verified: a.verified,
        photo_url: a.photo_url,
        stage: a.stage,
        is_hired: Boolean(a.is_hired),
        offer_released: Boolean(a.offer_released),
        assessment_status: a.assessment_status ?? "none",
        ai_screened: Boolean(a.ai_screened),
        match_score: a.match_score,
        cir_score: a.cir_score ?? null,
        readiness_score: a.readiness_score ?? a.cir_score ?? a.match_score ?? null,
        assigned_recruiter_name: a.assigned_recruiter_name ?? null,
        recruiter_note: a.recruiter_note ?? null,
        interviews_count: a.interview_at ? 1 : 0,
        applied_at: a.applied_at,
      }));
    setCompareModal({ items: fallback, loading: false });
  };

  // Export Application Data (CSV)
  const handleExportCsv = async () => {
    try {
      let rows: ExportedApplicationRow[] = [];
      if (typeof exportApplications === "function") {
        const res = await exportApplications({
          job: jobFilter || null,
          stage: stageFilter || null,
          bucket: bucket === "all" ? null : bucket,
        });
        if (Array.isArray(res)) {
          rows =
            selectedIds.length > 0
              ? res.filter((r) => selectedIds.includes(r.application_id))
              : res;
        }
      }
      if (!rows.length) {
        const source = selectedIds.length > 0 ? listItems.filter((a) => selectedIds.includes(a.id)) : listItems;
        rows = source.map((a) => ({
          application_id: a.id,
          candidate_name: a.name,
          talent_cir_id: a.talent_cir_id,
          email: null,
          city: null,
          job_title: a.job_title,
          stage: a.stage,
          hiring_status: a.is_hired
            ? "Hired"
            : a.offer_released || a.stage === "Offer"
              ? "Offer Released"
              : a.stage,
          ai_screened: Boolean(a.ai_screened),
          assessment_status: a.assessment_status ?? "none",
          match_score: a.match_score,
          experience_years: a.experience_years ?? 0,
          skills: (a.skills ?? []).join("; "),
          assigned_recruiter: a.assigned_recruiter_name ?? null,
          recruiter_note: a.recruiter_note ?? null,
          applied_at: a.applied_at,
        }));
      }
      const csv = applicationsToCsv(rows);
      triggerTextDownload(`applications-export-${new Date().toISOString().slice(0, 10)}.csv`, csv);
      onToast(`Exported ${rows.length} application record(s) to CSV.`);
    } catch (e) {
      onToast(e instanceof Error ? e.message : "Could not export application data.");
    }
  };

  if (applicationId) {
    return (
      <EmployerApplicantDetail
        applicationId={applicationId}
        contact={contact}
        onBack={() => onNavigate("pipe", baseQuery())}
        onChanged={() => void load()}
        onToast={onToast}
      />
    );
  }

  const stats = [
    { label: "Total applications", count: total, stage: "", theme: "all" },
    ...APPLICATION_STAGES.map((s) => ({
      label: STAGE_LABEL[s],
      count: counts[s] ?? 0,
      stage: s,
      theme: s,
    })),
  ];

  const activeFilterCount =
    (jobFilter ? 1 : 0) +
    (query.trim() ? 1 : 0) +
    (stageFilter ? 1 : 0) +
    (bucket !== "all" ? 1 : 0) +
    (minMatch > 0 ? 1 : 0) +
    (recruiterFilter ? 1 : 0) +
    (sort !== "recent" ? 1 : 0);

  const moveMenu = (app: LiveApplication) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          aria-label={`Move ${app.name}`}
          disabled={moving === app.id}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Move to stage</DropdownMenuLabel>
        {APPLICATION_STAGES.filter((s) => s !== app.stage).map((s) => (
          <DropdownMenuItem key={s} onSelect={() => void move(app, s)}>
            {STAGE_LABEL[s]}
          </DropdownMenuItem>
        ))}
        {!app.is_hired && (
          <DropdownMenuItem
            onSelect={() => {
              setMoving(app.id);
              markApplicationHired(app.id)
                .then(() => {
                  onToast(`${app.name} marked as Hired!`);
                  return load();
                })
                .catch((e) => onToast(e instanceof Error ? e.message : "Action failed."))
                .finally(() => setMoving(null));
            }}
          >
            <Award className="mr-2 h-4 w-4" />
            Mark as Hired
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => setNoteModal({ app, text: app.recruiter_note ?? "" })}>
          <StickyNote className="mr-2 h-4 w-4" />
          Add / Edit Internal Note
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() =>
            setAssignModal({
              ids: [app.id],
              recruiterId: app.assigned_recruiter_id ?? "",
              customName: app.assigned_recruiter_name ?? "",
            })
          }
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Assign Recruiter
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => void handleOpenHistory(app)}>
          <History className="mr-2 h-4 w-4" />
          Application History
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleDownloadResumes([app])}>
          <FileDown className="mr-2 h-4 w-4" />
          Download Resume
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Screening & Assessments</DropdownMenuLabel>
        <DropdownMenuItem
          onSelect={() => {
            void setApplicationWorkflowFlags([app.id], { aiScreened: true })
              .then(() => {
                onToast(`${app.name} marked AI Screened.`);
                return load();
              })
              .catch((e) => onToast(e instanceof Error ? e.message : "Failed."));
          }}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Mark AI Screened
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            void setApplicationWorkflowFlags([app.id], { assessmentStatus: "pending" })
              .then(() => {
                onToast(`Assessment marked pending for ${app.name}.`);
                return load();
              })
              .catch((e) => onToast(e instanceof Error ? e.message : "Failed."));
          }}
        >
          Assessment: Pending
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            void setApplicationWorkflowFlags([app.id], { assessmentStatus: "completed" })
              .then(() => {
                onToast(`Assessment marked completed for ${app.name}.`);
                return load();
              })
              .catch((e) => onToast(e instanceof Error ? e.message : "Failed."));
          }}
        >
          Assessment: Completed
        </DropdownMenuItem>
        {app.stage === "On Hold" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                setMoving(app.id);
                releaseHold(app.id)
                  .then(() => {
                    onToast("Released from hold.");
                    return load();
                  })
                  .catch((e) => onToast(e.message))
                  .finally(() => setMoving(null));
              }}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Release from hold
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const card = (app: LiveApplication) => {
    const checked = selectedIds.includes(app.id);
    return (
      <div
        key={app.id}
        draggable
        onDragStart={(e) => {
          setDraggedId(app.id);
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("text/plain", app.id);
        }}
        onDragEnd={() => {
          setDraggedId(null);
          setDragOverStage(null);
        }}
        className={`workspace-candidate !min-h-0 ${
          draggedId === app.id ? "workspace-candidate--dragging" : ""
        }`}
      >
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            aria-label={`Select ${app.name}`}
            checked={checked}
            onChange={(e) => toggleSelected(app.id, e.target.checked)}
            onClick={(e) => e.stopPropagation()}
            className="mt-1 accent-primary cursor-pointer"
          />
          <Avatar name={app.name} src={app.photo_url} size={32} />
          <button
            type="button"
            onClick={() => open(app.id)}
            className="min-w-0 flex-1 cursor-pointer text-left"
          >
            <p className="truncate text-xs font-semibold">{app.name}</p>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{app.job_title}</p>
          </button>
          <span className="text-muted-foreground/60 pt-1" aria-hidden="true">
            <GripVertical size={13} />
          </span>
          {moveMenu(app)}
        </div>

        <div className="mt-2 flex flex-wrap gap-1">
          {app.is_hired && (
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
              Hired
            </span>
          )}
          {app.ai_screened && (
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
              AI Screened
            </span>
          )}
          {app.assessment_status === "pending" && (
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
              Assessment Pending
            </span>
          )}
          {app.assessment_status === "completed" && (
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              Assessment Done
            </span>
          )}
          {app.skills.slice(0, 2).map((s) => (
            <span key={s} className="workspace-chip !px-2 !py-0.5 !text-[10px]">
              {s}
            </span>
          ))}
        </div>

        {app.assigned_recruiter_name && (
          <p className="mt-1.5 truncate text-[10px] font-medium text-primary/90">
            Recruiter: {app.assigned_recruiter_name}
          </p>
        )}
        {app.recruiter_note && (
          <p className="mt-1 line-clamp-1 text-[10px] italic text-muted-foreground">
            Note: {app.recruiter_note}
          </p>
        )}

        <div className="mt-2 flex items-center justify-between border-t border-border/60 pt-1.5 text-[11px] text-muted-foreground">
          <span>
            {app.experience_years ?? 0} yrs
            {app.match_score != null ? ` · ${Math.round(app.match_score)}% match` : ""}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              title="Add internal note"
              aria-label={`Add note for ${app.name}`}
              onClick={() => setNoteModal({ app, text: app.recruiter_note ?? "" })}
              className="rounded p-1 hover:bg-muted hover:text-foreground cursor-pointer"
            >
              <StickyNote size={12} />
            </button>
            <button
              type="button"
              title="Application history"
              aria-label={`History for ${app.name}`}
              onClick={() => void handleOpenHistory(app)}
              className="rounded p-1 hover:bg-muted hover:text-foreground cursor-pointer"
            >
              <History size={12} />
            </button>
            <span>{relativeTime(app.stage_changed_at)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="employer-workspace space-y-5">
      <PageHeader
        eyebrow="3 · Job Applications Management"
        icon={<Layers size={13} />}
        title="Every Application. Every Candidate. Every Hiring Decision."
        description="Screen, shortlist, compare, assign recruiters, track application history, and hire across every stage."
        actions={
          <div className="flex flex-wrap items-center gap-1.5">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => void handleOpenCompare()}
            >
              <Columns3 className="mr-1.5 h-4 w-4" />
              Compare candidates
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => void handleExportCsv()}
            >
              <FileSpreadsheet className="mr-1.5 h-4 w-4" />
              Export CSV
            </Button>
            <Button
              size="sm"
              variant={mode === "board" ? "default" : "outline"}
              onClick={() => setMode("board")}
            >
              <Kanban className="mr-1.5 h-4 w-4" />
              Board
            </Button>
            <Button
              size="sm"
              variant={mode === "list" ? "default" : "outline"}
              onClick={() => setMode("list")}
            >
              <List className="mr-1.5 h-4 w-4" />
              List
            </Button>
          </div>
        }
      />

      {/* Search Bar Directly Below Heading + Inline Filter Controls Beside Search */}
      <form
        role="search"
        className="workspace-filter-bar !mb-0"
        aria-label="Search and filter applicants"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="workspace-filter-search">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Search applicants"
            type="search"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            className="h-9 pl-9 pr-8 text-xs"
            placeholder="Search candidates by name, role, or skill..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search query"
              onClick={() => setQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <select
          aria-label="Filter by job"
          value={jobFilter}
          onChange={(e) => setParam("job", e.target.value)}
        >
          <option value="">All jobs</option>
          {jobs.map((j) => (
            <option key={j.id} value={j.id}>
              {j.designation}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter by stage"
          value={stageFilter}
          onChange={(e) => setParam("stage", e.target.value)}
        >
          <option value="">All stages</option>
          {APPLICATION_STAGES.map((s) => (
            <option key={s} value={s}>
              {STAGE_LABEL[s]}
            </option>
          ))}
        </select>

        <select
          aria-label="Minimum match"
          value={minMatch}
          onChange={(e) => setMinMatch(Number(e.target.value))}
        >
          <option value={0}>Any match %</option>
          <option value={50}>50%+ match</option>
          <option value={70}>70%+ match</option>
          <option value={85}>85%+ match</option>
        </select>

        <select
          aria-label="Filter by recruiter"
          value={recruiterFilter}
          onChange={(e) => setRecruiterFilter(e.target.value)}
        >
          <option value="">All recruiters</option>
          <option value="__unassigned__">Unassigned</option>
          {recruiters.map((r) => (
            <option key={r.user_id} value={r.user_id}>
              {r.name}
            </option>
          ))}
        </select>

        <select
          aria-label="Sort applicants"
          value={sort}
          onChange={(e) => setSort(e.target.value as "recent" | "match")}
        >
          <option value="recent">Sort: Most recent</option>
          <option value="match">Sort: Best match</option>
        </select>

        {activeFilterCount > 0 && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => {
              setQuery("");
              setMinMatch(0);
              setRecruiterFilter("");
              setBucket("all");
              setSort("recent");
              onNavigate("pipe");
            }}
          >
            <RotateCcw className="mr-1 h-3.5 w-3.5" />
            Reset
          </Button>
        )}
      </form>

      {/* All 11 Application Bucket Tabs (Single-Row Scrollable Tablist) */}
      <div role="tablist" aria-label="Application views" className="workspace-tabs">
        {APPLICATION_BUCKETS.map((b) => (
          <button
            key={b.key}
            type="button"
            role="tab"
            aria-selected={bucket === b.key}
            className="workspace-tab"
            onClick={(e) => {
              setBucket(b.key);
              e.currentTarget.scrollIntoView({ block: "nearest", inline: "nearest" });
            }}
          >
            <span>{b.label}</span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-bold text-foreground">
              {bucketCounts[b.key] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {/* Stage KPI Stat Cards */}
      <div className="workspace-stats !grid-cols-2 sm:!grid-cols-4 xl:!grid-cols-7">
        {stats.map((s) => (
          <button
            key={s.label}
            type="button"
            data-stage-theme={s.theme}
            className={`workspace-stat cursor-pointer ${
              stageFilter === s.stage && s.stage !== "" ? "workspace-stat--active !border-primary" : ""
            }`}
            aria-pressed={stageFilter === s.stage}
            onClick={() => setParam("stage", stageFilter === s.stage ? "" : s.stage)}
          >
            <div className="min-w-0">
              <span>{s.label}</span>
              <strong>{s.count}</strong>
            </div>
          </button>
        ))}
      </div>

      {/* Bulk Operations Bar */}
      {selectedIds.length > 0 && (
        <div
          role="region"
          aria-label="Bulk candidate actions"
          className="flex flex-wrap items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2.5 text-xs"
        >
          <span className="mr-auto font-semibold text-foreground">
            {selectedIds.length} candidate{selectedIds.length === 1 ? "" : "s"} selected
          </span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={bulkBusy}
            onClick={() => void handleBulkStage("Shortlisted", "Bulk Shortlist")}
          >
            <CheckCheck className="mr-1.5 h-3.5 w-3.5" />
            Bulk Shortlist
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={bulkBusy}
            onClick={() => void handleBulkStage("Rejected", "Bulk Reject")}
          >
            <XCircle className="mr-1.5 h-3.5 w-3.5" />
            Bulk Reject
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={bulkBusy}
            onClick={() => void handleBulkStage("Hired", "Mark Hired")}
          >
            <Award className="mr-1.5 h-3.5 w-3.5" />
            Mark Hired
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={bulkBusy}
            onClick={() =>
              setAssignModal({ ids: selectedIds, recruiterId: "", customName: "" })
            }
          >
            <UserCheck className="mr-1.5 h-3.5 w-3.5" />
            Assign Recruiter
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              handleDownloadResumes(listItems.filter((a) => selectedIds.includes(a.id)))
            }
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Download Resumes
          </Button>
          {selectedIds.length >= 2 && (
            <Button type="button" size="sm" onClick={() => void handleOpenCompare()}>
              <Columns3 className="mr-1.5 h-3.5 w-3.5" />
              Compare selected ({Math.min(4, selectedIds.length)})
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setSelectedIds([])}
          >
            Clear
          </Button>
        </div>
      )}

      {loading ? (
        <Loading label="Loading applications" />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : total === 0 && !query && !jobFilter && bucket === "all" ? (
        <div className="workspace-panel">
          <EmptyState
            icon={<Users />}
            title="No applications yet"
            hint="When candidates apply to your active jobs they will appear here."
            action={<Button onClick={() => onNavigate("post")}>View jobs</Button>}
          />
        </div>
      ) : mode === "board" ? (
        <div
          className="workspace-board !grid-cols-[repeat(6,minmax(230px,1fr))]"
          aria-label="Candidate pipeline"
        >
          {APPLICATION_STAGES.map((stage) => {
            const items = listItems.filter((a) => a.stage === stage);
            const isDragOver = dragOverStage === stage;
            const isFocused = stageFilter === stage;
            return (
              <section
                key={stage}
                data-stage-theme={stage}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  if (dragOverStage !== stage) setDragOverStage(stage);
                }}
                onDragLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setDragOverStage((prev) => (prev === stage ? null : prev));
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOverStage(null);
                  const id = draggedId || e.dataTransfer.getData("text/plain");
                  setDraggedId(null);
                  const targetApp = listItems.find((item) => item.id === id);
                  if (targetApp && targetApp.stage !== stage) {
                    void move(targetApp, stage);
                  }
                }}
                className={`workspace-column ${isFocused ? "workspace-column--focused" : ""} ${
                  isDragOver ? "workspace-column--drag-over" : ""
                }`}
                aria-label={`${STAGE_LABEL[stage]} column`}
              >
                <div className="workspace-column-header">
                  <div className="min-w-0 flex-1">
                    <h2 className="workspace-column-title">{STAGE_LABEL[stage]}</h2>
                  </div>
                  <span className="workspace-column-count">
                    {bucket === "all" ? (counts[stage] ?? items.length) : items.length}
                  </span>
                </div>
                <div className="workspace-column-cards">
                  {items.length === 0 ? (
                    <p className="mt-6 text-center text-[11px] text-muted-foreground">
                      No candidates
                    </p>
                  ) : (
                    items.map(card)
                  )}
                </div>
              </section>
            );
          })}
        </div>
      ) : listItems.length === 0 ? (
        <div className="workspace-panel">
          <EmptyState
            icon={<Search />}
            title="No applicants match"
            hint="Try a different bucket, search, job, or status."
          />
        </div>
      ) : (
        <div className="workspace-panel !p-0 overflow-hidden">
          <div tabIndex={0} role="region" aria-label="Applications table" className="workspace-table-scroll">
            <table className="w-full min-w-[860px] text-left text-xs">
              <thead className="border-b border-border bg-card text-[11px] uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th scope="col" className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      aria-label="Select all visible candidates"
                      checked={listItems.length > 0 && listItems.every((a) => selectedIds.includes(a.id))}
                      onChange={(e) =>
                        setSelectedIds(e.target.checked ? listItems.map((a) => a.id) : [])
                      }
                      className="accent-primary"
                    />
                  </th>
                  <th scope="col" className="px-3 py-3">Candidate</th>
                  <th scope="col" className="px-3 py-3">Job</th>
                  <th scope="col" className="px-3 py-3">Status</th>
                  <th scope="col" className="px-3 py-3">Match</th>
                  <th scope="col" className="px-3 py-3">Recruiter</th>
                  <th scope="col" className="px-3 py-3">Applied</th>
                  <th scope="col" className="px-3 py-3 text-right">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {listItems.map((a) => (
                  <tr
                    key={a.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        aria-label={`Select ${a.name}`}
                        checked={selectedIds.includes(a.id)}
                        onChange={(e) => toggleSelected(a.id, e.target.checked)}
                        className="accent-primary"
                      />
                    </td>
                    <th scope="row" className="px-3 py-3 font-normal text-left">
                      <button
                        type="button"
                        className="flex cursor-pointer items-center gap-3 text-left"
                        onClick={() => open(a.id)}
                      >
                        <Avatar name={a.name} src={a.photo_url} size={32} />
                        <span>
                          <span className="block font-semibold text-foreground">{a.name}</span>
                          <span className="block text-[11px] text-muted-foreground">
                            {a.headline || `${a.experience_years ?? 0} yrs experience`}
                          </span>
                        </span>
                      </button>
                    </th>
                    <td className="px-3 py-3">{a.job_title}</td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap items-center gap-1">
                        <StageBadge stage={a.is_hired ? "Hired" : a.stage} />
                        {a.assessment_status && a.assessment_status !== "none" && (
                          <span className="workspace-chip !px-2 !py-0.5 !text-[10px] capitalize">
                            Assessment: {a.assessment_status}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 font-semibold">
                      {a.match_score != null ? `${Math.round(a.match_score)}%` : "—"}
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {a.assigned_recruiter_name || "Unassigned"}
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {relativeTime(a.applied_at)}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => setNoteModal({ app: a, text: a.recruiter_note ?? "" })}
                        >
                          <StickyNote className="mr-1 h-3.5 w-3.5" />
                          Note
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => void handleOpenHistory(a)}
                        >
                          <History className="mr-1 h-3.5 w-3.5" />
                          History
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => open(a.id)}>
                          Open
                          <ArrowRight className="ml-1 h-3.5 w-3.5" />
                        </Button>
                        {moveMenu(a)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Internal Note Modal */}
      <Dialog open={Boolean(noteModal)} onOpenChange={(o) => { if (!o) setNoteModal(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Internal Recruiter Note</DialogTitle>
            <DialogDescription>
              Private hiring note for {noteModal?.app.name}. Candidates never see internal notes.
            </DialogDescription>
          </DialogHeader>
          {noteModal && (
            <div className="space-y-4">
              <label className="workspace-field">
                <span>Internal note</span>
                <Textarea
                  rows={4}
                  placeholder="Add screening observations, compensation expectations, or panel notes..."
                  value={noteModal.text}
                  onChange={(e) => setNoteModal({ ...noteModal, text: e.target.value })}
                />
              </label>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setNoteModal(null)}>
                  Cancel
                </Button>
                <Button type="button" disabled={bulkBusy} onClick={() => void handleSaveNote()}>
                  Save note
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Assign Recruiter Modal */}
      <Dialog open={Boolean(assignModal)} onOpenChange={(o) => { if (!o) setAssignModal(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Recruiter</DialogTitle>
            <DialogDescription>
              Assign {assignModal?.ids.length ?? 0} application(s) to a team recruiter for ownership.
            </DialogDescription>
          </DialogHeader>
          {assignModal && (
            <div className="space-y-4">
              {recruiters.length > 0 && (
                <label className="workspace-field">
                  <span>Select team member</span>
                  <select
                    aria-label="Team member"
                    value={assignModal.recruiterId}
                    onChange={(e) =>
                      setAssignModal({ ...assignModal, recruiterId: e.target.value, customName: "" })
                    }
                    className="h-9 rounded-md border border-border bg-card px-3 text-xs"
                  >
                    <option value="">Choose a team recruiter…</option>
                    {recruiters.map((r) => (
                      <option key={r.user_id} value={r.user_id}>
                        {r.name} ({r.role})
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <label className="workspace-field">
                <span>Or enter recruiter name</span>
                <Input
                  placeholder="e.g. Ananya Rao"
                  value={assignModal.customName}
                  onChange={(e) => setAssignModal({ ...assignModal, customName: e.target.value })}
                />
              </label>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setAssignModal(null)}>
                  Cancel
                </Button>
                <Button type="button" disabled={bulkBusy} onClick={() => void handleSaveRecruiter()}>
                  Save assignment
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Application History Modal */}
      <Dialog open={Boolean(historyModal)} onOpenChange={(o) => { if (!o) setHistoryModal(null); }}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Application History · {historyModal?.app.name}</DialogTitle>
            <DialogDescription>{historyModal?.app.job_title}</DialogDescription>
          </DialogHeader>
          {historyModal?.loading ? (
            <Loading label="Loading timeline" />
          ) : historyModal ? (
            <div className="space-y-3 text-xs">
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <p className="font-semibold text-foreground">
                  Current Status: {historyModal.app.is_hired ? "Hired" : (STAGE_LABEL[historyModal.app.stage] ?? historyModal.app.stage)}
                </p>
                <p className="mt-0.5 text-muted-foreground">
                  Applied {fmtDateTime(historyModal.app.applied_at)} · Assigned to {historyModal.app.assigned_recruiter_name || "Unassigned"}
                </p>
              </div>
              {historyModal.detail?.history && historyModal.detail.history.length > 0 ? (
                <ol className="space-y-2.5 border-l-2 border-primary/30 pl-4">
                  {historyModal.detail.history.map((h) => (
                    <li key={h.id} className="space-y-0.5">
                      <p className="font-semibold text-foreground">
                        {h.from ? `${STAGE_LABEL[h.from] ?? h.from} → ` : ""}
                        {h.to ? (STAGE_LABEL[h.to] ?? h.to) : "Update"}
                      </p>
                      {h.message && <p className="text-muted-foreground">{h.message}</p>}
                      <p className="text-[10px] text-muted-foreground">{fmtDateTime(h.at)}</p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-muted-foreground">
                  Application submitted {fmtDateTime(historyModal.app.applied_at)}. No subsequent stage changes recorded yet.
                </p>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Side-by-Side Candidate Comparison Modal */}
      <Dialog open={Boolean(compareModal)} onOpenChange={(o) => { if (!o) setCompareModal(null); }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Candidate Comparison</DialogTitle>
            <DialogDescription>
              Side-by-side comparison of match scores, readiness, experience, skills, and hiring stages.
            </DialogDescription>
          </DialogHeader>
          {compareModal?.loading ? (
            <Loading label="Building comparison" />
          ) : compareModal && compareModal.items.length > 0 ? (
            <div tabIndex={0} role="region" aria-label="Candidate comparison table" className="workspace-table-scroll">
              <table className="w-full min-w-[640px] text-left text-xs">
                <thead className="border-b border-border bg-muted/30">
                  <tr>
                    <th scope="col" className="px-3 py-2.5 font-semibold text-muted-foreground">Dimension</th>
                    {compareModal.items.map((c) => (
                      <th key={c.id} scope="col" className="px-3 py-2.5 font-bold text-foreground">
                        <div>{c.name}</div>
                        <div className="text-[11px] font-normal text-muted-foreground">{c.job_title}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <th scope="row" className="px-3 py-2.5 font-semibold text-muted-foreground">AI Job Match</th>
                    {compareModal.items.map((c) => (
                      <td key={c.id} className="px-3 py-2.5 font-bold text-primary">
                        {c.match_score != null ? `${Math.round(c.match_score)}%` : "—"}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row" className="px-3 py-2.5 font-semibold text-muted-foreground">Industry Readiness / CIR</th>
                    {compareModal.items.map((c) => (
                      <td key={c.id} className="px-3 py-2.5 font-semibold">
                        {c.readiness_score != null ? `${Math.round(c.readiness_score)} / 100` : "—"}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row" className="px-3 py-2.5 font-semibold text-muted-foreground">Experience</th>
                    {compareModal.items.map((c) => (
                      <td key={c.id} className="px-3 py-2.5">{c.experience_years ?? 0} yrs</td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row" className="px-3 py-2.5 font-semibold text-muted-foreground">Stage & Assessment</th>
                    {compareModal.items.map((c) => (
                      <td key={c.id} className="px-3 py-2.5">
                        <StageBadge stage={c.is_hired ? "Hired" : c.stage} />
                        <span className="ml-1.5 text-[11px] text-muted-foreground capitalize">
                          ({c.assessment_status})
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row" className="px-3 py-2.5 font-semibold text-muted-foreground">Key Skills</th>
                    {compareModal.items.map((c) => (
                      <td key={c.id} className="px-3 py-2.5">
                        <div className="flex flex-wrap gap-1">
                          {(c.skills ?? []).slice(0, 5).map((s) => (
                            <span key={s} className="workspace-chip !px-2 !py-0.5 !text-[10px]">{s}</span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row" className="px-3 py-2.5 font-semibold text-muted-foreground">Assigned Recruiter</th>
                    {compareModal.items.map((c) => (
                      <td key={c.id} className="px-3 py-2.5">{c.assigned_recruiter_name || "Unassigned"}</td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row" className="px-3 py-2.5 font-semibold text-muted-foreground">Internal Note</th>
                    {compareModal.items.map((c) => (
                      <td key={c.id} className="px-3 py-2.5 text-muted-foreground">{c.recruiter_note || "—"}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
