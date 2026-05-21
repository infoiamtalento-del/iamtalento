import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { FileText, BrainCircuit, ClipboardCheck, UserCheck, CheckCircle2, Play } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

const DemoSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-28">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <SectionBadge label="See It In Action" icon={Play} />
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">AI Screening, Visualized</h2>
          <p className="text-muted-foreground text-lg">Watch how Talento processes a candidate in real time — from resume upload to match score.</p>
        </div>

        <div className={cn("max-w-4xl mx-auto transition-all duration-700", isVisible ? "opacity-100" : "opacity-0 translate-y-8")}>
          <div className="glass rounded-2xl p-6 md:p-8 shadow-glow">
            {/* Pipeline visualization */}
            <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
              {[
                { icon: FileText, label: "Resume Parsed", time: "1.2s" },
                { icon: BrainCircuit, label: "AI Analysis", time: "2.8s" },
                { icon: ClipboardCheck, label: "Skills Mapped", time: "0.5s" },
                { icon: UserCheck, label: "Match Scored", time: "0.3s" },
              ].map(({ icon: Icon, label, time }, i) => (
                <div key={label} className="flex items-center min-w-0">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.2, type: "spring" }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center"
                  >
                    <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center mb-2">
                      <Icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="text-xs font-medium whitespace-nowrap">{label}</span>
                    <span className="text-[10px] text-muted-foreground">{time}</span>
                  </motion.div>
                  {i < 3 && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      transition={{ delay: 0.5 + i * 0.2, duration: 0.4 }}
                      viewport={{ once: true }}
                      className="h-0.5 w-8 md:w-16 bg-gradient-to-r from-primary to-primary-glow mx-2 origin-left"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Result card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              viewport={{ once: true }}
              className="bg-card rounded-xl border border-border/50 p-5"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                    SC
                  </div>
                  <div>
                    <h4 className="font-semibold font-display">Sarah Chen</h4>
                    <p className="text-sm text-muted-foreground">Sr. Product Designer · 8 years exp.</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold font-display gradient-text">94%</div>
                  <p className="text-[10px] text-success font-medium">Excellent Match</p>
                </div>
              </div>

              {/* Skill breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { skill: "Technical Skills", score: 96 },
                  { skill: "Experience Fit", score: 92 },
                  { skill: "Culture Match", score: 88 },
                  { skill: "Growth Potential", score: 95 },
                ].map(({ skill, score }, i) => (
                  <div key={skill} className="text-center p-3 rounded-lg bg-secondary/40">
                    <p className="text-[10px] text-muted-foreground mb-1">{skill}</p>
                    <div className="relative h-14 w-14 mx-auto mb-1">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                        <motion.path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="hsl(var(--primary))"
                          strokeWidth="3"
                          strokeDasharray={`${score}, 100`}
                          initial={{ strokeDasharray: "0, 100" }}
                          whileInView={{ strokeDasharray: `${score}, 100` }}
                          transition={{ delay: 1.4 + i * 0.1, duration: 0.8 }}
                          viewport={{ once: true }}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">{score}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI reasoning */}
              <div className="mt-4 p-3 rounded-lg bg-accent/50 border border-primary/10">
                <p className="text-xs font-semibold text-accent-foreground mb-1 flex items-center gap-1.5">
                  <BrainCircuit className="h-3.5 w-3.5" /> AI Reasoning
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Strong portfolio alignment with role requirements. 8 years of product design with proven leadership.
                  Figma, user research, and design systems expertise matches 96% of required skills. Recommended for shortlist.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
