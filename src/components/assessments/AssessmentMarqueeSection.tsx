import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Clock, Users, TrendingUp, ArrowRight, BadgeCheck, ShieldCheck,
  FileText, BarChart3, Target, Flame, Brain, Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionBadge from "@/components/ui/section-badge";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const domains = [
  "All",
  "Software & Tech",
  "Data & Analytics",
  "Marketing",
  "Finance",
  "Design",
  "HR & Operations",
  "AI & ML",
];

const assessments = [
  { name: "Python Developer", domain: "Software & Tech", duration: "60 min", questions: 40, taken: "12,340+", difficulty: "Intermediate", hot: true, icon: "🐍", skills: ["Python", "OOP", "DSA"], passRate: "68%" },
  { name: "React Frontend", domain: "Software & Tech", duration: "55 min", questions: 35, taken: "9,870+", difficulty: "Intermediate", hot: false, icon: "⚛️", skills: ["React", "Hooks", "Redux"], passRate: "72%" },
  { name: "SQL & Database", domain: "Data & Analytics", duration: "45 min", questions: 30, taken: "11,200+", difficulty: "Beginner", hot: true, icon: "🗄️", skills: ["SQL", "Joins", "Indexing"], passRate: "74%" },
  { name: "Digital Marketing", domain: "Marketing", duration: "50 min", questions: 35, taken: "9,780+", difficulty: "Beginner", hot: true, icon: "📣", skills: ["SEO", "Ads", "Analytics"], passRate: "78%" },
  { name: "UI/UX Design", domain: "Design", duration: "45 min", questions: 30, taken: "6,450+", difficulty: "Intermediate", hot: true, icon: "🎨", skills: ["Figma", "UX", "Prototyping"], passRate: "71%" },
  { name: "Financial Analysis", domain: "Finance", duration: "60 min", questions: 40, taken: "6,340+", difficulty: "Advanced", hot: false, icon: "📊", skills: ["Modeling", "Valuation", "Excel"], passRate: "62%" },
  { name: "GenAI & LLMs", domain: "AI & ML", duration: "60 min", questions: 35, taken: "6,780+", difficulty: "Advanced", hot: true, icon: "🤖", skills: ["Prompting", "RAG", "Fine-tuning"], passRate: "58%" },
  { name: "Project Management", domain: "HR & Operations", duration: "50 min", questions: 35, taken: "7,890+", difficulty: "Intermediate", hot: true, icon: "📋", skills: ["Agile", "Scrum", "Risk"], passRate: "76%" },
  { name: "Java Full-Stack", domain: "Software & Tech", duration: "75 min", questions: 50, taken: "8,450+", difficulty: "Advanced", hot: false, icon: "☕", skills: ["Java", "Spring", "APIs"], passRate: "64%" },
  { name: "Data Engineering", domain: "Data & Analytics", duration: "70 min", questions: 40, taken: "5,340+", difficulty: "Advanced", hot: false, icon: "⚙️", skills: ["ETL", "Spark", "Airflow"], passRate: "60%" },
  { name: "Machine Learning", domain: "AI & ML", duration: "90 min", questions: 45, taken: "5,100+", difficulty: "Advanced", hot: true, icon: "🧠", skills: ["Sklearn", "NLP", "Models"], passRate: "55%" },
  { name: "Product Design", domain: "Design", duration: "50 min", questions: 30, taken: "4,120+", difficulty: "Intermediate", hot: false, icon: "✏️", skills: ["Research", "Wireframes", "UI"], passRate: "73%" },
  { name: "SEO Specialist", domain: "Marketing", duration: "40 min", questions: 30, taken: "7,450+", difficulty: "Beginner", hot: false, icon: "🔍", skills: ["On-page", "Technical", "Links"], passRate: "80%" },
  { name: "DevOps & Cloud", domain: "Software & Tech", duration: "65 min", questions: 40, taken: "5,680+", difficulty: "Advanced", hot: false, icon: "☁️", skills: ["AWS", "Docker", "CI/CD"], passRate: "61%" },
  { name: "Deep Learning", domain: "AI & ML", duration: "80 min", questions: 40, taken: "3,890+", difficulty: "Expert", hot: false, icon: "🔬", skills: ["PyTorch", "CNNs", "GANs"], passRate: "48%" },
  { name: "Risk Management", domain: "Finance", duration: "65 min", questions: 40, taken: "4,560+", difficulty: "Intermediate", hot: false, icon: "🛡️", skills: ["Credit", "Market", "Basel"], passRate: "66%" },
];

const difficultyColor: Record<string, string> = {
  Beginner: "text-emerald-600 bg-emerald-50 border-emerald-200",
  Intermediate: "text-amber-600 bg-amber-50 border-amber-200",
  Advanced: "text-red-600 bg-red-50 border-red-200",
  Expert: "text-purple-600 bg-purple-50 border-purple-200",
};

const AssessmentMarqueeSection = () => {
  const [activeDomain, setActiveDomain] = useState("All");

  const filtered = activeDomain === "All"
    ? assessments.slice(0, 8)
    : assessments.filter((a) => a.domain === activeDomain);

  return (
    <section className="py-16 md:py-20" style={{ background: "#F8FAFC" }}>
      <div className="container px-4 md:px-6">
        <div className="text-center mb-8">
          <SectionBadge label="Explore Assessments" icon={TrendingUp} />
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-3">
            Assessments Across <span className="text-primary">Every Industry</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            AI-proctored, industry-benchmarked skill tests trusted by top employers.
          </p>
        </div>

        {/* Domain filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {domains.map((d) => (
            <button
              key={d}
              onClick={() => setActiveDomain(d)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-semibold transition-all border",
                activeDomain === d
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:border-primary/40"
              )}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Assessment cards grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDomain}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {filtered.map((a, i) => (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border bg-white overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer relative"
                style={{ borderColor: "#E2E8F0" }}
              >
                {/* Top accent bar */}
                <div className="h-1 w-full" style={{ background: a.hot ? "#FF8C01" : "#ED2938" }} />

                <div className="p-5">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center text-xl">
                        {a.icon}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold font-display leading-tight group-hover:text-primary transition-colors">{a.name}</h3>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{a.domain}</p>
                      </div>
                    </div>
                    {a.hot && (
                      <span className="flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-[#FF8C01] text-white shrink-0">
                        <Flame className="h-2.5 w-2.5" /> Hot
                      </span>
                    )}
                  </div>

                  {/* Assessment stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="flex flex-col items-center py-2 rounded-lg" style={{ background: "#F8FAFC" }}>
                      <FileText className="h-3.5 w-3.5 text-muted-foreground mb-1" />
                      <span className="text-xs font-bold" style={{ color: "#0f172a" }}>{a.questions}</span>
                      <span className="text-[9px] text-muted-foreground">Questions</span>
                    </div>
                    <div className="flex flex-col items-center py-2 rounded-lg" style={{ background: "#F8FAFC" }}>
                      <Clock className="h-3.5 w-3.5 text-muted-foreground mb-1" />
                      <span className="text-xs font-bold" style={{ color: "#0f172a" }}>{a.duration}</span>
                      <span className="text-[9px] text-muted-foreground">Duration</span>
                    </div>
                    <div className="flex flex-col items-center py-2 rounded-lg" style={{ background: "#F8FAFC" }}>
                      <Target className="h-3.5 w-3.5 text-muted-foreground mb-1" />
                      <span className="text-xs font-bold" style={{ color: "#0f172a" }}>{a.passRate}</span>
                      <span className="text-[9px] text-muted-foreground">Pass Rate</span>
                    </div>
                  </div>

                  {/* Skills tested */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {a.skills.map((s) => (
                      <span key={s} className="text-[10px] font-medium px-2 py-0.5 rounded-full border" style={{ color: "#475569", borderColor: "#E2E8F0", background: "#FFFFFF" }}>
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Bottom row */}
                  <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid #F1F5F9" }}>
                    <div className="flex items-center gap-3">
                      <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border", difficultyColor[a.difficulty])}>
                        {a.difficulty}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Users className="h-3 w-3" /> {a.taken}
                      </span>
                    </div>
                    <span className="flex items-center gap-0.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                      <span className="text-[10px] font-semibold text-primary">Proctored</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="text-center mt-10">
          <Link to="/assessments/explore">
            <Button variant="outline" className="gap-2">
              Browse All Assessments <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AssessmentMarqueeSection;
