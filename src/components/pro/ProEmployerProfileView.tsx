import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MapPin, Globe, Users, CheckCircle2, ArrowRight, Share2,
  Building2, Briefcase, Pencil, Sparkles, Target, HeartHandshake,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProJob, ProUser } from "@/data/proData";

interface Props {
  user: ProUser;
  jobs: ProJob[];
  onEdit: () => void;
  onToast: (msg: string) => void;
  onOpenJob?: (id: number) => void;
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-[11px] font-bold font-display tracking-[0.14em] uppercase text-muted-foreground mb-4">
    {children}
  </h2>
);

const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn("rounded-2xl border border-border/70 bg-card p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]", className)}>
    {children}
  </div>
);

const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="px-2.5 py-1 rounded-md bg-secondary text-[11px] font-medium text-muted-foreground">
    {children}
  </span>
);

/**
 * Employer "Company Profile" inside Talento Pro — a profile page styled like the
 * candidate profile (DemoProfileBody), sourced from the company's saved profile data.
 */
export function ProEmployerProfileView({ user, jobs, onEdit, onToast, onOpenJob }: Props) {
  const cp = user.cp || {};
  const name = cp.name || user.name || "Your Company";
  const about = cp.about || "Tell candidates what your company builds and why it matters.";
  const mission = cp.mission || "";
  const industry = cp.ind || "Technology";
  const size = cp.size || "Growing team";
  const hq = cp.hq || "India";
  const site = cp.site || "";
  const benefits: string[] = cp.ben || [];

  const openJobs = jobs;
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "CO";

  const stats = [
    { value: String(openJobs.length), label: "Open Roles" },
    { value: size, label: "Team Size" },
    { value: industry.split(" ")[0], label: "Industry" },
    { value: "Verified", label: "Employer" },
  ];

  const shareProfile = () => {
    navigator.clipboard?.writeText(window.location.href);
    onToast("Company profile link copied!");
  };

  return (
    <div className="space-y-5">
      {/* ===== HEADER CARD ===== */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-border/70 bg-card shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden"
      >
        <div className="p-6 sm:p-8 lg:p-10 grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Identity */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
            <Avatar className="h-32 w-32 shrink-0 border-4 border-card shadow-md rounded-3xl">
              <AvatarFallback className="text-3xl font-bold bg-primary text-primary-foreground rounded-3xl">{initials}</AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl sm:text-4xl font-bold font-display tracking-tight">{name}</h1>
                <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
              </div>
              <p className="text-base font-semibold text-primary mt-1">{industry}</p>
              {mission && <p className="text-sm text-muted-foreground mt-1">{mission}</p>}

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{hq}</span>
                <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{size}</span>
                {site && <span className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" />{site}</span>}
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <Chip>Hiring Now</Chip>
                <Chip>Skill-Verified Team</Chip>
                <Chip>{industry}</Chip>
              </div>
            </div>
          </div>

          {/* Stats & actions */}
          <div className="flex flex-col justify-between gap-6 lg:border-l lg:border-border/60 lg:pl-8">
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="rounded-xl bg-secondary/60 px-4 py-3">
                  <p className="text-lg font-bold font-display text-foreground">{s.value}</p>
                  <p className="text-[11px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={onEdit}><Pencil className="h-3.5 w-3.5" />Edit Profile</Button>
              <Button size="sm" variant="outline" onClick={shareProfile}><Share2 className="h-3.5 w-3.5" />Share</Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ===== ABOUT ===== */}
      <Card>
        <SectionTitle>About the Company</SectionTitle>
        <p className="text-sm leading-relaxed text-foreground/90">{about}</p>
        {mission && (
          <div className="mt-5 flex items-start gap-3 rounded-xl bg-primary/5 border border-primary/15 p-4">
            <Target className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-foreground">Our Mission</p>
              <p className="text-xs text-muted-foreground mt-1">{mission}</p>
            </div>
          </div>
        )}
      </Card>

      {/* ===== OPEN ROLES ===== */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <SectionTitle>Open Roles</SectionTitle>
        </div>
        {openJobs.length === 0 && (
          <p className="text-sm text-muted-foreground">No open roles yet — post your first job to start receiving verified applicants.</p>
        )}
        <div className="divide-y divide-border/60">
          {openJobs.slice(0, 5).map((job) => (
            <button
              key={job.id}
              onClick={() => onOpenJob?.(job.id)}
              className="w-full flex flex-wrap items-center justify-between gap-3 py-4 text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                  <Briefcase className="h-4.5 w-4.5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">{job.t}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{job.l} · {job.ty} · {job.e}+ yrs</p>
                </div>
              </div>
              <span className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-semibold text-foreground">₹{job.a}–{job.b} LPA</span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </span>
            </button>
          ))}
        </div>
      </Card>

      {/* ===== BENEFITS & CULTURE ===== */}
      {benefits.length > 0 && (
        <Card>
          <SectionTitle>Benefits & Culture</SectionTitle>
          <div className="flex items-start gap-3 mb-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <HeartHandshake className="h-4 w-4" />
            </span>
            <p className="text-sm text-muted-foreground leading-relaxed">What your team enjoys — shown to candidates on every job post.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {benefits.map((b) => <Chip key={b}>{b}</Chip>)}
          </div>
        </Card>
      )}

      {/* ===== WHY JOIN ===== */}
      <Card>
        <SectionTitle>Why Candidates Choose {name}</SectionTitle>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: Sparkles, title: "Skill-First Hiring", desc: "Every applicant is verified through proctored assessments." },
            { icon: Building2, title: "Transparent Process", desc: "Clear stages, quick feedback and honest timelines." },
            { icon: Users, title: "Growing Team", desc: `A ${size.toLowerCase()} team across ${hq}, hiring now.` },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border border-border/60 p-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3"><Icon className="h-4 w-4" /></span>
              <p className="text-sm font-semibold text-foreground">{title}</p>
              <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default ProEmployerProfileView;
