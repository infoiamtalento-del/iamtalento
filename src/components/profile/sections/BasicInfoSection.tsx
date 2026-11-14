import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Mail, Phone, MapPin, Briefcase, Building2, Clock, Sparkles } from "lucide-react";

interface BasicInfoData {
  full_name: string;
  email: string;
  phone: string;
  professional_headline: string;
  sub_headline?: string;
  job_role: string;
  company: string;
  city: string;
  state: string;
  country: string;
  years_of_experience: number | null;
  experience_level: string;
  industry: string;
}

interface Props {
  data: BasicInfoData;
  onChange: (field: string, value: string) => void;
}

const Field = ({
  icon: Icon,
  label,
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
  identifierField = false,
}: {
  icon: React.ElementType;
  label: string;
  id: string;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  identifierField?: boolean;
}) => (
  <div>
    <Label htmlFor={id} className="text-xs font-medium text-muted-foreground mb-1.5 block">
      {label}
    </Label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
      <Input
        id={id}
        name={id}
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        autoCorrect={identifierField ? "off" : undefined}
        autoCapitalize={identifierField ? "none" : undefined}
        spellCheck={identifierField ? false : undefined}
        className="pl-10 h-10 text-sm"
      />
    </div>
  </div>
);

const experienceLevels = [
  { value: "fresher", label: "Fresher (0 yrs)" },
  { value: "experienced", label: "Experienced" },
  { value: "Junior", label: "Junior (1–3 yrs)" },
  { value: "Mid-Level", label: "Mid-Level (3–6 yrs)" },
  { value: "Senior", label: "Senior (6+ yrs)" },
  { value: "Lead", label: "Lead / Principal" },
  { value: "Executive", label: "Executive" },
];

const industries = [
  "Technology & Software",
  "Data Science & AI",
  "Finance & BFSI",
  "Marketing & Growth",
  "Product & Design",
  "Sales & Business Dev",
  "Operations & Supply Chain",
  "Human Resources",
  "Healthcare & Pharma",
  "Education & EdTech",
  "Core Engineering & Manufacturing",
  "Cybersecurity & Cloud",
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Manufacturing",
  "Retail",
  "Consulting",
  "Media",
  "Government",
  "Non-Profit",
  "Other",
];

const BasicInfoSection = ({ data, onChange }: Props) => (
  <div className="grid sm:grid-cols-2 gap-4">
    <Field
      icon={User}
      label="Full Name"
      id="full_name"
      value={data.full_name}
      onChange={(v) => onChange("full_name", v)}
      placeholder="Your full name"
      autoComplete="name"
    />
    <Field
      icon={Mail}
      label="Email"
      id="email"
      value={data.email}
      onChange={(v) => onChange("email", v)}
      placeholder="you@example.com"
      type="email"
      autoComplete="email"
      identifierField
    />
    <Field
      icon={Phone}
      label="Phone"
      id="phone"
      value={data.phone}
      onChange={(v) => onChange("phone", v)}
      placeholder="+91 98765 43210"
      type="tel"
      autoComplete="tel"
    />
    <Field
      icon={Briefcase}
      label="Designation / Headline"
      id="professional_headline"
      value={data.professional_headline}
      onChange={(v) => onChange("professional_headline", v)}
      placeholder="e.g. Senior Full Stack Developer"
    />
    <Field
      icon={Sparkles}
      label="Sub-Headline / Specialty"
      id="sub_headline"
      value={data.sub_headline || ""}
      onChange={(v) => onChange("sub_headline", v)}
      placeholder="e.g. Cloud & AI Specialist"
    />
    <Field
      icon={Briefcase}
      label="Current Role"
      id="job_role"
      value={data.job_role}
      onChange={(v) => onChange("job_role", v)}
      placeholder="e.g. Software Engineer"
    />
    <Field
      icon={Building2}
      label="Company"
      id="company"
      value={data.company}
      onChange={(v) => onChange("company", v)}
      placeholder="e.g. Acme Corp"
    />
    <Field
      icon={Clock}
      label="Years of Experience"
      id="years_of_experience"
      value={String(data.years_of_experience ?? "")}
      onChange={(v) => onChange("years_of_experience", v)}
      placeholder="e.g. 5"
      type="number"
    />
    <div>
      <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Experience Level</Label>
      <Select value={data.experience_level || ""} onValueChange={(v) => onChange("experience_level", v)}>
        <SelectTrigger className="h-10 text-sm">
          <SelectValue placeholder="Select level" />
        </SelectTrigger>
        <SelectContent>
          {experienceLevels.map((l) => (
            <SelectItem key={l.value} value={l.value}>
              {l.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div>
      <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Industry</Label>
      <Select value={data.industry || ""} onValueChange={(v) => onChange("industry", v)}>
        <SelectTrigger className="h-10 text-sm">
          <SelectValue placeholder="Select industry" />
        </SelectTrigger>
        <SelectContent>
          {industries.map((i) => (
            <SelectItem key={i} value={i}>
              {i}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <Field
      icon={MapPin}
      label="City"
      id="city"
      value={data.city}
      onChange={(v) => onChange("city", v)}
      placeholder="e.g. Bengaluru"
    />
    <Field
      icon={MapPin}
      label="State"
      id="state"
      value={data.state}
      onChange={(v) => onChange("state", v)}
      placeholder="e.g. Karnataka"
    />
    <Field
      icon={MapPin}
      label="Country"
      id="country"
      value={data.country}
      onChange={(v) => onChange("country", v)}
      placeholder="e.g. India"
    />
  </div>
);

export default BasicInfoSection;
