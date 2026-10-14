import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatINR, type ProUser } from "@/data/proData";
import type { ProView } from "./proTypes";
import { employerMenuItems } from "./employerMenu";

interface Props { view: ProView; user: ProUser; onNavigate: (view: ProView) => void; onOpenReceipt: (id: string) => void }

export function ProEmployerAccountView({ view, user, onNavigate, onOpenReceipt }: Props) {
  const entry = employerMenuItems.find(item => item.id === view);
  if (!entry) return null;
  const Icon = entry.icon;
  return (
    <section className="space-y-8">
      <header className="flex items-center gap-4 border-b border-border pb-6">
        <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="h-6 w-6" /></span>
        <div><p className="text-xs text-muted-foreground mb-1">Employer account</p><h1 className="font-display text-2xl font-bold text-foreground">{entry.label}</h1></div>
      </header>
      {(view === "account" || view === "settings") && (
        <div className="space-y-6">
          <dl className="grid gap-6 sm:grid-cols-2">
            <div><dt className="text-xs text-muted-foreground mb-2">Account name</dt><dd className="font-semibold text-foreground">{user.name}</dd></div>
            <div><dt className="text-xs text-muted-foreground mb-2">Email address</dt><dd className="text-sm break-all text-foreground">{user.email}</dd></div>
            <div><dt className="text-xs text-muted-foreground mb-2">Account type</dt><dd className="text-sm text-foreground">Employer</dd></div>
          </dl>
          <Button onClick={() => onNavigate("cp")}>Edit Company Profile<ArrowRight /></Button>
          {view === "account" && <Button variant="outline" className="ml-3" onClick={() => onNavigate("dash")}>Hiring Overview<ArrowRight /></Button>}
        </div>
      )}
      {view === "employer-assessments" && <div className="space-y-4"><h2 className="font-display text-lg font-semibold">Assessment Library</h2><p className="text-sm text-muted-foreground">Browse role-specific skill assessments.</p><Button asChild><Link to="/assessments/explore">Explore Assessments<ArrowRight /></Link></Button></div>}
      {view === "interviews" && <div className="space-y-4"><h2 className="font-display text-lg font-semibold">Interview Scheduling</h2><p className="text-sm text-muted-foreground">Select an applicant to schedule an interview. Automated AI interviews are not enabled yet.</p><Button onClick={() => onNavigate("pipe")}>View Job Applications<ArrowRight /></Button></div>}
      {view === "advertise" && <div className="space-y-4"><h2 className="font-display text-lg font-semibold">Promote Your Company</h2><p className="text-sm text-muted-foreground">No advertising campaigns yet. Contact support for advertising enquiries.</p><Button onClick={() => onNavigate("support")}>Contact Support<ArrowRight /></Button></div>}
      {view === "subscription" && <div className="space-y-4"><h2 className="font-display text-lg font-semibold">Employer Plans</h2><p className="text-sm text-muted-foreground">No active subscription is connected to this demo account.</p><Button asChild><Link to="/pricing?tab=employers">Explore Pricing<ArrowRight /></Link></Button></div>}
      {view === "payment-history" && <div className="divide-y divide-border">
        {(user.wal?.hist || []).length === 0 && <p className="text-sm text-muted-foreground">No payments recorded yet.</p>}
        {(user.wal?.hist || []).map(tx => <div key={tx.id} className="flex flex-wrap items-center justify-between gap-4 py-5">
          <div className="min-w-0"><p className="font-semibold text-sm text-foreground">{tx.desc}</p><p className="mt-1 text-xs text-muted-foreground">{new Date(tx.at).toLocaleDateString("en-GB")} · {tx.via} · {tx.id}</p></div>
          <div className="flex items-center gap-4"><span className="text-sm font-semibold text-foreground">{formatINR(tx.amt)}</span><Button variant="outline" size="sm" onClick={() => onOpenReceipt(tx.id)}>View Receipt</Button></div>
        </div>)}
      </div>}
    </section>
  );
}