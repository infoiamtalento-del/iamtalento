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
  { n: "Aarav Mehta", c: "Bengaluru", x: 4, sk: ["React", "TypeScript", "Node.js"], ce: ["Meta Front-End"], as: { React: 88, TypeScript: 81, "Node.js": 74 }, nt: 15, es: 18, wp: "Hybrid" },
  { n: "Diya Nair", c: "Chennai", x: 2, sk: ["SQL", "Python", "Tableau"], ce: ["Google Data Analytics"], as: { SQL: 91, Python: 84, Tableau: 77 }, nt: 30, es: 10, wp: "Onsite" },
  { n: "Rohan Das", c: "Pune", x: 0, sk: ["Java", "DSA"], ce: ["Oracle Java SE"], as: { Java: 72, DSA: 80 }, nt: 0, es: 4, wp: "Onsite" },
  { n: "Sneha Iyer", c: "Remote", x: 6, sk: ["AWS", "Kubernetes", "Terraform"], ce: ["AWS Solutions Architect", "CKA"], as: { AWS: 93, Kubernetes: 89, Terraform: 85 }, nt: 60, es: 34, wp: "Remote" },
  { n: "Kabir Shah", c: "Hyderabad", x: 3, sk: ["Python", "PyTorch", "MLOps"], ce: ["TensorFlow Developer"], as: { Python: 90, PyTorch: 86, MLOps: 70 }, nt: 30, es: 28, wp: "Hybrid" },
  { n: "Meera Pillai", c: "Mumbai", x: 5, sk: ["Figma", "UX Research"], ce: ["Google UX Design"], as: { Figma: 94, "UX Research": 88 }, nt: 45, es: 26, wp: "Hybrid" },
  { n: "Arjun Rao", c: "Bengaluru", x: 8, sk: ["Node.js", "PostgreSQL", "AWS", "System Design"], ce: ["AWS Developer"], as: { "Node.js": 90, PostgreSQL: 87, AWS: 82 }, nt: 60, es: 42, wp: "Onsite" },
  { n: "Priya Menon", c: "Chennai", x: 1, sk: ["React", "CSS", "TypeScript"], ce: [], as: { React: 76, CSS: 85, TypeScript: 68 }, nt: 15, es: 9, wp: "Remote" },
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
      { t: "JobTracker", l: "github.com/yogesh/jobtracker", d: "A job tracking application to manage applications, interviews and follow-ups in one place." },
      { t: "E-commerce Analytics Dashboard", l: "github.com/yogesh/ecommerce-analytics", d: "Real-time analytics dashboard for e-commerce business with sales, products and customer insights." },
      { t: "Lead Management CRM", l: "github.com/yogesh/lead-crm", d: "A lead tracking and pipeline management system with automated follow-ups and notifications." },
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
  },
  "demo.employer@talento.app": {
    email: "demo.employer@talento.app",
    role: "employer",
    name: "Super30",
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
