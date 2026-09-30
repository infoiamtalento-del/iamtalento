// ============= Full file contents =============

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Gauge,
  BarChart3,
  Wallet,
  Target,
  Compass,
  Mic,
  BadgeCheck,
  ArrowRight,
  Sparkles,
  Calendar,
  Code2,
  Radio,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionBadge from "@/components/ui/section-badge";
import { Link } from "react-router-dom";

import eventNetworking from "@/assets/event-networking.jpg";
import eventHackathon from "@/assets/event-hackathon.jpg";
import eventWebinar from "@/assets/event-webinar.jpg";
import eventPodcasts from "@/assets/event-podcasts.jpg";

type Item = {
  icon: LucideIcon;
  title: string;
};

const items: Item[] = [
  { icon: Brain, title: "AI-Powered Skill Assessment" },
  { icon: Gauge, title: "Employability Score" },
  { icon: BarChart3, title: "Industry Benchmarking Report" },
  { icon: Wallet, title: "Salary Potential Report" },
  { icon: Target, title: "Personalized Skill Gap Analysis" },
  { icon: Compass, title: "Career Path Recommendation" },
  { icon: Mic, title: "Interview Readiness Score" },
  { icon: BadgeCheck, title: "Digital Skill Passport" },
];

type Benefit = {
  icon: LucideIcon;
  title: string;
  description: string;
  image: string;
  link: string;
  color: string;
};

const benefits: Benefit[] = [
  {
    icon: Calendar,
    title: "Networking Events",
    description: "Connect with hiring managers and peers at curated career meetups.",
    image: eventNetworking,
    link: "/meetups",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Code2,
    title: "Hackathons",
    description: "Build, compete and showcase your skills at top hackathons.",
    image: eventHackathon,
    link: "/hackathons",
    color: "bg-[hsl(33,100%,50%)]/10 text-[hsl(33,100%,50%)]",
  },
  {
    icon: Radio,
    title: "Online Webinars",
    description: "Live webinars and workshops you can join from anywhere.",
    image: eventWebinar,
    link: "/webinars",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Mic,
    title: "Podcasts",
    description: "Career insights and expert conversations, on demand.",
    image: eventPodcasts,
    link: "/podcasts",
    color: "bg-primary/10 text-primary",
  },
];

const CareerIntelligencePackageSection = ({ beforeCta }: { beforeCta?: ReactNode } = {}) => {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <SectionBadge label="Skill Assessment Report" icon={Sparkles} />
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold font-display leading-[1.15]"
          >
            Get Your Career Intelligence
            <br />
            <span className="text-primary">Report Today</span>
          </motion.h2>
          <p className="mt-4 text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Discover your strengths, identify skill gaps, benchmark against industry standards,
            <br className="hidden md:block" />
            and unlock opportunities with confidence.
          </p>

          <div className="mt-6 inline-flex items-baseline gap-3 px-6 py-3 rounded-2xl bg-red-500 text-white shadow-lg">
            <span className="text-xs uppercase tracking-wider font-semibold opacity-80">
              All-in Price
            </span>
            <span className="text-2xl md:text-3xl font-bold font-display">
              ₹1,999
            </span>
            <span className="text-xs line-through opacity-70">₹9,999+</span>
          </div>
        </div>

        {/* List + benefits grid layout */}
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] gap-8 max-w-6xl mx-auto items-stretch bg-card rounded-3xl border border-border p-4 md:p-6 shadow-sm">
          {/* Left: static insight list */}
          <div className="lg:border-r lg:border-border lg:pr-4">
            <h3 className="text-lg font-bold font-display text-foreground mb-1 px-2">
              What's inside
            </h3>
            <p className="text-xs text-muted-foreground mb-3 px-2">
              Everything included in your report.
            </p>
            <ul className="space-y-1">
              {items.map((item, idx) => {
                const Icon = item.icon;
                const itemYellow = idx % 2 === 1;
                const itemAccentBg = itemYellow ? "bg-yellow-400" : "bg-red-500";
                const itemAccentText = itemYellow ? "text-red-900" : "text-white";

                return (
                  <li
                    key={item.title}
                    className="flex items-center gap-3 text-left p-2.5 rounded-xl"
                  >
                    <div
                      className={`h-9 w-9 rounded-lg ${itemAccentBg} ${itemAccentText} flex items-center justify-center shadow-sm shrink-0`}
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-bold text-muted-foreground/70 font-display tracking-wide">
                        {String(idx + 1).padStart(2, "0")} /{" "}
                        {String(items.length).padStart(2, "0")}
                      </div>
                      <div className="text-sm font-bold font-display text-foreground leading-tight truncate">
                        {item.title}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right: 4-box grid of extra benefits */}
          <div>
            <h3 className="text-lg font-bold font-display text-foreground mb-1 px-1">
              Plus, more benefits of your report
            </h3>
            <p className="text-xs text-muted-foreground mb-4 px-1">
              Your Career Intelligence Report also unlocks these career platforms.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 h-full">
              {benefits.map(({ icon: Icon, title, description, image, link, color }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="h-full"
                >
                  <Link
                    to={link}
                    className="flex flex-col rounded-xl bg-background border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 h-full group overflow-hidden"
                  >
                    <div className="relative h-28 overflow-hidden shrink-0">
                      <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        width={800}
                        height={600}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <div className={`h-9 w-9 rounded-lg ${color} flex items-center justify-center mb-2.5`}>
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <p className="text-sm font-semibold font-display mb-1">{title}</p>
                      <p className="text-xs text-muted-foreground mb-2.5">{description}</p>
                      <span className="text-xs font-medium text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                        Explore <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {beforeCta}

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
