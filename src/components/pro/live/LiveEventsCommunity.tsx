import React, { useState } from "react";
import { Calendar, Trophy, Users, Send, CheckCircle2, Loader2, Sparkles, Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ProHero } from "../ProHero";
import { useAsync } from "@/hooks/useAsync";
import {
  fetchHackathons,
  fetchMyHackathonRegistrations,
  fetchMyEventRegistrations,
  registerForHackathon,
  joinHackathonTeam,
  submitHackathonProject,
  registerForEvent,
  type Hackathon,
} from "@/services/candidate/platform";
import { createOrder, payOrderWithWallet, payWithRazorpay } from "@/services/candidate/wallet";
import { backendErrorMessage } from "@/hooks/useCandidateBackend";

const inr = (n: number) => (Number(n) === 0 ? "Free" : "₹" + Number(n).toLocaleString("en-IN"));

const COMMUNITY_EVENTS: { kind: "networking" | "webinar" | "podcast" | "meetup"; ref: string; title: string; subtitle: string; city?: string; when: string }[] = [
  { kind: "networking", ref: "bengaluru-founders-engineers-mixer", title: "Bengaluru Founders & Verified Engineers Mixer", subtitle: "In-person hiring roundtable with CTOs & engineering managers", city: "Bengaluru", when: "Next Saturday · 5:00 PM IST" },
  { kind: "webinar", ref: "system-design-cir-masterclass", title: "Cracking 90+ CIR in Distributed Systems", subtitle: "Live architecture teardown & Q&A with Staff Engineers", when: "Thursday · 7:30 PM IST" },
  { kind: "podcast", ref: "proof-era-ep-12-live", title: "Proof-First Hiring · Live Listener AMA", subtitle: "Interactive recording session on skills-based hiring", when: "Friday · 6:00 PM IST" },
  { kind: "meetup", ref: "hyderabad-ai-builders-chapter", title: "Hyderabad AI & Agentic Builders Chapter", subtitle: "Hands-on agent evaluation clinic & peer code review", city: "Hyderabad", when: "Sunday · 11:00 AM IST" },
];

export const LiveEventsCommunity: React.FC<{
  onToast: (m: string) => void;
  walletBalance: number;
  onWalletChanged: () => void;
  userName: string;
  userEmail: string;
}> = ({ onToast, walletBalance, onWalletChanged, userName, userEmail }) => {
  const hackathons = useAsync(fetchHackathons);
  const myHackRegs = useAsync(fetchMyHackathonRegistrations);
  const myEventRegs = useAsync(fetchMyEventRegistrations);

  const [tab, setTab] = useState<"hackathons" | "community">("hackathons");
  const [busy, setBusy] = useState<string | null>(null);
  const [teamNames, setTeamNames] = useState<Record<string, string>>({});
  const [inviteCode, setInviteCode] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [submitFor, setSubmitFor] = useState<Hackathon | null>(null);
  const [projTitle, setProjTitle] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projRepo, setProjRepo] = useState("");
  const [projDemo, setProjDemo] = useState("");

  const regFor = (hackathonId: string) => myHackRegs.data?.find((r) => r.hackathon_id === hackathonId);
  const isEventRegistered = (kind: string, ref: string) =>
    Boolean(myEventRegs.data?.some((e) => e.event_kind === kind && e.event_ref === ref));

  const handleRegisterHackathon = async (h: Hackathon, e: React.FormEvent) => {
    e.preventDefault();
    setBusy(`reg-${h.id}`);
    try {
      let orderId: string | undefined;
      const fee = Number(h.entry_fee_inr);
      if (fee > 0) {
        const useWallet = walletBalance >= fee * 1.18;
        const order = await createOrder({
          itemType: "hackathon_ticket",
          itemId: h.id,
          gateway: useWallet ? "wallet" : "razorpay",
          idempotencyKey: `hack-${h.id}-${Math.floor(Date.now() / 120000)}`,
        });
        const paid =
          order.status === "entitled"
            ? order
            : useWallet
            ? await payOrderWithWallet(order.id)
            : await payWithRazorpay(order, { name: userName, email: userEmail });
        orderId = paid.id;
        onWalletChanged();
      }
      await registerForHackathon(h.id, teamNames[h.id]?.trim() || undefined, orderId);
      onToast(`Registered for ${h.title}!`);
      await myHackRegs.reload();
    } catch (err) {
      onToast(backendErrorMessage(err));
    } finally {
      setBusy(null);
    }
  };

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    setBusy("join-team");
    try {
      await joinHackathonTeam(inviteCode.trim());
      setInviteCode("");
      onToast("Joined hackathon team!");
      await myHackRegs.reload();
    } catch (err) {
      onToast(backendErrorMessage(err));
    } finally {
      setBusy(null);
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitFor || !projTitle.trim()) return;
    setBusy(`sub-${submitFor.id}`);
    try {
      await submitHackathonProject(
        submitFor.id,
        projTitle.trim(),
        projDesc.trim() || undefined,
        projRepo.trim() || undefined,
        projDemo.trim() || undefined,
      );
      onToast(`Project submitted for ${submitFor.title}!`);
      setSubmitFor(null);
      setProjTitle("");
      setProjDesc("");
      setProjRepo("");
      setProjDemo("");
      await myHackRegs.reload();
    } catch (err) {
      onToast(backendErrorMessage(err));
    } finally {
      setBusy(null);
    }
  };

  const handleEventRegister = async (ev: (typeof COMMUNITY_EVENTS)[number]) => {
    setBusy(`ev-${ev.ref}`);
    try {
      await registerForEvent(ev.kind, ev.ref, ev.city);
      onToast(`Seat reserved for "${ev.title}".`);
      await myEventRegs.reload();
    } catch (err) {
      onToast(backendErrorMessage(err));
    } finally {
      setBusy(null);
    }
  };

  const copyInvite = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="space-y-6">
      <ProHero
        icon={<Calendar />}
        title="Events, Hackathons & Community"
        subtitle="Compete in verified engineering hackathons, form teams with invite codes, submit builds, and RSVP to city mixers & live masterclasses."
        aside={
          <div className="flex rounded-full bg-white/15 p-1 text-sm">
            {(["hackathons", "community"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`rounded-full px-4 py-1.5 font-semibold capitalize ${
                  tab === t ? "bg-white text-primary" : "text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        }
      />

      {tab === "hackathons" ? (
        <div className="space-y-6">
          {/* Join existing team by invite code */}
          <form
            onSubmit={handleJoinTeam}
            method="post"
            className="rounded-2xl border border-border bg-card p-4 flex flex-col sm:flex-row sm:items-end gap-3"
          >
            <div className="flex-1">
              <Label htmlFor="team-invite-code" className="text-xs font-semibold">
                Have a team invite code?
              </Label>
              <Input
                id="team-invite-code"
                name="invite_code"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="e.g. A1B2C3D4"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="characters"
                spellCheck={false}
                maxLength={20}
                className="mt-1.5 h-10 uppercase font-mono"
              />
            </div>
            <Button type="submit" disabled={busy === "join-team"}>
              {busy === "join-team" ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Users className="h-4 w-4 mr-1.5" />}
              Join Team
            </Button>
          </form>

          {submitFor && (
            <form
              onSubmit={handleProjectSubmit}
              method="post"
              className="rounded-2xl border-2 border-primary/30 bg-card p-5 space-y-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">Project Submission</p>
                  <h2 className="text-base font-bold">{submitFor.title}</h2>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => setSubmitFor(null)}>
                  Cancel
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="proj-title">Project title *</Label>
                  <Input
                    id="proj-title"
                    name="title"
                    required
                    maxLength={180}
                    value={projTitle}
                    onChange={(e) => setProjTitle(e.target.value)}
                    placeholder="Autonomous PR Reviewer & Test Synthesizer"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="proj-repo">Repository URL (https://)</Label>
                  <Input
                    id="proj-repo"
                    name="repo_url"
                    type="url"
                    value={projRepo}
                    onChange={(e) => setProjRepo(e.target.value)}
                    placeholder="https://github.com/you/project"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="proj-demo">Live demo URL (https://)</Label>
                  <Input
                    id="proj-demo"
                    name="demo_url"
                    type="url"
                    value={projDemo}
                    onChange={(e) => setProjDemo(e.target.value)}
                    placeholder="https://demo.example.com"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    className="mt-1.5"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="proj-desc">Architecture &amp; problem solved</Label>
                  <Textarea
                    id="proj-desc"
                    name="description"
                    rows={3}
                    maxLength={4000}
                    value={projDesc}
                    onChange={(e) => setProjDesc(e.target.value)}
                    placeholder="Explain what you built, stack choices, and measurable outcomes..."
                    className="mt-1.5"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="submit" disabled={busy === `sub-${submitFor.id}`}>
                  {busy === `sub-${submitFor.id}` ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Send className="h-4 w-4 mr-1.5" />}
                  Submit Project
                </Button>
              </div>
            </form>
          )}

          {hackathons.loading && <p className="text-sm text-muted-foreground">Loading hackathons…</p>}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {hackathons.data?.map((h) => {
              const reg = regFor(h.id);
              const invite = reg?.hackathon_teams?.invite_code;
              return (
                <div key={h.id} className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="secondary" className="capitalize">
                      {h.mode} · {h.format}
                    </Badge>
                    <span className="text-xs font-bold text-primary flex items-center gap-1">
                      <Trophy className="h-3.5 w-3.5" /> Prize {inr(h.prize_pool_inr)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-base leading-snug">{h.title}</h3>
                    {h.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-3">{h.description}</p>}
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Starts: {new Date(h.starts_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>
                    <p>Max team size: {h.max_team_size} · Entry: {inr(h.entry_fee_inr)}</p>
                  </div>

                  <div className="mt-auto pt-3 border-t border-border space-y-2.5">
                    {reg ? (
                      <>
                        <div className="flex items-center justify-between text-xs font-semibold text-emerald-600">
                          <span className="inline-flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4" />
                            {reg.status === "submitted" ? "Project Submitted" : "Registered"}
                          </span>
                          {reg.hackathon_teams?.name && <span className="text-foreground">Team: {reg.hackathon_teams.name}</span>}
                        </div>
                        {invite && (
                          <div className="flex items-center justify-between rounded-xl bg-muted/60 px-3 py-1.5 text-xs">
                            <span>
                              Invite code: <strong className="font-mono">{invite}</strong>
                            </span>
                            <button
                              type="button"
                              onClick={() => copyInvite(invite)}
                              className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                            >
                              {copiedCode === invite ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                              {copiedCode === invite ? "Copied" : "Copy"}
                            </button>
                          </div>
                        )}
                        {h.status !== "completed" && (
                          <Button size="sm" variant="outline" className="w-full" onClick={() => setSubmitFor(h)}>
                            <Send className="h-3.5 w-3.5 mr-1.5" />
                            {reg.status === "submitted" ? "Update Submission" : "Submit Project"}
                          </Button>
                        )}
                      </>
                    ) : h.status === "open" ? (
                      <form onSubmit={(e) => handleRegisterHackathon(h, e)} method="post" className="space-y-2">
                        {h.max_team_size > 1 && (
                          <div>
                            <Label htmlFor={`team-${h.id}`} className="text-[11px] text-muted-foreground">
                              Optional team name (creates invite code)
                            </Label>
                            <Input
                              id={`team-${h.id}`}
                              name="team_name"
                              maxLength={60}
                              value={teamNames[h.id] ?? ""}
                              onChange={(e) => setTeamNames((p) => ({ ...p, [h.id]: e.target.value }))}
                              placeholder="e.g. ByteForge"
                              className="mt-1 h-8 text-xs"
                            />
                          </div>
                        )}
                        <Button type="submit" size="sm" className="w-full" disabled={busy === `reg-${h.id}`}>
                          {busy === `reg-${h.id}` ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : Number(h.entry_fee_inr) === 0 ? (
                            "Register Free"
                          ) : (
                            `Register · ${inr(h.entry_fee_inr)} + GST`
                          )}
                        </Button>
                      </form>
                    ) : (
                      <Badge variant="outline" className="w-full justify-center py-1 capitalize">
                        {h.status}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            {COMMUNITY_EVENTS.map((ev) => {
              const registered = isEventRegistered(ev.kind, ev.ref);
              return (
                <div key={ev.ref} className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="secondary" className="capitalize">
                      {ev.kind}{ev.city ? ` · ${ev.city}` : " · Online"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{ev.when}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-base">{ev.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{ev.subtitle}</p>
                  </div>
                  <div className="mt-auto pt-2 flex items-center justify-between gap-2">
                    {registered ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                        <CheckCircle2 className="h-4 w-4" /> Seat Reserved
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        disabled={busy === `ev-${ev.ref}`}
                        onClick={() => handleEventRegister(ev)}
                      >
                        {busy === `ev-${ev.ref}` ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Sparkles className="h-3.5 w-3.5 mr-1.5" />}
                        Reserve Free Seat
                      </Button>
                    )}
                    <a
                      href={ev.kind === "networking" ? "/networking" : ev.kind === "podcast" || ev.kind === "webinar" ? "/podcasts" : "/hackathon3"}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      Event page <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {(myEventRegs.data?.length ?? 0) > 0 && (
            <div className="rounded-2xl border border-border bg-card p-4">
              <h3 className="text-sm font-bold mb-2">Your Community RSVPs ({myEventRegs.data!.length})</h3>
              <ul className="divide-y divide-border text-xs">
                {myEventRegs.data!.map((r) => (
                  <li key={r.id} className="py-2 flex items-center justify-between gap-2">
                    <span className="font-medium capitalize">
                      {r.event_kind}: {r.event_ref.replace(/-/g, " ")}{r.city ? ` (${r.city})` : ""}
                    </span>
                    <span className="text-muted-foreground">
                      {new Date(r.created_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
