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

export interface EmployerDemoState {
  assessments: { id: number; name: string; candidate: string; score?: number; status: string }[];
  aiInterviews: { id: number; name: string; candidate: string; status: string; score?: number }[];
  campaigns: { id: number; name: string; status: string; views: number; clicks: number; at?: number; category?: string }[];
  plan: string;
  preferences: { email: boolean; interviews: boolean; digest: boolean; status?: boolean };
  security?: { twoStep: boolean; pwAt: number; sessions: { id: number; device: string; at: number }[]; team: number };
}

export const INITIAL_EMPLOYER_DEMO: EmployerDemoState = {
  assessments: [{ id: 1, name: "React & TypeScript", candidate: "Aarav Mehta", score: 88, status: "Completed" }, { id: 2, name: "SQL & Analytics", candidate: "Diya Nair", status: "Invited" }],
  aiInterviews: [{ id: 1, name: "Frontend technical screening", candidate: "Aarav Mehta", status: "Completed", score: 86 }],
  campaigns: [{ id: 1, name: "Engineering careers at Super30", status: "Active", views: 1240, clicks: 86, at: Date.now() - 86400000 * 14, category: "Employer Brand · Engineering" }],
  plan: "Starter",
  preferences: { email: true, interviews: true, digest: false },
};