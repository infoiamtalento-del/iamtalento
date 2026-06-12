import { motion } from "framer-motion";
import {
  Award, Globe, TrendingUp, Link2, QrCode, Lock, Star, Headphones,
  Shield, Eye, UserPlus, Rocket, ShieldCheck, Target, ArrowRight, BadgeCheck,
} from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

const benefits = [
  { icon: Award, title: "Verified Talent Badge", desc: "A mark of credibility that proves your skills and earns employers' trust.", tag: "Build trust. Stand out instantly." },
  { icon: Globe, title: "100% Profile Activation", desc: "Your profile is visible to all 500+ hiring partners across industries.", tag: "More visibility. More opportunities." },
  { icon: TrendingUp, title: "3x Employer Visibility", desc: "Verified profiles appear on top in searches and filters used by recruiters.", tag: "Be seen before others even apply." },
  { icon: Link2, title: "Shareable Verification Link", desc: "Share your verified profile anywhere—resumes, emails, LinkedIn, applications.", tag: "One link. Unlimited opportunities." },
  { icon: QrCode, title: "Instant QR Verification", desc: "Employers can scan and instantly verify your score and authenticity.", tag: "Proof in one scan. Confidence in seconds." },
  { icon: Lock, title: "Full Session Access", desc: "Employers can view your full assessment and insights with permission.", tag: "Transparency that builds confidence." },
  { icon: Star, title: "Preferred by Top Employers", desc: "Trusted by 500+ companies who actively prefer and filter verified candidates.", tag: "Get shortlisted. Get hired." },
  { icon: Headphones, title: "Priority Consideration", desc: "Verified candidates are given priority during shortlisting and interview rounds.", tag: "Skip the noise. Get real consideration." },
];

const stats = [
  { icon: Eye, value: "3x", label: "Profile Views", sub: "Compared to unverified profiles" },
  { icon: UserPlus, value: "2x", label: "Interview Invites", sub: "More chances to get shortlisted" },
  { icon: Rocket, value: "60%", label: "Faster Hires", sub: "Verified professionals get hired faster" },
];

const privacy = [
  { icon: ShieldCheck, title: "No Last CTC Requested", desc: "We focus on your potential, not history." },
  { icon: Target, title: "Merit-Based Opportunities", desc: "Get evaluated on skills, not salary history." },
  { icon: TrendingUp, title: "Better Matches Higher Growth", desc: "Right opportunities for your true potential." },
];

const VerifiedBadgeSection = () => (
  <section className="bg-white py-16 md:py-20">
    <div className="max-w-[1200px] mx-auto px-6">
      {/* Header */}
      <div className="text-center mb-8">
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
        className="rounded-2xl border border-rose-100 bg-rose-50/40 p-3 md:p-4 mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_2fr] gap-3">
          {/* Left red panel */}
          <div className="relative overflow-hidden rounded-xl px-6 py-7 text-white"
            style={{ background: "linear-gradient(135deg, #ED2938 0%, #FF5A3C 100%)" }}>
            <div className="absolute -left-4 -top-4 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
            <div className="flex items-center gap-4 relative">
              <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center shrink-0 ring-2 ring-white/20">
                <BadgeCheck className="h-9 w-9 text-white" />
              </div>
              <div>
                <p className="text-[20px] md:text-[22px] font-bold leading-tight">Pass the Benchmark.</p>
                <p className="text-[20px] md:text-[22px] font-bold leading-tight">Wear the Badge.</p>
                <span className="inline-block mt-2 px-3 py-1 rounded-md bg-[#0F172A] text-amber-400 text-[15px] font-extrabold">
                  Get Hired Faster.
                </span>
                <p className="text-[12px] text-white/90 mt-3 leading-snug">
                  Employers prioritize verified talent.<br />Your badge makes sure you're seen first.
                </p>
              </div>
            </div>
          </div>

          {/* Right stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-stretch">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex items-center gap-3 px-4 py-4 rounded-xl bg-white">
                  <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-3xl font-extrabold text-primary leading-none">{s.value}</p>
                    <p className="text-[13px] font-bold text-slate-900 mt-1">{s.label}</p>
                    <p className="text-[11px] text-slate-500 leading-tight">{s.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Benefit grid 4x2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {benefits.map((b, i) => {
          const Icon = b.icon;
          const num = String(i + 1).padStart(2, "0");
          return (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="relative rounded-xl border border-slate-200 bg-white p-5 hover:border-rose-200 hover:shadow-[0_8px_20px_rgba(237,41,56,0.08)] transition-all"
            >
              <span className="absolute top-3 right-3 text-[11px] font-bold text-primary">{num}</span>
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-slate-900 leading-tight">{b.title}</p>
                  <p className="text-[12px] text-slate-500 mt-1.5 leading-snug">{b.desc}</p>
                </div>
              </div>
              <p className="text-[12px] font-bold text-primary mt-3 pt-3 border-t border-slate-100">{b.tag}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Footer banner */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        <div className="rounded-2xl bg-amber-50/60 border border-amber-100 p-5 flex flex-col md:flex-row items-start md:items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shrink-0 ring-1 ring-rose-100">
            <ShieldCheck className="h-7 w-7 text-primary" />
          </div>
          <div className="md:w-[280px]">
            <p className="text-[16px] font-bold text-slate-900 leading-tight">Private. Fair. Focused on You.</p>
            <p className="text-[16px] font-bold text-primary leading-tight">No Last CTC Asked.</p>
            <p className="text-[12px] text-slate-500 mt-1.5 leading-snug">
              We believe your future is more important than your past. That's why we don't ask for your last CTC.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
            {privacy.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center shrink-0 ring-1 ring-rose-100">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-slate-900 leading-tight">{p.title}</p>
                    <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{p.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl p-5 text-white relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #ED2938 0%, #FF5A3C 100%)" }}>
          <div className="flex items-start justify-between">
            <p className="text-[16px] font-bold leading-tight">Get Your Verified Badge</p>
            <ArrowRight className="h-5 w-5" />
          </div>
          <p className="text-[12px] text-white/90 mt-2 leading-snug">
            Take the assessment and unlock endless opportunities.
          </p>
          <div className="flex items-center justify-between mt-4">
            <div className="flex -space-x-2">
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face" className="w-9 h-9 rounded-full ring-2 ring-white object-cover" alt="" />
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face" className="w-9 h-9 rounded-full ring-2 ring-white object-cover" alt="" />
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face" className="w-9 h-9 rounded-full ring-2 ring-white object-cover" alt="" />
            </div>
            <div className="text-right">
              <p className="text-[20px] font-extrabold leading-none">18,731+</p>
              <p className="text-[11px] text-white/85">professionals already verified</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default VerifiedBadgeSection;
