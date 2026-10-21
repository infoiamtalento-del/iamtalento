import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  BadgeCheck,
  TrendingUp,
  Clock,
  Award,
  ArrowUpRight,
  RotateCcw,
} from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Link } from "react-router-dom";

import thumbRitika from "@/assets/podcast-studio-female.jpg";
import thumbAarav from "@/assets/podcast-studio-male.jpg";
import thumbAnanya from "@/assets/experts/female-2.jpg";
import thumbVikram from "@/assets/experts/male-2.jpg";

type VideoTestimonial = {
  id: string;
  name: string;
  role: string;
  prevRole: string;
  company: "Swiggy" | "Razorpay" | "Flipkart" | "Deloitte";
  city: string;
  irsScore: number;
  percentile: string;
  hike: string;
  timeToHire: string;
  duration: string;
  durationSec: number;
  thumbnail: string;
  objectPosition: string;
  category: string;
  quote: string;
  captions: string[];
  keyTakeaways: string[];
};

const CompanyLogo = ({ company }: { company: VideoTestimonial["company"] }) => {
  switch (company) {
    case "Swiggy":
      return (
        <svg viewBox="0 0 120 30" className="h-4 w-auto" aria-label="Swiggy">
          <path
            d="M14 3C9.6 3 6 6.5 6 10.9c0 5.4 8 15.1 8 15.1s8-9.7 8-15.1C22 6.5 18.4 3 14 3zm0 10.5c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z"
            fill="#FC8019"
          />
          <text
            x="27"
            y="20.5"
            fill="#FC8019"
            fontSize="17"
            fontWeight="800"
            fontFamily="Inter, system-ui, sans-serif"
            letterSpacing="-0.02em"
          >
            SWIGGY
          </text>
        </svg>
      );

    case "Razorpay":
      return (
        <svg viewBox="0 0 138 30" className="h-4 w-auto" aria-label="Razorpay">
          <path d="M13 4L6 25h6.5l7-21H13z" fill="#3395FF" />
          <path d="M19.5 10L14 25h6.5l5.5-15h-6.5z" fill="#072654" />
          <text
            x="30"
            y="20.5"
            fill="#072654"
            fontSize="17"
            fontWeight="800"
            fontFamily="Inter, system-ui, sans-serif"
            letterSpacing="-0.02em"
          >
            Razorpay
          </text>
        </svg>
      );

    case "Flipkart":
      return (
        <svg viewBox="0 0 128 30" className="h-4 w-auto" aria-label="Flipkart">
          <rect x="4" y="5" width="20" height="20" rx="4" fill="#2874F0" />
          <path
            d="M10 11h9l-1.2 7.5H11L10 11z"
            fill="#FFE500"
          />
          <path
            d="M11.5 11V9.5a2.5 2.5 0 0 1 5 0V11"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.5"
          />
          <text
            x="30"
            y="20.5"
            fill="#2874F0"
            fontSize="17"
            fontWeight="800"
            fontStyle="italic"
            fontFamily="Inter, system-ui, sans-serif"
            letterSpacing="-0.02em"
          >
            Flipkart
          </text>
        </svg>
      );

    case "Deloitte":
      return (
        <svg viewBox="0 0 118 30" className="h-4 w-auto" aria-label="Deloitte">
          <text
            x="4"
            y="21"
            fill="#0F172A"
            fontSize="19"
            fontWeight="800"
            fontFamily="Inter, system-ui, sans-serif"
            letterSpacing="-0.03em"
          >
            Deloitte
          </text>
          <circle cx="83" cy="18.5" r="3.2" fill="#86BC25" />
        </svg>
      );
  }
};

const testimonials: VideoTestimonial[] = [
  {
    id: "ritika-swiggy",
    name: "Ritika Deshmukh",
    role: "Senior Growth Manager",
    prevRole: "Performance Marketer",
    company: "Swiggy",
    city: "Bengaluru",
    irsScore: 94,
    percentile: "Top 6%",
    hike: "68% Salary Hike",
    timeToHire: "Hired in 14 Days",
    duration: "01:48",
    durationSec: 108,
    thumbnail: thumbRitika,
    objectPosition: "center 12%",
    category: "Product & Growth",
    quote:
      "I was applying to senior growth roles for months with zero callbacks. Once I attached my Verified CIR link, three hiring managers messaged me directly within a week — and I negotiated a 68% hike using the salary benchmark report.",
    captions: [
      "Before Talento, my resume looked like every other marketer's...",
      "The 5-round proctored assessment tested real campaign scenarios and ROI modeling.",
      "When I scored 94/100 (Top 6%), Swiggy's hiring lead skipped the assignment round entirely.",
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
    hike: "75% Package Jump",
    timeToHire: "Hired in 18 Days",
    duration: "02:14",
    durationSec: 134,
    thumbnail: thumbAarav,
    objectPosition: "center 10%",
    category: "Tech & Engineering",
    quote:
      "Coming from a non-IIT background, resume filters always screened me out. My Verified Badge put me at the top of Razorpay's shortlist because my system design and API scores were already AI-proctored and verified.",
    captions: [
      "Resume filters used to reject me in seconds because of my college tier.",
      "Talento's CIR report gave me an objective 92/100 score in Backend & System Design.",
      "Recruiters trusted the 30-layer proctored badge immediately — I got 4 interview calls.",
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
    hike: "62% Salary Hike",
    timeToHire: "Hired in 21 Days",
    duration: "01:56",
    durationSec: 116,
    thumbnail: thumbAnanya,
    objectPosition: "center 8%",
    category: "Data & AI",
    quote:
      "My first diagnostic showed I was strong in SQL and Python but below benchmark in ML deployment. I used the 30-day roadmap to close that gap, unlocked my Verified Badge, and cracked Flipkart on my first attempt.",
    captions: [
      "I wanted to pivot from BI reporting into core Data Science.",
      "The CIR gap analysis pinpointed my exact weak spots in feature engineering.",
      "Two weeks after earning my Verified Badge, I signed my Flipkart offer letter.",
    ],
    keyTakeaways: [
      "Pivoted from BI Analyst to Data Scientist",
      "Improved readiness score by +21 pts",
      "Direct shortlist with Flipkart Data team",
    ],
  },
  {
    id: "vikram-deloitte",
    name: "Vikramaditya Rao",
    role: "Strategy Consultant",
    prevRole: "Operations Associate",
    company: "Deloitte",
    city: "Mumbai",
    irsScore: 90,
    percentile: "Top 12%",
    hike: "58% Salary Hike",
    timeToHire: "Hired in 19 Days",
    duration: "01:42",
    durationSec: 102,
    thumbnail: thumbVikram,
    objectPosition: "center 8%",
    category: "Strategy & Ops",
    quote:
      "Consulting firms care deeply about structured problem solving and communication. Having verified 90+ scores across Analytical Reasoning, Workplace Communication, and Product Strategy made my application stand out immediately.",
    captions: [
      "The 4 mandatory core rounds proved my executive communication and logic.",
      "My interviewer actually pulled up my CIR radar chart during the final round!",
      "Closed a 58% salary increase and moved into strategy consulting.",
    ],
    keyTakeaways: [
      "93/100 in Analytical & Problem Solving",
      "CIR report reviewed live in final interview",
      "Transitioned from Ops to Strategy",
    ],
  },
];

const VideoTestimonialsSection = () => {
  const [selectedVideo, setSelectedVideo] = useState<VideoTestimonial | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(22);

  const handleOpenVideo = (video: VideoTestimonial) => {
    setSelectedVideo(video);
    setProgress(0);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!isPlaying || !selectedVideo) return;
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
  }, [isPlaying, selectedVideo]);

  const captionIndex = selectedVideo
    ? Math.min(
        selectedVideo.captions.length - 1,
        Math.floor((progress / 100) * selectedVideo.captions.length)
      )
    : 0;

  const currentSeconds = selectedVideo
    ? Math.floor((progress / 100) * selectedVideo.durationSec)
    : 0;

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
          <p
            className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto text-center"
            style={{ textWrap: "balance" }}
          >
            Real candidates share how their Career Intelligence Report (CIR) and Verified Badge helped them bypass resume filters and negotiate higher compensation.
          </p>
        </div>

        {/* ─── 4-Column Uncropped Video Thumbnail Cards ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              onClick={() => handleOpenVideo(item)}
              className="group rounded-2xl overflow-hidden border border-slate-200/90 bg-white hover:border-[#002C66]/40 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
            >
              {/* Uncropped Square/Portrait Thumbnail Container */}
              <div className="relative aspect-[4/3.7] overflow-hidden bg-[#FBF4EB]">
                <img
                  src={item.thumbnail}
                  alt={item.name}
                  style={{ objectPosition: item.objectPosition }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Small Duration Pill Only in Bottom-Right of Image */}
                <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-md bg-[#002C66]/90 px-2 py-0.5 text-[11px] font-bold text-white tabular-nums shadow-xs">
                  {item.duration}
                </span>

                {/* Center Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 bg-white/95 text-[#002C66] group-hover:bg-[#002C66] group-hover:text-white group-hover:scale-110">
                    <Play className="h-5 w-5 fill-current ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Clean Minimal Card Body — Logo in Corner */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                {/* Top Row: Scores on Left, Minimal Company Logo in Corner */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="inline-flex items-center rounded-md bg-[#002C66]/8 px-2 py-0.5 text-[10.5px] font-bold text-[#002C66] shrink-0">
                      IRS {item.irsScore}/100
                    </span>
                    <span className="inline-flex items-center rounded-md bg-[#FBF4EB] border border-[#002C66]/15 px-2 py-0.5 text-[10.5px] font-bold text-[#002C66] truncate">
                      {item.hike}
                    </span>
                  </div>

                  <div className="shrink-0">
                    <CompanyLogo company={item.company} />
                  </div>
                </div>

                {/* Bottom Row: Candidate Info + Watch Button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate flex items-center gap-1">
                      {item.name}
                      <BadgeCheck className="h-3.5 w-3.5 text-[#002C66] shrink-0" />
                    </p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {item.role}
                    </p>
                  </div>

                  <span className="text-[11px] font-extrabold inline-flex items-center gap-1 shrink-0 px-2.5 py-1 rounded-lg transition-colors bg-[#FBF4EB] text-[#002C66] group-hover:bg-[#002C66] group-hover:text-white">
                    Watch <Play className="h-2.5 w-2.5 fill-current ml-0.5" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Video Playback Modal */}
        <Dialog open={selectedVideo !== null} onOpenChange={(open) => !open && setSelectedVideo(null)}>
          <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-3xl bg-white border border-slate-200">
            {selectedVideo && (
              <div>
                <div className="relative w-full aspect-video bg-[#002C66] overflow-hidden">
                  <img
                    src={selectedVideo.thumbnail}
                    alt={selectedVideo.name}
                    style={{ objectPosition: selectedVideo.objectPosition }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                  {/* Top bar with time indicator */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-[#002C66]/90 px-3 py-1 text-xs font-bold text-white shadow-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      {isPlaying
                        ? `${formatTime(currentSeconds)} / ${selectedVideo.duration}`
                        : selectedVideo.duration}
                    </div>
                  </div>

                  {/* Center Play/Pause button */}
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <button
                      type="button"
                      onClick={() => setIsPlaying((p) => !p)}
                      className="h-16 w-16 rounded-full bg-white/95 text-[#002C66] hover:bg-[#002C66] hover:text-white flex items-center justify-center shadow-xl transition-all ring-8 ring-white/30"
                    >
                      {isPlaying ? (
                        <Pause className="h-7 w-7 fill-current" />
                      ) : (
                        <Play className="h-7 w-7 fill-current ml-0.5" />
                      )}
                    </button>
                  </div>

                  {/* Bottom Controls Bar */}
                  <div className="absolute bottom-3 left-4 right-4 rounded-xl bg-[#002C66]/95 backdrop-blur-md p-3 text-white z-10 border border-white/15">
                    <p className="text-xs font-medium text-white/95 mb-2 line-clamp-1">
                      {selectedVideo.captions[captionIndex]}
                    </p>

                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setIsPlaying((p) => !p)}
                        className="h-6 w-6 rounded-md bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors shrink-0"
                        aria-label={isPlaying ? "Pause video" : "Play video"}
                      >
                        {isPlaying ? (
                          <Pause className="h-3 w-3 fill-current" />
                        ) : (
                          <Play className="h-3 w-3 fill-current ml-0.5" />
                        )}
                      </button>

                      <div
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const clickX = e.clientX - rect.left;
                          const pct = Math.max(
                            0,
                            Math.min(100, Math.round((clickX / rect.width) * 100))
                          );
                          setProgress(pct);
                        }}
                        className="flex-1 h-1.5 rounded-full bg-white/25 overflow-hidden cursor-pointer"
                      >
                        <div
                          className="h-full rounded-full bg-white transition-all duration-200"
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setProgress(0);
                          setIsPlaying(true);
                        }}
                        className="h-6 w-6 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors shrink-0"
                        aria-label="Replay"
                      >
                        <RotateCcw className="h-3 w-3" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsMuted((m) => !m)}
                        className="h-6 w-6 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors shrink-0"
                        aria-label={isMuted ? "Unmute" : "Mute"}
                      >
                        {isMuted ? (
                          <VolumeX className="h-3 w-3" />
                        ) : (
                          <Volume2 className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Modal Candidate Details Footer */}
                <div className="p-5 sm:p-6 bg-white">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#002C66] px-3.5 py-1 text-xs font-bold text-white">
                        <Award className="h-3.5 w-3.5" /> Verified CIR: {selectedVideo.irsScore}/100 ({selectedVideo.percentile})
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FBF4EB] border border-[#002C66]/20 px-3 py-1 text-xs font-bold text-[#002C66]">
                        <TrendingUp className="h-3.5 w-3.5" /> {selectedVideo.hike}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FBF4EB] border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                        <Clock className="h-3.5 w-3.5 text-[#002C66]" /> {selectedVideo.timeToHire}
                      </span>
                    </div>
                    <CompanyLogo company={selectedVideo.company} />
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {selectedVideo.quote}
                  </p>

                  <div className="rounded-2xl bg-[#002C66] text-white p-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={selectedVideo.thumbnail}
                        alt={selectedVideo.name}
                        style={{ objectPosition: selectedVideo.objectPosition }}
                        className="h-11 w-11 rounded-xl object-cover border-2 border-white/25 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-bold text-white truncate">{selectedVideo.name}</p>
                          <BadgeCheck className="h-4 w-4 text-white shrink-0" />
                        </div>
                        <p className="text-xs text-white/85 truncate">
                          {selectedVideo.role} @ <span className="font-bold text-white">{selectedVideo.company}</span>
                        </p>
                      </div>
                    </div>

                    <Link
                      to="/assessments/explore"
                      className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-extrabold text-[#002C66] hover:bg-[#FBF4EB] transition-colors"
                    >
                      Take Your Assessment <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default VideoTestimonialsSection;
