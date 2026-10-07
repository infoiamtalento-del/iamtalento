import { useState } from "react";

/**
 * Brand registry. `local` logos live in /public/company-logos, `si` slugs come
 * from the Simple Icons CDN. If an image fails, a monogram tile is shown.
 */
const LOCAL = new Set([
  "accenture", "amazon", "atlassian", "capgemini", "flipkart", "google", "ibm", "infosys",
  "microsoft", "oracle", "razorpay", "swiggy", "tcs", "wipro", "zoho",
]);

const ALIASES: Record<string, { local?: string; si?: string; domain?: string }> = {
  "meta": { si: "meta" },
  "meta ads": { si: "meta" },
  "facebook": { si: "facebook" },
  "instagram": { si: "instagram" },
  "youtube": { si: "youtube" },
  "linkedin": { domain: "linkedin.com" },
  "google ads": { si: "googleads" },
  "google analytics": { si: "googleanalytics" },
  "ga4": { si: "googleanalytics" },
  "search console": { si: "googlesearchconsole" },
  "google search console": { si: "googlesearchconsole" },
  "looker studio": { si: "looker" },
  "semrush": { si: "semrush" },
  "ahrefs": { domain: "ahrefs.com" },
  "hubspot": { si: "hubspot" },
  "mailchimp": { si: "mailchimp" },
  "wordpress": { si: "wordpress" },
  "canva": { domain: "canva.com" },
  "hotjar": { si: "hotjar" },
  "shopify": { si: "shopify" },
  "salesforce": { domain: "salesforce.com" },
  "notion": { si: "notion" },
  "figma": { si: "figma" },
  "zapier": { si: "zapier" },
  "react": { si: "react" },
  "typescript": { si: "typescript" },
  "docker": { si: "docker" },
  "kubernetes": { si: "kubernetes" },
  "github": { si: "github" },
  "linkedin recruiter": { domain: "linkedin.com" },
  "workday": { domain: "workday.com" },
  "greenhouse": { si: "greenhouse" },
  "lever": { domain: "lever.co" },
  "slack": { domain: "slack.com" },
  "zomato": { si: "zomato" },
  "phonepe": { si: "phonepe" },
  "freshworks": { domain: "freshworks.com" },
  "cred": { domain: "cred.club" },
  "nykaa": { domain: "nykaa.com" },
  "meesho": { domain: "meesho.com" },
  "zerodha": { si: "zerodha" },
  "myntra": { si: "myntra" },
  "paytm": { si: "paytm" },
};

const resolve = (name: string) => {
  const key = name.trim().toLowerCase();
  if (ALIASES[key]?.local || LOCAL.has(key)) return { src: `/company-logos/${ALIASES[key]?.local ?? key}.svg` };
  if (ALIASES[key]?.si) return { src: `https://cdn.simpleicons.org/${ALIASES[key].si}` };
  if (ALIASES[key]?.domain) return { src: `https://www.google.com/s2/favicons?domain=${ALIASES[key].domain}&sz=128` };
  return { src: null as string | null };
};

export const hasBrandLogo = (name: string) => resolve(name).src !== null;

interface Props {
  name: string;
  size?: "xs" | "sm" | "md" | "lg";
  /** show the brand name beside the mark */
  label?: boolean;
  className?: string;
}

const SIZES = {
  xs: { box: "h-5 w-5 rounded", img: "h-3 w-3", text: "text-[9px]" },
  sm: { box: "h-7 w-7 rounded-md", img: "h-4 w-4", text: "text-[10px]" },
  md: { box: "h-10 w-10 rounded-lg", img: "h-6 w-6", text: "text-xs" },
  lg: { box: "h-12 w-12 rounded-xl", img: "h-7 w-7", text: "text-sm" },
};

const BrandLogo = ({ name, size = "sm", label = false, className = "" }: Props) => {
  const { src } = resolve(name);
  const [failed, setFailed] = useState(false);
  const s = SIZES[size];

  const mark = (
    <span
      className={`inline-flex shrink-0 items-center justify-center border border-border bg-white ${s.box}`}
      title={name}
    >
      {src && !failed ? (
        <img
          src={src}
          alt={`${name} logo`}
          loading="lazy"
          onError={() => setFailed(true)}
          className={`${s.img} object-contain`}
        />
      ) : (
        <span className={`${s.text} font-bold text-muted-foreground`}>{name.trim().charAt(0).toUpperCase()}</span>
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
