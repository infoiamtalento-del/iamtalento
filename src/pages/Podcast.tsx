import { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion, useInView, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SectionBadge from "@/components/ui/section-badge";
import { Link } from "react-router-dom";
import {
  Mic, Headphones, Play, Clock, Users, ArrowRight, ArrowUpRight,
  Calendar, Star, Radio, Mail, Eye, Quote,
  Target, TrendingUp, Award, Handshake, FileText, Bookmark,
  Briefcase, Code, Brain, Lightbulb, Rocket, Flame, Shield,
} from "lucide-react";

import podcastHero from "@/assets/podcast-hero.jpg";
import podcastMic3d from "@/assets/podcast-mic-3d.png";
import podcastThumbnail from "@/assets/podcast-thumbnail.jpg";
import host1 from "@/assets/podcast-host-1.jpg";
import host2 from "@/assets/podcast-host-2.jpg";
import host3 from "@/assets/podcast-host-3.jpg";
import host4 from "@/assets/podcast-host-4.jpg";
import ep1 from "@/assets/podcast-episode-1.jpg";
import ep2 from "@/assets/podcast-episode-2.jpg";
import ep3 from "@/assets/podcast-episode-3.jpg";
import ep4 from "@/assets/podcast-episode-4.jpg";
import speakerMeera from "@/assets/speaker-meera.jpg";
import speakerArjun from "@/assets/speaker-arjun.jpg";
import speakerKavya from "@/assets/speaker-kavya.jpg";
import speakerRohan from "@/assets/speaker-rohan.jpg";

/* ─── Animated Counter ─── */
const AnimatedCounter = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);
  useEffect(() => { if (isInView) { const c = animate(count, target, { duration: 2, ease: [0.22, 1, 0.36, 1] }); return c.stop; } }, [isInView, count, target]);
  useEffect(() => { const u = rounded.on("change", (v) => setDisplay(v)); return u; }, [rounded]);
  return <span ref={ref} className="tabular-nums">{display}{suffix}</span>;
};

/* ─── Data ─── */
const tickerItems = [
  "🔴 Priya from Bangalore just joined the live session",
  "🔴 Rohit got a job offer after applying a tip from last week's episode",
  "🔴 847 people registered for tomorrow's podcast in the last 2 hours",
  '🔴 "Cracking Product Management Roles", starting in 18 minutes',
];

const episodeFilterTabs = ["All", "Tech", "Marketing", "Finance", "HR & Hiring", "Leadership", "Fresher Special"];

const episodes = [
  { title: "Why 90% of Resumes Get Rejected Before a Human Reads Them", img: ep1, guest: "Priya Sharma", designation: "Sr. HR Lead, Infosys", duration: "34 min", views: "12.4K", insight: "The ATS filters out 90% before a recruiter even sees your resume.", category: "HR & Hiring", featured: true },
  { title: "Salary Negotiation Masterclass, Stop Leaving Money on the Table", img: ep2, guest: "Rahul Mehta", designation: "Career Coach", duration: "41 min", views: "9.8K", insight: "Most candidates accept the first offer. Here's why you shouldn't.", category: "Leadership", featured: false },
  { title: "From Fresher to ₹12 LPA in 18 Months, A Real Story", img: ep3, guest: "Karan M.", designation: "Software Engineer", duration: "28 min", views: "18.2K", insight: "He skipped the traditional path and bet on skills over degrees.", category: "Fresher Special", featured: true },
  { title: "The Skills That Actually Get You Promoted", img: ep4, guest: "Ananya Desai", designation: "VP Engineering", duration: "37 min", views: "7.1K", insight: "Technical skills get you hired. These skills get you promoted.", category: "Tech", featured: false },
  { title: "How LinkedIn Recruiters Really Search for Candidates", img: ep1, guest: "Vikram Singh", designation: "Talent Acquisition, Meta", duration: "29 min", views: "11.6K", insight: "Recruiters use Boolean strings you've never heard of.", category: "HR & Hiring", featured: false },
  { title: "Breaking into Product Management with No PM Experience", img: ep2, guest: "Sneha Kapoor", designation: "Product Lead, Razorpay", duration: "45 min", views: "8.3K", insight: "You don't need a PM title to start building PM experience.", category: "Tech", featured: true },
  { title: "How to Build a Personal Brand That Gets You Hired", img: ep3, guest: "Nisha Patel", designation: "Marketing Director, Zomato", duration: "33 min", views: "6.9K", insight: "Your online presence is your new resume. Most people ignore this.", category: "Marketing", featured: false },
  { title: "The ₹50 LPA Roadmap, What Top Engineers Do Differently", img: ep4, guest: "Siddharth Rao", designation: "Staff Engineer, Google", duration: "52 min", views: "22.1K", insight: "It's not about working harder. It's about choosing the right problems.", category: "Tech", featured: true },
  { title: "Finance Careers in 2026, What's Hot, What's Not", img: ep1, guest: "Megha Joshi", designation: "CFO, Groww", duration: "38 min", views: "5.4K", insight: "Traditional finance roles are shrinking. Here's where the growth is.", category: "Finance", featured: false },
];

const valueProps = [
  { icon: Target, title: "Direct Access to Decision Makers", desc: "Ask your questions live to the people who actually make hiring decisions, no filters, no PR speak." },
  { icon: TrendingUp, title: "Actionable Career Intelligence", desc: "Every episode ends with a 3-step action plan you can implement before Monday morning." },
  { icon: Award, title: "Exclusive Guest Insights", desc: "Guests share what they've never said publicly, hiring secrets, salary truths, and what your resume is missing." },
  { icon: Handshake, title: "Live Networking Rooms", desc: "Post-podcast networking breakout rooms let you connect with attendees and guests directly." },
  { icon: FileText, title: "Episode Recap Delivered to You", desc: "Can't attend live? Get a full AI-generated summary, key takeaways, and action points in your inbox." },
  { icon: Bookmark, title: "Certificate of Attendance", desc: "Downloadable certificate for every live session you attend, add it to your I Am Talento profile." },
];

const hostTabs = ["All", "Career", "Tech", "Industry", "Startups"];
const hosts = [
  { name: "Meera Sharma", role: "Career Strategist", company: "TalentBridge", episode: "How to Get Hired in 30 Days", img: speakerMeera, tab: "Career" },
  { name: "Arjun Nair", role: "Tech Lead & Mentor", company: "CloudNova", episode: "System Design for Beginners", img: speakerArjun, tab: "Tech" },
  { name: "Kavya Iyer", role: "Industry Analyst", company: "McKinsey", episode: "Future of Remote Work", img: speakerKavya, tab: "Industry" },
  { name: "Rohan Deshmukh", role: "Startup Coach", company: "YC Alumni", episode: "From Idea to Funding", img: speakerRohan, tab: "Startups" },
];

const testimonials = [
  { quote: "I attended one live session on salary negotiation and used the exact script they gave. Got ₹3 LPA more than the initial offer.", name: "Aditya S.", role: "Software Engineer, Pune", img: "https://randomuser.me/api/portraits/men/32.jpg" },
  { quote: "The episode on ATS optimization helped me rewrite my resume. I got 4 interview calls in the next week.", name: "Sneha R.", role: "Marketing Manager, Mumbai", img: "https://randomuser.me/api/portraits/women/44.jpg" },
  { quote: "As a fresher, this podcast made me feel like I actually had a shot. The guest gave us a 30-day action plan that worked.", name: "Karan M.", role: "Fresh Graduate, Delhi", img: "https://randomuser.me/api/portraits/men/22.jpg" },
];

const categories = [
  { icon: Briefcase, label: "Career Growth" },
  { icon: Code, label: "Tech & AI" },
  { icon: Brain, label: "Motivation" },
  { icon: Lightbulb, label: "Skills" },
  { icon: Rocket, label: "Startups" },
];

/* ─── SECTION 1: Hero ─── */
const PodcastHero = () => (
  <section className="relative pt-24 pb-12 md:pt-32 md:pb-16 overflow-hidden bg-accent/30">
    <div className="container px-4 md:px-6">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Left — Text */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-[1.08] mb-5">
            Real Conversations.<br />
            Real Careers.<br />
            <span className="text-primary">Live Every Week.</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-md mb-8 leading-relaxed">
            Tune in as industry leaders share unfiltered insights on careers, hiring trends, and what it actually takes to succeed.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <Button size="lg" className="bg-[hsl(33,100%,50%)] text-white hover:bg-[hsl(33,100%,45%)] border-0 gap-2 h-12 px-6 font-bold">
              Join Next Live Session <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2 h-12 px-6 font-bold border-border">
              <Play className="h-4 w-4" /> Browse Episodes
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> 50,000+ monthly listeners</span>
            <span className="flex items-center gap-1.5"><Radio className="h-3.5 w-3.5" /> 250+ episodes</span>
            <span className="flex items-center gap-1.5"><Mic className="h-3.5 w-3.5" /> Live every week</span>
          </div>
        </motion.div>

        {/* Right — Video Thumbnail */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative rounded-2xl overflow-hidden shadow-2xl group cursor-pointer"
        >
          <img src={podcastThumbnail} alt="Two people having a podcast conversation" className="w-full h-full object-cover aspect-video" />
          <div className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/30 transition-colors duration-300" />
          <motion.div whileHover={{ scale: 1.1 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 rounded-full bg-primary flex items-center justify-center shadow-xl">
            <Play className="h-7 w-7 text-primary-foreground fill-primary-foreground ml-0.5" />
          </motion.div>
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 rounded-full bg-primary-foreground animate-ping opacity-75" />
                <span className="relative rounded-full h-1.5 w-1.5 bg-primary-foreground" />
              </span>
              LIVE NOW
            </span>
            <span className="text-[11px] text-primary-foreground/90 bg-foreground/30 backdrop-blur-sm rounded-full px-2.5 py-1 font-medium">Episode #251</span>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

/* ─── SECTION 2: FOMO Ticker ─── */
const fomoTickerData = [...tickerItems, ...tickerItems, ...tickerItems];
const FomoTicker = () => (
  <section className="overflow-hidden my-4">
    <div className="bg-[hsl(33,100%,50%)] py-3.5 -rotate-[0.5deg]">
      <motion.div className="flex items-center w-max" animate={{ x: ["0%", "-33.33%"] }} transition={{ duration: 30, ease: "linear", repeat: Infinity }}>
        {fomoTickerData.map((item, i) => (
          <span key={i} className="flex items-center shrink-0 text-primary-foreground text-xs md:text-sm font-extrabold font-display whitespace-nowrap px-8 uppercase tracking-wider">
            {item} <span className="ml-8 text-primary-foreground/50">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  </section>
);

/* ─── SECTION 3: Stats Bento ─── */
const StatsBento = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const avatars = ["https://randomuser.me/api/portraits/women/23.jpg", "https://randomuser.me/api/portraits/men/45.jpg", "https://randomuser.me/api/portraits/women/56.jpg", "https://randomuser.me/api/portraits/men/67.jpg"];

  return (
    <section className="py-16 md:py-20" ref={ref}>
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Card 1 — Listeners with avatars */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }} className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between">
            <div className="flex -space-x-2.5 mb-4">
              {avatars.map((src, i) => <img key={i} src={src} alt="" className="h-9 w-9 rounded-full border-2 border-background object-cover" />)}
            </div>
            <div>
              <p className="text-3xl font-bold font-display"><AnimatedCounter target={50000} suffix="+" /></p>
              <p className="text-xs text-muted-foreground mt-1">Monthly Listeners</p>
            </div>
          </motion.div>

          {/* Card 2 — Episodes */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }} className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between">
            <p className="text-sm text-foreground font-medium">New episodes every single week, no exceptions</p>
            <div className="mt-4">
              <p className="text-5xl font-bold font-display"><AnimatedCounter target={250} suffix="+" /></p>
              <p className="text-xs text-muted-foreground mt-1">Episodes Published</p>
            </div>
          </motion.div>

          {/* Card 3 — Red feature card (spans 2 rows) */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }} className="rounded-2xl bg-primary text-primary-foreground p-6 flex flex-col justify-between row-span-2">
            <div>
              <p className="text-sm text-primary-foreground/80 leading-relaxed">
                Rated by <span className="font-bold text-primary-foreground">professionals</span> across India as the #1 career podcast
              </p>
              <motion.div animate={isInView ? { y: [0, -6, 0] } : {}} transition={{ delay: 1.5, duration: 2, repeat: Infinity, ease: "easeInOut" }} className="mt-6">
                <TrendingUp className="h-16 w-16 text-primary-foreground" />
              </motion.div>
            </div>
            <div className="mt-auto pt-6">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold font-display"><AnimatedCounter target={4} /></span>
                <span className="text-5xl font-bold font-display">.9</span>
                <span className="text-lg text-primary-foreground/50 font-bold">/5</span>
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 text-[hsl(33,100%,50%)] fill-[hsl(33,100%,50%)]" />)}</div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-primary-foreground/60">Avg Rating</span>
              </div>
            </div>
          </motion.div>

          {/* Card 4 — Expert guests */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.35 }} className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold">Vetted Industry Experts</span>
            </div>
            <div className="mt-auto">
              <p className="text-4xl font-bold font-display"><AnimatedCounter target={65} suffix="+" /></p>
              <p className="text-xs text-muted-foreground mt-1">Expert Guests</p>
            </div>
            <div className="flex items-center gap-1.5 mt-4">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">New Guest Every Week</span>
            </div>
          </motion.div>

          {/* Card 5 — Career Outcomes */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4 }} className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-center">
            <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={isInView ? { scale: 1, opacity: 1 } : {}} transition={{ duration: 0.6, delay: 0.5, type: "spring", stiffness: 200 }} className="text-5xl font-bold font-display text-primary mb-1">
              78%
            </motion.span>
            <p className="text-xs text-muted-foreground font-medium">of listeners report career<br />growth within 3 months</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ─── SECTION 4: Featured Session (Bento) ─── */
const FeaturedSession = () => (
  <section className="py-16 md:py-20">
    <div className="container px-4 md:px-6">
      <SectionBadge label="Don't Miss This" icon={Star} />
      <h2 className="text-3xl md:text-4xl font-bold font-display mb-8">
        This Week's<br /><span className="text-primary">Live Podcast</span>
      </h2>
      <div className="grid md:grid-cols-3 gap-4">
        {/* Video Card (2 cols) */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="md:col-span-2 relative rounded-2xl bg-primary overflow-hidden group">
          <div className="absolute right-0 top-0 bottom-0 w-[45%]">
            <img src={ep3} alt="Session" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/40 to-transparent" />
          </div>
          <div className="relative z-10 p-8 md:p-10 max-w-[55%] flex flex-col justify-center min-h-[280px]">
            <h3 className="text-xl md:text-2xl font-bold font-display mb-3 leading-tight text-primary-foreground">
              The Hiring Manager's Playbook, What They Really Look For
            </h3>
            <p className="text-primary-foreground/60 text-sm mb-1">Guest: VP of Talent Acquisition, Fortune 500</p>
            <p className="text-primary-foreground/50 text-xs mb-6 flex items-center gap-2"><Calendar className="h-3.5 w-3.5" /> Saturday, 7:00 PM IST</p>
            <div className="flex items-center gap-3">
              <Button size="sm" className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90 border-0 gap-2 font-bold">
                <Play className="h-3.5 w-3.5 fill-current" /> Watch Trailer
              </Button>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.1 }} className="absolute top-1/2 right-[22%] -translate-y-1/2 h-14 w-14 rounded-full bg-primary-foreground/90 flex items-center justify-center cursor-pointer z-10 shadow-xl">
            <Play className="h-6 w-6 text-primary fill-primary ml-0.5" />
          </motion.div>
        </motion.div>

        {/* Preview bullets */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold font-display mb-2">Episode Preview</h3>
          {["What hiring managers decide in the first 30 seconds", "Resume red flags that get you rejected", "How verified skill scores change the conversation", "Live Q&A, your questions answered"].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex items-start gap-3 rounded-xl border border-border bg-card p-3.5 hover:border-primary/30 transition-colors">
              <div className="h-7 w-7 rounded-lg bg-accent flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-primary">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <p className="text-xs font-medium leading-snug">{item}</p>
            </motion.div>
          ))}
          <Button className="w-full bg-[hsl(33,100%,50%)] text-primary-foreground hover:bg-[hsl(33,100%,45%)] border-0 gap-2 mt-2">
            Reserve My Free Seat <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  </section>
);

/* ─── SECTION: Live & Upcoming Schedule ─── */
const scheduleData = [
  { title: "How Razorpay hires backend engineers in 2026", speaker: "Aarav Kapoor", role: "VP Engineering, Razorpay", duration: "45 min", img: ep1, insight: "The hiring bar is higher than ever. Here's what actually gets you through.", tags: ["Hiring", "Backend"], status: "live" as const },
  { title: "Breaking into AI/ML roles without a PhD", speaker: "Sneha Reddy", role: "ML Lead, Google", duration: "38 min", img: ep2, insight: "You don't need a PhD, you need the right projects and portfolio.", tags: ["AI/ML", "Career"], status: "live" as const },
  { title: "The resume mistakes costing you interviews", speaker: "Priya Menon", role: "HR Director, TCS", duration: "32 min", img: ep3, insight: "Most resumes fail before a human even reads them. Fix these 3 things.", tags: ["Resume", "Tips"], status: "live" as const },
  { title: "From junior to staff in 3 years, Ananya's story", speaker: "Ananya Sharma", role: "Staff Eng, Flipkart", duration: "41 min", img: ep4, insight: "She skipped the traditional ladder and bet on impact over tenure.", tags: ["Career", "Growth"], status: "upcoming" as const },
  { title: "System design patterns every senior eng must know", speaker: "Rohan Kapoor", role: "SDE-III, Atlassian", duration: "52 min", img: ep1, insight: "The patterns that separate mid-level from senior in system design rounds.", tags: ["Technical", "Design"], status: "upcoming" as const },
  { title: "Building Zepto's tech team from 0 to 400 engineers", speaker: "Vikram Malhotra", role: "CTO, Zepto", duration: "48 min", img: ep2, insight: "Scaling a team is harder than scaling a product. Here's the playbook.", tags: ["Founder", "Hiring"], status: "upcoming" as const },
];

const ScheduleSection = () => {
  const [tab, setTab] = useState<"live" | "upcoming">("live");
  const filtered = scheduleData.filter(s => s.status === tab);

  return (
    <section className="pt-4 pb-16 md:pt-6 md:pb-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-2">
          <h2 className="text-3xl md:text-4xl font-bold font-display">
            Live & <span className="text-primary">Upcoming</span>
          </h2>
          <div className="flex gap-2">
            <button onClick={() => setTab("live")} className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${tab === "live" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}>
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className={`absolute inset-0 rounded-full bg-primary-foreground ${tab === "live" ? "animate-ping opacity-75" : "opacity-0"}`} />
                  <span className={`relative rounded-full h-2 w-2 ${tab === "live" ? "bg-primary-foreground" : "bg-muted-foreground"}`} />
                </span>
                Live Now
              </span>
            </button>
            <button onClick={() => setTab("upcoming")} className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${tab === "upcoming" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}>
              Upcoming
            </button>
          </div>
        </div>
        <p className="text-muted-foreground text-sm mb-8">
          {tab === "live" ? "Sessions happening right now. Jump in." : "Mark your calendar. Don't miss these."}
        </p>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.length === 0 ? (
              <div className="col-span-full p-12 text-center text-sm text-muted-foreground rounded-xl border border-border">No {tab} sessions right now. Check back soon!</div>
            ) : (
              filtered.map((s, i) => (
                <motion.div key={s.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                  {/* Thumbnail */}
                  <div className="relative h-44 overflow-hidden">
                    <img src={s.img} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent" />
                    {/* Play button */}
                    <div className="absolute bottom-3 right-3 h-10 w-10 rounded-full bg-primary flex items-center justify-center shadow-lg opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all">
                      <Play className="h-4 w-4 text-primary-foreground fill-primary-foreground ml-0.5" />
                    </div>
                    {/* Duration */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                      <span className="flex items-center gap-1 text-[10px] text-primary-foreground/90 bg-foreground/30 backdrop-blur-sm rounded-full px-2 py-0.5">
                        <Clock className="h-3 w-3" />{s.duration}
                      </span>
                    </div>
                    {/* Live badge */}
                    {s.status === "live" && (
                      <span
                        className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-md"
                        style={{ animation: "blink-live 1.4s ease-in-out infinite" }}
                      >
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inset-0 rounded-full bg-primary-foreground animate-ping opacity-75" />
                          <span className="relative rounded-full h-1.5 w-1.5 bg-primary-foreground" />
                        </span>
                        LIVE
                      </span>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="p-4">
                    {/* Tags */}
                    <div className="flex gap-1.5 mb-2">
                      {s.tags.map(t => (
                        <span key={t} className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-accent text-primary">{t}</span>
                      ))}
                    </div>

                    {/* Speaker */}
                    <div className="flex items-center gap-2.5 mb-3">
                      <img src={s.img} alt={s.speaker} className="h-9 w-9 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-semibold">{s.speaker}</p>
                        <p className="text-xs text-muted-foreground">{s.role}</p>
                      </div>
                    </div>




                    {/* Title */}
                    <h3 className="text-base font-bold font-display leading-snug mb-3 group-hover:text-primary transition-colors">{s.title}</h3>

                    {/* CTA */}
                    <span className="text-sm font-semibold text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      {s.status === "live" ? "Join Now" : "Set Reminder"} <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <style>{`
        @keyframes blink-live {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </section>
  );
};

/* ─── SECTION 5: Why Attend (Bento) ─── */
const WhyAttend = () => (
  <section className="py-16 md:py-20">
    <div className="container px-4 md:px-6">
      <SectionBadge label="Why Tune In" icon={Target} />
      <h2 className="text-3xl md:text-4xl font-bold font-display mb-2">
        Why 50,000+ Professionals<br /><span className="text-primary">Never Miss an Episode</span>
      </h2>
      <p className="text-muted-foreground text-sm mb-8 max-w-lg">Real value, every single session.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {valueProps.map(({ icon: Icon, title, desc }, i) => (
          <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
            className={`rounded-2xl p-6 flex flex-col justify-between ${i === 0 ? "bg-primary text-primary-foreground md:col-span-2" : "border border-border bg-card hover:border-primary/30 transition-colors"}`}
          >
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center mb-3 ${i === 0 ? "bg-primary-foreground/20" : "bg-accent"}`}>
              <Icon className={`h-5 w-5 ${i === 0 ? "text-primary-foreground" : "text-primary"}`} />
            </div>
            <p className="font-bold font-display text-sm mb-1">{title}</p>
            <p className={`text-xs leading-relaxed ${i === 0 ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{desc}</p>
            {i === 0 && (
              <motion.div whileHover={{ x: 4 }} className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[hsl(33,100%,50%)] cursor-pointer">
                Learn more <ArrowUpRight className="h-3 w-3" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── SECTION 6: Past Episodes ─── */
const PastEpisodes = () => {
  const [tab, setTab] = useState("All");
  const filtered = tab === "All" ? episodes : episodes.filter(e => e.category === tab);

  return (
    <section className="py-16 md:py-20">
      <div className="container px-4 md:px-6">
        <SectionBadge label="Episode Library" icon={Play} />
        <h2 className="text-3xl md:text-4xl font-bold font-display mb-1">
          100+ Episodes.<br /><span className="text-primary">Zero Fluff.</span>
        </h2>
        <p className="text-muted-foreground text-sm mb-6">Filter by role, industry, or topic.</p>
        <div className="flex flex-wrap gap-2 mb-8">
          {episodeFilterTabs.map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${tab === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}>{t}</button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((ep, i) => (
              <motion.div key={ep.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                <div className="relative h-36 overflow-hidden">
                  <img src={ep.img} alt={ep.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent" />
                  <div className="absolute bottom-2 right-2 h-9 w-9 rounded-full bg-primary flex items-center justify-center shadow-lg opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all">
                    <Play className="h-3.5 w-3.5 text-primary-foreground fill-primary-foreground ml-0.5" />
                  </div>
                  <div className="absolute bottom-2 left-2 flex items-center gap-1.5 text-[10px] text-primary-foreground/80">
                    <span className="flex items-center gap-1 bg-foreground/30 backdrop-blur-sm rounded-full px-2 py-0.5"><Clock className="h-3 w-3" />{ep.duration}</span>
                  </div>
                </div>
                <div className="p-4">
                  <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent text-primary mb-2">{ep.category}</span>
                  <div className="flex items-center gap-2.5 mb-3">
                    <img src={ep.img} alt={ep.guest} className="h-8 w-8 rounded-full object-cover" />
                    <div>
                      <p className="text-xs font-semibold">{ep.guest}</p>
                      <p className="text-[11px] text-muted-foreground">{ep.designation}</p>
                    </div>
                  </div>
                  
                  <h3 className="text-sm font-bold font-display leading-snug mb-3 group-hover:text-primary transition-colors">{ep.title}</h3>
                  <span className="text-xs font-semibold text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read more <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

/* ─── SECTION 7: Guests (Card Stack) ─── */
const GuestsWall = () => {
  const [activeTab, setActiveTab] = useState("All");
  const filtered = activeTab === "All" ? hosts : hosts.filter(h => h.tab === activeTab);

  return (
    <section className="py-16 md:py-20">
      <div className="container px-4 md:px-6">
        <SectionBadge label="Featured Guests" icon={Users} />
        <h2 className="text-3xl md:text-4xl font-bold font-display mb-1">
          Who's Been On<br /><span className="text-primary">The Mic</span>
        </h2>
        <p className="text-muted-foreground text-sm mb-6">Industry veterans. Startup founders. All speaking to your career.</p>
        <div className="flex flex-wrap gap-2 mb-8">
          {hostTabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${activeTab === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}>{t}</button>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {filtered.map((h, i) => (
             <motion.div key={h.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -6 }} className="group cursor-pointer">
              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-xl transition-shadow duration-300">
                <img src={h.img} alt={h.name} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center gap-1.5 text-primary-foreground text-[11px] font-medium">
                    <Mic className="h-3 w-3" /> {h.episode}
                  </div>
                </div>
              </div>
              <h3 className="text-sm font-bold font-display group-hover:text-primary transition-colors">{h.name}</h3>
              <p className="text-xs text-muted-foreground">{h.role}, {h.company}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── SECTION 8: Testimonials ─── */
const ListenerStories = () => (
  <section className="py-16 md:py-20">
    <div className="container px-4 md:px-6">
      <SectionBadge label="Real Outcomes" icon={Quote} />
      <h2 className="text-3xl md:text-4xl font-bold font-display mb-8">
        This Podcast Changed How<br /><span className="text-primary">I Think About My Career</span>
      </h2>
      <div className="grid md:grid-cols-3 gap-5">
        {testimonials.map((t, i) => (
          <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="rounded-2xl border border-border bg-card p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <Quote className="h-6 w-6 text-primary/20 mb-3" />
            <p className="text-sm text-foreground leading-relaxed mb-5">"{t.quote}"</p>
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, j) => <Star key={j} className="h-3 w-3 fill-[hsl(33,100%,50%)] text-[hsl(33,100%,50%)]" />)}
            </div>
            <div className="border-t border-border pt-4 flex items-center gap-3">
              <img src={t.img} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
              <div>
                <p className="text-sm font-bold font-display">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── SECTION 9: Become a Guest (Red Banner) ─── */
const BecomeGuest = () => (
  <section className="py-4 md:py-6">
    <div className="container px-4 md:px-6">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative overflow-hidden rounded-2xl bg-primary px-8 py-8 md:px-12 md:py-10">
        <div className="absolute top-0 right-0 w-60 h-60 rounded-full bg-primary-foreground/10 -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 right-1/3 w-32 h-32 rounded-full bg-primary-foreground/5 translate-y-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-foreground/20 text-sm font-semibold text-primary-foreground mb-4">
              <Mic className="h-4 w-4" /> Be a Guest
            </div>
            <h3 className="text-xl md:text-2xl font-bold font-display text-primary-foreground mb-1">
              Have a Story Worth Hearing?
            </h3>
            <p className="text-sm text-primary-foreground/70 max-w-lg mb-4">
              Share your expertise with 50,000+ ambitious professionals. We feature hiring managers, career coaches, and entrepreneurs.
            </p>
            <div className="space-y-1.5 mb-4">
              {["5+ years experience OR a compelling career story", "Real, actionable insights", "Available for a 45-60 minute live session"].map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-primary-foreground/80 text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[hsl(33,100%,50%)]" /> {r}
                </div>
              ))}
            </div>
          </div>
          <Link to="/contact" className="shrink-0">
            <Button size="lg" className="bg-[hsl(33,100%,50%)] text-primary-foreground hover:bg-[hsl(33,100%,45%)] border-0 gap-2 font-semibold text-base px-8">
              Apply to Be a Guest <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

/* ─── SECTION 10: Newsletter ─── */
const NewsletterCTA = () => (
  <section className="py-16 md:py-20">
    <div className="container px-4 md:px-6">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid md:grid-cols-2 gap-6">
        {/* Left card */}
        <div className="rounded-2xl border border-primary/20 bg-accent p-8">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold font-display mb-2">
            Never Miss a <span className="text-primary">Live Session</span>
          </h2>
          <p className="text-muted-foreground text-sm mb-6">Get notified 24 hours and 30 minutes before every live podcast.</p>
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <input type="email" placeholder="Enter your email" className="flex-1 h-11 rounded-lg border border-input bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <Button className="bg-[hsl(33,100%,50%)] text-primary-foreground hover:bg-[hsl(33,100%,45%)] border-0">Notify Me</Button>
          </div>
          <p className="text-[11px] text-muted-foreground">Join 38,000+ subscribers · 🔒 No spam</p>
        </div>
        {/* Right card — Platforms */}
        <div className="rounded-2xl bg-primary p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold font-display text-primary-foreground mb-2">
              Listen on <span className="text-[hsl(33,100%,50%)]">Every Platform</span>
            </h3>
            <p className="text-primary-foreground/60 text-sm mb-6">Available everywhere you listen.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {["Apple Podcasts", "Spotify", "Google Podcasts", "YouTube"].map(p => (
              <Button key={p} className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90 border-0 gap-2 font-semibold text-xs">
                <Headphones className="h-3.5 w-3.5" /> {p}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

/* ─── Page ─── */
const Podcast = () => (
  <>
    <Helmet>
      <title>Live Podcasts | Real Conversations, Real Careers | I Am Talento</title>
      <meta name="description" content="Tune in as industry leaders share unfiltered insights on careers, hiring trends, and what it actually takes to succeed. 50,000+ monthly listeners." />
    </Helmet>
    <Layout>
      <PodcastHero />
      <ScheduleSection />
      <GuestsWall />
      <FeaturedSession />
      
      <WhyAttend />
      <PastEpisodes />
      <ListenerStories />
      <BecomeGuest />
      <NewsletterCTA />
    </Layout>
  </>
);

export default Podcast;
