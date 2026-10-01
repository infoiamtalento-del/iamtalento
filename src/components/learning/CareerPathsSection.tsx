import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Clock, BookOpen, Wrench, Brain, Code, BarChart3, Database, Layers, Cpu, PenTool, Globe, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SectionBadge from "@/components/ui/section-badge";
import { cn } from "@/lib/utils";
import { useState } from "react";

const paths = [
  {
    title: "Full Stack Web Developer",
    duration: "6 months",
    courses: 12,
    learners: "4,200",
    color: "hsl(var(--primary))",
    phases: [
      { label: "Foundation", weeks: "1–4", skills: ["HTML/CSS", "JavaScript", "Git"] },
      { label: "Frontend", weeks: "5–12", skills: ["React", "TypeScript", "Tailwind"] },
      { label: "Backend", weeks: "13–18", skills: ["Node.js", "PostgreSQL", "REST APIs"] },
      { label: "Capstone", weeks: "19–24", skills: ["Full-Stack App", "Deployment", "CI/CD"] },
    ],
    tools: [
      { icon: Code, name: "VS Code" },
      { icon: Globe, name: "React" },
      { icon: Server, name: "Node.js" },
      { icon: Database, name: "PostgreSQL" },
    ],
  },
  {
    title: "Data Scientist",
    duration: "8 months",
    courses: 15,
    learners: "3,800",
    color: "hsl(33, 100%, 50%)",
    phases: [
      { label: "Math & Stats", weeks: "1–6", skills: ["Linear Algebra", "Probability", "Statistics"] },
      { label: "Python & ML", weeks: "7–16", skills: ["Python", "Pandas", "Scikit-learn"] },
      { label: "Deep Learning", weeks: "17–24", skills: ["TensorFlow", "NLP", "Computer Vision"] },
      { label: "Capstone", weeks: "25–32", skills: ["ML Pipeline", "Model Deploy", "Research Paper"] },
    ],
    tools: [
      { icon: BarChart3, name: "Jupyter" },
      { icon: Brain, name: "TensorFlow" },
      { icon: Database, name: "SQL" },
      { icon: Layers, name: "Pandas" },
    ],
  },
  {
    title: "AI & ML Engineer",
    duration: "10 months",
    courses: 18,
    learners: "2,900",
    color: "hsl(var(--primary))",
    phases: [
      { label: "Fundamentals", weeks: "1–8", skills: ["Python", "Math", "Data Structures"] },
      { label: "ML Core", weeks: "9–20", skills: ["Supervised", "Unsupervised", "Feature Eng."] },
      { label: "Advanced AI", weeks: "21–32", skills: ["LLMs", "RAG", "Agents"] },
      { label: "Production", weeks: "33–40", skills: ["MLOps", "Kubernetes", "Monitoring"] },
    ],
    tools: [
      { icon: Cpu, name: "PyTorch" },
      { icon: Brain, name: "LangChain" },
      { icon: Server, name: "Docker" },
      { icon: PenTool, name: "MLflow" },
    ],
  },
];

const CareerPathsSection = () => {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <section className="py-16 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
          <div>
            <SectionBadge label="Career Blueprints" icon={Sparkles} />
            <h2 className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3">
              Ready to Reimagine<br />
              <span className="text-primary">Your Career?</span>
            </h2>
            <p className="text-muted-foreground max-w-lg text-sm">
              Get AI-matched to trending career paths with step-by-step learning roadmaps.
            </p>
          </div>
          <Link to="/learning#courses" className="mt-4 md:mt-0">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              All Career Paths <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="space-y-5">
          {paths.map((p, i) => {
            const isOpen = expanded === i;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setExpanded(isOpen ? null : i)}
                className={cn(
                  "rounded-2xl border bg-card overflow-hidden cursor-pointer transition-all duration-300",
                  isOpen ? "shadow-lg border-primary/30" : "hover:shadow-md hover:border-border"
                )}
              >
                {/* Header */}
                <div className="p-5 md:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="h-10 w-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${p.color}15` }}
                      >
                        <Sparkles className="h-5 w-5" style={{ color: p.color }} />
                      </div>
                      <div>
                        <h3 className="font-bold font-display text-lg">{p.title}</h3>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{p.duration}</span>
                          <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{p.courses} courses</span>
                          <span className="text-primary font-semibold">{p.learners} enrolled</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tools preview */}
                  <div className="flex items-center gap-2">
                    {p.tools.map((t) => (
                      <div
                        key={t.name}
                        className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center"
                        title={t.name}
                      >
                        <t.icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                    <div className={cn(
                      "ml-2 h-8 w-8 rounded-full flex items-center justify-center transition-transform",
                      isOpen ? "rotate-90" : ""
                    )} style={{ backgroundColor: `${p.color}15` }}>
                      <ArrowRight className="h-4 w-4" style={{ color: p.color }} />
                    </div>
                  </div>
                </div>

                {/* Expanded Blueprint Timeline */}
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-dashed border-border"
                  >
                    <div className="p-5 md:p-6">
                      {/* Timeline */}
                      <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute top-5 left-0 right-0 h-[2px] bg-border hidden md:block" />
                        <div
                          className="absolute top-5 left-0 h-[2px] hidden md:block transition-all duration-500"
                          style={{
                            width: "100%",
                            background: `linear-gradient(90deg, ${p.color}, ${p.color}40)`,
                          }}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                          {p.phases.map((phase, pi) => (
                            <motion.div
                              key={phase.label}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: pi * 0.1 }}
                              className="relative"
                            >
                              {/* Node dot */}
                              <div className="hidden md:flex items-center justify-center mb-4">
                                <div
                                  className="h-10 w-10 rounded-full border-2 bg-card flex items-center justify-center z-10 shadow-sm"
                                  style={{ borderColor: p.color }}
                                >
                                  <span className="text-xs font-bold" style={{ color: p.color }}>
                                    {pi + 1}
                                  </span>
                                </div>
                              </div>

                              {/* Phase card */}
                              <div className="rounded-xl border bg-muted/30 p-4 hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-2 mb-2 md:hidden">
                                  <div
                                    className="h-6 w-6 rounded-full border-2 flex items-center justify-center"
                                    style={{ borderColor: p.color }}
                                  >
                                    <span className="text-[10px] font-bold" style={{ color: p.color }}>{pi + 1}</span>
                                  </div>
                                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Phase {pi + 1}</span>
                                </div>
                                <h4 className="font-bold font-display text-sm mb-0.5">{phase.label}</h4>
                                <p className="text-[10px] text-muted-foreground mb-3 flex items-center gap-1">
                                  <Clock className="h-2.5 w-2.5" /> Week {phase.weeks}
                                </p>

                                {/* Skills tags */}
                                <div className="flex flex-wrap gap-1.5">
                                  {phase.skills.map((skill) => (
                                    <span
                                      key={skill}
                                      className="text-[10px] font-medium px-2 py-0.5 rounded-full border"
                                      style={{
                                        borderColor: `${p.color}30`,
                                        backgroundColor: `${p.color}08`,
                                        color: p.color,
                                      }}
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Tools bar */}
                      <div className="mt-5 pt-4 border-t border-dashed border-border flex flex-col sm:flex-row sm:items-center gap-3">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                          <Wrench className="h-3.5 w-3.5" /> Tools & Tech
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {p.tools.map((t) => (
                            <span
                              key={t.name}
                              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-muted border border-border"
                            >
                              <t.icon className="h-3.5 w-3.5 text-muted-foreground" />
                              {t.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CareerPathsSection;
