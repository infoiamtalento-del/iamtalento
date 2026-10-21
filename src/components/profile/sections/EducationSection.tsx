import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Education {
  id?: string;
  institution_name: string;
  degree: string;
  field_of_study: string;
  start_year: number | null;
  end_year: number | null;
  grade: string;
}

interface Props {
  educations: Education[];
  onChange: (educations: Education[]) => void;
}

const emptyEducation: Education = {
  institution_name: "",
  degree: "",
  field_of_study: "",
  start_year: null,
  end_year: null,
  grade: "",
};

const EducationSection = ({ educations, onChange }: Props) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(
    educations.length === 0 ? 0 : null
  );

  const add = () => {
    onChange([...educations, { ...emptyEducation }]);
    setEditingIndex(educations.length);
  };

  const update = (index: number, field: string, value: string | number | null) => {
    const updated = [...educations];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const remove = (index: number) => {
    onChange(educations.filter((_, i) => i !== index));
    setEditingIndex(null);
  };

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {educations.map((edu, i) => (
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
                    <Label className="text-xs text-muted-foreground">Institution *</Label>
                    <Input value={edu.institution_name} onChange={(e) => update(i, "institution_name", e.target.value)} placeholder="e.g. IIT Delhi" className="mt-1 h-9 text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Degree *</Label>
                    <Input value={edu.degree} onChange={(e) => update(i, "degree", e.target.value)} placeholder="e.g. B.Tech" className="mt-1 h-9 text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Field of Study</Label>
                    <Input value={edu.field_of_study} onChange={(e) => update(i, "field_of_study", e.target.value)} placeholder="e.g. Computer Science" className="mt-1 h-9 text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Grade / CGPA</Label>
                    <Input value={edu.grade} onChange={(e) => update(i, "grade", e.target.value)} placeholder="e.g. 9.2 CGPA" className="mt-1 h-9 text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Start Year</Label>
                    <Input type="number" value={edu.start_year ?? ""} onChange={(e) => update(i, "start_year", e.target.value ? parseInt(e.target.value) : null)} placeholder="e.g. 2020" className="mt-1 h-9 text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">End Year</Label>
                    <Input type="number" value={edu.end_year ?? ""} onChange={(e) => update(i, "end_year", e.target.value ? parseInt(e.target.value) : null)} placeholder="e.g. 2024" className="mt-1 h-9 text-sm" />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button size="sm" variant="ghost" onClick={() => remove(i)} className="text-destructive hover:text-destructive h-8 text-xs">
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                  </Button>
                  <Button size="sm" onClick={() => setEditingIndex(null)} className="h-8 text-xs">Done</Button>
                </div>
              </div>
            ) : (
              <button onClick={() => setEditingIndex(i)} className="w-full text-left">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center shrink-0 mt-0.5">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{edu.degree || "Degree"} {edu.field_of_study && `in ${edu.field_of_study}`}</p>
                    <p className="text-xs text-muted-foreground truncate">{edu.institution_name || "Institution"}</p>
                    <p className="text-[11px] text-muted-foreground/60 mt-0.5">{edu.start_year || "?"}, {edu.end_year || "?"}{edu.grade && ` · ${edu.grade}`}</p>
                  </div>
                </div>
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      <Button variant="outline" size="sm" onClick={add} className="w-full h-9 text-xs border-dashed">
        <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Education
      </Button>
    </div>
  );
};

export default EducationSection;
