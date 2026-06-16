import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ShieldCheck, FileText, Clock, User, X, BadgeCheck,
  ShieldCheck as ShieldIcon, BarChart3, Target, ArrowRight,
} from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

import microsoftLogo from "@/assets/company-logos/microsoft.svg";
import amazonLogo from "@/assets/company-logos/amazon.svg";
import googleLogo from "@/assets/company-logos/google.svg";
import ibmLogo from "@/assets/company-logos/ibm.svg";
import oracleLogo from "@/assets/company-logos/oracle.svg";
import infosysLogo from "@/assets/company-logos/infosys.svg";
import tcsLogo from "@/assets/company-logos/tcs.svg";
import wiproLogo from "@/assets/company-logos/wipro.svg";
import accentureLogo from "@/assets/company-logos/accenture.svg";
import capgeminiLogo from "@/assets/company-logos/capgemini.svg";

const partners = [
  { name: "Microsoft", logo: microsoftLogo },
  { name: "Amazon", logo: amazonLogo },
  { name: "Google", logo: googleLogo },
  { name: "IBM", logo: ibmLogo },
  { name: "Oracle", logo: oracleLogo },
  { name: "Infosys", logo: infosysLogo },
  { name: "TCS", logo: tcsLogo },
  { name: "Wipro", logo: wiproLogo },
  { name: "Accenture", logo: accentureLogo },
  { name: "Capgemini", logo: capgeminiLogo },
];

const problems = [
  { icon: FileText, title: "Resumes look good.", desc: "Skills don't always match." },
  { icon: Clock, title: "Time-to-hire is too long.", desc: "Good candidates lose interest." },
  { icon: User, title: "Bad hires are expensive.", desc: "Productivity, morale and cost take the hit." },
];

const solutions = [
  { icon: ShieldIcon, title: "Verified &", title2: "Job-Ready Talent" },
  { icon: BarChart3, title: "Data-Backed", title2: "Hiring Decisions" },
  { icon: Target, title: "Better Quality Hires,", title2: "Stronger Teams" },
];

const TrustAuthoritySection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-14 md:py-20 bg-background">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className={cn(
          "text-center max-w-3xl mx-auto mb-10 md:mb-12 transition-all duration-700",
          isVisible ? "opacity-100" : "opacity-0 translate-y-8"
        )}>
          <SectionBadge label="Where Verified Talent Gets Hired" icon={Target} />
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4 leading-tight">
            Trusted by Employers.<br />
            <span className="text-primary">Powered by Data.</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Career Intelligence Reports help companies identify, benchmark, and hire job-ready talent with confidence.
          </p>
        </div>

        {/* Trust strip with infinite-scrolling logos */}
        <div className="rounded-2xl border border-border bg-card mb-10 overflow-hidden">
          <div className="flex flex-col md:flex-row items-stretch">
            <div className="text-center md:text-left shrink-0 px-6 md:px-8 py-5 md:border-r border-border flex flex-col justify-center bg-muted/30">
              <div className="text-primary font-bold text-sm">TRUSTED BY 200+</div>
              <div className="text-xs text-muted-foreground tracking-wide">LEADING COMPANIES</div>
            </div>

            <div
              className="flex-1 relative overflow-hidden py-5"
              style={{
                maskImage:
                  "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
              }}
            >
              <div className="flex w-max animate-[marquee_30s_linear_infinite]">
                {[0, 1].map((g) => (
                  <div key={g} className="flex items-center gap-12 pr-12 shrink-0" aria-hidden={g === 1}>
                    {partners.map((p, i) => (
                      <img
                        key={`${p.name}-${g}-${i}`}
                        src={p.logo}
                        alt={p.name}
                        className="h-7 md:h-8 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity shrink-0"
                        loading="lazy"
                      />
                    ))}
                  </div>
                ))}
              </div>
              <style>{`
                @keyframes marquee {
                  from { transform: translateX(0); }
                  to { transform: translateX(-50%); }
                }
              `}</style>
            </div>

            <div className="text-center md:text-right shrink-0 px-6 md:px-8 py-5 md:border-l border-border flex flex-col justify-center bg-muted/30">
              <div className="text-xs text-muted-foreground tracking-wide">
                and <span className="text-primary font-bold text-sm">12K+</span>
              </div>
              <div className="text-xs text-muted-foreground tracking-wide">VERIFIED HIRES</div>
            </div>
          </div>
        </div>

        {/* Two-card split: Problem | Solution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Problem card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-2xl bg-muted/40 border border-border p-8 md:p-10"
          >
            <h3 className="text-2xl md:text-3xl font-bold font-display leading-tight">
              Hiring is hard.<br />
              <span className="text-primary">We get it.</span>
            </h3>
            <div className="w-10 h-0.5 bg-border mt-4 mb-8" />
            <div className="space-y-6">
              {problems.map((p, i) => {
                const Icon = p.icon;
                return (
                  <div key={p.title} className={cn("flex items-center gap-4", i < problems.length - 1 && "pb-6 border-b border-border/60")}>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-foreground text-sm">{p.title}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{p.desc}</p>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <X className="h-3.5 w-3.5 text-primary" />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Solution card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-primary/5 border border-primary/10 p-8 md:p-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-background border border-primary/20 text-primary text-xs font-bold mb-5">
              <BadgeCheck className="h-3.5 w-3.5" />
              I AM TALENTO
            </div>
            <h3 className="text-2xl md:text-3xl font-bold font-display leading-tight">
              Verified skills.<br />
              <span className="text-primary">Better hires. Faster.</span>
            </h3>
            <div className="w-10 h-0.5 bg-primary/30 mt-4 mb-8" />

            <div className="grid grid-cols-3 gap-4 mb-8">
              {solutions.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className={cn("flex flex-col items-center text-center px-2", i < solutions.length - 1 && "border-r border-primary/10")}>
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <p className="font-bold text-foreground text-sm leading-tight">{s.title}</p>
                    <p className="font-bold text-foreground text-sm leading-tight">{s.title2}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors">
                Talk to Our Team
                <ArrowRight className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face" className="w-8 h-8 rounded-full ring-2 ring-background object-cover" alt="" />
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face" className="w-8 h-8 rounded-full ring-2 ring-background object-cover" alt="" />
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face" className="w-8 h-8 rounded-full ring-2 ring-background object-cover" alt="" />
                </div>
                <p className="text-xs text-muted-foreground leading-tight">
                  Join 200+ companies<br />hiring smarter every day
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TrustAuthoritySection;
