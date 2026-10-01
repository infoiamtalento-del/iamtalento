import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Target, Heart, Lightbulb, Users, ShieldCheck, Globe } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const values = [
  { icon: ShieldCheck, title: "Fair Hiring", desc: "We build technology that eliminates bias and ensures every candidate is evaluated on merit." },
  { icon: Lightbulb, title: "AI With Purpose", desc: "AI should augment human judgment, not replace it. Every decision is explainable." },
  { icon: Heart, title: "Candidate-First", desc: "Job seekers deserve transparency, fast responses, and genuine career guidance." },
  { icon: Globe, title: "Global Access", desc: "Making world-class hiring tools accessible to companies and talent everywhere." },
];

const team = [
  { name: "Arjun Patel", role: "CEO & Co-Founder", bio: "Former Head of AI at LinkedIn with 15 years building talent platforms that serve 800M+ professionals." },
  { name: "Dr. Maya Singh", role: "CTO & Co-Founder", bio: "PhD in NLP from Stanford. Led the AI fairness team at Google before co-founding Talento." },
  { name: "Rahul Verma", role: "Chief Product Officer", bio: "Previously VP Product at Naukri.com. Built hiring products used by 70M+ job seekers." },
  { name: "Sneha Kapoor", role: "Head of AI Research", bio: "Former Amazon ML scientist. Expert in recommendation systems and bias-free AI models." },
];

const milestones = [
  { year: "2022", event: "Founded with a mission to make AI hiring fair, fast, and accessible for everyone" },
  { year: "2023", event: "Launched AI screening engine — processed 50,000 profiles in first 3 months" },
  { year: "2024", event: "Raised Series A. Onboarded 5,000 employers. Launched custom assessment builder" },
  { year: "2025", event: "500K+ profiles screened. SOC 2 certified. Enterprise tier with human-led AI screening" },
  { year: "2026", event: "12,000+ employers, 100+ HR integrations. Recognized as top AI HR platform by Gartner" },
];

const About = () => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <>
      <Helmet>
        <title>About — I Am Talento | Our Mission & Team</title>
        <meta name="description" content="Learn about I Am Talento's mission to make hiring fair and fast with AI. Meet the team building the future of talent intelligence." />
      </Helmet>
      <Layout>
        <section className="pt-32 pb-16">
          <div className="container text-center max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">About us</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display leading-[1.15] mb-5">
              Making Hiring Fair, Fast<br />
              <span className="text-primary">& Intelligent</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Every person deserves to be evaluated on true potential, and every employer deserves the right talent —<br className="hidden md:block" />
              without bias, delays, or guesswork.
            </p>
          </div>
        </section>

        <section className="pb-24">
          <div className="container">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map(({ icon: Icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-2xl bg-card border border-border/50 text-center hover:shadow-lg hover:border-primary/20 transition-all duration-300"
                >
                  <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold font-display mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-card/50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3">
                Meet the Leaders Building<br /><span className="text-primary">Fairer Hiring</span>
              </h2>
              <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
                Experienced builders, researchers, and operators shaping a more intelligent talent platform —<br className="hidden md:block" />
                united by one clear mission.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map(({ name, role, bio }, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-2xl bg-card border border-border/50 text-center hover:shadow-xl hover:border-primary/20 transition-all duration-300"
                >
                  <div className="h-16 w-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 text-primary-foreground text-xl font-bold">
                    {name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <h3 className="font-semibold font-display">{name}</h3>
                  <p className="text-xs text-primary mb-2">{role}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section ref={ref} className="py-24">
          <div className="container max-w-2xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3">
                From One Bold Idea to<br /><span className="text-primary">A Growing Movement</span>
              </h2>
              <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
                Follow the milestones that turned our mission into a platform trusted by growing teams —<br className="hidden md:block" />
                and ambitious professionals.
              </p>
            </div>
            <div className={cn("space-y-8 transition-all duration-700", isVisible ? "opacity-100" : "opacity-0 translate-y-8")}>
              {milestones.map(({ year, event }, i) => (
                <motion.div
                  key={year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex gap-6 items-start"
                >
                  <div className="flex flex-col items-center">
                    <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">{year}</div>
                    <div className="w-px h-full bg-border min-h-[20px]" />
                  </div>
                  <p className="text-muted-foreground pt-2 leading-relaxed">{event}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default About;
