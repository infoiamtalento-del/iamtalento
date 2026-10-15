import { describe, expect, it } from "vitest";
import { createDemoApplication, DEMO_EMPLOYER_APPS, DEMO_EMPLOYER_JOBS, INITIAL_EMPLOYER_DEMO } from "@/data/employerDemo";

describe("connected employer demo records", () => {
  it("gives every sample application an existing employer job", () => {
    expect(DEMO_EMPLOYER_JOBS).toHaveLength(3);
    expect(DEMO_EMPLOYER_APPS).toHaveLength(8);
    for (const app of DEMO_EMPLOYER_APPS) {
      expect(DEMO_EMPLOYER_JOBS.some(job => job.id === app.jid)).toBe(true);
      expect(app.name.length).toBeGreaterThan(0);
    }
  });
  it("covers every hiring stage and future scheduled interviews", () => {
    expect(new Set(DEMO_EMPLOYER_APPS.map(app => app.st)).size).toBe(5);
    for (const app of DEMO_EMPLOYER_APPS.filter(app => app.st === "Interview")) {
      expect(new Date(app.iv || "").getTime()).toBeGreaterThan(Date.now());
    }
  });
  it("creates a new pending arrival with the requested job and identifier", () => {
    const app = createDemoApplication(0, 42, 123);
    expect(app).toMatchObject({ id: 123, jid: 42, st: "Applied", name: "Aarav Mehta", upd: [] });
  });
  it("starts each service with sample records rather than inactive placeholders", () => {
    expect(INITIAL_EMPLOYER_DEMO.assessments.length).toBeGreaterThan(0);
    expect(INITIAL_EMPLOYER_DEMO.aiInterviews.length).toBeGreaterThan(0);
    expect(INITIAL_EMPLOYER_DEMO.campaigns.length).toBeGreaterThan(0);
    expect(INITIAL_EMPLOYER_DEMO.plan).toBe("Starter");
  });
});