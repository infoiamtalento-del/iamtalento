import React, { useState } from "react";
import {
  Award,
  Calendar,
  CheckCircle2,
  Download,
  Share2,
  Plus,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Clock,
  Sparkles,
  Trash2,
  Pencil,
  GraduationCap,
  BadgeCheck,
  Check,
  Link2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ProUser, POPULAR_CERTS } from "@/data/proData";
import { ProHero } from "./ProHero";
import { MatchRing } from "./ProMatchRing";
import { ProDrawerState } from "./proTypes";

interface ProCertificationsViewProps {
  user: ProUser;
  onAddCertification: (certStr: string) => void;
  onRemoveCertification: (index: number) => void;
  onOpenDrawer: (drawer: ProDrawerState) => void;
  onNavigateToQuiz?: (skill: string) => void;
}

const COURSE_WEEKS = ["4 weeks", "3 weeks", "6 weeks", "4 weeks", "5 weeks", "4 weeks"];
const VALID_YEARS = 2;

const initials = (s: string) =>
  s
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

const tile = "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary";

const IssuerMark: React.FC<{ name: string; size?: "sm" | "md" }> = ({ name, size = "md" }) => (
  <span
    aria-hidden
    className={cn(
      "flex shrink-0 items-center justify-center rounded-xl border border-border bg-muted/40 font-display font-bold text-primary",
      size === "md" ? "h-11 w-11 text-sm" : "h-9 w-9 text-xs"
    )}
  >
    {initials(name)}
  </span>
);

export const ProCertificationsView: React.FC<ProCertificationsViewProps> = ({
  user,
  onAddCertification,
  onRemoveCertification,
  onOpenDrawer,
  onNavigateToQuiz,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [certName, setCertName] = useState("");
  const [certIssuer, setCertIssuer] = useState("");
  const [certDate, setCertDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [showAllPopular, setShowAllPopular] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [refreshedAt, setRefreshedAt] = useState(() => new Date());

  const thisYear = new Date().getFullYear();

  const certItems = (user.ce || []).map((x, i) => {
    const parts = String(x).split(" · ");
    const yearNum = parseInt(parts[2] || "", 10) || thisYear;
    return {
      index: i,
      title: parts[0] || x,
      issuer: parts[1] || "Accredited Provider",
      year: String(yearNum),
      validTill: String(yearNum + VALID_YEARS),
      active: yearNum + VALID_YEARS >= thisYear,
    };
  });

  const latest = certItems[certItems.length - 1];
  const activeCount = certItems.filter((c) => c.active).length;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certName.trim()) return;
    const yearStr = certDate ? new Date(certDate).getFullYear().toString() : "2024";
    const fullStr = `${certName.trim()}${certIssuer ? ` · ${certIssuer.trim()}` : ""} · ${yearStr}`;
    onAddCertification(fullStr);
    setCertName("");
    setCertIssuer("");
    setShowAddForm(false);
  };

  const handleShare = async () => {
    if (!latest) return;
    const text = `${user.name} earned ${latest.title} (${latest.issuer}) on IAmTalento`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* clipboard may be blocked; still show feedback */
    }
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const assessments = Object.entries(user.as || {});
  const nextQuizSkill = (assessments.find(([, s]) => s < 60) || assessments[0] || [])[0] as string | undefined;
  const popular = showAllPopular ? POPULAR_CERTS : POPULAR_CERTS.slice(0, 5);

  const inputCls = "h-10 rounded-xl text-sm";

  return (
    <div className="space-y-5">
      <ProHero
        icon={<Award />}
        title="My Certifications"
        subtitle="Keep all your certifications in one place. Skill tests you pass on IAmTalento give you a certificate you can download, share and showcase your achievements."
        aside={
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="flex w-full items-center gap-3 rounded-2xl bg-white/15 px-4 py-3 text-left text-white ring-1 ring-white/30 backdrop-blur-sm transition-colors hover:bg-white/25 lg:w-72"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold">Build Your Career</span>
              <span className="block text-[11px] text-white/85">Get certified. Stand out. Grow faster.</span>
            </span>
            <Pencil className="h-4 w-4 shrink-0 text-white/80" />
          </button>
        }
      />

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[3fr_2fr]">
        {/* My certifications list */}
        <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className={tile}>
                <Award className="h-4 w-4" />
              </span>
              <div>
                <h3 className="font-display text-sm font-semibold text-foreground">
                  My Certifications ({certItems.length})
                </h3>
                <p className="text-xs text-muted-foreground">Your earned certifications and completed skill tests</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Live / Updated{" "}
                {refreshedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                {" · "}
                {refreshedAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
              </span>
              <button
                type="button"
                aria-label="Refresh"
                onClick={() => setRefreshedAt(new Date())}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {showAddForm && (
            <form onSubmit={handleAdd} className="space-y-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
              <div className="flex items-center justify-between">
                <h4 className="flex items-center gap-2 font-display text-sm font-semibold text-foreground">
                  <Plus className="h-4 w-4 text-primary" /> Add new certification
                </h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddForm(false)}
                  className="h-7 text-xs text-muted-foreground"
                >
                  Cancel
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Certification name</label>
                  <Input
                    placeholder="e.g. AWS Certified Solutions Architect"
                    value={certName}
                    onChange={(e) => setCertName(e.target.value)}
                    className={inputCls}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
                    Issuing organization
                  </label>
                  <Input
                    placeholder="e.g. Amazon Web Services"
                    value={certIssuer}
                    onChange={(e) => setCertIssuer(e.target.value)}
                    className={inputCls}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Date issued</label>
                  <Input
                    type="date"
                    value={certDate}
                    onChange={(e) => setCertDate(e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)} className="rounded-xl text-xs">
                  Cancel
                </Button>
                <Button type="submit" className="rounded-xl text-xs">
                  Save certification
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-2.5">
            {certItems.length === 0 ? (
              <p className="py-6 text-center text-xs text-muted-foreground">
                No certifications listed yet. Use &quot;Add Certification&quot; to showcase your credentials.
              </p>
            ) : (
              certItems.map((item) => (
                <div
                  key={item.index}
                  className="flex flex-col gap-3 rounded-xl border border-border bg-background p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <IssuerMark name={item.issuer} />
                    <div className="min-w-0">
                      <div className="truncate font-display text-sm font-semibold text-foreground">{item.title}</div>
                      <div className="truncate text-[11px] text-muted-foreground">{item.issuer}</div>
                      <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Calendar className="h-3 w-3" /> Issued on {item.year} · Valid till {item.validTill}
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                      <Check className="h-3 w-3" /> Verified
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 rounded-lg border-primary/30 px-3 text-xs font-semibold text-primary hover:bg-primary/5 hover:text-primary"
                      onClick={() => onOpenDrawer({ type: "certificate", key: `ce:${item.index}` })}
                    >
                      View Certificate
                    </Button>
                    <button
                      type="button"
                      aria-label={`Remove ${item.title}`}
                      onClick={() => onRemoveCertification(item.index)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-primary/40 py-2.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/5"
          >
            <Plus className="h-4 w-4" /> Add Certification
          </button>
        </div>

        {/* Latest earned certificate + stats */}
        <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="flex items-center gap-3 font-display text-sm font-semibold text-foreground">
            <span className={tile}>
              <BadgeCheck className="h-4 w-4" />
            </span>
            Latest Earned Certificate
          </h3>

          {latest ? (
            <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <IssuerMark name={latest.issuer} size="sm" />
                  <span className="truncate font-display text-sm font-bold text-foreground">{latest.issuer}</span>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                  <Check className="h-3 w-3" /> Earned recently
                </span>
              </div>

              <div className="grid grid-cols-[1fr_auto] items-start gap-3">
                <div className="min-w-0">
                  <h4 className="font-display text-base font-bold leading-snug text-foreground">{latest.title}</h4>
                  <div className="text-xs text-muted-foreground">{latest.issuer}</div>
                  <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                    Demonstrated proficiency in {latest.title}, issued by {latest.issuer}.
                  </p>
                </div>
                <div className="hidden w-24 shrink-0 rounded-lg border border-border bg-background p-2 text-center shadow-sm sm:block">
                  <Award className="mx-auto h-4 w-4 text-primary" />
                  <div className="mt-1 text-[8px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Certificate
                  </div>
                  <div className="truncate font-display text-[11px] font-bold text-foreground">{user.name}</div>
                  <div className="mx-auto mt-1 h-px w-10 bg-border" />
                  <div className="mt-1 truncate text-[8px] text-primary">{latest.title}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 border-t border-border pt-3 text-[11px]">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  <span>
                    Issued on
                    <b className="block text-foreground">{latest.year}</b>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span>
                    Valid till
                    <b className="block text-foreground">{latest.validTill}</b>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  <span>
                    Verified
                    <b className="block text-foreground">Yes</b>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  className="h-9 gap-1.5 rounded-lg text-xs font-semibold"
                  onClick={() => onOpenDrawer({ type: "certificate", key: `ce:${latest.index}` })}
                >
                  <Download className="h-3.5 w-3.5" /> Download Certificate
                </Button>
                <Button
                  variant="outline"
                  className="h-9 gap-1.5 rounded-lg border-primary/30 text-xs font-semibold text-primary hover:bg-primary/5 hover:text-primary"
                  onClick={handleShare}
                >
                  {linkCopied ? <Link2 className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
                  {linkCopied ? "Copied" : "Share Certificate"}
                </Button>
              </div>

              <p className="flex items-center gap-1.5 rounded-lg bg-primary/5 px-3 py-2 text-[11px] text-primary">
                <Sparkles className="h-3.5 w-3.5 shrink-0" /> Showcase your skills and get noticed by top employers.
              </p>
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-border py-8 text-center text-xs text-muted-foreground">
              Add your first certification to feature it here.
            </p>
          )}

          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Total Certificates", value: certItems.length, icon: <Award className="h-4 w-4" /> },
              { label: "Verified", value: certItems.length, icon: <CheckCircle2 className="h-4 w-4" /> },
              { label: "Active (Valid) Certificates", value: activeCount, icon: <Calendar className="h-4 w-4" /> },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2 rounded-xl border border-border bg-background p-3">
                <span className={tile}>{s.icon}</span>
                <div className="min-w-0">
                  <div className="font-display text-lg font-bold leading-none text-foreground">{s.value}</div>
                  <div className="mt-0.5 text-[10px] leading-tight text-muted-foreground">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skill test certificates */}
      <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className={tile}>
              <ShieldCheck className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-display text-sm font-semibold text-foreground">Skill test certificates</h3>
              <p className="text-xs text-muted-foreground">Pass a skill test with 60% or more to earn a certificate</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-lg border-primary/30 text-xs font-semibold text-primary hover:bg-primary/5 hover:text-primary"
            disabled={!nextQuizSkill || !onNavigateToQuiz}
            onClick={() => nextQuizSkill && onNavigateToQuiz && onNavigateToQuiz(nextQuizSkill)}
          >
            Take a skill test
          </Button>
        </div>

        {assessments.length === 0 ? (
          <p className="py-4 text-center text-xs text-muted-foreground">
            No skill tests taken yet. Take a test to earn a verifiable certificate.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {assessments.map(([skill, score]) => {
              const passed = score >= 60;
              return (
                <div key={skill} className="flex items-center justify-between gap-3 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <MatchRing percent={score} size={44} />
                    <div className="min-w-0">
                      <div className="truncate font-display text-sm font-semibold text-foreground">{skill}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {passed ? "Passed. Certificate ready" : "Below the 60% pass mark"}
                      </div>
                    </div>
                  </div>
                  {passed ? (
                    <Button
                      size="sm"
                      className="h-8 gap-1.5 rounded-lg px-3 text-xs font-semibold"
                      onClick={() => onOpenDrawer({ type: "certificate", key: `skill:${skill}` })}
                    >
                      <Download className="h-3 w-3" /> Download
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="h-8 rounded-lg px-3 text-xs font-semibold"
                      onClick={() => onNavigateToQuiz && onNavigateToQuiz(skill)}
                    >
                      Retake test
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Popular certifications */}
      <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className={tile}>
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-display text-sm font-semibold text-foreground">Popular certifications to add next</h3>
              <p className="text-xs text-muted-foreground">Boost your skills with industry-recognized certifications</p>
            </div>
          </div>
          {POPULAR_CERTS.length > 5 && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-lg border-primary/30 text-xs font-semibold text-primary hover:bg-primary/5 hover:text-primary"
              onClick={() => setShowAllPopular((v) => !v)}
            >
              {showAllPopular ? "Show fewer" : "View All Certifications"}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {popular.map((cert, idx) => (
            <div
              key={cert[0]}
              className="flex flex-col justify-between gap-3 rounded-xl border border-border bg-background p-3.5"
            >
              <div className="flex items-start gap-2.5">
                <IssuerMark name={cert[1]} size="sm" />
                <div className="min-w-0">
                  <div className="font-display text-xs font-semibold leading-snug text-foreground">{cert[0]}</div>
                  <div className="text-[11px] text-muted-foreground">{cert[1]}</div>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-border pt-2.5">
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3" /> {COURSE_WEEKS[idx % COURSE_WEEKS.length]}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    aria-label={`Add ${cert[0]} to profile`}
                    onClick={() => {
                      setCertName(cert[0]);
                      setCertIssuer(cert[1]);
                      setShowAddForm(true);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-primary hover:bg-primary/10"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(cert[0] + " " + cert[1] + " course")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-7 items-center gap-1 rounded-lg bg-primary px-2.5 text-[11px] font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    Find course <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
