import React, { useState, useEffect, useMemo, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  Search,
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Award,
  Users,
  Check,
  X,
  ArrowRight,
  ChevronRight,
  Filter,
  BarChart3,
  Calendar,
  Sparkles,
  DollarSign,
  FileText,
  SlidersHorizontal,
  Bookmark,
  Send,
  Zap,
  Bot,
  CreditCard,
  Smartphone,
  Landmark,
  Wallet,
  Bell,
  Star,
  Trash2,
  Copy,
  Printer,
  Download,
  Plus,
  ArrowLeft,
  ExternalLink,
  MessageSquare,
  LogOut,
  RefreshCw,
  ChevronDown,
  Code2,
  Heart,
  Share2,
  Phone,
  Eye,
  Sliders,
  CheckCheck,
  TrendingUp,
  Compass,
  User,
  FolderKanban,
  Sun,
  Moon,
  ArrowRightLeft,
  Home,
  GraduationCap,
  Layers,
  Edit,
  BadgeCheck,
  Mail,
  Globe,
  Linkedin,
} from "lucide-react";

import {
  ProJob,
  ProCandidate,
  ProApplication,
  ProUser,
  SEED_JOBS_RAW,
  CANDIDATES_SEED,
  COMPANY_INFO,
  POPULAR_CERTS,
  SKILL_QUIZZES,
  JOB_TEMPLATES,
  BANKS,
  WALLETS,
  UPI_HANDLES,
  COMPANY_BENEFITS,
  STAGES,
  D_MS,
  calcScore,
  avgCandidateScore,
  levelFromExp,
  calcTalentScore,
  formatINR,
  getRemainingTime,
  timeAgo,
  generateHash,
  fitAnalysis,
} from "@/data/proData";

import {
  getCompanyLogo,
  getCandidatePhoto,
  COMPANY_LOGOS,
  CANDIDATE_PHOTOS,
} from "@/data/portalAssets";

interface ToastMessage {
  id: number;
  text: string;
}

const loadStorage = <T,>(key: string, defaultVal: T): T => {
  try {
    const val = localStorage.getItem("tq_" + key);
    return val ? JSON.parse(val) : defaultVal;
  } catch {
    return defaultVal;
  }
};

const saveStorage = <T,>(key: string, val: T): void => {
  try {
    localStorage.setItem("tq_" + key, JSON.stringify(val));
  } catch (e) {
    console.error("Storage error:", e);
  }
};

const DEFAULT_USERS: Record<string, ProUser> = {
  "demo.candidate@talento.app": {
    email: "cand@demo.com",
    role: "candidate",
    name: "Arjun Mehta",
    exp: 3,
    city: "Bengaluru",
    head: "Senior Full-Stack Engineer · Cloud & AI Specialist",
    about: "Frontend engineer with 3+ years delivering accessible, high-performance web products. Experienced in modern component architectures, TypeScript, state machines, and Web Vitals optimization. Passionate about developer tooling and bridging UX with rock-solid frontend engineering.",
    sk: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Node.js", "SQL", "GraphQL", "Docker", "Jest", "Git"],
    sl: { React: "Expert", TypeScript: "Advanced", "Next.js": "Advanced", "Tailwind CSS": "Expert", "Node.js": "Intermediate", SQL: "Intermediate", GraphQL: "Intermediate", Docker: "Basic", Jest: "Advanced", Git: "Advanced" },
    as: { React: 88, SQL: 82, Python: 75, "System Design": 85 },
    ce: ["Meta Certified Frontend Developer", "AWS Certified Cloud Practitioner"],
    ex: [
      { co: "Swiggy", role: "Frontend Developer", fr: "2023", to: "Present", d: "Engineered customer checkout flow reducing page load by 35%. Spearheaded design system migration to Tailwind CSS and Radix UI across 6 pods." },
      { co: "Infosys", role: "Junior Software Engineer", fr: "2021", to: "2023", d: "Modernized legacy enterprise banking dashboards into responsive React apps. Automated unit testing suite achieving 92% code coverage with Jest." },
    ],
    ed: [{ sc: "VTU Bengaluru (Anna University Affiliate)", dg: "B.Tech Computer Science & Engineering", yr: "2017 – 2021" }],
    pj: [
      { t: "OpenUI React Components", l: "github.com/vignesh/openui", d: "Tree-shakeable, WCAG AA compliant headless UI system with 1.2k stars." },
      { t: "Pulse Health Tracker", l: "pulse-demo.app", d: "Realtime health tracking PWA built with Next.js, IndexedDB, and WebSockets." },
    ],
    links: { li: "linkedin.com/in/vignesh-dev", gh: "github.com/vignesh" },
    pf: { sal: 22, np: 15, wm: "Remote / Hybrid", ty: "Full-time", loc: "Bengaluru, Hyderabad, Remote", rl: true },
    st: "Open to offers",
    saved: [1, 3, 5],
    wal: { bal: 1450, hist: [{ id: 1, desc: "Bonus: React Skill Verified 88%", amt: 500, dt: Date.now() - 86400000 * 2 }] },
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
    wal: { bal: 9200, hist: [{ id: 1, desc: "Recruiter Credits Refill", amt: 10000, dt: Date.now() - 86400000 * 5 }] },
    ver: { id: true, test: true, exp: true },
  },
};

const DEFAULT_APPS: ProApplication[] = [
  {
    id: 1001,
    jid: 1,
    who: "demo.candidate@talento.app",
    name: "Vignesh",
    exp: 3,
    sk: ["React", "TypeScript", "SQL"],
    ce: ["Meta Certified Frontend Developer"],
    as: { React: 88, SQL: 82 },
    st: "Shortlisted",
    at: Date.now() - 86400000 * 1.5,
    cn: "Very excited to bring my experience building design systems at scale to Zoho.",
    upd: [
      { msg: "Application received. 24-hour review SLA activated.", at: Date.now() - 86400000 * 1.4, auto: true },
      { msg: "Your profile has been shortlisted by the engineering lead. Technical interview round is scheduled.", at: Date.now() - 86400000 * 0.8 },
    ],
  },
  {
    id: 1002,
    jid: 3,
    who: "demo.candidate@talento.app",
    name: "Vignesh",
    exp: 3,
    sk: ["React", "TypeScript", "SQL"],
    ce: ["AWS Certified Cloud Practitioner"],
    as: { React: 88 },
    st: "Applied",
    at: Date.now() - 3600000 * 14,
    cn: "Looking forward to contributing to Razorpay's high-frequency payments frontend.",
    upd: [
      { msg: "Application received. Employer notified of 24h SLA response window.", at: Date.now() - 3600000 * 14, auto: true },
    ],
  },
];

const TalentoPro: React.FC = () => {
  const navigate = useNavigate();

  // Connect My Profile to /demo-profile
  // Navigation & Shell State
  const [activeView, setActiveView] = useState<string>("jobs");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [sessionEmail, setSessionEmail] = useState<string>(() => loadStorage("sess", "demo.candidate@talento.app"));

  useEffect(() => {
    if (activeView === "profile") {
      navigate("/demo-profile");
    }
  }, [activeView, navigate]);

  // Storage synced states
  const [users, setUsers] = useState<Record<string, ProUser>>(() => loadStorage("users", DEFAULT_USERS));

  const INITIAL_JOBS: ProJob[] = useMemo(() => {
    return SEED_JOBS_RAW.map((s, i) => ({
      id: i + 1,
      t: s[0],
      c: s[1],
      l: s[2],
      m: s[3],
      ty: s[4],
      e: s[5],
      a: s[6],
      b: s[7],
      sk: s[8],
      at: Date.now() - (s[9] || 0) * 86400000,
      by: s[1] === "Super30" ? "demo.employer@talento.app" : "hr@" + s[1].toLowerCase().replace(/[^a-z]/g, "") + ".com",
    }));
  }, []);

  const [jobs, setJobs] = useState<ProJob[]>(() => {
    try {
      const val = localStorage.getItem("tq_jobs");
      if (!val) return INITIAL_JOBS;
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0].t === "string") return parsed;
    } catch {}
    return INITIAL_JOBS;
  });

  const [apps, setApps] = useState<ProApplication[]>(() => loadStorage("apps", DEFAULT_APPS));

  // Current User
  const currentUser: ProUser = useMemo(() => {
    return users[sessionEmail] || DEFAULT_USERS["demo.candidate@talento.app"];
  }, [users, sessionEmail]);

  const currentRole: "candidate" | "employer" = currentUser.role || "candidate";

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [smartSearchQuery, setSmartSearchQuery] = useState("");
  const [selectedExp, setSelectedExp] = useState<string>("");
  const [sortBy, setSortBy] = useState<"default" | "match" | "sal" | "new">("default");
  const [compareJobs, setCompareJobs] = useState<number[]>([]);

  const [filters, setFilters] = useState({
    q: "",
    loc: "",
    m: [] as string[],
    ty: [] as string[],
    lvl: [] as string[],
    co: [] as string[],
    ind: [] as string[],
    sz: [] as string[],
    sk: "",
    sal: 0,
    e: 30,
    p: 0,
    sort: "default",
    hide: false,
    mm: 0,
  });

  // Drawers
  const [activeDrawer, setActiveDrawer] = useState<
    | { type: "job"; id: number }
    | { type: "candidate"; name: string; jobId?: number }
    | { type: "compare-jobs" }
    | null
  >(null);

  // Profile view states
  const [profileTab, setProfileTab] = useState<"ov" | "ex" | "sk" | "pf" | "as">("ov");
  const [isEmployerPreview, setIsEmployerPreview] = useState(false);

  // Resume builder state
  const [resumeData, setResumeData] = useState({
    targetRole: "Senior Frontend Engineer",
    summary: "Experienced React Developer with 3+ years delivering accessible, high-performance web products. Specializes in modern component architecture, TypeScript, and Web Vitals optimization.",
  });

  // Wallet top-up state
  const [walletAmount, setWalletAmount] = useState<string>("500");

  // AI Chat state
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState<{ role: "u" | "a"; text: string }[]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const showToast = (text: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  };

  const searchQueryInputRef = useRef<HTMLInputElement>(null);

  // Sync to local storage
  useEffect(() => { saveStorage("jobs", jobs); }, [jobs]);
  useEffect(() => { saveStorage("users", users); }, [users]);
  useEffect(() => { saveStorage("apps", apps); }, [apps]);
  useEffect(() => { saveStorage("sess", sessionEmail); }, [sessionEmail]);

  // Keyboard shortcut '/' to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        searchQueryInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Quick switch role
  const switchUserRole = (role: "candidate" | "employer") => {
    const targetEmail = role === "candidate" ? "demo.candidate@talento.app" : "demo.employer@talento.app";
    setSessionEmail(targetEmail);
    setActiveView(role === "candidate" ? "jobs" : "talent");
    showToast(`Switched to ${role === "candidate" ? "Candidate Mode (Vignesh)" : "Employer Mode (Super30)"}`);
  };

  // Preset Filters
  const togglePreset = (preset: "remote" | "fresher" | "pay" | "new" | "match") => {
    if (preset === "remote") {
      setFilters((f) => ({
        ...f,
        m: f.m.includes("Remote") ? f.m.filter((x) => x !== "Remote") : [...f.m, "Remote"],
      }));
    } else if (preset === "fresher") {
      setFilters((f) => ({
        ...f,
        lvl: f.lvl.includes("Fresher") ? f.lvl.filter((x) => x !== "Fresher") : [...f.lvl, "Fresher"],
      }));
    } else if (preset === "pay") {
      setFilters((f) => ({ ...f, sal: f.sal >= 20 ? 0 : 20 }));
    } else if (preset === "new") {
      setFilters((f) => ({ ...f, p: f.p === 1 ? 0 : 1 }));
    } else if (preset === "match") {
      setSortBy((s) => (s === "match" ? "default" : "match"));
    }
  };

  // Smart Search Handler
  const handleSmartSearch = () => {
    if (!smartSearchQuery.trim()) return;
    const q = smartSearchQuery.toLowerCase();

    const modes: string[] = [];
    if (q.includes("remote")) modes.push("Remote");
    if (q.includes("hybrid")) modes.push("Hybrid");
    if (q.includes("onsite")) modes.push("Onsite");

    const salMatch = q.match(/(\d+)\s*(lpa|lakh|l\b)/i);
    const minSal = salMatch ? parseInt(salMatch[1]) : 0;

    const lvls: string[] = [];
    if (q.includes("fresher")) lvls.push("Fresher");
    if (q.includes("junior")) lvls.push("Junior");
    if (q.includes("mid")) lvls.push("Mid");
    if (q.includes("senior")) lvls.push("Senior");

    const cities = ["Bengaluru", "Pune", "Hyderabad", "Mumbai", "Delhi", "Chennai", "Noida", "Gurugram"];
    const matchedCity = cities.find((c) => q.includes(c.toLowerCase())) || "";

    const knownSkills = ["React", "TypeScript", "SQL", "Node.js", "Python", "Java", "AWS", "Docker", "Next.js", "Tailwind"];
    const matchedSkills = knownSkills.filter((s) => q.includes(s.toLowerCase()));

    setFilters((prev) => ({
      ...prev,
      m: modes.length > 0 ? modes : prev.m,
      sal: minSal > 0 ? minSal : prev.sal,
      lvl: lvls.length > 0 ? lvls : prev.lvl,
      loc: matchedCity || prev.loc,
      sk: matchedSkills.length > 0 ? matchedSkills.join(", ") : prev.sk,
    }));

    if (matchedCity) setSearchLocation(matchedCity);
    showToast(`Smart search applied: found matches for "${smartSearchQuery}"`);
  };

  // Top companies list
  const topCompaniesList = useMemo(() => [
    { name: "Zoho", count: 8, city: "Chennai", logo: getCompanyLogo("Zoho") },
    { name: "Flipkart", count: 12, city: "Bengaluru", logo: getCompanyLogo("Flipkart") },
    { name: "Razorpay", count: 7, city: "Bengaluru", logo: getCompanyLogo("Razorpay") },
    { name: "Swiggy", count: 9, city: "Bengaluru", logo: getCompanyLogo("Swiggy") },
    { name: "Infosys", count: 15, city: "Bengaluru", logo: getCompanyLogo("Infosys") },
    { name: "Atlassian", count: 6, city: "Bengaluru", logo: getCompanyLogo("Atlassian") },
    { name: "Google", count: 11, city: "Bengaluru", logo: getCompanyLogo("Google") },
    { name: "Microsoft", count: 14, city: "Hyderabad", logo: getCompanyLogo("Microsoft") },
    { name: "Amazon", count: 18, city: "Hyderabad", logo: getCompanyLogo("Amazon") },
  ], []);

  const toggleCompanyFilter = (companyName: string) => {
    setFilters((prev) => ({
      ...prev,
      co: prev.co.includes(companyName)
        ? prev.co.filter((c) => c !== companyName)
        : [...prev.co, companyName],
    }));
  };

  // Recommended jobs
  const recommendedJobs = useMemo(() => {
    return [...jobs]
      .sort((a, b) => calcScore(b, currentUser) - calcScore(a, currentUser))
      .slice(0, 5);
  }, [jobs, currentUser]);

  // Top skills chips
  const topSkillsList = useMemo(() => [
    "React", "TypeScript", "SQL", "Node.js", "Python", "AWS", "Docker", "Next.js", "GraphQL", "Tailwind CSS", "Java", "PostgreSQL"
  ], []);

  const toggleSkill = (skill: string) => {
    const currentSkills = (filters.sk || "").split(",").map((s) => s.trim()).filter(Boolean);
    const nextSkills = currentSkills.includes(skill)
      ? currentSkills.filter((s) => s !== skill)
      : [...currentSkills, skill];
    setFilters((prev) => ({ ...prev, sk: nextSkills.join(", ") }));
  };

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    const q = (searchQuery || filters.q).toLowerCase().trim();
    const loc = (searchLocation || filters.loc).toLowerCase().trim();
    const reqSkills = (filters.sk || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);

    return jobs.filter((j) => {
      if (q && !(j.t.toLowerCase().includes(q) || j.c.toLowerCase().includes(q) || (j.sk || []).some((s) => s.toLowerCase().includes(q)))) {
        return false;
      }
      if (loc && !j.l.toLowerCase().includes(loc)) return false;
      if (filters.m.length > 0 && !filters.m.includes(j.m)) return false;
      if (filters.ty.length > 0 && !filters.ty.includes(j.ty)) return false;
      if (filters.co.length > 0 && !filters.co.includes(j.c)) return false;
      if (filters.sal > 0 && j.b < filters.sal) return false;
      if (filters.e < 30 && j.e > filters.e) return false;
      if (reqSkills.length > 0 && !reqSkills.every((k) => (j.sk || []).map((s) => s.toLowerCase()).includes(k))) return false;
      if (filters.mm > 0 && calcScore(j, currentUser) < filters.mm) return false;
      if (filters.hide && apps.some((a) => a.jid === j.id && a.who === currentUser.email)) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === "match" || filters.sort === "match") {
        return calcScore(b, currentUser) - calcScore(a, currentUser);
      }
      if (sortBy === "sal" || filters.sort === "sal") {
        return b.b - a.b;
      }
      if (sortBy === "new" || filters.sort === "new") {
        return b.at - a.at;
      }
      return 0;
    });
  }, [jobs, searchQuery, searchLocation, filters, sortBy, currentUser, apps]);

  // Actions
  const handleQuickApply = (jobId: number) => {
    const existing = apps.find((a) => a.jid === jobId && a.who === currentUser.email);
    if (existing) {
      showToast("You have already applied for this opening.");
      return;
    }

    const job = jobs.find((j) => j.id === jobId);
    const newApp: ProApplication = {
      id: Date.now(),
      jid: jobId,
      who: currentUser.email,
      name: currentUser.name,
      exp: currentUser.exp || 0,
      sk: currentUser.sk || [],
      ce: currentUser.ce || [],
      as: currentUser.as || {},
      st: "Applied",
      at: Date.now(),
      cn: "Applied via I Am Talento 24-Hour Verified FastTrack.",
      upd: [
        {
          msg: "Application verified. Employer 24-Hour Review SLA timer activated.",
          at: Date.now(),
          auto: true,
        },
      ],
    };

    setApps((prev) => [newApp, ...prev]);
    showToast(`Applied to ${job?.t || "Job"}! 24-Hour SLA response guarantee is now active.`);
  };

  const handleToggleSaveJob = (jobId: number) => {
    const isSaved = (currentUser.saved || []).includes(jobId);
    const nextSaved = isSaved
      ? (currentUser.saved || []).filter((id) => id !== jobId)
      : [...(currentUser.saved || []), jobId];

    setUsers((prev) => ({
      ...prev,
      [currentUser.email]: {
        ...currentUser,
        saved: nextSaved,
      },
    }));
    showToast(isSaved ? "Job removed from saved bookmarks." : "Job saved to your bookmarks.");
  };

  // AI chat send
  const handleSendAiMessage = () => {
    if (!aiInput.trim()) return;
    const text = aiInput;
    setAiMessages((prev) => [...prev, { role: "u", text }]);
    setAiInput("");
    setIsAiThinking(true);

    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply = "";
      if (lower.includes("resume") || lower.includes("ats")) {
        reply = "I evaluated your profile: Your React & TypeScript experience gives you a 92% ATS score for Frontend roles. Add your verified 88% assessment badge to stand out even more!";
      } else if (lower.includes("salary") || lower.includes("pay")) {
        reply = "For 3 years of experience in Bengaluru, frontend roles typically range between ₹16L - ₹28L LPA. Your profile target is set competitively at ₹20L.";
      } else {
        reply = `You have ${filteredJobs.length} live matches on Talento Pro. Your highest match is ${filteredJobs[0]?.t} at ${filteredJobs[0]?.c} (${calcScore(filteredJobs[0], currentUser)}% skill fit).`;
      }
      setAiMessages((prev) => [...prev, { role: "a", text: reply }]);
      setIsAiThinking(false);
    }, 700);
  };

  // Nav configuration (Clean Lucide Icons, ZERO EMOJIS)
  const candidateNav = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "jobs", label: "Find Jobs", icon: Search },
    { id: "port", label: "Portfolio", icon: FolderKanban },
    { id: "upd", label: "Notifications", icon: Bell, badge: apps.filter((a) => a.who === currentUser.email).flatMap((a) => a.upd || []).length },
    { id: "dash", label: "Dashboard", icon: BarChart3 },
    { id: "disc", label: "Discover", icon: Compass },
    { id: "saved", label: "Saved Roles", icon: Bookmark, badge: (currentUser.saved || []).length },
    { id: "applied", label: "Applications", icon: FileText, badge: apps.filter((a) => a.who === currentUser.email).length },
    { id: "cert", label: "Certifications", icon: Award },
    { id: "resume", label: "AI Resume Builder", icon: Bot },
    { id: "ver", label: "Verified Profile", icon: ShieldCheck },
    { id: "wallet", label: "Wallet", icon: Wallet },
  ];

  const employerNav = [
    { id: "cp", label: "Company Profile", icon: Building2 },
    { id: "talent", label: "Find Talent", icon: Users },
    { id: "port", label: "Portfolio", icon: FolderKanban },
    { id: "notif", label: "Notifications", icon: Bell },
    { id: "dash", label: "Analytics", icon: BarChart3 },
    { id: "pipe", label: "Hiring Pipeline", icon: Layers, badge: apps.length },
    { id: "post", label: "Post a Job", icon: Plus },
    { id: "ver", label: "Verified Company", icon: ShieldCheck },
    { id: "wallet", label: "Corporate Wallet", icon: Wallet },
  ];

  const currentNav = currentRole === "candidate" ? candidateNav : employerNav;

  return (
    <>
      <Helmet>
        <title>IAmTalento Pro — Verified Jobs Portal</title>
        <meta name="description" content="AI-matched career openings with 24-hour SLA responses." />
      </Helmet>

      {/* Floating Toast Notification */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="rounded-xl bg-[#17171d] text-white px-5 py-3 text-sm font-semibold shadow-2xl border border-white/20 animate-fade-in pointer-events-auto flex items-center gap-2.5 font-sans"
          >
            <Sparkles className="h-4 w-4 text-[#ec2639] shrink-0" />
            <span>{t.text}</span>
          </div>
        ))}
      </div>

      {/* Application Shell */}
      <div className={cn("min-h-screen flex flex-col md:flex-row font-sans selection:bg-[#ec2639] selection:text-white", "bg-[#f6f6f9] text-gray-900")}>
        
        {/* ================= LEFT RED SIDEBAR (aside.sb) ================= */}
        <aside className="w-full md:w-64 md:min-w-[250px] bg-[#ec2639] text-white flex flex-col md:h-screen md:sticky md:top-0 p-4 shrink-0 z-40 select-none shadow-2xl overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6 px-1">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shadow-inner">
              <Zap className="h-5 w-5 fill-current" />
            </div>
            <Link to="/" className="text-xl font-display font-bold tracking-tight text-white hover:opacity-90 flex items-center">
              <span>IAm<span className="font-extrabold">Talento</span></span>
              <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white tracking-widest uppercase">Pro</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            {currentNav.map((t) => {
              const isActive = activeView === t.id;
              const IconComp = t.icon;

              if (t.id === "profile") {
                return (
                  <Link
                    key={t.id}
                    to="/demo-profile"
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all text-left cursor-pointer text-white/85 hover:text-white hover:bg-white/15"
                  >
                    <span className="flex items-center gap-3">
                      <IconComp className="h-4 w-4 shrink-0 text-white/90" />
                      <span>{t.label}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-[#ec2639]">
                      View
                    </span>
                  </Link>
                );
              }

              return (
                <button
                  key={t.id}
                  onClick={() => setActiveView(t.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all text-left cursor-pointer",
                    isActive
                      ? "bg-white text-[#ec2639] font-bold shadow-lg shadow-black/10"
                      : "text-white/85 hover:text-white hover:bg-white/15"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <IconComp className={cn("h-4 w-4 shrink-0", isActive ? "text-[#ec2639]" : "text-white/90")} />
                    <span>{t.label}</span>
                  </span>
                  {Boolean(t.badge) && (
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[11px] font-bold",
                      isActive ? "bg-[#ec2639] text-white" : "bg-white text-[#ec2639]"
                    )}>
                      {t.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex-1 my-3 min-h-6" />

          {/* User Capsule */}
          <Link
            to="/demo-profile"
            className="bg-white/15 rounded-2xl p-2.5 flex items-center gap-2.5 mb-3 border border-white/10 hover:bg-white/25 transition-all cursor-pointer"
            title="View Arjun Mehta Demo Profile"
          >
            <div className="w-9 h-9 rounded-full bg-white text-[#ec2639] font-display font-extrabold flex items-center justify-center text-sm shadow-sm shrink-0">
              {currentRole === "candidate" ? "A" : (currentUser.cp?.name?.[0] || "S")}
            </div>
            <div className="min-w-0 flex-1">
              <b className="block text-sm font-bold text-white truncate font-display">
                {currentRole === "candidate" ? "Arjun Mehta" : (currentUser.cp?.name || "Super30")}
              </b>
              <small className="block text-xs text-white/70 truncate capitalize font-sans">
                {currentRole === "candidate" ? "Candidate · Demo Profile" : "Employer"}
              </small>
            </div>
          </Link>

          {/* Bottom Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-medium text-xs transition-colors shrink-0 cursor-pointer"
              title="Toggle theme"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => switchUserRole(currentRole === "candidate" ? "employer" : "candidate")}
              className="flex-1 py-2 px-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-colors truncate text-center cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ArrowRightLeft className="h-3.5 w-3.5 shrink-0" />
              <span>{currentRole === "candidate" ? "Switch to Employer" : "Switch to Candidate"}</span>
            </button>
          </div>
        </aside>

        {/* ================= RIGHT MAIN AREA ================= */}
        <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8 overflow-y-auto">

          {/* ================= VIEW: FIND JOBS (CANDIDATE WORKSPACE) ================= */}
          {activeView === "jobs" && (
            <div className="space-y-6">
              
              {/* Glowing Red Hero Banner (Zero emojis, Space Grotesk display font) */}
              <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-[#ec2639] to-[#d61e31] text-white p-6 md:p-8 shadow-xl border border-white/10">
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/15 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-10 right-48 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />

                <div className="relative z-10">
                  <h1 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight mb-1 text-white">
                    Hi {currentUser.name.split(" ")[0]}, ready for your next role?
                  </h1>
                  <p className="text-white/90 text-sm md:text-base mb-5 font-normal">
                    {jobs.length} verified openings from {new Set(jobs.map((j) => j.c)).size} companies, matched to your skills.
                  </p>

                  {/* Search Row 1: Keyword + Location + Search Button */}
                  <div className="flex flex-col sm:flex-row gap-2.5 mb-2.5">
                    <div className="relative flex-1">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      <input
                        ref={searchQueryInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Title, designation, or company (Press / to focus)"
                        className="w-full bg-white text-gray-900 placeholder:text-gray-400 border-0 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 font-sans shadow-sm"
                      />
                    </div>
                    <div className="relative w-full sm:w-56">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        placeholder="City or region"
                        className="w-full bg-white text-gray-900 placeholder:text-gray-400 border-0 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 font-sans shadow-sm"
                      />
                    </div>
                    <button
                      onClick={() => showToast(`Searching for "${searchQuery || "all roles"}"`)}
                      className="bg-gray-900 hover:bg-black text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-md transition-all shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Search className="h-4 w-4" />
                      <span>Search</span>
                    </button>
                  </div>

                  {/* Search Row 2: Smart Search */}
                  <div className="flex flex-col sm:flex-row gap-2.5 mb-4">
                    <div className="relative flex-1">
                      <Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        value={smartSearchQuery}
                        onChange={(e) => setSmartSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSmartSearch()}
                        placeholder='Smart search: try "react remote 15 lpa" or "fresher java pune"'
                        className="w-full bg-white text-gray-900 placeholder:text-gray-400 border-0 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 font-sans shadow-sm"
                      />
                    </div>
                    <button
                      onClick={handleSmartSearch}
                      className="bg-gray-900 hover:bg-black text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-md transition-all shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Smart Find</span>
                    </button>
                  </div>

                  {/* Preset Filter Pills (Clean Lucide Icons, ZERO EMOJIS) */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      onClick={() => togglePreset("remote")}
                      className={cn(
                        "px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5",
                        filters.m.includes("Remote")
                          ? "bg-white text-[#ec2639] border-white font-bold"
                          : "bg-white/15 hover:bg-white/25 text-white border-white/25"
                      )}
                    >
                      <Home className="h-3.5 w-3.5" />
                      <span>Remote</span>
                    </button>
                    <button
                      onClick={() => togglePreset("fresher")}
                      className={cn(
                        "px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5",
                        filters.lvl.includes("Fresher")
                          ? "bg-white text-[#ec2639] border-white font-bold"
                          : "bg-white/15 hover:bg-white/25 text-white border-white/25"
                      )}
                    >
                      <GraduationCap className="h-3.5 w-3.5" />
                      <span>Freshers</span>
                    </button>
                    <button
                      onClick={() => togglePreset("pay")}
                      className={cn(
                        "px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5",
                        filters.sal >= 20
                          ? "bg-white text-[#ec2639] border-white font-bold"
                          : "bg-white/15 hover:bg-white/25 text-white border-white/25"
                      )}
                    >
                      <TrendingUp className="h-3.5 w-3.5" />
                      <span>₹20L+ Salary</span>
                    </button>
                    <button
                      onClick={() => togglePreset("new")}
                      className={cn(
                        "px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5",
                        filters.p === 1
                          ? "bg-white text-[#ec2639] border-white font-bold"
                          : "bg-white/15 hover:bg-white/25 text-white border-white/25"
                      )}
                    >
                      <Clock className="h-3.5 w-3.5" />
                      <span>New Today</span>
                    </button>
                    <button
                      onClick={() => togglePreset("match")}
                      className={cn(
                        "px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5",
                        sortBy === "match"
                          ? "bg-white text-[#ec2639] border-white font-bold"
                          : "bg-white/15 hover:bg-white/25 text-white border-white/25"
                      )}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Best Match</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Top Hiring Companies Strip */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[#ec2639]" />
                  <h2 className="text-sm font-display font-bold text-gray-900 tracking-tight">Top Hiring Companies</h2>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                  {topCompaniesList.map((co) => (
                    <div
                      key={co.name}
                      onClick={() => toggleCompanyFilter(co.name)}
                      className={cn(
                        "bg-white border rounded-2xl p-4 min-w-[155px] flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 hover:-translate-y-1 shrink-0 shadow-sm",
                        filters.co.includes(co.name) ? "border-[#ec2639] ring-1 ring-[#ec2639]" : "border-gray-200 hover:border-[#ec2639]/60"
                      )}
                    >
                      <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center p-2.5 mb-2.5 shadow-xs">
                        <img src={co.logo} alt={co.name} className="max-h-full max-w-full object-contain" />
                      </div>
                      <div className="font-display font-bold text-xs text-gray-900 truncate w-full">{co.name}</div>
                      <div className="text-[11px] text-gray-500 truncate mt-0.5">{co.count} openings · {co.city}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended For You Strip */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#ec2639]" />
                  <h2 className="text-sm font-display font-bold text-gray-900 tracking-tight">Recommended For You</h2>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                  {recommendedJobs.map((j) => {
                    const mScore = calcScore(j, currentUser);
                    return (
                      <div
                        key={j.id}
                        onClick={() => setActiveDrawer({ type: "job", id: j.id })}
                        className="bg-white border border-gray-200 hover:border-[#ec2639]/70 rounded-2xl p-4 min-w-[280px] max-w-[320px] flex flex-col justify-between cursor-pointer transition-all duration-200 hover:-translate-y-1 shrink-0 group shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-3 mb-2.5">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-2 shrink-0 shadow-xs">
                            <img src={getCompanyLogo(j.c)} alt={j.c} className="max-h-full max-w-full object-contain" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-display font-bold text-sm text-white group-hover:text-[#ec2639] transition-colors truncate">{j.t}</div>
                            <div className="text-xs text-gray-500 truncate">{j.c}</div>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-[#ec2639]/15 text-[#ec2639] font-display font-extrabold border border-[#ec2639]/30 flex items-center justify-center text-xs shrink-0">
                            {mScore}%
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 font-medium pt-2.5 border-t border-gray-200 flex items-center justify-between">
                          <span>₹{j.a}–{j.b}L</span>
                          <span>{j.m} · {j.ty}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Filter By Skill Strip */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-[#ec2639]" />
                  <h2 className="text-sm font-display font-bold text-gray-900 tracking-tight">Filter by Core Skills</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {topSkillsList.map((skill) => {
                    const isSelected = (filters.sk || "").toLowerCase().includes(skill.toLowerCase());
                    return (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={cn(
                          "px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer",
                          isSelected
                            ? "bg-[#ec2639] text-white border-[#ec2639] shadow-sm font-bold"
                            : "bg-white text-gray-900/80 border-gray-200 hover:border-[#ec2639]/60 hover:text-[#ec2639]"
                        )}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main Grid: Filter Sidebar + Job Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-start pt-2">
                
                {/* Left Filter Sidebar */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 text-xs shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                    <span className="font-display font-bold text-sm text-gray-900 flex items-center gap-1.5">
                      <Filter className="h-3.5 w-3.5 text-[#ec2639]" /> Advanced Filters
                    </span>
                    <button
                      onClick={() => setFilters({
                        q: "", loc: "", m: [], ty: [], lvl: [], co: [], ind: [], sz: [],
                        sk: "", sal: 0, e: 30, p: 0, sort: "default", hide: false, mm: 0,
                      })}
                      className="text-[#ec2639] font-bold hover:underline cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>

                  {/* Work Mode */}
                  <div>
                    <label className="font-semibold text-gray-700 block mb-2">Work Mode</label>
                    <div className="space-y-1.5">
                      {["Remote", "Hybrid", "Onsite"].map((mode) => (
                        <label key={mode} className="flex items-center gap-2 text-gray-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.m.includes(mode)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setFilters((f) => ({
                                ...f,
                                m: checked ? [...f.m, mode] : f.m.filter((x) => x !== mode),
                              }));
                            }}
                            className="rounded border-gray-200 text-[#ec2639] focus:ring-[#ec2639]"
                          />
                          <span>{mode}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Job Type */}
                  <div>
                    <label className="font-semibold text-gray-700 block mb-2">Job Type</label>
                    <div className="space-y-1.5">
                      {["Full-time", "Internship", "Contract"].map((ty) => (
                        <label key={ty} className="flex items-center gap-2 text-gray-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.ty.includes(ty)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setFilters((f) => ({
                                ...f,
                                ty: checked ? [...f.ty, ty] : f.ty.filter((x) => x !== ty),
                              }));
                            }}
                            className="rounded border-gray-200 text-[#ec2639] focus:ring-[#ec2639]"
                          />
                          <span>{ty}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Min Match Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-semibold text-gray-700">Min Match</label>
                      <b className="text-[#ec2639] font-bold font-display">{filters.mm}%</b>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="90"
                      step="10"
                      value={filters.mm}
                      onChange={(e) => setFilters((f) => ({ ...f, mm: +e.target.value }))}
                      className="w-full accent-[#ec2639] cursor-pointer"
                    />
                  </div>

                  {/* Max Exp Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-semibold text-gray-700">Max Experience</label>
                      <b className="text-[#ec2639] font-bold font-display">{filters.e} yrs</b>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      value={filters.e}
                      onChange={(e) => setFilters((f) => ({ ...f, e: +e.target.value }))}
                      className="w-full accent-[#ec2639] cursor-pointer"
                    />
                  </div>

                  {/* Min Salary Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-semibold text-gray-700">Min Salary</label>
                      <b className="text-[#ec2639] font-bold font-display">₹{filters.sal}L</b>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="60"
                      step="2"
                      value={filters.sal}
                      onChange={(e) => setFilters((f) => ({ ...f, sal: +e.target.value }))}
                      className="w-full accent-[#ec2639] cursor-pointer"
                    />
                  </div>

                  {/* Must-have skills */}
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1.5">Must-Have Skills</label>
                    <input
                      type="text"
                      value={filters.sk}
                      onChange={(e) => setFilters((f) => ({ ...f, sk: e.target.value }))}
                      placeholder="React, SQL"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-900"
                    />
                  </div>

                  {/* Hide applied */}
                  <label className="flex items-center gap-2 text-gray-600 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={filters.hide}
                      onChange={(e) => setFilters((f) => ({ ...f, hide: e.target.checked }))}
                      className="rounded border-gray-200 text-[#ec2639]"
                    />
                    <span>Hide already applied</span>
                  </label>
                </div>

                {/* Right Job Cards List */}
                <div className="space-y-4">
                  {/* List Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-gray-200">
                    <span className="text-sm font-display font-bold text-gray-900">
                      <b>{filteredJobs.length}</b> live openings found
                    </span>
                    <div className="flex items-center gap-3">
                      {compareJobs.length > 1 && (
                        <button
                          onClick={() => setActiveDrawer({ type: "compare-jobs" })}
                          className="px-3 py-1.5 rounded-lg bg-[#ec2639] text-white text-xs font-bold cursor-pointer"
                        >
                          Compare ({compareJobs.length})
                        </button>
                      )}
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="bg-white border border-gray-200 rounded-lg px-2.5 py-1 text-xs text-white cursor-pointer font-sans"
                      >
                        <option value="default">Default Order</option>
                        <option value="match">Best Match</option>
                        <option value="sal">Highest Salary</option>
                        <option value="new">Newest</option>
                      </select>
                    </div>
                  </div>

                  {/* Job Cards */}
                  {filteredJobs.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-gray-500">
                      <p className="font-display font-bold text-base text-gray-900 mb-1">No jobs match your active filters.</p>
                      <p className="text-xs">Try clearing some filters or searching for different keywords.</p>
                    </div>
                  ) : (
                    filteredJobs.map((j) => {
                      const matchScore = calcScore(j, currentUser);
                      const isSaved = (currentUser.saved || []).includes(j.id);
                      const hasApplied = apps.some((a) => a.jid === j.id && a.who === currentUser.email);
                      const isComparing = compareJobs.includes(j.id);

                      return (
                        <div
                          key={j.id}
                          className="bg-white border border-gray-200 hover:border-[#ec2639]/70 rounded-2xl p-5 transition-all duration-200 shadow-sm space-y-4"
                        >
                          {/* Top Row */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3.5">
                              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center p-2 shadow-xs shrink-0">
                                <img src={getCompanyLogo(j.c)} alt={j.c} className="max-h-full max-w-full object-contain" />
                              </div>
                              <div>
                                <h3
                                  onClick={() => setActiveDrawer({ type: "job", id: j.id })}
                                  className="text-base font-display font-bold text-gray-900 hover:text-[#ec2639] transition-colors cursor-pointer"
                                >
                                  {j.t}
                                </h3>
                                <div className="text-xs text-gray-500 mt-0.5">
                                  <span className="font-semibold text-gray-700">{j.c}</span> · <MapPin className="inline h-3.5 w-3.5 text-muted-foreground mr-0.5 shrink-0" /> {j.l} · ₹{j.a}–{j.b} LPA
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <div className="h-10 w-10 rounded-full bg-[#ec2639]/15 border border-[#ec2639]/40 text-[#ec2639] font-display font-black flex items-center justify-center text-xs">
                                {matchScore}%
                              </div>
                            </div>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1.5 items-center text-xs">
                            <span className="px-2.5 py-0.5 rounded-full bg-gray-50 border border-gray-200 text-gray-500 font-medium">
                              {j.m}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-gray-50 border border-gray-200 text-gray-500 font-medium">
                              {j.ty}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-gray-50 border border-gray-200 text-gray-500 font-medium">
                              {j.e}+ yrs exp
                            </span>
                            {(j.sk || []).map((skill) => {
                              const userHas = (currentUser.sk || []).some((s) => s.toLowerCase() === skill.toLowerCase());
                              return (
                                <span
                                  key={skill}
                                  className={cn(
                                    "px-2.5 py-0.5 rounded-full border text-[11px] font-medium",
                                    userHas ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400" : "border-gray-200 bg-gray-50 text-gray-500"
                                  )}
                                >
                                  {userHas && <Check className="h-3 w-3 inline mr-1" />}{skill}
                                </span>
                              );
                            })}
                          </div>

                          {/* SLA & Actions Row */}
                          <div className="pt-3 border-t border-gray-200 flex items-center justify-between gap-3 text-xs">
                            <span className="inline-flex items-center gap-1.5 text-[#ec2639] font-semibold">
                              <Clock className="h-3.5 w-3.5" />
                              <span>24-Hour SLA Active · {timeAgo(j.at)}</span>
                            </span>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setCompareJobs((prev) =>
                                    prev.includes(j.id) ? prev.filter((id) => id !== j.id) : prev.length < 3 ? [...prev, j.id] : prev
                                  );
                                }}
                                className={cn(
                                  "px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer",
                                  isComparing ? "border-[#ec2639] bg-[#ec2639]/20 text-[#ec2639]" : "border-gray-200 text-gray-500 hover:text-gray-900"
                                )}
                              >
                                {isComparing ? "Comparing" : "Compare"}
                              </button>

                              <button
                                onClick={() => handleToggleSaveJob(j.id)}
                                className={cn(
                                  "p-2 rounded-lg border text-xs transition-colors cursor-pointer",
                                  isSaved ? "border-amber-400 bg-amber-400/15 text-amber-400" : "border-gray-200 text-gray-500 hover:text-gray-900"
                                )}
                                title={isSaved ? "Saved" : "Save opening"}
                              >
                                <Bookmark className={cn("h-3.5 w-3.5", isSaved && "fill-current")} />
                              </button>

                              <button
                                onClick={() => handleQuickApply(j.id)}
                                disabled={hasApplied}
                                className={cn(
                                  "px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer",
                                  hasApplied
                                    ? "bg-[#2a2a33] text-gray-500 cursor-not-allowed"
                                    : "bg-[#ec2639] hover:bg-[#dc1428] text-white"
                                )}
                              >
                                {hasApplied ? <Check className="h-3.5 w-3.5" /> : <Send className="h-3.5 w-3.5" />}
                                <span>{hasApplied ? "Applied" : "Quick Apply"}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= VIEW: MY PROFILE (LOGGED-IN CANDIDATE PROFILE) ================= */}
          {activeView === "profile" && currentRole === "candidate" && (
            <div className="space-y-6 max-w-5xl">
              {/* Profile Card Header */}
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                {/* Cover with radial glow & branding */}
                <div className="h-36 sm:h-44 bg-gradient-to-r from-[#ec2639] via-[#f0364a] to-[#d61e31] relative">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.2),transparent_65%)]" />
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/20 text-white border border-white/30 flex items-center gap-1.5 backdrop-blur-xs">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Verified Candidate</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/20 text-white border border-white/30 backdrop-blur-xs">
                      SLA Response: 24h Guaranteed
                    </span>
                  </div>
                </div>

                {/* Main Profile Info Header */}
                <div className="p-6 pt-0 -mt-14 sm:-mt-16 relative">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
                    <div className="flex flex-col sm:flex-row sm:items-end gap-5">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-[#ec2639] to-[#991b1b] text-white font-display font-black text-3xl sm:text-4xl flex items-center justify-center border-4 border-white shadow-xl ring-2 ring-gray-100 shrink-0">
                        {currentUser.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 tracking-tight">
                            {currentUser.name}
                          </h1>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            Open to Work
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                            <Award className="h-3 w-3" />
                            IRS: 88/100
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-700 mt-1">
                          {currentUser.head || "Senior React & TypeScript Engineer"}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-500 mt-2">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-[#ec2639]" />
                            {currentUser.city || "Bengaluru"}, India
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Briefcase className="h-3.5 w-3.5 text-[#ec2639]" />
                            {currentUser.exp} Years Experience
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Building2 className="h-3.5 w-3.5 text-[#ec2639]" />
                            Swiggy (Current)
                          </span>
                          <span className="flex items-center gap-1.5 font-mono text-[#ec2639]">
                            <Zap className="h-3.5 w-3.5" />
                            TAL-84920
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action CTAs */}
                    <div className="flex items-center gap-2 flex-wrap shrink-0">
                      <button
                        onClick={() => {
                          showToast("Downloading verified candidate resume PDF...");
                        }}
                        className="px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:text-gray-900 hover:border-[#ec2639] bg-gray-50 cursor-pointer flex items-center gap-1.5 transition-all"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Resume PDF</span>
                      </button>
                      <button
                        onClick={() => {
                          if (navigator?.clipboard) {
                            navigator.clipboard.writeText(window.location.href);
                          }
                          showToast("Profile share link copied to clipboard!");
                        }}
                        className="px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:text-gray-900 hover:border-[#ec2639] bg-gray-50 cursor-pointer flex items-center gap-1.5 transition-all"
                      >
                        <Share2 className="h-3.5 w-3.5" />
                        <span>Share</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsEmployerPreview(!isEmployerPreview);
                          showToast(isEmployerPreview ? "Switched to Candidate View" : "Previewing profile as viewed by Employers");
                        }}
                        className={cn(
                          "px-3.5 py-2 rounded-xl border text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-all",
                          isEmployerPreview
                            ? "bg-[#ec2639]/15 text-[#ec2639] border-[#ec2639]"
                            : "border-gray-200 text-gray-700 hover:text-gray-900 hover:border-[#ec2639] bg-gray-50"
                        )}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>{isEmployerPreview ? "Viewing as Recruiter" : "Recruiter Preview"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Contact Strip */}
                  <div className="mt-5 pt-4 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-[#ec2639]" />
                        cand@demo.com
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-[#ec2639]" />
                        +91 98765 43210
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Code2 className="h-3.5 w-3.5 text-[#ec2639]" />
                        github.com/vignesh
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Globe className="h-3.5 w-3.5 text-[#ec2639]" />
                        vignesh.dev
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-gray-500">Target CTC:</span>
                      <span className="font-bold text-gray-900 font-display">₹20 – 25 LPA</span>
                      <span className="text-[#2a2a33]">|</span>
                      <span className="text-[11px] text-gray-500">Notice:</span>
                      <span className="font-bold text-gray-900 font-display">15 Days (Serving)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-tabs Navigation */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: "ov", label: "Candidate Profile", icon: User },
                  { id: "ex", label: "Experience & Education", icon: Briefcase },
                  { id: "sk", label: "Skills & Assessments", icon: Award },
                  { id: "pf", label: "Preferences & Career", icon: SlidersHorizontal },
                  { id: "ed", label: "Edit Profile Details", icon: Edit },
                ].map((t) => {
                  const IconComp = t.icon;
                  const isActive = profileTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setProfileTab(t.id as any)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer font-display flex items-center gap-2 shrink-0",
                        isActive
                          ? "bg-[#ec2639] text-white border-[#ec2639] shadow-sm"
                          : "bg-white text-gray-500 border-gray-200 hover:text-gray-900 hover:border-[#383844]"
                      )}
                    >
                      <IconComp className="h-3.5 w-3.5" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* TAB 1: OVERVIEW (THE COMPLETE LOGGED-IN CANDIDATE PROFILE) */}
              {profileTab === "ov" && (
                <div className="grid lg:grid-cols-[1fr_320px] gap-6">
                  {/* Left Column: Full Editorial Candidate Resume / Dossier */}
                  <div className="space-y-6">
                    {/* About Section */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <h2 className="text-base font-display font-bold text-gray-900 flex items-center gap-2">
                          <User className="h-4 w-4 text-[#ec2639]" /> Professional Summary
                        </h2>
                        <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                          Verified Bio
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {currentUser.about || "Frontend engineer with 3+ years delivering accessible, high-performance web products. Experienced in modern component architectures, TypeScript, state machines, and Web Vitals optimization. Passionate about developer tooling and bridging UX with rock-solid frontend engineering."}
                      </p>
                      <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-3">
                        <Compass className="h-4 w-4 text-[#ec2639] shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-bold font-display text-gray-900">Career Objective</div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            Targeting high-impact Senior Frontend or Full Stack engineering roles at high-growth SaaS and product companies. Specialized in robust design systems, SSR architectures, and high-conversion client apps.
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Work Experience */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <h2 className="text-base font-display font-bold text-gray-900 flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-[#ec2639]" /> Work Experience
                        </h2>
                        <span className="text-xs text-gray-500 font-medium">3+ Years Verified</span>
                      </div>
                      <div className="space-y-5">
                        {[
                          {
                            role: "Frontend Developer",
                            company: "Swiggy",
                            period: "Jan 2023 – Present · 1 yr 9 mos",
                            city: "Bengaluru, India",
                            type: "Full-time",
                            bullets: [
                              "Engineered customer checkout flow reducing median time-to-first-byte and cumulative layout shifts by 35%.",
                              "Spearheaded design system migration to Tailwind CSS and accessible Radix primitives across 6 frontend pods.",
                              "Collaborated with product designers to build interactive motion prototypes and high-converting cart upsells.",
                            ],
                          },
                          {
                            role: "Junior Software Engineer",
                            company: "Infosys",
                            period: "Aug 2021 – Dec 2022 · 1 yr 5 mos",
                            city: "Bengaluru, India",
                            type: "Full-time",
                            bullets: [
                              "Modernized legacy enterprise banking dashboards into responsive, component-driven React applications.",
                              "Automated end-to-end integration and unit testing suites, lifting code coverage from 64% to 92% with Jest and RTL.",
                              "Optimized SQL reporting queries reducing daily ETL execution times by 28%.",
                            ],
                          },
                        ].map((exp, idx) => (
                          <div key={idx} className={cn("space-y-3", idx > 0 && "pt-5 border-t border-gray-200")}>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-2 shrink-0 shadow-sm">
                                  <Building2 className="h-5 w-5 text-[#17171d]" />
                                </div>
                                <div>
                                  <h3 className="text-sm font-display font-bold text-gray-900">{exp.role}</h3>
                                  <div className="text-xs font-medium text-[#ec2639]">{exp.company} · {exp.type}</div>
                                  <div className="text-[11px] text-gray-500 mt-0.5">{exp.period} · {exp.city}</div>
                                </div>
                              </div>
                            </div>
                            <ul className="space-y-1.5 pl-4 list-disc text-xs text-gray-600">
                              {exp.bullets.map((b, bi) => (
                                <li key={bi} className="leading-relaxed">{b}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Education */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm">
                      <h2 className="text-base font-display font-bold text-gray-900 flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-[#ec2639]" /> Education
                      </h2>
                      <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                        <div className="w-10 h-10 rounded-xl bg-[#ec2639]/15 border border-[#ec2639]/30 flex items-center justify-center text-[#ec2639] shrink-0">
                          <GraduationCap className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-display font-bold text-gray-900">B.Tech in Computer Science & Engineering</h3>
                          <div className="text-xs text-gray-500 mt-0.5">Visvesvaraya Technological University (VTU) · 2017 – 2021</div>
                          <div className="text-xs font-semibold text-emerald-400 mt-1">Grade: First Class with Distinction (CGPA: 8.8 / 10.0)</div>
                        </div>
                      </div>
                    </div>

                    {/* Technical Skills */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <h2 className="text-base font-display font-bold text-gray-900 flex items-center gap-2">
                          <Code2 className="h-4 w-4 text-[#ec2639]" /> Verified Technical Skills
                        </h2>
                        <span className="text-xs text-gray-500">Validated via pro assessments</span>
                      </div>

                      <div className="space-y-3.5">
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Frontend Engineering</div>
                          <div className="flex flex-wrap gap-2">
                            {[
                              { name: "React", lvl: "Expert", score: "88%" },
                              { name: "TypeScript", lvl: "Advanced", score: "85%" },
                              { name: "Next.js", lvl: "Advanced", score: null },
                              { name: "Tailwind CSS", lvl: "Expert", score: null },
                              { name: "HTML5 / CSS3", lvl: "Expert", score: null },
                              { name: "Redux Toolkit", lvl: "Advanced", score: null },
                            ].map((s) => (
                              <span key={s.name} className="px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 hover:border-[#ec2639] text-xs font-medium text-gray-800 flex items-center gap-2 transition-all">
                                <span>{s.name}</span>
                                <span className="text-[10px] text-gray-500">· {s.lvl}</span>
                                {s.score && (
                                  <span className="text-[10px] font-bold text-[#ec2639] bg-[#ec2639]/15 px-1.5 py-0.5 rounded-full">
                                    {s.score}
                                  </span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Backend & Database</div>
                          <div className="flex flex-wrap gap-2">
                            {[
                              { name: "Node.js", lvl: "Intermediate", score: null },
                              { name: "SQL / PostgreSQL", lvl: "Intermediate", score: "82%" },
                              { name: "REST APIs", lvl: "Advanced", score: null },
                              { name: "GraphQL", lvl: "Intermediate", score: null },
                            ].map((s) => (
                              <span key={s.name} className="px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium text-gray-800 flex items-center gap-2">
                                <span>{s.name}</span>
                                <span className="text-[10px] text-gray-500">· {s.lvl}</span>
                                {s.score && (
                                  <span className="text-[10px] font-bold text-[#ec2639] bg-[#ec2639]/15 px-1.5 py-0.5 rounded-full">
                                    {s.score}
                                  </span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">DevOps & Tools</div>
                          <div className="flex flex-wrap gap-2">
                            {["Docker", "Git", "Jest / RTL", "Vite", "AWS S3/Lambda", "CI/CD GitHub Actions"].map((t) => (
                              <span key={t} className="px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium text-gray-800">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Verified Assessments */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <h2 className="text-base font-display font-bold text-gray-900 flex items-center gap-2">
                          <Award className="h-4 w-4 text-[#ec2639]" /> Verified Assessments & Certifications
                        </h2>
                        <button
                          onClick={() => setActiveView("cert")}
                          className="text-xs text-[#ec2639] hover:underline font-bold cursor-pointer"
                        >
                          Take More Tests
                        </button>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3.5">
                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="font-display font-bold text-sm text-gray-900">React Specialist</div>
                            <div className="text-[11px] text-gray-500">Talento Pro Verified Test</div>
                            <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Top 5% Percentile in India</span>
                            </div>
                          </div>
                          <div className="text-3xl font-display font-black text-[#ec2639]">88%</div>
                        </div>

                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="font-display font-bold text-sm text-gray-900">SQL & DB Architecture</div>
                            <div className="text-[11px] text-gray-500">Talento Pro Verified Test</div>
                            <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Top 12% Percentile</span>
                            </div>
                          </div>
                          <div className="text-3xl font-display font-black text-[#ec2639]">82%</div>
                        </div>

                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between sm:col-span-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold font-display text-sm">
                              META
                            </div>
                            <div>
                              <div className="font-display font-bold text-sm text-gray-900">Meta Certified Frontend Developer</div>
                              <div className="text-[11px] text-gray-500">Credential ID: META-FE-93821 · Issued Dec 2023</div>
                            </div>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/10 text-white">
                            Verified Credential
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Featured Projects */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <h2 className="text-base font-display font-bold text-gray-900 flex items-center gap-2">
                          <FolderKanban className="h-4 w-4 text-[#ec2639]" /> Featured Engineering Projects
                        </h2>
                        <button
                          onClick={() => setActiveView("port")}
                          className="text-xs text-[#ec2639] hover:underline font-bold cursor-pointer"
                        >
                          Manage Portfolio
                        </button>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 border border-gray-200 hover:border-[#ec2639]/50 rounded-xl space-y-2 transition-all">
                          <div className="flex items-center justify-between">
                            <h3 className="font-display font-bold text-sm text-gray-900">OpenUI React Components</h3>
                            <ExternalLink className="h-3.5 w-3.5 text-gray-500" />
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            Tree-shakeable, WCAG AA compliant headless UI system with 1.2k GitHub stars. Built with TypeScript and Tailwind CSS.
                          </p>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-500">React</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-500">TypeScript</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-500">Tailwind</span>
                          </div>
                        </div>

                        <div className="p-4 bg-gray-50 border border-gray-200 hover:border-[#ec2639]/50 rounded-xl space-y-2 transition-all">
                          <div className="flex items-center justify-between">
                            <h3 className="font-display font-bold text-sm text-gray-900">Pulse Health Tracker</h3>
                            <ExternalLink className="h-3.5 w-3.5 text-gray-500" />
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            Realtime health tracking PWA built with Next.js, IndexedDB, and WebSockets. Deployed with automated CI/CD.
                          </p>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-500">Next.js</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-500">WebSockets</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-500">IndexedDB</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Candidate Stats, Readiness, & Preferences */}
                  <div className="space-y-6">
                    {/* Profile Strength & Verification Card */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <h2 className="text-sm font-display font-bold text-gray-900 flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-[#ec2639]" /> Profile Completeness
                        </h2>
                        <span className="text-sm font-display font-black text-emerald-400">94%</span>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="w-full bg-gray-50 rounded-full h-2 overflow-hidden">
                        <div className="bg-gradient-to-r from-[#ec2639] to-emerald-400 h-full rounded-full w-[94%]" />
                      </div>

                      <div className="space-y-2.5 pt-1 text-xs">
                        {[
                          { label: "Professional headline & bio", done: true },
                          { label: "3+ years work history added", done: true },
                          { label: "Technical skills & proficiencies", done: true },
                          { label: "Government ID verified", done: true },
                          { label: "Assessment score >80% achieved", done: true },
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2.5">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                            <span className="text-gray-700">{item.label}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-gray-200">
                        <div className="text-[11px] text-gray-500 leading-relaxed">
                          Your profile is active in employer spotlight searches. 4x higher contact rate.
                        </div>
                      </div>
                    </div>

                    {/* Candidate Pipeline Activity */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm">
                      <h2 className="text-sm font-display font-bold text-gray-900 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-[#ec2639]" /> Candidate Activity
                      </h2>
                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                          <div className="text-2xl font-display font-black text-[#ec2639]">2</div>
                          <div className="text-[11px] text-gray-500 mt-0.5">Active Applications</div>
                        </div>
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                          <div className="text-2xl font-display font-black text-emerald-400">1</div>
                          <div className="text-[11px] text-gray-500 mt-0.5">Shortlisted (Zoho)</div>
                        </div>
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                          <div className="text-2xl font-display font-black text-gray-900">148</div>
                          <div className="text-[11px] text-gray-500 mt-0.5">Profile Views</div>
                        </div>
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                          <div className="text-2xl font-display font-black text-amber-400">100%</div>
                          <div className="text-[11px] text-gray-500 mt-0.5">24h SLA Met</div>
                        </div>
                      </div>
                    </div>

                    {/* Career Preferences */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3.5 shadow-sm text-xs">
                      <div className="flex items-center justify-between">
                        <h2 className="text-sm font-display font-bold text-gray-900 flex items-center gap-2">
                          <SlidersHorizontal className="h-4 w-4 text-[#ec2639]" /> Job Preferences
                        </h2>
                        <button
                          onClick={() => setProfileTab("pf")}
                          className="text-xs text-[#ec2639] hover:underline font-bold cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                      
                      <div className="space-y-2.5">
                        <div className="flex justify-between py-1.5 border-b border-gray-200">
                          <span className="text-gray-500">Target CTC</span>
                          <span className="font-bold text-gray-900 font-display">₹20 – 25 LPA</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-gray-200">
                          <span className="text-gray-500">Notice Period</span>
                          <span className="font-bold text-gray-900 font-display">15 Days (Serving)</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-gray-200">
                          <span className="text-gray-500">Work Mode</span>
                          <span className="font-bold text-gray-900 font-display">Remote / Hybrid</span>
                        </div>
                        <div className="flex justify-between py-1.5">
                          <span className="text-gray-500">Preferred Cities</span>
                          <span className="font-bold text-gray-900 font-display text-right">Bengaluru, Hyderabad</span>
                        </div>
                      </div>
                    </div>

                    {/* Talento Pro Wallet Card */}
                    <div className="bg-gradient-to-br from-[#17171d] to-[#20181b] border border-gray-200 rounded-2xl p-5 space-y-3 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500 font-semibold flex items-center gap-1.5">
                          <Wallet className="h-3.5 w-3.5 text-[#ec2639]" /> Talento Cash Balance
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      </div>
                      <div className="text-3xl font-display font-black text-gray-900">₹1,450</div>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        Earned from verified skill assessment milestones and fast interview attendance bonuses.
                      </p>
                      <button
                        onClick={() => setActiveView("wallet")}
                        className="w-full py-2 bg-[#ec2639] hover:bg-[#dc1428] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                      >
                        Open Wallet & Rewards
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: EXPERIENCE & EDUCATION */}
              {profileTab === "ex" && (
                <div className="space-y-6">
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-display font-bold text-gray-900 flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-[#ec2639]" /> Work Experience History
                      </h2>
                    </div>
                    <div className="space-y-4">
                      {(currentUser.ex || []).map((exp, i) => (
                        <div key={i} className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex justify-between items-start">
                          <div>
                            <div className="font-display font-bold text-gray-900 text-sm">{exp.role} · {exp.co}</div>
                            <div className="text-gray-500 text-xs mt-0.5">{exp.fr} – {exp.to}</div>
                            <p className="text-gray-600 text-xs mt-2">{exp.d}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm">
                    <h2 className="text-base font-display font-bold text-gray-900 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-[#ec2639]" /> Educational Qualifications
                    </h2>
                    <div className="space-y-3">
                      {(currentUser.ed || []).map((edu, i) => (
                        <div key={i} className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                          <div className="font-display font-bold text-gray-900 text-sm">{edu.dg}</div>
                          <div className="text-gray-500 text-xs mt-0.5">{edu.sc} · {edu.yr}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SKILLS & ASSESSMENTS */}
              {profileTab === "sk" && (
                <div className="space-y-6">
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-display font-bold text-gray-900 flex items-center gap-2">
                        <Code2 className="h-4 w-4 text-[#ec2639]" /> Skills & Proficiencies
                      </h2>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {(currentUser.sk || []).map((s) => (
                        <span key={s} className="px-3.5 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 text-xs font-semibold flex items-center gap-2">
                          <span>{s}</span>
                          <span className="text-[10px] text-gray-500">({currentUser.sl?.[s] || "Intermediate"})</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-display font-bold text-gray-900 flex items-center gap-2">
                        <Award className="h-4 w-4 text-[#ec2639]" /> Technical Assessment Scores
                      </h2>
                      <button
                        onClick={() => setActiveView("cert")}
                        className="text-xs text-[#ec2639] hover:underline font-bold cursor-pointer"
                      >
                        Browse All Quizzes
                      </button>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {Object.entries(currentUser.as || {}).map(([skill, score]) => (
                        <div key={skill} className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-center space-y-2">
                          <div className="font-display font-bold text-gray-900 text-sm">{skill}</div>
                          <div className="text-3xl font-display font-black text-[#ec2639]">{score}%</div>
                          <div className="text-[11px] text-emerald-400 font-semibold flex items-center justify-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Verified Passed</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: PREFERENCES & CAREER */}
              {profileTab === "pf" && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 text-xs max-w-xl shadow-sm">
                  <h2 className="font-display font-bold text-base text-gray-900 flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-[#ec2639]" /> Career Preferences & Availability
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-500 block mb-1 font-medium">Expected Salary (LPA)</label>
                      <input
                        type="number"
                        value={currentUser.pf?.sal || 22}
                        onChange={(e) => {
                          const val = +e.target.value;
                          setUsers((prev) => ({ ...prev, [currentUser.email]: { ...currentUser, pf: { ...currentUser.pf, sal: val } } }));
                        }}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-[#ec2639] rounded-xl px-3.5 py-2.5 text-gray-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-gray-500 block mb-1 font-medium">Notice Period (Days)</label>
                      <input
                        type="number"
                        value={currentUser.pf?.np || 15}
                        onChange={(e) => {
                          const val = +e.target.value;
                          setUsers((prev) => ({ ...prev, [currentUser.email]: { ...currentUser, pf: { ...currentUser.pf, np: val } } }));
                        }}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-[#ec2639] rounded-xl px-3.5 py-2.5 text-gray-900 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-500 block mb-1 font-medium">Preferred Work Mode</label>
                    <select
                      value={currentUser.pf?.wm || "Remote"}
                      onChange={(e) => {
                        const val = e.target.value;
                        setUsers((prev) => ({ ...prev, [currentUser.email]: { ...currentUser, pf: { ...currentUser.pf, wm: val } } }));
                      }}
                      className="w-full bg-gray-50 border border-gray-200 focus:border-[#ec2639] rounded-xl px-3.5 py-2.5 text-gray-900 outline-none cursor-pointer"
                    >
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Onsite">Onsite</option>
                    </select>
                  </div>
                  <button
                    onClick={() => showToast("Career preferences saved successfully!")}
                    className="px-5 py-2.5 bg-[#ec2639] hover:bg-[#dc1428] text-white rounded-xl font-bold cursor-pointer transition-all shadow-sm"
                  >
                    Save Preferences
                  </button>
                </div>
              )}

              {/* TAB 5: EDIT PROFILE DETAILS */}
              {profileTab === "ed" && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 text-xs max-w-2xl shadow-sm">
                  <h2 className="font-display font-bold text-base text-gray-900 flex items-center gap-2">
                    <Edit className="h-4 w-4 text-[#ec2639]" /> Edit Profile Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-500 block mb-1 font-medium">Full Name</label>
                      <input
                        value={currentUser.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setUsers((prev) => ({ ...prev, [currentUser.email]: { ...currentUser, name: val } }));
                        }}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-[#ec2639] rounded-xl px-3.5 py-2.5 text-gray-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-gray-500 block mb-1 font-medium">Professional Headline</label>
                      <input
                        value={currentUser.head || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setUsers((prev) => ({ ...prev, [currentUser.email]: { ...currentUser, head: val } }));
                        }}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-[#ec2639] rounded-xl px-3.5 py-2.5 text-gray-900 outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-gray-500 block mb-1 font-medium">City / Location</label>
                        <input
                          value={currentUser.city || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setUsers((prev) => ({ ...prev, [currentUser.email]: { ...currentUser, city: val } }));
                          }}
                          className="w-full bg-gray-50 border border-gray-200 focus:border-[#ec2639] rounded-xl px-3.5 py-2.5 text-gray-900 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-gray-500 block mb-1 font-medium">Years of Experience</label>
                        <input
                          type="number"
                          value={currentUser.exp || 3}
                          onChange={(e) => {
                            const val = +e.target.value;
                            setUsers((prev) => ({ ...prev, [currentUser.email]: { ...currentUser, exp: val } }));
                          }}
                          className="w-full bg-gray-50 border border-gray-200 focus:border-[#ec2639] rounded-xl px-3.5 py-2.5 text-gray-900 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-500 block mb-1 font-medium">About Summary</label>
                      <textarea
                        rows={4}
                        value={currentUser.about || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setUsers((prev) => ({ ...prev, [currentUser.email]: { ...currentUser, about: val } }));
                        }}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-[#ec2639] rounded-xl px-3.5 py-2.5 text-gray-900 outline-none leading-relaxed"
                      />
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={() => {
                          saveStorage("users", users);
                          showToast("Profile updated and persisted successfully!");
                          setProfileTab("ov");
                        }}
                        className="px-5 py-2.5 bg-[#ec2639] hover:bg-[#dc1428] text-white rounded-xl font-bold cursor-pointer transition-all shadow-sm"
                      >
                        Save & View Profile
                      </button>
                      <button
                        onClick={() => setProfileTab("ov")}
                        className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:text-gray-900 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= VIEW: NOTIFICATIONS (24H SLA CENTER) ================= */}
          {activeView === "upd" && (
            <div className="space-y-6 max-w-3xl">
              <div className="bg-gradient-to-br from-[#ec2639] to-[#d61e31] text-white p-6 rounded-2xl shadow-xl border border-white/10">
                <h1 className="text-xl font-display font-bold mb-1 flex items-center gap-2">
                  <Bell className="h-5 w-5" /> 24-Hour SLA Notification Center
                </h1>
                <p className="text-gray-700 text-xs">
                  Every application receives guaranteed review updates from employers within 24 hours.
                </p>
              </div>

              <div className="space-y-3">
                {apps.filter((a) => a.who === currentUser.email).map((a) => {
                  const job = jobs.find((j) => j.id === a.jid);
                  return (
                    <div key={a.id} className="bg-white border border-gray-200 rounded-2xl p-4 text-xs space-y-2 shadow-sm">
                      <div className="flex justify-between items-center">
                        <b className="text-gray-900 font-display text-sm">{job?.t || "Role"} · {job?.c || "Company"}</b>
                        <span className="text-[#ec2639] font-bold">Status: {a.st}</span>
                      </div>
                      <div className="space-y-1.5 pt-1">
                        {(a.upd || []).map((u, idx) => (
                          <div key={idx} className="p-2.5 bg-gray-50 rounded-lg text-gray-700 flex items-center gap-2.5">
                            {u.auto ? <Bot className="h-3.5 w-3.5 text-[#ec2639]" /> : <MessageSquare className="h-3.5 w-3.5 text-primary" />}
                            <span>{u.msg} · <span className="text-gray-500">{timeAgo(u.at)}</span></span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= VIEW: DASHBOARD ================= */}
          {activeView === "dash" && (
            <div className="space-y-6 max-w-5xl">
              <div className="bg-gradient-to-br from-[#ec2639] to-[#d61e31] text-white p-6 rounded-2xl shadow-xl border border-white/10">
                <h1 className="text-2xl font-display font-bold mb-1">Welcome back, {currentUser.name.split(" ")[0]}</h1>
                <p className="text-gray-700 text-xs">
                  {jobs.filter((j) => calcScore(j, currentUser) >= 50).length} openings match 50%+ of your verified skills.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-2xl p-5 text-center shadow-sm">
                  <div className="text-3xl font-display font-black text-[#ec2639]">
                    {apps.filter((a) => a.who === currentUser.email).length}
                  </div>
                  <div className="text-xs text-gray-500 font-semibold mt-1">Applications Sent</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-5 text-center shadow-sm">
                  <div className="text-3xl font-display font-black text-[#ec2639]">
                    {jobs.filter((j) => calcScore(j, currentUser) >= 50).length}
                  </div>
                  <div className="text-xs text-gray-500 font-semibold mt-1">High Skill Matches (50%+)</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-5 text-center shadow-sm">
                  <div className="text-3xl font-display font-black text-[#ec2639]">
                    {apps.filter((a) => a.who === currentUser.email && a.st === "Shortlisted").length}
                  </div>
                  <div className="text-xs text-gray-500 font-semibold mt-1">Shortlisted / Interviews</div>
                </div>
              </div>
            </div>
          )}

          {/* ================= VIEW: SAVED ================= */}
          {activeView === "saved" && (
            <div className="space-y-4 max-w-4xl">
              <div className="flex items-center gap-2">
                <Bookmark className="h-4 w-4 text-[#ec2639]" />
                <h2 className="text-base font-display font-bold text-gray-900">Saved Roles</h2>
              </div>
              {(currentUser.saved || []).length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-gray-500">
                  No saved bookmarks yet.
                </div>
              ) : (
                jobs.filter((j) => (currentUser.saved || []).includes(j.id)).map((j) => (
                  <div key={j.id} className="bg-white border border-gray-200 rounded-2xl p-4 flex justify-between items-center text-xs shadow-sm">
                    <div>
                      <b className="text-sm font-display text-gray-900 block">{j.t} · {j.c}</b>
                      <span className="text-gray-500"><MapPin className="inline h-3.5 w-3.5 text-muted-foreground mr-0.5 shrink-0" /> {j.l} · ₹{j.a}–{j.b} LPA · {j.m}</span>
                    </div>
                    <button
                      onClick={() => handleQuickApply(j.id)}
                      className="px-3.5 py-1.5 bg-[#ec2639] text-white rounded-lg font-bold cursor-pointer"
                    >
                      Quick Apply
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ================= VIEW: APPLICATIONS ================= */}
          {activeView === "applied" && (
            <div className="space-y-4 max-w-4xl">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#ec2639]" />
                <h2 className="text-base font-display font-bold text-gray-900">Active Applications</h2>
              </div>
              {apps.filter((a) => a.who === currentUser.email).map((a) => {
                const j = jobs.find((x) => x.id === a.jid);
                return (
                  <div key={a.id} className="bg-white border border-gray-200 rounded-2xl p-4 flex justify-between items-center text-xs shadow-sm">
                    <div>
                      <b className="text-sm font-display text-gray-900 block">{j?.t || "Role"} · {j?.c || "Company"}</b>
                      <span className="text-gray-500">Applied {timeAgo(a.at)} · Status: </span>
                      <span className="text-[#ec2639] font-bold">{a.st}</span>
                    </div>
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[11px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>SLA Monitored</span>
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* ================= VIEW: CERTIFICATIONS ================= */}
          {activeView === "cert" && (
            <div className="space-y-6 max-w-4xl">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 text-xs space-y-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-[#ec2639]" />
                  <b className="text-base font-display text-gray-900">Technical Skill Certifications</b>
                </div>
                <p className="text-gray-500">Take quick 3-question assessments to verify your skills on your candidate profile.</p>
                <div className="grid sm:grid-cols-3 gap-3 pt-2">
                  {["React", "SQL", "Python"].map((skill) => (
                    <div key={skill} className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-center space-y-2">
                      <b className="text-gray-900 text-sm block font-display">{skill}</b>
                      <span className="text-xs text-emerald-400 font-semibold">Verified Score: {currentUser.as?.[skill] || 80}%</span>
                      <button
                        onClick={() => showToast(`Started ${skill} certification test!`)}
                        className="w-full py-1.5 bg-[#ec2639] text-white rounded-lg font-bold cursor-pointer"
                      >
                        Retake Test
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= VIEW: RESUME BUILDER AI ================= */}
          {activeView === "resume" && (
            <div className="space-y-6 max-w-4xl">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 text-xs space-y-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-[#ec2639]" />
                  <b className="text-base font-display text-gray-900">AI Resume Builder</b>
                </div>
                <p className="text-gray-500">Generate tailored ATS-optimized resumes based on your verified skills.</p>
                <div>
                  <label className="text-gray-500 block mb-1">Target Role</label>
                  <input
                    value={resumeData.targetRole}
                    onChange={(e) => setResumeData((r) => ({ ...r, targetRole: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-900 font-sans"
                  />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1">Executive Summary</label>
                  <textarea
                    rows={3}
                    value={resumeData.summary}
                    onChange={(e) => setResumeData((r) => ({ ...r, summary: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-900 font-sans"
                  />
                </div>
                <button
                  onClick={() => showToast("AI Resume generated and saved to your profile!")}
                  className="px-4 py-2 bg-[#ec2639] hover:bg-[#dc1428] text-white rounded-xl font-bold cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="h-4 w-4" />
                  <span>Export Resume PDF</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= VIEW: WALLET ================= */}
          {activeView === "wallet" && (
            <div className="space-y-6 max-w-3xl">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 text-xs space-y-4 shadow-sm">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-[#ec2639]" />
                    <b className="text-base font-display text-gray-900">Talento Wallet</b>
                  </div>
                  <div className="text-xl font-display font-black text-[#ec2639]">{formatINR(currentUser.wal?.bal || 1450)}</div>
                </div>
                <p className="text-gray-500">Use wallet credits for skill test vouchers, fast-track applications, and verified badge renewals.</p>
                <div className="pt-2 flex gap-3">
                  <input
                    type="number"
                    value={walletAmount}
                    onChange={(e) => setWalletAmount(e.target.value)}
                    placeholder="Amount in INR"
                    className="w-48 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-900 font-sans"
                  />
                  <button
                    onClick={() => {
                      const amt = parseInt(walletAmount) || 500;
                      setUsers((prev) => ({
                        ...prev,
                        [currentUser.email]: {
                          ...currentUser,
                          wal: {
                            bal: (currentUser.wal?.bal || 0) + amt,
                            hist: [...(currentUser.wal?.hist || []), { id: Date.now(), desc: "Top up via UPI", amt, dt: Date.now() }],
                          },
                        },
                      }));
                      showToast(`Added ${formatINR(amt)} to your wallet!`);
                    }}
                    className="px-4 py-2 bg-[#ec2639] text-white rounded-xl font-bold cursor-pointer"
                  >
                    Top Up Credits
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= VIEW: PORTFOLIO ================= */}
          {activeView === "port" && (
            <div className="space-y-6 max-w-4xl">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 text-xs space-y-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <FolderKanban className="h-5 w-5 text-[#ec2639]" />
                  <b className="text-base font-display text-gray-900">Public Portfolio</b>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {(currentUser.pj || []).map((p, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
                      <b className="text-gray-900 text-sm block font-display">{p.t}</b>
                      <span className="text-[#ec2639] text-xs font-semibold">{p.l}</span>
                      <p className="text-gray-500">{p.d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= VIEW: VERIFIED PROFILE ================= */}
          {activeView === "ver" && (
            <div className="space-y-6 max-w-3xl">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 text-xs space-y-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#ec2639]" />
                  <b className="text-base font-display text-gray-900">Verified Credentials</b>
                </div>
                <p className="text-gray-500">Your profile has active verified trust markers.</p>
                <div className="space-y-2 pt-2">
                  <div className="p-3 bg-gray-50 border border-emerald-500/30 rounded-xl text-emerald-400 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Identity & Email Verified</span>
                  </div>
                  <div className="p-3 bg-gray-50 border border-emerald-500/30 rounded-xl text-emerald-400 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Technical Skill Score: 88% in React Verified</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= VIEW: DISCOVER (SWIPE) ================= */}
          {activeView === "disc" && (
            <div className="space-y-6 max-w-md mx-auto text-center">
              <div className="bg-white border border-gray-200 rounded-3xl p-6 text-xs space-y-4 shadow-xl">
                <div className="flex items-center justify-center gap-2">
                  <Compass className="h-5 w-5 text-[#ec2639]" />
                  <b className="text-base font-display text-gray-900 block">Discover Roles</b>
                </div>
                {jobs[0] && (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center p-2.5 mx-auto shadow-sm">
                      <img src={getCompanyLogo(jobs[0].c)} alt={jobs[0].c} className="max-h-full max-w-full object-contain" />
                    </div>
                    <b className="text-lg font-display text-gray-900 block">{jobs[0].t}</b>
                    <p className="text-gray-500">{jobs[0].c} · <MapPin className="inline h-3.5 w-3.5 text-muted-foreground mr-0.5 shrink-0" /> {jobs[0].l}</p>
                    <p className="text-sm font-bold text-[#ec2639]">₹{jobs[0].a}–{jobs[0].b} LPA · {jobs[0].m}</p>
                  </div>
                )}
                <div className="flex justify-center gap-4 pt-2">
                  <button
                    onClick={() => showToast("Passed role")}
                    className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      if (jobs[0]) handleQuickApply(jobs[0].id);
                    }}
                    className="w-12 h-12 rounded-full bg-[#ec2639] text-white flex items-center justify-center shadow-lg hover:scale-105 cursor-pointer"
                  >
                    <Check className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= EMPLOYER VIEWS ================= */}
          {currentRole === "employer" && (
            <>
              {activeView === "talent" && (
                <div className="space-y-6 max-w-5xl">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-[#ec2639]" />
                    <h2 className="text-base font-display font-bold text-gray-900">Find Candidates</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {CANDIDATES_SEED.map((c) => (
                      <div key={c.n} className="bg-white border border-gray-200 rounded-2xl p-4 text-xs space-y-3 shadow-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <b className="text-sm font-display text-gray-900 block">{c.n}</b>
                            <span className="text-gray-500"><MapPin className="inline h-3.5 w-3.5 text-muted-foreground mr-0.5 shrink-0" /> {c.c} · {c.x} yrs exp · ₹{c.es}L</span>
                          </div>
                          <span className="w-8 h-8 rounded-full bg-[#ec2639]/15 text-[#ec2639] font-display font-black flex items-center justify-center text-xs">
                            {c.as?.React || 85}%
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {(c.sk || []).map((s) => (
                            <span key={s} className="px-2 py-0.5 rounded bg-gray-50 text-gray-500 text-[10px]">
                              {s}
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={() => showToast(`Invited ${c.n} to apply!`)}
                          className="w-full py-1.5 bg-[#ec2639] text-white rounded-lg font-bold cursor-pointer"
                        >
                          Invite to Apply
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeView === "pipe" && (
                <div className="space-y-6 max-w-5xl">
                  <div className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-[#ec2639]" />
                    <h2 className="text-base font-display font-bold text-gray-900">Candidate Pipeline</h2>
                  </div>
                  <div className="grid sm:grid-cols-4 gap-4">
                    {["Applied", "Shortlisted", "Interview", "Offer"].map((stage) => {
                      const count = apps.filter((a) => a.st === stage).length;
                      return (
                        <div key={stage} className="bg-white border border-gray-200 rounded-2xl p-4 text-xs space-y-3 shadow-sm">
                          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                            <b className="text-gray-900 font-display">{stage}</b>
                            <span className="px-2 py-0.5 rounded-full bg-[#ec2639] text-white text-[10px] font-bold">{count}</span>
                          </div>
                          {apps.filter((a) => a.st === stage).map((a) => (
                            <div key={a.id} className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
                              <b className="text-gray-900 block font-display">{a.name}</b>
                              <span className="text-gray-500 text-[11px]">{a.exp} yrs · {a.sk.slice(0, 2).join(", ")}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeView === "post" && (
                <div className="space-y-6 max-w-xl">
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 text-xs space-y-4 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Plus className="h-5 w-5 text-[#ec2639]" />
                      <b className="text-base font-display text-gray-900">Post a Verified Opening</b>
                    </div>
                    <div>
                      <label className="text-gray-500 block mb-1">Job Title</label>
                      <input placeholder="e.g. Senior Frontend Engineer" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-900 font-sans" />
                    </div>
                    <div>
                      <label className="text-gray-500 block mb-1">Location</label>
                      <input placeholder="e.g. Bengaluru / Remote" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-900 font-sans" />
                    </div>
                    <button
                      onClick={() => showToast("Opening published with 24-Hour SLA guarantee!")}
                      className="px-4 py-2 bg-[#ec2639] text-white rounded-xl font-bold cursor-pointer"
                    >
                      Publish Job
                    </button>
                  </div>
                </div>
              )}

              {activeView === "cp" && (
                <div className="space-y-6 max-w-xl">
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 text-xs space-y-4 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-[#ec2639]" />
                      <b className="text-base font-display text-gray-900">Company Profile</b>
                    </div>
                    <div>
                      <label className="text-gray-500 block mb-1">Company Name</label>
                      <input value="Super30 Technologies" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-900 font-sans" />
                    </div>
                    <div>
                      <label className="text-gray-500 block mb-1">About Company</label>
                      <textarea rows={3} value="Building next-generation AI agents and developer tooling." className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-900 font-sans" />
                    </div>
                    <button onClick={() => showToast("Company profile saved!")} className="px-4 py-2 bg-[#ec2639] text-white rounded-xl font-bold cursor-pointer">
                      Save Details
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

        </main>
      </div>

      {/* ================= FLOATING ACTION BUTTON: AI ASSISTANT ================= */}
      <button
        onClick={() => setIsAiOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#ec2639] hover:bg-[#dc1428] text-white font-semibold px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 border border-white/20 transition-all hover:scale-105 cursor-pointer text-sm"
      >
        <Bot className="h-4 w-4" />
        <span>AI Assistant</span>
      </button>

      {/* ================= SLIDE-OUT AI COPILOT DRAWER ================= */}
      <AnimatePresence>
        {isAiOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed bottom-6 right-6 z-50 w-96 rounded-2xl border border-gray-200 bg-white text-white shadow-2xl overflow-hidden flex flex-col h-[480px]"
          >
            <div className="p-4 bg-[#ec2639] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <span className="font-display font-bold text-sm">Talento AI Copilot</span>
              </div>
              <button onClick={() => setIsAiOpen(false)} className="text-gray-600 hover:text-gray-900 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-gray-50">
              {aiMessages.length === 0 ? (
                <div className="p-3.5 rounded-xl bg-white border border-gray-200 space-y-2 text-gray-500">
                  <p className="font-display font-bold text-gray-900">Hi {currentUser.name}, how can I help you today?</p>
                  <p>Recommended questions:</p>
                  <div className="space-y-1 text-[#ec2639]">
                    <p onClick={() => setAiInput("What are my best matched jobs?")} className="cursor-pointer hover:underline">
                      • What are my best matched jobs?
                    </p>
                    <p onClick={() => setAiInput("How can I prepare for frontend interviews?")} className="cursor-pointer hover:underline">
                      • How can I prepare for frontend interviews?
                    </p>
                    <p onClick={() => setAiInput("Is my salary expectation competitive?")} className="cursor-pointer hover:underline">
                      • Is my salary expectation competitive?
                    </p>
                  </div>
                </div>
              ) : (
                aiMessages.map((m, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "p-3 rounded-xl max-w-[85%] leading-relaxed",
                      m.role === "u" ? "ml-auto bg-[#ec2639] text-white font-medium" : "mr-auto bg-white border border-gray-200 text-gray-800"
                    )}
                  >
                    {m.text}
                  </div>
                ))
              )}
              {isAiThinking && (
                <div className="p-3 rounded-xl bg-white border border-gray-200 text-gray-500 flex items-center gap-2">
                  <RefreshCw className="h-3 w-3 animate-spin text-[#ec2639]" />
                  <span>Analyzing your profile and jobs...</span>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-gray-200 bg-white flex gap-2">
              <input
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendAiMessage();
                }}
                placeholder="Ask about jobs, salary, or interviews..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-900 font-sans"
              />
              <button onClick={handleSendAiMessage} className="px-3 bg-[#ec2639] hover:bg-[#dc1428] text-white rounded-lg cursor-pointer">
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= SLIDE-OUT JOB DETAIL DRAWER ================= */}
      <AnimatePresence>
        {activeDrawer?.type === "job" && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
            <motion.div
              initial={{ opacity: 0, x: 400 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 400 }}
              className="w-full max-w-lg bg-white text-gray-900 border-l border-gray-200 h-full p-6 overflow-y-auto space-y-5 shadow-2xl relative"
            >
              {(() => {
                const job = jobs.find((j) => j.id === activeDrawer.id);
                if (!job) return null;
                const hasApplied = apps.some((a) => a.jid === job.id && a.who === currentUser.email);
                const isSaved = (currentUser.saved || []).includes(job.id);

                return (
                  <>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center p-2 shrink-0 shadow-sm">
                          <img src={getCompanyLogo(job.c)} alt={job.c} className="max-h-full max-w-full object-contain" />
                        </div>
                        <div>
                          <h2 className="font-display font-bold text-lg text-gray-900">{job.t}</h2>
                          <p className="text-xs text-gray-500">{job.c} · <MapPin className="inline h-3.5 w-3.5 text-muted-foreground mr-0.5 shrink-0" /> {job.l}</p>
                        </div>
                      </div>
                      <button onClick={() => setActiveDrawer(null)} className="text-gray-500 hover:text-gray-900 cursor-pointer">
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="p-4 rounded-xl bg-[#ec2639]/10 border border-[#ec2639]/30 space-y-1 text-xs">
                      <p className="font-bold text-[#ec2639] flex items-center gap-1.5">
                        <Clock className="h-4 w-4" /> 24-Hour Employer SLA Response Guarantee
                      </p>
                      <p className="text-gray-500">
                        Applying through I Am Talento activates a 24-hour response SLA. Employers must review and update your application within this timeframe.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                        <p className="text-gray-500">Salary Range</p>
                        <p className="font-display font-bold text-[#ec2639] text-sm mt-0.5">₹{job.a}–{job.b} LPA</p>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                        <p className="text-gray-500">Experience Required</p>
                        <p className="font-display font-bold text-gray-900 text-sm mt-0.5">{job.e}+ Years</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <b className="text-gray-900 block font-display">Required Skills</b>
                      <div className="flex flex-wrap gap-1.5">
                        {(job.sk || []).map((s) => (
                          <span key={s} className="px-2.5 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-800">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleToggleSaveJob(job.id)}
                        className={cn(
                          "p-3 rounded-xl border text-xs font-semibold cursor-pointer",
                          isSaved ? "border-amber-400 bg-amber-400/20 text-amber-400" : "border-gray-200 text-gray-800 hover:bg-white/10"
                        )}
                      >
                        <Bookmark className={cn("h-4 w-4", isSaved && "fill-current")} />
                      </button>
                      <button
                        onClick={() => {
                          handleQuickApply(job.id);
                          setActiveDrawer(null);
                        }}
                        disabled={hasApplied}
                        className={cn(
                          "flex-1 py-3 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer",
                          hasApplied ? "bg-[#2a2a33] text-gray-500 cursor-not-allowed" : "bg-[#ec2639] hover:bg-[#dc1428] text-white"
                        )}
                      >
                        {hasApplied ? "Already Applied" : "Submit Verified Application"}
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= COMPARE JOBS MODAL ================= */}
      <AnimatePresence>
        {activeDrawer?.type === "compare-jobs" && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-gray-200 rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-2xl relative text-white"
            >
              <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                <b className="text-lg font-display">Compare Position Parameters</b>
                <button onClick={() => setActiveDrawer(null)} className="text-gray-500 hover:text-gray-900 cursor-pointer">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {compareJobs.map((id) => {
                  const j = jobs.find((x) => x.id === id);
                  if (!j) return null;
                  return (
                    <div key={id} className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-2 shadow-xs">
                        <img src={getCompanyLogo(j.c)} alt={j.c} className="max-h-full max-w-full object-contain" />
                      </div>
                      <b className="text-sm block font-display">{j.t}</b>
                      <p className="text-[#ec2639] font-bold font-display">₹{j.a}–{j.b} LPA</p>
                      <p className="text-gray-500">{j.l} · {j.m}</p>
                      <p className="text-gray-500">{j.e}+ yrs exp</p>
                      <button
                        onClick={() => {
                          handleQuickApply(j.id);
                          setActiveDrawer(null);
                        }}
                        className="w-full py-1.5 bg-[#ec2639] text-white rounded-lg font-bold cursor-pointer"
                      >
                        Apply Now
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </>
  );
};

export default TalentoPro;
