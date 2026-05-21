import { ArrowRight, Award, CheckCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const points = [
  "Skill Assessment",
  "AI Resume Builder",
  "AI Video Resumes",
  "Practice Tests",
  "Apply 100+ Jobs in One Go",
];

const JobsBannerTest = () => (
  <motion.section
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="py-4 md:py-6"
  >
    <div className="container px-4 md:px-6">
      <div className="relative overflow-hidden rounded-2xl bg-primary px-8 py-8 md:px-12 md:py-10">
        <div className="absolute top-0 right-0 w-60 h-60 rounded-full bg-white/10 -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 right-1/3 w-32 h-32 rounded-full bg-white/5 translate-y-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
              <Award className="h-5 w-5 text-primary-foreground" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold font-display text-primary-foreground mb-1">
              Unlock Better Opportunities<br />
              <span className="text-white/90 inline-flex items-center gap-2">with Verified Badge <ShieldCheck className="h-6 w-6 inline text-white" /></span>
            </h3>
            <p className="text-sm md:text-base text-white/80 font-medium mb-3">Get Hired 5x Faster</p>
            <ul className="flex flex-wrap gap-3 mt-2">
              {points.map((p) => (
                <li key={p} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 text-sm font-semibold text-white shadow-sm">
                  <CheckCircle className="h-4 w-4 text-[hsl(33,100%,50%)] shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <Link to="/assessments" className="shrink-0">
            <Button className="bg-white text-primary hover:bg-white/90 gap-2 font-semibold">
              Take a Skill Test <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </motion.section>
);

export default JobsBannerTest;
