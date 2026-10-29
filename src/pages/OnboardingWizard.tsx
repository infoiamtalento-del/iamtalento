import React, { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BadgeCheck,
  Briefcase,
  Building2,
  Camera,
  Check,
  CheckCircle2,
  Code2,
  ExternalLink,
  FileText,
  Globe,
  GraduationCap,
  Loader2,
  MapPin,
  Phone,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { isDemoOnlySession } from "@/services/authSession";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { siteLogo } from "@/assets/logo";
import CompletionRing from "@/components/profile/CompletionRing";
import {
  getResumeSignedUrl,
  loadLiveProfile,
  saveCandidatePayload,
  uploadProfilePhotoFile,
  uploadResumeFile,
} from "@/services/candidate/profile";
import { submitIdentity } from "@/services/candidate/platform";
import type { ProView } from "@/components/pro/proTypes";

export const INDUSTRY_CATALOG: { id: string; label: string; suggestedSkills: string[] }[] = [
  {
    id: "Technology & Software",
    label: "Technology & Software",
    suggestedSkills: ["React", "TypeScript", "Node.js", "PostgreSQL", "Python", "System Design", "REST APIs", "Git"],
  },
  {
    id: "Data Science & AI",
    label: "Data Science & AI",
    suggestedSkills: ["Python", "SQL", "Machine Learning", "PyTorch", "Pandas", "LLM Prompting", "Statistics", "Power BI"],
  },
  {
    id: "Finance & BFSI",
    label: "Finance & BFSI",
    suggestedSkills: ["Financial Modeling", "Excel", "Valuation", "FP&A", "Accounting", "Risk Analysis", "SQL", "Bloomberg"],
  },
  {
    id: "Product & Design",
    label: "Product & Design",
    suggestedSkills: ["Product Strategy", "Figma", "User Research", "Wireframing", "A/B Testing", "Agile Scrum", "Roadmapping", "SQL"],
  },
  {
    id: "Marketing & Growth",
    label: "Marketing & Growth",
    suggestedSkills: ["SEO", "Performance Marketing", "Google Analytics", "Content Strategy", "Meta Ads", "CRM", "Copywriting", "CRO"],
  },
  {
    id: "Cybersecurity & Cloud",
    label: "Cybersecurity & Cloud",
    suggestedSkills: ["AWS", "Docker", "Kubernetes", "Linux", "Terraform", "Network Security", "IAM", "CI/CD"],
  },
  {
    id: "Healthcare & Biotech",
    label: "Healthcare & Biotech",
    suggestedSkills: ["Clinical Research", "Biostatistics", "Regulatory Affairs", "Pharmacovigilance", "HIPAA", "Data Analysis"],
  },
  {
    id: "Core Engineering & Manufacturing",
    label: "Core Engineering & Manufacturing",
    suggestedSkills: ["AutoCAD", "SolidWorks", "MATLAB", "Six Sigma", "Supply Chain", "Quality Assurance", "PLC", "IoT"],
  },
  {
    id: "Consulting & Operations",
    label: "Consulting & Operations",
    suggestedSkills: ["Business Analysis", "Stakeholder Management", "Process Optimization", "PowerPoint", "Excel", "Project Management"],
  },
  {
    id: "Human Resources",
    label: "Human Resources",
    suggestedSkills: ["Talent Acquisition", "HRIS", "Employer Branding", "Compensation & Benefits", "People Analytics", "Onboarding"],
  },
  {
    id: "Education & Research",
    label: "Education & Research",
    suggestedSkills: ["Curriculum Design", "Instructional Design", "Academic Writing", "LMS", "Research Methodology", "Public Speaking"],
  },
  {
    id: "E-Commerce & Retail",
    label: "E-Commerce & Retail",
    suggestedSkills: ["Category Management", "Merchandising", "Inventory Planning", "Shopify", "Marketplace Ops", "Customer Retention"],
  },
];

const WIZARD_STEPS = [
  { num: 1, title: "Verify Account", subtitle: "Email, mobile OTP & ID badge", icon: ShieldCheck },
  { num: 2, title: "Photo & Industry", subtitle: "Profile pic, industry & role", icon: Camera },
  { num: 3, title: "Skills & Background", subtitle: "Skills, education & experience", icon: Code2 },
  { num: 4, title: "Resume & Preferences", subtitle: "Upload CV, salary & public URL", icon: FileText },
  { num: 5, title: "Launch Dashboard", subtitle: "Readiness review & next steps", icon: Sparkles },
] as const;

interface SkillDraft {
  name: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
}

interface EduDraft {
  degree: string;
  institution: string;
  year: string;
}

interface ExpDraft {
  title: string;
  company: string;
  start: string;
  end: string;
  description: string;
}

interface OnboardingWizardProps {
  embedded?: boolean;
  initialStep?: number;
  onSaved?: () => void;
  onNavigatePro?: (view: ProView) => void;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  embedded = false,
  initialStep,
  onSaved,
  onNavigatePro,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedStep = Number(searchParams.get("step") || initialStep || (embedded ? 2 : 1));
  const [step, setStep] = useState<number>(
    requestedStep >= 1 && requestedStep <= 5 ? requestedStep : 1
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [talentoId, setTalentoId] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  // Step 1: Verify Account
  const [phone, setPhone] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [otpInput, setOtpInput] = useState("");
  const [idDocType, setIdDocType] = useState<"aadhar" | "passport" | "driving_license">("aadhar");
  const [idStatus, setIdStatus] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState(false);
  const idFileRef = useRef<HTMLInputElement>(null);

  // Step 2: Profile Photo & Industry
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoFileRef = useRef<HTMLInputElement>(null);
  const [fullName, setFullName] = useState("");
  const [industry, setIndustry] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [headline, setHeadline] = useState("");
  const [experienceLevel, setExperienceLevel] = useState<"fresher" | "experienced">("fresher");
  const [yearsOfExp, setYearsOfExp] = useState<number>(0);
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [country, setCountry] = useState("India");
  const [about, setAbout] = useState("");

  // Step 3: Skills, Education & Experience
  const [skills, setSkills] = useState<SkillDraft[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [skillLevel, setSkillLevel] = useState<SkillDraft["level"]>("intermediate");
  const [educations, setEducations] = useState<EduDraft[]>([{ degree: "", institution: "", year: "" }]);
  const [experiences, setExperiences] = useState<ExpDraft[]>([]);

  // Step 4: Resume & Career Preferences
  const [resumePath, setResumePath] = useState<string | null>(null);
  const [resumeSignedUrl, setResumeSignedUrl] = useState<string | null>(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const resumeFileRef = useRef<HTMLInputElement>(null);
  const [openToWork, setOpenToWork] = useState(true);
  const [workMode, setWorkMode] = useState<"Remote" | "Hybrid" | "Onsite">("Hybrid");
  const [employmentType, setEmploymentType] = useState("Full-time");
  const [preferredLocations, setPreferredLocations] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("Immediate");
  const [portfolioSlug, setPortfolioSlug] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [shellExtra, setShellExtra] = useState<Record<string, any>>({});

  useEffect(() => {
    let alive = true;
    (async () => {
      if (isDemoOnlySession()) {
        if (!embedded) navigate("/talento-pro?view=dash");
        setFullName("Demo Candidate");
        setEmail("demo.candidate@talento.app");
        setIndustry("Technology & Software");
        setJobRole("Frontend Developer");
        setHeadline("Frontend Developer · React & TypeScript");
        setCity("Bengaluru");
        setSkills([
          { name: "React", level: "advanced" },
          { name: "TypeScript", level: "advanced" },
          { name: "Tailwind CSS", level: "intermediate" },
        ]);
        setLoading(false);
        return;
      }
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        if (!embedded) navigate("/auth");
        setLoading(false);
        return;
      }
      if (!alive) return;
      setUserId(authData.user.id);
      setEmail(authData.user.email || "");

      try {
        const live = await loadLiveProfile();
        if (!alive || !live) {
          setFullName((authData.user.user_metadata?.full_name as string) || "");
          setPhone((authData.user.user_metadata?.phone as string) || "");
          setLoading(false);
          return;
        }
        const p = live.profile;
        const sh = live.shell_state || {};
        setShellExtra(sh);
        setTalentoId(p.iam_talento_id || "");
        setEmail(p.email || authData.user.email || "");
        setFullName(p.full_name || "");
        setPhone(p.phone || "");
        setPhoneVerified(Boolean(sh.phv));
        setIdStatus(live.verification.identity_status || null);
        setPhotoUrl(p.profile_photo_url || "");
        setIndustry(p.industry || "");
        setJobRole(p.job_role || "");
        setHeadline(p.headline || "");
        setExperienceLevel(p.experience_level === "experienced" ? "experienced" : "fresher");
        setYearsOfExp(p.years_of_experience ?? 0);
        setCity(p.city || "");
        setStateName(p.state || "");
        setCountry(p.country || "India");
        setAbout(p.about || "");

        if (live.skills.length > 0) {
          setSkills(
            live.skills.map((s) => ({
              name: s.name,
              level: (["beginner", "intermediate", "advanced", "expert"].includes(
                (s.level || "").toLowerCase()
              )
                ? (s.level || "intermediate").toLowerCase()
                : "intermediate") as SkillDraft["level"],
            }))
          );
        }
        if (live.educations.length > 0) {
          setEducations(
            live.educations.map((e) => ({
              degree: e.degree || "",
              institution: e.institution || "",
              year: e.year || "",
            }))
          );
        }
        if (live.experiences.length > 0) {
          setExperiences(
            live.experiences.map((e) => ({
              title: e.title || "",
              company: e.company || "",
              start: e.start ? e.start.slice(0, 4) : "",
              end: e.end && e.end !== "Present" ? e.end.slice(0, 4) : "Present",
              description: e.description || "",
            }))
          );
        }

        setResumePath(p.resume_path || null);
        if (p.resume_path) {
          getResumeSignedUrl(p.resume_path).then((u) => {
            if (alive) setResumeSignedUrl(u);
          });
        } else if (p.resume_url) {
          setResumeSignedUrl(p.resume_url);
        }

        setOpenToWork(p.open_to_work !== false);
        setWorkMode((sh.pf?.wm as "Remote" | "Hybrid" | "Onsite") || "Hybrid");
        setEmploymentType(p.availability_status || sh.pf?.ty || "Full-time");
        setPreferredLocations((p.preferred_locations || []).join(", "));
        setSalaryRange(p.preferred_salary_range || "");
        setNoticePeriod(p.notice_period || "Immediate");

        if (p.portfolio_slug) {
          setPortfolioSlug(p.portfolio_slug);
        } else if (p.full_name) {
          const baseSlug = p.full_name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")
            .slice(0, 24);
          const suffix = (p.iam_talento_id || "").replace(/[^a-zA-Z0-9]/g, "").slice(-4).toLowerCase();
          if (baseSlug) setPortfolioSlug(`${baseSlug}-${suffix || "pro"}`);
        }

        setLinkedinUrl(p.linkedin_url || "");
        setGithubUrl(p.github_url || "");
        setPortfolioUrl(p.portfolio_url || "");
      } catch {
        /* keep defaults */
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [embedded, navigate]);

  const completionScore = useMemo(() => {
    let pts = 0;
    if (fullName.trim()) pts += 10;
    if (phone.trim()) pts += 8;
    if (photoUrl) pts += 14;
    if (industry) pts += 14;
    if (headline.trim() || jobRole.trim()) pts += 10;
    if (city.trim()) pts += 6;
    if (skills.length >= 3) pts += 14;
    if (educations.some((e) => e.institution.trim())) pts += 10;
    if (experienceLevel === "fresher" || experiences.some((e) => e.title.trim())) pts += 6;
    if (resumePath || resumeSignedUrl || linkedinUrl.trim() || githubUrl.trim()) pts += 8;
    return Math.min(100, pts);
  }, [
    fullName,
    phone,
    photoUrl,
    industry,
    headline,
    jobRole,
    city,
    skills,
    educations,
    experienceLevel,
    experiences,
    resumePath,
    resumeSignedUrl,
    linkedinUrl,
    githubUrl,
  ]);

  const suggestedForIndustry = useMemo(() => {
    const match = INDUSTRY_CATALOG.find((item) => item.id === industry);
    return match ? match.suggestedSkills : INDUSTRY_CATALOG[0].suggestedSkills;
  }, [industry]);

  const cleanHttp = (raw: string): string => {
    const t = raw.trim();
    if (!t) return "";
    return /^https?:\/\//i.test(t) ? t : `https://${t}`;
  };

  const persistCurrentProgress = async (silent = false): Promise<boolean> => {
    if (!userId) {
      if (!silent) toast.success("Demo profile preview updated! Sign up for a real account to save permanently.");
      return true;
    }
    setSaving(true);
    try {
      const cleanedSlug = portfolioSlug
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "")
        .replace(/^-+|-+$/g, "");
      const validSlug =
        cleanedSlug.length >= 4 && /^[a-z0-9][a-z0-9-]{2,38}[a-z0-9]$/.test(cleanedSlug)
          ? cleanedSlug
          : null;

      await saveCandidatePayload({
        profile: {
          full_name: fullName.trim(),
          phone: phone.trim(),
          headline: headline.trim() || jobRole.trim(),
          job_role: jobRole.trim(),
          industry,
          about: about.trim(),
          city: city.trim(),
          state: stateName.trim(),
          country: country.trim() || "India",
          years_of_experience: experienceLevel === "fresher" ? 0 : Math.max(0, Number(yearsOfExp) || 0),
          open_to_work: openToWork,
          preferred_locations: preferredLocations
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          preferred_salary_range: salaryRange.trim(),
          notice_period: noticePeriod,
          availability_status: employmentType,
          linkedin_url: cleanHttp(linkedinUrl),
          github_url: cleanHttp(githubUrl),
          portfolio_url: cleanHttp(portfolioUrl),
          profile_photo_url: photoUrl || "",
          ...(resumePath ? { resume_path: resumePath } : {}),
          ...(validSlug ? { portfolio_slug: validSlug } : {}),
        },
        skills: skills.map((s) => ({
          name: s.name,
          level: s.level,
          category: "technical",
        })),
        educations: educations
          .filter((e) => e.institution.trim())
          .map((e) => ({
            degree: e.degree.trim() || "Degree",
            institution: e.institution.trim(),
            year: e.year.trim(),
          })),
        experiences: experiences
          .filter((e) => e.title.trim())
          .map((e) => ({
            title: e.title.trim(),
            company: e.company.trim() || "Company",
            start: e.start.trim(),
            end: e.end.trim() || "Present",
            description: e.description.trim(),
          })),
        shell_state: {
          ...shellExtra,
          phv: phoneVerified,
          tag: industry,
          onboardingCompleted: true,
          pf: {
            ...(shellExtra.pf || {}),
            wm: workMode,
            ty: employmentType,
            loc: preferredLocations,
          },
        },
      });
      if (!silent) toast.success("Profile progress saved!");
      onSaved?.();
      return true;
    } catch (err: any) {
      toast.error(err?.message || "Could not save profile changes");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleSendMobileOtp = () => {
    if (phone.replace(/\D/g, "").length < 8) {
      toast.error("Please enter a valid 10-digit mobile number first.");
      return;
    }
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(code);
    toast.success(`Verification OTP generated: ${code}`);
  };

  const handleVerifyMobileOtp = () => {
    if (!generatedOtp || otpInput.trim() !== generatedOtp) {
      toast.error("Invalid 6-digit OTP code. Please check and try again.");
      return;
    }
    setPhoneVerified(true);
    setGeneratedOtp(null);
    setOtpInput("");
    toast.success("Mobile number verified!");
  };

  const handleIdentityDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("ID document must be under 10 MB.");
      return;
    }
    setUploadingId(true);
    try {
      await submitIdentity(idDocType, file, file);
      setIdStatus("pending");
      toast.success("Government ID uploaded for verification!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to upload ID document");
    } finally {
      setUploadingId(false);
    }
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    setUploadingPhoto(true);
    try {
      const url = await uploadProfilePhotoFile(file, userId);
      setPhotoUrl(url);
      toast.success("Profile picture uploaded!");
    } catch (err: any) {
      toast.error(err?.message || "Photo upload failed");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleResumeSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    setUploadingResume(true);
    try {
      const { path, signedUrl } = await uploadResumeFile(file, userId);
      setResumePath(path);
      setResumeSignedUrl(signedUrl);
      toast.success("Resume uploaded securely!");
    } catch (err: any) {
      toast.error(err?.message || "Resume upload failed");
    } finally {
      setUploadingResume(false);
    }
  };

  const addSkill = (rawName: string) => {
    const clean = rawName.trim();
    if (!clean) return;
    if (skills.some((s) => s.name.toLowerCase() === clean.toLowerCase())) {
      setSkillInput("");
      return;
    }
    setSkills((prev) => [...prev, { name: clean, level: skillLevel }]);
    setSkillInput("");
  };

  const removeSkill = (name: string) => {
    setSkills((prev) => prev.filter((s) => s.name !== name));
  };

  const handleNextStep = async () => {
    if (step === 2) {
      if (!fullName.trim()) {
        toast.error("Please enter your full name.");
        return;
      }
      if (!industry) {
        toast.error("Please select your primary industry.");
        return;
      }
    }
    if (step === 3 && skills.length < 1) {
      toast.error("Please add at least 1 skill (3+ recommended for job matching).");
      return;
    }

    const ok = await persistCurrentProgress(true);
    if (!ok) return;
    setStep((prev) => Math.min(5, prev + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFinishToDashboard = async () => {
    const ok = await persistCurrentProgress(true);
    if (!ok) return;
    toast.success("Profile setup complete! Welcome to your Employee Dashboard.");
    if (embedded && onNavigatePro) {
      onNavigatePro("profile");
    } else {
      navigate("/talento-pro?view=dash");
    }
  };

  if (loading) {
    return (
      <div className={embedded ? "py-16 flex justify-center" : "min-h-screen flex items-center justify-center bg-background"}>
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  const initials = (fullName || email || "U")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const body = (
    <div className={embedded ? "space-y-6" : "max-w-5xl mx-auto px-4 py-8 space-y-6"}>
      {/* Stepper Header */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-border">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              {embedded ? "Profile Setup & Edit Wizard" : "Account Creation · Step-by-Step Setup"}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold font-display mt-1">
              {embedded ? "Update Your Verified Candidate Profile" : "Complete Your Candidate Account Setup"}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Upload your profile photo, select your industry, add skills &amp; resume, and unlock AI job matching.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <CompletionRing percentage={completionScore} size={64} strokeWidth={6} />
            <div className="text-xs">
              <p className="font-bold text-foreground">{completionScore}% Ready</p>
              {talentoId && <p className="font-mono text-primary mt-0.5">{talentoId}</p>}
            </div>
          </div>
        </div>

        {/* Clickable 5-step bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-4">
          {WIZARD_STEPS.map(({ num, title, subtitle, icon: Icon }) => {
            const active = step === num;
            const done = step > num;
            return (
              <button
                key={num}
                type="button"
                onClick={() => setStep(num)}
                className={`flex items-start gap-2.5 rounded-xl border p-3 text-left transition-all cursor-pointer ${
                  active
                    ? "border-primary bg-primary/10 text-primary shadow-xs"
                    : done
                      ? "border-emerald-500/30 bg-emerald-500/5 text-foreground"
                      : "border-border bg-background hover:border-primary/30 text-muted-foreground"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : done
                        ? "bg-emerald-600 text-white"
                        : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {done ? <Check className="h-3.5 w-3.5" /> : num}
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-bold truncate">{title}</span>
                  <span className="block text-[10px] text-muted-foreground truncate">{subtitle}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 1: VERIFY ACCOUNT */}
      {step === 1 && (
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold font-display">Step 1 · Verify Your Account</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Verified profiles receive priority ranking in employer searches and 24-hour application SLAs.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Email Verified Card */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Email Address</span>
                <Badge className="bg-emerald-600 text-white hover:bg-emerald-600 gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Verified
                </Badge>
              </div>
              <p className="text-sm font-semibold text-foreground break-all">{email}</p>
              {talentoId && (
                <p className="text-xs text-muted-foreground">
                  Assigned Talento ID: <span className="font-mono font-semibold text-primary">{talentoId}</span>
                </p>
              )}
            </div>

            {/* Mobile Verification Card */}
            <div className="rounded-xl border border-border bg-background p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Mobile Number</span>
                {phoneVerified ? (
                  <Badge className="bg-emerald-600 text-white hover:bg-emerald-600 gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Verified
                  </Badge>
                ) : (
                  <Badge variant="outline">Optional OTP Check</Badge>
                )}
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    inputMode="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setPhoneVerified(false);
                    }}
                    className="pl-9"
                  />
                </div>
                {!phoneVerified && (
                  <Button type="button" variant="outline" onClick={handleSendMobileOtp}>
                    Send OTP
                  </Button>
                )}
              </div>
              {generatedOtp && !phoneVerified && (
                <div className="space-y-2 rounded-lg border border-primary/25 bg-primary/5 p-3">
                  <p className="text-xs text-foreground">
                    Verification code sent: <span className="font-mono font-bold text-primary">{generatedOtp}</span>
                  </p>
                  <div className="flex gap-2">
                    <Input
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="Enter 6-digit OTP"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      className="h-9"
                    />
                    <Button type="button" size="sm" onClick={handleVerifyMobileOtp}>
                      Verify
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Optional Government ID Badge */}
          <div className="rounded-xl border border-border bg-background p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Government Identity Badge (Optional — Can also complete later)
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Upload Aadhaar, PAN, or Passport to unlock the green Identity Verified badge on your public profile.
                </p>
              </div>
              {idStatus && (
                <Badge variant={idStatus === "verified" ? "default" : "secondary"} className="capitalize">
                  Status: {idStatus}
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {(["aadhar", "passport", "driving_license"] as const).map((doc) => (
                <button
                  key={doc}
                  type="button"
                  onClick={() => setIdDocType(doc)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold uppercase transition-colors cursor-pointer ${
                    idDocType === doc
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {doc === "aadhar" ? "Aadhaar" : doc === "driving_license" ? "Driving License" : "Passport"}
                </button>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploadingId}
                onClick={() => idFileRef.current?.click()}
                className="gap-1.5"
              >
                {uploadingId ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                {uploadingId ? "Uploading..." : "Upload ID Document"}
              </Button>
              <input
                ref={idFileRef}
                type="file"
                accept="image/jpeg,image/png,application/pdf"
                onChange={handleIdentityDocUpload}
                className="hidden"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" onClick={handleNextStep} disabled={saving} className="gap-2">
              Continue to Photo &amp; Industry
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: UPLOAD PROFILE PIC & SELECT INDUSTRY */}
      {step === 2 && (
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold font-display">Step 2 · Upload Profile Picture &amp; Select Industry</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Add a professional headshot and pick your primary industry so recruiters and AI job matching can find you.
            </p>
          </div>

          {/* Profile Picture Uploader */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 rounded-xl border border-border bg-background p-5">
            <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-primary/30 bg-primary/10 flex items-center justify-center shrink-0">
              {photoUrl ? (
                <img src={photoUrl} alt={fullName || "Profile"} className="h-full w-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-primary">{initials}</span>
              )}
              <button
                type="button"
                aria-label="Upload profile photo"
                onClick={() => photoFileRef.current?.click()}
                disabled={uploadingPhoto}
                className="absolute inset-0 bg-black/45 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
              >
                {uploadingPhoto ? (
                  <Loader2 className="h-5 w-5 text-white animate-spin" />
                ) : (
                  <Camera className="h-5 w-5 text-white" />
                )}
              </button>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-bold text-foreground">Profile Picture</p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG, or WEBP up to 5 MB. Profiles with a clear headshot receive 3× more recruiter views.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploadingPhoto}
                  onClick={() => photoFileRef.current?.click()}
                  className="gap-1.5"
                >
                  {uploadingPhoto ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
                  {uploadingPhoto ? "Uploading..." : photoUrl ? "Change Photo" : "Upload Profile Photo"}
                </Button>
                {photoUrl && (
                  <Badge className="bg-emerald-600 text-white hover:bg-emerald-600 gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Photo Uploaded
                  </Badge>
                )}
              </div>
              <input
                ref={photoFileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Select Industry Visual Grid */}
          <div className="space-y-2.5">
            <Label className="text-sm font-bold">Select Your Primary Industry *</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {INDUSTRY_CATALOG.map((item) => {
                const selected = industry === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setIndustry(item.id)}
                    className={`rounded-xl border p-3 text-left text-xs font-semibold transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      selected
                        ? "border-primary bg-primary/10 text-primary shadow-xs"
                        : "border-border bg-background text-foreground hover:border-primary/40"
                    }`}
                  >
                    <span className="leading-snug">{item.label}</span>
                    {selected && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Basic Info Fields */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="wiz-name" className="text-xs font-semibold">Full Name *</Label>
              <div className="relative mt-1.5">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="wiz-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="pl-9"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="wiz-role" className="text-xs font-semibold">Current / Target Job Role *</Label>
              <div className="relative mt-1.5">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="wiz-role"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  placeholder="e.g. Full Stack Developer, Financial Analyst"
                  className="pl-9"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="wiz-headline" className="text-xs font-semibold">Professional Headline</Label>
              <Input
                id="wiz-headline"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Full Stack Engineer · React, TypeScript & PostgreSQL"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">Experience Level</Label>
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                {(["fresher", "experienced"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setExperienceLevel(lvl)}
                    className={`rounded-lg border py-2 text-xs font-semibold capitalize cursor-pointer ${
                      experienceLevel === lvl
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {experienceLevel === "experienced" && (
              <div>
                <Label htmlFor="wiz-yoe" className="text-xs font-semibold">Years of Experience</Label>
                <Input
                  id="wiz-yoe"
                  type="number"
                  min={0}
                  max={50}
                  value={yearsOfExp}
                  onChange={(e) => setYearsOfExp(Number(e.target.value))}
                  className="mt-1.5"
                />
              </div>
            )}

            <div>
              <Label htmlFor="wiz-city" className="text-xs font-semibold">City</Label>
              <div className="relative mt-1.5">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="wiz-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Bengaluru"
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="wiz-state" className="text-xs font-semibold">State</Label>
              <Input
                id="wiz-state"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                placeholder="e.g. Karnataka"
                className="mt-1.5"
              />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="wiz-about" className="text-xs font-semibold">About / Career Summary</Label>
              <Textarea
                id="wiz-about"
                rows={3}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Briefly summarize your strengths, domain focus, and career goals..."
                className="mt-1.5"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button type="button" variant="outline" onClick={() => setStep(1)} className="gap-1.5">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button type="button" onClick={handleNextStep} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Save &amp; Continue to Skills
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: SKILLS, EDUCATION & EXPERIENCE */}
      {step === 3 && (
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold font-display">Step 3 · Skills, Education &amp; Work Experience</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Add at least 3 skills to unlock AI Job Match Scores and your personalized Skill Gap Report.
            </p>
          </div>

          {/* Skills Builder */}
          <div className="rounded-xl border border-border bg-background p-5 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-bold flex items-center gap-2">
                <Code2 className="h-4 w-4 text-primary" />
                Your Skills ({skills.length})
              </Label>
              {skills.length >= 3 && (
                <Badge className="bg-emerald-600 text-white hover:bg-emerald-600 gap-1">
                  <CheckCircle2 className="h-3 w-3" /> 3+ Skills Added
                </Badge>
              )}
            </div>

            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">
                Recommended for <strong>{industry || "your industry"}</strong> (click to add):
              </p>
              <div className="flex flex-wrap gap-1.5">
                {suggestedForIndustry.map((sk) => {
                  const exists = skills.some((s) => s.name.toLowerCase() === sk.toLowerCase());
                  return (
                    <button
                      key={sk}
                      type="button"
                      disabled={exists}
                      onClick={() => addSkill(sk)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                        exists
                          ? "border-primary/30 bg-primary/10 text-primary opacity-60"
                          : "border-border bg-card hover:border-primary text-foreground"
                      }`}
                    >
                      + {sk}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Type any skill (e.g. Docker, Tally, Figma) and press Add..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill(skillInput);
                  }
                }}
                className="flex-1"
              />
              <select
                aria-label="Skill proficiency"
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value as SkillDraft["level"])}
                className="h-10 rounded-md border border-input bg-background px-3 text-xs font-medium"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
              <Button type="button" onClick={() => addSkill(skillInput)} className="gap-1.5">
                <Plus className="h-4 w-4" /> Add Skill
              </Button>
            </div>

            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {skills.map((s) => (
                  <span
                    key={s.name}
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                  >
                    {s.name}
                    <span className="text-[10px] uppercase opacity-75">· {s.level}</span>
                    <button
                      type="button"
                      aria-label={`Remove ${s.name}`}
                      onClick={() => removeSkill(s.name)}
                      className="hover:text-destructive cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Education */}
          <div className="rounded-xl border border-border bg-background p-5 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-bold flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                Education
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEducations((prev) => [...prev, { degree: "", institution: "", year: "" }])}
                className="h-8 text-xs gap-1"
              >
                <Plus className="h-3.5 w-3.5" /> Add Education
              </Button>
            </div>
            {educations.map((ed, idx) => (
              <div key={idx} className="grid sm:grid-cols-[1fr_1fr_110px_auto] gap-2.5 items-end">
                <div>
                  <Label className="text-[11px] text-muted-foreground">Degree / Specialization</Label>
                  <Input
                    placeholder="e.g. B.Tech Computer Science"
                    value={ed.degree}
                    onChange={(e) =>
                      setEducations((prev) =>
                        prev.map((item, i) => (i === idx ? { ...item, degree: e.target.value } : item))
                      )
                    }
                  />
                </div>
                <div>
                  <Label className="text-[11px] text-muted-foreground">College / University</Label>
                  <Input
                    placeholder="e.g. VTU / IIT Madras"
                    value={ed.institution}
                    onChange={(e) =>
                      setEducations((prev) =>
                        prev.map((item, i) => (i === idx ? { ...item, institution: e.target.value } : item))
                      )
                    }
                  />
                </div>
                <div>
                  <Label className="text-[11px] text-muted-foreground">Grad Year</Label>
                  <Input
                    placeholder="2025"
                    maxLength={4}
                    value={ed.year}
                    onChange={(e) =>
                      setEducations((prev) =>
                        prev.map((item, i) => (i === idx ? { ...item, year: e.target.value } : item))
                      )
                    }
                  />
                </div>
                {educations.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setEducations((prev) => prev.filter((_, i) => i !== idx))}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Work Experience / Internships */}
          <div className="rounded-xl border border-border bg-background p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-bold flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  Work Experience &amp; Internships {experienceLevel === "fresher" && "(Optional for Freshers)"}
                </Label>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setExperiences((prev) => [
                    ...prev,
                    { title: "", company: "", start: "", end: "Present", description: "" },
                  ])
                }
                className="h-8 text-xs gap-1"
              >
                <Plus className="h-3.5 w-3.5" /> Add Role
              </Button>
            </div>
            {experiences.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No experience entries added yet. Click &ldquo;Add Role&rdquo; to include internships or full-time work.
              </p>
            ) : (
              experiences.map((ex, idx) => (
                <div key={idx} className="rounded-lg border border-border bg-card p-3.5 space-y-3">
                  <div className="grid sm:grid-cols-4 gap-2.5">
                    <Input
                      placeholder="Role / Title"
                      value={ex.title}
                      onChange={(e) =>
                        setExperiences((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, title: e.target.value } : item))
                        )
                      }
                    />
                    <Input
                      placeholder="Company Name"
                      value={ex.company}
                      onChange={(e) =>
                        setExperiences((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, company: e.target.value } : item))
                        )
                      }
                    />
                    <Input
                      placeholder="Start Year (e.g. 2023)"
                      value={ex.start}
                      onChange={(e) =>
                        setExperiences((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, start: e.target.value } : item))
                        )
                      }
                    />
                    <div className="flex gap-1.5">
                      <Input
                        placeholder="End Year or Present"
                        value={ex.end}
                        onChange={(e) =>
                          setExperiences((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, end: e.target.value } : item))
                          )
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setExperiences((prev) => prev.filter((_, i) => i !== idx))}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    rows={2}
                    placeholder="Key impact & achievements..."
                    value={ex.description}
                    onChange={(e) =>
                      setExperiences((prev) =>
                        prev.map((item, i) => (i === idx ? { ...item, description: e.target.value } : item))
                      )
                    }
                  />
                </div>
              ))
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button type="button" variant="outline" onClick={() => setStep(2)} className="gap-1.5">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button type="button" onClick={handleNextStep} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Save &amp; Continue to Resume
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: UPLOAD RESUME, CAREER PREFERENCES & PUBLIC PROFILE SLUG */}
      {step === 4 && (
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold font-display">Step 4 · Upload Resume, Career Preferences &amp; Public Handle</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Upload your CV for One-Click Job Apply and configure your shareable public profile URL.
            </p>
          </div>

          {/* Resume Upload */}
          <div className="rounded-xl border border-border bg-background p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-bold flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Upload Resume (PDF or DOCX, max 5 MB)
              </p>
              <p className="text-xs text-muted-foreground">
                Stored securely in private storage and shared only with employers you apply to.
              </p>
              {resumePath && (
                <p className="text-xs font-medium text-emerald-600 flex items-center gap-1 pt-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Resume uploaded ({resumePath.split("/").pop()})
                </p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {resumeSignedUrl && (
                <Button asChild variant="outline" size="sm" className="gap-1.5">
                  <a href={resumeSignedUrl} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-3.5 w-3.5" /> Preview CV
                  </a>
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                disabled={uploadingResume}
                onClick={() => resumeFileRef.current?.click()}
                className="gap-1.5"
              >
                {uploadingResume ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                {uploadingResume ? "Uploading..." : resumePath ? "Replace Resume" : "Upload Resume"}
              </Button>
              <input
                ref={resumeFileRef}
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleResumeSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Career Preferences */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 flex items-center justify-between rounded-xl border border-border bg-background p-4">
              <div>
                <p className="text-sm font-bold">Open to Work</p>
                <p className="text-xs text-muted-foreground">Allow verified employers to discover and invite you to roles.</p>
              </div>
              <Switch checked={openToWork} onCheckedChange={setOpenToWork} />
            </div>

            <div>
              <Label className="text-xs font-semibold">Preferred Work Mode</Label>
              <div className="grid grid-cols-3 gap-2 mt-1.5">
                {(["Remote", "Hybrid", "Onsite"] as const).map((wm) => (
                  <button
                    key={wm}
                    type="button"
                    onClick={() => setWorkMode(wm)}
                    className={`rounded-lg border py-2 text-xs font-semibold cursor-pointer ${
                      workMode === wm
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground"
                    }`}
                  >
                    {wm}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold">Employment Type</Label>
              <div className="grid grid-cols-3 gap-2 mt-1.5">
                {(["Full-time", "Internship", "Contract"] as const).map((ty) => (
                  <button
                    key={ty}
                    type="button"
                    onClick={() => setEmploymentType(ty)}
                    className={`rounded-lg border py-2 text-xs font-semibold cursor-pointer ${
                      employmentType === ty
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground"
                    }`}
                  >
                    {ty}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="wiz-pref-loc" className="text-xs font-semibold">Preferred Locations (comma-separated)</Label>
              <Input
                id="wiz-pref-loc"
                placeholder="Bengaluru, Hyderabad, Remote"
                value={preferredLocations}
                onChange={(e) => setPreferredLocations(e.target.value)}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="wiz-sal" className="text-xs font-semibold">Expected CTC Range (LPA)</Label>
              <Input
                id="wiz-sal"
                placeholder="e.g. 8 - 14 LPA"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">Notice Period</Label>
              <select
                value={noticePeriod}
                onChange={(e) => setNoticePeriod(e.target.value)}
                className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="Immediate">Immediate Joiner</option>
                <option value="15 Days">15 Days</option>
                <option value="30 Days">30 Days</option>
                <option value="60 Days">60 Days</option>
                <option value="90 Days">90 Days</option>
              </select>
            </div>

            <div>
              <Label htmlFor="wiz-slug" className="text-xs font-semibold">Public Profile Handle (/u/your-handle)</Label>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="text-xs text-muted-foreground font-mono">/u/</span>
                <Input
                  id="wiz-slug"
                  placeholder="yogesh-c-pro"
                  value={portfolioSlug}
                  onChange={(e) => setPortfolioSlug(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="wiz-li" className="text-xs font-semibold">LinkedIn URL</Label>
              <Input
                id="wiz-li"
                placeholder="https://linkedin.com/in/yourprofile"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="wiz-gh" className="text-xs font-semibold">GitHub / Portfolio URL</Label>
              <Input
                id="wiz-gh"
                placeholder="https://github.com/yourusername"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="mt-1.5"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button type="button" variant="outline" onClick={() => setStep(3)} className="gap-1.5">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button type="button" onClick={handleNextStep} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Save &amp; Review Readiness
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 5: LAUNCHPAD */}
      {step === 5 && (
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <BadgeCheck className="h-9 w-9" />
          </div>
          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold font-display">Your Candidate Profile is Ready!</h2>
            <p className="text-sm text-muted-foreground">
              Profile completion: <strong>{completionScore}%</strong> · Industry:{" "}
              <strong>{industry || "General"}</strong> · Skills: <strong>{skills.length}</strong>
            </p>
            {portfolioSlug && (
              <p className="text-xs text-primary font-medium pt-1">
                Public Profile URL:{" "}
                <Link to={`/u/${portfolioSlug}`} className="underline font-mono">
                  {typeof window !== "undefined" ? window.location.origin : ""}/u/{portfolioSlug}
                </Link>
              </p>
            )}
          </div>

          <div className="grid sm:grid-cols-3 gap-3 max-w-2xl mx-auto pt-2">
            <Button type="button" onClick={handleFinishToDashboard} disabled={saving} className="h-11 gap-2">
              {embedded ? "View Saved Profile" : "Enter Employee Dashboard"}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button asChild variant="outline" className="h-11 gap-2">
              <Link to="/assessments/explore">
                <Award className="h-4 w-4 text-primary" />
                Take Proctored Assessment
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-11 gap-2">
              <Link to={portfolioSlug ? `/u/${portfolioSlug}` : "/my-profile"}>
                <Globe className="h-4 w-4 text-primary" />
                View Public Profile
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  if (embedded) return body;

  return (
    <>
      <Helmet>
        <title>Account Setup Wizard | IAmTalento</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
            <Link to="/" className="flex items-center gap-2">
              <img src={siteLogo.url} alt="I Am Talento" className="h-9 w-auto object-contain" />
            </Link>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => navigate("/talento-pro?view=dash")}
                className="text-xs text-muted-foreground hover:text-foreground gap-1"
              >
                Skip to Employee Dashboard
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </header>
        {body}
      </div>
    </>
  );
};

export default OnboardingWizard;
