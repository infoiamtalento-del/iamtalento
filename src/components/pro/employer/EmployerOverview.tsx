import { useCallback, useEffect, useState } from "react";
import {
  Activity, ArrowRight, Briefcase, CheckCircle2, ClipboardList, Clock, FilePenLine, Hourglass, LayoutDashboard, PauseCircle,
  Plus, Star, Users, Wallet, XCircle, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getOverview, listActivity, type ActivityEntry, type EmployerOverview as Overview,
} from "@/services/employer/ats";
import type { ProView } from "../proTypes";
import {
  Avatar, EmptyState, ErrorState, JobStatusBadge, Loading, PageHeader, StageBadge, describeActivity, fmtDateTime, relativeTime,
} from "./employerUi";
import "../employer-workspace.css";

export type NavigateFn = (view: ProView, query?: Record<string, string>) => void;

interface Props {
  companyName: string;
  onNavigate: NavigateFn;
  onToast: (message: string) => void;
}

interface Metric {
  label: string;
  value: number;
  icon: typeof Users;
  view: ProView;
  query?: Record<string, string>;
  theme?: string;
}

export function EmployerOverview({ companyName, onNavigate }: Props) {
  const [data, setData] = useState<Overview | null>(null);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [overview, history] = await Promise.all([getOverview(), listActivity(12).catch(() => [] as ActivityEntry[])]);
      setData(overview);
      setActivity(history);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load your dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  if (loading && !data) return <div className="employer-workspace"><Loading label="Loading dashboard" /></div>;
  if (error && !data) return <div className="employer-workspace"><ErrorState message={error} onRetry={load} /></div>;
  if (!data) return null;

  const jobMetrics: Metric[] = [
    { label: "Total jobs", value: data.jobs.total, icon: Briefcase, view: "post", theme: "all" },
    { label: "Active jobs", value: data.jobs.active, icon: CheckCircle2, view: "post", query: { status: "active" }, theme: "Shortlisted" },
    { label: "Draft jobs", value: data.jobs.draft, icon: FilePenLine, view: "post", query: { status: "draft" }, theme: "Offer" },
    { label: "Closed / expired", value: data.jobs.closed, icon: XCircle, view: "post", query: { status: "closed" }, theme: "Rejected" },
  ];
  const appMetrics: Metric[] = [
    { label: "Applications", value: data.applications.total, icon: Users, view: "pipe", theme: "all" },
    { label: "Pending", value: data.applications.pending, icon: Hourglass, view: "pipe", query: { stage: "Applied" }, theme: "Applied" },
    { label: "Shortlisted", value: data.applications.shortlisted, icon: Star, view: "pipe", query: { stage: "Shortlisted" }, theme: "Shortlisted" },
    { label: "On hold", value: data.applications.on_hold, icon: PauseCircle, view: "pipe", query: { stage: "On Hold" }, theme: "On Hold" },
    { label: "Selected", value: data.applications.selected, icon: CheckCircle2, view: "pipe", query: { stage: "Offer" }, theme: "Offer" },
  ];

  const tile = (m: Metric) => (
    <button
      key={m.label}
      type="button"
      data-stage-theme={m.theme}
      onClick={() => onNavigate(m.view, m.query)}
      className="workspace-stat cursor-pointer transition-colors hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      aria-label={`${m.label}: ${m.value}. Open`}
    >
      <span className="workspace-icon !h-10 !w-10 shrink-0"><m.icon size={18} /></span>
      <div className="min-w-0">
        <span>{m.label}</span>
        <strong>{m.value}</strong>
      </div>
    </button>
  );

  return (
    <div className="employer-workspace space-y-6">
      <PageHeader
        eyebrow="Dashboard"
        icon={<LayoutDashboard size={13} />}
        title={`Welcome back, ${companyName}`}
        description="Your live hiring numbers, recent applicants and account activity."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => onNavigate("talent")}><Users className="mr-1.5 h-4 w-4" />Find talent</Button>
            <Button size="sm" onClick={() => onNavigate("post", { new: "1" })}><Plus className="mr-1.5 h-4 w-4" />Create job</Button>
          </>
        }
      />

      {!data.readiness.ready && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-warning/40 bg-warning/10 p-4 text-sm" role="status">
          <AlertCircle className="h-4 w-4 shrink-0 text-warning" />
          <p className="mr-auto min-w-0">
            <strong>Complete your company profile to publish jobs.</strong>{" "}
            <span className="text-muted-foreground">Missing: {data.readiness.missing.join(", ")}.</span>
          </p>
          <Button size="sm" onClick={() => onNavigate("cp", { edit: "1" })}>Complete profile<ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Button>
        </div>
      )}

      <section aria-label="Job listings">
        <h2 className="mb-3 text-sm font-bold cursor-pointer hover:text-primary" onClick={() => onNavigate("post")}>Job listings</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{jobMetrics.map(tile)}</div>
      </section>

      <section aria-label="Applications">
        <h2 className="mb-3 text-sm font-bold cursor-pointer hover:text-primary" onClick={() => onNavigate("pipe")}>Applications</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">{appMetrics.map(tile)}</div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <section className="workspace-panel" aria-label="Recent applications">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-sm font-bold cursor-pointer hover:text-primary" onClick={() => onNavigate("pipe")}>
              <ClipboardList size={16} className="text-primary" />Recent applications
            </h2>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("pipe")}>View all<ArrowRight className="ml-1 h-3.5 w-3.5" /></Button>
          </div>
          {data.recent_applications.length === 0 ? (
            <EmptyState icon={<Users />} title="No applications yet" hint="Applications appear here as soon as candidates apply to your active jobs." />
          ) : (
            <ul className="divide-y divide-border">
              {data.recent_applications.map((a) => (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate("pipe", { application: a.id })}
                    className="flex w-full cursor-pointer items-center gap-3 py-3 text-left hover:bg-muted/40"
                  >
                    <Avatar name={a.name} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-semibold">{a.name}</span>
                      <span className="block truncate text-[11px] text-muted-foreground">{a.job_title} · {relativeTime(a.applied_at)}</span>
                    </span>
                    <StageBadge stage={a.stage} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="workspace-panel" aria-label="Job performance">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-sm font-bold cursor-pointer hover:text-primary" onClick={() => onNavigate("post")}>
              <Activity size={16} className="text-primary" />Job performance
            </h2>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("post")}>Manage jobs<ArrowRight className="ml-1 h-3.5 w-3.5" /></Button>
          </div>
          {data.job_performance.length === 0 ? (
            <EmptyState icon={<Briefcase />} title="No published jobs" hint="Publish a job to see views and applications here." />
          ) : (
            <ul className="space-y-3">
              {data.job_performance.map((j) => (
                <li
                  key={j.id}
                  onClick={() => onNavigate("pipe", { job: j.id })}
                  className="rounded-md border border-border p-3 hover:border-primary/60 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2">
                    <button type="button" className="truncate text-left text-xs font-semibold hover:underline" onClick={(e) => { e.stopPropagation(); onNavigate("pipe", { job: j.id }); }}>{j.title}</button>
                    <JobStatusBadge status={j.status} />
                  </div>
                  <dl className="mt-2 grid grid-cols-3 gap-2 text-[11px] text-muted-foreground">
                    <div><dt>Views</dt><dd className="text-sm font-bold text-foreground">{j.views}</dd></div>
                    <div><dt>Applications</dt><dd className="text-sm font-bold text-foreground">{j.applications}</dd></div>
                    <div><dt>Conversion</dt><dd className="text-sm font-bold text-foreground">{j.conversion}%</dd></div>
                  </dl>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <section className="workspace-panel" aria-label="Activity history">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-sm font-bold cursor-pointer hover:text-primary" onClick={() => onNavigate("notif")}>
              <Clock size={16} className="text-primary" />Activity history
            </h2>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("notif")}>Notifications<ArrowRight className="ml-1 h-3.5 w-3.5" /></Button>
          </div>
          {activity.length === 0 ? (
            <EmptyState icon={<Clock />} title="No activity yet" hint="Profile updates, job changes and candidate decisions are recorded here." />
          ) : (
            <ol className="space-y-0">
              {activity.map((a) => {
                const { title, detail } = describeActivity(a);
                const targetView: ProView = a.action.startsWith("job.") ? "post" : a.action.startsWith("application.") ? "pipe" : "cp";
                return (
                  <li
                    key={a.id}
                    onClick={() => onNavigate(targetView)}
                    className="flex gap-3 border-t border-border py-3 first:border-t-0 hover:bg-muted/30 cursor-pointer rounded-sm px-1 -mx-1"
                  >
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold">{title}</p>
                      {detail && <p className="truncate text-[11px] text-muted-foreground">{detail}</p>}
                    </div>
                    <time className="shrink-0 text-[11px] text-muted-foreground" dateTime={a.at} title={fmtDateTime(a.at)}>{relativeTime(a.at)}</time>
                  </li>
                );
              })}
            </ol>
          )}
        </section>

        <section className="workspace-panel" aria-label="Wallet">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold cursor-pointer hover:text-primary" onClick={() => onNavigate("talent", { recharge: "1" })}>
            <Wallet size={16} className="text-primary" />Company wallet
          </h2>
          <p className="text-3xl font-bold cursor-pointer hover:text-primary" onClick={() => onNavigate("talent", { recharge: "1" })}>
            ₹{Number(data.wallet_balance).toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Used for verified candidate access and CIR reports.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" onClick={() => onNavigate("talent", { recharge: "1" })}>Recharge wallet</Button>
            <Button size="sm" variant="outline" onClick={() => onNavigate("notif")}>
              Notifications{data.unread_notifications > 0 ? ` (${data.unread_notifications})` : ""}
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
