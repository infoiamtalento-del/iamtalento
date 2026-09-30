import { motion } from "framer-motion";
import { ArrowRight, Check, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import SectionBadge from "@/components/ui/section-badge";
import freeFeaturesVisual from "@/assets/free-features-visual.jpg";

const features = [
  "Industry Experts Resume Database",
  "AI-Powered Resume Builder and Grader",
  "Real-Time Job Market Insight Alerts",
  "Skill-Based Automated Job Matching",
  "Application Tracking & Follow-Up",
  "Digital Portfolio with Custom URL",
  "Free Access to AI Learning Courses",
  "Freelancing & Gig Opportunities",
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const FreeFeaturesSection = () => {
  return (
    <section className="py-20 md:py-24 bg-gradient-to-b from-background via-accent/30 to-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <SectionBadge label="Unlock 8 FREE Career Benefits" icon={Gift} />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display tracking-tight leading-[1.15]">
            Your Job Hunt Gets Smarter
            <br />
            <span className="text-primary">With I Am Talento</span>
          </h2>
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
            {/* Left: heading + feature grid */}
            <div className="flex-1 p-8 md:p-12 lg:p-16">
              <h3 className="text-3xl md:text-4xl font-bold font-display leading-[1.1] tracking-tight text-foreground">
                Upload Your Resume Today.
                <br />
                <span className="text-primary">Get Discovered Tomorrow.</span>
              </h3>

              <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6"
              >
                {features.map((title) => (
                  <motion.div
                    key={title}
                    variants={item}
                    className="group flex items-start gap-3 cursor-default"
                  >
                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 transition-colors duration-300 group-hover:bg-primary">
                      <Check className="h-3.5 w-3.5 text-primary transition-colors duration-300 group-hover:text-primary-foreground" strokeWidth={3} />
                    </span>
                    <p className="text-[15px] font-medium leading-snug text-foreground/80 transition-colors duration-300 group-hover:text-foreground">
                      {title}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Right: photo panel with glass overlay */}
            <div className="relative min-h-[380px] overflow-hidden lg:w-[42%]">
              <img
                src={freeFeaturesVisual}
                alt="Professional showing his IAmTalento career profile on a tablet"
                width={1024}
                height={1024}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 hover:scale-[1.03]"
              />
              {/* Bottom fade so the glass card sits cleanly */}
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/45 via-black/15 to-transparent" />

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
