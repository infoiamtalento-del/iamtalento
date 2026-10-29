import { currentUserId, db, rpc } from "@/services/db";
import { supabase } from "@/integrations/supabase/client";
import { computeIntegrityGrade, type ProctoringSeverity } from "./layersCatalog";
import { sha256Hex } from "./detectors";

export interface ReplayKeyframe {
  t: number; // seconds since exam start
  label: string;
  layerId?: number;
  severity?: "info" | ProctoringSeverity;
  snapshotPath?: string;
  previewDataUrl?: string;
}

export interface ProctorEventItem {
  id: number;
  layer_id: number;
  layer_group: "A" | "B" | "C";
  signal_code: string;
  severity: ProctoringSeverity;
  confidence: number;
  snapshot_url?: string | null;
  meta?: Record<string, unknown>;
  prev_hash: string;
  event_hash: string;
  created_at: string;
}

export interface ProctorChatMessage {
  id: string;
  attempt_id: string;
  sender: "candidate" | "proctor_ai" | "proctor_human";
  body: string;
  created_at: string;
}

export interface ProctoringDossier {
  attempt_id: string;
  status: string;
  integrity_score: number;
  integrity_grade: "A+" | "A" | "B" | "C" | "F";
  session: {
    face_match_score?: number | null;
    liveness_passed?: boolean;
    id_verified?: boolean;
    mfa_verified_at?: string | null;
    baseline_snapshot_path?: string | null;
    env_scan_paths?: string[];
    device_fingerprint?: string | null;
    vm_flags?: string[];
    ip_drift_count?: number;
    timezone?: string | null;
    clock_skew_ms?: number;
    noise_floor_db?: number | null;
    screen_share_active?: boolean;
    precheck_completed?: boolean;
    typing_metrics?: Record<string, unknown>;
    foreground_stats?: Record<string, unknown>;
    replay_keyframes?: ReplayKeyframe[];
    ai_anomaly_score?: number;
    chatgpt_risk_score?: number;
    plagiarism_max_sim?: number;
    collusion_flag?: boolean;
    chain_valid?: boolean;
    chain_head_hash?: string | null;
    sealed_at?: string | null;
  } | null;
  chain: {
    valid: boolean;
    event_count: number;
    head_hash: string;
    broken_at_id?: number | null;
  };
  events: ProctorEventItem[];
  chat_messages_count: number;
}

const isLocalAttempt = (attemptId: string) => attemptId.startsWith("local-");
const localKey = (attemptId: string) => `proctor30-${attemptId}`;

interface LocalLedgerState {
  attemptId: string;
  otpCode: string;
  mfaVerifiedAt: string | null;
  precheckCompleted: boolean;
  faceMatchScore: number;
  livenessPassed: boolean;
  idVerified: boolean;
  baselinePreview?: string;
  envAngles: number;
  deviceFingerprint: string;
  timezone: string;
  clockSkewMs: number;
  vmFlags: string[];
  noiseFloorDb: number;
  screenShareActive: boolean;
  integrityScore: number;
  status: string;
  events: ProctorEventItem[];
  chat: ProctorChatMessage[];
  replayKeyframes: ReplayKeyframe[];
  typingMetrics: Record<string, unknown>;
  foregroundStats: Record<string, unknown>;
  aiAnomalyScore: number;
  chatgptRiskScore: number;
  plagiarismMaxSim: number;
  sealedAt: string | null;
}

function readLocalState(attemptId: string): LocalLedgerState {
  if (typeof sessionStorage !== "undefined") {
    const raw = sessionStorage.getItem(localKey(attemptId));
    if (raw) {
      try {
        return JSON.parse(raw) as LocalLedgerState;
      } catch {
        // Reinitialize corrupted session storage entry
      }
    }
  }
  const fresh: LocalLedgerState = {
    attemptId,
    otpCode: String(Math.floor(100000 + Math.random() * 900000)),
    mfaVerifiedAt: null,
    precheckCompleted: false,
    faceMatchScore: 95,
    livenessPassed: false,
    idVerified: false,
    envAngles: 0,
    deviceFingerprint: "local-device",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    clockSkewMs: 0,
    vmFlags: [],
    noiseFloorDb: -48,
    screenShareActive: false,
    integrityScore: 100,
    status: "in_progress",
    events: [],
    chat: [],
    replayKeyframes: [],
    typingMetrics: {},
    foregroundStats: {},
    aiAnomalyScore: 0,
    chatgptRiskScore: 0,
    plagiarismMaxSim: 0,
    sealedAt: null,
  };
  writeLocalState(attemptId, fresh);
  return fresh;
}

function writeLocalState(attemptId: string, state: LocalLedgerState): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(localKey(attemptId), JSON.stringify(state));
  } catch {
    // Trim preview dataUrls if sessionStorage quota is tight
    const slim = {
      ...state,
      replayKeyframes: state.replayKeyframes.map((k) => ({ ...k, previewDataUrl: undefined })),
    };
    try {
      sessionStorage.setItem(localKey(attemptId), JSON.stringify(slim));
    } catch {
      // Ignore storage quota overflow
    }
  }
}

async function appendLocalHashEvent(
  attemptId: string,
  layerId: number,
  signalCode: string,
  severity: ProctoringSeverity,
  confidence = 1,
  snapshotUrl?: string | null,
  meta: Record<string, unknown> = {}
): Promise<number> {
  const st = readLocalState(attemptId);
  const prevHash = st.events.length > 0 ? st.events[st.events.length - 1].event_hash : "GENESIS";
  const createdAt = new Date().toISOString();
  const fullHash = await sha256Hex(`${prevHash}|${attemptId}|${createdAt}|${layerId}|${signalCode}|${snapshotUrl ?? ""}`);
  const group: "A" | "B" | "C" = layerId <= 6 ? "A" : layerId <= 22 ? "B" : "C";
  const conf = Math.max(0, Math.min(1, confidence));

  st.events.push({
    id: st.events.length + 1,
    layer_id: layerId,
    layer_group: group,
    signal_code: signalCode,
    severity,
    confidence: conf,
    snapshot_url: snapshotUrl ?? null,
    meta,
    prev_hash: prevHash,
    event_hash: fullHash,
    created_at: createdAt,
  });

  const penalty = st.events.reduce((sum, e) => {
    const w = e.severity === "minor" ? 1 : e.severity === "medium" ? 3 : 10;
    return sum + w * e.confidence;
  }, 0);
  st.integrityScore = Math.max(0, Math.round((100 - penalty) * 100) / 100);
  if (st.integrityScore < 40) st.status = "invalidated";
  writeLocalState(attemptId, st);
  return st.integrityScore;
}

/* ------------------------------------------------------------------ */
/* Public Proctoring Service API                                       */
/* ------------------------------------------------------------------ */

export async function initProctoringSession(params: {
  attemptId: string;
  deviceFingerprint: string;
  timezone: string;
  clientEpochMs: number;
  vmFlags: string[];
}): Promise<{
  precheckCompleted: boolean;
  mfaVerified: boolean;
  idVerified: boolean;
  integrityScore: number;
  dispatchedOtpHint?: string | null;
}> {
  const { attemptId, deviceFingerprint, timezone, clientEpochMs, vmFlags } = params;
  if (isLocalAttempt(attemptId)) {
    const st = readLocalState(attemptId);
    st.deviceFingerprint = deviceFingerprint;
    st.timezone = timezone;
    st.vmFlags = vmFlags;
    writeLocalState(attemptId, st);
    if (vmFlags.length > 0 && !st.events.some((e) => e.layer_id === 22)) {
      await appendLocalHashEvent(attemptId, 22, "vm_or_automation_detected", "critical", 0.85, null, { flags: vmFlags });
    }
    const updated = readLocalState(attemptId);
    return {
      precheckCompleted: updated.precheckCompleted,
      mfaVerified: Boolean(updated.mfaVerifiedAt),
      idVerified: updated.idVerified,
      integrityScore: updated.integrityScore,
      dispatchedOtpHint: updated.otpCode,
    };
  }

  const res = await rpc<{
    precheck_completed: boolean;
    mfa_verified: boolean;
    id_verified: boolean;
    integrity_score: number;
  }>("init_proctoring_session", {
    p_attempt: attemptId,
    p_device_fingerprint: deviceFingerprint,
    p_timezone: timezone,
    p_client_epoch_ms: clientEpochMs,
    p_vm_flags: vmFlags,
  });

  // Fetch candidate's own in-app OTP notification so they can view/copy it without leaving fullscreen
  let otpHint: string | null = null;
  try {
    const uid = await currentUserId();
    if (uid && !res.mfa_verified) {
      const { data } = await db
        .from("notifications")
        .select("data")
        .eq("user_id", uid)
        .eq("kind", "proctoring_mfa")
        .order("created_at", { ascending: false })
        .limit(3);
      const match = (data ?? []).find((n: { data?: { attempt_id?: string; otp_code?: string } }) => n?.data?.attempt_id === attemptId);
      otpHint = match?.data?.otp_code ?? null;
    }
  } catch {
    otpHint = null;
  }

  return {
    precheckCompleted: Boolean(res.precheck_completed),
    mfaVerified: Boolean(res.mfa_verified),
    idVerified: Boolean(res.id_verified),
    integrityScore: Number(res.integrity_score ?? 100),
    dispatchedOtpHint: otpHint,
  };
}

export async function verifyProctoringMfa(
  attemptId: string,
  code: string
): Promise<{ verified: boolean; remainingAttempts?: number }> {
  const clean = code.trim();
  if (isLocalAttempt(attemptId)) {
    const st = readLocalState(attemptId);
    if (clean === st.otpCode) {
      st.mfaVerifiedAt = new Date().toISOString();
      writeLocalState(attemptId, st);
      await appendLocalHashEvent(attemptId, 3, "mfa_otp_verified", "minor", 0);
      return { verified: true };
    }
    return { verified: false, remainingAttempts: 4 };
  }

  const res = await rpc<{ verified: boolean; remaining_attempts?: number }>("verify_proctoring_mfa", {
    p_attempt: attemptId,
    p_code: clean,
  });
  return { verified: Boolean(res.verified), remainingAttempts: res.remaining_attempts };
}

export async function uploadProctoringSnapshot(
  attemptId: string,
  tag: string,
  blob: Blob
): Promise<string | null> {
  if (isLocalAttempt(attemptId)) return null;
  const uid = await currentUserId();
  if (!uid) return null;
  const safeTag = tag.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 32) || "snap";
  const path = `${uid}/${attemptId}/${Date.now()}-${safeTag}.jpg`;
  const { error } = await supabase.storage
    .from("proctoring-snapshots")
    .upload(path, blob, { contentType: "image/jpeg", upsert: false });
  if (error) return null;
  return path;
}

export async function getSignedSnapshotUrl(path: string | null | undefined): Promise<string | null> {
  if (!path) return null;
  if (/^https?:\/\//i.test(path) || path.startsWith("data:image/")) return path;
  const { data, error } = await supabase.storage.from("proctoring-snapshots").createSignedUrl(path, 3600);
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

export async function completeProctoringPrecheck(
  attemptId: string,
  payload: {
    face_match_score: number;
    liveness_passed: boolean;
    id_verified: boolean;
    id_snapshot_path?: string | null;
    baseline_snapshot_path?: string | null;
    baseline_preview_data_url?: string | null;
    env_scan_paths?: string[];
    env_metrics?: Record<string, unknown>;
    noise_floor_db?: number;
  }
): Promise<void> {
  if (isLocalAttempt(attemptId)) {
    const st = readLocalState(attemptId);
    st.faceMatchScore = payload.face_match_score;
    st.livenessPassed = payload.liveness_passed;
    st.idVerified = payload.id_verified;
    st.baselinePreview = payload.baseline_preview_data_url ?? undefined;
    st.envAngles = payload.env_scan_paths?.length ?? 3;
    st.noiseFloorDb = payload.noise_floor_db ?? -48;
    st.precheckCompleted = true;
    if (payload.baseline_preview_data_url) {
      st.replayKeyframes.push({
        t: 0,
        label: "Baseline Biometric Lock",
        layerId: 4,
        severity: "info",
        previewDataUrl: payload.baseline_preview_data_url,
      });
    }
    writeLocalState(attemptId, st);
    await appendLocalHashEvent(attemptId, 1, "biometric_face_verified", "minor", 0);
    await appendLocalHashEvent(attemptId, 2, "id_check_completed", "minor", 0);
    await appendLocalHashEvent(attemptId, 4, "baseline_photo_captured", "minor", 0);
    await appendLocalHashEvent(attemptId, 5, "environment_360_scanned", "minor", 0);
    await appendLocalHashEvent(attemptId, 6, "precheck_sealed", "minor", 0);
    return;
  }

  const { baseline_preview_data_url: _omit, ...dbPayload } = payload;
  await rpc("complete_proctoring_precheck", {
    p_attempt: attemptId,
    p_payload: dbPayload,
  });
}

export async function recordProctoringSignal(
  attemptId: string,
  signal: {
    layerId: number;
    code: string;
    severity: ProctoringSeverity;
    confidence?: number;
    snapshotUrl?: string | null;
    meta?: Record<string, unknown>;
  }
): Promise<number | null> {
  if (isLocalAttempt(attemptId)) {
    return appendLocalHashEvent(
      attemptId,
      signal.layerId,
      signal.code,
      signal.severity,
      signal.confidence ?? 1,
      signal.snapshotUrl ?? null,
      signal.meta ?? {}
    );
  }
  try {
    return await rpc<number>("log_proctoring_event", {
      p_attempt: attemptId,
      p_layer_id: signal.layerId,
      p_signal_code: signal.code,
      p_severity: signal.severity,
      p_confidence: signal.confidence ?? 1,
      p_snapshot_url: signal.snapshotUrl ?? null,
      p_meta: signal.meta ?? {},
    });
  } catch {
    return null;
  }
}

export async function sendProctorHeartbeat(
  attemptId: string,
  deviceFingerprint: string,
  metrics: {
    screen_share_active?: boolean;
    typing_metrics?: Record<string, unknown>;
    foreground_stats?: Record<string, unknown>;
    replay_keyframes?: ReplayKeyframe[];
  }
): Promise<{
  integrity_score: number;
  status: string;
  device_conflict: boolean;
  ip_drift: boolean;
} | null> {
  if (isLocalAttempt(attemptId)) {
    const st = readLocalState(attemptId);
    if (metrics.screen_share_active !== undefined) st.screenShareActive = metrics.screen_share_active;
    if (metrics.typing_metrics) st.typingMetrics = metrics.typing_metrics;
    if (metrics.foreground_stats) st.foregroundStats = metrics.foreground_stats;
    if (metrics.replay_keyframes) st.replayKeyframes = metrics.replay_keyframes.slice(-24);
    writeLocalState(attemptId, st);
    return {
      integrity_score: st.integrityScore,
      status: st.status,
      device_conflict: false,
      ip_drift: false,
    };
  }
  try {
    const slimFrames = (metrics.replay_keyframes ?? []).slice(-18).map((f) => ({
      t: f.t,
      label: f.label,
      layerId: f.layerId,
      severity: f.severity,
      snapshotPath: f.snapshotPath,
    }));
    return await rpc("heartbeat_proctoring_session", {
      p_attempt: attemptId,
      p_device_fingerprint: deviceFingerprint,
      p_metrics: { ...metrics, replay_keyframes: slimFrames },
    });
  } catch {
    return null;
  }
}

export async function fetchProctorChat(attemptId: string): Promise<ProctorChatMessage[]> {
  if (isLocalAttempt(attemptId)) {
    return readLocalState(attemptId).chat;
  }
  try {
    const { data, error } = await db
      .from("proctor_chat_messages")
      .select("*")
      .eq("attempt_id", attemptId)
      .order("created_at", { ascending: true });
    if (error) return [];
    return (data ?? []) as ProctorChatMessage[];
  } catch {
    return [];
  }
}

export async function sendProctorChat(
  attemptId: string,
  body: string
): Promise<{ candidateMessage: ProctorChatMessage; proctorReply: ProctorChatMessage } | null> {
  const clean = body.trim();
  if (!clean) return null;

  if (isLocalAttempt(attemptId)) {
    const st = readLocalState(attemptId);
    const now = new Date().toISOString();
    const candidateMessage: ProctorChatMessage = {
      id: `c-${Date.now()}`,
      attempt_id: attemptId,
      sender: "candidate",
      body: clean,
      created_at: now,
    };
    const lower = clean.toLowerCase();
    const replyBody = /(camera|webcam|face|light)/.test(lower)
      ? "Proctor Desk: Camera note logged onto your session ledger. Keep front lighting steady and remain in fullscreen."
      : /(fullscreen|tab|popup|window)/.test(lower)
      ? "Proctor Desk: Click 'Return to Fullscreen' in the exam header immediately. Brief OS notifications are reviewed in context."
      : `Proctor Desk: Your note has been hash-chained onto the session audit log (Integrity ${Math.round(st.integrityScore)}%). Please continue your test.`;

    const proctorReply: ProctorChatMessage = {
      id: `p-${Date.now() + 1}`,
      attempt_id: attemptId,
      sender: "proctor_ai",
      body: replyBody,
      created_at: new Date(Date.now() + 250).toISOString(),
    };
    st.chat.push(candidateMessage, proctorReply);
    writeLocalState(attemptId, st);
    await appendLocalHashEvent(attemptId, 20, "proctor_chat_support", "minor", 0);
    return { candidateMessage, proctorReply };
  }

  const res = await rpc<{
    candidate_message: ProctorChatMessage;
    proctor_reply: ProctorChatMessage;
  }>("send_proctor_chat_message", {
    p_attempt: attemptId,
    p_body: clean,
  });
  return {
    candidateMessage: res.candidate_message,
    proctorReply: res.proctor_reply,
  };
}

export async function finalizeProctoringAudit(
  attemptId: string,
  clientSummary: {
    keystroke_char_ratio?: number;
    paste_burst_count?: number;
    hidden_answer_correlations?: number;
    fast_answer_count?: number;
    typing_metrics?: Record<string, unknown>;
    foreground_stats?: Record<string, unknown>;
    replay_keyframes?: ReplayKeyframe[];
  } = {}
): Promise<void> {
  if (isLocalAttempt(attemptId)) {
    const st = readLocalState(attemptId);
    if (st.sealedAt) return;
    const focusViolations = st.events.filter((e) => [7, 8, 9, 10, 12, 14, 18].includes(e.layer_id) && e.confidence > 0).length;
    st.aiAnomalyScore = Math.min(
      100,
      (clientSummary.fast_answer_count ?? 0) * 20 +
        focusViolations * 7 +
        (clientSummary.hidden_answer_correlations ?? 0) * 18
    );
    const kc = clientSummary.keystroke_char_ratio ?? 1;
    st.chatgptRiskScore = Math.min(
      100,
      (kc < 0.55 ? 40 : kc < 0.75 ? 20 : 0) + (clientSummary.paste_burst_count ?? 0) * 20
    );
    if (clientSummary.typing_metrics) st.typingMetrics = clientSummary.typing_metrics;
    if (clientSummary.foreground_stats) st.foregroundStats = clientSummary.foreground_stats;
    if (clientSummary.replay_keyframes) st.replayKeyframes = clientSummary.replay_keyframes.slice(-24);
    st.sealedAt = new Date().toISOString();
    writeLocalState(attemptId, st);
    await appendLocalHashEvent(attemptId, 30, "session_sealed", "minor", 0, null, { layers_verified: 30 });
    return;
  }

  try {
    const slimFrames = (clientSummary.replay_keyframes ?? []).slice(-18).map((f) => ({
      t: f.t,
      label: f.label,
      layerId: f.layerId,
      severity: f.severity,
      snapshotPath: f.snapshotPath,
    }));
    await rpc("finalize_proctoring_audit", {
      p_attempt: attemptId,
      p_client_summary: { ...clientSummary, replay_keyframes: slimFrames },
    });
  } catch {
    // Non-blocking if already sealed by submit_assessment_attempt
  }
}

export async function fetchProctoringDossier(attemptId: string): Promise<ProctoringDossier | null> {
  if (isLocalAttempt(attemptId)) {
    const st = readLocalState(attemptId);
    // Verify local SHA-256 chain
    let prev = "GENESIS";
    let valid = true;
    for (const ev of st.events) {
      if (ev.prev_hash !== prev) {
        valid = false;
        break;
      }
      prev = ev.event_hash;
    }
    const { grade } = computeIntegrityGrade(
      st.integrityScore,
      st.aiAnomalyScore,
      st.chatgptRiskScore,
      st.plagiarismMaxSim * 100,
      valid
    );
    return {
      attempt_id: attemptId,
      status: st.status,
      integrity_score: st.integrityScore,
      integrity_grade: grade,
      session: {
        face_match_score: st.faceMatchScore,
        liveness_passed: st.livenessPassed,
        id_verified: st.idVerified,
        mfa_verified_at: st.mfaVerifiedAt,
        device_fingerprint: st.deviceFingerprint,
        vm_flags: st.vmFlags,
        ip_drift_count: 0,
        timezone: st.timezone,
        clock_skew_ms: st.clockSkewMs,
        noise_floor_db: st.noiseFloorDb,
        screen_share_active: st.screenShareActive,
        precheck_completed: st.precheckCompleted,
        typing_metrics: st.typingMetrics,
        foreground_stats: st.foregroundStats,
        replay_keyframes: st.replayKeyframes,
        ai_anomaly_score: st.aiAnomalyScore,
        chatgpt_risk_score: st.chatgptRiskScore,
        plagiarism_max_sim: st.plagiarismMaxSim,
        collusion_flag: false,
        chain_valid: valid,
        chain_head_hash: prev,
        sealed_at: st.sealedAt,
      },
      chain: {
        valid,
        event_count: st.events.length,
        head_hash: prev.slice(0, 16),
      },
      events: st.events.map((e) => ({
        ...e,
        prev_hash: e.prev_hash.slice(0, 16),
        event_hash: e.event_hash.slice(0, 16),
      })),
      chat_messages_count: st.chat.length,
    };
  }

  try {
    return await rpc<ProctoringDossier>("get_proctoring_dossier", { p_attempt: attemptId });
  } catch {
    return null;
  }
}
