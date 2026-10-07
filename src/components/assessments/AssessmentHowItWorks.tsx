import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Clock,
  CreditCard,
  FileBarChart2,
  Fingerprint,
  ListChecks,
  Code2,
  Briefcase,
  Layers,
  Play,
  type LucideIcon,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import thumb from "@/assets/assessment-video-thumb.jpg";

/** Replace with the hosted "how it works" video when it is ready. */
const HOW_IT_WORKS_VIDEO = "https://www.w3schools.com/html/mov_bbb.mp4";

interface Step {
  icon: LucideIcon;
  title: string;
  text: string;
  meta: string;
}

const STEPS: Step[] = [
  { icon: CreditCard, title: "Pick sub-domains and pay", text: "Add the sub-domains you want to be tested on, then pay once for the whole journey.", meta: "2 min" },
  { icon: Fingerprint, title: "Device and identity check", text: "Verify your photo ID, camera, microphone and screen before you begin.", meta: "3 min" },
  { icon: Layers, title: "Three mandatory core tests", text: "Communication, aptitude and career orientation tests come first for every candidate.", meta: "20 min" },
  { icon: ListChecks, title: "Round 1: Knowledge", text: "Two MCQ tests on core concepts and applied scenarios.", meta: "30 min" },
  { icon: Code2, title: "Round 2: Technical", text: "Hands-on tasks and a case problem that test applied skill.", meta: "55 min" },
  { icon: Briefcase, title: "Round 3: Experience", text: "Workplace scenarios and situational judgement matched to your level.", meta: "40 min" },
  { icon: FileBarChart2, title: "Get your verified report", text: "Receive your Career Intelligence Report the same day and share it with employers.", meta: "Same day" },
];

interface Props {
  onStart: () => void;
}

const AssessmentHowItWorks = ({ onStart }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container">
        <div className="max-w-3xl mb-10">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-4">
            <ListChecks className="h-4 w-4" /> How it works
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold leading-[1.15] mb-4">
            Every Step Of Your
            <br className="hidden md:block" /> <span className="text-primary">Assessment Journey.</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            Seven clear steps from payment to a verified report, all in one proctored session.
          </p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-12">
          <ol className="relative">
            <span className="absolute left-[19px] top-5 bottom-5 w-px bg-border" aria-hidden="true" />
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative flex gap-4 pb-6 last:pb-0">
                <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background font-display text-sm font-bold text-primary">
                  {i + 1}
                </span>
                <div className="flex-1 rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary/40 hover:bg-accent/25">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <s.icon className="h-4 w-4" />
                      </span>
                      <p className="font-display text-base font-bold leading-tight">{s.title}</p>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                      <Clock className="h-3 w-3" /> {s.meta}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-[0_28px_60px_-40px_hsl(var(--foreground)/0.45)]">
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Play how it works video"
                className="group relative block w-full text-left"
              >
                <img
                  src={thumb}
                  alt="Candidate taking a proctored online assessment"
                  width={1280}
                  height={720}
                  loading="lazy"
                  className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-foreground/10" />
                <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-foreground">
                  Watch
                </span>
                <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-background text-primary shadow-xl transition-transform group-hover:scale-110">
                  <Play className="ml-1 h-7 w-7 fill-current" />
                </span>
                <span className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4 text-background">
                  <span className="font-display text-base font-bold">How the assessment works</span>
                  <span className="rounded bg-foreground/70 px-2 py-0.5 text-xs font-semibold">2:30</span>
                </span>
              </button>

              <div className="p-5">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  See the device check, the three rounds and your report in under three minutes.
                </p>
                <ul className="mt-4 grid grid-cols-2 gap-2 text-xs font-semibold">
                  {["Proctored session", "Verified result", "Same-day report", "Pay once"].map((x) => (
                    <li key={x} className="flex items-center gap-1.5">
                      <BadgeCheck className="h-3.5 w-3.5 text-primary" /> {x}
                    </li>
                  ))}
                </ul>
                <Button className="mt-5 w-full gap-2" onClick={onStart}>
                  Start Assessment <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl overflow-hidden border-0 bg-black p-0">
          <DialogTitle className="sr-only">How the assessment works</DialogTitle>
          {open && (
            <video src={HOW_IT_WORKS_VIDEO} poster={thumb} controls autoPlay className="aspect-video w-full bg-black" />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AssessmentHowItWorks;
