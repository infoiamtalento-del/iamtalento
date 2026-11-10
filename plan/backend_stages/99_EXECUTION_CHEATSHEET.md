# Execution cheat-sheet

## Stage prompt template (copy per stage)
```
Read @docs/backend/00_AUDIT_AND_MASTER_CONTEXT.md and @docs/backend/<STAGE FILE>.
Execute that stage only. Work in Planning mode: post the plan first (migrations, functions, services, tests, files), wait for my approval, then implement.
Follow the Working Protocol. Run the gate. Print the Stage Report. Stop.
```

## One massive prompt (autonomous)
```
Read @docs/backend/00_AUDIT_AND_MASTER_CONTEXT.md. Then execute stage files 01 through 13 in order.
For each stage: plan, implement, run the gate, commit on branch backend/stage-N, print the Stage Report.
Continue automatically only when the gate is green and the Stage Report has no "Not done" items. Otherwise stop and ask me.
Do not run `supabase db push`, `supabase secrets set`, or `git push`; give me the exact commands instead.
Skip A1 and L1 until I say so.
```

## Resume prompt after an interruption
```
Check `git log` and `git status` on the current branch. Re-read the active stage file. List what is done vs missing by inspecting migrations, services and tests (not by memory). Continue from the first incomplete item and keep the same Stage Report format.
```

## Review prompt (run after every stage, ideally in a fresh agent session)
```
Act as an adversarial reviewer. For the diff of the last stage: list every new table/function/policy, try to break tenant isolation, role checks, money flows, idempotency and rate limits, and write failing tests for any gap you find. Report only real findings with file and line.
```

## Order and effort (realistic)
| Stage | What | Rough effort with an agent |
|---|---|---|
| 0 | Baseline, CI, lock-down | 0.5 day |
| 1 | Auth | 2–3 days |
| 2 | Orgs/roles/admin | 2 days |
| 3 | Employer profile/dashboard | 1 day |
| 4 | Jobs lifecycle | 2 days |
| 5 | ATS/interviews/offers | 4–5 days |
| 6 | Talent search/messaging | 3–4 days |
| 7 | Billing/plans/ads | 4–5 days |
| 8 | Outbox/email/support | 2–3 days |
| 9 | Frontend wiring | 3–4 days |
| 10 | Candidate completion | 3 days |
| 11 | Hardening/ops | 3 days |
| 12 | E2E/release | 2 days |
| A1 | Assessment | 6–8 days |
| L1 | Learning/events | 6–8 days |
Review time between stages is not included.
