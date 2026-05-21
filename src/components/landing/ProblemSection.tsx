import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import {
  ArrowRight, DollarSign, Target,
  TrendingDown, XCircle, LineChart, Brain, UserCheck, BarChart3, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const comparisons = [
  {
    problem: { icon: DollarSign, title: "Don't know if they're underpaid", desc: "Without real benchmarks, most professionals have no idea if their salary reflects their actual market value." },
    solution: { icon: LineChart, title: "Measured against real market benchmarks", desc: "Your skills are scored against live industry data so you know exactly where your compensation stands." },
  },
  {
    problem: { icon: TrendingDown, title: "Skills don't match market expectations", desc: "What you know and what employers actually need are often misaligned — and no one tells you until it's too late." },
    solution: { icon: UserCheck, title: "Compared with professionals at your experience level", desc: "See how your skill profile stacks up against real peers with similar backgrounds and years of experience." },
  },
  {
    problem: { icon: Target, title: "No clarity on what to improve", desc: "Generic advice and random courses waste time. You need to know precisely which skill gaps are costing you the most." },
    solution: { icon: Brain, title: "Skill gaps identified instantly", desc: "AI pinpoints exactly which skills are holding you back and prioritizes what to fix first for maximum impact." },
  },
  {
    problem: { icon: XCircle, title: "Applying blindly without performance proof", desc: "Resumes and cover letters don't prove capability. Hiring teams can't see your actual skill level — so they guess." },
    solution: { icon: BarChart3, title: "Know if you're Above, At, or Below Market — clearly", desc: "Get a verified performance profile that tells you and employers exactly where you rank in the market." },
  },
];

const DropdownCircle = ({ isOpen, variant }: { isOpen: boolean; variant: "problem" | "solution" }) => (
  <motion.div
    animate={{ rotate: isOpen ? 180 : 0 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className={cn(
      "h-7 w-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-300",
      variant === "problem"
        ? isOpen ? "border-destructive bg-destructive/10" : "border-border bg-transparent"
        : isOpen ? "border-primary bg-primary/10" : "border-border bg-transparent"
    )}
  >
    <ChevronDown className={cn(
      "h-3.5 w-3.5 transition-colors duration-300",
      variant === "problem"
        ? isOpen ? "text-destructive" : "text-muted-foreground/50"
        : isOpen ? "text-primary" : "text-muted-foreground/50"
    )} />
  </motion.div>
);

const ProblemSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [expandedProblem, setExpandedProblem] = useState<number | null>(null);
  const [expandedSolution, setExpandedSolution] = useState<number | null>(null);

  return (
    <section ref={ref} className="py-20 md:py-28 relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background to-accent/20" />
      <div className="container px-4 md:px-6">
        <div className={cn("text-center max-w-3xl mx-auto mb-12 md:mb-16 transition-all duration-700", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
          <motion.h2
            className="text-3xl md:text-4xl font-bold font-display mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            The Gap Between Where You Are and Where You Could Be
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-base md:text-lg leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Most professionals don't lack talent. They lack clarity on what's holding them back — and a system to fix it.
          </motion.p>
        </div>

        {/* Two-column: Problems left, Solutions right */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto mb-14">
          {/* Left column - Problems */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-destructive uppercase tracking-widest mb-4 text-center md:text-left">The Problem</p>
            {comparisons.map(({ problem }, i) => {
              const ProbIcon = problem.icon;
              const isOpen = expandedProblem === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true }}
                  className={cn(
                    "rounded-xl bg-card border border-border/50 transition-all duration-300 group",
                    isOpen && "border-destructive/30 shadow-md"
                  )}
                >
                  <button
                    onClick={() => setExpandedProblem(isOpen ? null : i)}
                    className="flex items-center gap-3 p-3 md:p-4 w-full text-left cursor-pointer"
                  >
                    <div className="h-8 w-8 md:h-9 md:w-9 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                      <ProbIcon className="h-4 w-4 text-destructive" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs md:text-sm font-semibold font-display">{problem.title}</h3>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-[10px] md:text-[11px] text-muted-foreground mt-1 leading-relaxed"
                          >
                            {problem.desc}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                    <DropdownCircle isOpen={isOpen} variant="problem" />
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Right column - Solutions */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4 text-center md:text-left">Our Solution</p>
            {comparisons.map(({ solution }, i) => {
              const SolIcon = solution.icon;
              const isOpen = expandedSolution === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true }}
                  onClick={() => setExpandedSolution(isOpen ? null : i)}
                  className={cn(
                    "rounded-xl border transition-all duration-300 overflow-hidden cursor-pointer",
                    isOpen
                      ? "bg-primary/5 border-primary/30 shadow-md"
                      : "bg-card border-border/50 opacity-50"
                  )}
                >
                  <div className="flex items-center gap-3 p-3 md:p-4">
                    <div className={cn(
                      "h-8 w-8 md:h-9 md:w-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300",
                      isOpen ? "gradient-primary shadow-glow" : "bg-accent"
                    )}>
                      <SolIcon className={cn("h-4 w-4 transition-colors duration-300", isOpen ? "text-primary-foreground" : "text-primary")} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs md:text-sm font-semibold font-display">{solution.title}</h3>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-[10px] md:text-[11px] text-muted-foreground mt-1 leading-relaxed"
                          >
                            {solution.desc}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                    <DropdownCircle isOpen={isOpen} variant="solution" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Closing */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.5 }} viewport={{ once: true }} className="text-center">
          <p className="text-base md:text-lg font-display font-semibold mb-2">
            From confusion to <span className="gradient-text">clarity.</span> From guessing to <span className="gradient-text">proof.</span>
          </p>
          <p className="text-sm text-muted-foreground mb-6">Stop hoping. Start measuring.</p>
          <Link to="/assessments">
            <Button size="lg" className="gradient-primary border-0 shadow-glow hover:opacity-90 gap-2 h-12 px-8">
              Check My Readiness <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSection;
