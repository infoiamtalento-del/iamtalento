import { useState } from "react";

/**
 * Brand registry. `local` logos live in /public/company-logos, `si` slugs come
 * from the Simple Icons CDN. If an image fails, a monogram tile is shown.
 */
const LOCAL = new Set([
  "accenture", "amazon", "atlassian", "capgemini", "flipkart", "google", "ibm", "infosys",
  "microsoft", "oracle", "razorpay", "swiggy", "tcs", "wipro", "zoho",
]);

const ALIASES: Record<string, { local?: string; si?: string; color?: string; domain?: string }> = {
  "meta": { si: "meta", color: "0081FB", domain: "meta.com" },
  "meta ads": { si: "meta", color: "0081FB", domain: "meta.com" },
  "facebook": { si: "facebook", color: "1877F2", domain: "facebook.com" },
  "instagram": { si: "instagram", color: "E4405F", domain: "instagram.com" },
  "youtube": { si: "youtube", color: "FF0000", domain: "youtube.com" },
  "linkedin": { domain: "linkedin.com" },
  "google ads": { si: "googleads", color: "4285F4", domain: "ads.google.com" },
  "google analytics": { si: "googleanalytics", color: "E37400", domain: "analytics.google.com" },
  "ga4": { si: "googleanalytics", color: "E37400", domain: "analytics.google.com" },
  "search console": { si: "googlesearchconsole", color: "458CF5", domain: "search.google.com" },
  "google search console": { si: "googlesearchconsole", color: "458CF5", domain: "search.google.com" },
  "looker studio": { si: "looker", color: "4285F4", domain: "lookerstudio.google.com" },
  "semrush": { si: "semrush", color: "FF642D", domain: "semrush.com" },
  "ahrefs": { domain: "ahrefs.com" },
  "hubspot": { si: "hubspot", color: "FF7A59", domain: "hubspot.com" },
  "mailchimp": { si: "mailchimp", color: "FFE01B", domain: "mailchimp.com" },
  "wordpress": { si: "wordpress", color: "21759B", domain: "wordpress.org" },
  "canva": { domain: "canva.com" },
  "hotjar": { si: "hotjar", color: "FF3C00", domain: "hotjar.com" },
  "shopify": { si: "shopify", color: "7AB55C", domain: "shopify.com" },
  "salesforce": { domain: "salesforce.com" },
  "notion": { si: "notion", color: "000000", domain: "notion.so" },
  "figma": { si: "figma", color: "F24E1E", domain: "figma.com" },
  "zapier": { si: "zapier", color: "FF4A00", domain: "zapier.com" },
  "react": { si: "react", color: "61DAFB", domain: "react.dev" },
  "typescript": { si: "typescript", color: "3178C6", domain: "typescriptlang.org" },
  "docker": { si: "docker", color: "2496ED", domain: "docker.com" },
  "kubernetes": { si: "kubernetes", color: "326CE5", domain: "kubernetes.io" },
  "github": { si: "github", color: "181717", domain: "github.com" },
  "linkedin recruiter": { domain: "linkedin.com" },
  "workday": { domain: "workday.com" },
  "greenhouse": { si: "greenhouse", color: "24A47F", domain: "greenhouse.com" },
  "lever": { domain: "lever.co" },
  "slack": { domain: "slack.com" },
  "zomato": { si: "zomato", color: "E23744", domain: "zomato.com" },
  "phonepe": { si: "phonepe", color: "5F259F", domain: "phonepe.com" },
  "freshworks": { domain: "freshworks.com" },
  "cred": { domain: "cred.club" },
  "nykaa": { domain: "nykaa.com" },
  "meesho": { domain: "meesho.com" },
  "zerodha": { domain: "zerodha.com" },
  "myntra": { domain: "myntra.com" },
  "paytm": { si: "paytm", color: "00B9F1", domain: "paytm.com" },
};

const resolveCandidates = (name: string): string[] => {
  const key = name.trim().toLowerCase();
  const entry = ALIASES[key];
  const urls: string[] = [];
  if (entry?.local || LOCAL.has(key)) {
    urls.push(`/company-logos/${entry?.local ?? key}.svg`);
  }
  if (entry?.si) {
    urls.push(
      entry.color
        ? `https://cdn.simpleicons.org/${entry.si}/${entry.color}`
        : `https://cdn.simpleicons.org/${entry.si}`
    );
  }
  if (entry?.domain) {
    urls.push(`https://www.google.com/s2/favicons?domain=${entry.domain}&sz=128`);
  }
  return urls;
};

export const hasBrandLogo = (name: string) => resolveCandidates(name).length > 0;

interface Props {
  name: string;
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "square" | "badge";
  /** show the brand name beside the mark */
  label?: boolean;
  className?: string;
}

const SIZES = {
  xs: { box: "h-5 w-5 rounded-md", img: "h-3.5 w-3.5", text: "text-[9px]" },
  sm: { box: "h-8 w-8 rounded-lg", img: "h-5 w-5", text: "text-[10px]" },
  md: { box: "h-10 w-10 rounded-xl", img: "h-6.5 w-6.5", text: "text-xs" },
  lg: { box: "h-12 w-12 rounded-xl", img: "h-8 w-8", text: "text-sm" },
};

const BrandLogo = ({ name, size = "sm", variant = "square", label = false, className = "" }: Props) => {
  const candidates = resolveCandidates(name);
  const [idx, setIdx] = useState(0);
  const src = candidates[idx] ?? null;
  const s = SIZES[size];

  const handleError = () => {
    setIdx((prev) => prev + 1);
  };

  if (variant === "badge") {
    return (
      <span
        className={`inline-flex shrink-0 items-center justify-center rounded-lg border border-amber-200/90 bg-white px-2.5 h-8 min-w-[34px] shadow-2xs transition-all hover:border-amber-400 hover:shadow-xs ${className}`}
        title={name}
      >
        {src ? (
          <img
            src={src}
            alt={`${name} logo`}
            loading="lazy"
            onError={handleError}
            className="h-5 max-w-[76px] w-auto object-contain shrink-0"
          />
        ) : (
          <span className="text-[11px] font-bold text-[#0d5cb2]">{name}</span>
        )}
      </span>
    );
  }

  const mark = (
    <span
      className={`inline-flex shrink-0 items-center justify-center border border-slate-200/90 bg-white shadow-2xs ${s.box}`}
      title={name}
    >
      {src ? (
        <img
          src={src}
          alt={`${name} logo`}
          loading="lazy"
          onError={handleError}
          className={`${s.img} max-h-[82%] max-w-[82%] object-contain`}
        />
      ) : (
        <span className={`${s.text} font-extrabold text-[#0d5cb2]`}>{name.trim().charAt(0).toUpperCase()}</span>
      )}
    </span>
  );

  if (!label) return <span className={className}>{mark}</span>;
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {mark}
      <span className="text-xs font-semibold">{name}</span>
    </span>
  );
};

export default BrandLogo;
