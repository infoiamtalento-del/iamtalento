import { motion } from "framer-motion";
import {
  Brain,
  Gauge,
  BarChart3,
  Wallet,
  Target,
  Compass,
  FileText,
  Mic,
  BadgeCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionBadge from "@/components/ui/section-badge";

type Item = {
  icon: LucideIcon;
  title: string;
  description: string;
  bullets: string[];
  example?: string;
  value?: string;
  image: string;
};

const items: Item[] = [
  {
    icon: Brain,
    title: "AI-Powered Skill Assessment",
    description: "A complete evaluation of your technical, functional, and problem-solving abilities.",
    bullets: [
      "Technical skills evaluation",
      "Functional knowledge assessment",
      "Industry-specific competency mapping",
      "Problem-solving evaluation",
    ],
    value: "Value Perceived: ₹999",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=900&q=80",
  },
  {
    icon: Gauge,
    title: "Employability Score",
    description: "A credit-score-style number that tells you exactly where you stand.",
    bullets: [
      "Employability Score: 78/100",
      "Industry Average: 62/100",
      "Top 10% Benchmark: 89/100",
    ],
    value: "“I know where I stand.”",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80",
  },
  {
    icon: BarChart3,
    title: "Industry Benchmarking Report",
    description: "Compare yourself against freshers, peers, and top performers.",
    bullets: [
      "Digital Marketing Skills: Top 25%",
      "Data Analytics Skills: Top 40%",
      "Leadership Skills: Top 60%",
    ],
    value: "“I know my competition.”",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80",
  },
  {
    icon: Wallet,
    title: "Salary Potential Report",
    description: "Know your real market value today — and what you can earn after upskilling.",
    bullets: [
      "Current Market Value: ₹8–10 LPA",
      "Potential after Upskilling: ₹12–15 LPA",
      "Roles available at current competency",
    ],
    value: "This alone can justify ₹1,999.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=80",
  },
  {
    icon: Target,
    title: "Personalized Skill Gap Analysis",
    description: "Pinpoint the exact skills holding you back from your next role.",
    bullets: [
      "Critical skill gaps",
      "Recommended certifications",
      "Priority learning areas",
    ],
    example:
      "You are 70% ready for a Performance Marketing Manager role. Improve GA4, Marketing Automation, and Data Visualization to become 90% job-ready.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&q=80",
  },
  {
    icon: Compass,
    title: "Career Path Recommendation",
    description: "Your next three career moves, mapped to future-proof roles.",
    bullets: [
      "SEO Specialist",
      "Growth Marketer",
      "Digital Marketing Manager",
    ],
    example: "Current Role → SEO Executive · Recommended Growth Path below.",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&q=80",
  },
  {
    icon: Mic,
    title: "Interview Readiness Score",
    description: "Walk into interviews knowing exactly where you'll shine — and stumble.",
    bullets: [
      "Communication",
      "Domain knowledge",
      "Problem-solving",
      "Readiness score + recommendations",
    ],
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=900&q=80",
  },
  {
    icon: BadgeCheck,
    title: "Digital Skill Passport",
    description: "A shareable, verified credential recruiters can trust at a glance.",
    bullets: [
      "Employability Score",
      "Skill Ratings",
      "Industry Benchmark",
      "Verification Date",
    ],
    value: "Strong USP — shareable with recruiters and employers.",
    image: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=900&q=80",
  },
];

const usps = [
  "Don't Guess Your Career. Measure It.",
  "Know Your Employability Score, Skill Gaps & Salary Potential in One Report.",
  "A Career Health Checkup for Professionals.",
  "Find Out Where You Stand Against Industry Standards & Top Performers.",
  "Get a Personalized Roadmap to Your Next Promotion, Salary Hike, or Career Move.",
];

const CareerIntelligencePackageSection = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <SectionBadge label="Career Intelligence Package" icon={Sparkles} />
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold font-display leading-tight"
          >
            Everything You Need to{" "}
            <span className="text-red-600">Measure & Master</span> Your Career
          </motion.h2>
          <p className="mt-4 text-muted-foreground text-base md:text-lg">
            12 powerful insights bundled into one report — for just{" "}
            <span className="text-foreground font-bold">₹1,999</span>.
          </p>

          <div className="mt-6 inline-flex items-baseline gap-3 px-6 py-3 rounded-2xl bg-red-600 text-white shadow-lg">
            <span className="text-xs uppercase tracking-wider font-semibold opacity-80">
              All-in Price
            </span>
            <span className="text-2xl md:text-3xl font-bold font-display">
              ₹1,999
            </span>
            <span className="text-xs line-through opacity-70">₹9,999+</span>
          </div>
        </div>

        {/* Minimal icon grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 max-w-6xl mx-auto">
          {items.map((item, idx) => {
            const Icon = item.icon;
            const isYellow = idx % 2 === 1;
            const accentBg = isYellow ? "bg-yellow-400" : "bg-red-600";
            const accentText = isYellow ? "text-red-900" : "text-white";
            const hoverBorder = isYellow ? "hover:border-yellow-400" : "hover:border-red-500";

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: (idx % 4) * 0.04 }}
                className={`group relative bg-card rounded-2xl border border-border ${hoverBorder} p-5 md:p-6 transition-all hover:shadow-lg`}
              >
                <span className="absolute top-3 right-3 text-[10px] font-bold text-muted-foreground/60 font-display">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div className={`h-12 w-12 rounded-xl ${accentBg} ${accentText} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-sm md:text-base font-bold font-display text-foreground leading-snug">
                  {item.title}
                </h3>
                <div className={`mt-3 h-0.5 w-8 ${accentBg} rounded-full`} />
              </motion.div>
            );
          })}
        </div>

        {/* USPs */}
        <div className="mt-20">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold font-display">
              Why People <span className="text-primary">Choose Us</span>
            </h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {usps.map((u, i) => (
              <motion.div
                key={u}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl p-5 bg-card border border-border hover:border-primary/40 hover:shadow-lg transition-all"
              >
                <span className="inline-block text-[10px] font-bold tracking-wider text-primary mb-2">
                  USP {i + 1}
                </span>
                <p className="text-foreground font-semibold leading-snug">
                  “{u}”
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 font-bold h-12 px-8 shadow-xl rounded-xl text-base"
          >
            Get My Career Report — ₹1,999 <ArrowRight className="h-5 w-5" />
          </Button>
          <p className="mt-3 text-sm text-muted-foreground">
            One-time payment · Instant access · Verified by I Am Talento
          </p>
        </div>
      </div>
    </section>
  );
};

export default CareerIntelligencePackageSection;
