import { motion, useInView, useMotionValue, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ShieldCheck, Timer, Building2, PhoneCall,
  Target, Award, TrendingUp, Rocket, Lock,
  CheckCircle2, Clock, FileText, Crosshair, ArrowRight, ChevronLeft, ChevronRight,
} from "lucide-react";

// Animated counter
const AnimatedStat = ({ value, symbol }: { value: string; symbol: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const numericValue = parseFloat(value.replace(/,/g, ""));
  const motionVal = useMotionValue(0);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(motionVal, numericValue, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (v) => {
        if (numericValue >= 1000) setDisplay(Math.floor(v).toLocaleString("en-IN"));
        else setDisplay(Math.floor(v).toString());
      },
    });
    return controls.stop;
  }, [isInView, numericValue, motionVal]);

  return <span ref={ref}>{display}{symbol}</span>;
};

const stats = [
  { icon: ShieldCheck, value: "18,731", symbol: "+", label: "Professionals Verified", sub: "Trusted by leading companies" },
  { icon: Timer, value: "92", symbol: "%", label: "Hired within 60 Days", sub: "Faster outcomes. Real impact." },
  { icon: Building2, value: "200", symbol: "+", label: "Companies Hiring", sub: "Active hiring partners on Talento" },
  { icon: PhoneCall, value: "3", symbol: "x", label: "More Callbacks", sub: "Compared to unverified profiles" },
];

const AssessmentSocialProof = () => {
  return (
    <section className="w-full py-20 md:py-28">
      {/* Header */}
      <div className="container px-4 md:px-6 pb-12 md:pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1 mb-4 rounded-full text-[#002C66] bg-[#002C66]/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#002C66]" /> Live Results
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-4 text-slate-900">
            Verified People. Real Skills.<br />
            <span className="text-primary">Life-Changing Outcomes.</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            See how Talento verified professionals are getting hired faster
            <br className="hidden md:block" />
            and building better careers.
          </p>
        </motion.div>
      </div>

      {/* Stats with icons */}
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => {
            const Icon = s.icon;
            const isNavy = i % 2 === 0;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`flex items-center gap-4 px-5 md:px-6 py-6 rounded-2xl border transition-all ${
                  isNavy
                    ? "bg-[#002C66] border-[#002C66] text-white shadow-sm"
                    : "bg-white border-slate-200/90 text-slate-900 shadow-xs"
                }`}
              >
                <div
                  className={`shrink-0 w-14 h-14 rounded-full flex items-center justify-center ${
                    isNavy ? "bg-white/15 text-white" : "bg-[#002C66]/10 text-[#002C66]"
                  }`}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <div className="min-w-0">
                  <p
                    className={`text-[26px] md:text-[28px] font-bold leading-none ${
                      isNavy ? "text-white" : "text-[#002C66]"
                    }`}
                  >
                    <AnimatedStat value={s.value} symbol={s.symbol} />
                  </p>
                  <p className={`text-[13px] font-bold mt-1.5 ${isNavy ? "text-white" : "text-slate-900"}`}>
                    {s.label}
                  </p>
                  <p className={`text-[11px] mt-0.5 leading-tight ${isNavy ? "text-white/75" : "text-slate-500"}`}>
                    {s.sub}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AssessmentSocialProof;
