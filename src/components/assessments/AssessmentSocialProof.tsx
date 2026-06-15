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

const benefits = [
  { icon: Target, title: "Skills That Employers Trust", desc: "Scientific assessment backed by industry experts" },
  { icon: Award, title: "Stand Out in Every Application", desc: "Verified badge boosts your shortlisting chances" },
  { icon: TrendingUp, title: "Faster Hiring. Better Offers.", desc: "Get noticed by top companies and recruiters" },
  { icon: Rocket, title: "Real Opportunities, Real Growth", desc: "Access exclusive jobs, internships and career resources" },
  { icon: Lock, title: "Secure. Private. Trusted.", desc: "Your data is protected and never misused" },
];

const stories = [
  {
    name: "Priya R.", city: "Mumbai",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=160&h=160&fit=crop&crop=face",
    skill: "Product Mgmt", skillIcon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg",
    company: "Swiggy", logo: "https://www.google.com/s2/favicons?sz=64&domain=swiggy.com",
    score: 91, quote: "The assessment helped me discover my strengths and land my dream role.",
  },
  {
    name: "Nikhil K.", city: "Chennai",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=face",
    skill: "Python / ML", skillIcon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    company: "Flipkart", logo: "https://www.google.com/s2/favicons?sz=64&domain=flipkart.com",
    score: 94, quote: "Verified profile got me shortlisted faster and the process was smooth.",
  },
  {
    name: "Sneha A.", city: "Hyderabad",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=face",
    skill: "UI / UX", skillIcon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
    company: "Google", logo: "https://www.google.com/s2/favicons?sz=64&domain=google.com",
    score: 87, quote: "The insights were spot on. It changed my career direction.",
  },
  {
    name: "Rahul S.", city: "Delhi",
    photo: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=160&h=160&fit=crop&crop=face",
    skill: "Vue.js", skillIcon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
    company: "Microsoft", logo: "https://www.google.com/s2/favicons?sz=64&domain=microsoft.com",
    score: 90, quote: "From confused to confident — Talento made it possible!",
  },
];

const StoryCard = ({ s }: { s: typeof stories[0] }) => (
  <div className="bg-white rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-slate-100 min-w-[260px] flex-1">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <img src={s.photo} alt={s.name} className="w-11 h-11 rounded-full object-cover" loading="lazy" />
        <div>
          <p className="text-[14px] font-semibold text-slate-900">{s.name}</p>
          <p className="text-[12px] text-slate-500">{s.city}</p>
        </div>
      </div>
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
        <CheckCircle2 className="h-3 w-3" /> Hired
      </span>
    </div>
    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-50 mb-3">
      <img src={s.skillIcon} alt={s.skill} className="w-4 h-4 object-contain" loading="lazy" />
      <span className="text-[12px] font-medium text-slate-700">{s.skill}</span>
    </div>
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <img src={s.logo} alt={s.company} className="w-5 h-5 object-contain rounded-sm" loading="lazy" />
        <span className="text-[12px] font-bold uppercase tracking-wide text-slate-700">{s.company}</span>
      </div>
      <div className="flex items-baseline">
        <span className="text-[18px] font-bold text-slate-900 tabular-nums">{s.score}</span>
        <span className="text-[10px] text-slate-400">/100</span>
      </div>
    </div>
    <div className="bg-rose-50/60 rounded-lg p-3 text-[12px] text-slate-600 italic leading-snug">
      <span className="text-rose-400 text-lg leading-none mr-1">“</span>{s.quote}
    </div>
  </div>
);

const AssessmentSocialProof = () => {
  const [storyIdx, setStoryIdx] = useState(0);
  const visibleCount = 3;
  const maxIdx = Math.max(0, stories.length - visibleCount);
  const prev = () => setStoryIdx((i) => Math.max(0, i - 1));
  const next = () => setStoryIdx((i) => Math.min(maxIdx, i + 1));

  return (
    <section className="w-full bg-white py-20 md:py-28">
      {/* Header */}
      <div className="container px-4 md:px-6 pb-12 md:pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1 mb-4 rounded-full" style={{ color: "#E22C2C", background: "hsl(355 84% 54% / 0.08)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E22C2C]" /> Live Results
          </span>
          <h2 className="text-2xl md:text-4xl font-bold font-display mb-3 text-slate-900">
            Verified People. Real Skills.{" "}
            <span className="text-primary relative inline-block">
              Life-Changing Outcomes.
              <span className="absolute left-0 right-0 -bottom-1 h-[3px] bg-primary/70 rounded-full" />
            </span>
          </h2>
          <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto">
            See how Talento verified professionals are getting hired faster and building better careers.
          </p>
        </motion.div>
      </div>

      {/* Stats with icons */}
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 rounded-2xl overflow-hidden border border-slate-200/80 bg-white">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-4 px-5 md:px-6 py-6 border-slate-200/80 [&:not(:last-child)]:md:border-r [&:nth-child(odd)]:border-r md:[&:nth-child(odd)]:border-r [&:nth-child(-n+2)]:border-b md:[&:nth-child(-n+2)]:border-b-0"
              >
                <div className="shrink-0 w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-slate-700" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <p className="text-[26px] md:text-[28px] font-semibold text-slate-900 leading-none tracking-tight">
                    <AnimatedStat value={s.value} symbol={s.symbol} />
                  </p>
                  <p className="text-[13px] font-medium text-slate-700 mt-1.5">{s.label}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{s.sub}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Benefits row */}
      <div className="container px-4 md:px-6 mt-6">
        <div className="bg-slate-50/70 border border-slate-100 rounded-2xl px-5 md:px-7 py-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-start gap-3"
                >
                  <div className="shrink-0 w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-slate-600" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-slate-900 leading-tight">{b.title}</p>
                    <p className="text-[12px] text-slate-500 mt-1 leading-snug">{b.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>






    </section>
  );
};

export default AssessmentSocialProof;
