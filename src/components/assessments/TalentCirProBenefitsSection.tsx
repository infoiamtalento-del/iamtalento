import { motion } from "framer-motion";
import {
  FileBarChart2,
  CheckCircle2,
  Target,
  Code2,
  Users,
  Award,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SectionBadge from "@/components/ui/section-badge";
import { cn } from "@/lib/utils";

const benefits = [
  {
    num: "01",
    title: "AI-Powered CIR Report",
    text: "Discover your career potential with a personalized Industry Readiness Score and career intelligence insights.",
    icon: FileBarChart2,
    cta: "Explore Report",
    href: "/assessments/digital-marketing-fundamentals",
  },
  {
    num: "02",
    title: "4 Core Skill Assessments",
    text: "Test your aptitude, reasoning, communication, and essential workplace skills.",
    icon: CheckCircle2,
    cta: "View Core Tests",
    href: "/assessments/digital-marketing-fundamentals",
  },
  {
    num: "03",
    title: "1 Domain-Specific Assessment",
    text: "Validate your industry knowledge and showcase your expertise in your chosen domain.",
    icon: Target,
    cta: "Choose Domain",
    href: "/assessments/explore",
  },
  {
    num: "04",
    title: "Exclusive Hackathon Entry",
    text: "Compete, showcase your talent, solve real-world challenges, and get noticed by employers.",
    icon: Code2,
    cta: "View Hackathons",
    href: "/hackathon3",
  },
  {
    num: "05",
    title: "Premium Networking Event Pass",
    text: "Connect with industry leaders, recruiters, professionals, and potential employers.",
    icon: Users,
    cta: "Explore Events",
    href: "/networking",
  },
  {
    num: "06",
    title: "Verified Talent Badge",
    text: "Earn your digital credibility badge and make your skills stand out to recruiters.",
    icon: Award,
    cta: "Get Verified",
    href: "/pricing?tab=candidates",
  },
];

const TalentCirProBenefitsSection = () => {
  return (
    <section className="py-20 md:py-28 bg-white/70 border-y border-slate-200/80">
      <div className="container px-4 md:px-6">
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <SectionBadge label="TALENT CIR PRO" icon={Sparkles} />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display leading-[1.12] text-slate-950 mb-5 tracking-tight">
            Unlock 6 Exclusive Benefits with<br />
            <span className="text-primary">Talent CIR Pro – Just ₹1,999</span>
          </h2>
          <p
            className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-4"
            style={{ textWrap: "balance" }}
          >
            One investment. Six career advantages. Enjoy 12 months of AI tools, skill assessments,
            verified credentials, and exclusive opportunities with Talent CIR Pro.
          </p>
          <p className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-[0.14em]">
            More than an assessment. Your complete career advantage.
          </p>
        </div>

        {/* 6-Card Grid matching Product Ecosystem structure */}
        <div className="mx-auto grid max-w-7xl border-l border-t border-slate-200/90 sm:grid-cols-2 lg:grid-cols-3 bg-white shadow-sm rounded-2xl overflow-hidden">
          {benefits.map(({ num, title, text, icon: Icon, cta, href }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className={cn(
                "group flex flex-col justify-between border-b border-r border-slate-200/90 p-8 md:p-10 transition-colors hover:bg-[#FBF4EB]/40",
                i === 0 && "bg-[#FBF4EB]/20"
              )}
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <p className="text-sm font-bold tracking-[0.16em] text-primary">{num}</p>
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="mb-4 font-display text-2xl font-bold leading-tight text-slate-950">
                  {title}
                </h3>
                <p className="text-sm md:text-base leading-relaxed text-slate-600">
                  {text}
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-100">
                <Button
                  asChild
                  variant="link"
                  className="h-auto justify-start gap-2 p-0 text-sm md:text-base font-semibold text-primary"
                >
                  <Link to={href}>
                    {cta}{" "}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTAs */}
        <div className="mt-12 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="h-12 px-8 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold gap-2 shadow-sm"
          >
            <Link to="/pricing?tab=candidates">
              Unlock Talent CIR Pro – ₹1,999 <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 px-7 rounded-xl bg-white border-slate-300 text-slate-900 hover:bg-slate-50 font-bold gap-2"
          >
            <Link to="/assessments/digital-marketing-fundamentals">
              Explore All Assessments
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TalentCirProBenefitsSection;
