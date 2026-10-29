import React, { useState, useEffect } from "react";
import {
  Award,
  Calendar,
  CheckCircle2,
  Download,
  Share2,
  Plus,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Clock,
  Sparkles,
  Trash2,
  Pencil,
  GraduationCap,
  BadgeCheck,
  Check,
  Link2,
  Play,
  Laptop,
  Camera,
  Mic,
  Wifi,
  Lock,
  BarChart3,
  TrendingUp,
  Target,
  FileCheck2,
  AlertCircle,
  ChevronRight,
  Building2,
  Code2,
  Layers,
  Brain,
  Timer,
  Eye,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ProUser, POPULAR_CERTS } from "@/data/proData";
import { ProHero } from "./ProHero";
import { MatchRing } from "./ProMatchRing";
import { ProDrawerState, ProView } from "./proTypes";
import { LiveCirStrip } from "./live/LiveCirStrip";
import {
  downloadCertificatePdf,
  downloadCirReportPdf,
  type RealTimeCertificateData,
} from "@/utils/credentialPdf";
import logoAws from "@/assets/logo-aws.svg";
import logoGoogle from "@/assets/logo-google.svg";
import logoMeta from "@/assets/logo-meta.svg";

interface ProCertificationsViewProps {
  user: ProUser;
  mode?: "assessments" | "certifications";
  isLive?: boolean;
  onAddCertification: (certStr: string) => void;
  onRemoveCertification: (index: number) => void;
  onOpenDrawer: (drawer: ProDrawerState) => void;
  onNavigateToQuiz?: (skill: string) => void;
  onNavigate?: (view: ProView) => void;
  onUpdateUser?: (updated: ProUser) => void;
  onToast?: (msg: string) => void;
}

const COURSE_WEEKS = ["4 weeks", "3 weeks", "6 weeks", "4 weeks", "5 weeks", "4 weeks"];
const VALID_YEARS = 2;

const initials = (s: string) =>
  s
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

const tile = "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary";

const issuerLogo = (name: string): string | undefined => {
  const n = name.toLowerCase();
  if (n.includes("amazon") || n.includes("aws")) return logoAws;
  if (n.includes("google")) return logoGoogle;
  if (n.includes("meta")) return logoMeta;
  return undefined;
};

const IssuerMark: React.FC<{ name: string; size?: "sm" | "md" }> = ({ name, size = "md" }) => {
  const logo = issuerLogo(name);
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl border border-border bg-muted/40 font-display font-bold text-primary",
        size === "md" ? "h-11 w-11 text-sm" : "h-9 w-9 text-xs"
      )}
    >
      {logo ? (
        <img src={logo} alt="" className={cn("object-contain", size === "md" ? "h-7 w-7" : "h-5 w-5")} loading="lazy" />
      ) : (
        initials(name)
      )}
    </span>
  );
};

interface AssessmentMetadata {
  skill: string;
  category: "Frontend" | "Backend" | "Data & SQL" | "Architecture" | "Cloud";
  level: "Intermediate" | "Advanced" | "Core";
  duration: string;
  questionsCount: number;
  codingTasks: number;
  hiringPartners: number;
  percentile: string;
  integrityScore: string;
  attemptedAt: string;
  subSkills: { name: string; score: number }[];
  questions: {
    q: string;
    options: string[];
    answer: number;
    explanation: string;
  }[];
}

const ASSESSMENT_CATALOG: AssessmentMetadata[] = [
  {
    skill: "React",
    category: "Frontend",
    level: "Advanced",
    duration: "45 mins",
    questionsCount: 25,
    codingTasks: 1,
    hiringPartners: 1420,
    percentile: "Top 6%",
    integrityScore: "99.8%",
    attemptedAt: "Oct 19, 2026",
    subSkills: [
      { name: "Hooks & Concurrent Rendering", score: 91 },
      { name: "State Architecture & Context", score: 86 },
      { name: "Bundle & Render Optimization", score: 84 },
    ],
    questions: [
      {
        q: "Which React hook is best suited for deferring re-rendering of a non-urgent UI subtree in React 18?",
        options: ["useMemo", "useDeferredValue", "useLayoutEffect", "useImperativeHandle"],
        answer: 1,
        explanation: "useDeferredValue lets you defer updating a non-critical part of the UI while keeping input responsive.",
      },
      {
        q: "When does React execute the cleanup function returned from useEffect?",
        options: [
          "Only when the application closes",
          "Before the component re-runs the effect on dependency change and on unmount",
          "Synchronously before the browser paints",
          "Only when an error boundary catches an exception",
        ],
        answer: 1,
        explanation: "React runs cleanup before re-running the effect for new dependencies and when the component unmounts.",
      },
      {
        q: "What prevents unnecessary child re-renders when passing a callback prop to a React.memo child?",
        options: ["Wrapping the callback in useCallback", "Using useRef for JSX", "Calling forceUpdate", "Using inline arrow functions"],
        answer: 0,
        explanation: "useCallback preserves referential equality across renders so React.memo children do not re-render unnecessarily.",
      },
    ],
  },
  {
    skill: "JavaScript",
    category: "Frontend",
    level: "Advanced",
    duration: "40 mins",
    questionsCount: 30,
    codingTasks: 1,
    hiringPartners: 1680,
    percentile: "Top 11%",
    integrityScore: "99.5%",
    attemptedAt: "Oct 14, 2026",
    subSkills: [
      { name: "Event Loop & Microtasks", score: 85 },
      { name: "Closures & Prototypal Scope", score: 82 },
      { name: "Async / Promise Concurrency", score: 79 },
    ],
    questions: [
      {
        q: "In what order does the JavaScript runtime process callbacks after the call stack clears?",
        options: [
          "Macrotask queue first, then Microtask queue",
          "Microtask queue (Promises) completely before the next Macrotask (setTimeout)",
          "Randomly based on timer duration",
          "requestAnimationFrame before Promise.then",
        ],
        answer: 1,
        explanation: "All queued microtasks (such as Promise callbacks) execute to completion before the event loop picks the next macrotask.",
      },
      {
        q: "Which Promise combinator resolves as soon as any input promise fulfills, ignoring rejections unless all reject?",
        options: ["Promise.all", "Promise.race", "Promise.any", "Promise.allSettled"],
        answer: 2,
        explanation: "Promise.any resolves with the first fulfilled promise and only rejects with AggregateError if every promise rejects.",
      },
      {
        q: "What is the result of typeof null in standard ECMAScript?",
        options: ["'null'", "'object'", "'undefined'", "'number'"],
        answer: 1,
        explanation: "Due to a historical legacy tag in JS values, typeof null evaluates to 'object'.",
      },
    ],
  },
  {
    skill: "TypeScript",
    category: "Frontend",
    level: "Intermediate",
    duration: "35 mins",
    questionsCount: 25,
    codingTasks: 1,
    hiringPartners: 1290,
    percentile: "Top 14%",
    integrityScore: "99.6%",
    attemptedAt: "Oct 08, 2026",
    subSkills: [
      { name: "Generics & Utility Types", score: 82 },
      { name: "Discriminated Unions & Narrowing", score: 80 },
      { name: "Strict Null & API Contracts", score: 75 },
    ],
    questions: [
      {
        q: "Which built-in TypeScript utility type constructs a type with all properties of T set to optional?",
        options: ["Required<T>", "Partial<T>", "Pick<T, K>", "Readonly<T>"],
        answer: 1,
        explanation: "Partial<T> marks every property on type T as optional.",
      },
      {
        q: "How does 'unknown' differ from 'any' in TypeScript?",
        options: [
          "They are identical at compile time",
          "'unknown' requires type narrowing or assertion before performing operations on the value",
          "'unknown' can only hold primitive strings",
          "'any' disallows reassignment",
        ],
        answer: 1,
        explanation: "'unknown' is the type-safe counterpart to 'any' and forces narrowing before property access.",
      },
      {
        q: "Which keyword infers a type variable inside a conditional type's true branch?",
        options: ["infer", "keyof", "typeof", "satisfies"],
        answer: 0,
        explanation: "The 'infer' keyword declares a type variable to be deduced within a conditional type.",
      },
    ],
  },
  {
    skill: "HTML/CSS",
    category: "Frontend",
    level: "Core",
    duration: "30 mins",
    questionsCount: 25,
    codingTasks: 1,
    hiringPartners: 1510,
    percentile: "Top 4%",
    integrityScore: "100%",
    attemptedAt: "Sep 29, 2026",
    subSkills: [
      { name: "Responsive Grid & Flexbox", score: 94 },
      { name: "WCAG 2.1 Accessibility & ARIA", score: 89 },
      { name: "Core Web Vitals (CLS / LCP)", score: 90 },
    ],
    questions: [
      {
        q: "Which CSS property creates a new stacking context without changing layout positioning?",
        options: ["isolation: isolate", "display: inline", "float: left", "overflow: visible"],
        answer: 0,
        explanation: "isolation: isolate creates a new stacking context cleanly without requiring position or z-index.",
      },
      {
        q: "Which HTML attribute ensures screen readers announce dynamic status updates politely without moving focus?",
        options: ["aria-live='polite'", "tabindex='-1'", "role='presentation'", "aria-hidden='true'"],
        answer: 0,
        explanation: "aria-live='polite' queues assistive technology announcements at the next graceful pause.",
      },
      {
        q: "What unit sizes an element relative to the root <html> font-size?",
        options: ["em", "rem", "vh", "ch"],
        answer: 1,
        explanation: "'rem' stands for root em and scales consistently with the root document font size.",
      },
    ],
  },
  {
    skill: "SQL",
    category: "Data & SQL",
    level: "Intermediate",
    duration: "35 mins",
    questionsCount: 20,
    codingTasks: 2,
    hiringPartners: 1340,
    percentile: "Top 28%",
    integrityScore: "99.1%",
    attemptedAt: "Sep 18, 2026",
    subSkills: [
      { name: "Joins & Aggregations", score: 74 },
      { name: "Window Functions (RANK / LAG)", score: 62 },
      { name: "Indexing & Query Execution Plans", score: 56 },
    ],
    questions: [
      {
        q: "Which SQL clause filters grouped rows AFTER aggregate functions have been computed?",
        options: ["WHERE", "HAVING", "ORDER BY", "DISTINCT"],
        answer: 1,
        explanation: "HAVING filters groups created by GROUP BY, whereas WHERE filters individual rows before grouping.",
      },
      {
        q: "Which window function assigns consecutive ranks without gaps when ties occur?",
        options: ["ROW_NUMBER()", "RANK()", "DENSE_RANK()", "NTILE()"],
        answer: 2,
        explanation: "DENSE_RANK() assigns identical ranks to ties and does not skip subsequent rank numbers.",
      },
      {
        q: "What is the primary benefit of a composite B-Tree index on (company_id, created_at)?",
        options: [
          "It speeds up queries filtering by company_id and sorting by created_at",
          "It automatically encrypts the table",
          "It removes foreign key constraints",
          "It doubles disk storage speed for all tables",
        ],
        answer: 0,
        explanation: "A composite index on (company_id, created_at) satisfies equality lookups on company_id and range/order scans on created_at.",
      },
    ],
  },
  {
    skill: "System Design",
    category: "Architecture",
    level: "Advanced",
    duration: "60 mins",
    questionsCount: 20,
    codingTasks: 1,
    hiringPartners: 890,
    percentile: "Top 9%",
    integrityScore: "99.7%",
    attemptedAt: "Oct 22, 2026",
    subSkills: [
      { name: "Caching & CDN Invalidation", score: 88 },
      { name: "Micro-Frontend & API Gateways", score: 84 },
      { name: "Rate Limiting & High Availability", score: 82 },
    ],
    questions: [
      {
        q: "Which caching strategy writes data to both the cache and the underlying database synchronously?",
        options: ["Cache-Aside", "Write-Through", "Write-Back (Write-Behind)", "Read-Through"],
        answer: 1,
        explanation: "Write-Through updates the cache and backing store together, ensuring strong cache consistency.",
      },
      {
        q: "What algorithm is commonly used in distributed API gateways to allow short bursts while enforcing an average request rate?",
        options: ["Token Bucket", "Bubble Sort", "Dijkstra's Algorithm", "Round Robin"],
        answer: 0,
        explanation: "Token Bucket permits controlled burst traffic up to bucket capacity while replenishing tokens at a steady rate.",
      },
      {
        q: "In the CAP theorem, what trade-off must a distributed database make during a network partition (P)?",
        options: [
          "Choose between Consistency (C) and Availability (A)",
          "Choose between Latency and Bandwidth",
          "Disable all encryption",
          "Switch from TCP to UDP",
        ],
        answer: 0,
        explanation: "When a network partition occurs, a distributed store must trade off between strict Consistency and full Availability.",
      },
    ],
  },
];

const EMPLOYER_INVITED_TESTS = [
  {
    id: "emp-1",
    company: "Zoho",
    role: "Senior Frontend Engineer (React + TypeScript)",
    assessmentName: "Frontend Architecture & Live UI Challenge",
    duration: "45 mins",
    deadline: "Due in 2 days",
    status: "Pending",
    skill: "React",
    matchBoost: "+18% Shortlist Priority",
  },
  {
    id: "emp-2",
    company: "Razorpay",
    role: "Product UI Engineer",
    assessmentName: "JavaScript Concurrency & Design Systems Test",
    duration: "40 mins",
    deadline: "Due in 4 days",
    status: "Pending",
    skill: "JavaScript",
    matchBoost: "Direct Technical Round Fast-Track",
  },
];

const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Select Skill or Role Track",
    desc: "Choose from role-aligned assessments or employer-invited tests.",
    icon: Target,
    status: "Ready",
  },
  {
    step: "02",
    title: "AI Environment Pre-Check",
    desc: "Automated webcam, microphone, browser lock, and ID verification.",
    icon: Camera,
    status: "Automated",
  },
  {
    step: "03",
    title: "Proctored Skill Assessment",
    desc: "Timed domain MCQs & real-world scenario challenges with Cheating Prevention.",
    icon: ShieldCheck,
    status: "AI Monitored",
  },
  {
    step: "04",
    title: "Instant CIR Report & Score",
    desc: "Sub-skill breakdown, percentile rank, and verifiable certificate generation.",
    icon: BarChart3,
    status: "Real-Time",
  },
  {
    step: "05",
    title: "Auto-Sync to Employers",
    desc: "Verified scores unlock priority 24-hour recruiter review & interview invites.",
    icon: Building2,
    status: "Live Sync",
  },
];

export const ProCertificationsView: React.FC<ProCertificationsViewProps> = ({
  user,
  mode = "assessments",
  isLive = false,
  onAddCertification,
  onRemoveCertification,
  onOpenDrawer,
  onNavigate,
  onUpdateUser,
  onToast,
}) => {
  const isCertificationsMode = mode === "certifications";
  const [showAddForm, setShowAddForm] = useState(false);
  const [certName, setCertName] = useState("");
  const [certIssuer, setCertIssuer] = useState("");
  const [certDate, setCertDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [showAllPopular, setShowAllPopular] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [refreshedAt, setRefreshedAt] = useState(() => new Date());
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Interactive Assessment Workflow Modal State
  const [activeAssessment, setActiveAssessment] = useState<AssessmentMetadata | null>(null);
  const [workflowStage, setWorkflowStage] = useState<"precheck" | "test" | "result">("precheck");
  const [preCheckProgress, setPreCheckProgress] = useState({
    camera: false,
    mic: false,
    network: false,
    browserLock: false,
  });
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeLeftSec, setTimeLeftSec] = useState(900);
  const [computedScore, setComputedScore] = useState<number | null>(null);

  // CIR Report Inspection Modal State
  const [inspectCirSkill, setInspectCirSkill] = useState<AssessmentMetadata | null>(null);

  const thisYear = new Date().getFullYear();

  const certItems = (user.ce || []).map((x, i) => {
    const parts = String(x).split(" · ");
    const yearNum = parseInt(parts[2] || "", 10) || thisYear;
    return {
      index: i,
      title: parts[0] || x,
      issuer: parts[1] || "Accredited Provider",
      year: String(yearNum),
      validTill: String(yearNum + VALID_YEARS),
      active: yearNum + VALID_YEARS >= thisYear,
    };
  });

  const latest = certItems[certItems.length - 1];
  const activeCount = certItems.filter((c) => c.active).length;

  // Merge user's real-time scores with catalog metadata
  const userScores: Record<string, number> = {
    React: 86,
    JavaScript: 82,
    TypeScript: 78,
    "HTML/CSS": 90,
    SQL: 64,
    ...(user.as || {}),
  };

  const assessmentEntries = Object.entries(userScores);
  const passedCount = assessmentEntries.filter(([, s]) => s >= 60).length;
  const avgScore = assessmentEntries.length
    ? Math.round(assessmentEntries.reduce((sum, [, s]) => sum + s, 0) / assessmentEntries.length)
    : 82;

  // Timer effect when inside live test stage
  useEffect(() => {
    if (!activeAssessment || workflowStage !== "test") return;
    const timer = setInterval(() => {
      setTimeLeftSec((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [activeAssessment, workflowStage]);

  const startAssessmentWorkflow = (meta: AssessmentMetadata) => {
    setActiveAssessment(meta);
    setWorkflowStage("precheck");
    setPreCheckProgress({ camera: false, mic: false, network: false, browserLock: false });
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setTimeLeftSec(15 * 60);
    setComputedScore(null);

    // Simulate real-time hardware & environment verification checks
    setTimeout(() => setPreCheckProgress((p) => ({ ...p, camera: true })), 350);
    setTimeout(() => setPreCheckProgress((p) => ({ ...p, mic: true })), 700);
    setTimeout(() => setPreCheckProgress((p) => ({ ...p, network: true })), 1050);
    setTimeout(() => setPreCheckProgress((p) => ({ ...p, browserLock: true })), 1400);
  };

  const handleFinishTest = () => {
    if (!activeAssessment) return;
    const totalQ = activeAssessment.questions.length;
    let correct = 0;
    activeAssessment.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) correct++;
    });
    // Calculate realistic proctored score (baseline 65-98% based on answers)
    const rawPct = Math.round((correct / totalQ) * 100);
    const finalScore = Math.max(68, Math.min(98, rawPct === 100 ? 94 : rawPct >= 66 ? 86 : rawPct >= 33 ? 74 : 68));
    setComputedScore(finalScore);
    setWorkflowStage("result");

    // Persist real-time score to user profile
    if (onUpdateUser) {
      const nextAs = { ...(user.as || {}), [activeAssessment.skill]: finalScore };
      const certTitle = `${activeAssessment.skill} Verified Assessment (${finalScore}%) · IAmTalento AI Proctored · ${thisYear}`;
      const existingCerts = user.ce || [];
      const hasCert = existingCerts.some((c) => c.toLowerCase().includes(activeAssessment.skill.toLowerCase()));
      onUpdateUser({
        ...user,
        as: nextAs,
        ce: hasCert ? existingCerts : [...existingCerts, certTitle],
      });
    }
    onToast?.(`${activeAssessment.skill} assessment completed! Score: ${finalScore}% synced to your profile.`);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certName.trim()) return;
    const yearStr = certDate ? new Date(certDate).getFullYear().toString() : String(thisYear);
    const fullStr = `${certName.trim()}${certIssuer ? ` · ${certIssuer.trim()}` : ""} · ${yearStr}`;
    onAddCertification(fullStr);
    setCertName("");
    setCertIssuer("");
    setShowAddForm(false);
  };

  const handleShare = async () => {
    if (!latest) return;
    const text = `${user.name} earned ${latest.title} (${latest.issuer}) on IAmTalento`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* ignore clipboard error */
    }
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const popular = showAllPopular ? POPULAR_CERTS : POPULAR_CERTS.slice(0, 5);
  const filteredCatalog =
    selectedCategory === "All"
      ? ASSESSMENT_CATALOG
      : ASSESSMENT_CATALOG.filter((item) => item.category === selectedCategory);

  const inputCls = "h-10 rounded-xl text-sm";
  const allChecksPassed =
    preCheckProgress.camera &&
    preCheckProgress.mic &&
    preCheckProgress.network &&
    preCheckProgress.browserLock;

  const [selectedLiveCirSkill, setSelectedLiveCirSkill] = useState<string>("React");
  const [assessmentSectionTab, setAssessmentSectionTab] = useState<"all" | "take" | "scores" | "cir">("all");

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const buildRealTimeCredential = (meta: AssessmentMetadata): RealTimeCertificateData => {
    const sc = userScores[meta.skill] ?? 86;
    const credId = `TLN-2026-${meta.skill.replace(/[^A-Za-z]/g, "").slice(0, 4).toUpperCase()}-${800 + sc}`;
    return {
      credentialId: credId,
      candidateName: user.name,
      candidateEmail: user.email,
      candidateRole: user.head || "Senior Full-Stack Engineer",
      title: `${meta.skill} (${meta.level}) Engineering Assessment`,
      issuer: "IAmTalento AI Proctoring & Career Intelligence Authority",
      issuedDate: meta.attemptedAt,
      validUntil: "Oct 2028",
      score: sc,
      percentile: meta.percentile,
      integrityScore: meta.integrityScore,
      timeTaken: meta.skill === "React" ? "34m 18s / 45m" : meta.skill === "JavaScript" ? "31m 42s / 40m" : "27m 10s / 35m",
      codingTestCases: meta.codingTasks === 2 ? "18 / 20 Passed (90%)" : "12 / 12 Passed (100%)",
      peerAverage: meta.skill === "SQL" ? 58 : 62,
      partnerCutoff: 60,
      salaryBand: sc >= 85 ? "INR 20.0 - 30.0 LPA" : sc >= 75 ? "INR 15.0 - 24.0 LPA" : "INR 10.0 - 16.0 LPA",
      verificationHash: `0x8A4F...${sc}C91E`,
      subSkills: meta.subSkills.map((s, idx) => ({
        name: s.name,
        score: s.score,
        benchmark: 58 + idx * 3,
      })),
      recruiterSummary: `${user.name} demonstrated verified production mastery in ${meta.skill} (${meta.level}), achieving ${sc}% (${meta.percentile} nationally) with ${meta.integrityScore} proctoring integrity and zero environment flags.`,
    };
  };

  const liveSelectedMeta =
    ASSESSMENT_CATALOG.find((a) => a.skill === selectedLiveCirSkill) || ASSESSMENT_CATALOG[0];
  const liveCredData = buildRealTimeCredential(liveSelectedMeta);

  return (
    <div className="space-y-6">
      {/* ================= HERO BANNER ================= */}
      {!isCertificationsMode ? (
        <ProHero
          icon={<GraduationCap />}
          title="Employee Skill Assessments & CIR Workflow"
          subtitle="Take AI-proctored technical assessments, generate your Career Intelligence Report (CIR), and sync verified skill scores directly to 500+ hiring partners."
          aside={
            <div className="flex flex-col gap-2 lg:w-76">
              <button
                type="button"
                onClick={() => startAssessmentWorkflow(ASSESSMENT_CATALOG[0])}
                className="flex w-full items-center gap-3 rounded-2xl bg-[#FB923C] hover:bg-[#F97316] px-4 py-3 text-left text-white shadow-md transition-all cursor-pointer"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
                  <Play className="h-5 w-5 text-white fill-white" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-white">Start Live Assessment</span>
                  <span className="block text-[11px] text-white/90">AI-Proctored · 15-45 mins · Instant CIR</span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-white" />
              </button>
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate("my-certifications")}
                  className="flex w-full items-center justify-between rounded-xl bg-white/15 hover:bg-white/25 px-3.5 py-2 text-xs font-semibold text-white transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5" /> View My Certifications ({certItems.length + passedCount})
                  </span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          }
        >
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold text-white ring-1 ring-white/30">
              <TrendingUp className="h-3.5 w-3.5" /> Readiness Score: {avgScore}% (Top 8%)
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold text-white ring-1 ring-white/30">
              <ShieldCheck className="h-3.5 w-3.5" /> Proctoring Integrity: 99.6%
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold text-white ring-1 ring-white/30">
              <BadgeCheck className="h-3.5 w-3.5" /> {passedCount} Skills Verified
            </span>
          </div>
        </ProHero>
      ) : (
        <ProHero
          icon={<Award />}
          title="My Certifications & Verifiable Credentials"
          subtitle="Manage your earned industry certifications, download verified skill assessment certificates, and share tamper-proof credentials on your public portfolio."
          aside={
            <div className="flex flex-col gap-2 lg:w-76">
              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="flex w-full items-center gap-3 rounded-2xl bg-[#FB923C] hover:bg-[#F97316] px-4 py-3 text-left text-white shadow-md transition-all cursor-pointer"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
                  <Plus className="h-5 w-5 text-white" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-white">Add New Certification</span>
                  <span className="block text-[11px] text-white/90">AWS, Google, Meta, Microsoft & more</span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-white" />
              </button>
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate("cert")}
                  className="flex w-full items-center justify-between rounded-xl bg-white/15 hover:bg-white/25 px-3.5 py-2 text-xs font-semibold text-white transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5" /> Take Skill Assessment to Earn Certificate
                  </span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          }
        >
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold text-white ring-1 ring-white/30">
              <Award className="h-3.5 w-3.5" /> {certItems.length} External Certifications
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold text-white ring-1 ring-white/30">
              <BadgeCheck className="h-3.5 w-3.5" /> {passedCount} Skill Assessment Certificates
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold text-white ring-1 ring-white/30">
              <ShieldCheck className="h-3.5 w-3.5" /> 100% Verifiable Credentials
            </span>
          </div>
        </ProHero>
      )}

      {isLive && <LiveCirStrip />}

      {!isCertificationsMode ? (
        <>
          {/* ================= REAL-TIME KPI SUMMARY CARDS ================= */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-start gap-4 hover:border-[#002C66]/40 transition-all">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#002C66]/10 text-[#002C66]">
                <Target className="h-6 w-6" />
              </span>
              <div>
                <span className="text-xs font-semibold text-muted-foreground">Industry Readiness (IRS)</span>
                <div className="text-2xl font-extrabold text-[#002C66] font-display mt-0.5">{avgScore} / 100</div>
                <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
                  Top 8% among Frontend Engineers
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-start gap-4 hover:border-[#002C66]/40 transition-all">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                <ShieldCheck className="h-6 w-6" />
              </span>
              <div>
                <span className="text-xs font-semibold text-muted-foreground">Passed Assessments</span>
                <div className="text-2xl font-extrabold text-foreground font-display mt-0.5">
                  {passedCount} / {assessmentEntries.length}
                </div>
                <span className="text-[11px] text-muted-foreground mt-0.5 block">
                  99.6% AI Proctoring Trust Score
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-start gap-4 hover:border-[#002C66]/40 transition-all">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FB923C]/15 text-[#EA580C]">
                <Building2 className="h-6 w-6" />
              </span>
              <div>
                <span className="text-xs font-semibold text-muted-foreground">Employer Invites Unlocked</span>
                <div className="text-2xl font-extrabold text-foreground font-display mt-0.5">14 Companies</div>
                <span className="text-[11px] text-muted-foreground mt-0.5 block">
                  2 priority employer tests pending
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-start gap-4 hover:border-[#002C66]/40 transition-all">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600">
                <Award className="h-6 w-6" />
              </span>
              <div>
                <span className="text-xs font-semibold text-muted-foreground">Active Credentials</span>
                <div className="text-2xl font-extrabold text-foreground font-display mt-0.5">
                  {certItems.length + passedCount}
                </div>
                <span className="text-[11px] text-muted-foreground mt-0.5 block">
                  Verifiable via QR &amp; public portfolio
                </span>
              </div>
            </div>
          </div>

          {/* ================= EXECUTIVE SECTION FILTER BAR ================= */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-3 shadow-2xs">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: "all", label: "All Assessment Studio", icon: Layers },
                { id: "take", label: "Take Assessments & Invites (7)", icon: Code2 },
                { id: "scores", label: `My Verified Scores (${assessmentEntries.length})`, icon: ShieldCheck },
                { id: "cir", label: "Live CIR & Certificate Preview", icon: BarChart3 },
              ].map((t) => {
                const TabIcon = t.icon;
                const isActive = assessmentSectionTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setAssessmentSectionTab(t.id as "all" | "take" | "scores" | "cir")}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer",
                      isActive
                        ? "bg-[#002C66] text-white shadow-xs"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <TabIcon className="h-3.5 w-3.5" />
                    {t.label}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => startAssessmentWorkflow(ASSESSMENT_CATALOG[0])}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#FB923C] hover:bg-[#F97316] px-4 py-2 text-xs font-bold text-white shadow-2xs cursor-pointer"
            >
              <Play className="h-3.5 w-3.5" /> Quick Launch Test
            </button>
          </div>

          {(assessmentSectionTab === "all" || assessmentSectionTab === "take") && (
            <>
              {/* ================= END-TO-END ASSESSMENT WORKFLOW ("HOW IT WORKS") ================= */}
              <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#002C66]/10 text-[#002C66]">
                      <Layers className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-base font-bold text-foreground">
                          How Employee Skill Assessment Works (End-to-End Workflow)
                        </h3>
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 border-emerald-500/30 text-[10px]">
                          Real-Time Pipeline
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Complete any assessment in 5 automated steps to unlock instant recruiter shortlisting and verified CIR credentials.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => startAssessmentWorkflow(ASSESSMENT_CATALOG[0])}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#002C66] hover:bg-[#001F4D] px-4 py-2 text-xs font-bold text-white cursor-pointer shrink-0"
                  >
                    <Play className="h-3.5 w-3.5 text-[#FB923C]" /> Try Live Assessment Demo
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
                  {WORKFLOW_STEPS.map((item, idx) => {
                    const StepIcon = item.icon;
                    return (
                      <div
                        key={item.step}
                        onClick={() => startAssessmentWorkflow(ASSESSMENT_CATALOG[idx % ASSESSMENT_CATALOG.length])}
                        className="group relative flex flex-col justify-between rounded-xl border border-border bg-background p-4 hover:border-[#002C66]/50 hover:shadow-md transition-all cursor-pointer overflow-hidden"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-[#002C66] text-white text-xs font-bold">
                              {item.step}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FB923C]/15 text-[#EA580C]">
                              {item.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <StepIcon className="h-4 w-4 text-[#002C66] shrink-0" />
                            <h4 className="font-display text-xs font-bold text-foreground group-hover:text-[#002C66] transition-colors">
                              {item.title}
                            </h4>
                          </div>
                          <p className="text-[11px] leading-relaxed text-muted-foreground">{item.desc}</p>
                        </div>
                        <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-[11px] font-bold text-[#002C66]">
                          <span>Launch step</span>
                          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ================= EMPLOYER-ASSIGNED ASSESSMENTS (REAL-TIME INVITES) ================= */}
              <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FB923C]/15 text-[#EA580C]">
                      <Building2 className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-base font-bold text-foreground">
                          Employer-Assigned Assessment Invitations (2 Pending)
                        </h3>
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
                          <Clock className="h-3 w-3" /> Action Required
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Hiring teams invited you to complete these role-specific assessments to fast-track your interview round.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {EMPLOYER_INVITED_TESTS.map((inv) => {
                    const matchedMeta =
                      ASSESSMENT_CATALOG.find((a) => a.skill === inv.skill) || ASSESSMENT_CATALOG[0];
                    return (
                      <div
                        key={inv.id}
                        className="rounded-2xl border border-border bg-background overflow-hidden shadow-2xs hover:shadow-md hover:border-[#002C66]/40 transition-all"
                      >
                        <div className="h-1.5 w-full bg-[#FB923C]" />
                        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-2 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-md bg-[#002C66] text-white text-[10px] font-bold uppercase">
                                {inv.company}
                              </span>
                              <span className="text-xs font-bold text-foreground truncate">{inv.role}</span>
                            </div>
                            <p className="text-sm font-bold text-foreground">{inv.assessmentName}</p>
                            <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                              <span className="flex items-center gap-1 font-medium text-foreground">
                                <Timer className="h-3.5 w-3.5 text-[#002C66]" /> {inv.duration}
                              </span>
                              <span className="flex items-center gap-1 text-amber-600 font-bold">
                                <Clock className="h-3.5 w-3.5" /> {inv.deadline}
                              </span>
                              <span className="flex items-center gap-1 text-emerald-600 font-bold">
                                <TrendingUp className="h-3.5 w-3.5" /> {inv.matchBoost}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => startAssessmentWorkflow(matchedMeta)}
                            className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#002C66] hover:bg-[#001F4D] px-4 py-2.5 text-xs font-bold text-white cursor-pointer"
                          >
                            <Play className="h-3.5 w-3.5 text-[#FB923C]" /> Start Employer Test
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {(assessmentSectionTab === "all" || assessmentSectionTab === "scores") && (
            /* ================= VERIFIED SKILL TEST RESULTS & SUB-SKILL BREAKDOWN ================= */
            <div className="space-y-4 rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold text-foreground">
                      Your Verified Skill Assessment Scores &amp; CIR Breakdown ({assessmentEntries.length})
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Pass mark is 60%. Verified scores include sub-skill analytics, proctoring logs, and downloadable certificates.
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-xl border-[#002C66]/30 text-xs font-bold text-[#002C66] hover:bg-[#002C66]/5 cursor-pointer gap-1.5"
                  onClick={() => startAssessmentWorkflow(ASSESSMENT_CATALOG[4])}
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Improve Lowest Score (SQL)
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {assessmentEntries.map(([skill, score]) => {
                  const passed = score >= 60;
                  const meta =
                    ASSESSMENT_CATALOG.find((a) => a.skill.toLowerCase() === skill.toLowerCase()) ||
                    ASSESSMENT_CATALOG[0];

                  return (
                    <div
                      key={skill}
                      className="flex flex-col justify-between rounded-2xl border border-border bg-background overflow-hidden shadow-2xs hover:shadow-md hover:border-[#002C66]/30 transition-all"
                    >
                      <div className={cn("h-1.5 w-full", passed ? "bg-emerald-500" : "bg-[#FB923C]")} />
                      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3.5">
                            <MatchRing percent={score} size={54} />
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="font-display text-base font-bold text-foreground">{skill}</h4>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-[10px] font-bold",
                                    passed
                                      ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30"
                                      : "bg-amber-500/10 text-amber-700 border-amber-500/30"
                                  )}
                                >
                                  {passed ? `Verified · ${meta.percentile}` : "Needs Retake (<60%)"}
                                </Badge>
                              </div>
                              <p className="text-[11px] text-muted-foreground mt-1">
                                Attempted {meta.attemptedAt} · Proctoring Integrity:{" "}
                                <strong className="text-emerald-700">{meta.integrityScore}</strong>
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Sub-skill real-time competency bars */}
                        <div className="space-y-2 rounded-xl bg-muted/30 p-3.5 border border-border/60">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            Sub-Skill Competency Breakdown
                          </div>
                          {meta.subSkills.map((sub) => (
                            <div key={sub.name} className="space-y-1">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-foreground/90 font-semibold">{sub.name}</span>
                                <span className="font-bold text-[#002C66]">{sub.score}%</span>
                              </div>
                              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-[#002C66] transition-all"
                                  style={{ width: `${sub.score}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 gap-1.5 rounded-xl text-xs font-bold cursor-pointer"
                              onClick={() => setInspectCirSkill(meta)}
                            >
                              <Eye className="h-3.5 w-3.5 text-[#002C66]" /> CIR Report
                            </Button>
                            {passed && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 gap-1.5 rounded-xl text-xs font-bold cursor-pointer"
                                onClick={() => onOpenDrawer({ type: "certificate", key: `skill:${skill}` })}
                              >
                                <Download className="h-3.5 w-3.5 text-[#002C66]" /> Certificate
                              </Button>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => startAssessmentWorkflow(meta)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#002C66] hover:bg-[#001F4D] px-3.5 py-2 text-xs font-bold text-white cursor-pointer"
                          >
                            <Play className="h-3 w-3 text-[#FB923C]" /> {passed ? "Retake to Improve" : "Retake Now"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {(assessmentSectionTab === "all" || assessmentSectionTab === "take") && (
            /* ================= AVAILABLE SKILL ASSESSMENTS CATALOG ================= */
            <div className="space-y-4 rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#002C66]/10 text-[#002C66]">
                    <Code2 className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold text-foreground">
                      Explore Proctored Skill Assessments Library
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Take role-mapped assessments with AI Cheating Prevention to prove your hands-on engineering capability.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {["All", "Frontend", "Data & SQL", "Architecture"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                        selectedCategory === cat
                          ? "bg-[#002C66] text-white shadow-xs"
                          : "bg-muted/60 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCatalog.map((item) => {
                  const existingScore = userScores[item.skill];
                  return (
                    <div
                      key={item.skill}
                      className="flex flex-col justify-between rounded-2xl border border-border bg-background overflow-hidden shadow-2xs hover:shadow-md hover:border-[#002C66]/40 transition-all"
                    >
                      <div className={cn("h-1.5 w-full", existingScore !== undefined ? "bg-emerald-500" : "bg-[#002C66]")} />
                      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="rounded-lg bg-[#002C66]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#002C66]">
                              {item.category} · {item.level}
                            </span>
                            {existingScore !== undefined ? (
                              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Scored {existingScore}%
                              </span>
                            ) : (
                              <span className="text-[11px] font-bold text-[#FB923C]">New Track</span>
                            )}
                          </div>

                          <div>
                            <h4 className="font-display text-base font-bold text-foreground">
                              {item.skill} Engineering Assessment
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              Covers {item.subSkills.map((s) => s.name).join(", ")}.
                            </p>
                          </div>

                          <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] text-muted-foreground">
                            <div className="rounded-xl bg-muted/40 p-2.5 text-center border border-border/50">
                              <b className="block text-foreground">{item.duration}</b>
                              Duration
                            </div>
                            <div className="rounded-xl bg-muted/40 p-2.5 text-center border border-border/50">
                              <b className="block text-foreground">{item.questionsCount} Qs</b>
                              + {item.codingTasks} Coding
                            </div>
                            <div className="rounded-xl bg-muted/40 p-2.5 text-center border border-border/50">
                              <b className="block text-[#002C66]">{item.hiringPartners}+</b>
                              Employers
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-3 border-t border-border/60">
                          <button
                            type="button"
                            onClick={() => startAssessmentWorkflow(item)}
                            className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#002C66] hover:bg-[#001F4D] py-2.5 text-xs font-bold text-white cursor-pointer"
                          >
                            <Play className="h-3.5 w-3.5 text-[#FB923C]" />
                            {existingScore !== undefined ? "Retake Assessment" : "Start Assessment"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* ================= MY CERTIFICATIONS KPI SUMMARY CARDS ================= */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm flex items-start gap-3.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Award className="h-5 w-5" />
              </span>
              <div>
                <span className="text-xs font-medium text-muted-foreground">Total Certifications</span>
                <div className="text-2xl font-bold text-primary font-display mt-0.5">
                  {certItems.length + passedCount}
                </div>
                <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
                  {certItems.length} External + {passedCount} Skill Tests
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm flex items-start gap-3.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <BadgeCheck className="h-5 w-5" />
              </span>
              <div>
                <span className="text-xs font-medium text-muted-foreground">Skill Test Certificates</span>
                <div className="text-2xl font-bold text-foreground font-display mt-0.5">{passedCount} Earned</div>
                <span className="text-[11px] text-muted-foreground mt-0.5 block">
                  AI-Proctored & QR Verifiable
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm flex items-start gap-3.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Calendar className="h-5 w-5" />
              </span>
              <div>
                <span className="text-xs font-medium text-muted-foreground">Active Credentials</span>
                <div className="text-2xl font-bold text-foreground font-display mt-0.5">
                  {activeCount + passedCount}
                </div>
                <span className="text-[11px] text-muted-foreground mt-0.5 block">
                  Valid through {thisYear + VALID_YEARS}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm flex items-start gap-3.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <span className="text-xs font-medium text-muted-foreground">Portfolio Sync Status</span>
                <div className="text-2xl font-bold text-foreground font-display mt-0.5">100% Live</div>
                <span className="text-[11px] text-muted-foreground mt-0.5 block">
                  Visible to 500+ Hiring Partners
                </span>
              </div>
            </div>
          </div>

          {/* ================= EXTERNAL & EARNED CERTIFICATIONS SECTION ================= */}
          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[3fr_2fr]">
            {/* My certifications list */}
            <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={tile}>
                    <Award className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-foreground">
                      My Certifications ({certItems.length})
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Your earned certifications and completed skill credentials
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Live / Updated{" "}
                    {refreshedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <button
                    type="button"
                    aria-label="Refresh"
                    onClick={() => setRefreshedAt(new Date())}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {showAddForm && (
                <form onSubmit={handleAdd} className="space-y-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="flex items-center gap-2 font-display text-sm font-semibold text-foreground">
                      <Plus className="h-4 w-4 text-primary" /> Add new certification
                    </h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAddForm(false)}
                      className="h-7 text-xs text-muted-foreground"
                    >
                      Cancel
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
                        Certification name
                      </label>
                      <Input
                        placeholder="e.g. AWS Certified Solutions Architect"
                        value={certName}
                        onChange={(e) => setCertName(e.target.value)}
                        className={inputCls}
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
                        Issuing organization
                      </label>
                      <Input
                        placeholder="e.g. Amazon Web Services"
                        value={certIssuer}
                        onChange={(e) => setCertIssuer(e.target.value)}
                        className={inputCls}
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Date issued</label>
                      <Input
                        type="date"
                        value={certDate}
                        onChange={(e) => setCertDate(e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddForm(false)}
                      className="rounded-xl text-xs"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="rounded-xl text-xs">
                      Save certification
                    </Button>
                  </div>
                </form>
              )}

              <div className="space-y-2.5">
                {certItems.length === 0 ? (
                  <p className="py-6 text-center text-xs text-muted-foreground">
                    No certifications listed yet. Use &quot;Add Certification&quot; to showcase your credentials.
                  </p>
                ) : (
                  certItems.map((item) => (
                    <div
                      key={item.index}
                      className="flex flex-col gap-3 rounded-xl border border-border bg-background p-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <IssuerMark name={item.issuer} />
                        <div className="min-w-0">
                          <div className="truncate font-display text-sm font-semibold text-foreground">{item.title}</div>
                          <div className="truncate text-[11px] text-muted-foreground">{item.issuer}</div>
                          <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Calendar className="h-3 w-3" /> Issued on {item.year} · Valid till {item.validTill}
                          </div>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                          <Check className="h-3 w-3" /> Verified
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 rounded-lg border-primary/30 px-3 text-xs font-semibold text-primary hover:bg-primary/5 hover:text-primary cursor-pointer"
                          onClick={() => onOpenDrawer({ type: "certificate", key: `ce:${item.index}` })}
                        >
                          View Certificate
                        </Button>
                        <button
                          type="button"
                          aria-label={`Remove ${item.title}`}
                          onClick={() => onRemoveCertification(item.index)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-primary/40 py-2.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/5 cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add External Certification
              </button>
            </div>

            {/* Latest earned certificate + stats */}
            <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h3 className="flex items-center gap-3 font-display text-sm font-semibold text-foreground">
                <span className={tile}>
                  <BadgeCheck className="h-4 w-4" />
                </span>
                Latest Earned Certificate
              </h3>

              {latest ? (
                <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <IssuerMark name={latest.issuer} size="sm" />
                      <span className="truncate font-display text-sm font-bold text-foreground">{latest.issuer}</span>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                      <Check className="h-3 w-3" /> Earned recently
                    </span>
                  </div>

                  <div className="grid grid-cols-[1fr_auto] items-start gap-3">
                    <div className="min-w-0">
                      <h4 className="font-display text-base font-bold leading-snug text-foreground">{latest.title}</h4>
                      <div className="text-xs text-muted-foreground">{latest.issuer}</div>
                      <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                        Demonstrated proficiency in {latest.title}, issued by {latest.issuer}.
                      </p>
                    </div>
                    <div className="hidden w-24 shrink-0 rounded-lg border border-border bg-background p-2 text-center shadow-sm sm:block">
                      <Award className="mx-auto h-4 w-4 text-primary" />
                      <div className="mt-1 text-[8px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Certificate
                      </div>
                      <div className="truncate font-display text-[11px] font-bold text-foreground">{user.name}</div>
                      <div className="mx-auto mt-1 h-px w-10 bg-border" />
                      <div className="mt-1 truncate text-[8px] text-primary">{latest.title}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 border-t border-border pt-3 text-[11px]">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      <span>
                        Issued on
                        <b className="block text-foreground">{latest.year}</b>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      <span>
                        Valid till
                        <b className="block text-foreground">{latest.validTill}</b>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                      <span>
                        Verified
                        <b className="block text-foreground">Yes</b>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      className="h-9 gap-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                      onClick={() => onOpenDrawer({ type: "certificate", key: `ce:${latest.index}` })}
                    >
                      <Download className="h-3.5 w-3.5" /> Download Certificate
                    </Button>
                    <Button
                      variant="outline"
                      className="h-9 gap-1.5 rounded-lg border-primary/30 text-xs font-semibold text-primary hover:bg-primary/5 hover:text-primary cursor-pointer"
                      onClick={handleShare}
                    >
                      {linkCopied ? <Link2 className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
                      {linkCopied ? "Copied" : "Share Certificate"}
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="rounded-xl border border-dashed border-border py-8 text-center text-xs text-muted-foreground">
                  Add your first certification to feature it here.
                </p>
              )}

              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Total Certificates", value: certItems.length, icon: <Award className="h-4 w-4" /> },
                  { label: "Verified", value: certItems.length, icon: <CheckCircle2 className="h-4 w-4" /> },
                  { label: "Active Credentials", value: activeCount, icon: <Calendar className="h-4 w-4" /> },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-2 rounded-xl border border-border bg-background p-3">
                    <span className={tile}>{s.icon}</span>
                    <div className="min-w-0">
                      <div className="font-display text-lg font-bold leading-none text-foreground">{s.value}</div>
                      <div className="mt-0.5 text-[10px] leading-tight text-muted-foreground">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ================= EARNED SKILL ASSESSMENT CERTIFICATES ================= */}
          <div className="space-y-4 rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <span className={tile}>
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">
                    Earned Skill Assessment Certificates ({passedCount})
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Certificates automatically issued from your AI-proctored IAmTalento skill assessments (60%+ pass score).
                  </p>
                </div>
              </div>
              {onNavigate && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-lg border-primary/30 text-xs font-semibold text-primary hover:bg-primary/5 cursor-pointer gap-1.5"
                  onClick={() => onNavigate("cert")}
                >
                  <GraduationCap className="h-3.5 w-3.5" /> Go to Assessments
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {assessmentEntries
                .filter(([, score]) => score >= 60)
                .map(([skill, score]) => {
                  const meta =
                    ASSESSMENT_CATALOG.find((a) => a.skill.toLowerCase() === skill.toLowerCase()) ||
                    ASSESSMENT_CATALOG[0];
                  return (
                    <div
                      key={skill}
                      className="flex flex-col justify-between gap-3 rounded-xl border border-border bg-background p-4 hover:border-primary/40 transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <MatchRing percent={score} size={46} />
                          <div>
                            <h4 className="font-display text-sm font-bold text-foreground">
                              {skill} Verified Certificate
                            </h4>
                            <p className="text-[11px] text-muted-foreground">
                              IAmTalento AI Proctored · {meta.percentile}
                            </p>
                            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                              <Check className="h-3 w-3" /> Integrity {meta.integrityScore}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2 border-t border-border/60 pt-2.5">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 flex-1 gap-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                          onClick={() => setInspectCirSkill(meta)}
                        >
                          <Eye className="h-3.5 w-3.5 text-primary" /> CIR Report
                        </Button>
                        <Button
                          size="sm"
                          className="h-8 flex-1 gap-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                          onClick={() => onOpenDrawer({ type: "certificate", key: `skill:${skill}` })}
                        >
                          <Download className="h-3.5 w-3.5" /> Certificate
                        </Button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* ================= POPULAR CERTIFICATIONS ================= */}
          <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className={tile}>
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="font-display text-sm font-semibold text-foreground">
                    Popular certifications to add next
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Boost your skills with industry-recognized certifications
                  </p>
                </div>
              </div>
              {POPULAR_CERTS.length > 5 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-lg border-primary/30 text-xs font-semibold text-primary hover:bg-primary/5 hover:text-primary cursor-pointer"
                  onClick={() => setShowAllPopular((v) => !v)}
                >
                  {showAllPopular ? "Show fewer" : "View All Certifications"}
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {popular.map((cert, idx) => (
                <div
                  key={cert[0]}
                  className="flex flex-col justify-between gap-3 rounded-xl border border-border bg-background p-3.5"
                >
                  <div className="flex items-start gap-2.5">
                    <IssuerMark name={cert[1]} size="sm" />
                    <div className="min-w-0">
                      <div className="font-display text-xs font-semibold leading-snug text-foreground">{cert[0]}</div>
                      <div className="text-[11px] text-muted-foreground">{cert[1]}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 border-t border-border pt-2.5">
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" /> {COURSE_WEEKS[idx % COURSE_WEEKS.length]}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        aria-label={`Add ${cert[0]} to profile`}
                        onClick={() => {
                          setCertName(cert[0]);
                          setCertIssuer(cert[1]);
                          setShowAddForm(true);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-primary hover:bg-primary/10 cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(cert[0] + " " + cert[1] + " course")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-7 items-center gap-1 rounded-lg bg-primary px-2.5 text-[11px] font-semibold text-primary-foreground hover:bg-primary/90"
                      >
                        Find course <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ================= REAL-TIME CIR REPORT & VERIFIED CERTIFICATE LIVE PREVIEW ================= */}
      {(isCertificationsMode || assessmentSectionTab === "all" || assessmentSectionTab === "cir") && (
      <div className="rounded-2xl border border-primary/30 bg-card p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <span className={tile}>
              <BarChart3 className="h-5 w-5" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-base font-bold text-foreground">
                  Real-Time Career Intelligence Report (CIR) &amp; Verified Certificate Data
                </h3>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 border-emerald-500/30 text-[10px]">
                  Live Proctored Telemetry
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Inspect your live sub-skill competency rubric, AI proctoring telemetry, national peer benchmarks, and download official PDF reports.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {ASSESSMENT_CATALOG.map((item) => (
              <button
                key={item.skill}
                type="button"
                onClick={() => setSelectedLiveCirSkill(item.skill)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                  selectedLiveCirSkill === item.skill
                    ? "bg-[#002C66] text-white shadow-xs"
                    : "bg-muted/60 text-muted-foreground hover:text-foreground"
                )}
              >
                {item.skill} ({userScores[item.skill] ?? 85}%)
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Real-Time CIR Telemetry + Live Certificate Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left: Real-Time CIR Telemetry Card */}
          <div className="rounded-2xl border border-border bg-background overflow-hidden shadow-xs">
            <div className="bg-[#002C66] text-white p-4 sm:p-5 flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#FB923C]">
                  Career Intelligence Report (CIR)
                </div>
                <h4 className="text-base font-extrabold mt-0.5">{liveCredData.title}</h4>
                <div className="text-[11px] text-white/80 font-mono mt-0.5">
                  Session ID: CIR-{liveCredData.credentialId} · Attempted {liveCredData.issuedDate}
                </div>
              </div>
              <div className="text-right shrink-0 rounded-xl bg-white/10 px-3.5 py-2 border border-white/20">
                <span className="text-[10px] uppercase tracking-wider text-white/80 block">IRS Score</span>
                <strong className="text-lg font-extrabold text-[#FB923C]">
                  {liveCredData.score}/100
                </strong>
                <span className="block text-[10px] text-emerald-300 font-semibold">
                  {liveCredData.percentile}
                </span>
              </div>
            </div>

            <div className="p-4 sm:p-5 space-y-4 text-xs">
              {/* Session & Proctoring Telemetry Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div className="rounded-xl border border-border bg-muted/20 p-2.5">
                  <span className="text-[10px] text-muted-foreground block">Proctoring Integrity</span>
                  <strong className="text-sm font-bold text-emerald-600">{liveCredData.integrityScore}</strong>
                  <span className="text-[10px] text-muted-foreground block">0 Tab Switches / Flags</span>
                </div>
                <div className="rounded-xl border border-border bg-muted/20 p-2.5">
                  <span className="text-[10px] text-muted-foreground block">Completion Time</span>
                  <strong className="text-sm font-bold text-foreground">{liveCredData.timeTaken}</strong>
                  <span className="text-[10px] text-emerald-600 font-semibold block">Optimal Pacing</span>
                </div>
                <div className="rounded-xl border border-border bg-muted/20 p-2.5">
                  <span className="text-[10px] text-muted-foreground block">Coding Sandbox</span>
                  <strong className="text-sm font-bold text-foreground">{liveCredData.codingTestCases}</strong>
                  <span className="text-[10px] text-muted-foreground block">O(n) Time Complexity</span>
                </div>
                <div className="rounded-xl border border-border bg-muted/20 p-2.5">
                  <span className="text-[10px] text-muted-foreground block">Peer Benchmark</span>
                  <strong className="text-sm font-bold text-primary">
                    +{liveCredData.score - liveCredData.peerAverage}% vs Avg
                  </strong>
                  <span className="text-[10px] text-muted-foreground block">
                    National Avg: {liveCredData.peerAverage}%
                  </span>
                </div>
                <div className="rounded-xl border border-border bg-muted/20 p-2.5">
                  <span className="text-[10px] text-muted-foreground block">Salary Band Fit</span>
                  <strong className="text-sm font-bold text-foreground">{liveCredData.salaryBand}</strong>
                  <span className="text-[10px] text-emerald-600 font-semibold block">Verified Readiness</span>
                </div>
                <div className="rounded-xl border border-border bg-muted/20 p-2.5">
                  <span className="text-[10px] text-muted-foreground block">Hardware &amp; ID Lock</span>
                  <strong className="text-sm font-bold text-emerald-600">100% Verified</strong>
                  <span className="text-[10px] text-muted-foreground block">Cam · Mic · Browser</span>
                </div>
              </div>

              {/* Sub-Skill vs Peer Benchmark */}
              <div className="space-y-2.5 rounded-xl border border-border bg-muted/15 p-3.5">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <span>Sub-Domain Competency Rubric</span>
                  <span>Candidate vs Peer Median</span>
                </div>
                {liveCredData.subSkills.map((sub) => (
                  <div key={sub.name} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">{sub.name}</span>
                      <span className="font-bold text-primary">
                        {sub.score}%{" "}
                        <span className="text-[10px] font-normal text-muted-foreground">
                          (Peer Median: {sub.benchmark}%)
                        </span>
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${sub.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Recruiter Executive Note */}
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3.5 space-y-1">
                <div className="font-bold text-emerald-700 flex items-center justify-between">
                  <span>AI Technical Recruiter Recommendation: STRONG HIRE</span>
                  <span className="text-[10px] font-mono">24h SLA Priority</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">{liveCredData.recruiterSummary}</p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setInspectCirSkill(liveSelectedMeta)}
                  className="gap-1.5 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5 text-primary" /> Open Full CIR Modal
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    downloadCirReportPdf(liveCredData);
                    onToast(`Downloaded CIR Report PDF: IAmTalento-CIR-Report-${liveCredData.credentialId}.pdf`);
                  }}
                  className="gap-1.5 rounded-xl bg-[#FB923C] hover:bg-[#F97316] text-white text-xs font-bold cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" /> Download CIR Report (.pdf)
                </Button>
              </div>
            </div>
          </div>

          {/* Right: Live Verifiable Certificate Preview Card */}
          <div className="rounded-2xl border-2 border-[#002C66] bg-white text-slate-900 overflow-hidden shadow-md">
            <div className="bg-[#002C66] text-white p-4 sm:p-5 flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#FB923C]">
                  Official Verifiable Certificate
                </div>
                <h4 className="text-base font-extrabold mt-0.5">
                  CERTIFICATE OF ENGINEERING PROFICIENCY
                </h4>
                <div className="text-[11px] text-white/80 font-mono mt-0.5">
                  Credential ID: {liveCredData.credentialId} · Hash: {liveCredData.verificationHash}
                </div>
              </div>
              <span className="shrink-0 rounded-xl bg-[#FB923C] px-3 py-1.5 text-[11px] font-extrabold text-white uppercase">
                Verified
              </span>
            </div>

            <div className="p-5 sm:p-6 space-y-4">
              <div className="text-center space-y-1.5 border-b border-slate-200 pb-4">
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Presented To
                </div>
                <div className="text-2xl font-extrabold font-display text-[#002C66]">
                  {liveCredData.candidateName}
                </div>
                <div className="text-xs text-slate-600">
                  {liveCredData.candidateRole} · {liveCredData.candidateEmail}
                </div>
                <p className="text-xs text-slate-500 pt-1">
                  For successfully passing the AI-proctored engineering assessment and verification standards in:
                </p>
                <div className="inline-block mt-1 rounded-xl bg-slate-100 border border-slate-200 px-4 py-2">
                  <div className="text-sm font-bold text-[#002C66]">{liveCredData.title}</div>
                  <div className="text-[11px] text-slate-500">{liveCredData.issuer}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Verified Score</span>
                  <strong className="text-base font-extrabold text-[#002C66]">{liveCredData.score}%</strong>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Percentile</span>
                  <strong className="text-base font-extrabold text-emerald-700">{liveCredData.percentile}</strong>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Integrity</span>
                  <strong className="text-base font-extrabold text-[#002C66]">{liveCredData.integrityScore}</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 border-t border-slate-200 pt-3">
                <div>
                  Issued Date: <strong className="text-slate-900">{liveCredData.issuedDate}</strong>
                </div>
                <div className="text-right">
                  Valid Until: <strong className="text-slate-900">{liveCredData.validUntil}</strong>
                </div>
                <div className="col-span-2 text-[10px] text-slate-500">
                  Public Verification URL:{" "}
                  <strong className="text-[#002C66]">
                    https://iamtalento.com/verify/{liveCredData.credentialId}
                  </strong>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onOpenDrawer({ type: "certificate", key: `skill:${liveSelectedMeta.skill}` })}
                  className="gap-1.5 rounded-xl text-xs font-semibold border-slate-300 text-slate-800 hover:bg-slate-100 cursor-pointer"
                >
                  <Award className="h-3.5 w-3.5 text-[#002C66]" /> Full Screen Certificate
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    downloadCertificatePdf(liveCredData);
                    onToast(`Downloaded Certificate PDF: IAmTalento-Certificate-${liveCredData.credentialId}.pdf`);
                  }}
                  className="gap-1.5 rounded-xl bg-[#002C66] hover:bg-[#002C66]/90 text-white text-xs font-bold cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" /> Download Certificate (.pdf)
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* ================= INTERACTIVE LIVE ASSESSMENT WORKFLOW MODAL ================= */}
      <Dialog open={Boolean(activeAssessment)} onOpenChange={(open) => !open && setActiveAssessment(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90dvh] overflow-y-auto">
          {activeAssessment && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs">
                    AI-Proctored Assessment Workflow
                  </Badge>
                  {workflowStage === "test" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-700">
                      <Timer className="h-3.5 w-3.5" /> {formatTimer(timeLeftSec)} remaining
                    </span>
                  )}
                </div>
                <DialogTitle className="text-lg font-bold mt-1">
                  {activeAssessment.skill} Engineering Assessment
                </DialogTitle>
                <DialogDescription className="text-xs">
                  {workflowStage === "precheck" &&
                    "Step 1 of 3 · Verifying webcam, microphone, network stability, and browser lock."}
                  {workflowStage === "test" &&
                    `Step 2 of 3 · Question ${currentQuestionIdx + 1} of ${activeAssessment.questions.length} · Cheating Prevention Active`}
                  {workflowStage === "result" &&
                    "Step 3 of 3 · Instant Career Intelligence Report (CIR) & Verified Score Generated."}
                </DialogDescription>
              </DialogHeader>

              {/* STAGE 1: PRE-CHECK */}
              {workflowStage === "precheck" && (
                <div className="space-y-4 py-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        label: "HD Webcam & Face Presence",
                        done: preCheckProgress.camera,
                        icon: Camera,
                        detail: "Single candidate frame verified",
                      },
                      {
                        label: "Microphone & Ambient Audio",
                        done: preCheckProgress.mic,
                        icon: Mic,
                        detail: "Noise floor below 32 dB",
                      },
                      {
                        label: "Low-Latency Network Stream",
                        done: preCheckProgress.network,
                        icon: Wifi,
                        detail: "Connected · 18ms ping",
                      },
                      {
                        label: "Cheating Prevention Browser Lock",
                        done: preCheckProgress.browserLock,
                        icon: Lock,
                        detail: "Tab-switch & clipboard guard armed",
                      },
                    ].map((chk) => {
                      const Icon = chk.icon;
                      return (
                        <div
                          key={chk.label}
                          className={cn(
                            "flex items-start gap-3 rounded-xl border p-3.5 transition-all",
                            chk.done
                              ? "border-emerald-500/40 bg-emerald-500/5"
                              : "border-border bg-muted/20"
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                              chk.done ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                            )}
                          >
                            {chk.done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-foreground">{chk.label}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              {chk.done ? chk.detail : "Checking hardware..."}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="rounded-xl border border-border bg-muted/30 p-3.5 text-xs space-y-1.5">
                    <div className="font-bold text-foreground flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-primary" /> Assessment Rules & Proctoring Protocol
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      • Passing score is <strong>60%</strong>. Passing unlocks your verifiable certificate and updates your CIR readiness score immediately.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      • AI Cheating Prevention monitors tab switches, secondary displays, and clipboard activity throughout the session.
                    </p>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setActiveAssessment(null)}>
                      Cancel
                    </Button>
                    <Button
                      disabled={!allChecksPassed}
                      onClick={() => setWorkflowStage("test")}
                      className="gap-1.5 cursor-pointer"
                    >
                      <Play className="h-3.5 w-3.5" /> Launch Proctored Test
                    </Button>
                  </DialogFooter>
                </div>
              )}

              {/* STAGE 2: LIVE TEST QUESTIONS */}
              {workflowStage === "test" && (
                <div className="space-y-4 py-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/40 px-3 py-2 rounded-lg border border-border">
                    <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      AI Proctoring Active · Integrity 100%
                    </span>
                    <span>
                      Question {currentQuestionIdx + 1} / {activeAssessment.questions.length}
                    </span>
                  </div>

                  {(() => {
                    const qObj = activeAssessment.questions[currentQuestionIdx];
                    const chosen = selectedAnswers[currentQuestionIdx];
                    return (
                      <div className="space-y-3 rounded-xl border border-border bg-card p-4">
                        <h4 className="text-sm font-bold text-foreground leading-snug">{qObj.q}</h4>
                        <div className="space-y-2 pt-1">
                          {qObj.options.map((opt, oIdx) => {
                            const isSelected = chosen === oIdx;
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() =>
                                  setSelectedAnswers((prev) => ({ ...prev, [currentQuestionIdx]: oIdx }))
                                }
                                className={cn(
                                  "w-full flex items-center gap-3 rounded-xl border p-3 text-left text-xs font-medium transition-all cursor-pointer",
                                  isSelected
                                    ? "border-primary bg-primary/10 text-primary font-bold"
                                    : "border-border bg-background hover:bg-muted/50 text-foreground"
                                )}
                              >
                                <span
                                  className={cn(
                                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold",
                                    isSelected
                                      ? "border-primary bg-primary text-primary-foreground"
                                      : "border-border text-muted-foreground"
                                  )}
                                >
                                  {String.fromCharCode(65 + oIdx)}
                                </span>
                                <span>{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  <DialogFooter className="flex items-center justify-between sm:justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentQuestionIdx === 0}
                      onClick={() => setCurrentQuestionIdx((i) => Math.max(0, i - 1))}
                    >
                      Previous
                    </Button>
                    {currentQuestionIdx < activeAssessment.questions.length - 1 ? (
                      <Button
                        size="sm"
                        onClick={() => setCurrentQuestionIdx((i) => i + 1)}
                        className="cursor-pointer"
                      >
                        Next Question
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={handleFinishTest}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer gap-1.5"
                      >
                        <CheckCircle2 className="h-4 w-4" /> Submit & Generate CIR Score
                      </Button>
                    )}
                  </DialogFooter>
                </div>
              )}

              {/* STAGE 3: INSTANT CIR SCORE & RESULT */}
              {workflowStage === "result" && computedScore !== null && (
                <div className="space-y-4 py-3">
                  <div className="flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5">
                    <MatchRing percent={computedScore} size={68} />
                    <div className="space-y-1 text-center sm:text-left">
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Passed & AI-Verified
                      </div>
                      <h4 className="text-base font-bold text-foreground">
                        {activeAssessment.skill} Score: {computedScore}% ({activeAssessment.percentile})
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Your verified score and certificate have been added to your profile and synced to {activeAssessment.hiringPartners}+ employers.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 rounded-xl border border-border bg-muted/20 p-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Sub-Skill Performance Breakdown
                    </h5>
                    {activeAssessment.subSkills.map((sub) => (
                      <div key={sub.name} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-foreground">{sub.name}</span>
                          <span className="font-bold text-primary">{sub.score}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${sub.score}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <DialogFooter className="gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        const cred = buildRealTimeCredential(activeAssessment);
                        downloadCirReportPdf({ ...cred, score: computedScore });
                        onToast(`Downloaded CIR Report PDF for ${activeAssessment.skill}`);
                      }}
                      className="gap-1.5 cursor-pointer"
                    >
                      <Download className="h-4 w-4" /> Download CIR PDF
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const cred = buildRealTimeCredential(activeAssessment);
                        downloadCertificatePdf({ ...cred, score: computedScore });
                        onToast(`Downloaded Certificate PDF for ${activeAssessment.skill}`);
                      }}
                      className="gap-1.5 cursor-pointer"
                    >
                      <Download className="h-4 w-4" /> Download Certificate PDF
                    </Button>
                    <Button onClick={() => setActiveAssessment(null)} className="cursor-pointer">
                      Done
                    </Button>
                  </DialogFooter>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ================= CIR REPORT INSPECTION MODAL ================= */}
      <Dialog open={Boolean(inspectCirSkill)} onOpenChange={(open) => !open && setInspectCirSkill(null)}>
        <DialogContent className="sm:max-w-xl max-h-[90dvh] overflow-y-auto">
          {inspectCirSkill && (() => {
            const modalCred = buildRealTimeCredential(inspectCirSkill);
            return (
              <>
                <DialogHeader>
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 border-emerald-500/30 text-xs">
                      Verified CIR Report · {modalCred.credentialId}
                    </Badge>
                    <span className="text-xs font-semibold text-emerald-600">
                      Proctoring Integrity: {inspectCirSkill.integrityScore}
                    </span>
                  </div>
                  <DialogTitle className="mt-1">
                    {inspectCirSkill.skill} — Real-Time Career Intelligence Report (CIR)
                  </DialogTitle>
                  <DialogDescription className="text-xs">
                    Attempted on {inspectCirSkill.attemptedAt} · {inspectCirSkill.percentile} National Percentile · Hash: {modalCred.verificationHash}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="rounded-xl border border-border bg-muted/30 p-3">
                      <span className="text-[10px] text-muted-foreground block">Verified Score</span>
                      <strong className="text-base font-extrabold text-primary">{modalCred.score}%</strong>
                      <span className="text-[10px] text-emerald-600 font-semibold block">{modalCred.percentile}</span>
                    </div>
                    <div className="rounded-xl border border-border bg-muted/30 p-3">
                      <span className="text-[10px] text-muted-foreground block">Time &amp; Pacing</span>
                      <strong className="text-sm font-bold text-foreground">{modalCred.timeTaken}</strong>
                      <span className="text-[10px] text-muted-foreground block">Optimal Speed</span>
                    </div>
                    <div className="rounded-xl border border-border bg-muted/30 p-3">
                      <span className="text-[10px] text-muted-foreground block">Coding Cases</span>
                      <strong className="text-sm font-bold text-foreground">{modalCred.codingTestCases}</strong>
                      <span className="text-[10px] text-emerald-600 font-semibold block">Zero Warnings</span>
                    </div>
                    <div className="rounded-xl border border-border bg-muted/30 p-3">
                      <span className="text-[10px] text-muted-foreground block">Salary Band Fit</span>
                      <strong className="text-sm font-bold text-foreground">{modalCred.salaryBand}</strong>
                      <span className="text-[10px] text-muted-foreground block">500+ Partners</span>
                    </div>
                  </div>

                  <div className="space-y-2.5 rounded-xl border border-border bg-muted/15 p-3.5">
                    <strong className="text-foreground block">Sub-Domain Competency vs Peer Median:</strong>
                    {modalCred.subSkills.map((s) => (
                      <div key={s.name} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="font-medium text-foreground">{s.name}</span>
                          <strong className="text-primary">
                            {s.score}% <span className="text-[10px] font-normal text-muted-foreground">(Peer: {s.benchmark}%)</span>
                          </strong>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${s.score}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl border border-border bg-card p-3.5 space-y-1">
                    <strong className="text-foreground block">AI Recruiter Evaluation Summary:</strong>
                    <p className="text-muted-foreground leading-relaxed">{modalCred.recruiterSummary}</p>
                  </div>
                </div>

                <DialogFooter className="flex-wrap gap-2">
                  <Button variant="outline" onClick={() => setInspectCirSkill(null)}>
                    Close
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      downloadCertificatePdf(modalCred);
                      onToast(`Downloaded Certificate PDF: IAmTalento-Certificate-${modalCred.credentialId}.pdf`);
                    }}
                    className="gap-1.5 cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" /> Certificate (.pdf)
                  </Button>
                  <Button
                    onClick={() => {
                      downloadCirReportPdf(modalCred);
                      onToast(`Downloaded CIR Report PDF: IAmTalento-CIR-Report-${modalCred.credentialId}.pdf`);
                    }}
                    className="gap-1.5 bg-[#FB923C] hover:bg-[#F97316] text-white cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" /> Download CIR Report (.pdf)
                  </Button>
                </DialogFooter>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
};
