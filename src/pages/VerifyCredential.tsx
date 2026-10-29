import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { BadgeCheck, ShieldAlert, Loader2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { verifyCredential, type VerifiedCredential } from "@/services/candidate/assessments";

/** Public page behind the QR code on a Digital Skill Passport. */
const VerifyCredential = () => {
  const { token } = useParams();
  const [cred, setCred] = useState<VerifiedCredential | null | undefined>(undefined);

  useEffect(() => {
    if (!token) return setCred(null);
    verifyCredential(token).then(setCred).catch(() => setCred(null));
  }, [token]);

  return (
    <Layout>
      <Helmet><title>Verify credential | IAmTalento</title></Helmet>
      <section className="container pt-32 pb-24 max-w-xl">
        {cred === undefined ? (
          <div className="text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>
        ) : !cred ? (
          <div className="rounded-2xl border border-border p-8 text-center">
            <ShieldAlert className="h-10 w-10 text-destructive mx-auto mb-3" />
            <h1 className="font-display text-2xl font-bold mb-2">Credential not found</h1>
            <p className="text-sm text-muted-foreground mb-5">This link is invalid or the credential was never issued by IAmTalento.</p>
            <Button asChild><Link to="/">Go home</Link></Button>
          </div>
        ) : (
          <div className="rounded-2xl border border-border p-8">
            <div className="flex items-center gap-3 mb-5">
              {cred.valid ? <BadgeCheck className="h-9 w-9 text-primary" /> : <ShieldAlert className="h-9 w-9 text-destructive" />}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary">{cred.valid ? "Verified credential" : "Expired or revoked"}</p>
                <h1 className="font-display text-2xl font-bold">{cred.holder_name || "IAmTalento candidate"}</h1>
              </div>
            </div>
            <dl className="text-sm divide-y divide-border">
              {[["Domain", cred.domain], ["Composite score", `${cred.composite_score}`], ["Tier", cred.tier],
                ["Integrity", `${Math.round(Number(cred.integrity_score))}%`],
                ["Issued", new Date(cred.issued_at).toLocaleDateString("en-IN")],
                ["Valid until", new Date(cred.expires_at).toLocaleDateString("en-IN")],
                ["Cryptographic signature", cred.signed ? "Signed (Ed25519)" : "Pending"]].map(([l, v]) => (
                <div key={l} className="flex justify-between py-2.5"><dt className="text-muted-foreground">{l}</dt><dd className="font-semibold">{v}</dd></div>
              ))}
            </dl>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default VerifyCredential;
