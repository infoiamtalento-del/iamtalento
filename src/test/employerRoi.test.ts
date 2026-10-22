import { describe, expect, it } from "vitest";
import { calculateRoi, ROI_DEFAULTS } from "@/lib/employerRoi";

describe("employer ROI calculator", () => {
  it("defaults are 40 roles, 300 applicants, 4 minutes, ₹600/hour", () => {
    expect(ROI_DEFAULTS).toEqual({ roles: 40, applicants: 300, minutes: 4, rate: 600 });
  });
  it("saves 80% of manual screening time", () => {
    expect(calculateRoi(ROI_DEFAULTS).hoursSaved).toBe(640);
  });
  it("prices saved hours at the recruiter rate", () => {
    expect(calculateRoi(ROI_DEFAULTS).costSaved).toBe(384000);
  });
  it("avoids 60% of first-round interviews", () => {
    expect(calculateRoi(ROI_DEFAULTS).interviewsAvoided).toBe(288);
  });
});
