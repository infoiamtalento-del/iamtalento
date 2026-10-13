import React, { useState } from "react";
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Trash2,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ProUser, ProJob, ProApplication } from "@/data/proData";

interface ProAiAssistantProps {
  user: ProUser;
  jobs: ProJob[];
  applications: ProApplication[];
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
}

interface Message {
  sender: "user" | "ai";
  text: string;
}

export const ProAiAssistant: React.FC<ProAiAssistantProps> = ({
  user,
  jobs,
  applications,
  open,
  onOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = (v: boolean) => {
    if (open !== undefined) onOpenChange?.(v);
    else setInternalOpen(v);
  };
  const [query, setQuery] = useState("");
  const isEmployer = user.role === "employer";

  const [messages, setMessages] = useState<Message[]>(() => [
    {
      sender: "ai",
      text: isEmployer
        ? `Hello! I am your Talento Recruiter Copilot. I can help you draft job requirements, evaluate applicant matches, or suggest competitive compensation bands for ${user.cp?.name || "your company"}.`
        : `Hi ${user.name.split(" ")[0]}! I am your Talento Career AI Copilot. Ask me anything about tailoring your resume, preparing for upcoming interviews, or finding high-fit engineering openings.`,
    },
  ]);

  const quickPrompts = isEmployer
    ? [
        "Draft interview questions for Senior React",
        "Summarize my active applicant pipeline",
        "Suggest competitive salary in Bengaluru",
        "How can I improve candidate response rates?",
      ]
    : [
        "How can I improve my ATS resume score?",
        "What questions should I expect in a React interview?",
        "Which skills give me the highest salary boost?",
        "Recommend top matching jobs for me",
      ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || query;
    if (!text.trim()) return;

    const newMessages: Message[] = [...messages, { sender: "user", text: text.trim() }];
    setMessages(newMessages);
    setQuery("");

    // Simulate smart local response based on user context
    setTimeout(() => {
      let reply = "";
      const lower = text.toLowerCase();

      if (isEmployer) {
        if (lower.includes("react") || lower.includes("question")) {
          reply = `Here are 3 high-signal interview questions for your React position:\n1. State Management & Concurrency: How do you prevent unnecessary re-renders in deep component trees when using context or custom hooks?\n2. Performance: How do you diagnose and fix poor Interaction to Next Paint (INP) scores in production React SPAs?\n3. Architecture: When would you reach for a state machine (XState) over standard reducer patterns?`;
        } else if (lower.includes("pipeline") || lower.includes("applicant")) {
          reply = `You currently have ${jobs.filter((j) => j.by === user.email).length} active jobs posted. There are candidates in your pipeline waiting for an SLA update. I recommend reviewing your urgent queue in the Pipeline Board to maintain 100% SLA compliance!`;
        } else if (lower.includes("salary") || lower.includes("bengaluru")) {
          reply = `For 3-5 years of full-stack engineering experience in Bengaluru, market data indicates a median compensation of ₹18–26 LPA for high-growth tech companies, and ₹24–34 LPA for tier-1 product organizations.`;
        } else {
          reply = `I have analyzed your recruiter dashboard. Your 24-hour review SLA rating is strong. Would you like me to generate a tailored job description or shortlist matching candidate profiles?`;
        }
      } else {
        if (lower.includes("ats") || lower.includes("resume")) {
          reply = `Based on your profile, your ATS match is strong for frontend engineering. To boost it further, ensure your resume includes quantifiable impact metrics (e.g. "reduced checkout load time by 35%") and keywords like TypeScript, Next.js, and Jest.`;
        } else if (lower.includes("react") || lower.includes("interview")) {
          reply = `Top technical focus areas for your upcoming interviews:\n• Component lifecycle & useEffect cleanups\n• Virtual DOM diffing & React Fiber architecture\n• Custom hooks for shared stateful logic\n• Web Vitals (LCP, CLS, INP) optimization strategies`;
        } else if (lower.includes("skill") || lower.includes("salary")) {
          reply = `In the current Indian tech market, engineers with verified TypeScript, Next.js, and Docker skills command a 25–40% premium compared to pure vanilla React profiles. You have already verified React with an 88% assessment score!`;
        } else {
          reply = `You have ${applications.filter((a) => a.who === user.email).length} active applications under review. Check your 24h SLA Updates tab to track responses from hiring teams!`;
        }
      }

      setMessages([...newMessages, { sender: "ai", text: reply }]);
    }, 600);
  };

  return (
    <>
      {/* Floating Copilot Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-primary hover:bg-primary/90 text-primary-foreground p-3.5 rounded-full shadow-xl flex items-center gap-2 transition-transform hover:scale-105"
        title="Open Talento AI Copilot"
      >
        <Sparkles className="w-5 h-5" />
        <span className="text-xs font-bold hidden sm:inline">AI Copilot</span>
      </button>

      {/* Slide-over Chat Panel */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-card border-l border-border shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 border-b border-border/80 flex items-center justify-between bg-muted/20">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                  Talento AI Copilot
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </h3>
                <span className="text-[11px] text-muted-foreground">Autonomous Assistant</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setMessages([])}
                className="w-7 h-7 p-0 text-muted-foreground hover:text-foreground"
                title="Clear Chat"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 p-0 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-2.5",
                  m.sender === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5",
                    m.sender === "user" ? "bg-muted text-foreground" : "bg-primary text-primary-foreground"
                  )}
                >
                  {m.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                <div
                  className={cn(
                    "p-3 rounded-2xl max-w-[82%] leading-relaxed whitespace-pre-line",
                    m.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-xs"
                      : "bg-muted/50 text-foreground border border-border/60 rounded-tl-xs"
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Prompts & Input */}
          <div className="p-3.5 border-t border-border/80 bg-muted/10 space-y-2.5">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p)}
                  className="px-2.5 py-1 rounded-full bg-background border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors shrink-0"
                >
                  {p}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <Input
                placeholder="Ask your AI copilot anything..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="text-xs h-9 bg-background"
              />
              <Button type="submit" size="sm" className="rounded-xl h-9 px-3 shrink-0">
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
