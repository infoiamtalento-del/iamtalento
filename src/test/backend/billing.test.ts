// @vitest-environment node
import { beforeAll, describe, expect, it } from "vitest";
import { createDb, uuid, type Db } from "./harness";

const A = uuid(21), B = uuid(22), C = uuid(23);
let db: Db;
let domain: string;
let course: string;

beforeAll(async () => {
  db = await createDb();
  await db.signUp(A, "a@test.dev", { full_name: "Asha" });
  await db.signUp(B, "b@test.dev", { full_name: "Bala" });
  await db.signUp(C, "c@test.dev", { full_name: "Chitra" });
  await db.admin();
  domain = (await db.q(`select id from public.assessments_catalog where slug = 'data-analytics-sql-python'`))[0].id;
  course = (await db.q(`select id from public.lms_courses where slug = 'data-analytics-masterclass'`))[0].id;
}, 120_000);

const topUp = async (user: string, amount: number, key: string) => {
  await db.user(user);
  const [o] = await db.q(`select * from public.create_payment_order('wallet_topup', null, null, null, null, $1, 'razorpay', $2)`, [key, amount]);
  await db.admin();
  await db.q(`select public.fulfill_payment_order($1, $2)`, [o.id, "pay_" + o.id]);
  return o;
};
const balance = async (user: string) => {
  await db.admin();
  return Number((await db.q(`select balance from public.wallet_accounts where user_id = $1`, [user]))[0]?.balance ?? 0);
};

describe("orders, GST and wallet ledger", () => {
  it("prices on the server and splits GST by state", async () => {
    await db.user(A);
    const [intra] = await db.q(`select * from public.create_payment_order('course', $1, null, 'Karnataka', null, 'gst-1', 'razorpay')`, [course]);
    expect(Number(intra.total_amount)).toBeCloseTo(942.82, 2);
    expect(Number(intra.cgst)).toBeCloseTo(71.91, 2);
    expect(Number(intra.sgst)).toBeCloseTo(71.91, 2);
    expect(Number(intra.igst)).toBe(0);
    const [inter] = await db.q(`select * from public.create_payment_order('course', $1, null, 'Tamil Nadu', null, 'gst-2', 'razorpay')`, [course]);
    expect(Number(inter.igst)).toBeCloseTo(143.82, 2);
    expect(await db.fails(`select * from public.create_payment_order('course', $1, null, null, '27BADGSTIN', 'gst-3')`, [course])).toMatch(/Invalid GSTIN/);
    expect(await db.fails(`select * from public.create_payment_order('mystery', $1)`, [course])).toMatch(/Unsupported item type/);
    expect(await db.fails(`select * from public.create_payment_order('wallet_topup', null, null, null, null, 'x', 'razorpay', 5)`)).toMatch(/between 10 and 100000/);
  });

  it("keeps idempotency keys private to each user", async () => {
    await db.user(A);
    const [o1] = await db.q(`select * from public.create_payment_order('wallet_topup', null, null, null, null, 'same-key', 'razorpay', 100)`);
    const [o2] = await db.q(`select * from public.create_payment_order('wallet_topup', null, null, null, null, 'same-key', 'razorpay', 100)`);
    expect(o2.id).toBe(o1.id);
    await db.user(B);
    const [o3] = await db.q(`select * from public.create_payment_order('wallet_topup', null, null, null, null, 'same-key', 'razorpay', 100)`);
    expect(o3.id).not.toBe(o1.id);
  });

  it("credits a top-up exactly once and keeps a balanced double-entry ledger", async () => {
    await topUp(A, 2000, "tu-1");
    expect(await balance(A)).toBe(2000 + 0);
    const [o] = (await db.q(`select id from public.payment_orders where user_id = $1 and idempotency_key like '%tu-1'`, [A]));
    await db.q(`select public.fulfill_payment_order($1, 'again')`, [o.id]);
    expect(await balance(A)).toBe(2000);
    const [{ s }] = await db.q(`select sum(case entry_type when 'credit' then amount else -amount end) s from public.wallet_ledger_entries`);
    expect(Number(s)).toBe(0);
  });

  it("stops clients crediting wallets or calling money functions", async () => {
    await db.user(A);
    await db.q(`update public.wallet_accounts set balance = 999999 where user_id = $1`, [A]);
    expect(await balance(A)).toBe(2000);
    await db.user(A);
    expect(await db.fails(`insert into public.wallet_ledger_entries (wallet_id, tx_group, entry_type, amount, balance_after, reason) select id, gen_random_uuid(), 'credit', 1, 1, 'x' from public.wallet_accounts limit 1`)).toBeTruthy();
    for (const fn of [`wallet_transfer(gen_random_uuid(), gen_random_uuid(), 1, 'x')`, `fulfill_payment_order(gen_random_uuid(), 'x')`, `_fulfill_order(gen_random_uuid(), 'x')`, `push_notification(gen_random_uuid(), 'a', 'b')`]) {
      expect(await db.fails(`select public.${fn}`), fn).toMatch(/permission denied/);
    }
  });

  it("pays from the wallet, refuses overdrafts and spends on services", async () => {
    await db.user(A);
    const [o] = await db.q(`select * from public.create_payment_order('course', $1, null, 'Karnataka', null, 'pay-1', 'wallet')`, [course]);
    const [paid] = await db.q(`select * from public.pay_order_with_wallet($1)`, [o.id]);
    expect(paid.status).toBe("entitled");
    expect(paid.invoice_number).toMatch(/^IAT\/\d{4}\/\d{6}$/);
    expect(await balance(A)).toBeCloseTo(2000 - 942.82, 2);
    await db.user(B);
    const [ob] = await db.q(`select * from public.create_payment_order('course', $1, null, null, null, 'pay-b', 'wallet')`, [course]);
    expect(await db.fails(`select * from public.pay_order_with_wallet($1)`, [ob.id])).toMatch(/Insufficient wallet balance/);
    await db.user(A);
    expect(await db.fails(`select * from public.pay_order_with_wallet($1)`, [ob.id])).toMatch(/Order not found/);
    await db.q(`select * from public.purchase_service('profile_boost')`);
    expect(await balance(A)).toBeCloseTo(2000 - 942.82 - 99, 2);
  });
});

describe("coupons", () => {
  it("cannot be reused through parallel orders, and is released on cancel", async () => {
    await db.user(C);
    const [o1] = await db.q(`select * from public.create_payment_order('course', $1, 'WELCOME100', null, null, 'cp-1', 'razorpay')`, [course]);
    expect(Number(o1.discount_amount)).toBe(100);
    expect(await db.fails(`select * from public.create_payment_order('course', $1, 'WELCOME100', null, null, 'cp-2', 'razorpay')`, [course])).toMatch(/already used/);
    await db.q(`select public.cancel_payment_order($1)`, [o1.id]);
    const [o3] = await db.q(`select * from public.create_payment_order('course', $1, 'WELCOME100', null, null, 'cp-3', 'razorpay')`, [course]);
    expect(Number(o3.discount_amount)).toBe(100);
  });

  it("validates coupons for the caller and rejects bad ones without leaking details", async () => {
    await db.user(B);
    const ok = (await db.q(`select * from public.validate_coupon('skill20', 'assessment_journey', 799)`))[0];
    expect(ok.valid).toBe(true);
    expect(Number(ok.discount)).toBeCloseTo(159.8, 2);
    expect((await db.q(`select * from public.validate_coupon('SKILL20', 'course', 799)`))[0].valid).toBe(false);
    expect((await db.q(`select * from public.validate_coupon('NOPE', 'course', 799)`))[0].message).toBe("Invalid coupon code");
  });

  it("applies a 100% discount as a free, immediately entitled order", async () => {
    await db.admin();
    await db.q(`insert into public.coupons (code, discount_type, value, max_discount, applies_to) values ('FREEBIE', 'percent', 100, 100000, '{course}')`);
    await db.user(B);
    const [o] = await db.q(`select * from public.create_payment_order('course', $1, 'FREEBIE', null, null, 'free-1', 'razorpay')`, [course]);
    expect(o).toMatchObject({ status: "entitled", gateway: "free" });
    expect(Number(o.total_amount)).toBe(0);
  });
});

describe("referrals", () => {
  it("pays out only after the referee's first real purchase, once", async () => {
    await db.admin();
    const code = (await db.q(`select referral_code from public.profiles where id = $1`, [A]))[0].referral_code;
    await db.user(C);
    expect(await db.fails(`select public.claim_referral('${code.slice(0, 3)}ZZZZZZZ')`)).toMatch(/Invalid referral code/);
    await db.q(`select public.claim_referral($1)`, [code]);
    expect(await db.fails(`select public.claim_referral($1)`, [code])).toMatch(/already claimed/);
    await topUp(C, 3000, "c-topup");
    const afterTopUp = await balance(C);
    expect(afterTopUp).toBe(3000);
    await db.user(C);
    const [o] = await db.q(`select * from public.create_payment_order('course', $1, null, 'Karnataka', null, 'c-buy', 'wallet')`, [course]);
    await db.q(`select * from public.pay_order_with_wallet($1)`, [o.id]);
    expect(await balance(C)).toBeCloseTo(3000 - 942.82 + 100, 2);
    const referrerBefore = await balance(A);
    await db.user(C);
    const [o2] = await db.q(`select * from public.create_payment_order('assessment_journey', $1, null, 'Karnataka', null, 'c-buy-2', 'wallet')`, [domain]);
    await db.user(C);
    await db.q(`select * from public.pay_order_with_wallet($1)`, [o2.id]);
    expect(await balance(A)).toBe(referrerBefore);
    expect((await db.q(`select count(*)::int n from public.referral_rewards`))[0].n).toBe(1);
  });

  it("does not let a user refer themselves", async () => {
    await db.admin();
    const code = (await db.q(`select referral_code from public.profiles where id = $1`, [B]))[0].referral_code;
    await db.user(B);
    expect(await db.fails(`select public.claim_referral($1)`, [code])).toMatch(/Invalid referral code/);
  });
});

describe("learning", () => {
  it("enrols in a free course, tracks progress and issues a verified certificate", async () => {
    await db.admin();
    const free = (await db.q(`select id from public.lms_courses where slug = 'ai-engineer-agentic-track'`))[0].id;
    await db.user(B);
    const [e] = await db.q(`select * from public.enroll_in_course($1)`, [free]);
    expect(e.status).toBe("active");
    const mods = await db.q(`select id from public.lms_modules where course_id = $1 order by position`, [free]);
    for (const m of mods.slice(0, 2)) await db.q(`select * from public.complete_module($1, $2)`, [free, m.id]);
    expect(Number((await db.q(`select progress_pct from public.course_enrollments where user_id = $1 and course_id = $2`, [B, free]))[0].progress_pct)).toBe(40);
    for (const m of mods) await db.q(`select * from public.complete_module($1, $2)`, [free, m.id]);
    const [done] = await db.q(`select status, progress_pct from public.course_enrollments where course_id = $1`, [free]);
    expect(done.status).toBe("completed");
    const certs = await db.q(`select verification_status from public.certifications where name like 'AI Engineer%'`);
    expect(certs[0].verification_status).toBe("verified");
  });

  it("requires payment for paid courses and protects paid modules", async () => {
    await db.user(B);
    expect(await db.fails(`select * from public.enroll_in_course($1)`, [course])).toMatch(/Payment required/);
    const hidden = await db.q(`select count(*)::int n from public.lms_modules where course_id = $1 and not is_preview`, [course]);
    expect(hidden[0].n).toBe(0);
    await db.anon();
    expect((await db.q(`select count(*)::int n from public.lms_modules where course_id = $1`, [course]))[0].n).toBe(1); // preview only
  });

  it("books each mentor slot once and needs payment for paid slots", async () => {
    await db.admin();
    await db.q(`insert into public.mentor_slots (mentor_id, starts_at, ends_at, price_inr)
      select id, now() + interval '3 days', now() + interval '3 days 45 minutes', 0 from public.mentor_profiles limit 1`);
    const slot = (await db.q(`select id from public.mentor_slots where price_inr = 0 and status = 'open' limit 1`))[0].id;
    await db.user(B);
    const [bk] = await db.q(`select * from public.book_mentor_slot($1, 'career help')`, [slot]);
    expect(bk.status).toBe("confirmed");
    await db.user(C);
    expect(await db.fails(`select * from public.book_mentor_slot($1)`, [slot])).toMatch(/no longer available/);
    const paid = (await db.q(`select id from public.mentor_slots where price_inr > 0 and status = 'open' limit 1`))[0].id;
    expect(await db.fails(`select * from public.book_mentor_slot($1)`, [paid])).toMatch(/Payment required/);
  });

  it("registers for hackathons and events idempotently", async () => {
    await db.admin();
    // Seed deadlines are fixed calendar dates; keep the test independent of today's date.
    await db.q(`update public.hackathons set registration_deadline = now() + interval '30 days' where slug = 'national-ai-innovation-hackathon'`);
    await db.user(B);
    const hk = (await db.q(`select id from public.hackathons where slug = 'national-ai-innovation-hackathon'`))[0].id;
    const [r1] = await db.q(`select * from public.register_for_hackathon($1, 'Team Zero')`, [hk]);
    const [r2] = await db.q(`select * from public.register_for_hackathon($1, 'Team Zero')`, [hk]);
    expect(r2.id).toBe(r1.id);
    const team = (await db.q(`select invite_code from public.hackathon_teams where leader_id = $1`, [B]))[0].invite_code;
    await db.user(C);
    expect((await db.q(`select * from public.join_hackathon_team($1)`, [team]))[0].team_id).toBe(r1.team_id);
    expect(await db.fails(`select * from public.join_hackathon_team('NOTACODE')`)).toMatch(/Invalid team invite code/);
    await db.q(`select * from public.submit_hackathon_project($1, 'My build', 'desc', 'https://github.com/x/y', null)`, [hk]);
    await db.q(`select * from public.register_for_event('networking', 'bengaluru-meetup', 'Bengaluru')`);
    await db.q(`select * from public.register_for_event('networking', 'bengaluru-meetup', 'Bengaluru')`);
    expect((await db.q(`select count(*)::int n from public.event_registrations`))[0].n).toBe(1);
  });
});
