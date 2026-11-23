import { useEffect, useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
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
        "w-full lg:w-64 xl:w-72 shrink-0 lg:fixed lg:bottom-0 lg:left-0 z-40 lg:border-r border-[#001D44] bg-[#002C66] text-white flex flex-col",
        isEmployer ? "lg:top-0 lg:overflow-hidden" : "lg:top-16 overflow-y-auto"
      )}
    >
      {/* Top Brand Header + Employer Workspace Identity */}
      {isEmployer ? (
        <div className="shrink-0">
          {/* 80px (h-20) Brand Bar — 4px grid & flush horizontal alignment with top header bar */}
          <div className="h-20 min-h-20 px-5 bg-[#002C66] border-b border-white/10 flex items-center">
            <Link to="/" className="inline-flex items-center focus:outline-none" aria-label="TalentCIR Home">
              <img
                src={siteLogo.url}
                alt="TalentCIR"
                className="h-9 w-auto object-contain brightness-0 invert"
              />
              <span className="sr-only">TalentCIR</span>
              <span className="sr-only">Employer Dashboard</span>
            </Link>
          </div>

          {/* Signature Monospace Verification Stamp + Live Status Dot */}
          <div className="px-5 py-2.5 bg-[#002250] border-b border-white/10 flex items-center justify-between gap-2">
            {resolvedEmployerId && (
              <span
                className="inline-flex items-center gap-1.5 font-mono text-[11px] font-normal text-blue-100/90 select-all"
                title="Verified Employer Registry ID"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#4cc38a] shrink-0" aria-hidden="true" />
                {resolvedEmployerId}
              </span>
            )}
            <Link
              to="/company/super30-technologies"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1 text-xs font-normal text-blue-200/85 hover:text-white transition-colors duration-150 shrink-0"
              title="Open public company page"
            >
              <span>Visit site</span>
              <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="px-4 pt-4 pb-2.5 border-b border-white/15 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white/30 bg-white/15 shrink-0 flex items-center justify-center">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={userName || "User"}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs font-semibold text-white">
                  {(userName?.charAt(0) || "U").toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-blue-200/85 truncate">
                Dashboard menu
              </p>
              {userName && (
                <p className="text-xs font-medium text-white truncate">
                  {userName}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Scrollable Navigation + Bottom Section */}
      <div className="flex-1 overflow-y-auto flex flex-col justify-between text-white [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent]">
        <div className="p-3">
          <nav aria-label="Dashboard navigation" className="space-y-0.5">
            {isEmployer ? (
              <>
                {/* Direct Top Items: 36px (h-9) uniform rows, 16px stroke-1.5 icons in aligned column */}
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
                          "relative flex h-9 w-full items-center gap-2.5 rounded-lg px-3 text-[13px] transition-colors duration-150 text-left cursor-pointer",
                          isActive
                            ? "bg-white/14 text-white font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                            : "text-blue-100/80 hover:text-white hover:bg-white/8 font-normal"
                        )}
                      >
                        <Icon
                          className="h-4 w-4 shrink-0 text-blue-200/80"
                          strokeWidth={1.5}
                        />
                        <span className="min-w-0 flex-1 truncate text-white">{label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="my-3 border-t border-white/10" />

                {/* Collapsible Category Dropdowns */}
                <div className="space-y-0.5">
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
                            "flex h-9 w-full items-center gap-2.5 rounded-lg px-3 text-[13px] transition-colors duration-150 text-left cursor-pointer",
                            hasActiveItem
                              ? "bg-white/10 text-white font-medium"
                              : "text-blue-100/85 hover:text-white hover:bg-white/8 font-normal"
                          )}
                        >
                          <GroupIcon
                            className="h-4 w-4 shrink-0 text-blue-200/80"
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                          <span className="min-w-0 flex-1 truncate text-white">{group.label}</span>
                          {!isOpen && hasNotifBadge && (
                            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-blue-200/85 tabular-nums">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#fb923c]" />
                              {unreadCount}
                            </span>
                          )}
                          <ChevronDown
                            className={cn(
                              "h-3.5 w-3.5 shrink-0 text-blue-200/70 transition-transform duration-150",
                              isOpen && "rotate-180 text-white"
                            )}
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                        </button>

                        {isOpen && (
                          <div className="ml-5 mt-0.5 mb-1 pl-2.5 border-l border-white/12 space-y-0.5">
                            {group.items.map(({ id, label, icon: Icon }) => {
                              const isActive = activeView === id;
                              return (
                                <button
                                  key={id}
                                  type="button"
                                  aria-current={isActive ? "page" : undefined}
                                  onClick={() => onNavigate(id)}
                                  className={cn(
                                    "relative flex h-8 w-full items-center gap-2.5 rounded-lg px-2.5 text-xs transition-colors duration-150 text-left cursor-pointer",
                                    isActive
                                      ? "bg-white/14 text-white font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                                      : "text-blue-100/80 hover:text-white hover:bg-white/8 font-normal"
                                  )}
                                >
                                  <Icon
                                    className="h-4 w-4 shrink-0 text-blue-200/75"
                                    strokeWidth={1.5}
                                  />
                                  <span className="min-w-0 flex-1 truncate text-white">{label}</span>
                                  {id === "notif" && unreadCount > 0 && (
                                    <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-xs text-blue-200/85 tabular-nums">
                                      <span className="h-1.5 w-1.5 rounded-full bg-[#fb923c]" />
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
                          "px-3 pb-1.5 text-xs font-normal text-blue-200/65",
                          idx === 0 ? "pt-0.5" : "pt-5"
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
                        "relative flex h-9 w-full items-center gap-2.5 rounded-lg px-3 text-xs font-medium transition-colors duration-150 text-left cursor-pointer",
                        isActive
                          ? "bg-white/14 text-white font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                          : "text-blue-100/85 hover:text-white hover:bg-white/8 font-normal"
                      )}
                    >
                      <Icon
                        className="h-4 w-4 shrink-0 text-blue-200/80"
                        strokeWidth={1.5}
                      />
                      <span className="min-w-0 flex-1 truncate text-white">{label}</span>
                      {id === "notif" && unreadCount > 0 && (
                        <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-xs text-blue-200/85 tabular-nums">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#fb923c]" />
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

        {/* Bottom Section: Quiet Plan Summary & Sign Out */}
        <div className="p-3 pt-3 border-t border-white/10 space-y-2">
          {isEmployer && (
            <div className="rounded-xl border border-white/10 bg-[#002250] p-3 text-left space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-white">TalentCIR Pro</p>
                <span className="font-mono text-[11px] text-blue-200/75">Employer</span>
              </div>
              <p className="text-[11px] leading-relaxed text-blue-200/75">
                Verified CIR reports, pipeline analytics and candidate unlock credits
              </p>
              <Button
                type="button"
                size="sm"
                onClick={() => onNavigate("advertise")}
                className="w-full h-8 rounded-lg bg-white text-[#002C66] hover:bg-blue-50 text-xs font-medium border-0 shadow-none cursor-pointer"
              >
                Upgrade plan
              </Button>
            </div>
          )}

          <Button
            type="button"
            onClick={onLogout}
            className="w-full h-9 rounded-lg px-3 py-2 text-xs font-medium flex items-center justify-center gap-2 bg-white/8 hover:bg-white/14 text-blue-100 hover:text-white border border-white/12 shadow-none transition-colors duration-150 cursor-pointer"
          >
            <LogoutIcon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
            <span>Sign out</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}