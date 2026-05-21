import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { Shield, Lock, Eye, Brain, FileCheck, CheckCircle } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

const compliancePoints = [
  { icon: Shield, title: "GDPR-Ready Framework", desc: "Full compliance with European data protection standards.", badge: "GDPR" },
  { icon: Lock, title: "Data Privacy Compliance", desc: "End-to-end encryption and secure data handling.", badge: "SOC 2" },
  { icon: FileCheck, title: "Secure Assessment Storage", desc: "All assessment data encrypted at rest and in transit.", badge: "ISO" },
  { icon: Brain, title: "Ethical AI Usage", desc: "Transparent, bias-audited AI models for fair scoring.", badge: "AI" },
  { icon: Eye, title: "Transparent Recording Policy", desc: "Clear disclosure of all monitoring and recording practices.", badge: "Policy" },
];

const ComplianceSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section ref={ref} className="py-14 md:py-20 bg-card/30">
      <div className="container">
        <div className={cn("text-center max-w-2xl mx-auto mb-12 transition-all duration-700", isVisible ? "opacity-100" : "opacity-0 translate-y-8")}>
          <SectionBadge label="Enterprise Compliance" icon={Shield} />
          <motion.h2
            className="text-3xl md:text-4xl font-bold font-display mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Your Data.<br /><span className="text-primary">Our Responsibility.</span>
          </motion.h2>
          <p className="text-muted-foreground text-lg">Enterprise-grade protection, ethical AI, and full regulatory compliance — because trust isn't optional.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
          {compliancePoints.map(({ icon: Icon, title, desc, badge }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-xl transition-all duration-300 text-center group relative"
            >
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full gradient-primary text-[8px] font-bold text-primary-foreground">
                {badge}
              </div>
              <div className="h-11 w-11 rounded-xl bg-accent flex items-center justify-center mx-auto mb-3 group-hover:gradient-primary transition-all duration-300">
                <Icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <h3 className="text-sm font-semibold font-display mb-1.5">{title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              <div className="flex items-center justify-center gap-1 mt-3">
                <CheckCircle className="h-3 w-3 text-primary" />
                <span className="text-[9px] text-primary font-medium">Verified</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComplianceSection;
