import { motion } from "framer-motion";
import { Eye, ShieldCheck, Briefcase, Sparkles } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

const pillars = [
  { icon: Eye, label: "Get Seen" },
  { icon: ShieldCheck, label: "Get Verified" },
  { icon: Briefcase, label: "Get Hired" },
];

const GetHiredBanner = () => (
  <section className="py-14 md:py-20">
    <div className="container">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 md:p-14 text-center">


        <div className="relative">
          <SectionBadge label="The Future of Hiring is Here" icon={Sparkles} />

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold font-display leading-tight mb-4"
          >
            Get Seen. Get Verified.{" "}
            <span className="text-primary">Get Hired.</span>
          </motion.h2>

          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Showcase proven skills. Get hired by employers who value capability over resumes.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {pillars.map(({ icon: Icon, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="flex items-center gap-2 rounded-full border border-border bg-background/80 backdrop-blur px-5 py-2.5 shadow-sm"
              >
                <span className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="h-3.5 w-3.5 text-primary" />
                </span>
                <span className="text-sm font-bold text-foreground">{label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default GetHiredBanner;
