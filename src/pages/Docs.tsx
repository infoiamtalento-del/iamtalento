import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, Users, Shield, ClipboardCheck, BrainCircuit, Plug } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const sections = [
  { title: "Getting Started", icon: BookOpen, items: ["Quick Start for Employers", "Quick Start for Job Seekers", "Platform Overview", "Account Setup"] },
  { title: "AI Screening", icon: BrainCircuit, items: ["How AI Scoring Works", "Screening Parameters", "Debiasing & Fairness", "Explainable AI Results"] },
  { title: "Assessments", icon: ClipboardCheck, items: ["Creating Custom Tests", "Test Templates Library", "AI-Generated Assessments", "Proctoring & Integrity"] },
  { title: "Candidate Management", icon: Users, items: ["Candidate Profiles", "Pipeline Management", "Communication Tools", "Offer Management"] },
  { title: "Integrations", icon: Plug, items: ["ATS Integrations", "HRIS Connectors", "Job Board Sync", "API Reference"] },
  { title: "Security & Compliance", icon: Shield, items: ["Data Security", "GDPR Compliance", "SOC 2 Certification", "Access Controls"] },
];

const Docs = () => {
  const [active, setActive] = useState("Quick Start for Employers");
  const [search, setSearch] = useState("");

  return (
    <>
      <Helmet>
        <title>Documentation — I Am Talento</title>
        <meta name="description" content="Learn how to use I Am Talento for AI screening, custom assessments, and intelligent hiring." />
      </Helmet>
      <Layout>
        <section className="pt-32 pb-24">
          <div className="container">
            <div className="grid lg:grid-cols-[280px_1fr] gap-8">
              <aside className="space-y-2">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search docs..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                {sections.map(({ title, icon: Icon, items }) => (
                  <Collapsible key={title} defaultOpen>
                    <CollapsibleTrigger className="flex items-center gap-2 w-full px-3 py-2 text-sm font-semibold rounded-lg hover:bg-accent transition-colors group">
                      <Icon className="h-4 w-4 text-primary" />
                      {title}
                      <ChevronRight className="h-3.5 w-3.5 ml-auto transition-transform group-data-[state=open]:rotate-90" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-6 mt-1 space-y-0.5">
                      {items.filter(item => !search || item.toLowerCase().includes(search.toLowerCase())).map(item => (
                        <button key={item} onClick={() => setActive(item)} className={cn("block w-full text-left px-3 py-1.5 text-sm rounded-lg transition-colors", active === item ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:text-foreground")}>
                          {item}
                        </button>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </aside>

              <div className="p-8 rounded-2xl bg-card border border-border/50 min-h-[60vh]">
                <nav className="text-xs text-muted-foreground mb-6">Docs / {active}</nav>
                <h1 className="text-3xl font-bold font-display mb-6">{active}</h1>
                <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
                  <p>Welcome to the <strong>{active}</strong> documentation. This guide covers everything you need to get started.</p>
                  <h2 className="text-lg font-semibold text-foreground font-display mt-8 mb-3">Overview</h2>
                  <p>I Am Talento's talent intelligence platform provides AI-powered screening, custom assessments, and intelligent matching — all designed to help you hire better, faster, and fairer.</p>
                  <div className="bg-secondary/50 rounded-xl p-4 border border-border/50">
                    <code className="text-xs text-foreground whitespace-pre">
{`// Example: Initialize Talento SDK
import { Talento } from '@talento/sdk';

const client = new Talento({
  apiKey: 'your-api-key',
  environment: 'production'
});

// Screen a candidate
const result = await client.screen({
  resumeUrl: 'https://...',
  jobId: 'job_123'
});

console.log(result.matchScore); // 94`}
                    </code>
                  </div>
                  <h2 className="text-lg font-semibold text-foreground font-display mt-8 mb-3">Next Steps</h2>
                  <p>Explore the sidebar to dive deeper into AI screening parameters, custom assessments, and integration guides.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Docs;
