import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";

const entries = [
  { version: "3.2.0", date: "Feb 12, 2026", changes: [
    { type: "New", text: "Human-Led AI Screening, combine AI scores with recruiter judgment for final shortlists" },
    { type: "New", text: "Adaptive skill assessments that adjust difficulty in real-time based on candidate performance" },
    { type: "Improvement", text: "AI screening accuracy improved from 96% to 98.5% with new multi-dimensional scoring model" },
    { type: "Fix", text: "Fixed timezone handling in scheduled assessment windows across different regions" },
  ]},
  { version: "3.1.0", date: "Jan 25, 2026", changes: [
    { type: "New", text: "Candidate skill gap analysis with personalized learning recommendations" },
    { type: "Improvement", text: "Debiasing algorithms updated, third-party audit confirms 99.2% fairness score" },
    { type: "Improvement", text: "Resume parsing now supports 45+ languages with improved accuracy" },
    { type: "Fix", text: "Resolved edge case in multi-role matching where candidates received duplicate recommendations" },
  ]},
  { version: "3.0.0", date: "Jan 10, 2026", changes: [
    { type: "New", text: "Enterprise tier launch with custom SLA, dedicated support, and on-premise deployment option" },
    { type: "New", text: "AI-generated interview guides based on candidate profile and role requirements" },
    { type: "Improvement", text: "Dashboard redesign with real-time pipeline funnel and source analytics" },
    { type: "Fix", text: "Fixed assessment proctoring false positives for candidates on slow internet connections" },
  ]},
];

const typeColor: Record<string, string> = {
  New: "bg-success/10 text-success border-success/20",
  Improvement: "bg-primary/10 text-primary border-primary/20",
  Fix: "bg-warning/10 text-warning border-warning/20",
};

const Changelog = () => (
  <>
    <Helmet>
      <title>Changelog | I Am Talento | Latest Updates</title>
      <meta name="description" content="See what's new in I Am Talento, latest AI screening features, assessment updates, and platform improvements." />
    </Helmet>
    <Layout>
      <section className="pt-32 pb-24">
        <div className="container max-w-3xl">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">Changelog</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display leading-[1.15] mb-4">
              See What Is New<br /><span className="text-primary">I Am Talento</span>
            </h1>
            <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto">
              <span className="block">Follow our latest features and improvements.</span>
              <span className="block">Find every update in one place.</span>
            </p>
          </div>
          <div className="space-y-12">
            {entries.map(({ version, date, changes }) => (
              <div key={version} className="relative pl-8 border-l-2 border-border">
                <div className="absolute -left-3 top-0 h-6 w-6 rounded-full gradient-primary flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="outline" className="font-mono text-xs">v{version}</Badge>
                  <span className="text-sm text-muted-foreground">{date}</span>
                </div>
                <ul className="space-y-3">
                  {changes.map(({ type, text }, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Badge className={`text-[10px] shrink-0 ${typeColor[type]}`}>{type}</Badge>
                      <span className="text-sm text-muted-foreground leading-relaxed">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  </>
);

export default Changelog;
