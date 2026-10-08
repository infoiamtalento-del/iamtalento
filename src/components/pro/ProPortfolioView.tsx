import React from "react";
import {
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Building2,
  Briefcase,
  GraduationCap,
  Award,
  Layers,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Send,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProUser, ProJob } from "@/data/proData";
import { getCompanyLogo, getCandidatePhoto } from "@/data/portalAssets";
import { ProDrawerState } from "./proTypes";

interface ProPortfolioViewProps {
  user: ProUser;
  jobs: ProJob[];
  onOpenDrawer: (drawer: ProDrawerState) => void;
  onToast: (msg: string) => void;
}

export const ProPortfolioView: React.FC<ProPortfolioViewProps> = ({
  user,
  jobs,
  onOpenDrawer,
  onToast,
}) => {
  const isEmployer = user.role === "employer";

  if (isEmployer) {
    // EMPLOYER PORTFOLIO
    const cp = user.cp || {};
    const companyJobs = jobs.filter((j) => j.by === user.email);

    return (
      <div className="space-y-6">
        {/* Company Header Banner */}
        <div className="bg-card border border-border/80 rounded-2xl overflow-hidden shadow-sm">
          <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-background border-b border-border/60 relative" />
          <div className="px-6 pb-6 pt-0 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12">
              <div className="flex items-end gap-4">
                <div className="w-24 h-24 rounded-2xl bg-card border-2 border-border shadow-md flex items-center justify-center p-2 shrink-0">
                  <img
                    src={getCompanyLogo(user.name)}
                    alt={user.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-display flex items-center gap-2">
                    {cp.name || user.name}
                    <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                  </h1>
                  <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                    <span>{cp.ind || "Technology"}</span>
                    <span>•</span>
                    <span>{cp.size || "Mid"} Company</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {cp.hq || "Bengaluru, India"}
                    </span>
                    {cp.site && (
                      <>
                        <span>•</span>
                        <a
                          href={`https://${cp.site}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1 font-medium"
                        >
                          {cp.site} <ExternalLink className="w-3 h-3" />
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company About & Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-foreground text-base">About {cp.name || user.name}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
              {cp.about ||
                "Super30 Technologies is building developer tooling and autonomous engineering platforms for modern software teams worldwide."}
            </p>

            {cp.mission && (
              <div className="pt-2 border-t border-border/60 space-y-1">
                <span className="text-xs font-semibold text-foreground">Our Mission</span>
                <p className="text-xs text-muted-foreground leading-relaxed">{cp.mission}</p>
              </div>
            )}
          </div>

          {/* Benefits & Perks */}
          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> Perks & Culture
            </h3>
            <div className="flex flex-wrap gap-2">
              {(cp.ben || ["Remote work", "Health insurance", "Learning budget", "Flexible hours", "Stock options"]).map(
                (perk) => (
                  <span
                    key={perk}
                    className="px-2.5 py-1 rounded-lg bg-muted text-foreground text-xs font-medium border border-border/60"
                  >
                    {perk}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* Open Job Listings */}
        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground text-base flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" /> Open Opportunities ({companyJobs.length})
            </h3>
          </div>

          <div className="divide-y divide-border/60">
            {companyJobs.length === 0 ? (
              <p className="text-xs text-muted-foreground py-6 text-center">No active positions posted yet.</p>
            ) : (
              companyJobs.map((j) => (
                <div
                  key={j.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <h4
                      className="font-bold text-foreground text-sm hover:text-primary transition-colors cursor-pointer"
                      onClick={() => onOpenDrawer({ type: "job", id: j.id })}
                    >
                      {j.t}
                    </h4>
                    <div className="text-muted-foreground text-[11px] flex items-center gap-2 mt-0.5">
                      <span>{j.l}</span>
                      <span>•</span>
                      <span>{j.m}</span>
                      <span>•</span>
                      <span>₹{j.a}–{j.b} LPA</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="rounded-xl text-xs h-8"
                    onClick={() => onOpenDrawer({ type: "job", id: j.id })}
                  >
                    Apply Now
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // CANDIDATE PORTFOLIO
  const candidateProjects = user.pj || [
    { t: "OpenUI Component Library", l: "github.com/vignesh/openui", d: "Tree-shakeable, WCAG AA compliant headless UI system." },
    { t: "Pulse Health Tracker", l: "pulse-demo.app", d: "Realtime health tracking PWA built with Next.js and WebSockets." },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Banner */}
      <div className="bg-card border border-border/80 rounded-2xl overflow-hidden shadow-sm">
        <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-background border-b border-border/60" />
        <div className="px-6 pb-6 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 rounded-2xl bg-card border-2 border-border shadow-md overflow-hidden shrink-0">
                <img
                  src={getCandidatePhoto(user.name)}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-display">
                    {user.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Profile
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    Open to Work
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{user.head || "Software Engineer"}</p>
                <div className="text-xs text-muted-foreground flex items-center gap-2 pt-0.5 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {user.city || "Bengaluru, India"}
                  </span>
                  <span>•</span>
                  <span>{user.exp || 3} Years Experience</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                onClick={() => onToast(`Message sent to ${user.name}!`)}
                className="rounded-xl gap-2 font-medium shadow-sm text-xs"
              >
                <Send className="w-3.5 h-3.5" /> Get in Touch
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: About & Experience (2 cols) */}
        <div className="lg:col-span-2 space-y-5">
          {/* About */}
          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-semibold text-foreground text-base">About Me</h3>
            <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
              {user.about ||
                "Frontend engineer experienced in modern component architectures, TypeScript, state machines, and Web Vitals optimization. Passionate about developer tooling and bridging UX with rock-solid frontend engineering."}
            </p>
          </div>

          {/* Work Experience */}
          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-foreground text-base flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" /> Work Experience
            </h3>
            <div className="space-y-4">
              {(user.ex || []).map((exp, idx) => (
                <div key={idx} className="relative pl-6 border-l-2 border-primary/30 space-y-1 text-xs">
                  <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-primary" />
                  <div className="font-bold text-foreground text-sm">{exp.role}</div>
                  <div className="text-muted-foreground font-medium">
                    {exp.co} • {exp.fr} – {exp.to}
                  </div>
                  <p className="text-muted-foreground leading-relaxed pt-1">{exp.d}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Projects */}
          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-foreground text-base flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" /> Featured Projects
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {candidateProjects.map((p, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-border/70 bg-muted/20 space-y-2 text-xs flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="font-bold text-foreground text-sm">{p.t}</div>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">{p.d}</p>
                  </div>
                  {p.l && (
                    <div className="pt-2 border-t border-border/50">
                      <a
                        href={`https://${p.l}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1 font-semibold"
                      >
                        {p.l} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Skills & Assessments (1 col) */}
        <div className="space-y-5">
          {/* Verified Skills */}
          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Verified Skills
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {(user.sk || []).map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-lg bg-muted text-foreground text-xs font-medium border border-border/60"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Assessment Test Scores */}
          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" /> Assessment Scores
            </h3>
            <div className="space-y-2.5">
              {Object.entries(user.as || {}).map(([skill, score]) => (
                <div key={skill} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between font-medium">
                    <span className="text-foreground">{skill}</span>
                    <span className="text-primary font-bold">{score}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-primary" /> Education
            </h3>
            <div className="space-y-2 text-xs">
              {(user.ed || []).map((ed, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="font-bold text-foreground">{ed.dg}</div>
                  <div className="text-muted-foreground">{ed.sc} • {ed.yr}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
