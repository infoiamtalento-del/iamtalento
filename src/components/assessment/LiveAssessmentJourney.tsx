import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Check, Clock, Flag, Lock, ShieldCheck, ShieldAlert, ArrowLeft, ArrowRight,
  Loader2, Award, Layers, MessagesSquare, Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  fetchActiveJourneys, generateCir, getAttemptQuestions, getJourneyProgress, saveResponse,
  signCredential, startAttempt, startJourney, submitAttempt,
  type Attempt, type AttemptQuestion, type CatalogAssessment, type CirReport, type Journey, type JourneyStep,
} from "@/services/candidate/assessments";
import {
  createOrder, fetchWallet, payOrderWithWallet, payWithRazorpay, validateCoupon, type PaymentOrder,
} from "@/services/candidate/wallet";
import { backendErrorMessage } from "@/hooks/useCandidateBackend";
import { ProctoringPreCheckGate, type PreCheckCompletionData } from "@/components/proctoring/ProctoringPreCheckGate";
import { ProctoringExamShell, useProctoringExam } from "@/components/proctoring/ProctoringExamShell";
import { ProctoringAuditDossier } from "@/components/proctoring/ProctoringAuditDossier";

const GST = 0.18;
const inr = (n: number) => "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

/* ------------------------------------------------------------------ */
/* Step 1: purchase (skipped for free tests)                           */
/* ------------------------------------------------------------------ */
const Checkout = ({ assessment, onStarted }: { assessment: CatalogAssessment; onStarted: (j: Journey) => void }) => {
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState<string | null>(null);
  const [state, setState] = useState("");
  const [wallet, setWallet] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const price = Number(assessment.price_inr);

  useEffect(() => { fetchWallet().then((w) => setWallet(w?.bal ?? null)).catch(() => setWallet(null)); }, []);

  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    const r = await validateCoupon(coupon, "assessment_journey", price).catch((e) => ({ valid: false, discount: 0, message: backendErrorMessage(e) }));
    setDiscount(r.valid ? Number(r.discount) : 0);
    setCouponMsg(r.message);
  };

  const taxable = Math.max(price - discount, 0);
  const total = Math.round(taxable * (1 + GST) * 100) / 100;

  const begin = async (method: "wallet" | "razorpay") => {
    setBusy(true);
    try {
      if (price === 0) return onStarted(await startJourney(assessment.id));
      let order: PaymentOrder = await createOrder({
        itemType: "assessment_journey", itemId: assessment.id, couponCode: coupon || undefined,
        buyerState: state || undefined, gateway: method,
      });
      if (order.status !== "entitled") {
        order = method === "wallet" ? await payOrderWithWallet(order.id) : await payWithRazorpay(order);
      }
      onStarted(await startJourney(assessment.id, order.id));
    } catch (e) {
      toast.error(backendErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto rounded-2xl border border-border bg-background p-7">
      <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Your assessment journey</p>
      <h2 className="font-display text-2xl font-bold mb-1">{assessment.title}</h2>
      <p className="text-sm text-muted-foreground mb-5">
        4 mandatory core tests, then this domain test, protected by 30-Layer AI Proctoring, followed by your Career Intelligence Report.
      </p>
      {price > 0 && (
        <>
          <div className="flex gap-2 mb-2">
            <input value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} placeholder="Coupon code"
              className="h-10 flex-1 rounded-lg border border-border px-3 text-sm bg-background" />
            <Button variant="outline" onClick={applyCoupon}>Apply</Button>
          </div>
          {couponMsg && <p className={`text-xs mb-3 ${discount ? "text-primary" : "text-destructive"}`}>{couponMsg}</p>}
          <input value={state} onChange={(e) => setState(e.target.value)} placeholder="Your state (for CGST/SGST vs IGST)"
            className="h-10 w-full rounded-lg border border-border px-3 text-sm bg-background mb-4" />
          <dl className="text-sm space-y-1.5 border-t border-border pt-4 mb-5">
            <div className="flex justify-between"><dt>Assessment</dt><dd>{inr(price)}</dd></div>
            {discount > 0 && <div className="flex justify-between text-primary"><dt>Coupon</dt><dd>-{inr(discount)}</dd></div>}
            <div className="flex justify-between text-muted-foreground"><dt>GST 18% (final split computed securely)</dt><dd>{inr(taxable * GST)}</dd></div>
            <div className="flex justify-between font-bold text-base pt-1"><dt>Total</dt><dd>{inr(total)}</dd></div>
          </dl>
        </>
      )}
      <div className="flex flex-col sm:flex-row gap-3">
        {price === 0 ? (
          <Button className="flex-1" disabled={busy} onClick={() => begin("razorpay")}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Start journey (free)"}
          </Button>
        ) : (
          <>
            <Button className="flex-1" disabled={busy} onClick={() => begin("razorpay")}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : `Pay ${inr(total)}`}
            </Button>
            <Button variant="outline" className="flex-1" disabled={busy || wallet === null || wallet < total} onClick={() => begin("wallet")}>
              Use wallet{wallet !== null ? ` (${inr(wallet)})` : ""}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Step 3: 30-Layer Proctored Attempt Runner                           */
/* ------------------------------------------------------------------ */
const AttemptRunnerBody = ({
  attempt,
  title,
  onDone,
}: {
  attempt: Attempt;
  title: string;
  onDone: () => void;
}) => {
  const { integrityScore, openChat, openLayersModal, notifyQuestionChanged, notifyAnswerSaved, sealSession } =
    useProctoringExam();
  const [questions, setQuestions] = useState<AttemptQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, Record<string, unknown>>>({});
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [current, setCurrent] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(() =>
    Math.max(0, Math.floor((new Date(attempt.server_expires_at).getTime() - Date.now()) / 1000))
  );
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const shownAt = useRef(Date.now());
  const submitted = useRef(false);

  useEffect(() => {
    getAttemptQuestions(attempt.id)
      .then((qs) => {
        setQuestions(qs);
        setAnswers(
          Object.fromEntries(
            qs.filter((q) => q.saved_response).map((q) => [q.question_id, q.saved_response as Record<string, unknown>])
          )
        );
      })
      .catch((e) => toast.error(backendErrorMessage(e)));
  }, [attempt.id]);

  const finish = useCallback(async () => {
    if (submitted.current) return;
    submitted.current = true;
    setSubmitting(true);
    try {
      await submitAttempt(attempt.id);
      await sealSession();
    } catch (e) {
      toast.error(backendErrorMessage(e));
    }
    onDone();
  }, [attempt.id, onDone, sealSession]);

  useEffect(() => {
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (secondsLeft === 0 && questions.length) void finish();
  }, [secondsLeft, questions.length, finish]);

  const q = questions[current];
  useEffect(() => {
    shownAt.current = Date.now();
    notifyQuestionChanged(current);
  }, [current, notifyQuestionChanged]);

  const answer = (value: Record<string, unknown>) => {
    if (!q) return;
    const latency = Date.now() - shownAt.current;
    setAnswers((p) => ({ ...p, [q.question_id]: value }));
    const typedText = typeof value.text === "string" ? value.text : undefined;
    notifyAnswerSaved({
      questionIndex: current,
      latencyMs: latency,
      typedChars: typedText?.length,
    });
    saveResponse(attempt.id, q.question_id, value, latency).catch((e) => toast.error(backendErrorMessage(e)));
  };

  const answered = questions.filter((x) => answers[x.question_id]).length;

  if (!q) return <div className="py-24 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>;
  const sel = answers[q.question_id];

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col pb-24">
      <header className="sticky top-0 z-20 bg-background border-b border-border">
        <div className="container h-16 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="font-display font-bold text-sm md:text-base truncate">{title}</p>
            <p className="text-xs text-muted-foreground">Question {current + 1} / {questions.length}</p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={openLayersModal}
              className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border ${
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
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-border hover:border-primary/40"
            >
              <MessagesSquare className="h-3.5 w-3.5 text-primary" /> Proctor Chat
            </button>
            <span className="flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-lg bg-primary/10 text-primary">
              <Clock className="h-4 w-4" /> {fmt(secondsLeft)}
            </span>
          </div>
        </div>
      </header>

      <main className="container flex-1 py-8 grid lg:grid-cols-[minmax(0,1fr)_260px] gap-6 items-start">
        <div className="rounded-xl border border-border bg-background p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
                {q.section ?? "Question"} · {q.marks} mark{q.marks === 1 ? "" : "s"}
              </p>
              <h2 className="font-display text-lg md:text-xl font-bold leading-snug">{q.prompt}</h2>
            </div>
            <button
              onClick={() => setFlags((f) => ({ ...f, [q.question_id]: !f[q.question_id] }))}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border shrink-0 ${
                flags[q.question_id] ? "bg-primary/10 text-primary border-primary/30" : "border-border text-muted-foreground"
              }`}
            >
              <Flag className="h-3.5 w-3.5" /> {flags[q.question_id] ? "Flagged" : "Flag"}
            </button>
          </div>

          {q.options && (q.qtype === "mcq" || q.qtype === "multi") ? (
            <div className="space-y-2.5">
              {q.options.map((o) => {
                const picked =
                  q.qtype === "mcq"
                    ? sel?.selected === o.id
                    : Array.isArray(sel?.selected) && (sel!.selected as number[]).includes(o.id);
                return (
                  <button
                    key={o.id}
                    onClick={() => {
                      if (q.qtype === "mcq") return answer({ selected: o.id });
                      const cur = Array.isArray(sel?.selected) ? (sel!.selected as number[]) : [];
                      answer({ selected: cur.includes(o.id) ? cur.filter((x) => x !== o.id) : [...cur, o.id] });
                    }}
                    className={`w-full text-left flex items-start gap-3 rounded-xl border p-4 text-sm transition-colors ${
                      picked ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                    }`}
                  >
                    <span
                      className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        picked ? "border-primary bg-primary text-primary-foreground" : "border-border"
                      }`}
                    >
                      {picked && <Check className="h-3 w-3" />}
                    </span>
                    {o.text}
                  </button>
                );
              })}
            </div>
          ) : (
            <textarea
              value={(sel?.text as string) ?? ""}
              onChange={(e) => answer({ text: e.target.value })}
              rows={9}
              placeholder="Type your authentic response here (keystroke cadence & stylometry monitored)"
              className="w-full rounded-xl border border-border p-4 text-sm bg-background outline-none focus:border-primary/50 select-text"
            />
          )}

          <div className="flex items-center justify-between gap-3 mt-7 pt-6 border-t border-border">
            <Button variant="outline" disabled={current === 0} onClick={() => setCurrent((c) => c - 1)} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Previous
            </Button>
            {current === questions.length - 1 ? (
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

        <aside className="rounded-xl border border-border bg-background p-5 space-y-4">
          <div>
            <p className="text-sm font-semibold mb-3">Question navigator</p>
            <div className="grid grid-cols-5 gap-2 mb-4">
              {questions.map((x, i) => (
                <button
                  key={x.question_id}
                  onClick={() => setCurrent(i)}
                  className={`h-9 rounded-lg text-xs font-bold border ${
                    i === current
                      ? "border-primary bg-primary text-primary-foreground"
                      : flags[x.question_id]
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : answers[x.question_id]
                      ? "border-border bg-secondary"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </button>
              ))}
            </div>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>{answered} answered</li>
              <li>{questions.length - answered} unanswered</li>
            </ul>
          </div>

          <Button variant="outline" className="w-full gap-1.5 text-xs" onClick={openLayersModal}>
            <Layers className="h-3.5 w-3.5" /> View 30 Active Layers
          </Button>
          <Button variant="outline" className="w-full" onClick={() => setConfirming(true)}>
            Submit Test
          </Button>
        </aside>
      </main>

      {confirming && (
        <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-5">
          <div className="w-full max-w-md rounded-2xl bg-background p-7">
            <h3 className="font-display text-xl font-bold mb-2">Submit &amp; Seal Audit Trail?</h3>
            <p className="text-sm text-muted-foreground mb-5">
              {answered} of {questions.length} answered. Submitting runs Post-Assessment Layers 23–30 (AI/ChatGPT, Plagiarism &amp; SHA-256 Chain Seal).
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setConfirming(false)}>
                Keep going
              </Button>
              <Button className="flex-1" disabled={submitting} onClick={finish}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit & Seal"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Steps 2 + 4: Journey Progress, PreCheck Gate, Exam & Final CIR      */
/* ------------------------------------------------------------------ */
const Journey_ = ({ journey, assessment }: { journey: Journey; assessment: CatalogAssessment }) => {
  const [steps, setSteps] = useState<JourneyStep[]>([]);
  const [activeAttempt, setActiveAttempt] = useState<{
    attempt: Attempt;
    title: string;
    precheck: PreCheckCompletionData | null;
  } | null>(null);
  const [inspectedAttemptId, setInspectedAttemptId] = useState<string | null>(null);
  const [report, setReport] = useState<CirReport | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => setSteps(await getJourneyProgress(journey.id)), [journey.id]);
  useEffect(() => { load().catch((e) => toast.error(backendErrorMessage(e))); }, [load]);

  const done = (s: JourneyStep) => s.status === "graded" || s.status === "submitted";
  const next = steps.find((s) => !done(s));
  const allDone = steps.length > 0 && steps.every(done);

  const begin = async (s: JourneyStep) => {
    setBusy(true);
    try {
      const a = await startAttempt(journey.id, s.assessment_id);
      setActiveAttempt({ attempt: a, title: s.title, precheck: null });
    } catch (e) {
      toast.error(backendErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const makeReport = async () => {
    setBusy(true);
    try {
      const r = await generateCir(journey.id);
      setReport(r);
      void signCredential(r.id);
    } catch (e) {
      toast.error(backendErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  if (activeAttempt) {
    if (!activeAttempt.precheck) {
      return (
        <ProctoringPreCheckGate
          attemptId={activeAttempt.attempt.id}
          assessmentTitle={activeAttempt.title}
          onComplete={(data) => setActiveAttempt((prev) => (prev ? { ...prev, precheck: data } : null))}
          onCancel={() => {
            setActiveAttempt(null);
            void load();
          }}
        />
      );
    }

    return (
      <ProctoringExamShell
        attemptId={activeAttempt.attempt.id}
        assessmentTitle={activeAttempt.title}
        initialIntegrityScore={activeAttempt.attempt.integrity_score ?? 100}
        deviceFingerprint={activeAttempt.precheck.deviceFingerprint}
        baselineHistogram={activeAttempt.precheck.baselineHistogram}
        noiseFloorDb={activeAttempt.precheck.noiseFloorDb}
        onAutoInvalidate={() => {
          if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined);
          setInspectedAttemptId(activeAttempt.attempt.id);
          setActiveAttempt(null);
          void load();
        }}
      >
        <AttemptRunnerBody
          attempt={activeAttempt.attempt}
          title={activeAttempt.title}
          onDone={() => {
            if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined);
            setInspectedAttemptId(activeAttempt.attempt.id);
            setActiveAttempt(null);
            void load();
          }}
        />
      </ProctoringExamShell>
    );
  }

  if (report) {
    const s = report.sections;
    const domainAttemptId = (s.domain?.attempt_id as string | undefined) ?? inspectedAttemptId;
    return (
      <div className="container py-10 max-w-4xl mx-auto space-y-6">
        <div className="rounded-2xl border border-border bg-background p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center">
              <Award className="h-5 w-5 text-primary" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary">Career Intelligence Report</p>
              <h2 className="font-display text-2xl font-bold">{assessment.title}</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              ["Composite", report.composite_score],
              ["Tier", report.tier ?? "-"],
              ["Percentile", `${report.percentile ?? 50}`],
              ["Integrity Grade", s.integrity?.grade ?? "A"],
            ].map(([l, v]) => (
              <div key={l as string} className="rounded-xl border border-border p-4 text-center">
                <p className="font-display text-2xl font-bold">{v as string}</p>
                <p className="text-xs text-muted-foreground">{l as string}</p>
              </div>
            ))}
          </div>
          <ul className="text-sm divide-y divide-border mb-6">
            {[
              ["Communication", s.communication?.score],
              ["Psychometrics", s.psychometric?.score],
              ["Vocational", s.vocational?.score],
              ["HR judgment", s.hr_judgment?.score],
              [assessment.title, s.domain?.score],
              ["30-Layer Integrity", s.integrity?.score],
            ].map(([l, v]) => (
              <li key={l as string} className="flex justify-between py-2">
                <span>{l as string}</span>
                <b>{v == null ? "-" : `${Math.round(Number(v))}%`}</b>
              </li>
            ))}
          </ul>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1"><Link to="/talento-pro?view=cert">View in my certifications</Link></Button>
            <Button asChild variant="outline" className="flex-1"><Link to="/jobs">Find matching jobs</Link></Button>
          </div>
        </div>

        <ProctoringAuditDossier attemptId={domainAttemptId} fallbackScore={report.integrity_score ?? 100} />
      </div>
    );
  }

  return (
    <div className="container py-10 max-w-3xl mx-auto space-y-6">
      <div className="rounded-2xl border border-border bg-background p-7">
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Journey progress · 30-Layer Proctored</p>
        <h2 className="font-display text-2xl font-bold mb-5">{assessment.title}</h2>
        <ol className="space-y-3 mb-6">
          {steps.map((s) => (
            <li key={s.assessment_id} className="flex items-center gap-4 rounded-xl border border-border p-4">
              <span
                className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                  done(s)
                    ? "bg-primary text-primary-foreground"
                    : s.is_unlocked
                    ? "bg-primary/10 text-primary"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {done(s) ? <Check className="h-4 w-4" /> : s.is_unlocked ? s.step_no : <Lock className="h-4 w-4" />}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{s.title}</p>
                <p className="text-xs text-muted-foreground">
                  {s.kind === "core" ? "Mandatory core test" : "Selected domain test"}
                  {done(s) && s.percentage != null ? ` · Score ${Math.round(Number(s.percentage))}%` : ""}
                </p>
              </div>
              {done(s) && s.attempt_id && (
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1 text-xs"
                  onClick={() => setInspectedAttemptId((cur) => (cur === s.attempt_id ? null : s.attempt_id))}
                >
                  <Eye className="h-3.5 w-3.5" /> Audit
                </Button>
              )}
              {!done(s) && s.is_unlocked && (
                <Button size="sm" disabled={busy} onClick={() => begin(s)}>
                  {s.status === "in_progress" ? "Resume" : "Start"}
                </Button>
              )}
            </li>
          ))}
        </ol>
        {allDone ? (
          <Button className="w-full" disabled={busy} onClick={makeReport}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate my Career Intelligence Report"}
          </Button>
        ) : next ? (
          <p className="text-xs text-muted-foreground">
            Next up: <b>{next.title}</b>. Every test runs 6 pre-assessment checks, 16 real-time proctoring layers, and 8 post-submission forensic verifiers.
          </p>
        ) : null}
      </div>

      {inspectedAttemptId && <ProctoringAuditDossier attemptId={inspectedAttemptId} />}
    </div>
  );
};

/* ------------------------------------------------------------------ */
export const LiveAssessmentJourney = ({ assessment }: { assessment: CatalogAssessment }) => {
  const [journey, setJourney] = useState<Journey | null | undefined>(undefined);
  const existing = useMemo(
    () => fetchActiveJourneys().then((js) => js.find((j) => j.domain_assessment_id === assessment.id) ?? null),
    [assessment.id]
  );
  useEffect(() => { existing.then(setJourney).catch(() => setJourney(null)); }, [existing]);

  if (journey === undefined) return <div className="py-24 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>;
  if (journey) return <Journey_ journey={journey} assessment={assessment} />;
  return (
    <div className="container py-10">
      <Checkout assessment={assessment} onStarted={setJourney} />
    </div>
  );
};
