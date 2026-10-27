import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import SectionBadge from "@/components/ui/section-badge";
import { cn } from "@/lib/utils";
import heroImg from "@/assets/si-guide-img-1.jpg";
import path1Img from "@/assets/si-guide-img-2.jpg";
import path2Img from "@/assets/si-guide-img-3.jpg";
import {
  Sparkles,
  GraduationCap,
  Compass,
  Briefcase,
  TrendingUp,
  Award,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Search,
  ChevronRight,
  BookOpen,
  FileCheck2,
  UserCheck,
  Target,
  BarChart3,
  Layers,
  ShieldCheck,
  Zap,
  Globe2,
  Wrench,
  BadgeCheck,
  SlidersHorizontal,
  RefreshCw,
  Check,
  Calendar,
  Building2,
  Wallet,
} from "lucide-react";

type DiscoveryPath = "degree" | "beyond" | "all";
type DetailTab =
  | "overview"
  | "responsibilities"
  | "eligibility"
  | "skills"
  | "salary"
  | "outlook";

interface CareerRole {
  id: string;
  title: string;
  categoryTags: string[];
  badgeNote: string;
  pathway: "degree" | "beyond" | "both";
  matchScore: number;
  industry: string;
  experienceLevel: "Fresher" | "Experienced" | "Career Switcher" | "All Levels";
  locations: string[];
  eligibleDegrees: string[];
  degreeEligibilityNote: string;
  overview: string;
  orgFit: string;
  responsibilities: string[];
  deliverables: string[];
  acceptedDegrees: string[];
  entryRoutes: string[];
  essentialSkills: string[];
  preferredSkills: string[];
  toolsRequired: string[];
  certifications: string[];
  projectProof: string[];
  salaryIndia: {
    entry: string;
    entryRange: [number, number];
    mid: string;
    midRange: [number, number];
    senior: string;
    seniorRange: [number, number];
  };
  futureDemand: {
    demandLevel: "High Growth" | "Strong & Steady" | "Emerging Rapidly";
    trendSummary: string;
    aiImpact: string;
    emergingTech: string[];
    futureSkills: string[];
    advancementPath: string[];
    relatedRoles: string[];
    sourceCitation: string;
  };
}

const CAREER_ROLES: CareerRole[] = [
  {
    id: "bde",
    title: "Business Development Executive",
    categoryTags: ["Sales", "Business", "Client Relations"],
    badgeNote: "Example role for a BBA graduate",
    pathway: "both",
    matchScore: 96,
    industry: "B2B SaaS, IT Services & Consulting",
    experienceLevel: "Fresher",
    locations: ["Bengaluru", "Mumbai", "Delhi NCR", "Hyderabad", "Remote / Hybrid"],
    eligibleDegrees: ["BBA", "B.Com", "MBA", "BA", "B.Tech", "B.Sc."],
    degreeEligibilityNote: "Direct fit for BBA / MBA / B.Com; open to all analytical graduates",
    overview:
      "Drives revenue growth by identifying new business opportunities, qualifying enterprise leads, building client relationships, and collaborating with product and account teams to close strategic deals.",
    orgFit:
      "Sits within the Revenue, Growth, or Commercial Strategy function—acting as the bridge between prospective clients, marketing campaigns, and solution delivery teams.",
    responsibilities: [
      "Research target industries, accounts, and decision-makers to build a qualified outbound and inbound pipeline.",
      "Conduct discovery calls and consultative product demonstrations tailored to client business pain points.",
      "Collaborate with marketing and pre-sales teams to craft proposals, ROI decks, and commercial quotes.",
      "Maintain accurate pipeline hygiene and forecasting inside CRM systems (HubSpot, Salesforce, Zoho CRM).",
      "Negotiate commercial terms and ensure smooth handoff to Customer Success after deal closure.",
    ],
    deliverables: [
      "Monthly qualified pipeline generation (SQLs) & demo booking targets",
      "Quarterly revenue quota attainment & conversion rate benchmarks",
      "Client discovery notes, proposal decks, and accurate CRM deal logs",
    ],
    acceptedDegrees: [
      "BBA / BMS (Marketing, International Business, General Management)",
      "B.Com / BA (Economics, Corporate Communication)",
      "MBA / PGDM (Marketing & Strategy)",
      "B.Tech / B.Sc. graduates transitioning into Tech Sales & Revenue roles",
    ],
    entryRoutes: [
      "Campus placement or fresher SDR / BDE trainee fellowship",
      "6-month growth internship followed by full-time conversion",
      "Talent CIR Verified Communication & Commercial Aptitude Assessment",
    ],
    essentialSkills: [
      "Consultative Communication",
      "Lead Qualification & Discovery",
      "Commercial Negotiation",
      "Active Listening & Objection Handling",
      "Business Email & Proposal Writing",
    ],
    preferredSkills: [
      "B2B SaaS Funnel Metrics (CAC, LTV, Conversion Rate)",
      "Account-Based Prospecting",
      "Executive Presentation & Storytelling",
      "Cross-Functional Stakeholder Management",
    ],
    toolsRequired: [
      "HubSpot CRM / Salesforce",
      "LinkedIn Sales Navigator",
      "Apollo.io / Lusha",
      "Microsoft Excel & PowerPoint",
      "Google Workspace & Zoom",
    ],
    certifications: [
      "Talent CIR Certified Commercial & Sales Readiness (Level 1)",
      "HubSpot Inbound Sales & Frictionless Sales Certification",
      "Salesforce Sales Operations Professional Certificate",
    ],
    projectProof: [
      "Go-To-Market (GTM) Lead Generation Playbook for a B2B SaaS Product",
      "Recorded 5-Minute Mock Discovery & Pitch Assessment on Talent CIR",
      "Cold Outreach Sequence & CRM Pipeline Dashboard Case Study",
    ],
    salaryIndia: {
      entry: "₹4.2 LPA – ₹6.8 LPA",
      entryRange: [4.2, 6.8],
      mid: "₹8.5 LPA – ₹14.5 LPA",
      midRange: [8.5, 14.5],
      senior: "₹18.0 LPA – ₹32.0 LPA+",
      seniorRange: [18.0, 32.0],
    },
    futureDemand: {
      demandLevel: "High Growth",
      trendSummary:
        "Indian B2B SaaS, Global Capability Centres (GCCs), and enterprise tech exports continue to expand consultative sales and revenue operations teams across Tier-1 and hybrid hubs.",
      aiImpact:
        "AI copilot tools automate repetitive prospect research and email drafting, increasing the value of human relationship building, strategic negotiation, and consultative trust.",
      emergingTech: [
        "AI Revenue Intelligence (Gong, Clari)",
        "Automated Prospecting & Intent Data Signals",
        "Predictive CRM Lead Scoring",
      ],
      futureSkills: [
        "AI-Assisted Prospecting Workflows",
        "Value-Based Consultative Selling",
        "Revenue Operations (RevOps) Analytics",
      ],
      advancementPath: [
        "Business Development Executive (0–2 yrs)",
        "Senior Account Executive / BDM (2–5 yrs)",
        "Regional Sales Manager / Growth Lead (5–8 yrs)",
        "VP of Revenue / Chief Commercial Officer (8+ yrs)",
      ],
      relatedRoles: [
        "Customer Success Executive",
        "Partnerships & Alliances Associate",
        "Revenue Operations Analyst",
        "Pre-Sales Solutions Consultant",
      ],
      sourceCitation:
        "NASSCOM – SaaS & Enterprise Growth Report & LinkedIn India Jobs on the Rise (Q1 2026)",
    },
  },
  {
    id: "dme",
    title: "Digital Marketing Executive",
    categoryTags: ["Marketing", "Content", "Campaigns"],
    badgeNote: "May require relevant skills or portfolio",
    pathway: "both",
    matchScore: 94,
    industry: "E-Commerce, D2C Brands, Media & Tech",
    experienceLevel: "Fresher",
    locations: ["Mumbai", "Bengaluru", "Delhi NCR", "Chennai", "Remote / Hybrid"],
    eligibleDegrees: ["BBA", "BA", "B.Com", "MBA", "B.Sc.", "B.Tech"],
    degreeEligibilityNote: "Open to BBA / Media / Arts & any degree with a verified campaign portfolio",
    overview:
      "Plans, executes, and optimises multi-channel digital campaigns across search, social, content, and performance channels to grow brand visibility, user acquisition, and measurable ROI.",
    orgFit:
      "Operates inside the Brand, Growth Marketing, or Demand Generation team—working closely with creative designers, product managers, and sales teams.",
    responsibilities: [
      "Plan and execute SEO, SEM (Google Ads), and paid social campaigns (Meta, LinkedIn, YouTube).",
      "Create high-converting content calendars, landing page copy, and email nurture workflows.",
      "Track campaign KPIs (CTR, CPC, ROAS, CPA, Organic Traffic) using Google Analytics 4.",
      "Run A/B tests on ad creatives, headlines, and audience segments to improve conversion rates.",
      "Prepare weekly growth attribution reports and actionable insights for marketing leadership.",
    ],
    deliverables: [
      "Monthly organic traffic growth & search keyword ranking improvements",
      "Paid campaign Return on Ad Spend (ROAS) & qualified lead generation targets",
      "Content calendar execution & conversion rate optimisation (CRO) experiments",
    ],
    acceptedDegrees: [
      "BBA / BMS / MBA in Marketing or Digital Business",
      "BA in Journalism, Mass Communication, English, or Psychology",
      "B.Com / B.Sc. / B.Tech graduates with practical digital marketing projects",
    ],
    entryRoutes: [
      "Portfolio-backed direct entry (live blog, social page, or ad campaign case study)",
      "Digital marketing apprenticeship at a performance agency or D2C startup",
      "Talent CIR Growth & Digital Marketing Practical Assessment",
    ],
    essentialSkills: [
      "Search Engine Optimisation (SEO)",
      "Social Media & Content Strategy",
      "Performance Marketing Basics (Meta & Google Ads)",
      "Marketing Copywriting & Storytelling",
      "Web Analytics & Funnel Tracking",
    ],
    preferredSkills: [
      "Conversion Rate Optimisation (CRO)",
      "Marketing Automation & CRM Journeys",
      "AI Content & Creative Prompt Engineering",
      "Short-Form Video & Creator Collaboration",
    ],
    toolsRequired: [
      "Google Analytics 4 (GA4) & Search Console",
      "Google Ads & Meta Ads Manager",
      "Ahrefs / SEMrush",
      "Canva / Figma Basics",
      "Mailchimp / HubSpot Marketing Hub",
    ],
    certifications: [
      "Talent CIR Verified Digital Marketing & Growth Specialist",
      "Google Ads Search & Google Analytics 4 Certification",
      "Meta Certified Digital Marketing Associate",
    ],
    projectProof: [
      "SEO Audit & 90-Day Organic Traffic Growth Blueprint for a Live Brand",
      "Mock ₹25,000 Performance Ad Campaign Media Plan with ROAS Forecast",
      "High-Converting Landing Page Copy + 5-Email Drip Sequence Portfolio",
    ],
    salaryIndia: {
      entry: "₹3.8 LPA – ₹6.2 LPA",
      entryRange: [3.8, 6.2],
      mid: "₹7.5 LPA – ₹13.5 LPA",
      midRange: [7.5, 13.5],
      senior: "₹16.0 LPA – ₹28.0 LPA+",
      seniorRange: [16.0, 28.0],
    },
    futureDemand: {
      demandLevel: "High Growth",
      trendSummary:
        "Rapid growth in Indian D2C brands, regional digital adoption, and global SaaS customer acquisition fuels sustained demand for data-literate marketers.",
      aiImpact:
        "Generative AI accelerates copy and creative variants, shifting marketer focus toward audience psychology, attribution analytics, brand authenticity, and omnichannel strategy.",
      emergingTech: [
        "Generative AI Creative & Copy Suites",
        "Answer Engine Optimisation (AEO / AI Search)",
        "First-Party Privacy-Safe Customer Data Platforms (CDPs)",
      ],
      futureSkills: [
        "AI Search & Answer Engine Optimisation (AEO)",
        "Full-Funnel Revenue Attribution",
        "Lifecycle & Retention Marketing",
      ],
      advancementPath: [
        "Digital Marketing Executive (0–2 yrs)",
        "Performance / Growth Marketing Specialist (2–4 yrs)",
        "Growth Marketing Manager (4–7 yrs)",
        "Head of Growth / Chief Marketing Officer (7+ yrs)",
      ],
      relatedRoles: [
        "Performance Marketing Analyst",
        "Content & Brand Strategist",
        "Product Marketing Associate",
        "E-Commerce Category Growth Specialist",
      ],
      sourceCitation:
        "IAMAI – Kantar Digital India Report & Dentsu India Digital Ad Spend Outlook (2026)",
    },
  },
  {
    id: "hre",
    title: "HR & Recruitment Executive",
    categoryTags: ["Human Resources", "Talent Acquisition"],
    badgeNote: "Requirements vary by employer",
    pathway: "both",
    matchScore: 91,
    industry: "IT Services, BFSI, Healthcare & Enterprise GCCs",
    experienceLevel: "Fresher",
    locations: ["Bengaluru", "Hyderabad", "Pune", "Mumbai", "Chennai"],
    eligibleDegrees: ["BBA", "MBA", "BA", "B.Com", "B.Sc."],
    degreeEligibilityNote: "Preferred for BBA / MBA (HR) & Psychology; open to strong communicators across degrees",
    overview:
      "Manages end-to-end talent acquisition, structured candidate screening, employer branding, and onboarding experiences to help organisations build high-performing teams.",
    orgFit:
      "Part of the People Operations, Talent Acquisition, or Human Capital team—partnering directly with engineering, sales, and business hiring managers.",
    responsibilities: [
      "Partner with hiring managers to understand role requirements, skill rubrics, and compensation bands.",
      "Source candidates through job portals, LinkedIn Recruiter, employee referrals, and skill assessment platforms.",
      "Conduct structured screening interviews and administer verified skill assessments (e.g., Talent CIR).",
      "Coordinate interview loops, collect rubric-based feedback, and manage offer negotiations.",
      "Drive smooth pre-boarding, documentation verification, and Day-1 employee induction programs.",
    ],
    deliverables: [
      "Time-to-Hire & Quality-of-Hire metrics across open requisitions",
      "Offer-to-Joining ratio & structured candidate experience scores",
      "Onboarding completion accuracy & HRIS data compliance",
    ],
    acceptedDegrees: [
      "BBA / MBA / PGDM in Human Resource Management",
      "BA / B.Sc. in Psychology, Sociology, or Organisational Behaviour",
      "B.Com / B.Tech graduates interested in Technical Recruiting & People Analytics",
    ],
    entryRoutes: [
      "Talent Acquisition Trainee or Campus HR Executive role",
      "Technical Recruiter fellowship in staffing or GCC organisations",
      "Talent CIR Certified People Operations & Structured Hiring Assessment",
    ],
    essentialSkills: [
      "End-to-End Talent Sourcing & Screening",
      "Behavioral & Competency Interviewing",
      "Stakeholder & Candidate Communication",
      "HR Operations & Onboarding Coordination",
      "Employer Branding & Talent Community Building",
    ],
    preferredSkills: [
      "Boolean Search & X-Ray Sourcing",
      "People Analytics & Hiring Funnel Metrics",
      "Indian Labour Law & Compliance Basics",
      "Skill-First Assessment Interpretation (CIR Reports)",
    ],
    toolsRequired: [
      "LinkedIn Recruiter",
      "ATS Platforms (Greenhouse, Lever, Darwinbox, Keka)",
      "Talent CIR Assessment & Proctoring Suite",
      "MS Excel / Google Sheets",
    ],
    certifications: [
      "Talent CIR Certified Skill-First Recruiter",
      "SHRM-CP Foundation / HRCI Associate Certificate",
      "LinkedIn Certified Professional – Recruiter",
    ],
    projectProof: [
      "Structured Competency Rubric & Hiring Scorecard for 3 Core Roles",
      "Boolean Sourcing String Library + 30-Day Talent Pipeline Strategy",
      "Employee Onboarding & 30-60-90 Day Engagement Playbook",
    ],
    salaryIndia: {
      entry: "₹3.5 LPA – ₹5.5 LPA",
      entryRange: [3.5, 5.5],
      mid: "₹6.8 LPA – ₹12.0 LPA",
      midRange: [6.8, 12.0],
      senior: "₹15.0 LPA – ₹26.0 LPA+",
      seniorRange: [15.0, 26.0],
    },
    futureDemand: {
      demandLevel: "Strong & Steady",
      trendSummary:
        "As companies shift from resume-keyword screening to verified skill-based hiring, HR executives who can interpret AI proctored assessments and talent analytics are in high demand.",
      aiImpact:
        "AI automates resume parsing and interview scheduling, elevating HR professionals into strategic talent advisors focused on culture fit, retention, and fair skill evaluation.",
      emergingTech: [
        "AI-Driven Skill & CIR Readiness Platforms",
        "Predictive Attrition & People Analytics",
        "Automated HRIS & Self-Serve Onboarding Bots",
      ],
      futureSkills: [
        "Skills-Based Workforce Planning",
        "People Data Analytics & DEI Metrics",
        "Employer Brand Storytelling",
      ],
      advancementPath: [
        "HR & Recruitment Executive (0–2 yrs)",
        "Senior Talent Acquisition Specialist / HRBP (2–5 yrs)",
        "Talent Acquisition Manager / People Ops Lead (5–8 yrs)",
        "Director of People / Chief Human Resources Officer (8+ yrs)",
      ],
      relatedRoles: [
        "Technical Recruiter",
        "HR Business Partner (HRBP) Associate",
        "People Analytics Specialist",
        "Learning & Development (L&D) Coordinator",
      ],
      sourceCitation:
        "Deloitte Global Human Capital Trends – India Perspective & SHRM India Talent Report (2026)",
    },
  },
  {
    id: "ba",
    title: "Product Operations & Business Analyst",
    categoryTags: ["Business", "Analytics", "Operations"],
    badgeNote: "High-growth bridge role between Business & Tech",
    pathway: "beyond",
    matchScore: 92,
    industry: "FinTech, SaaS, E-Commerce & Consulting",
    experienceLevel: "Fresher",
    locations: ["Bengaluru", "Mumbai", "Hyderabad", "Gurugram", "Remote / Hybrid"],
    eligibleDegrees: ["B.Tech", "BBA", "B.Com", "MBA", "B.Sc.", "BA"],
    degreeEligibilityNote: "Accepts any degree with strong SQL, Excel, and structured problem-solving skills",
    overview:
      "Translates business problems into data-backed insights, process workflows, and product requirements—helping leadership make faster, evidence-based operational and product decisions.",
    orgFit:
      "Embedded within Product, Strategy, or Central Operations—collaborating daily with engineers, finance, customer support, and executive leadership.",
    responsibilities: [
      "Gather, clean, and analyse operational and customer data using SQL, Excel, and BI tools.",
      "Document business requirements (BRDs), user stories, and process flowcharts for engineering teams.",
      "Build live KPI dashboards tracking revenue leakage, funnel drop-offs, and SLA adherence.",
      "Conduct root-cause analysis on operational bottlenecks and recommend automation solutions.",
      "Coordinate UAT (User Acceptance Testing) and rollout training for new product features.",
    ],
    deliverables: [
      "Automated weekly KPI dashboards in Power BI / Tableau",
      "Business Requirement Documents (BRDs) & workflow maps",
      "Process efficiency & cost-saving impact reports",
    ],
    acceptedDegrees: [
      "B.Tech / B.E. (All branches)",
      "BBA / B.Com / MBA (Finance, Operations, Business Analytics)",
      "B.Sc. / BA in Economics, Mathematics, or Statistics",
    ],
    entryRoutes: [
      "Direct campus or off-campus Business Analyst hiring track",
      "Operations Executive to Business Analyst internal transition",
      "Talent CIR Analytical Reasoning, SQL & Case Study Certification",
    ],
    essentialSkills: [
      "Advanced Excel & Spreadsheet Modelling",
      "SQL Querying & Data Extraction",
      "Data Visualisation (Power BI / Tableau)",
      "Structured Problem Solving & Root-Cause Analysis",
      "Requirement Gathering & Documentation (BRD/FRD)",
    ],
    preferredSkills: [
      "Python Basics for Data Analysis (Pandas)",
      "Agile / Scrum Workflow Management",
      "A/B Experimentation & Funnel Metrics",
      "Financial & Unit Economics Modelling",
    ],
    toolsRequired: [
      "SQL (PostgreSQL / MySQL / BigQuery)",
      "Microsoft Power BI / Tableau",
      "Advanced MS Excel",
      "Jira & Confluence",
      "Figma / Miro (Process Mapping)",
    ],
    certifications: [
      "Talent CIR Verified Business & Data Analyst (Level 2)",
      "Microsoft Certified: Power BI Data Analyst Associate",
      "Google Data Analytics Professional Certificate",
    ],
    projectProof: [
      "End-to-End SQL + Power BI E-Commerce Profitability Dashboard",
      "Product Requirement Document (PRD) & Funnel Drop-Off Case Study",
      "Operational Bottleneck Root-Cause Analysis Report",
    ],
    salaryIndia: {
      entry: "₹5.5 LPA – ₹8.5 LPA",
      entryRange: [5.5, 8.5],
      mid: "₹10.0 LPA – ₹17.5 LPA",
      midRange: [10.0, 17.5],
      senior: "₹20.0 LPA – ₹36.0 LPA+",
      seniorRange: [20.0, 36.0],
    },
    futureDemand: {
      demandLevel: "Emerging Rapidly",
      trendSummary:
        "Indian FinTechs, GCCs, and quick-commerce leaders rely heavily on Business and Product Operations Analysts to turn real-time data into profitable operational execution.",
      aiImpact:
        "Natural-language BI tools speed up basic chart creation, making domain context, root-cause questioning, and cross-team execution the top differentiators.",
      emergingTech: [
        "AI-Copilot BI & Automated SQL Generation",
        "Process Mining & Workflow Automation (n8n, Zapier)",
        "Real-Time Predictive Operations Telemetry",
      ],
      futureSkills: [
        "AI Workflow Automation Design",
        "Product Growth Telemetry",
        "Strategic Commercial Modelling",
      ],
      advancementPath: [
        "Business / Product Ops Analyst (0–2 yrs)",
        "Senior Business Analyst / Associate PM (2–5 yrs)",
        "Product Manager / Strategy & Ops Lead (5–8 yrs)",
        "VP of Product / Chief Operating Officer (8+ yrs)",
      ],
      relatedRoles: [
        "Data Analyst",
        "Associate Product Manager (APM)",
        "Strategy & Operations Associate",
        "Financial Planning & Analysis (FP&A) Analyst",
      ],
      sourceCitation:
        "World Economic Forum Future of Jobs Report & AIM India Analytics Study (2026)",
    },
  },
  {
    id: "csm",
    title: "Customer Success & Account Specialist",
    categoryTags: ["Client Relations", "Business", "SaaS"],
    badgeNote: "Accepts candidates across all educational backgrounds",
    pathway: "beyond",
    matchScore: 90,
    industry: "Global SaaS, Cloud Platforms & EdTech",
    experienceLevel: "Fresher",
    locations: ["Bengaluru", "Chennai", "Pune", "Hyderabad", "Remote / Hybrid"],
    eligibleDegrees: ["BBA", "BA", "B.Com", "B.Sc.", "B.Tech", "MBA"],
    degreeEligibilityNote: "Degree-agnostic; prioritises empathy, problem solving, and product fluency",
    overview:
      "Ensures B2B customers achieve measurable value after purchasing a software product—driving smooth onboarding, high product adoption, contract renewals, and account expansion.",
    orgFit:
      "Sits in Post-Sales Revenue / Customer Experience—acting as the trusted advisor to customers and the voice of the customer inside product teams.",
    responsibilities: [
      "Lead structured onboarding and training sessions for new enterprise and SMB customers.",
      "Monitor customer health scores, feature adoption metrics, and usage milestones.",
      "Conduct Quarterly Business Reviews (QBRs) showcasing ROI delivered to client executives.",
      "Proactively identify churn risks and collaborate with support/engineering to resolve blockers.",
      "Spot upsell and cross-sell expansion opportunities within healthy customer accounts.",
    ],
    deliverables: [
      "Net Revenue Retention (NRR) & Gross Renewal Rate targets",
      "Customer onboarding time-to-value (TTV) & CSAT / NPS scores",
      "Quarterly Business Review (QBR) decks & account health logs",
    ],
    acceptedDegrees: [
      "Open to all Bachelor's & Master's degrees (BBA, BA, B.Com, B.Sc., B.Tech, MBA)",
    ],
    entryRoutes: [
      "Customer Onboarding Associate or Junior CSM role at SaaS companies",
      "Transition from BDE, Account Management, or Technical Support",
      "Talent CIR Client Communication & SaaS Readiness Assessment",
    ],
    essentialSkills: [
      "Relationship Management & Executive Presence",
      "Product Onboarding & Walkthrough Delivery",
      "Customer Health & Retention Analysis",
      "De-escalation & Problem Resolution",
      "Cross-Functional Collaboration",
    ],
    preferredSkills: [
      "SaaS Metrics (NRR, Churn, Expansion MRR)",
      "Technical Troubleshooting Basics (APIs / Webhooks)",
      "QBR Storytelling & ROI Calculation",
    ],
    toolsRequired: [
      "Gainsight / ChurnZero / HubSpot Service Hub",
      "Zendesk / Intercom",
      "Loom & Notion",
      "Excel / Google Sheets",
    ],
    certifications: [
      "Talent CIR Certified Customer Success Professional",
      "SuccessHACKER Certified Customer Success Manager (CCSM) Level 1",
      "HubSpot Service Hub Software Certification",
    ],
    projectProof: [
      "30-60-90 Day Enterprise SaaS Onboarding Blueprint",
      "Mock Quarterly Business Review (QBR) Deck & Churn Mitigation Plan",
      "Recorded Product Walkthrough & Objection Handling Demo",
    ],
    salaryIndia: {
      entry: "₹4.5 LPA – ₹7.0 LPA",
      entryRange: [4.5, 7.0],
      mid: "₹8.5 LPA – ₹15.0 LPA",
      midRange: [8.5, 15.0],
      senior: "₹18.0 LPA – ₹30.0 LPA+",
      seniorRange: [18.0, 30.0],
    },
    futureDemand: {
      demandLevel: "High Growth",
      trendSummary:
        "Subscription businesses win on retention. Indian SaaS companies serving global markets actively hire Customer Success teams to protect and expand recurring revenue.",
      aiImpact:
        "AI handles Tier-1 ticket answers automatically, making CSMs strategic account consultants focused on executive alignment, workflow adoption, and business outcomes.",
      emergingTech: [
        "Predictive Churn & Usage Telemetry AI",
        "Automated In-App Digital Adoption Platforms (Whatfix, Pendo)",
        "Conversational AI Support Copilots",
      ],
      futureSkills: [
        "Commercial Account Expansion (CS-Led Growth)",
        "Digital Adoption Architecture",
        "Executive ROI Advisory",
      ],
      advancementPath: [
        "Customer Success Associate (0–2 yrs)",
        "Customer Success Manager – Mid-Market (2–5 yrs)",
        "Enterprise CSM / Team Lead (5–8 yrs)",
        "VP of Customer Success / Chief Customer Officer (8+ yrs)",
      ],
      relatedRoles: [
        "Account Manager",
        "Implementation & Onboarding Consultant",
        "Solutions Specialist",
        "Product Operations Associate",
      ],
      sourceCitation:
        "SaaSBOOMi & McKinsey India SaaS Report (2026)",
    },
  },
  {
    id: "fsd",
    title: "Full-Stack / AI Associate Engineer",
    categoryTags: ["Technology", "Software", "AI Engineering"],
    badgeNote: "Eligible for B.Tech / BCA / B.Sc. or verified coding portfolio",
    pathway: "both",
    matchScore: 89,
    industry: "Software Product, FinTech, AI Startups & GCCs",
    experienceLevel: "Fresher",
    locations: ["Bengaluru", "Hyderabad", "Pune", "Chennai", "Remote / Hybrid"],
    eligibleDegrees: ["B.Tech", "B.Sc.", "BCA", "MCA", "BBA"],
    degreeEligibilityNote: "Primary fit for B.Tech / B.Sc. (CS); open to non-CS via verified GitHub + CIR Coding score",
    overview:
      "Builds, tests, and deploys responsive web applications, backend APIs, and AI-integrated product features that power modern digital platforms.",
    orgFit:
      "Core member of the Product Engineering team—working in Agile sprints alongside product managers, UI/UX designers, and QA engineers.",
    responsibilities: [
      "Develop responsive front-end interfaces using React, TypeScript, and modern CSS frameworks.",
      "Design and maintain scalable REST/GraphQL APIs and relational/NoSQL databases.",
      "Integrate LLM APIs, retrieval workflows, and automated validation into user-facing features.",
      "Write unit and integration tests, participate in code reviews, and maintain CI/CD pipelines.",
      "Debug production issues and optimise application performance and security.",
    ],
    deliverables: [
      "Production-ready full-stack features shipped per sprint",
      "Clean, tested, and documented repositories with CI/CD checks",
      "API latency, uptime, and security compliance benchmarks",
    ],
    acceptedDegrees: [
      "B.Tech / B.E. (CS, IT, ECE, or allied branches)",
      "BCA / MCA / B.Sc. (Computer Science / IT)",
      "Any graduate with a high Talent CIR Proctored Coding & System Design percentile",
    ],
    entryRoutes: [
      "Direct product engineering fresher hiring via proctored skill assessments",
      "Open-source contributions + deployed full-stack capstone portfolio",
      "Talent CIR Verified Full-Stack Engineering & DSA Certification",
    ],
    essentialSkills: [
      "JavaScript / TypeScript & React",
      "Node.js / Python Backend APIs",
      "SQL & Database Design",
      "Git, GitHub & Collaborative Workflows",
      "Data Structures, Debugging & Problem Solving",
    ],
    preferredSkills: [
      "LLM API Integration & Prompt Orchestration",
      "Cloud Deployment (AWS / Vercel / Docker)",
      "Automated Testing & Security Best Practices",
    ],
    toolsRequired: [
      "VS Code / Cursor",
      "React, TypeScript, Node.js, PostgreSQL",
      "Git, GitHub Actions & Docker",
      "Postman & Cloud Dashboards",
    ],
    certifications: [
      "Talent CIR Verified Full-Stack & AI Engineer (Proctored)",
      "AWS Certified Cloud Practitioner / Developer Associate",
      "Meta Front-End / Back-End Developer Professional Certificate",
    ],
    projectProof: [
      "Deployed Production SaaS Web App with Auth, Database, and Role Permissions",
      "AI-Powered Workflow / RAG Assistant with Live API Integration",
      "Verified 85th+ Percentile Talent CIR Proctored Coding Scorecard",
    ],
    salaryIndia: {
      entry: "₹6.0 LPA – ₹12.0 LPA",
      entryRange: [6.0, 12.0],
      mid: "₹14.0 LPA – ₹24.0 LPA",
      midRange: [14.0, 24.0],
      senior: "₹28.0 LPA – ₹50.0 LPA+",
      seniorRange: [28.0, 50.0],
    },
    futureDemand: {
      demandLevel: "Emerging Rapidly",
      trendSummary:
        "India's 1,700+ Global Capability Centres (GCCs) and AI-native startups are aggressively hiring engineers who combine solid full-stack fundamentals with AI integration skills.",
      aiImpact:
        "AI coding assistants speed up boilerplate syntax, raising employer expectations around system architecture, code review, security, and end-to-end product ownership.",
      emergingTech: [
        "AI Agent & LLM Application Frameworks",
        "Edge Computing & Serverless Micro-Frontends",
        "Automated DevSecOps & AI Code Verification",
      ],
      futureSkills: [
        "AI-Native System Architecture",
        "Security & Privacy Engineering",
        "Product-Minded Full-Stack Execution",
      ],
      advancementPath: [
        "Associate Full-Stack Engineer (0–2 yrs)",
        "Software Engineer II / AI Product Engineer (2–5 yrs)",
        "Senior / Staff Engineer or Engineering Manager (5–8 yrs)",
        "Principal Architect / VP of Engineering (8+ yrs)",
      ],
      relatedRoles: [
        "Frontend Engineer",
        "Backend / API Engineer",
        "AI Application Engineer",
        "QA Automation Engineer",
      ],
      sourceCitation:
        "NASSCOM AI & Tech Talent Report India (Q1 2026)",
    },
  },
];

const EDUCATION_OPTIONS = ["BBA", "B.Com", "B.Tech", "MBA", "BA", "B.Sc.", "BCA / MCA"];
const SPECIALISATION_OPTIONS = [
  "Marketing",
  "Finance",
  "Human Resources (HR)",
  "Computer Science & IT",
  "Operations & Supply Chain",
  "International Business",
  "Economics & Analytics",
  "General Management",
];
const COUNTRY_OPTIONS = [
  "India",
  "UAE / Dubai",
  "United Kingdom",
  "Singapore",
  "United States",
  "Global Remote",
];
const EXPERIENCE_OPTIONS: Array<"Fresher" | "Experienced" | "Career Switcher"> = [
  "Fresher",
  "Experienced",
  "Career Switcher",
];
const INTEREST_OPTIONS = [
  "Business",
  "Marketing",
  "Technology",
  "Finance",
  "Human Resources",
  "Client Relations",
  "Analytics",
  "Operations",
];
const LOCATION_OPTIONS = [
  "Bengaluru (City / Hybrid)",
  "Mumbai (City / On-site)",
  "Delhi NCR (City / Hybrid)",
  "Hyderabad (City / On-site)",
  "Chennai / Pune (Hybrid)",
  "Remote (Anywhere in India)",
];

const USER_JOURNEY_STEPS = [
  {
    step: "STEP 1",
    title: "Create Your Profile",
    desc: "Provide your education, specialisation, experience level, location, and career interests.",
    sectionId: "section-02-profile",
  },
  {
    step: "STEP 2",
    title: "Choose Your Career Pathway",
    desc: "Select Path 01 (Careers Based on My Education) or Path 02 (Careers Beyond My Degree).",
    sectionId: "section-03-pathways",
  },
  {
    step: "STEP 3",
    title: "Explore Recommended Job Roles",
    desc: "Filter and compare personalised career opportunities that match your eligibility.",
    sectionId: "section-04-opportunities",
  },
  {
    step: "STEP 4",
    title: "View Responsibilities, Skills & Salary",
    desc: "Inspect every role in detail along with entry, mid-career, and senior salary ranges.",
    sectionId: "section-05-role-detail",
  },
  {
    step: "STEP 5",
    title: "Understand Future Career Prospects",
    desc: "Evaluate industry demand, emerging AI technologies, and 5-year career advancement ladders.",
    sectionId: "section-09-future",
  },
  {
    step: "STEP 6",
    title: "Get Your Personalised Roadmap",
    desc: "Follow a 5-stage actionable plan from your starting point to target role readiness.",
    sectionId: "section-08-roadmap",
  },
  {
    step: "STEP 7",
    title: "Learn, Assess & Apply",
    desc: "Connect directly to courses, proctored Talent CIR assessments, profile builder, and jobs.",
    sectionId: "section-10-connect",
  },
];

const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.5 },
};

const SectionHeading = ({
  badge,
  first,
  second,
  sub,
  icon = Sparkles,
  align = "center",
}: {
  badge: string;
  first: string;
  second: string;
  sub?: React.ReactNode;
  icon?: typeof Sparkles;
  align?: "center" | "left";
}) => (
  <motion.div
    {...reveal}
    className={cn(
      "mb-12 md:mb-14",
      align === "center" ? "text-center max-w-3xl mx-auto" : "text-left max-w-3xl"
    )}
  >
    <SectionBadge label={badge} icon={icon} />
    <h2 className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mt-4 mb-3 text-slate-900">
      {first}
      <br />
      <span className="text-[#002C66]">{second}</span>
    </h2>
    {sub && (
      <p className="text-muted-foreground text-base md:text-lg leading-relaxed">{sub}</p>
    )}
  </motion.div>
);

const AiGuidance = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Dedicated Individual Role Details Page mode when `?roleView=detail` is active
  const roleViewMode = searchParams.get("view") === "role-detail";
  const roleParam = searchParams.get("role");

  // 02. Candidate Profile State
  const [education, setEducation] = useState("BBA");
  const [specialisation, setSpecialisation] = useState("Marketing");
  const [country, setCountry] = useState("India");
  const [experience, setExperience] = useState<"Fresher" | "Experienced" | "Career Switcher">("Fresher");
  const [interests, setInterests] = useState<string[]>(["Business", "Marketing", "Client Relations"]);
  const [workLocation, setWorkLocation] = useState("Bengaluru (City / Hybrid)");
  const [salaryExpectation, setSalaryExpectation] = useState("₹4.5 LPA – ₹8.0 LPA");
  const [isGenerating, setIsGenerating] = useState(false);

  // 03. Pathway State
  const [selectedPath, setSelectedPath] = useState<DiscoveryPath>("all");

  // 04. Filters State
  const [industryFilter, setIndustryFilter] = useState("All");
  const [salaryFilter, setSalaryFilter] = useState("All");
  const [experienceFilter, setExperienceFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [degreeFilter, setDegreeFilter] = useState("All");
  const [skillSearch, setSkillSearch] = useState("");

  // 05. Active Role Detail State
  const [selectedRoleId, setSelectedRoleId] = useState<string>(roleParam || "bde");
  const [activeDetailTab, setActiveDetailTab] = useState<DetailTab>("overview");

  // 06. Salary Insights Multiplier State
  const [salaryCityTier, setSalaryCityTier] = useState<"tier1" | "tier2" | "global">("tier1");

  // 07. Skill Gap Self-Check State
  const [checkedSkills, setCheckedSkills] = useState<string[]>([
    "Consultative Communication",
    "Active Listening & Objection Handling",
    "Social Media & Content Strategy",
    "Stakeholder & Candidate Communication",
    "Advanced Excel & Spreadsheet Modelling",
    "Relationship Management & Executive Presence",
    "JavaScript / TypeScript & React",
  ]);
  const [showSkillGapReport, setShowSkillGapReport] = useState(false);

  // 08. Roadmap Active Step
  const [activeRoadmapStage, setActiveRoadmapStage] = useState<number>(1);
  const [roadmapGenerated, setRoadmapGenerated] = useState<boolean>(false);

  const selectedRole = useMemo(
    () => CAREER_ROLES.find((r) => r.id === selectedRoleId) || CAREER_ROLES[0],
    [selectedRoleId]
  );

  const scrollToSection = (id: string) => {
    if (roleViewMode) {
      setSearchParams({});
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openDedicatedRolePage = (roleId: string, tab: DetailTab = "overview") => {
    setSelectedRoleId(roleId);
    setActiveDetailTab(tab);
    setSearchParams({ view: "role-detail", role: roleId });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeDedicatedRolePage = () => {
    setSearchParams({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const toggleSkillCheck = (skill: string) => {
    setCheckedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleGenerateOptions = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      scrollToSection("section-03-pathways");
    }, 300);
  };

  const handleSelectPathway = (path: DiscoveryPath) => {
    setSelectedPath(path);
    scrollToSection("section-04-opportunities");
  };

  // Filtered roles
  const filteredRoles = useMemo(() => {
    return CAREER_ROLES.filter((role) => {
      if (selectedPath === "degree" && !role.eligibleDegrees.includes(education.split(" ")[0])) {
        return false;
      }
      if (selectedPath === "beyond" && role.pathway === "degree") {
        return false;
      }
      if (
        industryFilter !== "All" &&
        !role.industry.toLowerCase().includes(industryFilter.toLowerCase())
      ) {
        return false;
      }
      if (salaryFilter === "4to7" && role.salaryIndia.entryRange[1] < 4) return false;
      if (salaryFilter === "7plus" && role.salaryIndia.entryRange[1] < 6.5) return false;
      if (experienceFilter !== "All" && role.experienceLevel !== experienceFilter) {
        return false;
      }
      if (
        locationFilter !== "All" &&
        !role.locations.some((l) => l.toLowerCase().includes(locationFilter.toLowerCase()))
      ) {
        return false;
      }
      if (
        degreeFilter !== "All" &&
        !role.eligibleDegrees.some((d) => d.toLowerCase().includes(degreeFilter.toLowerCase()))
      ) {
        return false;
      }
      if (skillSearch.trim() !== "") {
        const q = skillSearch.toLowerCase();
        const inTitle = role.title.toLowerCase().includes(q);
        const inSkills = [...role.essentialSkills, ...role.preferredSkills, ...role.toolsRequired].some(
          (s) => s.toLowerCase().includes(q)
        );
        if (!inTitle && !inSkills) return false;
      }
      return true;
    });
  }, [
    selectedPath,
    education,
    industryFilter,
    salaryFilter,
    experienceFilter,
    locationFilter,
    degreeFilter,
    skillSearch,
  ]);

  // Skill readiness calculation
  const roleAllCoreSkills = useMemo(
    () => [...selectedRole.essentialSkills, ...selectedRole.preferredSkills],
    [selectedRole]
  );
  const matchedSkillCount = useMemo(
    () => roleAllCoreSkills.filter((s) => checkedSkills.includes(s)).length,
    [roleAllCoreSkills, checkedSkills]
  );
  const skillReadinessPercent = Math.round(
    (matchedSkillCount / Math.max(roleAllCoreSkills.length, 1)) * 100
  );
  const missingRoleSkills = useMemo(
    () => roleAllCoreSkills.filter((s) => !checkedSkills.includes(s)),
    [roleAllCoreSkills, checkedSkills]
  );

  // Adjusted salary display
  const adjustedSalary = useMemo(() => {
    const mult = salaryCityTier === "tier1" ? 1 : salaryCityTier === "tier2" ? 0.85 : 2.4;
    const fmt = (range: [number, number]) =>
      `₹${(range[0] * mult).toFixed(1)} LPA – ₹${(range[1] * mult).toFixed(1)} LPA`;
    return {
      entry: fmt(selectedRole.salaryIndia.entryRange),
      mid: fmt(selectedRole.salaryIndia.midRange),
      senior: `${fmt(selectedRole.salaryIndia.seniorRange)}+`,
    };
  }, [selectedRole, salaryCityTier]);

  return (
    <>
      <Helmet>
        <title>Super Intelligence (SI) Career Guide | AI Career Guidance | TalentCIR</title>
        <meta
          name="description"
          content="Your Education. Your Options. Your Future. Discover the careers you can pursue, the skills you need, the salary you could earn and the opportunities waiting for you — powered by AI."
        />
      </Helmet>

      <Layout>
        {/* Top Brand Strip — matches ProofStrip (pt-[72px] clears fixed Navbar cleanly) */}
        <div className="bg-primary pt-[72px] text-primary-foreground">
          <div className="container flex flex-wrap items-center justify-between gap-2 py-2.5 text-xs font-medium">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-sky-300 shrink-0" />
              <span className="font-bold uppercase tracking-wider">careeryatraa.com</span>
              <span className="opacity-50">•</span>
              <span>SUPER INTELLIGENCE (SI) CAREER GUIDE — 7-Step Personalised Career Discovery</span>
            </div>
            <div className="flex items-center gap-3">
              {roleViewMode ? (
                <button
                  type="button"
                  onClick={closeDedicatedRolePage}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white text-[#002C66] px-3 py-1 text-[11px] font-bold hover:bg-slate-100 transition cursor-pointer"
                >
                  <ArrowLeft className="h-3 w-3" /> Back to Full SI Career Guide
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => openDedicatedRolePage(selectedRole.id)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white px-3 py-1 text-[11px] font-bold transition cursor-pointer"
                >
                  Open Role Deep-Dive Page ({selectedRole.title}) <ArrowRight className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sticky Quick-Jump Journey Bar */}
        <div className="sticky top-[64px] z-30 border-b border-border bg-card/95 backdrop-blur-md shadow-xs">
          <div className="container py-2.5 flex items-center justify-between gap-3 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-1.5 shrink-0">
              {USER_JOURNEY_STEPS.map((item, idx) => (
                <button
                  key={item.step}
                  type="button"
                  onClick={() => scrollToSection(item.sectionId)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background hover:border-primary hover:text-primary px-3 py-1.5 text-xs font-semibold text-foreground transition cursor-pointer shrink-0"
                >
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {idx + 1}
                  </span>
                  <span>{item.title}</span>
                </button>
              ))}
            </div>

            <div className="hidden xl:flex items-center gap-2 shrink-0 text-xs font-semibold text-muted-foreground pl-3 border-l border-border">
              <GraduationCap className="h-4 w-4 text-primary" />
              <span className="text-foreground font-bold">{education}</span>
              <span>·</span>
              <span>{specialisation}</span>
            </div>
          </div>
        </div>

        {/* ===================================================================
            DEDICATED INDIVIDUAL CAREER DETAILS PAGE VIEW (WHEN A ROLE IS OPENED)
        =================================================================== */}
        {roleViewMode ? (
          <section className="py-14 md:py-20 bg-[#FBF4EB]">
            <div className="container space-y-10">
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
                <button
                  type="button"
                  onClick={closeDedicatedRolePage}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#002C66] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#00204d] transition cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to All SI Career Guide Sections
                </button>

                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-500 mr-1">Switch Role:</span>
                  {CAREER_ROLES.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => openDedicatedRolePage(r.id, activeDetailTab)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer",
                        selectedRole.id === r.id
                          ? "bg-[#002C66] text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      )}
                    >
                      {r.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dedicated Role Header Card */}
              <div className="pro-hero rounded-3xl bg-[#002C66] p-8 sm:p-10 text-white shadow-xl">
                <div className="grid lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-8 space-y-3">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sky-300">
                      05. Individual Career Details Page · {selectedRole.matchScore}% Profile Match
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white">
                      {selectedRole.title}
                    </h1>
                    <p className="text-sm sm:text-base text-white/85 max-w-2xl leading-relaxed">
                      {selectedRole.overview}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {selectedRole.categoryTags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-white/10 border border-white/20 px-3 py-1 text-xs font-semibold text-white"
                        >
                          {t}
                        </span>
                      ))}
                      <span className="rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs font-bold text-emerald-200">
                        {selectedRole.badgeNote}
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-4 rounded-2xl bg-white/10 border border-white/15 p-6 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-sky-300">
                      India Compensation Band
                    </p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1.5 border-b border-white/10">
                        <span className="text-white/75">Entry Level (0–2 yrs)</span>
                        <span className="font-bold text-white">{selectedRole.salaryIndia.entry}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-white/10">
                        <span className="text-white/75">Mid-Career (2–5 yrs)</span>
                        <span className="font-bold text-sky-300">{selectedRole.salaryIndia.mid}</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-white/75">Senior Level (5+ yrs)</span>
                        <span className="font-bold text-emerald-300">
                          {selectedRole.salaryIndia.senior}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* All 6 Required Role Detail Sections Laid Out Cleanly */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#002C66]">
                    01 · Role Overview & Organisational Fit
                  </span>
                  <h3 className="text-xl font-bold font-display text-slate-900 mt-1 mb-3">
                    What the Job Involves
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {selectedRole.overview}
                  </p>
                  <div className="rounded-2xl bg-[#FBF4EB] border border-slate-200/80 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#002C66] mb-1">
                      Where It Fits Within an Organisation
                    </p>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {selectedRole.orgFit}
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#002C66]">
                    02 · Roles & Responsibilities
                  </span>
                  <h3 className="text-xl font-bold font-display text-slate-900 mt-1 mb-3">
                    Daily Tasks & Expected Deliverables
                  </h3>
                  <ul className="space-y-2.5 mb-4">
                    {selectedRole.responsibilities.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <CheckCircle2 className="h-4 w-4 text-[#002C66] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#002C66]">
                    03 · Education & Eligibility
                  </span>
                  <h3 className="text-xl font-bold font-display text-slate-900 mt-1 mb-3">
                    Accepted Degrees & Entry Routes
                  </h3>
                  <ul className="space-y-2 mb-4">
                    {selectedRole.acceptedDegrees.map((deg) => (
                      <li key={deg} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{deg}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="space-y-2 pt-3 border-t border-slate-100">
                    {selectedRole.entryRoutes.map((route, idx) => (
                      <div
                        key={route}
                        className="rounded-xl bg-[#FBF4EB]/70 border border-slate-200/80 px-3.5 py-2 text-xs font-semibold text-slate-800"
                      >
                        Entry Route 0{idx + 1}: {route}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#002C66]">
                    04 · Skills, Tools & Certifications
                  </span>
                  <h3 className="text-xl font-bold font-display text-slate-900 mt-1 mb-3">
                    What Employers Value
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase mb-2">
                        Essential & Preferred Skills
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {[...selectedRole.essentialSkills, ...selectedRole.preferredSkills].map(
                          (s) => (
                            <span
                              key={s}
                              className="rounded-lg bg-[#002C66]/8 border border-[#002C66]/20 px-2.5 py-1 text-xs font-semibold text-[#002C66]"
                            >
                              {s}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase mb-2">
                        Software & Industry Tools
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedRole.toolsRequired.map((t) => (
                          <span
                            key={t}
                            className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-800"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold font-display text-slate-900">
                    Ready to pursue {selectedRole.title}?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Return to the full guide to check your skill gaps, build your 5-step career
                    roadmap, or take a Talent CIR assessment.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={closeDedicatedRolePage} variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Full SI Guide
                  </Button>
                  <Button asChild className="bg-[#002C66] text-white hover:bg-[#00204d]">
                    <Link to="/assessments/explore">
                      Take Skill Assessment <ArrowRight className="h-4 w-4 ml-1.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        ) : (
          /* ===================================================================
             FULL 11-SECTION SI CAREER GUIDE PAGE (IN EXACT PDF SHEET ORDER)
          =================================================================== */
          <>
            {/* ─────────────────────────────────────────────────────────────────
                01. HERO SECTION (WITH PDF IMAGE 1)
            ───────────────────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-background pt-12 pb-16 md:pt-16 md:pb-24 border-b border-border/60">
              <div className="container grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55 }}
                  className="lg:col-span-6 space-y-6"
                >
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-4 py-1.5 shadow-2xs">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                      01. Hero Section · Super Intelligence Guide
                    </span>
                  </div>

                  <h1 className="font-display text-4xl sm:text-5xl lg:text-[54px] font-bold leading-[1.1] tracking-tight text-slate-950">
                    Your Education.
                    <br />
                    <span className="text-[#002C66]">Your Options. Your Future.</span>
                  </h1>

                  <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-xl">
                    Discover the careers you can pursue, the skills you need, the salary you could
                    earn and the opportunities waiting for you — powered by AI.
                  </p>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs max-w-xl">
                    <p className="text-sm font-medium text-slate-700 leading-relaxed">
                      Personalised career guidance based on your education, interests and career
                      preferences.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <Button
                      size="lg"
                      onClick={() => scrollToSection("section-02-profile")}
                      className="h-12 px-7 gap-2 bg-[#002C66] text-white hover:bg-[#00204d] font-bold rounded-xl shadow-md cursor-pointer"
                    >
                      Discover My Career Path <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => scrollToSection("section-04-opportunities")}
                      className="h-12 px-6 gap-2 border-primary text-primary hover:bg-primary/5 font-bold rounded-xl cursor-pointer"
                    >
                      Explore Matched Roles
                    </Button>
                  </div>
                </motion.div>

                {/* Right Column — Uncropped PDF Image 1 Inside Clean Showcase Frame */}
                <motion.div
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="lg:col-span-6"
                >
                  <div className="rounded-3xl border border-slate-200/90 bg-white shadow-[0_24px_60px_-20px_rgba(0,44,102,0.18)] overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
                      <span className="flex items-center gap-2 text-xs font-bold text-[#002C66]">
                        <Sparkles className="h-4 w-4 text-[#002C66]" />
                        careeryatraa.com · Super Intelligence Career Engine
                      </span>
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                        Live AI Guidance
                      </span>
                    </div>

                    <div className="bg-slate-100">
                      <img
                        src={heroImg}
                        alt="Super Intelligence Career Guide - Top Courses, Best Colleges, Career Suggestions"
                        className="w-full h-auto block object-contain"
                      />
                    </div>

                    <div className="grid grid-cols-3 divide-x divide-slate-200 border-t border-slate-200 bg-white text-center">
                      <div className="py-3 px-2">
                        <p className="text-xs font-extrabold text-[#002C66]">Top Courses</p>
                        <p className="text-[11px] text-slate-500">Skill-Aligned Learning</p>
                      </div>
                      <div className="py-3 px-2">
                        <p className="text-xs font-extrabold text-[#002C66]">Best Colleges</p>
                        <p className="text-[11px] text-slate-500">Degree & Specialisation Fit</p>
                      </div>
                      <div className="py-3 px-2">
                        <p className="text-xs font-extrabold text-[#002C66]">Career Suggestions</p>
                        <p className="text-[11px] text-slate-500">Verified Role & Salary Data</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* ─────────────────────────────────────────────────────────────────
                02. CANDIDATE PROFILE SETUP — Tell Us About Yourself
            ───────────────────────────────────────────────────────────────── */}
            <section id="section-02-profile" className="py-16 md:py-24 scroll-mt-28">
              <div className="container">
                <SectionHeading
                  badge="02. Candidate Profile Setup · Step 1"
                  first="Tell Us About"
                  second="Yourself."
                  sub="Your career journey starts with understanding where you are today. Provide a few details to receive relevant career recommendations."
                  icon={UserCheck}
                />

                <div className="grid lg:grid-cols-12 gap-8 items-stretch">
                  {/* Left 8 Cols: 7 Suggested Fields from PDF Page 2 */}
                  <div className="lg:col-span-8 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-9 shadow-sm flex flex-col justify-between">
                    <div className="space-y-6">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
                        <div>
                          <h3 className="text-lg font-bold font-display text-slate-900">
                            Candidate Profile Configuration
                          </h3>
                          <p className="text-xs text-slate-500">
                            All 7 suggested fields from the SI Career Guide specification
                          </p>
                        </div>
                        <span className="rounded-full bg-[#002C66]/10 px-3 py-1 text-xs font-bold text-[#002C66]">
                          Step 1 of 7
                        </span>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
                        {/* 1. Highest Education */}
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                            1. Highest Education
                          </label>
                          <select
                            value={education}
                            onChange={(e) => setEducation(e.target.value)}
                            className="w-full rounded-xl bg-[#FBF4EB]/60 border border-slate-300 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#002C66]"
                          >
                            {EDUCATION_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                          <p className="text-[11px] text-slate-500 mt-1">
                            BBA, B.Com, B.Tech, MBA, BA, B.Sc. and more
                          </p>
                        </div>

                        {/* 2. Specialisation */}
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                            2. Specialisation
                          </label>
                          <select
                            value={specialisation}
                            onChange={(e) => setSpecialisation(e.target.value)}
                            className="w-full rounded-xl bg-[#FBF4EB]/60 border border-slate-300 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#002C66]"
                          >
                            {SPECIALISATION_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                          <p className="text-[11px] text-slate-500 mt-1">
                            Marketing, Finance, HR, Computer Science, etc.
                          </p>
                        </div>

                        {/* 3. Country */}
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                            3. Country
                          </label>
                          <select
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full rounded-xl bg-[#FBF4EB]/60 border border-slate-300 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#002C66]"
                          >
                            {COUNTRY_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                          <p className="text-[11px] text-slate-500 mt-1">
                            India or another preferred country
                          </p>
                        </div>

                        {/* 4. Career Experience */}
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                            4. Career Experience
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {EXPERIENCE_OPTIONS.map((exp) => (
                              <button
                                key={exp}
                                type="button"
                                onClick={() => setExperience(exp)}
                                className={cn(
                                  "py-2.5 px-2 rounded-xl text-xs font-bold border transition cursor-pointer",
                                  experience === exp
                                    ? "bg-[#002C66] text-white border-[#002C66]"
                                    : "bg-[#FBF4EB]/60 text-slate-700 border-slate-300 hover:bg-slate-100"
                                )}
                              >
                                {exp}
                              </button>
                            ))}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">
                            Fresher, Experienced or Career Switcher
                          </p>
                        </div>

                        {/* 6. Preferred Work Location */}
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                            6. Preferred Work Location
                          </label>
                          <select
                            value={workLocation}
                            onChange={(e) => setWorkLocation(e.target.value)}
                            className="w-full rounded-xl bg-[#FBF4EB]/60 border border-slate-300 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#002C66]"
                          >
                            {LOCATION_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                          <p className="text-[11px] text-slate-500 mt-1">
                            City, country, remote or hybrid
                          </p>
                        </div>

                        {/* 7. Salary Expectations — Optional */}
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                            7. Salary Expectations{" "}
                            <span className="text-slate-400 font-normal">(Optional)</span>
                          </label>
                          <input
                            type="text"
                            value={salaryExpectation}
                            onChange={(e) => setSalaryExpectation(e.target.value)}
                            placeholder="e.g., ₹4.5 LPA – ₹8.0 LPA"
                            className="w-full rounded-xl bg-[#FBF4EB]/60 border border-slate-300 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#002C66]"
                          />
                          <p className="text-[11px] text-slate-500 mt-1">
                            Calibrates entry, mid-career & senior bands
                          </p>
                        </div>
                      </div>

                      {/* 5. Career Interests */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                          5. Career Interests — Technology, Business, Marketing, Finance and more
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {INTEREST_OPTIONS.map((interest) => {
                            const active = interests.includes(interest);
                            return (
                              <button
                                key={interest}
                                type="button"
                                onClick={() => toggleInterest(interest)}
                                className={cn(
                                  "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer",
                                  active
                                    ? "bg-[#002C66] text-white border-[#002C66]"
                                    : "bg-[#FBF4EB]/60 text-slate-700 border-slate-300 hover:bg-slate-100"
                                )}
                              >
                                {active && <Check className="w-3.5 h-3.5 text-sky-300" />}
                                {interest}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                      <span className="text-xs text-slate-500">
                        Instant AI matching across Degree-Aligned & Cross-Industry pathways
                      </span>
                      <Button
                        size="lg"
                        onClick={handleGenerateOptions}
                        className="bg-[#002C66] text-white hover:bg-[#00204d] font-bold rounded-xl px-7 h-12 gap-2 cursor-pointer"
                      >
                        {isGenerating ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Generating Career Options...
                          </>
                        ) : (
                          <>
                            Generate My Career Options
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Right 4 Cols: Live Candidate Dossier Card */}
                  <div className="lg:col-span-4 pro-hero rounded-3xl bg-[#002C66] text-white p-7 sm:p-8 flex flex-col justify-between shadow-lg">
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
                          Active Candidate Dossier
                        </span>
                        <span className="rounded-full bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300">
                          Live Synced
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold font-display text-white mb-2">
                        {education} · {specialisation}
                      </h3>
                      <p className="text-xs text-white/75 leading-relaxed mb-6">
                        Super Intelligence uses these parameters to filter eligible job roles,
                        benchmark salaries in {country}, and identify your priority skill gaps.
                      </p>

                      <div className="space-y-3 text-xs">
                        <div className="rounded-2xl bg-white/10 border border-white/15 p-3.5 flex justify-between">
                          <span className="text-white/70">Experience Level</span>
                          <span className="font-bold text-white">{experience}</span>
                        </div>
                        <div className="rounded-2xl bg-white/10 border border-white/15 p-3.5 flex justify-between">
                          <span className="text-white/70">Target Geography</span>
                          <span className="font-bold text-white">{country}</span>
                        </div>
                        <div className="rounded-2xl bg-white/10 border border-white/15 p-3.5 flex justify-between">
                          <span className="text-white/70">Preferred Work Mode</span>
                          <span className="font-bold text-white truncate max-w-[170px]">
                            {workLocation}
                          </span>
                        </div>
                        <div className="rounded-2xl bg-white/10 border border-white/15 p-3.5 flex justify-between">
                          <span className="text-white/70">Target Compensation</span>
                          <span className="font-bold text-sky-300">{salaryExpectation}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-white/15">
                      <p className="text-[11px] text-white/75 mb-3">
                        Matched Career Roles Ready:{" "}
                        <strong className="text-white">{filteredRoles.length} Roles</strong>
                      </p>
                      <button
                        type="button"
                        onClick={() => scrollToSection("section-03-pathways")}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white text-[#002C66] hover:bg-slate-100 py-3 px-4 text-xs font-extrabold transition cursor-pointer"
                      >
                        Proceed to Step 2: Choose Pathway <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ─────────────────────────────────────────────────────────────────
                03. CHOOSE YOUR CAREER DISCOVERY PATH (WITH PDF IMAGES 2 & 3)
            ───────────────────────────────────────────────────────────────── */}
            <section id="section-03-pathways" className="py-16 md:py-24 scroll-mt-28">
              <div className="container">
                <SectionHeading
                  badge="03. Choose Your Career Discovery Path · Step 2"
                  first="Two Ways to Discover"
                  second="Your Future."
                  sub="Explore roles directly aligned with your academic degree, or look beyond your degree into high-growth cross-industry careers."
                  icon={Compass}
                />

                <div className="grid lg:grid-cols-2 gap-8 items-stretch">
                  {/* PATH 01 — White Card with Uncropped PDF Image 2 */}
                  <motion.div
                    {...reveal}
                    className={cn(
                      "rounded-3xl border-2 bg-white overflow-hidden shadow-md flex flex-col justify-between transition-all",
                      selectedPath === "degree" ? "border-[#002C66] ring-4 ring-[#002C66]/10" : "border-slate-200/90"
                    )}
                  >
                    <div>
                      <div className="bg-slate-900 aspect-[3/2] w-full overflow-hidden relative">
                        <img
                          src={path1Img}
                          alt="PATH 01 - Careers Based on My Education"
                          className="w-full h-full object-contain"
                        />
                        <span className="absolute top-4 left-4 rounded-full bg-[#002C66] px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-md">
                          PATH 01
                        </span>
                      </div>

                      <div className="p-7 sm:p-9">
                        <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 mb-3">
                          Careers Based on <span className="text-[#002C66]">My Education</span>
                        </h3>
                        <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                          Discover career opportunities aligned with your degree, specialisation and
                          qualifications.
                        </p>

                        <div className="rounded-2xl bg-[#FBF4EB] border border-slate-200 p-4 mb-6">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-[#002C66] mb-1">
                            Illustrative Pathway Example
                          </p>
                          <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                            Example: BBA graduate in India →{" "}
                            <span className="text-[#002C66] font-bold">
                              Business Development, Marketing, HR and Operations roles.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="px-7 pb-7 sm:px-9 sm:pb-9">
                      <Button
                        size="lg"
                        onClick={() => handleSelectPathway("degree")}
                        className="w-full h-12 rounded-xl bg-[#002C66] hover:bg-[#00204d] text-white font-bold gap-2 cursor-pointer"
                      >
                        Explore My Degree-Based Careers <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>

                  {/* PATH 02 — Brand Navy Card with Uncropped PDF Image 3 */}
                  <motion.div
                    {...reveal}
                    className={cn(
                      "pro-hero rounded-3xl border-2 bg-[#002C66] text-white overflow-hidden shadow-md flex flex-col justify-between transition-all",
                      selectedPath === "beyond" ? "border-sky-300 ring-4 ring-sky-300/20" : "border-[#002C66]"
                    )}
                  >
                    <div>
                      <div className="bg-slate-950 aspect-[3/2] w-full overflow-hidden relative">
                        <img
                          src={path2Img}
                          alt="PATH 02 - Careers Beyond My Degree"
                          className="w-full h-full object-contain"
                        />
                        <span className="absolute top-4 left-4 rounded-full bg-white px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#002C66] shadow-md">
                          PATH 02
                        </span>
                      </div>

                      <div className="p-7 sm:p-9">
                        <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
                          Careers Beyond <span className="text-sky-300">My Degree</span>
                        </h3>
                        <p className="text-sm sm:text-base text-white/85 leading-relaxed mb-6">
                          Explore opportunities across industries, including roles that accept
                          candidates from different educational backgrounds.
                        </p>

                        <div className="rounded-2xl bg-white/10 border border-white/15 p-4 mb-6">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-sky-300 mb-1">
                            Illustrative Cross-Industry Example
                          </p>
                          <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
                            Example: BBA graduate →{" "}
                            <span className="text-sky-300 font-bold">
                              Digital Marketing, Customer Success, Sales, Recruitment and eligible
                              entry-level tech roles.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="px-7 pb-7 sm:px-9 sm:pb-9">
                      <Button
                        size="lg"
                        onClick={() => handleSelectPathway("beyond")}
                        className="w-full h-12 rounded-xl bg-[#FBF4EB] hover:bg-white text-[#002C66] font-bold gap-2 cursor-pointer"
                      >
                        Explore All Career Options <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* ─────────────────────────────────────────────────────────────────
                04. YOUR PERSONALISED CAREER OPPORTUNITIES
            ───────────────────────────────────────────────────────────────── */}
            <section id="section-04-opportunities" className="py-16 md:py-24 scroll-mt-28">
              <div className="container">
                <SectionHeading
                  badge="04. Your Personalised Career Opportunities · Step 3"
                  first="Discover Jobs You Can"
                  second="Actually Pursue."
                  sub="Based on your selected pathway, education and preferences, SI Guide presents a personalised list of relevant job roles."
                  icon={Briefcase}
                />

                {/* Useful Filters Bar from PDF Page 5 */}
                <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs mb-8">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#002C66]">
                      <SlidersHorizontal className="h-4 w-4" />
                      Useful Filters: Industry · Salary Range · Experience Level · Location · Degree
                      Eligibility · Skills Required
                    </div>

                    <div className="flex items-center gap-2">
                      {(["all", "degree", "beyond"] as DiscoveryPath[]).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setSelectedPath(p)}
                          className={cn(
                            "px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer",
                            selectedPath === p
                              ? "bg-[#002C66] text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          )}
                        >
                          {p === "all"
                            ? "All Pathways"
                            : p === "degree"
                            ? "Path 01: Degree-Based"
                            : "Path 02: Beyond Degree"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                    <select
                      value={industryFilter}
                      onChange={(e) => setIndustryFilter(e.target.value)}
                      className="rounded-xl bg-[#FBF4EB]/60 border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800"
                    >
                      <option value="All">Industry: All</option>
                      <option value="SaaS">B2B SaaS & Tech</option>
                      <option value="E-Commerce">E-Commerce & D2C</option>
                      <option value="BFSI">BFSI & Consulting</option>
                      <option value="FinTech">FinTech & Analytics</option>
                    </select>

                    <select
                      value={salaryFilter}
                      onChange={(e) => setSalaryFilter(e.target.value)}
                      className="rounded-xl bg-[#FBF4EB]/60 border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800"
                    >
                      <option value="All">Salary Range: All</option>
                      <option value="4to7">Entry ₹4 LPA – ₹7 LPA+</option>
                      <option value="7plus">Entry ₹6.5 LPA – ₹12 LPA+</option>
                    </select>

                    <select
                      value={experienceFilter}
                      onChange={(e) => setExperienceFilter(e.target.value)}
                      className="rounded-xl bg-[#FBF4EB]/60 border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800"
                    >
                      <option value="All">Experience: All Levels</option>
                      <option value="Fresher">Fresher Friendly</option>
                    </select>

                    <select
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="rounded-xl bg-[#FBF4EB]/60 border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800"
                    >
                      <option value="All">Location: All Cities</option>
                      <option value="Bengaluru">Bengaluru</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Delhi">Delhi NCR</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Remote">Remote / Hybrid</option>
                    </select>

                    <select
                      value={degreeFilter}
                      onChange={(e) => setDegreeFilter(e.target.value)}
                      className="rounded-xl bg-[#FBF4EB]/60 border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800"
                    >
                      <option value="All">Degree Eligibility: All</option>
                      <option value="BBA">BBA Eligible</option>
                      <option value="B.Com">B.Com Eligible</option>
                      <option value="B.Tech">B.Tech Eligible</option>
                      <option value="MBA">MBA Eligible</option>
                      <option value="BA">BA / Arts Eligible</option>
                    </select>

                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={skillSearch}
                        onChange={(e) => setSkillSearch(e.target.value)}
                        placeholder="Skills Required (SQL, SEO)"
                        className="w-full rounded-xl bg-[#FBF4EB]/60 border border-slate-300 pl-8 pr-3 py-2 text-xs font-semibold text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                {/* Role Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRoles.map((role) => {
                    const isSelected = selectedRole.id === role.id;
                    return (
                      <motion.div
                        key={role.id}
                        {...reveal}
                        className={cn(
                          "rounded-3xl border bg-white p-6 sm:p-7 flex flex-col justify-between transition-all hover:shadow-lg",
                          isSelected
                            ? "border-2 border-[#002C66] shadow-md"
                            : "border-slate-200/90 hover:border-[#002C66]/40"
                        )}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-4">
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#002C66]/10 px-3 py-1 text-xs font-extrabold text-[#002C66]">
                              <Sparkles className="h-3 w-3" /> {role.matchScore}% Match
                            </span>
                            <span className="rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-bold text-emerald-800">
                              {role.salaryIndia.entry}
                            </span>
                          </div>

                          <h3 className="font-display text-xl font-bold text-slate-950 mb-1">
                            {role.title}
                          </h3>
                          <p className="text-xs font-bold text-[#002C66] mb-3">
                            {role.categoryTags.join(" · ")}
                          </p>

                          <div className="inline-block rounded-lg bg-[#FBF4EB] border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-800 mb-4">
                            {role.badgeNote}
                          </div>

                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                            {role.overview}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                          <Button
                            onClick={() => {
                              setSelectedRoleId(role.id);
                              scrollToSection("section-05-role-detail");
                            }}
                            className="w-full bg-[#002C66] hover:bg-[#00204d] text-white text-xs font-bold rounded-xl h-10 gap-1.5 cursor-pointer"
                          >
                            Inspect in Section 05 Below <ChevronRight className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => openDedicatedRolePage(role.id)}
                            className="w-full border-slate-300 text-slate-800 hover:bg-slate-50 text-xs font-bold rounded-xl h-9 cursor-pointer"
                          >
                            Open Individual Role Details Page
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <p className="text-center text-xs text-muted-foreground mt-6">
                  Illustrative roles only. Actual recommendations are generated from the candidate&apos;s
                  profile and the eligibility requirements of each role.
                </p>
              </div>
            </section>

            {/* ─────────────────────────────────────────────────────────────────
                05. EXPLORE EVERY JOB ROLE IN DETAIL (BENTO INTERACTIVE STAGE)
            ───────────────────────────────────────────────────────────────── */}
            <section id="section-05-role-detail" className="py-16 md:py-24 scroll-mt-28">
              <div className="container">
                <SectionHeading
                  badge="05. Explore Every Job Role in Detail · Step 4"
                  first="Know the Role Before You"
                  second="Choose the Career."
                  sub="Each recommended job opens a complete career breakdown across Role Overview, Responsibilities, Eligibility, Skills, Salary, and Future Outlook."
                  icon={FileCheck2}
                />

                {/* Role Selector Pills */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {CAREER_ROLES.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRoleId(r.id)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-xs sm:text-sm font-bold transition cursor-pointer",
                        selectedRole.id === r.id
                          ? "border-[#002C66] bg-[#002C66] text-white shadow-sm"
                          : "border-slate-200 bg-white text-slate-700 hover:border-[#002C66]/40"
                      )}
                    >
                      {r.title}
                    </button>
                  ))}
                </div>

                {/* 12-Col Bento Showcase (Matches CareerIntelligencePackageHome Style) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  {/* Left 4 Cols: 6 Detail Module Tabs from PDF Pages 5-6 */}
                  <div className="lg:col-span-4 flex flex-col justify-between gap-2.5">
                    {(
                      [
                        {
                          id: "overview",
                          num: "01",
                          title: "Role Overview",
                          sub: "Purpose & organisational fit",
                        },
                        {
                          id: "responsibilities",
                          num: "02",
                          title: "Roles & Responsibilities",
                          sub: "Daily tasks & deliverables",
                        },
                        {
                          id: "eligibility",
                          num: "03",
                          title: "Education & Eligibility",
                          sub: "Accepted degrees & entry routes",
                        },
                        {
                          id: "skills",
                          num: "04",
                          title: "Skills & Tools Required",
                          sub: "Technical, soft skills & tools",
                        },
                        {
                          id: "salary",
                          num: "05",
                          title: "Salary & Earning Potential",
                          sub: "Entry, mid-career & senior pay",
                        },
                        {
                          id: "outlook",
                          num: "06",
                          title: "Career Growth & Future Outlook",
                          sub: "Progression & emerging trends",
                        },
                      ] as { id: DetailTab; num: string; title: string; sub: string }[]
                    ).map((t) => {
                      const active = activeDetailTab === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setActiveDetailTab(t.id)}
                          className={cn(
                            "flex items-center gap-3.5 rounded-2xl border p-4 text-left transition cursor-pointer",
                            active
                              ? "bg-[#002C66] border-[#002C66] text-white shadow-md"
                              : "bg-white border-slate-200/90 text-slate-900 hover:border-[#002C66]/40"
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold",
                              active ? "bg-white/15 text-sky-300" : "bg-[#002C66]/10 text-[#002C66]"
                            )}
                          >
                            {t.num}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p
                              className={cn(
                                "text-sm font-bold font-display truncate",
                                active ? "text-white" : "text-slate-900"
                              )}
                            >
                              {t.title}
                            </p>
                            <p
                              className={cn(
                                "text-xs truncate",
                                active ? "text-white/75" : "text-slate-500"
                              )}
                            >
                              {t.sub}
                            </p>
                          </div>
                          <ArrowRight
                            className={cn(
                              "h-4 w-4 shrink-0",
                              active ? "text-white" : "text-slate-400"
                            )}
                          />
                        </button>
                      );
                    })}
                  </div>

                  {/* Right 8 Cols: Active Detail Stage Card */}
                  <div className="lg:col-span-8 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-9 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-slate-100">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-[#002C66]">
                            {selectedRole.categoryTags.join(" · ")}
                          </span>
                          <h3 className="text-2xl font-bold font-display text-slate-950 mt-0.5">
                            {selectedRole.title}
                          </h3>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDedicatedRolePage(selectedRole.id, activeDetailTab)}
                          className="rounded-xl border-primary text-primary hover:bg-primary/5 text-xs font-bold cursor-pointer"
                        >
                          Open Full-Page Role View <ArrowRight className="h-3.5 w-3.5 ml-1" />
                        </Button>
                      </div>

                      {activeDetailTab === "overview" && (
                        <div className="space-y-5">
                          <div className="rounded-2xl bg-[#FBF4EB]/70 border border-slate-200 p-5">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#002C66] mb-2">
                              Role Overview
                            </h4>
                            <p className="text-sm sm:text-base text-slate-800 leading-relaxed">
                              {selectedRole.overview}
                            </p>
                          </div>
                          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                              Where It Fits Within an Organisation
                            </h4>
                            <p className="text-sm text-slate-700 leading-relaxed">
                              {selectedRole.orgFit}
                            </p>
                          </div>
                        </div>
                      )}

                      {activeDetailTab === "responsibilities" && (
                        <div className="space-y-5">
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#002C66] mb-3">
                              Core Daily Responsibilities
                            </h4>
                            <ul className="space-y-2.5">
                              {selectedRole.responsibilities.map((r) => (
                                <li
                                  key={r}
                                  className="flex items-start gap-2.5 text-sm text-slate-700"
                                >
                                  <CheckCircle2 className="h-4 w-4 text-[#002C66] shrink-0 mt-0.5" />
                                  <span>{r}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="rounded-2xl bg-[#FBF4EB]/70 border border-slate-200 p-4">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#002C66] mb-2">
                              Expected Outcomes & Deliverables
                            </h4>
                            <div className="grid sm:grid-cols-3 gap-2.5">
                              {selectedRole.deliverables.map((d) => (
                                <div
                                  key={d}
                                  className="rounded-xl bg-white border border-slate-200 p-3 text-xs font-semibold text-slate-800"
                                >
                                  {d}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {activeDetailTab === "eligibility" && (
                        <div className="grid sm:grid-cols-2 gap-5">
                          <div className="rounded-2xl bg-[#FBF4EB]/70 border border-slate-200 p-5">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#002C66] mb-3">
                              Accepted Degrees & Qualifications
                            </h4>
                            <ul className="space-y-2.5">
                              {selectedRole.acceptedDegrees.map((d) => (
                                <li
                                  key={d}
                                  className="flex items-start gap-2 text-xs sm:text-sm text-slate-800"
                                >
                                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                                  <span>{d}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#002C66] mb-3">
                              Entry Routes
                            </h4>
                            <div className="space-y-2.5">
                              {selectedRole.entryRoutes.map((route, i) => (
                                <div
                                  key={route}
                                  className="rounded-xl bg-white border border-slate-200 p-3 text-xs font-semibold text-slate-800"
                                >
                                  0{i + 1}. {route}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {activeDetailTab === "skills" && (
                        <div className="grid sm:grid-cols-2 gap-5">
                          <div className="rounded-2xl bg-[#FBF4EB]/70 border border-slate-200 p-5">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#002C66] mb-3">
                              Technical & Interpersonal Skills
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {[
                                ...selectedRole.essentialSkills,
                                ...selectedRole.preferredSkills,
                              ].map((s) => (
                                <span
                                  key={s}
                                  className="rounded-lg bg-white border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-800"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#002C66] mb-3">
                              Industry Tools & Certifications
                            </h4>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {selectedRole.toolsRequired.map((t) => (
                                <span
                                  key={t}
                                  className="rounded-lg bg-[#002C66]/10 px-2.5 py-1 text-xs font-bold text-[#002C66]"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                            <ul className="space-y-1 text-xs text-slate-700 font-medium">
                              {selectedRole.certifications.map((c) => (
                                <li key={c}>• {c}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {activeDetailTab === "salary" && (
                        <div className="grid sm:grid-cols-3 gap-4">
                          <div className="rounded-2xl bg-[#FBF4EB]/70 border border-slate-200 p-5">
                            <p className="text-xs font-bold uppercase text-slate-500">Entry Level</p>
                            <p className="text-2xl font-extrabold font-display text-[#002C66] mt-1">
                              {selectedRole.salaryIndia.entry}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">0 – 2 Years</p>
                          </div>
                          <div className="rounded-2xl bg-white border-2 border-[#002C66] p-5">
                            <p className="text-xs font-bold uppercase text-[#002C66]">Mid-Career</p>
                            <p className="text-2xl font-extrabold font-display text-slate-950 mt-1">
                              {selectedRole.salaryIndia.mid}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">2 – 5 Years</p>
                          </div>
                          <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200 p-5">
                            <p className="text-xs font-bold uppercase text-emerald-800">
                              Senior Level
                            </p>
                            <p className="text-2xl font-extrabold font-display text-emerald-700 mt-1">
                              {selectedRole.salaryIndia.senior}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">5+ Years</p>
                          </div>
                        </div>
                      )}

                      {activeDetailTab === "outlook" && (
                        <div className="space-y-4">
                          <p className="text-sm text-slate-700 leading-relaxed">
                            {selectedRole.futureDemand.trendSummary}
                          </p>
                          <div className="grid sm:grid-cols-4 gap-3">
                            {selectedRole.futureDemand.advancementPath.map((st, i) => (
                              <div
                                key={st}
                                className="rounded-2xl bg-[#FBF4EB]/80 border border-slate-200 p-3.5 text-xs font-bold text-slate-900"
                              >
                                <span className="text-[#002C66] block text-[10px] mb-1">
                                  STAGE 0{i + 1}
                                </span>
                                {st}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-5 mt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <span className="text-slate-500">
                        Locations: <strong>{selectedRole.locations.join(" · ")}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => scrollToSection("section-06-salary")}
                        className="font-bold text-[#002C66] hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        Next: 06. Salary Insights <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ─────────────────────────────────────────────────────────────────
                06. SALARY INSIGHTS — Know Your Earning Potential
            ───────────────────────────────────────────────────────────────── */}
            <section id="section-06-salary" className="py-16 md:py-24 scroll-mt-28">
              <div className="container">
                <SectionHeading
                  badge="06. Salary Insights · Step 4B"
                  first="Know Your"
                  second="Earning Potential."
                  sub="Understand how compensation may change with experience, skills, location and industry. Illustrative salary display for India — actual figures populated from reliable, current salary data."
                  icon={Wallet}
                />

                <div className="grid lg:grid-cols-12 gap-8 items-stretch">
                  <div className="lg:col-span-8 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-9 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-[#002C66]">
                            Role Compensation Benchmark
                          </span>
                          <h3 className="text-2xl font-bold font-display text-slate-950">
                            {selectedRole.title}
                          </h3>
                        </div>

                        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                          {(
                            [
                              { id: "tier1", label: "Tier-1 Metro" },
                              { id: "tier2", label: "Tier-2 City" },
                              { id: "global", label: "Global Remote" },
                            ] as const
                          ).map((tier) => (
                            <button
                              key={tier.id}
                              type="button"
                              onClick={() => setSalaryCityTier(tier.id)}
                              className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer",
                                salaryCityTier === tier.id
                                  ? "bg-[#002C66] text-white"
                                  : "text-slate-600 hover:text-slate-900"
                              )}
                            >
                              {tier.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-3 gap-5">
                        <div className="rounded-2xl border border-slate-200 bg-[#FBF4EB]/60 p-6">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Entry Level
                          </span>
                          <p className="text-2xl font-extrabold font-display text-[#002C66] mt-2">
                            {adjustedSalary.entry}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">₹ Salary · 0–2 yrs exp</p>
                        </div>

                        <div className="rounded-2xl border-2 border-[#002C66] bg-white p-6 shadow-sm">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#002C66]">
                            Mid-Career
                          </span>
                          <p className="text-2xl font-extrabold font-display text-slate-950 mt-2">
                            {adjustedSalary.mid}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">₹ Salary · 2–5 yrs exp</p>
                        </div>

                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6">
                          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                            Senior Level
                          </span>
                          <p className="text-2xl font-extrabold font-display text-emerald-700 mt-2">
                            {adjustedSalary.senior}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">₹ Salary · 5+ yrs exp</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 mt-6 pt-4 border-t border-slate-100">
                      Source: {selectedRole.futureDemand.sourceCitation}
                    </p>
                  </div>

                  {/* Salary Factors Card from PDF Page 7 */}
                  <div className="lg:col-span-4 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#002C66]">
                        Compensation Drivers
                      </span>
                      <h3 className="text-xl font-bold font-display text-slate-950 mt-1 mb-4">
                        Salary Factors
                      </h3>
                      <ul className="space-y-3">
                        {[
                          "Experience and qualifications",
                          "City and cost of living",
                          "Industry and employer size",
                          "Performance, specialisation and skills",
                        ].map((factor) => (
                          <li
                            key={factor}
                            className="flex items-center gap-3 rounded-2xl bg-[#FBF4EB]/70 border border-slate-200/80 p-3.5 text-xs sm:text-sm font-semibold text-slate-800"
                          >
                            <CheckCircle2 className="h-4 w-4 text-[#002C66] shrink-0" />
                            <span>{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      onClick={() => scrollToSection("section-07-skills")}
                      className="w-full mt-6 bg-[#002C66] hover:bg-[#00204d] text-white font-bold rounded-xl h-11 gap-2 cursor-pointer"
                    >
                      Check Skills Required <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* ─────────────────────────────────────────────────────────────────
                07. SKILLS YOU NEED TO SUCCEED — Find Out What Employers Expect
            ───────────────────────────────────────────────────────────────── */}
            <section id="section-07-skills" className="py-16 md:py-24 scroll-mt-28">
              <div className="container">
                <SectionHeading
                  badge="07. Skills You Need to Succeed · Step 4C"
                  first="Find Out What"
                  second="Employers Expect."
                  sub="Every career requires a combination of technical knowledge, practical capabilities and interpersonal skills."
                  icon={Target}
                />

                <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-9 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#002C66]">
                        Interactive Skill Gap Check · {selectedRole.title}
                      </span>
                      <h3 className="text-xl font-bold font-display text-slate-950 mt-0.5">
                        Click the skills you already possess to calculate your readiness
                      </h3>
                    </div>
                    <div className="rounded-2xl bg-[#002C66] text-white px-5 py-2.5 text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300 block">
                        Current Skill Readiness
                      </span>
                      <span className="text-lg font-extrabold font-display">
                        {skillReadinessPercent}% ({matchedSkillCount}/{roleAllCoreSkills.length})
                      </span>
                    </div>
                  </div>

                  {/* All 5 Skill Categories from PDF Page 7 */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* 1. Essential skills required to enter the field */}
                    <div className="rounded-2xl bg-[#FBF4EB]/60 border border-slate-200 p-5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#002C66] mb-3">
                        1. Essential Skills Required to Enter
                      </h4>
                      <div className="space-y-2">
                        {selectedRole.essentialSkills.map((skill) => {
                          const checked = checkedSkills.includes(skill);
                          return (
                            <button
                              key={skill}
                              type="button"
                              onClick={() => toggleSkillCheck(skill)}
                              className={cn(
                                "w-full flex items-center justify-between rounded-xl border p-2.5 text-left text-xs font-bold transition cursor-pointer",
                                checked
                                  ? "bg-white border-[#002C66] text-[#002C66]"
                                  : "bg-white/70 border-slate-200 text-slate-600"
                              )}
                            >
                              <span>{skill}</span>
                              <span
                                className={cn(
                                  "text-[10px] uppercase px-2 py-0.5 rounded",
                                  checked
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-slate-100 text-slate-500"
                                )}
                              >
                                {checked ? "Have It" : "Gap"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 2. Preferred skills that improve employability */}
                    <div className="rounded-2xl bg-[#FBF4EB]/60 border border-slate-200 p-5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#002C66] mb-3">
                        2. Preferred Skills That Improve Employability
                      </h4>
                      <div className="space-y-2">
                        {selectedRole.preferredSkills.map((skill) => {
                          const checked = checkedSkills.includes(skill);
                          return (
                            <button
                              key={skill}
                              type="button"
                              onClick={() => toggleSkillCheck(skill)}
                              className={cn(
                                "w-full flex items-center justify-between rounded-xl border p-2.5 text-left text-xs font-bold transition cursor-pointer",
                                checked
                                  ? "bg-white border-[#002C66] text-[#002C66]"
                                  : "bg-white/70 border-slate-200 text-slate-600"
                              )}
                            >
                              <span>{skill}</span>
                              <span
                                className={cn(
                                  "text-[10px] uppercase px-2 py-0.5 rounded",
                                  checked
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-slate-100 text-slate-500"
                                )}
                              >
                                {checked ? "Have It" : "Gap"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 3, 4, 5: Tools, Certifications, Projects/Assessments */}
                    <div className="space-y-4">
                      <div className="rounded-2xl bg-[#FBF4EB]/60 border border-slate-200 p-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#002C66] mb-2">
                          3. Software & Industry Tools to Learn
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedRole.toolsRequired.map((t) => (
                            <span
                              key={t}
                              className="rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-800"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl bg-[#FBF4EB]/60 border border-slate-200 p-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#002C66] mb-2">
                          4. Certifications That Strengthen a Profile
                        </h4>
                        <ul className="space-y-1 text-xs text-slate-700 font-medium">
                          {selectedRole.certifications.map((c) => (
                            <li key={c}>• {c}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-2xl bg-[#FBF4EB]/60 border border-slate-200 p-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#002C66] mb-2">
                          5. Demonstrate Through Projects or Assessments
                        </h4>
                        <ul className="space-y-1 text-xs text-slate-700 font-medium">
                          {selectedRole.projectProof.map((p) => (
                            <li key={p}>• {p}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {showSkillGapReport && (
                    <div className="rounded-2xl bg-[#002C66]/5 border border-[#002C66]/20 p-5 mb-6">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#002C66] mb-2">
                        Personalised Skill Gap Report for {selectedRole.title}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {missingRoleSkills.length === 0 ? (
                          <span className="text-xs font-bold text-emerald-700">
                            All core skills checked! Proceed to Talent CIR assessment to verify.
                          </span>
                        ) : (
                          missingRoleSkills.map((gap) => (
                            <span
                              key={gap}
                              className="rounded-lg bg-white border border-[#002C66]/30 px-3 py-1 text-xs font-bold text-[#002C66]"
                            >
                              Priority Skill Gap: {gap}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
                    <Button
                      onClick={() => setShowSkillGapReport((prev) => !prev)}
                      className="bg-[#002C66] hover:bg-[#00204d] text-white font-bold rounded-xl px-6 h-11 gap-2 cursor-pointer"
                    >
                      Discover My Skill Gaps <Target className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => scrollToSection("section-08-roadmap")}
                      className="border-primary text-primary hover:bg-primary/5 font-bold rounded-xl px-6 h-11 gap-2 cursor-pointer"
                    >
                      Proceed to 08. Career Roadmap <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* ─────────────────────────────────────────────────────────────────
                08. YOUR PERSONALISED CAREER ROADMAP — 5 Actionable Stages
            ───────────────────────────────────────────────────────────────── */}
            <section id="section-08-roadmap" className="py-16 md:py-24 scroll-mt-28">
              <div className="container">
                <SectionHeading
                  badge="08. Your Personalised Career Roadmap · Step 6"
                  first="From Where You Are to"
                  second="Where You Want to Be."
                  sub="SI Guide translates career recommendations into an actionable plan tailored to the candidate's current profile."
                  icon={Layers}
                />

                <div className="grid md:grid-cols-5 gap-4 mb-8">
                  {[
                    {
                      num: 1,
                      code: "01",
                      title: "Understand Your Starting Point",
                      desc: "Review your education, experience, existing skills and interests.",
                      meta: `${education} · ${specialisation}`,
                    },
                    {
                      num: 2,
                      code: "02",
                      title: "Choose a Target Role",
                      desc: "Compare recommended careers and select a realistic goal.",
                      meta: selectedRole.title,
                    },
                    {
                      num: 3,
                      code: "03",
                      title: "Close Your Skill Gaps",
                      desc: "Identify the skills, courses and certifications that can help.",
                      meta: `${missingRoleSkills.length} Priority Gaps`,
                    },
                    {
                      num: 4,
                      code: "04",
                      title: "Prove Your Readiness",
                      desc: "Use Talent CIR assessments to measure progress.",
                      meta: "Verified CIR Score",
                    },
                    {
                      num: 5,
                      code: "05",
                      title: "Prepare for Opportunities",
                      desc: "Improve your resume, practise interviews and explore relevant jobs.",
                      meta: selectedRole.salaryIndia.entry,
                    },
                  ].map((st) => {
                    const active = activeRoadmapStage === st.num;
                    return (
                      <button
                        key={st.code}
                        type="button"
                        onClick={() => setActiveRoadmapStage(st.num)}
                        className={cn(
                          "rounded-3xl border p-6 text-left flex flex-col justify-between transition cursor-pointer",
                          active
                            ? "pro-hero bg-[#002C66] border-[#002C66] text-white shadow-lg"
                            : "bg-white border-slate-200/90 text-slate-900 hover:border-[#002C66]/40"
                        )}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <span
                              className={cn(
                                "inline-flex h-9 w-9 items-center justify-center rounded-xl text-xs font-extrabold",
                                active
                                  ? "bg-white text-[#002C66]"
                                  : "bg-[#002C66]/10 text-[#002C66]"
                              )}
                            >
                              {st.code}
                            </span>
                            <span
                              className={cn(
                                "text-[10px] font-bold uppercase tracking-wider",
                                active ? "text-sky-300" : "text-slate-400"
                              )}
                            >
                              Step {st.code}
                            </span>
                          </div>
                          <h3
                            className={cn(
                              "font-display text-base font-bold mb-2",
                              active ? "text-white" : "text-slate-900"
                            )}
                          >
                            {st.title}
                          </h3>
                          <p
                            className={cn(
                              "text-xs leading-relaxed mb-4",
                              active ? "text-white/80" : "text-slate-600"
                            )}
                          >
                            {st.desc}
                          </p>
                        </div>
                        <div
                          className={cn(
                            "rounded-xl px-3 py-2 text-[11px] font-bold truncate",
                            active
                              ? "bg-white/15 text-white"
                              : "bg-[#FBF4EB] text-[#002C66]"
                          )}
                        >
                          {st.meta}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h4 className="font-display text-lg font-bold text-slate-950">
                      {roadmapGenerated
                        ? `90-Day Action Plan Generated for ${selectedRole.title}`
                        : `Generate Your Custom 90-Day Career Blueprint for ${selectedRole.title}`}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                      Maps weekly learning milestones, Talent CIR assessment checkpoints, and target
                      job applications.
                    </p>
                  </div>
                  <Button
                    size="lg"
                    onClick={() => setRoadmapGenerated(true)}
                    className="bg-[#002C66] hover:bg-[#00204d] text-white font-bold rounded-xl px-7 h-12 gap-2 cursor-pointer"
                  >
                    Build My Career Roadmap <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </section>

            {/* ─────────────────────────────────────────────────────────────────
                09. UNDERSTAND THE FUTURE OF YOUR CAREER
            ───────────────────────────────────────────────────────────────── */}
            <section id="section-09-future" className="py-16 md:py-24 scroll-mt-28">
              <div className="container">
                <SectionHeading
                  badge="09. Understand the Future of Your Career · Step 5"
                  first="Choose a Career That's"
                  second="Ready for Tomorrow."
                  sub="Explore how your selected role is evolving with technology, AI adoption, industry changes and emerging business needs."
                  icon={Globe2}
                />

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* 1. Current industry demand */}
                  <div className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs flex flex-col justify-between">
                    <div>
                      <span className="inline-block rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800 mb-4">
                        Current Industry Demand · {selectedRole.futureDemand.demandLevel}
                      </span>
                      <h3 className="font-display text-xl font-bold text-slate-950 mb-2">
                        {selectedRole.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed mb-4">
                        {selectedRole.futureDemand.trendSummary}
                      </p>
                      <div className="rounded-2xl bg-[#FBF4EB]/70 border border-slate-200 p-4">
                        <p className="text-xs font-bold text-[#002C66] uppercase mb-1">
                          AI Adoption Impact
                        </p>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          {selectedRole.futureDemand.aiImpact}
                        </p>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-4 pt-3 border-t border-slate-100">
                      Evidence-based trend · {selectedRole.futureDemand.sourceCitation}
                    </p>
                  </div>

                  {/* 2. Emerging technologies & 3. Future skills */}
                  <div className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs space-y-6">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#002C66] mb-3">
                        Emerging Technologies Affecting the Role
                      </p>
                      <div className="space-y-2">
                        {selectedRole.futureDemand.emergingTech.map((t) => (
                          <div
                            key={t}
                            className="rounded-xl bg-[#FBF4EB]/70 border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-800"
                          >
                            • {t}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#002C66] mb-3">
                        Future Skills Employers May Value
                      </p>
                      <div className="space-y-2">
                        {selectedRole.futureDemand.futureSkills.map((s) => (
                          <div
                            key={s}
                            className="rounded-xl bg-[#002C66]/8 border border-[#002C66]/20 px-3.5 py-2.5 text-xs font-bold text-[#002C66]"
                          >
                            ★ {s}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 4. Career advancement pathways & 5. Related roles */}
                  <div className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs space-y-6">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#002C66] mb-3">
                        Career Advancement Pathways
                      </p>
                      <div className="space-y-2">
                        {selectedRole.futureDemand.advancementPath.map((step, i) => (
                          <div
                            key={step}
                            className="flex items-center gap-3 rounded-xl bg-[#FBF4EB]/70 border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-800"
                          >
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#002C66] text-[10px] text-white">
                              {i + 1}
                            </span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#002C66] mb-2.5">
                        Related Roles & Alternative Career Options
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedRole.futureDemand.relatedRoles.map((r) => (
                          <span
                            key={r}
                            className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ─────────────────────────────────────────────────────────────────
                10. CONNECT CAREER DISCOVERY TO LEARNING & JOBS
            ───────────────────────────────────────────────────────────────── */}
            <section id="section-10-connect" className="py-16 md:py-24 scroll-mt-28">
              <div className="container">
                <SectionHeading
                  badge="10. Connect Career Discovery to Learning & Jobs · Step 7"
                  first="Discover It. Learn It."
                  second="Make It Happen."
                  sub="Move seamlessly from AI career discovery into courses, verified skill assessments, profile building, and active job openings."
                  icon={Zap}
                />

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      icon: BookOpen,
                      title: "Learn the Skills",
                      desc: "Explore relevant courses and expert-led learning pathways.",
                      cta: "Explore Learning",
                      to: "/learning",
                    },
                    {
                      icon: FileCheck2,
                      title: "Assess Your Readiness",
                      desc: "Measure your current skills against your target career.",
                      cta: "Take an Assessment",
                      to: "/assessments",
                    },
                    {
                      icon: UserCheck,
                      title: "Prepare Your Profile",
                      desc: "Build a resume and showcase relevant achievements.",
                      cta: "Build My Profile",
                      to: "/profile",
                    },
                    {
                      icon: Briefcase,
                      title: "Find Relevant Jobs",
                      desc: "Explore openings aligned with your target role and qualifications.",
                      cta: "Browse Jobs",
                      to: "/jobs",
                    },
                  ].map((card) => {
                    const Icon = card.icon;
                    return (
                      <div
                        key={card.title}
                        className="rounded-3xl border border-slate-200/90 bg-white p-7 flex flex-col justify-between shadow-xs hover:shadow-lg hover:border-[#002C66]/40 transition-all"
                      >
                        <div>
                          <div className="h-12 w-12 rounded-2xl bg-[#002C66]/10 text-[#002C66] flex items-center justify-center mb-5">
                            <Icon className="h-6 w-6" />
                          </div>
                          <h3 className="font-display text-xl font-bold text-slate-950 mb-2">
                            {card.title}
                          </h3>
                          <p className="text-sm text-slate-600 leading-relaxed mb-6">{card.desc}</p>
                        </div>
                        <Button
                          asChild
                          className="w-full bg-[#002C66] hover:bg-[#00204d] text-white font-bold rounded-xl h-11 justify-between px-5"
                        >
                          <Link to={card.to}>
                            <span>{card.cta}</span>
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* ─────────────────────────────────────────────────────────────────
                11. FINAL CTA SECTION + RECOMMENDED SI GUIDE 7-STEP USER JOURNEY
            ───────────────────────────────────────────────────────────────── */}
            <section className="py-16 md:py-24">
              <div className="container">
                <div className="pro-hero rounded-3xl bg-[#002C66] text-white p-8 sm:p-12 lg:p-14 shadow-xl">
                  <div className="grid lg:grid-cols-12 gap-10 items-center">
                    <div className="lg:col-span-6 space-y-5">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-sky-300">
                        <Sparkles className="h-3.5 w-3.5" /> 11. Final CTA Section
                      </span>
                      <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.12]">
                        Your Degree Is Just
                        <br />
                        <span className="text-sky-300">the Beginning.</span>
                      </h2>
                      <p className="text-base sm:text-lg text-white/85 leading-relaxed max-w-xl">
                        Discover your possibilities, understand your potential and find the career
                        path that fits you.
                      </p>
                      <div className="flex flex-wrap gap-4 pt-2">
                        <Button
                          size="lg"
                          onClick={() => scrollToSection("section-02-profile")}
                          className="h-12 px-7 gap-2 bg-[#FBF4EB] hover:bg-white text-[#002C66] font-bold rounded-xl cursor-pointer"
                        >
                          Start My SI Guide <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Button
                          size="lg"
                          variant="outline"
                          onClick={() => openDedicatedRolePage(selectedRole.id)}
                          className="h-12 px-6 border-white/30 bg-transparent text-white hover:bg-white/10 font-bold rounded-xl cursor-pointer"
                        >
                          Inspect {selectedRole.title} Page
                        </Button>
                      </div>
                    </div>

                    {/* Recommended SI Guide User Journey (Steps 1 to 7 from PDF Pages 9-10) */}
                    <div className="lg:col-span-6 rounded-2xl bg-white/10 border border-white/15 p-6">
                      <p className="text-xs font-bold uppercase tracking-wider text-sky-300 mb-4">
                        Recommended SI Guide User Journey (7 Steps)
                      </p>
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        {USER_JOURNEY_STEPS.map((item) => (
                          <button
                            key={item.step}
                            type="button"
                            onClick={() => scrollToSection(item.sectionId)}
                            className="flex items-start gap-3 rounded-xl bg-white/10 hover:bg-white/20 p-3 text-left transition cursor-pointer"
                          >
                            <span className="rounded-md bg-white px-2 py-0.5 text-[10px] font-extrabold text-[#002C66] shrink-0 mt-0.5">
                              {item.step}
                            </span>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-white truncate">{item.title}</p>
                              <p className="text-[11px] text-white/70 line-clamp-1">{item.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </Layout>
    </>
  );
};

export default AiGuidance;
