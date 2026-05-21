import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Achievement {
  id?: string;
  title: string;
  organization: string;
  achievement_date: string;
  description: string;
}

interface Props {
  achievements: Achievement[];
  onChange: (achievements: Achievement[]) => void;
}

const empty: Achievement = { title: "", organization: "", achievement_date: "", description: "" };

const AchievementsSection = ({ achievements, onChange }: Props) => {
  const add = () => onChange([...achievements, { ...empty }]);
  const remove = (i: number) => onChange(achievements.filter((_, idx) => idx !== i));
  const update = (i: number, field: string, value: string) => {
    const updated = [...achievements];
    updated[i] = { ...updated[i], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {achievements.map((ach, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="border rounded-xl p-4 space-y-3 relative">
            <button onClick={() => remove(i)} className="absolute top-3 right-3 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-muted-foreground">Achievement {i + 1}</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Title *</Label>
                <Input value={ach.title} onChange={(e) => update(i, "title", e.target.value)} placeholder="e.g. Best Paper Award" className="h-9 text-sm" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Organization</Label>
                <Input value={ach.organization} onChange={(e) => update(i, "organization", e.target.value)} placeholder="e.g. IEEE" className="h-9 text-sm" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Date</Label>
                <Input type="date" value={ach.achievement_date} onChange={(e) => update(i, "achievement_date", e.target.value)} className="h-9 text-sm" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Description</Label>
                <Textarea value={ach.description} onChange={(e) => update(i, "description", e.target.value)} placeholder="Brief description..." className="min-h-[60px] text-sm resize-none" />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <Button variant="outline" size="sm" onClick={add} className="gap-1.5 w-full h-9 text-xs">
        <Plus className="h-3.5 w-3.5" /> Add Achievement
      </Button>
    </div>
  );
};

export default AchievementsSection;
