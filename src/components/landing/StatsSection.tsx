import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Users, Briefcase, Clock, Target, TrendingUp, Award, BarChart3 } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

const stats = [
  { value: 500000, label: "Profiles Screened", suffix: "+", icon: Users, description: "candidates evaluated by AI" },
  { value: 12000, label: "Employers", suffix: "+", icon: Briefcase, description: "companies hiring with Talento" },
  { value: 73, label: "Faster Hiring", suffix: "%", icon: Clock, description: "reduction in time-to-hire" },
  { value: 98.5, label: "AI Accuracy", suffix: "%", icon: Target, description: "screening match rate" },
];

const AnimatedCounter = ({ target, suffix, active }: { target: number; suffix: string; active: boolean }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const duration = 2200;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target]);

  const display = target >= 1000
    ? Math.floor(count).toLocaleString()
    : target >= 100
    ? Math.floor(count).toString()
    : count.toFixed(1);

  return <span>{display}{suffix}</span>;
};

const StatsSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section ref={ref} className="py-28 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/3 blur-[120px]" />
      </div>

      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <SectionBadge label="Impact" icon={BarChart3} />
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Numbers That Speak</h2>
          <p className="text-muted-foreground">Real outcomes from real companies using Talento to transform their hiring.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ value, label, suffix, icon: Icon, description }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="relative text-center p-6 rounded-2xl bg-card border border-border/50 hover:shadow-lg hover:border-primary/20 transition-all duration-300 group"
            >
              <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center mx-auto mb-4 group-hover:gradient-primary transition-all duration-300">
                <Icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <p className="text-3xl md:text-4xl font-bold font-display gradient-text mb-1">
                <AnimatedCounter target={value} suffix={suffix} active={isVisible} />
              </p>
              <p className="text-sm font-semibold mb-1">{label}</p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
