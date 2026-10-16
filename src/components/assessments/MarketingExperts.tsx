import { Award, Briefcase, CheckCircle2, Sparkles } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";
import {
  DIGITAL_MARKETING_EXPERTS,
  HR_DIGITAL_MARKETING_EXPERTS,
  type AssessmentExpert,
} from "@/data/assessmentExperts";

/* ---- Section 1: Question Authors & Technical Leads (Navy / Slate) ---- */
const PractitionerCard = ({ e }: { e: AssessmentExpert }) => (
  <article className="flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-[#002C66] hover:shadow-md shadow-2xs">
    <div>
      {/* Profile Header */}
      <div className="flex items-start gap-3.5">
        <img
          src={e.photo}
          alt={e.name}
          width={112}
          height={112}
          loading="lazy"
          className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-2xl border border-slate-200 object-cover shadow-2xs"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-1.5">
            <div className="min-w-0">
              <h4 className="font-display text-base font-bold leading-tight text-slate-900 truncate">
                {e.name}
              </h4>
              <p className="mt-0.5 text-xs text-slate-500 truncate">{e.title}</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#002C66]/10 border border-[#002C66]/20 px-2 py-0.5 text-[10px] font-bold text-[#002C66] shrink-0">
              <Briefcase className="h-3 w-3" /> {e.experience}
            </span>
          </div>

          {/* Company logos on top */}
          <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
            {e.history.map((h) => (
              <span key={h.company} title={`${h.role} · ${h.company} (${h.years})`} className="inline-flex">
                <BrandLogo name={h.company} variant="badge" />
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-slate-600">{e.bio}</p>

      {/* Question Authoring Contribution Tag */}
      {e.tests && (
        <div className="mt-3 rounded-lg bg-[#002C66]/5 border border-[#002C66]/20 px-2.5 py-1.5 text-[11px] text-[#002C66] font-medium flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-[#002C66] shrink-0" />
          <span className="truncate">{e.tests}</span>
        </div>
      )}
    </div>

    {/* Specialisation pills */}
    <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
      {e.specialisation.map((s) => (
        <span
          key={s}
          className="rounded-md bg-slate-100 border border-slate-200/60 px-2 py-0.5 text-[10px] font-medium text-slate-600"
        >
          {s}
        </span>
      ))}
    </div>
  </article>
);

/* ---- Section 2: HR Specialists & Hiring Decision Makers (Golden Yellow / Amber Panel) ---- */
const HRExpertCard = ({ e }: { e: AssessmentExpert }) => (
  <article className="flex h-full flex-col justify-between overflow-hidden rounded-2xl border-2 border-amber-200/90 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-lg shadow-2xs">
    <div>
      {/* Profile Header with Golden Star */}
      <div className="flex items-start gap-3.5">
        <div className="relative shrink-0">
          <img
            src={e.photo}
            alt={e.name}
            width={112}
            height={112}
            loading="lazy"
            className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl border-2 border-amber-300 object-cover shadow-xs"
          />
          <span className="absolute -bottom-1.5 -right-1.5 h-6 w-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] font-black shadow-xs border-2 border-white">
            ★
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-1.5">
            <div className="min-w-0">
              <h4 className="font-display text-base font-bold leading-tight text-slate-900 truncate">
                {e.name}
              </h4>
              <p className="mt-0.5 text-xs text-amber-900/80 font-medium truncate">{e.title}</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-300 px-2 py-0.5 text-[10px] font-bold text-amber-950 shrink-0">
              <Briefcase className="h-3 w-3 text-amber-800" /> {e.experience}
            </span>
          </div>

          {/* Company logos on top */}
          <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
            {e.history.map((h) => (
              <span key={h.company} title={`${h.role} · ${h.company} (${h.years})`} className="inline-flex">
                <BrandLogo name={h.company} variant="badge" />
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-slate-600">{e.bio}</p>

      {/* Hiring Relevance Validation Box - Warm Golden Yellow */}
      {e.tests && (
        <div className="mt-3.5 rounded-xl bg-amber-50 border border-amber-200/90 p-2.5 flex items-start gap-2 text-xs text-amber-950">
          <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <span className="block text-[10px] font-extrabold uppercase tracking-wider text-amber-800">
              Hiring Benchmark
            </span>
            <span className="text-[11px] font-medium leading-tight text-amber-950 block mt-0.5">
              {e.tests}
            </span>
          </div>
        </div>
      )}
    </div>

    {/* Specialisation pills with warm amber touches */}
    <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-amber-100">
      {e.specialisation.map((s) => (
        <span
          key={s}
          className="rounded-md bg-amber-50 border border-amber-200/70 px-2 py-0.5 text-[10px] font-semibold text-amber-900"
        >
          {s}
        </span>
      ))}
    </div>
  </article>
);

const MarketingExperts = () => (
  <div className="space-y-12">
    {/* Section 1: Digital Marketing Experts (Question Authors & Technical Leads) */}
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#002C66]/10 border border-[#002C66]/20 px-2.5 py-0.5 text-[11px] font-bold text-[#002C66]">
              <Sparkles className="h-3 w-3" /> Question Authors & Practitioners
            </span>
          </div>
          <h3 className="font-display text-xl md:text-2xl font-bold text-slate-900">
            Digital Marketing Experts
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Hands-on growth leaders and specialists from Swiggy, HubSpot, Cred & Nykaa who write, test, and calibrate each practical challenge.
          </p>
        </div>
        <span className="rounded-full bg-slate-100 border border-slate-200 px-3.5 py-1 text-xs font-bold text-slate-700 shrink-0">
          6 Question Designers
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DIGITAL_MARKETING_EXPERTS.map((e) => (
          <PractitionerCard key={e.name} e={e} />
        ))}
      </div>
    </div>

    {/* Section 2: HR Specialists in Digital Marketing (Golden Yellow / Amber Panel) */}
    <div className="relative rounded-3xl border-2 border-amber-300/80 bg-[#fffdf0] p-6 sm:p-8 md:p-9 shadow-xs overflow-hidden">
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-400" />

      <div className="mb-7 flex flex-wrap items-end justify-between gap-3 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 text-slate-950 px-3 py-1 text-xs font-black uppercase tracking-wider shadow-2xs">
              <Award className="h-3.5 w-3.5 text-slate-950 fill-slate-950" /> Talent & Hiring Advisory Board
            </span>
          </div>
          <h3 className="font-display text-xl md:text-2xl font-bold text-slate-900">
            HR Specialists in Digital Marketing
          </h3>
          <p className="text-xs sm:text-sm text-amber-950/80 mt-1 max-w-2xl leading-relaxed">
            Talent Acquisition Heads and HR Business Partners from Zerodha, Flipkart, Accenture & Razorpay who verify that every test matches actual job descriptions, interview scorecards, and hiring bars.
          </p>
        </div>

        <span className="rounded-full bg-white border border-amber-300 text-amber-950 font-bold px-3.5 py-1 text-xs shadow-2xs shrink-0">
          6 Hiring Decision Makers
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 relative z-10">
        {HR_DIGITAL_MARKETING_EXPERTS.map((e) => (
          <HRExpertCard key={e.name} e={e} />
        ))}
      </div>
    </div>
  </div>
);

export default MarketingExperts;
