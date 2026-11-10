# Tenant Role & Permissions Matrix

This document defines the authoritative permission matrix for multi-tenant employer workspaces.
All employer RPCs and services enforce access through `public.has_tenant_permission(_tenant, _permission)`.

## Permissions Catalog

| Permission | Category | Description |
|---|---|---|
| `job.create` | Jobs | Create new job openings |
| `job.publish` | Jobs | Publish drafts or activate job openings |
| `job.edit` | Jobs | Modify job titles, descriptions, and salary ranges |
| `app.view` | ATS | View job applications and candidate profiles |
| `app.move` | ATS | Move applicant pipeline stages |
| `app.note` | ATS | Add internal evaluation notes on candidates |
| `interview.schedule` | Interviews | Schedule interviews with candidates |
| `interview.feedback` | Interviews | Submit interview assessment and ratings |
| `offer.send` | ATS | Issue job offers to applicants |
| `talent.search` | Talent Search | Search candidate profiles and talent pool |
| `talent.unlock` | Talent Search | Unlock full candidate contact details |
| `assessment.create` | Assessments | Create custom assessment tests |
| `assessment.invite` | Assessments | Send assessment invitations to candidates |
| `billing.view` | Billing | View invoices, payment history, and subscriptions |
| `billing.manage` | Billing | Manage payment methods, upgrades, and ownership transfers |
| `team.manage` | Organization | Invite, remove, and manage team member roles |
| `api.manage` | Developer | Manage API keys, webhooks, and integrations |
| `company.edit` | Organization | Edit company profile, branding, and verification details |

---

## Role Matrix

| Permission | Owner | Admin | Recruiter | Hiring Manager | Interviewer | Viewer |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| `job.create` | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| `job.publish` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `job.edit` | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| `app.view` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `app.move` | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| `app.note` | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| `interview.schedule` | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| `interview.feedback` | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| `offer.send` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `talent.search` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `talent.unlock` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `assessment.create` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `assessment.invite` | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| `billing.view` | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| `billing.manage` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `team.manage` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `api.manage` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `company.edit` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

---

## Notes & Security Rules
- **Ownership Transfer & Last Owner Protection**: Only the `owner` can transfer ownership. The last `owner` cannot be removed or demoted.
- **MFA (AAL2) Requirement**: Promoting or inviting members with the `admin` role, transferring ownership, or calling platform admin RPCs requires AAL2 MFA verification.
- **Role Exclusivity**: A user cannot accept an employer team invitation if their account has an active candidate (`employee`) role.
