import { useCallback, useEffect, useState } from "react";
import {
  BadgeCheck, Crown, Download, FileText, GraduationCap, Lock, MapPin, Search, ShieldCheck, Sparkles, Users, Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { downloadCirPdf } from "@/lib/cirPdf";
import {
  getCandidateCir, getCandidateProfile, getTalentOverview, inr, isPaymentRequired, purchaseTalentPackage, searchCandidates,
  type CandidateFullProfile, type TalentCandidate, type TalentOverview, type TalentSearch,
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

function CandidateCard({ c, onOpen, actionLabel }: { c: TalentCandidate; onOpen: () => void; actionLabel: string }) {
  return (
    <li className="workspace-panel flex flex-col gap-3 !p-4">
      <div className="flex items-start gap-3">
        <Avatar name={c.display_name} src={c.photo_url} size={44} />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-sm font-bold">
            <span className="truncate">{c.display_name}</span>
            {c.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-primary" aria-label="Verified candidate" />}
          </p>
          <p className="truncate text-xs text-muted-foreground">{c.headline || c.job_role || "Professional"}</p>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 text-[11px] text-muted-foreground">
            {c.city && <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{c.city}</span>}
            <span>{c.years_of_experience ?? 0} yrs</span>
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {c.skills.slice(0, 5).map((s) => <span key={s} className="workspace-chip !px-2 !py-0.5 !text-[10px]">{s}</span>)}
      </div>
      <div className="space-y-1 text-[11px] text-muted-foreground">
        {c.education && <p className="flex items-center gap-1.5"><GraduationCap className="h-3 w-3" />{c.education}</p>}
        <p>{c.status}</p>
      </div>
      <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3">
        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
          {c.unlocked ? <><ShieldCheck className="h-3 w-3 text-success" />Unlocked</> : <><Lock className="h-3 w-3" />Contact details locked</>}
        </span>
        <Button size="sm" variant={c.unlocked ? "default" : "outline"} onClick={onOpen}>{actionLabel}</Button>
      </div>
    </li>
  );
}

export function EmployerFindTalent({ searchParams, contact, onNavigate, onToast }: Props) {
  const [section, setSection] = useState<Section>("home");
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

  const loadOverview = useCallback(async () => {
    setOverviewError(null);
    try {
      setOverview(await getTalentOverview());
    } catch (e) {
      setOverviewError(e instanceof Error ? e.message : "Could not load Find Talent.");
    }
  }, []);

  useEffect(() => { void loadOverview(); }, [loadOverview]);

  const verifiedOnly = section === "verified";
  const loadCandidates = useCallback(async () => {
    if (section === "home") return;
    setLoading(true);
    setError(null);
    try {
      setResult(await searchCandidates({ query, skill, minExp: minExp ? Number(minExp) : null, verified: verifiedOnly, limit: 30 }));
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

  if (overviewError) return <div className="employer-workspace"><ErrorState message={overviewError} onRetry={loadOverview} /></div>;
  if (!overview) return <div className="employer-workspace"><Loading label="Loading Find Talent" /></div>;

  const balance = overview.wallet.balance;
  const sub = overview.subscription;
  const verifiedPackages = overview.packages.filter((p) => p.verified_only);
  const cheapest = Math.min(...verifiedPackages.map((p) => p.price_inr), Infinity);
  const hasVerifiedAccess = Boolean(sub) || overview.unlocked_count > 0;

  const walletBar = (
    <div className="workspace-panel flex flex-wrap items-center gap-4 !p-4">
      <span className="workspace-icon"><Wallet size={18} /></span>
      <div className="mr-auto">
        <p className="text-xs text-muted-foreground">Company wallet</p>
        <p className="text-lg font-bold">{inr(balance)}</p>
      </div>
      {sub && <span className="workspace-chip"><Crown className="h-3 w-3" />Subscription until {new Date(sub.expires_at).toLocaleDateString("en-GB")}</span>}
      <Button size="sm" variant="outline" onClick={() => setRecharge((v) => !v)}>Recharge wallet</Button>
    </div>
  );

  const rechargePanel = recharge && (
    <WalletRecharge contact={contact} onToast={onToast} onDone={() => { setRecharge(false); void loadOverview(); }} />
  );

  if (section === "home") {
    return (
      <div className="employer-workspace space-y-5">
        <PageHeader eyebrow="Find talent" icon={<Users size={13} />} title="Find talent" description="Discover candidates for your team. Browse for free, or unlock verified profiles with full details and CIR reports." />
        {walletBar}
        {rechargePanel}
        <div className="grid gap-5 md:grid-cols-2">
          <article className="workspace-panel flex flex-col gap-4">
            <span className="workspace-icon"><Users size={20} /></span>
            <div>
              <h2 className="text-lg font-bold">Candidates</h2>
              <p className="mt-1 text-sm text-muted-foreground">Browse public profiles with a limited overview: name, headline, skills, experience and education summary.</p>
            </div>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>• Free to browse</li>
              <li>• Contact details, CV and CIR report stay locked</li>
              <li>• Unlock a single profile for {inr(overview.packages.find((p) => !p.verified_only)?.price_inr ?? 99)}</li>
            </ul>
            <Button className="mt-auto self-start" onClick={() => setSection("candidates")}>Browse candidates</Button>
          </article>
          <article className="workspace-panel flex flex-col gap-4 !border-primary/40">
            <span className="workspace-icon"><BadgeCheck size={20} /></span>
            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold">Verified candidates <span className="workspace-chip"><Crown className="h-3 w-3" />Premium</span></h2>
              <p className="mt-1 text-sm text-muted-foreground">Candidates verified through proctored assessments, with complete profiles, CIR reports and CV downloads.</p>
            </div>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>• Full profile and contact details</li>
              <li>• CIR report with skill breakdown and integrity score</li>
              <li>• From {Number.isFinite(cheapest) ? inr(cheapest) : "—"} · paid from your company wallet</li>
            </ul>
            <Button className="mt-auto self-start" onClick={() => setSection("verified")}><Lock className="mr-1.5 h-4 w-4" />{hasVerifiedAccess ? "Open verified candidates" : "Unlock verified candidates"}</Button>
          </article>
        </div>
      </div>
    );
  }

  const locked = verifiedOnly && !hasVerifiedAccess;

  return (
    <div className="employer-workspace space-y-5">
      <PageHeader
        eyebrow={verifiedOnly ? "Verified candidates" : "Candidates"}
        icon={verifiedOnly ? <BadgeCheck size={13} /> : <Users size={13} />}
        title={verifiedOnly ? "Verified candidates" : "Browse candidates"}
        description={verifiedOnly ? "Premium access to proctored, verified talent." : "A limited overview of public candidate profiles."}
        actions={<Button variant="outline" size="sm" onClick={() => setSection("home")}>All options</Button>}
      />
      {walletBar}
      {rechargePanel}

      {locked && (
        <section className="workspace-panel space-y-4 !border-primary/40" aria-label="Premium access required">
          <div className="flex items-start gap-3">
            <span className="workspace-icon"><Lock size={18} /></span>
            <div>
              <h2 className="text-base font-bold">Verified candidates are a premium feature</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {balance >= cheapest
                  ? "Choose a package below. It is paid from your company wallet and unlocks immediately."
                  : `Your wallet balance (${inr(balance)}) is below the lowest verified package (${inr(cheapest)}). Recharge your wallet to continue.`}
              </p>
            </div>
          </div>
          {balance < cheapest && !recharge && <Button onClick={() => setRecharge(true)}><Wallet className="mr-1.5 h-4 w-4" />Recharge wallet</Button>}
          <ul className="grid gap-4 md:grid-cols-2" aria-label="Verified candidate packages">
            {verifiedPackages.map((p) => (
              <li key={p.key} className="rounded-lg border border-border p-4">
                <p className="text-sm font-bold">{p.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{p.description}</p>
                <p className="mt-3 text-xl font-bold">{inr(p.price_inr)}<span className="ml-1 text-xs font-normal text-muted-foreground">{p.scope === "subscription" ? `/ ${p.duration_days} days` : "/ candidate"}</span></p>
                {p.scope === "subscription" ? (
                  <Button className="mt-3" size="sm" disabled={buying === p.key || !overview.can_unlock || balance < p.price_inr} onClick={() => void subscribe(p.key)}>
                    {balance < p.price_inr ? `Recharge ${inr(p.price_inr - balance)} more` : `Subscribe for ${inr(p.price_inr)}`}
                  </Button>
                ) : (
                  <p className="mt-3 text-xs text-muted-foreground">Select a candidate below to unlock one verified profile.</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="workspace-panel !p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input aria-label="Search candidates" className="pl-9" placeholder="Search headline, role or city" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <Input aria-label="Filter by skill" className="!w-[170px]" placeholder="Skill, e.g. React" value={skill} onChange={(e) => setSkill(e.target.value)} />
          <select aria-label="Minimum experience" value={minExp} onChange={(e) => setMinExp(e.target.value)} className="!w-auto min-w-[150px]">
            <option value="">Any experience</option><option value="1">1+ years</option><option value="3">3+ years</option><option value="5">5+ years</option><option value="8">8+ years</option>
          </select>
        </div>
      </div>

      {loading && !result ? <Loading label="Loading candidates" /> : error ? <ErrorState message={error} onRetry={loadCandidates} /> : !result || result.items.length === 0 ? (
        <div className="workspace-panel"><EmptyState icon={<Sparkles />} title="No candidates found" hint="Try removing a filter or searching for a different skill." /></div>
      ) : (
        <>
          <p className="text-xs text-muted-foreground">{result.total} candidate{result.total === 1 ? "" : "s"}</p>
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {result.items.map((c) => (
              <CandidateCard
                key={c.id}
                c={c}
                actionLabel={c.unlocked || sub && c.verified ? "View profile" : c.verified ? "Unlock verified" : "Unlock profile"}
                onOpen={() => (c.unlocked || (sub && c.verified) ? void openProfile(c) : setPaywall(c))}
              />
            ))}
          </ul>
        </>
      )}

      <Dialog open={Boolean(profile)} onOpenChange={(o) => { if (!o) setProfile(null); }}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
          {profile && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">{profile.data.profile.name}{profile.data.profile.verified && <BadgeCheck className="h-5 w-5 text-primary" />}</DialogTitle>
                <DialogDescription>{profile.data.profile.headline} · {profile.data.profile.city} · Talent CIR ID {profile.data.profile.talent_cir_id}</DialogDescription>
              </DialogHeader>
              <div className="employer-workspace space-y-5 text-sm">
                <dl className="grid gap-3 text-xs sm:grid-cols-2">
                  <div><dt className="text-muted-foreground">Email</dt><dd className="break-all font-semibold">{profile.data.profile.email}</dd></div>
                  <div><dt className="text-muted-foreground">Phone</dt><dd className="font-semibold">{profile.data.profile.phone || "—"}</dd></div>
                  <div><dt className="text-muted-foreground">Experience</dt><dd className="font-semibold">{profile.data.profile.years_of_experience ?? 0} years</dd></div>
                  <div><dt className="text-muted-foreground">Notice period</dt><dd className="font-semibold">{profile.data.profile.notice_period || "—"}</dd></div>
                </dl>
                {profile.data.profile.about && <p className="whitespace-pre-line text-muted-foreground">{profile.data.profile.about}</p>}
                <section><h3 className="text-sm font-bold">Skills</h3><div className="mt-2 flex flex-wrap gap-2">{profile.data.skills.map((s) => <span key={s.name} className="workspace-chip">{s.name}{s.verified ? " ✓" : ""}</span>)}</div></section>
                <section><h3 className="text-sm font-bold">Experience</h3><ul className="mt-2 space-y-2">{profile.data.experience.length ? profile.data.experience.map((x, i) => <li key={i}><p className="font-semibold">{x.title} · {x.company}</p><p className="text-xs text-muted-foreground">{x.start ?? ""} – {x.current ? "Present" : x.end ?? ""}</p></li>) : <li className="text-muted-foreground">No experience listed.</li>}</ul></section>
                <section><h3 className="text-sm font-bold">Education</h3><ul className="mt-2 space-y-2">{profile.data.education.length ? profile.data.education.map((x, i) => <li key={i}><p className="font-semibold">{x.degree} {x.field ? `in ${x.field}` : ""}</p><p className="text-xs text-muted-foreground">{x.institution} {x.end ? `· ${x.end}` : ""}</p></li>) : <li className="text-muted-foreground">No education listed.</li>}</ul></section>
                <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                  {profile.data.access.cv && <Button variant="outline" onClick={() => void downloadCv(profile.data)}><Download className="mr-1.5 h-4 w-4" />Download CV</Button>}
                  {profile.data.access.cir ? (
                    <Button onClick={() => void downloadCir(profile.candidate.id)}><FileText className="mr-1.5 h-4 w-4" />Download CIR report</Button>
                  ) : (
                    <Button variant="outline" onClick={() => { setProfile(null); setPaywall(profile.candidate); }}><Crown className="mr-1.5 h-4 w-4" />Unlock CIR report</Button>
                  )}
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
        onUnlocked={() => { const c = paywall; void refreshAfterUnlock().then(() => { if (c) void openProfile({ ...c, unlocked: true }); }); }}
      />
    </div>
  );
}
