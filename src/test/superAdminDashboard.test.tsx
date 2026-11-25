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

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => ({
      select: () => ({
        order: () => ({
          limit: () => Promise.resolve({ data: [], error: null }),
        }),
        limit: () => Promise.resolve({ data: [], error: null }),
      }),
    }),
    rpc: () => Promise.resolve({ data: null, error: null }),
  },
}));

import SuperAdminDashboard from "@/pages/SuperAdminDashboard";

describe("SuperAdminDashboard", () => {
  it("renders Executive Overview, Candidate multi-facet filters & Archive vault, and Employer Incomplete Company Profile filter", async () => {
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

    // Global Top Bar: Quick Create dropdown & Sidebar Collapse toggle
    fireEvent.click(screen.getByRole("button", { name: /Quick Create/i }));
    expect(screen.getByRole("menuitem", { name: /Add New Employer/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /Send Notification/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Quick Create/i }));

    fireEvent.click(screen.getByLabelText("Collapse sidebar"));
    expect(screen.getByLabelText("Expand sidebar")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Expand sidebar"));

    // Page spec metadata pill toggles Menu ID & Route info
    fireEvent.click(screen.getByRole("button", { name: /Page spec/i }));
    expect(screen.getByText("01.01")).toBeInTheDocument();
    expect(screen.getByText("dashboard.overview.view")).toBeInTheDocument();

    // Candidate 8-box KPI & revenue grid (2 rows × 4 cols)
    expect(screen.getByText("Total candidates")).toBeInTheDocument();
    expect(screen.getByText("Premium candidates")).toBeInTheDocument();
    expect(screen.getByText("Verification pending candidates")).toBeInTheDocument();
    expect(screen.getByText("Candidates total revenue")).toBeInTheDocument();
    expect(screen.getByText("Candidates assessment revenue")).toBeInTheDocument();
    expect(screen.getByText("Candidates learning revenue")).toBeInTheDocument();
    expect(screen.getByText("Candidates hackathon revenue")).toBeInTheDocument();
    expect(screen.getByText("Candidates networking revenue")).toBeInTheDocument();

    // Employer 8-box KPI & revenue grid (2 rows × 4 cols)
    expect(screen.getByText("Total employers")).toBeInTheDocument();
    expect(screen.getByText("Premium employers")).toBeInTheDocument();
    expect(screen.getByText("Verification pending employers")).toBeInTheDocument();
    expect(screen.getByText("Employers total revenue")).toBeInTheDocument();
    expect(screen.getByText("Employers assessment revenue")).toBeInTheDocument();
    expect(screen.getByText("Employers learning revenue")).toBeInTheDocument();
    expect(screen.getByText("Employers hackathon revenue")).toBeInTheDocument();
    expect(screen.getByText("Employers networking revenue")).toBeInTheDocument();

    // Overview shows Hackathon & Networking & Incomplete Company Profiles telemetry
    expect(screen.getByText(/Hackathon participants/i)).toBeInTheDocument();
    expect(screen.getByText(/Networking registrants/i)).toBeInTheDocument();
    expect(screen.getByText(/Incomplete company profiles/i)).toBeInTheDocument();

    // Clicking an Employer revenue box drills directly into filtered Billing orders (15.01 Transactions)
    fireEvent.click(screen.getByText("Employers hackathon revenue"));
    expect(
      screen.getByText(/Code Arena Season 4 Title Hiring Partner & Challenge Track Sponsorship/i)
    ).toBeInTheDocument();
    expect(screen.queryByText(/Bengaluru CTO & Staff Builders Roundtable/i)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /^Overview$/i }));

    // Navigate to 04.01 All Candidates (Employee Super Admin)
    fireEvent.click(screen.getByRole("button", { name: /All Candidates/i }));
    expect(screen.getByRole("heading", { name: "All Candidates" })).toBeInTheDocument();

    // Cohort summary cards & filter options are present
    expect(screen.getAllByText(/Participated in hackathons/i).length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText(/Registered in networking events/i).length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText(/1-time vs retest takers/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Chosen multiple domains \(2\+\)/i).length).toBeGreaterThanOrEqual(1);

    // Filter by Retest Takers (2+)
    fireEvent.change(screen.getByLabelText("Filter by Test Attempts"), {
      target: { value: "retest" },
    });
    expect(screen.getByText("Yogesh")).toBeInTheDocument();

    // Filter by Last Active 7d
    fireEvent.click(screen.getByRole("button", { name: "7d" }));
    expect(screen.getByText("Yogesh")).toBeInTheDocument();

    // Archive Yogesh and verify he moves to Archived vault
    const archiveBtns = screen.getAllByTitle("Archive profile");
    fireEvent.click(archiveBtns[0]);
    fireEvent.click(screen.getByRole("button", { name: /Archived \(1\)/i }));
    expect(screen.getByText("Yogesh")).toBeInTheDocument();

    // Inspect Yogesh and check Raw JSON Payload
    fireEvent.click(screen.getByText("Yogesh"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/Tests, Retests, Domains, Courses & Events/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Raw JSON Payload/i }));
    expect(screen.getByText(/"talentCirId": "IAT-CIR-900124"/)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Close inspector"));

    // Navigate to 04.03 Resumes sub-view
    fireEvent.click(screen.getByRole("button", { name: /^Resumes$/i }));
    expect(screen.getByText("60s video pitches")).toBeInTheDocument();

    // Navigate to 03.01 All Employers & filter by Incomplete Company Profile
    fireEvent.click(screen.getByRole("button", { name: /All Employers/i }));
    expect(screen.getByText(/Incomplete company profiles/i)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Filter by Company Profile Completion"), {
      target: { value: "incomplete" },
    });
    expect(screen.getByText("BrightCart D2C Commerce")).toBeInTheDocument();
    expect(screen.queryByText("Super30 Technologies")).not.toBeInTheDocument();

    // Navigate to Module 02: 02.01 All Users & test Admin Impersonation
    fireEvent.click(screen.getByRole("button", { name: /All Users/i }));
    expect(screen.getByRole("heading", { name: "All Users" })).toBeInTheDocument();
    const impersonateBtns = screen.getAllByRole("button", { name: /Impersonate/i });
    fireEvent.click(impersonateBtns[0]);
    expect(screen.getByText(/Impersonation session active:/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Exit impersonation/i }));

    // Filter sidebar to Module 07: AI Intelligence Hub -> 07.01 AI Features
    fireEvent.change(screen.getByLabelText("Filter Super Admin modules"), {
      target: { value: "AI Intelligence" },
    });
    fireEvent.click(screen.getByRole("button", { name: /AI Features/i }));
    expect(screen.getByRole("heading", { name: "AI Features" })).toBeInTheDocument();
    expect(screen.getByText("AI Career Intelligence (CIR)")).toBeInTheDocument();
    expect(screen.getByText("AI Interview Copilot (Linda)")).toBeInTheDocument();

    // Navigate to Module 20: 20.06 Workflows & Fraud and verify inner tab switching
    fireEvent.change(screen.getByLabelText("Filter Super Admin modules"), {
      target: { value: "Workflows" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Workflows & Fraud/i }));
    expect(screen.getByText(/Employer KYB · SLA 4h/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("tab", { name: /Fraud Detection/i }));
    expect(screen.getByRole("tab", { name: /Fraud Detection/i })).toHaveAttribute("aria-selected", "true");
  });
});
