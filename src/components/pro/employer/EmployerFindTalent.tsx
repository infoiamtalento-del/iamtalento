import { useCallback, useEffect, useRef, useState } from "react";
import {
  BadgeCheck,
  Bookmark,
  CheckCircle2,
  Crown,
  Download,
  FileText,
  GraduationCap,
  GripVertical,
  Kanban,
  LayoutGrid,
  Lock,
  MapPin,
  RotateCcw,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Target,
  Users,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { downloadCirPdf } from "@/lib/cirPdf";
import {
  getCandidateCir,
  getCandidateProfile,
  getTalentOverview,
  inr,
  isPaymentRequired,
  purchaseTalentPackage,
  searchCandidates,
  type CandidateFullProfile,
  type TalentCandidate,
  type TalentOverview,
  type TalentSearch,
} from "@/services/employer/talent";
import type { NavigateFn } from "./EmployerOverview";
import { Avatar, EmptyState, ErrorState, Loading, PageHeader } from "./employerUi";
import { TalentPaywall, WalletRecharge } from "./TalentPaywall";

interface Props {
  searchParams: URLSearchParams;
  contact?: { name?: string; email?: string };
  onNavigate: NavigateFn;
  onToast: (message: string) => void;
}

type Section = "home" | "candidates" | "verified";
type TalentBoardCol = "Discovered" | "Saved" | "Outreach" | "Shortlisted";

const BOARD_COLS: { id: TalentBoardCol; label: string; hint: string; theme: string }[] = [
  { id: "Discovered", label: "Discovered Pool", hint: "Matched talent pool", theme: "applied" },
  { id: "Saved", label: "Saved & Bookmarked", hint: "Curated by HR", theme: "shortlisted" },
  { id: "Outreach", label: "Outreach / Invited", hint: "Contacted for role", theme: "interview" },
  { id: "Shortlisted", label: "Shortlisted for Role", hint: "Ready for interview", theme: "offer" },
];

function computeCandidateMatchScore(c: TalentCandidate, targetSkill: string): number {
  const base = 68 + Math.min(18, (c.years_of_experience ?? 0) * 3) + (c.verified ? 8 : 0);
  if (targetSkill.trim()) {
    const hasSkill = c.skills.some((s) => s.toLowerCase().includes(targetSkill.trim().toLowerCase()));
    return Math.min(98, hasSkill ? base + 6 : Math.max(52, base - 14));
  }
  return Math.min(98, base);
}

function CandidateCard({
  c,
  matchScore,
  saved,
  boardStage,
  onToggleSave,
  onStageChange,
  onOpen,
  actionLabel,
}: {
  c: TalentCandidate;
  matchScore: number;
  saved: boolean;
  boardStage: TalentBoardCol;
  onToggleSave: () => void;
  onStageChange: (stage: TalentBoardCol) => void;
  onOpen: () => void;
  actionLabel: string;
}) {
  return (
    <li className="workspace-panel flex flex-col gap-3 !p-4 transition-all hover:border-primary/40">
      <div className="flex items-start gap-3">
        <Avatar name={c.display_name} src={c.photo_url} size={44} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="flex items-center gap-1.5 text-sm font-bold">
              <span className="truncate">{c.display_name}</span>
              {c.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-primary" aria-label="Verified candidate" />}
            </p>
            <div className="flex items-center gap-1.5 shrink-0">
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  matchScore >= 80
                    ? "bg-success/15 text-success"
                    : matchScore >= 65
                      ? "bg-primary/12 text-primary"
                      : "bg-secondary text-muted-foreground"
                }`}
              >
                {matchScore}% match
              </span>
              <button
                type="button"
                onClick={onToggleSave}
                aria-label={saved ? `Remove ${c.display_name} from saved` : `Save ${c.display_name}`}
                className={`inline-flex h-7 w-7 items-center justify-center rounded-md border transition-colors ${
                  saved
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                <Bookmark className={`h-3.5 w-3.5 ${saved ? "fill-current" : ""}`} />
              </button>
            </div>
          </div>
          <p className="truncate text-xs text-muted-foreground">{c.headline || c.job_role || "Professional"}</p>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 text-[11px] text-muted-foreground">
            {c.city && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {c.city}
              </span>
            )}
            <span>{c.years_of_experience ?? 0} yrs</span>
            <span className="font-semibold text-primary">{boardStage}</span>
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {c.skills.slice(0, 5).map((s) => (
          <span key={s} className="workspace-chip !px-2 !py-0.5 !text-[10px]">
            {s}
          </span>
        ))}
      </div>
      <div className="space-y-1 text-[11px] text-muted-foreground">
        {c.education && (
          <p className="flex items-center gap-1.5">
            <GraduationCap className="h-3 w-3" />
            {c.education}
          </p>
        )}
        <p>{c.status}</p>
      </div>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
          {c.unlocked ? (
            <>
              <ShieldCheck className="h-3 w-3 text-success" />
              Unlocked
            </>
          ) : (
            <>
              <Lock className="h-3 w-3" />
              Contact details locked
            </>
          )}
        </span>
        <div className="flex items-center gap-1.5">
          {boardStage !== "Shortlisted" && (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-2 text-xs"
              onClick={() => onStageChange("Shortlisted")}
            >
              Shortlist
            </Button>
          )}
          <Button size="sm" variant={c.unlocked ? "default" : "outline"} onClick={onOpen}>
            {actionLabel}
          </Button>
        </div>
      </div>
    </li>
  );
}

export function EmployerFindTalent({ searchParams, contact, onNavigate, onToast }: Props) {
  const [section, setSection] = useState<Section>("home");
  const [viewMode, setViewMode] = useState<"cards" | "kanban">("cards");
  const [overview, setOverview] = useState<TalentOverview | null>(null);
  const [overviewError, setOverviewError] = useState<string | null>(null);
  const [result, setResult] = useState<TalentSearch | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [skill, setSkill] = useState("");
  const [minExp, setMinExp] = useState("");
  const [recharge, setRecharge] = useState(searchParams.get("recharge") === "1");
  const [profile, setProfile] = useState<{ candidate: TalentCandidate; data: CandidateFullProfile } | null>(null);
  const [paywall, setPaywall] = useState<TalentCandidate | null>(null);
  const [buying, setBuying] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [boardStages, setBoardStages] = useState<Record<string, TalentBoardCol>>({});
  const [draggedCandidateId, setDraggedCandidateId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<TalentBoardCol | null>(null);
  const confirmVerifiedRef = useRef<HTMLDialogElement | null>(null);

  const loadOverview = useCallback(async () => {
    setOverviewError(null);
    try {
      setOverview(await getTalentOverview());
    } catch (e) {
      setOverviewError(e instanceof Error ? e.message : "Could not load Find Talent.");
    }
  }, []);

  useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

  const verifiedOnly = section === "verified";
  const loadCandidates = useCallback(async () => {
    if (section === "home") return;
    setLoading(true);
    setError(null);
    try {
      setResult(
        await searchCandidates({
          query,
          skill,
          minExp: minExp ? Number(minExp) : null,
          verified: verifiedOnly,
          limit: 30,
        })
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load candidates.");
    } finally {
      setLoading(false);
    }
  }, [section, verifiedOnly, query, skill, minExp]);

  useEffect(() => {
    const t = setTimeout(() => void loadCandidates(), 250);
    return () => clearTimeout(t);
  }, [loadCandidates]);

  const openProfile = async (c: TalentCandidate) => {
    try {
      setProfile({ candidate: c, data: await getCandidateProfile(c.id) });
    } catch (e) {
      if (isPaymentRequired(e)) setPaywall(c);
      else onToast(e instanceof Error ? e.message : "Could not open this profile.");
    }
  };

  const refreshAfterUnlock = async () => {
    await Promise.all([loadOverview(), loadCandidates()]);
  };

  const subscribe = async (key: string) => {
    setBuying(key);
    try {
      await purchaseTalentPackage(key);
      onToast("Subscription activated.");
      await refreshAfterUnlock();
    } catch (e) {
      onToast(e instanceof Error ? e.message : "Purchase failed.");
      void loadOverview();
    } finally {
      setBuying(null);
    }
  };

  const downloadCv = async (data: CandidateFullProfile) => {
    try {
      const { resume_path: path, resume_url: url } = data.profile;
      if (path) {
        const { data: signed, error: err } = await supabase.storage.from("resumes").createSignedUrl(path, 120);
        if (err || !signed?.signedUrl) throw new Error("Could not open the CV.");
        window.open(signed.signedUrl, "_blank", "noopener");
      } else if (url) window.open(url, "_blank", "noopener");
      else onToast("This candidate has not uploaded a CV.");
    } catch (e) {
      onToast(e instanceof Error ? e.message : "Could not download the CV.");
    }
  };

  const downloadCir = async (candidateId: string) => {
    try {
      await downloadCirPdf(await getCandidateCir(candidateId));
      onToast("CIR report downloaded.");
    } catch (e) {
      onToast(e instanceof Error ? e.message : "Could not download the report.");
    }
  };

  const toggleSaveCandidate = (c: TalentCandidate) => {
    setSavedIds((prev) => {
      const exists = prev.includes(c.id);
      const next = exists ? prev.filter((id) => id !== c.id) : [...prev, c.id];
      onToast(exists ? `Removed ${c.display_name} from saved pool.` : `Saved ${c.display_name} to HR shortlist.`);
      return next;
    });
  };

  const getCandidateBoardCol = (c: TalentCandidate): TalentBoardCol => {
    if (boardStages[c.id]) return boardStages[c.id];
    if (savedIds.includes(c.id)) return "Saved";
    return "Discovered";
  };

  const moveCandidateBoardCol = (c: TalentCandidate, stage: TalentBoardCol) => {
    setBoardStages((prev) => ({ ...prev, [c.id]: stage }));
    if (stage === "Saved" && !savedIds.includes(c.id)) {
      setSavedIds((prev) => [...prev, c.id]);
    }
    onToast(`Moved ${c.display_name} to ${stage}.`);
  };

  if (overviewError)
    return (
      <div className="employer-workspace">
        <ErrorState message={overviewError} onRetry={loadOverview} />
      </div>
    );
  if (!overview)
    return (
      <div className="employer-workspace">
        <Loading label="Loading Find Talent" />
      </div>
    );

  const balance = overview.wallet.balance;
  const sub = overview.subscription;
  const verifiedPackages = overview.packages.filter((p) => p.verified_only);
  const cheapest = Math.min(...verifiedPackages.map((p) => p.price_inr), Infinity);
  const hasVerifiedAccess = Boolean(sub) || overview.unlocked_count > 0;

  const walletBar = (
    <div className="workspace-panel flex flex-wrap items-center gap-4 !p-4">
      <span className="workspace-icon">
        <Wallet size={18} />
      </span>
      <div className="mr-auto">
        <p className="text-xs text-muted-foreground">Company wallet</p>
        <p className="text-lg font-bold">{inr(balance)}</p>
      </div>
      {sub && (
        <span className="workspace-chip">
          <Crown className="h-3 w-3" />
          Subscription until {new Date(sub.expires_at).toLocaleDateString("en-GB")}
        </span>
      )}
      <Button size="sm" variant="outline" onClick={() => setRecharge((v) => !v)}>
        Recharge wallet
      </Button>
      <Button size="sm" variant="ghost" onClick={() => onNavigate("pipe")}>
        Open Pipeline
      </Button>
    </div>
  );

  const rechargePanel = recharge && (
    <WalletRecharge
      contact={contact}
      onToast={onToast}
      onDone={() => {
        setRecharge(false);
        void loadOverview();
      }}
    />
  );

  if (section === "home") {
    return (
      <div className="employer-workspace space-y-5">
        <PageHeader
          eyebrow="Find talent"
          icon={<Users size={13} />}
          title="Find talent"
          description="Discover candidates for your team. Browse for free, match skills to active roles, or unlock verified profiles with full details and CIR reports."
        />
        {walletBar}
        {rechargePanel}
        <div className="grid gap-5 md:grid-cols-2">
          <article className="workspace-panel flex flex-col gap-4">
            <span className="workspace-icon">
              <Users size={20} />
            </span>
            <div>
              <h2 className="text-lg font-bold">Candidates</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Browse public profiles with a limited overview: name, headline, skills, experience and education summary.
              </p>
            </div>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>• Free to browse with HR Cards &amp; Sourcing Kanban board</li>
              <li>• Contact details, CV and CIR report stay locked</li>
              <li>• Unlock a single profile for {inr(overview.packages.find((p) => !p.verified_only)?.price_inr ?? 99)}</li>
            </ul>
            <Button className="mt-auto self-start" onClick={() => setSection("candidates")}>
              Browse candidates
            </Button>
          </article>
          <article className="workspace-panel flex flex-col gap-4 !border-primary/40">
            <span className="workspace-icon">
              <BadgeCheck size={20} />
            </span>
            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold">
                Verified candidates{" "}
                <span className="workspace-chip">
                  <Crown className="h-3 w-3" />
                  Premium
                </span>
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Candidates verified through proctored assessments, with complete profiles, CIR reports and CV downloads.
              </p>
            </div>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>• Full profile and contact details</li>
              <li>• CIR report with skill breakdown and integrity score</li>
              <li>• From {Number.isFinite(cheapest) ? inr(cheapest) : "—"} · paid from your company wallet</li>
            </ul>
            <Button className="mt-auto self-start" onClick={() => setSection("verified")}>
              <Lock className="mr-1.5 h-4 w-4" />
              {hasVerifiedAccess ? "Open verified candidates" : "Unlock verified candidates"}
            </Button>
          </article>
        </div>
      </div>
    );
  }

  const locked = verifiedOnly && !hasVerifiedAccess;
  const activeFilterCount = (skill.trim() ? 1 : 0) + (minExp ? 1 : 0);

  return (
    <div className="employer-workspace space-y-5">
      <PageHeader
        eyebrow={verifiedOnly ? "Verified candidates" : "Candidates"}
        icon={verifiedOnly ? <BadgeCheck size={13} /> : <Users size={13} />}
        title={verifiedOnly ? "Verified candidates" : "Browse candidates"}
        description={
          verifiedOnly
            ? "Premium access to proctored, verified talent with role match scoring and Kanban workflow."
            : "A limited overview of public candidate profiles with role match scoring and Kanban workflow."
        }
        actions={
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-lg border border-border bg-card p-1">
              <Button
                size="sm"
                variant={viewMode === "cards" ? "default" : "ghost"}
                onClick={() => setViewMode("cards")}
              >
                <LayoutGrid className="mr-1.5 h-3.5 w-3.5" />
                Cards
              </Button>
              <Button
                size="sm"
                variant={viewMode === "kanban" ? "default" : "ghost"}
                onClick={() => setViewMode("kanban")}
              >
                <Kanban className="mr-1.5 h-3.5 w-3.5" />
                Kanban Board
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={() => setSection("home")}>
              All options
            </Button>
          </div>
        }
      />
      {walletBar}
      {rechargePanel}

      {/* Top Tier Switcher Bento Strip inside Browse View */}
      <div className="grid gap-3.5 md:grid-cols-2" aria-label="Candidate pool switcher">
        <button
          type="button"
          data-selected={section === "candidates"}
          onClick={() => setSection("candidates")}
          className="workspace-tier-card"
        >
          <div className="flex items-center justify-between gap-2 w-full">
            <span className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Users className="h-4 w-4 text-primary" />
              Standard Candidates Pool
            </span>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-bold">Free</span>
          </div>
          <span className="text-[11px] text-muted-foreground">
            Browse public candidate summaries with role match scores at zero wallet cost.
          </span>
        </button>

        <button
          type="button"
          data-selected={section === "verified"}
          onClick={() => {
            if (section === "verified" || hasVerifiedAccess || balance < cheapest) {
              setSection("verified");
              return;
            }
            const dlg = confirmVerifiedRef.current;
            if (dlg && !dlg.open) dlg.showModal();
          }}
          className="workspace-tier-card"
        >
          <div className="flex items-center justify-between gap-2 w-full">
            <span className="flex items-center gap-2 text-sm font-bold text-foreground">
              <BadgeCheck className="h-4 w-4 text-primary" />
              Verified Candidates Pool
            </span>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
              {hasVerifiedAccess
                ? "Unlocked"
                : Number.isFinite(cheapest)
                  ? `From ${inr(cheapest)}`
                  : "Wallet Pass"}
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground">
            Proctored CIR scorecards, verified identity &amp; downloadable CVs paid from Company Wallet.
          </span>
        </button>
      </div>

      <dialog
        ref={confirmVerifiedRef}
        className="workspace-native-dialog"
        aria-labelledby="live-verify-wallet-title"
      >
        <div className="p-5 space-y-4">
          <h2 id="live-verify-wallet-title" className="text-base font-bold text-foreground">
            Are you sure you want to unlock Verified Candidates?
          </h2>
          <p className="text-xs text-muted-foreground">
            Unlocking the Verified Candidates subscription deducts{" "}
            <strong>{Number.isFinite(cheapest) ? inr(cheapest) : "the package fee"}</strong> from your Company Wallet ({inr(balance)} available).
          </p>
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              autoFocus
              onClick={() => confirmVerifiedRef.current?.close("")}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                confirmVerifiedRef.current?.close("confirm");
                setSection("verified");
                const subPkg = verifiedPackages.find((p) => p.scope === "subscription");
                if (subPkg && balance >= subPkg.price_inr) {
                  void subscribe(subPkg.key);
                }
              }}
            >
              Yes, Deduct &amp; Unlock
            </Button>
          </div>
        </div>
      </dialog>

      {locked && (
        <section className="workspace-panel space-y-4 !border-primary/40" aria-label="Premium access required">
          <div className="flex items-start gap-3">
            <span className="workspace-icon">
              <Lock size={18} />
            </span>
            <div>
              <h2 className="text-base font-bold">Verified candidates are a premium feature</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {balance >= cheapest
                  ? "Choose a package below. It is paid from your company wallet and unlocks immediately."
                  : `Your wallet balance (${inr(balance)}) is below the lowest verified package (${inr(cheapest)}). Recharge your wallet to continue.`}
              </p>
            </div>
          </div>
          {balance < cheapest && !recharge && (
            <Button onClick={() => setRecharge(true)}>
              <Wallet className="mr-1.5 h-4 w-4" />
              Recharge wallet
            </Button>
          )}
          <ul className="grid gap-4 md:grid-cols-2" aria-label="Verified candidate packages">
            {verifiedPackages.map((p) => (
              <li key={p.key} className="rounded-lg border border-border p-4">
                <p className="text-sm font-bold">{p.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{p.description}</p>
                <p className="mt-3 text-xl font-bold">
                  {inr(p.price_inr)}
                  <span className="ml-1 text-xs font-normal text-muted-foreground">
                    {p.scope === "subscription" ? `/ ${p.duration_days} days` : "/ candidate"}
                  </span>
                </p>
                {p.scope === "subscription" ? (
                  <Button
                    className="mt-3"
                    size="sm"
                    disabled={buying === p.key || !overview.can_unlock || balance < p.price_inr}
                    onClick={() => void subscribe(p.key)}
                  >
                    {balance < p.price_inr ? `Recharge ${inr(p.price_inr - balance)} more` : `Subscribe for ${inr(p.price_inr)}`}
                  </Button>
                ) : (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Select a candidate below to unlock one verified profile.
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="workspace-panel !p-3">
        <div className="flex items-center gap-2.5">
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              aria-label="Search candidates"
              className="pl-9 h-10"
              placeholder="Search headline, role or city..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Open talent filters"
                title="Filters"
                className="relative h-10 w-10 shrink-0"
              >
                <SlidersHorizontal className="h-4 w-4" />
                {activeFilterCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 space-y-4 p-4">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <p className="text-sm font-bold text-foreground">Filter Candidates</p>
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSkill("");
                      setMinExp("");
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    <RotateCcw className="h-3 w-3" /> Reset
                  </button>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Skill</label>
                <Input
                  aria-label="Filter by skill"
                  placeholder="Skill, e.g. React"
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Minimum Experience</label>
                <select
                  aria-label="Minimum experience"
                  value={minExp}
                  onChange={(e) => setMinExp(e.target.value)}
                  className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                >
                  <option value="">Any experience</option>
                  <option value="1">1+ years</option>
                  <option value="3">3+ years</option>
                  <option value="5">5+ years</option>
                  <option value="8">8+ years</option>
                </select>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {loading && !result ? (
        <Loading label="Loading candidates" />
      ) : error ? (
        <ErrorState message={error} onRetry={loadCandidates} />
      ) : !result || result.items.length === 0 ? (
        <div className="workspace-panel">
          <EmptyState
            icon={<Sparkles />}
            title="No candidates found"
            hint="Try removing a filter or searching for a different skill."
          />
        </div>
      ) : viewMode === "cards" ? (
        <>
          <p className="text-xs text-muted-foreground">
            {result.total} candidate{result.total === 1 ? "" : "s"}
          </p>
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {result.items.map((c) => (
              <CandidateCard
                key={c.id}
                c={c}
                matchScore={computeCandidateMatchScore(c, skill)}
                saved={savedIds.includes(c.id)}
                boardStage={getCandidateBoardCol(c)}
                onToggleSave={() => toggleSaveCandidate(c)}
                onStageChange={(st) => moveCandidateBoardCol(c, st)}
                actionLabel={
                  c.unlocked || (sub && c.verified) ? "View profile" : c.verified ? "Unlock verified" : "Unlock profile"
                }
                onOpen={() => (c.unlocked || (sub && c.verified) ? void openProfile(c) : setPaywall(c))}
              />
            ))}
          </ul>
        </>
      ) : (
        <div className="workspace-board">
          {BOARD_COLS.map((col) => {
            const colItems = result.items.filter((c) => getCandidateBoardCol(c) === col.id);
            const isDropTarget = dragOverCol === col.id;
            return (
              <div
                key={col.id}
                data-stage-theme={col.theme}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  if (dragOverCol !== col.id) setDragOverCol(col.id);
                }}
                onDragLeave={() => {
                  if (dragOverCol === col.id) setDragOverCol(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const id = e.dataTransfer.getData("text/plain") || draggedCandidateId;
                  setDragOverCol(null);
                  setDraggedCandidateId(null);
                  const found = result.items.find((x) => x.id === id);
                  if (found) moveCandidateBoardCol(found, col.id);
                }}
                className={`workspace-column ${isDropTarget ? "workspace-column-drop-active" : ""}`}
              >
                <div className="workspace-column-header">
                  <div className="flex items-start gap-2.5">
                    <span className="workspace-icon !h-7 !w-7 !rounded-md">
                      <Target size={14} />
                    </span>
                    <div>
                      <p className="workspace-stage-title text-xs font-bold leading-tight">{col.label}</p>
                      <p className="text-[11px] text-muted-foreground">{col.hint}</p>
                    </div>
                  </div>
                  <span className="workspace-stage-count">{colItems.length}</span>
                </div>
                <div className="workspace-column-cards">
                  {colItems.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border/80 px-3 py-8 text-center">
                      <p className="text-xs font-medium text-muted-foreground">Drag candidates here</p>
                    </div>
                  ) : (
                    colItems.map((c) => {
                      const matchScore = computeCandidateMatchScore(c, skill);
                      return (
                        <div
                          key={c.id}
                          draggable
                          onDragStart={(e) => {
                            setDraggedCandidateId(c.id);
                            e.dataTransfer.effectAllowed = "move";
                            e.dataTransfer.setData("text/plain", c.id);
                          }}
                          onDragEnd={() => {
                            setDraggedCandidateId(null);
                            setDragOverCol(null);
                          }}
                          className="workspace-applicant-card cursor-grab active:cursor-grabbing space-y-2.5"
                        >
                          <div className="flex items-start gap-2.5">
                            <Avatar name={c.display_name} src={c.photo_url} size={36} />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1">
                                <p className="truncate text-xs font-bold">{c.display_name}</p>
                                <GripVertical className="h-3.5 w-3.5 text-muted-foreground/60" />
                              </div>
                              <p className="truncate text-[11px] text-muted-foreground">
                                {c.headline || c.job_role || "Professional"}
                              </p>
                              <div className="mt-1 flex items-center gap-1.5">
                                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                                  {matchScore}% match
                                </span>
                                {c.verified && (
                                  <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-success">
                                    <CheckCircle2 className="h-3 w-3" /> Verified
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between gap-2 border-t border-border pt-2">
                            <span className="text-[10px] text-muted-foreground">
                              {c.years_of_experience ?? 0} yrs · {c.city || "India"}
                            </span>
                            <Button
                              size="sm"
                              variant={c.unlocked ? "default" : "outline"}
                              className="h-7 px-2.5 text-[11px]"
                              onClick={() => (c.unlocked || (sub && c.verified) ? void openProfile(c) : setPaywall(c))}
                            >
                              {c.unlocked || (sub && c.verified)
                                ? "View profile"
                                : c.verified
                                  ? "Unlock verified"
                                  : "Unlock profile"}
                            </Button>
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
      )}

      <Dialog
        open={Boolean(profile)}
        onOpenChange={(o) => {
          if (!o) setProfile(null);
        }}
      >
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
          {profile && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {profile.data.profile.name}
                  {profile.data.profile.verified && <BadgeCheck className="h-5 w-5 text-primary" />}
                </DialogTitle>
                <DialogDescription>
                  {profile.data.profile.headline} · {profile.data.profile.city} · Talent CIR ID{" "}
                  {profile.data.profile.talent_cir_id}
                </DialogDescription>
              </DialogHeader>
              <div className="employer-workspace space-y-5 text-sm">
                <dl className="grid gap-3 text-xs sm:grid-cols-2">
                  <div>
                    <dt className="text-muted-foreground">Email</dt>
                    <dd className="break-all font-semibold">{profile.data.profile.email}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Phone</dt>
                    <dd className="font-semibold">{profile.data.profile.phone || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Experience</dt>
                    <dd className="font-semibold">{profile.data.profile.years_of_experience ?? 0} years</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Notice period</dt>
                    <dd className="font-semibold">{profile.data.profile.notice_period || "—"}</dd>
                  </div>
                </dl>
                {profile.data.profile.about && (
                  <p className="whitespace-pre-line text-muted-foreground">{profile.data.profile.about}</p>
                )}
                <section>
                  <h3 className="text-sm font-bold">Skills</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {profile.data.skills.map((s) => (
                      <span key={s.name} className="workspace-chip">
                        {s.name}
                        {s.verified ? " ✓" : ""}
                      </span>
                    ))}
                  </div>
                </section>
                <section>
                  <h3 className="text-sm font-bold">Experience</h3>
                  <ul className="mt-2 space-y-2">
                    {profile.data.experience.length ? (
                      profile.data.experience.map((x, i) => (
                        <li key={i}>
                          <p className="font-semibold">
                            {x.title} · {x.company}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {x.start ?? ""} – {x.current ? "Present" : (x.end ?? "")}
                          </p>
                        </li>
                      ))
                    ) : (
                      <li className="text-muted-foreground">No experience listed.</li>
                    )}
                  </ul>
                </section>
                <section>
                  <h3 className="text-sm font-bold">Education</h3>
                  <ul className="mt-2 space-y-2">
                    {profile.data.education.length ? (
                      profile.data.education.map((x, i) => (
                        <li key={i}>
                          <p className="font-semibold">
                            {x.degree} {x.field ? `in ${x.field}` : ""}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {x.institution} {x.end ? `· ${x.end}` : ""}
                          </p>
                        </li>
                      ))
                    ) : (
                      <li className="text-muted-foreground">No education listed.</li>
                    )}
                  </ul>
                </section>
                <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                  {profile.data.access.cv && (
                    <Button variant="outline" onClick={() => void downloadCv(profile.data)}>
                      <Download className="mr-1.5 h-4 w-4" />
                      Download CV
                    </Button>
                  )}
                  {profile.data.access.cir ? (
                    <Button onClick={() => void downloadCir(profile.candidate.id)}>
                      <FileText className="mr-1.5 h-4 w-4" />
                      Download CIR report
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setProfile(null);
                        setPaywall(profile.candidate);
                      }}
                    >
                      <Crown className="mr-1.5 h-4 w-4" />
                      Unlock CIR report
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => {
                      moveCandidateBoardCol(profile.candidate, "Shortlisted");
                      setProfile(null);
                    }}
                  >
                    <Send className="mr-1.5 h-4 w-4" />
                    Shortlist Candidate
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <TalentPaywall
        open={Boolean(paywall)}
        onClose={() => setPaywall(null)}
        candidate={paywall ? { id: paywall.id, name: paywall.display_name, verified: paywall.verified } : null}
        reason="profile"
        contact={contact}
        onToast={onToast}
        onUnlocked={() => {
          const c = paywall;
          void refreshAfterUnlock().then(() => {
            if (c) void openProfile({ ...c, unlocked: true });
          });
        }}
      />
    </div>
  );
}
