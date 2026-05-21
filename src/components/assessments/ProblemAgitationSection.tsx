import { motion } from "framer-motion";
import { XCircle, CheckCircle2, TrendingUp, ShieldCheck, Target, BarChart3 } from "lucide-react";
import stepBuildProfileImg from "@/assets/step-build-profile.jpg";
import stepChooseImg from "@/assets/step-choose-assessment.jpg";
import stepReportImg from "@/assets/step-report.jpg";

const features = [
  {
    tag: "WHY IT MATTERS",
    title: "Stop Sending 100 Resumes. Start Proving Your Skills.",
    desc: "97% of applications never get a human glance. With a verified assessment score, employers come to you — no cold applications needed.",
    bullets: [
      { icon: XCircle, text: "Traditional resumes get lost in ATS filters", color: "text-red-500" },
      { icon: CheckCircle2, text: "Verified scores bypass screening — go straight to shortlist", color: "text-primary" },
      { icon: TrendingUp, text: "3x more interview callbacks for verified candidates", color: "text-primary" },
    ],
    image: stepBuildProfileImg,
    imageRight: true,
  },
  {
    tag: "STAND OUT",
    title: "Employers See Your Exact Skill Level Before They Call",
    desc: "No more 'tell me about yourself.' They already know. The conversation starts at offer negotiation, not introductions.",
    bullets: [
      { icon: Target, text: "AI-benchmarked against 50,000+ industry professionals", color: "text-primary" },
      { icon: ShieldCheck, text: "30-layer proctoring ensures every score is earned", color: "text-primary" },
      { icon: BarChart3, text: "Detailed breakdown: strengths, gaps, and growth areas", color: "text-primary" },
    ],
    image: stepChooseImg,
    imageRight: false,
  },
  {
    tag: "GET FOUND",
    title: "Verified Talent Gets Found. Unverified Gets Scrolled Past.",
    desc: "Recruiters filter for verified first. Your Verified Badge pushes you to the top of search results — like a blue checkmark for your career.",
    bullets: [
      { icon: CheckCircle2, text: "Priority listing in employer search results", color: "text-primary" },
      { icon: TrendingUp, text: "67% interview callback rate for verified candidates", color: "text-primary" },
      { icon: ShieldCheck, text: "Certificate valid for 12 months — always current", color: "text-primary" },
    ],
    image: stepReportImg,
    imageRight: true,
  },
];

const ProblemAgitationSection = () => (
  <section className="bg-white py-16 md:py-20">
    <div className="max-w-[1160px] mx-auto px-6">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span
          className="inline-block text-[11px] font-bold uppercase tracking-widest text-primary px-3 py-1 mb-3"
          style={{ background: "hsl(355 84% 54% / 0.08)", borderRadius: 100 }}
        >
          WHY IT MATTERS
        </span>
        <h2
          className="text-[26px] md:text-[30px] font-bold mb-3"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0F172A" }}
        >
          Prove Your Skills.{" "}
          <span className="text-primary">Get Hired Faster.</span>
        </h2>
      </motion.div>

      {/* Alternating feature rows */}
      <div className="space-y-12">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={`grid md:grid-cols-2 gap-10 items-center ${!f.imageRight ? "md:[&>*:first-child]:order-2" : ""}`}
          >
            {/* Text side */}
            <div>
              <span
                className="inline-block text-[10px] font-bold uppercase tracking-widest text-primary px-2.5 py-1 mb-3"
                style={{ background: "hsl(355 84% 54% / 0.08)", borderRadius: 100 }}
              >
                {f.tag}
              </span>
              <h3
                className="text-xl md:text-2xl font-bold mb-3"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0F172A" }}
              >
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "#475569" }}>
                {f.desc}
              </p>
              <div className="space-y-3">
                {f.bullets.map((b) => (
                  <div
                    key={b.text}
                    className="flex items-start gap-3 pl-3"
                    style={{ borderLeft: "3px solid hsl(355 84% 54% / 0.2)" }}
                  >
                    <b.icon className={`h-4 w-4 shrink-0 mt-0.5 ${b.color}`} />
                    <span className="text-sm font-medium" style={{ color: "#0F172A" }}>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Image side */}
            <div
              className="overflow-hidden"
              style={{ borderRadius: 12, border: "1px solid #E2E8F0" }}
            >
              <img src={f.image} alt={f.title} className="w-full h-auto object-cover" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ProblemAgitationSection;
