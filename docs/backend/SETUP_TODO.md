# Backend Setup & Secrets Checklist (`SETUP_TODO.md`)

This file tracks external secrets, configurations, and manual dashboard actions required from the project owner. Do not commit actual secrets into the repository.

---

## 1. Secrets & Environment Variables

| Name | Used by | Required / Optional | Description & Setup Notes |
|---|---|---|---|
| `VITE_SUPABASE_URL` | Frontend | **Required** | Public Supabase project URL (e.g. `https://uoxokxgbpylfsanffsxm.supabase.co`). |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Frontend | **Required** | Public Supabase anon key. |
| `VITE_SUPABASE_PROJECT_ID` | Tooling / Supabase CLI | **Required** | Supabase Project Ref (`uoxokxgbpylfsanffsxm`). |
| `VITE_SITE_URL` | Auth redirects | **Required** | Base site URL for email confirmation & password resets (e.g. `https://talento.app` or `http://localhost:8080`). |
| `SUPABASE_ACCESS_TOKEN` | CI / CLI | Optional | Personal access token from Supabase account settings for automated type generation and remote migrations. |
| `SUPABASE_SERVICE_ROLE_KEY` | Edge Functions | **Required** | Service role key injected automatically by Supabase runtime for server functions. |
| `VITE_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET` | Auth Captcha | Optional | Cloudflare Turnstile keys to prevent bot registrations. |
| `SMTP_*` or `RESEND_API_KEY` | Auth emails | **Required in Prod** | Custom SMTP / Resend API key to avoid Supabase default 30 emails/hour rate limits. |
| `RAZORPAY_KEY_ID` | Payments Edge Function | **Required for billing** | Razorpay Key ID (test/live) from Razorpay Dashboard. |
| `RAZORPAY_KEY_SECRET` | Payments Edge Function | **Required for billing** | Razorpay Key Secret. |
| `RAZORPAY_WEBHOOK_SECRET` | Payments Edge Function | **Required for billing** | Webhook signing secret configured on Razorpay Dashboard pointing to `/functions/v1/payments?action=webhook`. |
| `CREDENTIAL_SIGNING_KEY` | Sign-Credential Function | **Required for CIR** | Base64-encoded PKCS8 Ed25519 private key. Generate via: `openssl genpkey -algorithm ed25519 -outform DER \| base64`. |
| `CREDENTIAL_KEY_ID` | Sign-Credential Function | Optional | Key identifier tag (e.g. `v1`). |
| `AI_PROVIDER` | AI Edge Functions | Optional | Provider selector: `gemini` (default), `openai`, or `anthropic`. |
| `AI_API_KEY` | AI Edge Functions | **Required for AI** | API key for Gemini / OpenAI / Anthropic. Replaces Lovable gateway. |
| `AI_MODEL` | AI Edge Functions | Optional | Target model (e.g. `gemini-1.5-flash`, `gpt-4o-mini`). |
| `EMBEDDING_MODEL` | AI Edge Functions | Optional | 1536-dimensional embedding model (e.g. `text-embedding-004`, `text-embedding-3-small`). |
| `ALLOWED_ORIGINS` | Edge Functions | Recommended | Comma-separated CORS allowed origins (e.g. `https://talento.app,https://admin.talento.app`). |
| `LIVEKIT_URL` / `API_KEY` / `API_SECRET` | AI Interviewer / Video | Optional | LiveKit credentials for live audio/video sessions. |
| `JUDGE0_URL` / `JUDGE0_KEY` or `PISTON_URL` | Coding Grader | Optional (Stage A1) | Execution sandbox for real-time coding question tests. |
| `SENTRY_DSN` | Frontend & Functions | Optional | Error and crash monitoring. |

---

## 2. Supabase Dashboard Actions for Owner
- [ ] **Database Extensions**: Confirm `pgcrypto`, `pg_trgm`, `vector` (pgvector), and `pg_cron` are toggled ON in Supabase Database Extensions.
- [ ] **Auth Settings**:
  - Configure Site URL (`VITE_SITE_URL`) and redirect URLs (`/auth/callback`, `/reset-password`).
  - Disable "Allow new users to sign up without email verification" (enforce email confirmation in Stage 1).
- [ ] **Edge Functions Secrets**: Set `supabase secrets set` with the keys listed above.
