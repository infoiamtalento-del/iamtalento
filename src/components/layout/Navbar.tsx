import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, ChevronRight, ArrowRight, BadgeCheck, BellRing, Bot, Building2, CalendarClock, FileText, Library, Palette, ShieldCheck, Sparkles, UserRound, Users, Video, Wand2, User, LogOut, Briefcase, Bookmark, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { siteLogo } from "@/assets/logo";

const eventsDropdownItems = [
  { label: "Hackathons", href: "/hackathons" },
  { label: "Podcasts", href: "/podcasts" },
  { label: "Networking", href: "/networking" },
];

const pricingDropdownItems = [
  { label: "For Candidates", href: "/pricing?tab=candidates" },
  { label: "For Employers", href: "/pricing?tab=employers" },
];

type ProductItem = {
  label: string;
  desc: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
};

const candidateProducts: ProductItem[] = [
  { label: "Skill Assessments", desc: "Prove your expertise with proctored tests", href: "/assessments/explore", icon: BadgeCheck, badge: "Paid" },
  { label: "AI Resume Builder", desc: "Craft an ATS-ready resume in minutes", href: "/resources", icon: FileText, badge: "Free" },
  { label: "AI Expert Resume Data", desc: "Benchmark against recruiter-approved profiles", href: "/resources", icon: Sparkles, badge: "Free" },
  { label: "AI Tools Courses", desc: "Master the AI stack employers now expect", href: "/learning", icon: Bot, badge: "Free" },
  { label: "AI Video Resume Builder", desc: "Stand out with a 60-second video pitch", href: "/resources", icon: Video, badge: "Free" },
  { label: "AI Skill Upgrade Alerts", desc: "Get nudged before your skills go stale", href: "/learning", icon: BellRing, badge: "Free" },
];

const employerProducts: ProductItem[] = [
  { label: "Skill Assessment Library", desc: "Ready-made, proctored tests for every role", href: "/employers-page-2", icon: Library },
  { label: "20 Layers of Cheating Prevention", desc: "AI proctoring across the entire test journey", href: "/employers-page-2", icon: ShieldCheck },
  { label: "Custom AI Assessment Creation", desc: "Build role-specific tests in minutes", href: "/employers-page-2", icon: Wand2 },
  { label: "White-Label Branding", desc: "Your brand on every assessment touchpoint", href: "/employers-page-2", icon: Palette },
  { label: "Bulk Campus Hiring & Screening", desc: "Screen thousands of candidates at once", href: "/employers-page-2", icon: Users },
  { label: "Create AI Scheduled Interviews", desc: "Automated interview rounds, hands-free", href: "/employers-page-2", icon: CalendarClock },
];

const ProductItemRow = ({ item }: { item: ProductItem }) => (
  <Link to={item.href} className="group flex items-start gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-accent/60">
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
      <item.icon className="h-[18px] w-[18px]" />
    </span>
    <span className="min-w-0">
      <span className="flex flex-wrap items-center gap-1.5 text-sm font-medium text-foreground">
        {item.label}
        {item.badge && (
          <span className="rounded-full bg-primary/10 px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide text-primary">
            {item.badge}
          </span>
        )}
      </span>
      <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{item.desc}</span>
    </span>
  </Link>
);

const ProductGroup = ({ title, caption, items, icon: GroupIcon }: { title: string; caption: string; items: ProductItem[]; icon: LucideIcon }) => (
  <div className="min-w-0">
    <div className="mb-2 flex items-center gap-3 border-b border-border px-3 pb-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <GroupIcon className="h-4 w-4" />
      </span>
      <div>
        <p className="font-display text-sm font-semibold text-foreground">{title}</p>
        <p className="text-[11px] text-muted-foreground">{caption}</p>
      </div>
    </div>
    <div className="flex flex-col">
      {items.map((item) => (
        <ProductItemRow key={item.label} item={item} />
      ))}
    </div>
  </div>
);

const ProductMenu = () => (
  <div>
    <div className="grid grid-cols-1 gap-x-6 gap-y-4 p-4 pb-2 sm:grid-cols-2">
      <ProductGroup title="Candidate" caption="Everything you need to get hired" items={candidateProducts} icon={UserRound} />
      <ProductGroup title="Employer" caption="Everything you need to hire with proof" items={employerProducts} icon={Building2} />
    </div>
    <div className="flex items-center justify-between gap-3 border-t border-border bg-accent/50 px-5 py-3">
      <p className="text-xs text-muted-foreground">New assessments and tools added every week.</p>
      <Link to="/products" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
        View all products
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  </div>
);

type DropdownId = "events" | "pricing" | "products";

const navLinks: { label: string; href: string; dropdownId?: DropdownId }[] = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Assessments", href: "/assessments" },
  { label: "Learning", href: "/learning" },
  { label: "Pricing", href: "/pricing", dropdownId: "pricing" },
  { label: "Events", href: "/meetups", dropdownId: "events" },
  { label: "Products", href: "/products", dropdownId: "products" },
];

const dropdownItemsMap: Record<DropdownId, { label: string; href: string }[]> = {
  events: eventsDropdownItems,
  pricing: pricingDropdownItems,
  products: [],
};

export interface NavbarProps {
  userProfile?: {
    name?: string;
    email?: string;
    avatarSrc?: string;
    role?: string;
  } | null;
  onSignOut?: () => void;
  accountMenu?: (onSignOut: () => void) => React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ userProfile, onSignOut, accountMenu }) => {
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

  const isProPage = location.pathname === "/talento-pro" || location.pathname === "/pro";

  // Effective user profile
  const effectiveProfile =
    userProfile ??
    (user
      ? {
          name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
          email: user.email || "",
          avatarSrc: user.user_metadata?.avatar_url as string | undefined,
          role: "candidate",
        }
      : isProPage
      ? {
          name: "Yogesh",
          email: "demo.candidate@talento.app",
          avatarSrc: undefined,
          role: "candidate",
        }
      : null);

  const isAuthenticated = Boolean(effectiveProfile);
  const displayName = effectiveProfile?.name || "User";
  const displayEmail = effectiveProfile?.email || "";
  const avatarSrc = effectiveProfile?.avatarSrc;
  const initials = (displayName.charAt(0) || "U").toUpperCase();

  const handleSignOut = async () => {
    if (onSignOut) {
      onSignOut();
    }
    await supabase.auth.signOut();
    setUser(null);
    setProfileMenuOpen(false);
    toast.success("Signed out successfully");
    navigate("/");
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b border-border bg-card shadow-sm transition-all duration-300",
        isProPage ? "h-16 flex items-center py-0" : (scrolled ? "py-3" : "py-4")
      )}
    >
      <nav
        className={cn(
          isProPage
            ? "w-full px-4 sm:px-6 lg:px-8 xl:px-10 flex items-center"
            : "container flex items-center"
        )}
        aria-label="Main navigation"
      >
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
            {!isAuthenticated ? (
              <Link to="/auth">
                <Button size="sm" variant="outline" className="border-border hover:bg-accent font-semibold px-3.5">
                  Login
                </Button>
              </Link>
            ) : null}

            {!isAuthenticated && (
              <Link to="/employers-page-2">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 border-0">
                  For Employers
                </Button>
              </Link>
            )}

            {isAuthenticated && (accountMenu ? accountMenu(handleSignOut) : (
              <div className="flex items-center gap-2">
                {!isProPage && (
                  <Link to="/talento-pro">
                    <Button size="sm" variant="ghost" className="text-xs font-bold text-primary bg-primary/10 hover:bg-primary/15 gap-1.5 h-8 px-2.5 rounded-lg">
                      <Sparkles className="h-3.5 w-3.5" /> Pro
                    </Button>
                  </Link>
                )}

                <div className="relative" ref={profileRef}>
                  <button
                    type="button"
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    aria-label="User account menu"
                    aria-expanded={profileMenuOpen}
                    className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full border border-border hover:border-primary/40 bg-card transition-all cursor-pointer shadow-2xs"
                  >
                    <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center shrink-0 overflow-hidden">
                      {avatarSrc ? (
                        <img src={avatarSrc} alt={displayName} className="h-full w-full object-cover" />
                      ) : (
                        initials
                      )}
                    </div>
                    <span className="text-xs font-bold text-foreground max-w-[110px] truncate">
                      {displayName}
                    </span>
                    <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", profileMenuOpen && "rotate-180")} />
                  </button>

                  {profileMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-border bg-popover text-popover-foreground shadow-xl z-50 p-3 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="flex items-center gap-2.5 pb-2.5 border-b border-border/80 px-1">
                        <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center shrink-0 overflow-hidden">
                          {avatarSrc ? (
                            <img src={avatarSrc} alt={displayName} className="h-full w-full object-cover" />
                          ) : (
                            initials
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-bold truncate text-foreground">{displayName}</div>
                          <div className="text-[11px] text-muted-foreground truncate">{displayEmail}</div>
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
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold bg-gradient-to-br from-[#FBBF24] via-[#F59E0B] to-[#EA580C] hover:from-[#F59E0B] hover:via-[#EA580C] hover:to-[#C2410C] text-white shadow-sm transition-all text-left cursor-pointer"
                        >
                          <LogOut className="h-4 w-4 text-white" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile toggle & profile */}
        <div className="lg:hidden flex items-center gap-2">
          {isAuthenticated && accountMenu ? accountMenu(handleSignOut) : isAuthenticated ? (
            <Link to="/profile" className="flex items-center" aria-label="My Profile">
              <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center border border-border shadow-xs overflow-hidden">
                {avatarSrc ? (
                  <img src={avatarSrc} alt={displayName} className="h-full w-full object-cover" />
                ) : (
                  initials
                )}
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
              {!isAuthenticated ? (
                <Link to="/auth" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full font-semibold">
                    Login
                  </Button>
                </Link>
              ) : null}
              {!isAuthenticated && (
                <Link to="/employers-page-2" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border-0">
                    For Employers
                  </Button>
                </Link>
              )}
              {isAuthenticated && !accountMenu && (
                <div className="space-y-1.5 pt-2 border-t border-border">
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-accent/50">
                    <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center shrink-0 overflow-hidden">
                      {avatarSrc ? (
                        <img src={avatarSrc} alt={displayName} className="h-full w-full object-cover" />
                      ) : (
                        initials
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-foreground truncate">{displayName}</div>
                      <div className="text-[11px] text-muted-foreground truncate">{displayEmail}</div>
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
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-bold bg-gradient-to-br from-[#FBBF24] via-[#F59E0B] to-[#EA580C] hover:from-[#F59E0B] hover:via-[#EA580C] hover:to-[#C2410C] text-white shadow-sm transition-all text-left cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 text-white" /> Sign Out
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
