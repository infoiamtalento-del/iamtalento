/**
 * Copy and data for Home 2. All text comes from the current home page
 * (hero, social proof, free benefits, CIR, readiness score, career
 * transformation, hackathon, reviews and closing call to action).
 */
import { BadgeCheck, Briefcase, FileBarChart2, Globe, ShieldCheck, Target, TrendingUp, Users } from "lucide-react";

import logoAccenture from "@/assets/company-logos/accenture.svg";
import logoAmazon from "@/assets/company-logos/amazon.svg";
import logoCapgemini from "@/assets/company-logos/capgemini.svg";
import logoGoogle from "@/assets/company-logos/google.svg";
import logoIbm from "@/assets/company-logos/ibm.svg";
import logoInfosys from "@/assets/company-logos/infosys.svg";
import logoMicrosoft from "@/assets/company-logos/microsoft.svg";
import logoOracle from "@/assets/company-logos/oracle.svg";
import logoTcs from "@/assets/company-logos/tcs.svg";
import logoWipro from "@/assets/company-logos/wipro.svg";
import logoMeta from "@/assets/logo-meta.svg";
import logoAws from "@/assets/logo-aws.svg";

import portraitRahul from "@/assets/learner-rahul.jpg";
import portraitPriya from "@/assets/learner-priya.jpg";
import portraitAnanya from "@/assets/learner-ananya.jpg";
import portraitVikram from "@/assets/learner-vikram.jpg";
import expert1 from "@/assets/expert-1.jpg";
import expert2 from "@/assets/expert-2.jpg";
import expert3 from "@/assets/expert-3.jpg";
import male1 from "@/assets/experts/male-1.jpg";
import male2 from "@/assets/experts/male-2.jpg";
import female1 from "@/assets/experts/female-1.jpg";
import female2 from "@/assets/experts/female-2.jpg";

export const photos = {
  portraitRahul,
  portraitPriya,
  portraitAnanya,
  portraitVikram,
  expert1,
  expert2,
  expert3,
  male1,
  male2,
  female1,
  female2,
};

export { default as freeFeaturesVisual } from "@/assets/free-features-visual.jpg";
export { default as hackathonHero } from "@/assets/hackathon-hero.jpg";
export { default as eventHackathon } from "@/assets/event-hackathon.jpg";
export { default as assessmentBanner } from "@/assets/assessment-banner.jpg";

/* Header ---------------------------------------------------------------- */

export const navLinks = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Assessments", href: "/assessments" },
  { label: "Learning", href: "/learning" },
  { label: "Pricing", href: "/pricing" },
  { label: "Events", href: "/meetups" },
  { label: "Resources", href: "/resources" },
  { label: "Talento Pro", href: "/pro" },
];

/* Hero ------------------------------------------------------------------ */

export const trustStrip = [
  { value: "5,00,000+", label: "Jobs Listed" },
  { value: "10,000+", label: "Candidates Screened" },
  { value: "99%", label: "Proctoring Accuracy" },
  { value: "73%", label: "Faster Hiring" },
];

export const heroBenefits = [
  { icon: ShieldCheck, title: "Verified Jobs", sub: "100% genuine opportunities" },
  { icon: Target, title: "Personalized Matches", sub: "Jobs that match your skills" },
  { icon: TrendingUp, title: "Your Career Edge", sub: "Insights to grow faster" },
];

export interface WheelSector {
  index: number;
  lines: string[];
}

/** Sector positions run clockwise from the top. Index 0 is just right of 12 o'clock. */
export const wheelSectors: WheelSector[] = [
  { index: 0, lines: ["Algorithms"] },
  { index: 1, lines: ["System", "Design"] },
  { index: 2, lines: ["Problem", "Solving"] },
  { index: 3, lines: ["Domain", "Knowledge"] },
  { index: 4, lines: ["Identity", "Check"] },
  { index: 5, lines: ["Secure", "Browser"] },
  { index: 6, lines: ["Integrity", "Score"] },
  { index: 7, lines: ["Aptitude"] },
  { index: 8, lines: ["Role Fit"] },
  { index: 9, lines: ["Communication"] },
  { index: 10, lines: ["Learning", "Agility"] },
  { index: 11, lines: ["Data", "Structures"] },
];

/* Trusted by ------------------------------------------------------------ */

export const logoWall = [
  { name: "Accenture", src: logoAccenture },
  { name: "Amazon", src: logoAmazon },
  { name: "Capgemini", src: logoCapgemini },
  { name: "Google", src: logoGoogle },
  { name: "IBM", src: logoIbm },
  { name: "Infosys", src: logoInfosys },
  { name: "Microsoft", src: logoMicrosoft },
  { name: "Oracle", src: logoOracle },
  { name: "TCS", src: logoTcs },
  { name: "Wipro", src: logoWipro },
  { name: "Meta", src: logoMeta },
  { name: "AWS", src: logoAws },
];

export const stats = [
  { icon: Briefcase, value: "5,00,000+", label: "Jobs listed", desc: "Verified roles from India's top companies" },
  { icon: Users, value: "10,000+", label: "Candidates screened", desc: "Skills-first, proctored hiring" },
  { icon: Globe, value: "99%", label: "Proctoring accuracy", desc: "Every shortlist arrives interview-ready" },
];

/* Readiness score (dark section) ----------------------------------------- */

export const readinessPoints = [
  "Technical skills evaluation",
  "Functional knowledge assessment",
  "Industry-specific competency mapping",
  "Problem-solving evaluation",
];

export const readinessScores = [
  { label: "Technical", score: 88 },
  { label: "Domain", score: 76 },
  { label: "Problem Solving", score: 92 },
  { label: "Communication", score: 71 },
];

/* Free benefits (platform grid) ------------------------------------------ */

export const benefits = [
  {
    title: "Industry Experts Resume Database",
    text: "Get discovered by recruiters who search verified, skill-ranked profiles instead of raw resumes.",
    href: "/jobs",
  },
  {
    title: "AI-Powered Resume Builder and Grader",
    text: "Build a recruiter-ready resume and see how it scores before you apply.",
    href: "/profile",
  },
  {
    title: "Real-Time Job Market Insight Alerts",
    text: "Know which skills and roles are rising, as the market moves.",
    href: "/jobs",
  },
  {
    title: "Skill-Based Automated Job Matching",
    text: "Jobs matched to your verified skills, benchmarked for fit and ready to apply.",
    href: "/jobs",
  },
  {
    title: "Application Tracking & Follow-Up",
    text: "Every application, status and follow-up in one place, so nothing slips.",
    href: "/dashboard",
  },
  {
    title: "Digital Portfolio with Custom URL",
    text: "A shareable portfolio that shows your work, scores and badges on your own link.",
    href: "/profile",
  },
  {
    title: "Free Access to AI Learning Courses",
    text: "Close skill gaps with guided AI learning paths, at no cost.",
    href: "/learning",
  },
  {
    title: "Freelancing & Gig Opportunities",
    text: "Pick up projects and gigs that match your skills while you build your career.",
    href: "/jobs",
  },
  {
    title: "Career Intelligence Report",
    text: "Discover your strengths, identify skill gaps and benchmark yourself against industry standards.",
    href: "/assessments",
  },
];

/* Career Intelligence Report --------------------------------------------- */

export const cirInside = [
  {
    title: "AI-Powered Skill Assessment",
    text: "A complete evaluation of your technical, functional and problem-solving abilities.",
  },
  { title: "Employability Score", text: "A single score that shows how ready you are for the roles you want." },
  { title: "Industry Benchmarking Report", text: "See where you stand against verified professionals in your field." },
  { title: "Salary Potential Report", text: "Understand the pay range your current skills can command." },
  { title: "Personalized Skill Gap Analysis", text: "Know exactly which skills to build next, in priority order." },
  { title: "Career Path Recommendation", text: "Role paths matched to your strengths and your market." },
  { title: "Interview Readiness Score", text: "Measure how prepared you are to convert interviews into offers." },
  { title: "Digital Skill Passport", text: "A verified record of your skills that employers can trust." },
];

export const questionOptions = ["Binary Search Tree", "Hash Map", "Linked List", "Stack"];

/* Career transformation -------------------------------------------------- */

export const transformations = [
  {
    name: "Ananya Iyer",
    role: "Performance Marketing Manager",
    from: "Wipro",
    city: "Bengaluru, India",
    before: "₹6 LPA",
    after: "₹18 LPA",
    gain: "+200%",
    photo: portraitAnanya,
    barFrom: 33,
  },
  {
    name: "Rohan Verma",
    role: "Senior Data Analyst",
    from: "Infosys",
    city: "Hyderabad, India",
    before: "₹8 LPA",
    after: "₹22 LPA",
    gain: "+175%",
    photo: portraitVikram,
    barFrom: 36,
  },
  {
    name: "Priya Nair",
    role: "Product Manager",
    from: "TCS",
    city: "Mumbai, India",
    before: "₹10 LPA",
    after: "₹28 LPA",
    gain: "+180%",
    photo: portraitPriya,
    barFrom: 36,
  },
];

/* Employers -------------------------------------------------------------- */

export const employers = [
  { name: "Google", logo: logoGoogle, rating: "4.5", reviews: "12.4K+", industry: "Software & Tech", tagline: "Organize the world's information.", openings: 340 },
  { name: "Microsoft", logo: logoMicrosoft, rating: "4.3", reviews: "18.2K+", industry: "Software & Tech", tagline: "Empowering every person on the planet.", openings: 285 },
  { name: "Amazon", logo: logoAmazon, rating: "3.9", reviews: "27.1K+", industry: "E-commerce & Retail", tagline: "Work hard. Have fun. Make history.", openings: 520 },
  { name: "Accenture", logo: logoAccenture, rating: "4.0", reviews: "41.3K+", industry: "Consulting", tagline: "Global professional services firm.", openings: 410 },
  { name: "TCS", logo: logoTcs, rating: "3.8", reviews: "55K+", industry: "IT Services", tagline: "Building on Belief.", openings: 680 },
  { name: "IBM", logo: logoIbm, rating: "4.0", reviews: "15.6K+", industry: "Software & Tech", tagline: "Let's create something that changes everything.", openings: 275 },
  { name: "Infosys", logo: logoInfosys, rating: "3.9", reviews: "29K+", industry: "IT Services", tagline: "Powered by intellect, driven by values.", openings: 445 },
  { name: "Oracle", logo: logoOracle, rating: "4.1", reviews: "9.8K+", industry: "Software & Tech", tagline: "Hardware and software, engineered to work together.", openings: 230 },
];

/* Hackathon -------------------------------------------------------------- */

export const hackathonPartners = [
  { name: "Google", domain: "google.com" },
  { name: "Microsoft", domain: "microsoft.com" },
  { name: "Amazon", domain: "amazon.com" },
  { name: "Razorpay", domain: "razorpay.com" },
  { name: "Flipkart", domain: "flipkart.com" },
  { name: "Swiggy", domain: "swiggy.com" },
  { name: "PhonePe", domain: "phonepe.com" },
  { name: "Infosys", domain: "infosys.com" },
  { name: "Walmart", domain: "walmart.com" },
  { name: "Deloitte", domain: "deloitte.com" },
];

export const prizes = [
  { label: "1st Place", value: "₹5,00,000", extra: "Fast-track interviews + Verified Badge + Feature" },
  { label: "2nd Place", value: "₹2,50,000", extra: "Interview Access + Badge" },
  { label: "3rd Place", value: "₹1,00,000", extra: "Badge" },
  { label: "Top 10", value: "Verified Badge", extra: "Employer Visibility + Certificate" },
  { label: "All Participants", value: "Certificate", extra: "Profile boost" },
];

/* Reviews ---------------------------------------------------------------- */

export interface Review {
  name: string;
  role: string;
  quote: string;
  group: "Employers" | "Candidates";
  photo: string;
}

export const reviews: Review[] = [
  {
    name: "Rajesh Mehta",
    role: "VP Talent Acquisition, Infosys",
    quote: "The Industry Readiness Score changed how we evaluate candidates. We now hire verified talent, not polished résumés.",
    group: "Employers",
    photo: male2,
  },
  {
    name: "Ananya Sharma",
    role: "Software Engineer",
    quote: "I took the assessment, earned my Verified Badge, and got 6 interview calls in 2 weeks. This platform actually works.",
    group: "Candidates",
    photo: female1,
  },
  {
    name: "David Park",
    role: "Head of HR, Series B Startup",
    quote: "Custom assessments with domain expert questions are game-changing. Our quality of hire improved 40% in Q1.",
    group: "Employers",
    photo: male1,
  },
  {
    name: "Priya Nair",
    role: "Fresher, B.Tech CS",
    quote: "As a fresher I had no way to prove my skills. The Readiness Score showed employers I was 'Above Market'. Got hired before classmates.",
    group: "Candidates",
    photo: portraitPriya,
  },
  {
    name: "Michael Torres",
    role: "CTO, Enterprise SaaS",
    quote: "We replaced 3 separate tools with Talento: resume screening, skill testing, and video interviews. All in one platform.",
    group: "Employers",
    photo: expert3,
  },
  {
    name: "Kavitha Rao",
    role: "CPO, Freshworks",
    quote: "Bias-free screening and EEOC compliance gave our board confidence. Real-time pipeline visibility I've never had before.",
    group: "Employers",
    photo: female2,
  },
  {
    name: "Arjun Desai",
    role: "Engineering Manager, Flipkart",
    quote: "AI proctoring with code playback analysis eliminated cheating entirely. We trust every single assessment result now.",
    group: "Employers",
    photo: portraitRahul,
  },
  {
    name: "Sara Khan",
    role: "Data Analyst, Career Switcher",
    quote: "The personalized growth roadmap showed me exactly what to learn. Within a month my score jumped from 62 to 89.",
    group: "Candidates",
    photo: expert2,
  },
];

/* Closing call to action -------------------------------------------------- */

export const expectations = [
  "Measure your Industry Readiness Score",
  "Benchmark against 50,000+ verified professionals",
  "Earn a Verified Skill Badge",
  "Download a sample Career Intelligence Report",
];

export const compliance = ["SOC 2 Type II", "GDPR Compliant", "EEOC Compliant", "ISO 27001"];

/* Footer ----------------------------------------------------------------- */

export const footerColumns = [
  {
    title: "For Employers",
    links: [
      { label: "AI Screening", href: "/features" },
      { label: "Custom Assessments", href: "/features" },
      { label: "Hiring Dashboard", href: "/dashboard" },
      { label: "Enterprise", href: "/contact" },
    ],
  },
  {
    title: "For Candidates",
    links: [
      { label: "Talento Pro Portal", href: "/pro" },
      { label: "Take Assessment", href: "/assessments/explore" },
      { label: "Industry Readiness Score", href: "/features" },
      { label: "Verified Skill Badge", href: "/features" },
      { label: "Find Jobs", href: "/jobs" },
      { label: "Sample Report", href: "/assessments" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Docs", href: "/docs" },
      { label: "Changelog", href: "/changelog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "GDPR", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
];

export const iconSet = { FileBarChart2, BadgeCheck };
