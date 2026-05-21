import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface SectionBadgeProps {
  label: string;
  icon?: LucideIcon;
  className?: string;
}

const SectionBadge = ({ label, icon: Icon = Sparkles, className }: SectionBadgeProps) => (
  <div
    className={cn(
      "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-primary text-xs font-semibold border border-primary/15 mb-4",
      className
    )}
  >
    <Icon className="h-3.5 w-3.5" />
    {label}
  </div>
);

export default SectionBadge;
