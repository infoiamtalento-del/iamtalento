import { useState, type ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { demoProfile as profile, demoProfileDetails as details } from "@/components/profile/DemoProfileBody";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Bell, BookOpen, Brain, BriefcaseBusiness, CheckCircle2, ChevronDown, Cloud, Code2, Crown, Download, ExternalLink, FileCheck, FileText, Github, GraduationCap, Heart, Languages, Layers, Linkedin, Mail, MapPin, MoreHorizontal, Palette, Pencil, Phone, Search, Share2, ShieldCheck, Trophy, UserRound, Users, Video, Wrench, X, Sparkles, Plus, type LucideIcon } from "lucide-react";
import { siteLogo } from "@/assets/logo";
import cover from "@/assets/profile-office-cover.jpg";
import cloudProject from "@/assets/profile-cloudsync.jpg";
import parserProject from "@/assets/profile-resume-parser.jpg";
import "@/components/profile/demo-profile.css";

const navigation = [
  { label: "Profile", href: "/demo-profile", icon: UserRound },
  { label: "Jobs", href: "/jobs", icon: BriefcaseBusiness },
  { label: "Assessments", href: "/assessments/explore", icon: FileCheck },
  { label: "Learning", href: "/learning", icon: BookOpen },
  { label: "Meetups", href: "/meetups", icon: Users },
  { label: "Resources", href: "/resources", icon: FileText },
];
const tabs = [
  { label: "About Me", id: "about-me" }, { label: "Work Experience", id: "experience" },
  { label: "Skills", id: "skills" }, { label: "Tools", id: "tools" },
  { label: "Projects", id: "projects" }, { label: "Education", id: "education" },
  { label: "Certifications", id: "certifications" }, { label: "Awards", id: "awards" },
  { label: "Languages", id: "languages" }, { label: "Hobbies", id: "hobbies" },
  { label: "Interests", id: "interests" },
];
const badges = [
  { name: "Full-Stack", icon: Code2, tone: "red" }, { name: "Cloud Native", icon: Cloud, tone: "blue" },
  { name: "AI/ML", icon: Brain, tone: "green" }, { name: "System Design", icon: Layers, tone: "blue" }, { name: "Product Thinking", icon: Heart, tone: "violet" },
];
const expertise = [
  { title: "End-to-End Development", sub: "From idea to scalable product", icon: Code2, tone: "red" },
  { title: "Cloud & DevOps", sub: "Scalable infrastructure", icon: Cloud, tone: "blue" },
  { title: "AI/ML Integration", sub: "Intelligent applications", icon: Brain, tone: "violet" },
  { title: "Product Thinking", sub: "User-centric solutions", icon: ShieldCheck, tone: "green" },
];

function Panel({ id, title, icon: Icon, action, children, className }: { id?: string; title: string; icon: LucideIcon; action?: ReactNode; children: ReactNode; className?: string }) {
  return <section id={id} className={cn("dp-panel", className)}><div className="dp-panel-heading"><h2><Icon size={20} />{title}</h2>{action}</div>{children}</section>;
}
function Edit() { return <Button asChild variant="outline" size="sm" className="dp-edit"><Link to="/profile"><Pencil /> Edit</Link></Button>; }
function Chips({ items }: { items: string[] }) { return <div className="dp-chips">{items.map(t => <span key={t}>{t}</span>)}</div>; }

export function DemoProfileDashboardContent({ embedded = false }: { embedded?: boolean }) {
  const [activeTab, setActiveTab] = useState("about-me");
  const [contactOpen, setContactOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isOpenToWork, setIsOpenToWork] = useState(true);
  const [isOpenForFreelance, setIsOpenForFreelance] = useState(true);
  const [videoResumeOpen, setVideoResumeOpen] = useState(false);
  const scrollTo = (tab: string) => {
    setActiveTab(tab);
    document.getElementById(tab)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
  };
  const share = async () => {
    try { await navigator.clipboard.writeText(window.location.href); toast.success("Profile link copied"); }
    catch { toast.error("Could not copy the link. Please copy it from your address bar."); }
  };
  const downloadResume = async () => {
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF();
    let y = 23;
    pdf.setFontSize(23); pdf.text(profile.full_name, 18, y); y += 10;
    pdf.setFontSize(12); pdf.text(profile.professional_headline, 18, y); y += 8;
    pdf.setFontSize(10); pdf.text(`${profile.location} | ${profile.email}`, 18, y); y += 13;
    const write = (text: string, size = 10) => {
      pdf.setFontSize(size);
      const lines = pdf.splitTextToSize(text, 173);
      if (y + lines.length * 5 > 275) { pdf.addPage(); y = 20; }
      pdf.text(lines, 18, y); y += lines.length * 5 + 5;
    };
    write("Professional Summary", 13); write(profile.about_summary);
    write("Experience", 13);
    details.experiences.forEach(e => { write(`${e.job_title} - ${e.company_name} | ${e.period}`, 11); write(e.description ?? ""); });
    write("Education", 13); details.educations.forEach(e => write(`${e.institution_name} - ${e.degree} | ${e.years}`));
    write("Skills", 13); write(details.skills.map(s => s.name).join(" | "));
    write("Certifications", 13); details.certifications.forEach(c => write(`${c.name} - ${c.org}`));
    pdf.save("Arjun-Mehta-Demo-Resume.pdf"); toast.success("Demo resume downloaded");
  };
  const view = (tab: string, text: string) => <Button variant="link" className="dp-text-action" onClick={() => scrollTo(tab)}>{text}<ArrowRight /></Button>;

  return (
    <div className={cn("demo-dashboard", embedded && "dp-embedded")}>
      <main className="dp-main">
        <section id="overview" className="dp-overview">
          <div className="dp-cover"><img src={cover} width={1920} height={512} alt="Modern office overlooking the city at sunset" /><Button asChild variant="ghost" className="dp-back"><Link to="/jobs"><ArrowLeft />Back to Search</Link></Button>
          </div>
          <div className="dp-identity">
            <div className="dp-person"><div className="dp-avatar"><img src={profile.profile_photo_url} alt={profile.full_name} /><span /></div><div className="dp-name"><div className="dp-name-line"><h1>{profile.full_name}</h1><CheckCircle2 className="text-success" size={21} /><span className="dp-talent"><Crown size={12} />Top Talent</span></div><p className="dp-designation">{profile.professional_headline}</p><p className="dp-specialty">{profile.sub_headline}</p><div className="dp-contact-details"><span><MapPin />{profile.location}</span><a href={`tel:${profile.phone.replace(/\s/g, "")}`}><Phone />{profile.phone}</a><a href={`mailto:${profile.email}`}><Mail />{profile.email}</a><a href={details.primaryLinks[0].url} target="_blank" rel="noreferrer"><Linkedin />linkedin.com/in/arjunmehta</a></div></div></div>
            <div className="dp-intro"><p>{profile.about_summary}</p><div className="dp-badges">{badges.map(({ name, icon: Icon, tone }) => <span key={name}><i className={`dp-tone-${tone}`}><Icon size={13} /></i>{name}</span>)}</div></div>
          </div>
          <div className="dp-summary">
            <div className="dp-candidate-actions">
              {/* Separate "Open to Work" Button */}
              {isOpenToWork && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="dp-status border-emerald-500/40 text-emerald-700 bg-emerald-500/10 hover:bg-emerald-500/15 cursor-pointer">
                      <span className="dp-status-dot bg-emerald-500" />
                      Open to Work
                      <ChevronDown className="h-3.5 w-3.5 opacity-60 ml-0.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => { setIsOpenToWork(false); toast.info("Removed 'Open to Work' status"); }}>
                      Hide "Open to Work" badge
                    </DropdownMenuItem>
                    {!isOpenForFreelance && (
                      <DropdownMenuItem onClick={() => { setIsOpenForFreelance(true); toast.success("Added 'Open for Freelancing' status"); }}>
                        + Add "Open for Freelancing" badge
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Separate "Open for Freelancing" Button */}
              {isOpenForFreelance && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="dp-status border-sky-500/40 text-sky-700 bg-sky-500/10 hover:bg-sky-500/15 cursor-pointer">
                      <span className="dp-status-dot bg-sky-500" />
                      Open for Freelancing
                      <ChevronDown className="h-3.5 w-3.5 opacity-60 ml-0.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => { setIsOpenForFreelance(false); toast.info("Removed 'Open for Freelancing' status"); }}>
                      Hide "Open for Freelancing" badge
                    </DropdownMenuItem>
                    {!isOpenToWork && (
                      <DropdownMenuItem onClick={() => { setIsOpenToWork(true); toast.success("Added 'Open to Work' status"); }}>
                        + Add "Open to Work" badge
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* When neither is enabled, show an option to set availability */}
              {!isOpenToWork && !isOpenForFreelance && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="dp-status border-dashed text-muted-foreground hover:text-foreground cursor-pointer">
                      <Plus className="h-3.5 w-3.5 mr-1 text-primary" />
                      Set Availability Status
                      <ChevronDown className="h-3.5 w-3.5 opacity-60 ml-0.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => { setIsOpenToWork(true); toast.success("Enabled 'Open to Work'"); }}>
                      <span className="dp-status-dot bg-emerald-500 mr-2" />
                      Enable "Open to Work"
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setIsOpenForFreelance(true); toast.success("Enabled 'Open for Freelancing'"); }}>
                      <span className="dp-status-dot bg-sky-500 mr-2" />
                      Enable "Open for Freelancing"
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setIsOpenToWork(true); setIsOpenForFreelance(true); toast.success("Enabled both statuses"); }}>
                      Enable Both (Full-time & Freelance)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <Button onClick={() => setContactOpen(true)} className="cursor-pointer">
                <Mail />Contact Candidate
              </Button>
              <Button variant="outline" onClick={downloadResume} className="cursor-pointer">
                <Download /><span>Download Resume</span>
              </Button>

              {/* Video Resume Button before Share Button */}
              <Button
                variant="outline"
                onClick={() => setVideoResumeOpen(true)}
                className="gap-2 border-primary/40 bg-primary/5 text-primary hover:bg-primary/10 font-semibold cursor-pointer"
              >
                <Video className="h-4 w-4 text-primary" />
                <span>Video Resume</span>
              </Button>

              <Button variant="outline" onClick={share} className="cursor-pointer">
                <Share2 /><span>Share</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" aria-label="More profile actions" className="cursor-pointer">
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => setSaved(!saved)}>
                    {saved ? "Remove from shortlist" : "Save to shortlist"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => { setIsOpenToWork(prev => !prev); toast.info(isOpenToWork ? "Disabled 'Open to Work'" : "Enabled 'Open to Work'"); }}>
                    {isOpenToWork ? "Disable 'Open to Work'" : "Enable 'Open to Work'"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => { setIsOpenForFreelance(prev => !prev); toast.info(isOpenForFreelance ? "Disabled 'Open for Freelancing'" : "Enabled 'Open for Freelancing'"); }}>
                    {isOpenForFreelance ? "Disable 'Open for Freelancing'" : "Enable 'Open for Freelancing'"}
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Edit profile</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </section>
        <div className="dp-columns">
          <div className="dp-content-column">
            <nav className="dp-tabs" aria-label="Profile sections">{tabs.map(tab => <Button key={tab.id} variant="ghost" aria-current={activeTab === tab.id ? "location" : undefined} className={cn(activeTab === tab.id && "active")} onClick={() => scrollTo(tab.id)}>{tab.label}</Button>)}</nav>
            <Panel id="about-me" title="About Me" icon={UserRound} action={<Edit />}><p className="dp-body-text">{profile.about_summary}</p><div className="dp-expertise">{expertise.map(({ title, sub, icon: Icon, tone }) => <div key={title}><i className={`dp-tone-${tone}`}><Icon size={24} /></i><div><strong>{title}</strong><span>{sub}</span></div></div>)}</div></Panel>
            <Panel id="experience" title="Work Experience" icon={BriefcaseBusiness} action={<span className="dp-muted">3 positions</span>}><div className="dp-timeline">{details.experiences.map((e, i) => <article key={e.job_title}><div className={cn("dp-company-symbol", i === 0 ? "dp-tone-blue" : i === 1 ? "dp-tone-red" : "dp-tone-violet")}>{i === 0 ? "TN" : i === 1 ? <Cloud /> : <Layers />}</div><div className="dp-job"><div className="dp-job-heading"><h3>{e.job_title}</h3><span>{e.period}</span></div><p>{e.company_name}<span className="dp-separator">·</span>{e.location}</p><p>{e.description}</p><Chips items={e.tools} /></div></article>)}</div></Panel>
            <Panel id="skills" title="Skills" icon={Code2}><div className="dp-skill-list">{details.skills.map(skill => <article key={skill.name}><i className="dp-tone-blue"><Code2 size={20} /></i><div><h3>{skill.name}</h3><p>{skill.level}</p></div><span className="dp-verified"><CheckCircle2 size={12} />Verified</span></article>)}</div></Panel>
            <Panel id="tools" title="Tools" icon={Wrench}><Chips items={details.tools} /></Panel>
            <Panel id="projects" title="Projects" icon={GraduationCap} action={<Button asChild variant="link" className="dp-text-action"><Link to="/pro?view=port">View all projects<ArrowRight /></Link></Button>}><div className="dp-projects">{details.projects.map((p, i) => <article key={p.title}><img src={i === 0 ? cloudProject : parserProject} alt={`${p.title} application preview`} width={1024} height={640} loading="lazy" /><h3>{p.title}</h3><p>{p.description}</p><Chips items={p.tools} /><div className="dp-project-links"><Button variant="link" onClick={() => toast.info("This is a demo project preview.")}><ExternalLink />Live Demo</Button><a href="https://github.com" target="_blank" rel="noreferrer"><Github size={13} />GitHub</a></div></article>)}</div></Panel>
            <div className="dp-lower-grid">
              <Panel id="education" title="Education" icon={GraduationCap} action={view("education", "View all education")}><div className="dp-education">{details.educations.map((e, i) => <article key={e.institution_name}><div className={cn("dp-school", i === 0 ? "dp-tone-blue" : i === 1 ? "dp-tone-red" : "dp-tone-green")}><GraduationCap size={32} /></div><div><h3>{e.institution_name}</h3><p>{e.degree}</p><p>{e.years}<span className="dp-separator">·</span>{e.grade}</p></div></article>)}</div></Panel>
              <Panel id="certifications" title="Certifications" icon={FileCheck} action={view("certifications", "View all")}><div className="dp-certifications">{details.certifications.map(c => <article key={c.name}>{c.logo && <img src={c.logo} alt={c.org} loading="lazy" />}<div><h3>{c.name}</h3><p>{c.org}</p><div className="dp-cert-date"><span>{c.date}</span><span className="dp-verified"><CheckCircle2 size={12} />Verified</span></div></div></article>)}</div></Panel>
            </div>
            <Panel id="awards" title="Awards" icon={Trophy}><div className="dp-awards">{details.achievements.map(({ title, description, icon: Icon }) => <article key={title}><i className="dp-tone-blue"><Icon size={22} /></i><div><h3>{title}</h3><p>{description}</p></div></article>)}</div></Panel>
            <Panel id="languages" title="Languages" icon={Languages}><Chips items={details.languages} /></Panel>
            <Panel id="hobbies" title="Hobbies" icon={Palette}><Chips items={details.hobbies} /></Panel>
            <Panel id="interests" title="Interests" icon={Heart}><Chips items={details.interests} /></Panel>
          </div>
        </div>
        <section id="links" className="dp-profile-links">{details.primaryLinks.map(({ label, url, icon: Icon }) => <a key={label} href={url} target="_blank" rel="noreferrer"><Icon size={15} />{label}<ExternalLink size={12} /></a>)}<span><span className="dp-status-dot" />Last active: 2h ago</span></section>
      </main>
      <Dialog open={contactOpen} onOpenChange={setContactOpen}><DialogContent><DialogHeader><DialogTitle>Contact {profile.full_name}</DialogTitle></DialogHeader><p className="text-sm text-muted-foreground">Demo candidate contact details</p><Button asChild variant="outline"><a href={`mailto:${profile.email}`}><Mail />{profile.email}</a></Button><Button asChild variant="outline"><a href={`tel:${profile.phone.replace(/\s/g, "")}`}><Phone />{profile.phone}</a></Button></DialogContent></Dialog>

      {/* Full-Page Video Resume Modal */}
      {videoResumeOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950 text-white flex flex-col overflow-y-auto animate-fade-in">
          <header className="h-16 px-6 border-b border-white/10 flex items-center justify-between shrink-0 bg-slate-950/90 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full overflow-hidden border border-white/20 shrink-0">
                <img src={profile.profile_photo_url} alt={profile.full_name} className="h-full w-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white">{profile.full_name}</h2>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/20 text-blue-300 border border-blue-400/30">
                    <Sparkles className="h-3 w-3" /> 60s Video Resume
                  </span>
                </div>
                <p className="text-xs text-slate-400">{profile.professional_headline}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                size="sm"
                onClick={() => { setVideoResumeOpen(false); setContactOpen(true); }}
                className="cursor-pointer gap-1.5 bg-primary text-white hover:bg-primary/90 text-xs"
              >
                <Mail className="h-3.5 w-3.5" />
                Contact Candidate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadResume}
                className="cursor-pointer gap-1.5 border-white/20 text-white hover:bg-white/10 text-xs"
              >
                <Download className="h-3.5 w-3.5" />
                Download Resume
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setVideoResumeOpen(false)}
                className="cursor-pointer gap-1 text-slate-300 hover:text-white hover:bg-white/10 text-xs"
              >
                <X className="h-4 w-4" />
                Close Fullscreen
              </Button>
            </div>
          </header>

          <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-[1.8fr_1.2fr] gap-6 items-start">
            <div className="space-y-4">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/15 shadow-2xl">
                <video
                  src="/product-in-60-sec.mp4"
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                  poster={cloudProject}
                />
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Video className="h-4 w-4 text-primary" />
                    Candidate Video Pitch
                  </h3>
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Verified by Talento CIR
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  "Hello! I'm Arjun Mehta. In this 60-second video resume, I walk you through my real-world engineering background, technical decision-making, and what I bring to distributed product teams. I specialize in designing scalable frontend systems with React and TypeScript, backed by robust cloud microservices on AWS."
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Pitch Chapters & Highlights</h3>
                <div className="space-y-2">
                  {[
                    { time: "0:00", title: "Introduction & Core Background", desc: "Full Stack journey and key career milestones." },
                    { time: "0:18", title: "Frontend Architecture & React", desc: "State management, performance tuning, and design systems." },
                    { time: "0:35", title: "Cloud Infrastructure & Docker", desc: "Microservices, AWS deployments, and automated testing." },
                    { time: "0:50", title: "Team Leadership & Availability", desc: "Current notice period, remote work preference & culture fit." },
                  ].map((chap) => (
                    <div key={chap.time} className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                      <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary/20 shrink-0">
                        {chap.time}
                      </span>
                      <div className="space-y-0.5 text-xs">
                        <strong className="text-white font-semibold block">{chap.title}</strong>
                        <p className="text-slate-400 text-[11px]">{chap.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Core Technical Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {details.skills.map((s) => (
                    <span key={s.name} className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-xs font-medium text-slate-200">
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-300">Availability Status:</span>
                <div className="flex gap-2">
                  {isOpenToWork && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" /> Open to Work
                    </span>
                  )}
                  {isOpenForFreelance && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                      <span className="h-2 w-2 rounded-full bg-sky-500" /> Open for Freelancing
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DemoProfile() {
  return <div className="demo-dashboard">
    <Helmet><title>Arjun Mehta | Demo Profile | Talento</title><meta name="description" content="Explore Arjun Mehta’s demo Talento profile, verified skills, work experience, projects and certifications." /></Helmet>
    <header className="dp-header">
      <Link to="/" aria-label="Talento home" className="dp-logo"><img src={siteLogo.url} alt="Talento" /></Link>
      <nav aria-label="Main navigation" className="dp-topnav">{[...[navigation[1]], { label: "Talento Pro", href: "/pro" }, ...navigation.slice(2, 4), { label: "Pricing", href: "/pricing" }, ...navigation.slice(4)].map(n => <Link key={n.label} to={n.href}>{n.label}</Link>)}</nav>
      <div className="dp-header-actions">
        <Button asChild variant="ghost" size="icon" aria-label="Search jobs" title="Search jobs"><Link to="/jobs"><Search /></Link></Button>
        <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label="Notifications" title="Notifications" className="dp-notification"><Bell /><span /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem>No new notifications</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
        <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" className="dp-account" aria-label="Profile menu"><img src={profile.profile_photo_url} alt="Arjun Mehta" /><ChevronDown /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem asChild><Link to="/profile">Edit Profile</Link></DropdownMenuItem><DropdownMenuItem asChild><Link to="/pro">Talento Pro</Link></DropdownMenuItem></DropdownMenuContent></DropdownMenu>
      </div>
    </header>
    <DemoProfileDashboardContent />
  </div>;
}
