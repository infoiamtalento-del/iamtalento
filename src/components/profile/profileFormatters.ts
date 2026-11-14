import {
  Award,
  BarChart3,
  Brain,
  BriefcaseBusiness,
  Building2,
  ClipboardCheck,
  Cloud,
  Code2,
  Database,
  Globe,
  Heart,
  Landmark,
  Layers,
  Megaphone,
  Palette,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { ExpertiseCardItem } from "@/services/candidate/profile";

export const PROFILE_CHAR_LIMITS = {
  fullName: 80,
  headline: 120,
  subHeadline: 90,
  jobRole: 80,
  company: 80,
  industry: 60,
  phone: 20,
  city: 50,
  state: 50,
  country: 50,
  about: 1200,
  tagChip: 40,
  expertiseTitle: 45,
  expertiseSub: 70,
  expTitle: 80,
  expCompany: 80,
  expLocation: 60,
  expDate: 25,
  expPeriod: 25,
  expDescription: 1000,
  projTitle: 80,
  projectTitle: 80,
  projRole: 60,
  projectRole: 60,
  projDescription: 500,
  projectDescription: 500,
  projImpact: 140,
  projectImpact: 140,
  eduInstitution: 100,
  eduDegree: 80,
  eduField: 80,
  eduYear: 4,
  eduGrade: 25,
  certName: 100,
  certIssuer: 80,
  certDate: 25,
  awardTitle: 100,
  awardOrg: 80,
  awardDate: 25,
  awardDescription: 300,
  languageName: 35,
  languageLevel: 25,
  salaryRange: 40,
  preferredLocations: 160,
  portfolioSlug: 40,
  slug: 40,
  url: 250,
  videoPitch: 400,
} as const;

export const PROFILE_LIST_LIMITS = {
  focusBadges: 6,
  skills: 25,
  tools: 20,
  hobbies: 12,
  interests: 12,
  experiences: 15,
  projects: 10,
  educations: 8,
  certifications: 15,
  awards: 12,
  languages: 8,
} as const;

export function clampText(val: string | null | undefined, max: number): string {
  if (!val) return "";
  return String(val).slice(0, max);
}

const UPPERCASE_ACRONYMS = new Set([
  "seo",
  "sem",
  "ppc",
  "smm",
  "ga4",
  "crm",
  "roi",
  "roas",
  "cpc",
  "ctr",
  "cro",
  "b2b",
  "b2c",
  "d2c",
  "pr",
  "hr",
  "hris",
  "ui",
  "ux",
  "ui/ux",
  "ai",
  "ml",
  "ai/ml",
  "nlp",
  "llm",
  "genai",
  "aws",
  "gcp",
  "sql",
  "nosql",
  "api",
  "apis",
  "rest",
  "graphql",
  "css",
  "html",
  "js",
  "ts",
  "php",
  "qa",
  "ci/cd",
  "erp",
  "sap",
  "cfa",
  "cpa",
  "fp&a",
  "bfsi",
  "kyc",
  "aml",
  "iot",
  "plc",
  "lms",
  "hipaa",
]);

const LOWERCASE_CONNECTORS = new Set(["and", "or", "of", "in", "for", "to", "with", "on", "at", "by"]);

/**
 * Formats user-entered tags/chips cleanly:
 * - Preserves intentional mixed-case strings ("Node.js", "TypeScript", "Google Ads", "iOS").
 * - Converts all-lowercase inputs ("performance marketer", "seo") into polished Title Case / Acronyms ("Performance Marketer", "SEO").
 */
export function formatSmartTag(raw: string | null | undefined): string {
  const trimmed = (raw || "").trim().replace(/\s+/g, " ");
  if (!trimmed) return "";

  const lowerAll = trimmed.toLowerCase();
  if (UPPERCASE_ACRONYMS.has(lowerAll)) {
    if (lowerAll === "genai") return "GenAI";
    if (lowerAll === "nosql") return "NoSQL";
    if (lowerAll === "graphql") return "GraphQL";
    if (lowerAll === "apis") return "APIs";
    return trimmed.toUpperCase();
  }

  // If the user already included uppercase letters and lowercase letters, respect their exact casing.
  const hasUpper = /[A-Z]/.test(trimmed);
  const hasLower = /[a-z]/.test(trimmed);
  if (hasUpper && hasLower) return trimmed;

  // If all-uppercase and longer than 4 chars (e.g. "DIGITAL MARKETING"), convert to Title Case.
  // If all-lowercase (e.g. "performance marketer"), convert to Title Case with acronym preservation.
  if (!hasUpper || (!hasLower && trimmed.length > 4)) {
    return lowerAll
      .split(" ")
      .map((word, idx) => {
        if (UPPERCASE_ACRONYMS.has(word)) {
          if (word === "genai") return "GenAI";
          if (word === "nosql") return "NoSQL";
          if (word === "graphql") return "GraphQL";
          if (word === "apis") return "APIs";
          return word.toUpperCase();
        }
        if (idx > 0 && LOWERCASE_CONNECTORS.has(word)) return word;
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }

  return trimmed;
}

export function formatPlaceName(raw: string | null | undefined): string {
  const trimmed = (raw || "").trim().replace(/\s+/g, " ");
  if (!trimmed) return "";
  // Preserve short codes like USA, UAE, UK, NY, TN
  if (/^[A-Z]{2,3}$/.test(trimmed)) return trimmed;
  // Normalize ALL CAPS or all lowercase place names ("CHENNAI" -> "Chennai", "new delhi" -> "New Delhi")
  if (trimmed === trimmed.toUpperCase() || trimmed === trimmed.toLowerCase()) {
    return trimmed
      .toLowerCase()
      .split(" ")
      .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : ""))
      .join(" ");
  }
  return trimmed;
}

export function formatLocationDisplay(
  city?: string | null,
  state?: string | null,
  country?: string | null
): string {
  return [formatPlaceName(city), formatPlaceName(state), formatPlaceName(country)]
    .filter(Boolean)
    .join(", ");
}

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatExperienceDate(raw: string | null | undefined): string {
  const s = (raw || "").trim();
  if (!s) return "";
  if (/^(present|current|now)$/i.test(s)) return "Present";
  // YYYY-MM or YYYY-MM-DD
  const isoMatch = s.match(/^(\d{4})-(\d{2})(?:-\d{2})?$/);
  if (isoMatch) {
    const year = isoMatch[1];
    const monthIdx = Number(isoMatch[2]) - 1;
    // Note: safe_date('2022') in SQL stores '2022-01-01'; if day is 01 and month is 01 from year-only input,
    // check whether original was YYYY-01-01 vs YYYY-MM
    if (s.endsWith("-01-01")) return year;
    if (monthIdx >= 0 && monthIdx < 12) return `${MONTH_SHORT[monthIdx]} ${year}`;
    return year;
  }
  if (/^\d{4}$/.test(s)) return s;
  return s;
}

export function formatExperiencePeriod(start?: string | null, end?: string | null): string {
  const s = formatExperienceDate(start);
  const e = formatExperienceDate(end);
  if (s && e) return s === e ? s : `${s} – ${e}`;
  if (s && !e) return `${s} – Present`;
  if (!s && e === "Present") return "Current Role";
  return e || "";
}

export interface DescriptionBlock {
  type: "p" | "ul";
  items: string[];
}

/**
 * Parses multiline experience/project/bio text into clean paragraphs and `<ul>` bullet lists
 * whenever lines start with `- `, `• `, `* `, or `· `.
 */
export function parseDescriptionBlocks(raw: string | null | undefined): DescriptionBlock[] {
  const text = (raw || "").trim();
  if (!text) return [];

  const lines = text.split(/\r?\n/);
  const blocks: DescriptionBlock[] = [];
  let currentBullets: string[] = [];
  let currentPara: string[] = [];

  const flushBullets = () => {
    if (currentBullets.length > 0) {
      blocks.push({ type: "ul", items: currentBullets });
      currentBullets = [];
    }
  };

  const flushPara = () => {
    if (currentPara.length > 0) {
      blocks.push({ type: "p", items: [currentPara.join(" ")] });
      currentPara = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushBullets();
      flushPara();
      continue;
    }
    const bulletMatch = line.match(/^(?:[-•*·]|\d+[.)])\s+(.+)$/);
    if (bulletMatch) {
      flushPara();
      currentBullets.push(bulletMatch[1].trim());
    } else {
      flushBullets();
      currentPara.push(line);
    }
  }

  flushBullets();
  flushPara();
  return blocks;
}

const TONE_CYCLE: ("blue" | "red" | "violet" | "green")[] = ["blue", "red", "violet", "green"];

export function isTechnicalProfile(industry?: string | null, headline?: string | null): boolean {
  const combined = `${industry || ""} ${headline || ""}`.toLowerCase();
  return /(software|developer|engineer|full[- ]?stack|frontend|front[- ]?end|backend|back[- ]?end|devops|cloud|cyber|security|sre|architect|programming|coding)/.test(
    combined
  ) && !/(marketing|sales|hr|human resource|finance|account|recruit|brand|social media|content)/.test(combined);
}

/**
 * Picks an authentic, industry-appropriate Lucide icon for any skill, badge, or highlight card.
 * Never forces code `</>` or Cloud DevOps icons onto marketing, finance, design, HR, or operations profiles.
 */
export function pickDomainIcon(
  label: string,
  context = "",
  idx = 0
): { icon: LucideIcon; tone: "red" | "blue" | "green" | "violet" } {
  const text = `${label} ${context}`.toLowerCase();
  const tone = TONE_CYCLE[idx % TONE_CYCLE.length];

  if (/(market|seo|sem|ppc|ads|brand|campaign|social media|content|copywrit|public relation|growth|influencer|email)/.test(text)) {
    const icons: LucideIcon[] = [Megaphone, TrendingUp, Target, BarChart3];
    return { icon: icons[idx % icons.length], tone };
  }
  if (/(design|figma|ui|ux|creative|illustrat|video|motion|brand|canva|behance|photoshop|visual)/.test(text)) {
    const icons: LucideIcon[] = [Palette, Layers, Sparkles];
    return { icon: icons[idx % icons.length], tone };
  }
  if (/(financ|account|bank|bfsi|invest|valuation|audit|tax|fp&a|excel|tally|cfa|risk|wealth)/.test(text)) {
    const icons: LucideIcon[] = [Landmark, BarChart3, TrendingUp, ShieldCheck];
    return { icon: icons[idx % icons.length], tone };
  }
  if (/(human resource|hr|talent|recruit|people|onboard|payroll|compen|culture)/.test(text)) {
    const icons: LucideIcon[] = [Users, ClipboardCheck, Building2];
    return { icon: icons[idx % icons.length], tone };
  }
  if (/(sales|business dev|crm|account exec|client|revenue|partner|retail|e-commerce|shopify|merchandis)/.test(text)) {
    const icons: LucideIcon[] = [TrendingUp, Target, BriefcaseBusiness, Globe];
    return { icon: icons[idx % icons.length], tone };
  }
  if (/(data|analytics|machine learning|ai|ml|llm|python|sql|power bi|tableau|statistic|pytorch|kaggle)/.test(text)) {
    const icons: LucideIcon[] = [Brain, BarChart3, Database];
    return { icon: icons[idx % icons.length], tone };
  }
  if (/(cloud|aws|azure|gcp|docker|kubernetes|devops|terraform|linux|infra|security|cyber|iam)/.test(text)) {
    const icons: LucideIcon[] = [Cloud, ShieldCheck, Layers];
    return { icon: icons[idx % icons.length], tone };
  }
  if (/(react|typescript|javascript|node|java|golang|rust|c\+\+|software|full[- ]?stack|frontend|backend|api|git|code|web|mobile|flutter)/.test(text)) {
    const icons: LucideIcon[] = [Code2, Layers, Wrench];
    return { icon: icons[idx % icons.length], tone };
  }
  if (/(health|clinical|pharma|biotech|medical|care)/.test(text)) {
    const icons: LucideIcon[] = [Heart, ShieldCheck, Sparkles];
    return { icon: icons[idx % icons.length], tone };
  }

  const generalIcons: LucideIcon[] = [Sparkles, Target, BriefcaseBusiness, Award];
  return { icon: generalIcons[idx % generalIcons.length], tone };
}

const LEGACY_TECH_DEFAULTS = new Set([
  "end-to-end development",
  "cloud & devops",
  "ai/ml integration",
  "product thinking",
  "core engineering",
  "architecture & scale",
]);

export function hasCustomExpertiseCards(
  cards: ExpertiseCardItem[] | undefined | null,
  industry?: string | null,
  headline?: string | null
): boolean {
  if (!Array.isArray(cards) || cards.length === 0) return false;
  const nonEmpty = cards.filter((c) => c && (c.title?.trim() || c.sub?.trim()));
  if (nonEmpty.length === 0) return false;

  // If a non-technical candidate has the exact pre-seeded developer defaults from an earlier wizard run,
  // treat them as uncustomized so we render authentic domain-specific highlights instead.
  if (
    !isTechnicalProfile(industry, headline) &&
    nonEmpty.every((c) => LEGACY_TECH_DEFAULTS.has((c.title || "").trim().toLowerCase()))
  ) {
    return false;
  }
  return true;
}

export function buildSmartHighlights(params: {
  expertiseCards?: ExpertiseCardItem[] | null;
  headline?: string | null;
  jobRole?: string | null;
  industry?: string | null;
  yearsOfExperience?: number | null;
  experienceLevel?: string | null;
  skills?: { name: string; level?: string | null }[] | null;
  tools?: string[] | null;
  experiences?: { title?: string; company?: string }[] | null;
  workMode?: string | null;
  employmentType?: string | null;
  noticePeriod?: string | null;
  openToWork?: boolean | null;
  verified?: boolean | null;
  cir?: { score?: number | string; tier?: string } | null;
}): ExpertiseCardItem[] {
  if (hasCustomExpertiseCards(params.expertiseCards, params.industry, params.headline)) {
    return (params.expertiseCards || [])
      .filter((c) => c && (c.title?.trim() || c.sub?.trim()))
      .slice(0, 4)
      .map((c) => ({
        title: formatSmartTag(c.title),
        sub: c.sub?.trim() || "",
      }));
  }

  const roleTitle = formatSmartTag(params.headline || params.jobRole || "Professional Specialist");
  const domainSub =
    params.industry?.trim() ||
    (params.yearsOfExperience && params.yearsOfExperience > 0
      ? `${params.yearsOfExperience}+ Years Experience`
      : "Active Domain Practitioner");

  const skills = Array.isArray(params.skills) ? params.skills.filter((s) => s?.name?.trim()) : [];
  const tools = Array.isArray(params.tools) ? params.tools.filter((t) => t?.trim()) : [];
  const exps = Array.isArray(params.experiences) ? params.experiences.filter((e) => e?.company?.trim() || e?.title?.trim()) : [];

  const card1: ExpertiseCardItem = {
    title: clampText(roleTitle, 45),
    sub: clampText(domainSub, 70),
  };

  const card2: ExpertiseCardItem =
    skills.length >= 2
      ? {
          title: clampText(formatSmartTag(skills[0].name), 45),
          sub: clampText(
            skills
              .slice(1, 3)
              .map((s) => formatSmartTag(s.name))
              .join(" · "),
            70
          ),
        }
      : skills.length === 1
        ? {
            title: clampText(formatSmartTag(skills[0].name), 45),
            sub: `${formatSmartTag(skills[0].level || "Core")} Capability`,
          }
        : {
            title: "Core Domain Focus",
            sub: clampText(params.industry || "Role-aligned execution", 70),
          };

  const card3: ExpertiseCardItem =
    tools.length > 0
      ? {
          title: clampText(
            tools.length >= 2
              ? `${formatSmartTag(tools[0])} & ${formatSmartTag(tools[1])}`
              : `${formatSmartTag(tools[0])} Workflow`,
            45
          ),
          sub:
            tools.length > 2
              ? `+${tools.length - 2} more tools & platforms`
              : "Primary tools & platforms",
        }
      : exps.length > 0
        ? {
            title: clampText(exps[0].company || formatSmartTag(exps[0].title || "Experience"), 45),
            sub: clampText(
              params.yearsOfExperience && params.yearsOfExperience > 0
                ? `${params.yearsOfExperience}+ years industry experience`
                : formatSmartTag(exps[0].title || "Practical industry experience"),
              70
            ),
          }
        : {
            title: clampText(
              [params.workMode, params.employmentType].filter(Boolean).join(" · ") || "Flexible Work Mode",
              45
            ),
            sub: params.noticePeriod ? `Availability: ${params.noticePeriod}` : "Ready for new opportunities",
          };

  const card4: ExpertiseCardItem = params.cir?.score
    ? {
        title: `CIR ${Math.round(Number(params.cir.score))}/100`,
        sub: params.cir.tier ? `${params.cir.tier} Tier Verified` : "Career Intelligence Score",
      }
    : params.verified
      ? {
          title: "Identity Verified",
          sub: "IAmTalento Verified Talent",
        }
      : {
          title: params.openToWork === false ? "Verified Member" : "Open to Opportunities",
          sub: "IAmTalento Talent Network",
        };

  return [card1, card2, card3, card4];
}

export function getSuggestedToolsForIndustry(industry?: string | null): string[] {
  const ind = (industry || "").toLowerCase();
  if (ind.includes("marketing")) {
    return [
      "Google Analytics 4",
      "Google Ads",
      "Meta Ads Manager",
      "SEMrush",
      "Ahrefs",
      "HubSpot",
      "Canva",
      "Mailchimp",
      "Google Search Console",
      "Hootsuite",
    ];
  }
  if (ind.includes("finance") || ind.includes("bfsi")) {
    return [
      "Microsoft Excel",
      "Power BI",
      "SAP",
      "Tally Prime",
      "Bloomberg",
      "Tableau",
      "SQL",
      "QuickBooks",
      "Zoho Books",
      "Python",
    ];
  }
  if (ind.includes("design") || ind.includes("product")) {
    return ["Figma", "FigJam", "Jira", "Notion", "Miro", "Amplitude", "Mixpanel", "Framer", "Adobe Creative Cloud", "Linear"];
  }
  if (ind.includes("human resource") || ind.includes("hr")) {
    return ["LinkedIn Recruiter", "Workday", "Darwinbox", "Keka HR", "Greenhouse", "Excel", "Notion", "Slack"];
  }
  if (ind.includes("data")) {
    return ["Jupyter", "SQL", "Power BI", "Tableau", "Snowflake", "BigQuery", "Git", "Docker", "Airflow", "MLflow"];
  }
  if (ind.includes("e-commerce") || ind.includes("retail") || ind.includes("consulting")) {
    return ["Shopify", "Microsoft Excel", "PowerPoint", "Salesforce", "HubSpot", "Google Analytics", "Tableau", "Notion", "Jira"];
  }
  return ["VS Code", "Git & GitHub", "Docker", "Postman", "Figma", "Jira", "AWS", "Linux", "Notion", "Slack"];
}
