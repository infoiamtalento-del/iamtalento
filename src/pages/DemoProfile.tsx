import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/layout/ScrollProgress";
import {
  MapPin, Briefcase, Code2, Award, Trophy, Star,
  ExternalLink, Pencil, ClipboardCheck, Mail, Phone, Globe, Github,
  Linkedin, ChevronRight, CheckCircle2, Crown, ArrowRight, Clock,
  Users, BookOpen, Menu, X, LogOut, FileText, Share2, BarChart3,
  Quote, Circle,
} from "lucide-react";
import demoAvatar from "@/assets/demo-avatar.jpg";
import logoAws from "@/assets/logo-aws.svg";
import logoGoogle from "@/assets/logo-google.svg";
import logoMeta from "@/assets/logo-meta.svg";
import { cn } from "@/lib/utils";

// ===== DUMMY DATA =====
const profile = {
  full_name: "Arjun Mehta",
  professional_headline: "Senior Full-Stack Engineer",
  sub_headline: "Cloud & AI Specialist",
  email: "arjun.mehta@email.com",
  phone: "+91 98765 43210",
  location: "Bangalore, India",
  years_of_experience: 7,
  profile_photo_url: demoAvatar,
  about_summary:
    "Passionate full-stack engineer with 7+ years building scalable web applications and cloud-native solutions. I thrive at the intersection of product thinking and engineering excellence, specializing in creating impactful, user-centric products.",
  tags: ["Full-Stack", "Cloud Native", "AI/ML", "System Design"],
};

const experiences = [
  { job_title: "Senior Software Engineer", company_name: "TechNova Solutions", location: "Bangalore", period: "Mar 2022 – Present", description: "Leading a 6+ engineer team building cloud-native SaaS. Architected event-driven microservices serving 2M+ users.", tools: ["React", "TypeScript", "Node.js", "AWS", "Kubernetes"] },
  { job_title: "Software Engineer II", company_name: "InnovateTech Pvt. Ltd.", location: "Pune", period: "Jan 2018 – Feb 2022", description: "Built core features for a commerce platform handling 500Cr+ GMV.", tools: ["React", "Python", "PostgreSQL", "Redis", "Docker"] },
  { job_title: "Junior Developer", company_name: "StartupHub", location: "Mumbai", period: "Jul 2017 – May 2018", description: "Developed responsive web apps for early-stage startups.", tools: ["JavaScript", "React", "Node.js", "MongoDB"] },
];

const educations = [
  { institution_name: "IIT Bombay", degree: "B.Tech – Computer Science & Engineering", years: "2013 – 2017", grade: "8.7 CGPA", note: "Coding Club President, Hackathon Organizer" },
  { institution_name: "BITS Pilani", degree: "M.Tech – Data Science & AI", years: "2019 – 2021", grade: "9.1 CGPA", note: "Thesis: Deep learning for time series forecasting\nPublished paper on transformer-based text classification" },
  { institution_name: "Delhi Public School, RK Puram", degree: "Class XII (CBSE – Science PCM)", years: "2011 – 2013", grade: "96%", note: "Science Club Lead, Math Olympiad Team" },
];

const topSkills = [
  { name: "React", level: "Expert", pct: 95, color: "hsl(var(--primary))" },
  { name: "TypeScript", level: "Expert", pct: 92, color: "hsl(var(--warning))" },
  { name: "Node.js", level: "Advanced", pct: 82, color: "hsl(var(--primary))" },
  { name: "Tailwind CSS", level: "Advanced", pct: 78, color: "hsl(var(--primary) / 0.7)" },
  { name: "Next.js", level: "Advanced", pct: 74, color: "hsl(var(--warning))" },
  { name: "AWS", level: "Intermediate", pct: 62, color: "hsl(var(--primary) / 0.55)" },
];

const projects = [
  { title: "CloudSync – Real-time Collaboration", role: "Lead Engineer", description: "Real-time collaboration tool with conflict resolution & live cursors.", tools: ["React", "WebSocket", "AWS", "CRDT"] },
  { title: "AI Resume Parser", role: "Solo Developer", description: "Open-source tool extracting structured data from resumes using NLP.", tools: ["Python", "spaCy", "Flask", "Tesseract"] },
];

const achievements = [
  { title: "Speaker — ReactConf India 2024", description: "\"Scaling React to 1M Users\"", icon: Trophy },
  { title: "1st Place — HackBangalore 2022", description: "Built FinKids – A finance app for teens", icon: Star },
  { title: "Employee of the Quarter Q3 2023", description: "Awarded for outstanding contributions", icon: Star },
  { title: "React Core Contributor", description: "Merged 5+ PRs in react-icons repo", icon: Award },
];

const certifications = [
  { name: "AWS Solutions Architect – Pro", org: "Amazon Web Services", date: "Jan 2025", logo: logoAws },
  { name: "GCP Professional Data Engineer", org: "Google Cloud", date: "Jan 2025", logo: logoGoogle },
  { name: "Meta Front-End Developer", org: "Meta (Coursera)", date: "Aug 2022", logo: logoMeta },
];

const tools = [
  "VS Code", "Git / GitHub", "Jira", "Figma",
  "Postman", "Notion", "Slack", "CI/CD",
  "Docker", "Kubernetes", "AWS", "Linux",
];

const primaryLinks = [
  { label: "LinkedIn", icon: Linkedin, url: "https://linkedin.com/in/arjunmehta" },
  { label: "GitHub", icon: Github, url: "https://github.com/arjunmehta" },
  { label: "Portfolio", icon: Globe, url: "https://arjunmehta.dev" },
  { label: "Kaggle", icon: BarChart3, url: "https://kaggle.com/arjunmehta" },
];

const additionalLinks = [
  { label: "Resume (PDF)", icon: FileText, url: "#" },
  { label: "Portfolio Website", icon: Globe, url: "#" },
  { label: "Blog / Articles", icon: BookOpen, url: "#" },
  { label: "LeetCode Profile", icon: Code2, url: "#" },
];

const stats = [
  { value: "6", label: "Skills Verified" },
  { value: "2", label: "Certifications" },
  { value: "20+", label: "Projects" },
  { value: "7+", label: "Years Experience" },
];

const navLinks = [
  { label: "Jobs", href: "/jobs" },
  { label: "Assessments", href: "/assessments" },
  { label: "Learning", href: "/learning" },
  { label: "Pricing", href: "/pricing" },
  { label: "Meetups", href: "/meetups" },
  { label: "Resources", href: "/resources" },
];

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-[11px] font-bold font-display tracking-[0.14em] uppercase text-muted-foreground mb-4">
    {children}
  </h2>
);

const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn("rounded-2xl border border-border/70 bg-card p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]", className)}>
    {children}
  </div>
);

const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="px-2.5 py-1 rounded-md bg-secondary text-[11px] font-medium text-muted-foreground">
    {children}
  </span>
);

const ViewAll = ({ label }: { label: string }) => (
  <button className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:gap-2.5 transition-all">
    {label} <ArrowRight className="h-3.5 w-3.5" />
  </button>
);

const DemoProfile = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Helmet>
        <title>Arjun Mehta — Demo Profile — IAmTalento</title>
        <meta name="description" content="Demo profile showing a fully completed IAmTalento candidate profile." />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-secondary/40">
        <ScrollProgress />

        {/* Navbar */}
        <header
          className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
            scrolled ? "bg-background/95 backdrop-blur-md shadow-sm py-3" : "bg-background/70 backdrop-blur-sm py-4"
          )}
        >
          <nav className="container flex items-center" aria-label="Main navigation">
            <Link to="/" className="flex items-center gap-2 group mr-auto" aria-label="IAmTalento Home">
              <img src="/logo.png" alt="I Am Talento" className="h-16 w-auto object-contain" />
            </Link>

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
                      <Avatar className="h-9 w-9 ring-2 ring-primary/30 hover:ring-primary/60 transition-all cursor-pointer">
                        <AvatarImage src={demoAvatar} alt={profile.full_name} className="object-cover" />
                        <AvatarFallback className="text-xs font-bold bg-primary text-primary-foreground">AM</AvatarFallback>
                      </Avatar>
                      <ChevronRight className="h-3.5 w-3.5 rotate-90 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 p-0 bg-popover border shadow-xl rounded-xl overflow-hidden z-[100]">
                    <div className="p-4 border-b border-border bg-accent/30">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 ring-2 ring-primary/25">
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

            <div className="lg:hidden flex items-center gap-2">
              <Avatar className="h-8 w-8 ring-2 ring-primary/30">
                <AvatarImage src={demoAvatar} alt={profile.full_name} className="object-cover" />
                <AvatarFallback className="text-xs font-bold bg-primary text-primary-foreground">AM</AvatarFallback>
              </Avatar>
              <button
                className="p-2 rounded-lg hover:bg-accent transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </nav>

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

        <main className="pt-28 pb-16">
          <div className="container space-y-5">

            {/* ===== HEADER CARD ===== */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-border/70 bg-card shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden"
            >
              <div className="p-6 sm:p-8 lg:p-10 grid lg:grid-cols-[1fr_320px] gap-8">
                {/* Identity */}
                <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
                  <Avatar className="h-32 w-32 shrink-0 border-4 border-card shadow-md">
                    <AvatarImage src={demoAvatar} alt={profile.full_name} className="object-cover" />
                    <AvatarFallback className="text-3xl font-bold bg-primary text-primary-foreground">AM</AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h1 className="text-3xl sm:text-4xl font-bold font-display tracking-tight">{profile.full_name}</h1>
                      <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                    </div>
                    <p className="text-base font-semibold text-primary mt-1">{profile.professional_headline}</p>
                    <p className="text-sm text-muted-foreground mt-1">{profile.sub_headline}</p>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{profile.location}</span>
                      <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{profile.phone}</span>
                      <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{profile.email}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {profile.tags.map((t) => (
                        <span key={t} className="px-3 py-1.5 rounded-lg border border-border bg-background text-[11px] font-medium">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-4">
                      <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-[11px] font-medium">
                        <Circle className="h-2 w-2 fill-success text-success" /> Open to Work
                      </span>
                      <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-[11px] font-medium">
                        <Clock className="h-3 w-3 text-muted-foreground" /> {profile.years_of_experience}+ Years Experience
                      </span>
                    </div>
                  </div>
                </div>

                {/* Premium card */}
                <div className="rounded-2xl bg-foreground p-6 flex flex-col justify-center">
                  <Crown className="h-6 w-6 text-warning" />
                  <p className="text-lg font-bold font-display text-background mt-4">Premium Member</p>
                  <p className="text-xs text-background/70 mt-1.5 leading-relaxed">
                    Unlimited access to premium jobs &amp; exclusive support.
                  </p>
                  <Button className="mt-5 h-10 w-fit rounded-lg gap-2 text-xs font-semibold">
                    Go Premium <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="border-t border-border/70 mx-6 sm:mx-8 lg:mx-10" />
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border/70 px-6 sm:px-8 lg:px-10 py-6">
                {stats.map((s) => (
                  <div key={s.label} className="text-center px-2">
                    <p className="text-2xl font-bold font-display">{s.value}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ===== ABOUT + EXPERIENCE / SKILLS + PREFERENCES ===== */}
            <div className="grid lg:grid-cols-[1fr_400px] gap-5 items-start">
              <div className="space-y-5">
                <Card>
                  <SectionTitle>About Me</SectionTitle>
                  <p className="text-sm text-muted-foreground leading-relaxed">{profile.about_summary}</p>
                </Card>

                <Card>
                  <SectionTitle>Experience</SectionTitle>
                  <div className="relative pl-6">
                    <div className="absolute left-[3px] top-2 bottom-2 w-px bg-gradient-to-b from-primary via-primary/40 to-transparent" />
                    <div className="space-y-7">
                      {experiences.map((e) => (
                        <div key={e.job_title} className="relative">
                          <span className="absolute -left-6 top-1.5 h-2 w-2 rounded-full bg-primary ring-4 ring-card" />
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <h3 className="text-sm font-bold font-display">{e.job_title}</h3>
                            <span className="text-[11px] text-muted-foreground">{e.period}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {e.company_name} <span className="mx-1.5">•</span> {e.location}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{e.description}</p>
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {e.tools.map((t) => <Chip key={t}>{t}</Chip>)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <ViewAll label="View full experience" />
                </Card>
              </div>

              <div className="space-y-5">
                <Card>
                  <SectionTitle>Top Skills</SectionTitle>
                  <div className="space-y-5">
                    {topSkills.map((s) => (
                      <div key={s.name}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold">{s.name}</span>
                          <span className="text-[10px] text-muted-foreground">{s.level}</span>
                        </div>
                        <div className="h-1 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${s.pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full rounded-full"
                            style={{ background: s.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <ViewAll label="View all skills" />
                </Card>

                <Card>
                  <SectionTitle>Work Preferences</SectionTitle>
                  <div className="space-y-4">
                    {[
                      { icon: Users, title: "I'm a Freelancer", sub: "Available for contract work" },
                      { icon: Briefcase, title: "Looking for Job", sub: "Actively seeking opportunities" },
                    ].map((p) => (
                      <div key={p.title} className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                          <p.icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-xs font-bold font-display">{p.title}</p>
                          <p className="text-[11px] text-muted-foreground">{p.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>

            {/* ===== EDUCATION / PROJECTS / ACHIEVEMENTS ===== */}
            <div className="grid lg:grid-cols-3 gap-5 items-start">
              <Card>
                <SectionTitle>Education</SectionTitle>
                <div className="relative pl-6">
                  <div className="absolute left-[3px] top-2 bottom-2 w-px bg-gradient-to-b from-primary via-primary/40 to-transparent" />
                  <div className="space-y-6">
                    {educations.map((e) => (
                      <div key={e.institution_name} className="relative">
                        <span className="absolute -left-6 top-1.5 h-2 w-2 rounded-full bg-primary ring-4 ring-card" />
                        <h3 className="text-sm font-bold font-display">{e.institution_name}</h3>
                        <p className="text-[11px] text-muted-foreground mt-1">{e.degree}</p>
                        <p className="text-[11px] text-muted-foreground mt-1">
                          {e.years} <span className="mx-1.5">•</span> {e.grade}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-1 whitespace-pre-line">{e.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <ViewAll label="View all education" />
              </Card>

              <Card>
                <SectionTitle>Projects</SectionTitle>
                <div className="space-y-4">
                  {projects.map((p) => (
                    <div key={p.title} className="rounded-xl border border-border/70 bg-background p-4">
                      <h3 className="text-sm font-bold font-display leading-snug">{p.title}</h3>
                      <span className="inline-block mt-2 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-semibold">
                        {p.role}
                      </span>
                      <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">{p.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {p.tools.map((t) => <Chip key={t}>{t}</Chip>)}
                      </div>
                    </div>
                  ))}
                </div>
                <ViewAll label="View all projects" />
              </Card>

              <Card>
                <SectionTitle>Achievements</SectionTitle>
                <div className="space-y-5">
                  {achievements.map((a) => (
                    <div key={a.title} className="flex gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <a.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-bold font-display leading-snug">{a.title}</p>
                        <p className="text-[11px] text-muted-foreground mt-1">{a.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <ViewAll label="View all achievements" />
              </Card>
            </div>

            {/* ===== CERTIFICATIONS + TOOLS ===== */}
            <div className="grid lg:grid-cols-[1fr_1fr] gap-5 items-start">
              <Card>
                <SectionTitle>Certifications</SectionTitle>
                <div className="grid sm:grid-cols-3 gap-4">
                  {certifications.map((c) => (
                    <div key={c.name} className="rounded-xl border border-border/70 bg-background p-4 text-center">
                      <div className="h-12 flex items-center justify-center">
                        <img src={c.logo} alt={c.org} className="max-h-9 max-w-[80px] object-contain" loading="lazy" />
                      </div>
                      <p className="text-[11px] font-bold font-display mt-3 leading-snug">{c.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{c.org}</p>
                      <p className="text-[10px] text-muted-foreground mt-2">{c.date}</p>
                      <p className="text-[10px] text-success font-medium mt-2 flex items-center justify-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Verified
                      </p>
                    </div>
                  ))}
                </div>
                <ViewAll label="View all certifications" />
              </Card>

              <Card>
                <SectionTitle>Tools &amp; Technologies</SectionTitle>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {tools.map((t) => (
                    <div key={t} className="rounded-lg border border-border/70 bg-background px-3 py-2.5 flex items-center gap-2">
                      <Code2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-[11px] font-medium truncate">{t}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* ===== LINKS ===== */}
            <div className="grid lg:grid-cols-[1fr_1.2fr] gap-5 items-start">
              <Card>
                <SectionTitle>Links</SectionTitle>
                <div className="flex flex-wrap gap-x-8 gap-y-3">
                  {primaryLinks.map((l) => (
                    <a key={l.label} href={l.url} target="_blank" rel="noreferrer"
                      className="flex items-center gap-2 text-xs font-medium hover:text-primary transition-colors">
                      <l.icon className="h-3.5 w-3.5 text-muted-foreground" />
                      {l.label}
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </a>
                  ))}
                </div>
              </Card>

              <Card>
                <SectionTitle>Additional Links</SectionTitle>
                <div className="flex flex-wrap gap-x-8 gap-y-3">
                  {additionalLinks.map((l) => (
                    <a key={l.label} href={l.url}
                      className="flex items-center gap-2 text-xs font-medium hover:text-primary transition-colors">
                      <l.icon className="h-3.5 w-3.5 text-muted-foreground" />
                      {l.label}
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </a>
                  ))}
                </div>
              </Card>
            </div>

            {/* ===== FOOTER BAR ===== */}
            <Card className="flex flex-wrap items-center justify-between gap-4 py-4">
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                <Circle className="h-2 w-2 fill-success text-success" /> Last Active: 2h ago
              </span>
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> Available for: <span className="text-foreground font-medium">Full-time, Contract</span>
              </span>
              <Button variant="outline" size="sm" className="gap-2 h-9 rounded-lg text-xs font-semibold">
                <Share2 className="h-3.5 w-3.5" /> Share Profile
              </Button>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default DemoProfile;
