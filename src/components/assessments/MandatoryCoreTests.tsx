import { useState } from "react";
import { CircleCheckBig, ChevronDown, Clock, ShieldCheck, ListChecks, Check } from "lucide-react";
import { MANDATORY_CORE_TESTS } from "@/data/mandatoryCoreTests";

export const MandatoryCoreTestsSection = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-background overflow-hidden shadow-xs">
      <div className="flex flex-col gap-2 border-b border-border/80 bg-muted/40 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="font-display text-lg font-bold text-foreground">Mandatory Core Tests</h3>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
              All 3 Required
            </span>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Included by default for every candidate · Evaluates baseline career readiness
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-foreground">
            <Check className="h-3.5 w-3.5 text-primary" /> 3 tests included
          </span>
        </div>
      </div>

      <div className="grid divide-y md:divide-y-0 md:divide-x divide-border/80 md:grid-cols-3">
        {MANDATORY_CORE_TESTS.map((test) => {
          const Icon = test.icon;
          const isExpanded = expandedId === test.id;

          return (
            <div key={test.id} className="flex flex-col justify-between p-6 bg-background hover:bg-muted/20 transition-colors">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h4 className="font-display text-base font-bold leading-tight">{test.name}</h4>
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                        <Clock className="h-3 w-3" /> {test.duration} · {test.questions} Qs
                      </span>
                    </div>
                  </div>
                  <span
                    title="Included and mandatory"
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5"
                  >
                    <Check className="h-3 w-3 stroke-[2.5]" />
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed mt-2">{test.summary}</p>

                {/* Quick snapshot tags */}
                <div className="flex flex-wrap gap-1.5 mt-3.5">
                  {test.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-secondary text-muted-foreground border border-border/50"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-border/60 flex items-center justify-between">
                <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Proctored
                </span>
                <button
                  type="button"
                  onClick={() => toggle(test.id)}
                  aria-expanded={isExpanded}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer"
                >
                  {isExpanded ? "Hide" : "View"} breakdown
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Breakdown Drawer for the selected core test */}
      {expandedId && (() => {
        const activeTest = MANDATORY_CORE_TESTS.find((t) => t.id === expandedId);
        if (!activeTest) return null;

        return (
          <div className="border-t border-border/80 bg-muted/30 p-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Test Breakdown</span>
                <h4 className="font-display text-lg font-bold text-foreground mt-0.5">
                  {activeTest.name} · Structure &amp; Curriculum
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Format: {activeTest.format} · Total {activeTest.questions} questions across {activeTest.duration}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setExpandedId(null)}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground self-start sm:self-auto cursor-pointer"
              >
                Close breakdown
              </button>
            </div>

            <div className="grid gap-3.5 md:grid-cols-2 mb-4">
              {activeTest.parts.map((part) => {
                return (
                  <div key={part.num} className="rounded-xl border border-border/80 bg-background p-4 shadow-xs">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-secondary text-foreground text-xs font-bold">
                          {part.num}
                        </span>
                        <h5 className="font-display text-sm font-bold">{part.title}</h5>
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border border-border/70 bg-secondary/80 text-foreground/80">
                        {part.kind}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1.5">{part.text}</p>
                    <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1 font-medium">
                        <ListChecks className="h-3.5 w-3.5 text-primary" /> {part.questions} questions
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="h-3.5 w-3.5 text-primary" /> {part.minutes} minutes
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Competency tags */}
            <div className="rounded-lg border border-border/70 bg-background/80 p-3.5 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-foreground text-xs shrink-0">Evaluated Competencies:</span>
              {activeTest.skills.map((s) => (
                <span key={s} className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {s}
                </span>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
};
