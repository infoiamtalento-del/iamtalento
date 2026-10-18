import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  ArrowUp,
  ChevronRight,
  Code2,
  Eye,
  Lightbulb,
  Megaphone,
  MoreVertical,
  Pause,
  PenTool,
  Play,
  Plus,
  Target,
  TrendingUp,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { ProView } from "./proTypes";
import type { ProUser } from "@/data/proData";
import type { EmployerDemoState } from "@/data/employerDemo";
import "./employer-workspace.css";

interface Props { state: EmployerDemoState; onChange: (state: EmployerDemoState) => void; onNavigate: (view: ProView) => void; onToast: (message: string) => void; user?: ProUser }

const campaignChip = [
  { icon: Megaphone, chip: "bg-primary/10 text-primary" },
  { icon: Users, chip: "bg-violet-500/10 text-violet-500" },
  { icon: Code2, chip: "bg-success/10 text-success" },
  { icon: PenTool, chip: "bg-amber-500/10 text-amber-600" },
];

const statusBadge = (status: string) => status === "Active" ? "bg-success/15 text-success" : status === "Paused" ? "bg-warning/15 text-warning" : "bg-muted text-muted-foreground";

const formatDate = (ts: number) => new Date(ts).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
const campaignDate = (id: number, at?: number) => formatDate(at ?? (id > 1e12 ? id : Date.now() - 86400000 * 28));

const AdvertiseIllustration = () => (
  <div aria-hidden="true" className="relative hidden h-36 w-52 items-center justify-center md:flex">
    <div className="absolute inset-x-3 bottom-2 h-24 rounded-[45%] bg-primary/5" />
    <div className="relative flex flex-col items-center">
      <div className="flex h-[76px] w-36 items-center justify-center rounded-xl border border-border bg-card shadow-sm">
        <Megaphone className="h-8 w-8 text-primary" />
      </div>
      <div className="-mt-px h-2.5 w-44 rounded-md bg-muted-foreground/15" />
    </div>
    <div className="absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card shadow-sm"><UserRound className="h-4 w-4 text-primary/70" /></div>
    <div className="absolute right-2 top-12 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card shadow-sm"><UserRound className="h-4 w-4 text-primary/50" /></div>
    <div className="absolute bottom-3 right-1 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card shadow-sm"><TrendingUp className="h-4 w-4 text-success" /></div>
  </div>
);

export function ProEmployerAdvertise({ state, onChange, onNavigate, onNavigate: _nav, onToast }: Props & { onNavigate: (view: ProView) => void }) {
  const [name, setName] = useState("");
  const [showAll, setShowAll] = useState(false);
  const campaigns = state.campaigns;
  const totalViews = campaigns.reduce((sum, c) => sum + c.views, 0);
  const totalApps = campaigns.reduce((sum, c) => sum + c.clicks, 0);

  const stats: { label: string; value: string; delta: number; icon: LucideIcon; chip: string }[] = [
    { label: "Total Campaigns", value: String(campaigns.length), delta: 20, icon: Megaphone, chip: "bg-primary/10 text-primary" },
    { label: "Total Views", value: totalViews.toLocaleString("en-IN"), delta: 32, icon: Eye, chip: "bg-success/10 text-success" },
    { label: "Total Applications", value: totalApps.toLocaleString("en-IN"), delta: 18, icon: Users, chip: "bg-violet-500/10 text-violet-500" },
    { label: "Conversion Rate", value: totalViews ? `${((totalApps / totalViews) * 100).toFixed(2)}%` : "0%", delta: 12, icon: Target, chip: "bg-amber-500/10 text-amber-600" },
  ];

  const visible = showAll ? campaigns : campaigns.slice(0, 4);

  const createDemo = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    onChange({ ...state, campaigns: [{ id: Date.now(), name: name.trim(), status: "Active", views: 0, clicks: 0, at: Date.now(), category: "General" }, ...campaigns] });
    setName("");
    onToast("Demo campaign created. No advertising was purchased.");
  };

  return (
    <div className="employer-workspace space-y-5">
      <header className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto_minmax(260px,320px)] lg:items-center">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Employer account</p>
          <h1 className="workspace-heading font-display">Advertise</h1>
          <p className="workspace-description">Promote your company and reach the right audience. Create and manage advertising campaigns to attract talent and grow your brand.</p>
        </div>
        <AdvertiseIllustration />
        <button type="button" onClick={() => _nav("support")} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition hover:border-primary/40">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Lightbulb className="h-5 w-5" /></span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold text-foreground">Get better reach</span>
            <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">Target the right talent with customized campaigns.</span>
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, delta, icon: Icon, chip }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${chip}`}><Icon className="h-5 w-5" /></span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="mt-1 font-display text-2xl font-bold leading-tight text-foreground">{value}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="flex items-center gap-0.5 text-xs font-semibold text-success"><ArrowUp className="h-3 w-3" />{delta}%</span>
              <span className="text-xs text-muted-foreground">vs last 7 days</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
        <section className="workspace-panel">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold">Recent Campaigns</h2>
            {campaigns.length > 4 && (
              <Button variant="ghost" size="sm" className="gap-1.5 text-primary hover:text-primary" onClick={() => setShowAll(s => !s)}>
                {showAll ? "Show Less" : "View All"}<ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs font-semibold text-muted-foreground">
                  <th className="py-3 pr-4 font-semibold">Campaign Name</th>
                  <th className="py-3 pr-4 font-semibold">Status</th>
                  <th className="py-3 pr-4 font-semibold">Start Date</th>
                  <th className="py-3 pr-4 font-semibold">Views</th>
                  <th className="py-3 pr-4 font-semibold">Applications</th>
                  <th className="py-3 font-semibold"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-sm text-muted-foreground">No campaigns yet. Create a demo campaign to preview this table.</td></tr>}
                {visible.map((record, index) => {
                  const { icon: RowIcon, chip } = campaignChip[index % campaignChip.length];
                  return (
                    <tr key={record.id} className="border-b border-border last:border-b-0">
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${chip}`}><RowIcon className="h-4 w-4" /></span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-foreground">{record.name}</p>
                            <p className="truncate text-xs text-muted-foreground">{record.category ?? "General"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pr-4"><span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusBadge(record.status)}`}>{record.status}</span></td>
                      <td className="py-4 pr-4 text-sm text-foreground">{campaignDate(record.id, record.at)}</td>
                      <td className="py-4 pr-4 text-sm text-foreground">{record.views.toLocaleString("en-IN")}</td>
                      <td className="py-4 pr-4 text-sm text-foreground">{record.clicks.toLocaleString("en-IN")}</td>
                      <td className="py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" aria-label={`Actions for ${record.name}`}><MoreVertical className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { onChange({ ...state, campaigns: campaigns.map(r => r.id === record.id ? { ...r, status: r.status === "Active" ? "Paused" : "Active" } : r) }); onToast(record.status === "Active" ? "Campaign paused (demo)." : "Campaign resumed (demo)."); }}>
                              {record.status === "Active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}{record.status === "Active" ? "Pause" : "Resume"}
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled={record.status !== "Active"} onClick={() => { onChange({ ...state, campaigns: campaigns.map(r => r.id === record.id ? { ...r, views: r.views + 120, clicks: r.clicks + 8 } : r) }); onToast("Sample engagement added. No real advertising ran."); }}>
                              <TrendingUp className="h-4 w-4" />Simulate engagement
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="workspace-panel flex flex-col">
          <span aria-hidden="true" className="mb-5 flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/5"><Target className="h-12 w-12 text-primary" /></span>
          <h2 className="text-xl font-bold">Create New Campaign</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Reach the right candidates with targeted advertising and grow your team faster.</p>
          <Button className="mt-5" onClick={() => _nav("support")}><Plus />Contact Support</Button>
          <div className="mt-5 border-t border-border pt-4">
            <p className="text-xs font-semibold text-muted-foreground">Demo: create a sample campaign</p>
            <form onSubmit={createDemo} className="mt-2 flex gap-2">
              <Input aria-label="Campaign name" required placeholder="Campaign name" value={name} onChange={e => setName(e.target.value)} />
              <Button type="submit" variant="outline" size="sm" className="shrink-0" aria-label="Create demo campaign"><Plus className="h-4 w-4" /></Button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}
