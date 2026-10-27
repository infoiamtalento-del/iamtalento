import { CANDIDATES_SEED, type ProApplication, type ProJob } from "./proData";

export const DEMO_EMPLOYER_JOBS: ProJob[] = [
  { id: 81001, t: "Senior React Developer", c: "Super30 Technologies", l: "Bengaluru", m: "Hybrid", ty: "Full-time", e: 3, a: 18, b: 30, sk: ["React", "TypeScript", "Node.js"], by: "demo.employer@talento.app", at: Date.now() - 86400000 * 3, description: "Build accessible React applications for our developer platform. Work with product and design teams, improve performance, and mentor junior engineers." },
  { id: 81002, t: "Data Analyst", c: "Super30 Technologies", l: "Chennai", m: "Hybrid", ty: "Full-time", e: 1, a: 8, b: 14, sk: ["SQL", "Python", "Tableau"], by: "demo.employer@talento.app", at: Date.now() - 86400000 * 2, description: "Turn product and customer data into actionable insights. Build SQL models, maintain dashboards and present findings to business teams." },
  { id: 81003, t: "Cloud Platform Engineer", c: "Super30 Technologies", l: "Remote", m: "Remote", ty: "Full-time", e: 4, a: 24, b: 36, sk: ["AWS", "Kubernetes", "Terraform"], by: "demo.employer@talento.app", at: Date.now() - 86400000, description: "Own reliable cloud infrastructure, automate deployments and improve monitoring for our engineering platform." },
];

export function createDemoApplication(index: number, jobId: number, id = 82000 + index): ProApplication {
  const candidate = CANDIDATES_SEED[index % CANDIDATES_SEED.length];
  return { id, jid: jobId, who: `candidate${index}@example.com`, name: candidate.n, exp: candidate.x, sk: candidate.sk, ce: candidate.ce, as: candidate.as, st: "Applied", at: Date.now(), cn: `I would love to bring my ${candidate.sk.slice(0, 2).join(" and ")} experience to Super30.` , upd: [] };
}

export const DEMO_EMPLOYER_APPS: ProApplication[] = CANDIDATES_SEED.map((_, i) => {
  const stage = (["Applied", "Shortlisted", "Applied", "Interview", "Offer", "Rejected", "Interview", "Shortlisted"] as const)[i];
  const jid = i === 1 || i === 4 ? 81002 : i === 3 || i === 6 ? 81003 : 81001;
  return { ...createDemoApplication(i, jid), st: stage, at: Date.now() - (i + 1) * 7200000, note: i === 0 ? "Strong React portfolio. Check availability for a technical round." : "", iv: stage === "Interview" ? new Date(Date.now() + (i + 1) * 86400000).toISOString().slice(0, 16) : undefined, upd: stage === "Applied" ? [] : [{ msg: `Application moved to ${stage}.`, at: Date.now() - 3600000 }] };
});

export interface EmployerAssessmentQuestion {
  id: string;
  q: string;
  options: string[];
  answer: number;
  points: number;
  skillTag: string;
}

export interface EmployerAssessmentRecord {
  id: number;
  name: string;
  candidate: string;
  score?: number;
  status: string;
  type?: string;
  difficulty?: string;
  passingScore?: number;
  proctoring?: boolean;
  skills?: string[];
  questions?: number;
  duration?: number;
  at?: number;
  description?: string;
  questionItems?: EmployerAssessmentQuestion[];
}

export interface EmployerDemoState {
  assessments: EmployerAssessmentRecord[];
  aiInterviews: { id: number; name: string; candidate: string; status: string; score?: number }[];
  campaigns: { id: number; name: string; status: string; views: number; clicks: number; at?: number; category?: string }[];
  plan: string;
  preferences: { email: boolean; interviews: boolean; digest: boolean; status?: boolean };
  security?: { twoStep: boolean; pwAt: number; sessions: { id: number; device: string; at: number }[]; team: number };
}

export const INITIAL_EMPLOYER_DEMO: EmployerDemoState = {
  assessments: [
    {
      id: 1,
      name: "React & TypeScript",
      candidate: "Aarav Mehta",
      score: 88,
      status: "Completed",
      type: "Technical",
      difficulty: "Advanced",
      passingScore: 70,
      proctoring: true,
      skills: ["React 18", "TypeScript", "Hooks & Concurrency"],
      questions: 10,
      duration: 30,
      at: Date.now() - 86400000 * 7,
      description: "React hooks, concurrent rendering, component architecture, and strict TypeScript generics.",
    },
    {
      id: 2,
      name: "SQL & Analytics",
      candidate: "Diya Nair",
      status: "Invited",
      type: "Technical",
      difficulty: "Intermediate",
      passingScore: 65,
      proctoring: true,
      skills: ["SQL Joins", "Window Functions", "Query Indexing"],
      questions: 12,
      duration: 30,
      at: Date.now() - 86400000 * 5,
      description: "SQL joins, window aggregations, indexing execution plans, and analytical problem solving.",
    },
    {
      id: 3,
      name: "Aptitude Test",
      candidate: "Aarav Mehta",
      status: "Invited",
      type: "Aptitude",
      difficulty: "Core",
      passingScore: 60,
      proctoring: true,
      skills: ["Logical Reasoning", "Quantitative Analysis", "Data Interpretation"],
      questions: 20,
      duration: 45,
      at: Date.now() - 86400000 * 4,
      description: "Logical deduction, quantitative reasoning, and structured analytical speed test.",
    },
    {
      id: 4,
      name: "Communication Assessment",
      candidate: "Diya Nair",
      status: "Invited",
      type: "HR Round",
      difficulty: "Core",
      passingScore: 60,
      proctoring: false,
      skills: ["Stakeholder Communication", "Conflict Resolution", "Agile Ownership"],
      questions: 5,
      duration: 15,
      at: Date.now() - 86400000 * 3,
      description: "Written executive communication, async team collaboration, and workplace scenarios.",
    },
    {
      id: 5,
      name: "Cloud Platform Screening",
      candidate: "",
      status: "Draft",
      type: "Technical",
      difficulty: "Advanced",
      passingScore: 75,
      proctoring: true,
      skills: ["AWS", "Kubernetes", "Terraform", "CI/CD"],
      questions: 15,
      duration: 45,
      at: Date.now() - 86400000 * 2,
      description: "Cloud architecture, Kubernetes cluster autoscaling, Terraform IaC, and incident response.",
    },
    {
      id: 6,
      name: "Teamwork & Collaboration",
      candidate: "",
      status: "Draft",
      type: "HR Round",
      difficulty: "Intermediate",
      passingScore: 60,
      proctoring: false,
      skills: ["Cross-Functional Leadership", "Mentorship", "Engineering Culture"],
      questions: 8,
      duration: 20,
      at: Date.now() - 86400000,
      description: "Collaboration, ownership, code review empathy, and professional engineering judgement.",
    },
  ],
  aiInterviews: [{ id: 1, name: "Frontend technical screening", candidate: "Aarav Mehta", status: "Completed", score: 86 }],
  campaigns: [{ id: 1, name: "Engineering careers at Super30", status: "Active", views: 1240, clicks: 86, at: Date.now() - 86400000 * 14, category: "Employer Brand · Engineering" }],
  plan: "Starter",
  preferences: { email: true, interviews: true, digest: false },
};