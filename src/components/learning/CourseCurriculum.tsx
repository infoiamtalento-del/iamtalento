import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  CirclePlay,
  Clock,
  Loader2,
  LockKeyhole,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { LearningCourseModule } from "@/data/learningCourses";
import type { Enrollment } from "@/services/candidate/platform";

export const defaultAiTrackModules: LearningCourseModule[] = [
  {
    title: "Introduction to AI Agents",
    duration: "45 mins",
    summary: "Understand the foundations and build your first agent workflow.",
    topics: [
      "What makes an AI agent autonomous",
      "Agents vs. chatbots and traditional automation",
      "The observe, reason and act loop",
      "Real-world agent use cases",
      "Python environment and project setup",
      "Build your first simple agent",
    ],
  },
  {
    title: "LLM Fundamentals for Engineers",
    duration: "1 hr 20 mins",
    summary: "Turn language models into reliable building blocks for applications.",
    topics: [
      "Tokens, context windows and model limits",
      "Prompting patterns and system instructions",
      "Structured outputs with JSON schemas",
      "Choosing the right model for a task",
      "Temperature, sampling and response quality",
      "Handling retries and model failures",
    ],
  },
  {
    title: "Tool Use & Function Calling",
    duration: "1 hr 30 mins",
    summary: "Connect agents to tools, APIs and real-world actions.",
    topics: [
      "Define tools and function schemas",
      "Validate tool inputs and outputs",
      "Connect external APIs to an agent",
      "Parallel calls and execution control",
      "Error recovery and safe tool design",
      "Project: build a tool-enabled assistant",
    ],
  },
  {
    title: "Model Context Protocol (MCP)",
    duration: "1 hr 45 mins",
    summary: "Give your agents a consistent way to access external context.",
    topics: [
      "MCP clients, servers and architecture",
      "Build and connect an MCP server",
      "Expose resources, prompts and tools",
      "Transport options and connection lifecycle",
      "Authentication and access boundaries",
      "Project: connect an agent to an MCP tool",
    ],
  },
  {
    title: "Memory & Retrieval (RAG)",
    duration: "1 hr 15 mins",
    summary: "Build agents that retrieve knowledge and retain useful context.",
    topics: [
      "Embeddings and semantic search",
      "Chunking and document preparation",
      "Vector stores and retrieval pipelines",
      "Short-term and long-term agent memory",
      "Grounded answers and source citations",
      "Project: create a knowledge assistant",
    ],
  },
  {
    title: "Multi-Agent Orchestration",
    duration: "1 hr 40 mins",
    summary: "Coordinate specialist agents with shared state and clear handoffs.",
    topics: [
      "Planner–executor architecture",
      "Design workflows with LangGraph",
      "Agent roles and handoff patterns",
      "Manage shared state and checkpoints",
      "Human-in-the-loop approvals",
      "Project: build a multi-agent workflow",
    ],
  },
  {
    title: "Evaluation & Observability",
    duration: "1 hr 10 mins",
    summary: "Measure quality, investigate failures and improve performance.",
    topics: [
      "Create representative evaluation datasets",
      "Define task success and quality metrics",
      "Trace agent decisions and tool calls",
      "Monitor token cost and response latency",
      "Regression testing for agent workflows",
      "Debug failures and compare improvements",
    ],
  },
  {
    title: "Deploying Agents to Production",
    duration: "1 hr 15 mins",
    summary: "Move from a local prototype to a secure, scalable service.",
    topics: [
      "Serve agents through FastAPI endpoints",
      "Background tasks, queues and timeouts",
      "Input guardrails and output validation",
      "Secrets, permissions and security",
      "Containerisation and deployment basics",
      "Scaling, monitoring and release checks",
    ],
  },
  {
    title: "Capstone: Build Your Own Agent",
    duration: "1 hr 30 mins",
    summary: "Bring everything together in a portfolio-ready agent project.",
    topics: [
      "Define the problem and success criteria",
      "Plan architecture and select tools",
      "Build retrieval and agent workflows",
      "Evaluate reliability and edge cases",
      "Deploy and document your solution",
      "Present your project and design choices",
    ],
  },
  {
    title: "Bonus: Career & Interview Guidance",
    duration: "45 mins",
    summary: "Showcase your work and prepare for AI engineering opportunities.",
    topics: [
      "Create a focused AI engineering portfolio",
      "Write project case studies for GitHub",
      "Prepare for technical AI interviews",
      "Practise agent system-design questions",
      "Present your experience and impact",
      "Explore freelance and career opportunities",
    ],
  },
];

interface TrackedLiveModule {
  id: string;
  title: string;
  kind: string;
  duration_sec?: number | null;
  is_preview?: boolean | null;
}

interface CourseCurriculumProps {
  onPreview: (title: string) => void;
  modules?: LearningCourseModule[];
  enrollment?: Enrollment | null;
  liveModules?: TrackedLiveModule[];
  busyAction?: string | null;
  onCompleteModule?: (moduleId: string) => void;
}

export function CourseCurriculum({
  onPreview,
  modules = defaultAiTrackModules,
  enrollment,
  liveModules = [],
  busyAction,
  onCompleteModule,
}: CourseCurriculumProps) {
  const [openIndices, setOpenIndices] = useState<number[]>([0]);
  const allExpanded = openIndices.length === modules.length;

  return (
    <section id="course-curriculum" aria-labelledby="curriculum-heading">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-7">
        <div>
          <p className="text-xs font-semibold uppercase text-primary mb-3">Your learning roadmap</p>
          <h2 id="curriculum-heading" className="text-3xl md:text-4xl font-bold font-display">
            Course Curriculum
          </h2>
          <p className="text-sm text-muted-foreground mt-3">
            {modules.length} modules <span aria-hidden="true">·</span>{" "}
            {modules.reduce((acc, item) => acc + item.topics.length, 0)} topics{" "}
            <span aria-hidden="true">·</span> Hands-on learning
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-2" onClick={() => onPreview("Course overview")}>
            <CirclePlay className="h-4 w-4" /> Course preview
          </Button>
          <Button
            variant="ghost"
            onClick={() => setOpenIndices(allExpanded ? [] : modules.map((_, idx) => idx))}
          >
            {allExpanded ? "Collapse all" : "Expand all"}
          </Button>
        </div>
      </div>

      {enrollment && liveModules.length > 0 && onCompleteModule && (
        <div className="mb-6 rounded-xl border border-primary/25 bg-primary/5 p-4 sm:p-5 space-y-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Enrolled Progress · {Math.round(Number(enrollment.progress_pct))}% complete
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {liveModules.map((mod, idx) => {
              const isDone = enrollment.completed_module_ids.includes(mod.id);
              const mins = mod.duration_sec ? Math.max(1, Math.round(mod.duration_sec / 60)) : 20;
              return (
                <div
                  key={mod.id}
                  className="flex items-center justify-between gap-3 rounded-lg border bg-card px-3.5 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold">
                      {String(idx + 1).padStart(2, "0")}. {mod.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground capitalize">
                      {mod.kind} · {mins} mins
                    </p>
                  </div>
                  {isDone ? (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                      <CheckCircle2 className="h-3 w-3" /> Done
                    </span>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={busyAction === `mod-${mod.id}`}
                      onClick={() => onCompleteModule(mod.id)}
                      className="h-7 gap-1 px-2.5 text-xs shrink-0"
                    >
                      {busyAction === `mod-${mod.id}` ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Play className="h-3 w-3" />
                      )}
                      Mark Complete
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {modules.map((mod, idx) => {
          const isOpen = openIndices.includes(idx);
          return (
            <article
              key={mod.title}
              className={cn(
                "rounded-lg border bg-card overflow-hidden transition-colors",
                isOpen && "border-primary/40",
              )}
            >
              <div className={cn("flex items-center gap-3 sm:gap-5 p-4 sm:p-6", isOpen && "bg-primary/5")}>
                <span
                  className={cn(
                    "w-11 h-11 sm:w-14 sm:h-14 shrink-0 rounded-lg flex items-center justify-center font-display text-lg font-bold",
                    isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-primary",
                  )}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>

                <Button
                  variant="ghost"
                  aria-expanded={isOpen}
                  aria-controls={`module-${idx}`}
                  onClick={() =>
                    setOpenIndices((prev) =>
                      prev.includes(idx) ? prev.filter((item) => item !== idx) : [...prev, idx],
                    )
                  }
                  className="h-auto min-w-0 flex-1 p-0 hover:bg-transparent text-left whitespace-normal justify-between gap-3"
                >
                  <span className="min-w-0">
                    <span className="block text-base sm:text-lg font-semibold font-display">
                      {mod.title}
                    </span>
                    <span className="block text-xs sm:text-sm font-normal text-muted-foreground mt-1.5 leading-relaxed">
                      {mod.summary}
                    </span>
                    <span className="flex flex-wrap items-center gap-3 text-xs font-normal text-muted-foreground mt-3">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5" />
                        {mod.topics.length} topics
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {mod.duration}
                      </span>
                    </span>
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-primary transition-transform motion-reduce:transition-none",
                      isOpen && "rotate-180",
                    )}
                  />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 text-primary border-primary/20"
                  aria-label={`Preview ${mod.title}`}
                  onClick={() => onPreview(mod.title)}
                >
                  <LockKeyhole className="h-4 w-4" />
                </Button>
              </div>

              {isOpen && (
                <div id={`module-${idx}`} className="p-4 sm:p-6 border-t">
                  <ul className="grid md:grid-cols-2 gap-x-8 gap-y-1" role="list">
                    {mod.topics.map((topic, tIdx) => (
                      <li
                        key={topic}
                        className="flex items-center gap-3 py-3 border-b border-border/60 text-sm"
                      >
                        <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                          {String(tIdx + 1).padStart(2, "0")}
                        </span>
                        <span className="flex-1 leading-relaxed">{topic}</span>
                        <CirclePlay className="h-4 w-4 shrink-0 text-primary/60" />
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap items-center justify-between gap-3 mt-5">
                    <span className="text-xs text-muted-foreground flex items-center gap-2">
                      <LockKeyhole className="h-3.5 w-3.5" />
                      Full lessons included with enrollment
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary gap-2"
                      onClick={() => onPreview(mod.title)}
                    >
                      Watch course preview <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

interface CoursePreviewDialogProps {
  title: string | null;
  onClose: () => void;
  videoUrl: string;
  courseName?: string;
}

export function CoursePreviewDialog({
  title,
  onClose,
  videoUrl,
  courseName = "AI Engineer Agentic Track",
}: CoursePreviewDialogProps) {
  return (
    <Dialog
      open={title !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="w-[calc(100%-2rem)] max-w-4xl p-4 sm:p-6 rounded-lg">
        <DialogHeader className="pr-7">
          <DialogTitle className="font-display text-xl">Course preview</DialogTitle>
          <DialogDescription>
            {title} · {courseName}
          </DialogDescription>
        </DialogHeader>
        {title !== null && (
          <video
            key={title}
            src={videoUrl}
            controls
            autoPlay
            playsInline
            preload="metadata"
            className="w-full aspect-video rounded-md bg-foreground"
            aria-label="Course preview video"
          />
        )}
        <p className="text-xs text-muted-foreground">
          Sample preview video. The instructor’s course recording will replace this sample.
        </p>
      </DialogContent>
    </Dialog>
  );
}
