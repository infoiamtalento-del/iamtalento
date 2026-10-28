import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Bot,
  BellRing,
  Sparkles,
  Compass,
  BarChart3,
  Target,
  Wallet,
  Kanban,
  FileSearch,
  Mic,
  Handshake,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import SectionBadge from "@/components/ui/section-badge";

import resumeAiImg from "@/assets/resume-ai-builder.jpg";
import courseAiMlImg from "@/assets/course-ai-ml.jpg";
import stepOpportunitiesImg from "@/assets/step-opportunities.jpg";
import siGuideImg1 from "@/assets/si-guide-img-1.jpg";
import siGuideImg2 from "@/assets/si-guide-img-2.jpg";
import stepReportImg from "@/assets/step-report.jpg";
import bentoRankSearchImg from "@/assets/bento-rank-search.jpg";
import growthCard2Img from "@/assets/growth-card-2.jpg";
import stepApplyImg from "@/assets/step-apply.jpg";
import profileResumeParserImg from "@/assets/profile-resume-parser.jpg";
import mockInterview1Img from "@/assets/mock-interview-1.jpg";
import carouselSuccessImg from "@/assets/carousel-success.jpg";

interface CareerSuiteFeature {
  id: string;
  title: string;
  tagline: string;
  pill1: string;
  pill2: string;
  icon: LucideIcon;
  image: string;
  href: string;
}

const FEATURES: CareerSuiteFeature[] = [
  {
    id: "ai-resume-builder",
    title: "AI Resume Builder",
    tagline: "Build a Resume That Gets Noticed.",
    pill1: "Free Tool",
    pill2: "ATS Ready",
    icon: FileText,
    image: resumeAiImg,
    href: "/resources",
  },
  {
    id: "ai-tools-course",
    title: "AI Tools Course",
    tagline: "Master AI. Upgrade Your Career.",
    pill1: "25+ Modules",
    pill2: "Certified",
    icon: Bot,
    image: courseAiMlImg,
    href: "/learning/courses/ai-engineer-agentic-track",
  },
  {
    id: "ai-skill-upgrade-alerts",
    title: "AI Skill Upgrade Alerts",
    tagline: "Know What to Learn Next.",
    pill1: "Real-Time",
    pill2: "Market Pulse",
    icon: BellRing,
    image: stepOpportunitiesImg,
    href: "/learning",
  },
  {
    id: "ai-career-copilot",
    title: "AI Career Copilot",
    tagline: "Your AI Partner for Career Success.",
    pill1: "24/7 AI",
    pill2: "1:1 Guidance",
    icon: Sparkles,
    image: siGuideImg1,
    href: "/ai-guidance",
  },
  {
    id: "ai-career-path-finder",
    title: "AI Career Path Finder",
    tagline: "Discover Your Ideal Career Path.",
    pill1: "Role Fit",
    pill2: "Roadmap",
    icon: Compass,
    image: siGuideImg2,
    href: "/ai-guidance",
  },
  {
    id: "ai-skill-gap-analyzer",
    title: "AI Skill Gap Analyzer",
    tagline: "Identify Gaps. Build Skills. Get Hired.",
    pill1: "360° Audit",
    pill2: "CIR Synced",
    icon: BarChart3,
    image: stepReportImg,
    href: "/assessments/explore",
  },
  {
    id: "ai-job-match-score",
    title: "AI Job Match Score",
    tagline: "Know Your Fit Before You Apply.",
    pill1: "Instant %",
    pill2: "Verified Fit",
    icon: Target,
    image: bentoRankSearchImg,
    href: "/talento-pro",
  },
  {
    id: "ai-salary-predictor",
    title: "AI Salary Predictor",
    tagline: "Discover Your Market Worth.",
    pill1: "CTC Benchmark",
    pill2: "Live Data",
    icon: Wallet,
    image: growthCard2Img,
    href: "/ai-guidance",
  },
  {
    id: "ai-job-application-tracker",
    title: "AI Job Application Tracker",
    tagline: "Track Every Application. Stay Ahead.",
    pill1: "Live Status",
    pill2: "Smart Alerts",
    icon: Kanban,
    image: stepApplyImg,
    href: "/talento-pro?view=applied",
  },
  {
    id: "ai-job-description-decoder",
    title: "AI Job Description Decoder",
    tagline: "Understand Every Job Requirement.",
    pill1: "JD Breakdown",
    pill2: "Key Skills",
    icon: FileSearch,
    image: profileResumeParserImg,
    href: "/talento-pro",
  },
  {
    id: "ai-communication-coach",
    title: "AI Communication Coach",
    tagline: "Speak with Confidence. Stand Out.",
    pill1: "Voice AI",
    pill2: "Fluency",
    icon: Mic,
    image: mockInterview1Img,
    href: "/assessments/explore",
  },
  {
    id: "ai-salary-negotiation-coach",
    title: "AI Salary Negotiation Coach",
    tagline: "Negotiate Smarter. Earn Better.",
    pill1: "Offer Scripts",
    pill2: "Max CTC",
    icon: Handshake,
    image: carouselSuccessImg,
    href: "/ai-guidance",
  },
];

const AICareerSuiteSection = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const handleScroll = (direction: "prev" | "next") => {
    const container = scrollRef.current;
    if (!container) return;
    const cardWidth = 336; // 316px card + 20px gap
    container.scrollBy({
      left: direction === "next" ? cardWidth * 2 : -cardWidth * 2,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-16 md:py-24 bg-white border-y border-slate-200/70 overflow-hidden">
      <div className="container px-4 md:px-6">
        {/* Top Editorial Header Row with Left Heading + Right Prev/Next Circular Buttons */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12">
          <div className="max-w-2xl">
            <SectionBadge label="Elevate Your Career" icon={Sparkles} />
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="mt-2 text-3xl sm:text-4xl md:text-[42px] font-bold font-display tracking-tight leading-[1.12] text-slate-950"
            >
              Comprehensive AI Career Tools{" "}
              <br className="hidden sm:block" />
              <span className="text-[#002C66]">Built for Every Job Seeker</span>
            </motion.h2>
          </div>

          {/* Circular Arrow Controls Matching Reference */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => handleScroll("prev")}
              aria-label="Previous AI career tools"
              className="h-11 w-11 rounded-full bg-slate-950 text-white hover:bg-[#002C66] flex items-center justify-center transition-colors shadow-sm cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll("next")}
              aria-label="Next AI career tools"
              className="h-11 w-11 rounded-full bg-slate-950 text-white hover:bg-[#002C66] flex items-center justify-center transition-colors shadow-sm cursor-pointer"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Editorial Card Carousel Matching Reference Design */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            const isHighlighted = activeIndex === index;

            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.25) }}
                onMouseEnter={() => setActiveIndex(index)}
                className={`group snap-start shrink-0 w-[295px] sm:w-[316px] rounded-[28px] flex flex-col justify-between transition-colors duration-300 border ${
                  isHighlighted
                    ? "bg-[#002C66] text-white border-[#002C66] shadow-[0_20px_45px_-18px_rgba(0,44,102,0.38)]"
                    : "bg-[#F4F2EE] text-slate-950 border-slate-200/80 hover:border-[#002C66]/30"
                }`}
              >
                {/* Top Editorial Content Area */}
                <div className="p-6 pb-5">
                  {/* Top Row: Two White Pill Tags Left + Circular Icon Badge Right */}
                  <div className="flex items-center justify-between gap-2 mb-6">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-3 py-1 rounded-full bg-white text-slate-900 text-[11px] font-semibold tracking-tight shadow-2xs">
                        {feature.pill1}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white text-slate-900 text-[11px] font-semibold tracking-tight shadow-2xs">
                        {feature.pill2}
                      </span>
                    </div>

                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isHighlighted
                          ? "bg-white text-[#002C66]"
                          : "bg-slate-900/10 text-slate-800"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Bold 2-Line Editorial Title */}
                  <h3
                    className={`font-display text-2xl font-bold leading-[1.15] tracking-tight mb-2.5 min-h-[56px] ${
                      isHighlighted ? "text-white" : "text-slate-950"
                    }`}
                  >
                    {feature.title}
                  </h3>

                  {/* Short Tagline */}
                  <p
                    className={`text-xs sm:text-[13px] leading-relaxed font-medium min-h-[38px] ${
                      isHighlighted ? "text-white/85" : "text-slate-600"
                    }`}
                  >
                    {feature.tagline}
                  </p>
                </div>

                {/* Bottom Rounded Image Container Flush Inside Card */}
                <div className="relative h-[240px] w-full rounded-[24px] overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    loading="lazy"
                    className="h-full w-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Bottom-Left Frosted "Explore ->" Pill Button Matching Reference */}
                  <Link
                    to={feature.href}
                    className="absolute bottom-4 left-4 inline-flex items-center gap-2.5 pl-4 pr-1.5 py-1.5 rounded-full bg-slate-950/45 backdrop-blur-md border border-white/25 text-white text-xs font-semibold hover:bg-slate-950/75 transition-all"
                  >
                    <span>Explore</span>
                    <span className="h-7 w-7 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-xs group-hover:translate-x-0.5 transition-transform">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AICareerSuiteSection;
