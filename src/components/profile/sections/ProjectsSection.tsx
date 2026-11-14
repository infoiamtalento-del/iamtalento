import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, FolderKanban, ImagePlus, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { uploadProjectImageFile } from "@/services/candidate/profile";
import "@/components/profile/demo-profile.css";

interface Project {
  id?: string;
  title: string;
  description: string;
  organization: string;
  role_in_project: string;
  start_date: string;
  end_date: string;
  project_url: string;
  github_url?: string;
  image_url?: string;
  tools_technologies?: string[];
  impact: string;
}

interface Props {
  projects: Project[];
  userId?: string;
  onChange: (projects: Project[]) => void;
}

const empty: Project = {
  title: "",
  description: "",
  organization: "",
  role_in_project: "",
  start_date: "",
  end_date: "",
  project_url: "",
  github_url: "",
  image_url: "",
  tools_technologies: [],
  impact: "",
};

const ProjectsSection = ({ projects, userId = "", onChange }: Props) => {
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  const add = () => onChange([...projects, { ...empty }]);
  const remove = (i: number) => onChange(projects.filter((_, idx) => idx !== i));
  const update = (i: number, field: string, value: string | string[]) => {
    const updated = [...projects];
    updated[i] = { ...updated[i], [field]: value };
    onChange(updated);
  };

  const handleImageUpload = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !userId) return;
    setUploadingIdx(idx);
    try {
      const url = await uploadProjectImageFile(file, userId);
      update(idx, "image_url", url);
      toast.success("Project screenshot uploaded!");
    } catch (err: any) {
      toast.error(err?.message || "Project image upload failed");
    } finally {
      setUploadingIdx(null);
    }
  };

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {projects.map((proj, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="border rounded-xl p-4 space-y-3 relative"
          >
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label={`Remove project ${i + 1}`}
              className="absolute top-3 right-3 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 mb-1">
              <FolderKanban className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-muted-foreground">Project {i + 1}</span>
            </div>

            {proj.image_url && (
              <div className="h-32 rounded-lg overflow-hidden border border-border">
                <img
                  src={proj.image_url}
                  alt={proj.title || "Project screenshot"}
                  loading="lazy"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Title *</Label>
                <Input
                  value={proj.title}
                  onChange={(e) => update(i, "title", e.target.value)}
                  placeholder="e.g. CloudSync AI Pipeline"
                  className="h-9 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Your Role</Label>
                <Input
                  value={proj.role_in_project}
                  onChange={(e) => update(i, "role_in_project", e.target.value)}
                  placeholder="e.g. Lead Developer"
                  className="h-9 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Live Demo URL</Label>
                <Input
                  type="url"
                  value={proj.project_url}
                  onChange={(e) => update(i, "project_url", e.target.value)}
                  placeholder="https://..."
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  className="h-9 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">GitHub Repo URL</Label>
                <Input
                  type="url"
                  value={proj.github_url || ""}
                  onChange={(e) => update(i, "github_url", e.target.value)}
                  placeholder="https://github.com/..."
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  className="h-9 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs text-muted-foreground">
                  Tech Stack / Tools (comma-separated)
                </Label>
                <Input
                  value={(proj.tools_technologies || []).join(", ")}
                  onChange={(e) =>
                    update(
                      i,
                      "tools_technologies",
                      e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean)
                    )
                  }
                  placeholder="e.g. Next.js, FastAPI, PostgreSQL, Docker"
                  className="h-9 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <Label className="text-xs text-muted-foreground">Project Cover Screenshot</Label>
                  {userId && (
                    <label className="inline-flex items-center gap-1.5 text-xs font-medium text-primary cursor-pointer hover:underline">
                      {uploadingIdx === i ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <ImagePlus className="h-3.5 w-3.5" />
                      )}
                      <span>{uploadingIdx === i ? "Uploading..." : "Upload Image"}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => handleImageUpload(i, e)}
                        className="dp-visually-hidden"
                      />
                    </label>
                  )}
                </div>
                <Input
                  type="url"
                  value={proj.image_url || ""}
                  onChange={(e) => update(i, "image_url", e.target.value)}
                  placeholder="https://... or click Upload Image above"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  className="h-9 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs text-muted-foreground">Description</Label>
                <Textarea
                  value={proj.description}
                  onChange={(e) => update(i, "description", e.target.value)}
                  placeholder="What did you build? What problem did it solve?"
                  className="min-h-[60px] text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs text-muted-foreground">Impact</Label>
                <Input
                  value={proj.impact}
                  onChange={(e) => update(i, "impact", e.target.value)}
                  placeholder="e.g. Reduced latency by 40% across 50k daily requests"
                  className="h-9 text-sm"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <Button type="button" variant="outline" size="sm" onClick={add} className="gap-1.5 w-full h-9 text-xs">
        <Plus className="h-3.5 w-3.5" /> Add Project
      </Button>
    </div>
  );
};

export default ProjectsSection;
