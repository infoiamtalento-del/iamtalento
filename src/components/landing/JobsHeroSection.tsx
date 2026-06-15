import { useState } from "react";
import { Search, SlidersHorizontal, X, MapPin, Briefcase, ChevronDown, Code2, Building2, FileBarChart, ShieldCheck, Target, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const experienceOptions = ["Fresher", "1-3 years", "3-5 years", "5-10 years", "10+ years"];

const industryFilters = [
  "Software & Tech", "Data & Analytics", "Marketing & Growth", "Finance & Banking",
  "Healthcare", "AI & Machine Learning", "Consulting", "Education & EdTech",
  "Design & Creative", "E-commerce & Retail", "Real Estate", "Logistics & Supply Chain",
];

const toolFilters = [
  "React", "Python", "AWS", "Figma", "Tableau", "SQL", "Node.js", "Docker",
  "Kubernetes", "TensorFlow", "Salesforce", "Excel", "Jira", "Sketch", "Power BI", "Spark",
];

const JobsHeroSection = () => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);

  const toggleFilter = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    setList(list.includes(item) ? list.filter(x => x !== item) : [...list, item]);
  };

  return (
    <section className="pt-32 pb-16 md:pt-44 md:pb-24 bg-accent/30 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-warning/5 blur-[80px]" />
      </div>
      <div className="container text-center max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold font-display mb-3"
        >
          Find Your<br />
          <span className="text-primary">Dream Job Now</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto"
        >
          Explore 5 lakh+ jobs from top companies and take the next step in your career.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-10"
        >
          {[
            { icon: ShieldCheck, title: "Verified Jobs", sub: "100% genuine opportunities" },
            { icon: Target, title: "Personalized Matches", sub: "Jobs that match your skills" },
            { icon: TrendingUp, title: "Your Career Edge", sub: "Insights to grow faster" },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3 text-left">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm font-semibold">{title}</div>
                <div className="text-xs text-muted-foreground">{sub}</div>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-card rounded-2xl shadow-lg border border-border/50 p-3 md:p-4 flex flex-col md:flex-row items-stretch gap-2 md:gap-0"
        >
          <div className="flex items-center gap-3 flex-1 px-3 text-left">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Search className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold">What</div>
              <Input
                placeholder="Skills, roles, designations or company"
                className="border-0 shadow-none focus-visible:ring-0 bg-transparent h-7 px-0 text-sm text-muted-foreground"
              />
            </div>
          </div>
          <div className="hidden md:block w-px bg-border self-stretch my-2" />
          <div className="flex items-center gap-3 flex-1 px-3 text-left">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold">Experience</div>
              <Select>
                <SelectTrigger className="border-0 shadow-none focus:ring-0 bg-transparent h-7 px-0 text-sm text-muted-foreground">
                  <SelectValue placeholder="Select experience" />
                </SelectTrigger>
                <SelectContent>
                  {experienceOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="hidden md:block w-px bg-border self-stretch my-2" />
          <div className="flex items-center gap-3 flex-1 px-3 text-left">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold">Location</div>
              <Input
                placeholder="Enter location"
                className="border-0 shadow-none focus-visible:ring-0 bg-transparent h-7 px-0 text-sm text-muted-foreground"
              />
            </div>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8 rounded-xl gap-2 shrink-0 text-base">
            <Search className="h-4 w-4" /> Search Jobs
          </Button>
        </motion.div>


        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 flex flex-wrap items-center justify-center gap-3"
        >
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {showAdvanced ? "Hide Advanced Search" : "Advanced Search"}
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", showAdvanced && "rotate-180")} />
          </button>
          <span className="hidden sm:inline text-muted-foreground/40">|</span>
          <Link
            to="/assessments"
            className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 hover:underline"
          >
            <FileBarChart className="h-4 w-4" />
            Get Your Career Intelligence Report
          </Link>
        </motion.div>

        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 bg-card rounded-2xl border border-border/50 shadow-md p-6 text-left"
          >
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" /> Industry
              </h3>
              <div className="flex flex-wrap gap-2">
                {industryFilters.map(ind => (
                  <button
                    key={ind}
                    onClick={() => toggleFilter(ind, selectedIndustries, setSelectedIndustries)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200",
                      selectedIndustries.includes(ind)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border text-muted-foreground hover:border-primary/40"
                    )}
                  >
                    {ind}
                    {selectedIndustries.includes(ind) && <X className="h-3 w-3 inline ml-1" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Code2 className="h-4 w-4 text-warning" /> Tools & Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {toolFilters.map(tool => (
                  <button
                    key={tool}
                    onClick={() => toggleFilter(tool, selectedTools, setSelectedTools)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200",
                      selectedTools.includes(tool)
                        ? "bg-warning text-white border-warning"
                        : "bg-card border-border text-muted-foreground hover:border-warning/40"
                    )}
                  >
                    {tool}
                    {selectedTools.includes(tool) && <X className="h-3 w-3 inline ml-1" />}
                  </button>
                ))}
              </div>
            </div>

            {(selectedIndustries.length > 0 || selectedTools.length > 0) && (
              <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {selectedIndustries.length + selectedTools.length} filter(s) selected
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setSelectedIndustries([]); setSelectedTools([]); }}
                  className="text-xs text-primary"
                >
                  Clear all
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default JobsHeroSection;
