import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { Upload, FileText, BrainCircuit, Award, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionBadge from "@/components/ui/section-badge";

const steps = [
  { id: 0, label: "Upload Resume" },
  { id: 1, label: "AI Parsing" },
  { id: 2, label: "Score Calculation" },
  { id: 3, label: "Results & Badge" },
];

const extractedSkills = ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS", "System Design", "REST APIs", "Docker"];

const InteractiveDemoSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [step, setStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const runDemo = () => {
    if (isRunning) return;
    setIsRunning(true);
    setStep(0);
    setTimeout(() => setStep(1), 800);
    setTimeout(() => setStep(2), 2500);
    setTimeout(() => setStep(3), 4000);
    setTimeout(() => setIsRunning(false), 4500);
  };

  return (
    <section ref={ref} className="py-28">
      <div className="container">
        <div className={cn("text-center max-w-2xl mx-auto mb-16 transition-all duration-700", isVisible ? "opacity-100" : "opacity-0 translate-y-8")}>
          <SectionBadge label="Try It Now" icon={Sparkles} />
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">See AI Screening in Action</h2>
          <p className="text-muted-foreground text-lg">Watch how Talento transforms a résumé into an Industry Readiness Score in under 5 seconds.</p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-10 px-4">
            {steps.map(({ id, label }) => (
              <div key={id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-500",
                    step >= id
                      ? "gradient-primary text-primary-foreground border-transparent shadow-glow"
                      : "bg-card text-muted-foreground border-border"
                  )}>
                    {step > id ? <CheckCircle2 className="h-5 w-5" /> : id + 1}
                  </div>
                  <span className={cn("text-[10px] mt-2 font-medium transition-colors", step >= id ? "text-primary" : "text-muted-foreground")}>{label}</span>
                </div>
                {id < 3 && (
                  <div className="w-12 sm:w-20 h-0.5 mx-2 bg-border rounded-full overflow-hidden">
                    <motion.div
                      className="h-full gradient-primary rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: step > id ? "100%" : "0%" }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Demo Area */}
          <div className="glass rounded-2xl p-6 md:p-8 shadow-glow min-h-[320px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center w-full">
                  <div
                    onClick={runDemo}
                    className="border-2 border-dashed border-primary/30 rounded-2xl p-12 cursor-pointer hover:border-primary/60 hover:bg-accent/30 transition-all group"
                  >
                    <Upload className="h-12 w-12 text-primary/40 mx-auto mb-4 group-hover:text-primary group-hover:scale-110 transition-all" />
                    <p className="text-sm font-semibold mb-1">Click to Upload Sample Resume</p>
                    <p className="text-xs text-muted-foreground">or click to run the demo simulation</p>
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="parsing" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <div>
                      <p className="text-sm font-semibold">AI Parsing Resume...</p>
                      <p className="text-xs text-muted-foreground">Extracting skills, experience & qualifications</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-card border border-border/50">
                      <p className="text-[10px] text-muted-foreground mb-2 flex items-center gap-1"><FileText className="h-3 w-3" /> Extracted Info</p>
                      <p className="text-xs font-medium">Rahul Sharma</p>
                      <p className="text-[10px] text-muted-foreground">Sr. Software Engineer · 6 yrs exp.</p>
                      <p className="text-[10px] text-muted-foreground">B.Tech CS · IIT Delhi</p>
                    </div>
                    <div className="p-3 rounded-lg bg-card border border-border/50">
                      <p className="text-[10px] text-muted-foreground mb-2 flex items-center gap-1"><Sparkles className="h-3 w-3" /> Skills Detected</p>
                      <div className="flex flex-wrap gap-1">
                        {extractedSkills.map((s, i) => (
                          <motion.span
                            key={s}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-medium"
                          >
                            {s}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="scoring" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full text-center">
                  <BrainCircuit className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
                  <p className="text-sm font-semibold mb-2">AI is Calculating Your Industry Readiness Score</p>
                  <p className="text-xs text-muted-foreground mb-6">Benchmarking against 50,000+ professionals in your role...</p>
                  <div className="max-w-xs mx-auto">
                    <div className="h-3 rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        className="h-full gradient-primary rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
                  <div className="flex items-start gap-6 flex-col md:flex-row">
                    {/* Score Card */}
                    <div className="flex-1 p-5 rounded-xl bg-card border border-primary/20 shadow-lg">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative h-20 w-20 shrink-0">
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                            <motion.path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round"
                              initial={{ strokeDasharray: "0, 100" }}
                              animate={{ strokeDasharray: "85, 100" }}
                              transition={{ duration: 1 }}
                            />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-xl font-bold font-display gradient-text">85</span>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-success bg-success/10 px-2 py-0.5 rounded-full inline-block mb-1">Above Market</p>
                          <p className="text-sm font-bold font-display">Rahul Sharma</p>
                          <p className="text-[10px] text-muted-foreground">Sr. Software Engineer · Top 18%</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div className="p-2 rounded-lg bg-success/5"><span className="text-success font-semibold">✓</span> System Design</div>
                        <div className="p-2 rounded-lg bg-success/5"><span className="text-success font-semibold">✓</span> API Architecture</div>
                        <div className="p-2 rounded-lg bg-warning/5"><span className="text-warning font-semibold">↑</span> Cloud / DevOps</div>
                        <div className="p-2 rounded-lg bg-warning/5"><span className="text-warning font-semibold">↑</span> Data Modeling</div>
                      </div>
                    </div>

                    {/* Badge Earned */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                      className="shrink-0 p-5 rounded-xl bg-card border border-primary/20 shadow-lg text-center"
                    >
                      <Award className="h-12 w-12 text-primary mx-auto mb-3" />
                      <p className="text-sm font-bold font-display mb-1">Verified Skill Badge</p>
                      <p className="text-[10px] text-muted-foreground mb-3">Sr. Software Engineer</p>
                      <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-success bg-success/10 px-3 py-1 rounded-full">
                        <CheckCircle2 className="h-3 w-3" /> Earned
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Restart */}
          {step === 3 && (
            <div className="text-center mt-6">
              <Button variant="outline" onClick={() => { setStep(0); }} className="gap-2">
                <ArrowRight className="h-4 w-4 rotate-180" /> Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemoSection;
