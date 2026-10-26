import { UserRound, UserCheck, Briefcase, FileText, GraduationCap, ArrowRight, Mail, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type ProUser, type ProJob, type ProApplication } from "@/data/proData";
import { getCandidatePhoto } from "@/data/portalAssets";
import type { ProView } from "./proTypes";
import "./employer-workspace.css";

interface Props {
  user: ProUser;
  jobs: ProJob[];
  applications: ProApplication[];
  onNavigate: (view: ProView) => void;
}

export function ProEmployeeMyAccount({ user, jobs, applications, onNavigate }: Props) {
  const myApps = applications.filter((a) => a.who === user.email);
  const myInterviews = myApps.filter((a) => a.st === "Interview");
  const avatarUrl = getCandidatePhoto(user.name);

  return (
    <div className="employer-workspace">
      <header className="workspace-header">
        <div>
          <span className="workspace-eyebrow">
            <UserRound size={14} />
            Employee account
          </span>
          <h1 className="workspace-heading">My Account</h1>
          <p className="workspace-description">
            Your career profile, verified assessments, and account details in one place.
          </p>
        </div>
        <Button onClick={() => onNavigate("profile")} className="cursor-pointer">
          <UserCheck className="h-4 w-4 mr-1.5" />
          Candidate Profile
          <ArrowRight className="h-4 w-4 ml-1.5" />
        </Button>
      </header>

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <section className="workspace-panel">
          <div className="flex items-center gap-4 border-b border-border pb-6">
            <div className="h-16 w-16 rounded-full bg-primary/10 text-primary font-bold text-xl flex items-center justify-center shrink-0 overflow-hidden border-2 border-primary/20">
              {avatarUrl ? (
                <img src={avatarUrl} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                (user.name.charAt(0) || "Y").toUpperCase()
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
              <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
                Employee · Verified Candidate Account
              </p>
            </div>
          </div>

          <h3 className="mb-5 mt-6 text-sm font-bold text-foreground">Account information</h3>
          <dl className="grid gap-6 sm:grid-cols-2">
            {[
              { label: "Account name", value: user.name, icon: UserRound },
              { label: "Email address", value: user.email, icon: Mail },
              { label: "Designation", value: user.head || "Full Stack Engineer", icon: Briefcase },
              { label: "Location", value: user.city || "Bengaluru, India", icon: MapPin },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label}>
                <dt className="mb-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                  <Icon size={14} className="text-primary" />
                  {label}
                </dt>
                <dd className="break-words text-sm font-semibold text-foreground">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-7 border-t border-border pt-5">
            <Button variant="outline" onClick={() => onNavigate("profile")} className="cursor-pointer">
              Manage candidate profile
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </section>

        <aside className="workspace-panel">
          <div className="workspace-section-title">
            <span className="workspace-icon">
              <ShieldCheck />
            </span>
            <div>
              <h2>Career overview</h2>
              <p>Your current job search and test status.</p>
            </div>
          </div>

          <div className="divide-y divide-border">
            {[
              {
                label: "Applications submitted",
                value: myApps.length,
                icon: FileText,
                target: "applied" as ProView,
              },
              {
                label: "Interview invitations",
                value: myInterviews.length,
                icon: Briefcase,
                target: "applied" as ProView,
              },
              {
                label: "Verified assessments",
                value: 4,
                icon: GraduationCap,
                target: "cert" as ProView,
              },
            ].map(({ label, value, icon: Icon, target }) => (
              <Button
                variant="ghost"
                key={label}
                onClick={() => onNavigate(target)}
                className="flex h-16 w-full justify-start gap-3 rounded-none px-0 cursor-pointer"
              >
                <Icon className="text-primary h-5 w-5" />
                <span className="flex-1 text-left text-xs font-medium text-foreground">{label}</span>
                <strong className="text-lg text-foreground">{value}</strong>
                <ArrowRight className="text-primary h-4 w-4" />
              </Button>
            ))}
          </div>

          <Button className="mt-6 w-full cursor-pointer" onClick={() => onNavigate("resume")}>
            <Sparkles className="h-4 w-4 mr-1.5" />
            AI Resume Builder
          </Button>
        </aside>
      </div>

      <section className="workspace-panel mt-5 flex flex-wrap items-center gap-4">
        <div className="mr-auto">
          <h2 className="text-base font-bold text-foreground">Account preferences</h2>
          <p className="mt-1 text-xs text-muted-foreground">Manage your settings and get support when you need it.</p>
        </div>
        <Button variant="outline" onClick={() => onNavigate("support")} className="cursor-pointer">
          Support Center
          <ArrowRight className="h-4 w-4 ml-1.5" />
        </Button>
      </section>
    </div>
  );
}
