import { useState, type ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { demoProfile as profile, demoProfileDetails as details } from "@/components/profile/DemoProfileBody";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Bell, BookOpen, Brain, BriefcaseBusiness, CheckCircle2, ChevronDown, Cloud, Code2, Crown, Download, ExternalLink, FileCheck, FileText, Github, GraduationCap, Heart, Languages, Layers, Linkedin, Mail, MapPin, MoreHorizontal, Palette, Pencil, Phone, Search, Share2, ShieldCheck, Trophy, UserRound, Users, Wrench, type LucideIcon } from "lucide-react";
import siteLogo from "@/assets/I-am-Talento-2.png.asset.json";
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

export default function DemoProfile() {
  const [activeTab, setActiveTab] = useState("about-me");
  const [contactOpen, setContactOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [status, setStatus] = useState("Open to Work");
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

  return <div className="demo-dashboard">
    <Helmet><title>Arjun Mehta — Demo Profile | Talento</title><meta name="description" content="Explore Arjun Mehta’s demo Talento profile, verified skills, work experience, projects and certifications." /></Helmet>
    <header className="dp-header">
      <Link to="/" aria-label="Talento home" className="dp-logo"><img src={siteLogo.url} alt="Talento" /></Link>
      <nav aria-label="Main navigation" className="dp-topnav">{[...[navigation[1]], { label: "Talento Pro", href: "/pro" }, ...navigation.slice(2, 4), { label: "Pricing", href: "/pricing" }, ...navigation.slice(4)].map(n => <Link key={n.label} to={n.href}>{n.label}</Link>)}</nav>
      <div className="dp-header-actions">
        <Button asChild variant="ghost" size="icon" aria-label="Search jobs" title="Search jobs"><Link to="/jobs"><Search /></Link></Button>
        <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label="Notifications" title="Notifications" className="dp-notification"><Bell /><span /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem>No new notifications</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
        <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" className="dp-account" aria-label="Profile menu"><img src={profile.profile_photo_url} alt="Arjun Mehta" /><ChevronDown /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem asChild><Link to="/profile">Edit Profile</Link></DropdownMenuItem><DropdownMenuItem asChild><Link to="/pro">Talento Pro</Link></DropdownMenuItem></DropdownMenuContent></DropdownMenu>
      </div>
    </header>
    <main className="dp-main">
      <section id="overview" className="dp-overview">
        <div className="dp-cover"><img src={cover} width={1920} height={512} alt="Modern office overlooking the city at sunset" /><Button asChild variant="ghost" className="dp-back"><Link to="/jobs"><ArrowLeft />Back to Search</Link></Button>
        </div>
        <div className="dp-identity">
          <div className="dp-person"><div className="dp-avatar"><img src={profile.profile_photo_url} alt={profile.full_name} /><span /></div><div className="dp-name"><div className="dp-name-line"><h1>{profile.full_name}</h1><CheckCircle2 className="text-success" size={21} /><span className="dp-talent"><Crown size={12} />Top Talent</span></div><p className="dp-designation">{profile.professional_headline}</p><p className="dp-specialty">{profile.sub_headline}</p><div className="dp-contact-details"><span><MapPin />{profile.location}</span><a href={`tel:${profile.phone.replace(/\s/g, "")}`}><Phone />{profile.phone}</a><a href={`mailto:${profile.email}`}><Mail />{profile.email}</a><a href={details.primaryLinks[0].url} target="_blank" rel="noreferrer"><Linkedin />linkedin.com/in/arjunmehta</a></div></div></div>
          <div className="dp-intro"><p>{profile.about_summary}</p><div className="dp-badges">{badges.map(({ name, icon: Icon, tone }) => <span key={name}><i className={`dp-tone-${tone}`}><Icon size={13} /></i>{name}</span>)}</div></div>
        </div>
        <div className="dp-summary"><div className="dp-candidate-actions"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="dp-status"><span className="dp-status-dot" />{status}<ChevronDown /></Button></DropdownMenuTrigger><DropdownMenuContent align="start">{["Open to Work", "Open for Freelancing"].map(s => <DropdownMenuItem key={s} onSelect={() => setStatus(s)}>{s}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu><Button onClick={() => setContactOpen(true)}><Mail />Contact Candidate</Button><Button variant="outline" onClick={downloadResume}><Download /><span>Download Resume</span></Button><Button variant="outline" onClick={share}><Share2 /><span>Share</span></Button><DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" size="icon" aria-label="More profile actions"><MoreHorizontal /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onSelect={() => setSaved(!saved)}>{saved ? "Remove from shortlist" : "Save to shortlist"}</DropdownMenuItem><DropdownMenuItem asChild><Link to="/profile">Edit profile</Link></DropdownMenuItem></DropdownMenuContent></DropdownMenu></div></div>
      </section>
      <div className="dp-columns">
        <div className="dp-content-column">
          <nav className="dp-tabs" aria-label="Profile sections">{tabs.map(tab => <Button key={tab.id} variant="ghost" aria-current={activeTab === tab.id ? "location" : undefined} className={cn(activeTab === tab.id && "active")} onClick={() => scrollTo(tab.id)}>{tab.label}</Button>)}</nav>
          <Panel id="about-me" title="About Me" icon={UserRound} action={<Edit />}><p className="dp-body-text">{profile.about_summary}</p><div className="dp-expertise">{expertise.map(({ title, sub, icon: Icon, tone }) => <div key={title}><i className={`dp-tone-${tone}`}><Icon size={24} /></i><div><strong>{title}</strong><span>{sub}</span></div></div>)}</div></Panel>
          <Panel id="experience" title="Work Experience" icon={BriefcaseBusiness} action={<span className="dp-muted">3 positions</span>}><div className="dp-timeline">{details.experiences.map((e, i) => <article key={e.job_title}><div className={cn("dp-company-symbol", i === 0 ? "dp-tone-blue" : i === 1 ? "dp-tone-red" : "dp-tone-violet")}>{i === 0 ? "TN" : i === 1 ? <Cloud /> : <Layers />}</div><div className="dp-job"><div className="dp-job-heading"><h3>{e.job_title}</h3><span>{e.period}</span></div><p>{e.company_name}<span className="dp-separator">·</span>{e.location}</p><p>{e.description}</p><Chips items={e.tools} /></div></article>)}</div></Panel>
          <Panel id="skills" title="Skills" icon={Code2}><div className="dp-skill-list">{details.skills.map(skill => <article key={skill.name}><i className="dp-tone-blue"><Code2 size={20} /></i><div><h3>{skill.name}</h3><p>{skill.level}</p></div><span className="dp-verified"><CheckCircle2 size={12} />Verified</span></article>)}</div></Panel>
          <Panel id="tools" title="Tools" icon={Wrench}><Chips items={details.tools} /></Panel>
          <Panel id="projects" title="Projects" icon={GraduationCap} action={<Button asChild variant="link" className="dp-text-action"><Link to="/pro?view=portfolio">View all projects<ArrowRight /></Link></Button>}><div className="dp-projects">{details.projects.map((p, i) => <article key={p.title}><img src={i === 0 ? cloudProject : parserProject} alt={`${p.title} application preview`} width={1024} height={640} loading="lazy" /><h3>{p.title}</h3><p>{p.description}</p><Chips items={p.tools} /><div className="dp-project-links"><Button variant="link" onClick={() => toast.info("This is a demo project preview.")}><ExternalLink />Live Demo</Button><a href="https://github.com" target="_blank" rel="noreferrer"><Github size={13} />GitHub</a></div></article>)}</div></Panel>
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
  </div>;
}
