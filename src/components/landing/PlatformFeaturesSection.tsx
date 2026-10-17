import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target, Briefcase, GraduationCap, ArrowRight,
  BarChart3, Users, TrendingUp, BookOpen, Award, Zap,
  Code2, Mic, Trophy, Calendar, Headphones, Play, Radio, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SectionBadge from "@/components/ui/section-badge";

const features = [
  {
    id: "assessments",
    icon: Target,
    tag: "📊 AI Assessments",
    headline: "Skill-Based Assessments That Matter",
    description: "AI-powered evaluations that measure real skills, not just textbook knowledge.",
    details: [
      { icon: Zap, text: "Unlimited Access to Practice Tests" },
      { icon: Briefcase, text: "Industry-Specific Interview Masterclasses" },
      { icon: BookOpen, text: "Expert-Curated Interview Q&A Bank" },
      { icon: Users, text: "Real-Time Mock Interview Simulations" },
      { icon: Award, text: "Advanced 28-Layer Proctored Testing" },
      { icon: Target, text: "Get Your Industry Readiness Score" },
      { icon: TrendingUp, text: "Earn a Verified Performance Certificate" },
      { icon: BarChart3, text: "Auto-Apply to 100+ Jobs in One Click" },
    ],
    cta: "Explore Assessments",
    href: "/assessments",
    mockup: "assessment",
    gradient: "from-primary/10 via-primary/5 to-transparent",
  },
  {
    id: "learning",
    icon: GraduationCap,
    tag: "🎓 AI Learning Recommendations",
    headline: "Personalized, Data-Driven Learning Roadmap",
    description: "Targeted courses and projects built from your readiness report — not random content.",
    details: [
      { icon: GraduationCap, text: "Get Access to Industry-Relevant Courses" },
      { icon: BookOpen, text: "Learn in 5+ Languages, Anytime" },
      { icon: Zap, text: "Hands-On Real-Time Project Assignments" },
      { icon: Award, text: "Add Verified Course Certificates to Your Profile" },
      { icon: TrendingUp, text: "Track Your Career Growth Progress" },
      { icon: BarChart3, text: "AI-Powered Resume Strength Analysis" },
      { icon: Target, text: "Know Your True Market Position" },
    ],
    cta: "Start Learning",
    href: "/learning",
    mockup: "learning",
    gradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
  },
  {
    id: "jobs",
    icon: Briefcase,
    tag: "⚡ AI Job Search",
    headline: "Unlock High-Match, High-Growth Opportunities",
    description: "Your verified profile unlocks roles that match your actual capabilities — not just keywords.",
    details: [
      { icon: Users, text: "Build a Verified, Performance-Based Profile" },
      { icon: Zap, text: "Get AI-Powered Smart Job Matches" },
      { icon: TrendingUp, text: "Increase Your Visibility to Recruiters" },
      { icon: Briefcase, text: "Connect Directly with Hiring Companies" },
      { icon: Target, text: "Receive Personalized Job Recommendations" },
      { icon: BarChart3, text: "See Your Application Success Insights" },
      { icon: Award, text: "Apply to Multiple Jobs in One Click" },
    ],
    cta: "Browse Jobs",
    href: "/jobs",
    mockup: "jobs",
    gradient: "from-violet-500/10 via-violet-500/5 to-transparent",
  },
  {
    id: "hackathons",
    icon: Code2,
    tag: "🏆 AI-Powered Hackathons",
    headline: "Compete, Build, and Get Noticed by Top Recruiters",
    description: "Real-world hackathons designed to showcase your skills and connect you with hiring teams.",
    details: [
      { icon: Trophy, text: "Compete in Industry-Backed Hackathons" },
      { icon: Code2, text: "Solve Real-World Company Challenges" },
      { icon: Users, text: "Team Up with Top Builders Worldwide" },
      { icon: Calendar, text: "Weekly & Monthly Themed Events" },
      { icon: Award, text: "Win Cash Prizes & Verified Badges" },
      { icon: Briefcase, text: "Get Direct Recruiter Visibility" },
      { icon: TrendingUp, text: "Boost Your Profile with Live Projects" },
      { icon: Star, text: "Earn Featured Spots on the Leaderboard" },
    ],
    cta: "Join a Hackathon",
    href: "/hackathons",
    mockup: "hackathons",
    gradient: "from-amber-500/10 via-amber-500/5 to-transparent",
  },
  {
    id: "podcasts",
    icon: Mic,
    tag: "🎙️ Career Podcasts",
    headline: "Learn from the Voices Shaping Your Industry",
    description: "Insider conversations with hiring leaders, founders, and top performers — straight to your ears.",
    details: [
      { icon: Mic, text: "Weekly Episodes with Industry Leaders" },
      { icon: Headphones, text: "Listen Anywhere, On Any Device" },
      { icon: BookOpen, text: "Career Playbooks from Top Performers" },
      { icon: Users, text: "Recruiter & Hiring Manager Interviews" },
      { icon: Play, text: "On-Demand Library of 200+ Episodes" },
      { icon: Radio, text: "Live Q&A Sessions with Experts" },
      { icon: TrendingUp, text: "Stay Ahead of Industry Trends" },
    ],
    cta: "Listen to Podcasts",
    href: "/podcast",
    mockup: "podcasts",
    gradient: "from-blue-500/10 via-blue-500/5 to-transparent",
  },
];

const AssessmentMockup = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-4 mb-4">
      <div className="relative h-20 w-20 shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <path d="M18 2.0845a15.9155 15.9155 0 010 31.831 15.9155 15.9155 0 010-31.831" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
          <motion.path
            d="M18 2.0845a15.9155 15.9155 0 010 31.831 15.9155 15.9155 0 010-31.831"
            fill="none" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round"
            initial={{ strokeDasharray: "0, 100" }}
            animate={{ strokeDasharray: "85, 100" }}
            transition={{ delay: 0.3, duration: 1.5 }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-lg font-bold font-display gradient-text">85</span>
      </div>
      <div>
        <p className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-block mb-1">Above Market</p>
        <p className="text-sm font-bold">Sr. Software Engineer</p>
        <p className="text-[10px] text-muted-foreground">Top 18% · 6 yrs exp.</p>
      </div>
    </div>
    {["System Design", "API Architecture", "Problem Solving", "Cloud"].map((s, si) => (
      <div key={s}>
        <div className="flex justify-between text-[10px] mb-1"><span>{s}</span><span className="font-bold">{[92, 88, 85, 71][si]}</span></div>
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <motion.div className="h-full rounded-full gradient-primary"
            initial={{ width: 0 }}
            animate={{ width: `${[92, 88, 85, 71][si]}%` }}
            transition={{ delay: 0.5 + si * 0.1, duration: 0.7 }}
          />
        </div>
      </div>
    ))}
  </div>
);

const JobsMockup = () => (
  <div className="space-y-3">
    {[
      { role: "Sr. Backend Engineer", company: "Stripe", match: 94 },
      { role: "Platform Engineer", company: "Datadog", match: 89 },
      { role: "Staff Engineer", company: "Notion", match: 82 },
    ].map((job) => (
      <div key={job.role} className="p-4 rounded-xl border border-border/50 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">{job.role}</p>
          <p className="text-[10px] text-muted-foreground">{job.company} · Remote</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-primary">{job.match}%</p>
          <p className="text-[9px] text-muted-foreground">Match</p>
        </div>
      </div>
    ))}
  </div>
);

const LearningMockup = () => (
  <div className="space-y-3">
    {[
      { skill: "Kubernetes & Containers", progress: 35, target: "Cloud Infrastructure" },
      { skill: "Data Modeling", progress: 55, target: "Database Architecture" },
      { skill: "CI/CD Automation", progress: 20, target: "DevOps Practices" },
    ].map((item, li) => (
      <div key={item.skill} className="p-4 rounded-xl border border-border/50">
        <div className="flex justify-between text-xs mb-1">
          <span className="font-medium">{item.skill}</span>
          <span className="text-muted-foreground">{item.progress}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden mb-1.5">
          <motion.div className="h-full rounded-full gradient-primary"
            initial={{ width: 0 }}
            animate={{ width: `${item.progress}%` }}
            transition={{ delay: 0.5 + li * 0.1, duration: 0.7 }}
          />
        </div>
        <p className="text-[9px] text-muted-foreground">Gap: {item.target}</p>
      </div>
    ))}
  </div>
);

const HackathonsMockup = () => (
  <div className="space-y-3">
    {[
      { name: "AI Agents Build-Off", prize: "$10K", participants: "2.4K", live: true },
      { name: "FinTech Innovate '26", prize: "$7.5K", participants: "1.8K", live: false },
      { name: "ClimateTech Sprint", prize: "$5K", participants: "1.2K", live: false },
    ].map((h, i) => (
      <div key={h.name} className="p-4 rounded-xl border border-border/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Trophy className="h-3.5 w-3.5 text-primary" />
            </div>
            <p className="text-sm font-semibold">{h.name}</p>
          </div>
          {h.live && (
            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> LIVE
            </span>
          )}
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>Prize: <span className="font-bold text-foreground">{h.prize}</span></span>
          <span>{h.participants} builders</span>
        </div>
      </div>
    ))}
  </div>
);

const PodcastsMockup = () => (
  <div className="space-y-3">
    {[
      { title: "Breaking into FAANG in 2026", host: "Sarah Chen · Ex-Google", duration: "42 min" },
      { title: "What Recruiters Actually Want", host: "Marcus Lee · Stripe", duration: "36 min" },
      { title: "From Bootcamp to Staff Engineer", host: "Priya Patel · Notion", duration: "51 min" },
    ].map((p) => (
      <div key={p.title} className="p-4 rounded-xl border border-border/50 flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center shrink-0">
          <Play className="h-4 w-4 text-white fill-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{p.title}</p>
          <p className="text-[10px] text-muted-foreground truncate">{p.host}</p>
        </div>
        <span className="text-[10px] text-muted-foreground shrink-0">{p.duration}</span>
      </div>
    ))}
  </div>
);

const mockupMap: Record<string, React.ReactNode> = {
  assessment: <AssessmentMockup />,
  jobs: <JobsMockup />,
  learning: <LearningMockup />,
  hackathons: <HackathonsMockup />,
  podcasts: <PodcastsMockup />,
};

const PlatformFeaturesSection = () => {
  const [activeTab, setActiveTab] = useState(0);
  const feature = features[activeTab];
  const Icon = feature.icon;

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <SectionBadge label="Platform" icon={Zap} />
          <motion.h2
            className="text-3xl md:text-4xl font-bold font-display mb-4 leading-[1.15]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Three Powerful Engines.<br />
            <span className="text-primary">One Career Leap.</span>
          </motion.h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Measure, match, and grow — all in one platform
            <br className="hidden md:block" />
            built for results.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {features.map((f, i) => {
            const FIcon = f.icon;
            const isActive = activeTab === i;
            return (
              <button
                key={f.id}
                onClick={() => setActiveTab(i)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200"
                style={{
                  background: isActive ? "hsl(var(--primary))" : "hsl(var(--card))",
                  color: isActive ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
                  border: isActive ? "none" : "1px solid hsl(var(--border))",
                  boxShadow: isActive ? "0 4px 16px rgba(0, 44, 102, 0.2)" : "none",
                }}
              >
                <FIcon className="h-4 w-4" />
                {f.id.charAt(0).toUpperCase() + f.id.slice(1)}
              </button>
            );
          })}
        </div>

        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-slate-200/80 shadow-md overflow-hidden bg-white"
          >
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left: content */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#002C66]/8 text-[#002C66] text-xs font-medium mb-6 border border-[#002C66]/15 self-start">
                  <Icon className="h-3.5 w-3.5 text-[#002C66]" />
                  {feature.tag}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold font-display mb-4 leading-tight text-slate-900">
                  {feature.headline}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{feature.description}</p>
                <div className="space-y-2 mb-6">
                  {feature.details.map(({ icon: DIcon, text }) => (
                    <div key={text} className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-lg bg-[#002C66]/8 flex items-center justify-center shrink-0">
                        <DIcon className="h-3.5 w-3.5 text-[#002C66]" />
                      </div>
                      <span className="text-sm text-muted-foreground">{text}</span>
                    </div>
                  ))}
                </div>
                <Link to={feature.href} className="self-start">
                  <Button size="lg" className="bg-[#002C66] text-white hover:bg-[#00204d] border-0 gap-2 h-11 px-7">
                    {feature.cta} <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* Right: mockup */}
              <div className="bg-slate-50/80 border-l border-slate-200/80 p-6 lg:p-8 hidden lg:flex items-center justify-center">
                <div className="w-full rounded-xl border border-slate-200/80 shadow-sm overflow-hidden bg-white">
                  <div className="h-8 bg-slate-100/80 border-b border-slate-200/60 flex items-center px-3 gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-slate-300" />
                    <div className="h-2 w-2 rounded-full bg-slate-300" />
                    <div className="h-2 w-2 rounded-full bg-slate-300" />
                    <div className="flex-1 h-4 rounded bg-white border border-slate-200/60 mx-8" />
                  </div>
                  <div className="p-5">{mockupMap[feature.mockup]}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default PlatformFeaturesSection;
