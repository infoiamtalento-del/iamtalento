import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PROFILE_CHAR_LIMITS } from "@/components/profile/profileFormatters";
import { CharCount } from "@/components/profile/CharCount";

interface Certification {
  id?: string;
  name: string;
  issuing_organization: string;
  issue_date: string;
  expiry_date: string;
  credential_id: string;
  credential_url: string;
}

interface Props {
  certifications: Certification[];
  onChange: (certs: Certification[]) => void;
}

const empty: Certification = { name: "", issuing_organization: "", issue_date: "", expiry_date: "", credential_id: "", credential_url: "" };

const CertificationsSection = ({ certifications, onChange }: Props) => {
  const add = () => onChange([...certifications, { ...empty }]);
  const remove = (i: number) => onChange(certifications.filter((_, idx) => idx !== i));
  const update = (i: number, field: string, value: string) => {
    const updated = [...certifications];
    updated[i] = { ...updated[i], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {certifications.map((cert, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="border rounded-xl p-4 space-y-3 relative">
            <button type="button" aria-label={`Remove certification ${i + 1}`} onClick={() => remove(i)} className="absolute top-3 right-3 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            <div className="flex items-center gap-2 mb-1">
              <Award className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-muted-foreground">Certification {i + 1}</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <Label className="text-xs text-muted-foreground">Name *</Label>
                  <CharCount value={cert.name} max={PROFILE_CHAR_LIMITS.certName} />
                </div>
                <Input value={cert.name} maxLength={PROFILE_CHAR_LIMITS.certName} onChange={(e) => update(i, "name", e.target.value)} placeholder="e.g. Google Ads Search Certification" className="h-9 text-sm" />
              </div>
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <Label className="text-xs text-muted-foreground">Issuing Organization</Label>
                  <CharCount value={cert.issuing_organization} max={PROFILE_CHAR_LIMITS.certIssuer} />
                </div>
                <Input value={cert.issuing_organization} maxLength={PROFILE_CHAR_LIMITS.certIssuer} onChange={(e) => update(i, "issuing_organization", e.target.value)} placeholder="e.g. Google / HubSpot / AWS" className="h-9 text-sm" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Issue Date</Label>
                <Input type="date" value={cert.issue_date} onChange={(e) => update(i, "issue_date", e.target.value)} className="h-9 text-sm" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Expiry Date</Label>
                <Input type="date" value={cert.expiry_date} onChange={(e) => update(i, "expiry_date", e.target.value)} className="h-9 text-sm" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Credential ID</Label>
                <Input value={cert.credential_id} maxLength={60} autoCorrect="off" autoCapitalize="none" spellCheck={false} onChange={(e) => update(i, "credential_id", e.target.value)} placeholder="e.g. ABC123" className="h-9 text-sm" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Credential URL</Label>
                <Input type="url" value={cert.credential_url} maxLength={PROFILE_CHAR_LIMITS.url} autoCorrect="off" autoCapitalize="none" spellCheck={false} onChange={(e) => update(i, "credential_url", e.target.value)} placeholder="https://..." className="h-9 text-sm" />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <Button type="button" variant="outline" size="sm" onClick={add} className="gap-1.5 w-full h-9 text-xs">
        <Plus className="h-3.5 w-3.5" /> Add Certification
      </Button>
    </div>
  );
};

export default CertificationsSection;
