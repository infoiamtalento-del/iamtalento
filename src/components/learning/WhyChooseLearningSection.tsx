import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { Users, NotebookPen, ShieldCheck, Clock, TrendingUp, Star, Award } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import SectionBadge from "@/components/ui/section-badge";

/* ---------- Animated counter ---------- */
const AnimatedCounter = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, target, { duration: 2, ease: [0.22, 1, 0.36, 1] });
      return controls.stop;
    }
  }, [isInView, count, target]);

  useEffect(() => {
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return unsub;
  }, [rounded]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}{suffix}
    </span>
  );
};

/* ---------- Learner avatars ---------- */
const avatars = [
  "https://randomuser.me/api/portraits/women/23.jpg",
  "https://randomuser.me/api/portraits/men/45.jpg",
  "https://randomuser.me/api/portraits/women/56.jpg",
  "https://randomuser.me/api/portraits/men/67.jpg",
];

/* ---------- Component ---------- */
const WhyChooseLearningSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <div className="container px-4 md:px-6" ref={sectionRef}>
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <SectionBadge label="Why Us" icon={Award} />
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3"
          >
            Choose Learning Built<br />
            <span className="text-primary">For Your Career</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto"
          >
            <span className="block">Learn with expert guidance, current content, and lifelong access.</span>
            <span className="block">Build skills trusted by employers.</span>
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">

          {/* Card 1 — Avatars + Partners */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="rounded-2xl border border-border bg-card p-5 md:p-6 flex flex-col justify-between"
          >
            <div className="flex -space-x-2.5 mb-4">
              {avatars.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="Learner"
                  className="h-9 w-9 rounded-full border-2 border-background object-cover"
                />
              ))}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <AnimatedCounter target={200} suffix="+" /> Experts
              </p>
              <p className="text-sm text-muted-foreground mt-1">Handpicked by industry leaders</p>
            </div>
          </motion.div>

          {/* Card 2 — Curriculum Updates */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="rounded-2xl border border-border bg-card p-5 md:p-6 flex flex-col justify-between"
          >
            <p className="text-sm text-foreground font-medium leading-snug">
              Curriculum refreshed every quarter to match real-world demands
            </p>
            <div className="mt-4">
              <p className="text-4xl md:text-5xl font-bold font-display text-foreground">
                <AnimatedCounter target={4} suffix="x" />
              </p>
              <p className="text-xs text-muted-foreground mt-1">Yearly refreshes</p>
            </div>
          </motion.div>

          {/* Card 3 — Dark feature card (spans 1 row, right col) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="rounded-2xl bg-primary text-primary-foreground p-5 md:p-6 flex flex-col justify-between row-span-2"
          >
            <div>
              <p className="text-sm text-primary-foreground/80 leading-relaxed">
                We've helped <span className="font-bold text-primary-foreground">50,000+</span> learners
                upskill and land roles at top companies worldwide.
              </p>
              <motion.div
                initial={{ opacity: 0, x: -30, y: 30 }}
                animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
                transition={{ delay: 0.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="mt-6"
              >
                <motion.div
                  animate={isInView ? { y: [0, -6, 0] } : {}}
                  transition={{ delay: 1.5, duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <TrendingUp className="h-16 w-16 text-primary-foreground mb-2" />
                </motion.div>
              </motion.div>
            </div>

            <div className="mt-auto pt-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl md:text-5xl font-bold font-display text-primary-foreground">
                  <AnimatedCounter target={4} suffix="" />
                </span>
                <span className="text-4xl md:text-5xl font-bold font-display text-primary-foreground">.8</span>
                <span className="text-lg text-primary-foreground/50 font-bold">/5</span>
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-primary-foreground/60">
                  Trusted by learners
                </span>
              </div>
            </div>
          </motion.div>

          {/* Card 4 — ROI stat */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="rounded-2xl border border-border bg-card p-5 md:p-6 flex flex-col justify-between"
          >
            <p className="text-sm text-foreground font-medium leading-snug">
              Lifelong access to all course content
            </p>
            <div className="mt-4">
              <p className="text-5xl md:text-6xl font-bold font-display text-foreground">
                <AnimatedCounter target={100} suffix="%" />
              </p>
              <p className="text-xs text-muted-foreground mt-1">Content retention</p>
            </div>
          </motion.div>

          {/* Card 5 — Industry partners + available badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="rounded-2xl border border-border bg-card p-5 md:p-6 flex flex-col justify-between"
          >
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-foreground">Vetted by Industry Panels</span>
            </div>
            <div className="mt-auto">
              <p className="text-3xl md:text-4xl font-bold font-display text-foreground">
                <AnimatedCounter target={50} suffix="+" />
              </p>
              <p className="text-xs text-muted-foreground mt-1">Industry partners</p>
            </div>
            <div className="flex items-center gap-1.5 mt-4">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                Enrolling Now
              </span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default WhyChooseLearningSection;
