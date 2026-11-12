import { useCallback, useEffect, useMemo, useState } from "react";
import { Bell, BellRing, CheckCheck, ChevronRight, Lightbulb, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  applicationIdFromLink, listEmployerNotifications, markNotificationActed, markNotificationsRead, type EmployerNotification,
} from "@/services/employer/ats";
import type { NavigateFn } from "./EmployerOverview";
import { EmptyState, ErrorState, Loading, PageHeader, relativeTime } from "./employerUi";

interface Props {
  onNavigate: NavigateFn;
  onToast: (message: string) => void;
  onUnreadChange?: (unread: number) => void;
}

type Filter = "all" | "followups" | "applications" | "unread";

const FILTERS: Array<{ id: Filter; label: string }> = [
  { id: "all", label: "All" },
  { id: "followups", label: "Follow-ups" },
  { id: "applications", label: "Applications" },
  { id: "unread", label: "Unread" },
];

export function EmployerNotificationsLive({ onNavigate, onToast, onUnreadChange }: Props) {
  const [items, setItems] = useState<EmployerNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  const load = useCallback(async () => {
    setError(null);
    try {
      const rows = await listEmployerNotifications();
      setItems(rows);
      onUnreadChange?.(rows.filter((r) => !r.read_at).length);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load notifications.");
    } finally {
      setLoading(false);
    }
  }, [onUnreadChange]);

  useEffect(() => { void load(); }, [load]);

  const visible = useMemo(() => items.filter((n) => {
    if (filter === "followups") return n.kind === "employer_followup";
    if (filter === "applications") return n.kind === "application" || n.kind === "employer_application";
    if (filter === "unread") return !n.read_at;
    return true;
  }), [items, filter]);

  const unread = items.filter((n) => !n.read_at).length;

  const open = async (n: EmployerNotification) => {
    const appId = n.data.application_id ?? applicationIdFromLink(n.link);
    try {
      if (n.kind === "employer_followup") await markNotificationActed(n.id);
      else if (!n.read_at) await markNotificationsRead([n.id]);
    } catch {
      /* navigating still works if marking fails */
    }
    if (appId) onNavigate("pipe", { application: appId });
    else void load();
  };

  const markAll = async () => {
    try {
      await markNotificationsRead();
      onToast("All notifications marked as read.");
      await load();
    } catch (e) {
      onToast(e instanceof Error ? e.message : "Could not update notifications.");
    }
  };

  return (
    <div className="employer-workspace space-y-5">
      <PageHeader
        eyebrow="Notifications"
        icon={<Bell size={13} />}
        title="Notifications"
        description="New applications and follow-up reminders for candidates waiting on a decision."
        actions={
          <>
            <Button size="sm" variant="outline" onClick={() => onNavigate("security")}><Settings className="mr-1.5 h-4 w-4" />Preferences</Button>
            <Button size="sm" variant="outline" disabled={unread === 0} onClick={() => void markAll()}><CheckCheck className="mr-1.5 h-4 w-4" />Mark all read</Button>
          </>
        }
      />

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Notification filters">
        {FILTERS.map((f) => (
          <Button key={f.id} role="tab" aria-selected={filter === f.id} size="sm" variant={filter === f.id ? "default" : "outline"} onClick={() => setFilter(f.id)}>
            {f.label}{f.id === "unread" && unread > 0 ? ` (${unread})` : ""}
          </Button>
        ))}
      </div>

      {loading ? <Loading label="Loading notifications" /> : error ? <ErrorState message={error} onRetry={load} /> : visible.length === 0 ? (
        <div className="workspace-panel"><EmptyState icon={<BellRing />} title="You are all caught up" hint="New applications and reminders will show up here." /></div>
      ) : (
        <ul className="workspace-panel divide-y divide-border !p-0" aria-label="Notifications">
          {visible.map((n) => {
            const followup = n.kind === "employer_followup";
            const target = n.data.application_id ?? applicationIdFromLink(n.link);
            return (
              <li key={n.id} className={`flex gap-3 p-4 ${n.read_at ? "" : "bg-primary/5"}`}>
                <span className="workspace-icon !h-9 !w-9 shrink-0">{followup ? <Lightbulb size={16} /> : <Bell size={16} />}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">{n.title}</p>
                    {!n.read_at && <span className="h-2 w-2 rounded-full bg-primary" aria-label="Unread" />}
                    {followup && <span className="workspace-chip !px-2 !py-0.5 !text-[10px]">{n.acted_at ? "Actioned" : "Needs action"}</span>}
                  </div>
                  {n.body && <p className="mt-1 text-xs text-muted-foreground">{n.body}</p>}
                  {followup && n.data.suggested_action && !n.acted_at && (
                    <p className="mt-2 rounded-md bg-muted/60 p-2 text-xs"><strong>Suggested next step:</strong> {n.data.suggested_action}</p>
                  )}
                  <p className="mt-2 text-[11px] text-muted-foreground">{relativeTime(n.created_at)}</p>
                </div>
                {target ? (
                  <Button size="sm" variant={followup && !n.acted_at ? "default" : "outline"} className="self-center" onClick={() => void open(n)}>
                    {followup ? "Review" : "Open"}<ChevronRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                ) : !n.read_at ? (
                  <Button size="sm" variant="ghost" className="self-center" onClick={() => void markNotificationsRead([n.id]).then(load)}>Mark read</Button>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
