import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, Kanban, Layers, List, MapPin, MoreHorizontal, RotateCcw, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { APPLICATION_STAGES, STAGE_LABEL, changeStage, listApplications, releaseHold, type ApplicationList, type LiveApplication } from "@/services/employer/ats";
import { listMyJobs } from "@/services/employer/jobs";
import { Avatar, EmptyState, ErrorState, Loading, PageHeader, StageBadge, relativeTime } from "./employerUi";
import { EmployerApplicantDetail } from "./EmployerApplicantDetail";
import type { NavigateFn } from "./EmployerOverview";

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

  const load = useCallback(async () => {
    setError(null);
    try {
      // The board needs every stage, so only the list view applies the stage filter on the server.
      const res = await listApplications({ job: jobFilter || null, stage: mode === "list" ? stageFilter || null : null, search: query, sort, limit: 200 });
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
    listMyJobs({ limit: 100 }).then((rows) => setJobs(rows.map((r) => ({ id: r.id, designation: r.designation })))).catch(() => setJobs([]));
  }, []);

  const baseQuery = () => Object.fromEntries([...searchParams.entries()].filter(([k]) => !["view", "role", "application"].includes(k)));

  const setParam = (key: string, value: string) => {
    const next = baseQuery();
    if (value) next[key] = value; else delete next[key];
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
  const total = useMemo(() => Object.entries(counts).reduce((sum, [stage, n]) => (stage === "Withdrawn" ? sum : sum + n), 0), [counts]);
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
    { label: "Total applications", count: total, stage: "" },
    ...APPLICATION_STAGES.map((s) => ({ label: STAGE_LABEL[s], count: counts[s] ?? 0, stage: s })),
  ];

  const moveMenu = (app: LiveApplication) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" aria-label={`Move ${app.name}`} disabled={moving === app.id}><MoreHorizontal className="h-4 w-4" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Move to</DropdownMenuLabel>
        {APPLICATION_STAGES.filter((s) => s !== app.stage).map((s) => (
          <DropdownMenuItem key={s} onSelect={() => void move(app, s)}>{STAGE_LABEL[s]}</DropdownMenuItem>
        ))}
        {app.stage === "On Hold" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => { setMoving(app.id); releaseHold(app.id).then(() => { onToast("Released from hold."); return load(); }).catch((e) => onToast(e.message)).finally(() => setMoving(null)); }}>
              <RotateCcw className="mr-2 h-4 w-4" />Release from hold
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const card = (app: LiveApplication) => (
    <div key={app.id} className="workspace-candidate !min-h-0">
      <div className="flex items-start gap-2">
        <Avatar name={app.name} src={app.photo_url} size={34} />
        <button type="button" onClick={() => open(app.id)} className="min-w-0 flex-1 cursor-pointer text-left">
          <p className="truncate text-xs font-semibold">{app.name}</p>
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{app.job_title}</p>
        </button>
        {moveMenu(app)}
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">{app.skills.slice(0, 3).map((s) => <span key={s} className="workspace-chip !px-2 !py-0.5 !text-[10px]">{s}</span>)}</div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{app.experience_years ?? 0} yrs{app.match_score != null ? ` · ${Math.round(app.match_score)}% match` : ""}</span>
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
        description="Track every applicant from first review to a decision. Changes are saved instantly and recorded in the history."
        actions={
          <>
            <Button size="sm" variant={mode === "board" ? "default" : "outline"} onClick={() => setMode("board")}><Kanban className="mr-1.5 h-4 w-4" />Board</Button>
            <Button size="sm" variant={mode === "list" ? "default" : "outline"} onClick={() => setMode("list")}><List className="mr-1.5 h-4 w-4" />List</Button>
          </>
        }
      />

      <div className="workspace-stats !grid-cols-2 sm:!grid-cols-4 xl:!grid-cols-7">
        {stats.map((s) => (
          <button key={s.label} type="button" className={`workspace-stat cursor-pointer ${stageFilter === s.stage ? "!border-primary" : ""}`} aria-pressed={stageFilter === s.stage} onClick={() => setParam("stage", s.stage)}>
            <div className="min-w-0"><span>{s.label}</span><strong>{s.count}</strong></div>
          </button>
        ))}
      </div>

      <div className="workspace-panel !p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input aria-label="Search applicants" className="pl-9" placeholder="Search name, role or skill" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <select aria-label="Filter by job" value={jobFilter} onChange={(e) => setParam("job", e.target.value)} className="!w-auto min-w-[180px]">
            <option value="">All jobs</option>
            {jobs.map((j) => <option key={j.id} value={j.id}>{j.designation}</option>)}
          </select>
          <select aria-label="Sort applicants" value={sort} onChange={(e) => setSort(e.target.value as "recent" | "match")} className="!w-auto min-w-[150px]">
            <option value="recent">Most recent</option><option value="match">Best match</option>
          </select>
          {(stageFilter || jobFilter || query) && (
            <Button size="sm" variant="ghost" onClick={() => { setQuery(""); onNavigate("pipe"); }}><RotateCcw className="mr-1.5 h-4 w-4" />Reset</Button>
          )}
        </div>
      </div>

      {loading ? <Loading label="Loading applications" /> : error ? <ErrorState message={error} onRetry={load} /> : total === 0 && !query && !jobFilter ? (
        <div className="workspace-panel"><EmptyState icon={<Users />} title="No applications yet" hint="When candidates apply to your active jobs they will appear here." action={<Button onClick={() => onNavigate("post")}>View jobs</Button>} /></div>
      ) : mode === "board" ? (
        <div className="workspace-board !grid-cols-[repeat(6,minmax(230px,1fr))]" aria-label="Candidate pipeline">
          {APPLICATION_STAGES.map((stage) => {
            const items = listItems.filter((a) => a.stage === stage && (!stageFilter || stageFilter === stage));
            return (
              <section key={stage} className="workspace-column" aria-label={`${STAGE_LABEL[stage]} column`}>
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-xs font-bold">{STAGE_LABEL[stage]}</h2>
                  <span className="workspace-chip !px-2 !py-0.5">{counts[stage] ?? 0}</span>
                </div>
                {items.length === 0 ? <p className="mt-6 text-center text-[11px] text-muted-foreground">No candidates</p> : items.map(card)}
              </section>
            );
          })}
        </div>
      ) : listItems.length === 0 ? (
        <div className="workspace-panel"><EmptyState icon={<Search />} title="No applicants match" hint="Try a different search, job or status." /></div>
      ) : (
        <div className="workspace-panel !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-xs">
              <thead className="border-b border-border bg-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground">
                <tr><th className="px-4 py-3">Candidate</th><th className="px-3 py-3">Job</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Match</th><th className="px-3 py-3">Applied</th><th className="px-3 py-3"><span className="sr-only">Actions</span></th></tr>
              </thead>
              <tbody>
                {listItems.map((a) => (
                  <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <button type="button" className="flex cursor-pointer items-center gap-3 text-left" onClick={() => open(a.id)}>
                        <Avatar name={a.name} src={a.photo_url} size={32} />
                        <span><span className="block font-semibold">{a.name}</span><span className="block text-[11px] text-muted-foreground">{a.headline || `${a.experience_years ?? 0} yrs experience`}</span></span>
                      </button>
                    </td>
                    <td className="px-3 py-3">{a.job_title}</td>
                    <td className="px-3 py-3"><StageBadge stage={a.stage} /></td>
                    <td className="px-3 py-3">{a.match_score != null ? `${Math.round(a.match_score)}%` : "—"}</td>
                    <td className="px-3 py-3 text-muted-foreground"><span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{relativeTime(a.applied_at)}</span></td>
                    <td className="px-3 py-3"><div className="flex items-center justify-end gap-1"><Button size="sm" variant="ghost" onClick={() => open(a.id)}>Open<ArrowRight className="ml-1 h-3.5 w-3.5" /></Button>{moveMenu(a)}</div></td>
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
