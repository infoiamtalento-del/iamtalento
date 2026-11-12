import { rpc } from "@/services/db";

export interface TalentPackage {
  key: string;
  name: string;
  description: string;
  price_inr: number;
  scope: "per_profile" | "subscription";
  verified_only: boolean;
  grants_cv: boolean;
  grants_cir: boolean;
  duration_days: number | null;
}

export interface WalletLedgerRow { id: number; type: "debit" | "credit"; amount: number; balance_after: number; reason: string; at: string }
export interface EmployerWallet { wallet_id: string; balance: number; currency: string; ledger: WalletLedgerRow[] }

export interface TalentOverview {
  wallet: EmployerWallet;
  subscription: { package_key: string; expires_at: string } | null;
  packages: TalentPackage[];
  unlocked_count: number;
  can_unlock: boolean;
}

export interface TalentCandidate {
  id: string;
  display_name: string;
  photo_url: string | null;
  headline: string | null;
  job_role: string | null;
  city: string | null;
  years_of_experience: number | null;
  verified: boolean;
  status: string;
  skills: string[];
  education: string | null;
  unlocked: boolean;
}

export interface TalentSearch { total: number; items: TalentCandidate[] }

export interface CandidateFullProfile {
  access: { profile: boolean; cv: boolean; cir: boolean; via: string; verified: boolean };
  profile: {
    id: string; name: string; email: string | null; phone: string | null; headline: string | null; city: string | null;
    state: string | null; country: string | null; years_of_experience: number | null; about: string | null; photo_url: string | null;
    linkedin_url: string | null; github_url: string | null; portfolio_url: string | null; notice_period: string | null;
    preferred_locations: string[] | null; verified: boolean; talent_cir_id: string | null;
    resume_path: string | null; resume_url: string | null;
  };
  skills: Array<{ name: string; level: string | null; verified: boolean }>;
  experience: Array<{ title: string; company: string; start: string | null; end: string | null; current: boolean; description: string | null }>;
  education: Array<{ degree: string | null; field: string | null; institution: string | null; start: number | null; end: number | null }>;
  certifications: Array<{ name: string }>;
}

export interface CirReport {
  talent_cir_id: string | null;
  candidate_name: string | null;
  composite_score: number;
  percentile: number | null;
  tier: string | null;
  integrity_score: number | null;
  sections: unknown;
  version: number;
  generated_at: string;
}

export const getTalentOverview = () => rpc<TalentOverview>("get_talent_overview");
export const getEmployerWallet = () => rpc<EmployerWallet>("get_employer_wallet");

export const searchCandidates = (
  p: { query?: string; verified?: boolean | null; skill?: string; minExp?: number | null; limit?: number; offset?: number } = {},
) =>
  rpc<TalentSearch>("search_candidates", {
    p_query: p.query || null,
    p_verified: p.verified ?? null,
    p_skill: p.skill || null,
    p_min_exp: p.minExp ?? null,
    p_limit: p.limit ?? 24,
    p_offset: p.offset ?? 0,
  });

export const purchaseTalentPackage = (pkg: string, candidateId?: string | null) =>
  rpc<{ granted: boolean; already_owned: boolean; grant_id: string; balance: number }>("purchase_talent_package", {
    p_package: pkg,
    p_candidate: candidateId ?? null,
  });

export const getCandidateProfile = (candidateId: string) =>
  rpc<CandidateFullProfile>("get_candidate_profile_for_employer", { p_candidate: candidateId });
export const getCandidateCir = (candidateId: string) => rpc<CirReport>("get_candidate_cir_report", { p_candidate: candidateId });

/** Payment-required errors (P0402) mean "unlock or recharge", not a failure. */
export const isPaymentRequired = (e: unknown): boolean =>
  e instanceof Error && ((e as { code?: string }).code === "P0402" || /balance|unlock|not unlocked/i.test(e.message));

export const inr = (n: number) => `₹${Number(n).toLocaleString("en-IN")}`;
