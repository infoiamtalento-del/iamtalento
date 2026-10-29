import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Shield, ShieldAlert, AlertTriangle, Maximize, MessagesSquare, ScreenShare,
  Eye, Volume2, X, Send, CheckCircle2, Camera, Layers, Loader2, Minimize2, Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PROCTORING_LAYERS, type ProctoringSeverity } from "@/services/proctoring/layersCatalog";
import {
  AudioProctorMonitor,
  KeystrokeTracker,
  analyzeVideoFrame,
  calculateTotalForegroundTimeMs,
  captureCompressedJpeg,
  collectDeviceTelemetry,
  detectInitialVisibility,
} from "@/services/proctoring/detectors";
import {
  fetchProctorChat,
  finalizeProctoringAudit,
  recordProctoringSignal,
  sendProctorChat,
  sendProctorHeartbeat,
  uploadProctoringSnapshot,
  type ProctorChatMessage,
  type ReplayKeyframe,
} from "@/services/proctoring/proctoringService";

interface ProctoringExamContextValue {
  integrityScore: number;
  strikeCount: number;
  screenShareActive: boolean;
  openChat: () => void;
  openLayersModal: () => void;
  notifyQuestionChanged: (questionIndex: number) => void;
  notifyAnswerSaved: (opts: { questionIndex: number; latencyMs: number; typedChars?: number }) => void;
  sealSession: () => Promise<void>;
}

const ProctoringExamContext = createContext<ProctoringExamContextValue>({
  integrityScore: 100,
  strikeCount: 0,
  screenShareActive: false,
  openChat: () => undefined,
  openLayersModal: () => undefined,
  notifyQuestionChanged: () => undefined,
  notifyAnswerSaved: () => undefined,
  sealSession: async () => undefined,
});

export const useProctoringExam = () => useContext(ProctoringExamContext);

interface ProctoringExamShellProps {
  attemptId: string;
  assessmentTitle: string;
  initialIntegrityScore?: number;
  deviceFingerprint?: string;
  baselineHistogram?: number[] | null;
  noiseFloorDb?: number;
  onAutoInvalidate?: () => void;
  children: ReactNode;
}

export const ProctoringExamShell = ({
  attemptId,
  assessmentTitle,
  initialIntegrityScore = 100,
  deviceFingerprint: propFingerprint,
  baselineHistogram: propHistogram,
  noiseFloorDb = -48,
  onAutoInvalidate,
  children,
}: ProctoringExamShellProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const camStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const audioMonRef = useRef<AudioProctorMonitor | null>(null);
  const prevLumaRef = useRef<Uint8Array | null>(null);
  const keystrokeRef = useRef(new KeystrokeTracker());
  const startedAtRef = useRef(Date.now());
  const cooldownRef = useRef<Record<string, number>>({});
  const lastHiddenExitAtRef = useRef<number>(0);
  const hiddenAnswerCorrRef = useRef<number>(0);
  const fastAnswerCountRef = useRef<number>(0);
  const maxTypedCharsRef = useRef<number>(0);
  const keyframesRef = useRef<ReplayKeyframe[]>([
    { t: 0, label: "30-Layer Exam Lockdown Armed", layerId: 10, severity: "info" },
  ]);

  const [fingerprint, setFingerprint] = useState(propFingerprint || "initializing");
  const [integrity, setIntegrity] = useState(initialIntegrityScore);
  const [strikeCount, setStrikeCount] = useState(0);
  const [layerHits, setLayerHits] = useState<Record<number, number>>({});
  const [distractionBanner, setDistractionBanner] = useState<string | null>(null);
  const [windowBlurred, setWindowBlurred] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(() =>
    typeof document !== "undefined" ? Boolean(document.fullscreenElement) : true
  );
  const [camActive, setCamActive] = useState(false);
  const [faceOk, setFaceOk] = useState(true);
  const [micLevel, setMicLevel] = useState(0);
  const [screenShareActive, setScreenShareActive] = useState(false);
  const [hudMinimized, setHudMinimized] = useState(false);

  // Proctor Chat (Layer 20) & 30-Layer Matrix Drawer
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ProctorChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatSending, setChatSending] = useState(false);
  const [layersModalOpen, setLayersModalOpen] = useState(false);

  const baselineHist = useMemo(() => {
    if (propHistogram) return propHistogram;
    if (typeof sessionStorage !== "undefined") {
      try {
        const raw = sessionStorage.getItem(`proctor-hist-${attemptId}`);
        return raw ? (JSON.parse(raw) as number[]) : null;
      } catch {
        return null;
      }
    }
    return null;
  }, [attemptId, propHistogram]);

  const emitSignal = useCallback(
    async (
      layerId: number,
      code: string,
      severity: ProctoringSeverity,
      opts: {
        confidence?: number;
        cooldownMs?: number;
        bannerMessage?: string;
        captureFrame?: boolean;
        meta?: Record<string, unknown>;
      } = {}
    ) => {
      const now = Date.now();
      const key = `${layerId}:${code}`;
      const cd = opts.cooldownMs ?? 12000;
      if (cooldownRef.current[key] && now - cooldownRef.current[key] < cd) return;
      cooldownRef.current[key] = now;

      let snapshotUrl: string | null = null;
      let previewDataUrl: string | undefined;
      if (opts.captureFrame && videoRef.current) {
        const snap = await captureCompressedJpeg(videoRef.current, 320, 0.65);
        if (snap) {
          previewDataUrl = snap.dataUrl;
          snapshotUrl = await uploadProctoringSnapshot(attemptId, `L${layerId}-${code}`, snap.blob);
        }
      }

      const elapsedSec = Math.max(1, Math.round((now - startedAtRef.current) / 1000));
      keyframesRef.current = [
        ...keyframesRef.current.slice(-22),
        {
          t: elapsedSec,
          label: opts.bannerMessage || `${code.replace(/_/g, " ")} (Layer ${layerId})`,
          layerId,
          severity,
          snapshotPath: snapshotUrl ?? undefined,
          previewDataUrl,
        },
      ];

      if ((opts.confidence ?? 1) > 0) {
        setLayerHits((prev) => ({ ...prev, [layerId]: (prev[layerId] ?? 0) + 1 }));
        setStrikeCount((s) => s + 1);
        if (opts.bannerMessage) {
          setDistractionBanner(opts.bannerMessage);
        }
      }

      const updated = await recordProctoringSignal(attemptId, {
        layerId,
        code,
        severity,
        confidence: opts.confidence ?? 1,
        snapshotUrl,
        meta: opts.meta,
      });

      if (updated !== null) {
        setIntegrity(updated);
        if (updated < 40 && onAutoInvalidate) {
          toast.error("Assessment invalidated: Integrity score dropped below 40%.");
          onAutoInvalidate();
        }
      }
    },
    [attemptId, onAutoInvalidate]
  );

  // Boot camera, microphone, device telemetry & initial VisibilityStateEntry forensics
  useEffect(() => {
    let alive = true;

    (async () => {
      let stream: MediaStream | null = null;
      if (typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 480 }, height: { ideal: 360 }, facingMode: "user" },
            audio: true,
          });
          if (!alive) {
            stream.getTracks().forEach((t) => t.stop());
            return;
          }
          camStreamRef.current = stream;
          setCamActive(true);
          const mon = new AudioProctorMonitor(stream);
          mon.noiseFloorDb = noiseFloorDb;
          audioMonRef.current = mon;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            await videoRef.current.play().catch(() => undefined);
          }
        } catch {
          setCamActive(false);
        }
      }

      const dev = await collectDeviceTelemetry(stream);
      if (!alive) return;
      if (!propFingerprint) setFingerprint(dev.fingerprint);

      // Layer 10: Check initial background load via VisibilityStateEntry
      const visInfo = detectInitialVisibility();
      if (visInfo.initiallyBackgrounded) {
        void emitSignal(10, "opened_in_background_tab", "minor", {
          confidence: 0.5,
          cooldownMs: 60000,
          meta: { time_backgrounded_ms: visInfo.timeBackgrounded },
        });
      }

      // Layer 12: Multi-monitor extended desktop alert
      if (dev.isExtendedDisplay) {
        void emitSignal(12, "extended_display_detected", "medium", {
          confidence: 0.6,
          cooldownMs: 120000,
          bannerMessage: "Layer 12 Alert: Multiple displays detected. Keep focus strictly on primary screen.",
        });
      }
    })();

    return () => {
      alive = false;
      audioMonRef.current?.dispose();
      audioMonRef.current = null;
      camStreamRef.current?.getTracks().forEach((t) => t.stop());
      camStreamRef.current = null;
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
    };
  }, [emitSignal, noiseFloorDb, propFingerprint]);

  useEffect(() => {
    if (videoRef.current && camStreamRef.current && videoRef.current.srcObject !== camStreamRef.current) {
      videoRef.current.srcObject = camStreamRef.current;
      void videoRef.current.play().catch(() => undefined);
    }
  }, [hudMinimized, camActive]);

  // Layers 7, 8, 9, 26: Periodic Vision (Gaze, Multi-Face, Empty Chair, Lens Cover) + WebAudio Speech Monitor
  useEffect(() => {
    if (!camActive) return;
    let offGazeStreak = 0;
    let emptySeatStreak = 0;
    let speechStreak = 0;
    let tickCount = 0;

    const timer = setInterval(async () => {
      tickCount++;
      // Sample Web Audio (Layer 9)
      if (audioMonRef.current) {
        const audio = audioMonRef.current.sample();
        setMicLevel(audio.levelPct);
        if (audio.micMuted) {
          void emitSignal(9, "microphone_muted_or_unplugged", "medium", {
            confidence: 0.7,
            cooldownMs: 30000,
            bannerMessage: "Layer 9 Warning: Microphone stream muted or disconnected.",
          });
        } else if (audio.voiceDetected) {
          speechStreak++;
          if (speechStreak >= 3) {
            speechStreak = 0;
            void emitSignal(9, "background_speech_detected", "medium", {
              confidence: 0.75,
              cooldownMs: 22000,
              bannerMessage: "Layer 9 Alert: Sustained speech frequencies detected in room.",
              meta: { rms_db: audio.rmsDb, speech_ratio: audio.speechBandRatio },
            });
          }
        } else {
          speechStreak = Math.max(0, speechStreak - 1);
        }
      }

      // Sample Camera Vision (Layers 7 & 8)
      if (videoRef.current) {
        const v = await analyzeVideoFrame(videoRef.current, prevLumaRef.current, baselineHist);
        if (!v) return;
        prevLumaRef.current = v.lumaBuffer;
        setFaceOk(v.faceDetected && !v.lookingAway && !v.multipleFaces);

        if (v.lensCovered) {
          void emitSignal(8, "camera_lens_covered", "critical", {
            confidence: 0.85,
            cooldownMs: 20000,
            captureFrame: true,
            bannerMessage: "Layer 8 Critical: Camera lens appears obstructed or covered.",
          });
        } else if (v.multipleFaces) {
          void emitSignal(8, "multiple_faces_detected", "critical", {
            confidence: 0.9,
            cooldownMs: 20000,
            captureFrame: true,
            bannerMessage: "Layer 8 Critical: Multiple faces/persons detected in camera frame.",
          });
        } else if (!v.faceDetected) {
          emptySeatStreak++;
          if (emptySeatStreak >= 3) {
            emptySeatStreak = 0;
            void emitSignal(8, "candidate_left_frame", "medium", {
              confidence: 0.8,
              cooldownMs: 18000,
              captureFrame: true,
              bannerMessage: "Layer 8 Alert: Keep your face clearly visible inside the camera frame.",
            });
          }
        } else {
          emptySeatStreak = 0;
          if (v.lookingAway) {
            offGazeStreak++;
            if (offGazeStreak >= 3) {
              offGazeStreak = 0;
              void emitSignal(7, "sustained_gaze_aversion", "minor", {
                confidence: 0.8,
                cooldownMs: 16000,
                captureFrame: true,
                bannerMessage: "Layer 7 & 14 Alert: Sustained off-screen gaze detected.",
                meta: { gaze_x: v.gazeOffsetX, gaze_y: v.gazeOffsetY },
              });
            }
          } else {
            offGazeStreak = 0;
          }
        }

        // Layer 26: Periodic clean session replay keyframe every ~30s
        if (tickCount % 20 === 0) {
          const snap = await captureCompressedJpeg(videoRef.current, 240, 0.55);
          if (snap) {
            const path = await uploadProctoringSnapshot(attemptId, "keyframe", snap.blob);
            const sec = Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000));
            keyframesRef.current = [
              ...keyframesRef.current.slice(-22),
              {
                t: sec,
                label: "Routine Biometric Verification Frame",
                layerId: 26,
                severity: "info",
                snapshotPath: path ?? undefined,
                previewDataUrl: snap.dataUrl,
              },
            ];
          }
        }
      }
    }, 1500);

    return () => clearInterval(timer);
  }, [attemptId, baselineHist, camActive, emitSignal]);

  // Layers 10, 11, 14, 16, 18, 21: Browser Lockdown, Clipboard, Exit, DevTools & Screenshot Guards
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        setWindowBlurred(true);
        void emitSignal(10, "tab_hidden", "medium", {
          confidence: 1,
          cooldownMs: 4000,
          bannerMessage: "Layer 10 Violation: Tab switch / backgrounding logged on your audit ledger.",
        });
      } else {
        lastHiddenExitAtRef.current = Date.now();
        setWindowBlurred(false);
      }
    };

    const onBlur = () => {
      setWindowBlurred(true);
      void emitSignal(14, "window_focus_lost", "minor", {
        confidence: 0.8,
        cooldownMs: 8000,
        bannerMessage: "Layer 14 Distraction Alert: Exam window lost focus.",
      });
    };

    const onFocus = () => setWindowBlurred(false);

    const onFullscreen = () => {
      const fs = Boolean(document.fullscreenElement);
      setIsFullscreen(fs);
      if (!fs) {
        void emitSignal(18, "fullscreen_exit", "medium", {
          confidence: 0.9,
          cooldownMs: 6000,
          bannerMessage: "Layer 18 Exit Monitor: Fullscreen exited. Return to fullscreen immediately.",
        });
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      // Layer 21: PrintScreen & OS Screenshot shortcuts
      if (
        e.key === "PrintScreen" ||
        ((e.metaKey || e.ctrlKey) && e.shiftKey && ["s", "3", "4", "5"].includes(e.key.toLowerCase()))
      ) {
        e.preventDefault();
        setWindowBlurred(true);
        setTimeout(() => setWindowBlurred(false), 1800);
        void emitSignal(21, "screenshot_attempt_blocked", "critical", {
          confidence: 0.9,
          cooldownMs: 5000,
          captureFrame: true,
          bannerMessage: "Layer 21 Critical: Screen capture shortcut intercepted and logged.",
        });
        return;
      }

      // Layer 10: Block DevTools, Print, Save, View-Source
      const k = e.key.toLowerCase();
      if (
        e.key === "F12" ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && ["i", "j", "c"].includes(k)) ||
        ((e.ctrlKey || e.metaKey) && ["u", "p", "s"].includes(k))
      ) {
        e.preventDefault();
        void emitSignal(10, "devtools_or_print_shortcut", "medium", {
          confidence: 0.85,
          cooldownMs: 8000,
          bannerMessage: "Layer 10 Lockdown: Restricted browser shortcut blocked.",
        });
        return;
      }

      // Layer 11: Keystroke cadence analysis when typing inside inputs/textareas
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "TEXTAREA" || target.tagName === "INPUT")) {
        const { suspiciousBurst } = keystrokeRef.current.onKeyDown(e.key);
        if (suspiciousBurst) {
          void emitSignal(11, "robotic_keystroke_cadence", "medium", {
            confidence: 0.85,
            cooldownMs: 20000,
            bannerMessage: "Layer 11 Alert: Automated keystroke injection pattern flagged.",
          });
        }
      }
    };

    const onBeforeUnload = () => {
      void recordProctoringSignal(attemptId, {
        layerId: 18,
        code: "page_unload_exit_attempt",
        severity: "medium",
        confidence: 0.7,
      });
    };

    // DevTools docked outer/inner window dimension delta probe
    const devToolsTimer = setInterval(() => {
      const widthGap = window.outerWidth - window.innerWidth;
      const heightGap = window.outerHeight - window.innerHeight;
      if (widthGap > 220 || heightGap > 240) {
        void emitSignal(10, "devtools_panel_open", "critical", {
          confidence: 0.75,
          cooldownMs: 45000,
          bannerMessage: "Layer 10 Critical: Browser inspector / docked panel detected.",
        });
      }
    }, 8000);

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    document.addEventListener("fullscreenchange", onFullscreen);
    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      clearInterval(devToolsTimer);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("fullscreenchange", onFullscreen);
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [attemptId, emitSignal]);

  // Layer 12 (BroadcastChannel duplicate tab lock) & Layer 15 (20s Server Heartbeat + IP Drift)
  useEffect(() => {
    let bc: BroadcastChannel | null = null;
    const tabToken = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    if (typeof BroadcastChannel !== "undefined") {
      bc = new BroadcastChannel(`talento-exam-${attemptId}`);
      bc.onmessage = (ev) => {
        if (ev.data?.tabToken && ev.data.tabToken !== tabToken) {
          void emitSignal(12, "duplicate_browser_tab", "critical", {
            confidence: 0.9,
            cooldownMs: 25000,
            bannerMessage: "Layer 12 Critical: Duplicate assessment tab detected. Close all other tabs.",
          });
        }
      };
      bc.postMessage({ tabToken, type: "tab_hello" });
    }

    const hbTimer = setInterval(async () => {
      if (!fingerprint || fingerprint === "initializing") return;
      const fgMs = calculateTotalForegroundTimeMs();
      const hb = await sendProctorHeartbeat(attemptId, fingerprint, {
        screen_share_active: screenShareActive,
        typing_metrics: keystrokeRef.current.getMetrics(maxTypedCharsRef.current),
        foreground_stats: {
          foreground_ms: fgMs,
          total_elapsed_ms: Date.now() - startedAtRef.current,
        },
        replay_keyframes: keyframesRef.current,
      });

      if (hb) {
        setIntegrity(hb.integrity_score);
        if (hb.device_conflict) {
          setDistractionBanner("Layer 12 Critical: Simultaneous login from a second device detected!");
        } else if (hb.ip_drift) {
          setDistractionBanner("Layer 15 Warning: Mid-session IP / VPN network change logged.");
        }
        if (hb.status === "invalidated" && onAutoInvalidate) {
          onAutoInvalidate();
        }
      }
    }, 20000);

    return () => {
      bc?.close();
      clearInterval(hbTimer);
    };
  }, [attemptId, emitSignal, fingerprint, onAutoInvalidate, screenShareActive]);

  // Layer 13: Optional Screen Recording / Monitor Share
  const handleStartScreenShare = async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getDisplayMedia) {
      toast.error("Screen sharing is not supported in this browser");
      return;
    }
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      screenStreamRef.current = displayStream;
      setScreenShareActive(true);
      toast.success("Layer 13 Screen Monitor active");
      const track = displayStream.getVideoTracks()[0];
      if (track) {
        track.onended = () => {
          setScreenShareActive(false);
          void emitSignal(13, "screen_share_stopped_mid_exam", "medium", {
            confidence: 0.75,
            cooldownMs: 10000,
            bannerMessage: "Layer 13 Alert: Screen sharing stopped before submission.",
          });
        };
      }
    } catch {
      toast.error("Screen share cancelled");
    }
  };

  // Layer 20: Live Proctor Support Chat
  useEffect(() => {
    if (!chatOpen) return;
    void fetchProctorChat(attemptId).then(setChatMessages);
  }, [attemptId, chatOpen]);

  const handleSendChat = async () => {
    if (!chatInput.trim() || chatSending) return;
    setChatSending(true);
    try {
      const res = await sendProctorChat(attemptId, chatInput);
      if (res) {
        setChatMessages((prev) => [...prev, res.candidateMessage, res.proctorReply]);
        setChatInput("");
      }
    } catch (e) {
      toast.error((e as Error)?.message || "Could not send message");
    } finally {
      setChatSending(false);
    }
  };

  // Context methods for exam question navigation, timing, and final seal
  const notifyQuestionChanged = useCallback((questionIndex: number) => {
    const sec = Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000));
    keyframesRef.current = [
      ...keyframesRef.current.slice(-22),
      { t: sec, label: `Navigated to Question ${questionIndex + 1}`, layerId: 17, severity: "info" },
    ];
  }, []);

  const notifyAnswerSaved = useCallback(
    ({ questionIndex, latencyMs, typedChars }: { questionIndex: number; latencyMs: number; typedChars?: number }) => {
      if (typeof typedChars === "number") {
        maxTypedCharsRef.current = Math.max(maxTypedCharsRef.current, typedChars);
        const { injectedBlock } = keystrokeRef.current.onTextChange(typedChars);
        if (injectedBlock) {
          void emitSignal(11, "bulk_text_injection", "medium", {
            confidence: 0.85,
            cooldownMs: 10000,
            bannerMessage: "Layer 11 Alert: Sudden multi-sentence text injection detected.",
          });
        }
      }

      // Layer 17: Ultra-fast (<1.2s) rapid answer anomaly or immediate post-tab-return answer
      if (latencyMs > 0 && latencyMs < 1200) {
        fastAnswerCountRef.current += 1;
        if (fastAnswerCountRef.current >= 3) {
          void emitSignal(17, "rapid_answer_timing_anomaly", "minor", {
            confidence: 0.7,
            cooldownMs: 25000,
            meta: { question: questionIndex + 1, latency_ms: latencyMs },
          });
        }
      }
      if (lastHiddenExitAtRef.current > 0 && Date.now() - lastHiddenExitAtRef.current < 4500) {
        hiddenAnswerCorrRef.current += 1;
      }
    },
    [emitSignal]
  );

  const sealSession = useCallback(async () => {
    const typing = keystrokeRef.current.getMetrics(maxTypedCharsRef.current);
    const fgMs = calculateTotalForegroundTimeMs();
    await finalizeProctoringAudit(attemptId, {
      keystroke_char_ratio: typing.keystrokeCharRatio,
      paste_burst_count: typing.pasteBurstCount,
      hidden_answer_correlations: hiddenAnswerCorrRef.current,
      fast_answer_count: fastAnswerCountRef.current,
      typing_metrics: typing,
      foreground_stats: {
        foreground_ms: fgMs,
        total_elapsed_ms: Date.now() - startedAtRef.current,
      },
      replay_keyframes: keyframesRef.current,
    });
  }, [attemptId]);

  const ctxValue = useMemo<ProctoringExamContextValue>(
    () => ({
      integrityScore: integrity,
      strikeCount,
      screenShareActive,
      openChat: () => setChatOpen(true),
      openLayersModal: () => setLayersModalOpen(true),
      notifyQuestionChanged,
      notifyAnswerSaved,
      sealSession,
    }),
    [integrity, notifyAnswerSaved, notifyQuestionChanged, screenShareActive, sealSession, strikeCount]
  );

  const restoreFullscreen = async () => {
    if (document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen().catch(() => undefined);
    }
    setDistractionBanner(null);
  };

  return (
    <ProctoringExamContext.Provider value={ctxValue}>
      {/* Layer 21: Print / Save-as-PDF Blocker */}
      <style>{`@media print { body * { visibility: hidden !important; } }`}</style>

      <div
        className="relative min-h-screen select-none"
        onCopy={(e) => {
          e.preventDefault();
          void emitSignal(16, "copy_blocked", "minor", {
            confidence: 0.7,
            cooldownMs: 8000,
            bannerMessage: "Layer 16 Block: Copying exam content is disabled.",
          });
        }}
        onCut={(e) => {
          e.preventDefault();
          void emitSignal(16, "cut_blocked", "minor", { confidence: 0.7, cooldownMs: 8000 });
        }}
        onPaste={(e) => {
          e.preventDefault();
          void emitSignal(16, "paste_blocked", "minor", {
            confidence: 0.85,
            cooldownMs: 6000,
            bannerMessage: "Layer 16 Block: Clipboard paste is blocked and logged.",
          });
        }}
        onDrop={(e) => {
          e.preventDefault();
          void emitSignal(16, "drag_drop_blocked", "minor", { confidence: 0.7, cooldownMs: 8000 });
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          void emitSignal(16, "context_menu_blocked", "minor", { confidence: 0.4, cooldownMs: 12000 });
        }}
      >
        {/* Layer 14 & 18: Distraction / Fullscreen Recovery Banner */}
        {(distractionBanner || !isFullscreen) && (
          <div className="sticky top-0 z-40 bg-[#002C66] text-white px-4 py-2.5 border-b border-white/15">
            <div className="container flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 font-medium">
                <AlertTriangle className="h-4 w-4 text-amber-300 shrink-0" />
                <span>
                  {distractionBanner || "Fullscreen lockdown is required during proctored assessments."}
                  {strikeCount > 0 ? ` · Flags logged: ${strikeCount}` : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {!isFullscreen && (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="h-7 text-xs gap-1.5"
                    onClick={() => void restoreFullscreen()}
                  >
                    <Maximize className="h-3.5 w-3.5" /> Return to Fullscreen
                  </Button>
                )}
                {distractionBanner && (
                  <button
                    type="button"
                    onClick={() => setDistractionBanner(null)}
                    className="px-2 py-1 rounded hover:bg-white/10 text-white/80"
                  >
                    Dismiss
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Layer 21: Subtle Forensic Session Watermark */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center overflow-hidden opacity-[0.03]"
        >
          <p className="font-mono text-2xl font-bold tracking-widest -rotate-12 whitespace-nowrap text-foreground">
            TALENTCIR PROCTORED · {attemptId.slice(0, 14).toUpperCase()} · {fingerprint.slice(0, 10).toUpperCase()}
          </p>
        </div>

        {/* Layer 21: Focus-Loss Instant Privacy Curtain (prevents background snipping tools) */}
        {windowBlurred && (
          <div className="fixed inset-0 z-40 backdrop-blur-md bg-background/80 flex items-center justify-center p-6 text-center">
            <div className="max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl">
              <ShieldAlert className="h-9 w-9 text-destructive mx-auto mb-3" />
              <h3 className="font-display text-lg font-bold mb-1">Exam Content Shielded</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Layer 21 Screenshot &amp; Focus Shield hid the assessment while this window was unfocused. Click below to resume immediately.
              </p>
              <Button onClick={() => setWindowBlurred(false)} className="w-full">
                Resume Proctored Session
              </Button>
            </div>
          </div>
        )}

        {/* Exam Content */}
        {children}

        {/* Floating 30-Layer Proctor PiP HUD */}
        <div className="fixed bottom-4 right-4 z-30 w-64 rounded-2xl border border-border bg-background shadow-xl overflow-hidden">
          <div className="px-3 py-2 bg-[#002C66] text-white flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-semibold">
              <Shield className="h-3.5 w-3.5 text-emerald-300" />
              Integrity {Math.round(integrity)}%
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                title="View 30 Active Layers"
                onClick={() => setLayersModalOpen(true)}
                className="p-1 rounded hover:bg-white/15"
              >
                <Layers className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                title="Proctor Live Support Chat"
                onClick={() => setChatOpen(true)}
                className="p-1 rounded hover:bg-white/15"
              >
                <MessagesSquare className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                title={hudMinimized ? "Expand Sensor Feed" : "Minimize Sensor Feed"}
                onClick={() => setHudMinimized((m) => !m)}
                className="p-1 rounded hover:bg-white/15"
              >
                {hudMinimized ? <Maximize2 className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {!hudMinimized && (
            <div className="p-2.5 space-y-2">
              <div className="relative h-28 rounded-xl bg-slate-950 overflow-hidden flex items-center justify-center">
                {camActive ? (
                  <>
                    <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
                    <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between px-2 py-0.5 rounded bg-slate-950/80 text-[10px] text-white">
                      <span className="flex items-center gap-1">
                        <Eye className={`h-3 w-3 ${faceOk ? "text-emerald-400" : "text-amber-400"}`} />
                        {faceOk ? "Gaze OK" : "Check Gaze"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Volume2 className="h-3 w-3" /> {micLevel}%
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-[11px] text-slate-300 px-3">
                    <Camera className="h-4 w-4 mx-auto mb-1 text-slate-400" />
                    Lockdown &amp; Keystroke Audit Active
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => (screenShareActive ? undefined : void handleStartScreenShare())}
                  className={`flex items-center justify-center gap-1 rounded-lg border px-2 py-1.5 text-[11px] font-semibold transition-colors ${
                    screenShareActive
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border hover:border-primary/40 text-foreground"
                  }`}
                >
                  <ScreenShare className="h-3 w-3" />
                  {screenShareActive ? "Screen Shared" : "Share Screen"}
                </button>
                <button
                  type="button"
                  onClick={() => setChatOpen(true)}
                  className="flex items-center justify-center gap-1 rounded-lg border border-border hover:border-primary/40 px-2 py-1.5 text-[11px] font-semibold text-foreground"
                >
                  <MessagesSquare className="h-3 w-3" /> Proctor Chat
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Layer 20: Slide-over Live Proctor Chat Drawer */}
        {chatOpen && (
          <div className="fixed inset-0 z-50 bg-foreground/40 flex justify-end">
            <div className="w-full max-w-md bg-background h-full border-l border-border flex flex-col">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">Layer 20 · Proctor Live Chat</p>
                  <h3 className="font-display text-base font-bold">{assessmentTitle}</h3>
                </div>
                <button type="button" onClick={() => setChatOpen(false)} className="p-1.5 rounded-lg border border-border">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.length === 0 && (
                  <div className="rounded-xl border border-border bg-secondary/40 p-4 text-xs text-muted-foreground leading-relaxed">
                    Need to report an accidental OS notification, doorbell interruption, or webcam flicker? Log a message here without exiting fullscreen—every note is attached to your session review.
                  </div>
                )}
                {chatMessages.map((m) => (
                  <div
                    key={m.id}
                    className={`rounded-xl p-3 text-xs leading-relaxed ${
                      m.sender === "candidate"
                        ? "ml-8 bg-primary text-primary-foreground"
                        : "mr-6 border border-border bg-secondary/50 text-foreground"
                    }`}
                  >
                    <p className="font-semibold mb-0.5 text-[10px] opacity-80">
                      {m.sender === "candidate" ? "You" : "Proctor Support"}
                    </p>
                    <p>{m.body}</p>
                  </div>
                ))}
              </div>

              <div className="p-3 border-t border-border flex gap-2">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void handleSendChat();
                  }}
                  placeholder="Describe technical or room issue..."
                  className="h-10 flex-1 rounded-xl border border-border px-3 text-xs bg-background outline-none focus:border-primary select-text"
                />
                <Button size="sm" className="h-10 px-3" disabled={chatSending} onClick={() => void handleSendChat()}>
                  {chatSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 30-Layer Live Verification Matrix Modal */}
        {layersModalOpen && (
          <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl max-h-[85vh] rounded-2xl bg-background border border-border flex flex-col overflow-hidden">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">Real-Time Telemetry</p>
                  <h3 className="font-display text-lg font-bold">30-Layer Proctoring Shield Status</h3>
                </div>
                <button type="button" onClick={() => setLayersModalOpen(false)} className="p-1.5 rounded-lg border border-border">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 grid sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {PROCTORING_LAYERS.map((layer) => {
                  const hits = layerHits[layer.id] ?? 0;
                  const stateLabel =
                    layer.phase === "before"
                      ? "Verified"
                      : layer.phase === "during"
                      ? hits > 0
                        ? `${hits} Flag${hits > 1 ? "s" : ""}`
                        : "Active"
                      : "Runs on Submit";
                  return (
                    <div key={layer.id} className="rounded-xl border border-border p-3 text-xs flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[10px] font-bold text-primary">L{layer.id} · {layer.phase.toUpperCase()}</p>
                        <p className="font-semibold text-foreground">{layer.label}</p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
                          hits > 0
                            ? "bg-destructive/10 text-destructive"
                            : layer.phase === "after"
                            ? "bg-secondary text-muted-foreground"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {hits === 0 && layer.phase !== "after" && <CheckCircle2 className="inline h-3 w-3 mr-0.5" />}
                        {stateLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </ProctoringExamContext.Provider>
  );
};
