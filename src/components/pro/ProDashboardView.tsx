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
  Bell,
  UserCircle,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProHero } from "./ProHero";
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
      title: "Add headline & about",
      done: !!(user.head && user.about),
      view: "profile",
      subtitle: "Tell recruiters who you are and what you specialize in",
    },
    {
      title: "Add 3+ skills",
      done: (user.sk || []).length >= 3,
      view: "profile",
      subtitle: "Skills drive job matching",
    },
    {
      title: "Add a certification",
      done: (user.ce || []).length > 0,
      view: "cert",
      subtitle: "Proof of skill builds immediate trust",
    },
    {
      title: "Apply to your top match",
      done: !!topJob && myApps.some((a) => a.jid === topJob.id),
      view: "jobs",
      subtitle: "Your best-fit opening is ready for review",
    },
    {
      title: "Save a search",
      done: (user.ss || []).length > 0,
      view: "jobs",
      subtitle: "Get alerted for new jobs",
    },
  ];

  const doneCount = actionsList.filter((x) => x.done).length;
  const strengthPercent = Math.round((doneCount / actionsList.length) * 100);
  const goodFitJobs = jobs.filter((j) => calcScore(j, user) >= 50);
  const scheduledInterviews = myApps.filter((a) => a.iv || a.st === "Interview");
  const nextAction = actionsList.find((x) => !x.done);
  const completedActions = actionsList.filter((x) => x.done);

  const scoreTier = (n: number) =>
    n >= 70
      ? { stroke: "stroke-emerald-500", text: "text-emerald-600 dark:text-emerald-400" }
      : n >= 40
      ? { stroke: "stroke-amber-500", text: "text-amber-600 dark:text-amber-400" }
      : { stroke: "stroke-blue-500", text: "text-blue-600 dark:text-blue-400" };

  const topTier = scoreTier(topScore);
  const RING_R = 15.9155;

  const statCards: Array<{
    label: string;
    value: React.ReactNode;
    helper: string;
    icon: React.ReactNode;
    view: ProView;
  }> = [
    {
      label: "Applications sent",
      value: myApps.length,
      helper: myApps.length ? "Jobs you have applied to" : "You have not applied yet",
      icon: <Send className="h-4 w-4" />,
      view: "applied",
    },
    {
      label: "Jobs that fit you",
      value: goodFitJobs.length,
      helper: "Open jobs matching 50%+ of your skills",
      icon: <Compass className="h-4 w-4" />,
      view: "jobs",
    },
    {
      label: "Interviews",
      value: scheduledInterviews.length,
      helper: scheduledInterviews.length ? "Employer rounds active" : "None yet, keep applying",
      icon: <Calendar className="h-4 w-4" />,
      view: "applied",
    },
    {
      label: "Profile strength",
      value: `${strengthPercent}%`,
      helper: `${doneCount} of ${actionsList.length} steps done`,
      icon: <Award className="h-4 w-4" />,
      view: "profile",
    },
  ];

  const heroPill =
    "inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold text-white ring-1 ring-white/30 backdrop-blur-sm transition-colors hover:bg-white/25";

  const userSkillRows = (user.sk || []).map((skill) => {
    const key = Object.keys(skillDemand).find((k) => k.toLowerCase() === skill.toLowerCase()) || "";
    return { skill, count: skillDemand[key] || 0 };
  });
  const maxSkillRow = Math.max(1, ...userSkillRows.map((r) => r.count));

  return (
    <div className="space-y-5">
      {/* Hero Welcome Banner */}
      <ProHero
        title={`Welcome back, ${user.name.split(" ")[0]}`}
        subtitle={`${goodFitJobs.length} ${goodFitJobs.length === 1 ? "job matches" : "jobs match"} 50%+ of your skills. Finish the steps below to get noticed faster.`}
      >
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button type="button" onClick={() => onNavigate("jobs")} className={heroPill}>
            <Compass className="h-3.5 w-3.5" /> Find jobs
          </button>
          <button type="button" onClick={() => onNavigate("notif")} className={heroPill}>
            <Bell className="h-3.5 w-3.5" /> Notifications
          </button>
          <button type="button" onClick={() => onNavigate("profile")} className={heroPill}>
            <UserCircle className="h-3.5 w-3.5" /> My Profile
          </button>
        </div>
      </ProHero>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {s.icon}
            </span>
            <div className="min-w-0 flex-1">
              <div className="font-display text-2xl font-bold leading-none text-primary">{s.value}</div>
              <div className="mt-1.5 text-sm font-semibold text-foreground">{s.label}</div>
              <div className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{s.helper}</div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="h-7 shrink-0 rounded-lg border-primary/30 px-2.5 text-xs font-semibold text-primary hover:bg-primary/5 hover:text-primary"
              onClick={() => onNavigate(s.view)}
            >
              View
            </Button>
          </div>
        ))}
      </div>

      {/* Checklist & Best Fit Row */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* What to do next */}
        <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CheckCircle2 className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-display text-sm font-semibold text-foreground">What to do next</h3>
              <p className="text-xs text-muted-foreground">
                {doneCount} of {actionsList.length} steps done
              </p>
            </div>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${strengthPercent}%` }}
            />
          </div>

          {nextAction ? (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Search className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-foreground">{nextAction.title}</div>
                  <div className="truncate text-xs text-muted-foreground">{nextAction.subtitle}</div>
                </div>
              </div>
              <Button
                size="sm"
                className="h-8 shrink-0 rounded-lg px-3.5 text-xs font-semibold"
                onClick={() => onNavigate(nextAction.view)}
              >
                Do it
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm font-medium text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" /> All steps complete. Your profile is in great shape.
            </div>
          )}

          {completedActions.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">Completed</div>
              <div className="flex flex-wrap gap-1.5">
                {completedActions.map((item) => (
                  <span
                    key={item.title}
                    className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400"
                  >
                    <Check className="h-3 w-3" /> {item.title}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Best job & Upcoming interviews */}
        <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-display text-sm font-semibold text-foreground">Best job for you</h3>
              <p className="text-xs text-muted-foreground">The open job closest to your skills</p>
            </div>
          </div>

          {topJob ? (
            <div
              onClick={() => onOpenDrawer({ type: "job", id: topJob.id })}
              className="group cursor-pointer space-y-2 rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary/50"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <img
                    src={getCompanyLogo(topJob.c)}
                    alt={topJob.c}
                    className="h-11 w-11 shrink-0 rounded-xl border border-border bg-muted/30 object-contain p-1"
                  />
                  <div className="min-w-0">
                    <div className="truncate font-display text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                      {topJob.t}
                    </div>
                    <div className="truncate text-xs font-medium text-foreground/80">{topJob.c}</div>
                    <div className="truncate text-[11px] text-muted-foreground">
                      {topJob.l} · ₹{topJob.a}–{topJob.b} LPA
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-center gap-1">
                  <div className="relative h-14 w-14">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36" aria-hidden>
                      <circle cx="18" cy="18" r={RING_R} fill="none" strokeWidth="3.5" className="stroke-muted" />
                      <circle
                        cx="18"
                        cy="18"
                        r={RING_R}
                        fill="none"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeDasharray={`${topScore}, 100`}
                        className={cn("transition-all duration-700", topTier.stroke)}
                      />
                    </svg>
                    <span
                      className={cn(
                        "absolute inset-0 flex items-center justify-center text-xs font-bold",
                        topTier.text
                      )}
                    >
                      {topScore}%
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground">{matchLabel}</span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-primary group-hover:underline">
                Tap to see details and apply <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          ) : (
            <p className="py-4 text-center text-xs text-muted-foreground">No open jobs available.</p>
          )}

          {/* Upcoming Interviews */}
          <div className="space-y-3 rounded-xl border border-border bg-background p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Calendar className="h-4 w-4" />
              </span>
              <div>
                <h4 className="font-display text-sm font-semibold text-foreground">Upcoming interviews</h4>
                <p className="text-xs text-muted-foreground">Scheduled by employers</p>
              </div>
            </div>
            {scheduledInterviews.length === 0 ? (
              <p className="text-xs text-muted-foreground">No interviews scheduled yet.</p>
            ) : (
              <div className="space-y-2">
                {scheduledInterviews.map((a) => {
                  const j = jobs.find((x) => x.id === a.jid);
                  return (
                    <div
                      key={a.id}
                      className="flex items-center justify-between gap-2 rounded-xl border border-border/60 bg-muted/30 p-3 text-xs"
                    >
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-foreground">{j?.t || "Interview Round"}</div>
                        <div className="truncate text-[11px] text-muted-foreground">
                          {j?.c} · {a.iv || "Date TBD"}
                        </div>
                      </div>
                      <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        Scheduled
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 7-Day Chart & Skills Demand */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Weekly Chart */}
        <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <TrendingUp className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-display text-sm font-semibold text-foreground">Your applications this week</h3>
              <p className="text-xs text-muted-foreground">{weekTotal} sent in the last 7 days</p>
            </div>
          </div>

          <div className="flex h-44 items-end justify-between gap-2 px-1 pt-4">
            {daysCounts.map((count, i) => {
              const heightPct = count ? Math.max(18, (count / peakDay) * 100) : 6;
              return (
                <div key={dayLabels[i]} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                  <span className="h-4 text-[11px] font-semibold text-foreground">{count}</span>
                  <div className="flex w-full flex-1 items-end justify-center">
                    <div
                      className={cn(
                        "w-full max-w-[40px] rounded-md transition-all duration-500",
                        count > 0 ? "bg-primary" : "bg-primary/15"
                      )}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground">{dayLabels[i]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Skills vs Demand */}
        <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Brain className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-display text-sm font-semibold text-foreground">Your skills vs. job demand</h3>
              <p className="text-xs text-muted-foreground">How many open jobs ask for each of your skills</p>
            </div>
          </div>

          {userSkillRows.length === 0 ? (
            <p className="py-2 text-xs text-muted-foreground">Add skills to your profile to compare with job demand.</p>
          ) : (
            <div className="space-y-2">
              {userSkillRows.map(({ skill, count }) => (
                <div key={skill} className="grid grid-cols-[minmax(0,7rem)_1fr_3.5rem] items-center gap-3 text-xs">
                  <span className="truncate font-medium text-foreground">{skill}</span>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${Math.round((count / maxSkillRow) * 100)}%` }}
                    />
                  </div>
                  <span className="text-right text-[11px] text-muted-foreground">{count} jobs</span>
                </div>
              ))}
            </div>
          )}

          {skillGaps.length > 0 && (
            <div className="border-t border-border pt-3">
              <span className="mb-2 block text-xs font-semibold text-foreground">
                Skills worth learning next <span className="font-normal text-muted-foreground">(tap to add)</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {skillGaps.map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => onAddSkill(k)}
                    className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                  >
                    <Plus className="h-3 w-3" /> {k} · {skillDemand[k]} jobs
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
