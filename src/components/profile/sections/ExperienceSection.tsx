import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Building2, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Experience {
  id?: string;
  job_title: string;
  company_name: string;
  location: string;
  employment_type: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
}

interface Props {
  experiences: Experience[];
  onChange: (experiences: Experience[]) => void;
}

const emptyExperience: Experience = {
  job_title: "",
  company_name: "",
  location: "",
  employment_type: "",
  start_date: "",
  end_date: "",
  is_current: false,
  description: "",
};

const ExperienceSection = ({ experiences, onChange }: Props) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(
    experiences.length === 0 ? 0 : null
  );

  const addExperience = () => {
    onChange([...experiences, { ...emptyExperience }]);
    setEditingIndex(experiences.length);
  };

  const updateExperience = (index: number, field: string, value: string | boolean) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeExperience = (index: number) => {
    onChange(experiences.filter((_, i) => i !== index));
    setEditingIndex(null);
  };

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {experiences.map((exp, i) => (
          <motion.div
            key={i}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              "rounded-xl border p-4 transition-colors",
              editingIndex === i ? "border-primary/30 bg-accent/30" : "hover:bg-accent/20"
            )}
          >
            {editingIndex === i ? (
              <div className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Job Title *</Label>
                    <Input value={exp.job_title} onChange={(e) => updateExperience(i, "job_title", e.target.value)} placeholder="e.g. Software Engineer" className="mt-1 h-9 text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Company *</Label>
                    <Input value={exp.company_name} onChange={(e) => updateExperience(i, "company_name", e.target.value)} placeholder="e.g. Google" className="mt-1 h-9 text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Location</Label>
                    <Input value={exp.location} onChange={(e) => updateExperience(i, "location", e.target.value)} placeholder="e.g. Bangalore, India" className="mt-1 h-9 text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Employment Type</Label>
                    <Input value={exp.employment_type} onChange={(e) => updateExperience(i, "employment_type", e.target.value)} placeholder="e.g. Full-time" className="mt-1 h-9 text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Start Date</Label>
                    <Input type="date" value={exp.start_date} onChange={(e) => updateExperience(i, "start_date", e.target.value)} className="mt-1 h-9 text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">End Date</Label>
                    <Input type="date" value={exp.end_date} onChange={(e) => updateExperience(i, "end_date", e.target.value)} disabled={exp.is_current} className="mt-1 h-9 text-sm" />
                    <label className="flex items-center gap-2 mt-1.5">
                      <input type="checkbox" checked={exp.is_current} onChange={(e) => updateExperience(i, "is_current", e.target.checked)} className="h-3.5 w-3.5 rounded border-border text-primary" />
                      <span className="text-[11px] text-muted-foreground">Currently working here</span>
                    </label>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Description</Label>
                  <Textarea value={exp.description} onChange={(e) => updateExperience(i, "description", e.target.value)} placeholder="Key responsibilities & achievements..." className="mt-1 min-h-[80px] text-sm resize-none" />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button size="sm" variant="ghost" onClick={() => removeExperience(i)} className="text-destructive hover:text-destructive h-8 text-xs">
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                  </Button>
                  <Button size="sm" onClick={() => setEditingIndex(null)} className="h-8 text-xs">
                    Done
                  </Button>
                </div>
              </div>
            ) : (
              <button onClick={() => setEditingIndex(i)} className="w-full text-left">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center shrink-0 mt-0.5">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{exp.job_title || "Untitled Role"}</p>
                    <p className="text-xs text-muted-foreground truncate">{exp.company_name || "Company"} {exp.location && `· ${exp.location}`}</p>
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground/60 mt-0.5">
                      <Calendar className="h-3 w-3" />
                      {exp.start_date || "Start"} — {exp.is_current ? "Present" : exp.end_date || "End"}
                    </div>
                  </div>
                </div>
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      <Button variant="outline" size="sm" onClick={addExperience} className="w-full h-9 text-xs border-dashed">
        <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Experience
      </Button>
    </div>
  );
};

export default ExperienceSection;
