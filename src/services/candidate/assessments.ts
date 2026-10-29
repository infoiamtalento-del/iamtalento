import { db, rpc, currentUserId } from "@/services/db";
import { supabase } from "@/integrations/supabase/client";

export interface CatalogAssessment {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  kind: "core" | "domain";
  core_position: number | null;
  industry: string | null;
  domain: string | null;
  test_type: string;
  difficulty: string;
  skills: string[];
  duration_minutes: number;
  question_count: number;
  price_inr: number;
  proctored: boolean;
  creator_name: string | null;
  creator_company: string | null;
  creator_photo_url: string | null;
}

export interface Journey { id: string; domain_assessment_id: string; status: string; started_at: string; completed_at: string | null }
export interface JourneyStep {
  step_no: number;
  assessment_id: string;
  slug: string;
  title: string;
  kind: "core" | "domain";
  status: "not_started" | "in_progress" | "submitted" | "graded" | "expired" | "invalidated";
  attempt_id: string | null;
  percentage: number | null;
  is_unlocked: boolean;
}
export interface Attempt {
  id: string;
  assessment_id: string;
  journey_id: string;
  status: string;
  server_expires_at: string;
  percentage: number | null;
  score: number | null;
  max_score: number | null;
  integrity_score: number;
  theta: number | null;
  needs_manual_review: boolean;
}
export interface AttemptQuestion {
  step_no: number;
  question_id: string;
  section: string | null;
  qtype: "mcq" | "multi" | "descriptive" | "audio" | "practical" | "coding";
  prompt: string;
  options: { id: number; text: string }[] | null;
  marks: number;
  time_limit_sec: number | null;
  saved_response: Record<string, unknown> | null;
}
export interface CirReport {
  id: string;
  journey_id: string;
  composite_score: number;
  percentile: number | null;
  tier: string | null;
  integrity_score: number | null;
  sections: Record<string, any>;
  generated_at: string;
}

export async function fetchCatalog(kind?: "core" | "domain"): Promise<CatalogAssessment[]> {
  let q = db.from("assessments_catalog").select("*").eq("is_active", true).order("core_position", { nullsFirst: false }).order("title");
  if (kind) q = q.eq("kind", kind);
  const { data, error } = await q;
  if (error) throw error;
  return data as CatalogAssessment[];
}

export const startJourney = (domainAssessmentId: string, orderId?: string) =>
  rpc<Journey>("start_journey", { p_domain_assessment_id: domainAssessmentId, p_order_id: orderId ?? null });
export const getJourneyProgress = (journeyId: string) => rpc<JourneyStep[]>("get_journey_progress", { p_journey: journeyId });
export const startAttempt = (journeyId: string, assessmentId: string) =>
  rpc<Attempt>("start_assessment_attempt", { p_journey: journeyId, p_assessment: assessmentId });
export const getAttemptQuestions = (attemptId: string) => rpc<AttemptQuestion[]>("get_attempt_questions", { p_attempt: attemptId });
export const saveResponse = (attemptId: string, questionId: string, response: Record<string, unknown>, latencyMs?: number) =>
  rpc<void>("save_attempt_response", { p_attempt: attemptId, p_question: questionId, p_response: response, p_latency_ms: latencyMs ?? null });
export const submitAttempt = (attemptId: string) => rpc<Attempt>("submit_assessment_attempt", { p_attempt: attemptId });
export const generateCir = (journeyId: string) => rpc<CirReport>("generate_cir_report", { p_journey: journeyId });

export type ProctorSignal = {
  layerId: number;
  code: string;
  severity: "minor" | "medium" | "critical";
  confidence?: number;
  snapshotUrl?: string;
  meta?: Record<string, unknown>;
};
/** Returns the live integrity score (0-100). Fire-and-forget safe: never throws into the exam UI. */
export async function logProctorEvent(attemptId: string, s: ProctorSignal): Promise<number | null> {
  try {
    return await rpc<number>("log_proctoring_event", {
      p_attempt: attemptId, p_layer_id: s.layerId, p_signal_code: s.code, p_severity: s.severity,
      p_confidence: s.confidence ?? 1, p_snapshot_url: s.snapshotUrl ?? null, p_meta: s.meta ?? {},
    });
  } catch {
    return null;
  }
}

export async function fetchMyCirReports(): Promise<CirReport[]> {
  const uid = await currentUserId();
  if (!uid) return [];
  const { data, error } = await db.from("cir_reports").select("*").eq("user_id", uid).order("generated_at", { ascending: false });
  if (error) throw error;
  return data as CirReport[];
}

export async function fetchMyAttempts(): Promise<Attempt[]> {
  const uid = await currentUserId();
  if (!uid) return [];
  const { data, error } = await db.from("assessment_attempts").select("*").eq("user_id", uid).order("started_at", { ascending: false });
  if (error) throw error;
  return data as Attempt[];
}

export async function fetchActiveJourneys(): Promise<Journey[]> {
  const uid = await currentUserId();
  if (!uid) return [];
  const { data, error } = await db.from("assessment_journeys").select("*").eq("user_id", uid).eq("status", "in_progress");
  if (error) throw error;
  return data as Journey[];
}

export async function signCredential(reportId: string): Promise<void> {
  await supabase.functions.invoke("sign-credential", { body: { reportId } });
}

export interface VerifiedCredential {
  valid: boolean; holder_name: string | null; composite_score: number; tier: string; domain: string;
  integrity_score: number; issued_at: string; expires_at: string; signed: boolean;
}
export const verifyCredential = (token: string) => rpc<VerifiedCredential[]>("verify_credential", { p_token: token }).then((r) => r[0] ?? null);

export interface UserCredentialRow {
  id: string;
  cir_report_id: string | null;
  verify_token: string;
  issued_at: string;
  expires_at: string | null;
  revoked_at: string | null;
}
export async function fetchMyVerifiableCredentials(): Promise<UserCredentialRow[]> {
  const uid = await currentUserId();
  if (!uid) return [];
  const { data, error } = await db
    .from("verifiable_credentials")
    .select("id, cir_report_id, verify_token, issued_at, expires_at, revoked_at")
    .eq("user_id", uid)
    .order("issued_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as UserCredentialRow[];
}
