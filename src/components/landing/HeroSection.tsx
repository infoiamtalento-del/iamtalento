import { useState, useEffect } from "react";
import { ArrowRight, Sparkles, TrendingUp, ShieldCheck, Award, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import HeroAssessmentJourney from "./HeroAssessmentJourney";
import SectionBadge from "@/components/ui/section-badge";

const usps = [
  { icon: Target, text: "Role-Specific Assessments" },
  { icon: TrendingUp, text: "Industry Readiness Score" },
  { icon: Sparkles, text: "AI Skill Gap Analysis" },
  { icon: Award, text: "Verified Skill Badge" },
];

const typewriterText = "You Don't Lack Talent. You Lack Proof.";

const HeroSection = () => {
  const [displayedChars, setDisplayedChars] = useState(0);

  useEffect(() => {
    if (displayedChars < typewriterText.length) {
      const timeout = setTimeout(() => {
        setDisplayedChars((prev) => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [displayedChars]);

  const displayed = typewriterText.slice(0, displayedChars);
  const isTyping = displayedChars < typewriterText.length;

  // Split into two lines at the period after "Talent."
  const splitIdx = typewriterText.indexOf("Talent.") + 7;
  const line1 = displayed.slice(0, Math.min(displayedChars, splitIdx));
  const line2 = displayedChars > splitIdx ? displayed.slice(splitIdx) : "";

  // Highlight "Proof." at the end
  const proofStart = typewriterText.indexOf("Proof.");
  const hasProof = displayedChars >= proofStart + 6;
  const line2BeforeProof = hasProof ? line2.slice(0, line2.indexOf("Proof.")) : line2;
  const proofText = hasProof ? "Proof." : "";

  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden bg-accent/30">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-[hsl(33,100%,50%)]/5 blur-[80px]" />
      </div>

      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <SectionBadge label="AI-Powered Industry Readiness Platform" icon={Sparkles} className="mb-6" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold font-display leading-[1.08] mb-6 tracking-tight min-h-[7rem]">
              <span>{line1}</span>
              {line1.length >= splitIdx && <br />}
              <span>{line2BeforeProof}</span>
              {proofText && <span className="gradient-text">{proofText}</span>}
              {isTyping && (
                <motion.span
                  className="inline-block w-[3px] h-[1em] bg-primary ml-1 align-middle"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                />
              )}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2 }}
              className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed"
            >
              Get your AI-powered Industry Readiness Score and know exactly where you stand in today's competitive job market. Verified by domain experts. Trusted by employers.
            </motion.p>

            {/* USP Grid */}
            <div className="grid grid-cols-2 gap-3 mb-8 max-w-md">
              {usps.map(({ icon: Icon, text }, i) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 2.4 + i * 0.08 }}
                  className="flex items-center gap-2.5 text-sm"
                >
                  <Icon className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-muted-foreground">{text}</span>
                </motion.div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8 }} className="flex flex-wrap gap-4 mb-8">
              <Link to="/assessments/explore">
                <Button size="lg" className="bg-[hsl(33,100%,50%)] text-white hover:bg-[hsl(33,100%,45%)] border-0 gap-2 h-12 px-6">
                  Take Your Assessment <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/for-employers">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 border-0 gap-2 h-12 px-6">
                  I'm an Employer
                </Button>
              </Link>
            </motion.div>

            {/* Trust micro-strip */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }} className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> SOC 2 Compliant</span>
              <span className="flex items-center gap-1.5"><Award className="h-3.5 w-3.5 text-primary" /> AI-Verified Certification</span>
              <span className="flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5 text-primary" /> 12,000+ Professionals</span>
            </motion.div>
          </div>

          {/* Right — Assessment Journey Animation */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <HeroAssessmentJourney />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
