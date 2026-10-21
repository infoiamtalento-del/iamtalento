import { motion } from "framer-motion";
import { ArrowRight, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const LearningCTASection = () => (
  <motion.section
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="py-8 md:py-12"
  >
    <div className="container px-4 md:px-6">
      <div className="relative overflow-hidden rounded-2xl bg-primary px-8 py-10 md:px-14 md:py-14 text-center">
        <div className="absolute top-0 right-0 w-60 h-60 rounded-full bg-white/10 -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 rounded-full bg-white/5 translate-y-1/2" />
        <div className="relative z-10 max-w-xl mx-auto">
          <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-5">
            <Rocket className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-display leading-[1.15] text-white mb-3">
            Ready to Learn?<br />
            <span className="text-white/75">Start Today</span>
          </h2>
          <p className="text-base md:text-lg text-white/80 mb-8">
            <span className="block">Build a learning path for your career.</span>
            <span className="block">Start when you are ready.</span>
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <Link to="/learning#courses">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 gap-2 font-semibold">
                Start Learning Today <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/learning#courses">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/40 text-white hover:bg-white/20 hover:text-white gap-2 font-semibold">
                Explore All Courses
              </Button>
            </Link>
          </div>
          <p className="text-xs text-white/60">Joined by 50,000+ job seekers · AI-matched to real opportunities</p>
        </div>
      </div>
    </div>
  </motion.section>
);

export default LearningCTASection;
