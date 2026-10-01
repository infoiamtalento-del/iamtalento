import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";
import { cn } from "@/lib/utils";

const languages = [
  { name: "English", greeting: "Hello", courses: 40 },
  { name: "Hindi", greeting: "नमस्ते", courses: 35 },
  { name: "Tamil", greeting: "வணக்கம்", courses: 28 },
  { name: "Telugu", greeting: "నమస్కారం", courses: 25 },
  { name: "Kannada", greeting: "ನಮಸ್ಕಾರ", courses: 22 },
  { name: "Bengali", greeting: "নমস্কার", courses: 20 },
  { name: "Marathi", greeting: "नमस्कार", courses: 18 },
  { name: "Gujarati", greeting: "નમસ્તે", courses: 15 },
  { name: "Malayalam", greeting: "നമസ്കാരം", courses: 16 },
  { name: "Punjabi", greeting: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ", courses: 12 },
  { name: "Odia", greeting: "ନମସ୍କାର", courses: 10 },
  { name: "Urdu", greeting: "آداب", courses: 14 },
];

const LearnInLanguageSection = () => {
  const [active, setActive] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % languages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleSelect = (index: number) => {
    setActive(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 6 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 6000);
  };

  const current = languages[active];

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10">
          <SectionBadge label="Multilingual" icon={Globe} />

          {/* Apple-style animated greeting */}
          <div className="h-24 md:h-32 flex items-center justify-center mb-4 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={current.greeting}
                initial={{ opacity: 0, scale: 0.6, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl md:text-7xl font-bold font-display text-primary select-none"
              >
                {current.greeting}
              </motion.span>
            </AnimatePresence>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3">
            Learn New Skills Comfortably<br />
            <span className="text-primary">In Your Language</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Learn through clear explanations in five or more languages designed for stronger understanding —<br className="hidden md:block" />nothing gets lost in translation.
          </p>
        </div>

        {/* Language pills */}
        <div className="flex flex-wrap justify-center gap-3">
          {languages.map((lang, i) => (
            <motion.button
              key={lang.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(i)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-semibold transition-all border relative",
                active === i
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                  : "bg-card text-foreground border-border hover:border-primary/40"
              )}
            >
              {lang.name}
              {/* Progress indicator on active pill */}
              {active === i && isAutoPlaying && (
                <motion.span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-primary-foreground/60 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "60%" }}
                  transition={{ duration: 2, ease: "linear" }}
                />
              )}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={current.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="text-center text-sm text-muted-foreground mt-6"
          >
            Showing courses available in{" "}
            <span className="font-semibold text-primary">{current.name}</span>{" "}
            — {current.courses}+ courses available
          </motion.p>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default LearnInLanguageSection;
