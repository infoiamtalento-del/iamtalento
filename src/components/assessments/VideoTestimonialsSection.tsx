import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  BadgeCheck,
  Sparkles,
  TrendingUp,
  Briefcase,
  CheckCircle2,
  Quote,
  Clock,
  Award,
  ArrowUpRight,
  RotateCcw,
} from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";
import { Link } from "react-router-dom";

import thumbRitika from "@/assets/podcast-studio-female.jpg";
import thumbAarav from "@/assets/podcast-studio-male.jpg";
import thumbRohan from "@/assets/carousel-candidate1.jpg";
import thumbSiddharth from "@/assets/mock-interview-3.jpg";
import thumbAnanya from "@/assets/experts/female-2.jpg";
import thumbVikram from "@/assets/experts/male-2.jpg";

type VideoTestimonial = {
  id: string;
  name: string;
  role: string;
  prevRole: string;
  company: string;
  city: string;
  irsScore: number;
  percentile: string;
  hike: string;
  timeToHire: string;
  duration: string;
  durationSec: number;
  thumbnail: string;
  category: "Tech & Engineering" | "Product & Growth" | "Data & AI" | "Freshers";
  headline: string;
  quote: string;
  captions: string[];
  keyTakeaways: string[];
};

const testimonials: VideoTestimonial[] = [
  {
    id: "ritika-swiggy",
    name: "Ritika Deshmukh",
    role: "Senior Growth Manager",
    prevRole: "Performance Marketing Specialist",
    company: "Swiggy",
    city: "Bengaluru",
    irsScore: 94,
    percentile: "Top 6%",
    hike: "+68% Salary Hike",
    timeToHire: "Hired in 14 Days",
    duration: "01:48",
    durationSec: 108,
    thumbnail: thumbRitika,
    category: "Product & Growth",
    headline: "“My 94/100 CIR report bypassed two screening rounds at Swiggy.”",
    quote:
      "I was applying to senior growth roles for months with zero callbacks. Once I attached my Verified CIR link, three hiring managers messaged me directly within a week — and I negotiated a 68% hike using the salary benchmark page.",
    captions: [
      "“Before Talento, my resume looked like every other marketer's...”",
      "“The 5-round proctored assessment tested real campaign scenarios and ROI modeling.”",
      "“When I scored 94/100 (Top 6%), Swiggy's hiring lead skipped the assignment round entirely.”",
    ],
    keyTakeaways: [
      "Skipped take-home case study round",
      "3 inbound recruiter invites in 7 days",
      "Moved from ₹11 LPA → ₹18.5 LPA",
    ],
  },
  {
    id: "aarav-razorpay",
    name: "Aarav Kulkarni",
    role: "Backend Engineer (SDE-2)",
    prevRole: "Associate Software Engineer",
    company: "Razorpay",
    city: "Bengaluru",
    irsScore: 92,
    percentile: "Top 9%",
    hike: "+75% Package Jump",
    timeToHire: "Hired in 18 Days",
    duration: "02:14",
    durationSec: 134,
    thumbnail: thumbAarav,
    category: "Tech & Engineering",
    headline: "“From a Tier-3 college to Razorpay SDE-2 — proof beat pedigree.”",
    quote:
      "Coming from a non-IIT background, resume filters always screened me out. My Verified Badge put me at the top of Razorpay's shortlist because my system design and API scores were already AI-proctored and verified.",
    captions: [
      "“Resume filters used to reject me in seconds because of my college tier.”",
      "“Talento's CIR report gave me an objective 92/100 score in Backend & System Design.”",
      "“Recruiters trusted the 30-layer proctored badge immediately — I got 4 interview calls.”",
    ],
    keyTakeaways: [
      "Overcame Tier-3 college resume bias",
      "Scored 95/100 in System Design round",
      "4 product-company offers in 3 weeks",
    ],
  },
  {
    id: "ananya-flipkart",
    name: "Ananya Nair",
    role: "Data Scientist",
    prevRole: "BI Analyst",
    company: "Flipkart",
    city: "Hyderabad",
    irsScore: 91,
    percentile: "Top 11%",
    hike: "+62% Salary Hike",
    timeToHire: "Hired in 21 Days",
    duration: "01:56",
    durationSec: 116,
    thumbnail: thumbAnanya,
    category: "Data & AI",
    headline: "“The skill-gap diagnostic told me the exact 2 topics to fix before interviewing.”",
    quote:
      "My first diagnostic showed I was strong in SQL and Python but below benchmark in ML deployment. I used the 30-day roadmap to close that gap, unlocked my Verified Badge, and cracked Flipkart on my first attempt.",
    captions: [
      "“I wanted to pivot from BI reporting into core Data Science.”",
      "“The CIR gap analysis pinpointed my exact weak spots in feature engineering.”",
      "“Two weeks after earning my Verified Badge, I signed my Flipkart offer letter.”",
    ],
    keyTakeaways: [
      "Pivoted from BI Analyst to Data Scientist",
      "Improved readiness score by +21 pts",
      "Direct shortlist with Flipkart Data team",
    ],
  },
  {
    id: "rohan-zoho",
    name: "Rohan Verma",
    role: "Full-Stack Developer",
    prevRole: "2025 CS Graduate (Fresher)",
    company: "Zoho",
    city: "Chennai",
    irsScore: 89,
    percentile: "Top 14%",
    hike: "₹12 LPA First Offer",
    timeToHire: "Hired in 11 Days",
    duration: "01:35",
    durationSec: 95,
    thumbnail: thumbRohan,
    category: "Freshers",
    headline: "“As a fresher with zero work experience, my CIR score was my experience.”",
    quote:
      "Every job post asked for 1–2 years of experience. Sharing my verified 89/100 readiness report proved I could write production-ready React and Node code better than many experienced applicants.",
    captions: [
      "“Fresh graduates get ignored when applying through regular job boards.”",
      "“My verified CIR report showed employers my real coding and debugging percentile.”",
      "“I landed a ₹12 LPA full-stack offer within 11 days of getting certified.”",
    ],
    keyTakeaways: [
      "Hired as a fresher without prior internship",
      "Ranked Top 14% nationally in Full-Stack",
      "Fast-tracked straight to final tech round",
    ],
  },
  {
    id: "siddharth-atlassian",
    name: "Siddharth Menon",
    role: "Cloud & DevOps Engineer",
    prevRole: "Systems Administrator",
    company: "Atlassian",
    city: "Pune",
    irsScore: 95,
    percentile: "Top 4%",
    hike: "+82% Salary Hike",
    timeToHire: "Hired in 16 Days",
    duration: "02:05",
    durationSec: 125,
    thumbnail: thumbSiddharth,
    category: "Tech & Engineering",
    headline: "“Recruiters stopped asking if I had hands-on Kubernetes experience.”",
    quote:
      "Transitioning from legacy sysadmin work to modern DevOps was tough until I took the Cloud Architecture assessment. Hitting the Top 4% gave me instant authority in every hiring manager conversation.",
    captions: [
      "“I needed a credible way to prove my Kubernetes and Terraform skills.”",
      "“Scoring 95/100 put my profile at the very top of recruiter search results.”",
      "“I received an 82% compensation jump moving into a remote Cloud Engineer role.”",
    ],
    keyTakeaways: [
      "Top 4% score in Cloud & CI/CD track",
      "3x profile views in first 72 hours",
      "Remote offer with +82% package hike",
    ],
  },
  {
    id: "vikram-deloitte",
    name: "Vikramaditya Rao",
    role: "Product Strategy Consultant",
    prevRole: "Operations Associate",
    company: "Deloitte",
    city: "Mumbai",
    irsScore: 90,
    percentile: "Top 12%",
    hike: "+58% Salary Hike",
    timeToHire: "Hired in 19 Days",
    duration: "01:42",
    durationSec: 102,
    thumbnail: thumbVikram,
    category: "Product & Growth",
    headline: "“The 4 core rounds + domain test validated my analytical leadership.”",
    quote:
      "Consulting firms care deeply about structured problem solving and communication. Having verified 90+ scores across Analytical Reasoning, Workplace Communication, and Product Strategy made my application stand out immediately.",
    captions: [
      "“The 4 mandatory core rounds proved my executive communication and logic.”",
      "“My interviewer actually pulled up my CIR radar chart during the final round!”",
      "“Closed a 58% salary increase and moved into strategy consulting.”",
    ],
    keyTakeaways: [
      "93/100 in Analytical & Problem Solving",
      "CIR report reviewed live in final interview",
      "Transitioned from Ops to Strategy",
    ],
  },
];

const VideoTestimonialsSection = () => {
  const [activeId, setActiveId] = useState<string>(testimonials[0].id);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(18);

  const activeVideo = testimonials.find((t) => t.id === activeId) || testimonials[0];

  // Reset playback state when switching videos
  const handleSelectVideo = (id: string, autoPlay = true) => {
    setActiveId(id);
    setProgress(0);
    setIsPlaying(autoPlay);
  };

  // Simulated smooth playback timer when playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsPlaying(false);
          return 100;
        }
        return prev + 1;
      });
    }, 250);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const captionIndex = Math.min(
    activeVideo.captions.length - 1,
    Math.floor((progress / 100) * activeVideo.captions.length)
  );

  const currentSeconds = Math.floor((progress / 100) * activeVideo.durationSec);
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `0${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <section className="py-16 md:py-24 bg-[#FBF4EB]">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-14">
          <SectionBadge label="Video Testimonials" icon={Play} />
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mt-3 mb-4 text-slate-900"
          >
            Watch How Verified Talent
            <br />
            <span className="text-[#002C66]">Turned Scores Into Offers</span>
          </motion.h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Real candidates share how their Career Intelligence Report (CIR) and Verified Badge
            <br className="hidden md:block" />
            helped them bypass resume filters and negotiate higher compensation.
          </p>
        </div>

        {/* ─── Featured Interactive Video Spotlight (12-Col Split) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6 lg:p-7 shadow-sm mb-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* Left 7 Cols: Interactive Cinema Thumbnail & Player */}
            <div className="lg:col-span-7 flex flex-col">
              <div
                onClick={() => setIsPlaying((p) => !p)}
                className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-slate-950 border border-slate-200/80 cursor-pointer group select-none"
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeVideo.id}
                    src={activeVideo.thumbnail}
                    alt={activeVideo.name}
                    initial={{ opacity: 0.4, scale: 1.03 }}
                    animate={{
                      opacity: 1,
                      scale: isPlaying ? 1.04 : 1,
                    }}
                    transition={{ duration: 0.6 }}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                </AnimatePresence>

                {/* Top Overlay Bar: Verified Score + Duration */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#002C66] px-3.5 py-1.5 text-white shadow-md">
                    <BadgeCheck className="h-4 w-4 text-amber-300 shrink-0" />
                    <span className="text-xs font-bold tracking-wide">
                      Verified CIR: {activeVideo.irsScore}/100 ({activeVideo.percentile})
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/85 px-3 py-1.5 text-xs font-bold text-white">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isPlaying ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                      }`}
                    />
                    {isPlaying
                      ? `${formatTime(currentSeconds)} / ${activeVideo.duration}`
                      : activeVideo.duration}
                  </div>
                </div>

                {/* Center Play/Pause Button */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div
                    className={`flex items-center justify-center rounded-full transition-all duration-300 shadow-2xl ${
                      isPlaying
                        ? "h-14 w-14 bg-slate-950/70 text-white opacity-0 group-hover:opacity-100"
                        : "h-16 w-16 sm:h-20 sm:w-20 bg-white text-[#002C66] group-hover:scale-110 group-hover:bg-[#002C66] group-hover:text-white ring-8 ring-white/25"
                    }`}
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6 fill-current" />
                    ) : (
                      <Play className="h-7 w-7 sm:h-8 sm:w-8 fill-current ml-1" />
                    )}
                  </div>
                </div>

                {/* Bottom Caption & Controls Bar */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-3 left-3 right-3 rounded-xl bg-slate-950/85 backdrop-blur-md p-3.5 text-white z-10 border border-white/10"
                >
                  {/* Live Subtitle Caption */}
                  <p className="text-xs sm:text-sm font-medium text-white/95 mb-2.5 line-clamp-1">
                    {activeVideo.captions[captionIndex]}
                  </p>

                  {/* Scrubber + Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsPlaying((p) => !p)}
                      className="h-7 w-7 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors shrink-0"
                      aria-label={isPlaying ? "Pause video" : "Play video"}
                    >
                      {isPlaying ? (
                        <Pause className="h-3.5 w-3.5 fill-current" />
                      ) : (
                        <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
                      )}
                    </button>

                    {/* Progress bar */}
                    <div
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickX = e.clientX - rect.left;
                        const pct = Math.max(0, Math.min(100, Math.round((clickX / rect.width) * 100)));
                        setProgress(pct);
                      }}
                      className="flex-1 h-2 rounded-full bg-white/20 overflow-hidden cursor-pointer"
                    >
                      <div
                        className="h-full rounded-full bg-amber-400 transition-all duration-200"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setProgress(0);
                        setIsPlaying(true);
                      }}
                      className="h-7 w-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors shrink-0"
                      aria-label="Replay"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsMuted((m) => !m)}
                      className="h-7 w-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors shrink-0"
                      aria-label={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? (
                        <VolumeX className="h-3.5 w-3.5" />
                      ) : (
                        <Volume2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Candidate Story & Verified Outcome Breakdown */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                {/* Category + Outcome Pills */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#002C66]/10 px-3 py-1 text-xs font-bold text-[#002C66]">
                    <Sparkles className="h-3.5 w-3.5" /> {activeVideo.category}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-extrabold text-emerald-700">
                    <TrendingUp className="h-3.5 w-3.5" /> {activeVideo.hike}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-1 text-[11px] font-bold text-amber-800">
                    <Clock className="h-3 w-3" /> {activeVideo.timeToHire}
                  </span>
                </div>

                {/* Quote Headline */}
                <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 leading-snug mb-3">
                  {activeVideo.headline}
                </h3>

                {/* Full Story Quote */}
                <div className="relative rounded-2xl bg-[#FBF4EB]/70 border border-slate-200/80 p-4 mb-5">
                  <Quote className="h-4 w-4 text-[#002C66]/30 mb-1.5" />
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {activeVideo.quote}
                  </p>
                </div>

                {/* Key Verified Outcomes */}
                <div className="space-y-2 mb-5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Verified Report Impact
                  </p>
                  {activeVideo.keyTakeaways.map((point) => (
                    <div key={point} className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-slate-800">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Candidate Profile Footer Card */}
              <div className="rounded-2xl bg-[#002C66] text-white p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={activeVideo.thumbnail}
                    alt={activeVideo.name}
                    className="h-12 w-12 rounded-xl object-cover object-top border-2 border-white/20 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-white truncate">{activeVideo.name}</p>
                      <BadgeCheck className="h-4 w-4 text-amber-300 shrink-0" />
                    </div>
                    <p className="text-xs text-white/80 truncate">
                      {activeVideo.role} @ <span className="font-bold text-white">{activeVideo.company}</span>
                    </p>
                    <p className="text-[11px] text-white/60 truncate">
                      Previously: {activeVideo.prevRole} · {activeVideo.city}
                    </p>
                  </div>
                </div>

                <Link
                  to="/assessments/explore"
                  className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-extrabold text-[#002C66] hover:bg-slate-100 transition-colors"
                >
                  Take Test <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Thumbnail Grid (6 Video Cards — 3 cols on lg, 2 on sm) ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((item, i) => {
            const isSelected = item.id === activeVideo.id;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                onClick={() => handleSelectVideo(item.id, true)}
                className={`group rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer flex flex-col ${
                  isSelected
                    ? "bg-white border-[#002C66] ring-2 ring-[#002C66]/15 shadow-md -translate-y-0.5"
                    : "bg-white border-slate-200/90 hover:border-[#002C66]/40 hover:shadow-md hover:-translate-y-1"
                }`}
              >
                {/* Video Thumbnail Container */}
                <div className="relative h-52 overflow-hidden bg-slate-900">
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#002C66]/95 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs">
                      <Award className="h-3 w-3 text-amber-300" /> IRS {item.irsScore}/100
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-950/80 px-2 py-0.5 text-[11px] font-bold text-white tabular-nums">
                      {item.duration}
                    </span>
                  </div>

                  {/* Center Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className={`h-12 w-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                        isSelected && isPlaying
                          ? "bg-[#002C66] text-white scale-105 ring-4 ring-white/40"
                          : "bg-white/95 text-[#002C66] group-hover:bg-[#002C66] group-hover:text-white group-hover:scale-110"
                      }`}
                    >
                      {isSelected && isPlaying ? (
                        <Pause className="h-5 w-5 fill-current" />
                      ) : (
                        <Play className="h-5 w-5 fill-current ml-0.5" />
                      )}
                    </div>
                  </div>

                  {/* Bottom Outcome Bar on Thumbnail */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 rounded-xl bg-slate-950/80 backdrop-blur-xs px-3 py-2 flex items-center justify-between gap-2 text-white">
                    <span className="text-[11px] font-bold truncate flex items-center gap-1.5">
                      <Briefcase className="h-3 w-3 text-amber-300 shrink-0" />
                      {item.role} @ {item.company}
                    </span>
                    <span className="text-[10px] font-extrabold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full shrink-0">
                      {item.hike}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-sm font-bold font-display text-slate-900 leading-snug line-clamp-2 group-hover:text-[#002C66] transition-colors mb-3">
                      {item.headline}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={item.thumbnail}
                        alt={item.name}
                        className="h-8 w-8 rounded-full object-cover object-top border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate flex items-center gap-1">
                          {item.name}
                          <BadgeCheck className="h-3.5 w-3.5 text-[#002C66] shrink-0" />
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {item.city} · {item.timeToHire}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-extrabold inline-flex items-center gap-1 shrink-0 ${
                        isSelected ? "text-[#002C66]" : "text-slate-500 group-hover:text-[#002C66]"
                      }`}
                    >
                      {isSelected && isPlaying ? "Playing" : "Watch"}
                      <Play className="h-3 w-3 fill-current" />
                    </span>
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

export default VideoTestimonialsSection;
