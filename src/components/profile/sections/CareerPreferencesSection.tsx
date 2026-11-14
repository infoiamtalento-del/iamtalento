import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { X, Plus } from "lucide-react";
import { CharCount } from "@/components/profile/CharCount";
import { PROFILE_CHAR_LIMITS, formatSmartTag } from "@/components/profile/profileFormatters";

interface Props {
  data: Record<string, any>;
  onChange: (field: string, value: any) => void;
}

const employmentTypes = [
  { value: "full-time", label: "Full-Time" },
  { value: "part-time", label: "Part-Time" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
  { value: "internship", label: "Internship" },
];
const availabilityStatuses = ["Available", "Open to Offers", "Not Available"];
const noticePeriods = ["Immediate", "15 Days", "30 Days", "60 Days", "90 Days", "3+ Months"];

const TagInput = ({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
}) => {
  const [input, setInput] = useState("");
  const add = () => {
    if (input.trim() && !values.includes(input.trim())) {
      onChange([...values, input.trim()]);
      setInput("");
    }
  };
  return (
    <div className="sm:col-span-2">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
        <CharCount value={input} max={PROFILE_CHAR_LIMITS.tagChip} />
      </div>
      <div className="flex gap-2 mb-2">
        <Input
          maxLength={PROFILE_CHAR_LIMITS.tagChip}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing) {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className="h-9 text-sm flex-1"
        />
        <button
          type="button"
          onClick={add}
          aria-label={`Add ${label}`}
          className="h-9 w-9 rounded-md border flex items-center justify-center hover:bg-accent"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {values.map((v, i) => (
            <Badge key={i} variant="secondary" className="gap-1 text-xs">
              {formatSmartTag(v)}
              <button
                type="button"
                aria-label={`Remove ${v}`}
                onClick={() => onChange(values.filter((_, idx) => idx !== i))}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

const CareerPreferencesSection = ({ data, onChange }: Props) => (
  <div className="grid sm:grid-cols-2 gap-4">
    <div>
      <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Employment Type</Label>
      <Select value={data.employment_type || ""} onValueChange={(v) => onChange("employment_type", v)}>
        <SelectTrigger className="h-10 text-sm">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          {employmentTypes.map((t) => (
            <SelectItem key={t.value} value={t.value}>
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div>
      <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Availability</Label>
      <Select value={data.availability_status || ""} onValueChange={(v) => onChange("availability_status", v)}>
        <SelectTrigger className="h-10 text-sm">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          {availabilityStatuses.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div>
      <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Notice Period</Label>
      <Select value={data.notice_period || ""} onValueChange={(v) => onChange("notice_period", v)}>
        <SelectTrigger className="h-10 text-sm">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          {noticePeriods.map((p) => (
            <SelectItem key={p} value={p}>
              {p}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div>
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <Label htmlFor="salary" className="text-xs font-medium text-muted-foreground">
          Preferred Salary Range
        </Label>
        <CharCount value={data.preferred_salary_range || ""} max={PROFILE_CHAR_LIMITS.salaryRange} />
      </div>
      <Input
        id="salary"
        maxLength={PROFILE_CHAR_LIMITS.salaryRange}
        value={data.preferred_salary_range || ""}
        onChange={(e) => onChange("preferred_salary_range", e.target.value)}
        placeholder="e.g. ₹12–18 LPA"
        className="h-10 text-sm"
      />
    </div>
    <div className="flex items-center justify-between p-3 rounded-lg border bg-accent/30">
      <div>
        <p className="text-sm font-medium">Open to Work</p>
        <p className="text-xs text-muted-foreground">Actively seeking full-time roles</p>
      </div>
      <Switch checked={data.open_to_work !== false} onCheckedChange={(v) => onChange("open_to_work", v)} />
    </div>
    <div className="flex items-center justify-between p-3 rounded-lg border bg-accent/30">
      <div>
        <p className="text-sm font-medium">Open for Freelancing</p>
        <p className="text-xs text-muted-foreground">Available for contract & freelance gigs</p>
      </div>
      <Switch checked={!!data.open_for_freelance} onCheckedChange={(v) => onChange("open_for_freelance", v)} />
    </div>
    <TagInput
      label="Preferred Locations"
      values={data.preferred_locations || []}
      onChange={(v) => onChange("preferred_locations", v)}
      placeholder="e.g. Bengaluru, Remote"
    />
    <TagInput
      label="Hero Focus Badges / Areas of Expertise"
      values={data.areas_of_expertise || []}
      onChange={(v) => onChange("areas_of_expertise", v)}
      placeholder="e.g. Full Stack Dev, Cloud Architecture, GenAI"
    />
    <TagInput
      label="Tools & Platforms"
      values={data.tools || []}
      onChange={(v) => onChange("tools", v)}
      placeholder="e.g. Docker, AWS, Kubernetes, Figma, Git"
    />
    <TagInput
      label="Hobbies"
      values={data.hobbies || []}
      onChange={(v) => onChange("hobbies", v)}
      placeholder="e.g. Open Source, Photography, Chess"
    />
    <TagInput
      label="Interests"
      values={data.career_interests || []}
      onChange={(v) => onChange("career_interests", v)}
      placeholder="e.g. Distributed Systems, Applied AI, Developer Tooling"
    />
  </div>
);

export default CareerPreferencesSection;
