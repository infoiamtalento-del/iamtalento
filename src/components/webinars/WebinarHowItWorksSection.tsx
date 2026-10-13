import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

const steps = [
  { icon: User,          label: "STEP 1", title: "Build Your Profile",      desc: "Tell us who you are in 2 minutes — role, experience, and goals.",          theme: "red" },
  { icon: Layers,        label: "STEP 2", title: "Pick Your Domain",        desc: "Choose your field & experience level for a fully tailored path.",          theme: "yellow" },
  { icon: ListChecks,    label: "STEP 3", title: "Select Your Test",        desc: "Role-specific. AI-curated. Precise — built for your exact target job.",    theme: "red" },
  { icon: MessageSquare, label: "STEP 4", title: "Practice Like It's Real", desc: "Mock interviews + AI practice tests that mirror real hiring pressure.",    theme: "yellow" },
  { icon: FileText,      label: "STEP 5", title: "Craft Your AI Resume",    desc: "Premium templates engineered to pass ATS and actually get callbacks.",     theme: "red" },
  { icon: ShieldCheck,   label: "STEP 6", title: "Take the Proctored Test", desc: "Fair. Secure. Employer-trusted — your real skill, on the record.",         theme: "yellow" },
  { icon: BarChart3,     label: "STEP 7", title: "Get Your ScoreCard",      desc: "One score that speaks louder than your CV — benchmarked against peers.",  theme: "red" },
  { icon: Send,          label: "STEP 8", title: "Apply to 100+ Jobs",      desc: "Let employers come to you. Verified. Ranked. Ready to hire.",              theme: "yellow" },
];

const themes: Record<string, { bg: string; text: string; sub: string; chip: string }> = {
  red:    { bg: "bg-primary", text: "text-primary-foreground", sub: "text-primary-foreground/80", chip: "bg-primary-foreground/15 text-primary-foreground" },
  yellow: { bg: "bg-primary-glow", text: "text-foreground", sub: "text-foreground/75", chip: "bg-background/30 text-foreground" },
};

const VISIBLE = 4;

const WebinarHowItWorksSection = () => {
  const [active, setActive] = useState(0);

  const go = (delta: number) => {
    setActive((p) => (p + delta + steps.length) % steps.length);
  };

  // Build visible window of 4 steps starting from `active`
  const visible = Array.from({ length: VISIBLE }, (_, i) => {
    const idx = (active + i) % steps.length;
    return { ...steps[idx], idx };
  });

  return (
    <section className="py-16 md:py-24 bg-background overflow-hidden">
      <div className="container px-4 md:px-6">
        {/* Centered heading */}
        <div className="flex flex-col items-center text-center mb-12">
          <SectionBadge label="How It Works" icon={Zap} />
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-3 leading-[1.05]">
            From Registration to<br />
            <span className="text-primary">Real Skill in 8 Steps</span>
          </h2>
          <p className="text-muted-foreground max-w-md">
            From zero to offer-ready — a complete system built to prove your value.
          </p>
        </div>

        {/* 4-card carousel */}
        <div className="relative flex items-center justify-center gap-4 md:gap-6">
          <button
            onClick={() => go(-1)}
            aria-label="Previous step"
            className="h-11 w-11 shrink-0 rounded-full bg-background border border-border shadow-md hover:bg-accent hover:scale-105 active:scale-95 transition flex items-center justify-center z-10"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex-1 overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              <AnimatePresence mode="popLayout" initial={false}>
                {visible.map((s, i) => {
                  const Icon = s.icon;
                  const t = themes[s.theme];
                  return (
                    <motion.div
                      key={s.idx}
                      layout
                      initial={{ opacity: 0, y: 30, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -30, scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 260, damping: 28, delay: i * 0.05 }}
                    >
                      <div className={`${t.bg} ${t.text} h-[420px] md:h-[460px] w-full rounded-[2rem] shadow-2xl px-6 py-7 relative overflow-hidden flex flex-col`}>
                        <span
                          aria-hidden
                          className={`absolute -top-6 right-3 font-display font-black leading-none select-none ${t.text} opacity-10`}
                          style={{ fontSize: "clamp(110px, 10vw, 180px)" }}
                        >
                          {s.idx + 1}
                        </span>

                        <div className={`relative inline-flex w-fit items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-[0.18em] ${t.chip}`}>
                          <Icon className="h-3 w-3" /> {s.label}
                        </div>

                        <div className="relative mt-auto">
                          <h3 className={`text-2xl md:text-3xl font-bold font-display leading-[1.05] ${t.text}`}>
                            {s.title}
                          </h3>
                          <p className={`mt-3 text-xs md:text-sm ${t.sub}`}>{s.desc}</p>

                          <div className={`mt-6 flex items-center gap-3 text-[10px] tracking-[0.2em] font-bold ${t.sub}`}>
                            <span>0{s.idx + 1}</span>
                            <span className="h-px flex-1 bg-current opacity-25" />
                            <span>0{s.idx + 1}/0{steps.length}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          <button
            onClick={() => go(1)}
            aria-label="Next step"
            className="h-11 w-11 shrink-0 rounded-full bg-background border border-border shadow-md hover:bg-accent hover:scale-105 active:scale-95 transition flex items-center justify-center z-10"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Dots */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Go to step ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === active ? "w-6 bg-primary" : "w-1.5 bg-primary/30"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WebinarHowItWorksSection;
