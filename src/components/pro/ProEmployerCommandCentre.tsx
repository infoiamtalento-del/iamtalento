import React, { useMemo, useState } from "react";
import {
  Sparkles,
  Users,
  Video,
  FileCheck2,
  School,
  BarChart3,
  CheckCircle2,
  Send,
  Plus,
  Download,
  CalendarDays,
  Clock,
  ShieldCheck,
  Tag,
  Search,
  ArrowRight,
  MessageSquare,
  BriefcaseBusiness,
  IndianRupee,
  BookOpen,
  UserCheck,
  FileText,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  CANDIDATES_SEED,
  calcScore,
  calcTalentScore,
  avgCandidateScore,
  levelFromExp,
  formatINR,
  type ProApplication,
  type ProCandidate,
  type ProJob,
  type ProUser,
} from "@/data/proData";
import type { EmployerDemoState } from "@/data/employerDemo";
import { getCandidatePhoto } from "@/data/portalAssets";
import type { ProDrawerState, ProView } from "./proTypes";
import "./employer-workspace.css";

export type CommandCentreView =
  | "ai-hub"
  | "talent-pool"
  | "interviews"
  | "offers"
  | "campus-hiring"
  | "employer-analytics";

interface Props {
  view: CommandCentreView;
  user: ProUser;
  jobs: ProJob[];
  applications: ProApplication[];
  state: EmployerDemoState;
  onChange: (next: EmployerDemoState) => void;
  onNavigate: (view: ProView, query?: Record<string, string>) => void;
  onOpenDrawer: (drawer: ProDrawerState) => void;
  onPublishJob: (job: Partial<ProJob>) => void;
  onUpdateApplicantStage: (appId: number, stage: string) => void;
  onScheduleInterview?: (appId: number, slot: string) => void;
  onToast: (msg: string) => void;
}

interface OfferRecord {
  id: number;
  candidate: string;
  role: string;
  ctcLpa: number;
  joiningDate: string;
  template: string;
  approval: "Approved" | "Pending Approval";
  status: "Offer Released" | "Accepted" | "Hired" | "Declined";
  docsVerified: boolean;
  bgv: "Cleared" | "In Progress";
}

interface CampusDrive {
  id: number;
  name: string;
  colleges: string[];
  role: string;
  registered: number;
  assessed: number;
  shortlisted: number;
  offers: number;
  cutoff: number;
  status: "Active Drive" | "Scheduled";
}

export function ProEmployerCommandCentre({
  view,
  user,
  jobs,
  applications,
  state,
  onChange,
  onNavigate,
  onOpenDrawer,
  onPublishJob,
  onUpdateApplicantStage,
  onScheduleInterview,
  onToast,
}: Props) {
  const myJobs = useMemo(() => jobs.filter((j) => j.by === user.email), [jobs, user.email]);
  const myApps = useMemo(
    () => applications.filter((a) => myJobs.some((j) => j.id === a.jid)),
    [applications, myJobs]
  );

  // ---------------- 1. AI INTELLIGENCE HUB STATE ----------------
  const [aiTab, setAiTab] = useState<"screening" | "jd-studio" | "forecast">("screening");
  const [selectedAiJobId, setSelectedAiJobId] = useState<string>(() =>
    myJobs[0] ? String(myJobs[0].id) : ""
  );
  const [jdRole, setJdRole] = useState("Staff Full-Stack AI Engineer");
  const [jdExp, setJdExp] = useState(4);
  const [jdCity, setJdCity] = useState("Bengaluru");
  const [generatedJd, setGeneratedJd] = useState({
    skills: ["React", "TypeScript", "Node.js", "Python", "System Design"],
    minLpa: 22,
    medianLpa: 28,
    maxLpa: 36,
    summary:
      "Lead end-to-end architecture of AI-assisted product workflows, build resilient TypeScript & Python services, and collaborate with product and design on high-impact releases.",
  });

  // ---------------- 2. TALENT POOL & CRM STATE ----------------
  const [crmSegment, setCrmSegment] = useState<
    "all" | "saved" | "shortlisted" | "silver" | "future"
  >("all");
  const [crmSearch, setCrmSearch] = useState("");
  const [crmTags, setCrmTags] = useState<Record<string, string[]>>({
    "Aarav Mehta": ["Top 5% CIR", "Q1 Priority"],
    "Sneha Iyer": ["System Design", "Leadership"],
    "Meera Pillai": ["Silver Medalist", "Re-engage"],
  });
  const [crmNotes, setCrmNotes] = useState<Record<string, string>>({
    "Aarav Mehta": "Strong React concurrency depth; ready for panel round.",
    "Meera Pillai": "Finalist in previous cohort — great fit for upcoming Data role.",
  });
  const [newTagText, setNewTagText] = useState<Record<string, string>>({});
  const [selectedCrmNames, setSelectedCrmNames] = useState<string[]>([]);

  // ---------------- 3. INTERVIEW MANAGEMENT STATE ----------------
  const [ivCandidateId, setIvCandidateId] = useState<string>(() =>
    myApps[0] ? String(myApps[0].id) : ""
  );
  const [ivType, setIvType] = useState("Technical Round");
  const [ivFormat, setIvFormat] = useState("Panel Interview");
  const [ivInterviewer, setIvInterviewer] = useState("Ananya Sharma (Engineering Lead)");
  const [ivSlot, setIvSlot] = useState("2026-11-18T15:00");
  const [ivScores, setIvScores] = useState({ tech: 88, problem: 85, comm: 90 });

  // ---------------- 4. OFFER & HIRING STATE ----------------
  const [offers, setOffers] = useState<OfferRecord[]>(() => [
    {
      id: 901,
      candidate: myApps.find((a) => a.st === "Offer")?.name || "Kabir Shah",
      role: myJobs[0]?.t || "Senior React Developer",
      ctcLpa: 26,
      joiningDate: "2026-12-01",
      template: "Engineering Full-Time",
      approval: "Approved",
      status: "Offer Released",
      docsVerified: true,
      bgv: "In Progress",
    },
    {
      id: 902,
      candidate: "Priya Menon",
      role: myJobs[1]?.t || "Data Analyst",
      ctcLpa: 14,
      joiningDate: "2026-11-25",
      template: "Engineering Full-Time",
      approval: "Approved",
      status: "Hired",
      docsVerified: true,
      bgv: "Cleared",
    },
  ]);
  const [offerCandName, setOfferCandName] = useState(
    () => myApps.find((a) => a.st === "Interview")?.name || CANDIDATES_SEED[0].n
  );
  const [offerRole, setOfferRole] = useState(() => myJobs[0]?.t || "Senior React Developer");
  const [offerCtc, setOfferCtc] = useState(24);
  const [offerJoinDate, setOfferJoinDate] = useState("2026-12-15");
  const [offerTemplate, setOfferTemplate] = useState("Engineering Full-Time");

  // ---------------- 5. BULK & CAMPUS HIRING STATE ----------------
  const [drives, setDrives] = useState<CampusDrive[]>([
    {
      id: 301,
      name: "Class of 2027 Engineering Graduate Drive",
      colleges: ["IIT Madras", "NIT Trichy", "BITS Pilani"],
      role: "Software Development Engineer I",
      registered: 420,
      assessed: 368,
      shortlisted: 64,
      offers: 14,
      cutoff: 80,
      status: "Active Drive",
    },
    {
      id: 302,
      name: "Data & Analytics Campus Sprint",
      colleges: ["VIT Vellore", "IIIT Hyderabad"],
      role: "Associate Data Analyst",
      registered: 290,
      assessed: 245,
      shortlisted: 42,
      offers: 9,
      cutoff: 75,
      status: "Scheduled",
    },
  ]);
  const [driveName, setDriveName] = useState("");
  const [driveColleges, setDriveColleges] = useState("IIT Bombay, NIT Surathkal");
  const [driveRole, setDriveRole] = useState("Graduate Software Engineer");
  const [driveCutoff, setDriveCutoff] = useState(75);

  const exportJsonReport = (filename: string, payload: unknown) => {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    onToast(`Downloaded ${filename}`);
  };

  // =========================================================================
  // VIEW 1: AI INTELLIGENCE HUB
  // =========================================================================
  if (view === "ai-hub") {
    const targetJob =
      myJobs.find((j) => String(j.id) === selectedAiJobId) || myJobs[0] || jobs[0];

    const rankedCandidates = CANDIDATES_SEED.map((cand) => {
      const match = targetJob ? calcTalentScore(cand, targetJob) : avgCandidateScore(cand);
      const cirAvg = avgCandidateScore(cand);
      const matchedSkills = targetJob
        ? cand.sk.filter((s) =>
            targetJob.sk.some((jsk) => jsk.toLowerCase() === s.toLowerCase())
          )
        : cand.sk.slice(0, 3);
      const missingSkills = targetJob
        ? targetJob.sk.filter(
            (jsk) => !cand.sk.some((s) => s.toLowerCase() === jsk.toLowerCase())
          )
        : [];
      return { cand, match, cirAvg, matchedSkills, missingSkills };
    }).sort((a, b) => b.match - a.match);

    const handleRunJdGenerator = () => {
      const r = jdRole.toLowerCase();
      const skills = r.includes("data")
        ? ["SQL", "Python", "Tableau", "Statistics", "ETL"]
        : r.includes("cloud") || r.includes("devops")
          ? ["AWS", "Kubernetes", "Terraform", "Docker", "CI/CD"]
          : ["React", "TypeScript", "Node.js", "Python", "System Design"];
      const base = Math.max(8, jdExp * 5 + 4);
      setGeneratedJd({
        skills,
        minLpa: base,
        medianLpa: base + 6,
        maxLpa: base + 12,
        summary: `We are hiring a ${jdRole} (${jdExp}+ yrs) in ${jdCity} to architect scalable systems using ${skills
          .slice(0, 3)
          .join(", ")}. Candidates with verified TalentCIR skill scores receive fast-track technical interviews.`,
      });
      onToast("AI Job Description, Skill Tags & Salary Benchmark generated!");
    };

    return (
      <div className="employer-workspace space-y-6">
        <header className="workspace-header flex-wrap">
          <div>
            <span className="workspace-eyebrow">
              <Sparkles size={13} />
              AI Talent Intelligence · Human-Reviewed
            </span>
            <h1 className="workspace-heading">Don&apos;t Just Find Candidates. Find the Right Talent.</h1>
            <p className="workspace-description">
              Explainable AI screening, candidate ranking, salary benchmarking, and workforce forecasting — every recommendation includes transparent criteria for recruiter review.
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={() => onNavigate("talent")}>
            Open Find Talent
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </header>

        <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
          <div role="tablist" aria-label="AI Intelligence tools" className="workspace-tabs px-4 pt-2 bg-muted/20">
            {[
              { id: "screening" as const, label: "AI Resume Screening & Ranking" },
              { id: "jd-studio" as const, label: "AI Job & Salary Benchmark Studio" },
              { id: "forecast" as const, label: "AI Hiring Forecast & Skill Gaps" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={aiTab === t.id}
                onClick={() => setAiTab(t.id)}
                className="workspace-tab"
              >
                <Sparkles size={14} />
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          {aiTab === "screening" && (
            <div className="p-5 sm:p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold text-foreground">
                    Explainable AI Candidate Ranking
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Scores combine verified CIR assessments, skill overlap, experience, and budget fit. Human recruiters make every stage decision.
                  </p>
                </div>
                <select
                  aria-label="Select job to rank against"
                  value={selectedAiJobId}
                  onChange={(e) => setSelectedAiJobId(e.target.value)}
                  className="!w-auto min-w-[220px] !h-9 text-xs font-semibold"
                >
                  {myJobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      Target Role: {j.t} ({j.l})
                    </option>
                  ))}
                </select>
              </div>

              <div className="divide-y divide-border rounded-xl border border-border">
                {rankedCandidates.slice(0, 6).map(({ cand, match, cirAvg, matchedSkills, missingSkills }, idx) => {
                  const existingApp = myApps.find((a) => a.name === cand.n);
                  return (
                    <div
                      key={cand.n}
                      className="flex flex-wrap items-center justify-between gap-4 p-4 hover:bg-muted/20"
                    >
                      <div className="flex items-start gap-3.5 min-w-0 flex-1">
                        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          #{idx + 1}
                        </span>
                        <img
                          src={getCandidatePhoto(cand.n)}
                          alt={cand.n}
                          className="h-10 w-10 rounded-full object-cover border border-border shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                onOpenDrawer({
                                  type: "candidate",
                                  name: cand.n,
                                  jobId: targetJob?.id,
                                })
                              }
                              className="text-sm font-bold text-foreground hover:text-primary cursor-pointer"
                            >
                              {cand.n}
                            </button>
                            <Badge className="bg-primary/10 text-primary border-primary/25 text-[10px]">
                              {match}% Role Compatibility
                            </Badge>
                            <Badge variant="outline" className="text-[10px]">
                              CIR Readiness {cirAvg}%
                            </Badge>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            <strong>Why matched:</strong> Verified in{" "}
                            {matchedSkills.length ? matchedSkills.join(", ") : cand.sk.join(", ")} ·{" "}
                            {cand.x} yrs exp · ₹{cand.es} LPA expected
                            {missingSkills.length > 0 && ` · Skill gap: ${missingSkills.join(", ")}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs"
                          onClick={() =>
                            onOpenDrawer({
                              type: "candidate",
                              name: cand.n,
                              jobId: targetJob?.id,
                            })
                          }
                        >
                          Explain &amp; Review
                        </Button>
                        {existingApp ? (
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 text-xs"
                            onClick={() => {
                              onUpdateApplicantStage(existingApp.id, "Shortlisted");
                              onToast(`Human-reviewed: moved ${cand.n} to Shortlisted.`);
                            }}
                          >
                            Shortlist ({existingApp.st})
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => onNavigate("talent")}
                          >
                            Source in Find Talent
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {aiTab === "jd-studio" && (
            <div className="p-5 sm:p-6 space-y-5">
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="workspace-field">
                  <span>Target Role Title</span>
                  <Input value={jdRole} onChange={(e) => setJdRole(e.target.value)} />
                </label>
                <label className="workspace-field">
                  <span>Min Experience (Years)</span>
                  <Input
                    type="number"
                    min={0}
                    max={25}
                    value={jdExp}
                    onChange={(e) => setJdExp(Number(e.target.value))}
                  />
                </label>
                <label className="workspace-field">
                  <span>Location</span>
                  <Input value={jdCity} onChange={(e) => setJdCity(e.target.value)} />
                </label>
              </div>
              <Button type="button" size="sm" onClick={handleRunJdGenerator} className="gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Generate AI Description, Skills &amp; Salary Benchmark
              </Button>

              <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-primary">
                      AI Market Salary Benchmark ({jdCity})
                    </p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">
                      P25: ₹{generatedJd.minLpa} LPA · Market Median: ₹{generatedJd.medianLpa} LPA · P75: ₹{generatedJd.maxLpa} LPA
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      onPublishJob({
                        t: jdRole,
                        c: user.cp?.name || user.name,
                        l: jdCity,
                        m: "Hybrid",
                        ty: "Full-time",
                        e: jdExp,
                        a: generatedJd.minLpa,
                        b: generatedJd.maxLpa,
                        sk: generatedJd.skills,
                        description: generatedJd.summary,
                        by: user.email,
                        at: Date.now(),
                      });
                      onToast(`Published "${jdRole}" to Active Jobs!`);
                    }}
                  >
                    Publish Directly to Jobs
                  </Button>
                </div>

                <div>
                  <p className="text-xs font-semibold text-foreground mb-1.5">
                    Recommended Verified Skill Tags
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {generatedJd.skills.map((s) => (
                      <span key={s} className="workspace-chip">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-foreground mb-1">Generated Role Overview</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {generatedJd.summary}
                  </p>
                </div>
              </div>
            </div>
          )}

          {aiTab === "forecast" && (
            <div className="p-5 sm:p-6 space-y-5">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-border p-4">
                  <span className="text-xs text-muted-foreground">Predicted Time to Fill</span>
                  <strong className="mt-1 block text-2xl font-bold text-foreground">14 Days</strong>
                  <span className="mt-1 block text-[11px] text-emerald-700 font-medium">
                    38% faster using Verified CIR Pool
                  </span>
                </div>
                <div className="rounded-xl border border-border p-4">
                  <span className="text-xs text-muted-foreground">Next-Quarter Talent Demand</span>
                  <strong className="mt-1 block text-2xl font-bold text-foreground">+6 Roles</strong>
                  <span className="mt-1 block text-[11px] text-primary font-medium">
                    Frontend, Cloud &amp; Applied AI
                  </span>
                </div>
                <div className="rounded-xl border border-border p-4">
                  <span className="text-xs text-muted-foreground">Top Workforce Skill Gap</span>
                  <strong className="mt-1 block text-2xl font-bold text-foreground">
                    Kubernetes &amp; RAG
                  </strong>
                  <button
                    type="button"
                    onClick={() => onNavigate("corporate-learning")}
                    className="mt-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                  >
                    Assign Corporate Learning Cohort →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: TALENT POOL & CANDIDATE CRM
  // =========================================================================
  if (view === "talent-pool") {
    const poolRecords = CANDIDATES_SEED.map((cand) => {
      const app = myApps.find((a) => a.name === cand.n);
      const segment: "saved" | "shortlisted" | "silver" | "future" =
        app?.st === "Shortlisted" || app?.st === "Interview"
          ? "shortlisted"
          : app?.st === "Rejected"
            ? "silver"
            : crmTags[cand.n]?.length
              ? "saved"
              : "future";
      return { cand, app, segment };
    }).filter(({ cand, segment }) => {
      if (crmSegment !== "all" && segment !== crmSegment) return false;
      if (crmSearch.trim()) {
        const q = crmSearch.toLowerCase();
        const tags = (crmTags[cand.n] || []).join(" ").toLowerCase();
        return (
          cand.n.toLowerCase().includes(q) ||
          cand.sk.some((s) => s.toLowerCase().includes(q)) ||
          tags.includes(q)
        );
      }
      return true;
    });

    return (
      <div className="employer-workspace space-y-6">
        <header className="workspace-header flex-wrap">
          <div>
            <span className="workspace-eyebrow">
              <Users size={13} />
              Talent Pool &amp; Candidate CRM
            </span>
            <h1 className="workspace-heading">Build Your Own Talent Network.</h1>
            <p className="workspace-description">
              Organize saved candidates, shortlisted finalists, silver-medalist past applicants, custom tags, and bulk re-engagement campaigns.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={selectedCrmNames.length === 0}
              onClick={() => {
                onToast(
                  `Sent personalized role invitation to ${selectedCrmNames.length} candidate(s) in your Talent Pool!`
                );
                setSelectedCrmNames([]);
              }}
            >
              <Send className="mr-1.5 h-3.5 w-3.5" />
              Bulk Invite ({selectedCrmNames.length})
            </Button>
            <Button
              size="sm"
              onClick={() =>
                onToast("CSV template ready — imported candidates sync directly into Future Pipeline.")
              }
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Import Candidate List
            </Button>
          </div>
        </header>

        <div className="workspace-filter-bar !mb-0">
          <div className="workspace-filter-search">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              aria-label="Search talent pool"
              className="h-9 pl-9 text-xs"
              placeholder="Search by candidate name, skill, or CRM tag..."
              value={crmSearch}
              onChange={(e) => setCrmSearch(e.target.value)}
            />
          </div>
          {(
            [
              ["all", "All Pool"],
              ["saved", "Saved"],
              ["shortlisted", "Shortlisted Pool"],
              ["silver", "Rejected · Relevant"],
              ["future", "Future Pipeline"],
            ] as const
          ).map(([id, label]) => (
            <Button
              key={id}
              type="button"
              size="sm"
              variant={crmSegment === id ? "default" : "outline"}
              className="h-9 text-xs"
              onClick={() => setCrmSegment(id)}
            >
              {label}
            </Button>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {poolRecords.map(({ cand, segment }) => {
            const tags = crmTags[cand.n] || ["Verified Talent"];
            const checked = selectedCrmNames.includes(cand.n);
            return (
              <article key={cand.n} className="workspace-panel !p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <input
                      type="checkbox"
                      aria-label={`Select ${cand.n}`}
                      checked={checked}
                      onChange={(e) =>
                        setSelectedCrmNames((prev) =>
                          e.target.checked ? [...prev, cand.n] : prev.filter((x) => x !== cand.n)
                        )
                      }
                      className="accent-primary"
                    />
                    <img
                      src={getCandidatePhoto(cand.n)}
                      alt={cand.n}
                      className="h-10 w-10 rounded-full object-cover border border-border shrink-0"
                    />
                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={() => onOpenDrawer({ type: "candidate", name: cand.n })}
                        className="text-sm font-bold text-foreground hover:text-primary cursor-pointer"
                      >
                        {cand.n}
                      </button>
                      <p className="text-xs text-muted-foreground truncate">
                        {levelFromExp(cand.x)} · {cand.sk.slice(0, 3).join(", ")} · {cand.c}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] capitalize">
                    {segment === "silver" ? "Silver Medalist" : segment}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {tags.map((t) => (
                    <span key={t} className="workspace-chip !px-2 !py-0.5 !text-[10px]">
                      <Tag className="h-2.5 w-2.5" />
                      {t}
                    </span>
                  ))}
                  <div className="inline-flex items-center gap-1">
                    <Input
                      value={newTagText[cand.n] || ""}
                      onChange={(e) =>
                        setNewTagText((p) => ({ ...p, [cand.n]: e.target.value }))
                      }
                      placeholder="+ Add tag"
                      className="h-6 w-24 text-[11px] px-2"
                    />
                    {newTagText[cand.n]?.trim() && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2 text-[11px]"
                        onClick={() => {
                          const val = newTagText[cand.n].trim();
                          setCrmTags((p) => ({ ...p, [cand.n]: [...(p[cand.n] || []), val] }));
                          setNewTagText((p) => ({ ...p, [cand.n]: "" }));
                          onToast(`Added tag "${val}" to ${cand.n}`);
                        }}
                      >
                        Add
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    value={crmNotes[cand.n] || ""}
                    onChange={(e) =>
                      setCrmNotes((p) => ({ ...p, [cand.n]: e.target.value }))
                    }
                    placeholder="Add internal recruiter note..."
                    className="h-8 text-xs"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs shrink-0"
                    onClick={() => onToast(`Re-engagement invite sent to ${cand.n}!`)}
                  >
                    Re-engage
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: INTERVIEW MANAGEMENT & AI INTERVIEW COPILOT
  // =========================================================================
  if (view === "interviews") {
    const selectedApp =
      myApps.find((a) => String(a.id) === ivCandidateId) || myApps[0];
    const selectedJob = jobs.find((j) => j.id === selectedApp?.jid) || myJobs[0];
    const copilotQuestions = (selectedJob?.sk || ["React", "TypeScript", "System Design"]).map(
      (sk) => ({
        skill: sk,
        question: `Walk through a production bottleneck you resolved using ${sk}, and how you validated reliability under load.`,
        rubric: `Look for trade-off clarity, observability metrics, and ownership.`,
      })
    );

    const handleScheduleNewInterview = (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedApp) return;
      onScheduleInterview?.(selectedApp.id, ivSlot);
      onChange({
        ...state,
        aiInterviews: [
          {
            id: Date.now(),
            name: `${ivType} (${ivFormat})`,
            candidate: selectedApp.name,
            status: `Scheduled · ${ivSlot.replace("T", " ")}`,
          },
          ...state.aiInterviews,
        ],
      });
      onToast(`Scheduled ${ivType} with ${selectedApp.name} and generated meeting link!`);
    };

    const avgScorecard = Math.round((ivScores.tech + ivScores.problem + ivScores.comm) / 3);

    return (
      <div className="employer-workspace space-y-6">
        <header className="workspace-header flex-wrap">
          <div>
            <span className="workspace-eyebrow">
              <Video size={13} />
              Interview Management &amp; AI Copilot
            </span>
            <h1 className="workspace-heading">From Shortlisting to Selection.</h1>
            <p className="workspace-description">
              Schedule technical, panel, and HR interviews, assign interviewers, generate AI interview guides, and record structured scorecards.
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={() => onNavigate("offers")}>
            Move to Offer Management
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </header>

        <div className="grid gap-5 lg:grid-cols-12">
          <form
            onSubmit={handleScheduleNewInterview}
            className="workspace-panel lg:col-span-5 space-y-4"
          >
            <h2 className="text-sm font-bold text-foreground">Schedule Candidate Interview</h2>
            <label className="workspace-field">
              <span>Candidate</span>
              <select
                value={ivCandidateId}
                onChange={(e) => setIvCandidateId(e.target.value)}
              >
                {myApps.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.st})
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="workspace-field">
                <span>Round Type</span>
                <select value={ivType} onChange={(e) => setIvType(e.target.value)}>
                  <option>Technical Round</option>
                  <option>System Design Round</option>
                  <option>HR &amp; Culture Round</option>
                  <option>Hiring Manager Final</option>
                </select>
              </label>
              <label className="workspace-field">
                <span>Format</span>
                <select value={ivFormat} onChange={(e) => setIvFormat(e.target.value)}>
                  <option>Panel Interview</option>
                  <option>Individual 1:1</option>
                  <option>Live Coding Video</option>
                </select>
              </label>
            </div>

            <label className="workspace-field">
              <span>Assigned Interviewer(s)</span>
              <Input value={ivInterviewer} onChange={(e) => setIvInterviewer(e.target.value)} />
            </label>

            <label className="workspace-field">
              <span>Date &amp; Time</span>
              <Input
                type="datetime-local"
                value={ivSlot}
                onChange={(e) => setIvSlot(e.target.value)}
              />
            </label>

            <Button type="submit" className="w-full gap-1.5">
              <CalendarDays className="h-4 w-4" />
              Schedule &amp; Send Video Invite
            </Button>
          </form>

          <div className="workspace-panel lg:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
              <div>
                <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-primary" />
                  AI Interview Copilot &amp; Question Bank
                </h2>
                <p className="text-xs text-muted-foreground">
                  Tailored for {selectedApp?.name || "selected candidate"} · {selectedJob?.t || "Active Role"}
                </p>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-500/30 text-[11px]">
                Scorecard Avg: {avgScorecard}%
              </Badge>
            </div>

            <div className="space-y-2.5">
              {copilotQuestions.map((q) => (
                <div key={q.skill} className="rounded-lg border border-border bg-muted/20 p-3 text-xs">
                  <span className="font-bold text-primary">{q.skill}:</span>{" "}
                  <span className="font-medium text-foreground">{q.question}</span>
                  <p className="mt-1 text-[11px] text-muted-foreground">Rubric: {q.rubric}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-3 pt-2 border-t border-border text-xs">
              {(
                [
                  ["tech", "Technical Depth"],
                  ["problem", "Problem Solving"],
                  ["comm", "Communication"],
                ] as const
              ).map(([k, label]) => (
                <label key={k} className="workspace-field">
                  <span>
                    {label} ({ivScores[k]}%)
                  </span>
                  <input
                    type="range"
                    min={40}
                    max={100}
                    value={ivScores[k]}
                    onChange={(e) =>
                      setIvScores((p) => ({ ...p, [k]: Number(e.target.value) }))
                    }
                    className="accent-primary"
                  />
                </label>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() =>
                  onToast(
                    `AI Feedback Summary saved: Strong recommendation (${avgScorecard}% composite) for ${selectedApp?.name}.`
                  )
                }
              >
                Summarize Feedback with AI
              </Button>
              {selectedApp && (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    onUpdateApplicantStage(selectedApp.id, "Offer");
                    onToast(`Moved ${selectedApp.name} to Offer stage!`);
                  }}
                >
                  Recommend for Offer →
                </Button>
              )}
            </div>
          </div>
        </div>

        <section className="workspace-panel space-y-3">
          <h2 className="text-sm font-bold text-foreground">Scheduled &amp; Completed Interviews</h2>
          <div className="divide-y divide-border">
            {state.aiInterviews.map((iv) => (
              <div key={iv.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-xs">
                <div>
                  <p className="font-bold text-foreground">{iv.candidate}</p>
                  <p className="text-muted-foreground">{iv.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{iv.status}</Badge>
                  {iv.score !== undefined && (
                    <Badge className="bg-primary/10 text-primary border-primary/25">
                      Score {iv.score}%
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // =========================================================================
  // VIEW 4: OFFER & HIRING MANAGEMENT
  // =========================================================================
  if (view === "offers") {
    const handleReleaseOffer = (e: React.FormEvent) => {
      e.preventDefault();
      const rec: OfferRecord = {
        id: Date.now(),
        candidate: offerCandName,
        role: offerRole,
        ctcLpa: offerCtc,
        joiningDate: offerJoinDate,
        template: offerTemplate,
        approval: "Approved",
        status: "Offer Released",
        docsVerified: false,
        bgv: "In Progress",
      };
      setOffers((prev) => [rec, ...prev]);
      const matchingApp = myApps.find((a) => a.name === offerCandName);
      if (matchingApp) {
        onUpdateApplicantStage(matchingApp.id, "Offer");
      }
      onToast(`Offer letter (${offerCtc} LPA) generated & released to ${offerCandName}!`);
    };

    return (
      <div className="employer-workspace space-y-6">
        <header className="workspace-header flex-wrap">
          <div>
            <span className="workspace-eyebrow">
              <FileCheck2 size={13} />
              Offer &amp; Hiring Management
            </span>
            <h1 className="workspace-heading">Close the Right Talent. Faster.</h1>
            <p className="workspace-description">
              Generate structured offer letters, manage compensation approvals, track candidate acceptance, joining dates, and background verification.
            </p>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-12">
          <form onSubmit={handleReleaseOffer} className="workspace-panel lg:col-span-5 space-y-4">
            <h2 className="text-sm font-bold text-foreground">Generate &amp; Release Offer Letter</h2>
            <label className="workspace-field">
              <span>Candidate</span>
              <select
                value={offerCandName}
                onChange={(e) => setOfferCandName(e.target.value)}
              >
                {CANDIDATES_SEED.map((c) => (
                  <option key={c.n} value={c.n}>
                    {c.n} (Expected ₹{c.es} LPA)
                  </option>
                ))}
              </select>
            </label>

            <label className="workspace-field">
              <span>Job Role</span>
              <Input value={offerRole} onChange={(e) => setOfferRole(e.target.value)} required />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="workspace-field">
                <span>Total CTC (LPA)</span>
                <Input
                  type="number"
                  min={3}
                  max={150}
                  value={offerCtc}
                  onChange={(e) => setOfferCtc(Number(e.target.value))}
                  required
                />
              </label>
              <label className="workspace-field">
                <span>Target Joining Date</span>
                <Input
                  type="date"
                  value={offerJoinDate}
                  onChange={(e) => setOfferJoinDate(e.target.value)}
                  required
                />
              </label>
            </div>

            <label className="workspace-field">
              <span>Offer Letter Template</span>
              <select value={offerTemplate} onChange={(e) => setOfferTemplate(e.target.value)}>
                <option>Engineering Full-Time</option>
                <option>Executive / Principal</option>
                <option>Campus Graduate Offer</option>
                <option>Fixed-Term Consultant</option>
              </select>
            </label>

            <Button type="submit" className="w-full gap-1.5">
              <Send className="h-4 w-4" />
              Approve &amp; Release Offer
            </Button>
          </form>

          <div className="workspace-panel lg:col-span-7 space-y-4">
            <h2 className="text-sm font-bold text-foreground">Released Offers &amp; Onboarding Tracker</h2>
            <div className="divide-y divide-border">
              {offers.map((o) => (
                <div key={o.id} className="py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <strong className="text-sm text-foreground">{o.candidate}</strong>
                      <Badge variant="outline">{o.template}</Badge>
                      <Badge
                        className={
                          o.status === "Hired" || o.status === "Accepted"
                            ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30"
                            : "bg-primary/10 text-primary border-primary/25"
                        }
                      >
                        {o.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">
                      {o.role} · <strong>₹{o.ctcLpa} LPA</strong> · Joining {o.joiningDate} · BGV:{" "}
                      <strong>{o.bgv}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {o.status === "Offer Released" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs"
                        onClick={() => {
                          setOffers((prev) =>
                            prev.map((x) =>
                              x.id === o.id
                                ? { ...x, status: "Hired", docsVerified: true, bgv: "Cleared" }
                                : x
                            )
                          );
                          onToast(`${o.candidate} marked Accepted & Hired!`);
                        }}
                      >
                        Mark Hired
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 text-xs"
                      onClick={() => exportJsonReport(`offer-${o.candidate}.json`, o)}
                    >
                      <Download className="h-3.5 w-3.5 mr-1" />
                      Letter
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 5: BULK & CAMPUS HIRING
  // =========================================================================
  if (view === "campus-hiring") {
    const handleCreateDrive = (e: React.FormEvent) => {
      e.preventDefault();
      if (!driveName.trim()) return;
      const next: CampusDrive = {
        id: Date.now(),
        name: driveName.trim(),
        colleges: driveColleges
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        role: driveRole.trim(),
        registered: 150,
        assessed: 0,
        shortlisted: 0,
        offers: 0,
        cutoff: driveCutoff,
        status: "Active Drive",
      };
      setDrives((prev) => [next, ...prev]);
      setDriveName("");
      onToast(`Launched campus recruitment drive "${next.name}"!`);
    };

    return (
      <div className="employer-workspace space-y-6">
        <header className="workspace-header flex-wrap">
          <div>
            <span className="workspace-eyebrow">
              <School size={13} />
              Bulk &amp; Campus Hiring
            </span>
            <h1 className="workspace-heading">Hire at Scale. Without the Complexity.</h1>
            <p className="workspace-description">
              Run multi-campus drives, dispatch bulk proctored skill assessments, auto-shortlist by CIR cutoff, and schedule mass interviews.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onNavigate("employer-assessments")}
          >
            Link Proctored Assessment
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </header>

        <div className="grid gap-5 lg:grid-cols-12">
          <form onSubmit={handleCreateDrive} className="workspace-panel lg:col-span-5 space-y-4">
            <h2 className="text-sm font-bold text-foreground">Create Bulk / Campus Drive</h2>
            <label className="workspace-field">
              <span>Campaign / Drive Name</span>
              <Input
                value={driveName}
                onChange={(e) => setDriveName(e.target.value)}
                placeholder="e.g. Winter 2026 NIT/IIT SDE Drive"
                required
              />
            </label>
            <label className="workspace-field">
              <span>Target Colleges / Universities (comma separated)</span>
              <Input
                value={driveColleges}
                onChange={(e) => setDriveColleges(e.target.value)}
                required
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="workspace-field">
                <span>Role Title</span>
                <Input
                  value={driveRole}
                  onChange={(e) => setDriveRole(e.target.value)}
                  required
                />
              </label>
              <label className="workspace-field">
                <span>Auto-Shortlist CIR Cutoff (%)</span>
                <Input
                  type="number"
                  min={50}
                  max={95}
                  value={driveCutoff}
                  onChange={(e) => setDriveCutoff(Number(e.target.value))}
                />
              </label>
            </div>
            <Button type="submit" className="w-full gap-1.5">
              <Plus className="h-4 w-4" />
              Launch Campus Drive
            </Button>
          </form>

          <div className="lg:col-span-7 space-y-4">
            {drives.map((d) => (
              <article key={d.id} className="workspace-panel space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{d.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {d.role} · Cutoff {d.cutoff}% · {d.colleges.join(" · ")}
                    </p>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-500/30">
                    {d.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-4 gap-2 rounded-lg border border-border bg-muted/20 p-3 text-center text-xs">
                  <div>
                    <span className="block text-[11px] text-muted-foreground">Registered</span>
                    <strong className="text-sm text-foreground">{d.registered}</strong>
                  </div>
                  <div>
                    <span className="block text-[11px] text-muted-foreground">Assessed</span>
                    <strong className="text-sm text-foreground">{d.assessed}</strong>
                  </div>
                  <div>
                    <span className="block text-[11px] text-muted-foreground">Shortlisted</span>
                    <strong className="text-sm text-primary">{d.shortlisted}</strong>
                  </div>
                  <div>
                    <span className="block text-[11px] text-muted-foreground">Offers</span>
                    <strong className="text-sm text-emerald-700">{d.offers}</strong>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs"
                    onClick={() =>
                      onToast(`Sent bulk proctored assessment links to ${d.registered} students!`)
                    }
                  >
                    Bulk Assessment Invite
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs"
                    onClick={() =>
                      onToast(`Auto-assigned panel interview slots for ${d.shortlisted || 24} qualifiers!`)
                    }
                  >
                    Mass Schedule Interviews
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 6: ANALYTICS & RECRUITMENT REPORTS
  // =========================================================================
  const totalAppsCount = Math.max(1, myApps.length);
  const shortlistedCount = myApps.filter(
    (a) => a.st === "Shortlisted" || a.st === "Interview" || a.st === "Offer"
  ).length;
  const interviewStageCount = myApps.filter(
    (a) => a.st === "Interview" || a.st === "Offer"
  ).length;
  const offerStageCount = myApps.filter((a) => a.st === "Offer").length;

  const appConversion = Math.round((shortlistedCount / totalAppsCount) * 100);
  const ivConversion = interviewStageCount
    ? Math.round((offerStageCount / interviewStageCount) * 100)
    : 42;

  const reportTypes = [
    "Monthly Recruitment Report",
    "Department-Wise Hiring Report",
    "Job-Wise Performance Report",
    "Skills Availability & CIR Report",
    "Assessment Performance Report",
    "Campus Hiring Report",
    "Recruitment Cost Analysis",
    "Recruiter Productivity Report",
  ];

  return (
    <div className="employer-workspace space-y-6">
      <header className="workspace-header flex-wrap">
        <div>
          <span className="workspace-eyebrow">
            <BarChart3 size={13} />
            Analytics &amp; Recruitment Reports
          </span>
          <h1 className="workspace-heading">Every Hiring Decision Backed by Intelligence.</h1>
          <p className="workspace-description">
            Track time-to-hire, cost-per-hire, stage conversion velocity, candidate CIR readiness, and export executive hiring reports.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() =>
            exportJsonReport("talentcir-recruitment-intelligence.json", {
              generatedAt: new Date().toISOString(),
              company: user.cp?.name || user.name,
              activeJobs: myJobs.length,
              totalApplications: myApps.length,
              applicationToShortlistConversionPct: appConversion,
              interviewToOfferConversionPct: ivConversion,
            })
          }
        >
          <Download className="mr-1.5 h-3.5 w-3.5" />
          Export Full Analytics
        </Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Avg Time to Hire", value: "16 Days", sub: "−5d vs industry avg" },
          { label: "Avg Cost per Hire", value: "₹18,400", sub: "28% saved via CIR screening" },
          { label: "Application → Shortlist", value: `${appConversion}%`, sub: `${shortlistedCount} qualified` },
          { label: "Interview → Offer", value: `${ivConversion}%`, sub: "High calibration accuracy" },
          { label: "Offer Acceptance Rate", value: "89%", sub: "Salary benchmark aligned" },
        ].map((m) => (
          <article key={m.label} className="workspace-panel !p-4">
            <span className="text-xs text-muted-foreground">{m.label}</span>
            <strong className="mt-1 block text-2xl font-bold text-foreground">{m.value}</strong>
            <span className="mt-1 block text-[11px] text-primary font-medium">{m.sub}</span>
          </article>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="workspace-panel space-y-3">
          <h2 className="text-sm font-bold text-foreground">Source of Hire Effectiveness</h2>
          {[
            { src: "TalentCIR Verified CIR Pool", pct: 46, note: "Highest offer conversion (92%)" },
            { src: "Direct Active Job Postings", pct: 29, note: "Inbound role applicants" },
            { src: "Campus Recruitment Drives", pct: 16, note: "Pre-assessed graduate cohorts" },
            { src: "Team Referrals & CRM Re-engage", pct: 9, note: "Silver-medalist talent pool" },
          ].map((row) => (
            <div key={row.src} className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">{row.src}</span>
                <span className="font-bold text-primary">{row.pct}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${row.pct}%` }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground">{row.note}</p>
            </div>
          ))}
        </section>

        <section className="workspace-panel space-y-3">
          <h2 className="text-sm font-bold text-foreground">Downloadable Executive Reports</h2>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {reportTypes.map((title) => (
              <button
                key={title}
                type="button"
                onClick={() =>
                  exportJsonReport(`${title.toLowerCase().replace(/\s+/g, "-")}.json`, {
                    report: title,
                    generatedAt: new Date().toISOString(),
                    jobs: myJobs.length,
                    applications: myApps.length,
                  })
                }
                className="flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-left text-xs font-semibold text-foreground hover:border-primary/50 cursor-pointer"
              >
                <span className="truncate">{title}</span>
                <Download className="h-3.5 w-3.5 shrink-0 text-primary" />
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
