import React, { useState } from "react";
import { Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatINR } from "@/data/proData";
import type { SuperAdminSnapshot } from "@/services/admin/superAdminData";
import type {
  SuperAdminEnterpriseState,
  HackathonAdminRecord,
  NetworkingEventAdminRecord,
  WebinarAdminRecord,
} from "@/services/admin/superAdminEnterpriseData";
import { toast } from "sonner";

interface Props {
  mode: "events-hub" | "freelancing";
  snapshot: SuperAdminSnapshot;
  enterprise: SuperAdminEnterpriseState;
  onUpdateEnterprise: React.Dispatch<React.SetStateAction<SuperAdminEnterpriseState>>;
  onLogAudit: (action: string, table: string, entityId: string, details: string) => void;
}

export const AdminEventsAndFreelancePanel: React.FC<Props> = ({
  mode,
  snapshot,
  enterprise,
  onUpdateEnterprise,
  onLogAudit,
}) => {
  const [eventsTab, setEventsTab] = useState<"hackathons" | "networking" | "webinars">("hackathons");
  const [freelanceTab, setFreelanceTab] = useState<"projects" | "freelancers" | "disputes">("projects");
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventCity, setEventCity] = useState("Bengaluru");
  const [eventIndustry, setEventIndustry] = useState("Software & AI");

  /* ===================== 12. HACKATHONS, NETWORKING & WEBINARS ===================== */
  if (mode === "events-hub") {
    const handleCreate = (e: React.FormEvent) => {
      e.preventDefault();
      if (!eventTitle.trim()) return;
      if (eventsTab === "hackathons") {
        const rec: HackathonAdminRecord = {
          id: `hck-${Date.now()}`,
          code: `HACK-${Math.floor(100 + Math.random() * 899)}`,
          title: eventTitle.trim(),
          industry: eventIndustry,
          city: eventCity,
          mode: "Hybrid",
          status: "upcoming",
          sponsors: ["TalentCIR"],
          participants: 0,
          teams: 0,
          submissions: 0,
          prizePoolInr: 500000,
          jobAuctionBids: 0,
          schedule: "Scheduled · Q1 2027",
        };
        onUpdateEnterprise((p) => ({ ...p, hackathons: [rec, ...p.hackathons] }));
        onLogAudit("hackathon.created", "hackathons", rec.code, `Created hackathon ${rec.title}`);
      } else if (eventsTab === "networking") {
        const rec: NetworkingEventAdminRecord = {
          id: `net-${Date.now()}`,
          code: `NET-${Math.floor(100 + Math.random() * 899)}`,
          title: eventTitle.trim(),
          industry: eventIndustry,
          city: eventCity,
          status: "upcoming",
          registrations: 0,
          attended: 0,
          speakers: ["Industry Lead TBA"],
          sponsors: ["TalentCIR"],
          ticketPriceInr: 499,
          feedbackScore: 0,
          dateLabel: `${eventCity} · Upcoming`,
        };
        onUpdateEnterprise((p) => ({ ...p, networkingEvents: [rec, ...p.networkingEvents] }));
        onLogAudit("networking.created", "networking_events", rec.code, `Created networking event ${rec.title}`);
      } else {
        const rec: WebinarAdminRecord = {
          id: `web-${Date.now()}`,
          code: `WEB-${Math.floor(100 + Math.random() * 899)}`,
          title: eventTitle.trim(),
          hostMentor: "Siddharth Rao",
          category: eventIndustry,
          status: "upcoming",
          registrations: 0,
          avgWatchPct: 0,
          dateLabel: "Upcoming · Live Stream",
        };
        onUpdateEnterprise((p) => ({ ...p, webinars: [rec, ...p.webinars] }));
        onLogAudit("webinar.created", "webinars", rec.code, `Scheduled webinar ${rec.title}`);
      }
      setEventTitle("");
      setShowCreateEvent(false);
      toast.success("Event created and added to catalog");
    };

    const totalHackathonParticipants = enterprise.hackathons.reduce((s, h) => s + h.participants, 0);
    const totalPrizePool = enterprise.hackathons.reduce((s, h) => s + h.prizePoolInr, 0);
    const totalNetworkingRegs = enterprise.networkingEvents.reduce((s, n) => s + n.registrations, 0);
    const totalJobBids = enterprise.hackathons.reduce((s, h) => s + h.jobAuctionBids, 0);

    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {[
            { label: "Hackathon participants", value: totalHackathonParticipants.toLocaleString("en-IN"), meta: `${enterprise.hackathons.length} hackathons · ${totalJobBids} talent bids` },
            { label: "Active prize pool", value: formatINR(totalPrizePool), meta: "Sponsored tracks & awards" },
            { label: "Networking registrations", value: totalNetworkingRegs.toLocaleString("en-IN"), meta: `${enterprise.networkingEvents.length} city chapter events` },
            { label: "Webinar audience", value: enterprise.webinars.reduce((s, w) => s + w.registrations, 0).toLocaleString("en-IN"), meta: `${enterprise.webinars.length} live & recorded sessions` },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-[#111827]/[0.08] bg-[#f5f7fa] p-4">
              <p className="text-xs text-[#6b7487]">{stat.label}</p>
              <p className="mt-2 text-2xl font-medium text-[#111827] tabular-nums">{stat.value}</p>
              <p className="mt-1 text-[11px] text-[#6b7487]">{stat.meta}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-lg border border-[#111827]/[0.08] bg-[#f5f7fa] p-1">
            {(
              [
                { id: "hackathons", label: `Hackathons & job auction (${enterprise.hackathons.length})` },
                { id: "networking", label: `Networking events (${enterprise.networkingEvents.length})` },
                { id: "webinars", label: `Webinars (${enterprise.webinars.length})` },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setEventsTab(t.id)}
                className={cn(
                  "rounded-md px-3 py-1 text-xs font-medium cursor-pointer transition-colors duration-150",
                  eventsTab === t.id ? "bg-[#002C66] text-white" : "text-[#4b5565] hover:text-[#111827]"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <Button size="sm" className="h-8 bg-[#002C66] text-white text-xs gap-1.5 cursor-pointer" onClick={() => setShowCreateEvent((v) => !v)}>
            <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
            Create {eventsTab === "hackathons" ? "hackathon" : eventsTab === "networking" ? "networking event" : "webinar"}
          </Button>
        </div>

        {showCreateEvent && (
          <form onSubmit={handleCreate} className="rounded-xl border border-[#002C66]/20 bg-[#f5f7fa] p-4 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <div className="sm:col-span-2">
              <label className="block text-xs text-[#4b5565] mb-1">Event title</label>
              <Input value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} placeholder="e.g. Bengaluru GenAI Builders Sprint" className="h-9 text-xs bg-white" required />
            </div>
            <div>
              <label className="block text-xs text-[#4b5565] mb-1">City &amp; industry</label>
              <div className="flex gap-2">
                <Input value={eventCity} onChange={(e) => setEventCity(e.target.value)} className="h-9 text-xs bg-white" />
                <Input value={eventIndustry} onChange={(e) => setEventIndustry(e.target.value)} className="h-9 text-xs bg-white" />
              </div>
            </div>
            <Button type="submit" size="sm" className="h-9 bg-[#002C66] text-white text-xs cursor-pointer">
              Publish event
            </Button>
          </form>
        )}

        {eventsTab === "hackathons" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#111827]/[0.08] text-[#6b7487]">
                  <th className="py-2.5 pr-3 font-medium">Hackathon &amp; city</th>
                  <th className="py-2.5 px-3 font-medium">Sponsors</th>
                  <th className="py-2.5 px-3 font-medium">Participants / teams / subs</th>
                  <th className="py-2.5 px-3 font-medium">Prize pool &amp; job auction</th>
                  <th className="py-2.5 px-3 font-medium">Winners / status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#111827]/[0.06]">
                {enterprise.hackathons.map((h) => (
                  <tr key={h.id} className="hover:bg-[#f5f7fa]">
                    <td className="py-3 pr-3">
                      <p className="font-medium text-[#111827]">{h.title}</p>
                      <p className="font-mono text-[11px] text-[#6b7487]">{h.code} · {h.city} ({h.mode}) · {h.schedule}</p>
                    </td>
                    <td className="py-3 px-3 text-[#4b5565]">{h.sponsors.join(", ")}</td>
                    <td className="py-3 px-3 font-mono tabular-nums text-[#111827]">
                      {h.participants.toLocaleString("en-IN")} / {h.teams} teams / {h.submissions} subs
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums">
                      <p className="text-[#111827] font-medium">{formatINR(h.prizePoolInr)}</p>
                      <p className="text-[11px] text-[#6b7487]">{h.jobAuctionBids} hiring auction bids</p>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1.5 capitalize text-[#111827]">
                        <span className={cn("h-1.5 w-1.5 rounded-full", h.status === "live" ? "bg-[#16a34a]" : h.status === "upcoming" ? "bg-[#002C66]" : "bg-[#94a3b8]")} />
                        {h.status}
                      </span>
                      {h.winnerTeam && <p className="text-[11px] text-[#6b7487] mt-0.5">Winner: {h.winnerTeam}</p>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {eventsTab === "networking" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#111827]/[0.08] text-[#6b7487]">
                  <th className="py-2.5 pr-3 font-medium">Event &amp; city</th>
                  <th className="py-2.5 px-3 font-medium">Speakers &amp; sponsors</th>
                  <th className="py-2.5 px-3 font-medium">Registrations / attendance</th>
                  <th className="py-2.5 px-3 font-medium">Ticket &amp; feedback</th>
                  <th className="py-2.5 pl-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#111827]/[0.06]">
                {enterprise.networkingEvents.map((n) => (
                  <tr key={n.id} className="hover:bg-[#f5f7fa]">
                    <td className="py-3 pr-3">
                      <p className="font-medium text-[#111827]">{n.title}</p>
                      <p className="font-mono text-[11px] text-[#6b7487]">{n.code} · {n.dateLabel}</p>
                    </td>
                    <td className="py-3 px-3 text-[#4b5565]">
                      <p>Speakers: {n.speakers.join(", ")}</p>
                      <p className="text-[11px] text-[#6b7487]">Sponsors: {n.sponsors.join(", ")}</p>
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums text-[#111827]">
                      {n.registrations} registered {n.attended > 0 ? `· ${n.attended} attended` : ""}
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums">
                      {formatINR(n.ticketPriceInr)} · {n.feedbackScore > 0 ? `${n.feedbackScore}★` : "Upcoming"}
                    </td>
                    <td className="py-3 pl-3 capitalize">
                      <span className="inline-flex items-center gap-1.5">
                        <span className={cn("h-1.5 w-1.5 rounded-full", n.status === "upcoming" ? "bg-[#002C66]" : "bg-[#16a34a]")} />
                        {n.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {eventsTab === "webinars" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#111827]/[0.08] text-[#6b7487]">
                  <th className="py-2.5 pr-3 font-medium">Webinar &amp; host</th>
                  <th className="py-2.5 px-3 font-medium">Category</th>
                  <th className="py-2.5 px-3 font-medium">Registrations</th>
                  <th className="py-2.5 px-3 font-medium">Avg watch %</th>
                  <th className="py-2.5 pl-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#111827]/[0.06]">
                {enterprise.webinars.map((w) => (
                  <tr key={w.id} className="hover:bg-[#f5f7fa]">
                    <td className="py-3 pr-3">
                      <p className="font-medium text-[#111827]">{w.title}</p>
                      <p className="font-mono text-[11px] text-[#6b7487]">{w.code} · Host: {w.hostMentor} · {w.dateLabel}</p>
                    </td>
                    <td className="py-3 px-3 text-[#4b5565]">{w.category}</td>
                    <td className="py-3 px-3 font-mono tabular-nums text-[#111827]">{w.registrations}</td>
                    <td className="py-3 px-3 font-mono tabular-nums text-[#4b5565]">{w.avgWatchPct ? `${w.avgWatchPct}%` : "Scheduled"}</td>
                    <td className="py-3 pl-3 capitalize">{w.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  /* ===================== 13. FREELANCING MANAGEMENT ===================== */
  const freelancers = snapshot.candidates.filter((c) => !c.archived && c.freelancerStatus !== "Full-Time Only");
  const disputedProjects = enterprise.freelanceProjects.filter((p) => p.status === "disputed");
  const visibleProjects = freelanceTab === "disputes" ? disputedProjects : enterprise.freelanceProjects;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {[
          { label: "Verified freelancers", value: String(freelancers.length), meta: "Active & open to gigs" },
          { label: "Active & pending projects", value: String(enterprise.freelanceProjects.length), meta: `${enterprise.freelanceProjects.filter((p) => p.status === "pending_approval").length} awaiting approval` },
          { label: "Escrow project volume", value: formatINR(enterprise.freelanceProjects.reduce((s, p) => s + p.budgetInr, 0)), meta: "Contracts & milestones" },
          { label: "Open escrow disputes", value: String(disputedProjects.length), meta: "Held pending admin mediation" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-[#111827]/[0.08] bg-[#f5f7fa] p-4">
            <p className="text-xs text-[#6b7487]">{stat.label}</p>
            <p className="mt-2 text-2xl font-medium text-[#111827] tabular-nums">{stat.value}</p>
            <p className="mt-1 text-[11px] text-[#6b7487]">{stat.meta}</p>
          </div>
        ))}
      </div>

      <div className="inline-flex rounded-lg border border-[#111827]/[0.08] bg-[#f5f7fa] p-1">
        {(
          [
            { id: "projects", label: `Projects & contracts (${enterprise.freelanceProjects.length})` },
            { id: "freelancers", label: `Freelancers & portfolios (${freelancers.length})` },
            { id: "disputes", label: `Dispute resolution (${disputedProjects.length})` },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setFreelanceTab(t.id)}
            className={cn(
              "rounded-md px-3 py-1 text-xs font-medium cursor-pointer transition-colors duration-150",
              freelanceTab === t.id ? "bg-[#002C66] text-white" : "text-[#4b5565] hover:text-[#111827]"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {freelanceTab === "freelancers" ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#111827]/[0.08] text-[#6b7487]">
                <th className="py-2.5 pr-3 font-medium">Freelancer &amp; ID</th>
                <th className="py-2.5 px-3 font-medium">Availability &amp; rate</th>
                <th className="py-2.5 px-3 font-medium">Gigs &amp; CIR score</th>
                <th className="py-2.5 pl-3 font-medium">Verified skills</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111827]/[0.06]">
              {freelancers.map((f) => (
                <tr key={f.id} className="hover:bg-[#f5f7fa]">
                  <td className="py-3 pr-3">
                    <p className="font-medium text-[#111827]">{f.fullName}</p>
                    <p className="font-mono text-[11px] text-[#6b7487]">{f.talentCirId} · {f.city}</p>
                  </td>
                  <td className="py-3 px-3 font-mono tabular-nums">
                    <p className="text-[#111827]">{formatINR(f.freelanceHourlyInr)}/hr</p>
                    <p className="text-[11px] text-[#6b7487]">{f.freelancerStatus}</p>
                  </td>
                  <td className="py-3 px-3 font-mono tabular-nums text-[#4b5565]">
                    {f.freelanceGigsCompleted} gigs completed · CIR {f.cirScore}
                  </td>
                  <td className="py-3 pl-3 text-[#4b5565]">{f.skills.slice(0, 4).join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#111827]/[0.08] text-[#6b7487]">
                <th className="py-2.5 pr-3 font-medium">Project &amp; code</th>
                <th className="py-2.5 px-3 font-medium">Client &amp; freelancer</th>
                <th className="py-2.5 px-3 font-medium">Budget &amp; escrow</th>
                <th className="py-2.5 px-3 font-medium">Status</th>
                <th className="py-2.5 pl-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111827]/[0.06]">
              {visibleProjects.map((p) => (
                <tr key={p.id} className="hover:bg-[#f5f7fa]">
                  <td className="py-3 pr-3">
                    <p className="font-medium text-[#111827]">{p.title}</p>
                    <p className="font-mono text-[11px] text-[#6b7487]">{p.code} · {p.category} · {p.proposalsCount} bids</p>
                  </td>
                  <td className="py-3 px-3">
                    <p className="text-[#111827]">{p.clientName}</p>
                    <p className="text-[11px] text-[#6b7487]">Freelancer: {p.freelancerName}</p>
                  </td>
                  <td className="py-3 px-3 font-mono tabular-nums">
                    <p className="text-[#111827] font-medium">{formatINR(p.budgetInr)}</p>
                    <p className="text-[11px] text-[#6b7487]">Escrow: {p.escrowStatus}</p>
                  </td>
                  <td className="py-3 px-3 capitalize">
                    <span className="inline-flex items-center gap-1.5">
                      <span className={cn("h-1.5 w-1.5 rounded-full", p.status === "completed" || p.status === "active" ? "bg-[#16a34a]" : p.status === "disputed" ? "bg-[#dc2626]" : "bg-[#d97706]")} />
                      {p.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="py-3 pl-3 text-right">
                    {p.status === "pending_approval" && (
                      <Button
                        size="sm"
                        className="h-7 px-2 text-[11px] bg-[#002C66] text-white gap-1 cursor-pointer"
                        onClick={() => {
                          onUpdateEnterprise((prev) => ({
                            ...prev,
                            freelanceProjects: prev.freelanceProjects.map((x) =>
                              x.id === p.id ? { ...x, status: "active" } : x
                            ),
                          }));
                          onLogAudit("freelance.project_approved", "freelance_projects", p.code, `Approved project ${p.title}`);
                          toast.success(`Approved project ${p.code}`);
                        }}
                      >
                        <Check className="h-3 w-3" strokeWidth={1.5} />
                        Approve
                      </Button>
                    )}
                    {p.status === "disputed" && (
                      <Button
                        size="sm"
                        className="h-7 px-2 text-[11px] bg-[#002C66] text-white cursor-pointer"
                        onClick={() => {
                          onUpdateEnterprise((prev) => ({
                            ...prev,
                            freelanceProjects: prev.freelanceProjects.map((x) =>
                              x.id === p.id ? { ...x, status: "completed", escrowStatus: "Released" } : x
                            ),
                          }));
                          onLogAudit("freelance.dispute_resolved", "freelance_projects", p.code, `Mediated & released escrow for ${p.code}`);
                          toast.success(`Resolved dispute & released escrow for ${p.code}`);
                        }}
                      >
                        Release escrow
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
