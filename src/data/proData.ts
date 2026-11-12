export interface ProJob {
  id: number;
  description?: string;
  t: string; // title
  c: string; // company
  l: string; // location
  m: "Remote" | "Hybrid" | "Onsite"; // work mode
  ty: "Full-time" | "Internship" | "Contract"; // type
  e: number; // min exp yrs
  a: number; // salary min LPA
  b: number; // salary max LPA
  sk: string[]; // skills
  at: number; // timestamp
  by: string; // author email
}

export interface ProCandidate {
  n: string; // name
  c: string; // city
  x: number; // experience
  sk: string[]; // skills
  ce: string[]; // certifications
  as: Record<string, number>; // assessments { React: 88 }
  nt: number; // notice period days
  es: number; // expected salary LPA
  wp: "Remote" | "Hybrid" | "Onsite"; // work pref
  verified?: boolean; // verified candidate status
  cirScore?: number; // Talento CIR index e.g. 96
  cirId?: string; // verified CIR id e.g. CIR-BLR-8941
  headline?: string;
  phone?: string;
  email?: string;
  currentCompany?: string; // e.g. "Razorpay"
  previousCompany?: string; // e.g. "ex-Zoho"
  currentSalary?: number; // current LPA
  education?: string; // e.g. "BITS Pilani · B.Tech CS"
  github?: string;
  linkedin?: string;
  portfolio?: string;
  highlight?: string;
  statusBadge?: string; // "Actively Interviewing", "Immediate Joiner"
  verifiedBadges?: string[];
}

export interface ProApplication {
  id: number;
  jid: number;
  who: string;
  name: string;
  exp: number;
  sk: string[];
  ce?: string[];
  as?: Record<string, number>;
  st: "Applied" | "Shortlisted" | "Interview" | "Offer" | "Rejected";
  at: number;
  cn?: string; // cover note
  note?: string; // recruiter private note
  iv?: string; // interview date
  vw?: number; // viewed
  upd?: { msg: string; at: number; auto?: boolean }[];
}

export interface ProUser {
  email: string;
  pw?: string;
  role: "candidate" | "employer";
  name: string;
  exp?: number;
  city?: string;
  state?: string;
  cl?: string;
  pemail?: string;
  sk?: string[];
  fsk?: string[];
  head?: string;
  tag?: string;
  about?: string;
  saved?: number[];
  skip?: number[];
  inv?: string[];
  tal?: string[];
  unlockedCandidates?: string[];
  ss?: { n: string; f: any }[];
  ex?: { co: string; role: string; fr: string; to: string; d: string }[];
  ed?: { sc: string; dg: string; yr: string }[];
  ce?: string[];
  pj?: { t: string; l?: string; d?: string; s?: string; m?: string }[];
  lg?: { n: string; lv: string }[];
  sl?: Record<string, string>; // skill levels
  pf?: {
    sal?: number;
    np?: number;
    wm?: string;
    ty?: string;
    loc?: string;
    rl?: boolean;
  };
  st?: string; // "Actively looking" | "Open to offers" | "Not looking"
  views?: number;
  as?: Record<string, number>;
  seen?: number;
  ph?: string;
  phv?: boolean;
  phone?: string;
  twoFactor?: boolean;
  twoFactorMethod?: "authenticator" | "sms";
  twoFactorPhone?: string;
  privacyVisibility?: "public" | "applied_only" | "private";
  emailAlerts?: boolean;
  smsAlerts?: boolean;
  marketingEmails?: boolean;
  loginAlerts?: boolean;
  passwordLastChanged?: number;
  gst?: string;
  vr?: { at: number; id: string };
  ver?: { id: boolean; test: boolean; exp: boolean };
  wal?: {
    bal: number;
    pm?: { id: number; type: string; label: string; sub?: string; def?: boolean }[];
    tx?: { id: string; at: number; type: "credit" | "debit"; amt: number; desc: string; via: string; st?: string; bal?: number; reason?: string }[];
    hist?: { id: string; at: number; type: "credit" | "debit"; amt: number; desc: string; via: string; st?: string; bal?: number; reason?: string }[];
  };
  cp?: {
    name?: string;
    about?: string;
    mission?: string;
    ind?: string;
    size?: string;
    hq?: string;
    site?: string;
    ben?: string[];
  };
  rs?: {
    tpl?: string;
    role?: string;
    tone?: string;
    lvl?: string;
    sum?: string;
    ex?: string[][];
    sk?: string[] | null;
    skl?: string[] | null;
    bi?: { name?: string; em?: string; ph?: string; city?: string; li?: string; pf?: string; gh?: string };
    ed?: { sc: string; dg: string; yr: string }[];
    lg?: { n: string; lv: string }[];
    ac?: string;
    inc?: Record<string, boolean>;
    pjOff?: number[];
    cover?: string;
  };
  links?: { li?: string; gh?: string; pf?: string };
}

export const D_MS = 86400000;
export const STAGES = ["Applied", "Shortlisted", "Interview", "Offer", "Rejected"] as const;

export const SEED_JOBS_RAW: [string, string, string, "Remote" | "Hybrid" | "Onsite", "Full-time" | "Internship" | "Contract", number, number, number, string[], number][] = [
  ["Frontend Developer", "Zoho", "Chennai", "Hybrid", "Full-time", 1, 8, 14, ["React", "TypeScript", "CSS"], 2],
  ["Data Analyst", "Flipkart", "Bengaluru", "Onsite", "Full-time", 1, 9, 15, ["SQL", "Python", "Tableau"], 1],
  ["Backend Engineer", "Razorpay", "Bengaluru", "Hybrid", "Full-time", 3, 22, 36, ["Node.js", "PostgreSQL", "AWS"], 3],
  ["Product Designer", "Swiggy", "Bengaluru", "Hybrid", "Full-time", 3, 18, 28, ["Figma", "UX Research"], 5],
  ["Software Trainee", "Infosys", "Pune", "Onsite", "Full-time", 0, 4, 5, ["Java", "DSA"], 8],
  ["DevOps Engineer", "Atlassian", "Remote", "Remote", "Full-time", 3, 20, 32, ["Kubernetes", "Terraform", "AWS"], 4],
  ["ML Engineer", "Google", "Bengaluru", "Hybrid", "Full-time", 3, 25, 45, ["Python", "PyTorch", "MLOps"], 6],
  ["Full Stack Intern", "Postman", "Remote", "Remote", "Internship", 0, 4, 5, ["React", "Node.js"], 0],
  ["Engineering Manager", "PhonePe", "Bengaluru", "Onsite", "Full-time", 7, 50, 70, ["Leadership", "System Design"], 12],
  ["Content Writer", "Unacademy", "Remote", "Remote", "Contract", 0, 3, 5, ["Writing", "SEO"], 9],
  ["Software Engineer II", "Amazon", "Hyderabad", "Hybrid", "Full-time", 3, 28, 45, ["Java", "AWS", "System Design"], 1],
  ["Cloud Solutions Architect", "Microsoft", "Bengaluru", "Hybrid", "Full-time", 6, 40, 65, ["Azure", "System Design", "Leadership"], 2],
  ["Creative Cloud Engineer", "Adobe", "Noida", "Hybrid", "Full-time", 2, 20, 34, ["React", "TypeScript", "Node.js"], 3],
  ["Data Scientist", "Uber", "Bengaluru", "Onsite", "Full-time", 3, 26, 42, ["Python", "SQL", "PyTorch"], 2],
  ["Product Analyst", "Paytm", "Noida", "Onsite", "Full-time", 1, 10, 16, ["SQL", "Tableau", "Python"], 4],
  ["Android Developer", "Zomato", "Gurugram", "Hybrid", "Full-time", 2, 16, 28, ["Kotlin", "Java"], 1],
  ["Backend Engineer", "Spotify", "Remote", "Remote", "Full-time", 4, 35, 55, ["Java", "Kubernetes", "PostgreSQL"], 6],
  ["Systems Engineer", "Wipro", "Chennai", "Onsite", "Full-time", 0, 3.5, 5, ["Java", "SQL"], 5],
  ["Business Technology Analyst", "Accenture", "Pune", "Hybrid", "Full-time", 1, 6, 10, ["SQL", "Excel"], 3],
  ["Digital Associate", "TCS", "Mumbai", "Onsite", "Full-time", 0, 3.6, 5.5, ["Java", "DSA"], 7],
];

export const CANDIDATES_SEED: ProCandidate[] = [
  {
    n: "Aarav Mehta",
    c: "Bengaluru",
    x: 4.2,
    sk: ["React 19", "TypeScript", "Next.js", "Redux Toolkit", "Tailwind CSS", "GraphQL", "Webpack"],
    ce: ["Meta Certified Frontend Engineer", "AWS Certified Developer"],
    as: { "React Architecture": 95, "TypeScript Core": 92, "Web Performance": 90, "System Design": 88 },
    nt: 15,
    es: 26,
    wp: "Hybrid",
    verified: true,
    cirScore: 97,
    cirId: "CIR-BLR-8941",
    headline: "Senior Frontend Engineer @ Razorpay · ex-Zoho",
    currentCompany: "Razorpay",
    previousCompany: "ex-Zoho",
    currentSalary: 21,
    education: "BITS Pilani · B.Tech Computer Science (2020)",
    github: "github.com/aarav-mehta",
    linkedin: "linkedin.com/in/aaravmehta-tech",
    portfolio: "aaravmehta.dev",
    highlight: "Architected Razorpay's high-speed checkout flow processing 14k TPS; slashed client bundle size by 38%.",
    statusBadge: "Actively Interviewing",
    phone: "+91 98401 23456",
    email: "aarav.mehta@talento-verified.io",
    verifiedBadges: ["Identity Verified", "UAN Employment Verified", "Proctored Code Check: 0% Plagiarism"],
  },
  {
    n: "Sneha Iyer",
    c: "Remote",
    x: 6.5,
    sk: ["Kubernetes (EKS)", "Terraform", "AWS Solutions", "Docker", "ArgoCD", "Golang", "Prometheus"],
    ce: ["AWS Solutions Architect - Pro", "Certified Kubernetes Admin (CKA)", "HashiCorp Terraform Associate"],
    as: { "Cloud Architecture": 98, "Kubernetes Orchestration": 96, "CI/CD & IaC": 95, "Linux & Security": 93 },
    nt: 30,
    es: 42,
    wp: "Remote",
    verified: true,
    cirScore: 99,
    cirId: "CIR-BLR-9921",
    headline: "Staff Cloud & DevOps Architect @ BrowserStack · ex-ThoughtWorks",
    currentCompany: "BrowserStack",
    previousCompany: "ex-ThoughtWorks",
    currentSalary: 34,
    education: "RV College of Engineering · B.E. Information Science (2018)",
    github: "github.com/snehaiyer-cloud",
    linkedin: "linkedin.com/in/snehaiyer-devops",
    portfolio: "snehaiyer.io",
    highlight: "Built multi-region Kubernetes platform across 3 AWS regions with 99.99% SLA uptime.",
    statusBadge: "Serving Notice · Available in 30d",
    phone: "+91 98404 56789",
    email: "sneha.iyer@talento-verified.io",
    verifiedBadges: ["Identity Verified", "UAN Employment Verified", "Proctored Infra Lab Passed"],
  },
  {
    n: "Arjun Rao",
    c: "Bengaluru",
    x: 8.0,
    sk: ["Golang", "Java", "PostgreSQL", "Apache Kafka", "Redis", "Distributed Systems", "gRPC"],
    ce: ["AWS Certified Developer Associate", "Confluent Certified Kafka Developer"],
    as: { "Distributed Systems": 98, "Database Concurrency": 96, "Kafka & Event Streams": 95, "Low-Latency APIs": 94 },
    nt: 30,
    es: 58,
    wp: "Hybrid",
    verified: true,
    cirScore: 99,
    cirId: "CIR-BLR-7703",
    headline: "Principal Backend Engineer & Architect @ Swiggy · ex-Flipkart",
    currentCompany: "Swiggy",
    previousCompany: "ex-Flipkart",
    currentSalary: 48,
    education: "IIT Madras · B.Tech Computer Science (2016)",
    github: "github.com/arjunrao-backend",
    linkedin: "linkedin.com/in/arjunrao-swiggy",
    highlight: "Designed Swiggy's real-time order dispatch engine handling 250k concurrent orders per minute during IPL peaks.",
    statusBadge: "Open to Offers · Ready to Join",
    phone: "+91 98407 89012",
    email: "arjun.rao@talento-verified.io",
    verifiedBadges: ["Identity Verified", "UAN Employment Verified", "Top 1% Engineering Rank"],
  },
  {
    n: "Kabir Shah",
    c: "Hyderabad",
    x: 3.5,
    sk: ["Python", "PyTorch", "HuggingFace", "FastAPI", "Docker", "Vector DBs (Pinecone/Milvus)", "MLOps"],
    ce: ["TensorFlow Certified Developer", "DeepLearning.AI Generative AI Specialist"],
    as: { "Machine Learning": 95, "PyTorch & Transformers": 93, "Model Serving & MLOps": 91, "Python Algorithms": 94 },
    nt: 15,
    es: 32,
    wp: "Hybrid",
    verified: true,
    cirScore: 96,
    cirId: "CIR-HYD-5512",
    headline: "Senior ML & PyTorch Engineer @ PhonePe · ex-InMobi",
    currentCompany: "PhonePe",
    previousCompany: "ex-InMobi",
    currentSalary: 26,
    education: "IIIT Hyderabad · Dual Degree B.Tech + M.Tech AI (2021)",
    github: "github.com/kabirshah-ml",
    linkedin: "linkedin.com/in/kabirshah-ai",
    highlight: "Fine-tuned multilingual LLMs for voice-based fraud anomaly detection with 99.2% precision.",
    statusBadge: "Immediate Joiner",
    phone: "+91 98405 67890",
    email: "kabir.shah@talento-verified.io",
    verifiedBadges: ["Identity Verified", "UAN Employment Verified", "Verified PyTorch Benchmark"],
  },
  {
    n: "Diya Nair",
    c: "Chennai",
    x: 3.0,
    sk: ["SQL (Advanced)", "Python", "Tableau", "Snowflake", "dbt", "Power BI", "A/B Testing"],
    ce: ["Google Advanced Data Analytics", "Snowflake SnowPro Core Certified"],
    as: { "SQL Query Tuning": 96, "Data Modeling & dbt": 94, "BI & Dashboard UX": 92, "Statistical Analysis": 90 },
    nt: 0,
    es: 17,
    wp: "Onsite",
    verified: true,
    cirScore: 95,
    cirId: "CIR-CHN-4402",
    headline: "Lead Analytics & BI Specialist @ Flipkart · ex-Mu Sigma",
    currentCompany: "Flipkart",
    previousCompany: "ex-Mu Sigma",
    currentSalary: 13,
    education: "Anna University · B.Tech Information Technology (2021)",
    github: "github.com/diyanair-analytics",
    linkedin: "linkedin.com/in/diyanair-data",
    highlight: "Built automated inventory replenishment pipeline reducing Flipkart warehouse stockouts by 22%.",
    statusBadge: "Immediate Joiner · Zero Notice",
    phone: "+91 98402 34567",
    email: "diya.nair@talento-verified.io",
    verifiedBadges: ["Identity Verified", "UAN Employment Verified", "SQL Proctored Score: 96%"],
  },
  {
    n: "Meera Pillai",
    c: "Mumbai",
    x: 5.2,
    sk: ["Figma", "Design Systems", "UX Research", "Mobile Prototyping", "Interaction Design", "Usability Testing"],
    ce: ["Google UX Design Professional", "Nielsen Norman Group UX Master Certified"],
    as: { "Product UX Architecture": 97, "Visual Design Systems": 95, "Usability & Accessibility": 94 },
    nt: 30,
    es: 34,
    wp: "Hybrid",
    verified: true,
    cirScore: 96,
    cirId: "CIR-BOM-3319",
    headline: "Senior Product Designer & Design Systems Lead @ CRED · ex-Urban Company",
    currentCompany: "CRED",
    previousCompany: "ex-Urban Company",
    currentSalary: 28,
    education: "National Institute of Design (NID) Ahmedabad · B.Des (2019)",
    portfolio: "meerapillai.design",
    linkedin: "linkedin.com/in/meerapillai-ux",
    highlight: "Led CRED's travel rewards design overhaul; boosted checkout conversion rate by 19%.",
    statusBadge: "Actively Interviewing",
    phone: "+91 98406 78901",
    email: "meera.pillai@talento-verified.io",
    verifiedBadges: ["Identity Verified", "Portfolio Authenticated", "Top 5% Design Rating"],
  },
  {
    n: "Nikhil Kumar",
    c: "Bengaluru",
    x: 4.8,
    sk: ["React", "Node.js", "TypeScript", "GraphQL", "PostgreSQL", "Redis", "Docker"],
    ce: ["Meta Full-Stack Engineer", "Apollo GraphQL Professional"],
    as: { "Full Stack Engineering": 95, "API Architecture": 94, "Database Schema Design": 91, "State Management": 93 },
    nt: 15,
    es: 30,
    wp: "Hybrid",
    verified: true,
    cirScore: 97,
    cirId: "CIR-BLR-6612",
    headline: "Full Stack Engineer @ Postman · ex-Freshworks",
    currentCompany: "Postman",
    previousCompany: "ex-Freshworks",
    currentSalary: 24,
    education: "NIT Karnataka, Surathkal · B.Tech Computer Engineering (2019)",
    github: "github.com/nikhilkumar-dev",
    linkedin: "linkedin.com/in/nikhilkumar-postman",
    highlight: "Developed real-time collaborative workspace features used by 1.8M developers daily on Postman.",
    statusBadge: "15 Days Notice Period",
    phone: "+91 98411 23456",
    email: "nikhil.kumar@talento-verified.io",
    verifiedBadges: ["Identity Verified", "UAN Employment Verified", "Full Stack Assessment: 95%"],
  },
  {
    n: "Tanvi Gupta",
    c: "Delhi NCR",
    x: 3.8,
    sk: ["React Native", "Swift", "TypeScript", "iOS SDK", "Redux", "Mobile Performance", "JSI"],
    ce: ["Apple iOS Certified Developer", "Meta React Native Specialization"],
    as: { "Mobile App Architecture": 94, "React Native Performance": 95, "Native iOS Bridges": 91 },
    nt: 15,
    es: 25,
    wp: "Hybrid",
    verified: true,
    cirScore: 95,
    cirId: "CIR-DEL-8821",
    headline: "Mobile Engineer (React Native & iOS) @ Zomato · ex-Paytm",
    currentCompany: "Zomato",
    previousCompany: "ex-Paytm",
    currentSalary: 20,
    education: "Delhi Technological University (DTU) · B.E. Computer Science (2020)",
    github: "github.com/tanvigupta-mobile",
    linkedin: "linkedin.com/in/tanvigupta-zomato",
    highlight: "Reduced cold launch time of food delivery app by 440ms; maintained 99.94% crash-free sessions.",
    statusBadge: "Actively Interviewing",
    phone: "+91 98412 34567",
    email: "tanvi.gupta@talento-verified.io",
    verifiedBadges: ["Identity Verified", "UAN Employment Verified", "App Store Proven Track Record"],
  },
  {
    n: "Rohan Das",
    c: "Pune",
    x: 1.2,
    sk: ["Java", "Spring Boot", "MySQL", "REST APIs", "Git", "DSA"],
    ce: ["Oracle Java SE Certified Associate"],
    as: { Java: 74, DSA: 78, "Spring Boot": 72 },
    nt: 0,
    es: 8.5,
    wp: "Onsite",
    verified: false,
    cirScore: 78,
    headline: "Junior Backend Engineer @ Infosys · Immediate Joiner",
    currentCompany: "Infosys",
    currentSalary: 5.5,
    education: "COEP Pune · B.Tech Computer Engineering (2023)",
    highlight: "Contributed to banking microservices migration; optimized SQL stored procedures for 25% faster batch execution.",
    statusBadge: "Immediate Joiner · Open Talent Pool",
    phone: "+91 98403 45678",
    email: "rohan.das@example.com",
  },
  {
    n: "Priya Menon",
    c: "Chennai",
    x: 2.0,
    sk: ["React", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Redux Toolkit"],
    ce: ["HackerRank React Certified"],
    as: { React: 76, CSS: 85, JavaScript: 75 },
    nt: 15,
    es: 10,
    wp: "Remote",
    verified: false,
    cirScore: 76,
    headline: "Frontend Developer @ Cognizant · Clean UI & Responsive Design",
    currentCompany: "Cognizant",
    currentSalary: 6.8,
    education: "SRM University · B.Tech IT (2022)",
    highlight: "Developed responsive customer self-service portals across web & tablet viewports with 98% accessibility score.",
    statusBadge: "Available in 15d · Open Talent Pool",
    phone: "+91 98408 90123",
    email: "priya.menon@example.com",
  },
  {
    n: "Vikram Sharma",
    c: "Noida",
    x: 2.5,
    sk: ["MongoDB", "Express.js", "React", "Node.js", "Next.js", "REST APIs"],
    ce: ["Coursera Full Stack MERN Specialization"],
    as: { "Node.js": 78, MongoDB: 74, React: 76 },
    nt: 30,
    es: 12,
    wp: "Hybrid",
    verified: false,
    cirScore: 74,
    headline: "Full Stack Developer @ Wipro Digital · MERN Stack",
    currentCompany: "Wipro",
    currentSalary: 7.2,
    education: "Amity University · B.Tech CSE (2022)",
    highlight: "Built internal supply-chain dashboard with role-based auth; integrated payment webhooks.",
    statusBadge: "Open to Offers · Open Talent Pool",
    phone: "+91 98409 01234",
    email: "vikram.sharma@example.com",
  },
  {
    n: "Ananya Sen",
    c: "Kolkata",
    x: 3.2,
    sk: ["Python", "Selenium WebDriver", "Playwright", "Cypress", "Postman", "CI/CD (Jenkins)"],
    ce: ["ISTQB Certified Tester Foundation Level"],
    as: { "Test Automation": 84, Python: 80, "API Testing": 82 },
    nt: 15,
    es: 14,
    wp: "Remote",
    verified: false,
    cirScore: 79,
    headline: "QA Automation Engineer @ Tech Mahindra · Web & API Testing",
    currentCompany: "Tech Mahindra",
    currentSalary: 8.5,
    education: "Jadavpur University · B.Tech ECE (2021)",
    highlight: "Automated regression test suite of 450+ tests using Playwright & Python; cut test cycle from 18h to 2.5h.",
    statusBadge: "15 Days Notice · Open Talent Pool",
    phone: "+91 98410 12345",
    email: "ananya.sen@example.com",
  },
  {
    n: "Harsh Vardhan",
    c: "Pune",
    x: 2.8,
    sk: ["Java", "Spring Boot", "Microservices", "PostgreSQL", "Kafka", "Docker"],
    ce: ["Oracle Certified Professional Java SE"],
    as: { "Java Core": 82, "Spring Boot": 80, "SQL": 78 },
    nt: 30,
    es: 11,
    wp: "Hybrid",
    verified: false,
    cirScore: 81,
    headline: "Backend Engineer @ TCS Digital · Core Java & Spring Boot",
    currentCompany: "TCS",
    currentSalary: 7.0,
    education: "Symbiosis Institute of Technology · B.Tech CS (2022)",
    highlight: "Developed REST APIs for insurance claims processing with 99.8% uptime; implemented JWT role authentication.",
    statusBadge: "30 Days Notice · Open Talent Pool",
    phone: "+91 98413 45678",
    email: "harsh.vardhan@example.com",
  },
  {
    n: "Sanya Rao",
    c: "Hyderabad",
    x: 3.0,
    sk: ["Figma", "UI Design", "User Research", "Wireframing", "Adobe XD", "Design Systems"],
    ce: ["Coursera Google UX Design"],
    as: { "UI Design": 85, "Wireframing": 82, "Prototyping": 80 },
    nt: 15,
    es: 12,
    wp: "Hybrid",
    verified: false,
    cirScore: 80,
    headline: "Product UI/UX Designer @ Mindtree · Mobile & Web Interfaces",
    currentCompany: "Mindtree",
    currentSalary: 8.0,
    education: "Osmania University · B.Tech IT (2021)",
    highlight: "Redesigned customer onboarding flow for enterprise logistics client, increasing conversion by 24%.",
    statusBadge: "15 Days Notice · Open Talent Pool",
    phone: "+91 98414 56789",
    email: "sanya.rao@example.com",
  },
  {
    n: "Devansh Chawla",
    c: "Gurugram",
    x: 2.2,
    sk: ["Docker", "Linux", "AWS (EC2/S3)", "GitHub Actions", "Python", "Bash"],
    ce: ["AWS Certified Cloud Practitioner"],
    as: { "Cloud & Linux": 80, "CI/CD Pipelines": 78, "Scripting": 76 },
    nt: 15,
    es: 10,
    wp: "Onsite",
    verified: false,
    cirScore: 78,
    headline: "DevOps Engineer @ Capgemini · Cloud Infrastructure & CI/CD",
    currentCompany: "Capgemini",
    currentSalary: 6.5,
    education: "IP University Delhi · B.Tech CSE (2022)",
    highlight: "Implemented automated GitHub Actions deployment pipelines for 8 microservices, saving 4 hours per release.",
    statusBadge: "15 Days Notice · Open Talent Pool",
    phone: "+91 98415 67890",
    email: "devansh.chawla@example.com",
  },
  {
    n: "Pooja Kulkarni",
    c: "Bengaluru",
    x: 2.6,
    sk: ["SQL", "Power BI", "Excel Advanced", "Python (Pandas)", "Tableau"],
    ce: ["Microsoft Power BI Data Analyst Associate (PL-300)"],
    as: { "SQL Analytics": 84, "Power BI": 82, "Data Visualization": 80 },
    nt: 0,
    es: 11.5,
    wp: "Hybrid",
    verified: false,
    cirScore: 81,
    headline: "Data Analyst @ L&T Technology Services · BI Dashboards",
    currentCompany: "L&T",
    currentSalary: 7.5,
    education: "VTU Belagavi · B.E. Computer Science (2022)",
    highlight: "Built operational KPI dashboards in Power BI tracking regional delivery times across 12 zones.",
    statusBadge: "Immediate Joiner · Zero Notice",
    phone: "+91 98416 78901",
    email: "pooja.kulkarni@example.com",
  },
];

export const COMPANY_INFO: Record<string, [string, string]> = {
  Zoho: ["SaaS", "Large"],
  Flipkart: ["E-commerce", "Large"],
  Razorpay: ["Fintech", "Mid"],
  Swiggy: ["Food Tech", "Large"],
  Infosys: ["IT Services", "Enterprise"],
  Freshworks: ["SaaS", "Large"],
  "Ola Krutrim": ["AI", "Startup"],
  Postman: ["Dev Tools", "Mid"],
  PhonePe: ["Fintech", "Large"],
  Unacademy: ["EdTech", "Mid"],
  Amazon: ["E-commerce", "Enterprise"],
  Microsoft: ["Software", "Enterprise"],
  Adobe: ["Software", "Large"],
  Uber: ["Mobility", "Large"],
  Paytm: ["Fintech", "Large"],
  Zomato: ["Food Tech", "Large"],
  Spotify: ["Media", "Large"],
  Wipro: ["IT Services", "Enterprise"],
  Accenture: ["IT Services", "Enterprise"],
  TCS: ["IT Services", "Enterprise"],
  Google: ["Software", "Enterprise"],
  Atlassian: ["SaaS", "Large"],
  Super30: ["Fintech", "Mid"],
};

export const DEFAULT_USERS: Record<string, ProUser> = {
  "demo.candidate@talento.app": {
    email: "demo.candidate@talento.app",
    role: "candidate",
    name: "Yogesh",
    exp: 2.5,
    city: "Bengaluru",
    head: "Frontend Developer · React · 2.5 yrs",
    about: "Frontend developer with 2.5+ years of experience in building scalable and responsive web applications using React and modern web technologies. Passionate about clean code, performance optimization and creating great user experiences.",
    sk: [
      "React", "Next.js", "Node.js", "JavaScript", "TypeScript", "Python",
      "Express.js", "MongoDB", "PostgreSQL", "MySQL", "Tailwind CSS",
      "HTML5", "CSS3", "Git", "Docker", "AWS", "Power BI", "GA4", "Meta Ads API"
    ],
    sl: {
      React: "Expert", TypeScript: "Advanced", "Next.js": "Advanced", "Tailwind CSS": "Expert",
      "Node.js": "Intermediate", Python: "Intermediate", AWS: "Intermediate", Git: "Advanced", Docker: "Basic"
    },
    as: { React: 88, SQL: 82, Python: 75, "System Design": 85 },
    ce: [
      "Meta Front-End Developer · Meta Certification · 12 Jul 2026",
      "Google Analytics Certification · Google / Skillshop · 28 Jun 2026",
      "AWS Cloud Practitioner · Amazon Web Services · 15 May 2026",
      "SQL Intermediate · HackerRank · 10 Apr 2026",
      "React Developer Certification · Udemy · 22 Feb 2026",
    ],
    ex: [
      { co: "Zoho", role: "Frontend Developer", fr: "Feb 2022", to: "Present", d: "Developed responsive web applications using React, TypeScript and modern frontend tooling. Collaborated with cross-functional teams to deliver high-quality features." },
      { co: "InfoSys", role: "Software Intern", fr: "Jun 2021", to: "Jan 2022", d: "Assisted in building web components and fixed bugs in existing applications using React and JavaScript." },
    ],
    ed: [{ sc: "Anna University", dg: "B.E. Computer Science", yr: "2022" }],
    pj: [
      {
        t: "JobTracker Pro Platform",
        l: "github.com/yogesh/jobtracker",
        d: "Autonomous job tracking application with real-time 24h review SLA updates, interview scheduling, and ATS-friendly resume exports.",
        s: "React, TypeScript, Node.js, Tailwind CSS, PostgreSQL",
        m: "1,200+ Active Users · 99.8% SLA adherence",
      },
      {
        t: "E-Commerce Analytics & Conversion Suite",
        l: "github.com/yogesh/ecommerce-analytics",
        d: "High-performance analytics dashboard providing revenue breakdowns, cart abandonment funnels, and cohort analysis with sub-second chart rendering.",
        s: "Next.js, TypeScript, Tailwind CSS, Chart.js, Express",
        m: "Processes 250k+ daily events · 40% faster queries",
      },
      {
        t: "Lead Management & Sales CRM",
        l: "github.com/yogesh/lead-crm",
        d: "Full-stack CRM with automated multi-channel follow-ups, kanban pipeline boards, and role-based access control for distributed teams.",
        s: "React, Redux Toolkit, MongoDB, Docker, REST API",
        m: "Adopted by 3 sales teams · Reduced churn by 18%",
      },
    ],
    links: { li: "linkedin.com/in/yogesh-dev", gh: "github.com/yogesh", pf: "yogeshportfolio.co" },
    pf: { sal: 22, np: 15, wm: "Remote / Hybrid", ty: "Full-time", loc: "Bengaluru, Hyderabad, Remote", rl: true },
    st: "Open to offers",
    saved: [1, 3, 5],
    wal: {
      bal: 1252,
      hist: [
        { id: "TXN-4001", desc: "Profile boost (7 days)", amt: 99, type: "debit", at: Date.now() - 86400000 * 2, via: "Wallet balance", st: "Success" },
        { id: "TXN-4002", desc: "Wallet top-up", amt: 500, type: "credit", at: Date.now() - 86400000 * 5, via: "UPI · yogesh@okaxis", st: "Success" },
        { id: "TXN-4003", desc: "Expert resume review", amt: 149, type: "debit", at: Date.now() - 86400000 * 9, via: "Wallet balance", st: "Success" },
        { id: "TXN-4004", desc: "Wallet top-up", amt: 1000, type: "credit", at: Date.now() - 86400000 * 12, via: "Visa ••4242", st: "Success" },
      ],
    },
    ver: { id: true, test: true, exp: true },
    views: 148,
    phone: "+91 98765 43210",
    twoFactor: false,
    twoFactorMethod: "authenticator",
    privacyVisibility: "public",
    emailAlerts: true,
    smsAlerts: true,
    marketingEmails: false,
    loginAlerts: true,
    passwordLastChanged: Date.now() - 86400000 * 18,
  },
  "demo.employer@talento.app": {
    email: "demo.employer@talento.app",
    role: "employer",
    name: "Super30",
    phone: "+91 98450 12345",
    twoFactor: true,
    twoFactorMethod: "authenticator",
    privacyVisibility: "public",
    emailAlerts: true,
    smsAlerts: true,
    marketingEmails: false,
    loginAlerts: true,
    passwordLastChanged: Date.now() - 86400000 * 30,
    cp: {
      name: "Super30 Technologies",
      about: "Building next-generation AI agents and developer tooling for global engineering teams.",
      ind: "Software",
      size: "Mid",
      hq: "Bengaluru",
      site: "super30.ai",
      mission: "Empowering developers to build 10x faster with verified engineering trust.",
      ben: ["Remote work", "Health insurance", "Learning budget", "Flexible hours", "Stock options"],
    },
    wal: { bal: 9200, hist: [{ id: "TXN-2001", desc: "Recruiter Credits Refill", amt: 10000, type: "credit", at: Date.now() - 86400000 * 5, via: "Net Banking" }] },
    ver: { id: true, test: true, exp: true },
  },
};

export const DEFAULT_APPS: ProApplication[] = [];

export const POPULAR_CERTS = [
  ["Google Data Analytics", "Coursera"],
  ["AWS Certified Cloud Practitioner", "Amazon Web Services"],
  ["Meta Front-End Developer", "Coursera"],
  ["Microsoft Azure Fundamentals (AZ-900)", "Microsoft"],
  ["Google UX Design", "Coursera"],
  ["Salesforce Certified Administrator", "Salesforce"],
];

export const SKILL_QUIZZES: Record<string, [string, string[], number][]> = {
  React: [
    ["Which hook runs side effects?", ["useState", "useEffect", "useMemo", "useRef"], 1],
    ["A key prop helps React to…", ["Style lists", "Track list items", "Fetch data", "Bind events"], 1],
    ["State updates in React are usually…", ["Always sync", "Batched", "Blocking", "Global"], 1],
  ],
  SQL: [
    ["Which clause filters grouped rows?", ["WHERE", "HAVING", "ORDER BY", "LIMIT"], 1],
    ["Which JOIN keeps all left rows?", ["INNER", "LEFT", "CROSS", "SELF"], 1],
    ["COUNT(*) counts…", ["Non-null values", "All rows", "Distinct rows", "Columns"], 1],
  ],
  Python: [
    ["Which type is mutable?", ["tuple", "str", "list", "int"], 2],
    ["len({1,2,2}) returns…", ["3", "2", "1", "Error"], 1],
    ["Keyword to define a function?", ["func", "def", "fn", "lambda only"], 1],
  ],
};

export const JOB_TEMPLATES: [string, string, ProJob["m"], number, number, number, string][] = [
  ["Frontend Dev", "Frontend Developer", "Hybrid", 2, 8, 14, "React, TypeScript, CSS"],
  ["Data Analyst", "Data Analyst", "Onsite", 1, 8, 14, "SQL, Python, Tableau"],
  ["DevOps", "DevOps Engineer", "Remote", 3, 20, 32, "AWS, Kubernetes, Terraform"],
  ["Fresher Trainee", "Software Trainee", "Onsite", 0, 4, 5, "Java, DSA"],
];

export const BANKS = [
  "State Bank of India",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "Canara Bank",
  "Bank of Baroda",
  "Indian Bank",
  "IDFC FIRST Bank",
  "Yes Bank",
  "Union Bank of India",
  "Punjab National Bank",
];

export const WALLETS = ["Paytm", "PhonePe", "Amazon Pay", "Mobikwik", "Freecharge"];
export const UPI_HANDLES = [
  ["GPay", "@okaxis"],
  ["PhonePe", "@ybl"],
  ["Paytm", "@paytm"],
  ["BHIM", "@upi"],
  ["Amazon Pay", "@apl"],
];

export const COMPANY_BENEFITS = [
  "Health insurance",
  "Remote work",
  "Stock options",
  "Learning budget",
  "Flexible hours",
  "Free meals",
  "Gym",
  "Parental leave",
];

// Helper calculations
export const calcScore = (job: ProJob, userOrSkills?: { sk?: string[] } | null): number => {
  if (!job || !job.sk || !job.sk.length) return 0;
  if (!userOrSkills || !userOrSkills.sk) return 0;
  const userSkills = (userOrSkills.sk || []).map((x) => x.toLowerCase());
  const matches = job.sk.filter((s) => userSkills.includes(s.toLowerCase()));
  return Math.round((matches.length / job.sk.length) * 100);
};

export const avgCandidateScore = (c: ProCandidate): number => {
  if (!c || !c.as) return 0;
  const v = Object.values(c.as || {});
  return v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : 0;
};

export const levelFromExp = (x: number): string => (x < 1 ? "Fresher" : x < 3 ? "Junior" : x < 6 ? "Mid" : "Senior");

export const calcTalentScore = (c: ProCandidate, j?: ProJob): number => {
  if (!c) return 50;
  const skMatch = j ? calcScore(j, { sk: c.sk }) : 50;
  const avgTest = avgCandidateScore(c);
  const certBonus = Math.min((c.ce || []).length, 2) * 5;
  return Math.min(100, Math.round(skMatch * 0.6 + avgTest * 0.3 + certBonus));
};

export const formatINR = (n: number): string => "₹" + Number(n || 0).toLocaleString("en-IN");

export const getRemainingTime = (dueMs: number): string => {
  const diffMinutes = Math.max(0, Math.floor((dueMs - Date.now()) / 60000));
  return `${Math.floor(diffMinutes / 60)}h ${diffMinutes % 60}m`;
};

export const timeAgo = (t: number): string => {
  const d = Math.floor((Date.now() - t) / D_MS);
  return d < 1 ? "Today" : `${d}d ago`;
};

export const generateHash = (s: string): string => {
  let h = 7;
  for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h.toString(36).toUpperCase();
};

export const fitAnalysis = (j: ProJob, u: ProUser) => {
  const pf = u.pf || {};
  const sk = calcScore(j, u);
  const ex = (u.exp || 0) >= j.e ? 100 : Math.max(0, 100 - (j.e - (u.exp || 0)) * 30);
  const sal = !pf.sal ? 70 : j.b >= pf.sal ? 100 : Math.max(0, 100 - (pf.sal - j.b) * 8);
  const loc = !pf.loc || j.m === "Remote" || pf.loc.toLowerCase().includes(j.l.toLowerCase()) ? 100 : pf.rl ? 60 : 20;
  const md = !pf.wm || pf.wm === "Any" || pf.wm === j.m ? 100 : 40;

  return {
    tot: Math.round(sk * 0.4 + ex * 0.2 + sal * 0.2 + loc * 0.1 + md * 0.1),
    rows: [
      { name: "Skills", score: sk, note: `${sk}% of required skills` },
      { name: "Experience", score: ex, note: ex >= 100 ? `Meets ${j.e}+ yrs requirement` : `Needs ${j.e}+ yrs` },
      {
        name: "Salary",
        score: sal,
        note: !pf.sal
          ? "Set target salary in profile"
          : j.b >= pf.sal
          ? `Pays up to ₹${j.b}L (Target: ₹${pf.sal}L)`
          : `Below ₹${pf.sal}L target`,
      },
      {
        name: "Location",
        score: loc,
        note: loc >= 100 ? "Matches location or remote" : pf.rl ? "Relocation needed" : "Different location",
      },
      { name: "Work mode", score: md, note: md >= 100 ? `Matches ${j.m}` : `Prefers ${pf.wm}` },
    ],
  };
};

export const candidateFitForJob = (c: ProCandidate, j: ProJob) => {
  const sk = calcScore(j, { sk: c.sk });
  const rm = j.m === "Remote" || c.wp === "Remote" || c.c === j.l;
  return [
    { name: "Skills", score: sk, note: `${sk}% of required skills` },
    {
      name: "Experience",
      score: c.x >= j.e ? 100 : Math.max(0, 100 - (j.e - c.x) * 30),
      note: c.x >= j.e ? `${c.x} yrs (needs ${j.e}+)` : `Has ${c.x}, needs ${j.e}+`,
    },
    {
      name: "Budget",
      score: c.es <= j.b ? 100 : Math.max(0, 100 - (c.es - j.b) * 8),
      note: c.es <= j.b ? `Expects ₹${c.es}L, within budget (₹${j.b}L)` : `Expects ₹${c.es}L, above budget`,
    },
    { name: "Location", score: rm ? 100 : 30, note: rm ? "Compatible location" : `${c.c} vs ${j.l}` },
    { name: "Assessments", score: avgCandidateScore(c), note: `Average score ${avgCandidateScore(c)}%` },
    { name: "Certified", score: c.ce.length ? 100 : 20, note: `${c.ce.length} certification(s)` },
  ];
};

export const parseSmartSearch = (q: string) => {
  const text = " " + q.toLowerCase() + " ";
  const res: { sk: string[]; m: string[]; ty: string[]; loc: string; sal: number; lv: string[]; ex: number | null } = {
    sk: [],
    m: [],
    ty: [],
    loc: "",
    sal: 0,
    lv: [],
    ex: null,
  };

  const knownSkills = [
    "React", "TypeScript", "Node.js", "Python", "SQL", "AWS", "Java", "DSA", "Figma",
    "Tableau", "Kubernetes", "Terraform", "PyTorch", "MLOps", "Azure", "Kotlin", "PostgreSQL"
  ];

  knownSkills.forEach((k) => {
    const esc = k.toLowerCase().replace(/[.+]/g, "\\$&");
    if (new RegExp("[^a-z]" + esc + "[^a-z]").test(text)) res.sk.push(k);
  });

  ["remote", "hybrid", "onsite"].forEach((x) => {
    if (text.includes(x)) res.m.push(x.charAt(0).toUpperCase() + x.slice(1));
  });

  if (/intern/.test(text)) res.ty.push("Internship");
  if (/contract/.test(text)) res.ty.push("Contract");

  let m = /(\d+(\.\d+)?)\s*(lpa|lakh|l\b)/.exec(text);
  if (m) res.sal = +m[1];

  m = /(\d+)\s*\+?\s*(years|yrs|year|yr)/.exec(text);
  if (m) res.ex = +m[1];

  [
    ["fresher", "Fresher"],
    ["junior", "Junior"],
    ["mid", "Mid"],
    ["senior", "Senior"],
  ].forEach((x) => {
    if (text.includes(x[0])) res.lv.push(x[1]);
  });

  const cities = ["Bengaluru", "Chennai", "Pune", "Hyderabad", "Mumbai", "Noida", "Gurugram", "Remote"];
  cities.forEach((c) => {
    if (text.includes(c.toLowerCase())) res.loc = c;
  });

  return res;
};

// Anti-poaching identity masking helpers for Locked Verified Candidates
const COMPANY_TIER_MAP: Record<string, string> = {
  Razorpay: "Tier-1 Fintech Unicorn",
  "ex-Zoho": "ex-Global Cloud SaaS Leader",
  Zoho: "Global Cloud SaaS Leader",
  BrowserStack: "Global Cloud Testing Unicorn",
  "ex-ThoughtWorks": "ex-Tier-1 Global Engineering Consultancy",
  ThoughtWorks: "Tier-1 Global Engineering Consultancy",
  Swiggy: "Decacorn Consumer Tech Leader",
  "ex-Flipkart": "ex-Tier-1 E-Commerce Decacorn",
  Flipkart: "Tier-1 E-Commerce Decacorn",
  PhonePe: "Tier-1 Digital Payments Decacorn",
  "ex-InMobi": "ex-Global AdTech Unicorn",
  "ex-Mu Sigma": "ex-Decision Sciences Leader",
  CRED: "High-Growth Fintech Unicorn",
  "ex-Urban Company": "ex-Consumer Services Unicorn",
  Postman: "Global API SaaS Unicorn",
  "ex-Freshworks": "ex-Listed Cloud SaaS Giant",
  Zomato: "Listed Consumer Tech Giant",
  "ex-Paytm": "ex-Fintech Pioneer",
};

export const getMaskedCandidateName = (name?: string): string => {
  if (!name) return "V•••••• C••••••";
  const parts = name.trim().split(/\s+/);
  return parts
    .map((p) => (p.length > 0 ? p.charAt(0).toUpperCase() + "••••" : "••••"))
    .join(" ");
};

export const getAnonymizedCompanyTier = (company?: string): string => {
  if (!company) return "Tier-1 Product Tech Company";
  return COMPANY_TIER_MAP[company] || (company.startsWith("ex-") ? "ex-Tier-1 Tech Leader" : "Tier-1 Product Tech Company");
};

export const getAnonymizedHeadline = (cand: ProCandidate): { roleTitle: string; companyTier: string } => {
  const raw = cand.headline || "Senior Software Engineer";
  const [rolePart] = raw.split("@");
  const roleTitle = (rolePart || "Senior Software Engineer").trim();
  const currTier = getAnonymizedCompanyTier(cand.currentCompany);
  const prevTier = cand.previousCompany ? ` · ${getAnonymizedCompanyTier(cand.previousCompany)}` : "";
  return {
    roleTitle,
    companyTier: `${currTier}${prevTier}`,
  };
};

export const getAnonymizedEducation = (education?: string): { instituteTier: string; degreePart: string } => {
  if (!education) {
    return {
      instituteTier: "Tier-1 Premier Engineering Institute",
      degreePart: "B.Tech Computer Science",
    };
  }
  const parts = education.split("·").map((s) => s.trim());
  const degreePart = parts.length > 1 ? parts.slice(1).join(" · ") : "B.Tech / B.E.";
  const inst = parts[0] || "";
  const isDesign = inst.toLowerCase().includes("design") || inst.toLowerCase().includes("nid");
  return {
    instituteTier: isDesign
      ? "Tier-1 National Design Institute"
      : "Tier-1 Premier Engineering Institute (IIT / BITS / NIT Tier)",
    degreePart,
  };
};

export const getAnonymizedHighlight = (cand: ProCandidate): string => {
  if (!cand.highlight) return "";
  return cand.highlight
    .replace(/Razorpay's/gi, "a Tier-1 Fintech Unicorn's")
    .replace(/Razorpay/gi, "a Tier-1 Fintech Unicorn")
    .replace(/Swiggy's/gi, "a Decacorn's")
    .replace(/Swiggy/gi, "a Decacorn")
    .replace(/Flipkart's/gi, "a Tier-1 E-Commerce Giant's")
    .replace(/Flipkart/gi, "a Tier-1 E-Commerce Giant")
    .replace(/CRED's/gi, "a Fintech Unicorn's")
    .replace(/CRED/gi, "a Fintech Unicorn")
    .replace(/Postman/gi, "a Global API Platform")
    .replace(/BrowserStack/gi, "a Global Cloud Platform")
    .replace(/PhonePe/gi, "a Digital Payments Leader")
    .replace(/Zomato/gi, "a Listed Consumer Tech App");
};

