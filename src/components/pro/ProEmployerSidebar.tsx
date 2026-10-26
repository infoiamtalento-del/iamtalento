import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { employerMenuItems, employeeMenuItems, employerLogoutIcon as LogoutIcon } from "./employerMenu";
import type { ProView } from "./proTypes";
import { LayoutDashboard } from "lucide-react";

interface Props {
  activeView: ProView;
  onNavigate: (view: ProView) => void;
  onLogout: () => void;
  unreadCount: number;
  userName?: string;
  userRole?: string;
  isEmployer?: boolean;
}

export function ProEmployerSidebar({
  activeView,
  onNavigate,
  onLogout,
  unreadCount,
  userName,
  userRole = "Workspace",
  isEmployer = false,
}: Props) {
  const menuItems = isEmployer ? employerMenuItems : employeeMenuItems;

  return (
    <aside className="w-full lg:w-64 xl:w-72 shrink-0 lg:fixed lg:top-16 lg:bottom-0 lg:left-0 z-30 lg:border-r border-border bg-card overflow-y-auto">
      <div className="p-3 sm:p-4 flex flex-col min-h-full justify-between">
        <div>
          <div className="px-3 py-2.5 mb-2 border-b border-border/80">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <LayoutDashboard className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground truncate">
                  Dashboard Menu
                </p>
                {userName && (
                  <p className="text-xs font-semibold text-foreground truncate">
                    {userName}
                  </p>
                )}
              </div>
            </div>
          </div>

          <nav aria-label="Dashboard navigation" className="space-y-1">
            {menuItems.map(({ id, label, icon: Icon }) => {
              const isActive = activeView === id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => onNavigate(id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all text-left cursor-pointer",
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:bg-accent/70 hover:text-foreground"
                  )}
                >
                  <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary-foreground" : "text-primary")} />
                  <span className="min-w-0 flex-1 truncate">{label}</span>
                  {id === "notif" && unreadCount > 0 && (
                    <span
                      className={cn(
                        "ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
                        isActive
                          ? "bg-primary-foreground text-primary"
                          : "bg-primary text-primary-foreground"
                      )}
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-3 mt-4 border-t border-border">
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
          >
            <LogoutIcon className="h-4 w-4 shrink-0 text-destructive" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}