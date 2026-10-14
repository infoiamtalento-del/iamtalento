import React from "react";
import {
  Search,
  Bookmark,
  FileText,
  Bell,
  SlidersHorizontal,
  Bot,
  GraduationCap,
  Wallet,
  UserRound,
  Sparkles,
  Building2,
  PlusCircle,
  Users,
} from "lucide-react";
import { ProUser } from "@/data/proData";
import { ProView } from "./proTypes";
import { cn } from "@/lib/utils";

interface ProSubNavProps {
  currentUser: ProUser;
  currentRole: "candidate" | "employer";
  activeView: ProView;
  setActiveView: (view: ProView) => void;
  onSwitchRole: (role: "candidate" | "employer") => void;
  unreadCount: number;
  savedCount: number;
}

export const ProSubNav: React.FC<ProSubNavProps> = ({
  currentUser,
  currentRole,
  activeView,
  setActiveView,
  onSwitchRole,
  unreadCount,
  savedCount,
}) => {
  const candidateNavItems: { id: ProView; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: "jobs", label: "Find Jobs", icon: Search },
    { id: "saved", label: "Saved Roles", icon: Bookmark, badge: savedCount },
    { id: "applied", label: "Applications", icon: FileText },
    { id: "upd", label: "Notifications", icon: Bell, badge: unreadCount },
    { id: "dash", label: "Dashboard", icon: SlidersHorizontal },
    { id: "resume", label: "AI Resume Builder", icon: Bot },
    { id: "cert", label: "Certifications", icon: GraduationCap },
    { id: "wallet", label: "Wallet", icon: Wallet },
    { id: "profile", label: "My Profile", icon: UserRound },
  ];

  return (
    <div className="sticky top-[60px] sm:top-[65px] z-40 bg-white/95 border-b border-border shadow-2xs backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-3 h-14 overflow-x-auto no-scrollbar py-1">
          {/* Left: Role Switcher & Eyebrow */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#0d5cb2] text-xs font-bold shrink-0">
              <Sparkles className="h-3.5 w-3.5 text-[#0d5cb2]" />
              <span>Talento Pro</span>
            </div>

            <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200 shrink-0">
              <button
                type="button"
                onClick={() => onSwitchRole("candidate")}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer",
                  currentRole === "candidate"
                    ? "bg-[#0d5cb2] text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                Candidate
              </button>
              <button
                type="button"
                onClick={() => onSwitchRole("employer")}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer",
                  currentRole === "employer"
                    ? "bg-[#0d5cb2] text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                Employer
              </button>
            </div>
          </div>

          {/* Center / Navigation Items */}
          {currentRole === "candidate" ? (
            <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0 ml-auto" aria-label="Talento Pro views">
              {candidateNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveView(item.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0",
                      isActive
                        ? "bg-[#0d5cb2] text-white shadow-xs font-bold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span>{item.label}</span>
                    {item.badge != null && item.badge > 0 ? (
                      <span
                        className={cn(
                          "ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold",
                          isActive ? "bg-white text-[#0d5cb2]" : "bg-[#0d5cb2]/10 text-[#0d5cb2]"
                        )}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </nav>
          ) : (
            <div className="flex items-center gap-2 shrink-0 ml-auto">
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <Building2 className="h-3.5 w-3.5 text-[#0d5cb2]" />
                Super30 Recruiter Workspace
              </span>
              <button
                type="button"
                onClick={() => setActiveView("post")}
                className={cn(
                  "flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                  activeView === "post"
                    ? "bg-[#0d5cb2] text-white"
                    : "bg-blue-50 text-[#0d5cb2] hover:bg-blue-100"
                )}
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Post Job</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveView("talent")}
                className={cn(
                  "flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                  activeView === "talent"
                    ? "bg-[#0d5cb2] text-white"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                <Users className="h-3.5 w-3.5" />
                <span>Find Talent</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProSubNav;
