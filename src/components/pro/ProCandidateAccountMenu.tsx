import { Award, Bell, Bot, ChevronDown, FolderKanban, GraduationCap, Headphones, LogOut, Moon, SlidersHorizontal, Sun, Users, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { ProView } from "./proTypes";
import { cn } from "@/lib/utils";

interface Props {
  name: string;
  avatarSrc?: string;
  activeView: ProView;
  unreadCount: number;
  isDarkMode: boolean;
  onNavigate: (view: ProView) => void;
  onCertificate: () => void;
  onToggleTheme: () => void;
  onSignOut: () => void;
}

const entries = [
  { id: "profile", label: "My Profile", icon: Users },
  { id: "dash", label: "Dashboard", icon: SlidersHorizontal },
  { id: "cert", label: "My Assessments", icon: GraduationCap },
  { id: "upd", label: "Notifications", icon: Bell },
  { id: "port", label: "Portfolio", icon: FolderKanban },
  { id: "resume", label: "AI Resume Builder", icon: Bot },
  { id: "certificate", label: "Download Certificate", icon: Award },
  { id: "wallet", label: "Wallet", icon: Wallet },
  { id: "support", label: "Support", icon: Headphones },
] as const;

export function ProCandidateAccountMenu({ name, avatarSrc, activeView, unreadCount, isDarkMode, onNavigate, onCertificate, onToggleTheme, onSignOut }: Props) {
  const avatar = (large: boolean) => (
    <span className={cn("flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-primary-foreground font-bold", large ? "h-12 w-12 text-lg" : "h-7 w-7 text-xs")}>
      {avatarSrc ? <img src={avatarSrc} alt={name} className="h-full w-full object-cover" /> : name.charAt(0).toUpperCase()}
    </span>
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" aria-label="Employee account menu" className="h-10 gap-2 rounded-full px-1.5 sm:pr-3">
          {avatar(false)}<span className="hidden max-w-24 truncate text-xs sm:block">{name}</span><ChevronDown className="hidden h-3.5 w-3.5 sm:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={10} className="z-[60] w-72 max-w-[calc(100vw-2rem)] max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-lg p-3 bg-popover text-popover-foreground">
        <div className="flex items-center gap-3 px-2 py-3">
          {avatar(true)}<div className="min-w-0"><p className="truncate font-display font-bold">{name}</p><p className="mt-1 text-xs text-muted-foreground">Candidate</p></div>
        </div>
        <DropdownMenuSeparator />
        {entries.map(({ id, label, icon: Icon }) => (
          <DropdownMenuItem key={id} onSelect={() => id === "certificate" ? onCertificate() : onNavigate(id)} className={cn("min-h-11 cursor-pointer gap-3 rounded-md px-3 text-sm font-semibold", id === activeView && "bg-primary/10 text-primary")}>
            <Icon className="h-[18px] w-[18px] shrink-0 text-primary" /><span>{label}</span>
            {id === "profile" && <span className="ml-auto rounded-full bg-primary/10 px-3 py-1 text-[10px] text-primary">View</span>}
            {id === "upd" && unreadCount > 0 && <span className="ml-auto flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-1 text-xs text-primary-foreground">{unreadCount}</span>}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onToggleTheme} className="min-h-11 cursor-pointer gap-3 px-3 text-sm font-semibold">{isDarkMode ? <Sun className="h-[18px] w-[18px] text-primary" /> : <Moon className="h-[18px] w-[18px] text-primary" />}Light / Dark</DropdownMenuItem>
        <DropdownMenuItem onSelect={onSignOut} className="min-h-11 mt-1 cursor-pointer gap-3 rounded-lg px-3 text-sm font-bold bg-gradient-to-br from-[#FBBF24] via-[#F59E0B] to-[#EA580C] hover:from-[#F59E0B] hover:via-[#EA580C] hover:to-[#C2410C] text-white focus:text-white shadow-sm"><LogOut className="h-[18px] w-[18px] text-white" />Sign Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}