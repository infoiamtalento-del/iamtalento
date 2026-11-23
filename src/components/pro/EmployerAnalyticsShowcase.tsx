import React, { useState } from "react";
import {
  ArrowUpRight,
  Calendar,
  Download,
  Plus,
  ShieldCheck,
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
  "Last 30 days",
] as const;

const DAYS = ["Nov 12", "Nov 13", "Nov 14", "Nov 15", "Nov 16", "Nov 17", "Nov 18"];

function buildSmoothAreaPaths(values: number[], width = 540, height = 188) {
  const max = Math.max(...values, 1) * 1.15;
  const padX = 12;
  const padY = 14;
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

  const area = `${line} L ${pts[pts.length - 1].x} ${height - 6} L ${pts[0].x} ${height - 6} Z`;
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
      ["Engineering roles", "12,450", "162", "34.5%", "88%", role1],
      ["Verified CIR talent pool", "7,830", "98", "41.8%", "91%", role2],
      ["Campus & assessment drives", "4,400", "52", "29.4%", "85%", role3],
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
    onToast?.("Exported hiring campaign analytics report (CSV)");
  };

  const kpiCards = [
    {
      label: "Candidate impressions",
      value: "24,680",
      delta: "+18.2%",
      compare: "vs Nov 5–11",
      onClick: () => onNavigate("post"),
    },
    {
      label: "Total applications",
      value: totalApplications > 0 ? `${totalApplications}` : "312",
      delta: "+22.4%",
      compare: activeJobsCount > 0 ? `across ${activeJobsCount} active jobs` : "vs Nov 5–11",
      onClick: () => onNavigate("pipe"),
    },
    {
      label: "Average CIR match",
      value: `${avgMatchPercent || 86}%`,
      delta: "+6.8%",
      compare: "vs Nov 5–11",
      onClick: () => onNavigate("ai-hub"),
    },
    {
      label: "Company wallet",
      value: `₹${Number(walletBalance || 0).toLocaleString("en-IN")}`,
      delta: "+14.5%",
      compare: "active hiring credits",
      onClick: () => onNavigate("talent", { recharge: "1" }),
    },
  ];

  const channels = [
    {
      title: "Engineering roles",
      dotClass: "bg-[#002C66]",
      barClass: "bg-[#002C66]",
      sharePct: 50.5,
      impressions: "12,450",
      applications: "162",
      shortlistRate: "34.5%",
      cirScore: "88 / 100",
      topRole: role1,
      view: "post" as ProView,
    },
    {
      title: "Verified CIR pool",
      dotClass: "bg-[#ea580c]",
      barClass: "bg-[#ea580c]",
      sharePct: 31.7,
      impressions: "7,830",
      applications: "98",
      shortlistRate: "41.8%",
      cirScore: "91 / 100",
      topRole: role2,
      view: "talent" as ProView,
    },
    {
      title: "Campus & assessments",
      dotClass: "bg-[#94a3b8]",
      barClass: "bg-[#94a3b8]",
      sharePct: 17.8,
      impressions: "4,400",
      applications: "52",
      shortlistRate: "29.4%",
      cirScore: "85 / 100",
      topRole: role3,
      view: "campus-hiring" as ProView,
    },
  ];

  // Single Primary Chart (Applications over time across channels)
  const chartW = 540;
  const chartH = 188;
  const engPath = buildSmoothAreaPaths([32, 36, 35, 44, 42, 51, 58], chartW, chartH);
  const verPath = buildSmoothAreaPaths([22, 26, 23, 29, 31, 35, 39], chartW, chartH);
  const camPath = buildSmoothAreaPaths([12, 15, 13, 18, 17, 21, 24], chartW, chartH);

  return (
    <div className="space-y-6">
      {/* 1. Context Header (Zero Emoji, Zero Greeting) */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-medium text-[#111827] dark:text-[#eef0f5] tracking-tight">
            {companyName} · Hiring overview
          </h1>
          <p className="mt-0.5 text-xs text-[#6b7487]">
            Verified candidate funnel, channel conversion and CIR readiness ({currentRange})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setRangeIdx((i) => (i + 1) % DATE_RANGES.length)}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#111827]/[0.08] bg-white dark:bg-[#11141c] px-3 text-xs font-medium text-[#111827] dark:text-[#eef0f5] hover:border-[#002C66]/40 transition-colors duration-150 cursor-pointer"
            title="Switch reporting period"
          >
            <Calendar className="h-4 w-4 text-[#6b7487]" strokeWidth={1.5} aria-hidden="true" />
            <span className="tabular-nums">{currentRange}</span>
          </button>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onNavigate("post", { new: "1" })}
            className="h-9 rounded-lg text-xs font-medium gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4 text-[#6b7487]" strokeWidth={1.5} aria-hidden="true" />
            Create job
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleExportReport}
            className="h-9 rounded-lg bg-[#002C66] hover:bg-[#002250] text-white text-xs font-medium gap-1.5 cursor-pointer"
          >
            <Download className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* 2. Asymmetric Top Row: 4 Pure-Number Stat Cards + Tactile Employer Verification Specimen */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="xl:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((kpi) => (
            <button
              key={kpi.label}
              type="button"
              onClick={kpi.onClick}
              className="flex flex-col justify-between rounded-xl border border-[#111827]/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#11141c] p-5 text-left hover:border-[#002C66]/35 transition-colors duration-150 cursor-pointer"
            >
              <span className="text-xs font-normal text-[#6b7487]">{kpi.label}</span>
              <span className="mt-3 text-[26px] leading-8 font-medium tracking-tight text-[#111827] dark:text-[#eef0f5] tabular-nums">
                {kpi.value}
              </span>
              <span className="mt-3 flex items-center gap-1.5 text-xs tabular-nums">
                <span className="font-medium text-[#16a34a]">{kpi.delta}</span>
                <span className="text-[#6b7487] truncate">{kpi.compare}</span>
              </span>
            </button>
          ))}
        </div>

        {/* Moment: Tactile Employer KYB & CIR Credit Ledger Card */}
        <div className="xl:col-span-4 rounded-xl border border-[#001D44] bg-[#002C66] p-5 text-white flex flex-col justify-between shadow-[0_6px_18px_rgba(0,29,68,0.12)]">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4cc38a]" />
              <span className="font-mono text-[11px] text-blue-100/90">
                IAT-EMP-204819 · KYB verified
              </span>
            </div>
            <ShieldCheck className="h-4 w-4 text-blue-200/80" strokeWidth={1.5} />
          </div>

          <div className="my-3 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs text-blue-200/75">Verified CIR shortlists</p>
              <p className="mt-0.5 text-[26px] leading-8 font-medium tracking-tight tabular-nums">
                {avgMatchPercent || 86}
                <span className="text-sm text-blue-200/75 font-normal">% match</span>
              </p>
            </div>
            <div className="text-right font-mono text-[11px] text-blue-100/85 space-y-0.5 tabular-nums">
              <p>30-layer proctored</p>
              <p>₹{Number(walletBalance || 0).toLocaleString("en-IN")} credits</p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/12 pt-2.5 text-xs text-blue-100/85">
            <span className="truncate">{companyName}</span>
            <button
              type="button"
              onClick={() => onNavigate("talent")}
              className="inline-flex items-center gap-1 font-medium text-white hover:underline cursor-pointer shrink-0"
            >
              Find talent <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Primary Chart (2/3 Width) + Ranked Channel Share List (1/3 Width) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Primary Chart: Applications over time */}
        <div className="lg:col-span-8 rounded-xl border border-[#111827]/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#11141c] p-6 flex flex-col justify-between">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-medium text-[#111827] dark:text-[#eef0f5]">
                Applications over time
              </h2>
              <p className="mt-0.5 text-xs text-[#6b7487]">
                Daily verified candidate submissions across sourcing channels
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#4b5565]">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#002C66]" />
                Engineering roles
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ea580c]" />
                Verified CIR pool
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#94a3b8]" />
                Campus &amp; assessments
              </span>
            </div>
          </div>

          <div className="mt-5">
            <svg
              viewBox={`0 0 ${chartW} ${chartH}`}
              className="w-full h-48 overflow-visible"
              role="img"
              aria-label="Applications over time across all channels"
            >
              {[32, 78, 124, 170].map((y) => (
                <line
                  key={y}
                  x1={12}
                  y1={y}
                  x2={chartW - 12}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
              ))}

              {/* Primary Series: Engineering roles (#002C66) */}
              <path d={engPath.area} fill="#002C66" fillOpacity="0.06" />
              <path
                d={engPath.line}
                fill="none"
                stroke="#002C66"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {engPath.pts.map((pt, i) => (
                <circle
                  key={`e-${i}`}
                  cx={pt.x}
                  cy={pt.y}
                  r="3"
                  fill="#FFFFFF"
                  stroke="#002C66"
                  strokeWidth="1.75"
                />
              ))}

              {/* Accent Series: Verified CIR pool (#ea580c) */}
              <path
                d={verPath.line}
                fill="none"
                stroke="#ea580c"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
              {verPath.pts.map((pt, i) => (
                <circle
                  key={`v-${i}`}
                  cx={pt.x}
                  cy={pt.y}
                  r="2.5"
                  fill="#FFFFFF"
                  stroke="#ea580c"
                  strokeWidth="1.5"
                />
              ))}

              {/* Muted Neutral Series: Campus & assessments (#94a3b8) */}
              <path
                d={camPath.line}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>

            <div className="flex items-center justify-between px-2 pt-2 font-mono text-[11px] text-[#6b7487] tabular-nums">
              {DAYS.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Secondary Data View: Ranked Channel Share & Conversion List */}
        <div className="lg:col-span-4 rounded-xl border border-[#111827]/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#11141c] p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-medium text-[#111827] dark:text-[#eef0f5]">
                Channel performance
              </h2>
              <p className="mt-0.5 text-xs text-[#6b7487]">
                Share of 24,680 total impressions
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("employer-analytics")}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#002C66] hover:underline cursor-pointer shrink-0"
            >
              Details <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
          </div>

          <div className="space-y-4">
            {channels.map((ch) => (
              <div
                key={ch.title}
                className="rounded-lg border border-[#111827]/[0.06] bg-[#f5f7fa]/70 dark:bg-[#1a1e28] p-3.5 space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => onNavigate(ch.view)}
                    className="inline-flex items-center gap-2 font-medium text-[#111827] dark:text-[#eef0f5] hover:underline cursor-pointer"
                  >
                    <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${ch.dotClass}`} />
                    {ch.title}
                  </button>
                  <span className="font-mono text-[#4b5565] tabular-nums">
                    {ch.impressions} ({ch.sharePct}%)
                  </span>
                </div>

                <div className="h-1.5 w-full rounded-full bg-[#e5e7eb] overflow-hidden">
                  <div
                    className={`h-full rounded-full ${ch.barClass}`}
                    style={{ width: `${ch.sharePct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#6b7487] tabular-nums">
                  <span>{ch.applications} apps · {ch.shortlistRate} shortlist</span>
                  <span>CIR {ch.cirScore}</span>
                </div>

                <div className="flex items-center justify-between border-t border-[#111827]/[0.06] pt-2 text-[11px]">
                  <span className="text-[#6b7487]">Top role</span>
                  <button
                    type="button"
                    onClick={() => onNavigate("pipe")}
                    className="truncate max-w-[180px] font-medium text-[#111827] hover:text-[#002C66] hover:underline cursor-pointer"
                  >
                    {ch.topRole}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerAnalyticsShowcase;
