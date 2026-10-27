import { Building2, ChevronDown } from "lucide-react";
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
  roleLabel = "Workspace",
  activeView,
  unreadCount,
  onNavigate,
  onSignOut,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" aria-label="Account menu" className="h-10 gap-2 rounded-full px-1.5 sm:pr-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground overflow-hidden">
            {avatarSrc ? <img src={avatarSrc} alt={name} className="h-full w-full object-cover" /> : <Building2 className="h-4 w-4" />}
          </span>
          <span className="hidden max-w-24 truncate text-xs sm:block">{name}</span>
          <ChevronDown className="hidden h-3.5 w-3.5 sm:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={10} className="z-[60] w-72 max-w-[calc(100vw-2rem)] max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-xl bg-popover p-3 text-popover-foreground shadow-xl border border-border">
        <div className="flex items-center gap-3 px-2 py-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground overflow-hidden">
            {avatarSrc ? <img src={avatarSrc} alt={name} className="h-full w-full object-cover" /> : <Building2 className="h-6 w-6" />}
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
            {id === "notif" && unreadCount > 0 && (
              <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-[10px] text-primary-foreground font-bold">
                {unreadCount}
              </span>
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={onSignOut}
          className="min-h-10 cursor-pointer gap-3 rounded-lg px-3 text-xs font-bold bg-gradient-to-br from-[#FBBF24] via-[#F59E0B] to-[#EA580C] hover:from-[#F59E0B] hover:via-[#EA580C] hover:to-[#C2410C] text-white focus:text-white shadow-sm"
        >
          <LogoutIcon className="h-4 w-4 text-white" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}