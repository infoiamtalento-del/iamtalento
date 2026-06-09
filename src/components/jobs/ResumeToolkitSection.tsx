import { motion } from "framer-motion";
import { Sparkles, Video, FileCheck2, ArrowRight, FileText } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Sparkles,
    eyebrow: "AI Powered",
    title: "AI Resume Builders",
    description:
      "Generate a recruiter-ready resume in minutes. Our AI tailors content to the role, highlights your strengths, and writes crisp bullet points for you.",
    bullets: ["Role-specific suggestions", "Keyword optimization", "One-click rewrites"],
  },
  {
    icon: Video,
    eyebrow: "Stand Out",
    title: "Video Resume Templates",
    description:
      "Go beyond paper. Record a 60-second pitch using guided templates, smart prompts and pro-grade overlays that make you memorable.",
    bullets: ["Guided scripts", "Auto-captions", "Shareable links"],
  },
  {
    icon: FileCheck2,
    eyebrow: "Get Shortlisted",
    title: "ATS Friendly Templates",
    description:
      "Beat the bots. Every template is structured to pass Applicant Tracking Systems while staying beautiful for human recruiters.",
    bullets: ["Clean parsing", "Recruiter-tested layouts", "Instant PDF export"],
  },
];

const ResumeToolkitSection = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-1/3 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-warning/5 blur-[100px]" />
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
            className="text-muted-foreground text-base md:text-lg"
          >
            From AI-written drafts to video pitches and ATS-ready exports — everything you need to land your next role.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative rounded-2xl border border-border bg-card p-7 hover:border-primary/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute top-0 left-7 right-7 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-center gap-3 mb-5">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <Icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                    {f.eyebrow}
                  </span>
                </div>

                <h3 className="text-xl font-bold font-display mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{f.description}</p>

                <ul className="space-y-2 mb-6">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-xs font-medium text-foreground/80">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {b}
                    </li>
                  ))}
                </ul>

                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto text-primary hover:bg-transparent hover:text-primary group/btn font-semibold"
                >
                  Try it now
                  <ArrowRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ResumeToolkitSection;
