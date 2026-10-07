import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Clock, X } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import BrandLogo from "@/components/ui/BrandLogo";
import { getAssessment } from "@/data/assessments";
import { getSubDomains } from "@/data/subDomains";
import { SUB_DOMAIN_BRANDS } from "@/components/assessments/SubDomainPicker";
import { MODE_CONFIG, getPracticeQuestions, loadPaidOrder, type PracticeMode } from "@/data/practiceQuestions";

const scoreKey = (aid: string, sid: string, mode: string) => `tq_practice_${aid}_${sid}_${mode}`;

export const loadPracticeScore = (aid: string, sid: string, mode: string): { correct: number; total: number } | null => {
  try {
    const raw = sessionStorage.getItem(scoreKey(aid, sid, mode));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

const AssessmentPractice = () => {
  const { assessmentId = "", subId = "", mode = "" } = useParams();
  const a = getAssessment(assessmentId);
  const order = loadPaidOrder(assessmentId);
  const modeId = mode as PracticeMode;
  const cfg = MODE_CONFIG[modeId];
  const sub = a ? getSubDomains(a.industry).find((s) => s.id === subId) : undefined;

  const questions = useMemo(() => (cfg ? getPracticeQuestions(subId, modeId) : []), [subId, modeId, cfg]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [finished, setFinished] = useState(false);
  const [seconds, setSeconds] = useState((cfg?.minutes ?? 0) * 60);

  const timed = !!cfg?.minutes;
  const instant = cfg?.feedback === "instant";

  const correct = questions.reduce((n, q, i) => (answers[i] === q.answer ? n + 1 : n), 0);

  const finish = () => {
    if (!a || !sub) return;
    sessionStorage.setItem(scoreKey(a.id, sub.id, modeId), JSON.stringify({ correct, total: questions.length }));
    setFinished(true);
  };

  useEffect(() => {
    if (!timed || finished) return;
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [timed, finished]);

  useEffect(() => {
    if (timed && seconds === 0 && !finished) finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds]);

  if (!a || !sub || !cfg) return <Navigate to="/assessments/explore" replace />;
  if (!order || !order.subDomainIds.includes(sub.id)) return <Navigate to={`/assessments/${a.id}`} replace />;

  const prepareUrl = `/assessments/${a.id}/prepare`;
  const q = questions[index];
  const picked = answers[index];
  const revealed = instant && picked !== undefined;
  const isLast = index === questions.length - 1;

  const restart = () => {
    setAnswers({});
    setIndex(0);
    setFinished(false);
    setSeconds((cfg.minutes ?? 0) * 60);
  };

  return (
    <>
      <Helmet>
        <title>
          {cfg.label} · {sub.name} — I Am Talento
        </title>
      </Helmet>
      <Layout>
        <section className="bg-gradient-to-b from-accent/50 to-background pt-28 pb-16 md:pt-36">
          <div className="container max-w-3xl">
            <Link to={prepareUrl} className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4" /> Back to preparation
            </Link>

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <BrandLogo name={SUB_DOMAIN_BRANDS[sub.id]?.brand ?? sub.name} size="md" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">{cfg.label}</p>
                  <h1 className="font-display text-xl font-bold leading-tight md:text-2xl">{sub.name}</h1>
                </div>
              </div>
              {timed && !finished && (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-bold ${
                    seconds < 60 ? "border-primary text-primary" : "border-border"
                  }`}
                >
                  <Clock className="h-4 w-4" /> {fmt(seconds)}
                </span>
              )}
            </div>

            {!finished ? (
              <div className="rounded-2xl border border-border bg-background p-6 md:p-8">
                <div className="mb-5 flex items-center justify-between text-xs font-semibold text-muted-foreground">
                  <span>
                    Question {index + 1} of {questions.length}
                  </span>
                  <span>{Object.keys(answers).length} answered</span>
                </div>
                <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${((index + 1) / questions.length) * 100}%` }}
                  />
                </div>

                <h2 className="mb-5 font-display text-lg font-bold leading-snug md:text-xl">{q.prompt}</h2>

                <div className="space-y-3">
                  {q.options.map((opt, i) => {
                    const isPicked = picked === i;
                    const isRight = revealed && i === q.answer;
                    const isWrong = revealed && isPicked && i !== q.answer;
                    return (
                      <button
                        key={opt}
                        type="button"
                        disabled={revealed}
                        onClick={() => setAnswers((p) => ({ ...p, [index]: i }))}
                        className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                          isRight
                            ? "border-primary bg-primary/10 font-semibold"
                            : isWrong
                              ? "border-destructive bg-destructive/5"
                              : isPicked
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/40"
                        }`}
                      >
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold ${
                            isPicked || isRight ? "border-primary bg-primary text-primary-foreground" : "border-border"
                          }`}
                        >
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="flex-1">{opt}</span>
                        {isRight && <Check className="h-4 w-4 text-primary" />}
                        {isWrong && <X className="h-4 w-4 text-destructive" />}
                      </button>
                    );
                  })}
                </div>

                {revealed && (
                  <div className="mt-5 rounded-xl border border-primary/25 bg-accent/50 p-4 text-sm">
                    <p className="mb-1 font-bold text-primary">{picked === q.answer ? "Correct" : "Not quite"}</p>
                    <p className="leading-relaxed text-muted-foreground">{q.explanation}</p>
                  </div>
                )}

                <div className="mt-7 flex items-center justify-between">
                  <Button variant="outline" disabled={index === 0} onClick={() => setIndex((i) => i - 1)} className="gap-1.5">
                    <ArrowLeft className="h-4 w-4" /> Previous
                  </Button>
                  {isLast ? (
                    <Button onClick={finish} disabled={picked === undefined && instant} className="gap-1.5">
                      Finish <Check className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button onClick={() => setIndex((i) => i + 1)} disabled={instant && picked === undefined} className="gap-1.5">
                      Next <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="rounded-2xl border border-border bg-background p-8 text-center">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">{cfg.label} complete</p>
                  <p className="mt-3 font-display text-5xl font-bold">
                    {correct}
                    <span className="text-2xl text-muted-foreground">/{questions.length}</span>
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {correct === questions.length
                      ? "Perfect score. You are ready for the live test."
                      : correct >= Math.ceil(questions.length * 0.6)
                        ? "Good result. Review the answers below and try again to improve."
                        : "Keep practising. Review the explanations and retake the test."}
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Button variant="outline" onClick={restart}>
                      Retake
                    </Button>
                    <Button asChild className="gap-1.5">
                      <Link to={prepareUrl}>
                        Back to preparation <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-display text-lg font-bold">Answer review</h3>
                  {questions.map((qq, i) => {
                    const ok = answers[i] === qq.answer;
                    return (
                      <div key={qq.prompt} className="rounded-xl border border-border bg-background p-5 text-sm">
                        <p className="mb-2 flex items-start gap-2 font-semibold">
                          <span
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                              ok ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground"
                            }`}
                          >
                            {ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                          </span>
                          {qq.prompt}
                        </p>
                        <p className="text-muted-foreground">
                          Your answer: {answers[i] !== undefined ? qq.options[answers[i]] : "Not answered"}
                          {!ok && (
                            <>
                              <br />
                              Correct answer: <span className="font-semibold text-foreground">{qq.options[qq.answer]}</span>
                            </>
                          )}
                        </p>
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{qq.explanation}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      </Layout>
    </>
  );
};

export default AssessmentPractice;
