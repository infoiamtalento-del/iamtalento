import { motion } from "framer-motion";
import {
  ArrowRight,
  BellRing,
  Briefcase,
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
  {
    icon: Database,
    title: "Industry Experts Resume Database",
    description: "Get access to real resumes from industry experts — see what actually gets people hired at top companies.",
  },
  {
    icon: FileText,
    title: "AI Resume Builder & Optimizer",
    description: "Build an ATS-ready resume in minutes with AI that optimizes every line for the roles you're targeting.",
  },
  {
    icon: BellRing,
    title: "Real-Time Job Market Insights",
    description: "Instant alerts on hiring trends, in-demand skills, and salary movements — so you're never caught off guard.",
  },
  {
    icon: Target,
    title: "Skill-Based Job Matching",
    description: "Our engine matches your verified skills to the right openings automatically — no more spray-and-apply.",
  },
  {
    icon: Workflow,
    title: "Application Tracking & Follow-Up",
    description: "Track every application in one place with smart automated follow-ups that keep you on the recruiter's radar.",
  },
  {
    icon: Globe,
    title: "Digital Portfolio with Custom URL",
    description: "A stunning profile page at your own URL — share it on LinkedIn, your resume, or with recruiters directly.",
  },
  {
    icon: GraduationCap,
    title: "Free AI Learning Courses",
    description: "Upskill with our AI-powered learning library, designed to close the exact gaps your assessment reveals.",
  },
  {
    icon: Briefcase,
    title: "Freelancing & Gig Opportunities",
    description: "Tap into curated freelance and gig projects — earn while you learn and build proof of your skills.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
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

        {/* Feature grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="group relative rounded-2xl border bg-card p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-primary/30 transition-all duration-300 overflow-hidden"
            >
              {/* Hover glow */}
              <div className="absolute -top-12 -right-12 h-28 w-28 rounded-full bg-primary/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Index number */}
              <span className="absolute top-4 right-5 text-xs font-bold font-display text-muted-foreground/40 group-hover:text-primary/50 transition-colors duration-300">
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Icon tile */}
              <div className="relative inline-flex items-center justify-center h-12 w-12 rounded-xl bg-accent text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <feature.icon className="h-6 w-6" />
              </div>

              <h3 className="relative text-base font-bold font-display leading-snug mb-2">
                {feature.title}
              </h3>
              <p className="relative text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-14 relative overflow-hidden rounded-3xl bg-primary text-primary-foreground px-8 py-10 md:px-14 md:py-12 text-center shadow-elegant"
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
