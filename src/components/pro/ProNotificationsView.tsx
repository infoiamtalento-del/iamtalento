import React, { useEffect } from "react";
import {
  Bell,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Bot,
  Calendar,
  Briefcase,
  ChevronRight,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProUser, ProJob, ProApplication, timeAgo, getRemainingTime } from "@/data/proData";
import { getCompanyLogo } from "@/data/portalAssets";
import { ProDrawerState } from "./proTypes";

interface ProNotificationsViewProps {
  user: ProUser;
  jobs: ProJob[];
  applications: ProApplication[];
  onOpenDrawer: (drawer: ProDrawerState) => void;
  onMarkSeen?: () => void;
}

export const ProNotificationsView: React.FC<ProNotificationsViewProps> = ({
  user,
  jobs,
  applications,
  onOpenDrawer,
  onMarkSeen,
}) => {
  const isEmployer = user.role === "employer";

  useEffect(() => {
    if (onMarkSeen) {
      const timer = setTimeout(() => {
        onMarkSeen();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [onMarkSeen]);

  if (isEmployer) {
    // EMPLOYER NOTIFICATIONS
    const myJobs = jobs.filter((j) => j.by === user.email);
    const myApps = applications.filter((a) => myJobs.some((j) => j.id === a.jid));
    const findJob = (a: ProApplication) => jobs.find((j) => j.id === a.jid);
    const lastSeen = user.seen || 0;

    const dueQueue = myApps
      .filter((a) => (!a.upd || a.upd.length === 0) && a.st !== "Rejected")
      .sort((p, q) => p.at - q.at);

    const recentApplicants = [...myApps].sort((p, q) => q.at - p.at).slice(0, 12);
    const scheduledInterviews = myApps.filter((a) => a.iv).sort((p, q) => String(p.iv).localeCompare(String(q.iv)));

    return (
      <div className="space-y-6">
        {/* Hero */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
              <Clock className="w-3.5 h-3.5" /> Recruiter SLA Queue
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-display">
              Recruiter Notifications
            </h1>
            <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
              Candidates awaiting your 24-hour review update, new applicant alerts, and scheduled interview rounds.
            </p>
          </div>
        </div>

        {/* Urgent SLA Queue Card */}
        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Urgent 24h SLA Review Queue ({dueQueue.length})
            </h3>
            <span className="text-xs text-muted-foreground">Respond before auto-update fires</span>
          </div>

          <div className="divide-y divide-border/60">
            {dueQueue.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                All applicant reviews are up to date! 100% SLA compliance achieved.
              </div>
            ) : (
              dueQueue.map((app) => {
                const job = findJob(app);
                const deadline = app.at + 86400000;
                const timeLeft = getRemainingTime(deadline);
                return (
                  <div
                    key={app.id}
                    className="py-3 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-sm">{app.name}</div>
                        <div className="text-muted-foreground">
                          Applied for {job?.t} • <span className="font-semibold text-amber-600 dark:text-amber-400">{timeLeft} remaining</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => onOpenDrawer({ type: "applicant", id: app.id })}
                      className="rounded-xl text-xs h-8"
                    >
                      Reply Now
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 2-Column Grid: Recent Applicants & Interviews */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Recent Applicants */}
          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-primary" /> Recent Applicants
            </h3>
            <div className="space-y-2.5">
              {recentApplicants.length === 0 ? (
                <p className="text-xs text-muted-foreground py-4 text-center">No applicants yet.</p>
              ) : (
                recentApplicants.map((app) => {
                  const job = findJob(app);
                  const isNew = app.at > lastSeen;
                  return (
                    <div
                      key={app.id}
                      className="p-3 rounded-xl bg-muted/30 border border-border/60 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-foreground flex items-center gap-2">
                          {app.name}
                          {isNew && (
                            <span className="px-1.5 py-0.2 rounded-full bg-primary text-primary-foreground text-[9px] font-bold">
                              NEW
                            </span>
                          )}
                        </div>
                        <div className="text-muted-foreground text-[11px] mt-0.5">
                          {job?.t} • Applied {timeAgo(app.at)}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl text-xs h-7 px-2.5"
                        onClick={() => onOpenDrawer({ type: "applicant", id: app.id })}
                      >
                        Review
                      </Button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Scheduled Interviews */}
          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" /> Upcoming Interviews
            </h3>
            <div className="space-y-2.5">
              {scheduledInterviews.length === 0 ? (
                <p className="text-xs text-muted-foreground py-4 text-center">No interviews scheduled.</p>
              ) : (
                scheduledInterviews.map((app) => {
                  const job = findJob(app);
                  return (
                    <div
                      key={app.id}
                      className="p-3 rounded-xl bg-muted/30 border border-border/60 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-foreground">{app.name}</div>
                        <div className="text-muted-foreground text-[11px] mt-0.5">
                          {job?.t} • <span className="font-medium text-primary">{app.iv}</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="rounded-xl text-xs h-7 px-2"
                        onClick={() => onOpenDrawer({ type: "applicant", id: app.id })}
                      >
                        Details
                      </Button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CANDIDATE NOTIFICATIONS
  const myApps = applications.filter((a) => a.who === user.email);
  const pendingApps = myApps.filter((a) => (!a.upd || a.upd.length === 0) && a.st !== "Rejected");

  const allUpdates = myApps
    .flatMap((a) => (a.upd || []).map((u) => ({ ...u, app: a })))
    .sort((p, q) => q.at - p.at);

  const lastSeen = user.seen || 0;

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Talento SLA Transparency
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-display">
            Notification Center
          </h1>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Every application is guaranteed a status update within 24 hours. If an employer has not responded manually, our autonomous SLA system provides an automated pipeline status.
          </p>
        </div>
      </div>

      {/* Pending Reviews in SLA window */}
      {pendingApps.length > 0 && (
        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-3">
          <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" /> Pending 24h Employer Review ({pendingApps.length})
          </h3>
          <div className="space-y-2">
            {pendingApps.map((a) => {
              const job = jobs.find((j) => j.id === a.jid);
              const deadline = a.at + 86400000;
              const timeLeft = getRemainingTime(deadline);
              return (
                <div
                  key={a.id}
                  className="p-3.5 rounded-xl bg-muted/30 border border-border/60 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={getCompanyLogo(job?.c || "")}
                      alt={job?.c || "Company"}
                      className="w-9 h-9 rounded-xl object-contain p-1 border border-border/60 bg-muted/40"
                    />
                    <div>
                      <div className="font-semibold text-foreground">{job?.t}</div>
                      <div className="text-muted-foreground text-[11px]">{job?.c} • Applied {timeAgo(a.at)}</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold text-[11px]">
                    SLA Deadline: {timeLeft}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Updates History */}
      <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="font-semibold text-foreground text-base flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" /> Update History
        </h3>

        <div className="divide-y divide-border/60">
          {allUpdates.length === 0 ? (
            <p className="py-8 text-center text-xs text-muted-foreground">
              No updates yet. Apply to jobs and your first verified update will arrive within 24 hours.
            </p>
          ) : (
            allUpdates.map((update, i) => {
              const job = jobs.find((j) => j.id === update.app.jid);
              const isNew = update.at > lastSeen;
              return (
                <div key={i} className="py-3.5 flex items-start gap-3.5 text-xs">
                  <div
                    className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                      update.auto
                        ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                        : "bg-primary/10 text-primary"
                    )}
                  >
                    {update.auto ? <Bot className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-semibold text-foreground flex items-center gap-2">
                        {job?.t} • {job?.c}
                        {isNew && (
                          <span className="px-1.5 py-0.2 rounded-full bg-primary text-primary-foreground text-[9px] font-bold">
                            NEW
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-muted-foreground">{timeAgo(update.at)}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{update.msg}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
