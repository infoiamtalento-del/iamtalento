import { type ReactNode } from "react";
import { AlertTriangle, Inbox, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { STAGE_LABEL } from "@/services/employer/ats";
import "../employer-workspace.css";

const STAGE_TONE: Record<string, string> = {
  Applied: "bg-primary/10 text-primary",
  Shortlisted: "bg-success/10 text-success",
  Interview: "bg-primary/15 text-primary",
  "On Hold": "bg-warning/15 text-warning",
  Offer: "bg-success/15 text-success",
  Hired: "bg-success/20 text-success",
  Rejected: "bg-destructive/10 text-destructive",
  Withdrawn: "bg-muted text-muted-foreground",
};

export function StageBadge({ stage, className }: { stage: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold", STAGE_TONE[stage] ?? "bg-muted text-muted-foreground", className)}>
      {STAGE_LABEL[stage] ?? stage}
    </span>
  );
}

const JOB_TONE: Record<string, string> = {
  active: "bg-success/10 text-success",
  scheduled: "bg-primary/15 text-primary",
  draft: "bg-muted text-muted-foreground",
  paused: "bg-warning/15 text-warning",
  pending_review: "bg-primary/10 text-primary",
  closed: "bg-destructive/10 text-destructive",
  expired: "bg-destructive/10 text-destructive",
  rejected: "bg-destructive/10 text-destructive",
};
export const JOB_STATUS_LABEL: Record<string, string> = {
  active: "Active",
  scheduled: "Scheduled",
  draft: "Draft",
  paused: "Paused",
  pending_review: "In review",
  closed: "Closed",
  expired: "Expired",
  rejected: "Rejected",
};

export function JobStatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold", JOB_TONE[status] ?? "bg-muted text-muted-foreground")}>
      {JOB_STATUS_LABEL[status] ?? status}
    </span>
  );
}

export function Avatar({ name, src, size = 36 }: { name: string; src?: string | null; size?: number }) {
  const initials = name.split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";
  return src ? (
    <img src={src} alt={name} style={{ width: size, height: size }} className="shrink-0 rounded-full object-cover" />
  ) : (
    <span
      aria-label={name}
      style={{ width: size, height: size, fontSize: Math.max(10, size / 3) }}
      className="grid shrink-0 place-items-center rounded-full bg-primary/10 font-bold text-primary"
    >
      {initials}
    </span>
  );
}

export function PageHeader({ eyebrow, icon, title, description, actions }: { eyebrow?: string; icon?: ReactNode; title: string; description?: string; actions?: ReactNode }) {
  return (
    <header className="workspace-header">
      <div>
        {eyebrow && <span className="workspace-eyebrow">{icon}{eyebrow}</span>}
        <h1 className="workspace-heading">{title}</h1>
        {description && <p className="workspace-description">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function EmptyState({ icon, title, hint, action }: { icon?: ReactNode; title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="workspace-empty" role="status">
      <span className="workspace-icon">{icon ?? <Inbox />}</span>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      {hint && <p className="max-w-sm">{hint}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-wrap items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
      <AlertTriangle className="h-4 w-4 shrink-0" />
      <span className="mr-auto">{message}</span>
      {onRetry && <Button size="sm" variant="outline" onClick={onRetry}><RefreshCw className="mr-1.5 h-3.5 w-3.5" />Retry</Button>}
    </div>
  );
}

export function Loading({ label = "Loading" }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />{label}…
    </div>
  );
}

export const fmtDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";
export const fmtDateTime = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "—";

export function relativeTime(iso?: string | null): string {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days < 30 ? `${days}d ago` : fmtDate(iso);
}

const ACTION_LABEL: Record<string, string> = {
  save_employer_profile: "Company profile updated",
  "job.create": "Job created",
  "job.update": "Job edited",
  "job.publish": "Job published",
  "job.schedule": "Job scheduled",
  "job.pause": "Job unpublished",
  "job.resume": "Job activated",
  "job.renew": "Job renewed",
  "job.promote": "Job promoted",
  "job.close": "Job closed",
  "job.duplicate": "Job duplicated",
  "job.delete": "Job deleted",
  "application.stage_change": "Candidate status changed",
  "application.hired": "Candidate hired",
  "application.assign_recruiter": "Recruiter assigned",
  "application.export": "Applications exported",
  "talent.unlock": "Talent access purchased",
  "cir.unlock": "CIR report opened",
  "settings.update": "Settings updated",
};

export function describeActivity(a: { action: string; meta: Record<string, unknown> }): { title: string; detail: string } {
  const m = a.meta ?? {};
  const title = ACTION_LABEL[a.action] ?? a.action;
  if (a.action === "application.stage_change") {
    const to = STAGE_LABEL[String(m.to)] ?? String(m.to ?? "");
    return { title, detail: `${m.name ?? "Candidate"} moved to ${to}${m.job ? ` · ${m.job}` : ""}` };
  }
  if (a.action === "application.hired") {
    return { title, detail: `${m.name ?? "Candidate"}${m.job ? ` · ${m.job}` : ""}` };
  }
  if (a.action === "application.assign_recruiter") {
    return { title, detail: `${m.name ?? "Candidate"} → ${m.recruiter ?? "Unassigned"}` };
  }
  if (a.action.startsWith("job.") && m.title) return { title, detail: String(m.title) };
  if (a.action === "job.close" && m.reason) return { title, detail: String(m.reason) };
  if (a.action === "talent.unlock") return { title, detail: `${m.package ?? "Package"} · ₹${Number(m.amount ?? 0).toLocaleString("en-IN")}` };
  if (a.action === "cir.unlock") return { title, detail: String(m.name ?? "Candidate") };
  if (a.action === "save_employer_profile" && m.company_name) return { title, detail: String(m.company_name) };
  return { title, detail: "" };
}
