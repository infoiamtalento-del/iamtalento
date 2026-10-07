import { BadgeCheck, Briefcase } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";
import {
  DIGITAL_MARKETING_EXPERTS,
  HR_DIGITAL_MARKETING_EXPERTS,
  type AssessmentExpert,
} from "@/data/assessmentExperts";

const ExpertCard = ({ e }: { e: AssessmentExpert }) => (
  <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_22px_45px_-30px_hsl(var(--foreground)/0.45)]">
    <div className="flex gap-4 p-5">
      <div className="relative shrink-0">
        <img
          src={e.photo}
          alt={e.name}
          width={80}
          height={80}
          loading="lazy"
          className="h-20 w-20 rounded-xl border border-border object-cover"
        />
        <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <BadgeCheck className="h-3 w-3" />
        </span>
      </div>
      <div className="min-w-0">
        <h4 className="font-display text-base font-bold leading-tight">{e.name}</h4>
        <p className="mt-0.5 text-sm text-muted-foreground">{e.title}</p>
        <div className="mt-2 flex items-center gap-2">
          <BrandLogo name={e.company} size="sm" />
          <span className="text-sm font-semibold">{e.company}</span>
        </div>
        <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
          <Briefcase className="h-3 w-3" /> {e.experience}
        </span>
      </div>
    </div>

    <p className="px-5 text-xs leading-relaxed text-muted-foreground">{e.bio}</p>

    <div className="mt-4 flex flex-wrap gap-1.5 px-5">
      {e.specialisation.map((s) => (
        <span key={s} className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
          {s}
        </span>
      ))}
    </div>

    <div className="mt-4 px-5">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tools</p>
      <div className="flex flex-wrap gap-2">
        {e.tools.map((t) => (
          <BrandLogo key={t} name={t} size="xs" label className="rounded-full border border-border px-2 py-1 [&>span:first-child]:border-0" />
        ))}
      </div>
    </div>

    <div className="mt-4 flex-1 border-t border-border bg-secondary/30 px-5 py-4">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Career</p>
      <ol className="space-y-2.5">
        {e.history.map((h) => (
          <li key={h.company + h.years} className="flex items-center gap-3">
            <BrandLogo name={h.company} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold leading-tight">{h.role}</p>
              <p className="truncate text-[11px] text-muted-foreground">
                {h.company} · {h.years}
              </p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-primary">
        <BadgeCheck className="h-3.5 w-3.5" /> {e.tests}
      </p>
    </div>
  </article>
);

const Group = ({ label, text, experts }: { label: string; text: string; experts: AssessmentExpert[] }) => (
  <div>
    <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
      <div>
        <h3 className="font-display text-xl font-bold">{label}</h3>
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
      <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary">
        {experts.length} reviewers
      </span>
    </div>
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {experts.map((e) => (
        <ExpertCard key={e.name} e={e} />
      ))}
    </div>
  </div>
);

const MarketingExperts = () => (
  <div className="space-y-12">
    <Group
      label="Digital marketing experts"
      text="Practitioners who write and score every question."
      experts={DIGITAL_MARKETING_EXPERTS}
    />
    <Group
      label="HR specialists in digital marketing"
      text="Hiring leaders who check that each test reflects real marketing roles."
      experts={HR_DIGITAL_MARKETING_EXPERTS}
    />
  </div>
);

export default MarketingExperts;
