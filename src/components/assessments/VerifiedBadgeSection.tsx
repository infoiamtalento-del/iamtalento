import { motion } from "framer-motion";
import {
  Award,
  Globe,
  TrendingUp,
  Link2,
  Shield,
  Eye,
  UserPlus,
  Rocket,
  BadgeCheck,
} from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

const benefits = [
  {
    icon: Award,
    title: "Verified Talent Badge",
    desc: "Earn an official mark of credibility backed by 30-layer AI proctoring that proves your real-world functional mastery to hiring managers.",
  },
  {
    icon: Globe,
    title: "Profile Activation",
    desc: "Unlock instant placement in our verified talent pool, making your skill scorecard directly discoverable by 500+ partner companies.",
  },
  {
    icon: TrendingUp,
    title: "3x Employer Visibility",
    desc: "Rank at the top of recruiter search filters and priority shortlists whenever companies filter candidates by verified IRS percentile.",
  },
  {
    icon: Link2,
    title: "Verification Link",
    desc: "Receive a tamper-proof credential link and QR code you can embed on LinkedIn, resumes, portfolios, and direct job applications.",
  },
];

const stats = [
  { icon: Eye, value: "3x", label: "Profile Views", sub: "Compared to unverified profiles" },
  { icon: UserPlus, value: "2x", label: "Interview Invites", sub: "More chances to get shortlisted" },
  { icon: Rocket, value: "60%", label: "Faster Hires", sub: "Verified professionals get hired faster" },
];

const VerifiedBadgeSection = () => (
  <section className="bg-[#FBF4EB] py-16 md:py-24">
    <div className="max-w-[1200px] mx-auto px-6">
      {/* Header */}
      <div className="text-center mb-12">
        <SectionBadge label="Verified Badge" icon={Shield} />
        <motion.h2
          className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-4 text-slate-900"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Your Skills Are Real. Prove It.<br />
          <span className="text-primary">Get Ahead.</span>
        </motion.h2>
        <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          The Verified Badge is your proof of skills and potential, trusted by top employers
          to identify, shortlist, and hire the right talent faster.
        </p>
      </div>

      {/* Hero banner: badge + stats */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl border border-slate-200/80 bg-white/70 p-6 md:p-8 mb-8 shadow-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_2fr] gap-6 items-stretch">
          {/* Left navy panel */}
          <div className="relative overflow-hidden rounded-xl px-7 py-8 bg-[#002C66] text-white flex items-center">
            <div className="flex items-center gap-5 relative">
              <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center shrink-0 ring-2 ring-white/20">
                <BadgeCheck className="h-9 w-9 text-white" />
              </div>
              <div>
                <p className="text-[20px] md:text-[22px] font-bold leading-tight text-white">
                  Pass the Benchmark.
                </p>
                <p className="text-[20px] md:text-[22px] font-bold leading-tight text-white">
                  Wear the Badge.
                </p>
                <p className="text-[13px] text-white/85 mt-3 leading-relaxed">
                  Employers prioritize verified talent.<br />
                  Your badge makes sure you're seen first.
                </p>
              </div>
            </div>
          </div>

          {/* Right stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="flex items-center gap-4 px-5 py-6 rounded-xl bg-white border border-slate-200/80 shadow-xs"
                >
                  <div className="w-12 h-12 rounded-full bg-[#002C66]/10 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-[#002C66]" />
                  </div>
                  <div>
                    <p className="text-3xl font-extrabold text-[#002C66] leading-none">{s.value}</p>
                    <p className="text-[13px] font-bold text-slate-900 mt-2">{s.label}</p>
                    <p className="text-[11px] text-slate-500 leading-tight mt-1">{s.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Benefit grid 4x1 — Equal-height aligned cards with multi-line descriptions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {benefits.map((b, i) => {
          const Icon = b.icon;
          const num = String(i + 1).padStart(2, "0");
          return (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col justify-between h-full rounded-2xl border border-slate-200/80 bg-white p-6 hover:border-[#002C66]/35 hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-[#002C66]/10 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-[#002C66]" />
                  </div>
                  <span className="inline-flex items-center justify-center rounded-full bg-[#FBF4EB] border border-[#002C66]/15 px-2.5 py-0.5 text-[11px] font-extrabold text-[#002C66]">
                    {num}
                  </span>
                </div>
                <h3 className="text-base font-bold font-display text-slate-900 leading-snug mb-2.5">
                  {b.title}
                </h3>
                <p className="text-[13px] text-slate-600 leading-relaxed">
                  {b.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default VerifiedBadgeSection;
