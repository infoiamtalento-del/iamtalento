import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Menu, X, Sparkles, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

import siteLogo from "@/assets/I-am-Talento-2.png.asset.json";
import { navLinks } from "./data";

const Header = () => {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 120);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="h2-announce">
        <div className="h2-shell h2-announce-inner">
          <p className="h2-announce-text">
            <span className="h2-pill-new">NEW</span>
            <span>
              Code Arena Season 4 is open <span className="h2-dim">· 2,340+ already registered</span>
            </span>
          </p>
          <Link to="/hackathons">
            Register <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <div className="h2-utility">
        <div className="h2-shell h2-utility-inner">
          <div>
            <span>EN</span>
          </div>
          <div>
            {!user ? (
              <Link to="/auth">Login</Link>
            ) : (
              <Link to="/profile">My Profile</Link>
            )}
            <Link to="/for-employers">For Employers</Link>
          </div>
        </div>
      </div>

      <header className="h2-header" data-stuck={stuck}>
        <div className="h2-shell h2-header-inner">
          <Link to="/" className="h2-logo" aria-label="IAmTalento home">
            <img src={siteLogo.url} alt="IAmTalento" />
          </Link>

          <nav className="h2-nav" aria-label="Primary">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="h2-header-cta">
            {!user ? (
              <Link to="/auth" className="h2-btn-sm">
                Login / Get Started
              </Link>
            ) : (
              <Link to="/talento-pro" className="h2-btn-sm flex items-center gap-1.5">
                <Sparkles size={14} /> Talento Pro
              </Link>
            )}
            <button
              type="button"
              className="h2-menu-btn"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="h2-mobile-nav" aria-label="Mobile">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
};

export default Header;
