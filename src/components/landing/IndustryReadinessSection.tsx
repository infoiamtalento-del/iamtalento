import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2, Circle, Clock, ChevronRight } from "lucide-react";
import { ArrowRight, Download } from "lucide-react";
import { Link } from "react-router-dom";
import SectionBadge from "@/components/ui/section-badge";

// ─── Data ──────────────────────────────────────────────────────────────────
const employers = ["Accenture", "Infosys", "Google", "Deloitte", "Adobe"];

// ─── MCQ Assessment Card ────────────────────────────────────────────────────
const mcqQuestions = [
  {
    q: "Which data structure gives O(1) average-case lookup?",
    options: ["Binary Search Tree", "Hash Map", "Linked List", "Stack"],
    correct: 1,
    topic: "Data Structures",
    difficulty: "Medium",
  },
  {
    q: "Which SQL clause filters grouped rows?",
    options: ["WHERE", "FILTER", "HAVING", "GROUP BY"],
    correct: 2,
    topic: "Databases",
    difficulty: "Medium",
  },
  {
    q: "What does REST stand for in web architecture?",
    options: ["Remote Execution Service Transfer", "Representational State Transfer", "Resource Endpoint Template", "Response State Technology"],
    correct: 1,
    topic: "System Design",
    difficulty: "Easy",
  },
];

function AssessmentCard() {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);

  const q = mcqQuestions[qIndex];

  useEffect(() => {
    if (answered) return;
    setTimeLeft(45);
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timer); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [qIndex, answered]);

  const handleSelect = (i: number) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    if (i === q.correct) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (qIndex < mcqQuestions.length - 1) {
      setQIndex(qi => qi + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const timerPct = (timeLeft / 45) * 100;

  return (
    <div
      className="rounded-3xl overflow-hidden relative"
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(40px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.95)",
        boxShadow: "0 24px 80px rgba(198,44,44,0.10), 0 4px 20px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header bar */}
      <div
        className="px-5 py-3.5 flex items-center justify-between"
        style={{ background: "#C62C2C" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white/50" />
          <span className="text-[11px] font-semibold text-white/90">AI Assessment · Backend Engineering</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white/15 px-2.5 py-1 rounded-full">
          <Clock className="h-3 w-3 text-white/80" />
          <span className="text-[11px] font-bold text-white">{timeLeft}s</span>
        </div>
      </div>

      {/* Timer bar */}
      <div className="h-1" style={{ background: "rgba(198,44,44,0.08)" }}>
        <motion.div
          className="h-full"
          style={{ background: timerPct > 50 ? "#C62C2C" : timerPct > 20 ? "#f59e0b" : "#ef4444" }}
          animate={{ width: `${timerPct}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="p-5">
        {/* Progress pills */}
        <div className="flex items-center gap-1.5 mb-4">
          {mcqQuestions.map((_, i) => (
            <div
              key={i}
              className="h-1.5 flex-1 rounded-full transition-all duration-300"
              style={{
                background: i < qIndex ? "#C62C2C" : i === qIndex ? "#e8a0a0" : "rgba(198,44,44,0.1)",
              }}
            />
          ))}
          <span className="text-[10px] font-semibold ml-1" style={{ color: "#C62C2C" }}>
            {qIndex + 1}/{mcqQuestions.length}
          </span>
        </div>

        {/* Topic + difficulty */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ background: "rgba(198,44,44,0.08)", color: "#C62C2C", border: "1px solid rgba(198,44,44,0.15)" }}
          >
            {q.topic}
          </span>
          <span
            className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ background: "rgba(245,158,11,0.08)", color: "#d97706", border: "1px solid rgba(245,158,11,0.2)" }}
          >
            {q.difficulty}
          </span>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.p
            key={qIndex}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
            className="text-[13px] font-semibold leading-snug mb-4"
            style={{ color: "#0f0f1a" }}
          >
            {q.q}
          </motion.p>
        </AnimatePresence>

        {/* Options */}
        <div className="space-y-2">
          {q.options.map((opt, i) => {
            const isCorrect = i === q.correct;
            const isSelected = selected === i;
            let bg = "rgba(255,255,255,0.85)";
            let border = "#f0dada";
            let textColor = "#374151";
            if (answered) {
              if (isCorrect) { bg = "rgba(5,150,105,0.07)"; border = "#059669"; textColor = "#065f46"; }
              else if (isSelected && !isCorrect) { bg = "rgba(239,68,68,0.07)"; border = "#ef4444"; textColor = "#991b1b"; }
            } else if (isSelected) {
              bg = "rgba(198,44,44,0.08)"; border = "#C62C2C";
            }
            return (
              <motion.button
                key={i}
                onClick={() => handleSelect(i)}
                whileHover={!answered ? { scale: 1.01 } : {}}
                whileTap={!answered ? { scale: 0.99 } : {}}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all duration-200"
                style={{ background: bg, border: `1.5px solid ${border}` }}
              >
                <div className="shrink-0">
                  {answered && isCorrect ? (
                    <CheckCircle2 size={14} color="#059669" />
                  ) : answered && isSelected && !isCorrect ? (
                    <Circle size={14} color="#ef4444" />
                  ) : (
                    <div
                      className="w-3.5 h-3.5 rounded-full border-[1.5px]"
                      style={{ borderColor: isSelected ? "#C62C2C" : "#e8a0a0", background: isSelected ? "#C62C2C" : "transparent" }}
                    />
                  )}
                </div>
                <span className="text-[12px] font-medium" style={{ color: textColor }}>{opt}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px]" style={{ color: "#9ca3af" }}>Score:</span>
            <span className="text-[11px] font-bold" style={{ color: "#C62C2C" }}>{score}/{mcqQuestions.length}</span>
          </div>
          {answered && qIndex < mcqQuestions.length - 1 && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={handleNext}
              className="flex items-center gap-1 text-[11px] font-semibold px-3 py-1.5 rounded-lg"
              style={{ background: "#C62C2C", color: "#ffffff" }}
            >
              Next <ChevronRight size={12} />
            </motion.button>
          )}
          {answered && qIndex === mcqQuestions.length - 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[11px] font-bold px-3 py-1.5 rounded-lg"
              style={{ background: "rgba(5,150,105,0.1)", color: "#059669" }}
            >
              ✓ Section Complete!
            </motion.div>
          )}
        </div>
      </div>

    </div>
  );
}

// ─── Arjun Reddy Profile Card ─────────────────────────────────────────────────
function ArjunProfileCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 1.0, type: "spring", stiffness: 180, damping: 22 }}
      className="w-full mt-5 rounded-2xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(198,44,44,0.12)",
        boxShadow: "0 12px 40px rgba(198,44,44,0.08), 0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <div className="p-5 flex items-center gap-5">
        {/* Avatar */}
        <div className="relative shrink-0">
          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop&crop=faces&auto=format"
            alt="Arjun Reddy"
            className="w-20 h-20 rounded-2xl object-cover"
            style={{ border: "2.5px solid #C62C2C", boxShadow: "0 6px 20px rgba(198,44,44,0.2)" }}
          />
          {/* Online dot */}
          <div
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: "#059669", border: "2px solid white" }}
          >
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <p className="text-base font-bold" style={{ color: "#0f0f1a" }}>Arjun Reddy</p>
            <span
              className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full"
              style={{ background: "rgba(5,150,105,0.1)", color: "#059669", border: "1px solid rgba(5,150,105,0.25)" }}
            >
              ✓ Verified
            </span>
          </div>
          <p className="text-xs" style={{ color: "#6b7280" }}>Sr. Backend Engineer · 6 yrs exp</p>

          {/* Score bar */}
          <div className="flex items-center gap-2.5 mt-3">
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(198,44,44,0.1)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: "#C62C2C" }}
                initial={{ width: 0 }}
                whileInView={{ width: "82%" }}
                viewport={{ once: true }}
                transition={{ delay: 1.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <span className="text-sm font-bold shrink-0" style={{ color: "#C62C2C" }}>82/100</span>
          </div>
        </div>
      </div>

      {/* Footer stats row */}
      <div
        className="grid grid-cols-3 divide-x divide-red-50"
        style={{ borderTop: "1px solid rgba(198,44,44,0.08)" }}
      >
        {[
          { label: "Rank", value: "Top 12%" },
          { label: "Assessments", value: "8 done" },
          { label: "Interviews", value: "6 calls" },
        ].map(({ label, value }) => (
          <div key={label} className="px-4 py-3 text-center">
            <p className="text-xs font-bold" style={{ color: "#0f0f1a" }}>{value}</p>
            <p className="text-[10px]" style={{ color: "#9ca3af" }}>{label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Animated Score Orb ─────────────────────────────────────────────────────
function ScoreOrb() {
  const [done, setDone] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(198,44,44,0.10) 0%, transparent 70%)", transform: "scale(1.35)" }}
        />
        <div
          className="relative w-64 h-64 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(32px) saturate(200%)",
            border: "1px solid rgba(255,255,255,1)",
            boxShadow: "0 30px 80px rgba(198,44,44,0.12), 0 4px 20px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)",
          }}
        >
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C62C2C" />
                <stop offset="100%" stopColor="#FF8C01" />
              </linearGradient>
              <filter id="arcGlow">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <motion.circle
              cx="50" cy="50" r="42" fill="none" stroke="#e8a0a0"
              strokeWidth="0.8" strokeOpacity="0.4" strokeDasharray="4 3"
              animate={{ rotate: -360 }}
              style={{ transformOrigin: "50px 50px" }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            />
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(198,44,44,0.1)" strokeWidth="3.5" />
            <motion.circle
              cx="50" cy="50" r="45" fill="none" stroke="url(#arcGrad)"
              strokeWidth="3.8" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45 * 0.82} ${2 * Math.PI * 45}`}
              initial={{ strokeDasharray: `0 ${2 * Math.PI * 45}` }}
              whileInView={{ strokeDasharray: `${2 * Math.PI * 45 * 0.82} ${2 * Math.PI * 45}` }}
              transition={{ duration: 2.5, ease: "easeOut", delay: 0.4 }}
              viewport={{ once: true }}
              filter="url(#arcGlow)"
              onAnimationComplete={() => setDone(true)}
            />
          </svg>
          <div className="relative text-center z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9, type: "spring", stiffness: 220 }}
              className="flex items-end justify-center leading-none"
            >
              <span className="text-[80px] font-bold tracking-tight leading-none" style={{ color: "#0f0f1a", fontFamily: "'Space Grotesk',sans-serif" }}>82</span>
              <span className="text-2xl font-light mb-3 ml-1" style={{ color: "#9ca3af" }}>/100</span>
            </motion.div>
            <p className="text-[10px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#C62C2C" }}>Industry Ready</p>
          </div>
          <AnimatePresence>
            {done && (
              <motion.div
                className="absolute inset-0 rounded-full"
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.25, opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                style={{ border: "2px solid rgba(198,44,44,0.3)" }}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Arjun Reddy profile card — right below the orb */}
      <ArjunProfileCard />

      {/* Score breakdown pills */}
      <div className="mt-6 grid grid-cols-2 gap-2 w-full max-w-xs">
        {[
          { label: "Technical", score: 88, color: "#C62C2C" },
          { label: "Domain", score: 76, color: "#FF8C01" },
          { label: "Problem Solving", score: 92, color: "#C62C2C" },
          { label: "Communication", score: 71, color: "#FF8C01" },
        ].map(({ label, score, color }) => (
          <div
            key={label}
            className="px-3 py-2 rounded-xl"
            style={{ background: "rgba(255,255,255,0.85)", border: "1px solid #f0dada" }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-medium" style={{ color: "#6b7280" }}>{label}</span>
              <span className="text-[10px] font-bold" style={{ color }}>{score}</span>
            </div>
            <div className="h-1 rounded-full" style={{ background: "rgba(198,44,44,0.1)" }}>
              <div className="h-full rounded-full" style={{ width: `${score}%`, background: color }} />
            </div>
          </div>
        ))}
      </div>

      <motion.div
        className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold"
        style={{ background: "#ffffff", border: "1px solid rgba(5,150,105,0.2)", color: "#047857", boxShadow: "0 4px 16px rgba(5,150,105,0.12)" }}
        animate={{ boxShadow: ["0 4px 16px rgba(5,150,105,0.08)", "0 4px 20px rgba(5,150,105,0.2)", "0 4px 16px rgba(5,150,105,0.08)"] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
      >
        <motion.span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} />
        ↑ Above Market
      </motion.div>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
const IndustryReadinessSection = () => {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10" style={{ background: "#ffffff" }}>
        <div className="absolute top-[-5%] left-[5%] w-[500px] h-[500px] rounded-full"
          style={{ background: "#f5d5d5", opacity: 0.2, filter: "blur(100px)", animation: "iqOrbA 16s ease-in-out infinite" }} />
        <div className="absolute bottom-[-8%] right-[8%] w-[440px] h-[440px] rounded-full"
          style={{ background: "#fde8cc", opacity: 0.2, filter: "blur(100px)", animation: "iqOrbB 20s ease-in-out infinite" }} />
        <div className="absolute top-[30%] left-[52%] w-[360px] h-[360px] rounded-full"
          style={{ background: "#e0f0ff", opacity: 0.15, filter: "blur(100px)", animation: "iqOrbC 14s ease-in-out infinite" }} />
        <div className="absolute top-[8%] right-[28%] w-[280px] h-[280px] rounded-full"
          style={{ background: "#ffe0d0", opacity: 0.18, filter: "blur(100px)", animation: "iqOrbD 18s ease-in-out infinite" }} />
        <div className="absolute inset-0"
          style={{ backgroundImage: "radial-gradient(circle, #d4d4d4 1px, transparent 1px)", backgroundSize: "28px 28px", opacity: 0.04 }} />
      </div>

      <style>{`
        @keyframes iqOrbA { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(60px,-50px) scale(1.12)} 70%{transform:translate(-40px,35px) scale(0.93)} }
        @keyframes iqOrbB { 0%,100%{transform:translate(0,0) scale(1)} 35%{transform:translate(-55px,60px) scale(1.10)} 65%{transform:translate(40px,-30px) scale(0.91)} }
        @keyframes iqOrbC { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-60px,-60px) scale(1.15)} }
        @keyframes iqOrbD { 0%,100%{transform:translate(0,0) scale(1)} 45%{transform:translate(50px,40px) scale(1.09)} 75%{transform:translate(-30px,-22px) scale(0.95)} }
      `}</style>

      <div className="container relative px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16 md:mb-24"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <SectionBadge label="AI-Powered Assessment" icon={Sparkles} className="mb-6" />
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            Your Industry<br /><span className="text-primary">Readiness Score</span>
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="h-0.5 w-40 mx-auto mb-5 origin-left"
            style={{ background: "hsl(33,100%,50%)" }}
          />
          <p className="text-base md:text-[17px]" style={{ color: "#6b7280" }}>
            Benchmarked against 50,000+ professionals. Trusted by top employers.
          </p>
        </motion.div>

        {/* Main layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left — Score Orb */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            <ScoreOrb />
          </motion.div>

          {/* Right — Assessment Card + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[11px] uppercase tracking-widest text-center mb-4" style={{ color: "rgba(15,15,26,0.35)" }}>
              Live assessment preview ↓
            </p>

            <AssessmentCard />

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 mt-8">
              <Link to="/assessments">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative overflow-hidden flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold text-white"
                  style={{ background: "hsl(33,100%,50%)", boxShadow: "0 8px 32px -4px rgba(255,140,1,0.35)" }}
                >
                  <span className="relative z-10">View Full Report</span>
                  <ArrowRight className="h-4 w-4 relative z-10" />
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold"
                style={{ background: "#ffffff", border: "1px solid hsl(33,100%,50%)", color: "hsl(33,100%,50%)", boxShadow: "0 2px 12px rgba(255,140,1,0.08)" }}
              >
                <Download className="h-4 w-4" /> Download PDF
              </motion.button>
            </div>

            {/* Trusted by */}
            <div className="mt-5">
              <p className="text-[11px] mb-2.5" style={{ color: "#9ca3af" }}>Trusted by engineers at</p>
              <div className="flex flex-wrap gap-2">
                {employers.map(name => (
                  <span
                    key={name}
                    className="px-3 py-1 rounded-full text-[11px] font-medium"
                    style={{ background: "rgba(255,255,255,0.85)", border: "1px solid #f0dada", color: "#4b5563" }}
                  >
                    {name}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-[11px]" style={{ color: "#9ca3af" }}>
                2,400+ companies · 94% hire rate · ⭐ 4.9
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default IndustryReadinessSection;
