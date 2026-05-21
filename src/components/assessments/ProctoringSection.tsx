import { motion } from "framer-motion";
import { Shield, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import stepProctorImg from "@/assets/step-proctoring.jpg";
import stepChooseImg from "@/assets/step-choose-assessment.jpg";
import stepReportImg from "@/assets/step-report.jpg";

const ProctoringSection = () => (
  <section className="py-16 md:py-20">
    <div className="max-w-[1160px] mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="overflow-hidden relative"
        style={{ background: "hsl(355 84% 54%)", borderRadius: 20 }}
      >
        {/* Subtle dot grid texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative grid md:grid-cols-2 gap-8 items-center p-10 md:p-14">
          {/* Left — text */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">30-LAYER PROCTORING</span>
            </div>
            <h2
              className="text-[28px] md:text-[32px] font-bold text-white mb-4 leading-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Why Start Today?
            </h2>
            <p className="text-sm text-white/70 mb-6 max-w-md leading-relaxed">
              Every assessment is protected with 30 layers of integrity — before, during, and after. AI proctoring, identity verification, and session replay ensure every score is earned.
            </p>
            <div className="space-y-2.5 mb-8">
              {[
                "AI-powered gaze & behavior tracking",
                "Biometric identity verification",
                "Browser lockdown & screenshot blocking",
                "Full session replay for audit",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm text-white/80">{item}</span>
                </div>
              ))}
            </div>
            <Button
              className="bg-white text-[#0F172A] hover:bg-white/90 text-sm font-bold h-11 px-6 gap-2"
              style={{ borderRadius: 8 }}
            >
              Start Your Assessment <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Right — image collage */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <img src={stepProctorImg} alt="Proctoring" className="w-full h-auto" style={{ borderRadius: 8 }} />
              <img src={stepChooseImg} alt="Assessment selection" className="w-full h-auto" style={{ borderRadius: 8 }} />
            </div>
            <div className="pt-6">
              <img src={stepReportImg} alt="Results report" className="w-full h-auto" style={{ borderRadius: 8 }} />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default ProctoringSection;
