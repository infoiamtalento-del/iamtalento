import { motion } from "framer-motion";
import { ArrowRight, Shield, ShieldCheck, Sparkles, Clock, BarChart3, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SectionBadge from "@/components/ui/section-badge";

import expert1 from "@/assets/expert-1.jpg";
import bentoJobs from "@/assets/bento-jobs-unlocked.jpg";
import bentoSearch from "@/assets/bento-search-ranking.jpg";
import bentoVerified from "@/assets/bento-verified-profile.jpg";
import bentoPartners from "@/assets/bento-hiring-partners.jpg";
import bentoCallback from "@/assets/bento-callback-rate.jpg";
import bentoPriority from "@/assets/bento-priority-listing.jpg";
import bentoCredibility from "@/assets/bento-credibility.jpg";

const bentoItems = {
  row1: [
    { img: bentoJobs, label: "100+ jobs unlocked" },
    { img: bentoSearch, label: "Top search ranking" },
  ],
  row2: [
    { img: bentoVerified, label: "Verified profile" },
    { img: bentoPartners, label: "500+ hiring partners" },
  ],
  row3: [
    { img: bentoCallback, label: "3x callback rate" },
    { img: bentoPriority, label: "Priority listing" },
    { img: bentoCredibility, label: "Instant credibility" },
  ],
};

/* ── Phone Mockup ── */
const PhoneMockup = () => (
  <div className="relative mx-auto w-[280px]">
    {/* Phone frame */}
    <div className="rounded-[32px] border-[6px] border-foreground/80 bg-card overflow-hidden shadow-2xl">
      {/* Notch */}
      <div className="h-6 bg-foreground/80 flex items-center justify-center">
        <div className="w-20 h-3 rounded-full bg-foreground/60" />
      </div>

      {/* Profile header */}
      <div className="relative bg-gradient-to-b from-muted to-card px-4 pt-4 pb-6">
        <img
          src={expert1}
          alt="Arjun Mehta"
          className="h-20 w-20 rounded-full object-cover object-top border-4 border-card mx-auto mb-2"
        />
        <p className="text-center text-sm font-bold text-foreground">Arjun Mehta</p>
        {/* Score bars */}
        <div className="flex items-center gap-1.5 justify-center mt-2">
          {[
            { label: "TS", w: "70%", color: "bg-primary" },
            { label: "PS", w: "85%", color: "bg-orange-400" },
            { label: "CM", w: "60%", color: "bg-primary" },
          ].map((b) => (
            <div key={b.label} className="flex items-center gap-1">
              <span className="text-[8px] text-muted-foreground">{b.label}</span>
              <div className="w-12 h-1.5 rounded-full bg-border overflow-hidden">
                <div className={`h-full rounded-full ${b.color}`} style={{ width: b.w }} />
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-2">Industry Readiness</p>
        <p className="text-3xl font-bold text-foreground text-center">86<span className="text-lg text-muted-foreground">%</span></p>
      </div>

      {/* Score breakdown */}
      <div className="px-4 pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-primary" />
            <span className="text-[11px] font-semibold text-foreground">Score Breakdown</span>
          </div>
          <span className="text-[10px] text-primary font-medium">See all</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Donut */}
          <div className="relative h-14 w-14 shrink-0">
            <svg viewBox="0 0 36 36" className="h-14 w-14 -rotate-90">
              <circle cx="18" cy="18" r="14" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
              <circle cx="18" cy="18" r="14" fill="none" stroke="hsl(var(--primary))" strokeWidth="3" strokeDasharray="88 100" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[11px] font-bold text-foreground">86%</span>
              <span className="text-[7px] text-muted-foreground">Overall</span>
            </div>
          </div>
          <div className="space-y-1 text-[10px]">
            <div className="flex justify-between gap-6"><span className="text-muted-foreground">Technical</span><span className="font-bold text-primary">92%</span></div>
            <div className="flex justify-between gap-6"><span className="text-muted-foreground">Problem Solving</span><span className="font-bold text-orange-500">88%</span></div>
            <div className="flex justify-between gap-6"><span className="text-muted-foreground">Communication</span><span className="font-bold text-orange-400">78%</span></div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="mx-4 mb-3 rounded-lg border border-border bg-muted/50 p-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-medium text-foreground">Assessment Stats</span>
          <span className="text-[10px] font-bold text-primary">80%</span>
        </div>
        <div className="flex gap-4 text-center">
          <div><p className="text-xs font-bold text-foreground">Top 5%</p><p className="text-[8px] text-muted-foreground">Rank</p></div>
          <div><p className="text-xs font-bold text-foreground">12</p><p className="text-[8px] text-muted-foreground">Tests</p></div>
          <div><p className="text-xs font-bold text-foreground">8</p><p className="text-[8px] text-muted-foreground">Badges</p></div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 pb-3">
        <div className="bg-primary text-primary-foreground text-xs font-bold py-2.5 rounded-lg text-center flex items-center justify-center gap-1.5">
          <Shield className="h-3.5 w-3.5" /> View Full Report
        </div>
      </div>

      {/* Bottom nav */}
      <div className="flex justify-around py-2.5 border-t border-border">
        <Target className="h-4 w-4 text-primary" />
        <BarChart3 className="h-4 w-4 text-muted-foreground/40" />
        <Shield className="h-4 w-4 text-muted-foreground/40" />
        <Sparkles className="h-4 w-4 text-muted-foreground/40" />
      </div>
    </div>

    {/* Floating badges */}
    <motion.div
      className="absolute top-28 -left-4 bg-card px-3 py-1.5 rounded-full shadow-lg border border-border flex items-center gap-1.5"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.5 }}
    >
      <Shield className="h-3.5 w-3.5 text-primary" />
      <span className="text-[11px] font-semibold text-foreground">Verified Badge</span>
    </motion.div>

    <motion.div
      className="absolute bottom-32 -left-6 bg-card px-3 py-1.5 rounded-full shadow-lg border border-border flex items-center gap-1.5"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.6 }}
    >
      <ShieldCheck className="h-3.5 w-3.5 text-primary" />
      <span className="text-[11px] font-semibold text-foreground">Proctor Verified</span>
    </motion.div>

    <motion.div
      className="absolute top-16 -right-6 bg-card px-3 py-1.5 rounded-full shadow-lg border border-border flex items-center gap-1.5"
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.55 }}
    >
      <Clock className="h-3.5 w-3.5 text-primary" />
      <span className="text-[11px] font-semibold text-foreground">24h Results</span>
    </motion.div>
  </div>
);

/* ── Bento Image Card ── */
const BentoCard = ({ img, label, delay }: { img: string; label: string; delay: number }) => (
  <motion.div
    className="relative rounded-xl overflow-hidden group"
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
  >
    <img src={img} alt={label} className="w-full h-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
    <p className="absolute bottom-3 left-3 text-sm font-semibold text-white">{label}</p>
  </motion.div>
);

const VerifiedBadgeBentoSection = () => (
  <section className="py-16 md:py-24 bg-background">
    <div className="container">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <SectionBadge label="Verified Badge" icon={Shield} />
        <motion.h2
          className="text-3xl md:text-4xl font-bold font-display mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Pass the benchmark. Prove it to{" "}
          <span className="text-primary">employers instantly.</span>
        </motion.h2>
        <motion.p
          className="text-muted-foreground text-lg"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Your verified score surfaces your profile to 200+ hiring companies, no cold applications needed.
        </motion.p>
      </div>

      {/* Main grid: Phone + Bento */}
      <div className="grid lg:grid-cols-[340px_1fr] gap-8 lg:gap-10 items-start">
        {/* Left: Phone Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="flex justify-center"
        >
          <PhoneMockup />
        </motion.div>

        {/* Right: Bento Grid */}
        <div className="space-y-3">
          {/* Row 1: 2 wide cards */}
          <div className="grid grid-cols-2 gap-3 h-[180px]">
            {bentoItems.row1.map((item, i) => (
              <BentoCard key={item.label} img={item.img} label={item.label} delay={0.2 + i * 0.06} />
            ))}
          </div>
          {/* Row 2: 2 wide cards */}
          <div className="grid grid-cols-2 gap-3 h-[180px]">
            {bentoItems.row2.map((item, i) => (
              <BentoCard key={item.label} img={item.img} label={item.label} delay={0.3 + i * 0.06} />
            ))}
          </div>
          {/* Row 3: 3 cards */}
          <div className="grid grid-cols-3 gap-3 h-[160px]">
            {bentoItems.row3.map((item, i) => (
              <BentoCard key={item.label} img={item.img} label={item.label} delay={0.4 + i * 0.06} />
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <motion.div
        className="text-center mt-10"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 px-8 gap-2 rounded-xl">
          <Link to="/assessments/explore">
            Get Your Verified Badge <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </motion.div>
    </div>
  </section>
);

export default VerifiedBadgeBentoSection;
