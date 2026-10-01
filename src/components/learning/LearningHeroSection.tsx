import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Globe, Award, Cpu, CheckCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SectionBadge from "@/components/ui/section-badge";
import { Input } from "@/components/ui/input";


const trustItems = [
  { icon: Globe, label: "5+ Languages" },
  { icon: Cpu, label: "Real Projects" },
  { icon: Award, label: "Verified Certificates" },
  { icon: CheckCircle, label: "AI-Powered" },
];

const LearningHeroSection = () => (
  <section className="pt-28 pb-12 md:pt-40 md:pb-16 relative overflow-hidden bg-accent/30">
    <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl -z-10" />
    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[hsl(33,100%,50%)]/5 blur-3xl -z-10" />

    <div className="container px-4 md:px-6">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex flex-col items-center text-center">
        <SectionBadge label="Learning Platform" icon={BookOpen} />
        <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold font-display mb-4 leading-[1.1]">
          Learn Skills That<br />
          <span className="text-primary">Get You Hired</span>
        </h1>
        <p className="text-base md:text-lg text-muted-foreground mb-6 max-w-2xl">
          <span className="block">Build practical, job-ready skills through courses shaped for real work.</span>
          <span className="block">Learn by doing, not just watching.</span>
        </p>

        <div className="relative mb-6 w-full max-w-xl md:max-w-2xl lg:max-w-3xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="What do you want to learn?" className="pl-10 h-12 rounded-xl border-2 focus:border-primary text-sm" />
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <Link to="/learning#courses">
            <Button size="lg" className="bg-[hsl(33,100%,50%)] text-white hover:bg-[hsl(33,100%,45%)] border-0 gap-2">
              Explore Courses <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/learning#path">
            <Button size="lg" variant="outline" className="gap-2">View My Learning Path</Button>
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {trustItems.map((t) => (
            <div key={t.label} className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <t.icon className="h-3.5 w-3.5 text-primary" />
              {t.label}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default LearningHeroSection;
