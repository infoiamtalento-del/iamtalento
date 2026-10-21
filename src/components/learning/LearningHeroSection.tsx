import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Globe,
  Award,
  Cpu,
  CheckCircle2,
  Search,
  Play,
  Sparkles,
  Star,
  TrendingUp,
  Layers,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SectionBadge from "@/components/ui/section-badge";
import instructorPortrait from "@/assets/experts/female-1.jpg";
import mentorAvatar1 from "@/assets/experts/male-1.jpg";
import mentorAvatar2 from "@/assets/experts/female-2.jpg";
import mentorAvatar3 from "@/assets/experts/male-2.jpg";

const trustItems = [
  { icon: Globe, label: "5+ Languages", sub: "Learn in your native tongue" },
  { icon: Cpu, label: "Real Projects", sub: "Portfolio-ready capstones" },
  { icon: Award, label: "Verified Certificates", sub: "Synced to Skill Passport" },
  { icon: Sparkles, label: "AI-Powered", sub: "24/7 personalized AI mentor" },
];

const popularTracks = [
  "AI & LLM Agents",
  "Full-Stack React",
  "Data Analytics",
  "Performance Marketing",
];

const languages = ["English", "हिन्दी", "தமிழ்", "తెలుగు"];

const LearningHeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLang, setActiveLang] = useState("English");

  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden bg-[#FBF4EB] border-b border-[#002C66]/10">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column — Editorial Pitch & Interactive Search */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            <SectionBadge label="AI-Powered Learning Studio" icon={BookOpen} />

            <h1 className="text-4xl sm:text-5xl lg:text-[3.6rem] font-extrabold font-display tracking-tight text-slate-950 mb-5 leading-[1.08]">
              Learn Skills That{" "}
              <span className="text-[#002C66] underline decoration-[#002C66]/20 decoration-4 underline-offset-8">
                Get You Hired.
              </span>
            </h1>

            <p className="text-base md:text-lg text-slate-600 mb-7 max-w-2xl leading-relaxed">
              Master in-demand workflows through hands-on industry projects, regional language tracks, and 1-on-1 AI mentorship—engineered to directly boost your verified IRS readiness score.
            </p>

            {/* Elevated Search & Command Bar */}
            <div className="w-full max-w-2xl rounded-2xl bg-white p-2 border-2 border-[#002C66]/15 shadow-[0_16px_40px_-15px_rgba(0,44,102,0.12)] mb-4">
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
                      className="w-full sm:w-auto h-12 px-6 rounded-xl bg-[#002C66] text-white hover:bg-[#00204d] font-bold gap-2 shadow-sm"
                    >
                      Explore Courses <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Popular Track Pills */}
            <div className="flex flex-wrap items-center gap-2 mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-1">
                Popular Tracks:
              </span>
              {popularTracks.map((track) => {
                const isSelected = searchQuery === track;
                return (
                  <button
                    key={track}
                    type="button"
                    onClick={() => setSearchQuery(isSelected ? "" : track)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
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

            {/* Trust & Value Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
              {trustItems.map((t) => (
                <div
                  key={t.label}
                  className="rounded-xl bg-white border border-[#002C66]/12 p-3.5 shadow-[0_6px_20px_-10px_rgba(0,44,102,0.08)]"
                >
                  <div className="h-8 w-8 rounded-lg bg-[#002C66]/10 text-[#002C66] flex items-center justify-center mb-2">
                    <t.icon className="h-4 w-4" />
                  </div>
                  <p className="text-xs font-bold text-slate-900 leading-snug">{t.label}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{t.sub}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column — Interactive Learning Studio Bento Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div className="rounded-3xl bg-[#002C66] p-5 sm:p-6 text-white shadow-[0_24px_60px_-18px_rgba(0,44,102,0.35)] border border-[#002C66]">
              {/* Top Studio Header & Language Selector */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-white/15">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-white animate-pulse" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-white/90">
                    Interactive Course Studio
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-white/10 p-1 rounded-full">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setActiveLang(lang)}
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full transition-all ${
                        activeLang === lang
                          ? "bg-white text-[#002C66]"
                          : "text-white/75 hover:text-white"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inner Crisp White Featured Course Card */}
              <div className="rounded-2xl bg-white text-slate-900 p-4 sm:p-5 shadow-sm">
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-[#FBF4EB] border border-[#002C66]/15 shrink-0">
                    <img
                      src={instructorPortrait}
                      alt="Lead Instructor"
                      className="w-full h-full object-cover object-[center_12%]"
                    />
                    <div className="absolute bottom-1.5 right-1.5 h-7 w-7 rounded-full bg-[#002C66] text-white flex items-center justify-center shadow-md">
                      <Play className="h-3.5 w-3.5 fill-white ml-0.5" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FBF4EB] text-[#002C66] border border-[#002C66]/15">
                        Capstone Track
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#002C66]">
                        <Star className="h-3 w-3 fill-[#002C66] text-[#002C66]" /> 4.9 (4.2k)
                      </span>
                    </div>

                    <h3 className="font-display text-base sm:text-lg font-extrabold text-slate-950 leading-snug mb-1">
                      Full-Stack Product Engineering & AI Agents
                    </h3>

                    <p className="text-xs text-slate-500 font-medium mb-2.5">
                      Led by Dr. Ananya Krishnan • Audio in{" "}
                      <span className="font-bold text-[#002C66]">{activeLang}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-slate-600">
                      <span className="inline-flex items-center gap-1">
                        <Layers className="h-3.5 w-3.5 text-[#002C66]" /> 8 Real Projects
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-[#002C66]" /> 6 Weeks
                      </span>
                    </div>
                  </div>
                </div>

                {/* Live Module Progress Bar */}
                <div className="rounded-xl bg-[#FBF4EB] p-3 border border-[#002C66]/10 mb-4">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-900">
                      Module 6: Production RAG & API Deployment
                    </span>
                    <span className="font-extrabold text-[#002C66]">84%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#002C66]/15 overflow-hidden">
                    <div className="h-full w-[84%] rounded-full bg-[#002C66]" />
                  </div>
                </div>

                {/* Dual Career Outcome Strip */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="rounded-xl border border-[#002C66]/12 bg-white p-3 flex items-start gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-[#002C66] text-white flex items-center justify-center shrink-0">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-extrabold text-slate-900 leading-tight">
                        Verified Badge
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                        Auto-added to CIR Report
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#002C66]/12 bg-white p-3 flex items-start gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-[#FBF4EB] text-[#002C66] border border-[#002C66]/15 flex items-center justify-center shrink-0">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-extrabold text-[#002C66] leading-tight">
                        +18 IRS Score Boost
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                        3.4x higher shortlist rate
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Social Proof Footer inside Royal Navy Studio */}
              <div className="mt-4 pt-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex -space-x-2">
                    {[mentorAvatar1, mentorAvatar2, mentorAvatar3].map((av, idx) => (
                      <img
                        key={idx}
                        src={av}
                        alt="Active learner"
                        className="h-7 w-7 rounded-full object-cover object-top border-2 border-[#002C66]"
                      />
                    ))}
                  </div>
                  <p className="text-xs font-medium text-white/90">
                    <span className="font-bold text-white">24,800+</span> learners building job-ready portfolios
                  </p>
                </div>

                <Link
                  to="/learning#path"
                  className="text-xs font-bold text-white underline underline-offset-4 hover:text-white/80 shrink-0 inline-flex items-center gap-1"
                >
                  View Path <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LearningHeroSection;
