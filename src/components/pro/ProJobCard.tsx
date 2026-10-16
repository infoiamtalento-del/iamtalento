import { useState } from "react";
import { Atom, Hexagon, Database, GitBranch, BadgeCheck, Award, BarChart3, Bookmark, BookmarkCheck, Briefcase, Building2, CalendarDays, Check, Clock, Code, Coins, FileText, MapPin, Megaphone, Palette, ArrowRightLeft, Search, Send, Sparkles, Star, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProJob, timeAgo } from "@/data/proData";
import { getCompanyLogo } from "@/data/portalAssets";
import { MatchRing } from "./ProMatchRing";
import "./pro-job-card.css";

function skillIcon(skill: string) {
  const s = skill.toLowerCase();
  if (/react/.test(s)) return Atom;
  if (/node/.test(s)) return Hexagon;
  if (/mongo/.test(s)) return Database;
  if (/^git$/.test(s)) return GitBranch;
  if (/seo|search|audit/.test(s)) return Search;
  if (/analytic|data|metric|sql/.test(s)) return BarChart3;
  if (/google/.test(s)) return Sparkles;
  if (/social|market|brand|campaign|ads/.test(s)) return Megaphone;
  if (/content|write|copy|blog|doc/.test(s)) return FileText;
  if (/web|code|react|node|python|java|html|css|develop/.test(s)) return Code;
  if (/design|ui|ux|figma|creative/.test(s)) return Palette;
  return Award;
}

interface Props {
  job: ProJob; percent: number; applied: boolean; saved: boolean; comparing: boolean;
  rating: { r: number; reviews: number };
  onOpen: () => void; onApply: () => void; onSave: () => void; onCompare: () => void;
}

export function ProJobCard({ job: j, percent, applied, saved, comparing, rating, onOpen, onApply, onSave, onCompare }: Props) {
  const [logoFailed, setLogoFailed] = useState(false);
  const details = [
    { icon: Briefcase, value: j.e === 0 ? "0 - 1 Yrs" : `${j.e} - ${j.e + (j.e >= 5 ? 4 : 3)} Yrs`, label: "Experience" },
    { icon: Coins, value: `${j.a} - ${j.b} Lacs PA`, label: "Expected Salary" },
    { icon: MapPin, value: j.l, label: "Location" },
    { icon: Building2, value: j.m === "Onsite" ? "In Office" : j.m, label: "Work Mode" },
    { icon: Clock, value: j.ty === "Full-time" ? "Full Time" : j.ty, label: "Job Type" },
    { icon: CalendarDays, value: timeAgo(j.at), label: "Posted" },
  ];
  return <div className="pro-job-card-container"><article className="pro-job-card cursor-pointer" aria-label={`${j.t} at ${j.c}`} onClick={(event) => { if (!(event.target instanceof Element) || event.target.closest("button, a")) return; onOpen(); }}>
    <div className="pj-header">
      <div className="pj-logo">{logoFailed ? <Building2 className="text-primary" aria-label={j.c} /> : <img src={getCompanyLogo(j.c)} alt={`${j.c} logo`} onError={() => setLogoFailed(true)} />}</div>
      <div><h3><Button variant="ghost" className="pj-title" onClick={onOpen}>{j.t}</Button></h3>
        <p className="pj-company">{j.c}</p>
        <div className="pj-rating"><Star /><strong>{rating.r}</strong><span>·</span><span>({rating.reviews} Reviews)</span></div>
      </div>
      <div className="pj-match"><span>AI MATCH</span><MatchRing percent={percent} size={54} /></div>
    </div>
    <div className="pj-details">{details.map(({ icon: Icon, value, label }) => <div className="pj-detail" key={label}><span className="pj-detail-icon"><Icon /></span><div><strong>{value}</strong><small>{label}</small></div></div>)}</div>
    <div className="pj-skills"><h4><BadgeCheck />Skills</h4><div className="pj-skill-list">{j.sk.slice(0, 8).map(s => { const Icon = skillIcon(s); return <span className="pj-skill" key={s}><Icon /><span>{s}</span></span>; })}{j.sk.length > 8 && <span className="pj-skill"><Users /><span>+{j.sk.length - 8} more</span></span>}</div></div>
    {!applied && (
      <div className="pj-actions">
        <Button onClick={onApply}><Send /><span>Apply Now</span><ArrowRight /></Button>
        <Button variant="outline" aria-pressed={saved} onClick={onSave}>{saved ? <BookmarkCheck /> : <Bookmark />}<span>{saved ? "Saved" : "Save for Later"}</span></Button>
        <Button variant="outline" aria-pressed={comparing} onClick={onCompare}><ArrowRightLeft /><span>Compare</span></Button>
      </div>
    )}
  </article></div>;
}