import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import siteLogo from "@/assets/I-am-Talento-2.png.asset.json";

const eventsDropdownItems = [
  { label: "Hackathons", href: "/hackathons" },
  { label: "Podcasts", href: "/podcasts" },
  { label: "Networking", href: "/networking" },
];

const pricingDropdownItems = [
  { label: "For Candidates", href: "/pricing?tab=candidates" },
  { label: "For Employers", href: "/pricing?tab=employers" },
];

const productGroups = [
  { label: "Candidate", items: [
    { label: "Skill Assessments (Paid)", href: "/assessments/explore" },
    { label: "AI Resume Builder (Free)", href: "/resources" },
    { label: "AI Expert Resume Data (Free)", href: "/resources" },
    { label: "AI Tools Courses (Free)", href: "/learning" },
    { label: "AI Video Resume Builder (Free)", href: "/resources" },
    { label: "AI Skill Upgrade Alerts (Free)", href: "/learning" },
  ] },
  { label: "Employer", items: [
    { label: "Skill Assessment Library", href: "/for-employers" },
    { label: "20 Layers of Cheating Prevention", href: "/for-employers" },
    { label: "Custom AI Assessment Creation", href: "/for-employers" },
    { label: "White-Label Branding", href: "/for-employers" },
    { label: "Bulk Campus Hiring & Screening", href: "/for-employers" },
    { label: "Create AI Scheduled Interviews", href: "/for-employers" },
  ] },
];

const ProductMenu = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-4">
    {productGroups.map(group => (
      <div key={group.label} className="min-w-0">
        <h3 className="font-display font-semibold text-primary px-3 pb-3 mb-1 border-b border-border">{group.label}</h3>
        {group.items.map(item => (
          <Link key={item.label} to={item.href} className="flex items-start gap-2 px-3 py-2.5 text-sm leading-snug rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
            <ChevronRight className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    ))}
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

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownId | null>(null);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<DropdownId | null>(null);
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
    setMobileOpenDropdown(null);
  }, [location]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (openDropdown) {
        const ref = dropdownRefs.current[openDropdown];
        if (ref && !ref.contains(e.target as Node)) {
          setOpenDropdown(null);
        }
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openDropdown]);

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
                  onClick={() => setOpenDropdown(openDropdown === link.dropdownId ? null : link.dropdownId)}
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
                    {dropdownItemsMap[link.dropdownId].map((item) => (
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
          </div>
        </div>

        {/* Mobile toggle */}
        <div className="lg:hidden flex items-center gap-2">
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
                    onClick={() => setMobileOpenDropdown(mobileOpenDropdown === link.dropdownId ? null : link.dropdownId)}
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
              <Link to="/for-employers"><Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border-0">For Employers</Button></Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
