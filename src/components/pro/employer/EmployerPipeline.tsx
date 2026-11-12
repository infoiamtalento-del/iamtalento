import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  GripVertical,
  Kanban,
  Layers,
  List,
  MapPin,
  MoreHorizontal,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  APPLICATION_STAGES,
  STAGE_LABEL,
  changeStage,
  listApplications,
  releaseHold,
  type ApplicationList,
  type LiveApplication,
} from "@/services/employer/ats";
import { listMyJobs } from "@/services/employer/jobs";
import {
  Avatar,
  EmptyState,
  ErrorState,
  Loading,
  PageHeader,
  StageBadge,
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

export function EmployerPipeline({ searchParams, contact, onNavigate, onToast }: Props) {
  const applicationId = searchParams.get("application");
  const stageFilter = searchParams.get("stage") ?? "";
  const jobFilter = searchParams.get("job") ?? "";

  const [mode, setMode] = useState<"board" | "list">("board");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"recent" | "match">("recent");
  const [data, setData] = useState<ApplicationList | null>(null);
  const [jobs, setJobs] = useState<Array<{ id: string; designation: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [moving, setMoving] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const filterPanelRef = useRef<HTMLDivElement | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await listApplications({
        job: jobFilter || null,
        stage: mode === "list" ? stageFilter || null : null,
        search: query,
        sort,
        limit: 200,
      });
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load applications.");
    } finally {
      setLoading(false);
    }
  }, [jobFilter, stageFilter, query, sort, mode]);

  useEffect(() => {
    const t = setTimeout(() => void load(), query ? 250 : 0);
    return () => clearTimeout(t);
  }, [load, query]);

  useEffect(() => {
    listMyJobs({ limit: 100 })
      .then((rows) => setJobs(rows.map((r) => ({ id: r.id, designation: r.designation }))))
      .catch(() => setJobs([]));
  }, []);

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

  const counts = data?.counts ?? {};
  const total = useMemo(
    () =>
      Object.entries(counts).reduce(
        (sum, [stage, n]) => (stage === "Withdrawn" ? sum : sum + n),
        0
      ),
    [counts]
  );
  const listItems = data?.items ?? [];

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
    (jobFilter ? 1 : 0) + (query.trim() ? 1 : 0) + (stageFilter ? 1 : 0) + (sort !== "recent" ? 1 : 0);

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
        <DropdownMenuLabel>Move to</DropdownMenuLabel>
        {APPLICATION_STAGES.filter((s) => s !== app.stage).map((s) => (
          <DropdownMenuItem key={s} onSelect={() => void move(app, s)}>
            {STAGE_LABEL[s]}
          </DropdownMenuItem>
        ))}
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

  const card = (app: LiveApplication) => (
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
        <Avatar name={app.name} src={app.photo_url} size={34} />
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
      <div className="mt-2 flex flex-wrap gap-1.5">
        {app.skills.slice(0, 3).map((s) => (
          <span key={s} className="workspace-chip !px-2 !py-0.5 !text-[10px]">
            {s}
          </span>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>
          {app.experience_years ?? 0} yrs
          {app.match_score != null ? ` · ${Math.round(app.match_score)}% match` : ""}
        </span>
        <span>{relativeTime(app.stage_changed_at)}</span>
      </div>
    </div>
  );

  return (
    <div className="employer-workspace space-y-5">
      <PageHeader
        eyebrow="Job applications"
        icon={<Layers size={13} />}
        title="Candidate pipeline"
        description="Drag and drop applicants across stages or click any card to review. Changes are saved instantly."
        actions={
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

            {filterOpen && (
              <div
                role="dialog"
                aria-label="Pipeline filters"
                className="absolute right-0 top-full z-30 mt-2 w-[320px] rounded-xl border border-border bg-card p-4 shadow-xl space-y-3.5"
              >
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <SlidersHorizontal size={14} className="text-primary" />
                    Filter &amp; Sort
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
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    aria-label="Search applicants"
                    className="pl-9 text-xs h-9"
                    placeholder="Search name, role or skill"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <select
                  aria-label="Filter by job"
                  value={jobFilter}
                  onChange={(e) => setParam("job", e.target.value)}
                  className="!h-9 text-xs"
                >
                  <option value="">All jobs</option>
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.designation}
                    </option>
                  ))}
                </select>
                <select
                  aria-label="Sort applicants"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as "recent" | "match")}
                  className="!h-9 text-xs"
                >
                  <option value="recent">Most recent</option>
                  <option value="match">Best match</option>
                </select>
                <div className="flex items-center justify-between border-t border-border pt-2.5">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setQuery("");
                      onNavigate("pipe");
                    }}
                  >
                    <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                    Reset
                  </Button>
                  <Button size="sm" onClick={() => setFilterOpen(false)}>
                    Done
                  </Button>
                </div>
              </div>
            )}
          </div>
        }
      />

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

      {loading ? (
        <Loading label="Loading applications" />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : total === 0 && !query && !jobFilter ? (
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
                  <span className="workspace-column-count">{counts[stage] ?? 0}</span>
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
            hint="Try a different search, job or status."
          />
        </div>
      ) : (
        <div className="workspace-panel !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-xs">
              <thead className="border-b border-border bg-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Candidate</th>
                  <th className="px-3 py-3">Job</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Match</th>
                  <th className="px-3 py-3">Applied</th>
                  <th className="px-3 py-3">
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
                      <button
                        type="button"
                        className="flex cursor-pointer items-center gap-3 text-left"
                        onClick={() => open(a.id)}
                      >
                        <Avatar name={a.name} src={a.photo_url} size={32} />
                        <span>
                          <span className="block font-semibold">{a.name}</span>
                          <span className="block text-[11px] text-muted-foreground">
                            {a.headline || `${a.experience_years ?? 0} yrs experience`}
                          </span>
                        </span>
                      </button>
                    </td>
                    <td className="px-3 py-3">{a.job_title}</td>
                    <td className="px-3 py-3">
                      <StageBadge stage={a.stage} />
                    </td>
                    <td className="px-3 py-3">
                      {a.match_score != null ? `${Math.round(a.match_score)}%` : "—"}
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {relativeTime(a.applied_at)}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-end gap-1">
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
    </div>
  );
}
