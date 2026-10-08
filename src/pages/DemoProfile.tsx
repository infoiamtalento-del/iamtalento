import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/layout/ScrollProgress";
import {
  Briefcase, Award, Pencil, ClipboardCheck, ChevronRight, Crown,
  BookOpen, Menu, X, LogOut,
} from "lucide-react";
import demoAvatar from "@/assets/demo-avatar.jpg";
import siteLogo from "@/assets/I-am-Talento-2.png.asset.json";
import { DemoProfileBody, demoProfile as profile } from "@/components/profile/DemoProfileBody";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Jobs", href: "/jobs" },
  { label: "Talento Pro", href: "/pro" },
  { label: "Assessments", href: "/assessments" },
  { label: "Learning", href: "/learning" },
  { label: "Pricing", href: "/pricing" },
  { label: "Meetups", href: "/meetups" },
  { label: "Resources", href: "/resources" },
];

const DemoProfile = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Helmet>
        <title>Arjun Mehta â€” Demo Profile â€” IAmTalento</title>
        <meta name="description" content="Demo profile showing a fully completed IAmTalento candidate profile." />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-secondary/40">
        <ScrollProgress />
        {/* Navbar */}
        <header
          className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
            scrolled ? "bg-background/95 backdrop-blur-md shadow-sm py-3" : "bg-background/70 backdrop-blur-sm py-4"
          )}
        >
          <nav className="container flex items-center" aria-label="Main navigation">
            <Link to="/" className="flex items-center gap-2 group mr-auto" aria-label="IAmTalento Home">
              <img src={siteLogo.url} alt="I Am Talento" className="h-10 w-auto object-contain" />
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="px-3.5 py-2 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-accent/50"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-border">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 focus:outline-none">
                      <Avatar className="h-9 w-9 ring-2 ring-primary/30 hover:ring-primary/60 transition-all cursor-pointer">
                        <AvatarImage src={demoAvatar} alt={profile.full_name} className="object-cover" />
                        <AvatarFallback className="text-xs font-bold bg-primary text-primary-foreground">AM</AvatarFallback>
                      </Avatar>
                      <ChevronRight className="h-3.5 w-3.5 rotate-90 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 p-0 bg-popover border shadow-xl rounded-xl overflow-hidden z-[100]">
                    <div className="p-4 border-b border-border bg-accent/30">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 ring-2 ring-primary/25">
                          <AvatarImage src={demoAvatar} alt={profile.full_name} className="object-cover" />
                          <AvatarFallback className="text-sm font-bold bg-primary text-primary-foreground">AM</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-bold font-display truncate">{profile.full_name}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{profile.professional_headline}</p>
                        </div>
                      </div>
                      <Link to="/pro" className="inline-block w-full mb-1.5">
                        <Button variant="default" size="sm" className="w-full h-8 text-xs font-semibold rounded-full bg-primary hover:bg-primary/90 text-white gap-1.5">
                          <Crown className="h-3.5 w-3.5" /> Talento Pro Portal
                        </Button>
                      </Link>
                      <Link to="/my-profile">
                        <Button variant="outline" size="sm" className="w-full mt-3 h-8 text-xs font-semibold rounded-full border-primary/30 text-primary hover:bg-primary/5">
                          View Profile
                        </Button>
                      </Link>
                    </div>
                    <div className="py-1.5">
                      <DropdownMenuItem asChild className="px-4 py-2.5 cursor-pointer gap-3 text-sm">
                        <Link to="/profile-builder"><Pencil className="h-4 w-4 text-muted-foreground" /> Edit Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="px-4 py-2.5 cursor-pointer gap-3 text-sm">
                        <Link to="/assessments"><ClipboardCheck className="h-4 w-4 text-muted-foreground" /> My Assessments</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="px-4 py-2.5 cursor-pointer gap-3 text-sm">
                        <Link to="/jobs"><Briefcase className="h-4 w-4 text-muted-foreground" /> Job Matches</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="px-4 py-2.5 cursor-pointer gap-3 text-sm">
                        <Link to="/learning"><BookOpen className="h-4 w-4 text-muted-foreground" /> Learning</Link>
                      </DropdownMenuItem>
                    </div>
                    <DropdownMenuSeparator />
                    <div className="py-1.5">
                      <DropdownMenuItem className="px-4 py-2.5 cursor-pointer gap-3 text-sm text-destructive focus:text-destructive">
                        <LogOut className="h-4 w-4" /> Sign Out
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="lg:hidden flex items-center gap-2">
              <Avatar className="h-8 w-8 ring-2 ring-primary/30">
                <AvatarImage src={demoAvatar} alt={profile.full_name} className="object-cover" />
                <AvatarFallback className="text-xs font-bold bg-primary text-primary-foreground">AM</AvatarFallback>
              </Avatar>
              <button
                className="p-2 rounded-lg hover:bg-accent transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </nav>

          {mobileOpen && (
            <div className="lg:hidden bg-background/95 backdrop-blur-md border-t border-border mt-2 animate-fade-in">
              <div className="container py-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="px-4 py-3 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </header>

        <main className="pt-28 pb-16">
          <div className="container">
            <DemoProfileBody />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default DemoProfile;
