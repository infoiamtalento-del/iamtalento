import { motion } from "framer-motion";
import { Star, Quote, MessageSquare } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

const reviews = [
  {
    name: "Rajesh Mehta",
    role: "VP Talent Acquisition, Infosys",
    quote: "The Industry Readiness Score changed how we evaluate candidates. We now hire verified talent, not polished résumés.",
    rating: 5,
  },
  {
    name: "Ananya Sharma",
    role: "Software Engineer",
    quote: "I took the assessment, earned my Verified Badge, and got 6 interview calls in 2 weeks. This platform actually works.",
    rating: 5,
  },
  {
    name: "David Park",
    role: "Head of HR, Series B Startup",
    quote: "Custom assessments with domain expert questions are game-changing. Our quality of hire improved 40% in Q1.",
    rating: 5,
  },
  {
    name: "Priya Nair",
    role: "Fresher, B.Tech CS",
    quote: "As a fresher I had no way to prove my skills. The Readiness Score showed employers I was 'Above Market'. Got hired before classmates.",
    rating: 5,
  },
  {
    name: "Michael Torres",
    role: "CTO, Enterprise SaaS",
    quote: "We replaced 3 separate tools with Talento — resume screening, skill testing, and video interviews. All in one platform.",
    rating: 5,
  },
  {
    name: "Kavitha Rao",
    role: "CPO, Freshworks",
    quote: "Bias-free screening and EEOC compliance gave our board confidence. Real-time pipeline visibility I've never had before.",
    rating: 5,
  },
  {
    name: "Arjun Desai",
    role: "Engineering Manager, Flipkart",
    quote: "AI proctoring with code playback analysis eliminated cheating entirely. We trust every single assessment result now.",
    rating: 5,
  },
  {
    name: "Sara Khan",
    role: "Data Analyst, Career Switcher",
    quote: "The personalized growth roadmap showed me exactly what to learn. Within a month my score jumped from 62 to 89.",
    rating: 5,
  },
];

const doubledReviews = [...reviews, ...reviews];

const ReviewCard = ({ name, role, quote, rating }: (typeof reviews)[0]) => (
  <div className="w-[340px] shrink-0 p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300 group">
    <Quote className="h-6 w-6 text-primary/10 group-hover:text-primary/20 transition-colors mb-3" />
    <div className="flex gap-0.5 mb-3">
      {Array.from({ length: rating }).map((_, j) => (
        <Star key={j} className="h-3.5 w-3.5 fill-warning text-warning" />
      ))}
    </div>
    <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">"{quote}"</p>
    <div className="flex items-center gap-3 pt-3 border-t border-border/50">
      <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
        {name.split(" ").map((n) => n[0]).join("")}
      </div>
      <div>
        <p className="text-sm font-semibold">{name}</p>
        <p className="text-xs text-muted-foreground">{role}</p>
      </div>
    </div>
  </div>
);

const ReviewsMarquee = () => (
  <section className="py-14 md:py-20 overflow-hidden">
    <div className="container mb-12">
      <div className="text-center max-w-2xl mx-auto">
        <SectionBadge label="What People Say" icon={MessageSquare} />
        <h2 className="text-3xl md:text-4xl font-bold font-display mb-4 leading-[1.15]">
          Trusted by Employers<br /><span className="text-primary">& Candidates</span>
        </h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
          Real stories from professionals who proved their worth with verified skills —
          <br className="hidden md:block" />
          and employers who finally found talent they can trust.
        </p>
      </div>
    </div>

    {/* Row 1 — scrolls left */}
    <div className="relative mb-6">
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-10" />
      <motion.div
        className="flex gap-6 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        {doubledReviews.map((r, i) => (
          <ReviewCard key={`row1-${i}`} {...r} />
        ))}
      </motion.div>
    </div>

    {/* Row 2 — scrolls right */}
    <div className="relative">
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-10" />
      <motion.div
        className="flex gap-6 w-max"
        animate={{ x: ["-50%", "0%"] }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
      >
        {[...doubledReviews].reverse().map((r, i) => (
          <ReviewCard key={`row2-${i}`} {...r} />
        ))}
      </motion.div>
    </div>
  </section>
);

export default ReviewsMarquee;
