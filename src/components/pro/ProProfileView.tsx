import React, { useState } from "react";
import {
  MapPin,
  Briefcase,
  BadgeCheck,
  Pencil,
  Plus,
  X,
  Check,
  Github,
  Linkedin,
  Copy,
  Award,
  User,
  Layers,
  FolderGit2,
  Code2,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Trash2,
  ClipboardCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProUser, SKILL_QUIZZES } from "@/data/proData";
import { cn } from "@/lib/utils";
import { MatchRing } from "./ProMatchRing";

interface ProProfileViewProps {
  user: ProUser;
  onSaveProfile: (updated: ProUser) => void;
  onToast: (msg: string) => void;
  avatarSrc?: string;
}

const tile = "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary";
const card = "rounded-2xl border border-border bg-card p-5 shadow-sm";
const outlineRed =
  "h-8 gap-1.5 rounded-lg border-primary/40 bg-background px-3 text-xs font-semibold text-primary hover:bg-primary/5 hover:text-primary";
const labelCls = "mb-1 block text-[11px] font-medium text-muted-foreground";
const inputCls = "h-9 rounded-lg text-xs";
const heroGhost =
  "inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold text-white ring-1 ring-white/30 backdrop-blur-sm transition-colors hover:bg-white/25";

const initials = (s: string) =>
  s
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

const stripProto = (u: string) => u.replace(/^https?:\/\//, "");

export const ProProfileView: React.FC<ProProfileViewProps> = ({ user, onSaveProfile, onToast, avatarSrc }) => {
  const skills = user.sk || [];
  const experience = user.ex || [];
  const projects = user.pj || [];
  const certs = (user.ce || []).map((c, index) => {
    const p = String(c).split(" · ");
    return { index, title: p[0] || String(c), issuer: p[1] || "Accredited provider", year: p[2] || "" };
  });

  // Editing state
  const [editingAbout, setEditingAbout] = useState(false);
  const [headDraft, setHeadDraft] = useState(user.head || "");
  const [aboutDraft, setAboutDraft] = useState(user.about || "");
  const [editingSkills, setEditingSkills] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [showAddExp, setShowAddExp] = useState(false);
  const [newExp, setNewExp] = useState({ co: "", role: "", fr: "", to: "Present", d: "" });
  const [showAddProj, setShowAddProj] = useState(false);
  const [newProj, setNewProj] = useState({ t: "", l: "", d: "", s: "", m: "" });
  const [openProject, setOpenProject] = useState<number | null>(null);
  const [showAllCerts, setShowAllCerts] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<{ skill: string; qIndex: number; correctCount: number } | null>(null);

  const save = (patch: Partial<ProUser>) => onSaveProfile({ ...user, ...patch });

  const handleSaveAbout = () => {
    save({ head: headDraft.trim(), about: aboutDraft.trim() });
    setEditingAbout(false);
    onToast("Profile details updated");
  };

  const handleAddSkill = () => {
    const v = newSkill.trim();
    if (!v) return;
    if (skills.some((s) => s.toLowerCase() === v.toLowerCase())) {
      onToast(`"${v}" is already in your skills`);
      return;
    }
    save({ sk: [...skills, v] });
    setNewSkill("");
    onToast(`Added "${v}" to your skills`);
  };

  const handleAddExp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExp.role.trim() || !newExp.co.trim()) return;
    save({ ex: [{ ...newExp }, ...experience] });
    setNewExp({ co: "", role: "", fr: "", to: "Present", d: "" });
    setShowAddExp(false);
    onToast("Experience added");
  };

  const handleAddProj = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProj.t.trim()) return;
    save({ pj: [...projects, { ...newProj }] });
    setNewProj({ t: "", l: "", d: "", s: "", m: "" });
    setShowAddProj(false);
    onToast("Project added");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    onToast("Profile link copied to clipboard!");
  };

  const topSkills = skills.slice(0, 11);
  const expLabel = `${user.exp ?? 0} ${user.exp === 1 ? "Year" : "Years"}`;
  const location = [user.city, user.state].filter(Boolean).join(", ") || "Location not set";
  const githubLink = user.links?.gh;
  const linkedinLink = user.links?.li;

  const quizSkills = Object.keys(SKILL_QUIZZES);

  return (
    <div className="space-y-5">
      {/* Hero */}
      <section className="pro-hero relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#ec2639] via-[#f03a4d] to-[#ff5566] p-5 shadow-lg shadow-primary/20 sm:p-7">
        <span aria-hidden className="pointer-events-none absolute -right-10 -top-14 h-52 w-52 rounded-full bg-white/10" />
        <span aria-hidden className="pointer-events-none absolute right-24 -bottom-20 h-44 w-44 rounded-full bg-white/10" />
        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4 sm:gap-5">
            <span className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/20 font-display text-3xl font-extrabold text-white ring-2 ring-white/60 sm:h-24 sm:w-24 sm:text-4xl">
              {avatarSrc ? (
                <img src={avatarSrc} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                (user.name.charAt(0) || "U").toUpperCase()
              )}
            </span>
            <div className="min-w-0 space-y-1.5">
              <h1 className="flex items-center gap-2 font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
                <span className="truncate">{user.name}</span>
                {user.vr && <BadgeCheck className="h-5 w-5 shrink-0 text-white" aria-label="Verified" />}
              </h1>
              <p className="text-xs text-white/90 sm:text-sm">
                {user.head || "Add a headline to tell recruiters what you do"}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-white/90">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Briefcase className="h-3 w-3" /> {expLabel} Experience
                </span>
                {githubLink && (
                  <span className="inline-flex items-center gap-1">
                    <Github className="h-3 w-3" /> {stripProto(githubLink)}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <button type="button" onClick={copyLink} className={heroGhost}>
              <Copy className="h-3.5 w-3.5" /> Copy link
            </button>
            {linkedinLink ? (
              <a
                href={`https://${stripProto(linkedinLink)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={heroGhost}
              >
                <Linkedin className="h-3.5 w-3.5" /> LinkedIn
              </a>
            ) : (
              <button type="button" onClick={() => onToast("Add your LinkedIn link in profile details")} className={heroGhost}>
                <Linkedin className="h-3.5 w-3.5" /> LinkedIn
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[3fr_2fr]">
        <div className="space-y-5">
          {/* About */}
          <div className={cn(card, "space-y-3")}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className={tile}>
                  <User className="h-4 w-4" />
                </span>
                <h3 className="font-display text-sm font-semibold text-foreground">About Me</h3>
              </div>
              {!editingAbout && (
                <button
                  type="button"
                  aria-label="Edit about"
                  onClick={() => {
                    setHeadDraft(user.head || "");
                    setAboutDraft(user.about || "");
                    setEditingAbout(true);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              )}
            </div>

            {editingAbout ? (
              <div className="space-y-3">
                <div>
                  <label className={labelCls}>Headline</label>
                  <Input value={headDraft} onChange={(e) => setHeadDraft(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>About</label>
                  <Textarea
                    rows={4}
                    value={aboutDraft}
                    onChange={(e) => setAboutDraft(e.target.value)}
                    className="text-xs leading-relaxed"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" className="rounded-lg text-xs" onClick={() => setEditingAbout(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" className="rounded-lg text-xs" onClick={handleSaveAbout}>
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-xs leading-relaxed text-muted-foreground">
                {user.about || "Write a short summary so recruiters know who you are and what you specialize in."}
              </p>
            )}

            {topSkills.length > 0 && (
              <div className="space-y-2 border-t border-border pt-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-foreground">Skills</div>
                <div className="flex flex-wrap gap-1.5">
                  {topSkills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-border bg-muted/50 px-2.5 py-1 text-[11px] font-medium text-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Experience */}
          <div className={cn(card, "space-y-4")}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className={tile}>
                  <Briefcase className="h-4 w-4" />
                </span>
                <h3 className="font-display text-sm font-semibold text-foreground">Experience</h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-muted-foreground">{expLabel}</span>
                <Button variant="outline" size="sm" className={outlineRed} onClick={() => setShowAddExp((v) => !v)}>
                  <Plus className="h-3.5 w-3.5" /> Add
                </Button>
              </div>
            </div>

            {showAddExp && (
              <form onSubmit={handleAddExp} className="space-y-3 rounded-xl border border-primary/30 bg-primary/5 p-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Role</label>
                    <Input value={newExp.role} onChange={(e) => setNewExp({ ...newExp, role: e.target.value })} className={inputCls} required />
                  </div>
                  <div>
                    <label className={labelCls}>Company</label>
                    <Input value={newExp.co} onChange={(e) => setNewExp({ ...newExp, co: e.target.value })} className={inputCls} required />
                  </div>
                  <div>
                    <label className={labelCls}>From</label>
                    <Input value={newExp.fr} onChange={(e) => setNewExp({ ...newExp, fr: e.target.value })} placeholder="Feb 2022" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>To</label>
                    <Input value={newExp.to} onChange={(e) => setNewExp({ ...newExp, to: e.target.value })} placeholder="Present" className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>What did you do?</label>
                  <Textarea rows={2} value={newExp.d} onChange={(e) => setNewExp({ ...newExp, d: e.target.value })} className="text-xs" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" size="sm" className="rounded-lg text-xs" onClick={() => setShowAddExp(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="rounded-lg text-xs">
                    Save
                  </Button>
                </div>
              </form>
            )}

            {experience.length === 0 ? (
              <p className="text-xs text-muted-foreground">No experience added yet.</p>
            ) : (
              <ol className="space-y-4">
                {experience.map((x, idx) => (
                  <li key={`${x.co}-${x.role}-${idx}`} className="group relative flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className={cn("mt-1 h-2.5 w-2.5 rounded-full", idx === 0 ? "bg-primary" : "bg-muted-foreground/40")} />
                      {idx < experience.length - 1 && <span className="mt-1 w-px flex-1 bg-border" />}
                    </div>
                    <div className="min-w-0 flex-1 pb-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-display text-sm font-semibold text-foreground">{x.role}</div>
                        <button
                          type="button"
                          aria-label={`Remove ${x.role}`}
                          onClick={() => save({ ex: experience.filter((_, i) => i !== idx) })}
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-primary/10 hover:text-primary focus-visible:opacity-100 group-hover:opacity-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {x.co} · {x.fr} – {x.to}
                      </div>
                      {x.d && <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{x.d}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        {/* Certifications */}
        <div className={cn(card, "space-y-3")}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className={tile}>
                <Award className="h-4 w-4" />
              </span>
              <h3 className="font-display text-sm font-semibold text-foreground">Certifications</h3>
            </div>
            {certs.length > 5 && (
              <button
                type="button"
                onClick={() => setShowAllCerts((v) => !v)}
                className="text-xs font-semibold text-primary hover:underline"
              >
                {showAllCerts ? "Show less" : "View All"}
              </button>
            )}
          </div>

          {certs.length === 0 ? (
            <p className="text-xs text-muted-foreground">No certifications yet. Add one from the Certifications page.</p>
          ) : (
            <div className="divide-y divide-border">
              {(showAllCerts ? certs : certs.slice(0, 5)).map((c) => (
                <div key={c.index} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      aria-hidden
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 font-display text-xs font-bold text-primary"
                    >
                      {initials(c.issuer)}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate text-xs font-semibold text-foreground">{c.title}</div>
                      <div className="truncate text-[11px] text-muted-foreground">
                        {c.issuer}
                        {c.year && ` · ${c.year}`}
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                      <Check className="h-3 w-3" /> Verified
                    </span>
                    <button
                      type="button"
                      aria-label={`Remove ${c.title}`}
                      onClick={() => {
                        save({ ce: (user.ce || []).filter((_, i) => i !== c.index) });
                        onToast("Certification removed.");
                      }}
                      className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Skills */}
      <div className={cn(card, "space-y-3")}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className={tile}>
              <Code2 className="h-4 w-4" />
            </span>
            <h3 className="font-display text-sm font-semibold text-foreground">Skills</h3>
          </div>
          <Button variant="outline" size="sm" className={outlineRed} onClick={() => setEditingSkills((v) => !v)}>
            {editingSkills ? (
              <>
                <Check className="h-3.5 w-3.5" /> Done
              </>
            ) : (
              <>
                <Pencil className="h-3.5 w-3.5" /> Edit
              </>
            )}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {skills.length === 0 && <p className="text-xs text-muted-foreground">No skills added yet.</p>}
          {skills.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-[11px] font-medium text-foreground"
            >
              {s}
              {editingSkills && (
                <button
                  type="button"
                  aria-label={`Remove ${s}`}
                  onClick={() => save({ sk: skills.filter((x) => x !== s) })}
                  className="text-muted-foreground hover:text-primary"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </span>
          ))}
        </div>

        {editingSkills && (
          <div className="flex items-center gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              placeholder="Add a skill, e.g. Docker"
              className={inputCls}
            />
            <Button size="sm" className="h-9 shrink-0 gap-1 rounded-lg px-3 text-xs" onClick={handleAddSkill}>
              <Plus className="h-3.5 w-3.5" /> Add
            </Button>
          </div>
        )}
      </div>

      {/* Projects */}
      <div className={cn(card, "space-y-4")}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className={tile}>
              <Layers className="h-4 w-4" />
            </span>
            <h3 className="font-display text-sm font-semibold text-foreground">Projects</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-muted-foreground">
              {projects.length} {projects.length === 1 ? "Project" : "Projects"}
            </span>
            <Button variant="outline" size="sm" className={outlineRed} onClick={() => setShowAddProj((v) => !v)}>
              <Plus className="h-3.5 w-3.5" /> Add Project
            </Button>
          </div>
        </div>

        {showAddProj && (
          <form onSubmit={handleAddProj} className="space-y-3 rounded-xl border border-primary/30 bg-primary/5 p-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Project name</label>
                <Input value={newProj.t} onChange={(e) => setNewProj({ ...newProj, t: e.target.value })} className={inputCls} required />
              </div>
              <div>
                <label className={labelCls}>Link</label>
                <Input value={newProj.l} onChange={(e) => setNewProj({ ...newProj, l: e.target.value })} placeholder="github.com/you/project" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Tech stack (comma separated)</label>
                <Input value={newProj.s} onChange={(e) => setNewProj({ ...newProj, s: e.target.value })} placeholder="React, Node.js" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Impact metric</label>
                <Input value={newProj.m} onChange={(e) => setNewProj({ ...newProj, m: e.target.value })} placeholder="35% faster reporting" className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Description</label>
              <Textarea rows={2} value={newProj.d} onChange={(e) => setNewProj({ ...newProj, d: e.target.value })} className="text-xs" />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" className="rounded-lg text-xs" onClick={() => setShowAddProj(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="rounded-lg text-xs">
                Save project
              </Button>
            </div>
          </form>
        )}

        {projects.length === 0 ? (
          <p className="text-xs text-muted-foreground">No projects yet. Showcase your best work.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
            {projects.map((p, idx) => {
              const stack = (p.s || "")
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean);
              const isLastOdd = idx === projects.length - 1 && projects.length % 2 === 1 && projects.length > 1;
              const isOpen = openProject === idx;
              return (
                <div
                  key={`${p.t}-${idx}`}
                  className={cn(
                    "relative flex flex-col justify-between gap-3 rounded-xl border border-border bg-background p-4",
                    isLastOdd && "md:col-span-2"
                  )}
                >
                  <button
                    type="button"
                    aria-label={`Remove ${p.t}`}
                    onClick={() => {
                      save({ pj: projects.filter((_, i) => i !== idx) });
                      if (openProject === idx) setOpenProject(null);
                    }}
                    className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <div className="space-y-2 pr-6">
                    <div className="flex items-start gap-3">
                      <span className={tile}>
                        <FolderGit2 className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <div className="font-display text-sm font-semibold text-foreground">{p.t}</div>
                        {p.d && <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{p.d}</p>}
                      </div>
                    </div>
                    {stack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pl-12">
                        {stack.map((t) => (
                          <span
                            key={t}
                            className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-foreground"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {isOpen && p.l && (
                    <a
                      href={`https://${stripProto(p.l)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 pl-12 text-[11px] font-semibold text-primary hover:underline"
                    >
                      {p.l} <ExternalLink className="h-3 w-3" />
                    </a>
                  )}

                  <div className="flex items-center justify-between gap-3 pl-12">
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                      {p.m && (
                        <>
                          <TrendingUp className="h-3 w-3" /> {p.m}
                        </>
                      )}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className={outlineRed}
                      onClick={() => setOpenProject(isOpen ? null : idx)}
                    >
                      {isOpen ? "Hide Details" : "View Details"} <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Skill assessments */}
      <div className={cn(card, "space-y-4")}>
        <div className="flex items-center gap-3">
          <span className={tile}>
            <ShieldCheck className="h-4 w-4" />
          </span>
          <div>
            <h3 className="font-display text-sm font-semibold text-foreground">Skill assessments</h3>
            <p className="text-[11px] text-muted-foreground">Take a short test to verify a skill on your profile</p>
          </div>
        </div>

        {activeQuiz ? (
          <div className="space-y-3 rounded-xl border border-primary/30 bg-background p-4 text-xs">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="font-display text-sm font-semibold text-foreground">
                {activeQuiz.skill} · Question {activeQuiz.qIndex + 1} of {SKILL_QUIZZES[activeQuiz.skill]?.length || 3}
              </span>
              <button
                type="button"
                onClick={() => setActiveQuiz(null)}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                Exit
              </button>
            </div>
            {(() => {
              const q = SKILL_QUIZZES[activeQuiz.skill]?.[activeQuiz.qIndex];
              if (!q) return null;
              return (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-foreground">{q[0]}</p>
                  <div className="space-y-2">
                    {q[1].map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => {
                          const isCorrect = optIdx === q[2];
                          const nextCount = activeQuiz.correctCount + (isCorrect ? 1 : 0);
                          const nextIdx = activeQuiz.qIndex + 1;
                          const totalQ = SKILL_QUIZZES[activeQuiz.skill].length;
                          if (nextIdx >= totalQ) {
                            const finalScore = Math.round((nextCount / totalQ) * 100);
                            save({ as: { ...(user.as || {}), [activeQuiz.skill]: finalScore } });
                            setActiveQuiz(null);
                            onToast(`Assessment finished: ${finalScore}% on ${activeQuiz.skill}`);
                          } else {
                            setActiveQuiz({ ...activeQuiz, qIndex: nextIdx, correctCount: nextCount });
                          }
                        }}
                        className="w-full rounded-xl border border-border bg-muted/30 p-3 text-left font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {quizSkills.map((skill) => {
              const score = user.as?.[skill];
              return (
                <div key={skill} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-3">
                  <div className="flex min-w-0 items-center gap-3">
                    {score != null ? (
                      <MatchRing percent={score} size={42} />
                    ) : (
                      <span className={tile}>
                        <ClipboardCheck className="h-4 w-4" />
                      </span>
                    )}
                    <div className="min-w-0">
                      <div className="truncate font-display text-sm font-semibold text-foreground">{skill}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {score != null ? "Verified assessment" : "3-question test"}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="h-8 shrink-0 rounded-lg px-3 text-xs font-semibold"
                    onClick={() => setActiveQuiz({ skill, qIndex: 0, correctCount: 0 })}
                  >
                    {score != null ? "Retake" : "Start"}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProProfileView;
