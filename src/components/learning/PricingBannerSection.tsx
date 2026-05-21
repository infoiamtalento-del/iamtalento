import { motion } from "framer-motion";
import { Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PricingBannerSection = () => (
  <motion.section
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="py-4 md:py-6"
  >
    <div className="container px-4 md:px-6">
      <div className="relative overflow-hidden rounded-2xl bg-primary px-8 py-8 md:px-12 md:py-10">
        <div className="absolute top-0 right-0 w-60 h-60 rounded-full bg-white/10 -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 right-1/3 w-32 h-32 rounded-full bg-white/5 translate-y-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-sm font-semibold text-white mb-4">
              <Zap className="h-4 w-4" />
              Limited Time Offer
            </div>
            <h3 className="text-xl md:text-2xl font-bold font-display text-primary-foreground mb-1">
              Get Full Access to All Courses
            </h3>
            <p className="text-sm md:text-base text-white/80 max-w-lg mb-3">
              Unlock every course, certificate, mock interview, and career resource — one plan, unlimited learning.
            </p>
            <div className="flex items-center gap-3">
              <span className="relative text-white/50 text-lg md:text-2xl font-bold">
                ₹9,999
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <line x1="5" y1="5" x2="95" y2="95" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="text-white/60" />
                  <line x1="95" y1="5" x2="5" y2="95" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="text-white/60" />
                </svg>
              </span>
              <span className="text-white text-3xl md:text-5xl font-bold font-display">₹1,999</span>
            </div>
          </div>
          <Link to="/pricing" className="shrink-0">
            <Button size="lg" className="bg-[hsl(33,100%,50%)] text-white hover:bg-[hsl(33,100%,45%)] border-0 gap-2 font-semibold text-base px-8">
              Enroll Now <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </motion.section>
);

export default PricingBannerSection;
