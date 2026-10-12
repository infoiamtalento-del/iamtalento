import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  Sparkles,
  MapPin,
  Home,
  GraduationCap,
  Bookmark,
  BookmarkCheck,
  ArrowRightLeft,
  Check,
  Building2,
  Briefcase,
  Clock,
  ChevronDown,
  LayoutList,
  LayoutGrid,
  Wrench,
  SlidersHorizontal,
  Star,
  FileText,
  Calendar,
  Wallet,
  ArrowRight,
  TrendingUp,
  Coins,
  Send,
  RefreshCw,
  Award,
  Megaphone,
  Infinity,
  Code,
  Palette,
  BarChart3,
  Users,
  CalendarDays,
} from "lucide-react";
import {
  ProJob,
  ProUser,
  ProApplication,
  calcScore,
  fitAnalysis,
  levelFromExp,
  parseSmartSearch,
  timeAgo,
  COMPANY_INFO,
} from "@/data/proData";
import { companyBlurb, SALARY_BANDS, salaryBandOk } from "@/data/proJobMeta";
import { getCompanyLogo } from "@/data/portalAssets";
import { cn } from "@/lib/utils";
import { ProJobCard } from "./ProJobCard";

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

interface JobFilters {
  q: string;
  loc: string;
  sk: string;
  e: number;
  sal: number;
  sr: string;
  p: number;
  m: string[];
  ty: string[];
  lvl: string[];
  co: string[];
  ind: string[];
  sz: string[];
  cities: string[];
  any: string[];
  hide: boolean;
  onlySaved: boolean;
  mm: number;
  ex: string;
  miss: string;
  sort: string;
}

const makeDefaults = (onlySaved: boolean): JobFilters => ({
  q: "",
  loc: "",
  sk: "",
  e: 30,
  sal: 0,
  sr: "",
  p: 0,
  m: [],
  ty: [],
  lvl: [],
  co: [],
  ind: [],
  sz: [],
  cities: [],
  any: [],
  hide: false,
  onlySaved,
  mm: 0,
  ex: "",
  miss: "",
  sort: "relevance",
});

const splitList = (s: string) =>
  (s || "")
    .split(",")
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean);

// Deterministic company review counts and ratings matching reference
const getCompanyRating = (company: string, id: number) => {
  const ratings: Record<string, { r: number; reviews: number }> = {
    Super30: { r: 4.1, reviews: 250 },
    Postman: { r: 4.3, reviews: 190 },
    Adobe: { r: 4.0, reviews: 89 },
    Razorpay: { r: 4.1, reviews: 272 },
    Swiggy: { r: 4.2, reviews: 310 },
    Zomato: { r: 3.9, reviews: 420 },
    CRED: { r: 4.4, reviews: 145 },
    Flipkart: { r: 4.2, reviews: 580 },
    Zerodha: { r: 4.6, reviews: 180 },
  };
  if (ratings[company]) return ratings[company];
  const r = +(4.0 + (id % 6) * 0.1).toFixed(1);
  const reviews = 80 + (id * 23) % 250;
  return { r, reviews };
};

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
  const [F, setF] = useState<JobFilters>(() => makeDefaults(initialOnlySaved));
  const [smartQuery, setSmartQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAllCities, setShowAllCities] = useState(false);
  const smartRef = useRef<HTMLInputElement>(null);

  const userSkills = useMemo(() => (user.sk || []).map((s) => s.toLowerCase()), [user.sk]);
  const appliedJobIds = useMemo(() => applications.map((a) => a.jid), [applications]);
  const savedJobIds = useMemo(() => user.saved || [], [user.saved]);

  const patch = (p: Partial<JobFilters>) => setF((prev) => ({ ...prev, ...p }));
  const resetAll = () => {
    setF(makeDefaults(false));
    setSmartQuery("");
    onToast("Filters reset to default.");
  };

  const toggleIn = <K extends "m" | "ty" | "lvl" | "cities">(k: K, val: string) => {
    setF((prev) => {
      const arr = prev[k];
      const next = arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
      return { ...prev, [k]: next };
    });
  };

  const runSmartSearch = () => {
    const q = smartQuery.trim();
    if (!q) return;
    const parsed = parseSmartSearch(q);
    patch({
      q: "",
      loc: parsed.loc || "",
      m: parsed.m,
      lvl: parsed.lv,
      sal: parsed.sal || 0,
      sk: parsed.sk.join(","),
      ty: parsed.ty,
    });
    onToast(`Smart search applied: "${q}"`);
  };

  // Keyboard shortcut "/" to focus search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && (e.target as HTMLElement).tagName !== "INPUT" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
        e.preventDefault();
        smartRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Aggregated metadata
  const locationCounts = useMemo(() => {
    const c: Record<string, number> = {};
    jobs.forEach((j) => (c[j.l] = (c[j.l] || 0) + 1));
    return Object.entries(c).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [jobs]);

  const workModeCounts = useMemo(() => {
    const c: Record<string, number> = { Remote: 0, Hybrid: 0, "In office": 0 };
    jobs.forEach((j) => {
      const mode = j.m === "Onsite" ? "In office" : j.m;
      c[mode] = (c[mode] || 0) + 1;
    });
    return c;
  }, [jobs]);

  const jobTypeCounts = useMemo(() => {
    const c: Record<string, number> = { "Full time": 0, "Part time": 0, Contract: 0, Internship: 0 };
    jobs.forEach((j) => {
      const t = j.ty === "Full-time" ? "Full time" : j.ty;
      c[t] = (c[t] || 0) + 1;
    });
    return c;
  }, [jobs]);

  const skillDemand = useMemo(() => {
    const c: Record<string, number> = {};
    jobs.forEach((j) => j.sk.forEach((s) => (c[s] = (c[s] || 0) + 1)));
    return c;
  }, [jobs]);

  const topSkills = useMemo(
    () =>
      Object.entries(skillDemand)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10),
    [skillDemand]
  );

  // Filter & sort results
  const results = useMemo(() => {
    const q = F.q.toLowerCase();
    const loc = F.loc.toLowerCase();
    const mustAll = splitList(F.sk);
    const now = Date.now();

    return jobs
      .filter((j) => {
        const jSk = j.sk.map((x) => x.toLowerCase());
        const ttl = `${j.t} ${j.c}`.toLowerCase();
        const mode = j.m === "Onsite" ? "In office" : j.m;
        const jType = j.ty === "Full-time" ? "Full time" : j.ty;

        return (
          (!q || ttl.includes(q)) &&
          (!loc || j.l.toLowerCase().includes(loc)) &&
          (!F.m.length || F.m.includes(j.m) || F.m.includes(mode)) &&
          (!F.ty.length || F.ty.includes(j.ty) || F.ty.includes(jType)) &&
          j.e <= F.e &&
          j.b >= F.sal &&
          (!F.sr || salaryBandOk(j, F.sr)) &&
          mustAll.every((s) => jSk.includes(s)) &&
          (!F.p || (now - j.at) / 86400000 <= F.p) &&
          (!F.lvl.length || F.lvl.includes(levelFromExp(j.e))) &&
          (!F.cities.length || F.cities.includes(j.l)) &&
          (!F.onlySaved || savedJobIds.includes(j.id))
        );
      })
      .sort((a, b) => {
        if (F.sort === "sal") return b.b - a.b;
        if (F.sort === "newest") return b.at - a.at;
        // Default: relevance / match score
        return calcScore(b, user) - calcScore(a, user);
      });
  }, [jobs, F, user, savedJobIds]);

  const firstName = (user.name || "Vignesh").split(" ")[0];
  const companyCount = new Set(jobs.map((j) => j.c)).size;

  return (
    <div className="space-y-6">
      {/* ======================================================== */}
      {/* HERO / SEARCH BANNER - EXACT REPLICA OF REFERENCE       */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden rounded-3xl border border-[#0d5cb2]/30 bg-gradient-to-r from-[#0d5cb2] via-[#0e63be] to-[#0a4d96] p-6 sm:p-8 shadow-md text-white">
        <div className="max-w-4xl space-y-4">
          {/* Greeting */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl select-none" role="img" aria-label="wave">👋</span>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Hi {firstName}
              </h1>
              <span className="text-2xl sm:text-3xl select-none" role="img" aria-label="wave">👋</span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-blue-100 font-medium">
              {jobs.length} openings from {companyCount} companies, matched to your skills.
            </p>
          </div>

          {/* Search Inputs Row with Experience Division */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.3fr_180px_180px_auto] gap-3 pt-1">
            <div className="relative">
              <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0d5cb2]" />
              <input
                ref={smartRef}
                type="text"
                value={F.q}
                onChange={(e) => patch({ q: e.target.value })}
                placeholder="Job title or company (press / to focus)"
                className="w-full rounded-xl border-0 bg-white py-3 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-white/80"
              />
            </div>

            {/* Experience Division */}
            <div className="relative">
              <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0d5cb2]" />
              <select
                value={F.lvl[0] || ""}
                onChange={(e) => patch({ lvl: e.target.value ? [e.target.value] : [] })}
                className="w-full appearance-none rounded-xl border-0 bg-white py-3 pl-10 pr-9 text-xs font-medium text-slate-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-white/80 cursor-pointer"
              >
                <option value="">Experience (Any)</option>
                <option value="Fresher">0 - 1 Yrs (Fresher)</option>
                <option value="Junior">1 - 3 Yrs (Junior)</option>
                <option value="Mid">3 - 6 Yrs (Mid-level)</option>
                <option value="Senior">6+ Yrs (Senior / Lead)</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>

            {/* City Division */}
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0d5cb2]" />
              <select
                value={F.loc}
                onChange={(e) => patch({ loc: e.target.value })}
                className="w-full appearance-none rounded-xl border-0 bg-white py-3 pl-10 pr-9 text-xs font-medium text-slate-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-white/80 cursor-pointer"
              >
                <option value="">City (All)</option>
                {locationCounts.map(([city]) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>

            <button
              type="button"
              onClick={() => {}}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold px-7 py-3 text-xs shadow-md transition-all cursor-pointer"
            >
              <Search className="h-4 w-4 text-white" />
              <span>Search</span>
            </button>
          </div>

          {/* Smart Search Bar */}
          <div className="flex items-center justify-between gap-3 rounded-xl border-0 bg-white px-4 py-2 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <Sparkles className="h-4 w-4 text-[#7c3aed] shrink-0" />
              <input
                type="text"
                value={smartQuery}
                onChange={(e) => setSmartQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && runSmartSearch()}
                placeholder='Smart search: try "react remote 15 lpa" or "fresher java pune"'
                className="w-full bg-transparent text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none truncate"
              />
            </div>
            <button
              type="button"
              onClick={runSmartSearch}
              className="shrink-0 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-bold px-4 py-1.5 shadow-sm shadow-purple-500/20 transition-all cursor-pointer"
            >
              Smart find
            </button>
          </div>

          {/* Quick Filter Pills Row */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => toggleIn("m", "Remote")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer shadow-xs",
                F.m.includes("Remote")
                  ? "bg-white text-[#0d5cb2] ring-2 ring-white font-bold"
                  : "bg-white/95 text-slate-800 hover:bg-white"
              )}
            >
              <Home className="h-3.5 w-3.5 text-[#0d5cb2]" />
              <span>Remote</span>
            </button>

            <button
              type="button"
              onClick={() => toggleIn("lvl", "Fresher")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer shadow-xs",
                F.lvl.includes("Fresher")
                  ? "bg-white text-emerald-700 ring-2 ring-white font-bold"
                  : "bg-white/95 text-slate-800 hover:bg-white"
              )}
            >
              <GraduationCap className="h-3.5 w-3.5 text-emerald-600" />
              <span>Freshers</span>
            </button>

            <button
              type="button"
              onClick={() => patch({ p: F.p === 7 ? 0 : 7 })}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer shadow-xs",
                F.p === 7
                  ? "bg-white text-[#0d5cb2] ring-2 ring-white font-bold"
                  : "bg-white/95 text-slate-800 hover:bg-white"
              )}
            >
              <Calendar className="h-3.5 w-3.5 text-[#0d5cb2]" />
              <span>Last 7 days</span>
            </button>

            <button
              type="button"
              onClick={() => patch({ sort: F.sort === "relevance" ? "recent" : "relevance" })}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer shadow-xs",
                F.sort === "relevance"
                  ? "bg-amber-100 text-amber-900 ring-2 ring-amber-300 font-bold"
                  : "bg-white/95 text-slate-800 hover:bg-white"
              )}
            >
              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              <span>Best match</span>
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* MAIN TWO-COLUMN WORKSPACE: FILTERS + JOB CARDS GRID     */}
      {/* ======================================================== */}
      <div className="grid items-start gap-6 lg:grid-cols-[270px_1fr]">
        {/* ==================== LEFT: FILTERS SIDEBAR ============ */}
        <aside className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-5 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="flex items-center gap-2 font-display text-sm font-bold text-slate-900">
              <SlidersHorizontal className="h-4 w-4 text-[#0d5cb2]" />
              Filters
            </span>
            <button
              onClick={resetAll}
              className="text-xs font-semibold text-[#0d5cb2] hover:underline cursor-pointer"
            >
              Clear all
            </button>
          </div>

          {/* Location Group */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 flex items-center justify-between">
              <span>Location <span className="text-slate-400 font-normal">({locationCounts.length})</span></span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </h4>
            <div className="mt-2.5 space-y-2">
              {(showAllCities ? locationCounts : locationCounts.slice(0, 5)).map(([city, count]) => {
                const checked = F.cities.includes(city) || F.loc.toLowerCase() === city.toLowerCase();
                return (
                  <label key={city} className="flex items-center justify-between text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none">
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleIn("cities", city)}
                        className="h-3.5 w-3.5 rounded border-slate-300 text-[#0d5cb2] focus:ring-[#0d5cb2] cursor-pointer"
                      />
                      <span>{city}</span>
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">{count}</span>
                  </label>
                );
              })}
              {locationCounts.length > 5 && (
                <button
                  type="button"
                  onClick={() => setShowAllCities(!showAllCities)}
                  className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer pt-0.5"
                >
                  {showAllCities ? "- Show less" : "+ Show more"}
                </button>
              )}
            </div>
          </div>

          {/* Work Mode Group */}
          <div className="pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 flex items-center justify-between">
              <span>Work mode <span className="text-slate-400 font-normal">({Object.keys(workModeCounts).length})</span></span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </h4>
            <div className="mt-2.5 space-y-2">
              {Object.entries(workModeCounts).map(([mode, count]) => {
                const checked = F.m.includes(mode) || (mode === "In office" && F.m.includes("Onsite"));
                return (
                  <label key={mode} className="flex items-center justify-between text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none">
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleIn("m", mode === "In office" ? "Onsite" : mode)}
                        className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span>{mode}</span>
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">{count}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Job Type Group */}
          <div className="pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 flex items-center justify-between">
              <span>Job type <span className="text-slate-400 font-normal">({Object.keys(jobTypeCounts).length})</span></span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </h4>
            <div className="mt-2.5 space-y-2">
              {Object.entries(jobTypeCounts).map(([type, count]) => {
                const checked = F.ty.includes(type) || (type === "Full time" && F.ty.includes("Full-time"));
                return (
                  <label key={type} className="flex items-center justify-between text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none">
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleIn("ty", type === "Full time" ? "Full-time" : type)}
                        className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span>{type}</span>
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">{count}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Experience Range Group */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <h4 className="text-xs font-bold text-slate-900">Experience (yrs)</h4>
            <select
              value={F.lvl[0] || ""}
              onChange={(e) => patch({ lvl: e.target.value ? [e.target.value] : [] })}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-blue-500 cursor-pointer"
            >
              <option value="">Any range</option>
              <option value="Fresher">0-1 yrs (Fresher)</option>
              <option value="Junior">1-3 yrs (Junior)</option>
              <option value="Mid">3-6 yrs (Mid-level)</option>
              <option value="Senior">6+ yrs (Senior)</option>
            </select>
            <div className="pt-1">
              <div className="flex justify-between text-[11px] text-slate-600">
                <span>Max experience asked:</span>
                <span className="font-bold text-slate-900">{F.e} yrs</span>
              </div>
              <input
                type="range"
                min={0}
                max={30}
                value={F.e}
                onChange={(e) => patch({ e: +e.target.value })}
                className="w-full mt-1.5 accent-blue-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Salary Range Group */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <h4 className="text-xs font-bold text-slate-900">Salary range</h4>
            <select
              value={F.sr}
              onChange={(e) => patch({ sr: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-blue-500 cursor-pointer"
            >
              <option value="">Any range</option>
              {SALARY_BANDS.map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <div className="pt-1">
              <div className="flex justify-between text-[11px] text-slate-600">
                <span>Minimum salary:</span>
                <span className="font-bold text-slate-900">₹{F.sal} LPA+</span>
              </div>
              <input
                type="range"
                min={0}
                max={60}
                step={2}
                value={F.sal}
                onChange={(e) => patch({ sal: +e.target.value })}
                className="w-full mt-1.5 accent-blue-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Skills Accordion */}
          <div className="pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 flex items-center justify-between">
              <span>Skills</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </h4>
            <input
              type="text"
              value={F.sk}
              onChange={(e) => patch({ sk: e.target.value })}
              placeholder="Filter by skill, e.g. React"
              className="w-full mt-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500"
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {topSkills.map(([skill]) => {
                const active = F.sk.toLowerCase().includes(skill.toLowerCase());
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => patch({ sk: active ? "" : skill })}
                    className={cn(
                      "rounded-md border px-2 py-0.5 text-[10px] font-medium transition-colors cursor-pointer",
                      active
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                    )}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ==================== RIGHT: RESULTS & JOB CARDS ======= */}
        <section className="min-w-0 space-y-4">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 px-4 shadow-2xs">
            <div className="flex items-center gap-2 text-slate-900">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="font-display text-sm font-bold">
                {results.length} jobs found
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Sort Pills */}
              <div className="hidden sm:flex items-center gap-1.5 bg-slate-100/70 p-1 rounded-xl border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => patch({ sort: "relevance" })}
                  className={cn(
                    "flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer",
                    F.sort === "relevance"
                      ? "bg-white text-blue-700 shadow-2xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  <Sparkles className="h-3 w-3 text-blue-600" />
                  <span>Relevance</span>
                </button>
                <button
                  type="button"
                  onClick={() => patch({ sort: "newest" })}
                  className={cn(
                    "flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer",
                    F.sort === "newest"
                      ? "bg-white text-blue-700 shadow-2xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  <Clock className="h-3 w-3" />
                  <span>Newest</span>
                </button>
                <button
                  type="button"
                  onClick={() => patch({ sort: "sal" })}
                  className={cn(
                    "flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer",
                    F.sort === "sal"
                      ? "bg-white text-blue-700 shadow-2xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  <TrendingUp className="h-3 w-3" />
                  <span>Salary: High to Low</span>
                </button>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer",
                    viewMode === "grid"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span>Grid</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer",
                    viewMode === "list"
                      ? "bg-blue-600 text-white shadow-xs font-bold"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <LayoutList className="h-3.5 w-3.5" />
                  <span>List</span>
                </button>
              </div>
            </div>
          </div>

          {/* Job Cards */}
          {results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-2xs">
              <Building2 className="mx-auto mb-2 h-10 w-10 text-slate-300" />
              <h3 className="font-display text-base font-bold text-slate-900">No jobs match your search</h3>
              <p className="mt-1 text-xs text-slate-500">
                Try clearing your search query or reset filters.
              </p>
              <button
                onClick={resetAll}
                className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div
              className={cn(
                "grid gap-5",
                viewMode === "grid" ? "grid-cols-1 min-[1600px]:grid-cols-2" : "grid-cols-1"
              )}
            >
              {results.map((j) => {
                const pct = calcScore(j, user);
                const applied = appliedJobIds.includes(j.id);
                const saved = savedJobIds.includes(j.id);
                const comparing = compareSelection.includes(j.id);
                const ratingInfo = getCompanyRating(j.c, j.id);

                return (
                  <ProJobCard
                    key={j.id}
                    job={j}
                    percent={pct}
                    applied={applied}
                    saved={saved}
                    comparing={comparing}
                    rating={ratingInfo}
                    onOpen={() => onOpenJob(j.id)}
                    onApply={() => onApplyJob(j.id)}
                    onSave={() => onSaveJob(j.id)}
                    onCompare={() => onCompareToggle(j.id)}
                  />
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
