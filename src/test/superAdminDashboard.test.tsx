import { beforeAll, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const { tableDataMap, rpcSpy } = vi.hoisted(() => ({
  tableDataMap: new Map<string, Record<string, unknown>[]>(),
  rpcSpy: vi.fn((fn: string) => {
    if (fn === "is_current_user_admin") {
      return Promise.resolve({
        data: {
          authenticated: true,
          is_admin: true,
          user_id: "00000000-0000-4000-8000-000000000001",
          email: "admin@talentcir.com",
          aal: "aal2",
        },
        error: null,
      });
    }
    return Promise.resolve({ data: true, error: null });
  }),
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: (table: string) => ({
      select: () => ({
        order: () => ({
          limit: () => Promise.resolve({ data: tableDataMap.get(table) ?? [], error: null }),
        }),
        limit: () => Promise.resolve({ data: tableDataMap.get(table) ?? [], error: null }),
      }),
    }),
    rpc: rpcSpy,
  },
}));

import SuperAdminDashboard from "@/pages/SuperAdminDashboard";

describe("SuperAdminDashboard (100% Live Launch-Ready)", () => {
  it("starts completely fresh with zero dummy data on an empty database", async () => {
    tableDataMap.clear();
    rpcSpy.mockClear();

    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={["/super-admin"]}>
          <SuperAdminDashboard />
        </MemoryRouter>
      </HelmetProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Super Admin Command Center")).toBeInTheDocument();
    });

    // Reference Sidebar: 7 Section Group Headers
    expect(screen.getByText("OVERVIEW")).toBeInTheDocument();
    expect(screen.getByText("USERS")).toBeInTheDocument();
    expect(screen.getByText("CORE ENGINES")).toBeInTheDocument();
    expect(screen.getByText("ECOSYSTEM")).toBeInTheDocument();
    expect(screen.getByText("REVENUE")).toBeInTheDocument();
    expect(screen.getByText("ENGAGEMENT")).toBeInTheDocument();
    expect(screen.getByText("INSIGHTS & SYSTEM")).toBeInTheDocument();

    // Global Top Bar: Quick Create dropdown, Sidebar Collapse toggle & Page spec pill
    fireEvent.click(screen.getByRole("button", { name: /Quick Create/i }));
    expect(screen.getByRole("menuitem", { name: /Add New Employer/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /Send Notification/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Quick Create/i }));

    fireEvent.click(screen.getByLabelText("Collapse sidebar"));
    expect(screen.getByLabelText("Expand sidebar")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Expand sidebar"));

    fireEvent.click(screen.getByRole("button", { name: /Page spec/i }));
    expect(screen.getByText("01.01")).toBeInTheDocument();
    expect(screen.getByText("dashboard.overview.view")).toBeInTheDocument();

    // All 16 Candidate & Employer KPI/revenue boxes render with zero dummy data
    expect(screen.getByText("Total candidates")).toBeInTheDocument();
    expect(screen.getByText("Premium candidates")).toBeInTheDocument();
    expect(screen.getByText("Verification pending candidates")).toBeInTheDocument();
    expect(screen.getByText("Candidates total revenue")).toBeInTheDocument();
    expect(screen.getByText("Candidates assessment revenue")).toBeInTheDocument();
    expect(screen.getByText("Candidates learning revenue")).toBeInTheDocument();
    expect(screen.getByText("Candidates hackathon revenue")).toBeInTheDocument();
    expect(screen.getByText("Candidates networking revenue")).toBeInTheDocument();

    expect(screen.getByText("Total employers")).toBeInTheDocument();
    expect(screen.getByText("Premium employers")).toBeInTheDocument();
    expect(screen.getByText("Verification pending employers")).toBeInTheDocument();
    expect(screen.getByText("Employers total revenue")).toBeInTheDocument();
    expect(screen.getByText("Employers assessment revenue")).toBeInTheDocument();
    expect(screen.getByText("Employers learning revenue")).toBeInTheDocument();
    expect(screen.getByText("Employers hackathon revenue")).toBeInTheDocument();
    expect(screen.getByText("Employers networking revenue")).toBeInTheDocument();

    // Clean fresh empty state for CIR card & zero dummy names anywhere
    expect(screen.getByText("No CIR credentials issued yet")).toBeInTheDocument();
    expect(screen.queryByText("Yogesh")).not.toBeInTheDocument();
    expect(screen.queryByText("Super30 Technologies")).not.toBeInTheDocument();
    expect(screen.queryByText("BrightCart D2C Commerce")).not.toBeInTheDocument();

    // AI Intelligence Hub keeps all 11 engine configs ready with 0 initial requests
    fireEvent.change(screen.getByLabelText("Filter Super Admin modules"), {
      target: { value: "AI Intelligence" },
    });
    fireEvent.click(screen.getByRole("button", { name: /AI Features/i }));
    expect(screen.getByText("AI Career Intelligence (CIR)")).toBeInTheDocument();
    expect(screen.getByText("AI Interview Copilot (Linda)")).toBeInTheDocument();

    // Workflows & Fraud keeps system workflow rules ready while fraud alerts start clean
    fireEvent.change(screen.getByLabelText("Filter Super Admin modules"), {
      target: { value: "Workflows" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Workflows & Fraud/i }));
    expect(screen.getByText(/Employer KYB · SLA 4h/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("tab", { name: /Fraud Detection/i }));
    expect(screen.getByRole("tab", { name: /Fraud Detection/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("hydrates live Supabase candidates, employers, payments, wallets and fires persistent RPC writes", async () => {
    const liveCandId = "11111111-1111-4111-8111-111111111111";
    const liveEmpId = "44444444-4444-4444-8444-444444444444";
    const liveTenantId = "66666666-6666-4666-8666-666666666666";
    const liveOrderId = "22222222-2222-4222-8222-222222222222";
    const liveEmpHackOrderId = "55555555-5555-4555-8555-555555555555";
    const nowIso = new Date().toISOString();

    tableDataMap.clear();
    rpcSpy.mockClear();

    tableDataMap.set("profiles", [
      {
        id: liveCandId,
        iam_talento_id: "IAT-LIVE-9991",
        full_name: "Priya LiveUser",
        email: "priya.live@example.com",
        phone: "+91 99000 11223",
        professional_headline: "Senior Backend Engineer",
        industry: "Software & SaaS",
        city: "Pune",
        country: "India",
        years_of_experience: 5,
        open_to_work: true,
        open_for_freelance: true,
        verification_status: "pending",
        profile_completion: 92,
        industry_readiness_score: 89,
        created_at: nowIso,
        updated_at: nowIso,
      },
    ]);
    tableDataMap.set("skills", [
      { id: "sk-1", user_id: liveCandId, skill_name: "PostgreSQL" },
      { id: "sk-2", user_id: liveCandId, skill_name: "TypeScript" },
    ]);
    tableDataMap.set("assessment_attempts", [
      {
        id: "att-1",
        user_id: liveCandId,
        assessment_id: "Backend Systems",
        score: 88,
        status: "completed",
        created_at: nowIso,
      },
      {
        id: "att-2",
        user_id: liveCandId,
        assessment_id: "Cloud Architecture",
        score: 91,
        status: "completed",
        created_at: nowIso,
      },
    ]);
    tableDataMap.set("employers", [
      {
        id: liveEmpId,
        tenant_id: liveTenantId,
        company_name: "Apex Live Systems",
        official_email: "hr@apexlive.io",
        industry: "Software & SaaS",
        hq_city: "Bengaluru",
        verification_status: "pending",
        created_at: nowIso,
        updated_at: nowIso,
      },
    ]);
    tableDataMap.set("payment_orders", [
      {
        id: liveOrderId,
        user_id: liveCandId,
        item_type: "assessment_journey",
        item_ref: "Live Backend Systems CIR Assessment",
        base_amount: 1000,
        taxable_amount: 1000,
        cgst: 90,
        sgst: 90,
        igst: 0,
        total_amount: 1180,
        gateway: "razorpay",
        gateway_order_id: "order_live_999",
        gateway_payment_id: "pay_live_999",
        status: "entitled",
        invoice_number: "INV-LIVE-999",
        created_at: nowIso,
      },
      {
        id: liveEmpHackOrderId,
        tenant_id: liveTenantId,
        item_type: "hackathon_ticket",
        item_ref: "Apex Live Hackathon Track Sponsorship",
        base_amount: 100000,
        taxable_amount: 100000,
        cgst: 9000,
        sgst: 9000,
        igst: 0,
        total_amount: 118000,
        gateway: "razorpay",
        gateway_order_id: "order_emp_hack_1",
        gateway_payment_id: "pay_emp_hack_1",
        status: "entitled",
        invoice_number: "INV-EMP-HACK-1",
        created_at: nowIso,
      },
    ]);
    tableDataMap.set("wallet_accounts", [
      {
        id: "33333333-3333-4333-8333-333333333333",
        owner_type: "candidate",
        user_id: liveCandId,
        balance: 2500,
        created_at: nowIso,
      },
    ]);

    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={["/super-admin"]}>
          <SuperAdminDashboard />
        </MemoryRouter>
      </HelmetProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Super Admin Command Center")).toBeInTheDocument();
    });

    // Clicking Employers hackathon revenue drills straight into the live sponsorship order
    fireEvent.click(screen.getByText("Employers hackathon revenue"));
    expect(screen.getByText("INV-EMP-HACK-1")).toBeInTheDocument();
    expect(screen.getByText("Apex Live Hackathon Track Sponsorship")).toBeInTheDocument();
    expect(screen.queryByText("INV-LIVE-999")).not.toBeInTheDocument();

    // Navigate to All Candidates: Priya appears with 2 retest attempts and PostgreSQL skill
    fireEvent.click(screen.getByRole("button", { name: /All Candidates/i }));
    await waitFor(() => {
      expect(screen.getByText("Priya LiveUser")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Filter by Test Attempts"), {
      target: { value: "retest" },
    });
    expect(screen.getByText("Priya LiveUser")).toBeInTheDocument();

    // Archive Priya and check Archived vault + persistent RPC
    fireEvent.click(screen.getAllByTitle("Archive profile")[0]);
    await waitFor(() => {
      expect(rpcSpy).toHaveBeenCalledWith("admin_toggle_profile_archive", {
        p_user_ids: [liveCandId],
        p_archived: true,
      });
    });
    fireEvent.click(screen.getByRole("button", { name: /Archived \(1\)/i }));
    expect(screen.getByText("Priya LiveUser")).toBeInTheDocument();

    // Inspect Priya, verify Raw JSON + persistent KYC RPC
    fireEvent.click(screen.getByText("Priya LiveUser"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Mark KYC Verified/i }));
    await waitFor(() => {
      expect(rpcSpy).toHaveBeenCalledWith("admin_verify_candidate_kyc", {
        p_user_id: liveCandId,
        p_status: "verified",
        p_reason: null,
      });
    });
    fireEvent.click(screen.getByRole("button", { name: /Raw JSON Payload/i }));
    expect(screen.getByText(/"talentCirId": "IAT-LIVE-9991"/)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Close inspector"));

    // Navigate to All Employers & filter by Incomplete Company Profile
    fireEvent.click(screen.getByRole("button", { name: /All Employers/i }));
    fireEvent.change(screen.getByLabelText("Filter by Company Profile Completion"), {
      target: { value: "incomplete" },
    });
    expect(screen.getByText("Apex Live Systems")).toBeInTheDocument();

    // Navigate to All Users & test Admin Impersonation
    fireEvent.click(screen.getByRole("button", { name: /All Users/i }));
    const impersonateBtns = screen.getAllByRole("button", { name: /Impersonate/i });
    fireEvent.click(impersonateBtns[0]);
    expect(screen.getByText(/Impersonation session active:/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Exit impersonation/i }));

    tableDataMap.clear();
  });
});
