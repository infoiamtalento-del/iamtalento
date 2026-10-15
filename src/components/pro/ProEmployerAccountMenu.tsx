import { Building2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { employerMenuItems, employerLogoutIcon as LogoutIcon } from "./employerMenu";
import type { ProView } from "./proTypes";
import { cn } from "@/lib/utils";

interface Props {
  name: string;
  activeView: ProView;
  unreadCount: number;
  onNavigate: (view: ProView) => void;
  onSignOut: () => void;
}

export function ProEmployerAccountMenu({ name, activeView, unreadCount, onNavigate, onSignOut }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" aria-label="Employer account menu" className="h-10 gap-2 rounded-full px-1.5 sm:pr-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground"><Building2 /></span>
          <span className="hidden max-w-24 truncate text-xs sm:block">{name}</span><ChevronDown className="hidden h-3.5 w-3.5 sm:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={10} className="z-[60] w-72 max-w-[calc(100vw-2rem)] max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-lg bg-popover p-3 text-popover-foreground">
        <div className="flex items-center gap-3 px-2 py-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"><Building2 className="h-6 w-6" /></span>
          <div className="min-w-0"><p className="truncate font-display font-bold">{name}</p><p className="mt-1 text-xs text-muted-foreground">Employer · Demo account</p></div>
        </div>
        <DropdownMenuSeparator />
        {employerMenuItems.map(({ id, label, icon: Icon }) => (
          <DropdownMenuItem key={id} onSelect={() => onNavigate(id)} className={cn("min-h-11 cursor-pointer gap-3 rounded-md px-3 text-sm font-semibold", id === activeView && "bg-primary/10 text-primary")}>
            <Icon className="h-[18px] w-[18px] shrink-0 text-primary" /><span>{label}</span>
            {id === "notif" && unreadCount > 0 && <span className="ml-auto rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground">{unreadCount}</span>}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onSignOut} className="min-h-11 cursor-pointer gap-3 px-3 text-sm font-semibold"><LogoutIcon className="h-[18px] w-[18px] text-primary" />Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}