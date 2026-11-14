import { useState, useEffect, useCallback, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { siteLogo } from "@/assets/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Code2,
  Link2,
  Save,
  LogOut,
  Loader2,
  Award,
  FolderKanban,
  BookOpen,
  Trophy,
  Heart,
  Settings2,
  Camera,
  Languages as LanguagesIcon,
  Plus,
  Trash2,
  Eye,
} from "lucide-react";

import CompletionRing from "@/components/profile/CompletionRing";
import ProfileSection from "@/components/profile/ProfileSection";
import ProfilePhotoSection from "@/components/profile/sections/ProfilePhotoSection";
import BasicInfoSection from "@/components/profile/sections/BasicInfoSection";
import AboutSection from "@/components/profile/sections/AboutSection";
import ExperienceSection from "@/components/profile/sections/ExperienceSection";
import EducationSection from "@/components/profile/sections/EducationSection";
import SkillsSection from "@/components/profile/sections/SkillsSection";
import LinksSection from "@/components/profile/sections/LinksSection";
import CareerPreferencesSection from "@/components/profile/sections/CareerPreferencesSection";
import CertificationsSection from "@/components/profile/sections/CertificationsSection";
import ProjectsSection from "@/components/profile/sections/ProjectsSection";
import CoursesSection from "@/components/profile/sections/CoursesSection";
import AchievementsSection from "@/components/profile/sections/AchievementsSection";
import VolunteerSection from "@/components/profile/sections/VolunteerSection";
import { CharCount } from "@/components/profile/CharCount";
import { PROFILE_CHAR_LIMITS, hasCustomExpertiseCards } from "@/components/profile/profileFormatters";
import {
  loadFullLiveProfile,
  normalizeLiveProfile,
  saveRichCandidateProfile,
  type ExpertiseCardItem,
} from "@/services/candidate/profile";

const ProfileBuilder = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [existingShellState, setExistingShellState] = useState<Record<string, any>>({});

  const [profile, setProfile] = useState<Record<string, any>>({});
  const [expertiseCards, setExpertiseCards] = useState<ExpertiseCardItem[]>([
    { title: "", sub: "" },
    { title: "", sub: "" },
    { title: "", sub: "" },
    { title: "", sub: "" },
  ]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [educations, setEducations] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [languages, setLanguages] = useState<{ name: string; level: string }[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [volunteer, setVolunteer] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUserId(user.id);

      const [live, rawProfileRes, courseRes, volRes] = await Promise.all([
        loadFullLiveProfile(),
        supabase.from("profiles").select("career_objective, key_achievements, employment_type").eq("id", user.id).maybeSingle(),
        supabase.from("courses").select("*").eq("user_id", user.id).order("created_at"),
        supabase.from("volunteer_experiences").select("*").eq("user_id", user.id).order("created_at"),
      ]);

      if (live) {
        const n = normalizeLiveProfile(live);
        setExistingShellState(n.shellState);
        setProfile({
          full_name: n.fullName,
          email: n.email,
          phone: n.phone,
          professional_headline: n.headline,
          sub_headline: n.subHeadline,
          job_role: n.jobRole,
          company: n.company,
          city: n.city,
          state: n.state,
          country: n.country,
          years_of_experience: n.yearsOfExperience,
          experience_level: n.experienceLevel,
          industry: n.industry,
          about_summary: n.about,
          career_objective: rawProfileRes.data?.career_objective || "",
          key_achievements: rawProfileRes.data?.key_achievements || "",
          employment_type: rawProfileRes.data?.employment_type || "full-time",
          availability_status: n.employmentType,
          notice_period: n.noticePeriod,
          preferred_salary_range: n.salaryRange,
          open_to_work: n.openToWork,
          open_for_freelance: n.openForFreelance,
          preferred_locations: n.preferredLocations,
          areas_of_expertise: n.focusBadges,
          tools: n.tools,
          hobbies: n.hobbies,
          career_interests: n.interests,
          profile_photo_url: n.profilePhotoUrl,
          banner_photo_url: n.bannerPhotoUrl,
          resume_path: n.resumePath,
          resume_url: n.resumeUrl,
          portfolio_slug: n.portfolioSlug,
          linkedin_url: n.linkedinUrl,
          github_url: n.githubUrl,
          portfolio_url: n.portfolioUrl,
          behance_url: n.behanceUrl,
          kaggle_url: n.kaggleUrl,
          video_intro_url: n.videoIntroUrl,
          video_pitch: n.videoPitch,
        });

        const paddedCards = hasCustomExpertiseCards(n.expertiseCards, n.industry, n.headline || n.jobRole)
          ? [...n.expertiseCards]
          : [];
        while (paddedCards.length < 4) paddedCards.push({ title: "", sub: "" });
        setExpertiseCards(paddedCards.slice(0, 4));

        setExperiences(
          n.experiences.map((e) => ({
            job_title: e.title,
            company_name: e.company,
            location: e.location,
            employment_type: "Full-time",
            start_date: e.start && /^\d{4}$/.test(e.start) ? `${e.start}-01-01` : e.start,
            end_date: e.end && e.end !== "Present" && /^\d{4}$/.test(e.end) ? `${e.end}-01-01` : e.end === "Present" ? "" : e.end,
            is_current: !e.end || e.end === "Present",
            description: e.description,
            tools_technologies: e.tools,
          }))
        );

        setEducations(
          n.educations.map((ed) => ({
            institution_name: ed.institution,
            degree: ed.degree,
            field_of_study: ed.field_of_study || "",
            start_year: ed.start_year ? Number(ed.start_year) || null : null,
            end_year: ed.year ? Number(ed.year) || null : null,
            grade: ed.grade || "",
          }))
        );

        setSkills(
          n.skills.map((s) => ({
            skill_name: s.name,
            category: s.category || "technical",
            proficiency_level: s.level.toLowerCase(),
          }))
        );

        setCertifications(
          n.certifications.map((c) => ({
            name: c.name,
            issuing_organization: c.issuer,
            issue_date: c.date && /^\d{4}$/.test(c.date) ? `${c.date}-01-01` : c.date,
            expiry_date: "",
            credential_id: "",
            credential_url: c.credential_url || "",
          }))
        );

        setProjects(
          n.projects.map((p) => ({
            title: p.title,
            description: p.description,
            organization: "",
            role_in_project: p.role || "",
            start_date: "",
            end_date: "",
            project_url: p.url,
            github_url: p.github_url,
            image_url: p.image_url,
            tools_technologies: p.tools,
            impact: p.impact || "",
          }))
        );

        setAchievements(
          n.awards.map((a) => ({
            title: a.title,
            organization: a.organization || "",
            achievement_date: a.date && /^\d{4}$/.test(a.date) ? `${a.date}-01-01` : a.date || "",
            description: a.description,
          }))
        );

        setLanguages(n.languages);
      }

      if (courseRes.data) setCourses(courseRes.data);
      if (volRes.data) setVolunteer(volRes.data);
      setLoading(false);
    };
    void load();
  }, [navigate]);

  const updateProfile = useCallback((field: string, value: any) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }, []);

  const completion = useMemo(() => {
    let filled = 0;
    const total = 12;
    if (profile.full_name) filled++;
    if (profile.professional_headline || profile.job_role) filled++;
    if (profile.about_summary) filled++;
    if (profile.city || profile.country) filled++;
    if (experiences.length > 0) filled++;
    if (educations.length > 0) filled++;
    if (skills.length >= 3) filled++;
    if (profile.linkedin_url || profile.github_url || profile.portfolio_url) filled++;
    if (profile.employment_type || profile.availability_status) filled++;
    if (certifications.length > 0) filled++;
    if (projects.length > 0) filled++;
    if (profile.profile_photo_url || profile.banner_photo_url) filled++;
    return Math.round((filled / total) * 100);
  }, [profile, experiences, educations, skills, certifications, projects]);

  const isBasicComplete = !!(profile.full_name && profile.email && (profile.job_role || profile.professional_headline));
  const isAboutComplete = !!profile.about_summary;
  const isExpComplete = experiences.length > 0 && experiences.some((e) => e.job_title && e.company_name);
  const isEduComplete = educations.length > 0 && educations.some((e) => e.institution_name && e.degree);
  const isSkillsComplete = skills.length >= 3;
  const isLinksComplete = !!(profile.linkedin_url || profile.github_url);
  const isCareerComplete = !!(profile.employment_type || profile.availability_status);
  const isCertComplete = certifications.length > 0;
  const isProjectsComplete = projects.length > 0;
  const isLanguagesComplete = languages.some((l) => l.name.trim());
  const isCoursesComplete = courses.length > 0;
  const isAchievementsComplete = achievements.length > 0;
  const isVolunteerComplete = volunteer.length > 0;

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      await saveRichCandidateProfile({
        fullName: profile.full_name || "",
        phone: profile.phone || "",
        headline: profile.professional_headline || "",
        subHeadline: profile.sub_headline || "",
        jobRole: profile.job_role || "",
        company: profile.company || "",
        industry: profile.industry || "",
        experienceLevel: profile.experience_level || "fresher",
        yearsOfExperience: profile.years_of_experience ? Number(profile.years_of_experience) : 0,
        city: profile.city || "",
        state: profile.state || "",
        country: profile.country || "India",
        about: profile.about_summary || "",
        profilePhotoUrl: profile.profile_photo_url || "",
        bannerPhotoUrl: profile.banner_photo_url || "",
        openToWork: profile.open_to_work !== false,
        openForFreelance: Boolean(profile.open_for_freelance),
        workMode: (existingShellState?.pf?.wm as "Remote" | "Hybrid" | "Onsite") || "Hybrid",
        employmentType: profile.availability_status || "Full-time",
        noticePeriod: profile.notice_period || "Immediate",
        salaryRange: profile.preferred_salary_range || "",
        preferredLocations: Array.isArray(profile.preferred_locations) ? profile.preferred_locations : [],
        portfolioSlug: profile.portfolio_slug || "",
        resumePath: profile.resume_path || null,
        resumeUrl: profile.resume_url || null,
        videoIntroUrl: profile.video_intro_url || "",
        videoPitch: profile.video_pitch || "",
        linkedinUrl: profile.linkedin_url || "",
        githubUrl: profile.github_url || "",
        portfolioUrl: profile.portfolio_url || "",
        kaggleUrl: profile.kaggle_url || "",
        behanceUrl: profile.behance_url || "",
        focusBadges: Array.isArray(profile.areas_of_expertise) ? profile.areas_of_expertise : [],
        expertiseCards,
        skills: skills.map((s) => ({
          name: String(s.skill_name || ""),
          level: String(s.proficiency_level || "intermediate").toLowerCase(),
          category: String(s.category || "technical").toLowerCase(),
        })),
        tools: Array.isArray(profile.tools) ? profile.tools : [],
        experiences: experiences.map((e) => ({
          title: e.job_title || "",
          company: e.company_name || "",
          location: e.location || "",
          start: e.start_date || "",
          end: e.is_current ? "Present" : e.end_date || "Present",
          description: e.description || "",
          tools: Array.isArray(e.tools_technologies) ? e.tools_technologies : [],
        })),
        projects: projects.map((p) => ({
          title: p.title || "",
          role: p.role_in_project || "",
          description: p.description || "",
          tools: Array.isArray(p.tools_technologies) ? p.tools_technologies : [],
          url: p.project_url || "",
          github_url: p.github_url || "",
          image_url: p.image_url || "",
          impact: p.impact || "",
        })),
        educations: educations.map((ed) => ({
          institution: ed.institution_name || "",
          degree: ed.degree || "",
          field_of_study: ed.field_of_study || "",
          start_year: ed.start_year ? String(ed.start_year) : "",
          year: ed.end_year ? String(ed.end_year) : "",
          grade: ed.grade || "",
        })),
        certifications: certifications.map((c) => ({
          name: c.name || "",
          issuer: c.issuing_organization || "",
          date: c.issue_date || "",
          credential_url: c.credential_url || "",
        })),
        awards: achievements.map((a) => ({
          title: a.title || "",
          organization: a.organization || "",
          date: a.achievement_date || "",
          description: a.description || "",
        })),
        languages,
        hobbies: Array.isArray(profile.hobbies) ? profile.hobbies : [],
        interests: Array.isArray(profile.career_interests) ? profile.career_interests : [],
        existingShellState,
      });

      // Also persist extra ProfileBuilder-only fields (courses, volunteer, career_objective)
      await supabase
        .from("profiles")
        .update({
          career_objective: profile.career_objective || null,
          key_achievements: profile.key_achievements || null,
        })
        .eq("id", userId);

      const syncExtraTable = async (table: "courses" | "volunteer_experiences", items: any[]) => {
        await supabase.from(table).delete().eq("user_id", userId);
        if (items.length > 0) {
          const rows = items.map(({ id, created_at, ...rest }: any) => ({
            ...rest,
            user_id: userId,
          }));
          await supabase.from(table).insert(rows as any);
        }
      };

      await Promise.all([
        syncExtraTable("courses", courses),
        syncExtraTable("volunteer_experiences", volunteer),
      ]);

      toast.success("Profile saved! Viewing your verified profile.");
      navigate("/talento-pro?view=profile");
    } catch (err: any) {
      toast.error(err?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const sections = [
    { label: "Banner & Photo", done: !!(profile.profile_photo_url || profile.banner_photo_url) },
    { label: "Basic Info", done: isBasicComplete },
    { label: "About & Expertise", done: isAboutComplete },
    { label: "Career, Tools & Hobbies", done: isCareerComplete },
    { label: "Experience", done: isExpComplete },
    { label: "Education", done: isEduComplete },
    { label: "Skills (3+)", done: isSkillsComplete },
    { label: "Certifications", done: isCertComplete },
    { label: "Projects", done: isProjectsComplete },
    { label: "Languages", done: isLanguagesComplete },
    { label: "Courses", done: isCoursesComplete },
    { label: "Awards", done: isAchievementsComplete },
    { label: "Volunteer", done: isVolunteerComplete },
    { label: "Links & Video", done: isLinksComplete },
  ];

  return (
    <>
      <Helmet>
        <title>Build Your Profile | IAmTalento</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-20 border-b bg-card/80 backdrop-blur-sm">
          <div className="container flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2">
                <img src={siteLogo.url} alt={siteLogo.alt} className="h-10 w-auto object-contain" />
              </Link>
              <div className="h-5 w-px bg-border" />
              <span className="text-sm font-medium text-muted-foreground">Profile Builder</span>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="h-8 text-xs gap-1.5">
                <Link to="/talento-pro?view=profile">
                  <Eye className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">View Profile</span>
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm" className="h-8 text-xs hidden sm:inline-flex">
                <Link to="/talento-pro?view=dash">Dashboard</Link>
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={handleSave} disabled={saving} className="gap-1.5 h-8 text-xs">
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                {saving ? "Saving..." : "Save & View"}
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={handleSignOut} className="h-8 text-xs text-muted-foreground" aria-label="Sign out">
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </header>

        <div className="container py-8">
          <div className="grid lg:grid-cols-[1fr_280px] gap-8">
            <div className="space-y-4">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <h1 className="text-2xl font-bold font-display mb-1">Build Your Profile</h1>
                <p className="text-sm text-muted-foreground">
                  Customize your cover banner, avatar, expertise highlights, projects, and credentials.
                </p>
              </motion.div>

              <ProfileSection
                title="Cover Banner & Profile Photo"
                icon={<Camera className="h-5 w-5" />}
                isComplete={!!(profile.profile_photo_url || profile.banner_photo_url)}
                defaultOpen
              >
                <ProfilePhotoSection
                  photoUrl={profile.profile_photo_url || ""}
                  bannerUrl={profile.banner_photo_url || ""}
                  userId={userId || ""}
                  fullName={profile.full_name || ""}
                  onChange={updateProfile}
                  onShellStateSynced={setExistingShellState}
                />
              </ProfileSection>

              <ProfileSection title="Basic Information" icon={<User className="h-5 w-5" />} isComplete={isBasicComplete} defaultOpen>
                <BasicInfoSection data={profile as any} onChange={updateProfile} />
              </ProfileSection>

              <ProfileSection title="About & Core Expertise Cards" icon={<FileText className="h-5 w-5" />} isComplete={isAboutComplete}>
                <div className="space-y-5">
                  <AboutSection
                    summary={profile.about_summary || ""}
                    objective={profile.career_objective || ""}
                    achievements={profile.key_achievements || ""}
                    onChange={updateProfile}
                  />
                  <div className="pt-3 border-t space-y-3">
                    <div>
                      <Label className="text-xs font-semibold text-foreground block">
                        4 Core Spotlight Cards (Optional — Displayed in About Me Panel)
                      </Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Leave blank to auto-curate smart highlights from your role, skills &amp; tools.
                      </p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {expertiseCards.map((card, idx) => (
                        <div key={idx} className="rounded-lg border p-3 space-y-2 bg-muted/20">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-medium text-muted-foreground">Card {idx + 1} Title</span>
                            <CharCount value={card.title} max={PROFILE_CHAR_LIMITS.expertiseTitle} />
                          </div>
                          <Input
                            maxLength={PROFILE_CHAR_LIMITS.expertiseTitle}
                            value={card.title}
                            onChange={(e) => {
                              const next = [...expertiseCards];
                              next[idx] = { ...next[idx], title: e.target.value };
                              setExpertiseCards(next);
                            }}
                            placeholder={`Highlight ${idx + 1} (e.g. Performance Marketing)`}
                            className="h-8 text-xs"
                          />
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] text-muted-foreground">Subtitle</span>
                            <CharCount value={card.sub} max={PROFILE_CHAR_LIMITS.expertiseSub} />
                          </div>
                          <Input
                            maxLength={PROFILE_CHAR_LIMITS.expertiseSub}
                            value={card.sub}
                            onChange={(e) => {
                              const next = [...expertiseCards];
                              next[idx] = { ...next[idx], sub: e.target.value };
                              setExpertiseCards(next);
                            }}
                            placeholder="Short proof point (e.g. Multi-channel ROI growth)"
                            className="h-8 text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ProfileSection>

              <ProfileSection title="Availability, Tools, Hobbies & Interests" icon={<Settings2 className="h-5 w-5" />} isComplete={isCareerComplete}>
                <CareerPreferencesSection data={profile} onChange={updateProfile} />
              </ProfileSection>

              <ProfileSection title="Work Experience" icon={<Briefcase className="h-5 w-5" />} isComplete={isExpComplete}>
                <ExperienceSection experiences={experiences} onChange={setExperiences} />
              </ProfileSection>

              <ProfileSection title="Education" icon={<GraduationCap className="h-5 w-5" />} isComplete={isEduComplete}>
                <EducationSection educations={educations} onChange={setEducations} />
              </ProfileSection>

              <ProfileSection title="Skills" icon={<Code2 className="h-5 w-5" />} isComplete={isSkillsComplete}>
                <SkillsSection skills={skills} onChange={setSkills} />
              </ProfileSection>

              <ProfileSection title="Certifications" icon={<Award className="h-5 w-5" />} isComplete={isCertComplete}>
                <CertificationsSection certifications={certifications} onChange={setCertifications} />
              </ProfileSection>

              <ProfileSection title="Projects" icon={<FolderKanban className="h-5 w-5" />} isComplete={isProjectsComplete}>
                <ProjectsSection projects={projects} userId={userId || ""} onChange={setProjects} />
              </ProfileSection>

              <ProfileSection title="Languages" icon={<LanguagesIcon className="h-5 w-5" />} isComplete={isLanguagesComplete}>
                <div className="space-y-3">
                  {languages.map((lang, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Input
                        maxLength={PROFILE_CHAR_LIMITS.languageName}
                        value={lang.name}
                        onChange={(e) => {
                          const next = [...languages];
                          next[idx] = { ...next[idx], name: e.target.value };
                          setLanguages(next);
                        }}
                        placeholder="Language (e.g. English, Hindi)"
                        className="h-9 text-sm flex-1"
                      />
                      <Input
                        maxLength={PROFILE_CHAR_LIMITS.languageLevel}
                        value={lang.level}
                        onChange={(e) => {
                          const next = [...languages];
                          next[idx] = { ...next[idx], level: e.target.value };
                          setLanguages(next);
                        }}
                        placeholder="Fluency (e.g. Native, Fluent)"
                        className="h-9 text-sm w-44"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setLanguages(languages.filter((_, i) => i !== idx))}
                        className="h-9 w-9 text-muted-foreground hover:text-destructive"
                        aria-label={`Remove language ${idx + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setLanguages([...languages, { name: "", level: "Fluent" }])}
                    className="w-full h-9 text-xs gap-1.5"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Language
                  </Button>
                </div>
              </ProfileSection>

              <ProfileSection title="Courses & Learning" icon={<BookOpen className="h-5 w-5" />} isComplete={isCoursesComplete}>
                <CoursesSection courses={courses} onChange={setCourses} />
              </ProfileSection>

              <ProfileSection title="Awards & Achievements" icon={<Trophy className="h-5 w-5" />} isComplete={isAchievementsComplete}>
                <AchievementsSection achievements={achievements} onChange={setAchievements} />
              </ProfileSection>

              <ProfileSection title="Volunteer Experience" icon={<Heart className="h-5 w-5" />} isComplete={isVolunteerComplete}>
                <VolunteerSection volunteer={volunteer} onChange={setVolunteer} />
              </ProfileSection>

              <ProfileSection title="Links, Handle & Video Resume" icon={<Link2 className="h-5 w-5" />} isComplete={isLinksComplete}>
                <LinksSection data={profile as any} onChange={updateProfile} />
              </ProfileSection>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <Button type="button" onClick={handleSave} disabled={saving} className="w-full h-11 gap-2" size="lg">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {saving ? "Saving Profile..." : "Save & View Profile"}
                </Button>
              </motion.div>
            </div>

            <div className="hidden lg:block">
              <div className="sticky top-20 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-2xl border bg-card p-6 flex flex-col items-center"
                >
                  <CompletionRing percentage={completion} />
                  <p className="text-sm font-semibold font-display mt-4">Profile Completion</p>
                  <p className="text-xs text-muted-foreground mt-1 text-center">
                    {completion < 50
                      ? "Keep going! Complete more sections."
                      : completion < 100
                        ? "Almost there! A few more details."
                        : "Your profile is complete!"}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="rounded-2xl border bg-card p-5"
                >
                  <p className="text-xs font-semibold font-display mb-3">Checklist</p>
                  <div className="space-y-2">
                    {sections.map(({ label, done }) => (
                      <div key={label} className="flex items-center gap-2.5">
                        <div className={`h-2 w-2 rounded-full shrink-0 ${done ? "bg-success" : "bg-muted-foreground/20"}`} />
                        <span className={`text-xs ${done ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileBuilder;
