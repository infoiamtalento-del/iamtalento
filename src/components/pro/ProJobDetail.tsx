import { useState } from "react";
import { ArrowLeft, Bookmark, Check, Briefcase, Wallet, MapPin, Building2, Clock, CalendarDays, Star, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ProJob, ProUser, ProApplication, calcScore, fitAnalysis, COMPANY_INFO, levelFromExp, timeAgo } from "@/data/proData";
import { companyBlurb } from "@/data/proJobMeta";
import { getCompanyLogo } from "@/data/portalAssets";
import { MatchRing } from "./ProMatchRing";
import "./pro-job-detail.css";

interface Props { job:ProJob; jobs:ProJob[]; user:ProUser; applications:ProApplication[]; onBack:()=>void; onOpen:(id:number)=>void; onApply:(id:number,note?:string)=>void; onSave:(id:number)=>void; }
export function ProJobDetail({job,jobs,user,applications,onBack,onOpen,onApply,onSave}:Props) {
  const [note,setNote]=useState("");
  const [logoFailed,setLogoFailed]=useState(false);
  const app=applications.find(a=>a.jid===job.id && a.who===user.email);
  const saved=(user.saved||[]).includes(job.id);
  const skills=(user.sk||[]).map(s=>s.toLowerCase());
  const matched=job.sk.filter(s=>skills.includes(s.toLowerCase()));
  const score=calcScore(job,user);
  const fit=fitAnalysis(job,user);
  const [industry,size]=COMPANY_INFO[job.c]||["Technology","Growing"];
  const blurbs=companyBlurb(job.c,industry,size);
  const similar=jobs.filter(j=>j.id!==job.id).sort((a,b)=>b.sk.filter(s=>job.sk.includes(s)).length-a.sk.filter(s=>job.sk.includes(s)).length).slice(0,4);
  const saveButton=<Button variant="outline" aria-pressed={saved} onClick={()=>onSave(job.id)}>{saved?<Check size={14}/>:<Bookmark size={14}/>} {saved?"Saved":"Save"}</Button>;
  const applyButton=<Button disabled={Boolean(app)} onClick={()=>onApply(job.id,note)}>{app?<Check size={14}/>:<Send size={14}/>} {app?"Applied":"Apply now"}</Button>;
  const snapshot=[{icon:Briefcase,label:"Experience",value:`${job.e}+ years`},{icon:Wallet,label:"Salary",value:`₹${job.a}–${job.b} LPA`},{icon:MapPin,label:"Location",value:job.l},{icon:Building2,label:"Work mode",value:job.m==="Onsite"?"In Office":job.m},{icon:Clock,label:"Job type",value:job.ty},{icon:CalendarDays,label:"Posted",value:timeAgo(job.at)}];
  return <div className="pro-job-detail">
    <div className="jd-toolbar"><Button variant="ghost" onClick={onBack}><ArrowLeft size={14}/>Back to jobs</Button><p>Jobs / {job.c} / {job.t}</p><div className="jd-toolbar-actions">{saveButton}{applyButton}</div></div>
    <section className="jd-panel jd-hero" aria-label="Job overview"><div className="jd-identity"><div className="pj-logo">{logoFailed?<Building2/>:<img src={getCompanyLogo(job.c)} alt={`${job.c} logo`} onError={()=>setLogoFailed(true)}/>}</div><div><h1>{job.t}</h1><p className="jd-company">{job.c}</p><div className="jd-meta"><span><Star/> {(4+(job.id%6)*.1).toFixed(1)} · {80+(job.id*23)%250} reviews</span><span><MapPin/>{job.l}</span><span><Briefcase/>{job.e}+ years</span><span><CalendarDays/>Posted {timeAgo(job.at)}</span></div><div className="jd-tags"><span>{job.m}</span><span>{job.ty}</span><span>{levelFromExp(job.e)} level</span></div></div><div className="jd-match"><small>AI MATCH</small><MatchRing percent={score} size={54}/></div></div><div className="jd-snapshot">{snapshot.map(({icon:Icon,label,value})=><div key={label}><Icon/><div><small>{label}</small><strong>{value}</strong></div></div>)}</div></section>
    <div className="jd-body"><div className="jd-sections">
      <section className="jd-panel"><h2>About the role</h2><p>{job.c} is hiring a {job.t} to join its {job.m.toLowerCase()} team. Work with cross-functional colleagues, own meaningful deliverables, and use {job.sk.join(", ")} to build reliable solutions.</p></section>
      <section className="jd-panel"><h2>Key responsibilities</h2><ul><li>Own role-specific projects from planning through delivery.</li><li>Apply your knowledge of {job.sk.join(", ")} to day-to-day work.</li><li>Collaborate with your team to translate requirements into clear execution plans.</li><li>Review work, share feedback, and maintain quality standards.</li><li>Track results and suggest improvements to team processes.</li></ul></section>
      <section className="jd-panel"><h2>Experience & requirements</h2><div className="jd-summary"><div><small>Experience needed</small><strong>{job.e===0?"Freshers welcome":`${job.e}+ years`}</strong><small>{levelFromExp(job.e)} level</small></div><div><small>Salary offered</small><strong>₹{job.a}–{job.b} LPA</strong><small>{job.ty}</small></div></div><ul><li>{job.e===0?"Foundational knowledge and a willingness to learn.":`${job.e}+ years of relevant experience.`}</li><li>Hands-on understanding of {job.sk.join(", ")}.</li><li>Clear communication and a collaborative approach to work.</li><li>Comfortable working in a {job.m.toLowerCase()} environment.</li></ul></section>
      <section className="jd-panel"><h2>Skills required</h2><div className="jd-tags">{job.sk.map(s=><span key={s} data-matched={skills.includes(s.toLowerCase())}>{skills.includes(s.toLowerCase())&&<Check size={11}/>} {s}</span>)}</div><h3>Good to have</h3><ul><li>Relevant projects demonstrating your skills.</li><li>Experience collaborating across teams.</li><li>Curiosity, ownership, and continuous learning.</li></ul></section>
      <section className="jd-panel"><h2>Perks & benefits</h2><p>Benefits for this opening have not been specified. Ask the hiring team about learning support, leave, insurance, and flexible working arrangements.</p></section>
      <section className="jd-panel"><h2>Hiring process</h2><div className="jd-process">{["Apply","Profile review","Skill round","Interview","Offer"].map(s=><div key={s}><span/>{s}</div>)}</div><p>The hiring team will confirm the interview stages for this role.</p></section>
      <section className="jd-panel"><h2>About {job.c}</h2><p>{blurbs[0]}</p><p>{blurbs[1]}</p><div className="jd-tags"><span>{industry}</span><span>{size} company</span></div></section>
      <section><h2 className="mb-3 text-sm font-semibold">Similar jobs</h2><div className="jd-related">{similar.map(j=><Button variant="ghost" key={j.id} onClick={()=>onOpen(j.id)}><img src={getCompanyLogo(j.c)} alt=""/><span><strong>{j.t}</strong><small>{j.c} · {j.l}</small><small>{j.e}+ years · ₹{j.a}–{j.b} LPA</small></span></Button>)}</div></section>
    </div><aside className="jd-sidebar">
      <section className="jd-panel"><h2>{app?"Application submitted":"Interested in this job?"}</h2><p>{app?`Current status: ${app.st}`:"Be one of the first to apply."}</p>{!app&&<><label htmlFor="jd-cover-note">Cover note (optional)</label><Textarea id="jd-cover-note" placeholder="Why are you a great fit?" value={note} onChange={e=>setNote(e.target.value)}/></>}<div className="jd-apply-actions">{applyButton}{saveButton}</div></section>
      <section className="jd-panel jd-fit-panel"><div className="jd-fit-title"><MatchRing percent={score} size={48}/><h2>Your match</h2></div><p>Skills to add: {job.sk.filter(s=>!skills.includes(s.toLowerCase())).join(", ")||"You have all required skills."}</p><div className="jd-tags"><span data-matched="true"><Check size={11}/>{matched.length} of {job.sk.length} skills</span><span>{job.e}+ years needed</span></div></section>
      <section className="jd-panel jd-fit-panel"><div className="jd-fit-title"><MatchRing percent={fit.tot} size={40}/><h2>Overall fit for you</h2></div>{fit.rows.map(r=><div className="jd-fit-row" key={r.name}><span>{r.name}</span><progress max={100} value={r.score} aria-label={`${r.name} fit`}/><small>{r.note}</small></div>)}</section>
    </aside></div>
  </div>;
}