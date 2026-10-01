export type AssessmentType = "Knowledge" | "Practical" | "Functional";

export interface Question {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  skill: string;
}

export interface Assessment {
  id: string;
  title: string;
  industry: string;
  domain: string;
  experienceLevels: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  questionCount: number;
  type: AssessmentType;
  description: string;
  skills: string[];
  attempts: string;
  rating: string;
  proctored: boolean;
  creator: {
    kind: "expert" | "company";
    name: string;
    title: string;
    experience: string;
    expertise: string[];
    company: string;
  };
  questions: Question[];
}

export const INDUSTRIES = [
  "IT & Software",
  "Marketing",
  "Finance",
  "Design",
  "Sales",
  "E-commerce",
  "HR",
] as const;

export const DOMAINS: Record<string, string[]> = {
  "IT & Software": ["Software Development", "Data Science", "Cloud & DevOps", "Product Management"],
  Marketing: ["Digital Marketing", "SEO", "Performance Marketing", "Social Media Marketing"],
  Finance: ["Financial Analysis", "Banking Operations"],
  Design: ["UI/UX Design", "Graphic Design"],
  Sales: ["Inside Sales", "B2B Sales"],
  "E-commerce": ["Catalog & Operations", "Marketplace Growth"],
  HR: ["Talent Acquisition", "HR Operations"],
};

export const EXPERIENCE_LEVELS = [
  "Beginner",
  "0–1 Years",
  "1–3 Years",
  "3–5 Years",
  "5–8 Years",
  "8+ Years",
] as const;

const mcq = (
  id: string,
  prompt: string,
  options: string[],
  answer: number,
  skill: string
): Question => ({ id, prompt, options, answer, skill });

const genericQuestions = (skills: string[], label: string): Question[] =>
  Array.from({ length: 10 }, (_, i) =>
    mcq(
      `q${i + 1}`,
      `${label} — scenario ${i + 1}: Which approach best reflects current best practice for ${skills[i % skills.length]}?`,
      [
        "Prioritise the quickest possible fix and move on",
        "Measure the baseline, run a controlled change, then validate the impact",
        "Copy what a competitor appears to be doing",
        "Escalate the decision without any supporting data",
      ],
      1,
      skills[i % skills.length]
    )
  );

export const ASSESSMENTS: Assessment[] = [
  {
    id: "digital-marketing-fundamentals",
    title: "Digital Marketing Fundamentals",
    industry: "Marketing",
    domain: "Digital Marketing",
    experienceLevels: ["Beginner", "0–1 Years", "1–3 Years"],
    difficulty: "Intermediate",
    duration: "35 min",
    questionCount: 10,
    type: "Knowledge",
    description:
      "Covers campaign planning, channel mix, funnel metrics and analytics fundamentals across paid and organic marketing.",
    skills: ["Campaign Planning", "Analytics", "Paid Media", "Content Strategy"],
    attempts: "12,340+",
    rating: "4.8",
    proctored: true,
    creator: {
      kind: "expert",
      name: "Aarav Mehta",
      title: "Head of Growth",
      experience: "9+ Years Experience",
      expertise: ["Performance Marketing", "Analytics", "Lifecycle"],
      company: "Swiggy",
    },
    questions: genericQuestions(["Campaign Planning", "Analytics", "Paid Media", "Content Strategy"], "Digital Marketing"),
  },
  {
    id: "seo-assessment",
    title: "SEO Proficiency Assessment",
    industry: "Marketing",
    domain: "SEO",
    experienceLevels: ["1–3 Years", "3–5 Years"],
    difficulty: "Advanced",
    duration: "40 min",
    questionCount: 10,
    type: "Knowledge",
    description:
      "Technical SEO, keyword research, on-page optimisation and search performance analysis for mid-level specialists.",
    skills: ["Technical SEO", "Keyword Research", "On-page SEO", "Search Console"],
    attempts: "8,920+",
    rating: "4.7",
    proctored: true,
    creator: {
      kind: "expert",
      name: "Rohit Sen",
      title: "SEO Director",
      experience: "11+ Years Experience",
      expertise: ["Technical SEO", "Content Ops", "Analytics"],
      company: "HubSpot",
    },
    questions: genericQuestions(["Technical SEO", "Keyword Research", "On-page SEO", "Search Console"], "SEO"),
  },
  {
    id: "performance-marketing",
    title: "Performance Marketing Assessment",
    industry: "Marketing",
    domain: "Performance Marketing",
    experienceLevels: ["3–5 Years", "5–8 Years"],
    difficulty: "Advanced",
    duration: "45 min",
    questionCount: 10,
    type: "Knowledge",
    description:
      "Bidding strategy, attribution, creative testing and budget allocation across paid search and paid social.",
    skills: ["Bidding Strategy", "Attribution", "Creative Testing", "Budget Planning"],
    attempts: "6,110+",
    rating: "4.6",
    proctored: true,
    creator: {
      kind: "company",
      name: "Nykaa Growth Team",
      title: "Performance Marketing Practice",
      experience: "Assessment authored by practising media buyers",
      expertise: ["Paid Social", "Paid Search", "Attribution"],
      company: "Nykaa",
    },
    questions: genericQuestions(["Bidding Strategy", "Attribution", "Creative Testing", "Budget Planning"], "Performance Marketing"),
  },
  {
    id: "social-media-marketing",
    title: "Social Media Marketing",
    industry: "Marketing",
    domain: "Social Media Marketing",
    experienceLevels: ["Beginner", "0–1 Years", "1–3 Years"],
    difficulty: "Beginner",
    duration: "30 min",
    questionCount: 10,
    type: "Knowledge",
    description: "Content calendars, community management, platform algorithms and social performance reporting.",
    skills: ["Content Calendar", "Community", "Reporting", "Creative Briefing"],
    attempts: "5,480+",
    rating: "4.5",
    proctored: true,
    creator: {
      kind: "expert",
      name: "Neha Kapoor",
      title: "Social Lead",
      experience: "7+ Years Experience",
      expertise: ["Community", "Creator Marketing"],
      company: "Cred",
    },
    questions: genericQuestions(["Content Calendar", "Community", "Reporting", "Creative Briefing"], "Social Media"),
  },
  {
    id: "ecommerce-functional-test",
    title: "E-commerce Product Functional Test",
    industry: "E-commerce",
    domain: "Catalog & Operations",
    experienceLevels: ["0–1 Years", "1–3 Years", "3–5 Years"],
    difficulty: "Intermediate",
    duration: "25 min",
    questionCount: 10,
    type: "Functional",
    description:
      "A hands-on task-based test: work inside a mock storefront to add products, apply coupons and validate checkout states.",
    skills: ["Cart Operations", "Coupons", "Variants", "Catalog QA"],
    attempts: "3,240+",
    rating: "4.9",
    proctored: true,
    creator: {
      kind: "company",
      name: "Meesho Operations",
      title: "Marketplace Operations Practice",
      experience: "Built by the team that runs seller onboarding at scale",
      expertise: ["Catalog QA", "Order Flow", "Returns"],
      company: "Meesho",
    },
    questions: genericQuestions(["Cart Operations", "Coupons", "Variants", "Catalog QA"], "E-commerce Operations"),
  },
  {
    id: "python-developer",
    title: "Python Developer Assessment",
    industry: "IT & Software",
    domain: "Software Development",
    experienceLevels: ["1–3 Years", "3–5 Years"],
    difficulty: "Intermediate",
    duration: "60 min",
    questionCount: 10,
    type: "Practical",
    description: "Core Python, data structures, debugging and applied problem solving for working developers.",
    skills: ["Core Python", "Data Structures", "Debugging", "APIs"],
    attempts: "14,210+",
    rating: "4.8",
    proctored: true,
    creator: {
      kind: "expert",
      name: "Vikram Shetty",
      title: "Principal Engineer",
      experience: "12+ Years Experience",
      expertise: ["Backend", "Distributed Systems"],
      company: "Razorpay",
    },
    questions: genericQuestions(["Core Python", "Data Structures", "Debugging", "APIs"], "Python"),
  },
  {
    id: "data-analytics",
    title: "Data Analytics Proficiency",
    industry: "IT & Software",
    domain: "Data Science",
    experienceLevels: ["1–3 Years", "3–5 Years", "5–8 Years"],
    difficulty: "Advanced",
    duration: "50 min",
    questionCount: 10,
    type: "Knowledge",
    description: "SQL, statistics, dashboarding and analytical storytelling for analysts and senior analysts.",
    skills: ["SQL", "Statistics", "Visualisation", "Business Insight"],
    attempts: "9,780+",
    rating: "4.7",
    proctored: true,
    creator: {
      kind: "company",
      name: "Flipkart Analytics",
      title: "Analytics Centre of Excellence",
      experience: "Authored by senior analytics leads",
      expertise: ["SQL", "Experimentation", "BI"],
      company: "Flipkart",
    },
    questions: genericQuestions(["SQL", "Statistics", "Visualisation", "Business Insight"], "Data Analytics"),
  },
  {
    id: "ui-ux-design",
    title: "UI/UX Design Evaluation",
    industry: "Design",
    domain: "UI/UX Design",
    experienceLevels: ["0–1 Years", "1–3 Years", "3–5 Years"],
    difficulty: "Intermediate",
    duration: "45 min",
    questionCount: 10,
    type: "Practical",
    description: "Interaction patterns, usability heuristics, design systems and research-informed decision making.",
    skills: ["Usability", "Design Systems", "Interaction Design", "Research"],
    attempts: "6,450+",
    rating: "4.9",
    proctored: true,
    creator: {
      kind: "expert",
      name: "Priya Iyer",
      title: "Design Lead",
      experience: "8+ Years Experience",
      expertise: ["Product Design", "Design Systems"],
      company: "Zomato",
    },
    questions: genericQuestions(["Usability", "Design Systems", "Interaction Design", "Research"], "UI/UX"),
  },
  {
    id: "product-management",
    title: "Product Management Assessment",
    industry: "IT & Software",
    domain: "Product Management",
    experienceLevels: ["3–5 Years", "5–8 Years", "8+ Years"],
    difficulty: "Advanced",
    duration: "55 min",
    questionCount: 10,
    type: "Knowledge",
    description: "Discovery, prioritisation, metrics and go-to-market judgement for product managers.",
    skills: ["Discovery", "Prioritisation", "Metrics", "GTM"],
    attempts: "4,320+",
    rating: "4.6",
    proctored: true,
    creator: {
      kind: "expert",
      name: "Ananya Rao",
      title: "Group Product Manager",
      experience: "10+ Years Experience",
      expertise: ["Marketplace", "Growth", "Monetisation"],
      company: "PhonePe",
    },
    questions: genericQuestions(["Discovery", "Prioritisation", "Metrics", "GTM"], "Product Management"),
  },
  {
    id: "sales-fundamentals",
    title: "Sales Fundamentals",
    industry: "Sales",
    domain: "B2B Sales",
    experienceLevels: ["Beginner", "0–1 Years", "1–3 Years"],
    difficulty: "Beginner",
    duration: "30 min",
    questionCount: 10,
    type: "Knowledge",
    description: "Prospecting, discovery calls, objection handling and pipeline hygiene for B2B sellers.",
    skills: ["Prospecting", "Discovery", "Objection Handling", "Pipeline"],
    attempts: "7,020+",
    rating: "4.5",
    proctored: true,
    creator: {
      kind: "expert",
      name: "Karan Malhotra",
      title: "VP Sales",
      experience: "13+ Years Experience",
      expertise: ["Enterprise Sales", "Sales Enablement"],
      company: "Freshworks",
    },
    questions: genericQuestions(["Prospecting", "Discovery", "Objection Handling", "Pipeline"], "Sales"),
  },
  {
    id: "financial-analysis",
    title: "Financial Analysis Assessment",
    industry: "Finance",
    domain: "Financial Analysis",
    experienceLevels: ["1–3 Years", "3–5 Years"],
    difficulty: "Intermediate",
    duration: "45 min",
    questionCount: 10,
    type: "Knowledge",
    description: "Statement analysis, valuation basics, forecasting and variance reporting.",
    skills: ["Statement Analysis", "Valuation", "Forecasting", "Reporting"],
    attempts: "3,890+",
    rating: "4.6",
    proctored: true,
    creator: {
      kind: "company",
      name: "HDFC Finance Academy",
      title: "Corporate Finance Practice",
      experience: "Authored by practising finance controllers",
      expertise: ["FP&A", "Controls"],
      company: "HDFC",
    },
    questions: genericQuestions(["Statement Analysis", "Valuation", "Forecasting", "Reporting"], "Finance"),
  },
  {
    id: "talent-acquisition",
    title: "Talent Acquisition Assessment",
    industry: "HR",
    domain: "Talent Acquisition",
    experienceLevels: ["1–3 Years", "3–5 Years", "5–8 Years"],
    difficulty: "Intermediate",
    duration: "35 min",
    questionCount: 10,
    type: "Knowledge",
    description: "Sourcing strategy, structured interviewing, candidate experience and hiring metrics.",
    skills: ["Sourcing", "Structured Interviews", "Candidate Experience", "Hiring Metrics"],
    attempts: "2,760+",
    rating: "4.5",
    proctored: true,
    creator: {
      kind: "expert",
      name: "Sneha Pillai",
      title: "Head of Talent",
      experience: "9+ Years Experience",
      expertise: ["Tech Hiring", "Employer Brand"],
      company: "Zerodha",
    },
    questions: genericQuestions(["Sourcing", "Structured Interviews", "Candidate Experience", "Hiring Metrics"], "Talent Acquisition"),
  },
];

export const getAssessment = (id?: string) => ASSESSMENTS.find((a) => a.id === id);
