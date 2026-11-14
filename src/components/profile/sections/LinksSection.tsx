import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Github, Linkedin, Globe, FileText, Palette, BarChart3, Video, AtSign } from "lucide-react";
import { PROFILE_CHAR_LIMITS } from "@/components/profile/profileFormatters";
import { CharCount } from "@/components/profile/CharCount";

interface Props {
  data: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

const links = [
  { key: "portfolio_slug", label: "Public Handle (/u/your-handle)", icon: AtSign, placeholder: "mahi-rakhecha", type: "text", max: PROFILE_CHAR_LIMITS.portfolioSlug },
  { key: "linkedin_url", label: "LinkedIn", icon: Linkedin, placeholder: "https://linkedin.com/in/...", type: "url", max: PROFILE_CHAR_LIMITS.url },
  { key: "github_url", label: "GitHub", icon: Github, placeholder: "https://github.com/...", type: "url", max: PROFILE_CHAR_LIMITS.url },
  { key: "portfolio_url", label: "Portfolio Website", icon: Globe, placeholder: "https://yoursite.com", type: "url", max: PROFILE_CHAR_LIMITS.url },
  { key: "resume_url", label: "External Resume URL", icon: FileText, placeholder: "https://drive.google.com/...", type: "url", max: PROFILE_CHAR_LIMITS.url },
  { key: "behance_url", label: "Behance", icon: Palette, placeholder: "https://behance.net/...", type: "url", max: PROFILE_CHAR_LIMITS.url },
  { key: "kaggle_url", label: "Kaggle", icon: BarChart3, placeholder: "https://kaggle.com/...", type: "url", max: PROFILE_CHAR_LIMITS.url },
  { key: "video_intro_url", label: "60s Video Resume URL (YouTube or MP4)", icon: Video, placeholder: "https://youtube.com/watch?v=...", type: "url", max: PROFILE_CHAR_LIMITS.url },
];

const LinksSection = ({ data, onChange }: Props) => (
  <div className="space-y-4">
    <div className="grid sm:grid-cols-2 gap-4">
      {links.map(({ key, label, icon: Icon, placeholder, type, max }) => (
        <div key={key}>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <Label htmlFor={key} className="text-xs font-medium text-muted-foreground">
              {label}
            </Label>
            {key === "portfolio_slug" && (
              <CharCount value={(data as Record<string, string>)[key] || ""} max={max} />
            )}
          </div>
          <div className="relative">
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
            <Input
              id={key}
              name={key}
              type={type}
              maxLength={max}
              value={(data as Record<string, string>)[key] || ""}
              onChange={(e) => onChange(key, e.target.value)}
              placeholder={placeholder}
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              className="pl-10 h-10 text-sm"
            />
          </div>
        </div>
      ))}
    </div>
    <div>
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <Label htmlFor="video_pitch" className="text-xs font-medium text-muted-foreground">
          60s Video Resume Written Pitch
        </Label>
        <CharCount value={(data as Record<string, string>).video_pitch || ""} max={PROFILE_CHAR_LIMITS.videoPitch} />
      </div>
      <Textarea
        id="video_pitch"
        name="video_pitch"
        maxLength={PROFILE_CHAR_LIMITS.videoPitch}
        value={(data as Record<string, string>).video_pitch || ""}
        onChange={(e) => onChange("video_pitch", e.target.value)}
        placeholder="Summarize your 60-second video pitch for recruiters..."
        className="min-h-[72px] text-sm resize-y"
      />
    </div>
  </div>
);

export default LinksSection;
