import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { Download, Share2, ShieldCheck, Loader2, ArrowRight, TrendingUp, AlertCircle } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { getAssessment } from "@/data/assessments";

interface Result {
  score: number;
  answered: number;
  flagged: number;
  total: number;
  skills: { skill: string; pct: number }[];
  completedAt: string;
}

const AssessmentResult = () => {
  const { assessmentId } = useParams();
  const a = getAssessment(assessmentId);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(`cir-${assessmentId}`);
    const t = setTimeout(() => {
      setResult(raw ? JSON.parse(raw) : null);
      setLoading(false);
    }, 1200);
    return () => clearTimeout(t);
  }, [assessmentId]);

  if (!a) {
    return (
      <Layout>
        <div className="container py-24 text-center">
          <p className="mb-4">Assessment not found.</p>
          <Button asChild><Link to="/assessments/explore">Back to assessments</Link></Button>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="container py-32 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="font-display text-xl font-bold">Generating your CIR report</p>
          <p className="text-sm text-muted-foreground">Scoring answers and verifying your proctored session...</p>
        </div>
      </Layout>
    );
  }

  if (!result) {
    return (
      <Layout>
        <div className="container py-24 text-center">
          <h1 className="font-display text-2xl font-bold mb-3">No report found</h1>
          <p className="text-muted-foreground mb-5">Complete the assessment to generate your CIR report.</p>
          <Button asChild><Link to={`/assessments/${a.id}`}>Go to assessment</Link></Button>
        </div>
      </Layout>
    );
  }

  const sorted = [...result.skills].sort((x, y) => y.pct - x.pct);
  const strengths = sorted.slice(0, 2);
  const improvements = sorted.slice(-2).reverse();

  return (
    <>
      <Helmet>
        <title>Your CIR Report | {a.title}</title>
      </Helmet>
      <Layout>
        <section className="py-12 md:py-16 bg-background">
          <div className="container">
            <h1 className="font-display text-3xl md:text-4xl font-bold leading-[1.15] mb-2">
              Your Assessment Report<br />
              <span className="text-primary">{a.title}</span>
            </h1>
            <p className="text-muted-foreground">
              Completed on {new Date(result.completedAt).toLocaleDateString()} · {a.domain} · {a.difficulty}
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="container grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] gap-6 items-start">
            {/* Score */}
            <div className="rounded-2xl border border-border bg-background p-7 text-center w-full">
              <p className="text-sm text-muted-foreground mb-3">Overall Score</p>
              <div className="relative mx-auto h-40 w-40 rounded-full flex items-center justify-center bg-primary/10 mb-4">
                <span className="font-display text-5xl font-bold text-primary">{result.score}</span>
                <span className="absolute bottom-7 text-xs text-muted-foreground">/ 100</span>
              </div>
              <p className="flex items-center justify-center gap-1.5 text-sm font-semibold text-primary mb-5">
                <ShieldCheck className="h-4 w-4" /> Proctored & verified
              </p>
              <div className="grid grid-cols-3 gap-2 text-center mb-6">
                {[
                  ["Total", result.total],
                  ["Answered", result.answered],
                  ["Flagged", result.flagged],
                ].map(([l, v]) => (
                  <div key={l as string} className="rounded-xl bg-secondary p-3">
                    <p className="font-display text-lg font-bold">{v as number}</p>
                    <p className="text-[11px] text-muted-foreground">{l as string}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <Button className="gap-2" onClick={() => window.print()}>
                  <Download className="h-4 w-4" /> Download CIR
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => navigator.clipboard?.writeText(window.location.href)}
                >
                  <Share2 className="h-4 w-4" /> Share CIR
                </Button>
              </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-6 w-full">
              <div className="rounded-2xl border border-border bg-background p-6">
                <h2 className="font-display text-xl font-bold mb-5">Skill breakdown</h2>
                <div className="space-y-4">
                  {result.skills.map((s) => (
                    <div key={s.skill}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium">{s.skill}</span>
                        <span className="font-semibold">{s.pct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${s.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="rounded-2xl border border-border bg-background p-6">
                  <p className="flex items-center gap-2 font-semibold mb-3">
                    <TrendingUp className="h-4 w-4 text-primary" /> Strengths
                  </p>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    {strengths.map((s) => <li key={s.skill}>{s.skill}, {s.pct}%</li>)}
                  </ul>
                </div>
                <div className="rounded-2xl border border-border bg-background p-6">
                  <p className="flex items-center gap-2 font-semibold mb-3">
                    <AlertCircle className="h-4 w-4 text-primary" /> Improvement areas
                  </p>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    {improvements.map((s) => <li key={s.skill}>{s.skill}, {s.pct}%</li>)}
                  </ul>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-background p-6 text-sm text-muted-foreground">
                <p className="font-semibold text-foreground mb-2">Test details</p>
                <p>{a.title} · {a.type} assessment · {a.questionCount} questions · {a.duration}</p>
                <p>Created by {a.creator.name}, {a.creator.title} at {a.creator.company}</p>
                <p>Experience benchmark: {a.experienceLevels.join(", ")}</p>
              </div>

              <div className="rounded-2xl bg-primary text-primary-foreground p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="font-display text-lg font-bold">Keep building your profile</p>
                  <p className="text-sm opacity-90">Add this verified score to your talent profile.</p>
                </div>
                <Button variant="secondary" asChild className="gap-2 shrink-0">
                  <Link to="/assessments/explore">Take another assessment <ArrowRight className="h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default AssessmentResult;
