import { motion } from "framer-motion";
import { Brain, BookOpen, Rocket, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps = [
  { icon: Brain, title: "Assess", desc: "Know your gaps", color: "bg-primary/15 text-primary border-primary/30" },
  { icon: BookOpen, title: "Learn", desc: "Targeted courses", color: "bg-foreground/10 text-foreground border-foreground/20" },
  { icon: Rocket, title: "Apply", desc: "Get job-matched", color: "bg-white/30 text-foreground border-white/40" },
];

const checklist = [
  "3 courses recommended",
  "2 projects assigned",
  "1 masterclass queued",
];

const PersonalizedPathSection = () => (
  <section className="py-16 md:py-24" id="path">
    <div className="container px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-2xl bg-card border shadow-lg p-8 md:p-12 lg:p-16"
      >
        {/* Accent top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-warning to-primary" />

        <div className="relative z-10 grid lg:grid-cols-[1fr_340px] gap-12 items-start">
          {/* Left column */}
          <div>
            {/* Badge */}
            <div className="flex items-center gap-2 mb-6">
              <span className="w-6 h-px bg-foreground" />
              <span className="text-xs font-semibold tracking-widest uppercase text-foreground/80">
                Personalized For You
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4 text-foreground leading-tight">
              Your AI-Curated Learning Path<br />
              <span className="text-primary">Is Ready</span>
            </h2>

            <p className="text-foreground/70 max-w-lg mb-10 leading-relaxed">
              Based on your profile and readiness score, we map the most relevant route toward your target role,<br className="hidden md:block" />learn with direction, not guesswork.
            </p>

            {/* Step row with connectors */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-0 mb-10">
              {steps.map((s, i) => (
                <div key={s.title} className="flex items-center gap-0">
                  <div className="flex items-center gap-3">
                    <div className={`h-12 w-12 rounded-full border flex items-center justify-center shrink-0 ${s.color}`}>
                      <s.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold font-display text-foreground text-sm">{s.title}</p>
                      <p className="text-xs text-foreground/60">{s.desc}</p>
                    </div>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="hidden sm:block w-16 lg:w-24 h-px border-t border-dashed border-foreground/20 mx-4" />
                  )}
                </div>
              ))}
            </div>

            <Link to="/profile">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 border-0 gap-2 h-12 px-6 rounded-lg">
                View My Path <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Right column — match rate card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center lg:text-right"
          >
            <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">
              Match Rate After Path
            </p>
            <p className="text-7xl md:text-8xl font-bold font-display text-primary leading-none mb-1">
              94<span className="text-5xl md:text-6xl">%</span>
            </p>
            <p className="text-sm text-foreground/60 mb-6">Projected employer match rate</p>

            <div className="space-y-2.5 inline-flex flex-col items-start">
              {checklist.map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-sm text-foreground/80">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default PersonalizedPathSection;
