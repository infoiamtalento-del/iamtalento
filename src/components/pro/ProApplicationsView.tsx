import React, { useState } from "react";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  ChevronRight,
  XCircle,
  Building2,
  MapPin,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProUser, ProJob, ProApplication, timeAgo, getRemainingTime } from "@/data/proData";
import { getCompanyLogo } from "@/data/portalAssets";
import { ProDrawerState } from "./proTypes";

interface ProApplicationsViewProps {
  user: ProUser;
  jobs: ProJob[];
  applications: ProApplication[];
  onWithdrawApplication: (appId: number) => void;
  onOpenDrawer: (drawer: ProDrawerState) => void;
}

export const ProApplicationsView: React.FC<ProApplicationsViewProps> = ({
  user,
  jobs,
  applications,
  onWithdrawApplication,
  onOpenDrawer,
}) => {
  const [activeStatus, setActiveStatus] = useState<string>("All");

  const myApps = applications.filter((a) => a.who === user.email);
  const inProgress = myApps.filter((a) => ["Shortlisted", "Interview", "Offer"].includes(a.st));
  const interviews = myApps.filter((a) => a.st === "Interview");

  const filteredApps = myApps.filter((a) => {
    if (activeStatus === "All") return true;
    if (activeStatus === "Active") return a.st !== "Rejected";
    return a.st === activeStatus;
  });

  const STAGES = ["Applied", "Shortlisted", "Interview", "Offer"];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-[#0d5cb2]/30 bg-gradient-to-r from-[#0d5cb2] via-[#0e63be] to-[#0a4d96] p-6 sm:p-8 shadow-md text-white">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white border border-white/20 text-xs font-semibold mb-2 backdrop-blur-xs">
            <Clock className="w-3.5 h-3.5 text-blue-200" /> 24-Hour SLA Guarantee
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
            Application Tracker
          </h1>
          <p className="text-blue-100 text-sm mt-1 max-w-2xl leading-relaxed">
            Track every application through each hiring milestone. Verified employers must respond within 24 hours, or Talento triggers an automatic status update.
          </p>
        </div>
      </div>

      {/* Stat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 block">Total Applications</span>
          <div className="text-2xl font-extrabold text-[#0d5cb2] mt-1 font-display">{myApps.length}</div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Sent across all companies</span>
        </div>
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 block">In Progress</span>
          <div className="text-2xl font-extrabold text-[#0d5cb2] mt-1 font-display">{inProgress.length}</div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Actively moving forward</span>
        </div>
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 block">Interviews</span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1 font-display">{interviews.length}</div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Scheduled discussions</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {["All", "Active", "Interview", "Rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setActiveStatus(status)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-semibold transition-all border cursor-pointer",
              activeStatus === status
                ? "bg-[#0d5cb2] text-white border-[#0d5cb2] shadow-xs shadow-[#0d5cb2]/20 font-bold"
                : "bg-white text-slate-700 border-slate-200/90 hover:bg-slate-50 hover:border-slate-300"
            )}
          >
            {status}
            <span
              className={cn(
                "ml-1.5 px-1.5 py-0.2 rounded-full text-[10px]",
                activeStatus === status ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
              )}
            >
              {status === "All"
                ? myApps.length
                : status === "Active"
                ? inProgress.length + myApps.filter((a) => a.st === "Applied").length
                : myApps.filter((a) => a.st === status).length}
            </span>
          </button>
        ))}
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApps.length === 0 ? (
          <div className="bg-card border border-border/80 rounded-2xl p-12 text-center shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-full bg-muted/60 text-muted-foreground flex items-center justify-center mx-auto">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-foreground text-base">No applications in this view</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Explore open positions and apply with your verified profile to track responses here.
            </p>
          </div>
        ) : (
          filteredApps.map((app) => {
            const job = jobs.find((j) => j.id === app.jid);
            const isRejected = app.st === "Rejected";
            const currentStageIndex = STAGES.indexOf(app.st);
            const hasUpdate = (app.upd || []).length > 0;
            const slaDeadline = app.at + 86400000;
            const remainingSla = getRemainingTime(slaDeadline);

            return (
              <div
                key={app.id}
                className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4 hover:border-primary/40 transition-colors"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div
                    className="flex items-start gap-3 cursor-pointer group"
                    onClick={() => job && onOpenDrawer({ type: "job", id: job.id })}
                  >
                    <img
                      src={getCompanyLogo(job?.c || "")}
                      alt={job?.c || "Company"}
                      className="w-12 h-12 rounded-xl object-contain p-1 border border-border/60 bg-muted/30 shrink-0"
                    />
                    <div>
                      <h3 className="font-bold text-foreground text-base group-hover:text-primary transition-colors flex items-center gap-1.5">
                        {job?.t || "Position Title"}
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                      </h3>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="font-medium text-foreground">{job?.c}</span>
                        <span>•</span>
                        <span>{job?.l}</span>
                        <span>•</span>
                        <span>₹{job?.a}–{job?.b} LPA</span>
                        <span>•</span>
                        <span>Applied {timeAgo(app.at)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {hasUpdate ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 24h SLA Met
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                        <Clock className="w-3.5 h-3.5" /> SLA Due: {remainingSla}
                      </span>
                    )}

                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs text-muted-foreground hover:text-rose-600 rounded-xl h-8"
                      onClick={() => onWithdrawApplication(app.id)}
                    >
                      Withdraw
                    </Button>
                  </div>
                </div>

                {/* 4-Step Progress Stepper */}
                <div className="pt-2 pb-1">
                  {isRejected ? (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-2">
                      <XCircle className="w-4 h-4 shrink-0" />
                      <span>Application marked as Not Selected. Candidate pool was competitive.</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-2 relative">
                      {STAGES.map((step, idx) => {
                        const isDone = currentStageIndex >= idx;
                        const isCurrent = currentStageIndex === idx;

                        return (
                          <div key={step} className="flex flex-col items-center text-center space-y-1.5">
                            <div className="w-full flex items-center">
                              <div
                                className={cn(
                                  "h-1 w-full rounded-full transition-all",
                                  idx === 0
                                    ? "bg-transparent"
                                    : isDone
                                    ? "bg-primary"
                                    : "bg-muted"
                                )}
                              />
                              <div
                                className={cn(
                                  "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 z-10 transition-all",
                                  isDone
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "bg-muted text-muted-foreground"
                                )}
                              >
                                {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                              </div>
                              <div
                                className={cn(
                                  "h-1 w-full rounded-full transition-all",
                                  idx === STAGES.length - 1
                                    ? "bg-transparent"
                                    : currentStageIndex > idx
                                    ? "bg-primary"
                                    : "bg-muted"
                                )}
                              />
                            </div>
                            <span
                              className={cn(
                                "text-xs font-semibold",
                                isCurrent
                                  ? "text-primary font-bold"
                                  : isDone
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              )}
                            >
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Latest Update Message */}
                {app.upd && app.upd.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 text-xs space-y-1">
                    <div className="flex items-center justify-between font-semibold text-foreground">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-primary" /> Latest Employer Update
                      </span>
                      <span className="text-[11px] text-muted-foreground font-normal">
                        {timeAgo(app.upd[app.upd.length - 1].at)}
                      </span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {app.upd[app.upd.length - 1].msg}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
