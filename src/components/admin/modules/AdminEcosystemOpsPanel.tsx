import React, { useEffect, useState } from "react";
import { Plus, Check, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { formatINR } from "@/data/proData";
import type { SuperAdminSnapshot } from "@/services/admin/superAdminData";
import type {
  SuperAdminEnterpriseState,
  LmsCourseRecord,
  MentorRecord,
} from "@/services/admin/superAdminEnterpriseData";
import type { InspectedEntity } from "../SuperAdminInspector";
import { adminCreateCourse, adminCreateMentor } from "@/services/admin/adminService";
import { toast } from "sonner";

export type EcosystemModuleKind = "ai-hub" | "lms" | "mentors" | "talent-pool" | "interviews";

interface Props {
  module: EcosystemModuleKind;
  initialSubTab?: string;
  snapshot: SuperAdminSnapshot;
  enterprise: SuperAdminEnterpriseState;
  onUpdateEnterprise: React.Dispatch<React.SetStateAction<SuperAdminEnterpriseState>>;
  onInspect: (entity: InspectedEntity) => void;
  onLogAudit: (action: string, table: string, entityId: string, details: string) => void;
}

export const AdminEcosystemOpsPanel: React.FC<Props> = ({
  module,
  initialSubTab,
  snapshot,
  enterprise,
  onUpdateEnterprise,
  onInspect,
  onLogAudit,
}) => {
  const [aiTab, setAiTab] = useState<"features" | "logs" | "models">("features");
  const [lmsTab, setLmsTab] = useState<"courses" | "approvals" | "content" | "config">("courses");
  const [mentorTab, setMentorTab] = useState<"mentors" | "sessions" | "payouts">("mentors");
  const [crmTab, setCrmTab] = useState<"talent" | "requests" | "analytics">("talent");
  const [intTab, setIntTab] = useState<"all" | "ai_mock" | "employer" | "disputed">("all");

  useEffect(() => {
    if (!initialSubTab) return;
    if (module === "ai-hub" && (initialSubTab === "features" || initialSubTab === "logs" || initialSubTab === "models")) {
      setAiTab(initialSubTab);
    } else if (module === "lms" && (initialSubTab === "courses" || initialSubTab === "approvals" || initialSubTab === "content" || initialSubTab === "config")) {
      setLmsTab(initialSubTab);
    } else if (module === "mentors" && (initialSubTab === "mentors" || initialSubTab === "sessions" || initialSubTab === "payouts")) {
      setMentorTab(initialSubTab);
    } else if (module === "talent-pool" && (initialSubTab === "talent" || initialSubTab === "requests" || initialSubTab === "analytics")) {
      setCrmTab(initialSubTab);
    } else if (module === "interviews" && (initialSubTab === "all" || initialSubTab === "ai_mock" || initialSubTab === "employer" || initialSubTab === "disputed")) {
      setIntTab(initialSubTab);
    }
  }, [module, initialSubTab]);

  const [search, setSearch] = useState("");
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);
  const [promptDraft, setPromptDraft] = useState("");

  // Quick Add Course state
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseDomain, setNewCourseDomain] = useState("Data & AI");
  const [newCoursePrice, setNewCoursePrice] = useState("3999");

  // Quick Add Mentor state
  const [showAddMentor, setShowAddMentor] = useState(false);
  const [newMentorName, setNewMentorName] = useState("");
  const [newMentorDomain, setNewMentorDomain] = useState("Software Engineering");
  const [newMentorRate, setNewMentorRate] = useState("1299");

  /* ===================== 07. AI INTELLIGENCE HUB ===================== */
  if (module === "ai-hub") {
    const totalRequests = enterprise.aiFeatures.reduce((s, f) => s + f.monthlyRequests, 0);
    const totalTokensM = enterprise.aiFeatures.reduce((s, f) => s + f.tokensUsedM, 0);
    const totalCostInr = enterprise.aiFeatures.reduce((s, f) => s + f.costInr, 0);
    const totalFailed = enterprise.aiFeatures.reduce((s, f) => s + f.failedRequests, 0);
    const enabledCount = enterprise.aiFeatures.filter((f) => f.enabled).length;
    const failPct = totalRequests > 0 ? ((totalFailed / totalRequests) * 100).toFixed(2) : "0";

    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {[
            { label: "Active AI services", value: `${enabledCount} / ${enterprise.aiFeatures.length}`, meta: "All 11 TalentCIR AI engines" },
            { label: "Monthly API calls", value: totalRequests.toLocaleString("en-IN"), meta: `${totalFailed} failed requests (${failPct}%)` },
            { label: "Tokens consumed (30d)", value: `${totalTokensM.toFixed(1)}M`, meta: "Prompt + completion tokens" },
            { label: "Total AI inference cost", value: formatINR(totalCostInr), meta: "Tracked per feature & tier" },
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
                { id: "features", label: "11 AI features & controls" },
                { id: "models", label: "Prompt & model config" },
                { id: "logs", label: "AI response logs" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setAiTab(t.id)}
                className={cn(
                  "rounded-md px-3 py-1 text-xs font-medium cursor-pointer transition-colors duration-150",
                  aiTab === t.id ? "bg-[#002C66] text-white" : "text-[#4b5565] hover:text-[#111827]"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {aiTab === "logs" ? (
          <div className="space-y-2">
            {enterprise.aiLogs.length === 0 ? (
              <p className="rounded-xl border border-[#111827]/[0.08] py-10 text-center text-xs text-[#6b7487]">
                No AI invocation logs recorded yet. Live AI requests will appear here automatically.
              </p>
            ) : (
              enterprise.aiLogs.map((log) => (
                <div key={log.id} className="rounded-xl border border-[#111827]/[0.08] p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={cn("h-1.5 w-1.5 rounded-full", log.status === "success" ? "bg-[#16a34a]" : "bg-[#dc2626]")} />
                      <span className="font-medium text-[#111827]">{log.feature}</span>
                      <span className="font-mono text-[11px] text-[#6b7487]">{log.model}</span>
                    </div>
                    <p className="text-[#4b5565]">{log.summary}</p>
                  </div>
                  <div className="text-right font-mono text-[11px] text-[#6b7487] tabular-nums">
                    <p className="text-[#111827]">{log.actor}</p>
                    <p>{log.tokens.toLocaleString()} tok · {log.latencyMs}ms</p>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#111827]/[0.08] text-[#6b7487]">
                  <th className="py-2.5 pr-3 font-medium">AI feature</th>
                  <th className="py-2.5 px-3 font-medium">Model</th>
                  <th className="py-2.5 px-3 font-medium">Usage (30d)</th>
                  <th className="py-2.5 px-3 font-medium">Accuracy / cost</th>
                  <th className="py-2.5 px-3 font-medium">Subscription limits</th>
                  <th className="py-2.5 pl-3 text-right font-medium">Enable / prompt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#111827]/[0.06]">
                {enterprise.aiFeatures.map((feat) => (
                  <React.Fragment key={feat.id}>
                    <tr className="hover:bg-[#f5f7fa] transition-colors duration-150">
                      <td className="py-3 pr-3">
                        <p className="font-medium text-[#111827]">{feat.name}</p>
                        <p className="text-[11px] text-[#6b7487]">{feat.category}</p>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-[#4b5565]">{feat.model}</td>
                      <td className="py-3 px-3 font-mono tabular-nums text-[#111827]">
                        {feat.monthlyRequests.toLocaleString("en-IN")} req
                        <span className="block text-[11px] text-[#6b7487]">{feat.tokensUsedM}M tokens · {feat.failedRequests} err</span>
                      </td>
                      <td className="py-3 px-3 font-mono tabular-nums">
                        <span className="text-[#16a34a]">{feat.accuracyPct}%</span>
                        <span className="block text-[11px] text-[#4b5565]">{formatINR(feat.costInr)}</span>
                      </td>
                      <td className="py-3 px-3 text-[11px] text-[#4b5565]">
                        <p>Free: {feat.freeTierLimit}</p>
                        <p className="text-[#111827]">Pro: {feat.proTierLimit}</p>
                      </td>
                      <td className="py-3 pl-3 text-right">
                        <div className="inline-flex items-center gap-2.5">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-[11px] cursor-pointer"
                            onClick={() => {
                              setEditingPromptId(editingPromptId === feat.id ? null : feat.id);
                              setPromptDraft(feat.systemPrompt);
                            }}
                          >
                            Prompt
                          </Button>
                          <Switch
                            checked={feat.enabled}
                            aria-label={`Toggle ${feat.name}`}
                            onCheckedChange={(checked) => {
                              onUpdateEnterprise((prev) => ({
                                ...prev,
                                aiFeatures: prev.aiFeatures.map((f) =>
                                  f.id === feat.id ? { ...f, enabled: checked } : f
                                ),
                              }));
                              onLogAudit("ai_feature.toggled", "ai_configurations", feat.id, `${feat.name} ${checked ? "enabled" : "disabled"}`);
                              toast.success(`${feat.name} ${checked ? "enabled" : "disabled"}`);
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                    {(editingPromptId === feat.id || aiTab === "models") && (
                      <tr className="bg-[#f5f7fa]/80">
                        <td colSpan={6} className="p-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-[11px] text-[#6b7487]">System instruction:</span>
                            <Input
                              value={editingPromptId === feat.id ? promptDraft : feat.systemPrompt}
                              onChange={(e) => {
                                setEditingPromptId(feat.id);
                                setPromptDraft(e.target.value);
                              }}
                              className="h-8 text-xs bg-white flex-1 min-w-[260px]"
                            />
                            {editingPromptId === feat.id && (
                              <Button
                                size="sm"
                                className="h-8 bg-[#002C66] text-white text-xs cursor-pointer"
                                onClick={() => {
                                  onUpdateEnterprise((prev) => ({
                                    ...prev,
                                    aiFeatures: prev.aiFeatures.map((f) =>
                                      f.id === feat.id ? { ...f, systemPrompt: promptDraft } : f
                                    ),
                                  }));
                                  onLogAudit("ai_prompt.updated", "ai_configurations", feat.id, `Updated system prompt for ${feat.name}`);
                                  setEditingPromptId(null);
                                  toast.success(`Saved prompt for ${feat.name}`);
                                }}
                              >
                                Save prompt
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  /* ===================== 08. LEARNING MANAGEMENT SYSTEM ===================== */
  if (module === "lms") {
    const pendingCourses = enterprise.courses.filter((c) => c.approvalStatus === "pending_approval");
    const visibleCourses = lmsTab === "approvals" ? pendingCourses : enterprise.courses;

    const handleCreateCourse = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newCourseTitle.trim()) return;
      const price = Number(newCoursePrice) || 0;
      const res = await adminCreateCourse(newCourseTitle.trim(), newCourseDomain, price);
      const created: LmsCourseRecord = {
        id: (res.data?.id as string) || `crs-${Date.now()}`,
        code: `CRS-${Math.floor(400 + Math.random() * 500)}`,
        title: newCourseTitle.trim(),
        category: newCourseDomain,
        domain: newCourseDomain,
        instructor: "Super Admin Curriculum Team",
        tier: price > 0 ? "Paid" : "Free",
        priceInr: price,
        featured: false,
        approvalStatus: "approved",
        modulesCount: 6,
        videoLessons: 24,
        pdfResources: 10,
        quizzesCount: 8,
        enrolledCount: 0,
        activeLearners: 0,
        completedCount: 0,
        avgRating: 0,
        certificatesIssued: 0,
        refundsCount: 0,
        revenueInr: 0,
      };
      onUpdateEnterprise((prev) => ({ ...prev, courses: [created, ...prev.courses] }));
      onLogAudit("lms.course_created", "lms_courses", created.code, `Created course ${created.title}`);
      setNewCourseTitle("");
      setShowAddCourse(false);
      toast.success(
        res.persisted
          ? `Course "${created.title}" published to live LMS database`
          : `Course "${created.title}" published in console`
      );
    };

    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {[
            { label: "Total LMS courses", value: String(enterprise.courses.length), meta: `${pendingCourses.length} pending approval` },
            { label: "Total enrolments", value: enterprise.courses.reduce((s, c) => s + c.enrolledCount, 0).toLocaleString("en-IN"), meta: "Active + completed learners" },
            { label: "Certificates issued", value: enterprise.courses.reduce((s, c) => s + c.certificatesIssued, 0).toLocaleString("en-IN"), meta: "Verifiable LMS credentials" },
            { label: "LMS course revenue", value: formatINR(enterprise.courses.reduce((s, c) => s + c.revenueInr, 0)), meta: "Paid tracks & cohorts" },
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
                { id: "courses", label: `All courses (${enterprise.courses.length})` },
                { id: "approvals", label: `Pending approvals (${pendingCourses.length})` },
                { id: "content", label: "Modules, videos & quizzes" },
                { id: "config", label: "Certificates & access config" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setLmsTab(t.id)}
                className={cn(
                  "rounded-md px-3 py-1 text-xs font-medium cursor-pointer transition-colors duration-150",
                  lmsTab === t.id ? "bg-[#002C66] text-white" : "text-[#4b5565] hover:text-[#111827]"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <Button size="sm" className="h-8 bg-[#002C66] hover:bg-[#002250] text-white text-xs gap-1.5 cursor-pointer" onClick={() => setShowAddCourse((v) => !v)}>
            <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
            Add new course
          </Button>
        </div>

        {showAddCourse && (
          <form onSubmit={handleCreateCourse} className="rounded-xl border border-[#002C66]/20 bg-[#f5f7fa] p-4 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <div className="sm:col-span-2">
              <label className="block text-xs text-[#4b5565] mb-1">Course title</label>
              <Input value={newCourseTitle} onChange={(e) => setNewCourseTitle(e.target.value)} placeholder="e.g. Production Rust & Distributed Ledgers" className="h-9 text-xs bg-white" required />
            </div>
            <div>
              <label className="block text-xs text-[#4b5565] mb-1">Domain &amp; price (INR)</label>
              <div className="flex gap-2">
                <Input value={newCourseDomain} onChange={(e) => setNewCourseDomain(e.target.value)} className="h-9 text-xs bg-white" />
                <Input type="number" value={newCoursePrice} onChange={(e) => setNewCoursePrice(e.target.value)} className="h-9 w-24 text-xs bg-white" />
              </div>
            </div>
            <Button type="submit" size="sm" className="h-9 bg-[#002C66] text-white text-xs cursor-pointer">
              Publish course
            </Button>
          </form>
        )}

        {lmsTab === "config" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {[
              { title: "Certificate auto-issuance criteria", desc: "Issue verifiable LMS credential when ≥80% video lessons completed and final quiz ≥70%." },
              { title: "Course expiry & lifetime access", desc: "Paid courses retain 365-day access with optional renewal; free courses never expire." },
              { title: "PDF & study material downloads", desc: "Watermarked PDFs allowed for Pro subscribers and verified learners only." },
              { title: "Refund SLA window", desc: "Automated refund review within 7 days of enrolment if course progress is below 20%." },
            ].map((cfg) => (
              <div key={cfg.title} className="rounded-xl border border-[#111827]/[0.08] p-4 bg-[#f5f7fa]/60 space-y-1">
                <p className="font-medium text-[#111827]">{cfg.title}</p>
                <p className="text-[#6b7487] leading-relaxed">{cfg.desc}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#111827]/[0.08] text-[#6b7487]">
                  <th className="py-2.5 pr-3 font-medium">Course &amp; code</th>
                  <th className="py-2.5 px-3 font-medium">Pricing &amp; tier</th>
                  <th className="py-2.5 px-3 font-medium">Content inventory</th>
                  <th className="py-2.5 px-3 font-medium">Enrolments &amp; certs</th>
                  <th className="py-2.5 px-3 font-medium">Status</th>
                  <th className="py-2.5 pl-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#111827]/[0.06]">
                {visibleCourses.map((c) => (
                  <tr key={c.id} className="hover:bg-[#f5f7fa] transition-colors duration-150">
                    <td className="py-3 pr-3">
                      <p className="font-medium text-[#111827]">{c.title}</p>
                      <p className="font-mono text-[11px] text-[#6b7487]">{c.code} · {c.domain} · {c.instructor}</p>
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums">
                      <p className="text-[#111827] font-medium">{c.tier === "Free" ? "Free" : formatINR(c.priceInr)}</p>
                      <p className="text-[11px] text-[#6b7487]">{c.featured ? "Featured" : "Standard"}</p>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-[#4b5565] tabular-nums">
                      {c.modulesCount} mod · {c.videoLessons} vid · {c.pdfResources} PDF · {c.quizzesCount} quiz
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] tabular-nums">
                      <p className="text-[#111827]">{c.enrolledCount.toLocaleString("en-IN")} enrolled</p>
                      <p className="text-[#6b7487]">{c.certificatesIssued} certs · {c.avgRating > 0 ? `${c.avgRating}★` : "New"}</p>
                    </td>
                    <td className="py-3 px-3 capitalize">
                      <span className="inline-flex items-center gap-1.5">
                        <span className={cn("h-1.5 w-1.5 rounded-full", c.approvalStatus === "approved" ? "bg-[#16a34a]" : "bg-[#d97706]")} />
                        {c.approvalStatus.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3 pl-3 text-right">
                      <div className="inline-flex gap-1.5">
                        {c.approvalStatus !== "approved" && (
                          <Button
                            size="sm"
                            className="h-7 px-2 text-[11px] bg-[#002C66] text-white cursor-pointer"
                            onClick={() => {
                              onUpdateEnterprise((prev) => ({
                                ...prev,
                                courses: prev.courses.map((x) =>
                                  x.id === c.id ? { ...x, approvalStatus: "approved" } : x
                                ),
                              }));
                              onLogAudit("lms.course_approved", "lms_courses", c.code, `Approved course ${c.title}`);
                              toast.success(`Approved "${c.title}"`);
                            }}
                          >
                            Approve
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-[11px] cursor-pointer"
                          onClick={() => {
                            onUpdateEnterprise((prev) => ({
                              ...prev,
                              courses: prev.courses.map((x) =>
                                x.id === c.id ? { ...x, featured: !x.featured } : x
                              ),
                            }));
                            toast.success(c.featured ? "Removed from Featured" : "Marked as Featured course");
                          }}
                        >
                          {c.featured ? "Unfeature" : "Feature"}
                        </Button>
                      </div>
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

  /* ===================== 09. MENTOR MANAGEMENT ===================== */
  if (module === "mentors") {
    const handleAddMentor = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newMentorName.trim()) return;
      const rate = Number(newMentorRate) || 999;
      const headline = `${newMentorDomain} Principal Mentor`;
      const res = await adminCreateMentor(newMentorName.trim(), headline, newMentorDomain, rate);
      const created: MentorRecord = {
        id: (res.data?.id as string) || `mnt-${Date.now()}`,
        code: `MNT-${Math.floor(200 + Math.random() * 799)}`,
        fullName: newMentorName.trim(),
        email: `${newMentorName.trim().toLowerCase().replace(/\s+/g, ".")}@talentcir.com`,
        headline,
        domain: newMentorDomain,
        company: "TalentCIR Verified Network",
        verificationStatus: "verified",
        availability: "Available",
        hourlyRateInr: rate,
        sessionsUpcoming: 0,
        sessionsCompleted: 0,
        sessionsCancelled: 0,
        rating: 5.0,
        reviewsCount: 0,
        totalPayoutInr: 0,
        pendingPayoutInr: 0,
        assignedCourses: [],
      };
      onUpdateEnterprise((prev) => ({ ...prev, mentors: [created, ...prev.mentors] }));
      onLogAudit("mentor.created", "mentors", created.code, `Onboarded mentor ${created.fullName}`);
      setNewMentorName("");
      setShowAddMentor(false);
      toast.success(
        res.persisted
          ? `Mentor ${created.fullName} saved to live database`
          : `Mentor ${created.fullName} added`
      );
    };

    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-lg border border-[#111827]/[0.08] bg-[#f5f7fa] p-1">
            {(
              [
                { id: "mentors", label: `All mentors (${enterprise.mentors.length})` },
                { id: "sessions", label: `Session bookings (${enterprise.mentorBookings.length})` },
                { id: "payouts", label: "Mentor payouts & ratings" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setMentorTab(t.id)}
                className={cn(
                  "rounded-md px-3 py-1 text-xs font-medium cursor-pointer transition-colors duration-150",
                  mentorTab === t.id ? "bg-[#002C66] text-white" : "text-[#4b5565] hover:text-[#111827]"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <Button size="sm" className="h-8 bg-[#002C66] text-white text-xs gap-1.5 cursor-pointer" onClick={() => setShowAddMentor((v) => !v)}>
            <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
            Add mentor
          </Button>
        </div>

        {showAddMentor && (
          <form onSubmit={handleAddMentor} className="rounded-xl border border-[#002C66]/20 bg-[#f5f7fa] p-4 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <div>
              <label className="block text-xs text-[#4b5565] mb-1">Mentor name</label>
              <Input value={newMentorName} onChange={(e) => setNewMentorName(e.target.value)} placeholder="e.g. Rajesh Iyer" className="h-9 text-xs bg-white" required />
            </div>
            <div>
              <label className="block text-xs text-[#4b5565] mb-1">Domain</label>
              <Input value={newMentorDomain} onChange={(e) => setNewMentorDomain(e.target.value)} className="h-9 text-xs bg-white" />
            </div>
            <div>
              <label className="block text-xs text-[#4b5565] mb-1">Hourly rate (INR)</label>
              <Input type="number" value={newMentorRate} onChange={(e) => setNewMentorRate(e.target.value)} className="h-9 text-xs bg-white" />
            </div>
            <Button type="submit" size="sm" className="h-9 bg-[#002C66] text-white text-xs cursor-pointer">
              Save mentor
            </Button>
          </form>
        )}

        {mentorTab === "sessions" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#111827]/[0.08] text-[#6b7487]">
                  <th className="py-2.5 pr-3 font-medium">Booking</th>
                  <th className="py-2.5 px-3 font-medium">Mentor &amp; candidate</th>
                  <th className="py-2.5 px-3 font-medium">Topic</th>
                  <th className="py-2.5 px-3 font-medium">Schedule &amp; fee</th>
                  <th className="py-2.5 pl-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#111827]/[0.06]">
                {enterprise.mentorBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-[#f5f7fa]">
                    <td className="py-3 pr-3 font-mono text-[#111827]">{b.code}</td>
                    <td className="py-3 px-3">
                      <p className="font-medium text-[#111827]">{b.mentorName}</p>
                      <p className="text-[11px] text-[#6b7487]">Mentee: {b.candidateName}</p>
                    </td>
                    <td className="py-3 px-3 text-[#4b5565]">{b.topic}</td>
                    <td className="py-3 px-3 font-mono tabular-nums">
                      {b.scheduledAt} · {formatINR(b.feeInr)}
                    </td>
                    <td className="py-3 pl-3 capitalize">
                      <span className="inline-flex items-center gap-1.5">
                        <span className={cn("h-1.5 w-1.5 rounded-full", b.status === "completed" ? "bg-[#16a34a]" : b.status === "upcoming" ? "bg-[#002C66]" : "bg-[#dc2626]")} />
                        {b.status}
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
                  <th className="py-2.5 pr-3 font-medium">Mentor &amp; domain</th>
                  <th className="py-2.5 px-3 font-medium">Rate &amp; availability</th>
                  <th className="py-2.5 px-3 font-medium">Sessions (Up / Done / Canc)</th>
                  <th className="py-2.5 px-3 font-medium">Rating &amp; payouts</th>
                  <th className="py-2.5 px-3 font-medium">Verification</th>
                  <th className="py-2.5 pl-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#111827]/[0.06]">
                {enterprise.mentors.map((m) => (
                  <tr key={m.id} className="hover:bg-[#f5f7fa]">
                    <td className="py-3 pr-3">
                      <p className="font-medium text-[#111827]">{m.fullName}</p>
                      <p className="text-[11px] text-[#6b7487]">{m.code} · {m.domain} · {m.company}</p>
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums">
                      <p className="text-[#111827]">{formatINR(m.hourlyRateInr)}/hr</p>
                      <p className="text-[11px] text-[#6b7487]">{m.availability}</p>
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums text-[#4b5565]">
                      {m.sessionsUpcoming} / {m.sessionsCompleted} / {m.sessionsCancelled}
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums">
                      <p className="text-[#111827]">{m.rating > 0 ? `${m.rating}★ (${m.reviewsCount})` : "Unrated"}</p>
                      <p className="text-[11px] text-[#6b7487]">Paid {formatINR(m.totalPayoutInr)} · Due {formatINR(m.pendingPayoutInr)}</p>
                    </td>
                    <td className="py-3 px-3 capitalize">
                      <span className="inline-flex items-center gap-1.5">
                        <span className={cn("h-1.5 w-1.5 rounded-full", m.verificationStatus === "verified" ? "bg-[#16a34a]" : "bg-[#d97706]")} />
                        {m.verificationStatus}
                      </span>
                    </td>
                    <td className="py-3 pl-3 text-right">
                      {m.verificationStatus !== "verified" ? (
                        <Button
                          size="sm"
                          className="h-7 px-2 text-[11px] bg-[#002C66] text-white gap-1 cursor-pointer"
                          onClick={() => {
                            onUpdateEnterprise((prev) => ({
                              ...prev,
                              mentors: prev.mentors.map((x) =>
                                x.id === m.id ? { ...x, verificationStatus: "verified" } : x
                              ),
                            }));
                            onLogAudit("mentor.verified", "mentors", m.code, `Verified mentor credentials for ${m.fullName}`);
                            toast.success(`Verified mentor ${m.fullName}`);
                          }}
                        >
                          <Check className="h-3 w-3" strokeWidth={1.5} />
                          Approve
                        </Button>
                      ) : (
                        <span className="font-mono text-[11px] text-[#6b7487]">Active</span>
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
  }

  /* ===================== 10. TALENT POOL & CRM ===================== */
  if (module === "talent-pool") {
    const highReadiness = snapshot.candidates.filter((c) => !c.archived && c.cirScore >= 82);
    const q = search.trim().toLowerCase();
    const filteredTalent = highReadiness.filter(
      (c) => !q || [c.fullName, c.city, c.industry, ...c.skills].some((s) => s.toLowerCase().includes(q))
    );

    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-lg border border-[#111827]/[0.08] bg-[#f5f7fa] p-1">
            {(
              [
                { id: "talent", label: `High-readiness talent (${highReadiness.length})` },
                { id: "requests", label: `Employer talent requests (${enterprise.talentRequests.length})` },
                { id: "analytics", label: "Search & consent analytics" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setCrmTab(t.id)}
                className={cn(
                  "rounded-md px-3 py-1 text-xs font-medium cursor-pointer transition-colors duration-150",
                  crmTab === t.id ? "bg-[#002C66] text-white" : "text-[#4b5565] hover:text-[#111827]"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="relative w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6b7487]" strokeWidth={1.5} />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search talent pool" className="h-8 pl-8 text-xs" />
          </div>
        </div>

        {crmTab === "requests" ? (
          <div className="space-y-3">
            {enterprise.talentRequests.map((req) => (
              <div key={req.id} className="rounded-xl border border-[#111827]/[0.08] p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium text-[#111827]">{req.code}</span>
                    <span className="font-medium text-[#111827]">{req.employerName}</span>
                    <span className="text-[#6b7487]">· {req.location}</span>
                  </div>
                  <p className="text-sm font-medium text-[#111827]">{req.roleTitle} (Min CIR {req.minCirScore})</p>
                  <p className="text-[#6b7487]">Skills: {req.requiredSkills.join(", ")} · Owner: {req.ownerAdmin}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[#4b5565] tabular-nums">{req.shortlistedCount} shortlisted</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs cursor-pointer"
                    onClick={() => {
                      onUpdateEnterprise((prev) => ({
                        ...prev,
                        talentRequests: prev.talentRequests.map((r) =>
                          r.id === req.id ? { ...r, status: "shortlist_shared", shortlistedCount: r.shortlistedCount + 2 } : r
                        ),
                      }));
                      toast.success(`Shared updated CIR shortlist with ${req.employerName}`);
                    }}
                  >
                    Share shortlist
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : crmTab === "analytics" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {(() => {
              const skillFreq = new Map<string, number>();
              snapshot.candidates.forEach((c) => c.skills.forEach((sk) => skillFreq.set(sk, (skillFreq.get(sk) ?? 0) + 1)));
              const topSkills = Array.from(skillFreq.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([sk]) => sk);
              const totalViews = snapshot.candidates.reduce((s, c) => s + c.profileViews, 0);
              const activeCount = snapshot.candidates.filter((c) => !c.archived).length;
              const openCount = snapshot.candidates.filter((c) => !c.archived && c.availabilityStatus === "Actively looking").length;
              const optInPct = activeCount > 0 ? ((openCount / activeCount) * 100).toFixed(1) : "0.0";
              const totalApps = snapshot.applications.length;
              const interviewCount = snapshot.applications.filter((a) => ["Interview", "Offer", "Hired"].includes(a.stage)).length;
              const interviewRate = totalApps > 0 ? ((interviewCount / totalApps) * 100).toFixed(1) : "0.0";
              return [
                {
                  label: "Top candidate skills",
                  val: topSkills.length > 0 ? topSkills.join(", ") : "No skills indexed yet",
                  meta: `${totalViews.toLocaleString("en-IN")} total profile views`,
                },
                {
                  label: "Actively looking opt-in rate",
                  val: `${optInPct}%`,
                  meta: `${openCount} of ${activeCount} candidates visible to verified employers`,
                },
                {
                  label: "Application-to-interview rate",
                  val: `${interviewRate}%`,
                  meta: `${interviewCount} interviews across ${totalApps} live applications`,
                },
              ];
            })().map((card) => (
              <div key={card.label} className="rounded-xl border border-[#111827]/[0.08] bg-[#f5f7fa] p-4 space-y-1.5">
                <p className="text-[#6b7487]">{card.label}</p>
                <p className="text-base font-medium text-[#111827]">{card.val}</p>
                <p className="text-[#6b7487]">{card.meta}</p>
              </div>
            ))}
          </div>
        ) : filteredTalent.length === 0 ? (
          <p className="rounded-xl border border-[#111827]/[0.08] py-10 text-center text-xs text-[#6b7487]">
            No high-readiness candidates (CIR ≥ 82) in the talent pool yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
            {filteredTalent.map((c) => (
              <div
                key={c.id}
                onClick={() => onInspect({ kind: "candidate", data: c })}
                className="rounded-xl border border-[#111827]/[0.08] p-4 hover:border-[#002C66]/40 transition-colors duration-150 cursor-pointer space-y-2.5 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-[#111827]">{c.fullName}</p>
                    <p className="font-mono text-[11px] text-[#6b7487]">{c.talentCirId} · {c.city}</p>
                  </div>
                  <span className="font-mono text-sm font-medium text-[#002C66] tabular-nums">CIR {c.cirScore}</span>
                </div>
                <p className="text-[#4b5565] line-clamp-1">{c.headline}</p>
                <div className="flex flex-wrap gap-1">
                  {c.skills.slice(0, 4).map((sk) => (
                    <span key={sk} className="rounded bg-[#f5f7fa] border border-[#111827]/[0.06] px-2 py-0.5 text-[11px] text-[#4b5565]">
                      {sk}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#111827]/[0.06] text-[11px] text-[#6b7487] tabular-nums">
                  <span>{c.profileViews} recruiter views</span>
                  <span>{c.availabilityStatus}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ===================== 11. INTERVIEW MANAGEMENT ===================== */
  const filteredInterviews = enterprise.interviews.filter((i) => {
    if (intTab === "ai_mock") return i.type === "AI Mock Interview";
    if (intTab === "employer") return i.type === "Employer Interview";
    if (intTab === "disputed") return i.status === "disputed";
    return true;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-lg border border-[#111827]/[0.08] bg-[#f5f7fa] p-1">
          {(
            [
              { id: "all", label: `All interviews (${enterprise.interviews.length})` },
              { id: "employer", label: "Employer interviews" },
              { id: "ai_mock", label: "AI mock interviews" },
              { id: "disputed", label: `Disputes (${enterprise.interviews.filter((i) => i.status === "disputed").length})` },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setIntTab(t.id)}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium cursor-pointer transition-colors duration-150",
                intTab === t.id ? "bg-[#002C66] text-white" : "text-[#4b5565] hover:text-[#111827]"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <span className="font-mono text-xs text-[#6b7487] tabular-nums">
          Interview-to-offer conversion:{" "}
          {(() => {
            const interviewed = snapshot.applications.filter((a) =>
              ["Interview", "Offer", "Hired"].includes(a.stage)
            ).length;
            const offered = snapshot.applications.filter((a) =>
              ["Offer", "Hired"].includes(a.stage)
            ).length;
            return interviewed > 0 ? `${((offered / interviewed) * 100).toFixed(1)}%` : "0.0%";
          })()}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#111827]/[0.08] text-[#6b7487]">
              <th className="py-2.5 pr-3 font-medium">Interview ID &amp; type</th>
              <th className="py-2.5 px-3 font-medium">Candidate &amp; host</th>
              <th className="py-2.5 px-3 font-medium">Schedule &amp; score</th>
              <th className="py-2.5 px-3 font-medium">Evaluation summary</th>
              <th className="py-2.5 px-3 font-medium">Status &amp; outcome</th>
              <th className="py-2.5 pl-3 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#111827]/[0.06]">
            {filteredInterviews.map((item) => (
              <tr key={item.id} className="hover:bg-[#f5f7fa]">
                <td className="py-3 pr-3">
                  <p className="font-mono font-medium text-[#111827]">{item.code}</p>
                  <p className="text-[11px] text-[#6b7487]">{item.type}</p>
                </td>
                <td className="py-3 px-3">
                  <p className="font-medium text-[#111827]">{item.candidateName}</p>
                  <p className="text-[11px] text-[#6b7487]">{item.roleTitle} · {item.employerOrHost}</p>
                </td>
                <td className="py-3 px-3 font-mono tabular-nums">
                  <p className="text-[#111827]">{item.scheduledAt}</p>
                  <p className="text-[11px] text-[#6b7487]">
                    {item.aiScore ? `AI ${item.aiScore}/100` : "—"} {item.panelRating ? `· Panel ${item.panelRating}★` : ""}
                  </p>
                </td>
                <td className="py-3 px-3 text-[#4b5565] max-w-xs">{item.feedbackSummary}</td>
                <td className="py-3 px-3 capitalize">
                  <span className="inline-flex items-center gap-1.5 text-[#111827]">
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        item.status === "completed" ? "bg-[#16a34a]" : item.status === "disputed" ? "bg-[#dc2626]" : "bg-[#002C66]"
                      )}
                    />
                    {item.status} · {item.outcome}
                  </span>
                </td>
                <td className="py-3 pl-3 text-right">
                  {item.status === "disputed" ? (
                    <Button
                      size="sm"
                      className="h-7 px-2 text-[11px] bg-[#002C66] text-white cursor-pointer"
                      onClick={() => {
                        onUpdateEnterprise((prev) => ({
                          ...prev,
                          interviews: prev.interviews.map((x) =>
                            x.id === item.id ? { ...x, status: "upcoming", scheduledAt: "Rescheduled · +48h" } : x
                          ),
                        }));
                        onLogAudit("interview.dispute_resolved", "interviews", item.code, `Resolved no-show dispute & rescheduled ${item.candidateName}`);
                        toast.success(`Resolved dispute & rescheduled ${item.code}`);
                      }}
                    >
                      Resolve &amp; reschedule
                    </Button>
                  ) : (
                    <span className="font-mono text-[11px] text-[#6b7487]">Logged</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
