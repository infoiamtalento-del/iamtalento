import React from "react";
import {
  Send,
  Compass,
  Calendar,
  Award,
  CheckCircle2,
  TrendingUp,
  Brain,
  Plus,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Building2,
  MapPin,
  Clock,
  Sparkles,
  BarChart3,
  Layers,
  HeartHandshake,
  Users,
  Copy,
  Trash2,
  Check,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProUser, ProJob, ProApplication, calcScore, levelFromExp, formatINR } from "@/data/proData";
import { getCompanyLogo } from "@/data/portalAssets";
import { ProView, ProDrawerState } from "./proTypes";

interface ProDashboardViewProps {
  user: ProUser;
  jobs: ProJob[];
  applications: ProApplication[];
  onNavigate: (view: ProView) => void;
  onOpenDrawer: (drawer: ProDrawerState) => void;
  onAddSkill: (skill: string) => void;
  onDuplicateJob?: (jobId: number) => void;
  onCloseJob?: (jobId: number) => void;
}

export const ProDashboardView: React.FC<ProDashboardViewProps> = ({
  user,
  jobs,
  applications,
  onNavigate,
  onOpenDrawer,
  onAddSkill,
  onDuplicateJob,
  onCloseJob,
}) => {
  const isEmployer = user.role === "employer";

  if (isEmployer) {
    // EMPLOYER DASHBOARD
    const myJobs = jobs.filter((j) => j.by === user.email);
    const myApps = applications.filter((a) => myJobs.some((j) => j.id === a.jid));
    const findJob = (a: ProApplication) => jobs.find((j) => j.id === a.jid);

    const maxPerJob = Math.max(1, ...myJobs.map((j) => myApps.filter((a) => a.jid === j.id).length));
    const totalApps = Math.max(1, myApps.length);

    const STAGES = ["Applied", "Shortlisted", "Interview", "Offer", "Rejected"];
    const interviewsCount = myApps.filter((a) => a.st === "Interview").length;
    const offersCount = myApps.filter((a) => a.st === "Offer").length;
    const updatesDueCount = myApps.filter(
      (a) => (!a.upd || a.upd.length === 0) && a.st !== "Rejected"
    ).length;

    // SLA health calculation
    const humanUpdated = myApps.filter((a) => (a.upd || []).some((u) => !u.auto));
    const slaPercent = myApps.length ? Math.round((humanUpdated.length / myApps.length) * 100) : 100;
    const avgMatch = myApps.length
      ? Math.round(
          myApps.reduce((t, a) => {
            const j = findJob(a);
            return t + (j ? calcScore(j, a) : 0);
          }, 0) / myApps.length
        )
      : 0;

    // Skill distribution
    const skillCounts: Record<string, number> = {};
    const expMix: Record<string, number> = { Fresher: 0, Junior: 0, Mid: 0, Senior: 0 };

    myApps.forEach((a) => {
      (a.sk || []).forEach((k) => {
        skillCounts[k] = (skillCounts[k] || 0) + 1;
      });
      const lvl = levelFromExp(a.exp);
      expMix[lvl] = (expMix[lvl] || 0) + 1;
    });

    const topApplicantSkills = Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
    const maxSkillVal = Math.max(1, ...topApplicantSkills.map((x) => x[1]));

    const urgentNeeds = myApps
      .filter((a) => (!a.upd || a.upd.length === 0) && a.st !== "Rejected")
      .slice(0, 4);

    const topNewApplicants = myApps
      .filter((a) => a.st === "Applied" && findJob(a))
      .sort((a, b) => {
        const ja = findJob(a);
        const jb = findJob(b);
        return (jb ? calcScore(jb, b) : 0) - (ja ? calcScore(ja, a) : 0);
      })
      .slice(0, 3);

    return (
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Recruiter Hub
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-display">
                {user.cp?.name || user.name} Analytics
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Real-time applicant pipeline, 24-hour review SLA monitoring, and talent insights.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button onClick={() => onNavigate("post")} className="rounded-xl gap-2 font-medium shadow-sm">
                <Plus className="w-4 h-4" /> Post New Job
              </Button>
              <Button
                variant="outline"
                onClick={() => onNavigate("pipe")}
                className="rounded-xl gap-2 font-medium bg-background"
              >
                <Layers className="w-4 h-4" /> Pipeline Board
              </Button>
              <Button
                variant="outline"
                onClick={() => onNavigate("talent")}
                className="rounded-xl gap-2 font-medium bg-background"
              >
                <Users className="w-4 h-4" /> Find Talent
              </Button>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <div className="bg-card border border-border/70 rounded-2xl p-4 shadow-sm">
            <span className="text-xs font-medium text-muted-foreground block">Active Jobs</span>
            <div className="text-2xl font-bold text-foreground mt-1 font-display">{myJobs.length}</div>
            <span className="text-[11px] text-muted-foreground mt-1 block">Live openings</span>
          </div>
          <div className="bg-card border border-border/70 rounded-2xl p-4 shadow-sm">
            <span className="text-xs font-medium text-muted-foreground block">Total Applicants</span>
            <div className="text-2xl font-bold text-foreground mt-1 font-display">{myApps.length}</div>
            <span className="text-[11px] text-muted-foreground mt-1 block">All roles combined</span>
          </div>
          <div className="bg-card border border-border/70 rounded-2xl p-4 shadow-sm">
            <span className="text-xs font-medium text-muted-foreground block">Interviews</span>
            <div className="text-2xl font-bold text-foreground mt-1 font-display">{interviewsCount}</div>
            <span className="text-[11px] text-muted-foreground mt-1 block">Active discussion</span>
          </div>
          <div className="bg-card border border-border/70 rounded-2xl p-4 shadow-sm">
            <span className="text-xs font-medium text-muted-foreground block">Offers Made</span>
            <div className="text-2xl font-bold text-foreground mt-1 font-display">{offersCount}</div>
            <span className="text-[11px] text-muted-foreground mt-1 block">Candidate offers</span>
          </div>
          <div className="bg-card border border-primary/30 bg-primary/5 rounded-2xl p-4 shadow-sm col-span-2 sm:col-span-1">
            <span className="text-xs font-medium text-primary block flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> 24h SLA Due
            </span>
            <div className="text-2xl font-bold text-primary mt-1 font-display">{updatesDueCount}</div>
            <span className="text-[11px] text-muted-foreground mt-1 block">Needing candidate reply</span>
          </div>
        </div>

        {/* Funnel & Distribution Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Applicants per job */}
          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" /> Applicants per Job
              </h3>
              <span className="text-xs text-muted-foreground">{myJobs.length} active roles</span>
            </div>
            <div className="space-y-3">
              {myJobs.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No active jobs posted yet.</p>
              ) : (
                myJobs.map((j) => {
                  const n = myApps.filter((a) => a.jid === j.id).length;
                  const pct = Math.round((n / maxPerJob) * 100);
                  return (
                    <div key={j.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-foreground truncate max-w-[240px]">{j.t}</span>
                        <span className="text-muted-foreground font-semibold">{n} candidates</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(6, pct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Hiring Funnel */}
          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" /> Hiring Funnel
              </h3>
              <span className="text-xs text-muted-foreground">{myApps.length} total in pipeline</span>
            </div>
            <div className="space-y-3">
              {STAGES.map((s) => {
                const n = myApps.filter((a) => a.st === s).length;
                const pct = Math.round((n / totalApps) * 100);
                return (
                  <div key={s} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground">{s}</span>
                      <span className="text-muted-foreground font-semibold">
                        {n} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          s === "Offer"
                            ? "bg-emerald-500"
                            : s === "Interview"
                            ? "bg-blue-500"
                            : s === "Shortlisted"
                            ? "bg-purple-500"
                            : s === "Rejected"
                            ? "bg-rose-400"
                            : "bg-primary"
                        )}
                        style={{ width: `${Math.max(4, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SLA Health Ring & Action Center */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Hiring Health SLA */}
          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-3">
            <h4 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-primary" /> Review SLA Health
            </h4>
            <div className="flex items-center gap-4 py-2">
              <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
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
                    strokeDasharray={`${slaPercent}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute font-bold text-sm text-foreground">{slaPercent}%</span>
              </div>
              <div className="text-xs space-y-1">
                <div className="font-semibold text-foreground">{slaPercent}% SLA Adherence</div>
                <div className="text-muted-foreground">Personal 24h updates sent</div>
                <div className="text-primary font-medium">Avg candidate fit {avgMatch}%</div>
              </div>
            </div>
          </div>

          {/* Top Applicant Skills */}
          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-3">
            <h4 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" /> Candidate Skill Pool
            </h4>
            <div className="space-y-2">
              {topApplicantSkills.length === 0 ? (
                <p className="text-xs text-muted-foreground py-2">No applicant data yet.</p>
              ) : (
                topApplicantSkills.map(([k, count]) => (
                  <div key={k} className="flex items-center justify-between text-xs">
                    <span className="text-foreground truncate max-w-[120px]">{k}</span>
                    <div className="flex items-center gap-2 w-28">
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary/80 rounded-full"
                          style={{ width: `${(count / maxSkillVal) * 100}%` }}
                        />
                      </div>
                      <span className="font-semibold text-muted-foreground w-4 text-right">{count}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Experience Mix */}
          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-3">
            <h4 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" /> Experience Mix
            </h4>
            <div className="h-4 w-full flex rounded-full overflow-hidden bg-muted my-2">
              {["Fresher", "Junior", "Mid", "Senior"].map((lvl, i) => {
                const count = expMix[lvl] || 0;
                if (!count) return null;
                const pct = Math.round((count / totalApps) * 100);
                const colors = ["bg-emerald-500", "bg-sky-500", "bg-indigo-500", "bg-primary"];
                return (
                  <div
                    key={lvl}
                    className={cn("h-full transition-all", colors[i])}
                    style={{ width: `${Math.max(5, pct)}%` }}
                    title={`${lvl}: ${count}`}
                  />
                );
              })}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              {["Fresher", "Junior", "Mid", "Senior"].map((lvl) => (
                <div key={lvl} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{lvl}:</span>
                  <span className="font-semibold text-foreground">{expMix[lvl] || 0}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Center Urgent Reviews */}
          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-3">
            <h4 className="font-semibold text-foreground text-sm flex items-center gap-2 text-primary">
              <Clock className="w-4 h-4" /> Action Center
            </h4>
            <div className="space-y-2">
              {urgentNeeds.length === 0 ? (
                <div className="text-xs text-muted-foreground py-3 text-center flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> All SLA reviews up to date!
                </div>
              ) : (
                urgentNeeds.map((a) => {
                  const j = findJob(a);
                  return (
                    <div
                      key={a.id}
                      className="p-2 rounded-xl bg-muted/40 border border-border/50 flex items-center justify-between text-xs"
                    >
                      <div className="truncate max-w-[120px]">
                        <div className="font-semibold text-foreground truncate">{a.name}</div>
                        <div className="text-[10px] text-muted-foreground truncate">{j?.t}</div>
                      </div>
                      <Button
                        size="sm"
                        variant="default"
                        className="h-7 text-xs rounded-lg px-2.5"
                        onClick={() => onOpenDrawer({ type: "applicant", id: a.id })}
                      >
                        Reply
                      </Button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Active Openings List */}
        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground text-base">Your Active Job Listings</h3>
              <p className="text-xs text-muted-foreground">Manage your posted roles and duplicate or close positions.</p>
            </div>
            <Button size="sm" onClick={() => onNavigate("post")} className="rounded-xl gap-1.5 text-xs">
              <Plus className="w-3.5 h-3.5" /> Post Job
            </Button>
          </div>
          <div className="divide-y divide-border/60">
            {myJobs.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">No jobs created yet.</p>
            ) : (
              myJobs.map((j) => {
                const count = myApps.filter((a) => a.jid === j.id).length;
                return (
                  <div
                    key={j.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center font-bold text-primary shrink-0 border border-border/70">
                        {j.c.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-sm hover:text-primary transition-colors cursor-pointer"
                             onClick={() => onOpenDrawer({ type: "job", id: j.id })}>
                          {j.t}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5 flex-wrap">
                          <span>{j.l}</span>
                          <span>•</span>
                          <span>{j.m}</span>
                          <span>•</span>
                          <span>₹{j.a}–{j.b} LPA</span>
                          <span>•</span>
                          <span className="font-medium text-primary">{count} applicants</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl text-xs h-8 gap-1"
                        onClick={() => onDuplicateJob && onDuplicateJob(j.id)}
                      >
                        <Copy className="w-3 h-3" /> Duplicate
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="rounded-xl text-xs h-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 gap-1"
                        onClick={() => onCloseJob && onCloseJob(j.id)}
                      >
                        <Trash2 className="w-3 h-3" /> Close
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }

  // CANDIDATE DASHBOARD
  const myApps = applications.filter((a) => a.who === user.email);
  const mySkillsLower = (user.sk || []).map((x) => x.toLowerCase());

  // Job demand statistics
  const skillDemand: Record<string, number> = {};
  jobs.forEach((j) => {
    (j.sk || []).forEach((k) => {
      skillDemand[k] = (skillDemand[k] || 0) + 1;
    });
  });

  const skillGaps = Object.keys(skillDemand)
    .filter((k) => !mySkillsLower.includes(k.toLowerCase()))
    .sort((a, b) => skillDemand[b] - skillDemand[a])
    .slice(0, 5);

  const maxDemand = Math.max(1, ...Object.values(skillDemand));

  // Top match job
  const topJob = [...jobs].sort((a, b) => calcScore(b, user) - calcScore(a, user))[0];
  const topScore = topJob ? calcScore(topJob, user) : 0;
  const matchLabel =
    topScore >= 75 ? "Excellent match" : topScore >= 60 ? "Good match" : "Fair match";

  // 7-day activity simulation
  const DAY_MS = 86400000;
  const daysCounts = [...Array(7)].map((_, i) => {
    return myApps.filter((a) => Math.floor((Date.now() - a.at) / DAY_MS) === 6 - i).length;
  });
  const dayLabels = [...Array(7)].map((_, i) =>
    i === 6 ? "Today" : new Date(Date.now() - (6 - i) * DAY_MS).toLocaleDateString("en", { weekday: "short" })
  );
  const peakDay = Math.max(1, ...daysCounts);
  const weekTotal = daysCounts.reduce((t, n) => t + n, 0);

  // Profile readiness checklist
  const actionsList: Array<{ title: string; done: boolean; view: ProView; subtitle: string }> = [
    {
      title: "Add headline & about me",
      done: !!(user.head && user.about),
      view: "profile",
      subtitle: "Tell recruiters who you are and what you specialize in",
    },
    {
      title: "Add 3+ core skills",
      done: (user.sk || []).length >= 3,
      view: "profile",
      subtitle: "Verified skills drive matching algorithms",
    },
    {
      title: "Add a verified certification",
      done: (user.ce || []).length > 0,
      view: "cert",
      subtitle: "Demonstrated proof builds immediate trust",
    },
    {
      title: "Apply to your top match",
      done: !!topJob && myApps.some((a) => a.jid === topJob.id),
      view: "jobs",
      subtitle: "Your best-fit opening is ready for review",
    },
    {
      title: "Create an ATS resume",
      done: !!user.rs?.t,
      view: "resume",
      subtitle: "Optimize your resume format for high pass-rates",
    },
  ];

  const doneCount = actionsList.filter((x) => x.done).length;
  const strengthPercent = doneCount * 20;
  const goodFitJobs = jobs.filter((j) => calcScore(j, user) >= 50);
  const scheduledInterviews = myApps.filter((a) => a.iv || a.st === "Interview");

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Candidate Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-display">
              Welcome back, {user.name.split(" ")[0]}
            </h1>
            <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
              {goodFitJobs.length} openings match 50%+ of your skills.{" "}
              {doneCount < 5
                ? "Finish your next steps below to boost your recruiter response rate."
                : "Your verified profile is in excellent shape."}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button onClick={() => onNavigate("jobs")} className="rounded-xl gap-2 font-medium shadow-sm">
              <Compass className="w-4 h-4" /> Find Jobs
            </Button>
            <Button
              variant="outline"
              onClick={() => onNavigate("upd")}
              className="rounded-xl gap-2 font-medium bg-background"
            >
              <Clock className="w-4 h-4" /> 24h SLA Updates
            </Button>
            <Button
              variant="outline"
              onClick={() => onNavigate("profile")}
              className="rounded-xl gap-2 font-medium bg-background"
            >
              <Award className="w-4 h-4" /> My Profile
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border/70 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-muted-foreground block">Applications Sent</span>
            <div className="text-2xl font-bold text-foreground mt-1 font-display">{myApps.length}</div>
            <span className="text-[11px] text-muted-foreground mt-0.5 block">Active tracking</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Send className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-card border border-border/70 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-muted-foreground block">Jobs That Fit You</span>
            <div className="text-2xl font-bold text-foreground mt-1 font-display">{goodFitJobs.length}</div>
            <span className="text-[11px] text-muted-foreground mt-0.5 block">50%+ match score</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Compass className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-card border border-border/70 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-muted-foreground block">Interviews</span>
            <div className="text-2xl font-bold text-foreground mt-1 font-display">
              {scheduledInterviews.length}
            </div>
            <span className="text-[11px] text-muted-foreground mt-0.5 block">
              {scheduledInterviews.length ? "Employer rounds active" : "None scheduled yet"}
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-card border border-border/70 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-muted-foreground block">Profile Strength</span>
            <div className="text-2xl font-bold text-foreground mt-1 font-display">{strengthPercent}%</div>
            <span className="text-[11px] text-muted-foreground mt-0.5 block">
              {doneCount} of {actionsList.length} steps completed
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Checklist & Best Fit Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Next Steps Checklist */}
        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> What to do next
              </h3>
              <p className="text-xs text-muted-foreground">Complete key steps to stand out to hiring managers.</p>
            </div>
            <span className="text-xs font-bold text-primary">{doneCount} / {actionsList.length} done</span>
          </div>

          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${strengthPercent}%` }}
            />
          </div>

          <div className="space-y-2.5 pt-1">
            {actionsList.map((item, idx) => (
              <div
                key={item.title}
                className={cn(
                  "p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-colors",
                  item.done
                    ? "bg-muted/30 border-border/40 text-muted-foreground"
                    : "bg-background border-border/80 text-foreground hover:border-primary/40"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                      item.done
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {item.done ? <Check className="w-3 h-3" /> : idx + 1}
                  </div>
                  <div>
                    <div className={cn("font-medium", item.done && "line-through opacity-80")}>
                      {item.title}
                    </div>
                    <div className="text-[11px] text-muted-foreground">{item.subtitle}</div>
                  </div>
                </div>
                {!item.done && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs rounded-lg px-2.5 shrink-0"
                    onClick={() => onNavigate(item.view)}
                  >
                    Do it <ChevronRight className="w-3 h-3 ml-0.5" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Best Job Fit & Upcoming Interviews */}
        <div className="space-y-4">
          {/* Top Job Card */}
          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" /> Best job match for you
              </h3>
              <span className="text-xs text-muted-foreground">Calculated from your skills</span>
            </div>

            {topJob ? (
              <div
                onClick={() => onOpenDrawer({ type: "job", id: topJob.id })}
                className="p-4 rounded-xl border border-border/80 bg-background hover:border-primary/50 transition-all cursor-pointer group space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={getCompanyLogo(topJob.c)}
                      alt={topJob.c}
                      className="w-10 h-10 rounded-xl object-contain p-1 border border-border/60 bg-muted/30"
                    />
                    <div>
                      <div className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                        {topJob.t}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {topJob.c} • {topJob.l} • ₹{topJob.a}–{topJob.b} LPA
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                      {topScore}%
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{matchLabel}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-border/50 text-muted-foreground">
                  <span className="text-primary font-medium group-hover:underline flex items-center gap-1">
                    Tap to view details & 24h SLA apply <ArrowRight className="w-3 h-3" />
                  </span>
                  <span>{topJob.m}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground py-4 text-center">No open jobs available.</p>
            )}
          </div>

          {/* Upcoming Interviews */}
          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" /> Upcoming Interviews
            </h3>
            <div className="space-y-2">
              {scheduledInterviews.length === 0 ? (
                <p className="text-xs text-muted-foreground py-3 text-center">
                  No interviews scheduled yet. Keep applying to verified roles!
                </p>
              ) : (
                scheduledInterviews.map((a) => {
                  const j = jobs.find((x) => x.id === a.jid);
                  return (
                    <div
                      key={a.id}
                      className="p-3 rounded-xl bg-muted/30 border border-border/60 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{j?.t || "Interview Round"}</div>
                          <div className="text-muted-foreground text-[11px]">{j?.c} • {a.iv || "Date TBD"}</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-semibold">
                        Scheduled
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Chart & Skills Demand */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Weekly Chart */}
        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> Applications in Last 7 Days
              </h3>
              <p className="text-xs text-muted-foreground">
                {weekTotal ? `${weekTotal} applications submitted this week` : "No applications sent in the last 7 days"}
              </p>
            </div>
          </div>

          <div className="h-40 flex items-end justify-between gap-2 pt-6 pb-2 px-2">
            {daysCounts.map((count, i) => {
              const heightPct = count ? Math.max(15, (count / peakDay) * 100) : 6;
              return (
                <div key={dayLabels[i]} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] font-semibold text-muted-foreground">{count || ""}</span>
                  <div
                    className={cn(
                      "w-full max-w-[36px] rounded-t-lg transition-all duration-500",
                      count > 0 ? "bg-primary" : "bg-muted/60"
                    )}
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[10px] text-muted-foreground font-medium">{dayLabels[i]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Skills vs Demand */}
        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" /> Your Skills vs. Job Demand
              </h3>
              <p className="text-xs text-muted-foreground">How many open jobs require each of your verified skills</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {(user.sk || []).slice(0, 5).map((skill) => {
              const count =
                skillDemand[
                  Object.keys(skillDemand).find((k) => k.toLowerCase() === skill.toLowerCase()) || ""
                ] || 0;
              const pct = Math.round((count / maxDemand) * 100);
              return (
                <div key={skill} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">{skill}</span>
                    <span className="text-muted-foreground">{count} jobs ask for this</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary/80 rounded-full transition-all"
                      style={{ width: `${Math.max(4, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {skillGaps.length > 0 && (
            <div className="pt-3 border-t border-border/60">
              <span className="text-xs font-semibold text-foreground block mb-2">
                Skills worth learning next (click to add):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {skillGaps.map((k) => (
                  <button
                    key={k}
                    onClick={() => onAddSkill(k)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted/60 hover:bg-primary/10 hover:text-primary text-xs font-medium text-foreground transition-colors border border-border/60"
                  >
                    <Plus className="w-3 h-3" /> {k} ({skillDemand[k]} jobs)
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
