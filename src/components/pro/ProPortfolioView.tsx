import React, { useState } from "react";
import {
  Linkedin,
  Github,
  MapPin,
  Briefcase,
  Award,
  Layers,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  BadgeCheck,
  Copy,
  User,
  Plus,
  X,
  Check,
  Code2,
  FolderGit2,
  TrendingUp,
  ArrowRight,
  GraduationCap,
  Share2,
  Download,
  Pencil,
  Trash2,
  QrCode,
  Globe,
  CheckCircle2,
  Calendar,
  Languages,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ProUser, ProJob } from "@/data/proData";
import { getCompanyLogo, getCandidatePhoto } from "@/data/portalAssets";
import { ProDrawerState, ProView } from "./proTypes";
import "./employer-workspace.css";

interface ProPortfolioViewProps {
  user: ProUser;
  jobs: ProJob[];
  onOpenDrawer: (drawer: ProDrawerState) => void;
  onToast: (msg: string) => void;
  onUpdateUser?: (updated: ProUser) => void;
  onNavigate?: (view: ProView) => void;
}

export const ProPortfolioView: React.FC<ProPortfolioViewProps> = ({
  user,
  jobs,
  onOpenDrawer,
  onToast,
  onUpdateUser,
  onNavigate,
}) => {
  const isEmployer = user.role === "employer";

  if (isEmployer) {
    // EMPLOYER PORTFOLIO
    const cp = user.cp || {};
    const companyJobs = jobs.filter((j) => j.by === user.email);

    return (
      <div className="employer-workspace space-y-6">
        <header className="workspace-header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="workspace-eyebrow flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-primary" />
              Company Showcase · Public Brand Profile
            </span>
            <h1 className="workspace-heading text-2xl font-bold">Company Portfolio</h1>
            <p className="workspace-description text-sm text-muted-foreground">
              Public profile showcasing your culture, mission, tech stack, and open hiring opportunities.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onNavigate?.("cp")} className="cursor-pointer gap-1.5">
              <Pencil className="h-4 w-4" />
              Edit Profile
            </Button>
            <Button onClick={() => onNavigate?.("post")} className="cursor-pointer gap-1.5">
              <Plus className="h-4 w-4" />
              Post Job
            </Button>
          </div>
        </header>

        {/* Company Header Banner */}
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xs">
          <div className="h-32 bg-primary/10 border-b border-border relative" />
          <div className="px-6 pb-6 pt-0 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12">
              <div className="flex items-end gap-4">
                <div className="w-24 h-24 rounded-2xl bg-card border-2 border-border shadow-md flex items-center justify-center p-2 shrink-0">
                  <img
                    src={getCompanyLogo(user.name)}
                    alt={user.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    {cp.name || user.name}
                    <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                  </h1>
                  <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                    <span>{cp.ind || "Technology"}</span>
                    <span>•</span>
                    <span>{cp.size || "Mid"} Company</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {cp.hq || "Bengaluru, India"}
                    </span>
                    {cp.site && (
                      <>
                        <span>•</span>
                        <a
                          href={`https://${cp.site}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1 font-medium"
                        >
                          {cp.site} <ExternalLink className="w-3 h-3" />
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company About & Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="font-semibold text-foreground text-base">About {cp.name || user.name}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
              {cp.about ||
                "Super30 Technologies is building developer tooling and autonomous engineering platforms for modern software teams worldwide."}
            </p>

            {cp.mission && (
              <div className="pt-2 border-t border-border space-y-1">
                <span className="text-xs font-semibold text-foreground">Our Mission</span>
                <p className="text-xs text-muted-foreground leading-relaxed">{cp.mission}</p>
              </div>
            )}
          </div>

          {/* Benefits & Perks */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> Perks & Culture
            </h3>
            <div className="flex flex-wrap gap-2">
              {(cp.ben || ["Remote work", "Health insurance", "Learning budget", "Flexible hours", "Stock options"]).map(
                (perk) => (
                  <Badge
                    key={perk}
                    variant="outline"
                    className="px-2.5 py-1 text-xs font-medium"
                  >
                    {perk}
                  </Badge>
                )
              )}
            </div>
          </div>
        </div>

        {/* Open Job Listings */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground text-base flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" /> Open Opportunities ({companyJobs.length})
            </h3>
          </div>

          <div className="divide-y divide-border">
            {companyJobs.length === 0 ? (
              <p className="text-xs text-muted-foreground py-6 text-center">No active positions posted yet.</p>
            ) : (
              companyJobs.map((j) => (
                <div
                  key={j.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <h4
                      className="font-bold text-foreground text-sm hover:text-primary transition-colors cursor-pointer"
                      onClick={() => onOpenDrawer({ type: "job", id: j.id })}
                    >
                      {j.t}
                    </h4>
                    <div className="text-muted-foreground text-[11px] flex items-center gap-2 mt-0.5">
                      <span>{j.l}</span>
                      <span>•</span>
                      <span>{j.m}</span>
                      <span>•</span>
                      <span>₹{j.a}–{j.b} LPA</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="rounded-lg text-xs h-8 cursor-pointer"
                    onClick={() => onOpenDrawer({ type: "job", id: j.id })}
                  >
                    Apply Now
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // CANDIDATE PORTFOLIO
  return (
    <CandidatePortfolio
      user={user}
      onToast={onToast}
      onUpdateUser={onUpdateUser}
      onNavigate={onNavigate}
    />
  );
};

type PortfolioProject = {
  t: string;
  l?: string;
  d?: string;
  s?: string;
  m?: string;
  demo?: string;
};

const DEFAULT_PROJECTS: PortfolioProject[] = [
  {
    t: "JobTracker Pro Platform",
    l: "github.com/yogesh/jobtracker",
    demo: "jobtracker-preview.talento.app",
    d: "Autonomous job tracking application with real-time 24h review SLA updates, interview scheduling, and ATS-friendly resume exports.",
    s: "React, TypeScript, Node.js, Tailwind CSS, PostgreSQL",
    m: "1,200+ Active Users · 99.8% SLA adherence",
  },
  {
    t: "E-Commerce Analytics & Conversion Suite",
    l: "github.com/yogesh/ecommerce-analytics",
    demo: "analytics-demo.talento.app",
    d: "High-performance analytics dashboard providing revenue breakdowns, cart abandonment funnels, and cohort analysis with sub-second chart rendering.",
    s: "Next.js, TypeScript, Tailwind CSS, Chart.js, Express",
    m: "Processes 250k+ daily events · 40% faster queries",
  },
  {
    t: "Lead Management & Sales CRM",
    l: "github.com/yogesh/lead-crm",
    demo: "leadflow-crm.app",
    d: "Full-stack CRM with automated multi-channel follow-ups, kanban pipeline boards, and role-based access control for distributed teams.",
    s: "React, Redux Toolkit, MongoDB, Docker, REST API",
    m: "Adopted by 3 sales teams · Reduced churn by 18%",
  },
];

const CandidatePortfolio: React.FC<{
  user: ProUser;
  onToast: (msg: string) => void;
  onUpdateUser?: (updated: ProUser) => void;
  onNavigate?: (view: ProView) => void;
}> = ({ user, onToast, onUpdateUser, onNavigate }) => {
  const [projects, setProjects] = useState<PortfolioProject[]>(
    user.pj && user.pj.length
      ? user.pj.map((p) => ({
          t: p.t,
          l: p.l || "",
          d: p.d || "",
          s: p.s || "React, TypeScript, Node.js",
          m: p.m || "Production Ready",
        }))
      : DEFAULT_PROJECTS
  );

  // Modals state
  const [isAddProjOpen, setIsAddProjOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  // New project form
  const [newProj, setNewProj] = useState<PortfolioProject>({
    t: "",
    l: "",
    demo: "",
    d: "",
    s: "",
    m: "",
  });

  const [copiedShare, setCopiedShare] = useState(false);
  const avatarUrl = getCandidatePhoto(user.name);

  const skills = user.sk || [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "JavaScript",
    "Tailwind CSS",
    "PostgreSQL",
    "MongoDB",
    "AWS",
    "Git",
    "Docker",
    "Python",
  ];

  const experience = user.ex && user.ex.length > 0 ? user.ex : [
    {
      co: "Zoho",
      role: "Frontend Developer",
      fr: "Feb 2022",
      to: "Present",
      d: "Architected modern responsive single-page web applications using React, TypeScript, and Tailwind CSS. Built high-traffic dashboards, reduced bundle payload by 28%, and collaborated across cross-functional product and UX teams.",
    },
    {
      co: "InfoSys",
      role: "Software Intern",
      fr: "Jun 2021",
      to: "Jan 2022",
      d: "Developed reusable UI components in React, integrated REST APIs, participated in automated unit testing with Jest, and squashed 40+ bug tickets.",
    },
  ];

  const education = user.ed && user.ed.length > 0 ? user.ed : [
    {
      sc: "Anna University",
      dg: "B.E. Computer Science & Engineering",
      yr: "2022",
    },
  ];

  const certs = (user.ce && user.ce.length > 0
    ? user.ce
    : [
        "Meta Front-End Developer · Meta Certification · 2026",
        "Google Analytics Certification · Google / Skillshop · 2026",
        "AWS Cloud Practitioner · Amazon Web Services · 2026",
        "SQL Intermediate · HackerRank · 2026",
        "React Developer Certification · Udemy · 2026",
      ]
  ).map((c, index) => {
    const p = String(c).split(" · ");
    return {
      index,
      title: p[0] || String(c),
      issuer: p[1] || "Accredited Provider",
      year: p[2] || "Verified",
    };
  });

  const assessments = user.as || {
    React: 88,
    SQL: 82,
    "System Design": 85,
    Python: 75,
  };

  const persistProjects = (next: PortfolioProject[]) => {
    setProjects(next);
    onUpdateUser?.({ ...user, pj: next });
  };

  const handleAddProj = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProj.t.trim()) {
      onToast("Project title is required.");
      return;
    }
    const updated = [
      {
        ...newProj,
        s: newProj.s?.trim() || "React, TypeScript, CSS",
        m: newProj.m?.trim() || "Active Production Project",
      },
      ...projects,
    ];
    persistProjects(updated);
    setNewProj({ t: "", l: "", demo: "", d: "", s: "", m: "" });
    setIsAddProjOpen(false);
    onToast("Project added to your portfolio showcase!");
  };

  const handleDeleteProj = (index: number) => {
    const updated = projects.filter((_, i) => i !== index);
    persistProjects(updated);
    onToast("Project removed from portfolio.");
  };

  const stripProto = (u?: string) => (u ? u.replace(/^https?:\/\//, "") : "");

  const location = [user.city, user.state].filter(Boolean).join(", ") || "Bengaluru, India";
  const expLabel = `${user.exp ?? 2.5} ${user.exp === 1 ? "Year" : "Years"}`;
  const linkedin = user.links?.li || "linkedin.com/in/yogesh-dev";
  const github = user.links?.gh || "github.com/yogesh";
  const portfolioUrl = user.links?.pf || "yogeshportfolio.co";

  const shareableUrl = `${window.location.origin}/pro?view=port&candidate=${encodeURIComponent(user.name)}`;

  const handleCopyShareLink = () => {
    navigator.clipboard?.writeText(shareableUrl);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
    onToast("Shareable portfolio URL copied to clipboard!");
  };

  return (
    <div className="employer-workspace space-y-6">
      {/* HEADER */}
      <header className="workspace-header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="workspace-eyebrow flex items-center gap-1.5">
            <Sparkles size={14} className="text-primary" />
            Verified Showcase · Live Engineering Profile
          </span>
          <h1 className="workspace-heading text-2xl font-bold tracking-tight">Candidate Portfolio</h1>
          <p className="workspace-description text-sm text-muted-foreground">
            A verified showcase of your technical projects, coding assessment percentiles, work experience, and credentials.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => setIsShareModalOpen(true)} className="cursor-pointer gap-1.5">
            <Share2 className="h-4 w-4 text-primary" />
            Share Portfolio
          </Button>
          <Button onClick={() => setIsAddProjOpen(true)} className="cursor-pointer gap-1.5">
            <Plus className="h-4 w-4" />
            Add Project
          </Button>
        </div>
      </header>

      {/* CANDIDATE SHOWCASE BANNER / HERO */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-primary/10 text-primary font-bold text-3xl flex items-center justify-center shrink-0 overflow-hidden border-2 border-primary/20 shadow-xs">
              {avatarUrl ? (
                <img src={avatarUrl} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                (user.name?.charAt(0) || "Y").toUpperCase()
              )}
              <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-card" />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 gap-1 text-xs">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Verified Engineer
                </Badge>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs">
                  {user.st || "Open to offers"}
                </Badge>
              </div>

              <p className="text-sm font-medium text-foreground/80">
                {user.head || "Frontend Developer · React · 2.5 yrs"}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground pt-0.5">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  {location}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5 text-primary" />
                  {expLabel} Experience
                </span>
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  24h Review SLA Eligible
                </span>
              </div>
            </div>
          </div>

          {/* Social Links & Quick Actions */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 sm:items-center md:items-end border-t md:border-t-0 pt-4 md:pt-0 border-border">
            <div className="flex flex-wrap items-center gap-2">
              {github && (
                <a
                  href={`https://${stripProto(github)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-muted/30 hover:bg-muted/60 text-xs font-semibold text-foreground transition-colors"
                >
                  <Github className="h-3.5 w-3.5" />
                  GitHub
                </a>
              )}
              {linkedin && (
                <a
                  href={`https://${stripProto(linkedin)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-muted/30 hover:bg-muted/60 text-xs font-semibold text-foreground transition-colors"
                >
                  <Linkedin className="h-3.5 w-3.5 text-sky-600" />
                  LinkedIn
                </a>
              )}
              {portfolioUrl && (
                <a
                  href={`https://${stripProto(portfolioUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-muted/30 hover:bg-muted/60 text-xs font-semibold text-foreground transition-colors"
                >
                  <Globe className="h-3.5 w-3.5 text-emerald-600" />
                  Live Website
                </a>
              )}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyShareLink}
                className="cursor-pointer gap-1.5 text-xs"
              >
                {copiedShare ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedShare ? "Link Copied!" : "Copy Link"}
              </Button>
              {onNavigate && (
                <Button
                  size="sm"
                  onClick={() => onNavigate("resume")}
                  className="cursor-pointer gap-1.5 text-xs"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Resume
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* METRICS SUMMARY STRIP */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <span className="text-xs text-muted-foreground block mb-1">Verified Assessments</span>
          <div className="flex items-baseline gap-2">
            <strong className="text-2xl font-bold text-foreground">{Object.keys(assessments).length}</strong>
            <span className="text-xs text-emerald-600 font-semibold">Avg 82%</span>
          </div>
          <span className="text-[11px] text-muted-foreground mt-0.5 block">Proctored technical tests</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <span className="text-xs text-muted-foreground block mb-1">Production Projects</span>
          <div className="flex items-baseline gap-2">
            <strong className="text-2xl font-bold text-foreground">{projects.length}</strong>
            <span className="text-xs text-primary font-semibold">Open Source & Web</span>
          </div>
          <span className="text-[11px] text-muted-foreground mt-0.5 block">Showcased repositories</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <span className="text-xs text-muted-foreground block mb-1">Industry Experience</span>
          <div className="flex items-baseline gap-2">
            <strong className="text-2xl font-bold text-foreground">{expLabel}</strong>
            <span className="text-xs text-emerald-600 font-semibold">Verified</span>
          </div>
          <span className="text-[11px] text-muted-foreground mt-0.5 block">Zoho & InfoSys</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <span className="text-xs text-muted-foreground block mb-1">Accredited Certifications</span>
          <div className="flex items-baseline gap-2">
            <strong className="text-2xl font-bold text-foreground">{certs.length}</strong>
            <span className="text-xs text-primary font-semibold">Meta & AWS</span>
          </div>
          <span className="text-[11px] text-muted-foreground mt-0.5 block">Verified credentials</span>
        </div>
      </div>

      {/* MAIN TWO-COLUMN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-6 items-start">
        {/* ================= LEFT COLUMN ================= */}
        <div className="space-y-6">
          {/* FEATURED PROJECTS */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
                  <FolderGit2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Featured Engineering Projects</h3>
                  <p className="text-xs text-muted-foreground">
                    Production systems, open-source tooling, and architecture highlights.
                  </p>
                </div>
              </div>
              <Button size="sm" onClick={() => setIsAddProjOpen(true)} className="cursor-pointer gap-1.5 text-xs">
                <Plus className="h-3.5 w-3.5" />
                Add Project
              </Button>
            </div>

            <div className="space-y-4">
              {projects.map((proj, idx) => {
                const stackList = (proj.s || "")
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean);

                return (
                  <div
                    key={`${proj.t}-${idx}`}
                    className="p-5 rounded-xl border border-border hover:border-primary/40 bg-muted/15 transition-all space-y-3.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-base font-bold text-foreground">{proj.t}</h4>
                          {proj.m && (
                            <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/30 gap-1">
                              <TrendingUp className="h-3 w-3" />
                              {proj.m}
                            </Badge>
                          )}
                        </div>
                        {proj.d && (
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {proj.d}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteProj(idx)}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-1.5 rounded-md cursor-pointer transition-colors"
                        title="Delete project"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Tech Stack Badges */}
                    {stackList.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {stackList.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-background border border-border text-foreground"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Links & CTA */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/70 text-xs">
                      <div className="flex flex-wrap items-center gap-3">
                        {proj.l && (
                          <a
                            href={`https://${stripProto(proj.l)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
                          >
                            <Github className="h-3.5 w-3.5" />
                            Repository
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        {proj.demo && (
                          <a
                            href={`https://${stripProto(proj.demo)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 hover:underline"
                          >
                            <Globe className="h-3.5 w-3.5" />
                            Live Demo
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedProject(proj)}
                        className="cursor-pointer text-xs gap-1 hover:text-primary p-0 h-auto"
                      >
                        View Architecture
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* WORK EXPERIENCE */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Work Experience</h3>
                  <p className="text-xs text-muted-foreground">{expLabel} total commercial experience</p>
                </div>
              </div>
              {onNavigate && (
                <Button variant="outline" size="sm" onClick={() => onNavigate("profile")} className="cursor-pointer gap-1.5 text-xs">
                  <Pencil className="h-3.5 w-3.5" />
                  Edit History
                </Button>
              )}
            </div>

            <div className="relative border-l-2 border-primary/20 ml-3 space-y-6 pl-5">
              {experience.map((item, idx) => (
                <div key={`${item.co}-${idx}`} className="relative space-y-1.5">
                  <span className="absolute -left-[27px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-background bg-primary" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="text-sm font-bold text-foreground">{item.role}</h4>
                    <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-primary" />
                      {item.fr} – {item.to}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-primary">{item.co}</span>
                  {item.d && (
                    <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                      {item.d}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* EDUCATION */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Education & Academics</h3>
                <p className="text-xs text-muted-foreground">Formal university degrees and technical background.</p>
              </div>
            </div>

            <div className="space-y-4">
              {education.map((ed, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-muted/20 border border-border/80 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-foreground">{ed.dg}</h4>
                    <p className="text-xs font-medium text-primary">{ed.sc}</p>
                    <p className="text-[11px] text-muted-foreground">Graduated in {ed.yr} · First Class with Distinction</p>
                  </div>
                  <Badge variant="outline" className="text-xs shrink-0">Graduated {ed.yr}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN (SIDEBAR WIDGETS) ================= */}
        <div className="space-y-6">
          {/* VERIFIED ASSESSMENT SCORES */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 shrink-0">
                  <BadgeCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Verified Assessment Scores</h3>
                  <p className="text-[11px] text-muted-foreground">Proctored coding evaluation tests</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {Object.entries(assessments).map(([skillName, score]) => (
                <div key={skillName} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      {skillName}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <strong className="text-foreground">{score}%</strong>
                      <span className="text-[10px] text-muted-foreground">
                        {score >= 85 ? "Top 5%" : score >= 80 ? "Top 10%" : "Proficient"}
                      </span>
                    </div>
                  </div>
                  <Progress value={score} className="h-2 rounded-full" />
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-border">
              <a
                href="/assessments/explore"
                className="text-xs text-primary hover:underline font-semibold flex items-center justify-between"
              >
                <span>Take new verified test</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* CORE TECHNICAL SKILLS */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3 border-b border-border pb-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                <Code2 className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Core Skills & Stack</h3>
                <p className="text-[11px] text-muted-foreground">Technologies with proven production experience</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="px-2.5 py-1 text-xs font-medium bg-muted/40 hover:bg-muted/70 text-foreground"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* ACCREDITED CERTIFICATIONS */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                  <Award className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Certifications</h3>
                  <p className="text-[11px] text-muted-foreground">{certs.length} verified credentials</p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-border">
              {certs.map((c) => (
                <div key={c.index} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <strong className="text-foreground font-semibold block">{c.title}</strong>
                    <span className="text-muted-foreground text-[11px]">{c.issuer}</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/30 shrink-0">
                    Verified
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* SPOKEN LANGUAGES */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4 text-primary" />
              <h3 className="text-xs font-bold text-foreground">Languages</h3>
            </div>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span className="font-semibold text-foreground">English</span>
                <span>Fluent · Professional Working</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-foreground">Tamil</span>
                <span>Native / Bilingual</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-foreground">Hindi</span>
                <span>Conversational</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= ADD PROJECT DIALOG ================= */}
      <Dialog open={isAddProjOpen} onOpenChange={setIsAddProjOpen}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleAddProj}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FolderGit2 className="h-4 w-4 text-primary" />
                Add Engineering Project
              </DialogTitle>
              <DialogDescription>
                Showcase an application, open-source library, or client project on your verified portfolio.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">
                  Project Title <span className="text-destructive">*</span>
                </label>
                <Input
                  value={newProj.t}
                  onChange={(e) => setNewProj({ ...newProj, t: e.target.value })}
                  placeholder="e.g. Distributed Task Queue"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">GitHub Repository Link</label>
                  <Input
                    value={newProj.l}
                    onChange={(e) => setNewProj({ ...newProj, l: e.target.value })}
                    placeholder="github.com/you/repo"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Live Demo Link</label>
                  <Input
                    value={newProj.demo}
                    onChange={(e) => setNewProj({ ...newProj, demo: e.target.value })}
                    placeholder="demo.yourapp.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Tech Stack (comma separated)</label>
                <Input
                  value={newProj.s}
                  onChange={(e) => setNewProj({ ...newProj, s: e.target.value })}
                  placeholder="e.g. React, TypeScript, Node.js, PostgreSQL"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Key Impact Metric / Result</label>
                <Input
                  value={newProj.m}
                  onChange={(e) => setNewProj({ ...newProj, m: e.target.value })}
                  placeholder="e.g. 5,000+ Monthly Users · 99.9% Uptime"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Project Description</label>
                <Textarea
                  rows={3}
                  value={newProj.d}
                  onChange={(e) => setNewProj({ ...newProj, d: e.target.value })}
                  placeholder="Explain what the project solves, architectural challenges tackled, and engineering highlights."
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setIsAddProjOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="cursor-pointer">
                Save to Portfolio
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================= SHARE PORTFOLIO DIALOG ================= */}
      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-4 w-4 text-primary" />
              Share Verified Portfolio
            </DialogTitle>
            <DialogDescription>
              Share your verified candidate link with hiring teams, recruiters, or across social networks.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3 text-xs">
            <div className="p-4 rounded-xl bg-muted/30 border border-border flex items-center justify-center">
              <div className="p-3 bg-background rounded-xl border border-border/80 shadow-xs flex flex-col items-center gap-2">
                <QrCode className="h-28 w-28 text-foreground" />
                <span className="text-[10px] text-muted-foreground font-mono">Scan for mobile view</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Public Portfolio URL</label>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={shareableUrl}
                  className="font-mono text-xs bg-muted/40"
                />
                <Button size="sm" onClick={handleCopyShareLink} className="cursor-pointer shrink-0">
                  {copiedShare ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedShare ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setIsShareModalOpen(false)} className="w-full cursor-pointer">
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= VIEW ARCHITECTURE / DETAILS MODAL ================= */}
      <Dialog open={Boolean(selectedProject)} onOpenChange={(open) => !open && setSelectedProject(null)}>
        <DialogContent className="sm:max-w-lg">
          {selectedProject && (
            <div>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FolderGit2 className="h-4 w-4 text-primary" />
                  {selectedProject.t}
                </DialogTitle>
                <DialogDescription>
                  Detailed technical breakdown and architecture overview.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4 text-xs">
                {selectedProject.m && (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 shrink-0 text-emerald-600" />
                    <strong>Impact:</strong> {selectedProject.m}
                  </div>
                )}

                <div className="space-y-1">
                  <strong className="text-foreground">Project Scope & Problem Solved:</strong>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedProject.d || "No description provided."}
                  </p>
                </div>

                <div className="space-y-1">
                  <strong className="text-foreground">Technology Stack:</strong>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(selectedProject.s || "React, TypeScript")
                      .split(",")
                      .map((t) => (
                        <Badge key={t} variant="outline" className="text-xs">
                          {t.trim()}
                        </Badge>
                      ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-border flex flex-wrap gap-3">
                  {selectedProject.l && (
                    <a
                      href={`https://${stripProto(selectedProject.l)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-muted/40 hover:bg-muted font-semibold text-foreground text-xs"
                    >
                      <Github className="h-3.5 w-3.5" />
                      View Source Code
                    </a>
                  )}
                  {selectedProject.demo && (
                    <a
                      href={`https://${stripProto(selectedProject.demo)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open Live Application
                    </a>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedProject(null)}>
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
