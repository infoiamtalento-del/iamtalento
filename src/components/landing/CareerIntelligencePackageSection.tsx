import { useState, useRef, useEffect, lazy, Suspense, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Check,
  RotateCcw,
  ShieldCheck,
  FileBarChart2,
  TrendingUp,
  Award,
  Zap,
  Briefcase,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionBadge from "@/components/ui/section-badge";
import { Link } from "react-router-dom";

const SampleCirDialog = lazy(() => import("@/components/assessments/cir/SampleCirDialog"));

export type BenefitModule = {
  id: string;
  num: string;
  shortTitle: string;
  title: string;
  tag: string;
  metricBadge: string;
  summary: string;
  highlightStat: string;
  highlightLabel: string;
  proofPoints: string[];
};

export const REPORT_BENEFITS: BenefitModule[] = [
  {
    id: "ai-assessment",
    num: "01",
    shortTitle: "AI Skill Evaluation",
    title: "AI Skill Assessment Breakdown",
    tag: "5-Dimension Analysis",
    metricBadge: "92 / 100",
    summary: "Multi-axis scoring across functional execution, problem-solving, and role-specific mastery.",
    highlightStat: "Top 6%",
    highlightLabel: "National Cohort Standing",
    proofPoints: [
      "Sub-skill accuracy across 4 mandatory + 1 domain track",
      "Question-by-question speed & accuracy calibration",
    ],
  },
  {
    id: "employability",
    num: "02",
    shortTitle: "Employability Score",
    title: "Industry Readiness Score (IRS)",
    tag: "Recruiter Benchmark",
    metricBadge: "88 IRS Score",
    summary: "Standardized readiness index trusted by 500+ corporate hiring partners to fast-track candidates.",
    highlightStat: "3.4×",
    highlightLabel: "Higher Shortlist Rate",
    proofPoints: [
      "Composite index of practical + behavioural rounds",
      "Direct eligibility for priority employer shortlists",
    ],
  },
  {
    id: "benchmarking",
    num: "03",
    shortTitle: "Industry Benchmarking",
    title: "Peer & Industry Benchmarking",
    tag: "Cohort Percentile",
    metricBadge: "91st %ile",
    summary: "Compare your score directly against peers and senior professionals in your target city.",
    highlightStat: "+29 pts",
    highlightLabel: "Above Industry Median",
    proofPoints: [
      "Head-to-head comparison with top 10% hired talent",
      "Experience-band percentile curve across top tech hubs",
    ],
  },
  {
    id: "salary",
    num: "04",
    shortTitle: "Salary Potential",
    title: "Data-Backed Salary Potential",
    tag: "Compensation Intel",
    metricBadge: "₹14L – ₹21L",
    summary: "Market compensation bands and negotiation leverage matched to your verified percentile.",
    highlightStat: "+28%",
    highlightLabel: "Verified Pay Premium",
    proofPoints: [
      "City-adjusted CTC bands across Tier-1 and remote roles",
      "Skill scarcity multiplier backed by your verified dossier",
    ],
  },
  {
    id: "skill-gap",
    num: "05",
    shortTitle: "Skill Gap Analysis",
    title: "Personalized Skill Gap Roadmap",
    tag: "Targeted Growth",
    metricBadge: "2 Micro-Gaps",
    summary: "Pinpoints exact sub-skills holding back your score and prescribes focused project sprints.",
    highlightStat: "+11 pts",
    highlightLabel: "Projected 14-Day Lift",
    proofPoints: [
      "Side-by-side production-ready vs. developing competencies",
      "Targeted micro-modules to close gaps before final rounds",
    ],
  },
  {
    id: "career-path",
    num: "06",
    shortTitle: "Career Path Map",
    title: "AI Career Path & Role-Fit Engine",
    tag: "Trajectory Engine",
    metricBadge: "95% Role Fit",
    summary: "Maps cognitive and technical strengths to high-growth roles where you have the highest win rate.",
    highlightStat: "12 Tracks",
    highlightLabel: "High-Match Roles Unlocked",
    proofPoints: [
      "Immediate best-fit roles + 18-month progression horizon",
      "1-click apply to matched partner openings on I Am Talento",
    ],
  },
  {
    id: "interview",
    num: "07",
    shortTitle: "Interview Readiness",
    title: "HR & Technical Interview Rubric",
    tag: "Behavioural Rubric",
    metricBadge: "90% Ready",
    summary: "Evaluates situational judgment, structured communication, and executive clarity for live rounds.",
    highlightStat: "4.8 / 5",
    highlightLabel: "Executive Rubric Score",
    proofPoints: [
      "STAR-method structured problem solving score",
      "Voice clarity, confidence, and situational judgment rating",
    ],
  },
  {
    id: "passport",
    num: "08",
    shortTitle: "Digital Skill Passport",
    title: "Verified Skill Badge & Passport",
    tag: "Tamper-Proof ID",
    metricBadge: "Verified ID",
    summary: "Portable digital credential with QR code that embeds directly into LinkedIn and resume PDFs.",
    highlightStat: "100%",
    highlightLabel: "Recruiter One-Click Trust",
    proofPoints: [
      "Unique tamper-proof verification URL & scan QR code",
      "Gold Verified Talent Badge active on your Talento profile",
    ],
  },
];

/* ──────────────────────────────────────────────────────────────────────────
   Compact Visual Graphics for each of the 8 Benefit Cards
   ────────────────────────────────────────────────────────────────────────── */
const BenefitMiniGraphic = ({ id }: { id: string }) => {
  switch (id) {
    case "ai-assessment":
      return (
        <div className="rounded-xl bg-[#FBF4EB] p-2.5 space-y-1.5 border border-[#002C66]/10">
          <div className="flex justify-between items-center text-[10px]">
            <span className="font-semibold text-slate-700">Domain Core</span>
            <span className="font-bold text-[#002C66]">94%</span>
          </div>
          <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
            <div className="h-full bg-[#002C66] rounded-full w-[94%]" />
          </div>
          <div className="flex justify-between items-center text-[10px]">
            <span className="font-semibold text-slate-700">Execution</span>
            <span className="font-bold text-[#002C66]">91%</span>
          </div>
          <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
            <div className="h-full bg-[#002C66] rounded-full w-[91%]" />
          </div>
        </div>
      );

    case "employability": {
      const circ = 2 * Math.PI * 22;
      const off = circ * (1 - 0.88);
      return (
        <div className="rounded-xl bg-[#FBF4EB] p-2 flex items-center justify-between border border-[#002C66]/10">
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="h-12 w-12 -rotate-90" viewBox="0 0 54 54">
              <circle cx="27" cy="27" r="22" fill="none" stroke="#e2e8f0" strokeWidth="5" />
              <circle
                cx="27"
                cy="27"
                r="22"
                fill="none"
                stroke="#002C66"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={off}
              />
            </svg>
            <span className="absolute text-xs font-extrabold text-[#002C66]">88</span>
          </div>
          <div className="text-right pl-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Tier Band</span>
            <span className="text-xs font-extrabold text-[#002C66]">A+ Ready to Hire</span>
          </div>
        </div>
      );
    }

    case "benchmarking":
      return (
        <div className="rounded-xl bg-[#FBF4EB] p-2.5 border border-[#002C66]/10 flex flex-col justify-center">
          <div className="flex justify-between text-[10px] font-semibold text-slate-600 mb-1">
            <span>50th Median</span>
            <span className="text-[#002C66] font-extrabold">91st %ile (You)</span>
          </div>
          <div className="relative h-4 w-full bg-white rounded-full overflow-hidden flex items-center px-1">
            <div className="h-2 w-full bg-gradient-to-r from-slate-200 via-sky-300 to-[#002C66] rounded-full" />
            <div className="absolute right-3 h-3 w-3 bg-[#002C66] rounded-full border-2 border-white shadow-xs" />
          </div>
        </div>
      );

    case "salary":
      return (
        <div className="rounded-xl bg-[#FBF4EB] p-2.5 border border-[#002C66]/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-slate-500 block">Target CTC</span>
            <span className="text-sm font-extrabold text-[#002C66]">₹14L – ₹21L</span>
          </div>
          <span className="rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold px-2 py-1">
            +28% Lift
          </span>
        </div>
      );

    case "skill-gap":
      return (
        <div className="rounded-xl bg-[#FBF4EB] p-2 border border-[#002C66]/10 flex items-center justify-between gap-1.5">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-white text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200">
              <Check className="h-2.5 w-2.5" /> 8 Ready
            </span>
            <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-white text-amber-700 px-1.5 py-0.5 rounded border border-amber-200 block">
              <Zap className="h-2.5 w-2.5" /> 2 Gaps
            </span>
          </div>
          <div className="text-right">
            <span className="text-[9px] text-slate-500 block">Sprint</span>
            <span className="text-xs font-extrabold text-[#002C66]">14 Days</span>
          </div>
        </div>
      );

    case "career-path":
      return (
        <div className="rounded-xl bg-[#FBF4EB] p-2 border border-[#002C66]/10 flex items-center justify-around text-center">
          <div>
            <span className="text-xs font-extrabold text-[#002C66] block">95%</span>
            <span className="text-[9px] text-slate-600 font-medium">Growth PM</span>
          </div>
          <div className="h-6 w-px bg-[#002C66]/15" />
          <div>
            <span className="text-xs font-extrabold text-[#002C66] block">91%</span>
            <span className="text-[9px] text-slate-600 font-medium">Product Lead</span>
          </div>
        </div>
      );

    case "interview":
      return (
        <div className="rounded-xl bg-[#FBF4EB] p-2 border border-[#002C66]/10 flex items-center justify-between">
          <div className="flex items-end gap-1 h-7 px-1">
            {[40, 70, 95, 80, 100, 65, 85, 90].map((h, i) => (
              <span
                key={i}
                className="w-1 bg-[#002C66] rounded-full"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 block">STAR Rubric</span>
            <span className="text-xs font-extrabold text-[#002C66]">4.8 / 5.0</span>
          </div>
        </div>
      );

    case "passport":
      return (
        <div className="rounded-xl bg-[#FBF4EB] p-2 border border-[#002C66]/10 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="h-7 w-7 rounded-lg bg-[#002C66] flex items-center justify-center text-white shrink-0">
              <Award className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[9px] text-slate-500 uppercase font-bold block">Badge ID</span>
              <span className="text-[11px] font-extrabold text-[#002C66]">#CIR-8841</span>
            </div>
          </div>
          <span className="text-[9px] font-extrabold bg-[#002C66] text-white px-2 py-0.5 rounded-full">
            Verified
          </span>
        </div>
      );

    default:
      return null;
  }
};

/* ──────────────────────────────────────────────────────────────────────────
   Interactive 3D Flip Card for Each Benefit
   ────────────────────────────────────────────────────────────────────────── */
interface CardProps {
  benefit: BenefitModule;
  isFlipped: boolean;
  onFlip: () => void;
}

const BenefitFlipCard = ({ benefit, isFlipped, onFlip }: CardProps) => {
  return (
    <div
      className="relative h-[310px] w-full [perspective:1000px] cursor-pointer group"
      onClick={onFlip}
    >
      <div
        className={`relative h-full w-full rounded-2xl transition-all duration-500 [transform-style:preserve-3d] shadow-sm hover:shadow-md ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* ── FRONT SIDE ── */}
        <div className="absolute inset-0 h-full w-full rounded-2xl bg-white border border-[#002C66]/15 p-4 flex flex-col justify-between [backface-visibility:hidden]">
          {/* Top Pill Row */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="h-6 w-6 rounded-md bg-[#002C66] text-white text-[11px] font-extrabold flex items-center justify-center">
                {benefit.num}
              </span>
              <span className="text-[10px] font-extrabold text-[#002C66] bg-[#002C66]/8 px-2 py-0.5 rounded-full">
                {benefit.metricBadge}
              </span>
            </div>

            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
              {benefit.tag}
            </p>
            <h3 className="text-base font-extrabold font-display text-slate-900 leading-snug line-clamp-1">
              {benefit.shortTitle}
            </h3>
          </div>

          {/* Center Graphic */}
          <div className="my-1.5">
            <BenefitMiniGraphic id={benefit.id} />
          </div>

          {/* Bottom Summary */}
          <div>
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-2.5">
              {benefit.summary}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-[#002C66] font-bold">
              <span>{benefit.highlightStat} • {benefit.highlightLabel}</span>
              <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 group-hover:text-[#002C66] transition-colors">
                <RotateCcw className="h-3 w-3" /> Flip
              </span>
            </div>
          </div>
        </div>

        {/* ── BACK SIDE (Recruiter Proof) ── */}
        <div className="absolute inset-0 h-full w-full rounded-2xl bg-[#002C66] text-white p-4 flex flex-col justify-between [transform:rotateY(180deg)] [backface-visibility:hidden] border border-[#002C66]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold bg-white text-[#002C66] px-2 py-0.5 rounded">
                Module {benefit.num}
              </span>
              <span className="text-[10px] font-medium text-white/70">Recruiter Proof</span>
            </div>
            <h4 className="text-sm font-extrabold font-display leading-snug text-white mb-2">
              {benefit.title}
            </h4>
            <p className="text-xs text-white/80 leading-relaxed mb-3">
              How recruiters verify this signal inside your dossier:
            </p>

            <div className="space-y-2">
              {benefit.proofPoints.map((pt) => (
                <div key={pt} className="flex items-start gap-1.5 text-[11px] text-white/90">
                  <span className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-white text-[#002C66]">
                    <Check className="h-2 w-2 stroke-[3]" />
                  </span>
                  <span className="leading-tight">{pt}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[11px]">
            <span className="inline-flex items-center gap-1 text-white/75 text-[10px]">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> 30-Layer Verified
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] text-white/80 underline font-semibold">
              <RotateCcw className="h-3 w-3" /> Flip back
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────────────────
   Main Career Intelligence Package Section Component
   ────────────────────────────────────────────────────────────────────────── */
interface Props {
  beforeCta?: ReactNode;
}

const CareerIntelligencePackageSection = ({ beforeCta }: Props) => {
  const [flippedMap, setFlippedMap] = useState<Record<string, boolean>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sampleDialogOpen, setSampleDialogOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 4 cards per page on desktop, 2 on tablet, 1 on mobile
  const totalCards = REPORT_BENEFITS.length;

  const toggleFlip = (id: string) => {
    setFlippedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalCards - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < totalCards - 1 ? prev + 1 : 0));
  };

  // Scroll smoothly when index changes
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      const cardWidth = el.scrollWidth / totalCards;
      el.scrollTo({
        left: currentIndex * cardWidth,
        behavior: "smooth",
      });
    }
  }, [currentIndex, totalCards]);

  return (
    <section
      id="cir-report"
      className="py-12 md:py-16 bg-[#FBF4EB] scroll-mt-20 border-y border-[#002C66]/10"
    >
      <div className="container px-4 md:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="max-w-2xl">
            <SectionBadge label="Career Intelligence Report (CIR)" icon={Sparkles} />
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-extrabold font-display leading-[1.15] text-slate-950 mt-3"
            >
              8 Essential Proofs Delivered in{" "}
              <span className="text-[#002C66]">One Report.</span>
            </motion.h2>
            <p className="text-slate-600 text-sm md:text-base mt-2 leading-relaxed">
              Every proctored assessment unlocks all 8 intelligence modules. Click or hover any card to inspect what recruiters see.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handlePrev}
              className="h-10 w-10 rounded-full border-[#002C66]/20 bg-white hover:bg-[#002C66]/5 text-[#002C66]"
              aria-label="Previous card"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="text-xs font-bold text-slate-600 min-w-[50px] text-center">
              {currentIndex + 1} / {totalCards}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="h-10 w-10 rounded-full border-[#002C66]/20 bg-white hover:bg-[#002C66]/5 text-[#002C66]"
              aria-label="Next card"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Quick-Jump Benefit Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {REPORT_BENEFITS.map((item, idx) => {
            const isActive = currentIndex === idx;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-[#002C66] text-white shadow-xs"
                    : "bg-white text-slate-700 border border-slate-200 hover:border-[#002C66]/40"
                }`}
              >
                <span className="font-extrabold mr-1">{item.num}</span> {item.shortTitle}
              </button>
            );
          })}
        </div>

        {/* ─── 8-Card Carousel Slider Container ─── */}
        <div
          ref={scrollRef}
          className="grid grid-flow-col auto-cols-[85%] sm:auto-cols-[48%] lg:auto-cols-[calc(25%-12px)] gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none"
        >
          {REPORT_BENEFITS.map((item) => (
            <div key={item.id} className="snap-start">
              <BenefitFlipCard
                benefit={item}
                isFlipped={Boolean(flippedMap[item.id])}
                onFlip={() => toggleFlip(item.id)}
              />
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {REPORT_BENEFITS.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === idx ? "w-6 bg-[#002C66]" : "w-2 bg-[#002C66]/25 hover:bg-[#002C66]/50"
              }`}
              aria-label={`Go to module ${item.num}`}
            />
          ))}
        </div>

        {beforeCta}

        {/* Compact, Clean CTA Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-[#002C66] px-6 py-5 text-white shadow-lg">
          <div className="text-center sm:text-left">
            <p className="text-base sm:text-lg font-extrabold font-display">
              Ready to unlock your 8-benefit Career Intelligence Report?
            </p>
            <p className="text-xs sm:text-sm text-white/80 mt-0.5">
              Included with every proctored assessment · 24-hr delivery · Verified credential
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSampleDialogOpen(true)}
              className="bg-transparent text-white border-white/30 hover:bg-white/10 hover:text-white font-bold h-11 px-5 rounded-xl text-xs sm:text-sm cursor-pointer"
            >
              <FileBarChart2 className="h-4 w-4" /> View Sample Report
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-white text-[#002C66] hover:bg-[#FBF4EB] gap-2 font-extrabold h-11 px-6 rounded-xl text-xs sm:text-sm shadow-xs"
            >
              <Link to="/assessments/digital-marketing-fundamentals">
                Get Report · ₹1,999 <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Sample CIR Viewer Dialog */}
      <Suspense fallback={null}>
        <SampleCirDialog
          open={sampleDialogOpen}
          onOpenChange={setSampleDialogOpen}
        />
      </Suspense>
    </section>
  );
};

export default CareerIntelligencePackageSection;
