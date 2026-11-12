import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Users,
  Search,
  CalendarDays,
  FileText,
  CheckCircle2,
  Layers,
  Kanban,
  List,
  MapPin,
  Clock,
  ArrowRight,
  RotateCcw,
  SlidersHorizontal,
  GripVertical,
  X,
  XCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  STAGES,
  CANDIDATES_SEED,
  calcScore,
  timeAgo,
  type ProUser,
  type ProJob,
  type ProApplication,
} from "@/data/proData";
import { getCandidatePhoto } from "@/data/portalAssets";
import type { ProDrawerState } from "./proTypes";
import "./employer-workspace.css";

interface Props {
  user: ProUser;
  jobs: ProJob[];
  applications: ProApplication[];
  onOpenDrawer: (drawer: ProDrawerState) => void;
  onBulkUpdateStage: (ids: number[], stage: string) => void;
  onBulkSendReview: (ids: number[]) => void;
}

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
  Offer: {
    subtitle: "Offer prepared / sent",
    icon: Sparkles,
    emptyHint: "Drop a candidate here for offer stage",
  },
  Rejected: {
    subtitle: "Didn't move forward",
    icon: XCircle,
    emptyHint: "Drop a candidate here to mark rejected",
  },
};

export function ProEmployerPipeline({
  user,
  jobs,
  applications,
  onOpenDrawer,
  onBulkUpdateStage,
  onBulkSendReview,
}: Props) {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<"board" | "list">("board");
  const [jobFilter, setJobFilter] = useState(() => searchParams.get("job") ?? "");
  const [query, setQuery] = useState("");
  const [min, setMin] = useState(0);
  const [sla, setSla] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [stageFilter, setStageFilter] = useState("");
  const [focusedStage, setFocusedStage] = useState<string>(() => searchParams.get("stage") ?? "");
  const [filterOpen, setFilterOpen] = useState(false);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);

  const filterPanelRef = useRef<HTMLDivElement | null>(null);
  const columnRefs = useRef<Record<string, HTMLElement | null>>({});

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

  useEffect(() => {
    if (!filterOpen) return;
    const handleOutside = (event: MouseEvent) => {
      if (filterPanelRef.current && !filterPanelRef.current.contains(event.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [filterOpen]);

  const myJobs = jobs.filter((j) => j.by === user.email);
  const apps = applications.filter((a) => myJobs.some((j) => j.id === a.jid));

  // Base filtered list (keeps all stages visible on the board unless stageFilter is explicitly set inside the filter menu or in list mode)
  const baseFiltered = apps.filter((a) => {
    const job = myJobs.find((j) => j.id === a.jid);
    if (!job) return false;
    const matchesJob = !jobFilter || String(a.jid) === jobFilter;
    const matchesQuery = `${a.name} ${job.t} ${a.sk.join(" ")} ${job.l}`
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesMin = calcScore(job, a) >= min;
    const matchesSla = !sla || (!a.upd?.length && a.st !== "Rejected");
    return matchesJob && matchesQuery && matchesMin && matchesSla;
  });

  const listFiltered = baseFiltered.filter((a) => !stageFilter || a.st === stageFilter);

  const activeFilterCount =
    (jobFilter ? 1 : 0) +
    (query.trim() ? 1 : 0) +
    (min > 0 ? 1 : 0) +
    (sla ? 1 : 0) +
    (stageFilter ? 1 : 0);

  const resetAllFilters = () => {
    setQuery("");
    setJobFilter("");
    setStageFilter("");
    setFocusedStage("");
    setMin(0);
    setSla(false);
  };

  const stats = [
    { label: "Total Candidates", count: apps.length, icon: Users, stage: "", theme: "all" },
    {
      label: "Needs Screening",
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
      label: "Interviews Scheduled",
      count: apps.filter((a) => a.st === "Interview").length,
      icon: CalendarDays,
      stage: "Interview",
      theme: "Interview",
    },
    {
      label: "Offers Pending",
      count: apps.filter((a) => a.st === "Offer").length,
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
        <div className="flex items-start gap-2.5">
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
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="workspace-candidate-match">{score}% match</span>
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

        <div className="mt-3 flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <CalendarDays size={11} />
            {app.exp} yrs
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={11} />
            {candidate?.c || job?.l}
          </span>
        </div>

        <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-border/60 pt-2">
          <span className="flex items-center gap-1 text-[10px] font-medium text-primary truncate">
            <Clock size={11} className="shrink-0" />
            <span className="truncate">{app.iv || `Applied ${timeAgo(app.at)}`}</span>
          </span>
          <select
            aria-label={`Move ${app.name} to stage`}
            value={app.st}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            onChange={(e) => {
              e.stopPropagation();
              if (e.target.value !== app.st) {
                onBulkUpdateStage([app.id], e.target.value);
              }
            }}
            className="!h-6 !w-auto !rounded-md !border-border/80 !bg-muted/40 !px-1.5 !py-0 !text-[10px] font-semibold cursor-pointer"
          >
            {STAGES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  return (
    <div className="employer-workspace">
      <header className="workspace-header">
        <div>
          <span className="workspace-eyebrow">
            <Layers size={14} />
            Recruiter Pipeline
          </span>
          <h1 className="workspace-heading">Candidate Pipeline Board</h1>
          <p className="workspace-description">
            Drag and drop candidate cards across stages, review match scores, and keep every application moving.
          </p>
        </div>

        {/* Single Clean Filter Icon + Board/List View Switcher */}
        <div className="relative flex flex-wrap items-center gap-3" ref={filterPanelRef}>
          <Button
            type="button"
            size="icon"
            variant={filterOpen || activeFilterCount > 0 ? "default" : "outline"}
            aria-label="Open pipeline filters"
            aria-expanded={filterOpen}
            title="Filter candidates"
            onClick={() => setFilterOpen((prev) => !prev)}
            className="relative h-9 w-9 rounded-lg shrink-0"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {activeFilterCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground ring-2 ring-background">
                {activeFilterCount}
              </span>
            )}
          </Button>

          <div className="inline-flex items-center gap-1.5">
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

          {filterOpen && (
            <div
              role="dialog"
              aria-label="Pipeline filters"
              className="absolute right-0 top-full z-30 mt-2 w-[320px] sm:w-[360px] rounded-xl border border-border bg-card p-4 shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <SlidersHorizontal size={14} className="text-primary" />
                  Filter Candidates
                </span>
                <button
                  type="button"
                  aria-label="Close filters"
                  onClick={() => setFilterOpen(false)}
                  className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-foreground">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    aria-label="Search candidates"
                    className="h-9 pl-8 text-xs"
                    placeholder="Name, role, skills, location..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-foreground">Job Opening</label>
                <select
                  aria-label="Filter by job"
                  value={jobFilter}
                  onChange={(e) => setJobFilter(e.target.value)}
                  className="!h-9 text-xs"
                >
                  <option value="">All Jobs ({myJobs.length})</option>
                  {myJobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-foreground">Stage</label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setStageFilter("")}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold border transition-colors ${
                      !stageFilter
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-muted/40 text-foreground hover:border-primary/50"
                    }`}
                  >
                    All ({apps.length})
                  </button>
                  {STAGES.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStageFilter((prev) => (prev === st ? "" : st))}
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold border transition-colors ${
                        stageFilter === st
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-muted/40 text-foreground hover:border-primary/50"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-foreground">
                  Min Match Score <span className="float-right text-primary">{min}%</span>
                  <input
                    aria-label="Minimum match"
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    className="mt-2 w-full accent-primary"
                    value={min}
                    onChange={(e) => setMin(Number(e.target.value))}
                  />
                </label>
              </div>

              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer pt-1">
                <input
                  type="checkbox"
                  className="accent-primary"
                  checked={sla}
                  onChange={(e) => setSla(e.target.checked)}
                />
                Needs a status update
              </label>

              <div className="flex items-center justify-between border-t border-border pt-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={resetAllFilters}
                  className="h-8 text-xs text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="mr-1 h-3.5 w-3.5" />
                  Reset all
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setFilterOpen(false)}
                  className="h-8 text-xs"
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Differentiated Stage Summary Cards */}
      <div className="workspace-stats">
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

      {/* Compact Active Filter Pills (Only shown when filters are active) */}
      {(activeFilterCount > 0 || focusedStage) && (
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
          {jobFilter && (
            <span className="workspace-chip">
              Job: {myJobs.find((j) => String(j.id) === jobFilter)?.t || jobFilter}
              <button
                type="button"
                aria-label="Clear job filter"
                onClick={() => setJobFilter("")}
                className="ml-1 hover:text-foreground"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {query && (
            <span className="workspace-chip">
              Search: &ldquo;{query}&rdquo;
              <button
                type="button"
                aria-label="Clear search query"
                onClick={() => setQuery("")}
                className="ml-1 hover:text-foreground"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {min > 0 && (
            <span className="workspace-chip">
              Min Match: {min}%
              <button
                type="button"
                aria-label="Clear minimum match"
                onClick={() => setMin(0)}
                className="ml-1 hover:text-foreground"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {sla && (
            <span className="workspace-chip">
              Needs status update
              <button
                type="button"
                aria-label="Clear status update filter"
                onClick={() => setSla(false)}
                className="ml-1 hover:text-foreground"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {stageFilter && (
            <span className="workspace-chip">
              Stage: {stageFilter}
              <button
                type="button"
                aria-label={`Clear ${stageFilter} filter`}
                onClick={() => setStageFilter("")}
                className="ml-1 hover:text-foreground"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {focusedStage && !stageFilter && (
            <span className="workspace-chip">
              Highlighting: {focusedStage}
              <button
                type="button"
                aria-label={`Clear ${focusedStage} highlight`}
                onClick={() => setFocusedStage("")}
                className="ml-1 hover:text-foreground"
              >
                <X size={12} />
              </button>
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-primary"
            onClick={resetAllFilters}
          >
            <RotateCcw className="mr-1 h-3 w-3" />
            Reset filters
          </Button>
        </div>
      )}

      {mode === "board" ? (
        <div className="workspace-board" aria-label="Candidate pipeline">
          {STAGES.map((stage) => {
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

                {isDragOver && (
                  <div className="mb-2 rounded-lg border border-dashed border-current px-2.5 py-1.5 text-center text-[11px] font-semibold">
                    Drop card to move to {stage}
                  </div>
                )}

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
        <div className="workspace-panel">
          <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-border pb-4">
            <span className="mr-auto text-xs">{selected.length} selected</span>
            {["Shortlisted", "Interview", "Offer", "Rejected"].map((stage) => (
              <Button
                key={stage}
                size="sm"
                variant="outline"
                disabled={!selected.length}
                onClick={() => onBulkUpdateStage(selected, stage)}
              >
                Move to {stage}
              </Button>
            ))}
            <Button
              size="sm"
              disabled={!selected.length}
              onClick={() => onBulkSendReview(selected)}
            >
              Send review update
            </Button>
          </div>
          {listFiltered.length ? (
            listFiltered.map((app) => (
              <div
                key={app.id}
                className="flex items-center gap-4 border-b border-border py-4 last:border-b-0"
              >
                <input
                  aria-label={`Select ${app.name}`}
                  type="checkbox"
                  className="accent-primary"
                  checked={selected.includes(app.id)}
                  onChange={(e) =>
                    setSelected((current) =>
                      e.target.checked
                        ? [...current, app.id]
                        : current.filter((id) => id !== app.id)
                    )
                  }
                />
                <img
                  className="h-9 w-9 rounded-full object-cover cursor-pointer"
                  src={getCandidatePhoto(app.name)}
                  alt={app.name}
                  onClick={() => onOpenDrawer({ type: "applicant", id: app.id })}
                />
                <button
                  type="button"
                  onClick={() => onOpenDrawer({ type: "applicant", id: app.id })}
                  className="min-w-0 flex-1 text-left cursor-pointer"
                >
                  <p className="text-sm font-semibold hover:text-primary transition-colors">
                    {app.name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {myJobs.find((j) => j.id === app.jid)?.t} · {app.st}
                  </p>
                </button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenDrawer({ type: "applicant", id: app.id })}
                >
                  Review
                </Button>
              </div>
            ))
          ) : (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No candidates match your filters.
            </p>
          )}
        </div>
      )}

      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>
          Showing {mode === "board" ? baseFiltered.length : listFiltered.length} of {apps.length} candidates · {myJobs.length} jobs · Drag cards between columns to update stage
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary"
          onClick={resetAllFilters}
        >
          <RotateCcw className="mr-1 h-3.5 w-3.5" />
          Reset filters
        </Button>
      </div>
    </div>
  );
}
