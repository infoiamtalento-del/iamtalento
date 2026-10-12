import { Briefcase } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";
import {
  DIGITAL_MARKETING_EXPERTS,
  HR_DIGITAL_MARKETING_EXPERTS,
  type AssessmentExpert,
} from "@/data/assessmentExperts";

const ExpertCard = ({ e }: { e: AssessmentExpert }) => (
  <article className="flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-md">
    <div>
      {/* Profile Header with Company Logos on top */}
      <div className="flex items-start gap-4">
        <img
          src={e.photo}
          alt={e.name}
          width={112}
          height={112}
          loading="lazy"
          className="h-24 w-24 sm:h-28 sm:w-28 shrink-0 rounded-2xl border border-border/80 object-cover shadow-xs"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-1.5">
            <div className="min-w-0">
              <h4 className="font-display text-base sm:text-[17px] font-bold leading-tight text-foreground truncate">{e.name}</h4>
              <p className="mt-1 text-xs text-muted-foreground truncate">{e.title}</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground shrink-0">
              <Briefcase className="h-3 w-3" /> {e.experience}
            </span>
          </div>

          {/* Company logos on top next to profile */}
          <div className="mt-3 flex items-center gap-1.5 flex-wrap">
            {e.history.map((h) => (
              <span key={h.company} title={`${h.role} · ${h.company} (${h.years})`} className="inline-flex">
                <BrandLogo name={h.company} variant="badge" />
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-3.5 text-xs leading-relaxed text-muted-foreground">{e.bio}</p>
    </div>

    <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-border/60">
      {e.specialisation.map((s) => (
        <span key={s} className="rounded-md bg-secondary/80 border border-border/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
          {s}
        </span>
      ))}
    </div>
  </article>
);

const Group = ({ label, text, experts }: { label: string; text: string; experts: AssessmentExpert[] }) => (
  <div>
    <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
      <div>
        <h3 className="font-display text-lg md:text-xl font-bold text-foreground">{label}</h3>
        <p className="text-xs md:text-sm text-muted-foreground mt-0.5">{text}</p>
      </div>
      <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-foreground">
        {experts.length} reviewers
      </span>
    </div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
