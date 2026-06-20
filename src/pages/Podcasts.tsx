import { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion, useInView, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SectionBadge from "@/components/ui/section-badge";
import {
  Mic, Headphones, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Clock, Users, ArrowRight, Calendar, Star, Radio, Mail, Quote,
  Target, TrendingUp, Award, Handshake, FileText, Bookmark,
  Briefcase, Code, Brain, Lightbulb, Rocket, Shield, Monitor,
  CheckCircle, Sparkles, Download, Heart, Share2, ChevronLeft, ChevronRight,
  Camera, Zap,
} from "lucide-react";

import podcastThumbnail from "@/assets/podcast-thumbnail.jpg";
import ep1 from "@/assets/podcast-episode-1.jpg";
import ep2 from "@/assets/podcast-episode-2.jpg";
import ep3 from "@/assets/podcast-episode-3.jpg";
import ep4 from "@/assets/podcast-episode-4.jpg";
import host1 from "@/assets/podcast-host-1.jpg";
import host2 from "@/assets/podcast-host-2.jpg";
import host3 from "@/assets/podcast-host-3.jpg";
import host4 from "@/assets/podcast-host-4.jpg";
import speakerMeera from "@/assets/speaker-meera.jpg";
import speakerArjun from "@/assets/speaker-arjun.jpg";
import speakerKavya from "@/assets/speaker-kavya.jpg";
import speakerRohan from "@/assets/speaker-rohan.jpg";
import webHero from "@/assets/webinar-hero-person.jpg";
import wc1 from "@/assets/webinar-cover-1.jpg";
import wc2 from "@/assets/webinar-cover-2.jpg";
import wc3 from "@/assets/webinar-cover-3.jpg";
import wc4 from "@/assets/webinar-cover-4.jpg";
import wc5 from "@/assets/webinar-cover-5.jpg";
import wc6 from "@/assets/webinar-cover-6.jpg";

/* ───────── Animated Counter ───────── */
const Counter = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v));
  const [d, setD] = useState(0);
  useEffect(() => { if (inView) { const c = animate(mv, target, { duration: 1.8, ease: [0.22, 1, 0.36, 1] }); return c.stop; } }, [inView, mv, target]);
  useEffect(() => rounded.on("change", setD), [rounded]);
  return <span ref={ref} className="tabular-nums">{d}{suffix}</span>;
};

/* ───────── Data ───────── */
const ticker = [
  "🔴 Priya from Bangalore just joined the live session",
  "🎧 Rohit landed an offer using tips from last week's episode",
  "🔴 847 people registered for tomorrow's podcast in 2 hrs",
  '✦ "Cracking Product Management" — starts in 18 minutes',
];

const audioTracks = [
  { id: 1, title: "Why 90% of Resumes Get Rejected", host: "Priya Sharma · Sr. HR Lead, Infosys", cover: ep1, src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", duration: "34:12" },
  { id: 2, title: "Salary Negotiation Masterclass", host: "Rahul Mehta · Career Coach", cover: ep2, src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", duration: "41:08" },
  { id: 3, title: "Fresher to ₹12 LPA in 18 Months", host: "Karan M. · Software Engineer", cover: ep3, src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", duration: "28:44" },
  { id: 4, title: "Skills That Actually Get You Promoted", host: "Ananya Desai · VP Engineering", cover: ep4, src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", duration: "37:20" },
];

const upcoming = [
  { type: "Live Podcast", title: "Cracking Product Management Roles", img: ep1, date: "Tomorrow", time: "6:00 PM", host: "Sneha Kapoor", role: "Product Lead, Razorpay", seats: 47, format: "audio" },
  { type: "Webinar", title: "AI Tools Every Professional Must Know", img: wc1, date: "Apr 12", time: "6:00 PM", host: "Priya Nair", role: "AI Consultant, ex-Google", seats: 124, format: "video" },
  { type: "Live Podcast", title: "From Fresher to ₹50 LPA", img: ep3, date: "Apr 14", time: "7:00 PM", host: "Siddharth Rao", role: "Staff Engineer, Google", seats: 89, format: "audio" },
  { type: "Webinar", title: "Full-Stack Roadmap: Junior to Senior", img: wc2, date: "Apr 15", time: "7:00 PM", host: "Rahul Mehta", role: "Eng Lead, Swiggy", seats: 210, format: "video" },
  { type: "Live Podcast", title: "How LinkedIn Recruiters Really Search", img: ep2, date: "Apr 17", time: "5:30 PM", host: "Vikram Singh", role: "TA, Meta", seats: 156, format: "audio" },
  { type: "Webinar", title: "Digital Marketing Mastery", img: wc3, date: "Apr 18", time: "6:00 PM", host: "Ananya Verma", role: "CMO, D2C Brand", seats: 98, format: "video" },
];

const filterTabs = ["All", "Live Podcasts", "Webinars", "Tech", "Career", "Marketing"] as const;

const onDemand = [
  { title: "Why 90% of Resumes Get Rejected", img: ep1, type: "Podcast", duration: "34 min", views: "12.4K", cat: "Career" },
  { title: "AI Tools for Professionals 2025", img: wc1, type: "Webinar", duration: "90 min", views: "9.8K", cat: "Tech" },
  { title: "Fresher to ₹12 LPA Story", img: ep3, type: "Podcast", duration: "28 min", views: "18.2K", cat: "Career" },
  { title: "Full-Stack Career Roadmap", img: wc2, type: "Webinar", duration: "75 min", views: "11.6K", cat: "Tech" },
  { title: "How LinkedIn Recruiters Search", img: ep2, type: "Podcast", duration: "29 min", views: "8.3K", cat: "Career" },
  { title: "Digital Marketing Mastery", img: wc3, type: "Webinar", duration: "90 min", views: "7.1K", cat: "Marketing" },
  { title: "Skills That Get You Promoted", img: ep4, type: "Podcast", duration: "37 min", views: "6.9K", cat: "Career" },
  { title: "Interview Confidence Blueprint", img: wc4, type: "Webinar", duration: "60 min", views: "15.4K", cat: "Career" },
  { title: "Breaking into Product Management", img: ep1, type: "Podcast", duration: "45 min", views: "8.7K", cat: "Tech" },
];

const hosts = [
  { name: "Meera Sharma", role: "Career Strategist · TalentBridge", img: speakerMeera, episodes: 24 },
  { name: "Arjun Nair", role: "Tech Lead · CloudNova", img: speakerArjun, episodes: 18 },
  { name: "Kavya Iyer", role: "Industry Analyst · McKinsey", img: speakerKavya, episodes: 15 },
  { name: "Rohan Deshmukh", role: "Startup Coach · YC Alumni", img: speakerRohan, episodes: 21 },
  { name: "Priya Nair", role: "AI Consultant · ex-Google", img: host1, episodes: 12 },
  { name: "Rahul Mehta", role: "Eng Lead · Swiggy", img: host2, episodes: 19 },
];

const categories = [
  { icon: Briefcase, label: "Career Growth", count: 64, color: "from-orange-500 to-red-500" },
  { icon: Code, label: "Tech & AI", count: 52, color: "from-blue-500 to-cyan-500" },
  { icon: Brain, label: "Mindset", count: 31, color: "from-purple-500 to-pink-500" },
  { icon: Lightbulb, label: "Skills", count: 47, color: "from-yellow-500 to-orange-500" },
  { icon: Rocket, label: "Startups", count: 28, color: "from-emerald-500 to-teal-500" },
  { icon: Award, label: "Leadership", count: 22, color: "from-rose-500 to-pink-500" },
];

const perks = [
  { icon: Target, title: "Direct Access to Decision Makers", desc: "Ask your questions live — no filters, no PR speak." },
  { icon: TrendingUp, title: "Actionable Career Intelligence", desc: "Every session ends with a 3-step action plan." },
  { icon: Award, title: "Exclusive Guest Insights", desc: "Hiring secrets, salary truths, and what your resume is missing." },
  { icon: Handshake, title: "Live Networking Rooms", desc: "Post-session breakout rooms to connect with attendees." },
  { icon: FileText, title: "Recap Delivered to You", desc: "AI summary, takeaways, and action points in your inbox." },
  { icon: Bookmark, title: "Certificate of Attendance", desc: "Add it to your I Am Talento profile." },
];

const howSteps = [
  { n: "01", title: "Register Free", desc: "Pick a podcast or webinar — RSVP in one click." },
  { n: "02", title: "Get Reminders", desc: "Calendar invite + email + WhatsApp nudge." },
  { n: "03", title: "Join Live", desc: "Tune in from any device. Audio or video, your choice." },
  { n: "04", title: "Ask Anything", desc: "Live Q&A, polls, and breakout rooms." },
  { n: "05", title: "Take Action", desc: "Action kit, recap, and certificate in your inbox." },
];

const stories = [
  { quote: "Used the exact salary script from one session — got ₹3 LPA more than the initial offer.", name: "Aditya S.", role: "SDE, Pune", img: "https://randomuser.me/api/portraits/men/32.jpg" },
  { quote: "Rewrote my resume after the ATS episode. Got 4 interview calls the next week.", name: "Sneha R.", role: "Marketing Mgr, Mumbai", img: "https://randomuser.me/api/portraits/women/44.jpg" },
  { quote: "As a fresher, the 30-day action plan from the guest actually worked.", name: "Karan M.", role: "Fresh Graduate, Delhi", img: "https://randomuser.me/api/portraits/men/22.jpg" },
];

const gallery = [ep1, wc2, ep3, wc4, ep2, wc5, ep4, wc6, wc1];

const bundles = [
  { title: "Tech Career Accelerator", count: 6, price: "₹999", worth: "₹2,499", color: "bg-primary text-primary-foreground" },
  { title: "Job Search Masterclass", count: 5, price: "₹799", worth: "₹1,999", color: "bg-card border border-border" },
  { title: "Leadership Fast Track", count: 4, price: "₹899", worth: "₹1,999", color: "bg-card border border-border" },
];

const faqs = [
  { q: "Are podcasts and webinars free?", a: "Most live sessions are free. Premium series and bundles are clearly marked with pricing." },
  { q: "Can I listen on the go?", a: "Yes — every podcast streams in the built-in audio player and is available on Spotify & Apple Podcasts." },
  { q: "Do I get a certificate?", a: "Yes, attend a live session and a verified certificate is added to your I Am Talento profile." },
  { q: "Can I watch recordings?", a: "Absolutely — every session is recorded and added to the on-demand library within 24 hours." },
];

/* ───────── 1. HERO ───────── */
const Hero = () => (
  <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 overflow-hidden bg-accent/30">
    <div className="absolute inset-0 -z-10">
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-[hsl(33,100%,50%)]/5 blur-[80px]" />
    </div>
    <div className="container px-4 md:px-6">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <SectionBadge label="Podcasts & Webinars" icon={Mic} className="mb-6" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-[1.05] mb-5 tracking-tight">
            Real Conversations.<br />
            Real Skills.<br />
            <span className="gradient-text">Live Every Week.</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
            One home for every podcast and webinar — listen, watch, learn, and apply it the same day. Hosted by people who actually hire.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 h-12 px-6 rounded-xl">
              <Play className="h-4 w-4 fill-current" /> Join Next Live Session
            </Button>
            <Button size="lg" variant="outline" className="gap-2 h-12 px-6 rounded-xl border-border">
              <Headphones className="h-4 w-4" /> Browse Episodes
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {[
              { icon: Users, t: "50K+ monthly listeners" },
              { icon: Radio, t: "370+ episodes" },
              { icon: Star, t: "4.9/5 avg rating" },
            ].map((c) => (
              <span key={c.t} className="inline-flex items-center gap-1.5 px-3 py-2 font-medium rounded-full bg-background border border-border">
                <c.icon className="h-3.5 w-3.5 text-primary" /> {c.t}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }} className="relative">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl group cursor-pointer aspect-video">
            <img src={podcastThumbnail} alt="Podcast conversation" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/30 transition-colors" />
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
          </div>
          <div className="absolute -bottom-6 -left-6 hidden md:flex items-center gap-3 bg-background rounded-xl border border-border shadow-lg px-4 py-3">
            <img src={webHero} alt="" className="h-10 w-10 rounded-full object-cover" />
            <div>
              <p className="text-[11px] text-muted-foreground">Now playing</p>
              <p className="text-xs font-bold">Salary Negotiation 101</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

/* ───────── 2. TICKER ───────── */
const Ticker = () => {
  const data = [...ticker, ...ticker, ...ticker];
  return (
    <section className="overflow-hidden my-2">
      <div className="bg-[hsl(33,100%,50%)] py-3.5 -rotate-[0.5deg]">
        <motion.div className="flex items-center w-max" animate={{ x: ["0%", "-33.33%"] }} transition={{ duration: 30, ease: "linear", repeat: Infinity }}>
          {data.map((t, i) => (
            <span key={i} className="flex items-center shrink-0 text-primary-foreground text-xs md:text-sm font-extrabold font-display whitespace-nowrap px-8 uppercase tracking-wider">
              {t} <span className="ml-8 text-primary-foreground/50">✦</span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

/* ───────── 3. STATS BENTO ───────── */
const Stats = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const avatars = ["https://randomuser.me/api/portraits/women/23.jpg", "https://randomuser.me/api/portraits/men/45.jpg", "https://randomuser.me/api/portraits/women/56.jpg", "https://randomuser.me/api/portraits/men/67.jpg"];
  return (
    <section className="py-16 md:py-20" ref={ref}>
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }} className="rounded-2xl border border-border bg-card p-6">
            <div className="flex -space-x-2.5 mb-4">{avatars.map((s, i) => <img key={i} src={s} alt="" className="h-9 w-9 rounded-full border-2 border-background object-cover" />)}</div>
            <p className="text-3xl font-bold font-display"><Counter target={50000} suffix="+" /></p>
            <p className="text-xs text-muted-foreground mt-1">Monthly Listeners</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.15 }} className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between">
            <p className="text-sm font-medium">New episodes every single week.</p>
            <div className="mt-4">
              <p className="text-5xl font-bold font-display"><Counter target={370} suffix="+" /></p>
              <p className="text-xs text-muted-foreground mt-1">Episodes Published</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }} className="rounded-2xl bg-primary text-primary-foreground p-6 flex flex-col justify-between row-span-2">
            <div>
              <p className="text-sm text-primary-foreground/85">Rated India's <span className="font-bold">#1 career podcast & webinar</span> network</p>
              <motion.div animate={inView ? { y: [0, -6, 0] } : {}} transition={{ delay: 1.5, duration: 2, repeat: Infinity }} className="mt-6">
                <TrendingUp className="h-16 w-16 text-primary-foreground" />
              </motion.div>
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold font-display"><Counter target={4} /></span>
                <span className="text-5xl font-bold font-display">.9</span>
                <span className="text-lg text-primary-foreground/60 font-bold">/5</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-[hsl(33,100%,50%)] text-[hsl(33,100%,50%)]" />)}
                <span className="text-[10px] uppercase tracking-wider font-bold ml-1 text-primary-foreground/70">Avg Rating</span>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.25 }} className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4"><Shield className="h-5 w-5 text-primary" /><span className="text-sm font-semibold">Vetted Experts</span></div>
            <p className="text-4xl font-bold font-display"><Counter target={120} suffix="+" /></p>
            <p className="text-xs text-muted-foreground mt-1">Guest Hosts</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }} className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-center">
            <span className="text-5xl font-bold font-display text-primary mb-1">78%</span>
            <p className="text-xs text-muted-foreground font-medium">of listeners report career growth within 3 months</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ───────── 4. INTERACTIVE AUDIO PLAYER ───────── */
const Player = () => {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [time, setTime] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef<HTMLAudioElement>(null);

  const track = audioTracks[idx];

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = muted ? 0 : volume;
  }, [volume, muted]);

  useEffect(() => {
    setPlaying(false);
    setProgress(0);
    setTime(0);
  }, [idx]);

  const toggle = () => {
    const a = audioRef.current; if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else { a.play().then(() => setPlaying(true)).catch(() => setPlaying(false)); }
  };

  const onTime = () => {
    const a = audioRef.current; if (!a) return;
    setTime(a.currentTime);
    if (a.duration) { setDuration(a.duration); setProgress((a.currentTime / a.duration) * 100); }
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const a = audioRef.current; if (!a || !a.duration) return;
    const p = Number(e.target.value);
    a.currentTime = (p / 100) * a.duration;
    setProgress(p);
  };

  const fmt = (s: number) => {
    if (!s || !isFinite(s)) return "0:00";
    const m = Math.floor(s / 60); const r = Math.floor(s % 60);
    return `${m}:${r.toString().padStart(2, "0")}`;
  };

  return (
    <section className="py-16 md:py-24 bg-foreground text-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10">
          <SectionBadge label="Listen Now" icon={Headphones} />
          <h2 className="text-3xl md:text-4xl font-bold font-display mt-4">Press play. Learn on the go.</h2>
          <p className="text-background/60 mt-3 text-sm md:text-base">Stream full episodes right here — no app required.</p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-[1fr_1.2fr] gap-6 rounded-3xl bg-background/5 border border-background/10 p-5 md:p-8 backdrop-blur">
          {/* Cover */}
          <motion.div key={track.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="relative rounded-2xl overflow-hidden aspect-square">
            <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
            <motion.div animate={playing ? { scale: [1, 1.08, 1] } : {}} transition={{ duration: 1.6, repeat: Infinity }} className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
              {playing ? <><Radio className="h-3 w-3" /> ON AIR</> : <><Mic className="h-3 w-3" /> READY</>}
            </motion.div>
          </motion.div>

          {/* Controls */}
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-background/50 mb-2">Now Playing</p>
              <h3 className="text-xl md:text-2xl font-bold font-display mb-1">{track.title}</h3>
              <p className="text-sm text-background/60">{track.host}</p>
            </div>

            <div className="mt-6">
              <input type="range" min={0} max={100} value={progress} onChange={seek}
                className="w-full h-1.5 rounded-full appearance-none bg-background/15 accent-primary cursor-pointer" />
              <div className="flex justify-between text-[11px] text-background/50 mt-1.5 tabular-nums">
                <span>{fmt(time)}</span><span>{fmt(duration) === "0:00" ? track.duration : fmt(duration)}</span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button onClick={() => setMuted(!muted)} className="h-9 w-9 rounded-full hover:bg-background/10 grid place-items-center">
                  {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
                <input type="range" min={0} max={1} step={0.01} value={muted ? 0 : volume}
                  onChange={(e) => { setVolume(Number(e.target.value)); setMuted(false); }}
                  className="w-20 h-1 rounded-full appearance-none bg-background/15 accent-primary cursor-pointer" />
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => setIdx((idx - 1 + audioTracks.length) % audioTracks.length)} className="h-10 w-10 rounded-full hover:bg-background/10 grid place-items-center"><SkipBack className="h-4 w-4" /></button>
                <button onClick={toggle} className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 grid place-items-center text-primary-foreground shadow-xl">
                  {playing ? <Pause className="h-6 w-6 fill-current" /> : <Play className="h-6 w-6 fill-current ml-0.5" />}
                </button>
                <button onClick={() => setIdx((idx + 1) % audioTracks.length)} className="h-10 w-10 rounded-full hover:bg-background/10 grid place-items-center"><SkipForward className="h-4 w-4" /></button>
              </div>

              <div className="flex items-center gap-1">
                <button className="h-9 w-9 rounded-full hover:bg-background/10 grid place-items-center"><Heart className="h-4 w-4" /></button>
                <button className="h-9 w-9 rounded-full hover:bg-background/10 grid place-items-center"><Share2 className="h-4 w-4" /></button>
                <button className="h-9 w-9 rounded-full hover:bg-background/10 grid place-items-center"><Download className="h-4 w-4" /></button>
              </div>
            </div>

            <audio ref={audioRef} src={track.src} onTimeUpdate={onTime} onLoadedMetadata={onTime} onEnded={() => { setPlaying(false); setIdx((idx + 1) % audioTracks.length); }} preload="metadata" />
          </div>
        </div>

        {/* Playlist */}
        <div className="max-w-5xl mx-auto mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {audioTracks.map((t, i) => (
            <button key={t.id} onClick={() => setIdx(i)}
              className={`text-left flex items-center gap-3 p-3 rounded-xl border transition-all ${i === idx ? "border-primary bg-primary/10" : "border-background/10 hover:border-background/30 bg-background/5"}`}>
              <img src={t.cover} alt="" className="h-12 w-12 rounded-lg object-cover shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate">{t.title}</p>
                <p className="text-[10px] text-background/50 truncate">{t.duration}</p>
              </div>
              {i === idx && playing && <div className="ml-auto flex gap-0.5 items-end h-4">
                {[1, 2, 3].map((b) => <motion.span key={b} animate={{ scaleY: [0.4, 1, 0.4] }} transition={{ duration: 0.8, repeat: Infinity, delay: b * 0.15 }} className="w-0.5 h-full bg-primary rounded-full origin-bottom" />)}
              </div>}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ───────── 5. UPCOMING (filterable) ───────── */
const Upcoming = () => {
  const [tab, setTab] = useState<typeof filterTabs[number]>("All");
  const list = tab === "All" ? upcoming : upcoming.filter((u) => u.type.includes(tab.replace("s", "")) || tab === "Live Podcasts" && u.type === "Live Podcast" || tab === "Webinars" && u.type === "Webinar");
  return (
    <section className="py-16 md:py-24 bg-accent/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10">
          <SectionBadge label="Upcoming Live" icon={Calendar} />
          <h2 className="text-3xl md:text-4xl font-bold font-display mt-4">What's coming up</h2>
          <p className="text-muted-foreground text-sm md:text-base mt-3 max-w-md mx-auto">All live, all interactive — with Q&A, polls, and breakout rooms.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {filterTabs.slice(0, 3).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${tab === t ? "bg-primary text-primary-foreground shadow-md" : "bg-background border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"}`}>{t}</button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((u, i) => (
              <motion.div key={u.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="relative aspect-video overflow-hidden">
                  <img src={u.img} alt={u.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground border-0">{u.type}</Badge>
                  <span className="absolute top-3 right-3 inline-flex items-center gap-1 bg-background/95 backdrop-blur px-2.5 py-1 rounded-full text-[11px] font-semibold">
                    {u.format === "audio" ? <Headphones className="h-3 w-3" /> : <Monitor className="h-3 w-3" />}
                    {u.format === "audio" ? "Audio" : "Video"}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold font-display text-base leading-snug mb-3 line-clamp-2">{u.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                    <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{u.date}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{u.time}</span>
                    <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" />{u.seats} in</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <p className="text-xs font-semibold">{u.host}</p>
                      <p className="text-[11px] text-muted-foreground">{u.role}</p>
                    </div>
                    <Button size="sm" className="rounded-full">RSVP</Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

/* ───────── 6. ON-DEMAND LIBRARY (filter + 9 grid) ───────── */
const Library = () => {
  const [cat, setCat] = useState<typeof filterTabs[number]>("All");
  const filtered = cat === "All" ? onDemand : onDemand.filter((o) => o.type.includes(cat.replace("s", "")) || o.cat === cat);
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <SectionBadge label="On-Demand Library" icon={Sparkles} />
            <h2 className="text-3xl md:text-4xl font-bold font-display mt-4">Watch & listen anytime</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {filterTabs.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`px-4 py-2 rounded-full text-xs font-semibold transition ${cat === c ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground hover:text-foreground"}`}>{c}</button>
            ))}
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((o, i) => (
            <motion.div key={o.title + i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
              className="group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="relative aspect-video overflow-hidden">
                <img src={o.img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors" />
                <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-primary text-primary-foreground grid place-items-center opacity-0 group-hover:opacity-100 transition shadow-xl">
                  <Play className="h-5 w-5 fill-current ml-0.5" />
                </button>
                <Badge className="absolute top-3 left-3 bg-background/95 text-foreground border-0">{o.type}</Badge>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm leading-snug mb-2 line-clamp-2">{o.title}</h3>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{o.duration}</span>
                  <span>{o.views} views</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Button variant="outline" className="rounded-full">Browse All Episodes <ArrowRight className="h-4 w-4 ml-2" /></Button>
        </div>
      </div>
    </section>
  );
};

/* ───────── 7. HOSTS / SPEAKERS ───────── */
const Hosts = () => (
  <section className="py-16 md:py-24 bg-accent/30">
    <div className="container px-4 md:px-6">
      <div className="text-center mb-10">
        <SectionBadge label="The Voices" icon={Mic} />
        <h2 className="text-3xl md:text-4xl font-bold font-display mt-4">Meet your hosts & speakers</h2>
        <p className="text-muted-foreground text-sm md:text-base mt-3 max-w-md mx-auto">Practitioners who've sat on both sides of the hiring table.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {hosts.map((h, i) => (
          <motion.div key={h.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
            className="group rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/30 hover:-translate-y-1 transition-all">
            <div className="aspect-square overflow-hidden">
              <img src={h.img} alt={h.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-3">
              <p className="font-bold text-sm">{h.name}</p>
              <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{h.role}</p>
              <div className="mt-2 inline-flex items-center gap-1 text-[10px] text-primary font-semibold"><Radio className="h-3 w-3" />{h.episodes} episodes</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ───────── 8. CATEGORIES ───────── */
const Categories = () => (
  <section className="py-16 md:py-24">
    <div className="container px-4 md:px-6">
      <div className="text-center mb-10">
        <SectionBadge label="Explore" icon={Lightbulb} />
        <h2 className="text-3xl md:text-4xl font-bold font-display mt-4">Pick a topic that moves you</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((c, i) => (
          <motion.button key={c.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} whileHover={{ y: -4 }}
            className="relative rounded-2xl p-5 text-left border border-border bg-card overflow-hidden group">
            <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${c.color} grid place-items-center mb-4`}>
              <c.icon className="h-6 w-6 text-white" />
            </div>
            <p className="font-bold text-sm">{c.label}</p>
            <p className="text-[11px] text-muted-foreground mt-1">{c.count} episodes</p>
          </motion.button>
        ))}
      </div>
    </div>
  </section>
);

/* ───────── 9. HOW IT WORKS ───────── */
const How = () => (
  <section className="py-16 md:py-24 bg-accent/30">
    <div className="container px-4 md:px-6">
      <div className="text-center mb-12">
        <SectionBadge label="How It Works" icon={Zap} />
        <h2 className="text-3xl md:text-4xl font-bold font-display mt-4">5 steps from RSVP to action</h2>
      </div>
      <div className="grid md:grid-cols-5 gap-4 relative">
        {howSteps.map((s, i) => (
          <motion.div key={s.n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            className="relative rounded-2xl bg-card border border-border p-5">
            <span className="text-4xl font-bold font-display text-primary/20">{s.n}</span>
            <h3 className="font-bold mt-2">{s.title}</h3>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ───────── 10. WHY JOIN ───────── */
const Perks = () => (
  <section className="py-16 md:py-24">
    <div className="container px-4 md:px-6">
      <div className="text-center mb-12">
        <SectionBadge label="Why You'll Love It" icon={Star} />
        <h2 className="text-3xl md:text-4xl font-bold font-display mt-4">Built for outcomes, not just views</h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {perks.map((p, i) => (
          <motion.div key={p.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
            className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/30 hover:-translate-y-1 transition-all">
            <div className="h-11 w-11 rounded-xl bg-primary/10 grid place-items-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <p.icon className="h-5 w-5" />
            </div>
            <h3 className="font-bold font-display mb-2">{p.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ───────── 11. BEHIND THE SCENES (gallery) ───────── */
const Gallery = () => (
  <section className="py-16 md:py-24 bg-accent/30">
    <div className="container px-4 md:px-6">
      <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
        <div>
          <SectionBadge label="Behind The Scenes" icon={Camera} />
          <h2 className="text-3xl md:text-4xl font-bold font-display mt-4">Moments from the studio</h2>
        </div>
        <Button variant="outline" className="rounded-full">Follow on Instagram <ArrowRight className="h-4 w-4 ml-2" /></Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {gallery.map((g, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
            className={`overflow-hidden rounded-xl group ${i === 0 || i === 4 ? "lg:row-span-2 lg:col-span-2 aspect-square" : "aspect-square"}`}>
            <img src={g} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ───────── 12. STORIES ───────── */
const Stories = () => (
  <section className="py-16 md:py-24">
    <div className="container px-4 md:px-6">
      <div className="text-center mb-12">
        <SectionBadge label="Listener Wins" icon={Quote} />
        <h2 className="text-3xl md:text-4xl font-bold font-display mt-4">Real outcomes from real listeners</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {stories.map((s, i) => (
          <motion.div key={s.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-border bg-card p-6 relative">
            <Quote className="h-8 w-8 text-primary/20 absolute top-4 right-4" />
            <p className="text-sm leading-relaxed mb-5">"{s.quote}"</p>
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <img src={s.img} alt={s.name} className="h-10 w-10 rounded-full object-cover" />
              <div>
                <p className="text-sm font-bold">{s.name}</p>
                <p className="text-[11px] text-muted-foreground">{s.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ───────── 13. BUNDLES ───────── */
const Bundles = () => (
  <section className="py-16 md:py-24 bg-accent/30">
    <div className="container px-4 md:px-6">
      <div className="text-center mb-12">
        <SectionBadge label="Series & Bundles" icon={Award} />
        <h2 className="text-3xl md:text-4xl font-bold font-display mt-4">Go deep with curated series</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {bundles.map((b, i) => (
          <motion.div key={b.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            className={`rounded-2xl p-7 ${b.color}`}>
            <p className="text-xs uppercase tracking-wider opacity-70 font-semibold">{b.count} episodes</p>
            <h3 className="text-2xl font-bold font-display mt-2 mb-4">{b.title}</h3>
            <div className="flex items-baseline gap-2 mb-5">
              <span className="text-3xl font-bold font-display">{b.price}</span>
              <span className="text-sm line-through opacity-50">{b.worth}</span>
            </div>
            <Button variant={i === 0 ? "secondary" : "default"} className="w-full rounded-full">Unlock Bundle</Button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ───────── 14. FAQ ───────── */
const FAQ = () => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 md:px-6 max-w-3xl">
        <div className="text-center mb-10">
          <SectionBadge label="FAQ" icon={CheckCircle} />
          <h2 className="text-3xl md:text-4xl font-bold font-display mt-4">Quick answers</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                <span className="font-semibold text-sm md:text-base">{f.q}</span>
                <ChevronRight className={`h-4 w-4 transition-transform ${open === i ? "rotate-90" : ""}`} />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ───────── 15. CTA + NEWSLETTER ───────── */
const CTA = () => (
  <section className="py-16 md:py-24">
    <div className="container px-4 md:px-6">
      <div className="relative rounded-3xl overflow-hidden bg-primary text-primary-foreground p-10 md:p-14">
        <div className="absolute inset-0 opacity-10">
          <img src={podcastThumbnail} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-display leading-tight">Never miss a session.</h2>
            <p className="mt-3 text-primary-foreground/80 max-w-md">Get the weekly episode drop, exclusive guest notes, and early-bird RSVP — straight to your inbox.</p>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 bg-background text-foreground rounded-full px-4 py-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <input type="email" placeholder="you@work.com" className="bg-transparent outline-none text-sm flex-1" />
            </div>
            <Button type="submit" size="lg" variant="secondary" className="rounded-full bg-foreground text-background hover:bg-foreground/90 gap-2">
              Subscribe <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  </section>
);

/* ───────── PAGE ───────── */
const Podcasts = () => (
  <Layout>
    <Helmet>
      <title>Podcasts & Webinars | I Am Talento</title>
      <meta name="description" content="Live podcasts and webinars from India's top hiring managers, founders and career coaches. Stream on-demand, RSVP free, earn certificates." />
    </Helmet>
    <Hero />
    <Ticker />
    <Stats />
    <Player />
    <Upcoming />
    <Library />
    <Hosts />
    <Categories />
    <How />
    <Perks />
    <Gallery />
    <Stories />
    <Bundles />
    <FAQ />
    <CTA />
  </Layout>
);

export default Podcasts;
