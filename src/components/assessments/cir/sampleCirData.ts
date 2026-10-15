/** Illustrative data for the sample Career Intelligence Report. Nothing here is a real candidate. */

export const RED = "#EC2738";
export const INK = "#0F172A";
export const SLATE = "#64748B";
export const LINE = "#E2E8F0";

export const CIR_CANDIDATE = {
  name: "Rohan Desai",
  role: "Digital Marketing Executive",
  experience: "3 years",
  location: "Mumbai, India",
  reportId: "CIR-DM-2026-048213",
  issued: "10 October 2026",
  validUntil: "10 October 2027",
  assessment: "Digital Marketing Assessments",
  verifyUrl: "iamtalento.com/verify/CIR-DM-2026-048213",
};

export const CIR_HEADLINE = {
  score: 82,
  percentile: 91,
  tier: "Industry Ready",
  accuracy: 79,
  integrity: 97,
  questions: 94,
  attempted: 92,
  correct: 74,
  incorrect: 18,
  skipped: 2,
  minutesAllotted: 165,
  minutesUsed: 148,
};

export interface CirTestRow {
  name: string;
  group: "Core" | "Domain";
  questions: number;
  allotted: number;
  used: number;
  score: number;
  accuracy: number;
  percentile: number;
  market: number;
  note: string;
}

export const CIR_TESTS: CirTestRow[] = [
  { name: "Communication Skills", group: "Core", questions: 15, allotted: 15, used: 13, score: 86, accuracy: 80, percentile: 88, market: 68, note: "Clear, client-ready written tone" },
  { name: "Psychometrics & Aptitude", group: "Core", questions: 20, allotted: 15, used: 14, score: 78, accuracy: 80, percentile: 80, market: 64, note: "Strong pattern recognition" },
  { name: "Vocational & Role Fit", group: "Core", questions: 15, allotted: 10, used: 9, score: 84, accuracy: 93, percentile: 86, market: 66, note: "Consistent growth-role profile" },
  { name: "Digital Marketing Domain Test", group: "Domain", questions: 44, allotted: 125, used: 112, score: 81, accuracy: 73, percentile: 84, market: 62, note: "Analytics-led, tool-fluent" },
];

export const CIR_ROUNDS = [
  {
    title: "Round 1 · Knowledge",
    score: 84,
    market: 65,
    tests: [
      { name: "Core Concepts", kind: "MCQ", result: "13 / 15 correct", pct: 87 },
      { name: "Applied Scenarios", kind: "MCQ", result: "8 / 10 correct", pct: 80 },
    ],
  },
  {
    title: "Round 2 · Technical",
    score: 76,
    market: 58,
    tests: [
      { name: "Hands-on Tasks", kind: "Technical", result: "78% rubric score", pct: 78 },
      { name: "Case Problem", kind: "Technical", result: "72% rubric score", pct: 72 },
    ],
  },
  {
    title: "Round 3 · Experience",
    score: 85,
    market: 63,
    tests: [
      { name: "Workplace Scenarios", kind: "Experience", result: "82% rubric score", pct: 82 },
      { name: "Situational Judgement", kind: "Experience", result: "7 / 8 correct", pct: 88 },
    ],
  },
];

export const CIR_SKILLS = [
  { name: "Web Analytics", short: "Analytics", score: 88, market: 60, top: 92 },
  { name: "SEO", short: "SEO", score: 84, market: 66, top: 90 },
  { name: "Content Marketing", short: "Content", score: 81, market: 64, top: 88 },
  { name: "Google Ads", short: "Search Ads", score: 79, market: 63, top: 89 },
  { name: "Meta Ads", short: "Social Ads", score: 72, market: 61, top: 87 },
  { name: "Email & CRM", short: "Email/CRM", score: 68, market: 58, top: 85 },
];

export const CIR_DIFFICULTY = [
  { level: "Easy", total: 32, correct: 30, color: "#16A34A" },
  { level: "Medium", total: 41, correct: 31, color: "#F59E0B" },
  { level: "Hard", total: 21, correct: 13, color: RED },
];

/** Deterministic answer map: 74 correct, 18 incorrect, 2 skipped (94 questions). */
export const CIR_ANSWER_MAP: ("c" | "i" | "s")[] = (() => {
  const total = 94;
  const map: ("c" | "i" | "s")[] = Array(total).fill("c");
  const incorrect = [6, 11, 19, 23, 27, 31, 38, 41, 47, 52, 55, 61, 66, 72, 77, 81, 86, 90];
  const skipped = [58, 92];
  incorrect.forEach((i) => (map[i] = "i"));
  skipped.forEach((i) => (map[i] = "s"));
  return map;
})();

export const CIR_PACE = [
  { label: "Communication", used: 13, allotted: 15 },
  { label: "Psychometrics", used: 14, allotted: 15 },
  { label: "Role Fit", used: 9, allotted: 10 },
  { label: "Round 1", used: 27, allotted: 30 },
  { label: "Round 2", used: 50, allotted: 55 },
  { label: "Round 3", used: 35, allotted: 40 },
];

export const CIR_PROCTORING = {
  integrity: 97,
  checks: [
    { label: "Government ID match", value: "Verified", detail: "Name and photo matched" },
    { label: "Face match", value: "99.2%", detail: "Checked every 30 seconds" },
    { label: "Liveness check", value: "Passed", detail: "Completed at start of session" },
    { label: "Camera uptime", value: "100%", detail: "No interruptions" },
    { label: "Microphone", value: "Clean", detail: "No second voice detected" },
    { label: "Full-screen mode", value: "Enforced", detail: "2 brief exits logged" },
  ],
  events: [
    { at: 12, kind: "Tab switch", length: "4 s", severity: "Low" },
    { at: 57, kind: "Face out of frame", length: "6 s", severity: "Low" },
    { at: 96, kind: "Tab switch", length: "7 s", severity: "Low" },
  ],
  stats: [
    { label: "Critical flags", value: 0 },
    { label: "High flags", value: 0 },
    { label: "Low flags", value: 3 },
    { label: "Copy / paste", value: 0 },
  ],
  device: [
    ["Browser", "Chrome 126"],
    ["System", "Windows 11"],
    ["Screen", "1920 x 1080"],
    ["Network", "42 Mbps, stable"],
    ["Location", "Mumbai, consistent"],
    ["Session", "148 min, one sitting"],
  ],
};

export const CIR_ROLES = [
  { role: "Performance Marketing Executive", match: 91 },
  { role: "SEO and Content Specialist", match: 88 },
  { role: "Marketing Analyst", match: 85 },
  { role: "Growth Associate", match: 82 },
];

export const CIR_PLAN = [
  { phase: "30 days", title: "Close the email gap", text: "Build two lifecycle flows and run a subject-line A/B test in a free CRM tool." },
  { phase: "60 days", title: "Level up paid social", text: "Run a small Meta Ads test with pixel events and write up the learnings." },
  { phase: "90 days", title: "Prove it with a case", text: "Publish one end-to-end campaign case study with a measured result." },
];
