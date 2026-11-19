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
    <div className="flex items-center gap-3 sm:gap-4 shrink-0">
      {/* Notifications Bell Icon with Orange Unread Badge */}
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => onNavigate("notif")}
        className={cn(
          "relative inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors cursor-pointer",
          activeView === "notif"
            ? "border-[#002C66]/30 bg-[#002C66]/10 text-[#002C66]"
            : "border-border/80 bg-background hover:bg-accent text-[#002C66] dark:text-foreground"
        )}
        title="View notifications"
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        <span
          aria-label={`${badgeCount} notifications`}
          className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FB923C] px-1 text-[10px] font-extrabold text-white shadow-xs ring-2 ring-card"
        >
          {badgeCount}
        </span>
      </button>

      {/* Profile Icon + Name + Employer Dashboard Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            aria-label="Account menu"
            className="h-auto py-1.5 px-2 sm:px-2.5 gap-2.5 rounded-full hover:bg-accent/70 cursor-pointer"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#002C66] dark:text-white overflow-hidden shadow-2xs">
              {avatarSrc ? (
                <img src={avatarSrc} alt={name} className="h-full w-full object-cover" />
              ) : (
                <UserRound className="h-5 w-5" aria-hidden="true" />
              )}
            </span>
            <span className="hidden sm:flex flex-col items-start text-left min-w-0">
              <span className="max-w-44 truncate text-xs font-bold text-[#002C66] dark:text-foreground leading-tight">
                {name}
              </span>
              <span className="max-w-44 truncate text-[11px] font-medium text-muted-foreground leading-tight mt-0.5">
                {roleLabel}
              </span>
            </span>
            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={10} className="z-[60] w-80 max-w-[calc(100vw-2rem)] max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-xl bg-popover p-3 text-popover-foreground shadow-xl border border-border">
          <div className="flex items-center gap-3 px-2 py-2.5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 text-[#002C66] dark:text-white overflow-hidden">
              {avatarSrc ? <img src={avatarSrc} alt={name} className="h-full w-full object-cover" /> : <UserRound className="h-5 w-5" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-sm font-bold text-foreground">{name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{roleLabel}</p>
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
                  "min-h-9 cursor-pointer gap-3 rounded-lg px-3 text-xs font-semibold",
                  id === activeView && "bg-primary/10 text-primary"
                )}
              >
                <Icon className="h-4 w-4 shrink-0 text-primary" />
                <span>{label}</span>
              </DropdownMenuItem>
            ))}
          </div>

          <DropdownMenuSeparator className="my-2" />

          {/* Collapsible Category Dropdowns (from Create Jobs onwards) */}
          <div className="space-y-1">
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
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition-colors cursor-pointer text-left",
                      hasActiveItem
                        ? "bg-primary/8 text-primary"
                        : "text-foreground hover:bg-accent/70"
                    )}
                  >
                    <GroupIcon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <span className="flex-1 truncate">{group.label}</span>
                    {!isOpen && hasNotifBadge && (
                      <span className="rounded-full bg-[#FB923C] px-1.5 py-0.5 text-[10px] font-bold text-white leading-none">
                        {badgeCount}
                      </span>
                    )}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                        isOpen && "rotate-180 text-primary"
                      )}
                      aria-hidden="true"
                    />
                  </button>

                  {isOpen && (
                    <div className="ml-4 mt-0.5 mb-1 pl-2.5 border-l border-border space-y-0.5">
                      {group.items.map(({ id, label, icon: Icon }) => (
                        <DropdownMenuItem
                          key={id}
                          onSelect={() => onNavigate(id)}
                          className={cn(
                            "min-h-8.5 cursor-pointer gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium",
                            id === activeView
                              ? "bg-primary/10 text-primary font-semibold"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <Icon className="h-3.5 w-3.5 shrink-0 text-primary/80" />
                          <span className="truncate">{label}</span>
                          {id === "notif" && badgeCount > 0 && (
                            <span className="ml-auto rounded-full bg-[#FB923C] px-1.5 py-0.5 text-[10px] text-white font-bold leading-none">
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

          <DropdownMenuSeparator className="my-2" />
          <div className="pt-0.5">
            <Button
              type="button"
              onClick={onSignOut}
              className="w-full h-9 flex items-center justify-center gap-2 rounded-lg px-3 text-xs font-semibold bg-[#FB923C] hover:bg-[#F97316] text-white border border-orange-200/40 shadow-xs cursor-pointer"
            >
              <LogoutIcon className="h-4 w-4 text-white" />
              <span>Logout</span>
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}