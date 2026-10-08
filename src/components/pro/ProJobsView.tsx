import React from "react";
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  Sparkles,
  Zap,
  SlidersHorizontal,
  Bookmark,
  Check,
  CheckCircle2,
  DollarSign,
  Building2,
  ArrowRightLeft,
  Bot,
  Home,
  GraduationCap,
  X,
  Sliders,
  ChevronDown,
} from "lucide-react";
import { ProJob, ProUser, ProApplication, calcScore, fitAnalysis, formatINR, timeAgo, COMPANY_INFO } from "@/data/proData";
import { getCompanyLogo } from "@/data/portalAssets";
import { cn } from "@/lib/utils";

interface ProJobsViewProps {
  user: ProUser;
  jobs: ProJob[];
  applications: ProApplication[];
  initialOnlySaved?: boolean;
  onOpenJob: (id: number) => void;
  onApplyJob: (id: number, coverNote?: string) => void;
  onSaveJob: (id: number) => void;
  compareSelection: number[];
  onCompareToggle: (id: number) => void;
  onOpenCompareDrawer: () => void;
  onToast: (msg: string) => void;
}

export const ProJobsView: React.FC<ProJobsViewProps> = ({
  user,
  jobs,
  applications,
  initialOnlySaved = false,
  onOpenJob,
  onApplyJob,
  onSaveJob,
  compareSelection,
  onCompareToggle,
  onOpenCompareDrawer,
  onToast,
}) => {
  const currentUser = user;
  const appliedJobIds = React.useMemo(
    () => (applications || []).filter((a) => a.who === user.email).map((a) => a.jid),
    [applications, user.email]
  );
  const savedJobIds = user.saved || [];
  const compareJobs = compareSelection || [];
  const onToggleCompareJob = onCompareToggle;
  const onOpenJobDrawer = onOpenJob;
  const onQuickApply = onApplyJob;
  const onToggleSaveJob = onSaveJob;

  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchLocation, setSearchLocation] = React.useState("");
  const [smartSearchQuery, setSmartSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState<string>("default");
  const [isCompact, setIsCompact] = React.useState(false);
  const searchRef = React.useRef<HTMLInputElement>(null);

  const defaultFilters = {
    q: "",
    loc: "",
    sk: "",
    e: 30,
    sal: 0,
    p: 0,
    m: [] as string[],
    ty: [] as string[],
    lvl: [] as string[],
    co: [] as string[],
    ind: [] as string[],
    sz: [] as string[],
    cities: [] as string[],
    any: [] as string[],
    hide: false,
    onlySaved: !!initialOnlySaved,
    mm: 0,
    ex: "",
    miss: "",
    sr: "all",
  };

  const [filters, setFilters] = React.useState<any>(defaultFilters);
  const [savedSearches, setSavedSearches] = React.useState<{ n: string; f: any }[]>(() => user.ss || []);

  const onResetFilters = () => {
    setSearchQuery("");
    setSearchLocation("");
    setSmartSearchQuery("");
    setFilters(defaultFilters);
    onToast("Filters reset to default.");
  };

  const onSmartSearch = () => {
    const q = smartSearchQuery.toLowerCase();
    if (!q) return;
    const f: any = { ...filters };
    if (q.includes("remote")) f.m = ["Remote"];
    if (q.includes("hybrid")) f.m = ["Hybrid"];
    if (q.includes("onsite")) f.m = ["Onsite"];
    if (q.includes("intern")) f.ty = ["Internship"];
    if (q.includes("fresher")) f.e = 0;
    const salMatch = q.match(/(\d+)\s*lpa/);
    if (salMatch) f.sal = +salMatch[1];
    const expMatch = q.match(/(\d+)\s*(?:yrs|years)/);
    if (expMatch) f.e = +expMatch[1];

    const clean = q
      .replace(/\b(remote|hybrid|onsite|fresher|internship|intern|\d+\s*lpa|\d+\s*yrs|\d+\s*years)\b/g, "")
      .trim();
    if (clean) f.q = clean;
    setFilters(f);
    onToast(`Smart search applied: "${smartSearchQuery}"`);
  };

  const onSaveSearch = () => {
    const name = searchQuery || filters.q || (filters.m?.length ? filters.m.join(", ") : "Custom Search");
    setSavedSearches((prev) => [...prev, { n: name, f: { ...filters } }]);
    onToast(`Search "${name}" saved!`);
  };

  const onApplySavedSearch = (saved: any) => {
    setFilters(saved.f);
    onToast(`Applied saved search: "${saved.n}"`);
  };

  const onDeleteSavedSearch = (idx: number) => {
    setSavedSearches((prev) => prev.filter((_, i) => i !== idx));
    onToast("Saved search removed.");
  };

  // Filter calculations
  const filteredJobs = React.useMemo(() => {
    const q = (searchQuery || filters.q || "").toLowerCase();
    const loc = (searchLocation || filters.loc || "").toLowerCase();
    const userSkills = (currentUser.sk || []).map((x) => x.toLowerCase());
    const reqSkills = (filters.sk || "")
      .split(",")
      .map((x: string) => x.trim().toLowerCase())
      .filter(Boolean);
    const excludeWords = (filters.ex || "")
      .split(",")
      .map((x: string) => x.trim().toLowerCase())
      .filter(Boolean);

    return jobs
      .filter((j) => {
        const titleComp = (j.t + " " + j.c).toLowerCase();
        const jSkills = j.sk.map((x) => x.toLowerCase());
        const missingCount = jSkills.filter((x) => !userSkills.includes(x)).length;

        // Text & location query
        if (q && !titleComp.includes(q)) return false;
        if (loc && !j.l.toLowerCase().includes(loc)) return false;

        // Work mode & type
        if (filters.m?.length && !filters.m.includes(j.m)) return false;
        if (filters.ty?.length && !filters.ty.includes(j.ty)) return false;

        // Sliders & bounds
        if (j.e > (filters.e ?? 30)) return false;
        if (j.b < (filters.sal ?? 0)) return false;

        // Required skills
        if (reqSkills.length && !reqSkills.every((s: string) => jSkills.includes(s))) return false;

        // Any skills match
        if (filters.any?.length && !j.sk.some((x) => filters.any.includes(x))) return false;

        // Time threshold
        if (filters.p > 0 && (Date.now() - j.at) / 86400000 > filters.p) return false;

        // Hide applied
        if (filters.hide && appliedJobIds.includes(j.id)) return false;

        // Saved only
        if (filters.onlySaved && !savedJobIds.includes(j.id)) return false;

        // Missing skills threshold
        if (filters.miss !== "" && filters.miss != null && missingCount > +filters.miss) return false;

        // Exclude keywords
        if (excludeWords.length && excludeWords.some((w: string) => titleComp.includes(w))) return false;

        // Company, Industry, Size
        const compMeta = COMPANY_INFO[j.c] || ["Other", "Startup"];
        if (filters.co?.length && !filters.co.includes(j.c)) return false;
        if (filters.ind?.length && !filters.ind.includes(compMeta[0])) return false;
        if (filters.sz?.length && !filters.sz.includes(compMeta[1])) return false;
        if (filters.cities?.length && !filters.cities.includes(j.l)) return false;

        // AI Match percentage
        if (filters.mm > 0 && calcScore(j, currentUser) < filters.mm) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "sal") return b.b - a.b;
        if (sortBy === "match") return calcScore(b, currentUser) - calcScore(a, currentUser);
        if (sortBy === "fit") return fitAnalysis(b, currentUser).tot - fitAnalysis(a, currentUser).tot;
        return b.at - a.at;
      });
  }, [jobs, searchQuery, searchLocation, filters, currentUser, appliedJobIds, savedJobIds, sortBy]);

  // Aggregate metadata for sidebar
  const locationCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    jobs.forEach((j) => {
      counts[j.l] = (counts[j.l] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [jobs]);

  const skillCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    jobs.forEach((j) => j.sk.forEach((s) => (counts[s] = (counts[s] || 0) + 1)));
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [jobs]);

  const allCompanies = React.useMemo(() => [...new Set(jobs.map((j) => j.c))].sort(), [jobs]);
  const allIndustries = React.useMemo(() => [...new Set(jobs.map((j) => (COMPANY_INFO[j.c] || ["Other"])[0]))].sort(), [jobs]);

  return (
    <div className="space-y-6">
      {/* Hero Search Box */}
      <div className="rounded-2xl bg-gradient-to-r from-[#ec2639] via-[#f0364a] to-[#d61e31] text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-white/80 flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 fill-current" />
              Verified Roles &amp; Guaranteed 24-Hour Review SLA
            </span>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight">
              Ready for your next verified role, {currentUser.name.split(" ")[0]}?
            </h1>
            <p className="text-white/90 text-xs sm:text-sm">
              Explore {jobs.length} verified engineering openings matched directly against your validated skill profile.
            </p>
          </div>

          {/* Primary Search Inputs */}
          <div className="grid sm:grid-cols-[1.5fr_1fr_auto] gap-2 pt-2">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Title, skill or company (press / to focus)"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white text-foreground placeholder:text-muted-foreground text-xs font-medium border-0 focus:outline-none focus:ring-2 focus:ring-black/20 shadow-sm"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="City or Remote"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white text-foreground placeholder:text-muted-foreground text-xs font-medium border-0 focus:outline-none focus:ring-2 focus:ring-black/20 shadow-sm"
              />
            </div>
            <button
              onClick={() => {
                setFilters((f: any) => ({ ...f, q: searchQuery, loc: searchLocation }));
              }}
              className="px-5 py-2.5 rounded-xl bg-foreground text-background text-xs font-bold hover:bg-foreground/90 transition-all shadow-sm cursor-pointer"
            >
              Search
            </button>
          </div>

          {/* Smart Search Bar */}
          <div className="flex gap-2 pt-1">
            <div className="relative flex-1">
              <Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#ec2639]" />
              <input
                value={smartSearchQuery}
                onChange={(e) => setSmartSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSmartSearch()}
                placeholder='Smart search: try "react remote 15 lpa" or "fresher java pune"'
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/95 text-foreground placeholder:text-muted-foreground text-xs font-medium border-0 focus:outline-none focus:ring-2 focus:ring-black/20 shadow-sm"
              />
            </div>
            <button
              onClick={onSmartSearch}
              className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold border border-white/30 backdrop-blur-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Smart Find</span>
            </button>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-white/70 font-semibold text-[11px] mr-1">Quick Presets:</span>
            <button
              onClick={() => setFilters((f: any) => ({ ...f, m: f.m?.includes("Remote") ? [] : ["Remote"] }))}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5",
                filters.m?.includes("Remote")
                  ? "bg-white text-primary border-white"
                  : "bg-white/15 text-white border-white/25 hover:bg-white/25"
              )}
            >
              <Home className="h-3 w-3" />
              <span>Remote</span>
            </button>
            <button
              onClick={() => setFilters((f: any) => ({ ...f, lvl: f.lvl?.includes("Fresher") ? [] : ["Fresher"] }))}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5",
                filters.lvl?.includes("Fresher")
                  ? "bg-white text-primary border-white"
                  : "bg-white/15 text-white border-white/25 hover:bg-white/25"
              )}
            >
              <GraduationCap className="h-3 w-3" />
              <span>Freshers</span>
            </button>
            <button
              onClick={() => setFilters((f: any) => ({ ...f, p: f.p === 1 ? 0 : 1 }))}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5",
                filters.p === 1
                  ? "bg-white text-primary border-white"
                  : "bg-white/15 text-white border-white/25 hover:bg-white/25"
              )}
            >
              <Zap className="h-3 w-3" />
              <span>New Today</span>
            </button>
            <button
              onClick={() => setSortBy(sortBy === "match" ? "recent" : "match")}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5",
                sortBy === "match"
                  ? "bg-white text-primary border-white"
                  : "bg-white/15 text-white border-white/25 hover:bg-white/25"
              )}
            >
              <Sparkles className="h-3 w-3" />
              <span>Best Match</span>
            </button>
          </div>
        </div>
      </div>

      {/* Saved Searches Chips */}
      {savedSearches?.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-muted-foreground flex items-center gap-1">
            <Bookmark className="h-3.5 w-3.5 text-primary" />
            Saved Searches:
          </span>
          {savedSearches.map((s, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary border border-border/80 text-foreground font-semibold"
            >
              <button onClick={() => onApplySavedSearch(s.f)} className="hover:text-primary cursor-pointer">
                {s.n}
              </button>
              <button onClick={() => onDeleteSavedSearch(idx)} className="text-muted-foreground hover:text-primary ml-1 cursor-pointer">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Horizontal Filter Bar */}
      <div className="rounded-xl border border-border/80 bg-background p-3.5 flex flex-wrap items-center gap-3 text-xs shadow-xs">
        <div className="flex-1 min-w-[140px]">
          <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Work Mode</label>
          <select
            value={filters.m?.[0] || ""}
            onChange={(e) => setFilters((f: any) => ({ ...f, m: e.target.value ? [e.target.value] : [] }))}
            className="w-full bg-secondary/60 border border-border/70 rounded-lg px-2.5 py-1.5 font-semibold text-foreground text-xs"
          >
            <option value="">Any Mode</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Onsite">Onsite</option>
          </select>
        </div>

        <div className="flex-1 min-w-[140px]">
          <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Job Type</label>
          <select
            value={filters.ty?.[0] || ""}
            onChange={(e) => setFilters((f: any) => ({ ...f, ty: e.target.value ? [e.target.value] : [] }))}
            className="w-full bg-secondary/60 border border-border/70 rounded-lg px-2.5 py-1.5 font-semibold text-foreground text-xs"
          >
            <option value="">Any Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>
        </div>

        <div className="flex-1 min-w-[140px]">
          <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Experience</label>
          <select
            value={filters.lvl?.[0] || ""}
            onChange={(e) => setFilters((f: any) => ({ ...f, lvl: e.target.value ? [e.target.value] : [] }))}
            className="w-full bg-secondary/60 border border-border/70 rounded-lg px-2.5 py-1.5 font-semibold text-foreground text-xs"
          >
            <option value="">Any Level</option>
            <option value="Fresher">Fresher (under 1 yr)</option>
            <option value="Junior">Junior (1–3 yrs)</option>
            <option value="Mid">Mid (3–6 yrs)</option>
            <option value="Senior">Senior (6+ yrs)</option>
          </select>
        </div>

        <div className="flex-1 min-w-[140px]">
          <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Posted</label>
          <select
            value={filters.p || 0}
            onChange={(e) => setFilters((f: any) => ({ ...f, p: +e.target.value }))}
            className="w-full bg-secondary/60 border border-border/70 rounded-lg px-2.5 py-1.5 font-semibold text-foreground text-xs"
          >
            <option value="0">Any time</option>
            <option value="1">Last 24 hours</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
          </select>
        </div>

        <div className="flex-1 min-w-[140px]">
          <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-secondary/60 border border-border/70 rounded-lg px-2.5 py-1.5 font-semibold text-foreground text-xs"
          >
            <option value="recent">Most Recent</option>
            <option value="sal">Highest Salary</option>
            <option value="match">Best AI Match</option>
            <option value="fit">Best Overall Fit</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Sidebar + Job Results */}
      <div className="grid lg:grid-cols-[280px_1fr] gap-6 items-start">
        {/* Sidebar Filters */}
        <aside className="rounded-2xl border border-border/80 bg-background p-5 space-y-5 text-xs shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <span className="font-display font-bold text-sm text-foreground flex items-center gap-1.5">
              <Sliders className="h-4 w-4 text-primary" />
              Detailed Filters
            </span>
            <button
              onClick={onResetFilters}
              className="text-primary hover:underline font-semibold text-xs cursor-pointer"
            >
              Reset all
            </button>
          </div>

          {/* Location Checkboxes */}
          <div className="space-y-2">
            <span className="font-bold text-foreground block">Locations</span>
            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
              {locationCounts.map(([loc, count]) => {
                const checked = filters.cities?.includes(loc);
                return (
                  <label key={loc} className="flex items-center justify-between gap-2 cursor-pointer text-muted-foreground hover:text-foreground">
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          setFilters((f: any) => ({
                            ...f,
                            cities: checked ? f.cities.filter((c: string) => c !== loc) : [...(f.cities || []), loc],
                          }));
                        }}
                        className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                      />
                      <span>{loc}</span>
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                      {count}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Salary Slider */}
          <div className="space-y-2 pt-2 border-t border-border/60">
            <div className="flex justify-between font-bold">
              <span>Minimum Salary</span>
              <span className="text-primary font-display font-black">₹{filters.sal || 0} LPA+</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              step="2"
              value={filters.sal || 0}
              onChange={(e) => setFilters((f: any) => ({ ...f, sal: +e.target.value }))}
              className="w-full accent-primary cursor-pointer"
            />
          </div>

          {/* Experience Slider */}
          <div className="space-y-2 pt-2 border-t border-border/60">
            <div className="flex justify-between font-bold">
              <span>Max Exp Asked</span>
              <span className="text-primary font-display font-black">≤ {filters.e ?? 30} yrs</span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              step="1"
              value={filters.e ?? 30}
              onChange={(e) => setFilters((f: any) => ({ ...f, e: +e.target.value }))}
              className="w-full accent-primary cursor-pointer"
            />
          </div>

          {/* Must-have skills input */}
          <div className="space-y-2 pt-2 border-t border-border/60">
            <span className="font-bold text-foreground block">Must-have Skills</span>
            <input
              value={filters.sk || ""}
              onChange={(e) => setFilters((f: any) => ({ ...f, sk: e.target.value }))}
              placeholder="e.g. React, SQL, TypeScript"
              className="w-full px-3 py-1.5 rounded-lg border border-border bg-secondary/40 text-xs text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Any skills match */}
          <div className="space-y-2 pt-2 border-t border-border/60">
            <span className="font-bold text-foreground block">Job asks for any of these</span>
            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
              {skillCounts.slice(0, 8).map(([skill, count]) => {
                const checked = filters.any?.includes(skill);
                return (
                  <label key={skill} className="flex items-center justify-between gap-2 cursor-pointer text-muted-foreground hover:text-foreground">
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          setFilters((f: any) => ({
                            ...f,
                            any: checked ? f.any.filter((s: string) => s !== skill) : [...(f.any || []), skill],
                          }));
                        }}
                        className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                      />
                      <span>{skill}</span>
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                      {count}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Minimum AI Match Slider */}
          <div className="space-y-2 pt-2 border-t border-border/60">
            <div className="flex justify-between font-bold">
              <span>Min AI Match</span>
              <span className="text-primary font-display font-black">{filters.mm || 0}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="10"
              value={filters.mm || 0}
              onChange={(e) => setFilters((f: any) => ({ ...f, mm: +e.target.value }))}
              className="w-full accent-primary cursor-pointer"
            />
          </div>

          {/* Additional toggles */}
          <div className="space-y-2 pt-2 border-t border-border/60">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-foreground">
              <input
                type="checkbox"
                checked={filters.hide || false}
                onChange={(e) => setFilters((f: any) => ({ ...f, hide: e.target.checked }))}
                className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
              />
              <span>Hide jobs I applied to</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-medium text-foreground">
              <input
                type="checkbox"
                checked={filters.onlySaved || false}
                onChange={(e) => setFilters((f: any) => ({ ...f, onlySaved: e.target.checked }))}
                className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
              />
              <span>Show only saved jobs</span>
            </label>
          </div>

          {/* Save Search Button */}
          <div className="pt-2 border-t border-border/60">
            <button
              onClick={onSaveSearch}
              className="w-full py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs flex items-center justify-center gap-1.5 border border-border/80 transition-all cursor-pointer"
            >
              <Bookmark className="h-3.5 w-3.5 text-primary" />
              <span>Save Current Search</span>
            </button>
          </div>
        </aside>

        {/* Results Area */}
        <section className="space-y-4">
          {/* Header Controls: Count, Compare, Compact View */}
          <div className="flex items-center justify-between gap-3 pb-2 border-b border-border/60 text-xs">
            <div className="flex items-center gap-2">
              <b className="font-display font-bold text-sm text-foreground">{filteredJobs.length} verified jobs found</b>
            </div>
            <div className="flex items-center gap-2">
              {compareJobs.length > 1 && (
                <button
                  onClick={onOpenCompareDrawer}
                  className="px-3 py-1.5 rounded-lg bg-primary text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-primary/20 cursor-pointer"
                >
                  <ArrowRightLeft className="h-3.5 w-3.5" />
                  <span>Compare ({compareJobs.length})</span>
                </button>
              )}
              <button
                onClick={() => setIsCompact(!isCompact)}
                className="px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-secondary text-muted-foreground hover:text-foreground font-semibold cursor-pointer transition-all"
              >
                {isCompact ? "Card View" : "Compact View"}
              </button>
            </div>
          </div>

          {/* AI Match Explanation Bar */}
          <div className="rounded-xl border border-border/80 bg-secondary/40 p-3 flex items-center justify-between text-xs text-muted-foreground gap-3">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-primary shrink-0" />
              <span><b>AI Match</b> scores your validated skills against each employer's requirements in real time.</span>
            </div>
            <div className="flex items-center gap-3 font-semibold text-[11px] shrink-0">
              <span className="text-emerald-600 font-bold">70%+ Strong</span>
              <span className="text-amber-600 font-bold">40–69% Fair</span>
              <span className="text-rose-600 font-bold">&lt;40% Low</span>
            </div>
          </div>

          {/* Job List */}
          {filteredJobs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-3">
              <Building2 className="h-10 w-10 text-muted-foreground/40 mx-auto" />
              <b className="font-display font-bold text-base text-foreground block">No jobs match your filter criteria</b>
              <p className="text-muted-foreground text-xs max-w-sm mx-auto">
                Try loosening your salary threshold, removing specific location restrictions, or clearing skill filters.
              </p>
              <button
                onClick={onResetFilters}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-sm shadow-primary/30 cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredJobs.map((j) => {
                const score = calcScore(j, currentUser);
                const isApplied = appliedJobIds.includes(j.id);
                const isSaved = savedJobIds.includes(j.id);
                const isComparing = compareJobs.includes(j.id);
                const userSkills = (currentUser.sk || []).map((x) => x.toLowerCase());
                const missingSkills = j.sk.filter((s) => !userSkills.includes(s.toLowerCase()));

                return (
                  <article
                    key={j.id}
                    className={cn(
                      "rounded-2xl border border-border/80 bg-background transition-all hover:border-foreground/20 hover:shadow-sm group cursor-pointer",
                      isCompact ? "p-4" : "p-5 space-y-3.5"
                    )}
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest("button")) return;
                      onOpenJobDrawer(j.id);
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3.5 min-w-0">
                        <div className="h-11 w-11 rounded-xl bg-white border border-border/80 p-1.5 flex items-center justify-center shrink-0 shadow-2xs">
                          <img src={getCompanyLogo(j.c)} alt={j.c} className="max-h-full max-w-full object-contain" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-display font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors truncate">
                            {j.t}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5 flex-wrap">
                            <span className="font-semibold text-foreground">{j.c}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {j.l}
                            </span>
                            <span>•</span>
                            <span className="px-2 py-0.5 rounded-full bg-secondary text-[11px] font-medium text-foreground">
                              {j.m}
                            </span>
                            <span>•</span>
                            <span className="font-bold text-foreground">₹{j.a}–{j.b} LPA</span>
                          </div>
                        </div>
                      </div>

                      {/* AI Match Ring Indicator */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div
                          className={cn(
                            "px-2.5 py-1 rounded-full text-xs font-black font-display border",
                            score >= 70
                              ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                              : score >= 40
                              ? "bg-amber-500/10 text-amber-700 border-amber-500/20"
                              : "bg-rose-500/10 text-rose-700 border-rose-500/20"
                          )}
                          title={`${score}% skill match with your verified profile`}
                        >
                          {score}% Match
                        </div>
                      </div>
                    </div>

                    {!isCompact && (
                      <>
                        {/* Company blurb */}
                        <div className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          Join {j.c} as {j.t}. Requires {j.e}+ years experience. Fast-track hiring with verified 24-hour review SLA.
                        </div>

                        {/* Skills Chips */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {j.sk.map((s) => {
                            const hasSkill = userSkills.includes(s.toLowerCase());
                            return (
                              <span
                                key={s}
                                className={cn(
                                  "px-2.5 py-0.5 rounded-md text-[11px] font-medium border transition-colors",
                                  hasSkill
                                    ? "bg-emerald-500/10 text-emerald-800 border-emerald-500/25 font-semibold"
                                    : "bg-secondary text-muted-foreground border-border/50"
                                )}
                              >
                                {s}
                              </span>
                            );
                          })}
                        </div>

                        {/* AI Match Status Line */}
                        <div className="text-[11px] font-medium text-muted-foreground flex items-center gap-2 pt-1 border-t border-border/60">
                          <Bot className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span>
                            {missingSkills.length === 0 ? (
                              <b className="text-emerald-600">You cover all {j.sk.length} required skills. Excellent fit to apply!</b>
                            ) : (
                              <span>
                                You match <b>{j.sk.length - missingSkills.length} of {j.sk.length}</b> skills. Missing: {missingSkills.slice(0, 3).join(", ")}
                              </span>
                            )}
                          </span>
                        </div>
                      </>
                    )}

                    {/* Card Footer Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Posted {timeAgo(j.at)}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleCompareJob(j.id);
                          }}
                          className={cn(
                            "px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer",
                            isComparing
                              ? "border-primary bg-primary/10 text-primary font-bold"
                              : "border-border text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <ArrowRightLeft className="h-3.5 w-3.5" />
                          <span>{isComparing ? "Comparing" : "Compare"}</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleSaveJob(j.id);
                          }}
                          className={cn(
                            "p-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer",
                            isSaved
                              ? "border-amber-500 bg-amber-500/10 text-amber-600"
                              : "border-border text-muted-foreground hover:text-foreground"
                          )}
                          title={isSaved ? "Remove from saved" : "Save role"}
                        >
                          <Bookmark className={cn("h-3.5 w-3.5", isSaved && "fill-current")} />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isApplied) onQuickApply(j.id);
                          }}
                          disabled={isApplied}
                          className={cn(
                            "px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center gap-1 cursor-pointer",
                            isApplied
                              ? "bg-secondary text-muted-foreground cursor-not-allowed border border-border"
                              : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
                          )}
                        >
                          {isApplied ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                              <span>Applied</span>
                            </>
                          ) : (
                            <span>Quick Apply</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProJobsView;
