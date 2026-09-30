import { motion } from "framer-motion";
import SectionBadge from "@/components/ui/section-badge";
import { ArrowUpRight, Globe } from "lucide-react";

const remoteCompanies = [
  { name: "GitLab", positions: "45 open positions", logo: "https://cdn.simpleicons.org/gitlab", tint: "from-orange-500/15 to-orange-500/5" },
  { name: "Zapier", positions: "32 open positions", logo: "https://cdn.simpleicons.org/zapier/FF4A00", tint: "from-amber-500/15 to-amber-500/5" },
  { name: "InVision", positions: "28 open positions", logo: "https://cdn.simpleicons.org/invision/FF3366", tint: "from-pink-500/15 to-pink-500/5" },
  { name: "Automattic", positions: "24 open positions", logo: "https://cdn.simpleicons.org/automattic/3499CD", tint: "from-blue-500/15 to-blue-500/5" },
  { name: "Canva", positions: "18 open positions", logo: "https://cdn.simpleicons.org/canva/00C4CC", tint: "from-cyan-500/15 to-cyan-500/5" },
  { name: "Doist", positions: "15 open positions", logo: "https://cdn.simpleicons.org/todoist/E44332", tint: "from-red-500/15 to-red-500/5" },
];

const RemoteJobsSection = () => {
  return (
    <section className="py-16 md:py-20 bg-accent/20">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10">
          <SectionBadge label="Work From Anywhere" icon={Globe} />
          <h2 className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3">
            Remote Roles from Leading<br />
            <span className="text-primary">Global Companies</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Flexible, work-from-anywhere roles at trusted employers —
            <br className="hidden md:block" />
            all verified and open to talent across India.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {remoteCompanies.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group relative p-5 rounded-2xl bg-card border border-border/60 hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${c.tint} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <ArrowUpRight className="absolute top-3 right-3 h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all" />
              <div className="relative flex flex-col items-start gap-3">
                <div className="h-12 w-12 rounded-xl bg-background border border-border/60 flex items-center justify-center shrink-0 shadow-sm">
                  <img src={c.logo} alt={`${c.name} logo`} loading="lazy" className="h-7 w-7 object-contain" />
                </div>
                <div className="min-w-0 w-full">
                  <p className="text-sm font-semibold font-display truncate">{c.name}</p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{c.positions}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RemoteJobsSection;
