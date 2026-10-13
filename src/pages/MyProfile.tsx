import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Zap, Loader2, MapPin, Briefcase, GraduationCap, Code2,
  Award, FolderKanban, BookOpen, Trophy, Heart, Link2,
  ExternalLink, Calendar, Building2, Pencil, LogOut,
  ClipboardCheck, Search, Mail, Phone, Globe, Github,
  Linkedin, ChevronRight, Shield, Star,
} from "lucide-react";

const SectionCard = ({ title, icon, children, delay = 0 }: { title: string; icon: React.ReactNode; children: React.ReactNode; delay?: number }) => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="rounded-2xl border bg-card overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-4 border-b bg-muted/30">
      <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">{icon}</div>
      <h2 className="text-sm font-bold font-display">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </motion.div>
);

const MyProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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

  const initials = (profile.full_name || "")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const locationParts = [profile.city, profile.state, profile.country].filter(Boolean);
  const proficiencyOrder: Record<string, number> = { Expert: 0, Advanced: 1, Intermediate: 2, Beginner: 3 };
  const sortedSkills = [...skills].sort((a, b) => (proficiencyOrder[a.proficiency_level] ?? 4) - (proficiencyOrder[b.proficiency_level] ?? 4));
  const groupedSkills: Record<string, any[]> = sortedSkills.reduce((acc: Record<string, any[]>, s) => {
    const cat = s.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  const formatDate = (d: string | null) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  return (
    <>
      <Helmet>
        <title>{profile.full_name ? `${profile.full_name} — IAmTalento` : "My Profile — IAmTalento"}</title>
        <meta name="description" content={profile.professional_headline || "View your verified professional profile on IAmTalento."} />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Sticky CTA Banner */}
        <div className="sticky top-0 z-30 bg-card/90 backdrop-blur-md border-b">
          <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-2.5 gap-3">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="font-bold font-display text-xs hidden sm:inline">IAm<span className="text-primary">Talento</span></span>
            </Link>

            <div className="flex items-center gap-2">
              <Link to="/assessments">
                <Button size="sm" className="h-8 text-xs gap-1.5 bg-primary hover:bg-primary/90">
                  <ClipboardCheck className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Take Assessments</span>
                  <span className="sm:hidden">Assess</span>
                </Button>
              </Link>
              <Link to="/jobs">
                <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5">
                  <Search className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Browse Jobs</span>
                  <span className="sm:hidden">Jobs</span>
                </Button>
              </Link>
              <div className="h-5 w-px bg-border hidden sm:block" />
              <Link to="/profile">
                <Button size="sm" variant="ghost" className="h-8 text-xs gap-1.5 text-muted-foreground">
                  <Pencil className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
              </Link>
              <Button size="sm" variant="ghost" onClick={handleSignOut} className="h-8 text-xs text-muted-foreground">
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* ===== PROFILE HEADER (Cover + Avatar + Info) ===== */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border bg-card overflow-hidden mb-6">
            {/* Cover header */}
            <div className="h-32 sm:h-40 bg-[#0d5cb2]/10 relative" />

            <div className="px-6 pb-6 -mt-14 sm:-mt-16 relative">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
                <Avatar className="h-28 w-28 sm:h-32 sm:w-32 ring-4 ring-card shadow-lg">
                  <AvatarImage src={profile.profile_photo_url || ""} alt={profile.full_name} />
                  <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">{initials || "?"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 pt-2 sm:pt-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold font-display">{profile.full_name || "Your Name"}</h1>
                      <p className="text-sm text-muted-foreground mt-0.5">{profile.professional_headline || profile.job_role || "Add a professional headline"}</p>
                      {locationParts.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{locationParts.join(", ")}</span>
                        </div>
                      )}
                      {profile.company && (
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                          <Building2 className="h-3 w-3" />
                          <span>{profile.company}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick stats */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {profile.open_to_work && <Badge className="bg-success/10 text-success border-success/20 text-[10px]">Open to Work</Badge>}
                    {profile.experience_level && <Badge variant="secondary" className="text-[10px]">{profile.experience_level}</Badge>}
                    {profile.industry && <Badge variant="outline" className="text-[10px]">{profile.industry}</Badge>}
                    {profile.verification_status === "verified" && (
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] gap-1"><Shield className="h-2.5 w-2.5" />Verified</Badge>
                    )}
                    {(profile.industry_readiness_score ?? 0) > 0 && (
                      <Badge className="bg-warning/10 text-warning border-warning/20 text-[10px] gap-1"><Star className="h-2.5 w-2.5" />IRS: {profile.industry_readiness_score}</Badge>
                    )}
                  </div>

                  {/* Contact row */}
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted-foreground">
                    {profile.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{profile.email}</span>}
                    {profile.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{profile.phone}</span>}
                    {profile.iam_talento_id && <span className="flex items-center gap-1 font-mono text-primary"><Zap className="h-3 w-3" />{profile.iam_talento_id}</span>}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-[1fr_300px] gap-6">
            {/* ===== LEFT COLUMN ===== */}
            <div className="space-y-6">
              {/* About */}
              {profile.about_summary && (
                <SectionCard title="About" icon={<Zap className="h-4 w-4" />} delay={0.05}>
                  <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{profile.about_summary}</p>
                  {profile.career_objective && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs font-semibold mb-1">Career Objective</p>
                      <p className="text-sm text-muted-foreground">{profile.career_objective}</p>
                    </div>
                  )}
                </SectionCard>
              )}

              {/* Experience */}
              {experiences.length > 0 && (
                <SectionCard title="Experience" icon={<Briefcase className="h-4 w-4" />} delay={0.1}>
                  <div className="space-y-5">
                    {experiences.map((exp, i) => (
                      <div key={i} className={i > 0 ? "pt-5 border-t" : ""}>
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                            <Building2 className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold">{exp.job_title}</h3>
                            <p className="text-xs text-muted-foreground">{exp.company_name}{exp.employment_type ? ` · ${exp.employment_type}` : ""}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {formatDate(exp.start_date)} — {exp.is_current ? "Present" : formatDate(exp.end_date)}
                              {exp.location ? ` · ${exp.location}` : ""}
                            </p>
                            {exp.description && <p className="text-xs text-muted-foreground mt-2 whitespace-pre-line">{exp.description}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}

              {/* Education */}
              {educations.length > 0 && (
                <SectionCard title="Education" icon={<GraduationCap className="h-4 w-4" />} delay={0.15}>
                  <div className="space-y-5">
                    {educations.map((edu, i) => (
                      <div key={i} className={i > 0 ? "pt-5 border-t" : ""}>
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                            <GraduationCap className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold">{edu.institution_name}</h3>
                            <p className="text-xs text-muted-foreground">{edu.degree}{edu.field_of_study ? ` — ${edu.field_of_study}` : ""}</p>
                            {(edu.start_year || edu.end_year) && (
                              <p className="text-xs text-muted-foreground mt-0.5">{edu.start_year || "?"} — {edu.end_year || "Present"}</p>
                            )}
                            {edu.grade && <p className="text-xs text-muted-foreground mt-0.5">Grade: {edu.grade}</p>}
                            {edu.description && <p className="text-xs text-muted-foreground mt-2">{edu.description}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}

              {/* Projects */}
              {projects.length > 0 && (
                <SectionCard title="Projects" icon={<FolderKanban className="h-4 w-4" />} delay={0.2}>
                  <div className="space-y-5">
                    {projects.map((proj, i) => (
                      <div key={i} className={i > 0 ? "pt-5 border-t" : ""}>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-semibold">{proj.title}</h3>
                            {proj.organization && <p className="text-xs text-muted-foreground">{proj.organization}{proj.role_in_project ? ` · ${proj.role_in_project}` : ""}</p>}
                            {(proj.start_date || proj.end_date) && (
                              <p className="text-xs text-muted-foreground mt-0.5">{formatDate(proj.start_date)} — {formatDate(proj.end_date) || "Present"}</p>
                            )}
                            {proj.description && <p className="text-xs text-muted-foreground mt-2">{proj.description}</p>}
                            {proj.impact && <p className="text-xs text-primary mt-1">Impact: {proj.impact}</p>}
                            {proj.tools_technologies?.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {proj.tools_technologies.map((t: string, j: number) => (
                                  <Badge key={j} variant="secondary" className="text-[10px]">{t}</Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          {proj.project_url && (
                            <a href={proj.project_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}

              {/* Certifications */}
              {certifications.length > 0 && (
                <SectionCard title="Certifications & Licenses" icon={<Award className="h-4 w-4" />} delay={0.25}>
                  <div className="space-y-4">
                    {certifications.map((cert, i) => (
                      <div key={i} className={`flex items-start gap-3 ${i > 0 ? "pt-4 border-t" : ""}`}>
                        <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Award className="h-5 w-5 text-warning" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold">{cert.name}</h3>
                          {cert.issuing_organization && <p className="text-xs text-muted-foreground">{cert.issuing_organization}</p>}
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                            {cert.issue_date && <span>Issued {formatDate(cert.issue_date)}</span>}
                            {cert.expiry_date && <span>· Expires {formatDate(cert.expiry_date)}</span>}
                          </div>
                          {cert.credential_id && <p className="text-[10px] text-muted-foreground mt-1 font-mono">ID: {cert.credential_id}</p>}
                          {cert.credential_url && (
                            <a href={cert.credential_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1">
                              Show credential <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}

              {/* Courses */}
              {courses.length > 0 && (
                <SectionCard title="Courses & Learning" icon={<BookOpen className="h-4 w-4" />} delay={0.3}>
                  <div className="space-y-3">
                    {courses.map((c, i) => (
                      <div key={i} className={`${i > 0 ? "pt-3 border-t" : ""}`}>
                        <h3 className="text-sm font-semibold">{c.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                          {c.platform && <span>{c.platform}</span>}
                          {c.completion_date && <span>· Completed {formatDate(c.completion_date)}</span>}
                        </div>
                        {c.skills_learned?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {c.skills_learned.map((s: string, j: number) => (
                              <Badge key={j} variant="outline" className="text-[10px]">{s}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}

              {/* Achievements */}
              {achievements.length > 0 && (
                <SectionCard title="Achievements & Awards" icon={<Trophy className="h-4 w-4" />} delay={0.35}>
                  <div className="space-y-3">
                    {achievements.map((a, i) => (
                      <div key={i} className={`${i > 0 ? "pt-3 border-t" : ""}`}>
                        <h3 className="text-sm font-semibold">{a.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                          {a.organization && <span>{a.organization}</span>}
                          {a.achievement_date && <span>· {formatDate(a.achievement_date)}</span>}
                        </div>
                        {a.description && <p className="text-xs text-muted-foreground mt-1">{a.description}</p>}
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}

              {/* Volunteer */}
              {volunteer.length > 0 && (
                <SectionCard title="Volunteer Experience" icon={<Heart className="h-4 w-4" />} delay={0.4}>
                  <div className="space-y-4">
                    {volunteer.map((v, i) => (
                      <div key={i} className={i > 0 ? "pt-4 border-t" : ""}>
                        <h3 className="text-sm font-semibold">{v.role || "Volunteer"}</h3>
                        <p className="text-xs text-muted-foreground">{v.organization}{v.cause ? ` · ${v.cause}` : ""}</p>
                        {(v.start_date || v.end_date) && (
                          <p className="text-xs text-muted-foreground mt-0.5">{formatDate(v.start_date)} — {formatDate(v.end_date) || "Present"}</p>
                        )}
                        {v.description && <p className="text-xs text-muted-foreground mt-1">{v.description}</p>}
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}
            </div>

            {/* ===== RIGHT SIDEBAR ===== */}
            <div className="space-y-6">
              {/* Next Steps Card */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border bg-card p-5">
                <h3 className="text-sm font-bold font-display mb-3">What's Next?</h3>
                <div className="space-y-2.5">
                  <Link to="/assessments" className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors group">
                    <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center shrink-0">
                      <ClipboardCheck className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold">Take Assessments</p>
                      <p className="text-[10px] text-muted-foreground">Prove your skills & boost your IRS</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Link>
                  <Link to="/jobs" className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group">
                    <div className="h-9 w-9 rounded-lg bg-foreground/10 flex items-center justify-center shrink-0">
                      <Search className="h-4 w-4 text-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold">Browse Jobs</p>
                      <p className="text-[10px] text-muted-foreground">Find roles matched to your profile</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Link>
                </div>
              </motion.div>

              {/* Skills */}
              {skills.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl border bg-card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Code2 className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-bold font-display">Skills</h3>
                  </div>
                  <div className="space-y-4">
                    {Object.entries(groupedSkills).map(([cat, catSkills]) => (
                      <div key={cat}>
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">{cat}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {catSkills.map((s: any, i: number) => (
                            <Badge
                              key={i}
                              variant={s.proficiency_level === "Expert" ? "default" : s.proficiency_level === "Advanced" ? "secondary" : "outline"}
                              className="text-[10px]"
                            >
                              {s.skill_name}
                              {s.is_verified && <Shield className="h-2.5 w-2.5 ml-0.5" />}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Career Preferences */}
              {(profile.employment_type || profile.availability_status || profile.notice_period) && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border bg-card p-5">
                  <h3 className="text-sm font-bold font-display mb-3">Career Preferences</h3>
                  <div className="space-y-2 text-xs">
                    {profile.employment_type && (
                      <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="font-medium">{profile.employment_type}</span></div>
                    )}
                    {profile.availability_status && (
                      <div className="flex justify-between"><span className="text-muted-foreground">Availability</span><span className="font-medium">{profile.availability_status}</span></div>
                    )}
                    {profile.notice_period && (
                      <div className="flex justify-between"><span className="text-muted-foreground">Notice</span><span className="font-medium">{profile.notice_period}</span></div>
                    )}
                    {profile.preferred_salary_range && (
                      <div className="flex justify-between"><span className="text-muted-foreground">Salary</span><span className="font-medium">{profile.preferred_salary_range}</span></div>
                    )}
                  </div>
                  {profile.preferred_locations?.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-[10px] text-muted-foreground mb-1.5">Preferred Locations</p>
                      <div className="flex flex-wrap gap-1">
                        {profile.preferred_locations.map((loc: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-[10px]">{loc}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Links & Portfolio */}
              {(profile.linkedin_url || profile.github_url || profile.portfolio_url || profile.behance_url || profile.kaggle_url) && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="rounded-2xl border bg-card p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Link2 className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-bold font-display">Links</h3>
                  </div>
                  <div className="space-y-2">
                    {profile.linkedin_url && (
                      <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors">
                        <Linkedin className="h-3.5 w-3.5" />LinkedIn
                      </a>
                    )}
                    {profile.github_url && (
                      <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors">
                        <Github className="h-3.5 w-3.5" />GitHub
                      </a>
                    )}
                    {profile.portfolio_url && (
                      <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors">
                        <Globe className="h-3.5 w-3.5" />Portfolio
                      </a>
                    )}
                    {profile.behance_url && (
                      <a href={profile.behance_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors">
                        <Globe className="h-3.5 w-3.5" />Behance
                      </a>
                    )}
                    {profile.kaggle_url && (
                      <a href={profile.kaggle_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors">
                        <Globe className="h-3.5 w-3.5" />Kaggle
                      </a>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Key Achievements highlight */}
              {profile.key_achievements && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border bg-accent/30 p-5">
                  <p className="text-xs font-semibold font-display mb-1">🏆 Key Achievements</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed whitespace-pre-line">{profile.key_achievements}</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyProfile;
