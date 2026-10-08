import React from "react";
import {
  Search,
  Sparkles,
  MapPin,
  Home,
  GraduationCap,
  Zap,
  Bookmark,
  BookmarkCheck,
  ArrowRightLeft,
  Check,
  X,
  Bot,
  Building2,
  Briefcase,
  Clock,
  ChevronDown,
  LayoutList,
  LayoutGrid,
  IndianRupee,
  Wrench,
  Target,
  Filter,
  Save,
  Lightbulb,
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
import { ProHero } from "./ProHero";
import { MatchRing, matchTier } from "./ProMatchRing";

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
  sort: "recent",
});

const splitList = (s: string) =>
  (s || "")
    .split(",")
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean);

const selectCls =
  "w-full appearance-none rounded-lg border border-border bg-background pl-3 pr-8 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer";
const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30";

const SelectField: React.FC<{
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  options: [string | number, string][];
}> = ({ label, value, onChange, options }) => (
  <div className="min-w-0">
    <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{label}</label>
    <div className="relative">
      <select value={String(value)} onChange={(e) => onChange(e.target.value)} className={selectCls}>
        {options.map(([v, l]) => (
          <option key={String(v)} value={String(v)}>
            {l}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
    </div>
  </div>
);

const FilterGroup: React.FC<{
  icon: React.ReactNode;
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}> = ({ icon, title, defaultOpen = true, children }) => (
  <details open={defaultOpen} className="group border-t border-border/70 py-3 first:border-t-0">
    <summary className="flex cursor-pointer list-none items-center gap-2 text-xs font-bold text-foreground [&::-webkit-details-marker]:hidden">
      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary [&_svg]:h-3.5 [&_svg]:w-3.5">
        {icon}
      </span>
      <span className="flex-1">{title}</span>
      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform group-open:rotate-180" />
    </summary>
    <div className="mt-3 space-y-2.5 text-xs">{children}</div>
  </details>
);

const CheckRow: React.FC<{
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
}> = ({ label, count, checked, onChange }) => (
  <label className="flex cursor-pointer items-center justify-between gap-2 text-muted-foreground hover:text-foreground">
    <span className="flex min-w-0 items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-3.5 w-3.5 shrink-0 rounded border-border accent-[#ec2639]"
      />
      <span className="truncate">{label}</span>
    </span>
    {count !== undefined && (
      <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">{count}</span>
    )}
  </label>
);

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
  const appliedJobIds = React.useMemo(
    () => (applications || []).filter((a) => a.who === user.email).map((a) => a.jid),
    [applications, user.email]
  );
  const savedJobIds = user.saved || [];
  const compareJobs = compareSelection || [];
  const userSkills = React.useMemo(() => (user.sk || []).map((x) => x.toLowerCase()), [user.sk]);

  const [F, setF] = React.useState<JobFilters>(() => makeDefaults(!!initialOnlySaved));
  const [smartQuery, setSmartQuery] = React.useState("");
  const [isCompact, setIsCompact] = React.useState(false);
  const [savedSearches, setSavedSearches] = React.useState<{ n: string; f: JobFilters }[]>(() => user.ss || []);
  const smartRef = React.useRef<HTMLInputElement>(null);

  const patch = (p: Partial<JobFilters>) => setF((f) => ({ ...f, ...p }));
  const toggleIn = (key: "m" | "ty" | "lvl" | "co" | "ind" | "sz" | "cities" | "any", v: string) =>
    setF((f) => ({ ...f, [key]: f[key].includes(v) ? f[key].filter((x) => x !== v) : [...f[key], v] }));

  // Press "/" anywhere to jump to the smart search bar
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA" && tag !== "SELECT") {
        e.preventDefault();
        smartRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const resetAll = () => {
    setF(makeDefaults(false));
    setSmartQuery("");
    onToast("Filters reset.");
  };

  const runSmartSearch = () => {
    const raw = smartQuery.trim();
    if (!raw) return;
    const p = parseSmartSearch(raw);
    const next: Partial<JobFilters> = {};
    if (p.sk.length) next.sk = p.sk.join(", ");
    if (p.m.length) next.m = p.m;
    if (p.ty.length) next.ty = p.ty;
    if (p.sal) next.sal = p.sal;
    if (p.lv.length) next.lvl = p.lv;
    if (p.ex !== null) next.e = p.ex;
    if (p.loc) {
      if (p.loc === "Remote") next.m = ["Remote"];
      else next.cities = [p.loc];
    }
    const understood = Object.keys(next).length > 0;
    if (!understood) next.q = raw;
    setF((f) => ({ ...makeDefaults(f.onlySaved), ...next }));
    onToast(understood ? `Smart search applied: ${raw}` : `Searching for "${raw}"`);
  };

  const saveSearch = () => {
    const name = F.q || smartQuery || (F.m.length ? F.m.join(", ") : F.sk ? F.sk : "Custom search");
    setSavedSearches((prev) => [...prev, { n: name, f: { ...F } }]);
    onToast(`Search "${name}" saved.`);
  };

  // Aggregate metadata for the sidebar
  const locationCounts = React.useMemo(() => {
    const c: Record<string, number> = {};
    jobs.forEach((j) => (c[j.l] = (c[j.l] || 0) + 1));
    return Object.entries(c).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [jobs]);

  const skillDemand = React.useMemo(() => {
    const c: Record<string, number> = {};
    jobs.forEach((j) => j.sk.forEach((s) => (c[s] = (c[s] || 0) + 1)));
    return c;
  }, [jobs]);
  const popularSkills = React.useMemo(
    () =>
      Object.keys(skillDemand)
        .sort((a, b) => skillDemand[b] - skillDemand[a])
        .slice(0, 12),
    [skillDemand]
  );
  const allSkills = React.useMemo(() => Object.keys(skillDemand).sort(), [skillDemand]);
  const allCompanies = React.useMemo(() => [...new Set(jobs.map((j) => j.c))].sort(), [jobs]);
  const allIndustries = React.useMemo(
    () => [...new Set(jobs.map((j) => (COMPANY_INFO[j.c] || ["Other", "Startup"])[0]))].sort(),
    [jobs]
  );

  const results = React.useMemo(() => {
    const q = F.q.toLowerCase();
    const loc = F.loc.toLowerCase();
    const mustAll = splitList(F.sk);
    const excluded = splitList(F.ex);
    const now = Date.now();

    return jobs
      .filter((j) => {
        const jSk = j.sk.map((x) => x.toLowerCase());
        const missing = jSk.filter((x) => !userSkills.includes(x)).length;
        const ttl = `${j.t} ${j.c}`.toLowerCase();
        const meta = COMPANY_INFO[j.c] || ["Other", "Startup"];
        return (
          (!q || ttl.includes(q)) &&
          (!loc || j.l.toLowerCase().includes(loc)) &&
          (!F.m.length || F.m.includes(j.m)) &&
          (!F.ty.length || F.ty.includes(j.ty)) &&
          j.e <= F.e &&
          j.b >= F.sal &&
          (!F.sr || salaryBandOk(j, F.sr)) &&
          mustAll.every((s) => jSk.includes(s)) &&
          (!F.p || (now - j.at) / 86400000 <= F.p) &&
          !(F.hide && appliedJobIds.includes(j.id)) &&
          (!F.lvl.length || F.lvl.includes(levelFromExp(j.e))) &&
          calcScore(j, user) >= F.mm &&
          (!F.co.length || F.co.includes(j.c)) &&
          (!F.ind.length || F.ind.includes(meta[0])) &&
          (!F.sz.length || F.sz.includes(meta[1])) &&
          (!F.cities.length || F.cities.includes(j.l)) &&
          (!F.any.length || j.sk.some((x) => F.any.includes(x))) &&
          (F.miss === "" || missing <= +F.miss) &&
          !excluded.some((w) => ttl.includes(w)) &&
          (!F.onlySaved || savedJobIds.includes(j.id))
        );
      })
      .sort((a, b) =>
        F.sort === "sal"
          ? b.b - a.b
          : F.sort === "match"
          ? calcScore(b, user) - calcScore(a, user)
          : F.sort === "fit"
          ? fitAnalysis(b, user).tot - fitAnalysis(a, user).tot
          : b.at - a.at
      );
  }, [jobs, F, user, userSkills, appliedJobIds, savedJobIds]);

  // Active filter chips (click to remove)
  const activeChips = React.useMemo(() => {
    const chips: { key: string; label: string; clear: () => void }[] = [];
    const d = makeDefaults(false);
    if (F.q) chips.push({ key: "q", label: `"${F.q}"`, clear: () => patch({ q: "" }) });
    if (F.loc) chips.push({ key: "loc", label: F.loc, clear: () => patch({ loc: "" }) });
    F.m.forEach((v) => chips.push({ key: `m-${v}`, label: v, clear: () => toggleIn("m", v) }));
    F.ty.forEach((v) => chips.push({ key: `ty-${v}`, label: v, clear: () => toggleIn("ty", v) }));
    F.lvl.forEach((v) => chips.push({ key: `lvl-${v}`, label: v, clear: () => toggleIn("lvl", v) }));
    F.cities.forEach((v) => chips.push({ key: `c-${v}`, label: v, clear: () => toggleIn("cities", v) }));
    F.co.forEach((v) => chips.push({ key: `co-${v}`, label: v, clear: () => toggleIn("co", v) }));
    F.ind.forEach((v) => chips.push({ key: `ind-${v}`, label: v, clear: () => toggleIn("ind", v) }));
    F.sz.forEach((v) => chips.push({ key: `sz-${v}`, label: `${v} size`, clear: () => toggleIn("sz", v) }));
    F.any.forEach((v) => chips.push({ key: `any-${v}`, label: `Any: ${v}`, clear: () => toggleIn("any", v) }));
    if (F.sk) chips.push({ key: "sk", label: `Must have: ${F.sk}`, clear: () => patch({ sk: "" }) });
    if (F.sal > 0) chips.push({ key: "sal", label: `\u20B9${F.sal}+ LPA`, clear: () => patch({ sal: 0 }) });
    if (F.sr)
      chips.push({
        key: "sr",
        label: (SALARY_BANDS.find((b) => b[0] === F.sr) || ["", F.sr])[1],
        clear: () => patch({ sr: "" }),
      });
    if (F.e < d.e) chips.push({ key: "e", label: `Up to ${F.e} yrs`, clear: () => patch({ e: d.e }) });
    if (F.p) chips.push({ key: "p", label: F.p === 1 ? "Last 24 hours" : `Last ${F.p} days`, clear: () => patch({ p: 0 }) });
    if (F.mm) chips.push({ key: "mm", label: `AI match ${F.mm}%+`, clear: () => patch({ mm: 0 }) });
    if (F.miss !== "") chips.push({ key: "miss", label: `Missing at most ${F.miss}`, clear: () => patch({ miss: "" }) });
    if (F.ex) chips.push({ key: "ex", label: `Hide: ${F.ex}`, clear: () => patch({ ex: "" }) });
    if (F.hide) chips.push({ key: "hide", label: "Hide applied", clear: () => patch({ hide: false }) });
    if (F.onlySaved) chips.push({ key: "onlySaved", label: "Saved only", clear: () => patch({ onlySaved: false }) });
    return chips;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [F]);

  const firstName = (user.name || "there").split(" ")[0];
  const companyCount = new Set(jobs.map((j) => j.c)).size;

  const presetCls = (on: boolean) =>
    cn(
      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold transition-all cursor-pointer",
      on ? "border-white bg-white text-primary" : "border-white/40 bg-white/15 text-white hover:bg-white/25"
    );

  return (
    <div className="space-y-5">
      {/* Hero */}
      <ProHero
        title={`Hi ${firstName}, ready for your next role?`}
        subtitle={`${jobs.length} openings from ${companyCount} companies, matched to your skills.`}
      >
        <div className="flex flex-col gap-2 pt-1 sm:flex-row">
          <div className="relative flex-1">
            <Sparkles className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
            <input
              ref={smartRef}
              value={smartQuery}
              onChange={(e) => setSmartQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runSmartSearch()}
              placeholder='Smart search: try "react remote 15 lpa" or "fresher java pune"'
              className="w-full rounded-xl border-0 bg-white py-3 pl-10 pr-3 text-xs font-medium text-foreground shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-black/20"
            />
          </div>
          <button
            onClick={runSmartSearch}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 px-5 py-3 text-xs font-bold text-white shadow-sm transition-colors hover:bg-black cursor-pointer"
          >
            <Search className="h-3.5 w-3.5" />
            Smart find
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button onClick={() => toggleIn("m", "Remote")} className={presetCls(F.m.includes("Remote"))}>
            <Home className="h-3 w-3" />
            Remote
          </button>
          <button onClick={() => toggleIn("lvl", "Fresher")} className={presetCls(F.lvl.includes("Fresher"))}>
            <GraduationCap className="h-3 w-3" />
            Freshers
          </button>
          <button onClick={() => patch({ p: F.p === 1 ? 0 : 1 })} className={presetCls(F.p === 1)}>
            <Zap className="h-3 w-3" />
            New today
          </button>
          <button
            onClick={() => patch({ sort: F.sort === "match" ? "recent" : "match" })}
            className={presetCls(F.sort === "match")}
          >
            <Target className="h-3 w-3" />
            Best match
          </button>
        </div>
      </ProHero>

      {/* Horizontal filter bar */}
      <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border bg-background p-4 shadow-sm sm:grid-cols-3 lg:grid-cols-6">
        <SelectField
          label="Work mode"
          value={F.m[0] || ""}
          onChange={(v) => patch({ m: v ? [v] : [] })}
          options={[["", "Any"], ["Remote", "Remote"], ["Hybrid", "Hybrid"], ["Onsite", "Onsite"]]}
        />
        <SelectField
          label="Job type"
          value={F.ty[0] || ""}
          onChange={(v) => patch({ ty: v ? [v] : [] })}
          options={[["", "Any"], ["Full-time", "Full-time"], ["Internship", "Internship"], ["Contract", "Contract"]]}
        />
        <SelectField
          label="Experience"
          value={F.lvl[0] || ""}
          onChange={(v) => patch({ lvl: v ? [v] : [] })}
          options={[
            ["", "Any level"],
            ["Fresher", "Fresher (under 1 yr)"],
            ["Junior", "Junior (1\u20133 yrs)"],
            ["Mid", "Mid (3\u20136 yrs)"],
            ["Senior", "Senior (6+ yrs)"],
          ]}
        />
        <SelectField label="Salary" value={F.sr} onChange={(v) => patch({ sr: v })} options={SALARY_BANDS} />
        <SelectField
          label="Posted"
          value={F.p}
          onChange={(v) => patch({ p: +v })}
          options={[[0, "Any time"], [1, "Last 24 hours"], [7, "Last 7 days"], [30, "Last 30 days"]]}
        />
        <SelectField
          label="Sort by"
          value={F.sort}
          onChange={(v) => patch({ sort: v })}
          options={[["recent", "Most recent"], ["sal", "Highest salary"], ["match", "Best AI match"], ["fit", "Best overall fit"]]}
        />
      </div>

      {/* Sidebar + results */}
      <div className="grid items-start gap-5 lg:grid-cols-[270px_1fr]">
        {/* Filters sidebar */}
        <aside className="rounded-2xl border border-border bg-background p-4 shadow-sm lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-2 font-display text-base font-bold text-foreground">
              <Filter className="h-4 w-4 text-primary" />
              Filters
            </span>
            <button
              onClick={resetAll}
              className="rounded-lg border border-primary/40 px-2.5 py-1 text-[11px] font-bold text-primary transition-colors hover:bg-primary/10 cursor-pointer"
            >
              Reset all
            </button>
          </div>

          <FilterGroup icon={<MapPin />} title="Location">
            <div className="max-h-40 space-y-1.5 overflow-y-auto pr-1">
              {locationCounts.map(([city, n]) => (
                <CheckRow
                  key={city}
                  label={city}
                  count={n}
                  checked={F.cities.includes(city)}
                  onChange={() => toggleIn("cities", city)}
                />
              ))}
            </div>
          </FilterGroup>

          <FilterGroup icon={<IndianRupee />} title="Salary & experience">
            <label className="block font-medium text-muted-foreground">
              Minimum salary: <b className="text-primary">{"\u20B9"}{F.sal}</b> LPA+
            </label>
            <input
              type="range"
              min={0}
              max={70}
              step={1}
              value={F.sal}
              onChange={(e) => patch({ sal: +e.target.value })}
              className="w-full cursor-pointer accent-[#ec2639]"
            />
            <label className="block font-medium text-muted-foreground">
              Max experience asked: <b className="text-primary">{F.e}</b> yrs
            </label>
            <input
              type="range"
              min={0}
              max={30}
              step={1}
              value={F.e}
              onChange={(e) => patch({ e: +e.target.value })}
              className="w-full cursor-pointer accent-[#ec2639]"
            />
          </FilterGroup>

          <FilterGroup icon={<Wrench />} title="Skills">
            <label className="block font-medium text-muted-foreground">
              Must have <i>all</i> of these
            </label>
            <input
              list="pro-skill-list"
              value={F.sk}
              onChange={(e) => patch({ sk: e.target.value })}
              placeholder="Type any skill, e.g. Figma, SQL"
              className={inputCls}
            />
            <datalist id="pro-skill-list">
              {allSkills.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
            <label className="block pt-1 font-medium text-muted-foreground">
              Job asks for <i>any</i> of these
            </label>
            <div className="max-h-44 space-y-1.5 overflow-y-auto pr-1">
              {popularSkills.map((s) => (
                <CheckRow
                  key={s}
                  label={s}
                  count={skillDemand[s]}
                  checked={F.any.includes(s)}
                  onChange={() => toggleIn("any", s)}
                />
              ))}
            </div>
          </FilterGroup>

          <FilterGroup icon={<Bot />} title="Fit with my profile">
            <label className="block font-medium text-muted-foreground">
              Min AI match: <b className="text-primary">{F.mm}</b>%
            </label>
            <input
              type="range"
              min={0}
              max={100}
              step={10}
              value={F.mm}
              onChange={(e) => patch({ mm: +e.target.value })}
              className="w-full cursor-pointer accent-[#ec2639]"
            />
            <label className="block font-medium text-muted-foreground">Skills I can be missing</label>
            <div className="relative">
              <select value={F.miss} onChange={(e) => patch({ miss: e.target.value })} className={selectCls}>
                <option value="">Any</option>
                <option value="0">None, I have all</option>
                <option value="1">At most 1</option>
                <option value="2">At most 2</option>
                <option value="3">At most 3</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            </div>
          </FilterGroup>

          <FilterGroup icon={<Building2 />} title="Company" defaultOpen={false}>
            <label className="block font-medium text-muted-foreground">Industry</label>
            <div className="space-y-1.5">
              {allIndustries.map((x) => (
                <CheckRow key={x} label={x} checked={F.ind.includes(x)} onChange={() => toggleIn("ind", x)} />
              ))}
            </div>
            <label className="block pt-1 font-medium text-muted-foreground">Company size</label>
            <div className="space-y-1.5">
              {["Startup", "Mid", "Large", "Enterprise"].map((x) => (
                <CheckRow key={x} label={x} checked={F.sz.includes(x)} onChange={() => toggleIn("sz", x)} />
              ))}
            </div>
            <label className="block pt-1 font-medium text-muted-foreground">Companies</label>
            <div className="max-h-40 space-y-1.5 overflow-y-auto pr-1">
              {allCompanies.map((x) => (
                <CheckRow key={x} label={x} checked={F.co.includes(x)} onChange={() => toggleIn("co", x)} />
              ))}
            </div>
          </FilterGroup>

          <FilterGroup icon={<Search />} title="Keywords & status">
            <label className="block font-medium text-muted-foreground">Hide titles/companies containing</label>
            <input
              value={F.ex}
              onChange={(e) => patch({ ex: e.target.value })}
              placeholder="e.g. intern, sales"
              className={inputCls}
            />
            <div className="space-y-1.5 pt-1">
              <CheckRow label="Hide jobs I applied to" checked={F.hide} onChange={() => patch({ hide: !F.hide })} />
              <CheckRow
                label="Show only my saved jobs"
                checked={F.onlySaved}
                onChange={() => patch({ onlySaved: !F.onlySaved })}
              />
            </div>
          </FilterGroup>
        </aside>

        {/* Results */}
        <section className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-muted-foreground">
              <b className="font-display text-sm text-foreground">{results.length}</b> jobs found
            </span>
            <div className="flex items-center gap-2">
              {compareJobs.length > 1 && (
                <button
                  onClick={onOpenCompareDrawer}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-sm cursor-pointer"
                >
                  <ArrowRightLeft className="h-3.5 w-3.5" />
                  Compare {compareJobs.length}
                </button>
              )}
              <button
                onClick={() => setIsCompact((c) => !c)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-primary/40 bg-background px-3 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-primary/10 cursor-pointer"
              >
                {isCompact ? <LayoutGrid className="h-3.5 w-3.5" /> : <LayoutList className="h-3.5 w-3.5" />}
                {isCompact ? "Comfortable" : "Compact"}
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-border bg-secondary/40 px-3 py-2 text-[11px] text-muted-foreground">
            <Bot className="h-3.5 w-3.5 text-primary" />
            <span>
              <b className="text-foreground">AI Match</b> shows how many of the job's required skills are in your profile.
            </span>
            <span className="font-semibold text-emerald-600">&#9679; 70%+ Strong</span>
            <span className="font-semibold text-amber-600">&#9679; 40&ndash;69% Fair</span>
            <span className="font-semibold text-primary">&#9679; Below 40% Low</span>
          </div>

          {/* Active chips + saved searches */}
          {(activeChips.length > 0 || savedSearches.length > 0) && (
            <div className="flex flex-wrap items-center gap-1.5">
              {activeChips.map((c) => (
                <button
                  key={c.key}
                  onClick={c.clear}
                  className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary cursor-pointer"
                >
                  {c.label}
                  <X className="h-3 w-3" />
                </button>
              ))}
              {activeChips.length > 0 && (
                <>
                  <button
                    onClick={resetAll}
                    className="rounded-full border border-border px-2.5 py-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    Clear all
                  </button>
                  <button
                    onClick={saveSearch}
                    className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <Save className="h-3 w-3" />
                    Save search
                  </button>
                </>
              )}
              {savedSearches.map((s, i) => (
                <span
                  key={`${s.n}-${i}`}
                  className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-2.5 py-1 text-[11px] font-semibold text-foreground"
                >
                  <button
                    onClick={() => {
                      setF(s.f);
                      onToast(`Applied saved search: ${s.n}`);
                    }}
                    className="inline-flex items-center gap-1 hover:text-primary cursor-pointer"
                  >
                    <Bookmark className="h-3 w-3 text-primary" />
                    {s.n}
                  </button>
                  <button
                    onClick={() => setSavedSearches((prev) => prev.filter((_, k) => k !== i))}
                    aria-label={`Remove saved search ${s.n}`}
                    className="text-muted-foreground hover:text-primary cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Cards */}
          {results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-background p-10 text-center">
              <Building2 className="mx-auto mb-2 h-9 w-9 text-muted-foreground/40" />
              <b className="block font-display text-base text-foreground">No jobs match.</b>
              <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
                Remove a filter chip above or clear all filters.
              </p>
              <button
                onClick={resetAll}
                className="mt-3 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((j) => {
                const pct = calcScore(j, user);
                const tier = matchTier(pct);
                const applied = appliedJobIds.includes(j.id);
                const saved = savedJobIds.includes(j.id);
                const comparing = compareJobs.includes(j.id);
                const gap = j.sk.filter((s) => !userSkills.includes(s.toLowerCase()));
                const have = j.sk.length - gap.length;
                const meta = COMPANY_INFO[j.c] || ["Other", "Startup"];
                const [l1, l2] = companyBlurb(j.c, meta[0], meta[1]);

                return (
                  <article
                    key={j.id}
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest("button")) return;
                      onOpenJob(j.id);
                    }}
                    className={cn(
                      "group cursor-pointer rounded-2xl border border-border bg-background shadow-sm transition-all hover:border-primary/40 hover:shadow-md",
                      isCompact ? "p-3.5" : "p-4 sm:p-5"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-white p-1.5">
                        <img src={getCompanyLogo(j.c)} alt={j.c} className="max-h-full max-w-full object-contain" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-display text-base font-bold text-foreground transition-colors group-hover:text-primary">
                          {j.t}
                        </h3>
                        <div className="text-sm font-semibold text-primary">{j.c}</div>
                      </div>
                      <div
                        className="flex shrink-0 flex-col items-center gap-0.5"
                        title={`AI Match: ${pct}% of this job's required skills are in your profile`}
                      >
                        <small className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                          <Bot className="h-3 w-3" />
                          AI match
                        </small>
                        <MatchRing percent={pct} size={isCompact ? 42 : 50} />
                        {!isCompact && <em className={cn("text-[10px] font-bold not-italic", tier.text)}>{tier.label}</em>}
                      </div>
                    </div>

                    {!isCompact && (
                      <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-start gap-2">
                          <Building2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
                          <span>{l1}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Briefcase className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
                          <span>{l2}</span>
                        </div>
                      </div>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-primary" />
                        {j.l}
                      </span>
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">{j.m}</span>
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">{j.ty}</span>
                      <span>{j.e}+ yrs</span>
                      <span className="font-semibold text-foreground">
                        {"\u20B9"}
                        {j.a}&ndash;{j.b} LPA
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {timeAgo(j.at)}
                      </span>
                    </div>

                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {j.sk.map((s) => {
                        const hit = userSkills.includes(s.toLowerCase());
                        return (
                          <span
                            key={s}
                            className={cn(
                              "rounded-md border px-2.5 py-0.5 text-[11px] font-medium",
                              hit
                                ? "border-emerald-500/40 bg-emerald-500/10 font-semibold text-emerald-700 dark:text-emerald-400"
                                : "border-border bg-secondary/60 text-muted-foreground"
                            )}
                          >
                            {s}
                          </span>
                        );
                      })}
                    </div>

                    {!isCompact && (
                      <div className="mt-3 flex items-center gap-2 rounded-lg bg-secondary/60 px-3 py-2 text-[11px] text-muted-foreground">
                        <Bot className="h-3.5 w-3.5 shrink-0 text-primary" />
                        {!userSkills.length ? (
                          <span>Add your skills in Profile to see how well you match this job.</span>
                        ) : gap.length ? (
                          <span>
                            You have <b className="text-foreground">{have} of {j.sk.length}</b> required skills &middot; Missing:{" "}
                            {gap.slice(0, 3).join(", ")}
                          </span>
                        ) : (
                          <span>
                            You have <b className="text-emerald-600">all {j.sk.length}</b> required skills &middot; Apply now!
                          </span>
                        )}
                      </div>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <button
                        disabled={applied}
                        onClick={() => !applied && onApplyJob(j.id)}
                        className={cn(
                          "inline-flex items-center gap-1 rounded-lg px-4 py-1.5 text-xs font-bold transition-all",
                          applied
                            ? "cursor-not-allowed border border-border bg-secondary text-muted-foreground"
                            : "bg-primary text-primary-foreground shadow-sm shadow-primary/30 hover:bg-primary/90 cursor-pointer"
                        )}
                      >
                        {applied ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                            Applied
                          </>
                        ) : (
                          "Quick apply"
                        )}
                      </button>
                      <button
                        onClick={() => onSaveJob(j.id)}
                        className={cn(
                          "inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer",
                          saved
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-primary/40 text-primary hover:bg-primary/10"
                        )}
                      >
                        {saved ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
                        {saved ? "Saved" : "Save"}
                      </button>
                      <button
                        onClick={() => onCompareToggle(j.id)}
                        className={cn(
                          "inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer",
                          comparing
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-primary/40 text-primary hover:bg-primary/10"
                        )}
                      >
                        {comparing ? <Check className="h-3.5 w-3.5" /> : <ArrowRightLeft className="h-3.5 w-3.5" />}
                        {comparing ? "Comparing" : "Compare"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {results.length > 0 && (
            <p className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-muted-foreground">
              <Lightbulb className="h-3.5 w-3.5 text-primary" />
              Press <kbd className="rounded border border-border px-1 font-mono">/</kbd> to jump to smart search.
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProJobsView;
