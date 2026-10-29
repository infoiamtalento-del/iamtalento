import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Flag, ArrowLeft, ArrowRight, Clock, ShieldCheck, ShieldAlert,
  Minus, Plus, Check, Layers, MessagesSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAssessment, type Assessment } from "@/data/assessments";
import { LiveAssessmentJourney } from "@/components/assessment/LiveAssessmentJourney";
import { ProctoringExamShell, useProctoringExam } from "@/components/proctoring/ProctoringExamShell";
import { currentUserId, db } from "@/services/db";
import type { CatalogAssessment } from "@/services/candidate/assessments";

const parseMinutes = (d: string) => parseInt(d, 10) || 30;

const PracticalTask = ({ onComplete, complete }: { onComplete: () => void; complete: boolean }) => {
  const [qty, setQty] = useState(1);
  const [inCart, setInCart] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (inCart && qty === 2 && applied && !complete) onComplete();
  }, [inCart, qty, applied, complete, onComplete]);

  return (
    <div className="rounded-xl border border-border p-5 mb-6 bg-secondary/40">
      <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Practical task</p>
      <p className="text-sm font-semibold mb-4">
        Add the product to the cart, set the quantity to 2 and apply the coupon code <span className="text-primary">SAVE10</span>.
      </p>

      <div className="rounded-lg border border-border bg-background p-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-lg bg-secondary shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-sm">Wireless Noise-Cancelling Headphones</p>
            <p className="text-sm text-muted-foreground">₹4,999</p>
          </div>
          <Button size="sm" variant={inCart ? "secondary" : "default"} onClick={() => setInCart(true)}>
            {inCart ? "In cart" : "Add to cart"}
          </Button>
        </div>

        {inCart && (
          <div className="mt-4 pt-4 border-t border-border space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-sm">Quantity</span>
              <div className="flex items-center gap-2">
                <button className="h-7 w-7 rounded border border-border" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  <Minus className="h-3 w-3 mx-auto" />
                </button>
                <span className="w-6 text-center text-sm font-semibold">{qty}</span>
                <button className="h-7 w-7 rounded border border-border" onClick={() => setQty((q) => q + 1)}>
                  <Plus className="h-3 w-3 mx-auto" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                placeholder="Coupon code"
                className="h-9 flex-1 rounded border border-border px-3 text-sm outline-none focus:border-primary/50 bg-background select-text"
              />
              <Button size="sm" variant="outline" onClick={() => setApplied(coupon === "SAVE10")}>
                Apply
              </Button>
            </div>
            {applied && (
              <p className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                <Check className="h-3.5 w-3.5" /> Coupon applied
              </p>
            )}
          </div>
        )}
      </div>

      {complete && (
        <p className="flex items-center gap-1.5 text-xs font-semibold text-primary mt-3">
          <Check className="h-4 w-4" /> Task completed
        </p>
      )}
    </div>
  );
};

const StaticAssessmentBody = ({ a, localAttemptId }: { a: Assessment; localAttemptId: string }) => {
  const navigate = useNavigate();
  const { integrityScore, openChat, openLayersModal, notifyQuestionChanged, notifyAnswerSaved, sealSession } =
    useProctoringExam();

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [flags, setFlags] = useState<Record<number, boolean>>({});
  const [taskDone, setTaskDone] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [seconds, setSeconds] = useState(() => parseMinutes(a.duration ?? "30 min") * 60);
  const shownAtRef = useRef(Date.now());
  const submittedRef = useRef(false);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    shownAtRef.current = Date.now();
    notifyQuestionChanged(current);
  }, [current, notifyQuestionChanged]);

  const answeredCount = Object.keys(answers).length;
  const flagCount = Object.values(flags).filter(Boolean).length;

  const mmss = useMemo(() => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, [seconds]);

  const submit = useCallback(async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    await sealSession();
    if (typeof document !== "undefined" && document.fullscreenElement) {
      void document.exitFullscreen().catch(() => undefined);
    }

    const correct = a.questions.reduce((n, qq, i) => (answers[i] === qq.answer ? n + 1 : n), 0);
    const bonus = a.type !== "Knowledge" && taskDone ? 1 : 0;
    const score = Math.round(((correct + bonus) / (a.questions.length + (a.type !== "Knowledge" ? 1 : 0))) * 100);
    const perSkill: Record<string, { c: number; t: number }> = {};
    a.questions.forEach((qq, i) => {
      perSkill[qq.skill] = perSkill[qq.skill] ?? { c: 0, t: 0 };
      perSkill[qq.skill].t += 1;
      if (answers[i] === qq.answer) perSkill[qq.skill].c += 1;
    });
    sessionStorage.setItem(
      `cir-${a.id}`,
      JSON.stringify({
        score,
        answered: answeredCount,
        flagged: flagCount,
        total: a.questions.length,
        attemptId: localAttemptId,
        integrityScore: Math.round(integrityScore * 10) / 10,
        skills: Object.entries(perSkill).map(([skill, v]) => ({
          skill,
          pct: Math.round((v.c / v.t) * 100),
        })),
        completedAt: new Date().toISOString(),
      })
    );
    navigate(`/assessments/${a.id}/result`);
  }, [a, answeredCount, answers, flagCount, integrityScore, localAttemptId, navigate, sealSession, taskDone]);

  useEffect(() => {
    if (seconds === 0) void submit();
  }, [seconds, submit]);

  const q = a.questions[current];
  const isLast = current === a.questions.length - 1;
  const showTask = a.type !== "Knowledge" && current === 0;

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col pb-24">
      <header className="sticky top-0 z-20 bg-background border-b border-border">
        <div className="container h-16 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="font-display font-bold text-sm md:text-base truncate">{a.title}</p>
            <p className="text-xs text-muted-foreground">
              Question {current + 1} / {a.questions.length}
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={openLayersModal}
              className={`hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border ${
                integrityScore >= 70
                  ? "border-primary/30 bg-primary/5 text-primary"
                  : "border-destructive/30 bg-destructive/10 text-destructive"
              }`}
            >
              {integrityScore >= 70 ? <ShieldCheck className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
              30-Layer Integrity {Math.round(integrityScore)}%
            </button>
            <button
              type="button"
              onClick={openChat}
              className="hidden md:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-border hover:border-primary/40"
            >
              <MessagesSquare className="h-3.5 w-3.5 text-primary" /> Proctor Chat
            </button>
            <span className="flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-lg bg-primary/10 text-primary">
              <Clock className="h-4 w-4" /> {mmss}
            </span>
          </div>
        </div>
        <div className="h-1 bg-secondary">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${((current + 1) / a.questions.length) * 100}%` }}
          />
        </div>
      </header>

      <main className="container flex-1 py-8 grid lg:grid-cols-[minmax(0,1fr)_260px] gap-6 items-start">
        <div className="rounded-xl border border-border bg-background p-6 md:p-8">
          {showTask && <PracticalTask complete={taskDone} onComplete={() => setTaskDone(true)} />}

          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">{q.skill}</p>
              <h2 className="font-display text-lg md:text-xl font-bold leading-snug">{q.prompt}</h2>
            </div>
            <button
              onClick={() => setFlags((f) => ({ ...f, [current]: !f[current] }))}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border shrink-0 transition-colors ${
                flags[current] ? "bg-primary/10 text-primary border-primary/30" : "border-border text-muted-foreground"
              }`}
            >
              <Flag className="h-3.5 w-3.5" /> {flags[current] ? "Flagged" : "Flag"}
            </button>
          </div>

          <div className="space-y-2.5">
            {q.options.map((o, i) => {
              const selected = answers[current] === i;
              return (
                <button
                  key={o}
                  onClick={() => {
                    notifyAnswerSaved({
                      questionIndex: current,
                      latencyMs: Date.now() - shownAtRef.current,
                    });
                    setAnswers((p) => ({ ...p, [current]: i }));
                  }}
                  className={`w-full text-left flex items-start gap-3 rounded-xl border p-4 text-sm transition-colors ${
                    selected ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                  }`}
                >
                  <span
                    className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      selected ? "border-primary bg-primary text-primary-foreground" : "border-border"
                    }`}
                  >
                    {selected && <Check className="h-3 w-3" />}
                  </span>
                  {o}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-3 mt-7 pt-6 border-t border-border">
            <Button variant="outline" disabled={current === 0} onClick={() => setCurrent((c) => c - 1)} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Previous
            </Button>
            {isLast ? (
              <Button onClick={() => setConfirming(true)} className="gap-2">
                Review &amp; Submit <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={() => setCurrent((c) => c + 1)} className="gap-2">
                Save &amp; Next <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <aside className="rounded-xl border border-border bg-background p-5 w-full space-y-4">
          <div>
            <p className="text-sm font-semibold mb-3">Question navigator</p>
            <div className="grid grid-cols-5 gap-2 mb-4">
              {a.questions.map((_, i) => {
                const answered = answers[i] !== undefined;
                const flagged = flags[i];
                return (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-9 rounded-lg text-xs font-bold border transition-colors ${
                      i === current
                        ? "border-primary bg-primary text-primary-foreground"
                        : flagged
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : answered
                        ? "border-border bg-secondary text-foreground"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </button>
                );
              })}
            </div>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>{answeredCount} answered</li>
              <li>{flagCount} flagged</li>
              <li>{a.questions.length - answeredCount} unanswered</li>
            </ul>
          </div>

          <Button variant="outline" className="w-full gap-1.5 text-xs" onClick={openLayersModal}>
            <Layers className="h-3.5 w-3.5" /> 30 Active Layers
          </Button>
          <Button variant="outline" className="w-full" onClick={() => setConfirming(true)}>
            Submit Assessment
          </Button>
        </aside>
      </main>

      {confirming && (
        <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-5">
          <div className="w-full max-w-md rounded-2xl bg-background p-7">
            <h3 className="font-display text-xl font-bold mb-2">Submit &amp; Seal 30-Layer Audit?</h3>
            <p className="text-sm text-muted-foreground mb-5">
              Submitting finalizes your answers and executes Post-Assessment Layers 23–30.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                ["Total", a.questions.length],
                ["Answered", answeredCount],
                ["Flagged", flagCount],
                ["Unanswered", a.questions.length - answeredCount],
              ].map(([l, v]) => (
                <div key={l as string} className="rounded-xl border border-border p-3 text-center">
                  <p className="font-display text-xl font-bold">{v as number}</p>
                  <p className="text-xs text-muted-foreground">{l as string}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setConfirming(false)}>
                Keep Going
              </Button>
              <Button className="flex-1" onClick={() => void submit()}>
                Submit Assessment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StaticAssessmentTest = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const a = getAssessment(assessmentId);

  if (!a) {
    return (
      <div className="container py-24 text-center">
        <p className="mb-4">Assessment not found.</p>
        <Button asChild>
          <Link to="/assessments/explore">Back to assessments</Link>
        </Button>
      </div>
    );
  }

  const localAttemptId = `local-${a.id}`;
  let precheckData: { deviceFingerprint?: string; baselineHistogram?: number[] | null; noiseFloorDb?: number } = {};
  if (typeof sessionStorage !== "undefined") {
    try {
      const raw = sessionStorage.getItem(`proctor-precheck-${a.id}`);
      if (raw) precheckData = JSON.parse(raw);
    } catch {
      precheckData = {};
    }
  }

  return (
    <>
      <Helmet>
        <title>{a.title} | 30-Layer Proctored Assessment</title>
      </Helmet>
      <ProctoringExamShell
        attemptId={localAttemptId}
        assessmentTitle={a.title}
        deviceFingerprint={precheckData.deviceFingerprint}
        baselineHistogram={precheckData.baselineHistogram}
        noiseFloorDb={precheckData.noiseFloorDb}
        onAutoInvalidate={() => navigate(`/assessments/${a.id}/result`)}
      >
        <StaticAssessmentBody a={a} localAttemptId={localAttemptId} />
      </ProctoringExamShell>
    </>
  );
};

/**
 * Signed-in candidates take server-graded, 30-layer proctored tests when the assessment exists in
 * the database. Everyone else (guests, demo accounts, not-yet-migrated tests) runs the same 30-layer
 * engine backed by a local SHA-256 hash-chained session ledger.
 */
const AssessmentTest = () => {
  const { assessmentId } = useParams();
  const [mode, setMode] = useState<"loading" | "live" | "static">("loading");
  const [live, setLive] = useState<CatalogAssessment | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const uid = await currentUserId();
        if (!uid || !assessmentId) return alive && setMode("static");
        const { data } = await db
          .from("assessments_catalog")
          .select("*")
          .eq("slug", assessmentId)
          .eq("kind", "domain")
          .eq("is_active", true)
          .maybeSingle();
        if (!alive) return;
        if (data) {
          setLive(data as CatalogAssessment);
          setMode("live");
        } else {
          setMode("static");
        }
      } catch {
        if (alive) setMode("static");
      }
    })();
    return () => {
      alive = false;
    };
  }, [assessmentId]);

  if (mode === "loading") return <div className="min-h-screen" />;
  if (mode === "live" && live) return <LiveAssessmentJourney assessment={live} />;
  return <StaticAssessmentTest />;
};

export default AssessmentTest;
