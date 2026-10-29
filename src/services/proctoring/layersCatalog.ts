export type ProctoringPhase = "before" | "during" | "after";
export type ProctoringGroup = "A" | "B" | "C";
export type ProctoringSeverity = "minor" | "medium" | "critical";

export interface ProctoringLayerDef {
  id: number;
  phase: ProctoringPhase;
  group: ProctoringGroup;
  code: string;
  label: string;
  desc: string;
  defaultSeverity: ProctoringSeverity;
}

/**
 * Canonical 30-Layer Proctoring Catalog (6 Before + 16 During + 8 After).
 * Matches `AssessmentIntegritySection.tsx` and `public.proctoring_layers_catalog` 1-for-1.
 */
export const PROCTORING_LAYERS: readonly ProctoringLayerDef[] = [
  // Phase A — Before Assessment (Layers 1..6)
  { id: 1, phase: "before", group: "A", code: "biometric_face_match", label: "Biometric Face Match", desc: "AI verifies candidate identity via facial biometrics", defaultSeverity: "critical" },
  { id: 2, phase: "before", group: "A", code: "id_verification", label: "ID Verification", desc: "Government ID checked against live photo", defaultSeverity: "critical" },
  { id: 3, phase: "before", group: "A", code: "multi_factor_auth", label: "Multi-Factor Auth", desc: "Email + session OTP before test access", defaultSeverity: "critical" },
  { id: 4, phase: "before", group: "A", code: "live_photo_capture", label: "Live Photo Capture", desc: "Snapshot taken at session start for audit", defaultSeverity: "medium" },
  { id: 5, phase: "before", group: "A", code: "environment_scan", label: "Environment Scan", desc: "360° room check for unauthorized materials", defaultSeverity: "medium" },
  { id: 6, phase: "before", group: "A", code: "identity_confirmation", label: "Identity Confirmation", desc: "Final identity match before test begins", defaultSeverity: "critical" },

  // Phase B — During Assessment (Layers 7..22)
  { id: 7, phase: "during", group: "B", code: "gaze_eye_tracking", label: "Gaze & Eye Tracking", desc: "Monitors where the candidate is looking", defaultSeverity: "minor" },
  { id: 8, phase: "during", group: "B", code: "behavior_monitoring", label: "Behavior Monitoring", desc: "Flags suspicious movement patterns", defaultSeverity: "critical" },
  { id: 9, phase: "during", group: "B", code: "audio_detection", label: "Audio Detection", desc: "Detects voices, AI speech, and background audio", defaultSeverity: "medium" },
  { id: 10, phase: "during", group: "B", code: "browser_lockdown", label: "Browser Lockdown", desc: "Locks browser to prevent tab switching", defaultSeverity: "medium" },
  { id: 11, phase: "during", group: "B", code: "keystroke_analysis", label: "Keystroke Analysis", desc: "Analyzes typing patterns for authenticity", defaultSeverity: "medium" },
  { id: 12, phase: "during", group: "B", code: "multi_device_block", label: "Multi-Device Block", desc: "Prevents simultaneous device usage", defaultSeverity: "critical" },
  { id: 13, phase: "during", group: "B", code: "screen_recording", label: "Screen Recording", desc: "Records full screen for post-review", defaultSeverity: "medium" },
  { id: 14, phase: "during", group: "B", code: "distraction_alerts", label: "Distraction Alerts", desc: "AI flags when candidate looks away", defaultSeverity: "minor" },
  { id: 15, phase: "during", group: "B", code: "ip_geo_tracking", label: "IP & Geo Tracking", desc: "Tracks location and IP for anomalies", defaultSeverity: "medium" },
  { id: 16, phase: "during", group: "B", code: "copy_paste_block", label: "Copy-Paste Block", desc: "Blocks all clipboard operations", defaultSeverity: "minor" },
  { id: 17, phase: "during", group: "B", code: "session_time_tracking", label: "Session Time Tracking", desc: "Flags unusual per-question timing", defaultSeverity: "minor" },
  { id: 18, phase: "during", group: "B", code: "exit_monitoring", label: "Exit Monitoring", desc: "Logs all test exit attempts", defaultSeverity: "medium" },
  { id: 19, phase: "during", group: "B", code: "geo_fencing", label: "Geo-Fencing", desc: "Restricts access to approved locations", defaultSeverity: "medium" },
  { id: 20, phase: "during", group: "B", code: "proctor_live_chat", label: "Proctor Live Chat", desc: "Real-time support during assessment", defaultSeverity: "minor" },
  { id: 21, phase: "during", group: "B", code: "screenshot_block", label: "Screenshot Block", desc: "Prevents screen capture and recording", defaultSeverity: "critical" },
  { id: 22, phase: "during", group: "B", code: "vm_detection", label: "VM Detection", desc: "Detects virtual machines and emulators", defaultSeverity: "critical" },

  // Phase C — After Assessment (Layers 23..30)
  { id: 23, phase: "after", group: "C", code: "ai_cheating_detection", label: "AI Cheating Detection", desc: "ML algorithms flag suspicious patterns", defaultSeverity: "critical" },
  { id: 24, phase: "after", group: "C", code: "chatgpt_detection", label: "ChatGPT Detection", desc: "Identifies AI-generated responses", defaultSeverity: "critical" },
  { id: 25, phase: "after", group: "C", code: "plagiarism_check", label: "Plagiarism Check", desc: "Cross-references against known sources", defaultSeverity: "critical" },
  { id: 26, phase: "after", group: "C", code: "full_session_replay", label: "Full Session Replay", desc: "Complete video playback for review", defaultSeverity: "minor" },
  { id: 27, phase: "after", group: "C", code: "integrity_score", label: "Integrity Score", desc: "Composite score from all proctoring signals", defaultSeverity: "minor" },
  { id: 28, phase: "after", group: "C", code: "audit_trail", label: "Audit Trail", desc: "Tamper-proof log of every action", defaultSeverity: "critical" },
  { id: 29, phase: "after", group: "C", code: "integrity_rating", label: "Integrity Rating", desc: "Overall candidate trustworthiness grade", defaultSeverity: "minor" },
  { id: 30, phase: "after", group: "C", code: "post_test_monitoring", label: "Post-Test Monitoring", desc: "Continued checks after submission", defaultSeverity: "medium" },
];

export const getLayerById = (id: number): ProctoringLayerDef | undefined =>
  PROCTORING_LAYERS.find((l) => l.id === id);

export const getLayersByPhase = (phase: ProctoringPhase): ProctoringLayerDef[] =>
  PROCTORING_LAYERS.filter((l) => l.phase === phase);

export function computeIntegrityGrade(
  score: number,
  aiScore = 0,
  chatgptScore = 0,
  plagiarismPct = 0,
  chainValid = true
): { grade: "A+" | "A" | "B" | "C" | "F"; verdict: string } {
  if (!chainValid || score < 40) return { grade: "F", verdict: "Invalidated" };
  if (score >= 95 && aiScore < 35 && chatgptScore < 35 && plagiarismPct < 50) {
    return { grade: "A+", verdict: "Exemplary Verified" };
  }
  if (score >= 85 && aiScore < 50 && chatgptScore < 50) {
    return { grade: "A", verdict: "Verified High" };
  }
  if (score >= 70) return { grade: "B", verdict: "Monitored Clean" };
  return { grade: "C", verdict: "Review Flagged" };
}
