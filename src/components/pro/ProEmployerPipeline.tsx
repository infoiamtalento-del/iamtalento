import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Award,
  CalendarDays,
  CheckCheck,
  CheckCircle2,
  Clock,
  Columns3,
  Download,
  FileSpreadsheet,
  FileText,
  GripVertical,
  History,
  Kanban,
  Layers,
  List,
  MapPin,
  PauseCircle,
  RotateCcw,
  Search,
  Sparkles,
  StickyNote,
  UserCheck,
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
  CANDIDATES_SEED,
  EMPLOYER_STAGES,
  calcScore,
  timeAgo,
  type ProApplication,
  type ProJob,
  type ProUser,
} from "@/data/proData";
import {
  APPLICATION_BUCKETS,
  applicationsToCsv,
  triggerTextDownload,
  type ApplicationBucket,
  type ExportedApplicationRow,
} from "@/services/employer/ats";
import { getCandidatePhoto } from "@/data/portalAssets";
import type { ProDrawerState, ProView } from "./proTypes";
import "./employer-workspace.css";

interface Props {
  user: ProUser;
  jobs: ProJob[];
  applications: ProApplication[];
  onOpenDrawer: (drawer: ProDrawerState) => void;
  onBulkUpdateStage: (ids: number[], stage: string) => void;
  onBulkSendReview: (ids: number[]) => void;
  onUpdateApplications?: (ids: number[], patch: Partial<ProApplication>, logMessage?: string) => void;
  onNavigate?: (view: ProView, query?: Record<string, string>) => void;
  onToast?: (message: string) => void;
}

const DEMO_RECRUITERS = ["Ananya Rao", "Vikram Joshi", "Meera Krishnan", "Rohan Kulkarni"];

const STAGE_META: Record<
  string,
  { subtitle: string; icon: typeof FileText; emptyHint: string }
> = {
  Applied: {
    subtitle: "Application received",
    icon: FileText,
    emptyHint: "Drop a candidate here to move to Applied",
  },
  Shortlisted: {
    subtitle: "Met initial requirements",
    icon: CheckCircle2,
    emptyHint: "Drop a candidate here to shortlist",
  },
  Interview: {
    subtitle: "Scheduled / in progress",
    icon: CalendarDays,
    emptyHint: "Drop a candidate here for interviews",
  },
  "On Hold": {
    subtitle: "Paused for review",
    icon: PauseCircle,
    emptyHint: "Drop a candidate here to place on hold",
  },
  Offer: {
    subtitle: "Offer prepared / released",
    icon: Sparkles,
    emptyHint: "Drop a candidate here for offer stage",
  },
  Rejected: {
    subtitle: "Didn't move forward",
    icon: XCircle,
    emptyHint: "Drop a candidate here to mark rejected",
  },
};

function matchesDemoBucket(a: ProApplication, bucket: ApplicationBucket): boolean {
  const hasScores = Object.keys(a.as || {}).length > 0;
  switch (bucket) {
    case "all":
      return true;
    case "new":
      return a.st === "Applied";
    case "ai_screened":
      return a.aiScreened !== false;
    case "shortlisted":
      return a.st === "Shortlisted";
    case "rejected":
      return a.st === "Rejected";
    case "on_hold":
      return a.st === "On Hold";
    case "interview_scheduled":
      return a.st === "Interview" || Boolean(a.iv);
    case "assessment_pending":
      return a.assessmentStatus === "pending";
    case "assessment_completed":
      return a.assessmentStatus === "completed" || (a.assessmentStatus == null && hasScores);
    case "offer_released":
      return (a.st === "Offer" || Boolean(a.offerReleased)) && !a.hired;
    case "hired":
      return Boolean(a.hired);
    default:
      return true;
  }
}

function avgAssessmentScore(a: ProApplication): number | null {
  const vals = Object.values(a.as || {});
  if (!vals.length) return null;
  return Math.round(vals.reduce((s, v) => s + v, 0) / vals.length);
}

export function ProEmployerPipeline({
  user,
  jobs,
  applications,
  onOpenDrawer,
  onBulkUpdateStage,
  onBulkSendReview,
  onUpdateApplications,
  onToast,
}: Props) {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<"board" | "list">("board");
  const [bucket, setBucket] = useState<ApplicationBucket>(
    () => (searchParams.get("bucket") as ApplicationBucket) || "all"
  );
  const [jobFilter, setJobFilter] = useState(() => searchParams.get("job") ?? "");
  const [query, setQuery] = useState("");
  const [min, setMin] = useState(0);
  const [recruiterFilter, setRecruiterFilter] = useState("");
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [stageFilter, setStageFilter] = useState("");
  const [focusedStage, setFocusedStage] = useState<string>(() => searchParams.get("stage") ?? "");
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);

  // Local patch fallback when rendered outside TalentoPro
  const [localPatches, setLocalPatches] = useState<Record<number, Partial<ProApplication>>>({});
  const [noteModal, setNoteModal] = useState<{ app: ProApplication; text: string } | null>(null);
  const [assignModal, setAssignModal] = useState<{ ids: number[]; recruiter: string } | null>(null);
  const [historyModal, setHistoryModal] = useState<ProApplication | null>(null);
  const [compareOpen, setCompareOpen] = useState(false);

  const columnRefs = useRef<Record<string, HTMLElement | null>>({});
  const notify = (msg: string) => onToast?.(msg);

  useEffect(() => {
    const paramJob = searchParams.get("job");
    const paramStage = searchParams.get("stage");
    if (paramJob !== null) setJobFilter(paramJob);
    if (paramStage) {
      setFocusedStage(paramStage);
      const col = columnRefs.current[paramStage];
      if (col && typeof col.scrollIntoView === "function") {
        col.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  }, [searchParams]);

  const myJobs = jobs.filter((j) => j.by === user.email);
  const apps = useMemo(
    () =>
      applications
        .filter((a) => myJobs.some((j) => j.id === a.jid))
        .map((a) => (localPatches[a.id] ? { ...a, ...localPatches[a.id] } : a)),
    [applications, myJobs, localPatches]
  );

  const patchApps = (ids: number[], patch: Partial<ProApplication>, logMessage?: string) => {
    if (onUpdateApplications) {
      onUpdateApplications(ids, patch, logMessage);
    } else {
      setLocalPatches((prev) => {
        const next = { ...prev };
        for (const id of ids) {
          const orig = apps.find((a) => a.id === id);
          next[id] = {
            ...(next[id] ?? {}),
            ...patch,
            upd: logMessage
              ? [...(orig?.upd ?? []), { msg: logMessage, at: Date.now() }]
              : orig?.upd,
          };
        }
        return next;
      });
    }
  };

  const bucketCounts = useMemo(() => {
    const map = {} as Record<ApplicationBucket, number>;
    for (const b of APPLICATION_BUCKETS) {
      map[b.key] = apps.filter((a) => matchesDemoBucket(a, b.key)).length;
    }
    return map;
  }, [apps]);

  const knownRecruiters = useMemo(() => {
    const set = new Set<string>(DEMO_RECRUITERS);
    for (const a of apps) if (a.recruiter) set.add(a.recruiter);
    return [...set];
  }, [apps]);

  const baseFiltered = apps.filter((a) => {
    const job = myJobs.find((j) => j.id === a.jid);
    if (!job) return false;
    if (!matchesDemoBucket(a, bucket)) return false;
    const matchesJob = !jobFilter || String(a.jid) === jobFilter;
    const matchesQuery = `${a.name} ${job.t} ${a.sk.join(" ")} ${job.l} ${a.recruiter ?? ""}`
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesMin = calcScore(job, a) >= min;
    const matchesRecruiter =
      !recruiterFilter ||
      (recruiterFilter === "__unassigned__" ? !a.recruiter : a.recruiter === recruiterFilter);
    const matchesPendingUpdate = !needsUpdate || (!a.upd?.length && a.st !== "Rejected");
    return matchesJob && matchesQuery && matchesMin && matchesRecruiter && matchesPendingUpdate;
  });

  const listFiltered = baseFiltered.filter((a) => !stageFilter || a.st === stageFilter);

  const activeFilterCount =
    (jobFilter ? 1 : 0) +
    (query.trim() ? 1 : 0) +
    (min > 0 ? 1 : 0) +
    (recruiterFilter ? 1 : 0) +
    (needsUpdate ? 1 : 0) +
    (bucket !== "all" ? 1 : 0) +
    (stageFilter ? 1 : 0);

  const resetAllFilters = () => {
    setQuery("");
    setJobFilter("");
    setStageFilter("");
    setFocusedStage("");
    setBucket("all");
    setMin(0);
    setRecruiterFilter("");
    setNeedsUpdate(false);
  };

  const toggleSelected = (id: number, checked: boolean) => {
    setSelected((cur) => (checked ? [...new Set([...cur, id])] : cur.filter((x) => x !== id)));
  };

  const handleDownloadResumes = (targets: ProApplication[]) => {
    if (!targets.length) {
      notify("Select at least one candidate to download resumes.");
      return;
    }
    const content = targets
      .map((a, i) => {
        const job = myJobs.find((j) => j.id === a.jid);
        const match = job ? calcScore(job, a) : 0;
        const cir = avgAssessmentScore(a);
        return (
          `#${i + 1} ${a.name} (${a.who})\n` +
          `Applied Role: ${job?.t ?? "Role"} | Stage: ${a.hired ? "Hired" : a.st}\n` +
          `AI Job Match: ${match}% | Industry Readiness Score: ${cir ?? "—"}%\n` +
          `Experience: ${a.exp} yrs | Skills: ${(a.sk || []).join(", ")}\n` +
          `Certifications: ${(a.ce || []).join(", ") || "None"}\n` +
          `Assigned Recruiter: ${a.recruiter || "Unassigned"}\n` +
          `Internal Note: ${a.note || "None"}\n`
        );
      })
      .join("\n------------------------------------------------------------\n\n");
    triggerTextDownload(
      targets.length === 1
        ? `${targets[0].name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-resume.txt`
        : `candidate-resumes-${targets.length}.txt`,
      content,
      "text/plain;charset=utf-8"
    );
    notify(`Downloaded resume summary for ${targets.length} candidate(s).`);
  };

  const handleExportCsv = () => {
    const source = selected.length > 0 ? apps.filter((a) => selected.includes(a.id)) : baseFiltered;
    const rows: ExportedApplicationRow[] = source.map((a) => {
      const job = myJobs.find((j) => j.id === a.jid);
      const candidate = CANDIDATES_SEED.find((c) => c.n === a.name);
      return {
        application_id: String(a.id),
        candidate_name: a.name,
        talent_cir_id: `IAT-${a.id}`,
        email: a.who,
        city: candidate?.c ?? job?.l ?? null,
        job_title: job?.t ?? "",
        stage: a.st,
        hiring_status: a.hired
          ? "Hired"
          : a.st === "Offer" || Boolean(a.offerReleased)
            ? "Offer Released"
            : a.st,
        ai_screened: a.aiScreened !== false,
        assessment_status: a.assessmentStatus ?? "none",
        match_score: job ? calcScore(job, a) : 0,
        experience_years: a.exp,
        skills: (a.sk || []).join("; "),
        assigned_recruiter: a.recruiter ?? null,
        recruiter_note: a.note ?? null,
        applied_at: new Date(a.at).toISOString(),
      };
    });
    const csv = applicationsToCsv(rows);
    triggerTextDownload(`applications-export-${new Date().toISOString().slice(0, 10)}.csv`, csv);
    notify(`Exported ${rows.length} application record(s) to CSV.`);
  };

  const compareTargets = useMemo(() => {
    if (selected.length >= 2) {
      return apps.filter((a) => selected.includes(a.id)).slice(0, 4);
    }
    return baseFiltered.slice(0, Math.min(3, baseFiltered.length));
  }, [selected, apps, baseFiltered]);

  const stats = [
    { label: "Total Candidates", count: apps.length, icon: Users, stage: "", theme: "all" },
    {
      label: "New Applications",
      count: apps.filter((a) => a.st === "Applied").length,
      icon: Search,
      stage: "Applied",
      theme: "Applied",
    },
    {
      label: "Shortlisted",
      count: apps.filter((a) => a.st === "Shortlisted").length,
      icon: CheckCircle2,
      stage: "Shortlisted",
      theme: "Shortlisted",
    },
    {
      label: "Interview Scheduled",
      count: apps.filter((a) => a.st === "Interview").length,
      icon: CalendarDays,
      stage: "Interview",
      theme: "Interview",
    },
    {
      label: "Offers & Hired",
      count: apps.filter((a) => a.st === "Offer" || a.hired).length,
      icon: FileText,
      stage: "Offer",
      theme: "Offer",
    },
  ];

  const handleStatClick = (stage: string) => {
    if (mode === "list") {
      setStageFilter((prev) => (prev === stage ? "" : stage));
      return;
    }
    if (!stage) {
      setFocusedStage("");
      setStageFilter("");
      return;
    }
    const nextFocus = focusedStage === stage ? "" : stage;
    setFocusedStage(nextFocus);
    if (nextFocus) {
      const col = columnRefs.current[nextFocus];
      if (col && typeof col.scrollIntoView === "function") {
        col.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, appId: number) => {
    setDraggedId(appId);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(appId));
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverStage(null);
  };

  const handleDropOnStage = (event: React.DragEvent<HTMLElement>, targetStage: string) => {
    event.preventDefault();
    setDragOverStage(null);
    const rawId = event.dataTransfer.getData("text/plain");
    const appId = draggedId ?? (rawId ? Number(rawId) : null);
    setDraggedId(null);
    if (!appId) return;
    const currentApp = apps.find((a) => a.id === appId);
    if (!currentApp || currentApp.st === targetStage) return;
    onBulkUpdateStage([appId], targetStage);
  };

  const renderCard = (app: ProApplication) => {
    const job = myJobs.find((j) => j.id === app.jid);
    const candidate = CANDIDATES_SEED.find((c) => c.n === app.name);
    const score = job ? calcScore(job, app) : 0;
    const isDragging = draggedId === app.id;
    const isSelected = selected.includes(app.id);

    return (
      <div
        key={app.id}
        role="button"
        tabIndex={0}
        draggable
        aria-label={`${app.name}, ${job?.t || "Candidate"}, ${score}% match. Drag to another stage or click to review.`}
        onDragStart={(e) => handleDragStart(e, app.id)}
        onDragEnd={handleDragEnd}
        onClick={() => onOpenDrawer({ type: "applicant", id: app.id })}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpenDrawer({ type: "applicant", id: app.id });
          }
        }}
        className={`workspace-candidate ${isDragging ? "workspace-candidate--dragging" : ""}`}
      >
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            aria-label={`Select ${app.name}`}
            checked={isSelected}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            onChange={(e) => toggleSelected(app.id, e.target.checked)}
            className="mt-1 accent-primary cursor-pointer"
          />
          <img src={getCandidatePhoto(app.name)} alt={app.name} />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-1">
              <p className="text-xs font-bold leading-snug text-foreground break-words">
                {app.name}
              </p>
              <span
                className="text-muted-foreground/60 hover:text-foreground shrink-0 pt-0.5"
                title="Drag card to move between stages"
                aria-hidden="true"
              >
                <GripVertical size={13} />
              </span>
            </div>
            <p className="mt-0.5 text-[11px] font-medium leading-4 text-muted-foreground truncate">
              {job?.t}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-1">
              <span className="workspace-candidate-match">{score}% match</span>
              {app.hired && (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  Hired
                </span>
              )}
              {(app.sk || []).slice(0, 2).map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center rounded-md border border-border/70 bg-muted/50 px-1.5 py-0.5 text-[10px] font-medium text-foreground/80"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <CalendarDays size={11} />
            {app.exp} yrs
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={11} />
            {candidate?.c || job?.l}
          </span>
          {app.recruiter && (
            <span className="font-semibold text-primary">Owner: {app.recruiter}</span>
          )}
        </div>

        {app.note && (
          <p className="mt-1.5 line-clamp-1 text-[10px] italic text-muted-foreground">
            Note: {app.note}
          </p>
        )}

        <div
          className="mt-2.5 flex items-center justify-between gap-1.5 border-t border-border/60 pt-2"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label={`Add note for ${app.name}`}
              title="Add internal note"
              onClick={() => setNoteModal({ app, text: app.note ?? "" })}
              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
            >
              <StickyNote size={12} />
            </button>
            <button
              type="button"
              aria-label={`History for ${app.name}`}
              title="Application history"
              onClick={() => setHistoryModal(app)}
              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
            >
              <History size={12} />
            </button>
            <button
              type="button"
              aria-label={`Download resume for ${app.name}`}
              title="Download resume"
              onClick={() => handleDownloadResumes([app])}
              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
            >
              <Download size={12} />
            </button>
          </div>
          <select
            aria-label={`Move ${app.name} to stage`}
            value={app.hired ? "Hired" : app.st}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "Hired") {
                patchApps([app.id], { st: "Offer", offerReleased: true, hired: true, hiredAt: Date.now() }, "Candidate marked as Hired.");
                onBulkUpdateStage([app.id], "Hired");
              } else if (val !== app.st) {
                patchApps([app.id], { st: val as ProApplication["st"], hired: false });
                onBulkUpdateStage([app.id], val);
              }
            }}
            className="!h-6 !w-auto !rounded-md !border-border/80 !bg-muted/40 !px-1.5 !py-0 !text-[10px] font-semibold cursor-pointer"
          >
            {EMPLOYER_STAGES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
            <option value="Hired">Hired</option>
          </select>
        </div>
      </div>
    );
  };

  return (
    <div className="employer-workspace space-y-5">
      <header className="workspace-header">
        <div>
          <span className="workspace-eyebrow">
            <Layers size={14} />
            3 · Job Applications Management
          </span>
          <h1 className="workspace-heading">
            Every Application. Every Candidate. Every Hiring Decision.
          </h1>
          <p className="workspace-description">
            Screen, filter, bulk shortlist, compare candidates side by side, assign recruiters, and manage every hiring decision.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={compareTargets.length < 2}
            onClick={() => setCompareOpen(true)}
          >
            <Columns3 className="mr-1.5 h-4 w-4" />
            Compare{selected.length >= 2 ? ` (${Math.min(4, selected.length)})` : ""}
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={handleExportCsv}>
            <FileSpreadsheet className="mr-1.5 h-4 w-4" />
            Export CSV
          </Button>
          <Button
            size="sm"
            variant={mode === "board" ? "default" : "outline"}
            onClick={() => setMode("board")}
          >
            <Kanban />
            Board
          </Button>
          <Button
            size="sm"
            variant={mode === "list" ? "default" : "outline"}
            onClick={() => setMode("list")}
          >
            <List />
            List
          </Button>
        </div>
      </header>

      {/* Search Bar Directly Below Heading + Inline Filter Controls Beside Search */}
      <form
        role="search"
        className="workspace-filter-bar !mb-0"
        aria-label="Search and filter candidates"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="workspace-filter-search">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Search candidates"
            type="search"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            className="h-9 pl-9 pr-8 text-xs"
            placeholder="Search candidates by name, role, skills, or recruiter..."
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
          onChange={(e) => setJobFilter(e.target.value)}
        >
          <option value="">All Jobs ({myJobs.length})</option>
          {myJobs.map((j) => (
            <option key={j.id} value={j.id}>
              {j.t}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter by stage"
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
        >
          <option value="">All Stages ({apps.length})</option>
          {EMPLOYER_STAGES.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>

        <select
          aria-label="Minimum match"
          value={min}
          onChange={(e) => setMin(Number(e.target.value))}
        >
          <option value={0}>Any Match</option>
          <option value={50}>50%+ Match</option>
          <option value={70}>70%+ Match</option>
          <option value={85}>85%+ Match</option>
        </select>

        <select
          aria-label="Filter by recruiter"
          value={recruiterFilter}
          onChange={(e) => setRecruiterFilter(e.target.value)}
        >
          <option value="">All Recruiters</option>
          <option value="__unassigned__">Unassigned</option>
          {knownRecruiters.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <Button
          type="button"
          size="sm"
          variant={needsUpdate ? "default" : "outline"}
          aria-pressed={needsUpdate}
          onClick={() => setNeedsUpdate((prev) => !prev)}
          className="h-9 text-xs"
        >
          Needs update
        </Button>

        {(activeFilterCount > 0 || focusedStage) && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={resetAllFilters}
            className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="mr-1 h-3.5 w-3.5" />
            Reset
          </Button>
        )}
      </form>

      {/* All 11 Application Bucket Tabs */}
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

      {/* Stage Summary Cards */}
      <div className="workspace-stats !mb-0">
        {stats.map(({ label, count, icon: Icon, stage, theme }) => {
          const isActive =
            mode === "list"
              ? stageFilter === stage && stage !== ""
              : focusedStage === stage && stage !== "";
          return (
            <Button
              variant="ghost"
              data-stage-theme={theme}
              className={`workspace-stat ${isActive ? "workspace-stat--active" : ""}`}
              key={label}
              onClick={() => handleStatClick(stage)}
            >
              <div className="workspace-icon">
                <Icon size={22} />
              </div>
              <div>
                <span>{label}</span>
                <strong>{count}</strong>
              </div>
            </Button>
          );
        })}
      </div>

      {/* Bulk Action Bar (Visible whenever candidates are selected in Board or List) */}
      {selected.length > 0 && (
        <div
          role="region"
          aria-label="Bulk candidate actions"
          className="flex flex-wrap items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2.5 text-xs"
        >
          <span className="mr-auto font-semibold text-foreground">
            {selected.length} candidate{selected.length === 1 ? "" : "s"} selected
          </span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              patchApps(selected, { st: "Shortlisted" }, "Bulk shortlisted.");
              onBulkUpdateStage(selected, "Shortlisted");
              setSelected([]);
            }}
          >
            <CheckCheck className="mr-1.5 h-3.5 w-3.5" />
            Bulk Shortlist
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              patchApps(selected, { st: "Rejected", hired: false }, "Bulk rejected.");
              onBulkUpdateStage(selected, "Rejected");
              setSelected([]);
            }}
          >
            <XCircle className="mr-1.5 h-3.5 w-3.5" />
            Bulk Reject
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              patchApps(selected, { st: "Offer", offerReleased: true, hired: true, hiredAt: Date.now() }, "Marked as Hired.");
              onBulkUpdateStage(selected, "Hired");
              setSelected([]);
            }}
          >
            <Award className="mr-1.5 h-3.5 w-3.5" />
            Mark Hired
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setAssignModal({ ids: selected, recruiter: DEMO_RECRUITERS[0] })}
          >
            <UserCheck className="mr-1.5 h-3.5 w-3.5" />
            Assign Recruiter
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => handleDownloadResumes(apps.filter((a) => selected.includes(a.id)))}
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Download Resumes
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              onBulkSendReview(selected);
              setSelected([]);
            }}
          >
            Send review update
          </Button>
          {selected.length >= 2 && (
            <Button type="button" size="sm" onClick={() => setCompareOpen(true)}>
              <Columns3 className="mr-1.5 h-3.5 w-3.5" />
              Compare ({Math.min(4, selected.length)})
            </Button>
          )}
          <Button type="button" size="sm" variant="ghost" onClick={() => setSelected([])}>
            Clear
          </Button>
        </div>
      )}

      {mode === "board" ? (
        <div className="workspace-board !grid-cols-[repeat(6,minmax(235px,1fr))]" aria-label="Candidate pipeline">
          {EMPLOYER_STAGES.map((stage) => {
            const items = baseFiltered.filter(
              (a) => a.st === stage && (!stageFilter || a.st === stageFilter)
            );
            const meta = STAGE_META[stage] || STAGE_META.Applied;
            const Icon = meta.icon;
            const isDragOver = dragOverStage === stage;
            const isFocused = focusedStage === stage;

            return (
              <section
                ref={(el) => {
                  columnRefs.current[stage] = el;
                }}
                data-stage-theme={stage}
                aria-label={`${stage} column`}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  if (dragOverStage !== stage) setDragOverStage(stage);
                }}
                onDragEnter={(e) => {
                  e.preventDefault();
                  setDragOverStage(stage);
                }}
                onDragLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setDragOverStage((prev) => (prev === stage ? null : prev));
                  }
                }}
                onDrop={(e) => handleDropOnStage(e, stage)}
                className={`workspace-column ${isFocused ? "workspace-column--focused" : ""} ${
                  isDragOver ? "workspace-column--drag-over" : ""
                }`}
                key={stage}
              >
                <div className="workspace-column-header">
                  <span className="workspace-icon">
                    <Icon size={17} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="workspace-column-title">{stage}</h2>
                    <p className="workspace-column-subtitle">{meta.subtitle}</p>
                  </div>
                  <span className="workspace-column-count">{items.length}</span>
                </div>

                <div className="workspace-column-cards" role="region" aria-label={`${stage} candidates`}>
                  {items.length ? (
                    items.map(renderCard)
                  ) : (
                    <div className="py-12 px-2 text-center text-xs text-muted-foreground">
                      <p className="font-medium">No candidates in {stage}</p>
                      <p className="mt-1 text-[10px] opacity-80">{meta.emptyHint}</p>
                    </div>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2.5 w-full text-xs font-semibold text-primary"
                  onClick={() => {
                    setStageFilter(stage);
                    setMode("list");
                  }}
                >
                  Open {stage} in list ({items.length})
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="workspace-panel !p-0 overflow-hidden">
          <div tabIndex={0} role="region" aria-label="Candidate applications table" className="workspace-table-scroll">
            <table className="w-full min-w-[860px] text-left text-xs">
              <thead className="border-b border-border bg-card text-[11px] uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th scope="col" className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      aria-label="Select all visible candidates"
                      checked={listFiltered.length > 0 && listFiltered.every((a) => selected.includes(a.id))}
                      onChange={(e) => setSelected(e.target.checked ? listFiltered.map((a) => a.id) : [])}
                      className="accent-primary"
                    />
                  </th>
                  <th scope="col" className="px-3 py-3">Candidate</th>
                  <th scope="col" className="px-3 py-3">Job</th>
                  <th scope="col" className="px-3 py-3">Stage</th>
                  <th scope="col" className="px-3 py-3">Match</th>
                  <th scope="col" className="px-3 py-3">Recruiter</th>
                  <th scope="col" className="px-3 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {listFiltered.map((app) => {
                  const job = myJobs.find((j) => j.id === app.jid);
                  const score = job ? calcScore(job, app) : 0;
                  return (
                    <tr key={app.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <input
                          aria-label={`Select ${app.name}`}
                          type="checkbox"
                          className="accent-primary"
                          checked={selected.includes(app.id)}
                          onChange={(e) => toggleSelected(app.id, e.target.checked)}
                        />
                      </td>
                      <th scope="row" className="px-3 py-3 font-normal text-left">
                        <button
                          type="button"
                          onClick={() => onOpenDrawer({ type: "applicant", id: app.id })}
                          className="flex items-center gap-3 text-left cursor-pointer"
                        >
                          <img className="h-9 w-9 rounded-full object-cover" src={getCandidatePhoto(app.name)} alt={app.name} />
                          <div>
                            <p className="font-semibold text-foreground hover:text-primary">{app.name}</p>
                            <p className="text-[11px] text-muted-foreground">{app.exp} yrs · {(app.sk || []).slice(0, 3).join(", ")}</p>
                          </div>
                        </button>
                      </th>
                      <td className="px-3 py-3">{job?.t}</td>
                      <td className="px-3 py-3">
                        <span className="workspace-chip">{app.hired ? "Hired" : app.st}</span>
                      </td>
                      <td className="px-3 py-3 font-bold text-primary">{score}%</td>
                      <td className="px-3 py-3 text-muted-foreground">{app.recruiter || "Unassigned"}</td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap items-center justify-end gap-1">
                          <Button type="button" size="sm" variant="ghost" onClick={() => setNoteModal({ app, text: app.note ?? "" })}>
                            <StickyNote className="mr-1 h-3.5 w-3.5" />Note
                          </Button>
                          <Button type="button" size="sm" variant="ghost" onClick={() => setAssignModal({ ids: [app.id], recruiter: app.recruiter || DEMO_RECRUITERS[0] })}>
                            <UserCheck className="mr-1 h-3.5 w-3.5" />Assign
                          </Button>
                          <Button type="button" size="sm" variant="ghost" onClick={() => setHistoryModal(app)}>
                            <History className="mr-1 h-3.5 w-3.5" />History
                          </Button>
                          <Button type="button" size="sm" variant="ghost" onClick={() => handleDownloadResumes([app])}>
                            <Download className="mr-1 h-3.5 w-3.5" />Resume
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => onOpenDrawer({ type: "applicant", id: app.id })}>
                            Review
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {listFiltered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                      No candidates match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Internal Note Dialog */}
      <Dialog open={Boolean(noteModal)} onOpenChange={(o) => { if (!o) setNoteModal(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Internal Recruiter Note</DialogTitle>
            <DialogDescription>Private hiring team note for {noteModal?.app.name}.</DialogDescription>
          </DialogHeader>
          {noteModal && (
            <div className="space-y-4">
              <label className="workspace-field">
                <span>Internal note</span>
                <Textarea
                  rows={4}
                  value={noteModal.text}
                  onChange={(e) => setNoteModal({ ...noteModal, text: e.target.value })}
                  placeholder="Add technical feedback, salary expectations, or notice period details..."
                />
              </label>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setNoteModal(null)}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    patchApps([noteModal.app.id], { note: noteModal.text.trim() }, "Internal recruiter note updated.");
                    notify(`Saved internal note for ${noteModal.app.name}.`);
                    setNoteModal(null);
                  }}
                >
                  Save note
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Assign Recruiter Dialog */}
      <Dialog open={Boolean(assignModal)} onOpenChange={(o) => { if (!o) setAssignModal(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Recruiter</DialogTitle>
            <DialogDescription>Assign {assignModal?.ids.length ?? 0} candidate(s) to a recruiter.</DialogDescription>
          </DialogHeader>
          {assignModal && (
            <div className="space-y-4">
              <label className="workspace-field">
                <span>Recruiter name</span>
                <Input
                  value={assignModal.recruiter}
                  onChange={(e) => setAssignModal({ ...assignModal, recruiter: e.target.value })}
                  placeholder="Ananya Rao"
                />
              </label>
              <div className="flex flex-wrap gap-1.5">
                {DEMO_RECRUITERS.map((r) => (
                  <Button
                    key={r}
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 text-[11px]"
                    onClick={() => setAssignModal({ ...assignModal, recruiter: r })}
                  >
                    {r}
                  </Button>
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setAssignModal(null)}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    const name = assignModal.recruiter.trim();
                    patchApps(assignModal.ids, { recruiter: name || undefined }, name ? `Assigned to recruiter ${name}.` : "Unassigned recruiter.");
                    notify(name ? `Assigned ${name} to ${assignModal.ids.length} candidate(s).` : "Cleared recruiter assignment.");
                    setAssignModal(null);
                    setSelected([]);
                  }}
                >
                  Save assignment
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Application History Dialog */}
      <Dialog open={Boolean(historyModal)} onOpenChange={(o) => { if (!o) setHistoryModal(null); }}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Application History · {historyModal?.name}</DialogTitle>
            <DialogDescription>
              {myJobs.find((j) => j.id === historyModal?.jid)?.t ?? "Application"}
            </DialogDescription>
          </DialogHeader>
          {historyModal && (
            <div className="space-y-3 text-xs">
              <ol className="space-y-2.5 border-l-2 border-primary/30 pl-4">
                <li>
                  <p className="font-semibold text-foreground">Application submitted</p>
                  <p className="text-[11px] text-muted-foreground">{timeAgo(historyModal.at)}</p>
                </li>
                {(historyModal.upd || []).map((u, idx) => (
                  <li key={idx}>
                    <p className="font-semibold text-foreground">{u.msg}</p>
                    <p className="text-[11px] text-muted-foreground">{timeAgo(u.at)}</p>
                  </li>
                ))}
                {historyModal.iv && (
                  <li>
                    <p className="font-semibold text-primary">Interview scheduled: {historyModal.iv}</p>
                  </li>
                )}
                {historyModal.hired && (
                  <li>
                    <p className="font-semibold text-emerald-700">Marked as Hired</p>
                  </li>
                )}
              </ol>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Candidate Comparison Dialog */}
      <Dialog open={compareOpen} onOpenChange={setCompareOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Candidate Comparison</DialogTitle>
            <DialogDescription>
              Side-by-side evaluation across AI match, readiness, experience, skills, and hiring status.
            </DialogDescription>
          </DialogHeader>
          <div tabIndex={0} role="region" aria-label="Candidate comparison table" className="workspace-table-scroll">
            <table className="w-full min-w-[640px] text-left text-xs">
              <thead className="border-b border-border bg-muted/30">
                <tr>
                  <th scope="col" className="px-3 py-2.5 font-semibold text-muted-foreground">Metric</th>
                  {compareTargets.map((c) => (
                    <th key={c.id} scope="col" className="px-3 py-2.5 font-bold text-foreground">
                      <div>{c.name}</div>
                      <div className="text-[11px] font-normal text-muted-foreground">
                        {myJobs.find((j) => j.id === c.jid)?.t}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <th scope="row" className="px-3 py-2.5 font-semibold text-muted-foreground">AI Job Match</th>
                  {compareTargets.map((c) => {
                    const job = myJobs.find((j) => j.id === c.jid);
                    return (
                      <td key={c.id} className="px-3 py-2.5 font-bold text-primary">
                        {job ? `${calcScore(job, c)}%` : "—"}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <th scope="row" className="px-3 py-2.5 font-semibold text-muted-foreground">Industry Readiness Score</th>
                  {compareTargets.map((c) => (
                    <td key={c.id} className="px-3 py-2.5 font-semibold">
                      {avgAssessmentScore(c) != null ? `${avgAssessmentScore(c)} / 100` : "Pending"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="px-3 py-2.5 font-semibold text-muted-foreground">Experience</th>
                  {compareTargets.map((c) => (
                    <td key={c.id} className="px-3 py-2.5">{c.exp} yrs</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="px-3 py-2.5 font-semibold text-muted-foreground">Stage</th>
                  {compareTargets.map((c) => (
                    <td key={c.id} className="px-3 py-2.5">{c.hired ? "Hired" : c.st}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="px-3 py-2.5 font-semibold text-muted-foreground">Skills</th>
                  {compareTargets.map((c) => (
                    <td key={c.id} className="px-3 py-2.5">
                      <div className="flex flex-wrap gap-1">
                        {(c.sk || []).slice(0, 4).map((s) => (
                          <span key={s} className="workspace-chip !px-2 !py-0.5 !text-[10px]">{s}</span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="px-3 py-2.5 font-semibold text-muted-foreground">Assigned Recruiter</th>
                  {compareTargets.map((c) => (
                    <td key={c.id} className="px-3 py-2.5">{c.recruiter || "Unassigned"}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>

      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Clock size={12} />
          Showing {mode === "board" ? baseFiltered.length : listFiltered.length} of {apps.length} candidates · {myJobs.length} jobs
        </span>
        <Button variant="ghost" size="sm" className="text-primary" onClick={resetAllFilters}>
          <RotateCcw className="mr-1 h-3.5 w-3.5" />
          Reset filters
        </Button>
      </div>
    </div>
  );
}
