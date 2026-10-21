import { motion } from "framer-motion";
import SectionBadge from "@/components/ui/section-badge";
import { ArrowUpRight, Globe } from "lucide-react";

const invisionSvgDataUri =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="14" fill="#FF3366"/>
      <circle cx="21" cy="19" r="4.2" fill="#FFFFFF"/>
      <path d="M17 27H25V47H17V27Z" fill="#FFFFFF"/>
      <path d="M30 27H37.5V30.4C39.2 28 41.9 26.5 45.4 26.5C50.8 26.5 54 30.1 54 36.2V47H46V37.4C46 34.3 44.5 32.6 41.9 32.6C39.2 32.6 38 34.4 38 37.4V47H30V27Z" fill="#FFFFFF"/>
    </svg>`
  );

const canvaSvgDataUri =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="30" fill="#00C4CC"/>
      <path d="M44.5 38.2C42.2 42.3 37.9 45 32.8 45C24.8 45 19 39.2 19 31.8C19 24.1 25.1 18 33.1 18C38.6 18 42.9 20.8 44.3 25.1L38.6 27.3C37.6 24.7 35.6 23.3 33 23.3C28.4 23.3 25.4 26.8 25.4 31.8C25.4 36.7 28.5 39.8 32.9 39.8C35.8 39.8 38.1 38.3 39.3 35.7L44.5 38.2Z" fill="#FFFFFF"/>
    </svg>`
  );

const remoteCompanies = [
  {
    name: "GitLab",
    positions: "45 open positions",
    logo: "https://cdn.simpleicons.org/gitlab/FC6D26",
  },
  {
    name: "Zapier",
    positions: "32 open positions",
    logo: "https://cdn.simpleicons.org/zapier/FF4A00",
  },
  {
    name: "InVision",
    positions: "28 open positions",
    logo: invisionSvgDataUri,
  },
  {
    name: "Automattic",
    positions: "24 open positions",
    logo: "https://cdn.simpleicons.org/automattic/3499CD",
  },
  {
    name: "Canva",
    positions: "18 open positions",
    logo: canvaSvgDataUri,
  },
  {
    name: "Doist",
    positions: "15 open positions",
    logo: "https://cdn.simpleicons.org/todoist/E44332",
  },
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
            Flexible, work-from-anywhere roles at trusted employers,
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
              <ArrowUpRight className="absolute top-3 right-3 h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all" />
              <div className="relative flex flex-col items-start gap-3">
                <div className="h-12 w-12 rounded-xl bg-white border border-border/60 flex items-center justify-center shrink-0 shadow-sm">
                  <img
                    src={c.logo}
                    alt={`${c.name} logo`}
                    loading="lazy"
                    className="h-7 w-7 object-contain"
                  />
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
