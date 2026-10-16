import { useState } from "react";
import { Brain, CheckCircle2, ChevronDown, Clock, FileText, MessageSquare, Sparkles } from "lucide-react";
import { MANDATORY_CORE_TESTS } from "@/data/mandatoryCoreTests";

const CORE_ICONS = [Brain, Sparkles, MessageSquare];

export const MandatoryCoreTestsSection = () => {
  const [expandedId, setExpandedId] = useState<string | null>(MANDATORY_CORE_TESTS[0]?.id ?? null);

  return (
    <div className="yellow-graded-section rounded-2xl shadow-md overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-300/80 bg-amber-50/70 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="yellow-graded-btn flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-display text-sm font-extrabold">
            <CheckCircle2 className="h-4.5 w-4.5 text-slate-950" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-base md:text-lg font-extrabold text-slate-900">
                Step 1 · Mandatory Core Tests (3 Foundation Rounds)
              </h3>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Every candidate completes these 3 foundational tests first — click any test below to inspect modules
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="yellow-graded-badge rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider">
            Worth ₹999 · ₹0 Included
          </span>
        </div>
      </div>

      <ul className="divide-y divide-amber-200/70">
        {MANDATORY_CORE_TESTS.map((test, index) => {
          const isExpanded = expandedId === test.id;
          const Icon = CORE_ICONS[index % CORE_ICONS.length];

          return (
            <li key={test.id} className="transition-colors">
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : test.id)}
                aria-expanded={isExpanded}
                className={`group flex w-full items-center gap-3.5 px-5 py-4 text-left transition-all cursor-pointer ${
                  isExpanded ? "bg-amber-50/50" : "hover:bg-amber-50/35"
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display text-sm font-extrabold transition-all ${
                    isExpanded
                      ? "yellow-graded-btn text-slate-950 scale-105"
                      : "bg-amber-100/80 border border-amber-300/90 text-amber-950 group-hover:bg-amber-200/80"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-sm sm:text-base font-extrabold leading-tight text-slate-900 group-hover:text-[#0d5cb2] transition-colors">
                      {index + 1}. {test.name}
                    </span>
                    <span className="rounded-md bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      FREE · Included
                    </span>
                  </span>
                  <span className="block truncate text-xs sm:text-sm text-slate-600 mt-0.5">
                    {test.summary}
                  </span>
                </span>

                <span className="hidden shrink-0 items-center gap-1.5 text-xs font-semibold text-slate-700 sm:inline-flex bg-white border border-amber-300/80 px-2.5 py-1 rounded-lg shadow-2xs">
                  <FileText className="h-3.5 w-3.5 text-[#0d5cb2]" /> {test.questions} Qs
                </span>

                <span className="hidden shrink-0 items-center gap-1.5 text-xs font-semibold text-amber-950 sm:inline-flex bg-amber-100/80 border border-amber-300/80 px-2.5 py-1 rounded-lg">
                  <Clock className="h-3.5 w-3.5 text-amber-700" /> {test.duration}
                </span>

                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-amber-300/80 bg-white text-slate-600 transition-transform duration-200 ${
                    isExpanded ? "rotate-180 bg-amber-100 text-slate-900" : ""
                  }`}
                >
                  <ChevronDown className="h-4 w-4" />
                </span>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-1 animate-fade-in bg-amber-50/25">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 font-semibold">
                    <span>
                      Format: <strong className="text-slate-900">{test.format}</strong> · {test.questions} questions · {test.duration}
                    </span>
                    <span className="text-amber-800 font-bold">
                      {test.parts.length} Assessed Modules
                    </span>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {test.parts.map((part) => (
                      <li
                        key={part.num}
                        className="yellow-graded-border flex flex-col justify-between rounded-xl p-3.5 shadow-2xs"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="yellow-graded-badge flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-extrabold">
                              {part.num}
                            </span>
                            <span className="text-[11px] font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                              {part.questions} Qs · {part.minutes}m
                            </span>
                          </div>
                          <span className="block font-display text-xs sm:text-sm font-bold text-slate-900">
                            {part.title}
                          </span>
                          <span className="block text-[11px] leading-relaxed text-slate-600 mt-1">
                            {part.text}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
