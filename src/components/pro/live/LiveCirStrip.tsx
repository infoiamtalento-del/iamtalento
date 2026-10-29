import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, ExternalLink, Copy, Check, Play, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAsync } from "@/hooks/useAsync";
import {
  fetchCatalog,
  fetchMyCirReports,
  fetchMyVerifiableCredentials,
} from "@/services/candidate/assessments";

const inr = (n: number) => (Number(n) === 0 ? "Free" : "₹" + Number(n).toLocaleString("en-IN"));

export const LiveCirStrip: React.FC = () => {
  const catalog = useAsync(() => fetchCatalog());
  const reports = useAsync(fetchMyCirReports);
  const creds = useAsync(fetchMyVerifiableCredentials);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const coreTests = (catalog.data ?? []).filter((c) => c.kind === "core");
  const domainTests = (catalog.data ?? []).filter((c) => c.kind === "domain");

  const credForReport = (reportId: string) =>
    creds.data?.find((c) => c.cir_report_id === reportId && !c.revoked_at);

  const copyVerifyLink = async (token: string) => {
    const url = `${window.location.origin}/verify/${token}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <section className="rounded-2xl border-2 border-primary/25 bg-card p-5 space-y-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" /> Live Proctored Assessment Journeys &amp; Verifiable CIR
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Every journey completes {coreTests.length || 4} mandatory core assessments first, followed by 1 selected domain-specific test to issue a signed CIR credential.
          </p>
        </div>
      </div>

      {/* Mandatory Core Sequence + Selectable Domain Journeys */}
      <div className="space-y-3">
        {coreTests.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-foreground">Mandatory Core Sequence:</span>
            {coreTests.map((c, idx) => (
              <Badge key={c.id} variant="secondary" className="font-medium">
                {idx + 1}. {c.title}
              </Badge>
            ))}
          </div>
        )}

        {domainTests.length > 0 && (
          <div className="grid gap-3 md:grid-cols-2">
            {domainTests.map((d) => (
              <div key={d.id} className="rounded-xl border border-border p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                    Domain Track · {d.difficulty} · {inr(d.price_inr)}
                  </p>
                  <h3 className="text-sm font-bold truncate">{d.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    4 Core Tests + {d.duration_minutes}m Domain Exam · 28-Layer Proctored
                  </p>
                </div>
                <Button asChild size="sm" className="shrink-0 gap-1.5">
                  <Link to={`/assessments/${d.slug}/test`}>
                    <Play className="h-3.5 w-3.5" /> Start
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Earned Live CIR Reports & Public Verification Links */}
      {(reports.data?.length ?? 0) > 0 && (
        <div className="pt-4 border-t border-border space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-primary" /> Your Issued CIR Reports &amp; Verifiable Credentials ({reports.data!.length})
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {reports.data!.map((r) => {
              const cred = credForReport(r.id);
              return (
                <div key={r.id} className="rounded-xl bg-muted/50 border border-border px-4 py-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <p className="font-bold text-sm text-foreground">
                      CIR {Math.round(Number(r.composite_score))}/100 · <span className="text-primary">{r.tier || "Verified"}</span>
                    </p>
                    <p className="text-muted-foreground mt-0.5">
                      Integrity {Math.round(Number(r.integrity_score ?? 100))}% · Issued {new Date(r.generated_at).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  {cred && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => copyVerifyLink(cred.verify_token)}
                        className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                      >
                        {copiedToken === cred.verify_token ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        {copiedToken === cred.verify_token ? "Copied" : "Copy Link"}
                      </button>
                      <Link
                        to={`/verify/${cred.verify_token}`}
                        className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                      >
                        Verify <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
