import { motion } from "framer-motion";
import { Star, ArrowRight, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SectionBadge from "@/components/ui/section-badge";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { learningCourses } from "@/data/learningCourses";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import { fetchCourses, fetchMyEnrollments, type Course, type Enrollment } from "@/services/candidate/platform";

const categories = ["All", "AI & ML", "Data Science", "Marketing", "Development", "Design", "Finance"];

const TrendingCoursesSection = () => {
  const { user } = useSupabaseUser();
  const [activeCategory, setActiveCategory] = useState("All");
  const [enrolledSlugs, setEnrolledSlugs] = useState<Record<string, string>>({});
  const filtered =
    activeCategory === "All"
      ? learningCourses
      : learningCourses.filter((c) => c.category === activeCategory);

  useEffect(() => {
    if (!user) {
      setEnrolledSlugs({});
      return;
    }
    void Promise.all([
      fetchCourses().catch((): Course[] => []),
      fetchMyEnrollments().catch((): Enrollment[] => []),
    ]).then(([liveCourses, enrs]) => {
      const byId = new Map<string, string>(liveCourses.map((c) => [c.id, c.slug]));
      const next: Record<string, string> = {};
      for (const e of enrs) {
        const s = byId.get(e.course_id);
        if (s) next[s] = e.status;
      }
      setEnrolledSlugs(next);
    });
  }, [user]);

  return (
    <section className="py-16 md:py-20" id="courses">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-8">
          <SectionBadge label="Trending Now" icon={TrendingUp} />
          <h2 className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3">
            Explore Top Courses
            <br />
            <span className="text-primary">Trending Now</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            <span className="block">Find practical courses for relevant skills.</span>
            <span className="block">Start with what is trending.</span>
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant="outline"
              aria-pressed={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-semibold transition-all border",
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:border-primary/40",
              )}
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((c, i) => {
            const enrollmentStatus =
              enrolledSlugs[c.id] ??
              (c.id === "digital-marketing-with-ai-tools" ? enrolledSlugs["digital-marketing-with-ai"] : undefined);

            return (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl border bg-card overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <Link
                  to={c.slug}
                  className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-[5/4] overflow-hidden bg-muted">
                    <img
                      src={c.image}
                      alt={c.title}
                      className="w-full h-full object-cover object-[center_12%] group-hover:scale-105 transition-transform duration-500"
                    />
                    {enrollmentStatus ? (
                      <span className="absolute top-2 left-2 text-[9px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-sm uppercase tracking-wide inline-flex items-center gap-1">
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        {enrollmentStatus === "completed" ? "Completed" : "Enrolled"}
                      </span>
                    ) : c.bestseller ? (
                      <span className="absolute top-2 left-2 text-[9px] font-bold bg-warning text-warning-foreground px-2 py-0.5 rounded-sm uppercase tracking-wide">
                        Bestseller
                      </span>
                    ) : null}
                    <div className="absolute top-2 right-2 text-[10px] bg-foreground/70 text-background px-2 py-0.5 rounded flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" /> {c.duration}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-2.5">
                    <h3 className="font-bold font-display text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                      {c.title}
                    </h3>
                    <p className="text-[11px] text-muted-foreground">{c.instructor}</p>

                    {/* Rating row */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-warning">{c.rating}</span>
                      <div className="flex items-center gap-0.5" aria-hidden="true">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star
                            key={j}
                            className={cn(
                              "h-3 w-3",
                              j < Math.floor(c.rating) ? "fill-warning text-warning" : "text-muted",
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-muted-foreground">({c.learners})</span>
                    </div>

                    {/* Level + Language */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        {c.level}
                      </span>
                      {c.languages.map((l) => (
                        <span
                          key={l}
                          className="text-[10px] font-medium text-primary/80 bg-primary/5 px-1.5 py-0.5 rounded"
                        >
                          {l}
                        </span>
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
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Link to="/learning#courses">
            <Button variant="outline" className="gap-2">
              Browse All Courses <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrendingCoursesSection;
