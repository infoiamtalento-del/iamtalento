import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Brain,
  BriefcaseBusiness,
  Camera,
  CheckCircle2,
  ChevronDown,
  Cloud,
  Code2,
  Crown,
  Download,
  ExternalLink,
  FileCheck,
  Github,
  Globe,
  GraduationCap,
  Heart,
  ImagePlus,
  Languages,
  Layers,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  MoreHorizontal,
  Palette,
  Pencil,
  Phone,
  Plus,
  RotateCcw,
  Share2,
  ShieldCheck,
  Sparkles,
  Trash2,
  Trophy,
  Upload,
  UserRound,
  Video,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import defaultCover from "@/assets/profile-office-cover.jpg";
import cloudProject from "@/assets/profile-cloudsync.jpg";
import parserProject from "@/assets/profile-resume-parser.jpg";
import "@/components/profile/demo-profile.css";
import {
  getResumeSignedUrl,
  loadFullLiveProfile,
  normalizeLiveProfile,
  patchLiveProfileQuick,
  uploadBannerPhotoFile,
  uploadProfilePhotoFile,
  uploadProjectImageFile,
  uploadResumeFile,
  type ExpertiseCardItem,
  type LiveProfile,
  type RichAwardItem,
  type RichCertificationItem,
  type RichEducationItem,
  type RichExperienceItem,
  type RichProjectItem,
} from "@/services/candidate/profile";
import type { ProView } from "../proTypes";

const PROFILE_TABS = [
  { label: "About Me", id: "about-me" },
  { label: "Work Experience", id: "experience" },
  { label: "Skills", id: "skills" },
  { label: "Tools", id: "tools" },
  { label: "Projects", id: "projects" },
  { label: "Education", id: "education" },
  { label: "Certifications", id: "certifications" },
  { label: "Awards", id: "awards" },
  { label: "Languages", id: "languages" },
  { label: "Hobbies", id: "hobbies" },
  { label: "Interests", id: "interests" },
] as const;

const BADGE_ICONS: { icon: LucideIcon; tone: "red" | "blue" | "green" | "violet" }[] = [
  { icon: Code2, tone: "red" },
  { icon: Cloud, tone: "blue" },
  { icon: Brain, tone: "green" },
  { icon: Layers, tone: "blue" },
  { icon: Heart, tone: "violet" },
];

const EXPERTISE_ICONS: { icon: LucideIcon; tone: "red" | "blue" | "violet" | "green" }[] = [
  { icon: Code2, tone: "red" },
  { icon: Cloud, tone: "blue" },
  { icon: Brain, tone: "violet" },
  { icon: ShieldCheck, tone: "green" },
];

type QuickEditSection =
  | null
  | "identity"
  | "about"
  | "experience"
  | "skills"
  | "tools"
  | "projects"
  | "education"
  | "certifications"
  | "awards"
  | "languages"
  | "hobbies"
  | "interests"
  | "links";

function Panel({
  id,
  title,
  icon: Icon,
  action,
  children,
  className,
}: {
  id?: string;
  title: string;
  icon: LucideIcon;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} tabIndex={-1} className={cn("dp-panel", className)}>
      <div className="dp-panel-heading">
        <h2>
          <Icon size={20} />
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Chips({ items }: { items: string[] }) {
  return (
    <div className="dp-chips">
      {items.map((t) => (
        <span key={t}>{t}</span>
      ))}
    </div>
  );
}

function toYoutubeEmbedUrl(rawUrl: string): string | null {
  try {
    const u = new URL(rawUrl);
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
      if (u.pathname.startsWith("/embed/")) return rawUrl;
    }
    if (u.hostname === "youtu.be") {
      const id = u.pathname.replace(/^\//, "");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
  } catch {
    /* ignore */
  }
  return null;
}

interface Props {
  embedded?: boolean;
  onNavigate?: (view: ProView) => void;
  onProfileReloaded?: () => void;
  onToast: (msg: string) => void;
}

export const LiveCandidateProfileView: React.FC<Props> = ({
  embedded = true,
  onNavigate,
  onProfileReloaded,
  onToast,
}) => {
  const [data, setData] = useState<LiveProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingProjIdx, setUploadingProjIdx] = useState<number | null>(null);
  const [savingQuick, setSavingQuick] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("about-me");
  const [videoResumeOpen, setVideoResumeOpen] = useState(false);
  const [editingVideoInModal, setEditingVideoInModal] = useState(false);
  const [quickSection, setQuickSection] = useState<QuickEditSection>(null);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const navRef = useRef<HTMLElement>(null);

  // Quick-edit local states
  const [qFullName, setQFullName] = useState("");
  const [qHeadline, setQHeadline] = useState("");
  const [qSubHeadline, setQSubHeadline] = useState("");
  const [qIndustry, setQIndustry] = useState("");
  const [qPhone, setQPhone] = useState("");
  const [qCity, setQCity] = useState("");
  const [qState, setQState] = useState("");
  const [qCountry, setQCountry] = useState("India");
  const [qBadgesInput, setQBadgesInput] = useState("");

  const [qAbout, setQAbout] = useState("");
  const [qExpertise, setQExpertise] = useState<ExpertiseCardItem[]>([]);

  const [qExperiences, setQExperiences] = useState<RichExperienceItem[]>([]);
  const [qSkills, setQSkills] = useState<{ name: string; level: string }[]>([]);
  const [qSkillName, setQSkillName] = useState("");
  const [qSkillLevel, setQSkillLevel] = useState("Intermediate");

  const [qTools, setQTools] = useState<string[]>([]);
  const [qToolInput, setQToolInput] = useState("");

  const [qProjects, setQProjects] = useState<RichProjectItem[]>([]);
  const [qEducations, setQEducations] = useState<RichEducationItem[]>([]);
  const [qCertifications, setQCertifications] = useState<RichCertificationItem[]>([]);
  const [qAwards, setQAwards] = useState<RichAwardItem[]>([]);
  const [qLanguages, setQLanguages] = useState<{ name: string; level: string }[]>([]);
  const [qHobbies, setQHobbies] = useState<string[]>([]);
  const [qHobbyInput, setQHobbyInput] = useState("");
  const [qInterests, setQInterests] = useState<string[]>([]);
  const [qInterestInput, setQInterestInput] = useState("");

  const [qLinkedin, setQLinkedin] = useState("");
  const [qGithub, setQGithub] = useState("");
  const [qPortfolio, setQPortfolio] = useState("");
  const [qKaggle, setQKaggle] = useState("");
  const [qBehance, setQBehance] = useState("");
  const [qSlug, setQSlug] = useState("");

  const [qVideoUrl, setQVideoUrl] = useState("");
  const [qVideoPitch, setQVideoPitch] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const live = await loadFullLiveProfile();
      setData(live);
      if (live?.profile?.resume_path) {
        const signed = await getResumeSignedUrl(live.profile.resume_path);
        setResumeUrl(signed);
      } else if (live?.profile?.resume_url) {
        setResumeUrl(live.profile.resume_url);
      } else {
        setResumeUrl(null);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const n = useMemo(() => (data ? normalizeLiveProfile(data) : null), [data]);

  // Progressive scrollspy (`scroll-target-group: auto` + IntersectionObserver fallback)
  useEffect(() => {
    if (!n) return;
    const nav = navRef.current;
    if (!nav) return;

    const supportsScrollTargetGroup =
      typeof CSS !== "undefined" && typeof CSS.supports === "function" && CSS.supports("scroll-target-group: auto");

    if (supportsScrollTargetGroup) {
      const syncAria = () => {
        const currentLink = nav.querySelector("a:target-current");
        nav.querySelectorAll("a").forEach((link) => {
          const active = link === currentLink;
          link.setAttribute("aria-current", active ? "true" : "false");
          if (active) {
            const href = link.getAttribute("href") || "";
            if (href.startsWith("#")) setActiveTab(href.slice(1));
          }
        });
      };
      document.addEventListener("scrollend", syncAria);
      return () => document.removeEventListener("scrollend", syncAria);
    }

    if (typeof IntersectionObserver === "undefined") return;
    const sections = PROFILE_TABS.map((t) => document.getElementById(t.id)).filter(Boolean) as HTMLElement[];
    const links = Array.from(nav.querySelectorAll("a"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            if (!id) return;
            setActiveTab(id);
            links.forEach((link) => {
              const isActive = link.getAttribute("href") === `#${id}`;
              link.classList.toggle("target-current", isActive);
              link.setAttribute("aria-current", isActive ? "true" : "false");
            });
          }
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, [n]);

  const openQuickEdit = (section: QuickEditSection) => {
    if (!n || !section) return;
    setQFullName(n.fullName);
    setQHeadline(n.headline);
    setQSubHeadline(n.subHeadline);
    setQIndustry(n.industry);
    setQPhone(n.phone);
    setQCity(n.city);
    setQState(n.state);
    setQCountry(n.country || "India");
    setQBadgesInput(n.focusBadges.join(", "));
    setQAbout(n.about);
    setQExpertise(
      n.expertiseCards.length > 0
        ? n.expertiseCards
        : [
            { title: "Core Engineering", sub: "End-to-end delivery" },
            { title: "Architecture & Scale", sub: "Reliable production systems" },
            { title: "Problem Solving", sub: "Data-driven execution" },
            { title: "Collaboration", sub: "Cross-functional ownership" },
          ]
    );
    setQExperiences(
      n.experiences.length > 0
        ? n.experiences
        : [{ title: "", company: "", location: "", start: "", end: "Present", description: "", tools: [] }]
    );
    setQSkills(n.skills.map((s) => ({ name: s.name, level: s.level })));
    setQTools(n.tools);
    setQProjects(
      n.projects.length > 0
        ? n.projects
        : [{ title: "", role: "", description: "", tools: [], url: "", github_url: "", image_url: "", impact: "" }]
    );
    setQEducations(
      n.educations.length > 0
        ? n.educations
        : [{ institution: "", degree: "", field_of_study: "", start_year: "", year: "", grade: "" }]
    );
    setQCertifications(
      n.certifications.length > 0 ? n.certifications : [{ name: "", issuer: "", date: "", credential_url: "" }]
    );
    setQAwards(n.awards.length > 0 ? n.awards : [{ title: "", organization: "", date: "", description: "" }]);
    setQLanguages(n.languages.length > 0 ? n.languages : [{ name: "English", level: "Fluent" }]);
    setQHobbies(n.hobbies);
    setQInterests(n.interests);
    setQLinkedin(n.linkedinUrl);
    setQGithub(n.githubUrl);
    setQPortfolio(n.portfolioUrl);
    setQKaggle(n.kaggleUrl);
    setQBehance(n.behanceUrl);
    setQSlug(n.portfolioSlug);
    setQuickSection(section);
  };

  const handleSaveQuickSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data || !quickSection) return;
    setSavingQuick(true);
    try {
      let updated: LiveProfile | null = null;
      if (quickSection === "identity") {
        updated = await patchLiveProfileQuick(data, {
          fullName: qFullName,
          headline: qHeadline,
          subHeadline: qSubHeadline,
          jobRole: qHeadline || n?.jobRole || "",
          industry: qIndustry || n?.industry || "",
          phone: qPhone,
          city: qCity,
          state: qState,
          country: qCountry || "India",
          focusBadges: qBadgesInput
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean),
        });
      } else if (quickSection === "about") {
        updated = await patchLiveProfileQuick(data, {
          about: qAbout,
          expertiseCards: qExpertise.filter((c) => c.title.trim() || c.sub.trim()),
        });
      } else if (quickSection === "experience") {
        updated = await patchLiveProfileQuick(data, { experiences: qExperiences });
      } else if (quickSection === "skills") {
        updated = await patchLiveProfileQuick(data, { skills: qSkills });
      } else if (quickSection === "tools") {
        updated = await patchLiveProfileQuick(data, { tools: qTools });
      } else if (quickSection === "projects") {
        updated = await patchLiveProfileQuick(data, { projects: qProjects });
      } else if (quickSection === "education") {
        updated = await patchLiveProfileQuick(data, { educations: qEducations });
      } else if (quickSection === "certifications") {
        updated = await patchLiveProfileQuick(data, { certifications: qCertifications });
      } else if (quickSection === "awards") {
        updated = await patchLiveProfileQuick(data, { awards: qAwards });
      } else if (quickSection === "languages") {
        updated = await patchLiveProfileQuick(data, { languages: qLanguages });
      } else if (quickSection === "hobbies") {
        updated = await patchLiveProfileQuick(data, { hobbies: qHobbies });
      } else if (quickSection === "interests") {
        updated = await patchLiveProfileQuick(data, { interests: qInterests });
      } else if (quickSection === "links") {
        updated = await patchLiveProfileQuick(data, {
          linkedinUrl: qLinkedin,
          githubUrl: qGithub,
          portfolioUrl: qPortfolio,
          kaggleUrl: qKaggle,
          behanceUrl: qBehance,
          portfolioSlug: qSlug,
        });
      }
      if (updated) setData(updated);
      await reload();
      onProfileReloaded?.();
      setQuickSection(null);
      onToast("Profile updated!");
    } catch (err: any) {
      onToast(err?.message || "Could not save profile changes");
    } finally {
      setSavingQuick(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !data?.profile?.id) return;
    setUploadingPhoto(true);
    try {
      const url = await uploadProfilePhotoFile(file, data.profile.id);
      const updated = await patchLiveProfileQuick(data, { profilePhotoUrl: url });
      setData(updated);
      onProfileReloaded?.();
      onToast("Profile photo updated!");
    } catch (err: any) {
      onToast(err?.message || "Failed to upload profile photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !data?.profile?.id) return;
    setUploadingBanner(true);
    try {
      const url = await uploadBannerPhotoFile(file, data.profile.id);
      const updated = await patchLiveProfileQuick(data, { bannerPhotoUrl: url });
      setData(updated);
      onProfileReloaded?.();
      onToast("Cover banner image updated!");
    } catch (err: any) {
      onToast(err?.message || "Failed to upload banner image");
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleResetBanner = async () => {
    if (!data) return;
    setUploadingBanner(true);
    try {
      const updated = await patchLiveProfileQuick(data, { bannerPhotoUrl: "" });
      setData(updated);
      onProfileReloaded?.();
      onToast("Restored default cover banner.");
    } catch (err: any) {
      onToast(err?.message || "Could not reset banner");
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !data?.profile?.id) return;
    setUploadingResume(true);
    try {
      const { path, signedUrl } = await uploadResumeFile(file, data.profile.id);
      const updated = await patchLiveProfileQuick(data, { resumePath: path });
      setData(updated);
      setResumeUrl(signedUrl);
      onProfileReloaded?.();
      onToast("Resume uploaded securely!");
    } catch (err: any) {
      onToast(err?.message || "Failed to upload resume");
    } finally {
      setUploadingResume(false);
    }
  };

  const handleProjectImageUpload = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !data?.profile?.id) return;
    setUploadingProjIdx(idx);
    try {
      const url = await uploadProjectImageFile(file, data.profile.id);
      setQProjects((prev) => prev.map((p, i) => (i === idx ? { ...p, image_url: url } : p)));
      onToast("Project preview image uploaded!");
    } catch (err: any) {
      onToast(err?.message || "Failed to upload project image");
    } finally {
      setUploadingProjIdx(null);
    }
  };

  const toggleAvailability = async (patch: { openToWork?: boolean; openForFreelance?: boolean }, message: string) => {
    if (!data) return;
    try {
      const updated = await patchLiveProfileQuick(data, patch);
      setData(updated);
      onProfileReloaded?.();
      onToast(message);
    } catch (err: any) {
      onToast(err?.message || "Could not update availability");
    }
  };

  const handleSaveVideoResume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    setSavingQuick(true);
    try {
      const updated = await patchLiveProfileQuick(data, {
        videoIntroUrl: qVideoUrl,
        videoPitch: qVideoPitch,
      });
      setData(updated);
      setEditingVideoInModal(false);
      onProfileReloaded?.();
      onToast("Video resume saved!");
    } catch (err: any) {
      onToast(err?.message || "Could not save video resume");
    } finally {
      setSavingQuick(false);
    }
  };

  const handleDownloadResume = async () => {
    if (!n) return;
    if (resumeUrl) {
      window.open(resumeUrl, "_blank", "noopener,noreferrer");
      return;
    }
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF();
    let y = 23;
    pdf.setFontSize(22);
    pdf.text(n.fullName || "Candidate Resume", 18, y);
    y += 9;
    if (n.headline) {
      pdf.setFontSize(12);
      pdf.text(n.subHeadline ? `${n.headline} · ${n.subHeadline}` : n.headline, 18, y);
      y += 8;
    }
    pdf.setFontSize(10);
    pdf.text([n.locationDisplay, n.phone, n.email].filter(Boolean).join(" | "), 18, y);
    y += 12;

    const write = (text: string, size = 10) => {
      if (!text.trim()) return;
      pdf.setFontSize(size);
      const lines = pdf.splitTextToSize(text, 173);
      if (y + lines.length * 5 > 275) {
        pdf.addPage();
        y = 20;
      }
      pdf.text(lines, 18, y);
      y += lines.length * 5 + 5;
    };

    if (n.about) {
      write("Professional Summary", 13);
      write(n.about);
    }
    if (n.experiences.length > 0) {
      write("Work Experience", 13);
      n.experiences.forEach((e) => {
        write(`${e.title} - ${e.company} | ${[e.start, e.end].filter(Boolean).join(" – ")}`, 11);
        if (e.description) write(e.description);
      });
    }
    if (n.educations.length > 0) {
      write("Education", 13);
      n.educations.forEach((ed) => {
        const yrs = [ed.start_year, ed.year].filter(Boolean).join(" – ");
        write(`${ed.institution} - ${ed.degree}${yrs ? ` | ${yrs}` : ""}${ed.grade ? ` (${ed.grade})` : ""}`);
      });
    }
    if (n.skills.length > 0) {
      write("Skills", 13);
      write(n.skills.map((s) => s.name).join(" | "));
    }
    if (n.certifications.length > 0) {
      write("Certifications", 13);
      n.certifications.forEach((c) => write(`${c.name}${c.issuer ? ` - ${c.issuer}` : ""}`));
    }
    const safeFile = (n.fullName || "Candidate").replace(/[^a-zA-Z0-9-]+/g, "-");
    pdf.save(`${safeFile}-Resume.pdf`);
    onToast("Formatted PDF resume downloaded!");
  };

  const handleShare = async () => {
    if (!n) return;
    const shareUrl =
      typeof window !== "undefined"
        ? n.portfolioSlug
          ? `${window.location.origin}/u/${n.portfolioSlug}`
          : window.location.href
        : "";
    try {
      await navigator.clipboard.writeText(shareUrl);
      onToast(n.portfolioSlug ? "Public profile link copied!" : "Profile link copied!");
    } catch {
      onToast("Could not copy link automatically.");
    }
  };

  const scrollTo = (tabId: string, e?: React.MouseEvent<HTMLAnchorElement>) => {
    if (e) e.preventDefault();
    setActiveTab(tabId);
    const el = document.getElementById(tabId);
    if (el) {
      el.scrollIntoView({
        behavior:
          typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        block: "start",
      });
      el.focus({ preventScroll: true });
    }
  };

  const triggerWizardEdit = () => {
    if (onNavigate) {
      onNavigate("edit-profile");
    } else {
      window.location.href = "/onboarding?step=2";
    }
  };

  if (loading) {
    return (
      <div className="py-16 flex items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  if (!data || !n) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center space-y-4">
        <p className="text-sm text-muted-foreground">Unable to load your candidate profile.</p>
        <Button onClick={triggerWizardEdit}>Open Profile Setup Wizard</Button>
      </div>
    );
  }

  const initials = (n.fullName || n.email || "U")
    .split(" ")
    .map((x) => x[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const displayBadges =
    n.focusBadges.length > 0
      ? n.focusBadges.slice(0, 6)
      : [n.industry, ...n.skills.slice(0, 4).map((s) => s.name)].filter(Boolean).slice(0, 5);

  const displayExpertise: ExpertiseCardItem[] =
    n.expertiseCards.length > 0
      ? n.expertiseCards.slice(0, 4)
      : [
          {
            title: n.headline || n.jobRole || "Core Domain Execution",
            sub: n.industry || "Production-ready delivery",
          },
          {
            title: n.skills[0]?.name ? `${n.skills[0].name} & Architecture` : "Technical Depth",
            sub: n.skills[1]?.name ? `Paired with ${n.skills[1].name}` : "Scalable engineering",
          },
          {
            title: n.tools[0] ? `${n.tools[0]} Workflow` : "Modern Tooling",
            sub: n.tools.slice(1, 3).join(", ") || "Clean automation & QA",
          },
          {
            title: "Continuous Growth",
            sub: `${n.profileCompletion}% profile readiness`,
          },
        ];

  const primaryLinks = [
    n.linkedinUrl ? { label: "LinkedIn", url: n.linkedinUrl, icon: Linkedin } : null,
    n.githubUrl ? { label: "GitHub", url: n.githubUrl, icon: Github } : null,
    n.portfolioUrl ? { label: "Portfolio", url: n.portfolioUrl, icon: Globe } : null,
    n.kaggleUrl ? { label: "Kaggle", url: n.kaggleUrl, icon: Award } : null,
    n.behanceUrl ? { label: "Behance", url: n.behanceUrl, icon: Palette } : null,
  ].filter(Boolean) as { label: string; url: string; icon: LucideIcon }[];

  const ytEmbed = n.videoIntroUrl ? toYoutubeEmbedUrl(n.videoIntroUrl) : null;

  const renderEditBtn = (section: QuickEditSection, label = "Edit") => (
    <Button type="button" variant="outline" size="sm" className="dp-edit cursor-pointer" onClick={() => openQuickEdit(section)}>
      <Pencil /> {label}
    </Button>
  );

  return (
    <div className={cn("demo-dashboard", embedded ? "dp-embedded" : "dp-standalone")}>
      {/* Visually hidden file inputs for Banner, Avatar, and Resume */}
      <input
        ref={bannerInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleBannerUpload}
        className="dp-visually-hidden"
        aria-label="Upload cover banner image"
      />
      <input
        ref={photoInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handlePhotoUpload}
        className="dp-visually-hidden"
        aria-label="Upload profile picture"
      />
      <input
        ref={resumeInputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleResumeUpload}
        className="dp-visually-hidden"
        aria-label="Upload resume file"
      />

      <main className="dp-main">
        {/* ===== HERO OVERVIEW CARD (Exact Arjun Mehta Design + Live Controls) ===== */}
        <section id="overview" className="dp-overview">
          <div className="dp-cover">
            <img
              src={n.bannerPhotoUrl || defaultCover}
              width={1920}
              height={512}
              {...({ fetchpriority: "high" } as React.ImgHTMLAttributes<HTMLImageElement>)}
              alt={`${n.fullName || "Candidate"} cover banner`}
            />
            {onNavigate ? (
              <Button
                type="button"
                variant="ghost"
                className="dp-back cursor-pointer"
                onClick={() => onNavigate("jobs")}
              >
                <ArrowLeft />
                Browse Jobs
              </Button>
            ) : (
              <Button asChild variant="ghost" className="dp-back">
                <Link to="/talento-pro?view=dash">
                  <ArrowLeft />
                  Dashboard
                </Link>
              </Button>
            )}

            <div className="dp-cover-actions">
              <button
                type="button"
                onClick={() => bannerInputRef.current?.click()}
                disabled={uploadingBanner}
                className="dp-cover-btn"
              >
                {uploadingBanner ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <ImagePlus className="h-3.5 w-3.5" />
                )}
                <span>{uploadingBanner ? "Uploading..." : n.bannerPhotoUrl ? "Change Banner" : "Upload Banner"}</span>
              </button>
              {n.bannerPhotoUrl && (
                <button
                  type="button"
                  onClick={handleResetBanner}
                  disabled={uploadingBanner}
                  className="dp-cover-btn"
                  title="Restore default cover banner"
                  aria-label="Restore default cover banner"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="dp-identity">
            <div className="dp-person">
              <div className="dp-avatar">
                {n.profilePhotoUrl ? (
                  <img src={n.profilePhotoUrl} alt={n.fullName || "Candidate"} />
                ) : (
                  <div className="dp-avatar-initials" aria-hidden="true">
                    {initials}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="dp-avatar-upload"
                  aria-label="Upload or change profile photo"
                >
                  {uploadingPhoto ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Camera className="h-5 w-5" />
                      <span>{n.profilePhotoUrl ? "Change" : "Upload"}</span>
                    </>
                  )}
                </button>
                <span title="Online" />
              </div>

              <div className="dp-name flex-1">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="dp-name-line">
                    <h1>{n.fullName || "Add Your Name"}</h1>
                    <CheckCircle2
                      className={cn(
                        n.verification.identity_status === "verified" || n.verification.profile_status === "verified"
                          ? "text-success"
                          : "text-primary/70"
                      )}
                      size={21}
                    />
                    <span className="dp-talent">
                      <Crown size={12} />
                      {n.latestCir
                        ? `${n.latestCir.tier} · CIR ${Math.round(Number(n.latestCir.score))}`
                        : n.iamTalentoId || "Talento Pro"}
                    </span>
                  </div>
                  {renderEditBtn("identity", "Edit Header")}
                </div>

                <p className="dp-designation">
                  {n.headline || "Add your professional headline (e.g. Senior Full-Stack Engineer)"}
                </p>
                <p className="dp-specialty">
                  {n.subHeadline || n.industry || "Add your specialty (e.g. Cloud & AI Specialist)"}
                </p>

                <div className="dp-contact-details">
                  {n.locationDisplay ? (
                    <span>
                      <MapPin />
                      {n.locationDisplay}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openQuickEdit("identity")}
                      className="inline-flex items-center gap-1.5 text-primary hover:underline cursor-pointer"
                    >
                      <MapPin />+ Add location
                    </button>
                  )}

                  {n.phone ? (
                    <a href={`tel:${n.phone.replace(/\s/g, "")}`}>
                      <Phone />
                      {n.phone}
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openQuickEdit("identity")}
                      className="inline-flex items-center gap-1.5 text-primary hover:underline cursor-pointer"
                    >
                      <Phone />+ Add phone
                    </button>
                  )}

                  {n.email && (
                    <a href={`mailto:${n.email}`}>
                      <Mail />
                      {n.email}
                    </a>
                  )}

                  {n.linkedinUrl ? (
                    <a href={n.linkedinUrl} target="_blank" rel="noreferrer">
                      <Linkedin />
                      {n.linkedinUrl.replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "")}
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openQuickEdit("links")}
                      className="inline-flex items-center gap-1.5 text-primary hover:underline cursor-pointer"
                    >
                      <Linkedin />+ Add LinkedIn
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="dp-intro">
              <p>
                {n.about ||
                  "Click 'Edit' on About Me or 'Edit Profile' below to add your professional summary, domain focus, and key achievements."}
              </p>
              {displayBadges.length > 0 && (
                <div className="dp-badges">
                  {displayBadges.map((badgeName, idx) => {
                    const { icon: Icon, tone } = BADGE_ICONS[idx % BADGE_ICONS.length];
                    return (
                      <span key={badgeName}>
                        <i className={`dp-tone-${tone}`}>
                          <Icon size={13} />
                        </i>
                        {badgeName}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ===== ACTION & AVAILABILITY SUMMARY BAR ===== */}
          <div className="dp-summary">
            <div className="dp-candidate-actions">
              {n.openToWork && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="dp-status border-emerald-500/40 text-emerald-700 bg-emerald-500/10 hover:bg-emerald-500/15 cursor-pointer"
                    >
                      <span className="dp-status-dot bg-emerald-500" />
                      Open to Work
                      <ChevronDown className="h-3.5 w-3.5 opacity-60 ml-0.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem
                      onClick={() => toggleAvailability({ openToWork: false }, "Removed 'Open to Work' status")}
                    >
                      Hide &ldquo;Open to Work&rdquo; badge
                    </DropdownMenuItem>
                    {!n.openForFreelance && (
                      <DropdownMenuItem
                        onClick={() =>
                          toggleAvailability({ openForFreelance: true }, "Enabled 'Open for Freelancing' status")
                        }
                      >
                        + Add &ldquo;Open for Freelancing&rdquo; badge
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {n.openForFreelance && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="dp-status border-sky-500/40 text-sky-700 bg-sky-500/10 hover:bg-sky-500/15 cursor-pointer"
                    >
                      <span className="dp-status-dot bg-sky-500" />
                      Open for Freelancing
                      <ChevronDown className="h-3.5 w-3.5 opacity-60 ml-0.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem
                      onClick={() =>
                        toggleAvailability({ openForFreelance: false }, "Removed 'Open for Freelancing' status")
                      }
                    >
                      Hide &ldquo;Open for Freelancing&rdquo; badge
                    </DropdownMenuItem>
                    {!n.openToWork && (
                      <DropdownMenuItem
                        onClick={() => toggleAvailability({ openToWork: true }, "Enabled 'Open to Work' status")}
                      >
                        + Add &ldquo;Open to Work&rdquo; badge
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {!n.openToWork && !n.openForFreelance && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="dp-status border-dashed text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1 text-primary" />
                      Set Availability Status
                      <ChevronDown className="h-3.5 w-3.5 opacity-60 ml-0.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem
                      onClick={() => toggleAvailability({ openToWork: true }, "Enabled 'Open to Work'")}
                    >
                      <span className="dp-status-dot bg-emerald-500 mr-2" />
                      Enable &ldquo;Open to Work&rdquo;
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => toggleAvailability({ openForFreelance: true }, "Enabled 'Open for Freelancing'")}
                    >
                      <span className="dp-status-dot bg-sky-500 mr-2" />
                      Enable &ldquo;Open for Freelancing&rdquo;
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        toggleAvailability(
                          { openToWork: true, openForFreelance: true },
                          "Enabled Full-time & Freelance availability"
                        )
                      }
                    >
                      Enable Both (Full-time &amp; Freelance)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <Button type="button" onClick={triggerWizardEdit} className="cursor-pointer">
                <Pencil />
                <span>Edit Full Profile</span>
              </Button>

              <Button type="button" variant="outline" onClick={handleDownloadResume} className="cursor-pointer">
                <Download />
                <span>{resumeUrl ? "Download Resume" : "Export PDF Resume"}</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setQVideoUrl(n.videoIntroUrl);
                  setQVideoPitch(n.videoPitch);
                  setEditingVideoInModal(!n.videoIntroUrl && !n.videoPitch);
                  setVideoResumeOpen(true);
                }}
                className="gap-2 border-primary/40 bg-primary/5 text-primary hover:bg-primary/10 font-semibold cursor-pointer"
              >
                <Video className="h-4 w-4 text-primary" />
                <span>Video Resume</span>
              </Button>

              <Button type="button" variant="outline" onClick={handleShare} className="cursor-pointer">
                <Share2 />
                <span>Share</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label="More profile actions"
                    className="cursor-pointer"
                  >
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => bannerInputRef.current?.click()}>
                    {n.bannerPhotoUrl ? "Change cover banner image" : "Upload cover banner image"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => photoInputRef.current?.click()}>
                    {n.profilePhotoUrl ? "Change profile photo" : "Upload profile photo"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => resumeInputRef.current?.click()}>
                    {uploadingResume ? "Uploading resume..." : resumeUrl ? "Replace uploaded CV" : "Upload CV (PDF/DOCX)"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() =>
                      toggleAvailability(
                        { openToWork: !n.openToWork },
                        n.openToWork ? "Disabled 'Open to Work'" : "Enabled 'Open to Work'"
                      )
                    }
                  >
                    {n.openToWork ? "Disable 'Open to Work'" : "Enable 'Open to Work'"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() =>
                      toggleAvailability(
                        { openForFreelance: !n.openForFreelance },
                        n.openForFreelance ? "Disabled 'Open for Freelancing'" : "Enabled 'Open for Freelancing'"
                      )
                    }
                  >
                    {n.openForFreelance ? "Disable 'Open for Freelancing'" : "Enable 'Open for Freelancing'"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => openQuickEdit("links")}>
                    Configure public handle &amp; links
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={triggerWizardEdit}>Open 5-step setup wizard</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </section>

        {/* ===== SECTION TABS + ALL 11 ARJUN-MEHTA PANELS ===== */}
        <div className="dp-columns">
          <div className="dp-content-column">
            <nav ref={navRef} className="dp-tabs dp-live-tabs" aria-label="Profile sections">
              {PROFILE_TABS.map((tab) => (
                <a
                  key={tab.id}
                  href={`#${tab.id}`}
                  aria-current={activeTab === tab.id ? "true" : "false"}
                  className={cn(activeTab === tab.id && "target-current")}
                  onClick={(e) => scrollTo(tab.id, e)}
                >
                  {tab.label}
                </a>
              ))}
            </nav>

            {/* 1. ABOUT ME */}
            <Panel id="about-me" title="About Me" icon={UserRound} action={renderEditBtn("about")}>
              <p className="dp-body-text">
                {n.about ||
                  "Tell employers about your engineering/domain philosophy, key milestones, and the problems you love solving."}
              </p>
              <div className="dp-expertise">
                {displayExpertise.map(({ title, sub }, idx) => {
                  const { icon: Icon, tone } = EXPERTISE_ICONS[idx % EXPERTISE_ICONS.length];
                  return (
                    <div key={`${title}-${idx}`}>
                      <i className={`dp-tone-${tone}`}>
                        <Icon size={24} />
                      </i>
                      <div>
                        <strong>{title}</strong>
                        <span>{sub}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Panel>

            {/* 2. WORK EXPERIENCE */}
            <Panel
              id="experience"
              title="Work Experience"
              icon={BriefcaseBusiness}
              action={
                <div className="flex items-center gap-2.5">
                  <span className="dp-muted">
                    {n.experiences.length} {n.experiences.length === 1 ? "position" : "positions"}
                  </span>
                  {renderEditBtn("experience", n.experiences.length > 0 ? "Edit" : "+ Add")}
                </div>
              }
            >
              {n.experiences.length === 0 ? (
                <div className="dp-empty-box">
                  <p>No work experience or internships added yet.</p>
                  {renderEditBtn("experience", "+ Add Work Experience")}
                </div>
              ) : (
                <div className="dp-timeline">
                  {n.experiences.map((e, i) => {
                    const companyInitials = (e.company || "CO")
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();
                    const period = [e.start, e.end || "Present"].filter(Boolean).join(" – ");
                    return (
                      <article key={`${e.title}-${e.company}-${i}`}>
                        <div
                          className={cn(
                            "dp-company-symbol",
                            i % 3 === 0 ? "dp-tone-blue" : i % 3 === 1 ? "dp-tone-red" : "dp-tone-violet"
                          )}
                        >
                          {companyInitials}
                        </div>
                        <div className="dp-job">
                          <div className="dp-job-heading">
                            <h3>{e.title}</h3>
                            {period && <span>{period}</span>}
                          </div>
                          <p>
                            {e.company}
                            {e.location && (
                              <>
                                <span className="dp-separator">·</span>
                                {e.location}
                              </>
                            )}
                          </p>
                          {e.description && <p>{e.description}</p>}
                          {e.tools.length > 0 && <Chips items={e.tools} />}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </Panel>

            {/* 3. SKILLS */}
            <Panel id="skills" title="Skills" icon={Code2} action={renderEditBtn("skills", n.skills.length ? "Edit" : "+ Add")}>
              {n.skills.length === 0 ? (
                <div className="dp-empty-box">
                  <p>Add at least 3 core skills to power AI job matching and skill verification.</p>
                  {renderEditBtn("skills", "+ Add Skills")}
                </div>
              ) : (
                <div className="dp-skill-list">
                  {n.skills.map((skill) => (
                    <article key={skill.name}>
                      <i className="dp-tone-blue">
                        <Code2 size={20} />
                      </i>
                      <div>
                        <h3>{skill.name}</h3>
                        <p>{skill.level}</p>
                      </div>
                      {skill.verified ? (
                        <span className="dp-verified">
                          <CheckCircle2 size={12} />
                          Verified
                        </span>
                      ) : (
                        <Link
                          to="/assessments/explore"
                          className="ml-auto text-xs font-semibold text-primary hover:underline shrink-0"
                        >
                          Verify →
                        </Link>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </Panel>

            {/* 4. TOOLS */}
            <Panel id="tools" title="Tools" icon={Wrench} action={renderEditBtn("tools", n.tools.length ? "Edit" : "+ Add")}>
              {n.tools.length === 0 ? (
                <div className="dp-empty-box">
                  <p>Showcase your daily tools &amp; platforms (e.g. VS Code, Docker, Git, Figma, Jira).</p>
                  {renderEditBtn("tools", "+ Add Tools")}
                </div>
              ) : (
                <Chips items={n.tools} />
              )}
            </Panel>

            {/* 5. PROJECTS */}
            <Panel
              id="projects"
              title="Projects"
              icon={GraduationCap}
              action={
                <div className="flex items-center gap-2">
                  {onNavigate && (
                    <Button
                      type="button"
                      variant="link"
                      className="dp-text-action cursor-pointer"
                      onClick={() => onNavigate("port")}
                    >
                      Portfolio Hub
                      <ArrowRight />
                    </Button>
                  )}
                  {renderEditBtn("projects", n.projects.length ? "Edit" : "+ Add")}
                </div>
              }
            >
              {n.projects.length === 0 ? (
                <div className="dp-empty-box">
                  <p>Add portfolio projects with preview screenshots, tech stack chips, Live Demo &amp; GitHub links.</p>
                  {renderEditBtn("projects", "+ Add Project")}
                </div>
              ) : (
                <div className="dp-projects">
                  {n.projects.map((proj, i) => (
                    <article key={`${proj.title}-${i}`}>
                      <img
                        src={proj.image_url || (i % 2 === 0 ? cloudProject : parserProject)}
                        alt={`${proj.title} preview`}
                        width={1024}
                        height={640}
                        loading="lazy"
                      />
                      <h3>{proj.title}</h3>
                      {proj.description && <p>{proj.description}</p>}
                      {proj.tools.length > 0 && <Chips items={proj.tools} />}
                      <div className="dp-project-links">
                        {proj.url && (
                          <a href={proj.url} target="_blank" rel="noreferrer">
                            <ExternalLink size={14} />
                            Live Demo
                          </a>
                        )}
                        {proj.github_url && (
                          <a href={proj.github_url} target="_blank" rel="noreferrer">
                            <Github size={13} />
                            GitHub
                          </a>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </Panel>

            {/* 6 & 7. EDUCATION + CERTIFICATIONS */}
            <div className="dp-lower-grid">
              <Panel
                id="education"
                title="Education"
                icon={GraduationCap}
                action={renderEditBtn("education", n.educations.length ? "Edit" : "+ Add")}
              >
                {n.educations.length === 0 ? (
                  <div className="dp-empty-box">
                    <p>Add your university, degree, years &amp; CGPA/grade.</p>
                    {renderEditBtn("education", "+ Add")}
                  </div>
                ) : (
                  <div className="dp-education">
                    {n.educations.map((ed, i) => {
                      const yearsText = [ed.start_year, ed.year].filter(Boolean).join(" – ");
                      return (
                        <article key={`${ed.institution}-${i}`}>
                          <div
                            className={cn(
                              "dp-school",
                              i % 3 === 0 ? "dp-tone-blue" : i % 3 === 1 ? "dp-tone-red" : "dp-tone-green"
                            )}
                          >
                            <GraduationCap size={28} />
                          </div>
                          <div>
                            <h3>{ed.institution}</h3>
                            <p>
                              {ed.degree}
                              {ed.field_of_study ? ` · ${ed.field_of_study}` : ""}
                            </p>
                            {(yearsText || ed.grade) && (
                              <p>
                                {yearsText}
                                {yearsText && ed.grade && <span className="dp-separator">·</span>}
                                {ed.grade}
                              </p>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </Panel>

              <Panel
                id="certifications"
                title="Certifications"
                icon={FileCheck}
                action={renderEditBtn("certifications", n.certifications.length ? "Edit" : "+ Add")}
              >
                {n.certifications.length === 0 ? (
                  <div className="dp-empty-box">
                    <p>Add professional certifications &amp; licenses.</p>
                    {renderEditBtn("certifications", "+ Add")}
                  </div>
                ) : (
                  <div className="dp-certifications">
                    {n.certifications.map((c, i) => (
                      <article key={`${c.name}-${i}`}>
                        <div className="dp-school dp-tone-blue">
                          <Award size={22} />
                        </div>
                        <div>
                          <h3>{c.name}</h3>
                          {c.issuer && <p>{c.issuer}</p>}
                          <div className="dp-cert-date">
                            <span>{c.date || "Issued"}</span>
                            {c.verified ? (
                              <span className="dp-verified">
                                <CheckCircle2 size={12} />
                                Verified
                              </span>
                            ) : c.credential_url ? (
                              <a
                                href={c.credential_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                              >
                                Credential <ExternalLink size={11} />
                              </a>
                            ) : null}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </Panel>
            </div>

            {/* 8. AWARDS */}
            <Panel id="awards" title="Awards" icon={Trophy} action={renderEditBtn("awards", n.awards.length ? "Edit" : "+ Add")}>
              {n.awards.length === 0 ? (
                <div className="dp-empty-box">
                  <p>Add hackathons, scholarships, honors, or workplace recognitions.</p>
                  {renderEditBtn("awards", "+ Add Award")}
                </div>
              ) : (
                <div className="dp-awards">
                  {n.awards.map((aw, i) => (
                    <article key={`${aw.title}-${i}`}>
                      <i className="dp-tone-blue">
                        <Trophy size={22} />
                      </i>
                      <div>
                        <h3>{aw.title}</h3>
                        <p>
                          {[aw.organization, aw.date, aw.description].filter(Boolean).join(" · ") || "Recognition"}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </Panel>

            {/* 9. LANGUAGES */}
            <Panel
              id="languages"
              title="Languages"
              icon={Languages}
              action={renderEditBtn("languages", n.languages.length ? "Edit" : "+ Add")}
            >
              {n.languages.length === 0 ? (
                <div className="dp-empty-box">
                  <p>Add spoken/written languages (e.g. English, Hindi, Tamil).</p>
                  {renderEditBtn("languages", "+ Add Languages")}
                </div>
              ) : (
                <Chips items={n.languages.map((l) => (l.level ? `${l.name} (${l.level})` : l.name))} />
              )}
            </Panel>

            {/* 10. HOBBIES */}
            <Panel id="hobbies" title="Hobbies" icon={Palette} action={renderEditBtn("hobbies", n.hobbies.length ? "Edit" : "+ Add")}>
              {n.hobbies.length === 0 ? (
                <div className="dp-empty-box">
                  <p>Share personal hobbies (e.g. Open Source Contributing, Photography, Chess).</p>
                  {renderEditBtn("hobbies", "+ Add Hobbies")}
                </div>
              ) : (
                <Chips items={n.hobbies} />
              )}
            </Panel>

            {/* 11. INTERESTS */}
            <Panel
              id="interests"
              title="Interests"
              icon={Heart}
              action={renderEditBtn("interests", n.interests.length ? "Edit" : "+ Add")}
            >
              {n.interests.length === 0 ? (
                <div className="dp-empty-box">
                  <p>Add professional &amp; domain interests (e.g. Generative AI, Cloud Architecture, FinTech).</p>
                  {renderEditBtn("interests", "+ Add Interests")}
                </div>
              ) : (
                <Chips items={n.interests} />
              )}
            </Panel>
          </div>
        </div>

        {/* ===== EXTERNAL LINKS FOOTER ===== */}
        <section id="links" className="dp-profile-links">
          {primaryLinks.map(({ label, url, icon: Icon }) => (
            <a key={label} href={url} target="_blank" rel="noreferrer">
              <Icon size={15} />
              {label}
              <ExternalLink size={12} />
            </a>
          ))}
          {n.portfolioSlug && (
            <Link to={`/u/${n.portfolioSlug}`} className="inline-flex items-center gap-1.5 text-primary font-medium">
              <Globe size={15} />
              /u/{n.portfolioSlug}
              <ExternalLink size={12} />
            </Link>
          )}
          <button
            type="button"
            onClick={() => openQuickEdit("links")}
            className="inline-flex items-center gap-1.5 text-primary hover:underline cursor-pointer"
          >
            <Pencil size={13} />
            {primaryLinks.length > 0 ? "Edit Links" : "+ Add Social & Portfolio Links"}
          </button>
          <span>
            <span className="dp-status-dot" />
            Active now
          </span>
        </section>
      </main>

      {/* ===== QUICK-EDIT DIALOG FOR ANY SECTION ===== */}
      <Dialog open={Boolean(quickSection)} onOpenChange={(open) => !open && setQuickSection(null)}>
        <DialogContent className="max-w-2xl max-h-[88vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="capitalize">
              Edit {quickSection === "identity" ? "Header, Specialty & Badges" : quickSection}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveQuickSection} className="space-y-4 pt-2">
            {quickSection === "identity" && (
              <div className="grid sm:grid-cols-2 gap-3.5">
                <div>
                  <Label htmlFor="qe-name">Full Name *</Label>
                  <Input
                    id="qe-name"
                    required
                    value={qFullName}
                    onChange={(e) => setQFullName(e.target.value)}
                    placeholder="e.g. Arjun Mehta"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="qe-phone">Phone Number</Label>
                  <Input
                    id="qe-phone"
                    type="tel"
                    value={qPhone}
                    onChange={(e) => setQPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="qe-head">Designation / Headline</Label>
                  <Input
                    id="qe-head"
                    value={qHeadline}
                    onChange={(e) => setQHeadline(e.target.value)}
                    placeholder="e.g. Senior Full-Stack Engineer"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="qe-sub">Sub-Headline / Specialty</Label>
                  <Input
                    id="qe-sub"
                    value={qSubHeadline}
                    onChange={(e) => setQSubHeadline(e.target.value)}
                    placeholder="e.g. Cloud & AI Specialist"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="qe-ind">Industry</Label>
                  <Input
                    id="qe-ind"
                    value={qIndustry}
                    onChange={(e) => setQIndustry(e.target.value)}
                    placeholder="e.g. Technology & Software"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="qe-city">City</Label>
                  <Input
                    id="qe-city"
                    value={qCity}
                    onChange={(e) => setQCity(e.target.value)}
                    placeholder="e.g. Bengaluru"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="qe-state">State</Label>
                  <Input
                    id="qe-state"
                    value={qState}
                    onChange={(e) => setQState(e.target.value)}
                    placeholder="e.g. Karnataka"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="qe-country">Country</Label>
                  <Input
                    id="qe-country"
                    value={qCountry}
                    onChange={(e) => setQCountry(e.target.value)}
                    placeholder="India"
                    className="mt-1"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="qe-badges">Focus Badges (comma-separated, shown under summary)</Label>
                  <Input
                    id="qe-badges"
                    value={qBadgesInput}
                    onChange={(e) => setQBadgesInput(e.target.value)}
                    placeholder="Full-Stack, Cloud Native, AI/ML, System Design, Product Thinking"
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {quickSection === "about" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="qe-about">About Me Summary</Label>
                  <Textarea
                    id="qe-about"
                    rows={5}
                    value={qAbout}
                    onChange={(e) => setQAbout(e.target.value)}
                    placeholder="Write a clear, compelling overview of your background, strengths, and impact..."
                    className="mt-1"
                  />
                </div>
                <div className="space-y-2.5">
                  <Label>4 Core Expertise Highlights (displayed below About Me)</Label>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {qExpertise.slice(0, 4).map((card, idx) => (
                      <div key={idx} className="rounded-lg border border-border p-2.5 space-y-2">
                        <Input
                          value={card.title}
                          onChange={(e) =>
                            setQExpertise((prev) =>
                              prev.map((c, i) => (i === idx ? { ...c, title: e.target.value } : c))
                            )
                          }
                          placeholder={`Pillar ${idx + 1} title (e.g. Cloud & DevOps)`}
                          className="h-8 text-xs font-semibold"
                        />
                        <Input
                          value={card.sub}
                          onChange={(e) =>
                            setQExpertise((prev) =>
                              prev.map((c, i) => (i === idx ? { ...c, sub: e.target.value } : c))
                            )
                          }
                          placeholder="Short subtitle (e.g. Scalable infrastructure)"
                          className="h-8 text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {quickSection === "experience" && (
              <div className="space-y-3">
                {qExperiences.map((exp, idx) => (
                  <div key={idx} className="rounded-xl border border-border p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-muted-foreground">Role #{idx + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setQExperiences((prev) => prev.filter((_, i) => i !== idx))}
                        className="h-7 text-xs text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                      </Button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      <Input
                        placeholder="Job Title *"
                        value={exp.title}
                        onChange={(e) =>
                          setQExperiences((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, title: e.target.value } : item))
                          )
                        }
                      />
                      <Input
                        placeholder="Company *"
                        value={exp.company}
                        onChange={(e) =>
                          setQExperiences((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, company: e.target.value } : item))
                          )
                        }
                      />
                      <Input
                        placeholder="Location (e.g. Bengaluru, India)"
                        value={exp.location}
                        onChange={(e) =>
                          setQExperiences((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, location: e.target.value } : item))
                          )
                        }
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Start (e.g. 2022)"
                          value={exp.start}
                          onChange={(e) =>
                            setQExperiences((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, start: e.target.value } : item))
                            )
                          }
                        />
                        <Input
                          placeholder="End or Present"
                          value={exp.end}
                          onChange={(e) =>
                            setQExperiences((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, end: e.target.value } : item))
                            )
                          }
                        />
                      </div>
                    </div>
                    <Textarea
                      rows={2}
                      placeholder="Key responsibilities & measurable impact..."
                      value={exp.description}
                      onChange={(e) =>
                        setQExperiences((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, description: e.target.value } : item))
                        )
                      }
                    />
                    <Input
                      placeholder="Tools & technologies used (comma-separated, e.g. React, Node.js, AWS)"
                      value={exp.tools.join(", ")}
                      onChange={(e) =>
                        setQExperiences((prev) =>
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
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setQExperiences((prev) => [
                      ...prev,
                      { title: "", company: "", location: "", start: "", end: "Present", description: "", tools: [] },
                    ])
                  }
                  className="w-full gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Position
                </Button>
              </div>
            )}

            {quickSection === "skills" && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Skill name (e.g. TypeScript, System Design)"
                    value={qSkillName}
                    onChange={(e) => setQSkillName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                        e.preventDefault();
                        const clean = qSkillName.trim();
                        if (clean && !qSkills.some((s) => s.name.toLowerCase() === clean.toLowerCase())) {
                          setQSkills((prev) => [...prev, { name: clean, level: qSkillLevel }]);
                          setQSkillName("");
                        }
                      }
                    }}
                  />
                  <select
                    aria-label="Skill proficiency"
                    value={qSkillLevel}
                    onChange={(e) => setQSkillLevel(e.target.value)}
                    className="h-10 rounded-md border border-input bg-background px-3 text-xs font-medium"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                  <Button
                    type="button"
                    onClick={() => {
                      const clean = qSkillName.trim();
                      if (clean && !qSkills.some((s) => s.name.toLowerCase() === clean.toLowerCase())) {
                        setQSkills((prev) => [...prev, { name: clean, level: qSkillLevel }]);
                        setQSkillName("");
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {qSkills.map((s) => (
                    <span
                      key={s.name}
                      className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                    >
                      {s.name} · {s.level}
                      <button
                        type="button"
                        onClick={() => setQSkills((prev) => prev.filter((item) => item.name !== s.name))}
                        aria-label={`Remove ${s.name}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {quickSection === "tools" && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tool (e.g. VS Code, Docker, Postman, Figma, Jira)"
                    value={qToolInput}
                    onChange={(e) => setQToolInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                        e.preventDefault();
                        const clean = qToolInput.trim();
                        if (clean && !qTools.includes(clean)) {
                          setQTools((prev) => [...prev, clean]);
                          setQToolInput("");
                        }
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      const clean = qToolInput.trim();
                      if (clean && !qTools.includes(clean)) {
                        setQTools((prev) => [...prev, clean]);
                        setQToolInput("");
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {qTools.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1 text-xs font-medium"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => setQTools((prev) => prev.filter((x) => x !== t))}
                        aria-label={`Remove ${t}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {quickSection === "projects" && (
              <div className="space-y-3">
                {qProjects.map((proj, idx) => (
                  <div key={idx} className="rounded-xl border border-border p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-muted-foreground">Project #{idx + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setQProjects((prev) => prev.filter((_, i) => i !== idx))}
                        className="h-7 text-xs text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                      </Button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      <Input
                        placeholder="Project Title *"
                        value={proj.title}
                        onChange={(e) =>
                          setQProjects((prev) =>
                            prev.map((p, i) => (i === idx ? { ...p, title: e.target.value } : p))
                          )
                        }
                      />
                      <Input
                        placeholder="Tools (comma-separated, e.g. React, Go, Docker)"
                        value={proj.tools.join(", ")}
                        onChange={(e) =>
                          setQProjects((prev) =>
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
                        placeholder="Live Demo URL (https://...)"
                        value={proj.url}
                        autoCorrect="off"
                        autoCapitalize="none"
                        spellCheck={false}
                        onChange={(e) =>
                          setQProjects((prev) =>
                            prev.map((p, i) => (i === idx ? { ...p, url: e.target.value } : p))
                          )
                        }
                      />
                      <Input
                        placeholder="GitHub Repo URL (https://github.com/...)"
                        value={proj.github_url}
                        autoCorrect="off"
                        autoCapitalize="none"
                        spellCheck={false}
                        onChange={(e) =>
                          setQProjects((prev) =>
                            prev.map((p, i) => (i === idx ? { ...p, github_url: e.target.value } : p))
                          )
                        }
                      />
                    </div>
                    <Textarea
                      rows={2}
                      placeholder="Project description & architecture highlights..."
                      value={proj.description}
                      onChange={(e) =>
                        setQProjects((prev) =>
                          prev.map((p, i) => (i === idx ? { ...p, description: e.target.value } : p))
                        )
                      }
                    />
                    <div className="flex flex-wrap items-center gap-3">
                      {proj.image_url && (
                        <img
                          src={proj.image_url}
                          alt={proj.title || "Preview"}
                          className="h-12 w-20 rounded object-cover border border-border"
                        />
                      )}
                      <label className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium cursor-pointer hover:bg-secondary">
                        {uploadingProjIdx === idx ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Upload className="h-3.5 w-3.5" />
                        )}
                        <span>{proj.image_url ? "Change Screenshot" : "Upload Project Screenshot"}</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(e) => handleProjectImageUpload(idx, e)}
                          className="dp-visually-hidden"
                        />
                      </label>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setQProjects((prev) => [
                      ...prev,
                      { title: "", role: "", description: "", tools: [], url: "", github_url: "", image_url: "", impact: "" },
                    ])
                  }
                  className="w-full gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Project
                </Button>
              </div>
            )}

            {quickSection === "education" && (
              <div className="space-y-3">
                {qEducations.map((ed, idx) => (
                  <div key={idx} className="rounded-xl border border-border p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-muted-foreground">Education #{idx + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setQEducations((prev) => prev.filter((_, i) => i !== idx))}
                        className="h-7 text-xs text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                      </Button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      <Input
                        placeholder="Institution / University *"
                        value={ed.institution}
                        onChange={(e) =>
                          setQEducations((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, institution: e.target.value } : item))
                          )
                        }
                      />
                      <Input
                        placeholder="Degree (e.g. B.Tech in Computer Science)"
                        value={ed.degree}
                        onChange={(e) =>
                          setQEducations((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, degree: e.target.value } : item))
                          )
                        }
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Start Year (2020)"
                          maxLength={4}
                          value={ed.start_year}
                          onChange={(e) =>
                            setQEducations((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, start_year: e.target.value } : item))
                            )
                          }
                        />
                        <Input
                          placeholder="End Year (2024)"
                          maxLength={4}
                          value={ed.year}
                          onChange={(e) =>
                            setQEducations((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, year: e.target.value } : item))
                            )
                          }
                        />
                      </div>
                      <Input
                        placeholder="Grade / CGPA (e.g. 8.7 CGPA or 94.2%)"
                        value={ed.grade}
                        onChange={(e) =>
                          setQEducations((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, grade: e.target.value } : item))
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setQEducations((prev) => [
                      ...prev,
                      { institution: "", degree: "", field_of_study: "", start_year: "", year: "", grade: "" },
                    ])
                  }
                  className="w-full gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Education
                </Button>
              </div>
            )}

            {quickSection === "certifications" && (
              <div className="space-y-3">
                {qCertifications.map((cert, idx) => (
                  <div key={idx} className="rounded-xl border border-border p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-muted-foreground">Certification #{idx + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setQCertifications((prev) => prev.filter((_, i) => i !== idx))}
                        className="h-7 text-xs text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                      </Button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      <Input
                        placeholder="Certification Name *"
                        value={cert.name}
                        onChange={(e) =>
                          setQCertifications((prev) =>
                            prev.map((c, i) => (i === idx ? { ...c, name: e.target.value } : c))
                          )
                        }
                      />
                      <Input
                        placeholder="Issuing Organization (e.g. AWS)"
                        value={cert.issuer}
                        onChange={(e) =>
                          setQCertifications((prev) =>
                            prev.map((c, i) => (i === idx ? { ...c, issuer: e.target.value } : c))
                          )
                        }
                      />
                      <Input
                        placeholder="Issue Date / Year (e.g. 2024)"
                        value={cert.date}
                        onChange={(e) =>
                          setQCertifications((prev) =>
                            prev.map((c, i) => (i === idx ? { ...c, date: e.target.value } : c))
                          )
                        }
                      />
                      <Input
                        placeholder="Credential URL (https://...)"
                        value={cert.credential_url || ""}
                        autoCorrect="off"
                        autoCapitalize="none"
                        spellCheck={false}
                        onChange={(e) =>
                          setQCertifications((prev) =>
                            prev.map((c, i) => (i === idx ? { ...c, credential_url: e.target.value } : c))
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setQCertifications((prev) => [...prev, { name: "", issuer: "", date: "", credential_url: "" }])
                  }
                  className="w-full gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Certification
                </Button>
              </div>
            )}

            {quickSection === "awards" && (
              <div className="space-y-3">
                {qAwards.map((aw, idx) => (
                  <div key={idx} className="rounded-xl border border-border p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-muted-foreground">Award #{idx + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setQAwards((prev) => prev.filter((_, i) => i !== idx))}
                        className="h-7 text-xs text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                      </Button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      <Input
                        placeholder="Award Title * (e.g. Winner – Smart India Hackathon)"
                        value={aw.title}
                        onChange={(e) =>
                          setQAwards((prev) => prev.map((a, i) => (i === idx ? { ...a, title: e.target.value } : a)))
                        }
                      />
                      <Input
                        placeholder="Organization / Event"
                        value={aw.organization || ""}
                        onChange={(e) =>
                          setQAwards((prev) =>
                            prev.map((a, i) => (i === idx ? { ...a, organization: e.target.value } : a))
                          )
                        }
                      />
                    </div>
                    <Input
                      placeholder="Description & Year (e.g. 1st place among 500+ teams, 2024)"
                      value={aw.description}
                      onChange={(e) =>
                        setQAwards((prev) =>
                          prev.map((a, i) => (i === idx ? { ...a, description: e.target.value } : a))
                        )
                      }
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setQAwards((prev) => [...prev, { title: "", organization: "", date: "", description: "" }])}
                  className="w-full gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Award
                </Button>
              </div>
            )}

            {quickSection === "languages" && (
              <div className="space-y-3">
                {qLanguages.map((lang, idx) => (
                  <div key={idx} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                    <Input
                      placeholder="Language (e.g. English)"
                      value={lang.name}
                      onChange={(e) =>
                        setQLanguages((prev) =>
                          prev.map((l, i) => (i === idx ? { ...l, name: e.target.value } : l))
                        )
                      }
                    />
                    <Input
                      placeholder="Proficiency (e.g. Native, Fluent)"
                      value={lang.level}
                      onChange={(e) =>
                        setQLanguages((prev) =>
                          prev.map((l, i) => (i === idx ? { ...l, level: e.target.value } : l))
                        )
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setQLanguages((prev) => prev.filter((_, i) => i !== idx))}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setQLanguages((prev) => [...prev, { name: "", level: "Fluent" }])}
                  className="w-full gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Language
                </Button>
              </div>
            )}

            {quickSection === "hobbies" && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add hobby (e.g. Open Source Contributing, Photography)"
                    value={qHobbyInput}
                    onChange={(e) => setQHobbyInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                        e.preventDefault();
                        const clean = qHobbyInput.trim();
                        if (clean && !qHobbies.includes(clean)) {
                          setQHobbies((prev) => [...prev, clean]);
                          setQHobbyInput("");
                        }
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      const clean = qHobbyInput.trim();
                      if (clean && !qHobbies.includes(clean)) {
                        setQHobbies((prev) => [...prev, clean]);
                        setQHobbyInput("");
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {qHobbies.map((h) => (
                    <span
                      key={h}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1 text-xs font-medium"
                    >
                      {h}
                      <button type="button" onClick={() => setQHobbies((prev) => prev.filter((x) => x !== h))}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {quickSection === "interests" && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add interest (e.g. Generative AI, Distributed Systems)"
                    value={qInterestInput}
                    onChange={(e) => setQInterestInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                        e.preventDefault();
                        const clean = qInterestInput.trim();
                        if (clean && !qInterests.includes(clean)) {
                          setQInterests((prev) => [...prev, clean]);
                          setQInterestInput("");
                        }
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      const clean = qInterestInput.trim();
                      if (clean && !qInterests.includes(clean)) {
                        setQInterests((prev) => [...prev, clean]);
                        setQInterestInput("");
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {qInterests.map((it) => (
                    <span
                      key={it}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1 text-xs font-medium"
                    >
                      {it}
                      <button type="button" onClick={() => setQInterests((prev) => prev.filter((x) => x !== it))}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {quickSection === "links" && (
              <div className="grid sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <Label htmlFor="qe-slug">Public Portfolio Handle (/u/your-handle)</Label>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs font-mono text-muted-foreground">/u/</span>
                    <Input
                      id="qe-slug"
                      value={qSlug}
                      autoCorrect="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      onChange={(e) => setQSlug(e.target.value)}
                      placeholder="your-name-pro"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="qe-li">LinkedIn URL</Label>
                  <Input
                    id="qe-li"
                    value={qLinkedin}
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    onChange={(e) => setQLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="qe-gh">GitHub URL</Label>
                  <Input
                    id="qe-gh"
                    value={qGithub}
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    onChange={(e) => setQGithub(e.target.value)}
                    placeholder="https://github.com/..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="qe-pf">Portfolio Website</Label>
                  <Input
                    id="qe-pf"
                    value={qPortfolio}
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    onChange={(e) => setQPortfolio(e.target.value)}
                    placeholder="https://yoursite.dev"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="qe-kg">Kaggle URL</Label>
                  <Input
                    id="qe-kg"
                    value={qKaggle}
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    onChange={(e) => setQKaggle(e.target.value)}
                    placeholder="https://kaggle.com/..."
                    className="mt-1"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="qe-bh">Behance / Design Portfolio URL</Label>
                  <Input
                    id="qe-bh"
                    value={qBehance}
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    onChange={(e) => setQBehance(e.target.value)}
                    placeholder="https://behance.net/..."
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setQuickSection(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={savingQuick}>
                {savingQuick && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ===== FULL-SCREEN VIDEO RESUME MODAL (Exact Arjun Mehta Cinema View + Live Editor) ===== */}
      {videoResumeOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950 text-white flex flex-col overflow-y-auto animate-fade-in">
          <header className="h-16 px-6 border-b border-white/10 flex items-center justify-between shrink-0 bg-slate-950/90 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full overflow-hidden border border-white/20 bg-primary flex items-center justify-center shrink-0">
                {n.profilePhotoUrl ? (
                  <img src={n.profilePhotoUrl} alt={n.fullName} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xs font-bold text-white">{initials}</span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white">{n.fullName || "Your Video Resume"}</h2>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/20 text-blue-300 border border-blue-400/30">
                    <Sparkles className="h-3 w-3" /> 60s Video Resume
                  </span>
                </div>
                <p className="text-xs text-slate-400">{n.headline}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setQVideoUrl(n.videoIntroUrl);
                  setQVideoPitch(n.videoPitch);
                  setEditingVideoInModal((prev) => !prev);
                }}
                className="cursor-pointer gap-1.5 border-white/20 text-white hover:bg-white/10 text-xs"
              >
                <Pencil className="h-3.5 w-3.5" />
                {editingVideoInModal ? "Preview Video" : "Edit Video & Pitch"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDownloadResume}
                className="cursor-pointer gap-1.5 border-white/20 text-white hover:bg-white/10 text-xs"
              >
                <Download className="h-3.5 w-3.5" />
                Download Resume
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setVideoResumeOpen(false)}
                className="cursor-pointer gap-1 text-slate-300 hover:text-white hover:bg-white/10 text-xs"
              >
                <X className="h-4 w-4" />
                Close
              </Button>
            </div>
          </header>

          <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-[1.8fr_1.2fr] gap-6 items-start">
            <div className="space-y-4">
              {editingVideoInModal ? (
                <form
                  onSubmit={handleSaveVideoResume}
                  className="p-6 rounded-2xl bg-white/5 border border-white/15 space-y-4"
                >
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Video className="h-4 w-4 text-blue-400" />
                    Configure Your 60-Second Video Resume
                  </h3>
                  <div>
                    <label htmlFor="vr-url" className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Video URL (Direct MP4/WebM link or YouTube link)
                    </label>
                    <Input
                      id="vr-url"
                      value={qVideoUrl}
                      autoCorrect="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      onChange={(e) => setQVideoUrl(e.target.value)}
                      placeholder="https://youtube.com/watch?v=... or https://.../pitch.mp4"
                      className="bg-slate-900 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="vr-pitch" className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Written Video Pitch / Transcript Summary
                    </label>
                    <Textarea
                      id="vr-pitch"
                      rows={4}
                      value={qVideoPitch}
                      onChange={(e) => setQVideoPitch(e.target.value)}
                      placeholder="Hello! In this 60-second pitch, I walk through my core engineering background, key projects, and what I bring to your team..."
                      className="bg-slate-900 border-white/20 text-white"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setEditingVideoInModal(false)}
                      className="text-slate-300 hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={savingQuick}>
                      {savingQuick && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
                      Save Video Resume
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/15 shadow-2xl flex items-center justify-center">
                  {ytEmbed ? (
                    <iframe
                      src={ytEmbed}
                      title={`${n.fullName} Video Resume`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : n.videoIntroUrl ? (
                    <video
                      src={n.videoIntroUrl}
                      controls
                      playsInline
                      className="w-full h-full object-contain"
                      poster={n.bannerPhotoUrl || cloudProject}
                    />
                  ) : (
                    <div className="text-center p-6 space-y-3">
                      <Video className="h-10 w-10 text-blue-400 mx-auto" />
                      <p className="text-sm font-semibold text-white">No video resume link added yet</p>
                      <p className="text-xs text-slate-400 max-w-md">
                        Add a 60-second video introduction (YouTube or MP4 URL) and written pitch so recruiters can
                        hear directly from you.
                      </p>
                      <Button type="button" size="sm" onClick={() => setEditingVideoInModal(true)}>
                        + Add Video Resume Link
                      </Button>
                    </div>
                  )}
                </div>
              )}

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Video className="h-4 w-4 text-blue-400" />
                    Candidate Video Pitch
                  </h3>
                  {n.latestCir && (
                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Verified by Talento CIR
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {n.videoPitch ||
                    n.about ||
                    "Add a short written pitch describing your strengths, signature projects, and ideal next role."}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Core Technical Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {n.skills.length > 0 ? (
                    n.skills.map((s) => (
                      <span
                        key={s.name}
                        className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-xs font-medium text-slate-200"
                      >
                        {s.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">No skills added yet.</span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-300">Availability Status:</span>
                <div className="flex flex-wrap gap-2">
                  {n.openToWork && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" /> Open to Work
                    </span>
                  )}
                  {n.openForFreelance && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                      <span className="h-2 w-2 rounded-full bg-sky-500" /> Open for Freelancing
                    </span>
                  )}
                  {!n.openToWork && !n.openForFreelance && (
                    <span className="text-slate-400">Not currently looking</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveCandidateProfileView;
