import { useState, useEffect } from "react";
import { CheckCircle, Play, Briefcase, TrendingUp, Lock, Unlock, Video, Mic, MicOff, MonitorUp, Users, Clock, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const stages = [
  { id: 0, title: "Before Assessment", subtitle: "Discover where you stand" },
  { id: 1, title: "During Assessment", subtitle: "Live AI interview" },
  { id: 2, title: "After Assessment", subtitle: "Your verified results" },
  { id: 3, title: "Job Matching", subtitle: "Unlock opportunities" },
];

const CARD_MIN_H = "min-h-[420px]";

function BeforeStage() {
  return (
    <div className={`space-y-3 ${CARD_MIN_H} flex flex-col`}>
      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl border-2 border-dashed border-border">
        <img
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-foreground">Priya Menon</p>
          <p className="text-[10px] text-muted-foreground">Sr. Product Designer</p>
        </div>
        <Lock className="w-4 h-4 text-muted-foreground" />
      </div>

      <div className="space-y-2.5 flex-1">
        {["Technical Skills", "Domain Knowledge", "Problem Solving", "Communication"].map((skill) => (
          <div key={skill}>
            <div className="flex justify-between items-center text-[10px] mb-1">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Lock className="w-3 h-3" /> {skill}
              </span>
              <motion.span
                className="text-primary font-bold text-base"
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.3, 0.9] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                ?
              </motion.span>
            </div>
            <div className="h-2 bg-muted rounded-full" />
          </div>
        ))}
      </div>

      <div className="p-3 bg-primary/5 rounded-xl text-center border border-primary/10">
        <p className="text-[10px] font-semibold text-foreground mb-1">Ready to unlock your potential?</p>
        <p className="text-[9px] text-muted-foreground mb-2">Take the AI-powered assessment</p>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 gradient-primary rounded-lg text-primary-foreground text-[10px] font-semibold">
          <Play className="w-3 h-3" /> Start Assessment
        </div>
      </div>
    </div>
  );
}

function DuringStage() {
  const [micActive, setMicActive] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setMicActive((p) => !p), 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className={`space-y-3 ${CARD_MIN_H} flex flex-col`}>
      {/* Header bar */}
      <div className="flex justify-between items-center p-2 bg-primary/5 rounded-lg text-[10px]">
        <span className="text-foreground font-semibold flex items-center gap-1">
          <Video className="w-3 h-3 text-primary" /> Live AI Interview
        </span>
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-1.5 h-1.5 rounded-full bg-destructive animate-ping absolute" />
            <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
          </div>
          <span className="text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" /> 18:32
          </span>
        </div>
      </div>

      {/* Two-panel split: Interviewer | Interviewee */}
      <div className="flex-1 grid grid-cols-2 gap-2">
        {/* Interviewer Panel */}
        <div className="relative rounded-xl overflow-hidden bg-secondary border border-border/50">
          <img
            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop&crop=face&facepad=2.5"
            alt="Interviewer"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
          <div className="absolute bottom-2 left-2 right-2">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-primary/80 flex items-center justify-center">
                <Mic className="w-2.5 h-2.5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-white">Raj Kapoor</p>
                <p className="text-[7px] text-white/70">AI Interviewer</p>
              </div>
            </div>
          </div>
          {/* Speaking indicator */}
          <div className="absolute top-2 right-2 flex gap-0.5 items-end">
            {[1, 2, 3].map((bar) => (
              <motion.div
                key={bar}
                className="w-0.5 bg-primary rounded-full"
                animate={{ height: [4, 8 + bar * 3, 4] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: bar * 0.15 }}
              />
            ))}
          </div>
        </div>

        {/* Interviewee Panel */}
        <div className="relative rounded-xl overflow-hidden bg-secondary border border-border/50">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop&crop=face&facepad=2.5"
            alt="Candidate"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
          <div className="absolute bottom-2 left-2 right-2">
            <div className="flex items-center gap-1.5">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${micActive ? "bg-primary/80" : "bg-destructive"}`}>
                {micActive ? <Mic className="w-2.5 h-2.5 text-primary-foreground" /> : <MicOff className="w-2.5 h-2.5 text-primary-foreground" />}
              </div>
              <div>
                <p className="text-[9px] font-bold text-white">Priya Menon</p>
                <p className="text-[7px] text-white/70">Candidate</p>
              </div>
            </div>
          </div>
          {/* Small self-view badge */}
          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-primary/80 text-[7px] text-primary-foreground font-semibold">
            YOU
          </div>
        </div>
      </div>

      {/* Controls bar */}
      <div className="flex items-center justify-center gap-3 pt-1">
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-accent transition-colors cursor-pointer">
          <Video className="w-4 h-4 text-foreground" />
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors ${micActive ? "bg-muted hover:bg-accent" : "bg-destructive"}`}>
          {micActive ? <Mic className="w-4 h-4 text-foreground" /> : <MicOff className="w-4 h-4 text-primary-foreground" />}
        </div>
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-accent transition-colors cursor-pointer">
          <MonitorUp className="w-4 h-4 text-foreground" />
        </div>
        <div className="w-8 h-8 rounded-full bg-destructive flex items-center justify-center cursor-pointer hover:bg-destructive/80 transition-colors">
          <span className="text-primary-foreground text-[10px] font-bold">End</span>
        </div>
      </div>
    </div>
  );
}

function AfterStage() {
  const [scoreCount, setScoreCount] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setScoreCount((p) => (p < 82 ? p + 1 : p)), 20);
    return () => clearInterval(t);
  }, []);

  const skills = [
    { name: "Technical Skills", score: 88 },
    { name: "Domain Knowledge", score: 76 },
    { name: "Problem Solving", score: 82 },
    { name: "Communication", score: 71 },
  ];

  return (
    <div className={`space-y-3 ${CARD_MIN_H} flex flex-col`}>
      <div className="flex items-center gap-3 p-3 bg-accent/30 rounded-xl">
        <div className="relative shrink-0">
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" alt="Priya" className="w-10 h-10 rounded-full object-cover border-2 border-primary/30" />
          <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary rounded-full flex items-center justify-center border-2 border-card">
            <CheckCircle className="w-2.5 h-2.5 text-primary-foreground" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-foreground">Priya Menon</p>
          <p className="text-[9px] text-muted-foreground">Sr. Product Designer</p>
          <span className="inline-block mt-0.5 px-1.5 py-0.5 bg-primary/10 text-primary text-[8px] font-semibold rounded">VERIFIED TOP 5%</span>
        </div>
        <div className="text-center shrink-0">
          <div className="relative w-14 h-14">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="14" stroke="hsl(var(--muted))" strokeWidth="3" fill="none" />
              <circle cx="18" cy="18" r="14" stroke="hsl(var(--primary))" strokeWidth="3" fill="none" strokeDasharray={`${(scoreCount / 100) * 88} 88`} strokeLinecap="round" className="transition-all duration-300" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-base font-bold text-foreground">{scoreCount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2.5 flex-1">
        {skills.map((skill, idx) => (
          <div key={skill.name}>
            <div className="flex justify-between text-[10px] mb-1">
              <span className="font-medium text-foreground">{skill.name}</span>
              <span className="font-bold text-foreground">{skill.score}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full gradient-primary" initial={{ width: 0 }} animate={{ width: `${skill.score}%` }} transition={{ duration: 1, delay: idx * 0.15, ease: "easeOut" }} />
            </div>
          </div>
        ))}
      </div>

      <div className="p-2.5 bg-primary/5 rounded-lg border border-primary/10">
        <div className="flex gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
          <p className="text-[9px] text-muted-foreground leading-relaxed">Strong UX research & Figma skills. You're in the top 5% of Product Designers. Recommend improving data visualization.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="text-center p-1.5 bg-muted/30 rounded-lg">
          <p className="text-xs font-bold text-primary">156</p>
          <p className="text-[8px] text-muted-foreground">Profile Views</p>
        </div>
        <div className="text-center p-1.5 bg-muted/30 rounded-lg">
          <p className="text-xs font-bold text-primary">12</p>
          <p className="text-[8px] text-muted-foreground">Interested</p>
        </div>
        <div className="text-center p-1.5 bg-muted/30 rounded-lg">
          <p className="text-xs font-bold text-foreground">Top 5%</p>
          <p className="text-[8px] text-muted-foreground">Domain Rank</p>
        </div>
      </div>
    </div>
  );
}

function JobMatchStage() {
  const jobs = [
    { company: "Google", role: "Sr. Product Designer", match: 94, salary: "₹18L - ₹26L", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/120px-Google_%22G%22_logo.svg.png" },
    { company: "Microsoft", role: "Lead UX Designer", match: 89, salary: "₹20L - ₹30L", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/120px-Microsoft_logo.svg.png" },
    { company: "Spotify", role: "Design Manager", match: 87, salary: "₹16L - ₹24L", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/120px-Spotify_icon.svg.png" },
  ];

  return (
    <div className={`space-y-3 ${CARD_MIN_H} flex flex-col`}>
      <div className="text-center p-3 bg-primary/5 rounded-xl border border-primary/20">
        <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center mx-auto mb-1.5 shadow-glow">
          <Unlock className="w-4 h-4 text-primary-foreground" />
        </div>
        <p className="text-xs font-bold text-foreground">Profile Unlocked</p>
        <p className="text-[9px] text-muted-foreground">Score of 82, matched with premium roles</p>
      </div>

      <div className="space-y-2 flex-1">
        {jobs.map((job, idx) => (
          <motion.div key={job.company} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.15, duration: 0.4 }} className="p-3 bg-card border border-border rounded-xl hover:border-primary/30 transition-all group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center shrink-0 p-1">
                <img src={job.logo} alt={job.company} className="w-5 h-5 object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold text-foreground">{job.company}</p>
                  <span className="text-xs font-bold text-primary">{job.match}%</span>
                </div>
                <p className="text-[9px] text-muted-foreground">{job.role}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[9px] text-primary font-semibold">{job.salary}</span>
                  <ChevronRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="mt-1.5 h-1 bg-muted rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full gradient-primary" initial={{ width: 0 }} animate={{ width: `${job.match}%` }} transition={{ duration: 1, delay: idx * 0.2 }} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="text-center py-2 rounded-lg border border-primary text-primary text-[10px] font-semibold cursor-pointer hover:bg-primary/5 transition-colors flex items-center justify-center gap-1">
          <Users className="w-3 h-3" /> View All
        </div>
        <div className="text-center py-2 rounded-lg gradient-primary text-primary-foreground text-[10px] font-semibold cursor-pointer hover:opacity-90 transition-all flex items-center justify-center gap-1">
          <Briefcase className="w-3 h-3" /> Apply Now
        </div>
      </div>
    </div>
  );
}

const stageComponents = [BeforeStage, DuringStage, AfterStage, JobMatchStage];

export default function HeroAssessmentJourney() {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStage((p) => (p + 1) % 4);
      setProgress(0);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setProgress((p) => Math.min(p + 1.7, 100)), 100);
    return () => clearInterval(t);
  }, [stage]);

  const StageComponent = stageComponents[stage];

  return (
    <div className="w-full">
      <div className="grid grid-cols-4 gap-2 mb-4">
        {stages.map((s, idx) => (
          <button key={idx} onClick={() => { setStage(idx); setProgress(0); }} className="flex flex-col items-center gap-1.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 text-xs font-bold ${
              idx === stage ? "gradient-primary text-primary-foreground scale-110 shadow-glow" : idx < stage ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
            }`}>
              {idx < stage ? <CheckCircle className="w-4 h-4" /> : idx + 1}
            </div>
            <span className="text-[8px] text-muted-foreground text-center leading-tight">{s.title}</span>
          </button>
        ))}
      </div>

      <div className="w-full h-1 bg-muted rounded-full mb-4 overflow-hidden">
        <div className="h-full gradient-primary transition-all duration-100 ease-linear" style={{ width: `${progress}%` }} />
      </div>

      <div className="relative">
        <div className="absolute -inset-0.5 gradient-primary rounded-2xl blur opacity-15" />
        <div className="relative bg-card rounded-2xl border border-border/50 shadow-2xl overflow-hidden">
          <div className="p-4">
            <div className="text-center mb-3">
              <h3 className="text-sm font-bold text-foreground">{stages[stage].title}</h3>
              <p className="text-[10px] text-muted-foreground">{stages[stage].subtitle}</p>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={stage} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4 }}>
                <StageComponent />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
