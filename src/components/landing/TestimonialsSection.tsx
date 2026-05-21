import { Star, Quote } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Rajesh Mehta",
    role: "VP of Talent Acquisition, Infosys",
    quote: "The Industry Readiness Score changed how we evaluate candidates. We now hire verified talent, not polished résumés. Assessment integrity features give us complete confidence in every score.",
    rating: 5,
    metric: "92% reduction in bad hires",
  },
  {
    name: "Ananya Sharma",
    role: "Software Engineer, Career Switcher",
    quote: "I took the assessment, got my score, earned my Verified Badge, and applied to 80+ companies in one click. Within 2 weeks, I had 6 interview calls. This platform actually works for candidates.",
    rating: 5,
    metric: "6 interviews in 2 weeks",
  },
  {
    name: "David Park",
    role: "Head of HR, Series B Startup",
    quote: "The custom assessments with domain expert questions are game-changing. Anti-cheating proctoring means we trust every result. Our quality of hire improved 40% in the first quarter.",
    rating: 5,
    metric: "40% better quality of hire",
  },
  {
    name: "Priya Nair",
    role: "Fresher, B.Tech Computer Science",
    quote: "As a fresher, I had no way to prove my skills. The Industry Readiness Score showed employers I was 'Above Market' for entry-level roles. I got hired before my classmates with better GPAs.",
    rating: 5,
    metric: "Hired before graduation",
  },
  {
    name: "Michael Torres",
    role: "CTO, Enterprise SaaS Company",
    quote: "We replaced 3 separate tools with Talento — resume screening, skill testing, and video interviews. The AI-proctored assessments with code playback analysis eliminated cheating entirely.",
    rating: 5,
    metric: "3 tools replaced with 1",
  },
  {
    name: "Kavitha Rao",
    role: "Chief People Officer, Freshworks",
    quote: "The bias-free screening and EEOC compliance gave our board confidence. The hiring analytics dashboard gives me real-time pipeline visibility that I've never had before.",
    rating: 5,
    metric: "100% EEOC compliant hiring",
  },
];

const TestimonialsSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section ref={ref} className="py-28">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">Success Stories</p>
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Trusted by Leaders & Candidates Alike</h2>
          <p className="text-muted-foreground text-lg">Real stories from employers who hire verified talent and candidates who proved their worth.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map(({ name, role, quote, rating, metric }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="relative p-6 rounded-2xl bg-card border border-border/50 hover:shadow-xl hover:border-primary/10 transition-all duration-300 group"
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/5 group-hover:text-primary/10 transition-colors" />
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-warning text-warning" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{quote}"</p>
              <div className="px-3 py-1.5 rounded-lg bg-success/5 border border-success/10 mb-5">
                <p className="text-xs font-semibold text-success">{metric}</p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                  {name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold">{name}</p>
                  <p className="text-xs text-muted-foreground">{role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
