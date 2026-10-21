import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Building2, User, Mail, Phone, Globe, MapPin, Image, Calendar,
  Briefcase, DollarSign, FileText, ChevronLeft, ChevronRight,
  Check, LogOut, Save, Shield, Plus, Trash2, Factory,
} from "lucide-react";

const STEPS = [
  { num: 1, label: "Sign Up", icon: User, desc: "Account created" },
  { num: 2, label: "Contact Person", icon: User, desc: "Authorized person details" },
  { num: 3, label: "Verification", icon: Shield, desc: "Verify email & phone" },
  { num: 4, label: "Company Details", icon: Building2, desc: "Tell us about your company" },
  { num: 5, label: "Job Openings", icon: Briefcase, desc: "Upload positions" },
  { num: 6, label: "Custom Hiring", icon: FileText, desc: "Customize requirements" },
  { num: 7, label: "Account", icon: User, desc: "Manage your account" },
];

interface JobOpening {
  id?: string;
  designation: string;
  num_openings: number;
  salary_min: string;
  salary_max: string;
  job_description: string;
  job_location: string;
  experience_years: string;
  is_custom: boolean;
}

const emptyJob = (): JobOpening => ({
  designation: "", num_openings: 1, salary_min: "", salary_max: "",
  job_description: "", job_location: "", experience_years: "", is_custom: false,
});

const EmployerProfileBuilder = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(2); // Step 1 is signup (done)
  const [userId, setUserId] = useState<string | null>(null);
  const [employerId, setEmployerId] = useState<string | null>(null);

  // Step 2 — Contact Person
  const [contactName, setContactName] = useState("");
  const [officialEmail, setOfficialEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  // Step 3 — Verification (display only for now)
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  // Step 4 — Company Details
  const [companyName, setCompanyName] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [registrationType, setRegistrationType] = useState("");
  const [website, setWebsite] = useState("");
  const [numEmployees, setNumEmployees] = useState("");
  const [address, setAddress] = useState("");
  const [multipleLocations, setMultipleLocations] = useState<string[]>([]);
  const [newLocation, setNewLocation] = useState("");
  const [description, setDescription] = useState("");
  const [establishedYear, setEstablishedYear] = useState("");
  const [industry, setIndustry] = useState("");
  const [talentaId, setTalentaId] = useState("");

  // Step 5/6 — Jobs
  const [jobs, setJobs] = useState<JobOpening[]>([emptyJob()]);

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }
      setUserId(user.id);

      const { data: emp } = await supabase.from("employers").select("*").eq("user_id", user.id).maybeSingle();
      if (!emp) { navigate("/auth"); return; }

      setEmployerId(emp.id);
      setContactName(emp.contact_name || "");
      setOfficialEmail(emp.official_email || user.email || "");
      setContactPhone(emp.phone || "");
      setEmailVerified(emp.email_verified || false);
      setPhoneVerified(emp.phone_verified || false);
      setCompanyName(emp.company_name || "");
      setCompanyType(emp.company_type || "");
      setRegistrationType(emp.registration_type || "");
      setWebsite(emp.website || "");
      setNumEmployees(emp.num_employees || "");
      setAddress(emp.address || "");
      setMultipleLocations(emp.multiple_locations || []);
      setDescription(emp.description || "");
      setEstablishedYear(emp.established_year?.toString() || "");
      setIndustry(emp.industry || "");
      setTalentaId(emp.employer_id || "");

      // Load job openings
      const { data: jobData } = await supabase
        .from("employer_job_openings")
        .select("*")
        .eq("employer_id", emp.id);
      if (jobData && jobData.length > 0) {
        setJobs(jobData.map((j: any) => ({
          id: j.id, designation: j.designation, num_openings: j.num_openings || 1,
          salary_min: j.salary_min?.toString() || "", salary_max: j.salary_max?.toString() || "",
          job_description: j.job_description || "", job_location: j.job_location || "",
          experience_years: j.experience_years || "", is_custom: j.is_custom || false,
        })));
      }
      setLoading(false);
    };
    loadData();
  }, [navigate]);

  const handleSave = async () => {
    if (!userId || !employerId) return;
    setSaving(true);
    // Update employer profile
    const { error } = await supabase.from("employers").update({
      contact_name: contactName, official_email: officialEmail, phone: contactPhone,
      company_name: companyName, company_type: companyType, registration_type: registrationType,
      website, num_employees: numEmployees, address,
      multiple_locations: multipleLocations.length > 0 ? multipleLocations : null,
      description, established_year: establishedYear ? parseInt(establishedYear) : null,
      industry,
    }).eq("id", employerId);

    if (error) { toast.error("Failed to save: " + error.message); setSaving(false); return; }

    // Sync job openings
    await supabase.from("employer_job_openings").delete().eq("employer_id", employerId);
    const validJobs = jobs.filter(j => j.designation.trim());
    if (validJobs.length > 0) {
      await supabase.from("employer_job_openings").insert(
        validJobs.map(j => ({
          employer_id: employerId, user_id: userId, designation: j.designation,
          num_openings: j.num_openings, salary_min: j.salary_min ? parseFloat(j.salary_min) : null,
          salary_max: j.salary_max ? parseFloat(j.salary_max) : null,
          job_description: j.job_description, job_location: j.job_location,
          experience_years: j.experience_years, is_custom: j.is_custom,
        }))
      );
    }
    setSaving(false);
    toast.success("Profile saved!");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const updateJob = useCallback((index: number, field: keyof JobOpening, value: any) => {
    setJobs(prev => prev.map((j, i) => i === index ? { ...j, [field]: value } : j));
  }, []);

  const addLocation = () => {
    if (newLocation.trim()) {
      setMultipleLocations(prev => [...prev, newLocation.trim()]);
      setNewLocation("");
    }
  };

  const completion = (() => {
    let total = 0;
    if (contactName) total++;
    if (officialEmail) total++;
    if (companyName) total++;
    if (companyType) total++;
    if (industry) total++;
    if (address) total++;
    if (website) total++;
    if (description) total++;
    if (jobs.some(j => j.designation.trim())) total++;
    if (establishedYear) total++;
    return Math.round((total / 10) * 100);
  })();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Employer Profile | IAmTalento</title></Helmet>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-card border-b border-border">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-lg font-bold font-display">Employer Profile</h1>
                <p className="text-xs text-muted-foreground">{companyName || "Setup your company"} · {talentaId}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-primary mr-2">{completion}% complete</span>
              <Button size="sm" variant="outline" onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-1" />{saving ? "Saving…" : "Save"}
              </Button>
              <Button size="sm" variant="ghost" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 py-8 flex gap-8">
          {/* Stepper sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <nav className="space-y-1 sticky top-24">
              {STEPS.map((s) => (
                <button key={s.num} onClick={() => s.num !== 1 && setStep(s.num)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                    step === s.num ? "bg-accent text-primary" :
                    s.num === 1 ? "text-muted-foreground/50 cursor-default" :
                    "text-muted-foreground hover:bg-secondary"
                  }`}>
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                    step === s.num ? "bg-primary text-primary-foreground" :
                    s.num === 1 ? "bg-muted text-muted-foreground" :
                    "bg-secondary text-foreground"
                  }`}>
                    {s.num === 1 ? <Check className="h-4 w-4" /> : s.num}
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-tight">{s.label}</p>
                    <p className="text-[10px] text-muted-foreground">{s.desc}</p>
                  </div>
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            {/* Mobile step indicator */}
            <div className="lg:hidden flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
              {STEPS.filter(s => s.num !== 1).map((s) => (
                <button key={s.num} onClick={() => setStep(s.num)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    step === s.num ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  }`}>
                  {s.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }}>

                {step === 2 && (
                  <StepCard title="Authorized Person Details" desc="Who is the primary contact for this account?">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Full Name *" icon={User} value={contactName} onChange={setContactName} placeholder="Contact person name" />
                      <Field label="Official Email *" icon={Mail} value={officialEmail} onChange={setOfficialEmail} placeholder="work@company.com" type="email" />
                      <Field label="Phone" icon={Phone} value={contactPhone} onChange={setContactPhone} placeholder="+91 98765 43210" />
                    </div>
                  </StepCard>
                )}

                {step === 3 && (
                  <StepCard title="Verification" desc="Verify your email and phone number">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className={`p-4 rounded-xl border-2 ${emailVerified ? "border-primary bg-accent" : "border-border"}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Mail className="h-4 w-4 text-primary" />
                          <span className="text-sm font-semibold">Email Verification</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">{officialEmail}</p>
                        {emailVerified ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                            <Check className="h-3 w-3" /> Verified
                          </span>
                        ) : (
                          <Button size="sm" variant="outline" className="text-xs">Send Verification</Button>
                        )}
                      </div>
                      <div className={`p-4 rounded-xl border-2 ${phoneVerified ? "border-primary bg-accent" : "border-border"}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Phone className="h-4 w-4 text-primary" />
                          <span className="text-sm font-semibold">Phone Verification</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">{contactPhone || "Not provided"}</p>
                        {phoneVerified ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                            <Check className="h-3 w-3" /> Verified
                          </span>
                        ) : (
                          <Button size="sm" variant="outline" className="text-xs" disabled={!contactPhone}>Send OTP</Button>
                        )}
                      </div>
                    </div>
                  </StepCard>
                )}

                {step === 4 && (
                  <StepCard title="Company Details" desc="Tell us about your organization">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Company Name *" icon={Building2} value={companyName} onChange={setCompanyName} placeholder="Company name" />
                      <div>
                        <Label className="text-sm font-medium">Company Type</Label>
                        <select value={companyType} onChange={e => setCompanyType(e.target.value)}
                          className="mt-1.5 w-full h-10 rounded-lg border border-input bg-background px-3 text-sm">
                          <option value="">Select type</option>
                          {["Startup", "SME", "Enterprise", "MNC", "Government", "Non-Profit"].map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Registration Type</Label>
                        <select value={registrationType} onChange={e => setRegistrationType(e.target.value)}
                          className="mt-1.5 w-full h-10 rounded-lg border border-input bg-background px-3 text-sm">
                          <option value="">Select type</option>
                          {["Pvt Ltd", "LLP", "Sole Proprietorship", "Partnership", "Public Ltd"].map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                      <Field label="Website" icon={Globe} value={website} onChange={setWebsite} placeholder="https://yourcompany.com" />
                      <div>
                        <Label className="text-sm font-medium">Number of Employees</Label>
                        <select value={numEmployees} onChange={e => setNumEmployees(e.target.value)}
                          className="mt-1.5 w-full h-10 rounded-lg border border-input bg-background px-3 text-sm">
                          <option value="">Select range</option>
                          {["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"].map(r => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>
                      <Field label="Industry *" icon={Factory} value={industry} onChange={setIndustry} placeholder="e.g. Technology, Healthcare" />
                      <Field label="Established Year" icon={Calendar} value={establishedYear} onChange={setEstablishedYear} placeholder="2015" type="number" />
                      <div className="sm:col-span-2">
                        <Field label="Address" icon={MapPin} value={address} onChange={setAddress} placeholder="Registered office address" />
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="text-sm font-medium">Multiple Locations</Label>
                        <div className="flex gap-2 mt-1.5">
                          <Input value={newLocation} onChange={e => setNewLocation(e.target.value)} placeholder="Add a location"
                            onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addLocation())} />
                          <Button type="button" size="sm" variant="outline" onClick={addLocation}><Plus className="h-4 w-4" /></Button>
                        </div>
                        {multipleLocations.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {multipleLocations.map((loc, i) => (
                              <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent text-primary text-xs font-medium">
                                {loc}
                                <button onClick={() => setMultipleLocations(prev => prev.filter((_, idx) => idx !== i))}>
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="text-sm font-medium">Company Description</Label>
                        <Textarea value={description} onChange={e => setDescription(e.target.value)}
                          placeholder="Brief description of your company" className="mt-1.5" rows={3} />
                      </div>
                      {talentaId && (
                        <div className="sm:col-span-2 p-3 rounded-lg bg-accent border border-primary/20">
                          <p className="text-xs text-muted-foreground">Your Unique Employer ID</p>
                          <p className="text-sm font-bold text-primary font-mono">{talentaId}</p>
                        </div>
                      )}
                    </div>
                  </StepCard>
                )}

                {step === 5 && (
                  <StepCard title="Job Openings" desc="Upload your current open positions">
                    <div className="space-y-4">
                      {jobs.filter(j => !j.is_custom).map((job, i) => (
                        <JobCard key={i} job={job} index={i} updateJob={updateJob}
                          onRemove={() => setJobs(prev => prev.filter((_, idx) => idx !== i))} />
                      ))}
                      <Button variant="outline" className="w-full" onClick={() => setJobs(prev => [...prev, emptyJob()])}>
                        <Plus className="h-4 w-4 mr-2" /> Add Position
                      </Button>
                    </div>
                  </StepCard>
                )}

                {step === 6 && (
                  <StepCard title="Customizable Hiring" desc="Add specialized requirements with custom criteria">
                    <div className="space-y-4">
                      {jobs.filter(j => j.is_custom).map((job, i) => {
                        const realIndex = jobs.findIndex(j2 => j2 === job);
                        return (
                          <JobCard key={realIndex} job={job} index={realIndex} updateJob={updateJob}
                            onRemove={() => setJobs(prev => prev.filter((_, idx) => idx !== realIndex))} />
                        );
                      })}
                      <Button variant="outline" className="w-full"
                        onClick={() => setJobs(prev => [...prev, { ...emptyJob(), is_custom: true }])}>
                        <Plus className="h-4 w-4 mr-2" /> Add Custom Position
                      </Button>
                    </div>
                  </StepCard>
                )}

                {step === 7 && (
                  <StepCard title="My Account" desc="Manage your account settings">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="p-4 rounded-xl border border-border hover:border-primary/30 transition-colors cursor-pointer">
                        <h3 className="text-sm font-semibold mb-1">Payment History</h3>
                        <p className="text-xs text-muted-foreground">View all transactions</p>
                      </div>
                      <div className="p-4 rounded-xl border border-border hover:border-primary/30 transition-colors cursor-pointer">
                        <h3 className="text-sm font-semibold mb-1">Edit Profile</h3>
                        <p className="text-xs text-muted-foreground">Update company information</p>
                      </div>
                      <div className="p-4 rounded-xl border border-border hover:border-primary/30 transition-colors cursor-pointer">
                        <h3 className="text-sm font-semibold mb-1">Change Password</h3>
                        <p className="text-xs text-muted-foreground">Update your security credentials</p>
                      </div>
                      <div className="p-4 rounded-xl border border-border hover:border-primary/30 transition-colors cursor-pointer">
                        <h3 className="text-sm font-semibold mb-1">Wallet & Credits</h3>
                        <p className="text-xs text-muted-foreground">Buy packages & check balance</p>
                      </div>
                      <div className="p-4 rounded-xl border border-border hover:border-primary/30 transition-colors cursor-pointer">
                        <h3 className="text-sm font-semibold mb-1">Support</h3>
                        <p className="text-xs text-muted-foreground">Get help from our team</p>
                      </div>
                      <div className="p-4 rounded-xl border border-border hover:border-primary/30 transition-colors cursor-pointer">
                        <h3 className="text-sm font-semibold mb-1">Download Invoices</h3>
                        <p className="text-xs text-muted-foreground">Generate automatic invoices</p>
                      </div>
                    </div>
                  </StepCard>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button variant="outline" disabled={step <= 2} onClick={() => setStep(s => s - 1)}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              {step < 7 ? (
                <Button onClick={() => { handleSave(); setStep(s => s + 1); }}>
                  Save & Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="h-4 w-4 mr-1" /> {saving ? "Saving…" : "Save Profile"}
                </Button>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

// Reusable Field component
const Field = ({ label, icon: Icon, value, onChange, placeholder, type = "text" }: {
  label: string; icon: any; value: string; onChange: (v: string) => void; placeholder: string; type?: string;
}) => (
  <div>
    <Label className="text-sm font-medium">{label}</Label>
    <div className="relative mt-1.5">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="pl-10" />
    </div>
  </div>
);

// Step Card wrapper
const StepCard = ({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) => (
  <div className="bg-card border border-border rounded-2xl p-6">
    <h2 className="text-xl font-bold font-display mb-1">{title}</h2>
    <p className="text-sm text-muted-foreground mb-6">{desc}</p>
    {children}
  </div>
);

// Job opening card
const JobCard = ({ job, index, updateJob, onRemove }: {
  job: JobOpening; index: number; updateJob: (i: number, f: keyof JobOpening, v: any) => void; onRemove: () => void;
}) => (
  <div className="p-4 rounded-xl border border-border space-y-3">
    <div className="flex items-center justify-between">
      <span className="text-sm font-semibold">{job.is_custom ? "Custom" : "Standard"} Position {index + 1}</span>
      <button onClick={onRemove} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
    </div>
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <Label className="text-xs">Designation *</Label>
        <Input value={job.designation} onChange={e => updateJob(index, "designation", e.target.value)} placeholder="e.g. Senior Developer" className="mt-1" />
      </div>
      <div>
        <Label className="text-xs">No. of Openings</Label>
        <Input type="number" value={job.num_openings} onChange={e => updateJob(index, "num_openings", parseInt(e.target.value) || 1)} className="mt-1" />
      </div>
      <div>
        <Label className="text-xs">Salary Min (₹)</Label>
        <Input value={job.salary_min} onChange={e => updateJob(index, "salary_min", e.target.value)} placeholder="300000" className="mt-1" />
      </div>
      <div>
        <Label className="text-xs">Salary Max (₹)</Label>
        <Input value={job.salary_max} onChange={e => updateJob(index, "salary_max", e.target.value)} placeholder="800000" className="mt-1" />
      </div>
      <div>
        <Label className="text-xs">Job Location</Label>
        <Input value={job.job_location} onChange={e => updateJob(index, "job_location", e.target.value)} placeholder="City, Remote, etc." className="mt-1" />
      </div>
      <div>
        <Label className="text-xs">Experience (Years)</Label>
        <Input value={job.experience_years} onChange={e => updateJob(index, "experience_years", e.target.value)} placeholder="2-5" className="mt-1" />
      </div>
      <div className="sm:col-span-2">
        <Label className="text-xs">Job Description</Label>
        <Textarea value={job.job_description} onChange={e => updateJob(index, "job_description", e.target.value)}
          placeholder="Describe the role requirements…" className="mt-1" rows={2} />
      </div>
    </div>
  </div>
);

export default EmployerProfileBuilder;
