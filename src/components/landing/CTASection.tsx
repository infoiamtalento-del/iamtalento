import { ArrowRight, Award, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const CTASection = () => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section ref={ref} className="py-14 md:py-20 bg-card/50">
      <div className="container px-4 md:px-6">
          <div className={cn(
           "relative rounded-3xl bg-primary p-8 md:p-12 lg:p-20 text-center overflow-hidden transition-all duration-700",
           isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
         )}>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-primary-foreground mb-4">
              Your Next Career Move<br />Starts With Proof.
            </h2>
            <p className="text-primary-foreground/70 text-base md:text-lg mb-2">Measure. Improve. Advance.</p>
            <p className="text-primary-foreground/60 max-w-xl mx-auto mb-8 text-sm md:text-base leading-relaxed">
              Whether you're proving your worth or hiring verified talent,
              <br className="hidden md:block" />
              IAmTalento is where trust meets technology.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
              <Link to="/assessments">
                <Button size="lg" className="bg-[hsl(33,100%,50%)] text-white hover:bg-[hsl(33,100%,45%)] gap-2 h-12 md:h-13 px-6 md:px-8 text-sm md:text-base shadow-xl">
                  <Award className="h-5 w-5" /> Start My Assessment <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" className="bg-white/20 text-white hover:bg-white/30 gap-2 h-12 md:h-13 px-6 md:px-8 text-sm md:text-base border border-white/30">
                <Download className="h-5 w-5" /> Download Sample Report
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
