import React, { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Calendar,
  Download,
  Eye,
  GraduationCap,
  Plus,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProView } from "./proTypes";

interface EmployerAnalyticsShowcaseProps {
  companyName: string;
  activeJobsCount: number;
  totalApplications: number;
  avgMatchPercent?: number;
  walletBalance: number;
  topJobTitles?: string[];
  onNavigate: (view: ProView, query?: Record<string, string>) => void;
  onToast?: (msg: string) => void;
}

const DATE_RANGES = [
  "Nov 12 – Nov 18, 2026",
  "Nov 1 – Nov 18, 2026",
  "Last 30 Days",
] as const;

const DAYS = ["Nov 12", "Nov 13", "Nov 14", "Nov 15", "Nov 16", "Nov 17", "Nov 18"];

function buildSmoothAreaPaths(values: number[], width = 260, height = 96) {
  const max = Math.max(...values, 1) * 1.15;
  const padX = 8;
  const padY = 10;
  const usableW = width - padX * 2;
  const usableH = height - padY * 2;

  const pts = values.map((v, i) => {
    const x = padX + (i / (values.length - 1)) * usableW;
    const y = padY + usableH - (v / max) * usableH;
    return { x: Number(x.toFixed(1)), y: Number(y.toFixed(1)) };
  });

  let line = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i];
    const p1 = pts[i + 1];
    const midX = Number(((p0.x + p1.x) / 2).toFixed(1));
    line += ` C ${midX} ${p0.y}, ${midX} ${p1.y}, ${p1.x} ${p1.y}`;
  }

  const area = `${line} L ${pts[pts.length - 1].x} ${height - 4} L ${pts[0].x} ${height - 4} Z`;
  return { line, area, pts };
}

export const EmployerAnalyticsShowcase: React.FC<EmployerAnalyticsShowcaseProps> = ({
  companyName,
  activeJobsCount,
  totalApplications,
  avgMatchPercent = 86,
  walletBalance,
  topJobTitles = [],
  onNavigate,
  onToast,
}) => {
  const [rangeIdx, setRangeIdx] = useState(0);
  const currentRange = DATE_RANGES[rangeIdx];

  const role1 = topJobTitles[0] || "Senior React Developer";
  const role2 = topJobTitles[1] || "Cloud Platform Engineer";
  const role3 = topJobTitles[2] || "Product Data Analyst";

  const handleExportReport = () => {
    const rows = [
      ["Channel", "Impressions", "Applications", "Shortlist Rate", "Avg CIR Score", "Top Role"],
      ["Engineering & Tech Roles", "12,450", "162", "34.5%", "88%", role1],
      ["Verified CIR Talent Pool", "7,830", "98", "41.8%", "91%", role2],
      ["Campus & Assessment Drives", "4,400", "52", "29.4%", "85%", role3],
    ];
    try {
      const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      if (typeof URL !== "undefined" && URL.createObjectURL) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-hiring-report.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      // ignore in test environments without Blob download
    }
    onToast?.("Exported hiring campaign analytics report (CSV).");
  };

  const kpiCards = [
    {
      label: "Total Impressions",
      value: "24.68K",
      delta: "↑ 18.2%",
      compare: "vs Nov 5 – Nov 11",
      icon: Eye,
      iconBg: "bg-[#002C66] text-white",
      onClick: () => onNavigate("post"),
    },
    {
      label: "Total Applications",
      value: totalApplications > 0 ? `${totalApplications} (${activeJobsCount} jobs)` : "312",
      delta: "↑ 22.4%",
      compare: "vs Nov 5 – Nov 11",
      icon: Users,
      iconBg: "bg-[#FB923C] text-white",
      onClick: () => onNavigate("pipe"),
    },
    {
      label: "Avg. CIR Match",
      value: `${avgMatchPercent || 86}%`,
      delta: "↑ 6.8%",
      compare: "vs Nov 5 – Nov 11",
      icon: TrendingUp,
      iconBg: "bg-[#0D9488] text-white",
      onClick: () => onNavigate("ai-hub"),
    },
    {
      label: "Company Wallet",
      value: `₹${Number(walletBalance || 0).toLocaleString("en-IN")}`,
      delta: "↑ 14.5%",
      compare: "Active hiring credits",
      icon: Wallet,
      iconBg: "bg-[#1D4ED8] text-white",
      onClick: () => onNavigate("talent", { recharge: "1" }),
    },
  ];

  const channels = [
    {
      title: "Engineering Roles",
      icon: Briefcase,
      accentHex: "#0D9488",
      badgeClass: "bg-[#0D9488]/12 text-[#0D9488]",
      linkColor: "text-[#0D9488]",
      impressions: "12.45K",
      impDelta: "↑ 19.3%",
      series: [3.2, 3.6, 3.1, 4.3, 3.9, 4.9, 5.4],
      applications: "162",
      appDelta: "↑ 21.1%",
      shortlistRate: "34.5%",
      shortlistDelta: "↑ 6.4%",
      cirScore: "88 / 100",
      cirDelta: "↑ 3.7%",
      topRole: role1,
      view: "post" as ProView,
    },
    {
      title: "Verified Talent Pool",
      icon: Sparkles,
      accentHex: "#F97316",
      badgeClass: "bg-[#F97316]/12 text-[#F97316]",
      linkColor: "text-[#F97316]",
      impressions: "7.83K",
      impDelta: "↑ 16.8%",
      series: [3.8, 3.3, 4.1, 3.7, 4.5, 4.2, 5.1],
      applications: "98",
      appDelta: "↑ 33.2%",
      shortlistRate: "41.8%",
      shortlistDelta: "↑ 5.8%",
      cirScore: "91 / 100",
      cirDelta: "↑ 5.2%",
      topRole: role2,
      view: "talent" as ProView,
    },
    {
      title: "Campus & Assessments",
      icon: GraduationCap,
      accentHex: "#002C66",
      badgeClass: "bg-[#002C66]/12 text-[#002C66]",
      linkColor: "text-[#002C66]",
      impressions: "4.40K",
      impDelta: "↑ 17.2%",
      series: [1.9, 1.7, 2.3, 2.0, 2.4, 2.2, 2.8],
      applications: "52",
      appDelta: "↑ 12.0%",
      shortlistRate: "29.4%",
      shortlistDelta: "↑ 4.9%",
      cirScore: "85 / 100",
      cirDelta: "↑ 4.1%",
      topRole: role3,
      view: "campus-hiring" as ProView,
    },
  ];

  // Multi-series line chart paths (Bottom Left Card)
  const chartW = 520;
  const chartH = 170;
  const engPath = buildSmoothAreaPaths([32, 36, 35, 44, 42, 51, 58], chartW, chartH);
  const verPath = buildSmoothAreaPaths([22, 26, 23, 29, 31, 35, 39], chartW, chartH);
  const camPath = buildSmoothAreaPaths([12, 15, 13, 18, 17, 21, 24], chartW, chartH);

  // Donut segments (circumference for r=54 is 2 * pi * 54 ≈ 339.29)
  const circumference = 2 * Math.PI * 54;
  const seg1 = 0.505 * circumference;
  const seg2 = 0.317 * circumference;
  const seg3 = 0.178 * circumference;

  return (
    <div className="space-y-5">
      {/* ===== 1. REFERENCE TOP HEADER BAR ===== */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-foreground flex items-center gap-2">
            <span>Welcome back, {companyName}</span>
            <span aria-hidden="true">👋</span>
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening with your hiring campaigns and verified talent pipeline.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setRangeIdx((i) => (i + 1) % DATE_RANGES.length)}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground hover:border-primary/40 transition-colors cursor-pointer"
            title="Click to switch date range"
          >
            <Calendar className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span>{currentRange}</span>
          </button>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onNavigate("post", { new: "1" })}
            className="h-9 rounded-xl text-xs font-semibold gap-1.5 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Create Job
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleExportReport}
            className="h-9 rounded-xl bg-[#002C66] hover:bg-[#001F4D] text-white text-xs font-semibold gap-1.5 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            Export Report
          </Button>
        </div>
      </div>

      {/* ===== 2. REFERENCE 4-COLUMN KPI SUMMARY BAR ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 rounded-2xl border border-border/80 bg-muted/20 p-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <button
              key={kpi.label}
              type="button"
              onClick={kpi.onClick}
              className="group flex items-start gap-3.5 rounded-xl bg-card border border-border/60 p-4 text-left shadow-2xs hover:border-primary/40 transition-all cursor-pointer"
            >
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-xs ${kpi.iconBg}`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-muted-foreground truncate">{kpi.label}</p>
                <p className="mt-0.5 text-xl sm:text-2xl font-extrabold font-display tracking-tight text-foreground tabular-nums truncate">
                  {kpi.value}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-[11px]">
                  <span className="font-bold text-emerald-600">{kpi.delta}</span>
                  <span className="text-muted-foreground truncate">{kpi.compare}</span>
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ===== 3. REFERENCE 3-COLUMN CHANNEL SPARKLINE CARDS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 rounded-2xl border border-border/80 bg-card p-5 shadow-2xs">
        {channels.map((ch) => {
          const Icon = ch.icon;
          const { line, area, pts } = buildSmoothAreaPaths(ch.series);
          return (
            <article
              key={ch.title}
              className="flex flex-col justify-between rounded-xl border border-border/60 bg-background/50 p-4 space-y-4"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${ch.badgeClass}`}>
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <h2 className="text-sm font-bold text-foreground truncate">{ch.title}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate(ch.view)}
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold hover:underline cursor-pointer shrink-0 ${ch.linkColor}`}
                >
                  View Details <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </button>
              </div>

              {/* Primary Impressions Metric */}
              <div>
                <p className="text-[11px] text-muted-foreground">Candidate Reach</p>
                <div className="mt-0.5 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold font-display tracking-tight text-foreground tabular-nums">
                    {ch.impressions}
                  </span>
                  <span className="text-xs font-bold text-emerald-600">{ch.impDelta}</span>
                </div>
              </div>

              {/* Smooth SVG Area + Line Chart */}
              <div className="pt-1">
                <svg
                  viewBox="0 0 260 104"
                  className="w-full h-28 overflow-visible"
                  role="img"
                  aria-label={`${ch.title} 7-day trend chart`}
                >
                  {[20, 50, 80].map((y) => (
                    <line
                      key={y}
                      x1={8}
                      y1={y}
                      x2={252}
                      y2={y}
                      stroke="currentColor"
                      className="text-border"
                      strokeDasharray="3 3"
                      strokeWidth="1"
                    />
                  ))}
                  <path d={area} fill={ch.accentHex} fillOpacity="0.14" />
                  <path
                    d={line}
                    fill="none"
                    stroke={ch.accentHex}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  {pts.map((pt, idx) => (
                    <circle
                      key={idx}
                      cx={pt.x}
                      cy={pt.y}
                      r="3"
                      fill="#FFFFFF"
                      stroke={ch.accentHex}
                      strokeWidth="2"
                    />
                  ))}
                </svg>
                <div className="flex items-center justify-between px-1 text-[10px] text-muted-foreground">
                  <span>Nov 12</span>
                  <span>Nov 14</span>
                  <span>Nov 16</span>
                  <span>Nov 18</span>
                </div>
              </div>

              {/* 3 Breakdown Metric Rows */}
              <dl className="space-y-2 border-t border-border/60 pt-3 text-xs">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Applications</dt>
                  <dd className="flex items-center gap-2 font-semibold text-foreground tabular-nums">
                    <span>{ch.applications}</span>
                    <span className="text-[11px] font-bold text-emerald-600">{ch.appDelta}</span>
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Shortlist Rate</dt>
                  <dd className="flex items-center gap-2 font-semibold text-foreground tabular-nums">
                    <span>{ch.shortlistRate}</span>
                    <span className="text-[11px] font-bold text-emerald-600">{ch.shortlistDelta}</span>
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Avg. CIR Score</dt>
                  <dd className="flex items-center gap-2 font-semibold text-foreground tabular-nums">
                    <span>{ch.cirScore}</span>
                    <span className="text-[11px] font-bold text-emerald-600">{ch.cirDelta}</span>
                  </dd>
                </div>
              </dl>

              {/* Top Campaign / Role Footer */}
              <div className="flex items-center justify-between gap-2 border-t border-border/60 pt-3 text-xs">
                <span className="text-muted-foreground shrink-0">Top Role</span>
                <button
                  type="button"
                  onClick={() => onNavigate("pipe")}
                  className={`truncate rounded-md px-2 py-0.5 text-[11px] font-semibold hover:underline cursor-pointer ${ch.badgeClass}`}
                >
                  {ch.topRole}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* ===== 4. REFERENCE BOTTOM 2-COLUMN ANALYTICS: MULTI-LINE TREND + DONUT CHART ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 rounded-2xl border border-border/80 bg-card p-5 shadow-2xs">
        {/* Left: Applications Over Time (All Channels) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-foreground">
                Applications Over Time (All Channels)
              </h2>
              <div className="mt-1.5 flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#0D9488]" />
                  Engineering Roles
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#F97316]" />
                  Verified Talent Pool
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#002C66]" />
                  Campus &amp; Assessments
                </span>
              </div>
            </div>
            <span className="rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-semibold text-foreground">
              Daily
            </span>
          </div>

          <div className="pt-1">
            <svg
              viewBox={`0 0 ${chartW} ${chartH}`}
              className="w-full h-44 overflow-visible"
              role="img"
              aria-label="Applications over time across all channels"
            >
              {[30, 75, 120, 155].map((y) => (
                <line
                  key={y}
                  x1={8}
                  y1={y}
                  x2={chartW - 8}
                  y2={y}
                  stroke="currentColor"
                  className="text-border"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
              ))}

              {/* Series 1: Engineering Roles (#0D9488) */}
              <path
                d={engPath.line}
                fill="none"
                stroke="#0D9488"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              {engPath.pts.map((pt, i) => (
                <circle
                  key={`e-${i}`}
                  cx={pt.x}
                  cy={pt.y}
                  r="3.2"
                  fill="#FFFFFF"
                  stroke="#0D9488"
                  strokeWidth="2"
                />
              ))}

              {/* Series 2: Verified Talent Pool (#F97316) */}
              <path
                d={verPath.line}
                fill="none"
                stroke="#F97316"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              {verPath.pts.map((pt, i) => (
                <circle
                  key={`v-${i}`}
                  cx={pt.x}
                  cy={pt.y}
                  r="3.2"
                  fill="#FFFFFF"
                  stroke="#F97316"
                  strokeWidth="2"
                />
              ))}

              {/* Series 3: Campus & Assessments (#002C66) */}
              <path
                d={camPath.line}
                fill="none"
                stroke="#002C66"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              {camPath.pts.map((pt, i) => (
                <circle
                  key={`c-${i}`}
                  cx={pt.x}
                  cy={pt.y}
                  r="3.2"
                  fill="#FFFFFF"
                  stroke="#002C66"
                  strokeWidth="2"
                />
              ))}
            </svg>

            <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-muted-foreground">
              {DAYS.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Applications by Channel Donut Chart */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-border/60 bg-background/40 p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-foreground">Applications by Channel</h2>
            <button
              type="button"
              onClick={() => onNavigate("employer-analytics")}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer"
            >
              View Full Breakdown <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </button>
          </div>

          <div className="my-3 flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="relative h-36 w-36 shrink-0">
              <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
                <circle
                  cx="70"
                  cy="70"
                  r="54"
                  fill="none"
                  stroke="currentColor"
                  className="text-muted"
                  strokeWidth="18"
                />
                <circle
                  cx="70"
                  cy="70"
                  r="54"
                  fill="none"
                  stroke="#0D9488"
                  strokeWidth="18"
                  strokeDasharray={`${seg1} ${circumference}`}
                  strokeDashoffset="0"
                />
                <circle
                  cx="70"
                  cy="70"
                  r="54"
                  fill="none"
                  stroke="#F97316"
                  strokeWidth="18"
                  strokeDasharray={`${seg2} ${circumference}`}
                  strokeDashoffset={-seg1}
                />
                <circle
                  cx="70"
                  cy="70"
                  r="54"
                  fill="none"
                  stroke="#002C66"
                  strokeWidth="18"
                  strokeDasharray={`${seg3} ${circumference}`}
                  strokeDashoffset={-(seg1 + seg2)}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-base font-extrabold font-display text-foreground tabular-nums">
                  24.68K
                </span>
                <span className="text-[10px] font-semibold text-muted-foreground">Total Reach</span>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#0D9488]" />
                <div>
                  <p className="font-bold text-foreground">Engineering Roles</p>
                  <p className="text-[11px] text-muted-foreground">12.45K (50.5%)</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#F97316]" />
                <div>
                  <p className="font-bold text-foreground">Verified Talent Pool</p>
                  <p className="text-[11px] text-muted-foreground">7.83K (31.7%)</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#002C66]" />
                <div>
                  <p className="font-bold text-foreground">Campus &amp; Assessments</p>
                  <p className="text-[11px] text-muted-foreground">4.40K (17.8%)</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerAnalyticsShowcase;
