import React, { useState, useMemo } from "react";
import {
  Building2,
  Briefcase,
  Users,
  Layers,
  Search,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  Plus,
  Filter,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Award,
  Check,
  SlidersHorizontal,
  RotateCcw,
  Kanban,
  List,
  Eye,
  Send,
  MessageSquare,
  ArrowRightLeft,
  Lock,
  Wallet,
  CreditCard,
  AlertTriangle,
  X,
  FileCheck,
  CheckCircle,
  GraduationCap,
  IndianRupee,
  Zap,
  Star,
  Bookmark,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  ProUser,
  ProJob,
  ProCandidate,
  ProApplication,
  CANDIDATES_SEED,
  JOB_TEMPLATES,
  COMPANY_BENEFITS,
  STAGES,
  calcTalentScore,
  levelFromExp,
  avgCandidateScore,
  calcScore,
  timeAgo,
  getRemainingTime,
  formatINR,
} from "@/data/proData";
import { getCandidatePhoto, getCompanyLogo } from "@/data/portalAssets";
import { ProView, ProDrawerState } from "./proTypes";

interface ProEmployerViewsProps {
  view: "cp" | "post" | "talent" | "pipe";
  user: ProUser;
  jobs: ProJob[];
  applications: ProApplication[];
  onSaveCompanyProfile: (cpData: any) => void;
  onPublishJob: (jobData: Partial<ProJob>) => void;
  onUpdateApplicantStage: (appId: number, stage: string) => void;
  onBulkUpdateStage: (appIds: number[], stage: string) => void;
  onBulkSendReview: (appIds: number[]) => void;
  onOpenDrawer: (drawer: ProDrawerState) => void;
  onToast: (msg: string) => void;
  onUpdateWallet?: (newBalance: number, newTx: any) => void;
  onUpdateUser?: (updated: ProUser) => void;
  onNavigate?: (view: ProView) => void;
}

export const ProEmployerViews: React.FC<ProEmployerViewsProps> = ({
  view,
  user,
  jobs,
  applications,
  onSaveCompanyProfile,
  onPublishJob,
  onUpdateApplicantStage,
  onBulkUpdateStage,
  onBulkSendReview,
  onOpenDrawer,
  onToast,
  onUpdateWallet,
  onUpdateUser,
  onNavigate,
}) => {
  const myJobs = jobs.filter((j) => j.by === user.email);
  const myApps = applications.filter((a) => myJobs.some((j) => j.id === a.jid));
  const findJob = (a: ProApplication) => jobs.find((j) => j.id === a.jid);

  // 1. COMPANY PROFILE VIEW
  const [cpData, setCpData] = useState(() => ({
    name: user.cp?.name || user.name || "Super30 Technologies",
    about: user.cp?.about || "Building developer tooling and autonomous engineering platforms for modern teams.",
    mission: user.cp?.mission || "Empowering developers to build 10x faster with verified engineering trust.",
    ind: user.cp?.ind || "Software & Cloud",
    size: user.cp?.size || "Mid",
    hq: user.cp?.hq || "Bengaluru, India",
    site: user.cp?.site || "super30.ai",
    ben: user.cp?.ben || ["Remote work", "Health insurance", "Learning budget", "Flexible hours", "Stock options"],
  }));

  const handleToggleBenefit = (benefit: string) => {
    setCpData((prev) => ({
      ...prev,
      ben: prev.ben.includes(benefit)
        ? prev.ben.filter((b) => b !== benefit)
        : [...prev.ben, benefit],
    }));
  };

  const handleSaveCp = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCompanyProfile(cpData);
    onToast("Company profile saved successfully!");
  };

  // 2. POST A JOB VIEW
  const [jobTitle, setJobTitle] = useState("Senior React Developer");
  const [jobLocation, setJobLocation] = useState("Bengaluru");
  const [jobWorkMode, setJobWorkMode] = useState<"Onsite" | "Hybrid" | "Remote">("Hybrid");
  const [jobType, setJobType] = useState<"Full-time" | "Internship" | "Contract">("Full-time");
  const [jobMinExp, setJobMinExp] = useState(3);
  const [jobMinSal, setJobMinSal] = useState(18);
  const [jobMaxSal, setJobMaxSal] = useState(30);
  const [jobSkills, setJobSkills] = useState("React, TypeScript, Next.js, Node.js");

  const handleApplyTemplate = (tpl: (typeof JOB_TEMPLATES)[0]) => {
    setJobTitle(tpl[1]);
    setJobWorkMode(tpl[2]);
    setJobMinExp(tpl[3]);
    setJobMinSal(tpl[4]);
    setJobMaxSal(tpl[5]);
    setJobSkills(tpl[6]);
    onToast(`Applied "${tpl[0]}" template!`);
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim()) {
      onToast("Please enter a job title");
      return;
    }

    const skillsArray = jobSkills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    onPublishJob({
      t: jobTitle.trim(),
      c: user.cp?.name || user.name,
      l: jobLocation.trim() || "Remote",
      m: jobWorkMode,
      ty: jobType,
      e: jobMinExp,
      a: jobMinSal,
      b: jobMaxSal,
      sk: skillsArray,
      by: user.email,
      at: Date.now(),
    });

    onToast(`Published job listing "${jobTitle}"!`);
  };

  // 3. FIND TALENT VIEW
  const [talentOption, setTalentOption] = useState<"candidates" | "verified">("candidates");
  const [candidateToUnlock, setCandidateToUnlock] = useState<ProCandidate | null>(null);
  const [unlockedCandidateNames, setUnlockedCandidateNames] = useState<string[]>(() => {
    return user.unlockedCandidates || user.tal || [];
  });

  const [talentQuery, setTalentQuery] = useState("");
  const [talentSmartQuery, setTalentSmartQuery] = useState("");
  const [talentJobFilter, setTalentJobFilter] = useState<string>("");
  const [talentExpLevels, setTalentExpLevels] = useState<string[]>([]);
  const [talentRoleFilter, setTalentRoleFilter] = useState<string>("all");
  const [talentQuickFilter, setTalentQuickFilter] = useState<string>("all");
  const [talentMinAssessment, setTalentMinAssessment] = useState(0);
  const [talentOnlyCertified, setTalentOnlyCertified] = useState(false);
  const [talentMaxSalary, setTalentMaxSalary] = useState(60);
  const [talentNoticePeriod, setTalentNoticePeriod] = useState(999);
  const [talentSort, setTalentSort] = useState<"cir" | "s" | "a" | "x" | "sal-asc">("cir");
  const [selectedTalentToCompare, setSelectedTalentToCompare] = useState<string[]>([]);

  const handleConfirmDeductAndUnlock = () => {
    if (!candidateToUnlock) return;
    const currentBal = user.wal?.bal || 0;
    const unlockCost = 2999;

    if (currentBal < unlockCost) {
      onToast("Insufficient wallet balance. Please top up your wallet or view pricing plans.");
      return;
    }

    const newBal = currentBal - unlockCost;
    const tx = {
      id: `TXN-VER-${Date.now()}`,
      at: Date.now(),
      type: "debit" as const,
      amt: unlockCost,
      desc: `Verified Profile Access - ${candidateToUnlock.n}`,
      via: "Talento Wallet",
      st: "Completed",
      bal: newBal,
    };

    if (onUpdateWallet) {
      onUpdateWallet(newBal, tx);
    }

    const updatedUnlocked = Array.from(new Set([...unlockedCandidateNames, candidateToUnlock.n]));
    setUnlockedCandidateNames(updatedUnlocked);

    if (onUpdateUser) {
      onUpdateUser({
        ...user,
        tal: updatedUnlocked,
        unlockedCandidates: updatedUnlocked,
      });
    }

    onToast(`₹2,999 deducted from wallet. Verified dossier for ${candidateToUnlock.n} unlocked!`);
    const unlockedName = candidateToUnlock.n;
    setCandidateToUnlock(null);

    // Open candidate details
    onOpenDrawer({ type: "candidate", name: unlockedName, jobId: selectedJobObj?.id });
  };

  const handleSmartTalentSearch = () => {
    const q = talentSmartQuery.toLowerCase();
    if (!q) return;

    if (q.includes("react") || q.includes("frontend")) {
      setTalentQuery("React");
      setTalentRoleFilter("frontend");
    } else if (q.includes("python") || q.includes("ml") || q.includes("ai")) {
      setTalentRoleFilter("ml");
    } else if (q.includes("devops") || q.includes("cloud") || q.includes("kubernetes")) {
      setTalentRoleFilter("devops");
    } else if (q.includes("backend") || q.includes("golang") || q.includes("java")) {
      setTalentRoleFilter("backend");
    }
    if (q.includes("certified")) setTalentOnlyCertified(true);
    if (q.includes("senior")) setTalentExpLevels(["Senior"]);
    if (q.includes("immediate")) setTalentNoticePeriod(0);

    onToast(`Filtered talent pool for "${talentSmartQuery}"`);
  };

  const selectedJobObj = myJobs.find((j) => String(j.id) === talentJobFilter);

  const filteredCandidates = useMemo(() => {
    return CANDIDATES_SEED.filter((c) => {
      if (talentQuery) {
        const q = talentQuery.toLowerCase();
        const matchesName = c.n.toLowerCase().includes(q);
        const matchesSkill = c.sk.some((s) => s.toLowerCase().includes(q));
        const matchesCity = c.c.toLowerCase().includes(q);
        const matchesHeadline = (c.headline || "").toLowerCase().includes(q);
        const matchesCompany = (c.currentCompany || "").toLowerCase().includes(q);
        if (!matchesName && !matchesSkill && !matchesCity && !matchesHeadline && !matchesCompany) return false;
      }

      if (talentRoleFilter !== "all") {
        const combined = `${c.headline || ""} ${c.sk.join(" ")}`.toLowerCase();
        if (talentRoleFilter === "frontend" && !combined.includes("frontend") && !combined.includes("react")) return false;
        if (talentRoleFilter === "backend" && !combined.includes("backend") && !combined.includes("golang") && !combined.includes("java")) return false;
        if (talentRoleFilter === "devops" && !combined.includes("devops") && !combined.includes("cloud") && !combined.includes("kubernetes") && !combined.includes("aws")) return false;
        if (talentRoleFilter === "ml" && !combined.includes("ml") && !combined.includes("pytorch") && !combined.includes("ai")) return false;
        if (talentRoleFilter === "data" && !combined.includes("data") && !combined.includes("sql") && !combined.includes("analytics")) return false;
        if (talentRoleFilter === "mobile" && !combined.includes("mobile") && !combined.includes("ios") && !combined.includes("react native")) return false;
        if (talentRoleFilter === "design" && !combined.includes("design") && !combined.includes("ux") && !combined.includes("figma")) return false;
      }

      if (talentQuickFilter === "immediate" && (c.nt || 0) > 15) return false;
      if (talentQuickFilter === "high-score" && (c.cirScore || 0) < 95) return false;
      if (talentQuickFilter === "tier1" && !["Razorpay", "Swiggy", "Flipkart", "CRED", "BrowserStack", "PhonePe", "Postman", "Zomato"].includes(c.currentCompany || "")) return false;

      if (talentExpLevels.length > 0) {
        const lvl = levelFromExp(c.x);
        if (!talentExpLevels.includes(lvl)) return false;
      }

      if (avgCandidateScore(c) < talentMinAssessment) return false;
      if (talentOnlyCertified && (!c.ce || c.ce.length === 0)) return false;
      if (c.es > talentMaxSalary) return false;
      if (talentNoticePeriod !== 999 && (c.nt || 0) > talentNoticePeriod) return false;

      return true;
    }).sort((a, b) => {
      if (talentSort === "cir") return (b.cirScore || 0) - (a.cirScore || 0);
      if (talentSort === "a") return avgCandidateScore(b) - avgCandidateScore(a);
      if (talentSort === "x") return b.x - a.x;
      if (talentSort === "sal-asc") return a.es - b.es;
      return calcTalentScore(b, selectedJobObj) - calcTalentScore(a, selectedJobObj);
    });
  }, [
    talentQuery,
    talentRoleFilter,
    talentQuickFilter,
    talentExpLevels,
    talentMinAssessment,
    talentOnlyCertified,
    talentMaxSalary,
    talentNoticePeriod,
    talentSort,
    selectedJobObj,
  ]);

  const displayCandidates = useMemo(() => {
    return filteredCandidates.filter((cand) => {
      if (talentOption === "verified") {
        return cand.verified === true;
      }
      return cand.verified !== true;
    });
  }, [filteredCandidates, talentOption]);

  const verifiedCandidatesCount = useMemo(() => {
    return CANDIDATES_SEED.filter((c) => c.verified === true).length;
  }, []);

  const standardCandidatesCount = useMemo(() => {
    return CANDIDATES_SEED.filter((c) => c.verified !== true).length;
  }, []);

  // 4. PIPELINE VIEW
  const [pipeJobFilter, setPipeJobFilter] = useState<string>("");
  const [pipeSearch, setPipeSearch] = useState("");
  const [pipeMinMatch, setPipeMinMatch] = useState(0);
  const [pipeOnlyNeedingUpdate, setPipeOnlyNeedingUpdate] = useState(false);
  const [pipeViewMode, setPipeViewMode] = useState<"board" | "list">("board");
  const [selectedApplicants, setSelectedApplicants] = useState<number[]>([]);

  const filteredPipelineApps = useMemo(() => {
    return myApps.filter((a) => {
      const j = findJob(a);
      if (!j) return false;
      if (pipeJobFilter && String(a.jid) !== pipeJobFilter) return false;
      if (pipeSearch && !a.name.toLowerCase().includes(pipeSearch.toLowerCase())) return false;
      if (calcScore(j, a) < pipeMinMatch) return false;
      if (pipeOnlyNeedingUpdate && (a.upd || []).length > 0) return false;
      return true;
    });
  }, [myApps, pipeJobFilter, pipeSearch, pipeMinMatch, pipeOnlyNeedingUpdate]);

  // RENDER BASED ON VIEW
  if (view === "cp") {
    // COMPANY PROFILE
    return (
      <div className="space-y-6">
        <div className="bg-card border border-border/80 rounded-2xl p-6 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
              <Building2 className="w-3.5 h-3.5" /> Employer Branding
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-display">
              Company Profile & Culture
            </h1>
            <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
              Showcase your company mission, headquarters, perks, and values to attract top-tier verified talent.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Edit Form: 7 cols */}
          <form onSubmit={handleSaveCp} className="lg:col-span-7 bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-foreground text-base">Edit Company Information</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-foreground block mb-1">Company Name</label>
                <Input
                  value={cpData.name}
                  onChange={(e) => setCpData({ ...cpData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="font-medium text-foreground block mb-1">About the Company</label>
                <Textarea
                  rows={4}
                  value={cpData.about}
                  onChange={(e) => setCpData({ ...cpData, about: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="font-medium text-foreground block mb-1">Company Mission</label>
                <Input
                  value={cpData.mission}
                  onChange={(e) => setCpData({ ...cpData, mission: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-foreground block mb-1">Industry</label>
                  <Input
                    value={cpData.ind}
                    onChange={(e) => setCpData({ ...cpData, ind: e.target.value })}
                  />
                </div>
                <div>
                  <label className="font-medium text-foreground block mb-1">Company Size</label>
                  <select
                    value={cpData.size}
                    onChange={(e) => setCpData({ ...cpData, size: e.target.value })}
                    className="w-full h-9 rounded-xl border border-input bg-background px-3 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option>Startup</option>
                    <option>Mid</option>
                    <option>Large</option>
                    <option>Enterprise</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-foreground block mb-1">Headquarters</label>
                  <Input
                    value={cpData.hq}
                    onChange={(e) => setCpData({ ...cpData, hq: e.target.value })}
                  />
                </div>
                <div>
                  <label className="font-medium text-foreground block mb-1">Website URL</label>
                  <Input
                    value={cpData.site}
                    onChange={(e) => setCpData({ ...cpData, site: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="font-medium text-foreground block mb-2">Benefits & Perks</label>
                <div className="flex flex-wrap gap-2">
                  {COMPANY_BENEFITS.map((benefit) => {
                    const isSelected = cpData.ben.includes(benefit);
                    return (
                      <button
                        key={benefit}
                        type="button"
                        onClick={() => handleToggleBenefit(benefit)}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors",
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted/40 text-muted-foreground border-border/60 hover:text-foreground"
                        )}
                      >
                        <span>{benefit}</span>
                        {isSelected && <Check className="w-3 h-3 text-primary-foreground inline" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border/60 flex justify-end">
              <Button type="submit" className="rounded-xl text-xs font-medium">
                Save Company Profile
              </Button>
            </div>
          </form>

          {/* Live Recruiter Preview: 5 cols */}
          <div className="lg:col-span-5 bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" /> Candidate View Preview
            </h3>

            <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={getCompanyLogo(cpData.name)}
                  alt={cpData.name}
                  className="w-12 h-12 rounded-xl object-contain p-1 border border-border/60 bg-background"
                />
                <div>
                  <div className="font-bold text-foreground text-sm">{cpData.name}</div>
                  <div className="text-muted-foreground text-[11px]">
                    {cpData.ind} • {cpData.size} • {cpData.hq}
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed text-[11px]">{cpData.about}</p>

              <div className="pt-2 border-t border-border/50">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1.5">
                  Perks & Culture
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {cpData.ben.map((b) => (
                    <span
                      key={b}
                      className="px-2 py-0.5 rounded-md bg-background border border-border/60 text-foreground text-[10px] font-medium"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === "post") {
    // POST A JOB VIEW
    return (
      <div className="space-y-6">
        <div className="bg-card border border-border/80 rounded-2xl p-6 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
              <Plus className="w-3.5 h-3.5" /> Hiring Studio
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-display">
              Post a New Position
            </h1>
            <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
              Publish an open engineering or product vacancy. Applicants are automatically pre-screened with 24-hour review SLA tracking.
            </p>
          </div>
        </div>

        {/* Templates Row */}
        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-3">
          <h3 className="font-semibold text-foreground text-xs uppercase tracking-wider">
            Quick Start From Template
          </h3>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {JOB_TEMPLATES.map((tpl, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleApplyTemplate(tpl)}
                className="px-3 py-1.5 rounded-xl border border-border/80 bg-background hover:bg-muted text-xs font-semibold text-foreground transition-all shrink-0"
              >
                {tpl[0]}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Form & Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <form onSubmit={handlePublish} className="lg:col-span-7 bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-foreground text-base">Role Specifications</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-foreground block mb-1">Job Title</label>
                <Input
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-medium text-foreground block mb-1">Location</label>
                  <Input
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    placeholder="Bengaluru"
                  />
                </div>
                <div>
                  <label className="font-medium text-foreground block mb-1">Work Mode</label>
                  <select
                    value={jobWorkMode}
                    onChange={(e) => setJobWorkMode(e.target.value as any)}
                    className="w-full h-9 rounded-xl border border-input bg-background px-3 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option>Onsite</option>
                    <option>Hybrid</option>
                    <option>Remote</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-foreground block mb-1">Job Type</label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value as any)}
                    className="w-full h-9 rounded-xl border border-input bg-background px-3 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option>Full-time</option>
                    <option>Internship</option>
                    <option>Contract</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-medium text-foreground block mb-1">Min Exp (Yrs)</label>
                  <Input
                    type="number"
                    min={0}
                    value={jobMinExp}
                    onChange={(e) => setJobMinExp(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="font-medium text-foreground block mb-1">Min Salary (LPA)</label>
                  <Input
                    type="number"
                    min={1}
                    value={jobMinSal}
                    onChange={(e) => setJobMinSal(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="font-medium text-foreground block mb-1">Max Salary (LPA)</label>
                  <Input
                    type="number"
                    min={1}
                    value={jobMaxSal}
                    onChange={(e) => setJobMaxSal(Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-foreground block mb-1">Required Skills (comma separated)</label>
                <Input
                  value={jobSkills}
                  onChange={(e) => setJobSkills(e.target.value)}
                  placeholder="React, TypeScript, SQL"
                  required
                />
              </div>
            </div>

            <div className="pt-3 border-t border-border/60 flex justify-end">
              <Button type="submit" className="rounded-xl text-xs font-medium gap-2">
                <Check className="w-3.5 h-3.5" /> Publish Job Opening
              </Button>
            </div>
          </form>

          {/* Live Preview Card */}
          <div className="lg:col-span-5 bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" /> Live Card Preview
            </h3>

            <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <img
                  src={getCompanyLogo(user.cp?.name || user.name)}
                  alt="Company"
                  className="w-12 h-12 rounded-xl object-contain p-1 border border-border/60 bg-background"
                />
                <div>
                  <div className="font-bold text-foreground text-sm">{jobTitle || "Job Title"}</div>
                  <div className="text-muted-foreground text-[11px]">
                    {user.cp?.name || user.name} • {jobLocation} • {jobWorkMode}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-md bg-background border border-border/60 text-foreground font-medium">
                  {jobType}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-background border border-border/60 text-foreground font-medium">
                  {jobMinExp}+ yrs
                </span>
                <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-bold">
                  ₹{jobMinSal}–{jobMaxSal} LPA
                </span>
              </div>

              <div className="pt-2 border-t border-border/50">
                <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">
                  Required Skills
                </div>
                <div className="flex flex-wrap gap-1">
                  {jobSkills
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded-md bg-muted text-foreground text-[10px] font-medium"
                      >
                        {s}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === "talent") {
    // FIND TALENT VIEW - PROFESSIONAL EXECUTIVE REDESIGN
    const currentBalance = user.wal?.bal || 0;
    const requiredUnlockFee = 2999;
    const hasSufficientBalance = currentBalance >= requiredUnlockFee;

    const roleFilters = [
      { id: "all", label: "All Roles" },
      { id: "frontend", label: "Frontend & Full Stack" },
      { id: "backend", label: "Backend & Systems" },
      { id: "devops", label: "DevOps & Cloud" },
      { id: "ml", label: "AI & Machine Learning" },
      { id: "data", label: "Data & Analytics" },
      { id: "mobile", label: "Mobile (iOS/Android)" },
      { id: "design", label: "Product Design" },
    ];

    const quickFilters = [
      { id: "all", label: talentOption === "verified" ? "All Verified Candidates" : "All Candidates" },
      { id: "immediate", label: "⚡ Immediate Joiners (0–15d)" },
      { id: "high-score", label: "🏆 CIR Score 95%+" },
      { id: "tier1", label: "🏢 Tier-1 Companies (Razorpay, Swiggy, Flipkart, CRED)" },
    ];

    return (
      <div className="space-y-6">
        {/* EXECUTIVE HEADER HERO */}
        <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-xs">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#002C66]/10 text-[#002C66] dark:text-blue-300 text-xs font-bold tracking-wide uppercase">
                  <Sparkles className="w-3.5 h-3.5" /> Talento Sourcing Studio
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Pre-Authenticated Engineering Talent
                </span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground font-display">
                  Find Talent
                </h1>
                <p className="text-muted-foreground text-xs sm:text-sm mt-1.5 leading-relaxed">
                  Source from India's elite engineering pool. Review active candidate resumes or unlock 100% verified engineers backed by tamper-proof CIR reports, authenticated UAN work history, and proctored coding test scores.
                </p>
              </div>

              {/* Quick Metrics Strip */}
              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-foreground text-sm">{standardCandidatesCount}</span> Candidates
                </div>
                <span className="text-border">•</span>
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="font-bold text-sm">{verifiedCandidatesCount}</span> Verified Candidates (Top 3%)
                </div>
                <span className="text-border">•</span>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>24-Hour SLA Guarantee</span>
                </div>
                <span className="text-border">•</span>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                  <span>Zero Fake Experience</span>
                </div>
              </div>
            </div>

            {/* Recruiter Credit Wallet Card */}
            <div className="bg-background/90 border border-border/80 backdrop-blur-md rounded-2xl p-5 shrink-0 flex flex-col justify-between gap-4 min-w-[280px] shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <span>Employer Wallet</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                  Active Account
                </span>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Available Credits
                </span>
                <div className="text-3xl font-extrabold text-foreground font-display tracking-tight mt-0.5">
                  ₹{currentBalance.toLocaleString("en-IN")}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Verified unlock: <strong className="text-foreground">₹2,999</strong> / candidate
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/60">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-8 rounded-xl font-medium"
                  onClick={() => onNavigate?.("payment-history")}
                >
                  <Wallet className="w-3.5 h-3.5 mr-1" /> Top Up
                </Button>
                <Button
                  size="sm"
                  className="text-xs h-8 rounded-xl font-medium bg-[#002C66] hover:bg-[#00204d] text-white"
                  onClick={() => window.open("/pricing?tab=employers", "_blank")}
                >
                  <CreditCard className="w-3.5 h-3.5 mr-1" /> Pricing Plans
                </Button>
              </div>
            </div>
          </div>

          {/* Smart Search Bar */}
          <div className="mt-6 pt-5 border-t border-border/60 flex flex-col sm:flex-row items-center gap-2.5">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                placeholder='Search by role, skill, college or company: e.g. "React developer Bengaluru ex-Razorpay", "Golang Swiggy", "Kubernetes CKA"'
                value={talentSmartQuery}
                onChange={(e) => setTalentSmartQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSmartTalentSearch()}
                className="text-xs sm:text-sm h-11 pl-10 pr-4 rounded-xl bg-background border-border/80"
              />
            </div>
            <Button
              onClick={handleSmartTalentSearch}
              className="h-11 px-5 rounded-xl text-xs sm:text-sm font-semibold gap-2 shrink-0 bg-[#002C66] hover:bg-[#00204d] text-white w-full sm:w-auto"
            >
              <Sparkles className="w-4 h-4" /> Smart Match
            </Button>
          </div>
        </div>

        {/* TWO-OPTION PRIMARY SELECTOR: CANDIDATES vs VERIFIED CANDIDATES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Option 1: Candidates */}
          <button
            type="button"
            onClick={() => setTalentOption("candidates")}
            className={cn(
              "p-5 rounded-3xl border text-left transition-all relative overflow-hidden flex items-start gap-4 cursor-pointer group",
              talentOption === "candidates"
                ? "bg-card border-[#002C66] ring-2 ring-[#002C66]/15 shadow-sm"
                : "bg-card/70 border-border/80 hover:border-border hover:bg-card"
            )}
          >
            <div
              className={cn(
                "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 transition-all",
                talentOption === "candidates"
                  ? "bg-[#002C66] text-white shadow-xs"
                  : "bg-muted text-muted-foreground group-hover:text-foreground"
              )}
            >
              <Users className="w-6 h-6" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-base text-foreground font-display">Candidates</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold">
                  {standardCandidatesCount} Candidates
                </span>
                <span className="text-[10px] text-muted-foreground">Free Access</span>

                {talentOption === "candidates" && (
                  <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-bold text-[#002C66] bg-[#002C66]/10 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active View
                  </span>
                )}
              </div>

              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                Open candidate pool across India. Search portfolios, skillsets, and active resumes. Free to view, screen, and send direct job invitations.
              </p>
            </div>
          </button>

          {/* Option 2: Verified Candidates */}
          <button
            type="button"
            onClick={() => setTalentOption("verified")}
            className={cn(
              "p-5 rounded-3xl border text-left transition-all relative overflow-hidden flex items-start gap-4 cursor-pointer group",
              talentOption === "verified"
                ? "bg-card border-emerald-600 ring-2 ring-emerald-600/20 shadow-sm"
                : "bg-card/70 border-border/80 hover:border-border hover:bg-card"
            )}
          >
            <div
              className={cn(
                "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 transition-all",
                talentOption === "verified"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-500/20"
              )}
            >
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-base text-foreground font-display flex items-center gap-1.5">
                  Verified Candidates
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-extrabold uppercase tracking-wide">
                    Talento CIR™
                  </span>
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                  {verifiedCandidatesCount} Authenticated
                </span>

                {talentOption === "verified" && (
                  <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-500/15 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active View
                  </span>
                )}
              </div>

              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                Candidates with authenticated UAN employment, proctored code challenges (&gt;90%), and verified CIR background index. Unlock full dossiers for ₹2,999.
              </p>
            </div>
          </button>
        </div>

        {/* DOMAIN & ROLE QUICK FILTERS */}
        <div className="space-y-3">
          {/* Role Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {roleFilters.map((rf) => {
              const isSelected = talentRoleFilter === rf.id;
              return (
                <button
                  key={rf.id}
                  type="button"
                  onClick={() => setTalentRoleFilter(rf.id)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer",
                    isSelected
                      ? "bg-[#002C66] text-white shadow-xs"
                      : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {rf.label}
                </button>
              );
            })}
          </div>

          {/* Criteria Quick Filter Tags */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            {quickFilters.map((qf) => {
              const isSelected = talentQuickFilter === qf.id;
              return (
                <button
                  key={qf.id}
                  type="button"
                  onClick={() => setTalentQuickFilter(qf.id)}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap cursor-pointer",
                    isSelected
                      ? "bg-primary/10 text-primary border-primary/40 font-bold"
                      : "bg-card text-muted-foreground border-border/80 hover:text-foreground"
                  )}
                >
                  {qf.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* INFORMATION TRUST BANNER */}
        {talentOption === "verified" ? (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-foreground">Talento Verified™ Hiring Guarantee: </span>
                <span className="text-muted-foreground">
                  Every profile in this pool is authenticated against EPFO employment data, passes proctored coding challenges, and carries a 24h recruiter review SLA. Accessing a verified profile deducts ₹2,999 from your employer wallet.
                </span>
              </div>
            </div>
            <span className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-[11px] font-bold shrink-0 self-start sm:self-auto shadow-2xs">
              ₹2,999 / Profile Access
            </span>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-muted/40 border border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-[#002C66] text-white flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-foreground">Browsing Standard Candidates: </span>
                <span className="text-muted-foreground">
                  Explore developers and project resumes. Looking for pre-vetted engineers with verified test scores and authenticated experience? Switch to <strong>Verified Candidates</strong> above.
                </span>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setTalentOption("verified")}
              className="text-xs h-8 rounded-xl text-emerald-700 border-emerald-500/30 hover:bg-emerald-50 shrink-0 font-semibold"
            >
              Switch to Verified Candidates
            </Button>
          </div>
        )}

        {/* Compare Bar if Candidates Selected */}
        {selectedTalentToCompare.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">
              {selectedTalentToCompare.length} candidates selected for side-by-side comparison
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => onOpenDrawer({ type: "compare-candidates" })}
                className="rounded-xl text-xs h-8 gap-1.5"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" /> Compare ({selectedTalentToCompare.length})
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedTalentToCompare([])}
                className="rounded-xl text-xs h-8 text-muted-foreground"
              >
                Clear
              </Button>
            </div>
          </div>
        )}

        {/* 2-COLUMN GRID: FILTER PANEL & CANDIDATE CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT FILTERS: 4 cols */}
          <div className="lg:col-span-4 bg-card border border-border/80 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary" /> Filter {talentOption === "verified" ? "Verified Candidates" : "Candidates"}
              </h3>
              <button
                onClick={() => {
                  setTalentQuery("");
                  setTalentExpLevels([]);
                  setTalentRoleFilter("all");
                  setTalentQuickFilter("all");
                  setTalentMinAssessment(0);
                  setTalentOnlyCertified(false);
                  setTalentMaxSalary(60);
                  setTalentNoticePeriod(999);
                  setTalentSort("cir");
                }}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-foreground block mb-1.5">Rank For Open Position</label>
                <select
                  value={talentJobFilter}
                  onChange={(e) => setTalentJobFilter(e.target.value)}
                  className="w-full h-9 rounded-xl border border-input bg-background px-3 py-1 text-xs shadow-2xs focus-visible:outline-none"
                >
                  <option value="">Generic (All Openings)</option>
                  {myJobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.t} ({j.l})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1.5">Keyword Search</label>
                <Input
                  value={talentQuery}
                  onChange={(e) => setTalentQuery(e.target.value)}
                  placeholder="e.g. React, Razorpay, Golang, BITS..."
                  className="text-xs h-9 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1.5">Experience Level</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {["Fresher", "Junior", "Mid", "Senior"].map((lvl) => {
                    const isChecked = talentExpLevels.includes(lvl);
                    return (
                      <label
                        key={lvl}
                        className={cn(
                          "flex items-center gap-2 rounded-xl px-2.5 py-1.5 border text-xs cursor-pointer transition-colors",
                          isChecked
                            ? "bg-primary/10 border-primary text-primary font-bold"
                            : "bg-background border-border/70 text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() =>
                            setTalentExpLevels((prev) =>
                              isChecked ? prev.filter((x) => x !== lvl) : [...prev, lvl]
                            )
                          }
                          className="rounded text-primary focus:ring-primary accent-primary"
                        />
                        <span>{lvl}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-semibold text-foreground">Min Assessment Score</label>
                  <span className="font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10">
                    {talentMinAssessment}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="95"
                  step="5"
                  value={talentMinAssessment}
                  onChange={(e) => setTalentMinAssessment(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl border border-border/70 hover:bg-muted/40 transition-colors">
                  <input
                    type="checkbox"
                    checked={talentOnlyCertified}
                    onChange={(e) => setTalentOnlyCertified(e.target.checked)}
                    className="rounded text-primary focus:ring-primary accent-primary"
                  />
                  <span className="font-semibold text-foreground">Certified Credentials Only (AWS, Meta, Google)</span>
                </label>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-semibold text-foreground">Max Expected CTC</label>
                  <span className="font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10">
                    ₹{talentMaxSalary} LPA
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="2"
                  value={talentMaxSalary}
                  onChange={(e) => setTalentMaxSalary(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1.5">Sort Candidates By</label>
                <select
                  value={talentSort}
                  onChange={(e) => setTalentSort(e.target.value as any)}
                  className="w-full h-9 rounded-xl border border-input bg-background px-3 py-1 text-xs shadow-2xs focus-visible:outline-none"
                >
                  <option value="cir">Highest CIR Score</option>
                  <option value="s">Best Algorithm Fit Match</option>
                  <option value="a">Assessment Proctored Score</option>
                  <option value="x">Experience (High to Low)</option>
                  <option value="sal-asc">Expected Salary (Lowest First)</option>
                </select>
              </div>
            </div>
          </div>

          {/* RIGHT CANDIDATE CARDS: 8 cols */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
              <span>
                Showing <strong className="text-foreground">{displayCandidates.length}</strong> {talentOption === "verified" ? "Verified Candidates" : "Candidates"}
              </span>
              <span className="text-[11px]">
                {talentOption === "verified" ? "Verified dossiers: ₹2,999 / unlock" : "Free Candidate Browsing"}
              </span>
            </div>

            {displayCandidates.length === 0 && (
              <div className="bg-card border border-border/80 rounded-3xl p-12 text-center space-y-3">
                <Users className="w-10 h-10 text-muted-foreground mx-auto" />
                <h4 className="font-bold text-foreground text-base">No candidates match your current filters</h4>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Try adjusting your role selection, search keyword, or salary range to discover more candidates.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setTalentQuery("");
                    setTalentRoleFilter("all");
                    setTalentQuickFilter("all");
                    setTalentExpLevels([]);
                    setTalentMaxSalary(60);
                  }}
                  className="rounded-xl text-xs mt-2"
                >
                  Reset All Filters
                </Button>
              </div>
            )}

            <div className="space-y-4">
              {displayCandidates.map((cand) => {
                const scoreVal = calcTalentScore(cand, selectedJobObj);
                const isCompared = selectedTalentToCompare.includes(cand.n);
                const isVerified = cand.verified === true;
                const isUnlocked = unlockedCandidateNames.includes(cand.n);

                return (
                  <div
                    key={cand.n}
                    className={cn(
                      "bg-card border rounded-3xl p-5 sm:p-6 shadow-xs space-y-4 transition-all hover:shadow-md",
                      isVerified
                        ? "border-emerald-500/30 hover:border-emerald-500/60 bg-gradient-to-br from-emerald-500/[0.015] to-card"
                        : "border-border/80 hover:border-primary/40"
                    )}
                  >
                    {/* Top Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                          <img
                            src={getCandidatePhoto(cand.n)}
                            alt={cand.n}
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-border/70 shadow-2xs"
                          />
                          {isVerified ? (
                            <span
                              title="CIR Verified"
                              className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center border-2 border-background shadow-xs"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                            </span>
                          ) : (
                            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-background" />
                          )}
                        </div>

                        {/* Name & Title */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-foreground text-base sm:text-lg font-display">
                              {cand.n}
                            </h4>

                            {isVerified && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold tracking-wide uppercase">
                                <ShieldCheck className="w-3.5 h-3.5" /> Talento Verified CIR
                              </span>
                            )}

                            {cand.statusBadge && (
                              <span className="px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-[10px] font-bold">
                                {cand.statusBadge}
                              </span>
                            )}
                          </div>

                          {/* Headline with Current & Previous Companies */}
                          {cand.headline && (
                            <p className="text-xs sm:text-sm font-semibold text-foreground/90">
                              {cand.headline}
                            </p>
                          )}

                          {/* Education */}
                          {cand.education && (
                            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                              <GraduationCap className="w-3.5 h-3.5 text-muted-foreground/80" />
                              <span>{cand.education}</span>
                            </p>
                          )}

                          {/* Meta Specs Chips */}
                          <div className="flex items-center gap-x-3 gap-y-1 flex-wrap text-xs text-muted-foreground pt-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-muted-foreground" /> {cand.c} ({cand.wp})
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-3 h-3 text-muted-foreground" /> {cand.x} yrs exp ({levelFromExp(cand.x)})
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 font-semibold text-foreground">
                              <IndianRupee className="w-3 h-3 text-muted-foreground" />
                              {cand.currentSalary ? `₹${cand.currentSalary}L ➔ ` : ""}₹{cand.es} LPA Exp
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-muted-foreground" /> {cand.nt ? `${cand.nt}d notice` : "Immediate Joiner"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Score & Compare */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 shrink-0 pt-1 border-t sm:border-t-0 border-border/50">
                        {isVerified && cand.cirScore ? (
                          <div className="text-left sm:text-right">
                            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>CIR {cand.cirScore}/100</span>
                            </div>
                            <span className="text-[10px] text-muted-foreground block mt-0.5">
                              Top 3% Pan-India
                            </span>
                          </div>
                        ) : (
                          <div className="text-left sm:text-right">
                            <span className="text-[10px] text-muted-foreground block">Fit Match</span>
                            <span className="font-bold text-sm text-primary">{scoreVal}%</span>
                          </div>
                        )}

                        <label className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={isCompared}
                            onChange={() => {
                              setSelectedTalentToCompare((prev) =>
                                isCompared ? prev.filter((x) => x !== cand.n) : [...prev, cand.n]
                              );
                            }}
                            className="rounded text-primary focus:ring-primary accent-primary"
                          />
                          <span>Compare</span>
                        </label>
                      </div>
                    </div>

                    {/* Engineering Highlight Quote */}
                    {cand.highlight && (
                      <div className="p-3 rounded-2xl bg-muted/40 border border-border/70 text-xs text-foreground/90 italic leading-relaxed">
                        "{cand.highlight}"
                      </div>
                    )}

                    {/* Talento CIR Verification Box (For Verified Candidates) */}
                    {isVerified && (
                      <div className="p-3.5 rounded-2xl bg-emerald-500/[0.04] border border-emerald-500/20 space-y-2.5 text-xs">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300 text-xs">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span>Proctored Assessment &amp; Verification Scorecard</span>
                          </div>
                          {cand.cirId && (
                            <span className="text-[10px] font-mono font-bold text-muted-foreground bg-background px-2 py-0.5 rounded-md border border-border/60">
                              Ledger ID: {cand.cirId}
                            </span>
                          )}
                        </div>

                        {/* Proctored Skill Scores */}
                        {cand.as && Object.keys(cand.as).length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-0.5">
                            {Object.entries(cand.as).map(([testName, score]) => (
                              <div
                                key={testName}
                                className="p-2 rounded-xl bg-background border border-border/60 text-center"
                              >
                                <div className="text-[10px] text-muted-foreground truncate" title={testName}>
                                  {testName}
                                </div>
                                <div className="text-xs font-bold text-emerald-600 mt-0.5">
                                  {score}% <span className="text-[9px] text-muted-foreground font-normal">Passed</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Verified Badges */}
                        {cand.verifiedBadges && (
                          <div className="flex items-center gap-2 flex-wrap pt-1 text-[11px] text-muted-foreground">
                            {cand.verifiedBadges.map((vb) => (
                              <span
                                key={vb}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium"
                              >
                                <CheckCircle className="w-3 h-3 text-emerald-600" /> {vb}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Skills & Certifications */}
                    <div className="flex items-center gap-1.5 flex-wrap text-xs pt-0.5">
                      {cand.sk.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium"
                        >
                          {s}
                        </span>
                      ))}
                      {cand.ce &&
                        cand.ce.map((cert) => (
                          <span
                            key={cert}
                            className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-semibold flex items-center gap-1"
                          >
                            <Award className="w-3 h-3 text-purple-600" /> {cert}
                          </span>
                        ))}
                    </div>

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      {/* Left Status Indicator */}
                      <div className="flex items-center gap-2">
                        {isVerified ? (
                          isUnlocked ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Full Verified Dossier Unlocked
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 text-xs font-semibold">
                              <Lock className="w-3.5 h-3.5" /> Locked Verified Profile (Direct Contacts Protected)
                            </span>
                          )
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            Standard candidate profile · Free to view
                          </span>
                        )}
                      </div>

                      {/* Right Action Buttons */}
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        {isVerified && !isUnlocked ? (
                          <Button
                            size="sm"
                            className="rounded-xl text-xs h-9 px-4 gap-1.5 bg-[#002C66] hover:bg-[#00204d] text-white font-bold shadow-xs cursor-pointer"
                            onClick={() => setCandidateToUnlock(cand)}
                          >
                            <Lock className="w-3.5 h-3.5" /> Unlock Verified Profile (₹2,999)
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant={isVerified ? "default" : "outline"}
                            className={cn(
                              "rounded-xl text-xs h-9 px-4 gap-1.5 font-semibold",
                              isVerified ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-background"
                            )}
                            onClick={() => onOpenDrawer({ type: "candidate", name: cand.n, jobId: selectedJobObj?.id })}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            {isVerified ? "View Verified Dossier & Contacts" : "View Profile & Resume"}
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="ghost"
                          className="rounded-xl text-xs h-9 px-3 gap-1.5 text-muted-foreground hover:text-foreground"
                          onClick={() => onToast(`Invitation to interview sent to ${cand.n}!`)}
                        >
                          <Send className="w-3.5 h-3.5" /> Invite
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* VERIFIED CANDIDATE ACCESS & WALLET DEDUCTION MODAL */}
        {candidateToUnlock && (
          <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {/* Header Accent Bar */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#002C66] via-blue-600 to-emerald-600" />

              <div className="flex items-start justify-between gap-4 pt-1 mb-4">
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <img
                      src={getCandidatePhoto(candidateToUnlock.n)}
                      alt={candidateToUnlock.n}
                      className="w-14 h-14 rounded-2xl object-cover border border-border shadow-xs"
                    />
                    <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center border-2 border-background">
                      <ShieldCheck className="w-3 h-3" />
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg text-foreground font-display">{candidateToUnlock.n}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold uppercase">
                        CIR {candidateToUnlock.cirScore || 97}/100
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {candidateToUnlock.headline || `${candidateToUnlock.x} yrs experience · ${candidateToUnlock.c}`}
                    </p>
                    {candidateToUnlock.cirId && (
                      <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                        Verification ID: {candidateToUnlock.cirId}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCandidateToUnlock(null)}
                  className="rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Verified Inclusions Box */}
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/70 space-y-2.5 mb-5 text-xs">
                <div className="font-semibold text-foreground flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> What's Included in This Verified Dossier:
                </div>
                <div className="grid grid-cols-1 gap-2 pt-1">
                  <div className="flex items-center gap-2 text-foreground/90">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Direct contact info: <strong>Personal Email, Phone Number, LinkedIn, GitHub</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground/90">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Authenticated employment history verified against EPFO/UAN official records</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground/90">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Proctored technical test scorecard, code replay recordings &amp; diff logs</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground/90">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Guaranteed 24-hour SLA direct recruiter messaging channel</span>
                  </div>
                </div>
              </div>

              {/* Financial Calculation & Pricing Summary */}
              <div className="p-4 rounded-2xl border border-border bg-card space-y-3 mb-5 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Profile Access Fee:</span>
                  <span className="font-bold text-foreground text-sm">₹{requiredUnlockFee.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Current Employer Wallet Balance:</span>
                  <span className="font-bold text-foreground text-sm">₹{currentBalance.toLocaleString("en-IN")}</span>
                </div>

                {hasSufficientBalance ? (
                  <>
                    <div className="pt-2 border-t border-border flex items-center justify-between text-xs font-semibold">
                      <span>Remaining Balance after Unlock:</span>
                      <span className="font-bold text-emerald-600 text-sm">
                        ₹{(currentBalance - requiredUnlockFee).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[11px] leading-relaxed">
                      ✓ You have sufficient wallet balance. ₹2,999 will be deducted upon confirmation and the verified dossier will be unlocked immediately.
                    </div>
                  </>
                ) : (
                  <>
                    <div className="pt-2 border-t border-border flex items-center justify-between text-xs font-semibold text-destructive">
                      <span>Balance Shortfall:</span>
                      <span className="font-bold text-sm">
                        - ₹{(requiredUnlockFee - currentBalance).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-[11px] leading-relaxed">
                      ⚠️ Insufficient wallet balance. Your balance is ₹{currentBalance.toLocaleString("en-IN")}, but ₹2,999 is required to unlock this verified candidate.
                    </div>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {hasSufficientBalance ? (
                  <Button
                    className="w-full h-11 bg-[#002C66] hover:bg-[#00204d] text-white font-bold rounded-xl gap-2 shadow-sm cursor-pointer"
                    onClick={handleConfirmDeductAndUnlock}
                  >
                    <CheckCircle2 className="w-4 h-4" /> Confirm &amp; Deduct ₹2,999 from Wallet
                  </Button>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Button
                      className="w-full h-10 bg-[#002C66] hover:bg-[#00204d] text-white font-bold rounded-xl gap-1.5 text-xs cursor-pointer"
                      onClick={() => {
                        window.location.href = "/pricing?tab=employers";
                      }}
                    >
                      <CreditCard className="w-4 h-4" /> Go to Pricing Page
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full h-10 rounded-xl gap-1.5 text-xs font-semibold"
                      onClick={() => {
                        setCandidateToUnlock(null);
                        onNavigate?.("payment-history");
                      }}
                    >
                      <Wallet className="w-4 h-4" /> Top Up Wallet
                    </Button>
                  </div>
                )}

                <Button
                  variant="ghost"
                  className="w-full text-xs text-muted-foreground hover:text-foreground h-8 cursor-pointer"
                  onClick={() => setCandidateToUnlock(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 4. PIPELINE KANBAN & LIST VIEW
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
              <Layers className="w-3.5 h-3.5" /> Recruiter Pipeline
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-display">
              Candidate Pipeline Board
            </h1>
            <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
              Track applicant stages, respond before 24-hour review SLA deadlines, and schedule interview rounds.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={pipeViewMode === "board" ? "default" : "outline"}
              size="sm"
              onClick={() => setPipeViewMode("board")}
              className="rounded-xl text-xs gap-1.5 h-9"
            >
              <Kanban className="w-3.5 h-3.5" /> Board
            </Button>
            <Button
              variant={pipeViewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setPipeViewMode("list")}
              className="rounded-xl text-xs gap-1.5 h-9"
            >
              <List className="w-3.5 h-3.5" /> List
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm space-y-3 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="font-medium text-foreground block mb-1">Filter by Job</label>
            <select
              value={pipeJobFilter}
              onChange={(e) => setPipeJobFilter(e.target.value)}
              className="w-full h-8 rounded-xl border border-input bg-background px-3 py-1 text-xs shadow-sm focus-visible:outline-none"
            >
              <option value="">All Jobs ({myJobs.length})</option>
              {myJobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-medium text-foreground block mb-1">Search Candidate</label>
            <Input
              value={pipeSearch}
              onChange={(e) => setPipeSearch(e.target.value)}
              placeholder="Candidate name..."
              className="text-xs h-8"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-medium text-foreground">Min Match</label>
              <span className="font-bold text-primary">{pipeMinMatch}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="10"
              value={pipeMinMatch}
              onChange={(e) => setPipeMinMatch(Number(e.target.value))}
              className="w-full accent-primary mt-1"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer pb-2">
              <input
                type="checkbox"
                checked={pipeOnlyNeedingUpdate}
                onChange={(e) => setPipeOnlyNeedingUpdate(e.target.checked)}
                className="rounded text-primary focus:ring-primary"
              />
              <span className="font-medium text-foreground">Needs 24h SLA Update</span>
            </label>
          </div>
        </div>
      </div>

      {/* Kanban Board View */}
      {pipeViewMode === "board" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start overflow-x-auto pb-4">
          {STAGES.map((stage) => {
            const stageApps = filteredPipelineApps.filter((a) => a.st === stage);
            return (
              <div
                key={stage}
                className="bg-card border border-border/80 rounded-2xl p-3.5 space-y-3 shadow-sm min-w-[220px]"
              >
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <span className="font-bold text-foreground text-xs">{stage}</span>
                  <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-bold">
                    {stageApps.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {stageApps.length === 0 ? (
                    <div className="py-6 text-center text-[11px] text-muted-foreground">
                      No candidates
                    </div>
                  ) : (
                    stageApps.map((app) => {
                      const job = findJob(app);
                      const matchVal = job ? calcScore(job, app) : 80;
                      const hasUpdate = (app.upd || []).length > 0;
                      const timeLeft = getRemainingTime(app.at + 86400000);

                      return (
                        <div
                          key={app.id}
                          onClick={() => onOpenDrawer({ type: "applicant", id: app.id })}
                          className="p-3 rounded-xl border border-border/60 bg-background hover:border-primary/50 transition-all cursor-pointer space-y-2 shadow-xs group"
                        >
                          <div className="font-bold text-foreground text-xs group-hover:text-primary transition-colors">
                            {app.name}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {job?.t} • {app.exp} yrs
                          </div>

                          <div className="flex items-center justify-between text-[10px] pt-1 border-t border-border/50">
                            <span className="font-bold text-primary">{matchVal}% Match</span>
                            <span
                              className={cn(
                                "font-medium",
                                hasUpdate
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-amber-600 dark:text-amber-400"
                              )}
                            >
                              {hasUpdate ? "Updated" : `${timeLeft} left`}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // List View with Bulk Actions
        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60 text-xs">
            <span className="font-semibold text-foreground">
              {selectedApplicants.length} applicants selected
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {["Shortlisted", "Interview", "Rejected"].map((s) => (
                <Button
                  key={s}
                  size="sm"
                  variant="outline"
                  disabled={selectedApplicants.length === 0}
                  onClick={() => onBulkUpdateStage(selectedApplicants, s)}
                  className="rounded-xl text-xs h-7 px-2.5"
                >
                  Move to {s}
                </Button>
              ))}
              <Button
                size="sm"
                disabled={selectedApplicants.length === 0}
                onClick={() => onBulkSendReview(selectedApplicants)}
                className="rounded-xl text-xs h-7 px-2.5"
              >
                Send "Under Review" SLA Update
              </Button>
            </div>
          </div>

          <div className="divide-y divide-border/60">
            {filteredPipelineApps.map((app) => {
              const job = findJob(app);
              const isSelected = selectedApplicants.includes(app.id);
              const match = job ? calcScore(job, app) : 80;

              return (
                <div
                  key={app.id}
                  className="py-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {
                        setSelectedApplicants((prev) =>
                          isSelected ? prev.filter((id) => id !== app.id) : [...prev, app.id]
                        );
                      }}
                      className="rounded text-primary focus:ring-primary"
                    />
                    <div
                      className="cursor-pointer group"
                      onClick={() => onOpenDrawer({ type: "applicant", id: app.id })}
                    >
                      <div className="font-bold text-foreground text-sm group-hover:text-primary transition-colors flex items-center gap-2">
                        {app.name}
                        <span className="px-2 py-0.2 rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
                          {app.st}
                        </span>
                      </div>
                      <div className="text-muted-foreground text-[11px] mt-0.5">
                        {job?.t} • {app.exp} yrs • Match: <b>{match}%</b>
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl text-xs h-7 px-2.5"
                    onClick={() => onOpenDrawer({ type: "applicant", id: app.id })}
                  >
                    Open Review
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
