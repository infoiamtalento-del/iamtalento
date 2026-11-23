import { useCallback, useEffect, useState } from "react";
import {
  ArrowRight, Briefcase, Clock, Users, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getOverview, listActivity, type ActivityEntry, type EmployerOverview as Overview,
} from "@/services/employer/ats";
import type { ProView } from "../proTypes";
import {
  Avatar, EmptyState, ErrorState, JobStatusBadge, Loading, StageBadge, describeActivity, fmtDateTime, relativeTime,
} from "./employerUi";
import { EmployerAnalyticsShowcase } from "../EmployerAnalyticsShowcase";
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
  view: ProView;
  query?: Record<string, string>;
  dotClass?: string;
}

export function EmployerOverview({ companyName, onNavigate, onToast }: Props) {
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
    { label: "Total jobs", value: data.jobs.total, view: "post" },
    { label: "Active jobs", value: data.jobs.active, view: "post", query: { status: "active" }, dotClass: "bg-[#16a34a]" },
    { label: "Draft jobs", value: data.jobs.draft, view: "post", query: { status: "draft" }, dotClass: "bg-[#d97706]" },
    { label: "Closed / expired", value: data.jobs.closed, view: "post", query: { status: "closed" }, dotClass: "bg-[#94a3b8]" },
  ];
  const appMetrics: Metric[] = [
    { label: "Applications", value: data.applications.total, view: "pipe" },
    { label: "Pending", value: data.applications.pending, view: "pipe", query: { stage: "Applied" }, dotClass: "bg-[#002C66]" },
    { label: "Shortlisted", value: data.applications.shortlisted, view: "pipe", query: { stage: "Shortlisted" }, dotClass: "bg-[#16a34a]" },
    { label: "On hold", value: data.applications.on_hold, view: "pipe", query: { stage: "On Hold" }, dotClass: "bg-[#d97706]" },
    { label: "Selected", value: data.applications.selected, view: "pipe", query: { stage: "Offer" }, dotClass: "bg-[#ea580c]" },
  ];

  const tile = (m: Metric) => (
    <button
      key={m.label}
      type="button"
      onClick={() => onNavigate(m.view, m.query)}
      className="flex flex-col justify-between rounded-xl border border-[#111827]/[0.08] bg-white p-4 text-left cursor-pointer transition-colors duration-150 hover:border-[#002C66]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#002C66]"
      aria-label={`${m.label}: ${m.value}. Open`}
    >
      <span className="inline-flex items-center gap-1.5 text-xs text-[#6b7487]">
        {m.dotClass && <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${m.dotClass}`} />}
        {m.label}
      </span>
      <strong className="mt-2 text-2xl font-medium text-[#111827] tabular-nums">{m.value}</strong>
    </button>
  );

  return (
    <div className="employer-workspace space-y-6">
      <EmployerAnalyticsShowcase
        companyName={companyName}
        activeJobsCount={data.jobs.active}
        totalApplications={data.applications.total}
        walletBalance={Number(data.wallet_balance || 0)}
        topJobTitles={data.job_performance.map((j) => j.title)}
        onNavigate={onNavigate}
        onToast={onToast}
      />

      {!data.readiness.ready && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/[0.06] p-4 text-sm" role="status">
          <AlertCircle className="h-4 w-4 shrink-0 text-[#d97706]" strokeWidth={1.5} />
          <p className="mr-auto min-w-0">
            <strong className="font-medium text-[#111827]">Complete your company profile to publish jobs.</strong>{" "}
            <span className="text-[#4b5565]">Missing: {data.readiness.missing.join(", ")}</span>
          </p>
          <Button size="sm" onClick={() => onNavigate("cp", { edit: "1" })}>Complete profile<ArrowRight className="ml-1.5 h-3.5 w-3.5" strokeWidth={1.5} /></Button>
        </div>
      )}

      <section aria-label="Job listings">
        <h2 className="mb-3 text-sm font-medium text-[#111827] cursor-pointer hover:text-[#002C66]" onClick={() => onNavigate("post")}>Job listings</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{jobMetrics.map(tile)}</div>
      </section>

      <section aria-label="Applications">
        <h2 className="mb-3 text-sm font-medium text-[#111827] cursor-pointer hover:text-[#002C66]" onClick={() => onNavigate("pipe")}>Applications</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">{appMetrics.map(tile)}</div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <section className="rounded-xl border border-[#111827]/[0.08] bg-white p-5" aria-label="Recent applications">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-sm font-medium text-[#111827] cursor-pointer hover:text-[#002C66]" onClick={() => onNavigate("pipe")}>
              Recent applications
            </h2>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("pipe")}>View all<ArrowRight className="ml-1 h-3.5 w-3.5" strokeWidth={1.5} /></Button>
          </div>
          {data.recent_applications.length === 0 ? (
            <EmptyState icon={<Users />} title="No applications yet" hint="Applications appear here as soon as candidates apply to your active jobs" />
          ) : (
            <ul className="divide-y divide-[#111827]/[0.06]">
              {data.recent_applications.map((a) => (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate("pipe", { application: a.id })}
                    className="flex w-full cursor-pointer items-center gap-3 py-3 text-left hover:bg-[#f5f7fa] transition-colors duration-150"
                  >
                    <Avatar name={a.name} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-medium text-[#111827]">{a.name}</span>
                      <span className="block truncate text-[11px] text-[#6b7487]">{a.job_title} · {relativeTime(a.applied_at)}</span>
                    </span>
                    <StageBadge stage={a.stage} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-[#111827]/[0.08] bg-white p-5" aria-label="Job performance">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-sm font-medium text-[#111827] cursor-pointer hover:text-[#002C66]" onClick={() => onNavigate("post")}>
              Job performance
            </h2>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("post")}>Manage jobs<ArrowRight className="ml-1 h-3.5 w-3.5" strokeWidth={1.5} /></Button>
          </div>
          {data.job_performance.length === 0 ? (
            <EmptyState icon={<Briefcase />} title="No published jobs" hint="Publish a job to see views and applications here" />
          ) : (
            <ul className="space-y-3">
              {data.job_performance.map((j) => (
                <li
                  key={j.id}
                  onClick={() => onNavigate("pipe", { job: j.id })}
                  className="rounded-lg border border-[#111827]/[0.08] p-3.5 hover:border-[#002C66]/40 transition-colors duration-150 cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2">
                    <button type="button" className="truncate text-left text-xs font-medium text-[#111827] hover:underline" onClick={(e) => { e.stopPropagation(); onNavigate("pipe", { job: j.id }); }}>{j.title}</button>
                    <JobStatusBadge status={j.status} />
                  </div>
                  <dl className="mt-2.5 grid grid-cols-3 gap-2 text-[11px] text-[#6b7487] tabular-nums">
                    <div><dt>Views</dt><dd className="text-sm font-medium text-[#111827]">{j.views}</dd></div>
                    <div><dt>Applications</dt><dd className="text-sm font-medium text-[#111827]">{j.applications}</dd></div>
                    <div><dt>Conversion</dt><dd className="text-sm font-medium text-[#111827]">{j.conversion}%</dd></div>
                  </dl>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <section className="rounded-xl border border-[#111827]/[0.08] bg-white p-5" aria-label="Activity history">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-sm font-medium text-[#111827] cursor-pointer hover:text-[#002C66]" onClick={() => onNavigate("notif")}>
              Activity history
            </h2>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("notif")}>Notifications<ArrowRight className="ml-1 h-3.5 w-3.5" strokeWidth={1.5} /></Button>
          </div>
          {activity.length === 0 ? (
            <EmptyState icon={<Clock />} title="No activity yet" hint="Profile updates, job changes and candidate decisions are recorded here" />
          ) : (
            <ol className="space-y-0">
              {activity.map((a) => {
                const { title, detail } = describeActivity(a);
                const targetView: ProView = a.action.startsWith("job.") ? "post" : a.action.startsWith("application.") ? "pipe" : "cp";
                return (
                  <li
                    key={a.id}
                    onClick={() => onNavigate(targetView)}
                    className="flex gap-3 border-t border-[#111827]/[0.06] py-3 first:border-t-0 hover:bg-[#f5f7fa] transition-colors duration-150 cursor-pointer rounded-md px-1 -mx-1"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#002C66]" aria-hidden />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-[#111827]">{title}</p>
                      {detail && <p className="truncate text-[11px] text-[#6b7487]">{detail}</p>}
                    </div>
                    <time className="shrink-0 text-[11px] text-[#6b7487] tabular-nums" dateTime={a.at} title={fmtDateTime(a.at)}>{relativeTime(a.at)}</time>
                  </li>
                );
              })}
            </ol>
          )}
        </section>

        <section className="rounded-xl border border-[#111827]/[0.08] bg-white p-5" aria-label="Wallet">
          <h2 className="mb-4 text-sm font-medium text-[#111827] cursor-pointer hover:text-[#002C66]" onClick={() => onNavigate("talent", { recharge: "1" })}>
            Company wallet
          </h2>
          <p className="text-[28px] leading-8 font-medium text-[#111827] tabular-nums cursor-pointer hover:text-[#002C66]" onClick={() => onNavigate("talent", { recharge: "1" })}>
            ₹{Number(data.wallet_balance).toLocaleString("en-IN")}
          </p>
          <p className="mt-1.5 text-xs text-[#6b7487]">Used for verified candidate access and CIR reports</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" className="rounded-lg bg-[#002C66] hover:bg-[#002250] text-white" onClick={() => onNavigate("talent", { recharge: "1" })}>Recharge wallet</Button>
            <Button size="sm" variant="outline" className="rounded-lg" onClick={() => onNavigate("notif")}>
              Notifications{data.unread_notifications > 0 ? ` (${data.unread_notifications})` : ""}
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
