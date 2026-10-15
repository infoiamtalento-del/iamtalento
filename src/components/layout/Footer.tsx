import { Link } from "react-router-dom";
import { Zap, Github, Twitter, Linkedin, Mail } from "lucide-react";
import siteLogo from "@/assets/I-am-Talento-2.png.asset.json";

const footerLinks = {
  "For Employers": [
    { label: "AI Screening", href: "/features" },
    { label: "Custom Assessments", href: "/features" },
    { label: "Hiring Dashboard", href: "/dashboard" },
    { label: "Enterprise", href: "/contact" },
  ],
  "For Candidates": [
    { label: "Talento Pro Portal", href: "/pro" },
    { label: "Take Assessment", href: "/assessments/explore" },
    { label: "Industry Readiness Score", href: "/features" },
    { label: "Verified Skill Badge", href: "/features" },
    { label: "Find Jobs", href: "/dashboard" },
    { label: "Sample Report", href: "/features" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Docs", href: "/docs" },
    { label: "Changelog", href: "/changelog" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "GDPR", href: "#" },
    { label: "Security", href: "#" },
  ],
};

const Footer = () => (
  <footer className="border-t border-border bg-card">
    <div className="container py-16">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
        <div className="col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <img src={siteLogo.url} alt="I Am Talento" className="h-12 w-auto object-contain" />
          </Link>
          <p className="text-muted-foreground text-sm max-w-xs mb-6 leading-relaxed">
            AI-powered Industry Readiness platform that connects verified talent with employers — through secure assessments, domain-expert questions, and trusted scores.
          </p>
          <div className="flex gap-3">
            {[Twitter, Linkedin, Github, Mail].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
                aria-label="Social link"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h4 className="font-semibold text-sm mb-4 font-display">{title}</h4>
            <ul className="space-y-2.5">
              {links.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-muted-foreground">© 2026 IAmTalento. All rights reserved.</p>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span>SOC 2 Type II</span>
          <span>·</span>
          <span>GDPR Compliant</span>
          <span>·</span>
          <span>EEOC Compliant</span>
          <span>·</span>
          <span>ISO 27001</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
