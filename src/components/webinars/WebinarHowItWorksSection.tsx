import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { CheckCircle, FileText, Play, Award, Zap } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

const steps = [
  {
    step: "1",
    label: "REGISTER",
    title: "Secure Your Seat",
    desc: "Pick your webinar and reserve a spot in under 60 seconds.",
    icon: CheckCircle,
    // tailwind classes for color theme
    bg: "bg-[#ef4444]",
    text: "text-white",
    sub: "text-white/70",
    chip: "bg-white/15 text-white",
    rotate: -6,
  },
  {
    step: "2",
    label: "PRE-READ",
    title: "Arrive Prepared",
    desc: "We send context material 24 hours before so you walk in ready.",
    icon: FileText,
    bg: "bg-[#0f0f10]",
    text: "text-white",
    sub: "text-white/60",
    chip: "bg-white/10 text-white",
    rotate: 5,
  },
  {
    step: "3",
    label: "ATTEND LIVE",
    title: "Learn in Real Time",
    desc: "Interact, ask questions, join polls and absorb live insights.",
    icon: Play,
    bg: "bg-[#fbbf24]",
    text: "text-[#1a1500]",
    sub: "text-[#3a2f00]/70",
    chip: "bg-[#1a1500]/10 text-[#1a1500]",
    rotate: -4,
  },
  {
    step: "4",
    label: "GET CERTIFIED",
    title: "Add to Your Profile",
    desc: "Download your certificate and auto-add it to your Talento profile.",
    icon: Award,
    bg: "bg-[#ef4444]",
    text: "text-white",
    sub: "text-white/70",
    chip: "bg-white/15 text-white",
    rotate: 6,
  },
];

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

  // Each card occupies a slice of scroll: [index/total, (index+1)/total]
  const slice = 1 / total;
  const inStart = index * slice;
  const inMid = inStart + slice * 0.35;
  const settle = inStart + slice * 0.6;

  // Entrance: drop from above with rotation, then settle
  const y = useTransform(
    progress,
    [inStart - 0.05, inMid, settle],
    [-420, -40, 0]
  );
  const rotate = useTransform(
    progress,
    [inStart - 0.05, inMid, settle],
    [data.rotate * 3, data.rotate * 1.4, data.rotate]
  );
  const opacity = useTransform(
    progress,
    [inStart - 0.05, inStart + slice * 0.2],
    [0, 1]
  );
  const scale = useTransform(
    progress,
    [inStart, settle],
    [0.92, 1]
  );

  return (
    <motion.div
      style={{
        y,
        rotate,
        opacity,
        scale,
        zIndex: 10 + index,
        marginTop: index === 0 ? 0 : -120,
      }}
      className="relative w-full max-w-3xl mx-auto"
    >
      <div
        className={`${data.bg} ${data.text} rounded-3xl shadow-2xl border border-black/5 px-6 md:px-10 py-7 md:py-9 relative overflow-hidden`}
      >
        {/* giant number watermark */}
        <span
          aria-hidden
          className={`absolute -top-6 right-2 md:right-6 font-display font-black leading-none select-none ${data.text} opacity-15`}
          style={{ fontSize: "clamp(120px, 18vw, 220px)" }}
        >
          {data.step}
        </span>

        <div className="relative flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-[0.18em] ${data.chip}`}>
              <Icon className="h-3 w-3" /> {data.label}
            </div>
            <h3 className={`mt-4 text-3xl md:text-5xl font-bold font-display leading-[1.05] ${data.text}`}>
              {data.title}
            </h3>
            <p className={`mt-3 text-sm md:text-base max-w-md ${data.sub}`}>
              {data.desc}
            </p>

            {/* metric row */}
            <div className={`mt-6 flex items-center gap-5 text-[10px] tracking-[0.2em] font-bold ${data.sub}`}>
              <span>STEP · 0{data.step}</span>
              <span className="h-px flex-1 bg-current opacity-20" />
              <span>0{data.step}/0{steps.length}</span>
            </div>
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
            <span className="text-primary">Real Skill in 4 Steps</span>
          </motion.h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Scroll to stack each step — a guided path from signup to certificate.
          </p>
        </div>

        {/* Scroll-driven stack: tall scroll container with sticky stage */}
        <div ref={containerRef} className="relative" style={{ height: `${steps.length * 90}vh` }}>
          <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
            <div className="w-full px-2 md:px-4">
              {steps.map((data, i) => (
                <StepCard
                  key={data.step}
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
    </section>
  );
};

export default WebinarHowItWorksSection;
