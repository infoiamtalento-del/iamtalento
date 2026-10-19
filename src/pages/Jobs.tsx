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
import { Link, useNavigate } from "react-router-dom";
import JobsHeroSection from "@/components/landing/JobsHeroSection";
import JobsSocialProof from "@/components/jobs/JobsSocialProof";
import FeaturedCompanies from "@/components/jobs/FeaturedCompanies";
import TopCategoriesSection from "@/components/jobs/TopCategoriesSection";
import FeaturedJobsBanner from "@/components/jobs/FeaturedJobsBanner";
import ExperienceLevelsSection from "@/components/jobs/ExperienceLevelsSection";
import PopularLocationsSection from "@/components/jobs/PopularLocationsSection";
import RemoteJobsSection from "@/components/jobs/RemoteJobsSection";
import JobsEventsSection from "@/components/jobs/JobsEventsSection";
import JobAlertsBanner from "@/components/jobs/JobAlertsBanner";
import JobsSuccessStoriesSection from "@/components/jobs/JobsSuccessStoriesSection";
import JobsFinalCTA from "@/components/jobs/JobsFinalCTA";
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
  const navigate = useNavigate();
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
        <JobsHeroSection />

        {/* Trusted by companies marquee */}
        <JobsSocialProof />

        {/* Top Categories */}
        <TopCategoriesSection />

        {/* Featured Jobs banner (Handpicked Openings from Top Companies) */}
        <FeaturedJobsBanner />

        {/* Featured Companies (Top Employers Prefer Verified Talent) */}
        <FeaturedCompanies />

        {/* Jobs by Experience Level */}
        <ExperienceLevelsSection />

        {/* Popular Job Locations */}
        <PopularLocationsSection />

        {/* Remote Jobs */}
        <RemoteJobsSection />

        {/* Success Stories */}
        <JobsSuccessStoriesSection />

        {/* AI Tools to Get You Hired */}
        <ResumeToolkitSection />

        {/* Get Job Alerts email banner */}
        <JobAlertsBanner />

        {/* Events & Meetups */}
        <JobsEventsSection />
      </Layout>
    </>
  );
};

export default Jobs;
