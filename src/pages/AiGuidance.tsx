import { useState, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import heroImg from "@/assets/si-guide-img-1.jpg";
import path1Img from "@/assets/si-guide-img-2.jpg";
import path2Img from "@/assets/si-guide-img-3.jpg";
import {
  Sparkles,
  GraduationCap,
  Compass,
  Briefcase,
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
  Layers,
  Zap,
  Globe2,
  SlidersHorizontal,
  RefreshCw,
  Check,
  Calendar,
} from "lucide-react";

type DiscoveryPath = "degree" | "beyond" | "all";
type RoleDomain =
  | "Finance"
  | "Marketing"
  | "Business"
  | "Human Resources"
  | "Technology"
  | "Operations";
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
  domain: RoleDomain;
  categoryTags: string[];
  badgeNote: string;
  pathway: "degree" | "beyond" | "both";
  matchScore: number;
  industry: string;
  experienceLevel: "Fresher" | "Experienced" | "Career Switcher";
  locations: string[];
  eligibleDegrees: string[];
  eligibleSpecialisations: string[];
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
  // ===========================================================================
  // FINANCE & BANKING ROLES (domain: "Finance")
  // ===========================================================================
  {
    id: "fpa",
    title: "Financial Analyst & FP&A Executive",
    domain: "Finance",
    categoryTags: ["Finance", "FP&A", "Corporate Finance"],
    badgeNote: "Core role for Finance, B.Com, BBA & MBA graduates",
    pathway: "degree",
    matchScore: 97,
    industry: "Finance, Banking (BFSI) & Corporate Treasury",
    experienceLevel: "Fresher",
    locations: ["Mumbai", "Bengaluru", "Delhi NCR", "Hyderabad", "Chennai"],
    eligibleDegrees: ["B.Com", "BBA", "MBA", "BA", "B.Sc."],
    eligibleSpecialisations: ["Finance", "Economics & Analytics", "General Management"],
    degreeEligibilityNote: "Direct fit for B.Com / BBA / MBA (Finance) & Economics graduates",
    overview:
      "Analyses financial statements, builds budgeting and forecasting models, tracks P&L variance, and delivers actionable valuation and cost-optimisation insights to CFOs and business heads.",
    orgFit:
      "Sits within Corporate Finance, Financial Planning & Analysis (FP&A), or Strategic Finance—partnering with business unit leaders, accounting teams, and executive management.",
    responsibilities: [
      "Build monthly and quarterly financial models, cash-flow forecasts, and annual operating budgets.",
      "Perform P&L variance analysis (Actual vs. Budget) and highlight margin improvement levers.",
      "Prepare board-ready financial decks, unit economics trackers, and capital allocation models.",
      "Evaluate investment proposals, pricing models, and working capital efficiency.",
      "Collaborate with accounting and ERP teams to ensure accurate financial reporting under Ind AS / IFRS.",
    ],
    deliverables: [
      "Monthly MIS & P&L variance analysis packs",
      "3-Statement financial models & DCF valuation workbooks",
      "Departmental budget forecasts & cash-flow runway dashboards",
    ],
    acceptedDegrees: [
      "B.Com / M.Com (Accounting, Taxation, Financial Markets)",
      "BBA / BMS / MBA / PGDM in Finance",
      "BA / B.Sc. in Economics, Statistics, or Mathematics",
      "CA Inter / CFA Level 1 / CMA aspirants",
    ],
    entryRoutes: [
      "Campus hiring for Corporate Finance / FP&A Analyst roles",
      "6-month Financial Modelling & Valuation internship",
      "Talent CIR Verified Financial Analysis & Excel Modelling Assessment",
    ],
    essentialSkills: [
      "Financial Statement Analysis (P&L, Balance Sheet, Cash Flow)",
      "Advanced Excel & 3-Statement Financial Modelling",
      "Budgeting, Forecasting & Variance Analysis",
      "Corporate Finance & Valuation Basics (DCF, Multiples)",
      "Accounting Principles (Ind AS / GAAP)",
    ],
    preferredSkills: [
      "Power BI / Tableau for Financial Dashboards",
      "ERP Systems (SAP FICO, Oracle NetSuite, Tally Prime)",
      "Unit Economics & SaaS / Retail Financial Metrics",
      "SQL Basics for Financial Data Extraction",
    ],
    toolsRequired: [
      "Microsoft Excel (PivotTables, XLOOKUP, Macros)",
      "SAP FICO / Oracle NetSuite / Tally Prime",
      "Power BI / Tableau",
      "Bloomberg / Capital IQ / Screener",
    ],
    certifications: [
      "Talent CIR Certified Financial Analyst & FP&A Specialist",
      "CFA Level 1 / NISM Financial Markets Certification",
      "FMVA (Financial Modeling & Valuation Analyst)",
    ],
    projectProof: [
      "3-Statement Financial Model & DCF Valuation of a Listed Indian Company",
      "Monthly MIS & P&L Variance Dashboard in Excel + Power BI",
      "Working Capital & Cost-Optimisation Case Study",
    ],
    salaryIndia: {
      entry: "₹4.8 LPA – ₹8.5 LPA",
      entryRange: [4.8, 8.5],
      mid: "₹10.0 LPA – ₹18.0 LPA",
      midRange: [10.0, 18.0],
    senior: "₹22.0 LPA – ₹40.0 LPA+",
      seniorRange: [22.0, 40.0],
    },
    futureDemand: {
      demandLevel: "High Growth",
      trendSummary:
        "Global Capability Centres (GCCs), Indian conglomerates, FinTechs, and funded startups are rapidly expanding FP&A and strategic finance teams to drive profitable growth.",
      aiImpact:
        "AI automates routine bookkeeping and data reconciliation, making strategic scenario modelling, capital allocation advice, and business partnering more valuable than ever.",
      emergingTech: [
        "AI-Assisted Financial Forecasting & Anomaly Detection",
        "Automated ERP Reconciliation & Real-Time Treasury Dashboards",
        "Predictive Cash-Flow & Risk Simulation Models",
      ],
      futureSkills: [
        "Strategic Business Partnering (FP&A)",
        "Automated BI & SQL Financial Reporting",
        "ESG & Sustainability Financial Reporting",
      ],
      advancementPath: [
        "Financial Analyst / FP&A Executive (0–2 yrs)",
        "Senior Financial Analyst (2–5 yrs)",
        "FP&A Manager / Finance Controller (5–8 yrs)",
        "VP of Finance / Chief Financial Officer (8+ yrs)",
      ],
      relatedRoles: [
        "Investment Banking Analyst",
        "Corporate Treasury Associate",
        "Credit & Risk Analyst",
        "Audit & Taxation Specialist",
      ],
      sourceCitation:
        "Deloitte India CFO Survey & NASSCOM GCC Finance Talent Report (Q1 2026)",
    },
  },
  {
    id: "audit-tax",
    title: "Audit, Tax & Corporate Accounting Associate",
    domain: "Finance",
    categoryTags: ["Finance", "Accounting", "Audit & Tax"],
    badgeNote: "High demand across Big 4, GCCs & Corporate Finance",
    pathway: "degree",
    matchScore: 94,
    industry: "Finance, Accounting, Audit Firms & BFSI",
    experienceLevel: "Fresher",
    locations: ["Mumbai", "Delhi NCR", "Bengaluru", "Chennai", "Hyderabad", "Pune"],
    eligibleDegrees: ["B.Com", "BBA", "MBA"],
    eligibleSpecialisations: ["Finance", "General Management"],
    degreeEligibilityNote: "Ideal for B.Com, BBA (Finance), MBA (Finance) & CA/ACCA/CMA candidates",
    overview:
      "Ensures statutory compliance, executes internal and external financial audits, manages direct/indirect tax filings (GST & Income Tax), and maintains accurate general ledger operations.",
    orgFit:
      "Operates within the Controllership, Internal Audit, Taxation, or Assurance practice—working closely with statutory auditors, CFOs, and legal compliance teams.",
    responsibilities: [
      "Prepare and verify financial statements, trial balances, and general ledger reconciliations.",
      "Assist in statutory audits, internal risk controls testing (IFC), and SOX compliance reviews.",
      "Compute and file monthly/quarterly GST returns, TDS reconciliations, and corporate tax schedules.",
      "Identify revenue leakage or control gaps and draft audit recommendation reports.",
      "Coordinate with external auditors, banks, and regulatory authorities during financial close.",
    ],
    deliverables: [
      "Statutory-compliant financial schedules & audit workpapers",
      "Timely GST, TDS, and corporate income tax compliance filings",
      "Month-end book closure & balance sheet reconciliation reports",
    ],
    acceptedDegrees: [
      "B.Com / M.Com (Honours / Accounting & Finance)",
      "BBA / MBA (Finance)",
      "CA Inter / ACCA / CMA / CPA pursuing candidates",
    ],
    entryRoutes: [
      "Big 4 / Global Assurance & Tax campus recruitment",
      "Corporate Finance & Accounts Executive trainee program",
      "Talent CIR Verified Corporate Accounting, GST & Audit Assessment",
    ],
    essentialSkills: [
      "Corporate Accounting & Bookkeeping (Ind AS / IFRS)",
      "Internal Audit & Risk Control Testing",
      "Direct & Indirect Taxation (GST, TDS, Income Tax)",
      "Balance Sheet & Bank Reconciliation",
      "MS Excel for Audit Sampling & VLOOKUP/Pivot Analysis",
    ],
    preferredSkills: [
      "SAP FICO / Oracle Financials / Tally Prime",
      "US GAAP / IFRS Reporting for Global Capability Centres",
      "Forensic Accounting & Compliance Analytics",
    ],
    toolsRequired: [
      "SAP FICO / Tally Prime / Zoho Books",
      "Advanced MS Excel",
      "ClearTax / Government GST & Income Tax Portals",
      "CaseWare / Audit Analytics Tools",
    ],
    certifications: [
      "Talent CIR Certified Corporate Accounting & Tax Professional",
      "ACCA Diploma in IFRS / ICAI GST Certification",
      "Certified Internal Auditor (CIA) Foundation",
    ],
    projectProof: [
      "End-to-End Month-End Financial Close & GST Reconciliation Case Study",
      "Internal Audit Risk Control Matrix (RCM) for Procure-to-Pay Cycle",
      "Annual Report Financial Ratio & Compliance Audit Analysis",
    ],
    salaryIndia: {
      entry: "₹4.0 LPA – ₹7.2 LPA",
      entryRange: [4.0, 7.2],
      mid: "₹8.5 LPA – ₹15.5 LPA",
      midRange: [8.5, 15.5],
      senior: "₹18.0 LPA – ₹34.0 LPA+",
      seniorRange: [18.0, 34.0],
    },
    futureDemand: {
      demandLevel: "Strong & Steady",
      trendSummary:
        "Stricter regulatory governance, automated e-invoicing, and global accounting hubs in India keep skilled audit, tax, and compliance professionals in year-round demand.",
      aiImpact:
        "AI flags invoice anomalies across 100% of transactions rather than manual samples, elevating associates into regulatory interpreters and internal control advisors.",
      emergingTech: [
        "Continuous AI Audit & Automated Transaction Anomaly Detection",
        "Cloud ERP & Automated GST/E-Invoice Reconciliation",
        "RegTech Compliance Monitoring Dashboards",
      ],
      futureSkills: [
        "IT General Controls (ITGC) & Systems Audit",
        "International Tax & Transfer Pricing",
        "Data-Driven Forensic Auditing",
      ],
      advancementPath: [
        "Audit & Tax Associate (0–2 yrs)",
        "Senior Audit Executive / Tax Consultant (2–5 yrs)",
        "Audit Manager / Financial Controller (5–8 yrs)",
        "Partner / Director of Finance & Compliance (8+ yrs)",
      ],
      relatedRoles: [
        "Financial Analyst (FP&A)",
        "Risk & Compliance Officer",
        "Corporate Treasury Executive",
        "Forensic Audit Specialist",
      ],
      sourceCitation:
        "ICAI & EY India Assurance & Tax Talent Outlook (2026)",
    },
  },
  {
    id: "wealth-banking",
    title: "Wealth Management & FinTech Credit Analyst",
    domain: "Finance",
    categoryTags: ["Finance", "Banking", "Wealth & Credit"],
    badgeNote: "Open to Finance graduates & analytical cross-degree candidates",
    pathway: "both",
    matchScore: 93,
    industry: "Banking, FinTech, Wealth Tech & Capital Markets",
    experienceLevel: "Fresher",
    locations: ["Mumbai", "Bengaluru", "Delhi NCR", "Pune", "Hyderabad"],
    eligibleDegrees: ["BBA", "B.Com", "MBA", "BA", "B.Sc.", "B.Tech"],
    eligibleSpecialisations: [
      "Finance",
      "Economics & Analytics",
      "International Business",
      "Marketing",
    ],
    degreeEligibilityNote: "Open to B.Com / BBA / MBA (Finance) and analytical graduates with NISM badges",
    overview:
      "Evaluates credit risk and investment portfolios, advises HNI and retail/corporate clients on wealth products, and leverages FinTech analytics to structure lending and investment solutions.",
    orgFit:
      "Part of Wealth Advisory, Credit Underwriting, or Retail/Commercial Banking—bridging financial product teams, risk committees, and client portfolios.",
    responsibilities: [
      "Analyse borrower financial health, CIBIL/bureau scores, cash flows, and DSCR for credit underwriting.",
      "Construct diversified mutual fund, equity, and fixed-income portfolios aligned with client risk profiles.",
      "Monitor macroeconomic indicators, RBI policy updates, and sector credit trends.",
      "Partner with relationship managers to onboard corporate and HNI wealth clients.",
      "Ensure strict KYC, AML, and SEBI/RBI regulatory compliance across all transactions.",
    ],
    deliverables: [
      "Credit appraisal memos (CAM) & risk rating scorecards",
      "Client portfolio asset-allocation & wealth review reports",
      "AUM growth, portfolio yield, and NPA/risk control benchmarks",
    ],
    acceptedDegrees: [
      "BBA / B.Com / MBA (Finance, Banking & Insurance)",
      "BA / B.Sc. (Economics, Statistics)",
      "B.Tech graduates interested in FinTech Credit Risk & Quantitative Wealth Tech",
    ],
    entryRoutes: [
      "Private Bank / Wealth Tech Management Trainee program",
      "FinTech Credit & Risk Operations Analyst fellowship",
      "Talent CIR Verified Banking, Credit & Wealth Advisory Assessment",
    ],
    essentialSkills: [
      "Credit Risk Appraisal & Ratio Analysis",
      "Asset Allocation (Equities, Debt, Mutual Funds)",
      "Financial Markets & Macroeconomic Fundamentals",
      "Client Advisory & Consultative Communication",
      "Regulatory Compliance (RBI / SEBI / KYC-AML)",
    ],
    preferredSkills: [
      "FinTech Digital Lending & Bureau Analytics",
      "Portfolio Performance & Risk Metrics (Sharpe Ratio, Beta, IRR)",
      "Excel Financial Calculators & CRM Management",
    ],
    toolsRequired: [
      "MS Excel & Financial Calculators",
      "Bloomberg / Morningstar / Value Research",
      "Core Banking & FinTech LOS/LMS Platforms",
      "Salesforce Financial Services Cloud",
    ],
    certifications: [
      "Talent CIR Certified Banking & Wealth Specialist",
      "NISM Series V-A (Mutual Fund) & Series VIII / XV (Research Analyst)",
      "Certified Financial Planner (CFP) / CIBP",
    ],
    projectProof: [
      "Comprehensive Credit Appraisal Memo (CAM) for an SME Lending Case",
      "Model HNI Investment Portfolio with Risk-Adjusted Return Backtesting",
      "Indian FinTech Digital Lending & NPA Risk Analysis Report",
    ],
    salaryIndia: {
      entry: "₹4.5 LPA – ₹7.8 LPA",
      entryRange: [4.5, 7.8],
      mid: "₹9.0 LPA – ₹16.5 LPA",
      midRange: [9.0, 16.5],
      senior: "₹20.0 LPA – ₹38.0 LPA+",
      seniorRange: [20.0, 38.0],
    },
    futureDemand: {
      demandLevel: "High Growth",
      trendSummary:
        "India's booming retail participation in capital markets, expanding HNI wealth base, and digital MSME lending are driving strong hiring across banks, AMC firms, and FinTechs.",
      aiImpact:
        "Robo-advisory and AI credit models score routine applications in seconds, increasing demand for human analysts who can evaluate complex cash flows and build high-trust wealth relationships.",
      emergingTech: [
        "Account Aggregator (AA) Cash-Flow Underwriting",
        "AI Portfolio Rebalancing & Wealth Copilots",
        "Alternative Data Credit Scoring Engines",
      ],
      futureSkills: [
        "Cash-Flow Based Digital Underwriting",
        "Behavioral Wealth Advisory",
        "FinTech Product & Regulatory Strategy",
      ],
      advancementPath: [
        "Credit / Wealth Analyst (0–2 yrs)",
        "Senior Credit Manager / Wealth Advisor (2–5 yrs)",
        "Vice President – Private Wealth / Credit Risk (5–8 yrs)",
        "Head of Wealth / Chief Risk Officer (8+ yrs)",
      ],
      relatedRoles: [
        "Financial Analyst (FP&A)",
        "Equity Research Associate",
        "Relationship Manager – Corporate Banking",
        "FinTech Risk Analyst",
      ],
      sourceCitation:
        "AMFI – Crisil India Wealth Report & RBI FinTech Sector Review (2026)",
    },
  },

  // ===========================================================================
  // SALES & BUSINESS DEVELOPMENT ROLES (domain: "Business")
  // ===========================================================================
  {
    id: "bde",
    title: "Business Development Executive",
    domain: "Business",
    categoryTags: ["Sales", "Business", "Client Relations"],
    badgeNote: "Example role for a BBA graduate",
    pathway: "both",
    matchScore: 96,
    industry: "B2B SaaS, IT Services & Commercial Consulting",
    experienceLevel: "Fresher",
    locations: ["Bengaluru", "Mumbai", "Delhi NCR", "Hyderabad", "Remote / Hybrid"],
    eligibleDegrees: ["BBA", "B.Com", "MBA", "BA", "B.Tech", "B.Sc."],
    eligibleSpecialisations: [
      "Marketing",
      "International Business",
      "General Management",
      "Finance",
    ],
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
    id: "csm",
    title: "Customer Success & Account Specialist",
    domain: "Business",
    categoryTags: ["Client Relations", "Business", "SaaS"],
    badgeNote: "Accepts candidates across all educational backgrounds",
    pathway: "beyond",
    matchScore: 91,
    industry: "Global SaaS, Cloud Platforms & Enterprise Accounts",
    experienceLevel: "Fresher",
    locations: ["Bengaluru", "Chennai", "Pune", "Hyderabad", "Remote / Hybrid"],
    eligibleDegrees: ["BBA", "BA", "B.Com", "B.Sc.", "B.Tech", "MBA"],
    eligibleSpecialisations: [
      "General Management",
      "International Business",
      "Marketing",
      "Operations & Supply Chain",
    ],
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

  // ===========================================================================
  // MARKETING & DIGITAL GROWTH ROLES (domain: "Marketing")
  // ===========================================================================
  {
    id: "dme",
    title: "Digital Marketing Executive",
    domain: "Marketing",
    categoryTags: ["Marketing", "Content", "Campaigns"],
    badgeNote: "May require relevant skills or portfolio",
    pathway: "both",
    matchScore: 95,
    industry: "Marketing, E-Commerce, D2C Brands & Digital Media",
    experienceLevel: "Fresher",
    locations: ["Mumbai", "Bengaluru", "Delhi NCR", "Chennai", "Remote / Hybrid"],
    eligibleDegrees: ["BBA", "BA", "B.Com", "MBA", "B.Sc.", "B.Tech"],
    eligibleSpecialisations: ["Marketing", "General Management", "International Business"],
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

  // ===========================================================================
  // HUMAN RESOURCES & TALENT ROLES (domain: "Human Resources")
  // ===========================================================================
  {
    id: "hre",
    title: "HR & Recruitment Executive",
    domain: "Human Resources",
    categoryTags: ["Human Resources", "Talent Acquisition", "People Ops"],
    badgeNote: "Requirements vary by employer",
    pathway: "both",
    matchScore: 94,
    industry: "Human Resources, Talent Acquisition & People Advisory",
    experienceLevel: "Fresher",
    locations: ["Bengaluru", "Hyderabad", "Pune", "Mumbai", "Chennai"],
    eligibleDegrees: ["BBA", "MBA", "BA", "B.Com", "B.Sc."],
    eligibleSpecialisations: ["Human Resources (HR)", "General Management"],
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

  // ===========================================================================
  // OPERATIONS, ANALYTICS & STRATEGY ROLES (domain: "Operations")
  // ===========================================================================
  {
    id: "ba",
    title: "Product Operations & Business Analyst",
    domain: "Operations",
    categoryTags: ["Operations", "Business Analytics", "Strategy"],
    badgeNote: "High-growth bridge role between Business, Operations & Tech",
    pathway: "both",
    matchScore: 93,
    industry: "Operations, Supply Chain, Strategy & Business Analytics",
    experienceLevel: "Fresher",
    locations: ["Bengaluru", "Mumbai", "Hyderabad", "Gurugram", "Remote / Hybrid"],
    eligibleDegrees: ["B.Tech", "BBA", "B.Com", "MBA", "B.Sc.", "BA"],
    eligibleSpecialisations: [
      "Operations & Supply Chain",
      "Economics & Analytics",
      "General Management",
      "Finance",
    ],
    degreeEligibilityNote: "Accepts any degree with strong SQL, Excel, and structured problem-solving skills",
    overview:
      "Translates business problems into data-backed insights, process workflows, and operational improvements—helping leadership make faster, evidence-based decisions.",
    orgFit:
      "Embedded within Central Operations, Supply Chain Strategy, or Product Operations—collaborating daily with engineering, finance, logistics, and executive leadership.",
    responsibilities: [
      "Gather, clean, and analyse operational and supply-chain data using SQL, Excel, and BI tools.",
      "Document business requirements (BRDs), SOP workflows, and process maps.",
      "Build live KPI dashboards tracking SLA adherence, turnaround times, and cost efficiency.",
      "Conduct root-cause analysis on operational bottlenecks and recommend automation solutions.",
      "Coordinate cross-functional process rollouts across city operations and vendor teams.",
    ],
    deliverables: [
      "Automated weekly KPI dashboards in Power BI / Tableau",
      "Business Requirement Documents (BRDs) & SOP workflow maps",
      "Process efficiency & cost-saving impact reports",
    ],
    acceptedDegrees: [
      "BBA / MBA / PGDM (Operations, Supply Chain, Business Analytics)",
      "B.Tech / B.E. (Mechanical, Industrial, CS, or allied branches)",
      "B.Com / B.Sc. / BA in Economics, Mathematics, or Statistics",
    ],
    entryRoutes: [
      "Direct campus or off-campus Business / Operations Analyst hiring track",
      "Operations Executive to Business Analyst internal transition",
      "Talent CIR Analytical Reasoning, SQL & Case Study Certification",
    ],
    essentialSkills: [
      "Advanced Excel & Spreadsheet Modelling",
      "SQL Querying & Data Extraction",
      "Data Visualisation (Power BI / Tableau)",
      "Structured Problem Solving & Root-Cause Analysis",
      "Process Mapping & SOP Documentation",
    ],
    preferredSkills: [
      "Lean Six Sigma & Supply Chain Fundamentals",
      "Agile / Scrum Workflow Management",
      "Python Basics for Data Analysis (Pandas)",
      "Unit Economics & SLA Optimisation",
    ],
    toolsRequired: [
      "SQL (PostgreSQL / MySQL / BigQuery)",
      "Microsoft Power BI / Tableau",
      "Advanced MS Excel",
      "Jira, Confluence & Miro",
    ],
    certifications: [
      "Talent CIR Verified Business & Operations Analyst (Level 2)",
      "Lean Six Sigma Green Belt Certification",
      "Microsoft Certified: Power BI Data Analyst Associate",
    ],
    projectProof: [
      "End-to-End SQL + Power BI Supply Chain & SLA Efficiency Dashboard",
      "Process Bottleneck Root-Cause Analysis & SOP Redesign Case Study",
      "Product Requirement Document (PRD) & Funnel Drop-Off Report",
    ],
    salaryIndia: {
      entry: "₹5.0 LPA – ₹8.5 LPA",
      entryRange: [5.0, 8.5],
      mid: "₹10.0 LPA – ₹17.5 LPA",
      midRange: [10.0, 17.5],
      senior: "₹20.0 LPA – ₹36.0 LPA+",
      seniorRange: [20.0, 36.0],
    },
    futureDemand: {
      demandLevel: "Emerging Rapidly",
      trendSummary:
        "Quick-commerce, e-commerce logistics, manufacturing GCCs, and SaaS platforms rely heavily on Operations and Business Analysts to optimise unit economics and speed.",
      aiImpact:
        "Natural-language BI tools speed up chart creation, making operational domain context, root-cause questioning, and cross-team execution the top differentiators.",
      emergingTech: [
        "AI-Copilot BI & Automated SQL Generation",
        "Process Mining & Workflow Automation (n8n, Zapier)",
        "Real-Time Predictive Supply Chain Telemetry",
      ],
      futureSkills: [
        "AI Workflow Automation Design",
        "Supply Chain & Operations Telemetry",
        "Strategic Commercial Modelling",
      ],
      advancementPath: [
        "Operations / Business Analyst (0–2 yrs)",
        "Senior Business Analyst / Ops Manager (2–5 yrs)",
        "Head of Strategy & Operations / PM (5–8 yrs)",
        "VP of Operations / Chief Operating Officer (8+ yrs)",
      ],
      relatedRoles: [
        "Supply Chain Planner",
        "Strategy & Operations Associate",
        "Associate Product Manager (APM)",
        "Data Analyst",
      ],
      sourceCitation:
        "World Economic Forum Future of Jobs Report & AIM India Analytics Study (2026)",
    },
  },

  // ===========================================================================
  // TECHNOLOGY, SOFTWARE & DATA ROLES (domain: "Technology")
  // ===========================================================================
  {
    id: "fsd",
    title: "Full-Stack / AI Associate Engineer",
    domain: "Technology",
    categoryTags: ["Technology", "Software", "AI Engineering"],
    badgeNote: "Eligible for B.Tech / BCA / B.Sc. or verified coding portfolio",
    pathway: "both",
    matchScore: 95,
    industry: "Technology, Software Products, AI Startups & IT Services",
    experienceLevel: "Fresher",
    locations: ["Bengaluru", "Hyderabad", "Pune", "Chennai", "Remote / Hybrid"],
    eligibleDegrees: ["B.Tech", "B.Sc.", "BCA / MCA"],
    eligibleSpecialisations: ["Computer Science & IT", "Economics & Analytics"],
    degreeEligibilityNote: "Primary fit for B.Tech / BCA / MCA / B.Sc. (CS); open via verified CIR Coding score",
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

// Map each Specialisation to its primary RoleDomain and default Role ID
const SPECIALISATION_TO_DOMAIN: Record<string, { domain: RoleDomain; defaultRoleId: string }> = {
  Finance: { domain: "Finance", defaultRoleId: "fpa" },
  Marketing: { domain: "Marketing", defaultRoleId: "dme" },
  "Human Resources (HR)": { domain: "Human Resources", defaultRoleId: "hre" },
  "Computer Science & IT": { domain: "Technology", defaultRoleId: "fsd" },
  "Operations & Supply Chain": { domain: "Operations", defaultRoleId: "ba" },
  "Economics & Analytics": { domain: "Finance", defaultRoleId: "fpa" },
  "International Business": { domain: "Business", defaultRoleId: "bde" },
  "General Management": { domain: "Business", defaultRoleId: "bde" },
};

// Dynamic Pathway Examples based on candidate's chosen Specialisation
const DOMAIN_PATHWAY_EXAMPLES: Record<
  RoleDomain,
  { path1Example: string; path2Example: string }
> = {
  Finance: {
    path1Example:
      "Financial Analyst & FP&A, Audit & Tax Associate, Corporate Accounting, and Wealth & Credit roles.",
    path2Example:
      "FinTech Product & Business Analyst, Revenue Operations, Client Advisory, and Data Analytics roles.",
  },
  Marketing: {
    path1Example:
      "Digital Marketing Executive, Brand Strategy, Content Marketing, and Business Development roles.",
    path2Example:
      "Customer Success Specialist, Product Operations, E-Commerce Growth, and Marketing Analytics roles.",
  },
  Business: {
    path1Example:
      "Business Development, Marketing, HR and Operations roles.",
    path2Example:
      "Digital Marketing, Customer Success, Sales, Recruitment and eligible entry-level tech roles.",
  },
  "Human Resources": {
    path1Example:
      "HR & Recruitment Executive, Talent Acquisition, People Operations, and L&D Coordinator roles.",
    path2Example:
      "Customer Success, Employer Branding, Corporate Communications, and Business Operations roles.",
  },
  Technology: {
    path1Example:
      "Full-Stack / AI Associate Engineer, Software Developer, Data Analyst, and QA Automation roles.",
    path2Example:
      "Product Operations & Business Analyst, Technical Customer Success, and Pre-Sales Solutions roles.",
  },
  Operations: {
    path1Example:
      "Product Operations & Business Analyst, Supply Chain Executive, Process Excellence, and Logistics roles.",
    path2Example:
      "Business Development, Customer Success, FinTech Operations, and Data Analytics roles.",
  },
};

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

const JOURNEY_STEPS = [
  {
    step: 0,
    badge: "01. HERO",
    shortTitle: "Overview",
    title: "Super Intelligence Career Guide",
    subtitle: "Your Education. Your Options. Your Future.",
  },
  {
    step: 1,
    badge: "STEP 1",
    shortTitle: "Create Profile",
    title: "Create Your Profile",
    subtitle: "02. Candidate Profile Setup — Tell Us About Yourself",
  },
  {
    step: 2,
    badge: "STEP 2",
    shortTitle: "Career Pathway",
    title: "Choose Your Career Pathway",
    subtitle: "03. Path 01 (Degree-Based) vs Path 02 (Beyond My Degree)",
  },
  {
    step: 3,
    badge: "STEP 3",
    shortTitle: "Job Roles",
    title: "Explore Recommended Job Roles",
    subtitle: "04. Your Personalised Career Opportunities",
  },
  {
    step: 4,
    badge: "STEP 4",
    shortTitle: "Role, Salary & Skills",
    title: "View Responsibilities, Skills & Salary",
    subtitle: "05. Role Details · 06. Salary Insights · 07. Skills Required",
  },
  {
    step: 5,
    badge: "STEP 5",
    shortTitle: "Career Roadmap",
    title: "Get Your Personalised Roadmap",
    subtitle: "08. From Where You Are to Where You Want to Be (5 Stages)",
  },
  {
    step: 6,
    badge: "STEP 6",
    shortTitle: "Future Outlook",
    title: "Understand Future Career Prospects",
    subtitle: "09. Choose a Career That's Ready for Tomorrow",
  },
  {
    step: 7,
    badge: "STEP 7",
    shortTitle: "Learn & Apply",
    title: "Learn, Assess & Apply",
    subtitle: "10. Connect Discovery to Learning & Jobs · 11. Final CTA",
  },
];

const AiGuidance = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active Step (0 & 1 = Main AI Guidance Page [01. Hero + 02. Tell Us About Yourself], 2..7 = Step-by-Step Full Pages)
  const stepParam = Number(searchParams.get("step") ?? "0");
  const currentStep = Number.isNaN(stepParam) || stepParam < 0 || stepParam > 7 ? 0 : stepParam;

  const scrollToProfileSection = () => {
    setTimeout(() => {
      const el = document.getElementById("tell-us-about-yourself");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 60);
  };

  const goToStep = (nextStep: number, roleIdToSelect?: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("step", String(nextStep));
    if (roleIdToSelect) {
      nextParams.set("role", roleIdToSelect);
    }
    setSearchParams(nextParams);
    if (nextStep === 1) {
      scrollToProfileSection();
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // 02. Candidate Profile State
  const [education, setEducation] = useState("BBA");
  const [specialisation, setSpecialisation] = useState("Marketing");
  const [country, setCountry] = useState("India");
  const [experience, setExperience] = useState<"Fresher" | "Experienced" | "Career Switcher">("Fresher");
  const [interests, setInterests] = useState<string[]>(["Business", "Marketing", "Client Relations"]);
  const [workLocation, setWorkLocation] = useState("Bengaluru (City / Hybrid)");
  const [salaryExpectation, setSalaryExpectation] = useState("₹4.5 LPA – ₹8.0 LPA");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState<number>(0);

  // Quick-Load Sample Persona Presets for 1-Click Testing
  const SAMPLE_PERSONAS = [
    {
      label: "B.Com • Finance",
      edu: "B.Com",
      spec: "Finance",
      exp: "Fresher" as const,
      loc: "Mumbai (City / On-Site)",
      ctc: "₹5.0 LPA – ₹8.5 LPA",
      ints: ["Finance", "Analytics & Data", "Business"],
    },
    {
      label: "BBA • Marketing",
      edu: "BBA",
      spec: "Marketing",
      exp: "Fresher" as const,
      loc: "Bengaluru (City / Hybrid)",
      ctc: "₹4.5 LPA – ₹7.5 LPA",
      ints: ["Marketing", "Business", "Creative & Content"],
    },
    {
      label: "B.Tech • Computer Science",
      edu: "B.Tech / B.E.",
      spec: "Computer Science / IT",
      exp: "Fresher" as const,
      loc: "Hyderabad (City / Hybrid)",
      ctc: "₹6.5 LPA – ₹12.0 LPA",
      ints: ["Technology", "Product & Strategy", "Analytics & Data"],
    },
    {
      label: "MBA • HR",
      edu: "MBA / PGDM",
      spec: "Human Resources (HR)",
      exp: "Experienced" as const,
      loc: "Delhi NCR (City / Hybrid)",
      ctc: "₹6.0 LPA – ₹10.0 LPA",
      ints: ["Human Resources", "Operations", "Client Relations"],
    },
    {
      label: "B.Sc. • Data & Analytics",
      edu: "B.Sc.",
      spec: "Data Science & AI",
      exp: "Career Switcher" as const,
      loc: "Remote (India / Global)",
      ctc: "₹5.5 LPA – ₹9.5 LPA",
      ints: ["Analytics & Data", "Operations", "Technology"],
    },
  ];

  const applyPersonaPreset = (preset: (typeof SAMPLE_PERSONAS)[number]) => {
    setEducation(preset.edu);
    handleSpecialisationChange(preset.spec);
    setExperience(preset.exp);
    setWorkLocation(preset.loc);
    setSalaryExpectation(preset.ctc);
    setInterests(preset.ints);
  };

  // 03. Pathway State
  const [selectedPath, setSelectedPath] = useState<DiscoveryPath>("all");

  // 04. Filters State (Strict Domain / Industry Filter)
  const [industryFilter, setIndustryFilter] = useState<string>("All");
  const [salaryFilter, setSalaryFilter] = useState("All");
  const [experienceFilter, setExperienceFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [degreeFilter, setDegreeFilter] = useState("All");
  const [skillSearch, setSkillSearch] = useState("");

  // 05. Active Role Detail State
  const roleParam = searchParams.get("role");
  const [selectedRoleId, setSelectedRoleId] = useState<string>(roleParam || "bde");
  const [activeDetailTab, setActiveDetailTab] = useState<DetailTab>("overview");

  useEffect(() => {
    if (roleParam && CAREER_ROLES.some((r) => r.id === roleParam)) {
      setSelectedRoleId(roleParam);
    }
  }, [roleParam]);

  // Whenever Specialisation changes in Step 1, sync the active domain filter & default role
  const handleSpecialisationChange = (newSpec: string) => {
    setSpecialisation(newSpec);
    const mapping = SPECIALISATION_TO_DOMAIN[newSpec];
    if (mapping) {
      setSelectedRoleId(mapping.defaultRoleId);
      // Pre-set the industry filter so Step 3 immediately shows relevant roles for their chosen specialisation
      setIndustryFilter(mapping.domain);
    }
  };

  // When Industry Filter changes in Step 3, keep selectedRoleId synced to a matching role
  const handleIndustryFilterChange = (newDomain: string) => {
    setIndustryFilter(newDomain);
    if (newDomain !== "All") {
      const firstMatch = CAREER_ROLES.find((r) => r.domain === newDomain);
      if (firstMatch) {
        setSelectedRoleId(firstMatch.id);
      }
    }
  };

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
    "Financial Statement Analysis (P&L, Balance Sheet, Cash Flow)",
    "Budgeting, Forecasting & Variance Analysis",
    "Corporate Accounting & Bookkeeping (Ind AS / IFRS)",
    "Credit Risk Appraisal & Ratio Analysis",
  ]);
  const [showSkillGapReport, setShowSkillGapReport] = useState(false);

  // 08. Roadmap Active Step
  const [activeRoadmapStage, setActiveRoadmapStage] = useState<number>(1);
  const [roadmapGenerated, setRoadmapGenerated] = useState<boolean>(false);

  const selectedRole = useMemo(
    () => CAREER_ROLES.find((r) => r.id === selectedRoleId) || CAREER_ROLES[0],
    [selectedRoleId]
  );

  const activeCandidateDomain: RoleDomain = useMemo(
    () => SPECIALISATION_TO_DOMAIN[specialisation]?.domain || "Business",
    [specialisation]
  );

  const pathwayExamples = useMemo(
    () => DOMAIN_PATHWAY_EXAMPLES[activeCandidateDomain] || DOMAIN_PATHWAY_EXAMPLES.Business,
    [activeCandidateDomain]
  );

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
    setGenerationStage(1);
    const mapping = SPECIALISATION_TO_DOMAIN[specialisation];
    if (mapping) {
      setSelectedRoleId(mapping.defaultRoleId);
    }
    setTimeout(() => setGenerationStage(2), 240);
    setTimeout(() => setGenerationStage(3), 480);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerationStage(0);
      goToStep(2);
    }, 750);
  };

  const handleSelectPathway = (path: DiscoveryPath) => {
    setSelectedPath(path);
    if (path === "degree") {
      // Path 01: Strictly filter to the candidate's specialisation domain
      setIndustryFilter(activeCandidateDomain);
      const firstDomainRole = CAREER_ROLES.find((r) => r.domain === activeCandidateDomain);
      if (firstDomainRole) setSelectedRoleId(firstDomainRole.id);
    } else {
      // Path 02 or All: Show cross-industry options while keeping domain filter easy to switch
      setIndustryFilter("All");
    }
    goToStep(3);
  };

  const handleOpenRoleDetail = (roleId: string, tab: DetailTab = "overview") => {
    setSelectedRoleId(roleId);
    setActiveDetailTab(tab);
    goToStep(4, roleId);
  };

  // Strictly filtered roles for Step 3
  const filteredRoles = useMemo(() => {
    const strictMatches = CAREER_ROLES.filter((role) => {
      // 1. Strict Industry / Domain Filter (Finance ONLY shows Finance, HR ONLY shows HR, etc.)
      if (industryFilter !== "All" && role.domain !== industryFilter) {
        return false;
      }

      // 2. Pathway Filter when Industry is "All"
      if (industryFilter === "All" && selectedPath === "degree") {
        const matchesSpec =
          role.domain === activeCandidateDomain ||
          role.eligibleSpecialisations.includes(specialisation);
        if (!matchesSpec) return false;
      }

      // 3. Salary Filter
      if (salaryFilter === "4to7" && role.salaryIndia.entryRange[1] < 4) return false;
      if (salaryFilter === "7plus" && role.salaryIndia.entryRange[1] < 7.0) return false;

      // 4. Experience Filter
      if (experienceFilter !== "All" && role.experienceLevel !== experienceFilter) {
        return false;
      }

      // 5. Location Filter
      if (
        locationFilter !== "All" &&
        !role.locations.some((l) => l.toLowerCase().includes(locationFilter.toLowerCase()))
      ) {
        return false;
      }

      // 6. Degree Eligibility Filter
      if (
        degreeFilter !== "All" &&
        !role.eligibleDegrees.some((d) => d.toLowerCase().includes(degreeFilter.toLowerCase()))
      ) {
        return false;
      }

      // 7. Skill / Keyword Search
      if (skillSearch.trim() !== "") {
        const q = skillSearch.toLowerCase();
        const inTitle = role.title.toLowerCase().includes(q);
        const inDomain = role.domain.toLowerCase().includes(q);
        const inSkills = [
          ...role.essentialSkills,
          ...role.preferredSkills,
          ...role.toolsRequired,
          ...role.categoryTags,
        ].some((s) => s.toLowerCase().includes(q));
        if (!inTitle && !inDomain && !inSkills) return false;
      }

      return true;
    });

    // Sort so roles matching the candidate's specialisation domain appear first when "All" is selected
    return [...strictMatches].sort((a, b) => {
      const aDomainMatch = a.domain === activeCandidateDomain ? 1 : 0;
      const bDomainMatch = b.domain === activeCandidateDomain ? 1 : 0;
      if (aDomainMatch !== bDomainMatch) return bDomainMatch - aDomainMatch;
      return b.matchScore - a.matchScore;
    });
  }, [
    industryFilter,
    selectedPath,
    activeCandidateDomain,
    specialisation,
    salaryFilter,
    experienceFilter,
    locationFilter,
    degreeFilter,
    skillSearch,
  ]);

  // Skill readiness calculation for selectedRole
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

  // Adjusted salary display for Step 4 (06. Salary Insights)
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
    <div className="min-h-screen flex flex-col bg-[#FBF4EB] text-slate-900">
      <Helmet>
        <title>Super Intelligence (SI) Career Guide | AI Career Guidance | TalentCIR</title>
        <meta
          name="description"
          content="Your Education. Your Options. Your Future. Discover the careers you can pursue, the skills you need, the salary you could earn and the opportunities waiting for you — powered by AI."
        />
      </Helmet>

      <Navbar />

      {/* Main container with pt-[72px] to clear fixed Navbar cleanly */}
      <main className="flex-1 pt-[72px] flex flex-col">
        {/* =====================================================================
            MAIN AI GUIDANCE PAGE (STEP 0 & STEP 1):
            FIRST: HERO SECTION (Full-Page Fit)
            SECOND: CANDIDATE PROFILE SETUP — Tell Us About Yourself (Full-Page Fit)
        ===================================================================== */}
        {(currentStep === 0 || currentStep === 1) && (
          <div className="w-full flex flex-col">
            {/* HERO SECTION — FIRST ON AI GUIDANCE PAGE (Full Viewport Fit) */}
            <section className="min-h-[calc(100vh-72px)] w-full flex items-center py-8 lg:py-12 border-b border-slate-200/80">
              <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20">
                <div className="grid lg:grid-cols-12 gap-10 xl:gap-14 items-center">
                  {/* Left Column: Executive Hero Copy */}
                  <div className="lg:col-span-6 space-y-6">
                    <div className="inline-flex flex-wrap items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-[#002C66]" />
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#002C66]">
                        Super Intelligence Career Guide
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs font-semibold text-slate-600">
                        AI-Powered Career Co-Pilot
                      </span>
                    </div>

                    <h1 className="font-display text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.08] text-slate-950">
                      Your Education.{" "}
                      <span className="text-[#002C66]">Your Options. Your Future.</span>
                    </h1>

                    <p className="text-base sm:text-lg xl:text-xl text-slate-700 leading-relaxed font-medium max-w-2xl">
                      Discover the careers you can pursue, the skills employers expect, the salary
                      you can earn across India, and a step-by-step roadmap tailored to your
                      qualification.
                    </p>

                    {/* Executive Value Highlights */}
                    <div className="grid sm:grid-cols-3 gap-3.5 max-w-2xl pt-1">
                      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
                        <div className="text-lg sm:text-xl font-extrabold text-[#002C66]">
                          Dual Pathways
                        </div>
                        <p className="text-xs text-slate-600 font-medium mt-0.5">
                          Degree-aligned & cross-industry roles
                        </p>
                      </div>
                      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
                        <div className="text-lg sm:text-xl font-extrabold text-[#002C66]">
                          India CTC Bands
                        </div>
                        <p className="text-xs text-slate-600 font-medium mt-0.5">
                          Entry, mid-career & senior benchmarks
                        </p>
                      </div>
                      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
                        <div className="text-lg sm:text-xl font-extrabold text-[#002C66]">
                          90-Day Roadmap
                        </div>
                        <p className="text-xs text-slate-600 font-medium mt-0.5">
                          Skill gap diagnostic & CIR readiness
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <button
                        type="button"
                        onClick={scrollToProfileSection}
                        className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl bg-[#002C66] hover:bg-[#00204d] text-white font-bold text-sm sm:text-base shadow-lg transition cursor-pointer"
                      >
                        Build My Career Profile
                        <ArrowRight className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => goToStep(3)}
                        className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-white hover:bg-slate-50 text-[#002C66] border border-[#002C66]/30 font-bold text-sm sm:text-base shadow-xs transition cursor-pointer"
                      >
                        Browse All Career Roles
                        <Compass className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Guided 4-Stage AI Process Strip */}
                    <div className="pt-3 max-w-2xl">
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2.5">
                        Guided AI Career Discovery Process
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {[
                          { step: "01", title: "Profile Setup", desc: "Degree & Location", target: "profile" },
                          { step: "02", title: "Dual Pathways", desc: "Degree vs Beyond", target: 2 },
                          { step: "03", title: "Role & CTC Audit", desc: "Salary & Skill Gap", target: 3 },
                          { step: "04", title: "90-Day Roadmap", desc: "CIR Action Plan", target: 5 },
                        ].map((item) => (
                          <button
                            key={item.step}
                            type="button"
                            onClick={() =>
                              item.target === "profile"
                                ? scrollToProfileSection()
                                : goToStep(item.target as number)
                            }
                            className="text-left p-3 rounded-xl bg-white/90 hover:bg-white border border-slate-200/90 hover:border-[#002C66]/50 transition shadow-2xs cursor-pointer group"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-[#002C66]/10 text-[#002C66]">
                                STEP {item.step}
                              </span>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#002C66] transition" />
                            </div>
                            <p className="text-xs font-extrabold text-slate-900">{item.title}</p>
                            <p className="text-[10px] text-slate-500 font-medium">{item.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Uncropped Hero Showcase Card */}
                  <div className="lg:col-span-6">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                      <div className="bg-[#002C66] px-5 py-3.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                          <span className="text-xs font-bold text-white ml-2 tracking-wide uppercase">
                            SI Career Intelligence • Interactive Preview
                          </span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-[11px] font-semibold">
                          Personalised Engine
                        </span>
                      </div>

                      <div className="bg-slate-100">
                        <img
                          src={heroImg}
                          alt="Super Intelligence Career Guide - Top Courses, Best Colleges, and Career Suggestions"
                          className="w-full h-auto max-h-[500px] block object-contain mx-auto"
                        />
                      </div>

                      <div className="grid grid-cols-3 divide-x divide-slate-200 border-t border-slate-200 bg-white text-center">
                        <div className="py-3.5 px-2">
                          <p className="text-xs sm:text-sm font-extrabold text-[#002C66]">
                            Top Courses
                          </p>
                          <p className="text-[11px] text-slate-500">Skill-Aligned Learning</p>
                        </div>
                        <div className="py-3.5 px-2">
                          <p className="text-xs sm:text-sm font-extrabold text-[#002C66]">
                            Qualification Fit
                          </p>
                          <p className="text-[11px] text-slate-500">Degree & Domain Mapping</p>
                        </div>
                        <div className="py-3.5 px-2">
                          <p className="text-xs sm:text-sm font-extrabold text-[#002C66]">
                            Career Pathways
                          </p>
                          <p className="text-[11px] text-slate-500">Role, Salary & Roadmap</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CANDIDATE PROFILE SETUP — Tell Us About Yourself (Second on AI Guidance Page, Full-Page Fit) */}
            <section
              id="tell-us-about-yourself"
              className="min-h-[calc(100vh-72px)] w-full flex items-center py-8 lg:py-12 scroll-mt-[72px]"
            >
              <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20">
                <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-10 xl:p-12">
                  {/* Top Section Header */}
                  <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 mb-8 border-b border-slate-200">
                    <div className="max-w-3xl">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#002C66]/10 text-[#002C66] text-xs font-extrabold uppercase tracking-wider mb-3">
                        <UserCheck className="w-3.5 h-3.5" />
                        Step 01 • Candidate Profile Assessment
                      </div>
                      <h2 className="font-display text-3xl sm:text-4xl xl:text-[42px] font-extrabold text-slate-950 tracking-tight">
                        Tell Us About <span className="text-[#002C66]">Yourself.</span>
                      </h2>
                      <p className="text-slate-600 text-sm sm:text-base mt-1.5 leading-relaxed">
                        Configure your academic background, experience stage, and location
                        preferences so our AI engine can calibrate high-match roles and realistic
                        salary benchmarks.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto shrink-0">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FBF4EB] border border-slate-200 text-slate-800 text-xs font-bold">
                        <GraduationCap className="w-3.5 h-3.5 text-[#002C66]" />
                        {education} • {specialisation}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Primary Track: {activeCandidateDomain}
                      </span>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-12 gap-8 xl:gap-10 items-stretch">
                    {/* Left Column: Clean, Executive Profile Form */}
                    <div className="lg:col-span-8 bg-[#FBF4EB]/45 rounded-2xl border border-slate-200/90 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                      <div className="space-y-6">
                        {/* Quick 1-Click Sample Persona Presets Bar */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#002C66] flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-[#002C66]" />
                              Quick-Start Demo Personas (1-Click Auto-Fill)
                            </span>
                            <span className="text-[11px] font-medium text-slate-500">
                              Click a profile to test instant AI domain calibration
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {SAMPLE_PERSONAS.map((preset) => {
                              const isSelected =
                                education === preset.education &&
                                specialisation === preset.specialisation;
                              return (
                                <button
                                  key={preset.label}
                                  type="button"
                                  onClick={() => applyPersonaPreset(preset)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                                    isSelected
                                      ? "bg-[#002C66] text-white border-[#002C66] shadow-2xs"
                                      : "bg-slate-50 text-slate-700 border-slate-200 hover:border-[#002C66]/40 hover:bg-white"
                                  }`}
                                >
                                  {preset.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Group 1: Academic & Geographic Profile (6 Clean Uniform Fields) */}
                        <div>
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-[#002C66] text-white text-[10px] font-extrabold inline-flex items-center justify-center">
                                1
                              </span>
                              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#002C66]">
                                Academic Qualification & Work Preferences
                              </h3>
                            </div>
                            <span className="text-[11px] font-semibold text-slate-500">
                              All 6 parameters sync live with the AI engine
                            </span>
                          </div>

                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {/* Field 1: Highest Education */}
                            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
                              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
                                <GraduationCap className="w-3.5 h-3.5 text-[#002C66]" />
                                Highest Qualification
                              </label>
                              <select
                                value={education}
                                onChange={(e) => setEducation(e.target.value)}
                                className="w-full h-11 rounded-lg bg-slate-50/80 border border-slate-300 px-3 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#002C66] transition"
                              >
                                {EDUCATION_OPTIONS.map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Field 2: Specialisation */}
                            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
                              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
                                <BookOpen className="w-3.5 h-3.5 text-[#002C66]" />
                                Academic Specialisation
                              </label>
                              <select
                                value={specialisation}
                                onChange={(e) => handleSpecialisationChange(e.target.value)}
                                className="w-full h-11 rounded-lg bg-slate-50/80 border border-slate-300 px-3 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#002C66] transition"
                              >
                                {SPECIALISATION_OPTIONS.map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Field 3: Country */}
                            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
                              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
                                <Globe2 className="w-3.5 h-3.5 text-[#002C66]" />
                                Preferred Country
                              </label>
                              <select
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className="w-full h-11 rounded-lg bg-slate-50/80 border border-slate-300 px-3 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#002C66] transition"
                              >
                                {COUNTRY_OPTIONS.map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Field 4: Preferred Work Location */}
                            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
                              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
                                <MapPin className="w-3.5 h-3.5 text-[#002C66]" />
                                Preferred Work Mode & City
                              </label>
                              <select
                                value={workLocation}
                                onChange={(e) => setWorkLocation(e.target.value)}
                                className="w-full h-11 rounded-lg bg-slate-50/80 border border-slate-300 px-3 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#002C66] transition"
                              >
                                {LOCATION_OPTIONS.map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Field 5: Salary Expectations */}
                            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
                              <label className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                                <span className="flex items-center gap-1.5">
                                  <IndianRupee className="w-3.5 h-3.5 text-[#002C66]" />
                                  Target Annual CTC
                                </span>
                                <span className="text-[10px] font-medium text-slate-400">
                                  Optional
                                </span>
                              </label>
                              <input
                                type="text"
                                value={salaryExpectation}
                                onChange={(e) => setSalaryExpectation(e.target.value)}
                                placeholder="e.g., ₹4.5 LPA – ₹8.0 LPA"
                                className="w-full h-11 rounded-lg bg-slate-50/80 border border-slate-300 px-3 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#002C66] transition"
                              />
                            </div>

                            {/* Field 6: Career Experience Stage (Single-line segmented control) */}
                            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
                              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
                                <Briefcase className="w-3.5 h-3.5 text-[#002C66]" />
                                Experience Stage
                              </label>
                              <div className="grid grid-cols-3 gap-1.5 h-11 bg-slate-100 p-1 rounded-lg border border-slate-200">
                                {EXPERIENCE_OPTIONS.map((exp) => {
                                  const shortLabel =
                                    exp === "Career Switcher" ? "Switcher" : exp;
                                  return (
                                    <button
                                      key={exp}
                                      type="button"
                                      onClick={() => setExperience(exp)}
                                      title={exp}
                                      className={`h-full rounded-md text-[11px] font-extrabold whitespace-nowrap transition cursor-pointer ${
                                        experience === exp
                                          ? "bg-[#002C66] text-white shadow-2xs"
                                          : "text-slate-700 hover:bg-white/70"
                                      }`}
                                    >
                                      {shortLabel}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Group 2: Core Career Interests */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                            <label className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#002C66]">
                              <span className="w-5 h-5 rounded-full bg-[#002C66] text-white text-[10px] font-extrabold inline-flex items-center justify-center">
                                2
                              </span>
                              Core Career Interests & Domains
                            </label>
                            <span className="text-[11px] font-semibold text-slate-500">
                              {interests.length} selected (Select one or more)
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {INTEREST_OPTIONS.map((interest) => {
                              const active = interests.includes(interest);
                              return (
                                <button
                                  key={interest}
                                  type="button"
                                  onClick={() => toggleInterest(interest)}
                                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold border transition cursor-pointer ${
                                    active
                                      ? "bg-[#002C66] text-white border-[#002C66] shadow-2xs"
                                      : "bg-slate-50/80 text-slate-700 border-slate-200 hover:border-[#002C66]/40 hover:bg-white"
                                  }`}
                                >
                                  {active && <Check className="w-3.5 h-3.5 text-sky-300" />}
                                  {interest}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Animated 3-Stage AI Generation Progress Bar (shown when clicking Generate) */}
                      {isGenerating && (
                        <div className="bg-[#002C66] text-white rounded-xl p-4 shadow-sm">
                          <div className="flex items-center justify-between text-xs font-bold mb-2">
                            <span className="flex items-center gap-2">
                              <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-300" />
                              {generationStage === 1 &&
                                `Stage 1/3: Calibrating ${education} (${specialisation}) domain fit...`}
                              {generationStage === 2 &&
                                `Stage 2/3: Benchmarking ${country} entry & mid-career CTC bands...`}
                              {generationStage >= 3 &&
                                "Stage 3/3: Preparing Dual Career Discovery Pathways..."}
                            </span>
                            <span className="text-sky-300">{generationStage * 33}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-white/15 overflow-hidden">
                            <div
                              className="h-full bg-emerald-400 transition-all duration-200"
                              style={{ width: `${Math.min(100, generationStage * 34)}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Clean Bottom Action Bar */}
                      <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-200/90">
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                          <p className="text-xs font-semibold text-slate-600">
                            Calibrated for{" "}
                            <strong className="text-slate-900">
                              {education} ({specialisation})
                            </strong>{" "}
                            • <strong className="text-[#002C66]">{experience}</strong> in{" "}
                            <strong className="text-slate-900">{workLocation}</strong>
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={handleGenerateOptions}
                          className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#002C66] hover:bg-[#00204d] text-white font-bold text-sm sm:text-base shadow-md transition cursor-pointer shrink-0"
                        >
                          {isGenerating ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              Calibrating Career Pathways...
                            </>
                          ) : (
                            <>
                              Generate My Career Options
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Right Column: Executive AI Career Intelligence Preview */}
                    <div className="lg:col-span-4 flex flex-col justify-between gap-5">
                      {/* Navy Intelligence Snapshot Card */}
                      <div className="pro-hero bg-[#002C66] text-white rounded-2xl p-6 sm:p-7 shadow-md flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/15">
                            <div>
                              <span className="text-[11px] font-extrabold uppercase tracking-widest text-sky-300 block">
                                Live Career Intelligence
                              </span>
                              <h3 className="font-display text-lg font-extrabold text-white mt-0.5">
                                {activeCandidateDomain} Track
                              </h3>
                            </div>
                            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold">
                              AI Calibrated
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2.5 text-xs mb-5">
                            <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                              <span className="text-slate-300 text-[11px] block">
                                Qualification
                              </span>
                              <span className="text-xs font-extrabold text-white mt-0.5 block truncate">
                                {education} • {specialisation}
                              </span>
                            </div>
                            <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                              <span className="text-slate-300 text-[11px] block">
                                Stage & Location
                              </span>
                              <span className="text-xs font-extrabold text-white mt-0.5 block truncate">
                                {experience} • {country}
                              </span>
                            </div>
                          </div>

                          {/* Top Matched Roles Preview for Chosen Specialisation (Interactive) */}
                          <div>
                            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-sky-300 mb-2.5">
                              <span>Top Matched Roles ({activeCandidateDomain})</span>
                              <span>India Entry CTC</span>
                            </div>
                            <div className="space-y-2">
                              {CAREER_ROLES.filter(
                                (r) => r.domain === activeCandidateDomain
                              )
                                .slice(0, 3)
                                .map((role) => (
                                  <button
                                    key={role.id}
                                    type="button"
                                    onClick={() => handleOpenRoleDetail(role.id, "overview")}
                                    className="w-full text-left p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-between gap-2 transition cursor-pointer group"
                                  >
                                    <div className="min-w-0">
                                      <p className="text-xs font-bold text-white truncate group-hover:text-sky-200">
                                        {role.title}
                                      </p>
                                      <span className="text-[10px] text-sky-300 font-semibold">
                                        {role.matchScore}% Profile Match • Click to inspect
                                      </span>
                                    </div>
                                    <span className="px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-200 text-[11px] font-extrabold shrink-0">
                                      {role.salaryIndia.entry}
                                    </span>
                                  </button>
                                ))}
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-slate-200">
                          <span>Target Salary Band:</span>
                          <strong className="text-white font-extrabold">
                            {salaryExpectation || selectedRole.salaryIndia.entry}
                          </strong>
                        </div>
                      </div>

                      {/* Clean Deliverable Summary Card */}
                      <div className="bg-[#FBF4EB]/60 rounded-2xl border border-slate-200 p-5">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#002C66] mb-3">
                          Your 4-Stage Personalised Deliverable
                        </h4>
                        <div className="grid grid-cols-2 gap-2.5 text-xs">
                          <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 font-bold text-slate-800 flex items-center gap-2">
                            <Compass className="w-3.5 h-3.5 text-[#002C66] shrink-0" />
                            <span>Dual Career Paths</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 font-bold text-slate-800 flex items-center gap-2">
                            <IndianRupee className="w-3.5 h-3.5 text-[#002C66] shrink-0" />
                            <span>Salary Insights</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 font-bold text-slate-800 flex items-center gap-2">
                            <Target className="w-3.5 h-3.5 text-[#002C66] shrink-0" />
                            <span>Skill Gap Audit</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 font-bold text-slate-800 flex items-center gap-2">
                            <Layers className="w-3.5 h-3.5 text-[#002C66] shrink-0" />
                            <span>90-Day Roadmap</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* =====================================================================
            EXECUTIVE STEP-BY-STEP PROCESS PIPELINE BAR (SHOWN ON STEPS 2 TO 7)
        ===================================================================== */}
        {currentStep >= 2 && (
          <div className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-[72px] z-30 shadow-2xs">
            <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20 py-3 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
              {/* Active Candidate Context Pill */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => goToStep(1)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FBF4EB] hover:bg-[#002C66]/10 border border-slate-200 text-xs font-extrabold text-[#002C66] transition cursor-pointer"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  {education} ({specialisation})
                  <span className="text-slate-400">•</span>
                  <span>{experience}</span>
                  <span className="underline ml-1 text-[11px]">Edit Profile</span>
                </button>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  Active Role: {selectedRole.title}
                </span>
              </div>

              {/* Interactive 7-Step Process Pipeline */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 xl:pb-0 no-scrollbar">
                {[
                  { id: 1, num: "01", label: "Profile Setup" },
                  { id: 2, num: "02", label: "Discovery Paths" },
                  { id: 3, num: "03", label: "Matched Roles" },
                  { id: 4, num: "04", label: "Role & Salary" },
                  { id: 5, num: "05", label: "90-Day Roadmap" },
                  { id: 6, num: "06", label: "Future Outlook" },
                  { id: 7, num: "07", label: "Take Action" },
                ].map((s, idx, arr) => {
                  const isActive = currentStep === s.id;
                  const isCompleted = currentStep > s.id;
                  return (
                    <div key={s.id} className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => goToStep(s.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          isActive
                            ? "bg-[#002C66] text-white shadow-2xs"
                            : isCompleted
                            ? "bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <span
                            className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                              isActive
                                ? "bg-white/20 text-white"
                                : "bg-white text-slate-700"
                            }`}
                          >
                            {s.num}
                          </span>
                        )}
                        <span>{s.label}</span>
                      </button>
                      {idx < arr.length - 1 && (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            PAGE 2 (STEP 2): CHOOSE YOUR CAREER DISCOVERY PATH (Full-Page Fit)
        ===================================================================== */}
        {currentStep === 2 && (
          <section className="min-h-[calc(100vh-72px)] w-full flex flex-col justify-center py-6 lg:py-10">
            <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20 flex-1 flex flex-col justify-between">
              <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-10 xl:p-12 flex-1 flex flex-col justify-between">
                <div className="text-center max-w-4xl mx-auto mb-8">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#002C66]/10 text-[#002C66] text-xs font-extrabold uppercase tracking-wider mb-3">
                    <Compass className="w-3.5 h-3.5" />
                    Step 02 of 07 • Choose Your Career Discovery Path
                  </div>
                  <h1 className="font-display text-3xl sm:text-4xl xl:text-5xl font-extrabold text-slate-950 tracking-tight mb-3">
                    Two Ways to Discover <span className="text-[#002C66]">Your Future.</span>
                  </h1>
                  <p className="text-slate-600 text-base sm:text-lg">
                    Profile calibrated for{" "}
                    <strong className="text-slate-900">
                      {education} ({specialisation})
                    </strong>{" "}
                    in <strong className="text-slate-900">{country}</strong>. Select how you want
                    Super Intelligence to map your career opportunities:
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 xl:gap-10 items-stretch my-auto">
                  {/* PATH 01 CARD */}
                  <div className="rounded-3xl border-2 border-slate-200 bg-[#FBF4EB]/40 hover:bg-white hover:border-[#002C66] shadow-sm hover:shadow-md overflow-hidden flex flex-col justify-between transition">
                    <div>
                      <div className="relative aspect-[16/9] max-h-[340px] w-full bg-slate-100 border-b border-slate-200 overflow-hidden">
                        <img
                          src={path1Img}
                          alt="Path 01 - Careers Based on My Education"
                          className="w-full h-full object-cover object-center"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#002C66] text-white shadow-md">
                            Pathway 01 • Direct Degree Alignment
                          </span>
                        </div>
                      </div>

                      <div className="p-6 sm:p-8">
                        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-950 mb-2">
                          Careers Based on <span className="text-[#002C66]">My Education</span>
                        </h2>
                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-5">
                          Discover high-match career opportunities directly aligned with your
                          academic qualification, specialisation, and core subject strengths.
                        </p>

                        {/* 3-Metric Executive Comparison Strip */}
                        <div className="grid grid-cols-3 gap-2.5 mb-5">
                          <div className="p-3 rounded-xl bg-white border border-slate-200 text-center">
                            <span className="text-[10px] font-bold uppercase text-slate-500 block">
                              SI Fit Score
                            </span>
                            <span className="text-sm font-extrabold text-[#002C66]">
                              92% – 96%
                            </span>
                          </div>
                          <div className="p-3 rounded-xl bg-white border border-slate-200 text-center">
                            <span className="text-[10px] font-bold uppercase text-slate-500 block">
                              Entry CTC Band
                            </span>
                            <span className="text-sm font-extrabold text-emerald-700">
                              ₹4.5 – ₹8.5 LPA
                            </span>
                          </div>
                          <div className="p-3 rounded-xl bg-white border border-slate-200 text-center">
                            <span className="text-[10px] font-bold uppercase text-slate-500 block">
                              Ramp-Up Time
                            </span>
                            <span className="text-sm font-extrabold text-slate-900">
                              30 – 60 Days
                            </span>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5">
                          <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#002C66]">
                            Recommended Roles for {education} ({specialisation})
                          </div>
                          <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                            {education} ({specialisation}) in {country} →{" "}
                            <span className="text-[#002C66] font-bold">
                              {pathwayExamples.path1Example}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 pb-6 sm:px-8 sm:pb-8">
                      <button
                        type="button"
                        onClick={() => handleSelectPathway("degree")}
                        className="w-full inline-flex items-center justify-center gap-2 py-4 px-5 rounded-xl bg-[#002C66] hover:bg-[#00204d] text-white font-bold text-sm sm:text-base transition cursor-pointer shadow-sm"
                      >
                        Explore My Degree-Based Careers ({activeCandidateDomain})
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* PATH 02 CARD */}
                  <div className="rounded-3xl border-2 border-slate-200 bg-[#FBF4EB]/40 hover:bg-white hover:border-[#002C66] shadow-sm hover:shadow-md overflow-hidden flex flex-col justify-between transition">
                    <div>
                      <div className="relative aspect-[16/9] max-h-[340px] w-full bg-slate-100 border-b border-slate-200 overflow-hidden">
                        <img
                          src={path2Img}
                          alt="Path 02 - Careers Beyond My Degree"
                          className="w-full h-full object-cover object-[center_20%]"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#002C66] text-white shadow-md">
                            Pathway 02 • Cross-Industry Pivot
                          </span>
                        </div>
                      </div>

                      <div className="p-6 sm:p-8">
                        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-950 mb-2">
                          Careers Beyond <span className="text-[#002C66]">My Degree</span>
                        </h2>
                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-5">
                          Explore high-growth opportunities across modern industries that welcome
                          graduates from diverse academic backgrounds with transferable skills.
                        </p>

                        {/* 3-Metric Executive Comparison Strip */}
                        <div className="grid grid-cols-3 gap-2.5 mb-5">
                          <div className="p-3 rounded-xl bg-white border border-slate-200 text-center">
                            <span className="text-[10px] font-bold uppercase text-slate-500 block">
                              SI Fit Score
                            </span>
                            <span className="text-sm font-extrabold text-[#002C66]">
                              85% – 92%
                            </span>
                          </div>
                          <div className="p-3 rounded-xl bg-white border border-slate-200 text-center">
                            <span className="text-[10px] font-bold uppercase text-slate-500 block">
                              Entry CTC Band
                            </span>
                            <span className="text-sm font-extrabold text-emerald-700">
                              ₹4.0 – ₹9.0 LPA
                            </span>
                          </div>
                          <div className="p-3 rounded-xl bg-white border border-slate-200 text-center">
                            <span className="text-[10px] font-bold uppercase text-slate-500 block">
                              Ramp-Up Time
                            </span>
                            <span className="text-sm font-extrabold text-slate-900">
                              60 – 90 Days
                            </span>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5">
                          <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#002C66]">
                            Cross-Industry Pathways for {education} Graduates
                          </div>
                          <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                            {education} graduate →{" "}
                            <span className="text-[#002C66] font-bold">
                              {pathwayExamples.path2Example}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 pb-6 sm:px-8 sm:pb-8">
                      <button
                        type="button"
                        onClick={() => handleSelectPathway("beyond")}
                        className="w-full inline-flex items-center justify-center gap-2 py-4 px-5 rounded-xl bg-[#002C66] hover:bg-[#00204d] text-white font-bold text-sm sm:text-base transition cursor-pointer shadow-sm"
                      >
                        Explore Cross-Industry Career Options
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => goToStep(1)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Candidate Profile Setup
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPathway("all")}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#002C66] hover:bg-[#00204d] text-white text-xs sm:text-sm font-bold shadow-xs cursor-pointer"
                  >
                    View Combined Roles from Both Pathways
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================================
            PAGE 3 (STEP 3): YOUR PERSONALISED CAREER OPPORTUNITIES (Full-Page Fit)
        ===================================================================== */}
        {currentStep === 3 && (
          <section className="min-h-[calc(100vh-72px)] w-full flex flex-col justify-center py-6 lg:py-10">
            <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20 flex-1 flex flex-col justify-between">
              <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-10 xl:p-12 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#002C66]/10 text-[#002C66] text-xs font-extrabold uppercase tracking-wider mb-3">
                        <Briefcase className="w-3.5 h-3.5" />
                        Step 03 of 07 • Personalised Career Opportunities
                      </div>
                      <h1 className="font-display text-3xl sm:text-4xl xl:text-5xl font-extrabold text-slate-950 tracking-tight">
                        Discover Jobs You Can{" "}
                        <span className="text-[#002C66]">Actually Pursue.</span>
                      </h1>
                      <p className="text-slate-600 text-base sm:text-lg mt-2 max-w-3xl">
                        Curated career roles matched to your qualification, domain preference, and
                        location. Select any career domain below to filter strictly by that industry.
                      </p>
                    </div>

                    {/* Active Pathway Switcher */}
                    <div className="inline-flex rounded-xl bg-slate-100 p-1.5 border border-slate-200 self-start shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPath("all");
                          setIndustryFilter("All");
                        }}
                        className={`px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                          selectedPath === "all" && industryFilter === "All"
                            ? "bg-[#002C66] text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        All Domains ({CAREER_ROLES.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPath("degree");
                          handleIndustryFilterChange(activeCandidateDomain);
                        }}
                        className={`px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                          selectedPath === "degree" || industryFilter === activeCandidateDomain
                            ? "bg-[#002C66] text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        My Track: {activeCandidateDomain}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPath("beyond");
                          setIndustryFilter("All");
                        }}
                        className={`px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                          selectedPath === "beyond" && industryFilter === "All"
                            ? "bg-[#002C66] text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Cross-Industry Roles
                      </button>
                    </div>
                  </div>

                  {/* Quick Domain Selector Pills (Strict 1-Click Domain Filtering) */}
                  <div className="flex flex-wrap items-center gap-2 mb-5">
                    <span className="text-xs font-bold text-slate-600 mr-1">
                      Career Domain:
                    </span>
                    {(
                      [
                        { id: "All", label: "All Domains" },
                        { id: "Finance", label: "Finance & Banking" },
                        { id: "Marketing", label: "Marketing & Digital" },
                        { id: "Business", label: "Sales & Business Dev" },
                        { id: "Human Resources", label: "HR & Recruitment" },
                        { id: "Operations", label: "Operations & Analytics" },
                        { id: "Technology", label: "Technology & Software" },
                      ] as const
                    ).map((dom) => (
                      <button
                        key={dom.id}
                        type="button"
                        onClick={() => handleIndustryFilterChange(dom.id)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer ${
                          industryFilter === dom.id
                            ? "bg-[#002C66] text-white border-[#002C66] shadow-xs"
                            : "bg-white text-slate-700 border-slate-300 hover:border-[#002C66]"
                        }`}
                      >
                        {dom.label}
                      </button>
                    ))}
                  </div>

                  {/* Multi-Parameter Filter Bar */}
                  <div className="bg-[#FBF4EB]/55 rounded-2xl border border-slate-200 p-4 sm:p-5 mb-8">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#002C66]">
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        Refine by Industry, Salary Band, Experience, City, Degree & Skills
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIndustryFilter("All");
                          setSalaryFilter("All");
                          setExperienceFilter("All");
                          setLocationFilter("All");
                          setDegreeFilter("All");
                          setSkillSearch("");
                          setSelectedPath("all");
                        }}
                        className="text-xs font-bold text-[#002C66] hover:underline cursor-pointer"
                      >
                        Reset All Filters
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                      <select
                        value={industryFilter}
                        onChange={(e) => handleIndustryFilterChange(e.target.value)}
                        className="h-10 rounded-xl bg-white border border-slate-300 px-3 text-xs font-semibold text-slate-800"
                      >
                        <option value="All">Industry: All Domains</option>
                        <option value="Finance">Finance, Banking & Audit</option>
                        <option value="Marketing">Marketing, Brand & Digital</option>
                        <option value="Business">Sales, Business & SaaS</option>
                        <option value="Human Resources">Human Resources (HR)</option>
                        <option value="Operations">Operations & Analytics</option>
                        <option value="Technology">Technology & Software</option>
                      </select>

                      <select
                        value={salaryFilter}
                        onChange={(e) => setSalaryFilter(e.target.value)}
                        className="h-10 rounded-xl bg-white border border-slate-300 px-3 text-xs font-semibold text-slate-800"
                      >
                        <option value="All">Salary Range: All</option>
                        <option value="4to7">Entry ₹4 LPA – ₹7 LPA+</option>
                        <option value="7plus">Entry ₹7 LPA – ₹12 LPA+</option>
                      </select>

                      <select
                        value={experienceFilter}
                        onChange={(e) => setExperienceFilter(e.target.value)}
                        className="h-10 rounded-xl bg-white border border-slate-300 px-3 text-xs font-semibold text-slate-800"
                      >
                        <option value="All">Experience: All Levels</option>
                        <option value="Fresher">Fresher Friendly</option>
                      </select>

                      <select
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className="h-10 rounded-xl bg-white border border-slate-300 px-3 text-xs font-semibold text-slate-800"
                      >
                        <option value="All">Location: All Cities</option>
                        <option value="Bengaluru">Bengaluru</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Delhi">Delhi NCR</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Chennai">Chennai / Pune</option>
                        <option value="Remote">Remote / Hybrid</option>
                      </select>

                      <select
                        value={degreeFilter}
                        onChange={(e) => setDegreeFilter(e.target.value)}
                        className="h-10 rounded-xl bg-white border border-slate-300 px-3 text-xs font-semibold text-slate-800"
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
                          placeholder="Skills (e.g. Excel, GST, SQL)"
                          className="w-full h-10 rounded-xl bg-white border border-slate-300 pl-8 pr-3 text-xs font-semibold text-slate-800"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Role Cards Grid */}
                  {filteredRoles.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-[#FBF4EB]/40 p-10 text-center">
                      <p className="text-base font-bold text-slate-800 mb-2">
                        No roles match that exact combination of filters.
                      </p>
                      <p className="text-xs text-slate-600 mb-4">
                        Try resetting the degree or location filter to view all roles in{" "}
                        <strong>
                          {industryFilter === "All" ? "all domains" : industryFilter}
                        </strong>
                        .
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSalaryFilter("All");
                          setExperienceFilter("All");
                          setLocationFilter("All");
                          setDegreeFilter("All");
                          setSkillSearch("");
                        }}
                        className="px-4 py-2 rounded-xl bg-[#002C66] text-white text-xs font-bold cursor-pointer"
                      >
                        Clear Secondary Filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredRoles.map((role) => (
                        <div
                          key={role.id}
                          className="rounded-2xl border-2 border-slate-200 bg-white hover:border-[#002C66] p-6 transition flex flex-col justify-between shadow-xs hover:shadow-md"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2.5">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#002C66]/10 text-[#002C66] text-xs font-extrabold">
                                <Sparkles className="w-3 h-3" />
                                {role.matchScore}% SI Match
                              </span>
                              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                                Entry: {role.salaryIndia.entry}
                              </span>
                            </div>

                            {/* Visual AI Match Progress Bar */}
                            <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden mb-3.5">
                              <div
                                className="h-full bg-[#002C66] rounded-full"
                                style={{ width: `${role.matchScore}%` }}
                              />
                            </div>

                            <div className="mb-1.5">
                              <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-[#002C66] mb-1">
                                {role.domain}
                              </span>
                              <h3 className="font-display text-xl font-extrabold text-slate-950">
                                {role.title}
                              </h3>
                            </div>

                            <p className="text-xs font-bold text-[#002C66] mb-3">
                              {role.categoryTags.join(" · ")}
                            </p>

                            <div className="inline-block px-3 py-1 rounded-lg bg-[#FBF4EB] border border-slate-200 text-slate-800 text-xs font-semibold mb-3.5">
                              {role.badgeNote}
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed mb-3.5">
                              {role.overview}
                            </p>

                            {/* Core Tools Pills */}
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {role.toolsRequired.slice(0, 3).map((tool) => (
                                <span
                                  key={tool}
                                  className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-700"
                                >
                                  {tool}
                                </span>
                              ))}
                            </div>

                            <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-200/80 pt-3 mb-5">
                              <div className="flex items-center gap-1.5">
                                <GraduationCap className="w-3.5 h-3.5 text-[#002C66] shrink-0" />
                                <span className="truncate">{role.degreeEligibilityNote}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-[#002C66] shrink-0" />
                                <span className="truncate">
                                  {role.locations.slice(0, 3).join(", ")}
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleOpenRoleDetail(role.id, "overview")}
                            className="w-full inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-[#002C66] hover:bg-[#00204d] text-white text-xs font-bold transition cursor-pointer"
                          >
                            Explore Role, Salary & Skills
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => goToStep(2)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Career Discovery Pathways
                    </button>
                    <button
                      type="button"
                      onClick={() => goToStep(4)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#002C66] hover:bg-[#00204d] text-white text-xs sm:text-sm font-bold shadow-xs cursor-pointer"
                    >
                      Continue: Explore {selectedRole.title} in Detail
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================================
            PAGE 4 (STEP 4): INDIVIDUAL CAREER DETAILS PAGE (Full-Page Fit)
            Role Deep-Dive + Salary Insights + Skills & Gap Diagnostic
        ===================================================================== */}
        {currentStep === 4 && (
          <section className="min-h-[calc(100vh-72px)] w-full flex flex-col justify-center py-6 lg:py-10">
            <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20 space-y-8">
              {/* Role Switcher Bar at top of Step 4 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => goToStep(3)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to Filtered Roles ({industryFilter})
                  </button>
                  <span className="text-xs font-bold text-slate-500 hidden sm:inline">
                    Switch Role:
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(filteredRoles.length > 0 ? filteredRoles : CAREER_ROLES).map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRoleId(r.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        selectedRole.id === r.id
                          ? "bg-[#002C66] text-white shadow-xs"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {r.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* ROLE DEEP-DIVE CARD */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
                <div className="pro-hero bg-[#002C66] text-white p-6 sm:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-sky-300 text-xs font-extrabold uppercase tracking-wider mb-2">
                        Step 04 of 07 • Role Deep-Dive • {selectedRole.domain}
                      </div>
                      <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                        {selectedRole.title}
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-200 mt-1">
                        {selectedRole.categoryTags.join(" · ")} — {selectedRole.industry}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-right">
                        <span className="text-[10px] uppercase tracking-wider text-slate-300 block">
                          India Entry CTC
                        </span>
                        <span className="text-sm font-extrabold text-emerald-300">
                          {selectedRole.salaryIndia.entry}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 6 Section Sub-Tabs */}
                  <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-white/15">
                    {(
                      [
                        { id: "overview", label: "Role Overview" },
                        { id: "responsibilities", label: "Responsibilities & Deliverables" },
                        { id: "eligibility", label: "Education & Eligibility" },
                        { id: "skills", label: "Skills & Tools" },
                        { id: "salary", label: "Salary Progression" },
                        { id: "outlook", label: "Growth & Outlook" },
                      ] as { id: DetailTab; label: string }[]
                    ).map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveDetailTab(tab.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                          activeDetailTab === tab.id
                            ? "bg-white text-[#002C66] shadow-xs"
                            : "bg-white/10 text-slate-200 hover:bg-white/20"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  {activeDetailTab === "overview" && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-6 rounded-2xl bg-[#FBF4EB]/55 border border-slate-200">
                        <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#002C66] mb-2">
                          Role Overview & Core Purpose
                        </h3>
                        <p className="text-xs text-slate-500 mb-3">
                          Understand what the role entails and the business value it delivers.
                        </p>
                        <p className="text-sm text-slate-800 leading-relaxed font-medium">
                          {selectedRole.overview}
                        </p>
                      </div>
                      <div className="p-6 rounded-2xl bg-[#FBF4EB]/55 border border-slate-200">
                        <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#002C66] mb-2">
                          Organisational Fit & Hiring Hubs
                        </h3>
                        <p className="text-sm text-slate-800 leading-relaxed mb-4">
                          {selectedRole.orgFit}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {selectedRole.locations.map((loc) => (
                            <span
                              key={loc}
                              className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-semibold text-slate-700"
                            >
                              {loc}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeDetailTab === "responsibilities" && (
                    <div className="grid md:grid-cols-12 gap-6">
                      <div className="md:col-span-7 p-6 rounded-2xl bg-[#FBF4EB]/55 border border-slate-200">
                        <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#002C66] mb-1">
                          Core Responsibilities
                        </h3>
                        <p className="text-xs text-slate-500 mb-4">
                          Day-to-day workflows and operational accountabilities.
                        </p>
                        <ul className="space-y-2.5">
                          {selectedRole.responsibilities.map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-800">
                              <CheckCircle2 className="w-4 h-4 text-[#002C66] shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="md:col-span-5 p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                        <h3 className="text-sm font-extrabold uppercase tracking-wider text-emerald-950 mb-3">
                          Key Deliverables & Outcomes
                        </h3>
                        <ul className="space-y-2.5">
                          {selectedRole.deliverables.map((d, i) => (
                            <li
                              key={i}
                              className="p-3 rounded-xl bg-white border border-emerald-200 text-xs font-bold text-slate-800"
                            >
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeDetailTab === "eligibility" && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-6 rounded-2xl bg-[#FBF4EB]/55 border border-slate-200">
                        <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#002C66] mb-1">
                          Accepted Qualifications
                        </h3>
                        <p className="text-xs text-slate-500 mb-4">
                          Degrees, academic backgrounds, and eligibility criteria.
                        </p>
                        <ul className="space-y-2">
                          {selectedRole.acceptedDegrees.map((deg, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-800">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{deg}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-6 rounded-2xl bg-[#FBF4EB]/55 border border-slate-200">
                        <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#002C66] mb-3">
                          Recommended Entry Routes
                        </h3>
                        <ul className="space-y-2.5">
                          {selectedRole.entryRoutes.map((route, i) => (
                            <li
                              key={i}
                              className="p-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800"
                            >
                              Route 0{i + 1}: {route}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeDetailTab === "skills" && (
                    <div className="grid md:grid-cols-3 gap-5">
                      <div className="p-5 rounded-2xl bg-[#FBF4EB]/55 border border-slate-200">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#002C66] mb-3">
                          Essential & Technical Skills
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedRole.essentialSkills.map((s) => (
                            <span
                              key={s}
                              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="p-5 rounded-2xl bg-[#FBF4EB]/55 border border-slate-200">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#002C66] mb-3">
                          Industry Tools Required
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedRole.toolsRequired.map((t) => (
                            <span
                              key={t}
                              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="p-5 rounded-2xl bg-[#FBF4EB]/55 border border-slate-200">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 mb-3">
                          Valued Certifications
                        </h4>
                        <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                          {selectedRole.certifications.map((c) => (
                            <li key={c}>• {c}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeDetailTab === "salary" && (
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="p-5 rounded-2xl bg-[#FBF4EB]/55 border border-slate-200">
                        <span className="text-xs font-bold uppercase text-slate-500">
                          Entry Level
                        </span>
                        <div className="text-2xl font-extrabold text-[#002C66] mt-1">
                          {selectedRole.salaryIndia.entry}
                        </div>
                      </div>
                      <div className="p-5 rounded-2xl bg-white border-2 border-[#002C66]">
                        <span className="text-xs font-bold uppercase text-[#002C66]">
                          Mid-Career
                        </span>
                        <div className="text-2xl font-extrabold text-slate-950 mt-1">
                          {selectedRole.salaryIndia.mid}
                        </div>
                      </div>
                      <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                        <span className="text-xs font-bold uppercase text-emerald-800">
                          Senior Level
                        </span>
                        <div className="text-2xl font-extrabold text-emerald-700 mt-1">
                          {selectedRole.salaryIndia.senior}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeDetailTab === "outlook" && (
                    <div className="p-5 rounded-2xl bg-[#FBF4EB]/55 border border-slate-200">
                      <h4 className="text-sm font-extrabold text-slate-900 mb-2">
                        Career Growth & Future Outlook
                      </h4>
                      <p className="text-sm text-slate-700 mb-4">
                        {selectedRole.futureDemand.trendSummary}
                      </p>
                      <div className="grid sm:grid-cols-4 gap-3">
                        {selectedRole.futureDemand.advancementPath.map((stage, idx) => (
                          <div
                            key={stage}
                            className="p-3 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800"
                          >
                            <span className="text-[#002C66] block text-[10px]">
                              STAGE 0{idx + 1}
                            </span>
                            {stage}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SALARY INSIGHTS — KNOW YOUR EARNING POTENTIAL */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-8">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#002C66]/10 text-[#002C66] text-xs font-extrabold uppercase tracking-wider mb-2">
                      Compensation Benchmarks • India & Global
                    </div>
                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-950">
                      Know Your <span className="text-[#002C66]">Earning Potential.</span>
                    </h2>
                    <p className="text-sm text-slate-600 mt-1">
                      Explore how annual compensation scales with experience, city tier, and
                      specialised skill credentials.
                    </p>
                  </div>

                  <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 self-start shrink-0">
                    <button
                      type="button"
                      onClick={() => setSalaryCityTier("tier1")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                        salaryCityTier === "tier1" ? "bg-[#002C66] text-white" : "text-slate-600"
                      }`}
                    >
                      Tier-1 Metro (India)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSalaryCityTier("tier2")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                        salaryCityTier === "tier2" ? "bg-[#002C66] text-white" : "text-slate-600"
                      }`}
                    >
                      Tier-2 City
                    </button>
                    <button
                      type="button"
                      onClick={() => setSalaryCityTier("global")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                        salaryCityTier === "global" ? "bg-[#002C66] text-white" : "text-slate-600"
                      }`}
                    >
                      Global Remote
                    </button>
                  </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-6 items-stretch">
                  <div className="lg:col-span-8 bg-[#FBF4EB]/55 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display text-xl font-extrabold text-slate-950 mb-4">
                        {selectedRole.title}
                      </h3>
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                          <div className="text-xs font-bold uppercase text-slate-500 mb-1">
                            Entry Level
                          </div>
                          <div className="text-xl font-extrabold text-[#002C66]">
                            {adjustedSalary.entry}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1">
                            Annual CTC · 0 – 2 Years
                          </div>
                        </div>
                        <div className="p-5 rounded-2xl bg-white border-2 border-[#002C66] shadow-xs">
                          <div className="text-xs font-bold uppercase text-[#002C66] mb-1">
                            Mid-Career
                          </div>
                          <div className="text-xl font-extrabold text-slate-950">
                            {adjustedSalary.mid}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1">
                            Annual CTC · 2 – 5 Years
                          </div>
                        </div>
                        <div className="p-5 rounded-2xl bg-white border border-emerald-300 shadow-xs">
                          <div className="text-xs font-bold uppercase text-emerald-800 mb-1">
                            Senior Level
                          </div>
                          <div className="text-xl font-extrabold text-emerald-700">
                            {adjustedSalary.senior}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1">
                            Annual CTC · 5+ Years
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-4">
                      Data Source Reference: {selectedRole.futureDemand.sourceCitation}
                    </p>
                  </div>

                  <div className="lg:col-span-4 bg-[#FBF4EB]/55 rounded-2xl border border-slate-200 p-6">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#002C66] mb-3">
                      Key Compensation Drivers
                    </h4>
                    <ul className="space-y-2.5 text-xs font-semibold text-slate-800">
                      <li className="p-3 rounded-xl bg-white border border-slate-200">
                        • Academic qualification & domain specialisation
                      </li>
                      <li className="p-3 rounded-xl bg-white border border-slate-200">
                        • Employment hub & Tier-1/Tier-2 market demand
                      </li>
                      <li className="p-3 rounded-xl bg-white border border-slate-200">
                        • Employer tier (GCC, Enterprise, FinTech, SaaS)
                      </li>
                      <li className="p-3 rounded-xl bg-white border border-slate-200">
                        • Verified tool proficiency & CIR assessment score
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* SKILLS YOU NEED TO SUCCEED — FIND OUT WHAT EMPLOYERS EXPECT */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-8">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#002C66]/10 text-[#002C66] text-xs font-extrabold uppercase tracking-wider mb-2">
                      Skill Readiness & Gap Diagnostic
                    </div>
                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-950">
                      Find Out What <span className="text-[#002C66]">Employers Expect.</span>
                    </h2>
                    <p className="text-sm text-slate-600 mt-1">
                      Select the skills you already possess to calculate your live employer
                      readiness score for <strong>{selectedRole.title}</strong>:
                    </p>
                  </div>
                  <div className="px-4 py-2.5 rounded-2xl bg-[#002C66] text-white text-right shrink-0">
                    <span className="text-[10px] font-bold uppercase text-sky-300 block">
                      Your Readiness Score
                    </span>
                    <span className="text-lg font-extrabold">
                      {skillReadinessPercent}% ({matchedSkillCount}/{roleAllCoreSkills.length} Skills)
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
                  {/* Essential Skills */}
                  <div className="p-5 rounded-2xl bg-[#FBF4EB]/55 border border-slate-200">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#002C66] mb-3">
                      Core Technical & Domain Skills
                    </h4>
                    <div className="space-y-2">
                      {selectedRole.essentialSkills.map((skill) => {
                        const checked = checkedSkills.includes(skill);
                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => toggleSkillCheck(skill)}
                            className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left text-xs font-bold transition cursor-pointer ${
                              checked
                                ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                                : "bg-white border-slate-200 text-slate-700"
                            }`}
                          >
                            <span>{skill}</span>
                            <span className="text-[10px] uppercase shrink-0 ml-2">
                              {checked ? "✓ Verified" : "+ Add Skill"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Preferred Skills */}
                  <div className="p-5 rounded-2xl bg-[#FBF4EB]/55 border border-slate-200">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#002C66] mb-3">
                      High-Value Employability Skills
                    </h4>
                    <div className="space-y-2">
                      {selectedRole.preferredSkills.map((skill) => {
                        const checked = checkedSkills.includes(skill);
                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => toggleSkillCheck(skill)}
                            className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left text-xs font-bold transition cursor-pointer ${
                              checked
                                ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                                : "bg-white border-slate-200 text-slate-700"
                            }`}
                          >
                            <span>{skill}</span>
                            <span className="text-[10px] uppercase shrink-0 ml-2">
                              {checked ? "✓ Verified" : "+ Add Skill"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tools & Certifications */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-[#FBF4EB]/55 border border-slate-200">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#002C66] mb-2">
                        Software & Industry Tools
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedRole.toolsRequired.map((tool) => (
                          <span
                            key={tool}
                            className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-semibold text-slate-800"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FBF4EB]/55 border border-slate-200">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#002C66] mb-2">
                        Recommended Certifications & Proof
                      </h4>
                      <ul className="space-y-1 text-xs text-slate-700 font-medium">
                        {selectedRole.certifications.map((c) => (
                          <li key={c}>• {c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {showSkillGapReport && (
                  <div className="p-5 rounded-2xl bg-[#002C66]/5 border border-[#002C66]/20 mb-6">
                    <h4 className="text-sm font-extrabold text-[#002C66] mb-1">
                      Personalised Skill Gap Diagnostic for {selectedRole.title}
                    </h4>
                    <p className="text-xs text-slate-600 mb-3">
                      Priority skills to acquire next to reach 100% employer readiness:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {missingRoleSkills.length === 0 ? (
                        <span className="text-xs font-bold text-emerald-800">
                          All core skills verified! You are ready for Talent CIR assessment.
                        </span>
                      ) : (
                        missingRoleSkills.map((gap) => (
                          <span
                            key={gap}
                            className="px-3 py-1 rounded-lg bg-white border border-[#002C66]/30 text-xs font-bold text-[#002C66]"
                          >
                            Priority Focus: {gap}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowSkillGapReport((prev) => !prev)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border-2 border-[#002C66] text-[#002C66] hover:bg-[#002C66]/5 text-xs sm:text-sm font-bold cursor-pointer"
                  >
                    Discover My Skill Gaps
                    <Target className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => goToStep(5)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#002C66] hover:bg-[#00204d] text-white text-xs sm:text-sm font-bold shadow-xs cursor-pointer"
                  >
                    Continue: Your Personalised Career Roadmap
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================================
            PAGE 5 (STEP 5): YOUR PERSONALISED CAREER ROADMAP (Full-Page Fit)
        ===================================================================== */}
        {currentStep === 5 && (
          <section className="min-h-[calc(100vh-72px)] w-full flex flex-col justify-center py-6 lg:py-10">
            <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20 flex-1 flex flex-col justify-between">
              <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-10 xl:p-12 flex-1 flex flex-col justify-between">
                <div className="text-center max-w-4xl mx-auto mb-8">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#002C66]/10 text-[#002C66] text-xs font-extrabold uppercase tracking-wider mb-3">
                    <Layers className="w-3.5 h-3.5" />
                    Step 05 of 07 • Personalised Career Roadmap
                  </div>
                  <h1 className="font-display text-3xl sm:text-4xl xl:text-5xl font-extrabold text-slate-950 tracking-tight mb-3">
                    From Where You Are to{" "}
                    <span className="text-[#002C66]">Where You Want to Be.</span>
                  </h1>
                  <p className="text-slate-600 text-base sm:text-lg">
                    A structured 5-stage execution plan connecting your{" "}
                    <strong>
                      {education} ({specialisation})
                    </strong>{" "}
                    profile to <strong>{selectedRole.title}</strong>.
                  </p>
                </div>

                {/* 5-Stage Interactive Roadmap Cards */}
                <div className="grid md:grid-cols-5 gap-4 xl:gap-5 mb-8">
                  {[
                    {
                      num: 1,
                      code: "01",
                      title: "Understand Your Starting Point",
                      desc: "Review your education, experience, existing skills and career interests.",
                      liveDetail: `${education} (${specialisation}) • ${experience} • ${country}`,
                    },
                    {
                      num: 2,
                      code: "02",
                      title: "Choose a Target Role",
                      desc: "Compare recommended careers and lock a high-match target role.",
                      liveDetail: `Target: ${selectedRole.title} (${selectedRole.matchScore}% Match)`,
                    },
                    {
                      num: 3,
                      code: "03",
                      title: "Close Your Skill Gaps",
                      desc: "Complete focused modules and hands-on tools training.",
                      liveDetail:
                        missingRoleSkills.length > 0
                          ? `Focus: ${missingRoleSkills.slice(0, 2).join(", ")}`
                          : "Core skills verified — ready for capstone",
                    },
                    {
                      num: 4,
                      code: "04",
                      title: "Prove Your Readiness",
                      desc: "Validate domain competency through Talent CIR assessments.",
                      liveDetail: selectedRole.certifications[0],
                    },
                    {
                      num: 5,
                      code: "05",
                      title: "Prepare for Opportunities",
                      desc: "Sharpen your portfolio, practise interviews and apply to verified roles.",
                      liveDetail: `Target Band: ${selectedRole.salaryIndia.entry}`,
                    },
                  ].map((stage) => {
                    const isActive = activeRoadmapStage === stage.num;
                    return (
                      <div
                        key={stage.num}
                        onClick={() => setActiveRoadmapStage(stage.num)}
                        className={`rounded-2xl p-5 xl:p-6 border-2 transition cursor-pointer flex flex-col justify-between ${
                          isActive
                            ? "border-[#002C66] bg-[#002C66]/5 shadow-sm"
                            : "border-slate-200 bg-[#FBF4EB]/50 hover:border-slate-300"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span
                              className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-extrabold ${
                                isActive
                                  ? "bg-[#002C66] text-white"
                                  : "bg-white text-[#002C66] border border-slate-200"
                              }`}
                            >
                              {stage.code}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#002C66]">
                              Stage {stage.code}
                            </span>
                          </div>
                          <h3 className="font-display text-sm sm:text-base font-extrabold text-slate-900 mb-1.5">
                            {stage.title}
                          </h3>
                          <p className="text-xs text-slate-600 leading-relaxed mb-4">
                            {stage.desc}
                          </p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-[11px] font-bold text-[#002C66]">
                          {stage.liveDetail}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Actionable 90-Day Execution Blueprint */}
                <div className="bg-[#FBF4EB]/55 rounded-2xl border border-slate-200 p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#002C66]">
                        Personalised 90-Day Action Plan
                      </span>
                      <h3 className="font-display text-xl sm:text-2xl font-extrabold text-slate-950">
                        {education} ({specialisation}) → {selectedRole.title}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRoadmapGenerated(true)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#002C66] hover:bg-[#00204d] text-white text-xs sm:text-sm font-bold shadow-xs cursor-pointer"
                    >
                      Build My Career Roadmap
                      <Sparkles className="w-4 h-4 text-sky-300" />
                    </button>
                  </div>

                  <div className="grid md:grid-cols-3 gap-5">
                    <div className="p-5 rounded-2xl bg-white border border-slate-200">
                      <div className="flex items-center gap-2 text-xs font-extrabold text-[#002C66] uppercase mb-2">
                        <Calendar className="w-4 h-4" />
                        Days 1 – 30: Foundation & Tools
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        Master core tools ({selectedRole.toolsRequired.slice(0, 3).join(", ")}) and
                        close priority skill gaps (
                        {missingRoleSkills.slice(0, 2).join(", ") || "Advanced Domain Practice"}).
                      </p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white border border-slate-200">
                      <div className="flex items-center gap-2 text-xs font-extrabold text-[#002C66] uppercase mb-2">
                        <Award className="w-4 h-4" />
                        Days 31 – 60: Proof & CIR Assessment
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        Complete capstone project ({selectedRole.projectProof[0]}) and earn{" "}
                        <strong>{selectedRole.certifications[0]}</strong>.
                      </p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white border border-slate-200">
                      <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-700 uppercase mb-2">
                        <Briefcase className="w-4 h-4" />
                        Days 61 – 90: Interviews & Offers
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        Apply to verified employers in {workLocation} targeting{" "}
                        <strong>{selectedRole.salaryIndia.entry}</strong>.
                      </p>
                    </div>
                  </div>

                  {roadmapGenerated && (
                    <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        Your personalised roadmap for {selectedRole.title} is locked and ready!
                        Proceed to explore Future Career Prospects.
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => goToStep(4)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Role Details, Salary & Skills
                  </button>

                  <button
                    type="button"
                    onClick={() => goToStep(6)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#002C66] hover:bg-[#00204d] text-white text-xs sm:text-sm font-bold shadow-xs cursor-pointer"
                  >
                    Continue: Understand the Future of Your Career
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================================
            PAGE 6 (STEP 6): UNDERSTAND THE FUTURE OF YOUR CAREER (Full-Page Fit)
        ===================================================================== */}
        {currentStep === 6 && (
          <section className="min-h-[calc(100vh-72px)] w-full flex flex-col justify-center py-6 lg:py-10">
            <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20 flex-1 flex flex-col justify-between">
              <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-10 xl:p-12 flex-1 flex flex-col justify-between">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#002C66]/10 text-[#002C66] text-xs font-extrabold uppercase tracking-wider mb-3">
                      <Globe2 className="w-3.5 h-3.5" />
                      Step 06 of 07 • Future Career Outlook & AI Impact
                    </div>
                    <h1 className="font-display text-3xl sm:text-4xl xl:text-5xl font-extrabold text-slate-950 tracking-tight">
                      Choose a Career That&apos;s{" "}
                      <span className="text-[#002C66]">Ready for Tomorrow.</span>
                    </h1>
                    <p className="text-slate-600 text-base sm:text-lg mt-2 max-w-3xl">
                      Explore how <strong>{selectedRole.title}</strong> is evolving with AI
                      co-pilots, industry automation, and long-term market demand.
                    </p>
                  </div>

                  <div className="px-4 py-2.5 rounded-xl bg-[#FBF4EB] border border-slate-200 text-xs font-semibold text-slate-700">
                    Market Benchmark:{" "}
                    <strong className="text-[#002C66]">
                      {selectedRole.futureDemand.sourceCitation}
                    </strong>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8 my-auto">
                  {/* Card 1: Current Industry Demand */}
                  <div className="rounded-2xl bg-[#FBF4EB]/55 border border-slate-200 p-6 xl:p-8 flex flex-col justify-between">
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-3">
                        Industry Demand • {selectedRole.futureDemand.demandLevel}
                      </span>
                      <h3 className="font-display text-lg sm:text-xl font-extrabold text-slate-900 mb-2">
                        Market Demand & AI Co-Pilot Impact
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4">
                        {selectedRole.futureDemand.trendSummary}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-600">
                      <strong className="text-[#002C66] block mb-1">
                        How AI Reshapes This Role:
                      </strong>
                      {selectedRole.futureDemand.aiImpact}
                    </div>
                  </div>

                  {/* Card 2: Emerging Technologies & Future Skills */}
                  <div className="rounded-2xl bg-[#FBF4EB]/55 border border-slate-200 p-6 xl:p-8 space-y-6">
                    <div>
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#002C66] mb-3">
                        Emerging Technologies Shaping the Role
                      </h3>
                      <div className="space-y-2.5">
                        {selectedRole.futureDemand.emergingTech.map((tech) => (
                          <div
                            key={tech}
                            className="p-3 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-bold text-slate-800"
                          >
                            • {tech}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#002C66] mb-3">
                        Future-Proof Skills Employers Value
                      </h3>
                      <div className="space-y-2.5">
                        {selectedRole.futureDemand.futureSkills.map((fSkill) => (
                          <div
                            key={fSkill}
                            className="p-3 rounded-xl bg-[#002C66]/8 border border-[#002C66]/20 text-xs sm:text-sm font-bold text-[#002C66]"
                          >
                            ★ {fSkill}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Career Advancement Pathways & Related Roles */}
                  <div className="rounded-2xl bg-[#FBF4EB]/55 border border-slate-200 p-6 xl:p-8 space-y-6">
                    <div>
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#002C66] mb-3">
                        Multi-Year Career Progression
                      </h3>
                      <div className="space-y-2.5">
                        {selectedRole.futureDemand.advancementPath.map((stage, i) => (
                          <div
                            key={stage}
                            className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-bold text-slate-800"
                          >
                            <span className="w-5 h-5 rounded-full bg-[#002C66] text-white text-[10px] flex items-center justify-center shrink-0">
                              {i + 1}
                            </span>
                            <span>{stage}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#002C66] mb-2.5">
                        Adjacent & Alternative Career Roles
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedRole.futureDemand.relatedRoles.map((rel) => (
                          <span
                            key={rel}
                            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700"
                          >
                            {rel}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => goToStep(5)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Personalised Career Roadmap
                  </button>

                  <button
                    type="button"
                    onClick={() => goToStep(7)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#002C66] hover:bg-[#00204d] text-white text-xs sm:text-sm font-bold shadow-xs cursor-pointer"
                  >
                    Continue: Learn, Assess & Apply
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================================
            PAGE 7 (STEP 7): CONNECT CAREER DISCOVERY TO LEARNING & JOBS
            + FINAL CTA SECTION (Full-Page Fit)
        ===================================================================== */}
        {currentStep === 7 && (
          <section className="min-h-[calc(100vh-72px)] w-full flex flex-col justify-between py-6 lg:py-10">
            <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20 flex-1 flex flex-col justify-between space-y-8">
              {/* Connect Career Discovery to Learning & Jobs */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-10 xl:p-12">
                <div className="text-center max-w-4xl mx-auto mb-8">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#002C66]/10 text-[#002C66] text-xs font-extrabold uppercase tracking-wider mb-3">
                    <Zap className="w-3.5 h-3.5" />
                    Step 07 of 07 • Turn Career Discovery Into Action
                  </div>
                  <h1 className="font-display text-3xl sm:text-4xl xl:text-5xl font-extrabold text-slate-950 tracking-tight mb-3">
                    Discover It. Learn It.{" "}
                    <span className="text-[#002C66]">Make It Happen.</span>
                  </h1>
                  <p className="text-slate-600 text-base sm:text-lg">
                    Execute your personalised career plan for <strong>{selectedRole.title}</strong>{" "}
                    through industry-aligned courses, proctored CIR assessments, portfolio building,
                    and verified job opportunities.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* 1. Learn the Skills */}
                  <div className="rounded-2xl border border-slate-200 bg-[#FBF4EB]/50 p-6 xl:p-7 flex flex-col justify-between hover:border-[#002C66] hover:bg-white transition shadow-xs">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-[#002C66]/10 text-[#002C66] flex items-center justify-center mb-4">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <h3 className="font-display text-lg font-extrabold text-slate-900 mb-2">
                        Learn the Skills
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                        Explore structured courses and expert-led learning pathways tailored to{" "}
                        {selectedRole.title}.
                      </p>
                    </div>
                    <Link
                      to="/learning"
                      className="inline-flex items-center justify-between w-full px-4 py-3 rounded-xl bg-[#002C66] hover:bg-[#00204d] text-white text-xs font-bold transition"
                    >
                      <span>Explore Learning</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* 2. Assess Your Readiness */}
                  <div className="rounded-2xl border border-slate-200 bg-[#FBF4EB]/50 p-6 xl:p-7 flex flex-col justify-between hover:border-[#002C66] hover:bg-white transition shadow-xs">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-[#002C66]/10 text-[#002C66] flex items-center justify-center mb-4">
                        <FileCheck2 className="w-6 h-6" />
                      </div>
                      <h3 className="font-display text-lg font-extrabold text-slate-900 mb-2">
                        Assess Your Readiness
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                        Benchmark your current skills against employer standards with proctored
                        Talent CIR assessments.
                      </p>
                    </div>
                    <Link
                      to="/assessments"
                      className="inline-flex items-center justify-between w-full px-4 py-3 rounded-xl bg-[#002C66] hover:bg-[#00204d] text-white text-xs font-bold transition"
                    >
                      <span>Take an Assessment</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* 3. Prepare Your Profile */}
                  <div className="rounded-2xl border border-slate-200 bg-[#FBF4EB]/50 p-6 xl:p-7 flex flex-col justify-between hover:border-[#002C66] hover:bg-white transition shadow-xs">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center mb-4">
                        <UserCheck className="w-6 h-6" />
                      </div>
                      <h3 className="font-display text-lg font-extrabold text-slate-900 mb-2">
                        Prepare Your Profile
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                        Build an employer-ready resume showcasing verified projects and CIR
                        competency credentials.
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      className="inline-flex items-center justify-between w-full px-4 py-3 rounded-xl bg-[#002C66] hover:bg-[#00204d] text-white text-xs font-bold transition"
                    >
                      <span>Build My Profile</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* 4. Find Relevant Jobs */}
                  <div className="rounded-2xl border border-slate-200 bg-[#FBF4EB]/50 p-6 xl:p-7 flex flex-col justify-between hover:border-[#002C66] hover:bg-white transition shadow-xs">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-[#002C66]/10 text-[#002C66] flex items-center justify-center mb-4">
                        <Briefcase className="w-6 h-6" />
                      </div>
                      <h3 className="font-display text-lg font-extrabold text-slate-900 mb-2">
                        Find Relevant Jobs
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                        Apply directly to verified openings aligned with {selectedRole.title} and
                        your qualification.
                      </p>
                    </div>
                    <Link
                      to="/jobs"
                      className="inline-flex items-center justify-between w-full px-4 py-3 rounded-xl bg-[#002C66] hover:bg-[#00204d] text-white text-xs font-bold transition"
                    >
                      <span>Browse Jobs</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => goToStep(6)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Future Career Outlook
                  </button>
                  <button
                    type="button"
                    onClick={() => goToStep(0)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-[#002C66] cursor-pointer"
                  >
                    Back to AI Guidance Home
                  </button>
                </div>
              </div>

              {/* Final Executive CTA Banner & Interactive Journey Recap */}
              <div className="pro-hero rounded-3xl bg-[#002C66] text-white p-8 sm:p-12 shadow-xl">
                <div className="grid lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-sky-300 text-xs font-bold uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      Super Intelligence Career Co-Pilot
                    </span>
                    <h2 className="font-display text-3xl sm:text-4xl xl:text-5xl font-extrabold tracking-tight text-white">
                      Your Degree Is Just <span className="text-sky-300">the Beginning.</span>
                    </h2>
                    <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
                      Discover your possibilities, validate your potential, and accelerate into the
                      career path built for you.
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => goToStep(1)}
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FBF4EB] hover:bg-white text-[#002C66] font-extrabold text-sm shadow-lg transition cursor-pointer"
                      >
                        Recalibrate My Career Profile
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate("/assessments")}
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition cursor-pointer"
                      >
                        Launch Talent CIR Assessment
                      </button>
                    </div>
                  </div>

                  {/* Interactive 7-Step Journey Navigator */}
                  <div className="lg:col-span-5 bg-white/10 rounded-2xl p-5 border border-white/15">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-sky-300 mb-3">
                      Complete SI Career Guide Journey
                    </div>
                    <div className="space-y-2">
                      {JOURNEY_STEPS.slice(1).map((s) => (
                        <button
                          key={s.step}
                          type="button"
                          onClick={() => goToStep(s.step)}
                          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-left text-xs transition cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="px-2 py-0.5 rounded bg-white text-[#002C66] text-[10px] font-extrabold">
                              {s.badge}
                            </span>
                            <span className="font-bold text-white">{s.title}</span>
                          </div>
                          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AiGuidance;
