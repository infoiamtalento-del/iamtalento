import { motion } from "framer-motion";
import { ShieldCheck, Link2, ClipboardList, Award, QrCode } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

const diffs = [
  { icon: ShieldCheck, title: "AI-verified, tamper-proof", desc: "Blockchain-backed verification that can't be faked" },
  { icon: Link2, title: "Shareable link + LinkedIn ready", desc: "One-click share to your professional network" },
  { icon: ClipboardList, title: "Auto-added to job profile", desc: "Automatically reflected in your recruiter-facing profile" },
];

const CertificatesSection = () => (
  <section className="py-16 md:py-24 bg-muted/30">
    <div className="container px-4 md:px-6">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <SectionBadge label="Verified Certificates" icon={Award} />
          <h2 className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3">
            Earn Verified Certificates<br />
            <span className="text-primary">Recruiters Actually Trust</span>
          </h2>
          <p className="text-muted-foreground mb-8">Earn credentials that give recruiters clear, verifiable evidence of the skills you have developed —<br className="hidden md:block" />more useful than a static PDF.</p>
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
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="flex justify-center">
          <div className="relative w-full max-w-2xl rounded-2xl bg-card shadow-xl overflow-hidden border border-border">
            {/* Corner ribbon accents */}
            <div className="absolute top-0 left-0 w-20 h-20 overflow-hidden">
              <div className="absolute -top-2 -left-2 w-28 h-7 bg-primary rotate-[-45deg] origin-center translate-y-5" />
            </div>
            <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
              <div className="absolute -top-2 -right-2 w-28 h-7 bg-primary rotate-[45deg] origin-center translate-y-5" />
            </div>
            <div className="absolute bottom-0 left-0 w-20 h-20 overflow-hidden">
              <div className="absolute -bottom-2 -left-2 w-28 h-7 bg-primary rotate-[45deg] origin-center -translate-y-5" />
            </div>
            <div className="absolute bottom-0 right-0 w-20 h-20 overflow-hidden">
              <div className="absolute -bottom-2 -right-2 w-28 h-7 bg-primary rotate-[-45deg] origin-center -translate-y-5" />
            </div>

            {/* Inner frame — landscape */}
            <div className="m-4 rounded-xl border border-primary/20 px-10 py-8 relative bg-card flex gap-8 items-center">
              {/* Left: seal + title */}
              <div className="flex flex-col items-center text-center flex-1">
                <div className="mx-auto mb-3 w-14 h-14 rounded-full bg-gradient-to-br from-[hsl(43,96%,56%)] to-[hsl(33,100%,50%)] flex items-center justify-center shadow-lg">
                  <Award className="h-7 w-7 text-white" />
                </div>
                <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] mb-1">Certificate of Completion</p>
                <div className="w-12 h-px bg-primary/30 mx-auto mb-3" />
                <h3 className="text-xl md:text-2xl font-bold font-display mb-1 text-foreground leading-tight">Data Analytics Masterclass</h3>
                <p className="text-xs text-muted-foreground mb-0.5">Proudly Awarded to</p>
                <p className="text-lg font-bold font-display text-foreground">Priya Raghavan</p>
              </div>

              {/* Right: details + badge */}
              <div className="flex flex-col items-center justify-between flex-1 gap-4">
                {/* QR */}
                <div className="self-end h-10 w-10 rounded-lg bg-muted/60 flex items-center justify-center border border-border">
                  <QrCode className="h-6 w-6 text-muted-foreground" />
                </div>

                <div className="flex items-center gap-5 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Score: <span className="font-semibold text-foreground">92%</span>
                  </span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                  <span>Feb 2026</span>
                </div>

                <div className="h-px w-full bg-border" />

                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span className="text-xs font-bold text-primary">Verified by I Am Talento</span>
                  <span className="text-[10px] text-muted-foreground font-medium">· ID: IAT-2026-DA-4821</span>
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
