import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Video,
  FileText,
  Layout,
  ClipboardCheck,
  Sparkles,
  Users,
  MessageSquare,
  Bot,
  BookOpenCheck,
  BarChart3,
  Route,
  CalendarClock,
  Award,
  TrendingUp,
  CheckCircle2,
  Play,
  Zap,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionBadge from "@/components/ui/section-badge";
import { cn } from "@/lib/utils";
import learnerAvatar from "@/assets/webinar-speaker-3.jpg";
import mockThumb1 from "@/assets/mock-interview-1.jpg";
import expertFemale1 from "@/assets/experts/female-1.jpg";
import expertMale1 from "@/assets/experts/male-1.jpg";
import type { LucideIcon } from "lucide-react";

interface PerkItem {
  number: string;
  icon: LucideIcon;
  title: string;
  text: string;
  category: string;
  metric: string;
  metricSub: string;
  highlights: string[];
  previewTag: string;
}

const learnerUSPs: PerkItem[] = [
  {
    number: "01",
    icon: Video,
    title: "Mock Interview Videos",
    text: "Learn how to answer real-world interview questions.",
    category: "Interview Prep",
    metric: "120+ Sessions",
    metricSub: "Real company interview walkthroughs",
    highlights: [
      "Role-by-role answer breakdowns from hiring managers",
      "System design, technical & behavioral round recordings",
      "Timestamped feedback on what separates top 5% answers",
    ],
    previewTag: "HD Video Library",
  },
  {
    number: "02",
    icon: FileText,
    title: "Interview Q&A PDF",
    text: "Access curated questions and expert answers.",
    category: "Study Resource",
    metric: "500+ Q&As",
    metricSub: "Downloadable rapid-revision handbooks",
    highlights: [
      "Curated question banks structured by difficulty tier",
      "Model answers written and verified by domain practitioners",
      "Offline-ready PDF cheat sheets for last-minute prep",
    ],
    previewTag: "Instant PDF Download",
  },
  {
    number: "03",
    icon: Layout,
    title: "Blueprints & Templates",
    text: "Use ready-to-apply professional resources.",
    category: "Execution Kit",
    metric: "85+ Templates",
    metricSub: "Plug-and-play production frameworks",
    highlights: [
      "Architecture diagrams, PRD templates & pitch decks",
      "Production-ready code starters and workflow checklists",
      "Built from real enterprise deliverables",
    ],
    previewTag: "Ready-to-Use Kits",
  },
  {
    number: "04",
    icon: ClipboardCheck,
    title: "Practice Tests",
    text: "Test your knowledge and identify weak areas.",
    category: "Assessment",
    metric: "Adaptive MCQs",
    metricSub: "Timed chapter & full-syllabus mock exams",
    highlights: [
      "Simulated exam environments with instant explanations",
      "Topic-level accuracy and speed benchmarking",
      "Unlimited retakes to track score progression",
    ],
    previewTag: "Instant Auto-Grading",
  },
  {
    number: "05",
    icon: Sparkles,
    title: "AI Personalisation",
    text: "Get learning recommendations tailored to your needs.",
    category: "AI Engine",
    metric: "100% Adaptive",
    metricSub: "Dynamic curriculum tuned to your pace",
    highlights: [
      "Automatically prioritizes modules where you need depth",
      "Recommends next-best projects based on target job roles",
      "Adjusts difficulty in real time as you complete quizzes",
    ],
    previewTag: "Smart Curriculum",
  },
  {
    number: "06",
    icon: Users,
    title: "Community & Peers",
    text: "Connect, collaborate, and learn with others.",
    category: "Network",
    metric: "10,000+ Peers",
    metricSub: "Active study cohorts & project squads",
    highlights: [
      "Topic-specific discussion channels and peer code reviews",
      "Weekly accountability study rooms and group challenges",
      "Direct networking with ambitious professionals across India",
    ],
    previewTag: "Live Cohort Hub",
  },
  {
    number: "07",
    icon: MessageSquare,
    title: "Doubt Resolution",
    text: "Get answers to your learning questions.",
    category: "Mentor Support",
    metric: "< 15 Mins",
    metricSub: "Fast, contextual doubt clearing",
    highlights: [
      "Ask questions directly inside any video lesson timestamp",
      "Step-by-step code debugging and concept walkthroughs",
      "Verified answers from subject-matter mentors",
    ],
    previewTag: "24/7 Doubt Desk",
  },
  {
    number: "08",
    icon: Bot,
    title: "AI Learning Assistant",
    text: "Ask questions and get instant explanations while learning.",
    category: "Co-Pilot",
    metric: "24/7 Co-Pilot",
    metricSub: "Interactive AI tutor beside every lesson",
    highlights: [
      "Explains complex concepts in simple, relatable analogies",
      "Generates custom practice problems on the spot",
      "Supports multilingual queries in 5+ Indian languages",
    ],
    previewTag: "Always-On AI Tutor",
  },
  {
    number: "09",
    icon: BookOpenCheck,
    title: "Smart Notes & Summaries",
    text: "Revise key concepts with AI-generated notes.",
    category: "Revision",
    metric: "1-Click Notes",
    metricSub: "Auto-structured key takeaways & flashcards",
    highlights: [
      "Key formulas, definitions, and code snippets extracted automatically",
      "Syncs your personal highlights with AI chapter summaries",
      "Exportable revision sheets before interviews",
    ],
    previewTag: "AI Study Notes",
  },
  {
    number: "10",
    icon: BarChart3,
    title: "Skill Gap Analysis",
    text: "Discover areas where you need improvement.",
    category: "Diagnostics",
    metric: "360° Radar",
    metricSub: "Role-benchmarked competency mapping",
    highlights: [
      "Compares your current proficiency against top industry hires",
      "Pinpoints exact sub-skills holding back your readiness score",
      "Actionable module recommendations to close every gap",
    ],
    previewTag: "Competency Diagnostic",
  },
  {
    number: "11",
    icon: Route,
    title: "Personalised Learning Path",
    text: "Follow a learning journey aligned with your goals.",
    category: "Roadmap",
    metric: "Custom Milestones",
    metricSub: "Step-by-step career transition roadmap",
    highlights: [
      "Tailored sequence from foundational concepts to capstone build",
      "Weekly hour targets matched to your calendar availability",
      "Clear milestone checkpoints toward job readiness",
    ],
    previewTag: "Guided Career Track",
  },
  {
    number: "12",
    icon: CalendarClock,
    title: "Expert Office Hours",
    text: "Get personalised guidance from industry professionals.",
    category: "1:1 Mentorship",
    metric: "500+ Mentors",
    metricSub: "Live sessions with working industry leaders",
    highlights: [
      "Book 1-on-1 portfolio, resume, and architecture reviews",
      "Candid career advice from engineers and leaders at top firms",
      "Live Q&A clinics on real workplace scenarios",
    ],
    previewTag: "Live 1:1 Booking",
  },
  {
    number: "13",
    icon: Award,
    title: "Completion Certificate",
    text: "Showcase your course completion and acquired knowledge.",
    category: "Credential",
    metric: "QR-Verified",
    metricSub: "Employer-recognized digital credential",
    highlights: [
      "Cryptographically verifiable credential with unique ID",
      "1-click sharing to LinkedIn, resumes, and TalentCIR profile",
      "Backed by demonstrated project and assessment proof",
    ],
    previewTag: "Verified Credential",
  },
  {
    number: "14",
    icon: TrendingUp,
    title: "Progress Tracker",
    text: "Monitor your learning progress and performance.",
    category: "Analytics",
    metric: "Live Telemetry",
    metricSub: "Streaks, quiz velocity & readiness index",
    highlights: [
      "Visual dashboard tracking course completion and test scores",
      "Weekly learning consistency streaks and milestone badges",
      "Real-time Career Readiness Score updates as you learn",
    ],
    previewTag: "Growth Dashboard",
  },
];

const leftColumnUSPs = learnerUSPs.slice(0, 7);
const rightColumnUSPs = learnerUSPs.slice(7, 14);

const WhyChooseLearningSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % learnerUSPs.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [isPaused]);

  const activeItem = learnerUSPs[activeIndex];
  const ActiveIcon = activeItem.icon;

  return (
    <section
      id="why-learners-choose-us"
      aria-labelledby="learner-benefits-heading"
      className="py-20 md:py-28 relative overflow-hidden"
    >
      <div className="container px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <SectionBadge label="Why Learners Choose Us" icon={Award} />
          <h2
            id="learner-benefits-heading"
            className="mb-3 text-3xl md:text-4xl lg:text-[42px] font-bold font-display leading-[1.15] text-slate-950"
          >
            What You Get With<br />
            <span className="text-[#002C66]">Every Course</span>
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-slate-600">
            Every course comes packed with 14 career-accelerating resources, AI tools, and 1:1 mentor support. Click or hover any benefit to explore.
          </p>
        </motion.div>

        {/* Main 3-Column Interactive Showcase (7 Left | Center Live Hub | 7 Right) */}
        <div
          className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-stretch"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Left Column — Points 01 to 07 */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-2.5">
            {leftColumnUSPs.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = activeIndex === idx;
              return (
                <motion.button
                  key={item.number}
                  type="button"
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => setActiveIndex(idx)}
                  initial={{ opacity: 0, x: -18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.04 }}
                  className={cn(
                    "group relative w-full text-left rounded-xl p-3.5 sm:p-4 border transition-all duration-300 cursor-pointer flex items-start gap-3.5",
                    isSelected
                      ? "bg-[#002C66] border-[#002C66] text-white shadow-[0_14px_34px_-12px_rgba(0,44,102,0.45)] -translate-y-0.5"
                      : "bg-white border-slate-200/90 text-slate-900 hover:border-[#002C66]/40 hover:shadow-md"
                  )}
                >
                  <div
                    className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300",
                      isSelected
                        ? "bg-white text-[#002C66]"
                        : "bg-[#002C66]/[0.07] text-[#002C66] group-hover:bg-[#002C66] group-hover:text-white"
                    )}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <h3
                        className={cn(
                          "font-display text-sm sm:text-[15px] font-bold leading-snug truncate",
                          isSelected ? "text-white" : "text-slate-950"
                        )}
                      >
                        {item.title}
                      </h3>
                      <span
                        className={cn(
                          "text-[11px] font-mono font-bold tabular-nums shrink-0",
                          isSelected ? "text-white/75" : "text-[#002C66]/60"
                        )}
                      >
                        {item.number}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "text-xs leading-relaxed line-clamp-1",
                        isSelected ? "text-white/85" : "text-slate-500"
                      )}
                    >
                      {item.text}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Center Column — Interactive Feature Spotlight Card */}
          <div className="lg:col-span-4 flex">
            <div className="w-full rounded-2xl bg-[#002C66] text-white p-6 sm:p-7 shadow-[0_24px_60px_-15px_rgba(0,44,102,0.35)] border border-[#002C66] flex flex-col justify-between relative overflow-hidden">
              {/* Top Status Bar */}
              <div>
                <div className="flex items-center justify-between gap-2 pb-5 mb-6 border-b border-white/15">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold tracking-wide text-white">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Included in Every Course
                  </span>
                  <span className="text-xs font-mono font-bold text-white/75">
                    {activeItem.number} / 14
                  </span>
                </div>

                {/* Animated Active Feature Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeItem.number}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.28 }}
                  >
                    {/* Icon + Category Pill */}
                    <div className="flex items-center gap-3.5 mb-5">
                      <div className="h-14 w-14 rounded-2xl bg-white text-[#002C66] flex items-center justify-center shadow-lg shrink-0">
                        <ActiveIcon className="h-7 w-7" strokeWidth={1.8} />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/70 block">
                          {activeItem.category}
                        </span>
                        <span className="text-xs font-semibold text-white/90">
                          {activeItem.previewTag}
                        </span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-2xl sm:text-[26px] font-bold font-display leading-tight text-white mb-2.5">
                      {activeItem.title}
                    </h3>
                    <p className="text-sm sm:text-base text-white/85 leading-relaxed mb-6">
                      {activeItem.text}
                    </p>

                    {/* White Inner Metric & Highlights Card */}
                    <div className="rounded-xl bg-white text-slate-900 p-4 sm:p-5 shadow-md">
                      <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100">
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Course Advantage
                          </p>
                          <p className="text-lg sm:text-xl font-bold font-display text-[#002C66]">
                            {activeItem.metric}
                          </p>
                        </div>
                        <div className="h-9 w-9 rounded-full bg-[#002C66]/10 text-[#002C66] flex items-center justify-center">
                          <Zap className="h-4 w-4" />
                        </div>
                      </div>

                      <ul className="space-y-2.5">
                        {activeItem.highlights.map((point, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-700 leading-snug">
                            <CheckCircle2 className="h-4 w-4 text-[#002C66] shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom Mentor / Learner Strip & CTA */}
              <div className="mt-6 pt-5 border-t border-white/15">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex -space-x-2">
                      <img
                        src={learnerAvatar}
                        alt="Mentor"
                        className="h-8 w-8 rounded-full object-cover ring-2 ring-[#002C66]"
                      />
                      <img
                        src={expertFemale1}
                        alt="Mentor"
                        className="h-8 w-8 rounded-full object-cover ring-2 ring-[#002C66]"
                      />
                      <img
                        src={expertMale1}
                        alt="Mentor"
                        className="h-8 w-8 rounded-full object-cover ring-2 ring-[#002C66]"
                      />
                    </div>
                    <span className="text-xs text-white/85 font-medium">
                      All 14 perks unlocked instantly
                    </span>
                  </div>
                </div>

                {/* Progress dots */}
                <div className="flex items-center gap-1 mb-5">
                  {learnerUSPs.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      aria-label={`Select perk ${idx + 1}`}
                      onClick={() => setActiveIndex(idx)}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                        activeIndex === idx
                          ? "flex-1 bg-white"
                          : "w-2 bg-white/30 hover:bg-white/50"
                      )}
                    />
                  ))}
                </div>

                <Button
                  asChild
                  size="lg"
                  className="w-full h-11 rounded-xl bg-white text-[#002C66] hover:bg-white/90 font-bold gap-2 shadow-sm"
                >
                  <Link to="/learning#courses">
                    Explore Courses <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column — Points 08 to 14 */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-2.5">
            {rightColumnUSPs.map((item, idx) => {
              const actualIdx = idx + 7;
              const Icon = item.icon;
              const isSelected = activeIndex === actualIdx;
              return (
                <motion.button
                  key={item.number}
                  type="button"
                  onMouseEnter={() => setActiveIndex(actualIdx)}
                  onClick={() => setActiveIndex(actualIdx)}
                  initial={{ opacity: 0, x: 18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.04 }}
                  className={cn(
                    "group relative w-full text-left rounded-xl p-3.5 sm:p-4 border transition-all duration-300 cursor-pointer flex items-start gap-3.5",
                    isSelected
                      ? "bg-[#002C66] border-[#002C66] text-white shadow-[0_14px_34px_-12px_rgba(0,44,102,0.45)] -translate-y-0.5"
                      : "bg-white border-slate-200/90 text-slate-900 hover:border-[#002C66]/40 hover:shadow-md"
                  )}
                >
                  <div
                    className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300",
                      isSelected
                        ? "bg-white text-[#002C66]"
                        : "bg-[#002C66]/[0.07] text-[#002C66] group-hover:bg-[#002C66] group-hover:text-white"
                    )}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <h3
                        className={cn(
                          "font-display text-sm sm:text-[15px] font-bold leading-snug truncate",
                          isSelected ? "text-white" : "text-slate-950"
                        )}
                      >
                        {item.title}
                      </h3>
                      <span
                        className={cn(
                          "text-[11px] font-mono font-bold tabular-nums shrink-0",
                          isSelected ? "text-white/75" : "text-[#002C66]/60"
                        )}
                      >
                        {item.number}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "text-xs leading-relaxed line-clamp-1",
                        isSelected ? "text-white/85" : "text-slate-500"
                      )}
                    >
                      {item.text}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseLearningSection;
