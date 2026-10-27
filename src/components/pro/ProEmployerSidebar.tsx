import { cn } from "@/lib/utils";
import { employerMenuItems, employeeMenuItems, employerLogoutIcon as LogoutIcon } from "./employerMenu";
import type { ProView } from "./proTypes";
import { getCandidatePhoto } from "@/data/portalAssets";

interface Props {
  activeView: ProView;
  onNavigate: (view: ProView) => void;
  onLogout: () => void;
  unreadCount: number;
  userName?: string;
  userAvatar?: string;
  userRole?: string;
  isEmployer?: boolean;
}

export function ProEmployerSidebar({
  activeView,
  onNavigate,
  onLogout,
  unreadCount,
  userName,
  userAvatar,
  userRole = "Workspace",
  isEmployer = false,
}: Props) {
  const menuItems = isEmployer ? employerMenuItems : employeeMenuItems;
  const photoUrl = userAvatar || getCandidatePhoto(userName || "Yogesh");

  return (
    <aside className="w-full lg:w-64 xl:w-72 shrink-0 lg:fixed lg:top-16 lg:bottom-0 lg:left-0 z-30 lg:border-r border-[#001D44] bg-[#002C66] text-white overflow-y-auto shadow-md">
      <div className="p-3 sm:p-4 flex flex-col min-h-full justify-between text-white">
        <div>
          {/* Header */}
          <div className="px-3 py-2.5 mb-2 border-b border-white/15">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white/30 bg-white/15 shrink-0 shadow-sm flex items-center justify-center">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={userName || "User"}
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

          {/* Navigation Items */}
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
                    "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all text-left cursor-pointer",
                    isActive
                      ? "bg-white/20 text-white shadow-xs border border-white/30 backdrop-blur-xs"
                      : "text-white/85 hover:text-white hover:bg-white/10"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      isActive ? "text-white" : "text-blue-100 group-hover:text-white"
                    )}
                  />
                  <span className="min-w-0 flex-1 truncate text-white">{label}</span>
                  {id === "notif" && unreadCount > 0 && (
                    <span
                      className={cn(
                        "ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
                        isActive
                          ? "bg-white text-[#002C66] shadow-xs"
                          : "bg-red-500 text-white shadow-xs"
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

        {/* Logout */}
        <div className="pt-3 mt-4 border-t border-white/15">
          <button
            type="button"
            onClick={onLogout}
            className="group flex w-full items-center justify-center sm:justify-start gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold bg-gradient-to-br from-[#FBBF24] via-[#F59E0B] to-[#EA580C] hover:from-[#F59E0B] hover:via-[#EA580C] hover:to-[#C2410C] text-white shadow-md transition-all cursor-pointer"
          >
            <LogoutIcon className="h-4 w-4 shrink-0 text-white transition-colors" />
            <span className="text-white">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}