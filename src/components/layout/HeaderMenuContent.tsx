import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, BellRing, Bot, Building2, CalendarClock, FileText, Library, Palette, ShieldCheck, Sparkles, UserRound, Users, Video, Wand2, type LucideIcon } from "lucide-react";

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
  { label: "Skill Assessment Library", desc: "Ready-made, proctored tests for every role", href: "/for-employers", icon: Library },
  { label: "20 Layers of Cheating Prevention", desc: "AI proctoring across the entire test journey", href: "/for-employers", icon: ShieldCheck },
  { label: "Custom AI Assessment Creation", desc: "Build role-specific tests in minutes", href: "/for-employers", icon: Wand2 },
  { label: "White-Label Branding", desc: "Your brand on every assessment touchpoint", href: "/for-employers", icon: Palette },
  { label: "Bulk Campus Hiring & Screening", desc: "Screen thousands of candidates at once", href: "/for-employers", icon: Users },
  { label: "Create AI Scheduled Interviews", desc: "Automated interview rounds, hands-free", href: "/for-employers", icon: CalendarClock },
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

export const ProductMenu = () => (
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

export type DropdownId = "events" | "pricing" | "products";

export const navLinks: { label: string; href: string; dropdownId?: DropdownId }[] = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Assessments", href: "/assessments" },
  { label: "Learning", href: "/learning" },
  { label: "Pricing", href: "/pricing", dropdownId: "pricing" },
  { label: "Events", href: "/meetups", dropdownId: "events" },
  { label: "Products", href: "/products", dropdownId: "products" },
];

export const dropdownItemsMap: Record<DropdownId, { label: string; href: string }[]> = {
  events: eventsDropdownItems,
  pricing: pricingDropdownItems,
  products: [],
};

