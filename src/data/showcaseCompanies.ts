import profileOfficeCover from "@/assets/profile-office-cover.jpg";
import employerTeamImg from "@/assets/employer-team.jpg";
import employerAssessmentImg from "@/assets/employer-skill-assessment.jpg";
import employerCampusImg from "@/assets/employer-campus-hiring.jpg";
import employerRecruiterImg from "@/assets/employer-recruiter.jpg";
import expertMale2 from "@/assets/experts/male-2.jpg";
import expertFemale2 from "@/assets/experts/female-2.jpg";
import expertFemale4 from "@/assets/experts/female-4.jpg";
import type { CompanyJobRow, PublicCompanyData } from "@/services/employer/profile";

export interface CompanyHighlightItem {
  value: string;
  label: string;
  sub?: string;
}

export interface CompanyLeaderItem {
  name: string;
  role: string;
  focus: string;
  photoUrl: string;
  linkedinUrl?: string;
}

export interface CompanyWorkplacePhoto {
  imageUrl: string;
  caption: string;
  alt: string;
}

export interface CompanyHiringStep {
  step: string;
  title: string;
  duration: string;
  description: string;
}

export interface ShowcaseCompanyRecord extends PublicCompanyData {
  aliases?: string[];
  tagline: string;
  employer_code: string;
  registration_type: string;
  gstin_verified: boolean;
  address: string;
  highlights: CompanyHighlightItem[];
  leadership: CompanyLeaderItem[];
  workplace_photos: CompanyWorkplacePhoto[];
  hiring_steps: CompanyHiringStep[];
  jobs: CompanyJobRow[];
}

export const SHOWCASE_COMPANIES: ShowcaseCompanyRecord[] = [
  {
    id: "showcase-super30",
    name: "Super30 Technologies",
    slug: "super30-technologies",
    aliases: ["super30", "super-30", "demo", "super30-tech"],
    employer_code: "IAT-EMP-204819",
    tagline: "AI-Native Developer Infrastructure, Cloud Runtime & Autonomous Engineering Workflows",
    logo_url: "/company-logos/super30-mark.svg",
    cover_url: profileOfficeCover,
    verified: true,
    gstin_verified: true,
    industry: "Software & Cloud Infrastructure",
    category: "B2B Enterprise SaaS · Developer Tools",
    company_type: "Private Limited (Series B)",
    registration_type: "Private Limited · CIN & GSTIN Verified",
    size: "201-500",
    hq: "Bengaluru, Karnataka, India",
    address:
      "Level 9, Tower B, Prestige Tech Park, Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103",
    website: "https://super30.ai",
    established_year: 2019,
    about:
      "Super30 Technologies builds autonomous cloud infrastructure, AI-assisted code intelligence, and zero-trust observability tooling trusted by 450+ modern engineering organizations across India, Europe, and North America.\n\nOur platform processes over 18 billion CI/CD, container runtime, and telemetry events every month—helping product and platform teams cut deployment lead times by 64% while maintaining SOC 2 Type II and ISO 27001 reliability standards.\n\nWe run small, high-ownership engineering and product pods where builders own architecture end-to-end, contribute back to open source, and partner directly with customers without layers of bureaucracy.",
    mission:
      "Empowering global engineering teams to ship reliable software 10x faster through autonomous cloud workflows, zero-trust observability, and skill-verified engineering trust.",
    benefits: [
      "Comprehensive Family Health, Dental & Vision Insurance (₹15L Floater)",
      "₹1,20,000 Annual Learning, Cloud Lab & Conference Stipend",
      "Employee Stock Options (ESOPs) with Transparent Buyback Programs",
      "₹50,000 Home-Office Ergonomic Setup + Latest MacBook Pro M3",
      "Flexible Hybrid & Pan-India Remote Work Options",
      "26 Weeks Paid Parental Leave & Caregiver Support",
      "Quarterly Ship-Week Hackathons & Bi-Annual Team Offsites",
      "Paid Annual Recharge Week + Mental Wellness Coaching",
    ],
    culture_tags: [
      "Engineering-Led",
      "High Ownership",
      "Async & Low-Meeting",
      "Open-Source First",
      "Hybrid Flexibility",
      "Transparent Compensation",
      "Skill-Verified Hiring",
      "Inclusive Teams",
    ],
    locations: [
      "Bengaluru HQ — Bellandur, Outer Ring Road",
      "Chennai — OMR Tech Corridor, Perungudi",
      "Hyderabad — HITEC City, Madhapur",
      "Pune — Baner Balewadi High Street",
    ],
    hiring_regions: [
      "Pan-India Remote",
      "Bengaluru",
      "Chennai",
      "Hyderabad",
      "Pune",
      "Mumbai",
      "Delhi NCR",
    ],
    social_links: {
      linkedin: "https://www.linkedin.com/company/super30-technologies",
      github: "https://github.com/super30-ai",
      twitter: "https://x.com/super30_ai",
      youtube: "https://www.youtube.com/@super30engineering",
      instagram: "https://www.instagram.com/lifeatsuper30",
    },
    contact: {
      email: "careers@super30.ai",
      phone: "+91 80 4719 3030",
      alt_emails: ["talent-india@super30.ai", "campus-fellowship@super30.ai"],
      alt_phones: ["+91 98450 12345"],
    },
    active_jobs_count: 6,
    highlights: [
      {
        value: "340+",
        label: "Team Members",
        sub: "Across 4 engineering hubs & remote India",
      },
      {
        value: "98%",
        label: "48h Review Rate",
        sub: "Every CIR-verified applicant receives timely feedback",
      },
      {
        value: "$28M",
        label: "Series B Funded",
        sub: "450+ enterprise customers across 14 countries",
      },
      {
        value: "62+",
        label: "TalentCIR Hires",
        sub: "Verified engineers, analysts & product builders",
      },
    ],
    leadership: [
      {
        name: "Vikramaditya Menon",
        role: "Co-Founder & Chief Technology Officer",
        focus: "Distributed Systems, Cloud Runtime & Open-Source Architecture",
        photoUrl: expertMale2,
        linkedinUrl: "https://www.linkedin.com",
      },
      {
        name: "Ananya Raghavan",
        role: "VP of Engineering — AI & Developer Platform",
        focus: "Autonomous CI/CD Agents, LLM Evaluation & Platform Reliability",
        photoUrl: expertFemale2,
        linkedinUrl: "https://www.linkedin.com",
      },
      {
        name: "Meera Krishnan",
        role: "Head of Talent Acquisition & People Experience",
        focus: "Skill-First Hiring · TalentCIR Verified Fast-Track Lead",
        photoUrl: expertFemale4,
        linkedinUrl: "https://www.linkedin.com",
      },
    ],
    workplace_photos: [
      {
        imageUrl: employerTeamImg,
        alt: "Super30 Technologies engineering pod collaborating in Bengaluru headquarters",
        caption: "Bengaluru HQ — Autonomous product & platform engineering pods",
      },
      {
        imageUrl: employerAssessmentImg,
        alt: "Engineers reviewing architecture benchmarks during quarterly ship-week",
        caption: "Quarterly Ship-Week — Prototyping AI developer workflows from idea to production",
      },
      {
        imageUrl: employerCampusImg,
        alt: "New engineering cohort onboarding session at Super30 Technologies",
        caption: "TalentCIR Verified Cohort — Mentorship, architecture bootcamps & open-source Fridays",
      },
    ],
    hiring_steps: [
      {
        step: "01",
        title: "TalentCIR Skill & Profile Review",
        duration: "Within 24–48 hrs",
        description:
          "Direct review of your verified skills, projects, and CIR readiness score—no keyword-stuffed resume black holes.",
      },
      {
        step: "02",
        title: "Practical Domain Pairing",
        duration: "60 mins",
        description:
          "Hands-on architecture, code, or case collaboration on a realistic problem with a senior engineer or domain lead.",
      },
      {
        step: "03",
        title: "Systems Ownership & Team Fit",
        duration: "45 mins",
        description:
          "Candid conversation with the Hiring Manager on technical trade-offs, product impact, and career growth.",
      },
      {
        step: "04",
        title: "Transparent Offer & ESOP Walkthrough",
        duration: "48 hrs",
        description:
          "Clear base + ESOP breakdown, benefits overview, and a direct Q&A call with your future squad lead.",
      },
    ],
    jobs: [
      {
        id: "81001",
        title: "Senior React Developer",
        department: "Frontend Platform",
        location: "Bengaluru",
        mode: "Hybrid",
        type: "Full-time",
        experience: "3–6 yrs",
        salary: "₹18–30 LPA",
        skills: ["React", "TypeScript", "Next.js", "Node.js", "Design Systems"],
        summary:
          "Architect high-throughput React & TypeScript surfaces for real-time deployment pipelines, observability traces, and developer workflows.",
        postedAt: "3 days ago",
      },
      {
        id: "81003",
        title: "Cloud Platform Engineer",
        department: "Infrastructure & SRE",
        location: "Remote (India)",
        mode: "Remote",
        type: "Full-time",
        experience: "4–8 yrs",
        salary: "₹24–36 LPA",
        skills: ["AWS", "Kubernetes", "Terraform", "Go", "Prometheus"],
        summary:
          "Scale multi-region Kubernetes clusters, codify zero-downtime AWS infrastructure in Terraform, and drive 99.99% platform SLOs.",
        postedAt: "1 day ago",
      },
      {
        id: "81004",
        title: "Applied AI / LLM Systems Engineer",
        department: "AI Code Intelligence",
        location: "Bengaluru",
        mode: "Hybrid",
        type: "Full-time",
        experience: "3–7 yrs",
        salary: "₹28–44 LPA",
        skills: ["Python", "PyTorch", "RAG", "LLM Evaluation", "FastAPI"],
        summary:
          "Build low-latency retrieval, code-graph indexing, and deterministic evaluation harnesses powering autonomous pull-request agents.",
        postedAt: "2 days ago",
      },
      {
        id: "81002",
        title: "Product Data Analyst",
        department: "Business Intelligence",
        location: "Chennai",
        mode: "Hybrid",
        type: "Full-time",
        experience: "1–3 yrs",
        salary: "₹8–14 LPA",
        skills: ["SQL", "Python", "Tableau", "dbt", "Cohort Analysis"],
        summary:
          "Model enterprise adoption funnels in SQL & dbt, partner with product squads on experimentation, and automate executive telemetry boards.",
        postedAt: "2 days ago",
      },
      {
        id: "81005",
        title: "Senior Product Designer — Developer Experience",
        department: "Product Design",
        location: "Bengaluru / Remote",
        mode: "Hybrid",
        type: "Full-time",
        experience: "4–7 yrs",
        salary: "₹20–32 LPA",
        skills: ["Figma", "Design Systems", "UX Research", "Prototyping", "Accessibility"],
        summary:
          "Craft keyboard-first developer workflows, data-dense observability visualizations, and our multi-product component system.",
        postedAt: "4 days ago",
      },
      {
        id: "81006",
        title: "Product Marketing Manager — B2B SaaS",
        department: "Growth & GTM",
        location: "Mumbai / Bengaluru",
        mode: "Hybrid",
        type: "Full-time",
        experience: "3–6 yrs",
        salary: "₹16–26 LPA",
        skills: ["Product Positioning", "B2B SaaS", "Launch Strategy", "GA4", "HubSpot"],
        summary:
          "Own developer-first product launches, technical customer case studies, competitive positioning, and enterprise demand narratives.",
        postedAt: "5 days ago",
      },
    ],
  },
  {
    id: "showcase-razorpay",
    name: "Razorpay",
    slug: "razorpay",
    aliases: ["razorpay-software"],
    employer_code: "IAT-EMP-108412",
    tagline: "Full-Stack Financial Solutions Powering Digital Payments & Banking for Millions of Businesses",
    logo_url: "/company-logos/razorpay.svg",
    cover_url: employerRecruiterImg,
    verified: true,
    gstin_verified: true,
    industry: "FinTech & Financial Infrastructure",
    category: "Payments, Neo-Banking & B2B FinTech",
    company_type: "Private Limited",
    registration_type: "Private Limited · RBI Licensed PA",
    size: "1000+",
    hq: "Bengaluru, Karnataka, India",
    address: "SJR Cyber, Laskar Hosur Road, Adugodi, Bengaluru, Karnataka 560030",
    website: "https://razorpay.com",
    established_year: 2014,
    about:
      "Razorpay is India's leading full-stack financial solutions company enabling businesses to accept, process, and disburse payments across credit/debit cards, UPI, netbanking, and corporate credit lines with sub-second reliability.",
    mission:
      "Powering the financial ecosystem for disruptors with resilient, developer-friendly payment and banking rails.",
    benefits: [
      "Comprehensive Medical & Wellness Coverage",
      "ESOP Wealth Creation Program",
      "Annual Learning & Tech Budget",
      "Hybrid Engineering Flexibility",
    ],
    culture_tags: ["Customer Obsessed", "High Scale Systems", "FinTech Security", "Transparent Culture"],
    locations: ["Bengaluru HQ (Adugodi)", "Gurugram", "Mumbai"],
    hiring_regions: ["Bengaluru", "Gurugram", "Mumbai", "Hybrid India"],
    social_links: {
      linkedin: "https://www.linkedin.com/company/razorpay",
      github: "https://github.com/razorpay",
      twitter: "https://x.com/razorpay",
    },
    contact: {
      email: "careers@razorpay.com",
      phone: "+91 80 4666 9555",
      alt_emails: [],
      alt_phones: [],
    },
    active_jobs_count: 1,
    highlights: [
      { value: "10M+", label: "Partner Businesses", sub: "Across India & Southeast Asia" },
      { value: "99.99%", label: "Payment Uptime", sub: "High-throughput distributed ledger" },
    ],
    leadership: [],
    workplace_photos: [],
    hiring_steps: [],
    jobs: [
      {
        id: "seed-razorpay-1",
        title: "Backend Engineer",
        department: "Core Payments",
        location: "Bengaluru",
        mode: "Hybrid",
        type: "Full-time",
        experience: "3+ yrs",
        salary: "₹22–36 LPA",
        skills: ["Node.js", "Go", "PostgreSQL", "AWS", "Kafka"],
        summary: "Design ultra-reliable payment routing and settlement microservices at 10,000+ TPS.",
        postedAt: "3 days ago",
      },
    ],
  },
  {
    id: "showcase-zoho",
    name: "Zoho Corporation",
    slug: "zoho",
    aliases: ["zoho-corp", "zoho-corporation"],
    employer_code: "IAT-EMP-102904",
    tagline: "Cloud Software Suite & Operating System for Global Businesses",
    logo_url: "/company-logos/zoho.svg",
    cover_url: profileOfficeCover,
    verified: true,
    gstin_verified: true,
    industry: "Enterprise Cloud SaaS",
    category: "Business Applications & Cloud Productivity",
    company_type: "Private Limited",
    registration_type: "Private Limited · Bootstrapped Global Leader",
    size: "1000+",
    hq: "Chennai, Tamil Nadu, India",
    address: "Estancia IT Park, Plot No. 140 & 151, GST Road, Vallancheri, Chennai, Tamil Nadu 603202",
    website: "https://www.zoho.com",
    established_year: 1996,
    about:
      "Zoho builds 55+ deeply integrated cloud applications for sales, marketing, finance, HR, analytics, and engineering collaboration—serving over 100 million users globally while investing deeply in R&D and rural talent hubs.",
    mission:
      "Crafting enduring, privacy-first software engineered from first principles for businesses of every size.",
    benefits: [
      "Campus Meals & On-Site Medical Care",
      "Comprehensive Family Health Insurance",
      "Long-Term R&D Career Tracks",
      "Relocation & Commute Support",
    ],
    culture_tags: ["Long-Term R&D", "Privacy First", "Craftsmanship", "Skill Over Pedigree"],
    locations: ["Chennai HQ (Estancia)", "Tenkasi", "Madurai", "Coimbatore", "Bengaluru"],
    hiring_regions: ["Chennai", "Tenkasi", "Coimbatore", "Madurai", "Tamil Nadu"],
    social_links: {
      linkedin: "https://www.linkedin.com/company/zoho",
      twitter: "https://x.com/zoho",
    },
    contact: {
      email: "careers@zohocorp.com",
      phone: "+91 44 6744 7070",
      alt_emails: [],
      alt_phones: [],
    },
    active_jobs_count: 1,
    highlights: [
      { value: "100M+", label: "Global Users", sub: "Across 150+ countries" },
      { value: "55+", label: "Cloud Products", sub: "Built on proprietary R&D stack" },
    ],
    leadership: [],
    workplace_photos: [],
    hiring_steps: [],
    jobs: [
      {
        id: "seed-zoho-1",
        title: "Frontend Developer",
        department: "Web Platform",
        location: "Chennai",
        mode: "Hybrid",
        type: "Full-time",
        experience: "1–4 yrs",
        salary: "₹8–14 LPA",
        skills: ["React", "TypeScript", "CSS", "Web Performance"],
        summary: "Build fast, accessible collaborative web interfaces used by millions of teams daily.",
        postedAt: "2 days ago",
      },
    ],
  },
];

export function slugifyCompanyName(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function findShowcaseCompany(slugOrId: string): ShowcaseCompanyRecord | null {
  const clean = slugifyCompanyName(slugOrId);
  if (!clean) return null;
  return (
    SHOWCASE_COMPANIES.find(
      (c) =>
        c.id.toLowerCase() === slugOrId.trim().toLowerCase() ||
        c.slug === clean ||
        (c.aliases ?? []).includes(clean)
    ) ?? null
  );
}
