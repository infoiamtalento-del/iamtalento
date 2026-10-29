import React, { useState } from "react";
import { BadgeCheck, ShieldCheck, Clock, XCircle, Upload, Loader2, Award, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProHero } from "../ProHero";
import { useAsync } from "@/hooks/useAsync";
import { loadLiveProfile } from "@/services/candidate/profile";
import { submitIdentity, uploadResume, resumeDownloadUrl } from "@/services/candidate/platform";
import { backendErrorMessage } from "@/hooks/useCandidateBackend";
import type { ProView } from "../proTypes";

const PAN = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

export const LiveVerification: React.FC<{ onToast: (m: string) => void; onNavigate: (v: ProView) => void }> = ({ onToast, onNavigate }) => {
  const { data: live, loading, reload } = useAsync(loadLiveProfile);
  const [idType, setIdType] = useState<"aadhar" | "passport" | "driving_license">("aadhar");
  const [doc, setDoc] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [pan, setPan] = useState("");
  const [busy, setBusy] = useState(false);
  const [resumeBusy, setResumeBusy] = useState(false);

  const status = live?.verification.identity_status ?? null;
  const verified = live?.verification.profile_status === "verified";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doc || !selfie) return onToast("Attach your ID document and a clear selfie.");
    if (pan && !PAN.test(pan.toUpperCase())) return onToast("PAN must look like ABCDE1234F.");
    setBusy(true);
    try {
      await submitIdentity(idType, doc, selfie, pan.toUpperCase() || undefined);
      onToast("Documents submitted. Review usually takes up to 48 hours.");
      setDoc(null); setSelfie(null);
      await reload();
    } catch (err) { onToast(backendErrorMessage(err)); } finally { setBusy(false); }
  };

  const onResume = async (file?: File | null) => {
    if (!file) return;
    setResumeBusy(true);
    try { await uploadResume(file); onToast("Resume uploaded securely."); await reload(); }
    catch (err) { onToast(backendErrorMessage(err)); } finally { setResumeBusy(false); }
  };

  const openResume = async () => {
    const path = live?.profile.resume_path;
    if (!path) return;
    try { window.open(await resumeDownloadUrl(path), "_blank", "noopener,noreferrer"); } catch (err) { onToast(backendErrorMessage(err)); }
  };

  const checks = [
    { title: "Email confirmed", done: true, sub: live?.profile.email ?? "" },
    { title: "Profile summary and headline", done: Boolean(live?.profile.headline && live?.profile.about), sub: "Complete in My Profile", nav: "profile" as ProView },
    { title: "Proctored assessment with a CIR report", done: Boolean(live?.latest_cir), sub: live?.latest_cir ? `${live.latest_cir.tier} · ${Math.round(Number(live.latest_cir.score))}` : "Take an assessment", nav: "cert" as ProView },
    { title: "Government ID reviewed", done: status === "verified", sub: status ? `Status: ${status}` : "Upload your documents below" },
  ];

  return (
    <div className="space-y-6">
      <ProHero icon={<ShieldCheck />} title="Verification" subtitle="A verified badge makes recruiters trust your profile faster."
        aside={<span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${verified ? "bg-emerald-400/20 text-white" : "bg-white/15 text-white"}`}>
          {verified ? <BadgeCheck className="h-4 w-4" /> : <Clock className="h-4 w-4" />} {verified ? "Verified" : "Not verified yet"}</span>} />

      {loading && !live ? <p className="text-sm text-muted-foreground">Loading…</p> : (
        <>
          <ul className="rounded-2xl border border-border bg-card divide-y divide-border">
            {checks.map((c) => (
              <li key={c.title} className="flex items-center gap-3 px-4 py-3">
                <span className={`h-6 w-6 rounded-full flex items-center justify-center ${c.done ? "bg-emerald-500 text-white" : "bg-secondary text-muted-foreground"}`}>{c.done ? <BadgeCheck className="h-4 w-4" /> : <Clock className="h-3.5 w-3.5" />}</span>
                <span className="flex-1"><span className="block text-sm font-semibold">{c.title}</span><span className="text-xs text-muted-foreground">{c.sub}</span></span>
                {!c.done && c.nav && <Button size="sm" variant="outline" onClick={() => onNavigate(c.nav!)}>Go</Button>}
              </li>
            ))}
          </ul>

          {status === "rejected" && (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm flex gap-3"><XCircle className="h-5 w-5 text-destructive shrink-0" />
              <span><b>Verification needs attention.</b> {live?.verification.rejection_reason ?? "Please upload clearer documents."}</span></div>
          )}

          {status !== "verified" && status !== "pending" && (
            <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-5 space-y-4">
              <p className="text-sm font-semibold flex items-center gap-2"><Upload className="h-4 w-4 text-primary" /> Submit identity documents</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-xs font-medium">ID type
                  <select value={idType} onChange={(e) => setIdType(e.target.value as typeof idType)} className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm">
                    <option value="aadhar">Aadhaar</option><option value="passport">Passport</option><option value="driving_license">Driving licence</option>
                  </select></label>
                <label className="text-xs font-medium">PAN (optional)
                  <input value={pan} maxLength={10} onChange={(e) => setPan(e.target.value.toUpperCase())} placeholder="ABCDE1234F" className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm" /></label>
                <label className="text-xs font-medium">ID document (JPG, PNG, PDF · 10 MB)
                  <input type="file" accept="image/jpeg,image/png,application/pdf" onChange={(e) => setDoc(e.target.files?.[0] ?? null)} className="mt-1 block w-full text-sm" /></label>
                <label className="text-xs font-medium">Selfie holding your ID
                  <input type="file" accept="image/jpeg,image/png" onChange={(e) => setSelfie(e.target.files?.[0] ?? null)} className="mt-1 block w-full text-sm" /></label>
              </div>
              <p className="text-[11px] text-muted-foreground">Files go to a private, encrypted bucket that only you and our verification team can open.</p>
              <Button type="submit" disabled={busy}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit for review"}</Button>
            </form>
          )}
          {status === "pending" && <p className="rounded-2xl border border-border bg-card p-4 text-sm"><Clock className="inline h-4 w-4 mr-1.5 text-amber-600" />Your documents are under review. We will notify you here.</p>}

          <div className="rounded-2xl border border-border bg-card p-5 flex flex-wrap items-center gap-3">
            <FileText className="h-5 w-5 text-primary" />
            <div className="flex-1 min-w-[200px]"><p className="text-sm font-semibold">Resume</p><p className="text-xs text-muted-foreground">{live?.profile.resume_path ? "Uploaded. Employers you apply to can open it." : "PDF or DOCX, up to 5 MB."}</p></div>
            {live?.profile.resume_path && <Button size="sm" variant="outline" onClick={openResume}>Open</Button>}
            <label className="inline-flex"><input type="file" className="sr-only" accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(e) => onResume(e.target.files?.[0])} />
              <span className="inline-flex h-9 cursor-pointer items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">{resumeBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : live?.profile.resume_path ? "Replace" : "Upload"}</span></label>
          </div>

          {live?.latest_cir && (
            <button type="button" onClick={() => onNavigate("cert")} className="w-full rounded-2xl border border-border bg-card p-4 text-left flex items-center gap-3 hover:border-primary/40">
              <Award className="h-5 w-5 text-primary" /><span className="text-sm"><b>Your CIR: {live.latest_cir.tier}</b> · {Math.round(Number(live.latest_cir.score))}/100 · top {Math.max(1, 100 - Math.round(Number(live.latest_cir.percentile)))}%</span>
            </button>
          )}
        </>
      )}
    </div>
  );
};
