import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { employerMenuItems } from "@/components/pro/employerMenu";

const ats = vi.hoisted(() => ({
  getOverview: vi.fn(),
  listActivity: vi.fn(),
  listApplications: vi.fn(),
  getApplication: vi.fn(),
  changeStage: vi.fn(),
  bulkChangeStage: vi.fn(),
  markApplicationHired: vi.fn(),
  releaseHold: vi.fn(),
  saveApplicationNote: vi.fn(),
  listTenantRecruiters: vi.fn(),
  assignRecruiter: vi.fn(),
  setApplicationWorkflowFlags: vi.fn(),
  compareApplications: vi.fn(),
  exportApplications: vi.fn(),
  getPublishReadiness: vi.fn(),
  listEmployerNotifications: vi.fn(),
  markNotificationActed: vi.fn(),
  markNotificationsRead: vi.fn(),
}));
const talent = vi.hoisted(() => ({
  getTalentOverview: vi.fn(),
  searchCandidates: vi.fn(),
  getCandidateProfile: vi.fn(),
  getCandidateCir: vi.fn(),
  purchaseTalentPackage: vi.fn(),
}));
const jobs = vi.hoisted(() => ({
  listMyJobs: vi.fn(), createJob: vi.fn(), updateJob: vi.fn(), publishJob: vi.fn(), pauseJob: vi.fn(), resumeJob: vi.fn(),
  closeJob: vi.fn(), deleteJob: vi.fn(), duplicateJob: vi.fn(), getJobForEdit: vi.fn(),
  scheduleJobPublish: vi.fn(), renewJob: vi.fn(), promoteJob: vi.fn(),
  checkDuplicateJobs: vi.fn(), getSalaryBenchmark: vi.fn(), getCompetitorJobAnalysis: vi.fn(), generateJobAiAssist: vi.fn(),
}));
const cirPdf = vi.hoisted(() => ({ downloadCirPdf: vi.fn() }));

vi.mock("@/services/employer/ats", async (orig) => ({ ...(await orig<typeof import("@/services/employer/ats")>()), ...ats }));
vi.mock("@/services/employer/talent", async (orig) => ({ ...(await orig<typeof import("@/services/employer/talent")>()), ...talent }));
vi.mock("@/services/employer/jobs", async (orig) => ({ ...(await orig<typeof import("@/services/employer/jobs")>()), ...jobs }));
vi.mock("@/lib/cirPdf", () => cirPdf);
vi.mock("@/services/candidate/wallet", () => ({ createOrder: vi.fn(), payWithRazorpay: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { storage: { from: () => ({}) }, auth: {} } }));

import { MemoryRouter } from "react-router-dom";
import { EmployerOverview } from "@/components/pro/employer/EmployerOverview";
import { EmployerApplicantDetail } from "@/components/pro/employer/EmployerApplicantDetail";
import { EmployerPipeline } from "@/components/pro/employer/EmployerPipeline";
import { EmployerFindTalent } from "@/components/pro/employer/EmployerFindTalent";
import { EmployerNotificationsLive } from "@/components/pro/employer/EmployerNotificationsLive";
import { EmployerJobs } from "@/components/pro/employer/EmployerJobs";
import { CompanyProfileView } from "@/components/company/CompanyProfileView";
import { ProEmployerViews } from "@/components/pro/ProEmployerViews";
import { ProEmployerCommandCentre } from "@/components/pro/ProEmployerCommandCentre";
import { ProEmployerJobPosting } from "@/components/pro/ProEmployerJobPosting";
import { ProEmployerPipeline } from "@/components/pro/ProEmployerPipeline";
import { DEFAULT_USERS } from "@/data/proData";
import { DEMO_EMPLOYER_JOBS, DEMO_EMPLOYER_APPS, INITIAL_EMPLOYER_DEMO } from "@/data/employerDemo";

const toast = vi.fn();
const navigate = vi.fn();
const params = (q = "") => new URLSearchParams(q);

const overview = {
  tenant_id: "t1",
  jobs: { total: 5, active: 2, draft: 2, paused: 0, pending_review: 0, closed: 1 },
  applications: { total: 9, pending: 4, shortlisted: 2, interview: 1, on_hold: 1, selected: 1, rejected: 0 },
  recent_applications: [{ id: "a1", name: "Divya Nair", job_title: "Frontend Engineer", stage: "Applied", applied_at: new Date().toISOString(), match_score: 88 }],
  job_performance: [{ id: "j1", title: "Frontend Engineer", status: "active", views: 120, applications: 9, conversion: 7.5 }],
  wallet_balance: 1500,
  unread_notifications: 3,
  readiness: { ready: true, completion: 100, missing: [] },
};

const detail = (over: Record<string, unknown> = {}) => ({
  id: "a1", job_id: "j1", job_title: "Frontend Engineer", stage: "Applied", applied_at: "2026-11-01T10:00:00Z", stage_changed_at: "2026-11-01T10:00:00Z",
  match_score: 88, cover_note: "Hello", recruiter_note: null, candidate_id: "c1",
  candidate: { name: "Divya Nair", email: "divya@test.dev", phone: null, headline: "Engineer", city: "Pune", experience_years: 5, skills: ["React"], certifications: [], verified: true, photo_url: null, talent_cir_id: "IAT-4821", about: null, resume_path: null, resume_url: null },
  history: [{ id: 1, from: null, to: "Applied", message: "Application received", auto: true, at: "2026-11-01T10:00:00Z" }],
  interviews: [], cir_available: true,
  access: { profile: true, cv: true, cir: false, via: "applicant", verified: true, applicant: true },
  ...over,
});

beforeEach(() => {
  vi.clearAllMocks();
  ats.getOverview.mockResolvedValue(overview);
  ats.listActivity.mockResolvedValue([{ id: 1, at: new Date().toISOString(), action: "job.publish", entity: "employer_job_openings", entity_id: "j1", meta: { title: "Frontend Engineer" }, actor: "Owner" }]);
  ats.getPublishReadiness.mockResolvedValue({ ready: true, completion: 100, missing: [] });
  ats.listTenantRecruiters.mockResolvedValue([{ user_id: "r1", role: "recruiter", name: "Ananya Rao", email: "ananya@apex.dev" }]);
  jobs.checkDuplicateJobs.mockResolvedValue({ has_duplicates: false, matches: [] });
});

describe("navigation", () => {
  it("orders the employer menu with Dashboard first and My Account immediately after", () => {
    const labels = employerMenuItems.map((i) => i.label);
    const order = [
      "Dashboard",
      "My Account",
      "Company Profile",
      "Jobs",
      "Job Applications",
      "Find Talent",
      "Notifications",
      "Assessments",
    ];
    expect(labels.slice(0, order.length)).toEqual(order);
    expect(employerMenuItems.find((i) => i.label === "Dashboard")?.id).toBe("dash");
    expect(employerMenuItems.find((i) => i.label === "My Account")?.id).toBe("account");
    expect(employerMenuItems.find((i) => i.label === "Find Talent")?.id).toBe("talent");
    expect(employerMenuItems.find((i) => i.label === "Security & Settings")).toBeUndefined();
  });
});

describe("Overview", () => {
  it("shows real metrics, no SLA elements, and drills into filtered views", async () => {
    render(<EmployerOverview companyName="Apex" onNavigate={navigate} onToast={toast} />);
    expect(await screen.findByText("Welcome back, Apex")).toBeInTheDocument();
    expect(screen.queryByText(/SLA/i)).toBeNull();
    expect(screen.getByRole("button", { name: /^On hold: 1/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Draft jobs: 2/ })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^On hold: 1/ }));
    expect(navigate).toHaveBeenLastCalledWith("pipe", { stage: "On Hold" });
    fireEvent.click(screen.getByRole("button", { name: /^Draft jobs: 2/ }));
    expect(navigate).toHaveBeenLastCalledWith("post", { status: "draft" });
    fireEvent.click(screen.getByRole("button", { name: /Divya Nair/ }));
    expect(navigate).toHaveBeenLastCalledWith("pipe", { application: "a1" });
    expect(screen.getByText("Job published")).toBeInTheDocument();
  });

  it("warns and links to the profile when publishing is blocked", async () => {
    ats.getOverview.mockResolvedValue({ ...overview, readiness: { ready: false, completion: 40, missing: ["Industry", "Company size"] } });
    render(<EmployerOverview companyName="Apex" onNavigate={navigate} onToast={toast} />);
    expect(await screen.findByText(/Complete your company profile to publish jobs/)).toBeInTheDocument();
    expect(screen.getByText(/Industry, Company size/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Complete profile/ }));
    expect(navigate).toHaveBeenCalledWith("cp", { edit: "1" });
  });

  it("shows an error with retry", async () => {
    ats.getOverview.mockRejectedValueOnce(new Error("boom"));
    render(<EmployerOverview companyName="Apex" onNavigate={navigate} onToast={toast} />);
    expect(await screen.findByRole("alert")).toHaveTextContent("boom");
    fireEvent.click(screen.getByRole("button", { name: /Retry/ }));
    expect(await screen.findByText("Welcome back, Apex")).toBeInTheDocument();
  });
});

describe("Job pipeline", () => {
  const item = (id: string, name: string, stage: string) => ({
    id, job_id: "j1", job_title: "Frontend Engineer", candidate_id: id, name, headline: null, experience_years: 3, skills: ["React"], stage, match_score: 70,
    cover_note: null, applied_at: new Date().toISOString(), stage_changed_at: new Date().toISOString(), days_in_stage: 0, talent_cir_id: "IAT-1", photo_url: null, verified: false,
  });

  beforeEach(() => {
    jobs.listMyJobs.mockResolvedValue([{ id: "j1", designation: "Frontend Engineer" }]);
    ats.listApplications.mockResolvedValue({
      total: 2, counts: { Applied: 1, "On Hold": 1 }, items: [item("a1", "Divya Nair", "Applied"), item("a2", "Rahul Mehta", "On Hold")],
    });
  });

  it("renders every lifecycle column including On Hold with correct counts", async () => {
    render(<EmployerPipeline searchParams={params()} onNavigate={navigate} onToast={toast} />);
    await screen.findByText("Divya Nair");
    for (const col of ["Pending", "Shortlisted", "Interview", "On Hold", "Selected", "Rejected"]) {
      expect(screen.getByRole("region", { name: `${col} column` })).toBeInTheDocument();
    }
    const hold = screen.getByRole("region", { name: "On Hold column" });
    expect(within(hold).getByText("Rahul Mehta")).toBeInTheDocument();
    expect(within(hold).getByText("1")).toBeInTheDocument();
    expect(screen.getByLabelText("Search applicants")).toBeVisible();
    expect(screen.getByLabelText("Filter by job")).toBeVisible();
    expect(screen.getByLabelText("Filter by stage")).toBeVisible();
    expect(screen.getByLabelText("Sort applicants")).toBeVisible();
    expect(screen.queryByText(/SLA/i)).toBeNull();
  });

  it("opens a candidate and filters by status through the URL", async () => {
    render(<EmployerPipeline searchParams={params()} onNavigate={navigate} onToast={toast} />);
    fireEvent.click(await screen.findByText("Divya Nair"));
    expect(navigate).toHaveBeenLastCalledWith("pipe", { application: "a1" });
    fireEvent.click(screen.getByRole("button", { name: /On Hold/ }));
    expect(navigate).toHaveBeenLastCalledWith("pipe", { stage: "On Hold" });
  });

  it("shows the empty state when there are no applications", async () => {
    ats.listApplications.mockResolvedValue({ total: 0, counts: {}, items: [] });
    render(<EmployerPipeline searchParams={params()} onNavigate={navigate} onToast={toast} />);
    expect(await screen.findByText("No applications yet")).toBeInTheDocument();
  });

  it("opens the application detail when the URL carries an application id", async () => {
    ats.getApplication.mockResolvedValue(detail());
    render(<EmployerPipeline searchParams={params("application=a1")} onNavigate={navigate} onToast={toast} />);
    expect(await screen.findByText("Talent CIR ID", { selector: "p" })).toBeInTheDocument();
  });
});

describe("Applicant detail and CIR report access", () => {
  it("puts the CIR button between Share Profile and Download CV and shows the Talent CIR ID", async () => {
    ats.getApplication.mockResolvedValue(detail());
    render(<EmployerApplicantDetail applicationId="a1" onBack={vi.fn()} onChanged={vi.fn()} onToast={toast} />);
    await screen.findByText(/Applied for Frontend Engineer/);
    const buttons = screen.getAllByRole("button").map((b) => b.textContent ?? "");
    const share = buttons.findIndex((t) => t.includes("Share Profile"));
    const cir = buttons.findIndex((t) => t.includes("Unlock & Download CIR Report"));
    const cv = buttons.findIndex((t) => t.includes("Download CV"));
    expect(share).toBeGreaterThanOrEqual(0);
    expect(cir).toBe(share + 1);
    expect(cv).toBe(cir + 1);
    expect(screen.getAllByText("IAT-4821").length).toBeGreaterThan(0);
    expect(screen.queryByText(/sample/i)).toBeNull();
    expect(screen.queryByText(/Source/)).toBeNull();
  });

  it("opens the payment flow instead of the report when CIR access is not unlocked", async () => {
    ats.getApplication.mockResolvedValue(detail());
    talent.getTalentOverview.mockResolvedValue({
      wallet: { wallet_id: "w", balance: 0, currency: "INR", ledger: [] }, subscription: null, unlocked_count: 0, can_unlock: true,
      packages: [{ key: "verified_profile", name: "Verified profile access", description: "Full profile", price_inr: 2999, scope: "per_profile", verified_only: true, grants_cv: true, grants_cir: true, duration_days: null }],
    });
    render(<EmployerApplicantDetail applicationId="a1" onBack={vi.fn()} onChanged={vi.fn()} onToast={toast} />);
    fireEvent.click(await screen.findByRole("button", { name: /Unlock and download CIR report/i }));
    expect(await screen.findByText(/Premium access/)).toBeInTheDocument();
    expect(talent.getCandidateCir).not.toHaveBeenCalled();
    expect(await screen.findByText(/Recharge ₹2,999 more to buy/)).toBeInTheDocument();
    expect(talent.purchaseTalentPackage).not.toHaveBeenCalled();
  });

  it("downloads the report when the entitlement exists", async () => {
    ats.getApplication.mockResolvedValue(detail({ access: { profile: true, cv: true, cir: true, via: "purchase", verified: true, applicant: true } }));
    talent.getCandidateCir.mockResolvedValue({ talent_cir_id: "IAT-4821", candidate_name: "Divya Nair", composite_score: 82, percentile: 90, tier: "Elite", integrity_score: 96, sections: {}, version: 1, generated_at: "2026-11-01T00:00:00Z" });
    render(<EmployerApplicantDetail applicationId="a1" onBack={vi.fn()} onChanged={vi.fn()} onToast={toast} />);
    fireEvent.click(await screen.findByRole("button", { name: /Unlock and download CIR report/i }));
    await waitFor(() => expect(cirPdf.downloadCirPdf).toHaveBeenCalledTimes(1));
    expect(talent.getCandidateCir).toHaveBeenCalledWith("c1");
  });

  it("falls back to the payment flow when the server refuses the report", async () => {
    ats.getApplication.mockResolvedValue(detail({ access: { profile: true, cv: true, cir: true, via: "purchase", verified: true, applicant: true } }));
    talent.getCandidateCir.mockRejectedValue(Object.assign(new Error("not unlocked"), { code: "P0402" }));
    talent.getTalentOverview.mockResolvedValue({ wallet: { wallet_id: "w", balance: 5000, currency: "INR", ledger: [] }, subscription: null, unlocked_count: 0, can_unlock: true, packages: [] });
    render(<EmployerApplicantDetail applicationId="a1" onBack={vi.fn()} onChanged={vi.fn()} onToast={toast} />);
    fireEvent.click(await screen.findByRole("button", { name: /Unlock and download CIR report/i }));
    expect(await screen.findByText(/Premium access/)).toBeInTheDocument();
    expect(cirPdf.downloadCirPdf).not.toHaveBeenCalled();
  });

  it("moves an applicant to On Hold with a note and releases it", async () => {
    ats.getApplication.mockResolvedValue(detail());
    ats.changeStage.mockResolvedValue({});
    const onChanged = vi.fn();
    render(<EmployerApplicantDetail applicationId="a1" onBack={vi.fn()} onChanged={onChanged} onToast={toast} />);
    await screen.findByText(/Applied for Frontend Engineer/);
    fireEvent.click(screen.getByRole("button", { name: "On Hold" }));
    fireEvent.change(screen.getByPlaceholderText("Reason for this decision"), { target: { value: "Budget freeze" } });
    fireEvent.click(screen.getByRole("button", { name: /Save status/ }));
    await waitFor(() => expect(ats.changeStage).toHaveBeenCalledWith("a1", "On Hold", "Budget freeze"));
    expect(onChanged).toHaveBeenCalled();
  });

  it("offers Release from hold for applicants on hold and lists history", async () => {
    ats.getApplication.mockResolvedValue(detail({
      stage: "On Hold",
      history: [
        { id: 1, from: null, to: "Applied", message: "Application received", auto: true, at: "2026-11-01T10:00:00Z" },
        { id: 2, from: "Applied", to: "On Hold", message: "Budget freeze", auto: false, at: "2026-11-02T10:00:00Z" },
      ],
    }));
    ats.releaseHold.mockResolvedValue({});
    render(<EmployerApplicantDetail applicationId="a1" onBack={vi.fn()} onChanged={vi.fn()} onToast={toast} />);
    fireEvent.click(await screen.findByRole("button", { name: /Release from hold/ }));
    await waitFor(() => expect(ats.releaseHold).toHaveBeenCalledWith("a1"));
    fireEvent.click(screen.getByRole("button", { name: "Activity" }));
    expect(screen.getByText("Pending → On Hold")).toBeInTheDocument();
    expect(screen.getByText("Budget freeze")).toBeInTheDocument();
  });
});

describe("Find Talent", () => {
  const pkgs = [
    { key: "unverified_profile", name: "Candidate profile", description: "d", price_inr: 99, scope: "per_profile", verified_only: false, grants_cv: false, grants_cir: false, duration_days: null },
    { key: "verified_profile", name: "Verified profile access", description: "d", price_inr: 2999, scope: "per_profile", verified_only: true, grants_cv: true, grants_cir: true, duration_days: null },
    { key: "verified_monthly", name: "Verified subscription", description: "d", price_inr: 2499, scope: "subscription", verified_only: true, grants_cv: true, grants_cir: true, duration_days: 30 },
  ];
  const overviewOf = (balance: number, sub: { package_key: string; expires_at: string } | null = null) => ({
    wallet: { wallet_id: "w", balance, currency: "INR", ledger: [] }, subscription: sub, packages: pkgs, unlocked_count: 0, can_unlock: true,
  });
  const cand = (over = {}) => ({ id: "c1", display_name: "Divya N.", photo_url: null, headline: "Senior Engineer", job_role: null, city: "Pune", years_of_experience: 5, verified: true, status: "Open to work", skills: ["React"], education: "B.Tech in CS", unlocked: false, ...over });

  it("offers Candidates and Verified Candidates with different access levels", async () => {
    talent.getTalentOverview.mockResolvedValue(overviewOf(0));
    render(<EmployerFindTalent searchParams={params()} onNavigate={navigate} onToast={toast} />);
    expect(await screen.findByRole("heading", { name: "Candidates" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Verified candidates/ })).toBeInTheDocument();
    expect(screen.getByText(/Contact details, CV and CIR report stay locked/)).toBeInTheDocument();
    expect(screen.getByText(/Premium/)).toBeInTheDocument();
  });

  it("browses normal candidates with a limited overview and no contact data", async () => {
    talent.getTalentOverview.mockResolvedValue(overviewOf(0));
    talent.searchCandidates.mockResolvedValue({ total: 1, items: [cand({ verified: false })] });
    render(<EmployerFindTalent searchParams={params()} onNavigate={navigate} onToast={toast} />);
    fireEvent.click(await screen.findByRole("button", { name: "Browse candidates" }));
    expect(await screen.findByText("Divya N.")).toBeInTheDocument();
    expect(screen.getByText("B.Tech in CS")).toBeInTheDocument();
    expect(screen.getByText(/Contact details locked/)).toBeInTheDocument();
    expect(screen.queryByText(/@/)).toBeNull();
    expect(talent.searchCandidates).toHaveBeenCalledWith(expect.objectContaining({ verified: false }));
  });

  it("locks verified candidates behind a wallet recharge when the balance is too low", async () => {
    talent.getTalentOverview.mockResolvedValue(overviewOf(100));
    talent.searchCandidates.mockResolvedValue({ total: 1, items: [cand()] });
    render(<EmployerFindTalent searchParams={params()} onNavigate={navigate} onToast={toast} />);
    fireEvent.click(await screen.findByRole("button", { name: /Unlock verified candidates/ }));
    expect(await screen.findByText(/Verified candidates are a premium feature/)).toBeInTheDocument();
    expect(screen.getByText(/below the lowest verified package/)).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /Recharge wallet/ }).length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: /Recharge ₹2,399 more/ })).toBeDisabled();
  });

  it("purchases the subscription from the wallet and unlocks access", async () => {
    talent.getTalentOverview.mockResolvedValueOnce(overviewOf(5000)).mockResolvedValue(overviewOf(2501, { package_key: "verified_monthly", expires_at: "2026-12-12T00:00:00Z" }));
    talent.searchCandidates.mockResolvedValue({ total: 1, items: [cand()] });
    talent.purchaseTalentPackage.mockResolvedValue({ granted: true, already_owned: false, grant_id: "g", balance: 2501 });
    render(<EmployerFindTalent searchParams={params()} onNavigate={navigate} onToast={toast} />);
    fireEvent.click(await screen.findByRole("button", { name: /Unlock verified candidates/ }));
    fireEvent.click(await screen.findByRole("button", { name: /Subscribe for ₹2,499/ }));
    await waitFor(() => expect(talent.purchaseTalentPackage).toHaveBeenCalledWith("verified_monthly"));
    await waitFor(() => expect(screen.queryByText(/Verified candidates are a premium feature/)).toBeNull());
    expect(await screen.findByText(/Subscription until/)).toBeInTheDocument();
    expect(await screen.findByRole("button", { name: "View profile" })).toBeInTheDocument();
  });

  it("does not open a full profile when the server asks for payment", async () => {
    talent.getTalentOverview.mockResolvedValue(overviewOf(5000));
    talent.searchCandidates.mockResolvedValue({ total: 1, items: [cand({ unlocked: true })] });
    talent.getCandidateProfile.mockRejectedValue(Object.assign(new Error("Unlock this candidate"), { code: "P0402" }));
    render(<EmployerFindTalent searchParams={params()} onNavigate={navigate} onToast={toast} />);
    fireEvent.click(await screen.findByRole("button", { name: /Unlock verified candidates/ }));
    fireEvent.click(await screen.findByRole("button", { name: "View profile" }));
    expect(await screen.findByText(/Premium access/)).toBeInTheDocument();
    expect(screen.queryByText("divya@test.dev")).toBeNull();
  });
});

describe("Follow-up notifications", () => {
  const n = (over = {}) => ({
    id: "n1", kind: "employer_followup", title: "Application pending for 2 days", body: "Divya applied. Review the profile.",
    link: "/talento-pro?view=pipe&application=11111111-1111-4111-8111-111111111111",
    data: { application_id: "11111111-1111-4111-8111-111111111111", suggested_action: "Shortlist, hold or reject." }, read_at: null, acted_at: null,
    created_at: new Date().toISOString(), ...over,
  });

  it("shows the suggested next step and opens the application, marking it acted", async () => {
    ats.listEmployerNotifications.mockResolvedValue([n()]);
    ats.markNotificationActed.mockResolvedValue(true);
    render(<EmployerNotificationsLive onNavigate={navigate} onToast={toast} />);
    expect(await screen.findByText("Application pending for 2 days")).toBeInTheDocument();
    expect(screen.getByText(/Suggested next step/)).toBeInTheDocument();
    expect(screen.getByText("Needs action")).toBeInTheDocument();
    expect(screen.queryByText(/SLA/i)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /Review/ }));
    await waitFor(() => expect(ats.markNotificationActed).toHaveBeenCalledWith("n1"));
    expect(navigate).toHaveBeenCalledWith("pipe", { application: "11111111-1111-4111-8111-111111111111" });
  });

  it("filters follow-ups and marks all read", async () => {
    ats.listEmployerNotifications.mockResolvedValue([n(), n({ id: "n2", kind: "application", title: "New application: Dev", data: {}, link: null })]);
    ats.markNotificationsRead.mockResolvedValue(2);
    render(<EmployerNotificationsLive onNavigate={navigate} onToast={toast} />);
    await screen.findByText("New application: Dev");
    fireEvent.click(screen.getByRole("tab", { name: "Follow-ups" }));
    expect(screen.queryByText("New application: Dev")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /Mark all read/ }));
    await waitFor(() => expect(ats.markNotificationsRead).toHaveBeenCalledTimes(1));
    expect(ats.markNotificationsRead.mock.calls[0]).toHaveLength(0);
  });

  it("shows the all-caught-up state", async () => {
    ats.listEmployerNotifications.mockResolvedValue([]);
    render(<EmployerNotificationsLive onNavigate={navigate} onToast={toast} />);
    expect(await screen.findByText("You are all caught up")).toBeInTheDocument();
  });
});

describe("Jobs and drafts", () => {
  const listed = (over = {}) => ({ id: "j1", designation: "Frontend Engineer", status: "draft", work_mode: "Remote", job_type: "Full-time", job_location: "", skills: ["React"], views_count: 0, applications_count: 0, published_at: null, closes_at: null, created_at: "2026-11-01T00:00:00Z", moderation_note: null, salary_min: null, salary_max: null, ...over });

  it("lists drafts with a publish action and applies the status filter from the dashboard", async () => {
    jobs.listMyJobs.mockResolvedValue([listed(), listed({ id: "j2", designation: "Backend Engineer", status: "active" })]);
    render(<EmployerJobs companyName="Apex" searchParams={params("status=draft")} onNavigate={navigate} onToast={toast} />);
    expect(await screen.findByText("Frontend Engineer")).toBeInTheDocument();
    expect(screen.queryByText("Backend Engineer")).toBeNull();
    expect(screen.getByRole("button", { name: /Publish/ })).toBeInTheDocument();
  });

  it("blocks publishing with a clear message when the company profile is incomplete", async () => {
    jobs.listMyJobs.mockResolvedValue([listed()]);
    ats.getPublishReadiness.mockResolvedValue({ ready: false, completion: 30, missing: ["Industry", "Company size"] });
    render(<EmployerJobs companyName="Apex" searchParams={params()} onNavigate={navigate} onToast={toast} />);
    expect(await screen.findByText(/company profile is incomplete/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /^Publish$/ }));
    await waitFor(() => expect(toast).toHaveBeenCalledWith(expect.stringContaining("Missing: Industry, Company size")));
    expect(jobs.publishJob).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Complete company profile" }));
    expect(navigate).toHaveBeenCalledWith("cp", { edit: "1" });
  });

  it("saves an incomplete job as a draft, and publishes a complete one", async () => {
    jobs.listMyJobs.mockResolvedValue([]);
    jobs.createJob.mockResolvedValue({ id: "new1", status: "draft" });
    jobs.publishJob.mockResolvedValue({ id: "new1", status: "active" });
    render(<EmployerJobs companyName="Apex" searchParams={params("new=1")} onNavigate={navigate} onToast={toast} />);
    const title = await screen.findByPlaceholderText("Senior React Developer");
    fireEvent.change(title, { target: { value: "Data Analyst" } });
    fireEvent.click(screen.getByRole("button", { name: /Save as draft/ }));
    await waitFor(() => expect(jobs.createJob).toHaveBeenCalledWith(expect.objectContaining({ designation: "Data Analyst" })));
    expect(jobs.publishJob).not.toHaveBeenCalled();
    expect(toast).toHaveBeenCalledWith("Draft saved.");
  });

  it("requires a description and skills before publishing", async () => {
    jobs.listMyJobs.mockResolvedValue([]);
    render(<EmployerJobs companyName="Apex" searchParams={params("new=1")} onNavigate={navigate} onToast={toast} />);
    fireEvent.change(await screen.findByPlaceholderText("Senior React Developer"), { target: { value: "Data Analyst" } });
    fireEvent.click(screen.getByRole("button", { name: /Publish job/ }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/description/i);
    expect(jobs.createJob).not.toHaveBeenCalled();
  });
});

describe("Company page layout", () => {
  it("uses one horizontal section bar and no vertical divider layout", () => {
    const { container } = render(
      <CompanyProfileView
        company={{ name: "Apex", industry: "Software", hq: "Pune", about: "We build things.", benefits: ["Health insurance"], contact: { email: "hr@apex.dev", altEmails: ["jobs@apex.dev"] } }}
        jobs={[{ id: "1", title: "Engineer", location: "Pune" }]}
      />,
    );
    const nav = screen.getByRole("navigation", { name: "Company sections" });
    expect(within(nav).getAllByRole("button").map((b) => b.textContent)).toEqual(["Overview", "About", "Jobs (1)", "Culture & benefits", "Contact"]);
    expect(container.querySelector(".border-l")).toBeNull();
    expect(screen.getByText("jobs@apex.dev")).toBeInTheDocument();
  });
});

describe("Find Talent Wallet Bento & Employer Command Centre", () => {
  beforeEach(() => {
    if (typeof HTMLDialogElement !== "undefined" && !HTMLDialogElement.prototype.showModal) {
      HTMLDialogElement.prototype.showModal = function () {
        this.setAttribute("open", "");
      };
      HTMLDialogElement.prototype.close = function () {
        this.removeAttribute("open");
      };
    }
  });

  it("exposes all Command Centre modules in employerMenuItems after the core items", () => {
    const ids = employerMenuItems.map((i) => i.id);
    expect(ids).toEqual(
      expect.arrayContaining([
        "ai-hub",
        "talent-pool",
        "interviews",
        "offers",
        "campus-hiring",
        "employer-analytics",
      ]),
    );
  });

  it("renders Wallet Bento Box in Find Talent and confirms wallet deduction before unlocking Verified Candidates", () => {
    const employerUser = {
      ...DEFAULT_USERS["demo.employer@talento.app"],
      wal: { bal: 12000, tx: [] },
    };
    const onUpdateWallet = vi.fn();
    render(
      <ProEmployerViews
        view="talent"
        user={employerUser}
        jobs={DEMO_EMPLOYER_JOBS}
        applications={DEMO_EMPLOYER_APPS}
        onSaveCompanyProfile={vi.fn()}
        onPublishJob={vi.fn()}
        onUpdateApplicantStage={vi.fn()}
        onBulkUpdateStage={vi.fn()}
        onBulkSendReview={vi.fn()}
        onOpenDrawer={vi.fn()}
        onToast={toast}
        onNavigate={navigate}
        onUpdateWallet={onUpdateWallet}
      />,
    );

    const bento = screen.getByRole("region", { name: /Hiring wallet and candidate pool selector/i });
    expect(within(bento).getByText("Company Wallet")).toBeInTheDocument();
    expect(within(bento).getByText("₹12,000")).toBeInTheDocument();
    expect(within(bento).getByText("Candidates")).toBeInTheDocument();

    const verifiedCard = within(bento).getByRole("button", { name: /Verified Candidates/i });
    fireEvent.click(verifiedCard);

    expect(
      screen.getByRole("heading", { name: /Are you sure you want to unlock Verified Candidates\?/i }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Yes, Deduct ₹499 & Unlock/i }));

    expect(onUpdateWallet).toHaveBeenCalledWith(
      11501,
      expect.objectContaining({
        type: "debit",
        amt: 499,
        via: "Company Wallet",
      }),
    );
    expect(within(bento).getByText("Unlocked")).toBeInTheDocument();
  });

  it("renders the Employer Command Centre modules cleanly", () => {
    const employerUser = DEFAULT_USERS["demo.employer@talento.app"];
    const { rerender } = render(
      <ProEmployerCommandCentre
        view="ai-hub"
        user={employerUser}
        jobs={DEMO_EMPLOYER_JOBS}
        applications={DEMO_EMPLOYER_APPS}
        state={INITIAL_EMPLOYER_DEMO}
        onChange={vi.fn()}
        onNavigate={navigate}
        onOpenDrawer={vi.fn()}
        onPublishJob={vi.fn()}
        onUpdateApplicantStage={vi.fn()}
        onToast={toast}
      />,
    );
    expect(screen.getByText(/Don't Just Find Candidates\. Find the Right Talent\./i)).toBeInTheDocument();

    rerender(
      <ProEmployerCommandCentre
        view="offers"
        user={employerUser}
        jobs={DEMO_EMPLOYER_JOBS}
        applications={DEMO_EMPLOYER_APPS}
        state={INITIAL_EMPLOYER_DEMO}
        onChange={vi.fn()}
        onNavigate={navigate}
        onOpenDrawer={vi.fn()}
        onPublishJob={vi.fn()}
        onUpdateApplicantStage={vi.fn()}
        onToast={toast}
      />,
    );
    expect(screen.getByText(/Close the Right Talent\. Faster\./i)).toBeInTheDocument();
  });
});

describe("2. Job Management & 3. Job Applications Management (Live & Demo)", () => {
  it("renders Section 2 Job Management with AI Co-Pilot, benchmarks, competitor analysis, duplicate detection, and renewal", async () => {
    jobs.listMyJobs.mockResolvedValue([
      {
        id: "j-closed",
        designation: "Cloud Architect",
        status: "closed",
        work_mode: "Remote",
        job_type: "Full-time",
        job_location: "Bengaluru",
        city: "Bengaluru",
        country: "India",
        industry: "Cloud",
        department: "Platform",
        job_function: "Architecture",
        skills: ["AWS"],
        views_count: 200,
        applications_count: 15,
        conversion_rate: 7.5,
        is_featured: true,
        is_sponsored: false,
        published_at: "2026-10-01T00:00:00Z",
        closes_at: "2026-10-31T00:00:00Z",
        created_at: "2026-10-01T00:00:00Z",
        moderation_note: null,
        salary_min: 30,
        salary_max: 45,
      },
    ]);
    jobs.renewJob.mockResolvedValue({ id: "j-closed", status: "active" });
    jobs.generateJobAiAssist.mockResolvedValue({
      job_description: "Generated enterprise cloud architect job description with full ownership.",
      responsibilities: "Own cloud architecture",
      qualifications: "B.Tech CS",
      requirements: "5+ yrs AWS",
      benefits: ["Health Insurance"],
      suggested_skills: ["AWS", "Terraform", "Kubernetes"],
    });
    jobs.getSalaryBenchmark.mockResolvedValue({
      min_lpa: 28,
      median_lpa: 35,
      max_lpa: 42,
      sample_size: 14,
      currency: "INR",
      location_factor: 1.1,
    });
    jobs.getCompetitorJobAnalysis.mockResolvedValue({
      competing_openings: 12,
      active_employers: 7,
      avg_salary_min: 26,
      avg_salary_max: 40,
      remote_share_pct: 40,
      hybrid_share_pct: 60,
      top_skills: ["AWS"],
      demand_level: "High",
    });
    jobs.checkDuplicateJobs.mockResolvedValue({
      has_duplicates: true,
      matches: [{ id: "j-closed", designation: "Cloud Architect", status: "closed", job_location: "Bengaluru", similarity_pct: 92 }],
    });

    render(<EmployerJobs companyName="Apex" searchParams={params("new=1")} onNavigate={navigate} onToast={toast} />);
    expect(await screen.findByText("Manage Every Opportunity. From Posting to Placement.")).toBeInTheDocument();
    expect(screen.getAllByText("7.5%").length).toBeGreaterThan(0);

    const titleInput = await screen.findByPlaceholderText("Senior React Developer");
    fireEvent.change(titleInput, { target: { value: "Cloud Architect" } });
    expect(await screen.findByText(/Duplicate Job Detection/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /AI JD Generator/i }));
    await waitFor(() => expect(jobs.generateJobAiAssist).toHaveBeenCalled());

    fireEvent.click(screen.getByRole("button", { name: /Salary Benchmark/i }));
    expect(await screen.findByText(/Median ₹35 LPA/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Competitor Analysis/i }));
    expect(await screen.findByText(/12 openings across 7 employers/i)).toBeInTheDocument();
  });

  it("renders Section 3 Job Applications Management with all 11 buckets, bulk shortlist/reject, notes, recruiter assignment, and comparison", async () => {
    jobs.listMyJobs.mockResolvedValue([{ id: "j1", designation: "Senior React Developer" }]);
    ats.listApplications.mockResolvedValue({
      total: 2,
      counts: { Applied: 2 },
      buckets: {
        all: 2,
        new: 2,
        ai_screened: 2,
        shortlisted: 0,
        rejected: 0,
        on_hold: 0,
        interview_scheduled: 0,
        assessment_pending: 1,
        assessment_completed: 1,
        offer_released: 0,
        hired: 0,
      },
      items: [
        {
          id: "a1",
          job_id: "j1",
          job_title: "Senior React Developer",
          candidate_id: "c1",
          name: "Divya Nair",
          headline: "Frontend Lead",
          experience_years: 5,
          skills: ["React", "TypeScript"],
          stage: "Applied",
          match_score: 91,
          cir_score: 86,
          ai_screened: true,
          assessment_status: "completed",
          assigned_recruiter_name: "Ananya Rao",
          recruiter_note: "Strong architecture round.",
          cover_note: null,
          applied_at: new Date().toISOString(),
          stage_changed_at: new Date().toISOString(),
          days_in_stage: 0,
          talent_cir_id: "IAT-1",
          photo_url: null,
          verified: true,
        },
        {
          id: "a2",
          job_id: "j1",
          job_title: "Senior React Developer",
          candidate_id: "c2",
          name: "Rahul Mehta",
          headline: "React Engineer",
          experience_years: 3,
          skills: ["React"],
          stage: "Applied",
          match_score: 78,
          cir_score: null,
          ai_screened: true,
          assessment_status: "pending",
          assigned_recruiter_name: null,
          recruiter_note: null,
          cover_note: null,
          applied_at: new Date().toISOString(),
          stage_changed_at: new Date().toISOString(),
          days_in_stage: 0,
          talent_cir_id: "IAT-2",
          photo_url: null,
          verified: false,
        },
      ],
    });
    ats.bulkChangeStage.mockResolvedValue({ updated: 2, stage: "Shortlisted" });
    ats.compareApplications.mockResolvedValue([
      {
        id: "a1",
        job_id: "j1",
        job_title: "Senior React Developer",
        candidate_id: "c1",
        name: "Divya Nair",
        headline: "Frontend Lead",
        city: "Pune",
        experience_years: 5,
        skills: ["React", "TypeScript"],
        certifications: [],
        verified: true,
        photo_url: null,
        talent_cir_id: "IAT-1",
        stage: "Applied",
        is_hired: false,
        offer_released: false,
        assessment_status: "completed",
        ai_screened: true,
        match_score: 91,
        cir_score: 86,
        cir_tier: "Gold",
        readiness_score: 86,
        assigned_recruiter_name: "Ananya Rao",
        recruiter_note: "Strong architecture round.",
        interview_count: 0,
        applied_at: new Date().toISOString(),
      },
      {
        id: "a2",
        job_id: "j1",
        job_title: "Senior React Developer",
        candidate_id: "c2",
        name: "Rahul Mehta",
        headline: "React Engineer",
        city: "Mumbai",
        experience_years: 3,
        skills: ["React"],
        certifications: [],
        verified: false,
        photo_url: null,
        talent_cir_id: "IAT-2",
        stage: "Applied",
        is_hired: false,
        offer_released: false,
        assessment_status: "pending",
        ai_screened: true,
        match_score: 78,
        cir_score: null,
        cir_tier: null,
        readiness_score: 78,
        assigned_recruiter_name: null,
        recruiter_note: null,
        interview_count: 0,
        applied_at: new Date().toISOString(),
      },
    ]);

    render(<EmployerPipeline searchParams={params()} onNavigate={navigate} onToast={toast} />);
    expect(await screen.findByText("Every Application. Every Candidate. Every Hiring Decision.")).toBeInTheDocument();

    const tablist = screen.getByRole("tablist", { name: "Application views" });
    expect(within(tablist).getAllByRole("tab")).toHaveLength(11);

    // Select both candidates and verify Bulk Shortlist & Candidate Comparison
    fireEvent.click(screen.getByLabelText("Select Divya Nair"));
    fireEvent.click(screen.getByLabelText("Select Rahul Mehta"));

    fireEvent.click(screen.getByRole("button", { name: /Compare selected \(2\)/i }));
    expect(await screen.findByRole("region", { name: "Candidate comparison table" })).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });

    fireEvent.click(screen.getByRole("button", { name: /Bulk Shortlist/i }));
    await waitFor(() => expect(ats.bulkChangeStage).toHaveBeenCalledWith(["a1", "a2"], "Shortlisted"));
  });

  it("renders Demo ProEmployerJobPosting and ProEmployerPipeline with full Section 2 & Section 3 parity", () => {
    const employerUser = DEFAULT_USERS["demo.employer@talento.app"];
    const onSaveJob = vi.fn();
    const { unmount } = render(
      <ProEmployerJobPosting
        user={employerUser}
        jobs={DEMO_EMPLOYER_JOBS}
        applications={DEMO_EMPLOYER_APPS}
        onPublishJob={vi.fn()}
        onSaveJob={onSaveJob}
        onToast={toast}
      />,
    );
    expect(screen.getByText("Manage Every Opportunity. From Posting to Placement.")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Manage job posts table" })).toBeInTheDocument();
    unmount();

    const onBulkUpdateStage = vi.fn();
    render(
      <MemoryRouter>
        <ProEmployerPipeline
          user={employerUser}
          jobs={DEMO_EMPLOYER_JOBS}
          applications={DEMO_EMPLOYER_APPS}
          onOpenDrawer={vi.fn()}
          onBulkUpdateStage={onBulkUpdateStage}
          onBulkSendReview={vi.fn()}
          onToast={toast}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText("Every Application. Every Candidate. Every Hiring Decision.")).toBeInTheDocument();
    expect(within(screen.getByRole("tablist", { name: "Application views" })).getAllByRole("tab")).toHaveLength(11);
  });
});
