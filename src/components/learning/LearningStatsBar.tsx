import { motion } from "framer-motion";
import { Users, BookOpen, Globe, TrendingUp } from "lucide-react";

const stats = [
  { value: "50,000+", label: "Learners Enrolled", icon: Users },
  { value: "200+", label: "Industry Courses", icon: BookOpen },
  { value: "5+", label: "Languages Available", icon: Globe },
  { value: "92%", label: "Placement Rate", icon: TrendingUp },
];

const LearningStatsBar = () => (
  <section className="py-10 md:py-14 bg-muted/30 border-y border-border/50">
    <div className="container px-4 md:px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="relative text-center p-5 md:p-6 rounded-2xl bg-card border border-border/60 hover:border-primary/20 hover:shadow-md transition-all duration-300 group"
          >
            <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/15 transition-colors duration-300">
              <s.icon className="h-5 w-5 text-primary" />
            </div>
            <p className="text-2xl md:text-3xl font-bold font-display text-foreground mb-0.5">
              {s.value}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground font-medium">
              {s.label}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default LearningStatsBar;
