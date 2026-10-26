import {
  UserRound,
  LayoutDashboard,
  Building2,
  Briefcase,
  FileText,
  GraduationCap,
  Bell,
  Megaphone,
  BookOpen,
  Receipt,
  Headphones,
  LogOut,
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

export const employerLogoutIcon = LogOut;