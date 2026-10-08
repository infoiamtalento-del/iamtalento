import { MessageSquareText, BrainCircuit, Compass, type LucideIcon } from "lucide-react";

export interface CoreTestPart {
  num: string;
  title: string;
  kind: "MCQ" | "Situational" | "Cognitive" | "Behavioural" | "Preference";
  text: string;
  questions: number;
  minutes: number;
}

export interface MandatoryCoreTest {
  id: string;
  name: string;
  summary: string;
  questions: number;
  duration: string;
  format: string;
  icon: LucideIcon;
  badge: string;
  parts: CoreTestPart[];
  skills: string[];
}

export const MANDATORY_CORE_TESTS: MandatoryCoreTest[] = [
  {
    id: "communication",
    name: "Communication Skills",
    summary: "Workplace written clarity, professional tone, active listening, and client-ready communication.",
    questions: 15,
    duration: "15 min",
    format: "MCQ & Situational Judgment",
    icon: MessageSquareText,
    badge: "Foundational",
    parts: [
      {
        num: "01",
        title: "Written Clarity & Professional Tone",
        kind: "MCQ",
        text: "Grammar, conciseness, email etiquette, stakeholder framing, and cross-functional communication.",
        questions: 8,
        minutes: 8,
      },
      {
        num: "02",
        title: "Active Listening & Dialogue Comprehension",
        kind: "Situational",
        text: "Analyzing briefs, synthesizing client feedback, conflict resolution, and meeting action points.",
        questions: 7,
        minutes: 7,
      },
    ],
    skills: ["Email Etiquette", "Tone Adaptation", "Clarity & Conciseness", "Meeting Synthesis"],
  },
  {
    id: "psychometrics",
    name: "Psychometrics & Aptitude",
    summary: "Cognitive reasoning, pattern recognition, analytical problem solving, and work-style profile.",
    questions: 20,
    duration: "15 min",
    format: "Cognitive & Likert Choice",
    icon: BrainCircuit,
    badge: "Cognitive",
    parts: [
      {
        num: "01",
        title: "Logical Deduction & Pattern Recognition",
        kind: "Cognitive",
        text: "Speed-accuracy deduction, sequence patterns, data sanity checks, and critical problem solving.",
        questions: 10,
        minutes: 8,
      },
      {
        num: "02",
        title: "Work Style & Culture Dynamics",
        kind: "Behavioural",
        text: "Deadline accountability, adaptability under uncertainty, ownership mindset, and team collaboration.",
        questions: 10,
        minutes: 7,
      },
    ],
    skills: ["Logical Deduction", "Critical Thinking", "Stress Resilience", "Ownership Mindset"],
  },
  {
    id: "vocational",
    name: "Vocational & Role Fit",
    summary: "Career interest alignment, preferred workplace environment, and functional role suitability.",
    questions: 15,
    duration: "10 min",
    format: "Role Fit & Situational Choice",
    icon: Compass,
    badge: "Alignment",
    parts: [
      {
        num: "01",
        title: "Career Motivations & RIASEC Profile",
        kind: "Preference",
        text: "Mapping core strengths and professional drives to maximize long-term role engagement.",
        questions: 8,
        minutes: 5,
      },
      {
        num: "02",
        title: "Workplace Pace & Environment Fit",
        kind: "Preference",
        text: "Readiness for agile startup velocity vs structured enterprise governance and autonomy levels.",
        questions: 7,
        minutes: 5,
      },
    ],
    skills: ["Role Motivation", "Pace Alignment", "Growth Velocity", "Cultural Resonance"],
  },
];
