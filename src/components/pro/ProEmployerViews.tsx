import React, { useState, useMemo, useRef, useEffect } from "react";
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
  ArrowRight,
  ShieldCheck,
  Award,
  Check,
  SlidersHorizontal,
  RotateCcw,
  Kanban,
  List,
  Eye,
  Send,
  ArrowRightLeft,
  Bookmark,
  FileText,
  Download,
  GripVertical,
  LayoutGrid,
  Table2,
  X,
  IndianRupee,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Star,
  Zap,
  Wallet,
  Lock,
  Crown,
  BadgeCheck,
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
  getRemainingTime,
  candidateFitForJob,
  generateHash,
  formatINR,
} from "@/data/proData";
import { getCandidatePhoto, getCompanyLogo } from "@/data/portalAssets";
import { downloadCirReportPdf, type RealTimeCertificateData } from "@/utils/credentialPdf";
import { ProView, ProDrawerState } from "./proTypes";
import "./employer-workspace.css";

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
  onNavigate?: (view: ProView, query?: Record<string, string>) => void;
  onAddCandidateToPipeline?: (
    cand: ProCandidate,
    jobId: number,
    stage: ProApplication["st"],
    note?: string
  ) => void;
  selectedCompareCandidates?: string[];
  onCompareCandidatesChange?: (names: string[]) => void;
  onUpdateWallet?: (
    newBalance: number,
    tx?: NonNullable<NonNullable<ProUser["wal"]>["tx"]>[number]
  ) => void;
}

type SourcingStage = "Discovered" | "Saved" | "Invited" | "Shortlisted" | "Interview";

const SOURCING_COLUMNS: Array<{
  id: SourcingStage;
  title: string;
  subtitle: string;
  theme: string;
}> = [
  {
    id: "Discovered",
    title: "Discovered Pool",
    subtitle: "AI-matched verified engineers",
    theme: "Applied",
  },
  {
    id: "Saved",
    title: "Saved & Bookmarked",
    subtitle: "Starred by HR for review",
    theme: "On Hold",
  },
  {
    id: "Invited",
    title: "Outreach / Invited",
    subtitle: "Invitation or role pitch sent",
    theme: "Offer",
  },
  {
    id: "Shortlisted",
    title: "Shortlisted for Role",
    subtitle: "Added to active job shortlist",
    theme: "Shortlisted",
  },
  {
    id: "Interview",
    title: "Interviewing",
    subtitle: "Technical / AI round active",
    theme: "Interview",
  },
];

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
  onNavigate,
  onAddCandidateToPipeline,
  selectedCompareCandidates,
  onCompareCandidatesChange,
  onUpdateWallet,
}) => {
  const myJobs = jobs.filter((j) => j.by === user.email);
  const myApps = applications.filter((a) => myJobs.some((j) => j.id === a.jid));
  const findJob = (a: ProApplication) => jobs.find((j) => j.id === a.jid);

  // 1. COMPANY PROFILE VIEW
  const [cpData, setCpData] = useState(() => ({
    name: user.cp?.name || user.name || "Super30 Technologies",
    about:
      user.cp?.about ||
      "Building developer tooling and autonomous engineering platforms for modern teams.",
    mission:
      user.cp?.mission ||
      "Empowering developers to build 10x faster with verified engineering trust.",
    ind: user.cp?.ind || "Software & Cloud",
    size: user.cp?.size || "Mid",
    hq: user.cp?.hq || "Bengaluru, India",
    site: user.cp?.site || "super30.ai",
    ben: user.cp?.ben || [
      "Remote work",
      "Health insurance",
      "Learning budget",
      "Flexible hours",
      "Stock options",
    ],
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

  // 3. FIND TALENT VIEW STATE
  const [talentLayout, setTalentLayout] = useState<"cards" | "kanban" | "matrix">("cards");
  const [talentQuery, setTalentQuery] = useState("");
  const [talentSmartQuery, setTalentSmartQuery] = useState("");
  const [talentJobFilter, setTalentJobFilter] = useState<string>(() =>
    myJobs[0] ? String(myJobs[0].id) : ""
  );
  const [talentExpLevels, setTalentExpLevels] = useState<string[]>([]);
  const [talentWorkModes, setTalentWorkModes] = useState<string[]>([]);
  const [talentMinAssessment, setTalentMinAssessment] = useState(0);
  const [talentOnlyCertified, setTalentOnlyCertified] = useState(false);
  const [talentMaxSalary, setTalentMaxSalary] = useState(60);
  const [talentNoticePeriod, setTalentNoticePeriod] = useState(999);
  const [talentSort, setTalentSort] = useState<"s" | "a" | "x" | "sal">("s");
  const [quickPreset, setQuickPreset] = useState<
    "all" | "high_match" | "immediate" | "top_test" | "budget" | "saved" | "in_pipeline"
  >("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [expandedFitCard, setExpandedFitCard] = useState<string | null>(null);
  const [draggedCandName, setDraggedCandName] = useState<string | null>(null);
  const [dragOverSourcingStage, setDragOverSourcingStage] = useState<SourcingStage | null>(null);

  const [localCompare, setLocalCompare] = useState<string[]>([]);
  const selectedTalentToCompare = selectedCompareCandidates ?? localCompare;
  const updateCompareList = (next: string[]) => {
    setLocalCompare(next);
    onCompareCandidatesChange?.(next);
  };

  const [bookmarkedTalent, setBookmarkedTalent] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("tq_bookmarked_talent");
      return saved ? JSON.parse(saved) : ["Aarav Mehta", "Sneha Iyer"];
    } catch {
      return ["Aarav Mehta", "Sneha Iyer"];
    }
  });

  const [sourcingMap, setSourcingMap] = useState<Record<string, SourcingStage>>(() => {
    try {
      const raw = localStorage.getItem("tq_talent_sourcing_stages");
      if (raw) return JSON.parse(raw);
    } catch {
      /* ignore */
    }
    return {
      "Aarav Mehta": "Shortlisted",
      "Diya Nair": "Shortlisted",
      "Rohan Das": "Discovered",
      "Sneha Iyer": "Interview",
      "Kabir Shah": "Invited",
      "Meera Pillai": "Saved",
      "Arjun Rao": "Interview",
      "Priya Menon": "Shortlisted",
    };
  });

  const filterPopoverRef = useRef<HTMLDivElement | null>(null);

  // Find Talent Wallet Bento & Verified Pool Pass State
  const walletDialogRef = useRef<HTMLDialogElement | null>(null);
  const [localWalletBal, setLocalWalletBal] = useState<number>(
    () => user.wal?.bal ?? 12000
  );
  const walletBalance = user.wal?.bal ?? localWalletBal;
  const [talentTier, setTalentTier] = useState<"standard" | "verified">("standard");
  const [verifiedUnlocked, setVerifiedUnlocked] = useState<boolean>(false);
  const [selectedPassKey, setSelectedPassKey] = useState<"session" | "monthly">("session");
  const [pendingCirCandidate, setPendingCirCandidate] = useState<ProCandidate | null>(null);

  const PASS_OPTIONS = {
    session: {
      label: "Verified Search Pass (Single Sprint)",
      cost: 499,
      desc: "Unlock AI-proctored CIR verified candidates, contact details & CIR PDF downloads for this hiring session.",
    },
    monthly: {
      label: "Unlimited Verified Pass (30 Days)",
      cost: 2499,
      desc: "30 days unlimited verified candidate search, 50 direct CIR downloads & priority outreach.",
    },
  } as const;

  const openWalletConfirmModal = (candForCir?: ProCandidate) => {
    setPendingCirCandidate(candForCir ?? null);
    const dlg = walletDialogRef.current;
    if (dlg && !dlg.open) {
      dlg.showModal();
    }
  };

  const closeWalletConfirmModal = () => {
    setPendingCirCandidate(null);
    const dlg = walletDialogRef.current;
    if (dlg?.open) {
      dlg.close("");
    }
  };

  const handleSelectTalentTier = (nextTier: "standard" | "verified") => {
    if (nextTier === "standard") {
      setTalentTier("standard");
      return;
    }
    if (verifiedUnlocked) {
      setTalentTier("verified");
      return;
    }
    openWalletConfirmModal();
  };

  const handleQuickRechargeDemo = (amount: number) => {
    const nextBal = walletBalance + amount;
    setLocalWalletBal(nextBal);
    onUpdateWallet?.(nextBal, {
      id: `TOPUP-${Date.now()}`,
      at: Date.now(),
      type: "credit",
      amt: amount,
      desc: "Company Wallet Recharge (Hiring Credits)",
      via: "Corporate UPI / Card",
      st: "Completed",
    });
    onToast(`Added ${formatINR(amount)} to Company Wallet!`);
  };

  const handleConfirmVerifiedDeduction = () => {
    const chosen = PASS_OPTIONS[selectedPassKey];
    if (walletBalance < chosen.cost) {
      onToast(`Insufficient wallet balance. Recharge ${formatINR(chosen.cost - walletBalance)} more.`);
      return;
    }
    const nextBal = walletBalance - chosen.cost;
    setLocalWalletBal(nextBal);
    onUpdateWallet?.(nextBal, {
      id: `VER-${Date.now()}`,
      at: Date.now(),
      type: "debit",
      amt: chosen.cost,
      desc: chosen.label,
      via: "Company Wallet",
      st: "Paid",
    });
    setVerifiedUnlocked(true);
    setTalentTier("verified");
    const pendingCand = pendingCirCandidate;
    closeWalletConfirmModal();
    onToast(
      `Deducted ${formatINR(chosen.cost)} from Company Wallet · Verified Candidates unlocked!`
    );
    if (pendingCand) {
      handleDownloadCandidateCir(pendingCand);
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem("tq_bookmarked_talent", JSON.stringify(bookmarkedTalent));
    } catch {
      /* ignore */
    }
  }, [bookmarkedTalent]);

  useEffect(() => {
    try {
      localStorage.setItem("tq_talent_sourcing_stages", JSON.stringify(sourcingMap));
    } catch {
      /* ignore */
    }
  }, [sourcingMap]);

  useEffect(() => {
    if (!filterOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (filterPopoverRef.current && !filterPopoverRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [filterOpen]);

  // Best-fit job resolver for a candidate when "All Roles" is selected
  const selectedJobObj = myJobs.find((j) => String(j.id) === talentJobFilter);
  const getBestJobForCandidate = (cand: ProCandidate): ProJob | undefined => {
    if (selectedJobObj) return selectedJobObj;
    if (myJobs.length === 0) return jobs[0];
    return [...myJobs].sort((a, b) => calcTalentScore(cand, b) - calcTalentScore(cand, a))[0];
  };

  const getCandidateStage = (candName: string): SourcingStage => {
    const existingApp = myApps.find((a) => a.name === candName);
    if (sourcingMap[candName]) return sourcingMap[candName];
    if (existingApp) {
      if (existingApp.st === "Interview" || existingApp.st === "Offer") return "Interview";
      if (existingApp.st === "Shortlisted") return "Shortlisted";
      return "Invited";
    }
    if (bookmarkedTalent.includes(candName)) return "Saved";
    return "Discovered";
  };

  const toggleBookmark = (name: string) => {
    setBookmarkedTalent((prev) => {
      const exists = prev.includes(name);
      const next = exists ? prev.filter((x) => x !== name) : [...prev, name];
      onToast(exists ? `Removed ${name} from Saved Talent` : `Bookmarked ${name} to Saved Talent!`);
      return next;
    });
  };

  const handleSmartTalentSearch = (presetText?: string) => {
    const raw = (presetText ?? talentSmartQuery).trim();
    if (presetText !== undefined) setTalentSmartQuery(presetText);
    const q = raw.toLowerCase();
    if (!q) return;

    // Reset before applying smart query tokens
    setTalentExpLevels([]);
    setTalentWorkModes([]);
    setTalentOnlyCertified(false);
    setTalentMinAssessment(0);
    setTalentNoticePeriod(999);
    setTalentMaxSalary(60);

    const skillKeywords = [
      "react",
      "typescript",
      "node.js",
      "python",
      "sql",
      "aws",
      "kubernetes",
      "terraform",
      "java",
      "dsa",
      "figma",
      "pytorch",
      "tableau",
    ];
    const matchedSkill = skillKeywords.find((k) => q.includes(k));
    setTalentQuery(matchedSkill ? matchedSkill : "");

    if (q.includes("certified")) setTalentOnlyCertified(true);
    if (q.includes("senior")) setTalentExpLevels(["Senior"]);
    if (q.includes("mid")) setTalentExpLevels(["Mid"]);
    if (q.includes("junior") || q.includes("fresher")) setTalentExpLevels(["Fresher", "Junior"]);
    if (q.includes("immediate") || q.includes("15d")) setTalentNoticePeriod(15);
    if (q.includes("remote")) setTalentWorkModes(["Remote"]);
    if (q.includes("80%") || q.includes("85%")) setTalentMinAssessment(80);
    const salMatch = /(\d+)\s*lpa/.exec(q);
    if (salMatch) setTalentMaxSalary(Number(salMatch[1]));

    onToast(`AI Smart Search applied: "${raw}"`);
  };

  const resetTalentFilters = () => {
    setTalentQuery("");
    setTalentSmartQuery("");
    setTalentExpLevels([]);
    setTalentWorkModes([]);
    setTalentMinAssessment(0);
    setTalentOnlyCertified(false);
    setTalentMaxSalary(60);
    setTalentNoticePeriod(999);
    setQuickPreset("all");
  };

  const activeTalentFilterCount =
    (talentQuery ? 1 : 0) +
    (talentExpLevels.length > 0 ? 1 : 0) +
    (talentWorkModes.length > 0 ? 1 : 0) +
    (talentMinAssessment > 0 ? 1 : 0) +
    (talentOnlyCertified ? 1 : 0) +
    (talentMaxSalary < 60 ? 1 : 0) +
    (talentNoticePeriod !== 999 ? 1 : 0) +
    (quickPreset !== "all" ? 1 : 0);

  const filteredCandidates = useMemo(() => {
    return CANDIDATES_SEED.filter((c) => {
      const targetJob = getBestJobForCandidate(c);
      const roleScore = calcTalentScore(c, targetJob);
      const testAvg = avgCandidateScore(c);

      if (talentQuery) {
        const q = talentQuery.toLowerCase();
        const matchesName = c.n.toLowerCase().includes(q);
        const matchesSkill = c.sk.some((s) => s.toLowerCase().includes(q));
        const matchesCity = c.c.toLowerCase().includes(q);
        if (!matchesName && !matchesSkill && !matchesCity) return false;
      }

      if (talentExpLevels.length > 0) {
        const lvl = levelFromExp(c.x);
        if (!talentExpLevels.includes(lvl)) return false;
      }

      if (talentWorkModes.length > 0 && !talentWorkModes.includes(c.wp)) return false;
      if (testAvg < talentMinAssessment) return false;
      if (talentOnlyCertified && (!c.ce || c.ce.length === 0)) return false;
      if (talentTier === "verified" && avgCandidateScore(c) < 75) return false;
      if (c.es > talentMaxSalary) return false;
      if (talentNoticePeriod !== 999 && (c.nt || 0) > talentNoticePeriod) return false;

      if (quickPreset === "high_match" && roleScore < 75) return false;
      if (quickPreset === "immediate" && (c.nt || 0) > 15) return false;
      if (quickPreset === "top_test" && testAvg < 85) return false;
      if (quickPreset === "budget" && targetJob && c.es > targetJob.b) return false;
      if (quickPreset === "saved" && !bookmarkedTalent.includes(c.n)) return false;
      if (quickPreset === "in_pipeline" && !myApps.some((a) => a.name === c.n)) return false;

      return true;
    }).sort((a, b) => {
      if (talentSort === "a") return avgCandidateScore(b) - avgCandidateScore(a);
      if (talentSort === "x") return b.x - a.x;
      if (talentSort === "sal") return a.es - b.es;
      return (
        calcTalentScore(b, getBestJobForCandidate(b)) -
        calcTalentScore(a, getBestJobForCandidate(a))
      );
    });
  }, [
    talentQuery,
    talentExpLevels,
    talentWorkModes,
    talentMinAssessment,
    talentOnlyCertified,
    talentMaxSalary,
    talentNoticePeriod,
    talentSort,
    quickPreset,
    bookmarkedTalent,
    myApps,
    selectedJobObj,
    talentTier,
  ]);

  const handleMoveCandidateSourcing = (cand: ProCandidate, targetStage: SourcingStage) => {
    setSourcingMap((prev) => ({ ...prev, [cand.n]: targetStage }));
    const targetJob = getBestJobForCandidate(cand) || myJobs[0] || jobs[0];

    if (targetStage === "Saved" && !bookmarkedTalent.includes(cand.n)) {
      setBookmarkedTalent((prev) => [...prev, cand.n]);
    }

    if (
      (targetStage === "Shortlisted" || targetStage === "Interview" || targetStage === "Invited") &&
      targetJob
    ) {
      const mappedPipelineStage: ProApplication["st"] =
        targetStage === "Interview"
          ? "Interview"
          : targetStage === "Shortlisted"
          ? "Shortlisted"
          : "Applied";
      const existingApp = myApps.find((a) => a.name === cand.n && a.jid === targetJob.id);
      if (existingApp) {
        onUpdateApplicantStage(existingApp.id, mappedPipelineStage);
      } else if (onAddCandidateToPipeline) {
        onAddCandidateToPipeline(
          cand,
          targetJob.id,
          mappedPipelineStage,
          `Sourced from Find Talent into ${mappedPipelineStage} for ${targetJob.t}.`
        );
      } else {
        onToast(`Moved ${cand.n} to ${targetStage} (${targetJob.t})`);
      }
      return;
    }

    onToast(`Moved ${cand.n} to ${targetStage}`);
  };

  const handleDownloadCandidateCir = (cand: ProCandidate) => {
    const targetJob = getBestJobForCandidate(cand);
    const avgScore = avgCandidateScore(cand);
    const roleScore = calcTalentScore(cand, targetJob);
    const cirId = `CIR-${generateHash(cand.n)}`;
    const certData: RealTimeCertificateData = {
      credentialId: cirId,
      candidateName: cand.n,
      candidateEmail: `${cand.n.toLowerCase().replace(/\s+/g, ".")}@talentcir.verified`,
      candidateRole: `${levelFromExp(cand.x)} ${cand.sk[0] || "Software"} Engineer`,
      title: `${cand.sk[0] || "Engineering"} & Career Intelligence Readiness`,
      issuer: "TalentCIR AI-Proctored Assessment Authority",
      issuedDate: "Nov 2026",
      validUntil: "Nov 2028",
      score: avgScore,
      percentile: avgScore >= 88 ? "Top 4%" : avgScore >= 80 ? "Top 9%" : "Top 15%",
      integrityScore: "99.8%",
      timeTaken: "35m 40s / 45m",
      codingTestCases: "12 / 12 Passed",
      peerAverage: 64,
      partnerCutoff: 60,
      salaryBand: `INR ${cand.es} LPA`,
      verificationHash: `0x94E1...${avgScore}B7`,
      subSkills: Object.entries(cand.as).map(([k, v]) => ({
        name: `${k} Verified Assessment`,
        score: v,
        benchmark: 62,
      })),
      recruiterSummary: `${cand.n} scored ${avgScore}% across proctored technical assessments and has a ${roleScore}% role match for ${targetJob?.t || "your open engineering roles"}.`,
    };
    downloadCirReportPdf(certData);
    onToast(`Downloaded CIR Report (${cirId}.pdf) for ${cand.n}`);
  };

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
    return (
      <div className="space-y-6">
        <div className="bg-card border border-border/80 rounded-2xl p-6 relative overflow-hidden shadow-sm">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
              <Building2 className="w-3.5 h-3.5" /> Employer Branding
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-display">
              Company Profile &amp; Culture
            </h1>
            <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
              Showcase your company mission, headquarters, perks, and values to attract top-tier verified talent.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <form
            onSubmit={handleSaveCp}
            className="lg:col-span-7 bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4"
          >
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
                <label className="font-medium text-foreground block mb-2">Benefits &amp; Perks</label>
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
                        {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                        {benefit}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border/60 flex justify-end">
              <Button type="submit" className="rounded-xl text-xs font-medium gap-2">
                <Check className="w-3.5 h-3.5" /> Save Company Profile
              </Button>
            </div>
          </form>

          <div className="lg:col-span-5 bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary" /> Candidate-Facing Preview
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Verified Partner
              </span>
            </div>

            <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={getCompanyLogo(cpData.name)}
                  alt={cpData.name}
                  className="w-12 h-12 rounded-xl object-contain p-1 border border-border/60 bg-background"
                />
                <div>
                  <div className="font-bold text-foreground text-base">{cpData.name}</div>
                  <div className="text-muted-foreground">
                    {cpData.ind} • {cpData.size} • {cpData.hq}
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed">{cpData.about}</p>

              {cpData.mission && (
                <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/20 text-foreground italic">
                  "{cpData.mission}"
                </div>
              )}

              <div>
                <div className="font-semibold text-foreground mb-1.5">Perks &amp; Benefits</div>
                <div className="flex flex-wrap gap-1.5">
                  {cpData.ben.map((b) => (
                    <span
                      key={b}
                      className="px-2 py-0.5 rounded-md bg-background border border-border/60 text-[11px] font-medium text-foreground"
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
    return (
      <div className="space-y-6">
        <div className="bg-card border border-border/80 rounded-2xl p-6 relative overflow-hidden shadow-sm">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
              <Briefcase className="w-3.5 h-3.5" /> Job Studio
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-display">
              Create a Job Opening
            </h1>
            <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
              Publish a role with transparent salary bands and 24-hour review SLA commitment.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <form
            onSubmit={handlePublish}
            className="lg:col-span-7 bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="font-semibold text-foreground text-base">Role Details</h3>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-muted-foreground mr-1">Quick Templates:</span>
                {JOB_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl[0]}
                    type="button"
                    onClick={() => {
                      setJobTitle(tpl[1]);
                      setJobWorkMode(tpl[2]);
                      setJobMinExp(tpl[3]);
                      setJobMinSal(tpl[4]);
                      setJobMaxSal(tpl[5]);
                      setJobSkills(tpl[6]);
                      onToast(`Applied "${tpl[0]}" template!`);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary text-xs font-medium transition-colors"
                  >
                    {tpl[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-foreground block mb-1">Job Title</label>
                <Input
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Backend Engineer"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-medium text-foreground block mb-1">Location</label>
                  <Input
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    placeholder="e.g. Bengaluru"
                    required
                  />
                </div>
                <div>
                  <label className="font-medium text-foreground block mb-1">Work Mode</label>
                  <select
                    value={jobWorkMode}
                    onChange={(e) => setJobWorkMode(e.target.value as any)}
                    className="w-full h-9 rounded-xl border border-input bg-background px-3 py-1 text-xs shadow-sm focus-visible:outline-none"
                  >
                    <option>Hybrid</option>
                    <option>Remote</option>
                    <option>Onsite</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-foreground block mb-1">Job Type</label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value as any)}
                    className="w-full h-9 rounded-xl border border-input bg-background px-3 py-1 text-xs shadow-sm focus-visible:outline-none"
                  >
                    <option>Full-time</option>
                    <option>Internship</option>
                    <option>Contract</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-medium text-foreground block mb-1">
                    Min Experience (Yrs)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="20"
                    value={jobMinExp}
                    onChange={(e) => setJobMinExp(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="font-medium text-foreground block mb-1">Min Salary (LPA)</label>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={jobMinSal}
                    onChange={(e) => setJobMinSal(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="font-medium text-foreground block mb-1">Max Salary (LPA)</label>
                  <Input
                    type="number"
                    min="1"
                    max="150"
                    value={jobMaxSal}
                    onChange={(e) => setJobMaxSal(Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-foreground block mb-1">
                  Required Skills (comma separated)
                </label>
                <Input
                  value={jobSkills}
                  onChange={(e) => setJobSkills(e.target.value)}
                  placeholder="React, TypeScript, Node.js, AWS"
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
    // HR SOURCING KPI METRICS
    const highMatchCount = CANDIDATES_SEED.filter(
      (c) => calcTalentScore(c, getBestJobForCandidate(c)) >= 75
    ).length;
    const immediateCount = CANDIDATES_SEED.filter((c) => (c.nt || 0) <= 15).length;
    const eliteScoreCount = CANDIDATES_SEED.filter((c) => avgCandidateScore(c) >= 85).length;
    const inPipelineCount = CANDIDATES_SEED.filter((c) =>
      myApps.some((a) => a.name === c.n)
    ).length;

    const kpiStats = [
      {
        id: "all" as const,
        label: "Verified Talent Pool",
        count: CANDIDATES_SEED.length,
        sub: "100% ID & skill verified",
        icon: Users,
        theme: "all",
      },
      {
        id: "high_match" as const,
        label: "High Job Match (75%+)",
        count: highMatchCount,
        sub: selectedJobObj ? `For ${selectedJobObj.t}` : "Across active openings",
        icon: Sparkles,
        theme: "Shortlisted",
      },
      {
        id: "immediate" as const,
        label: "Immediate / ≤15d Joiners",
        count: immediateCount,
        sub: "Fast onboarding ready",
        icon: Zap,
        theme: "Applied",
      },
      {
        id: "top_test" as const,
        label: "Elite CIR Score (85%+)",
        count: eliteScoreCount,
        sub: "Top proctored performers",
        icon: Award,
        theme: "Interview",
      },
      {
        id: "saved" as const,
        label: "Saved / Bookmarked",
        count: bookmarkedTalent.length,
        sub: "HR talent shortlist",
        icon: Bookmark,
        theme: "Offer",
      },
    ];

    return (
      <div className="employer-workspace space-y-5">
        {/* Top Header + View Switcher */}
        <header className="workspace-header flex-wrap">
          <div>
            <span className="workspace-eyebrow">
              <Users size={14} />
              Talent Sourcing
            </span>
            <h1 className="workspace-heading">Find Pre-Assessed Talent</h1>
            <p className="workspace-description">
              Match verified candidates against your open roles and move top fits into your pipeline.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5">
            <Button
              size="sm"
              variant={talentLayout === "cards" ? "default" : "outline"}
              onClick={() => setTalentLayout("cards")}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Cards
            </Button>
            <Button
              size="sm"
              variant={talentLayout === "kanban" ? "default" : "outline"}
              onClick={() => setTalentLayout("kanban")}
            >
              <Kanban className="h-3.5 w-3.5" />
              Kanban
            </Button>
            <Button
              size="sm"
              variant={talentLayout === "matrix" ? "default" : "outline"}
              onClick={() => setTalentLayout("matrix")}
            >
              <Table2 className="h-3.5 w-3.5" />
              Matrix
            </Button>
          </div>
        </header>

        {/* Top Wallet Bento Box: Company Wallet + Candidates vs Verified Candidates */}
        <section
          aria-label="Hiring wallet and candidate pool selector"
          className="workspace-wallet-bento"
        >
          {/* Bento Cell 1: Company Wallet */}
          <article className="workspace-panel lg:col-span-4 !p-4 flex flex-col justify-between gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="workspace-icon !h-10 !w-10 shrink-0">
                  <Wallet size={18} />
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Company Wallet
                  </p>
                  <p className="text-xl font-bold text-foreground mt-0.5">
                    {formatINR(walletBalance)}
                  </p>
                </div>
              </div>

              {verifiedUnlocked ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                  <BadgeCheck className="h-3 w-3" />
                  Verified Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  Standard Pool
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/70 pt-2.5 text-xs">
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-7 px-2.5 text-[11px] font-semibold"
                  onClick={() => handleQuickRechargeDemo(2000)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add ₹2,000
                </Button>
                {onNavigate && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground"
                    onClick={() => onNavigate("payment-history")}
                  >
                    Ledger →
                  </Button>
                )}
              </div>

              {verifiedUnlocked && (
                <button
                  type="button"
                  onClick={() => {
                    setVerifiedUnlocked(false);
                    setTalentTier("standard");
                    onToast("Reset demo Verified Pass so you can test wallet unlock again.");
                  }}
                  className="text-[11px] font-medium text-muted-foreground hover:text-primary underline cursor-pointer"
                >
                  Relock pass
                </button>
              )}
            </div>
          </article>

          {/* Bento Cell 2: Option 1 — Standard Candidates (Free) */}
          <button
            type="button"
            data-selected={talentTier === "standard"}
            onClick={() => handleSelectTalentTier("standard")}
            className="workspace-tier-card lg:col-span-4"
          >
            <div className="flex items-start justify-between gap-2 w-full">
              <div className="flex items-center gap-2.5">
                <span className="workspace-icon !h-9 !w-9 shrink-0">
                  <Users size={17} />
                </span>
                <div>
                  <span className="block text-sm font-bold text-foreground">Candidates</span>
                  <span className="block text-[11px] text-muted-foreground">
                    Public talent directory
                  </span>
                </div>
              </div>
              <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-bold text-foreground">
                Free Browse
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Search public candidate profiles, skills, experience &amp; role match scores with zero wallet deduction.
            </p>
          </button>

          {/* Bento Cell 3: Option 2 — Verified Candidates (Wallet Deduction Pass) */}
          <button
            type="button"
            data-selected={talentTier === "verified"}
            onClick={() => handleSelectTalentTier("verified")}
            className="workspace-tier-card lg:col-span-4"
          >
            <div className="flex items-start justify-between gap-2 w-full">
              <div className="flex items-center gap-2.5">
                <span className="workspace-icon !h-9 !w-9 shrink-0">
                  <BadgeCheck size={18} />
                </span>
                <div>
                  <span className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                    Verified Candidates
                    <Crown className="h-3.5 w-3.5 text-amber-500" />
                  </span>
                  <span className="block text-[11px] text-muted-foreground">
                    AI-Proctored &amp; CIR Certified
                  </span>
                </div>
              </div>
              {verifiedUnlocked ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                  <Check className="h-3 w-3" />
                  Unlocked
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                  <Lock className="h-3 w-3" />
                  ₹499 Wallet
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Search 100% ID &amp; proctoring-verified talent with full CIR scorecards, direct contact details &amp; PDF reports.
            </p>
          </button>
        </section>

        {/* Native Modal Confirmation Dialog: "Are you sure?" Wallet Deduction */}
        <dialog
          ref={walletDialogRef}
          className="workspace-native-dialog"
          aria-labelledby="verify-wallet-dialog-title"
          onClose={() => setPendingCirCandidate(null)}
        >
          <div className="p-5 sm:p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="workspace-icon !h-10 !w-10 shrink-0">
                  <BadgeCheck size={20} />
                </span>
                <div>
                  <h2 id="verify-wallet-dialog-title" className="text-base font-bold text-foreground">
                    Are you sure you want to unlock Verified Candidates?
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Searching Verified Candidates deducts the pass amount from your Company Wallet.
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close confirmation dialog"
                onClick={closeWalletConfirmModal}
                className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Pass Selection Options */}
            <div className="space-y-2">
              {(["session", "monthly"] as const).map((key) => {
                const opt = PASS_OPTIONS[key];
                const isChosen = selectedPassKey === key;
                return (
                  <label
                    key={key}
                    className="workspace-pass-choice"
                  >
                    <input
                      type="radio"
                      name="verified-pass-tier"
                      checked={isChosen}
                      onChange={() => setSelectedPassKey(key)}
                      className="mt-1 accent-primary"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-foreground">{opt.label}</span>
                        <strong className="text-xs font-bold text-primary">
                          {formatINR(opt.cost)}
                        </strong>
                      </div>
                      <p className="mt-0.5 text-[11px] text-muted-foreground leading-snug">
                        {opt.desc}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Wallet Balance Math Breakdown */}
            <div className="rounded-xl border border-border bg-muted/30 p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Current Company Wallet</span>
                <span className="font-semibold text-foreground">{formatINR(walletBalance)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Wallet Deduction</span>
                <span className="font-bold text-destructive">
                  − {formatINR(PASS_OPTIONS[selectedPassKey].cost)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-2">
                <span className="font-semibold text-foreground">Remaining Balance</span>
                <strong
                  className={`text-sm ${
                    walletBalance >= PASS_OPTIONS[selectedPassKey].cost
                      ? "text-emerald-700"
                      : "text-destructive"
                  }`}
                >
                  {walletBalance >= PASS_OPTIONS[selectedPassKey].cost
                    ? formatINR(walletBalance - PASS_OPTIONS[selectedPassKey].cost)
                    : `Short by ${formatINR(PASS_OPTIONS[selectedPassKey].cost - walletBalance)}`}
                </strong>
              </div>
            </div>

            {walletBalance < PASS_OPTIONS[selectedPassKey].cost && (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-xs">
                <span className="text-amber-900 font-medium">
                  Low wallet balance for this pass.
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs shrink-0"
                  onClick={() => handleQuickRechargeDemo(3000)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Top Up ₹3,000
                </Button>
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                autoFocus
                onClick={closeWalletConfirmModal}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={walletBalance < PASS_OPTIONS[selectedPassKey].cost}
                onClick={handleConfirmVerifiedDeduction}
                className="gap-1.5"
              >
                <Wallet className="h-3.5 w-3.5" />
                Yes, Deduct {formatINR(PASS_OPTIONS[selectedPassKey].cost)} &amp; Unlock
              </Button>
            </div>
          </div>
        </dialog>

        {/* Differentiated HR KPI Summary Cards (Click any card to filter) */}
        <div className="workspace-stats">
          {kpiStats.map(({ id, label, count, icon: Icon, theme }) => {
            const isActive = quickPreset === id && id !== "all";
            return (
              <Button
                key={id}
                variant="ghost"
                data-stage-theme={theme}
                className={`workspace-stat ${isActive ? "workspace-stat--active" : ""}`}
                onClick={() => setQuickPreset((prev) => (prev === id ? "all" : id))}
              >
                <div className="workspace-icon">
                  <Icon size={22} />
                </div>
                <div>
                  <span>{label}</span>
                  <strong>{count}</strong>
                </div>
              </Button>
            );
          })}
        </div>

        {/* Single Clean Search, Role Matcher & Separate Filter Icon Bar */}
        <div className="workspace-panel !p-3">
          <div
            className="relative flex flex-wrap items-center gap-2.5"
            ref={filterPopoverRef}
          >
            {/* Active Job Opening Match Selector */}
            <select
              aria-label="Match candidates against job opening"
              value={talentJobFilter}
              onChange={(e) => setTalentJobFilter(e.target.value)}
              className="!h-9 !w-auto min-w-[210px] text-xs font-semibold cursor-pointer"
            >
              <option value="">Auto-Match Best Role ({myJobs.length} active)</option>
              {myJobs.map((j) => (
                <option key={j.id} value={j.id}>
                  Role: {j.t} (₹{j.a}–{j.b}L)
                </option>
              ))}
            </select>

            {/* Unified Search Input */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                aria-label="Search candidates by name, skill or city"
                placeholder="Search by name, skill (React, Python, AWS), or city..."
                value={talentQuery}
                onChange={(e) => setTalentQuery(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            {/* Single Clean Separate Filter Icon */}
            <Button
              type="button"
              size="icon"
              variant={filterOpen || activeTalentFilterCount > 0 ? "default" : "outline"}
              aria-label="Open talent filters"
              aria-expanded={filterOpen}
              title="Filter candidates"
              onClick={() => setFilterOpen((prev) => !prev)}
              className="relative h-9 w-9 rounded-lg shrink-0"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {activeTalentFilterCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground ring-2 ring-background">
                  {activeTalentFilterCount}
                </span>
              )}
            </Button>

            {activeTalentFilterCount > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetTalentFilters}
                className="h-9 text-xs text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="mr-1 h-3.5 w-3.5" />
                Reset
              </Button>
            )}

            {/* Filter Popover Panel */}
            {filterOpen && (
              <div
                role="dialog"
                aria-label="Talent filters"
                className="absolute right-0 top-full z-30 mt-2 w-[340px] sm:w-[380px] rounded-xl border border-border bg-card p-4 shadow-xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-border pb-2.5">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <SlidersHorizontal size={14} className="text-primary" />
                    Filters
                  </span>
                  <button
                    type="button"
                    aria-label="Close filters"
                    onClick={() => setFilterOpen(false)}
                    className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-foreground">
                    Experience Tier
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {["Fresher", "Junior", "Mid", "Senior"].map((lvl) => {
                      const active = talentExpLevels.includes(lvl);
                      return (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() =>
                            setTalentExpLevels((prev) =>
                              active ? prev.filter((x) => x !== lvl) : [...prev, lvl]
                            )
                          }
                          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold border transition-colors ${
                            active
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-muted/40 text-foreground hover:border-primary/50"
                          }`}
                        >
                          {lvl}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-foreground">
                    Work Mode Preference
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {["Remote", "Hybrid", "Onsite"].map((wm) => {
                      const active = talentWorkModes.includes(wm);
                      return (
                        <button
                          key={wm}
                          type="button"
                          onClick={() =>
                            setTalentWorkModes((prev) =>
                              active ? prev.filter((x) => x !== wm) : [...prev, wm]
                            )
                          }
                          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold border transition-colors ${
                            active
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-muted/40 text-foreground hover:border-primary/50"
                          }`}
                        >
                          {wm}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-foreground">
                      Min CIR Score{" "}
                      <span className="float-right text-primary">{talentMinAssessment}%</span>
                      <input
                        type="range"
                        min={0}
                        max={95}
                        step={5}
                        value={talentMinAssessment}
                        onChange={(e) => setTalentMinAssessment(Number(e.target.value))}
                        className="mt-2 w-full accent-primary"
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-foreground">
                      Max Salary{" "}
                      <span className="float-right text-primary">₹{talentMaxSalary}L</span>
                      <input
                        type="range"
                        min={4}
                        max={60}
                        step={2}
                        value={talentMaxSalary}
                        onChange={(e) => setTalentMaxSalary(Number(e.target.value))}
                        className="mt-2 w-full accent-primary"
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-foreground mb-1">
                      Notice Period
                    </label>
                    <select
                      value={talentNoticePeriod}
                      onChange={(e) => setTalentNoticePeriod(Number(e.target.value))}
                      className="!h-9 text-xs"
                    >
                      <option value={999}>Any notice period</option>
                      <option value={0}>Immediate only</option>
                      <option value={15}>≤ 15 days</option>
                      <option value={30}>≤ 30 days</option>
                      <option value={60}>≤ 60 days</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-foreground mb-1">
                      Sort By
                    </label>
                    <select
                      value={talentSort}
                      onChange={(e) => setTalentSort(e.target.value as any)}
                      className="!h-9 text-xs"
                    >
                      <option value="s">Best Job Match</option>
                      <option value="a">Assessment Score</option>
                      <option value="x">Experience (High–Low)</option>
                      <option value="sal">Expected CTC (Low–High)</option>
                    </select>
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={talentOnlyCertified}
                    onChange={(e) => setTalentOnlyCertified(e.target.checked)}
                    className="accent-primary"
                  />
                  Certified Candidates Only
                </label>

                <div className="flex items-center justify-between border-t border-border pt-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={resetTalentFilters}
                    className="h-8 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="mr-1 h-3.5 w-3.5" />
                    Reset all
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setFilterOpen(false)}
                    className="h-8 text-xs"
                  >
                    Done
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Compare Floating Bar if Candidates Selected */}
        {selectedTalentToCompare.length > 0 && (
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/30 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-foreground flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-primary" />
              Comparing {selectedTalentToCompare.length}:{" "}
              <span className="text-primary font-bold">
                {selectedTalentToCompare.join(", ")}
              </span>
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => onOpenDrawer({ type: "compare-candidates" })}
                className="h-8 text-xs gap-1.5"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" /> Compare ({selectedTalentToCompare.length})
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => updateCompareList([])}
                className="h-8 text-xs text-muted-foreground"
              >
                Clear
              </Button>
            </div>
          </div>
        )}

        {/* VIEW 1: CLEAN, UNCLUTTERED HR CARDS */}
        {talentLayout === "cards" && (
          <div className="space-y-4">
            {filteredCandidates.length === 0 ? (
              <div className="workspace-panel py-12 text-center space-y-3">
                <p className="text-sm font-semibold text-foreground">
                  No candidates match your active filters.
                </p>
                <Button size="sm" variant="outline" onClick={resetTalentFilters}>
                  <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {filteredCandidates.map((cand) => {
                  const targetJob = getBestJobForCandidate(cand);
                  const roleMatch = calcTalentScore(cand, targetJob);
                  const testAvg = avgCandidateScore(cand);
                  const isCompared = selectedTalentToCompare.includes(cand.n);
                  const isBookmarked = bookmarkedTalent.includes(cand.n);
                  const currentStage = getCandidateStage(cand.n);
                  const existingApp = myApps.find((a) => a.name === cand.n);
                  const isExpanded = expandedFitCard === cand.n;
                  const fitRows = targetJob ? candidateFitForJob(cand, targetJob) : [];

                  const matchedSkills = targetJob
                    ? cand.sk.filter((s) =>
                        targetJob.sk.some((js) => js.toLowerCase() === s.toLowerCase())
                      )
                    : cand.sk;

                  return (
                    <article
                      key={cand.n}
                      className="workspace-panel !p-5 flex flex-col justify-between gap-4 transition-all hover:border-primary/40"
                    >
                      {/* Row 1: Identity + Match Score */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3.5 min-w-0">
                          <img
                            src={getCandidatePhoto(cand.n)}
                            alt={cand.n}
                            onClick={() =>
                              onOpenDrawer({
                                type: "candidate",
                                name: cand.n,
                                jobId: targetJob?.id,
                              })
                            }
                            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-border cursor-pointer"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <button
                                type="button"
                                onClick={() =>
                                  onOpenDrawer({
                                    type: "candidate",
                                    name: cand.n,
                                    jobId: targetJob?.id,
                                  })
                                }
                                className="font-bold text-foreground text-base hover:text-primary transition-colors cursor-pointer"
                              >
                                {cand.n}
                              </button>
                              <ShieldCheck
                                className="w-4 h-4 text-emerald-600 shrink-0"
                                aria-label="Verified CIR"
                              />
                              {existingApp && (
                                <span className="workspace-chip !px-2 !py-0.5 !text-[10px]">
                                  {existingApp.st}
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-muted-foreground mt-0.5 truncate">
                              {levelFromExp(cand.x)} {cand.sk[0]} Engineer
                              {targetJob ? ` · Best fit: ${targetJob.t}` : ""}
                            </p>

                            <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-2 flex-wrap">
                              <span>{cand.c} ({cand.wp})</span>
                              <span>·</span>
                              <span>{cand.x} yrs</span>
                              <span>·</span>
                              <span className="font-semibold text-foreground">₹{cand.es} LPA</span>
                              <span>·</span>
                              <span className="text-primary font-medium">
                                {cand.nt === 0 ? "Immediate" : `${cand.nt}d notice`}
                              </span>
                              {talentTier === "verified" && verifiedUnlocked ? (
                                <>
                                  <span>·</span>
                                  <span className="text-emerald-700 font-semibold">
                                    {cand.n.toLowerCase().replace(/\s+/g, ".")}@talentcir.verified
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span>·</span>
                                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                                    <Lock className="w-3 h-3" /> Contact locked
                                  </span>
                                </>
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Right: Clean Match Pill + Bookmark Icon */}
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="text-right">
                            <span className="inline-flex items-center rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                              {roleMatch}% Match
                            </span>
                            <span className="block text-[10px] text-muted-foreground mt-0.5">
                              CIR Avg {testAvg}%
                            </span>
                          </div>

                          <button
                            type="button"
                            aria-label={`Bookmark ${cand.n}`}
                            title={isBookmarked ? "Saved" : "Save candidate"}
                            onClick={() => toggleBookmark(cand.n)}
                            className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors cursor-pointer ${
                              isBookmarked
                                ? "border-amber-500/40 bg-amber-500/10 text-amber-600"
                                : "border-border bg-background text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <Bookmark
                              className="w-3.5 h-3.5"
                              fill={isBookmarked ? "currentColor" : "none"}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Row 2: Unified Skills with Assessment Scores (Single clean row) */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {cand.sk.map((s) => {
                            const isMatched = matchedSkills.includes(s);
                            const skillScore = cand.as[s];
                            return (
                              <span
                                key={s}
                                className={`px-2.5 py-1 rounded-md text-[11px] font-medium border inline-flex items-center gap-1.5 ${
                                  isMatched
                                    ? "border-primary/30 bg-primary/5 text-foreground"
                                    : "border-border bg-muted/40 text-muted-foreground"
                                }`}
                              >
                                {s}
                                {skillScore !== undefined && (
                                  <strong className="text-primary font-bold">{skillScore}%</strong>
                                )}
                              </span>
                            );
                          })}
                        </div>

                        {targetJob && (
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedFitCard((prev) => (prev === cand.n ? null : cand.n))
                            }
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-primary cursor-pointer"
                          >
                            Job Fit
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>

                      {/* Optional Expandable Job Fit Breakdown (Hidden by default) */}
                      {isExpanded && fitRows.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 rounded-xl border border-border bg-muted/20 p-3 text-xs">
                          {fitRows.map((row) => (
                            <div key={row.name} className="space-y-0.5">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-muted-foreground">{row.name}</span>
                                <strong className="text-foreground">{row.score}%</strong>
                              </div>
                              <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-primary"
                                  style={{ width: `${Math.max(8, row.score)}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Row 3: Clean Action Footer */}
                      <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2 text-xs">
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
                            View Profile
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1"
                            onClick={() =>
                              verifiedUnlocked
                                ? handleDownloadCandidateCir(cand)
                                : openWalletConfirmModal(cand)
                            }
                          >
                            {verifiedUnlocked ? (
                              <Download className="w-3.5 h-3.5" />
                            ) : (
                              <Lock className="w-3.5 h-3.5" />
                            )}
                            CIR PDF
                          </Button>
                          <label className="inline-flex items-center gap-1.5 px-2 py-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isCompared}
                              onChange={() =>
                                updateCompareList(
                                  isCompared
                                    ? selectedTalentToCompare.filter((x) => x !== cand.n)
                                    : [...selectedTalentToCompare, cand.n]
                                )
                              }
                              className="accent-primary"
                            />
                            Compare
                          </label>
                        </div>

                        <Button
                          size="sm"
                          variant={currentStage === "Shortlisted" || existingApp ? "secondary" : "default"}
                          className="h-8 text-xs gap-1.5"
                          onClick={() =>
                            handleMoveCandidateSourcing(cand, "Shortlisted")
                          }
                        >
                          {existingApp || currentStage === "Shortlisted" ? (
                            <>
                              <Check className="w-3.5 h-3.5" /> Shortlisted
                            </>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" /> Shortlist
                            </>
                          )}
                        </Button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: SOURCING KANBAN BOARD FOR FIND TALENT */}
        {talentLayout === "kanban" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Drag and drop verified candidates across sourcing stages. Dropping into{" "}
                <strong className="text-foreground">Shortlisted for Role</strong> or{" "}
                <strong className="text-foreground">Interviewing</strong> automatically adds them to{" "}
                {selectedJobObj ? selectedJobObj.t : "your active job pipeline"}.
              </span>
            </div>

            <div className="workspace-board" aria-label="Find talent sourcing kanban">
              {SOURCING_COLUMNS.map((col) => {
                const colItems = filteredCandidates.filter(
                  (c) => getCandidateStage(c.n) === col.id
                );
                const isDragOver = dragOverSourcingStage === col.id;

                return (
                  <section
                    key={col.id}
                    data-stage-theme={col.theme}
                    aria-label={`${col.title} column`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = "move";
                      if (dragOverSourcingStage !== col.id) setDragOverSourcingStage(col.id);
                    }}
                    onDragEnter={(e) => {
                      e.preventDefault();
                      setDragOverSourcingStage(col.id);
                    }}
                    onDragLeave={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                        setDragOverSourcingStage((prev) => (prev === col.id ? null : prev));
                      }
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOverSourcingStage(null);
                      const droppedName =
                        draggedCandName || e.dataTransfer.getData("text/plain");
                      setDraggedCandName(null);
                      const cand = CANDIDATES_SEED.find((c) => c.n === droppedName);
                      if (cand) {
                        handleMoveCandidateSourcing(cand, col.id);
                      }
                    }}
                    className={`workspace-column ${
                      isDragOver ? "workspace-column--drag-over" : ""
                    }`}
                  >
                    <div className="workspace-column-header">
                      <div className="min-w-0 flex-1">
                        <h2 className="workspace-column-title">{col.title}</h2>
                        <p className="workspace-column-subtitle">{col.subtitle}</p>
                      </div>
                      <span className="workspace-column-count">{colItems.length}</span>
                    </div>

                    {isDragOver && (
                      <div className="mb-2 rounded-lg border border-dashed border-current px-2.5 py-1.5 text-center text-[11px] font-semibold">
                        Drop to move to {col.title}
                      </div>
                    )}

                    <div className="workspace-column-cards">
                      {colItems.length === 0 ? (
                        <div className="py-12 px-2 text-center text-xs text-muted-foreground">
                          <p className="font-medium">No candidates in {col.id}</p>
                          <p className="mt-1 text-[10px] opacity-80">
                            Drag a candidate card here
                          </p>
                        </div>
                      ) : (
                        colItems.map((cand) => {
                          const targetJob = getBestJobForCandidate(cand);
                          const roleMatch = calcTalentScore(cand, targetJob);
                          const testAvg = avgCandidateScore(cand);
                          const isDragging = draggedCandName === cand.n;

                          return (
                            <div
                              key={cand.n}
                              role="button"
                              tabIndex={0}
                              draggable
                              onDragStart={(e) => {
                                setDraggedCandName(cand.n);
                                e.dataTransfer.effectAllowed = "move";
                                e.dataTransfer.setData("text/plain", cand.n);
                              }}
                              onDragEnd={() => {
                                setDraggedCandName(null);
                                setDragOverSourcingStage(null);
                              }}
                              onClick={() =>
                                onOpenDrawer({
                                  type: "candidate",
                                  name: cand.n,
                                  jobId: targetJob?.id,
                                })
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  onOpenDrawer({
                                    type: "candidate",
                                    name: cand.n,
                                    jobId: targetJob?.id,
                                  });
                                }
                              }}
                              className={`workspace-candidate ${
                                isDragging ? "workspace-candidate--dragging" : ""
                              }`}
                            >
                              <div className="flex items-start gap-2.5">
                                <img src={getCandidatePhoto(cand.n)} alt={cand.n} />
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-start justify-between gap-1">
                                    <p className="text-xs font-bold leading-snug text-foreground break-words">
                                      {cand.n}
                                    </p>
                                    <span
                                      className="text-muted-foreground/60 shrink-0 pt-0.5"
                                      title="Drag to move sourcing stage"
                                      aria-hidden="true"
                                    >
                                      <GripVertical size={13} />
                                    </span>
                                  </div>
                                  <p className="mt-0.5 text-[10px] font-medium text-muted-foreground truncate">
                                    Fit: {targetJob?.t || `${cand.sk[0]} Role`}
                                  </p>
                                  <div className="mt-2 flex flex-wrap items-center gap-1">
                                    <span className="workspace-candidate-match">
                                      {roleMatch}% match
                                    </span>
                                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                                      CIR {testAvg}%
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-2.5 flex flex-wrap gap-1">
                                {cand.sk.slice(0, 3).map((sk) => (
                                  <span
                                    key={sk}
                                    className="rounded border border-border/70 bg-muted/50 px-1.5 py-0.5 text-[10px] font-medium"
                                  >
                                    {sk}
                                  </span>
                                ))}
                              </div>

                              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[10px] text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <CalendarDays size={11} />
                                  {cand.x}y · ₹{cand.es}L
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin size={11} />
                                  {cand.c}
                                </span>
                              </div>

                              <div className="mt-2 flex items-center justify-between gap-2 border-t border-border/60 pt-2">
                                <span className="flex items-center gap-1 text-[10px] font-semibold text-primary">
                                  <Clock size={11} />
                                  {cand.nt === 0 ? "Immediate" : `${cand.nt}d notice`}
                                </span>
                                <select
                                  aria-label={`Move ${cand.n} to sourcing stage`}
                                  value={col.id}
                                  onClick={(e) => e.stopPropagation()}
                                  onKeyDown={(e) => e.stopPropagation()}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    handleMoveCandidateSourcing(
                                      cand,
                                      e.target.value as SourcingStage
                                    );
                                  }}
                                  className="!h-6 !w-auto !rounded-md !border-border/80 !bg-muted/40 !px-1.5 !py-0 !text-[10px] font-semibold cursor-pointer"
                                >
                                  {SOURCING_COLUMNS.map((s) => (
                                    <option key={s.id} value={s.id}>
                                      {s.id}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 3: MULTI-JOB MATCH & COMPARISON MATRIX */}
        {talentLayout === "matrix" && (
          <div className="workspace-panel !p-0 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
              <div>
                <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Table2 className="h-4 w-4 text-primary" />
                  Multi-Role Job Match &amp; Candidate Comparison Matrix
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Compare every candidate&apos;s exact role fit across all active job openings, assessment scores, salary vs. budget, and notice period.
                </p>
              </div>
              {selectedTalentToCompare.length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateCompareList([])}
                  className="h-8 text-xs"
                >
                  Show All ({filteredCandidates.length})
                </Button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-xs">
                <thead className="border-b border-border bg-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Candidate</th>
                    <th className="px-3 py-3">CIR Test Avg</th>
                    {(myJobs.length ? myJobs : jobs.slice(0, 3)).map((j) => (
                      <th key={j.id} className="px-3 py-3">
                        Fit: {j.t}
                      </th>
                    ))}
                    <th className="px-3 py-3">Exp &amp; Mode</th>
                    <th className="px-3 py-3">CTC / Notice</th>
                    <th className="px-3 py-3">Stage</th>
                    <th className="px-4 py-3 text-right">HR Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {(selectedTalentToCompare.length > 0
                    ? filteredCandidates.filter((c) => selectedTalentToCompare.includes(c.n))
                    : filteredCandidates
                  ).map((cand) => {
                    const bestJob = getBestJobForCandidate(cand);
                    const testAvg = avgCandidateScore(cand);
                    const stage = getCandidateStage(cand.n);
                    const roleCols = myJobs.length ? myJobs : jobs.slice(0, 3);

                    return (
                      <tr key={cand.n} className="hover:bg-muted/30">
                        <td className="px-4 py-3.5">
                          <button
                            type="button"
                            onClick={() =>
                              onOpenDrawer({
                                type: "candidate",
                                name: cand.n,
                                jobId: bestJob?.id,
                              })
                            }
                            className="flex items-center gap-3 text-left cursor-pointer group"
                          >
                            <img
                              src={getCandidatePhoto(cand.n)}
                              alt={cand.n}
                              className="h-9 w-9 rounded-full object-cover border border-border"
                            />
                            <div>
                              <span className="font-bold text-foreground group-hover:text-primary block">
                                {cand.n}
                              </span>
                              <span className="text-[11px] text-muted-foreground">
                                {cand.sk.join(", ")}
                              </span>
                            </div>
                          </button>
                        </td>
                        <td className="px-3 py-3.5">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                            <Star className="h-3 w-3" />
                            {testAvg}%
                          </span>
                        </td>
                        {roleCols.map((j) => {
                          const score = calcTalentScore(cand, j);
                          return (
                            <td key={j.id} className="px-3 py-3.5">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`font-bold ${
                                    score >= 80
                                      ? "text-emerald-600"
                                      : score >= 65
                                      ? "text-primary"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {score}%
                                </span>
                                <div className="h-1.5 w-14 rounded-full bg-muted overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-primary"
                                    style={{ width: `${score}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                          );
                        })}
                        <td className="px-3 py-3.5">
                          <span className="font-semibold">{cand.x} yrs</span> ({levelFromExp(cand.x)}
                          )
                          <span className="block text-[11px] text-muted-foreground">
                            {cand.c} · {cand.wp}
                          </span>
                        </td>
                        <td className="px-3 py-3.5">
                          <span className="font-semibold text-foreground">₹{cand.es} LPA</span>
                          <span className="block text-[11px] text-primary font-medium">
                            {cand.nt === 0 ? "Immediate" : `${cand.nt}d notice`}
                          </span>
                        </td>
                        <td className="px-3 py-3.5">
                          <span className="workspace-chip !px-2 !py-0.5 !text-[10px]">
                            {stage}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="inline-flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-[11px]"
                              onClick={() => handleDownloadCandidateCir(cand)}
                            >
                              CIR PDF
                            </Button>
                            <Button
                              size="sm"
                              className="h-7 px-2.5 text-[11px]"
                              onClick={() =>
                                handleMoveCandidateSourcing(cand, "Shortlisted")
                              }
                            >
                              Shortlist
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 4. PIPELINE KANBAN & LIST VIEW
  return (
    <div className="space-y-6">
      <div className="bg-card border border-border/80 rounded-2xl p-6 relative overflow-hidden shadow-sm">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
              <Layers className="w-3.5 h-3.5" /> Recruiter Pipeline
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-display">
              Candidate Pipeline Board
            </h1>
            <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
              Track applicant stages, keep candidates updated, and schedule interview rounds.
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
                Send "Under Review" update
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
