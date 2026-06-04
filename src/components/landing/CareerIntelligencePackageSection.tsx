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
  Play,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionBadge from "@/components/ui/section-badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
            9 powerful insights bundled into one report — for just{" "}
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

        {/* Carousel: left content, right video */}
        <Carousel opts={{ loop: true, align: "start" }} className="max-w-6xl mx-auto">
          <CarouselContent>
            {items.map((item, idx) => {
              const Icon = item.icon;
              const isYellow = idx % 2 === 1;
              const accentBg = isYellow ? "bg-yellow-400" : "bg-red-600";
              const accentText = isYellow ? "text-red-900" : "text-white";
              const accentBar = isYellow ? "bg-yellow-400" : "bg-red-600";

              return (
                <CarouselItem key={item.title}>
                  <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-center bg-card rounded-3xl border border-border p-6 md:p-10 shadow-sm">
                    {/* Left: content */}
                    <div className="order-2 md:order-1">
                      <div className="flex items-center gap-3 mb-5">
                        <div className={`h-12 w-12 rounded-xl ${accentBg} ${accentText} flex items-center justify-center shadow-md`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-bold text-muted-foreground/70 font-display">
                          {String(idx + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold font-display text-foreground leading-tight mb-3">
                        {item.title}
                      </h3>
                      <div className={`h-1 w-12 ${accentBar} rounded-full mb-4`} />
                      <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-5">
                        {item.description}
                      </p>
                      <ul className="space-y-2 mb-5">
                        {item.bullets.map((b) => (
                          <li key={b} className="flex items-start gap-2 text-sm md:text-base text-foreground/90">
                            <span className={`mt-2 h-1.5 w-1.5 rounded-full shrink-0 ${accentBar}`} />
                            {b}
                          </li>
                        ))}
                      </ul>
                      {(item.example || item.value) && (
                        <p className="text-sm italic text-muted-foreground border-l-2 border-border pl-3">
                          {item.example || item.value}
                        </p>
                      )}
                    </div>

                    {/* Right: video card */}
                    <div className="order-1 md:order-2">
                      <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl group">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                        <button className="absolute inset-0 flex items-center justify-center" aria-label="Play video">
                          <span className={`h-16 w-16 md:h-20 md:w-20 rounded-full ${accentBg} ${accentText} flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform`}>
                            <Play className="h-7 w-7 md:h-8 md:w-8 fill-current ml-1" />
                          </span>
                        </button>
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
                          <span className="px-2 py-1 rounded-md bg-black/40 backdrop-blur">Watch demo</span>
                          <span className="px-2 py-1 rounded-md bg-black/40 backdrop-blur">02:14</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-6 h-14 w-14 bg-red-600 hover:bg-red-700 text-white border-2 border-white shadow-2xl shadow-red-600/40 hover:scale-110 transition-all [&_svg]:h-6 [&_svg]:w-6" />
          <CarouselNext className="hidden md:flex -right-6 h-14 w-14 bg-red-600 hover:bg-red-700 text-white border-2 border-white shadow-2xl shadow-red-600/40 hover:scale-110 transition-all [&_svg]:h-6 [&_svg]:w-6" />
        </Carousel>


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
