import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus, Search, CreditCard, ShieldCheck, FileBarChart, Rocket,
  CheckCircle2, ArrowRight, Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SectionBadge from "@/components/ui/section-badge";

const steps = [
  {
    step: 1,
    label: "Build Your Profile",
    subtitle: "Sign up & set your goals",
    bg: "bg-primary",
    icon: UserPlus,
    desc: "Sign up and complete your professional profile — add skills, experience, and career goals so we can match you with the right assessment.",
    bullets: ["Skills & experience", "Career goals", "Role preferences", "Portfolio links"],
  },
  {
    step: 2,
    label: "Choose Assessment",
    subtitle: "50+ role-specific tests",
    bg: "bg-[hsl(33,100%,50%)]",
    icon: Search,
    desc: "Pick from 50+ role-specific, industry-aligned assessments — from Data Science to Digital Marketing. Each one mirrors real job tasks.",
    bullets: ["50+ assessments", "Role-specific", "Industry-aligned", "Real-world tasks"],
  },
  {
    step: 3,
    label: "Pay & Schedule",
    subtitle: "Flexible plans & slots",
    bg: "bg-primary",
    icon: CreditCard,
    desc: "Select a plan, pay securely, and book a slot that works for you. Flexible scheduling with instant confirmation.",
    bullets: ["Secure payment", "Flexible slots", "Instant confirmation", "Multiple plans"],
  },
  {
    step: 4,
    label: "Take the Test",
    subtitle: "AI-proctored assessment",
    bg: "bg-[hsl(33,100%,50%)]",
    icon: ShieldCheck,
    desc: "Complete the assessment under AI-powered proctoring — screen monitoring, identity verification, and anti-cheat safeguards ensure credibility.",
    bullets: ["Screen monitoring", "Identity check", "Anti-cheat AI", "Fair evaluation"],
  },
  {
    step: 5,
    label: "Get Your Report",
    subtitle: "Results in 24 hours",
    bg: "bg-primary",
    icon: FileBarChart,
    desc: "Get your full Industry Readiness Report within 24 hours. If you meet the benchmark, your Verified Badge activates immediately.",
    bullets: ["Readiness report", "Verified badge", "Skill breakdown", "Career roadmap"],
  },
  {
    step: 6,
    label: "Unlock Opportunities",
    subtitle: "Priority hiring access",
    bg: "bg-[hsl(33,100%,50%)]",
    icon: Rocket,
    desc: "Earn priority visibility with hiring partners and access exclusive job openings matched to your proven skills.",
    bullets: ["Priority listing", "Hiring partners", "Exclusive jobs", "Skill matching"],
  },
];

const CardVisual = ({ card, isCenter }: { card: typeof steps[0]; isCenter: boolean }) => {
  const Icon = card.icon;
  return (
    <div className={`w-full h-full ${card.bg} rounded-3xl flex flex-col items-center justify-center relative overflow-hidden`}>
      {/* Concentric rings */}
      {[1, 2, 3, 4, 5].map((r) => (
        <div
          key={r}
          className="absolute rounded-full border border-white/[0.08]"
          style={{
            width: `${r * 100}px`,
            height: `${r * 100}px`,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}

      {/* Floating dots — center card only */}
      {isCenter && (
        <>
          <motion.div className="absolute w-2 h-2 rounded-full bg-white/20" style={{ top: "22%", left: "28%" }} animate={{ y: [-8, 8, -8] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="absolute w-1.5 h-1.5 rounded-full bg-white/15" style={{ top: "35%", right: "22%" }} animate={{ y: [6, -6, 6] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
        </>
      )}

      {/* Step number badge */}
      {isCenter && (
        <motion.div
          className="absolute top-5 right-5"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex items-center gap-1 bg-white/20 rounded-full px-2.5 py-1">
            <Flame className="w-3 h-3 text-white" />
            <span className="text-[10px] font-bold text-white">Step {card.step}</span>
          </div>
        </motion.div>
      )}

      {/* Icon */}
      <motion.div
        animate={isCenter ? { scale: [1, 1.06, 1] } : {}}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="mb-5"
      >
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white/20 flex items-center justify-center">
          <Icon className="w-10 h-10 md:w-12 md:h-12 text-white" strokeWidth={1.5} />
        </div>
      </motion.div>

      {/* Text at bottom */}
      <h3 className="text-base md:text-lg font-bold font-display text-white text-center">{card.label}</h3>
      <p className="text-[11px] text-white/60 font-medium mt-0.5">{card.subtitle}</p>
    </div>
  );
};

const HowItWorksSection = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const activeStep = steps[activeIdx];

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setActiveIdx((p) => (p + 1) % steps.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [paused]);

  const handleClick = useCallback((i: number) => {
    setActiveIdx(i);
    setPaused(true);
    setTimeout(() => setPaused(false), 6000);
  }, []);

  const getCardStyle = (i: number) => {
    const offset = i - activeIdx;
    const absOffset = Math.abs(offset);
    const isCenter = offset === 0;

    return {
      x: offset * 180,
      rotateY: offset * -8,
      scale: isCenter ? 1 : 0.92 - absOffset * 0.02,
      opacity: isCenter ? 1 : Math.max(0.3, 0.85 - absOffset * 0.2),
      zIndex: 10 - absOffset,
    };
  };

  return (
    <section className="bg-background py-16 md:py-24 overflow-hidden">
      <div className="container px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <SectionBadge label="How It Works" icon={ShieldCheck} />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold font-display mt-4 mb-4"
          >
            From Sign-Up to<br />
            <span className="text-primary">Getting Hired.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-muted-foreground max-w-xl mx-auto mb-8"
          >
            Six simple steps to prove your skills, earn trust, and land your dream role.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <Link to="/skill-assessment">
              <Button className="rounded-full px-8 gap-2 h-11 text-sm font-semibold bg-[hsl(33,100%,50%)] hover:bg-[hsl(33,100%,45%)] text-white border-0">
                Start Your Assessment <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Card Fan */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          className="relative flex items-center justify-center mb-10"
          style={{ height: "clamp(380px, 50vw, 520px)", perspective: "1600px" }}
        >
          {steps.map((card, i) => {
            const offset = i - activeIdx;
            const isCenter = offset === 0;
            const style = getCardStyle(i);

            return (
              <motion.div
                key={i}
                onClick={() => handleClick(i)}
                className="absolute cursor-pointer select-none"
                animate={{
                  x: style.x,
                  rotateY: style.rotateY,
                  scale: style.scale,
                  opacity: style.opacity,
                }}
                transition={{ type: "spring", stiffness: 220, damping: 26 }}
                style={{
                  zIndex: style.zIndex,
                  transformStyle: "preserve-3d",
                  width: "clamp(260px, 30vw, 380px)",
                  height: "clamp(340px, 42vw, 480px)",
                }}
              >
                <CardVisual card={card} isCenter={isCenter} />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => handleClick(i)}
              className={`rounded-full transition-all duration-300 ${
                i === activeIdx
                  ? "w-8 h-2 bg-primary"
                  : "w-2 h-2 bg-muted-foreground/25 hover:bg-muted-foreground/40"
              }`}
            />
          ))}
        </div>

        {/* Active step detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto text-center"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
              Step {activeStep.step} of 6
            </p>
            <h3 className="text-xl md:text-2xl font-bold font-display mb-3">{activeStep.label}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5 max-w-lg mx-auto">
              {activeStep.desc}
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {activeStep.bullets.map((bullet) => (
                <div key={bullet} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm font-medium">{bullet}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default HowItWorksSection;
