import { motion, useInView, AnimatePresence } from "framer-motion";
import { FileText, Layout, Video, ClipboardCheck, Sparkles, ArrowRight, BookOpen, Play, Clock, CheckCircle2, Brain, Target, Zap, TrendingUp, Star, Users, MessageSquare } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import SectionBadge from "@/components/ui/section-badge";
import mockThumb1 from "@/assets/mock-interview-1.jpg";
import mockThumb2 from "@/assets/mock-interview-2.jpg";
import mockThumb3 from "@/assets/mock-interview-3.jpg";

/* ------------------------------------------------------------------ */
/*  Visual panels for each perk                                       */
/* ------------------------------------------------------------------ */

/** 01 — Interview Q&A PDF */
const QAPanelVisual = () => {
  const questions = [
    { q: "What is a closure in JavaScript?", a: "A closure is a function that retains access to its outer scope, even after the outer function has returned." },
    { q: "Explain REST vs GraphQL", a: "REST uses multiple endpoints. GraphQL uses a single endpoint with flexible queries." },
    { q: "What is the virtual DOM?", a: "A lightweight in-memory copy of the real DOM for efficient diffing and batch updates." },
  ];
  return (
    <div className="relative h-full flex items-center justify-center p-6">
      {/* Stacked document pages behind */}
      {[2, 1, 0].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, rotateY: -15, y: 30 }}
          animate={{ opacity: 1 - i * 0.15, rotateY: i * -3, y: i * 8, x: i * 6 }}
          transition={{ delay: 0.1 * i, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bg-card rounded-xl border shadow-lg p-5 w-[85%] max-w-[340px]"
          style={{ perspective: "800px", zIndex: 3 - i }}
        >
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/50">
            <FileText className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold text-primary">Q&A Bank</span>
            <span className="ml-auto text-[10px] text-muted-foreground">Page {i + 1}</span>
          </div>
          <div className="space-y-3">
            {questions.map((item, j) => (
              <motion.div
                key={j}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + j * 0.15 }}
              >
                <div className="flex items-start gap-2 mb-1">
                  <span className="shrink-0 h-5 w-5 rounded-full bg-primary/15 flex items-center justify-center text-[9px] font-bold text-primary">Q</span>
                  <p className="text-xs font-semibold text-foreground leading-snug">{item.q}</p>
                </div>
                <div className="flex items-start gap-2 ml-7">
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{item.a}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

/** 02 — Blueprints & Templates */
const BlueprintPanelVisual = () => {
  const rows = [
    ["Component", "Technology", "Status"],
    ["Auth Service", "JWT + OAuth 2.0", "✅ Done"],
    ["API Gateway", "Kong + Rate Limit", "🔄 WIP"],
    ["Cache Layer", "Redis Cluster", "✅ Done"],
    ["Message Queue", "RabbitMQ", "⏳ Planned"],
  ];
  return (
    <div className="relative h-full flex items-center justify-center p-6" style={{ perspective: "1000px" }}>
      <motion.div
        initial={{ opacity: 0, rotateX: 25, rotateY: -10, scale: 0.85 }}
        animate={{ opacity: 1, rotateX: 8, rotateY: -5, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="bg-card rounded-xl border shadow-2xl overflow-hidden w-[90%] max-w-[380px]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/60 border-b">
          <span className="h-2.5 w-2.5 rounded-full bg-primary/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
          <span className="text-xs font-semibold text-muted-foreground ml-2">System Design Blueprint</span>
        </div>
        {/* Spreadsheet rows */}
        {rows.map((row, ri) => (
          <motion.div
            key={ri}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + ri * 0.1 }}
            className={`flex ${ri === 0 ? "bg-muted/40 font-semibold text-muted-foreground" : "text-foreground"} border-b border-border/30 last:border-b-0`}
          >
            {row.map((cell, ci) => (
              <div key={ci} className="flex-1 px-3 py-2.5 text-[11px] border-r border-border/20 last:border-r-0 truncate">{cell}</div>
            ))}
          </motion.div>
        ))}
      </motion.div>
      {/* Second blueprint behind */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4, rotateX: 12, rotateY: -8 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="absolute bg-card rounded-xl border shadow-md w-[85%] max-w-[360px] h-[180px] -z-10"
        style={{ transform: "translate(12px, 12px)", transformStyle: "preserve-3d" }}
      />
    </div>
  );
};

/** 01 — Mock Interview Videos with human thumbnails & auto-rotate */
const MockVideoPanelVisual = () => {
  const videos = [
    { company: "Google", role: "Frontend Round", duration: "45:20", thumb: mockThumb1 },
    { company: "Amazon", role: "DSA Deep-Dive", duration: "38:15", thumb: mockThumb2 },
    { company: "Meta", role: "System Design", duration: "52:40", thumb: mockThumb3 },
  ];
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % videos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [videos.length]);

  return (
    <div className="relative h-full flex items-center justify-center p-4" style={{ perspective: "1200px" }}>
      {videos.map((v, i) => {
        // Calculate stack position relative to active
        const pos = (i - activeIdx + videos.length) % videos.length;
        return (
          <motion.div
            key={v.company}
            animate={{
              opacity: pos === 0 ? 1 : 1 - pos * 0.15,
              rotateY: pos * -4,
              x: pos * 20,
              y: pos * 8,
              scale: 1 - pos * 0.04,
              zIndex: videos.length - pos,
            }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bg-card rounded-xl border shadow-xl overflow-hidden w-[80%] max-w-[320px] cursor-pointer"
            style={{ transformStyle: "preserve-3d" }}
            onClick={() => setActiveIdx(i)}
          >
            {/* Human thumbnail */}
            <div className="relative h-36 overflow-hidden">
              <img
                src={v.thumb}
                alt={`${v.company} mock interview`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              {/* Play button */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                  <Play className="h-5 w-5 text-primary fill-primary ml-0.5" />
                </div>
              </motion.div>
              <span className="absolute bottom-2 right-3 text-xs font-mono bg-black/70 text-white px-2 py-0.5 rounded">{v.duration}</span>
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-1 rounded-md">
                <span className="h-2 w-2 rounded-full bg-primary-foreground animate-pulse" /> LIVE MOCK
              </div>
            </div>
            <div className="p-3.5 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-foreground">{v.role}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{v.company} Interview</p>
              </div>
              <Video className="h-4 w-4 text-primary" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};


/** 04 — Practice Tests — 3D document mockup */
const PracticeTestPanelVisual = () => {
  const options = ["A single value", "An array", "An object", "undefined"];
  return (
    <div className="relative h-full flex items-center justify-center p-4" style={{ perspective: "1000px" }}>
      {/* Shadow pages behind */}
      {[2, 1].map((n) => (
        <motion.div
          key={n}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 + n * 0.1, rotateX: 6 + n * 2, rotateZ: n * -1.5 }}
          transition={{ delay: n * 0.1, duration: 0.6 }}
          className="absolute bg-card rounded-xl border w-[80%] max-w-[320px] h-[260px]"
          style={{ zIndex: n, transform: `translate(${n * 6}px, ${n * 6}px)`, transformStyle: "preserve-3d" }}
        />
      ))}
      {/* Main test document */}
      <motion.div
        initial={{ opacity: 0, rotateX: 30, y: 40, scale: 0.85 }}
        animate={{ opacity: 1, rotateX: 5, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-card rounded-xl border shadow-2xl overflow-hidden w-[85%] max-w-[340px] z-10"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold text-foreground">JavaScript MCQ</span>
          </div>
          <motion.span
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-xs font-mono font-bold text-primary"
          >
            ⏱ 24:37
          </motion.span>
        </div>
        {/* Question */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Q.12</span>
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "65%" }}
                transition={{ delay: 0.5, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="h-full bg-primary rounded-full"
              />
            </div>
            <span className="text-[10px] font-bold text-muted-foreground">12/20</span>
          </div>
          <p className="text-xs font-semibold text-foreground mb-4">What does Array.prototype.reduce() return?</p>
          <div className="space-y-2">
            {options.map((opt, j) => (
              <motion.div
                key={j}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + j * 0.1 }}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                  j === 0
                    ? "border-primary bg-primary/5 text-foreground font-semibold"
                    : "border-border text-muted-foreground hover:border-primary/30"
                }`}
              >
                <div className={`h-4 w-4 rounded-full border-2 shrink-0 ${j === 0 ? "border-primary bg-primary" : "border-border"} flex items-center justify-center`}>
                  {j === 0 && <CheckCircle2 className="h-2.5 w-2.5 text-primary-foreground" />}
                </div>
                {opt}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/** 05 — AI Personalisation — creative neural network */
const AIPanelVisual = () => {
  const skills = [
    { name: "React", level: 85 },
    { name: "Node.js", level: 60 },
    { name: "Python", level: 72 },
    { name: "SQL", level: 90 },
  ];
  const roadmap = ["Docker Basics · 4 hrs", "K8s Fundamentals · 6 hrs", "AWS Deploy · 8 hrs"];

  return (
    <div className="relative h-full flex items-center justify-center p-4 overflow-hidden">
      {/* Animated neural network dots background */}
      <div className="absolute inset-0 z-0">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-primary/20"
            style={{
              top: `${15 + (i % 4) * 22}%`,
              left: `${10 + (i % 3) * 35}%`,
            }}
            animate={{
              scale: [0.5, 1.2, 0.5],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3,
              delay: i * 0.3,
              repeat: Infinity,
            }}
          />
        ))}
        {/* Connecting lines */}
        <svg className="absolute inset-0 w-full h-full z-0" xmlns="http://www.w3.org/2000/svg">
          {[
            ["20%", "25%", "50%", "40%"],
            ["50%", "40%", "80%", "30%"],
            ["30%", "55%", "60%", "70%"],
            ["60%", "70%", "85%", "55%"],
          ].map(([x1, y1, x2, y2], i) => (
            <motion.line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="hsl(var(--primary) / 0.1)"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5 + i * 0.2, duration: 1 }}
            />
          ))}
        </svg>
      </div>

      {/* Main AI card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 bg-card/95 backdrop-blur-sm rounded-xl border shadow-2xl overflow-hidden w-[88%] max-w-[350px]"
      >
        {/* AI header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-primary/10 to-accent/10 border-b">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="h-4 w-4 text-primary" />
          </motion.div>
          <span className="text-xs font-bold text-foreground">AI Learning Engine</span>
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="ml-auto flex items-center gap-1"
          >
            <Zap className="h-3 w-3 text-primary" />
            <span className="text-[10px] font-bold text-primary">Active</span>
          </motion.div>
        </div>

        <div className="p-4 space-y-4">
          {/* Skill analysis */}
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Your Skill Map</p>
            <div className="space-y-1.5">
              {skills.map((s, i) => (
                <div key={s.name} className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground w-12 font-medium">{s.name}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${s.level}%` }}
                      transition={{ delay: 0.4 + i * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      className={`h-full rounded-full ${s.level >= 80 ? "bg-emerald-500" : s.level >= 70 ? "bg-primary" : "bg-accent"}`}
                    />
                  </div>
                  <span className="text-[10px] font-bold tabular-nums w-7 text-right">{s.level}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI recommendation */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="bg-primary/5 border border-primary/15 rounded-lg p-3"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Target className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-bold text-primary">Recommendation</span>
            </div>
            <p className="text-[11px] text-foreground leading-relaxed">
              Boost <span className="font-bold">Node.js</span> from 60% → 80% with our backend mastery track
            </p>
          </motion.div>

          {/* Roadmap */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <TrendingUp className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Your Roadmap</span>
            </div>
            {roadmap.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 + i * 0.12 }}
                className="flex items-center gap-2 mb-1.5"
              >
                <div className={`h-3.5 w-3.5 rounded-full flex items-center justify-center ${i === 0 ? "bg-emerald-500" : i === 1 ? "bg-accent" : "bg-muted"}`}>
                  {i === 0 && <CheckCircle2 className="h-2 w-2 text-white" />}
                </div>
                <span className={`text-[11px] ${i === 0 ? "text-muted-foreground line-through" : "text-foreground"}`}>{step}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Floating orbit stars */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute z-0"
          animate={{
            x: [0, 15, -10, 0],
            y: [0, -10, 15, 0],
          }}
          transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.8 }}
          style={{
            top: `${20 + i * 25}%`,
            right: `${5 + i * 8}%`,
          }}
        >
          <Star className="h-3 w-3 text-primary/30 fill-primary/20" />
        </motion.div>
      ))}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Perks config                                                      */
/* ------------------------------------------------------------------ */

/** 06 — Community & Peer Learning */
const CommunityPanelVisual = () => {
  const threads = [
    { user: "Aditi K.", avatar: "https://randomuser.me/api/portraits/women/41.jpg", msg: "Can someone explain closures in simple terms?", replies: 12, time: "2h ago" },
    { user: "Rahul M.", avatar: "https://randomuser.me/api/portraits/men/34.jpg", msg: "Just completed the React module! 🎉", replies: 8, time: "4h ago" },
    { user: "Sneha P.", avatar: "https://randomuser.me/api/portraits/women/63.jpg", msg: "Study group for AWS cert, anyone in?", replies: 24, time: "1h ago" },
  ];
  return (
    <div className="relative h-full flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-card rounded-xl border shadow-2xl w-[88%] max-w-[350px] overflow-hidden"
      >
        <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b">
          <Users className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold text-foreground">Community Hub</span>
          <span className="ml-auto text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">1.2K online</span>
        </div>
        <div className="p-3 space-y-2.5">
          {threads.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.12 }}
              className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-muted/40 transition-colors"
            >
              <img src={t.avatar} alt={t.user} className="h-7 w-7 rounded-full object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-foreground">{t.user}</span>
                  <span className="text-[9px] text-muted-foreground">{t.time}</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug truncate">{t.msg}</p>
              </div>
              <span className="text-[9px] font-bold text-primary shrink-0">{t.replies} 💬</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

/** 07 — Doubt Resolution */
const DoubtPanelVisual = () => {
  const msgs = [
    { role: "student", text: "Why does useEffect run twice in dev mode?" },
    { role: "mentor", text: "React 18's Strict Mode intentionally double-invokes effects to help you find bugs. It only happens in development." },
    { role: "student", text: "So it won't happen in production?" },
    { role: "mentor", text: "Exactly! It's a dev-only behavior. Your cleanup function should handle it gracefully." },
  ];
  return (
    <div className="relative h-full flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-card rounded-xl border shadow-2xl w-[88%] max-w-[350px] overflow-hidden"
      >
        <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b">
          <MessageSquare className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold text-foreground">Doubt Resolution</span>
          <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="ml-auto h-2 w-2 rounded-full bg-emerald-500" />
        </div>
        <div className="p-3 space-y-2">
          {msgs.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.2 }}
              className={`flex ${m.role === "student" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[80%] px-3 py-2 rounded-xl text-[11px] leading-relaxed ${
                m.role === "student"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-muted text-foreground rounded-bl-sm"
              }`}>
                {m.text}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="px-3 pb-3">
          <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2 border">
            <span className="text-[11px] text-muted-foreground flex-1">Type your doubt...</span>
            <ArrowRight className="h-3.5 w-3.5 text-primary" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const perks = [
  { icon: Video, title: "Mock Interview Videos", desc: "Real mock rounds from top companies", visual: MockVideoPanelVisual },
  { icon: FileText, title: "Interview Q&A PDF", desc: "Curated question banks for React, SQL, DSA & more", visual: QAPanelVisual },
  { icon: Layout, title: "Blueprints & Templates", desc: "Architecture guides & database schemas", visual: BlueprintPanelVisual },
  { icon: ClipboardCheck, title: "Practice Tests", desc: "Timed assessments with instant scoring", visual: PracticeTestPanelVisual },
  { icon: Sparkles, title: "AI Personalisation", desc: "Custom roadmaps based on your skill gaps", visual: AIPanelVisual },
  { icon: Users, title: "Community & Peers", desc: "Learn together with 50K+ active learners", visual: CommunityPanelVisual },
  { icon: MessageSquare, title: "Doubt Resolution", desc: "Get answers from mentors within minutes", visual: DoubtPanelVisual },
];

/* ------------------------------------------------------------------ */
/*  Main section                                                      */
/* ------------------------------------------------------------------ */

const CoursePerksSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(0);

  const ActiveVisual = perks[active].visual;

  return (
    <section className="py-16 md:py-28 overflow-hidden" ref={ref}>
      <div className="container px-4 md:px-6">
        {/* Section header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <SectionBadge label="Course Inclusions" icon={BookOpen} />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mt-4 mb-3"
          >
            What You Get With<br />
            <span className="text-primary">Every Course</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto"
          >
            <span className="block">Get practical resources with every course.</span>
            <span className="block">Go beyond video lessons.</span>
          </motion.p>
        </div>

        {/* Bento grid — 12 col */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5 max-w-6xl mx-auto">

          {/* ─── Left column: numbered pills ─── */}
          <div className="md:col-span-4 flex flex-col gap-2.5">
            {perks.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                onClick={() => setActive(i)}
                className={`group flex items-center gap-3 rounded-xl border px-4 py-3.5 cursor-pointer transition-all duration-300 ${
                  active === i
                    ? "bg-primary border-primary shadow-md"
                    : "bg-card border-border hover:border-primary/30"
                }`}
              >
                <span
                  className={`text-xs font-bold tabular-nums transition-colors duration-300 ${
                    active === i ? "text-primary-foreground" : "text-primary"
                  }`}
                >
                  0{i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-semibold transition-colors duration-300 truncate ${
                      active === i ? "text-primary-foreground" : "text-foreground"
                    }`}
                  >
                    {p.title}
                  </p>
                </div>
                <ArrowRight
                  className={`h-4 w-4 shrink-0 transition-all duration-300 ${
                    active === i
                      ? "text-primary-foreground translate-x-1"
                      : "text-muted-foreground group-hover:translate-x-0.5"
                  }`}
                />
              </motion.div>
            ))}
          </div>

          {/* ─── Center column: dynamic visual ─── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="md:col-span-5 rounded-2xl bg-muted/30 border relative min-h-[420px] overflow-hidden"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.96 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <ActiveVisual />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* ─── Right column: two accent cards ─── */}
          <div className="md:col-span-3 flex flex-col gap-4">
            {/* Top card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="rounded-2xl border bg-card p-5 flex-1 flex flex-col justify-between group hover:border-primary/30 transition-colors"
            >
              <div>
                <p className="text-xs text-muted-foreground mb-3">Want to see what's inside?</p>
                <h3 className="text-lg md:text-xl font-bold font-display leading-snug mb-1">
                  See how<br />we teach
                </h3>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="mt-4 h-10 w-10 rounded-full border-2 border-foreground flex items-center justify-center cursor-pointer group-hover:bg-primary group-hover:border-primary transition-colors"
              >
                <ArrowRight className="h-4 w-4 text-foreground group-hover:text-primary-foreground transition-colors -rotate-45" />
              </motion.div>
            </motion.div>

            {/* Bottom card — primary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="rounded-2xl bg-primary p-5 flex-1 flex flex-col justify-between"
            >
              <div>
                <p className="text-xs text-primary-foreground/70 mb-3">Looking for guided learning?</p>
                <h3 className="text-lg md:text-xl font-bold font-display text-primary-foreground leading-snug mb-1">
                  AI-powered<br />roadmaps
                </h3>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="mt-4 h-10 w-10 rounded-full border-2 border-primary-foreground/40 bg-primary-foreground/10 flex items-center justify-center cursor-pointer hover:bg-primary-foreground/20 transition-colors"
              >
                <ArrowRight className="h-4 w-4 text-primary-foreground -rotate-45" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoursePerksSection;
