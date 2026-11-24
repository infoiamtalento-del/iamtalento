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

    // Clicking an Employer revenue box drills directly into filtered Billing orders
    fireEvent.click(screen.getByText("Employers hackathon revenue"));
    expect(
      screen.getByText(/Code Arena Season 4 Title Hiring Partner & Challenge Track Sponsorship/i)
    ).toBeInTheDocument();
    expect(screen.queryByText(/Bengaluru CTO & Staff Builders Roundtable/i)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Executive Overview/i }));

    // Navigate to Candidates Directory (Employee Super Admin)
    fireEvent.click(screen.getByRole("button", { name: /Candidates Directory/i }));
    expect(screen.getByText("Candidates Directory (360° Profiles)")).toBeInTheDocument();

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

    // Navigate to Employers & filter by Incomplete Company Profile
    fireEvent.click(screen.getByRole("button", { name: /Employers & Tenants/i }));
    expect(screen.getByText(/Incomplete company profiles/i)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Filter by Company Profile Completion"), {
      target: { value: "incomplete" },
    });
    expect(screen.getByText("BrightCart D2C Commerce")).toBeInTheDocument();
    expect(screen.queryByText("Super30 Technologies")).not.toBeInTheDocument();

    // Navigate to Module 02: User Management, test RBAC tab & Admin Impersonation
    fireEvent.click(screen.getByRole("button", { name: /All Users & Accounts/i }));
    expect(screen.getByText("Centralized User Management")).toBeInTheDocument();
    const impersonateBtns = screen.getAllByRole("button", { name: /Impersonate/i });
    fireEvent.click(impersonateBtns[0]);
    expect(screen.getByText(/Impersonation session active:/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Exit impersonation/i }));

    // Filter sidebar to Module 07: AI Intelligence Hub and verify 11 AI engines render
    fireEvent.change(screen.getByLabelText("Filter Super Admin modules"), {
      target: { value: "AI Intelligence" },
    });
    fireEvent.click(screen.getByRole("button", { name: /AI Features, Usage & Logs/i }));
    expect(screen.getByText("AI Intelligence Hub (11 Engines)")).toBeInTheDocument();
    expect(screen.getByText("AI Career Intelligence (CIR)")).toBeInTheDocument();
    expect(screen.getByText("AI Interview Copilot (Linda)")).toBeInTheDocument();

    // Navigate to Module 20: Workflows, Fraud & Security
    fireEvent.change(screen.getByLabelText("Filter Super Admin modules"), {
      target: { value: "Workflows" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Workflows, Fraud & Security/i }));
    expect(screen.getByText(/Employer KYB · SLA 4h/i)).toBeInTheDocument();
  });
});
