import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const proficiencyLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];

const SkillsSection = ({ skills, onChange }: Props) => {
  const [newSkill, setNewSkill] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const addSkill = () => {
    if (!newSkill.trim()) return;
    onChange([...skills, { skill_name: newSkill.trim(), category: newCategory.trim() || "General", proficiency_level: "Intermediate" }]);
    setNewSkill("");
    setNewCategory("");
  };

  const removeSkill = (index: number) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  const updateProficiency = (index: number, level: string) => {
    const updated = [...skills];
    updated[index] = { ...updated[index], proficiency_level: level };
    onChange(updated);
  };

  const categories = [...new Set(skills.map((s) => s.category || "General"))];

  return (
    <div className="space-y-4">
      {/* Add new skill */}
      <div className="flex gap-2">
        <Input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Skill name (e.g. React, Python)"
          className="h-9 text-sm flex-1"
          onKeyDown={(e) => e.key === "Enter" && addSkill()}
        />
        <Input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Category"
          className="h-9 text-sm w-32"
          onKeyDown={(e) => e.key === "Enter" && addSkill()}
        />
        <Button size="sm" onClick={addSkill} className="h-9 px-3">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Skills by category */}
      {categories.map((cat) => (
        <div key={cat}>
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2">{cat}</p>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {skills
                .map((skill, originalIndex) => ({ skill, originalIndex }))
                .filter(({ skill }) => (skill.category || "General") === cat)
                .map(({ skill, originalIndex }) => (
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
                        skill.proficiency_level === "Expert" && "bg-primary/10 border-primary/30 text-primary",
                        skill.proficiency_level === "Advanced" && "bg-success/10 border-success/30 text-success",
                        skill.proficiency_level === "Intermediate" && "bg-accent border-border text-foreground",
                        skill.proficiency_level === "Beginner" && "bg-muted border-border text-muted-foreground"
                      )}
                      onClick={() => {
                        const currentIdx = proficiencyLevels.indexOf(skill.proficiency_level);
                        const nextLevel = proficiencyLevels[(currentIdx + 1) % proficiencyLevels.length];
                        updateProficiency(originalIndex, nextLevel);
                      }}
                    >
                      <span>{skill.skill_name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSkill(originalIndex);
                        }}
                        className="ml-1 h-4 w-4 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </div>
      ))}

      {skills.length > 0 && (
        <p className="text-[10px] text-muted-foreground">💡 Click a skill to cycle proficiency: Beginner → Intermediate → Advanced → Expert</p>
      )}
    </div>
  );
};

export default SkillsSection;
