import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Code2, Users, MessageSquare, BarChart3, ArrowUpRight } from "lucide-react";

type TabKey = "technical" | "behavioral" | "communication" | "aptitude";

interface TabData {
  key: TabKey;
  label: string;
  count: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  activeIconBg: string;
  assessmentName: string;
  subLabel: string;
  questionOf: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  skills: { name: string; value: number }[];
  stats: { duration: string; questions: string; passScore: string; taken: string };
}

const tabs: TabData[] = [
  {
    key: "technical",
    label: "Technical",
    count: "148 assessments",
    icon: Code2,
    iconColor: "hsl(355 84% 54%)",
    iconBg: "hsl(355 84% 54% / 0.1)",
    activeIconBg: "hsl(355 84% 54% / 0.15)",
    assessmentName: "Technical assessment",
    subLabel: "React.js · Intermediate · 45 min",
    questionOf: "QUESTION 1 OF 12",
    question: "A React component re-renders more than expected. Which hook would you use to memoize an expensive computed value and prevent unnecessary recalculations?",
    options: ["useCallback", "useMemo", "useEffect", "useRef"],
    correctIndex: 1,
    explanation: "useMemo caches computed values between renders. useCallback memoizes functions.",
    skills: [
      { name: "React hooks", value: 85 },
      { name: "Performance", value: 72 },
      { name: "State management", value: 68 },
      { name: "Component lifecycle", value: 60 },
    ],
    stats: { duration: "45 min", questions: "12 Qs", passScore: "70%", taken: "18.4k" },
  },
  {
    key: "behavioral",
    label: "Behavioral",
    count: "64 assessments",
    icon: Users,
    iconColor: "#1D9E75",
    iconBg: "rgba(29,158,117,0.1)",
    activeIconBg: "rgba(29,158,117,0.15)",
    assessmentName: "Behavioral assessment",
    subLabel: "Leadership · Intermediate · 30 min",
    questionOf: "QUESTION 1 OF 8",
    question: "Your team misses a deadline due to unclear ownership. In a retrospective, what do you do first?",
    options: [
      "Identify who caused it",
      "Establish clear ownership going forward",
      "Escalate immediately",
      "Cancel all future meetings",
    ],
    correctIndex: 1,
    explanation: "Effective leaders fix systems, not blame people. Clear ownership prevents recurrence.",
    skills: [
      { name: "Leadership", value: 90 },
      { name: "Emotional IQ", value: 80 },
      { name: "Conflict resolution", value: 75 },
      { name: "Decision making", value: 65 },
    ],
    stats: { duration: "30 min", questions: "8 Qs", passScore: "65%", taken: "9.2k" },
  },
  {
    key: "communication",
    label: "Communication",
    count: "39 assessments",
    icon: MessageSquare,
    iconColor: "#534AB7",
    iconBg: "rgba(83,74,183,0.1)",
    activeIconBg: "rgba(83,74,183,0.15)",
    assessmentName: "Communication assessment",
    subLabel: "Professional · Advanced · 25 min",
    questionOf: "QUESTION 1 OF 6",
    question: "A client says their delivery is 3 days late and they're considering cancelling. What is the best response?",
    options: [
      "Apologise and refund",
      "Acknowledge, explain, share revised timeline, offer goodwill",
      "Ask for more details",
      "Escalate to manager",
    ],
    correctIndex: 1,
    explanation: "Great professional comms is transparent, clear on resolution, and empathetic without over-promising.",
    skills: [
      { name: "Written clarity", value: 88 },
      { name: "Empathy", value: 82 },
      { name: "Professional tone", value: 76 },
      { name: "Conflict handling", value: 70 },
    ],
    stats: { duration: "25 min", questions: "6 Qs", passScore: "72%", taken: "6.8k" },
  },
  {
    key: "aptitude",
    label: "Aptitude",
    count: "52 assessments",
    icon: BarChart3,
    iconColor: "#BA7517",
    iconBg: "rgba(186,117,23,0.1)",
    activeIconBg: "rgba(186,117,23,0.15)",
    assessmentName: "Aptitude assessment",
    subLabel: "Logical · Intermediate · 35 min",
    questionOf: "QUESTION 1 OF 10",
    question: "All Bloops are Razzies. All Razzies are Lazzies. Which statement must be true?",
    options: [
      "All Lazzies are Bloops",
      "All Bloops are Lazzies",
      "Some Razzies are not Lazzies",
      "No Lazzies are Bloops",
    ],
    correctIndex: 1,
    explanation: "Bloops → Razzies → Lazzies. The chain of inclusion makes this certain.",
    skills: [
      { name: "Pattern recognition", value: 82 },
      { name: "Logical reasoning", value: 78 },
      { name: "Speed", value: 70 },
      { name: "Verbal reasoning", value: 65 },
    ],
    stats: { duration: "35 min", questions: "10 Qs", passScore: "68%", taken: "11.1k" },
  },
];

const WhatsInsideSection = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("technical");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const current = tabs.find((t) => t.key === activeTab)!;

  const handleTabSwitch = (key: TabKey) => {
    if (key === activeTab) return;
    setActiveTab(key);
    setSelectedOption(null);
    setAnswered(false);
  };

  const handleOptionClick = (index: number) => {
    if (answered) return;
    setSelectedOption(index);
    setAnswered(true);
  };

  const getOptionStyle = (index: number) => {
    if (!answered) {
      return {
        bg: "#FFFFFF",
        border: "1px solid #E2E8F0",
        radioFill: "transparent",
        radioBorder: "#CBD5E1",
      };
    }
    const isCorrect = index === current.correctIndex;
    const isSelected = index === selectedOption;
    if (isCorrect) {
      return {
        bg: "rgba(29,158,117,0.06)",
        border: "1px solid rgba(29,158,117,0.5)",
        radioFill: "#1D9E75",
        radioBorder: "#1D9E75",
      };
    }
    if (isSelected && !isCorrect) {
      return {
        bg: "rgba(237,41,56,0.06)",
        border: "1px solid rgba(237,41,56,0.5)",
        radioFill: "hsl(355 84% 54%)",
        radioBorder: "hsl(355 84% 54%)",
      };
    }
    return {
      bg: "#FFFFFF",
      border: "1px solid #E2E8F0",
      radioFill: "transparent",
      radioBorder: "#CBD5E1",
    };
  };

  const isCorrectAnswer = selectedOption === current.correctIndex;

  return (
    <section className="bg-[#FBF4EB] py-16 md:py-20">
      <div className="max-w-[1160px] mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span
            className="inline-block text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 mb-4"
            style={{
              background: "hsl(355 84% 54% / 0.12)",
              color: "hsl(355 84% 54%)",
              borderRadius: 100,
            }}
          >
            YOUR SKILLS IN MIND
          </span>
          <h2
            className="text-[26px] md:text-[30px] font-bold mb-2"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0F172A" }}
          >
            Not a Quiz. A Real-World{" "}
            <span style={{ color: "hsl(355 84% 54%)" }}>Performance Simulation.</span>
          </h2>
          <p className="text-[14px]" style={{ color: "#64748B" }}>
            Click a type to explore a sample question
          </p>
        </motion.div>

        {/* Tab Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabSwitch(tab.key)}
                className="flex items-center gap-3 p-3.5 text-left transition-all duration-200"
                style={{
                  borderRadius: 12,
                  background: isActive ? "hsl(355 84% 54% / 0.04)" : "#FFFFFF",
                  border: isActive
                    ? "1px solid hsl(355 84% 54% / 0.4)"
                    : "1px solid #E2E8F0",
                }}
              >
                <div
                  className="h-8 w-8 flex items-center justify-center shrink-0"
                  style={{
                    borderRadius: 8,
                    background: isActive ? tab.activeIconBg : tab.iconBg,
                  }}
                >
                  <tab.icon className="h-4 w-4" style={{ color: tab.iconColor }} />
                </div>
                <div>
                  <div
                    className="text-[13px] font-bold"
                    style={{ color: "#0F172A" }}
                  >
                    {tab.label}
                  </div>
                  <div
                    className="text-[11px]"
                    style={{ color: "#94A3B8" }}
                  >
                    {tab.count}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="grid md:grid-cols-[1fr_340px] gap-5"
          >
            {/* Left — Question Card */}
            <div
              className="p-6"
              style={{
                borderRadius: 14,
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
              }}
            >
              {/* Question header */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="h-9 w-9 flex items-center justify-center shrink-0"
                  style={{ borderRadius: 8, background: current.iconBg }}
                >
                  <current.icon className="h-4.5 w-4.5" style={{ color: current.iconColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-bold" style={{ color: "#0F172A" }}>
                    {current.assessmentName}
                  </div>
                  <div className="text-[11px]" style={{ color: "#94A3B8" }}>
                    {current.subLabel}
                  </div>
                </div>
                <span
                  className="text-[10px] font-bold uppercase px-2.5 py-1 shrink-0"
                  style={{
                    borderRadius: 6,
                    background: "hsl(355 84% 54% / 0.12)",
                    color: "hsl(355 84% 54%)",
                  }}
                >
                  Sample Q
                </span>
              </div>

              {/* Question label */}
              <div
                className="text-[11px] font-bold uppercase tracking-wider mb-2"
                style={{ color: "hsl(355 84% 54%)" }}
              >
                {current.questionOf}
              </div>

              {/* Question text */}
              <p
                className="text-[14px] font-medium leading-[1.6] mb-5"
                style={{ color: "#0F172A" }}
              >
                {current.question}
              </p>

              {/* Options */}
              <div className="space-y-2.5">
                {current.options.map((option, i) => {
                  const style = getOptionStyle(i);
                  return (
                    <button
                      key={i}
                      onClick={() => handleOptionClick(i)}
                      disabled={answered}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200"
                      style={{
                        borderRadius: 10,
                        background: style.bg,
                        border: style.border,
                        cursor: answered ? "default" : "pointer",
                      }}
                    >
                      <div
                        className="h-4 w-4 rounded-full shrink-0 flex items-center justify-center"
                        style={{ border: `2px solid ${style.radioBorder}` }}
                      >
                        {style.radioFill !== "transparent" && (
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ background: style.radioFill }}
                          />
                        )}
                      </div>
                      <span className="text-[13px]" style={{ color: "#334155" }}>
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback */}
              <AnimatePresence>
                {answered && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 overflow-hidden"
                  >
                    <div
                      className="px-4 py-3 text-[13px] leading-[1.5]"
                      style={{
                        borderRadius: 10,
                        background: isCorrectAnswer
                          ? "rgba(29,158,117,0.1)"
                          : "rgba(237,41,56,0.1)",
                        border: isCorrectAnswer
                          ? "1px solid rgba(29,158,117,0.3)"
                          : "1px solid rgba(237,41,56,0.3)",
                        color: isCorrectAnswer ? "#34D399" : "#F87171",
                      }}
                    >
                      <span className="font-bold">
                        {isCorrectAnswer ? "Correct! " : "Not quite. "}
                      </span>
                      {current.explanation}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right — Stats Sidebar */}
            <div className="space-y-4">
              {/* Skills Card */}
              <div
                className="p-5"
                style={{
                  borderRadius: 14,
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                }}
              >
                <h4 className="text-[13px] font-bold mb-4" style={{ color: "#0F172A" }}>
                  Skills tested in {current.label}
                </h4>
                <div className="space-y-3.5">
                  {current.skills.map((skill) => (
                    <div key={skill.name} className="flex items-center gap-3">
                      <span
                        className="text-[12px] w-[130px] shrink-0 truncate"
                        style={{ color: "#64748B" }}
                      >
                        {skill.name}
                      </span>
                      <div
                        className="flex-1 h-2 overflow-hidden"
                        style={{ borderRadius: 100, background: "#F1F5F9" }}
                      >
                        <motion.div
                          className="h-full"
                          style={{
                            borderRadius: 100,
                            background: "hsl(355 84% 54%)",
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.value}%` }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                        />
                      </div>
                      <span
                        className="text-[12px] font-medium w-[32px] text-right shrink-0"
                        style={{ color: "#475569" }}
                      >
                        {skill.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Card */}
              <div
                className="p-5"
                style={{
                  borderRadius: 14,
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                }}
              >
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: current.stats.duration, label: "Duration" },
                    { value: current.stats.questions, label: "Questions" },
                    { value: current.stats.passScore, label: "Pass score" },
                    { value: current.stats.taken, label: "Taken" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div
                        className="text-[22px] font-medium"
                        style={{ color: "#0F172A" }}
                      >
                        {stat.value}
                      </div>
                      <div
                        className="text-[11px]"
                        style={{ color: "#94A3B8" }}
                      >
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <button
                className="w-full flex items-center justify-center gap-2 py-3.5 text-[14px] font-bold transition-all duration-200"
                style={{
                  borderRadius: 12,
                  background: "hsl(355 84% 54%)",
                  color: "#FFFFFF",
                  border: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.9";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
              >
                Take {current.label} assessment <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default WhatsInsideSection;
