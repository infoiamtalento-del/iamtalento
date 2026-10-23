import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  GraduationCap,
  Layers,
  Play,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import SectionBadge from "@/components/ui/section-badge";
import { cn } from "@/lib/utils";

import video1 from "@/assets/product-in-60-sec.mp4.asset.json";
import video2 from "@/assets/plan-assessment.mp4.asset.json";
import video3 from "@/assets/plan-jobpost.mp4.asset.json";

import poster1 from "@/assets/hands-on-project-thumb.jpg";
import poster2 from "@/assets/step-proctoring.jpg";
import poster3 from "@/assets/step-opportunities.jpg";

import avatar1 from "@/assets/learner-ananya.jpg";
import avatar2 from "@/assets/learner-rahul.jpg";
import avatar3 from "@/assets/learner-priya.jpg";

const engines = [
  {
    id: "learn",
    step: "01",
    engineBadge: "ENGINE 01",
    title: "LEARN",
    tabLabel: "01 · LEARN",
    headline: "Learn Smarter. Level Up Faster.",
    icon: GraduationCap,
    points: [
      "Learn from the Experts",
      "Master In-Demand Skills",
      "Your AI Learning Companion",
      "Get Your Doubts Cleared, 1:1",
      "Everything You Need to Succeed",
    ],
    tagline: "Don't just learn. Become industry-ready.",
    cta: "Explore Learning",
    href: "/learning",
    videoUrl: video1.url,
    poster: poster1,
  },
  {
    id: "assess",
    step: "02",
    engineBadge: "ENGINE 02",
    title: "SKILL ASSESSMENT",
    tabLabel: "02 · SKILL ASSESSMENT",
    headline: "Know Your Skills. Prove Your Worth.",
    icon: ShieldCheck,
    points: [
      "AI-Powered Skill Tests",
      "Your Personal CIR Report",
      "Measure Your Industry Readiness",
      "Discover Your Skill Gaps",
      "Get Your Career Roadmap",
    ],
    tagline: "Stop guessing your potential. Start measuring it.",
    cta: "Take Skill Assessment",
    href: "/assessments/explore",
    videoUrl: video2.url,
    poster: poster2,
  },
  {
    id: "hire",
    step: "03",
    engineBadge: "ENGINE 03",
    title: "GET HIRED",
    tabLabel: "03 · GET HIRED",
    headline: "Get Discovered. Get Shortlisted. Get Hired.",
    icon: Briefcase,
    points: [
      "Find Jobs That Fit You",
      "Build a Resume That Stands Out",
      "Showcase Your Verified Skills",
      "Prepare to Ace Interviews",
      "Connect with Real Opportunities",
    ],
    tagline: "Your skills deserve the right opportunity.",
    cta: "Browse Jobs",
    href: "/jobs",
    videoUrl: video3.url,
    poster: poster3,
  },
];

const TalentCirAdvantageSection = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const activeEngine = engines[activeTab];
  const ActiveIcon = activeEngine.icon;

  const handleSelectTab = (idx: number) => {
    setActiveTab(idx);
    setIsPlaying(false);
  };

  return (
    <section className="py-20 md:py-28 bg-[#FBF4EB] text-slate-950 border-t border-slate-900/10">
      <div className="container">
        {/* ── Top Centered Heading (Matching Other Home Page Section Headings) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center max-w-2xl mx-auto mb-10 md:mb-12"
        >
          <SectionBadge label="The Talent CIR Advantage" icon={Layers} />

          <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight leading-[1.15] text-foreground mb-3">
            India&apos;s Largest{" "}
            <span className="text-primary">Talent Ecosystem.</span>
          </h2>

          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            Three Engines. One Journey. A World of Opportunity.
          </p>
        </motion.div>

        {/* ── Highlighted 3-Engine Selector Cards + Connected Showcase ── */}
        <div className="w-full">
          {/* 3 Prominent Engine Pillar Cards */}
          <div
            role="tablist"
            aria-label="Talent CIR Engines"
            className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-6"
          >
            {engines.map((engine, index) => {
              const isSelected = activeTab === index;
              const Icon = engine.icon;
              return (
                <button
                  key={engine.id}
                  role="tab"
                  type="button"
                  aria-selected={isSelected}
                  onClick={() => handleSelectTab(index)}
                  className={cn(
                    "group relative rounded-2xl p-5 sm:p-6 text-left transition-all duration-300 cursor-pointer border",
                    isSelected
                      ? "bg-[#002C66] text-white border-[#002C66] shadow-[0_20px_45px_-12px_rgba(0,44,102,0.38)] -translate-y-1"
                      : "bg-white text-slate-900 border-slate-200/90 hover:border-[#002C66]/40 hover:shadow-md hover:-translate-y-0.5"
                  )}
                >
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "h-11 w-11 rounded-xl flex items-center justify-center transition-colors",
                          isSelected
                            ? "bg-white text-[#002C66] shadow-sm"
                            : "bg-[#FBF4EB] text-[#002C66] group-hover:bg-[#002C66] group-hover:text-white"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <span
                          className={cn(
                            "block text-[11px] font-bold uppercase tracking-[0.2em]",
                            isSelected ? "text-white/75" : "text-[#002C66]"
                          )}
                        >
                          {engine.engineBadge}
                        </span>
                        <span
                          className={cn(
                            "block font-display text-lg sm:text-xl font-bold tracking-tight",
                            isSelected ? "text-white" : "text-slate-950"
                          )}
                        >
                          {engine.title}
                        </span>
                      </div>
                    </div>

                    <span
                      className={cn(
                        "font-display text-2xl sm:text-3xl font-extrabold leading-none select-none",
                        isSelected
                          ? "text-white/25"
                          : "text-slate-200 group-hover:text-[#002C66]/25"
                      )}
                    >
                      {engine.step}
                    </span>
                  </div>

                  <p
                    className={cn(
                      "text-xs sm:text-sm font-medium line-clamp-1",
                      isSelected ? "text-white/90" : "text-slate-600"
                    )}
                  >
                    {engine.headline}
                  </p>

                  {/* Active pointer notch */}
                  {isSelected && (
                    <span className="hidden md:block absolute -bottom-2 left-10 h-4 w-4 rotate-45 bg-[#002C66]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Large Rounded Showcase Card (Copy Left + Video Right) ── */}
          <div className="rounded-[28px] bg-white border border-slate-200/90 p-7 sm:p-10 md:p-14 shadow-[0_22px_60px_-20px_rgba(0,44,102,0.14)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeEngine.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                {/* Left Column — Highlighted Engine Header + 5 Feature Pills */}
                <div className="lg:col-span-6 text-left space-y-5">
                  <div className="inline-flex items-center gap-2.5 rounded-full bg-[#FBF4EB] border border-[#002C66]/15 px-3.5 py-1.5">
                    <span className="h-6 w-6 rounded-full bg-[#002C66] text-white text-[11px] font-bold flex items-center justify-center">
                      {activeEngine.step}
                    </span>
                    <ActiveIcon className="h-3.5 w-3.5 text-[#002C66]" />
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#002C66]">
                      {activeEngine.title}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl md:text-[36px] font-bold font-display text-slate-950 leading-[1.15] tracking-tight">
                    {activeEngine.headline}
                  </h3>

                  <ul className="grid grid-cols-1 gap-2.5 pt-1">
                    {activeEngine.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-center gap-3 rounded-xl bg-[#FBF4EB]/70 border border-slate-200/80 px-4 py-2.5 text-sm sm:text-base font-bold text-slate-900"
                      >
                        <CheckCircle2 className="h-5 w-5 text-[#002C66] shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="font-display text-base sm:text-lg font-bold text-[#002C66] pt-1">
                    {activeEngine.tagline}
                  </p>

                  <div className="pt-1">
                    <Link
                      to={activeEngine.href}
                      className="inline-flex items-center gap-2.5 rounded-xl bg-[#002C66] hover:bg-[#00204d] text-white px-6 py-3 text-sm font-bold shadow-sm transition-all"
                    >
                      <span>{activeEngine.cta}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                {/* Right Column — Video Player with Play Button Overlay */}
                <div className="lg:col-span-6">
                  <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-lg">
                    {isPlaying ? (
                      <video
                        key={activeEngine.videoUrl}
                        src={activeEngine.videoUrl}
                        poster={activeEngine.poster}
                        controls
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsPlaying(true)}
                        aria-label={`Play ${activeEngine.headline} video`}
                        className="group relative block w-full h-full cursor-pointer"
                      >
                        <img
                          src={activeEngine.poster}
                          alt={activeEngine.headline}
                          className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500"
                        />
                        <span className="absolute inset-0 flex items-center justify-center bg-black/15 group-hover:bg-black/25 transition-colors">
                          <span className="h-16 w-16 rounded-full bg-white/95 text-[#002C66] group-hover:bg-[#002C66] group-hover:text-white flex items-center justify-center shadow-xl ring-4 ring-white/30 group-hover:scale-110 transition-all duration-300">
                            <Play className="h-6 w-6 fill-current ml-0.5" />
                          </span>
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Centered Bottom Ecosystem Callout ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="mt-14 max-w-2xl mx-auto text-center"
        >
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#002C66] mb-2">
            Better Skills. Verified Potential. Smarter Hiring.
          </p>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 mb-2">
            One Ecosystem. Every Step Forward.
          </h3>
          <p className="text-sm font-semibold text-slate-800 mb-2">
            More than learning. More than assessment. More than a job portal.
          </p>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
            Talent CIR connects the dots between what you learn, what you can
            prove, and where you can go next.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/assessments/explore"
              className="group inline-flex items-center gap-4 rounded-full bg-[#002C66] hover:bg-[#00204d] text-white pl-6 pr-2 py-2 text-sm font-bold shadow-md transition-all"
            >
              <span>Talent CIR: Where Skills Meet Opportunity</span>
              <span className="h-9 w-9 rounded-full bg-white text-[#002C66] flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>

            <div className="flex items-center -space-x-2.5">
              <img
                src={avatar1}
                alt="Verified candidate"
                className="h-10 w-10 rounded-full object-cover ring-2 ring-[#FBF4EB]"
              />
              <img
                src={avatar2}
                alt="Verified candidate"
                className="h-10 w-10 rounded-full object-cover ring-2 ring-[#FBF4EB]"
              />
              <img
                src={avatar3}
                alt="Verified candidate"
                className="h-10 w-10 rounded-full object-cover ring-2 ring-[#FBF4EB]"
              />
              <span className="h-10 px-3 rounded-full bg-white border border-slate-200/90 text-[11px] font-bold text-[#002C66] flex items-center justify-center ring-2 ring-[#FBF4EB] shadow-xs">
                +10K
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TalentCirAdvantageSection;
