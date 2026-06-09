import { motion } from "framer-motion";
import { Sparkles, Video, FileCheck2, ArrowRight, FileText, Check } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Sparkles,
    eyebrow: "AI Powered",
    title: "AI Resume Builders",
    tag: "Built in minutes",
    accent: "from-primary/15 to-primary/0",
  },
  {
    icon: Video,
    eyebrow: "Stand Out",
    title: "Video Resume Templates",
    tag: "60-sec pitch",
    accent: "from-[hsl(33,100%,55%)]/15 to-transparent",
  },
  {
    icon: FileCheck2,
    eyebrow: "Get Shortlisted",
    title: "ATS Friendly Templates",
    tag: "Beat the bots",
    accent: "from-primary/15 to-primary/0",
  },
];

const ResumeToolkitSection = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-1/3 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="container px-4 md:px-6">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <SectionBadge label="Resume Toolkit" icon={FileText} />
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold font-display mb-3"
          >
            Build a Resume That<br />
            <span className="text-primary">Actually Gets You Hired</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-base"
          >
            Three smart tools. One job-ready you.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300"
              >
                {/* Visual top area */}
                <div className={`relative h-40 bg-gradient-to-br ${f.accent} flex items-center justify-center overflow-hidden`}>
                  <div className="absolute inset-0 opacity-[0.04]" style={{
                    backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }} />

                  {/* Mock resume card */}
                  <div className="relative w-32 h-40 -mb-10 bg-card rounded-lg shadow-xl border border-border/50 p-2.5 rotate-[-4deg] group-hover:rotate-0 transition-transform duration-500">
                    <div className="h-2 w-10 rounded-full bg-primary mb-2" />
                    <div className="h-1.5 w-full rounded-full bg-muted mb-1" />
                    <div className="h-1.5 w-4/5 rounded-full bg-muted mb-3" />
                    <div className="h-1.5 w-1/3 rounded-full bg-foreground/30 mb-1.5" />
                    <div className="h-1 w-full rounded-full bg-muted mb-1" />
                    <div className="h-1 w-5/6 rounded-full bg-muted mb-2.5" />
                    <div className="h-1.5 w-1/3 rounded-full bg-foreground/30 mb-1.5" />
                    <div className="h-1 w-full rounded-full bg-muted mb-1" />
                    <div className="h-1 w-3/4 rounded-full bg-muted" />
                  </div>

                  {/* Floating icon badge */}
                  <div className="absolute top-4 right-4 h-11 w-11 rounded-xl bg-card shadow-lg border border-border flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>

                  {/* Tag pill */}
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1 bg-card/90 backdrop-blur border border-border/60 rounded-full px-2.5 py-1">
                    <Check className="h-3 w-3 text-primary" />
                    <span className="text-[10px] font-semibold text-foreground">{f.tag}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 pt-7">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                    {f.eyebrow}
                  </span>
                  <h3 className="text-lg font-bold font-display mt-1 mb-4">{f.title}</h3>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors group/btn"
                  >
                    Try it now
                    <ArrowRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ResumeToolkitSection;
