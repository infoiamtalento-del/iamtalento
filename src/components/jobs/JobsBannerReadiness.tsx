import { ArrowRight, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const JobsBannerReadiness = () => (
  <motion.section
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="py-4 md:py-6"
  >
    <div className="container px-4 md:px-6">
      <div className="relative overflow-hidden rounded-2xl bg-[hsl(33,100%,50%)] px-8 py-8 md:px-12 md:py-10">
        <div className="absolute top-0 right-0 w-60 h-60 rounded-full bg-white/10 -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 right-1/3 w-32 h-32 rounded-full bg-white/5 translate-y-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
              <Rocket className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold font-display text-white mb-1">
              Get Industry Ready
            </h3>
            <p className="text-sm md:text-base text-white/80 max-w-lg">
              Know your Industry Readiness Score and bridge skill gaps with personalised learning paths.
            </p>
          </div>
          <Link to="/skill-assessment" className="shrink-0">
            <Button className="bg-white text-[hsl(33,100%,50%)] hover:bg-white/90 gap-2 font-semibold">
              Check My Readiness <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </motion.section>
);

export default JobsBannerReadiness;
