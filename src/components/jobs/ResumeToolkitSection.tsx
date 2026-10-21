import { motion } from "framer-motion";
import { Sparkles, Video, FileCheck2, ArrowRight, FileText, Check } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";
import { Button } from "@/components/ui/button";
import resumeAiImg from "@/assets/resume-ai-builder.jpg";
import resumeVideoImg from "@/assets/resume-video.jpg";
import resumeAtsImg from "@/assets/resume-ats.jpg";

const features = [
  {
    icon: Sparkles,
    eyebrow: "AI Powered",
    title: "AI Resume Builders",
    description: "Build a professional resume in minutes. Powered by smart AI suggestions.",
    tag: "Built in minutes",
    bg: "bg-[#002C66]",
    image: resumeAiImg,
  },
  {
    icon: Video,
    eyebrow: "Stand Out",
    title: "Video Resume Templates",
    description: "Create video resumes that stand out. Make a memorable first impression.",
    tag: "60-sec pitch",
    bg: "bg-[#002C66]",
    image: resumeVideoImg,
  },
  {
    icon: FileCheck2,
    eyebrow: "Get Shortlisted",
    title: "ATS Friendly Templates",
    description: "Optimized for ATS screening systems. Get shortlisted with confidence.",
    tag: "Beat the bots",
    bg: "bg-[#002C66]",
    image: resumeAtsImg,
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
            className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3"
          >
            Build a Resume That<br />
            <span className="text-primary">Gets You Hired</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto"
          >
            AI-powered builder, grader, and expert templates,
            <br className="hidden md:block" />
            everything you need to land more interviews.
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
                <div className={`relative h-44 ${f.bg} overflow-hidden`}>
                  <img
                    src={f.image}
                    alt={f.title}
                    width={768}
                    height={512}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Floating icon badge */}
                  <div className="absolute top-4 right-4 h-11 w-11 rounded-xl bg-card shadow-lg border border-border flex items-center justify-center group-hover:scale-110 transition-transform z-10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>

                  {/* Tag pill */}
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1 bg-card/90 backdrop-blur border border-border/60 rounded-full px-2.5 py-1 z-10">
                    <Check className="h-3 w-3 text-primary" />
                    <span className="text-[10px] font-semibold text-foreground">{f.tag}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                    {f.eyebrow}
                  </span>
                  <h3 className="text-lg font-bold font-display mt-1 mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {f.description}
                  </p>

                  <Button
                    size="sm"
                    className="w-full bg-[#002C66] text-white border border-[#002C66] hover:bg-[#00204d] hover:text-white transition-colors group/btn"
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
