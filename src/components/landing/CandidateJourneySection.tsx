import React from "react";
import { Link } from "react-router-dom";
import {
  User, Layers, ListChecks, MessageSquare, FileText,
  ShieldCheck, BarChart3, SendHorizonal, ArrowRight, Footprints,
} from "lucide-react";
import { motion } from "framer-motion";
import SectionBadge from "@/components/ui/section-badge";

const steps = [
  {
    num: "01", icon: User, title: "Build Your Profile",
    desc: "Tell us who you are in 2 minutes — role, experience, and goals.",
    detail: "AI parses your resume, LinkedIn, and portfolio into a structured, verified skill profile.",
  },
  {
    num: "02", icon: Layers, title: "Pick Your Domain",
    desc: "Choose your field & experience level for a fully tailored path.",
    detail: "Covering 40+ industries from Engineering to Finance.",
  },
  {
    num: "03", icon: ListChecks, title: "Select Your Test",
    desc: "Role-specific. AI-curated. Precise — built for your exact target job.",
    detail: "200+ domain-specific, role-based assessments curated by senior industry professionals.",
  },
  {
    num: "04", icon: MessageSquare, title: "Practice Like It's Real",
    desc: "Mock interviews + AI practice tests that mirror real hiring pressure.",
    detail: "Scenario-based questions with instant AI feedback and coaching tips.",
  },
  {
    num: "05", icon: FileText, title: "Craft Your AI Resume",
    desc: "Premium templates engineered to pass ATS and actually get callbacks.",
    detail: "Built from your verified skills — not generic templates.",
  },
  {
    num: "06", icon: ShieldCheck, title: "Take the Proctored Test",
    desc: "Fair. Secure. Employer-trusted — your real skill, on the record.",
    detail: "20+ anti-cheating features: webcam proctoring, AI behavior analysis, tab detection.",
  },
  {
    num: "07", icon: BarChart3, title: "Get Your ScoreCard",
    desc: "One score that speaks louder than your CV — benchmarked against peers.",
    detail: "AI-powered score with peer benchmarking, strength mapping, and a personalized growth roadmap.",
  },
  {
    num: "08", icon: SendHorizonal, title: "Apply to 100+ Jobs",
    desc: "Let employers come to you. Verified. Ranked. Ready to hire.",
    detail: "Verified candidates get 2.4x more interview calls. Apply to matched roles in one click.",
    isFinal: true,
  },
];

const CandidateJourneySection: React.FC = () => {

  return (
    <section className="py-14 md:py-20 bg-background">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <SectionBadge label="How It Works" icon={Footprints} />
          <motion.h2
            className="text-3xl md:text-4xl font-bold font-display mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Your 8-Step Journey to<br />
            <span className="text-primary">Getting Hired</span>
          </motion.h2>
          <p className="text-base md:text-lg text-muted-foreground">
            From zero to offer-ready — a complete system built to prove your value.
          </p>
        </div>

        {/* Two rows of 4 */}
        <div className="max-w-6xl mx-auto space-y-12">
          {[steps.slice(0, 4), steps.slice(4)].map((row, rowIdx) => (
            <div key={rowIdx}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 relative z-10">
                {row.map((step, i) => {
                  const globalIndex = rowIdx * 4 + i;
                  const Icon = step.icon;

                  return (
                    <motion.div
                      key={step.num}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08, duration: 0.4 }}
                      className="flex flex-col items-center text-center"
                    >
                      {/* Icon circle */}
                      <div className="relative mb-4">
                        <div
                          className="w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300"
                          style={{
                            background: "hsl(33 100% 95%)",
                            border: "1px solid hsl(33 100% 80%)",
                          }}
                        >
                          <Icon
                            size={30}
                            className="text-primary"
                          />
                        </div>
                      </div>

                      {/* Step label */}
                      <p className="text-sm md:text-base font-extrabold uppercase tracking-wider text-primary mb-1">
                        Step {globalIndex + 1}
                      </p>

                      {/* Title */}
                      <p className={`text-base md:text-lg font-bold leading-tight mb-2 ${
                        step.isFinal ? "text-primary" : "text-foreground"
                      }`}>
                        {step.title}
                      </p>

                      {/* Desc — always visible */}
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {step.desc}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link
            to="/assessments"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-primary hover:bg-primary/90 transition-colors"
          >
            Start Your Journey <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CandidateJourneySection;
