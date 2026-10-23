import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Layers, Play } from "lucide-react";
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
    tabLabel: "01 · LEARN",
    headline: "Turn Knowledge into Skills.",
    description:
      "Learn from industry experts, master in-demand skills, and gain the practical knowledge to thrive in the real world.",
    tagline: "Learn with purpose. Grow with confidence.",
    cta: "Explore Learning",
    href: "/learning",
    videoUrl: video1.url,
    poster: poster1,
  },
  {
    id: "assess",
    tabLabel: "02 · SKILL ASSESSMENT",
    headline: "Turn Your Skills into Proof.",
    description:
      "Get your CIR (Career Intelligence Report). Assess your skills, measure your industry readiness, discover skill gaps, and understand where you stand in today's competitive job market.",
    tagline: "Know your strengths. Prove your potential.",
    cta: "Take Skill Assessment",
    href: "/assessments/explore",
    videoUrl: video2.url,
    poster: poster2,
  },
  {
    id: "hire",
    tabLabel: "03 · GET HIRED",
    headline: "Turn Your Potential into Opportunity.",
    description:
      "Discover relevant jobs, showcase your assessed skills, and connect with employers looking for talent like you.",
    tagline: "Get discovered. Get shortlisted. Get hired.",
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

  const handleSelectTab = (idx: number) => {
    setActiveTab(idx);
    setIsPlaying(false);
  };

  return (
    <section className="py-20 md:py-28 bg-[#FBF4EB] text-slate-950 border-t border-slate-900/10">
      <div className="container px-4 md:px-6">
        {/* ── Top Centered Heading (Matching Reference Layout) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-14"
        >
          <SectionBadge label="THE TALENT CIR ADVANTAGE" icon={Layers} />

          <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-bold font-display tracking-tight leading-[1.15] text-slate-950 mb-3">
            India&apos;s Largest <span className="italic font-serif font-normal text-[#002C66]">Talent Ecosystem.</span>
          </h2>

          <p className="text-lg sm:text-xl font-display font-semibold text-slate-900 mb-3">
            Three Engines. One Journey. A World of Opportunity.
          </p>

          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            From learning in-demand skills to proving your industry readiness to landing the right opportunity, Talent CIR brings your entire career journey together in one intelligent ecosystem.
          </p>
        </motion.div>

        {/* ── Horizontal Underline Tab Bar (Exact Reference Style) ── */}
        <div className="max-w-6xl mx-auto">
          <div
            role="tablist"
            aria-label="Talent CIR Engines"
            className="grid grid-cols-1 sm:grid-cols-3 border-b border-slate-900/15 mb-6"
          >
            {engines.map((engine, index) => {
              const isSelected = activeTab === index;
              return (
                <button
                  key={engine.id}
                  role="tab"
                  type="button"
                  aria-selected={isSelected}
                  onClick={() => handleSelectTab(index)}
                  className={cn(
                    "relative py-4 px-4 text-center sm:text-left font-display text-sm sm:text-base md:text-lg transition-colors cursor-pointer",
                    isSelected
                      ? "font-bold text-slate-950"
                      : "font-medium text-slate-400 hover:text-slate-700"
                  )}
                >
                  <span>{engine.tabLabel}</span>
                  {isSelected && (
                    <motion.span
                      layoutId="talent-cir-tab-underline"
                      className="absolute bottom-[-1px] left-0 right-0 sm:right-auto sm:w-44 h-[2.5px] bg-[#002C66]"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Large Rounded Showcase Card (Copy Left + Video Right) ── */}
          <div className="rounded-[28px] bg-white border border-slate-200/90 p-7 sm:p-10 md:p-14 shadow-[0_22px_60px_-20px_rgba(0,44,102,0.12)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeEngine.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                {/* Left Column — Vertically Centered Bold Copy */}
                <div className="lg:col-span-6 text-left space-y-5">
                  <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-[#002C66]">
                    {activeEngine.tabLabel}
                  </span>

                  <h3 className="text-2xl sm:text-3xl md:text-[34px] font-bold font-display text-slate-950 leading-[1.2] tracking-tight">
                    {activeEngine.headline}
                  </h3>

                  <p className="text-base sm:text-lg font-medium text-slate-700 leading-relaxed">
                    {activeEngine.description}
                  </p>

                  <p className="font-display text-base sm:text-lg font-bold text-[#002C66] pt-1">
                    {activeEngine.tagline}
                  </p>

                  <div className="pt-2">
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
            Talent CIR connects the dots between what you learn, what you can prove, and where you can go next.
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
