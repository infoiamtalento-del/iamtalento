import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  MapPin, Briefcase, Code2, Award, Trophy, Star,
  ExternalLink, Mail, Phone, Globe, Github,
  Linkedin, CheckCircle2, Crown, ArrowRight, Clock,
  Users, BookOpen, FileText, Share2, BarChart3, Circle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import demoAvatar from "@/assets/demo-avatar.jpg";
import logoAws from "@/assets/logo-aws.svg";
import logoGoogle from "@/assets/logo-google.svg";
import logoMeta from "@/assets/logo-meta.svg";
import { cn } from "@/lib/utils";

// ===== DEFAULT (DEMO) DATA =====
export const demoProfile = {
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

export interface ProfileExperience {
  job_title: string;
  company_name: string;
  location?: string;
  period: string;
  description?: string;
  tools: string[];
}
export interface ProfileEducation {
  institution_name: string;
  degree: string;
  years: string;
  grade?: string;
  note?: string;
}
export interface ProfileSkill {
  name: string;
  level: string;
  pct: number;
  color: string;
}
export interface ProfileProject {
  title: string;
  role?: string;
  description?: string;
  tools: string[];
}
export interface ProfileAchievement {
  title: string;
  description: string;
  icon: LucideIcon;
}
export interface ProfileCertification {
  name: string;
  org: string;
  date: string;
  logo?: string;
}
export interface ProfileLink {
  label: string;
  icon: LucideIcon;
  url: string;
}
export interface ProfileStat {
  value: string;
  label: string;
}

const demoExperiences: ProfileExperience[] = [
  { job_title: "Senior Software Engineer", company_name: "TechNova Solutions", location: "Bangalore", period: "Mar 2022 – Present", description: "Leading a 6+ engineer team building cloud-native SaaS. Architected event-driven microservices serving 2M+ users.", tools: ["React", "TypeScript", "Node.js", "AWS", "Kubernetes"] },
  { job_title: "Software Engineer II", company_name: "InnovateTech Pvt. Ltd.", location: "Pune", period: "Jan 2018 – Feb 2022", description: "Built core features for a commerce platform handling 500Cr+ GMV.", tools: ["React", "Python", "PostgreSQL", "Redis", "Docker"] },
  { job_title: "Junior Developer", company_name: "StartupHub", location: "Mumbai", period: "Jul 2017 – May 2018", description: "Developed responsive web apps for early-stage startups.", tools: ["JavaScript", "React", "Node.js", "MongoDB"] },
];

const demoEducations: ProfileEducation[] = [
  { institution_name: "IIT Bombay", degree: "B.Tech – Computer Science & Engineering", years: "2013 – 2017", grade: "8.7 CGPA", note: "Coding Club President, Hackathon Organizer" },
  { institution_name: "BITS Pilani", degree: "M.Tech – Data Science & AI", years: "2019 – 2021", grade: "9.1 CGPA", note: "Thesis: Deep learning for time series forecasting\nPublished paper on transformer-based text classification" },
  { institution_name: "Delhi Public School, RK Puram", degree: "Class XII (CBSE – Science PCM)", years: "2011 – 2013", grade: "96%", note: "Science Club Lead, Math Olympiad Team" },
];

const demoSkills: ProfileSkill[] = [
  { name: "React", level: "Expert", pct: 95, color: "hsl(var(--primary))" },
  { name: "TypeScript", level: "Expert", pct: 92, color: "hsl(var(--warning))" },
  { name: "Node.js", level: "Advanced", pct: 82, color: "hsl(var(--primary))" },
  { name: "Tailwind CSS", level: "Advanced", pct: 78, color: "hsl(var(--primary) / 0.7)" },
  { name: "Next.js", level: "Advanced", pct: 74, color: "hsl(var(--warning))" },
  { name: "AWS", level: "Intermediate", pct: 62, color: "hsl(var(--primary) / 0.55)" },
];

const demoProjects: ProfileProject[] = [
  { title: "CloudSync – Real-time Collaboration", role: "Lead Engineer", description: "Real-time collaboration tool with conflict resolution & live cursors.", tools: ["React", "WebSocket", "AWS", "CRDT"] },
  { title: "AI Resume Parser", role: "Solo Developer", description: "Open-source tool extracting structured data from resumes using NLP.", tools: ["Python", "spaCy", "Flask", "Tesseract"] },
];

const demoAchievements: ProfileAchievement[] = [
  { title: "Speaker — ReactConf India 2024", description: "\"Scaling React to 1M Users\"", icon: Trophy },
  { title: "1st Place — HackBangalore 2022", description: "Built FinKids – A finance app for teens", icon: Star },
  { title: "Employee of the Quarter Q3 2023", description: "Awarded for outstanding contributions", icon: Star },
  { title: "React Core Contributor", description: "Merged 5+ PRs in react-icons repo", icon: Award },
];

const demoCertifications: ProfileCertification[] = [
  { name: "AWS Solutions Architect – Pro", org: "Amazon Web Services", date: "Jan 2025", logo: logoAws },
  { name: "GCP Professional Data Engineer", org: "Google Cloud", date: "Jan 2025", logo: logoGoogle },
  { name: "Meta Front-End Developer", org: "Meta (Coursera)", date: "Aug 2022", logo: logoMeta },
];

const demoTools = [
  "VS Code", "Git / GitHub", "Jira", "Figma",
  "Postman", "Notion", "Slack", "CI/CD",
  "Docker", "Kubernetes", "AWS", "Linux",
];

const demoPrimaryLinks: ProfileLink[] = [
  { label: "LinkedIn", icon: Linkedin, url: "https://linkedin.com/in/arjunmehta" },
  { label: "GitHub", icon: Github, url: "https://github.com/arjunmehta" },
  { label: "Portfolio", icon: Globe, url: "https://arjunmehta.dev" },
  { label: "Kaggle", icon: BarChart3, url: "https://kaggle.com/arjunmehta" },
];

const demoAdditionalLinks: ProfileLink[] = [
  { label: "Resume (PDF)", icon: FileText, url: "#" },
  { label: "Portfolio Website", icon: Globe, url: "#" },
  { label: "Blog / Articles", icon: BookOpen, url: "#" },
  { label: "LeetCode Profile", icon: Code2, url: "#" },
];

const demoStats: ProfileStat[] = [
  { value: "6", label: "Skills Verified" },
  { value: "2", label: "Certifications" },
  { value: "20+", label: "Projects" },
  { value: "7+", label: "Years Experience" },
];

export const demoProfileDetails = {
  experiences: demoExperiences, educations: demoEducations, skills: demoSkills,
  projects: demoProjects, achievements: demoAchievements, certifications: demoCertifications,
  tools: demoTools, primaryLinks: demoPrimaryLinks,
  languages: ["English", "Hindi", "Kannada"],
  hobbies: ["Photography", "Hiking", "Reading", "Chess"],
  interests: ["Open-source software", "Artificial intelligence", "Cloud architecture", "Mentoring", "Product design"],
};

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

export interface DemoProfileBodyData {
  profile?: Partial<typeof demoProfile>;
  stats?: ProfileStat[];
  experiences?: ProfileExperience[];
  educations?: ProfileEducation[];
  skills?: ProfileSkill[];
  projects?: ProfileProject[];
  achievements?: ProfileAchievement[];
  certifications?: ProfileCertification[];
  tools?: string[];
  primaryLinks?: ProfileLink[];
  additionalLinks?: ProfileLink[];
  openToWork?: boolean;
}

interface DemoProfileBodyProps {
  data?: DemoProfileBodyData;
  onToast?: (msg: string) => void;
  className?: string;
}

/**
 * The /demo-profile page content (header card, about, experience, skills, education,
 * projects, achievements, certifications, tools, links). It carries no site navbar or footer,
 * so it can be reused beneath the Talento Pro header. Every section falls back to the demo
 * data unless real data is passed in; an explicit empty array hides that section.
 */
export const DemoProfileBody = ({ data = {}, onToast, className }: DemoProfileBodyProps) => {
  const profile = { ...demoProfile, ...(data.profile || {}) };
  const stats = data.stats ?? demoStats;
  const experiences = data.experiences ?? demoExperiences;
  const educations = data.educations ?? demoEducations;
  const topSkills = data.skills ?? demoSkills;
  const projects = data.projects ?? demoProjects;
  const achievements = data.achievements ?? demoAchievements;
  const certifications = data.certifications ?? demoCertifications;
  const tools = data.tools ?? demoTools;
  const primaryLinks = data.primaryLinks ?? demoPrimaryLinks;
  const additionalLinks = data.additionalLinks ?? demoAdditionalLinks;
  const openToWork = data.openToWork ?? true;
  const initials =
    profile.full_name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "ME";

  const shareProfile = () => {
    navigator.clipboard?.writeText(window.location.href);
    onToast?.("Profile link copied to clipboard!");
  };

  return (
    <div className={cn("space-y-5", className)}>
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
              <AvatarImage src={profile.profile_photo_url} alt={profile.full_name} className="object-cover" />
              <AvatarFallback className="text-3xl font-bold bg-primary text-primary-foreground">{initials}</AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl sm:text-4xl font-bold font-display tracking-tight">{profile.full_name}</h1>
                <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
              </div>
              <p className="text-base font-semibold text-primary mt-1">{profile.professional_headline}</p>
              {profile.sub_headline && <p className="text-sm text-muted-foreground mt-1">{profile.sub_headline}</p>}

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-xs text-muted-foreground">
                {profile.location && <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{profile.location}</span>}
                {profile.phone && <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{profile.phone}</span>}
                {profile.email && <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{profile.email}</span>}
              </div>

              {profile.tags && profile.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {profile.tags.map((t) => (
                    <span key={t} className="px-3 py-1.5 rounded-lg border border-border bg-background text-[11px] font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 mt-4">
                {openToWork && (
                  <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-[11px] font-medium">
                    <Circle className="h-2 w-2 fill-success text-success" /> Open to Work
                  </span>
                )}
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

          {experiences.length > 0 && (
            <Card>
              <SectionTitle>Experience</SectionTitle>
              <div className="relative pl-6">
                <div className="absolute left-[3px] top-2 bottom-2 w-px bg-gradient-to-b from-primary via-primary/40 to-transparent" />
                <div className="space-y-7">
                  {experiences.map((e, i) => (
                    <div key={`${e.job_title}-${i}`} className="relative">
                      <span className="absolute -left-6 top-1.5 h-2 w-2 rounded-full bg-primary ring-4 ring-card" />
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="text-sm font-bold font-display">{e.job_title}</h3>
                        <span className="text-[11px] text-muted-foreground">{e.period}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {e.company_name}
                        {e.location && (
                          <>
                            <span className="mx-1.5">•</span> {e.location}
                          </>
                        )}
                      </p>
                      {e.description && (
                        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{e.description}</p>
                      )}
                      {e.tools.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {e.tools.map((t) => <Chip key={t}>{t}</Chip>)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <ViewAll label="View full experience" />
            </Card>
          )}
        </div>

        <div className="space-y-5">
          {topSkills.length > 0 && (
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
          )}

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
      {(educations.length > 0 || projects.length > 0 || achievements.length > 0) && (
        <div className="grid lg:grid-cols-3 gap-5 items-start">
          {educations.length > 0 && (
            <Card>
              <SectionTitle>Education</SectionTitle>
              <div className="relative pl-6">
                <div className="absolute left-[3px] top-2 bottom-2 w-px bg-gradient-to-b from-primary via-primary/40 to-transparent" />
                <div className="space-y-6">
                  {educations.map((e, i) => (
                    <div key={`${e.institution_name}-${i}`} className="relative">
                      <span className="absolute -left-6 top-1.5 h-2 w-2 rounded-full bg-primary ring-4 ring-card" />
                      <h3 className="text-sm font-bold font-display">{e.institution_name}</h3>
                      <p className="text-[11px] text-muted-foreground mt-1">{e.degree}</p>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        {e.years}
                        {e.grade && (
                          <>
                            <span className="mx-1.5">•</span> {e.grade}
                          </>
                        )}
                      </p>
                      {e.note && <p className="text-[11px] text-muted-foreground mt-1 whitespace-pre-line">{e.note}</p>}
                    </div>
                  ))}
                </div>
              </div>
              <ViewAll label="View all education" />
            </Card>
          )}

          {projects.length > 0 && (
            <Card>
              <SectionTitle>Projects</SectionTitle>
              <div className="space-y-4">
                {projects.map((p, i) => (
                  <div key={`${p.title}-${i}`} className="rounded-xl border border-border/70 bg-background p-4">
                    <h3 className="text-sm font-bold font-display leading-snug">{p.title}</h3>
                    {p.role && (
                      <span className="inline-block mt-2 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-semibold">
                        {p.role}
                      </span>
                    )}
                    {p.description && (
                      <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">{p.description}</p>
                    )}
                    {p.tools.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {p.tools.map((t) => <Chip key={t}>{t}</Chip>)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <ViewAll label="View all projects" />
            </Card>
          )}

          {achievements.length > 0 && (
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
          )}
        </div>
      )}

      {/* ===== CERTIFICATIONS + TOOLS ===== */}
      {(certifications.length > 0 || tools.length > 0) && (
        <div className="grid lg:grid-cols-[1fr_1fr] gap-5 items-start">
          {certifications.length > 0 && (
            <Card>
              <SectionTitle>Certifications</SectionTitle>
              <div className="grid sm:grid-cols-3 gap-4">
                {certifications.map((c, i) => (
                  <div key={`${c.name}-${i}`} className="rounded-xl border border-border/70 bg-background p-4 text-center">
                    <div className="h-12 flex items-center justify-center">
                      {c.logo ? (
                        <img src={c.logo} alt={c.org} className="max-h-9 max-w-[80px] object-contain" loading="lazy" />
                      ) : (
                        <span
                          aria-hidden
                          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted/40 font-display text-xs font-bold text-primary"
                        >
                          {c.org
                            .split(/\s+/)
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((w) => w[0]?.toUpperCase())
                            .join("")}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-bold font-display mt-3 leading-snug">{c.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{c.org}</p>
                    {c.date && <p className="text-[10px] text-muted-foreground mt-2">{c.date}</p>}
                    <p className="text-[10px] text-success font-medium mt-2 flex items-center justify-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Verified
                    </p>
                  </div>
                ))}
              </div>
              <ViewAll label="View all certifications" />
            </Card>
          )}

          {tools.length > 0 && (
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
          )}
        </div>
      )}

      {/* ===== LINKS ===== */}
      {(primaryLinks.length > 0 || additionalLinks.length > 0) && (
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-5 items-start">
          {primaryLinks.length > 0 && (
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
          )}

          {additionalLinks.length > 0 && (
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
          )}
        </div>
      )}

      {/* ===== FOOTER BAR ===== */}
      <Card className="flex flex-wrap items-center justify-between gap-4 py-4">
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          <Circle className="h-2 w-2 fill-success text-success" /> Last Active: 2h ago
        </span>
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" /> Available for: <span className="text-foreground font-medium">Full-time, Contract</span>
        </span>
        <Button variant="outline" size="sm" onClick={shareProfile} className="gap-2 h-9 rounded-lg text-xs font-semibold">
          <Share2 className="h-3.5 w-3.5" /> Share Profile
        </Button>
      </Card>
    </div>
  );
};

export default DemoProfileBody;
