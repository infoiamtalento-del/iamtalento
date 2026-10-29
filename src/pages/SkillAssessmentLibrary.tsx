import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  CircleCheck,
  Clock3,
  FileSearch,
  Fingerprint,
  Library,
  Search,
  ShieldCheck,
  Star,
  Users,
  X,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import "./SkillAssessmentLibrary.css";

interface AssessmentPreview {
  id: string;
  title: string;
  category: string;
  level: "Foundational" | "Intermediate" | "Advanced";
  minutes: number;
  rating: number;
  skills: string[];
  question: string;
}

const assessmentPreviews: AssessmentPreview[] = [
  {
    id: "frontend",
    title: "Frontend Developer",
    category: "Engineering",
    level: "Intermediate",
    minutes: 45,
    rating: 4.8,
    skills: ["JavaScript", "React", "Accessibility"],
    question:
      "A search component makes a request on every keystroke. How would you reduce unnecessary requests and prevent stale results from appearing?",
  },
  {
    id: "python",
    title: "Python Developer",
    category: "Engineering",
    level: "Intermediate",
    minutes: 40,
    rating: 4.7,
    skills: ["Python", "APIs", "Debugging"],
    question:
      "An API processes the same payment webhook twice. Explain how you would make the handler safe to retry.",
  },
  {
    id: "data",
    title: "Data Analyst",
    category: "Data & AI",
    level: "Intermediate",
    minutes: 40,
    rating: 4.6,
    skills: ["SQL", "Data interpretation", "Excel"],
    question:
      "Sales increased while profit fell. Which metrics would you investigate first, and how would you validate your explanation?",
  },
  {
    id: "ai",
    title: "AI / ML Engineer",
    category: "Data & AI",
    level: "Advanced",
    minutes: 50,
    rating: 4.9,
    skills: ["Model evaluation", "Python", "Applied ML"],
    question:
      "A classifier scores well offline but performs poorly after deployment. Outline your investigation and the evidence you would collect.",
  },
  {
    id: "marketing",
    title: "Digital Marketing Specialist",
    category: "Business",
    level: "Intermediate",
    minutes: 35,
    rating: 4.5,
    skills: ["SEO", "Campaign strategy", "Analytics"],
    question:
      "A campaign has high click-through rates but low conversions. How would you diagnose the funnel before changing the budget?",
  },
  {
    id: "sales",
    title: "Sales Executive",
    category: "Business",
    level: "Foundational",
    minutes: 30,
    rating: 4.4,
    skills: ["Discovery", "Objection handling", "CRM"],
    question:
      "A prospect says your offer is too expensive. Write three discovery questions before proposing a discount.",
  },
  {
    id: "design",
    title: "UX / UI Designer",
    category: "Design",
    level: "Intermediate",
    minutes: 40,
    rating: 4.7,
    skills: ["User research", "Interaction design", "Usability"],
    question:
      "Users abandon an application form halfway through. Describe a research plan and the design changes you would test.",
  },
  {
    id: "hr",
    title: "HR Generalist",
    category: "People & Operations",
    level: "Intermediate",
    minutes: 35,
    rating: 4.3,
    skills: ["Hiring", "Employee relations", "HR operations"],
    question:
      "Two managers disagree about a candidate. How would you establish a consistent, evidence-based decision process?",
  },
  {
    id: "operations",
    title: "Operations Associate",
    category: "People & Operations",
    level: "Foundational",
    minutes: 30,
    rating: 4.5,
    skills: ["Prioritisation", "Process improvement", "Problem solving"],
    question:
      "Three urgent requests arrive with the same deadline. Explain how you would prioritise and communicate your decisions.",
  },
];

const roleCategories = [
  "All roles",
  "Engineering",
  "Data & AI",
  "Business",
  "Design",
  "People & Operations",
];

function filterAssessments(query: string, category: string) {
  const normalized = query.trim().toLowerCase();
  return assessmentPreviews.filter(
    (item) =>
      (category === "All roles" || item.category === category) &&
      [item.title, ...item.skills].join(" ").toLowerCase().includes(normalized),
  );
}

const pageDescription =
  "Ready-made, proctored tests for every role, with detailed reports that let you shortlist on demonstrated ability instead of resumes.";

const sampleSkillScores = [
  { name: "JavaScript", score: 90 },
  { name: "React", score: 85 },
  { name: "Accessibility", score: 75 },
];

const hiringSteps = [
  {
    icon: Library,
    title: "Pick the skills that matter.",
    text: "Choose a role-focused test aligned to the work your next hire will do.",
  },
  {
    icon: Users,
    title: "Give everyone the same stage.",
    text: "Use a consistent assessment and review proctoring signals alongside the results.",
  },
  {
    icon: FileSearch,
    title: "Bring evidence to the shortlist.",
    text: "Review strengths, skill gaps and responses before deciding who moves forward.",
  },
];

export default function SkillAssessmentLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All roles");
  const [selectedLevel, setSelectedLevel] = useState("All levels");
  const [previewTest, setPreviewTest] = useState<AssessmentPreview | null>(null);
  const [sampleReportOpen, setSampleReportOpen] = useState(false);

  const filtered = filterAssessments(searchQuery, selectedCategory).filter(
    (item) => selectedLevel === "All levels" || item.level === selectedLevel,
  );

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All roles");
    setSelectedLevel("All levels");
  };

  return (
    <>
      <Helmet>
        <title>Skill Assessment Library for Employers | TalentCIR</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content="Skill Assessment Library | TalentCIR" />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <Layout>
        <div className="assessment-library bg-background pt-20">
          {/* Hero */}
          <section className="sal-hero bg-background">
            <div className="container sal-hero-grid">
              <div className="sal-hero-copy">
                <p className="sal-eyebrow text-primary">
                  <span className="sal-eyebrow-dot" />
                  TalentCIR · For employers
                </p>
                <h1 className="sal-heading">
                  Skill Assessment <span className="text-primary">Library.</span>
                </h1>
                <p className="sal-hero-description text-muted-foreground">
                  Ready-made, proctored tests for every role, with detailed reports that let you shortlist on{" "}
                  <strong className="font-semibold text-foreground">demonstrated ability</strong> instead of resumes.
                </p>
                <div className="sal-hero-actions flex flex-wrap gap-4">
                  <Button asChild size="lg" className="bg-foreground text-background hover:bg-foreground/90">
                    <a href="#test-library">
                      Explore the Library <ArrowRight />
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-foreground bg-transparent"
                    onClick={() => setSampleReportOpen(true)}
                  >
                    View Sample Report
                  </Button>
                </div>
                <p className="sal-hero-proof text-primary">
                  Role-ready tests. Proctored sessions. Detailed reports.
                </p>
              </div>
            </div>
          </section>

          {/* Test Library Catalogue */}
          <section id="test-library" className="scroll-mt-24 py-16 md:py-24">
            <div className="container">
              <div className="sal-catalogue-heading text-center">
                <h2 className="sal-catalogue-title">
                  Different roles.
                  <br />
                  <span className="text-primary">The right test for each.</span>
                </h2>
              </div>

              <form
                className="sal-filter-bar rounded-lg border border-border bg-card p-3 shadow-sm"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="relative min-w-0">
                  <Search className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-muted-foreground" />
                  <Input
                    aria-label="Search assessments"
                    placeholder="Test name or skill"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 bg-card pl-11"
                  />
                </div>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger aria-label="Job category" className="h-12 bg-card">
                    <SelectValue placeholder="Job category" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat === "All roles" ? "Job category · All roles" : cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger aria-label="Assessment level" className="h-12 bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["All levels", "Foundational", "Intermediate", "Advanced"].map((lvl) => (
                      <SelectItem key={lvl} value={lvl}>
                        {lvl}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center justify-end gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    className="whitespace-nowrap text-muted-foreground"
                    onClick={resetFilters}
                  >
                    <X className="h-4 w-4" />
                    Clear Filter
                  </Button>
                  <Button
                    type="submit"
                    size="icon"
                    className="h-11 w-11 shrink-0 rounded-full"
                    aria-label="Search tests"
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                </div>
              </form>

              <div
                className="mb-5 flex flex-wrap justify-between gap-2 text-xs text-muted-foreground"
                aria-live="polite"
              >
                <span>{filtered.length} assessment previews</span>
                <span>Illustrative catalogue · Test availability to be confirmed</span>
              </div>

              <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((item) => (
                  <article
                    key={item.id}
                    className="sal-test-card group flex flex-col rounded-lg border border-border bg-card p-7 transition-colors hover:border-primary/40"
                  >
                    <div className="mb-7 flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2 text-[10px] font-medium uppercase text-muted-foreground">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {item.category}
                      </span>
                      <span
                        className="flex shrink-0 items-center gap-1.5"
                        aria-label={`Average rating ${item.rating} out of 5`}
                      >
                        <span className="sal-stars" aria-hidden="true">
                          {[0, 1, 2, 3, 4].map((idx) => (
                            <Star
                              key={idx}
                              strokeWidth={1.5}
                              fill={idx < Math.round(item.rating) ? "currentColor" : "none"}
                            />
                          ))}
                        </span>
                        <span className="text-xs font-semibold">{item.rating}/5</span>
                      </span>
                    </div>

                    <h3 className="text-2xl font-semibold leading-8">{item.title}</h3>
                    <p className="mb-8 mt-3 text-sm leading-6 text-muted-foreground">
                      Assess practical ability in {item.skills.join(", ")} through a role-focused test.
                    </p>

                    <div className="mt-auto">
                      <span className="inline-flex rounded-full border border-border bg-secondary px-3 py-1 text-[10px] font-medium">
                        {item.level} · Role-focused skill assessment
                      </span>
                      <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Proctored format
                      </p>
                      <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
                        <span className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock3 className="h-3.5 w-3.5" />
                          {item.minutes} minutes
                        </span>
                        <Button
                          variant="ghost"
                          className="h-8 gap-1.5 px-0 text-primary hover:bg-transparent"
                          aria-label={`Explore ${item.title}`}
                          onClick={() => setPreviewTest(item)}
                        >
                          <span className="sal-explore-label">Explore</span>
                          <ArrowRight className="sal-explore-arrow h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="py-12 text-center">
                  <Search className="mx-auto mb-4 h-8 w-8 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">No matching assessments</h3>
                  <p className="my-3 text-sm text-muted-foreground">
                    Try another role, skill or category.
                  </p>
                  <Button variant="outline" onClick={resetFilters}>
                    Reset filters
                  </Button>
                </div>
              )}
            </div>
          </section>

          {/* The story behind the score */}
          <section className="border-y border-border bg-card py-16 md:py-24">
            <div className="container grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase text-primary">
                  The story behind the score
                </p>
                <h2 className="sal-section-heading">
                  Not just a number.
                  <br />
                  <span className="text-primary">A clearer hiring decision.</span>
                </h2>
                <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">
                  Know where a candidate excels, where they need support, and what to explore in the next conversation.
                </p>
                <div className="mt-7 space-y-5">
                  {[
                    {
                      title: "See the skill breakdown",
                      text: "Review performance across the capabilities relevant to the role.",
                    },
                    {
                      title: "Read the evidence",
                      text: "Use responses and task outcomes to shape your interview questions.",
                    },
                    {
                      title: "Keep integrity in context",
                      text: "Review proctoring flags rather than treating a signal as a verdict.",
                    },
                  ].map((point) => (
                    <div key={point.title} className="flex gap-3">
                      <CircleCheck className="mt-1 h-5 w-5 shrink-0 text-primary" />
                      <div>
                        <h3 className="text-sm font-semibold">{point.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">{point.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="link" className="mt-7 px-0" onClick={() => setSampleReportOpen(true)}>
                  Explore the sample report <ArrowRight />
                </Button>
              </div>

              <div className="rounded-lg border border-border bg-card p-6 md:p-8">
                <div className="flex items-center justify-between border-b border-border pb-5">
                  <span className="text-sm font-bold text-primary">TalentCIR / Skill Report</span>
                  <span className="text-xs text-muted-foreground">Illustrative sample</span>
                </div>
                <div className="flex flex-wrap items-center gap-6 py-7">
                  <div className="sal-score shrink-0">
                    <strong className="text-4xl text-primary">
                      84<span className="text-base">/100</span>
                    </strong>
                    <span className="mt-1 text-xs text-muted-foreground">Overall score</span>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">Candidate A</p>
                    <h3 className="mt-2 text-xl font-semibold">Frontend Developer</h3>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Sample results · Not a real candidate
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  {sampleSkillScores.map((skill) => (
                    <div key={skill.name}>
                      <div className="mb-2 flex justify-between text-sm">
                        <span>{skill.name}</span>
                        <strong className="text-primary">{skill.score}%</strong>
                      </div>
                      <div
                        className="sal-bars"
                        role="meter"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={skill.score}
                        aria-label={`${skill.name}: ${skill.score}%`}
                      >
                        {Array.from({ length: 20 }, (_, idx) => (
                          <span key={idx} data-filled={idx < skill.score / 5} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-7 flex gap-3 border-t border-border pt-5">
                  <Fingerprint className="h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-semibold">Integrity review</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Identity, session and browser signals accompany the assessment results.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* A better first round */}
          <section className="py-16 md:py-24">
            <div className="container">
              <div className="mx-auto max-w-2xl text-center">
                <p className="mb-3 text-xs font-semibold uppercase text-primary">A better first round</p>
                <h2 className="sal-section-heading">
                  Less resume guesswork.
                  <br />
                  <span className="text-primary">More demonstrated ability.</span>
                </h2>
              </div>

              <div className="my-12 grid gap-8 md:grid-cols-3">
                {hiringSteps.map(({ icon: Icon, title, text }, idx) => (
                  <div key={title} className="border-t border-primary/25 pt-6">
                    <div className="mb-7 flex items-center justify-between">
                      <Icon className="h-7 w-7 text-primary" />
                      <span className="text-3xl font-light text-primary/30">0{idx + 1}</span>
                    </div>
                    <h3 className="text-xl font-semibold">{title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{text}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-start justify-between gap-6 border-t border-border pt-8 md:flex-row md:items-center">
                <div>
                  <h3 className="text-2xl font-semibold">Your next shortlist starts with skills.</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Build your company profile and take the next step.
                  </p>
                </div>
                <Button asChild size="lg">
                  <Link to="/employer-profile">
                    Create Company Profile <ArrowRight />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </Layout>

      {/* Assessment Preview Dialog */}
      <Dialog
        open={Boolean(previewTest)}
        onOpenChange={(open) => {
          if (!open) setPreviewTest(null);
        }}
      >
        <DialogContent className="max-h-[85vh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto bg-card">
          <DialogHeader>
            <DialogTitle className="text-2xl">{previewTest?.title}</DialogTitle>
            <DialogDescription>Illustrative test preview · Not a live assessment</DialogDescription>
          </DialogHeader>
          {previewTest && (
            <>
              <div className="flex gap-4 border-y border-border py-4 text-sm text-muted-foreground">
                <span>{previewTest.minutes} minutes</span>
                <span>{previewTest.level}</span>
                <span>Proctored format</span>
              </div>
              <h3 className="text-sm font-semibold">Skills covered</h3>
              <ul className="space-y-2" role="list">
                {previewTest.skills.map((skill) => (
                  <li key={skill} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    {skill}
                  </li>
                ))}
              </ul>
              <div className="rounded-md bg-background p-5">
                <p className="mb-3 text-xs font-semibold uppercase text-primary">Sample scenario</p>
                <p className="text-sm leading-7">{previewTest.question}</p>
              </div>
              <p className="text-xs leading-5 text-muted-foreground">
                A scenario-based response is reviewed for reasoning, practical application and clarity. Final questions
                and scoring are subject to the selected assessment.
              </p>
              <Button asChild>
                <Link to="/employer-profile">
                  Get Started <ArrowRight />
                </Link>
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Sample Report Dialog */}
      <Dialog open={sampleReportOpen} onOpenChange={setSampleReportOpen}>
        <DialogContent className="max-h-[85vh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto bg-card">
          <DialogHeader>
            <DialogTitle className="text-2xl">Inside a skill assessment report</DialogTitle>
            <DialogDescription>
              Illustrative report for Candidate A · Frontend Developer
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-5 border-y border-border py-5">
            <strong className="text-4xl text-primary">84/100</strong>
            <p className="text-sm text-muted-foreground">
              Sample overall score
              <br />
              Not a hiring recommendation
            </p>
          </div>
          {sampleSkillScores.map((skill) => (
            <div key={skill.name} className="flex justify-between border-b border-border pb-3 text-sm">
              <span>{skill.name}</span>
              <strong>{skill.score}%</strong>
            </div>
          ))}
          <div>
            <h3 className="font-semibold">Strengths</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Clear JavaScript reasoning and a sound approach to React component state.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Explore in the interview</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Ask how the candidate tests keyboard navigation and resolves accessibility issues in production.
            </p>
          </div>
          <div className="rounded-md bg-background p-4 text-xs leading-6 text-muted-foreground">
            Proctoring signals support human review. Sample scores and findings shown here do not represent a real
            assessment or candidate.
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
