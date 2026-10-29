import { useState, useEffect, useCallback, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { siteLogo } from "@/assets/logo";
import { Button } from "@/components/ui/button";
import {
  Zap, User, FileText, Briefcase, GraduationCap, Code2,
  Link2, Save, LogOut, Loader2, Award, FolderKanban,
  BookOpen, Trophy, Heart, Settings2, Camera,
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

const ProfileBuilder = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [profile, setProfile] = useState<Record<string, any>>({});
  const [experiences, setExperiences] = useState<any[]>([]);
  const [educations, setEducations] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [volunteer, setVolunteer] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }
      setUserId(user.id);

      const [profileRes, expRes, eduRes, skillRes, certRes, projRes, courseRes, achRes, volRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("experiences").select("*").eq("user_id", user.id).order("start_date", { ascending: false }),
        supabase.from("educations").select("*").eq("user_id", user.id).order("start_year", { ascending: false }),
        supabase.from("skills").select("*").eq("user_id", user.id).order("created_at"),
        supabase.from("certifications").select("*").eq("user_id", user.id).order("created_at"),
        supabase.from("projects").select("*").eq("user_id", user.id).order("created_at"),
        supabase.from("courses").select("*").eq("user_id", user.id).order("created_at"),
        supabase.from("achievements").select("*").eq("user_id", user.id).order("created_at"),
        supabase.from("volunteer_experiences").select("*").eq("user_id", user.id).order("created_at"),
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (expRes.data) setExperiences(expRes.data);
      if (eduRes.data) setEducations(eduRes.data);
      if (skillRes.data) setSkills(skillRes.data);
      if (certRes.data) setCertifications(certRes.data);
      if (projRes.data) setProjects(projRes.data);
      if (courseRes.data) setCourses(courseRes.data);
      if (achRes.data) setAchievements(achRes.data);
      if (volRes.data) setVolunteer(volRes.data);
      setLoading(false);
    };
    load();
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
    if (profile.profile_photo_url) filled++;
    return Math.round((filled / total) * 100);
  }, [profile, experiences, educations, skills, certifications, projects]);

  const isBasicComplete = !!(profile.full_name && profile.email && (profile.job_role || profile.professional_headline));
  const isAboutComplete = !!(profile.about_summary);
  const isExpComplete = experiences.length > 0 && experiences.some((e) => e.job_title && e.company_name);
  const isEduComplete = educations.length > 0 && educations.some((e) => e.institution_name && e.degree);
  const isSkillsComplete = skills.length >= 3;
  const isLinksComplete = !!(profile.linkedin_url || profile.github_url);
  const isCareerComplete = !!(profile.employment_type && profile.availability_status);
  const isCertComplete = certifications.length > 0;
  const isProjectsComplete = projects.length > 0;
  const isCoursesComplete = courses.length > 0;
  const isAchievementsComplete = achievements.length > 0;
  const isVolunteerComplete = volunteer.length > 0;

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    const cleanUrl = (v: unknown) => {
      if (typeof v !== "string") return null;
      const t = v.trim();
      if (!t) return null;
      if (/^https?:\/\//i.test(t)) return t;
      return `https://${t}`;
    };
    try {
      const { error: profileError } = await supabase.from("profiles").update({
        full_name: profile.full_name,
        phone: profile.phone || null,
        professional_headline: profile.professional_headline || null,
        job_role: profile.job_role || null,
        company: profile.company || null,
        city: profile.city || null,
        state: profile.state || null,
        country: profile.country || null,
        years_of_experience: profile.years_of_experience ? Number(profile.years_of_experience) : null,
        experience_level: profile.experience_level || null,
        industry: profile.industry || null,
        about_summary: profile.about_summary || null,
        career_objective: profile.career_objective || null,
        key_achievements: profile.key_achievements,
        linkedin_url: cleanUrl(profile.linkedin_url),
        github_url: cleanUrl(profile.github_url),
        portfolio_url: cleanUrl(profile.portfolio_url),
        resume_url: cleanUrl(profile.resume_url),
        behance_url: cleanUrl(profile.behance_url),
        kaggle_url: cleanUrl(profile.kaggle_url),
        video_intro_url: cleanUrl(profile.video_intro_url),
        employment_type: profile.employment_type || null,
        availability_status: profile.availability_status || null,
        notice_period: profile.notice_period || null,
        preferred_salary_range: profile.preferred_salary_range || null,
        open_to_work: profile.open_to_work,
        preferred_locations: profile.preferred_locations,
        areas_of_expertise: profile.areas_of_expertise,
        career_interests: profile.career_interests,
        profile_photo_url: cleanUrl(profile.profile_photo_url),
        profile_completion: completion,
      }).eq("id", userId);
      if (profileError) throw profileError;

      // Sync relational tables while preserving server-verified flags on skills & certifications
      const syncTable = async (table: "experiences" | "educations" | "projects" | "courses" | "achievements" | "volunteer_experiences", items: any[]) => {
        await supabase.from(table).delete().eq("user_id", userId!);
        if (items.length > 0) {
          const rows = items.map(({ id, created_at, project_url, url, ...rest }: any) => ({
            ...rest,
            ...(table === "projects" ? { project_url: cleanUrl(project_url) } : {}),
            user_id: userId,
          }));
          const { error } = await supabase.from(table).insert(rows as any);
          if (error) throw error;
        }
      };

      const syncSkills = async () => {
        const seen = new Set<string>();
        const deduped = skills.filter((s) => {
          const k = String(s.skill_name || "").trim().toLowerCase();
          if (!k || seen.has(k)) return false;
          seen.add(k);
          return true;
        });
        const { data: existing } = await supabase.from("skills").select("id, skill_name").eq("user_id", userId!);
        const existingMap = new Map((existing ?? []).map((r) => [r.skill_name.trim().toLowerCase(), r.id]));
        const toDelete = (existing ?? []).filter((r) => !seen.has(r.skill_name.trim().toLowerCase())).map((r) => r.id);
        if (toDelete.length > 0) await supabase.from("skills").delete().in("id", toDelete);
        for (const s of deduped) {
          const key = String(s.skill_name).trim().toLowerCase();
          const rowId = existingMap.get(key);
          const payload = {
            skill_name: String(s.skill_name).trim().slice(0, 80),
            category: s.category || null,
            proficiency_level: s.proficiency_level || null,
            years_of_experience: s.years_of_experience ? Number(s.years_of_experience) : null,
          };
          if (rowId) {
            const { error } = await supabase.from("skills").update(payload).eq("id", rowId);
            if (error) throw error;
          } else {
            const { error } = await supabase.from("skills").insert({ ...payload, user_id: userId });
            if (error) throw error;
          }
        }
      };

      const syncCerts = async () => {
        const seen = new Set<string>();
        const deduped = certifications.filter((c) => {
          const k = String(c.name || "").trim().toLowerCase();
          if (!k || seen.has(k)) return false;
          seen.add(k);
          return true;
        });
        const { data: existing } = await supabase.from("certifications").select("id, name").eq("user_id", userId!);
        const existingMap = new Map((existing ?? []).map((r) => [r.name.trim().toLowerCase(), r.id]));
        const toDelete = (existing ?? []).filter((r) => !seen.has(r.name.trim().toLowerCase())).map((r) => r.id);
        if (toDelete.length > 0) await supabase.from("certifications").delete().in("id", toDelete);
        for (const c of deduped) {
          const key = String(c.name).trim().toLowerCase();
          const rowId = existingMap.get(key);
          const payload = {
            name: String(c.name).trim().slice(0, 200),
            issuing_organization: c.issuing_organization || null,
            issue_date: c.issue_date || null,
            expiry_date: c.expiry_date || null,
            credential_id: c.credential_id || null,
            credential_url: cleanUrl(c.credential_url),
          };
          if (rowId) {
            const { error } = await supabase.from("certifications").update(payload).eq("id", rowId);
            if (error) throw error;
          } else {
            const { error } = await supabase.from("certifications").insert({ ...payload, user_id: userId });
            if (error) throw error;
          }
        }
      };

      await Promise.all([
        syncTable("experiences", experiences),
        syncTable("educations", educations),
        syncSkills(),
        syncCerts(),
        syncTable("projects", projects),
        syncTable("courses", courses),
        syncTable("achievements", achievements),
        syncTable("volunteer_experiences", volunteer),
      ]);

      toast.success("Profile saved successfully!");
      navigate("/my-profile");
    } catch (err: any) {
      toast.error(err.message || "Failed to save profile");
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
    { label: "Photo", done: !!profile.profile_photo_url },
    { label: "Basic Info", done: isBasicComplete },
    { label: "About", done: isAboutComplete },
    { label: "Career Prefs", done: isCareerComplete },
    { label: "Experience", done: isExpComplete },
    { label: "Education", done: isEduComplete },
    { label: "Skills (3+)", done: isSkillsComplete },
    { label: "Certifications", done: isCertComplete },
    { label: "Projects", done: isProjectsComplete },
    { label: "Courses", done: isCoursesComplete },
    { label: "Achievements", done: isAchievementsComplete },
    { label: "Volunteer", done: isVolunteerComplete },
    { label: "Links", done: isLinksComplete },
  ];

  return (
    <>
      <Helmet><title>Build Your Profile | IAmTalento</title></Helmet>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-20 border-b bg-card/80 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2">
                <img src={siteLogo.url} alt="I Am Talento" className="h-10 w-auto object-contain" />
              </Link>
              <div className="h-5 w-px bg-border" />
              <span className="text-sm font-medium text-muted-foreground">Profile Builder</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleSave} disabled={saving} className="gap-1.5 h-8 text-xs">
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="h-8 text-xs text-muted-foreground">
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-[1fr_280px] gap-8">
            <div className="space-y-4">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <h1 className="text-2xl font-bold font-display mb-1">Build Your Profile</h1>
                <p className="text-sm text-muted-foreground">Complete each section to increase your Industry Readiness Score.</p>
              </motion.div>

              <ProfileSection title="Profile Photo" icon={<Camera className="h-5 w-5" />} isComplete={!!profile.profile_photo_url} defaultOpen>
                <ProfilePhotoSection photoUrl={profile.profile_photo_url || ""} userId={userId || ""} fullName={profile.full_name || ""} onChange={updateProfile} />
              </ProfileSection>

              <ProfileSection title="Basic Information" icon={<User className="h-5 w-5" />} isComplete={isBasicComplete} defaultOpen>
                <BasicInfoSection data={profile as any} onChange={updateProfile} />
              </ProfileSection>

              <ProfileSection title="About & Objective" icon={<FileText className="h-5 w-5" />} isComplete={isAboutComplete}>
                <AboutSection summary={profile.about_summary || ""} objective={profile.career_objective || ""} achievements={profile.key_achievements || ""} onChange={updateProfile} />
              </ProfileSection>

              <ProfileSection title="Career Preferences" icon={<Settings2 className="h-5 w-5" />} isComplete={isCareerComplete}>
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
                <ProjectsSection projects={projects} onChange={setProjects} />
              </ProfileSection>

              <ProfileSection title="Courses & Learning" icon={<BookOpen className="h-5 w-5" />} isComplete={isCoursesComplete}>
                <CoursesSection courses={courses} onChange={setCourses} />
              </ProfileSection>

              <ProfileSection title="Achievements & Awards" icon={<Trophy className="h-5 w-5" />} isComplete={isAchievementsComplete}>
                <AchievementsSection achievements={achievements} onChange={setAchievements} />
              </ProfileSection>

              <ProfileSection title="Volunteer Experience" icon={<Heart className="h-5 w-5" />} isComplete={isVolunteerComplete}>
                <VolunteerSection volunteer={volunteer} onChange={setVolunteer} />
              </ProfileSection>

              <ProfileSection title="Links & Portfolio" icon={<Link2 className="h-5 w-5" />} isComplete={isLinksComplete}>
                <LinksSection data={profile as any} onChange={updateProfile} />
              </ProfileSection>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <Button onClick={handleSave} disabled={saving} className="w-full h-11 gap-2" size="lg">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {saving ? "Saving Profile..." : "Save Profile"}
                </Button>
              </motion.div>
            </div>

            <div className="hidden lg:block">
              <div className="sticky top-20 space-y-6">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border bg-card p-6 flex flex-col items-center">
                  <CompletionRing percentage={completion} />
                  <p className="text-sm font-semibold font-display mt-4">Profile Completion</p>
                  <p className="text-xs text-muted-foreground mt-1 text-center">
                    {completion < 50 ? "Keep going! Complete more sections." : completion < 100 ? "Almost there! A few more details." : "Your profile is complete! 🎉"}
                  </p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="rounded-2xl border bg-card p-5">
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

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="rounded-2xl border bg-accent/30 p-5">
                  <p className="text-xs font-semibold font-display mb-1">💡 Pro Tip</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Profiles with 100% completion get 3x more visibility to employers. Add certifications, projects, and at least 3 skills.
                  </p>
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
