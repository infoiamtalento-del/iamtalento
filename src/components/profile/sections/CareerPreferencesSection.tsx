import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { X, Plus } from "lucide-react";

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

const TagInput = ({ label, values, onChange, placeholder }: { label: string; values: string[]; onChange: (v: string[]) => void; placeholder: string }) => {
  const [input, setInput] = useState("");
  const add = () => {
    if (input.trim() && !values.includes(input.trim())) {
      onChange([...values, input.trim()]);
      setInput("");
    }
  };
  return (
    <div className="sm:col-span-2">
      <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</Label>
      <div className="flex gap-2 mb-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())} placeholder={placeholder} className="h-9 text-sm flex-1" />
        <button type="button" onClick={add} className="h-9 w-9 rounded-md border flex items-center justify-center hover:bg-accent"><Plus className="h-4 w-4" /></button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {values.map((v, i) => (
            <Badge key={i} variant="secondary" className="gap-1 text-xs">
              {v}
              <button onClick={() => onChange(values.filter((_, idx) => idx !== i))}><X className="h-3 w-3" /></button>
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
        <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="Select type" /></SelectTrigger>
        <SelectContent>
          {employmentTypes.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
    <div>
      <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Availability</Label>
      <Select value={data.availability_status || ""} onValueChange={(v) => onChange("availability_status", v)}>
        <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="Select status" /></SelectTrigger>
        <SelectContent>
          {availabilityStatuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
    <div>
      <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Notice Period</Label>
      <Select value={data.notice_period || ""} onValueChange={(v) => onChange("notice_period", v)}>
        <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="Select period" /></SelectTrigger>
        <SelectContent>
          {noticePeriods.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
    <div>
      <Label htmlFor="salary" className="text-xs font-medium text-muted-foreground mb-1.5 block">Preferred Salary Range</Label>
      <Input id="salary" value={data.preferred_salary_range || ""} onChange={(e) => onChange("preferred_salary_range", e.target.value)} placeholder="e.g. ₹10-15 LPA" className="h-10 text-sm" />
    </div>
    <div className="flex items-center justify-between sm:col-span-2 p-3 rounded-lg border bg-accent/30">
      <div>
        <p className="text-sm font-medium">Open to Work</p>
        <p className="text-xs text-muted-foreground">Let employers know you're actively looking</p>
      </div>
      <Switch checked={!!data.open_to_work} onCheckedChange={(v) => onChange("open_to_work", v)} />
    </div>
    <TagInput label="Preferred Locations" values={data.preferred_locations || []} onChange={(v) => onChange("preferred_locations", v)} placeholder="e.g. Bangalore, Remote" />
    <TagInput label="Areas of Expertise" values={data.areas_of_expertise || []} onChange={(v) => onChange("areas_of_expertise", v)} placeholder="e.g. Machine Learning, Cloud" />
    <TagInput label="Career Interests" values={data.career_interests || []} onChange={(v) => onChange("career_interests", v)} placeholder="e.g. Product Management, AI" />
  </div>
);

export default CareerPreferencesSection;
