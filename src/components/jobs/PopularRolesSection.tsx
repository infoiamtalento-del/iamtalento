import { motion } from "framer-motion";
import { ChevronRight, Briefcase, ArrowRight } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const roles = [
  { title: "Full Stack Developer", count: "23.3K+" },
  { title: "Mobile / App Developer", count: "3K+" },
  { title: "Front End Developer", count: "5.5K+" },
  { title: "DevOps Engineer", count: "3K+" },
  { title: "Engineering Manager", count: "1.6K+" },
  { title: "Technical Lead", count: "11.1K+" },
  { title: "Data Scientist", count: "8.2K+" },
  { title: "Product Manager", count: "6.1K+" },
  { title: "UI/UX Designer", count: "4.7K+" },
  { title: "Cloud Architect", count: "2.8K+" },
  { title: "QA Engineer", count: "3.4K+" },
  { title: "Backend Developer", count: "9.5K+" },
];

const PopularRolesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-accent/20">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <SectionBadge label="Popular Roles" icon={Briefcase} />
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-3">
            Discover Jobs Across<br />
            <span className="text-primary">Popular Roles</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Select a role and we'll show you relevant jobs for it!
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-card rounded-2xl border border-border/50 shadow-lg p-6 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {roles.map((role, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background hover:border-primary/30 hover:shadow-md transition-all duration-200 group text-left"
                >
                  <div>
                    <p className="text-sm font-semibold font-display group-hover:text-primary transition-colors line-clamp-1">
                      {role.title}
                    </p>
                    <p className="text-xs text-primary font-medium mt-0.5">
                      {role.count} Jobs
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
                </motion.button>
              ))}
            </div>
          </div>

          <div className="text-center mt-8">
            <Link to="/assessments">
              <Button variant="outline" className="border-border gap-2">
                Browse All Roles <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PopularRolesSection;
