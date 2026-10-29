import React, { useEffect, useRef, useState } from "react";
import {
  Bot,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  Loader2,
  Sparkles,
  Upload,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProHero } from "../ProHero";
import {
  getResumeSignedUrl,
  loadLiveProfile,
  saveCandidatePayload,
  uploadResumeFile,
  type LiveProfile,
} from "@/services/candidate/profile";
import type { ProUser } from "@/data/proData";
import type { ProView } from "../proTypes";

interface Props {
  fallbackUser?: ProUser;
  onNavigate: (view: ProView) => void;
  onToast: (msg: string) => void;
}

export const LiveMyResume: React.FC<Props> = ({ fallbackUser, onNavigate, onToast }) => {
  const [live, setLive] = useState<LiveProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const reload = async () => {
    setLoading(true);
    try {
      const d = await loadLiveProfile();
      setLive(d);
      if (d?.profile?.resume_path) {
        const s = await getResumeSignedUrl(d.profile.resume_path);
        setSignedUrl(s);
      } else if (d?.profile?.resume_url) {
        setSignedUrl(d.profile.resume_url);
      } else {
        setSignedUrl(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reload();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!live?.profile?.id) {
      onToast("Sign in with your real candidate account to upload and store a private PDF/DOCX resume.");
      return;
    }
    setUploading(true);
    try {
      const { path, signedUrl: sUrl } = await uploadResumeFile(file, live.profile.id);
      const updated = await saveCandidatePayload({ profile: { resume_path: path } });
      setLive(updated);
      setSignedUrl(sUrl);
      onToast("Resume uploaded and linked to One-Click Job Apply!");
    } catch (err: any) {
      onToast(err?.message || "Failed to upload resume");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  const p = live?.profile;
  const checks = [
    { label: "Resume file uploaded (PDF / DOCX)", ok: Boolean(p?.resume_path || p?.resume_url) },
    { label: "Professional headline & target role set", ok: Boolean(p?.headline || p?.job_role || fallbackUser?.head) },
    { label: "Primary industry selected", ok: Boolean(p?.industry || fallbackUser?.tag) },
    { label: "At least 3 searchable skills added", ok: (live ? live.skills.length : fallbackUser?.sk?.length ?? 0) >= 3 },
    { label: "Education history added", ok: (live ? live.educations.length : fallbackUser?.ed?.length ?? 0) >= 1 },
    { label: "Contact email & phone present", ok: Boolean((p?.email && p?.phone) || (fallbackUser?.email && (fallbackUser?.phone || fallbackUser?.ph))) },
  ];
  const atsScore = Math.round((checks.filter((c) => c.ok).length / checks.length) * 100);

  return (
    <div className="space-y-6">
      <ProHero
        icon={<FileText />}
        title="My Resume & ATS Readiness"
        subtitle="Manage your uploaded PDF/DOCX resume for One-Click Job Apply or generate a recruiter-ready CV in the AI Resume Builder."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upload & Preview Card */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold font-display">Uploaded Resume Document</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Stored in encrypted private storage (`resumes` bucket) — only employers whose jobs you apply to can view it.
              </p>
            </div>
            {p?.resume_path ? (
              <Badge className="bg-emerald-600 text-white hover:bg-emerald-600 gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Active CV on File
              </Badge>
            ) : (
              <Badge variant="outline">No File Uploaded Yet</Badge>
            )}
          </div>

          <div className="rounded-xl border-2 border-dashed border-border bg-background p-8 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FileText className="h-6 w-6" />
            </div>
            {p?.resume_path ? (
              <>
                <p className="text-sm font-semibold text-foreground">{p.resume_path.split("/").pop()}</p>
                <p className="text-xs text-muted-foreground">Ready for One-Click Apply across all open roles.</p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-foreground">Upload your Resume (PDF or DOCX, up to 5 MB)</p>
                <p className="text-xs text-muted-foreground">
                  Keep an updated CV attached so recruiters can review your profile immediately on application.
                </p>
              </>
            )}

            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              <Button
                type="button"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
                className="gap-1.5"
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {uploading ? "Uploading..." : p?.resume_path ? "Replace Resume File" : "Upload Resume File"}
              </Button>
              {signedUrl && (
                <Button asChild variant="outline" className="gap-1.5">
                  <a href={signedUrl} target="_blank" rel="noreferrer">
                    <Download className="h-4 w-4" /> Preview / Download CV
                  </a>
                </Button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleUpload}
                className="hidden"
              />
            </div>
          </div>

          <div className="rounded-xl border border-primary/25 bg-primary/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <p className="text-sm font-bold flex items-center gap-1.5">
                <Bot className="h-4 w-4 text-primary" /> Need a cleaner ATS-formatted resume?
              </p>
              <p className="text-xs text-muted-foreground">
                Use the AI Resume Builder to generate a tailored PDF from your verified profile data.
              </p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => onNavigate("resume")} className="shrink-0 gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Open AI Resume Builder
            </Button>
          </div>
        </div>

        {/* ATS Readiness Checklist */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold font-display">ATS Readiness</h2>
            <Badge variant="secondary" className="font-bold text-primary">
              {atsScore}%
            </Badge>
          </div>
          <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${atsScore}%` }} />
          </div>
          <div className="space-y-2.5 pt-1">
            {checks.map((c) => (
              <div key={c.label} className="flex items-start gap-2 text-xs">
                {c.ok ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                )}
                <span className={c.ok ? "text-foreground" : "text-muted-foreground"}>{c.label}</span>
              </div>
            ))}
          </div>
          {atsScore < 100 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onNavigate("edit-profile")}
              className="w-full text-xs gap-1.5"
            >
              Complete Missing Profile Items <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
