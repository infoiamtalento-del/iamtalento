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
    setJobTitle(tpl[0]);
    setJobLocation(tpl[1]);
    setJobWorkMode(tpl[2] as any);
    setJobType(tpl[3] as any);
    setJobMinExp(tpl[4]);
    setJobMinSal(tpl[5]);
    setJobMaxSal(tpl[6]);
    setJobSkills(tpl[7]);
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
  const [talentQuery, setTalentQuery] = useState("");
  const [talentSmartQuery, setTalentSmartQuery] = useState("");
  const [talentJobFilter, setTalentJobFilter] = useState<string>("");
  const [talentExpLevels, setTalentExpLevels] = useState<string[]>([]);
  const [talentMinAssessment, setTalentMinAssessment] = useState(0);
  const [talentOnlyCertified, setTalentOnlyCertified] = useState(false);
  const [talentMaxSalary, setTalentMaxSalary] = useState(60);
  const [talentNoticePeriod, setTalentNoticePeriod] = useState(999);
  const [talentSort, setTalentSort] = useState<"s" | "a" | "x">("s");
  const [selectedTalentToCompare, setSelectedTalentToCompare] = useState<string[]>([]);

  const handleSmartTalentSearch = () => {
    const q = talentSmartQuery.toLowerCase();
    if (!q) return;

    if (q.includes("react")) setTalentQuery("React");
    if (q.includes("python")) setTalentQuery("Python");
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
        if (!matchesName && !matchesSkill && !matchesCity) return false;
      }

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
      if (talentSort === "a") return avgCandidateScore(b) - avgCandidateScore(a);
      if (talentSort === "x") return b.x - a.x;
      return calcTalentScore(b, selectedJobObj) - calcTalentScore(a, selectedJobObj);
    });
  }, [
    talentQuery,
    talentExpLevels,
    talentMinAssessment,
    talentOnlyCertified,
    talentMaxSalary,
    talentNoticePeriod,
    talentSort,
    selectedJobObj,
  ]);

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
    // FIND TALENT VIEW
    return (
      <div className="space-y-6">
        {/* Header Hero */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <Users className="w-3.5 h-3.5" /> Verified Candidate Pool
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-display">
              Find Pre-Assessed Talent
            </h1>
            <p className="text-muted-foreground text-sm max-w-2xl">
              Source verified engineers whose skills, GitHub projects, and proctored test scores are pre-authenticated.
            </p>

            {/* Smart Search Bar */}
            <div className="flex items-center gap-2 max-w-xl pt-1">
              <Input
                placeholder='Smart find: "React developer Bengaluru 3 years certified under 20 LPA"'
                value={talentSmartQuery}
                onChange={(e) => setTalentSmartQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSmartTalentSearch()}
                className="text-xs h-10 rounded-xl"
              />
              <Button onClick={handleSmartTalentSearch} className="rounded-xl h-10 text-xs gap-1.5 shrink-0">
                <Sparkles className="w-3.5 h-3.5" /> Find
              </Button>
            </div>
          </div>
        </div>

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

        {/* 2-Column Grid: Filter Panel & Candidate Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Filters: 4 cols */}
          <div className="lg:col-span-4 bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary" /> Filter Candidates
              </h3>
              <button
                onClick={() => {
                  setTalentQuery("");
                  setTalentExpLevels([]);
                  setTalentMinAssessment(0);
                  setTalentOnlyCertified(false);
                  setTalentMaxSalary(60);
                  setTalentNoticePeriod(999);
                }}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-medium text-foreground block mb-1">Rank For Job Opening</label>
                <select
                  value={talentJobFilter}
                  onChange={(e) => setTalentJobFilter(e.target.value)}
                  className="w-full h-8 rounded-xl border border-input bg-background px-3 py-1 text-xs shadow-sm focus-visible:outline-none"
                >
                  <option value="">Generic (All Openings)</option>
                  {myJobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-medium text-foreground block mb-1">Search Name or Skill</label>
                <Input
                  value={talentQuery}
                  onChange={(e) => setTalentQuery(e.target.value)}
                  placeholder="e.g. React, SQL, Bengaluru"
                  className="text-xs h-8"
                />
              </div>

              <div>
                <label className="font-medium text-foreground block mb-1">Experience Level</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {["Fresher", "Junior", "Mid", "Senior"].map((lvl) => {
                    const isChecked = talentExpLevels.includes(lvl);
                    return (
                      <label key={lvl} className="flex items-center gap-2 cursor-pointer py-0.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() =>
                            setTalentExpLevels((prev) =>
                              isChecked ? prev.filter((x) => x !== lvl) : [...prev, lvl]
                            )
                          }
                          className="rounded text-primary focus:ring-primary"
                        />
                        <span>{lvl}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-medium text-foreground">Min Assessment Score</label>
                  <span className="font-bold text-primary">{talentMinAssessment}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="95"
                  step="5"
                  value={talentMinAssessment}
                  onChange={(e) => setTalentMinAssessment(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={talentOnlyCertified}
                    onChange={(e) => setTalentOnlyCertified(e.target.checked)}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <span className="font-medium text-foreground">Certified Candidates Only</span>
                </label>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-medium text-foreground">Max Expected Salary</label>
                  <span className="font-bold text-primary">₹{talentMaxSalary} LPA</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="60"
                  value={talentMaxSalary}
                  onChange={(e) => setTalentMaxSalary(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div>
                <label className="font-medium text-foreground block mb-1">Sort Candidates</label>
                <select
                  value={talentSort}
                  onChange={(e) => setTalentSort(e.target.value as any)}
                  className="w-full h-8 rounded-xl border border-input bg-background px-3 py-1 text-xs shadow-sm focus-visible:outline-none"
                >
                  <option value="s">Best Algorithm Match</option>
                  <option value="a">Assessment Score</option>
                  <option value="x">Years Experience</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right Candidate Cards: 8 cols */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{filteredCandidates.length} candidate profiles match your criteria</span>
            </div>

            <div className="space-y-3.5">
              {filteredCandidates.map((cand) => {
                const scoreVal = calcTalentScore(cand, selectedJobObj);
                const isCompared = selectedTalentToCompare.includes(cand.n);

                return (
                  <div
                    key={cand.n}
                    className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-3 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex items-start gap-3.5">
                        <img
                          src={getCandidatePhoto(cand.n)}
                          alt={cand.n}
                          className="w-12 h-12 rounded-2xl object-cover shrink-0 border border-border/60"
                        />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-foreground text-sm">{cand.n}</h4>
                            <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold">
                              <ShieldCheck className="w-3 h-3" /> Verified
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2 flex-wrap">
                            <span>{cand.c}</span>
                            <span>•</span>
                            <span>{cand.x} yrs exp ({levelFromExp(cand.x)})</span>
                            <span>•</span>
                            <span>₹{cand.es} LPA exp</span>
                            <span>•</span>
                            <span>{cand.nt ? `${cand.nt}d notice` : "Immediate"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <span className="text-[10px] text-muted-foreground block">Talent Score</span>
                          <span className="font-bold text-sm text-primary">{scoreVal}%</span>
                        </div>
                        <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isCompared}
                            onChange={() => {
                              setSelectedTalentToCompare((prev) =>
                                isCompared ? prev.filter((x) => x !== cand.n) : [...prev, cand.n]
                              );
                            }}
                            className="rounded text-primary focus:ring-primary"
                          />
                          <span>Compare</span>
                        </label>
                      </div>
                    </div>

                    {/* Skills & Certs */}
                    <div className="flex items-center gap-1.5 flex-wrap text-xs pt-1">
                      {cand.sk.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded-md bg-muted text-foreground text-[11px] font-medium"
                        >
                          {s}
                        </span>
                      ))}
                      {cand.ce &&
                        cand.ce.map((cert) => (
                          <span
                            key={cert}
                            className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[11px] font-semibold"
                          >
                            {cert}
                          </span>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl text-xs h-8 gap-1.5 bg-background"
                        onClick={() => onOpenDrawer({ type: "candidate", name: cand.n, jobId: selectedJobObj?.id })}
                      >
                        <Eye className="w-3.5 h-3.5" /> Full Candidate Profile
                      </Button>
                      <Button
                        size="sm"
                        className="rounded-xl text-xs h-8 gap-1.5"
                        onClick={() => onToast(`Invitation to apply sent to ${cand.n}!`)}
                      >
                        <Send className="w-3.5 h-3.5" /> Invite to Apply
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
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
