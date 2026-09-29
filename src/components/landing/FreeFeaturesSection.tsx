import { motion } from "framer-motion";
import {
  ArrowRight,
  BellRing,
  Briefcase,
  Check,
  Database,
  FileText,
  Gift,
  Globe,
  GraduationCap,
  Target,
  Workflow,
} from "lucide-react";
import { Link } from "react-router-dom";
import SectionBadge from "@/components/ui/section-badge";

const features = [
  { icon: Database, title: "Industry Experts Resume Database" },
  { icon: FileText, title: "AI Resume Builder & Optimizer" },
  { icon: BellRing, title: "Real-Time Job Market Insights" },
  { icon: Target, title: "Skill-Based Job Matching" },
  { icon: Workflow, title: "Application Tracking & Follow-Up" },
  { icon: Globe, title: "Digital Portfolio with Custom URL" },
  { icon: GraduationCap, title: "Free AI Learning Courses" },
  { icon: Briefcase, title: "Freelancing & Gig Opportunities" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, x: -18 },
  show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

const FreeFeaturesSection = () => {
  return (
    <section className="py-20 md:py-24 bg-gradient-to-b from-background via-accent/30 to-background">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <SectionBadge label="Free With IAT" icon={Gift} />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display tracking-tight">
            8 Free Features.{" "}
            <span className="text-primary">One Career Platform.</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-muted-foreground">
            Everything you need to stand out, get noticed, and get hired — completely free with your IAmTalento profile.
          </p>
        </div>

        {/* Split: feature list left, visual right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: compact feature list */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="lg:col-span-5 space-y-3"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={item}
                className="group flex items-center gap-4 rounded-xl px-4 py-3 -mx-1 hover:bg-card hover:shadow-md hover:shadow-primary/5 border border-transparent hover:border-primary/15 transition-all duration-300 cursor-default"
              >
                <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-lg bg-accent text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <feature.icon className="h-5 w-5" />
                </div>
                <span className="text-sm md:text-base font-semibold font-display text-foreground leading-snug">
                  {feature.title}
                </span>
                <Check className="ml-auto h-4 w-4 text-primary/0 group-hover:text-primary transition-colors duration-300 flex-shrink-0" />
              </motion.div>
            ))}
          </motion.div>

          {/* Right: platform visual card */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-7"
          >
            <div className="group relative rounded-3xl border bg-muted/50 p-6 md:p-8 shadow-elegant overflow-hidden">
              {/* Soft glow behind the mockup */}
              <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

              {/* Mockup platform UI */}
              <div className="relative rounded-2xl bg-card border shadow-xl overflow-hidden transition-transform duration-500 group-hover:-translate-y-2">
                {/* Window chrome */}
                <div className="flex items-center justify-between border-b px-5 py-3">
                  <div className="flex gap-2">
                    <span className="h-3 w-3 rounded-full bg-primary/70" />
                    <span className="h-3 w-3 rounded-full bg-primary-glow/70" />
                    <span className="h-3 w-3 rounded-full bg-success/70" />
                  </div>
                  <div className="h-4 w-36 rounded bg-muted" />
                </div>

                <div className="flex gap-6 p-6">
                  {/* Sidebar */}
                  <div className="hidden sm:flex w-1/3 flex-col gap-3">
                    <div className="flex items-center gap-3 rounded-xl bg-accent px-3 py-3">
                      <div className="h-9 w-9 rounded-full bg-primary/20" />
                      <div className="space-y-1.5">
                        <div className="h-2.5 w-16 rounded bg-primary/40" />
                        <div className="h-2 w-10 rounded bg-primary/20" />
                      </div>
                    </div>
                    <div className="h-3.5 w-full rounded bg-muted" />
                    <div className="h-3.5 w-2/3 rounded bg-muted" />
                    <div className="h-3.5 w-3/4 rounded bg-muted" />
                    <div className="h-3.5 w-1/2 rounded bg-muted" />
                  </div>

                  {/* Main panel */}
                  <div className="flex-1 space-y-4">
                    <div className="h-9 w-1/2 rounded-lg bg-accent" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-20 rounded-xl bg-muted/70 border" />
                      <div className="h-20 rounded-xl bg-primary/10 border border-primary/20" />
                      <div className="h-20 rounded-xl bg-muted/70 border" />
                      <div className="h-20 rounded-xl bg-muted/70 border" />
                    </div>
                    <div className="space-y-2 pt-1">
                      <div className="h-2.5 w-full rounded bg-muted" />
                      <div className="h-2.5 w-5/6 rounded bg-muted" />
                      <div className="h-2.5 w-2/3 rounded bg-muted" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute top-10 right-8 md:right-12 rotate-6 rounded-2xl bg-primary px-5 py-3.5 text-primary-foreground shadow-lg shadow-primary/30 transition-transform duration-500 group-hover:rotate-3 group-hover:scale-105">
                <p className="text-xs font-bold uppercase tracking-wide">98% Match</p>
                <p className="text-[10px] opacity-80">Product Designer · Bangalore</p>
              </div>
              <div className="absolute -bottom-3 left-6 md:left-10 flex items-center gap-3 rounded-2xl bg-card border px-4 py-3 shadow-lg">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/15">
                  <Check className="h-4 w-4 text-success" />
                </div>
                <div className="leading-tight">
                  <p className="text-xs font-bold">Skills Verified</p>
                  <p className="text-[10px] text-muted-foreground">Industry Ready · 92/100</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-20 relative overflow-hidden rounded-3xl bg-primary text-primary-foreground px-8 py-10 md:px-14 md:py-12 shadow-elegant"
        >
          {/* Decorative glows */}
          <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-primary-glow/30 blur-3xl" />

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold font-display tracking-tight text-white">
                All of this. Zero cost.
              </h3>
              <p className="mt-2 text-sm md:text-base text-primary-foreground/80">
                Create your free profile once — unlock every feature instantly.
              </p>
            </div>
            <Link
              to="/auth"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-background text-primary px-7 py-3.5 text-base font-bold shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300"
            >
              Create your job profile now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FreeFeaturesSection;
