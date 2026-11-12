import { useCallback, useEffect, useMemo, useState } from "react";
import { BadgeCheck, CheckCircle2, FileDown, FileText, Loader2, ShieldCheck, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createOrder, payWithRazorpay } from "@/services/candidate/wallet";
import { getTalentOverview, inr, purchaseTalentPackage, type TalentOverview, type TalentPackage } from "@/services/employer/talent";
import { ErrorState, Loading } from "./employerUi";

const PRESETS = [1000, 2500, 5000, 10000];

interface RechargeProps {
  /** Suggested amount, e.g. the shortfall for the selected package. */
  suggested?: number;
  contact?: { name?: string; email?: string };
  onDone: () => void;
  onToast: (message: string) => void;
}

/** Company wallet top-up through the existing order + Razorpay flow; credited to the tenant wallet on the server. */
export function WalletRecharge({ suggested, contact, onDone, onToast }: RechargeProps) {
  const [amount, setAmount] = useState<number>(Math.max(100, Math.ceil((suggested ?? 1000) / 100) * 100));
  const [busy, setBusy] = useState(false);

  const pay = async () => {
    if (!Number.isFinite(amount) || amount < 100 || amount > 100000) return onToast("Enter an amount between ₹100 and ₹1,00,000.");
    setBusy(true);
    try {
      const order = await createOrder({ itemType: "wallet_topup", amount, gateway: "razorpay" });
      await payWithRazorpay(order, contact);
      onToast(`Wallet recharged with ${inr(amount)}.`);
      onDone();
    } catch (e) {
      onToast(e instanceof Error ? e.message : "Payment could not be completed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4">
      <p className="flex items-center gap-2 text-sm font-semibold"><Wallet className="h-4 w-4 text-primary" />Recharge company wallet</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <Button key={p} type="button" size="sm" variant={amount === p ? "default" : "outline"} onClick={() => setAmount(p)}>{inr(p)}</Button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-end gap-3">
        <label className="workspace-field max-w-[200px]"><span>Amount (₹)</span>
          <Input type="number" min={100} max={100000} step={100} value={amount} onChange={(e) => setAmount(Number(e.target.value))} aria-label="Recharge amount" /></label>
        <Button type="button" disabled={busy} onClick={() => void pay()}>
          {busy ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Wallet className="mr-1.5 h-4 w-4" />}Pay {inr(amount || 0)}
        </Button>
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">Payments are processed securely. The wallet is credited only after the payment is verified on our servers.</p>
    </div>
  );
}

interface Props {
  open: boolean;
  onClose: () => void;
  candidate: { id: string; name: string; verified: boolean } | null;
  reason: "profile" | "cir" | "cv";
  contact?: { name?: string; email?: string };
  onUnlocked: () => void;
  onToast: (message: string) => void;
}

const REASON_COPY: Record<Props["reason"], string> = {
  profile: "Unlock the complete profile and contact details.",
  cir: "Unlock the full CIR report.",
  cv: "Unlock the CV download.",
};

export function TalentPaywall({ open, onClose, candidate, reason, contact, onUnlocked, onToast }: Props) {
  const [overview, setOverview] = useState<TalentOverview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [buying, setBuying] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setOverview(await getTalentOverview());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load packages.");
    }
  }, []);

  useEffect(() => { if (open) { setOverview(null); setSelected(null); void load(); } }, [open, load]);

  const packages = useMemo(() => {
    if (!overview || !candidate) return [];
    return overview.packages.filter((p) => p.verified_only === candidate.verified && (reason === "cir" ? p.grants_cir : reason === "cv" ? p.grants_cv || !p.verified_only : true));
  }, [overview, candidate, reason]);

  const buy = async (pkg: TalentPackage) => {
    if (!candidate) return;
    setBuying(pkg.key);
    try {
      await purchaseTalentPackage(pkg.key, pkg.scope === "per_profile" ? candidate.id : null);
      onToast(`${pkg.name} unlocked.`);
      onUnlocked();
      onClose();
    } catch (e) {
      onToast(e instanceof Error ? e.message : "Purchase failed.");
      void load();
    } finally {
      setBuying(null);
    }
  };

  const balance = overview?.wallet.balance ?? 0;
  const picked = packages.find((p) => p.key === selected) ?? null;
  const shortfall = picked ? Math.max(0, picked.price_inr - balance) : 0;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o && !buying) onClose(); }}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" />Premium access{candidate ? ` · ${candidate.name}` : ""}</DialogTitle>
          <DialogDescription>
            {REASON_COPY[reason]} {candidate?.verified ? "This candidate is verified through proctored assessments." : "This candidate has not completed verification."}
          </DialogDescription>
        </DialogHeader>

        {error ? <ErrorState message={error} onRetry={load} /> : !overview ? <Loading label="Checking your wallet and plan" /> : (
          <div className="employer-workspace space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <span className="flex items-center gap-2 text-xs text-muted-foreground"><Wallet className="h-4 w-4" />Wallet balance</span>
              <strong className="text-lg">{inr(balance)}</strong>
            </div>
            {overview.subscription && (
              <p className="rounded-md bg-success/10 p-3 text-xs text-success">Subscription active until {new Date(overview.subscription.expires_at).toLocaleDateString("en-GB")}.</p>
            )}
            {!overview.can_unlock ? (
              <p className="rounded-md border border-border p-3 text-xs text-muted-foreground">Your role cannot purchase access. Ask a company owner or recruiter to unlock this candidate.</p>
            ) : packages.length === 0 ? (
              <p className="text-xs text-muted-foreground">No package is available for this candidate right now.</p>
            ) : (
              <ul className="space-y-3" aria-label="Available packages">
                {packages.map((p) => {
                  const short = Math.max(0, p.price_inr - balance);
                  return (
                    <li key={p.key} className={`rounded-lg border p-4 ${selected === p.key ? "border-primary" : "border-border"}`}>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="flex items-center gap-2 text-sm font-bold">{p.verified_only && <BadgeCheck className="h-4 w-4 text-primary" />}{p.name}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{p.description}</p>
                          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                            <li className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-success" />Full profile</li>
                            {p.grants_cv && <li className="flex items-center gap-1"><FileDown className="h-3 w-3 text-success" />CV download</li>}
                            {p.grants_cir && <li className="flex items-center gap-1"><FileText className="h-3 w-3 text-success" />CIR report</li>}
                          </ul>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">{inr(p.price_inr)}</p>
                          <p className="text-[11px] text-muted-foreground">{p.scope === "subscription" ? `for ${p.duration_days} days` : "one candidate"}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-end">
                        {short === 0 ? (
                          <Button size="sm" disabled={Boolean(buying)} onClick={() => void buy(p)}>
                            {buying === p.key ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : null}Pay {inr(p.price_inr)} from wallet
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => setSelected(p.key)}>Recharge {inr(short)} more to buy</Button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            {picked && shortfall > 0 && (
              <WalletRecharge key={picked.key} suggested={shortfall} contact={contact} onToast={onToast} onDone={() => void load()} />
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
