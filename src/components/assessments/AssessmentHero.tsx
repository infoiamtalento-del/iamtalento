import { motion } from "framer-motion";
import { ArrowRight, Eye, CheckCircle2, Shield, Users, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionBadge from "@/components/ui/section-badge";
import assessmentHeroPerson from "@/assets/assessment-hero-person.jpg";

const AssessmentHero = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden bg-accent/30">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-[hsl(33,100%,50%)]/5 blur-[80px]" />
      </div>

      <div className="container px-4 md:px-6">
        {/* Top row: text left, card right */}
        <div className="grid lg:grid-cols-[1fr_1.15fr] gap-10 lg:gap-14 items-center">
          {/* Left — Copy */}
          <div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
              <SectionBadge label="AI-Powered Skill Assessments" icon={Sparkles} className="mb-6" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold font-display leading-[1.08] mb-6 tracking-tight"
            >
              Your Skills Are
              <br />
              Only Worth What
              <br />
              <span className="gradient-text">You Can Prove.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed"
            >
              AI-powered, proctored skill assessments that benchmark you against real industry standards — and prove it to employers.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              <Button size="lg" className="bg-[hsl(33,100%,50%)] text-white hover:bg-[hsl(33,100%,45%)] border-0 gap-2 h-12 px-6 font-bold">
                Start Your Assessment <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 border-0 gap-2 h-12 px-6 font-bold">
                <Eye className="h-4 w-4" /> View Sample Report
              </Button>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-primary" /> 18,731+ verified</span>
              <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-primary" /> AI Proctored</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Results in 24h</span>
            </motion.div>
          </div>

          {/* Right — Wide red card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative overflow-hidden rounded-2xl bg-primary" style={{ aspectRatio: "16 / 9" }}>
              {/* Right image */}
              <div className="absolute right-0 top-0 bottom-0 w-[45%]">
                <img src={assessmentHeroPerson} alt="Professional taking assessment" className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/40 to-transparent" />
              </div>

              {/* Content — minimal */}
              <div className="relative z-10 p-10 max-w-[55%] flex flex-col justify-center h-full">
                <h3 className="text-2xl font-bold font-display text-primary-foreground leading-snug mb-3">
                  Prove Your Skills with
                  <br />
                  Industry-Grade Tests
                </h3>

                <p className="text-primary-foreground/60 text-sm leading-relaxed mb-8 max-w-xs">
                  Work on real-world assessments. Get feedback from AI proctors and build your verified profile.
                </p>

                <div className="flex items-center gap-3 cursor-pointer group">
                  <div className="h-10 w-10 rounded-full bg-primary-foreground flex items-center justify-center shrink-0">
                    <Play className="h-4 w-4 text-primary fill-primary ml-0.5" />
                  </div>
                  <span className="text-sm text-primary-foreground/70 font-medium group-hover:text-primary-foreground transition-colors">Watch how it works</span>
                </div>
              </div>

              {/* Play on image */}
              <motion.div
                className="absolute top-5 right-5 h-11 w-11 rounded-full bg-primary/80 border border-primary-foreground/20 flex items-center justify-center cursor-pointer z-10"
                whileHover={{ scale: 1.1 }}
              >
                <Play className="h-4 w-4 text-primary-foreground fill-primary-foreground ml-0.5" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AssessmentHero;
