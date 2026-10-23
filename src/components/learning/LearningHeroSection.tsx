import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CirclePlay,
  Play,
  Layers,
  ShieldCheck,
  Target,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SectionBadge from "@/components/ui/section-badge";
import projectThumb from "@/assets/hands-on-project-thumb.jpg";

const heroBenefits = [
  { icon: ShieldCheck, title: "AI Learning Courses", sub: "100+" },
  { icon: Target, title: "1:1 Doubt Clearing Mentors", sub: "500+" },
  { icon: TrendingUp, title: "Free AI Tool Courses", sub: "25+" },
];

const LearningHeroSection = () => {
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-20 relative overflow-hidden bg-[#FBF4EB] border-b border-[#002C66]/10">
      <div className="container px-4 md:px-6">
        {/* Main 2-Column Hero Row — Top & Bottom Aligned */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column — Editorial Pitch & Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-6 flex flex-col justify-between items-start text-left"
          >
            <div className="w-full">
              <div className="flex justify-start">
                <SectionBadge label="AI-Powered Learning Studio" icon={BookOpen} />
              </div>

              <h1 className="text-3xl sm:text-4xl xl:text-[44px] font-bold font-display tracking-tight text-slate-950 mb-4 leading-[1.38]">
                <span className="block">Learn from Experts.</span>
                <span className="block text-[#002C66] mt-1">Grow with AI.</span>
                <span className="block text-[#002C66] mt-1">Get Career-Ready.</span>
              </h1>

              <p className="text-base md:text-lg text-slate-600 mb-6 max-w-xl leading-relaxed">
                Learn practical skills from industry experts, get AI-powered learning support, and unlock one-on-one expert guidance to accelerate your career.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button
                  asChild
                  size="lg"
                  className="h-12 px-7 rounded-xl bg-[#002C66] text-white hover:bg-[#00204d] font-bold gap-2 shadow-sm cursor-pointer"
                >
                  <Link to="/learning#courses">
                    Explore Courses <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 px-6 rounded-xl bg-white border-[#002C66]/20 text-slate-900 hover:bg-white hover:border-[#002C66] hover:text-[#002C66] font-bold gap-2 cursor-pointer"
                >
                  <a href="#why-learners-choose-us">
                    <CirclePlay className="h-5 w-5 text-[#002C66]" /> How It Works
                  </a>
                </Button>
              </div>
            </div>

            <div className="w-full mt-7">
              <p className="text-[15px] leading-[1.55] text-slate-700">
                <span className="font-semibold text-[#002C66]">10,000+ Learners Certified.</span>{" "}
                <span className="font-semibold text-[#002C66]">500+ Top Employers</span> Trust Us to Upskill Their Teams.
              </p>

              <ul className="mt-6 pt-6 border-t border-slate-900/15 flex flex-wrap gap-y-3 gap-x-7">
                {heroBenefits.map((b, i) => {
                  const Icon = b.icon;
                  return (
                    <li key={i} className="flex items-start gap-2.5">
                      <Icon size={20} className="text-[#002C66] shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-sm font-semibold text-slate-950">
                          {b.title}
                        </strong>
                        <span className="block text-xs text-slate-500 mt-0.5">
                          {b.sub}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>

          {/* Right Column — Video Thumbnail Card Stretched Flush with Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-6 flex"
          >
            <div className="relative w-full rounded-2xl bg-[#002C66] overflow-hidden shadow-[0_24px_60px_-18px_rgba(0,44,102,0.3)] border border-[#002C66] flex flex-col sm:flex-row">
              {/* Left Blue Box — Compact & Balanced */}
              <div className="p-6 sm:p-7 flex flex-col justify-between sm:w-[42%] bg-[#002C66] shrink-0">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold text-white mb-4">
                    <Layers className="h-3.5 w-3.5" /> Real-Time Projects
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display leading-snug text-white mb-2.5">
                    Build Scalable Projects
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Apply every lesson with domain expert feedback.
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-6 pt-4">
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center cursor-pointer shrink-0"
                  >
                    <Play className="h-4 w-4 text-white fill-white ml-0.5" />
                  </motion.div>
                  <span className="text-xs font-semibold text-white/85">
                    Watch how it works
                  </span>
                </div>
              </div>

              {/* Right Video Thumbnail */}
              <div className="relative flex-1 min-h-[240px] sm:min-h-full">
                <img
                  src={projectThumb}
                  alt="Learner working on a real-world project"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <motion.div
                  whileHover={{ scale: 1.12 }}
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                >
                  <div className="h-14 w-14 rounded-full bg-white/95 flex items-center justify-center shadow-lg">
                    <Play className="h-5 w-5 text-[#002C66] fill-[#002C66] ml-0.5" />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LearningHeroSection;
