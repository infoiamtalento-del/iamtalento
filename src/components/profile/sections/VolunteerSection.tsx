import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PROFILE_CHAR_LIMITS } from "@/components/profile/profileFormatters";
import { CharCount } from "@/components/profile/CharCount";

interface VolunteerExperience {
  id?: string;
  organization: string;
  role: string;
  cause: string;
  start_date: string;
  end_date: string;
  description: string;
}

interface Props {
  volunteer: VolunteerExperience[];
  onChange: (volunteer: VolunteerExperience[]) => void;
}

const empty: VolunteerExperience = { organization: "", role: "", cause: "", start_date: "", end_date: "", description: "" };

const VolunteerSection = ({ volunteer, onChange }: Props) => {
  const add = () => onChange([...volunteer, { ...empty }]);
  const remove = (i: number) => onChange(volunteer.filter((_, idx) => idx !== i));
  const update = (i: number, field: string, value: string) => {
    const updated = [...volunteer];
    updated[i] = { ...updated[i], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {volunteer.map((vol, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="border rounded-xl p-4 space-y-3 relative">
            <button type="button" aria-label={`Remove volunteer experience ${i + 1}`} onClick={() => remove(i)} className="absolute top-3 right-3 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            <div className="flex items-center gap-2 mb-1">
              <Heart className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-muted-foreground">Volunteer {i + 1}</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <Label className="text-xs text-muted-foreground">Organization *</Label>
                  <CharCount value={vol.organization} max={PROFILE_CHAR_LIMITS.expCompany} />
                </div>
                <Input value={vol.organization} maxLength={PROFILE_CHAR_LIMITS.expCompany} onChange={(e) => update(i, "organization", e.target.value)} placeholder="e.g. Red Cross" className="h-9 text-sm" />
              </div>
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <Label className="text-xs text-muted-foreground">Role</Label>
                  <CharCount value={vol.role} max={PROFILE_CHAR_LIMITS.expTitle} />
                </div>
                <Input value={vol.role} maxLength={PROFILE_CHAR_LIMITS.expTitle} onChange={(e) => update(i, "role", e.target.value)} placeholder="e.g. Volunteer Coordinator" className="h-9 text-sm" />
              </div>
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <Label className="text-xs text-muted-foreground">Cause</Label>
                  <CharCount value={vol.cause} max={PROFILE_CHAR_LIMITS.industry} />
                </div>
                <Input value={vol.cause} maxLength={PROFILE_CHAR_LIMITS.industry} onChange={(e) => update(i, "cause", e.target.value)} placeholder="e.g. Education, Environment" className="h-9 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Start</Label>
                  <Input type="date" value={vol.start_date} onChange={(e) => update(i, "start_date", e.target.value)} className="h-9 text-sm" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">End</Label>
                  <Input type="date" value={vol.end_date} onChange={(e) => update(i, "end_date", e.target.value)} className="h-9 text-sm" />
                </div>
              </div>
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <Label className="text-xs text-muted-foreground">Description</Label>
                  <CharCount value={vol.description} max={PROFILE_CHAR_LIMITS.projDescription} />
                </div>
                <Textarea value={vol.description} maxLength={PROFILE_CHAR_LIMITS.projDescription} onChange={(e) => update(i, "description", e.target.value)} placeholder="What did you do? What impact did you make?" className="min-h-[60px] text-sm resize-y" />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <Button type="button" variant="outline" size="sm" onClick={add} className="gap-1.5 w-full h-9 text-xs">
        <Plus className="h-3.5 w-3.5" /> Add Volunteer Experience
      </Button>
    </div>
  );
};

export default VolunteerSection;
