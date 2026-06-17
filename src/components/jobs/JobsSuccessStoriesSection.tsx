import { motion } from "framer-motion";
import { BadgeCheck, Quote, ShieldCheck } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

const stories = [
  {
    initials: "PR",
    name: "Priya R.",
    city: "Mumbai",
    role: "Product Mgmt",
    company: "Swiggy",
    score: 91,
    quote: "The assessment helped me discover my strengths and land my dream role.",
  },
  {
    initials: "NK",
    name: "Nikhil K.",
    city: "Chennai",
    role: "Python / ML",
    company: "Flipkart",
    score: 94,
    quote: "Verified profile got me shortlisted faster and the process was smooth.",
  },
  {
    initials: "SA",
    name: "Sneha A.",
    city: "Hyderabad",
    role: "UI / UX",
    company: "Google",
    score: 87,
    quote: "The insights were spot on. It changed my career direction.",
  },
  {
    initials: "RS",
    name: "Rahul S.",
    city: "Delhi",
    role: "Data Science",
    company: "Microsoft",
    score: 92,
    quote: "Got matched with roles that actually fit my skills — not just keywords.",
  },
  {
    initials: "AM",
    name: "Ananya M.",
    city: "Bengaluru",
    role: "Frontend Dev",
    company: "Amazon",
    score: 89,
    quote: "Cleared three rounds in a week. Talento's verified badge made the difference.",
  },
  {
    initials: "AV",
    name: "Arjun V.",
    city: "Pune",
    role: "Cloud / DevOps",
    company: "Infosys",
    score: 90,
    quote: "Recruiters reached out to me first. I never had to chase a single application.",
  },
];

const JobsSuccessStoriesSection = () => {
  return (
    <section className="py-16 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <SectionBadge label="Success Stories" icon={ShieldCheck} />
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold font-display mb-3"
          >
            1000+ Success Stories <span className="text-primary">and counting</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto"
          >
            Real people, real assessments, real offers — careers accelerated through verified skills and data-driven guidance.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {stories.map((s, i) => (
            <motion.article
              key={s.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group p-6 rounded-2xl bg-card border border-border/60 hover:border-primary/40 hover:shadow-lg transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-5">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-sm font-bold font-display text-foreground/70 shrink-0">
                  {s.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold font-display text-foreground">{s.name}</p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      <BadgeCheck className="h-3 w-3" /> Hired
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.city}</p>
                </div>
              </div>

              {/* Role row */}
              <div className="flex items-end justify-between gap-4 pb-4 border-b border-dashed border-border">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Role</p>
                  <p className="text-sm font-semibold text-foreground">{s.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{s.company}</p>
                  <p className="text-sm font-semibold">
                    <span className="text-primary">{s.score}</span>
                    <span className="text-muted-foreground">/100</span>
                  </p>
                </div>
              </div>

              {/* Quote */}
              <div className="pt-4 flex gap-3">
                <Quote className="h-4 w-4 text-primary/40 shrink-0 mt-0.5" />
                <p className="text-sm italic text-muted-foreground leading-relaxed">
                  {s.quote}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobsSuccessStoriesSection;
