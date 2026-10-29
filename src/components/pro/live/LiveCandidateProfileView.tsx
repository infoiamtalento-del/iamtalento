import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  BadgeCheck,
  Briefcase,
  Building2,
  Camera,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  ExternalLink,
  FileText,
  FolderGit2,
  Github,
  Globe,
  GraduationCap,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CompletionRing from "@/components/profile/CompletionRing";
import {
  getResumeSignedUrl,
  loadLiveProfile,
  saveCandidatePayload,
  uploadProfilePhotoFile,
  type LiveProfile,
} from "@/services/candidate/profile";
import type { ProView } from "../proTypes";

interface Props {
  onNavigate: (view: ProView) => void;
  onProfileReloaded?: () => void;
  onToast: (msg: string) => void;
}

export const LiveCandidateProfileView: React.FC<Props> = ({
  onNavigate,
  onProfileReloaded,
  onToast,
}) => {
  const [data, setData] = useState<LiveProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const reload = async () => {
    setLoading(true);
    try {
      const live = await loadLiveProfile();
      setData(live);
      if (live?.profile?.resume_path) {
        const signed = await getResumeSignedUrl(live.profile.resume_path);
        setResumeUrl(signed);
      } else if (live?.profile?.resume_url) {
        setResumeUrl(live.profile.resume_url);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reload();
  }, []);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !data?.profile?.id) return;
    setUploadingPhoto(true);
    try {
      const url = await uploadProfilePhotoFile(file, data.profile.id);
      await saveCandidatePayload({ profile: { profile_photo_url: url } });
      await reload();
      onProfileReloaded?.();
      onToast("Profile picture updated!");
    } catch (err: any) {
      onToast(err?.message || "Failed to upload photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 flex items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center space-y-4">
        <p className="text-sm text-muted-foreground">Unable to load your candidate profile.</p>
        <Button onClick={() => onNavigate("edit-profile")}>Open Profile Setup Wizard</Button>
      </div>
    );
  }

  const p = data.profile;
  const initials = (p.full_name || p.email || "U")
    .split(" ")
    .map((x) => x[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const locationText = [p.city, p.state, p.country].filter(Boolean).join(", ");
  const verifiedSkillsCount = data.skills.filter((s) => s.verified).length;
  const publicUrl =
    p.portfolio_slug && typeof window !== "undefined"
      ? `${window.location.origin}/u/${p.portfolio_slug}`
      : "";

  const copyPublicLink = async () => {
    if (!publicUrl) return;
    await navigator.clipboard.writeText(publicUrl).catch(() => {});
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 1800);
    onToast("Public profile URL copied!");
  };

  return (
    <div className="space-y-6">
      {/* PROFILE HERO CARD */}
      <section className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="h-28 bg-primary/10 border-b border-border flex items-start justify-end p-4 gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onNavigate("edit-profile")}
            className="bg-card gap-1.5 text-xs"
          >
            <Pencil className="h-3.5 w-3.5 text-primary" />
            Edit Profile &amp; Industry
          </Button>
          {p.portfolio_slug ? (
            <Button asChild size="sm" variant="outline" className="bg-card gap-1.5 text-xs">
              <Link to={`/u/${p.portfolio_slug}`} target="_blank">
                <Globe className="h-3.5 w-3.5 text-primary" />
                Public View
              </Link>
            </Button>
          ) : (
            <Button asChild size="sm" variant="outline" className="bg-card gap-1.5 text-xs">
              <Link to="/my-profile">
                <ExternalLink className="h-3.5 w-3.5 text-primary" />
                Full Profile Page
              </Link>
            </Button>
          )}
        </div>

        <div className="px-6 pb-6 -mt-12 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-2xl overflow-hidden ring-4 ring-card bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold shrink-0 shadow-md">
                {p.profile_photo_url ? (
                  <img src={p.profile_photo_url} alt={p.full_name || "Profile"} className="h-full w-full object-cover" />
                ) : (
                  initials
                )}
                <button
                  type="button"
                  aria-label="Change profile photo"
                  onClick={() => photoInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="absolute inset-0 bg-black/45 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                >
                  {uploadingPhoto ? (
                    <Loader2 className="h-5 w-5 text-white animate-spin" />
                  ) : (
                    <Camera className="h-5 w-5 text-white" />
                  )}
                </button>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>

              <div className="pt-2 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold font-display text-foreground">
                    {p.full_name || "Complete Your Name"}
                  </h1>
                  {p.iam_talento_id && (
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs font-semibold text-primary">
                      {p.iam_talento_id}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {p.headline || p.job_role || "Add your professional headline & target role"}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-0.5">
                  {p.industry ? (
                    <span className="inline-flex items-center gap-1 font-semibold text-primary">
                      <Building2 className="h-3.5 w-3.5" />
                      {p.industry}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onNavigate("edit-profile")}
                      className="text-primary font-semibold hover:underline cursor-pointer"
                    >
                      + Select Industry
                    </button>
                  )}
                  {locationText && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {locationText}
                    </span>
                  )}
                  {p.email && (
                    <span className="inline-flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" /> {p.email}
                    </span>
                  )}
                  {p.phone && (
                    <span className="inline-flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" /> {p.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <CompletionRing percentage={p.profile_completion ?? 0} size={64} strokeWidth={6} />
              <div className="text-xs space-y-1">
                <p className="font-bold text-foreground">Profile {p.profile_completion ?? 0}%</p>
                <p className="text-muted-foreground">
                  IRS:{" "}
                  <strong className="text-primary">
                    {p.readiness ? `${Math.round(Number(p.readiness))}/100` : "Pending Test"}
                  </strong>
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate("readiness")}
                  className="text-primary font-semibold hover:underline cursor-pointer"
                >
                  View Skill Gap →
                </button>
              </div>
            </div>
          </div>

          {/* BADGE STATUS BAR */}
          <div className="mt-5 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1">
                Badge Status:
              </span>
              <Badge className="bg-emerald-600 text-white hover:bg-emerald-600 gap-1 text-xs">
                <CheckCircle2 className="h-3 w-3" /> Email Verified
              </Badge>
              {data.verification.identity_status === "verified" ? (
                <Badge className="bg-emerald-600 text-white hover:bg-emerald-600 gap-1 text-xs">
                  <ShieldCheck className="h-3 w-3" /> Gov ID Verified
                </Badge>
              ) : data.verification.identity_status === "pending" ? (
                <Badge variant="secondary" className="gap-1 text-xs">
                  <ShieldCheck className="h-3 w-3" /> ID Review Pending
                </Badge>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigate("ver")}
                  className="inline-flex items-center gap-1 rounded-full border border-dashed border-primary/40 px-2.5 py-0.5 text-xs font-semibold text-primary hover:bg-primary/5 cursor-pointer"
                >
                  <ShieldCheck className="h-3 w-3" /> Verify Gov ID
                </button>
              )}
              {data.latest_cir ? (
                <Badge className="bg-primary text-primary-foreground gap-1 text-xs">
                  <Award className="h-3 w-3" /> CIR {Math.round(Number(data.latest_cir.score))} ({data.latest_cir.tier})
                </Badge>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigate("cert")}
                  className="inline-flex items-center gap-1 rounded-full border border-dashed border-primary/40 px-2.5 py-0.5 text-xs font-semibold text-primary hover:bg-primary/5 cursor-pointer"
                >
                  <Target className="h-3 w-3" /> Earn CIR Badge
                </button>
              )}
              {verifiedSkillsCount > 0 && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  <BadgeCheck className="h-3 w-3 text-primary" /> {verifiedSkillsCount} Verified Skills
                </Badge>
              )}
              {p.open_to_work !== false && (
                <Badge variant="outline" className="border-emerald-500/40 text-emerald-700 text-xs">
                  Open to Work
                </Badge>
              )}
            </div>

            {publicUrl && (
              <div className="flex items-center gap-2">
                <Button type="button" size="sm" variant="outline" onClick={copyPublicLink} className="h-8 text-xs gap-1.5">
                  {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedLink ? "Copied" : "Copy Public URL"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* INCOMPLETE ONBOARDING PROMPT IF PHOTO OR INDUSTRY MISSING */}
      {(!p.profile_photo_url || !p.industry || data.skills.length < 3) && (
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Complete Your Profile Setup Wizard
            </p>
            <p className="text-xs text-muted-foreground">
              {!p.profile_photo_url && "• Upload profile picture  "}
              {!p.industry && "• Select your primary industry  "}
              {data.skills.length < 3 && `• Add ${3 - data.skills.length} more skill(s) for AI job matching`}
            </p>
          </div>
          <Button type="button" size="sm" onClick={() => onNavigate("edit-profile")} className="shrink-0 gap-1.5">
            Complete Setup Steps
          </Button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* ABOUT */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold font-display">About</h2>
              <button
                type="button"
                onClick={() => onNavigate("edit-profile")}
                className="text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                Edit
              </button>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {p.about || "No summary added yet. Add a concise career summary to stand out to employers."}
            </p>
          </div>

          {/* SKILLS */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold font-display flex items-center gap-2">
                <Code2 className="h-4 w-4 text-primary" /> Skills ({data.skills.length})
              </h2>
              <button
                type="button"
                onClick={() => onNavigate("edit-profile")}
                className="text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                + Add / Edit Skills
              </button>
            </div>
            {data.skills.length === 0 ? (
              <p className="text-xs text-muted-foreground">No skills added yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {data.skills.map((s) => (
                  <Badge key={s.name} variant={s.verified ? "default" : "secondary"} className="gap-1 py-1 px-3 text-xs">
                    {s.verified && <BadgeCheck className="h-3.5 w-3.5" />}
                    {s.name}
                    {s.level && <span className="opacity-70 capitalize">· {s.level}</span>}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* EXPERIENCE */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold font-display flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" /> Work Experience
              </h2>
              <button
                type="button"
                onClick={() => onNavigate("edit-profile")}
                className="text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                + Add Role
              </button>
            </div>
            {data.experiences.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                {p.experience_level === "fresher"
                  ? "Registered as Fresher — add internships or academic projects anytime."
                  : "No experience listed yet."}
              </p>
            ) : (
              <div className="divide-y divide-border">
                {data.experiences.map((ex, i) => (
                  <div key={i} className="py-3 first:pt-0 last:pb-0 space-y-1">
                    <p className="text-sm font-bold">{ex.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {ex.company} {ex.start ? `· ${ex.start.slice(0, 4)} – ${ex.end || "Present"}` : ""}
                    </p>
                    {ex.description && <p className="text-xs text-muted-foreground pt-1">{ex.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* EDUCATION */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold font-display flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" /> Education
              </h2>
              <button
                type="button"
                onClick={() => onNavigate("edit-profile")}
                className="text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                + Add Education
              </button>
            </div>
            {data.educations.length === 0 ? (
              <p className="text-xs text-muted-foreground">No education entries added yet.</p>
            ) : (
              <div className="divide-y divide-border">
                {data.educations.map((ed, i) => (
                  <div key={i} className="py-3 first:pt-0 last:pb-0">
                    <p className="text-sm font-bold">{ed.degree}</p>
                    <p className="text-xs text-muted-foreground">
                      {ed.institution} {ed.year ? `· ${ed.year}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR: RESUME, PREFERENCES & LINKS */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
            <h2 className="text-sm font-bold font-display flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" /> My Resume
            </h2>
            {resumeUrl ? (
              <div className="space-y-2">
                <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Resume uploaded &amp; ready for 1-Click Apply
                </p>
                <div className="flex gap-2">
                  <Button asChild size="sm" variant="outline" className="flex-1 text-xs gap-1">
                    <a href={resumeUrl} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-3.5 w-3.5" /> View CV
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onNavigate("my-resume")} className="text-xs">
                    Manage
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Upload your PDF/DOCX resume or build an ATS resume with AI.</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" onClick={() => onNavigate("my-resume")} className="text-xs">
                    Upload CV
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onNavigate("resume")} className="text-xs">
                    AI Builder
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 space-y-2.5 text-xs">
            <h2 className="text-sm font-bold font-display">Career Preferences</h2>
            <div className="flex justify-between py-1 border-b border-border/60">
              <span className="text-muted-foreground">Industry</span>
              <span className="font-semibold">{p.industry || "Not set"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/60">
              <span className="text-muted-foreground">Experience</span>
              <span className="font-semibold capitalize">
                {p.experience_level || "Fresher"} ({p.years_of_experience ?? 0} yrs)
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/60">
              <span className="text-muted-foreground">Expected CTC</span>
              <span className="font-semibold">{p.preferred_salary_range || "Flexible"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/60">
              <span className="text-muted-foreground">Notice Period</span>
              <span className="font-semibold">{p.notice_period || "Immediate"}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Locations</span>
              <span className="font-semibold text-right">
                {(p.preferred_locations || []).join(", ") || p.city || "Any"}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 space-y-2.5 text-xs">
            <h2 className="text-sm font-bold font-display flex items-center gap-2">
              <FolderGit2 className="h-4 w-4 text-primary" /> External Links
            </h2>
            {p.linkedin_url && (
              <a href={p.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                <Linkedin className="h-3.5 w-3.5" /> LinkedIn Profile
              </a>
            )}
            {p.github_url && (
              <a href={p.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                <Github className="h-3.5 w-3.5" /> GitHub / Code Portfolio
              </a>
            )}
            {p.portfolio_url && (
              <a href={p.portfolio_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                <Globe className="h-3.5 w-3.5" /> Personal Website
              </a>
            )}
            {!p.linkedin_url && !p.github_url && !p.portfolio_url && (
              <p className="text-muted-foreground">No external links added yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
