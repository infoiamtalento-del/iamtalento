// Pro Types and State Definitions
import { ProUser, ProJob, ProCandidate, ProApplication } from "@/data/proData";

export type ProView =
  | "profile"
  | "jobs"
  | "port"
  | "upd"
  | "dash"
  | "disc"
  | "saved"
  | "applied"
  | "cert"
  | "resume"
  | "ver"
  | "wallet"
  | "cp"
  | "talent"
  | "notif"
  | "pipe"
  | "post"
  | "account"
  | "employer-assessments"
  | "interviews"
  | "advertise"
  | "subscription"
  | "payment-history"
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
