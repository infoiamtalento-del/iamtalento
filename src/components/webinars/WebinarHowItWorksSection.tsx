import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { CheckCircle, FileText, Play, Award, Zap, ArrowRight } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

const howItWorks = [
  {
    step: "01",
    title: "Register",
    desc: "Pick your webinar and secure your seat in under 60 seconds.",
    icon: CheckCircle,
    accent: "from-primary/20 to-primary/5",
    mock: "register",
  },
  {
    step: "02",
    title: "Get Pre-Read",
    desc: "We send you context material 24 hours before so you arrive prepared.",
    icon: FileText,
    accent: "from-amber-400/20 to-amber-400/5",
    mock: "preread",
  },
  {
    step: "03",
    title: "Attend Live",
    desc: "Interact, ask questions, participate in polls, and learn in real time.",
    icon: Play,
    accent: "from-rose-500/20 to-rose-500/5",
    mock: "live",
  },
  {
    step: "04",
    title: "Get Certified",
    desc: "Download your certificate and auto-add it to your I Am Talento profile.",
    icon: Award,
    accent: "from-emerald-500/20 to-emerald-500/5",
    mock: "cert",
  },
];

const MockScreen = ({ type }: { type: string }) => {
  if (type === "register") {
    return (
      <div className="space-y-3">
        <div className="h-3 w-2/3 rounded-full bg-foreground/10" />
        <div className="h-10 rounded-lg border border-border bg-background flex items-center px-3">
          <div className="h-2 w-24 rounded bg-foreground/20" />
        </div>
        <div className="h-10 rounded-lg border border-border bg-background flex items-center px-3">
          <div className="h-2 w-32 rounded bg-foreground/20" />
        </div>
        <div className="h-10 rounded-lg bg-primary flex items-center justify-center">
          <div className="h-2 w-20 rounded bg-primary-foreground/80" />
        </div>
      </div>
    );
  }
  if (type === "preread") {
    return (
      <div className="space-y-2">
        <div className="h-3 w-1/2 rounded-full bg-foreground/15 mb-3" />
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-2 rounded-full bg-foreground/10" style={{ width: `${100 - i * 8}%` }} />
        ))}
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-amber-400/20 px-3 py-1">
          <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          <div className="h-2 w-16 rounded bg-amber-700/50" />
        </div>
      </div>
    );
  }
  if (type === "live") {
    return (
      <div className="space-y-3">
        <div className="aspect-video rounded-lg bg-gradient-to-br from-rose-500/30 to-rose-500/10 relative flex items-center justify-center">
          <div className="h-10 w-10 rounded-full bg-background/90 flex items-center justify-center">
            <Play className="h-4 w-4 text-rose-500 fill-rose-500" />
          </div>
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-rose-500 rounded px-1.5 py-0.5">
            <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[8px] text-white font-bold">LIVE</span>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-6 rounded-full bg-foreground/20" />
          <div className="flex-1 h-6 rounded-full bg-foreground/10" />
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-3 text-center">
      <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
        <Award className="h-6 w-6 text-emerald-600" />
      </div>
      <div className="h-3 w-3/4 mx-auto rounded-full bg-foreground/15" />
      <div className="h-2 w-1/2 mx-auto rounded-full bg-foreground/10" />
      <div className="rounded-lg border-2 border-dashed border-emerald-500/40 p-3 mt-2">
        <div className="h-2 w-full rounded bg-emerald-500/20" />
      </div>
    </div>
  );
};

const StepCard = ({
  index,
  data,
  progress,
}: {
  index: number;
  data: (typeof howItWorks)[0];
  progress: MotionValue<number>;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const Icon = data.icon;
  const isLeft = index % 2 === 0;

  const start = index / howItWorks.length;
  const end = (index + 0.6) / howItWorks.length;
  const opacity = useTransform(progress, [start, end], [0.3, 1]);
  const y = useTransform(progress, [start, end], [40, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y }}
      className={`relative grid md:grid-cols-2 gap-6 md:gap-12 items-center ${isLeft ? "" : "md:[direction:rtl]"}`}
    >
      <div className="md:[direction:ltr] space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-5xl md:text-6xl font-bold font-display text-primary/20">{data.step}</span>
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary-foreground" />
          </div>
        </div>
        <h3 className="text-2xl md:text-3xl font-bold font-display">{data.title}</h3>
        <p className="text-muted-foreground leading-relaxed max-w-md">{data.desc}</p>
      </div>

      <div className="md:[direction:ltr]">
        <div className={`rounded-2xl border border-border bg-gradient-to-br ${data.accent} p-5 shadow-lg`}>
          <div className="rounded-xl bg-card border border-border/50 p-5 min-h-[200px]">
            <div className="flex items-center gap-1.5 mb-4">
              <div className="h-2 w-2 rounded-full bg-rose-400" />
              <div className="h-2 w-2 rounded-full bg-amber-400" />
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
            </div>
            <MockScreen type={data.mock} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ArrowConnector = ({
  index,
  progress,
}: {
  index: number;
  progress: MotionValue<number>;
}) => {
  const flip = index % 2 === 0;
  const segStart = (index + 0.5) / howItWorks.length;
  const segEnd = (index + 1) / howItWorks.length;
  const pathLength = useTransform(progress, [segStart, segEnd], [0, 1]);
  const arrowOpacity = useTransform(progress, [segEnd - 0.02, segEnd], [0, 1]);

  // S-curve from right side to left side (or vice versa)
  const d = flip
    ? "M 280 10 C 280 80, 40 80, 40 150"
    : "M 40 10 C 40 80, 280 80, 280 150";
  const arrowX = flip ? 40 : 280;

  return (
    <div className="relative h-32 md:h-40 my-2 hidden md:block" aria-hidden>
      <svg viewBox="0 0 320 160" className="w-full h-full" preserveAspectRatio="none">
        <motion.path
          d={d}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="6 6"
          style={{ pathLength }}
        />
        <motion.g style={{ opacity: arrowOpacity }}>
          <polygon
            points={`${arrowX - 6},145 ${arrowX + 6},145 ${arrowX},156`}
            fill="hsl(var(--primary))"
          />
        </motion.g>
      </svg>
    </div>
  );
};

const WebinarHowItWorksSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 60%"],
  });

  return (
    <section className="py-20 md:py-24">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center flex flex-col items-center"
        >
          <SectionBadge label="How It Works" icon={Zap} />
          <h2 className="text-3xl md:text-4xl font-bold font-display mt-4 mb-3">
            From Registration to
            <br />
            <span className="text-primary">Real Skill in 4 Steps</span>
          </h2>
        </motion.div>

        <div ref={containerRef} className="max-w-5xl mx-auto relative">
          {howItWorks.map((data, i) => (
            <div key={data.step}>
              <StepCard index={i} data={data} progress={scrollYProgress} />
              {i < howItWorks.length - 1 && (
                <ArrowConnector index={i} progress={scrollYProgress} />
              )}
              {i < howItWorks.length - 1 && (
                <div className="flex md:hidden justify-center py-6">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"
                  >
                    <ArrowRight className="h-5 w-5 text-primary rotate-90" />
                  </motion.div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WebinarHowItWorksSection;
