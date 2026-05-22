import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, FileText, Play, Award, Zap } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

const howItWorks = [
  { step: "01", title: "Register", desc: "Pick your webinar and secure your seat in under 60 seconds.", icon: CheckCircle },
  { step: "02", title: "Get Pre-Read", desc: "We send you context material 24 hours before so you arrive prepared.", icon: FileText },
  { step: "03", title: "Attend Live", desc: "Interact, ask questions, participate in polls, and learn in real time.", icon: Play },
  { step: "04", title: "Get Certified", desc: "Download your certificate and auto-add it to your I Am Talento profile.", icon: Award },
];

const WEBINAR_FLIP_INTERVAL = 3000;

const WebinarHowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % howItWorks.length);
    }, WEBINAR_FLIP_INTERVAL);
    return () => clearInterval(id);
  }, []);

  const step = howItWorks[activeStep];
  const Icon = step.icon;

  return (
    <section className="py-20 md:py-24">
      <div className="container px-4 md:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14 text-center flex flex-col items-center">
          <SectionBadge label="How It Works" icon={Zap} />
          <h2 className="text-3xl md:text-4xl font-bold font-display mt-4 mb-3">
            From Registration to<br /><span className="text-primary">Real Skill in 4 Steps</span>
          </h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-10 items-stretch mx-auto max-w-5xl">
          <div className="w-full lg:w-[360px] shrink-0 flex" style={{ perspective: "1200px" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-3xl p-10 bg-primary shadow-2xl h-full flex flex-col justify-between w-full"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="h-14 w-14 rounded-2xl bg-primary-foreground/15 backdrop-blur-sm flex items-center justify-center mb-8">
                  <Icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="text-6xl font-bold font-display text-primary-foreground/25 block mb-3">{step.step}</motion.span>
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="text-2xl font-bold font-display text-primary-foreground mb-3">{step.title}</motion.p>
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                  className="text-primary-foreground/70 text-sm leading-relaxed">{step.desc}</motion.p>
                <div className="mt-10 h-1 rounded-full bg-primary-foreground/15 overflow-hidden">
                  <motion.div className="h-full rounded-full bg-primary-foreground/60"
                    initial={{ width: "0%" }} animate={{ width: "100%" }}
                    transition={{ duration: WEBINAR_FLIP_INTERVAL / 1000, ease: "linear" }} />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex-1 space-y-3">
            {howItWorks.map(({ step: s, title, desc, icon: StepIcon }, i) => {
              const isActive = i === activeStep;
              return (
                <motion.button key={s} onClick={() => setActiveStep(i)}
                  initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  className={`w-full text-left flex items-start gap-4 rounded-2xl p-5 transition-all duration-300 ${isActive ? "bg-accent border-2 border-primary/20 shadow-md" : "border border-border bg-card hover:border-primary/10"}`}>
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${isActive ? "bg-primary" : "bg-accent"}`}>
                    <StepIcon className={`h-5 w-5 transition-colors duration-300 ${isActive ? "text-primary-foreground" : "text-primary"}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold ${isActive ? "text-primary" : "text-muted-foreground"}`}>{s}</span>
                      <p className="text-sm font-bold font-display text-foreground">{title}</p>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                  {isActive && (
                    <motion.div layoutId="webinar-step-indicator-home"
                      className="ml-auto h-2.5 w-2.5 rounded-full bg-primary shrink-0 mt-4"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WebinarHowItWorksSection;
