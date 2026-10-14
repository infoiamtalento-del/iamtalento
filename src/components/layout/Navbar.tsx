import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, ChevronRight, Sparkles, User, LogOut, Briefcase, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import siteLogo from "@/assets/I-am-Talento-2.png.asset.json";
import { ProductMenu, siteNavLinks as navLinks, dropdownItemsMap, type DropdownId } from "./HeaderMenuContent";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownId | null>(null);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<DropdownId | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const profileRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
    setMobileOpenDropdown(null);
    setProfileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (openDropdown) {
        const ref = dropdownRefs.current[openDropdown];
        if (ref && !ref.contains(e.target as Node)) {
          setOpenDropdown(null);
        }
      }
      if (profileMenuOpen && profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openDropdown, profileMenuOpen]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfileMenuOpen(false);
    toast.success("Signed out successfully");
    navigate("/");
  };

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";
  const initials = (displayName.charAt(0) || "U").toUpperCase();

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b border-border bg-background shadow-sm transition-all duration-300",
        scrolled ? "py-3" : "py-4"
      )}
    >
      <nav className="container flex items-center" aria-label="Main navigation">
        <Link to="/" className="flex items-center gap-2 group mr-auto" aria-label="IAmTalento Home">
          <img src={siteLogo.url} alt="I Am Talento" className="h-10 w-auto object-contain" />
        </Link>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) =>
            link.dropdownId ? (
              <div key={link.href} className="relative" ref={(el) => { if (link.dropdownId) dropdownRefs.current[link.dropdownId] = el; }}>
                <Button variant="ghost"
                  aria-expanded={openDropdown === link.dropdownId}
                  onClick={() => setOpenDropdown(openDropdown === link.dropdownId ? null : link.dropdownId ?? null)}
                  className={cn(
                    "px-3.5 py-2 rounded-lg text-sm font-medium transition-colors relative inline-flex items-center gap-1",
                    location.pathname === link.href
                      ? "text-primary bg-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                >
                  {link.label}
                  <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", openDropdown === link.dropdownId && "rotate-180")} />
                </Button>
                {openDropdown === link.dropdownId && (
                  <div className={cn("absolute top-full mt-1 rounded-lg border bg-popover text-popover-foreground shadow-lg z-50 py-1 animate-fade-in", link.dropdownId === "products" ? "right-0 w-[640px] max-w-[calc(100vw-2rem)]" : "left-0 w-40")}>
                    {link.dropdownId === "products" ? <ProductMenu /> : (
                    dropdownItemsMap[link.dropdownId].map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className="flex items-center gap-2 px-3.5 py-2.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors group"
                      >
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent-foreground transition-colors" />
                        {item.label}
                      </Link>
                    )))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "px-3.5 py-2 rounded-lg text-sm font-medium transition-colors relative",
                  location.pathname === link.href
                    ? "text-primary bg-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                {link.label}
              </Link>
            )
          )}
          <div className="flex items-center gap-2 ml-4 pl-4 border-l border-border">
            <Link to="/for-employers">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 border-0">
                For Employers
              </Button>
            </Link>

            {!user ? (
              <Link to="/auth">
                <Button size="sm" variant="outline" className="border-border hover:bg-accent font-semibold px-3.5">
                  Login
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/talento-pro">
                  <Button size="sm" variant="ghost" className="text-xs font-bold text-primary bg-primary/10 hover:bg-primary/15 gap-1.5 h-8 px-2.5 rounded-lg">
                    <Sparkles className="h-3.5 w-3.5" /> Pro
                  </Button>
                </Link>

                <div className="relative" ref={profileRef}>
                  <button
                    type="button"
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    aria-label="User account menu"
                    aria-expanded={profileMenuOpen}
                    className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full border border-border hover:border-primary/40 bg-card transition-all cursor-pointer shadow-2xs"
                  >
                    <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center shrink-0 overflow-hidden">
                      {initials}
                    </div>
                    <span className="text-xs font-bold text-foreground max-w-[110px] truncate">
                      {displayName}
                    </span>
                    <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", profileMenuOpen && "rotate-180")} />
                  </button>

                  {profileMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-border bg-popover text-popover-foreground shadow-xl z-50 p-3 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="flex items-center gap-2.5 pb-2.5 border-b border-border/80 px-1">
                        <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-bold truncate text-foreground">{displayName}</div>
                          <div className="text-[11px] text-muted-foreground truncate">{user.email}</div>
                        </div>
                      </div>

                      <div className="py-2 space-y-0.5">
                        <Link
                          to="/talento-pro"
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-foreground hover:bg-accent transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" /> Talento Pro
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">PRO</span>
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-foreground hover:bg-accent transition-colors"
                        >
                          <User className="h-4 w-4 text-muted-foreground" /> My Profile
                        </Link>
                        <Link
                          to="/talento-pro?view=applied"
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-foreground hover:bg-accent transition-colors"
                        >
                          <Briefcase className="h-4 w-4 text-muted-foreground" /> Applications
                        </Link>
                        <Link
                          to="/talento-pro?view=saved"
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-foreground hover:bg-accent transition-colors"
                        >
                          <Bookmark className="h-4 w-4 text-muted-foreground" /> Saved Jobs
                        </Link>
                      </div>

                      <div className="pt-2 border-t border-border/80">
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors text-left cursor-pointer"
                        >
                          <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile toggle & profile */}
        <div className="lg:hidden flex items-center gap-2">
          {user ? (
            <Link to="/profile" className="flex items-center" aria-label="My Profile">
              <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center border border-border shadow-xs">
                {initials}
              </div>
            </Link>
          ) : (
            <Link to="/auth">
              <Button size="sm" variant="outline" className="text-xs h-7 px-2.5 font-semibold">
                Login
              </Button>
            </Link>
          )}
          <Button variant="ghost" size="icon"
            className="p-2 rounded-lg hover:bg-accent transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-background/95 backdrop-blur-md border-t border-border mt-2 animate-fade-in">
          <div className="container py-4 flex flex-col gap-1">
            {navLinks.map((link) =>
              link.dropdownId ? (
                <div key={link.href}>
                  <Button variant="ghost"
                    aria-expanded={mobileOpenDropdown === link.dropdownId}
                    onClick={() => setMobileOpenDropdown(mobileOpenDropdown === link.dropdownId ? null : link.dropdownId ?? null)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                      location.pathname === link.href
                        ? "text-primary bg-accent"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {link.label}
                    <ChevronDown className={cn("h-4 w-4 transition-transform", mobileOpenDropdown === link.dropdownId && "rotate-180")} />
                  </Button>
                  {mobileOpenDropdown === link.dropdownId && (
                    <div className="ml-4 flex flex-col gap-0.5">
                      {link.dropdownId === "products" ? <ProductMenu /> : dropdownItemsMap[link.dropdownId].map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          className="px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    location.pathname === link.href
                      ? "text-primary bg-accent"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
            <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-border">
              <Link to="/for-employers" onClick={() => setMobileOpen(false)}>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border-0">
                  For Employers
                </Button>
              </Link>
              {!user ? (
                <Link to="/auth" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full font-semibold">
                    Login
                  </Button>
                </Link>
              ) : (
                <div className="space-y-1.5 pt-2 border-t border-border">
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-accent/50">
                    <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-foreground truncate">{displayName}</div>
                      <div className="text-[11px] text-muted-foreground truncate">{user.email}</div>
                    </div>
                  </div>
                  <Link
                    to="/talento-pro"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-primary bg-primary/10"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" /> Talento Pro
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary text-primary-foreground">PRO</span>
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-accent"
                  >
                    <User className="h-4 w-4 text-muted-foreground" /> My Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 text-left cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
