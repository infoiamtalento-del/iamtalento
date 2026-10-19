import { Briefcase, ClipboardCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Home3SkillsWheel from "./Home3SkillsWheel";

const ecosystemSteps = ["Learning", "Skill Assessments", "Job Hunt"];

const actions = [
  {
    to: "/jobs",
    label: "Browse Jobs",
    sub: "5 lakh+ verified roles",
    icon: Briefcase,
    primary: true,
  },
  {
    to: "/assessments",
    label: "Assessment",
    sub: "Prove your skills",
    icon: ClipboardCheck,
    primary: false,
  },
];

const Home3HeroSection = () => (
  <section className="pt-44 pb-16 md:pt-52 md:pb-24 bg-accent/30 relative overflow-hidden">
    <div className="absolute inset-0 -z-10">
      <div className="absolute top-20 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px]" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-warning/5 blur-[80px]" />
    </div>

    <div className="container grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-14 items-center">
      <div className="text-left max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/70 px-4 py-1.5 mb-7"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="text-xs font-semibold tracking-[0.16em] uppercase text-primary">
            New Era of Hiring
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold font-display leading-[1.08] mb-5"
          style={{ textWrap: "balance" }}
        >
          India&apos;s Next Big Leap<br className="hidden md:block" />
          <span className="text-primary"> in Hiring Starts Here.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-2xl font-semibold font-display mb-4"
          style={{ textWrap: "balance" }}
        >
          Learning. Skill Assessments. Job Hunt.{" "}
          <span className="text-primary">All Connected.</span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18 }}
          className="text-muted-foreground text-base md:text-lg mb-9 max-w-xl leading-relaxed"
          style={{ textWrap: "balance" }}
        >
          Talent CIR is building India&apos;s next-generation talent
          ecosystem—bringing learning, AI-powered skill assessments, and career
          opportunities together on one platform
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
          className="flex flex-col sm:flex-row items-stretch sm:flex-wrap justify-start gap-3 md:gap-4"
        >
          {actions.map(({ to, label, sub, icon: Icon, primary }) => (
            <Button
              key={label}
              asChild
              className={
                primary
                  ? "h-auto gap-3 rounded-2xl px-6 py-4 bg-primary text-primary-foreground hover:bg-primary/90 justify-between text-left shadow-lg shadow-primary/15"
                  : "h-auto gap-3 rounded-2xl px-6 py-4 bg-card border border-border text-foreground hover:border-primary/40 hover:bg-primary/5 justify-between text-left"
              }
            >
              <Link to={to}>
                <span className="flex items-center gap-3">
                  <span
                    className={
                      primary
                        ? "h-10 w-10 rounded-xl bg-primary-foreground/15 flex items-center justify-center shrink-0"
                        : "h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"
                    }
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="flex flex-col leading-tight">
                    <span className="text-base font-semibold">{label}</span>
                    <span
                      className={
                        primary
                          ? "text-xs text-primary-foreground/75 font-normal"
                          : "text-xs text-muted-foreground font-normal"
                      }
                    >
                      {sub}
                    </span>
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 opacity-70" />
              </Link>
            </Button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.36 }}
          className="mt-11 flex flex-wrap items-center justify-start gap-y-3"
        >
          {ecosystemSteps.map((step, i) => (
            <div key={step} className="flex items-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-card border border-border/60 px-4 py-2 text-xs font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {step}
              </span>
              {i < ecosystemSteps.length - 1 && (
                <span className="mx-3 h-px w-8 sm:w-12 bg-primary/30" />
              )}
            </div>
          ))}
        </motion.div>
      </div>

      <div className="-mx-6 sm:mx-0">
        <Home3SkillsWheel />
      </div>
    </div>
  </section>
);

export default Home3HeroSection;
