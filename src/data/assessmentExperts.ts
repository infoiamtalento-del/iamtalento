import expertMale1 from "@/assets/experts/male-1.jpg";
import expertMale2 from "@/assets/experts/male-2.jpg";
import expertMale3 from "@/assets/experts/male-3.jpg";
import expertMale4 from "@/assets/experts/male-4.jpg";
import expertMale5 from "@/assets/experts/male-5.jpg";
import expertMale6 from "@/assets/experts/male-6.jpg";
import expertFemale1 from "@/assets/experts/female-1.jpg";
import expertFemale2 from "@/assets/experts/female-2.jpg";
import expertFemale3 from "@/assets/experts/female-3.jpg";
import expertFemale4 from "@/assets/experts/female-4.jpg";
import expertFemale5 from "@/assets/experts/female-5.jpg";
import expertFemale6 from "@/assets/experts/female-6.jpg";

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
  {
    name: "Karan Malhotra",
    title: "Performance Marketing Lead",
    company: "Nykaa",
    experience: "8+ years",
    photo: expertMale5,
    bio: "Runs paid acquisition and retention for beauty and commerce brands, with a focus on ROAS and attribution.",
    specialisation: ["Paid Media", "Attribution", "Retention"],
    tools: ["Google Ads", "Meta Ads", "GA4"],
    history: [
      { company: "Nykaa", role: "Performance Marketing Lead", years: "2021 - Present" },
      { company: "Zomato", role: "Growth Marketing Manager", years: "2018 - 2021" },
      { company: "Infosys", role: "Digital Marketing Executive", years: "2016 - 2018" },
    ],
    tests: "Authored 30+ paid media and attribution questions",
  },
  {
    name: "Ananya Iyer",
    title: "Content and Brand Strategist",
    company: "Zomato",
    experience: "7+ years",
    photo: expertFemale4,
    bio: "Shapes brand voice and content calendars across channels, from long-form editorial to short social video.",
    specialisation: ["Content Strategy", "Brand Voice", "Email Marketing"],
    tools: ["WordPress", "Canva", "Mailchimp"],
    history: [
      { company: "Zomato", role: "Content and Brand Strategist", years: "2022 - Present" },
      { company: "Swiggy", role: "Senior Content Manager", years: "2019 - 2022" },
      { company: "Wipro", role: "Content Writer", years: "2017 - 2019" },
    ],
    tests: "Authored 25+ content and email questions",
  },
  {
    name: "Vikram Rao",
    title: "Head of Marketing Analytics",
    company: "Paytm",
    experience: "10+ years",
    photo: expertMale3,
    bio: "Builds measurement frameworks and dashboards that tie campaign spend to revenue for large consumer platforms.",
    specialisation: ["Marketing Analytics", "CRO", "Dashboards"],
    tools: ["GA4", "Looker Studio", "Hotjar"],
    history: [
      { company: "Paytm", role: "Head of Marketing Analytics", years: "2020 - Present" },
      { company: "Amazon", role: "Senior Analyst", years: "2016 - 2020" },
      { company: "TCS", role: "Business Analyst", years: "2013 - 2016" },
    ],
    tests: "Authored 35+ analytics and CRO questions",
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
  {
    name: "Priya Nair",
    title: "Talent Acquisition Manager",
    company: "Myntra",
    experience: "8+ years",
    photo: expertFemale5,
    bio: "Builds hiring pipelines for brand, content and performance marketing roles in fast-growing consumer companies.",
    specialisation: ["Pipeline Building", "Structured Interviews", "Offer Strategy"],
    tools: ["LinkedIn", "Greenhouse", "Notion"],
    history: [
      { company: "Myntra", role: "Talent Acquisition Manager", years: "2021 - Present" },
      { company: "Flipkart", role: "Senior Recruiter", years: "2018 - 2021" },
      { company: "TCS", role: "HR Executive", years: "2016 - 2018" },
    ],
    tests: "Checks that questions match real screening needs",
  },
  {
    name: "Arjun Khanna",
    title: "Head of People",
    company: "Razorpay",
    experience: "13+ years",
    photo: expertMale6,
    bio: "Leads people strategy for product and growth teams, including skills frameworks and promotion criteria for marketers.",
    specialisation: ["Skills Frameworks", "Team Design", "Performance Reviews"],
    tools: ["Workday", "Slack", "LinkedIn"],
    history: [
      { company: "Razorpay", role: "Head of People", years: "2020 - Present" },
      { company: "Paytm", role: "HR Director", years: "2016 - 2020" },
      { company: "Wipro", role: "HR Manager", years: "2012 - 2016" },
    ],
    tests: "Aligns test levels with promotion and hiring bands",
  },
  {
    name: "Meera Joshi",
    title: "Talent and Learning Lead",
    company: "PhonePe",
    experience: "9+ years",
    photo: expertFemale6,
    bio: "Connects hiring and upskilling for marketing teams, using assessments to find skill gaps and plan learning paths.",
    specialisation: ["Skill Gap Analysis", "Learning Paths", "Campus Hiring"],
    tools: ["LinkedIn", "Lever", "Notion"],
    history: [
      { company: "PhonePe", role: "Talent and Learning Lead", years: "2021 - Present" },
      { company: "Zomato", role: "Talent Partner", years: "2018 - 2021" },
      { company: "Infosys", role: "Recruiter", years: "2015 - 2018" },
    ],
    tests: "Reviews skill coverage and learning relevance",
  },
];
