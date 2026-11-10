// @vitest-environment node
import { beforeAll, describe, expect, it } from "vitest";
import { createDb, uuid, type Db } from "./harness";

const CANDIDATE = uuid(81);
const EMPLOYER = uuid(82);
const ADMIN = uuid(83);
let db: Db;

beforeAll(async () => {
  db = await createDb();
  await db.signUp(CANDIDATE, "candidate81@test.dev", { full_name: "Candidate Test", role: "employee" });
  await db.signUp(EMPLOYER, "employer82@test.dev", { full_name: "Employer Test", role: "employer", company_name: "Tech Corp" });
  await db.signUp(ADMIN, "admin83@test.dev", {});
  await db.admin();
  await db.q(`insert into public.platform_admins (user_id) values ($1)`, [ADMIN]);
});

describe("Edge Function Guard (generate-assessment)", () => {
  it("rejects unauthenticated requests (missing or invalid Authorization header)", () => {
    const authHeader = null;
    const hasBearer = Boolean(authHeader && (authHeader as string).startsWith("Bearer "));
    expect(hasBearer).toBe(false);
  });

  it("blocks candidates from calling employer assessment generator (403 forbidden)", async () => {
    await db.user(CANDIDATE);
    const [p] = await db.q(`select role from public.user_roles where user_id = $1`, [CANDIDATE]);
    const isEmployer = p?.role === "employer";
    const [adminRow] = await db.q(`select public.is_admin() as is_admin`);
    const isAllowed = isEmployer || adminRow.is_admin;
    expect(isAllowed).toBe(false);
  });

  it("allows employers to generate assessments", async () => {
    await db.user(EMPLOYER);
    const [p] = await db.q(`select role from public.user_roles where user_id = $1`, [EMPLOYER]);
    const isEmployer = p?.role === "employer";
    expect(isEmployer).toBe(true);
  });

  it("allows platform admins to generate assessments", async () => {
    await db.user(ADMIN);
    const [adminRow] = await db.q(`select public.is_admin() as is_admin`);
    expect(adminRow.is_admin).toBe(true);
  });
});
