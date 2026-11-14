import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CharCount } from "@/components/profile/CharCount";
import { PROFILE_CHAR_LIMITS } from "@/components/profile/profileFormatters";

interface Props {
  summary: string;
  objective: string;
  onChange: (field: string, value: string) => void;
}

const AboutSection = ({ summary, objective, achievements, onChange }: Props & { achievements: string }) => (
  <div className="space-y-4">
    <div>
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <Label htmlFor="about_summary" className="text-xs font-medium text-muted-foreground">
          Professional Summary
        </Label>
        <CharCount value={summary || ""} max={PROFILE_CHAR_LIMITS.about} />
      </div>
      <Textarea
        id="about_summary"
        value={summary || ""}
        onChange={(e) => onChange("about_summary", e.target.value)}
        placeholder="A concise overview of your professional background, core strengths, and measurable outcomes..."
        className="min-h-[120px] text-sm resize-y"
        maxLength={PROFILE_CHAR_LIMITS.about}
      />
    </div>
    <div>
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <Label htmlFor="career_objective" className="text-xs font-medium text-muted-foreground">
          Career Objective
        </Label>
        <CharCount value={objective || ""} max={500} />
      </div>
      <Textarea
        id="career_objective"
        value={objective || ""}
        onChange={(e) => onChange("career_objective", e.target.value)}
        placeholder="What are you looking for in your next role? What kind of impact do you want to make?"
        className="min-h-[80px] text-sm resize-y"
        maxLength={500}
      />
    </div>
    <div>
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <Label htmlFor="key_achievements" className="text-xs font-medium text-muted-foreground">
          Key Achievements
        </Label>
        <CharCount value={achievements || ""} max={500} />
      </div>
      <Textarea
        id="key_achievements"
        value={achievements || ""}
        onChange={(e) => onChange("key_achievements", e.target.value)}
        placeholder="Highlight your most impactful accomplishments, awards, metrics, recognitions..."
        className="min-h-[80px] text-sm resize-y"
        maxLength={500}
      />
    </div>
  </div>
);

export default AboutSection;
