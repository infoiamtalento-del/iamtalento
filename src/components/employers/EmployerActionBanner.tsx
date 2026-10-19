import { ArrowRight, Building2, BriefcaseBusiness, Search, ShieldCheck, Users, Wand2, Palette, CalendarClock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const bannerContent = {
  jobs: {
    title: ["Your Next Great Hire", "Starts Here."],
    description: "Build your company presence and connect your next opening with the right talent.",
    action: "Post Jobs",
    items: [
      { icon: Building2, title: "Company Profile", text: "Put your employer brand first" },
      { icon: BriefcaseBusiness, title: "Post Your Roles", text: "Define the skills that matter" },
      { icon: Search, title: "Talent Hunt", text: "Find your next team member" },
      { icon: Users, title: "Build Your Shortlist", text: "Bring your hiring team together" },
    ],
  },
  start: {
    title: ["Build Your Team.", "Make Your Next Move."],
    description: "Bring your jobs, assessments and interviews together. Start with your company profile.",
    action: "Create Company Profile",
    items: [
      { icon: ShieldCheck, title: "Verified Skills", text: "Hire with assessment evidence" },
      { icon: Wand2, title: "AI Assessments", text: "Match tests to your roles" },
      { icon: Palette, title: "Your Branding", text: "Keep your company identity" },
      { icon: CalendarClock, title: "AI Interviews", text: "Move screening forward" },
    ],
  },
};

export default function EmployerActionBanner({ variant = "jobs" }: { variant?: keyof typeof bannerContent }) {
  const content = bannerContent[variant];
  return (
    <section className="py-10 md:py-14" aria-label={content.title.join(" ")}>
      <div className="container">
        <div className="rounded-lg bg-primary p-6 text-primary-foreground shadow-lg sm:p-8 md:p-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center md:gap-10">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl font-bold leading-tight tracking-normal text-primary-foreground sm:text-4xl">{content.title[0]}<br /><span className="text-primary-foreground/80">{content.title[1]}</span></h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-primary-foreground/80 md:text-base">{content.description}</p>
            </div>
            <Button asChild size="lg" className="h-auto min-h-12 max-w-full shrink-0 gap-3 whitespace-normal bg-primary-foreground px-6 py-3 text-primary hover:bg-primary-foreground/90">
              <Link to="/employer-profile">{content.action}<ArrowRight className="h-4 w-4 shrink-0" /></Link>
            </Button>
          </div>
          <ul className="mt-8 grid gap-x-6 gap-y-5 border-t border-primary-foreground/20 pt-6 sm:grid-cols-2 lg:grid-cols-4">
            {content.items.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/15"><Icon className="h-5 w-5" /></span>
                <div className="min-w-0"><p className="text-sm font-bold">{title}</p><p className="mt-1 text-xs leading-relaxed text-primary-foreground/70">{text}</p></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}