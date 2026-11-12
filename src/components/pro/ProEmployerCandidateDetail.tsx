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
  Sparkles,
  CheckCircle2,
  Clock,
  Phone,
  IndianRupee,
  FileText,
  Award,
  Plus,
  Send,
} from "lucide-react";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CANDIDATES_SEED,
  STAGES,
  generateHash,
  calcScore,
  calcTalentScore,
  avgCandidateScore,
  levelFromExp,
  candidateFitForJob,
  type ProApplication,
  type ProCandidate,
  type ProJob,
} from "@/data/proData";
import { getCandidatePhoto } from "@/data/portalAssets";
import { downloadCirReportPdf, type RealTimeCertificateData } from "@/utils/credentialPdf";
import "./employer-workspace.css";

interface Props {
  candidate?: ProCandidate;
  application?: ProApplication;
  job?: ProJob;
  employerJobs?: ProJob[];
  onBack: () => void;
  onSave: (
    id: number,
    changes: Pick<ProApplication, "st" | "cn" | "note">,
    message: string,
    interview: string
  ) => void;
  onCreateApplication?: (
    cand: ProCandidate,
    jobId: number,
    stage: ProApplication["st"],
    note: string,
    interview?: string
  ) => void;
  onToast: (message: string) => void;
}

const messages = [
  "Your application is currently under review by our hiring team.",
  "Congratulations! Your profile has been shortlisted for technical discussion.",
  "We would like to invite you for an interview round. Please pick a time.",
  "Thank you for your application. We have decided to advance other candidates at this time.",
];

const CANDIDATE_BIOS: Record<
  string,
  {
    headline: string;
    email: string;
    phone: string;
    education: string;
    companies: { role: string; company: string; period: string; summary: string }[];
    projects: { name: string; stack: string; impact: string }[];
  }
> = {
  "Aarav Mehta": {
    headline: "Senior Frontend & Design Systems Engineer",
    email: "aarav.mehta@talentcir.verified",
    phone: "+91 98450 21490",
    education: "B.Tech in Computer Science · NIT Surathkal",
    companies: [
      {
        role: "Senior React Developer",
        company: "Razorpay",
        period: "2023 – Present",
        summary: "Architected high-throughput checkout micro-frontends in React 18 & TypeScript, cutting bundle size by 34%.",
      },
      {
        role: "Frontend Engineer",
        company: "Zoho",
        period: "2021 – 2023",
        summary: "Built accessible enterprise UI components and real-time analytics dashboards used by 50k+ daily users.",
      },
    ],
    projects: [
      {
        name: "Enterprise Design System & Token Engine",
        stack: "React, TypeScript, Tailwind CSS",
        impact: "Adopted across 14 product squads · 99.4% Lighthouse accessibility",
      },
    ],
  },
  "Diya Nair": {
    headline: "Product & Business Intelligence Data Analyst",
    email: "diya.nair@talentcir.verified",
    phone: "+91 98401 66320",
    education: "B.E. Information Technology · Anna University",
    companies: [
      {
        role: "Data Analyst",
        company: "Freshworks",
        period: "2023 – Present",
        summary: "Designed automated SQL & Python cohort pipelines and executive Tableau dashboards tracking ARR retention.",
      },
    ],
    projects: [
      {
        name: "Revenue Churn & Funnel Attribution Suite",
        stack: "SQL, Python, Tableau",
        impact: "Identified $1.2M expansion opportunities across SMB cohorts",
      },
    ],
  },
  "Rohan Das": {
    headline: "Backend & Algorithms Software Engineer",
    email: "rohan.das@talentcir.verified",
    phone: "+91 98230 44110",
    education: "B.E. Computer Engineering · COEP Pune",
    companies: [
      {
        role: "Software Engineering Intern",
        company: "Infosys",
        period: "2024 – Present",
        summary: "Implemented Java microservice endpoints, unit test suites, and low-latency data structures.",
      },
    ],
    projects: [
      {
        name: "Distributed Rate-Limiter & Task Queue",
        stack: "Java, DSA, REST APIs",
        impact: "Sustained 15k req/sec in load benchmarks",
      },
    ],
  },
  "Sneha Iyer": {
    headline: "Staff Cloud Platform & Kubernetes Architect",
    email: "sneha.iyer@talentcir.verified",
    phone: "+91 98802 77512",
    education: "M.Tech Cloud Computing · IIT Madras",
    companies: [
      {
        role: "Lead Cloud Platform Engineer",
        company: "Atlassian",
        period: "2022 – Present",
        summary: "Managed multi-region EKS clusters, Terraform IaC modules, and zero-downtime deployment pipelines.",
      },
      {
        role: "DevOps Engineer",
        company: "Swiggy",
        period: "2019 – 2022",
        summary: "Automated CI/CD observability and reduced cloud compute spend by 28% across production workloads.",
      },
    ],
    projects: [
      {
        name: "Multi-Region Kubernetes Auto-Scaler",
        stack: "AWS, Kubernetes, Terraform",
        impact: "99.99% uptime SLA across 400+ microservices",
      },
    ],
  },
  "Kabir Shah": {
    headline: "Machine Learning & MLOps Infrastructure Engineer",
    email: "kabir.shah@talentcir.verified",
    phone: "+91 97014 88219",
    education: "B.Tech AI & Data Science · IIIT Hyderabad",
    companies: [
      {
        role: "ML Engineer",
        company: "Uber",
        period: "2022 – Present",
        summary: "Trained and deployed PyTorch ranking models with automated feature stores and low-latency inference.",
      },
    ],
    projects: [
      {
        name: "Real-Time Fraud Detection Inference Pipeline",
        stack: "Python, PyTorch, MLOps",
        impact: "Sub-18ms p99 latency · 96.4% precision",
      },
    ],
  },
  "Meera Pillai": {
    headline: "Lead Product Designer & UX Research Strategist",
    email: "meera.pillai@talentcir.verified",
    phone: "+91 98204 51903",
    education: "B.Des Interaction Design · IDC IIT Bombay",
    companies: [
      {
        role: "Senior Product Designer",
        company: "Swiggy",
        period: "2021 – Present",
        summary: "Led end-to-end UX research, design systems, and checkout conversion flows for 20M+ monthly users.",
      },
    ],
    projects: [
      {
        name: "B2B Hiring Studio UX Overhaul",
        stack: "Figma, UX Research, Prototyping",
        impact: "+41% recruiter workflow completion speed",
      },
    ],
  },
  "Arjun Rao": {
    headline: "Principal Backend & Distributed Systems Architect",
    email: "arjun.rao@talentcir.verified",
    phone: "+91 98455 90124",
    education: "B.Tech Computer Science · NIT Trichy",
    companies: [
      {
        role: "Staff Backend Engineer",
        company: "PhonePe",
        period: "2020 – Present",
        summary: "Designed high-scale Node.js & PostgreSQL payment ledgers handling 4,000+ TPS on AWS.",
      },
      {
        role: "Senior Software Engineer",
        company: "Amazon",
        period: "2017 – 2020",
        summary: "Owned distributed order fulfillment services and fault-tolerant event streaming architectures.",
      },
    ],
    projects: [
      {
        name: "High-Throughput Payment Settlement Engine",
        stack: "Node.js, PostgreSQL, AWS, System Design",
        impact: "Zero data loss across 100M+ monthly transactions",
      },
    ],
  },
  "Priya Menon": {
    headline: "Frontend UI Engineer · React & Modern CSS",
    email: "priya.menon@talentcir.verified",
    phone: "+91 98409 31280",
    education: "B.Tech Computer Science · SRM University",
    companies: [
      {
        role: "Frontend Developer",
        company: "Zoho",
        period: "2024 – Present",
        summary: "Built responsive React & TypeScript interfaces, interactive charts, and pixel-accurate component libraries.",
      },
    ],
    projects: [
      {
        name: "Interactive SaaS Onboarding & Analytics UI",
        stack: "React, CSS, TypeScript",
        impact: "98 Lighthouse performance score",
      },
    ],
  },
};

export function ProEmployerCandidateDetail({
  candidate,
  application,
  job,
  employerJobs = [],
  onBack,
  onSave,
  onCreateApplication,
  onToast,
}: Props) {
  const person = candidate || CANDIDATES_SEED.find((c) => c.n === application?.name);
  const name = application?.name || person?.n || "Candidate";
  const bio = CANDIDATE_BIOS[name] || {
    headline: "Verified Engineering Professional",
    email: application?.who || `${name.toLowerCase().replace(/\s+/g, ".")}@talentcir.verified`,
    phone: "+91 98450 11223",
    education: "B.Tech in Computer Science",
    companies: [
      {
        role: "Software Engineer",
        company: "Verified Technology Partner",
        period: "2022 – Present",
        summary: "Delivered production features, automated testing, and scalable architecture.",
      },
    ],
    projects: [
      {
        name: "Production Engineering Platform",
        stack: (application?.sk || person?.sk || ["React", "TypeScript"]).join(", "),
        impact: "Verified via TalentCIR Proctored Assessment",
      },
    ],
  };

  const skills = application?.sk || person?.sk || [];
  const certs = application?.ce || person?.ce || [];
  const expYears = application?.exp ?? person?.x ?? 2;
  const city = person?.c || job?.l || "Bengaluru";
  const email = application?.who || bio.email;

  const [selectedJobId, setSelectedJobId] = useState<number>(
    job?.id || employerJobs[0]?.id || 81001
  );
  const activeJob =
    employerJobs.find((j) => j.id === selectedJobId) || job || employerJobs[0];

  const [tab, setTab] = useState("Overview");
  const [stage, setStage] = useState<ProApplication["st"]>(application?.st || "Shortlisted");
  const [message, setMessage] = useState("");
  const [cover, setCover] = useState(
    application?.cn ||
      `Verified TalentCIR profile with ${expYears} years of hands-on experience in ${skills.join(", ")}.`
  );
  const [note, setNote] = useState(
    application?.note ||
      (() => {
        try {
          return localStorage.getItem(`tq_cand_note_${name}`) || "";
        } catch {
          return "";
        }
      })()
  );
  const [date, setDate] = useState(application?.iv?.slice(0, 10) || "");
  const [time, setTime] = useState(application?.iv?.slice(11, 16) || "");
  const [schedule, setSchedule] = useState(false);

  const scores = Object.entries(application?.as || person?.as || {});
  const avgScore = scores.length
    ? Math.round(scores.reduce((sum, [, s]) => sum + s, 0) / scores.length)
    : 84;
  const roleMatchScore =
    person && activeJob
      ? calcTalentScore(person, activeJob)
      : activeJob
      ? calcScore(activeJob, { sk: skills })
      : avgScore;
  const fitBreakdown =
    person && activeJob ? candidateFitForJob(person, activeJob) : [];

  const downloadCv = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(20);
    pdf.text(name, 20, 24);
    pdf.setFontSize(11);
    pdf.text(
      pdf.splitTextToSize(
        `${bio.headline}\nEmail: ${email} | Phone: ${bio.phone}\nLocation: ${city} | Experience: ${expYears} years (${levelFromExp(expYears)})\nExpected CTC: ₹${person?.es ?? 18} LPA | Notice Period: ${person?.nt ? `${person.nt} days` : "Immediate"}\n\nVERIFIED SKILLS\n${skills.join(", ")}\n\nPROCTORED ASSESSMENT SCORES (Avg: ${avgScore}%)\n${scores.map(([k, v]) => `• ${k}: ${v}%`).join("\n")}\n\nCERTIFICATIONS\n${certs.join(", ") || "TalentCIR Verified Proficiency"}\n\nWORK EXPERIENCE\n${bio.companies.map((c) => `${c.role} · ${c.company} (${c.period})\n${c.summary}`).join("\n\n")}\n\nEDUCATION\n${bio.education}`,
        170
      ),
      20,
      36
    );
    pdf.save(`${name.replace(/\s/g, "-")}-CV.pdf`);
    onToast(`Downloaded ${name}'s CV (.pdf)`);
  };

  const downloadCir = () => {
    const topSkill = scores[0]?.[0] || skills[0] || "Engineering";
    const cirId = `CIR-${generateHash(name)}`;
    const certData: RealTimeCertificateData = {
      credentialId: cirId,
      candidateName: name,
      candidateEmail: email,
      candidateRole: bio.headline,
      title: `${topSkill} & Role Readiness CIR Assessment`,
      issuer: "TalentCIR AI-Proctored Assessment Authority",
      issuedDate: "Nov 2026",
      validUntil: "Nov 2028",
      score: avgScore,
      percentile: avgScore >= 88 ? "Top 4%" : avgScore >= 80 ? "Top 9%" : "Top 15%",
      integrityScore: "99.8%",
      timeTaken: "36m 12s / 45m",
      codingTestCases: "12 / 12 Passed",
      peerAverage: 64,
      partnerCutoff: 60,
      salaryBand: `INR ${person?.es || 18} LPA`,
      verificationHash: `0x8F2A...${avgScore}C9`,
      subSkills: scores.map(([k, v]) => ({
        name: `${k} Production Competency`,
        score: v,
        benchmark: 62,
      })),
      recruiterSummary: `${name} achieved a ${avgScore}% composite proctored score and a ${roleMatchScore}% role fit for ${activeJob?.t || "your engineering team"}.`,
    };
    downloadCirReportPdf(certData);
    onToast(`Downloaded Official CIR Report (${cirId}.pdf)`);
  };

  const save = () => {
    try {
      localStorage.setItem(`tq_cand_note_${name}`, note);
    } catch {
      /* ignore storage errors */
    }
    if (application) {
      if (schedule && (!date || !time)) {
        onToast("Choose an interview date and time.");
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
      return;
    }
    if (person && onCreateApplication && activeJob) {
      onCreateApplication(
        person,
        activeJob.id,
        stage,
        note,
        schedule && date && time ? `${date}T${time}` : undefined
      );
      return;
    }
    onToast("Candidate notes and evaluation saved.");
  };

  return (
    <div className="employer-workspace space-y-5">
      <Button variant="ghost" className="px-0 text-primary" onClick={onBack}>
        <ArrowLeft />
        Back to Candidates
      </Button>

      {/* Executive Candidate Header */}
      <header className="workspace-panel flex flex-wrap items-start gap-5">
        <img
          src={getCandidatePhoto(name)}
          alt={name}
          className="h-16 w-16 rounded-full object-cover border-2 border-primary/20"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold">{name}</h1>
            <span className="workspace-chip align-middle">
              <ShieldCheck size={13} />
              {application?.st || "Verified Talent Pool"}
            </span>
            <span className="workspace-chip align-middle">
              <Sparkles size={12} />
              {roleMatchScore}% Role Match
            </span>
          </div>
          <p className="mt-1.5 text-xs font-medium text-foreground/90">
            {bio.headline} · {expYears} yrs experience ({levelFromExp(expYears)})
          </p>
          <div className="mt-2.5 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Mail size={13} className="text-primary" />
              {email}
            </span>
            <span className="flex items-center gap-1.5">
              <Phone size={13} className="text-primary" />
              {bio.phone}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={13} className="text-primary" />
              {city} ({person?.wp || "Hybrid"})
            </span>
            <span className="flex items-center gap-1.5">
              <IndianRupee size={13} className="text-primary" />
              Expected: ₹{person?.es ?? 18} LPA
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={13} className="text-primary" />
              Notice: {person?.nt === 0 ? "Immediate Joiner" : `${person?.nt ?? 15} days`}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(window.location.href);
                onToast("Profile link copied.");
              } catch {
                onToast("Copy the profile address from your browser.");
              }
            }}
          >
            <Share2 />
            Share Profile
          </Button>
          <Button variant="outline" onClick={downloadCir}>
            <FileText />
            Download CIR Report
          </Button>
          <Button onClick={downloadCv}>
            <Download />
            Download CV
          </Button>
        </div>
      </header>

      {/* Top 4 Telemetry Cards */}
      <div className="workspace-panel grid gap-5 sm:grid-cols-4">
        {[
          {
            icon: CalendarDays,
            label: "Application Status",
            value: application
              ? `Applied ${new Date(application.at).toLocaleDateString("en-GB")}`
              : "Pre-Assessed Talent Pool",
          },
          {
            icon: MessageSquare,
            label: "Current Stage",
            value: application?.st || `${stage} (Sourcing)`,
          },
          {
            icon: Users,
            label: "Talent CIR ID",
            value: `CIR-${generateHash(name)}`,
          },
          {
            icon: Star,
            label: "Assessment Average",
            value: `${avgScore}% Verified`,
          },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex gap-3">
            <div className="workspace-icon">
              <Icon size={18} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="mt-1 text-sm font-semibold">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <nav
        className="flex gap-2 overflow-x-auto border-b border-border"
        aria-label="Candidate sections"
      >
        {["Overview", "Resume", "Activity", "Interviews", "Notes", "Documents"].map((t) => (
          <Button
            key={t}
            variant="ghost"
            onClick={() => setTab(t)}
            className={
              tab === t
                ? "rounded-none border-b-2 border-primary text-primary font-semibold"
                : "rounded-none text-muted-foreground"
            }
          >
            {t}
          </Button>
        ))}
      </nav>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,2.2fr)_minmax(260px,1fr)]">
        <section className="workspace-panel space-y-6">
          {tab === "Overview" && (
            <>
              {/* 6-Dimension Job Fit Breakdown */}
              {activeJob && (
                <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                        AI Role Match &amp; 6-Dimension Fit Analysis
                      </span>
                      <h3 className="text-base font-bold mt-0.5">
                        Match for {activeJob.t} ({roleMatchScore}%)
                      </h3>
                    </div>
                    {employerJobs.length > 1 && (
                      <select
                        aria-label="Compare against job opening"
                        value={activeJob.id}
                        onChange={(e) => setSelectedJobId(Number(e.target.value))}
                        className="!h-8 !w-auto text-xs font-medium"
                      >
                        {employerJobs.map((j) => (
                          <option key={j.id} value={j.id}>
                            {j.t} ({j.l})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {fitBreakdown.length > 0 && (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {fitBreakdown.map((item) => (
                        <div
                          key={item.name}
                          className="rounded-lg border border-border/80 bg-card p-3 space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold">{item.name}</span>
                            <strong className="text-primary">{item.score}%</strong>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${Math.max(8, item.score)}%` }}
                            />
                          </div>
                          <p className="text-[11px] text-muted-foreground">{item.note}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div>
                <h2 className="text-lg font-bold">
                  {application
                    ? "Update Application Status & Pipeline Stage"
                    : "Fast-Track Candidate to Job Pipeline"}
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {application
                    ? "Manage the application stage, send 24h SLA updates, and schedule interview rounds."
                    : `Shortlist ${name} directly into "${activeJob?.t || "your active job"}" or schedule a technical interview round.`}
                </p>

                <div className="mt-5 space-y-6">
                  <div>
                    <h3 className="candidate-step">
                      <span>1</span>
                      {application ? "Application Status" : "Select Target Pipeline Stage"}
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {STAGES.map((s) => (
                        <Button
                          key={s}
                          size="sm"
                          variant={stage === s ? "default" : "outline"}
                          onClick={() => setStage(s)}
                        >
                          {s}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="candidate-step">
                      <span>2</span>Send Candidate Update / Invitation
                    </h3>
                    <div className="mt-3 space-y-2">
                      {messages.map((m) => (
                        <label
                          className="flex items-start gap-3 rounded-md border border-border p-3 text-xs cursor-pointer hover:border-primary/40"
                          key={m}
                        >
                          <input
                            type="radio"
                            name="status-message"
                            checked={message === m}
                            onChange={() => setMessage(m)}
                            className="accent-primary"
                          />
                          {m}
                        </label>
                      ))}
                      <Textarea
                        aria-label="Custom status update"
                        placeholder="Or write a custom outreach / status message..."
                        maxLength={500}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="candidate-step">
                      <span>3</span>Schedule Technical Round
                    </h3>
                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                      <Input
                        aria-label="Interview date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                      <Input
                        aria-label="Interview time"
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                      />
                      <Button
                        variant={schedule ? "default" : "outline"}
                        disabled={!date || !time}
                        onClick={() => setSchedule((v) => !v)}
                      >
                        <CalendarDays />
                        {schedule ? "Round selected" : "Schedule Round"}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="candidate-step">
                      <span>4</span>Candidate Summary &amp; Cover Note
                    </h3>
                    <Textarea
                      className="mt-3"
                      aria-label="Candidate cover note"
                      maxLength={500}
                      value={cover}
                      onChange={(e) => setCover(e.target.value)}
                    />
                  </div>

                  <div>
                    <h3 className="candidate-step">
                      <span>5</span>Private Recruiter Notes
                    </h3>
                    <Textarea
                      className="mt-3"
                      aria-label="Private recruiter notes"
                      placeholder="Internal feedback, compensation notes, and hiring rubric..."
                      maxLength={500}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end gap-2 border-t border-border pt-4">
                    <Button variant="outline" onClick={onBack}>
                      Cancel
                    </Button>
                    <Button onClick={save}>
                      {application ? <Save /> : <Plus />}
                      {application ? "Save Changes" : `Add to ${stage} Pipeline`}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}

          {tab === "Resume" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                <div>
                  <h2 className="text-lg font-bold">{name} · Verified Engineering Resume</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {bio.headline} · {expYears} years experience · {city}
                  </p>
                </div>
                <Button size="sm" onClick={downloadCv}>
                  <Download />
                  Download CV (.pdf)
                </Button>
              </div>

              <div>
                <h3 className="text-sm font-bold">Executive Summary</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{cover}</p>
              </div>

              <div>
                <h3 className="text-sm font-bold">Work Experience</h3>
                <div className="mt-3 space-y-3">
                  {bio.companies.map((c, idx) => (
                    <div key={idx} className="rounded-lg border border-border p-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-xs font-bold">
                          {c.role} · <span className="text-primary">{c.company}</span>
                        </p>
                        <span className="text-[11px] text-muted-foreground">{c.period}</span>
                      </div>
                      <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                        {c.summary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold">Key Engineering Projects</h3>
                <div className="mt-3 space-y-2.5">
                  {bio.projects.map((p, idx) => (
                    <div key={idx} className="rounded-lg border border-border bg-muted/20 p-3.5">
                      <p className="text-xs font-bold">{p.name}</p>
                      <p className="text-[11px] text-primary font-medium mt-0.5">{p.stack}</p>
                      <p className="text-xs text-muted-foreground mt-1">{p.impact}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-border p-3.5">
                  <h3 className="text-xs font-bold uppercase text-muted-foreground">Education</h3>
                  <p className="mt-1.5 text-xs font-semibold">{bio.education}</p>
                </div>
                <div className="rounded-lg border border-border p-3.5">
                  <h3 className="text-xs font-bold uppercase text-muted-foreground">
                    Verified Certifications
                  </h3>
                  <p className="mt-1.5 text-xs font-semibold">
                    {certs.length ? certs.join(" · ") : "TalentCIR Verified Assessment Credential"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {tab === "Activity" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Candidate &amp; Pipeline Activity</h2>
              <div className="divide-y divide-border">
                {application?.upd?.length
                  ? [...application.upd].reverse().map((update, i) => (
                      <div className="py-3.5" key={i}>
                        <p className="text-xs font-semibold">{update.msg}</p>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          {new Date(update.at).toLocaleString("en-GB")}
                        </p>
                      </div>
                    ))
                  : null}
                <div className="py-3.5">
                  <p className="text-xs font-semibold flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    TalentCIR Proctored Assessment Verified ({avgScore}% composite score · 99.8% integrity)
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Identity, webcam proctoring, and code execution verified
                  </p>
                </div>
                <div className="py-3.5">
                  <p className="text-xs font-semibold">
                    Matched at {roleMatchScore}% fit for {activeJob?.t || "active engineering roles"}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Skills verified: {skills.join(", ")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {tab === "Interviews" && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold">Interview Schedule &amp; Technical Rounds</h2>
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <p className="text-xs font-semibold">
                  {application?.iv
                    ? `Scheduled Technical Round: ${application.iv.replace("T", " at ")}`
                    : date && time
                    ? `Draft Round Selected: ${date} at ${time}`
                    : "No interview round scheduled yet."}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Pick a date and time below to schedule or reschedule a live technical or AI-assisted interview.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <Input
                    aria-label="Interview date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  <Input
                    aria-label="Interview time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                  <Button
                    disabled={!date || !time}
                    onClick={() => {
                      setSchedule(true);
                      setStage("Interview");
                      if (application) {
                        onSave(
                          application.id,
                          { st: "Interview", cn: cover, note },
                          `Interview scheduled for ${date} at ${time}.`,
                          `${date}T${time}`
                        );
                      } else if (person && onCreateApplication && activeJob) {
                        onCreateApplication(person, activeJob.id, "Interview", note, `${date}T${time}`);
                      } else {
                        onToast(`Interview scheduled with ${name} for ${date} at ${time}.`);
                      }
                    }}
                  >
                    <CalendarDays />
                    Confirm Interview
                  </Button>
                </div>
              </div>
            </div>
          )}

          {tab === "Notes" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Private Recruiter Notes &amp; Rubric</h2>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Strong System Design",
                  "Verified High Assessment Score",
                  "Within Salary Budget",
                  "Immediate / Fast Joiner",
                  "Recommended for Technical Round",
                ].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() =>
                      setNote((prev) => (prev.includes(tag) ? prev : prev ? `${prev}\n• ${tag}` : `• ${tag}`))
                    }
                    className="workspace-chip cursor-pointer hover:opacity-80"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
              <Textarea
                aria-label="Private recruiter notes"
                rows={5}
                placeholder="Add internal evaluation notes, compensation expectations, and interviewer takeaways..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <Button onClick={save}>
                <Save />
                Save Recruiter Notes
              </Button>
            </div>
          )}

          {tab === "Documents" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Verified Credentials &amp; Candidate Documents</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="workspace-icon">
                      <FileText size={18} />
                    </span>
                    <div>
                      <p className="text-xs font-bold">{name}-CV.pdf</p>
                      <p className="text-[11px] text-muted-foreground">
                        ATS-formatted engineering curriculum vitae
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full" onClick={downloadCv}>
                    <Download />
                    Download CV (.pdf)
                  </Button>
                </div>

                <div className="rounded-xl border border-border p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="workspace-icon">
                      <Award size={18} />
                    </span>
                    <div>
                      <p className="text-xs font-bold">TalentCIR-Report-CIR-{generateHash(name)}.pdf</p>
                      <p className="text-[11px] text-muted-foreground">
                        Proctored skill telemetry &amp; 99.8% integrity report
                      </p>
                    </div>
                  </div>
                  <Button size="sm" className="w-full" onClick={downloadCir}>
                    <Download />
                    Download CIR Report (.pdf)
                  </Button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Right Sidebar Quick Info */}
        <aside className="workspace-panel space-y-5">
          <div className="flex gap-3 border-b border-border pb-4">
            <img
              src={getCandidatePhoto(name)}
              alt=""
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <h2 className="text-sm font-bold">{name}</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {activeJob ? `Matched for ${activeJob.t}` : bio.headline}
              </p>
            </div>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold">
              <Briefcase size={16} className="text-primary" />
              Quick Info
            </h3>
            <dl className="mt-3 space-y-2.5 text-xs">
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Email</dt>
                <dd className="font-medium truncate max-w-[165px]">{email}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Phone</dt>
                <dd className="font-medium">{bio.phone}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Location</dt>
                <dd className="font-medium">{city}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Work Mode</dt>
                <dd className="font-medium">{person?.wp || "Hybrid"}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Experience</dt>
                <dd className="font-medium">
                  {expYears} years ({levelFromExp(expYears)})
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Expected CTC</dt>
                <dd className="font-semibold text-primary">₹{person?.es ?? 18} LPA</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Notice period</dt>
                <dd className="font-medium">
                  {person?.nt === 0 ? "Immediate" : `${person?.nt ?? 15} days`}
                </dd>
              </div>
            </dl>
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="text-sm font-bold">Verified Skills</h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {skills.map((skill) => {
                const isJobSkill = activeJob?.sk.some(
                  (js) => js.toLowerCase() === skill.toLowerCase()
                );
                return (
                  <span
                    className="workspace-chip"
                    key={skill}
                    title={isJobSkill ? "Matches selected job requirement" : undefined}
                  >
                    {skill}
                    {isJobSkill ? " ✓" : ""}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="text-sm font-bold">Proctored Assessment Results</h3>
            {scores.map(([skill, score]) => (
              <div className="mt-3 space-y-1 text-xs" key={skill}>
                <div className="flex justify-between">
                  <span>{skill}</span>
                  <strong className="text-primary">{score}%</strong>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${score}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="flex items-center gap-2 text-sm font-bold">
              <GraduationCap size={16} className="text-primary" />
              Certifications &amp; Education
            </h3>
            <p className="mt-2 text-xs font-medium">{bio.education}</p>
            <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
              {certs.join(" · ") || "TalentCIR Verified Engineering Badge"}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
