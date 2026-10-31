import { motion } from "framer-motion";
import {
  Award,
  Globe,
  TrendingUp,
  Link2,
  Shield,
  Eye,
  UserPlus,
  BadgeCheck,
  Compass,
  Target,
} from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

const stats = [
  { icon: Eye, value: "10X", label: "More Profile Views", sub: "Get noticed. Get discovered." },
  { icon: Globe, value: "5X", label: "More Employer Reach", sub: "Put your talent in the spotlight." },
  { icon: TrendingUp, value: "3X", label: "Shortlisting Advantage", sub: "Move ahead of the competition." },
  { icon: UserPlus, value: "2X", label: "More Interview Chances", sub: "Turn visibility into opportunities." },
  { icon: BadgeCheck, value: "100%", label: "Skill Credibility", sub: "Let your skills speak for you." },
  { icon: Compass, value: "360°", label: "Career Intelligence", sub: "Know your strengths. Own your future." },
];

const benefits = [
  {
    icon: Award,
    title: "Verified Talent Badge",
    desc: "Earn an exclusive digital badge that validates your skills, highlights your industry readiness, and makes your profile stand out to potential employers.",
  },
  {
    icon: TrendingUp,
    title: "Priority Recruiter Visibility",
    desc: "Get featured in relevant recruiter searches, gain greater profile exposure, and increase your chances of being discovered by leading employers.",
  },
  {
    icon: Target,
    title: "Smarter Job Matching",
    desc: "Get personalized job recommendations based on your verified skills, CIR Score, experience, qualifications, and career aspirations.",
  },
  {
    icon: Link2,
    title: "Shareable CIR Credential",
    desc: "Showcase your verified CIR Score anywhere with a unique credential link and QR code across LinkedIn, resumes, portfolios, and job applications.",
  },
];

const VerifiedBadgeSection = () => (
  <section className="bg-[#FBF4EB] py-16 md:py-24">
    <div className="max-w-[1200px] mx-auto px-6">
      {/* Header */}
      <div className="text-center mb-12">
        <SectionBadge label="CIR SCORE ADVANTAGE" icon={Shield} />
        <motion.h2
          className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-4 text-slate-900"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Your Potential, Measured.<br />
          <span className="text-primary">Your Career, Elevated.</span>
        </motion.h2>
        <p
          className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
          style={{ textWrap: "balance" }}
        >
          Your CIR Score showcases your skills, competencies, and job readiness. Build recruiter trust,
          stand out, and unlock better career opportunities.
        </p>
      </div>

      {/* Numbers block: 6 career advantage metrics */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl border border-slate-200/80 bg-white/75 p-6 md:p-8 mb-12 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6 pb-4 border-b border-slate-200/80">
          <h3 className="text-xl md:text-2xl font-bold font-display text-slate-900">
            Your Numbers. <span className="text-[#002C66]">Your Career Advantage.</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <article
                key={s.label}
                className="flex items-center gap-4 px-5 py-5 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-[#002C66]/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-[#002C66]/10 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-[#002C66]" />
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-[#002C66] leading-none">{s.value}</p>
                  <h4 className="text-[14px] font-bold text-slate-900 mt-2">{s.label}</h4>
                  <p className="text-[12px] text-slate-500 leading-snug mt-1">{s.sub}</p>
                </div>
              </article>
            );
          })}
        </div>
      </motion.div>

      {/* Four Ways Your CIR Score Works for You */}
      <div>
        <h3 className="text-xl md:text-2xl font-bold font-display text-slate-900 text-center mb-7">
          Four Ways Your <span className="text-[#002C66]">CIR Score Works for You</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            const num = String(i + 1).padStart(2, "0");
            return (
              <motion.article
                key={b.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col gap-3 sm:row-span-2 sm:grid sm:grid-rows-subgrid sm:gap-y-2.5 rounded-2xl border border-slate-200/80 bg-white p-6 hover:border-[#002C66]/35 hover:shadow-md transition-all"
              >
                <header>
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="w-11 h-11 rounded-xl bg-[#002C66]/10 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-[#002C66]" />
                    </div>
                    <span className="inline-flex items-center justify-center rounded-full bg-[#FBF4EB] border border-[#002C66]/15 px-2.5 py-0.5 text-[11px] font-extrabold text-[#002C66]">
                      {num}
                    </span>
                  </div>
                  <h4 className="text-base font-bold font-display text-slate-900 leading-snug">
                    {b.title}
                  </h4>
                </header>
                <p className="text-[13px] text-slate-600 leading-relaxed">
                  {b.desc}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

export default VerifiedBadgeSection;
