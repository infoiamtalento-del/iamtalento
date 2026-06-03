import { motion } from "framer-motion";
import { BadgeCheck, Plane, Stamp, Globe2, ShieldCheck, Sparkles } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";
import { Button } from "@/components/ui/button";

const skillRatings = [
  { label: "Digital Marketing", score: 88 },
  { label: "Data Analytics", score: 76 },
  { label: "Leadership", score: 71 },
  { label: "Problem Solving", score: 84 },
];

const stamps = [
  { label: "Verified", sub: "I Am Talento", rot: -14, color: "red" },
  { label: "Top 25%", sub: "Industry Rank", rot: 9, color: "blue" },
  { label: "Job Ready", sub: "2026 Cohort", rot: -6, color: "green" },
];

const DigitalSkillPassportSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-muted/40 to-background">
      <div className="container px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <SectionBadge label="Digital Skill Passport" icon={BadgeCheck} />
          <h2 className="text-3xl md:text-5xl font-bold font-display leading-tight">
            Your Career, <span className="text-red-600">Officially Stamped.</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-base md:text-lg">
            A shareable, verified credential recruiters can trust at a glance.
          </p>
        </div>

        {/* Passport */}
        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: -5 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
          style={{ perspective: "1200px" }}
        >
          <div className="relative grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)] border-2 border-red-900/20 bg-[#7a0d1a]">
            {/* Center spine */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-yellow-300/30 -translate-x-1/2 z-10" />
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-black/20 -translate-x-1/2 z-10" />

            {/* LEFT PAGE — Cover-style */}
            <div className="relative p-8 md:p-10 bg-gradient-to-br from-[#8b0f1f] via-[#7a0d1a] to-[#5e0a14] text-yellow-50 overflow-hidden">
              {/* Decorative rings */}
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full border border-yellow-200/15" />
              <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full border border-yellow-200/10" />
              <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full border border-yellow-200/10" />

              <div className="relative flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-yellow-200/80 font-semibold">
                <Globe2 className="h-3.5 w-3.5" />
                I Am Talento · Republic of Skills
              </div>

              <div className="relative mt-10 md:mt-14">
                <div className="text-[10px] tracking-[0.25em] uppercase text-yellow-200/70">
                  Credential
                </div>
                <h3 className="font-display font-extrabold text-3xl md:text-4xl leading-tight mt-1 text-yellow-50">
                  Digital Skill<br />Passport
                </h3>
              </div>

              {/* Emblem */}
              <div className="relative mt-10 md:mt-12 mx-auto w-32 h-32 md:w-40 md:h-40">
                <div className="absolute inset-0 rounded-full border-2 border-yellow-300/60" />
                <div className="absolute inset-2 rounded-full border border-yellow-300/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <BadgeCheck className="h-10 w-10 md:h-12 md:w-12 mx-auto text-yellow-300" strokeWidth={1.5} />
                    <div className="mt-1 font-display font-bold text-yellow-50 text-sm md:text-base">
                      I·A·T
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative mt-10 md:mt-16 text-center text-[10px] tracking-[0.35em] uppercase text-yellow-200/70">
                — Verified Talent —
              </div>

              {/* MRZ-style bottom strip */}
              <div className="relative mt-8 font-mono text-[10px] md:text-xs text-yellow-200/70 leading-relaxed border-t border-yellow-200/20 pt-3 break-all">
                P&lt;IND&lt;TALENTO&lt;DIGITAL&lt;SKILL&lt;PASSPORT&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                <br />
                IAT2026&lt;78100IND9501012M2901019&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;04
              </div>
            </div>

            {/* RIGHT PAGE — Data page */}
            <div className="relative p-8 md:p-10 bg-[#fdf6e9] text-foreground overflow-hidden">
              {/* Subtle guilloché pattern */}
              <div
                className="absolute inset-0 opacity-[0.07] pointer-events-none"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, #7a0d1a 0 1px, transparent 1px 8px), repeating-linear-gradient(-45deg, #7a0d1a 0 1px, transparent 1px 8px)",
                }}
              />

              {/* Header */}
              <div className="relative flex items-start justify-between">
                <div>
                  <div className="text-[9px] tracking-[0.3em] uppercase text-red-900/60 font-semibold">
                    Holder Profile
                  </div>
                  <h4 className="font-display font-extrabold text-2xl md:text-3xl text-red-900 leading-tight mt-1">
                    Arjun Verma
                  </h4>
                  <div className="text-xs text-foreground/60 mt-1">
                    Performance Marketing · Bangalore, IN
                  </div>
                </div>
                <div className="shrink-0 h-16 w-14 rounded border-2 border-red-900/30 bg-white/60 flex items-center justify-center">
                  <span className="text-[9px] text-red-900/50 tracking-wider">PHOTO</span>
                </div>
              </div>

              {/* Score block */}
              <div className="relative mt-6 grid grid-cols-3 gap-3">
                <div className="col-span-1 rounded-xl border-2 border-red-900/20 p-3 text-center bg-white/50">
                  <div className="text-[9px] tracking-widest uppercase text-red-900/60 font-bold">
                    Score
                  </div>
                  <div className="font-display font-extrabold text-4xl text-red-700 leading-none mt-1">
                    78
                  </div>
                  <div className="text-[10px] text-foreground/60 mt-1">/ 100</div>
                </div>
                <div className="col-span-2 rounded-xl border-2 border-red-900/20 p-3 bg-white/50">
                  <div className="text-[9px] tracking-widest uppercase text-red-900/60 font-bold mb-2">
                    Industry Benchmark
                  </div>
                  <div className="space-y-2">
                    {skillRatings.slice(0, 3).map((s) => (
                      <div key={s.label}>
                        <div className="flex justify-between text-[10px] font-semibold text-foreground/80">
                          <span>{s.label}</span>
                          <span className="text-red-700">{s.score}</span>
                        </div>
                        <div className="h-1 rounded-full bg-red-900/10 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-red-700 to-yellow-500"
                            style={{ width: `${s.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Meta grid */}
              <div className="relative mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-[11px]">
                {[
                  ["Passport No.", "IAT-2026-04781"],
                  ["Issued", "12 MAY 2026"],
                  ["Valid Until", "12 MAY 2028"],
                  ["Authority", "I Am Talento"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div className="text-[8px] tracking-[0.25em] uppercase text-red-900/50 font-bold">
                      {k}
                    </div>
                    <div className="font-mono font-semibold text-foreground/85">{v}</div>
                  </div>
                ))}
              </div>

              {/* Stamps */}
              <div className="relative mt-6 h-32">
                {stamps.map((s, i) => {
                  const colorMap: Record<string, string> = {
                    red: "border-red-700 text-red-700",
                    blue: "border-blue-700 text-blue-700",
                    green: "border-green-700 text-green-700",
                  };
                  const positions = ["left-0 top-2", "left-1/3 top-6", "right-2 top-0"];
                  return (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
                      whileInView={{ opacity: 0.85, scale: 1, rotate: s.rot }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.15, type: "spring", stiffness: 120 }}
                      className={`absolute ${positions[i]} ${colorMap[s.color]} border-[3px] rounded-lg px-3 py-1.5 font-display font-extrabold uppercase tracking-wider bg-transparent`}
                      style={{ transform: `rotate(${s.rot}deg)` }}
                    >
                      <div className="flex items-center gap-1.5">
                        <Stamp className="h-3 w-3" />
                        <span className="text-sm leading-tight">{s.label}</span>
                      </div>
                      <div className="text-[8px] tracking-widest opacity-80">{s.sub}</div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Signature line */}
              <div className="relative mt-4 pt-3 border-t border-red-900/20 flex items-end justify-between">
                <div>
                  <div className="font-display italic text-lg text-red-900/80 leading-none">
                    A. Verma
                  </div>
                  <div className="text-[9px] tracking-widest uppercase text-red-900/50 font-bold mt-1">
                    Holder Signature
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-red-900/70 font-semibold">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Verified
                </div>
              </div>
            </div>

            {/* Corner ribbon */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-400 text-red-900 text-[10px] font-extrabold uppercase tracking-wider shadow">
              <Plane className="h-3 w-3" />
              Career Ready
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4 inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-red-600" />
            Shareable with recruiters · LinkedIn ready · Verified credential
          </p>
          <div>
            <Button
              size="lg"
              className="bg-red-600 text-white hover:bg-red-700 font-bold h-12 px-8 rounded-xl shadow-xl"
            >
              Claim Your Passport
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DigitalSkillPassportSection;
