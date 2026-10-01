import { motion } from "framer-motion";
import { Star, Users, ArrowRight, TrendingUp, Clock, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import SectionBadge from "@/components/ui/section-badge";
import { useState } from "react";
import { cn } from "@/lib/utils";

import courseAiMl from "@/assets/course-ai-ml.jpg";
import courseData from "@/assets/course-data-analytics.jpg";
import courseMarketing from "@/assets/course-digital-marketing.jpg";
import coursePython from "@/assets/course-python.jpg";

const categories = ["All", "AI & ML", "Data Science", "Marketing", "Development", "Design", "Finance"];

const courses = [
  { title: "AI for Non-Tech Professionals", category: "AI & ML", level: "Beginner", rating: 4.8, learners: "12,400", instructor: "Dr. Neha Sharma", image: courseAiMl, languages: ["EN", "HI"], duration: "8 hrs", price: "Free", originalPrice: "₹3,999", bestseller: true },
  { title: "Data Analytics Masterclass", category: "Data Science", level: "Intermediate", rating: 4.7, learners: "9,800", instructor: "Arjun Patel", image: courseData, languages: ["EN", "TA"], duration: "12 hrs", price: "₹799", originalPrice: "₹4,999", bestseller: false },
  { title: "Digital Marketing with AI Tools", category: "Marketing", level: "Beginner", rating: 4.9, learners: "15,200", instructor: "Kavitha Rajan", image: courseMarketing, languages: ["EN", "HI", "TE"], duration: "6 hrs", price: "₹499", originalPrice: "₹2,999", bestseller: true },
  { title: "Python for Job-Ready Developers", category: "Development", level: "Intermediate", rating: 4.6, learners: "7,300", instructor: "Vikram Desai", image: coursePython, languages: ["EN"], duration: "15 hrs", price: "₹999", originalPrice: "₹5,999", bestseller: false },
];

const TrendingCoursesSection = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const filtered = activeCategory === "All" ? courses : courses.filter((c) => c.category === activeCategory);

  return (
    <section className="py-16 md:py-20" id="courses">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-8">
          <SectionBadge label="Trending Now" icon={TrendingUp} />
          <h2 className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3">
            Explore Popular Courses<br />
            <span className="text-primary">Trending Now</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            <span className="block">Find practical courses for relevant skills.</span>
            <span className="block">Start with what is trending.</span>
          </p>
        </div>

        {/* Category tabs like Udemy */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-semibold transition-all border",
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:border-primary/40"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border bg-card overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Thumbnail */}
              <div className="relative h-36 overflow-hidden">
                <img src={c.image} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {c.bestseller && (
                  <span className="absolute top-2 left-2 text-[9px] font-bold bg-[hsl(33,100%,50%)] text-white px-2 py-0.5 rounded-sm uppercase tracking-wide">Bestseller</span>
                )}
                <div className="absolute top-2 right-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded flex items-center gap-1">
                  <Clock className="h-2.5 w-2.5" /> {c.duration}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-2.5">
                <h3 className="font-bold font-display text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">{c.title}</h3>
                <p className="text-[11px] text-muted-foreground">{c.instructor}</p>

                {/* Rating row */}
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-[hsl(33,100%,50%)]">{c.rating}</span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className={cn("h-3 w-3", j < Math.floor(c.rating) ? "fill-[hsl(33,100%,50%)] text-[hsl(33,100%,50%)]" : "text-muted")} />
                    ))}
                  </div>
                  <span className="text-[10px] text-muted-foreground">({c.learners})</span>
                </div>

                {/* Level + Language */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">{c.level}</span>
                  {c.languages.map((l) => (
                    <span key={l} className="text-[10px] font-medium text-primary/80 bg-primary/5 px-1.5 py-0.5 rounded">{l}</span>
                  ))}
                </div>

                {/* Price row */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-base font-bold font-display">{c.price}</span>
                  {c.price !== c.originalPrice && (
                    <span className="text-xs text-muted-foreground line-through">{c.originalPrice}</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/learning#courses">
            <Button variant="outline" className="gap-2">Browse All Courses <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrendingCoursesSection;
