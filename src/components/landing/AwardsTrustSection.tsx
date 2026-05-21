import { ShieldCheck, Globe2, Lock, Scale, BrainCircuit, Accessibility, KeyRound, ServerCog } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

const awards = [
  { icon: ShieldCheck, label: "SOC 2 Type II", sub: "Certified" },
  { icon: Globe2, label: "GDPR", sub: "Compliant" },
  { icon: Lock, label: "ISO 27001", sub: "Certified" },
  { icon: Scale, label: "EEOC", sub: "Compliant" },
  { icon: BrainCircuit, label: "AI Ethics", sub: "Certified" },
  { icon: Accessibility, label: "WCAG 2.1", sub: "Accessible" },
  { icon: KeyRound, label: "256-bit AES", sub: "Encryption" },
  { icon: ServerCog, label: "99.9% Uptime", sub: "SLA Guaranteed" },
];

const AwardsTrustSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section className="py-16">
      <div className="container">
        <div
          ref={ref}
          className={cn("text-center mb-10 transition-all duration-700", isVisible ? "opacity-100" : "opacity-0 translate-y-6")}
        >
          <SectionBadge label="Trust & Compliance" icon={ShieldCheck} />
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Recognized for Security<br /><span className="text-primary">& Innovation</span></h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {awards.map(({ icon: Icon, label, sub }, i) => (
            <div
              key={label}
              className={cn(
                "group flex flex-col items-center gap-2 p-5 rounded-xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-md transition-all duration-300",
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              )}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                <Icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <span className="text-sm font-semibold text-center">{label}</span>
              <span className="text-xs text-muted-foreground">{sub}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AwardsTrustSection;
