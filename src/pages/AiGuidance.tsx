import React, { useState, useMemo, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Sparkles,
  GraduationCap,
  Compass,
  Briefcase,
  TrendingUp,
  IndianRupee,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Target,
  Layers,
  Award,
  BookOpen,
  ShieldCheck,
  MapPin,
  Globe,
  Wrench,
  SlidersHorizontal,
  Search,
  UserCheck,
  Rocket,
  FileText,
  Brain,
  Check,
  Building2,
} from "lucide-react";

import heroRobotImg from "@/assets/si-guide-img-1.jpg";
import pathDegreeImg from "@/assets/si-guide-img-2.jpg";
import pathBeyondImg from "@/assets/si-guide-img-3.jpg";

// ============================================================================
// REAL-TIME CAREER INTELLIGENCE DATA CATALOG (SI GUIDE ENGINE)
// ============================================================================

export interface CareerRoleDetail {
  id: string;
  title: string;
  categoryTags: string[];
  industry:
    | "Business & Sales"
    | "Marketing & Growth"
    | "Human Resources"
    | "Technology & AI"
    | "Finance & Analytics";
  pathwayFit: ("degree" | "beyond")[];
  eligibleDegrees: string[];
  badgeNote: string;
  experienceLevel: "Fresher" | "Experienced" | "Career Switcher" | "All";
  workMode: "Hybrid" | "Remote" | "On-Site";
  locations: string[];
  matchBase: number;
  // Section 05: Explore Every Job Role in Detail
  overview: string;
  orgFit: string;
  responsibilities: string[];
  eligibility: {
    acceptedDegrees: string;
    qualifications: string;
    experienceReq: string;
    entryRoutes: string;
  };
  // Section 06: Salary Insights (India LPA)
  salary: {
    entry: { range: string; monthly: string; note: string };
    mid: { range: string; monthly: string; note: string };
    senior: { range: string; monthly: string; note: string };
  };
  // Section 07: Skills You Need to Succeed
  skills: {
    essential: string[];
    preferred: string[];
    tools: string[];
    certifications: string[];
    demonstrableProjects: string[];
  };
  // Section 09: Understand the Future of Your Career
  futureOutlook: {
    demandTrend: string;
    demandSource: string;
    emergingTech: string[];
    futureSkills: string[];
    advancementPath: string[];
    alternativeRoles: string[];
  };
}

const CAREER_ROLES_DB: CareerRoleDetail[] = [
  {
    id: "bde",
    title: "Business Development Executive",
    categoryTags: ["Sales", "Business", "Client Relations"],
    industry: "Business & Sales",
    pathwayFit: ["degree", "beyond"],
    eligibleDegrees: ["BBA", "MBA", "B.Com", "BA", "B.Sc.", "B.Tech"],
    badgeNote: "Example role for a BBA graduate · High Entry Demand",
    experienceLevel: "Fresher",
    workMode: "Hybrid",
    locations: ["Bengaluru", "Mumbai", "Delhi NCR", "Chennai", "Hyderabad", "Pan-India"],
    matchBase: 95,
    overview:
      "Drives revenue growth by identifying high-value business opportunities, building client partnerships, conducting product discovery calls, and collaborating with marketing and delivery teams to close B2B/B2C deals.",
    orgFit:
      "Sits within the Revenue, Growth & Commercial Strategy division, partnering directly with Marketing, Product, and Account Management leadership.",
    responsibilities: [
      "Research target accounts, qualify inbound/outbound leads, and build a predictable sales pipeline.",
      "Conduct consultative discovery calls and product demonstrations tailored to client pain points.",
      "Draft commercial proposals, negotiate contract terms, and achieve monthly/quarterly revenue targets.",
      "Maintain CRM hygiene (HubSpot / Salesforce) and share market feedback with product teams.",
    ],
    eligibility: {
      acceptedDegrees: "BBA, MBA, B.Com, BA (Economics/Communication), or B.Tech (for SaaS/Tech Sales)",
      qualifications: "Strong verbal/written communication, analytical thinking, and commercial acumen",
      experienceReq: "0–2 years for Executive track; internships or campus leadership roles valued",
      entryRoutes: "Campus placements, SDR/BDR fellowships, Verified Talent CIR Sales Assessment",
    },
    salary: {
      entry: {
        range: "₹4.5 LPA – ₹7.5 LPA",
        monthly: "₹35,000 – ₹58,000 / mo",
        note: "Includes fixed pay + performance-linked revenue incentives (0–2 yrs)",
      },
      mid: {
        range: "₹9.0 LPA – ₹16.5 LPA",
        monthly: "₹72,000 – ₹1,30,000 / mo",
        note: "Senior BDE / Account Executive managing mid-market accounts (3–6 yrs)",
      },
      senior: {
        range: "₹18.0 LPA – ₹34.0 LPA",
        monthly: "₹1,45,000 – ₹2,70,000 / mo",
        note: "VP / Director of Business Development & Enterprise Partnerships (7+ yrs)",
      },
    },
    skills: {
      essential: [
        "Consultative B2B/B2C Communication",
        "Lead Qualification & Pipeline Management",
        "Commercial Negotiation & Objection Handling",
        "Market & Competitor Research",
      ],
      preferred: [
        "SaaS Metrics (ARR, CAC, LTV)",
        "Account-Based Prospecting",
        "Proposal Writing & Executive Presentations",
        "Cross-Functional Stakeholder Alignment",
      ],
      tools: [
        "Salesforce / HubSpot CRM",
        "LinkedIn Sales Navigator",
        "Apollo.io / Lusha",
        "Microsoft Excel & PowerPoint / Pitch Decks",
      ],
      certifications: [
        "IAmTalento Verified Commercial & BDE CIR Assessment",
        "HubSpot Inbound Sales Certification",
        "Salesforce Sales Operations Credential",
      ],
      demonstrableProjects: [
        "30-Day Go-To-Market (GTM) Lead Generation Playbook",
        "Mock Cold-Outreach & Discovery Call Pitch Recording",
        "Competitor Pricing & Value Matrix Analysis",
      ],
    },
    futureOutlook: {
      demandTrend:
        "Strong sustained demand across SaaS, FinTech, EdTech, and Enterprise Services (+18% YoY hiring velocity in India).",
      demandSource: "LinkedIn India Emerging Jobs & NASSCOM Commercial Talent Report (Updated Oct 2026)",
      emergingTech: [
        "AI-Assisted Prospecting & Intent Signals (Clay, 6sense)",
        "Automated Conversation Intelligence (Gong, Chorus)",
        "Predictive Pipeline Scoring & Revenue Operations (RevOps)",
      ],
      futureSkills: [
        "AI Prompting for Hyper-Personalised Outreach",
        "Value-Based Consultative Selling",
        "Revenue Analytics & Forecasting",
      ],
      advancementPath: [
        "Business Development Executive (BDE)",
        "Senior Account Executive (AE)",
        "Regional Sales Manager / Growth Lead",
        "VP of Sales / Chief Revenue Officer (CRO)",
      ],
      alternativeRoles: [
        "Customer Success Manager",
        "Partnerships & Alliances Manager",
        "Revenue Operations (RevOps) Analyst",
        "Product Marketing Specialist",
      ],
    },
  },
  {
    id: "dme",
    title: "Digital Marketing Executive",
    categoryTags: ["Marketing", "Content", "Campaigns"],
    industry: "Marketing & Growth",
    pathwayFit: ["degree", "beyond"],
    eligibleDegrees: ["BBA", "B.Com", "BA", "MBA", "B.Sc.", "B.Tech"],
    badgeNote: "May require relevant skills or portfolio · Cross-Degree Open",
    experienceLevel: "Fresher",
    workMode: "Hybrid",
    locations: ["Bengaluru", "Mumbai", "Delhi NCR", "Pune", "Chennai", "Remote"],
    matchBase: 92,
    overview:
      "Plans, executes, and optimizes multi-channel digital campaigns across search (SEO/SEM), paid social, content ecosystems, and marketing automation to acquire customers and build brand equity.",
    orgFit:
      "Part of the Brand, Growth Marketing & Demand Generation team, working alongside Creative, Product, and Sales.",
    responsibilities: [
      "Manage SEO content calendars, keyword research, and on-page/technical search optimization.",
      "Plan and optimize paid performance campaigns across Google Ads, Meta Ads, and LinkedIn.",
      "Analyze funnel conversion metrics, ROAS, and cohort retention using GA4 and attribution tools.",
      "Design A/B landing page experiments and automated email/WhatsApp lifecycle journeys.",
    ],
    eligibility: {
      acceptedDegrees: "Open to all degrees (BBA, B.Com, BA, B.Sc., B.Tech, MBA) with demonstrated portfolio",
      qualifications: "Analytical mindset, creative copywriting ability, and familiarity with ad platforms",
      experienceReq: "0–3 years; live campaign portfolio, blog, or growth internship highly valued",
      entryRoutes: "Portfolio-first hiring, Digital Marketing CIR Assessment, Growth Apprenticeships",
    },
    salary: {
      entry: {
        range: "₹4.0 LPA – ₹7.0 LPA",
        monthly: "₹32,000 – ₹54,000 / mo",
        note: "Digital Marketing Executive / SEO & Performance Associate (0–2 yrs)",
      },
      mid: {
        range: "₹8.5 LPA – ₹15.5 LPA",
        monthly: "₹68,000 – ₹1,22,000 / mo",
        note: "Growth Marketing Manager / Performance Lead (3–6 yrs)",
      },
      senior: {
        range: "₹18.0 LPA – ₹32.0 LPA",
        monthly: "₹1,42,000 – ₹2,55,000 / mo",
        note: "Head of Growth / VP Digital Marketing & Brand (7+ yrs)",
      },
    },
    skills: {
      essential: [
        "Search Engine Optimization (SEO) & Content Strategy",
        "Performance Marketing (Google Ads & Meta Ads)",
        "Web Analytics & Funnel Tracking (GA4)",
        "Copywriting & Social Media Campaign Management",
      ],
      preferred: [
        "Conversion Rate Optimization (CRO) & A/B Testing",
        "Marketing Automation & Lifecycle CRM",
        "AI Content & Creative Generation Workflows",
        "CAC / ROAS Attribution Modeling",
      ],
      tools: [
        "Google Analytics 4 (GA4) & Search Console",
        "Ahrefs / SEMrush",
        "Meta Ads Manager & Google Ads",
        "HubSpot / WebEngage / Canva / Figma",
      ],
      certifications: [
        "IAmTalento Digital Marketing Fundamentals CIR Certificate",
        "Google Ads & GA4 Analytics Certification",
        "Meta Certified Digital Marketing Associate",
      ],
      demonstrableProjects: [
        "Live SEO Audit & 90-Day Organic Traffic Growth Case Study",
        "Mock ₹50,000 Paid Acquisition Media Plan with ROAS Forecast",
        "High-Converting Landing Page & Email Drip Funnel",
      ],
    },
    futureOutlook: {
      demandTrend:
        "High growth driven by D2C brands, SaaS global expansion, and AI-powered performance marketing (+21% digital ad spend growth).",
      demandSource: "Dentsu-e4m Digital Advertising in India Report & Naukri Hiring Index (Oct 2026)",
      emergingTech: [
        "Generative Engine Optimization (GEO / AI Search Visibility)",
        "AI Creative & Video Ad Variation Engines",
        "First-Party Data & Cookieless Attribution",
      ],
      futureSkills: [
        "AI Marketing Workflow Automation",
        "Full-Funnel Revenue Attribution",
        "Short-Form Video & Community-Led Growth",
      ],
      advancementPath: [
        "Digital Marketing Executive",
        "Performance / Growth Marketing Manager",
        "Director of Demand Generation",
        "Chief Marketing Officer (CMO)",
      ],
      alternativeRoles: [
        "Product Marketing Manager (PMM)",
        "Brand & Content Strategist",
        "E-Commerce Marketplace Manager",
        "Social Media & Community Lead",
      ],
    },
  },
  {
    id: "hre",
    title: "HR & Recruitment Executive",
    categoryTags: ["Human Resources", "Talent Acquisition"],
    industry: "Human Resources",
    pathwayFit: ["degree", "beyond"],
    eligibleDegrees: ["BBA", "MBA", "BA", "B.Com", "B.Sc."],
    badgeNote: "Requirements vary by employer · People & Culture Track",
    experienceLevel: "Fresher",
    workMode: "Hybrid",
    locations: ["Bengaluru", "Chennai", "Hyderabad", "Mumbai", "Pune", "Delhi NCR"],
    matchBase: 90,
    overview:
      "Manages end-to-end talent acquisition, skill-first candidate screening, onboarding workflows, and employee engagement programs to build high-performing teams.",
    orgFit:
      "Core member of the People Operations, Talent Acquisition & HR Business Partner (HRBP) function.",
    responsibilities: [
      "Partner with hiring managers to define role competencies, job descriptions, and skill rubrics.",
      "Source, screen, and coordinate candidate interviews using ATS platforms and CIR scorecards.",
      "Drive smooth candidate onboarding, HR policy compliance, and employee lifecycle operations.",
      "Track recruitment KPIs (Time-to-Hire, Quality-of-Hire, Offer Acceptance Rate) and employer branding.",
    ],
    eligibility: {
      acceptedDegrees: "BBA (HR), MBA (HR), BA (Psychology/Sociology), B.Com, or any graduate with people skills",
      qualifications: "Empathy, structured interviewing skills, organizational precision, and confidentiality",
      experienceReq: "0–2 years for Executive; campus recruitment or HR internship advantageous",
      entryRoutes: "Talent Acquisition fellowships, HR Operations roles, IAmTalento HR CIR Assessment",
    },
    salary: {
      entry: {
        range: "₹3.8 LPA – ₹6.5 LPA",
        monthly: "₹30,000 – ₹50,000 / mo",
        note: "HR Executive / Talent Acquisition Associate (0–2 yrs)",
      },
      mid: {
        range: "₹7.5 LPA – ₹14.0 LPA",
        monthly: "₹60,000 – ₹1,10,000 / mo",
        note: "Senior Technical Recruiter / HR Business Partner (3–6 yrs)",
      },
      senior: {
        range: "₹16.0 LPA – ₹30.0 LPA",
        monthly: "₹1,28,000 – ₹2,40,000 / mo",
        note: "Head of Talent Acquisition / VP People & Culture (7+ yrs)",
      },
    },
    skills: {
      essential: [
        "End-to-End Talent Sourcing & Boolean Search",
        "Competency-Based Behavioral Interviewing",
        "Employee Onboarding & HR Operations",
        "Stakeholder & Candidate Experience Management",
      ],
      preferred: [
        "Skill-First Hiring & CIR Scorecard Evaluation",
        "HR Analytics & Compensation Benchmarking",
        "Indian Labour Law & Compliance Fundamentals",
        "Employer Branding & Campus Relations",
      ],
      tools: [
        "Greenhouse / Lever / Darwinbox / Keka HRMS",
        "LinkedIn Recruiter & IAmTalento Employer Suite",
        "HRIS & Payroll Dashboards",
        "Excel People Analytics",
      ],
      certifications: [
        "IAmTalento Verified HR & Talent Acquisition CIR Credential",
        "SHRM-CP / HRCI Associate Professional",
        "LinkedIn Certified Professional – Recruiter",
      ],
      demonstrableProjects: [
        "Structured Interview Rubric & Scorecard for a Tech/Business Role",
        "30-60-90 Day Employee Onboarding & Retention Blueprint",
        "Hiring Funnel Conversion & Diversity Audit Report",
      ],
    },
    futureOutlook: {
      demandTrend:
        "Steady evolution toward AI-assisted skill-based hiring and People Analytics across GCCs and Indian enterprises.",
      demandSource: "SHRM India & Deloitte Global Human Capital Trends (Oct 2026)",
      emergingTech: [
        "AI Proctored Skill Verification & Autonomous Screening",
        "Predictive Attrition & People Analytics Platforms",
        "Automated Onboarding & Employee Self-Service Copilots",
      ],
      futureSkills: [
        "Skills-Based Workforce Planning",
        "People Data Analytics & DEI Strategy",
        "AI Recruitment Tool Orchestration",
      ],
      advancementPath: [
        "HR & Recruitment Executive",
        "Talent Acquisition Lead / HR Business Partner (HRBP)",
        "Director of People Operations",
        "Chief Human Resources Officer (CHRO)",
      ],
      alternativeRoles: [
        "Learning & Development (L&D) Specialist",
        "Employer Branding Manager",
        "People Analytics Specialist",
        "Campus Relations Program Manager",
      ],
    },
  },
  {
    id: "ba",
    title: "Business & Financial Analyst",
    categoryTags: ["Analytics", "Finance", "Strategy"],
    industry: "Finance & Analytics",
    pathwayFit: ["degree", "beyond"],
    eligibleDegrees: ["B.Com", "BBA", "MBA", "B.Tech", "B.Sc.", "BA"],
    badgeNote: "High Compensation Growth · Data & Strategy Track",
    experienceLevel: "Fresher",
    workMode: "Hybrid",
    locations: ["Bengaluru", "Mumbai", "Gurugram", "Hyderabad", "Pune", "Chennai"],
    matchBase: 91,
    overview:
      "Bridges business strategy and data by analyzing financial performance, customer KPIs, and operational workflows to recommend high-impact product and revenue decisions.",
    orgFit:
      "Embedded within Strategy, FP&A, Product Analytics, or Corporate Finance teams.",
    responsibilities: [
      "Gather business requirements, map process workflows, and define measurable KPIs.",
      "Write SQL queries and build interactive Power BI / Tableau dashboards for leadership.",
      "Conduct financial modeling, variance analysis, and unit-economics forecasting.",
      "Present data-backed strategic recommendations to product and executive stakeholders.",
    ],
    eligibility: {
      acceptedDegrees: "B.Com, BBA, MBA, B.Tech, B.Sc. (Stats/Math/CS), or BA (Economics)",
      qualifications: "Quantitative aptitude, structured problem-solving, SQL/Excel proficiency",
      experienceReq: "0–3 years; case study competitions or analytics projects strongly valued",
      entryRoutes: "Business Analyst campus tracks, FinTech/GCC analyst programs, SQL & Analytics CIR test",
    },
    salary: {
      entry: {
        range: "₹5.5 LPA – ₹9.5 LPA",
        monthly: "₹44,000 – ₹75,000 / mo",
        note: "Junior Business / Financial Analyst (0–2 yrs)",
      },
      mid: {
        range: "₹11.0 LPA – ₹20.0 LPA",
        monthly: "₹88,000 – ₹1,58,000 / mo",
        note: "Senior Business Analyst / Product & Strategy Analyst (3–6 yrs)",
      },
      senior: {
        range: "₹22.0 LPA – ₹40.0 LPA",
        monthly: "₹1,75,000 – ₹3,15,000 / mo",
        note: "Principal Strategy Manager / Director of Analytics (7+ yrs)",
      },
    },
    skills: {
      essential: [
        "Advanced Excel & Financial Modeling",
        "SQL Querying & Data Extraction",
        "Business Requirement Documentation (BRD / FRD)",
        "Data Visualization & Executive Storytelling",
      ],
      preferred: [
        "Python for Data Analysis (Pandas)",
        "A/B Experimentation & Statistical Hypothesis Testing",
        "SaaS & FinTech Unit Economics",
        "Agile / Scrum Product Lifecycle",
      ],
      tools: [
        "Microsoft Excel (Power Query, Pivot, Macros)",
        "Power BI / Tableau",
        "PostgreSQL / BigQuery",
        "Jira & Confluence",
      ],
      certifications: [
        "IAmTalento Verified SQL & Business Analytics CIR Certificate",
        "Microsoft Certified: Power BI Data Analyst Associate",
        "IIBA ECBA / Financial Modeling Valuation Analyst (FMVA)",
      ],
      demonstrableProjects: [
        "Interactive Revenue & Churn Executive Dashboard in Power BI",
        "SQL E-Commerce Cohort & Retention Analysis Repository",
        "3-Statement Financial & Unit Economics Model for a SaaS Startup",
      ],
    },
    futureOutlook: {
      demandTrend:
        "Rapid expansion across Global Capability Centers (GCCs), FinTech, and Consulting in India (+24% demand for SQL + AI-literate analysts).",
      demandSource: "NASSCOM GCC India Report & WEF Future of Jobs (Oct 2026)",
      emergingTech: [
        "AI Copilots for Automated SQL & BI Insights",
        "Predictive Revenue & Churn Machine Learning Models",
        "Real-Time Cloud Data Warehousing (Snowflake, Databricks)",
      ],
      futureSkills: [
        "AI-Augmented Decision Intelligence",
        "Product & Revenue Analytics",
        "Cross-Functional Strategic Consulting",
      ],
      advancementPath: [
        "Business / Financial Analyst",
        "Senior Product / Strategy Analyst",
        "Associate Product Manager / Analytics Lead",
        "VP of Strategy & Business Intelligence",
      ],
      alternativeRoles: [
        "Product Manager (APM / PM)",
        "Data Analyst",
        "Management Consultant",
        "Corporate Finance (FP&A) Specialist",
      ],
    },
  },
  {
    id: "sde",
    title: "Full-Stack & AI Application Engineer",
    categoryTags: ["Technology", "Software", "AI Engineering"],
    industry: "Technology & AI",
    pathwayFit: ["degree", "beyond"],
    eligibleDegrees: ["B.Tech", "B.Sc.", "BCA", "MCA", "MBA", "BBA"],
    badgeNote: "Eligible for Tech Degrees & Verified Skill Switchers",
    experienceLevel: "Fresher",
    workMode: "Remote",
    locations: ["Bengaluru", "Hyderabad", "Pune", "Chennai", "Remote", "Pan-India"],
    matchBase: 94,
    overview:
      "Designs, builds, and deploys scalable web applications, APIs, and AI-integrated workflows using modern frontend (React/TypeScript) and backend (Node.js/Python/SQL) stacks.",
    orgFit:
      "Core Engineering & Product Development organization collaborating with Product Managers, Designers, and DevOps.",
    responsibilities: [
      "Build responsive, accessible user interfaces with React 18, TypeScript, and modern state management.",
      "Design secure REST/GraphQL APIs, relational database schemas, and caching layers.",
      "Integrate LLM APIs, RAG pipelines, and automated testing into production workflows.",
      "Participate in code reviews, CI/CD deployments, and performance optimization.",
    ],
    eligibility: {
      acceptedDegrees: "B.Tech / B.E., BCA, MCA, B.Sc. (CS/IT), or Career Switchers with verified CIR coding scores",
      qualifications: "Strong Data Structures, JavaScript/TypeScript fluency, and deployed project portfolio",
      experienceReq: "0–3 years; GitHub portfolio and proctored coding assessment score prioritized over degree",
      entryRoutes: "IAmTalento Verified Coding Assessment (80%+ CIR), Hackathons, Direct Product Engineering",
    },
    salary: {
      entry: {
        range: "₹6.5 LPA – ₹12.0 LPA",
        monthly: "₹52,000 – ₹95,000 / mo",
        note: "SDE-1 / Full-Stack Associate Engineer (0–2 yrs)",
      },
      mid: {
        range: "₹14.0 LPA – ₹26.0 LPA",
        monthly: "₹1,12,000 – ₹2,05,000 / mo",
        note: "SDE-2 / Senior Full-Stack & AI Engineer (3–6 yrs)",
      },
      senior: {
        range: "₹28.0 LPA – ₹52.0 LPA",
        monthly: "₹2,20,000 – ₹4,10,000 / mo",
        note: "Staff Engineer / Engineering Architect (7+ yrs)",
      },
    },
    skills: {
      essential: [
        "React 18, TypeScript & Modern Frontend Architecture",
        "Node.js / Python Backend & REST API Design",
        "Relational Databases (PostgreSQL / SQL) & Indexing",
        "Git Version Control & Automated Testing",
      ],
      preferred: [
        "LLM Integration, Prompt Engineering & RAG Pipelines",
        "Docker, Kubernetes & AWS Cloud Deployment",
        "System Design & Web Performance Optimization",
        "CI/CD GitHub Actions & Security Best Practices",
      ],
      tools: [
        "VS Code / Cursor / GitHub Copilot",
        "React, Next.js, TypeScript, Tailwind CSS",
        "PostgreSQL, Redis, Docker, AWS",
        "Postman, Vitest / Playwright",
      ],
      certifications: [
        "IAmTalento Verified React, TypeScript & SQL CIR Credentials",
        "AWS Certified Developer / Solutions Architect Associate",
        "Meta / Google Full-Stack Engineering Credential",
      ],
      demonstrableProjects: [
        "Production Full-Stack SaaS App with Auth, RBAC & Real-Time Analytics",
        "AI Document Assistant using RAG & Vector Search",
        "High-Throughput REST API with Caching & Automated Test Suite",
      ],
    },
    futureOutlook: {
      demandTrend:
        "Highest-paying technical track in India; strong shift toward engineers who combine full-stack fundamentals with AI orchestration.",
      demandSource: "NASSCOM AI & Tech Talent Demand Study & GitHub Octoverse (Oct 2026)",
      emergingTech: [
        "Agentic AI Workflows & Multi-Modal LLM APIs",
        "Edge Computing & Serverless Cloud Databases",
        "AI-Assisted Code Generation & Automated QA",
      ],
      futureSkills: [
        "AI Agent Architecture & Evaluation",
        "Distributed System Design",
        "Cloud Cost & Security Engineering",
      ],
      advancementPath: [
        "Full-Stack Engineer (SDE-1)",
        "Senior Product Engineer (SDE-2 / SDE-3)",
        "Staff / Principal Architect",
        "VP of Engineering / CTO",
      ],
      alternativeRoles: [
        "Frontend UI Architect",
        "Backend & Data Engineer",
        "AI Solutions Engineer",
        "Technical Product Manager",
      ],
    },
  },
  {
    id: "csm",
    title: "Customer Success & Account Specialist",
    categoryTags: ["Customer Success", "SaaS", "Retention"],
    industry: "Business & Sales",
    pathwayFit: ["beyond"],
    eligibleDegrees: ["BBA", "B.Com", "BA", "B.Sc.", "MBA", "B.Tech"],
    badgeNote: "Path 02 Favourite · Open to All Educational Backgrounds",
    experienceLevel: "Fresher",
    workMode: "Remote",
    locations: ["Bengaluru", "Chennai", "Pune", "Hyderabad", "Remote", "Pan-India"],
    matchBase: 89,
    overview:
      "Ensures enterprise and mid-market customers achieve measurable business outcomes after onboarding, driving product adoption, renewals, and account expansion.",
    orgFit:
      "Post-Sales Customer Experience & Revenue Retention organization working closely with Product and Sales.",
    responsibilities: [
      "Lead structured customer onboarding, product training sessions, and quarterly business reviews (QBRs).",
      "Monitor account health scores and proactively resolve adoption bottlenecks.",
      "Identify upsell/cross-sell expansion opportunities in partnership with Account Executives.",
      "Advocate for customer feature requests with Engineering and Product teams.",
    ],
    eligibility: {
      acceptedDegrees: "Any bachelor's or master's degree (BBA, BA, B.Com, B.Sc., B.Tech, MBA)",
      qualifications: "Exceptional empathy, problem-solving, presentation skills, and tech curiosity",
      experienceReq: "0–2 years; open to freshers and career switchers from support, hospitality, or operations",
      entryRoutes: "SaaS Customer Success associate programs, Verified Communication & SaaS CIR test",
    },
    salary: {
      entry: {
        range: "₹4.5 LPA – ₹8.0 LPA",
        monthly: "₹36,000 – ₹62,000 / mo",
        note: "Customer Success Associate / Onboarding Specialist (0–2 yrs)",
      },
      mid: {
        range: "₹9.5 LPA – ₹17.0 LPA",
        monthly: "₹75,000 – ₹1,35,000 / mo",
        note: "Senior Customer Success Manager (3–6 yrs)",
      },
      senior: {
        range: "₹19.0 LPA – ₹35.0 LPA",
        monthly: "₹1,50,000 – ₹2,75,000 / mo",
        note: "Director / VP of Customer Success & Net Revenue Retention (7+ yrs)",
      },
    },
    skills: {
      essential: [
        "Customer Onboarding & Product Adoption Coaching",
        "Executive Quarterly Business Reviews (QBRs)",
        "Churn Risk Mitigation & Account Health Tracking",
        "Cross-Functional Technical Troubleshooting",
      ],
      preferred: [
        "Net Revenue Retention (NRR) & Expansion Strategy",
        "API & SaaS Workflow Familiarity",
        "Customer Advocacy & Case Study Creation",
        "Data-Driven Health Scoring",
      ],
      tools: [
        "Gainsight / ChurnZero / HubSpot Service Hub",
        "Zendesk / Intercom",
        "Notion, Loom & Figma",
        "Excel & Product Analytics (Mixpanel / Amplitude)",
      ],
      certifications: [
        "IAmTalento Customer Success & Communication CIR Certificate",
        "SuccessHACKER Certified Customer Success Manager (CCSM)",
        "HubSpot Service Hub & Onboarding Credential",
      ],
      demonstrableProjects: [
        "30-Day SaaS Enterprise Onboarding Playbook",
        "Executive QBR Deck with ROI & Adoption Metrics",
        "At-Risk Account Turnaround & Retention Strategy",
      ],
    },
    futureOutlook: {
      demandTrend:
        "Critical growth role in recurring-revenue SaaS businesses where Net Revenue Retention (NRR) drives company valuation.",
      demandSource: "SaaSBOOMi India Report & Gainsight CS Index (Oct 2026)",
      emergingTech: [
        "AI Telemetry for Early Churn Prediction",
        "Automated In-App Onboarding & Digital Touch CS",
        "Conversational AI Support Co-Pilots",
      ],
      futureSkills: [
        "Commercial Renewal & Expansion Negotiation",
        "Product Usage Telemetry Analysis",
        "Strategic Executive Advisory",
      ],
      advancementPath: [
        "Customer Success Associate",
        "Senior Customer Success Manager (Enterprise)",
        "Director of Customer Success",
        "Chief Customer Officer (CCO)",
      ],
      alternativeRoles: [
        "Account Manager",
        "Implementation Consultant",
        "Product Operations Specialist",
        "Solutions Consultant",
      ],
    },
  },
];

const EDUCATION_OPTIONS = [
  "BBA",
  "B.Com",
  "B.Tech",
  "MBA",
  "BA",
  "B.Sc.",
  "BCA / MCA",
];

const SPECIALISATION_OPTIONS = [
  "Marketing",
  "Finance",
  "HR",
  "Computer Science",
  "Business Analytics",
  "Operations",
  "General Management",
];

const COUNTRY_OPTIONS = [
  "India",
  "UAE / Dubai",
  "Singapore",
  "United Kingdom",
  "United States",
  "Global Remote",
];

const EXPERIENCE_OPTIONS = ["Fresher", "Experienced", "Career Switcher"] as const;

const INTEREST_OPTIONS = [
  "Business",
  "Marketing",
  "Technology",
  "Finance",
  "HR & People",
  "Sales & Growth",
  "Analytics & AI",
];

const LOCATION_OPTIONS = [
  "Bengaluru (Hybrid / On-Site)",
  "Chennai / Hyderabad / Pune",
  "Mumbai / Delhi NCR",
  "Pan-India Flexible",
  "Remote / Work From Anywhere",
];

const SALARY_EXPECTATION_OPTIONS = [
  "₹4 LPA – ₹8 LPA (Entry Track)",
  "₹8 LPA – ₹15 LPA (Growth Track)",
  "₹15 LPA – ₹25 LPA (High-Skill Track)",
  "Open to Market Benchmark",
];

const USER_JOURNEY_STEPS = [
  { step: "STEP 1", title: "Create Your Profile", anchor: "section-profile" },
  { step: "STEP 2", title: "Choose Your Career Pathway", anchor: "section-pathway" },
  { step: "STEP 3", title: "Explore Recommended Job Roles", anchor: "section-roles" },
  { step: "STEP 4", title: "View Responsibilities, Skills & Salary", anchor: "section-detail" },
  { step: "STEP 5", title: "Understand Future Career Prospects", anchor: "section-future" },
  { step: "STEP 6", title: "Get Your Personalised Roadmap", anchor: "section-roadmap" },
  { step: "STEP 7", title: "Learn, Assess & Apply", anchor: "section-connect" },
];

const AiGuidance: React.FC = () => {
  const navigate = useNavigate();

  // Section 02: Candidate Profile Setup State
  const [education, setEducation] = useState("BBA");
  const [specialisation, setSpecialisation] = useState("Marketing");
  const [country, setCountry] = useState("India");
  const [experience, setExperience] = useState<"Fresher" | "Experienced" | "Career Switcher">("Fresher");
  const [interests, setInterests] = useState<string[]>(["Business", "Marketing", "Sales & Growth"]);
  const [preferredLocation, setPreferredLocation] = useState("Bengaluru (Hybrid / On-Site)");
  const [salaryExpectation, setSalaryExpectation] = useState("₹4 LPA – ₹8 LPA (Entry Track)");
  const [lastGeneratedAt, setLastGeneratedAt] = useState("Live AI Profile Synced");

  // Section 03: Selected Career Discovery Path ("degree" = Path 01, "beyond" = Path 02)
  const [selectedPathway, setSelectedPathway] = useState<"degree" | "beyond">("degree");

  // Section 04: Filters for Personalised Career Opportunities
  const [industryFilter, setIndustryFilter] = useState<string>("All");
  const [workModeFilter, setWorkModeFilter] = useState<string>("All");
  const [searchRoleQuery, setSearchRoleQuery] = useState<string>("");

  // Section 05, 06, 07, 08, 09: Active Selected Role for Deep-Dive
  const [activeRoleId, setActiveRoleId] = useState<string>("bde");
  const [cityTierMultiplier, setCityTierMultiplier] = useState<"tier1" | "tier2" | "remote">("tier1");

  // Section 07: Interactive Skill Gap Checker State
  const [checkedSkills, setCheckedSkills] = useState<Record<string, boolean>>({
    "Consultative B2B/B2C Communication": true,
    "Market & Competitor Research": true,
    "Microsoft Excel & PowerPoint / Pitch Decks": true,
  });
  const [showSkillGapAnalysis, setShowSkillGapAnalysis] = useState(false);

  // Section 08: Interactive Roadmap Builder Modal
  const [roadmapModalOpen, setRoadmapModalOpen] = useState(false);
  const [activeJourneyStep, setActiveJourneyStep] = useState(0);

  const profileSectionRef = useRef<HTMLDivElement>(null);
  const rolesSectionRef = useRef<HTMLDivElement>(null);
  const detailSectionRef = useRef<HTMLDivElement>(null);
  const roadmapSectionRef = useRef<HTMLDivElement>(null);

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.length > 1
          ? prev.filter((i) => i !== interest)
          : prev
        : [...prev, interest]
    );
  };

  // Compute Personalized Career Opportunities based on Profile + Pathway + Filters
  const recommendedRoles = useMemo(() => {
    return CAREER_ROLES_DB.filter((role) => {
      if (selectedPathway === "degree") {
        const degClean = education.split(" ")[0];
        const matchesDeg =
          role.eligibleDegrees.some((d) => d.includes(degClean) || degClean.includes(d)) ||
          role.pathwayFit.includes("degree");
        if (!matchesDeg) return false;
      }
      if (industryFilter !== "All" && role.industry !== industryFilter) {
        return false;
      }
      if (workModeFilter !== "All" && role.workMode !== workModeFilter) {
        return false;
      }
      if (
        searchRoleQuery.trim() &&
        !`${role.title} ${role.categoryTags.join(" ")} ${role.industry}`
          .toLowerCase()
          .includes(searchRoleQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [selectedPathway, education, industryFilter, workModeFilter, searchRoleQuery]);

  const activeRole = useMemo(
    () => CAREER_ROLES_DB.find((r) => r.id === activeRoleId) || CAREER_ROLES_DB[0],
    [activeRoleId]
  );

  // Compute live skill readiness percentage for Section 07
  const allRoleSkills = useMemo(() => {
    return [
      ...activeRole.skills.essential,
      ...activeRole.skills.preferred,
      ...activeRole.skills.tools,
    ];
  }, [activeRole]);

  const matchedSkillsCount = useMemo(() => {
    return allRoleSkills.filter((s) => checkedSkills[s]).length;
  }, [allRoleSkills, checkedSkills]);

  const skillReadinessPct = useMemo(() => {
    if (!allRoleSkills.length) return 65;
    return Math.max(25, Math.min(100, Math.round((matchedSkillsCount / allRoleSkills.length) * 100)));
  }, [allRoleSkills, matchedSkillsCount]);

  const handleGenerateCareerOptions = (e: React.FormEvent) => {
    e.preventDefault();
    setLastGeneratedAt(
      "Updated " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
    if (education === "B.Tech" || education === "BCA / MCA" || specialisation === "Computer Science") {
      setActiveRoleId("sde");
    } else if (education === "B.Com" || specialisation === "Finance" || specialisation === "Business Analytics") {
      setActiveRoleId("ba");
    } else if (specialisation === "HR") {
      setActiveRoleId("hre");
    } else {
      setActiveRoleId("bde");
    }
    toast.success(
      `SI Guide generated ${CAREER_ROLES_DB.length} personalised career options for ${education} (${specialisation}) in ${country}!`
    );
    rolesSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToSection = (id: string, stepIdx?: number) => {
    if (stepIdx !== undefined) setActiveJourneyStep(stepIdx);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const degreeExampleText = useMemo(() => {
    if (education === "B.Tech" || education === "BCA / MCA") {
      return `Example: ${education} graduate in ${country} → Full-Stack Engineering, Business & Data Analytics, Product Management and Cloud SRE roles.`;
    }
    if (education === "B.Com") {
      return `Example: B.Com graduate in ${country} → Financial & Business Analysis, Commercial Sales, Digital Marketing and FinTech Operations roles.`;
    }
    return `Example: ${education} graduate in ${country} → Business Development, Marketing, HR and Operations roles.`;
  }, [education, country]);

  const beyondDegreeExampleText = useMemo(() => {
    return `Example: ${education} graduate → Digital Marketing, Customer Success, Sales, Recruitment and eligible entry-level tech roles.`;
  }, [education]);

  return (
    <Layout>
      <Helmet>
        <title>Super Intelligence (SI) Career Guide | AI Guidance | IAmTalento</title>
        <meta
          name="description"
          content="Your Education. Your Options. Your Future. Discover the careers you can pursue, the skills you need, the salary you could earn and the opportunities waiting for you — powered by AI."
        />
      </Helmet>

      <div className="min-h-screen text-slate-900 pt-20 pb-20">
        {/* =====================================================================
            01. HERO SECTION — SUPER INTELLIGENCE GUIDE (WITH PDF IMAGE 1)
        ===================================================================== */}
        <section className="py-10 lg:py-16 border-b border-slate-200/80">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Left Column: High-Contrast Executive Typography */}
              <div className="lg:col-span-6 space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#002C66] px-4 py-1.5 text-xs font-extrabold tracking-wider uppercase text-white shadow-xs">
                  <Sparkles className="h-3.5 w-3.5 text-[#FB923C]" />
                  <span>SUPER INTELLIGENCE GUIDE</span>
                </div>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight leading-[1.08] text-slate-950">
                  Your Education.{" "}
                  <span className="text-[#002C66] block sm:inline">Your Options.</span>{" "}
                  <span className="text-[#EA580C]">Your Future.</span>
                </h1>

                <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed max-w-xl">
                  Discover the careers you can pursue, the skills you need, the salary you could earn and the opportunities waiting for you — powered by AI.
                </p>

                <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
                  Personalised career guidance based on your education, interests and career preferences.
                </p>

                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <button
                    type="button"
                    onClick={() => scrollToSection("section-profile", 0)}
                    className="inline-flex items-center gap-2.5 rounded-xl bg-[#002C66] hover:bg-[#001F4D] px-7 py-4 text-sm font-extrabold text-white shadow-md transition-all cursor-pointer"
                  >
                    <Compass className="h-5 w-5 text-[#FB923C]" />
                    Discover My Career Path
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => scrollToSection("section-roles", 2)}
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-[#002C66]/20 bg-white hover:border-[#002C66] px-6 py-3.5 text-sm font-bold text-[#002C66] shadow-2xs transition-all cursor-pointer"
                  >
                    <Briefcase className="h-4 w-4 text-[#EA580C]" />
                    Explore Career Options ({CAREER_ROLES_DB.length})
                  </button>
                </div>

                {/* High-Contrast KPI Strip */}
                <div className="grid grid-cols-3 gap-3 pt-4 max-w-xl">
                  <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
                    <div className="text-lg font-extrabold text-[#002C66]">2 Pathways</div>
                    <div className="text-[11px] font-medium text-slate-600">Degree &amp; Beyond-Degree</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
                    <div className="text-lg font-extrabold text-emerald-700">Live ₹ Salary</div>
                    <div className="text-[11px] font-medium text-slate-600">Entry, Mid &amp; Senior Tiers</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
                    <div className="text-lg font-extrabold text-[#EA580C]">7-Step Flow</div>
                    <div className="text-[11px] font-medium text-slate-600">Actionable Career Roadmap</div>
                  </div>
                </div>
              </div>

              {/* Right Column: PDF Hero Image (Robot + Candidate with TOP COURSES, BEST COLLEGES, CAREER SUGGESTIONS) */}
              <div className="lg:col-span-6">
                <div className="rounded-3xl border-2 border-slate-200/90 bg-white p-3 sm:p-4 shadow-xl space-y-3">
                  <div className="relative overflow-hidden rounded-2xl border border-slate-200">
                    <img
                      src={heroRobotImg}
                      alt="AI Super Intelligence Guide assisting student with Top Courses, Best Colleges, and Career Suggestions"
                      className="w-full h-[300px] sm:h-[370px] object-cover object-center"
                    />
                    <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-[#002C66] px-3 py-1 text-[11px] font-bold text-white shadow-md">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      AI Career Companion Live
                    </div>
                  </div>

                  {/* Interactive Quick-Jump Bar Below the Hero Photo */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => scrollToSection("section-skills", 3)}
                      className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-[#002C66] hover:text-white p-3 text-left transition-all cursor-pointer group"
                    >
                      <BookOpen className="h-4 w-4 text-[#002C66] group-hover:text-[#FB923C] shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[11px] font-extrabold truncate">Top Courses For You</div>
                        <div className="text-[10px] text-slate-500 group-hover:text-white/80 truncate">
                          Close skill gaps
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => scrollToSection("section-detail", 3)}
                      className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-[#002C66] hover:text-white p-3 text-left transition-all cursor-pointer group"
                    >
                      <GraduationCap className="h-4 w-4 text-[#EA580C] group-hover:text-[#FB923C] shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[11px] font-extrabold truncate">Degree &amp; Eligibility</div>
                        <div className="text-[10px] text-slate-500 group-hover:text-white/80 truncate">
                          {education} ({specialisation})
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => scrollToSection("section-roles", 2)}
                      className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-[#002C66] hover:text-white p-3 text-left transition-all cursor-pointer group"
                    >
                      <Briefcase className="h-4 w-4 text-emerald-600 group-hover:text-emerald-300 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[11px] font-extrabold truncate">Career Suggestions</div>
                        <div className="text-[10px] text-slate-500 group-hover:text-white/80 truncate">
                          {activeRole.salary.entry.range}
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            RECOMMENDED SI GUIDE USER JOURNEY (7-STEP INTERACTIVE NAVIGATOR)
        ===================================================================== */}
        <div className="sticky top-16 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
          <div className="container py-3">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#002C66] flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-[#EA580C]" />
                Recommended SI Guide User Journey (Interactive 7-Step Workflow)
              </span>
              <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">
                Click any step to jump directly to that stage
              </span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {USER_JOURNEY_STEPS.map((item, idx) => {
                const isActive = activeJourneyStep === idx;
                return (
                  <button
                    key={item.step}
                    type="button"
                    onClick={() => scrollToSection(item.anchor, idx)}
                    className={cn(
                      "shrink-0 inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer border",
                      isActive
                        ? "bg-[#002C66] text-white border-[#002C66] shadow-xs"
                        : "bg-slate-50 text-slate-800 border-slate-200 hover:border-[#002C66]"
                    )}
                  >
                    <span
                      className={cn(
                        "rounded-md px-1.5 py-0.5 text-[10px] font-extrabold",
                        isActive ? "bg-[#FB923C] text-white" : "bg-[#002C66]/10 text-[#002C66]"
                      )}
                    >
                      {item.step}
                    </span>
                    <span className="whitespace-nowrap">{item.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="container space-y-16 pt-12">
          {/* =====================================================================
              02. CANDIDATE PROFILE SETUP — "Tell Us About Yourself."
          ===================================================================== */}
          <section id="section-profile" ref={profileSectionRef} className="scroll-mt-36">
            <div className="rounded-3xl border border-slate-200 bg-white shadow-md overflow-hidden">
              <div className="h-2 w-full bg-[#002C66]" />
              <div className="p-6 sm:p-8 lg:p-10 space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-6">
                  <div className="space-y-1.5">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#002C66]/10 px-3.5 py-1 text-xs font-extrabold text-[#002C66]">
                      02. Candidate Profile Setup
                    </span>
                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-950">
                      Tell Us About Yourself.
                    </h2>
                    <p className="text-sm text-slate-600 max-w-2xl">
                      Your career journey starts with understanding where you are today. Provide a few details to receive relevant career recommendations.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-50 px-4 py-3">
                    <UserCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                    <div className="text-xs">
                      <div className="font-bold text-slate-900">{lastGeneratedAt}</div>
                      <div className="text-slate-600">
                        {education} ({specialisation}) · {experience} · {country}
                      </div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleGenerateCareerOptions} className="space-y-6">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {/* 1. Highest Education */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <GraduationCap className="h-4 w-4 text-[#002C66]" />
                        Highest Education
                      </label>
                      <select
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm font-semibold text-slate-900"
                      >
                        {EDUCATION_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-slate-500">
                        BBA, B.Com, B.Tech, MBA, BA, B.Sc. and more
                      </p>
                    </div>

                    {/* 2. Specialisation */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <BookOpen className="h-4 w-4 text-[#002C66]" />
                        Specialisation
                      </label>
                      <select
                        value={specialisation}
                        onChange={(e) => setSpecialisation(e.target.value)}
                        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm font-semibold text-slate-900"
                      >
                        {SPECIALISATION_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-slate-500">
                        Marketing, Finance, HR, Computer Science, etc.
                      </p>
                    </div>

                    {/* 3. Country */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <Globe className="h-4 w-4 text-[#002C66]" />
                        Country
                      </label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm font-semibold text-slate-900"
                      >
                        {COUNTRY_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-slate-500">
                        India or another preferred country
                      </p>
                    </div>

                    {/* 4. Career Experience */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <Briefcase className="h-4 w-4 text-[#002C66]" />
                        Career Experience
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {EXPERIENCE_OPTIONS.map((exp) => (
                          <button
                            key={exp}
                            type="button"
                            onClick={() => setExperience(exp)}
                            className={cn(
                              "h-11 rounded-xl border text-xs font-bold transition-all cursor-pointer px-2",
                              experience === exp
                                ? "bg-[#002C66] text-white border-[#002C66]"
                                : "bg-slate-50 text-slate-800 border-slate-300 hover:border-[#002C66]"
                            )}
                          >
                            {exp}
                          </button>
                        ))}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Fresher, Experienced or Career Switcher
                      </p>
                    </div>

                    {/* 5. Preferred Work Location */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-[#002C66]" />
                        Preferred Work Location
                      </label>
                      <select
                        value={preferredLocation}
                        onChange={(e) => setPreferredLocation(e.target.value)}
                        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm font-semibold text-slate-900"
                      >
                        {LOCATION_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-slate-500">
                        City, country, remote or hybrid
                      </p>
                    </div>

                    {/* 6. Salary Expectations (Optional) */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <IndianRupee className="h-4 w-4 text-[#002C66]" />
                        Salary Expectations (Optional)
                      </label>
                      <select
                        value={salaryExpectation}
                        onChange={(e) => setSalaryExpectation(e.target.value)}
                        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm font-semibold text-slate-900"
                      >
                        {SALARY_EXPECTATION_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-slate-500">
                        Used to calibrate target role compensation bands
                      </p>
                    </div>
                  </div>

                  {/* 7. Career Interests Pills */}
                  <div className="space-y-2 pt-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                      Career Interests (Select one or more) — Technology, Business, Marketing, Finance &amp; more
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
                              "inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold border transition-all cursor-pointer",
                              active
                                ? "bg-[#002C66] text-white border-[#002C66]"
                                : "bg-slate-50 text-slate-700 border-slate-300 hover:text-slate-950"
                            )}
                          >
                            {active && <Check className="h-3.5 w-3.5 text-[#FB923C]" />}
                            {interest}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit CTA */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
                    <div className="text-xs text-slate-600">
                      SI Guide matches your profile against{" "}
                      <strong className="text-slate-900">500+ verified employer role rubrics</strong> in real time.
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-xl bg-[#002C66] hover:bg-[#001F4D] px-7 py-3.5 text-sm font-extrabold text-white shadow-md transition-all cursor-pointer"
                    >
                      <Sparkles className="h-4 w-4 text-[#FB923C]" />
                      Generate My Career Options
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>

          {/* =====================================================================
              03. CHOOSE YOUR CAREER DISCOVERY PATH — "Two Ways to Discover Your Future."
              (WITH PDF IMAGES 2 & 3)
          ===================================================================== */}
          <section id="section-pathway" className="scroll-mt-36 space-y-6">
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#002C66]/10 px-3.5 py-1 text-xs font-extrabold text-[#002C66]">
                03. Choose Your Career Discovery Path
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-950">
                Two Ways to Discover Your Future.
              </h2>
              <p className="text-sm text-slate-600">
                Select how you want SI Guide to filter your career opportunities — aligned with your degree or open across all industries.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* PATH 01: Careers Based on My Education (With PDF Image 2) */}
              <div
                onClick={() => {
                  setSelectedPathway("degree");
                  setActiveJourneyStep(1);
                }}
                className={cn(
                  "group rounded-3xl border-2 bg-white overflow-hidden shadow-md transition-all cursor-pointer flex flex-col justify-between",
                  selectedPathway === "degree"
                    ? "border-[#002C66] ring-4 ring-[#002C66]/10"
                    : "border-slate-200 hover:border-[#002C66]/50"
                )}
              >
                <div>
                  {/* PDF Page 3 Image */}
                  <div className="relative h-64 sm:h-72 w-full overflow-hidden border-b border-slate-200">
                    <img
                      src={pathDegreeImg}
                      alt="Path 01: Careers Based on My Education"
                      className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-lg bg-[#002C66] px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-md">
                      <GraduationCap className="h-4 w-4 text-[#FB923C]" />
                      PATH 01
                    </div>
                    {selectedPathway === "degree" && (
                      <div className="absolute top-4 right-4 rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-bold text-white shadow-md">
                        ✓ Active Pathway
                      </div>
                    )}
                  </div>

                  <div className="p-6 sm:p-7 space-y-4">
                    <h3 className="font-display text-2xl font-extrabold text-slate-950">
                      Careers Based on My Education
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Discover career opportunities aligned with your degree, specialisation and qualifications.
                    </p>

                    <div className="rounded-2xl border border-[#002C66]/20 bg-slate-50 p-4 space-y-1">
                      <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#002C66]">
                        Degree-Aligned Mapping ({education} · {specialisation})
                      </div>
                      <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                        {degreeExampleText}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-6 sm:px-7 pb-6">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPathway("degree");
                      scrollToSection("section-roles", 2);
                    }}
                    className={cn(
                      "w-full inline-flex items-center justify-center gap-2 rounded-xl py-3.5 px-5 text-xs font-extrabold transition-all cursor-pointer",
                      selectedPathway === "degree"
                        ? "bg-[#002C66] text-white shadow-sm"
                        : "bg-slate-100 text-slate-900 hover:bg-[#002C66] hover:text-white"
                    )}
                  >
                    <GraduationCap className="h-4 w-4" />
                    Explore My Degree-Based Careers
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* PATH 02: Careers Beyond My Degree (With PDF Image 3) */}
              <div
                onClick={() => {
                  setSelectedPathway("beyond");
                  setActiveJourneyStep(1);
                }}
                className={cn(
                  "group rounded-3xl border-2 bg-white overflow-hidden shadow-md transition-all cursor-pointer flex flex-col justify-between",
                  selectedPathway === "beyond"
                    ? "border-[#002C66] ring-4 ring-[#002C66]/10"
                    : "border-slate-200 hover:border-[#002C66]/50"
                )}
              >
                <div>
                  {/* PDF Page 4 Image */}
                  <div className="relative h-64 sm:h-72 w-full overflow-hidden border-b border-slate-200">
                    <img
                      src={pathBeyondImg}
                      alt="Path 02: Careers Beyond My Degree"
                      className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-lg bg-[#FB923C] px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-md">
                      <Compass className="h-4 w-4 text-white" />
                      PATH 02
                    </div>
                    {selectedPathway === "beyond" && (
                      <div className="absolute top-4 right-4 rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-bold text-white shadow-md">
                        ✓ Active Pathway
                      </div>
                    )}
                  </div>

                  <div className="p-6 sm:p-7 space-y-4">
                    <h3 className="font-display text-2xl font-extrabold text-slate-950">
                      Careers Beyond My Degree
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Explore opportunities across industries, including roles that accept candidates from different educational backgrounds.
                    </p>

                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/50 p-4 space-y-1">
                      <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
                        Cross-Industry &amp; Skill-First Pathways
                      </div>
                      <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                        {beyondDegreeExampleText}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-6 sm:px-7 pb-6">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPathway("beyond");
                      scrollToSection("section-roles", 2);
                    }}
                    className={cn(
                      "w-full inline-flex items-center justify-center gap-2 rounded-xl py-3.5 px-5 text-xs font-extrabold transition-all cursor-pointer",
                      selectedPathway === "beyond"
                        ? "bg-[#002C66] text-white shadow-sm"
                        : "bg-slate-100 text-slate-900 hover:bg-[#002C66] hover:text-white"
                    )}
                  >
                    <Compass className="h-4 w-4" />
                    Explore All Career Options
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================================
              04. YOUR PERSONALISED CAREER OPPORTUNITIES — "Discover Jobs You Can Actually Pursue."
          ===================================================================== */}
          <section id="section-roles" ref={rolesSectionRef} className="scroll-mt-36 space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-md space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-slate-200 pb-5">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#002C66]/10 px-3 py-1 text-xs font-extrabold text-[#002C66]">
                      04. Your Personalised Career Opportunities
                    </span>
                    <span className="rounded-full bg-[#FB923C]/15 px-3 py-1 text-xs font-bold text-[#EA580C]">
                      {selectedPathway === "degree"
                        ? `Path 01: ${education} Degree-Aligned`
                        : "Path 02: All Cross-Industry Options"}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-950">
                    Discover Jobs You Can Actually Pursue.
                  </h2>
                  <p className="text-sm text-slate-600 max-w-2xl">
                    Based on your selected pathway, education and preferences, SI Guide presents a personalised list of relevant job roles.
                  </p>
                </div>

                {/* Useful Filters Bar from PDF Page 5 */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                      value={searchRoleQuery}
                      onChange={(e) => setSearchRoleQuery(e.target.value)}
                      placeholder="Filter role or skill..."
                      className="h-9 pl-8 rounded-xl text-xs w-44 bg-white border-slate-300"
                    />
                  </div>
                  <select
                    value={industryFilter}
                    onChange={(e) => setIndustryFilter(e.target.value)}
                    className="h-9 rounded-xl border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-800"
                  >
                    <option value="All">All Industries</option>
                    <option value="Business & Sales">Business &amp; Sales</option>
                    <option value="Marketing & Growth">Marketing &amp; Growth</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Finance & Analytics">Finance &amp; Analytics</option>
                    <option value="Technology & AI">Technology &amp; AI</option>
                  </select>
                  <select
                    value={workModeFilter}
                    onChange={(e) => setWorkModeFilter(e.target.value)}
                    className="h-9 rounded-xl border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-800"
                  >
                    <option value="All">All Locations / Modes</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              {/* Filter Tag Pills (Industry · Salary Range · Experience Level · Location · Degree Eligibility · Skills Required) */}
              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                <span className="font-bold text-slate-600 flex items-center gap-1">
                  <SlidersHorizontal className="h-3 w-3 text-[#002C66]" /> Useful Filters:
                </span>
                {[
                  `Industry: ${industryFilter}`,
                  `Salary Range: ${salaryExpectation.split(" (")[0]}`,
                  `Experience Level: ${experience}`,
                  `Location: ${preferredLocation.split(" (")[0]}`,
                  `Degree Eligibility: ${education}`,
                  `Skills Required: Verified CIR`,
                ].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-semibold text-slate-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Role Cards Grid */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {recommendedRoles.map((role) => {
                  const isSelected = role.id === activeRole.id;
                  return (
                    <div
                      key={role.id}
                      onClick={() => {
                        setActiveRoleId(role.id);
                        setActiveJourneyStep(2);
                      }}
                      className={cn(
                        "group rounded-2xl border bg-white overflow-hidden shadow-2xs transition-all cursor-pointer flex flex-col justify-between",
                        isSelected
                          ? "border-[#002C66] ring-2 ring-[#002C66]/20 shadow-md"
                          : "border-slate-200 hover:border-[#002C66]/50 hover:shadow-md"
                      )}
                    >
                      <div>
                        <div
                          className={cn(
                            "h-1.5 w-full",
                            isSelected ? "bg-[#FB923C]" : "bg-[#002C66]"
                          )}
                        />
                        <div className="p-5 space-y-3.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="rounded-lg bg-[#002C66]/10 px-2.5 py-1 text-[10px] font-extrabold text-[#002C66]">
                              {role.categoryTags.join(" · ")}
                            </span>
                            <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-700">
                              {role.matchBase}% AI Match
                            </span>
                          </div>

                          <div>
                            <h3 className="font-display text-lg font-extrabold text-slate-950 group-hover:text-[#002C66] transition-colors">
                              {role.title}
                            </h3>
                            <p className="text-xs font-semibold text-[#EA580C] mt-0.5">
                              {role.badgeNote}
                            </p>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                            {role.overview}
                          </p>

                          <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3 border border-slate-200 text-xs">
                            <div>
                              <span className="text-[10px] text-slate-500 block">
                                Entry Salary (India)
                              </span>
                              <strong className="font-bold text-[#002C66]">
                                {role.salary.entry.range}
                              </strong>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-500 block">
                                Eligible Degrees
                              </span>
                              <strong className="font-bold text-slate-900 truncate block">
                                {role.eligibleDegrees.slice(0, 4).join(", ")}
                              </strong>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="px-5 py-3.5 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#002C66]">
                          {isSelected ? "✓ Currently Inspecting" : "Click to Inspect Role"}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveRoleId(role.id);
                            scrollToSection("section-detail", 3);
                          }}
                          className="inline-flex items-center gap-1 rounded-xl bg-[#002C66] hover:bg-[#001F4D] px-3 py-1.5 text-xs font-bold text-white cursor-pointer"
                        >
                          Role Details <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-[11px] text-slate-500 italic">
                * Illustrative &amp; live recommendations generated from your candidate profile ({education} · {specialisation}) and the eligibility requirements of each role.
              </p>
            </div>
          </section>

          {/* =====================================================================
              05. EXPLORE EVERY JOB ROLE IN DETAIL — "Know the Role Before You Choose the Career."
          ===================================================================== */}
          <section id="section-detail" ref={detailSectionRef} className="scroll-mt-36 space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-md">
              {/* Role Header Bar */}
              <div className="pro-hero bg-[#002C66] text-white p-6 sm:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#FB923C]">
                      05. Explore Every Job Role in Detail
                    </span>
                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                      Know the Role Before You Choose the Career: {activeRole.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-white/85">
                      Switch roles below to inspect the Role Overview, Responsibilities, Eligibility, Skills, Salary &amp; Future Outlook.
                    </p>
                  </div>

                  {/* Role Switcher Pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {CAREER_ROLES_DB.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setActiveRoleId(r.id)}
                        className={cn(
                          "rounded-xl px-3 py-2 text-xs font-bold transition-all cursor-pointer",
                          r.id === activeRole.id
                            ? "bg-[#FB923C] text-white shadow-xs"
                            : "bg-white/10 text-white/85 hover:bg-white/20 hover:text-white"
                        )}
                      >
                        {r.title.split(" ")[0]} {r.title.split(" ")[1]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 6 Comprehensive Role Detail Cards (Exact 6 Sections from PDF Pages 5–6) */}
              <div className="p-6 sm:p-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* 1. Role Overview */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 space-y-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#002C66]/10 text-[#002C66]">
                      <Briefcase className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-base font-extrabold text-slate-950">
                        1. Role Overview
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Understand what the job involves, its purpose and where it fits within an organisation.
                      </p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {activeRole.overview}
                  </p>
                  <div className="rounded-xl bg-white p-3.5 text-xs border border-slate-200">
                    <strong className="text-[#002C66] block mb-0.5">Organisational Fit:</strong>
                    <span className="text-slate-600">{activeRole.orgFit}</span>
                  </div>
                </div>

                {/* 2. Roles & Responsibilities */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 space-y-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                      <CheckCircle2 className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-base font-extrabold text-slate-950">
                        2. Roles &amp; Responsibilities
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Explore daily tasks, core responsibilities, deliverables and expected outcomes.
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-700">
                    {activeRole.responsibilities.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
                          ✓
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 3. Education & Eligibility */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 space-y-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FB923C]/15 text-[#EA580C]">
                      <GraduationCap className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-base font-extrabold text-slate-950">
                        3. Education &amp; Eligibility
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Check accepted degrees, qualifications, experience requirements and entry routes.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2.5 text-xs">
                    <div className="rounded-xl bg-white p-3 border border-slate-200">
                      <strong className="text-slate-900 block">Accepted Degrees:</strong>
                      <span className="text-slate-600">{activeRole.eligibility.acceptedDegrees}</span>
                    </div>
                    <div className="rounded-xl bg-white p-3 border border-slate-200">
                      <strong className="text-slate-900 block">Experience &amp; Qualifications:</strong>
                      <span className="text-slate-600">
                        {activeRole.eligibility.experienceReq} · {activeRole.eligibility.qualifications}
                      </span>
                    </div>
                    <div className="rounded-xl bg-white p-3 border border-slate-200">
                      <strong className="text-slate-900 block">Recommended Entry Routes:</strong>
                      <span className="text-slate-600">{activeRole.eligibility.entryRoutes}</span>
                    </div>
                  </div>
                </div>

                {/* 4. Skills & Tools + 5. Salary + 6. Career Growth Summary */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600">
                        <Wrench className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="font-display text-base font-extrabold text-slate-950">
                          4. Skills, Tools, Salary &amp; Growth Snapshot
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          Core tools, earning potential in {country}, and progression track.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {[...activeRole.skills.essential.slice(0, 2), ...activeRole.skills.tools.slice(0, 3)].map(
                        (t) => (
                          <span
                            key={t}
                            className="rounded-lg bg-[#002C66]/10 px-2.5 py-1 text-[11px] font-bold text-[#002C66]"
                          >
                            {t}
                          </span>
                        )
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2 rounded-xl bg-white p-3 border border-slate-200 text-xs text-center">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Entry-Level</span>
                        <strong className="text-[#002C66] font-extrabold">{activeRole.salary.entry.range}</strong>
                      </div>
                      <div className="border-x border-slate-200">
                        <span className="text-[10px] text-slate-500 block">Mid-Career</span>
                        <strong className="text-emerald-700 font-extrabold">{activeRole.salary.mid.range}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Senior Level</span>
                        <strong className="text-[#EA580C] font-extrabold">{activeRole.salary.senior.range}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => scrollToSection("section-salary", 3)}
                      className="text-xs font-bold text-[#002C66] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      View Full Salary Insights <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollToSection("section-skills", 3)}
                      className="text-xs font-bold text-[#EA580C] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Check My Skill Gaps <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================================
              06. SALARY INSIGHTS — "Know Your Earning Potential."
          ===================================================================== */}
          <section id="section-salary" className="scroll-mt-36 space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-md space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div className="space-y-1.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-extrabold text-emerald-700">
                    06. Salary Insights · {country} Market Data
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-950">
                    Know Your Earning Potential: {activeRole.title}
                  </h2>
                  <p className="text-sm text-slate-600">
                    Understand how compensation may change with experience, skills, location and industry.
                  </p>
                </div>

                {/* Location Tier Switcher */}
                <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-100 p-1">
                  {[
                    { id: "tier1", label: "Tier-1 Metro (BLR/BOM/NCR)" },
                    { id: "tier2", label: "Tier-2 Hub (MAA/HYD/PNQ)" },
                    { id: "remote", label: "Global / Remote" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setCityTierMultiplier(t.id as "tier1" | "tier2" | "remote")}
                      className={cn(
                        "rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer",
                        cityTierMultiplier === t.id
                          ? "bg-[#002C66] text-white"
                          : "text-slate-600 hover:text-slate-950"
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3 Salary Progression Cards (Entry Level, Mid-Career, Senior Level from PDF Page 6) */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {[
                  {
                    tier: "Entry Level (0–2 Years)",
                    data: activeRole.salary.entry,
                    accent: "border-t-4 border-t-[#002C66]",
                    badge: "Starting Track",
                    barWidth: "42%",
                  },
                  {
                    tier: "Mid-Career (3–6 Years)",
                    data: activeRole.salary.mid,
                    accent: "border-t-4 border-t-emerald-500",
                    badge: "2.1x Growth Jump",
                    barWidth: "72%",
                  },
                  {
                    tier: "Senior Level (7+ Years)",
                    data: activeRole.salary.senior,
                    accent: "border-t-4 border-t-[#FB923C]",
                    badge: "Leadership Track",
                    barWidth: "100%",
                  },
                ].map((card) => (
                  <div
                    key={card.tier}
                    className={cn(
                      "rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-3 shadow-2xs",
                      card.accent
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        {card.tier}
                      </span>
                      <span className="rounded-full bg-white border border-slate-200 px-2.5 py-0.5 text-[10px] font-bold text-slate-800">
                        {card.badge}
                      </span>
                    </div>
                    <div className="font-display text-2xl font-extrabold text-slate-950 flex items-center gap-1">
                      {card.data.range}
                    </div>
                    <div className="text-xs font-semibold text-emerald-700">
                      Est. Take-Home: {card.data.monthly}
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#002C66]"
                        style={{ width: card.barWidth }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {card.data.note}
                    </p>
                  </div>
                ))}
              </div>

              {/* Salary Factors (Exact 4 points from PDF Page 7) */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#002C66] mb-3">
                  Key Salary Factors That Influence Your Compensation
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
                  {[
                    {
                      title: "Experience & Qualifications",
                      desc: "Verified internships, degree specialisation, and domain projects boost starting offers by 18–25%.",
                    },
                    {
                      title: "City & Cost of Living",
                      desc: "Tier-1 tech corridors (Bengaluru, Mumbai, Gurugram) offer higher base bands than Tier-2 cities.",
                    },
                    {
                      title: "Industry & Employer Size",
                      desc: "Global Capability Centers (GCCs), SaaS product firms, and funded startups pay premium packages.",
                    },
                    {
                      title: "Performance, Specialisation & Skills",
                      desc: "Candidates with a verified IAmTalento CIR score (80%+) command top-decile salary bands.",
                    },
                  ].map((f) => (
                    <div key={f.title} className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-1">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        {f.title}
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================================
              07. SKILLS YOU NEED TO SUCCEED — "Find Out What Employers Expect."
          ===================================================================== */}
          <section id="section-skills" className="scroll-mt-36 space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-md space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div className="space-y-1.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#002C66]/10 px-3 py-1 text-xs font-extrabold text-[#002C66]">
                    07. Skills You Need to Succeed
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-950">
                    Find Out What Employers Expect for {activeRole.title}.
                  </h2>
                  <p className="text-sm text-slate-600 max-w-2xl">
                    Every career requires a combination of technical knowledge, practical capabilities and interpersonal skills. Check the skills you already have to calculate your live Skill Gap!
                  </p>
                </div>

                {/* Live Skill Readiness Meter */}
                <div className="flex items-center gap-4 rounded-2xl border border-[#002C66]/20 bg-slate-50 px-5 py-3.5">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#002C66] block">
                      Your Current Readiness
                    </span>
                    <div className="text-2xl font-extrabold text-[#002C66]">
                      {skillReadinessPct}% Ready
                    </div>
                    <span className="text-[11px] text-slate-600">
                      {matchedSkillsCount} of {allRoleSkills.length} core skills checked
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSkillGapAnalysis(true);
                      toast.success(`Skill Gap Analysis updated for ${activeRole.title}!`);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#002C66] hover:bg-[#001F4D] px-4 py-2.5 text-xs font-extrabold text-white shadow-xs cursor-pointer"
                  >
                    <Target className="h-4 w-4 text-[#FB923C]" />
                    Discover My Skill Gaps
                  </button>
                </div>
              </div>

              {/* 5 Structured Skill Categories from PDF Page 7 */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {/* 1. Essential Skills */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-slate-950">
                      1. Essential Skills Required
                    </h3>
                    <span className="rounded bg-[#002C66]/10 px-2 py-0.5 text-[10px] font-bold text-[#002C66]">
                      Must-Have
                    </span>
                  </div>
                  <div className="space-y-2">
                    {activeRole.skills.essential.map((sk) => {
                      const checked = Boolean(checkedSkills[sk]);
                      return (
                        <label
                          key={sk}
                          className={cn(
                            "flex items-center gap-2.5 rounded-xl border p-2.5 text-xs cursor-pointer transition-all",
                            checked
                              ? "border-emerald-500/50 bg-emerald-50 font-bold text-slate-900"
                              : "border-slate-200 bg-white text-slate-700 hover:text-slate-950"
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setCheckedSkills((prev) => ({ ...prev, [sk]: !prev[sk] }))
                            }
                            className="h-4 w-4 accent-[#002C66]"
                          />
                          <span>{sk}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Preferred Skills */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-slate-950">
                      2. Preferred Employability Skills
                    </h3>
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      High Advantage
                    </span>
                  </div>
                  <div className="space-y-2">
                    {activeRole.skills.preferred.map((sk) => {
                      const checked = Boolean(checkedSkills[sk]);
                      return (
                        <label
                          key={sk}
                          className={cn(
                            "flex items-center gap-2.5 rounded-xl border p-2.5 text-xs cursor-pointer transition-all",
                            checked
                              ? "border-emerald-500/50 bg-emerald-50 font-bold text-slate-900"
                              : "border-slate-200 bg-white text-slate-700 hover:text-slate-950"
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setCheckedSkills((prev) => ({ ...prev, [sk]: !prev[sk] }))
                            }
                            className="h-4 w-4 accent-[#002C66]"
                          />
                          <span>{sk}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Software & Industry Tools */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-slate-950">
                      3. Software &amp; Industry Tools
                    </h3>
                    <span className="rounded bg-[#FB923C]/15 px-2 py-0.5 text-[10px] font-bold text-[#EA580C]">
                      Practical Stack
                    </span>
                  </div>
                  <div className="space-y-2">
                    {activeRole.skills.tools.map((sk) => {
                      const checked = Boolean(checkedSkills[sk]);
                      return (
                        <label
                          key={sk}
                          className={cn(
                            "flex items-center gap-2.5 rounded-xl border p-2.5 text-xs cursor-pointer transition-all",
                            checked
                              ? "border-emerald-500/50 bg-emerald-50 font-bold text-slate-900"
                              : "border-slate-200 bg-white text-slate-700 hover:text-slate-950"
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setCheckedSkills((prev) => ({ ...prev, [sk]: !prev[sk] }))
                            }
                            className="h-4 w-4 accent-[#002C66]"
                          />
                          <span>{sk}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Certifications That Strengthen a Profile */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-[#002C66]" />
                    <h3 className="text-sm font-extrabold text-slate-950">
                      4. Recommended Certifications
                    </h3>
                  </div>
                  <ul className="space-y-2 text-xs">
                    {activeRole.skills.certifications.map((cert) => (
                      <li
                        key={cert}
                        className="flex items-start gap-2 rounded-xl bg-white p-2.5 border border-slate-200 text-slate-800 font-medium"
                      >
                        <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{cert}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 5. Skills Demonstrated Through Projects or Assessments */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-3 md:col-span-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Rocket className="h-4 w-4 text-[#EA580C]" />
                      <h3 className="text-sm font-extrabold text-slate-950">
                        5. Portfolio Projects &amp; Assessments to Prove Capability
                      </h3>
                    </div>
                    <Link
                      to="/assessments/explore"
                      className="text-xs font-bold text-[#002C66] hover:underline flex items-center gap-1"
                    >
                      Take Proctored CIR Assessment <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {activeRole.skills.demonstrableProjects.map((proj, i) => (
                      <div
                        key={proj}
                        className="rounded-xl border border-slate-200 bg-white p-3.5 text-xs space-y-1.5"
                      >
                        <span className="inline-block rounded bg-[#002C66] px-2 py-0.5 text-[10px] font-bold text-white">
                          Proof Project 0{i + 1}
                        </span>
                        <p className="font-semibold text-slate-900 leading-relaxed">{proj}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic Skill Gap Action Banner when "Discover My Skill Gaps" is clicked */}
              {showSkillGapAnalysis && (
                <div className="pro-hero rounded-2xl bg-[#002C66] text-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-[#FB923C]">
                      AI Skill Gap Diagnostic Result
                    </div>
                    <h4 className="text-base font-bold text-white">
                      You have {matchedSkillsCount}/{allRoleSkills.length} target skills ({skillReadinessPct}% Readiness) for {activeRole.title}.
                    </h4>
                    <p className="text-xs text-white/85">
                      Priority gaps to close next:{" "}
                      <strong className="text-white">
                        {allRoleSkills
                          .filter((s) => !checkedSkills[s])
                          .slice(0, 3)
                          .join(" · ") || "All core skills verified! Ready for CIR Assessment."}
                      </strong>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    <Link
                      to="/learning"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#FB923C] hover:bg-[#F97316] px-4 py-2.5 text-xs font-extrabold text-white"
                    >
                      Start Skill Courses <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <Link
                      to="/assessments/explore"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 hover:bg-white/25 px-4 py-2.5 text-xs font-bold text-white"
                    >
                      Verify via CIR Test
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* =====================================================================
              08. YOUR PERSONALISED CAREER ROADMAP — "From Where You Are to Where You Want to Be."
          ===================================================================== */}
          <section id="section-roadmap" ref={roadmapSectionRef} className="scroll-mt-36 space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-md space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div className="space-y-1.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#002C66]/10 px-3 py-1 text-xs font-extrabold text-[#002C66]">
                    08. Your Personalised Career Roadmap
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-950">
                    From Where You Are to Where You Want to Be.
                  </h2>
                  <p className="text-sm text-slate-600 max-w-2xl">
                    SI Guide translates career recommendations into an actionable 5-step plan tailored to your current profile ({education} · {specialisation} → {activeRole.title}).
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setRoadmapModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#002C66] hover:bg-[#001F4D] px-6 py-3.5 text-xs font-extrabold text-white shadow-sm cursor-pointer shrink-0"
                >
                  <Rocket className="h-4 w-4 text-[#FB923C]" />
                  Build My Career Roadmap
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* 5 Roadmap Steps (01 to 05 from PDF Pages 7–8) */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {[
                  {
                    num: "01",
                    title: "Understand Your Starting Point",
                    desc: "Review your education, experience, existing skills and interests.",
                    liveNote: `${education} (${specialisation}) · ${experience} in ${country}`,
                    actionLabel: "Edit Profile",
                    onClick: () => scrollToSection("section-profile", 0),
                  },
                  {
                    num: "02",
                    title: "Choose a Target Role",
                    desc: "Compare recommended careers and select a realistic goal.",
                    liveNote: `Selected Goal: ${activeRole.title} (${activeRole.salary.entry.range})`,
                    actionLabel: "Switch Target",
                    onClick: () => scrollToSection("section-roles", 2),
                  },
                  {
                    num: "03",
                    title: "Close Your Skill Gaps",
                    desc: "Identify the skills, courses and certifications that can help.",
                    liveNote: `${allRoleSkills.length - matchedSkillsCount} priority skills & tools to master`,
                    actionLabel: "Explore Courses",
                    onClick: () => navigate("/learning"),
                  },
                  {
                    num: "04",
                    title: "Prove Your Readiness",
                    desc: "Use Talent CIR assessments to measure progress.",
                    liveNote: `Target CIR Cutoff: 75%+ for 24h Employer SLA`,
                    actionLabel: "Take CIR Test",
                    onClick: () => navigate("/assessments/explore"),
                  },
                  {
                    num: "05",
                    title: "Prepare for Opportunities",
                    desc: "Improve your resume, practise interviews and explore relevant jobs.",
                    liveNote: `ATS Resume + Matched Openings in ${preferredLocation.split(" (")[0]}`,
                    actionLabel: "Browse Jobs",
                    onClick: () => navigate("/jobs"),
                  },
                ].map((step) => (
                  <div
                    key={step.num}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-4 hover:border-[#002C66]/40 hover:shadow-md transition-all"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#002C66] text-sm font-extrabold text-white">
                          {step.num}
                        </span>
                        <span className="rounded-full bg-[#FB923C]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#EA580C]">
                          Stage {step.num}
                        </span>
                      </div>
                      <h3 className="font-display text-sm font-extrabold text-slate-950">
                        {step.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {step.desc}
                      </p>
                      <div className="rounded-xl bg-white p-2.5 text-[11px] font-semibold text-[#002C66] border border-slate-200">
                        {step.liveNote}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={step.onClick}
                      className="w-full inline-flex items-center justify-between rounded-xl border border-slate-200 bg-white hover:bg-[#002C66] hover:text-white px-3 py-2 text-xs font-bold text-slate-900 transition-colors cursor-pointer"
                    >
                      <span>{step.actionLabel}</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* =====================================================================
              09. UNDERSTAND THE FUTURE OF YOUR CAREER — "Choose a Career That's Ready for Tomorrow."
          ===================================================================== */}
          <section id="section-future" className="scroll-mt-36 space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-md space-y-6">
              <div className="space-y-1.5 border-b border-slate-200 pb-5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#002C66]/10 px-3 py-1 text-xs font-extrabold text-[#002C66]">
                  09. Understand the Future of Your Career
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-950">
                  Choose a Career That&apos;s Ready for Tomorrow: {activeRole.title}
                </h2>
                <p className="text-sm text-slate-600 max-w-3xl">
                  Explore how your selected role is evolving with technology, AI adoption, industry changes and emerging business needs.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                {/* 1. Current Industry Demand & Source */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-slate-950">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    Current Industry Demand
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {activeRole.futureOutlook.demandTrend}
                  </p>
                  <div className="rounded-xl bg-white p-3 text-[11px] text-slate-600 border border-slate-200">
                    <strong className="text-slate-900 block">Evidence-Based Source:</strong>
                    {activeRole.futureOutlook.demandSource}
                  </div>
                </div>

                {/* 2. Emerging Technologies & Future Skills */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-slate-950">
                    <Brain className="h-4 w-4 text-[#002C66]" />
                    Emerging Tech &amp; Future Skills
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Emerging Technologies Affecting the Role
                    </span>
                    {activeRole.futureOutlook.emergingTech.map((tech) => (
                      <div
                        key={tech}
                        className="rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs font-semibold text-[#002C66]"
                      >
                        • {tech}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Future Skills Employers Value
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeRole.futureOutlook.futureSkills.map((fSkill) => (
                        <span
                          key={fSkill}
                          className="rounded-md bg-[#FB923C]/15 px-2.5 py-1 text-[11px] font-bold text-[#EA580C]"
                        >
                          {fSkill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Career Advancement Pathways & Alternative Roles */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-slate-950">
                    <Layers className="h-4 w-4 text-[#EA580C]" />
                    Advancement &amp; Alternative Career Options
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Career Advancement Pathway
                    </span>
                    {activeRole.futureOutlook.advancementPath.map((step, i) => (
                      <div key={step} className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#002C66] text-[10px] font-bold text-white">
                          {i + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1.5 pt-2 border-t border-slate-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Related &amp; Alternative Career Options
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeRole.futureOutlook.alternativeRoles.map((alt) => (
                        <span
                          key={alt}
                          className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-800"
                        >
                          {alt}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================================
              10. CONNECT CAREER DISCOVERY TO LEARNING & JOBS — "Discover It. Learn It. Make It Happen."
          ===================================================================== */}
          <section id="section-connect" className="scroll-mt-36 space-y-6">
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#002C66]/10 px-3.5 py-1 text-xs font-extrabold text-[#002C66]">
                10. Connect Career Discovery to Learning &amp; Jobs
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-950">
                Discover It. Learn It. Make It Happen.
              </h2>
              <p className="text-sm text-slate-600">
                Move seamlessly from AI career discovery into skill mastery, verified CIR assessment, profile building, and direct job applications.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Learn the Skills",
                  desc: "Explore relevant courses and expert-led learning pathways.",
                  cta: "Explore Learning →",
                  href: "/learning",
                  icon: BookOpen,
                  accent: "bg-[#002C66]",
                },
                {
                  title: "Assess Your Readiness",
                  desc: "Measure your current skills against your target career.",
                  cta: "Take an Assessment →",
                  href: "/assessments/explore",
                  icon: ShieldCheck,
                  accent: "bg-emerald-600",
                },
                {
                  title: "Prepare Your Profile",
                  desc: "Build a resume and showcase relevant achievements.",
                  cta: "Build My Profile →",
                  href: "/profile",
                  icon: FileText,
                  accent: "bg-[#FB923C]",
                },
                {
                  title: "Find Relevant Jobs",
                  desc: "Explore openings aligned with your target role and qualifications.",
                  cta: "Browse Jobs →",
                  href: "/jobs",
                  icon: Briefcase,
                  accent: "bg-[#002C66]",
                },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <Link
                    key={card.title}
                    to={card.href}
                    className="group rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-[#002C66]/50 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className={cn("h-1.5 w-full", card.accent)} />
                      <div className="p-6 space-y-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#002C66]/10 text-[#002C66] group-hover:bg-[#002C66] group-hover:text-white transition-colors">
                          <Icon className="h-6 w-6" />
                        </span>
                        <h3 className="font-display text-lg font-extrabold text-slate-950">
                          {card.title}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {card.desc}
                        </p>
                      </div>
                    </div>
                    <div className="px-6 pb-5 pt-2">
                      <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#002C66] group-hover:text-[#EA580C] transition-colors">
                        {card.cta}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* =====================================================================
              11. FINAL CTA SECTION — "Your Degree Is Just the Beginning."
          ===================================================================== */}
          <div className="pro-hero rounded-3xl bg-[#002C66] text-white p-8 sm:p-12 lg:p-14 shadow-xl">
            <div className="max-w-3xl mx-auto text-center space-y-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-[#FB923C]">
                <Sparkles className="h-3.5 w-3.5" />
                11. Start Your Super Intelligence Career Journey
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white leading-tight">
                Your Degree Is Just the Beginning.
              </h2>
              <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
                Discover your possibilities, understand your potential and find the career path that fits you.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
                <button
                  type="button"
                  onClick={() => scrollToSection("section-profile", 0)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#FB923C] hover:bg-[#F97316] px-8 py-4 text-sm font-extrabold text-white shadow-lg transition-all cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  Start My SI Guide
                  <ArrowRight className="h-4 w-4" />
                </button>
                <Link
                  to="/pro?view=cert"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 px-7 py-4 text-sm font-bold text-white transition-all"
                >
                  Open Talento Pro Workspace
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          INTERACTIVE 90-DAY PERSONALISED CAREER ROADMAP MODAL
      ===================================================================== */}
      <Dialog open={roadmapModalOpen} onOpenChange={setRoadmapModalOpen}>
        <DialogContent className="sm:max-w-2xl p-0 gap-0 rounded-2xl overflow-hidden border-slate-200 bg-white">
          <div className="pro-hero bg-[#002C66] text-white p-6">
            <DialogHeader>
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-0.5 text-[10px] font-extrabold uppercase text-[#FB923C]">
                Personalised 90-Day Execution Plan
              </span>
              <DialogTitle className="text-xl font-extrabold text-white mt-1">
                {education} ({specialisation}) → {activeRole.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-white/85">
                Target Location: {preferredLocation} · Target Entry Band: {activeRole.salary.entry.range}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
            {[
              {
                phase: "Days 1–30: Core Skill & Tool Foundation",
                items: [
                  `Master core skills: ${activeRole.skills.essential.slice(0, 2).join(" & ")}`,
                  `Hands-on practice with industry tools: ${activeRole.skills.tools.slice(0, 2).join(", ")}`,
                ],
              },
              {
                phase: "Days 31–60: Proof Projects & Verified CIR Assessment",
                items: [
                  `Build portfolio proof: ${activeRole.skills.demonstrableProjects[0]}`,
                  `Complete ${activeRole.skills.certifications[0]} with 75%+ cutoff`,
                ],
              },
              {
                phase: "Days 61–90: ATS Resume & Priority Job Applications",
                items: [
                  "Sync verified CIR scorecard to your IAmTalento Pro profile",
                  `Apply to matched ${activeRole.title} openings in ${preferredLocation.split(" (")[0]}`,
                ],
              },
            ].map((block) => (
              <div key={block.phase} className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                <div className="font-extrabold text-[#002C66] text-sm">{block.phase}</div>
                <ul className="space-y-1.5">
                  {block.items.map((it) => (
                    <li key={it} className="flex items-start gap-2 text-slate-800">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <Button
                variant="outline"
                onClick={() => setRoadmapModalOpen(false)}
                className="rounded-xl text-xs"
              >
                Close
              </Button>
              <button
                type="button"
                onClick={() => {
                  setRoadmapModalOpen(false);
                  navigate("/assessments/explore");
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#002C66] hover:bg-[#001F4D] px-4 py-2.5 text-xs font-extrabold text-white cursor-pointer"
              >
                Start Step 4: Take CIR Assessment <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default AiGuidance;
