import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Award, Target, Zap, ArrowRight, BookOpen, LineChart, Shield, Trophy, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SectionBadge from "@/components/ui/section-badge";

const cards = [
  {
    label: "Career Dashboard",
    bg: "bg-primary",
    icon: LineChart,
    subtitle: "Track every metric",
  },
  {
    label: "Success Stories",
    bg: "bg-[hsl(33,100%,50%)]",
    icon: TrendingUp,
    subtitle: "Real learner wins",
  },
  {
    label: "Skill Badges",
    bg: "bg-primary",
    icon: Shield,
    subtitle: "Verified credentials",
  },
  {
    label: "Course Progress",
    bg: "bg-[hsl(33,100%,50%)]",
    icon: BookOpen,
    subtitle: "Complete & conquer",
  },
  {
    label: "Milestones",
    bg: "bg-primary",
    icon: Trophy,
    subtitle: "Unlock achievements",
  },
];

const features = [
  {
    icon: Target,
    title: "Real-Time IRS Score",
    desc: "Your Industry Readiness Score updates as you complete courses, quizzes, and projects.",
  },
  {
    icon: Zap,
    title: "Skill-Level Tracking",
    desc: "See exactly which skills you've unlocked and how you rank against industry benchmarks.",
  },
  {
    icon: Award,
    title: "Milestone Badges",
    desc: "Earn verified badges as you hit career milestones — visible to recruiters on your profile.",
  },
];

const CardVisual = ({ card, isCenter }: { card: typeof cards[0]; isCenter: boolean }) => {
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

      {/* Active badge */}
      {isCenter && (
        <motion.div
          className="absolute top-5 right-5"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex items-center gap-1 bg-white/20 rounded-full px-2.5 py-1">
            <Flame className="w-3 h-3 text-white" />
            <span className="text-[10px] font-bold text-white">Active</span>
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

const GrowthTrackerSection = () => {
  const [activeIdx, setActiveIdx] = useState(2);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setActiveIdx((p) => (p + 1) % cards.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [paused]);

  const handleClick = useCallback((i: number) => {
    setActiveIdx(i);
    setPaused(true);
    setTimeout(() => setPaused(false), 6000);
  }, []);

  // Position cards so active is always right-of-center, stacking to the left
  const getCardStyle = (i: number) => {
    const offset = i - activeIdx;
    const absOffset = Math.abs(offset);
    const isCenter = offset === 0;

    // Cards fan from right (active) to left (stacked behind)
    return {
      x: offset * 180,
      rotateY: offset * -8,
      scale: isCenter ? 1 : 0.92 - absOffset * 0.02,
      opacity: isCenter ? 1 : Math.max(0.3, 0.85 - absOffset * 0.2),
      zIndex: 10 - absOffset,
    };
  };

  return (
    <section className="py-16 md:py-28 overflow-hidden">
      <div className="container px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <SectionBadge label="Growth Tracker" icon={BarChart3} />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mt-4 mb-3"
          >
            Watch Yourself<br />
            <span className="text-primary">Level Up</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-8"
          >
            <span className="block">Track every step toward career readiness.</span>
            <span className="block">See your progress clearly.</span>
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <Link to="/assessments/explore">
              <Button className="rounded-full px-8 gap-2 h-11 text-sm font-semibold bg-[hsl(33,100%,50%)] hover:bg-[hsl(33,100%,45%)] text-white border-0">
                Start Tracking <ArrowRight className="h-4 w-4" />
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
          className="relative flex items-center justify-center mb-12"
          style={{ height: "clamp(380px, 50vw, 520px)", perspective: "1600px" }}
        >
          {cards.map((card, i) => {
            const offset = i - activeIdx;
            const absOffset = Math.abs(offset);
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
        <div className="flex items-center justify-center gap-2 mb-16">
          {cards.map((_, i) => (
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

        {/* Features Row */}
        <div className="grid md:grid-cols-3 gap-10 max-w-4xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mb-4">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-sm md:text-base font-bold font-display mb-2">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GrowthTrackerSection;
