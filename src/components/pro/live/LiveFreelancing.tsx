import React, { useState } from "react";
import { Briefcase, Clock, Send, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ProHero } from "../ProHero";
import { useAsync } from "@/hooks/useAsync";
import {
  fetchGigs,
  fetchMyProposals,
  submitGigProposal,
  withdrawGigProposal,
  type Gig,
} from "@/services/candidate/platform";
import { backendErrorMessage } from "@/hooks/useCandidateBackend";

const inr = (n: number) => "₹" + Number(n).toLocaleString("en-IN");

export const LiveFreelancing: React.FC<{ onToast: (m: string) => void }> = ({ onToast }) => {
  const gigs = useAsync(fetchGigs);
  const proposals = useAsync(fetchMyProposals);

  const [activeGig, setActiveGig] = useState<Gig | null>(null);
  const [bid, setBid] = useState("");
  const [coverNote, setCoverNote] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const proposalFor = (gigId: string) => proposals.data?.find((p) => p.gig_id === gigId);

  const openProposalModal = (g: Gig) => {
    const existing = proposalFor(g.id);
    setActiveGig(g);
    setBid(existing ? String(existing.bid_amount) : String(Math.round((Number(g.budget_min) + Number(g.budget_max)) / 2)));
    setCoverNote(existing?.cover_note ?? "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGig) return;
    const numericBid = Number(bid);
    if (!Number.isFinite(numericBid) || numericBid <= 0) {
      onToast("Enter a valid bid amount in INR.");
      return;
    }
    if (coverNote.trim().length < 10) {
      onToast("Write at least 10 characters explaining your approach.");
      return;
    }
    setBusy(`sub-${activeGig.id}`);
    try {
      await submitGigProposal(activeGig.id, coverNote.trim(), numericBid);
      onToast(`Proposal submitted for "${activeGig.title}".`);
      setActiveGig(null);
      await proposals.reload();
    } catch (err) {
      onToast(backendErrorMessage(err));
    } finally {
      setBusy(null);
    }
  };

  const handleWithdraw = async (proposalId: string) => {
    setBusy(`wd-${proposalId}`);
    try {
      await withdrawGigProposal(proposalId);
      onToast("Proposal withdrawn.");
      await proposals.reload();
    } catch (err) {
      onToast(backendErrorMessage(err));
    } finally {
      setBusy(null);
    }
  };

  const activeProposals = (proposals.data ?? []).filter((p) => p.status !== "withdrawn");

  return (
    <div className="space-y-6">
      <ProHero
        icon={<Briefcase />}
        title="Verified Freelance Gigs"
        subtitle="Pitch directly on scoped client deliverables with milestone budgets. Your verified skills and CIR score travel with every proposal."
        aside={
          <div className="rounded-2xl bg-white/15 px-4 py-3 text-white text-xs">
            <p className="font-bold text-sm">{activeProposals.length} Active Proposals</p>
            <p className="text-white/80 mt-0.5">{gigs.data?.length ?? 0} open client projects</p>
          </div>
        }
      />

      {activeGig && (
        <form
          onSubmit={handleSubmit}
          method="post"
          className="rounded-2xl border-2 border-primary/30 bg-card p-5 space-y-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">Submit Proposal</p>
              <h2 className="text-base font-bold">{activeGig.title}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Client budget: {inr(activeGig.budget_min)} – {inr(activeGig.budget_max)}
                {activeGig.duration_days ? ` · Est. ${activeGig.duration_days} days` : ""}
              </p>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={() => setActiveGig(null)}>
              Cancel
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="gig-bid">Your bid (INR) *</Label>
              <Input
                id="gig-bid"
                name="bid_amount"
                type="text"
                inputMode="numeric"
                required
                value={bid}
                onChange={(e) => setBid(e.target.value.replace(/[^\d.]/g, ""))}
                aria-describedby="gig-bid-hint"
                className="mt-1.5"
              />
              <span id="gig-bid-hint" className="mt-1 block text-[11px] text-muted-foreground">
                Allowed range: {inr(Math.round(Number(activeGig.budget_min) * 0.5))} – {inr(Math.round(Number(activeGig.budget_max) * 2))}
              </span>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="gig-cover">Execution plan &amp; relevant proof (10–3000 chars) *</Label>
              <Textarea
                id="gig-cover"
                name="cover_note"
                required
                minLength={10}
                maxLength={3000}
                rows={3}
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                placeholder="Outline milestones, delivery timeline, and links to similar shipped work..."
                className="mt-1.5"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={busy === `sub-${activeGig.id}`}>
              {busy === `sub-${activeGig.id}` ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Send className="h-4 w-4 mr-1.5" />}
              Send Proposal
            </Button>
          </div>
        </form>
      )}

      {gigs.loading && <p className="text-sm text-muted-foreground">Loading open gigs…</p>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {gigs.data?.map((g) => {
          const prop = proposalFor(g.id);
          const isActive = prop && prop.status !== "withdrawn";
          return (
            <div key={g.id} className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-primary">{g.client_name || "Verified Client"}</span>
                {g.duration_days && (
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" /> {g.duration_days} days
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-bold text-base leading-snug">{g.title}</h3>
                {g.description && <p className="text-xs text-muted-foreground mt-1">{g.description}</p>}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {g.skills.map((s) => (
                  <Badge key={s} variant="secondary" className="text-[11px]">
                    {s}
                  </Badge>
                ))}
              </div>
              <div className="mt-auto pt-3 border-t border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">
                    {inr(g.budget_min)} – {inr(g.budget_max)}
                  </span>
                  {isActive && (
                    <Badge variant="outline" className="capitalize text-emerald-600 border-emerald-500/40">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> {prop.status} ({inr(prop.bid_amount)})
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant={isActive ? "outline" : "default"} className="flex-1" onClick={() => openProposalModal(g)}>
                    {isActive ? "Update Proposal" : "Submit Proposal"}
                  </Button>
                  {isActive && (prop.status === "submitted" || prop.status === "shortlisted") && (
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={busy === `wd-${prop.id}`}
                      onClick={() => handleWithdraw(prop.id)}
                      aria-label="Withdraw proposal"
                    >
                      {busy === `wd-${prop.id}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
