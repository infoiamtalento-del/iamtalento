import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, FolderKanban } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Project {
  id?: string;
  title: string;
  description: string;
  organization: string;
  role_in_project: string;
  start_date: string;
  end_date: string;
  project_url: string;
  impact: string;
}

interface Props {
  projects: Project[];
  onChange: (projects: Project[]) => void;
}

const empty: Project = { title: "", description: "", organization: "", role_in_project: "", start_date: "", end_date: "", project_url: "", impact: "" };

const ProjectsSection = ({ projects, onChange }: Props) => {
  const add = () => onChange([...projects, { ...empty }]);
  const remove = (i: number) => onChange(projects.filter((_, idx) => idx !== i));
  const update = (i: number, field: string, value: string) => {
    const updated = [...projects];
    updated[i] = { ...updated[i], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {projects.map((proj, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="border rounded-xl p-4 space-y-3 relative">
            <button onClick={() => remove(i)} className="absolute top-3 right-3 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            <div className="flex items-center gap-2 mb-1">
              <FolderKanban className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-muted-foreground">Project {i + 1}</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Title *</Label>
                <Input value={proj.title} onChange={(e) => update(i, "title", e.target.value)} placeholder="e.g. E-Commerce Platform" className="h-9 text-sm" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Organization</Label>
                <Input value={proj.organization} onChange={(e) => update(i, "organization", e.target.value)} placeholder="e.g. Acme Corp" className="h-9 text-sm" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Your Role</Label>
                <Input value={proj.role_in_project} onChange={(e) => update(i, "role_in_project", e.target.value)} placeholder="e.g. Lead Developer" className="h-9 text-sm" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Project URL</Label>
                <Input type="url" value={proj.project_url} onChange={(e) => update(i, "project_url", e.target.value)} placeholder="https://..." className="h-9 text-sm" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Start Date</Label>
                <Input type="date" value={proj.start_date} onChange={(e) => update(i, "start_date", e.target.value)} className="h-9 text-sm" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">End Date</Label>
                <Input type="date" value={proj.end_date} onChange={(e) => update(i, "end_date", e.target.value)} className="h-9 text-sm" />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs text-muted-foreground">Description</Label>
                <Textarea value={proj.description} onChange={(e) => update(i, "description", e.target.value)} placeholder="What did you build? What tech did you use?" className="min-h-[60px] text-sm resize-none" />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs text-muted-foreground">Impact</Label>
                <Input value={proj.impact} onChange={(e) => update(i, "impact", e.target.value)} placeholder="e.g. Improved performance by 40%" className="h-9 text-sm" />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <Button variant="outline" size="sm" onClick={add} className="gap-1.5 w-full h-9 text-xs">
        <Plus className="h-3.5 w-3.5" /> Add Project
      </Button>
    </div>
  );
};

export default ProjectsSection;
