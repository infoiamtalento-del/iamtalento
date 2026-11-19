import { Bell, ChevronDown, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { employerMenuItems, employerLogoutIcon as LogoutIcon } from "./employerMenu";
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
              <span className="max-w-32 truncate text-xs font-bold text-[#002C66] dark:text-foreground leading-tight">
                {name}
              </span>
              <span className="max-w-36 truncate text-[11px] font-medium text-muted-foreground leading-tight mt-0.5">
                {roleLabel}
              </span>
            </span>
            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={10} className="z-[60] w-72 max-w-[calc(100vw-2rem)] max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-xl bg-popover p-3 text-popover-foreground shadow-xl border border-border">
          <div className="flex items-center gap-3 px-2 py-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 text-[#002C66] dark:text-white overflow-hidden">
              {avatarSrc ? <img src={avatarSrc} alt={name} className="h-full w-full object-cover" /> : <UserRound className="h-6 w-6" />}
            </span>
            <div className="min-w-0">
              <p className="truncate font-display font-bold text-foreground">{name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{roleLabel}</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          {employerMenuItems.map(({ id, label, icon: Icon }) => (
            <DropdownMenuItem
              key={id}
              onSelect={() => onNavigate(id)}
              className={cn(
                "min-h-10 cursor-pointer gap-3 rounded-lg px-3 text-xs font-semibold",
                id === activeView && "bg-primary/10 text-primary"
              )}
            >
              <Icon className="h-4 w-4 shrink-0 text-primary" />
              <span>{label}</span>
              {id === "notif" && badgeCount > 0 && (
                <span className="ml-auto rounded-full bg-[#FB923C] px-2 py-0.5 text-[10px] text-white font-bold">
                  {badgeCount}
                </span>
              )}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <div className="pt-1">
            <Button
              type="button"
              onClick={onSignOut}
              className="w-full h-10 flex items-center justify-center gap-2 rounded-lg px-3 text-xs font-bold bg-[#FB923C] hover:bg-[#F97316] text-white border border-orange-200/40 shadow-sm cursor-pointer"
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