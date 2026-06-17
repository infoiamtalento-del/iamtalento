import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sprout, TrendingUp, Award, Crown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const levels = [
  { icon: Sprout, title: "Entry Level", years: "0-2 years", jobs: "4,560 jobs" },
  { icon: TrendingUp, title: "Mid Level", years: "2-5 years", jobs: "8,930 jobs" },
  { icon: Award, title: "Senior Level", years: "5-8 years", jobs: "6,780 jobs" },
  { icon: Crown, title: "Executive", years: "8+ years", jobs: "2,150 jobs" },
];

const ExperienceLevelsSection = () => {
  return (
    <section className="py-16 md:py-20 bg-accent/20">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-2">Jobs by Experience Level</h2>
          <p className="text-muted-foreground">Find jobs that match your experience</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {levels.map(({ icon: Icon, title, years, jobs }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer text-center"
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <p className="text-base font-semibold font-display">{title}</p>
              <p className="text-xs text-muted-foreground mb-1">{years}</p>
              <p className="text-xs text-primary font-medium">{jobs}</p>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/jobs">
            <Button variant="ghost" className="text-primary gap-2">View all jobs <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ExperienceLevelsSection;
