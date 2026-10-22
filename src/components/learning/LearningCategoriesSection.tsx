import { motion } from "framer-motion";
import {
  PenTool,
  Briefcase,
  Code2,
  Landmark,
  Cpu,
  BarChart3,
  Megaphone,
  ShieldCheck,
  LayoutGrid,
  ArrowRight,
  Layers,
  Users,
  TrendingUp,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import SectionBadge from "@/components/ui/section-badge";
import { Button } from "@/components/ui/button";

interface IndustryCategory {
  title: string;
  courses: string;
  icon: LucideIcon;
}

const CATEGORIES: IndustryCategory[] = [
  {
    title: "UI/UX & Product Design",
    courses: "12 Courses",
    icon: PenTool,
  },
  {
    title: "Business & Strategy",
    courses: "18 Courses",
    icon: Briefcase,
  },
  {
    title: "Software Development",
    courses: "24 Courses",
    icon: Code2,
  },
  {
    title: "Finance & FinTech",
    courses: "14 Courses",
    icon: Landmark,
  },
  {
    title: "AI & Machine Learning",
    courses: "16 Courses",
    icon: Cpu,
  },
  {
    title: "Data Science & Analytics",
    courses: "20 Courses",
    icon: BarChart3,
  },
  {
    title: "Digital Marketing",
    courses: "15 Courses",
    icon: Megaphone,
  },
  {
    title: "Cloud & Cybersecurity",
    courses: "11 Courses",
    icon: ShieldCheck,
  },
  {
    title: "Product Management",
    courses: "14 Courses",
    icon: Layers,
  },
  {
    title: "HR & People Operations",
    courses: "9 Courses",
    icon: Users,
  },
  {
    title: "Sales & Revenue Growth",
    courses: "13 Courses",
    icon: TrendingUp,
  },
  {
    title: "Operations & Supply Chain",
    courses: "10 Courses",
    icon: Settings,
  },
];

const LearningCategoriesSection = () => (
  <section className="py-16 md:py-24 bg-[#FBF4EB]">
    <div className="container px-4 md:px-6">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
        <SectionBadge label="Industry Categories" icon={LayoutGrid} />
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3 text-slate-950"
        >
          Explore Courses by{" "}
          <span className="text-primary">Industry Category</span>
        </motion.h2>
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
          Choose from high-demand industry tracks designed and taught by verified domain practitioners.
        </p>
      </div>

      {/* 12 Compact Corporate Category Cards (3 Rows of 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 max-w-6xl mx-auto">
        {CATEGORIES.map((category, index) => {
          const Icon = category.icon;
          return (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.03 }}
            >
              <Link
                to="/learning#courses"
                className="group flex items-center gap-3.5 rounded-xl bg-white border border-slate-200/90 px-4 py-4 h-[78px] shadow-2xs hover:shadow-sm hover:border-[#002C66]/45 transition-all duration-200"
              >
                <div className="h-11 w-11 rounded-lg bg-[#002C66]/[0.07] border border-[#002C66]/15 text-[#002C66] group-hover:bg-[#002C66] group-hover:text-white flex items-center justify-center shrink-0 transition-colors duration-200">
                  <Icon className="h-5 w-5" strokeWidth={1.7} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold font-display text-slate-950 group-hover:text-[#002C66] leading-snug truncate transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {category.courses}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* View All Button */}
      <div className="mt-9 text-center">
        <Button asChild size="lg" className="rounded-xl px-7 gap-2 font-semibold">
          <Link to="/learning#courses">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  </section>
);

export default LearningCategoriesSection;
