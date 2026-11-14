import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import {
  Award,
  BriefcaseBusiness,
  CheckCircle2,
  Code2,
  Crown,
  ExternalLink,
  Github,
  Globe,
  GraduationCap,
  Heart,
  Languages,
  Linkedin,
  MapPin,
  Palette,
  Share2,
  Sparkles,
  Trophy,
  UserRound,
  Video,
  Wrench,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAsync } from "@/hooks/useAsync";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchPublicPortfolio,
  loadFullLiveProfile,
  normalizeLiveProfile,
  resolvePublicBannerFromStorage,
} from "@/services/candidate/profile";
import { FormattedDescription } from "@/components/profile/CharCount";
import {
  buildSmartHighlights,
  formatExperiencePeriod,
  formatLocationDisplay,
  formatPlaceName,
  formatSmartTag,
  isTechnicalProfile,
  pickDomainIcon,
} from "@/components/profile/profileFormatters";
import { cn } from "@/lib/utils";
import defaultCover from "@/assets/profile-office-cover.jpg";
import cloudProject from "@/assets/profile-cloudsync.jpg";
import parserProject from "@/assets/profile-resume-parser.jpg";
import "@/components/profile/demo-profile.css";

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

async function loadEnrichedPublicPortfolio(slug: string): Promise<Record<string, any> | null> {
  const base = await fetchPublicPortfolio(slug);
  if (!base) return null;

  const enriched: Record<string, any> = { ...base };
  let ownerResetBanner = false;

  // If the signed-in user is viewing their own public portfolio handle, enrich any fields
  // that an unmigrated remote `get_public_portfolio` RPC might omit (never exposing email/phone).
  try {
    const sessionRes = await supabase.auth?.getSession?.();
    if (sessionRes?.data?.session?.user) {
      const live = await loadFullLiveProfile();
      if (live && (live.profile.portfolio_slug || "").toLowerCase() === slug.toLowerCase()) {
        const n = normalizeLiveProfile(live);
        ownerResetBanner = Boolean(n.shellState?.arjun_profile_v1?.banner_reset);
        enriched.banner = ownerResetBanner ? "" : n.bannerPhotoUrl || enriched.banner || "";
        enriched.photo = n.profilePhotoUrl || enriched.photo;
        enriched.sub_headline = n.subHeadline || enriched.sub_headline;
        enriched.state = n.state || enriched.state;
        enriched.country = n.country || enriched.country;
        enriched.open_for_freelance = n.openForFreelance ?? enriched.open_for_freelance;
        if (n.focusBadges.length > 0) enriched.focus_badges = n.focusBadges;
        if (n.expertiseCards.length > 0) enriched.expertise_cards = n.expertiseCards;
        if (n.tools.length > 0) enriched.tools = n.tools;
        if (n.hobbies.length > 0) enriched.hobbies = n.hobbies;
        if (n.interests.length > 0) enriched.interests = n.interests;
        if (n.experiences.length > 0) enriched.experiences = n.experiences;
        if (n.projects.length > 0) enriched.projects = n.projects;
        if (n.educations.length > 0) enriched.educations = n.educations;
        if (n.certifications.length > 0) enriched.certifications = n.certifications;
        if (n.awards.length > 0) enriched.awards = n.awards;
        if (n.languages.length > 0) enriched.languages = n.languages;
        enriched.video_intro_url = n.videoIntroUrl || enriched.video_intro_url;
        enriched.video_pitch = n.videoPitch || enriched.video_pitch;
        enriched.kaggle = n.kaggleUrl || enriched.kaggle;
        enriched.behance = n.behanceUrl || enriched.behance;
      }
    }
  } catch {
    /* Anonymous viewer or session check unavailable */
  }

  // Storage fallback for unmigrated remote `get_public_portfolio` RPCs when banner is absent
  if (!enriched.banner && !ownerResetBanner && enriched.photo) {
    const storageBanner = await resolvePublicBannerFromStorage(enriched.photo);
    if (storageBanner) enriched.banner = storageBanner;
  }

  return enriched;
}

const PublicPortfolio: React.FC = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const { data, loading, error } = useAsync(() => loadEnrichedPublicPortfolio(slug), [slug]);
  const [activeTab, setActiveTab] = useState("about-me");
  const [videoOpen, setVideoOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const tabs = [
    { label: "About Me", id: "about-me", show: true },
    { label: "Work Experience", id: "experience", show: Array.isArray(data?.experiences) && data.experiences.length > 0 },
    { label: "Skills", id: "skills", show: Array.isArray(data?.skills) && data.skills.length > 0 },
    { label: "Tools", id: "tools", show: Array.isArray(data?.tools) && data.tools.length > 0 },
    { label: "Projects", id: "projects", show: Array.isArray(data?.projects) && data.projects.length > 0 },
    { label: "Education", id: "education", show: Array.isArray(data?.educations) && data.educations.length > 0 },
    { label: "Certifications", id: "certifications", show: Array.isArray(data?.certifications) && data.certifications.length > 0 },
    { label: "Awards", id: "awards", show: Array.isArray(data?.awards) && data.awards.length > 0 },
    { label: "Languages", id: "languages", show: Array.isArray(data?.languages) && data.languages.length > 0 },
    { label: "Hobbies", id: "hobbies", show: Array.isArray(data?.hobbies) && data.hobbies.length > 0 },
    { label: "Interests", id: "interests", show: Array.isArray(data?.interests) && data.interests.length > 0 },
  ].filter((t) => t.show);

  useEffect(() => {
    if (!data || typeof window === "undefined") return;
    const navEl = navRef.current;
    if (!navEl) return;

    const supportsScrollTargetGroup =
      typeof CSS !== "undefined" && typeof CSS.supports === "function" && CSS.supports("scroll-target-group: auto");

    if (supportsScrollTargetGroup) {
      const syncAria = () => {
        const currentLink = navEl.querySelector("a:target-current");
        navEl.querySelectorAll("a").forEach((link) => {
          const isMatch = link === currentLink;
          link.setAttribute("aria-current", isMatch ? "true" : "false");
          if (isMatch) {
            const href = link.getAttribute("href") || "";
            if (href.startsWith("#")) setActiveTab(href.slice(1));
          }
        });
      };
      syncAria();
      document.addEventListener("scrollend", syncAria);
      return () => document.removeEventListener("scrollend", syncAria);
    }

    const sectionEls = tabs
      .map((t) => document.getElementById(t.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (sectionEls.length === 0 || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            if (id) setActiveTab(id);
          }
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );
    sectionEls.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [data, tabs.length]);

  const scrollTo = (tabId: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
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

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Portfolio link copied!");
    } catch {
      toast.error("Could not copy link.");
    }
  };

  const locationStr = data ? formatLocationDisplay(data.city, data.state, data.country) : "";
  const domainContext = `${data?.industry || ""} ${data?.headline || ""} ${data?.sub_headline || ""}`;

  const initials = (data?.name || "T")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const rawBadges: string[] =
    Array.isArray(data?.focus_badges) && data.focus_badges.length > 0
      ? data.focus_badges
      : Array.isArray(data?.areas_of_expertise) && data.areas_of_expertise.length > 0
        ? data.areas_of_expertise
        : [
            data?.industry,
            ...(Array.isArray(data?.skills) ? data.skills.slice(0, 4).map((s: any) => s.name) : []),
          ].filter(Boolean);

  const focusBadges = Array.from(new Set(rawBadges.map((b) => formatSmartTag(b)).filter(Boolean)));

  const expertiseCards = data
    ? buildSmartHighlights({
        expertiseCards: data.expertise_cards,
        headline: data.headline,
        industry: data.industry,
        skills: data.skills,
        tools: data.tools,
        experiences: data.experiences,
        openToWork: data.open_to_work,
        verified: data.verified,
        cir: data.cir,
      })
    : [];

  const SkillsHeadingIcon = isTechnicalProfile(data?.industry, data?.headline) ? Code2 : Sparkles;
  const ytEmbed = data?.video_intro_url ? toYoutubeEmbedUrl(data.video_intro_url) : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF4EB] text-foreground">
      <Helmet>
        <title>
          {data?.name ? `${data.name} · Verified Portfolio | IAmTalento` : "Candidate Portfolio | IAmTalento"}
        </title>
      </Helmet>
      <Navbar />
      <main className="flex-1 pt-20">
        {loading ? (
          <div className="container py-16">
            <div className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
              Loading verified portfolio…
            </div>
          </div>
        ) : error || !data ? (
          <div className="container py-16">
            <div className="rounded-2xl border border-border bg-card p-10 text-center space-y-3">
              <h1 className="text-xl font-bold">Portfolio unavailable</h1>
              <p className="text-sm text-muted-foreground">
                This portfolio handle does not exist or its owner has set their profile visibility to private.
              </p>
              <Button asChild variant="outline">
                <Link to="/jobs">Browse Open Roles</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="demo-dashboard dp-standalone dp-live-profile">
            <div className="container py-7 pb-16">
              {/* ===== HERO OVERVIEW CARD ===== */}
              <section id="overview" className="dp-overview">
                <div className="dp-cover">
                  <img
                    src={data.banner || defaultCover}
                    width={1920}
                    height={512}
                    {...({ fetchpriority: "high" } as React.ImgHTMLAttributes<HTMLImageElement>)}
                    alt={`${data.name || "Candidate"} cover banner`}
                  />
                </div>

                <div className="dp-identity">
                  <div className="dp-person">
                    <div className="dp-avatar">
                      {data.photo ? (
                        <img src={data.photo} width={146} height={146} alt={data.name || "Candidate"} />
                      ) : (
                        <div className="dp-avatar-initials" aria-hidden="true">
                          {initials}
                        </div>
                      )}
                      <span aria-hidden="true" />
                    </div>

                    <div className="dp-name">
                      <div className="dp-name-line">
                        <h1>{data.name || "Verified Candidate"}</h1>
                        {data.verified && <CheckCircle2 size={22} className="text-primary fill-primary/15" />}
                        <span className="dp-talent">
                          <Crown size={12} />
                          {data.cir
                            ? `CIR ${Math.round(Number(data.cir.score))}/100 · ${data.cir.tier}`
                            : "Verified Talent"}
                        </span>
                      </div>

                      {data.headline && <p className="dp-designation">{data.headline}</p>}
                      {(data.sub_headline || data.industry) && (
                        <p className="dp-specialty">{data.sub_headline || data.industry}</p>
                      )}

                      <div className="dp-contact-details">
                        {locationStr && (
                          <span>
                            <MapPin /> {locationStr}
                          </span>
                        )}
                        {data.website && (
                          <a href={data.website} target="_blank" rel="noreferrer">
                            <Globe /> {data.website.replace(/^https?:\/\//, "")}
                          </a>
                        )}
                        {data.linkedin && (
                          <a href={data.linkedin} target="_blank" rel="noreferrer">
                            <Linkedin /> LinkedIn
                          </a>
                        )}
                        {data.github && (
                          <a href={data.github} target="_blank" rel="noreferrer">
                            <Github /> GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {data.about && (
                    <div className="dp-intro">
                      <FormattedDescription text={data.about} />
                    </div>
                  )}

                  {focusBadges.length > 0 && (
                    <div className="dp-badges">
                      {focusBadges.slice(0, 6).map((label, idx) => {
                        const { icon: BIcon, tone } = pickDomainIcon(label, domainContext, idx);
                        return (
                          <span key={label}>
                            <i className={`dp-tone-${tone}`}>
                              <BIcon size={15} />
                            </i>
                            {label}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="dp-summary">
                  <div className="dp-candidate-actions">
                    {data.open_to_work && (
                      <Button type="button" variant="outline" className="dp-status pointer-events-none">
                        <span className="dp-status-dot" />
                        Open to Work
                      </Button>
                    )}
                    {data.open_for_freelance && (
                      <Button type="button" variant="outline" className="dp-status pointer-events-none">
                        <span className="dp-status-dot" />
                        Open for Freelancing
                      </Button>
                    )}
                    {(data.video_intro_url || data.video_pitch) && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setVideoOpen(true)}
                        className="cursor-pointer gap-2 border-primary/30 text-primary"
                      >
                        <Video size={16} /> Video Resume
                      </Button>
                    )}
                    <Button type="button" variant="outline" onClick={handleShare} className="cursor-pointer gap-2">
                      <Share2 size={16} /> Share Portfolio
                    </Button>
                  </div>
                </div>
              </section>

              {/* ===== STICKY TABS + SECTIONS ===== */}
              <div className="dp-columns">
                <div className="dp-content-column">
                  <nav ref={navRef} className="dp-tabs dp-live-tabs" aria-label="Portfolio sections">
                    {tabs.map((t) => {
                      const isActive = activeTab === t.id;
                      return (
                        <a
                          key={t.id}
                          href={`#${t.id}`}
                          aria-current={isActive ? "true" : "false"}
                          className={cn(isActive && "target-current")}
                          onClick={(e) => scrollTo(t.id, e)}
                        >
                          {t.label}
                        </a>
                      );
                    })}
                  </nav>

                  {/* ABOUT ME */}
                  <section id="about-me" tabIndex={-1} className="dp-panel">
                    <div className="dp-panel-heading">
                      <h2>
                        <UserRound size={20} /> About Me
                      </h2>
                    </div>
                    <FormattedDescription
                      text={data.about || `${data.name || "Candidate"} is a verified member of the IAmTalento network.`}
                    />
                    <div className="dp-expertise">
                      {expertiseCards.map((c, idx) => {
                        const { icon: EIcon, tone } = pickDomainIcon(`${c.title} ${c.sub}`, domainContext, idx);
                        return (
                          <div key={idx}>
                            <i className={`dp-tone-${tone}`}>
                              <EIcon size={24} />
                            </i>
                            <span className="min-w-0">
                              <strong className="break-words">{c.title}</strong>
                              <span className="break-words">{c.sub}</span>
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* WORK EXPERIENCE */}
                  {Array.isArray(data.experiences) && data.experiences.length > 0 && (
                    <section id="experience" tabIndex={-1} className="dp-panel">
                      <div className="dp-panel-heading">
                        <h2>
                          <BriefcaseBusiness size={20} /> Work Experience
                        </h2>
                      </div>
                      <div className="dp-timeline">
                        {data.experiences.map((exp: any, idx: number) => {
                          const tones = ["blue", "red", "violet", "green"] as const;
                          const tone = tones[idx % tones.length];
                          const periodLabel = formatExperiencePeriod(exp.start, exp.end);
                          const expLoc = formatPlaceName(exp.location);
                          return (
                            <article key={idx}>
                              <div className={`dp-company-symbol dp-tone-${tone}`}>
                                {(exp.company || "C").charAt(0).toUpperCase()}
                              </div>
                              <div className="dp-job">
                                <div className="dp-job-heading">
                                  <h3>{exp.title}</h3>
                                  {(periodLabel || expLoc) && (
                                    <span>
                                      {periodLabel}
                                      {periodLabel && expLoc && <span className="dp-separator">|</span>}
                                      {expLoc}
                                    </span>
                                  )}
                                </div>
                                <p className="font-medium text-foreground/85 mb-1.5">{exp.company}</p>
                                {exp.description && <FormattedDescription text={exp.description} />}
                                {Array.isArray(exp.tools) && exp.tools.length > 0 && (
                                  <div className="dp-chips">
                                    {exp.tools.map((t: string) => (
                                      <span key={t}>{formatSmartTag(t)}</span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </section>
                  )}

                  {/* SKILLS */}
                  {Array.isArray(data.skills) && data.skills.length > 0 && (
                    <section id="skills" tabIndex={-1} className="dp-panel">
                      <div className="dp-panel-heading">
                        <h2>
                          <SkillsHeadingIcon size={20} /> Skills
                        </h2>
                      </div>
                      <div className="dp-skill-list">
                        {data.skills.map((s: any, idx: number) => {
                          const { icon: SIcon, tone } = pickDomainIcon(s.name, domainContext, idx);
                          const lvl = s.level
                            ? String(s.level).charAt(0).toUpperCase() + String(s.level).slice(1)
                            : "Intermediate";
                          return (
                            <article key={s.name}>
                              <i className={`dp-tone-${tone}`}>
                                <SIcon size={20} />
                              </i>
                              <div className="min-w-0">
                                <h3 className="break-words">{formatSmartTag(s.name)}</h3>
                                <p>{lvl}</p>
                              </div>
                              {s.verified && (
                                <span className="dp-verified">
                                  <CheckCircle2 size={13} /> Verified
                                </span>
                              )}
                            </article>
                          );
                        })}
                      </div>
                    </section>
                  )}

                  {/* TOOLS */}
                  {Array.isArray(data.tools) && data.tools.length > 0 && (
                    <section id="tools" tabIndex={-1} className="dp-panel">
                      <div className="dp-panel-heading">
                        <h2>
                          <Wrench size={20} /> Tools &amp; Platforms
                        </h2>
                      </div>
                      <div className="dp-chips">
                        {data.tools.map((t: string) => (
                          <span key={t}>{formatSmartTag(t)}</span>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* PROJECTS */}
                  {Array.isArray(data.projects) && data.projects.length > 0 && (
                    <section id="projects" tabIndex={-1} className="dp-panel">
                      <div className="dp-panel-heading">
                        <h2>
                          <Sparkles size={20} /> Projects &amp; Case Studies
                        </h2>
                      </div>
                      <div className="dp-projects">
                        {data.projects.map((p: any, idx: number) => {
                          const imgSrc = p.image_url || (idx % 2 === 0 ? cloudProject : parserProject);
                          return (
                            <article key={idx}>
                              <img src={imgSrc} loading="lazy" alt={`${p.title} screenshot`} />
                              <h3>{p.title}</h3>
                              {p.role && <p className="text-xs font-medium text-primary/80 mb-1">{p.role}</p>}
                              {p.description && <FormattedDescription text={p.description} />}
                              {p.impact && (
                                <p className="text-xs font-medium text-foreground/80 mt-2">
                                  Impact: {p.impact}
                                </p>
                              )}
                              {Array.isArray(p.tools) && p.tools.length > 0 && (
                                <div className="dp-chips">
                                  {p.tools.map((t: string) => (
                                    <span key={t}>{formatSmartTag(t)}</span>
                                  ))}
                                </div>
                              )}
                              <div className="dp-project-links">
                                {p.url && (
                                  <a href={p.url} target="_blank" rel="noreferrer">
                                    <ExternalLink size={14} /> Live Link
                                  </a>
                                )}
                                {p.github_url && (
                                  <a href={p.github_url} target="_blank" rel="noreferrer">
                                    <Github size={14} /> Source
                                  </a>
                                )}
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </section>
                  )}

                  {/* EDUCATION + CERTIFICATIONS */}
                  {((Array.isArray(data.educations) && data.educations.length > 0) ||
                    (Array.isArray(data.certifications) && data.certifications.length > 0)) && (
                    <div className="dp-lower-grid">
                      {Array.isArray(data.educations) && data.educations.length > 0 && (
                        <section id="education" tabIndex={-1} className="dp-panel">
                          <div className="dp-panel-heading">
                            <h2>
                              <GraduationCap size={20} /> Education
                            </h2>
                          </div>
                          <div className="dp-education">
                            {data.educations.map((ed: any, idx: number) => {
                              const yrs = [ed.start_year, ed.year].filter(Boolean).join(" – ");
                              return (
                                <article key={idx}>
                                  <div className="dp-school dp-tone-blue">
                                    <GraduationCap size={22} />
                                  </div>
                                  <div className="min-w-0">
                                    <h3 className="break-words">{ed.institution}</h3>
                                    <p>
                                      {ed.degree}
                                      {ed.field_of_study ? ` · ${ed.field_of_study}` : ""}
                                    </p>
                                    {(yrs || ed.grade) && (
                                      <p className="dp-muted">
                                        {yrs}
                                        {yrs && ed.grade ? " · " : ""}
                                        {ed.grade}
                                      </p>
                                    )}
                                  </div>
                                </article>
                              );
                            })}
                          </div>
                        </section>
                      )}

                      {Array.isArray(data.certifications) && data.certifications.length > 0 && (
                        <section id="certifications" tabIndex={-1} className="dp-panel">
                          <div className="dp-panel-heading">
                            <h2>
                              <Award size={20} /> Certifications
                            </h2>
                          </div>
                          <div className="dp-certifications">
                            {data.certifications.map((c: any, idx: number) => (
                              <article key={idx}>
                                <div className="dp-school dp-tone-green">
                                  <Award size={20} />
                                </div>
                                <div className="min-w-0">
                                  <h3 className="break-words">{c.name}</h3>
                                  {c.issuer && <p>{c.issuer}</p>}
                                  <div className="dp-cert-date">
                                    <span>{c.date ? String(c.date).slice(0, 4) : "Issued"}</span>
                                    {c.verified && (
                                      <span className="dp-verified">
                                        <CheckCircle2 size={13} /> Verified
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </article>
                            ))}
                          </div>
                        </section>
                      )}
                    </div>
                  )}

                  {/* AWARDS */}
                  {Array.isArray(data.awards) && data.awards.length > 0 && (
                    <section id="awards" tabIndex={-1} className="dp-panel">
                      <div className="dp-panel-heading">
                        <h2>
                          <Trophy size={20} /> Awards &amp; Achievements
                        </h2>
                      </div>
                      <div className="dp-awards">
                        {data.awards.map((a: any, idx: number) => (
                          <article key={idx}>
                            <i className="dp-tone-violet">
                              <Trophy size={20} />
                            </i>
                            <div className="min-w-0">
                              <h3 className="break-words">{a.title}</h3>
                              <p className="break-words">
                                {[a.organization, a.description].filter(Boolean).join(" · ")}
                              </p>
                            </div>
                          </article>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* LANGUAGES */}
                  {Array.isArray(data.languages) && data.languages.length > 0 && (
                    <section id="languages" tabIndex={-1} className="dp-panel">
                      <div className="dp-panel-heading">
                        <h2>
                          <Languages size={20} /> Languages
                        </h2>
                      </div>
                      <div className="dp-chips">
                        {data.languages.map((l: any) => (
                          <span key={l.name}>
                            {formatSmartTag(l.name)}
                            {l.level ? ` — ${l.level}` : ""}
                          </span>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* HOBBIES */}
                  {Array.isArray(data.hobbies) && data.hobbies.length > 0 && (
                    <section id="hobbies" tabIndex={-1} className="dp-panel">
                      <div className="dp-panel-heading">
                        <h2>
                          <Heart size={20} /> Hobbies
                        </h2>
                      </div>
                      <div className="dp-chips">
                        {data.hobbies.map((h: string) => (
                          <span key={h}>{formatSmartTag(h)}</span>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* INTERESTS */}
                  {Array.isArray(data.interests) && data.interests.length > 0 && (
                    <section id="interests" tabIndex={-1} className="dp-panel">
                      <div className="dp-panel-heading">
                        <h2>
                          <Sparkles size={20} /> Interests
                        </h2>
                      </div>
                      <div className="dp-chips">
                        {data.interests.map((it: string) => (
                          <span key={it}>{formatSmartTag(it)}</span>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              </div>

              {/* EXTERNAL LINKS FOOTER */}
              <footer id="links" className="dp-profile-links">
                {data.linkedin && (
                  <a href={data.linkedin} target="_blank" rel="noreferrer">
                    <Linkedin size={16} /> LinkedIn
                  </a>
                )}
                {data.github && (
                  <a href={data.github} target="_blank" rel="noreferrer">
                    <Github size={16} /> GitHub
                  </a>
                )}
                {data.website && (
                  <a href={data.website} target="_blank" rel="noreferrer">
                    <Globe size={16} /> Portfolio
                  </a>
                )}
                {data.kaggle && (
                  <a href={data.kaggle} target="_blank" rel="noreferrer">
                    <Award size={16} /> Kaggle
                  </a>
                )}
                {data.behance && (
                  <a href={data.behance} target="_blank" rel="noreferrer">
                    <Palette size={16} /> Behance
                  </a>
                )}
                <span>Verified Portfolio · /u/{slug}</span>
              </footer>
            </div>

            {/* VIDEO RESUME DIALOG */}
            <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{data.name || "Candidate"} — Video Resume</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {data.video_intro_url && (
                    <div className="aspect-video rounded-xl overflow-hidden bg-black">
                      {ytEmbed ? (
                        <iframe
                          src={ytEmbed}
                          title="Candidate video resume"
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video src={data.video_intro_url} controls className="w-full h-full object-contain" />
                      )}
                    </div>
                  )}
                  {data.video_pitch && (
                    <div className="rounded-xl border p-4 bg-muted/30">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        Pitch Summary
                      </p>
                      <p className="text-sm leading-relaxed whitespace-pre-line">{data.video_pitch}</p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PublicPortfolio;
