import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import {
  User,
  Layers,
  ListChecks,
  MessageSquare,
  FileText,
  ShieldCheck,
  BarChart3,
  Send,
  Zap,
  CheckCircle,
} from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

const steps = [
  { icon: User,          label: "STEP 1", title: "Build Your Profile",      desc: "Tell us who you are in 2 minutes — role, experience, and goals.",          theme: "red",    rotate: -7 },
  { icon: Layers,        label: "STEP 2", title: "Pick Your Domain",        desc: "Choose your field & experience level for a fully tailored path.",          theme: "yellow", rotate: 5 },
  { icon: ListChecks,    label: "STEP 3", title: "Select Your Test",        desc: "Role-specific. AI-curated. Precise — built for your exact target job.",    theme: "red",    rotate: -4 },
  { icon: MessageSquare, label: "STEP 4", title: "Practice Like It's Real", desc: "Mock interviews + AI practice tests that mirror real hiring pressure.",    theme: "yellow", rotate: 6 },
  { icon: FileText,      label: "STEP 5", title: "Craft Your AI Resume",    desc: "Premium templates engineered to pass ATS and actually get callbacks.",     theme: "red",    rotate: -5 },
  { icon: ShieldCheck,   label: "STEP 6", title: "Take the Proctored Test", desc: "Fair. Secure. Employer-trusted — your real skill, on the record.",         theme: "yellow", rotate: 4 },
  { icon: BarChart3,     label: "STEP 7", title: "Get Your ScoreCard",      desc: "One score that speaks louder than your CV — benchmarked against peers.",  theme: "red",    rotate: -6 },
  { icon: Send,          label: "STEP 8", title: "Apply to 100+ Jobs",      desc: "Let employers come to you. Verified. Ranked. Ready to hire.",              theme: "yellow", rotate: 7 },
];

const themes: Record<string, { bg: string; text: string; sub: string; chip: string; border: string }> = {
  red:    { bg: "bg-[#ef4444]", text: "text-white",     sub: "text-white/70",     chip: "bg-white/15 text-white",         border: "border-black/5" },
  yellow: { bg: "bg-[#fbbf24]", text: "text-[#1a1500]", sub: "text-[#3a2f00]/70", chip: "bg-[#1a1500]/10 text-[#1a1500]", border: "border-black/10" },
};

const StepCard = ({
  index,
  data,
  progress,
  total,
}: {
  index: number;
  data: (typeof steps)[0];
  progress: MotionValue<number>;
  total: number;
}) => {
  const Icon = data.icon;
  const t = themes[data.theme];

  const slice = 1 / total;
  const inStart = Math.max(0, index * slice);
  const inEarly = Math.min(1, inStart + slice * 0.25);
  const inMid = Math.min(1, inStart + slice * 0.4);
  const settle = Math.min(1, inStart + slice * 0.65);

  const y = useTransform(progress, [inStart, inMid, settle], [-360, -40, 0]);
  const rotate = useTransform(
    progress,
    [inStart, inMid, settle],
    [data.rotate * 2.5, data.rotate * 1.4, data.rotate]
  );
  const opacity = useTransform(progress, [inStart, inEarly], [index === 0 ? 1 : 0, 1]);
  const scale = useTransform(progress, [inStart, settle], [0.9, 1]);

  return (
    <motion.div
      style={{ y, rotate, opacity, scale, zIndex: 10 + index }}
      className="absolute inset-x-0 mx-auto w-full max-w-md"
    >
      <div className={`${t.bg} ${t.text} ${t.border} border rounded-3xl shadow-2xl px-6 md:px-8 py-6 md:py-7 relative overflow-hidden`}>
        <span
          aria-hidden
          className={`absolute -top-4 right-3 font-display font-black leading-none select-none ${t.text} opacity-10`}
          style={{ fontSize: "clamp(90px, 11vw, 150px)" }}
        >
          {index + 1}
        </span>

        <div className="relative">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-[0.18em] ${t.chip}`}>
            <Icon className="h-3 w-3" /> {data.label}
          </div>
          <h3 className={`mt-3 text-2xl md:text-3xl font-bold font-display leading-[1.1] ${t.text}`}>
            {data.title}
          </h3>
          <p className={`mt-2 text-sm max-w-sm ${t.sub}`}>{data.desc}</p>

          <div className={`mt-5 flex items-center gap-3 text-[10px] tracking-[0.2em] font-bold ${t.sub}`}>
            <span>0{index + 1}</span>
            <span className="h-px flex-1 bg-current opacity-20" />
            <span>0{index + 1}/0{total}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const WebinarHowItWorksSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [activeIdx, setActiveIdx] = useState(0);
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      const idx = Math.min(steps.length - 1, Math.max(0, Math.floor(v * steps.length)));
      setActiveIdx(idx);
    });
    return unsub;
  }, [scrollYProgress]);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div ref={containerRef} className="relative" style={{ height: `${steps.length * 80}vh` }}>
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <div className="container px-4 md:px-6">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              {/* LEFT — content */}
              <div className="lg:col-span-6">
                <SectionBadge label="How It Works" icon={Zap} />
                <h2 className="text-3xl md:text-5xl font-bold font-display mb-3 leading-[1.05]">
                  From Registration to<br />
                  <span className="text-[#ef4444]">Real Skill in 8 Steps</span>
                </h2>
                <p className="text-muted-foreground max-w-md mb-8">
                  From zero to offer-ready — a complete system built to prove your value.
                </p>

                {/* Compact step grid (2 cols x 4 rows) */}
                <div className="grid grid-cols-2 gap-x-5 gap-y-4 max-w-lg">
                  {steps.map((s, i) => {
                    const SIcon = s.icon;
                    const isActive = i === activeIdx;
                    const isPast = i < activeIdx;
                    return (
                      <motion.div
                        key={s.title}
                        animate={{ opacity: isActive ? 1 : isPast ? 0.55 : 0.35 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-start gap-3"
                      >
                        <div
                          className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center transition-all ${
                            isActive
                              ? "bg-[#ef4444] text-white scale-110 shadow-md shadow-[#ef4444]/30"
                              : "bg-[#fde9e2] text-[#ef4444]"
                          }`}
                        >
                          {isPast ? <CheckCircle className="h-5 w-5" /> : <SIcon className="h-5 w-5" strokeWidth={2} />}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-[10px] font-bold tracking-[0.18em] ${isActive ? "text-[#ef4444]" : "text-[#ef4444]/70"}`}>
                            {s.label}
                          </p>
                          <p className={`text-sm font-bold font-display leading-tight ${isActive ? "text-foreground" : "text-foreground/80"}`}>
                            {s.title}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT — scroll-stacked cards */}
              <div className="lg:col-span-6 relative h-[70vh] flex items-center justify-center">
                <div className="relative w-full h-full max-w-xl mx-auto flex items-center justify-center">
                  {steps.map((data, i) => (
                    <StepCard
                      key={data.label}
                      index={i}
                      data={data}
                      progress={scrollYProgress}
                      total={steps.length}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WebinarHowItWorksSection;
