// @vitest-environment node
import { beforeAll, describe, expect, it } from "vitest";
import { createDb, type Db } from "./harness";

let db: Db;

beforeAll(async () => {
  db = await createDb();
}, 120_000);

describe("rate-limit-proof auth & account provisioning", () => {
  it("registers a verified candidate account directly as anon and creates profile + role + identity", async () => {
    await db.anon();
    const [res] = await db.q<{ register_user_account: { user_id: string; email: string; role: string; status: string } }>(
      `select public.register_user_account($1, $2, $3, $4, $5, $6, null)`,
      ["Priya.Sharma@Test.dev ", "StrongPass#123", "Priya Sharma", "+91 9876543210", "employee", "fresher"]
    );
    const out = res.register_user_account;
    expect(out.status).toBe("created");
    expect(out.email).toBe("priya.sharma@test.dev");
    expect(out.role).toBe("employee");

    await db.admin();
    const [u] = await db.q(
      `select email, email_confirmed_at, confirmation_token, recovery_token, encrypted_password is not null as has_pw from auth.users where id = $1`,
      [out.user_id]
    );
    expect(u.email).toBe("priya.sharma@test.dev");
    expect(u.email_confirmed_at).toBeTruthy();
    expect(u.confirmation_token).toBe("");
    expect(u.recovery_token).toBe("");
    expect(u.has_pw).toBe(true);

    const [ident] = await db.q(`select provider, provider_id from auth.identities where user_id = $1`, [out.user_id]);
    expect(ident).toMatchObject({ provider: "email", provider_id: out.user_id });

    const [prof] = await db.q(`select full_name, phone, experience_level from public.profiles where id = $1`, [out.user_id]);
    expect(prof).toMatchObject({ full_name: "Priya Sharma", phone: "+91 9876543210", experience_level: "fresher" });

    const [roleRow] = await db.q(`select role from public.user_roles where user_id = $1`, [out.user_id]);
    expect(roleRow.role).toBe("employee");
  });

  it("registers an employer account with company stub and never allows admin escalation", async () => {
    await db.anon();
    const [empRes] = await db.q<{ register_user_account: { user_id: string; role: string } }>(
      `select public.register_user_account($1, $2, $3, $4, $5, null, $6)`,
      ["hr@orbitlabs.io", "OrbitPass#99", "Rohan Verma", "+91 9988776655", "employer", "Orbit Labs"]
    );
    expect(empRes.register_user_account.role).toBe("employer");

    const [escRes] = await db.q<{ register_user_account: { user_id: string; role: string } }>(
      `select public.register_user_account($1, $2, $3, null, $4, $5, null)`,
      ["attacker@orbitlabs.io", "OrbitPass#99", "Attacker", "admin", "experienced"]
    );
    expect(escRes.register_user_account.role).toBe("employee");

    await db.admin();
    const [emp] = await db.q(`select company_name, official_email from public.employers where user_id = $1`, [
      empRes.register_user_account.user_id,
    ]);
    expect(emp).toMatchObject({ company_name: "Orbit Labs", official_email: "hr@orbitlabs.io" });

    const [escRole] = await db.q(`select role from public.user_roles where user_id = $1`, [
      escRes.register_user_account.user_id,
    ]);
    expect(escRole.role).toBe("employee");
  });

  it("recovers idempotently when same email+password re-submits, and rejects duplicate email with wrong password", async () => {
    await db.anon();
    const [again] = await db.q<{ register_user_account: { status: string } }>(
      `select public.register_user_account($1, $2, $3, null, 'employee', 'fresher', null)`,
      ["priya.sharma@test.dev", "StrongPass#123", "Priya Sharma"]
    );
    expect(again.register_user_account.status).toBe("confirmed_existing");

    const dupErr = await db.fails(
      `select public.register_user_account($1, $2, $3, null, 'employee', 'fresher', null)`,
      ["priya.sharma@test.dev", "DifferentPassword123", "Impersonator"]
    );
    expect(dupErr).toMatch(/already exists/i);
  });

  it("confirms previously unverified accounts only when correct password is supplied", async () => {
    await db.admin();
    // Simulate a legacy unconfirmed user row
    const [{ id: legacyId }] = await db.q<{ id: string }>(
      `insert into auth.users (email, encrypted_password, raw_user_meta_data)
       values ('legacy@test.dev', extensions.crypt('LegacySecret#1', extensions.gen_salt('bf')), '{"full_name":"Legacy User"}'::jsonb)
       returning id`
    );
    await db.q(`update auth.users set email_confirmed_at = null where id = $1`, [legacyId]);

    await db.anon();
    const [wrongPw] = await db.q<{ confirm_unverified_account: boolean }>(
      `select public.confirm_unverified_account('legacy@test.dev', 'WrongPass')`
    );
    expect(wrongPw.confirm_unverified_account).toBe(false);

    const [rightPw] = await db.q<{ confirm_unverified_account: boolean }>(
      `select public.confirm_unverified_account('legacy@test.dev', 'LegacySecret#1')`
    );
    expect(rightPw.confirm_unverified_account).toBe(true);

    await db.admin();
    const [after] = await db.q(`select email_confirmed_at from auth.users where id = $1`, [legacyId]);
    expect(after.email_confirmed_at).toBeTruthy();
  });

  it("enforces per-email signup rate limiting", async () => {
    await db.anon();
    for (let i = 0; i < 6; i++) {
      await db.q(
        `select public.register_user_account($1, $2, $3, null, 'employee', 'fresher', null)`,
        ["ratelimit-target@test.dev", "RatePass#123", "Rate User"]
      );
    }
    const err = await db.fails(
      `select public.register_user_account($1, $2, $3, null, 'employee', 'fresher', null)`,
      ["ratelimit-target@test.dev", "RatePass#123", "Rate User"]
    );
    expect(err).toMatch(/Too many requests/i);
  });
});
