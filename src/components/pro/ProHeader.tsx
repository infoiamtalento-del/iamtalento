import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Search,
  Building2,
  Users,
  Compass,
  Bell,
  Star,
  FileText,
  GraduationCap,
  Bot,
  ShieldCheck,
  Wallet,
  FolderKanban,
  Plus,
  SlidersHorizontal,
  ChevronDown,
  Moon,
  Sun,
  LogOut,
  Zap,
  Headphones,
  Award,
  CheckCircle2,
} from "lucide-react";
import { ProUser } from "@/data/proData";
import { ProView } from "./proTypes";
import { cn } from "@/lib/utils";
import siteLogo from "@/assets/I-am-Talento-2.png.asset.json";
import { employerMenuItems } from "./employerMenu";

interface ProHeaderProps {
  currentUser: ProUser;
  currentRole: "candidate" | "employer";
  activeView: ProView;
  setActiveView: (view: ProView) => void;
  onSwitchRole: (role: "candidate" | "employer") => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onSignOut: () => void;
  onSupport: () => void;
  onOpenCertificate: () => void;
  unreadCount: number;
  savedCount: number;
  avatarSrc?: string;
}

export const ProHeader: React.FC<ProHeaderProps> = ({
  currentUser,
  currentRole,
  activeView,
  setActiveView,
  onSwitchRole,
  isDarkMode,
  onToggleTheme,
  onSignOut,
  onSupport,
  onOpenCertificate,
  unreadCount,
  savedCount,
  avatarSrc,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const candidateNavItems: { id: ProView; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: "profile", label: "My Profile", icon: Users },
    { id: "jobs", label: "Find Jobs", icon: Search },
    { id: "port", label: "Portfolio", icon: FolderKanban },
    { id: "upd", label: "Notifications", icon: Bell, badge: unreadCount },
    { id: "dash", label: "Dashboard", icon: SlidersHorizontal },
    { id: "disc", label: "Discover", icon: Compass },
    { id: "saved", label: "Saved Roles", icon: Star, badge: savedCount },
    { id: "applied", label: "Applications", icon: FileText },
    { id: "cert", label: "Certifications", icon: GraduationCap },
    { id: "resume", label: "AI Resume Builder", icon: Bot },
    { id: "ver", label: "Verified Profile", icon: ShieldCheck },
    { id: "wallet", label: "Wallet", icon: Wallet },
  ];

  const employerNavItems: { id: ProView; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: "cp", label: "Company Profile", icon: Building2 },
    { id: "talent", label: "Find Talent", icon: Users },
    { id: "port", label: "Portfolio", icon: FolderKanban },
    { id: "notif", label: "Notifications", icon: Bell, badge: unreadCount },
    { id: "dash", label: "Analytics", icon: SlidersHorizontal },
    { id: "pipe", label: "Pipeline", icon: Briefcase },
    { id: "post", label: "Post Job", icon: Plus },
    { id: "ver", label: "Verified Company", icon: ShieldCheck },
    { id: "wallet", label: "Wallet", icon: Wallet },
  ];

  const navItems = currentRole === "candidate" ? candidateNavItems : employerNavItems;

  // Profile dropdown menu (matches the approved reference list)
  type MenuEntry =
    | { kind: "view"; id: ProView; label: string; icon: React.ElementType; badge?: number; pill?: boolean }
    | { kind: "action"; key: string; label: string; icon: React.ElementType };

  const candidateMenuItems: MenuEntry[] = [
    { kind: "view", id: "profile", label: "My Profile", icon: Users, pill: true },
    { kind: "view", id: "dash", label: "Dashboard", icon: SlidersHorizontal },
    { kind: "view", id: "cert", label: "My Assessments", icon: GraduationCap },
    { kind: "view", id: "upd", label: "Notifications", icon: Bell, badge: unreadCount },
    { kind: "view", id: "port", label: "Portfolio", icon: FolderKanban },
    { kind: "view", id: "resume", label: "AI Resume Builder", icon: Bot },
    { kind: "action", key: "certificate", label: "Download Certificate", icon: Award },
    { kind: "view", id: "wallet", label: "Wallet", icon: Wallet },
    { kind: "action", key: "support", label: "Support", icon: Headphones },
  ];

  const menuItems: MenuEntry[] = currentRole === "candidate" ? candidateMenuItems : employerMenuItems.map((item): MenuEntry => ({ kind: "view", ...item, badge: item.id === "notif" ? unreadCount : undefined }));


  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-card/95 backdrop-blur-md border-b border-border/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Tag */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <img src={siteLogo.url} alt="I Am Talento" className="h-8 w-auto object-contain" />
            <span className="text-[10px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded bg-primary text-white">
              PRO
            </span>
          </Link>

          {/* Quick Role Toggle */}
          <div className="hidden sm:flex items-center bg-secondary p-0.5 rounded-full border border-border/60 ml-2">
            <button
              onClick={() => onSwitchRole("candidate")}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer",
                currentRole === "candidate"
                  ? "bg-white text-primary shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Candidate
            </button>
            <button
              onClick={() => onSwitchRole("employer")}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer",
                currentRole === "employer"
                  ? "bg-white text-primary shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Employer
            </button>
          </div>
        </div>

        {/* Desktop Quick Nav */}
        <nav className={cn("hidden items-center gap-1", currentRole === "candidate" && "lg:flex")}>
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={cn(
                  "relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                  isActive
                    ? "bg-primary/10 text-primary font-bold"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
                {item.badge != null && item.badge > 0 ? (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-primary text-white">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Notification Bell & Profile Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setActiveView(currentRole === "candidate" ? "upd" : "notif")}
            aria-label="Notifications"
            className="relative p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-colors cursor-pointer"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#0d5cb2] ring-2 ring-white" />
            )}
          </button>

          {/* Profile Pill & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Account menu"
              aria-expanded={isMenuOpen}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full border border-slate-200/90 hover:border-slate-300 bg-white transition-all shadow-2xs cursor-pointer"
            >
              <div className="h-7 w-7 rounded-full bg-[#0d5cb2] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
                {avatarSrc ? (
                  <img src={avatarSrc} alt={currentUser.name} className="h-full w-full object-cover" />
                ) : (
                  currentUser.name.charAt(0).toUpperCase()
                )}
              </div>
              <span className="text-xs font-bold text-slate-800 max-w-[100px] sm:max-w-[140px] truncate">
                {currentUser.name}
              </span>
              <ChevronDown className={cn("h-3.5 w-3.5 text-slate-400 transition-transform", isMenuOpen && "rotate-180")} />
            </button>

          {/* Profile Menu Popover */}
          {isMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl bg-white text-slate-800 shadow-xl z-50 p-4 border border-slate-200/90 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* Menu Header with User Info */}
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 font-display font-black text-lg flex items-center justify-center border-2 border-blue-200/80 shrink-0 overflow-hidden shadow-2xs">
                    {avatarSrc ? (
                      <img src={avatarSrc} alt={currentUser.name} className="h-full w-full object-cover" />
                    ) : (
                      currentUser.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <b className="block text-sm font-display font-bold text-slate-900 truncate">{currentUser.name}</b>
                    <span className="text-[11px] text-slate-500">
                      {currentRole === "candidate" ? "Candidate" : "Employer"}
                    </span>
                  </div>
                </div>

                {/* Navigation Items List */}
                <div className="py-2.5 space-y-0.5 max-h-[360px] overflow-y-auto">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    if (item.kind === "action") {
                      return (
                        <button
                          key={item.key}
                          onClick={() => {
                            if (item.key === "certificate") onOpenCertificate();
                            else onSupport();
                            setIsMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-left text-slate-700 hover:bg-slate-100/80"
                        >
                          <span className="flex items-center gap-2.5">
                            <Icon className="h-4 w-4 shrink-0" />
                            <span>{item.label}</span>
                          </span>
                        </button>
                      );
                    }
                    const isActive = activeView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveView(item.id);
                          setIsMenuOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-left",
                          isActive
                            ? "bg-[#0d5cb2] text-white shadow-sm"
                            : "text-slate-700 hover:bg-slate-100/80"
                        )}
                      >
                        <span className="flex items-center gap-2.5">
                          <Icon className="h-4 w-4 shrink-0" />
                          <span>{item.label}</span>
                        </span>
                        {item.pill ? (
                          <span className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[10px] font-black text-slate-600">
                            View
                          </span>
                        ) : item.badge != null && item.badge > 0 ? (
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-black",
                              isActive ? "bg-white text-[#0d5cb2]" : "bg-[#0d5cb2]/10 text-[#0d5cb2]"
                            )}
                          >
                            {item.badge}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-slate-100 space-y-1">
                  {currentRole === "candidate" && <button
                    onClick={() => {
                      onToggleTheme();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 cursor-pointer text-left transition-colors"
                  >
                    {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    <span>Light / Dark</span>
                  </button>}

                  <button
                    onClick={() => {
                      onSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100/80 cursor-pointer text-left transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{currentRole === "employer" ? "Logout" : "Sign Out"}</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  </header>
  );
};

export default ProHeader;
