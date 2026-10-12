import { describe, expect, it } from "vitest";
import { JOBS_PER_PAGE, paginateJobs } from "./jobPagination";

describe("Find Jobs page size", () => {
  it("shows 20 jobs for ten rows of two columns", () => {
    expect(JOBS_PER_PAGE).toBe(20);
    expect(paginateJobs(Array.from({ length: 45 }, (_, i) => i), 1)).toEqual(Array.from({ length: 20 }, (_, i) => i));
  });
  it("shows the next twenty jobs without repeating the first page", () => {
    expect(paginateJobs(Array.from({ length: 45 }, (_, i) => i), 2)).toEqual(Array.from({ length: 20 }, (_, i) => i + 20));
  });
});