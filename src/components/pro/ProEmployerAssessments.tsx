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
  Settings2,
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type {
  EmployerDemoState,
  EmployerAssessmentRecord,
  EmployerAssessmentQuestion,
} from "@/data/employerDemo";
import type { ProApplication } from "@/data/proData";
import "./employer-workspace.css";

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

function getQuestionsForRecord(rec: Partial<EmployerAssessmentRecord>): EmployerAssessmentQuestion[] {
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

  const status = (value: string) => (value === "Invited" ? "Active" : value);
  const records = state.assessments;
  const filtered = records.filter(
    (r) =>
      (filter === "All" || status(r.status) === filter) &&
      `${r.name} ${r.candidate} ${r.type || ""}`.toLowerCase().includes(query.toLowerCase())
  );
  const record = records.find((r) => r.id === selected);

  const openCreateModal = () => {
    setEditingId(null);
    setBuilderTab("edit");
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
    setDescription(rec.description || "");
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
    onToast(`Duplicated assessment "${rec.name}" as a new editable draft.`);
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
      // Update existing assessment
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
      // Create new assessment
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
          ? `Assessment "${newRec.name}" created and invitation assigned to ${candidate}.`
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
        q: `Question ${nextIdx}: Describe or select the optimal engineering solution for this scenario.`,
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

  return (
    <div className="employer-workspace space-y-5">
      <Button variant="ghost" className="px-0 text-primary" onClick={onBack}>
        <ArrowLeft />
        Back to Dashboard
      </Button>

      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="workspace-heading">Employer Assessments Studio</h1>
          <p className="workspace-description">
            Create custom assessments, preview the live candidate test experience, edit existing assessments &amp; questions, and track candidate scores.
          </p>
        </div>
        <Button onClick={openCreateModal} className="gap-1.5 cursor-pointer">
          <Plus className="h-4 w-4" /> Create New Assessment
        </Button>
      </header>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Assessments",
            value: records.length,
            icon: ClipboardList,
            filter: "All",
          },
          {
            label: "Completed",
            value: records.filter((r) => r.status === "Completed").length,
            icon: CheckCircle2,
            filter: "Completed",
          },
          {
            label: "Active / Invited",
            value: records.filter((r) =>
              ["Invited", "Pending", "Active"].includes(r.status)
            ).length,
            icon: Clock,
            filter: "Active",
          },
          {
            label: "Invited Candidates",
            value: new Set(
              records.filter((r) => r.candidate).map((r) => r.candidate)
            ).size,
            icon: Users,
            filter: "All",
          },
        ].map(({ label, value, icon: Icon, filter: next }) => (
          <Button
            key={label}
            variant="ghost"
            className="workspace-stat"
            onClick={() => setFilter(next)}
          >
            <div className="workspace-icon !h-12 !w-12 !rounded-full">
              <Icon size={24} />
            </div>
            <div>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          </Button>
        ))}
      </div>

      {/* Create Banner */}
      <section className="workspace-panel flex flex-wrap items-center gap-6">
        <div className="workspace-icon !h-20 !w-20">
          <ClipboardList size={45} />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold">
            Create, Preview &amp; Edit Custom Assessments
          </h2>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Build role-specific technical, coding, aptitude, or HR assessments. Preview the exact candidate test interface and edit any existing assessment or question bank at any time.
          </p>
          <div className="mt-3.5 flex flex-wrap gap-2.5">
            {[
              { icon: Eye, text: "Interactive Candidate Preview" },
              { icon: Pencil, text: "Edit Existing Assessments & Questions" },
              { icon: ShieldCheck, text: "AI Cheating Prevention" },
              { icon: Sparkles, text: "Instant CIR Scorecard" },
            ].map(({ icon: Icon, text }) => (
              <span key={text} className="workspace-chip">
                <Icon size={12} />
                {text}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          {records[0] && (
            <Button
              variant="outline"
              onClick={() => openPreviewModal(records[0])}
              className="gap-1.5 cursor-pointer"
            >
              <Eye className="h-4 w-4" /> Preview Sample Assessment
            </Button>
          )}
          <Button onClick={openCreateModal} className="gap-1.5 cursor-pointer">
            <Plus className="h-4 w-4" /> Create Assessment
          </Button>
        </div>
      </section>

      {/* Assessments Table */}
      <section className="workspace-panel">
        <div className="mb-5 flex flex-wrap justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {["All", "Active", "Draft", "Completed"].map((f) => (
              <Button
                size="sm"
                key={f}
                variant={filter === f ? "default" : "outline"}
                onClick={() => setFilter(f)}
              >
                {f} (
                {
                  records.filter((r) => f === "All" || status(r.status) === f)
                    .length
                }
                )
              </Button>
            ))}
          </div>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-3 text-primary" />
            <Input
              aria-label="Search assessments"
              className="pl-9"
              placeholder="Search assessments or candidates..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-left text-xs">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                {[
                  "Assessment Name & Skills",
                  "Type & Level",
                  "Questions",
                  "Duration & Cutoff",
                  "Status / Score",
                  "Created On",
                  "Actions (Preview / Edit / Manage)",
                ].map((h) => (
                  <th className="p-3 font-medium" key={h}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const qList = getQuestionsForRecord(r);
                return (
                  <tr
                    className="border-b border-border hover:bg-muted/20 transition-colors"
                    key={r.id}
                  >
                    <td className="p-3">
                      <div className="flex items-start gap-3">
                        <span className="workspace-icon !h-9 !w-9 !rounded-full shrink-0 mt-0.5">
                          <Code2 size={16} />
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
                          <p className="mt-0.5 text-[11px] text-muted-foreground">
                            Candidate:{" "}
                            <strong className="text-foreground">
                              {r.candidate || "Template / No candidate assigned"}
                            </strong>
                          </p>
                          {r.skills && r.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
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
                    <td className="p-3">
                      <div className="font-semibold text-foreground">
                        {r.type || "Technical"}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {r.difficulty || "Intermediate"} Level
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-foreground">
                        {r.questions ?? qList.length} Qs
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {qList.length} interactive sample Qs
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-foreground">
                        {r.duration ? `${r.duration} mins` : "30 mins"}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        Pass Cutoff: {r.passingScore ?? 65}%
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="workspace-chip">{status(r.status)}</span>
                      {r.score !== undefined && (
                        <div className="mt-1 text-xs font-extrabold text-emerald-600">
                          Score: {r.score}%
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {r.at
                        ? new Date(r.at).toLocaleDateString("en-GB")
                        : "Oct 2026"}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openPreviewModal(r)}
                          className="h-8 gap-1 px-2.5 text-xs font-semibold border-primary/40 text-primary hover:bg-primary/10 cursor-pointer"
                          title="Preview how this assessment looks to candidates"
                        >
                          <Eye className="h-3.5 w-3.5" /> Preview
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditModal(r)}
                          className="h-8 gap-1 px-2.5 text-xs font-semibold cursor-pointer"
                          title="Edit assessment settings and questions"
                        >
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelected(r.id)}
                          className="h-8 px-2.5 text-xs font-semibold cursor-pointer"
                        >
                          Results
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDuplicate(r)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-primary cursor-pointer"
                          title="Duplicate assessment"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(r)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive cursor-pointer"
                          title="Delete assessment"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!filtered.length && (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No assessments match your selection.
          </p>
        )}
      </section>

      {/* ================= CREATE / EDIT ASSESSMENT BUILDER MODAL (WITH LIVE PREVIEW TAB) ================= */}
      <Dialog open={builderOpen} onOpenChange={setBuilderOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <DialogTitle className="text-lg font-bold">
                {editingId !== null
                  ? `Edit Assessment — ${name || "Untitled"}`
                  : "Create New Employer Assessment"}
              </DialogTitle>
              <div className="flex items-center gap-1.5 rounded-xl bg-muted p-1">
                <button
                  type="button"
                  onClick={() => setBuilderTab("edit")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5",
                    builderTab === "edit"
                      ? "bg-[#002C66] text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Pencil className="h-3.5 w-3.5" /> 1. Configure &amp; Edit Questions
                </button>
                <button
                  type="button"
                  onClick={() => setBuilderTab("preview")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5",
                    builderTab === "preview"
                      ? "bg-[#FB923C] text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Eye className="h-3.5 w-3.5" /> 2. Preview Assessment ({questionItems.length} Qs)
                </button>
              </div>
            </div>
            <DialogDescription className="text-xs">
              {builderTab === "edit"
                ? "Configure assessment settings, proctoring rules, candidate assignment, and customize questions below."
                : "Live preview of how candidates will experience this assessment before you save."}
            </DialogDescription>
          </DialogHeader>

          {builderTab === "edit" ? (
            <form onSubmit={handleSaveBuilder} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <label className="grid gap-1.5 font-semibold text-foreground">
                  Assessment Name *
                  <Input
                    aria-label="Assessment name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Senior React & TypeScript Architecture Test"
                  />
                </label>

                <label className="grid gap-1.5 font-semibold text-foreground">
                  Assessment Type
                  <select
                    aria-label="Assessment type"
                    className="h-10 rounded-md border border-border bg-background px-3 text-xs"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    {["Technical", "Coding & System Design", "Aptitude", "HR Round"].map(
                      (t) => (
                        <option key={t}>{t}</option>
                      )
                    )}
                  </select>
                </label>

                <label className="grid gap-1.5 font-semibold text-foreground">
                  Difficulty Level
                  <select
                    aria-label="Difficulty level"
                    className="h-10 rounded-md border border-border bg-background px-3 text-xs"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    {["Core", "Intermediate", "Advanced"].map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-1.5 font-semibold text-foreground">
                  Invite Candidate (or leave blank for Template/Draft)
                  <select
                    aria-label="Assessment candidate"
                    className="h-10 rounded-md border border-border bg-background px-3 text-xs"
                    value={candidate}
                    onChange={(e) => setCandidate(e.target.value)}
                  >
                    <option value="">Save as reusable template / draft</option>
                    {[...new Set(applications.map((a) => a.name))].map((n) => (
                      <option key={n}>{n}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-3 gap-3.5">
                <label className="grid gap-1.5 font-semibold text-foreground">
                  Total Questions
                  <Input
                    aria-label="Question count"
                    required
                    type="number"
                    min={1}
                    value={questions}
                    onChange={(e) => setQuestions(Number(e.target.value))}
                  />
                </label>
                <label className="grid gap-1.5 font-semibold text-foreground">
                  Duration (mins)
                  <Input
                    aria-label="Duration"
                    required
                    type="number"
                    min={5}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                  />
                </label>
                <label className="grid gap-1.5 font-semibold text-foreground">
                  Pass Cutoff (%)
                  <Input
                    aria-label="Passing score"
                    required
                    type="number"
                    min={30}
                    max={100}
                    value={passingScore}
                    onChange={(e) => setPassingScore(Number(e.target.value))}
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-center">
                <label className="grid gap-1.5 font-semibold text-foreground">
                  Skills Tested (comma-separated)
                  <Input
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    placeholder="React, TypeScript, State Management"
                  />
                </label>

                <label className="flex items-center gap-2.5 rounded-xl border border-border bg-muted/20 p-3 mt-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={proctoring}
                    onChange={(e) => setProctoring(e.target.checked)}
                    className="h-4 w-4 accent-[#002C66]"
                  />
                  <div>
                    <span className="font-bold text-foreground block">
                      Enable AI Cheating Prevention Proctoring
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Webcam, Mic, Browser Lock &amp; Tab-Switch Guard
                    </span>
                  </div>
                </label>
              </div>

              <label className="grid gap-1.5 font-semibold text-foreground">
                Assessment Brief &amp; Instructions for Candidates
                <Textarea
                  aria-label="Assessment brief"
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the topics covered and instructions for candidates..."
                />
              </label>

              {/* Editable Question Bank Section */}
              <div className="space-y-3 rounded-xl border border-border bg-muted/15 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2.5">
                  <div>
                    <h4 className="font-bold text-sm text-foreground">
                      Assessment Questions ({questionItems.length} Configured)
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      Edit existing questions, modify answer choices, mark the correct option, or add new questions.
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={addQuestionItem}
                    className="h-8 gap-1 text-xs font-bold border-primary/40 text-primary cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Question
                  </Button>
                </div>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {questionItems.map((qItem, qIdx) => (
                    <div
                      key={qItem.id}
                      className="rounded-xl border border-border bg-card p-3.5 space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-xs text-primary">
                          Question #{qIdx + 1} ({qItem.points} pts)
                        </span>
                        <div className="flex items-center gap-2">
                          <Input
                            value={qItem.skillTag}
                            onChange={(e) =>
                              updateQuestionItem(qIdx, { skillTag: e.target.value })
                            }
                            placeholder="Skill tag"
                            className="h-7 w-36 text-[11px]"
                          />
                          <button
                            type="button"
                            onClick={() => removeQuestionItem(qIdx)}
                            className="text-muted-foreground hover:text-destructive p-1 cursor-pointer"
                            title="Remove question"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <Input
                        value={qItem.q}
                        onChange={(e) => updateQuestionItem(qIdx, { q: e.target.value })}
                        placeholder="Enter question prompt..."
                        className="text-xs font-medium"
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {qItem.options.map((opt, optIdx) => {
                          const isCorrect = qItem.answer === optIdx;
                          return (
                            <div
                              key={optIdx}
                              className={cn(
                                "flex items-center gap-2 rounded-lg border px-2.5 py-1.5",
                                isCorrect
                                  ? "border-emerald-500/50 bg-emerald-500/10"
                                  : "border-border bg-background"
                              )}
                            >
                              <input
                                type="radio"
                                name={`correct-${qItem.id}`}
                                checked={isCorrect}
                                onChange={() =>
                                  updateQuestionItem(qIdx, { answer: optIdx })
                                }
                                title="Mark as correct option"
                                className="accent-emerald-600 cursor-pointer"
                              />
                              <Input
                                value={opt}
                                onChange={(e) =>
                                  updateQuestionOption(qIdx, optIdx, e.target.value)
                                }
                                className="h-7 border-0 bg-transparent px-1 text-xs shadow-none focus-visible:ring-0"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <DialogFooter className="flex flex-wrap items-center justify-between sm:justify-between gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setBuilderTab("preview")}
                  className="gap-1.5 cursor-pointer"
                >
                  <Eye className="h-4 w-4 text-primary" /> Preview Assessment Before Saving
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setBuilderOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="gap-1.5 cursor-pointer">
                    <CheckCircle2 className="h-4 w-4" />
                    {editingId !== null ? "Save Changes" : "Create Assessment"}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          ) : (
            /* LIVE PREVIEW TAB INSIDE CREATE / EDIT MODAL */
            <div className="space-y-4 py-2 text-xs">
              <div className="rounded-2xl bg-[#002C66] text-white p-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#FB923C]">
                    Candidate Assessment Live Preview
                  </div>
                  <h3 className="text-base font-extrabold mt-0.5">
                    {name || "Untitled Employer Assessment"}
                  </h3>
                  <p className="text-xs text-white/80 mt-1">
                    {description || "Role-aligned technical screening assessment."}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-lg bg-white/15 px-3 py-1.5 font-bold">
                    {duration} mins
                  </span>
                  <span className="rounded-lg bg-white/15 px-3 py-1.5 font-bold">
                    Pass Cutoff: {passingScore}%
                  </span>
                  {proctoring && (
                    <span className="rounded-lg bg-emerald-500/20 border border-emerald-400/40 px-3 py-1.5 font-bold text-emerald-200">
                      AI Proctored
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {questionItems.map((qItem, idx) => (
                  <div
                    key={qItem.id}
                    className="rounded-xl border border-border bg-card p-4 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary">
                        Question {idx + 1} of {questionItems.length}
                      </span>
                      <Badge variant="outline" className="text-[10px]">
                        {qItem.skillTag} · {qItem.points} pts
                      </Badge>
                    </div>
                    <p className="font-bold text-sm text-foreground">{qItem.q}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {qItem.options.map((opt, oIdx) => {
                        const isAns = qItem.answer === oIdx;
                        return (
                          <div
                            key={oIdx}
                            className={cn(
                              "flex items-center justify-between rounded-lg border p-2.5 text-xs",
                              isAns
                                ? "border-emerald-500/50 bg-emerald-500/10 font-bold text-emerald-800 dark:text-emerald-300"
                                : "border-border bg-background text-muted-foreground"
                            )}
                          >
                            <span>
                              {String.fromCharCode(65 + oIdx)}. {opt}
                            </span>
                            {isAns && (
                              <span className="text-[10px] font-bold text-emerald-600">
                                ✓ Correct
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <DialogFooter className="flex items-center justify-between sm:justify-between pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setBuilderTab("edit")}
                  className="gap-1.5 cursor-pointer"
                >
                  <Pencil className="h-3.5 w-3.5" /> Back to Edit Questions
                </Button>
                <Button
                  type="button"
                  onClick={handleSaveBuilder as any}
                  className="gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {editingId !== null ? "Save Changes" : "Create Assessment"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ================= STANDALONE INTERACTIVE ASSESSMENT PREVIEW MODAL ================= */}
      <Dialog
        open={Boolean(previewRecord)}
        onOpenChange={(open) => !open && setPreviewRecord(null)}
      >
        <DialogContent className="sm:max-w-2xl max-h-[92vh] overflow-y-auto">
          {previewRecord && (() => {
            const pQuestions = getQuestionsForRecord(previewRecord);
            const activeQ = pQuestions[previewQuestionIdx] || pQuestions[0];
            return (
              <>
                <DialogHeader>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-primary/10 text-primary border-primary/30 text-xs"
                      >
                        {previewRecord.type || "Technical"} ·{" "}
                        {previewRecord.difficulty || "Intermediate"}
                      </Badge>
                      {(previewRecord.proctoring ?? true) && (
                        <Badge
                          variant="outline"
                          className="bg-emerald-500/10 text-emerald-700 border-emerald-500/30 text-xs"
                        >
                          AI Cheating Prevention Active
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-1 rounded-xl bg-muted p-1">
                      <button
                        type="button"
                        onClick={() => setPreviewMode("candidate")}
                        className={cn(
                          "px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer",
                          previewMode === "candidate"
                            ? "bg-[#002C66] text-white"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        Candidate Test View
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewMode("answer-key")}
                        className={cn(
                          "px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer",
                          previewMode === "answer-key"
                            ? "bg-[#FB923C] text-white"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        Employer Answer Key ({pQuestions.length})
                      </button>
                    </div>
                  </div>

                  <DialogTitle className="text-lg font-bold mt-1">
                    {previewRecord.name} — Assessment Preview
                  </DialogTitle>
                  <DialogDescription className="text-xs">
                    {previewRecord.description ||
                      "Role-specific candidate evaluation."}
                  </DialogDescription>
                </DialogHeader>

                {previewMode === "candidate" ? (
                  <div className="space-y-4 py-2 text-xs">
                    {/* Proctoring Telemetry Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-muted/30 px-3.5 py-2.5">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                          <Camera className="h-3.5 w-3.5" /> Webcam Verified
                        </span>
                        <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                          <Mic className="h-3.5 w-3.5" /> Audio Clear
                        </span>
                        <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                          <Lock className="h-3.5 w-3.5" /> Browser Lock
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 font-bold text-amber-700">
                        <Timer className="h-3.5 w-3.5" />{" "}
                        {previewRecord.duration ?? 30}:00 mins · Cutoff{" "}
                        {previewRecord.passingScore ?? 65}%
                      </span>
                    </div>

                    {previewSubmittedScore !== null ? (
                      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 text-center space-y-2">
                        <Award className="h-8 w-8 text-emerald-600 mx-auto" />
                        <h4 className="text-base font-extrabold text-foreground">
                          Preview Test Completed — Score: {previewSubmittedScore}%
                        </h4>
                        <p className="text-muted-foreground">
                          This is how the candidate&apos;s instant score and CIR breakdown are computed upon submission.
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setPreviewSubmittedScore(null);
                            setPreviewQuestionIdx(0);
                            setPreviewAnswers({});
                          }}
                          className="mt-2 cursor-pointer"
                        >
                          Reset Preview Try-Out
                        </Button>
                      </div>
                    ) : (
                      activeQ && (
                        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="font-bold text-primary">
                              Sample Question {previewQuestionIdx + 1} of{" "}
                              {pQuestions.length}
                            </span>
                            <Badge variant="outline" className="text-[10px]">
                              {activeQ.skillTag} · {activeQ.points} points
                            </Badge>
                          </div>

                          <h4 className="text-sm font-bold text-foreground leading-snug">
                            {activeQ.q}
                          </h4>

                          <div className="space-y-2 pt-1">
                            {activeQ.options.map((opt, oIdx) => {
                              const chosen =
                                previewAnswers[previewQuestionIdx] === oIdx;
                              return (
                                <button
                                  key={oIdx}
                                  type="button"
                                  onClick={() =>
                                    setPreviewAnswers((p) => ({
                                      ...p,
                                      [previewQuestionIdx]: oIdx,
                                    }))
                                  }
                                  className={cn(
                                    "w-full flex items-center gap-3 rounded-xl border p-3 text-left text-xs font-medium transition-all cursor-pointer",
                                    chosen
                                      ? "border-primary bg-primary/10 text-primary font-bold"
                                      : "border-border bg-background hover:bg-muted/40 text-foreground"
                                  )}
                                >
                                  <span
                                    className={cn(
                                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold",
                                      chosen
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

                          <div className="flex items-center justify-between pt-3 border-t border-border">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={previewQuestionIdx === 0}
                              onClick={() =>
                                setPreviewQuestionIdx((i) => Math.max(0, i - 1))
                              }
                            >
                              Previous
                            </Button>
                            {previewQuestionIdx < pQuestions.length - 1 ? (
                              <Button
                                size="sm"
                                onClick={() =>
                                  setPreviewQuestionIdx((i) => i + 1)
                                }
                                className="cursor-pointer"
                              >
                                Next Question
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => {
                                  let correct = 0;
                                  pQuestions.forEach((q, idx) => {
                                    if (previewAnswers[idx] === q.answer)
                                      correct++;
                                  });
                                  setPreviewSubmittedScore(
                                    Math.round(
                                      (correct / pQuestions.length) * 100
                                    )
                                  );
                                }}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                              >
                                Submit Preview Test
                              </Button>
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  /* EMPLOYER ANSWER KEY & RUBRIC VIEW */
                  <div className="space-y-3 py-2 max-h-80 overflow-y-auto pr-1 text-xs">
                    {pQuestions.map((qItem, idx) => (
                      <div
                        key={qItem.id}
                        className="rounded-xl border border-border bg-card p-3.5 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-primary">
                            Q{idx + 1}. {qItem.skillTag}
                          </span>
                          <span className="text-muted-foreground font-semibold">
                            {qItem.points} points
                          </span>
                        </div>
                        <p className="font-bold text-foreground">{qItem.q}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {qItem.options.map((opt, oIdx) => {
                            const isAns = qItem.answer === oIdx;
                            return (
                              <div
                                key={oIdx}
                                className={cn(
                                  "rounded-lg border px-2.5 py-1.5 flex items-center justify-between",
                                  isAns
                                    ? "border-emerald-500/50 bg-emerald-500/10 font-bold text-emerald-700"
                                    : "border-border bg-background text-muted-foreground"
                                )}
                              >
                                <span>
                                  {String.fromCharCode(65 + oIdx)}. {opt}
                                </span>
                                {isAns && <Check className="h-3.5 w-3.5" />}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <DialogFooter className="flex flex-wrap items-center justify-between sm:justify-between gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const rec = previewRecord;
                      setPreviewRecord(null);
                      openEditModal(rec);
                    }}
                    className="gap-1.5 cursor-pointer"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit This Assessment &amp; Questions
                  </Button>
                  <Button
                    onClick={() => setPreviewRecord(null)}
                    className="cursor-pointer"
                  >
                    Close Preview
                  </Button>
                </DialogFooter>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* ================= CANDIDATE RESULTS & INVITATION MODAL ================= */}
      <Dialog
        open={!!record}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{record?.name}</DialogTitle>
          </DialogHeader>
          {record && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="workspace-chip">{status(record.status)}</span>
                <span className="text-xs text-muted-foreground">
                  {record.type || "Technical"} · {record.difficulty || "Intermediate"} ·{" "}
                  Pass Cutoff: {record.passingScore ?? 65}%
                </span>
              </div>
              <p className="text-sm">
                Candidate: <strong>{record.candidate || "Not invited yet"}</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                {record.description || "No assessment brief supplied."}
              </p>
              <p className="text-sm">
                {record.questions ? `${record.questions} questions` : "10 questions"} ·{" "}
                {record.duration ? `${record.duration} minutes` : "30 minutes"}
              </p>

              {record.status === "Draft" && (
                <label className="grid gap-2 text-sm">
                  Invite candidate
                  <select
                    aria-label="Invite draft candidate"
                    className="h-10 rounded-md border border-border bg-background px-3"
                    value=""
                    onChange={(e) => {
                      if (!e.target.value) return;
                      onChange({
                        ...state,
                        assessments: records.map((r) =>
                          r.id === record.id
                            ? { ...r, candidate: e.target.value, status: "Invited" }
                            : r
                        ),
                      });
                      onToast(
                        `Assigned "${record.name}" to ${e.target.value}.`
                      );
                    }}
                  >
                    <option value="">Select candidate</option>
                    {[...new Set(applications.map((a) => a.name))].map((n) => (
                      <option key={n}>{n}</option>
                    ))}
                  </select>
                </label>
              )}

              {record.score !== undefined ? (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-1">
                  <p className="text-base font-extrabold text-emerald-700">
                    Verified Candidate Score: {record.score}% (Passed)
                  </p>
                  <p className="text-xs text-muted-foreground">
                    AI Proctoring Integrity: 99.6% · Zero Tab-Switch Flags
                  </p>
                </div>
              ) : (
                record.candidate && (
                  <Button
                    onClick={() => {
                      onChange({
                        ...state,
                        assessments: records.map((r) =>
                          r.id === record.id
                            ? { ...r, status: "Completed", score: 84 }
                            : r
                        ),
                      });
                      onToast("Simulated candidate completion: 84% verified score.");
                    }}
                  >
                    <CheckCircle2 />
                    Simulate Candidate Completion (84%)
                  </Button>
                )
              )}

              <DialogFooter className="flex flex-wrap justify-between sm:justify-between gap-2 pt-2 border-t border-border">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const rec = record;
                      setSelected(null);
                      openPreviewModal(rec);
                    }}
                    className="gap-1.5 cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" /> Preview Assessment
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const rec = record;
                      setSelected(null);
                      openEditModal(rec);
                    }}
                    className="gap-1.5 cursor-pointer"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit Assessment
                  </Button>
                </div>
                <Button size="sm" onClick={() => setSelected(null)}>
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}