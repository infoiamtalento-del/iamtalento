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
  it("renders Executive Overview KPIs, switches modules, and opens the ultra-detailed Inspector with Raw JSON", async () => {
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

    expect(screen.getByText("Total Candidates")).toBeInTheDocument();
    expect(screen.getAllByText("Employers & Tenants").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("Captured Revenue (GMV)")).toBeInTheDocument();

    // Navigate to Candidates Directory
    fireEvent.click(screen.getByRole("button", { name: /Candidates Directory/i }));
    expect(screen.getByText("Candidates Directory (360° Profiles)")).toBeInTheDocument();
    expect(screen.getByText("IAT-CIR-900124 · /u/yogesh")).toBeInTheDocument();

    // Click row to open Deep-Dive Inspector
    fireEvent.click(screen.getByText("IAT-CIR-900124 · /u/yogesh"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Identity, Contact & Verification")).toBeInTheDocument();

    // Switch to Raw JSON Payload tab
    fireEvent.click(screen.getByRole("button", { name: /Raw JSON Payload/i }));
    expect(screen.getByText(/"talentCirId": "IAT-CIR-900124"/)).toBeInTheDocument();
  });
});
