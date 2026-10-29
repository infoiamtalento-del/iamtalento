import { useEffect, useMemo, useState } from "react";
import {
  ShieldCheck, ShieldAlert, Award, Lock, Bot, BrainCircuit, Code2, Video,
  FileText, ChevronDown, ChevronUp, CheckCircle2, AlertTriangle, Loader2, Play,
} from "lucide-react";
import { PROCTORING_LAYERS, computeIntegrityGrade } from "@/services/proctoring/layersCatalog";
import {
  fetchProctoringDossier,
  getSignedSnapshotUrl,
  type ProctoringDossier,
  type ReplayKeyframe,
} from "@/services/proctoring/proctoringService";

interface ProctoringAuditDossierProps {
  attemptId?: string | null;
  fallbackScore?: number | null;
}

const fmtSec = (sec: number) =>
  `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(Math.max(0, Math.round(sec % 60))).padStart(2, "0")}`;

export const ProctoringAuditDossier = ({ attemptId, fallbackScore = 100 }: ProctoringAuditDossierProps) => {
  const [dossier, setDossier] = useState<ProctoringDossier | null>(null);
  const [loading, setLoading] = useState(Boolean(attemptId));
  const [showAllLayers, setShowAllLayers] = useState(false);
  const [selectedFrameIdx, setSelectedFrameIdx] = useState(0);
  const [signedPreview, setSignedPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!attemptId) {
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);
    fetchProctoringDossier(attemptId)
      .then((d) => {
        if (alive) setDossier(d);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [attemptId]);

  const score = Math.round((dossier?.integrity_score ?? fallbackScore ?? 100) * 10) / 10;
  const aiRisk = Math.round(Number(dossier?.session?.ai_anomaly_score ?? 0));
  const chatgptRisk = Math.round(Number(dossier?.session?.chatgpt_risk_score ?? 0));
  const plagPct = Math.round(Number(dossier?.session?.plagiarism_max_sim ?? 0) * 100);
  const chainValid = dossier?.chain?.valid ?? true;
  const { grade, verdict } = useMemo(
    () =>
      dossier?.integrity_grade
        ? {
            grade: dossier.integrity_grade,
            verdict: computeIntegrityGrade(score, aiRisk, chatgptRisk, plagPct, chainValid).verdict,
          }
        : computeIntegrityGrade(score, aiRisk, chatgptRisk, plagPct, chainValid),
    [aiRisk, chainValid, chatgptRisk, dossier?.integrity_grade, plagPct, score]
  );

  const replayItems = useMemo<ReplayKeyframe[]>(() => {
    const kf = dossier?.session?.replay_keyframes ?? [];
    if (kf.length > 0) return kf;
    const evs = dossier?.events ?? [];
    return evs.map((e, idx) => ({
      t: idx * 15,
      label: `${e.signal_code.replace(/_/g, " ")} (L${e.layer_id})`,
      layerId: e.layer_id,
      severity: e.confidence > 0 ? e.severity : ("info" as const),
      snapshotPath: e.snapshot_url ?? undefined,
    }));
  }, [dossier]);

  const activeFrame = replayItems[selectedFrameIdx] ?? null;

  useEffect(() => {
    let alive = true;
    setSignedPreview(null);
    if (!activeFrame) return;
    if (activeFrame.previewDataUrl) {
      setSignedPreview(activeFrame.previewDataUrl);
      return;
    }
    if (activeFrame.snapshotPath) {
      void getSignedSnapshotUrl(activeFrame.snapshotPath).then((url) => {
        if (alive && url) setSignedPreview(url);
      });
    }
    return () => {
      alive = false;
    };
  }, [activeFrame]);

  const flaggedLayers = useMemo(() => {
    const map = new Map<number, number>();
    for (const ev of dossier?.events ?? []) {
      if (ev.confidence > 0) {
        map.set(ev.layer_id, (map.get(ev.layer_id) ?? 0) + 1);
      }
    }
    return map;
  }, [dossier?.events]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-background p-6 flex items-center gap-3 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        Verifying 30-layer cryptographic audit trail &amp; post-assessment AI diagnostics...
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-background p-6 md:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
            30-Layer Proctoring · Post-Assessment Forensic Dossier (Layers 23–30)
          </p>
          <h3 className="font-display text-xl font-bold text-foreground">
            Session Integrity &amp; Cryptographic Verification
          </h3>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
            score >= 70 && chainValid
              ? "border-primary/30 bg-primary/10 text-primary"
              : "border-destructive/30 bg-destructive/10 text-destructive"
          }`}
        >
          {score >= 70 && chainValid ? <ShieldCheck className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
          Grade {grade} · {verdict}
        </span>
      </div>

      {/* Top 4 KPI Cards (Layers 27, 28, 29, 30) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border p-4">
          <p className="text-[11px] font-semibold text-muted-foreground">L27 · Integrity Score</p>
          <p className="font-display text-2xl font-bold text-foreground mt-1">{score}%</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Composite across 30 layers</p>
        </div>
        <div className="rounded-xl border border-border p-4">
          <p className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
            <Award className="h-3.5 w-3.5 text-primary" /> L29 · Trust Grade
          </p>
          <p className="font-display text-2xl font-bold text-primary mt-1">{grade}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{verdict}</p>
        </div>
        <div className="rounded-xl border border-border p-4">
          <p className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
            <Lock className="h-3.5 w-3.5 text-primary" /> L28 · SHA-256 Chain
          </p>
          <p className="font-display text-base font-bold text-foreground mt-1.5">
            {chainValid ? "Tamper-Proof" : "Broken Chain"}
          </p>
          <p className="text-[11px] font-mono text-muted-foreground mt-0.5 truncate">
            {dossier?.chain?.event_count ?? 0} blocks · {(dossier?.chain?.head_hash ?? "GENESIS").slice(0, 12)}
          </p>
        </div>
        <div className="rounded-xl border border-border p-4">
          <p className="text-[11px] font-semibold text-muted-foreground">L30 · Post-Test Seal</p>
          <p className="font-display text-base font-bold text-foreground mt-1.5">
            {dossier?.session?.collusion_flag ? "Overlap Flagged" : "Zero Collusion"}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            IP drifts: {dossier?.session?.ip_drift_count ?? 0} · Chat: {dossier?.chat_messages_count ?? 0}
          </p>
        </div>
      </div>

      {/* Layers 23, 24, 25: Post-Test ML, ChatGPT & Plagiarism Analyzers */}
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          {
            layer: "L23 · AI Cheating Detection",
            icon: BrainCircuit,
            risk: aiRisk,
            cleanText: "Authentic Timing & Focus",
            flagText: "Suspicious Pattern Cluster",
          },
          {
            layer: "L24 · ChatGPT / LLM Detection",
            icon: Bot,
            risk: chatgptRisk,
            cleanText: "Human Keystroke & Style",
            flagText: "LLM Stylometry Risk",
          },
          {
            layer: "L25 · Plagiarism Cross-Check",
            icon: Code2,
            risk: plagPct,
            cleanText: "Original Submission",
            flagText: "High Source Overlap",
          },
        ].map((item) => {
          const Icon = item.icon;
          const flagged = item.risk >= 60;
          return (
            <div key={item.layer} className="rounded-xl border border-border p-4">
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="flex items-center gap-1.5">
                  <Icon className="h-4 w-4 text-primary" /> {item.layer}
                </span>
                <span className={flagged ? "text-destructive font-bold" : "text-primary font-bold"}>
                  {item.risk}% risk
                </span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full ${flagged ? "bg-destructive" : "bg-primary"}`}
                  style={{ width: `${Math.max(4, Math.min(100, 100 - item.risk))}%` }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                {flagged ? item.flagText : item.cleanText}
              </p>
            </div>
          );
        })}
      </div>

      {/* Layer 26: Full Session Replay Timeline & Keyframe Scrubber */}
      {replayItems.length > 0 && (
        <div className="rounded-xl border border-border bg-secondary/30 p-4">
          <div className="flex items-center justify-between gap-2 mb-3">
            <p className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Video className="h-4 w-4" /> Layer 26 · Session Replay &amp; Keyframe Audit ({replayItems.length} markers)
            </p>
            {activeFrame && (
              <span className="text-xs font-mono text-muted-foreground">T+{fmtSec(activeFrame.t)}</span>
            )}
          </div>

          <div className="grid md:grid-cols-[200px_minmax(0,1fr)] gap-4 items-center">
            <div className="h-28 rounded-xl bg-slate-950 flex items-center justify-center overflow-hidden border border-border">
              {signedPreview ? (
                <img src={signedPreview} alt="Session replay keyframe" className="h-full w-full object-cover" />
              ) : (
                <div className="text-center px-3 text-[11px] text-slate-300">
                  <Play className="h-4 w-4 mx-auto mb-1 text-emerald-400" />
                  {activeFrame?.label || "Audit Marker"}
                </div>
              )}
            </div>

            <div className="space-y-2.5">
              <input
                type="range"
                min={0}
                max={Math.max(0, replayItems.length - 1)}
                value={selectedFrameIdx}
                onChange={(e) => setSelectedFrameIdx(Number(e.target.value))}
                className="w-full accent-[#002C66]"
              />
              {activeFrame && (
                <div className="flex items-center justify-between text-xs rounded-lg bg-background border border-border px-3 py-2">
                  <span className="font-semibold truncate">{activeFrame.label}</span>
                  <span className="text-[11px] text-muted-foreground shrink-0 ml-2">
                    Layer {activeFrame.layerId ?? 26} · {fmtSec(activeFrame.t)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Expandable Full 30-Layer Audit Checklist */}
      <div>
        <button
          type="button"
          onClick={() => setShowAllLayers((s) => !s)}
          className="w-full flex items-center justify-between rounded-xl border border-border px-4 py-3 text-xs font-semibold hover:bg-secondary/40 transition-colors"
        >
          <span className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Inspect Complete 30-Layer Verification Ledger (6 Before · 16 During · 8 After)
          </span>
          {showAllLayers ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {showAllLayers && (
          <div className="mt-3 grid sm:grid-cols-2 md:grid-cols-3 gap-2">
            {PROCTORING_LAYERS.map((l) => {
              const flags = flaggedLayers.get(l.id) ?? 0;
              return (
                <div key={l.id} className="rounded-lg border border-border px-3 py-2.5 flex items-center justify-between gap-2 text-xs">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-muted-foreground">L{l.id} · {l.phase.toUpperCase()}</p>
                    <p className="font-semibold truncate">{l.label}</p>
                  </div>
                  {flags > 0 ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-[10px] font-bold shrink-0">
                      <AlertTriangle className="h-3 w-3" /> {flags}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold shrink-0">
                      <CheckCircle2 className="h-3 w-3" /> Clean
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
