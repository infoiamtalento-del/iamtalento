import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Code2, BarChart3, Megaphone, Landmark, HeartPulse, Cpu,
  Building2, GraduationCap, Palette, ShoppingCart, Home, Truck, ArrowRight, Globe,
} from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

const industries = [
  { icon: Code2, title: "Software & Tech", roles: "120+ roles" },
  { icon: BarChart3, title: "Data & Analytics", roles: "85+ roles" },
  { icon: Megaphone, title: "Marketing & Growth", roles: "60+ roles" },
  { icon: Landmark, title: "Finance & Banking", roles: "70+ roles" },
  { icon: HeartPulse, title: "Healthcare", roles: "55+ roles" },
  { icon: Cpu, title: "AI & Machine Learning", roles: "45+ roles" },
  { icon: Building2, title: "Consulting", roles: "40+ roles" },
  { icon: GraduationCap, title: "Education & EdTech", roles: "35+ roles" },
  { icon: Palette, title: "Design & Creative", roles: "50+ roles" },
  { icon: ShoppingCart, title: "E-commerce & Retail", roles: "45+ roles" },
  { icon: Home, title: "Real Estate", roles: "30+ roles" },
  { icon: Truck, title: "Logistics & Supply Chain", roles: "40+ roles" },
];

const SkillCategoriesSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section ref={ref} className="py-16 md:py-20 overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className={cn("text-center max-w-2xl mx-auto mb-10 transition-all duration-700", isVisible ? "opacity-100" : "opacity-0 translate-y-8")}>
          <SectionBadge label="Industry Coverage" icon={Globe} />
          <motion.h2
            className="text-3xl md:text-4xl font-bold font-display mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            We Speak Your<br />
            <span className="text-primary">Industry's Language</span>
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-base md:text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            Use assessments tailored to your industry.<br className="hidden md:block" /> Avoid generic skill tests.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {industries.map(({ icon: Icon, title, roles }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-5 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group cursor-default"
            >
              <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center mb-3 group-hover:gradient-primary transition-all duration-300">
                <Icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <p className="text-sm font-semibold font-display mb-0.5">{title}</p>
              <p className="text-xs text-primary font-medium">{roles}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/assessments">
            <Button variant="outline" className="border-border gap-2">
              Browse all 48+ industries <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SkillCategoriesSection;
