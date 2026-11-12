import {
  UserRound,
  LayoutDashboard,
  Building2,
  Briefcase,
  FileText,
  GraduationCap,
  Award,
  Bell,
  Megaphone,
  BookOpen,
  Receipt,
  Headphones,
  LogOut,
  UserCheck,
  FolderGit2,
  Calendar,
  BarChart3,
  ShieldCheck,
  Target,
  Bot,
  Video,
  Search,
  Bookmark,
  Pencil,
  Settings,
  FileUp,
  UserSearch,
  Sparkles,
  Users,
  FileCheck2,
  School,
  type LucideIcon,
} from "lucide-react";
import type { ProView } from "./proTypes";

export type EmployerMenuItem = {
  id: ProView;
  label: string;
  icon: LucideIcon;
  section?: string;
};

export const employerMenuItems: EmployerMenuItem[] = [
  { id: "dash", label: "Dashboard", icon: LayoutDashboard, section: "Overview" },
  { id: "account", label: "My Account", icon: UserRound },
  { id: "cp", label: "Company Profile", icon: Building2 },
  { id: "post", label: "Jobs", icon: Briefcase, section: "Recruitment" },
  { id: "pipe", label: "Job Applications", icon: FileText },
  { id: "talent", label: "Find Talent", icon: UserSearch },
  { id: "notif", label: "Notifications", icon: Bell },
  { id: "employer-assessments", label: "Assessments", icon: GraduationCap, section: "Assessments & AI" },
  { id: "ai-hub", label: "AI Intelligence Hub", icon: Sparkles },
  { id: "talent-pool", label: "Talent Pool & CRM", icon: Users },
  { id: "interviews", label: "Interview Management", icon: Video },
  { id: "offers", label: "Offer & Hiring", icon: FileCheck2 },
  { id: "campus-hiring", label: "Bulk & Campus Hiring", icon: School, section: "Growth & Analytics" },
  { id: "employer-analytics", label: "Analytics & Reports", icon: BarChart3 },
  { id: "corporate-learning", label: "Corporate Learning", icon: BookOpen },
  { id: "advertise", label: "Advertise & Subscriptions", icon: Megaphone, section: "Account & Billing" },
  { id: "payment-history", label: "Payment & Invoices", icon: Receipt },
  { id: "support", label: "Support Center", icon: Headphones },
];

export const employeeMenuItems: EmployerMenuItem[] = [
  { id: "dash", label: "Employee Dashboard", icon: LayoutDashboard },
  { id: "profile", label: "My Profile & Badges", icon: UserCheck },
  { id: "edit-profile", label: "Profile Setup & Edit", icon: Pencil },
  { id: "ver", label: "Verify Account", icon: ShieldCheck },
  { id: "readiness", label: "Readiness & Skill Gap", icon: Target },
  { id: "my-resume", label: "My Resume", icon: FileUp },
  { id: "resume", label: "AI Resume Builder", icon: Bot },
  { id: "cert", label: "Assessments & CIR", icon: GraduationCap },
  { id: "mock-interview", label: "Mock Interview & Q&A", icon: Video },
  { id: "jobs", label: "Recommended Jobs", icon: Search },
  { id: "applied", label: "My Job Applications", icon: Briefcase },
  { id: "saved", label: "Saved Jobs", icon: Bookmark },
  { id: "learning-mentors", label: "My Courses & Mentors", icon: BookOpen },
  { id: "my-certifications", label: "Certificates & Downloads", icon: Award },
  { id: "analytics", label: "Career Growth & Views", icon: BarChart3 },
  { id: "port", label: "Public Portfolio", icon: FolderGit2 },
  { id: "freelancing", label: "Freelancing", icon: Briefcase },
  { id: "events-community", label: "Events & Community", icon: Calendar },
  { id: "notif", label: "Notifications", icon: Bell },
  { id: "payment-history", label: "Payment & Invoices", icon: Receipt },
  { id: "account", label: "My Account & Password", icon: UserRound },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "support", label: "Support Center", icon: Headphones },
];

export const employerLogoutIcon = LogOut;
