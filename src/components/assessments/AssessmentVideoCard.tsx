import { useState } from "react";
import { BadgeCheck, Play } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import thumb from "@/assets/assessment-video-thumb.jpg";

/** Replace with the hosted "how it works" video when it is ready. */
const HOW_IT_WORKS_VIDEO = "https://www.w3schools.com/html/mov_bbb.mp4";

const AssessmentVideoCard = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-border/80 bg-background shadow-[0_20px_50px_-30px_hsl(var(--foreground)/0.25)]">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Play how it works video"
          className="group relative block w-full text-left cursor-pointer"
        >
          <img
            src={thumb}
            alt="Candidate taking a proctored online assessment"
            width={1280}
            height={720}
            className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/20 to-foreground/5" />
          <span className="absolute left-4 top-4 rounded-full bg-background/90 backdrop-blur-md border border-border/40 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-foreground">
            Preview
          </span>
          <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-primary shadow-2xl transition-transform duration-200 group-hover:scale-110">
            <Play className="ml-1 h-6 w-6 fill-primary text-primary" />
          </span>
          <span className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4 text-background">
            <span className="font-display text-sm md:text-base font-bold text-white">How the assessment works</span>
            <span className="rounded-md bg-black/60 backdrop-blur-xs px-2 py-0.5 text-xs font-semibold text-white/90">2:30</span>
          </span>
        </button>

        <div className="p-5 md:p-6 bg-background">
          <p className="text-xs md:text-sm leading-relaxed text-muted-foreground">
            See the device check, the test flow across rounds, and the verified report in under three minutes.
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-2.5 text-xs font-medium text-foreground/90">
            {["Proctored session", "Verified CIR result", "Same-day report", "Pay once"].map((x) => (
              <li key={x} className="flex items-center gap-2">
                <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <BadgeCheck className="h-3.5 w-3.5" />
                </span>
                <span>{x}</span>
              </li>
            ))}
          </ul>
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
    </>
  );
};

export default AssessmentVideoCard;
