import { useState } from "react";
import { ChevronDown, Clock } from "lucide-react";
import { MANDATORY_CORE_TESTS } from "@/data/mandatoryCoreTests";

export const MandatoryCoreTestsSection = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-border bg-background overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
        <h3 className="font-display text-lg font-bold text-foreground">Core tests</h3>
        <span className="rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-foreground">
          Included
        </span>
      </div>

      <ul className="divide-y divide-border">
        {MANDATORY_CORE_TESTS.map((test, index) => {
          const isExpanded = expandedId === test.id;

          return (
            <li key={test.id}>
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : test.id)}
                aria-expanded={isExpanded}
                className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/30 cursor-pointer"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-display text-sm font-bold text-primary">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display font-bold leading-tight text-foreground">{test.name}</span>
                  <span className="block truncate text-sm text-muted-foreground">{test.summary}</span>
                </span>
                <span className="hidden shrink-0 items-center gap-1 text-xs text-muted-foreground sm:inline-flex">
                  <Clock className="h-3.5 w-3.5 text-primary" /> {test.duration}
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-primary transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                />
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-1 animate-fade-in">
                  <p className="mb-3 text-xs text-muted-foreground">
                    {test.format} · {test.questions} questions · {test.duration}
                  </p>
                  <ul className="space-y-2">
                    {test.parts.map((part) => (
                      <li
                        key={part.num}
                        className="flex items-start gap-3 rounded-xl border border-border bg-background p-3"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                          {part.num}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-foreground">{part.title}</span>
                          <span className="block text-xs leading-relaxed text-muted-foreground">{part.text}</span>
                        </span>
                        <span className="shrink-0 text-[11px] text-muted-foreground">
                          {part.questions} Qs · {part.minutes} min
                        </span>
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
