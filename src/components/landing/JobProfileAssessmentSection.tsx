import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import SectionBadge from "@/components/ui/section-badge";

const videos = [
  {
    title: "Build Your Job Profile",
    description: "Showcase your skills, experience and aspirations in a profile recruiters trust.",
    poster: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&q=80",
  },
  {
    title: "Take Role-Specific Assessments",
    description: "Prove your skills with AI-powered, proctored assessments tailored to your role.",
    poster: "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?w=1200&q=80",
  },
  {
    title: "Get Your Industry Readiness Score",
    description: "Benchmark yourself against real professionals and stand out to employers.",
    poster: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80",
  },
];

const JobProfileAssessmentSection = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % videos.length);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  const current = videos[index];

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <SectionBadge label="Get Started" icon={Sparkles} />
          <motion.h2
            className="text-3xl md:text-4xl font-bold font-display mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Create Your Job Profile &<br />
            <span className="text-primary">Get Your Skill Assessment</span>
          </motion.h2>
          <p className="text-muted-foreground text-lg">
            Showcase who you are and prove what you can do — all in one place.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto relative"
        >
          <div className="aspect-video rounded-2xl bg-foreground/[0.03] border border-border/50 overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <img
                  src={current.poster}
                  alt={current.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <h3 className="text-xl md:text-2xl font-bold font-display mb-2">
                    {current.title}
                  </h3>
                  <p className="text-muted-foreground max-w-xl">
                    {current.description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {videos.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Show step ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
          <Button asChild size="lg" className="gap-2 h-12 px-8">
            <Link to="/skill-assessment">
              <Briefcase className="h-4 w-4" /> Take Your Skill Assessment
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 px-8">
            <Link to="/profile">Create Your Job Profile</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default JobProfileAssessmentSection;
