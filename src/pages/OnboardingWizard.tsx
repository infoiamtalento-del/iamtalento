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
  FolderKanban,
  Github,
  Globe,
  GraduationCap,
  Heart,
  ImagePlus,
  Languages,
  Linkedin,
  Loader2,
  MapPin,
  Palette,
  Phone,
  Plus,
  RotateCcw,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
  Trophy,
  Upload,
  User,
  Video,
  Wrench,
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
import defaultCover from "@/assets/profile-office-cover.jpg";
import CompletionRing from "@/components/profile/CompletionRing";
import { CharCount } from "@/components/profile/CharCount";
import {
  PROFILE_CHAR_LIMITS,
  formatSmartTag,
  getSuggestedToolsForIndustry,
  hasCustomExpertiseCards,
} from "@/components/profile/profileFormatters";
import {
  getResumeSignedUrl,
  loadFullLiveProfile,
  normalizeLiveProfile,
  persistBannerImmediate,
  persistProfilePhotoImmediate,
  saveRichCandidateProfile,
  uploadBannerPhotoFile,
  uploadProfilePhotoFile,
  uploadProjectImageFile,
  uploadResumeFile,
  type ExpertiseCardItem,
  type RichAwardItem,
  type RichCertificationItem,
  type RichEducationItem,
  type RichExperienceItem,
  type RichProjectItem,
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
  { num: 2, title: "Banner & Identity", subtitle: "Cover, photo, specialty & bio", icon: Camera },
  { num: 3, title: "Skills & Experience", subtitle: "Skills, tools, work & college", icon: Code2 },
  { num: 4, title: "Projects & Proof", subtitle: "Projects, certs & awards", icon: FolderKanban },
  { num: 5, title: "Resume & Launch", subtitle: "CV, video, status & links", icon: Sparkles },
] as const;

interface SkillDraft {
  name: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
}

interface OnboardingWizardProps {
  embedded?: boolean;
  initialStep?: number;
  onSaved?: () => void;
  onNavigatePro?: (view: ProView) => void;
}

const createEmptyExpertise = (): ExpertiseCardItem[] => [
  { title: "", sub: "" },
  { title: "", sub: "" },
  { title: "", sub: "" },
  { title: "", sub: "" },
];

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

  // Step 2: Banner, Photo & Identity
  const [bannerUrl, setBannerUrl] = useState("");
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const bannerFileRef = useRef<HTMLInputElement>(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoFileRef = useRef<HTMLInputElement>(null);
  const [fullName, setFullName] = useState("");
  const [industry, setIndustry] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [headline, setHeadline] = useState("");
  const [subHeadline, setSubHeadline] = useState("");
  const [experienceLevel, setExperienceLevel] = useState<"fresher" | "experienced">("fresher");
  const [yearsOfExp, setYearsOfExp] = useState<number>(0);
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [country, setCountry] = useState("India");
  const [about, setAbout] = useState("");
  const [focusBadges, setFocusBadges] = useState<string[]>([]);
  const [badgeInput, setBadgeInput] = useState("");
  const [expertiseCards, setExpertiseCards] = useState<ExpertiseCardItem[]>(createEmptyExpertise);

  // Step 3: Skills, Tools, Education & Experience
  const [skills, setSkills] = useState<SkillDraft[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [skillLevel, setSkillLevel] = useState<SkillDraft["level"]>("intermediate");
  const [tools, setTools] = useState<string[]>([]);
  const [toolInput, setToolInput] = useState("");
  const [educations, setEducations] = useState<RichEducationItem[]>([
    { institution: "", degree: "", field_of_study: "", start_year: "", year: "", grade: "" },
  ]);
  const [experiences, setExperiences] = useState<RichExperienceItem[]>([]);

  // Step 4: Projects, Certifications & Awards
  const [projects, setProjects] = useState<RichProjectItem[]>([]);
  const [uploadingProjIdx, setUploadingProjIdx] = useState<number | null>(null);
  const [certifications, setCertifications] = useState<RichCertificationItem[]>([]);
  const [awards, setAwards] = useState<RichAwardItem[]>([]);

  // Step 5: Resume, Video Resume, Availability, Personal & Links
  const [resumePath, setResumePath] = useState<string | null>(null);
  const [resumeSignedUrl, setResumeSignedUrl] = useState<string | null>(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const resumeFileRef = useRef<HTMLInputElement>(null);
  const [videoIntroUrl, setVideoIntroUrl] = useState("");
  const [videoPitch, setVideoPitch] = useState("");
  const [openToWork, setOpenToWork] = useState(true);
  const [openForFreelance, setOpenForFreelance] = useState(false);
  const [workMode, setWorkMode] = useState<"Remote" | "Hybrid" | "Onsite">("Hybrid");
  const [employmentType, setEmploymentType] = useState("Full-time");
  const [preferredLocations, setPreferredLocations] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("Immediate");
  const [languages, setLanguages] = useState<{ name: string; level: string }[]>([
    { name: "English", level: "Fluent" },
  ]);
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [hobbyInput, setHobbyInput] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState("");
  const [portfolioSlug, setPortfolioSlug] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [kaggleUrl, setKaggleUrl] = useState("");
  const [behanceUrl, setBehanceUrl] = useState("");
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
        setHeadline("Frontend Developer");
        setSubHeadline("React & TypeScript Specialist");
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
        const live = await loadFullLiveProfile();
        if (!alive || !live) {
          setFullName((authData.user.user_metadata?.full_name as string) || "");
          setPhone((authData.user.user_metadata?.phone as string) || "");
          setLoading(false);
          return;
        }
        const norm = normalizeLiveProfile(live);
        setShellExtra(norm.shellState || {});
        setTalentoId(norm.iamTalentoId);
        setEmail(norm.email || authData.user.email || "");
        setFullName(norm.fullName);
        setPhone(norm.phone);
        setPhoneVerified(Boolean(norm.shellState?.phv));
        setIdStatus(norm.verification.identity_status || null);
        setBannerUrl(norm.bannerPhotoUrl);
        setPhotoUrl(norm.profilePhotoUrl);
        setIndustry(norm.industry);
        setJobRole(norm.jobRole);
        setHeadline(norm.headline);
        setSubHeadline(norm.subHeadline);
        setExperienceLevel(norm.experienceLevel === "experienced" ? "experienced" : "fresher");
        setYearsOfExp(norm.yearsOfExperience);
        setCity(norm.city);
        setStateName(norm.state);
        setCountry(norm.country || "India");
        setAbout(norm.about);
        setFocusBadges(norm.focusBadges);
        if (hasCustomExpertiseCards(norm.expertiseCards, norm.industry, norm.headline || norm.jobRole)) {
          const padded = [...norm.expertiseCards];
          while (padded.length < 4) {
            padded.push({ title: "", sub: "" });
          }
          setExpertiseCards(padded.slice(0, 4));
        } else {
          setExpertiseCards(createEmptyExpertise());
        }

        if (norm.skills.length > 0) {
          setSkills(
            norm.skills.map((s) => ({
              name: s.name,
              level: (["beginner", "intermediate", "advanced", "expert"].includes(s.level.toLowerCase())
                ? s.level.toLowerCase()
                : "intermediate") as SkillDraft["level"],
            }))
          );
        }
        setTools(norm.tools);
        if (norm.educations.length > 0) {
          setEducations(norm.educations);
        }
        if (norm.experiences.length > 0) {
          setExperiences(norm.experiences);
        }
        if (norm.projects.length > 0) {
          setProjects(norm.projects);
        }
        if (norm.certifications.length > 0) {
          setCertifications(norm.certifications);
        }
        if (norm.awards.length > 0) {
          setAwards(norm.awards);
        }
        if (norm.languages.length > 0) {
          setLanguages(norm.languages);
        }
        setHobbies(norm.hobbies);
        setInterests(norm.interests);

        setResumePath(norm.resumePath || null);
        if (norm.resumePath) {
          getResumeSignedUrl(norm.resumePath).then((u) => {
            if (alive) setResumeSignedUrl(u);
          });
        } else if (norm.resumeUrl) {
          setResumeSignedUrl(norm.resumeUrl);
        }

        setVideoIntroUrl(norm.videoIntroUrl);
        setVideoPitch(norm.videoPitch);
        setOpenToWork(norm.openToWork);
        setOpenForFreelance(norm.openForFreelance);
        setWorkMode(norm.workMode);
        setEmploymentType(norm.employmentType);
        setPreferredLocations(norm.preferredLocations.join(", "));
        setSalaryRange(norm.salaryRange);
        setNoticePeriod(norm.noticePeriod);

        if (norm.portfolioSlug) {
          setPortfolioSlug(norm.portfolioSlug);
        } else if (norm.fullName) {
          const baseSlug = norm.fullName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")
            .slice(0, 24);
          const suffix = (norm.iamTalentoId || "").replace(/[^a-zA-Z0-9]/g, "").slice(-4).toLowerCase();
          if (baseSlug) setPortfolioSlug(`${baseSlug}-${suffix || "pro"}`);
        }

        setLinkedinUrl(norm.linkedinUrl);
        setGithubUrl(norm.githubUrl);
        setPortfolioUrl(norm.portfolioUrl);
        setKaggleUrl(norm.kaggleUrl);
        setBehanceUrl(norm.behanceUrl);
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
    if (phone.trim()) pts += 6;
    if (photoUrl) pts += 12;
    if (bannerUrl) pts += 6;
    if (industry) pts += 10;
    if (headline.trim() || jobRole.trim()) pts += 10;
    if (about.trim()) pts += 8;
    if (city.trim()) pts += 6;
    if (skills.length >= 3) pts += 12;
    if (educations.some((e) => e.institution.trim())) pts += 8;
    if (projects.some((p) => p.title.trim()) || experiences.some((e) => e.title.trim())) pts += 6;
    if (resumePath || resumeSignedUrl || linkedinUrl.trim() || githubUrl.trim()) pts += 6;
    return Math.min(100, pts);
  }, [
    fullName,
    phone,
    photoUrl,
    bannerUrl,
    industry,
    headline,
    jobRole,
    about,
    city,
    skills,
    educations,
    projects,
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

  const suggestedTools = useMemo(() => getSuggestedToolsForIndustry(industry), [industry]);

  const persistCurrentProgress = async (silent = false): Promise<boolean> => {
    if (!userId) {
      if (!silent) toast.success("Demo profile preview updated! Sign up for a real account to save permanently.");
      return true;
    }
    setSaving(true);
    try {
      const saved = await saveRichCandidateProfile({
        fullName,
        phone,
        headline: headline.trim() || jobRole.trim(),
        subHeadline,
        jobRole,
        industry,
        experienceLevel,
        yearsOfExperience: experienceLevel === "fresher" ? 0 : Math.max(0, Number(yearsOfExp) || 0),
        city,
        state: stateName,
        country: country || "India",
        about,
        profilePhotoUrl: photoUrl,
        bannerPhotoUrl: bannerUrl,
        openToWork,
        openForFreelance,
        workMode,
        employmentType,
        noticePeriod,
        salaryRange,
        preferredLocations: preferredLocations
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        portfolioSlug,
        resumePath,
        videoIntroUrl,
        videoPitch,
        linkedinUrl,
        githubUrl,
        portfolioUrl,
        kaggleUrl,
        behanceUrl,
        focusBadges,
        expertiseCards,
        skills: skills.map((s) => ({ name: s.name, level: s.level, category: "technical" })),
        tools,
        experiences,
        projects,
        educations,
        certifications,
        awards,
        languages,
        hobbies,
        interests,
        phoneVerified,
        existingShellState: shellExtra,
      });
      if (saved?.shell_state) {
        setShellExtra(saved.shell_state);
      }
      if (!silent) toast.success("Profile saved!");
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
    e.target.value = "";
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

  const handleBannerSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !userId) return;
    setUploadingBanner(true);
    try {
      const url = await uploadBannerPhotoFile(file, userId);
      setBannerUrl(url);
      const saved = await persistBannerImmediate(url, userId);
      if (saved?.shell_state) {
        setShellExtra(saved.shell_state);
      }
      onSaved?.();
      toast.success("Cover banner updated and saved!");
    } catch (err: any) {
      toast.error(err?.message || "Banner upload failed");
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleResetBanner = async () => {
    setBannerUrl("");
    if (!userId) return;
    setUploadingBanner(true);
    try {
      const saved = await persistBannerImmediate("", userId);
      if (saved?.shell_state) {
        setShellExtra(saved.shell_state);
      }
      onSaved?.();
      toast.success("Reset to default cover banner.");
    } catch (err: any) {
      toast.error(err?.message || "Could not reset banner");
    } finally {
      setUploadingBanner(false);
    }
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !userId) return;
    setUploadingPhoto(true);
    try {
      const url = await uploadProfilePhotoFile(file, userId);
      setPhotoUrl(url);
      await persistProfilePhotoImmediate(url);
      onSaved?.();
      toast.success("Profile picture updated and saved!");
    } catch (err: any) {
      toast.error(err?.message || "Photo upload failed");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleProjectImageSelect = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !userId) return;
    setUploadingProjIdx(idx);
    try {
      const url = await uploadProjectImageFile(file, userId);
      setProjects((prev) => prev.map((p, i) => (i === idx ? { ...p, image_url: url } : p)));
      toast.success("Project screenshot uploaded!");
    } catch (err: any) {
      toast.error(err?.message || "Project screenshot upload failed");
    } finally {
      setUploadingProjIdx(null);
    }
  };

  const handleResumeSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
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

  const addUniqueChip = (
    raw: string,
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    clearInput?: () => void
  ) => {
    const clean = raw.trim();
    if (!clean) return;
    if (!list.some((x) => x.toLowerCase() === clean.toLowerCase())) {
      setter((prev) => [...prev, clean]);
    }
    clearInput?.();
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

  const handleSaveAndViewProfile = async () => {
    const ok = await persistCurrentProgress(false);
    if (!ok) return;
    if (embedded && onNavigatePro) {
      onNavigatePro("profile");
    } else {
      navigate("/talento-pro?view=profile");
    }
  };

  const handleSaveAndGoDashboard = async () => {
    const ok = await persistCurrentProgress(true);
    if (!ok) return;
    toast.success("Profile setup complete! Welcome to Talento Pro.");
    if (embedded && onNavigatePro) {
      onNavigatePro("dash");
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
    <div className={embedded ? "space-y-6" : "container py-8 space-y-6"}>
      {/* Stepper Header */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-border">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              {embedded ? "Full Profile Builder & Editor" : "Account Creation · Step-by-Step Setup"}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold font-display mt-1">
              {embedded ? "Customize Every Section of Your Profile" : "Build Your Verified Candidate Profile"}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Upload your cover banner &amp; headshot, add skills, tools, projects, awards, and availability.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="flex items-center gap-2.5">
              <CompletionRing percentage={completionScore} size={56} strokeWidth={5} />
              <div className="text-xs">
                <p className="font-bold text-foreground">{completionScore}% Ready</p>
                {talentoId && <p className="font-mono text-primary mt-0.5">{talentoId}</p>}
              </div>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={handleSaveAndViewProfile}
              disabled={saving}
              className="gap-1.5 cursor-pointer"
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              Save &amp; View Profile
            </Button>
          </div>
        </div>

        {/* Clickable 5-step bar */}
        <nav aria-label="Profile setup steps" className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-4">
          {WIZARD_STEPS.map(({ num, title, subtitle }) => {
            const active = step === num;
            const done = step > num;
            return (
              <button
                key={num}
                type="button"
                aria-current={active ? "step" : undefined}
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
        </nav>
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

            <div className="rounded-xl border border-border bg-background p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="wiz-phone" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Mobile Number
                </Label>
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
                    id="wiz-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    maxLength={PROFILE_CHAR_LIMITS.phone}
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
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
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

          <div className="rounded-xl border border-border bg-background p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Government Identity Badge (Optional — Can also complete later)
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Upload Aadhaar, Passport, or Driving License to unlock the green Identity Verified badge.
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
                className="dp-visually-hidden"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" onClick={handleNextStep} disabled={saving} className="gap-2">
              Continue to Banner &amp; Identity
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: COVER BANNER, PROFILE PHOTO & IDENTITY */}
      {step === 2 && (
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold font-display">Step 2 · Cover Banner, Profile Photo &amp; Identity</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Customize your profile header exactly like the featured Talento Pro profile — upload a cover banner, headshot, specialty, summary, and focus badges.
            </p>
          </div>

          {/* Live Arjun-Mehta-Style Banner + Avatar Preview & Uploader */}
          <div className="rounded-2xl border border-border overflow-hidden bg-background">
            <div className="relative h-36 sm:h-44 w-full overflow-hidden bg-secondary">
              <img
                src={bannerUrl || defaultCover}
                alt="Cover banner preview"
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute right-3 top-3 flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  disabled={uploadingBanner}
                  onClick={() => bannerFileRef.current?.click()}
                  className="h-8 text-xs gap-1.5 shadow-md cursor-pointer"
                >
                  {uploadingBanner ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
                  {uploadingBanner ? "Uploading..." : bannerUrl ? "Change Banner Image" : "Upload Banner Image"}
                </Button>
                {bannerUrl && (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    disabled={uploadingBanner}
                    onClick={handleResetBanner}
                    className="h-8 px-2.5 text-xs shadow-md cursor-pointer"
                    title="Reset to default banner"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
              <input
                ref={bannerFileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleBannerSelect}
                className="dp-visually-hidden"
              />
            </div>

            <div className="px-5 pb-5 -mt-10 relative flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-card bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-md">
                {photoUrl ? (
                  <img src={photoUrl} alt={fullName || "Profile"} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold">{initials}</span>
                )}
                <button
                  type="button"
                  aria-label="Upload profile photo"
                  onClick={() => photoFileRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="absolute inset-0 bg-black/45 opacity-0 hover:opacity-100 focus-visible:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                >
                  {uploadingPhoto ? (
                    <Loader2 className="h-5 w-5 text-white animate-spin" />
                  ) : (
                    <Camera className="h-5 w-5 text-white" />
                  )}
                </button>
              </div>
              <div className="flex-1 pt-1 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-foreground">Cover Banner &amp; Profile Photo</p>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG, or WEBP up to 5 MB each. Recommended banner size: 1920 × 512 px.
                  </p>
                </div>
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
                    {uploadingPhoto ? "Uploading..." : photoUrl ? "Change Photo" : "Upload Photo"}
                  </Button>
                  <input
                    ref={photoFileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoSelect}
                    className="dp-visually-hidden"
                  />
                </div>
              </div>
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

          {/* Basic Info + Specialty Fields */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="wiz-name" className="text-xs font-semibold">Full Name *</Label>
                <CharCount value={fullName} max={PROFILE_CHAR_LIMITS.fullName} />
              </div>
              <div className="relative mt-1.5">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="wiz-name"
                  autoComplete="name"
                  maxLength={PROFILE_CHAR_LIMITS.fullName}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Arjun Mehta"
                  className="pl-9"
                  required
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="wiz-role" className="text-xs font-semibold">Current / Target Job Role *</Label>
                <CharCount value={jobRole} max={PROFILE_CHAR_LIMITS.jobRole} />
              </div>
              <div className="relative mt-1.5">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="wiz-role"
                  maxLength={PROFILE_CHAR_LIMITS.jobRole}
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  placeholder="e.g. Digital Marketing Executive or Senior Engineer"
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="wiz-headline" className="text-xs font-semibold">Designation / Headline</Label>
                <CharCount value={headline} max={PROFILE_CHAR_LIMITS.headline} />
              </div>
              <Input
                id="wiz-headline"
                maxLength={PROFILE_CHAR_LIMITS.headline}
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Digital Marketing Executive · Growth & Brand"
                className="mt-1.5"
              />
            </div>
            <div>
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="wiz-subheadline" className="text-xs font-semibold">Sub-Headline / Specialty</Label>
                <CharCount value={subHeadline} max={PROFILE_CHAR_LIMITS.subHeadline} />
              </div>
              <Input
                id="wiz-subheadline"
                maxLength={PROFILE_CHAR_LIMITS.subHeadline}
                value={subHeadline}
                onChange={(e) => setSubHeadline(e.target.value)}
                placeholder="e.g. Performance Marketing & Analytics Specialist"
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
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="wiz-city" className="text-xs font-semibold">City</Label>
                <CharCount value={city} max={PROFILE_CHAR_LIMITS.city} />
              </div>
              <div className="relative mt-1.5">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="wiz-city"
                  autoComplete="address-level2"
                  maxLength={PROFILE_CHAR_LIMITS.city}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Chennai or Bengaluru"
                  className="pl-9"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="wiz-state" className="text-xs font-semibold">State</Label>
                  <CharCount value={stateName} max={PROFILE_CHAR_LIMITS.state} />
                </div>
                <Input
                  id="wiz-state"
                  autoComplete="address-level1"
                  maxLength={PROFILE_CHAR_LIMITS.state}
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  placeholder="Tamil Nadu"
                  className="mt-1.5"
                />
              </div>
              <div>
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="wiz-country" className="text-xs font-semibold">Country</Label>
                  <CharCount value={country} max={PROFILE_CHAR_LIMITS.country} />
                </div>
                <Input
                  id="wiz-country"
                  autoComplete="country-name"
                  maxLength={PROFILE_CHAR_LIMITS.country}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="India"
                  className="mt-1.5"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="wiz-about" className="text-xs font-semibold">About Me Summary</Label>
                <CharCount value={about} max={PROFILE_CHAR_LIMITS.about} />
              </div>
              <Textarea
                id="wiz-about"
                rows={4}
                maxLength={PROFILE_CHAR_LIMITS.about}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Summarize your core expertise, measurable outcomes, and the value you bring to teams..."
                className="mt-1.5"
              />
            </div>

            {/* Focus Badges */}
            <div className="sm:col-span-2 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="wiz-badge-input" className="text-xs font-semibold">
                  Hero Focus Badges (up to 6 displayed beneath your summary)
                </Label>
                <CharCount value={badgeInput} max={PROFILE_CHAR_LIMITS.tagChip} />
              </div>
              <div className="flex gap-2">
                <Input
                  id="wiz-badge-input"
                  maxLength={PROFILE_CHAR_LIMITS.tagChip}
                  value={badgeInput}
                  onChange={(e) => setBadgeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                      e.preventDefault();
                      addUniqueChip(badgeInput, focusBadges, setFocusBadges, () => setBadgeInput(""));
                    }
                  }}
                  placeholder="e.g. Performance Marketing, Social Media Strategy, Full-Stack"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addUniqueChip(badgeInput, focusBadges, setFocusBadges, () => setBadgeInput(""))}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              {focusBadges.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {focusBadges.map((b) => (
                    <span
                      key={b}
                      className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium"
                    >
                      {formatSmartTag(b)}
                      <button
                        type="button"
                        onClick={() => setFocusBadges((prev) => prev.filter((x) => x !== b))}
                        aria-label={`Remove ${b}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 4 Core Expertise Pillars */}
            <div className="sm:col-span-2 space-y-2 pt-1">
              <div>
                <Label className="text-xs font-semibold">4 Core Spotlight Cards (optional — displayed inside About Me)</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Leave blank to auto-curate highlights from your role, skills &amp; tools, or customize up to 4 cards.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {expertiseCards.slice(0, 4).map((card, idx) => (
                  <div key={idx} className="rounded-xl border border-border bg-background p-3 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-medium text-muted-foreground">Card #{idx + 1} Title</span>
                      <CharCount value={card.title} max={PROFILE_CHAR_LIMITS.expertiseTitle} />
                    </div>
                    <Input
                      maxLength={PROFILE_CHAR_LIMITS.expertiseTitle}
                      value={card.title}
                      onChange={(e) =>
                        setExpertiseCards((prev) =>
                          prev.map((c, i) => (i === idx ? { ...c, title: e.target.value } : c))
                        )
                      }
                      placeholder={`Highlight ${idx + 1} (e.g. Performance Marketing)`}
                      className="h-8 text-xs font-semibold"
                    />
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] text-muted-foreground">Subtitle</span>
                      <CharCount value={card.sub} max={PROFILE_CHAR_LIMITS.expertiseSub} />
                    </div>
                    <Input
                      maxLength={PROFILE_CHAR_LIMITS.expertiseSub}
                      value={card.sub}
                      onChange={(e) =>
                        setExpertiseCards((prev) =>
                          prev.map((c, i) => (i === idx ? { ...c, sub: e.target.value } : c))
                        )
                      }
                      placeholder="Short proof point (e.g. Multi-channel ROI growth)"
                      className="h-8 text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button type="button" variant="outline" onClick={() => setStep(1)} className="gap-1.5">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button type="button" onClick={handleNextStep} disabled={saving} className="gap-2">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save &amp; Continue to Skills
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: SKILLS, TOOLS, EDUCATION & WORK EXPERIENCE */}
      {step === 3 && (
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold font-display">Step 3 · Skills, Tools, Education &amp; Work Experience</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Add your technical skills, daily tools, university degrees (with CGPA), and work history.
            </p>
          </div>

          {/* Skills Builder */}
          <div className="rounded-xl border border-border bg-background p-5 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-bold flex items-center gap-2">
                <Code2 className="h-4 w-4 text-primary" />
                Skills ({skills.length})
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
                maxLength={PROFILE_CHAR_LIMITS.tagChip}
                placeholder="Type any skill (e.g. Performance Marketing, SEO, React) and press Add..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.nativeEvent.isComposing) {
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
                    {formatSmartTag(s.name)}
                    <span className="text-[10px] uppercase opacity-75">· {s.level}</span>
                    <button
                      type="button"
                      aria-label={`Remove ${s.name}`}
                      onClick={() => setSkills((prev) => prev.filter((item) => item.name !== s.name))}
                      className="hover:text-destructive cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Tools Builder */}
          <div className="rounded-xl border border-border bg-background p-5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <Label className="text-sm font-bold flex items-center gap-2">
                <Wrench className="h-4 w-4 text-primary" />
                Tools &amp; Platforms ({tools.length})
              </Label>
              <CharCount value={toolInput} max={PROFILE_CHAR_LIMITS.tagChip} />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {suggestedTools.map((tl) => {
                const exists = tools.some((x) => x.toLowerCase() === tl.toLowerCase());
                return (
                  <button
                    key={tl}
                    type="button"
                    disabled={exists}
                    onClick={() => addUniqueChip(tl, tools, setTools)}
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium cursor-pointer ${
                      exists
                        ? "border-primary/30 bg-primary/10 text-primary opacity-60"
                        : "border-border bg-card hover:border-primary text-foreground"
                    }`}
                  >
                    + {tl}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2">
              <Input
                maxLength={PROFILE_CHAR_LIMITS.tagChip}
                placeholder="Add tool (e.g. Google Analytics, HubSpot, Figma, Docker)..."
                value={toolInput}
                onChange={(e) => setToolInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    addUniqueChip(toolInput, tools, setTools, () => setToolInput(""));
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addUniqueChip(toolInput, tools, setTools, () => setToolInput(""))}
              >
                Add Tool
              </Button>
            </div>
            {tools.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tools.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1 text-xs font-medium"
                  >
                    {formatSmartTag(t)}
                    <button
                      type="button"
                      aria-label={`Remove ${t}`}
                      onClick={() => setTools((prev) => prev.filter((x) => x !== t))}
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
                onClick={() =>
                  setEducations((prev) => [
                    ...prev,
                    { institution: "", degree: "", field_of_study: "", start_year: "", year: "", grade: "" },
                  ])
                }
                className="h-8 text-xs gap-1"
              >
                <Plus className="h-3.5 w-3.5" /> Add Education
              </Button>
            </div>
            {educations.map((ed, idx) => (
              <div key={idx} className="rounded-lg border border-border bg-card p-3.5 space-y-2.5">
                <div className="grid sm:grid-cols-2 gap-2.5">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <Label className="text-[11px] text-muted-foreground">College / University *</Label>
                      <CharCount value={ed.institution} max={PROFILE_CHAR_LIMITS.eduInstitution} />
                    </div>
                    <Input
                      maxLength={PROFILE_CHAR_LIMITS.eduInstitution}
                      placeholder="e.g. Loyola College or IIT Madras"
                      value={ed.institution}
                      onChange={(e) =>
                        setEducations((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, institution: e.target.value } : item))
                        )
                      }
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <Label className="text-[11px] text-muted-foreground">Degree / Specialization</Label>
                      <CharCount value={ed.degree} max={PROFILE_CHAR_LIMITS.eduDegree} />
                    </div>
                    <Input
                      maxLength={PROFILE_CHAR_LIMITS.eduDegree}
                      placeholder="e.g. BBA Marketing or B.Tech CS"
                      value={ed.degree}
                      onChange={(e) =>
                        setEducations((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, degree: e.target.value } : item))
                        )
                      }
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-[120px_120px_1fr_auto] gap-2.5 items-end">
                  <div>
                    <Label className="text-[11px] text-muted-foreground">Start Year</Label>
                    <Input
                      placeholder="2020"
                      inputMode="numeric"
                      maxLength={PROFILE_CHAR_LIMITS.eduYear}
                      value={ed.start_year}
                      onChange={(e) =>
                        setEducations((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, start_year: e.target.value } : item))
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] text-muted-foreground">Grad Year</Label>
                    <Input
                      placeholder="2024"
                      inputMode="numeric"
                      maxLength={PROFILE_CHAR_LIMITS.eduYear}
                      value={ed.year}
                      onChange={(e) =>
                        setEducations((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, year: e.target.value } : item))
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] text-muted-foreground">Grade / CGPA</Label>
                    <Input
                      placeholder="e.g. 8.7 CGPA or 94.2%"
                      maxLength={PROFILE_CHAR_LIMITS.eduGrade}
                      value={ed.grade}
                      onChange={(e) =>
                        setEducations((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, grade: e.target.value } : item))
                        )
                      }
                    />
                  </div>
                  {educations.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Remove education"
                      onClick={() => setEducations((prev) => prev.filter((_, i) => i !== idx))}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Work Experience */}
          <div className="rounded-xl border border-border bg-background p-5 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-bold flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                Work Experience &amp; Internships {experienceLevel === "fresher" && "(Optional for Freshers)"}
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setExperiences((prev) => [
                    ...prev,
                    { title: "", company: "", location: "", start: "", end: "Present", description: "", tools: [] },
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
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    <Input
                      maxLength={PROFILE_CHAR_LIMITS.expTitle}
                      placeholder="Role / Title *"
                      value={ex.title}
                      onChange={(e) =>
                        setExperiences((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, title: e.target.value } : item))
                        )
                      }
                    />
                    <Input
                      maxLength={PROFILE_CHAR_LIMITS.expCompany}
                      placeholder="Company Name *"
                      value={ex.company}
                      onChange={(e) =>
                        setExperiences((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, company: e.target.value } : item))
                        )
                      }
                    />
                    <Input
                      maxLength={PROFILE_CHAR_LIMITS.expLocation}
                      placeholder="Location (e.g. Chennai)"
                      value={ex.location}
                      onChange={(e) =>
                        setExperiences((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, location: e.target.value } : item))
                        )
                      }
                    />
                    <div className="flex gap-1.5">
                      <Input
                        maxLength={PROFILE_CHAR_LIMITS.expPeriod}
                        placeholder="Start (Jun 2024)"
                        value={ex.start}
                        onChange={(e) =>
                          setExperiences((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, start: e.target.value } : item))
                          )
                        }
                      />
                      <Input
                        maxLength={PROFILE_CHAR_LIMITS.expPeriod}
                        placeholder="End / Present"
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
                        aria-label="Remove experience"
                        onClick={() => setExperiences((prev) => prev.filter((_, i) => i !== idx))}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] text-muted-foreground">
                        Key Achievements (use &quot;- &quot; on new lines for clean bullets)
                      </span>
                      <CharCount value={ex.description} max={PROFILE_CHAR_LIMITS.expDescription} />
                    </div>
                    <Textarea
                      rows={3}
                      maxLength={PROFILE_CHAR_LIMITS.expDescription}
                      placeholder="- Executed digital campaigns increasing lead conversion by 35%..."
                      value={ex.description}
                      onChange={(e) =>
                        setExperiences((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, description: e.target.value } : item))
                        )
                      }
                    />
                  </div>
                  <Input
                    maxLength={250}
                    placeholder="Tools & skills used in this role (comma-separated, e.g. Meta Ads, GA4, Figma)"
                    value={ex.tools.join(", ")}
                    onChange={(e) =>
                      setExperiences((prev) =>
                        prev.map((item, i) =>
                          i === idx
                            ? {
                                ...item,
                                tools: e.target.value
                                  .split(",")
                                  .map((t) => t.trim())
                                  .filter(Boolean),
                              }
                            : item
                        )
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
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save &amp; Continue to Projects
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: PROJECTS, CERTIFICATIONS & AWARDS */}
      {step === 4 && (
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold font-display">Step 4 · Projects, Certifications &amp; Awards</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Showcase featured projects (with preview screenshots, Live Demo &amp; GitHub links), certifications, and awards.
            </p>
          </div>

          {/* Projects */}
          <div className="rounded-xl border border-border bg-background p-5 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-bold flex items-center gap-2">
                <FolderKanban className="h-4 w-4 text-primary" />
                Projects &amp; Case Studies ({projects.length})
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setProjects((prev) => [
                    ...prev,
                    { title: "", role: "", description: "", tools: [], url: "", github_url: "", image_url: "", impact: "" },
                  ])
                }
                className="h-8 text-xs gap-1"
              >
                <Plus className="h-3.5 w-3.5" /> Add Project
              </Button>
            </div>
            {projects.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Add 1–4 signature projects or campaign case studies with cover images, tools, and live links.
              </p>
            ) : (
              projects.map((proj, idx) => (
                <div key={idx} className="rounded-lg border border-border bg-card p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-muted-foreground">Project #{idx + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setProjects((prev) => prev.filter((_, i) => i !== idx))}
                      className="h-7 text-xs text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                    </Button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] text-muted-foreground">Project / Campaign Title *</span>
                        <CharCount value={proj.title} max={PROFILE_CHAR_LIMITS.projectTitle} />
                      </div>
                      <Input
                        maxLength={PROFILE_CHAR_LIMITS.projectTitle}
                        placeholder="e.g. Omnichannel Brand Launch or CloudSync Platform"
                        value={proj.title}
                        onChange={(e) =>
                          setProjects((prev) => prev.map((p, i) => (i === idx ? { ...p, title: e.target.value } : p)))
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] text-muted-foreground">Your Role</span>
                        <CharCount value={proj.role} max={PROFILE_CHAR_LIMITS.projectRole} />
                      </div>
                      <Input
                        maxLength={PROFILE_CHAR_LIMITS.projectRole}
                        placeholder="e.g. Campaign Strategist or Lead Engineer"
                        value={proj.role}
                        onChange={(e) =>
                          setProjects((prev) => prev.map((p, i) => (i === idx ? { ...p, role: e.target.value } : p)))
                        }
                      />
                    </div>
                    <Input
                      maxLength={250}
                      placeholder="Tools used (comma-separated, e.g. Meta Ads, GA4, React)"
                      value={proj.tools.join(", ")}
                      onChange={(e) =>
                        setProjects((prev) =>
                          prev.map((p, i) =>
                            i === idx
                              ? {
                                  ...p,
                                  tools: e.target.value
                                    .split(",")
                                    .map((t) => t.trim())
                                    .filter(Boolean),
                                }
                              : p
                          )
                        )
                      }
                    />
                    <Input
                      maxLength={PROFILE_CHAR_LIMITS.projectImpact}
                      placeholder="Key Metric / Impact (e.g. 3.4x ROAS, +42% organic traffic)"
                      value={proj.impact}
                      onChange={(e) =>
                        setProjects((prev) => prev.map((p, i) => (i === idx ? { ...p, impact: e.target.value } : p)))
                      }
                    />
                    <Input
                      maxLength={PROFILE_CHAR_LIMITS.url}
                      placeholder="Live Link / Case Study URL (https://...)"
                      autoCorrect="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      value={proj.url}
                      onChange={(e) =>
                        setProjects((prev) => prev.map((p, i) => (i === idx ? { ...p, url: e.target.value } : p)))
                      }
                    />
                    <Input
                      maxLength={PROFILE_CHAR_LIMITS.url}
                      placeholder="Source / Deck URL (https://...)"
                      autoCorrect="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      value={proj.github_url}
                      onChange={(e) =>
                        setProjects((prev) =>
                          prev.map((p, i) => (i === idx ? { ...p, github_url: e.target.value } : p))
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] text-muted-foreground">Description</span>
                      <CharCount value={proj.description} max={PROFILE_CHAR_LIMITS.projectDescription} />
                    </div>
                    <Textarea
                      rows={2}
                      maxLength={PROFILE_CHAR_LIMITS.projectDescription}
                      placeholder="What challenge did this solve and what measurable outcome did you deliver?"
                      value={proj.description}
                      onChange={(e) =>
                        setProjects((prev) => prev.map((p, i) => (i === idx ? { ...p, description: e.target.value } : p)))
                      }
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {proj.image_url && (
                      <img
                        src={proj.image_url}
                        alt={proj.title || "Project preview"}
                        className="h-14 w-24 rounded-md object-cover border border-border"
                      />
                    )}
                    <label className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium cursor-pointer hover:bg-secondary">
                      {uploadingProjIdx === idx ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <ImagePlus className="h-3.5 w-3.5 text-primary" />
                      )}
                      <span>{proj.image_url ? "Change Cover Image" : "Upload Cover Image"}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => handleProjectImageSelect(idx, e)}
                        className="dp-visually-hidden"
                      />
                    </label>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Certifications */}
          <div className="rounded-xl border border-border bg-background p-5 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-bold flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" />
                Certifications ({certifications.length})
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setCertifications((prev) => [...prev, { name: "", issuer: "", date: "", credential_url: "" }])
                }
                className="h-8 text-xs gap-1"
              >
                <Plus className="h-3.5 w-3.5" /> Add Certification
              </Button>
            </div>
            {certifications.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Include industry, platform, or professional certifications (e.g. Google Ads, HubSpot, CFA, AWS).
              </p>
            ) : (
              certifications.map((cert, idx) => (
                <div key={idx} className="rounded-lg border border-border bg-card p-3.5 space-y-2.5">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_130px_1fr_auto] gap-2.5 items-center">
                    <Input
                      maxLength={PROFILE_CHAR_LIMITS.certName}
                      placeholder="Certification Name *"
                      value={cert.name}
                      onChange={(e) =>
                        setCertifications((prev) =>
                          prev.map((c, i) => (i === idx ? { ...c, name: e.target.value } : c))
                        )
                      }
                    />
                    <Input
                      maxLength={PROFILE_CHAR_LIMITS.certIssuer}
                      placeholder="Issuing Org (e.g. Google, HubSpot)"
                      value={cert.issuer}
                      onChange={(e) =>
                        setCertifications((prev) =>
                          prev.map((c, i) => (i === idx ? { ...c, issuer: e.target.value } : c))
                        )
                      }
                    />
                    <Input
                      maxLength={PROFILE_CHAR_LIMITS.certDate}
                      placeholder="Year (2024)"
                      value={cert.date}
                      onChange={(e) =>
                        setCertifications((prev) =>
                          prev.map((c, i) => (i === idx ? { ...c, date: e.target.value } : c))
                        )
                      }
                    />
                    <Input
                      maxLength={PROFILE_CHAR_LIMITS.url}
                      placeholder="Credential URL"
                      autoCorrect="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      value={cert.credential_url || ""}
                      onChange={(e) =>
                        setCertifications((prev) =>
                          prev.map((c, i) => (i === idx ? { ...c, credential_url: e.target.value } : c))
                        )
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Remove certification"
                      onClick={() => setCertifications((prev) => prev.filter((_, i) => i !== idx))}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Awards */}
          <div className="rounded-xl border border-border bg-background p-5 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-bold flex items-center gap-2">
                <Trophy className="h-4 w-4 text-primary" />
                Awards &amp; Achievements ({awards.length})
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAwards((prev) => [...prev, { title: "", organization: "", date: "", description: "" }])}
                className="h-8 text-xs gap-1"
              >
                <Plus className="h-3.5 w-3.5" /> Add Award
              </Button>
            </div>
            {awards.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Highlight workplace recognitions, competitions, or academic distinctions.
              </p>
            ) : (
              awards.map((aw, idx) => (
                <div key={idx} className="rounded-lg border border-border bg-card p-3.5 grid sm:grid-cols-[1fr_1fr_1.4fr_auto] gap-2.5 items-center">
                  <Input
                    maxLength={PROFILE_CHAR_LIMITS.awardTitle}
                    placeholder="Award Title *"
                    value={aw.title}
                    onChange={(e) =>
                      setAwards((prev) => prev.map((a, i) => (i === idx ? { ...a, title: e.target.value } : a)))
                    }
                  />
                  <Input
                    maxLength={PROFILE_CHAR_LIMITS.awardOrg}
                    placeholder="Organization / Event"
                    value={aw.organization || ""}
                    onChange={(e) =>
                      setAwards((prev) => prev.map((a, i) => (i === idx ? { ...a, organization: e.target.value } : a)))
                    }
                  />
                  <Input
                    maxLength={PROFILE_CHAR_LIMITS.awardDescription}
                    placeholder="Description & Year (e.g. Top performer Q4, 2024)"
                    value={aw.description}
                    onChange={(e) =>
                      setAwards((prev) => prev.map((a, i) => (i === idx ? { ...a, description: e.target.value } : a)))
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Remove award"
                    onClick={() => setAwards((prev) => prev.filter((_, i) => i !== idx))}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button type="button" variant="outline" onClick={() => setStep(3)} className="gap-1.5">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button type="button" onClick={handleNextStep} disabled={saving} className="gap-2">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save &amp; Continue to Resume &amp; Links
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 5: RESUME, VIDEO RESUME, AVAILABILITY, PERSONAL & LINKS */}
      {step === 5 && (
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold font-display">Step 5 · Resume, Video Pitch, Availability &amp; Links</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Upload your CV, configure Open to Work &amp; Freelancing badges, add languages/hobbies/interests, and launch your profile.
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
                Stored securely in private storage and powers the Download Resume action on your profile.
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
                className="dp-visually-hidden"
              />
            </div>
          </div>

          {/* Video Resume */}
          <div className="rounded-xl border border-border bg-background p-5 space-y-3">
            <Label className="text-sm font-bold flex items-center gap-2">
              <Video className="h-4 w-4 text-primary" />
              60-Second Video Resume (Optional)
            </Label>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="wiz-vid-url" className="text-xs text-muted-foreground">
                    Video URL (YouTube or direct MP4/WebM link)
                  </Label>
                  <CharCount value={videoIntroUrl} max={PROFILE_CHAR_LIMITS.url} />
                </div>
                <Input
                  id="wiz-vid-url"
                  maxLength={PROFILE_CHAR_LIMITS.url}
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={videoIntroUrl}
                  onChange={(e) => setVideoIntroUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=... or https://.../pitch.mp4"
                  className="mt-1"
                />
              </div>
              <div>
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="wiz-vid-pitch" className="text-xs text-muted-foreground">
                    Short Video Pitch Summary
                  </Label>
                  <CharCount value={videoPitch} max={PROFILE_CHAR_LIMITS.videoPitch} />
                </div>
                <Input
                  id="wiz-vid-pitch"
                  maxLength={PROFILE_CHAR_LIMITS.videoPitch}
                  value={videoPitch}
                  onChange={(e) => setVideoPitch(e.target.value)}
                  placeholder="In this 60s pitch, I walk through my key achievements..."
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Availability Toggles & Career Preferences */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
              <div>
                <p className="text-sm font-bold">Open to Work</p>
                <p className="text-xs text-muted-foreground">Show green Open to Work badge on profile.</p>
              </div>
              <Switch checked={openToWork} onCheckedChange={setOpenToWork} />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-sky-500/30 bg-sky-500/5 p-4">
              <div>
                <p className="text-sm font-bold">Open for Freelancing</p>
                <p className="text-xs text-muted-foreground">Show Open for Freelancing badge for gigs.</p>
              </div>
              <Switch checked={openForFreelance} onCheckedChange={setOpenForFreelance} />
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
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="wiz-pref-loc" className="text-xs font-semibold">Preferred Locations (comma-separated)</Label>
                <CharCount value={preferredLocations} max={PROFILE_CHAR_LIMITS.preferredLocations} />
              </div>
              <Input
                id="wiz-pref-loc"
                maxLength={PROFILE_CHAR_LIMITS.preferredLocations}
                placeholder="Chennai, Bengaluru, Remote"
                value={preferredLocations}
                onChange={(e) => setPreferredLocations(e.target.value)}
                className="mt-1.5"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="wiz-sal" className="text-xs font-semibold">Expected CTC (LPA)</Label>
                  <CharCount value={salaryRange} max={PROFILE_CHAR_LIMITS.salaryRange} />
                </div>
                <Input
                  id="wiz-sal"
                  maxLength={PROFILE_CHAR_LIMITS.salaryRange}
                  placeholder="e.g. 8 - 14 LPA"
                  value={salaryRange}
                  onChange={(e) => setSalaryRange(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="wiz-np" className="text-xs font-semibold">Notice Period</Label>
                <select
                  id="wiz-np"
                  value={noticePeriod}
                  onChange={(e) => setNoticePeriod(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-xs font-medium"
                >
                  <option value="Immediate">Immediate Joiner</option>
                  <option value="15 Days">15 Days</option>
                  <option value="30 Days">30 Days</option>
                  <option value="60 Days">60 Days</option>
                  <option value="90 Days">90 Days</option>
                </select>
              </div>
            </div>
          </div>

          {/* Languages, Hobbies & Interests */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* Languages */}
            <div className="rounded-xl border border-border bg-background p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold flex items-center gap-1.5">
                  <Languages className="h-3.5 w-3.5 text-primary" /> Languages
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setLanguages((prev) => [...prev, { name: "", level: "Fluent" }])}
                  className="h-6 px-2 text-[11px]"
                >
                  + Add
                </Button>
              </div>
              {languages.map((lang, idx) => (
                <div key={idx} className="grid grid-cols-[1fr_92px_auto] gap-1.5">
                  <Input
                    maxLength={PROFILE_CHAR_LIMITS.languageName}
                    placeholder="English"
                    value={lang.name}
                    onChange={(e) =>
                      setLanguages((prev) =>
                        prev.map((l, i) => (i === idx ? { ...l, name: e.target.value } : l))
                      )
                    }
                    className="h-8 text-xs"
                  />
                  <Input
                    maxLength={PROFILE_CHAR_LIMITS.languageLevel}
                    placeholder="Fluent"
                    value={lang.level}
                    onChange={(e) =>
                      setLanguages((prev) =>
                        prev.map((l, i) => (i === idx ? { ...l, level: e.target.value } : l))
                      )
                    }
                    className="h-8 text-xs"
                  />
                  <button
                    type="button"
                    aria-label={`Remove ${lang.name || "language"}`}
                    onClick={() => setLanguages((prev) => prev.filter((_, i) => i !== idx))}
                    className="px-1 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Hobbies */}
            <div className="rounded-xl border border-border bg-background p-4 space-y-2.5">
              <Label className="text-xs font-bold flex items-center gap-1.5">
                <Palette className="h-3.5 w-3.5 text-primary" /> Hobbies
              </Label>
              <div className="flex gap-1.5">
                <Input
                  maxLength={PROFILE_CHAR_LIMITS.tagChip}
                  placeholder="e.g. Photography, Chess"
                  value={hobbyInput}
                  onChange={(e) => setHobbyInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                      e.preventDefault();
                      addUniqueChip(hobbyInput, hobbies, setHobbies, () => setHobbyInput(""));
                    }
                  }}
                  className="h-8 text-xs"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => addUniqueChip(hobbyInput, hobbies, setHobbies, () => setHobbyInput(""))}
                  className="h-8 px-2.5 text-xs"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {hobbies.map((h) => (
                  <span key={h} className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-[11px]">
                    {formatSmartTag(h)}
                    <button
                      type="button"
                      aria-label={`Remove ${h}`}
                      onClick={() => setHobbies((prev) => prev.filter((x) => x !== h))}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="rounded-xl border border-border bg-background p-4 space-y-2.5">
              <Label className="text-xs font-bold flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5 text-primary" /> Interests
              </Label>
              <div className="flex gap-1.5">
                <Input
                  maxLength={PROFILE_CHAR_LIMITS.tagChip}
                  placeholder="e.g. Brand Strategy, Generative AI"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                      e.preventDefault();
                      addUniqueChip(interestInput, interests, setInterests, () => setInterestInput(""));
                    }
                  }}
                  className="h-8 text-xs"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => addUniqueChip(interestInput, interests, setInterests, () => setInterestInput(""))}
                  className="h-8 px-2.5 text-xs"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {interests.map((it) => (
                  <span key={it} className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-[11px]">
                    {formatSmartTag(it)}
                    <button
                      type="button"
                      aria-label={`Remove ${it}`}
                      onClick={() => setInterests((prev) => prev.filter((x) => x !== it))}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Public Handle & Social Links */}
          <div className="grid sm:grid-cols-2 gap-4 pt-1">
            <div>
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="wiz-slug" className="text-xs font-semibold">Public Profile Handle (/u/your-handle)</Label>
                <CharCount value={portfolioSlug} max={PROFILE_CHAR_LIMITS.slug} />
              </div>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="text-xs text-muted-foreground font-mono">/u/</span>
                <Input
                  id="wiz-slug"
                  maxLength={PROFILE_CHAR_LIMITS.slug}
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="your-name-pro"
                  value={portfolioSlug}
                  onChange={(e) => setPortfolioSlug(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="wiz-li" className="text-xs font-semibold flex items-center gap-1.5">
                <Linkedin className="h-3.5 w-3.5" /> LinkedIn URL
              </Label>
              <Input
                id="wiz-li"
                maxLength={PROFILE_CHAR_LIMITS.url}
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="https://linkedin.com/in/yourprofile"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="wiz-gh" className="text-xs font-semibold flex items-center gap-1.5">
                <Github className="h-3.5 w-3.5" /> GitHub URL
              </Label>
              <Input
                id="wiz-gh"
                maxLength={PROFILE_CHAR_LIMITS.url}
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="https://github.com/yourusername"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="wiz-pf-url" className="text-xs font-semibold flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" /> Portfolio Website URL
              </Label>
              <Input
                id="wiz-pf-url"
                maxLength={PROFILE_CHAR_LIMITS.url}
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="https://yourportfolio.com"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="wiz-kaggle" className="text-xs font-semibold">Kaggle URL (Optional)</Label>
              <Input
                id="wiz-kaggle"
                maxLength={PROFILE_CHAR_LIMITS.url}
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="https://kaggle.com/yourhandle"
                value={kaggleUrl}
                onChange={(e) => setKaggleUrl(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="wiz-behance" className="text-xs font-semibold">Behance / Design URL (Optional)</Label>
              <Input
                id="wiz-behance"
                maxLength={PROFILE_CHAR_LIMITS.url}
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="https://behance.net/yourhandle"
                value={behanceUrl}
                onChange={(e) => setBehanceUrl(e.target.value)}
                className="mt-1.5"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => setStep(4)} className="gap-1.5">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <div className="flex flex-wrap items-center gap-2.5">
              <Button type="button" variant="outline" onClick={handleSaveAndGoDashboard} disabled={saving}>
                Save &amp; Open Dashboard
              </Button>
              <Button type="button" onClick={handleSaveAndViewProfile} disabled={saving} className="gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <BadgeCheck className="h-4 w-4" />}
                Save &amp; View My Profile
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (embedded) return body;

  return (
    <>
      <Helmet>
        <title>Build Your Candidate Profile | IAmTalento</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur-sm">
          <div className="container flex items-center justify-between py-3">
            <Link to="/" className="flex items-center gap-2">
              <img src={siteLogo.url} alt="I Am Talento" className="h-9 w-auto object-contain" />
            </Link>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => navigate("/talento-pro?view=profile")}
                className="text-xs text-muted-foreground hover:text-foreground gap-1"
              >
                View My Profile
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
