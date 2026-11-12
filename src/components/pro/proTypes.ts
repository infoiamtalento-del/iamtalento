// Pro Types and State Definitions
import { ProUser, ProJob, ProCandidate, ProApplication } from "@/data/proData";

export type ProView =
  | "profile"
  | "edit-profile"
  | "readiness"
  | "mock-interview"
  | "my-resume"
  | "jobs"
  | "port"
  | "upd"
  | "dash"
  | "disc"
  | "saved"
  | "applied"
  | "cert"
  | "my-certifications"
  | "resume"
  | "ver"
  | "wallet"
  | "cp"
  | "talent"
  | "security"
  | "notif"
  | "pipe"
  | "post"
  | "account"
  | "employer-assessments"
  | "ai-hub"
  | "talent-pool"
  | "interviews"
  | "offers"
  | "campus-hiring"
  | "employer-analytics"
  | "advertise"
  | "subscription"
  | "payment-history"
  | "corporate-learning"
  | "learning-mentors"
  | "freelancing"
  | "events-community"
  | "analytics"
  | "settings"
  | "support";

export type ProDrawerState =
  | { type: "job"; id: number }
  | { type: "candidate"; name: string; jobId?: number }
  | { type: "applicant"; id: number }
  | { type: "compare-jobs" }
  | { type: "compare-candidates" }
  | { type: "receipt"; txId: string }
  | { type: "certificate"; key: string }
  | null;
