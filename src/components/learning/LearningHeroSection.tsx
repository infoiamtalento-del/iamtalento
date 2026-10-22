import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Search,
  Play,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SectionBadge from "@/components/ui/section-badge";
import projectThumb from "@/assets/hands-on-project-thumb.jpg";

const popularTracks = [
  "AI & LLM Agents",
  "Full-Stack React",
  "Data Analytics",
  "Digital Marketing",
];

const LearningHeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-20 relative overflow-hidden bg-[#FBF4EB] border-b border-[#002C66]/10">
      <div className="container px-4 md:px-6">
        {/* Main 2-Column Hero Row — Top & Bottom Aligned */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column — Editorial Pitch & Interactive Search */}
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

              <h1 className="text-3xl sm:text-4xl xl:text-[44px] font-bold font-display tracking-tight text-slate-950 mb-4 leading-[1.25]">
                Learn from Experts.
                <br />
                <span className="text-[#002C66]">
                  Grow with AI.
                  <br />
                  Get Ahead.
                </span>
              </h1>

              <p className="text-base md:text-lg text-slate-600 mb-6 max-w-xl leading-relaxed">
                Master in-demand workflows through hands-on industry projects, regional language tracks, and 1-on-1 AI mentorship engineered to boost your verified readiness score.
              </p>
            </div>

            <div className="w-full">
              {/* Elevated Search & Command Bar */}
              <div className="w-full rounded-2xl bg-white p-2 border-2 border-[#002C66]/15 shadow-[0_16px_40px_-15px_rgba(0,44,102,0.12)] mb-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-1 flex items-center">
                    <Search className="ml-3.5 h-5 w-5 text-[#002C66] shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="What skill or role do you want to master?"
                      className="w-full h-12 px-3.5 bg-transparent text-sm md:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Link to="/learning#courses" className="w-full sm:w-auto">
                      <Button
                        size="lg"
                        className="w-full sm:w-auto h-12 px-6 rounded-xl bg-[#002C66] text-white hover:bg-[#00204d] font-bold gap-2 shadow-sm cursor-pointer"
                      >
                        Explore Courses <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Single-Line Popular Track Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mr-0.5">
                  Popular:
                </span>
                {popularTracks.map((track) => {
                  const isSelected = searchQuery === track;
                  return (
                    <button
                      key={track}
                      type="button"
                      onClick={() => setSearchQuery(isSelected ? "" : track)}
                      className={`text-xs font-semibold px-3 py-1 rounded-full border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#002C66] text-white border-[#002C66]"
                          : "bg-white text-slate-700 border-[#002C66]/15 hover:border-[#002C66]/40 hover:text-[#002C66]"
                      }`}
                    >
                      {track}
                    </button>
                  );
                })}
              </div>
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
