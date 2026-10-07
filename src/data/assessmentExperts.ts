import expertMale1 from "@/assets/experts/male-1.jpg";
import expertMale2 from "@/assets/experts/male-2.jpg";
import expertMale4 from "@/assets/experts/male-4.jpg";
import expertFemale1 from "@/assets/experts/female-1.jpg";
import expertFemale2 from "@/assets/experts/female-2.jpg";
import expertFemale3 from "@/assets/experts/female-3.jpg";

export interface ExpertRole {
  company: string;
  role: string;
  years: string;
}

export interface AssessmentExpert {
  name: string;
  title: string;
  company: string;
  experience: string;
  photo: string;
  bio: string;
  specialisation: string[];
  tools: string[];
  history: ExpertRole[];
  tests: string;
}

/** Same people and photos as the creator records in assessments.ts. */
export const DIGITAL_MARKETING_EXPERTS: AssessmentExpert[] = [
  {
    name: "Aarav Mehta",
    title: "Head of Growth",
    company: "Swiggy",
    experience: "9+ years",
    photo: expertMale1,
    bio: "Scaled paid and lifecycle channels for consumer apps across tier 1 and tier 2 cities.",
    specialisation: ["Performance Marketing", "Lifecycle", "Analytics"],
    tools: ["Google Ads", "Meta Ads", "GA4"],
    history: [
      { company: "Swiggy", role: "Head of Growth", years: "2021 - Present" },
      { company: "Flipkart", role: "Senior Growth Manager", years: "2018 - 2021" },
      { company: "Wipro", role: "Digital Marketing Analyst", years: "2015 - 2018" },
    ],
    tests: "Authored 40+ campaign planning questions",
  },
  {
    name: "Rohit Sen",
    title: "SEO Director",
    company: "HubSpot",
    experience: "11+ years",
    photo: expertMale2,
    bio: "Leads organic search and content programmes for B2B SaaS, from technical audits to topic authority.",
    specialisation: ["Technical SEO", "Content Strategy", "Link Building"],
    tools: ["Semrush", "Search Console", "WordPress"],
    history: [
      { company: "HubSpot", role: "SEO Director", years: "2020 - Present" },
      { company: "Zoho", role: "SEO Lead", years: "2016 - 2020" },
      { company: "Infosys", role: "Digital Strategist", years: "2013 - 2016" },
    ],
    tests: "Authored 35+ SEO and content questions",
  },
  {
    name: "Neha Kapoor",
    title: "Social Lead",
    company: "Cred",
    experience: "7+ years",
    photo: expertFemale2,
    bio: "Builds community-led social programmes and creator partnerships for fintech and lifestyle brands.",
    specialisation: ["Social Media", "Community", "Creator Marketing"],
    tools: ["Instagram", "YouTube", "Canva"],
    history: [
      { company: "Cred", role: "Social Lead", years: "2022 - Present" },
      { company: "Amazon", role: "Social Media Manager", years: "2019 - 2022" },
      { company: "TCS", role: "Content Marketer", years: "2017 - 2019" },
    ],
    tests: "Authored 30+ social and content questions",
  },
];

export const HR_DIGITAL_MARKETING_EXPERTS: AssessmentExpert[] = [
  {
    name: "Sneha Pillai",
    title: "Head of Talent",
    company: "Zerodha",
    experience: "9+ years",
    photo: expertFemale1,
    bio: "Hires growth and marketing teams, and designs skills-based screening for performance marketers.",
    specialisation: ["Marketing Hiring", "Skills-based Screening", "Employer Brand"],
    tools: ["LinkedIn", "Greenhouse", "Notion"],
    history: [
      { company: "Zerodha", role: "Head of Talent", years: "2021 - Present" },
      { company: "Razorpay", role: "Talent Acquisition Lead", years: "2018 - 2021" },
      { company: "Accenture", role: "Recruitment Consultant", years: "2015 - 2018" },
    ],
    tests: "Reviews hiring relevance of every marketing test",
  },
  {
    name: "Rahul Bhatia",
    title: "Senior HR Business Partner",
    company: "Flipkart",
    experience: "12+ years",
    photo: expertMale4,
    bio: "Partners with digital and brand marketing leaders on role design, levelling and interview panels.",
    specialisation: ["Role Levelling", "Interview Design", "Marketing Org Design"],
    tools: ["Workday", "Slack", "LinkedIn"],
    history: [
      { company: "Flipkart", role: "Senior HR Business Partner", years: "2019 - Present" },
      { company: "Amazon", role: "HR Manager", years: "2015 - 2019" },
      { company: "Capgemini", role: "HR Executive", years: "2012 - 2015" },
    ],
    tests: "Maps each test to real marketing job levels",
  },
  {
    name: "Divya Menon",
    title: "Recruitment Director",
    company: "Accenture",
    experience: "10+ years",
    photo: expertFemale3,
    bio: "Runs large-scale recruitment for digital agencies and in-house marketing teams, with a focus on fair assessment.",
    specialisation: ["Agency Hiring", "Assessment Fairness", "Campus to Lateral"],
    tools: ["LinkedIn Recruiter", "Lever", "HubSpot"],
    history: [
      { company: "Accenture", role: "Recruitment Director", years: "2020 - Present" },
      { company: "Infosys", role: "Talent Partner", years: "2016 - 2020" },
      { company: "IBM", role: "Recruiter", years: "2013 - 2016" },
    ],
    tests: "Audits question fairness and difficulty bands",
  },
];
