import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { BrainCircuit, Search, ClipboardCheck, Shield, Users, BarChart3, Target, Zap, Check, X, GraduationCap, Briefcase, Video, Plug, AudioLines, Cpu, FileInput, Code, Eye, FileCheck, Award, Send, Map } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const screeningFeatures = [
  { icon: BrainCircuit, title: "AI Resume Parser", desc: "Extract and structure candidate data from any resume format with 98% accuracy using NLP." },
  { icon: Shield, title: "Inconsistency Flagging", desc: "Automatically detect discrepancies in employment dates, titles, and qualifications." },
  { icon: Target, title: "Role-Based Skill Matching", desc: "Match candidates to roles across 40+ dimensions including skills, experience, and trajectory." },
  { icon: FileCheck, title: "JD Assistant", desc: "AI-powered job description generator that creates inclusive, optimized postings in seconds." },
  { icon: Users, title: "Pre-Screening Chatbots", desc: "Automated conversational screening that qualifies candidates 24/7 before human review." },
  { icon: BarChart3, title: "Hiring Analytics", desc: "Real-time dashboards for pipeline health, diversity metrics, time-to-hire, and cost-per-hire." },
  { icon: Zap, title: "AI Auto-Scoring", desc: "Instant, unbiased candidate scoring with explainable AI rationale for every decision." },
  { icon: Video, title: "Video Interviews", desc: "Live and automated video interviews with AI-powered sentiment and body language analysis." },
  { icon: Plug, title: "40+ ATS Integrations", desc: "Seamlessly connects with Greenhouse, Lever, Workday, iCIMS, and 40+ other platforms." },
];

const assessmentFeatures = [
  { icon: ClipboardCheck, title: "Custom Assessments", desc: "Build role-specific tests from 200+ templates or let AI auto-generate from job descriptions." },
  { icon: AudioLines, title: "Voice & Personality Analysis", desc: "Evaluate communication skills and personality traits through AI-analyzed voice responses." },
  { icon: Video, title: "Live & Automated Interviews", desc: "Structured interviews with real-time AI assistance and automated follow-up questions." },
  { icon: Code, title: "Code Quality Analysis", desc: "Real-time code evaluation with playback, complexity scoring, and best-practice checks." },
  { icon: Eye, title: "10+ Anti-Cheating Features", desc: "Webcam proctoring, tab detection, paste detection, AI behavior analysis, and more." },
  { icon: FileCheck, title: "Recording-Based Evaluation", desc: "Review full session recordings with timestamped flagging of suspicious behavior." },
  { icon: BrainCircuit, title: "AI Assessment Builder", desc: "Generate complete assessments from a job description using domain-trained AI models." },
  { icon: FileInput, title: "Assessment Importing", desc: "Import existing question banks and tests from spreadsheets or other platforms." },
  { icon: AudioLines, title: "Voice Originality Testing", desc: "Detect AI-generated voice responses using advanced pattern recognition." },
  { icon: Cpu, title: "AI Proficiency Tests", desc: "Measure candidates' ability to effectively leverage AI tools in real-world scenarios." },
];

const candidateFeatures = [
  { icon: Target, title: "Industry Readiness Score", desc: "AI-calculated score benchmarking you against peers, Above Market, Market Ready, or Below Market." },
  { icon: Search, title: "Skill Gap Analysis", desc: "Personalized roadmaps showing exactly what skills you need and curated learning paths." },
  { icon: Map, title: "Career Mapping", desc: "Visualize career trajectories and discover roles that match your growth potential." },
  { icon: Award, title: "Verified Skill Badge", desc: "Earn employer-trusted badges that prove your skills through secure, proctored assessments." },
  { icon: Send, title: "One-Click Job Distribution", desc: "Apply to 100+ matching jobs instantly with your verified profile and badge." },
  { icon: GraduationCap, title: "Growth Roadmap", desc: "Actionable plan with courses, certifications, and milestones to reach your career goals." },
];

const tabs = [
  {
    id: "screening",
    label: "Screening & AI",
    features: screeningFeatures,
    comparison: [
      { task: "Resume screening", before: "2-3 weeks manual review", after: "4.2 seconds per candidate" },
      { task: "Inconsistency detection", before: "Missed by human reviewers", after: "AI flags automatically" },
      { task: "Job description creation", before: "Hours of writing", after: "AI-generated in 30 seconds" },
      { task: "Candidate scoring", before: "Subjective gut feeling", after: "40+ dimension AI scoring" },
      { task: "Time-to-hire", before: "45 days average", after: "12 days average" },
      { task: "Cost-per-hire", before: "₹3.9L average", after: "₹1.6L average" },
    ],
  },
  {
    id: "assessments",
    label: "Assessments",
    features: assessmentFeatures,
    comparison: [
      { task: "Assessment creation", before: "Days of test design", after: "AI-generated in minutes" },
      { task: "Cheating prevention", before: "Honor system", after: "10+ anti-cheating layers" },
      { task: "Code evaluation", before: "Manual code review", after: "AI playback & scoring" },
      { task: "Voice analysis", before: "Not available", after: "AI originality detection" },
      { task: "Interview scheduling", before: "Weeks of coordination", after: "Automated & on-demand" },
      { task: "Result reporting", before: "Generic pass/fail", after: "Granular AI reports" },
    ],
  },
  {
    id: "candidates",
    label: "For Candidates",
    features: candidateFeatures,
    comparison: [
      { task: "Market positioning", before: "No idea where you stand", after: "Industry Readiness Score" },
      { task: "Skill validation", before: "Unverified resume claims", after: "Verified Skill Badge" },
      { task: "Job applications", before: "Apply one by one", after: "100+ jobs in one click" },
      { task: "Career planning", before: "Guesswork", after: "AI-powered growth roadmap" },
      { task: "Skill gaps", before: "Unknown blind spots", after: "Personalized gap analysis" },
    ],
  },
];

const Features = () => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <>
      <Helmet>
        <title>Features | I Am Talento | AI Screening, Assessments & Job Matching</title>
        <meta name="description" content="Explore I Am Talento's AI screening, custom assessments, intelligent job matching, and hiring analytics features." />
      </Helmet>
      <Layout>
        <section className="pt-32 pb-16">
          <div className="container text-center max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">Features</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display leading-[1.15] mb-5">
              Talent Intelligence<br /><span className="text-primary">For Modern Teams</span>
            </h1>
            <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
              <span className="block">Screen, assess, and match talent intelligently.</span>
              <span className="block">Manage it all in one place.</span>
            </p>
          </div>
        </section>

        <section className="pb-24">
          <div className="container">
            <Tabs defaultValue="screening" className="w-full">
              <TabsList className="w-full max-w-xl mx-auto grid grid-cols-3 mb-12 h-12">
                {tabs.map(t => (
                  <TabsTrigger key={t.id} value={t.id} className="text-xs sm:text-sm">{t.label}</TabsTrigger>
                ))}
              </TabsList>
              {tabs.map(t => (
                <TabsContent key={t.id} value={t.id}>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {t.features.map(({ icon: Icon, title, desc }) => (
                      <motion.div
                        key={title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 rounded-2xl bg-card border border-border/50 hover:shadow-xl hover:border-primary/20 transition-all duration-300"
                      >
                        <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="text-base font-semibold font-display mb-2">{title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Comparison table */}
                  <div className="max-w-3xl mx-auto">
                    <h3 className="text-2xl font-bold font-display text-center mb-8">Before vs After Talento</h3>
                    <div className="rounded-2xl border border-border overflow-hidden">
                      <div className="grid grid-cols-3 bg-secondary px-6 py-3 text-sm font-semibold">
                        <span>Metric</span><span className="text-center">Traditional</span><span className="text-center">With Talento</span>
                      </div>
                      {t.comparison.map(({ task, before, after }, i) => (
                        <div key={task} className={cn("grid grid-cols-3 px-6 py-4 text-sm", i % 2 === 0 ? "bg-card" : "bg-secondary/30")}>
                          <span className="font-medium">{task}</span>
                          <span className="text-center text-muted-foreground flex items-center justify-center gap-1"><X className="h-3.5 w-3.5 text-destructive" />{before}</span>
                          <span className="text-center flex items-center justify-center gap-1"><Check className="h-3.5 w-3.5 text-primary" />{after}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Features;
