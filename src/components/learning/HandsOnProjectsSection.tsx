import { motion } from "framer-motion";
import { Wrench, Play, Clock, CheckCircle2, ArrowUpRight, Layers, Eye, Paperclip } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";
import projectThumb from "@/assets/hands-on-project-thumb.jpg";

const HandsOnProjectsSection = () => (
  <section className="py-16 md:py-24">
    <div className="container px-4 md:px-6">
      <div className="text-center mb-10">
        <SectionBadge label="Hands-On Learning" icon={Wrench} />
        <h2 className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3">
          Learn by Doing,<br />
          <span className="text-primary">Not Just Watching</span>
        </h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
          <span className="block">Apply every lesson through real projects.</span>
          <span className="block">Build a stronger portfolio.</span>
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {/* Card 1 — Large feature card (spans 2 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="md:col-span-2 relative rounded-2xl bg-primary overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-primary/80" />
          <div className="relative z-10 flex flex-col md:flex-row">
            {/* Text content */}
            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold text-white mb-4">
                  <Layers className="h-3 w-3" /> Real-Time Projects
                </div>
                <h3 className="text-xl md:text-2xl font-bold font-display mb-2 leading-tight max-w-xs text-white">
                  Build Scalable Projects
                </h3>
                <p className="text-white/75 text-sm max-w-xs mb-6">
                  Apply every lesson with domain expert feedback.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center cursor-pointer"
                >
                  <Play className="h-4 w-4 text-white fill-white" />
                </motion.div>
                <span className="text-xs text-white/75">Watch how it works</span>
              </div>
            </div>
            {/* Video thumbnail */}
            <div className="relative w-full md:w-[45%] min-h-[180px] md:min-h-0">
              <img
                src={projectThumb}
                alt="Student working on a real-world project"
                className="absolute inset-0 w-full h-full object-cover md:rounded-r-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-transparent md:rounded-r-2xl" />
              <motion.div
                whileHover={{ scale: 1.15 }}
                className="absolute inset-0 flex items-center justify-center cursor-pointer"
              >
                <div className="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                  <Play className="h-5 w-5 text-primary fill-primary ml-0.5" />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Card 2 — Recruiter Visible */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border bg-card p-6 flex flex-col justify-between group hover:border-primary/30 transition-colors"
        >
          <div>
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Eye className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-bold font-display mb-1.5">Recruiter Visible</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Hiring companies can see your project work directly on your verified profile.
            </p>
          </div>
          <motion.div whileHover={{ x: 4 }} className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary cursor-pointer">
            Learn more <ArrowUpRight className="h-3 w-3" />
          </motion.div>
        </motion.div>

        {/* Card 3 — Mock project card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-2xl border bg-card p-5 space-y-3 group hover:border-primary/30 transition-colors"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold font-display">E-commerce Dashboard</h4>
            <span className="text-[10px] bg-accent text-primary px-2 py-0.5 rounded-full font-semibold">Submitted</span>
          </div>
          <p className="text-xs text-muted-foreground">Build a responsive dashboard using React & Recharts with live API data.</p>
          <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-1"><Clock className="h-3 w-3" /> Deadline: Mar 15</div>
            <div className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-primary" /> Score: 92/100</div>
          </div>
          {/* Mini progress bar */}
          <div className="pt-1">
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "92%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full bg-primary"
              />
            </div>
          </div>
        </motion.div>

        {/* Card 4 — Stats card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl border bg-card p-6 flex flex-col items-center justify-center text-center group hover:border-primary/30 transition-colors"
        >
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 200 }}
            className="text-4xl md:text-5xl font-bold font-display text-primary mb-1"
          >
            90%
          </motion.span>
          <p className="text-xs text-muted-foreground font-medium">of learners land interviews<br />within 3 months</p>
        </motion.div>

        {/* Card 5 — Add to Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="rounded-2xl border bg-card p-6 group hover:border-primary/30 transition-colors"
        >
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
            <Paperclip className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-bold font-display mb-1.5">Add to Profile</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Projects reflect directly on your verified profile, no separate portfolio needed.
          </p>
          <div className="flex gap-1.5 mt-4">
            {[1, 2, 3].map((n) => (
              <motion.div
                key={n}
                initial={{ width: 0 }}
                whileInView={{ width: `${20 + n * 15}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 + n * 0.1 }}
                className="h-1.5 rounded-full bg-primary/20"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default HandsOnProjectsSection;
