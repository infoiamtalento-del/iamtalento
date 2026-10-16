import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type SubDomain } from "@/data/subDomains";
import { formatINR } from "@/components/assessments/SubDomainPicker";

interface Props {
  selected: SubDomain[];
  total: number;
  onCheckout: () => void;
}

export const AssessmentStickyBar = ({ selected, total, onCheckout }: Props) => {
  if (selected.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 60, opacity: 0, x: "-50%" }}
        animate={{ y: 0, opacity: 1, x: "-50%" }}
        exit={{ y: 60, opacity: 0, x: "-50%" }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="fixed bottom-5 sm:bottom-6 left-1/2 z-40 w-[94%] max-w-2xl"
      >
        <div className="yellow-graded-section flex items-center justify-between gap-3 sm:gap-4 rounded-2xl p-3.5 sm:px-5 sm:py-3.5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.22)] backdrop-blur-md">
          {/* Left: Cart badge & Selected Sub-domains */}
          <div className="flex items-center gap-3 min-w-0">
            <span className="yellow-graded-btn relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-950 shadow-sm">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#0d5cb2] text-[10px] font-bold text-white">
                {selected.length}
              </span>
            </span>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-display text-sm font-extrabold leading-tight text-slate-900 truncate">
                  {selected.length} Course{selected.length === 1 ? "" : "s"} Selected
                </span>
                <span className="yellow-graded-badge text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  + 3 Core Tests FREE
                </span>
              </div>
              <div className="flex items-center gap-1 mt-1 overflow-hidden">
                {selected.slice(0, 3).map((s) => (
                  <span
                    key={s.id}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-white border border-amber-300/80 px-2 py-0.5 rounded-md truncate max-w-[120px]"
                  >
                    <Check className="h-3 w-3 text-emerald-600 shrink-0" />
                    <span className="truncate">{s.name}</span>
                  </span>
                ))}
                {selected.length > 3 && (
                  <span className="text-[11px] font-bold text-amber-800">
                    +{selected.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Total Price & Checkout CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <span className="font-display text-base sm:text-lg font-extrabold text-[#0d5cb2] leading-tight block">
                {formatINR(total)}
              </span>
              <span className="text-[10px] text-slate-600 font-medium block -mt-0.5">
                incl. 18% GST
              </span>
            </div>

            <button
              type="button"
              className="yellow-graded-btn inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-extrabold cursor-pointer transition-all"
              onClick={onCheckout}
            >
              <span>Pay &amp; Start</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
