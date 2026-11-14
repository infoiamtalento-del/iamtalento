import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PROFILE_CHAR_LIMITS } from "@/components/profile/profileFormatters";
import { CharCount } from "@/components/profile/CharCount";

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
            <button type="button" aria-label={`Remove achievement ${i + 1}`} onClick={() => remove(i)} className="absolute top-3 right-3 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-muted-foreground">Achievement {i + 1}</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <Label className="text-xs text-muted-foreground">Title *</Label>
                  <CharCount value={ach.title} max={PROFILE_CHAR_LIMITS.awardTitle} />
                </div>
                <Input value={ach.title} maxLength={PROFILE_CHAR_LIMITS.awardTitle} onChange={(e) => update(i, "title", e.target.value)} placeholder="e.g. Best Campaign of the Quarter" className="h-9 text-sm" />
              </div>
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <Label className="text-xs text-muted-foreground">Organization</Label>
                  <CharCount value={ach.organization} max={PROFILE_CHAR_LIMITS.awardOrg} />
                </div>
                <Input value={ach.organization} maxLength={PROFILE_CHAR_LIMITS.awardOrg} onChange={(e) => update(i, "organization", e.target.value)} placeholder="e.g. Organization / Event" className="h-9 text-sm" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Date</Label>
                <Input type="date" value={ach.achievement_date} onChange={(e) => update(i, "achievement_date", e.target.value)} className="h-9 text-sm" />
              </div>
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <Label className="text-xs text-muted-foreground">Description</Label>
                  <CharCount value={ach.description} max={PROFILE_CHAR_LIMITS.awardDescription} />
                </div>
                <Textarea value={ach.description} maxLength={PROFILE_CHAR_LIMITS.awardDescription} onChange={(e) => update(i, "description", e.target.value)} placeholder="Brief description and measurable impact..." className="min-h-[60px] text-sm resize-y" />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <Button type="button" variant="outline" size="sm" onClick={add} className="gap-1.5 w-full h-9 text-xs">
        <Plus className="h-3.5 w-3.5" /> Add Achievement
      </Button>
    </div>
  );
};

export default AchievementsSection;
