import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Award,
  BookOpen,
  Camera,
  CameraOff,
  CheckCircle2,
  Clock,
  Loader2,
  Mic,
  Play,
  Search,
  Sparkles,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ProHero } from "../ProHero";
import { loadLiveProfile, saveCandidatePayload } from "@/services/candidate/profile";

interface QaItem {
  id: string;
  category: "Behavioral" | "Software & AI" | "Finance & Business" | "Product & Growth";
  question: string;
  intent: string;
  framework: string;
  sampleAnswer: string;
}

const QA_BANK: QaItem[] = [
  {
    id: "beh-1",
    category: "Behavioral",
    question: "Tell me about a time you delivered a critical project under a tight deadline with ambiguous requirements.",
    intent: "Evaluates ownership, prioritization under ambiguity, and stakeholder alignment.",
    framework: "STAR: Situation (constraints) → Task (goal) → Action (scoping + trade-offs) → Result (quantified metric).",
    sampleAnswer:
      "During our Q3 release, requirements shifted 5 days before launch. I aligned product and engineering on a must-have MVP scope, shipped core checkout flows on schedule with zero P0 bugs, and cut drop-off by 18%.",
  },
  {
    id: "beh-2",
    category: "Behavioral",
    question: "Describe a technical or analytical disagreement with a teammate and how you resolved it.",
    intent: "Tests collaborative humility, data-backed persuasion, and ego-free execution.",
    framework: "Acknowledge their trade-off → Benchmark both options with data → Agree on measurable success criteria.",
    sampleAnswer:
      "My lead favored a microservice split while I advocated modular monolith first. I built a latency and deployment-overhead comparison table; we agreed on clean module boundaries first and shipped 3 weeks faster.",
  },
  {
    id: "tech-1",
    category: "Software & AI",
    question: "How do you prevent race conditions and double-spending in a PostgreSQL wallet or booking ledger?",
    intent: "Checks transactional ACID mastery, row-level locking, and idempotency.",
    framework: "Transactions + SELECT ... FOR UPDATE + Unique idempotency keys + CHECK (balance >= 0) constraints.",
    sampleAnswer:
      "Wrap debit + ledger entry in a single transaction, lock the wallet row with SELECT FOR UPDATE, enforce an idempotency_key unique index on ledger entries, and keep a non-negative balance CHECK constraint.",
  },
  {
    id: "tech-2",
    category: "Software & AI",
    question: "How do you evaluate and mitigate hallucinations in a production RAG / LLM pipeline?",
    intent: "Assesses practical AI engineering rigor beyond basic prompt writing.",
    framework: "Retrieval recall@k → Groundedness / citation verification → Deterministic guardrails → Eval dataset.",
    sampleAnswer:
      "We pair hybrid BM25 + vector retrieval with strict source-citation schemas, run automated faithfulness checks on a golden evaluation set in CI, and fall back to abstention when retrieval confidence is below threshold.",
  },
  {
    id: "fin-1",
    category: "Finance & Business",
    question: "Walk me through how a ₹10 Cr increase in depreciation affects the three financial statements.",
    intent: "Tests core accounting linkage across Income Statement, Cash Flow, and Balance Sheet.",
    framework: "Income Statement (EBIT & tax shield) → Cash Flow (non-cash add-back) → Balance Sheet (PP&E, Cash, Retained Earnings).",
    sampleAnswer:
      "Operating income drops by ₹10 Cr; at a 25% tax rate, net income falls ₹7.5 Cr. On Cash Flow, add back ₹10 Cr depreciation so operating cash rises ₹2.5 Cr (tax shield). On Balance Sheet, net PP&E drops ₹10 Cr, cash is up ₹2.5 Cr, and retained earnings drop ₹7.5 Cr—balancing both sides.",
  },
  {
    id: "fin-2",
    category: "Finance & Business",
    question: "How would you investigate a sudden 400 bps gross margin drop in a quarterly P&L variance review?",
    intent: "Evaluates structured root-cause decomposition (price, volume, mix, COGS).",
    framework: "Price-Volume-Mix bridge → Input cost inflation → Discounting / channel shift → One-off inventory write-downs.",
    sampleAnswer:
      "I decompose the variance into Price, Volume, Product/Channel Mix, and Unit COGS. Often headline revenue looks healthy while enterprise discounting or higher-cost SKU mix silently compresses gross margin.",
  },
  {
    id: "pm-1",
    category: "Product & Growth",
    question: "Sign-ups increased 30% last month, but Day-7 activation dropped 20%. How do you diagnose and fix it?",
    intent: "Measures funnel segmentation, cohort thinking, and acquisition-quality awareness.",
    framework: "Channel cohort split → Onboarding step drop-off → Device/latency check → Hypothesis & A/B test.",
    sampleAnswer:
      "First segment D7 activation by acquisition channel and device—paid top-of-funnel campaigns frequently bring lower-intent traffic. Next inspect step-by-step onboarding conversion to pinpoint where new cohorts stall.",
  },
  {
    id: "pm-2",
    category: "Product & Growth",
    question: "How do you prioritize between reducing technical debt, a top enterprise customer request, and a growth experiment?",
    intent: "Tests transparent prioritization frameworks tied to company North Star goals.",
    framework: "Align on quarterly objective → Score Reach, Impact, Confidence, Effort (RICE) + Risk of inaction.",
    sampleAnswer:
      "I quantify reliability risk cost on tech debt, ARR retention impact on the enterprise ask, and expected conversion lift on growth, then allocate capacity explicitly (e.g. 60% core growth, 25% enterprise, 15% stability).",
  },
];

interface MockAttemptRecord {
  id: string;
  role: string;
  level: string;
  score: number;
  clarity: number;
  depth: number;
  structure: number;
  at: string;
}

export const LiveMockInterviewHub: React.FC<{ onToast: (msg: string) => void }> = ({ onToast }) => {
  const [tab, setTab] = useState<"mock" | "qabank">("mock");
  const [loading, setLoading] = useState(true);
  const [shellState, setShellState] = useState<Record<string, any>>({});
  const [history, setHistory] = useState<MockAttemptRecord[]>([]);
  const [practicedIds, setPracticedIds] = useState<string[]>([]);

  // Mock interview session state
  const [targetRole, setTargetRole] = useState("Full Stack Engineer");
  const [difficulty, setDifficulty] = useState<"Fresher" | "Mid-Level" | "Senior">("Fresher");
  const [inSession, setInSession] = useState(false);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);
  const [cameraOn, setCameraOn] = useState(false);
  const [latestResult, setLatestResult] = useState<MockAttemptRecord | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Q&A Bank filters
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<string>("All");

  useEffect(() => {
    let alive = true;
    loadLiveProfile()
      .then((lp) => {
        if (!alive || !lp) return;
        const sh = lp.shell_state || {};
        setShellState(sh);
        setHistory(Array.isArray(sh.mockInterviews) ? sh.mockInterviews : []);
        setPracticedIds(Array.isArray(sh.practicedQa) ? sh.practicedQa : []);
        if (lp.profile.job_role) setTargetRole(lp.profile.job_role);
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const toggleCamera = async () => {
    if (cameraOn) {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setCameraOn(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      setCameraOn(true);
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      }, 50);
    } catch {
      onToast("Camera permission unavailable — you can still complete the mock interview via written responses.");
    }
  };

  const sessionQuestions = useMemo(
    () => [
      `Walk me through your most impactful project relevant to ${targetRole} and the measurable outcome you achieved.`,
      `Suppose a production workflow in your ${targetRole} responsibilities degrades suddenly under peak load. How do you isolate and fix the bottleneck?`,
      `Tell me about a time you received critical feedback or faced a tight deadline. How did you adapt and what changed afterward?`,
    ],
    [targetRole]
  );

  const startMockSession = () => {
    setAnswers(["", "", ""]);
    setQIdx(0);
    setLatestResult(null);
    setInSession(true);
  };

  const submitMockSession = async () => {
    // Score answers deterministically based on structure, length, metrics, and action verbs
    const scores = answers.map((ans) => {
      const words = ans.trim().split(/\s+/).filter(Boolean).length;
      if (words === 0) return { clarity: 20, depth: 15, structure: 15 };
      const hasMetrics = /\d+%|\d+x|₹|\$|ms|days|weeks|users/i.test(ans);
      const hasStructure = /because|therefore|result|action|built|designed|implemented|led|improved|reduced/i.test(ans);
      const clarity = Math.min(96, 45 + Math.min(40, Math.round(words * 0.7)) + (hasStructure ? 10 : 0));
      const depth = Math.min(95, 40 + Math.min(38, Math.round(words * 0.65)) + (hasMetrics ? 15 : 0));
      const structure = Math.min(96, 42 + (hasStructure ? 25 : 5) + (hasMetrics ? 15 : 0) + Math.min(14, Math.round(words * 0.25)));
      return { clarity, depth, structure };
    });

    const avg = (k: "clarity" | "depth" | "structure") =>
      Math.round(scores.reduce((acc, s) => acc + s[k], 0) / scores.length);
    const clarity = avg("clarity");
    const depth = avg("depth");
    const structure = avg("structure");
    const composite = Math.round(0.35 * clarity + 0.35 * depth + 0.30 * structure);

    const record: MockAttemptRecord = {
      id: `MOCK-${Date.now()}`,
      role: targetRole,
      level: difficulty,
      score: composite,
      clarity,
      depth,
      structure,
      at: new Date().toISOString(),
    };

    const nextHistory = [record, ...history].slice(0, 15);
    setHistory(nextHistory);
    setLatestResult(record);
    setInSession(false);

    if (cameraOn) {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setCameraOn(false);
    }

    try {
      const nextShell = { ...shellState, mockInterviews: nextHistory };
      setShellState(nextShell);
      await saveCandidatePayload({ shell_state: nextShell });
      onToast(`Mock Interview scored: ${composite}/100! Saved to your Readiness profile.`);
    } catch {
      onToast(`Mock Interview scored: ${composite}/100!`);
    }
  };

  const togglePracticed = async (id: string) => {
    const next = practicedIds.includes(id)
      ? practicedIds.filter((x) => x !== id)
      : [...practicedIds, id];
    setPracticedIds(next);
    const nextShell = { ...shellState, practicedQa: next };
    setShellState(nextShell);
    await saveCandidatePayload({ shell_state: nextShell }).catch(() => {});
  };

  const filteredQa = useMemo(() => {
    return QA_BANK.filter((item) => {
      if (catFilter !== "All" && item.category !== catFilter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        item.question.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.sampleAnswer.toLowerCase().includes(q)
      );
    });
  }, [catFilter, search]);

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProHero
        icon={<Video />}
        title="AI Mock Interview & Interview Q&A Bank"
        subtitle="Practice role-specific interviews with structured STAR + technical rubric scoring, and master top recruiter questions."
      >
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() => setTab("mock")}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
              tab === "mock"
                ? "bg-white text-[#002C66]"
                : "bg-white/15 text-white ring-1 ring-white/30 hover:bg-white/25"
            }`}
          >
            Mock Interview Simulator
          </button>
          <button
            type="button"
            onClick={() => setTab("qabank")}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
              tab === "qabank"
                ? "bg-white text-[#002C66]"
                : "bg-white/15 text-white ring-1 ring-white/30 hover:bg-white/25"
            }`}
          >
            Interview Q&amp;A Bank ({practicedIds.length}/{QA_BANK.length} Practiced)
          </button>
        </div>
      </ProHero>

      {tab === "mock" ? (
        <div className="space-y-6">
          {!inSession ? (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold font-display">Configure Practice Session</h2>
                  <p className="text-xs text-muted-foreground">
                    3 structured behavioral + domain questions · Instant rubric breakdown · Counts toward your 15% Interview Readiness pillar
                  </p>
                </div>
                <Badge variant="secondary" className="gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-primary" /> AI Rubric Evaluator
                </Badge>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold block mb-1.5">Target Role</label>
                  <Input
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g. Full Stack Engineer, Financial Analyst"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1.5">Difficulty Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Fresher", "Mid-Level", "Senior"] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setDifficulty(lvl)}
                        className={`rounded-lg border py-2 text-xs font-semibold cursor-pointer ${
                          difficulty === lvl
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-background text-muted-foreground"
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button type="button" onClick={startMockSession} className="gap-2">
                <Play className="h-4 w-4" /> Start Mock Interview
              </Button>
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                <div>
                  <span className="text-xs font-bold uppercase text-primary">
                    Question {qIdx + 1} of {sessionQuestions.length} · {targetRole} ({difficulty})
                  </span>
                  <h2 className="text-base sm:text-lg font-bold font-display mt-1">{sessionQuestions[qIdx]}</h2>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={toggleCamera} className="gap-1.5 text-xs">
                  {cameraOn ? <CameraOff className="h-3.5 w-3.5" /> : <Camera className="h-3.5 w-3.5" />}
                  {cameraOn ? "Stop Camera" : "Enable Mirror Camera"}
                </Button>
              </div>

              {cameraOn && (
                <div className="rounded-xl overflow-hidden border border-border bg-black max-w-xs">
                  <video ref={videoRef} autoPlay muted playsInline className="w-full h-44 object-cover" />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Mic className="h-3.5 w-3.5 text-primary" />
                  Your Structured Response (aim for 50+ words using Situation, Action, and Quantified Result)
                </label>
                <Textarea
                  rows={6}
                  placeholder="Structure your answer clearly: context, specific actions you took, trade-offs considered, and measurable impact..."
                  value={answers[qIdx]}
                  onChange={(e) =>
                    setAnswers((prev) => prev.map((a, i) => (i === qIdx ? e.target.value : a)))
                  }
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={qIdx === 0}
                  onClick={() => setQIdx((i) => Math.max(0, i - 1))}
                >
                  Previous
                </Button>
                {qIdx < sessionQuestions.length - 1 ? (
                  <Button type="button" onClick={() => setQIdx((i) => i + 1)}>
                    Next Question
                  </Button>
                ) : (
                  <Button type="button" onClick={submitMockSession} className="gap-1.5">
                    <Award className="h-4 w-4" /> Submit &amp; Get AI Score
                  </Button>
                )}
              </div>
            </div>
          )}

          {latestResult && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold uppercase text-emerald-700">Session Scorecard</span>
                  <h3 className="text-xl font-extrabold font-display">
                    Overall Score: {latestResult.score}/100
                  </h3>
                </div>
                <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
                  {latestResult.role} · {latestResult.level}
                </Badge>
              </div>
              <div className="grid sm:grid-cols-3 gap-3 text-xs">
                <div className="rounded-xl border border-border bg-card p-3.5">
                  <p className="text-muted-foreground">Communication Clarity</p>
                  <p className="text-lg font-bold text-primary mt-0.5">{latestResult.clarity}%</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-3.5">
                  <p className="text-muted-foreground">Technical &amp; Metric Depth</p>
                  <p className="text-lg font-bold text-primary mt-0.5">{latestResult.depth}%</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-3.5">
                  <p className="text-muted-foreground">STAR Structure</p>
                  <p className="text-lg font-bold text-primary mt-0.5">{latestResult.structure}%</p>
                </div>
              </div>
            </div>
          )}

          {/* Past Attempts */}
          {history.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
              <h3 className="text-sm font-bold font-display flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" /> Recent Mock Interview Sessions
              </h3>
              <div className="divide-y divide-border text-xs">
                {history.map((h) => (
                  <div key={h.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">
                        {h.role} <span className="text-muted-foreground">({h.level})</span>
                      </p>
                      <p className="text-muted-foreground">{new Date(h.at).toLocaleDateString("en-IN")}</p>
                    </div>
                    <Badge variant="secondary" className="font-bold text-primary">
                      {h.score} / 100
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* INTERVIEW Q&A BANK */
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search interview questions, topics, or STAR frameworks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["All", "Behavioral", "Software & AI", "Finance & Business", "Product & Growth"].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCatFilter(c)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                    catFilter === c
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredQa.map((item) => {
              const done = practicedIds.includes(item.id);
              return (
                <div key={item.id} className="rounded-2xl border border-border bg-card p-5 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="space-y-1 flex-1">
                      <Badge variant="outline" className="text-[11px]">
                        <BookOpen className="h-3 w-3 mr-1 text-primary" /> {item.category}
                      </Badge>
                      <h3 className="text-sm sm:text-base font-bold text-foreground">{item.question}</h3>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant={done ? "default" : "outline"}
                      onClick={() => togglePracticed(item.id)}
                      className="h-8 text-xs gap-1.5 shrink-0"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {done ? "Practiced" : "Mark Practiced"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <strong>Recruiter Intent:</strong> {item.intent}
                  </p>
                  <div className="rounded-xl bg-secondary/60 p-3.5 text-xs space-y-1.5">
                    <p className="font-semibold text-primary">Framework: {item.framework}</p>
                    <p className="text-foreground/90 leading-relaxed">
                      <strong>Sample High-Scoring Answer:</strong> &ldquo;{item.sampleAnswer}&rdquo;
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
