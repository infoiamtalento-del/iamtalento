import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Skill {
  id?: string;
  skill_name: string;
  category: string;
  proficiency_level: string;
}

interface Props {
  skills: Skill[];
  onChange: (skills: Skill[]) => void;
}

const proficiencyLevels = ["beginner", "intermediate", "advanced", "expert"] as const;
const categoryLabels: Record<string, string> = {
  technical: "Technical",
  behavioral: "Behavioral",
  management: "Management",
};

const normalizeCategory = (c?: string) => {
  const lower = (c || "").toLowerCase();
  if (lower === "behavioral" || lower === "management") return lower;
  return "technical";
};

const normalizeLevel = (l?: string) => {
  const lower = (l || "").toLowerCase();
  if (proficiencyLevels.includes(lower as any)) return lower;
  return "intermediate";
};

const prettyLevel = (l?: string) => {
  const n = normalizeLevel(l);
  return n.charAt(0).toUpperCase() + n.slice(1);
};

const SkillsSection = ({ skills, onChange }: Props) => {
  const [newSkill, setNewSkill] = useState("");
  const [newCategory, setNewCategory] = useState("technical");

  const addSkill = () => {
    if (!newSkill.trim()) return;
    onChange([
      ...skills,
      {
        skill_name: newSkill.trim(),
        category: normalizeCategory(newCategory),
        proficiency_level: "intermediate",
      },
    ]);
    setNewSkill("");
  };

  const removeSkill = (index: number) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  const updateProficiency = (index: number, level: string) => {
    const updated = [...skills];
    updated[index] = { ...updated[index], proficiency_level: level };
    onChange(updated);
  };

  const categories = [...new Set(skills.map((s) => normalizeCategory(s.category)))];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Skill name (e.g. React, Python, System Design)"
          className="h-9 text-sm flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing) {
              e.preventDefault();
              addSkill();
            }
          }}
        />
        <Select value={newCategory} onValueChange={setNewCategory}>
          <SelectTrigger className="h-9 text-xs w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="technical">Technical</SelectItem>
            <SelectItem value="behavioral">Behavioral</SelectItem>
            <SelectItem value="management">Management</SelectItem>
          </SelectContent>
        </Select>
        <Button type="button" size="sm" onClick={addSkill} className="h-9 px-3" aria-label="Add skill">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {categories.map((cat) => (
        <div key={cat}>
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
            {categoryLabels[cat] || "Technical"}
          </p>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {skills
                .map((skill, originalIndex) => ({ skill, originalIndex }))
                .filter(({ skill }) => normalizeCategory(skill.category) === cat)
                .map(({ skill, originalIndex }) => {
                  const lvl = normalizeLevel(skill.proficiency_level);
                  return (
                    <motion.div
                      key={`${skill.skill_name}-${originalIndex}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="group relative"
                    >
                      <div
                        className={cn(
                          "flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full border text-xs font-medium transition-colors cursor-pointer",
                          lvl === "expert" && "bg-primary/10 border-primary/30 text-primary",
                          lvl === "advanced" && "bg-success/10 border-success/30 text-success",
                          lvl === "intermediate" && "bg-accent border-border text-foreground",
                          lvl === "beginner" && "bg-muted border-border text-muted-foreground"
                        )}
                        onClick={() => {
                          const currentIdx = proficiencyLevels.indexOf(lvl as any);
                          const nextLevel = proficiencyLevels[(currentIdx + 1) % proficiencyLevels.length];
                          updateProficiency(originalIndex, nextLevel);
                        }}
                      >
                        <span>
                          {skill.skill_name} · {prettyLevel(lvl)}
                        </span>
                        <button
                          type="button"
                          aria-label={`Remove ${skill.skill_name}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSkill(originalIndex);
                          }}
                          className="ml-1 h-4 w-4 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity hover:bg-destructive/20"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
            </AnimatePresence>
          </div>
        </div>
      ))}

      {skills.length > 0 && (
        <p className="text-[10px] text-muted-foreground">
          Click a skill chip to cycle proficiency: Beginner → Intermediate → Advanced → Expert
        </p>
      )}
    </div>
  );
};

export default SkillsSection;
