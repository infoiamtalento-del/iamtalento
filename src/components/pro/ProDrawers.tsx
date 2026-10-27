import React, { useState } from "react";
import {
  X,
  Briefcase,
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Award,
  ShieldCheck,
  Send,
  Calendar,
  Download,
  Printer,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Sparkles,
  ArrowRightLeft,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  ProJob,
  ProCandidate,
  ProApplication,
  ProUser,
  CANDIDATES_SEED,
  calcScore,
  calcTalentScore,
  levelFromExp,
  avgCandidateScore,
  timeAgo,
  formatINR,
  getRemainingTime,
} from "@/data/proData";
import { getCompanyLogo, getCandidatePhoto } from "@/data/portalAssets";
import { ProDrawerState } from "./proTypes";
import { buildDetailedInvoicesForUser, downloadDetailedInvoicePdf } from "@/utils/invoicePdf";
import {
  downloadCertificatePdf,
  downloadCirReportPdf,
  type RealTimeCertificateData,
} from "@/utils/credentialPdf";

interface ProDrawersProps {
  drawerState: ProDrawerState;
  user: ProUser;
  jobs: ProJob[];
  applications: ProApplication[];
  selectedCompareJobs?: number[];
  selectedCompareCandidates?: string[];
  onClose: () => void;
  onApplyJob: (jobId: number, coverNote?: string) => void;
  onSaveJob: (jobId: number) => void;
  onUpdateApplicantStage: (appId: number, stage: string) => void;
  onSendApplicantUpdate: (appId: number, message: string) => void;
  onScheduleInterview: (appId: number, dateStr: string) => void;
  onSaveRecruiterNote: (appId: number, note: string) => void;
  onToast: (msg: string) => void;
}

export const ProDrawers: React.FC<ProDrawersProps> = ({
  drawerState,
  user,
  jobs,
  applications,
  selectedCompareJobs = [],
  selectedCompareCandidates = [],
  onClose,
  onApplyJob,
  onSaveJob,
  onUpdateApplicantStage,
  onSendApplicantUpdate,
  onScheduleInterview,
  onSaveRecruiterNote,
  onToast,
}) => {
  if (!drawerState) return null;

  // 1. JOB DRAWER
  if (drawerState.type === "job") {
    const job = jobs.find((j) => j.id === drawerState.id);
    if (!job) return null;

    const myApp = applications.find((a) => a.jid === job.id && a.who === user.email);
    const scoreVal = calcScore(job, user);
    const userSkillsLower = (user.sk || []).map((s) => s.toLowerCase());
    const missingSkills = job.sk.filter((s) => !userSkillsLower.includes(s.toLowerCase()));
    const isSaved = (user.saved || []).includes(job.id);
    const [coverNote, setCoverNote] = useState("");

    const similarJobs = jobs
      .filter((j) => j.id !== job.id && j.sk.some((k) => job.sk.includes(k)))
      .slice(0, 2);

    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
        <div className="w-full max-w-xl bg-card border-l border-border h-full overflow-y-auto p-6 space-y-6 shadow-2xl">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <img
                src={getCompanyLogo(job.c)}
                alt={job.c}
                className="w-14 h-14 rounded-2xl object-contain p-1.5 border border-border/60 bg-muted/30 shrink-0"
              />
              <div>
                <h2 className="text-xl font-bold text-foreground font-display">{job.t}</h2>
                <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                  <span className="font-semibold text-foreground">{job.c}</span>
                  <span>•</span>
                  <span>{job.l}</span>
                </div>
              </div>
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="rounded-full w-8 h-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-muted text-foreground font-medium border border-border/60">
              {job.m}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-muted text-foreground font-medium border border-border/60">
              {job.ty}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-muted text-foreground font-medium border border-border/60">
              {job.e}+ yrs exp
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-bold">
              ₹{job.a}–{job.b} LPA
            </span>
            <span className="text-muted-foreground text-[11px] ml-auto">
              Posted {timeAgo(job.at)}
            </span>
          </div>

          {/* Match Analysis */}
          <div className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="font-semibold text-foreground text-xs">Your Profile Match</span>
              </div>
              <span className="font-bold text-sm text-primary">{scoreVal}%</span>
            </div>

            <div className="text-xs text-muted-foreground">
              {missingSkills.length === 0 ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> You have every required skill for this role!
                </span>
              ) : (
                <span>
                  Skills to add for 100% fit: <b>{missingSkills.join(", ")}</b>
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {job.sk.map((s) => {
                const userHas = userSkillsLower.includes(s.toLowerCase());
                return (
                  <span
                    key={s}
                    className={cn(
                      "px-2 py-0.5 rounded-md text-xs font-medium border inline-flex items-center gap-1",
                      userHas
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                        : "bg-muted text-muted-foreground border-border/60"
                    )}
                  >
                    <span>{s}</span>
                    {userHas && <Check className="w-3 h-3 text-emerald-500" />}
                  </span>
                );
              })}
            </div>
          </div>

          {/* About Role */}
          <div className="space-y-2 text-xs">
            <h3 className="font-semibold text-foreground text-sm">About the Role</h3>
            <p className="text-muted-foreground leading-relaxed">
              Join {job.c} as {job.t}. In this position, you will own critical deliverables end to end, collaborate with cross-functional product and engineering leads, and leverage your technical depth across {job.sk.join(", ")}.
            </p>
          </div>

          {/* Application State or Cover Note */}
          {myApp ? (
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2 text-xs">
              <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Application Submitted
              </div>
              <p className="text-muted-foreground">
                Current status: <b>{myApp.st}</b>. Under active 24-hour review SLA.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground block">
                Cover Note to Hiring Manager (Optional)
              </label>
              <Textarea
                rows={3}
                placeholder="Explain why you are an ideal fit for this engineering role..."
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                className="text-xs"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <Button
              disabled={!!myApp}
              onClick={() => {
                onApplyJob(job.id, coverNote);
                onClose();
              }}
              className="flex-1 rounded-xl font-medium text-xs gap-1.5"
            >
              {myApp ? "Already Applied" : "Submit Application with 24h SLA"}
            </Button>
            <Button
              variant="outline"
              onClick={() => onSaveJob(job.id)}
              className="rounded-xl text-xs gap-1.5 bg-background"
            >
              {isSaved ? "Saved" : "Save Job"}
            </Button>
          </div>

          {/* Similar Jobs */}
          {similarJobs.length > 0 && (
            <div className="pt-4 border-t border-border/60 space-y-3">
              <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider">
                Similar Openings
              </h4>
              <div className="space-y-2">
                {similarJobs.map((sj) => (
                  <div
                    key={sj.id}
                    onClick={() => onApplyJob(sj.id)}
                    className="p-3 rounded-xl border border-border/60 bg-muted/20 hover:border-primary/40 transition-colors cursor-pointer text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-foreground">{sj.t}</div>
                      <div className="text-muted-foreground text-[11px]">{sj.c} • {sj.l}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. CANDIDATE DETAILS DRAWER (Talent Search)
  if (drawerState.type === "candidate") {
    const cand = CANDIDATES_SEED.find((c) => c.n === drawerState.name);
    if (!cand) return null;

    const targetJob = drawerState.jobId ? jobs.find((j) => j.id === drawerState.jobId) : null;
    const talentScore = calcTalentScore(cand, targetJob);

    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
        <div className="w-full max-w-xl bg-card border-l border-border h-full overflow-y-auto p-6 space-y-6 shadow-2xl">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <img
                src={getCandidatePhoto(cand.n)}
                alt={cand.n}
                className="w-14 h-14 rounded-2xl object-cover border border-border/60 shrink-0"
              />
              <div>
                <h2 className="text-xl font-bold text-foreground font-display flex items-center gap-2">
                  {cand.n}
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </h2>
                <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                  <span>{cand.c}</span>
                  <span>•</span>
                  <span>{cand.x} yrs exp ({levelFromExp(cand.x)})</span>
                </div>
              </div>
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="rounded-full w-8 h-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Talent Score */}
          <div className="p-4 rounded-xl border border-border/80 bg-muted/20 flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-foreground text-sm block">Comprehensive Talent Score</span>
              <span className="text-muted-foreground">Weighted across assessments, skills & verified projects</span>
            </div>
            <span className="font-bold text-xl text-primary font-display">{talentScore}%</span>
          </div>

          {/* Skills */}
          <div className="space-y-2 text-xs">
            <span className="font-semibold text-foreground block">Verified Core Skills</span>
            <div className="flex flex-wrap gap-1.5">
              {cand.sk.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 rounded-lg bg-muted text-foreground font-medium border border-border/60"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Assessment Test Scores */}
          <div className="space-y-2.5 text-xs">
            <span className="font-semibold text-foreground block">Proctored Assessment Results</span>
            <div className="space-y-2">
              {Object.entries(cand.as).map(([skill, score]) => (
                <div key={skill} className="space-y-1">
                  <div className="flex items-center justify-between font-medium">
                    <span className="text-foreground">{skill}</span>
                    <span className="text-primary font-bold">{score}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20 text-xs space-y-1">
            <div className="font-semibold text-foreground">Notice Period & Availability</div>
            <div className="text-muted-foreground">
              {cand.nt ? `${cand.nt} days notice period` : "Available to join immediately"}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center gap-3">
            <Button
              onClick={() => {
                onToast(`Invited ${cand.n} to apply!`);
                onClose();
              }}
              className="flex-1 rounded-xl text-xs font-medium gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Invite Candidate to Apply
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 3. APPLICANT REVIEW DRAWER (Pipeline & Recruiter SLA)
  if (drawerState.type === "applicant") {
    const app = applications.find((a) => a.id === drawerState.id);
    if (!app) return null;

    const job = jobs.find((j) => j.id === app.jid);
    const STAGES = ["Applied", "Shortlisted", "Interview", "Offer", "Rejected"];
    const [recruiterMessage, setRecruiterMessage] = useState("");
    const [interviewDate, setInterviewDate] = useState(app.iv || "");
    const [recruiterNote, setRecruiterNote] = useState(app.note || "");

    const quickMessages = [
      "Your application is currently under review by our senior engineering team.",
      "Congratulations! Your profile has been shortlisted for technical discussion.",
      "We would like to invite you for an interview round. Please pick a time.",
      "Thank you for your application. We have decided to advance other candidates at this time.",
    ];

    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
        <div className="w-full max-w-xl bg-card border-l border-border h-full overflow-y-auto p-6 space-y-6 shadow-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground font-display">{app.name}</h2>
              <div className="text-xs text-muted-foreground mt-0.5">
                Applied for <b>{job?.t}</b> • {app.exp} yrs exp
              </div>
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="rounded-full w-8 h-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Stage Mover Buttons */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-foreground block">Current Stage</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {STAGES.map((stage) => (
                <button
                  key={stage}
                  onClick={() => onUpdateApplicantStage(app.id, stage)}
                  className={cn(
                    "px-3 py-1 rounded-xl text-xs font-semibold border transition-colors",
                    app.st === stage
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/40 text-muted-foreground border-border/60 hover:text-foreground"
                  )}
                >
                  {stage}
                </button>
              ))}
            </div>
          </div>

          {/* Send 24h SLA Update Box */}
          <div className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-3 text-xs">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-primary" /> Send Candidate 24h SLA Update
            </h3>

            <div className="space-y-1.5">
              <span className="text-[11px] text-muted-foreground block">Quick Update Presets:</span>
              <div className="flex flex-col gap-1.5">
                {quickMessages.map((msg, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRecruiterMessage(msg)}
                    className="p-2 rounded-lg bg-background border border-border/60 text-left text-[11px] text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                  >
                    "{msg}"
                  </button>
                ))}
              </div>
            </div>

            <Textarea
              rows={2}
              value={recruiterMessage}
              onChange={(e) => setRecruiterMessage(e.target.value)}
              placeholder="Or write custom status update message..."
              className="text-xs bg-background"
            />

            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={() => {
                  if (recruiterMessage.trim()) {
                    onSendApplicantUpdate(app.id, recruiterMessage.trim());
                    setRecruiterMessage("");
                    onToast("24h SLA update sent to candidate!");
                  }
                }}
                className="rounded-xl text-xs h-8 gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Send Verified Update
              </Button>
            </div>
          </div>

          {/* Schedule Interview */}
          <div className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-3 text-xs">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary" /> Schedule Technical Round
            </h3>
            <div className="flex items-center gap-2">
              <Input
                type="datetime-local"
                aria-label="Interview date and time"
                min={new Date().toISOString().slice(0, 16)}
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="text-xs h-9 bg-background"
              />
              <Button
                size="sm"
                onClick={() => {
                  if (interviewDate && new Date(interviewDate).getTime() > Date.now()) {
                    onScheduleInterview(app.id, interviewDate);
                    onToast(`Interview scheduled for ${interviewDate}`);
                  } else {
                    onToast("Choose a future interview date and time.");
                  }
                }}
                className="rounded-xl text-xs h-9 shrink-0"
              >
                Schedule Round
              </Button>
            </div>
          </div>

          {/* Cover Note & Recruiter Private Notes */}
          <div className="space-y-3 text-xs">
            {app.cn && (
              <div className="p-3.5 rounded-xl border border-border/60 bg-muted/10 space-y-1">
                <span className="font-semibold text-foreground block">Candidate Cover Note</span>
                <p className="text-muted-foreground leading-relaxed">{app.cn}</p>
              </div>
            )}

            <div className="space-y-1.5">
              <span className="font-semibold text-foreground block">Private Recruiter Notes</span>
              <Textarea
                rows={3}
                value={recruiterNote}
                onChange={(e) => setRecruiterNote(e.target.value)}
                placeholder="Internal interview feedback, rating, rubric notes..."
                className="text-xs"
              />
              <div className="flex justify-end pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onSaveRecruiterNote(app.id, recruiterNote);
                    onToast("Recruiter note saved!");
                  }}
                  className="rounded-xl text-xs h-7 px-3 bg-background"
                >
                  Save Note
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. COMPARE CANDIDATES DRAWER
  if (drawerState.type === "compare-candidates") {
    const candidates = CANDIDATES_SEED.filter((c) => selectedCompareCandidates.includes(c.n)).slice(0, 3);
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-primary" /> Candidate Comparison Matrix
            </h3>
            <Button size="sm" variant="ghost" onClick={onClose} className="rounded-full w-8 h-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-border/80">
                  <th className="p-3 font-semibold text-muted-foreground">Metric</th>
                  {candidates.map((c) => (
                    <th key={c.n} className="p-3 font-bold text-foreground text-sm">
                      {c.n}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                <tr>
                  <td className="p-3 font-medium text-muted-foreground">Experience</td>
                  {candidates.map((c) => (
                    <td key={c.n} className="p-3 font-semibold text-foreground">
                      {c.x} yrs ({levelFromExp(c.x)})
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-medium text-muted-foreground">Location</td>
                  {candidates.map((c) => (
                    <td key={c.n} className="p-3 text-foreground">{c.c}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-medium text-muted-foreground">Avg Assessment</td>
                  {candidates.map((c) => (
                    <td key={c.n} className="p-3 font-bold text-primary">
                      {avgCandidateScore(c)}%
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-medium text-muted-foreground">Skills</td>
                  {candidates.map((c) => (
                    <td key={c.n} className="p-3 text-foreground">{c.sk.join(", ")}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-medium text-muted-foreground">Expected Salary</td>
                  {candidates.map((c) => (
                    <td key={c.n} className="p-3 font-bold text-foreground">₹{c.es} LPA</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-medium text-muted-foreground">Notice Period</td>
                  {candidates.map((c) => (
                    <td key={c.n} className="p-3 text-foreground">{c.nt ? `${c.nt} days` : "Immediate"}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // 5. RECEIPT MODAL
  if (drawerState.type === "receipt") {
    const sampleInv = buildDetailedInvoicesForUser(user)[0];
    const matchedTx = (user.wal?.hist || []).find((t: any) => t.id === drawerState.txId);
    const baseAmt = matchedTx?.amt ? Math.round(matchedTx.amt / 1.18) : sampleInv.baseAmount;
    const cgst = Math.round(baseAmt * 0.09);
    const sgst = Math.round(baseAmt * 0.09);
    const totalAmt = matchedTx?.amt || sampleInv.totalAmount;

    const modalInvoice = {
      ...sampleInv,
      invoiceNo: drawerState.txId || sampleInv.invoiceNo,
      title: matchedTx?.desc || sampleInv.title,
      baseAmount: baseAmt,
      cgstAmount: cgst,
      sgstAmount: sgst,
      totalAmount: totalAmt,
    };

    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-foreground text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" /> Detailed Tax Invoice &amp; Receipt
            </h3>
            <Button size="sm" variant="ghost" onClick={onClose} className="rounded-full w-8 h-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="border border-border/80 rounded-xl overflow-hidden bg-muted/20 text-xs">
            <div className="bg-[#002C66] text-white p-3.5 flex items-center justify-between">
              <div>
                <div className="font-bold text-xs">IAmTalento Technologies Pvt. Ltd.</div>
                <div className="text-[10px] text-white/80">GSTIN: 29AABCI9482K1Z5 · SAC: {sampleInv.sacCode}</div>
              </div>
              <span className="rounded bg-[#FB923C] px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                Tax Invoice
              </span>
            </div>
            <div className="p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Invoice / Ref ID</span>
                <span className="font-mono font-bold text-foreground">{modalInvoice.invoiceNo}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Billed To</span>
                <span className="font-semibold text-foreground">
                  {modalInvoice.billedTo.organization || user.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Description</span>
                <span className="font-medium text-foreground text-right max-w-[15rem] truncate">
                  {modalInvoice.title}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Taxable Base Amount</span>
                <span className="font-medium text-foreground">{formatINR(modalInvoice.baseAmount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">GST (9% CGST + 9% SGST)</span>
                <span className="font-medium text-foreground">
                  {formatINR(modalInvoice.cgstAmount + modalInvoice.sgstAmount)}
                </span>
              </div>
              <div className="pt-2 border-t border-border/60 flex items-center justify-between font-bold text-sm">
                <span>Total Invoice Amount</span>
                <span className="text-primary">{formatINR(modalInvoice.totalAmount)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button size="sm" variant="outline" onClick={() => window.print()} className="rounded-xl text-xs gap-1.5">
              <Printer className="w-3.5 h-3.5" /> Print
            </Button>
            <Button
              size="sm"
              onClick={() => {
                downloadDetailedInvoicePdf(modalInvoice);
                onToast(`Downloaded ${modalInvoice.invoiceNo}.pdf`);
              }}
              className="rounded-xl bg-[#FB923C] hover:bg-[#F97316] text-white text-xs font-bold gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Download PDF (.pdf)
            </Button>
            <Button size="sm" onClick={onClose} className="rounded-xl text-xs">
              Done
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 6. CERTIFICATE MODAL (REAL-TIME VERIFIED CREDENTIAL & CIR TELEMETRY)
  if (drawerState.type === "certificate") {
    const key = drawerState.key || "skill:React";
    let certTitle = "React Advanced Engineering Assessment";
    let certIssuer = "IAmTalento AI Proctoring & Certification Authority";
    let certYear = "Oct 2026";
    let validTill = "Oct 2028";
    let scoreVal = 86;
    let skillName = "React";

    if (key.startsWith("ce:")) {
      const idx = parseInt(key.slice(3), 10) || 0;
      const raw = (user.ce || [])[idx] || "AWS Certified Solutions Architect · Amazon Web Services · 2026";
      const parts = String(raw).split(" · ");
      certTitle = parts[0] || raw;
      certIssuer = parts[1] || "Accredited Certification Partner";
      certYear = parts[2] || "2026";
      validTill = String((parseInt(certYear, 10) || 2026) + 2);
      scoreVal = 92;
      skillName = certTitle.split(" ")[0] || "Cloud";
    } else if (key.startsWith("skill:")) {
      skillName = key.slice(6) || "React";
      scoreVal = (user.as || {})[skillName] || (skillName === "HTML/CSS" ? 90 : skillName === "JavaScript" ? 82 : 86);
      certTitle = `${skillName} Verified Engineering Proficiency Assessment`;
      certIssuer = "IAmTalento AI-Proctored Skill Authority";
    } else if (key === "verified") {
      certTitle =
        user.role === "employer"
          ? "Verified Enterprise Employer & 24h SLA Partner"
          : "Talento Pro Verified Engineering Professional";
      certIssuer = "IAmTalento Identity & Competency Assurance Board";
      scoreVal = 94;
      skillName = "Architecture";
    }

    const credId = `TLN-CERT-2026-${skillName.slice(0, 3).toUpperCase()}-${840 + scoreVal}`;
    const certData: RealTimeCertificateData = {
      credentialId: credId,
      candidateName: user.name,
      candidateEmail: user.email,
      candidateRole: user.head || "Senior Full-Stack Engineer",
      title: certTitle,
      issuer: certIssuer,
      issuedDate: certYear,
      validUntil: validTill,
      score: scoreVal,
      percentile: scoreVal >= 90 ? "Top 4%" : scoreVal >= 82 ? "Top 8%" : "Top 14%",
      integrityScore: "99.8%",
      timeTaken: "34m 18s / 45m",
      codingTestCases: "12 / 12 Passed",
      peerAverage: 62,
      partnerCutoff: 60,
      salaryBand: "INR 18.0 - 28.0 LPA",
      verificationHash: `0x94F8...${scoreVal}E2B1`,
      subSkills: [
        { name: `${skillName} Core Architecture & Patterns`, score: Math.min(98, scoreVal + 4), benchmark: 64 },
        { name: "Production Performance & Optimization", score: scoreVal, benchmark: 60 },
        { name: "Security, Edge Cases & Debugging", score: Math.max(70, scoreVal - 3), benchmark: 58 },
      ],
      recruiterSummary: `${user.name} demonstrated production-grade mastery in ${certTitle}, scoring ${scoreVal}% with 99.8% proctoring integrity (0 flags) and outperforming ${scoreVal >= 85 ? "92%" : "86%"} of assessed peers.`,
    };

    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-foreground text-base flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" /> Official Verified Certificate &amp; Live Telemetry
            </h3>
            <Button size="sm" variant="ghost" onClick={onClose} className="rounded-full w-8 h-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Certificate A4 Preview Card */}
          <div className="border-2 border-[#002C66] rounded-2xl overflow-hidden bg-white text-slate-900 shadow-lg">
            {/* Top Navy Header */}
            <div className="bg-[#002C66] text-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#FB923C]">
                  IAmTalento Verified Credential Authority
                </div>
                <div className="text-base font-extrabold tracking-tight mt-0.5">
                  CERTIFICATE OF VERIFIED PROFICIENCY
                </div>
                <div className="text-[11px] text-white/80 font-mono mt-0.5">
                  ID: {certData.credentialId} · Hash: {certData.verificationHash}
                </div>
              </div>
              <div className="shrink-0 rounded-xl bg-emerald-500/20 border border-emerald-400/40 px-3 py-1.5 text-right">
                <div className="text-[10px] uppercase tracking-wider text-emerald-200 font-semibold">
                  Verified Score
                </div>
                <div className="text-lg font-extrabold text-white">
                  {certData.score}% ({certData.percentile})
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              <div className="text-center space-y-1.5 border-b border-slate-200 pb-5">
                <div className="text-xs text-slate-500">This is to certify that</div>
                <h2 className="text-2xl font-extrabold font-display text-[#002C66]">{certData.candidateName}</h2>
                <div className="text-xs font-medium text-slate-600">
                  {certData.candidateRole} · {certData.candidateEmail}
                </div>
                <p className="text-xs text-slate-600 pt-2 max-w-lg mx-auto">
                  has successfully passed the AI-proctored engineering assessment and met all verification standards for:
                </p>
                <div className="inline-block mt-2 rounded-xl bg-slate-100 border border-slate-200 px-4 py-2">
                  <div className="text-sm font-bold text-[#002C66]">{certData.title}</div>
                  <div className="text-[11px] text-slate-500">Issued by {certData.issuer}</div>
                </div>
              </div>

              {/* Real-Time Telemetry Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Proctoring Integrity</span>
                  <strong className="text-emerald-700 font-bold text-sm">{certData.integrityScore}</strong>
                  <span className="text-[10px] text-slate-500 block">0 Tab Switches</span>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Percentile Rank</span>
                  <strong className="text-[#002C66] font-bold text-sm">{certData.percentile}</strong>
                  <span className="text-[10px] text-slate-500 block">Peer Median: {certData.peerAverage}%</span>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Coding &amp; Rubric</span>
                  <strong className="text-slate-900 font-bold text-sm">{certData.codingTestCases}</strong>
                  <span className="text-[10px] text-slate-500 block">Time: {certData.timeTaken}</span>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Validity Window</span>
                  <strong className="text-slate-900 font-bold text-sm">
                    {certData.issuedDate} – {certData.validUntil}
                  </strong>
                  <span className="text-[10px] text-emerald-600 font-semibold block">● Live Synced</span>
                </div>
              </div>

              {/* Sub-Skill Bars */}
              <div className="rounded-xl border border-slate-200 p-3.5 space-y-2 bg-slate-50/60">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#002C66]">
                  Verified Sub-Domain Competency Breakdown
                </div>
                {certData.subSkills.map((s) => (
                  <div key={s.name} className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-800">{s.name}</span>
                      <span className="font-bold text-[#002C66]">
                        {s.score}% <span className="text-[10px] font-normal text-slate-500">(Peer Avg: {s.benchmark}%)</span>
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full rounded-full bg-[#002C66]" style={{ width: `${s.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                <div>
                  Verify URL: <b className="text-[#002C66]">iamtalento.com/verify/{certData.credentialId}</b>
                </div>
                <div className="font-semibold text-slate-700">
                  Authorized Digital Signatory · IAmTalento
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-2 pt-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.print()}
              className="rounded-xl text-xs gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                downloadCirReportPdf(certData);
                onToast(`Downloaded CIR Report PDF: IAmTalento-CIR-Report-${certData.credentialId}.pdf`);
              }}
              className="rounded-xl border-primary/40 text-primary text-xs font-bold gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Download CIR Report (.pdf)
            </Button>
            <Button
              size="sm"
              onClick={() => {
                downloadCertificatePdf(certData);
                onToast(`Downloaded Certificate PDF: IAmTalento-Certificate-${certData.credentialId}.pdf`);
              }}
              className="rounded-xl bg-[#FB923C] hover:bg-[#F97316] text-white text-xs font-bold gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Download Certificate (.pdf)
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
