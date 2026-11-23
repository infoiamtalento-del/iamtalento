import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Archive,
  ArchiveRestore,
  RotateCcw,
  Download,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatINR } from "@/data/proData";
import {
  exportRecordsAsCsv,
  type SuperAdminCandidate,
} from "@/services/admin/superAdminData";
import { toast } from "sonner";

interface Props {
  candidates: SuperAdminCandidate[];
  onInspect: (cand: SuperAdminCandidate) => void;
  onToggleArchive: (ids: string[], archive: boolean) => void;
  onBulkVerifyKyc: (ids: string[]) => void;
}

type ArchiveView = "active" | "archived" | "all";
type ActiveWindow = "all" | "7" | "30" | "90" | "180" | "365" | "over365";
type TestFilter = "all" | "once" | "retest" | "none";
type DomainFilter = "all" | "multi" | "single";
type CourseFilter = "all" | "enrolled" | "completed" | "mentor" | "none";
type EventFilter = "all" | "hackathon" | "networking" | "both";
type ExpFilter = "all" | "fresher" | "junior" | "mid" | "senior";
type AssetFilter = "all" | "incomplete" | "complete" | "video_resume" | "kyc_pending" | "live_db";

function daysSince(iso: string): number {
  const diff = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(diff / 86400000));
}

function formatRelativeDays(iso: string): string {
  const d = daysSince(iso);
  if (d === 0) return "Today";
  if (d === 1) return "1d ago";
  return `${d}d ago`;
}

export const SuperAdminCandidatesPanel: React.FC<Props> = ({
  candidates,
  onInspect,
  onToggleArchive,
  onBulkVerifyKyc,
}) => {
  const [archiveView, setArchiveView] = useState<ArchiveView>("active");
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("all");
  const [accountTier, setAccountTier] = useState<"all" | "premium" | "normal">("all");
  const [activeWindow, setActiveWindow] = useState<ActiveWindow>("all");
  const [jobStatus, setJobStatus] = useState("all");
  const [freelancerMode, setFreelancerMode] = useState("all");
  const [testFilter, setTestFilter] = useState<TestFilter>("all");
  const [domainFilter, setDomainFilter] = useState<DomainFilter>("all");
  const [courseFilter, setCourseFilter] = useState<CourseFilter>("all");
  const [eventFilter, setEventFilter] = useState<EventFilter>("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [expFilter, setExpFilter] = useState<ExpFilter>("all");
  const [assetFilter, setAssetFilter] = useState<AssetFilter>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const activePool = useMemo(() => candidates.filter((c) => !c.archived), [candidates]);
  const archivedCount = useMemo(() => candidates.filter((c) => c.archived).length, [candidates]);

  const stats = useMemo(() => {
    return {
      activelyLookingJob: activePool.filter((c) => c.availabilityStatus === "Actively looking").length,
      activeFreelancers: activePool.filter((c) => c.freelancerStatus === "Actively Freelancing").length,
      openFreelancers: activePool.filter((c) => c.freelancerStatus !== "Full-Time Only").length,
      premiumCount: activePool.filter((c) => c.accountTier === "premium").length,
      normalCount: activePool.filter((c) => c.accountTier === "normal").length,
      oneTimeTest: activePool.filter((c) => c.totalTestAttempts === 1).length,
      retestTakers: activePool.filter((c) => c.totalTestAttempts >= 2).length,
      multiDomain: activePool.filter((c) => c.domainsChosen.length >= 2).length,
      hackathonCount: activePool.filter((c) => c.hackathonParticipated).length,
      networkingCount: activePool.filter((c) => c.networkingRegistered).length,
      courseLearners: activePool.filter((c) => c.coursesEnrolled.length > 0).length,
      incompleteProfiles: activePool.filter((c) => c.profileCompletion < 100).length,
    };
  }, [activePool]);

  const industries = useMemo(
    () => Array.from(new Set(candidates.map((c) => c.industry).filter(Boolean))).sort(),
    [candidates]
  );

  const locations = useMemo(
    () => Array.from(new Set(candidates.map((c) => c.city).filter(Boolean))).sort(),
    [candidates]
  );

  const resetAllFilters = () => {
    setArchiveView("active");
    setSearch("");
    setIndustry("all");
    setAccountTier("all");
    setActiveWindow("all");
    setJobStatus("all");
    setFreelancerMode("all");
    setTestFilter("all");
    setDomainFilter("all");
    setCourseFilter("all");
    setEventFilter("all");
    setLocationFilter("all");
    setExpFilter("all");
    setAssetFilter("all");
    setSelectedIds([]);
  };

  const filteredCandidates = useMemo(() => {
    const q = search.trim().toLowerCase();
    return candidates.filter((c) => {
      if (archiveView === "active" && c.archived) return false;
      if (archiveView === "archived" && !c.archived) return false;

      if (industry !== "all" && c.industry !== industry) return false;
      if (accountTier !== "all" && c.accountTier !== accountTier) return false;

      if (activeWindow !== "all") {
        const d = daysSince(c.lastActiveAt);
        if (activeWindow === "over365") {
          if (d <= 365) return false;
        } else {
          if (d > Number(activeWindow)) return false;
        }
      }

      if (jobStatus !== "all" && c.availabilityStatus !== jobStatus) return false;
      if (freelancerMode !== "all") {
        if (freelancerMode === "any_freelance") {
          if (c.freelancerStatus === "Full-Time Only") return false;
        } else if (c.freelancerStatus !== freelancerMode) {
          return false;
        }
      }

      if (testFilter === "once" && c.totalTestAttempts !== 1) return false;
      if (testFilter === "retest" && c.totalTestAttempts < 2) return false;
      if (testFilter === "none" && c.totalTestAttempts !== 0) return false;

      if (domainFilter === "multi" && c.domainsChosen.length < 2) return false;
      if (domainFilter === "single" && c.domainsChosen.length !== 1) return false;

      if (courseFilter === "enrolled" && c.coursesEnrolled.length === 0) return false;
      if (courseFilter === "completed" && c.coursesCompleted < 1) return false;
      if (courseFilter === "mentor" && c.mentorSessionsBooked < 1) return false;
      if (courseFilter === "none" && c.coursesEnrolled.length > 0) return false;

      if (eventFilter === "hackathon" && !c.hackathonParticipated) return false;
      if (eventFilter === "networking" && !c.networkingRegistered) return false;
      if (eventFilter === "both" && (!c.hackathonParticipated || !c.networkingRegistered)) return false;

      if (locationFilter !== "all") {
        if (locationFilter === "Remote") {
          if (!/remote/i.test(c.workPreference) && !/remote/i.test(c.city)) return false;
        } else if (c.city.toLowerCase() !== locationFilter.toLowerCase()) {
          return false;
        }
      }

      if (expFilter === "fresher" && c.experienceYears > 1) return false;
      if (expFilter === "junior" && (c.experienceYears <= 1 || c.experienceYears > 3)) return false;
      if (expFilter === "mid" && (c.experienceYears <= 3 || c.experienceYears > 6)) return false;
      if (expFilter === "senior" && c.experienceYears <= 6) return false;

      if (assetFilter === "incomplete" && c.profileCompletion >= 100) return false;
      if (assetFilter === "complete" && c.profileCompletion < 100) return false;
      if (assetFilter === "video_resume" && !c.hasVideoResume) return false;
      if (assetFilter === "kyc_pending" && c.kycStatus === "verified") return false;
      if (assetFilter === "live_db" && c.origin !== "live_db") return false;

      if (q) {
        const hay = [
          c.fullName,
          c.talentCirId,
          c.email,
          c.phone,
          c.city,
          c.industry,
          c.headline,
          ...c.skills,
          ...c.domainsChosen,
          ...c.coursesEnrolled,
          ...c.hackathonsList,
          ...c.networkingEventsList,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }

      return true;
    });
  }, [
    candidates,
    archiveView,
    industry,
    accountTier,
    activeWindow,
    jobStatus,
    freelancerMode,
    testFilter,
    domainFilter,
    courseFilter,
    eventFilter,
    locationFilter,
    expFilter,
    assetFilter,
    search,
  ]);

  const activeFilterCount = [
    industry !== "all",
    accountTier !== "all",
    activeWindow !== "all",
    jobStatus !== "all",
    freelancerMode !== "all",
    testFilter !== "all",
    domainFilter !== "all",
    courseFilter !== "all",
    eventFilter !== "all",
    locationFilter !== "all",
    expFilter !== "all",
    assetFilter !== "all",
    Boolean(search.trim()),
  ].filter(Boolean).length;

  const allSelected =
    filteredCandidates.length > 0 &&
    filteredCandidates.every((c) => selectedIds.includes(c.id));

  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds([]);
    else setSelectedIds(filteredCandidates.map((c) => c.id));
  };

  const toggleRowSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectClass =
    "h-9 w-full rounded-lg border border-[#111827]/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#11141c] px-3 text-xs font-normal text-[#111827] dark:text-[#eef0f5] focus:border-[#002C66] focus:outline-none transition-colors duration-150 cursor-pointer";

  const cohortCards = [
    {
      title: "Actively looking for job",
      figure: String(stats.activelyLookingJob),
      meta: "Immediate & 15–30d notice",
      active: jobStatus === "Actively looking",
      onClick: () => {
        resetAllFilters();
        setJobStatus("Actively looking");
      },
    },
    {
      title: "Freelancers (active & open)",
      figure: String(stats.openFreelancers),
      meta: `${stats.activeFreelancers} active on gigs`,
      active: freelancerMode !== "all",
      onClick: () => {
        resetAllFilters();
        setFreelancerMode("any_freelance");
      },
    },
    {
      title: "Premium vs normal accounts",
      figure: `${stats.premiumCount} / ${stats.normalCount}`,
      meta: "Pro tier vs free tier",
      active: accountTier !== "all",
      onClick: () => {
        resetAllFilters();
        setAccountTier(accountTier === "premium" ? "normal" : "premium");
      },
    },
    {
      title: "1-time vs retest takers",
      figure: `${stats.oneTimeTest} / ${stats.retestTakers}`,
      meta: "1 attempt vs 2+ retests",
      active: testFilter === "retest" || testFilter === "once",
      onClick: () => {
        resetAllFilters();
        setTestFilter(testFilter === "retest" ? "once" : "retest");
      },
    },
    {
      title: "Chosen multiple domains (2+)",
      figure: String(stats.multiDomain),
      meta: "Multi-track assessed",
      active: domainFilter === "multi",
      onClick: () => {
        resetAllFilters();
        setDomainFilter("multi");
      },
    },
    {
      title: "Participated in hackathons",
      figure: String(stats.hackathonCount),
      meta: "Code Arena & sprints",
      active: eventFilter === "hackathon",
      onClick: () => {
        resetAllFilters();
        setEventFilter("hackathon");
      },
    },
    {
      title: "Registered in networking events",
      figure: String(stats.networkingCount),
      meta: "City chapter mixers",
      active: eventFilter === "networking",
      onClick: () => {
        resetAllFilters();
        setEventFilter("networking");
      },
    },
    {
      title: "Enrolled in learning courses",
      figure: String(stats.courseLearners),
      meta: "Active LMS learners",
      active: courseFilter === "enrolled",
      onClick: () => {
        resetAllFilters();
        setCourseFilter("enrolled");
      },
    },
    {
      title: "Incomplete candidate profiles",
      figure: String(stats.incompleteProfiles),
      meta: "Below 100% completion",
      active: assetFilter === "incomplete",
      onClick: () => {
        resetAllFilters();
        setAssetFilter("incomplete");
      },
    },
    {
      title: "Archived profiles",
      figure: String(archivedCount),
      meta: "Stored in archive vault",
      active: archiveView === "archived",
      onClick: () => {
        resetAllFilters();
        setArchiveView("archived");
      },
    },
  ];

  return (
    <div className="space-y-5">
      {/* 1. Pure-Number Cohort Grid (Zero Decorative Icons, Strict 4px Rhythm) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {cohortCards.map((card) => (
          <button
            key={card.title}
            type="button"
            onClick={card.onClick}
            className={cn(
              "rounded-xl border p-4 text-left transition-colors duration-150 cursor-pointer",
              card.active
                ? "border-[#002C66] bg-[#eceff4] dark:bg-[#1a1e28]"
                : "border-[#111827]/[0.08] dark:border-white/[0.08] bg-[#f5f7fa] dark:bg-[#161a24] hover:border-[#002C66]/35"
            )}
          >
            <p className="text-xs text-[#4b5565] dark:text-[#a3a9b8] truncate">{card.title}</p>
            <p className="mt-2 text-2xl leading-none font-medium text-[#111827] dark:text-[#eef0f5] tabular-nums">
              {card.figure}
            </p>
            <p className="mt-1.5 text-xs text-[#6b7487] truncate">{card.meta}</p>
          </button>
        ))}
      </div>

      {/* 2. Multi-Facet Filter Workbench */}
      <div className="rounded-xl border border-[#111827]/[0.08] dark:border-white/[0.08] bg-[#f5f7fa] dark:bg-[#161a24] p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-lg border border-[#111827]/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#11141c] p-1">
            {(
              [
                { id: "active", label: `Active (${activePool.length})` },
                { id: "archived", label: `Archived (${archivedCount})` },
                { id: "all", label: `All (${candidates.length})` },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setArchiveView(tab.id)}
                className={cn(
                  "rounded px-3 py-1 text-xs font-medium tabular-nums transition-colors duration-150 cursor-pointer",
                  archiveView === tab.id
                    ? "bg-[#002C66] text-white"
                    : "text-[#4b5565] dark:text-[#a3a9b8] hover:text-[#111827]"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7487]"
              strokeWidth={1.5}
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter candidates"
              className="h-9 pl-9 text-xs bg-white dark:bg-[#11141c] rounded-lg border-[#111827]/[0.08]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1 rounded-lg border border-[#111827]/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#11141c] p-1">
            <span className="px-2 text-xs text-[#6b7487]">Last active</span>
            {(
              [
                { id: "all", label: "All" },
                { id: "7", label: "7d" },
                { id: "30", label: "30d" },
                { id: "90", label: "90d" },
                { id: "180", label: "180d" },
                { id: "365", label: "365d" },
                { id: "over365", label: ">365d" },
              ] as const
            ).map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => setActiveWindow(w.id)}
                className={cn(
                  "rounded px-2 py-1 text-xs font-mono tabular-nums transition-colors duration-150 cursor-pointer",
                  activeWindow === w.id
                    ? "bg-[#002C66] text-white"
                    : "text-[#4b5565] dark:text-[#a3a9b8] hover:text-[#111827]"
                )}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>

        {/* 10 Sentence-Case Filter Selects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-xs text-[#4b5565] dark:text-[#a3a9b8] mb-1">
              Industry
            </label>
            <select
              aria-label="Filter by Industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className={selectClass}
            >
              <option value="all">All industries</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-[#4b5565] dark:text-[#a3a9b8] mb-1">
              Account tier
            </label>
            <select
              aria-label="Filter by Account Tier"
              value={accountTier}
              onChange={(e) => setAccountTier(e.target.value as "all" | "premium" | "normal")}
              className={selectClass}
            >
              <option value="all">All accounts</option>
              <option value="premium">Premium account</option>
              <option value="normal">Normal account</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-[#4b5565] dark:text-[#a3a9b8] mb-1">
              Location &amp; mode
            </label>
            <select
              aria-label="Filter by Location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className={selectClass}
            >
              <option value="all">All locations</option>
              <option value="Remote">Remote ready</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-[#4b5565] dark:text-[#a3a9b8] mb-1">
              Experience
            </label>
            <select
              aria-label="Filter by Experience"
              value={expFilter}
              onChange={(e) => setExpFilter(e.target.value as ExpFilter)}
              className={selectClass}
            >
              <option value="all">All experience bands</option>
              <option value="fresher">Fresher (0–1 yr)</option>
              <option value="junior">Junior (1–3 yrs)</option>
              <option value="mid">Mid-level (3–6 yrs)</option>
              <option value="senior">Senior (6+ yrs)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-[#4b5565] dark:text-[#a3a9b8] mb-1">
              Job search status
            </label>
            <select
              aria-label="Filter by Job Status"
              value={jobStatus}
              onChange={(e) => setJobStatus(e.target.value)}
              className={selectClass}
            >
              <option value="all">All job statuses</option>
              <option value="Actively looking">Actively looking</option>
              <option value="Open to offers">Open to offers</option>
              <option value="Placed">Placed</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-[#4b5565] dark:text-[#a3a9b8] mb-1">
              Freelancer status
            </label>
            <select
              aria-label="Filter by Freelancer Status"
              value={freelancerMode}
              onChange={(e) => setFreelancerMode(e.target.value)}
              className={selectClass}
            >
              <option value="all">All freelancer modes</option>
              <option value="Actively Freelancing">Actively freelancing</option>
              <option value="Open to Freelance">Open to freelance</option>
              <option value="any_freelance">All freelancers</option>
              <option value="Full-Time Only">Full-time only</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-[#4b5565] dark:text-[#a3a9b8] mb-1">
              Test attempts &amp; retests
            </label>
            <select
              aria-label="Filter by Test Attempts"
              value={testFilter}
              onChange={(e) => setTestFilter(e.target.value as TestFilter)}
              className={selectClass}
            >
              <option value="all">All test histories</option>
              <option value="once">Taken test one time (1x)</option>
              <option value="retest">Taken retests (2+ attempts)</option>
              <option value="none">Not taken test (0x)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-[#4b5565] dark:text-[#a3a9b8] mb-1">
              Domain assessments
            </label>
            <select
              aria-label="Filter by Domain Count"
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value as DomainFilter)}
              className={selectClass}
            >
              <option value="all">All domain counts</option>
              <option value="multi">Chosen Multiple Domains (2+)</option>
              <option value="single">Single domain chosen (1)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-[#4b5565] dark:text-[#a3a9b8] mb-1">
              Learning courses
            </label>
            <select
              aria-label="Filter by Learning Courses"
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value as CourseFilter)}
              className={selectClass}
            >
              <option value="all">All course states</option>
              <option value="enrolled">Enrolled in courses</option>
              <option value="completed">Completed 1+ course</option>
              <option value="mentor">Booked 1:1 mentor</option>
              <option value="none">Not enrolled</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-[#4b5565] dark:text-[#a3a9b8] mb-1">
              Events &amp; profile
            </label>
            <select
              aria-label="Filter by Events and Profile"
              value={eventFilter !== "all" ? `ev:${eventFilter}` : `as:${assetFilter}`}
              onChange={(e) => {
                const val = e.target.value;
                if (val.startsWith("ev:")) {
                  setEventFilter(val.slice(3) as EventFilter);
                  setAssetFilter("all");
                } else {
                  setAssetFilter(val.slice(3) as AssetFilter);
                  setEventFilter("all");
                }
              }}
              className={selectClass}
            >
              <option value="as:all">All events &amp; profiles</option>
              <option value="ev:hackathon">Participated in Hackathons</option>
              <option value="ev:networking">Registered in Networking Events</option>
              <option value="ev:both">Both hackathon &amp; networking</option>
              <option value="as:incomplete">Incomplete profile (&lt;100%)</option>
              <option value="as:complete">100% complete profile</option>
              <option value="as:video_resume">Has 60s video pitch</option>
              <option value="as:kyc_pending">KYC pending</option>
              <option value="as:live_db">Live DB records only</option>
            </select>
          </div>
        </div>

        {/* Summary & Bulk Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#111827]/[0.08] dark:border-white/[0.08]">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="font-mono text-[#4b5565] dark:text-[#a3a9b8] tabular-nums">
              Showing {filteredCandidates.length} of {candidates.length} candidates
            </span>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#002C66] dark:text-blue-300 hover:underline cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.5} />
                Reset {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {selectedIds.length > 0 && (
              <>
                <span className="font-mono text-xs text-[#4b5565] tabular-nums">
                  {selectedIds.length} selected
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 rounded-lg gap-1.5 text-xs font-medium cursor-pointer"
                  onClick={() => {
                    onToggleArchive(selectedIds, archiveView !== "archived");
                    setSelectedIds([]);
                  }}
                >
                  {archiveView === "archived" ? (
                    <>
                      <ArchiveRestore className="h-4 w-4 text-[#6b7487]" strokeWidth={1.5} />
                      Unarchive selected
                    </>
                  ) : (
                    <>
                      <Archive className="h-4 w-4 text-[#6b7487]" strokeWidth={1.5} />
                      Archive selected
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 rounded-lg gap-1.5 text-xs font-medium cursor-pointer"
                  onClick={() => {
                    onBulkVerifyKyc(selectedIds);
                    setSelectedIds([]);
                  }}
                >
                  <Check className="h-4 w-4 text-[#6b7487]" strokeWidth={1.5} />
                  Verify KYC
                </Button>
              </>
            )}
            <Button
              size="sm"
              variant="outline"
              className="h-8 rounded-lg gap-1.5 text-xs font-medium cursor-pointer"
              onClick={() => {
                exportRecordsAsCsv(
                  "candidates-filtered-cohort",
                  filteredCandidates as unknown as Array<Record<string, unknown>>
                );
                toast.success(`Exported ${filteredCandidates.length} candidates`);
              }}
            >
              <Download className="h-4 w-4 text-[#6b7487]" strokeWidth={1.5} />
              Export CSV ({filteredCandidates.length})
            </Button>
          </div>
        </div>
      </div>

      {/* 3. Candidate Table (Quiet Chrome, Signature Verification Stamps, Tabular Figures) */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#111827]/[0.08] dark:border-white/[0.08] text-[#6b7487]">
              <th className="py-2.5 pr-2 w-8">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  aria-label="Select all filtered candidates"
                  className="h-3.5 w-3.5 rounded border-[#111827]/20 cursor-pointer"
                />
              </th>
              <th className="py-2.5 pr-3 font-medium">Candidate</th>
              <th className="py-2.5 px-3 font-medium">Industry &amp; location</th>
              <th className="py-2.5 px-3 font-medium">Job &amp; freelance</th>
              <th className="py-2.5 px-3 font-medium">CIR &amp; attempts</th>
              <th className="py-2.5 px-3 font-medium">Courses &amp; events</th>
              <th className="py-2.5 px-3 font-medium">Activity &amp; completion</th>
              <th className="py-2.5 pl-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#111827]/[0.06] dark:divide-white/[0.06]">
            {filteredCandidates.length ? (
              filteredCandidates.map((cand) => (
                <tr
                  key={cand.id}
                  onClick={() => onInspect(cand)}
                  className={cn(
                    "hover:bg-[#f5f7fa] dark:hover:bg-[#1a1e28] cursor-pointer transition-colors duration-150",
                    cand.archived && "opacity-65"
                  )}
                >
                  <td className="py-3 pr-2" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(cand.id)}
                      onChange={() => toggleRowSelect(cand.id)}
                      aria-label={`Select ${cand.fullName}`}
                      className="h-3.5 w-3.5 rounded border-[#111827]/20 cursor-pointer"
                    />
                  </td>

                  {/* Signature Stamp + Tier */}
                  <td className="py-3 pr-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full shrink-0",
                          cand.origin === "live_db" ? "bg-[#16a34a]" : "bg-[#94a3b8]"
                        )}
                        title={cand.origin === "live_db" ? "Live Supabase record" : "Platform record"}
                      />
                      <span className="text-[13px] font-medium text-[#111827] dark:text-[#eef0f5]">
                        {cand.fullName}
                      </span>
                      <span className="font-mono text-[11px] text-[#6b7487]">
                        {cand.accountTier === "premium" ? "Pro" : "Free"}
                      </span>
                      {cand.archived && (
                        <span className="rounded bg-[#eceff4] px-1.5 py-0.5 font-mono text-[10px] text-[#4b5565]">
                          Archived
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 pl-3.5 font-mono text-[11px] text-[#6b7487] tabular-nums">
                      {cand.talentCirId} · {cand.email}
                    </p>
                  </td>

                  <td className="py-3 px-3">
                    <p className="text-[#111827] dark:text-[#eef0f5]">{cand.industry}</p>
                    <p className="mt-0.5 text-[#6b7487] tabular-nums">
                      {cand.city} · {cand.experienceYears}y ({cand.experienceLevel})
                    </p>
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          cand.availabilityStatus === "Actively looking"
                            ? "bg-[#16a34a]"
                            : cand.availabilityStatus === "Open to offers"
                              ? "bg-[#ea580c]"
                              : "bg-[#94a3b8]"
                        )}
                      />
                      <span className="text-[#111827] dark:text-[#eef0f5]">
                        {cand.availabilityStatus}
                      </span>
                    </div>
                    <p className="mt-0.5 pl-3 text-[#6b7487] tabular-nums">
                      {cand.freelancerStatus === "Full-Time Only"
                        ? "Full-time only"
                        : `${cand.freelancerStatus} · ${formatINR(cand.freelanceHourlyInr)}/hr`}
                    </p>
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex items-baseline gap-2 font-mono tabular-nums">
                      <span className="text-[13px] font-medium text-[#111827] dark:text-[#eef0f5]">
                        {cand.cirScore}
                      </span>
                      <span className="text-[#6b7487]">
                        {cand.totalTestAttempts === 0
                          ? "0x"
                          : cand.totalTestAttempts === 1
                            ? "1x test"
                            : `${cand.totalTestAttempts}x (+${cand.scoreImprovementDelta})`}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[#6b7487] truncate max-w-[200px]">
                      {cand.domainsChosen.length >= 2
                        ? `${cand.domainsChosen.length} domains · ${cand.domainsChosen.join(", ")}`
                        : cand.domainsChosen[0] || "No domain"}
                    </p>
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex flex-wrap items-center gap-2 text-[#4b5565] dark:text-[#a3a9b8]">
                      {cand.coursesEnrolled.length > 0 && (
                        <span className="font-mono tabular-nums">
                          {cand.coursesEnrolled.length} course{cand.coursesEnrolled.length > 1 ? "s" : ""}
                        </span>
                      )}
                      {cand.hackathonParticipated && <span>Hackathon</span>}
                      {cand.networkingRegistered && <span>Networking</span>}
                      {!cand.coursesEnrolled.length &&
                        !cand.hackathonParticipated &&
                        !cand.networkingRegistered && <span className="text-[#6b7487]">—</span>}
                    </div>
                    <p className="mt-0.5 text-[#6b7487] truncate max-w-[180px]">
                      {cand.coursesEnrolled[0] || cand.hackathonsList[0] || "No enrollments"}
                    </p>
                  </td>

                  <td className="py-3 px-3">
                    <p className="font-mono text-[#111827] dark:text-[#eef0f5] tabular-nums">
                      {formatRelativeDays(cand.lastActiveAt)}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="h-1 w-14 rounded bg-[#eceff4] dark:bg-[#1a1e28] overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded",
                            cand.profileCompletion === 100 ? "bg-[#16a34a]" : "bg-[#d97706]"
                          )}
                          style={{ width: `${cand.profileCompletion}%` }}
                        />
                      </div>
                      <span className="font-mono text-[11px] text-[#6b7487] tabular-nums">
                        {cand.profileCompletion}%
                      </span>
                    </div>
                  </td>

                  <td className="py-3 pl-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        title={cand.archived ? "Restore profile" : "Archive profile"}
                        onClick={() => onToggleArchive([cand.id], !cand.archived)}
                        className="rounded-lg border border-[#111827]/[0.08] p-1.5 text-[#6b7487] hover:text-[#111827] hover:bg-[#eceff4] transition-colors duration-150 cursor-pointer"
                      >
                        {cand.archived ? (
                          <ArchiveRestore className="h-4 w-4 text-[#16a34a]" strokeWidth={1.5} />
                        ) : (
                          <Archive className="h-4 w-4" strokeWidth={1.5} />
                        )}
                      </button>
                      <Link
                        to={`/u/${cand.slug}`}
                        target="_blank"
                        className="rounded-lg border border-[#111827]/[0.08] px-2.5 py-1.5 text-xs font-medium text-[#4b5565] hover:text-[#111827] hover:bg-[#eceff4] transition-colors duration-150"
                      >
                        Profile
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 rounded-lg px-2.5 text-xs font-medium cursor-pointer"
                        onClick={() => onInspect(cand)}
                      >
                        Inspect
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-12 text-center text-xs text-[#6b7487]">
                  No candidate profiles match these filters.{" "}
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="font-medium text-[#002C66] hover:underline cursor-pointer"
                  >
                    Reset filters
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
