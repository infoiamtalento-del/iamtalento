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
        <div className="flex items-center justify-between gap-3 sm:gap-4 rounded-2xl border border-primary/25 bg-background/95 p-3.5 sm:px-5 sm:py-3.5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.25)] backdrop-blur-md">
          {/* Left: Cart badge & Selected Sub-domains */}
          <div className="flex items-center gap-3 min-w-0">
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
                {selected.length}
              </span>
            </span>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-display text-sm font-bold leading-tight text-foreground truncate">
                  {selected.length} Sub-domain{selected.length === 1 ? "" : "s"} Added
                </span>
                <span className="text-[10px] font-semibold text-primary px-1.5 py-0.2 rounded bg-primary/10">
                  + 3 Core Tests
                </span>
              </div>
              <div className="flex items-center gap-1 mt-1 overflow-hidden">
                {selected.slice(0, 3).map((s) => (
                  <span
                    key={s.id}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-secondary/80 px-2 py-0.5 rounded-md truncate max-w-[120px]"
                  >
                    <Check className="h-3 w-3 text-primary shrink-0" />
                    <span className="truncate">{s.name}</span>
                  </span>
                ))}
                {selected.length > 3 && (
                  <span className="text-[11px] font-medium text-muted-foreground">
                    +{selected.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Total Price & Checkout CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <span className="font-display text-base sm:text-lg font-extrabold text-foreground leading-tight block">
                {formatINR(total)}
              </span>
              <span className="text-[10px] text-muted-foreground block -mt-0.5">
                incl. 18% GST
              </span>
            </div>

            <Button
              size="sm"
              className="gap-1.5 font-bold shadow-md px-3.5 sm:px-4 text-xs sm:text-sm h-9 sm:h-10"
              onClick={onCheckout}
            >
              <span>Pay & Start</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
