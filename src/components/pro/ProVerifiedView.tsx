import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Phone,
  Building2,
  FileCheck,
  Award,
  ChevronRight,
  Download,
  Printer,
  Sparkles,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ProUser, ProJob } from "@/data/proData";
import { ProView, ProDrawerState } from "./proTypes";

interface ProVerifiedViewProps {
  user: ProUser;
  jobs: ProJob[];
  onNavigate: (view: ProView) => void;
  onUpdateUser: (updatedUser: ProUser) => void;
  onOpenDrawer: (drawer: ProDrawerState) => void;
  onToast: (msg: string) => void;
}

export const ProVerifiedView: React.FC<ProVerifiedViewProps> = ({
  user,
  jobs,
  onNavigate,
  onUpdateUser,
  onOpenDrawer,
  onToast,
}) => {
  const isEmployer = user.role === "employer";
  const [phoneNumber, setPhoneNumber] = useState(user.ph || "");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [gstinInput, setGstinInput] = useState(user.gst || "");

  const GST_REGEX = /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

  // Check items calculation
  const bestAssessment = Math.max(0, ...Object.values(user.as || {}));
  const myJobs = jobs.filter((j) => j.by === user.email);

  const checks = isEmployer
    ? [
        { title: "Corporate email confirmed", done: true, sub: user.email },
        {
          title: "Authorized mobile verified",
          done: !!user.phv,
          sub: user.phv ? `+91 ${user.ph}` : "Verify mobile number below",
        },
        {
          title: "Company profile complete",
          done: !!(user.cp?.about && user.cp?.hq),
          sub: user.cp?.about ? "100% complete" : "Add details in Company Profile",
          nav: "cp" as ProView,
        },
        {
          title: "Official website linked",
          done: !!user.cp?.site,
          sub: user.cp?.site || "Add in Company Profile",
          nav: "cp" as ProView,
        },
        {
          title: "Posted at least one verified job",
          done: myJobs.length > 0,
          sub: `${myJobs.length} active job(s) posted`,
          nav: "post" as ProView,
        },
        {
          title: "GSTIN / Business registration",
          done: GST_REGEX.test(user.gst || ""),
          sub: user.gst || "Add official GSTIN below",
        },
      ]
    : [
        { title: "Primary email confirmed", done: true, sub: user.email },
        {
          title: "Mobile phone verified",
          done: !!user.phv,
          sub: user.phv ? `+91 ${user.ph}` : "Verify mobile number below",
        },
        {
          title: "Profile summary & headline added",
          done: !!(user.head && user.about),
          sub: user.head ? "Complete" : "Add in My Profile",
          nav: "profile" as ProView,
        },
        {
          title: "Passed a proctored assessment (60%+)",
          done: bestAssessment >= 60,
          sub: bestAssessment ? `Top score: ${bestAssessment}%` : "Take an assessment in Certifications",
          nav: "cert" as ProView,
        },
        {
          title: "Added certification or project",
          done: (user.ce || []).length + (user.pj || []).length > 0,
          sub: "Verified credentials present",
          nav: "cert" as ProView,
        },
      ];

  const doneCount = checks.filter((c) => c.done).length;
  const isAllReady = doneCount === checks.length;
  const isVerified = !!user.vr || isAllReady;

  const handleSendOtp = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      onToast("Please enter a valid 10-digit mobile number");
      return;
    }
    setOtpSent(true);
    onToast("Demo OTP sent! Enter 123456 to verify.");
  };

  const handleVerifyOtp = () => {
    if (phoneOtp !== "123456") {
      onToast("Demo OTP is 123456");
      return;
    }
    onUpdateUser({ ...user, ph: phoneNumber, phv: true });
    setOtpSent(false);
    onToast("Mobile number successfully verified!");
  };

  const handleSaveGst = () => {
    if (!GST_REGEX.test(gstinInput.toUpperCase())) {
      onToast("Please enter a valid 15-character Indian GSTIN (e.g. 29ABCDE1234F1Z5)");
      return;
    }
    onUpdateUser({ ...user, gst: gstinInput.toUpperCase() });
    onToast("GSTIN successfully registered and verified!");
  };

  return (
    <div className="space-y-6">
      {/* Header Hero */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Identity & Skill Verification Hub
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-display">
              {isEmployer ? "Verified Employer Program" : "Talento Pro Verified Badge"}
            </h1>
            <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
              {isEmployer
                ? "Verified companies receive 3.5x more qualified applicants and priority ranking across talent discovery."
                : "Earn the verified candidate shield to guarantee recruiters that your identity, contact information, and skill claims are authentic."}
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs font-medium text-muted-foreground block">Verification Status</span>
            <div className="text-xl font-bold text-foreground font-display flex items-center gap-1.5 justify-end">
              <ShieldCheck className={cn("w-5 h-5", isVerified ? "text-emerald-500" : "text-muted-foreground")} />
              {isVerified ? "Fully Verified" : `${doneCount} of ${checks.length} Complete`}
            </div>
          </div>
        </div>
      </div>

      {/* Verification Certificate Card when Complete */}
      {isVerified && (
        <div className="bg-card border border-emerald-500/40 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground font-display">
                  {isEmployer ? "Corporate Verification Certificate Active" : "Talento Pro Verified Credential Active"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Verified ID: <b>TLN-{Math.floor(100000 + Math.random() * 900000)}</b> • Validated by Proctored Systems
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl text-xs gap-1.5 bg-background"
                onClick={() => onOpenDrawer({ type: "certificate", key: "verified" })}
              >
                <Download className="w-3.5 h-3.5" /> View Certificate
              </Button>
              <Button
                size="sm"
                className="rounded-xl text-xs gap-1.5"
                onClick={() => window.print()}
              >
                <Printer className="w-3.5 h-3.5" /> Print Credential
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Checklist Progress */}
      <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground text-base">Required Verification Checks</h3>
          <span className="text-xs font-bold text-primary">{Math.round((doneCount / checks.length) * 100)}% Complete</span>
        </div>

        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${(doneCount / checks.length) * 100}%` }}
          />
        </div>

        <div className="divide-y divide-border/60">
          {checks.map((chk, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0",
                    chk.done
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">{chk.title}</div>
                  <div className="text-muted-foreground text-[11px]">{chk.sub}</div>
                </div>
              </div>

              {!chk.done && chk.nav && (
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl text-xs h-7 px-2.5 bg-background"
                  onClick={() => onNavigate(chk.nav!)}
                >
                  Complete <ChevronRight className="w-3 h-3 ml-0.5" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Verification Forms (Mobile & GST) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Mobile Verification Form */}
        {!user.phv && (
          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" /> Mobile Phone Verification
            </h3>
            <p className="text-xs text-muted-foreground">
              Enter your 10-digit mobile number to receive a verification OTP.
            </p>

            <div className="flex items-center gap-2">
              <Input
                placeholder="9876543210"
                maxLength={10}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="text-xs h-9"
              />
              <Button
                size="sm"
                onClick={handleSendOtp}
                className="rounded-xl text-xs h-9 shrink-0"
              >
                Send OTP
              </Button>
            </div>

            {otpSent && (
              <div className="pt-2 space-y-2 border-t border-border/60">
                <label className="text-xs font-medium text-foreground block">
                  Enter 6-digit OTP (Demo: <b>123456</b>)
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="123456"
                    maxLength={6}
                    value={phoneOtp}
                    onChange={(e) => setPhoneOtp(e.target.value)}
                    className="text-xs h-9 text-center font-bold tracking-widest"
                  />
                  <Button
                    size="sm"
                    onClick={handleVerifyOtp}
                    className="rounded-xl text-xs h-9 shrink-0"
                  >
                    Confirm OTP
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* GSTIN Verification Form (Employer only) */}
        {isEmployer && !GST_REGEX.test(user.gst || "") && (
          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" /> GSTIN Corporate Registration
            </h3>
            <p className="text-xs text-muted-foreground">
              Enter your corporate 15-character GST identification number for automated business registration verification.
            </p>

            <div className="flex items-center gap-2">
              <Input
                placeholder="29ABCDE1234F1Z5"
                maxLength={15}
                value={gstinInput}
                onChange={(e) => setGstinInput(e.target.value)}
                className="text-xs h-9 uppercase font-mono"
              />
              <Button
                size="sm"
                onClick={handleSaveGst}
                className="rounded-xl text-xs h-9 shrink-0"
              >
                Verify GSTIN
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
