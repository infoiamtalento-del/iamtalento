import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import {
  Shield, Eye, Activity, Volume2, AlertTriangle, Lock, Fingerprint,
  Camera, Search, UserCheck, Monitor, Keyboard, Smartphone, ScreenShare,
  Globe, ClipboardPaste, Clock, Wifi, Crosshair, MessagesSquare, Cpu,
  ScanFace, BrainCircuit, Bot, Code2, Video, BarChart3, FileText, Award, Send,
} from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

const proctorPhases = [
  {
    phase: "Before Assessment",
    items: [
      { icon: ScanFace, label: "Biometric Face Match", desc: "AI verifies candidate identity via facial biometrics" },
      { icon: Fingerprint, label: "ID Verification", desc: "Government ID checked against live photo" },
      { icon: Shield, label: "Multi-Factor Auth", desc: "Email + phone OTP before test access" },
      { icon: Camera, label: "Live Photo Capture", desc: "Snapshot taken at session start for audit" },
      { icon: Search, label: "Environment Scan", desc: "360° room check for unauthorized materials" },
      { icon: UserCheck, label: "Identity Confirmation", desc: "Final identity match before test begins" },
    ],
  },
  {
    phase: "During Assessment",
    items: [
      { icon: Eye, label: "Gaze & Eye Tracking", desc: "Monitors where the candidate is looking" },
      { icon: Activity, label: "Behavior Monitoring", desc: "Flags suspicious movement patterns" },
      { icon: Volume2, label: "Audio Detection", desc: "Detects voices, AI speech, and background audio" },
      { icon: Monitor, label: "Browser Lockdown", desc: "Locks browser to prevent tab switching" },
      { icon: Keyboard, label: "Keystroke Analysis", desc: "Analyzes typing patterns for authenticity" },
      { icon: Smartphone, label: "Multi-Device Block", desc: "Prevents simultaneous device usage" },
      { icon: ScreenShare, label: "Screen Recording", desc: "Records full screen for post-review" },
      { icon: AlertTriangle, label: "Distraction Alerts", desc: "AI flags when candidate looks away" },
      { icon: Globe, label: "IP & Geo Tracking", desc: "Tracks location and IP for anomalies" },
      { icon: ClipboardPaste, label: "Copy-Paste Block", desc: "Blocks all clipboard operations" },
      { icon: Clock, label: "Session Time Tracking", desc: "Flags unusual per-question timing" },
      { icon: Wifi, label: "Exit Monitoring", desc: "Logs all test exit attempts" },
      { icon: Crosshair, label: "Geo-Fencing", desc: "Restricts access to approved locations" },
      { icon: MessagesSquare, label: "Proctor Live Chat", desc: "Real-time support during assessment" },
      { icon: Lock, label: "Screenshot Block", desc: "Prevents screen capture and recording" },
      { icon: Cpu, label: "VM Detection", desc: "Detects virtual machines and emulators" },
    ],
  },
  {
    phase: "After Assessment",
    items: [
      { icon: BrainCircuit, label: "AI Cheating Detection", desc: "ML algorithms flag suspicious patterns" },
      { icon: Bot, label: "ChatGPT Detection", desc: "Identifies AI-generated responses" },
      { icon: Code2, label: "Plagiarism Check", desc: "Cross-references against known sources" },
      { icon: Video, label: "Full Session Replay", desc: "Complete video playback for review" },
      { icon: BarChart3, label: "Integrity Score", desc: "Composite score from all proctoring signals" },
      { icon: FileText, label: "Audit Trail", desc: "Tamper-proof log of every action" },
      { icon: Award, label: "Integrity Rating", desc: "Overall candidate trustworthiness grade" },
      { icon: Send, label: "Post-Test Monitoring", desc: "Continued checks after submission" },
    ],
  },
];

const AssessmentIntegritySection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [activeTab, setActiveTab] = useState(1);

  return (
    <section ref={ref} className="py-16 md:py-20 relative overflow-hidden bg-white">
      <div className="container">
        <div className={cn("text-center max-w-2xl mx-auto mb-14 transition-all duration-700", isVisible ? "opacity-100" : "opacity-0 translate-y-8")}>
          <SectionBadge label="30-Layer Proctoring" icon={Shield} />
          <motion.h2
            className="text-3xl md:text-4xl font-bold font-display mb-3 text-foreground leading-[1.15]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            30 Layers of Integrity.<br />
            <span className="text-primary">Zero Tolerance.</span>
          </motion.h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Every assessment is protected before, during, and after —
            <br className="hidden md:block" />
            so every score is actually earned.
          </p>
        </div>

        {/* Tabs */}
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center gap-2 mb-10">
            {proctorPhases.map((group, i) => (
              <button
                key={group.phase}
                onClick={() => setActiveTab(i)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-sm font-semibold font-display transition-all duration-300 border",
                  activeTab === i
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground border-border hover:border-foreground/20"
                )}
              >
                {group.phase}
                <span className={cn(
                  "ml-2 text-xs px-1.5 py-0.5 rounded-full",
                  activeTab === i ? "bg-white/20" : "bg-white/10"
                )}>
                  {group.items.length}
                </span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
            >
              {proctorPhases[activeTab].items.map(({ icon: Icon, label, desc }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04, duration: 0.25 }}
                  className="relative px-4 py-4 rounded-xl border hover:shadow-lg transition-all duration-300 group cursor-default"
                  style={{ background: "#f8fafc", borderColor: "#e2e8f0" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "hsl(355 84% 54% / 0.15)" }}>
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-sm font-semibold leading-tight text-foreground">{label}</span>
                  </div>
                  {/* Hover tooltip */}
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 px-3 py-2 rounded-lg bg-white text-slate-800 text-xs leading-relaxed text-center opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none z-20 shadow-xl">
                    {desc}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-white" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center text-base font-semibold font-display mt-16 text-foreground"
        >
          Credible Scores. Trusted Outcomes.
        </motion.p>
      </div>
    </section>
  );
};

export default AssessmentIntegritySection;
