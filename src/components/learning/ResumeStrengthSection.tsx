import { motion } from "framer-motion";
import { FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SectionBadge from "@/components/ui/section-badge";

const ResumeStrengthSection = () => (
  <section className="py-16 md:py-24 bg-muted/30">
    <div className="container px-4 md:px-6">
      <div className="text-center mb-10">
        <SectionBadge label="Resume Intelligence" icon={FileText} />
        <h2 className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3">
          Turn Every New Skill<br />
          <span className="text-primary">Into Resume Strength</span>
        </h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
          <span className="block">Complete courses and watch your AI Resume Strength Score update.</span>
          <span className="block">Make every new skill visible.</span>
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
        {/* Before */}
        <motion.div initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-xl border bg-card p-6 text-center">
          <p className="text-xs font-semibold text-muted-foreground mb-3">Before Learning</p>
          <div className="relative w-24 h-24 mx-auto mb-3">
            <svg width={96} height={96} className="-rotate-90">
              <circle cx={48} cy={48} r={40} fill="none" stroke="hsl(var(--muted))" strokeWidth={6} />
              <motion.circle cx={48} cy={48} r={40} fill="none" stroke="hsl(var(--destructive))" strokeWidth={6} strokeLinecap="round" strokeDasharray={251} initial={{ strokeDashoffset: 251 }} whileInView={{ strokeDashoffset: 251 - 251 * 0.52 }} viewport={{ once: true }} transition={{ duration: 1 }} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold font-display">52%</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Weak match for most roles</p>
        </motion.div>
        {/* After */}
        <motion.div initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-xl border-2 border-primary/30 bg-card p-6 text-center relative overflow-hidden">
          <div className="absolute top-2 right-2 text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-semibold">After 3 courses</div>
          <p className="text-xs font-semibold text-muted-foreground mb-3">After Learning</p>
          <div className="relative w-24 h-24 mx-auto mb-3">
            <svg width={96} height={96} className="-rotate-90">
              <circle cx={48} cy={48} r={40} fill="none" stroke="hsl(var(--muted))" strokeWidth={6} />
              <motion.circle cx={48} cy={48} r={40} fill="none" stroke="hsl(var(--primary))" strokeWidth={6} strokeLinecap="round" strokeDasharray={251} initial={{ strokeDashoffset: 251 }} whileInView={{ strokeDashoffset: 251 - 251 * 0.84 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 }} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold font-display text-primary">84%</span>
            </div>
          </div>
          <p className="text-xs font-semibold text-[hsl(142,71%,45%)]">Strong Match for 120+ Roles</p>
        </motion.div>
      </div>
      <div className="text-center mt-8">
        <Link to="/profile">
          <Button className="bg-[hsl(33,100%,50%)] text-white hover:bg-[hsl(33,100%,45%)] border-0 gap-2">
            Boost Your Resume Score <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  </section>
);

export default ResumeStrengthSection;
