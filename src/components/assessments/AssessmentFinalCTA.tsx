import { motion } from "framer-motion";
import { ArrowRight, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const AssessmentFinalCTA = () => (
  <section className="bg-white py-12 md:py-16">
    <div className="max-w-[1160px] mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-7"
        style={{
          borderRadius: 12,
          border: "1px solid hsl(355 84% 54% / 0.2)",
          background: "hsl(355 84% 54% / 0.03)",
        }}
      >
        <div className="flex items-center gap-4 flex-1">
          <div
            className="h-12 w-12 flex items-center justify-center shrink-0"
            style={{ borderRadius: 12, background: "hsl(355 84% 54% / 0.1)" }}
          >
            <Award className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-lg font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0F172A" }}>
              5,191 professionals got verified this month.
            </p>
            <p className="text-sm" style={{ color: "#475569" }}>
              Every day you wait is another day an employer picks a verified candidate over you.
            </p>
          </div>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 text-white text-sm font-bold h-11 px-6 gap-2 shrink-0"
          style={{ borderRadius: 8 }}
        >
          Start My Assessment <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  </section>
);

export default AssessmentFinalCTA;
