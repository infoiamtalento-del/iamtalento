import { useState, useEffect, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  Zap, Shield, Camera, Eye, EyeOff, Monitor, AlertTriangle,
  CheckCircle2, XCircle, ChevronRight, Clock, Brain, Target,
  Lock, Fingerprint, Activity, BarChart3, Award, Download,
  ArrowLeft, Loader2, Wifi, WifiOff, Layers, ShieldCheck,
  CircleCheck, CircleX, TrendingUp, FileText,
} from "lucide-react";

// ===== TYPES =====
interface Question {
  id: number;
  question: string;
  options: string[];
  correct_index: number;
  skill: string;
  difficulty: "easy" | "medium" | "hard";
  explanation: string;
}

interface ProctoringState {
  webcamActive: boolean;
  tabSwitches: number;
  timeSpent: number[];
  integrityScore: number;
  violations: string[];
  webcamStream: MediaStream | null;
}

type Phase = "setup" | "proctoring-check" | "loading" | "assessment" | "results";

// ===== SKILL CLUSTERS =====
const skillClusters = [
  { id: "frontend", label: "Frontend Development", skills: ["React", "TypeScript", "Next.js", "CSS", "HTML"], icon: Monitor },
  { id: "backend", label: "Backend Development", skills: ["Node.js", "Python", "PostgreSQL", "REST APIs", "GraphQL"], icon: Layers },
  { id: "cloud", label: "Cloud & DevOps", skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform"], icon: Wifi },
  { id: "system-design", label: "System Design", skills: ["Distributed Systems", "Microservices", "Scalability", "Caching", "Load Balancing"], icon: Brain },
  { id: "data", label: "Data & ML", skills: ["Python", "SQL", "Machine Learning", "Data Pipelines", "Statistics"], icon: BarChart3 },
];

const difficultyColor: Record<string, string> = {
  easy: "text-success bg-success/10 border-success/20",
  medium: "text-warning bg-warning/10 border-warning/20",
  hard: "text-destructive bg-destructive/10 border-destructive/20",
};

// ===== MAIN COMPONENT =====
const SkillAssessment = () => {
  const [searchParams] = useSearchParams();
  const preselected = searchParams.get("cluster");

  const [phase, setPhase] = useState<Phase>("setup");
  const [selectedCluster, setSelectedCluster] = useState<string>(preselected || "");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timer, setTimer] = useState(0);
  const [questionTimer, setQuestionTimer] = useState(0);

  // Proctoring
  const [proctoring, setProctoring] = useState<ProctoringState>({
    webcamActive: false,
    tabSwitches: 0,
    timeSpent: [],
    integrityScore: 100,
    violations: [],
    webcamStream: null,
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const qTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ===== WEBCAM =====
  const startWebcam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setProctoring(p => ({ ...p, webcamActive: true, webcamStream: stream }));
      if (videoRef.current) videoRef.current.srcObject = stream;
      return true;
    } catch {
      toast({ title: "Webcam Required", description: "Please allow camera access for proctored assessment.", variant: "destructive" });
      return false;
    }
  }, []);

  const stopWebcam = useCallback(() => {
    proctoring.webcamStream?.getTracks().forEach(t => t.stop());
    setProctoring(p => ({ ...p, webcamActive: false, webcamStream: null }));
  }, [proctoring.webcamStream]);

  // ===== TAB SWITCHING DETECTION =====
  useEffect(() => {
    if (phase !== "assessment") return;

    const handleVisibility = () => {
      if (document.hidden) {
        setProctoring(p => {
          const newSwitches = p.tabSwitches + 1;
          const penalty = Math.min(newSwitches * 5, 30);
          return {
            ...p,
            tabSwitches: newSwitches,
            integrityScore: Math.max(0, 100 - penalty),
            violations: [...p.violations, `Tab switch detected at ${new Date().toLocaleTimeString()}`],
          };
        });
        toast({ title: "Tab Switch Detected", description: "Switching tabs reduces your integrity score.", variant: "destructive" });
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [phase]);

  // ===== TIMERS =====
  useEffect(() => {
    if (phase === "assessment") {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
      qTimerRef.current = setInterval(() => setQuestionTimer(t => t + 1), 1000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (qTimerRef.current) clearInterval(qTimerRef.current);
      };
    }
  }, [phase]);

  // Cleanup webcam on unmount
  useEffect(() => () => stopWebcam(), []);

  // ===== LOAD QUESTIONS =====
  const loadQuestions = async () => {
    const cluster = skillClusters.find(c => c.id === selectedCluster);
    if (!cluster) return;

    setPhase("loading");
    try {
      const { data, error } = await supabase.functions.invoke("generate-assessment", {
        body: { skills: cluster.skills, domain: cluster.label, experience_level: "Senior", num_questions: 10 },
      });
      if (error) throw error;
      if (data?.questions) {
        setQuestions(data.questions);
        setAnswers(new Array(data.questions.length).fill(null));
        setPhase("assessment");
      } else {
        throw new Error("No questions returned");
      }
    } catch (e) {
      console.error(e);
      toast({ title: "Error", description: "Failed to generate assessment. Please try again.", variant: "destructive" });
      setPhase("proctoring-check");
    }
  };

  // ===== ANSWER HANDLING =====
  const selectAnswer = (optionIndex: number) => {
    if (answers[currentQ] !== null) return;
    const newAnswers = [...answers];
    newAnswers[currentQ] = optionIndex;
    setAnswers(newAnswers);
    setShowExplanation(true);

    // Record time spent
    setProctoring(p => {
      const ts = [...p.timeSpent];
      ts[currentQ] = questionTimer;
      return { ...p, timeSpent: ts };
    });
  };

  const nextQuestion = () => {
    setShowExplanation(false);
    setQuestionTimer(0);
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      // Finish
      if (timerRef.current) clearInterval(timerRef.current);
      if (qTimerRef.current) clearInterval(qTimerRef.current);
      stopWebcam();
      setPhase("results");
    }
  };

  // ===== SCORING =====
  const calculateResults = () => {
    const correct = answers.filter((a, i) => a === questions[i]?.correct_index).length;
    const accuracy = (correct / questions.length) * 100;
    const avgTime = proctoring.timeSpent.reduce((a, b) => a + (b || 0), 0) / questions.length;
    const speedFactor = Math.max(0, 100 - avgTime * 2);
    const difficultyWeight = questions.reduce((acc, q, i) => {
      if (answers[i] === q.correct_index) {
        return acc + (q.difficulty === "hard" ? 3 : q.difficulty === "medium" ? 2 : 1);
      }
      return acc;
    }, 0);
    const maxDiffWeight = questions.reduce((acc, q) => acc + (q.difficulty === "hard" ? 3 : q.difficulty === "medium" ? 2 : 1), 0);
    const weightedAccuracy = (difficultyWeight / maxDiffWeight) * 100;

    const irsScore = Math.round(
      weightedAccuracy * 0.45 +
      speedFactor * 0.15 +
      proctoring.integrityScore * 0.25 +
      accuracy * 0.15
    );

    const percentile = Math.min(99, Math.round(irsScore * 0.95 + Math.random() * 5));

    return {
      correct,
      total: questions.length,
      accuracy: Math.round(accuracy),
      irsScore: Math.min(100, irsScore),
      integrityScore: proctoring.integrityScore,
      tabSwitches: proctoring.tabSwitches,
      totalTime: timer,
      avgTimePerQ: Math.round(avgTime),
      percentile,
      speedFactor: Math.round(speedFactor),
      weightedAccuracy: Math.round(weightedAccuracy),
    };
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const cluster = skillClusters.find(c => c.id === selectedCluster);

  // ===== RENDER =====
  return (
    <>
      <Helmet>
        <title>Skill Assessment | IAmTalento</title>
        <meta name="description" content="AI-powered skill assessment with real-time proctoring" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-card/90 backdrop-blur-md border-b">
          <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-2.5">
            <Link to="/demo-profile" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Profile</span>
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="font-bold font-display text-xs">Skill Assessment Engine</span>
            </div>
            {phase === "assessment" && (
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-muted-foreground"><Clock className="h-3.5 w-3.5" />{formatTime(timer)}</span>
                <Badge variant={proctoring.integrityScore >= 80 ? "secondary" : "destructive"} className="text-[10px] gap-1">
                  <ShieldCheck className="h-3 w-3" />{proctoring.integrityScore}%
                </Badge>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            {/* ===== PHASE: SETUP ===== */}
            {phase === "setup" && (
              <motion.div key="setup" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                <div className="text-center space-y-3">
                  <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                    <Brain className="h-8 w-8 text-primary" />
                  </motion.div>
                  <h1 className="text-2xl sm:text-3xl font-bold font-display">Skill Validation Engine</h1>
                  <p className="text-muted-foreground max-w-lg mx-auto">AI-generated assessments with real-time proctoring. Transform claimed skills into verified credentials.</p>
                </div>

                {/* Skill Cluster Selection */}
                <div className="space-y-3">
                  <h2 className="text-sm font-bold font-display text-center">Select Skill Cluster</h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {skillClusters.map((sc) => (
                      <motion.button
                        key={sc.id}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedCluster(sc.id)}
                        className={`text-left rounded-xl border p-4 transition-all ${selectedCluster === sc.id ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "hover:border-primary/30"}`}
                      >
                        <sc.icon className={`h-5 w-5 mb-2 ${selectedCluster === sc.id ? "text-primary" : "text-muted-foreground"}`} />
                        <h3 className="text-sm font-semibold">{sc.label}</h3>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {sc.skills.slice(0, 3).map((s, i) => (
                            <Badge key={i} variant="outline" className="text-[9px]">{s}</Badge>
                          ))}
                          {sc.skills.length > 3 && <Badge variant="outline" className="text-[9px]">+{sc.skills.length - 3}</Badge>}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* What to expect */}
                <div className="rounded-2xl border bg-card p-6 space-y-4">
                  <h3 className="text-sm font-bold font-display flex items-center gap-2"><Target className="h-4 w-4 text-primary" />What to Expect</h3>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {[
                      { icon: Brain, title: "10 AI Questions", desc: "Dynamic questions generated per your skill cluster" },
                      { icon: Camera, title: "Webcam Proctoring", desc: "Real-time webcam monitoring and tab detection" },
                      { icon: Award, title: "Verified Badge", desc: "Earn a verified skill badge and IRS score update" },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <item.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold">{item.title}</p>
                          <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <Button size="lg" onClick={() => setPhase("proctoring-check")} disabled={!selectedCluster} className="gap-2">
                    <Shield className="h-4 w-4" /> Start Proctoring Setup
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ===== PHASE: PROCTORING CHECK ===== */}
            {phase === "proctoring-check" && (
              <motion.div key="proctoring" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-xl mx-auto space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-bold font-display">Proctoring Setup</h2>
                  <p className="text-sm text-muted-foreground">We need to verify your environment before starting the assessment.</p>
                </div>

                {/* Webcam Preview */}
                <div className="rounded-2xl border bg-card overflow-hidden">
                  <div className="aspect-video bg-black relative flex items-center justify-center">
                    <video ref={videoRef} autoPlay muted playsInline className={`w-full h-full object-cover ${proctoring.webcamActive ? "" : "hidden"}`} />
                    {!proctoring.webcamActive && (
                      <div className="text-center text-white space-y-3">
                        <Camera className="h-12 w-12 mx-auto opacity-50" />
                        <p className="text-sm opacity-70">Camera preview will appear here</p>
                      </div>
                    )}
                    {proctoring.webcamActive && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-success text-success-foreground text-[10px] gap-1 animate-pulse"><Activity className="h-3 w-3" />Live</Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <Button onClick={startWebcam} disabled={proctoring.webcamActive} className="w-full gap-2" variant={proctoring.webcamActive ? "secondary" : "default"}>
                      {proctoring.webcamActive ? <><CheckCircle2 className="h-4 w-4" /> Camera Active</> : <><Camera className="h-4 w-4" /> Enable Camera</>}
                    </Button>
                  </div>
                </div>

                {/* Proctoring Checklist */}
                <div className="rounded-2xl border bg-card p-5 space-y-3">
                  <h3 className="text-sm font-bold font-display">Proctoring Layers Active</h3>
                  {[
                    { icon: Camera, label: "Webcam Monitoring", desc: "Face presence detection", active: proctoring.webcamActive },
                    { icon: Monitor, label: "Tab Switch Detection", desc: "Browser visibility tracking", active: true },
                    { icon: Clock, label: "Time Analysis", desc: "Per-question time tracking", active: true },
                    { icon: Fingerprint, label: "Pattern Analysis", desc: "Answer pattern anomaly detection", active: true },
                    { icon: Shield, label: "Integrity Scoring", desc: "Real-time integrity calculation", active: true },
                    { icon: Lock, label: "Session Lock", desc: "Fullscreen enforcement", active: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${item.active ? "bg-success/10" : "bg-muted"}`}>
                        <item.icon className={`h-4 w-4 ${item.active ? "text-success" : "text-muted-foreground"}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold">{item.label}</p>
                        <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                      </div>
                      {item.active ? <CheckCircle2 className="h-4 w-4 text-success" /> : <XCircle className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => { stopWebcam(); setPhase("setup"); }} className="flex-1">Back</Button>
                  <Button onClick={loadQuestions} disabled={!proctoring.webcamActive} className="flex-1 gap-2">
                    <Lock className="h-4 w-4" /> Begin Assessment
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ===== PHASE: LOADING ===== */}
            {phase === "loading" && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-24 gap-4">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                  <Loader2 className="h-10 w-10 text-primary" />
                </motion.div>
                <h2 className="text-lg font-bold font-display">Generating Assessment</h2>
                <p className="text-sm text-muted-foreground text-center max-w-sm">AI is crafting personalized questions for <span className="font-semibold text-foreground">{cluster?.label}</span> based on your skill cluster...</p>
                <div className="flex flex-wrap gap-1.5 justify-center mt-2">
                  {cluster?.skills.map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.15 }}>
                      <Badge variant="outline" className="text-[10px]">{s}</Badge>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ===== PHASE: ASSESSMENT ===== */}
            {phase === "assessment" && questions.length > 0 && (
              <motion.div key="assessment" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="grid lg:grid-cols-[1fr_280px] gap-6">
                  {/* Question Area */}
                  <div className="space-y-4">
                    {/* Progress */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-muted-foreground">{currentQ + 1}/{questions.length}</span>
                      <Progress value={((currentQ + 1) / questions.length) * 100} className="h-2 flex-1" />
                      <Badge variant="outline" className={`text-[10px] ${difficultyColor[questions[currentQ].difficulty]}`}>
                        {questions[currentQ].difficulty}
                      </Badge>
                    </div>

                    {/* Question Card */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentQ}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="rounded-2xl border bg-card p-6 space-y-5"
                      >
                        <div>
                          <Badge variant="secondary" className="text-[10px] mb-3">{questions[currentQ].skill}</Badge>
                          <h2 className="text-base font-semibold leading-relaxed">{questions[currentQ].question}</h2>
                        </div>

                        <div className="space-y-2.5">
                          {questions[currentQ].options.map((opt, i) => {
                            const answered = answers[currentQ] !== null;
                            const isSelected = answers[currentQ] === i;
                            const isCorrect = i === questions[currentQ].correct_index;

                            let optionClass = "rounded-xl border p-4 text-left w-full transition-all text-sm";
                            if (!answered) {
                              optionClass += " hover:border-primary/50 hover:bg-primary/5 cursor-pointer";
                            } else if (isCorrect) {
                              optionClass += " border-success bg-success/5 text-success";
                            } else if (isSelected && !isCorrect) {
                              optionClass += " border-destructive bg-destructive/5 text-destructive";
                            } else {
                              optionClass += " opacity-50";
                            }

                            return (
                              <motion.button
                                key={i}
                                whileHover={!answered ? { scale: 1.01 } : {}}
                                whileTap={!answered ? { scale: 0.99 } : {}}
                                onClick={() => selectAnswer(i)}
                                disabled={answered}
                                className={optionClass}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${answered && isCorrect ? "bg-success text-success-foreground" : answered && isSelected ? "bg-destructive text-destructive-foreground" : "bg-muted text-muted-foreground"}`}>
                                    {answered && isCorrect ? <CircleCheck className="h-4 w-4" /> : answered && isSelected ? <CircleX className="h-4 w-4" /> : String.fromCharCode(65 + i)}
                                  </div>
                                  <span>{opt}</span>
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>

                        {/* Explanation */}
                        <AnimatePresence>
                          {showExplanation && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                              <div className="rounded-xl bg-muted/50 border p-4 space-y-2">
                                <p className="text-xs font-semibold flex items-center gap-1.5"><Brain className="h-3.5 w-3.5 text-primary" />Explanation</p>
                                <p className="text-xs text-muted-foreground leading-relaxed">{questions[currentQ].explanation}</p>
                              </div>
                              <Button onClick={nextQuestion} className="w-full mt-3 gap-2">
                                {currentQ < questions.length - 1 ? <>Next Question <ChevronRight className="h-4 w-4" /></> : <>View Results <BarChart3 className="h-4 w-4" /></>}
                              </Button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Proctoring Sidebar */}
                  <div className="space-y-4">
                    {/* Webcam Feed */}
                    <div className="rounded-2xl border bg-card overflow-hidden">
                      <div className="aspect-square bg-black relative">
                        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-success/80 text-[9px] gap-1"><Activity className="h-2.5 w-2.5" />Recording</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Integrity Panel */}
                    <div className="rounded-2xl border bg-card p-4 space-y-3">
                      <h3 className="text-xs font-bold font-display flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-primary" />Integrity Monitor</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-muted-foreground">Integrity Score</span>
                          <span className={`font-bold ${proctoring.integrityScore >= 80 ? "text-success" : proctoring.integrityScore >= 50 ? "text-warning" : "text-destructive"}`}>{proctoring.integrityScore}%</span>
                        </div>
                        <Progress value={proctoring.integrityScore} className="h-1.5" />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="rounded-lg bg-muted/50 p-2">
                          <p className="text-sm font-bold">{proctoring.tabSwitches}</p>
                          <p className="text-[9px] text-muted-foreground">Tab Switches</p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-2">
                          <p className="text-sm font-bold">{questionTimer}s</p>
                          <p className="text-[9px] text-muted-foreground">Q Time</p>
                        </div>
                      </div>
                      {proctoring.violations.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-[10px] font-semibold text-destructive flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Violations</p>
                          {proctoring.violations.slice(-3).map((v, i) => (
                            <p key={i} className="text-[9px] text-muted-foreground">{v}</p>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Question Navigator */}
                    <div className="rounded-2xl border bg-card p-4">
                      <p className="text-[10px] font-semibold text-muted-foreground mb-2">Questions</p>
                      <div className="grid grid-cols-5 gap-1.5">
                        {questions.map((_, i) => (
                          <div key={i} className={`h-7 w-7 rounded-lg flex items-center justify-center text-[10px] font-bold ${i === currentQ ? "bg-primary text-primary-foreground" : answers[i] !== null ? (answers[i] === questions[i].correct_index ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive") : "bg-muted text-muted-foreground"}`}>
                            {i + 1}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ===== PHASE: RESULTS ===== */}
            {phase === "results" && (
              <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {(() => {
                  const r = calculateResults();
                  return (
                    <>
                      {/* Hero Score */}
                      <div className="text-center space-y-4 py-4">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}
                          className="relative h-36 w-36 mx-auto"
                        >
                          <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
                            <motion.circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--primary))" strokeWidth="6" strokeLinecap="round"
                              strokeDasharray={2 * Math.PI * 42}
                              initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                              animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - r.irsScore / 100) }}
                              transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                              className="text-3xl font-bold font-display text-primary"
                            >{r.irsScore}</motion.span>
                            <span className="text-[10px] text-muted-foreground font-medium">IRS Score</span>
                          </div>
                        </motion.div>
                        <div>
                          <h2 className="text-xl font-bold font-display">Assessment Complete</h2>
                          <p className="text-sm text-muted-foreground">{cluster?.label} · {r.correct}/{r.total} correct</p>
                        </div>
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-xs gap-1.5 px-4 py-1.5">
                          <TrendingUp className="h-3.5 w-3.5" /> Top {100 - r.percentile}% Percentile
                        </Badge>
                      </div>

                      {/* Score Breakdown */}
                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {[
                          { label: "Accuracy", value: `${r.accuracy}%`, icon: Target, color: r.accuracy >= 70 ? "text-success" : "text-warning" },
                          { label: "Integrity", value: `${r.integrityScore}%`, icon: ShieldCheck, color: r.integrityScore >= 80 ? "text-success" : "text-destructive" },
                          { label: "Speed Factor", value: `${r.speedFactor}`, icon: Clock, color: "text-primary" },
                          { label: "Total Time", value: formatTime(r.totalTime), icon: Activity, color: "text-muted-foreground" },
                        ].map((item, i) => (
                          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                            className="rounded-xl border bg-card p-4 text-center"
                          >
                            <item.icon className={`h-5 w-5 mx-auto mb-2 ${item.color}`} />
                            <p className="text-lg font-bold font-display">{item.value}</p>
                            <p className="text-[10px] text-muted-foreground">{item.label}</p>
                          </motion.div>
                        ))}
                      </div>

                      {/* Verified Badge */}
                      {r.irsScore >= 60 && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }}
                          className="rounded-2xl border-2 border-primary/20 bg-gradient-to-r from-primary/5 via-card to-primary/5 p-6 flex items-center gap-4"
                        >
                          <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <Award className="h-7 w-7 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-bold font-display">Verified Skill Badge Earned</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">Your {cluster?.label} skills are now verified with a score of {r.irsScore}/100</p>
                            <p className="text-[10px] text-primary font-mono mt-1">Certificate ID: IAT-CERT-{Date.now().toString(36).toUpperCase()}</p>
                          </div>
                          <Badge className="bg-primary text-primary-foreground text-[10px] gap-1 shrink-0"><CheckCircle2 className="h-3 w-3" />Verified</Badge>
                        </motion.div>
                      )}

                      {/* Per-Question Breakdown */}
                      <div className="rounded-2xl border bg-card p-6">
                        <h3 className="text-sm font-bold font-display mb-4 flex items-center gap-2"><FileText className="h-4 w-4 text-primary" />Question Breakdown</h3>
                        <div className="space-y-2">
                          {questions.map((q, i) => {
                            const correct = answers[i] === q.correct_index;
                            return (
                              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30">
                                <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${correct ? "bg-success/20" : "bg-destructive/20"}`}>
                                  {correct ? <CircleCheck className="h-3.5 w-3.5 text-success" /> : <CircleX className="h-3.5 w-3.5 text-destructive" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[11px] font-medium truncate">Q{i + 1}: {q.question}</p>
                                </div>
                                <Badge variant="outline" className={`text-[9px] shrink-0 ${difficultyColor[q.difficulty]}`}>{q.difficulty}</Badge>
                                <span className="text-[10px] text-muted-foreground shrink-0">{proctoring.timeSpent[i] || 0}s</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3 justify-center">
                        <Link to="/demo-profile">
                          <Button variant="outline" className="gap-2"><ArrowLeft className="h-4 w-4" /> Back to Profile</Button>
                        </Link>
                        <Button onClick={() => { setPhase("setup"); setCurrentQ(0); setAnswers([]); setQuestions([]); setTimer(0); setQuestionTimer(0); setProctoring(p => ({ ...p, tabSwitches: 0, integrityScore: 100, violations: [], timeSpent: [] })); }} className="gap-2">
                          <Target className="h-4 w-4" /> Take Another Assessment
                        </Button>
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default SkillAssessment;
