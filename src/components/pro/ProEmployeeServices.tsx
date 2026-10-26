import React, { useState } from "react";
import {
  BookOpen,
  Calendar,
  Briefcase,
  BarChart3,
  Award,
  Video,
  Clock,
  Star,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Eye,
  Users,
  CheckCircle2,
  DollarSign,
  ArrowUpRight,
  FileText,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { ProView } from "./proTypes";

interface Props {
  view: "learning-mentors" | "freelancing" | "events-community" | "analytics";
  userName: string;
  onNavigate: (view: ProView) => void;
  onToast: (msg: string) => void;
}

export const ProEmployeeServices: React.FC<Props> = ({
  view,
  userName,
  onNavigate,
  onToast,
}) => {
  const [activeTab, setActiveTab] = useState("all");

  if (view === "learning-mentors") {
    const mentors = [
      {
        name: "Arjun Verma",
        role: "Staff Engineer @ Google",
        skills: ["System Design", "Distributed Systems", "Go"],
        rating: 4.9,
        reviews: 42,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        rate: "Free 1:1 Session",
      },
      {
        name: "Sneha Reddy",
        role: "Engineering Manager @ Razorpay",
        skills: ["React & Web Arch", "Career Coaching", "Node.js"],
        rating: 5.0,
        reviews: 67,
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
        rate: "Free 1:1 Session",
      },
      {
        name: "Rohan Kulkarni",
        role: "Principal Architect @ Amazon AWS",
        skills: ["Cloud Architecture", "DevOps", "Microservices"],
        rating: 4.85,
        reviews: 35,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        rate: "Free 1:1 Session",
      },
    ];

    const learningTracks = [
      {
        title: "Modern React 19 & Next.js Enterprise Architecture",
        modules: 12,
        hours: "24 hrs",
        progress: 65,
        level: "Intermediate",
      },
      {
        title: "Large Scale Microservices & Event-Driven Systems",
        modules: 16,
        hours: "32 hrs",
        progress: 30,
        level: "Advanced",
      },
      {
        title: "Production LLM Engineering & Agentic Workflows",
        modules: 10,
        hours: "20 hrs",
        progress: 0,
        level: "Specialized",
      },
    ];

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BookOpen className="h-4 w-4" />
              </span>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Learning & Mentors
              </h1>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Connect with top tech mentors for 1:1 mentorship and explore curated engineering masterclasses.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => onToast("Mentor booking calendar opened. Choose your 30-min slot.")}
          >
            <Video className="h-3.5 w-3.5 mr-1.5" /> Book 1:1 Session
          </Button>
        </div>

        {/* Mentors Section */}
        <div>
          <h2 className="text-sm font-bold text-foreground mb-3 flex items-center justify-between">
            <span>Verified Industry Mentors</span>
            <span className="text-xs font-normal text-primary hover:underline cursor-pointer" onClick={() => onToast("Showing all 50+ verified mentors")}>
              View all mentors &rarr;
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mentors.map((m) => (
              <div
                key={m.name}
                className="rounded-2xl border border-border bg-card p-4 flex flex-col justify-between shadow-2xs hover:border-primary/40 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="h-12 w-12 rounded-full object-cover border border-border"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-foreground truncate">{m.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{m.role}</p>
                      <div className="flex items-center gap-1 mt-0.5 text-xs text-amber-500 font-semibold">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        <span>{m.rating}</span>
                        <span className="text-[11px] text-muted-foreground font-normal">({m.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {m.skills.map((s) => (
                      <span
                        key={s}
                        className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pt-4 mt-3 border-t border-border flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-600">{m.rate}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7 px-2.5"
                    onClick={() => onToast(`Booking session with ${m.name}`)}
                  >
                    Connect
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Paths */}
        <div>
          <h2 className="text-sm font-bold text-foreground mb-3">Your Learning Roadmaps</h2>
          <div className="space-y-3">
            {learningTracks.map((t) => (
              <div
                key={t.title}
                className="rounded-2xl border border-border bg-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">
                      {t.level}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {t.hours}
                    </span>
                    <span className="text-xs text-muted-foreground">• {t.modules} modules</span>
                  </div>
                  <h3 className="text-sm font-bold text-foreground truncate">{t.title}</h3>
                  <div className="flex items-center gap-3 max-w-md">
                    <Progress value={t.progress} className="h-1.5 flex-1" />
                    <span className="text-xs font-semibold text-muted-foreground">{t.progress}%</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => onToast(`Resuming "${t.title}" syllabus.`)}
                >
                  {t.progress > 0 ? "Continue Lesson" : "Start Track"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === "freelancing") {
    const freelanceGigs = [
      {
        id: "FL-101",
        title: "Senior Full Stack React / Node Engineer for Fintech MVP",
        client: "Venture-backed Series A Fintech",
        rate: "₹2,500 - ₹3,500 / hr",
        type: "Contract (3 months)",
        estHours: "20-30 hrs/week",
        skills: ["React 19", "Node.js", "PostgreSQL", "Stripe/Razorpay"],
        applied: false,
      },
      {
        id: "FL-102",
        title: "Next.js Performance Optimization & Core Web Vitals Audit",
        client: "E-Commerce Unicorn",
        rate: "₹60,000 fixed milestone",
        type: "Fixed Scope",
        estHours: "2 weeks",
        skills: ["Next.js", "SSR", "Lighthouse", "Edge Caching"],
        applied: true,
      },
      {
        id: "FL-103",
        title: "RAG Pipeline & Semantic Search Integration",
        client: "B2B SaaS Analytics",
        rate: "₹3,000 / hr",
        type: "Hourly Gig",
        estHours: "15 hrs/week",
        skills: ["Python", "LangChain", "Vector DBs", "OpenAI"],
        applied: false,
      },
    ];

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Briefcase className="h-4 w-4" />
              </span>
              <h1 className="text-xl font-bold tracking-tight text-foreground">Freelancing & Contracts</h1>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Curated high-paying freelance contracts, verified milestone payments, and flexible hourly gigs.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onToast("Milestone escrow protection is active for all contracts.")}
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-600" /> Escrow Protected
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-border bg-card p-3 shadow-2xs">
            <p className="text-[11px] text-muted-foreground">Active Proposals</p>
            <p className="text-lg font-bold text-foreground mt-0.5">2 Submitted</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3 shadow-2xs">
            <p className="text-[11px] text-muted-foreground">Contracts Completed</p>
            <p className="text-lg font-bold text-foreground mt-0.5">5 Projects</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3 shadow-2xs">
            <p className="text-[11px] text-muted-foreground">Client Rating</p>
            <p className="text-lg font-bold text-foreground mt-0.5">4.95 ★</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3 shadow-2xs">
            <p className="text-[11px] text-muted-foreground">Earnings in Escrow</p>
            <p className="text-lg font-bold text-emerald-600 mt-0.5">₹45,000</p>
          </div>
        </div>

        {/* Gigs List */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-foreground">Available High-Priority Gigs</h2>
          <div className="space-y-3">
            {freelanceGigs.map((g) => (
              <div
                key={g.id}
                className="rounded-2xl border border-border bg-card p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs hover:border-primary/40 transition-all"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="text-[10px] font-semibold">
                      {g.type}
                    </Badge>
                    <span className="text-xs font-semibold text-emerald-600">{g.rate}</span>
                    <span className="text-xs text-muted-foreground">• {g.estHours}</span>
                  </div>
                  <h3 className="text-sm font-bold text-foreground">{g.title}</h3>
                  <p className="text-xs text-muted-foreground">Client: {g.client}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {g.skills.map((s) => (
                      <span
                        key={s}
                        className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex md:flex-col items-center md:items-end gap-2 shrink-0">
                  <Button
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={() => onToast(`Proposal opened for "${g.title}"`)}
                  >
                    {g.applied ? "View Proposal" : "Apply to Gig"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === "events-community") {
    const events = [
      {
        id: "EV-1",
        title: "All-India Tech Hackathon 2026: Agentic AI Edition",
        type: "Virtual Hackathon",
        date: "Nov 15 - 17, 2026",
        prize: "₹5,00,000 Cash Pool",
        participants: "850+ Registered",
        status: "Registration Open",
      },
      {
        id: "EV-2",
        title: "Bengaluru React & Frontend Performance Meetup",
        type: "In-Person Meetup",
        date: "Saturday, Nov 8, 2026 · 4:00 PM",
        prize: "HSR Layout, Bengaluru",
        participants: "120 Seats Left",
        status: "Free Pass",
      },
      {
        id: "EV-3",
        title: "Architecting Resilient Distributed Systems with Kafka & Go",
        type: "Live Tech Webinar",
        date: "Thursday, Nov 12, 2026 · 7:30 PM",
        prize: "Interactive Q&A + Certificate",
        participants: "450+ Attendees",
        status: "Free RSVP",
      },
    ];

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Calendar className="h-4 w-4" />
              </span>
              <h1 className="text-xl font-bold tracking-tight text-foreground">Events & Community</h1>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Participate in national developer hackathons, community meetups, and live architectural webinars.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => onToast("Joined the Talento Engineers Discord & Community Circle!")}
          >
            <Users className="h-3.5 w-3.5 mr-1.5" /> Join Developer Community
          </Button>
        </div>

        <div className="grid gap-4">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="rounded-2xl border border-border bg-card p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs hover:border-primary/40 transition-all"
            >
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">
                    {ev.type}
                  </Badge>
                  <span className="text-xs font-semibold text-primary">{ev.date}</span>
                </div>
                <h3 className="text-sm font-bold text-foreground">{ev.title}</h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="font-semibold text-emerald-600">{ev.prize}</span>
                  <span>• {ev.participants}</span>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => onToast(`RSVP confirmed for "${ev.title}"! Calendar invite sent.`)}
              >
                Register Free
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === "analytics") {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BarChart3 className="h-4 w-4" />
              </span>
              <h1 className="text-xl font-bold tracking-tight text-foreground">Candidate Analytics</h1>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Real-time insights on your profile discovery, recruiter views, and skill competitiveness.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onToast("Analytics report exported as PDF.")}
          >
            <TrendingUp className="h-3.5 w-3.5 mr-1.5 text-primary" /> Export Insights
          </Button>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-2xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Profile Views</span>
              <Eye className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">128</p>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" /> +28% this week
            </span>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-2xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Search Appearances</span>
              <Users className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">342</p>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" /> Top 5% in React
            </span>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-2xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Shortlist Rate</span>
              <Award className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">18.4%</p>
            <span className="text-[11px] font-semibold text-emerald-600 mt-1">
              2.4x higher than platform avg
            </span>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-2xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Recruiter SLA</span>
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">&lt; 24h</p>
            <span className="text-[11px] font-semibold text-emerald-600 mt-1">
              Autonomous review SLA active
            </span>
          </div>
        </div>

        {/* Skill Percentiles */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-foreground">Verified Skill Benchmarks vs Platform Peers</h2>
          <div className="space-y-3">
            {[
              { name: "React & Modern Web Architecture", score: 94, benchmark: "Top 6% nationwide" },
              { name: "TypeScript & Strict Type Safety", score: 91, benchmark: "Top 9% nationwide" },
              { name: "Node.js & Backend REST APIs", score: 88, benchmark: "Top 12% nationwide" },
              { name: "PostgreSQL & Database Optimization", score: 84, benchmark: "Top 16% nationwide" },
            ].map((skill) => (
              <div key={skill.name} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-foreground">{skill.name}</span>
                  <span className="text-primary">{skill.score}% ({skill.benchmark})</span>
                </div>
                <Progress value={skill.score} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};
