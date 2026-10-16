import { useState } from "react";
import { Play } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import thumb from "@/assets/assessment-video-thumb.jpg";

/** Replace with the hosted "how it works" video when it is ready. */
const HOW_IT_WORKS_VIDEO = "https://www.w3schools.com/html/mov_bbb.mp4";

const AssessmentVideoCard = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-background shadow-[0_20px_50px_-30px_rgba(0,0,0,0.15)] ring-1 ring-slate-900/5">
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
          <span className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-slate-950/5" />
          <span className="absolute left-4 top-4 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/60 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-900 shadow-xs">
            Preview
          </span>
          <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#002C66] shadow-2xl transition-transform duration-200 group-hover:scale-110">
            <Play className="ml-1 h-6 w-6 fill-[#002C66] text-[#002C66]" />
          </span>
          <span className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4 text-white">
            <span className="font-display text-sm md:text-base font-bold text-white drop-shadow-xs">How the assessment works</span>
            <span className="rounded-md bg-black/60 backdrop-blur-xs px-2 py-0.5 text-xs font-semibold text-white/95">2:30</span>
          </span>
        </button>
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
