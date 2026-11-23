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

    // Overview shows Hackathon & Networking & Incomplete Company Profiles telemetry
    expect(screen.getByText(/Hackathon participants/i)).toBeInTheDocument();
    expect(screen.getByText(/Networking registrants/i)).toBeInTheDocument();
    expect(screen.getByText(/Incomplete company profiles/i)).toBeInTheDocument();

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
  });
});
