import React, { useState } from "react";
import { Bell, CheckCheck, Briefcase, Wallet, Award, GraduationCap, Trophy, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProHero } from "../ProHero";
import type { AppNotification } from "@/services/candidate/platform";
import type { ProView } from "../proTypes";

const ICONS: Record<string, React.ElementType> = {
  application: Briefcase, payment: Wallet, wallet: Wallet, cir: Award, learning: GraduationCap, hackathon: Trophy, verification: ShieldCheck,
};

const ago = (iso: string) => {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 3600) return `${Math.max(1, Math.floor(s / 60))}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

const linkToView = (link: string | null): ProView | null => {
  const m = link?.match(/view=([a-z-]+)/);
  return (m?.[1] as ProView) ?? null;
};

export const LiveNotifications: React.FC<{
  notifications: AppNotification[];
  onMarkRead: (ids?: string[]) => Promise<void>;
  onNavigate: (v: ProView) => void;
  onToast: (m: string) => void;
}> = ({ notifications, onMarkRead, onNavigate, onToast }) => {
  const [busy, setBusy] = useState(false);
  const unread = notifications.filter((n) => !n.read_at).length;

  const markAll = async () => {
    setBusy(true);
    try { await onMarkRead(); onToast("All notifications marked as read."); } finally { setBusy(false); }
  };

  return (
    <div className="space-y-6">
      <ProHero icon={<Bell />} title="Notifications" subtitle="Application updates, payments, reports and reminders, live from your account."
        aside={<Button variant="secondary" size="sm" disabled={busy || unread === 0} onClick={markAll}>
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCheck className="h-3.5 w-3.5 mr-1.5" />} Mark all read ({unread})
        </Button>} />
      {notifications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          You are all caught up. New activity will appear here instantly.
        </div>
      ) : (
        <ul className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
          {notifications.map((n) => {
            const Icon = ICONS[n.kind] ?? Bell;
            const target = linkToView(n.link);
            return (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={async () => { if (!n.read_at) await onMarkRead([n.id]); if (target) onNavigate(target); }}
                  className={`w-full text-left flex items-start gap-3 px-4 py-3.5 hover:bg-accent/40 transition-colors ${n.read_at ? "" : "bg-primary/[0.04]"}`}
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><Icon className="h-4 w-4" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      {n.title}{!n.read_at && <span className="h-2 w-2 rounded-full bg-primary" aria-label="unread" />}
                    </span>
                    {n.body && <span className="mt-0.5 block text-xs text-muted-foreground">{n.body}</span>}
                  </span>
                  <span className="shrink-0 text-[11px] text-muted-foreground">{ago(n.created_at)}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
