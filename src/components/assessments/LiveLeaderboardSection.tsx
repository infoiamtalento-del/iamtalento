import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const finalLeaderboard = [
  { rank: 1, name: "Arjun Mehta", avatar: "AM", skill: "React.js", score: "98/100", badge: "Expert", badgeColor: "#1D9E75", badgeBg: "rgba(29,158,117,0.1)", rankEmoji: "🥇", isClimber: true },
  { rank: 2, name: "Sneha Iyer", avatar: "SI", skill: "Python", score: "95/100", badge: "Expert", badgeColor: "#1D9E75", badgeBg: "rgba(29,158,117,0.1)", rankEmoji: "🥈", isClimber: false },
  { rank: 3, name: "Rahul Sharma", avatar: "RS", skill: "Data Science", score: "93/100", badge: "Advanced", badgeColor: "#534AB7", badgeBg: "rgba(83,74,183,0.1)", rankEmoji: "🥉", isClimber: false },
  { rank: 4, name: "Priya Nair", avatar: "PN", skill: "UI/UX Design", score: "91/100", badge: "Advanced", badgeColor: "#534AB7", badgeBg: "rgba(83,74,183,0.1)", rankEmoji: "", isClimber: false },
  { rank: 5, name: "Vikram Das", avatar: "VD", skill: "JavaScript", score: "89/100", badge: "Proficient", badgeColor: "#BA7517", badgeBg: "rgba(186,117,23,0.1)", rankEmoji: "", isClimber: false },
];

// Animation stages: Arjun starts at rank 5, climbs to 1
const stages = [
  [4, 0, 1, 2, 3], // Arjun at 5th, others shifted up
  [3, 0, 1, 2, 4], // Arjun climbs to 4th
  [2, 0, 1, 3, 4], // Arjun climbs to 3rd
  [1, 0, 2, 3, 4], // Arjun climbs to 2nd
  [0, 1, 2, 3, 4], // Arjun at 1st (final)
];

const rankDisplay = (pos: number) => {
  if (pos === 0) return "🥇";
  if (pos === 1) return "🥈";
  if (pos === 2) return "🥉";
  return null;
};

const ROW_HEIGHT = 56;

const LiveLeaderboardSection = () => {
  const [stage, setStage] = useState(0);
  const [highlighted, setHighlighted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Start animation when section enters viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted]);

  // Drive the climbing animation
  useEffect(() => {
    if (!hasStarted) return;

    // Reset for replay
    setStage(0);
    setHighlighted(false);

    const timers: ReturnType<typeof setTimeout>[] = [];
    // Climb through stages
    for (let i = 1; i < stages.length; i++) {
      timers.push(setTimeout(() => setStage(i), i * 800));
    }
    // Highlight after reaching top
    timers.push(setTimeout(() => setHighlighted(true), stages.length * 800 + 300));

    return () => timers.forEach(clearTimeout);
  }, [hasStarted]);

  const currentOrder = stages[stage];
  // Build rows: for each visual position (0-4), which person is there?
  const rows = currentOrder.map((personIndex, visualPos) => ({
    person: finalLeaderboard[personIndex],
    visualPos,
    personIndex,
  }));

  // Map each person to their current visual Y position
  const personPositions: Record<number, number> = {};
  currentOrder.forEach((personIndex, visualPos) => {
    personPositions[personIndex] = visualPos;
  });

  return (
    <section ref={sectionRef} className="py-16 md:py-20 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span
            className="inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 mb-3 rounded-full"
            style={{ background: "hsl(var(--primary) / 0.08)", color: "hsl(var(--primary))" }}
          >
            LEADERBOARD
          </span>
          <h2
            className="text-[24px] md:text-[28px] font-bold mb-2 font-display text-foreground"
          >
            See Where You Rank <span className="text-primary">Nationally</span>
          </h2>
          <p className="text-[14px] text-muted-foreground">
            Updated in real-time after every assessment
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden bg-card border border-border"
          style={{ borderRadius: 16 }}
        >
          {/* LIVE indicator - floated above card */}
          <div className="absolute -top-3 right-4 flex items-center gap-1.5 z-10 bg-card px-2.5 py-1 rounded-full border border-border shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-primary" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-[12px] font-bold text-primary">LIVE</span>
          </div>

          {/* Header */}
          <div className="grid grid-cols-[60px_1fr_120px_90px_90px] border-b border-border">
            {["Rank", "Name", "Skill", "Score", "Badge"].map((h) => (
              <div
                key={h}
                className="text-left text-[11px] font-semibold uppercase tracking-wider px-5 py-3.5 text-muted-foreground"
                style={{ fontFamily: "'Space Grotesk', monospace" }}
              >
                {h}
              </div>
            ))}
          </div>

          {/* Animated rows container */}
          <div className="relative" style={{ height: ROW_HEIGHT * 5 }}>
            {finalLeaderboard.map((person, personIndex) => {
              const yPos = personPositions[personIndex] * ROW_HEIGHT;
              const isArjun = person.isClimber;
              const isAtTop = isArjun && stage === stages.length - 1;
              const showGlow = isAtTop && highlighted;
              const currentRank = personPositions[personIndex];
              const emoji = rankDisplay(currentRank);
              const isMuted = currentRank >= 3;

              return (
                <motion.div
                  key={person.name}
                  animate={{
                    y: yPos,
                    scale: showGlow ? [1, 1.02, 1] : 1,
                  }}
                  transition={{
                    y: { type: "spring", stiffness: 120, damping: 18, mass: 0.8 },
                    scale: { duration: 0.5, ease: "easeOut" },
                  }}
                  className="absolute left-0 right-0 grid grid-cols-[60px_1fr_120px_90px_90px] items-center"
                  style={{
                    height: ROW_HEIGHT,
                    borderBottom: currentRank < 4 ? "1px solid hsl(var(--border))" : "none",
                    opacity: isMuted ? 0.7 : 1,
                    zIndex: isArjun ? 10 : 1,
                  }}
                >
                  {/* Highlight glow behind Arjun */}
                  <AnimatePresence>
                    {showGlow && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 rounded-lg pointer-events-none"
                        style={{
                          background: "hsl(var(--primary) / 0.06)",
                          boxShadow: "inset 0 0 0 2px hsl(var(--primary) / 0.2)",
                          margin: "2px 4px",
                          borderRadius: 10,
                        }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Rank */}
                  <div className="px-5 flex items-center gap-2 relative z-10">
                    {emoji ? (
                      <span className="text-[16px]">{emoji}</span>
                    ) : (
                      <span
                        className="h-6 w-6 flex items-center justify-center text-[11px] font-bold rounded-full bg-muted text-muted-foreground"
                      >
                        {currentRank + 1}
                      </span>
                    )}
                  </div>

                  {/* Name */}
                  <div className="px-5 flex items-center gap-2.5 relative z-10">
                    <div
                      className="h-8 w-8 flex items-center justify-center text-[11px] font-bold shrink-0"
                      style={{
                        borderRadius: 8,
                        background: isArjun ? "hsl(var(--primary) / 0.1)" : "hsl(var(--muted))",
                        color: isArjun ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                      }}
                    >
                      {person.avatar}
                    </div>
                    <span className="text-[13px] font-semibold text-foreground">
                      {person.name}
                    </span>
                    {/* Climbing indicator */}
                    <AnimatePresence>
                      {isArjun && stage > 0 && stage < stages.length && !highlighted && (
                        <motion.span
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-[10px] font-bold text-primary flex items-center gap-0.5"
                        >
                          ▲
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Skill */}
                  <div className="px-5 relative z-10">
                    <span className="text-[12px] text-muted-foreground">{person.skill}</span>
                  </div>

                  {/* Score */}
                  <div className="px-5 relative z-10">
                    <span className="text-[13px] font-bold text-primary">{person.score}</span>
                  </div>

                  {/* Badge */}
                  <div className="px-5 relative z-10">
                    <span
                      className="text-[11px] font-semibold px-2.5 py-1"
                      style={{
                        borderRadius: 100,
                        background: person.badgeBg,
                        color: person.badgeColor,
                      }}
                    >
                      {person.badge}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </motion.div>

        {/* CTA outside card */}
        <div className="flex justify-center mt-6">
          <button
            className="flex items-center gap-2 px-6 py-3 text-[14px] font-bold rounded-full bg-primary text-primary-foreground transition-opacity duration-200 hover:opacity-90 shadow-lg"
          >
            Take a test to see your rank <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default LiveLeaderboardSection;
