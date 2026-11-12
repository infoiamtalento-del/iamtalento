import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft, Briefcase, CalendarDays, Crown, Download, FileText, Mail, MapPin, MessageSquare, PauseCircle, Phone, Save, Share2, Star, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { downloadCirPdf } from "@/lib/cirPdf";
import {
  APPLICATION_STAGES, STAGE_LABEL, changeStage, getApplication, releaseHold, saveApplicationNote, type ApplicationDetail,
} from "@/services/employer/ats";
import { getCandidateCir, isPaymentRequired } from "@/services/employer/talent";
import { rpc } from "@/services/db";
import { Avatar, ErrorState, Loading, StageBadge, fmtDate, fmtDateTime, relativeTime } from "./employerUi";
import { TalentPaywall } from "./TalentPaywall";

interface Props {
  applicationId: string;
  contact?: { name?: string; email?: string };
  onBack: () => void;
  onChanged: () => void;
  onToast: (message: string) => void;
}

const TABS = ["Overview", "Resume", "Activity", "Interviews", "Notes"] as const;
type Tab = (typeof TABS)[number];

export function EmployerApplicantDetail({ applicationId, contact, onBack, onChanged, onToast }: Props) {
  const [detail, setDetail] = useState<ApplicationDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("Overview");
  const [stage, setStage] = useState<string>("Applied");
  const [stageNote, setStageNote] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [paywall, setPaywall] = useState<"cir" | "cv" | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [iv, setIv] = useState({ date: "", time: "", mode: "video", url: "", duration: "45" });

  const load = useCallback(async () => {
    setError(null);
    try {
      const d = await getApplication(applicationId);
      setDetail(d);
      setStage(d.stage);
      setNote(d.recruiter_note ?? "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load this application.");
    }
  }, [applicationId]);

  useEffect(() => { setDetail(null); void load(); }, [load]);

  if (error) {
    return (
      <div className="employer-workspace space-y-4">
        <Button variant="ghost" className="px-0 text-primary" onClick={onBack}><ArrowLeft className="mr-1.5 h-4 w-4" />Back to applications</Button>
        <ErrorState message={error} onRetry={load} />
      </div>
    );
  }
  if (!detail) return <div className="employer-workspace"><Loading label="Loading application" /></div>;

  const c = detail.candidate;
  const onHold = detail.stage === "On Hold";

  const applyStage = async () => {
    if (stage === detail.stage && !stageNote.trim()) return onToast("Choose a different stage or add a note.");
    setSaving(true);
    try {
      await changeStage(detail.id, stage, stageNote.trim() || undefined);
      setStageNote("");
      onToast(`Moved to ${STAGE_LABEL[stage] ?? stage}.`);
      await load();
      onChanged();
    } catch (e) {
      onToast(e instanceof Error ? e.message : "Could not update the status.");
    } finally {
      setSaving(false);
    }
  };

  const release = async () => {
    setSaving(true);
    try {
      await releaseHold(detail.id);
      onToast("Released from hold.");
      await load();
      onChanged();
    } catch (e) {
      onToast(e instanceof Error ? e.message : "Could not release the hold.");
    } finally {
      setSaving(false);
    }
  };

  const schedule = async () => {
    if (!iv.date || !iv.time) return onToast("Choose an interview date and time.");
    setSaving(true);
    try {
      await rpc("schedule_interview", {
        p_app: detail.id, p_at: new Date(`${iv.date}T${iv.time}`).toISOString(), p_mode: iv.mode,
        p_duration: Number(iv.duration) || 45, p_url: iv.url.trim() || null,
      });
      onToast("Interview scheduled and candidate notified.");
      setIv({ date: "", time: "", mode: "video", url: "", duration: "45" });
      await load();
      onChanged();
    } catch (e) {
      onToast(e instanceof Error ? e.message : "Could not schedule the interview.");
    } finally {
      setSaving(false);
    }
  };

  const interviewStatus = async (id: string, status: "completed" | "cancelled" | "no_show") => {
    try {
      await rpc("update_interview_status", { p_interview: id, p_status: status });
      onToast("Interview updated.");
      await load();
    } catch (e) {
      onToast(e instanceof Error ? e.message : "Could not update the interview.");
    }
  };

  const saveNote = async () => {
    setSaving(true);
    try {
      await saveApplicationNote(detail.id, note);
      onToast("Note saved.");
    } catch (e) {
      onToast(e instanceof Error ? e.message : "Could not save the note.");
    } finally {
      setSaving(false);
    }
  };

  const share = async () => {
    const url = `${window.location.origin}/talento-pro?view=pipe&role=employer&application=${detail.id}`;
    try {
      await navigator.clipboard.writeText(url);
      onToast("Link copied. Teammates with access to this company can open it.");
    } catch {
      onToast(url);
    }
  };

  const downloadCir = async () => {
    if (!detail.cir_available) return onToast("This candidate has not generated a CIR report yet.");
    if (!detail.access.cir) return setPaywall("cir");
    setDownloading(true);
    try {
      await downloadCirPdf(await getCandidateCir(detail.candidate_id));
      onToast("CIR report downloaded.");
    } catch (e) {
      if (isPaymentRequired(e)) setPaywall("cir");
      else onToast(e instanceof Error ? e.message : "Could not download the report.");
    } finally {
      setDownloading(false);
    }
  };

  const downloadCv = async () => {
    if (!detail.access.cv) return setPaywall("cv");
    try {
      if (c.resume_path) {
        const { data, error: signError } = await supabase.storage.from("resumes").createSignedUrl(c.resume_path, 120);
        if (signError || !data?.signedUrl) throw new Error("Could not open the CV.");
        window.open(data.signedUrl, "_blank", "noopener");
        return;
      }
      if (c.resume_url) {
        window.open(c.resume_url, "_blank", "noopener");
        return;
      }
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF();
      pdf.setFontSize(20); pdf.text(c.name, 20, 25);
      pdf.setFontSize(11);
      pdf.text(pdf.splitTextToSize([
        c.headline ?? "", c.city ?? "", `Experience: ${c.experience_years ?? 0} years`, `Skills: ${c.skills.join(", ")}`,
        `Certifications: ${c.certifications.join(", ") || "—"}`, "", detail.cover_note ?? "",
      ].filter((x) => x !== undefined).join("\n"), 170), 20, 40);
      pdf.save(`${c.name.replace(/\s+/g, "-")}-profile.pdf`);
      onToast("No CV was uploaded, so a profile summary was downloaded.");
    } catch (e) {
      onToast(e instanceof Error ? e.message : "Could not download the CV.");
    }
  };

  const stats = [
    { icon: CalendarDays, label: "Application date", value: fmtDate(detail.applied_at) },
    { icon: MessageSquare, label: "Current stage", value: STAGE_LABEL[detail.stage] ?? detail.stage },
    { icon: Users, label: "Talent CIR ID", value: c.talent_cir_id ?? "Not issued" },
    { icon: Star, label: "Match score", value: detail.match_score != null ? `${Math.round(detail.match_score)}%` : "Not scored" },
  ];

  return (
    <div className="employer-workspace space-y-4">
      <Button variant="ghost" className="px-0 text-primary" onClick={onBack}><ArrowLeft className="mr-1.5 h-4 w-4" />Back to applications</Button>

      <header className="workspace-panel flex flex-wrap items-start gap-5">
        <Avatar name={c.name} src={c.photo_url} size={64} />
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold">{c.name} <StageBadge stage={detail.stage} className="align-middle" /></h1>
          <p className="mt-2 text-xs text-muted-foreground">Applied for {detail.job_title} · {c.experience_years ?? 0} yrs experience{c.verified ? " · Verified" : ""}</p>
          <div className="mt-3 flex flex-wrap gap-5 text-xs text-muted-foreground">
            {c.email && <span className="flex items-center gap-2"><Mail size={14} />{c.email}</span>}
            {c.phone && <span className="flex items-center gap-2"><Phone size={14} />{c.phone}</span>}
            {c.city && <span className="flex items-center gap-2"><MapPin size={14} />{c.city}</span>}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => void share()}><Share2 className="mr-1.5 h-4 w-4" />Share Profile</Button>
          <Button onClick={() => void downloadCir()} disabled={downloading} aria-label="Unlock and download CIR report">
            <Crown className="mr-1.5 h-4 w-4" />{detail.access.cir ? "Download CIR Report" : "Unlock & Download CIR Report"}
          </Button>
          <Button variant="outline" onClick={() => void downloadCv()}><Download className="mr-1.5 h-4 w-4" />Download CV</Button>
        </div>
      </header>

      <div className="workspace-panel grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex gap-3">
            <div className="workspace-icon"><Icon size={18} /></div>
            <div className="min-w-0"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 truncate text-sm font-bold">{value}</p></div>
          </div>
        ))}
      </div>

      <nav className="flex gap-2 overflow-x-auto border-b border-border" aria-label="Candidate sections">
        {TABS.map((t) => (
          <Button key={t} variant="ghost" onClick={() => setTab(t)} aria-current={tab === t ? "page" : undefined}
            className={tab === t ? "rounded-none border-b-2 border-primary text-primary" : "rounded-none text-muted-foreground"}>{t}</Button>
        ))}
      </nav>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,2.2fr)_minmax(260px,1fr)]">
        <section className="workspace-panel">
          {tab === "Overview" && (
            <>
              <h2 className="text-lg font-bold">Update application status</h2>
              <p className="mt-1 text-xs text-muted-foreground">Every change is recorded with a timestamp and shared with the candidate.</p>
              {detail.stage === "Withdrawn" ? (
                <p className="mt-4 text-sm text-muted-foreground">The candidate withdrew this application.</p>
              ) : (
                <div className="mt-5 space-y-5">
                  <div className="flex flex-wrap gap-2" role="group" aria-label="Application status">
                    {APPLICATION_STAGES.map((s) => (
                      <Button key={s} size="sm" variant={stage === s ? "default" : "outline"} onClick={() => setStage(s)} aria-pressed={stage === s}>
                        {s === "On Hold" && <PauseCircle className="mr-1.5 h-3.5 w-3.5" />}{STAGE_LABEL[s]}
                      </Button>
                    ))}
                  </div>
                  <label className="workspace-field"><span>Note for the history (optional)</span>
                    <Textarea rows={3} maxLength={1000} value={stageNote} onChange={(e) => setStageNote(e.target.value)} placeholder="Reason for this decision" /></label>
                  <div className="flex flex-wrap gap-2">
                    <Button disabled={saving} onClick={() => void applyStage()}><Save className="mr-1.5 h-4 w-4" />Save status</Button>
                    {onHold && <Button variant="outline" disabled={saving} onClick={() => void release()}>Release from hold</Button>}
                  </div>
                </div>
              )}
              <h3 className="mt-8 text-sm font-bold">Cover note</h3>
              <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{detail.cover_note || "No cover note provided."}</p>
            </>
          )}

          {tab === "Resume" && (
            <>
              <h2 className="text-lg font-bold">Profile</h2>
              <p className="mt-3 text-sm">{c.headline || "No headline"} · {c.experience_years ?? 0} years experience</p>
              {c.about && <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">{c.about}</p>}
              <h3 className="mt-6 text-sm font-semibold">Skills</h3>
              <div className="mt-3 flex flex-wrap gap-2">{c.skills.length ? c.skills.map((s) => <span key={s} className="workspace-chip">{s}</span>) : <span className="text-sm text-muted-foreground">No skills listed.</span>}</div>
              <h3 className="mt-6 text-sm font-semibold">Certifications</h3>
              <p className="mt-3 text-sm text-muted-foreground">{c.certifications.join(" · ") || "No certifications supplied."}</p>
              <Button className="mt-6" variant="outline" onClick={() => void downloadCv()}><FileText className="mr-1.5 h-4 w-4" />Download CV</Button>
            </>
          )}

          {tab === "Activity" && (
            <>
              <h2 className="text-lg font-bold">Status history</h2>
              {detail.history.length === 0 ? <p className="py-8 text-sm text-muted-foreground">No updates yet.</p> : (
                <ol className="mt-3">
                  {[...detail.history].reverse().map((h) => (
                    <li key={h.id} className="flex gap-3 border-b border-border py-4 last:border-0">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">
                          {h.from ? <>{STAGE_LABEL[h.from] ?? h.from} → {STAGE_LABEL[h.to] ?? h.to}</> : <>{STAGE_LABEL[h.to] ?? h.to}</>}
                        </p>
                        {h.message && <p className="mt-1 text-xs text-muted-foreground">{h.message}</p>}
                      </div>
                      <time className="shrink-0 text-xs text-muted-foreground" dateTime={h.at} title={fmtDateTime(h.at)}>{fmtDateTime(h.at)}</time>
                    </li>
                  ))}
                </ol>
              )}
            </>
          )}

          {tab === "Interviews" && (
            <>
              <h2 className="text-lg font-bold">Interviews</h2>
              {detail.interviews.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">No interview scheduled.</p> : (
                <ul className="mt-3 divide-y divide-border">
                  {detail.interviews.map((i) => (
                    <li key={i.id} className="flex flex-wrap items-center gap-3 py-3 text-sm">
                      <div className="mr-auto min-w-0">
                        <p className="font-semibold">{fmtDateTime(i.scheduled_at)} · {i.duration_min} min · {i.mode}</p>
                        {i.meeting_url && <a className="text-xs text-primary hover:underline" href={i.meeting_url} target="_blank" rel="noopener noreferrer">Meeting link</a>}
                      </div>
                      <span className="workspace-chip">{i.status.replace("_", " ")}</span>
                      {i.status === "scheduled" && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => void interviewStatus(i.id, "completed")}>Completed</Button>
                          <Button size="sm" variant="outline" onClick={() => void interviewStatus(i.id, "no_show")}>No show</Button>
                          <Button size="sm" variant="ghost" onClick={() => void interviewStatus(i.id, "cancelled")}>Cancel</Button>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              {!["Rejected", "Withdrawn"].includes(detail.stage) && (
                <div className="mt-6 grid gap-3 border-t border-border pt-5 sm:grid-cols-2">
                  <h3 className="text-sm font-bold sm:col-span-2">Schedule an interview</h3>
                  <label className="workspace-field"><span>Date</span><Input type="date" value={iv.date} onChange={(e) => setIv({ ...iv, date: e.target.value })} /></label>
                  <label className="workspace-field"><span>Time</span><Input type="time" value={iv.time} onChange={(e) => setIv({ ...iv, time: e.target.value })} /></label>
                  <label className="workspace-field"><span>Mode</span>
                    <select value={iv.mode} onChange={(e) => setIv({ ...iv, mode: e.target.value })}><option value="video">Video</option><option value="phone">Phone</option><option value="onsite">On-site</option><option value="ai">AI interview</option></select></label>
                  <label className="workspace-field"><span>Duration (minutes)</span><Input type="number" min={10} max={480} value={iv.duration} onChange={(e) => setIv({ ...iv, duration: e.target.value })} /></label>
                  <label className="workspace-field sm:col-span-2"><span>Meeting link (optional)</span><Input value={iv.url} onChange={(e) => setIv({ ...iv, url: e.target.value })} placeholder="https://" /></label>
                  <div className="sm:col-span-2"><Button disabled={saving} onClick={() => void schedule()}><CalendarDays className="mr-1.5 h-4 w-4" />Schedule interview</Button></div>
                </div>
              )}
            </>
          )}

          {tab === "Notes" && (
            <>
              <h2 className="text-lg font-bold">Private recruiter notes</h2>
              <Textarea aria-label="Private recruiter notes" className="mt-4" rows={8} maxLength={5000} value={note} onChange={(e) => setNote(e.target.value)} />
              <Button className="mt-4" disabled={saving} onClick={() => void saveNote()}><Save className="mr-1.5 h-4 w-4" />Save note</Button>
            </>
          )}
        </section>

        <aside className="workspace-panel space-y-5">
          <div className="flex gap-3 border-b border-border pb-4">
            <Avatar name={c.name} src={c.photo_url} size={40} />
            <div className="min-w-0"><h2 className="truncate text-sm font-bold">{c.name}</h2><p className="mt-1 truncate text-xs text-muted-foreground">{detail.job_title}</p></div>
          </div>
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold"><Briefcase size={16} className="text-primary" />Quick info</h3>
            <dl className="mt-3 space-y-3 text-xs">
              <div><dt className="text-muted-foreground">Email</dt><dd className="mt-1 break-all">{c.email || "Not provided"}</dd></div>
              <div><dt className="text-muted-foreground">Location</dt><dd className="mt-1">{c.city || "Not provided"}</dd></div>
              <div><dt className="text-muted-foreground">Talent CIR ID</dt><dd className="mt-1 font-mono">{c.talent_cir_id || "Not issued"}</dd></div>
              <div><dt className="text-muted-foreground">In this stage</dt><dd className="mt-1">{relativeTime(detail.stage_changed_at)}</dd></div>
            </dl>
          </div>
        </aside>
      </div>

      <TalentPaywall
        open={paywall !== null}
        onClose={() => setPaywall(null)}
        candidate={{ id: detail.candidate_id, name: c.name, verified: c.verified }}
        reason={paywall ?? "cir"}
        contact={contact}
        onToast={onToast}
        onUnlocked={() => { void load().then(() => onToast("Unlocked. You can now download the report.")); }}
      />
    </div>
  );
}
