import { motion } from "framer-motion";
import { Globe } from "lucide-react";

const remoteCompanies = [
  { name: "GitLab", positions: "45 open positions", color: "bg-orange-500/10 text-orange-500" },
  { name: "Zapier", positions: "32 open positions", color: "bg-amber-500/10 text-amber-600" },
  { name: "InVision", positions: "28 open positions", color: "bg-pink-500/10 text-pink-500" },
  { name: "Automattic", positions: "24 open positions", color: "bg-blue-500/10 text-blue-500" },
  { name: "Canva", positions: "18 open positions", color: "bg-cyan-500/10 text-cyan-500" },
  { name: "Doist", positions: "15 open positions", color: "bg-red-500/10 text-red-500" },
];

const RemoteJobsSection = () => {
  return (
    <section className="py-16 md:py-20 bg-accent/20">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-2">Remote Jobs</h2>
          <p className="text-muted-foreground">Work from anywhere in the world</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {remoteCompanies.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer flex items-center gap-3"
            >
              <div className={`h-10 w-10 rounded-lg ${c.color} flex items-center justify-center shrink-0`}>
                <Globe className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold font-display truncate">{c.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{c.positions}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RemoteJobsSection;
