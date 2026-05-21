import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Course {
  id?: string;
  name: string;
  platform: string;
  completion_date: string;
}

interface Props {
  courses: Course[];
  onChange: (courses: Course[]) => void;
}

const empty: Course = { name: "", platform: "", completion_date: "" };

const CoursesSection = ({ courses, onChange }: Props) => {
  const add = () => onChange([...courses, { ...empty }]);
  const remove = (i: number) => onChange(courses.filter((_, idx) => idx !== i));
  const update = (i: number, field: string, value: string) => {
    const updated = [...courses];
    updated[i] = { ...updated[i], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {courses.map((course, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="border rounded-xl p-4 space-y-3 relative">
            <button onClick={() => remove(i)} className="absolute top-3 right-3 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-muted-foreground">Course {i + 1}</span>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Course Name *</Label>
                <Input value={course.name} onChange={(e) => update(i, "name", e.target.value)} placeholder="e.g. Deep Learning Specialization" className="h-9 text-sm" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Platform</Label>
                <Input value={course.platform} onChange={(e) => update(i, "platform", e.target.value)} placeholder="e.g. Coursera" className="h-9 text-sm" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Completion Date</Label>
                <Input type="date" value={course.completion_date} onChange={(e) => update(i, "completion_date", e.target.value)} className="h-9 text-sm" />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <Button variant="outline" size="sm" onClick={add} className="gap-1.5 w-full h-9 text-xs">
        <Plus className="h-3.5 w-3.5" /> Add Course
      </Button>
    </div>
  );
};

export default CoursesSection;
