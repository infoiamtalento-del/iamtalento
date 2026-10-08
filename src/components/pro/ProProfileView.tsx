import React, { useState } from "react";
import {
  Users,
  MapPin,
  Briefcase,
  CheckCircle2,
  ShieldCheck,
  Eye,
  Search,
  ExternalLink,
  Edit,
  Plus,
  Trash2,
  Check,
  X,
  Award,
  Globe,
  Github,
  Linkedin,
  FileText,
  Clock,
  Sparkles,
  Zap,
} from "lucide-react";
import { ProUser, SKILL_QUIZZES } from "@/data/proData";
import { cn } from "@/lib/utils";

interface ProProfileViewProps {
  currentUser: ProUser;
  onUpdateUser: (updated: Partial<ProUser>) => void;
  showToast: (msg: string) => void;
  onNavigateToView: (view: any) => void;
  avatarSrc?: string;
}

export const ProProfileView: React.FC<ProProfileViewProps> = ({
  currentUser,
  onUpdateUser,
  showToast,
  onNavigateToView,
  avatarSrc,
}) => {
  const [profileTab, setProfileTab] = useState<"ov" | "ex" | "sk" | "pf" | "as">("ov");
  const [isEmployerPreview, setIsEmployerPreview] = useState(false);

  // Inline edit states for Overview
  const [isEditingBasic, setIsEditingBasic] = useState(false);
  const [basicForm, setBasicForm] = useState({
    name: currentUser.name || "",
    phone: currentUser.ph || "",
    city: currentUser.city || "",
    state: currentUser.state || "",
    exp: currentUser.exp || 0,
    head: currentUser.head || "",
    tag: currentUser.tag || "",
    cl: currentUser.cl || "",
    li: currentUser.links?.li || "",
    pf: currentUser.links?.pf || "",
    gh: currentUser.links?.gh || "",
  });

  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [aboutText, setAboutText] = useState(currentUser.about || "");

  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [skillsText, setSkillsText] = useState((currentUser.fsk || currentUser.sk || []).join(", "));

  // Add item form states
  const [newExp, setNewExp] = useState({ co: "", role: "", fr: "", to: "", d: "" });
  const [newEdu, setNewEdu] = useState({ sc: "", dg: "", yr: "" });
  const [newProj, setNewProj] = useState({ t: "", l: "", d: "", s: "", m: "" });
  const [newSkill, setNewSkill] = useState({ n: "", lv: "Intermediate" });
  const [newCert, setNewCert] = useState({ n: "", is: "", yr: "" });

  // Preferences form state
  const [prefsForm, setPrefsForm] = useState({
    sal: currentUser.pf?.sal || 20,
    np: currentUser.pf?.np || 30,
    wm: currentUser.pf?.wm || "Hybrid",
    ty: currentUser.pf?.ty || "Full-time",
    loc: currentUser.pf?.loc || "Bengaluru, Chennai",
    rl: currentUser.pf?.rl ?? true,
  });

  // Quiz interactive state
  const [activeQuiz, setActiveQuiz] = useState<{ skill: string; qIndex: number; correctCount: number } | null>(null);

  // Profile completeness calculation
  const completenessSteps = [
    { label: "Add a headline", done: !!currentUser.head },
    { label: "Write an About summary", done: !!currentUser.about },
    { label: "Add 3+ skills", done: (currentUser.sk || []).length >= 3 },
    { label: "Add work experience", done: (currentUser.ex || []).length > 0 },
    { label: "Add education", done: (currentUser.ed || []).length > 0 },
    { label: "Add a certification", done: (currentUser.ce || []).length > 0 },
    { label: "Add a project", done: (currentUser.pj || []).length > 0 },
    { label: "Take a skill assessment", done: Object.keys(currentUser.as || {}).length > 0 },
    { label: "Set salary preference", done: !!currentUser.pf?.sal },
  ];

  const completenessPct = Math.round(
    (completenessSteps.filter((s) => s.done).length / completenessSteps.length) * 100
  );

  // Save Basic Info handler
  const handleSaveBasic = () => {
    onUpdateUser({
      name: basicForm.name,
      ph: basicForm.phone,
      city: basicForm.city,
      state: basicForm.state,
      exp: basicForm.exp,
      head: basicForm.head,
      tag: basicForm.tag,
      cl: basicForm.cl || `${basicForm.city}${basicForm.state ? ", " + basicForm.state : ""}`,
      links: {
        ...currentUser.links,
        li: basicForm.li,
        pf: basicForm.pf,
        gh: basicForm.gh,
      },
    });
    setIsEditingBasic(false);
    showToast("Basic details updated");
  };

  // Save Preferences handler
  const handleSavePrefs = () => {
    onUpdateUser({
      pf: { ...prefsForm },
    });
    showToast("Job preferences saved");
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Profile Hero Header Card */}
      <div className="rounded-2xl bg-gradient-to-r from-[#ec2639] via-[#f0364a] to-[#d61e31] text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* Avatar & Main Credentials */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl bg-white/20 border-4 border-white text-white font-display font-black text-3xl sm:text-4xl flex items-center justify-center shrink-0 shadow-lg overflow-hidden relative">
              {avatarSrc ? (
                <img src={avatarSrc} alt={currentUser.name} className="h-full w-full object-cover" />
              ) : (
                currentUser.name.charAt(0).toUpperCase()
              )}
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight truncate">
                  {currentUser.name}
                </h1>
                {/* Availability Select */}
                <select
                  value={currentUser.st || "Actively looking"}
                  onChange={(e) => {
                    onUpdateUser({ st: e.target.value });
                    showToast(`Status changed to ${e.target.value}`);
                  }}
                  className="bg-white text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border-0 focus:ring-2 focus:ring-white/40 cursor-pointer shadow-xs"
                >
                  <option value="Actively looking">Available to work</option>
                  <option value="Open to offers">Open to offers</option>
                  <option value="Not looking">Not looking</option>
                </select>
              </div>

              <p className="text-white/90 text-sm font-semibold">
                {currentUser.head || "Frontend Developer · React · 2.5 yrs"}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/80">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {currentUser.city || "Bengaluru"}{currentUser.state ? ", " + currentUser.state : ""}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  {currentUser.exp} Years Experience
                </span>
                {currentUser.vr && (
                  <span className="flex items-center gap-1 text-white font-bold bg-white/20 px-2 py-0.5 rounded-full text-[11px]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified ID
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 pt-2 text-xs text-white/90">
                <span className="flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-white/80" />
                  <b>{currentUser.views || 52}</b> Profile Views
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Search className="h-3.5 w-3.5 text-white/80" />
                  <b>{(currentUser.views || 52) * 3}</b> Search Appearances
                </span>
              </div>
            </div>
          </div>

          {/* Completeness Ring & Recruiter Preview Button */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-4 border-t lg:border-t-0 border-white/20 pt-4 lg:pt-0">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-full border-4 border-white/30 border-t-white flex items-center justify-center font-display font-black text-sm">
                {completenessPct}%
              </div>
              <div className="text-left sm:text-right">
                <b className="block text-xs uppercase tracking-wider text-white">Completeness</b>
                <span className="text-[11px] text-white/80">
                  {completenessPct >= 100 ? "Profile 100% Ready" : `${completenessSteps.filter((s) => s.done).length} of 9 steps completed`}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsEmployerPreview(!isEmployerPreview)}
              className="px-4 py-2 rounded-xl bg-white text-primary hover:bg-white/95 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>{isEmployerPreview ? "Back to Edit Mode" : "How Employers See Me"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Profile Navigation Tabs */}
      {!isEmployerPreview && (
        <div className="rounded-xl border border-border/80 bg-background p-1.5 flex gap-1.5 overflow-x-auto text-xs font-semibold shadow-xs">
          {[
            { id: "ov", label: "Overview" },
            { id: "ex", label: "Experience & Education" },
            { id: "sk", label: "Skills & Certs" },
            { id: "pf", label: "Preferences" },
            { id: "as", label: "Assessments" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setProfileTab(tab.id as any)}
              className={cn(
                "px-4 py-2 rounded-lg font-display font-bold transition-all cursor-pointer whitespace-nowrap flex-1 text-center",
                profileTab === tab.id
                  ? "bg-primary text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/70"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Recruiter Preview Mode */}
      {isEmployerPreview ? (
        <div className="rounded-2xl border border-border/80 bg-background p-6 space-y-6 shadow-sm">
          <div className="flex justify-between items-center pb-3 border-b border-border/60">
            <div>
              <b className="font-display font-bold text-base text-foreground block">Recruiter-Facing Profile Preview</b>
              <span className="text-muted-foreground text-xs">This is the verified view hiring managers and recruiters see.</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-bold border border-emerald-500/20">
              Verified Candidate
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <b className="text-foreground block text-sm font-display mb-1">About</b>
              <p className="text-muted-foreground leading-relaxed">{currentUser.about || "No summary added."}</p>
            </div>

            <div>
              <b className="text-foreground block text-sm font-display mb-2">Verified Skills &amp; Assessments</b>
              <div className="flex flex-wrap gap-2">
                {(currentUser.sk || []).map((s) => (
                  <span key={s} className="px-3 py-1 rounded-md bg-secondary border border-border/80 text-foreground font-semibold">
                    {s} {currentUser.as?.[s] ? `· ${currentUser.as[s]}%` : ""}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <b className="text-foreground block text-sm font-display mb-2">Experience</b>
              <div className="space-y-3">
                {(currentUser.ex || []).map((x, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-border/70 bg-secondary/30">
                    <b className="text-foreground text-xs block">{x.role} · {x.co}</b>
                    <span className="text-muted-foreground text-[11px]">{x.fr} – {x.to}</span>
                    {x.d && <p className="text-muted-foreground mt-1 leading-relaxed">{x.d}</p>}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <b className="text-foreground block text-sm font-display mb-2">Certifications</b>
              <div className="space-y-1.5">
                {(currentUser.ce || []).map((c, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-foreground font-medium">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* ============ TAB: OVERVIEW ============ */}
          {profileTab === "ov" && (
            <div className="grid md:grid-cols-[1.2fr_1fr] gap-6 items-start">
              {/* Left Column: Basic Details & About */}
              <div className="space-y-6">
                {/* Basic Details Card */}
                <div className="rounded-2xl border border-border/80 bg-background p-5 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-border/60">
                    <span className="font-display font-bold text-sm text-foreground flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-primary" />
                      Basic Details
                    </span>
                    {isEditingBasic ? (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveBasic}
                          className="px-3 py-1 rounded-lg bg-primary text-white text-xs font-bold cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setIsEditingBasic(false)}
                          className="px-3 py-1 rounded-lg border border-border text-muted-foreground text-xs font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsEditingBasic(true)}
                        className="text-primary text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Edit className="h-3 w-3" /> Edit
                      </button>
                    )}
                  </div>

                  {isEditingBasic ? (
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="text-muted-foreground block mb-1">Headline</label>
                        <input
                          value={basicForm.head}
                          onChange={(e) => setBasicForm((f) => ({ ...f, head: e.target.value }))}
                          className="w-full px-3 py-1.5 rounded-lg border border-border bg-secondary/40 text-foreground"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-muted-foreground block mb-1">Full Name</label>
                          <input
                            value={basicForm.name}
                            onChange={(e) => setBasicForm((f) => ({ ...f, name: e.target.value }))}
                            className="w-full px-3 py-1.5 rounded-lg border border-border bg-secondary/40 text-foreground"
                          />
                        </div>
                        <div>
                          <label className="text-muted-foreground block mb-1">Phone</label>
                          <input
                            value={basicForm.phone}
                            onChange={(e) => setBasicForm((f) => ({ ...f, phone: e.target.value }))}
                            className="w-full px-3 py-1.5 rounded-lg border border-border bg-secondary/40 text-foreground"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-muted-foreground block mb-1">City</label>
                          <input
                            value={basicForm.city}
                            onChange={(e) => setBasicForm((f) => ({ ...f, city: e.target.value }))}
                            className="w-full px-3 py-1.5 rounded-lg border border-border bg-secondary/40 text-foreground"
                          />
                        </div>
                        <div>
                          <label className="text-muted-foreground block mb-1">Experience (Yrs)</label>
                          <input
                            type="number"
                            value={basicForm.exp}
                            onChange={(e) => setBasicForm((f) => ({ ...f, exp: +e.target.value }))}
                            className="w-full px-3 py-1.5 rounded-lg border border-border bg-secondary/40 text-foreground"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-muted-foreground block mb-1">Portfolio URL</label>
                        <input
                          value={basicForm.pf}
                          onChange={(e) => setBasicForm((f) => ({ ...f, pf: e.target.value }))}
                          className="w-full px-3 py-1.5 rounded-lg border border-border bg-secondary/40 text-foreground"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Full Name</span>
                        <b className="text-foreground">{currentUser.name}</b>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Phone</span>
                        <b className="text-foreground">{currentUser.ph || "98765 43210"}</b>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Email</span>
                        <b className="text-foreground truncate block">{currentUser.pemail || currentUser.email}</b>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Location</span>
                        <b className="text-foreground">{currentUser.city || "Bengaluru"}</b>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Total Experience</span>
                        <b className="text-foreground">{currentUser.exp} Years</b>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Portfolio</span>
                        <b className="text-primary truncate block">{currentUser.links?.pf || "vigneshportfolio.com"}</b>
                      </div>
                    </div>
                  )}
                </div>

                {/* About Me Card */}
                <div className="rounded-2xl border border-border/80 bg-background p-5 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <span className="font-display font-bold text-sm text-foreground flex items-center gap-1.5">
                      <FileText className="h-4 w-4 text-primary" />
                      About Me
                    </span>
                    {isEditingAbout ? (
                      <button
                        onClick={() => {
                          onUpdateUser({ about: aboutText });
                          setIsEditingAbout(false);
                          showToast("About summary updated");
                        }}
                        className="px-3 py-1 rounded-lg bg-primary text-white text-xs font-bold cursor-pointer"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsEditingAbout(true)}
                        className="text-primary text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Edit className="h-3 w-3" /> Edit
                      </button>
                    )}
                  </div>
                  {isEditingAbout ? (
                    <textarea
                      rows={5}
                      value={aboutText}
                      onChange={(e) => setAboutText(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-border bg-secondary/40 text-xs text-foreground"
                    />
                  ) : (
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {currentUser.about || "Write a short summary so employers know who you are."}
                    </p>
                  )}
                </div>

                {/* Contact & Links Cards */}
                <div className="rounded-2xl border border-border/80 bg-background p-5 space-y-3 shadow-xs">
                  <span className="font-display font-bold text-sm text-foreground block pb-2 border-b border-border/60">
                    Links &amp; Online Profiles
                  </span>
                  <div className="grid sm:grid-cols-2 gap-3 text-xs">
                    <a
                      href={`https://${currentUser.links?.gh || "github.com/vignesh"}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl border border-border/70 hover:border-foreground/30 flex items-center gap-2.5 transition-colors"
                    >
                      <Github className="h-4 w-4 text-foreground shrink-0" />
                      <div className="min-w-0">
                        <b className="block text-foreground truncate">GitHub</b>
                        <span className="text-[11px] text-muted-foreground truncate block">{currentUser.links?.gh || "github.com/vignesh"}</span>
                      </div>
                    </a>

                    <a
                      href={`https://${currentUser.links?.li || "linkedin.com/in/vignesh"}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl border border-border/70 hover:border-foreground/30 flex items-center gap-2.5 transition-colors"
                    >
                      <Linkedin className="h-4 w-4 text-primary shrink-0" />
                      <div className="min-w-0">
                        <b className="block text-foreground truncate">LinkedIn</b>
                        <span className="text-[11px] text-muted-foreground truncate block">{currentUser.links?.li || "linkedin.com/in/vignesh"}</span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column: Completeness, Skills & Certs */}
              <div className="space-y-6">
                {/* Profile Completeness Checklist */}
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-3 shadow-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <div>
                      <b className="text-sm font-display font-bold text-emerald-950 block">Profile {completenessPct}% Complete</b>
                      <span className="text-xs text-emerald-800">
                        {completenessPct >= 100 ? "All verified checks passed" : "Complete key steps to stand out"}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-emerald-500/20 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full transition-all" style={{ width: `${completenessPct}%` }} />
                  </div>
                  <div className="space-y-1.5 pt-1 text-xs">
                    {completenessSteps.map((step, idx) => (
                      <div key={idx} className="flex items-center justify-between text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          {step.done ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <div className="h-1.5 w-1.5 rounded-full bg-border" />}
                          <span className={step.done ? "text-foreground font-medium" : ""}>{step.label}</span>
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground">{step.done ? "Done" : "Pending"}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills Showcase Card */}
                <div className="rounded-2xl border border-border/80 bg-background p-5 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <span className="font-display font-bold text-sm text-foreground flex items-center gap-1.5">
                      <Zap className="h-4 w-4 text-primary" />
                      Key Skills
                    </span>
                    {isEditingSkills ? (
                      <button
                        onClick={() => {
                          const list = skillsText.split(",").map((s) => s.trim()).filter(Boolean);
                          onUpdateUser({ fsk: list, sk: [...new Set([...(currentUser.sk || []), ...list])] });
                          setIsEditingSkills(false);
                          showToast("Skills updated");
                        }}
                        className="px-3 py-1 rounded-lg bg-primary text-white text-xs font-bold cursor-pointer"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsEditingSkills(true)}
                        className="text-primary text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Edit className="h-3 w-3" /> Edit
                      </button>
                    )}
                  </div>

                  {isEditingSkills ? (
                    <textarea
                      rows={3}
                      value={skillsText}
                      onChange={(e) => setSkillsText(e.target.value)}
                      placeholder="React, TypeScript, Node.js..."
                      className="w-full p-2 rounded-lg border border-border bg-secondary/40 text-xs text-foreground"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {(currentUser.fsk || currentUser.sk || []).map((s) => (
                        <span
                          key={s}
                          className="px-3 py-1 rounded-full text-xs font-semibold bg-secondary border border-border/60 text-foreground"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Certifications Card */}
                <div className="rounded-2xl border border-border/80 bg-background p-5 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <span className="font-display font-bold text-sm text-foreground flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-primary" />
                      Certifications
                    </span>
                    <button
                      onClick={() => onNavigateToView("cert")}
                      className="text-primary text-xs font-bold hover:underline cursor-pointer"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-2 text-xs">
                    {(currentUser.ce || []).slice(0, 3).map((c, idx) => (
                      <div key={idx} className="p-3 rounded-xl border border-border/60 bg-secondary/30 flex items-center justify-between">
                        <div>
                          <b className="text-foreground block">{c.split("·")[0]}</b>
                          <span className="text-[11px] text-muted-foreground">{c.split("·")[1] || "Verified"}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700">
                          Active
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============ TAB: EXPERIENCE & EDUCATION ============ */}
          {profileTab === "ex" && (
            <div className="grid md:grid-cols-2 gap-6 items-start">
              {/* Work Experience */}
              <div className="rounded-2xl border border-border/80 bg-background p-5 space-y-4 shadow-xs">
                <span className="font-display font-bold text-sm text-foreground block pb-2 border-b border-border/60">
                  Work Experience
                </span>
                <div className="space-y-3 text-xs">
                  {(currentUser.ex || []).map((x, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-border/70 bg-secondary/30 relative group">
                      <button
                        onClick={() => {
                          const updated = [...(currentUser.ex || [])];
                          updated.splice(idx, 1);
                          onUpdateUser({ ex: updated });
                          showToast("Experience removed");
                        }}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-primary cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <b className="text-foreground text-xs block font-display">{x.role} · {x.co}</b>
                      <span className="text-muted-foreground text-[11px]">{x.fr} – {x.to}</span>
                      {x.d && <p className="text-muted-foreground mt-1.5 leading-relaxed">{x.d}</p>}
                    </div>
                  ))}
                </div>

                {/* Add Experience Form */}
                <div className="p-3.5 rounded-xl border border-border bg-secondary/20 space-y-2.5 text-xs">
                  <b className="text-foreground block">Add Experience</b>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="Company"
                      value={newExp.co}
                      onChange={(e) => setNewExp((x) => ({ ...x, co: e.target.value }))}
                      className="px-2.5 py-1.5 rounded-lg border border-border bg-background"
                    />
                    <input
                      placeholder="Role"
                      value={newExp.role}
                      onChange={(e) => setNewExp((x) => ({ ...x, role: e.target.value }))}
                      className="px-2.5 py-1.5 rounded-lg border border-border bg-background"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="From (e.g. 2022)"
                      value={newExp.fr}
                      onChange={(e) => setNewExp((x) => ({ ...x, fr: e.target.value }))}
                      className="px-2.5 py-1.5 rounded-lg border border-border bg-background"
                    />
                    <input
                      placeholder="To (e.g. Present)"
                      value={newExp.to}
                      onChange={(e) => setNewExp((x) => ({ ...x, to: e.target.value }))}
                      className="px-2.5 py-1.5 rounded-lg border border-border bg-background"
                    />
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Key responsibilities and achievements..."
                    value={newExp.d}
                    onChange={(e) => setNewExp((x) => ({ ...x, d: e.target.value }))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-background"
                  />
                  <button
                    onClick={() => {
                      if (!newExp.co || !newExp.role) return showToast("Company and Role required");
                      onUpdateUser({ ex: [...(currentUser.ex || []), newExp] });
                      setNewExp({ co: "", role: "", fr: "", to: "", d: "" });
                      showToast("Experience added");
                    }}
                    className="px-4 py-1.5 rounded-lg bg-primary text-white font-bold cursor-pointer"
                  >
                    + Add Experience
                  </button>
                </div>
              </div>

              {/* Education & Projects */}
              <div className="space-y-6">
                {/* Education */}
                <div className="rounded-2xl border border-border/80 bg-background p-5 space-y-4 shadow-xs">
                  <span className="font-display font-bold text-sm text-foreground block pb-2 border-b border-border/60">
                    Education
                  </span>
                  <div className="space-y-2 text-xs">
                    {(currentUser.ed || []).map((e, idx) => (
                      <div key={idx} className="p-3 rounded-xl border border-border/70 bg-secondary/30 flex justify-between items-center">
                        <div>
                          <b className="text-foreground block">{e.dg}</b>
                          <span className="text-muted-foreground text-[11px]">{e.sc} · {e.yr}</span>
                        </div>
                        <button
                          onClick={() => {
                            const updated = [...(currentUser.ed || [])];
                            updated.splice(idx, 1);
                            onUpdateUser({ ed: updated });
                            showToast("Education removed");
                          }}
                          className="text-muted-foreground hover:text-primary cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Education Form */}
                  <div className="p-3 rounded-xl border border-border bg-secondary/20 space-y-2 text-xs">
                    <b className="text-foreground block">Add Education</b>
                    <input
                      placeholder="School / College"
                      value={newEdu.sc}
                      onChange={(e) => setNewEdu((x) => ({ ...x, sc: e.target.value }))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-background"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        placeholder="Degree"
                        value={newEdu.dg}
                        onChange={(e) => setNewEdu((x) => ({ ...x, dg: e.target.value }))}
                        className="px-2.5 py-1.5 rounded-lg border border-border bg-background"
                      />
                      <input
                        placeholder="Year"
                        value={newEdu.yr}
                        onChange={(e) => setNewEdu((x) => ({ ...x, yr: e.target.value }))}
                        className="px-2.5 py-1.5 rounded-lg border border-border bg-background"
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (!newEdu.sc || !newEdu.dg) return showToast("Institution and Degree required");
                        onUpdateUser({ ed: [...(currentUser.ed || []), newEdu] });
                        setNewEdu({ sc: "", dg: "", yr: "" });
                        showToast("Education added");
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-primary text-white font-bold cursor-pointer"
                    >
                      + Add Education
                    </button>
                  </div>
                </div>

                {/* Projects */}
                <div className="rounded-2xl border border-border/80 bg-background p-5 space-y-4 shadow-xs">
                  <span className="font-display font-bold text-sm text-foreground block pb-2 border-b border-border/60">
                    Featured Projects
                  </span>
                  <div className="space-y-2 text-xs">
                    {(currentUser.pj || []).map((p, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl border border-border/70 bg-secondary/30 relative group">
                        <button
                          onClick={() => {
                            const updated = [...(currentUser.pj || [])];
                            updated.splice(idx, 1);
                            onUpdateUser({ pj: updated });
                            showToast("Project removed");
                          }}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-primary cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <b className="text-foreground text-xs block font-display">{p.t}</b>
                        {p.l && <span className="text-primary text-[11px] block">{p.l}</span>}
                        {p.d && <p className="text-muted-foreground mt-1 leading-relaxed">{p.d}</p>}
                      </div>
                    ))}
                  </div>

                  {/* Add Project Form */}
                  <div className="p-3 rounded-xl border border-border bg-secondary/20 space-y-2 text-xs">
                    <b className="text-foreground block">Add Project</b>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        placeholder="Project Title"
                        value={newProj.t}
                        onChange={(e) => setNewProj((x) => ({ ...x, t: e.target.value }))}
                        className="px-2.5 py-1.5 rounded-lg border border-border bg-background"
                      />
                      <input
                        placeholder="Project Link"
                        value={newProj.l}
                        onChange={(e) => setNewProj((x) => ({ ...x, l: e.target.value }))}
                        className="px-2.5 py-1.5 rounded-lg border border-border bg-background"
                      />
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Brief description..."
                      value={newProj.d}
                      onChange={(e) => setNewProj((x) => ({ ...x, d: e.target.value }))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-background"
                    />
                    <button
                      onClick={() => {
                        if (!newProj.t) return showToast("Project title required");
                        onUpdateUser({ pj: [...(currentUser.pj || []), newProj] });
                        setNewProj({ t: "", l: "", d: "", s: "", m: "" });
                        showToast("Project added");
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-primary text-white font-bold cursor-pointer"
                    >
                      + Add Project
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============ TAB: SKILLS & CERTS ============ */}
          {profileTab === "sk" && (
            <div className="grid md:grid-cols-2 gap-6 items-start">
              {/* Skills with Levels */}
              <div className="rounded-2xl border border-border/80 bg-background p-5 space-y-4 shadow-xs">
                <span className="font-display font-bold text-sm text-foreground block pb-2 border-b border-border/60">
                  Skills &amp; Proficiency Levels
                </span>
                <div className="space-y-2 text-xs">
                  {(currentUser.sk || []).map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-secondary/30">
                      <b className="text-foreground">{s}</b>
                      <div className="flex items-center gap-2">
                        <select
                          value={currentUser.sl?.[s] || "Intermediate"}
                          onChange={(e) => {
                            const sl = { ...(currentUser.sl || {}), [s]: e.target.value };
                            onUpdateUser({ sl });
                            showToast(`Updated ${s} to ${e.target.value}`);
                          }}
                          className="bg-background border border-border text-[11px] font-bold rounded px-2 py-0.5 cursor-pointer"
                        >
                          <option>Beginner</option>
                          <option>Intermediate</option>
                          <option>Expert</option>
                        </select>
                        <button
                          onClick={() => {
                            const updated = (currentUser.sk || []).filter((_, i) => i !== idx);
                            onUpdateUser({ sk: updated });
                            showToast("Skill removed");
                          }}
                          className="text-muted-foreground hover:text-primary cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Skill Form */}
                <div className="p-3 rounded-xl border border-border bg-secondary/20 space-y-2 text-xs">
                  <b className="text-foreground block">Add Skill</b>
                  <div className="grid grid-cols-[1fr_auto] gap-2">
                    <input
                      placeholder="Skill name (e.g. Next.js, Docker)"
                      value={newSkill.n}
                      onChange={(e) => setNewSkill((x) => ({ ...x, n: e.target.value }))}
                      className="px-2.5 py-1.5 rounded-lg border border-border bg-background"
                    />
                    <select
                      value={newSkill.lv}
                      onChange={(e) => setNewSkill((x) => ({ ...x, lv: e.target.value }))}
                      className="px-2.5 py-1.5 rounded-lg border border-border bg-background font-bold text-xs"
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Expert</option>
                    </select>
                  </div>
                  <button
                    onClick={() => {
                      if (!newSkill.n) return;
                      const sk = [...(currentUser.sk || []), newSkill.n];
                      const sl = { ...(currentUser.sl || {}), [newSkill.n]: newSkill.lv };
                      onUpdateUser({ sk, sl });
                      setNewSkill({ n: "", lv: "Intermediate" });
                      showToast("Skill added");
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-primary text-white font-bold cursor-pointer"
                  >
                    + Add Skill
                  </button>
                </div>
              </div>

              {/* Certifications List */}
              <div className="rounded-2xl border border-border/80 bg-background p-5 space-y-4 shadow-xs">
                <span className="font-display font-bold text-sm text-foreground block pb-2 border-b border-border/60">
                  Earned Certifications
                </span>
                <div className="space-y-2 text-xs">
                  {(currentUser.ce || []).map((c, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-border/70 bg-secondary/30 flex justify-between items-center">
                      <div>
                        <b className="text-foreground block">{c.split("·")[0]}</b>
                        <span className="text-muted-foreground text-[11px]">{c.split("·")[1] || "Verified"}</span>
                      </div>
                      <button
                        onClick={() => {
                          const updated = [...(currentUser.ce || [])];
                          updated.splice(idx, 1);
                          onUpdateUser({ ce: updated });
                          showToast("Certification removed");
                        }}
                        className="text-muted-foreground hover:text-primary cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Cert Form */}
                <div className="p-3 rounded-xl border border-border bg-secondary/20 space-y-2 text-xs">
                  <b className="text-foreground block">Add Certification</b>
                  <input
                    placeholder="Certification Name"
                    value={newCert.n}
                    onChange={(e) => setNewCert((x) => ({ ...x, n: e.target.value }))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-background"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="Issuer (e.g. AWS, Meta)"
                      value={newCert.is}
                      onChange={(e) => setNewCert((x) => ({ ...x, is: e.target.value }))}
                      className="px-2.5 py-1.5 rounded-lg border border-border bg-background"
                    />
                    <input
                      placeholder="Year / Date"
                      value={newCert.yr}
                      onChange={(e) => setNewCert((x) => ({ ...x, yr: e.target.value }))}
                      className="px-2.5 py-1.5 rounded-lg border border-border bg-background"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (!newCert.n) return;
                      const entry = `${newCert.n}${newCert.is ? " · " + newCert.is : ""}${newCert.yr ? " · " + newCert.yr : ""}`;
                      onUpdateUser({ ce: [...(currentUser.ce || []), entry] });
                      setNewCert({ n: "", is: "", yr: "" });
                      showToast("Certification added");
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-primary text-white font-bold cursor-pointer"
                  >
                    + Add Certification
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============ TAB: PREFERENCES ============ */}
          {profileTab === "pf" && (
            <div className="rounded-2xl border border-border/80 bg-background p-6 max-w-xl space-y-4 text-xs shadow-xs">
              <span className="font-display font-bold text-sm text-foreground block pb-2 border-b border-border/60">
                Job &amp; Career Preferences
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-muted-foreground block mb-1">Expected Salary (LPA)</label>
                  <input
                    type="number"
                    value={prefsForm.sal}
                    onChange={(e) => setPrefsForm((f) => ({ ...f, sal: +e.target.value }))}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-secondary/40 text-foreground"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground block mb-1">Notice Period (Days)</label>
                  <input
                    type="number"
                    value={prefsForm.np}
                    onChange={(e) => setPrefsForm((f) => ({ ...f, np: +e.target.value }))}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-secondary/40 text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-muted-foreground block mb-1">Work Mode</label>
                  <select
                    value={prefsForm.wm}
                    onChange={(e) => setPrefsForm((f) => ({ ...f, wm: e.target.value }))}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-secondary/40 text-foreground font-semibold"
                  >
                    <option>Any</option>
                    <option>Remote</option>
                    <option>Hybrid</option>
                    <option>Onsite</option>
                  </select>
                </div>
                <div>
                  <label className="text-muted-foreground block mb-1">Job Type</label>
                  <select
                    value={prefsForm.ty}
                    onChange={(e) => setPrefsForm((f) => ({ ...f, ty: e.target.value }))}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-secondary/40 text-foreground font-semibold"
                  >
                    <option>Full-time</option>
                    <option>Internship</option>
                    <option>Contract</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-muted-foreground block mb-1">Preferred Locations</label>
                <input
                  value={prefsForm.loc}
                  onChange={(e) => setPrefsForm((f) => ({ ...f, loc: e.target.value }))}
                  className="w-full px-3 py-1.5 rounded-lg border border-border bg-secondary/40 text-foreground"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-2 font-medium text-foreground">
                <input
                  type="checkbox"
                  checked={prefsForm.rl}
                  onChange={(e) => setPrefsForm((f) => ({ ...f, rl: e.target.checked }))}
                  className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                />
                <span>Open to relocate for the right role</span>
              </label>

              <div className="pt-2">
                <button
                  onClick={handleSavePrefs}
                  className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* ============ TAB: ASSESSMENTS ============ */}
          {profileTab === "as" && (
            <div className="space-y-6 max-w-2xl">
              {activeQuiz ? (
                /* Interactive Quiz Card */
                <div className="rounded-2xl border border-primary/40 bg-background p-6 space-y-4 shadow-md text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-border/60">
                    <span className="font-display font-bold text-sm text-foreground">
                      {activeQuiz.skill} Assessment · Question {activeQuiz.qIndex + 1} of{" "}
                      {SKILL_QUIZZES[activeQuiz.skill]?.length || 3}
                    </span>
                    <button
                      onClick={() => setActiveQuiz(null)}
                      className="text-muted-foreground hover:text-foreground text-xs font-bold"
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
                              onClick={() => {
                                const isCorrect = optIdx === q[2];
                                const nextCount = activeQuiz.correctCount + (isCorrect ? 1 : 0);
                                const nextIdx = activeQuiz.qIndex + 1;
                                const totalQ = SKILL_QUIZZES[activeQuiz.skill].length;

                                if (nextIdx >= totalQ) {
                                  const finalScore = Math.round((nextCount / totalQ) * 100);
                                  const as = { ...(currentUser.as || {}), [activeQuiz.skill]: finalScore };
                                  onUpdateUser({ as });
                                  setActiveQuiz(null);
                                  showToast(`Assessment finished: ${finalScore}% on ${activeQuiz.skill}`);
                                } else {
                                  setActiveQuiz({
                                    ...activeQuiz,
                                    qIndex: nextIdx,
                                    correctCount: nextCount,
                                  });
                                }
                              }}
                              className="w-full text-left p-3 rounded-xl border border-border bg-secondary/30 hover:border-primary/40 hover:bg-primary/5 text-foreground font-medium transition-colors cursor-pointer"
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
                /* Assessment Overview Cards */
                <div className="grid sm:grid-cols-3 gap-4">
                  {Object.keys(SKILL_QUIZZES).map((skill) => {
                    const userScore = currentUser.as?.[skill];
                    return (
                      <div key={skill} className="rounded-2xl border border-border/80 bg-background p-4 space-y-3 shadow-xs text-xs">
                        <div className="flex justify-between items-center">
                          <b className="font-display font-bold text-sm text-foreground">{skill}</b>
                          {userScore != null && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                              {userScore}%
                            </span>
                          )}
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                          <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${userScore || 0}%` }} />
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          {userScore != null ? "Verified assessment completed." : "Take a quick 3-question test."}
                        </p>
                        <button
                          onClick={() => setActiveQuiz({ skill, qIndex: 0, correctCount: 0 })}
                          className="w-full py-1.5 rounded-lg bg-primary text-white font-bold cursor-pointer hover:bg-primary/90 transition-colors"
                        >
                          {userScore != null ? "Retake Test" : "Start Test"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProProfileView;
