import { motion } from "framer-motion";
import { ArrowRight, Check, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import SectionBadge from "@/components/ui/section-badge";
import freeFeaturesVisual from "@/assets/free-features-visual.jpg";

const features = [
  { title: "AI Resume Builder", tagline: "Build a Resume That Gets Noticed." },
  { title: "AI Tools Course", tagline: "Master AI. Upgrade Your Career." },
  { title: "AI Skill Upgrade Alerts", tagline: "Know What to Learn Next." },
  { title: "AI Career Copilot", tagline: "Your AI Partner for Career Success." },
  { title: "AI Career Path Finder", tagline: "Discover Your Ideal Career Path." },
  { title: "AI Skill Gap Analyzer", tagline: "Identify Gaps. Build Skills. Get Hired." },
  { title: "AI Job Match Score", tagline: "Know Your Fit Before You Apply." },
  { title: "AI Salary Predictor", tagline: "Discover Your Market Worth." },
  { title: "AI Job Application Tracker", tagline: "Track Every Application. Stay Ahead." },
  { title: "AI Job Description Decoder", tagline: "Understand Every Job Requirement." },
  { title: "AI Communication Coach", tagline: "Speak with Confidence. Stand Out." },
  { title: "AI Salary Negotiation Coach", tagline: "Negotiate Smarter. Earn Better." },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const FreeFeaturesSection = () => {
  return (
    <section className="py-20 md:py-24 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <SectionBadge label="Premium Features @ Zero Cost" icon={Gift} />
          <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight leading-[1.15]">
            12 Reasons Every Job Seeker
            <br />
            <span className="text-primary">Needs Talent CIR</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Your all-in-one AI career platform to build skills, strengthen your profile, discover opportunities, and get
            job-ready.
          </p>
        </div>

        {/* Unified boxed card */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative max-w-6xl mx-auto overflow-hidden rounded-[2.5rem] border bg-card shadow-elegant"
        >
          <div className="flex flex-col lg:flex-row">
            {/* Left: heading + 12-feature grid */}
            <div className="flex-1 p-8 md:p-12 lg:p-14">
              <h3 className="text-3xl md:text-4xl font-bold font-display leading-[1.1] tracking-tight text-foreground">
                Upload Your Resume Today.
                <br />
                <span className="text-primary">Get Discovered Tomorrow.</span>
              </h3>

              <motion.ul
                role="list"
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                className="mt-9 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5"
              >
                {features.map(({ title, tagline }) => (
                  <motion.li
                    key={title}
                    variants={item}
                    className="group flex items-start gap-3 cursor-default"
                  >
                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 transition-colors duration-300 group-hover:bg-primary">
                      <Check
                        className="h-3.5 w-3.5 text-primary transition-colors duration-300 group-hover:text-primary-foreground"
                        strokeWidth={3}
                      />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[15px] font-semibold leading-snug text-foreground">
                        {title}
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {tagline}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            </div>

            {/* Right: photo panel with glass overlay */}
            <div className="relative min-h-[380px] overflow-hidden lg:w-[40%]">
              <img
                src={freeFeaturesVisual}
                alt="Professional showing his Talent CIR career profile on a tablet"
                width={1024}
                height={1024}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 hover:scale-[1.03]"
              />
              {/* Bottom edge fade using mask-image per sitewide zero-gradients rule */}
              <div className="absolute inset-x-0 bottom-0 h-44 bg-black/50 [mask-image:linear-gradient(to_top,black_30%,transparent)]" />

              <div className="absolute bottom-7 left-7 right-7">
                <div className="rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 p-5 backdrop-blur-md">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-foreground/20">
                      <Check className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="leading-tight">
                      <p className="font-display text-lg font-bold text-primary-foreground">
                        Profile Completed
                      </p>
                      <p className="text-sm text-primary-foreground/85">
                        Ready for top recruiters
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA banner */}
          <div className="relative overflow-hidden bg-primary px-8 py-6 md:px-14 lg:px-16">
            <div className="pointer-events-none absolute right-0 top-0 h-full w-64 translate-x-1/2 rounded-full bg-primary-glow/25 blur-3xl" />
            <div className="relative flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="text-center md:text-left">
                <h4 className="font-display text-xl font-bold tracking-tight text-white md:text-2xl">
                  All of this. Zero cost.
                </h4>
                <p className="mt-0.5 text-sm text-primary-foreground/85">
                  No hidden fees, no subscriptions. Ever.
                </p>
              </div>
              <Link
                to="/auth"
                className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-background px-7 py-3 text-base font-bold text-primary shadow-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl"
              >
                Create your job profile now
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FreeFeaturesSection;
