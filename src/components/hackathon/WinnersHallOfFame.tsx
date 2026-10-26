import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, BadgeCheck, Briefcase, Calendar, FolderGit2, MapPin, Newspaper, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import p1 from '@/assets/carousel-candidate1.jpg';
import p2 from '@/assets/demo-avatar.jpg';
import p3 from '@/assets/assessment-hero-person.jpg';
import p4 from '@/assets/webinar-hero-person.jpg';

type Winner = {
  name: string; photo: string; industry: string; hackathon: string; city: string; year: string;
  award: string; result: string; score?: number; skills: string[]; project: string; achievement: string;
  media: string; hiring: string;
};

// Sample profiles — placeholders until real, consented winner data is supplied.
const winners: Winner[] = [
  { name: 'Aarav Mehta', photo: p1, industry: 'AI & Data Science', hackathon: 'Code Arena · Season 3', city: 'Bengaluru', year: '2026', award: 'Champion', result: 'Rank 1 of 3,200 participants', score: 92, skills: ['Python', 'LLMs', 'MLOps'], project: 'CareerLens — AI resume-to-role matcher', achievement: 'Highest judge score in finals', media: 'Featured in The Economic Times', hiring: 'Offer accepted · FinTech startup' },
  { name: 'Ananya Iyer', photo: p2, industry: 'Finance & FinTech', hackathon: 'FinTech Sprint 2026', city: 'Mumbai', year: '2026', award: 'Runner-Up', result: 'Rank 2 of 1,850 participants', score: 88, skills: ['React', 'Node.js', 'Payments'], project: 'SplitSafe — UPI expense ledger', achievement: 'Best product design award', media: 'Success story on TalentCIR blog', hiring: '4 employers expressed interest' },
  { name: 'Rohan Kapoor', photo: p4, industry: 'Digital Marketing & Growth', hackathon: 'Growth Hack Delhi', city: 'Delhi', year: '2025', award: 'Champion', result: 'Rank 1 of 1,400 participants', skills: ['SEO', 'Analytics', 'Copywriting'], project: 'LaunchKit — D2C growth playbook', achievement: 'Top campaign ROI in live challenge', media: 'Interviewed by YourStory', hiring: 'Interviewing with 3 employers' },
  { name: 'Meera Nair', photo: p3, industry: 'Design & UX', hackathon: 'Design Dash Pune', city: 'Pune', year: '2025', award: 'Runner-Up', result: 'Rank 2 of 960 participants', score: 85, skills: ['Figma', 'UX Research', 'Prototyping'], project: 'CareConnect — clinic booking app', achievement: "People's choice award", media: 'Featured in Hall of Fame newsletter', hiring: 'Open to opportunities' },
];

const filterKeys = [
  { key: 'industry', label: 'Industry' }, { key: 'city', label: 'City' }, { key: 'year', label: 'Year' },
  { key: 'award', label: 'Award category' }, { key: 'skill', label: 'Skills' },
] as const;
type FilterKey = typeof filterKeys[number]['key'];

const options = (k: FilterKey) => Array.from(new Set(k === 'skill' ? winners.flatMap(w => w.skills) : winners.map(w => w[k]))).sort();

export default function WinnersHallOfFame({ ctaTo = '/auth?mode=signup' }: { ctaTo?: string }) {
  const empty = { industry: '', city: '', year: '', award: '', skill: '' };
  const [f, setF] = useState<Record<FilterKey, string>>(empty);
  const list = useMemo(() => winners.filter(w =>
    (!f.industry || w.industry === f.industry) && (!f.city || w.city === f.city) && (!f.year || w.year === f.year) &&
    (!f.award || w.award === f.award) && (!f.skill || w.skills.includes(f.skill))), [f]);
  const active = Object.values(f).some(Boolean);

  return (
    <div>
      <div className="ht2-dark mt-2 mb-10 grid gap-4 rounded-xl p-6 sm:grid-cols-2 lg:grid-cols-6">
        {filterKeys.map(({ key, label }) => (
          <label key={key} className="flex flex-col gap-1.5 text-[11px] font-semibold uppercase tracking-wider opacity-70">
            {label}
            <select value={f[key]} onChange={e => setF({ ...f, [key]: e.target.value })} aria-label={label}
              className="h-11 rounded-md border border-border/50 bg-card px-3 text-sm font-medium normal-case tracking-normal text-foreground">
              <option value="">All</option>
              {options(key).map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </label>
        ))}
        <Button variant="outline" className="self-end rounded-full" disabled={!active} onClick={() => setF(empty)}>
          <RotateCcw className="h-4 w-4" />Reset
        </Button>
      </div>

      <div className="space-y-6">
        {list.map(w => (
          <article key={w.name} className="ht2-surface grid overflow-hidden rounded-xl border border-border/60 shadow-sm md:grid-cols-[260px_1fr]">
            <div className="relative h-72 md:h-auto">
              <img src={w.photo} alt={`${w.name}, ${w.award}`} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
              <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary shadow-sm"><Award className="h-3.5 w-3.5" />{w.award}</span>
            </div>
            <div className="p-6 md:p-7">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-2xl font-bold">{w.name}</h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase text-primary"><BadgeCheck className="h-3 w-3" />Verified</span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-primary">{w.hackathon} · {w.industry}</p>
                  <p className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{w.city}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{w.year}</span>
                  </p>
                </div>
                <div className="ht2-tint rounded-md px-4 py-2 text-right">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Industry Readiness Score</p>
                  <p className="text-lg font-bold text-primary">{w.score ? `${w.score}/100` : 'Not assessed'}</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[['Verified result', w.result], ['Competition achievement', w.achievement], ['Media coverage', w.media], ['Hiring status', w.hiring]].map(([k, v], i) => (
                  <div key={k} className={`rounded-md p-3 ${i === 0 ? 'ht2-dark' : 'ht2-tint'}`}>
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${i === 0 ? 'opacity-70' : 'text-muted-foreground'}`}>{k}</p>
                    <p className="mt-1 text-sm font-semibold leading-snug">{v}</p>
                  </div>
                ))}
              </div>

              <div className="ht2-tint mt-3 flex items-center gap-3 rounded-md p-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground"><FolderGit2 className="h-4 w-4" /></span>
                <div><p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Project portfolio</p><p className="text-sm font-semibold">{w.project}</p></div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                <div className="flex flex-wrap gap-2">{w.skills.map(s => <span key={s} className="rounded-full border border-border px-3 py-1 text-xs font-medium">{s}</span>)}</div>
                <div className="flex gap-2 text-xs text-muted-foreground"><Newspaper className="h-4 w-4 text-primary" /><Briefcase className="h-4 w-4 text-primary" /></div>
              </div>
            </div>
          </article>
        ))}
        {list.length === 0 && (
          <div className="ht2-surface rounded-xl border border-border/60 p-10 text-center text-sm text-muted-foreground">
            No winners match these filters. <button className="font-semibold text-primary underline" onClick={() => setF(empty)}>Clear filters</button>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-center">
        <Button asChild variant="outline" className="rounded-full"><Link to={ctaTo}>View All Winners<ArrowRight className="h-4 w-4" /></Link></Button>
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">Readiness scores, media and hiring status are shown only where validated and authorised for publication.</p>
    </div>
  );
}
