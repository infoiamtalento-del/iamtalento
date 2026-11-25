import React, { useEffect, useState } from "react";
import { Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { formatINR } from "@/data/proData";
import type { SuperAdminSnapshot } from "@/services/admin/superAdminData";
import type {
  SuperAdminEnterpriseState,
  SubscriptionPlanRecord,
  CouponRecord,
  QuestionBankItem,
} from "@/services/admin/superAdminEnterpriseData";
import { toast } from "sonner";

export type MonetizationOrConfigMode =
  | "subscriptions"
  | "finance-ops"
  | "cir-config"
  | "recruitment-taxonomy";

interface Props {
  mode: MonetizationOrConfigMode;
  initialSubTab?: string;
  snapshot: SuperAdminSnapshot;
  enterprise: SuperAdminEnterpriseState;
  onUpdateEnterprise: React.Dispatch<React.SetStateAction<SuperAdminEnterpriseState>>;
  onRefundTransaction: (id: string) => void;
  onLogAudit: (action: string, table: string, entityId: string, details: string) => void;
}

export const AdminMonetizationPanel: React.FC<Props> = ({
  mode,
  initialSubTab,
  snapshot,
  enterprise,
  onUpdateEnterprise,
  onRefundTransaction,
  onLogAudit,
}) => {
  const [subTab, setSubTab] = useState<"plans" | "coupons" | "renewals">("plans");
  const [finTab, setFinTab] = useState<"payouts" | "gst" | "refunds" | "commissions">("payouts");
  const [cirTab, setCirTab] = useState<"weights" | "question-bank">("weights");

  useEffect(() => {
    if (!initialSubTab) return;
    if (mode === "subscriptions" && (initialSubTab === "plans" || initialSubTab === "coupons" || initialSubTab === "renewals")) {
      setSubTab(initialSubTab);
    } else if (mode === "finance-ops" && (initialSubTab === "payouts" || initialSubTab === "gst" || initialSubTab === "refunds" || initialSubTab === "commissions")) {
      setFinTab(initialSubTab);
    } else if (mode === "cir-config" && (initialSubTab === "weights" || initialSubTab === "question-bank")) {
      setCirTab(initialSubTab);
    }
  }, [mode, initialSubTab]);

  const [showNewPlan, setShowNewPlan] = useState(false);
  const [planName, setPlanName] = useState("");
  const [planSegment, setPlanSegment] = useState<SubscriptionPlanRecord["segment"]>("Candidate Plans");
  const [planPrice, setPlanPrice] = useState("1999");

  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState("20% off");

  const [newQuestion, setNewQuestion] = useState("");
  const [newQuestionDomain, setNewQuestionDomain] = useState("Software Engineering");

  const [newTaxValue, setNewTaxValue] = useState("");
  const [taxBucket, setTaxBucket] = useState<keyof SuperAdminEnterpriseState["taxonomy"]>("jobCategories");

  /* ===================== 14. SUBSCRIPTIONS & PLANS ===================== */
  if (mode === "subscriptions") {
    const totalActiveSubs = enterprise.plans.reduce((s, p) => s + p.activeSubscribers, 0);
    const totalTrials = enterprise.plans.reduce((s, p) => s + p.trialUsers, 0);

    const handleAddPlan = (e: React.FormEvent) => {
      e.preventDefault();
      if (!planName.trim()) return;
      const created: SubscriptionPlanRecord = {
        id: `pln-${Date.now()}`,
        code: `PLN-${Math.floor(100 + Math.random() * 899)}`,
        name: planName.trim(),
        segment: planSegment,
        priceInr: Number(planPrice) || 999,
        billingCycle: "Monthly",
        activeSubscribers: 0,
        trialUsers: 0,
        validityDays: 30,
        features: ["Custom feature tier configured by Super Admin"],
        status: "active",
      };
      onUpdateEnterprise((p) => ({ ...p, plans: [created, ...p.plans] }));
      onLogAudit("plan.created", "subscription_plans", created.code, `Created plan ${created.name} (${formatINR(created.priceInr)})`);
      setPlanName("");
      setShowNewPlan(false);
      toast.success(`Created plan "${created.name}"`);
    };

    const handleAddCoupon = (e: React.FormEvent) => {
      e.preventDefault();
      if (!couponCode.trim()) return;
      const created: CouponRecord = {
        id: `cpn-${Date.now()}`,
        code: couponCode.trim().toUpperCase(),
        discountLabel: couponDiscount.trim() || "15% off",
        appliesTo: "All Plans",
        redemptions: 0,
        maxRedemptions: 250,
        expiresAt: "2027-03-31",
        status: "active",
      };
      onUpdateEnterprise((p) => ({ ...p, coupons: [created, ...p.coupons] }));
      onLogAudit("coupon.created", "coupons", created.code, `Created coupon ${created.code}`);
      setCouponCode("");
      toast.success(`Coupon ${created.code} activated`);
    };

    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {[
            { label: "Active plan SKUs", value: String(enterprise.plans.length), meta: "Across all 8 monetization segments" },
            { label: "Total active subscribers", value: totalActiveSubs.toLocaleString("en-IN"), meta: "Candidates, employers & L&D" },
            { label: "Active free trials", value: totalTrials.toLocaleString("en-IN"), meta: "Auto-reminder 3 days prior" },
            { label: "Active promo coupons", value: String(enterprise.coupons.filter((c) => c.status === "active").length), meta: `${enterprise.coupons.reduce((s, c) => s + c.redemptions, 0)} redemptions` },
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
                { id: "plans", label: `All plans (${enterprise.plans.length})` },
                { id: "coupons", label: `Coupons & discounts (${enterprise.coupons.length})` },
                { id: "renewals", label: "Active subscriptions & renewals" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSubTab(t.id)}
                className={cn(
                  "rounded-md px-3 py-1 text-xs font-medium cursor-pointer transition-colors duration-150",
                  subTab === t.id ? "bg-[#002C66] text-white" : "text-[#4b5565] hover:text-[#111827]"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <Button size="sm" className="h-8 bg-[#002C66] text-white text-xs gap-1.5 cursor-pointer" onClick={() => setShowNewPlan((v) => !v)}>
            <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
            Create plan
          </Button>
        </div>

        {showNewPlan && (
          <form onSubmit={handleAddPlan} className="rounded-xl border border-[#002C66]/20 bg-[#f5f7fa] p-4 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <div>
              <label className="block text-xs text-[#4b5565] mb-1">Plan name</label>
              <Input value={planName} onChange={(e) => setPlanName(e.target.value)} placeholder="e.g. Campus Bulk Pack" className="h-9 text-xs bg-white" required />
            </div>
            <div>
              <label className="block text-xs text-[#4b5565] mb-1">Segment</label>
              <select value={planSegment} onChange={(e) => setPlanSegment(e.target.value as SubscriptionPlanRecord["segment"])} className="h-9 w-full rounded-lg border border-[#111827]/[0.12] bg-white px-2.5 text-xs">
                {["Candidate Plans", "Employer Plans", "Assessment Plans", "Learning Plans", "AI Feature Plans", "Advertisement Plans", "Corporate Learning", "Custom Enterprise"].map((seg) => (
                  <option key={seg} value={seg}>{seg}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#4b5565] mb-1">Price (INR)</label>
              <Input type="number" value={planPrice} onChange={(e) => setPlanPrice(e.target.value)} className="h-9 text-xs bg-white" />
            </div>
            <Button type="submit" size="sm" className="h-9 bg-[#002C66] text-white text-xs cursor-pointer">
              Save plan
            </Button>
          </form>
        )}

        {subTab === "coupons" ? (
          <div className="space-y-4">
            <form onSubmit={handleAddCoupon} className="flex flex-wrap gap-2 items-center rounded-xl border border-[#111827]/[0.08] bg-[#f5f7fa] p-3">
              <Input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Coupon code (e.g. TALENT20)" className="h-8 w-48 text-xs bg-white font-mono" />
              <Input value={couponDiscount} onChange={(e) => setCouponDiscount(e.target.value)} placeholder="Discount (e.g. 20% off)" className="h-8 w-44 text-xs bg-white" />
              <Button type="submit" size="sm" className="h-8 bg-[#002C66] text-white text-xs cursor-pointer">
                Add coupon
              </Button>
            </form>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#111827]/[0.08] text-[#6b7487]">
                    <th className="py-2.5 pr-3 font-medium">Code</th>
                    <th className="py-2.5 px-3 font-medium">Discount</th>
                    <th className="py-2.5 px-3 font-medium">Applies to</th>
                    <th className="py-2.5 px-3 font-medium">Redemptions</th>
                    <th className="py-2.5 pl-3 font-medium">Expires</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#111827]/[0.06]">
                  {enterprise.coupons.map((c) => (
                    <tr key={c.id} className="hover:bg-[#f5f7fa]">
                      <td className="py-3 pr-3 font-mono font-medium text-[#111827]">{c.code}</td>
                      <td className="py-3 px-3 text-[#4b5565]">{c.discountLabel}</td>
                      <td className="py-3 px-3 text-[#4b5565]">{c.appliesTo}</td>
                      <td className="py-3 px-3 font-mono tabular-nums">{c.redemptions} / {c.maxRedemptions}</td>
                      <td className="py-3 pl-3 font-mono text-[#6b7487] tabular-nums">{c.expiresAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : subTab === "renewals" ? (
          <div className="space-y-2.5">
            {snapshot.employers.map((emp) => (
              <div key={emp.id} className="rounded-xl border border-[#111827]/[0.08] p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <p className="font-medium text-[#111827]">{emp.companyName}</p>
                  <p className="font-mono text-[11px] text-[#6b7487]">{emp.employerCode} · Plan: {emp.subscriptionPlan}</p>
                </div>
                <div className="flex items-center gap-4 font-mono tabular-nums">
                  <span>MRR {formatINR(emp.mrrInr)}</span>
                  <span className="text-[#6b7487]">{emp.talentUnlocksRemaining} unlocks left</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-[11px] cursor-pointer"
                    onClick={() => toast.success(`Renewal reminder dispatched to ${emp.officialEmail}`)}
                  >
                    Send renewal alert
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {enterprise.plans.map((p) => (
              <div key={p.id} className="rounded-xl border border-[#111827]/[0.08] p-5 flex flex-col justify-between space-y-3 text-xs">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[#6b7487]">{p.segment}</span>
                    <span className="font-mono text-[11px] text-[#6b7487]">{p.code}</span>
                  </div>
                  <p className="text-sm font-medium text-[#111827]">{p.name}</p>
                  <p className="text-2xl font-medium text-[#111827] tabular-nums">
                    {formatINR(p.priceInr)} <span className="text-xs font-normal text-[#6b7487]">/ {p.billingCycle.toLowerCase()}</span>
                  </p>
                </div>
                <ul className="space-y-1 text-[#4b5565] border-t border-[#111827]/[0.06] pt-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-1.5">
                      <span className="h-1 w-1 rounded-full bg-[#002C66]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between border-t border-[#111827]/[0.06] pt-2.5 font-mono text-[11px] text-[#6b7487] tabular-nums">
                  <span>{p.activeSubscribers} active · {p.trialUsers} trials</span>
                  <span>{p.validityDays}d validity</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ===================== 15B. FINANCE OPS (PAYOUTS, GST, REFUNDS, COMMISSIONS) ===================== */
  if (mode === "finance-ops") {
    const captured = snapshot.transactions.filter((t) => t.status === "captured");
    const totalBase = captured.reduce((s, t) => s + t.amountInr, 0);
    const totalGst = captured.reduce((s, t) => s + t.gstInr, 0);
    const totalNet = captured.reduce((s, t) => s + t.netTotalInr, 0);
    const pendingOrders = snapshot.transactions.filter((t) => t.status === "pending");

    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {[
            { label: "Taxable revenue base", value: formatINR(totalBase), meta: `${captured.length} captured GST invoices` },
            { label: "Total 18% GST liability", value: formatINR(totalGst), meta: `CGST ${formatINR(Math.round(totalGst / 2))} + SGST ${formatINR(Math.round(totalGst / 2))}` },
            { label: "Gross settled (incl. GST)", value: formatINR(totalNet), meta: `${pendingOrders.length} pending settlement` },
            { label: "Pending partner payouts", value: formatINR(enterprise.payouts.filter((p) => p.status !== "processed").reduce((s, p) => s + p.netPayoutInr, 0)), meta: "Mentors & freelancers" },
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
              { id: "payouts", label: `Mentor & freelancer payouts (${enterprise.payouts.length})` },
              { id: "gst", label: "Tax & GST reports (GSTR-1)" },
              { id: "refunds", label: "Refunds & credit notes" },
              { id: "commissions", label: "Commission rates" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setFinTab(t.id)}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium cursor-pointer transition-colors duration-150",
                finTab === t.id ? "bg-[#002C66] text-white" : "text-[#4b5565] hover:text-[#111827]"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {finTab === "payouts" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#111827]/[0.08] text-[#6b7487]">
                  <th className="py-2.5 pr-3 font-medium">Payout ID &amp; recipient</th>
                  <th className="py-2.5 px-3 font-medium">Gross / commission</th>
                  <th className="py-2.5 px-3 font-medium">Net payout</th>
                  <th className="py-2.5 px-3 font-medium">Bank ref &amp; schedule</th>
                  <th className="py-2.5 px-3 font-medium">Status</th>
                  <th className="py-2.5 pl-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#111827]/[0.06]">
                {enterprise.payouts.map((po) => (
                  <tr key={po.id} className="hover:bg-[#f5f7fa]">
                    <td className="py-3 pr-3">
                      <p className="font-medium text-[#111827]">{po.recipientName}</p>
                      <p className="font-mono text-[11px] text-[#6b7487]">{po.code} · {po.recipientType}</p>
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums text-[#4b5565]">
                      {formatINR(po.grossInr)} (-{po.commissionPct}%)
                    </td>
                    <td className="py-3 px-3 font-mono font-medium text-[#111827] tabular-nums">
                      {formatINR(po.netPayoutInr)}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-[#6b7487]">
                      {po.bankRef} · {po.scheduledFor}
                    </td>
                    <td className="py-3 px-3 capitalize">
                      <span className="inline-flex items-center gap-1.5">
                        <span className={cn("h-1.5 w-1.5 rounded-full", po.status === "processed" ? "bg-[#16a34a]" : po.status === "pending" ? "bg-[#d97706]" : "bg-[#dc2626]")} />
                        {po.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3 pl-3 text-right">
                      {po.status === "pending" && (
                        <Button
                          size="sm"
                          className="h-7 px-2 text-[11px] bg-[#002C66] text-white cursor-pointer"
                          onClick={() => {
                            onUpdateEnterprise((prev) => ({
                              ...prev,
                              payouts: prev.payouts.map((x) =>
                                x.id === po.id ? { ...x, status: "processed" } : x
                              ),
                            }));
                            onLogAudit("payout.released", "payouts", po.code, `Released ${formatINR(po.netPayoutInr)} payout to ${po.recipientName}`);
                            toast.success(`Released payout ${po.code}`);
                          }}
                        >
                          Release payout
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {finTab === "gst" && (
          <div className="rounded-xl border border-[#111827]/[0.08] p-5 space-y-3 text-xs">
            <h3 className="text-sm font-medium text-[#111827]">GSTR-1 / GSTR-3B tax summary (SAC 999293 · 18% GST)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono tabular-nums">
              <div className="rounded-lg bg-[#f5f7fa] p-3">
                <p className="text-[#6b7487]">B2B employer taxable value</p>
                <p className="mt-1 text-lg font-medium text-[#111827]">
                  {formatINR(captured.filter((t) => t.actorType === "Employer").reduce((s, t) => s + t.amountInr, 0))}
                </p>
              </div>
              <div className="rounded-lg bg-[#f5f7fa] p-3">
                <p className="text-[#6b7487]">B2C candidate taxable value</p>
                <p className="mt-1 text-lg font-medium text-[#111827]">
                  {formatINR(captured.filter((t) => t.actorType === "Candidate").reduce((s, t) => s + t.amountInr, 0))}
                </p>
              </div>
              <div className="rounded-lg bg-[#f5f7fa] p-3">
                <p className="text-[#6b7487]">Total output GST (18%)</p>
                <p className="mt-1 text-lg font-medium text-[#002C66]">{formatINR(totalGst)}</p>
              </div>
            </div>
          </div>
        )}

        {finTab === "refunds" && (
          <div className="space-y-2.5">
            {snapshot.transactions.slice(0, 8).map((tx) => (
              <div key={tx.id} className="rounded-xl border border-[#111827]/[0.08] p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <p className="font-mono font-medium text-[#111827]">{tx.invoiceNumber} · {tx.actorName}</p>
                  <p className="text-[#6b7487]">{tx.category} — {tx.itemTitle}</p>
                </div>
                <div className="flex items-center gap-3 font-mono tabular-nums">
                  <span>{formatINR(tx.netTotalInr)}</span>
                  <span className="capitalize text-[#6b7487]">{tx.status}</span>
                  {tx.status === "captured" && (
                    <Button size="sm" variant="outline" className="h-7 text-[11px] text-[#dc2626] cursor-pointer" onClick={() => onRefundTransaction(tx.id)}>
                      Issue refund
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {finTab === "commissions" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {(
              [
                { key: "mentorPct", label: "Mentor session platform commission (%)" },
                { key: "freelancePct", label: "Freelance escrow platform fee (%)" },
                { key: "hackathonPct", label: "Hackathon sponsorship fee (%)" },
              ] as const
            ).map((item) => (
              <div key={item.key} className="rounded-xl border border-[#111827]/[0.08] bg-[#f5f7fa] p-4 space-y-2">
                <label className="block font-medium text-[#111827]">{item.label}</label>
                <Input
                  type="number"
                  min={0}
                  max={50}
                  value={enterprise.commissionRates[item.key]}
                  onChange={(e) =>
                    onUpdateEnterprise((p) => ({
                      ...p,
                      commissionRates: { ...p.commissionRates, [item.key]: Number(e.target.value) || 0 },
                    }))
                  }
                  className="h-9 bg-white font-mono text-sm"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ===================== 06B. CIR SCORE CONFIG & QUESTION BANK ===================== */
  if (mode === "cir-config") {
    const cfg = enterprise.cirConfig;
    const totalWeight =
      cfg.coreAptitudeWeight +
      cfg.communicationWeight +
      cfg.domainTechnicalWeight +
      cfg.codingWeight +
      cfg.aiInterviewWeight;

    const handleAddQuestion = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newQuestion.trim()) return;
      const item: QuestionBankItem = {
        id: `qb-${Date.now()}`,
        code: `Q-${Math.floor(500 + Math.random() * 499)}`,
        domain: newQuestionDomain,
        type: "Technical",
        difficulty: "Medium",
        prompt: newQuestion.trim(),
        usageCount: 0,
        avgPassPct: 0,
      };
      onUpdateEnterprise((p) => ({ ...p, questionBank: [item, ...p.questionBank] }));
      onLogAudit("question_bank.added", "assessment_questions", item.code, `Added question in ${item.domain}`);
      setNewQuestion("");
      toast.success(`Added question ${item.code} to Question Bank`);
    };

    return (
      <div className="space-y-5">
        <div className="inline-flex rounded-lg border border-[#111827]/[0.08] bg-[#f5f7fa] p-1">
          <button
            type="button"
            onClick={() => setCirTab("weights")}
            className={cn(
              "rounded-md px-3 py-1 text-xs font-medium cursor-pointer",
              cirTab === "weights" ? "bg-[#002C66] text-white" : "text-[#4b5565]"
            )}
          >
            CIR score weightages &amp; thresholds
          </button>
          <button
            type="button"
            onClick={() => setCirTab("question-bank")}
            className={cn(
              "rounded-md px-3 py-1 text-xs font-medium cursor-pointer",
              cirTab === "question-bank" ? "bg-[#002C66] text-white" : "text-[#4b5565]"
            )}
          >
            Assessment question bank ({enterprise.questionBank.length})
          </button>
        </div>

        {cirTab === "weights" ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#4b5565]">Combined competency weightage must equal 100%</span>
              <span className={cn("font-mono font-medium tabular-nums", totalWeight === 100 ? "text-[#16a34a]" : "text-[#dc2626]")}>
                Total: {totalWeight}%
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {(
                [
                  { key: "coreAptitudeWeight", label: "Core aptitude (%)" },
                  { key: "communicationWeight", label: "Communication (%)" },
                  { key: "domainTechnicalWeight", label: "Domain technical (%)" },
                  { key: "codingWeight", label: "Live coding (%)" },
                  { key: "aiInterviewWeight", label: "Linda AI interview (%)" },
                ] as const
              ).map((w) => (
                <div key={w.key} className="rounded-xl border border-[#111827]/[0.08] bg-[#f5f7fa] p-3.5 space-y-1.5">
                  <label className="block text-xs text-[#4b5565]">{w.label}</label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={cfg[w.key]}
                    onChange={(e) =>
                      onUpdateEnterprise((p) => ({
                        ...p,
                        cirConfig: { ...p.cirConfig, [w.key]: Number(e.target.value) || 0 },
                      }))
                    }
                    className="h-9 bg-white font-mono text-sm"
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="rounded-xl border border-[#111827]/[0.08] p-3.5 space-y-1">
                <label className="text-[#6b7487]">Pass threshold (/100)</label>
                <Input
                  type="number"
                  value={cfg.passThreshold}
                  onChange={(e) => onUpdateEnterprise((p) => ({ ...p, cirConfig: { ...p.cirConfig, passThreshold: Number(e.target.value) || 0 } }))}
                  className="h-8 font-mono"
                />
              </div>
              <div className="rounded-xl border border-[#111827]/[0.08] p-3.5 space-y-1">
                <label className="text-[#6b7487]">Distinction threshold (/100)</label>
                <Input
                  type="number"
                  value={cfg.distinctionThreshold}
                  onChange={(e) => onUpdateEnterprise((p) => ({ ...p, cirConfig: { ...p.cirConfig, distinctionThreshold: Number(e.target.value) || 0 } }))}
                  className="h-8 font-mono"
                />
              </div>
              <div className="rounded-xl border border-[#111827]/[0.08] p-3.5 space-y-1">
                <label className="text-[#6b7487]">Max retakes / cooldown (days)</label>
                <p className="font-mono text-sm font-medium text-[#111827] pt-1">
                  {cfg.maxRetakeAttempts} attempts · {cfg.retakeCooldownDays}d wait
                </p>
              </div>
              <div className="rounded-xl border border-[#111827]/[0.08] p-3.5 flex items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-[#111827]">AI auto-evaluation</p>
                  <p className="text-[11px] text-[#6b7487]">Code &amp; rubric scoring</p>
                </div>
                <Switch
                  checked={cfg.aiAutoEvaluation}
                  onCheckedChange={(checked) =>
                    onUpdateEnterprise((p) => ({ ...p, cirConfig: { ...p.cirConfig, aiAutoEvaluation: checked } }))
                  }
                />
              </div>
            </div>

            <Button
              size="sm"
              className="h-9 bg-[#002C66] text-white text-xs gap-1.5 cursor-pointer"
              onClick={() => {
                onLogAudit("cir_config.saved", "cir_scoring_config", "global", `Saved CIR weights (total ${totalWeight}%, pass ${cfg.passThreshold})`);
                toast.success("CIR score calculation parameters saved");
              }}
            >
              <Check className="h-3.5 w-3.5" strokeWidth={1.5} />
              Save CIR configuration
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <form onSubmit={handleAddQuestion} className="flex flex-wrap gap-2 rounded-xl border border-[#111827]/[0.08] bg-[#f5f7fa] p-3">
              <Input value={newQuestionDomain} onChange={(e) => setNewQuestionDomain(e.target.value)} placeholder="Domain" className="h-8 w-44 text-xs bg-white" />
              <Input value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} placeholder="Add new proctored question prompt" className="h-8 flex-1 min-w-[220px] text-xs bg-white" />
              <Button type="submit" size="sm" className="h-8 bg-[#002C66] text-white text-xs cursor-pointer">
                Add question
              </Button>
            </form>
            <div className="space-y-2">
              {enterprise.questionBank.map((qItem) => (
                <div key={qItem.id} className="rounded-xl border border-[#111827]/[0.08] p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2 font-mono text-[11px] text-[#6b7487]">
                      <span className="text-[#111827] font-medium">{qItem.code}</span>
                      <span>· {qItem.domain}</span>
                      <span>· {qItem.type}</span>
                      <span>· {qItem.difficulty}</span>
                    </div>
                    <p className="text-[#111827]">{qItem.prompt}</p>
                  </div>
                  <span className="font-mono text-[11px] text-[#6b7487] tabular-nums">
                    {qItem.usageCount} uses · {qItem.avgPassPct}% pass
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ===================== 05B. RECRUITMENT TAXONOMY (CATEGORIES, INDUSTRIES, SKILLS, LOCATIONS) ===================== */
  const handleAddTaxItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaxValue.trim()) return;
    onUpdateEnterprise((p) => ({
      ...p,
      taxonomy: {
        ...p.taxonomy,
        [taxBucket]: Array.from(new Set([...p.taxonomy[taxBucket], newTaxValue.trim()])),
      },
    }));
    onLogAudit("taxonomy.updated", "recruitment_taxonomy", taxBucket, `Added "${newTaxValue.trim()}" to ${taxBucket}`);
    setNewTaxValue("");
    toast.success("Added taxonomy entry");
  };

  return (
    <div className="space-y-5">
      <form onSubmit={handleAddTaxItem} className="flex flex-wrap gap-2 rounded-xl border border-[#111827]/[0.08] bg-[#f5f7fa] p-3.5 items-center">
        <select
          value={taxBucket}
          onChange={(e) => setTaxBucket(e.target.value as keyof SuperAdminEnterpriseState["taxonomy"])}
          className="h-9 rounded-lg border border-[#111827]/[0.12] bg-white px-3 text-xs"
        >
          <option value="jobCategories">Job categories</option>
          <option value="industries">Industries</option>
          <option value="skills">Skills &amp; designations</option>
          <option value="locations">Job locations</option>
        </select>
        <Input value={newTaxValue} onChange={(e) => setNewTaxValue(e.target.value)} placeholder="Enter new taxonomy value" className="h-9 flex-1 min-w-[200px] text-xs bg-white" />
        <Button type="submit" size="sm" className="h-9 bg-[#002C66] text-white text-xs cursor-pointer">
          Add entry
        </Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(
          [
            { key: "jobCategories", title: "Job categories" },
            { key: "industries", title: "Industry management" },
            { key: "skills", title: "Skills & designations" },
            { key: "locations", title: "Job locations" },
          ] as const
        ).map((group) => (
          <div key={group.key} className="rounded-xl border border-[#111827]/[0.08] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-[#111827]">{group.title}</h3>
              <span className="font-mono text-xs text-[#6b7487] tabular-nums">{enterprise.taxonomy[group.key].length}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {enterprise.taxonomy[group.key].map((item) => (
                <span key={item} className="rounded-md border border-[#111827]/[0.08] bg-[#f5f7fa] px-2.5 py-1 text-xs text-[#111827]">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
