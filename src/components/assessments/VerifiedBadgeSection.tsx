import { motion } from "framer-motion";
import {
  Award, Globe, TrendingUp, Link2, Lock, Star, Headphones,
  Shield, Eye, UserPlus, Rocket, ShieldCheck, Target, ArrowRight, BadgeCheck,
} from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

const benefits = [
  { icon: Award, title: "Verified Talent Badge", desc: "A mark of credibility that proves your skills." },
  { icon: Globe, title: "Profile Activation", desc: "Visible to all 500+ hiring partners." },
  { icon: TrendingUp, title: "3x Employer Visibility", desc: "Appear on top in recruiter searches." },
  { icon: Link2, title: "Verification Link", desc: "Share anywhere—resumes, emails, LinkedIn." },
  { icon: Lock, title: "Full Session Access", desc: "Employers view your full assessment with permission." },
  { icon: Star, title: "Preferred by Top Employers", desc: "500+ companies prefer verified candidates." },
  { icon: Headphones, title: "Priority Consideration", desc: "Priority during shortlisting and interviews." },
];

const stats = [
  { icon: Eye, value: "3x", label: "Profile Views", sub: "Compared to unverified profiles" },
  { icon: UserPlus, value: "2x", label: "Interview Invites", sub: "More chances to get shortlisted" },
  { icon: Rocket, value: "60%", label: "Faster Hires", sub: "Verified professionals get hired faster" },
];

const privacy = [
  { icon: ShieldCheck, title: "No Last CTC Requested" },
  { icon: Target, title: "Merit-Based Opportunities" },
  { icon: TrendingUp, title: "Better Matches, Higher Growth" },
];

const VerifiedBadgeSection = () => (
  <section className="bg-white py-16 md:py-24">
    <div className="max-w-[1200px] mx-auto px-6">
      {/* Header */}
      <div className="text-center mb-12">
        <SectionBadge label="Verified Badge" icon={Shield} />
        <motion.h2
          className="text-3xl md:text-5xl font-bold font-display mb-4 text-slate-900"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        >
          Your Skills Are Real. Prove It.{" "}
          <span className="text-primary relative inline-block">
            Get Ahead.
            <span className="absolute left-0 right-0 -bottom-1 h-[3px] bg-primary/80 rounded-full" />
          </span>
        </motion.h2>
        <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto">
          The Verified Badge is your proof of skills and potential—trusted by{" "}
          <span className="font-bold text-primary">500+ top companies</span> to identify, shortlist, and hire the right talent faster.
        </p>
      </div>

      {/* Hero banner: badge + stats */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="rounded-2xl border border-rose-100 bg-rose-50/40 p-6 md:p-8 mb-14"
      >
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_2fr] gap-6">
          {/* Left red panel */}
          <div className="relative overflow-hidden rounded-xl px-8 py-10 text-white"
            style={{ background: "linear-gradient(135deg, #ED2938 0%, #FF5A3C 100%)" }}>
            <div className="absolute -left-4 -top-4 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
            <div className="flex items-center gap-5 relative">
              <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center shrink-0 ring-2 ring-white/20">
                <BadgeCheck className="h-9 w-9 text-white" />
              </div>
              <div>
                <p className="text-[20px] md:text-[22px] font-bold leading-tight">Pass the Benchmark.</p>
                <p className="text-[20px] md:text-[22px] font-bold leading-tight">Wear the Badge.</p>
                <p className="text-[13px] text-white/90 mt-4 leading-relaxed">
                  Employers prioritize verified talent.<br />Your badge makes sure you're seen first.
                </p>
              </div>
            </div>
          </div>

          {/* Right stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex items-center gap-4 px-6 py-7 rounded-xl bg-white">
                  <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-3xl font-extrabold text-primary leading-none">{s.value}</p>
                    <p className="text-[13px] font-bold text-slate-900 mt-2">{s.label}</p>
                    <p className="text-[11px] text-slate-500 leading-tight mt-1">{s.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Benefit grid 4x2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
        {benefits.map((b, i) => {
          const Icon = b.icon;
          const num = String(i + 1).padStart(2, "0");
          return (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="relative rounded-xl border border-primary/10 bg-cream p-7 hover:border-primary/25 hover:shadow-md transition-all"
            >
              <span className="absolute top-4 right-4 text-[11px] font-bold text-primary">{num}</span>
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-slate-900 leading-tight">{b.title}</p>
                  <p className="text-[12px] text-slate-500 mt-3 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

    </div>

  </section>
);

export default VerifiedBadgeSection;
