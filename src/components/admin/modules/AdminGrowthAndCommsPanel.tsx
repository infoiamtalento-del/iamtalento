import React, { useEffect, useState } from "react";
import { Send, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type {
  SuperAdminEnterpriseState,
  NotificationBroadcastRecord,
  KnowledgeBaseArticle,
} from "@/services/admin/superAdminEnterpriseData";
import { adminBroadcastNotification } from "@/services/admin/adminService";
import { toast } from "sonner";

interface Props {
  mode: "marketing-cms" | "notifications" | "support-kb";
  initialSubTab?: string;
  enterprise: SuperAdminEnterpriseState;
  onUpdateEnterprise: React.Dispatch<React.SetStateAction<SuperAdminEnterpriseState>>;
  onLogAudit: (action: string, table: string, entityId: string, details: string) => void;
}

export const AdminGrowthAndCommsPanel: React.FC<Props> = ({
  mode,
  initialSubTab,
  enterprise,
  onUpdateEnterprise,
  onLogAudit,
}) => {
  const [cmsTab, setCmsTab] = useState<"pages" | "campaigns" | "seo">("pages");

  useEffect(() => {
    if (!initialSubTab) return;
    if (mode === "marketing-cms" && (initialSubTab === "pages" || initialSubTab === "campaigns" || initialSubTab === "seo")) {
      setCmsTab(initialSubTab);
    }
  }, [mode, initialSubTab]);
  const [notifTitle, setNotifTitle] = useState("");
  const [notifChannel, setNotifChannel] = useState<NotificationBroadcastRecord["channel"]>("Push");
  const [notifAudience, setNotifAudience] = useState<NotificationBroadcastRecord["audience"]>("All Users");
  const [notifSegment, setNotifSegment] = useState("All verified users");

  const [kbTitle, setKbTitle] = useState("");
  const [kbAudience, setKbAudience] = useState<KnowledgeBaseArticle["audience"]>("Candidate");

  /* ===================== 16. MARKETING & CMS ===================== */
  if (mode === "marketing-cms") {
    return (
      <div className="space-y-5">
        <div className="inline-flex rounded-lg border border-[#111827]/[0.08] bg-[#f5f7fa] p-1">
          {(
            [
              { id: "pages", label: `Website CMS & content (${enterprise.cmsPages.length})` },
              { id: "campaigns", label: `Marketing campaigns (${enterprise.campaigns.length})` },
              { id: "seo", label: "SEO metadata & legal" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setCmsTab(t.id)}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium cursor-pointer transition-colors duration-150",
                cmsTab === t.id ? "bg-[#002C66] text-white" : "text-[#4b5565] hover:text-[#111827]"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {cmsTab === "campaigns" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#111827]/[0.08] text-[#6b7487]">
                  <th className="py-2.5 pr-3 font-medium">Campaign &amp; channel</th>
                  <th className="py-2.5 px-3 font-medium">Target audience</th>
                  <th className="py-2.5 px-3 font-medium">Sent</th>
                  <th className="py-2.5 px-3 font-medium">Open / conversion</th>
                  <th className="py-2.5 pl-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#111827]/[0.06]">
                {enterprise.campaigns.map((cmp) => (
                  <tr key={cmp.id} className="hover:bg-[#f5f7fa]">
                    <td className="py-3 pr-3">
                      <p className="font-medium text-[#111827]">{cmp.name}</p>
                      <p className="font-mono text-[11px] text-[#6b7487]">{cmp.code} · {cmp.channel}</p>
                    </td>
                    <td className="py-3 px-3 text-[#4b5565]">{cmp.audience}</td>
                    <td className="py-3 px-3 font-mono tabular-nums text-[#111827]">{cmp.sentCount.toLocaleString("en-IN")}</td>
                    <td className="py-3 px-3 font-mono tabular-nums text-[#4b5565]">
                      {cmp.openRatePct}% open · <span className="text-[#16a34a]">{cmp.conversionPct}% conv</span>
                    </td>
                    <td className="py-3 pl-3 capitalize">
                      <span className="inline-flex items-center gap-1.5">
                        <span className={cn("h-1.5 w-1.5 rounded-full", cmp.status === "active" ? "bg-[#16a34a]" : cmp.status === "scheduled" ? "bg-[#002C66]" : "bg-[#94a3b8]")} />
                        {cmp.status}
                      </span>
                    </td>
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
                  <th className="py-2.5 pr-3 font-medium">Page / asset</th>
                  <th className="py-2.5 px-3 font-medium">Route</th>
                  <th className="py-2.5 px-3 font-medium">SEO title</th>
                  <th className="py-2.5 px-3 font-medium">Status</th>
                  <th className="py-2.5 pl-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#111827]/[0.06]">
                {enterprise.cmsPages.map((pg) => (
                  <tr key={pg.id} className="hover:bg-[#f5f7fa]">
                    <td className="py-3 pr-3">
                      <p className="font-medium text-[#111827]">{pg.title}</p>
                      <p className="text-[11px] text-[#6b7487]">{pg.sectionGroup} · Updated {pg.lastUpdated} by {pg.updatedBy}</p>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-[#4b5565]">{pg.route}</td>
                    <td className="py-3 px-3 text-[#4b5565] max-w-xs truncate">{pg.seoTitle}</td>
                    <td className="py-3 px-3 capitalize">
                      <span className="inline-flex items-center gap-1.5">
                        <span className={cn("h-1.5 w-1.5 rounded-full", pg.status === "published" ? "bg-[#16a34a]" : "bg-[#d97706]")} />
                        {pg.status}
                      </span>
                    </td>
                    <td className="py-3 pl-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-[11px] cursor-pointer"
                        onClick={() => {
                          const next = pg.status === "published" ? "draft" : "published";
                          onUpdateEnterprise((p) => ({
                            ...p,
                            cmsPages: p.cmsPages.map((x) => (x.id === pg.id ? { ...x, status: next } : x)),
                          }));
                          onLogAudit("cms.page_updated", "cms_pages", pg.id, `${pg.title} set to ${next}`);
                          toast.success(`${pg.title} marked as ${next}`);
                        }}
                      >
                        {pg.status === "published" ? "Unpublish" : "Publish"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  /* ===================== 17. NOTIFICATIONS MANAGEMENT ===================== */
  if (mode === "notifications") {
    const handleSendBroadcast = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!notifTitle.trim()) return;
      const dbAudience =
        notifAudience === "Employers Only"
          ? "Employers"
          : notifAudience === "Candidates Only"
            ? "Candidates"
            : "All Users";
      const res = await adminBroadcastNotification(
        notifTitle.trim(),
        `${notifChannel} announcement · ${notifSegment.trim() || notifAudience}`,
        dbAudience
      );
      const rec: NotificationBroadcastRecord = {
        id: `ntf-${Date.now()}`,
        title: notifTitle.trim(),
        channel: notifChannel,
        audience: notifAudience,
        segmentDetail: notifSegment.trim() || "Default audience",
        status: "sent",
        deliveredCount:
          res.persisted && typeof res.data === "number" ? res.data : 0,
        openRatePct: 0,
        sentAt: "Just now",
      };
      onUpdateEnterprise((p) => ({ ...p, notifications: [rec, ...p.notifications] }));
      onLogAudit("notification.broadcast_sent", "notifications", rec.id, `${rec.channel} broadcast to ${rec.audience}: ${rec.title}`);
      setNotifTitle("");
      toast.success(
        res.persisted
          ? `Delivered live notification to ${rec.deliveredCount} user(s)`
          : `Dispatched ${rec.channel} notification to ${rec.audience}`
      );
    };

    return (
      <div className="space-y-5">
        <form onSubmit={handleSendBroadcast} className="rounded-xl border border-[#001D44] bg-[#002C66] p-5 text-white space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Platform broadcast &amp; segmented notification composer</h3>
            <span className="font-mono text-[11px] text-blue-200/80">Push · Email · SMS · WhatsApp · System Alert</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-5">
              <label className="block text-xs text-blue-100/85 mb-1">Notification message</label>
              <Input
                value={notifTitle}
                onChange={(e) => setNotifTitle(e.target.value)}
                placeholder="Write announcement, alert, or cohort reminder"
                className="h-9 text-xs bg-white text-[#111827] border-2 border-[#FB923C]"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-blue-100/85 mb-1">Channel</label>
              <select value={notifChannel} onChange={(e) => setNotifChannel(e.target.value as NotificationBroadcastRecord["channel"])} className="h-9 w-full rounded-lg bg-white px-2.5 text-xs text-[#111827]">
                {["Push", "Email", "SMS", "WhatsApp", "System Alert"].map((ch) => (
                  <option key={ch} value={ch}>{ch}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-blue-100/85 mb-1">Audience</label>
              <select value={notifAudience} onChange={(e) => setNotifAudience(e.target.value as NotificationBroadcastRecord["audience"])} className="h-9 w-full rounded-lg bg-white px-2.5 text-xs text-[#111827]">
                {["All Users", "Candidates Only", "Employers Only", "Segmented"].map((au) => (
                  <option key={au} value={au}>{au}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-3 flex items-end gap-2">
              <div className="flex-1">
                <label className="block text-xs text-blue-100/85 mb-1">Segment filter</label>
                <Input value={notifSegment} onChange={(e) => setNotifSegment(e.target.value)} className="h-9 text-xs bg-white text-[#111827]" />
              </div>
              <Button type="submit" size="sm" className="h-9 bg-white text-[#002C66] hover:bg-blue-50 text-xs font-medium gap-1.5 cursor-pointer shrink-0">
                <Send className="h-3.5 w-3.5" strokeWidth={1.5} />
                Send
              </Button>
            </div>
          </div>
        </form>

        <div className="space-y-2.5">
          {enterprise.notifications.map((n) => (
            <div key={n.id} className="rounded-xl border border-[#111827]/[0.08] p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={cn("h-1.5 w-1.5 rounded-full", n.status === "sent" ? "bg-[#16a34a]" : "bg-[#002C66]")} />
                  <span className="font-medium text-[#111827]">{n.title}</span>
                </div>
                <p className="text-[#6b7487]">
                  {n.channel} · {n.audience} ({n.segmentDetail}) · {n.sentAt}
                </p>
              </div>
              <div className="font-mono text-[11px] text-[#4b5565] tabular-nums text-right">
                <p>{n.deliveredCount.toLocaleString("en-IN")} delivered</p>
                <p className="text-[#6b7487]">{n.openRatePct > 0 ? `${n.openRatePct}% open rate` : "Tracking live"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ===================== 18B. SUPPORT KNOWLEDGE BASE & FAQ ===================== */
  const handleAddKb = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kbTitle.trim()) return;
    const item: KnowledgeBaseArticle = {
      id: `kb-${Date.now()}`,
      code: `KB-${Math.floor(200 + Math.random() * 700)}`,
      title: kbTitle.trim(),
      audience: kbAudience,
      views: 0,
      helpfulPct: 100,
      status: "published",
      updatedAt: "Just now",
    };
    onUpdateEnterprise((p) => ({ ...p, kbArticles: [item, ...p.kbArticles] }));
    onLogAudit("support_kb.created", "knowledge_base", item.code, `Published KB article ${item.title}`);
    setKbTitle("");
    toast.success(`Published KB article ${item.code}`);
  };

  return (
    <div className="space-y-5">
      <form onSubmit={handleAddKb} className="flex flex-wrap gap-2 rounded-xl border border-[#111827]/[0.08] bg-[#f5f7fa] p-3.5 items-center">
        <select value={kbAudience} onChange={(e) => setKbAudience(e.target.value as KnowledgeBaseArticle["audience"])} className="h-9 rounded-lg border border-[#111827]/[0.12] bg-white px-3 text-xs">
          {["Candidate", "Employer", "Mentor", "Billing"].map((a) => (
            <option key={a} value={a}>{a} FAQ</option>
          ))}
        </select>
        <Input value={kbTitle} onChange={(e) => setKbTitle(e.target.value)} placeholder="Add new support knowledge base article or FAQ title" className="h-9 flex-1 min-w-[220px] text-xs bg-white" />
        <Button type="submit" size="sm" className="h-9 bg-[#002C66] text-white text-xs gap-1.5 cursor-pointer">
          <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
          Publish article
        </Button>
      </form>

      <div className="space-y-2.5">
        {enterprise.kbArticles.map((art) => (
          <div key={art.id} className="rounded-xl border border-[#111827]/[0.08] p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <p className="font-medium text-[#111827]">{art.title}</p>
              <p className="font-mono text-[11px] text-[#6b7487]">{art.code} · {art.audience} · Updated {art.updatedAt}</p>
            </div>
            <div className="font-mono text-[11px] text-[#4b5565] tabular-nums">
              {art.views.toLocaleString("en-IN")} views · {art.helpfulPct}% helpful
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
