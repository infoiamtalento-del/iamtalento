import { motion } from "framer-motion";
import {
  User,
  Layers,
  ListChecks,
  MessageSquare,
  FileText,
  ShieldCheck,
  BarChart3,
  Send,
  Zap,
} from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

const steps = [
  { icon: User,         title: "Build Your Profile",     desc: "Tell us who you are in 2 minutes — role, experience, and goals." },
  { icon: Layers,       title: "Pick Your Domain",       desc: "Choose your field & experience level for a fully tailored path." },
  { icon: ListChecks,   title: "Select Your Test",       desc: "Role-specific. AI-curated. Precise — built for your exact target job." },
  { icon: MessageSquare,title: "Practice Like It's Real",desc: "Mock interviews + AI practice tests that mirror real hiring pressure." },
  { icon: FileText,     title: "Craft Your AI Resume",   desc: "Premium templates engineered to pass ATS and actually get callbacks." },
  { icon: ShieldCheck,  title: "Take the Proctored Test",desc: "Fair. Secure. Employer-trusted — your real skill, on the record." },
  { icon: BarChart3,    title: "Get Your ScoreCard",     desc: "One score that speaks louder than your CV — benchmarked against peers." },
  { icon: Send,         title: "Apply to 100+ Jobs",     desc: "Let employers come to you. Verified. Ranked. Ready to hire.", highlight: true },
];

const WebinarHowItWorksSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <SectionBadge label="How It Works" icon={Zap} />
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold font-display mb-3"
          >
            From Registration to<br />
            <span className="text-[#ef4444]">Real Skill in 8 Steps</span>
          </motion.h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            From zero to offer-ready — a complete system built to prove your value.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12 max-w-6xl mx-auto">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.08 }}
                className="text-center flex flex-col items-center"
              >
                <div className="h-16 w-16 rounded-2xl bg-[#fde9e2] flex items-center justify-center mb-4">
                  <Icon className="h-7 w-7 text-[#ef4444]" strokeWidth={2} />
                </div>
                <p className="text-xs font-bold tracking-[0.18em] text-[#ef4444] mb-2">
                  STEP {i + 1}
                </p>
                <h3 className={`text-lg font-bold font-display mb-2 ${s.highlight ? "text-[#ef4444]" : "text-foreground"}`}>
                  {s.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[15rem]">
                  {s.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WebinarHowItWorksSection;
