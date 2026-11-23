import React, { useMemo, useState } from "react";
import {
  Search,
  Archive,
  ArchiveRestore,
  RotateCcw,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatINR } from "@/data/proData";
import {
  exportRecordsAsCsv,
  type SuperAdminEmployer,
} from "@/services/admin/superAdminData";
import { toast } from "sonner";

interface Props {
  employers: SuperAdminEmployer[];
  onInspect: (emp: SuperAdminEmployer) => void;
  onToggleArchive: (ids: string[], archive: boolean) => void;
  onReviewEmployer: (id: string, status: SuperAdminEmployer["verificationStatus"]) => void;
  onSendCompletionNudge: (emp: SuperAdminEmployer) => void;
}

type ArchiveView = "active" | "archived" | "all";
type ActiveWindow = "all" | "7" | "30" | "90" | "180" | "365";
type CompletionFilter = "all" | "incomplete" | "complete";

function daysSince(iso: string): number {
  const diff = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(diff / 86400000));
}

export const SuperAdminEmployersPanel: React.FC<Props> = ({
  employers,
  onInspect,
  onToggleArchive,
  onReviewEmployer,
  onSendCompletionNudge,
}) => {
  const [archiveView, setArchiveView] = useState<ArchiveView>("active");
  const [search, setSearch] = useState("");
  const [completionFilter, setCompletionFilter] = useState<CompletionFilter>("all");
  const [industry, setIndustry] = useState("all");
  const [accountTier, setAccountTier] = useState<"all" | "premium" | "normal">("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [kybFilter, setKybFilter] = useState("all");
  const [activeWindow, setActiveWindow] = useState<ActiveWindow>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const activePool = useMemo(() => employers.filter((e) => !e.archived), [employers]);
  const archivedCount = useMemo(() => employers.filter((e) => e.archived).length, [employers]);

  const stats = useMemo(() => {
    return {
      incompleteCompanyProfiles: activePool.filter((e) => e.profileCompletion < 100).length,
      premiumCount: activePool.filter((e) => e.accountTier === "premium").length,
      normalCount: activePool.filter((e) => e.accountTier === "normal").length,
      pendingKyb: activePool.filter((e) => e.verificationStatus === "pending").length,
    };
  }, [activePool]);

  const industries = useMemo(
    () => Array.from(new Set(employers.map((e) => e.industry).filter(Boolean))).sort(),
    [employers]
  );

  const locations = useMemo(() => {
    const cities = employers.map((e) => e.hq.split(",")[0].trim()).filter(Boolean);
    return Array.from(new Set(cities)).sort();
  }, [employers]);

  const resetFilters = () => {
    setArchiveView("active");
    setSearch("");
    setCompletionFilter("all");
    setIndustry("all");
    setAccountTier("all");
    setLocationFilter("all");
    setKybFilter("all");
    setActiveWindow("all");
    setSelectedIds([]);
  };

  const filteredEmployers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return employers.filter((e) => {
      if (archiveView === "active" && e.archived) return false;
      if (archiveView === "archived" && !e.archived) return false;
      if (completionFilter === "incomplete" && e.profileCompletion >= 100) return false;
      if (completionFilter === "complete" && e.profileCompletion < 100) return false;
      if (industry !== "all" && e.industry !== industry) return false;
      if (accountTier !== "all" && e.accountTier !== accountTier) return false;
      if (locationFilter !== "all" && !e.hq.toLowerCase().includes(locationFilter.toLowerCase())) return false;
      if (kybFilter !== "all" && e.verificationStatus !== kybFilter) return false;
      if (activeWindow !== "all" && daysSince(e.lastActiveAt) > Number(activeWindow)) return false;

      if (q) {
        const hay = [
          e.companyName,
          e.employerCode,
          e.officialEmail,
          e.contactName,
          e.gstin,
          e.cin,
          e.hq,
          e.industry,
          ...e.missingProfileFields,
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [
    employers,
    archiveView,
    completionFilter,
    industry,
    accountTier,
    locationFilter,
    kybFilter,
    activeWindow,
    search,
  ]);

  const selectClass =
    "h-9 w-full rounded-lg border border-white/20 bg-white px-3 text-xs font-normal text-[#111827] focus:border-[#FB923C] focus:outline-none transition-colors duration-150 cursor-pointer";

  const cards = [
    {
      title: "Incomplete company profiles",
      figure: String(stats.incompleteCompanyProfiles),
      meta: "Missing mandatory onboarding fields",
      active: completionFilter === "incomplete",
      onClick: () => {
        resetFilters();
        setCompletionFilter("incomplete");
      },
    },
    {
      title: "Premium vs normal accounts",
      figure: `${stats.premiumCount} / ${stats.normalCount}`,
      meta: "Paid SaaS vs starter & trial",
      active: accountTier !== "all",
      onClick: () => {
        resetFilters();
        setAccountTier(accountTier === "premium" ? "normal" : "premium");
      },
    },
    {
      title: "Pending CIN / GSTIN approval",
      figure: String(stats.pendingKyb),
      meta: "Awaiting KYB verification",
      active: kybFilter === "pending",
      onClick: () => {
        resetFilters();
        setKybFilter("pending");
      },
    },
    {
      title: "Archived company profiles",
      figure: String(archivedCount),
      meta: "Stored in archive vault",
      active: archiveView === "archived",
      onClick: () => {
        resetFilters();
        setArchiveView("archived");
      },
    },
  ];

  return (
    <div className="space-y-5">
      {/* Pure-Number Cohort Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((card) => (
          <button
            key={card.title}
            type="button"
            onClick={card.onClick}
            className={cn(
              "rounded-xl border p-4 text-left transition-colors duration-150 cursor-pointer",
              card.active
                ? "border-[#002C66] bg-[#eceff4] dark:bg-[#1a1e28]"
                : "border-[#111827]/[0.08] dark:border-white/[0.08] bg-[#f5f7fa] dark:bg-[#161a24] hover:border-[#002C66]/35"
            )}
          >
            <p className="text-xs text-[#4b5565] dark:text-[#a3a9b8] truncate">{card.title}</p>
            <p className="mt-2 text-2xl leading-none font-medium text-[#111827] dark:text-[#eef0f5] tabular-nums">
              {card.figure}
            </p>
            <p className="mt-1.5 text-xs text-[#6b7487] truncate">{card.meta}</p>
          </button>
        ))}
      </div>

      {/* Filter Workbench (#002C66 Dark Blue + Highlighted Search Box) */}
      <div className="rounded-xl border border-[#001D44] bg-[#002C66] p-5 text-white space-y-4 shadow-[0_6px_20px_rgba(0,29,68,0.12)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-lg border border-white/15 bg-[#001F4D] p-1">
            {(
              [
                { id: "active", label: `Active (${activePool.length})` },
                { id: "archived", label: `Archived (${archivedCount})` },
                { id: "all", label: `All (${employers.length})` },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setArchiveView(tab.id)}
                className={cn(
                  "rounded-md px-3 py-1 text-xs font-medium tabular-nums transition-colors duration-150 cursor-pointer",
                  archiveView === tab.id
                    ? "bg-white text-[#002C66]"
                    : "text-blue-100/80 hover:text-white"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#ea580c]"
              strokeWidth={1.75}
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employers by company, ID, email, GSTIN, or city"
              className="h-10 pl-10 pr-4 text-xs font-medium text-[#111827] placeholder:text-[#4b5565] bg-white rounded-lg border-2 border-[#FB923C] shadow-[0_4px_14px_rgba(0,0,0,0.18)] focus-visible:ring-2 focus-visible:ring-[#FB923C]/50 focus-visible:border-[#FB923C]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1 rounded-lg border border-white/15 bg-[#001F4D] p-1">
            <span className="px-2 text-xs text-blue-200/85">Last active</span>
            {(
              [
                { id: "all", label: "All" },
                { id: "7", label: "7d" },
                { id: "30", label: "30d" },
                { id: "90", label: "90d" },
                { id: "180", label: "180d" },
                { id: "365", label: "365d" },
              ] as const
            ).map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => setActiveWindow(w.id)}
                className={cn(
                  "rounded-md px-2 py-1 text-xs font-mono tabular-nums transition-colors duration-150 cursor-pointer",
                  activeWindow === w.id
                    ? "bg-white text-[#002C66] font-medium"
                    : "text-blue-100/80 hover:text-white"
                )}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-xs font-medium text-blue-100/90 mb-1.5">
              Company profile status
            </label>
            <select
              aria-label="Filter by Company Profile Completion"
              value={completionFilter}
              onChange={(e) => setCompletionFilter(e.target.value as CompletionFilter)}
              className={selectClass}
            >
              <option value="all">All completion states</option>
              <option value="incomplete">Incomplete company profile (&lt;100%)</option>
              <option value="complete">Completed company profile (100%)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-blue-100/90 mb-1.5">
              Industry
            </label>
            <select
              aria-label="Filter Employers by Industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className={selectClass}
            >
              <option value="all">All industries</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-blue-100/90 mb-1.5">
              Account tier
            </label>
            <select
              aria-label="Filter Employers by Tier"
              value={accountTier}
              onChange={(e) => setAccountTier(e.target.value as "all" | "premium" | "normal")}
              className={selectClass}
            >
              <option value="all">All plans</option>
              <option value="premium">Premium (Enterprise &amp; Growth)</option>
              <option value="normal">Normal (Starter &amp; Free)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-blue-100/90 mb-1.5">
              HQ location
            </label>
            <select
              aria-label="Filter Employers by Location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className={selectClass}
            >
              <option value="all">All cities</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-blue-100/90 mb-1.5">
              KYB verification
            </label>
            <select
              aria-label="Filter Employers by Verification"
              value={kybFilter}
              onChange={(e) => setKybFilter(e.target.value)}
              className={selectClass}
            >
              <option value="all">All KYB statuses</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending KYB</option>
              <option value="rejected">Rejected</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-3.5 border-t border-white/12">
          <div className="flex items-center gap-3 text-xs">
            <span className="font-mono text-blue-100/90 tabular-nums">
              Showing {filteredEmployers.length} of {employers.length} employers
            </span>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#FB923C] hover:text-orange-300 hover:underline cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.5} />
              Reset filters
            </button>
          </div>

          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                className="h-8 rounded-lg gap-1.5 text-xs font-medium bg-white/10 hover:bg-white/18 text-white border-white/20 cursor-pointer"
                onClick={() => {
                  onToggleArchive(selectedIds, archiveView !== "archived");
                  setSelectedIds([]);
                }}
              >
                <Archive className="h-4 w-4 text-blue-100" strokeWidth={1.5} />
                {archiveView === "archived" ? "Unarchive selected" : "Archive selected"} ({selectedIds.length})
              </Button>
            )}
            <Button
              size="sm"
              className="h-8 rounded-lg gap-1.5 text-xs font-medium bg-white text-[#002C66] hover:bg-blue-50 border-0 cursor-pointer"
              onClick={() => {
                exportRecordsAsCsv(
                  "employers-filtered-cohort",
                  filteredEmployers as unknown as Array<Record<string, unknown>>
                );
                toast.success(`Exported ${filteredEmployers.length} employers`);
              }}
            >
              <Download className="h-4 w-4 text-[#002C66]" strokeWidth={1.5} />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Employers Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#111827]/[0.08] dark:border-white/[0.08] text-[#6b7487]">
              <th className="py-2.5 pr-2 w-8">
                <input
                  type="checkbox"
                  checked={
                    filteredEmployers.length > 0 &&
                    filteredEmployers.every((e) => selectedIds.includes(e.id))
                  }
                  onChange={() =>
                    setSelectedIds(
                      filteredEmployers.every((e) => selectedIds.includes(e.id))
                        ? []
                        : filteredEmployers.map((e) => e.id)
                    )
                  }
                  aria-label="Select all filtered employers"
                  className="h-3.5 w-3.5 rounded border-[#111827]/20 cursor-pointer"
                />
              </th>
              <th className="py-2.5 pr-3 font-medium">Company</th>
              <th className="py-2.5 px-3 font-medium">Industry &amp; HQ</th>
              <th className="py-2.5 px-3 font-medium">Profile completion</th>
              <th className="py-2.5 px-3 font-medium">KYB &amp; GSTIN</th>
              <th className="py-2.5 px-3 font-medium">Plan &amp; MRR</th>
              <th className="py-2.5 px-3 font-medium">Activity &amp; funnel</th>
              <th className="py-2.5 pl-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#111827]/[0.06] dark:divide-white/[0.06]">
            {filteredEmployers.map((emp) => (
              <tr
                key={emp.id}
                onClick={() => onInspect(emp)}
                className={cn(
                  "hover:bg-[#f5f7fa] dark:hover:bg-[#1a1e28] cursor-pointer transition-colors duration-150",
                  emp.archived && "opacity-65"
                )}
              >
                <td className="py-3 pr-2" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(emp.id)}
                    onChange={() =>
                      setSelectedIds((p) =>
                        p.includes(emp.id) ? p.filter((x) => x !== emp.id) : [...p, emp.id]
                      )
                    }
                    aria-label={`Select ${emp.companyName}`}
                    className="h-3.5 w-3.5 rounded border-[#111827]/20 cursor-pointer"
                  />
                </td>

                <td className="py-3 pr-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full shrink-0",
                        emp.origin === "live_db" ? "bg-[#16a34a]" : "bg-[#94a3b8]"
                      )}
                    />
                    <span className="text-[13px] font-medium text-[#111827] dark:text-[#eef0f5]">
                      {emp.companyName}
                    </span>
                    <span className="font-mono text-[11px] text-[#6b7487]">
                      {emp.accountTier === "premium" ? "Paid" : "Trial"}
                    </span>
                    {emp.archived && (
                      <span className="rounded bg-[#eceff4] px-1.5 py-0.5 font-mono text-[10px] text-[#4b5565]">
                        Archived
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 pl-3.5 font-mono text-[11px] text-[#6b7487] tabular-nums">
                    {emp.employerCode} · {emp.officialEmail}
                  </p>
                </td>

                <td className="py-3 px-3">
                  <p className="text-[#111827] dark:text-[#eef0f5]">{emp.industry}</p>
                  <p className="mt-0.5 text-[#6b7487] tabular-nums">
                    {emp.hq} · {emp.size}
                  </p>
                </td>

                <td className="py-3 px-3 max-w-[230px]">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 rounded bg-[#eceff4] dark:bg-[#1a1e28] overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded",
                          emp.profileCompletion === 100
                            ? "bg-[#16a34a]"
                            : emp.profileCompletion >= 70
                              ? "bg-[#d97706]"
                              : "bg-[#dc2626]"
                        )}
                        style={{ width: `${emp.profileCompletion}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs text-[#111827] dark:text-[#eef0f5] tabular-nums">
                      {emp.profileCompletion}%
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-[#6b7487] truncate">
                    {emp.missingProfileFields.length > 0
                      ? `Missing: ${emp.missingProfileFields.join(", ")}`
                      : "Profile complete"}
                  </p>
                </td>

                <td className="py-3 px-3">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        emp.verificationStatus === "verified"
                          ? "bg-[#16a34a]"
                          : emp.verificationStatus === "pending"
                            ? "bg-[#d97706]"
                            : "bg-[#dc2626]"
                      )}
                    />
                    <span className="capitalize text-[#111827] dark:text-[#eef0f5]">
                      {emp.verificationStatus}
                    </span>
                  </div>
                  <p className="mt-0.5 pl-3 font-mono text-[11px] text-[#6b7487] tabular-nums">
                    {emp.gstin}
                  </p>
                </td>

                <td className="py-3 px-3">
                  <p className="text-[#111827] dark:text-[#eef0f5]">{emp.subscriptionPlan}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-[#6b7487] tabular-nums">
                    {formatINR(emp.mrrInr)}/mo · Bal {formatINR(emp.walletBalance)}
                  </p>
                </td>

                <td className="py-3 px-3 font-mono tabular-nums">
                  <p className="text-[#111827] dark:text-[#eef0f5]">
                    {daysSince(emp.lastActiveAt)}d ago
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#6b7487]">
                    {emp.activeJobsCount}J · {emp.totalApplications}A · {emp.totalHires}H
                  </p>
                </td>

                <td className="py-3 pl-3 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="inline-flex items-center gap-1.5">
                    {emp.profileCompletion < 100 && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 rounded-lg px-2.5 text-xs font-medium cursor-pointer"
                        onClick={() => onSendCompletionNudge(emp)}
                      >
                        Nudge
                      </Button>
                    )}
                    {emp.verificationStatus === "pending" && (
                      <Button
                        size="sm"
                        className="h-7 rounded-lg px-2.5 text-xs font-medium bg-[#002C66] hover:bg-[#001F4D] text-white cursor-pointer"
                        onClick={() => onReviewEmployer(emp.id, "verified")}
                      >
                        Verify
                      </Button>
                    )}
                    <button
                      type="button"
                      title={emp.archived ? "Unarchive company" : "Archive company"}
                      onClick={() => onToggleArchive([emp.id], !emp.archived)}
                      className="rounded-lg border border-[#111827]/[0.08] p-1.5 text-[#6b7487] hover:text-[#111827] hover:bg-[#eceff4] transition-colors duration-150 cursor-pointer"
                    >
                      {emp.archived ? (
                        <ArchiveRestore className="h-4 w-4 text-[#16a34a]" strokeWidth={1.5} />
                      ) : (
                        <Archive className="h-4 w-4" strokeWidth={1.5} />
                      )}
                    </button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 rounded-lg px-2.5 text-xs font-medium cursor-pointer"
                      onClick={() => onInspect(emp)}
                    >
                      Inspect
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
