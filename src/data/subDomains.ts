export type TestKind = "MCQ" | "Technical" | "Experience-Based";

export interface RoundTest {
  name: string;
  kind: TestKind;
  questions: number;
  minutes: number;
  /** base price in INR before sub-domain multiplier */
  price: number;
  text: string;
}

export interface Round {
  id: 1 | 2 | 3;
  title: string;
  tests: [RoundTest, RoundTest];
}

export interface SubDomain {
  id: string;
  name: string;
  text: string;
  /** price multiplier for deeper / more specialised sub-domains */
  multiplier: number;
  topics: string[];
}

/** Three rounds, two tests each. Same structure for every sub-domain. */
export const ROUNDS: Round[] = [
  {
    id: 1,
    title: "Round 1 · Knowledge",
    tests: [
      { name: "Core Concepts", kind: "MCQ", questions: 15, minutes: 15, price: 99, text: "Definitions, frameworks and terminology." },
      { name: "Applied Scenarios", kind: "MCQ", questions: 10, minutes: 15, price: 99, text: "Pick the best decision in short situations." },
    ],
  },
  {
    id: 2,
    title: "Round 2 · Technical",
    tests: [
      { name: "Hands-on Tasks", kind: "Technical", questions: 5, minutes: 30, price: 199, text: "Tool-based tasks that test applied skill." },
      { name: "Case Problem", kind: "Technical", questions: 2, minutes: 25, price: 149, text: "Analyse data or a brief and recommend a plan." },
    ],
  },
  {
    id: 3,
    title: "Round 3 · Experience",
    tests: [
      { name: "Workplace Scenarios", kind: "Experience-Based", questions: 4, minutes: 25, price: 149, text: "Real situations matched to your experience level." },
      { name: "Situational Judgement", kind: "Experience-Based", questions: 8, minutes: 15, price: 99, text: "Prioritisation, stakeholder and ethics calls." },
    ],
  },
];

export const roundsBasePrice = ROUNDS.reduce(
  (sum, r) => sum + r.tests.reduce((s, t) => s + t.price, 0),
  0
);

export const subDomainPrice = (s: SubDomain) => Math.round((roundsBasePrice * s.multiplier) / 10) * 10;
export const testPrice = (t: RoundTest, s: SubDomain) => Math.round(t.price * s.multiplier);

const MARKETING: SubDomain[] = [
  { id: "seo", name: "SEO", multiplier: 1, text: "Technical, on-page and off-page search optimisation.", topics: ["Keyword research", "Technical SEO", "Link building", "Search Console"] },
  { id: "google-ads", name: "Google Ads", multiplier: 1.1, text: "Search, Display, Shopping and YouTube campaign management.", topics: ["Search campaigns", "Bidding", "Quality Score", "Conversion tracking"] },
  { id: "meta-ads", name: "Meta Ads", multiplier: 1.1, text: "Facebook and Instagram paid campaigns end to end.", topics: ["Audiences", "Creative testing", "Pixel and CAPI", "Retargeting"] },
  { id: "analytics", name: "Web Analytics", multiplier: 1.2, text: "GA4, attribution and reporting for marketing decisions.", topics: ["GA4 events", "Attribution", "Funnels", "Dashboards"] },
  { id: "content", name: "Content Marketing", multiplier: 0.9, text: "Content strategy, calendars and performance measurement.", topics: ["Content strategy", "Editorial planning", "Distribution", "Copywriting"] },
  { id: "email", name: "Email and CRM Marketing", multiplier: 0.9, text: "Lifecycle journeys, segmentation and deliverability.", topics: ["Segmentation", "Automation flows", "Deliverability", "A/B testing"] },
  { id: "smm", name: "Social Media Marketing", multiplier: 0.9, text: "Organic social strategy, community and reporting.", topics: ["Platform strategy", "Community", "Influencers", "Social analytics"] },
  { id: "cro", name: "Conversion Optimisation", multiplier: 1.2, text: "Landing page, funnel and experiment optimisation.", topics: ["Funnel analysis", "Experiment design", "UX heuristics", "Heatmaps"] },
];

const SOFTWARE: SubDomain[] = [
  { id: "frontend", name: "Frontend Development", multiplier: 1, text: "HTML, CSS, JavaScript and modern frameworks.", topics: ["React", "TypeScript", "Accessibility", "Performance"] },
  { id: "backend", name: "Backend Development", multiplier: 1.1, text: "APIs, services and data layers.", topics: ["REST", "Databases", "Auth", "Caching"] },
  { id: "dsa", name: "Data Structures and Algorithms", multiplier: 1.2, text: "Problem solving and complexity analysis.", topics: ["Arrays and trees", "Graphs", "Dynamic programming", "Complexity"] },
  { id: "devops", name: "DevOps and Cloud", multiplier: 1.2, text: "CI/CD, containers and cloud infrastructure.", topics: ["CI/CD", "Docker", "Kubernetes", "Monitoring"] },
  { id: "qa", name: "Testing and QA", multiplier: 0.9, text: "Manual, automated and API testing.", topics: ["Test design", "Automation", "API testing", "Bug triage"] },
];

const DESIGN: SubDomain[] = [
  { id: "ux-research", name: "UX Research", multiplier: 1, text: "Research methods and synthesis.", topics: ["Interviews", "Usability tests", "Synthesis", "Personas"] },
  { id: "ui", name: "Visual and UI Design", multiplier: 1, text: "Layout, typography and design systems.", topics: ["Layout", "Typography", "Design systems", "Accessibility"] },
  { id: "interaction", name: "Interaction Design", multiplier: 1.1, text: "Flows, prototyping and micro-interactions.", topics: ["User flows", "Prototyping", "Motion", "Handoff"] },
];

const SALES: SubDomain[] = [
  { id: "prospecting", name: "Prospecting and Outreach", multiplier: 0.9, text: "Lead generation and outbound cadences.", topics: ["ICP", "Cold outreach", "Cadences", "CRM hygiene"] },
  { id: "discovery", name: "Discovery and Demo", multiplier: 1, text: "Qualification and solution selling.", topics: ["MEDDIC", "Discovery calls", "Demos", "Objections"] },
  { id: "negotiation", name: "Negotiation and Closing", multiplier: 1.1, text: "Pricing, negotiation and deal closure.", topics: ["Pricing", "Negotiation", "Procurement", "Forecasting"] },
];

const FINANCE: SubDomain[] = [
  { id: "fsa", name: "Financial Statement Analysis", multiplier: 1, text: "Reading and analysing financial statements.", topics: ["Ratios", "Cash flow", "Working capital", "Reporting"] },
  { id: "modelling", name: "Financial Modelling", multiplier: 1.2, text: "Forecasting, valuation and scenarios.", topics: ["Three-statement model", "DCF", "Sensitivity", "Excel"] },
  { id: "budgeting", name: "Budgeting and FP&A", multiplier: 1, text: "Budgets, variance and planning.", topics: ["Budgeting", "Variance", "Forecasting", "KPIs"] },
];

const GENERIC: SubDomain[] = [
  { id: "fundamentals", name: "Fundamentals", multiplier: 1, text: "Core concepts and terminology for this domain.", topics: ["Concepts", "Frameworks", "Tools", "Metrics"] },
  { id: "applied", name: "Applied Practice", multiplier: 1.1, text: "Hands-on problem solving at work.", topics: ["Case work", "Analysis", "Execution", "Reporting"] },
  { id: "advanced", name: "Advanced Specialisation", multiplier: 1.3, text: "Deeper, senior-level scenarios.", topics: ["Strategy", "Optimisation", "Leadership", "Edge cases"] },
];

export const SUB_DOMAINS_BY_INDUSTRY: Record<string, SubDomain[]> = {
  Marketing: MARKETING,
  "E-commerce": [
    { id: "catalog", name: "Catalog Management", multiplier: 1, text: "Listings, content quality and taxonomy.", topics: ["Listings", "Taxonomy", "Quality checks", "Content"] },
    { id: "marketplace", name: "Marketplace Operations", multiplier: 1, text: "Orders, returns and seller performance.", topics: ["Orders", "Returns", "SLAs", "Seller metrics"] },
    { id: "ecom-ads", name: "Marketplace Ads", multiplier: 1.1, text: "Sponsored product campaigns and ROAS.", topics: ["Sponsored ads", "ROAS", "Keywords", "Budgeting"] },
  ],
  "IT & Software": SOFTWARE,
  Design: DESIGN,
  Sales: SALES,
  Finance: FINANCE,
  HR: [
    { id: "sourcing", name: "Sourcing and Screening", multiplier: 1, text: "Talent sourcing and shortlisting.", topics: ["Boolean search", "Screening", "Pipelines", "ATS"] },
    { id: "interviewing", name: "Interviewing and Assessment", multiplier: 1, text: "Structured interviews and selection.", topics: ["Structured interviews", "Scorecards", "Bias", "Offers"] },
    { id: "hrops", name: "HR Operations", multiplier: 0.9, text: "Onboarding, policy and compliance.", topics: ["Onboarding", "Policy", "Compliance", "HRIS"] },
  ],
};

export const getSubDomains = (industry: string): SubDomain[] =>
  SUB_DOMAINS_BY_INDUSTRY[industry] ?? GENERIC;
