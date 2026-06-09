import { motion } from "framer-motion";
import { Building2, Users, ShieldCheck, Target } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

const companyLogos = [
  { name: "Google", logo: "https://logo.clearbit.com/google.com" },
  { name: "Microsoft", logo: "https://logo.clearbit.com/microsoft.com" },
  { name: "Amazon", logo: "https://logo.clearbit.com/amazon.com" },
  { name: "Accenture", logo: "https://logo.clearbit.com/accenture.com" },
  { name: "IBM", logo: "https://logo.clearbit.com/ibm.com" },
  { name: "Oracle", logo: "https://logo.clearbit.com/oracle.com" },
  { name: "Infosys", logo: "https://logo.clearbit.com/infosys.com" },
  { name: "TCS", logo: "https://logo.clearbit.com/tcs.com" },
  { name: "Capgemini", logo: "https://logo.clearbit.com/capgemini.com" },
  { name: "Wipro", logo: "https://logo.clearbit.com/wipro.com" },
  { name: "Deloitte", logo: "https://logo.clearbit.com/deloitte.com" },
  { name: "Cognizant", logo: "https://logo.clearbit.com/cognizant.com" },
  { name: "SAP", logo: "https://logo.clearbit.com/sap.com" },
  { name: "Adobe", logo: "https://logo.clearbit.com/adobe.com" },
  { name: "Salesforce", logo: "https://logo.clearbit.com/salesforce.com" },
];

const marqueeLogos = [...companyLogos, ...companyLogos];

const stats = [
  { icon: Building2, value: "5,00,000+", label: "Jobs Listed" },
  { icon: Users, value: "10,000+", label: "Candidates Screened" },
  { icon: ShieldCheck, value: "99%", label: "Proctoring Accuracy" },
  { icon: Target, value: "73%", label: "Faster Hiring" },
];

const JobsSocialProof = () => (
  <section className="py-16 md:py-24 border-y border-border/50 bg-card/30 relative overflow-hidden">
    <div className="container px-4 md:px-6 mb-10">
      <div className="text-center mb-4">
        <SectionBadge label="Social Proof" icon={Building2} />
      </div>
      <motion.h2
        className="text-center text-3xl md:text-4xl font-bold font-display mb-2"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Trusted by Hiring<br />
        <span className="text-primary">Leaders Worldwide</span>
      </motion.h2>
      <motion.p
        className="text-center text-sm md:text-base text-muted-foreground mb-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        Leading employers rely on IAmTalento for skills-first, proctored hiring at scale.
      </motion.p>

      {/* Stats row */}
      <div className="flex flex-wrap justify-center items-start gap-8 md:gap-16 mb-10">
        {stats.map(({ icon: Icon, value, label }, i) => (
          <motion.div
            key={label}
            className="text-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <Icon className="h-5 w-5 text-primary" />
              <p className="text-2xl md:text-3xl font-bold font-display">{value}</p>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">{label}</p>
          </motion.div>
        ))}
      </div>
    </div>

    {/* Logo Marquee — single row */}
    <div className="overflow-hidden relative py-6 md:py-10">
      <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-background to-transparent z-10" />
      <motion.div
        className="flex w-max gap-10 md:gap-16 px-8 items-center"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {marqueeLogos.map((company, i) => (
          <div
            key={i}
            className="flex items-center justify-center h-10 md:h-14 w-28 md:w-40 shrink-0 hover:opacity-60 transition-all duration-500"
          >
            <img
              src={company.logo}
              alt={company.name}
              className="max-h-7 md:max-h-10 max-w-full object-contain dark:brightness-0 dark:invert"
              loading="lazy"
            />
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default JobsSocialProof;
