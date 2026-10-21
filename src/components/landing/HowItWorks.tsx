import { UserRoundPlus, ListChecks, ShieldCheck, Trophy, Rocket } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

const steps = [
  {
    icon: UserRoundPlus,
    title: "Build Your Skill Profile",
    desc: "AI parses your resume, LinkedIn, and portfolio into a verified skill profile.",
  },
  {
    icon: ListChecks,
    title: "Pick Your Assessment",
    desc: "Choose from 200+ domain-specific, role-based assessments.",
  },
  {
    icon: ShieldCheck,
    title: "Take a Proctored Test",
    desc: "20+ anti-cheating features with webcam proctoring and AI analysis.",
  },
  {
    icon: Trophy,
    title: "Get Your Readiness Report",
    desc: "AI-powered score with peer benchmarking and skill gap analysis.",
  },
  {
    icon: Rocket,
    title: "Earn Your Badge & Land Jobs",
    desc: "Earn a Verified Skill Badge and apply to 100+ matched jobs.",
  },
];

const HowItWorks = () => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container">
        <div
          ref={ref}
          className={cn(
            "text-center max-w-2xl mx-auto mb-14 transition-all duration-700",
            isVisible ? "opacity-100" : "opacity-0 translate-y-6"
          )}
        >
          <SectionBadge label="How It Works" icon={Rocket} />
          <motion.h2
            className="text-3xl md:text-4xl font-bold font-display mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Five Steps. One <span className="text-primary">Verified</span> You.
          </motion.h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            From resume to Industry Readiness Score, in minutes, not months.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-center group"
            >
              <p className="text-sm font-bold text-primary mb-3">Step {i + 1}</p>
              <div className="relative mx-auto mb-5">
                <div
                  className="h-20 w-20 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300"
                  style={{
                    background: "hsl(33 100% 95%)",
                    border: "1px solid hsl(33 100% 80%)",
                  }}
                >
                  <Icon className="h-9 w-9 text-primary" />
                </div>
              </div>
              <p className="text-base font-semibold font-display mb-1.5">{title}</p>
              <p className="text-sm text-muted-foreground leading-snug">{desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/assessments">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
              Start Your Assessment <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
