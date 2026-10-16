import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const AnimatedCounter = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
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
  return <span ref={ref}>{display.toLocaleString()}{suffix}</span>;
};

const stats = [
  { value: 50000, suffix: "+", label: "Assessments Completed" },
  { value: 3, suffix: "x", label: "More Profile Views" },
  { value: 200, suffix: "+", label: "Hiring Partners" },
  { value: 92, suffix: "%", label: "Confidence Boost" },
];

const SocialProofStats = () => (
  <section className="bg-[#FBF4EB] py-16 md:py-20">
    <div className="max-w-[1160px] mx-auto px-6">
      {/* Stats strip */}
      <div className="flex flex-col md:flex-row items-center justify-between">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex-1 text-center py-6"
            style={{
              borderRight: i < stats.length - 1 ? "1px solid #E2E8F0" : "none",
            }}
          >
            <p
              className="text-4xl font-bold mb-1"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0F172A", fontFeatureSettings: '"tnum"' }}
            >
              <span className="text-primary"><AnimatedCounter target={s.value} suffix={s.suffix} /></span>
            </p>
            <p className="text-[13px]" style={{ color: "#6B7280" }}>{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Company logos - grayscale */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-10 pt-8 flex items-center justify-center gap-10 flex-wrap"
        style={{ borderTop: "1px solid #E2E8F0" }}
      >
        {["Google", "Amazon", "Microsoft", "Flipkart", "Razorpay"].map((name) => (
          <span
            key={name}
            className="text-sm font-bold tracking-wide cursor-default transition-colors duration-200 hover:text-[#0F172A]"
            style={{ color: "#CBD5E1", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {name}
          </span>
        ))}
      </motion.div>
    </div>
  </section>
);

export default SocialProofStats;
