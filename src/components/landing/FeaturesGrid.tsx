import { FileSearch, ScanSearch, ClipboardCheck, ShieldAlert, MessageSquareMore, BarChart3, Briefcase, GraduationCap, Crosshair, Wand2, Eye, Mic, Video, Code2, Award, MapPin, Send, Route, Zap } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import SectionBadge from "@/components/ui/section-badge";

const screeningFeatures = [
  { icon: FileSearch, title: "AI Resume Parser", desc: "Parses résumés, LinkedIn profiles, and portfolios into structured skill profiles in under 3 seconds. Detects inconsistencies automatically.", stat: "3s parsing" },
  { icon: ScanSearch, title: "Inconsistency Flagging", desc: "AI cross-references employment history, education claims, and skill proficiency levels to flag mismatches.", stat: "AI-verified" },
  { icon: Crosshair, title: "Role-Based Skill Matching", desc: "Maps candidate skills against job requirements across 40+ dimensions including technical, soft skills, and cultural fit.", stat: "40+ dimensions" },
  { icon: Wand2, title: "JD Assistant", desc: "AI generates optimized job descriptions from minimal input, including required skills, experience levels, and assessment criteria.", stat: "Auto-generate JDs" },
  { icon: MessageSquareMore, title: "Pre-Screening Chatbots", desc: "Automated conversational screening that collects key qualifying information before human review begins.", stat: "24/7 screening" },
  { icon: BarChart3, title: "Hiring Analytics", desc: "Real-time pipeline health, diversity metrics, time-to-hire, cost-per-hire, and source effectiveness dashboards.", stat: "360° analytics" },
];

const assessmentFeatures = [
  { icon: ClipboardCheck, title: "Custom Assessments", desc: "Create role-specific skill tests, coding challenges, aptitude assessments, and domain quizzes — or auto-generate from your JD.", stat: "200+ templates" },
  { icon: Mic, title: "Voice & Personality Analysis", desc: "AI-powered voice analysis assesses communication skills, confidence levels, and personality traits during interviews.", stat: "AI voice scoring" },
  { icon: Video, title: "Live & Automated Interviews", desc: "AI-proctored video interviews with automated scheduling, recording, transcription, and behavioral scoring.", stat: "Automated proctoring" },
  { icon: Code2, title: "Code Quality Analysis", desc: "Real-time code execution, quality scoring, approach analysis, and code playback for engineering roles.", stat: "Live coding" },
  { icon: ShieldAlert, title: "10+ Anti-Cheating Features", desc: "Webcam proctoring, tab detection, paste detection, AI-answer detection, IP tracking, screenshot protection, and more.", stat: "Enterprise-grade" },
  { icon: Eye, title: "Recording-Based Evaluation", desc: "Full session recordings for employer review with timestamped flagging of suspicious behaviors.", stat: "Full recording" },
];

const candidateFeatures = [
  { icon: Award, title: "Industry Readiness Score", desc: "AI-powered score benchmarked against peers in your industry, role, and experience level. Know where you stand instantly.", stat: "Peer benchmarked" },
  { icon: Route, title: "Skill Gap Analysis", desc: "Detailed breakdown of your strengths, weaknesses, and a personalized action plan with learning recommendations.", stat: "Personalized roadmap" },
  { icon: MapPin, title: "Career Mapping", desc: "AI maps your current skills to potential career paths, salary benchmarks, and growth trajectories across industries.", stat: "AI career paths" },
  { icon: Award, title: "Verified Skill Badge", desc: "Earn a verified badge after completing assessments. Badges are displayed to employers and increase profile visibility.", stat: "Employer-trusted" },
  { icon: Send, title: "One-Click Job Distribution", desc: "Apply to 100+ matched jobs with your verified profile in one click. Employers see your Industry Readiness Score upfront.", stat: "100+ jobs/click" },
  { icon: GraduationCap, title: "Growth Roadmap", desc: "6-month personalized plan to move from 'Below Market' to 'Above Market' with specific courses, certifications, and projects.", stat: "6-month plan" },
];

const FeatureCard = ({ icon: Icon, title, desc, stat, i }: { icon: any; title: string; desc: string; stat: string; i: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.06 }}
    viewport={{ once: true }}
    className="group p-6 rounded-2xl bg-card border border-border/50 hover:shadow-xl hover:border-primary/20 transition-all duration-300 cursor-default relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full" />
    <div className="h-11 w-11 rounded-xl bg-accent flex items-center justify-center mb-4 group-hover:gradient-primary transition-all duration-300">
      <Icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
    </div>
    <h3 className="text-base font-semibold font-display mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed mb-3">{desc}</p>
    <span className="inline-flex items-center text-[11px] font-semibold text-primary bg-accent px-2.5 py-1 rounded-full">{stat}</span>
  </motion.div>
);

const FeaturesGrid = () => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section ref={ref} className="py-28">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <SectionBadge label="Platform Features" icon={Zap} />
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Everything You Need to<br /><span className="text-primary">Hire & Get Hired</span></h2>
          <p className="text-muted-foreground text-lg">AI screening, secure assessments, and career intelligence — built for both sides of hiring.</p>
        </div>

        <Tabs defaultValue="screening" className="w-full">
          <TabsList className="w-full max-w-lg mx-auto grid grid-cols-3 mb-12 h-12">
            <TabsTrigger value="screening" className="text-xs sm:text-sm font-medium data-[state=active]:shadow-md">
              Screening & AI
            </TabsTrigger>
            <TabsTrigger value="assessment" className="text-xs sm:text-sm font-medium data-[state=active]:shadow-md">
              Assessments
            </TabsTrigger>
            <TabsTrigger value="candidates" className="text-xs sm:text-sm font-medium data-[state=active]:shadow-md">
              For Candidates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="screening">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {screeningFeatures.map((f, i) => <FeatureCard key={f.title} {...f} i={i} />)}
            </div>
          </TabsContent>

          <TabsContent value="assessment">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {assessmentFeatures.map((f, i) => <FeatureCard key={f.title} {...f} i={i} />)}
            </div>
          </TabsContent>

          <TabsContent value="candidates">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {candidateFeatures.map((f, i) => <FeatureCard key={f.title} {...f} i={i} />)}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default FeaturesGrid;
