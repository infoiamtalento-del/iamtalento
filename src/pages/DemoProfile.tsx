import { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/layout/ScrollProgress";
import {
  Zap, MapPin, Briefcase, GraduationCap, Code2,
  Award, FolderKanban, BookOpen, Trophy, Heart, Link2,
  ExternalLink, Building2, Pencil,
  ClipboardCheck, Search, Mail, Phone, Globe, Github,
  Linkedin, ChevronRight, Shield, Star, CheckCircle2,
  TrendingUp, Users, Rocket, Laptop, BriefcaseBusiness,
  Brain, Database, Cloud, Layers, MessageSquareQuote,
  ChevronLeft, Image, Sparkles, Target, Wrench, Settings,
  Menu, X, User, LogOut, FileText, Eye,
} from "lucide-react";
import demoAvatar from "@/assets/demo-avatar.jpg";
import demoBannerCard from "@/assets/demo-banner-card.jpg";
import adBanner1 from "@/assets/ad-banner-1.jpg";
import adBanner2 from "@/assets/ad-banner-2.jpg";
import adBanner3 from "@/assets/ad-banner-3.jpg";
import adBanner4 from "@/assets/ad-banner-4.jpg";
import logoAws from "@/assets/logo-aws.svg";
import logoGoogle from "@/assets/logo-google.svg";
import logoMeta from "@/assets/logo-meta.svg";
import { cn } from "@/lib/utils";

// ===== COLOR SYSTEM =====
// Primary (Red #ED2938): Brand, trust/verification, profile header bg, identity sections
// Warning (Orange #FF8C01): IRS score, Open to Work, stats, achievements, CTAs
// Success (Green): Impact metrics only

// ===== DUMMY DATA =====
const profile = {
  full_name: "Arjun Mehta",
  professional_headline: "Senior Full-Stack Engineer · Cloud & AI Specialist",
  job_role: "Software Engineer",
  email: "arjun.mehta@email.com",
  phone: "+91 98765 43210",
  city: "Bangalore",
  state: "Karnataka",
  country: "India",
  company: "TechNova Solutions",
  experience_level: "Senior",
  industry: "Information Technology",
  years_of_experience: 7,
  open_to_work: true,
  verification_status: "verified",
  industry_readiness_score: 87,
  iam_talento_id: "IAT-3F8A2C9D",
  profile_photo_url: demoAvatar,
  about_summary: "Passionate full-stack engineer with 7+ years building scalable web applications and cloud-native solutions. I thrive at the intersection of product thinking and engineering excellence, specializing in React, Node.js, and AWS. My journey began with a fascination for distributed systems during my time at IIT Bombay, where I published research on load balancing algorithms. Since then, I've led engineering teams, architected event-driven microservices serving millions of users, and mentored over a dozen engineers — four of whom were promoted within a year. I'm deeply committed to clean code, developer experience, and building products that make a real impact.",
  career_objective: "Looking to join a product-first company where I can lead engineering initiatives and build impactful products at scale.",
  key_achievements: "Led migration to microservices — 80% faster deploys\nReal-time analytics: 10M+ events/day\nMentored 12 engineers, 4 promoted in 1 year\nSpeaker at ReactConf India 2024",
  employment_type: "full-time",
  availability_status: "Open to Offers",
  notice_period: "30 Days",
  preferred_salary_range: "₹30-45 LPA",
  preferred_locations: ["Bangalore", "Hyderabad", "Remote"],
  areas_of_expertise: ["Cloud Architecture", "Full-Stack Development", "System Design"],
  career_interests: ["AI/ML Products", "Developer Tools", "Platform Engineering"],
  linkedin_url: "https://linkedin.com/in/arjunmehta",
  github_url: "https://github.com/arjunmehta",
  portfolio_url: "https://arjunmehta.dev",
  behance_url: "",
  kaggle_url: "https://kaggle.com/arjunmehta",
};

const experiences = [
  { job_title: "Senior Software Engineer", company_name: "TechNova Solutions", employment_type: "Full-Time", location: "Bangalore", start_date: "2022-03-01", end_date: null, is_current: true, description: "Leading 8 engineers building cloud-native SaaS. Architected event-driven microservices serving 2M+ users.", tools_technologies: ["React", "TypeScript", "Node.js", "AWS", "Kubernetes"], industry: "SaaS / Cloud" },
  { job_title: "Software Engineer II", company_name: "InnovateTech Pvt Ltd", employment_type: "Full-Time", location: "Pune", start_date: "2019-06-15", end_date: "2022-02-28", is_current: false, description: "Built core features for e-commerce platform handling 500Cr+ GMV. Developed real-time inventory system.", tools_technologies: ["React", "Python", "PostgreSQL", "Redis", "Docker"], industry: "E-Commerce" },
  { job_title: "Junior Developer", company_name: "StartupHub", employment_type: "Full-Time", location: "Mumbai", start_date: "2017-07-01", end_date: "2019-05-30", is_current: false, description: "Developed responsive web apps for early-stage startups. Contributed to 3 product launches.", tools_technologies: ["JavaScript", "React", "Node.js", "MongoDB"], industry: "Startup Studio" },
];

const educations = [
  { institution_name: "IIT Bombay", degree: "B.Tech", field_of_study: "Computer Science & Engineering", start_year: 2013, end_year: 2017, grade: "8.7 CGPA", description: "Distributed systems & ML focus. Published research on load balancing algorithms.", activities: "Coding Club President, Hackathon Organizer" },
  { institution_name: "BITS Pilani", degree: "M.Tech", field_of_study: "Data Science & AI", start_year: 2020, end_year: 2022, grade: "9.1 CGPA", description: "Part-time program focused on deep learning, NLP, and scalable ML pipelines.", activities: "Published paper on transformer-based text classification" },
  { institution_name: "Delhi Public School, R.K. Puram", degree: "Class XII (CBSE)", field_of_study: "Science (PCM)", start_year: 2011, end_year: 2013, grade: "96.4%", description: "National Science Olympiad Gold Medalist. JEE Advanced AIR 342.", activities: "Science Club Lead, Math Olympiad Team" },
];

const skills = [
  { skill_name: "React", category: "Frontend", proficiency_level: "Expert", is_verified: true, years_of_experience: 6, logo: "https://cdn.simpleicons.org/react/61DAFB" },
  { skill_name: "TypeScript", category: "Frontend", proficiency_level: "Expert", is_verified: true, years_of_experience: 5, logo: "https://cdn.simpleicons.org/typescript/3178C6" },
  { skill_name: "Next.js", category: "Frontend", proficiency_level: "Advanced", is_verified: false, years_of_experience: 3, logo: "https://cdn.simpleicons.org/nextdotjs/000000" },
  { skill_name: "Tailwind CSS", category: "Frontend", proficiency_level: "Advanced", is_verified: false, years_of_experience: 3, logo: "https://cdn.simpleicons.org/tailwindcss/06B6D4" },
  { skill_name: "Node.js", category: "Backend", proficiency_level: "Expert", is_verified: true, years_of_experience: 6, logo: "https://cdn.simpleicons.org/nodedotjs/5FA04E" },
  { skill_name: "Python", category: "Backend", proficiency_level: "Advanced", is_verified: false, years_of_experience: 4, logo: "https://cdn.simpleicons.org/python/3776AB" },
  { skill_name: "PostgreSQL", category: "Backend", proficiency_level: "Advanced", is_verified: true, years_of_experience: 5, logo: "https://cdn.simpleicons.org/postgresql/4169E1" },
  { skill_name: "GraphQL", category: "Backend", proficiency_level: "Intermediate", is_verified: false, years_of_experience: 2, logo: "https://cdn.simpleicons.org/graphql/E10098" },
  { skill_name: "AWS", category: "Cloud & DevOps", proficiency_level: "Expert", is_verified: true, years_of_experience: 5, logo: "https://cdn.simpleicons.org/amazonwebservices/FF9900" },
  { skill_name: "Docker", category: "Cloud & DevOps", proficiency_level: "Advanced", is_verified: false, years_of_experience: 4, logo: "https://cdn.simpleicons.org/docker/2496ED" },
  { skill_name: "Kubernetes", category: "Cloud & DevOps", proficiency_level: "Intermediate", is_verified: false, years_of_experience: 2, logo: "https://cdn.simpleicons.org/kubernetes/326CE5" },
  { skill_name: "System Design", category: "Architecture", proficiency_level: "Expert", is_verified: true, years_of_experience: 5, logo: "https://cdn.simpleicons.org/diagramsdotnet/F08705" },
];

const domainTools = [
  { name: "AWS Lambda", category: "Cloud", level: "Expert", logo: "https://cdn.simpleicons.org/amazonwebservices/FF9900" },
  { name: "AWS S3 / CloudFront", category: "Cloud", level: "Expert", logo: "https://cdn.simpleicons.org/amazonwebservices/569A31" },
  { name: "Terraform", category: "IaC", level: "Advanced", logo: "https://cdn.simpleicons.org/terraform/844FBA" },
  { name: "Kubernetes (EKS)", category: "Orchestration", level: "Intermediate", logo: "https://cdn.simpleicons.org/kubernetes/326CE5" },
  { name: "Kafka", category: "Messaging", level: "Advanced", logo: "https://cdn.simpleicons.org/apachekafka/231F20" },
  { name: "Elasticsearch", category: "Search", level: "Intermediate", logo: "https://cdn.simpleicons.org/elasticsearch/005571" },
  { name: "Redis", category: "Caching", level: "Expert", logo: "https://cdn.simpleicons.org/redis/DC382D" },
  { name: "Datadog", category: "Monitoring", level: "Advanced", logo: "https://cdn.simpleicons.org/datadog/632CA6" },
];

const generalTools = [
  { name: "VS Code", category: "IDE", level: "Expert", logo: "https://cdn.simpleicons.org/vscodium/007ACC" },
  { name: "Git / GitHub", category: "Version Control", level: "Expert", logo: "https://cdn.simpleicons.org/github/181717" },
  { name: "Jira", category: "Project Mgmt", level: "Advanced", logo: "https://cdn.simpleicons.org/jira/0052CC" },
  { name: "Figma", category: "Design", level: "Intermediate", logo: "https://cdn.simpleicons.org/figma/F24E1E" },
  { name: "Postman", category: "API Testing", level: "Expert", logo: "https://cdn.simpleicons.org/postman/FF6C37" },
  { name: "Notion", category: "Documentation", level: "Advanced", logo: "https://cdn.simpleicons.org/notion/000000" },
  { name: "Slack", category: "Communication", level: "Expert", logo: "https://cdn.simpleicons.org/slack/4A154B" },
  { name: "CI/CD (GitHub Actions)", category: "DevOps", level: "Advanced", logo: "https://cdn.simpleicons.org/githubactions/2088FF" },
];

const certifications = [
  { name: "AWS Solutions Architect – Pro", issuing_organization: "Amazon Web Services", issue_date: "2023-06-15", credential_id: "AWS-SAP-2023-4521", verification_status: "verified", color: "bg-warning", logo: logoAws },
  { name: "GCP Professional Data Engineer", issuing_organization: "Google Cloud", issue_date: "2023-01-10", credential_id: "GCP-PDE-78321", verification_status: "verified", color: "bg-primary", logo: logoGoogle },
  { name: "Meta Front-End Developer", issuing_organization: "Meta (Coursera)", issue_date: "2022-08-20", credential_id: "META-FED-2022", verification_status: "unverified", color: "bg-warning", logo: logoMeta },
];

const projects = [
  { title: "CloudSync – Real-time Collaboration", role_in_project: "Lead Engineer", description: "Real-time collaboration tool with conflict resolution & live cursors. 50K+ concurrent users.", impact: "40% fewer support tickets, 65% more engagement", tools_technologies: ["React", "WebSockets", "CRDT", "AWS Lambda"], project_url: "https://cloudsync.technova.io" },
  { title: "AI Resume Parser", role_in_project: "Solo Developer", description: "Open-source tool extracting structured data from resumes using NLP. 94% accuracy.", impact: "1.2K GitHub stars, 50+ recruiters", tools_technologies: ["Python", "spaCy", "FastAPI", "Tesseract"], project_url: "https://github.com/arjunmehta/ai-resume-parser" },
];

const courses = [
  { name: "ML Specialization", platform: "Coursera (Stanford)", skills_learned: ["ML", "Neural Networks", "TensorFlow"], icon: Brain, gradient: "from-warning to-orange-600" },
  { name: "System Design for Interviews", platform: "Educative.io", skills_learned: ["System Design", "Scalability"], icon: Layers, gradient: "from-primary to-red-700" },
  { name: "Advanced TypeScript", platform: "Frontend Masters", skills_learned: ["TypeScript", "Generics"], icon: Code2, gradient: "from-warning to-amber-600" },
];

const achievements = [
  { title: "Speaker — ReactConf India 2024", icon: Star, description: "'Scaling React: 1K to 1M Users' — 800+ attendees", endorsement: "Brilliant talk, one of the best sessions!", endorser: "Priya Sharma, Engineering Director @ Flipkart" },
  { title: "1st Place — HackBangalore 2022", icon: Trophy, description: "Built FinTrack in 48h, beat 200+ teams", endorsement: "Arjun's team delivered an exceptional product.", endorser: "Vikram Patel, CTO @ StartupHub" },
  { title: "Employee of the Quarter Q3 2023", icon: Award, description: "Led CloudSync launch ahead of schedule", endorsement: "Consistently exceeds expectations. A true leader.", endorser: "Nisha Rao, VP Engineering @ TechNova" },
  { title: "React Core Contributor", icon: Code2, description: "Perf optimizations to reconciliation algo", endorsement: "High-quality contributions to the core library.", endorser: "Dan A., React Core Team" },
];

const volunteer = [
  { role: "Mentor", organization: "Code for India", cause: "Education", description: "20+ workshops, 300+ students in web dev", gradient: "from-primary to-red-700", icon: Users },
  { role: "Tech Lead", organization: "NGO Tech Connect", cause: "Technology Access", description: "Free inventory system for 15 local NGOs", gradient: "from-warning to-orange-600", icon: Heart },
];

const formatDate = (d: string | null) => {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const locationParts = [profile.city, profile.state, profile.country].filter(Boolean);
const proficiencyOrder: Record<string, number> = { Expert: 0, Advanced: 1, Intermediate: 2, Beginner: 3 };
const sortedSkills = [...skills].sort((a, b) => (proficiencyOrder[a.proficiency_level] ?? 4) - (proficiencyOrder[b.proficiency_level] ?? 4));
const groupedSkills: Record<string, typeof skills> = sortedSkills.reduce((acc, s) => {
  const cat = s.category || "General";
  if (!acc[cat]) acc[cat] = [];
  acc[cat].push(s);
  return acc;
}, {} as Record<string, typeof skills>);

const statItems = [
  { icon: Briefcase, label: "Experience", value: `${profile.years_of_experience} Years` },
  { icon: FolderKanban, label: "Projects", value: `${projects.length} Shipped` },
  { icon: Award, label: "Certifications", value: `${certifications.length} Earned` },
  { icon: Users, label: "Mentored", value: "12 Engineers" },
];

const bannerAds = [
  { headline: "Upskill with IAmTalento", sub: "Get certified in AI, Cloud & DevOps — 50% off this month", cta: "Explore Courses", img: adBanner1, dark: false },
  { headline: "Hiring? Post for Free", sub: "Reach 10,000+ verified professionals instantly", cta: "Post a Job", img: adBanner2, dark: false },
  { headline: "AI Resume Review", sub: "Get instant feedback & boost your Industry Readiness Score", cta: "Try Now", img: adBanner3, dark: true },
  { headline: "Premium Membership", sub: "Unlimited assessments, priority matching & dedicated support", cta: "Go Premium", img: adBanner4, dark: true },
];

const toolLevelColor: Record<string, string> = {
  Expert: "bg-warning/10 border-warning/25 text-warning",
  Advanced: "bg-primary/8 border-primary/20 text-primary",
  Intermediate: "bg-muted border-border text-muted-foreground",
};

const navLinks = [
  { label: "Jobs", href: "/jobs" },
  { label: "Assessments", href: "/assessments" },
  { label: "Learning", href: "/learning" },
  { label: "Pricing", href: "/pricing" },
  { label: "Meetups", href: "/meetups" },
  { label: "Resources", href: "/resources" },
];

const ABOUT_TRUNCATE_LENGTH = 200;

const DemoProfile = () => {
  const [isFreelancer, setIsFreelancer] = useState(false);
  const [lookingForJob, setLookingForJob] = useState(true);
  const [notifIndex, setNotifIndex] = useState(0);
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const volunteerScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setNotifIndex((prev) => (prev + 1) % bannerAds.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollVolunteer = (dir: "left" | "right") => {
    if (volunteerScrollRef.current) {
      volunteerScrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
    }
  };

  const aboutText = profile.about_summary;
  const shouldTruncateAbout = aboutText.length > ABOUT_TRUNCATE_LENGTH;

  return (
    <>
      <Helmet>
        <title>Arjun Mehta — Demo Profile — IAmTalento</title>
        <meta name="description" content="Demo profile showing a fully completed IAmTalento candidate profile." />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <ScrollProgress />

        {/* Custom Navbar with profile icon instead of login/for employers */}
        <header
          className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
            scrolled ? "bg-background/95 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
          )}
        >
          <nav className="container flex items-center" aria-label="Main navigation">
            <Link to="/" className="flex items-center gap-2 group mr-auto" aria-label="IAmTalento Home">
              <img src="/logo.png" alt="IAmTalento" className="h-9 w-auto" />
            </Link>

            {/* Desktop */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="px-3.5 py-2 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-accent/50"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-border">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 focus:outline-none">
                      <Avatar className="h-9 w-9 ring-2 ring-warning/40 hover:ring-warning/70 transition-all cursor-pointer">
                        <AvatarImage src={demoAvatar} alt={profile.full_name} className="object-cover" />
                        <AvatarFallback className="text-xs font-bold bg-primary text-primary-foreground">AM</AvatarFallback>
                      </Avatar>
                      <ChevronRight className="h-3.5 w-3.5 rotate-90 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 p-0 bg-popover border shadow-xl rounded-xl overflow-hidden z-[100]">
                    <div className="p-4 border-b border-border bg-accent/30">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 ring-2 ring-warning/30">
                          <AvatarImage src={demoAvatar} alt={profile.full_name} className="object-cover" />
                          <AvatarFallback className="text-sm font-bold bg-primary text-primary-foreground">AM</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-bold font-display truncate">{profile.full_name}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{profile.professional_headline}</p>
                        </div>
                      </div>
                      <Link to="/my-profile">
                        <Button variant="outline" size="sm" className="w-full mt-3 h-8 text-xs font-semibold rounded-full border-primary/30 text-primary hover:bg-primary/5">
                          View Profile
                        </Button>
                      </Link>
                    </div>
                    <div className="py-1.5">
                      <DropdownMenuItem asChild className="px-4 py-2.5 cursor-pointer gap-3 text-sm">
                        <Link to="/profile-builder"><Pencil className="h-4 w-4 text-muted-foreground" /> Edit Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="px-4 py-2.5 cursor-pointer gap-3 text-sm">
                        <Link to="/assessments"><ClipboardCheck className="h-4 w-4 text-muted-foreground" /> My Assessments</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="px-4 py-2.5 cursor-pointer gap-3 text-sm">
                        <Link to="/jobs"><Briefcase className="h-4 w-4 text-muted-foreground" /> Job Matches</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="px-4 py-2.5 cursor-pointer gap-3 text-sm">
                        <Link to="/learning"><BookOpen className="h-4 w-4 text-muted-foreground" /> Learning</Link>
                      </DropdownMenuItem>
                    </div>
                    <DropdownMenuSeparator />
                    <div className="py-1.5">
                      <DropdownMenuItem className="px-4 py-2.5 cursor-pointer gap-3 text-sm text-destructive focus:text-destructive">
                        <LogOut className="h-4 w-4" /> Sign Out
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Mobile toggle */}
            <div className="lg:hidden flex items-center gap-2">
              <Link to="/my-profile" className="block">
                <Avatar className="h-8 w-8 ring-2 ring-warning/40">
                  <AvatarImage src={demoAvatar} alt={profile.full_name} className="object-cover" />
                  <AvatarFallback className="text-xs font-bold bg-primary text-primary-foreground">AM</AvatarFallback>
                </Avatar>
              </Link>
              <button
                className="p-2 rounded-lg hover:bg-accent transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </nav>

          {/* Mobile menu */}
          {mobileOpen && (
            <div className="lg:hidden bg-background/95 backdrop-blur-md border-t border-border mt-2 animate-fade-in">
              <div className="container py-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="px-4 py-3 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </header>

        {/* Spacer for fixed navbar */}
        <div className="pt-24">
          {/* PROFILE HEADER + BANNER CARD */}
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-[1fr_340px] gap-6">
              {/* Left: Profile Header */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border-2 border-border/60 bg-card shadow-[0_2px_12px_-2px_rgba(0,0,0,0.08)] overflow-hidden">
                <div className="bg-card p-6 sm:p-8 lg:p-10">
                  <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
                    {/* Avatar */}
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="relative shrink-0">
                      <Avatar className="h-36 w-36 sm:h-40 sm:w-40 ring-[6px] ring-warning/50 shadow-lg border-4 border-card">
                        <AvatarImage src={demoAvatar} alt={profile.full_name} className="object-cover" />
                        <AvatarFallback className="text-3xl font-bold bg-primary text-primary-foreground">AM</AvatarFallback>
                      </Avatar>
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.6, type: "spring" }}
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-warning text-warning-foreground text-[10px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1"
                      >
                        <Zap className="h-3 w-3" />
                        OPEN TO WORK
                      </motion.div>
                    </motion.div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 pt-1">
                      <h1 className="text-3xl sm:text-4xl font-bold font-display tracking-tight">{profile.full_name}</h1>
                      <p className="text-base text-muted-foreground mt-1.5">{profile.professional_headline}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{locationParts.join(", ")}</span>
                        <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{profile.company}</span>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant="secondary" className="text-[11px]">{profile.experience_level}</Badge>
                        <Badge variant="outline" className="text-[11px]">{profile.industry}</Badge>
                        <Badge variant="outline" className="text-[11px] border-warning/30 text-warning">{profile.availability_status}</Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{profile.email}</span>
                        <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{profile.phone}</span>
                        <span className="flex items-center gap-1.5 font-mono text-primary font-semibold"><Zap className="h-3.5 w-3.5" />{profile.iam_talento_id}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right: Auto-playing Banner Ad */}
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4 }} className="shrink-0">
                <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden h-full flex flex-col w-72">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={notifIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex flex-col flex-1"
                    >
                      <div className="h-36 overflow-hidden">
                        <img src={bannerAds[notifIndex].img} alt={bannerAds[notifIndex].headline} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-medium mb-1">Sponsored</p>
                        <h3 className="text-sm font-bold font-display leading-tight">{bannerAds[notifIndex].headline}</h3>
                        <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{bannerAds[notifIndex].sub}</p>
                        <button className="mt-3 self-start text-[11px] font-semibold text-primary-foreground bg-primary rounded-lg px-3.5 py-1.5 hover:opacity-90 transition-opacity">
                          {bannerAds[notifIndex].cta} →
                        </button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                  <div className="flex gap-1.5 py-3 justify-center bg-card">
                    {bannerAds.map((_, i) => (
                      <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === notifIndex ? "w-5 bg-primary" : "w-1.5 bg-muted-foreground/15"}`} />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* VERIFIED BADGE */}
          <div className="max-w-6xl mx-auto px-4 md:px-6 mt-4">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="rounded-2xl border bg-card p-5 flex items-center gap-4"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold font-display">IAmTalento Verified Professional</h3>
                  <Badge className="bg-primary text-primary-foreground text-[10px] gap-1"><CheckCircle2 className="h-2.5 w-2.5" />Verified</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Identity, skills, and credentials independently verified through our trust framework.</p>
              </div>
              <div className="hidden sm:flex items-center gap-4 shrink-0">
                <div className="text-center">
                  <p className="text-lg font-bold font-display text-primary">{skills.filter(s => s.is_verified).length}</p>
                  <p className="text-[9px] text-muted-foreground">Skills Verified</p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="text-center">
                  <p className="text-lg font-bold font-display text-primary">{certifications.filter(c => c.verification_status === "verified").length}</p>
                  <p className="text-[9px] text-muted-foreground">Certs Verified</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* MAIN CONTENT */}
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
            <div className="grid lg:grid-cols-[1fr_380px] gap-6">
              {/* LEFT COLUMN */}
              <div className="space-y-5">
                {/* About with Read More */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border bg-card p-6">
                  <div className="flex items-center gap-2.5 mb-3">
                    <Zap className="h-4 w-4 text-primary" />
                    <h2 className="text-sm font-bold font-display">About</h2>
                  </div>
                  <div className="text-sm text-muted-foreground leading-relaxed">
                    {shouldTruncateAbout && !aboutExpanded
                      ? <>
                          {aboutText.slice(0, ABOUT_TRUNCATE_LENGTH)}...
                          <button onClick={() => setAboutExpanded(true)} className="text-primary font-medium ml-1 hover:underline">Read more</button>
                        </>
                      : <>
                          {aboutText}
                          {shouldTruncateAbout && (
                            <button onClick={() => setAboutExpanded(false)} className="text-primary font-medium ml-1 hover:underline">Show less</button>
                          )}
                        </>
                    }
                  </div>
                  <div className="mt-4 p-4 rounded-xl bg-muted/30 border">
                    <p className="text-[11px] font-semibold text-primary mb-1 flex items-center gap-1"><Rocket className="h-3 w-3" /> Career Objective</p>
                    <p className="text-xs text-muted-foreground">{profile.career_objective}</p>
                  </div>
                </motion.div>

                {/* Experience */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl border bg-card p-6">
                  <div className="flex items-center gap-2.5 mb-5">
                    <Briefcase className="h-4 w-4 text-primary" />
                    <h2 className="text-sm font-bold font-display">Experience</h2>
                    <Badge variant="secondary" className="text-[10px] ml-auto">{profile.years_of_experience} Years</Badge>
                  </div>
                  <div className="relative">
                    <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border" />
                    <div className="space-y-6">
                      {experiences.map((exp, i) => (
                        <div key={i} className="relative flex gap-4">
                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 z-10 ${exp.is_current ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                            <Building2 className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0 pb-1">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="text-sm font-semibold">{exp.job_title}</h3>
                                <p className="text-xs text-muted-foreground">{exp.company_name} · {exp.location}</p>
                              </div>
                              <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">
                                {formatDate(exp.start_date)} — {exp.is_current ? <span className="text-primary font-semibold">Present</span> : formatDate(exp.end_date)}
                              </span>
                            </div>
                            <Badge variant="outline" className="text-[9px] mt-1.5 border-warning/25 bg-warning/5 text-warning font-medium gap-1">
                              <Layers className="h-2.5 w-2.5" />{exp.industry}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{exp.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {exp.tools_technologies.map((t, j) => <Badge key={j} variant="outline" className="text-[10px]">{t}</Badge>)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Education — after Experience */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border bg-card p-6">
                  <div className="flex items-center gap-2.5 mb-4">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    <h2 className="text-sm font-bold font-display">Education</h2>
                  </div>
                  <div className="space-y-5">
                    {educations.map((edu, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="h-12 w-12 rounded-xl bg-background border border-border flex items-center justify-center shrink-0">
                          <GraduationCap className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold">{edu.institution_name}</h3>
                          <p className="text-xs text-muted-foreground">{edu.degree} — {edu.field_of_study}</p>
                          <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground">
                            <span>{edu.start_year} — {edu.end_year}</span>
                            <Badge variant="outline" className="text-[10px]">{edu.grade}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">{edu.description}</p>
                          {edu.activities && <p className="text-[11px] text-primary mt-1 font-medium">{edu.activities}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* ACHIEVEMENTS & ENDORSEMENTS — after Education */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="rounded-2xl border bg-card p-6">
                  <div className="flex items-center gap-2.5 mb-4">
                    <Trophy className="h-4 w-4 text-warning" />
                    <h2 className="text-sm font-bold font-display">Achievements & Awards</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {achievements.map((a, i) => (
                      <motion.div key={i} whileHover={{ y: -2 }} className="rounded-xl border p-5 hover:shadow-md transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-warning/5 rounded-bl-[40px]" />
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center shrink-0">
                            <a.icon className="h-5 w-5 text-warning" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-xs font-bold leading-tight">{a.title}</h3>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{a.description}</p>
                          </div>
                        </div>
                        <div className="bg-muted/40 rounded-lg p-3 border-l-2 border-warning/40">
                          <div className="flex gap-2">
                            <MessageSquareQuote className="h-4 w-4 text-warning/60 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-[11px] text-foreground/80 italic leading-relaxed">"{a.endorsement}"</p>
                              <p className="text-[10px] text-muted-foreground font-medium mt-1.5">— {a.endorser}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* CERTIFICATIONS — after Achievements */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border bg-card p-6">
                  <div className="flex items-center gap-2.5 mb-4">
                    <Award className="h-4 w-4 text-warning" />
                    <h2 className="text-sm font-bold font-display">Certifications</h2>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {certifications.map((cert, i) => (
                      <motion.div key={i} whileHover={{ y: -3 }} className="rounded-xl border overflow-hidden hover:shadow-md transition-all group">
                        <div className={`${cert.color} h-24 flex items-center justify-center relative`}>
                          <img src={cert.logo} alt={cert.issuing_organization} className="h-10 object-contain brightness-0 invert" />
                          {cert.verification_status === "verified" && (
                            <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm rounded-full p-1">
                              <CheckCircle2 className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="text-xs font-bold leading-tight">{cert.name}</h3>
                          <p className="text-[10px] text-muted-foreground mt-1">{cert.issuing_organization}</p>
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-[9px] text-muted-foreground">{formatDate(cert.issue_date)}</span>
                            {cert.verification_status === "verified" && (
                              <Badge className="text-[9px] bg-primary/10 text-primary border-primary/20 gap-0.5"><CheckCircle2 className="h-2.5 w-2.5" />Verified</Badge>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Projects */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="rounded-2xl border bg-card p-6">
                  <div className="flex items-center gap-2.5 mb-4">
                    <FolderKanban className="h-4 w-4 text-warning" />
                    <h2 className="text-sm font-bold font-display">Projects</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {projects.map((proj, i) => (
                      <motion.div key={i} whileHover={{ y: -2 }} className="rounded-xl border p-4 group hover:border-warning/30 hover:shadow-sm transition-all">
                        <div className="flex items-start justify-between">
                          <h3 className="text-sm font-semibold leading-tight">{proj.title}</h3>
                          {proj.project_url && (
                            <a href={proj.project_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-warning transition-colors" />
                            </a>
                          )}
                        </div>
                        <p className="text-[10px] text-warning font-medium mt-1">{proj.role_in_project}</p>
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{proj.description}</p>
                        <div className="mt-2 p-2 rounded-lg bg-success/5 border border-success/10">
                          <p className="text-[10px] text-success font-medium flex items-center gap-1"><TrendingUp className="h-3 w-3" />{proj.impact}</p>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {proj.tools_technologies.map((t, j) => <Badge key={j} variant="secondary" className="text-[9px]">{t}</Badge>)}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* GENERAL TOOLS — flowing pill/tag layout */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }} className="rounded-2xl border bg-card p-6">
                  <div className="flex items-center gap-2.5 mb-5">
                    <Settings className="h-4 w-4 text-primary" />
                    <h2 className="text-sm font-bold font-display">General Tools & Expertise</h2>
                    <span className="text-[10px] text-muted-foreground ml-auto">{generalTools.length} tools</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {generalTools.map((t, i) => {
                      const isExpert = t.level === "Expert";
                      const isAdvanced = t.level === "Advanced";
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + i * 0.04 }}
                          whileHover={{ scale: 1.04 }}
                          className={cn(
                            "inline-flex items-center gap-2 rounded-full pl-1 pr-3.5 py-1 transition-all cursor-default",
                            isExpert ? "bg-warning/8 ring-1 ring-warning/20" :
                            isAdvanced ? "bg-primary/6 ring-1 ring-primary/15" :
                            "bg-muted/60 ring-1 ring-border"
                          )}
                        >
                          <span className={cn(
                            "h-6 w-6 rounded-full flex items-center justify-center shrink-0",
                            isExpert ? "bg-warning/10" :
                            isAdvanced ? "bg-primary/8" :
                            "bg-muted"
                          )}>
                            <img src={t.logo} alt={t.name} className="h-3.5 w-3.5 object-contain" />
                          </span>
                          <span className="text-[11px] font-medium">{t.name}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* DOMAIN-SPECIFIC TOOLS — flowing pill/tag layout */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-2xl border bg-card p-6">
                  <div className="flex items-center gap-2.5 mb-5">
                    <Wrench className="h-4 w-4 text-warning" />
                    <h2 className="text-sm font-bold font-display">Domain-Specific Tools</h2>
                    <span className="text-[10px] text-muted-foreground ml-auto">{domainTools.length} tools</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {domainTools.map((t, i) => {
                      const isExpert = t.level === "Expert";
                      const isAdvanced = t.level === "Advanced";
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + i * 0.04 }}
                          whileHover={{ scale: 1.04 }}
                          className={cn(
                            "inline-flex items-center gap-2 rounded-full pl-1 pr-3.5 py-1 transition-all cursor-default",
                            isExpert ? "bg-warning/8 ring-1 ring-warning/20" :
                            isAdvanced ? "bg-primary/6 ring-1 ring-primary/15" :
                            "bg-muted/60 ring-1 ring-border"
                          )}
                        >
                          <span className={cn(
                            "h-6 w-6 rounded-full flex items-center justify-center shrink-0",
                            isExpert ? "bg-warning/10" :
                            isAdvanced ? "bg-primary/8" :
                            "bg-muted"
                          )}>
                            <img src={t.logo} alt={t.name} className="h-3.5 w-3.5 object-contain" />
                          </span>
                          <span className="text-[11px] font-medium">{t.name}</span>
                          <span className="text-[9px] text-muted-foreground">{t.category}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* COURSES */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }} className="rounded-2xl border bg-card p-6">
                  <div className="flex items-center gap-2.5 mb-4">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <h2 className="text-sm font-bold font-display">Courses</h2>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {courses.map((c, i) => (
                      <motion.div key={i} whileHover={{ y: -3 }} className="rounded-xl border overflow-hidden hover:shadow-md transition-all group">
                        <div className={`bg-gradient-to-br ${c.gradient} h-28 flex items-center justify-center relative`}>
                          <c.icon className="h-10 w-10 text-white/90" />
                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/30 to-transparent h-12" />
                          <Badge className="absolute bottom-2 left-2 text-[9px] bg-white/20 text-white border-white/20 backdrop-blur-sm">
                            {c.platform}
                          </Badge>
                        </div>
                        <div className="p-4">
                          <h3 className="text-xs font-bold leading-tight">{c.name}</h3>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {c.skills_learned.map((s, j) => <Badge key={j} variant="outline" className="text-[9px]">{s}</Badge>)}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* RIGHT SIDEBAR */}
              <div className="space-y-5">
                {/* Work Preferences */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="rounded-2xl border bg-card p-5">
                  <h3 className="text-sm font-bold font-display mb-4 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-warning" />
                    Work Preferences
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl border hover:shadow-sm transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors ${isFreelancer ? 'bg-warning text-warning-foreground' : 'bg-muted text-muted-foreground'}`}>
                          <Laptop className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold">I'm a Freelancer</p>
                          <p className="text-[10px] text-muted-foreground">Available for contract work</p>
                        </div>
                      </div>
                      <Switch checked={isFreelancer} onCheckedChange={setIsFreelancer} />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl border hover:shadow-sm transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors ${lookingForJob ? 'bg-warning text-warning-foreground' : 'bg-muted text-muted-foreground'}`}>
                          <BriefcaseBusiness className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold">Looking for Job</p>
                          <p className="text-[10px] text-muted-foreground">Actively seeking opportunities</p>
                        </div>
                      </div>
                      <Switch checked={lookingForJob} onCheckedChange={setLookingForJob} />
                    </div>
                  </div>
                </motion.div>

                {/* SKILLS */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                  className="rounded-2xl border bg-card p-5"
                >
                  <div className="flex items-center gap-2.5 mb-4">
                    <Code2 className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-bold font-display">Skills</h3>
                    <Badge variant="secondary" className="text-[9px] ml-auto">{skills.length} Total</Badge>
                  </div>
                  <div className="space-y-4">
                    {Object.entries(groupedSkills).map(([cat, catSkills]) => (
                      <div key={cat}>
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">{cat}</p>
                        <div className="space-y-2.5">
                          {catSkills.map((s, i) => {
                            const barWidth = s.proficiency_level === "Expert" ? "100%" : s.proficiency_level === "Advanced" ? "75%" : s.proficiency_level === "Intermediate" ? "50%" : "25%";
                            const barColor = s.proficiency_level === "Expert" ? "bg-warning/50" : s.proficiency_level === "Advanced" ? "bg-primary/50" : "bg-muted-foreground/20";
                            const textColor = s.proficiency_level === "Expert" ? "text-warning" : s.proficiency_level === "Advanced" ? "text-primary" : "text-muted-foreground";
                            return (
                              <div key={i}>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-[11px] font-medium flex items-center gap-1.5">
                                    <img src={s.logo} alt={s.skill_name} className="h-3.5 w-3.5 object-contain" />
                                    {s.skill_name}
                                    {s.is_verified && <Shield className="h-3 w-3 text-primary" />}
                                  </span>
                                  <span className={`text-[9px] font-semibold ${textColor}`}>{s.proficiency_level}</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                  <motion.div initial={{ width: 0 }} animate={{ width: barWidth }} transition={{ duration: 0.8, delay: 0.2 + i * 0.04 }} className={`h-full rounded-full ${barColor}`} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Links */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="rounded-2xl border bg-card p-5">
                  <div className="flex items-center gap-2.5 mb-3">
                    <Link2 className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-bold font-display">Links</h3>
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { icon: Linkedin, label: "LinkedIn", url: profile.linkedin_url },
                      { icon: Github, label: "GitHub", url: profile.github_url },
                      { icon: Globe, label: "Portfolio", url: profile.portfolio_url },
                      { icon: Globe, label: "Kaggle", url: profile.kaggle_url },
                    ].filter(l => l.url).map((link, i) => (
                      <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2.5 p-2 rounded-lg text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
                      >
                        <link.icon className="h-4 w-4" />
                        <span>{link.label}</span>
                        <ExternalLink className="h-3 w-3 ml-auto" />
                      </a>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default DemoProfile;
