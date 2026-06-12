import { motion } from "framer-motion";
import {
  Shield,
  Award,
  Globe,
  TrendingUp,
  Link2,
  QrCode,
  Lock,
  Star,
  Headphones,
  Eye,
  UserPlus,
  Rocket,
  ShieldCheck,
  Target,
  ArrowRight,
} from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";
import shieldImg from "@/assets/verified-badge-shield.png";

const stats = [
  { icon: Eye, value: "3x", label: "Profile Views", sub: "Compared to unverified profiles" },
  { icon: UserPlus, value: "2x", label: "Interview Invites", sub: "More chances to get shortlisted" },
  { icon: Rocket, value: "60%", label: "Faster Hires", sub: "Verified professionals get hired faster" },
];

const benefits = [
  { n: "01", icon: Award, title: "Verified Talent Badge", desc: "A mark of credibility that proves your skills and earns employers' trust.", tag: "Build trust. Stand out instantly." },
  { n: "02", icon: Globe, title: "100% Profile Activation", desc: "Your profile is visible to all 500+ hiring partners across industries.", tag: "More visibility. More opportunities." },
  { n: "03", icon: TrendingUp, title: "3x Employer Visibility", desc: "Verified profiles appear on top in searches and filters used by recruiters.", tag: "Be seen before others even apply." },
  { n: "04", icon: Link2, title: "Shareable Verification Link", desc: "Share your verified profile anywhere—resumes, emails, LinkedIn, applications.", tag: "One link. Unlimited opportunities." },
  { n: "05", icon: QrCode, title: "Instant QR Verification", desc: "Employers can scan and instantly verify your score and authenticity.", tag: "Proof in one scan. Confidence in seconds." },
  { n: "06", icon: Lock, title: "Full Session Access", desc: "Employers can view your full assessment and insights with permission.", tag: "Transparency that builds confidence." },
  { n: "07", icon: Star, title: "Preferred by Top Employers", desc: "Trusted by 500+ companies who actively prefer and filter verified candidates.", tag: "Get shortlisted. Get hired." },
  { n: "08", icon: Headphones, title: "Priority Consideration", desc: "Verified candidates are given priority during shortlisting and interview rounds.", tag: "Skip the noise. Get real consideration." },
];

const futureFeatures = [
  { icon: ShieldCheck, title: "No Last CTC Requested", desc: "We focus on your potential, not your past." },
  { icon: Target, title: "Merit-Based Opportunities", desc: "Get evaluated on skills, not salary history." },
  { icon: TrendingUp, title: "Better Matches Higher Growth", desc: "Right opportunities for your true potential." },
];

const VerifiedBadgeSection = () => (
  <section className="bg-white py-16 md:py-20">
    <div className="max-w-[1240px] mx-auto px-6">
      {/* Header */}
      <div className="text-center mb-10">
        <SectionBadge label="Verified Badge" icon={Shield} />
        <motion.h2
          className="text-2xl md:text-4xl font-bold font-display mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Real Skills. Verified Proof.{" "}
          <span className="text-primary">Unlimited Opportunities.</span>
        </motion.h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-3xl mx-auto">
          The Verified Badge is your unfair advantage. Get noticed by{" "}
          <span className="text-primary font-semibold">500+ top companies</span> and accelerate your career.
        </p>
      </div>

      {/* Hero stats banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8 rounded-2xl p-6 md:p-8"
        style={{ background: "linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)", border: "1px solid #FECDD3" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 items-center">
          <div className="flex items-center gap-5">
            <img src={shieldImg} alt="Verified badge shield" loading="lazy" width={1024} height={1024} className="w-28 h-28 md:w-36 md:h-36 object-contain shrink-0" />
            <div>
              <h3 className="text-xl md:text-2xl font-bold leading-tight" style={{ color: "#0F172A" }}>
                Pass the benchmark.<br />Wear the badge.<br />
                <span className="text-primary">Get hired faster.</span>
              </h3>
              <p className="text-sm mt-2 text-muted-foreground">
                Employers prioritize verified talent. Your badge makes sure you're seen first.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center text-center">
                <div className="h-12 w-12 md:h-14 md:w-14 rounded-full flex items-center justify-center mb-2" style={{ background: "hsl(355 84% 54% / 0.1)" }}>
                  <s.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-primary leading-none">{s.value}</p>
                <p className="text-sm font-semibold mt-1" style={{ color: "#0F172A" }}>{s.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Benefits grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {benefits.map((b, i) => (
          <motion.div
            key={b.n}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="bg-white p-5 rounded-xl border border-slate-200 hover:border-primary/30 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl font-bold" style={{ color: "#FCA5A5" }}>{b.n}</span>
              <h4 className="text-sm font-bold text-right flex-1 ml-3" style={{ color: "#0F172A" }}>{b.title}</h4>
            </div>
            <div className="flex gap-3">
              <div className="h-12 w-12 rounded-full flex items-center justify-center shrink-0" style={{ background: "hsl(355 84% 54% / 0.08)" }}>
                <b.icon className="h-5 w-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100">
              <p className="text-xs font-semibold text-primary">{b.tag}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom row: No CTC + CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl p-6 md:p-7"
          style={{ background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)", border: "1px solid #FDE68A" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_2fr] gap-5 items-center">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h4 className="text-base md:text-lg font-bold leading-tight" style={{ color: "#0F172A" }}>
                  Your Future Matters More Than Your Past.<br />
                  <span className="text-primary">No Last CTC Asked.</span>
                </h4>
                <p className="text-xs text-muted-foreground mt-1.5">
                  We focus on your potential, not your history. Because your next opportunity shouldn't be limited by your past.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {futureFeatures.map((f) => (
                <div key={f.title} className="text-center">
                  <div className="h-10 w-10 rounded-full bg-white mx-auto mb-2 flex items-center justify-center shadow-sm">
                    <f.icon className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-xs font-bold" style={{ color: "#0F172A" }}>{f.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl p-6 text-white relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #ED2938 100%)" }}
        >
          <div className="flex items-start justify-between mb-3">
            <h4 className="text-lg font-bold">Get Your Verified Badge</h4>
            <ArrowRight className="h-5 w-5 shrink-0" />
          </div>
          <p className="text-xs text-white/80 mb-4">
            Take the assessment and unlock endless opportunities.
          </p>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop",
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop",
              ].map((src, i) => (
                <img key={i} src={src} alt="verified pro" loading="lazy" className="h-9 w-9 rounded-full border-2 border-white object-cover" />
              ))}
            </div>
            <div>
              <p className="text-base font-bold leading-none">18,731+</p>
              <p className="text-[11px] text-white/80 mt-1">professionals<br />already verified</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default VerifiedBadgeSection;
