import { useState } from "react";
import { ChevronDown, Clock } from "lucide-react";
import { MANDATORY_CORE_TESTS } from "@/data/mandatoryCoreTests";

export const MandatoryCoreTestsSection = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="yellow-graded-section rounded-2xl shadow-2xs overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/50 px-5 py-4">
        <div>
          <h3 className="font-display text-base md:text-lg font-bold text-slate-900">Mandatory Core Tests</h3>
          <p className="text-xs text-slate-500">Every candidate starts with these foundational rounds</p>
        </div>
        <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
          Included
        </span>
      </div>

      <ul className="divide-y divide-slate-100">
        {MANDATORY_CORE_TESTS.map((test, index) => {
          const isExpanded = expandedId === test.id;

          return (
            <li key={test.id}>
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : test.id)}
                aria-expanded={isExpanded}
                className="group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50/60 cursor-pointer"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0d5cb2]/10 border border-[#0d5cb2]/20 font-display text-sm font-bold text-[#0d5cb2] transition-colors group-hover:bg-[#0d5cb2] group-hover:text-white">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display font-bold leading-tight text-slate-900 group-hover:text-[#0d5cb2] transition-colors">
                    {test.name}
                  </span>
                  <span className="block truncate text-xs sm:text-sm text-slate-500 mt-0.5">{test.summary}</span>
                </span>
                <span className="hidden shrink-0 items-center gap-1.5 text-xs text-slate-500 sm:inline-flex bg-slate-100/80 px-2.5 py-1 rounded-md">
                  <Clock className="h-3.5 w-3.5 text-[#0d5cb2]" /> {test.duration}
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-slate-400 group-hover:text-[#0d5cb2] transition-transform duration-200 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-1 animate-fade-in bg-slate-50/30">
                  <p className="mb-3 text-xs text-slate-500 font-medium">
                    {test.format} · {test.questions} questions · {test.duration}
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {test.parts.map((part) => (
                      <li
                        key={part.num}
                        className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#0d5cb2]/10 border border-[#0d5cb2]/20 text-xs font-bold text-[#0d5cb2]">
                              {part.num}
                            </span>
                            <span className="text-[11px] font-medium text-slate-400">
                              {part.questions} Qs · {part.minutes} min
                            </span>
                          </div>
                          <span className="block text-sm font-semibold text-slate-900">{part.title}</span>
                          <span className="block text-xs leading-relaxed text-slate-500 mt-0.5">{part.text}</span>
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
