import { motion } from "framer-motion";
import { Award, Globe, Eye, Send, QrCode, Video, Shield } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

const unlocks = [
  { icon: Award, label: "Verified Talent Badge", desc: "Displayed prominently on your public profile", stat: "#1" },
  { icon: Globe, label: "Public Profile Activation", desc: "Visible to all employers on the platform", stat: "100%" },
  { icon: Eye, label: "Employer Visibility Boost", desc: "Verified profiles appear first in search", stat: "3x" },
  { icon: Send, label: "Shareable Verification Link", desc: "Send in applications, emails, and LinkedIn", stat: "∞" },
  { icon: QrCode, label: "QR Code Verification", desc: "Employers scan to see your score instantly", stat: "Instant" },
  { icon: Video, label: "Session Access", desc: "With permission, employers review your session", stat: "Full" },
];

const VerifiedBadgeSection = () => (
  <section className="bg-white py-16 md:py-20">
    <div className="max-w-[1160px] mx-auto px-6">
      {/* Section header */}
      <div className="text-center mb-10">
        <SectionBadge label="Verified Badge" icon={Shield} />
        <motion.h2
          className="text-3xl md:text-4xl font-bold font-display mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          What You Unlock with a{" "}
          <span className="text-primary">Verified Badge</span>
        </motion.h2>
        <motion.p
          className="text-muted-foreground text-lg max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Pass the benchmark and instantly stand out to 500+ hiring partners with proof employers trust.
        </motion.p>
      </div>

      {/* Pass the Benchmark - card with red left border */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <div
          className="bg-white px-8 py-7"
          style={{ borderRadius: 12, border: "1px solid #E2E8F0", borderLeft: "4px solid hsl(355 84% 54%)" }}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <h2
                className="text-xl md:text-2xl font-bold mb-2"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0F172A" }}
              >
                Pass the Benchmark. Wear the Badge.{" "}
                <span className="text-primary">Get Found.</span>
              </h2>
              <p className="text-sm" style={{ color: "#475569" }}>
                Meet the industry standard — your Verified Badge activates immediately. Employers filter for verified first.
              </p>
            </div>
            <div className="flex gap-8 shrink-0">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>3x</p>
                <p className="text-[12px]" style={{ color: "#6B7280" }}>Profile Views</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>2x</p>
                <p className="text-[12px]" style={{ color: "#6B7280" }}>Interview Invites</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Unlock grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {unlocks.map((u, i) => (
          <motion.div
            key={u.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="bg-white p-5 group"
            style={{
              borderRadius: 12,
              border: "1px solid #E2E8F0",
              transition: "border-color 200ms, box-shadow 200ms, transform 200ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "hsl(355 84% 54% / 0.3)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.06)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#E2E8F0";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <span className="text-2xl font-bold text-primary mb-2 block" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {u.stat}
            </span>
            <div
              className="h-9 w-9 flex items-center justify-center mb-3"
              style={{ borderRadius: 10, background: "hsl(355 84% 54% / 0.1)" }}
            >
              <u.icon className="h-4 w-4 text-primary" />
            </div>
            <p className="text-[14px] font-bold mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0F172A" }}>
              {u.label}
            </p>
            <p className="text-[12px]" style={{ color: "#6B7280" }}>{u.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default VerifiedBadgeSection;
