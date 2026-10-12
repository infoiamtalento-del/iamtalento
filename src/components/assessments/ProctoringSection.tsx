import { motion } from "framer-motion";
import { Shield, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import stepProctorImg from "@/assets/step-proctoring.jpg";
import stepChooseImg from "@/assets/step-choose-assessment.jpg";
import stepReportImg from "@/assets/step-report.jpg";

interface ProctoringSectionProps {
  onCtaClick?: () => void;
}

const ProctoringSection = ({ onCtaClick }: ProctoringSectionProps) => {
  const handleCta = () => {
    if (onCtaClick) {
      onCtaClick();
    } else {
      const el = document.getElementById("assessment-results");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-hidden relative shadow-lg"
          style={{ background: "hsl(var(--primary))", borderRadius: 20 }}
        >
          {/* Subtle dot grid texture */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          <div className="relative grid md:grid-cols-2 gap-8 items-center p-8 sm:p-10 md:p-14">
            {/* Left — text */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 text-white">
                  <Shield className="h-4 w-4" />
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-white/90">30-LAYER PROCTORING</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4 leading-[1.15]">
                Why Start Today?<br />
                <span className="text-white/85">Here's Why.</span>
              </h2>
              <p className="text-base md:text-lg text-white/80 mb-6 max-w-md leading-relaxed">
                Every assessment is protected with 30 layers of integrity —
                <br className="hidden md:block" />
                before, during, and after — so every score is earned.
              </p>
              <div className="space-y-2.5 mb-8">
                {[
                  "AI-powered gaze & behavior tracking",
                  "Biometric identity verification",
                  "Browser lockdown & screenshot blocking",
                  "Full session replay for audit",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-white shrink-0" />
                    <span className="text-sm font-medium text-white/90">{item}</span>
                  </div>
                ))}
              </div>
              <Button
                onClick={handleCta}
                className="bg-white text-primary hover:bg-white/90 text-sm font-bold h-11 px-6 gap-2 cursor-pointer shadow-sm"
                style={{ borderRadius: 8 }}
              >
                Start Your Assessment <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Right — image collage */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-2.5">
                <img src={stepProctorImg} alt="Proctoring" className="w-full h-auto object-cover border border-white/10 shadow-md" style={{ borderRadius: 10 }} />
                <img src={stepChooseImg} alt="Assessment selection" className="w-full h-auto object-cover border border-white/10 shadow-md" style={{ borderRadius: 10 }} />
              </div>
              <div className="pt-6">
                <img src={stepReportImg} alt="Results report" className="w-full h-auto object-cover border border-white/10 shadow-md" style={{ borderRadius: 10 }} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProctoringSection;
