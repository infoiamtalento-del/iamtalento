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
      <div className="relative overflow-hidden rounded-3xl bg-primary p-8 md:p-14 text-center">


        <div className="relative">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-semibold text-white mb-5">
            <Sparkles className="h-3.5 w-3.5" /> The Future of Hiring is Here
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold font-display leading-tight mb-4 text-primary-foreground"
          >
            Get Seen. Get Verified.{" "}
            <span className="text-yellow-300">Get Hired.</span>
          </motion.h2>

          <p className="text-primary-foreground/80 text-base md:text-lg max-w-2xl mx-auto">
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
                className="flex items-center gap-2 rounded-full bg-white/15 backdrop-blur border border-white/20 px-5 py-2.5"
              >
                <span className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center">
                  <Icon className="h-3.5 w-3.5 text-white" />
                </span>
                <span className="text-sm font-bold text-white">{label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default GetHiredBanner;
