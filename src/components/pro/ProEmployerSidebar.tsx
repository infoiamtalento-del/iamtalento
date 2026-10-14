import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { employerMenuItems, employerLogoutIcon as LogoutIcon } from "./employerMenu";
import type { ProView } from "./proTypes";

interface Props {
  activeView: ProView;
  onNavigate: (view: ProView) => void;
  onLogout: () => void;
  unreadCount: number;
}

export function ProEmployerSidebar({ activeView, onNavigate, onLogout, unreadCount }: Props) {
  return (
    <aside className="hidden lg:block w-56 shrink-0 border-r border-border pr-5">
      <nav aria-label="Employer account" className="sticky top-24 space-y-1 max-h-[calc(100dvh-7rem)] overflow-y-auto">
        <p className="px-3 pb-3 text-xs font-semibold uppercase text-muted-foreground">Employer account</p>
        {employerMenuItems.map(({ id, label, icon: Icon }) => (
          <Button key={id} variant="ghost" aria-current={activeView === id ? "page" : undefined} onClick={() => onNavigate(id)} className={cn("w-full justify-start gap-3 px-3 text-xs h-10", activeView === id ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : "text-muted-foreground")}>
            <Icon /><span className="whitespace-normal text-left">{label}</span>
            {id === "notif" && unreadCount > 0 && <span className="ml-auto text-[10px]">{unreadCount}</span>}
          </Button>
        ))}
        <div className="pt-3 mt-3 border-t border-border">
          <Button variant="ghost" onClick={onLogout} className="w-full justify-start gap-3 px-3 text-xs text-muted-foreground"><LogoutIcon />Logout</Button>
        </div>
      </nav>
    </aside>
  );
}