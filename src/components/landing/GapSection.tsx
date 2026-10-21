import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import {
  IndianRupee, TrendingDown, Target, XCircle,
  LineChart, UserCheck, Brain, BarChart3, ArrowRight, ChevronDown } from
"lucide-react";
import SectionBadge from "@/components/ui/section-badge";

const pairs = [
{
  num: "01",
  problem: { icon: IndianRupee, title: "Don't know if they're underpaid", desc: "Without real benchmarks, most professionals have no idea if their salary reflects their actual market value." },
  solution: { icon: LineChart, title: "Measured against real market benchmarks", desc: "Your skills are scored against live industry data so you know exactly where your compensation stands." }
},
{
  num: "02",
  problem: { icon: TrendingDown, title: "Skills don't match market expectations", desc: "What you know and what employers actually need are often misaligned, and no one tells you until it's too late." },
  solution: { icon: UserCheck, title: "Compared with professionals at your experience level", desc: "See how your skill profile stacks up against real peers with similar backgrounds and years of experience." }
},
{
  num: "03",
  problem: { icon: Target, title: "No clarity on what to improve", desc: "Generic advice and random courses waste time. You need to know precisely which skill gaps are costing you the most." },
  solution: { icon: Brain, title: "Skill gaps identified instantly", desc: "AI pinpoints exactly which skills are holding you back and prioritizes what to fix first for maximum impact." }
},
{
  num: "04",
  problem: { icon: XCircle, title: "Applying blindly without performance proof", desc: "Resumes and cover letters don't prove capability. Hiring teams can't see your actual skill level, so they guess." },
  solution: { icon: BarChart3, title: "Know if you're Above, At, or Below Market, clearly", desc: "Get a verified performance profile that tells you and employers exactly where you rank in the market." }
}];


const GapSection = () => {
  const [openProblem, setOpenProblem] = useState<number | null>(null);
  const [openSolution, setOpenSolution] = useState<number | null>(null);

  return (
    <section className="py-14 md:py-20 bg-[#FBF4EB] relative">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <SectionBadge label="The Real Problem" icon={Target} />
          <motion.h2
            className="text-3xl md:text-4xl font-bold font-display mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>

            Know Your True
            <br />
            <span className="text-primary">Market Worth</span>
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-base md:text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}>

            Most professionals don't lack talent. They lack clarity on what's holding them back, and a system to fix it.
          </motion.p>
        </div>

        {/* Two-column grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-14">

          {/* Problems */}
          <div className="space-y-3">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-destructive mb-4 bg-destructive/10 px-3 py-1.5 rounded-full border border-destructive/20">The Problem</p>
            {pairs.map(({ problem, num }, i) => {
              const Icon = problem.icon;
              const isOpen = openProblem === i;
              return (
                <motion.div
                  key={num}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                  className={cn(
                    "rounded-xl bg-card border transition-all duration-300",
                    isOpen ? "border-destructive/30 shadow-md" : "border-border/50"
                  )}>

                  <button
                    onClick={() => setOpenProblem(isOpen ? null : i)}
                    className="flex items-center gap-3 p-4 w-full text-left">

                    <div className="h-9 w-9 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-destructive" />
                    </div>
                    <span className="flex-1 text-sm font-bold text-foreground">{problem.title}</span>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                      <ChevronDown className={cn("h-4 w-4 transition-colors", isOpen ? "text-destructive" : "text-muted-foreground/40")} />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {isOpen &&
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-4 pb-4 text-xs text-muted-foreground leading-relaxed overflow-hidden">

                        {problem.desc}
                      </motion.p>
                    }
                  </AnimatePresence>
                </motion.div>);

            })}
          </div>

          {/* Solutions */}
          <div className="space-y-3">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary mb-4 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">Our Solution</p>
            {pairs.map(({ solution, num }, i) => {
              const Icon = solution.icon;
              const isOpen = openSolution === i;
              return (
                <motion.div
                  key={num}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                  className={cn(
                    "rounded-xl border cursor-pointer transition-all duration-300",
                    isOpen ?
                    "bg-primary/5 border-primary/30 shadow-md" :
                    "bg-card border-border/50 opacity-60"
                  )}
                  onClick={() => setOpenSolution(isOpen ? null : i)}>

                  <div className="flex items-center gap-3 p-4">
                    <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300", isOpen ? "bg-primary" : "bg-primary/10")}>
                      <Icon className={cn("h-4 w-4 transition-colors", isOpen ? "text-primary-foreground" : "text-primary")} />
                    </div>
                    <span className={cn("flex-1 text-sm font-bold transition-colors", isOpen ? "text-primary" : "text-foreground")}>
                      {solution.title}
                    </span>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                      <ChevronDown className={cn("h-4 w-4 transition-colors", isOpen ? "text-primary" : "text-muted-foreground/40")} />
                    </motion.div>
                  </div>
                  <AnimatePresence>
                    {isOpen &&
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-4 pb-4 text-xs text-muted-foreground leading-relaxed overflow-hidden">

                        {solution.desc}
                      </motion.p>
                    }
                  </AnimatePresence>
                </motion.div>);

            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center">

          <p className="text-base md:text-lg font-semibold mb-2 text-foreground">
            From confusion to <span className="text-primary">clarity.</span> From guessing to <span className="text-primary">proof.</span>
          </p>
          <p className="text-sm text-muted-foreground mb-6">Stop hoping. Start measuring.</p>
          <Link
            to="/assessments"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 transition-opacity">

            Check My Readiness <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>);

};

export default GapSection;