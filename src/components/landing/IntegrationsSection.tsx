import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Plug } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

const integrations = [
  { name: "LinkedIn", category: "Sourcing" },
  { name: "Indeed", category: "Job Boards" },
  { name: "Greenhouse", category: "ATS" },
  { name: "Workday", category: "HRIS" },
  { name: "Slack", category: "Communication" },
  { name: "Google Workspace", category: "Productivity" },
  { name: "Microsoft Teams", category: "Communication" },
  { name: "BambooHR", category: "HRIS" },
  { name: "Lever", category: "ATS" },
  { name: "SAP SuccessFactors", category: "Enterprise" },
  { name: "Zoom", category: "Interviews" },
  { name: "Calendly", category: "Scheduling" },
];

const IntegrationsSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section ref={ref} className="py-28 bg-card/50">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <SectionBadge label="Integrations" icon={Plug} />
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Works With Your HR Stack</h2>
          <p className="text-muted-foreground text-lg">Seamlessly connect with your existing ATS, HRIS, job boards, and communication tools.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {integrations.map(({ name, category }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              className="flex flex-col items-center gap-2 p-5 rounded-xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300 cursor-default group"
            >
              <div className="h-11 w-11 rounded-xl bg-secondary flex items-center justify-center text-sm font-bold text-muted-foreground group-hover:gradient-primary group-hover:text-primary-foreground transition-all duration-300">
                {name[0]}
              </div>
              <span className="text-xs font-medium text-foreground">{name}</span>
              <span className="text-[10px] text-muted-foreground">{category}</span>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-8">
          + 100 more integrations available. <span className="text-primary font-medium cursor-pointer hover:underline">See all integrations →</span>
        </p>
      </div>
    </section>
  );
};

export default IntegrationsSection;
