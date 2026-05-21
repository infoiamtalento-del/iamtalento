import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import SectionBadge from "@/components/ui/section-badge";

const VideoSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section ref={ref} className="py-16 md:py-20">
      <div className="container">
        <div className={cn("text-center max-w-2xl mx-auto mb-12 transition-all duration-700", isVisible ? "opacity-100" : "opacity-0 translate-y-8")}>
          <SectionBadge label="Watch Demo" icon={Play} />
          <motion.h2
            className="text-3xl md:text-4xl font-bold font-display mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            See It in Action.<br /><span className="text-primary">Decide in Minutes.</span>
          </motion.h2>
          <p className="text-muted-foreground text-lg">A 3-minute walkthrough of how assessments, scoring, and job matching come together.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto relative group cursor-pointer"
        >
          <div className="aspect-video rounded-2xl bg-foreground/[0.03] border border-border/50 overflow-hidden relative flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,hsl(var(--background)/0.6)_100%)]" />
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
              backgroundSize: "40px 40px"
            }} />
            <div className="absolute top-8 left-8 right-8 bottom-8 rounded-xl border border-border/30 overflow-hidden">
              <div className="h-8 bg-foreground/[0.03] border-b border-border/20 flex items-center px-3 gap-1.5">
                <div className="h-2 w-2 rounded-full bg-muted-foreground/20" />
                <div className="h-2 w-2 rounded-full bg-muted-foreground/20" />
                <div className="h-2 w-2 rounded-full bg-muted-foreground/20" />
                <div className="flex-1 h-3 rounded bg-foreground/[0.03] mx-8" />
              </div>
              <div className="p-4 grid grid-cols-3 gap-3">
                <div className="col-span-1 space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-3 rounded bg-foreground/[0.03]" style={{ width: `${70 + Math.random() * 30}%` }} />
                  ))}
                </div>
                <div className="col-span-2 h-full rounded-lg bg-foreground/[0.02] border border-border/10" />
              </div>
            </div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative z-10 h-20 w-20 rounded-full gradient-primary flex items-center justify-center shadow-glow group-hover:shadow-xl transition-shadow"
            >
              <Play className="h-8 w-8 text-primary-foreground ml-1" fill="currentColor" />
            </motion.div>
          </div>
        </motion.div>

        <div className="text-center mt-8">
          <Button size="lg" variant="outline" className="gap-2 h-12 px-8">
            <Play className="h-4 w-4" /> Watch the Walkthrough
          </Button>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
