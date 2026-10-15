import React from "react";
import { Laptop, Sparkles, Award, BarChart3, CheckCircle2, TrendingUp, Play } from "lucide-react";

interface AssessmentHeroVisualProps {
  onPlayPreview?: () => void;
}

export const AssessmentHeroVisual: React.FC<AssessmentHeroVisualProps> = ({ onPlayPreview }) => {
  return (
    <div className="relative mx-auto w-full max-w-[540px] select-none py-4">
      {/* Floating Badges */}
      <div className="absolute -top-1 left-4 z-20 flex items-center gap-1.5 rounded-full bg-emerald-500 text-white px-3 py-1 text-xs font-bold shadow-md animate-bounce duration-1000">
        <span className="h-2 w-2 rounded-full bg-white" />
        <span>SEO</span>
      </div>

      <div className="absolute top-8 -right-2 z-20 flex items-center gap-1.5 rounded-full bg-rose-500 text-white px-3.5 py-1 text-xs font-bold shadow-md">
        <span>Social Media</span>
      </div>

      <div className="absolute bottom-16 -left-3 z-20 flex items-center gap-1.5 rounded-full bg-blue-600 text-white px-3.5 py-1 text-xs font-bold shadow-md">
        <BarChart3 className="h-3.5 w-3.5" />
        <span>Analytics</span>
      </div>

      <div className="absolute -bottom-2 right-8 z-20 flex items-center gap-1.5 rounded-full bg-indigo-600 text-white px-3.5 py-1 text-xs font-bold shadow-md">
        <Award className="h-3.5 w-3.5" />
        <span>Get Certified</span>
      </div>

      {/* Decorative Hand-drawn hint */}
      <div className="absolute top-2 right-12 z-20 hidden sm:flex items-center gap-1 text-indigo-700 font-display font-bold text-xs italic transform rotate-6">
        <span>Your next skill is here</span>
        <span className="text-base">↘</span>
      </div>

      {/* Laptop Frame */}
      <div className="relative mx-auto rounded-t-2xl border-4 border-slate-800 bg-slate-900 p-2 shadow-2xl">
        {/* Laptop Camera dot */}
        <div className="mx-auto mb-1.5 h-1.5 w-1.5 rounded-full bg-slate-600" />

        {/* Laptop Screen Content */}
        <div className="relative overflow-hidden rounded-lg bg-white p-3 border border-slate-200">
          {/* Mock Window Top Bar */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-400" />
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            </div>
            <span className="text-[10px] font-semibold text-slate-400">TalentCIR Assessment Hub</span>
            <div className="h-2 w-8 rounded bg-slate-100" />
          </div>

          {/* Screen Body */}
          <div className="space-y-2.5">
            {/* Top metrics row */}
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg bg-blue-50/80 p-2 border border-blue-100">
                <span className="text-[9px] font-semibold text-blue-600 block">Readiness Score</span>
                <span className="text-base font-extrabold text-blue-900">92%</span>
                <span className="text-[9px] text-emerald-600 font-medium block">Top 5% percentile</span>
              </div>
              <div className="rounded-lg bg-indigo-50/80 p-2 border border-indigo-100">
                <span className="text-[9px] font-semibold text-indigo-600 block">Questions Verified</span>
                <span className="text-base font-extrabold text-indigo-900">38/40</span>
                <span className="text-[9px] text-indigo-500 font-medium block">Proctored AI</span>
              </div>
              <div className="rounded-lg bg-emerald-50/80 p-2 border border-emerald-100">
                <span className="text-[9px] font-semibold text-emerald-600 block">Verified Badge</span>
                <span className="text-base font-extrabold text-emerald-900">CIR-PRO</span>
                <span className="text-[9px] text-emerald-600 font-medium block">Ready to Hire</span>
              </div>
            </div>

            {/* Mock Chart & Breakdown */}
            <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-blue-600" /> Skill Breakdown
                </span>
                <span className="text-[9px] font-semibold text-slate-500">Live Evaluation</span>
              </div>

              {/* Horizontal Progress Bars */}
              <div className="space-y-1.5">
                <div>
                  <div className="flex justify-between text-[9px] text-slate-600 font-medium mb-0.5">
                    <span>Performance Marketing & Meta Ads</span>
                    <span className="font-bold text-slate-800">95%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full rounded-full bg-blue-600" style={{ width: "95%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[9px] text-slate-600 font-medium mb-0.5">
                    <span>Google Analytics 4 & Funnels</span>
                    <span className="font-bold text-slate-800">88%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full rounded-full bg-indigo-600" style={{ width: "88%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[9px] text-slate-600 font-medium mb-0.5">
                    <span>Technical SEO & Content Strategy</span>
                    <span className="font-bold text-slate-800">92%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-600" style={{ width: "92%" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Test Card in screen */}
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-2">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  CIR
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-slate-900 leading-tight">Digital Marketing Fundamentals</span>
                  <span className="block text-[9px] text-slate-500">Industry Assessment · 10 Questions</span>
                </div>
              </div>
              <button
                type="button"
                onClick={onPlayPreview}
                className="flex items-center gap-1 rounded bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700 hover:bg-blue-100 transition-colors"
              >
                <Play className="h-2.5 w-2.5 fill-blue-700" />
                <span>Preview</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Laptop Base Stand */}
      <div className="relative mx-auto -mt-0.5 h-3.5 w-[108%] rounded-b-xl bg-slate-700 shadow-md">
        <div className="mx-auto h-1 w-16 rounded-b bg-slate-500" />
      </div>
    </div>
  );
};

export default AssessmentHeroVisual;
