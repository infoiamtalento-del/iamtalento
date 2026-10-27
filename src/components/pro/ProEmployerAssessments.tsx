import { useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ClipboardList,
  CheckCircle2,
  Clock,
  Users,
  Plus,
  Search,
  Code2,
  Sparkles,
  Eye,
  Pencil,
  Copy,
  Trash2,
  ShieldCheck,
  Play,
  Check,
  Camera,
  Mic,
  Lock,
  Timer,
  Award,
  LayoutGrid,
  List,
  ChevronRight,
  Target,
  BarChart3,
  Layers,
  FileCheck2,
  SlidersHorizontal,
  UserCheck,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ProHero } from "./ProHero";
import { MatchRing } from "./ProMatchRing";
import type {
  EmployerDemoState,
  EmployerAssessmentRecord,
  EmployerAssessmentQuestion,
} from "@/data/employerDemo";
import type { ProApplication } from "@/data/proData";

interface Props {
  state: EmployerDemoState;
  applications: ProApplication[];
  onChange: (state: EmployerDemoState) => void;
  onBack: () => void;
  onToast: (message: string) => void;
}

const DEFAULT_QUESTION_TEMPLATES: Record<string, EmployerAssessmentQuestion[]> = {
  react: [
    {
      id: "q-react-1",
      q: "Which React 18 hook defers re-rendering of a non-urgent UI subtree while keeping user input responsive?",
      options: ["useMemo", "useDeferredValue", "useLayoutEffect", "useImperativeHandle"],
      answer: 1,
      points: 10,
      skillTag: "React 18 Concurrency",
    },
    {
      id: "q-react-2",
      q: "In TypeScript, which utility type constructs a type with all properties of T set to optional?",
      options: ["Required<T>", "Partial<T>", "Pick<T, K>", "Readonly<T>"],
      answer: 1,
      points: 10,
      skillTag: "TypeScript Generics",
    },
    {
      id: "q-react-3",
      q: "What prevents unnecessary child re-renders when passing a callback prop to a React.memo component?",
      options: [
        "Wrapping the callback in useCallback",
        "Using inline arrow functions",
        "Calling forceUpdate",
        "Mutating state directly",
      ],
      answer: 0,
      points: 10,
      skillTag: "Render Optimization",
    },
  ],
  sql: [
    {
      id: "q-sql-1",
      q: "Which SQL clause filters grouped rows AFTER aggregate functions have been computed?",
      options: ["WHERE", "HAVING", "ORDER BY", "DISTINCT"],
      answer: 1,
      points: 10,
      skillTag: "SQL Aggregations",
    },
    {
      id: "q-sql-2",
      q: "Which window function assigns consecutive ranks without gaps when ties occur?",
      options: ["ROW_NUMBER()", "RANK()", "DENSE_RANK()", "NTILE()"],
      answer: 2,
      points: 10,
      skillTag: "Window Functions",
    },
    {
      id: "q-sql-3",
      q: "What is the primary benefit of a composite B-Tree index on (company_id, created_at)?",
      options: [
        "Accelerates equality lookups on company_id and range/order scans on created_at",
        "Automatically encrypts table columns",
        "Removes foreign key constraints",
        "Disables transaction logs",
      ],
      answer: 0,
      points: 10,
      skillTag: "Query Indexing",
    },
  ],
  cloud: [
    {
      id: "q-cloud-1",
      q: "In Kubernetes, which controller ensures that a specified number of Pod replicas are running at any given time?",
      options: ["Ingress", "Deployment / ReplicaSet", "ConfigMap", "ServiceAccount"],
      answer: 1,
      points: 10,
      skillTag: "Kubernetes",
    },
    {
      id: "q-cloud-2",
      q: "Which Terraform command previews infrastructure changes before applying them to cloud providers?",
      options: ["terraform init", "terraform plan", "terraform destroy", "terraform fmt"],
      answer: 1,
      points: 10,
      skillTag: "Terraform IaC",
    },
    {
      id: "q-cloud-3",
      q: "Which AWS service provides managed DDoS protection and Web Application Firewall capabilities at the edge?",
      options: ["AWS Shield & AWS WAF", "Amazon S3 Glacier", "AWS Glue", "Amazon Redshift"],
      answer: 0,
      points: 10,
      skillTag: "AWS Security",
    },
  ],
  aptitude: [
    {
      id: "q-apt-1",
      q: "If 5 build servers compile 5 microservices in 5 minutes, how many minutes does it take 10 build servers to compile 10 microservices?",
      options: ["10 minutes", "5 minutes", "1 minute", "25 minutes"],
      answer: 1,
      points: 10,
      skillTag: "Logical Reasoning",
    },
    {
      id: "q-apt-2",
      q: "A system's API latency decreased from 250ms to 200ms after caching. What is the percentage reduction in latency?",
      options: ["15%", "20%", "25%", "50%"],
      answer: 1,
      points: 10,
      skillTag: "Quantitative Analysis",
    },
    {
      id: "q-apt-3",
      q: "Find the next number in the sequence: 2, 6, 12, 20, 30, ?",
      options: ["38", "40", "42", "44"],
      answer: 2,
      points: 10,
      skillTag: "Pattern Recognition",
    },
  ],
  hr: [
    {
      id: "q-hr-1",
      q: "When a critical production release faces an unexpected blocker 2 hours before launch, what is the best first action?",
      options: [
        "Communicate transparently with stakeholders, assess rollback/mitigation options, and align on impact",
        "Hide the issue until after the release",
        "Blame another team in the public channel",
        "Skip all automated tests and force deploy",
      ],
      answer: 0,
      points: 10,
      skillTag: "Stakeholder Communication",
    },
    {
      id: "q-hr-2",
      q: "During a code review, a teammate disagrees with your architectural approach. How do you resolve it?",
      options: [
        "Compare trade-offs using benchmarks, maintainability, and team conventions to reach consensus",
        "Merge the PR without approval",
        "Close the PR and stop working on the feature",
        "Escalate immediately without technical discussion",
      ],
      answer: 0,
      points: 10,
      skillTag: "Collaboration & Ownership",
    },
  ],
};

interface BlueprintPreset {
  key: "react" | "sql" | "cloud" | "hr";
  title: string;
  type: string;
  difficulty: string;
  duration: number;
  passingScore: number;
  skills: string;
  badge: string;
  description: string;
}

const BLUEPRINT_PRESETS: BlueprintPreset[] = [
  {
    key: "react",
    title: "Frontend React 18 & TypeScript Architecture",
    type: "Coding",
    difficulty: "Advanced",
    duration: 45,
    passingScore: 75,
    skills: "React 18, TypeScript, State Management, Performance",
    badge: "Most Popular",
    description:
      "Evaluates production React concurrency, TypeScript generics, custom hooks, and rendering optimization.",
  },
  {
    key: "sql",
    title: "Backend SQL & Distributed Data Engineering",
    type: "Technical",
    difficulty: "Intermediate",
    duration: 40,
    passingScore: 70,
    skills: "PostgreSQL, Window Functions, Indexing, Query Tuning",
    badge: "Data & Backend",
    description:
      "Tests complex SQL aggregations, window functions, composite B-Tree indexing, and query execution plans.",
  },
  {
    key: "cloud",
    title: "Cloud Infrastructure, Kubernetes & DevSecOps",
    type: "System Design",
    difficulty: "Advanced",
    duration: 45,
    passingScore: 72,
    skills: "AWS, Kubernetes, Terraform, CI/CD Security",
    badge: "Cloud & SRE",
    description:
      "Assesses Kubernetes workload orchestration, Terraform IaC workflows, and cloud edge security architecture.",
  },
  {
    key: "hr",
    title: "Engineering Leadership & Behavioral Judgment",
    type: "HR / Behavioral",
    difficulty: "Intermediate",
    duration: 25,
    passingScore: 65,
    skills: "Stakeholder Management, Incident Response, Ownership",
    badge: "Culture & Fit",
    description:
      "Scenario-based evaluation of engineering communication, release ownership, and cross-functional alignment.",
  },
];

function getQuestionsForRecord(
  rec: Partial<EmployerAssessmentRecord>
): EmployerAssessmentQuestion[] {
  if (rec.questionItems && rec.questionItems.length > 0) {
    return rec.questionItems;
  }
  const lower = `${rec.name || ""} ${rec.type || ""} ${(rec.skills || []).join(" ")}`.toLowerCase();
  if (lower.includes("sql") || lower.includes("data") || lower.includes("analytic")) {
    return DEFAULT_QUESTION_TEMPLATES.sql;
  }
  if (lower.includes("cloud") || lower.includes("aws") || lower.includes("kubernetes")) {
    return DEFAULT_QUESTION_TEMPLATES.cloud;
  }
  if (lower.includes("aptitude") || lower.includes("logical")) {
    return DEFAULT_QUESTION_TEMPLATES.aptitude;
  }
  if (lower.includes("hr") || lower.includes("communication") || lower.includes("teamwork")) {
    return DEFAULT_QUESTION_TEMPLATES.hr;
  }
  return DEFAULT_QUESTION_TEMPLATES.react;
}

export function ProEmployerAssessments({
  state,
  applications,
  onChange,
  onBack,
  onToast,
}: Props) {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Create / Edit Builder Modal State
  const [builderOpen, setBuilderOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [builderTab, setBuilderTab] = useState<"edit" | "preview">("edit");

  const [name, setName] = useState("");
  const [type, setType] = useState("Technical");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [passingScore, setPassingScore] = useState(70);
  const [proctoring, setProctoring] = useState(true);
  const [skillsInput, setSkillsInput] = useState("React, TypeScript, System Design");
  const [questions, setQuestions] = useState(10);
  const [duration, setDuration] = useState(30);
  const [candidate, setCandidate] = useState("");
  const [description, setDescription] = useState("");
  const [questionItems, setQuestionItems] = useState<EmployerAssessmentQuestion[]>(
    DEFAULT_QUESTION_TEMPLATES.react
  );

  // Standalone Assessment Preview Modal State
  const [previewRecord, setPreviewRecord] = useState<EmployerAssessmentRecord | null>(null);
  const [previewMode, setPreviewMode] = useState<"candidate" | "answer-key">("candidate");
  const [previewQuestionIdx, setPreviewQuestionIdx] = useState(0);
  const [previewAnswers, setPreviewAnswers] = useState<Record<number, number>>({});
  const [previewSubmittedScore, setPreviewSubmittedScore] = useState<number | null>(null);

  // View Details / Candidate Result Modal State
  const [selected, setSelected] = useState<number | null>(null);

  const normalizeStatus = (value: string) => (value === "Invited" ? "Active" : value);
  const records = state.assessments;
  const filtered = records.filter(
    (r) =>
      (filter === "All" || normalizeStatus(r.status) === filter) &&
      `${r.name} ${r.candidate} ${r.type || ""} ${(r.skills || []).join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase())
  );
  const record = records.find((r) => r.id === selected);

  const completedRecords = records.filter((r) => r.status === "Completed");
  const avgCompletedScore = completedRecords.length
    ? Math.round(
        completedRecords.reduce((acc, r) => acc + (r.score ?? 80), 0) /
          completedRecords.length
      )
    : 84;

  const openCreateModal = (preset?: BlueprintPreset) => {
    setEditingId(null);
    setBuilderTab("edit");
    if (preset) {
      setName(preset.title);
      setType(preset.type);
      setDifficulty(preset.difficulty);
      setPassingScore(preset.passingScore);
      setProctoring(true);
      setSkillsInput(preset.skills);
      setDuration(preset.duration);
      setCandidate("");
      setDescription(preset.description);
      const tpl = DEFAULT_QUESTION_TEMPLATES[preset.key] || DEFAULT_QUESTION_TEMPLATES.react;
      setQuestionItems(tpl.map((q) => ({ ...q, options: [...q.options] })));
      setQuestions(Math.max(10, tpl.length));
    } else {
      setName("");
      setType("Technical");
      setDifficulty("Intermediate");
      setPassingScore(70);
      setProctoring(true);
      setSkillsInput("React, TypeScript, REST APIs");
      setQuestions(10);
      setDuration(30);
      setCandidate("");
      setDescription(
        "Role-aligned technical screening with AI Cheating Prevention and sub-skill CIR evaluation."
      );
      setQuestionItems(
        DEFAULT_QUESTION_TEMPLATES.react.map((q) => ({ ...q, options: [...q.options] }))
      );
    }
    setBuilderOpen(true);
  };

  const openEditModal = (rec: EmployerAssessmentRecord) => {
    setEditingId(rec.id);
    setBuilderTab("edit");
    setName(rec.name);
    setType(rec.type || "Technical");
    setDifficulty(rec.difficulty || "Intermediate");
    setPassingScore(rec.passingScore ?? 70);
    setProctoring(rec.proctoring ?? true);
    setSkillsInput((rec.skills || [rec.type || "Technical"]).join(", "));
    setQuestions(rec.questions ?? 10);
    setDuration(rec.duration ?? 30);
    setCandidate(rec.candidate || "");
    setDescription(
      rec.description ||
        "Role-aligned technical screening with AI Cheating Prevention and sub-skill CIR evaluation."
    );
    const existingQs = getQuestionsForRecord(rec).map((q) => ({
      ...q,
      options: [...q.options],
    }));
    setQuestionItems(existingQs);
    setBuilderOpen(true);
  };

  const openPreviewModal = (rec: EmployerAssessmentRecord) => {
    setPreviewRecord({
      ...rec,
      questionItems: getQuestionsForRecord(rec),
    });
    setPreviewMode("candidate");
    setPreviewQuestionIdx(0);
    setPreviewAnswers({});
    setPreviewSubmittedScore(null);
  };

  const handleDuplicate = (rec: EmployerAssessmentRecord) => {
    const cloned: EmployerAssessmentRecord = {
      ...rec,
      id: Date.now(),
      name: `${rec.name} (Copy)`,
      status: "Draft",
      candidate: "",
      score: undefined,
      at: Date.now(),
      questionItems: getQuestionsForRecord(rec).map((q) => ({
        ...q,
        id: `${q.id}-copy-${Math.random().toString(36).slice(2, 6)}`,
        options: [...q.options],
      })),
    };
    onChange({
      ...state,
      assessments: [cloned, ...records],
    });
    onToast(`Duplicated "${rec.name}" as a new editable draft.`);
  };

  const handleDelete = (rec: EmployerAssessmentRecord) => {
    onChange({
      ...state,
      assessments: records.filter((r) => r.id !== rec.id),
    });
    onToast(`Deleted assessment "${rec.name}".`);
  };

  const handleSaveBuilder = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedSkills = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingId !== null) {
      const updatedList = records.map((r) => {
        if (r.id !== editingId) return r;
        const nextStatus =
          candidate && r.status === "Draft"
            ? "Invited"
            : !candidate && r.status === "Invited"
            ? "Draft"
            : r.status;
        return {
          ...r,
          name: name.trim(),
          type,
          difficulty,
          passingScore,
          proctoring,
          skills: parsedSkills,
          questions: Math.max(questions, questionItems.length),
          duration,
          candidate,
          description,
          status: nextStatus,
          questionItems,
        };
      });
      onChange({ ...state, assessments: updatedList });
      setBuilderOpen(false);
      onToast(`Updated assessment "${name.trim()}" successfully!`);
    } else {
      const newRec: EmployerAssessmentRecord = {
        id: Date.now(),
        name: name.trim(),
        candidate,
        type,
        difficulty,
        passingScore,
        proctoring,
        skills: parsedSkills,
        questions: Math.max(questions, questionItems.length),
        duration,
        description,
        at: Date.now(),
        status: candidate ? "Invited" : "Draft",
        questionItems,
      };
      onChange({ ...state, assessments: [newRec, ...records] });
      setBuilderOpen(false);
      onToast(
        candidate
          ? `Assessment "${newRec.name}" created and assigned to ${candidate}.`
          : `Assessment "${newRec.name}" saved. You can preview or edit it anytime.`
      );
    }
  };

  const addQuestionItem = () => {
    const nextIdx = questionItems.length + 1;
    setQuestionItems((prev) => [
      ...prev,
      {
        id: `custom-q-${Date.now()}`,
        q: `Question ${nextIdx}: Select the most scalable architectural solution for this production scenario.`,
        options: ["Option A (Correct Solution)", "Option B", "Option C", "Option D"],
        answer: 0,
        points: 10,
        skillTag: type || "Technical",
      },
    ]);
    setQuestions((q) => Math.max(q, questionItems.length + 1));
  };

  const updateQuestionItem = (
    idx: number,
    patch: Partial<EmployerAssessmentQuestion>
  ) => {
    setQuestionItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, ...patch } : item))
    );
  };

  const updateQuestionOption = (qIdx: number, optIdx: number, val: string) => {
    setQuestionItems((prev) =>
      prev.map((item, i) => {
        if (i !== qIdx) return item;
        const nextOpts = [...item.options];
        nextOpts[optIdx] = val;
        return { ...item, options: nextOpts };
      })
    );
  };

  const removeQuestionItem = (idx: number) => {
    if (questionItems.length <= 1) {
      onToast("An assessment must have at least 1 question.");
      return;
    }
    setQuestionItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const getStatusStyle = (rawStatus: string) => {
    const st = normalizeStatus(rawStatus);
    if (st === "Completed") {
      return {
        badge: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
        accentBar: "bg-emerald-500",
        dot: "bg-emerald-500",
        label: "Completed",
      };
    }
    if (st === "Active") {
      return {
        badge: "bg-sky-500/10 text-sky-700 border-sky-500/30",
        accentBar: "bg-[#002C66]",
        dot: "bg-sky-500",
        label: "Active / Invited",
      };
    }
    return {
      badge: "bg-amber-500/15 text-amber-800 border-amber-500/30",
      accentBar: "bg-[#FB923C]",
      dot: "bg-[#FB923C]",
      label: "Editable Template",
    };
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#002C66] hover:text-[#FB923C] transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Employer Dashboard
        </button>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            AI Cheating Prevention Engine Active
          </span>
        </div>
      </div>

      {/* ================= EXECUTIVE HERO BANNER ================= */}
      <ProHero
        eyebrow="IAmTalento Employer Assessment Studio"
        icon={<ClipboardList className="h-5 w-5" />}
        title="Create, Preview & Manage Role Assessments"
        subtitle="Build custom technical, coding, system design, or behavioral assessments. Preview the exact proctored candidate test experience and edit any existing assessment or question bank in real time."
        aside={
          <div className="flex flex-col gap-2.5 lg:w-80">
            <button
              type="button"
              onClick={() => openCreateModal()}
              className="flex w-full items-center gap-3.5 rounded-2xl bg-[#FB923C] hover:bg-[#F97316] px-4 py-3.5 text-left text-white shadow-md transition-all cursor-pointer"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
                <Plus className="h-5 w-5 text-white" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-white">
                  Create New Assessment
                </span>
                <span className="block text-[11px] text-white/90">
                  Custom Questions · Proctoring · Live Preview
                </span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-white" />
            </button>

            {records[0] && (
              <button
                type="button"
                onClick={() => openPreviewModal(records[0])}
                className="flex w-full items-center justify-between rounded-xl bg-white/15 hover:bg-white/25 px-4 py-2.5 text-xs font-semibold text-white transition-all cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-[#FB923C]" />
                  Preview Candidate Test Simulator
                </span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        }
      >
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold text-white ring-1 ring-white/25">
            <ClipboardList className="h-3.5 w-3.5 text-[#FB923C]" /> {records.length} Total Assessments
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold text-white ring-1 ring-white/25">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" /> AI Proctoring Integrity: 99.6%
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold text-white ring-1 ring-white/25">
            <BarChart3 className="h-3.5 w-3.5 text-sky-300" /> Avg Candidate Score: {avgCompletedScore}%
          </span>
        </div>
      </ProHero>

      {/* ================= 4 EXECUTIVE KPI SUMMARY CARDS ================= */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Assessments",
            value: records.length,
            sub: `${records.filter((r) => r.status === "Draft").length} reusable templates ready`,
            icon: ClipboardList,
            iconBg: "bg-[#002C66]/10 text-[#002C66]",
            targetFilter: "All",
          },
          {
            label: "Completed Evaluations",
            value: completedRecords.length,
            sub: `Avg Score: ${avgCompletedScore}% · CIR Generated`,
            icon: CheckCircle2,
            iconBg: "bg-emerald-500/10 text-emerald-600",
            targetFilter: "Completed",
          },
          {
            label: "Active / Invited Tests",
            value: records.filter((r) =>
              ["Invited", "Pending", "Active"].includes(r.status)
            ).length,
            sub: "Awaiting candidate submission",
            icon: Clock,
            iconBg: "bg-sky-500/10 text-sky-600",
            targetFilter: "Active",
          },
          {
            label: "Assigned Candidates",
            value: new Set(
              records.filter((r) => r.candidate).map((r) => r.candidate)
            ).size,
            sub: "Synced with Applicant Pipeline",
            icon: Users,
            iconBg: "bg-[#FB923C]/15 text-[#EA580C]",
            targetFilter: "All",
          },
        ].map((kpi) => {
          const Icon = kpi.icon;
          const isSelected = filter === kpi.targetFilter && kpi.label !== "Assigned Candidates";
          return (
            <button
              key={kpi.label}
              type="button"
              onClick={() => setFilter(kpi.targetFilter)}
              className={cn(
                "group rounded-2xl border bg-card p-5 text-left shadow-sm transition-all cursor-pointer flex items-start gap-4",
                isSelected
                  ? "border-[#002C66] ring-2 ring-[#002C66]/15"
                  : "border-border hover:border-[#002C66]/40 hover:shadow-md"
              )}
            >
              <span
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform group-hover:scale-105",
                  kpi.iconBg
                )}
              >
                <Icon className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-semibold text-muted-foreground block">
                  {kpi.label}
                </span>
                <div className="font-display text-2xl font-extrabold text-foreground mt-0.5">
                  {kpi.value}
                </div>
                <span className="text-[11px] font-medium text-muted-foreground mt-1 block truncate">
                  {kpi.sub}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ================= QUICK-START ASSESSMENT BLUEPRINTS ================= */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#002C66]/10 text-[#002C66]">
              <Layers className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-base font-bold text-foreground">
                  Quick-Start Assessment Blueprints (1-Click Templates)
                </h2>
                <span className="rounded-full bg-[#FB923C]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#EA580C]">
                  Pre-Built Question Banks
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Launch a pre-configured industry assessment template or customize its questions before inviting candidates.
              </p>
            </div>
          </div>
          <Button
            onClick={() => openCreateModal()}
            className="bg-[#002C66] hover:bg-[#001F4D] text-white rounded-xl h-9 px-4 text-xs font-bold gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" /> Build From Scratch
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {BLUEPRINT_PRESETS.map((bp) => (
            <div
              key={bp.key}
              className="group flex flex-col justify-between rounded-xl border border-border bg-background p-4 hover:border-[#002C66]/40 hover:shadow-sm transition-all"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-md bg-[#002C66]/10 px-2 py-0.5 text-[10px] font-bold text-[#002C66]">
                    {bp.type} · {bp.difficulty}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    {bp.duration}m · {bp.passingScore}% Pass
                  </span>
                </div>
                <h3 className="font-display text-sm font-bold text-foreground group-hover:text-[#002C66] transition-colors">
                  {bp.title}
                </h3>
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  {bp.description}
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {bp.skills.split(",").map((s) => (
                    <span
                      key={s}
                      className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-foreground/80"
                    >
                      {s.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border/60 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openCreateModal(bp)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#002C66] hover:bg-[#001F4D] px-3 py-2 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Customize &amp; Use
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= MANAGE, PREVIEW & EDIT ASSESSMENTS DIRECTORY ================= */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-5">
        {/* Filter, Search & View Mode Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2">
              Your Employer Assessments Directory
              <Badge variant="outline" className="text-[11px] font-bold">
                {filtered.length} Assessments
              </Badge>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Click <strong>Preview</strong> to test the live candidate view, or click{" "}
              <strong>Edit</strong> to modify any existing assessment&apos;s settings and questions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Box */}
            <div className="relative min-w-[230px] flex-1 sm:flex-initial">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                aria-label="Search assessments"
                className="pl-9 h-9 rounded-xl text-xs"
                placeholder="Search title, skill, or candidate..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            {/* Grid / Table View Toggle */}
            <div className="inline-flex items-center rounded-xl border border-border bg-muted/40 p-1">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer",
                  viewMode === "grid"
                    ? "bg-[#002C66] text-white shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <LayoutGrid className="h-3.5 w-3.5" /> Cards
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer",
                  viewMode === "table"
                    ? "bg-[#002C66] text-white shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <List className="h-3.5 w-3.5" /> Table
              </button>
            </div>
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "All", label: "All Assessments" },
              { id: "Active", label: "Active / Invited" },
              { id: "Completed", label: "Completed" },
              { id: "Draft", label: "Draft Templates" },
            ].map((tab) => {
              const count = records.filter(
                (r) => tab.id === "All" || normalizeStatus(r.status) === tab.id
              ).length;
              const active = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer",
                    active
                      ? "bg-[#002C66] text-white shadow-sm"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span>{tab.label}</span>
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.2 text-[10px]",
                      active ? "bg-white/20 text-white" : "bg-background text-foreground"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => openCreateModal()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#FB923C] hover:bg-[#F97316] px-4 py-2 text-xs font-bold text-white shadow-xs transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Create Assessment
          </button>
        </div>

        {/* ================= VIEW MODE 1: MODERN EXECUTIVE CARDS GRID ================= */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {filtered.map((r) => {
              const qList = getQuestionsForRecord(r);
              const stStyle = getStatusStyle(r.status);
              const cutoff = r.passingScore ?? 70;
              const passed = (r.score ?? 0) >= cutoff;

              return (
                <div
                  key={r.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-border bg-background shadow-2xs hover:shadow-md hover:border-[#002C66]/40 transition-all overflow-hidden"
                >
                  {/* Top Colored Status Strip */}
                  <div className={cn("h-1.5 w-full", stStyle.accentBar)} />

                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      {/* Top Badges Row */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 rounded-lg bg-[#002C66]/10 px-2.5 py-1 text-[11px] font-bold text-[#002C66]">
                            <Code2 className="h-3.5 w-3.5" />
                            {r.type || "Technical"}
                          </span>
                          <span className="rounded-lg border border-border bg-muted/40 px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                            {r.difficulty || "Intermediate"}
                          </span>
                          {(r.proctoring ?? true) && (
                            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                              <ShieldCheck className="h-3 w-3" /> AI Proctored
                            </span>
                          )}
                        </div>

                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold",
                            stStyle.badge
                          )}
                        >
                          <span className={cn("h-1.5 w-1.5 rounded-full", stStyle.dot)} />
                          {stStyle.label}
                        </span>
                      </div>

                      {/* Assessment Title & Description */}
                      <div>
                        <h3 className="font-display text-base font-bold text-foreground group-hover:text-[#002C66] transition-colors">
                          {r.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {r.description ||
                            "Role-aligned technical evaluation with automated grading and sub-skill CIR telemetry."}
                        </p>
                      </div>

                      {/* Skills Tags */}
                      {r.skills && r.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {r.skills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-md bg-primary/8 border border-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 pt-2">
                      {/* 3-Column Telemetry Strip */}
                      <div className="grid grid-cols-3 gap-2 rounded-xl border border-border/70 bg-muted/30 p-3 text-center">
                        <div>
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                            Questions
                          </span>
                          <span className="font-display text-sm font-bold text-foreground mt-0.5 block">
                            {r.questions ?? qList.length} Qs
                          </span>
                          <span className="text-[10px] text-primary font-medium">
                            {qList.length} in Preview
                          </span>
                        </div>
                        <div className="border-x border-border/70 px-2">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                            Duration
                          </span>
                          <span className="font-display text-sm font-bold text-foreground mt-0.5 block">
                            {r.duration ?? 30} Mins
                          </span>
                          <span className="text-[10px] text-muted-foreground">Timed Test</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                            Pass Cutoff
                          </span>
                          <span className="font-display text-sm font-bold text-emerald-700 mt-0.5 block">
                            {cutoff}% Score
                          </span>
                          <span className="text-[10px] text-muted-foreground">Auto-Graded</span>
                        </div>
                      </div>

                      {/* Candidate & Score Strip */}
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-card px-3.5 py-2.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#002C66] text-[11px] font-bold text-white">
                            {r.candidate
                              ? r.candidate
                                  .split(" ")
                                  .map((w) => w[0])
                                  .join("")
                                  .slice(0, 2)
                              : "TP"}
                          </span>
                          <div className="min-w-0">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                              {r.candidate ? "Assigned Candidate" : "Template Mode"}
                            </span>
                            <span className="text-xs font-bold text-foreground truncate block">
                              {r.candidate || "Reusable for any applicant"}
                            </span>
                          </div>
                        </div>

                        {r.score !== undefined ? (
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="text-right">
                              <span
                                className={cn(
                                  "text-xs font-extrabold block",
                                  passed ? "text-emerald-600" : "text-amber-600"
                                )}
                              >
                                {r.score}% Score
                              </span>
                              <span className="text-[10px] text-muted-foreground block">
                                {passed ? "Passed Cutoff" : "Below Cutoff"}
                              </span>
                            </div>
                            <MatchRing percent={r.score} size={38} />
                          </div>
                        ) : (
                          <span className="text-[11px] font-semibold text-muted-foreground shrink-0">
                            {r.at
                              ? new Date(r.at).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "Oct 2026"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-muted/25 px-5 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openPreviewModal(r)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#002C66] hover:bg-[#001F4D] px-3.5 py-2 text-xs font-bold text-white shadow-2xs transition-all cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5 text-[#FB923C]" />
                        Preview Assessment
                      </button>

                      <button
                        type="button"
                        onClick={() => openEditModal(r)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#002C66]/30 bg-card hover:bg-[#002C66]/5 px-3.5 py-2 text-xs font-bold text-[#002C66] transition-all cursor-pointer"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelected(r.id)}
                        className="inline-flex items-center gap-1 rounded-xl border border-border bg-card hover:bg-muted px-3 py-2 text-xs font-semibold text-foreground transition-all cursor-pointer"
                      >
                        <BarChart3 className="h-3.5 w-3.5 text-primary" />
                        Results
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleDuplicate(r)}
                        title="Duplicate assessment"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-[#002C66]/10 hover:text-[#002C66] transition-colors cursor-pointer"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(r)}
                        title="Delete assessment"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ================= VIEW MODE 2: COMPACT EXECUTIVE TABLE ================= */
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[900px] text-left text-xs">
              <thead className="bg-[#002C66] text-white">
                <tr>
                  {[
                    "Assessment Name & Skills",
                    "Category & Level",
                    "Questions",
                    "Duration & Cutoff",
                    "Candidate & Status",
                    "Actions (Preview / Edit / Manage)",
                  ].map((h) => (
                    <th className="px-4 py-3.5 font-semibold" key={h}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {filtered.map((r) => {
                  const qList = getQuestionsForRecord(r);
                  const stStyle = getStatusStyle(r.status);
                  return (
                    <tr
                      className="hover:bg-muted/30 transition-colors"
                      key={r.id}
                    >
                      <td className="p-4">
                        <div className="flex items-start gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#002C66]/10 text-[#002C66] mt-0.5">
                            <Code2 size={17} />
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-foreground text-sm">
                                {r.name}
                              </p>
                              {(r.proctoring ?? true) && (
                                <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                                  <ShieldCheck className="h-3 w-3" /> Proctored
                                </span>
                              )}
                            </div>
                            {r.skills && r.skills.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {r.skills.map((s) => (
                                  <span
                                    key={s}
                                    className="rounded bg-primary/10 text-primary px-1.5 py-0.5 text-[10px] font-medium"
                                  >
                                    {s}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-foreground">
                          {r.type || "Technical"}
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          {r.difficulty || "Intermediate"} Level
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-foreground">
                          {r.questions ?? qList.length} Questions
                        </div>
                        <div className="text-[11px] text-primary font-medium mt-0.5">
                          {qList.length} interactive sample Qs
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-foreground">
                          {r.duration ? `${r.duration} mins` : "30 mins"}
                        </div>
                        <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                          Pass Cutoff: {r.passingScore ?? 70}%
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-foreground mb-1">
                          {r.candidate || "Reusable Template"}
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold",
                              stStyle.badge
                            )}
                          >
                            {stStyle.label}
                          </span>
                          {r.score !== undefined && (
                            <span className="text-xs font-extrabold text-emerald-600">
                              {r.score}%
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openPreviewModal(r)}
                            className="inline-flex items-center gap-1 rounded-lg bg-[#002C66] hover:bg-[#001F4D] px-3 py-1.5 text-xs font-bold text-white cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5 text-[#FB923C]" /> Preview
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditModal(r)}
                            className="inline-flex items-center gap-1 rounded-lg border border-[#002C66]/30 bg-card hover:bg-[#002C66]/5 px-3 py-1.5 text-xs font-bold text-[#002C66] cursor-pointer"
                          >
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelected(r.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-border bg-card hover:bg-muted px-2.5 py-1.5 text-xs font-semibold text-foreground cursor-pointer"
                          >
                            Results
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDuplicate(r)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                            title="Duplicate"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(r)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!filtered.length && (
          <div className="rounded-2xl border border-dashed border-border py-12 text-center space-y-3">
            <ClipboardList className="h-10 w-10 text-muted-foreground mx-auto" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-foreground">
                No assessments match your current filter
              </p>
              <p className="text-xs text-muted-foreground">
                Try clearing your search query or create a new custom assessment.
              </p>
            </div>
            <Button
              onClick={() => {
                setFilter("All");
                setQuery("");
              }}
              variant="outline"
              size="sm"
              className="rounded-xl text-xs"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </section>

      {/* ================= CREATE / EDIT ASSESSMENT BUILDER MODAL (WITH LIVE PREVIEW TAB) ================= */}
      <Dialog open={builderOpen} onOpenChange={setBuilderOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[92vh] overflow-y-auto p-0 gap-0 rounded-2xl overflow-hidden border-border">
          {/* Executive Navy Modal Header */}
          <div className="bg-[#002C66] text-white p-5 sm:p-6">
            <DialogHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#FB923C]">
                    <Sparkles className="h-3 w-3" />
                    {editingId !== null ? "Edit Existing Assessment" : "Assessment Studio Builder"}
                  </span>
                  <DialogTitle className="text-xl font-bold text-white">
                    {editingId !== null
                      ? `Edit Assessment: ${name || "Untitled"}`
                      : "Create New Employer Assessment"}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-white/80">
                    Configure assessment parameters, customize the question bank &amp; answer key, and preview the live candidate test view before saving.
                  </DialogDescription>
                </div>

                {/* Step Switcher Tabs */}
                <div className="flex items-center gap-1.5 rounded-xl bg-white/10 p-1">
                  <button
                    type="button"
                    onClick={() => setBuilderTab("edit")}
                    className={cn(
                      "px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5",
                      builderTab === "edit"
                        ? "bg-white text-[#002C66] shadow-xs"
                        : "text-white/85 hover:text-white hover:bg-white/10"
                    )}
                  >
                    <Pencil className="h-3.5 w-3.5" /> 1. Configure &amp; Questions
                  </button>
                  <button
                    type="button"
                    onClick={() => setBuilderTab("preview")}
                    className={cn(
                      "px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5",
                      builderTab === "preview"
                        ? "bg-[#FB923C] text-white shadow-xs"
                        : "text-white/85 hover:text-white hover:bg-white/10"
                    )}
                  >
                    <Eye className="h-3.5 w-3.5" /> 2. Live Preview ({questionItems.length} Qs)
                  </button>
                </div>
              </div>
            </DialogHeader>
          </div>

          <div className="p-5 sm:p-6">
            {builderTab === "edit" ? (
              <form className="space-y-6 text-xs" onSubmit={handleSaveBuilder}>
                {/* Section 1: Assessment Configuration */}
                <div className="rounded-2xl border border-border bg-muted/20 p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="h-4 w-4 text-[#002C66]" />
                      <h3 className="text-sm font-bold text-foreground">
                        Assessment Parameters &amp; Settings
                      </h3>
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      All fields can be edited anytime
                    </span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-1.5 font-semibold text-foreground sm:col-span-2">
                      Assessment Title *
                      <Input
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Senior React & TypeScript Architecture Challenge"
                        className="h-10 rounded-xl bg-card"
                      />
                    </label>

                    <label className="grid gap-1.5 font-semibold text-foreground">
                      Assessment Category
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="h-10 rounded-xl border border-border bg-card px-3 text-xs font-medium"
                      >
                        <option value="Technical">Technical</option>
                        <option value="Coding">Coding</option>
                        <option value="System Design">System Design</option>
                        <option value="Aptitude">Aptitude &amp; Logic</option>
                        <option value="HR / Behavioral">HR / Behavioral</option>
                      </select>
                    </label>

                    <label className="grid gap-1.5 font-semibold text-foreground">
                      Difficulty Level
                      <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="h-10 rounded-xl border border-border bg-card px-3 text-xs font-medium"
                      >
                        <option value="Core">Core (0–2 Years)</option>
                        <option value="Intermediate">Intermediate (2–5 Years)</option>
                        <option value="Advanced">Advanced (5+ Years / Lead)</option>
                      </select>
                    </label>

                    <label className="grid gap-1.5 font-semibold text-foreground sm:col-span-2">
                      Evaluated Skills (comma-separated tags)
                      <Input
                        value={skillsInput}
                        onChange={(e) => setSkillsInput(e.target.value)}
                        placeholder="React, TypeScript, System Design, REST APIs"
                        className="h-10 rounded-xl bg-card"
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <label className="grid gap-1.5 font-semibold text-foreground">
                      Total Questions Count
                      <Input
                        type="number"
                        min={1}
                        max={100}
                        value={questions}
                        onChange={(e) => setQuestions(Number(e.target.value))}
                        className="h-10 rounded-xl bg-card"
                      />
                    </label>
                    <label className="grid gap-1.5 font-semibold text-foreground">
                      Time Limit (Minutes)
                      <Input
                        type="number"
                        min={5}
                        max={180}
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className="h-10 rounded-xl bg-card"
                      />
                    </label>
                    <label className="grid gap-1.5 font-semibold text-foreground">
                      Pass Cutoff Score (%)
                      <Input
                        type="number"
                        min={30}
                        max={95}
                        value={passingScore}
                        onChange={(e) => setPassingScore(Number(e.target.value))}
                        className="h-10 rounded-xl bg-card"
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 pt-1">
                    <label className="grid gap-1.5 font-semibold text-foreground">
                      Assign Candidate (Optional)
                      <select
                        value={candidate}
                        onChange={(e) => setCandidate(e.target.value)}
                        className="h-10 rounded-xl border border-border bg-card px-3 text-xs font-medium"
                      >
                        <option value="">Save as Reusable Template / Draft</option>
                        {Array.from(
                          new Set([
                            ...applications.map((a) => a.name),
                            ...records.map((r) => r.candidate).filter(Boolean),
                          ])
                        ).map((cName) => (
                          <option key={cName} value={cName}>
                            {cName}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="flex items-center justify-between rounded-xl border border-border bg-card p-3.5">
                      <div>
                        <div className="font-bold text-foreground flex items-center gap-1.5">
                          <ShieldCheck className="h-4 w-4 text-emerald-600" />
                          AI Cheating Prevention
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Webcam gaze check, audio lock &amp; tab-switch guard
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={proctoring}
                        onChange={(e) => setProctoring(e.target.checked)}
                        className="h-4 w-4 accent-[#002C66] cursor-pointer"
                      />
                    </div>
                  </div>

                  <label className="grid gap-1.5 font-semibold text-foreground">
                    Assessment Instructions &amp; Candidate Brief
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the role expectations, evaluation criteria, and test rules..."
                      className="rounded-xl bg-card min-h-[68px]"
                    />
                  </label>
                </div>

                {/* Section 2: Interactive Question Bank Editor */}
                <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                    <div>
                      <h4 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
                        <Code2 className="h-4 w-4 text-[#002C66]" />
                        Assessment Question Bank ({questionItems.length} Questions)
                      </h4>
                      <p className="text-[11px] text-muted-foreground">
                        Add, edit, or reorder questions and mark the correct option for automated grading.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {(["react", "sql", "cloud", "aptitude", "hr"] as const).map((tplKey) => (
                        <button
                          key={tplKey}
                          type="button"
                          onClick={() =>
                            setQuestionItems(
                              DEFAULT_QUESTION_TEMPLATES[tplKey].map((q) => ({
                                ...q,
                                options: [...q.options],
                              }))
                            )
                          }
                          className="rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-[10px] font-bold uppercase text-muted-foreground hover:text-foreground hover:border-[#002C66]/40 cursor-pointer"
                        >
                          Load {tplKey} Qs
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={addQuestionItem}
                        className="inline-flex items-center gap-1 rounded-lg bg-[#002C66] hover:bg-[#001F4D] px-3 py-1.5 text-xs font-bold text-white cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add Question
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                    {questionItems.map((qItem, qIdx) => (
                      <div
                        key={qItem.id}
                        className="rounded-xl border border-border bg-muted/15 p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center justify-center h-6 w-6 rounded-md bg-[#002C66] text-white text-[11px] font-bold">
                              Q{qIdx + 1}
                            </span>
                            <Input
                              value={qItem.skillTag || ""}
                              onChange={(e) =>
                                updateQuestionItem(qIdx, { skillTag: e.target.value })
                              }
                              placeholder="Sub-skill tag (e.g. React Hooks)"
                              className="h-7 w-48 text-[11px] rounded-lg bg-card"
                            />
                            <span className="text-[11px] text-muted-foreground font-semibold">
                              {qItem.points || 10} pts
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeQuestionItem(qIdx)}
                            className="text-muted-foreground hover:text-destructive p-1 cursor-pointer"
                            title="Remove question"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <Input
                          value={qItem.q}
                          onChange={(e) => updateQuestionItem(qIdx, { q: e.target.value })}
                          placeholder="Enter question prompt..."
                          className="h-9 text-xs font-semibold rounded-lg bg-card"
                        />

                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          {qItem.options.map((opt, optIdx) => {
                            const isCorrect = qItem.answer === optIdx;
                            return (
                              <div
                                key={optIdx}
                                className={cn(
                                  "flex items-center gap-2 rounded-xl border p-2 transition-colors",
                                  isCorrect
                                    ? "border-emerald-500/60 bg-emerald-500/10"
                                    : "border-border bg-card"
                                )}
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuestionItem(qIdx, { answer: optIdx })
                                  }
                                  className={cn(
                                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold cursor-pointer transition-colors",
                                    isCorrect
                                      ? "bg-emerald-600 text-white"
                                      : "bg-muted text-muted-foreground hover:bg-[#002C66]/15"
                                  )}
                                  title="Click to mark as correct answer"
                                >
                                  {String.fromCharCode(65 + optIdx)}
                                </button>
                                <Input
                                  value={opt}
                                  onChange={(e) =>
                                    updateQuestionOption(qIdx, optIdx, e.target.value)
                                  }
                                  className="h-7 text-[11px] border-0 bg-transparent px-1 focus-visible:ring-0"
                                />
                                {isCorrect && (
                                  <span className="text-[9px] font-bold text-emerald-700 px-1.5 shrink-0">
                                    Correct
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Builder Footer Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setBuilderTab("preview")}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#002C66]/30 bg-card hover:bg-[#002C66]/5 px-4 py-2.5 text-xs font-bold text-[#002C66] cursor-pointer"
                  >
                    <Eye className="h-4 w-4 text-[#FB923C]" /> Preview Candidate View
                  </button>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setBuilderOpen(false)}
                      className="rounded-xl h-10 px-4 text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </Button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#FB923C] hover:bg-[#F97316] px-5 py-2.5 text-xs font-bold text-white shadow-sm cursor-pointer"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {editingId !== null ? "Save Assessment Changes" : "Create Assessment"}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              /* ================= LIVE PREVIEW TAB INSIDE CREATE/EDIT MODAL ================= */
              <div className="space-y-5 text-xs">
                <div className="rounded-2xl bg-[#002C66] text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-[#FB923C] px-2 py-0.5 text-[10px] font-extrabold uppercase text-white">
                        Live Candidate Test Preview
                      </span>
                      <span className="text-[11px] text-white/80">
                        {type} · {difficulty} Level
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white">
                      {name || "Untitled Employer Assessment"}
                    </h3>
                    <p className="text-[11px] text-white/80">
                      {description ||
                        "Candidates will complete this proctored assessment under timed conditions."}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5 text-xs font-bold text-white">
                      <Timer className="h-4 w-4 text-[#FB923C]" /> {duration}:00 mins
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5 text-xs font-bold text-white">
                      Cutoff: {passingScore}%
                    </span>
                  </div>
                </div>

                {/* Proctoring Bar */}
                {proctoring && (
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-[11px]">
                    <div className="flex flex-wrap items-center gap-4 text-emerald-800 font-semibold">
                      <span className="flex items-center gap-1.5">
                        <Camera className="h-3.5 w-3.5" /> Webcam AI Active
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Mic className="h-3.5 w-3.5" /> Audio Guard Enabled
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Lock className="h-3.5 w-3.5" /> Browser Tab-Switch Lock
                      </span>
                    </div>
                    <span className="font-bold text-emerald-700">
                      Integrity Protection On
                    </span>
                  </div>
                )}

                {/* Questions Preview List */}
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {questionItems.map((qItem, idx) => (
                    <div
                      key={qItem.id}
                      className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#002C66]">
                          Question {idx + 1} of {questionItems.length} ·{" "}
                          {qItem.skillTag || type}
                        </span>
                        <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                          {qItem.points || 10} Points
                        </span>
                      </div>
                      <p className="text-sm font-bold text-foreground">{qItem.q}</p>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {qItem.options.map((opt, oIdx) => {
                          const isCorrect = qItem.answer === oIdx;
                          return (
                            <div
                              key={oIdx}
                              className={cn(
                                "flex items-center gap-2.5 rounded-xl border p-2.5 text-xs",
                                isCorrect
                                  ? "border-emerald-500/50 bg-emerald-500/10 font-semibold text-emerald-950"
                                  : "border-border bg-background text-foreground"
                              )}
                            >
                              <span
                                className={cn(
                                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                                  isCorrect
                                    ? "bg-emerald-600 text-white"
                                    : "bg-muted text-muted-foreground"
                                )}
                              >
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              <span className="flex-1">{opt}</span>
                              {isCorrect && (
                                <span className="text-[10px] font-bold text-emerald-700">
                                  ✓ Key
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setBuilderTab("edit")}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card hover:bg-muted px-4 py-2.5 text-xs font-bold text-foreground cursor-pointer"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Back to Edit Questions
                  </button>
                  <button
                    type="button"
                    onClick={(e) =>
                      handleSaveBuilder(e as unknown as FormEvent)
                    }
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#FB923C] hover:bg-[#F97316] px-5 py-2.5 text-xs font-bold text-white shadow-sm cursor-pointer"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {editingId !== null ? "Save Assessment Changes" : "Create Assessment"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ================= STANDALONE INTERACTIVE ASSESSMENT PREVIEW MODAL ================= */}
      <Dialog
        open={Boolean(previewRecord)}
        onOpenChange={() => setPreviewRecord(null)}
      >
        <DialogContent className="sm:max-w-4xl max-h-[92vh] overflow-y-auto p-0 gap-0 rounded-2xl overflow-hidden border-border">
          {previewRecord &&
            (() => {
              const pQuestions = getQuestionsForRecord(previewRecord);
              const activeQ =
                pQuestions[previewQuestionIdx] || pQuestions[0];

              return (
                <div>
                  {/* Top Navy Assessment Simulator Bar */}
                  <div className="bg-[#002C66] text-white p-5 sm:p-6">
                    <DialogHeader>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-md bg-[#FB923C] px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-white">
                              Interactive Assessment Preview
                            </span>
                            <span className="rounded-md bg-white/15 px-2.5 py-0.5 text-[10px] font-semibold text-white">
                              {previewRecord.type || "Technical"} ·{" "}
                              {previewRecord.difficulty || "Intermediate"}
                            </span>
                            {(previewRecord.proctoring ?? true) && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-200">
                                <ShieldCheck className="h-3 w-3" /> AI Proctored
                              </span>
                            )}
                          </div>
                          <DialogTitle className="text-xl font-bold text-white mt-1">
                            {previewRecord.name}
                          </DialogTitle>
                          <DialogDescription className="text-xs text-white/80">
                            {previewRecord.description ||
                              "Interactive preview of the candidate testing terminal and employer answer key."}
                          </DialogDescription>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <div className="flex items-center gap-1 rounded-xl bg-white/10 p-1">
                            <button
                              type="button"
                              onClick={() => setPreviewMode("candidate")}
                              className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                                previewMode === "candidate"
                                  ? "bg-white text-[#002C66]"
                                  : "text-white/85 hover:text-white"
                              )}
                            >
                              Candidate Test View
                            </button>
                            <button
                              type="button"
                              onClick={() => setPreviewMode("answer-key")}
                              className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                                previewMode === "answer-key"
                                  ? "bg-[#FB923C] text-white"
                                  : "text-white/85 hover:text-white"
                              )}
                            >
                              Employer Answer Key
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              const recToEdit = previewRecord;
                              setPreviewRecord(null);
                              openEditModal(recToEdit);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#FB923C] hover:bg-[#F97316] px-3.5 py-2 text-xs font-bold text-white cursor-pointer"
                          >
                            <Pencil className="h-3.5 w-3.5" /> Edit Assessment
                          </button>
                        </div>
                      </div>
                    </DialogHeader>

                    {/* Telemetry Sub-bar inside Navy Header */}
                    <div className="mt-4 pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs text-white/90">
                      <div className="flex flex-wrap items-center gap-4">
                        <span className="flex items-center gap-1.5">
                          <Camera className="h-3.5 w-3.5 text-emerald-300" /> Camera Verified
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Mic className="h-3.5 w-3.5 text-emerald-300" /> Audio Guard Active
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Lock className="h-3.5 w-3.5 text-emerald-300" /> Fullscreen Lock
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-lg bg-white/15 px-2.5 py-1 font-mono font-bold text-white flex items-center gap-1.5">
                          <Timer className="h-3.5 w-3.5 text-[#FB923C]" />
                          {previewRecord.duration ?? 30}:00 Mins
                        </span>
                        <span className="rounded-lg bg-white/15 px-2.5 py-1 font-bold text-white">
                          Pass Cutoff: {previewRecord.passingScore ?? 70}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Modal Body */}
                  <div className="p-5 sm:p-6 space-y-5 text-xs">
                    {previewMode === "candidate" ? (
                      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[220px_1fr]">
                        {/* Left Sidebar: Question Palette */}
                        <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-4">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                              Question Navigator
                            </span>
                            <div className="grid grid-cols-4 gap-2 mt-2.5">
                              {pQuestions.map((q, idx) => {
                                const answered =
                                  previewAnswers[idx] !== undefined;
                                const isCurrent = previewQuestionIdx === idx;
                                return (
                                  <button
                                    key={q.id}
                                    type="button"
                                    onClick={() => setPreviewQuestionIdx(idx)}
                                    className={cn(
                                      "h-9 rounded-xl text-xs font-bold transition-all cursor-pointer",
                                      isCurrent
                                        ? "bg-[#002C66] text-white shadow-xs"
                                        : answered
                                        ? "bg-emerald-500/15 text-emerald-700 border border-emerald-500/30"
                                        : "bg-card border border-border text-muted-foreground hover:text-foreground"
                                    )}
                                  >
                                    Q{idx + 1}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="border-t border-border pt-3 space-y-2 text-[11px]">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Answered</span>
                              <span className="font-bold text-foreground">
                                {Object.keys(previewAnswers).length} / {pQuestions.length}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Pass Cutoff</span>
                              <span className="font-bold text-emerald-700">
                                {previewRecord.passingScore ?? 70}%
                              </span>
                            </div>
                          </div>

                          {previewRecord.skills && previewRecord.skills.length > 0 && (
                            <div className="border-t border-border pt-3">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                                Skills Covered
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {previewRecord.skills.map((s) => (
                                  <span
                                    key={s}
                                    className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary"
                                  >
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Right Column: Active Question Terminal */}
                        <div className="space-y-4">
                          {activeQ && (
                            <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-2xs">
                              <div className="flex items-center justify-between">
                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#002C66]/10 px-2.5 py-1 text-xs font-bold text-[#002C66]">
                                  Question {previewQuestionIdx + 1} of {pQuestions.length} ·{" "}
                                  {activeQ.skillTag || previewRecord.type || "Technical"}
                                </span>
                                <span className="rounded-lg bg-muted px-2.5 py-1 text-[11px] font-bold text-foreground">
                                  {activeQ.points || 10} Points
                                </span>
                              </div>

                              <h4 className="font-display text-base font-bold text-foreground leading-snug">
                                {activeQ.q}
                              </h4>

                              <div className="space-y-2.5">
                                {activeQ.options.map((opt, oIdx) => {
                                  const chosen =
                                    previewAnswers[previewQuestionIdx] === oIdx;
                                  return (
                                    <button
                                      key={oIdx}
                                      type="button"
                                      onClick={() =>
                                        setPreviewAnswers((prev) => ({
                                          ...prev,
                                          [previewQuestionIdx]: oIdx,
                                        }))
                                      }
                                      className={cn(
                                        "flex w-full items-center gap-3 rounded-xl border p-3.5 text-left text-xs transition-all cursor-pointer",
                                        chosen
                                          ? "border-[#002C66] bg-[#002C66]/5 font-bold text-foreground ring-1 ring-[#002C66]"
                                          : "border-border bg-background hover:border-[#002C66]/40 text-foreground"
                                      )}
                                    >
                                      <span
                                        className={cn(
                                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                                          chosen
                                            ? "bg-[#002C66] text-white"
                                            : "bg-muted text-muted-foreground"
                                        )}
                                      >
                                        {String.fromCharCode(65 + oIdx)}
                                      </span>
                                      <span className="flex-1">{opt}</span>
                                      {chosen && (
                                        <CheckCircle2 className="h-4 w-4 text-[#002C66] shrink-0" />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>

                              <div className="flex items-center justify-between pt-3 border-t border-border">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={previewQuestionIdx === 0}
                                  onClick={() =>
                                    setPreviewQuestionIdx((i) => Math.max(0, i - 1))
                                  }
                                  className="rounded-xl cursor-pointer"
                                >
                                  Previous Question
                                </Button>

                                {previewQuestionIdx < pQuestions.length - 1 ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setPreviewQuestionIdx((i) =>
                                        Math.min(pQuestions.length - 1, i + 1)
                                      )
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#002C66] hover:bg-[#001F4D] px-4 py-2 text-xs font-bold text-white cursor-pointer"
                                  >
                                    Next Question <ChevronRight className="h-3.5 w-3.5" />
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      let correct = 0;
                                      pQuestions.forEach((q, idx) => {
                                        if (previewAnswers[idx] === q.answer)
                                          correct++;
                                      });
                                      const pct = Math.round(
                                        (correct / pQuestions.length) * 100
                                      );
                                      setPreviewSubmittedScore(pct);
                                    }}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#FB923C] hover:bg-[#F97316] px-4 py-2 text-xs font-bold text-white cursor-pointer"
                                  >
                                    <Play className="h-3.5 w-3.5" /> Test Score Calculation
                                  </button>
                                )}
                              </div>
                            </div>
                          )}

                          {previewSubmittedScore !== null && (
                            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 flex flex-wrap items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <Award className="h-7 w-7 text-emerald-600" />
                                <div>
                                  <div className="text-sm font-bold text-foreground">
                                    Preview Test Simulation Score: {previewSubmittedScore}%
                                  </div>
                                  <p className="text-[11px] text-muted-foreground">
                                    Pass Cutoff is {previewRecord.passingScore ?? 70}% ·{" "}
                                    {previewSubmittedScore >=
                                    (previewRecord.passingScore ?? 70)
                                      ? "Candidate would PASS and generate a verified CIR report."
                                      : "Below cutoff threshold."}
                                  </p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setPreviewMode("answer-key")}
                                className="rounded-xl text-xs cursor-pointer"
                              >
                                Inspect Full Answer Key
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Employer Answer Key View */
                      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                        {pQuestions.map((qItem, idx) => (
                          <div
                            key={qItem.id}
                            className="rounded-xl border border-border bg-card p-4 space-y-2.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[#002C66]">
                                Q{idx + 1}: {qItem.skillTag || "Core Competency"}
                              </span>
                              <span className="text-[11px] font-semibold text-muted-foreground">
                                {qItem.points || 10} pts
                              </span>
                            </div>
                            <p className="text-sm font-bold text-foreground">{qItem.q}</p>
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                              {qItem.options.map((opt, oIdx) => {
                                const isAnswer = qItem.answer === oIdx;
                                return (
                                  <div
                                    key={oIdx}
                                    className={cn(
                                      "flex items-center gap-2 rounded-xl border p-2.5 text-xs",
                                      isAnswer
                                        ? "border-emerald-500/60 bg-emerald-500/10 font-bold text-emerald-900"
                                        : "border-border bg-muted/20 text-muted-foreground"
                                    )}
                                  >
                                    <span
                                      className={cn(
                                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                                        isAnswer
                                          ? "bg-emerald-600 text-white"
                                          : "bg-muted text-muted-foreground"
                                      )}
                                    >
                                      {String.fromCharCode(65 + oIdx)}
                                    </span>
                                    <span className="flex-1">{opt}</span>
                                    {isAnswer && (
                                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border">
                      <span className="text-[11px] text-muted-foreground">
                        Assigned Candidate:{" "}
                        <strong className="text-foreground">
                          {previewRecord.candidate || "Template (Reusable)"}
                        </strong>
                      </span>
                      <Button
                        variant="outline"
                        onClick={() => setPreviewRecord(null)}
                        className="rounded-xl text-xs cursor-pointer"
                      >
                        Close Preview
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })()}
        </DialogContent>
      </Dialog>

      {/* ================= CANDIDATE RESULTS & CIR SCORECARD MODAL ================= */}
      <Dialog open={Boolean(record)} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-xl p-0 gap-0 rounded-2xl overflow-hidden border-border">
          {record && (
            <div>
              <div className="bg-[#002C66] text-white p-5">
                <DialogHeader>
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-bold uppercase text-[#FB923C]">
                    Candidate Assessment Report
                  </span>
                  <DialogTitle className="text-lg font-bold text-white mt-1">
                    {record.name}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-white/80">
                    {record.type || "Technical"} ·{" "}
                    {record.difficulty || "Intermediate"} Level · Pass Cutoff:{" "}
                    {record.passingScore ?? 70}%
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div className="p-5 space-y-4 text-xs">
                <div className="flex items-center justify-between rounded-2xl border border-border bg-muted/20 p-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">
                      Candidate
                    </span>
                    <div className="text-sm font-bold text-foreground">
                      {record.candidate || "Unassigned Assessment Template"}
                    </div>
                    <span className="text-[11px] text-muted-foreground block">
                      Status: <strong>{normalizeStatus(record.status)}</strong> ·{" "}
                      {record.questions || 15} Questions · {record.duration || 30} mins
                    </span>
                  </div>
                  {record.score !== undefined && (
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-lg font-extrabold text-emerald-600 block">
                          {record.score}%
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-700">
                          Verified Score
                        </span>
                      </div>
                      <MatchRing percent={record.score} size={52} />
                    </div>
                  )}
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  {record.description ||
                    "Role-aligned assessment with AI Cheating Prevention and sub-skill evaluation."}
                </p>

                <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => {
                      const rec = record;
                      setSelected(null);
                      openPreviewModal(rec);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card hover:bg-muted px-3.5 py-2 text-xs font-bold text-foreground cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5 text-[#002C66]" /> Preview Questions
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const rec = record;
                      setSelected(null);
                      openEditModal(rec);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#002C66] hover:bg-[#001F4D] px-4 py-2 text-xs font-bold text-white cursor-pointer"
                  >
                    <Pencil className="h-3.5 w-3.5 text-[#FB923C]" /> Edit Assessment
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}