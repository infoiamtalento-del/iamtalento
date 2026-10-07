import { Helmet } from "react-helmet-async";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight, CheckCircle2, Check, Clock, Play, PlayCircle, Dumbbell, Timer, ShieldCheck } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import BrandLogo from "@/components/ui/BrandLogo";
import { getAssessment } from "@/data/assessments";
import { getSubDomains, ROUNDS } from "@/data/subDomains";
import { SUB_DOMAIN_BRANDS, formatINR } from "@/components/assessments/SubDomainPicker";
import { MODE_CONFIG, loadPaidOrder, type PracticeMode } from "@/data/practiceQuestions";
import { loadPracticeScore } from "@/pages/assessment/AssessmentPractice";

const MODES: { id: PracticeMode; icon: typeof Play }[] = [
  { id: "demo", icon: PlayCircle },
  { id: "practice", icon: Dumbbell },
  { id: "mock", icon: Timer },
];

const AssessmentPrepare = () => {
  const { assessmentId = "" } = useParams();
  const a = getAssessment(assessmentId);
  const order = loadPaidOrder(assessmentId);

  if (!a) return <Navigate to="/assessments/explore" replace />;
  if (!order) return <Navigate to={`/assessments/${a.id}`} replace />;

  const subs = getSubDomains(a.industry).filter((s) => order.subDomainIds.includes(s.id));

  return (
    <>
      <Helmet>
        <title>Prepare for your test — I Am Talento</title>
      </Helmet>
      <Layout>
        <section className="bg-gradient-to-b from-accent/60 to-background pt-28 pb-10 md:pt-36">
          <div className="container">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                  <CheckCircle2 className="h-4 w-4" /> Payment successful
                </span>
                <h1 className="font-display text-3xl font-bold leading-[1.15] md:text-4xl">
                  You are in. <span className="text-primary">Prepare before the real test.</span>
                </h1>
                <p className="mt-3 text-base text-muted-foreground md:text-lg">
                  Your demo, practice and mock tests for {a.title} are unlocked below, one set for every
                  sub-domain you picked.
                </p>
              </div>
              <dl className="grid shrink-0 grid-cols-3 gap-3 text-sm">
                {[
                  ["Order", order.orderId],
                  ["Sub-domains", String(subs.length)],
                  ["Paid", formatINR(order.total)],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl border border-border bg-background px-4 py-3">
                    <dt className="text-xs text-muted-foreground">{k}</dt>
                    <dd className="mt-0.5 font-display font-bold">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="container grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-6">
              {subs.map((s) => (
                <article key={s.id} className="overflow-hidden rounded-2xl border border-border bg-background">
                  <header className="flex items-center gap-4 border-b border-border bg-accent/40 px-6 py-5">
                    <BrandLogo name={SUB_DOMAIN_BRANDS[s.id]?.brand ?? s.name} size="lg" />
                    <div className="min-w-0">
                      <h2 className="font-display text-lg font-bold leading-tight">{s.name}</h2>
                      <p className="text-sm text-muted-foreground">3 rounds · 6 tests in the live assessment</p>
                    </div>
                  </header>

                  <div className="grid gap-px bg-border md:grid-cols-3">
                    {MODES.map(({ id, icon: Icon }) => {
                      const cfg = MODE_CONFIG[id];
                      const score = loadPracticeScore(a.id, s.id, id);
                      return (
                        <div key={id} className="flex flex-col bg-background p-5">
                          <div className="mb-3 flex items-center justify-between">
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <Icon className="h-4 w-4" />
                            </span>
                            {score && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                                <Check className="h-3 w-3" /> {score.correct}/{score.total}
                              </span>
                            )}
                          </div>
                          <p className="font-display text-base font-bold">{cfg.label}</p>
                          <p className="mt-1 flex-1 text-xs leading-relaxed text-muted-foreground">{cfg.text}</p>
                          <p className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-foreground/70">
                            <Clock className="h-3 w-3" /> {cfg.count} questions ·{" "}
                            {cfg.minutes ? `${cfg.minutes} min timer` : "No timer"}
                          </p>
                          <Button asChild size="sm" variant={score ? "outline" : "default"} className="mt-4 w-full gap-1.5">
                            <Link to={`/assessments/${a.id}/practice/${s.id}/${id}`}>
                              {score ? "Retake" : "Start"} <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-border bg-secondary/30 px-6 py-4">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      What the live test covers
                    </p>
                    <ul className="grid gap-x-6 gap-y-1.5 text-xs text-muted-foreground sm:grid-cols-3">
                      {ROUNDS.map((r) => (
                        <li key={r.id}>
                          <span className="font-semibold text-foreground">{r.title}</span>
                          <br />
                          {r.tests.map((t) => t.name).join(" · ")}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>

            <aside className="rounded-xl border border-border bg-background lg:sticky lg:top-24">
              <div className="border-b border-border bg-foreground px-5 py-4 text-background">
                <p className="font-display text-sm font-bold">Ready for the real thing?</p>
              </div>
              <div className="p-5">
                <ul className="space-y-2.5 text-sm">
                  {[
                    "Finish at least one mock test per sub-domain",
                    "Keep your photo ID ready",
                    "Use a quiet room with a stable connection",
                    "Close other tabs and applications",
                  ].map((x) => (
                    <li key={x} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {x}
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-6 w-full gap-2" size="lg">
                  <Link to={`/assessments/${a.id}/pre-check`}>
                    Continue to live assessment <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" /> You will run a device check first
                </p>
              </div>
            </aside>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default AssessmentPrepare;
