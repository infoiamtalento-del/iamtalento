import { motion } from "framer-motion";
import { ArrowRight, Layers, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import SectionBadge from "@/components/ui/section-badge";

import expert1 from "@/assets/expert-1.jpg";
import expert2 from "@/assets/expert-2.jpg";
import expert3 from "@/assets/expert-3.jpg";
import expert4 from "@/assets/expert-4.jpg";
import expert5 from "@/assets/expert-5.jpg";

const highlights = [
  "Written by senior ICs, not educators",
  "Reviewed every quarter",
  "Mirrors real interview formats",
  "Company-specific variants",
  "Mapped to live job requirements",
];

const expertPhotos = [expert1, expert2, expert3, expert4, expert5];

const companyLogos = [
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg", name: "Google" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg", name: "Amazon" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg", name: "Razorpay" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg", name: "Apple" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg", name: "LinkedIn" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg", name: "Slack" },
];

const stats = [
  { num: "340+", label: "Expert authors" },
  { num: "200+", label: "Companies using custom tests" },
  { num: "90 days", label: "Content review cycle" },
];

/* ── Overlapping expert photos ── */
const ExpertAvatars = () => (
  <div className="flex items-center mb-4">
    <div className="flex -space-x-2.5">
      {expertPhotos.map((src, i) => (
        <motion.img
          key={i}
          src={src}
          alt={`Expert ${i + 1}`}
          className="h-10 w-10 rounded-full object-cover object-top border-2 border-card"
          style={{ zIndex: expertPhotos.length - i }}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06 }}
        />
      ))}
    </div>
    <span className="text-[11px] text-muted-foreground ml-3">340+ authors</span>
  </div>
);

/* ── Company logo grid ── */
const CompanyLogoGrid = () => (
  <div className="flex flex-wrap gap-2 mb-4">
    {companyLogos.map((c, i) => (
      <motion.div
        key={c.name}
        className="h-9 w-9 rounded-lg border border-border bg-muted/50 flex items-center justify-center p-1.5"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.05 }}
        title={c.name}
      >
        <img src={c.src} alt={c.name} className="h-full w-full object-contain" />
      </motion.div>
    ))}
    <div className="h-9 w-9 rounded-lg border border-dashed border-border flex items-center justify-center text-[10px] text-muted-foreground font-medium">
      +194
    </div>
  </div>
);

/* ── Ticking clock animation ── */
const TickingClock = () => (
  <div className="relative h-14 w-14 mb-4">
    <div className="absolute inset-0 rounded-full border-2 border-emerald-200 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-500/30" />
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
      <div
        key={deg}
        className="absolute top-1/2 left-1/2 h-1 w-[1px] bg-emerald-400/60"
        style={{ transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-20px)` }}
      />
    ))}
    <div className="absolute top-1/2 left-1/2 h-1.5 w-1.5 rounded-full bg-emerald-500 -translate-x-1/2 -translate-y-1/2 z-10" />
    <motion.div
      className="absolute top-1/2 left-1/2 w-[2px] h-[14px] bg-emerald-600 origin-bottom rounded-full"
      style={{ x: "-50%", y: "-100%" }}
      animate={{ rotate: 360 }}
      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
    />
    <motion.div
      className="absolute top-1/2 left-1/2 w-[1.5px] h-[18px] bg-emerald-500 origin-bottom rounded-full"
      style={{ x: "-50%", y: "-100%" }}
      animate={{ rotate: 360 }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
    />
    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-emerald-600">90d</span>
  </div>
);

const cardData = [
  {
    num: "01",
    title: "Expert authored",
    desc: "Every question is written by engineers, PMs and designers actively working at top companies, not recycled from textbooks.",
    visual: <ExpertAvatars />,
  },
  {
    num: "02",
    title: "Company custom",
    desc: "Top companies like Zepto & Razorpay configure role-specific tests. Candidates who pass go directly to their hiring pipeline.",
    visual: <CompanyLogoGrid />,
  },
  {
    num: "03",
    title: "Always current",
    desc: "When React 19 ships or a new AWS service goes mainstream, the assessments update within weeks, not years.",
    visual: <TickingClock />,
  },
];

const BuiltDifferentSection = () => (
  <section className="py-16 md:py-24 bg-background">
    <div className="container">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <SectionBadge label="Built Different" icon={Layers} />
        <motion.h2
          className="text-3xl md:text-4xl font-bold font-display mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          By the industry, <span className="text-primary">for the industry.</span>
        </motion.h2>
        <motion.p
          className="text-muted-foreground text-lg"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Every test is authored by senior practitioners and updated as the industry evolves.
        </motion.p>
      </div>

      <motion.div
        className="flex flex-wrap justify-center gap-2 mb-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15 }}
      >
        {highlights.map((h) => (
          <span
            key={h}
            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full bg-primary text-primary-foreground"
          >
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            {h}
          </span>
        ))}
      </motion.div>

      <div className="grid md:grid-cols-3 gap-5 mb-10">
        {cardData.map((col, i) => (
          <motion.div
            key={col.num}
            className="rounded-xl border border-border bg-card p-6 hover:shadow-md transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            {col.visual}
            <span className="text-[11px] font-bold text-primary">{col.num}</span>
            <h3 className="text-base font-semibold text-foreground mt-1 mb-2">{col.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{col.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="flex flex-col sm:flex-row items-center justify-between rounded-xl border border-border bg-muted/40 px-6 py-4"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-6 sm:gap-8">
          {stats.map((s, i) => (
            <div key={s.num} className="flex items-center gap-6 sm:gap-8">
              {i > 0 && <div className="h-8 w-px bg-border hidden sm:block" />}
              <div className="text-center sm:text-left">
                <p className="text-lg font-bold text-foreground">{s.num}</p>
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
        <Link
          to="/assessments"
          className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg px-5 py-2.5 transition-colors"
        >
          Explore assessments <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </div>
  </section>
);

export default BuiltDifferentSection;
