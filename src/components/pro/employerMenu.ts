import { UserRound, Building2, Briefcase, FileText, GraduationCap, Bell, Video, Megaphone, CreditCard, Receipt, Settings, Headphones, LogOut, type LucideIcon } from "lucide-react";
import type { ProView } from "./proTypes";

type EmployerMenuItem = { id: ProView; label: string; icon: LucideIcon };

export const employerMenuItems: EmployerMenuItem[] = [
  { id: "account", label: "My Account", icon: UserRound },
  { id: "cp", label: "Company Profile", icon: Building2 },
  { id: "post", label: "Job Posting", icon: Briefcase },
  { id: "pipe", label: "Job Applications", icon: FileText },
  { id: "employer-assessments", label: "Assessments", icon: GraduationCap },
  { id: "notif", label: "Notifications", icon: Bell },
  { id: "interviews", label: "Create AI Interviews", icon: Video },
  { id: "advertise", label: "Advertise", icon: Megaphone },
  { id: "subscription", label: "Subscription", icon: CreditCard },
  { id: "payment-history", label: "Payment History", icon: Receipt },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "support", label: "Support", icon: Headphones },
];

export const employerLogoutIcon = LogOut;