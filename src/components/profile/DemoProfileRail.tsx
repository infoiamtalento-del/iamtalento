import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowUpRight, Bell, BriefcaseBusiness, CheckCircle2, ChevronDown, Clock, Crown,
  Home, LogOut, MessageSquare, Pencil, Sparkles, Star, UserRound, type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import { demoProfile } from "@/components/profile/DemoProfileBody";

type Panel = "jobs" | "notifications" | "messages" | null;

type AppliedJob = {
  title: string; company: string; location: string; applied: string;
  status: string; note: string; tone: "red" | "green" | "amber" | "muted";
};

const appliedJobs: AppliedJob[] = [
  { title: "Senior Full-Stack Engineer", company: "CloudNova Labs", location: "Bangalore · Hybrid", applied: "3 days ago", status: "Interview scheduled", note: "Second round on Thursday, 4:30 PM", tone: "green" },
  { title: "Lead Frontend Engineer", company: "Zetta Commerce", location: "Remote (India)", applied: "6 days ago", status: "Shortlisted", note: "Recruiter reviewed your verified skills", tone: "green" },
  { title: "Full-Stack Developer (React / Node)", company: "BharatPay", location: "Pune · On-site", applied: "2 weeks ago", status: "Under review", note: "Hiring team is reviewing 40+ profiles", tone: "amber" },
  { title: "Software Engineer III", company: "Orbit Mobility", location: "Hyderabad · Hybrid", applied: "3 weeks ago", status: "Assessment pending", note: "Skill assessment link sent to your inbox", tone: "amber" },
  { title: "Backend Engineer (Node.js)", company: "Nimbus Retail", location: "Mumbai · On-site", applied: "1 month ago", status: "Not selected", note: "Feedback: looking for more Kubernetes depth", tone: "muted" },
];

const notifications: { title: string; body: string; time: string; icon: LucideIcon; tone: "red" | "green" | "amber" }[] = [
  { title: "Recruiter viewed your profile", body: "Anusha Iyer, Talent Lead at Zetta Commerce, viewed your profile", time: "2h ago", icon: UserRound, tone: "red" },
  { title: "5 new job matches", body: "React, TypeScript and Node.js roles that fit your profile", time: "5h ago", icon: BriefcaseBusiness, tone: "red" },
  { title: "Skill assessment verified", body: "Your AWS architecture assessment is now on your profile", time: "1d ago", icon: CheckCircle2, tone: "green" },
  { title: "Certification expiring soon", body: "GCP Professional Data Engineer expires in 45 days", time: "2d ago", icon: Clock, tone: "amber" },
  { title: "You're invited: React Bangalore", body: "Community meetup on 24 October · 60 people attending", time: "3d ago", icon: Star, tone: "red" },
];

const conversations: { name: string; role: string; message: string; time: string; unread: number }[] = [
  { name: "Anusha Iyer", role: "Talent Lead · Zetta Commerce", message: "Thanks for the details, Arjun. Can we line up the technical round this week?", time: "12m", unread: 2 },
  { name: "Rahul Verma", role: "Recruiter · CloudNova Labs", message: "Interview confirmed for Thursday. I'll share the calendar invite shortly.", time: "3h", unread: 1 },
  { name: "Talento Assist", role: "Career Intelligence", message: "Your Career Intelligence Report is ready to view.", time: "1d", unread: 0 },
  { name: "Priya Nair", role: "Engineering Manager · BharatPay", message: "We'll get back to you with the panel's feedback this week.", time: "4d", unread: 0 },
];

const toneClass: Record<AppliedJob["tone"], string> = {
  red: "bg-primary/10 text-primary",
  green: "bg-success/12 text-success",
  amber: "bg-warning/15 text-warning",
  muted: "bg-muted text-muted-foreground",
};

function Row({ icon: Icon, tone, title, body, meta, right }: {
  icon: LucideIcon; tone: string; title: string; body: string;
  meta?: React.ReactNode; right?: React.ReactNode;
}) {
  return (
    <div className="dp-rail-row">
      <i className={tone}><Icon size={16} /></i>
      <div className="min-w-0 flex-1">
        <h3>{title}</h3>
        <p>{body}</p>
        {meta && <div className="dp-rail-meta">{meta}</div>}
      </div>
      {right}
    </div>
  );
}

export function DemoProfileRail() {
  const [panel, setPanel] = useState<Panel>(null);
  const open = (next: Exclude<Panel, null>) => setPanel(current => (current === next ? null : next));
  const unreadMessages = conversations.reduce((total, c) => total + c.unread, 0);

  return (
    <aside className="dp-rail" aria-label="Profile menu">
      <Link to="/demo-profile" className="dp-rail-item active" aria-current="page">
        <span className="dp-rail-icon"><Home size={20} /></span>
        Home
      </Link>

      <Sheet open={panel === "jobs"} onOpenChange={v => setPanel(v ? "jobs" : null)}>
        <SheetTrigger asChild>
          <button type="button" className="dp-rail-item" onClick={() => open("jobs")}>
            <span className="dp-rail-icon"><BriefcaseBusiness size={20} /><span className="dp-rail-badge">{appliedJobs.length}</span></span>
            Jobs
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="dp-rail-panel w-full sm:max-w-[420px] !p-0">
          <SheetHeader className="dp-rail-panel-head text-left">
            <SheetTitle>Jobs you've applied to</SheetTitle>
            <SheetDescription>{appliedJobs.length} applications · {appliedJobs.filter(j => j.tone === "green").length} moving forward</SheetDescription>
          </SheetHeader>
          <div className="dp-rail-list">
            {appliedJobs.map(job => (
              <Link key={`${job.company}-${job.title}`} to="/jobs" className="dp-rail-row" onClick={() => setPanel(null)}>
                <i className={toneClass[job.tone]}><BriefcaseBusiness size={16} /></i>
                <div className="min-w-0 flex-1">
                  <h3>{job.title}</h3>
                  <p>{job.company}</p>
                  <div className="dp-rail-meta">
                    <span className="dp-rail-tag" style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}>{job.status}</span>
                    <span>{job.location}</span><span>·</span><span>Applied {job.applied}</span>
                  </div>
                  <p className="mt-1.5">{job.note}</p>
                </div>
                <ArrowUpRight size={14} className="mt-1 shrink-0 opacity-40" />
              </Link>
            ))}
          </div>
          <div className="dp-rail-foot">
            <Button asChild variant="outline" size="sm" className="w-full"><Link to="/jobs" onClick={() => setPanel(null)}>Browse more jobs<ArrowUpRight /></Link></Button>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={panel === "notifications"} onOpenChange={v => setPanel(v ? "notifications" : null)}>
        <SheetTrigger asChild>
          <button type="button" className="dp-rail-item" onClick={() => open("notifications")}>
            <span className="dp-rail-icon"><Bell size={20} /><span className="dp-rail-badge">9</span></span>
            Notifications
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="dp-rail-panel w-full sm:max-w-[420px] !p-0">
          <SheetHeader className="dp-rail-panel-head text-left">
            <SheetTitle>Notifications</SheetTitle>
            <SheetDescription>9 unread · latest first</SheetDescription>
          </SheetHeader>
          <div className="dp-rail-list">
            {notifications.map(item => (
              <Row
                key={item.title}
                icon={item.icon}
                tone={toneClass[item.tone]}
                title={item.title}
                body={item.body}
                meta={<span>{item.time}</span>}
              />
            ))}
          </div>
          <div className="dp-rail-foot">
            <Button variant="outline" size="sm" className="w-full" onClick={() => toast.success("All notifications marked as read")}>Mark all as read</Button>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={panel === "messages"} onOpenChange={v => setPanel(v ? "messages" : null)}>
        <SheetTrigger asChild>
          <button type="button" className="dp-rail-item" onClick={() => open("messages")}>
            <span className="dp-rail-icon"><MessageSquare size={20} />{unreadMessages > 0 && <span className="dp-rail-badge">{unreadMessages}</span>}</span>
            Messages
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="dp-rail-panel w-full sm:max-w-[420px] !p-0">
          <SheetHeader className="dp-rail-panel-head text-left">
            <SheetTitle>Messages</SheetTitle>
            <SheetDescription>{unreadMessages} unread conversations</SheetDescription>
          </SheetHeader>
          <div className="dp-rail-list">
            {conversations.map(chat => (
              <button key={chat.name} type="button" className="dp-rail-row" onClick={() => toast.info(`Messages with ${chat.name} are part of this demo`)}>
                <i className={chat.unread ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}><MessageSquare size={16} /></i>
                <div className="min-w-0 flex-1 text-left">
                  <h3>{chat.name}</h3>
                  <p>{chat.role}</p>
                  <p className="mt-1.5 line-clamp-2">{chat.message}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span className="text-[9px] text-muted-foreground">{chat.time}</span>
                  {chat.unread > 0 && <span className="dp-rail-badge" style={{ position: "static", boxShadow: "none" }}>{chat.unread}</span>}
                </div>
              </button>
            ))}
          </div>
          <div className="dp-rail-foot">
            <Button variant="outline" size="sm" className="w-full" onClick={() => toast.info("Messaging is disabled in this demo profile")}>Compose message</Button>
          </div>
        </SheetContent>
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" className="dp-rail-item dp-rail-me" aria-label="Me">
            <span className="dp-rail-icon"><img src={demoProfile.profile_photo_url} alt="Arjun Mehta" /></span>
            <span className="flex items-center gap-0.5">Me<ChevronDown size={10} /></span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuLabel>
            <span className="block text-[12px] font-semibold text-foreground">{demoProfile.full_name}</span>
            <span className="block text-[10px] font-normal text-muted-foreground">{demoProfile.professional_headline}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild><Link to="/profile"><Pencil />Edit profile</Link></DropdownMenuItem>
          <DropdownMenuItem asChild><Link to="/my-profile"><UserRound />View my profile</Link></DropdownMenuItem>
          <DropdownMenuItem asChild><Link to="/pro"><Sparkles />Talento Pro</Link></DropdownMenuItem>
          <DropdownMenuItem asChild><Link to="/pricing"><Crown />Plans &amp; pricing</Link></DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild><Link to="/auth"><LogOut />Sign out</Link></DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </aside>
  );
}
