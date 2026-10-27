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
  type LucideIcon,
} from "lucide-react";
import type { ProView } from "./proTypes";

export type EmployerMenuItem = { id: ProView; label: string; icon: LucideIcon };

export const employerMenuItems: EmployerMenuItem[] = [
  { id: "account", label: "My Account", icon: UserRound },
  { id: "dash", label: "Dashboard", icon: LayoutDashboard },
  { id: "cp", label: "Company Profile", icon: Building2 },
  { id: "post", label: "Create Job Posting", icon: Briefcase },
  { id: "pipe", label: "Job Applications", icon: FileText },
  { id: "employer-assessments", label: "Assessments", icon: GraduationCap },
  { id: "notif", label: "Notifications", icon: Bell },
  { id: "advertise", label: "Advertise & Subscriptions", icon: Megaphone },
  { id: "corporate-learning", label: "Corporate Learning", icon: BookOpen },
  { id: "payment-history", label: "Payment & Invoices", icon: Receipt },
  { id: "support", label: "Support Center", icon: Headphones },
];

export const employeeMenuItems: EmployerMenuItem[] = [
  { id: "account", label: "My Account", icon: UserRound },
  { id: "dash", label: "Dashboard", icon: LayoutDashboard },
  { id: "profile", label: "Candidate Profile", icon: UserCheck },
  { id: "cert", label: "Assessments", icon: GraduationCap },
  { id: "my-certifications", label: "My Certifications", icon: Award },
  { id: "learning-mentors", label: "Learning & Mentors", icon: BookOpen },
  { id: "freelancing", label: "Freelancing", icon: Briefcase },
  { id: "port", label: "Portfolio", icon: FolderGit2 },
  { id: "resume", label: "AI Resume Builder", icon: FileText },
  { id: "events-community", label: "Events & Community", icon: Calendar },
  { id: "notif", label: "Notifications", icon: Bell },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "payment-history", label: "Payment & Invoices", icon: Receipt },
  { id: "support", label: "Support Center", icon: Headphones },
];

export const employerLogoutIcon = LogOut;