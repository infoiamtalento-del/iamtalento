import React, { useState } from "react";
import {
  FileText,
  Sparkles,
  Download,
  Copy,
  Check,
  Plus,
  ShieldCheck,
  User,
  Briefcase,
  GraduationCap,
  Layers,
  Wand2,
  Share2,
  X,
  Bot,
  Eye,
  Phone,
  Mail,
  MapPin,
  Linkedin,
  Github,
  Globe,
  Lightbulb,
  LayoutTemplate,
  ChevronDown,
  FolderGit2,
  Zap,
  Languages as LanguagesIcon,
  Search,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ProUser, ProJob } from "@/data/proData";
import { ProHero } from "./ProHero";

interface ProResumeBuilderViewProps {
  user: ProUser;
  jobs: ProJob[];
  onSaveUser: (updatedUser: ProUser) => void;
  onToast: (msg: string) => void;
}

type TabKey = "basic" | "summary" | "skills" | "exp" | "edu" | "proj";
type TemplateKey = "modern" | "professional" | "creative" | "minimal";

const EXP_LEVELS = ["Fresher", "1-2 yrs", "3-5 yrs", "5+ yrs"];
const levelFromYears = (x?: number) => (!x || x < 1 ? "Fresher" : x < 3 ? "1-2 yrs" : x < 6 ? "3-5 yrs" : "5+ yrs");

const inputCls = "h-9 rounded-lg text-xs";
const labelCls = "mb-1 block text-[11px] font-medium text-muted-foreground";
const tile = "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary";

const StepBadge: React.FC<{ n: number }> = ({ n }) => (
  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
    {n}
  </span>
);

export const ProResumeBuilderView: React.FC<ProResumeBuilderViewProps> = ({
  user,
  jobs,
  onSaveUser,
  onToast,
}) => {
  const [targetJob, setTargetJob] = useState("");
  const [targetRole, setTargetRole] = useState(user.rs?.role || "Frontend Developer");
  const [expLevel, setExpLevel] = useState(levelFromYears(user.exp));
  const [activeTab, setActiveTab] = useState<TabKey>("basic");
  const [activeTemplate, setActiveTemplate] = useState<TemplateKey>("modern");
  const [accentColor, setAccentColor] = useState("#ec2639");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showCerts, setShowCerts] = useState(true);
  const [showLanguages, setShowLanguages] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [coverLetterText, setCoverLetterText] = useState("");

  // Resume state initialized from user profile
  const [resumeData, setResumeData] = useState(() => ({
    name: user.name || "Arjun Mehta",
    headline: user.head || "Frontend Developer",
    email: user.email || "arjun@example.com",
    phone: user.ph ? `+91 ${user.ph}` : "+91 98765 43210",
    city: user.city || "Bengaluru, India",
    linkedin: user.links?.li || "linkedin.com/in/arjun",
    portfolio: user.links?.gh || "github.com/arjun",
    summary:
      user.about ||
      "Results-driven Frontend Engineer with 3+ years delivering accessible, high-performance web products. Experienced in modern component architectures, TypeScript, and Web Vitals optimization.",
    skills: [...(user.sk || ["React", "TypeScript", "Next.js", "Tailwind CSS", "Node.js", "SQL"])],
    languages: [
      { name: "English", level: "Fluent" },
      { name: "Hindi", level: "Fluent" },
      { name: "Tamil", level: "Native" },
    ],
    experience: user.ex?.map((e) => ({
      role: e.role,
      company: e.co,
      period: `${e.fr} – ${e.to}`,
      bullets: [
        e.d || "Engineered customer checkout flows reducing page load times by 35%.",
        "Spearheaded design system migration to Tailwind CSS across engineering pods.",
      ],
    })) || [
      {
        role: "Frontend Engineer",
        company: "Swiggy",
        period: "2023 – Present",
        bullets: [
          "Engineered customer checkout flow reducing page load times by 35%.",
          "Spearheaded design system migration to modern Tailwind tokens and Radix primitives.",
        ],
      },
    ],
    education: user.ed?.map((e) => ({
      degree: e.dg,
      school: e.sc,
      year: e.yr,
    })) || [
      {
        degree: "B.Tech Computer Science & Engineering",
        school: "VTU Bengaluru",
        year: "2017 – 2021",
      },
    ],
    projects: user.pj?.map((p) => ({
      name: p.t,
      link: p.l,
      desc: p.d,
    })) || [
      {
        name: "OpenUI Component Library",
        link: "github.com/vignesh/openui",
        desc: "Tree-shakeable, WCAG AA compliant headless UI system.",
      },
    ],
    certifications: (user.ce || []).map((c) => {
      const p = String(c).split(" · ");
      return { name: p[0] || String(c), issuer: p[1] || "", year: p[2] || "" };
    }),
  }));

  const [newSkill, setNewSkill] = useState("");
  const role = targetJob.trim() || targetRole;
  const initials =
    resumeData.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "ME";

  // Keyword optimization
  const recommendedKeywords: Record<string, string[]> = {
    "Frontend Developer": ["React", "TypeScript", "Next.js", "Tailwind CSS", "Redux", "Jest", "GraphQL", "CI/CD"],
    "Full Stack Developer": ["Node.js", "React", "PostgreSQL", "Docker", "REST APIs", "AWS", "TypeScript", "Redis"],
    "Software Engineer": ["Algorithms", "System Design", "Java", "Python", "Git", "Microservices", "Unit Testing"],
    "Data Analyst": ["Python", "SQL", "Tableau", "PowerBI", "Pandas", "Statistics", "Data Modeling"],
  };

  const currentRoleKeywords = recommendedKeywords[targetRole] || recommendedKeywords["Frontend Developer"];
  const matchedKeywords = currentRoleKeywords.filter((k) =>
    resumeData.skills.some((s) => s.toLowerCase() === k.toLowerCase())
  );
  const atsScore = Math.min(95, Math.round(70 + (matchedKeywords.length / currentRoleKeywords.length) * 25));

  const handleGenerateAI = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setResumeData((prev) => ({
        ...prev,
        headline: role,
        summary: `Strategic ${role} with a strong foundation in scalable architectures and modern software engineering. Demonstrated success collaborating in high-velocity teams to drive measurable user engagement, performance benchmarks, and dependable test coverage.`,
      }));
      setIsGenerating(false);
      onToast("Resume summary & ATS keywords optimized by AI!");
    }, 800);
  };

  const handleSampleTemplate = () => {
    setResumeData((prev) => ({
      ...prev,
      summary:
        "Results-driven Frontend Engineer with 3+ years delivering accessible, high-performance web products. Experienced in modern component architectures, TypeScript, and Web Vitals optimization.",
      skills: Array.from(new Set([...prev.skills, ...currentRoleKeywords.slice(0, 4)])),
    }));
    onToast("Sample template applied. Edit any section to make it yours.");
  };

  const handleGenerateCoverLetter = () => {
    setShowCoverLetter(true);
    setCoverLetterText(
      `Dear Hiring Manager,\n\nI am writing to express my enthusiastic interest in the ${role} position. With verified experience across modern engineering practices, scalable systems, and collaborative development, I am eager to contribute to your team's upcoming milestones.\n\nThroughout my background, I have consistently focused on building resilient, user-centric software while optimizing core performance metrics. My experience with ${resumeData.skills.slice(0, 4).join(", ")} aligns directly with your team's technical focus.\n\nI welcome the opportunity to discuss how my technical skills and proactive work ethic can bring immediate value to your organization.\n\nSincerely,\n${resumeData.name}\n${resumeData.email} • ${resumeData.phone}`
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const text = `
${resumeData.name}
${resumeData.email} | ${resumeData.phone} | ${resumeData.city}
${resumeData.linkedin} | ${resumeData.portfolio}

PROFESSIONAL SUMMARY
${resumeData.summary}

SKILLS
${resumeData.skills.join(", ")}

EXPERIENCE
${resumeData.experience
  .map(
    (e) => `
${e.role} at ${e.company} (${e.period})
${e.bullets.map((b) => `• ${b}`).join("\n")}
`
  )
  .join("")}

PROJECTS
${resumeData.projects.map((p) => `${p.name} (${p.link}): ${p.desc}`).join("\n")}

EDUCATION
${resumeData.education.map((ed) => `${ed.degree}, ${ed.school} (${ed.year})`).join("\n")}
    `.trim();

    navigator.clipboard.writeText(text);
    onToast("Resume text copied to clipboard!");
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    onToast("Link copied to clipboard!");
  };

  const addSkill = (s: string) => {
    const v = s.trim();
    if (!v) return;
    if (resumeData.skills.some((x) => x.toLowerCase() === v.toLowerCase())) return;
    setResumeData({ ...resumeData, skills: [...resumeData.skills, v] });
  };

  const templates: { id: TemplateKey; label: string }[] = [
    { id: "modern", label: "Modern" },
    { id: "professional", label: "Professional" },
    { id: "creative", label: "Creative" },
    { id: "minimal", label: "Minimal" },
  ];

  const nextTemplate = () => {
    const i = templates.findIndex((t) => t.id === activeTemplate);
    setActiveTemplate(templates[(i + 1) % templates.length].id);
  };

  const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
    { key: "basic", label: "Basic Info", icon: User },
    { key: "summary", label: "Summary", icon: FileText },
    { key: "skills", label: "Skills", icon: Layers },
    { key: "exp", label: "Experience", icon: Briefcase },
    { key: "edu", label: "Education", icon: GraduationCap },
    { key: "proj", label: "Projects", icon: FolderGit2 },
  ];

  const basicFields: { key: "name" | "email" | "phone" | "city" | "linkedin" | "portfolio"; label: string }[] = [
    { key: "name", label: "Full Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "city", label: "Location" },
    { key: "linkedin", label: "LinkedIn (optional)" },
    { key: "portfolio", label: "Portfolio (optional)" },
  ];

  const sectionTitle = (t: string) => (
    <h2
      className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider"
      style={{ color: accentColor }}
    >
      {t}
    </h2>
  );

  const proTips = ["Keep it concise (1-2 pages)", "Use action verbs", "Quantify your achievements", "Tailor it for each job"];
  const tipActions = [
    { icon: Download, title: "Download PDF", sub: "Save your resume", onClick: handlePrint },
    { icon: Share2, title: "Share Link", sub: "Share with recruiters", onClick: handleShareLink },
    { icon: FileText, title: "Cover Letter", sub: "Create with AI", onClick: handleGenerateCoverLetter },
    { icon: LayoutTemplate, title: "More Templates", sub: "Explore designs and colors", onClick: nextTemplate },
  ];

  return (
    <div className="space-y-5">
      <ProHero
        icon={<Bot />}
        title="Resume Builder AI"
        subtitle="Create a professional, ATS-friendly resume in minutes. Just add your details, and let our AI craft a powerful summary, skills, and experience section for you."
        aside={
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:w-[34rem]">
            {[
              { icon: Sparkles, t: "AI Powered", s: "Smart & professional" },
              { icon: ShieldCheck, t: "ATS Friendly", s: "Get more interviews" },
              { icon: BadgeCheck, t: "100% Free", s: "No hidden charges" },
            ].map(({ icon: Icon, t, s }) => (
              <div
                key={t}
                className="flex items-center gap-2.5 rounded-xl bg-white/15 px-3 py-2.5 text-white ring-1 ring-white/30 backdrop-blur-sm"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/20">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-bold">{t}</span>
                  <span className="block truncate text-[10px] text-white/85">{s}</span>
                </span>
              </div>
            ))}
          </div>
        }
      />

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        {/* Left controls */}
        <div className="space-y-4">
          {/* Step 1: Target Job */}
          <div className="space-y-3.5 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2.5">
              <StepBadge n={1} />
              <div>
                <h3 className="font-display text-sm font-semibold text-foreground">Target Job</h3>
                <p className="text-[11px] text-muted-foreground">Tell us the job you are applying for</p>
              </div>
            </div>

            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={targetJob}
                onChange={(e) => setTargetJob(e.target.value)}
                placeholder="e.g. Frontend Developer, Digital Marketing Specialist, Data Analyst"
                className="h-10 rounded-xl pl-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Job Title</label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="h-9 w-full rounded-lg border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option>Frontend Developer</option>
                  <option>Full Stack Developer</option>
                  <option>Software Engineer</option>
                  <option>Data Analyst</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Experience Level</label>
                <div className="flex flex-wrap items-center gap-1.5">
                  {EXP_LEVELS.map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setExpLevel(lvl)}
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                        expLevel === lvl
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Button
                onClick={handleGenerateAI}
                disabled={isGenerating}
                className="h-10 gap-1.5 rounded-xl text-xs font-semibold shadow-md shadow-primary/25"
              >
                <Wand2 className="h-3.5 w-3.5" />
                {isGenerating ? "Crafting with AI..." : "Generate with AI"}
              </Button>
              <Button
                variant="outline"
                onClick={handleSampleTemplate}
                className="h-10 gap-1.5 rounded-xl border-primary/40 bg-background text-xs font-semibold text-primary hover:bg-primary/5 hover:text-primary"
              >
                <Copy className="h-3.5 w-3.5" /> Use Sample Template
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Smart templates with your summary and bullets from your profile. Add an AI key in settings for full AI text.
            </p>
          </div>

          {/* Step 2: Tabbed editor */}
          <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2.5">
              <StepBadge n={2} />
              <div>
                <h3 className="font-display text-sm font-semibold text-foreground">Edit &amp; Personalize</h3>
                <p className="text-[11px] text-muted-foreground">Modify the generated content to match your profile perfectly</p>
              </div>
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {tabs.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={cn(
                    "flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors",
                    activeTab === key
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-3 w-3" /> {label}
                </button>
              ))}
            </div>

            {activeTab === "basic" && (
              <div className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-background p-3 sm:grid-cols-3">
                {basicFields.map((f) => (
                  <div key={f.key}>
                    <label className={labelCls}>{f.label}</label>
                    <Input
                      value={resumeData[f.key]}
                      onChange={(e) => setResumeData({ ...resumeData, [f.key]: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                ))}
                <div className="sm:col-span-3">
                  <label className={labelCls}>Headline</label>
                  <Input
                    value={resumeData.headline}
                    onChange={(e) => setResumeData({ ...resumeData, headline: e.target.value })}
                    className={inputCls}
                  />
                </div>
              </div>
            )}

            {activeTab === "summary" && (
              <div className="space-y-2">
                <label className={labelCls}>Professional summary</label>
                <Textarea
                  rows={5}
                  value={resumeData.summary}
                  onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                  className="text-xs leading-relaxed"
                />
              </div>
            )}

            {activeTab === "skills" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">Skills on resume ({resumeData.skills.length})</span>
                  <span className="font-semibold text-primary">ATS match: {atsScore}%</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {resumeData.skills.map((skill, idx) => (
                    <span
                      key={`${skill}-${idx}`}
                      className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/60 px-2.5 py-1 text-[11px] font-medium text-foreground"
                    >
                      {skill}
                      <button
                        type="button"
                        aria-label={`Remove ${skill}`}
                        onClick={() =>
                          setResumeData({
                            ...resumeData,
                            skills: resumeData.skills.filter((_, i) => i !== idx),
                          })
                        }
                        className="text-muted-foreground hover:text-primary"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Add a skill, e.g. Docker, GraphQL"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newSkill.trim()) {
                        e.preventDefault();
                        addSkill(newSkill);
                        setNewSkill("");
                      }
                    }}
                    className={inputCls}
                  />
                  <Button
                    size="sm"
                    className="h-9 shrink-0 gap-1 rounded-lg px-3 text-xs"
                    onClick={() => {
                      addSkill(newSkill);
                      setNewSkill("");
                    }}
                  >
                    <Plus className="h-3.5 w-3.5" /> Add
                  </Button>
                </div>
                <div className="space-y-2 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-foreground">
                    <Sparkles className="h-3.5 w-3.5 text-primary" /> Recommended keywords for {targetRole}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {currentRoleKeywords.map((kw) => {
                      const alreadyHas = resumeData.skills.some((s) => s.toLowerCase() === kw.toLowerCase());
                      if (alreadyHas) return null;
                      return (
                        <button
                          key={kw}
                          type="button"
                          onClick={() => addSkill(kw)}
                          className="rounded-full border border-primary/30 bg-background px-2.5 py-0.5 text-[11px] font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                        >
                          + {kw}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "exp" && (
              <div className="space-y-3">
                {resumeData.experience.map((exp, idx) => (
                  <div key={idx} className="space-y-2 rounded-xl border border-border bg-background p-3 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-semibold text-foreground">
                        {exp.role} at {exp.company}
                      </div>
                      <span className="text-muted-foreground">{exp.period}</span>
                    </div>
                    <Textarea
                      rows={3}
                      value={exp.bullets.join("\n")}
                      onChange={(e) => {
                        const experience = resumeData.experience.map((x, i) =>
                          i === idx ? { ...x, bullets: e.target.value.split("\n") } : x
                        );
                        setResumeData({ ...resumeData, experience });
                      }}
                      className="text-xs"
                      placeholder="One bullet point per line..."
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === "edu" && (
              <div className="space-y-2.5">
                {resumeData.education.map((edu, idx) => (
                  <div key={idx} className="space-y-1 rounded-xl border border-border bg-background p-3 text-xs">
                    <div className="font-semibold text-foreground">{edu.degree}</div>
                    <div className="text-muted-foreground">
                      {edu.school} · {edu.year}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "proj" && (
              <div className="space-y-3">
                {resumeData.projects.map((p, idx) => (
                  <div key={idx} className="space-y-2 rounded-xl border border-border bg-background p-3">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <Input
                        value={p.name}
                        onChange={(e) =>
                          setResumeData({
                            ...resumeData,
                            projects: resumeData.projects.map((x, i) => (i === idx ? { ...x, name: e.target.value } : x)),
                          })
                        }
                        className={inputCls}
                        placeholder="Project name"
                      />
                      <Input
                        value={p.link}
                        onChange={(e) =>
                          setResumeData({
                            ...resumeData,
                            projects: resumeData.projects.map((x, i) => (i === idx ? { ...x, link: e.target.value } : x)),
                          })
                        }
                        className={inputCls}
                        placeholder="Link"
                      />
                    </div>
                    <Textarea
                      rows={2}
                      value={p.desc}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          projects: resumeData.projects.map((x, i) => (i === idx ? { ...x, desc: e.target.value } : x)),
                        })
                      }
                      className="text-xs"
                      placeholder="What did you build and what was the impact?"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Step 3: Template & design */}
          <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2.5">
              <StepBadge n={3} />
              <div>
                <h3 className="font-display text-sm font-semibold text-foreground">Choose Template &amp; Design</h3>
                <p className="text-[11px] text-muted-foreground">Select from professional templates and customize your style</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {templates.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTemplate(t.id)}
                  aria-pressed={activeTemplate === t.id}
                  className={cn(
                    "relative rounded-xl border p-1.5 text-center transition-all",
                    activeTemplate === t.id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-background hover:border-primary/40"
                  )}
                >
                  {activeTemplate === t.id && (
                    <span className="absolute -right-1.5 -top-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                  <span
                    aria-hidden
                    className="relative block h-20 overflow-hidden rounded-md border border-border bg-white"
                  >
                    {t.id === "modern" && <span className="block h-6 w-full" style={{ backgroundColor: accentColor }} />}
                    {t.id === "creative" && (
                      <span className="absolute inset-y-0 left-0 w-5 bg-neutral-800" />
                    )}
                    {t.id === "professional" && (
                      <span className="mx-auto mt-2 block h-1.5 w-10 rounded bg-neutral-700" />
                    )}
                    {t.id === "minimal" && <span className="ml-2 mt-2 block h-1.5 w-8 rounded bg-neutral-400" />}
                    <span className={cn("block space-y-1 px-2 pt-2", t.id === "creative" && "pl-7")}>
                      {[100, 85, 92, 60, 88, 70].map((w, i) => (
                        <span key={i} className="block h-1 rounded bg-neutral-200" style={{ width: `${w}%` }} />
                      ))}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "mt-1.5 block text-[11px] font-semibold",
                      activeTemplate === t.id ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {t.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="rounded-xl border border-border bg-background">
              <button
                type="button"
                onClick={() => setShowAdvanced((v) => !v)}
                aria-expanded={showAdvanced}
                className="flex w-full items-center justify-between gap-3 p-3 text-left"
              >
                <span className="flex items-center gap-3">
                  <span className={tile}>
                    <Zap className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-xs font-semibold text-foreground">Advanced Options</span>
                    <span className="block text-[11px] text-muted-foreground">
                      Add more details like certifications, languages, achievements and custom sections
                    </span>
                  </span>
                </span>
                <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", showAdvanced && "rotate-180")} />
              </button>
              {showAdvanced && (
                <div className="space-y-3 border-t border-border p-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-medium text-foreground">Accent color</span>
                    <div className="flex items-center gap-2">
                      {[
                        { color: "#ec2639", label: "Talento Red" },
                        { color: "#2563eb", label: "Royal Blue" },
                        { color: "#16a34a", label: "Forest Green" },
                        { color: "#7c3aed", label: "Purple" },
                        { color: "#1f2937", label: "Charcoal" },
                      ].map((c) => (
                        <button
                          key={c.color}
                          type="button"
                          onClick={() => setAccentColor(c.color)}
                          style={{ backgroundColor: c.color }}
                          aria-label={c.label}
                          className={cn(
                            "h-6 w-6 rounded-full transition-transform",
                            accentColor === c.color ? "scale-110 ring-2 ring-primary ring-offset-2" : "opacity-80 hover:opacity-100"
                          )}
                          title={c.label}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-foreground">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={showCerts}
                        onChange={(e) => setShowCerts(e.target.checked)}
                        className="h-3.5 w-3.5 accent-[#ec2639]"
                      />
                      Show certifications
                    </label>
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={showLanguages}
                        onChange={(e) => setShowLanguages(e.target.checked)}
                        className="h-3.5 w-3.5 accent-[#ec2639]"
                      />
                      Show languages
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Live preview */}
        <div className="space-y-4">
          <div className="space-y-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className={tile}>
                  <Eye className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="font-display text-sm font-semibold text-foreground">Live Preview</h3>
                  <p className="text-[11px] text-muted-foreground">See how your resume looks in real-time</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={handlePrint} size="sm" className="h-8 gap-1.5 rounded-lg px-3 text-xs font-semibold">
                  <Download className="h-3.5 w-3.5" /> Download PDF
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyText}
                  className="h-8 gap-1.5 rounded-lg border-primary/40 bg-background px-3 text-xs font-semibold text-primary hover:bg-primary/5 hover:text-primary"
                >
                  <Copy className="h-3.5 w-3.5" /> Copy Text
                </Button>
              </div>
            </div>

            {/* Printable paper */}
            <div
              id="resume-paper"
              className="relative overflow-hidden rounded-xl border border-neutral-300 bg-white font-sans text-xs text-neutral-900 shadow-md print:border-none print:shadow-none"
            >
              {/* Header per template */}
              {activeTemplate === "modern" && (
                <div
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-white"
                  style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)` }}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white font-display text-base font-bold" style={{ color: accentColor }}>
                      {initials}
                    </span>
                    <div className="min-w-0">
                      <div className="font-display text-xl font-bold leading-tight text-white">{resumeData.name}</div>
                      <div className="text-[11px] text-white/90">{resumeData.headline}</div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-white/90">
                        <span className="inline-flex items-center gap-1"><Phone className="h-2.5 w-2.5" />{resumeData.phone}</span>
                        <span className="inline-flex items-center gap-1"><Mail className="h-2.5 w-2.5" />{resumeData.email}</span>
                        <span className="inline-flex items-center gap-1"><MapPin className="h-2.5 w-2.5" />{resumeData.city}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-semibold ring-1 ring-white/40">
                      Open to Work
                    </span>
                    <span className="flex items-center gap-2 text-white/90">
                      <Linkedin className="h-3.5 w-3.5" />
                      <Github className="h-3.5 w-3.5" />
                      <Globe className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              )}
              {activeTemplate === "professional" && (
                <div className="space-y-1 border-b-2 px-5 py-4 text-center" style={{ borderColor: accentColor }}>
                  <div className="font-display text-xl font-bold tracking-wide text-neutral-900">{resumeData.name}</div>
                  <div className="text-[11px] font-medium" style={{ color: accentColor }}>{resumeData.headline}</div>
                  <div className="flex flex-wrap items-center justify-center gap-x-3 text-[10px] text-neutral-600">
                    <span>{resumeData.email}</span>
                    <span>{resumeData.phone}</span>
                    <span>{resumeData.city}</span>
                    <span>{resumeData.linkedin}</span>
                    <span>{resumeData.portfolio}</span>
                  </div>
                </div>
              )}
              {activeTemplate === "creative" && (
                <div className="space-y-1 border-l-4 px-5 py-4" style={{ borderColor: accentColor }}>
                  <div className="font-display text-2xl font-extrabold leading-tight" style={{ color: accentColor }}>
                    {resumeData.name}
                  </div>
                  <div className="text-[11px] font-semibold text-neutral-700">{resumeData.headline}</div>
                  <div className="flex flex-wrap items-center gap-x-3 text-[10px] text-neutral-600">
                    <span>{resumeData.email}</span>
                    <span>{resumeData.phone}</span>
                    <span>{resumeData.city}</span>
                  </div>
                  <div className="text-[10px] text-neutral-500">
                    {resumeData.linkedin} · {resumeData.portfolio}
                  </div>
                </div>
              )}
              {activeTemplate === "minimal" && (
                <div className="space-y-0.5 px-5 pt-4">
                  <div className="font-display text-lg font-bold text-neutral-900">{resumeData.name}</div>
                  <div className="text-[10px] text-neutral-600">
                    {resumeData.headline} · {resumeData.email} · {resumeData.phone} · {resumeData.city}
                  </div>
                  <div className="text-[10px] text-neutral-500">
                    {resumeData.linkedin} · {resumeData.portfolio}
                  </div>
                </div>
              )}

              <div className="space-y-3.5 px-5 py-4">
                <section>
                  {sectionTitle("Professional Summary")}
                  <p className="text-[10.5px] leading-relaxed text-neutral-700">{resumeData.summary}</p>
                </section>

                <div className={cn("grid gap-4", showLanguages ? "grid-cols-[1fr_9rem]" : "grid-cols-1")}>
                  <section>
                    {sectionTitle("Skills")}
                    <div className="flex flex-wrap gap-1">
                      {resumeData.skills.map((s, i) => (
                        <span
                          key={`${s}-${i}`}
                          className="rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 text-[9.5px] font-medium text-neutral-700"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </section>
                  {showLanguages && (
                    <section>
                      {sectionTitle("Languages")}
                      <div className="space-y-0.5 text-[10px]">
                        {resumeData.languages.map((l) => (
                          <div key={l.name} className="flex items-center justify-between text-neutral-700">
                            <span>{l.name}</span>
                            <span className="font-semibold" style={{ color: accentColor }}>{l.level}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>

                <section>
                  {sectionTitle("Experience")}
                  <div className="space-y-2">
                    {resumeData.experience.map((exp, i) => (
                      <div key={i} className="space-y-0.5">
                        <div className="flex items-center justify-between gap-2 text-[10.5px] font-bold text-neutral-900">
                          <span>
                            {exp.role} - {exp.company}
                          </span>
                          <span className="shrink-0 text-[9.5px] font-normal text-neutral-500">{exp.period}</span>
                        </div>
                        <ul className="list-disc space-y-0.5 pl-4 text-[10px] text-neutral-700">
                          {exp.bullets.filter(Boolean).map((b, bi) => (
                            <li key={bi}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>

                {resumeData.projects.length > 0 && (
                  <section>
                    {sectionTitle("Projects")}
                    <div className="space-y-1.5">
                      {resumeData.projects.map((p, i) => (
                        <div key={i}>
                          <div className="flex items-center justify-between gap-2 text-[10.5px] font-bold text-neutral-900">
                            <span>{p.name}</span>
                            <span className="shrink-0 text-[9.5px] font-normal text-neutral-500">{p.link}</span>
                          </div>
                          <p className="text-[10px] text-neutral-700">{p.desc}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                <section>
                  {sectionTitle("Education")}
                  {resumeData.education.map((edu, i) => (
                    <div key={i} className="flex items-center justify-between gap-2 text-[10.5px]">
                      <span className="font-semibold text-neutral-800">
                        {edu.degree}, {edu.school}
                      </span>
                      <span className="shrink-0 text-[9.5px] text-neutral-500">{edu.year}</span>
                    </div>
                  ))}
                </section>

                {showCerts && resumeData.certifications.length > 0 && (
                  <section>
                    {sectionTitle("Certifications")}
                    <div className="space-y-0.5">
                      {resumeData.certifications.map((c, i) => (
                        <div key={i} className="flex items-center justify-between gap-2 text-[10px]">
                          <span className="font-semibold text-neutral-800">
                            {c.name}
                            {c.issuer && <span className="font-normal text-neutral-500"> {c.issuer}</span>}
                          </span>
                          <span className="shrink-0 text-[9.5px] text-neutral-500">{c.year}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                <div className="flex justify-end pt-1">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                    <ShieldCheck className="h-3 w-3" /> ATS Ready · {atsScore}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Cover letter */}
          {showCoverLetter && (
            <div className="space-y-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-1.5 font-display text-sm font-semibold text-foreground">
                  <FileText className="h-4 w-4 text-primary" /> Generated ATS Cover Letter
                </h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowCoverLetter(false)}
                  className="h-7 px-2 text-xs text-muted-foreground"
                >
                  Close
                </Button>
              </div>
              <Textarea
                rows={9}
                value={coverLetterText}
                onChange={(e) => setCoverLetterText(e.target.value)}
                className="font-mono text-xs leading-relaxed"
              />
              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(coverLetterText);
                    onToast("Cover letter copied to clipboard!");
                  }}
                  className="gap-1.5 rounded-xl text-xs"
                >
                  <Copy className="h-3.5 w-3.5" /> Copy Letter
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pro tips */}
      <section className="space-y-4 rounded-2xl border border-primary/20 bg-primary/5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className={tile}>
              <Lightbulb className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-display text-sm font-semibold text-primary">Pro Tips</h3>
              <p className="text-[11px] text-muted-foreground">Make your resume stand out with these tips</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {proTips.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-medium text-foreground"
              >
                <Check className="h-3 w-3 text-emerald-600" /> {t}
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tipActions.map(({ icon: Icon, title, sub, onClick }) => (
            <button
              key={title}
              type="button"
              onClick={onClick}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 text-left transition-colors hover:border-primary/40"
            >
              <span className={tile}>
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-semibold text-foreground">{title}</span>
                <span className="block truncate text-[11px] text-muted-foreground">{sub}</span>
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
