import { useState } from "react";
import { motion } from "framer-motion";
import {
  Video,
  FileText,
  Layout,
  ClipboardCheck,
  Sparkles,
  Users,
  MessageSquare,
  Bot,
  BookOpenCheck,
  BarChart3,
  Route,
  CalendarClock,
  Award,
  TrendingUp,
  ShieldCheck,
  Play,
} from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";
import productVideo from "@/assets/product-in-60-sec.mp4.asset.json";
import videoThumb from "@/assets/employer-recruiter.jpg";

const learnerUSPs = [
  {
    number: "01",
    icon: Video,
    title: "Mock Interview Videos",
    text: "Learn how to answer real-world interview questions.",
  },
  {
    number: "02",
    icon: FileText,
    title: "Interview Q&A PDF",
    text: "Access curated questions and expert answers.",
  },
  {
    number: "03",
    icon: Layout,
    title: "Blueprints & Templates",
    text: "Use ready-to-apply professional resources.",
  },
  {
    number: "04",
    icon: ClipboardCheck,
    title: "Practice Tests",
    text: "Test your knowledge and identify weak areas.",
  },
  {
    number: "05",
    icon: Sparkles,
    title: "AI Personalisation",
    text: "Get learning recommendations tailored to your needs.",
  },
  {
    number: "06",
    icon: Users,
    title: "Community & Peers",
    text: "Connect, collaborate, and learn with others.",
  },
  {
    number: "07",
    icon: MessageSquare,
    title: "Doubt Resolution",
    text: "Get answers to your learning questions.",
  },
  {
    number: "08",
    icon: Bot,
    title: "AI Learning Assistant",
    text: "Ask questions and get instant explanations while learning.",
  },
  {
    number: "09",
    icon: BookOpenCheck,
    title: "Smart Notes & Summaries",
    text: "Revise key concepts with AI-generated notes.",
  },
  {
    number: "10",
    icon: BarChart3,
    title: "Skill Gap Analysis",
    text: "Discover areas where you need improvement.",
  },
  {
    number: "11",
    icon: Route,
    title: "Personalised Learning Path",
    text: "Follow a learning journey aligned with your goals.",
  },
  {
    number: "12",
    icon: CalendarClock,
    title: "Expert Office Hours",
    text: "Get personalised guidance from industry professionals.",
  },
  {
    number: "13",
    icon: Award,
    title: "Completion Certificate",
    text: "Showcase your course completion and acquired knowledge.",
  },
  {
    number: "14",
    icon: TrendingUp,
    title: "Progress Tracker",
    text: "Monitor your learning progress and performance.",
  },
];

const leftColumnUSPs = learnerUSPs.slice(0, 7);
const rightColumnUSPs = learnerUSPs.slice(7, 14);

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

const WhyChooseLearningSection = () => {
  const [playing, setPlaying] = useState(false);

  return (
    <section
      id="why-learners-choose-us"
      aria-labelledby="learner-benefits-heading"
      className="bg-card py-20 md:py-28"
    >
      <div className="container px-4 md:px-6">
        <motion.div {...reveal} className="mx-auto max-w-3xl text-center">
          <SectionBadge label="Why Learners Choose Us" icon={Award} />
          <h2
            id="learner-benefits-heading"
            className="mb-4 text-3xl md:text-4xl font-bold font-display leading-[1.15]"
          >
            What You Get With<br />
            <span className="text-primary">Every Course</span>
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Fourteen advantages built into every step of your learning journey, from mock interview preparation to AI-powered career guidance.
          </p>
        </motion.div>

        <div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 items-start gap-8 lg:mt-16 lg:grid-cols-12 lg:gap-8 xl:gap-10">
          {/* Left Column — Points 01 to 07 */}
          <ol className="lg:col-span-4 w-full divide-y divide-border border-y border-border">
            {leftColumnUSPs.map(({ number, icon: Icon, title, text }) => (
              <li key={number} className="flex items-start gap-3.5 py-5 sm:gap-4 sm:py-6">
                <span
                  aria-hidden="true"
                  className="pt-0.5 font-display text-xs font-semibold tabular-nums text-muted-foreground/60"
                >
                  {number}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1.5 font-display text-lg font-bold tracking-normal sm:text-xl leading-snug">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {text}
                  </p>
                </div>
                <Icon
                  aria-hidden="true"
                  className="mt-1 h-5 w-5 shrink-0 text-primary"
                />
              </li>
            ))}
          </ol>

          {/* Center Sticky Column — Interactive Video Player */}
          <div className="lg:col-span-4 w-full lg:sticky lg:top-28">
            <div className="relative overflow-hidden rounded-lg border border-border bg-card shadow-md">
              {playing ? (
                <video
                  src={productVideo.url}
                  poster={videoThumb}
                  controls
                  autoPlay
                  playsInline
                  className="aspect-[4/3] w-full object-cover lg:aspect-[4/5]"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  aria-label="Play Why Learners Choose Us video"
                  className="group relative block aspect-[4/3] w-full lg:aspect-[4/5] cursor-pointer"
                >
                  <img
                    src={videoThumb}
                    alt="Learner mastering skills on laptop"
                    className="h-full w-full object-cover"
                    width={1408}
                    height={1056}
                    loading="lazy"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-primary/5 transition group-hover:bg-transparent">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg ring-4 ring-background transition group-hover:scale-105">
                      <Play className="h-6 w-6 translate-x-0.5 text-primary-foreground fill-primary-foreground" />
                    </span>
                  </span>
                </button>
              )}
            </div>

            <div className="mt-6 flex items-start gap-4 border-l-2 border-primary pl-5">
              <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-primary" />
              <p className="font-display text-lg font-semibold leading-snug tracking-normal">
                Learn from Experts. Grow with AI.<br />
                <span className="text-primary">Get Career-Ready.</span>
              </p>
            </div>
          </div>

          {/* Right Column — Points 08 to 14 */}
          <ol start={8} className="lg:col-span-4 w-full divide-y divide-border border-y border-border">
            {rightColumnUSPs.map(({ number, icon: Icon, title, text }) => (
              <li key={number} className="flex items-start gap-3.5 py-5 sm:gap-4 sm:py-6">
                <span
                  aria-hidden="true"
                  className="pt-0.5 font-display text-xs font-semibold tabular-nums text-muted-foreground/60"
                >
                  {number}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1.5 font-display text-lg font-bold tracking-normal sm:text-xl leading-snug">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {text}
                  </p>
                </div>
                <Icon
                  aria-hidden="true"
                  className="mt-1 h-5 w-5 shrink-0 text-primary"
                />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseLearningSection;
