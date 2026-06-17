import { motion } from "framer-motion";
import { Code2, Palette, Megaphone, Users, Headphones, BarChart3, Package, UserCog } from "lucide-react";

const categories = [
  { icon: Code2, title: "Development", jobs: "12,560 jobs" },
  { icon: Palette, title: "Design", jobs: "6,230 jobs" },
  { icon: Megaphone, title: "Marketing", jobs: "4,120 jobs" },
  { icon: Users, title: "Sales", jobs: "3,245 jobs" },
  { icon: Headphones, title: "Customer Support", jobs: "2,980 jobs" },
  { icon: BarChart3, title: "Data Science", jobs: "2,450 jobs" },
  { icon: Package, title: "Product", jobs: "1,890 jobs" },
  { icon: UserCog, title: "Human Resources", jobs: "1,230 jobs" },
];

const TopCategoriesSection = () => {
  return (
    <section className="py-16 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-2">Top Categories</h2>
          <p className="text-muted-foreground">Explore jobs by your interest</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {categories.map(({ icon: Icon, title, jobs }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="p-5 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-300 cursor-pointer flex items-center gap-3"
            >
              <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold font-display">{title}</p>
                <p className="text-xs text-muted-foreground">{jobs}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCategoriesSection;
