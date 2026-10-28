import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Check,
  GraduationCap,
  Layers,
  Play,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import SectionBadge from "@/components/ui/section-badge";

import video1 from "@/assets/product-in-60-sec.mp4.asset.json";
import video2 from "@/assets/plan-assessment.mp4.asset.json";
import video3 from "@/assets/plan-jobpost.mp4.asset.json";

import poster1 from "@/assets/hands-on-project-thumb.jpg";
import poster2 from "@/assets/step-proctoring.jpg";
import poster3 from "@/assets/step-opportunities.jpg";

const engines = [
  {
    id: "learn",
    step: "01",
    title: "LEARN",
    headline: "Learn. Grow. Excel.",
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
    title: "SKILL ASSESSMENT",
    headline: "Test Skills. Know Your Worth.",
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
    title: "GET HIRED",
    headline: "Get Seen. Get Hired.",
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
  const [playingId, setPlayingId] = useState<string | null>(null);

  return (
    <section className="py-20 md:py-28 bg-[#FBF4EB] text-slate-950 border-t border-slate-900/10">
      <div className="container">
        {/* ── Minimal Centered Section Heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12 md:mb-14"
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

        {/* ── Clean White 3-Card Corporate Grid with Gap ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7">
          {engines.map((engine, index) => {
            const Icon = engine.icon;
            const isPlaying = playingId === engine.id;

            return (
              <motion.article
                key={engine.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white text-slate-950 p-7 sm:p-8 shadow-[0_18px_50px_-24px_rgba(0,44,102,0.12)] hover:border-[#002C66]/35 hover:shadow-[0_24px_60px_-20px_rgba(0,44,102,0.18)] transition-all duration-300 overflow-hidden"
              >
                {/* Top Brand Navy Accent Line */}
                <span className="absolute top-0 left-0 right-0 h-1 bg-[#002C66]" />

                <div>
                  {/* Top Architectural Index Bar */}
                  <div className="flex items-center justify-between pb-5 mb-6 border-b border-slate-200/80">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold tracking-[0.2em] px-2.5 py-1 rounded bg-[#002C66] text-white">
                        {engine.step}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#002C66]">
                        {engine.title}
                      </span>
                    </div>

                    <span className="h-9 w-9 rounded-lg border border-slate-200 bg-[#FBF4EB] text-[#002C66] flex items-center justify-center">
                      <Icon className="h-4 w-4" />
                    </span>
                  </div>

                  {/* Headline */}
                  <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight leading-[1.2] text-slate-950 mb-5">
                    {engine.headline}
                  </h3>

                  {/* Minimal Corporate Video Frame */}
                  <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden mb-6 border border-slate-200 bg-slate-900">
                    {isPlaying ? (
                      <video
                        src={engine.videoUrl}
                        poster={engine.poster}
                        controls
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setPlayingId(engine.id)}
                        aria-label={`Play ${engine.title} video`}
                        className="group/vid relative block w-full h-full cursor-pointer"
                      >
                        <img
                          src={engine.poster}
                          alt={engine.headline}
                          className="w-full h-full object-cover object-center group-hover/vid:scale-[1.03] transition-transform duration-500"
                        />
                        <span className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/vid:bg-black/30 transition-colors">
                          <span className="h-12 w-12 rounded-full bg-white text-[#002C66] flex items-center justify-center shadow-lg ring-4 ring-white/25 group-hover/vid:scale-105 transition-transform">
                            <Play className="h-4 w-4 fill-current ml-0.5" />
                          </span>
                        </span>
                      </button>
                    )}
                  </div>

                  {/* Minimal 5-Point Ledger */}
                  <ul className="space-y-2.5 mb-7">
                    {engine.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-center gap-2.5 text-sm font-medium text-slate-700"
                      >
                        <Check className="h-4 w-4 shrink-0 text-[#002C66]" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Tagline + Minimal Corporate Link */}
                <div className="pt-5 border-t border-slate-200/80 flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold text-slate-500">
                    {engine.tagline}
                  </p>

                  <Link
                    to={engine.href}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#002C66] text-white hover:bg-[#00204d] px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-all shrink-0"
                  >
                    <span>{engine.cta}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* ── Minimal Corporate Bottom Bar ── */}
        <div className="mt-6 rounded-2xl border border-slate-200/90 bg-white px-7 py-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-center sm:text-left">
            <span className="font-display text-sm sm:text-base font-bold text-slate-950">
              One Ecosystem. Every Step Forward.
            </span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="text-xs sm:text-sm font-medium text-slate-600">
              Better Skills. Verified Potential. Smarter Hiring.
            </span>
          </div>

          <Link
            to="/assessments/explore"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#002C66] hover:underline shrink-0"
          >
            <span>Talent CIR: Where Skills Meet Opportunity</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TalentCirAdvantageSection;
