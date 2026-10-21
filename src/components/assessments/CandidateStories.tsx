import { motion } from "framer-motion";
import { Star, TrendingUp } from "lucide-react";
import learnerPriya from "@/assets/learner-priya.jpg";
import learnerVikram from "@/assets/learner-vikram.jpg";
import learnerAnanya from "@/assets/learner-ananya.jpg";
import learnerRahul from "@/assets/learner-rahul.jpg";

const stories = [
  {
    name: "Priya M.",
    role: "Digital Marketing Manager",
    city: "Bangalore",
    score: 84,
    badge: "Above Market",
    photo: learnerPriya,
    quote: "I had 4 years of experience but couldn't explain my value clearly. After my assessment, I had a benchmark to point to. Got 3 interview calls in 2 weeks, all inbound.",
    result: "3 interviews in 2 weeks",
  },
  {
    name: "Vikram S.",
    role: "Software Engineer",
    city: "Pune",
    score: 79,
    badge: "Market Ready",
    photo: learnerVikram,
    quote: "The report showed me exactly two skills I was weak in. I spent 3 weeks on them, retook the test, hit Above Market. Got an offer ₹4 LPA higher.",
    result: "₹4 LPA salary increase",
  },
  {
    name: "Ananya R.",
    role: "Fresh Graduate",
    city: "Delhi",
    score: 71,
    badge: "Market Ready",
    photo: learnerAnanya,
    quote: "As a fresher with no work experience, I had nothing to show employers. The Verified Badge changed that. It told them I was ready even without a job history.",
    result: "Hired as a fresher",
  },
];

const CandidateStories = () => (
  <section style={{ background: "#F8FAFC" }} className="py-16 md:py-20">
    <div className="max-w-[1160px] mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <span
          className="inline-block text-[11px] font-bold uppercase tracking-widest text-primary px-3 py-1 mb-3"
          style={{ background: "hsl(355 84% 54% / 0.08)", borderRadius: 100 }}
        >
          SUCCESS STORIES
        </span>
        <h2 className="text-3xl md:text-4xl font-bold font-display leading-[1.15] text-foreground">
          What Happened After<br />
          <span className="text-primary">They Got Verified</span>
        </h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mt-4">
          Real candidates, real scores, real offers, see how a verified assessment<br className="hidden md:block" />
          turned effort into interview calls and salary jumps.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-5">
        {stories.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="bg-white p-5 relative"
            style={{ borderRadius: 12, border: "1px solid #E2E8F0" }}
          >
            {/* Verified badge */}
            <span
              className="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5"
              style={{ background: "#ECFDF5", color: "#059669", borderRadius: 100 }}
            >
              Verified
            </span>

            {/* Stars */}
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} className="h-3.5 w-3.5 text-primary fill-primary" />
              ))}
              <span className="text-xs font-bold text-primary ml-1.5">{s.score}%</span>
            </div>

            {/* Quote */}
            <p className="text-[13px] italic leading-[1.7] mb-5" style={{ color: "#475569" }}>
              "{s.quote}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 pt-4" style={{ borderTop: "1px solid #F1F5F9" }}>
              <img src={s.photo} alt={s.name} className="h-10 w-10 object-cover" style={{ borderRadius: 8 }} />
              <div>
                <p className="text-[13px] font-bold" style={{ color: "#0F172A" }}>{s.name}</p>
                <p className="text-[12px]" style={{ color: "#94A3B8" }}>{s.role} · {s.city}</p>
              </div>
              <span
                className="ml-auto text-[11px] font-bold text-primary flex items-center gap-1 px-2 py-1"
                style={{ background: "hsl(355 84% 54% / 0.08)", borderRadius: 100 }}
              >
                <TrendingUp className="h-3 w-3" /> {s.result}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default CandidateStories;
