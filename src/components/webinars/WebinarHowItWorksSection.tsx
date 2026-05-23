import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import {
  CheckCircle,
  FileText,
  Play,
  Award,
  Zap,
  Users,
  MessageSquare,
  Calendar,
  Share2,
} from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

const steps = [
  {
    label: "REGISTER",
    title: "Secure Your Seat",
    desc: "Pick your webinar and reserve a spot in under 60 seconds.",
    icon: CheckCircle,
    theme: "red",
    rotate: -7,
  },
  {
    label: "CONFIRM",
    title: "Calendar Invite",
    desc: "Add the session to your calendar with one click — Google, Outlook, Apple.",
    icon: Calendar,
    theme: "yellow",
    rotate: 5,
  },
  {
    label: "PRE-READ",
    title: "Arrive Prepared",
    desc: "We send context material 24 hours before so you walk in ready.",
    icon: FileText,
    theme: "red",
    rotate: -4,
  },
  {
    label: "ATTEND LIVE",
    title: "Learn in Real Time",
    desc: "Interact, ask questions, join polls and absorb live insights.",
    icon: Play,
    theme: "yellow",
    rotate: 6,
  },
  {
    label: "ENGAGE",
    title: "Q&A With Experts",
    desc: "Get your doubts answered directly by industry leaders during the live AMA.",
    icon: MessageSquare,
    theme: "red",
    rotate: -5,
  },
  {
    label: "NETWORK",
    title: "Meet Your Peers",
    desc: "Connect with attendees from top companies in the breakout community room.",
    icon: Users,
    theme: "yellow",
    rotate: 4,
  },
  {
    label: "GET CERTIFIED",
    title: "Add to Your Profile",
    desc: "Download your certificate and auto-add it to your Talento profile.",
    icon: Award,
    theme: "red",
    rotate: -6,
  },
  {
    label: "SHARE",
    title: "Show Off Your Win",
    desc: "Post your badge to LinkedIn in one tap and let recruiters notice.",
    icon: Share2,
    theme: "yellow",
    rotate: 7,
  },
];

const themes: Record<string, { bg: string; text: string; sub: string; chip: string; border: string }> = {
  red:    { bg: "bg-[#ef4444]", text: "text-white",     sub: "text-white/70",     chip: "bg-white/15 text-white",         border: "border-black/5" },
  yellow: { bg: "bg-[#fbbf24]", text: "text-[#1a1500]", sub: "text-[#3a2f00]/70", chip: "bg-[#1a1500]/10 text-[#1a1500]", border: "border-black/10" },
};

const StepCard = ({
  index,
  data,
  progress,
  total,
}: {
  index: number;
  data: (typeof steps)[0];
  progress: MotionValue<number>;
  total: number;
}) => {
  const Icon = data.icon;
  const t = themes[data.theme];

  const slice = 1 / total;
  const inStart = Math.max(0, index * slice);
  const inEarly = Math.min(1, inStart + slice * 0.25);
  const inMid = Math.min(1, inStart + slice * 0.4);
  const settle = Math.min(1, inStart + slice * 0.65);

  const y = useTransform(progress, [inStart, inMid, settle], [-360, -40, 0]);
  const rotate = useTransform(
    progress,
    [inStart, inMid, settle],
    [data.rotate * 2.5, data.rotate * 1.4, data.rotate]
  );
  const opacity = useTransform(progress, [inStart, inEarly], [index === 0 ? 1 : 0, 1]);
  const scale = useTransform(progress, [inStart, settle], [0.9, 1]);

  return (
    <motion.div
      style={{
        y,
        rotate,
        opacity,
        scale,
        zIndex: 10 + index,
      }}
      className="absolute inset-x-0 mx-auto w-full max-w-md"
    >
      <div className={`${t.bg} ${t.text} ${t.border} border rounded-3xl shadow-2xl px-6 md:px-8 py-6 md:py-7 relative overflow-hidden`}>
        <span
          aria-hidden
          className={`absolute -top-4 right-3 font-display font-black leading-none select-none ${t.text} opacity-10`}
          style={{ fontSize: "clamp(90px, 11vw, 150px)" }}
        >
          {index + 1}
        </span>

        <div className="relative">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-[0.18em] ${t.chip}`}>
            <Icon className="h-3 w-3" /> {data.label}
          </div>
          <h3 className={`mt-3 text-2xl md:text-3xl font-bold font-display leading-[1.1] ${t.text}`}>
            {data.title}
          </h3>
          <p className={`mt-2 text-sm max-w-sm ${t.sub}`}>{data.desc}</p>

          <div className={`mt-5 flex items-center gap-3 text-[10px] tracking-[0.2em] font-bold ${t.sub}`}>
            <span>0{index + 1}</span>
            <span className="h-px flex-1 bg-current opacity-20" />
            <span>0{index + 1}/0{total}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const WebinarHowItWorksSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [activeIdx, setActiveIdx] = useState(0);
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      const idx = Math.min(steps.length - 1, Math.max(0, Math.floor(v * steps.length)));
      setActiveIdx(idx);
    });
    return unsub;
  }, [scrollYProgress]);

  const active = steps[activeIdx];
  const ActiveIcon = active.icon;

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <SectionBadge label="How It Works" icon={Zap} />
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold font-display mb-3"
          >
            From Registration to<br />
            <span className="text-primary">Real Skill in 8 Steps</span>
          </motion.h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Scroll to stack each step — a guided path from signup to celebration.
          </p>
        </div>

        <div ref={containerRef} className="relative" style={{ height: `${steps.length * 80}vh` }}>
          <div className="sticky top-0 h-screen flex items-center overflow-hidden">
            <div className="grid lg:grid-cols-12 gap-8 w-full">
              {/* LEFT — sticky highlighted content */}
              <div className="lg:col-span-5 lg:pr-6">
                <div className="text-xs font-bold tracking-[0.25em] text-muted-foreground mb-3">
                  STEP {String(activeIdx + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
                </div>

                <motion.h3
                  key={`title-${activeIdx}`}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-4xl md:text-5xl font-bold font-display leading-[1.05] mb-4"
                >
                  {active.title}
                </motion.h3>

                <motion.p
                  key={`desc-${activeIdx}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                  className="text-muted-foreground max-w-md mb-8"
                >
                  {active.desc}
                </motion.p>

                {/* step list */}
                <ul className="space-y-2 max-h-[40vh] overflow-hidden">
                  {steps.map((s, i) => {
                    const isActive = i === activeIdx;
                    const isPast = i < activeIdx;
                    const SIcon = s.icon;
                    return (
                      <li
                        key={s.label}
                        className={`flex items-center gap-3 transition-all duration-300 ${
                          isActive ? "opacity-100" : isPast ? "opacity-40" : "opacity-30"
                        }`}
                      >
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-all ${
                            isActive
                              ? "bg-primary text-primary-foreground scale-110"
                              : isPast
                              ? "bg-muted text-foreground"
                              : "bg-muted/60 text-muted-foreground"
                          }`}
                        >
                          {isPast ? <CheckCircle className="h-3.5 w-3.5" /> : i + 1}
                        </span>
                        <span
                          className={`text-sm tracking-wider font-semibold ${
                            isActive ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {s.label}
                        </span>
                        {isActive && (
                          <SIcon className="h-3.5 w-3.5 text-primary ml-auto" />
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* RIGHT — scroll-stacked cards */}
              <div className="lg:col-span-7 relative h-[70vh] flex items-center justify-center">
                <div className="relative w-full h-full max-w-xl mx-auto flex items-center justify-center">
                  {steps.map((data, i) => (
                    <StepCard
                      key={data.label}
                      index={i}
                      data={data}
                      progress={scrollYProgress}
                      total={steps.length}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WebinarHowItWorksSection;
