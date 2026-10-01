import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Flag, ArrowLeft, ArrowRight, Clock, ShieldCheck, Minus, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAssessment } from "@/data/assessments";

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
                className="h-9 flex-1 rounded border border-border px-3 text-sm outline-none focus:border-primary/50 bg-background"
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

const AssessmentTest = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const a = getAssessment(assessmentId);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [flags, setFlags] = useState<Record<number, boolean>>({});
  const [taskDone, setTaskDone] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [seconds, setSeconds] = useState(() => parseMinutes(a?.duration ?? "30 min") * 60);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const answeredCount = Object.keys(answers).length;
  const flagCount = Object.values(flags).filter(Boolean).length;

  const mmss = useMemo(() => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, [seconds]);

  if (!a) {
    return (
      <div className="container py-24 text-center">
        <p className="mb-4">Assessment not found.</p>
        <Button asChild><Link to="/assessments/explore">Back to assessments</Link></Button>
      </div>
    );
  }

  const q = a.questions[current];
  const isLast = current === a.questions.length - 1;
  const showTask = a.type !== "Knowledge" && current === 0;

  const submit = () => {
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
        skills: Object.entries(perSkill).map(([skill, v]) => ({
          skill,
          pct: Math.round((v.c / v.t) * 100),
        })),
        completedAt: new Date().toISOString(),
      })
    );
    navigate(`/assessments/${a.id}/result`);
  };

  return (
    <>
      <Helmet>
        <title>{a.title} — Assessment in progress</title>
      </Helmet>
      <div className="min-h-screen bg-secondary/30 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-background border-b border-border">
          <div className="container h-16 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-display font-bold text-sm md:text-base truncate">{a.title}</p>
              <p className="text-xs text-muted-foreground">
                Question {current + 1} / {a.questions.length}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-primary">
                <ShieldCheck className="h-4 w-4" /> Proctoring active
              </span>
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
          {/* Question */}
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
                    onClick={() => setAnswers((p) => ({ ...p, [current]: i }))}
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
                  Review & Submit <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={() => setCurrent((c) => c + 1)} className="gap-2">
                  Save &amp; Next <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Navigator */}
          <aside className="rounded-xl border border-border bg-background p-5 w-full">
            <p className="text-sm font-semibold mb-3">Question navigator</p>
            <div className="grid grid-cols-5 gap-2 mb-5">
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
            <ul className="space-y-1.5 text-xs text-muted-foreground mb-5">
              <li>{answeredCount} answered</li>
              <li>{flagCount} flagged</li>
              <li>{a.questions.length - answeredCount} unanswered</li>
            </ul>
            <Button variant="outline" className="w-full" onClick={() => setConfirming(true)}>
              Submit Assessment
            </Button>
          </aside>
        </main>
      </div>

      {confirming && (
        <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-5">
          <div className="w-full max-w-md rounded-2xl bg-background p-7">
            <h3 className="font-display text-xl font-bold mb-2">You're Almost Done</h3>
            <p className="text-sm text-muted-foreground mb-5">Are you sure you want to submit your assessment?</p>
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
              <Button className="flex-1" onClick={submit}>
                Submit Assessment
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssessmentTest;
