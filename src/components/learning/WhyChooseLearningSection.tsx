import { useState } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  BadgeCheck,
  Bot,
  Clock,
  Users,
  Briefcase,
  PlayCircle,
  Sparkles,
  ShieldCheck,
  Award,
  Play,
} from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";
import productVideo from "@/assets/product-in-60-sec.mp4.asset.json";
import videoThumb from "@/assets/employer-recruiter.jpg";

const learnerUSPs = [
  {
    icon: Wallet,
    title: "Affordable Learning",
    text: "Expert knowledge without the hefty price tag, giving you high-ROI access to industry-grade education.",
  },
  {
    icon: BadgeCheck,
    title: "Verified Mentors",
    text: "Learn from trusted industry professionals with proven track records and real workplace experience.",
  },
  {
    icon: Bot,
    title: "AI Learning Companion",
    text: "Your doubts answered while you learn with instant contextual explanations, summaries, and practice quizzes.",
  },
  {
    icon: Clock,
    title: "Learn Anytime",
    text: "Flexible learning on your schedule so you can upskill at your own pace without rigid deadlines.",
  },
  {
    icon: Users,
    title: "1:1 Expert Sessions",
    text: "Personalised guidance when you need it through live one-to-one consultations with domain experts.",
  },
  {
    icon: Briefcase,
    title: "Real-World Knowledge",
    text: "Practical skills beyond theory focused on real industry workflows, case studies, and execution.",
  },
  {
    icon: PlayCircle,
    title: "On-Demand Courses",
    text: "Learn whenever and wherever you want with seamless access across desktop, tablet, and mobile.",
  },
  {
    icon: Sparkles,
    title: "Personalised Learning",
    text: "A learning experience built around you that adapts to your skill gaps and career goals.",
  },
];

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

const WhyChooseLearningSection = () => {
  const [playing, setPlaying] = useState(false);

  return (
    <section aria-labelledby="learner-benefits-heading" className="bg-card py-20 md:py-28">
      <div className="container px-4 md:px-6">
        <motion.div {...reveal} className="mx-auto max-w-3xl text-center">
          <SectionBadge label="Why Learners Choose Us" icon={Award} />
          <h2
            id="learner-benefits-heading"
            className="mb-4 text-3xl md:text-4xl font-bold font-display leading-[1.15]"
          >
            Everything You Need<br />
            <span className="text-primary">To Learn With Confidence.</span>
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Eight advantages built into every step of your learning journey, from recorded expert lessons to 1:1 mentorship.
          </p>
        </motion.div>

        <div className="mx-auto mt-12 flex max-w-6xl flex-col items-start gap-8 lg:mt-16 lg:flex-row lg:gap-16">
          {/* Left Sticky Column — Interactive Video Player with Clean Photo Thumbnail */}
          <div className="w-full lg:sticky lg:top-28 lg:w-[45%] lg:shrink-0">
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
              <p className="font-display text-xl font-semibold leading-snug tracking-normal">
                Learn from Experts. Grow with AI.<br />
                <span className="text-primary">Get Ahead in Your Career.</span>
              </p>
            </div>
          </div>

          {/* Right Column — Numbered Editorial USP List */}
          <ol className="w-full divide-y divide-border border-y border-border">
            {learnerUSPs.map(({ icon: Icon, title, text }, index) => (
              <li key={title} className="flex items-start gap-4 py-6 sm:gap-6 sm:py-7">
                <span
                  aria-hidden="true"
                  className="pt-1 font-display text-sm font-semibold tabular-nums text-muted-foreground/60"
                >
                  0{index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-2 font-display text-xl font-bold tracking-normal sm:text-2xl">
                    {title}
                  </h3>
                  <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                    {text}
                  </p>
                </div>
                <Icon
                  aria-hidden="true"
                  className="mt-1 h-5 w-5 shrink-0 text-primary sm:h-6 sm:w-6"
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
