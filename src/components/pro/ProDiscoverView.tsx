import React, { useState, useEffect } from "react";
import {
  Compass,
  X,
  Bookmark,
  Check,
  RotateCcw,
  Sparkles,
  MapPin,
  Building2,
  Clock,
  Briefcase,
  ChevronRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProUser, ProJob, ProApplication, fitAnalysis, calcScore } from "@/data/proData";
import { getCompanyLogo } from "@/data/portalAssets";

interface ProDiscoverViewProps {
  user: ProUser;
  jobs: ProJob[];
  applications: ProApplication[];
  onApplyJob: (jobId: number) => void;
  onSaveJob: (jobId: number) => void;
  onToast: (msg: string) => void;
}

export const ProDiscoverView: React.FC<ProDiscoverViewProps> = ({
  user,
  jobs,
  applications,
  onApplyJob,
  onSaveJob,
  onToast,
}) => {
  const [skippedIds, setSkippedIds] = useState<number[]>([]);

  const appliedIds = applications.filter((a) => a.who === user.email).map((a) => a.jid);
  const savedIds = user.saved || [];

  // Candidate pool of available discover jobs
  const discoverQueue = jobs
    .filter((j) => !appliedIds.includes(j.id) && !skippedIds.includes(j.id) && !savedIds.includes(j.id))
    .sort((a, b) => calcScore(b, user) - calcScore(a, user));

  const currentJob = discoverQueue[0];

  // Action handlers
  const handleSkip = () => {
    if (!currentJob) return;
    setSkippedIds((prev) => [...prev, currentJob.id]);
    onToast(`Skipped ${currentJob.t}`);
  };

  const handleSave = () => {
    if (!currentJob) return;
    onSaveJob(currentJob.id);
    onToast(`Saved ${currentJob.t} to bookmarks!`);
  };

  const handleApply = () => {
    if (!currentJob) return;
    onApplyJob(currentJob.id);
    onToast(`Applied to ${currentJob.t} at ${currentJob.c}!`);
  };

  const handleResetSkipped = () => {
    setSkippedIds([]);
    onToast("Reset skipped jobs! Ready to discover.");
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleSkip();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        handleSave();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleApply();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentJob]);

  const fit = currentJob ? fitAnalysis(currentJob, user) : null;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header Banner */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 relative overflow-hidden shadow-sm text-center">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-1">
            <Compass className="w-3.5 h-3.5" /> High-Velocity Matching
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-display">
            Discover Opportunities
          </h1>
          <p className="text-muted-foreground text-xs">
            {discoverQueue.length} jobs in queue. Use buttons or keys: <b>← Skip</b> • <b>↑ Save</b> • <b>→ Apply</b>
          </p>
        </div>
      </div>

      {/* Main Discover Card */}
      {!currentJob ? (
        <div className="bg-card border border-border/80 rounded-2xl p-12 text-center shadow-sm space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <Check className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-foreground font-display">
            You have reviewed every open job!
          </h2>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Check your Saved tab to review bookmarked openings, or bring skipped jobs back into your queue.
          </p>
          <Button onClick={handleResetSkipped} className="rounded-xl gap-2 text-xs font-medium">
            <RotateCcw className="w-3.5 h-3.5" /> Show Skipped Jobs Again
          </Button>
        </div>
      ) : (
        <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-md space-y-5">
          {/* Top Company & Title Row */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <img
                src={getCompanyLogo(currentJob.c)}
                alt={currentJob.c}
                className="w-14 h-14 rounded-2xl object-contain p-1.5 border border-border/60 bg-muted/30 shrink-0"
              />
              <div>
                <h2 className="text-xl font-bold text-foreground font-display">{currentJob.t}</h2>
                <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                  <span className="font-semibold text-foreground">{currentJob.c}</span>
                  <span>•</span>
                  <span>{currentJob.l}</span>
                </div>
              </div>
            </div>

            {/* Match Circle */}
            <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-muted/40"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-primary transition-all duration-700"
                  strokeDasharray={`${fit?.tot || 80}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-bold text-xs text-foreground">{fit?.tot || 80}%</span>
            </div>
          </div>

          {/* Badges Row */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-muted text-foreground font-medium border border-border/60">
              {currentJob.m}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-muted text-foreground font-medium border border-border/60">
              {currentJob.ty}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-muted text-foreground font-medium border border-border/60">
              {currentJob.e}+ yrs exp
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-bold">
              ₹{currentJob.a}–{currentJob.b} LPA
            </span>
          </div>

          {/* Skills Required */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Required Skills
            </span>
            <div className="flex flex-wrap gap-1.5">
              {currentJob.sk.map((skill) => {
                const userHas = (user.sk || []).some((s) => s.toLowerCase() === skill.toLowerCase());
                return (
                  <span
                    key={skill}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-xs font-medium border inline-flex items-center gap-1",
                      userHas
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                        : "bg-muted/40 text-muted-foreground border-border/60"
                    )}
                  >
                    <span>{skill}</span>
                    {userHas && <Check className="w-3 h-3 text-emerald-500" />}
                  </span>
                );
              })}
            </div>
          </div>

          {/* 5-Point Fit Breakdown Rows */}
          {fit && (
            <div className="pt-2 border-t border-border/60 space-y-2">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Algorithm Fit Breakdown
              </span>
              <div className="space-y-1.5">
                {fit.rows.map((row, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1">
                    <span className="text-muted-foreground">{row.name}</span>
                    <span className="font-semibold text-foreground">{row.note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3 Action Buttons */}
          <div className="pt-4 flex items-center justify-center gap-6 border-t border-border/60">
            {/* Skip */}
            <button
              onClick={handleSkip}
              className="w-14 h-14 rounded-full border border-border/80 bg-background hover:bg-rose-50 hover:text-rose-500 hover:border-rose-300 dark:hover:bg-rose-950/20 text-muted-foreground flex items-center justify-center transition-all shadow-sm"
              title="Skip (←)"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Save */}
            <button
              onClick={handleSave}
              className="w-12 h-12 rounded-full border border-border/80 bg-background hover:bg-amber-50 hover:text-amber-500 hover:border-amber-300 dark:hover:bg-amber-950/20 text-muted-foreground flex items-center justify-center transition-all shadow-sm"
              title="Save (↑)"
            >
              <Bookmark className="w-5 h-5" />
            </button>

            {/* Apply */}
            <button
              onClick={handleApply}
              className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center transition-all shadow-md"
              title="Apply (→)"
            >
              <Check className="w-6 h-6 stroke-[3]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
