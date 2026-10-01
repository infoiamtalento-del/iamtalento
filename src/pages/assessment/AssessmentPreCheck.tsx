import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Camera, Mic, Wifi, Globe, Maximize, Fingerprint, Check, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAssessment } from "@/data/assessments";

const CHECKS = [
  { id: "camera", icon: Camera, label: "Camera", hint: "Face visible and well lit" },
  { id: "mic", icon: Mic, label: "Microphone", hint: "Ambient audio monitoring" },
  { id: "internet", icon: Wifi, label: "Internet connection", hint: "Stable connection required" },
  { id: "browser", icon: Globe, label: "Browser compatibility", hint: "Supported browser detected" },
  { id: "fullscreen", icon: Maximize, label: "Full-screen mode", hint: "Session runs locked" },
  { id: "identity", icon: Fingerprint, label: "Identity verification", hint: "Face match completed" },
];

const AssessmentPreCheck = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const a = getAssessment(assessmentId);
  const [done, setDone] = useState(0);

  useEffect(() => {
    if (done >= CHECKS.length) return;
    const t = setTimeout(() => setDone((d) => d + 1), 700);
    return () => clearTimeout(t);
  }, [done]);

  if (!a) {
    return (
      <div className="container py-24 text-center">
        <p className="mb-4">Assessment not found.</p>
        <Button asChild><Link to="/assessments/explore">Back to assessments</Link></Button>
      </div>
    );
  }

  const ready = done >= CHECKS.length;
  const progress = Math.round((done / CHECKS.length) * 100);

  return (
    <>
      <Helmet>
        <title>Pre-test checks — {a.title}</title>
      </Helmet>
      <div className="min-h-screen bg-secondary/40 flex items-center justify-center p-5">
        <div className="w-full max-w-2xl rounded-2xl border border-border bg-background p-7 md:p-9">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">{a.title}</p>
          <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">Let's Get You Ready</h1>
          <p className="text-muted-foreground text-sm mb-6">
            We're checking your device and environment before the assessment starts.
          </p>

          <div className="h-1.5 w-full rounded-full bg-secondary mb-6 overflow-hidden">
            <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>

          <ul className="space-y-2.5 mb-7">
            {CHECKS.map((c, i) => {
              const state = i < done ? "ready" : i === done ? "checking" : "pending";
              return (
                <li
                  key={c.id}
                  className={`flex items-center gap-3 rounded-xl border p-3.5 transition-colors ${
                    state === "ready" ? "border-primary/30 bg-primary/5" : "border-border"
                  }`}
                >
                  <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    <c.icon className="h-4 w-4 text-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{c.label}</p>
                    <p className="text-xs text-muted-foreground">{c.hint}</p>
                  </div>
                  {state === "ready" && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-primary">
                      <Check className="h-4 w-4" /> Ready
                    </span>
                  )}
                  {state === "checking" && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" /> Checking...
                    </span>
                  )}
                  {state === "pending" && <span className="text-xs text-muted-foreground">Waiting</span>}
                </li>
              );
            })}
          </ul>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1 gap-2" disabled={!ready} onClick={() => navigate(`/assessments/${a.id}/test`)}>
              Continue to Assessment <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" asChild>
              <Link to={`/assessments/${a.id}`}>Cancel</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssessmentPreCheck;
