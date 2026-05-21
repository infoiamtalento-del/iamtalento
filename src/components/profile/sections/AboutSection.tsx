import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  summary: string;
  objective: string;
  onChange: (field: string, value: string) => void;
}

const AboutSection = ({ summary, objective, achievements, onChange }: Props & { achievements: string }) => (
  <div className="space-y-4">
    <div>
      <Label htmlFor="about_summary" className="text-xs font-medium text-muted-foreground mb-1.5 block">
        Professional Summary
      </Label>
      <Textarea
        id="about_summary"
        value={summary || ""}
        onChange={(e) => onChange("about_summary", e.target.value)}
        placeholder="A brief overview of your professional background, key strengths, and what you bring to the table..."
        className="min-h-[120px] text-sm resize-none"
        maxLength={1000}
      />
      <p className="text-[10px] text-muted-foreground mt-1 text-right">{(summary || "").length}/1000</p>
    </div>
    <div>
      <Label htmlFor="career_objective" className="text-xs font-medium text-muted-foreground mb-1.5 block">
        Career Objective
      </Label>
      <Textarea
        id="career_objective"
        value={objective || ""}
        onChange={(e) => onChange("career_objective", e.target.value)}
        placeholder="What are you looking for in your next role? What kind of impact do you want to make?"
        className="min-h-[80px] text-sm resize-none"
        maxLength={500}
      />
      <p className="text-[10px] text-muted-foreground mt-1 text-right">{(objective || "").length}/500</p>
    </div>
    <div>
      <Label htmlFor="key_achievements" className="text-xs font-medium text-muted-foreground mb-1.5 block">
        Key Achievements
      </Label>
      <Textarea
        id="key_achievements"
        value={achievements || ""}
        onChange={(e) => onChange("key_achievements", e.target.value)}
        placeholder="Highlight your most impactful accomplishments — awards, metrics, recognitions..."
        className="min-h-[80px] text-sm resize-none"
        maxLength={500}
      />
      <p className="text-[10px] text-muted-foreground mt-1 text-right">{(achievements || "").length}/500</p>
    </div>
  </div>
);

export default AboutSection;
