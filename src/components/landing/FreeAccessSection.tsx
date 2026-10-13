import { motion } from "framer-motion";
import { Users, Trophy, Video, ArrowRight, Gift, CheckCircle2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionBadge from "@/components/ui/section-badge";

type Perk = {
  icon: LucideIcon;
  title: string;
  description: string;
  bullets: string[];
  cta: string;
  accent: string;
};

const perks: Perk[] = [
  {
    icon: Users,
    title: "Networking Events",
    description: "Meet recruiters, founders, and peers at exclusive in-person and virtual meetups.",
    bullets: ["Curated industry meetups", "Recruiter mixers", "Founder roundtables"],
    cta: "Browse events",
    accent: "text-[#0d5cb2] bg-[#0d5cb2]/10",
  },
  {
    icon: Trophy,
    title: "Hackathons",
    description: "Compete in live hackathons hosted by top companies. Build, ship, and get hired.",
    bullets: ["Free entry", "Cash prizes & badges", "Direct interview tracks"],
    cta: "Join hackathons",
    accent: "text-yellow-600 bg-yellow-400/15",
  },
  {
    icon: Video,
    title: "Access to Webinars",
    description: "Unlimited access to live and on-demand sessions from industry leaders.",
    bullets: ["Live expert sessions", "Recorded library", "Certificates of attendance"],
    cta: "Watch webinars",
    accent: "text-[#0d5cb2] bg-[#0d5cb2]/10",
  },
];

const FreeAccessSection = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <SectionBadge label="Free Access" icon={Gift} />
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold font-display leading-tight"
          >
            Get <span className="text-[#0d5cb2]">Free Access</span> to Everything That Grows Your Career
          </motion.h2>
          <p className="mt-3 text-muted-foreground">
            No paywall. No catch. Just the events, hackathons, and webinars you actually need.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {perks.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative rounded-3xl bg-card border border-border p-6 md:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className={`h-12 w-12 rounded-2xl ${p.accent} flex items-center justify-center`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-400 text-slate-900 text-[10px] font-extrabold tracking-wider uppercase">
                    Free
                  </span>
                </div>

                <h3 className="text-xl md:text-2xl font-bold font-display text-foreground mb-2 leading-tight">
                  {p.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                  {p.description}
                </p>

                <ul className="space-y-2 mb-6 flex-grow">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-foreground/85">
                      <CheckCircle2 className="h-4 w-4 text-[#0d5cb2] mt-0.5 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>

                <button className="mt-auto inline-flex items-center justify-between w-full px-4 py-3 rounded-xl bg-[#0d5cb2] text-white font-semibold text-sm hover:bg-[#0a4d96] transition-colors group/btn">
                  {p.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                </button>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Button
            size="lg"
            className="bg-[#0d5cb2] hover:bg-[#0a4d96] text-white gap-2 font-bold h-12 px-8 shadow-xl rounded-xl text-base"
          >
            Create Free Account <ArrowRight className="h-5 w-5" />
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            No credit card required · Lifetime free access to events & webinars
          </p>
        </div>
      </div>
    </section>
  );
};

export default FreeAccessSection;
