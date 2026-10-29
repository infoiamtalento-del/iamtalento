import { describe, expect, it } from "vitest";
import {
  clearDemoOnlySession,
  formatAuthError,
  isDemoOnlySession,
  isSafeInternalPath,
  normalizeEmail,
  openDemoWorkspace,
} from "@/services/authSession";

describe("authSession helpers", () => {
  it("normalizes email casing and whitespace", () => {
    expect(normalizeEmail("  Yogesh.C@Example.COM ")).toBe("yogesh.c@example.com");
  });

  it("allows only safe internal relative redirect paths", () => {
    expect(isSafeInternalPath("/assessments/explore")).toBe(true);
    expect(isSafeInternalPath("/talento-pro?view=dash")).toBe(true);
    expect(isSafeInternalPath("https://evil.example.com")).toBe(false);
    expect(isSafeInternalPath("//evil.example.com")).toBe(false);
    expect(isSafeInternalPath("/auth")).toBe(false);
    expect(isSafeInternalPath(null)).toBe(false);
  });

  it("formats GoTrue rate-limit, expired link, and credential errors clearly", () => {
    expect(formatAuthError({ message: "email rate limit exceeded" })).toMatch(/wait a few minutes/i);
    expect(formatAuthError({ message: "Invalid login credentials" })).toMatch(/Incorrect email or password/i);
    expect(formatAuthError("Email link is invalid or has expired")).toMatch(/expired or was already used/i);
  });

  it("isolates demo workspace flag from real authentication", () => {
    clearDemoOnlySession();
    expect(isDemoOnlySession()).toBe(false);
    const dest = openDemoWorkspace("employer");
    expect(dest).toBe("/talento-pro?view=dash&role=employer");
    expect(isDemoOnlySession()).toBe(true);
    expect(JSON.parse(localStorage.getItem("tq_sess") || '""')).toBe("demo.employer@talento.app");
    clearDemoOnlySession();
    expect(isDemoOnlySession()).toBe(false);
  });
});
