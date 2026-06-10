import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Search, SlidersHorizontal, X, MapPin, Briefcase, ChevronDown,
  Code2, BarChart3, Megaphone, Landmark, HeartPulse, Cpu,
  Building2, GraduationCap, Palette, ShoppingCart, Home, Truck, ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Link } from "react-router-dom";
import JobsSocialProof from "@/components/jobs/JobsSocialProof";
import PopularRolesSection from "@/components/jobs/PopularRolesSection";
import JobsBannerTest from "@/components/jobs/JobsBannerTest";
import JobsBannerReadiness from "@/components/jobs/JobsBannerReadiness";
import JobsEventsSection from "@/components/jobs/JobsEventsSection";
import TopCompaniesHiring from "@/components/jobs/TopCompaniesHiring";
import FeaturedCompanies from "@/components/jobs/FeaturedCompanies";
import ResumeToolkitSection from "@/components/jobs/ResumeToolkitSection";

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

const companyLogos = [
  { name: "Google", logo: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" },
  { name: "Microsoft", logo: "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31" },
  { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/200px-Amazon_logo.svg.png" },
  { name: "Accenture", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Accenture.svg/200px-Accenture.svg.png" },
  { name: "IBM", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/200px-IBM_logo.svg.png" },
  { name: "Oracle", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Oracle_logo.svg/200px-Oracle_logo.svg.png" },
  { name: "Infosys", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Infosys_logo.svg/200px-Infosys_logo.svg.png" },
  { name: "TCS", logo: "https://companieslogo.com/img/orig/TCS.NS-7401f1bd.png?t=1720244494" },
  { name: "Capgemini", logo: "https://companieslogo.com/img/orig/CAP.PA-9b4110b0.png?t=1720244491" },
  { name: "Wipro", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Wipro_Primary_Logo_Color_RGB.svg/200px-Wipro_Primary_Logo_Color_RGB.svg.png" },
  { name: "Deloitte", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Deloitte.svg/200px-Deloitte.svg.png" },
  { name: "Cognizant", logo: "https://companieslogo.com/img/orig/CTSH-82a8444b.png?t=1720244491" },
  { name: "SAP", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/SAP_2011_logo.svg/200px-SAP_2011_logo.svg.png" },
  { name: "Adobe", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Adobe_Corporate_Logo.png/200px-Adobe_Corporate_Logo.png" },
  { name: "Salesforce", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/200px-Salesforce.com_logo.svg.png" },
];

const logoRows = [
  companyLogos.slice(0, 5),
  companyLogos.slice(5, 10),
  companyLogos.slice(10, 15),
];

const industries = [
  { icon: Code2, title: "Software & Tech", roles: "120+ roles" },
  { icon: BarChart3, title: "Data & Analytics", roles: "85+ roles" },
  { icon: Megaphone, title: "Marketing & Growth", roles: "60+ roles" },
  { icon: Landmark, title: "Finance & Banking", roles: "70+ roles" },
  { icon: HeartPulse, title: "Healthcare", roles: "55+ roles" },
  { icon: Cpu, title: "AI & Machine Learning", roles: "45+ roles" },
  { icon: Building2, title: "Consulting", roles: "40+ roles" },
  { icon: GraduationCap, title: "Education & EdTech", roles: "35+ roles" },
  { icon: Palette, title: "Design & Creative", roles: "50+ roles" },
  { icon: ShoppingCart, title: "E-commerce & Retail", roles: "45+ roles" },
  { icon: Home, title: "Real Estate", roles: "30+ roles" },
  { icon: Truck, title: "Logistics & Supply Chain", roles: "40+ roles" },
];

const Jobs = () => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const { ref: indRef, isVisible: indVisible } = useScrollAnimation();

  const toggleFilter = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    setList(list.includes(item) ? list.filter(x => x !== item) : [...list, item]);
  };

  return (
    <>
      <Helmet>
        <title>Jobs — I Am Talento</title>
        <meta name="description" content="Find your dream job. AI-powered job matching based on your verified skill profile." />
      </Helmet>
      <Layout>
        {/* Hero Search */}
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
              className="text-muted-foreground text-lg mb-10"
            >
              5 lakh+ jobs for you to explore
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-card rounded-2xl shadow-lg border border-border/50 p-3 md:p-4 flex flex-col md:flex-row items-stretch gap-2 md:gap-0"
            >
              <div className="flex items-center gap-2 flex-1 px-3">
                <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                <Input
                  placeholder="Enter skills / designations / companies"
                  className="border-0 shadow-none focus-visible:ring-0 bg-transparent h-12 text-base"
                />
              </div>
              <div className="hidden md:block w-px bg-border self-stretch my-2" />
              <div className="flex items-center gap-2 flex-1 px-3">
                <Briefcase className="h-4 w-4 text-muted-foreground shrink-0" />
                <Select>
                  <SelectTrigger className="border-0 shadow-none focus:ring-0 bg-transparent h-12 text-base">
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="hidden md:block w-px bg-border self-stretch my-2" />
              <div className="flex items-center gap-2 flex-1 px-3">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <Input
                  placeholder="Enter location"
                  className="border-0 shadow-none focus-visible:ring-0 bg-transparent h-12 text-base"
                />
              </div>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 rounded-xl gap-2 shrink-0 text-base">
                <Search className="h-4 w-4" /> Search
              </Button>
            </motion.div>

            {/* Advanced Search Toggle */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="mt-4 inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {showAdvanced ? "Hide Advanced Search" : "Advanced Search"}
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", showAdvanced && "rotate-180")} />
            </motion.button>

            {/* Advanced Filters */}
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 bg-card rounded-2xl border border-border/50 shadow-md p-6 text-left"
              >
                {/* Industry Filter */}
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

                {/* Tools Filter */}
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

        {/* Social Proof + Logo Marquee */}
        <JobsSocialProof />

        {/* Banner 1 – Take a Test */}
        <JobsBannerTest />


        {/* Featured Companies */}
        <FeaturedCompanies />

        {/* Popular Roles */}
        <PopularRolesSection />

        {/* Resume Toolkit */}
        <ResumeToolkitSection />

        {/* Industries Section */}
        <section ref={indRef} className="py-16 md:py-20 bg-accent/20">
          <div className="container px-4 md:px-6">
            <div className={cn("text-center max-w-2xl mx-auto mb-10 transition-all duration-700", indVisible ? "opacity-100" : "opacity-0 translate-y-8")}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-medium mb-4 border border-primary/10">
                <span className="h-2 w-2 rounded-full bg-primary" /> Browse by Industry
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-3">
                We Speak Your<br />
                <span className="text-primary">Industry's Language</span>
              </h2>
              <p className="text-muted-foreground text-base md:text-lg">
                Discover roles tailored to your domain expertise.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {industries.map(({ icon: Icon, title, roles }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="p-5 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                >
                  <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center mb-3 group-hover:gradient-primary transition-all duration-300">
                    <Icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                  </div>
                  <p className="text-sm font-semibold font-display mb-0.5">{title}</p>
                  <p className="text-xs text-primary font-medium">{roles}</p>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link to="/assessments">
                <Button variant="outline" className="border-border gap-2">
                  Browse all 48+ industries <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Banner 2 – Get Industry Ready */}
        <JobsBannerReadiness />

        {/* Events Section */}
        <JobsEventsSection />
      </Layout>
    </>
  );
};

export default Jobs;
