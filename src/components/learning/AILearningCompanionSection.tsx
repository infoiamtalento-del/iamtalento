import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, ArrowRight, Plus, Check } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

interface CompanionFeature {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  widgetTitle: string;
  widgetBadge: string;
  footerLeft: string;
  footerRight: string;
}

const FEATURES: CompanionFeature[] = [
  {
    id: "feature-1",
    number: "01",
    eyebrow: "LESSON Q&A",
    title: "Ask anything about your lesson",
    description:
      "Stuck on a concept? Ask AI while watching the video. Get contextual explanations, practical examples and step-by-step guidance without leaving your lesson.",
    widgetTitle: "Live Lesson Q&A Velocity",
    widgetBadge: "04:18 Paused",
    footerLeft: "Timestamp Synced",
    footerRight: "Instant AI Answer",
  },
  {
    id: "feature-2",
    number: "02",
    eyebrow: "CONCEPT CLARITY",
    title: "Understand difficult concepts",
    description:
      "Get complex topics explained in simple language. Ask for examples, alternative explanations or practical scenarios tailored to your learning needs.",
    widgetTitle: "Concept Clarity Breakdown",
    widgetBadge: "94% Clarity",
    footerLeft: "24 Topics Simplified",
    footerRight: "Analogy Mode Active",
  },
  {
    id: "feature-3",
    number: "03",
    eyebrow: "PRACTICE QUIZZES",
    title: "Test your knowledge",
    description:
      "Turn every lesson into an opportunity to practise. Generate quizzes, answer questions and understand where you need improvement.",
    widgetTitle: "Accuracy vs. Recall Speed",
    widgetBadge: "5/5 Mastery",
    footerLeft: "Adaptive Quizzes",
    footerRight: "92% Avg Score",
  },
  {
    id: "feature-4",
    number: "04",
    eyebrow: "REVISION NOTES",
    title: "Get instant learning summaries",
    description:
      "Review important concepts, key takeaways and lesson notes to reinforce your understanding and make revision easier.",
    widgetTitle: "Key Takeaways & Notes",
    widgetBadge: "Auto-Saved",
    footerLeft: "3-Page Cheat Sheet",
    footerRight: "1-Click Revision",
  },
  {
    id: "feature-5",
    number: "05",
    eyebrow: "GAP ANALYSIS",
    title: "Track your learning gaps",
    description:
      "Identify topics that need more practice based on your quiz results and learning activity. Get recommendations on what to revisit next.",
    widgetTitle: "Topic Mastery Channels",
    widgetBadge: "2 Gaps Found",
    footerLeft: "Revisit Lesson 4.2",
    footerRight: "Smart Path Updated",
  },
  {
    id: "feature-6",
    number: "06",
    eyebrow: "MENTOR PREP",
    title: "Prepare for expert sessions",
    description:
      "Let AI organise your unresolved questions and prepare a summary of the challenges you want to discuss with an industry expert.",
    widgetTitle: "1:1 Expert Session Brief",
    widgetBadge: "Brief Ready",
    footerLeft: "3 Priority Questions",
    footerRight: "Shared with Mentor",
  },
];

/* Subtle flat diagonal line pattern in bottom-right corner (Zero Gradient) */
const DiagonalLinesPattern = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 200 200"
    className="pointer-events-none absolute bottom-0 right-0 w-48 h-48 text-[#002C66]/[0.05]"
  >
    {Array.from({ length: 24 }).map((_, i) => {
      const offset = i * 9;
      return (
        <line
          key={i}
          x1={200 - offset}
          y1={200}
          x2={200}
          y2={200 - offset}
          stroke="currentColor"
          strokeWidth="1.5"
        />
      );
    })}
  </svg>
);

const AILearningCompanionSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 390;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const toggleCard = (id: string) => {
    setActiveCardId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="ai-companion" className="py-16 md:py-24 bg-[#FBF4EB] overflow-hidden">
      <div className="container px-4 md:px-6">
        {/* Top Header Row: Left-aligned Title & Subtitle + Right-aligned Circular Arrow Buttons */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12">
          <div className="max-w-2xl">
            <div className="flex justify-start">
              <SectionBadge label="How AI Transforms Your Learning Experience" icon={Sparkles} />
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3 text-slate-950"
            >
              Meet Your AI{" "}
              <span className="text-primary">Learning Companion</span>
            </motion.h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              Not just another chatbot. An intelligent learning assistant that helps you understand, practise and apply what you learn.
            </p>
          </div>

          {/* Circular Prev / Next Navigation Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleScroll("left")}
              aria-label="Previous feature"
              className="h-12 w-12 rounded-full border border-slate-900/70 bg-white text-slate-950 flex items-center justify-center hover:bg-[#002C66] hover:text-white hover:border-[#002C66] transition-colors cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll("right")}
              aria-label="Next feature"
              className="h-12 w-12 rounded-full border border-slate-900/70 bg-white text-slate-950 flex items-center justify-center hover:bg-[#002C66] hover:text-white hover:border-[#002C66] transition-colors cursor-pointer shadow-2xs"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Equal-Sized White Cards Track */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 -mr-4 pr-4 md:-mr-6 md:pr-6"
        >
          {FEATURES.map((feature, index) => {
            const isSelected = activeCardId === feature.id;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                onClick={() => toggleCard(feature.id)}
                className={`group w-[335px] sm:w-[370px] h-[495px] shrink-0 snap-start rounded-2xl bg-white p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "border-2 border-[#002C66] shadow-lg"
                    : "border border-slate-200/90 hover:border-[#002C66]/50 shadow-xs hover:shadow-md"
                }`}
              >
                <DiagonalLinesPattern />

                {/* ─── TOP SECTION: Strictly Locked Heights So All 6 Cards Align Perfectly ─── */}
                <div className="relative z-10">
                  {/* Top Bar: Blue Number Badge + Eyebrow + Circular Plus Button */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="h-7 w-7 rounded-md bg-[#002C66] text-white font-display font-extrabold text-xs flex items-center justify-center shrink-0">
                        {feature.number}
                      </span>
                      <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#002C66]">
                        {feature.eyebrow}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCard(feature.id);
                      }}
                      aria-pressed={isSelected}
                      aria-label={`Select ${feature.title}`}
                      className={`h-9 w-9 rounded-full border flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-[#002C66] text-white border-[#002C66] rotate-45"
                          : "border-slate-300 bg-white text-slate-900 group-hover:border-[#002C66] group-hover:bg-[#002C66] group-hover:text-white"
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Title — Fixed 2-Line Height (56px) for Equal Alignment */}
                  <h3 className="text-xl sm:text-[22px] font-extrabold font-display text-slate-950 leading-[1.22] min-h-[54px] flex items-start mb-2.5">
                    {feature.title}
                  </h3>

                  {/* Description — Fixed 3-Line Height (63px) for Equal Alignment */}
                  <p className="text-sm text-slate-600 leading-[1.5] h-[63px] line-clamp-3">
                    {feature.description}
                  </p>
                </div>

                {/* ─── BOTTOM SECTION: Equal-Height Framed UI Preview Box (236px) ─── */}
                <div className="relative z-10 mt-auto rounded-xl bg-[#F4F7FA] border border-[#002C66]/12 p-2.5">
                  <div className="rounded-lg bg-white border border-slate-200/80 p-3.5 h-[214px] flex flex-col justify-between shadow-2xs">
                    {/* Unified Widget Top Bar */}
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {feature.widgetTitle}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#002C66]/[0.08] text-[#002C66] text-[10px] font-bold shrink-0">
                        {feature.widgetBadge}
                      </span>
                    </div>

                    {/* Unified Widget Middle Visual Canvas (118px) */}
                    <div className="h-[118px] flex flex-col justify-center">
                      {/* Widget 1: Multi-Line Trend Chart */}
                      {index === 0 && (
                        <div>
                          <div className="flex items-center gap-3 text-[9px] text-slate-500 mb-1">
                            <span className="inline-flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#002C66]" /> Context
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" /> Clarity
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" /> Steps
                            </span>
                          </div>
                          <svg viewBox="0 0 240 84" className="w-full h-20 overflow-visible">
                            <line x1="18" y1="14" x2="232" y2="14" stroke="#F1F5F9" strokeWidth="1" />
                            <line x1="18" y1="42" x2="232" y2="42" stroke="#F1F5F9" strokeWidth="1" />
                            <line x1="18" y1="70" x2="232" y2="70" stroke="#F1F5F9" strokeWidth="1" />
                            <text x="0" y="17" className="text-[8px] fill-slate-400">100</text>
                            <text x="4" y="45" className="text-[8px] fill-slate-400">70</text>
                            <text x="4" y="73" className="text-[8px] fill-slate-400">40</text>
                            <polyline
                              fill="none"
                              stroke="#F59E0B"
                              strokeWidth="2"
                              points="22,60 76,36 132,30 188,24 228,22"
                            />
                            <polyline
                              fill="none"
                              stroke="#002C66"
                              strokeWidth="2.2"
                              points="22,66 76,62 132,38 188,18 228,12"
                            />
                            <polyline
                              fill="none"
                              stroke="#10B981"
                              strokeWidth="2"
                              points="22,72 76,54 132,52 188,46 228,28"
                            />
                          </svg>
                        </div>
                      )}

                      {/* Widget 2: Semi-Circle Gauge + Metric Tiles */}
                      {index === 1 && (
                        <div className="grid grid-cols-12 gap-2.5 items-center">
                          <div className="col-span-5 flex flex-col items-center">
                            <svg viewBox="0 0 100 58" className="w-24">
                              <path
                                d="M 10 50 A 40 40 0 0 1 90 50"
                                fill="none"
                                stroke="#E2E8F0"
                                strokeWidth="12"
                              />
                              <path
                                d="M 10 50 A 40 40 0 0 1 82 26"
                                fill="none"
                                stroke="#002C66"
                                strokeWidth="12"
                              />
                              <text
                                x="50"
                                y="48"
                                textAnchor="middle"
                                className="text-[15px] font-extrabold fill-slate-950"
                              >
                                94%
                              </text>
                            </svg>
                            <span className="text-[9px] font-semibold text-slate-500 mt-0.5">
                              Comprehension
                            </span>
                          </div>
                          <div className="col-span-7 space-y-1.5">
                            <div className="rounded-md bg-slate-50 border border-slate-100 px-2.5 py-1.5 flex items-center justify-between">
                              <span className="text-[10px] font-medium text-slate-600">Analogy Match</span>
                              <span className="text-[11px] font-extrabold text-[#002C66]">98%</span>
                            </div>
                            <div className="rounded-md bg-slate-50 border border-slate-100 px-2.5 py-1.5 flex items-center justify-between">
                              <span className="text-[10px] font-medium text-slate-600">Real Scenarios</span>
                              <span className="text-[11px] font-extrabold text-[#10B981]">89%</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Widget 3: Bubble Mastery Matrix */}
                      {index === 2 && (
                        <div>
                          <div className="flex items-center gap-3 text-[9px] text-slate-500 mb-1">
                            <span className="inline-flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#002C66]" /> Theory
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" /> Applied
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" /> Speed
                            </span>
                          </div>
                          <svg viewBox="0 0 240 84" className="w-full h-20">
                            <line x1="16" y1="14" x2="230" y2="14" stroke="#F1F5F9" strokeWidth="1" />
                            <line x1="16" y1="42" x2="230" y2="42" stroke="#F1F5F9" strokeWidth="1" />
                            <line x1="16" y1="70" x2="230" y2="70" stroke="#F1F5F9" strokeWidth="1" />
                            <circle cx="76" cy="38" r="20" fill="#002C66" />
                            <circle cx="128" cy="46" r="24" fill="#10B981" />
                            <circle cx="186" cy="34" r="15" fill="#F59E0B" />
                          </svg>
                        </div>
                      )}

                      {/* Widget 4: Instant Revision Takeaways */}
                      {index === 3 && (
                        <div className="space-y-1.5">
                          {[
                            { label: "01. Core Framework Formula", tag: "03:42" },
                            { label: "02. Production Workflow Steps", tag: "09:15" },
                            { label: "03. Key Benchmarks & Fixes", tag: "14:50" },
                          ].map((row, i) => (
                            <div
                              key={i}
                              className="rounded-md bg-slate-50 border border-slate-100 px-2.5 py-1.5 flex items-center justify-between"
                            >
                              <span className="text-[10px] font-semibold text-slate-800 truncate">
                                {row.label}
                              </span>
                              <span className="text-[9px] font-mono font-bold text-[#002C66]">
                                {row.tag}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Widget 5: Grouped Bar Chart */}
                      {index === 4 && (
                        <svg viewBox="0 0 240 96" className="w-full h-24">
                          <line x1="20" y1="14" x2="230" y2="14" stroke="#F1F5F9" strokeWidth="1" />
                          <line x1="20" y1="44" x2="230" y2="44" stroke="#F1F5F9" strokeWidth="1" />
                          <line x1="20" y1="74" x2="230" y2="74" stroke="#F1F5F9" strokeWidth="1" />
                          {/* Module 1 */}
                          <rect x="42" y="24" width="8" height="50" fill="#002C66" rx="1.5" />
                          <rect x="52" y="14" width="8" height="60" fill="#10B981" rx="1.5" />
                          <rect x="62" y="36" width="8" height="38" fill="#F59E0B" rx="1.5" />
                          {/* Module 2 */}
                          <rect x="112" y="48" width="8" height="26" fill="#002C66" rx="1.5" />
                          <rect x="122" y="26" width="8" height="48" fill="#10B981" rx="1.5" />
                          <rect x="132" y="56" width="8" height="18" fill="#F59E0B" rx="1.5" />
                          {/* Module 3 */}
                          <rect x="182" y="20" width="8" height="54" fill="#002C66" rx="1.5" />
                          <rect x="192" y="32" width="8" height="42" fill="#10B981" rx="1.5" />
                          <rect x="202" y="42" width="8" height="32" fill="#F59E0B" rx="1.5" />
                          <text x="56" y="88" textAnchor="middle" className="text-[8px] fill-slate-500">
                            Module 1
                          </text>
                          <text x="126" y="88" textAnchor="middle" className="text-[8px] fill-slate-500">
                            Module 2
                          </text>
                          <text x="196" y="88" textAnchor="middle" className="text-[8px] fill-slate-500">
                            Module 3
                          </text>
                        </svg>
                      )}

                      {/* Widget 6: 1:1 Expert Session Brief */}
                      {index === 5 && (
                        <div className="space-y-1.5">
                          {[
                            "Unresolved query from Lesson 4.2",
                            "Architecture review for project repo",
                            "Production deployment checklist",
                          ].map((item, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 rounded-md bg-slate-50 border border-slate-100 px-2.5 py-1.5"
                            >
                              <span className="h-4 w-4 rounded-full bg-[#002C66] text-white flex items-center justify-center shrink-0">
                                <Check className="h-2.5 w-2.5" />
                              </span>
                              <span className="text-[10px] font-semibold text-slate-800 truncate">
                                {item}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Unified Widget Footer Bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px]">
                      <span className="text-slate-500 font-medium">{feature.footerLeft}</span>
                      <span className="font-bold text-[#002C66]">{feature.footerRight}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AILearningCompanionSection;
