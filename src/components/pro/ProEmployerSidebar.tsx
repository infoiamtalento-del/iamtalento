import { ExternalLink, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { employerMenuItems, employeeMenuItems, employerLogoutIcon as LogoutIcon } from "./employerMenu";
import type { ProView } from "./proTypes";
import { getCandidatePhoto } from "@/data/portalAssets";
import { siteLogo } from "@/assets/logo";

interface Props {
  activeView: ProView;
  onNavigate: (view: ProView) => void;
  onLogout: () => void;
  unreadCount: number;
  userName?: string;
  userAvatar?: string;
  userRole?: string;
  employerId?: string;
  isEmployer?: boolean;
}

export function ProEmployerSidebar({
  activeView,
  onNavigate,
  onLogout,
  unreadCount,
  userName,
  userAvatar,
  employerId,
  isEmployer = false,
}: Props) {
  const menuItems = isEmployer ? employerMenuItems : employeeMenuItems;
  const photoUrl = userAvatar || (isEmployer ? "/company-logos/super30-mark.svg" : getCandidatePhoto(userName || "Yogesh"));
  const resolvedEmployerId = employerId || (isEmployer ? "IAT-EMP-204819" : undefined);

  return (
    <aside
      className={cn(
        "w-full lg:w-64 xl:w-72 shrink-0 lg:fixed lg:bottom-0 lg:left-0 z-40 lg:border-r border-[#001D44] bg-[#002C66] text-white overflow-y-auto shadow-md",
        isEmployer ? "lg:top-0" : "lg:top-16"
      )}
    >
      <div className="flex flex-col min-h-full justify-between text-white">
        <div>
          {/* Brand Header: Logo on top, TalentCIR & Employer Dashboard below, with Visit site aligned neatly */}
          {isEmployer ? (
            <div className="px-4 py-4 border-b border-[#001D44] bg-[#002454]">
              <div className="flex items-center justify-between gap-3">
                <Link to="/" className="flex items-center group" aria-label="TalentCIR Home">
                  <div className="rounded-xl bg-white px-3 py-2 flex items-center justify-center shrink-0 shadow-xs hover:opacity-95 transition-opacity">
                    <img
                      src={siteLogo.url}
                      alt="TalentCIR"
                      className="h-8 w-auto object-contain"
                    />
                  </div>
                </Link>
                <Link
                  to="/company/super30-technologies"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1 text-[11px] font-bold text-white transition-colors shrink-0"
                  title="Open public company page"
                >
                  <span>Visit site</span>
                  <ExternalLink className="h-2.5 w-2.5" aria-hidden="true" />
                </Link>
              </div>
              <div className="mt-3 pl-0.5 space-y-0.5">
                <p className="font-display text-base font-extrabold tracking-wide text-white leading-tight">
                  TalentCIR
                </p>
                <p className="text-xs font-semibold text-[#FB923C] tracking-wide leading-tight">
                  Employer Dashboard
                </p>
                {resolvedEmployerId && (
                  <div className="pt-1.5 flex items-center gap-1.5">
                    <span className="text-[10px] font-medium text-blue-200/70 uppercase tracking-wider">
                      Employer ID:
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/10 border border-white/15 font-mono text-[11px] font-bold text-emerald-300 tracking-wide select-all">
                      {resolvedEmployerId}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="px-3 py-2.5 mb-2 border-b border-white/15">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white/30 bg-white/15 shrink-0 shadow-sm flex items-center justify-center">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt={userName || "User"}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-bold text-white">
                      {(userName?.charAt(0) || "U").toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-blue-200/90 truncate">
                    Dashboard Menu
                  </p>
                  {userName && (
                    <p className="text-xs font-bold text-white truncate">
                      {userName}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <div className="p-3 sm:p-4 pb-0">
            <nav aria-label="Dashboard navigation" className="space-y-1">
            {menuItems.map(({ id, label, icon: Icon, section }, idx) => {
              const isActive = activeView === id;
              return (
                <div key={id}>
                  {section && (
                    <p
                      className={cn(
                        "px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-blue-200/70",
                        idx === 0 ? "pt-0.5" : "pt-3.5"
                      )}
                    >
                      {section}
                    </p>
                  )}
                  <button
                    type="button"
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => onNavigate(id)}
                    className={cn(
                      "relative group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all text-left cursor-pointer",
                      isActive
                        ? "bg-white/18 text-white shadow-xs border border-white/25"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    )}
                  >
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#FB923C]"
                      />
                    )}
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        isActive ? "text-[#FB923C]" : "text-blue-100 group-hover:text-white"
                      )}
                    />
                    <span className="min-w-0 flex-1 truncate text-white">{label}</span>
                    {id === "notif" && unreadCount > 0 && (
                      <span
                        className={cn(
                          "ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
                          isActive
                            ? "bg-[#FB923C] text-white shadow-xs"
                            : "bg-red-500 text-white shadow-xs"
                        )}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </nav>
        </div>
      </div>

        {/* Bottom Section: Reference "Unlock more with Pro Plan" Card + User Profile & Logout */}
        <div className="p-3 sm:p-4 pt-4 border-t border-white/15 space-y-3">
          {isEmployer && (
            <div className="rounded-2xl border border-white/15 bg-[#001F4D] p-3.5 text-center space-y-2 shadow-inner">
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#FB923C]/20 text-[#FB923C]">
                <Rocket className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Unlock more with Pro Plan</p>
                <p className="mt-0.5 text-[11px] leading-snug text-blue-200/80">
                  Get AI-verified CIR reports, export analytics &amp; unlimited talent unlocks.
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={() => onNavigate("advertise")}
                className="w-full h-8 rounded-xl bg-[#FB923C] hover:bg-[#F97316] text-white text-[11px] font-bold border-0 shadow-sm cursor-pointer"
              >
                Upgrade Plan
              </Button>
            </div>
          )}

          {isEmployer && (
            <div className="flex items-center gap-2.5 px-1.5 py-1">
              <div className="h-9 w-9 rounded-full overflow-hidden border border-white/30 bg-white shrink-0 flex items-center justify-center p-0.5">
                <img
                  src={photoUrl}
                  alt={userName || "Employer"}
                  width={36}
                  height={36}
                  className="h-full w-full object-contain rounded-full"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">
                  {userName || "Super30 Technologies"}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-300 font-semibold truncate">
                  <span>● Verified</span>
                  {resolvedEmployerId && (
                    <span className="font-mono text-[9px] text-blue-200/80">
                      · {resolvedEmployerId}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="px-1">
            <Button
              type="button"
              onClick={onLogout}
              className="w-full h-9 rounded-xl px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 bg-[#FB923C] hover:bg-[#F97316] active:bg-[#EA580C] text-white border border-orange-200/40 shadow-md transition-all cursor-pointer"
            >
              <LogoutIcon className="h-3.5 w-3.5 shrink-0 text-white" />
              <span className="text-white font-bold">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}