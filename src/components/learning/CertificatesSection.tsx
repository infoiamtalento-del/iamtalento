import { motion } from "framer-motion";
import { ShieldCheck, Link2, ClipboardList, Award, QrCode, CheckCircle2, Sparkles } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";
import learnerPriya from "@/assets/learner-priya.jpg";

const diffs = [
  { icon: ShieldCheck, title: "AI-verified, tamper-proof", desc: "Blockchain-backed verification that can't be faked" },
  { icon: Link2, title: "Shareable link + LinkedIn ready", desc: "One-click share to your professional network" },
  { icon: ClipboardList, title: "Auto-added to job profile", desc: "Automatically reflected in your recruiter-facing profile" },
];

const verifiedSkills = ["SQL & Data Modeling", "Python Analytics", "BI Dashboards", "Statistical Inference"];

const CertificatesSection = () => (
  <section className="py-16 md:py-24 bg-muted/30">
    <div className="container px-4 md:px-6">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <SectionBadge label="Verified Certificates" icon={Award} />
          <h2 className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3">
            Earn Certificates Recruiters<br />
            <span className="text-primary">Can Trust</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mb-8">
            <span className="block">Give recruiters clear proof of your skills.</span>
            <span className="block">Go beyond a static PDF.</span>
          </p>
          <div className="space-y-4">
            {diffs.map((d, i) => (
              <motion.div key={d.title} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <d.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-display">{d.title}</h3>
                  <p className="text-xs text-muted-foreground">{d.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Certificate mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-[0_20px_50px_rgba(0,44,102,0.12)] overflow-hidden border border-slate-200/90">
            {/* Corner ribbon accents */}
            <div className="absolute top-0 left-0 w-24 h-24 overflow-hidden pointer-events-none z-10">
              <div className="absolute -top-2 -left-2 w-32 h-7 bg-primary rotate-[-45deg] origin-center translate-y-5 shadow-xs" />
            </div>
            <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none z-10">
              <div className="absolute -top-2 -right-2 w-32 h-7 bg-primary rotate-[45deg] origin-center translate-y-5 shadow-xs" />
            </div>
            <div className="absolute bottom-0 left-0 w-24 h-24 overflow-hidden pointer-events-none z-10">
              <div className="absolute -bottom-2 -left-2 w-32 h-7 bg-primary rotate-[45deg] origin-center -translate-y-5 shadow-xs" />
            </div>
            <div className="absolute bottom-0 right-0 w-24 h-24 overflow-hidden pointer-events-none z-10">
              <div className="absolute -bottom-2 -right-2 w-32 h-7 bg-primary rotate-[-45deg] origin-center -translate-y-5 shadow-xs" />
            </div>

            {/* Inner ornamental double-frame */}
            <div className="m-4 sm:m-5 rounded-xl border-2 border-primary/20 p-1.5 bg-white">
              <div className="rounded-lg border border-amber-500/25 px-6 py-7 sm:px-9 sm:py-9 bg-white flex flex-col justify-between min-h-[400px] md:min-h-[430px]">
                {/* Top Header Bar: Issuer Identity + QR Verification */}
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-xs border border-amber-400/40"
                      style={{ backgroundColor: "#002C66" }}
                    >
                      <Award className="h-6 w-6 text-amber-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-primary">
                          I Am Talento
                        </span>
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-50 border border-amber-300/80 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-800">
                          <Sparkles className="h-2.5 w-2.5 text-amber-600" /> Official
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 mt-0.5">
                        Certificate of Completion
                      </p>
                    </div>
                  </div>

                  {/* QR + Credential ID */}
                  <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2">
                    <div className="text-right hidden sm:block">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Credential ID
                      </p>
                      <p className="text-[11px] font-mono font-bold text-slate-700">
                        IAT-2026-DA-4821
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center border border-slate-200 shrink-0 shadow-2xs">
                      <QrCode className="h-6 w-6 text-slate-800" />
                    </div>
                  </div>
                </div>

                {/* Middle: Recipient Profile Photo + Course Title + Skills */}
                <div className="py-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                  {/* Recipient Avatar with Verified Ring */}
                  <div className="relative shrink-0">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full p-1 border-2 border-primary/25 bg-slate-50 shadow-md">
                      <img
                        src={learnerPriya}
                        alt="Priya Raghavan"
                        className="w-full h-full rounded-full object-cover object-top"
                      />
                    </div>
                    <div
                      className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow-sm"
                      style={{ backgroundColor: "#002C66" }}
                      title="Identity & Proctoring Verified"
                    >
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                  </div>

                  {/* Recipient & Course Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                      Proudly Awarded To
                    </p>
                    <h3 className="text-2xl md:text-[26px] font-extrabold font-display text-slate-900 tracking-tight mt-0.5">
                      Priya Raghavan
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      for successfully mastering the industry-benchmarked curriculum in
                    </p>
                    <div className="mt-2 inline-block">
                      <h4 className="text-lg md:text-xl font-bold font-display text-primary leading-snug">
                        Data Analytics Masterclass
                      </h4>
                      <div className="h-0.5 w-2/3 bg-amber-400 rounded-full mt-1 mx-auto sm:mx-0" />
                    </div>

                    {/* Verified Skill Pills */}
                    <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-1.5">
                      {verifiedSkills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1 rounded-md bg-slate-100 border border-slate-200/80 px-2.5 py-1 text-[10.5px] font-semibold text-slate-700"
                        >
                          <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Footer: Score, Issue Date & Blockchain Verification Badge */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-5">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Assessment Score
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        <span className="text-sm font-extrabold text-slate-900">92%</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Top 5%
                        </span>
                      </div>
                    </div>

                    <div className="h-7 w-px bg-slate-200" />

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Issued On
                      </p>
                      <p className="text-xs font-bold text-slate-800 mt-0.5">
                        Feb 2026
                      </p>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 bg-primary/8 border border-primary/20 rounded-full px-4 py-2">
                    <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-xs font-bold text-primary">
                      Verified by I Am Talento
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default CertificatesSection;
