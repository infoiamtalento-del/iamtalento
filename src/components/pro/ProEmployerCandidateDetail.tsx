import { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Download,
  GraduationCap,
  Mail,
  MapPin,
  MessageSquare,
  Share2,
  Star,
  Users,
  Briefcase,
  Save,
  ShieldCheck,
  CheckCircle2,
  CheckCircle,
  FileText,
  Phone,
  ExternalLink,
  Award,
  Code,
  Cpu,
  Clock,
  IndianRupee,
  Copy,
  Check,
  Send,
  Sparkles,
  Lock,
  Building2,
  CheckSquare,
} from "lucide-react";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CANDIDATES_SEED, STAGES, type ProApplication, type ProCandidate, type ProJob } from "@/data/proData";
import { getCandidatePhoto } from "@/data/portalAssets";
import { cn } from "@/lib/utils";
import "./employer-workspace.css";

interface Props {
  candidate?: ProCandidate;
  application?: ProApplication;
  job?: ProJob;
  onBack: () => void;
  onSave: (
    id: number,
    changes: Pick<ProApplication, "st" | "cn" | "note">,
    message: string,
    interview: string
  ) => void;
  onToast: (message: string) => void;
}

const slaMessages = [
  "Your profile has been reviewed and shortlisted by our engineering hiring team.",
  "We would like to invite you for a technical assessment round. Please pick a slot.",
  "Congratulations! You have advanced to the final leadership & architecture interview.",
  "Thank you for sharing your profile. We have decided to advance other candidates at this time.",
];

export function ProEmployerCandidateDetail({
  candidate,
  application,
  job,
  onBack,
  onSave,
  onToast,
}: Props) {
  const person = candidate || CANDIDATES_SEED.find((c) => c.n === application?.name);
  const name = application?.name || person?.n || "Candidate";
  const isVerified = Boolean(person?.verified);
  const skills = application?.sk || person?.sk || [];
  const photo = getCandidatePhoto(name);

  // Active sub-tab state
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [copiedLink, setCopiedLink] = useState(false);

  // Application pipeline management (when viewed inside a job ATS context)
  const [stage, setStage] = useState<ProApplication["st"]>(application?.st || "Applied");
  const [message, setMessage] = useState("");
  const [cover, setCover] = useState(application?.cn || "");
  const [note, setNote] = useState(application?.note || "");
  const [date, setDate] = useState(application?.iv?.slice(0, 10) || "");
  const [time, setTime] = useState(application?.iv?.slice(11, 16) || "");
  const [schedule, setSchedule] = useState(false);

  // Assessment scores
  const scores = Object.entries(application?.as || person?.as || {});

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      onToast("Profile link copied to clipboard.");
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      onToast("Could not copy link automatically.");
    }
  };

  const handleSaveApplication = () => {
    if (!application) {
      onToast("Notes saved locally.");
      return;
    }
    if (schedule && (!date || !time)) {
      onToast("Please choose an interview date and time.");
      return;
    }
    onSave(
      application.id,
      { st: stage, cn: cover, note },
      message,
      schedule ? `${date}T${time}` : ""
    );
    setMessage("");
    setSchedule(false);
  };

  // 1. STANDARD CANDIDATE CV DOWNLOAD
  const handleDownloadStandardResume = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(name, 20, 24);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(90, 90, 90);
    doc.text(person?.headline || `${person?.x || 2} Years Experience · Tech Professional`, 20, 32);

    doc.setFontSize(10);
    doc.text(`Location: ${person?.c || "Bengaluru"} (${person?.wp || "Hybrid"})`, 20, 40);
    doc.text(`Email: ${application?.who || person?.email || "candidate@talento.io"} | Phone: ${person?.phone || "+91 98400 00000"}`, 20, 46);
    doc.text(`Experience: ${person?.x || 0} Years | Expected CTC: ₹${person?.es || 12} LPA | Notice: ${person?.nt ? `${person.nt}d` : "Immediate"}`, 20, 52);

    doc.setDrawColor(210, 210, 210);
    doc.line(20, 58, 190, 58);

    doc.setTextColor(30, 30, 30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Professional Summary", 20, 68);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const summaryText =
      person?.highlight ||
      `${name} is an experienced professional with ${person?.x || 2} years of industry experience, specializing in ${(skills || []).slice(0, 5).join(", ")}.`;
    doc.text(doc.splitTextToSize(summaryText, 170), 20, 76);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Core Technical Skills", 20, 95);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(skills.join(" • "), 20, 103);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Work Experience", 20, 118);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(`Current Company: ${person?.currentCompany || "Leading Technology Services"}`, 20, 126);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Previous Company: ${person?.previousCompany || "Software Solutions"}`, 20, 133);
    doc.text(`Total Relevant Experience: ${person?.x || 2} Years`, 20, 140);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Education & Certifications", 20, 155);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Education: ${person?.education || "Bachelor of Engineering / B.Tech"}`, 20, 163);
    doc.text(`Certifications: ${(person?.ce || []).join(", ") || "None specified"}`, 20, 170);

    doc.save(`${name.replace(/\s+/g, "-")}-Resume.pdf`);
    onToast("Candidate resume PDF downloaded.");
  };

  // 2. VERIFIED CIR OFFICIAL REPORT PDF DOWNLOAD
  const handleDownloadVerifiedCIRReport = () => {
    const doc = new jsPDF();

    // Top Header Banner
    doc.setFillColor(0, 44, 102); // Navy #002C66
    doc.rect(0, 0, 210, 36, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("TALENTO TRUST NETWORK · VERIFIED CIR REPORT", 15, 16);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("CANDIDATE INTEGRITY & READINESS (CIR) AUDIT DOSSIER", 15, 23);
    doc.text(`LEDGER ID: ${person?.cirId || "CIR-BLR-8941"}  |  STATUS: AUTHENTICATED`, 15, 29);

    // Score Callout Box
    doc.setFillColor(240, 253, 244); // Light Emerald
    doc.rect(145, 8, 52, 22, "F");
    doc.setTextColor(5, 150, 105);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(`CIR ${person?.cirScore || 97}/100`, 150, 18);
    doc.setFontSize(8);
    doc.text("Top 3% Pan-India", 150, 24);

    // Candidate Header
    doc.setTextColor(20, 20, 20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(name, 15, 48);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(person?.headline || "Verified Engineering Professional", 15, 55);

    // Candidate Specs
    doc.setFontSize(9);
    doc.setTextColor(40, 40, 40);
    doc.text(`Location: ${person?.c || "Bengaluru"} (${person?.wp || "Hybrid"})  |  Exp: ${person?.x} yrs`, 15, 62);
    doc.text(`Phone: ${person?.phone || "+91 98401 23456"} (OTP Verified)  |  Email: ${person?.email || `${name.toLowerCase().replace(/\s/g, ".")}@talento-verified.io`}`, 15, 68);
    doc.text(`Current CTC: ₹${person?.currentSalary || 20} LPA  |  Expected CTC: ₹${person?.es} LPA  |  Notice: ${person?.nt} days`, 15, 74);
    if (person?.linkedin) doc.text(`LinkedIn: ${person.linkedin}  |  GitHub: ${person.github || "N/A"}`, 15, 80);

    // Verification Pillars Divider
    doc.setDrawColor(0, 44, 102);
    doc.setLineWidth(0.8);
    doc.line(15, 86, 195, 86);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(0, 44, 102);
    doc.text("3-PILLAR OFFICIAL VERIFICATION AUDIT", 15, 94);

    // Pillar 1
    doc.setFillColor(248, 250, 252);
    doc.rect(15, 98, 180, 22, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text("1. Identity & Legal Screening: PASSED [VERIFIED]", 20, 105);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(70, 70, 70);
    doc.text("• Aadhaar UIDAI Biometric / OTP: MATCHED & VALIDATED", 22, 111);
    doc.text("• PAN Tax Entity Status: ACTIVE (Ministry of Finance Records Clear) | Criminal Checks: 0 Records", 22, 116);

    // Pillar 2
    doc.setFillColor(248, 250, 252);
    doc.rect(15, 124, 180, 22, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`2. EPFO & UAN Employment History: PASSED [${person?.currentCompany || "Active"}]`, 20, 131);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(70, 70, 70);
    doc.text(`• Current Employer: ${person?.currentCompany} (Active monthly EPFO PF deposits audited)`, 22, 137);
    doc.text(`• Previous Employer: ${person?.previousCompany} (Relieving Letter & PF transfer verified) | Experience: ${person?.x} yrs`, 22, 142);

    // Pillar 3
    doc.setFillColor(248, 250, 252);
    doc.rect(15, 150, 180, 22, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text("3. Proctored Coding & Technical Integrity: PASSED [0% Plagiarism]", 20, 157);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(70, 70, 70);
    doc.text("• Plagiarism Score: 0.0% Unique Code Logic | AI Code Injection: None Detected", 22, 163);
    doc.text("• Anti-Cheat Telemetry: 0 Tab Switches | Dual-Cam Gaze Tracking: 99.8% Verified", 22, 168);

    // Technical Assessment Scorecard
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(0, 44, 102);
    doc.text("PROCTORED TECHNICAL ASSESSMENT SCORES", 15, 182);

    let yPos = 190;
    if (scores.length > 0) {
      scores.forEach(([testName, score]) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(30, 30, 30);
        doc.text(`• ${testName}:`, 20, yPos);

        doc.setFont("helvetica", "bold");
        doc.setTextColor(5, 150, 105);
        doc.text(`${score}% Passed`, 95, yPos);
        yPos += 7;
      });
    }

    // Engineering Highlights
    yPos += 3;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(0, 44, 102);
    doc.text("AUDITED ENGINEERING ACHIEVEMENTS", 15, yPos);
    yPos += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(50, 50, 50);
    const highlight =
      person?.highlight ||
      "Proven architecture and technical impact verified by hiring manager audit.";
    doc.text(doc.splitTextToSize(`"${highlight}"`, 175), 18, yPos);

    // Footer Watermark & Seal
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 280, 210, 17, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      "TALENTO TRUST NETWORK · TAMPER-PROOF VERIFICATION LEDGER · DIGITALLY SIGNED & VALIDATED",
      15,
      288
    );
    doc.setFont("helvetica", "normal");
    doc.text(`Verified On: November 2026  |  Ledger ID: ${person?.cirId || "CIR-BLR-8941"}`, 15, 293);

    doc.save(`${name.replace(/\s+/g, "-")}-Official-CIR-Report.pdf`);
    onToast("Official Verified CIR Report PDF downloaded!");
  };

  // =========================================================================
  // VIEW A: STANDARD CANDIDATE PROFILE ("Canditaes if click and i can see the profile no other things")
  // =========================================================================
  if (!isVerified) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200">
        {/* Navigation & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-xs font-semibold gap-2 hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Candidates
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="text-xs font-medium gap-1.5 rounded-xl"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              {copiedLink ? "Copied" : "Share Profile"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadStandardResume}
              className="text-xs font-medium gap-1.5 rounded-xl"
            >
              <Download className="w-3.5 h-3.5" /> Download Resume (PDF)
            </Button>
            <Button
              size="sm"
              onClick={() => onToast(`Interview invitation sent to ${name}!`)}
              className="text-xs font-bold gap-1.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Send className="w-3.5 h-3.5" /> Invite to Interview
            </Button>
          </div>
        </div>

        {/* Clean Standard Profile Header Card */}
        <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <img
              src={photo}
              alt={name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-border shadow-xs shrink-0"
            />
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-display">
                  {name}
                </h1>
                {person?.statusBadge && (
                  <span className="px-2.5 py-0.5 rounded-lg bg-secondary text-secondary-foreground text-xs font-semibold">
                    {person.statusBadge}
                  </span>
                )}
              </div>

              <p className="text-sm sm:text-base font-semibold text-muted-foreground">
                {person?.headline || `${person?.x || 2} Years Experience · Tech Professional`}
              </p>

              {/* Meta Chips */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground pt-1">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                  {person?.c || "Bengaluru"} ({person?.wp || "Hybrid"})
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                  {person?.x || 0} Years Experience
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 font-semibold text-foreground">
                  <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                  Expected ₹{person?.es || 12} LPA
                  {person?.currentSalary ? ` (Current: ₹${person.currentSalary}L)` : ""}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  {person?.nt ? `${person.nt} Days Notice` : "Immediate Joiner"}
                </span>
              </div>

              {/* Direct Contact Info */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-foreground/80 pt-2 border-t border-border/60">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  {application?.who || person?.email || "candidate@talento.io"}
                </span>
                {person?.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-primary" />
                    {person.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About / Summary */}
            <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-3">
              <h2 className="text-base font-bold text-foreground font-display">
                Professional Summary
              </h2>
              <p className="text-sm text-foreground/90 leading-relaxed">
                {person?.highlight ||
                  `${name} is a software engineer with ${person?.x || 2} years of practical industry experience building scalable web solutions and applications. Demonstrated track record in modern frameworks, collaborating in agile teams, and shipping production features.`}
              </p>
            </div>

            {/* Technical Skills */}
            <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-3">
              <h2 className="text-base font-bold text-foreground font-display">
                Skills & Technologies
              </h2>
              <div className="flex flex-wrap gap-2 pt-1">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Work History */}
            <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-4">
              <h2 className="text-base font-bold text-foreground font-display">
                Work Experience
              </h2>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-muted/30 border border-border/60 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-foreground">
                      {person?.currentCompany || "Software Engineer"}
                    </h3>
                    <span className="text-xs text-muted-foreground font-medium">Present</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Software Development & System Operations · {person?.x || 2} years total exp
                  </p>
                </div>

                {person?.previousCompany && (
                  <div className="p-4 rounded-xl bg-muted/30 border border-border/60 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-foreground">
                        {person.previousCompany}
                      </h3>
                      <span className="text-xs text-muted-foreground font-medium">Past Role</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Engineering Contributor
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ATS Pipeline Actions (if viewing an applicant on a job) */}
            {application && (
              <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-foreground font-display">
                      Application Stage & Review
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Applied for: <strong>{job?.t || "Open Role"}</strong>
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {stage}
                  </span>
                </div>

                {/* Stage Buttons */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground">Update Stage</label>
                  <div className="flex flex-wrap gap-2">
                    {STAGES.map((s) => (
                      <Button
                        key={s}
                        size="sm"
                        variant={stage === s ? "default" : "outline"}
                        className="text-xs h-8 rounded-xl font-medium"
                        onClick={() => setStage(s)}
                      >
                        {s}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Recruiter Note */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground">Recruiter Notes</label>
                  <Textarea
                    placeholder="Private notes about candidate profile and interview feedback..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    className="text-xs rounded-xl"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
                  <Button variant="outline" size="sm" onClick={onBack} className="text-xs rounded-xl">
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveApplication}
                    className="text-xs rounded-xl font-bold gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Changes
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Education */}
            <div className="bg-card border border-border/80 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-primary" /> Education
              </h3>
              <p className="text-xs text-foreground/90 font-medium leading-relaxed">
                {person?.education || "Bachelor of Technology (B.Tech) in Computer Science"}
              </p>
            </div>

            {/* Certifications */}
            {person?.ce && person.ce.length > 0 && (
              <div className="bg-card border border-border/80 rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" /> Certifications
                </h3>
                <div className="space-y-2">
                  {person.ce.map((cert) => (
                    <div
                      key={cert}
                      className="p-2.5 rounded-xl bg-muted/40 border border-border/60 text-xs font-medium text-foreground/90"
                    >
                      {cert}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions Card */}
            <div className="bg-muted/40 border border-border/80 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Recruiter Actions
              </h3>
              <div className="space-y-2">
                <Button
                  className="w-full text-xs font-semibold rounded-xl gap-2 justify-start h-9"
                  onClick={() => onToast(`Interview invitation sent to ${name}!`)}
                >
                  <Send className="w-3.5 h-3.5" /> Invite to Technical Round
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-xs font-semibold rounded-xl gap-2 justify-start h-9"
                  onClick={handleDownloadStandardResume}
                >
                  <Download className="w-3.5 h-3.5" /> Download Resume PDF
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-xs font-semibold rounded-xl gap-2 justify-start h-9"
                  onClick={handleCopyLink}
                >
                  <Share2 className="w-3.5 h-3.5" /> Copy Candidate Link
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW B: VERIFIED CANDIDATE CIR REPORT ("in verified Candiates if i clcik profile i can see the profiel CIR report of that candates like all advaced features")
  // =========================================================================
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-xs font-semibold gap-2 hover:bg-muted"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Verified Candidates
        </Button>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="text-xs font-medium gap-1.5 rounded-xl"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            {copiedLink ? "Link Copied" : "Share CIR Dossier"}
          </Button>

          <Button
            size="sm"
            onClick={handleDownloadVerifiedCIRReport}
            className="text-xs font-bold gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Download Verified CIR Report (PDF)
          </Button>

          <Button
            size="sm"
            onClick={() => onToast(`Fast-track interview scheduled with ${name}!`)}
            className="text-xs font-bold gap-1.5 rounded-xl bg-[#002C66] hover:bg-[#00204d] text-white shadow-xs cursor-pointer"
          >
            <CalendarDays className="w-3.5 h-3.5" /> Schedule Fast-Track Round
          </Button>
        </div>
      </div>

      {/* OFFICIAL CIR HEADER & TRUST SEAL BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#002C66] via-[#021f47] to-[#01142e] text-white p-6 sm:p-8 shadow-xl border border-blue-900/60">
        {/* Decorative Grid / Accent */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-64 h-64 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

        {/* Top Ledger Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
              Talento Trust Network · Official CIR Ledger
            </span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px] text-white/80">
            <span>Ledger ID: <strong className="text-white font-bold">{person.cirId || "CIR-BLR-8941"}</strong></span>
            <span>•</span>
            <span>Audit Date: <strong className="text-white">Nov 2026</strong></span>
            <span>•</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Cryptographically Validated
            </span>
          </div>
        </div>

        {/* Hero Info */}
        <div className="pt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <div className="relative shrink-0">
              <img
                src={photo}
                alt={name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-emerald-400/80 shadow-lg"
              />
              <span
                title="Talento Authenticated Candidate"
                className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-[#002C66] shadow-md"
              >
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white">
                  {name}
                </h1>
                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-wide">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Talento Verified CIR
                </span>
                {person.statusBadge && (
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 text-xs font-medium">
                    {person.statusBadge}
                  </span>
                )}
              </div>

              <p className="text-sm sm:text-base font-medium text-white/90">
                {person.headline || "Verified Senior Engineer"}
              </p>

              {/* Quick Spec Chips */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-white/80 pt-1">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-white/60" /> {person.c} ({person.wp})
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-white/60" /> {person.x} yrs exp
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-white/60" /> {person.nt}d notice
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 font-bold text-emerald-300">
                  <IndianRupee className="w-3.5 h-3.5" />
                  ₹{person.currentSalary ? `${person.currentSalary}L ➔ ` : ""}₹{person.es} LPA Exp
                </span>
              </div>
            </div>
          </div>

          {/* CIR Trust Score Callout */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shrink-0 text-left sm:text-right">
            <div>
              <span className="text-[11px] font-bold text-white/70 uppercase tracking-wider block">
                CIR Trust Score
              </span>
              <div className="text-3xl sm:text-4xl font-black font-display text-emerald-400 mt-0.5 tracking-tight flex items-baseline gap-1 sm:justify-end">
                {person.cirScore || 97}<span className="text-sm font-semibold text-white/60">/100</span>
              </div>
              <span className="text-xs text-emerald-300 font-bold block mt-1">
                ★ Top 3% Pan-India Benchmark
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3-PILLAR OFFICIAL VERIFICATION MATRIX (ADVANCED CIR FEATURE) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-foreground font-display flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            3-Pillar Enterprise Verification Matrix
          </h2>
          <span className="text-xs text-muted-foreground font-medium">
            Immutable direct audit via government &amp; platform APIs
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pillar 1: Identity & Legal */}
          <div className="p-5 rounded-2xl bg-card border border-emerald-500/30 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Pillar 1 · Identity &amp; Legal
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                <CheckCircle2 className="w-3.5 h-3.5" /> PASSED
              </span>
            </div>
            <h3 className="text-sm font-bold text-foreground">
              Government Identity Check
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Aadhaar / UIDAI:</strong> Biometric OTP authenticated</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>PAN Card Registry:</strong> Active corporate entity match</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Legal &amp; Police Check:</strong> 0 adverse court records</span>
              </li>
            </ul>
          </div>

          {/* Pillar 2: EPFO Employment History */}
          <div className="p-5 rounded-2xl bg-card border border-emerald-500/30 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Pillar 2 · Employment Audit
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED
              </span>
            </div>
            <h3 className="text-sm font-bold text-foreground">
              EPFO UAN Direct Ledger Match
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Current Employer:</strong> {person.currentCompany} (Active PF)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Past Experience:</strong> {person.previousCompany} (Relieving verified)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Tenure &amp; CTC:</strong> {person.x} yrs audited · Zero gaps</span>
              </li>
            </ul>
          </div>

          {/* Pillar 3: Proctored Code & Plagiarism */}
          <div className="p-5 rounded-2xl bg-card border border-emerald-500/30 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Pillar 3 · Technical Integrity
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                <CheckCircle2 className="w-3.5 h-3.5" /> 0% PLAGIARISM
              </span>
            </div>
            <h3 className="text-sm font-bold text-foreground">
              Proctored Coding Integrity
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Plagiarism Index:</strong> 0.0% unique original solution</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Anti-Cheat Telemetry:</strong> 0 tab switches, gaze locked</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Test Case Pass Rate:</strong> 100% edge case pass rate</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* UNLOCKED DIRECT CONTACT DOSSIER (ADVANCED CIR FEATURE) */}
      <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-foreground font-display">
              Unlocked Direct Contact Dossier
            </h3>
          </div>
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full">
            Full Unlocked Recruiter Access
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Phone */}
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-primary" /> Verified Mobile
            </span>
            <div className="text-sm font-bold text-foreground">
              {person.phone || "+91 98401 23456"}
            </div>
            <span className="text-[10px] text-emerald-600 font-bold inline-block">
              ✓ OTP &amp; Active Signal Verified
            </span>
          </div>

          {/* Email */}
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-primary" /> Direct Verified Email
            </span>
            <div className="text-sm font-bold text-foreground truncate" title={person.email}>
              {person.email || `${name.toLowerCase().replace(/\s/g, ".")}@talento-verified.io`}
            </div>
            <span className="text-[10px] text-emerald-600 font-bold inline-block">
              ✓ 100% Deliverability Guaranteed
            </span>
          </div>

          {/* LinkedIn */}
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
              <ExternalLink className="w-3.5 h-3.5 text-primary" /> LinkedIn Profile
            </span>
            <div className="text-sm font-bold text-foreground truncate">
              {person.linkedin || "linkedin.com/in/verified"}
            </div>
            <span className="text-[10px] text-muted-foreground inline-block">
              EPFO profile matched
            </span>
          </div>

          {/* GitHub / Portfolio */}
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
              <Code className="w-3.5 h-3.5 text-primary" /> GitHub &amp; Code Repo
            </span>
            <div className="text-sm font-bold text-foreground truncate">
              {person.github || "github.com/verified-dev"}
            </div>
            <span className="text-[10px] text-emerald-600 font-bold inline-block">
              ✓ Public commits &amp; stars audited
            </span>
          </div>
        </div>
      </div>

      {/* PROCTORED SKILL SCORECARD & TEST BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Assessment Scorecards */}
          <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground font-display flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-600" />
                  Proctored Technical Scorecard
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Standardized coding benchmarks with live anti-cheat surveillance
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-muted-foreground bg-muted px-2.5 py-1 rounded-lg">
                Anti-Cheat: 100% Compliant
              </span>
            </div>

            <div className="space-y-3.5 pt-1">
              {scores.map(([testName, score]) => (
                <div
                  key={testName}
                  className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-foreground text-sm">{testName}</span>
                    <span className="font-extrabold text-emerald-600 text-sm">
                      {score}% Passed <span className="text-[11px] text-muted-foreground font-normal">(Top 3% percentile)</span>
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2.5 rounded-full bg-border/60 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                      style={{ width: `${score}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
                    <span>Algorithm Complexity: <strong>O(N) Optimal</strong></span>
                    <span>Test Cases: <strong>100% Passed (42/42)</strong></span>
                    <span>Memory: <strong>14.2 MB (Efficient)</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Engineering Highlight & Track Record */}
          <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-foreground font-display">
              Audited Engineering Achievements &amp; Track Record
            </h3>
            {person.highlight && (
              <div className="p-4 rounded-2xl bg-emerald-500/[0.04] border border-emerald-500/20 text-xs sm:text-sm text-foreground/90 italic leading-relaxed">
                "{person.highlight}"
              </div>
            )}

            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    <h4 className="text-sm font-bold text-foreground">
                      {person.currentCompany}
                    </h4>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                      EPFO Verified
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">Active Role</span>
                </div>
                <p className="text-xs text-muted-foreground pt-1">
                  Senior engineering contributor driving high-throughput architecture and production systems.
                </p>
              </div>

              {person.previousCompany && (
                <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <h4 className="text-sm font-bold text-foreground">
                        {person.previousCompany}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-[10px] font-bold">
                        Relieving Verified
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">Previous Tenure</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar: Skills, Education & Certifications */}
        <div className="space-y-6">
          {/* Verified Skills */}
          <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-foreground font-display">
              Audited Core Skills
            </h3>
            <div className="flex flex-wrap gap-2 pt-1">
              {skills.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1.5 rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-foreground font-display flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              Verified Education
            </h3>
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 text-xs font-medium text-foreground/90 leading-relaxed">
              {person.education || "BITS Pilani · B.Tech Computer Science"}
              <span className="text-[10px] text-emerald-600 font-bold block mt-1">
                ✓ University Registry Matched
              </span>
            </div>
          </div>

          {/* Certifications */}
          {person.ce && person.ce.length > 0 && (
            <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-foreground font-display flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-600" />
                Verified Industry Credentials
              </h3>
              <div className="space-y-2">
                {person.ce.map((cert) => (
                  <div
                    key={cert}
                    className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-800 dark:text-purple-300 flex items-center gap-2"
                  >
                    <Award className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Executive Download & Fast-Track Actions */}
          <div className="p-6 rounded-3xl bg-[#002C66]/5 dark:bg-[#002C66]/20 border border-[#002C66]/20 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#002C66] dark:text-blue-300">
              Executive CIR Actions
            </h3>
            <div className="space-y-2">
              <Button
                onClick={handleDownloadVerifiedCIRReport}
                className="w-full text-xs font-bold rounded-xl gap-2 h-10 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4" /> Download Official CIR Report (PDF)
              </Button>
              <Button
                onClick={() => onToast(`Fast-track interview invite sent to ${name}!`)}
                className="w-full text-xs font-bold rounded-xl gap-2 h-10 bg-[#002C66] hover:bg-[#00204d] text-white cursor-pointer shadow-xs"
              >
                <CalendarDays className="w-4 h-4" /> Schedule Fast-Track Interview
              </Button>
              <Button
                variant="outline"
                onClick={handleCopyLink}
                className="w-full text-xs font-semibold rounded-xl gap-2 h-9"
              >
                <Share2 className="w-3.5 h-3.5" /> Share Encrypted CIR Dossier
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
