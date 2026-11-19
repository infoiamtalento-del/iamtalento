import { useEffect, useState } from "react";
import { ChevronDown, ExternalLink, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  employerDirectItems,
  employerCategoryGroups,
  employeeMenuItems,
  employerLogoutIcon as LogoutIcon,
} from "./employerMenu";
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
  const photoUrl = userAvatar || (isEmployer ? "/company-logos/super30-mark.svg" : getCandidatePhoto(userName || "Yogesh"));
  const resolvedEmployerId = employerId || (isEmployer ? "IAT-EMP-204819" : undefined);

  const findActiveGroupId = (view: ProView) =>
    employerCategoryGroups.find((g) => g.items.some((item) => item.id === view))?.id ?? null;

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const activeGroup = findActiveGroupId(activeView);
    return activeGroup ? { [activeGroup]: true } : {};
  });

  useEffect(() => {
    if (!isEmployer) return;
    const activeGroup = findActiveGroupId(activeView);
    if (activeGroup) {
      setOpenGroups((prev) => (prev[activeGroup] ? prev : { ...prev, [activeGroup]: true }));
    }
  }, [activeView, isEmployer]);

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  return (
    <aside
      className={cn(
        "w-full lg:w-64 xl:w-72 shrink-0 lg:fixed lg:bottom-0 lg:left-0 z-40 lg:border-r border-[#001D44] bg-[#002C66] text-white shadow-md flex flex-col",
        isEmployer ? "lg:top-0 lg:overflow-hidden" : "lg:top-16 overflow-y-auto"
      )}
    >
      {/* Top Brand Header + Employer Workspace Identity */}
      {isEmployer ? (
        <div className="shrink-0">
          {/* 86px Brand Bar — flush horizontal alignment with the top header bar */}
          <div className="h-[86px] min-h-[86px] px-5 bg-[#002C66] border-b border-white/10 flex items-center">
            <Link to="/" className="inline-flex items-center focus:outline-none" aria-label="TalentCIR Home">
              <img
                src={siteLogo.url}
                alt="TalentCIR"
                className="h-10 w-auto object-contain brightness-0 invert"
              />
              <span className="sr-only">TalentCIR</span>
              <span className="sr-only">Employer Dashboard</span>
            </Link>
          </div>

          {/* Clean Employer ID & Visit Site Strip */}
          <div className="px-4 py-2.5 bg-[#002250] border-b border-white/10 flex items-center justify-between gap-2">
            {resolvedEmployerId && (
              <span
                className="font-mono text-[11px] font-medium text-blue-100/85 tracking-wide select-all"
                title="Unique Employer ID"
              >
                ID: {resolvedEmployerId}
              </span>
            )}
            <Link
              to="/company/super30-technologies"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1 text-[11px] font-medium text-blue-200 hover:text-white transition-colors shrink-0"
              title="Open public company page"
            >
              <span>Visit site</span>
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="px-4 pt-4 pb-2.5 border-b border-white/15 shrink-0">
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

      {/* Scrollable Navigation + Bottom Section */}
      <div className="flex-1 overflow-y-auto flex flex-col justify-between text-white [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent]">
        <div className="p-3 sm:p-3.5">
          <nav aria-label="Dashboard navigation" className="space-y-0.5">
            {isEmployer ? (
              <>
                {/* Direct Top Items: Dashboard, My Account, Company Profile */}
                <div className="space-y-0.5">
                  {employerDirectItems.map(({ id, label, icon: Icon }) => {
                    const isActive = activeView === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        aria-current={isActive ? "page" : undefined}
                        onClick={() => onNavigate(id)}
                        className={cn(
                          "relative group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all text-left cursor-pointer",
                          isActive
                            ? "bg-white/15 text-white font-semibold shadow-2xs border border-white/15"
                            : "text-blue-100/85 hover:text-white hover:bg-white/8"
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
                            isActive ? "text-[#FB923C]" : "text-blue-200/80 group-hover:text-white"
                          )}
                        />
                        <span className="min-w-0 flex-1 truncate text-white">{label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="my-2.5 border-t border-white/10" />

                {/* Collapsible Category Dropdowns (Recruitment, Assessments & AI, Growth & Analytics, Account & Billing) */}
                <div className="space-y-1">
                  {employerCategoryGroups.map((group) => {
                    const GroupIcon = group.icon;
                    const isOpen = Boolean(openGroups[group.id]);
                    const hasActiveItem = group.items.some((item) => item.id === activeView);
                    const hasNotifBadge =
                      group.items.some((item) => item.id === "notif") && unreadCount > 0;

                    return (
                      <div key={group.id}>
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          onClick={() => toggleGroup(group.id)}
                          className={cn(
                            "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition-all text-left cursor-pointer",
                            hasActiveItem
                              ? "bg-white/12 text-white"
                              : "text-blue-100/90 hover:text-white hover:bg-white/8"
                          )}
                        >
                          <GroupIcon
                            className={cn(
                              "h-4 w-4 shrink-0 transition-colors",
                              hasActiveItem || isOpen
                                ? "text-[#FB923C]"
                                : "text-blue-200/80 group-hover:text-white"
                            )}
                            aria-hidden="true"
                          />
                          <span className="min-w-0 flex-1 truncate text-white">{group.label}</span>
                          {!isOpen && hasNotifBadge && (
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white shadow-xs">
                              {unreadCount}
                            </span>
                          )}
                          <ChevronDown
                            className={cn(
                              "h-3.5 w-3.5 shrink-0 text-blue-200/75 transition-transform duration-200",
                              isOpen && "rotate-180 text-white"
                            )}
                            aria-hidden="true"
                          />
                        </button>

                        {isOpen && (
                          <div className="ml-4 mt-0.5 mb-1 pl-2.5 border-l border-white/15 space-y-0.5">
                            {group.items.map(({ id, label, icon: Icon }) => {
                              const isActive = activeView === id;
                              return (
                                <button
                                  key={id}
                                  type="button"
                                  aria-current={isActive ? "page" : undefined}
                                  onClick={() => onNavigate(id)}
                                  className={cn(
                                    "relative group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all text-left cursor-pointer",
                                    isActive
                                      ? "bg-white/15 text-white font-semibold shadow-2xs"
                                      : "text-blue-100/80 hover:text-white hover:bg-white/8"
                                  )}
                                >
                                  <Icon
                                    className={cn(
                                      "h-3.5 w-3.5 shrink-0 transition-colors",
                                      isActive
                                        ? "text-[#FB923C]"
                                        : "text-blue-200/75 group-hover:text-white"
                                    )}
                                  />
                                  <span className="min-w-0 flex-1 truncate text-white">{label}</span>
                                  {id === "notif" && unreadCount > 0 && (
                                    <span
                                      className={cn(
                                        "ml-auto flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
                                        isActive
                                          ? "bg-[#FB923C] text-white shadow-xs"
                                          : "bg-red-500 text-white shadow-xs"
                                      )}
                                    >
                                      {unreadCount}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              employeeMenuItems.map(({ id, label, icon: Icon, section }, idx) => {
                const isActive = activeView === id;
                return (
                  <div key={id}>
                    {section && (
                      <p
                        className={cn(
                          "px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-blue-200/60",
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
                        "relative group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all text-left cursor-pointer",
                        isActive
                          ? "bg-white/15 text-white font-semibold shadow-2xs border border-white/15"
                          : "text-blue-100/85 hover:text-white hover:bg-white/8"
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
                          isActive ? "text-[#FB923C]" : "text-blue-200/80 group-hover:text-white"
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
              })
            )}
          </nav>
        </div>

        {/* Bottom Section: Pro Plan Card & Clean Logout */}
        <div className="p-3 sm:p-3.5 pt-3 border-t border-white/10 space-y-2.5">
          {isEmployer && (
            <div className="rounded-xl border border-white/10 bg-[#001F4D] p-3 text-left space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#FB923C]/15 text-[#FB923C]">
                  <Rocket className="h-3.5 w-3.5" aria-hidden="true" />
                </div>
                <p className="text-xs font-semibold text-white">Pro Plan</p>
              </div>
              <p className="text-[11px] leading-relaxed text-blue-200/75">
                Unlock AI-verified CIR reports, analytics &amp; talent credits.
              </p>
              <Button
                type="button"
                size="sm"
                onClick={() => onNavigate("advertise")}
                className="w-full h-8 rounded-lg bg-[#FB923C] hover:bg-[#F97316] text-white text-[11px] font-semibold border-0 shadow-xs cursor-pointer"
              >
                Upgrade Plan
              </Button>
            </div>
          )}

          <Button
            type="button"
            onClick={onLogout}
            className="w-full h-9 rounded-lg px-3 py-2 text-xs font-medium flex items-center justify-center gap-2 bg-white/8 hover:bg-white/15 active:bg-white/20 text-blue-100 hover:text-white border border-white/15 shadow-none transition-colors cursor-pointer"
          >
            <LogoutIcon className="h-3.5 w-3.5 shrink-0" />
            <span>Sign out</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}