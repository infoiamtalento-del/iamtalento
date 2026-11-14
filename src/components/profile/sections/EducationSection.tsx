import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { PROFILE_CHAR_LIMITS } from "@/components/profile/profileFormatters";
import { CharCount } from "@/components/profile/CharCount";

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
                    <div className="flex items-center justify-between gap-2">
                      <Label className="text-xs text-muted-foreground">Institution *</Label>
                      <CharCount value={edu.institution_name} max={PROFILE_CHAR_LIMITS.eduInstitution} />
                    </div>
                    <Input
                      value={edu.institution_name}
                      maxLength={PROFILE_CHAR_LIMITS.eduInstitution}
                      onChange={(e) => update(i, "institution_name", e.target.value)}
                      placeholder="e.g. IIT Madras / University of Madras"
                      className="mt-1 h-9 text-sm"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <Label className="text-xs text-muted-foreground">Degree *</Label>
                      <CharCount value={edu.degree} max={PROFILE_CHAR_LIMITS.eduDegree} />
                    </div>
                    <Input
                      value={edu.degree}
                      maxLength={PROFILE_CHAR_LIMITS.eduDegree}
                      onChange={(e) => update(i, "degree", e.target.value)}
                      placeholder="e.g. MBA / B.Com / B.Tech"
                      className="mt-1 h-9 text-sm"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <Label className="text-xs text-muted-foreground">Field of Study</Label>
                      <CharCount value={edu.field_of_study} max={PROFILE_CHAR_LIMITS.eduField} />
                    </div>
                    <Input
                      value={edu.field_of_study}
                      maxLength={PROFILE_CHAR_LIMITS.eduField}
                      onChange={(e) => update(i, "field_of_study", e.target.value)}
                      placeholder="e.g. Marketing / Computer Science"
                      className="mt-1 h-9 text-sm"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <Label className="text-xs text-muted-foreground">Grade / CGPA</Label>
                      <CharCount value={edu.grade} max={PROFILE_CHAR_LIMITS.eduGrade} />
                    </div>
                    <Input
                      value={edu.grade}
                      maxLength={PROFILE_CHAR_LIMITS.eduGrade}
                      onChange={(e) => update(i, "grade", e.target.value)}
                      placeholder="e.g. 8.9 CGPA / First Class"
                      className="mt-1 h-9 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Start Year</Label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      maxLength={PROFILE_CHAR_LIMITS.eduYear}
                      value={edu.start_year ?? ""}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
                        update(i, "start_year", digits ? parseInt(digits, 10) : null);
                      }}
                      placeholder="e.g. 2020"
                      className="mt-1 h-9 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">End Year</Label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      maxLength={PROFILE_CHAR_LIMITS.eduYear}
                      value={edu.end_year ?? ""}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
                        update(i, "end_year", digits ? parseInt(digits, 10) : null);
                      }}
                      placeholder="e.g. 2024"
                      className="mt-1 h-9 text-sm"
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" size="sm" variant="ghost" onClick={() => remove(i)} className="text-destructive hover:text-destructive h-8 text-xs">
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                  </Button>
                  <Button type="button" size="sm" onClick={() => setEditingIndex(null)} className="h-8 text-xs">Done</Button>
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => setEditingIndex(i)} className="w-full text-left">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center shrink-0 mt-0.5">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{edu.degree || "Degree"} {edu.field_of_study && `in ${edu.field_of_study}`}</p>
                    <p className="text-xs text-muted-foreground truncate">{edu.institution_name || "Institution"}</p>
                    <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                      {edu.start_year && edu.end_year
                        ? `${edu.start_year} – ${edu.end_year}`
                        : edu.end_year || edu.start_year || "Year not set"}
                      {edu.grade && ` · ${edu.grade}`}
                    </p>
                  </div>
                </div>
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      <Button type="button" variant="outline" size="sm" onClick={add} className="w-full h-9 text-xs border-dashed">
        <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Education
      </Button>
    </div>
  );
};

export default EducationSection;
