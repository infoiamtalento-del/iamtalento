import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XCircle, CheckCircle2, AlertTriangle, ChevronDown } from "lucide-react";

const problems = [
  {
    title: "You send 100 resumes. You hear back from 3.",
    detail: "ATS filters reject 97% of applications before a human ever sees them. Your skills don't matter if no one reads your resume.",
  },
  {
    title: "Employers see the same buzzwords on every profile.",
    detail: "When everyone claims to be a 'self-starter' with 'excellent communication skills,' nobody stands out.",
  },
  {
    title: "Your degree doesn't tell them what you can actually do.",
    detail: "A diploma proves attendance, not ability. Employers need proof of real, job-ready skills.",
  },
  {
    title: "You have no way to prove your skill level objectively.",
    detail: "Without a standardized, trusted benchmark, your claims are just words on a page.",
  },
  {
    title: "You're compared to better-looking CVs, not better skills.",
    detail: "Hiring decisions are made on formatting and keywords instead of actual competence.",
  },
];

const solutions = [
  {
    title: "One assessment. One verified score. Zero guesswork.",
    detail: "Take a single proctored assessment and let your verified score speak louder than any resume.",
  },
  {
    title: "Employers see your exact skill level before they call you.",
    detail: "No more generic screening calls. They already know what you can do — the conversation starts at offer.",
  },
  {
    title: "Your profile rises above unverified candidates automatically.",
    detail: "Verified badges push you to the top of employer search results, like a blue checkmark for your career.",
  },
  {
    title: "You know exactly where you stand — and how to improve.",
    detail: "Get a detailed breakdown of strengths, gaps, and personalized learning paths to level up.",
  },
  {
    title: "Verified talent gets found. Unverified talent gets scrolled past.",
    detail: "Recruiters filter for verified first. 67% interview callback rate for verified candidates.",
  },
];

const AccordionItem = ({
  item,
  index,
  openIndex,
  setOpenIndex,
  variant,
}: {
  item: { title: string; detail: string };
  index: number;
  openIndex: number | null;
  setOpenIndex: (i: number | null) => void;
  variant: "problem" | "solution";
}) => {
  const isOpen = openIndex === index;
  const isProblem = variant === "problem";

  return (
    <div
      className="rounded-xl overflow-hidden transition-colors duration-200"
      style={{
        background: isProblem ? (isOpen ? "#fef2f2" : "#fff") : (isOpen ? "hsl(355 84% 54% / 0.95)" : "hsl(355 84% 54%)"),
        border: isProblem ? "1px solid #e2e8f0" : "none",
      }}
    >
      <button
        onClick={() => setOpenIndex(isOpen ? null : index)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
      >
        {isProblem ? (
          <XCircle className="h-4 w-4 shrink-0 text-red-400" />
        ) : (
          <CheckCircle2 className="h-4 w-4 shrink-0 text-white/80" />
        )}
        <span
          className="text-[13px] font-medium flex-1"
          style={{ color: isProblem ? "#0f172a" : "#fff" }}
        >
          {item.title}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          style={{ color: isProblem ? "#94a3b8" : "rgba(255,255,255,0.6)" }}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p
              className="px-4 pb-3.5 text-[12px] leading-relaxed pl-11"
              style={{ color: isProblem ? "#475569" : "rgba(255,255,255,0.85)" }}
            >
              {item.detail}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProblemSolutionAccordion = () => {
  const [problemOpen, setProblemOpen] = useState<number | null>(0);
  const [solutionOpen, setSolutionOpen] = useState<number | null>(0);

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-[1100px] mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1 mb-4 rounded-full"
            style={{ color: "#E22C2C", background: "hsl(355 84% 54% / 0.08)" }}
          >
            <AlertTriangle className="h-3.5 w-3.5" /> The Problem
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-display">
            Every Candidate Claims to Be "Skilled."
            <br />
            <span className="text-primary">Employers Don't Know Who to Trust.</span>
          </h2>
        </motion.div>

        {/* Two columns */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Old Way */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl p-5 md:p-6"
            style={{ border: "1px solid #e2e8f0" }}
          >
            <div className="flex items-center gap-2 mb-5">
              <XCircle className="h-5 w-5 text-red-400" />
              <h3 className="text-lg font-bold text-red-500 font-display">The Old Way</h3>
            </div>
            <div className="space-y-2.5">
              {problems.map((p, i) => (
                <AccordionItem
                  key={i}
                  item={p}
                  index={i}
                  openIndex={problemOpen}
                  setOpenIndex={setProblemOpen}
                  variant="problem"
                />
              ))}
            </div>
          </motion.div>

          {/* Talento Way */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl p-5 md:p-6"
            style={{ background: "linear-gradient(135deg, hsl(355 84% 54%) 0%, hsl(355 84% 44%) 100%)" }}
          >
            <div className="flex items-center gap-2 mb-5">
              <CheckCircle2 className="h-5 w-5 text-white/80" />
              <h3 className="text-lg font-bold text-white font-display">The I Am Talento Way</h3>
            </div>
            <div className="space-y-2.5">
              {solutions.map((s, i) => (
                <AccordionItem
                  key={i}
                  item={s}
                  index={i}
                  openIndex={solutionOpen}
                  setOpenIndex={setSolutionOpen}
                  variant="solution"
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionAccordion;
