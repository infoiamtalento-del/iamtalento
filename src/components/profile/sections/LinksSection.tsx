import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, Linkedin, Globe, FileText, Palette, BarChart3, Video } from "lucide-react";

interface Props {
  data: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

const links = [
  { key: "linkedin_url", label: "LinkedIn", icon: Linkedin, placeholder: "https://linkedin.com/in/..." },
  { key: "github_url", label: "GitHub", icon: Github, placeholder: "https://github.com/..." },
  { key: "portfolio_url", label: "Portfolio", icon: Globe, placeholder: "https://yoursite.com" },
  { key: "resume_url", label: "Resume URL", icon: FileText, placeholder: "https://drive.google.com/..." },
  { key: "behance_url", label: "Behance", icon: Palette, placeholder: "https://behance.net/..." },
  { key: "kaggle_url", label: "Kaggle", icon: BarChart3, placeholder: "https://kaggle.com/..." },
  { key: "video_intro_url", label: "Video Intro", icon: Video, placeholder: "https://youtube.com/..." },
];

const LinksSection = ({ data, onChange }: Props) => (
  <div className="grid sm:grid-cols-2 gap-4">
    {links.map(({ key, label, icon: Icon, placeholder }) => (
      <div key={key}>
        <Label htmlFor={key} className="text-xs font-medium text-muted-foreground mb-1.5 block">
          {label}
        </Label>
        <div className="relative">
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
          <Input
            id={key}
            type="url"
            value={(data as Record<string, string>)[key] || ""}
            onChange={(e) => onChange(key, e.target.value)}
            placeholder={placeholder}
            className="pl-10 h-10 text-sm"
          />
        </div>
      </div>
    ))}
  </div>
);

export default LinksSection;
