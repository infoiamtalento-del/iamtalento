import { useEffect, useState } from "react";
import { Bell, ChevronDown, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  employerDirectItems,
  employerCategoryGroups,
  employerLogoutIcon as LogoutIcon,
} from "./employerMenu";
import type { ProView } from "./proTypes";
import { cn } from "@/lib/utils";

interface Props {
  name: string;
  avatarSrc?: string;
  roleLabel?: string;
  activeView: ProView;
  unreadCount: number;
  onNavigate: (view: ProView) => void;
  onSignOut: () => void;
}

export function ProEmployerAccountMenu({
  name,
  avatarSrc,
  roleLabel = "Employer Dashboard",
  activeView,
  unreadCount,
  onNavigate,
  onSignOut,
}: Props) {
  const badgeCount = unreadCount > 0 ? unreadCount : 3;

  const findActiveGroupId = (view: ProView) =>
    employerCategoryGroups.find((g) => g.items.some((item) => item.id === view))?.id ?? null;

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const activeGroup = findActiveGroupId(activeView);
    return activeGroup ? { [activeGroup]: true } : {};
  });

  useEffect(() => {
    const activeGroup = findActiveGroupId(activeView);
    if (activeGroup) {
      setOpenGroups((prev) => (prev[activeGroup] ? prev : { ...prev, [activeGroup]: true }));
    }
  }, [activeView]);

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  return (
    <div className="flex items-center gap-2.5 shrink-0">
      {/* Notifications Bell Button (36px control, 8px radius, quiet tabular badge) */}
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => onNavigate("notif")}
        className={cn(
          "relative inline-flex h-9 items-center gap-1.5 rounded-lg border px-2.5 text-xs transition-colors duration-150 cursor-pointer",
          activeView === "notif"
            ? "border-[#002C66]/25 bg-[#002C66]/[0.06] text-[#111827]"
            : "border-[#111827]/[0.08] bg-white hover:bg-[#f5f7fa] text-[#4b5565] dark:bg-[#11141c] dark:text-[#eef0f5]"
        )}
        title="View notifications"
      >
        <Bell className="h-4 w-4 text-[#6b7487]" strokeWidth={1.5} aria-hidden="true" />
        <span
          aria-label={`${badgeCount} notifications`}
          className="inline-flex items-center gap-1 font-mono text-xs font-medium text-[#111827] dark:text-[#eef0f5] tabular-nums"
        >
          {badgeCount > 0 && <span className="h-1.5 w-1.5 rounded-full bg-[#ea580c]" />}
          {badgeCount}
        </span>
      </button>

      {/* Profile Icon + Name + Employer Dashboard Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            aria-label="Account menu"
            className="h-9 py-1 px-2 gap-2 rounded-lg border border-transparent hover:border-[#111827]/[0.08] hover:bg-[#f5f7fa] transition-colors duration-150 cursor-pointer"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#eceff4] border border-[#111827]/[0.08] text-[#111827] overflow-hidden">
              {avatarSrc ? (
                <img src={avatarSrc} alt={name} className="h-full w-full object-cover" />
              ) : (
                <UserRound className="h-4 w-4 text-[#6b7487]" strokeWidth={1.5} aria-hidden="true" />
              )}
            </span>
            <span className="hidden sm:flex flex-col items-start text-left min-w-0">
              <span className="max-w-44 truncate text-xs font-medium text-[#111827] dark:text-[#eef0f5] leading-tight">
                {name}
              </span>
              <span className="max-w-44 truncate text-[11px] font-normal text-[#6b7487] leading-tight">
                {roleLabel}
              </span>
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-[#6b7487] shrink-0" strokeWidth={1.5} aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8} className="z-[60] w-72 max-w-[calc(100vw-2rem)] max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-xl bg-white dark:bg-[#11141c] p-2.5 text-[#111827] dark:text-[#eef0f5] shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-[#111827]/[0.08]">
          <div className="flex items-center gap-3 px-2 py-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#eceff4] border border-[#111827]/[0.08] text-[#111827] overflow-hidden">
              {avatarSrc ? <img src={avatarSrc} alt={name} className="h-full w-full object-cover" /> : <UserRound className="h-4 w-4 text-[#6b7487]" strokeWidth={1.5} />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[#111827] dark:text-[#eef0f5]">{name}</p>
              <p className="text-xs text-[#6b7487]">{roleLabel}</p>
            </div>
          </div>
          <DropdownMenuSeparator />

          {/* Direct Overview Items (Dashboard, My Account, Company Profile) */}
          <div className="space-y-0.5">
            {employerDirectItems.map(({ id, label, icon: Icon }) => (
              <DropdownMenuItem
                key={id}
                onSelect={() => onNavigate(id)}
                className={cn(
                  "min-h-9 cursor-pointer gap-2.5 rounded-lg px-2.5 text-xs font-medium",
                  id === activeView && "bg-[#eceff4] text-[#111827]"
                )}
              >
                <Icon className="h-4 w-4 shrink-0 text-[#6b7487]" strokeWidth={1.5} />
                <span>{label}</span>
              </DropdownMenuItem>
            ))}
          </div>

          <DropdownMenuSeparator className="my-1.5" />

          {/* Collapsible Category Dropdowns (from Create Jobs onwards) */}
          <div className="space-y-0.5">
            {employerCategoryGroups.map((group) => {
              const GroupIcon = group.icon;
              const isOpen = Boolean(openGroups[group.id]);
              const hasActiveItem = group.items.some((item) => item.id === activeView);
              const hasNotifBadge = group.items.some((item) => item.id === "notif") && badgeCount > 0;

              return (
                <div key={group.id} className="rounded-lg">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleGroup(group.id);
                    }}
                    className={cn(
                      "flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-xs font-medium transition-colors duration-150 cursor-pointer text-left",
                      hasActiveItem
                        ? "bg-[#eceff4] text-[#111827]"
                        : "text-[#111827] hover:bg-[#f5f7fa]"
                    )}
                  >
                    <GroupIcon className="h-4 w-4 shrink-0 text-[#6b7487]" strokeWidth={1.5} aria-hidden="true" />
                    <span className="flex-1 truncate">{group.label}</span>
                    {!isOpen && hasNotifBadge && (
                      <span className="inline-flex items-center gap-1 font-mono text-xs text-[#4b5565] tabular-nums">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#ea580c]" />
                        {badgeCount}
                      </span>
                    )}
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 shrink-0 text-[#6b7487] transition-transform duration-150",
                        isOpen && "rotate-180 text-[#111827]"
                      )}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </button>

                  {isOpen && (
                    <div className="ml-4 mt-0.5 mb-1 pl-2.5 border-l border-[#111827]/[0.08] space-y-0.5">
                      {group.items.map(({ id, label, icon: Icon }) => (
                        <DropdownMenuItem
                          key={id}
                          onSelect={() => onNavigate(id)}
                          className={cn(
                            "min-h-8 cursor-pointer gap-2.5 rounded-lg px-2.5 py-1.5 text-xs",
                            id === activeView
                              ? "bg-[#eceff4] text-[#111827] font-medium"
                              : "text-[#4b5565] hover:text-[#111827] font-normal"
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0 text-[#6b7487]" strokeWidth={1.5} />
                          <span className="truncate">{label}</span>
                          {id === "notif" && badgeCount > 0 && (
                            <span className="ml-auto inline-flex items-center gap-1 font-mono text-xs text-[#4b5565] tabular-nums">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#ea580c]" />
                              {badgeCount}
                            </span>
                          )}
                        </DropdownMenuItem>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <DropdownMenuSeparator className="my-1.5" />
          <div className="pt-0.5">
            <Button
              type="button"
              variant="outline"
              onClick={onSignOut}
              className="w-full h-9 flex items-center justify-center gap-2 rounded-lg px-3 text-xs font-medium text-[#111827] border-[#111827]/[0.12] hover:bg-[#f5f7fa] cursor-pointer"
            >
              <LogoutIcon className="h-4 w-4 text-[#6b7487]" strokeWidth={1.5} />
              <span>Sign out</span>
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}