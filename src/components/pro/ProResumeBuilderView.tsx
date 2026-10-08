import React, { useState } from "react";
import {
  FileText,
  Sparkles,
  Download,
  Copy,
  Printer,
  Check,
  Plus,
  Trash2,
  ChevronRight,
  ShieldCheck,
  User,
  Briefcase,
  GraduationCap,
  Layers,
  Wand2,
  Share2,
  X,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ProUser, ProJob } from "@/data/proData";

interface ProResumeBuilderViewProps {
  user: ProUser;
  jobs: ProJob[];
  onSaveUser: (updatedUser: ProUser) => void;
  onToast: (msg: string) => void;
}

export const ProResumeBuilderView: React.FC<ProResumeBuilderViewProps> = ({
  user,
  jobs,
  onSaveUser,
  onToast,
}) => {
  const [targetRole, setTargetRole] = useState(user.rs?.t || "Frontend Developer");
  const [expLevel, setExpLevel] = useState("3-5 yrs");
  const [activeTab, setActiveTab] = useState<"basic" | "summary" | "skills" | "exp" | "edu" | "proj">("basic");
  const [activeTemplate, setActiveTemplate] = useState<"modern" | "professional" | "creative" | "minimal">("modern");
  const [accentColor, setAccentColor] = useState("#ec2639");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [coverLetterText, setCoverLetterText] = useState("");

  // Resume state initialized from user profile
  const [resumeData, setResumeData] = useState(() => ({
    name: user.name || "Arjun Mehta",
    email: user.email || "arjun@example.com",
    phone: user.ph ? `+91 ${user.ph}` : "+91 98765 43210",
    city: user.city || "Bengaluru, India",
    linkedin: user.links?.li || "linkedin.com/in/arjun",
    portfolio: user.links?.gh || "github.com/arjun",
    summary:
      user.about ||
      "Results-driven Frontend Engineer with 3+ years delivering accessible, high-performance web products. Experienced in modern component architectures, TypeScript, and Web Vitals optimization.",
    skills: [...(user.sk || ["React", "TypeScript", "Next.js", "Tailwind CSS", "Node.js", "SQL"])],
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
  }));

  const [newSkill, setNewSkill] = useState("");

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
        summary: `Strategic ${targetRole} with a strong foundation in scalable architectures and modern software engineering. Demonstrated success collaborating in high-velocity teams to drive measurable user engagement, performance benchmarks, and dependable test coverage.`,
      }));
      setIsGenerating(false);
      onToast("Resume summary & ATS keywords optimized by AI!");
    }, 800);
  };

  const handleGenerateCoverLetter = () => {
    setShowCoverLetter(true);
    setCoverLetterText(
      `Dear Hiring Manager,\n\nI am writing to express my enthusiastic interest in the ${targetRole} position. With verified experience across modern engineering practices, scalable systems, and collaborative development, I am eager to contribute to your team's upcoming milestones.\n\nThroughout my background, I have consistently focused on building resilient, user-centric software while optimizing core performance metrics. My experience with ${resumeData.skills.slice(0, 4).join(", ")} aligns directly with your team's technical focus.\n\nI welcome the opportunity to discuss how my technical skills and proactive work ethic can bring immediate value to your organization.\n\nSincerely,\n${resumeData.name}\n${resumeData.email} • ${resumeData.phone}`
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

EDUCATION
${resumeData.education.map((ed) => `${ed.degree}, ${ed.school} (${ed.year})`).join("\n")}
    `.trim();

    navigator.clipboard.writeText(text);
    onToast("Resume text copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      {/* Header Hero */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" /> AI-Powered ATS Resume Studio
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-display">
              Resume Builder & ATS Optimizer
            </h1>
            <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
              Create an applicant tracking system (ATS) compliant resume in minutes. Tailor keywords for your target role, select verified templates, and print or export cleanly.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handlePrint} className="rounded-xl gap-2 font-medium shadow-sm">
              <Printer className="w-4 h-4" /> Print / Export PDF
            </Button>
          </div>
        </div>
      </div>

      {/* 2-Column Studio: Left Editor, Right Live ATS Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Controls & Editor: 7 cols */}
        <div className="lg:col-span-6 space-y-5">
          {/* Step 1: Target Role */}
          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center">
                1
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">Target Role & AI Optimization</h3>
                <p className="text-[11px] text-muted-foreground">Select the position you are targeting to align ATS keywords</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">Target Job Title</label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full h-9 rounded-xl border border-input bg-background px-3 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option>Frontend Developer</option>
                  <option>Full Stack Developer</option>
                  <option>Software Engineer</option>
                  <option>Data Analyst</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">Experience Level</label>
                <div className="flex items-center gap-1.5 pt-0.5">
                  {["Fresher", "1-2 yrs", "3-5 yrs", "5+ yrs"].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setExpLevel(lvl)}
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-xs font-medium transition-colors border",
                        expLevel === lvl
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted/40 text-muted-foreground border-border/60 hover:text-foreground"
                      )}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Button
                onClick={handleGenerateAI}
                disabled={isGenerating}
                className="rounded-xl text-xs gap-1.5 h-8 font-medium"
              >
                <Wand2 className="w-3.5 h-3.5" />
                {isGenerating ? "Crafting with AI..." : "Optimize with AI"}
              </Button>
              <Button
                variant="outline"
                onClick={handleGenerateCoverLetter}
                className="rounded-xl text-xs gap-1.5 h-8 font-medium bg-background"
              >
                <FileText className="w-3.5 h-3.5" /> Generate Cover Letter
              </Button>
            </div>
          </div>

          {/* Step 2: Tabbed Editor */}
          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center">
                2
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">Edit & Personalize Details</h3>
                <p className="text-[11px] text-muted-foreground">Fine-tune every section of your ATS document</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-border/60">
              {[
                { key: "basic", label: "Contact", icon: User },
                { key: "summary", label: "Summary", icon: FileText },
                { key: "skills", label: "Skills", icon: Layers },
                { key: "exp", label: "Experience", icon: Briefcase },
                { key: "edu", label: "Education", icon: GraduationCap },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap",
                    activeTab === key
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" /> {label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            {activeTab === "basic" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-medium text-foreground block mb-1">Full Name</label>
                  <Input
                    value={resumeData.name}
                    onChange={(e) => setResumeData({ ...resumeData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="font-medium text-foreground block mb-1">Email</label>
                  <Input
                    value={resumeData.email}
                    onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="font-medium text-foreground block mb-1">Phone</label>
                  <Input
                    value={resumeData.phone}
                    onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="font-medium text-foreground block mb-1">Location</label>
                  <Input
                    value={resumeData.city}
                    onChange={(e) => setResumeData({ ...resumeData, city: e.target.value })}
                  />
                </div>
                <div>
                  <label className="font-medium text-foreground block mb-1">LinkedIn Profile</label>
                  <Input
                    value={resumeData.linkedin}
                    onChange={(e) => setResumeData({ ...resumeData, linkedin: e.target.value })}
                  />
                </div>
                <div>
                  <label className="font-medium text-foreground block mb-1">Portfolio / GitHub</label>
                  <Input
                    value={resumeData.portfolio}
                    onChange={(e) => setResumeData({ ...resumeData, portfolio: e.target.value })}
                  />
                </div>
              </div>
            )}

            {activeTab === "summary" && (
              <div className="space-y-3">
                <label className="text-xs font-medium text-foreground block">Professional Executive Summary</label>
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
                  <span className="font-medium text-foreground">Skills on Resume ({resumeData.skills.length})</span>
                  <span className="text-primary font-semibold">ATS Match: {atsScore}%</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {resumeData.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted text-foreground text-xs font-medium border border-border/60"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() =>
                          setResumeData({
                            ...resumeData,
                            skills: resumeData.skills.filter((_, i) => i !== idx),
                          })
                        }
                        className="text-muted-foreground hover:text-rose-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Input
                    placeholder="Add a skill, e.g. Docker, GraphQL"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newSkill.trim()) {
                        e.preventDefault();
                        setResumeData({ ...resumeData, skills: [...resumeData.skills, newSkill.trim()] });
                        setNewSkill("");
                      }
                    }}
                    className="text-xs h-8"
                  />
                  <Button
                    size="sm"
                    className="rounded-xl text-xs h-8 px-3 shrink-0"
                    onClick={() => {
                      if (newSkill.trim()) {
                        setResumeData({ ...resumeData, skills: [...resumeData.skills, newSkill.trim()] });
                        setNewSkill("");
                      }
                    }}
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </Button>
                </div>

                {/* Missing Keywords Box */}
                <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 space-y-2 text-xs">
                  <div className="font-semibold text-foreground flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary" /> Recommended Keywords for {targetRole}:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {currentRoleKeywords.map((kw) => {
                      const alreadyHas = resumeData.skills.some((s) => s.toLowerCase() === kw.toLowerCase());
                      if (alreadyHas) return null;
                      return (
                        <button
                          key={kw}
                          type="button"
                          onClick={() => setResumeData({ ...resumeData, skills: [...resumeData.skills, kw] })}
                          className="px-2 py-0.5 rounded-md bg-background border border-primary/30 text-primary hover:bg-primary hover:text-white transition-colors text-[11px] font-medium"
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
              <div className="space-y-4">
                {resumeData.experience.map((exp, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-border/60 bg-muted/20 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-foreground">
                        {exp.role} at {exp.company}
                      </div>
                      <span className="text-muted-foreground">{exp.period}</span>
                    </div>
                    <Textarea
                      rows={3}
                      value={exp.bullets.join("\n")}
                      onChange={(e) => {
                        const newBullets = e.target.value.split("\n");
                        const newExp = [...resumeData.experience];
                        newExp[idx].bullets = newBullets;
                        setResumeData({ ...resumeData, experience: newExp });
                      }}
                      className="text-xs"
                      placeholder="One bullet point per line..."
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === "edu" && (
              <div className="space-y-3">
                {resumeData.education.map((edu, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-border/60 bg-muted/20 text-xs space-y-1">
                    <div className="font-bold text-foreground">{edu.degree}</div>
                    <div className="text-muted-foreground">{edu.school} • {edu.year}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Step 3: Template & Styling */}
          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center">
                3
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">Template Style & Color Accent</h3>
                <p className="text-[11px] text-muted-foreground">Pick a format and styling tone for ATS parsing</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: "modern", label: "Modern" },
                { id: "professional", label: "Professional" },
                { id: "creative", label: "Creative" },
                { id: "minimal", label: "Minimal" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTemplate(t.id as any)}
                  className={cn(
                    "p-3 rounded-xl border text-center transition-all text-xs font-semibold",
                    activeTemplate === t.id
                      ? "border-primary bg-primary/5 text-primary shadow-sm"
                      : "border-border/80 bg-background text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-1">
              <span className="text-xs font-medium text-foreground">Accent Color:</span>
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
                    className={cn(
                      "w-6 h-6 rounded-full transition-transform",
                      accentColor === c.color ? "scale-125 ring-2 ring-primary ring-offset-2" : "opacity-80 hover:opacity-100"
                    )}
                    title={c.label}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Printable ATS Preview: 6 cols */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-semibold text-foreground text-sm">Live ATS Document Preview</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" /> ATS Score: {atsScore}%
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyText}
                  className="rounded-lg text-xs h-7 px-2 bg-background gap-1"
                >
                  <Copy className="w-3 h-3" /> Copy
                </Button>
              </div>
            </div>

            {/* Printable Paper Preview */}
            <div
              id="resume-paper"
              className="bg-white text-neutral-900 border border-neutral-300 rounded-xl p-6 shadow-md min-h-[580px] font-sans text-xs space-y-4 print:p-0 print:border-none print:shadow-none"
            >
              {/* Header */}
              <div
                className={cn(
                  "border-b pb-3 space-y-1",
                  activeTemplate === "creative" ? "border-l-4 pl-3" : ""
                )}
                style={{ borderColor: accentColor }}
              >
                <h1 className="text-xl font-bold tracking-tight text-neutral-900 font-display" style={{ color: accentColor }}>
                  {resumeData.name}
                </h1>
                <div className="text-[11px] text-neutral-600 flex items-center gap-2 flex-wrap">
                  <span>{resumeData.email}</span>
                  <span>•</span>
                  <span>{resumeData.phone}</span>
                  <span>•</span>
                  <span>{resumeData.city}</span>
                </div>
                <div className="text-[10px] text-neutral-500 flex items-center gap-2 flex-wrap">
                  <span>{resumeData.linkedin}</span>
                  <span>•</span>
                  <span>{resumeData.portfolio}</span>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-1">
                <h2 className="font-bold uppercase tracking-wider text-[11px]" style={{ color: accentColor }}>
                  Professional Summary
                </h2>
                <p className="text-[11px] text-neutral-700 leading-relaxed">
                  {resumeData.summary}
                </p>
              </div>

              {/* Skills */}
              <div className="space-y-1">
                <h2 className="font-bold uppercase tracking-wider text-[11px]" style={{ color: accentColor }}>
                  Technical Skills
                </h2>
                <p className="text-[11px] text-neutral-700 leading-relaxed font-medium">
                  {resumeData.skills.join(" • ")}
                </p>
              </div>

              {/* Experience */}
              <div className="space-y-2">
                <h2 className="font-bold uppercase tracking-wider text-[11px]" style={{ color: accentColor }}>
                  Experience
                </h2>
                <div className="space-y-2.5">
                  {resumeData.experience.map((exp, i) => (
                    <div key={i} className="space-y-0.5">
                      <div className="flex items-center justify-between font-bold text-[11px] text-neutral-900">
                        <span>{exp.role} — {exp.company}</span>
                        <span className="font-normal text-neutral-500 text-[10px]">{exp.period}</span>
                      </div>
                      <ul className="list-disc pl-4 space-y-0.5 text-[10.5px] text-neutral-700">
                        {exp.bullets.map((b, bi) => (
                          <li key={bi}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="space-y-1">
                <h2 className="font-bold uppercase tracking-wider text-[11px]" style={{ color: accentColor }}>
                  Education
                </h2>
                {resumeData.education.map((edu, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-neutral-800">{edu.degree}, {edu.school}</span>
                    <span className="text-neutral-500 text-[10px]">{edu.year}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cover Letter Modal / Box */}
          {showCoverLetter && (
            <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-primary" /> Generated ATS Cover Letter
                </h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowCoverLetter(false)}
                  className="text-xs text-muted-foreground h-7 px-2"
                >
                  Close
                </Button>
              </div>
              <Textarea
                rows={9}
                value={coverLetterText}
                onChange={(e) => setCoverLetterText(e.target.value)}
                className="text-xs font-mono leading-relaxed"
              />
              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(coverLetterText);
                    onToast("Cover letter copied to clipboard!");
                  }}
                  className="rounded-xl text-xs gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Letter
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
