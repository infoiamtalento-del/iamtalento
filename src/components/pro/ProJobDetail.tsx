import { useState } from "react";
import { ArrowLeft, Bookmark, BookmarkCheck, Briefcase, Building2, CalendarDays, CheckCircle2, Clock, Coins, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ProJob, ProUser, ProApplication, calcScore, fitAnalysis, levelFromExp, timeAgo } from "@/data/proData";
import { getCompanyLogo } from "@/data/portalAssets";
import { COMPANY_BLURBS } from "@/data/proJobMeta";
import { MatchRing } from "./ProMatchRing";
import "./pro-job-detail.css";

interface Props {
  job: ProJob; user: ProUser; jobs: ProJob[]; applications: ProApplication[];
  onBack: () => void; onOpenJob: (id: number) => void;
  onApply: (id: number, note?: string) => void; onSave: (id: number) => void;
}

export function ProJobDetail({ job, user, jobs, applications, onBack, onOpenJob, onApply, onSave }: Props) {
  const [note, setNote] = useState("");
  const [logoFailed, setLogoFailed] = useState(false);
  const application = applications.find(a => a.jid === job.id && a.who === user.email);
  const saved = (user.saved || []).includes(job.id);
  const score = calcScore(job, user);
  const fit = fitAnalysis(job, user);
  const userSkills = (user.sk || []).map(s => s.toLowerCase());
  const missing = job.sk.filter(s => !userSkills.includes(s.toLowerCase()));
  const similar = jobs.filter(j => j.id !== job.id).sort((a, b) => b.sk.filter(s => job.sk.includes(s)).length - a.sk.filter(s => job.sk.includes(s)).length).slice(0, 4);
  const facts = [
    { icon: Briefcase, label: "Experience", value: `${job.e}+ years` },
    { icon: Coins, label: "Salary", value: `₹${job.a}–${job.b} LPA` },
    { icon: MapPin, label: "Location", value: job.l },
    { icon: Building2, label: "Work mode", value: job.m === "Onsite" ? "In Office" : job.m },
    { icon: Clock, label: "Job type", value: job.ty },
    { icon: CalendarDays, label: "Posted", value: timeAgo(job.at) },
  ];
  const saveButton = <Button variant="outline" aria-pressed={saved} onClick={() => onSave(job.id)}>{saved ? <BookmarkCheck /> : <Bookmark />}{saved ? "Saved" : "Save"}</Button>;
  const applyButton = <Button disabled={Boolean(application)} onClick={() => onApply(job.id, note)}>{application ? <CheckCircle2 /> : null}{application ? "Applied" : "Apply now"}</Button>;
  return <div className="pro-job-detail">
    <div className="jd-toolbar"><Button variant="ghost" onClick={onBack}><ArrowLeft />Back to jobs</Button><span className="jd-breadcrumb">Jobs · {job.c} · {job.t}</span><div className="jd-buttons">{saveButton}{applyButton}</div></div>
    <section className="jd-summary" aria-label="Job overview">
      <div className="jd-identity">{logoFailed ? <Building2 className="jd-logo" /> : <img className="jd-logo" src={getCompanyLogo(job.c)} alt={`${job.c} logo`} onError={() => setLogoFailed(true)} />}<div><h1>{job.t}</h1><span className="jd-company">{job.c}</span><div className="jd-meta"><span><MapPin />{job.l}</span><span><Briefcase />{job.e}+ years</span><span><Coins />₹{job.a}–{job.b} LPA</span><span><Clock />Posted {timeAgo(job.at)}</span></div><div className="jd-tags mt-2"><span className="jd-tag is-matched">{job.m}</span><span className="jd-tag is-matched">{job.ty}</span><span className="jd-tag is-matched">{levelFromExp(job.e)}</span></div></div><div className="jd-match"><small>AI MATCH</small><MatchRing percent={score} size={62} /></div></div>
      <div className="jd-facts">{facts.map(({ icon: Icon, label, value }) => <div className="jd-fact" key={label}><Icon /><div><small>{label}</small><strong>{value}</strong></div></div>)}</div>
    </section>
    <div className="jd-grid"><div className="jd-content">
      <section className="jd-panel"><h2>About the role</h2><p>Join {job.c} as a {job.t} in {job.l}{job.m === "Remote" ? " with a remote team" : ""}. Bring your experience in {job.sk.slice(0, 4).join(", ")} to meaningful projects, working closely with colleagues to deliver high-quality results.</p></section>
      <section className="jd-panel"><h2>Key responsibilities</h2><ul><li>Own your work from planning through delivery and follow-up.</li><li>Apply {job.sk.slice(0, 3).join(", ")} to solve practical challenges.</li><li>Collaborate with cross-functional teams to align priorities and outcomes.</li><li>Review results, maintain quality, and improve how the team works.</li><li>Document progress and share learnings with your colleagues.</li></ul></section>
      <section className="jd-panel"><h2>Experience & requirements</h2><div className="jd-requirements"><div><small>Experience needed</small><strong>{job.e}+ years</strong><small>{levelFromExp(job.e)}</small></div><div><small>Salary offered</small><strong>₹{job.a}–{job.b} LPA</strong><small>{job.ty}</small></div></div><ul><li>{job.e === 0 ? "Open to early-career candidates." : `${job.e}+ years of relevant experience.`}</li><li>Hands-on knowledge of {job.sk.slice(0, 4).join(", ")}.</li><li>Clear communication and a collaborative approach.</li><li>Comfortable working in a {job.m.toLowerCase()} arrangement.</li></ul></section>
      <section className="jd-panel"><h2>Skills required</h2><div className="jd-tags">{job.sk.map(s => <span className={`jd-tag${userSkills.includes(s.toLowerCase()) ? " is-matched" : ""}`} key={s}>{s}</span>)}</div><h3>Good to have</h3><ul><li>Projects that demonstrate these skills in practice.</li><li>Relevant certifications and continuous learning.</li><li>Experience collaborating across teams.</li></ul></section>
      <section className="jd-panel"><h2>Perks & benefits</h2><p>Ask the recruiter about learning support, leave, insurance, and the benefits included with this role.</p></section>
      <section className="jd-panel"><h2>Hiring process</h2><div className="jd-process">{["Apply", "Profile review", "Skill round", "Interview", "Offer"].map(s => <span key={s}>{s}</span>)}</div><p>Indicative stages; confirm the process with the hiring team.</p></section>
      <section className="jd-panel"><h2>About {job.c}</h2>{COMPANY_BLURBS[job.c] ? COMPANY_BLURBS[job.c].map(p => <p key={p}>{p}</p>) : <p>Contact the hiring team to learn more about {job.c}, its culture, and this opportunity.</p>}</section>
      <section className="jd-similar"><h2>Similar jobs</h2><div className="jd-similar-grid">{similar.map(j => <Button variant="outline" className="jd-similar-job" key={j.id} onClick={() => onOpenJob(j.id)}><img src={getCompanyLogo(j.c)} alt="" /><span><strong>{j.t}</strong><small>{j.c} · {j.l}</small><small>{j.e}+ years · ₹{j.a}–{j.b} LPA</small></span></Button>)}</div></section>
    </div><aside className="jd-sidebar" aria-label="Application and profile match">
      <section className="jd-panel"><h2>{application ? "Application submitted" : "Interested in this job?"}</h2>{application ? <p role="status">Current status: <strong>{application.st}</strong></p> : <><p>Be part of the team at {job.c}.</p><label htmlFor="job-cover-note">Cover note (optional)</label><Textarea id="job-cover-note" value={note} onChange={e => setNote(e.target.value)} placeholder="Why are you a great fit?" /></>}<div className="jd-buttons mt-3">{applyButton}{saveButton}</div></section>
      <section className="jd-panel"><div className="jd-personal-match"><MatchRing percent={score} size={48} /><strong>Your match</strong></div><p>{missing.length ? `Skills to add: ${missing.join(", ")}.` : "Your profile includes all the required skills."}</p><p className="mt-2">{job.sk.length - missing.length} of {job.sk.length} skills matched · {job.e}+ years needed</p></section>
      <section className="jd-panel"><div className="jd-personal-match"><MatchRing percent={fit.tot} size={42} /><strong>Overall fit for you</strong></div>{fit.rows.map(row => <div className="jd-fit-row" key={row.name}><span>{row.name}</span><progress className="jd-meter" value={row.score} max={100} aria-label={`${row.name}: ${row.score}%`} /><small>{row.note}</small></div>)}</section>
    </aside></div>
    <p className="jd-sample-note">Demo job listing. Role descriptions and hiring stages are illustrative; confirm details with the employer.</p>
  </div>;
}