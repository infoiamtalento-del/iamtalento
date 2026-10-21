import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp, IndianRupee, Clock, UserCheck, ShieldCheck } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

const outcomes = [
  {
    icon: Clock,
    metric: "73%",
    label: "Faster Time-to-Hire",
    before: "45 days average",
    after: "12 days average",
    color: "text-primary",
  },
  {
    icon: IndianRupee,
    metric: "60%",
    label: "Lower Cost-per-Hire",
    before: "₹3.9L per hire",
    after: "₹1.6L per hire",
    color: "text-success",
  },
  {
    icon: UserCheck,
    metric: "40%",
    label: "Better Quality of Hire",
    before: "Based on résumé keywords",
    after: "Verified skill scores",
    color: "text-primary",
  },
  {
    icon: ShieldCheck,
    metric: "95%",
    label: "Assessment Integrity Rate",
    before: "Unverified self-claims",
    after: "AI-proctored verified scores",
    color: "text-success",
  },
];

const OutcomesSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section ref={ref} className="py-28 bg-card/50">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <SectionBadge label="Proven ROI" icon={TrendingUp} />
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Outcomes That Matter to Leadership</h2>
          <p className="text-muted-foreground text-lg">Measurable improvements across every hiring KPI, data from 12,000+ employers using verified talent pipelines.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {outcomes.map(({ icon: Icon, metric, label, before, after, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-card border border-border/50 hover:shadow-xl hover:border-primary/10 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center group-hover:gradient-primary transition-all duration-300">
                  <Icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>
                <span className={cn("text-2xl font-bold font-display", color)}>{metric}</span>
              </div>
              <h3 className="text-sm font-semibold font-display mb-4">{label}</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-3.5 w-3.5 text-destructive shrink-0" />
                  <div className="flex-1">
                    <div className="h-1.5 rounded-full bg-destructive/20 overflow-hidden">
                      <motion.div className="h-full rounded-full bg-destructive/40" initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }} viewport={{ once: true }} />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">Before: {before}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3.5 w-3.5 text-success shrink-0" />
                  <div className="flex-1">
                    <div className="h-1.5 rounded-full bg-success/20 overflow-hidden">
                      <motion.div className="h-full rounded-full bg-success" initial={{ width: 0 }} whileInView={{ width: "60%" }} transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }} viewport={{ once: true }} />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">After: {after}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OutcomesSection;
