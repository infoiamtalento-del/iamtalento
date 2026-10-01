import { ArrowRight, Clock, FileText, Crosshair, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const DreamCareerCTABanner = () => (
  <div className="container px-4 md:px-6 mt-6 mb-14">
    <div className="rounded-2xl bg-[#ED2938] text-white px-5 md:px-8 py-5 flex flex-col md:flex-row items-center gap-5">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="flex -space-x-3 shrink-0">
          <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face" alt="" className="w-10 h-10 rounded-full ring-2 ring-[#ED2938] object-cover" />
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" alt="" className="w-10 h-10 rounded-full ring-2 ring-[#ED2938] object-cover" />
          <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" alt="" className="w-10 h-10 rounded-full ring-2 ring-[#ED2938] object-cover" />
        </div>
        <div>
          <p className="text-[15px] md:text-[17px] font-bold leading-tight">Your Dream Career Is Closer Than You Think!</p>
          <p className="text-[12px] md:text-[13px] text-white/85 mt-0.5">Take the assessment. Get verified. Get hired faster.</p>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-5">
        {[
          { icon: Clock, title: "10–15 Mins", sub: "Assessment" },
          { icon: FileText, title: "Detailed", sub: "Personal Report" },
          { icon: Crosshair, title: "Personalized", sub: "Career Roadmap" },
        ].map(({ icon: I, title, sub }) => (
          <div key={title} className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
              <I className="h-4 w-4 text-white" />
            </div>
            <div className="leading-tight">
              <p className="text-[12px] font-bold">{title}</p>
              <p className="text-[11px] text-white/80">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center md:items-end gap-1.5 shrink-0">
        <button className="inline-flex items-center gap-2 bg-white text-[#ED2938] font-bold text-[14px] px-5 py-2.5 rounded-full hover:bg-slate-100 transition-colors">
          Take Assessment Now <ArrowRight className="h-4 w-4" />
        </button>
        <p className="text-[11px] text-white/80 inline-flex items-center gap-1">
          <ShieldCheck className="h-3 w-3" /> Trusted by 18,731+ professionals
        </p>
      </div>
    </div>
  </div>
);

export default DreamCareerCTABanner;
