import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { siteLogo } from "@/assets/logo";
import { Button } from "@/components/ui/button";
import {
  ClipboardCheck,
  Loader2,
  LogOut,
  Pencil,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { LiveCandidateProfileView } from "@/components/pro/live/LiveCandidateProfileView";

const MyProfile = () => {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [fullName, setFullName] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      if (!cancelled) {
        setFullName(
          (user.user_metadata?.full_name as string) ||
            (user.email ? user.email.split("@")[0] : "")
        );
        setCheckingAuth(false);
      }
    };
    void check();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{fullName ? `${fullName} | IAmTalento` : "My Profile | IAmTalento"}</title>
        <meta
          name="description"
          content="View and customize your verified professional profile on IAmTalento."
        />
      </Helmet>

      <div className="min-h-screen bg-[#FBF4EB]">
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-md border-b border-border/60">
          <div className="container flex items-center justify-between h-16 gap-3">
            <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="IAmTalento Home">
              <img src={siteLogo.url} alt={siteLogo.alt} className="h-9 w-auto object-contain" />
            </Link>

            <div className="flex items-center gap-2">
              <Button asChild size="sm" variant="outline" className="h-8 text-xs">
                <Link to="/talento-pro?view=dash">Dashboard</Link>
              </Button>
              <Button asChild size="sm" className="h-8 text-xs gap-1.5 bg-primary hover:bg-primary/90">
                <Link to="/assessments">
                  <ClipboardCheck className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Take Assessments</span>
                  <span className="sm:hidden">Assess</span>
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="h-8 text-xs gap-1.5">
                <Link to="/jobs">
                  <Search className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Browse Jobs</span>
                  <span className="sm:hidden">Jobs</span>
                </Link>
              </Button>
              <div className="h-5 w-px bg-border hidden sm:block" />
              <Button asChild size="sm" variant="ghost" className="h-8 text-xs gap-1.5 text-muted-foreground">
                <Link to="/talento-pro?view=edit-profile">
                  <Pencil className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Edit Wizard</span>
                </Link>
              </Button>
              <Button asChild size="sm" variant="ghost" className="h-8 text-xs gap-1.5 text-muted-foreground hidden md:inline-flex">
                <Link to="/profile">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span>Builder</span>
                </Link>
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={handleSignOut}
                className="h-8 text-xs text-muted-foreground"
                aria-label="Sign out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </header>

        <LiveCandidateProfileView
          embedded={false}
          onNavigate={(view) => navigate(`/talento-pro?view=${view}`)}
          onToast={(msg) => toast.success(msg)}
        />
      </div>
    </>
  );
};

export default MyProfile;
