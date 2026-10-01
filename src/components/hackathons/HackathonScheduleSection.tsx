import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Clock, ArrowRight } from "lucide-react";

import hackathonHero from "@/assets/hackathon-hero.jpg";
import hackathonEvent1 from "@/assets/hackathon-event-1.jpg";
import hackathonEvent2 from "@/assets/hackathon-event-2.jpg";

const scheduleData = [
  { title: "AI-Powered Resume Screener — Build Sprint", speaker: "Aditya Sharma", role: "CTO, RecruitAI", duration: "48 hrs", img: hackathonHero, tags: ["AI/ML", "Hiring Tech"], status: "live" as const },
  { title: "FinTech Fraud Detection — Live Challenge", speaker: "Neha Kapoor", role: "VP Eng, Razorpay", duration: "48 hrs", img: hackathonEvent1, tags: ["FinTech", "Security"], status: "live" as const },
  { title: "EdTech Accessibility Hackathon — Open Build", speaker: "Rohan Verma", role: "Product Lead, Byju's", duration: "48 hrs", img: hackathonEvent2, tags: ["EdTech", "Impact"], status: "live" as const },
  { title: "Green Energy Dashboard — Sustainability Sprint", speaker: "Kavya Reddy", role: "Eng Lead, Tata Power", duration: "48 hrs", img: hackathonHero, tags: ["CleanTech", "Data Viz"], status: "upcoming" as const },
  { title: "HealthTech Diagnostics — AI Challenge", speaker: "Vikram Joshi", role: "CTO, Practo", duration: "48 hrs", img: hackathonEvent1, tags: ["HealthTech", "AI"], status: "upcoming" as const },
  { title: "Smart City IoT — Connected Solutions", speaker: "Priya Nair", role: "IoT Lead, Cisco India", duration: "48 hrs", img: hackathonEvent2, tags: ["IoT", "Smart City"], status: "upcoming" as const },
];

const HackathonScheduleSection = () => {
  const [tab, setTab] = useState<"live" | "upcoming">("live");
  const filtered = scheduleData.filter(s => s.status === tab);

  return (
    <section id="hackathon-schedule" className="pt-4 pb-16 md:pt-6 md:pb-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-2">
          <h2 className="text-3xl md:text-4xl font-bold font-display">
            Live &<br /><span className="text-primary">Upcoming</span>
          </h2>
          <div className="flex gap-2">
            <button onClick={() => setTab("live")} className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${tab === "live" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}>
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className={`absolute inset-0 rounded-full bg-primary-foreground ${tab === "live" ? "animate-ping opacity-75" : "opacity-0"}`} />
                  <span className={`relative rounded-full h-2 w-2 ${tab === "live" ? "bg-primary-foreground" : "bg-muted-foreground"}`} />
                </span>
                Live Now
              </span>
            </button>
            <button onClick={() => setTab("upcoming")} className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${tab === "upcoming" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}>
              Upcoming
            </button>
          </div>
        </div>
        <p className="text-muted-foreground text-sm mb-8">
          {tab === "live" ? "Hackathons running right now. Jump in and build." : "Mark your calendar. Registration opens soon."}
        </p>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.length === 0 ? (
              <div className="col-span-full p-12 text-center text-sm text-muted-foreground rounded-xl border border-border">No {tab} hackathons right now. Check back soon!</div>
            ) : (
              filtered.map((s, i) => (
                <motion.div key={s.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                  <div className="relative h-44 overflow-hidden">
                    <img src={s.img} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent" />
                    <div className="absolute bottom-3 right-3 h-10 w-10 rounded-full bg-primary flex items-center justify-center shadow-lg opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all">
                      <Play className="h-4 w-4 text-primary-foreground fill-primary-foreground ml-0.5" />
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                      <span className="flex items-center gap-1 text-[10px] text-primary-foreground/90 bg-foreground/30 backdrop-blur-sm rounded-full px-2 py-0.5">
                        <Clock className="h-3 w-3" />{s.duration}
                      </span>
                    </div>
                    {s.status === "live" && (
                      <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-md" style={{ animation: "blink-live 1.4s ease-in-out infinite" }}>
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inset-0 rounded-full bg-primary-foreground animate-ping opacity-75" />
                          <span className="relative rounded-full h-1.5 w-1.5 bg-primary-foreground" />
                        </span>
                        LIVE
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex gap-1.5 mb-2">
                      {s.tags.map(t => (
                        <span key={t} className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-accent text-primary">{t}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2.5 mb-3">
                      <img src={s.img} alt={s.speaker} className="h-9 w-9 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-semibold">{s.speaker}</p>
                        <p className="text-xs text-muted-foreground">{s.role}</p>
                      </div>
                    </div>
                    <h3 className="text-base font-bold font-display leading-snug mb-3 group-hover:text-primary transition-colors">{s.title}</h3>
                    <span className="text-sm font-semibold text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      {s.status === "live" ? "Join Now" : "Set Reminder"} <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <style>{`
        @keyframes blink-live {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </section>
  );
};

export default HackathonScheduleSection;
