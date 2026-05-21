import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Code, Brain, MessageSquare, BarChart3, CheckCircle2, Eye, Sparkles, TrendingUp, Award } from "lucide-react";

import carouselProctoring from "@/assets/carousel-proctoring.jpg";
import carouselCandidate from "@/assets/carousel-candidate1.jpg";
import carouselDashboard from "@/assets/carousel-dashboard.jpg";
import carouselCoding from "@/assets/carousel-coding.jpg";
import carouselSuccess from "@/assets/carousel-success.jpg";

const slides = [
  {
    id: 0,
    img: carouselProctoring,
    title: "AI-Proctored Assessments",
    subtitle: "30-layer integrity monitoring",
    icon: Shield,
    score: 92,
    label: "Proctoring Score",
    color: "from-emerald-500 to-teal-600",
    orbColor: "bg-emerald-500",
    tags: ["Webcam Active", "Tab Monitoring", "Face Match"],
  },
  {
    id: 1,
    img: carouselCoding,
    title: "Technical Skill Tests",
    subtitle: "Real-world coding challenges",
    icon: Code,
    score: 86,
    label: "Code Quality",
    color: "from-blue-500 to-indigo-600",
    orbColor: "bg-blue-500",
    tags: ["Python", "React", "System Design"],
  },
  {
    id: 2,
    img: carouselDashboard,
    title: "Live Score Dashboard",
    subtitle: "Real-time performance analytics",
    icon: BarChart3,
    score: 78,
    label: "Industry Readiness",
    color: "from-violet-500 to-purple-600",
    orbColor: "bg-violet-500",
    tags: ["Percentile Rank", "Skill Gaps", "Benchmarks"],
  },
  {
    id: 3,
    img: carouselCandidate,
    title: "Behavioral Analysis",
    subtitle: "Communication & soft skills mapped",
    icon: Brain,
    score: 91,
    label: "Behavioral Score",
    color: "from-amber-500 to-orange-600",
    orbColor: "bg-amber-500",
    tags: ["Leadership", "Teamwork", "Adaptability"],
  },
  {
    id: 4,
    img: carouselSuccess,
    title: "Verified & Hired",
    subtitle: "Earn your badge, land the job",
    icon: Award,
    score: 95,
    label: "Readiness Index",
    color: "from-rose-500 to-red-600",
    orbColor: "bg-rose-500",
    tags: ["Verified Badge", "Top 5%", "Priority Listing"],
  },
];

/* ── Animated Score Orb ── */
const ScoreOrb = ({ score, color }: { score: number; color: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
    let frame: number;
    const start = performance.now();
    const dur = 1200;
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(ease * score));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (count / 100) * circumference;

  return (
    <div className="relative h-32 w-32 flex items-center justify-center">
      {/* Glow */}
      <div className={`absolute inset-0 rounded-full ${color} opacity-20 blur-xl`} />
      <svg className="absolute inset-0" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--border))" strokeWidth="6" opacity="0.2" />
        <motion.circle
          cx="60" cy="60" r="54" fill="none"
          stroke="url(#orbGrad)" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="orbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--chart-2))" />
          </linearGradient>
        </defs>
      </svg>
      <span className="text-3xl font-bold font-display text-foreground">{count}</span>
    </div>
  );
};

/* ── Mini dashboard overlay cards ── */
const DashOverlay = ({ slide }: { slide: (typeof slides)[0] }) => (
  <div className="absolute bottom-4 left-4 right-4 flex gap-2">
    {slide.tags.map((tag) => (
      <motion.span
        key={tag}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 + Math.random() * 0.3 }}
        className="px-2.5 py-1 rounded-full bg-background/80 backdrop-blur text-[11px] font-medium text-foreground border border-border/50"
      >
        {tag}
      </motion.span>
    ))}
  </div>
);

/* ── Progress dots ── */
const Dots = ({ active, total, onClick }: { active: number; total: number; onClick: (i: number) => void }) => (
  <div className="flex gap-2 justify-center mt-8">
    {Array.from({ length: total }).map((_, i) => (
      <button
        key={i}
        onClick={() => onClick(i)}
        className={`h-2 rounded-full transition-all duration-500 ${
          i === active ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
        }`}
      />
    ))}
  </div>
);

const AssessmentShowcaseCarousel = () => {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback(
    (idx: number) => {
      setDirection(idx > active ? 1 : -1);
      setActive(idx);
    },
    [active],
  );

  // Auto-advance every 4.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setActive((p) => (p + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[active];
  const Icon = slide.icon;

  const slideVariants = {
    enter: (d: number) => ({ y: d > 0 ? 120 : -120, opacity: 0, scale: 0.92 }),
    center: { y: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ y: d > 0 ? -120 : 120, opacity: 0, scale: 0.92 }),
  };

  return (
    <section className="py-16 md:py-24 overflow-hidden bg-muted/30">
      <div className="container">
        {/* Header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Experience the Platform
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display mb-3">
            Choose Your <span className="text-primary">Assessment</span>
          </h2>
          <p className="text-muted-foreground">
            From AI proctoring to live score dashboards — see what makes our assessments world-class.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[480px]">
          {/* Left — Image Card */}
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-card border border-border/50 shadow-xl">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={slide.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <img
                  src={slide.img}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${slide.color} opacity-30 mix-blend-multiply`} />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />

                {/* Webcam indicator */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur border border-border/50"
                >
                  <Eye className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-xs font-medium text-foreground">Live Proctor</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </motion.div>

                {/* Tags */}
                <DashOverlay slide={slide} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right — Info + Orb */}
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-start gap-6"
            >
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r ${slide.color} text-white text-sm font-semibold`}>
                <Icon className="h-4 w-4" />
                {slide.title}
              </div>

              <h3 className="text-2xl md:text-3xl font-bold font-display text-foreground leading-tight">
                {slide.subtitle}
              </h3>

              {/* Score Orb */}
              <div className="flex items-center gap-6">
                <ScoreOrb score={slide.score} color={slide.orbColor} />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{slide.label}</p>
                  <div className="flex items-center gap-1.5 text-emerald-500 text-sm font-semibold">
                    <TrendingUp className="h-4 w-4" />
                    Above Market Average
                  </div>
                </div>
              </div>

              {/* Mini feature list */}
              <div className="grid grid-cols-2 gap-3 w-full">
                {[
                  "Real-time scoring",
                  "AI-powered insights",
                  "Industry benchmarks",
                  "Verified results",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    {f}
                  </div>
                ))}
              </div>

              {/* Assessment selector pills */}
              <div className="flex flex-wrap gap-2 pt-2">
                {slides.map((s, i) => {
                  const SIcon = s.icon;
                  return (
                    <button
                      key={s.id}
                      onClick={() => goTo(i)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300 border ${
                        i === active
                          ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                          : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      <SIcon className="h-3.5 w-3.5" />
                      {s.title.split(" ").slice(0, 2).join(" ")}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <Dots active={active} total={slides.length} onClick={goTo} />
      </div>
    </section>
  );
};

export default AssessmentShowcaseCarousel;
