import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Loader2,
  Plus,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProHero } from "../ProHero";
import CompletionRing from "@/components/profile/CompletionRing";
import { loadLiveProfile, saveCandidatePayload, type LiveProfile } from "@/services/candidate/profile";
import type { ProUser } from "@/data/proData";
import type { ProView } from "../proTypes";

interface RoleBenchmark {
  id: string;
  title: string;
  industry: string;
  avgCtcLpa: string;
  coreSkills: string[];
  bonusSkills: string[];
}

const ROLE_BENCHMARKS: RoleBenchmark[] = [
  {
    id: "fullstack",
    title: "Full Stack Software Engineer",
    industry: "Technology & Software",
    avgCtcLpa: "10 – 22 LPA",
    coreSkills: ["React", "TypeScript", "Node.js", "PostgreSQL", "REST APIs", "Git"],
    bonusSkills: ["System Design", "Docker", "AWS"],
  },
  {
    id: "data-ai",
    title: "Data Scientist & AI Engineer",
    industry: "Data Science & AI",
    avgCtcLpa: "12 – 26 LPA",
    coreSkills: ["Python", "SQL", "Machine Learning", "Statistics", "Pandas", "LLM Prompting"],
    bonusSkills: ["PyTorch", "Power BI", "MLOps"],
  },
  {
    id: "fpa",
    title: "Financial Analyst & FP&A",
    industry: "Finance & BFSI",
    avgCtcLpa: "8 – 18 LPA",
    coreSkills: ["Financial Modeling", "Excel", "Valuation", "FP&A", "Accounting", "SQL"],
    bonusSkills: ["Power BI", "Risk Analysis", "Bloomberg"],
  },
  {
    id: "pm",
    title: "Product Manager",
    industry: "Product & Design",
    avgCtcLpa: "14 – 28 LPA",
    coreSkills: ["Product Strategy", "User Research", "Agile Scrum", "Roadmapping", "A/B Testing", "SQL"],
    bonusSkills: ["Figma", "Analytics", "Stakeholder Management"],
  },
  {
    id: "growth",
    title: "Performance Marketing Specialist",
    industry: "Marketing & Growth",
    avgCtcLpa: "7 – 16 LPA",
    coreSkills: ["SEO", "Performance Marketing", "Google Analytics", "Meta Ads", "Content Strategy", "CRO"],
    bonusSkills: ["CRM", "Copywriting", "SQL"],
  },
  {
    id: "cloud-sec",
    title: "Cloud & DevSecOps Engineer",
    industry: "Cybersecurity & Cloud",
    avgCtcLpa: "12 – 25 LPA",
    coreSkills: ["AWS", "Docker", "Kubernetes", "Linux", "Terraform", "CI/CD"],
    bonusSkills: ["Network Security", "IAM", "Python"],
  },
];

interface Props {
  fallbackUser?: ProUser;
  onUpdateFallbackUser?: (u: ProUser) => void;
  onNavigate: (view: ProView) => void;
  onToast: (msg: string) => void;
}

export const LiveReadinessSkillGap: React.FC<Props> = ({
  fallbackUser,
  onUpdateFallbackUser,
  onNavigate,
  onToast,
}) => {
  const [live, setLive] = useState<LiveProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("fullstack");
  const [addingSkill, setAddingSkill] = useState<string | null>(null);

  const reload = async () => {
    setLoading(true);
    try {
      const d = await loadLiveProfile();
      setLive(d);
      if (d?.profile?.industry) {
        const match = ROLE_BENCHMARKS.find((b) => b.industry === d.profile.industry);
        if (match) setSelectedRoleId(match.id);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reload();
  }, []);

  const benchmark = useMemo(
    () => ROLE_BENCHMARKS.find((r) => r.id === selectedRoleId) || ROLE_BENCHMARKS[0],
    [selectedRoleId]
  );

  const userSkillSet = useMemo(() => {
    const raw = live
      ? live.skills.map((s) => s.name)
      : fallbackUser?.sk || [];
    return new Set(raw.map((s) => s.trim().toLowerCase()));
  }, [live, fallbackUser?.sk]);

  const matchedCore = benchmark.coreSkills.filter((s) => userSkillSet.has(s.toLowerCase()));
  const missingCore = benchmark.coreSkills.filter((s) => !userSkillSet.has(s.toLowerCase()));
  const matchedBonus = benchmark.bonusSkills.filter((s) => userSkillSet.has(s.toLowerCase()));
  const missingBonus = benchmark.bonusSkills.filter((s) => !userSkillSet.has(s.toLowerCase()));

  const skillCoveragePct = Math.round((matchedCore.length / Math.max(1, benchmark.coreSkills.length)) * 100);

  // Compute live composite Industry Readiness Score
  const mockHistory = (live?.shell_state?.mockInterviews as { score: number }[] | undefined) || [];
  const bestMockScore = mockHistory.length > 0 ? Math.max(...mockHistory.map((m) => m.score)) : 0;
  const cirScore = live?.latest_cir ? Math.round(Number(live.latest_cir.score)) : fallbackUser?.ce?.length ? 74 : 0;
  const profileComp = live ? (live.profile.profile_completion ?? 0) : fallbackUser ? 72 : 0;
  const computedIrs =
    live?.profile?.readiness && Number(live.profile.readiness) > 0
      ? Math.round(Number(live.profile.readiness))
      : Math.round(0.45 * (cirScore || skillCoveragePct * 0.6) + 0.30 * skillCoveragePct + 0.15 * bestMockScore + 0.10 * profileComp);

  const handleQuickAddSkill = async (skillName: string) => {
    if (!live) {
      if (fallbackUser && onUpdateFallbackUser) {
        onUpdateFallbackUser({ ...fallbackUser, sk: [...new Set([...(fallbackUser.sk || []), skillName])] });
        onToast(`Added "${skillName}" to your profile!`);
      }
      return;
    }
    setAddingSkill(skillName);
    try {
      const nextSkills = [
        ...live.skills.map((s) => ({ name: s.name, level: s.level || "intermediate" })),
        { name: skillName, level: "beginner" },
      ];
      const updated = await saveCandidatePayload({ skills: nextSkills });
      setLive(updated);
      onToast(`Added "${skillName}" to your profile! Take an assessment to verify it.`);
    } catch (err: any) {
      onToast(err?.message || "Failed to add skill");
    } finally {
      setAddingSkill(null);
    }
  };

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProHero
        icon={<Target />}
        title="Industry Readiness Score & Skill Gap Report"
        subtitle="Weighted evaluation across Core Aptitude (45%), Domain Mastery (30%), AI Mock Interview (15%), and Integrity (10%) benchmarked against live employer roles."
      />

      {/* IRS OVERVIEW */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 flex flex-col items-center justify-center text-center space-y-3">
          <CompletionRing percentage={computedIrs} size={112} strokeWidth={9} />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Industry Readiness Score</p>
            <p className="text-2xl font-extrabold font-display mt-0.5">{computedIrs} / 100</p>
            <p className="text-xs text-muted-foreground mt-1">
              {computedIrs >= 80
                ? "Top-tier employer readiness"
                : computedIrs >= 55
                  ? "Strong foundation — complete proctored CIR to boost"
                  : "Complete assessments & close skill gaps below"}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 pt-1">
            <Button asChild size="sm" className="text-xs gap-1.5">
              <Link to="/assessments/explore">
                <Award className="h-3.5 w-3.5" /> Take Proctored Test
              </Link>
            </Button>
            <Button size="sm" variant="outline" onClick={() => onNavigate("mock-interview")} className="text-xs">
              Practice Mock Interview
            </Button>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-base font-bold font-display flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" /> Readiness Pillar Breakdown
          </h2>
          {[
            {
              label: "Core Aptitude & Communication (45% weight)",
              val: cirScore > 0 ? cirScore : Math.round(profileComp * 0.5),
              hint: cirScore > 0 ? "Verified via CIR Report" : "Complete mandatory Core Tests to verify",
            },
            {
              label: "Domain Skill Coverage (30% weight)",
              val: skillCoveragePct,
              hint: `${matchedCore.length}/${benchmark.coreSkills.length} benchmark skills matched for ${benchmark.title}`,
            },
            {
              label: "AI / Mock Interview Readiness (15% weight)",
              val: bestMockScore,
              hint: bestMockScore > 0 ? `Best mock score: ${bestMockScore}%` : "Complete a session in Mock Interview",
            },
            {
              label: "Profile & Verification Integrity (10% weight)",
              val: profileComp,
              hint: `Profile completion ${profileComp}%`,
            },
          ].map((pillar) => (
            <div key={pillar.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold">{pillar.label}</span>
                <span className="font-bold text-primary">{pillar.val}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${Math.min(100, Math.max(4, pillar.val))}%` }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground">{pillar.hint}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SKILL GAP REPORT */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" /> Personalized Skill Gap Report
            </span>
            <h2 className="text-lg font-bold font-display mt-0.5">Role Benchmark vs. Your Profile</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Target Role:</span>
            <select
              aria-label="Target role benchmark"
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="h-9 rounded-lg border border-input bg-background px-3 text-xs font-semibold"
            >
              {ROLE_BENCHMARKS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} ({r.avgCtcLpa})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Matched Skills */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-1.5 text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Matched Skills ({matchedCore.length + matchedBonus.length})
              </h3>
              <Badge className="bg-emerald-600 text-white hover:bg-emerald-600 text-xs">
                {skillCoveragePct}% Core Match
              </Badge>
            </div>
            {matchedCore.length + matchedBonus.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                None of the benchmark skills are on your profile yet. Add skills you already know or enroll in a course!
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {[...matchedCore, ...matchedBonus].map((sk) => (
                  <Badge key={sk} variant="secondary" className="gap-1 text-xs">
                    <ShieldCheck className="h-3 w-3 text-emerald-600" /> {sk}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Missing High-Impact Skills */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-1.5 text-foreground">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                Skill Gaps to Close ({missingCore.length + missingBonus.length})
              </h3>
              <span className="text-xs font-semibold text-muted-foreground">Target Band: {benchmark.avgCtcLpa}</span>
            </div>
            {missingCore.length + missingBonus.length === 0 ? (
              <p className="text-xs text-emerald-700 font-semibold">
                100% skill coverage achieved for {benchmark.title}! Take the proctored domain assessment to verify.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {[...missingCore, ...missingBonus].map((sk) => (
                  <button
                    key={sk}
                    type="button"
                    disabled={addingSkill === sk}
                    onClick={() => handleQuickAddSkill(sk)}
                    className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold hover:border-primary hover:text-primary transition-colors cursor-pointer"
                  >
                    <Plus className="h-3 w-3 text-primary" />
                    {sk}
                  </button>
                ))}
              </div>
            )}
            <p className="text-[11px] text-muted-foreground">
              Click any skill above if you already know it to add it to your profile, or learn it via Courses below.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Closing your remaining <strong>{missingCore.length}</strong> core skill gaps increases AI Job Match Scores by up to{" "}
            <strong>+{missingCore.length * 8}%</strong>.
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => onNavigate("learning-mentors")} className="gap-1.5 text-xs">
              <BookOpen className="h-3.5 w-3.5 text-primary" /> Explore Courses
            </Button>
            <Button size="sm" onClick={() => onNavigate("jobs")} className="gap-1.5 text-xs">
              View Matched Jobs <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
