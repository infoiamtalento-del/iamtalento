import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Monitor, DollarSign, Megaphone, Heart, Settings, Palette, ArrowRight, Clock, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionBadge from "@/components/ui/section-badge";
import { cn } from "@/lib/utils";

const categories = [
  { id: "tech", label: "Technology", icon: Monitor },
  { id: "finance", label: "Finance", icon: DollarSign },
  { id: "marketing", label: "Marketing", icon: Megaphone },
  { id: "healthcare", label: "Healthcare", icon: Heart },
  { id: "operations", label: "Operations", icon: Settings },
  { id: "design", label: "Design", icon: Palette },
];

const masterclasses: Record<string, { title: string; duration: string; level: string; features: string[] }[]> = {
  tech: [
    { title: "Cracking the Tech Interview in 2025", duration: "4 hrs", level: "Advanced", features: ["Mock Q&A", "Live Simulation", "Expert Tips"] },
    { title: "System Design for Senior Engineers", duration: "6 hrs", level: "Advanced", features: ["Case Studies", "Architecture Deep-Dive", "Whiteboard Session"] },
    { title: "Full-Stack Web Dev Bootcamp", duration: "8 hrs", level: "Intermediate", features: ["Real Projects", "Code Reviews", "Deployment"] },
  ],
  finance: [
    { title: "Financial Modelling Essentials", duration: "5 hrs", level: "Intermediate", features: ["Excel Mastery", "Valuation", "Case Studies"] },
    { title: "Investment Banking Interview Prep", duration: "3 hrs", level: "Advanced", features: ["Behavioural Q&A", "Technical Drills", "Pitch Books"] },
    { title: "FinTech Product Management", duration: "4 hrs", level: "Intermediate", features: ["Payment Systems", "Regulations", "User Flows"] },
  ],
  marketing: [
    { title: "Growth Hacking Masterclass", duration: "3 hrs", level: "Intermediate", features: ["A/B Testing", "Funnel Optimisation", "Analytics"] },
    { title: "SEO & Content Strategy 2025", duration: "4 hrs", level: "Beginner", features: ["Keyword Research", "On-Page SEO", "AI Writing"] },
    { title: "Social Media Advertising", duration: "3 hrs", level: "Beginner", features: ["Meta Ads", "Campaign Setup", "ROI Tracking"] },
  ],
  healthcare: [
    { title: "Health-Tech Product Design", duration: "4 hrs", level: "Intermediate", features: ["Compliance", "UX for Health", "Case Studies"] },
    { title: "Medical Data Analytics", duration: "5 hrs", level: "Advanced", features: ["EHR Data", "Python for Health", "Visualisation"] },
    { title: "Healthcare Operations", duration: "3 hrs", level: "Beginner", features: ["Lean Ops", "Quality Metrics", "Workflow Design"] },
  ],
  operations: [
    { title: "Supply Chain Optimisation", duration: "5 hrs", level: "Intermediate", features: ["Logistics", "Demand Forecasting", "Lean"] },
    { title: "Project Management Pro", duration: "4 hrs", level: "Beginner", features: ["Agile", "Scrum", "Risk Management"] },
    { title: "Business Process Automation", duration: "3 hrs", level: "Intermediate", features: ["RPA Tools", "Workflow Design", "ROI Analysis"] },
  ],
  design: [
    { title: "UI/UX Portfolio Masterclass", duration: "4 hrs", level: "Intermediate", features: ["Case Studies", "Figma Advanced", "Presentation"] },
    { title: "Design Systems at Scale", duration: "5 hrs", level: "Advanced", features: ["Tokens", "Component Libraries", "Documentation"] },
    { title: "Motion Design for Apps", duration: "3 hrs", level: "Intermediate", features: ["Micro-interactions", "Prototyping", "Lottie"] },
  ],
};

const MasterclassesSection = () => {
  const [tab, setTab] = useState("tech");
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10">
          <SectionBadge label="Masterclasses" icon={Monitor} />
          <h2 className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3">
            Prepare for Interviews<br />
            <span className="text-primary">With Masterclasses</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            <span className="block">Prepare with role-specific lessons shaped around real hiring decisions.</span>
            <span className="block">Practice what interviews actually demand.</span>
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setTab(c.id)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-colors border",
                tab === c.id ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary/40"
              )}
            >
              <c.icon className="h-3.5 w-3.5" />
              {c.label}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {masterclasses[tab].map((m, i) => (
              <div key={m.title} className="rounded-xl border bg-card p-6 space-y-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <Clock className="h-3 w-3" /> {m.duration}
                  <span>·</span>
                  <BarChart3 className="h-3 w-3" /> {m.level}
                </div>
                <h3 className="font-bold font-display text-sm leading-snug">{m.title}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {m.features.map((f) => (
                    <span key={f} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{f}</span>
                  ))}
                </div>
                <Button size="sm" className="w-full bg-[hsl(33,100%,50%)] text-white hover:bg-[hsl(33,100%,45%)] border-0 text-xs h-8 gap-1">
                  Join Masterclass <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default MasterclassesSection;
