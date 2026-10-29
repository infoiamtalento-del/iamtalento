import { describe, expect, it } from "vitest";
import { PROCTORING_LAYERS, computeIntegrityGrade, getLayersByPhase } from "@/services/proctoring/layersCatalog";
import { KeystrokeTracker, calculateTotalForegroundTimeMs, detectInitialVisibility } from "@/services/proctoring/detectors";
import {
  completeProctoringPrecheck,
  fetchProctoringDossier,
  finalizeProctoringAudit,
  initProctoringSession,
  recordProctoringSignal,
  sendProctorChat,
  verifyProctoringMfa,
} from "@/services/proctoring/proctoringService";

describe("30-Layer Client Proctoring SDK", () => {
  it("defines 6 Before + 16 During + 8 After = 30 exact layers", () => {
    expect(PROCTORING_LAYERS).toHaveLength(30);
    expect(getLayersByPhase("before")).toHaveLength(6);
    expect(getLayersByPhase("during")).toHaveLength(16);
    expect(getLayersByPhase("after")).toHaveLength(8);
  });

  it("computes integrity grades and detects paste/injection bursts", () => {
    expect(computeIntegrityGrade(98, 10, 5, 0, true).grade).toBe("A+");
    expect(computeIntegrityGrade(88, 20, 15, 0, true).grade).toBe("A");
    expect(computeIntegrityGrade(76, 30, 20, 0, true).grade).toBe("B");
    expect(computeIntegrityGrade(55, 40, 20, 0, true).grade).toBe("C");
    expect(computeIntegrityGrade(35, 0, 0, 0, true).grade).toBe("F");
    expect(computeIntegrityGrade(99, 0, 0, 0, false).grade).toBe("F");

    const kt = new KeystrokeTracker();
    kt.onKeyDown("a");
    kt.onKeyDown("b");
    expect(kt.onTextChange(120).injectedBlock).toBe(true);
    const m = kt.getMetrics(120);
    expect(m.pasteBurstCount).toBe(1);
    expect(m.keystrokeCharRatio).toBeLessThan(0.5);
  });

  it("runs VisibilityStateEntry helpers with safe fallbacks", () => {
    const vis = detectInitialVisibility();
    expect(typeof vis.initiallyBackgrounded).toBe("boolean");
    expect(calculateTotalForegroundTimeMs()).toBeGreaterThanOrEqual(0);
  });

  it("executes full 30-layer local hash-chained session lifecycle cleanly", async () => {
    const attemptId = "local-unit-test-30";
    const init = await initProctoringSession({
      attemptId,
      deviceFingerprint: "fp-unit-test-device",
      timezone: "Asia/Kolkata",
      clientEpochMs: Date.now(),
      vmFlags: [],
    });
    expect(init.dispatchedOtpHint).toMatch(/^\d{6}$/);

    const bad = await verifyProctoringMfa(attemptId, "000000");
    expect(bad.verified && init.dispatchedOtpHint !== "000000").toBe(false);

    const good = await verifyProctoringMfa(attemptId, init.dispatchedOtpHint!);
    expect(good.verified).toBe(true);

    await completeProctoringPrecheck(attemptId, {
      face_match_score: 97,
      liveness_passed: true,
      id_verified: true,
      noise_floor_db: -49,
    });

    const s1 = await recordProctoringSignal(attemptId, {
      layerId: 10,
      code: "tab_hidden",
      severity: "medium",
      confidence: 1,
    });
    expect(s1).toBe(97);

    const chat = await sendProctorChat(attemptId, "Accidental OS popup appeared");
    expect(chat?.proctorReply.sender).toBe("proctor_ai");

    await finalizeProctoringAudit(attemptId, {
      keystroke_char_ratio: 0.96,
      paste_burst_count: 0,
      fast_answer_count: 0,
    });

    const dossier = await fetchProctoringDossier(attemptId);
    expect(dossier).not.toBeNull();
    expect(dossier!.chain.valid).toBe(true);
    expect(dossier!.integrity_score).toBe(97);
    expect(dossier!.integrity_grade).toBe("A+");
    expect(dossier!.chat_messages_count).toBe(2);
  });
});
