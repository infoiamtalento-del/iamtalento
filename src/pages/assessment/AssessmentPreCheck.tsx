import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getAssessment } from "@/data/assessments";
import { ProctoringPreCheckGate } from "@/components/proctoring/ProctoringPreCheckGate";
import { currentUserId, db } from "@/services/db";

const AssessmentPreCheck = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const a = getAssessment(assessmentId);
  const [checkingLive, setCheckingLive] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const uid = await currentUserId();
        if (uid && assessmentId) {
          const { data } = await db
            .from("assessments_catalog")
            .select("id")
            .eq("slug", assessmentId)
            .eq("kind", "domain")
            .eq("is_active", true)
            .maybeSingle();
          if (alive && data) {
            // LiveAssessmentJourney handles checkout + per-attempt 6-Layer PreCheckGate directly
            navigate(`/assessments/${assessmentId}/test`, { replace: true });
            return;
          }
        }
      } catch {
        // Proceed with local 6-layer precheck gate
      }
      if (alive) setCheckingLive(false);
    })();
    return () => {
      alive = false;
    };
  }, [assessmentId, navigate]);

  if (!a) {
    return (
      <div className="container py-24 text-center">
        <p className="mb-4">Assessment not found.</p>
        <Button asChild>
          <Link to="/assessments/explore">Back to assessments</Link>
        </Button>
      </div>
    );
  }

  if (checkingLive) {
    return <div className="min-h-screen bg-[#FBF4EB]/40" />;
  }

  return (
    <>
      <Helmet>
        <title>30-Layer Pre-Assessment Verification | {a.title}</title>
      </Helmet>
      <ProctoringPreCheckGate
        attemptId={`local-${a.id}`}
        assessmentTitle={a.title}
        onComplete={(data) => {
          try {
            sessionStorage.setItem(`proctor-precheck-${a.id}`, JSON.stringify(data));
          } catch {
            // Ignore session storage errors
          }
          navigate(`/assessments/${a.id}/test`);
        }}
        onCancel={() => navigate(`/assessments/${a.id}`)}
      />
    </>
  );
};

export default AssessmentPreCheck;
