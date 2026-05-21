import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { BadgeCheck } from "lucide-react";

// Animated counter component
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
        if (numericValue >= 1000) {
          setDisplay(Math.floor(v).toLocaleString("en-IN"));
        } else if (Number.isInteger(numericValue)) {
          setDisplay(Math.floor(v).toString());
        } else {
          setDisplay(v.toFixed(0));
        }
      },
    });
    return controls.stop;
  }, [isInView, numericValue, motionVal]);

  return (
    <span ref={ref}>
      {display}<span style={{ color: "inherit" }}>{symbol}</span>
    </span>
  );
};

const stats = [
  { value: "18,731", symbol: "+", label: "professionals verified", bar: 93 },
  { value: "92", symbol: "%", label: "hired within 60 days of verifying", bar: 92 },
  { value: "200", symbol: "+", label: "companies actively hiring on Talento", bar: 70 },
  { value: "3", symbol: "x", label: "more callbacks vs unverified profiles", bar: 100 },
];

const row1 = [
  { initials: "RK", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face", name: "Rohan K.", city: "Bangalore", skill: "React.js", skillIcon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", score: 92, company: "Zepto", logo: "https://www.google.com/s2/favicons?sz=64&domain=zepto.co" },
  { initials: "AS", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face", name: "Ananya S.", city: "Pune", skill: "Node.js", skillIcon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", score: 88, company: "Razorpay", logo: "https://www.google.com/s2/favicons?sz=64&domain=razorpay.com" },
  { initials: "VM", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face", name: "Vikram M.", city: "Delhi", skill: "System Design", skillIcon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/archlinux/archlinux-original.svg", score: 85, company: "Atlassian", logo: "https://www.google.com/s2/favicons?sz=64&domain=atlassian.com" },
  { initials: "PR", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face", name: "Priya R.", city: "Mumbai", skill: "Product Mgmt", skillIcon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg", score: 91, company: "Swiggy", logo: "https://www.google.com/s2/favicons?sz=64&domain=swiggy.com" },
  { initials: "NK", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face", name: "Nikhil K.", city: "Chennai", skill: "Python / ML", skillIcon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", score: 94, company: "Flipkart", logo: "https://www.google.com/s2/favicons?sz=64&domain=flipkart.com" },
  { initials: "SA", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face", name: "Sneha A.", city: "Hyderabad", skill: "UI / UX", skillIcon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg", score: 87, company: "CRED", logo: "https://www.google.com/s2/favicons?sz=64&domain=cred.club" },
];

const row2 = [
  { initials: "AM", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face", name: "Arjun M.", city: "Bangalore", skill: "AWS + K8s", skillIcon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg", score: 89, company: "PhonePe", logo: "https://www.google.com/s2/favicons?sz=64&domain=phonepe.com" },
  { initials: "KS", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face", name: "Kavya S.", city: "Pune", skill: "SQL + Python", skillIcon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg", score: 93, company: "Meesho", logo: "https://www.google.com/s2/favicons?sz=64&domain=meesho.com" },
  { initials: "DT", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&crop=face", name: "Dev T.", city: "Mumbai", skill: "Go + APIs", skillIcon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg", score: 86, company: "Zepto", logo: "https://www.google.com/s2/favicons?sz=64&domain=zepto.co" },
  { initials: "RS", photo: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=80&h=80&fit=crop&crop=face", name: "Rahul S.", city: "Delhi", skill: "Vue.js", skillIcon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg", score: 90, company: "MakeMyTrip", logo: "https://www.google.com/s2/favicons?sz=64&domain=makemytrip.com" },
  { initials: "PK", photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face", name: "Pooja K.", city: "Noida", skill: "React Native", skillIcon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", score: 88, company: "Paytm", logo: "https://www.google.com/s2/favicons?sz=64&domain=paytm.com" },
  { initials: "MT", photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face", name: "Mihir T.", city: "Surat", skill: "Java + Spring", skillIcon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg", score: 91, company: "Juspay", logo: "https://www.google.com/s2/favicons?sz=64&domain=juspay.in" },
];

const bottomCompanies = [
  { name: "Zepto", logo: "https://www.google.com/s2/favicons?sz=64&domain=zepto.co" },
  { name: "Razorpay", logo: "https://www.google.com/s2/favicons?sz=64&domain=razorpay.com" },
  { name: "Atlassian", logo: "https://www.google.com/s2/favicons?sz=64&domain=atlassian.com" },
  { name: "Swiggy", logo: "https://www.google.com/s2/favicons?sz=64&domain=swiggy.com" },
  { name: "Flipkart", logo: "https://www.google.com/s2/favicons?sz=64&domain=flipkart.com" },
  { name: "PhonePe", logo: "https://www.google.com/s2/favicons?sz=64&domain=phonepe.com" },
  { name: "CRED", logo: "https://www.google.com/s2/favicons?sz=64&domain=cred.club" },
];

type CardData = typeof row1[0];

const MarqueeCard = ({ d }: { d: CardData }) => (
  <div
    className="flex items-center whitespace-nowrap overflow-hidden rounded-2xl hover:-translate-y-1 transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.06)] bg-white"
    style={{ border: "1px solid #e5e7eb" }}
  >
    {/* Avatar + Name */}
    <div className="flex items-center gap-4 pl-5 pr-6 py-6">
      <img
        src={d.photo}
        alt={d.name}
        className="w-14 h-14 rounded-full object-cover shrink-0 ring-2 ring-white shadow-sm"
        loading="lazy"
      />
      <div className="flex flex-col">
        <span className="text-[15px] font-semibold" style={{ color: "#0f172a" }}>{d.name}</span>
        <span className="text-[12px]" style={{ color: "#94a3b8" }}>{d.city}</span>
      </div>
    </div>

    {/* Skill + Score — grouped together */}
    <div className="flex items-center gap-4 px-5 py-6" style={{ borderLeft: "1px solid #f1f5f9" }}>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "#f8fafc" }}>
        <img src={d.skillIcon} alt={d.skill} className="object-contain shrink-0" style={{ width: 18, height: 18 }} loading="lazy" />
        <span className="text-[13px] font-medium" style={{ color: "#475569" }}>{d.skill}</span>
      </div>
      <div className="flex items-baseline">
        <span className="text-[20px] font-bold tabular-nums" style={{ color: "#0f172a" }}>{d.score}</span>
        <span className="text-[11px] ml-px" style={{ color: "#cbd5e1" }}>/100</span>
      </div>
    </div>

    {/* Hired badge */}
    <div className="flex items-center gap-2.5 px-5 py-6 rounded-r-2xl bg-white" style={{ borderLeft: "1px solid #f1f5f9" }}>
      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "#ED2938" }} />
      <span className="text-[13px] font-semibold" style={{ color: "#ED2938" }}>Hired</span>
      <img src={d.logo} alt={d.company} className="h-5 w-5 rounded-sm object-contain shrink-0" loading="lazy" />
      <span className="text-[13px] font-semibold" style={{ color: "#0f172a" }}>{d.company}</span>
    </div>
  </div>
);

const AssessmentSocialProof = () => {
  const doubled1 = [...row1, ...row1, ...row1, ...row1];
  const doubled2 = [...row2, ...row2, ...row2, ...row2];

  return (
    <section className="w-full bg-white overflow-hidden">
      {/* Header */}
      <div className="container px-4 md:px-6 pt-14 pb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1 mb-4 rounded-full"
            style={{ color: "#E22C2C", background: "hsl(355 84% 54% / 0.08)" }}
          >
            <BadgeCheck className="h-3.5 w-3.5" /> Live Results
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-2">
            Verified Professionals,{" "}
            <span className="text-primary">Real Outcomes</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            See how verified candidates are getting hired faster at top companies across India.
          </p>
        </motion.div>
      </div>

      {/* Stats grid */}
      <div className="container px-4 md:px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 rounded-xl overflow-hidden">
        {stats.map((s, i) => {
          const isRed = i % 2 === 0;
          const bg = isRed ? "#ED2938" : "#FF8C01";
          const textColor = "#ffffff";
          const subColor = "rgba(255,255,255,0.75)";
          const barTrack = "rgba(255,255,255,0.25)";
          const barFill = "#ffffff";
          return (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="flex flex-col gap-0.5 px-5 md:px-7 py-[18px]"
            style={{ background: bg, borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.15)" : "none" }}
          >
            <p className="text-[24px] font-medium tracking-[-0.5px]" style={{ color: textColor }}>
              <AnimatedStat value={s.value} symbol={s.symbol} />
            </p>
            <p className="text-[11px] mt-[3px]" style={{ color: subColor }}>{s.label}</p>
            <div className="h-[2px] rounded-[1px] mt-[10px]" style={{ background: barTrack }}>
              <motion.div
                className="h-full rounded-[1px]"
                style={{ background: barFill }}
                initial={{ width: 0 }}
                whileInView={{ width: `${s.bar}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: "easeOut" }}
              />
            </div>
          </motion.div>
          );
        })}
      </div>
      </div>

      {/* Marquee */}
      <div className="relative py-5" style={{ borderBottom: "1px solid #e2e8f0" }}>
        {/* Fade edges */}
        <div className="absolute left-0 top-0 w-[100px] h-full z-[3] pointer-events-none" style={{ background: "linear-gradient(90deg, #fff 0%, transparent 100%)" }} />
        <div className="absolute right-0 top-0 w-[100px] h-full z-[3] pointer-events-none" style={{ background: "linear-gradient(-90deg, #fff 0%, transparent 100%)" }} />

        <div className="flex flex-col gap-3">
          {/* Row 1 — left */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-4 w-max"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            >
              {doubled1.map((d, i) => <MarqueeCard key={`r1-${i}`} d={d} />)}
            </motion.div>
          </div>
          {/* Row 2 — right */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-4 w-max"
              animate={{ x: ["-50%", "0%"] }}
              transition={{ duration: 110, repeat: Infinity, ease: "linear" }}
            >
              {doubled2.map((d, i) => <MarqueeCard key={`r2-${i}`} d={d} />)}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col items-center justify-center px-5 md:px-7 py-4 gap-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-[6px] w-[6px]">
            <span className="absolute inset-0 rounded-full bg-[#22c55e] animate-[pulse-dot_1.4s_ease-in-out_infinite]" />
            <span className="relative rounded-full h-[6px] w-[6px] bg-[#22c55e]" />
          </span>
          <span className="text-[11px]" style={{ color: "#94a3b8" }}>Verified in real-time · Updated every hour</span>
        </div>
        <div className="flex items-center gap-4 flex-wrap justify-center">
          {bottomCompanies.map((c, i) => (
            <span key={c.name} className="flex items-center gap-2">
              {i > 0 && <span className="w-1 h-1 rounded-full" style={{ background: "#e2e8f0" }} />}
              <img src={c.logo} alt={c.name} className="h-5 w-5 object-contain" loading="lazy" />
              <span className="text-[11px] font-medium" style={{ color: "#64748b" }}>{c.name}</span>
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.85); opacity: 0.4; }
        }
      `}</style>
    </section>
  );
};

export default AssessmentSocialProof;
