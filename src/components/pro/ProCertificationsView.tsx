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
  Star,
  Clock,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ProUser, POPULAR_CERTS } from "@/data/proData";
import { ProDrawerState } from "./proTypes";

interface ProCertificationsViewProps {
  user: ProUser;
  onAddCertification: (certStr: string) => void;
  onRemoveCertification: (index: number) => void;
  onOpenDrawer: (drawer: ProDrawerState) => void;
  onNavigateToQuiz?: (skill: string) => void;
}

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

  const certItems = (user.ce || []).map((x, i) => {
    const parts = String(x).split(" · ");
    return {
      index: i,
      title: parts[0] || x,
      issuer: parts[1] || "Accredited Provider",
      year: parts[2] || "2024",
    };
  });

  const latest = certItems[certItems.length - 1];

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

  const assessments = Object.entries(user.as || {});

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
              <Award className="w-3.5 h-3.5" /> Verified Credentials
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-display">
              My Certifications & Test Badges
            </h1>
            <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
              Keep all your verified licenses, cloud certificates, and proctored assessment proofs in one shareable hub. Download accredited credentials anytime.
            </p>
          </div>
          <Button
            onClick={() => setShowAddForm(true)}
            className="rounded-xl gap-2 font-medium shrink-0 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Certification
          </Button>
        </div>
      </div>

      {/* Latest Earned Certificate Showcase */}
      {latest && (
        <div className="bg-card border border-primary/30 rounded-2xl p-6 shadow-sm relative overflow-hidden space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
              <Star className="w-3.5 h-3.5" /> Latest Earned Credential
            </span>
            <span className="text-xs text-muted-foreground">Verified Credential</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground font-display">
                {latest.title}
              </h2>
              <div className="text-sm font-medium text-primary">{latest.issuer}</div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Demonstrated competency in verified engineering standards and technical domain best practices.
              </p>

              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <span>Issued: <b>{latest.year}</b></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>Valid through: <b>2026</b></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Verified on Talento</span>
                </div>
              </div>
            </div>

            {/* Certificate Preview Card */}
            <div className="border border-border/80 rounded-xl p-4 bg-muted/20 text-center space-y-2 shadow-inner">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <Award className="w-5 h-5" />
              </div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                Certificate of Completion
              </div>
              <div className="font-bold text-foreground text-sm truncate">{user.name}</div>
              <div className="text-xs text-primary font-medium truncate">{latest.title}</div>
              <div className="pt-2 flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-lg text-xs h-8 gap-1.5 w-full bg-background"
                  onClick={() => onOpenDrawer({ type: "certificate", key: `ce:${latest.index}` })}
                >
                  <Download className="w-3.5 h-3.5" /> View / Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Certification Modal / Inline Form */}
      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" /> Add New Certification
            </h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-muted-foreground"
            >
              Cancel
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-foreground block mb-1">Certification Name</label>
              <Input
                placeholder="e.g. AWS Certified Solutions Architect"
                value={certName}
                onChange={(e) => setCertName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground block mb-1">Issuing Organization</label>
              <Input
                placeholder="e.g. Amazon Web Services"
                value={certIssuer}
                onChange={(e) => setCertIssuer(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-foreground block mb-1">Date Issued</label>
              <Input
                type="date"
                value={certDate}
                onChange={(e) => setCertDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowAddForm(false)} className="rounded-xl text-xs">
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl text-xs">
              Save Certification
            </Button>
          </div>
        </form>
      )}

      {/* All Certifications List */}
      <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground text-base flex items-center gap-2">
            <Award className="w-4 h-4 text-primary" /> Earned Certifications ({certItems.length})
          </h3>
        </div>

        <div className="divide-y divide-border/60">
          {certItems.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted-foreground">
              No certifications listed yet. Click "+ Add Certification" to showcase your credentials.
            </p>
          ) : (
            certItems.map((item) => (
              <div
                key={item.index}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 border border-primary/20">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm">{item.title}</div>
                    <div className="text-muted-foreground text-[11px]">
                      {item.issuer} • Issued {item.year}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl text-xs h-8 gap-1.5 bg-background"
                    onClick={() => onOpenDrawer({ type: "certificate", key: `ce:${item.index}` })}
                  >
                    <Download className="w-3 h-3" /> View Credential
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-xl text-xs h-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 px-2"
                    onClick={() => onRemoveCertification(item.index)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Skill Test Certificates */}
      <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" /> Proctored Skill Test Certificates
            </h3>
            <p className="text-xs text-muted-foreground">Score 60% or higher on any proctored assessment to earn a verifiable certificate.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {assessments.map(([skill, score]) => {
            const passed = score >= 60;
            return (
              <div
                key={skill}
                className="p-4 rounded-xl border border-border/70 bg-background space-y-2.5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground text-sm">{skill}</span>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-bold",
                      passed
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {score}%
                  </span>
                </div>

                <div className="text-xs text-muted-foreground">
                  {passed ? "Assessment Passed • Verifiable credential issued" : "Assessment below certification threshold (60%)"}
                </div>

                <div className="pt-1">
                  {passed ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs rounded-lg gap-1.5 bg-card"
                      onClick={() => onOpenDrawer({ type: "certificate", key: `skill:${skill}` })}
                    >
                      <Download className="w-3 h-3" /> Download Certificate
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="default"
                      className="w-full text-xs rounded-lg gap-1.5"
                      onClick={() => onNavigateToQuiz && onNavigateToQuiz(skill)}
                    >
                      Retake Test
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Popular Certifications to Add */}
      <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> Popular Industry Certifications
            </h3>
            <p className="text-xs text-muted-foreground">Boost your profile visibility and salary potential.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {POPULAR_CERTS.slice(0, 6).map((cert, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-border/60 bg-muted/20 space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="font-semibold text-foreground text-xs">{cert[0]}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{cert[1]} • {cert[2]}</div>
              </div>
              <div className="pt-2 flex items-center justify-between border-t border-border/50 text-xs">
                <button
                  onClick={() => {
                    setCertName(cert[0]);
                    setCertIssuer(cert[1]);
                    setShowAddForm(true);
                  }}
                  className="text-primary font-medium hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add to profile
                </button>
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(cert[0] + " " + cert[1])}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  Course info <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
