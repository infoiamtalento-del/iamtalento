import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const AnimatedNumber = ({ target }: { target: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (isInView) {
      const controls = animate(count, target, { duration: 2, ease: [0.22, 1, 0.36, 1] });
      const unsub = rounded.on("change", (v) => setDisplay(v));
      return () => { controls.stop(); unsub(); };
    }
  }, [isInView, target]);
  return <span ref={ref}>{display.toLocaleString()}</span>;
};

const PhoneMockupSection = () => (
  <section className="py-16 md:py-20">
    <div className="max-w-[1160px] mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center py-16 md:py-20 relative overflow-hidden bg-[#002C66] rounded-[20px] shadow-md"
      >
        <div className="relative z-10 max-w-xl mx-auto px-6">
          <p
            className="text-[56px] md:text-[64px] font-bold text-white mb-3"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontFeatureSettings: '"tnum"' }}
          >
            <AnimatedNumber target={18731} />+
          </p>
          <p className="text-base text-white/80 mb-8">
            Verified professionals trust I Am Talento to prove their skills to employers
          </p>

          {/* Avatar stack */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full bg-white/15 border-2 border-[#002C66] flex items-center justify-center"
                >
                  <Users className="h-3.5 w-3.5 text-white/80" />
                </div>
              ))}
            </div>
            <span className="text-xs text-white/70 font-medium">verified professionals</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <Button
              className="bg-white hover:bg-slate-100 text-[#002C66] text-sm font-bold h-11 px-6 gap-2 rounded-lg"
            >
              Start My Assessment <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-white/50">
            <span className="flex items-center gap-1.5"><Shield className="h-3 w-3" /> Private until you pass</span>
            <span className="flex items-center gap-1.5"><Users className="h-3 w-3" /> 200+ hiring partners</span>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default PhoneMockupSection;
