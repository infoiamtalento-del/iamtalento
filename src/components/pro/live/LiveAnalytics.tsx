import React, { useEffect, useState } from "react";
import { BarChart3, Eye, Briefcase, Award, BookOpen, Globe, Copy, Check, ExternalLink, Loader2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProHero } from "../ProHero";
import { useAsync } from "@/hooks/useAsync";
import { fetchAnalytics } from "@/services/candidate/platform";
import { loadLiveProfile, setPortfolioSlug } from "@/services/candidate/profile";
import { backendErrorMessage } from "@/hooks/useCandidateBackend";

const STAGES = ["Applied", "Shortlisted", "Interview", "Offered", "Hired", "Rejected"] as const;

export const LiveAnalytics: React.FC<{ onToast: (m: string) => void }> = ({ onToast }) => {
  const analytics = useAsync(fetchAnalytics);
  const profile = useAsync(loadLiveProfile);

  const [slug, setSlug] = useState("");
  const [savingSlug, setSavingSlug] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (profile.data?.profile?.portfolio_slug) {
      setSlug(profile.data.profile.portfolio_slug);
    }
  }, [profile.data?.profile?.portfolio_slug]);

  const handleSaveSlug = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = slug.trim().toLowerCase();
    if (cleaned && !/^[a-z0-9][a-z0-9-]{2,38}[a-z0-9]$/.test(cleaned)) {
      onToast("Use 4–40 lowercase letters, numbers, or hyphens (e.g. aarav-sharma).");
      return;
    }
    setSavingSlug(true);
    try {
      await setPortfolioSlug(cleaned || null);
      await profile.reload();
      onToast(cleaned ? `Public portfolio live at /u/${cleaned}` : "Public portfolio URL cleared.");
    } catch (err) {
      onToast(backendErrorMessage(err));
    } finally {
      setSavingSlug(false);
    }
  };

  const activeSlug = profile.data?.profile?.portfolio_slug;
  const shareUrl = activeSlug && typeof window !== "undefined" ? `${window.location.origin}/u/${activeSlug}` : "";

  const copyShareUrl = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  const data = analytics.data;
  const maxWeekly = Math.max(1, ...(data?.weekly_applications.map((w) => w.count) ?? [1]));

  return (
    <div className="space-y-6">
      <ProHero
        icon={<BarChart3 />}
        title="Career Pipeline & Portfolio Analytics"
        subtitle="Live server-computed conversion funnel, match score averages, assessment readiness, and public portfolio traffic."
      />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Active Applications</span>
            <Briefcase className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-extrabold font-display">{data?.applications_total ?? 0}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Avg match score: <strong>{data?.avg_match != null ? `${data.avg_match}%` : "—"}</strong>
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Portfolio Views (30d)</span>
            <Eye className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-extrabold font-display">{data?.profile_views_30d ?? 0}</p>
          <p className="text-xs text-muted-foreground mt-1">
            All-time unique views: <strong>{data?.profile_views_total ?? 0}</strong>
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Proctored Assessments</span>
            <Award className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-extrabold font-display">{data?.assessments_completed ?? 0}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Best score: <strong>{data?.best_assessment != null ? `${Math.round(Number(data.best_assessment))}%` : "—"}</strong>
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Readiness &amp; Learning</span>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-extrabold font-display">
            {data?.readiness != null && Number(data.readiness) > 0 ? `${Math.round(Number(data.readiness))}%` : "—"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            <BookOpen className="inline h-3.5 w-3.5 mr-1" />
            <strong>{data?.courses_completed ?? 0}</strong> courses completed · <strong>{data?.saved_jobs ?? 0}</strong> saved jobs
          </p>
        </div>
      </div>

      {/* Stage Funnel + Weekly Activity */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <h2 className="text-sm font-bold">Applications by Stage</h2>
          <div className="space-y-2.5">
            {STAGES.map((stage) => {
              const count = data?.by_stage?.[stage] ?? 0;
              const total = Math.max(1, data?.applications_total ?? 1);
              const pct = Math.min(100, Math.round((count / total) * 100));
              return (
                <div key={stage} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">{stage}</span>
                    <span className="font-bold">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${count > 0 ? Math.max(pct, 6) : 0}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <h2 className="text-sm font-bold">Weekly Application Cadence (Last 8 Weeks)</h2>
          {(data?.weekly_applications.length ?? 0) === 0 ? (
            <p className="text-xs text-muted-foreground py-6">
              Apply to live roles in Browse Jobs to track your weekly momentum here.
            </p>
          ) : (
            <div className="space-y-2">
              {data!.weekly_applications.map((w) => (
                <div key={w.week} className="flex items-center gap-3 text-xs">
                  <span className="w-24 text-muted-foreground font-mono">{w.week}</span>
                  <div className="flex-1 h-2.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${Math.max(8, Math.round((w.count / maxWeekly) * 100))}%` }}
                    />
                  </div>
                  <span className="w-6 text-right font-bold">{w.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Shareable Public Portfolio Slug */}
      <form onSubmit={handleSaveSlug} method="post" className="rounded-2xl border border-border bg-card p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold">Shareable Public Portfolio URL</h2>
        </div>
        <p className="text-xs text-muted-foreground">
          Claim a custom handle so recruiters can inspect your verified skills, projects, and CIR tier—and track every visit above.
        </p>
        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="flex-1">
            <Label htmlFor="portfolio-slug" className="text-xs font-semibold">
              Custom handle (4–40 lowercase letters, digits, hyphens)
            </Label>
            <div className="mt-1.5 flex items-center rounded-lg border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
              <span className="text-xs text-muted-foreground select-none">/u/</span>
              <Input
                id="portfolio-slug"
                name="portfolio_slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                placeholder="your-name"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                maxLength={40}
                className="border-0 focus-visible:ring-0 px-1.5 h-9"
              />
            </div>
          </div>
          <Button type="submit" disabled={savingSlug}>
            {savingSlug ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : null}
            Save Handle
          </Button>
        </div>

        {activeSlug && (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-muted/60 px-3.5 py-2.5 text-xs">
            <span className="font-mono truncate">{shareUrl}</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={copyShareUrl}
                className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy link"}
              </button>
              <a
                href={`/u/${activeSlug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
              >
                Open <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
