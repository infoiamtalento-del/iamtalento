import { useState, useRef, useEffect } from "react";
import TicketCarousel from "@/components/hackathons/TicketCarousel";
import HackathonScheduleSection from "@/components/hackathons/HackathonScheduleSection";
import HackathonSocialProof from "@/components/hackathons/HackathonSocialProof";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SectionBadge from "@/components/ui/section-badge";
import { motion, useInView, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";
import {
  Calendar, ArrowRight, ArrowUpRight, Code, Trophy, Zap, Star, Award,
  Target, Sparkles, Users, Eye, Shield, Brain, Palette,
  TrendingUp, DollarSign, Sprout, Quote, MessageCircle,
  Laptop, BarChart3, CheckCircle, Play, Flame, PartyPopper, Briefcase,
  Clock, MapPin
} from "lucide-react";

import hackathonHero from "@/assets/hackathon-hero.jpg";
import hackathonEvent1 from "@/assets/hackathon-event-1.jpg";
import hackathonEvent2 from "@/assets/hackathon-event-2.jpg";

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
const prizes = [
  { icon: "🥇", label: "1st Place", value: "₹5,00,000", extra: "Fast-track interviews + Verified Badge + Feature" },
  { icon: "🥈", label: "2nd Place", value: "₹2,50,000", extra: "Interview Access + Badge" },
  { icon: "🥉", label: "3rd Place", value: "₹1,00,000", extra: "Badge" },
  { icon: "🏅", label: "Top 10", value: "Verified Badge", extra: "Employer Visibility + Certificate" },
  { icon: "🎖️", label: "All Participants", value: "Certificate", extra: "Profile boost" },
];

const whyDifferent = [
  { icon: Eye, title: "Employers Are Watching Live", desc: "200+ hiring managers observe submissions in real time. Outstanding teams get direct interview invitations." },
  { icon: CheckCircle, title: "Work Gets Verified on Profile", desc: "Every project you submit is added to your profile as a verified project with employer-accessible scores." },
  { icon: Target, title: "Real Problems. Real Impact.", desc: "Challenges are sourced from industry partners facing live business problems. Your solution could get deployed." },
  { icon: Brain, title: "Mentorship During the Build", desc: "Get matched with a senior mentor. Office hours, feedback, and strategic guidance included." },
  { icon: Users, title: "Build Your Team or Join One", desc: "Our smart team-matching algorithm connects you with complementary skills in under 24 hours." },
  { icon: Award, title: "Certificate That's Worth Something", desc: "Verifiable scores, project links, and employer-visibility — not just a PDF with your name." },
];

const industryTabs = [
  {
    tab: "Tech & Engineering",
    icon: Laptop,
    categories: [
      { title: "Full Stack Development", desc: "React, Node.js, APIs, databases" },
      { title: "Mobile Engineering", desc: "iOS, Android, React Native, Flutter" },
      { title: "Cloud & DevOps", desc: "AWS, Docker, Kubernetes, CI/CD" },
      { title: "Cybersecurity", desc: "Pentesting, SIEM, threat modeling" },
      { title: "Embedded Systems", desc: "IoT, firmware, microcontrollers" },
      { title: "Blockchain & Web3", desc: "Smart contracts, DApps, DeFi" },
    ],
  },
  {
    tab: "Data & AI",
    icon: BarChart3,
    categories: [
      { title: "Machine Learning", desc: "Supervised, unsupervised, deep learning" },
      { title: "Data Engineering", desc: "Pipelines, ETL, Spark, Airflow" },
      { title: "NLP & LLMs", desc: "Transformers, RAG, prompt engineering" },
      { title: "Computer Vision", desc: "Object detection, image segmentation" },
      { title: "Analytics & BI", desc: "Dashboards, SQL, Tableau, Power BI" },
      { title: "MLOps", desc: "Model deployment, monitoring, versioning" },
    ],
  },
  {
    tab: "Design & UX",
    icon: Palette,
    categories: [
      { title: "Product Design", desc: "End-to-end design systems, Figma" },
      { title: "UX Research", desc: "User interviews, usability testing" },
      { title: "Interaction Design", desc: "Micro-interactions, prototyping" },
      { title: "Visual Design", desc: "Branding, typography, illustration" },
      { title: "Design Systems", desc: "Component libraries, tokens, docs" },
      { title: "Accessibility", desc: "WCAG, screen readers, inclusive design" },
    ],
  },
  {
    tab: "Business & Strategy",
    icon: TrendingUp,
    categories: [
      { title: "Product Management", desc: "Roadmaps, PRDs, prioritization" },
      { title: "Growth Marketing", desc: "SEO, paid ads, funnel optimization" },
      { title: "Business Analysis", desc: "Requirements, process mapping, KPIs" },
      { title: "Consulting", desc: "Strategy frameworks, market sizing" },
      { title: "Operations", desc: "Supply chain, logistics, automation" },
      { title: "Entrepreneurship", desc: "Pitch decks, GTM, fundraising" },
    ],
  },
  {
    tab: "Social Impact",
    icon: Sprout,
    categories: [
      { title: "EdTech Solutions", desc: "Learning platforms, gamification" },
      { title: "HealthTech", desc: "Telemedicine, diagnostics, wellness" },
      { title: "FinTech for Good", desc: "Financial inclusion, micro-lending" },
      { title: "Sustainability", desc: "Carbon tracking, circular economy" },
      { title: "Civic Tech", desc: "Governance tools, transparency" },
      { title: "Accessibility Tech", desc: "Assistive tools, inclusive platforms" },
    ],
  },
];

const steps = [
  { step: "01", title: "Register", desc: "Sign up solo or as a team. Fill your profile so employers can see you.", icon: CheckCircle },
  { step: "02", title: "Get the Brief", desc: "Problem statement drops at 9 AM Day 1. All receive it simultaneously.", icon: Target },
  { step: "03", title: "Build", desc: "48 hours. Mentors, community channels, and your raw talent.", icon: Code },
  { step: "04", title: "Submit", desc: "Upload solution with demo video and documentation.", icon: Play },
  { step: "05", title: "Get Evaluated", desc: "Expert judges score. Top 20 pitch live. Top 10 get employer visibility.", icon: Award },
];

const judgingCriteria = [
  { title: "Innovation & Originality", pct: 25, icon: Sparkles, color: "hsl(var(--primary))", desc: "Novel ideas that challenge the status quo" },
  { title: "Technical Execution", pct: 25, icon: Code, color: "hsl(33,100%,50%)", desc: "Clean code, architecture & performance" },
  { title: "Impact & Scalability", pct: 20, icon: TrendingUp, color: "hsl(var(--primary)/0.8)", desc: "Real-world potential and growth ability" },
  { title: "Presentation", pct: 15, icon: Play, color: "hsl(33,100%,45%)", desc: "Clarity of pitch, storytelling & demo" },
  { title: "UX & Design", pct: 15, icon: Palette, color: "hsl(var(--primary)/0.65)", desc: "Intuitive, polished user experience" },
];

const hiringPartners = [
  { name: "Razorpay", logo: "https://www.google.com/s2/favicons?domain=razorpay.com&sz=64" },
  { name: "PhonePe", logo: "https://www.google.com/s2/favicons?domain=phonepe.com&sz=64" },
  { name: "Zepto", logo: "https://www.google.com/s2/favicons?domain=zeptonow.com&sz=64" },
  { name: "CRED", logo: "https://www.google.com/s2/favicons?domain=cred.club&sz=64" },
  { name: "Groww", logo: "https://www.google.com/s2/favicons?domain=groww.in&sz=64" },
  { name: "Meesho", logo: "https://www.google.com/s2/favicons?domain=meesho.com&sz=64" },
  { name: "Unacademy", logo: "https://www.google.com/s2/favicons?domain=unacademy.com&sz=64" },
  { name: "Zomato", logo: "https://www.google.com/s2/favicons?domain=zomato.com&sz=64" },
  { name: "Infosys", logo: "https://www.google.com/s2/favicons?domain=infosys.com&sz=64" },
  { name: "Wipro", logo: "https://www.google.com/s2/favicons?domain=wipro.com&sz=64" },
  { name: "Deloitte", logo: "https://www.google.com/s2/favicons?domain=deloitte.com&sz=64" },
  { name: "PwC", logo: "https://www.google.com/s2/favicons?domain=pwc.com&sz=64" },
];

const pastWinners = [
  { name: "Aryan Gupta", season: "Season 1 Winner — Tech Track", outcome: "Got 3 interview calls the day results dropped. Joined Razorpay 3 weeks later at ₹18 LPA.", img: "https://randomuser.me/api/portraits/men/32.jpg", metric: "₹18 LPA", metricLabel: "Offer Received", company: "Razorpay" },
  { name: "Team Elevate", season: "Season 2 Winners — Business Track", outcome: "Our pitch became a real product. Now building full-time with seed funding from one of the judges.", img: "https://randomuser.me/api/portraits/women/44.jpg", metric: "Seed Funded", metricLabel: "Post Hackathon", company: "Self-Founded" },
  { name: "Divya Nair", season: "Season 3 Winner — Design Track", outcome: "Was freelancing. Now Senior UX Designer at a funded startup. The hackathon changed everything.", img: "https://randomuser.me/api/portraits/women/68.jpg", metric: "Sr. UX Lead", metricLabel: "Current Role", company: "DesignCo" },
  { name: "Kabir Shah", season: "Season 3 Top 10 — Data Track", outcome: "Didn't win but got a DM from a hiring manager. Had an offer within 10 days.", img: "https://randomuser.me/api/portraits/men/22.jpg", metric: "10 Days", metricLabel: "To Offer", company: "DataStack" },
];

const communityPerks = [
  { icon: MessageCircle, text: "Private Discord community (5,000+ active members)" },
  { icon: Users, text: "Mentor matching for your track" },
  { icon: Shield, text: "Free access to skill assessments during the hackathon" },
  { icon: Code, text: "Resource library: datasets, APIs, design kits, frameworks" },
  { icon: Trophy, text: "Live office hours with past winners" },
  { icon: Award, text: "AI Resume Builder to update your profile post-hackathon" },
];

const pastSeasons = [
  {
    season: "Season 1",
    hackathonTitle: "Future of Education",
    date: "Jan 2024",
    duration: "48 Hours",
    location: "Online · Pan India",
    participants: "3,200+",
    prizes: "₹5,00,000",
    hired: "47",
    projects: "860+",
    conductor: "Infosys",
    conductorLogo: "https://www.google.com/s2/favicons?domain=infosys.com&sz=64",
    winner: { name: "Aryan Gupta", img: "https://randomuser.me/api/portraits/men/32.jpg", track: "Tech Track", project: "EduAI — AI Tutor Platform" },
    runnerUps: [
      { name: "Sneha Kulkarni", img: "https://randomuser.me/api/portraits/women/44.jpg", track: "Design Track", project: "LearnPath UI" },
      { name: "Rahul Jain", img: "https://randomuser.me/api/portraits/men/22.jpg", track: "Data & AI", project: "SkillMap Analytics" },
    ],
    accent: "primary" as const,
  },
  {
    season: "Season 2",
    hackathonTitle: "Sustainable Tech",
    date: "Jun 2024",
    duration: "48 Hours + 2 Week Build",
    location: "Hybrid · Bangalore",
    participants: "5,100+",
    prizes: "₹8,00,000",
    hired: "83",
    projects: "1,200+",
    conductor: "Razorpay",
    conductorLogo: "https://www.google.com/s2/favicons?domain=razorpay.com&sz=64",
    winner: { name: "Team Elevate", img: "https://randomuser.me/api/portraits/women/44.jpg", track: "Business Track", project: "GreenPay — Carbon Credits" },
    runnerUps: [
      { name: "Karthik Reddy", img: "https://randomuser.me/api/portraits/men/45.jpg", track: "Tech Track", project: "EcoRoute Optimizer" },
      { name: "Priya Menon", img: "https://randomuser.me/api/portraits/women/33.jpg", track: "Social Impact", project: "WasteWise App" },
    ],
    accent: "orange" as const,
  },
  {
    season: "Season 3",
    hackathonTitle: "AI for Good",
    date: "Dec 2024",
    duration: "72 Hours",
    location: "Online · Global",
    participants: "7,500+",
    prizes: "₹12,00,000",
    hired: "126",
    projects: "2,100+",
    conductor: "Google",
    conductorLogo: "https://www.google.com/s2/favicons?domain=google.com&sz=64",
    winner: { name: "Divya Nair", img: "https://randomuser.me/api/portraits/women/68.jpg", track: "Design Track", project: "AccessAI — Inclusive Hiring" },
    runnerUps: [
      { name: "Vikram Sinha", img: "https://randomuser.me/api/portraits/men/55.jpg", track: "Tech Track", project: "FairScreen Engine" },
      { name: "Anita Das", img: "https://randomuser.me/api/portraits/women/50.jpg", track: "Data & AI", project: "BiasDetect Tool" },
    ],
    accent: "primary" as const,
  },
];

/* ─── HERO ─── */
const HackathonHero = () => (
  <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden bg-accent/30">
    <div className="absolute inset-0 -z-10">
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-[hsl(33,100%,50%)]/5 blur-[80px]" />
    </div>

    <div className="container px-4 md:px-6">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        {/* Left — Copy */}
        <div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <SectionBadge label="Hackathons" icon={Code} className="mb-6" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold font-display leading-[1.08] mb-6 tracking-tight"
          >
            Build. Compete.
            <br />
            <span className="gradient-text">Get Hired.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed"
          >
            Prove your skills through real challenges.<br className="hidden md:block" /> Get noticed without a résumé.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="flex flex-wrap gap-3 mb-8">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-12 px-6">
              Register Now <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground gap-2 h-12 px-6">
              <Trophy className="h-4 w-4" /> View Past Winners
            </Button>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            {[
              { icon: Users, text: "15,000+ participants" },
              { icon: Shield, text: "200+ hiring partners" },
              { icon: Trophy, text: "₹25L+ in prizes" },
            ].map((chip) => (
              <span key={chip.text} className="inline-flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-full bg-muted">
                <chip.icon className="h-3.5 w-3.5 text-primary" />
                {chip.text}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Right — Video Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="relative hidden lg:block"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl group cursor-pointer">
            <img src={hackathonHero} alt="Hackathon event" className="w-full h-full object-cover aspect-video" />
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
              <span className="text-[11px] text-primary-foreground/90 bg-foreground/30 backdrop-blur-sm rounded-full px-2.5 py-1 font-medium">Season #4</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

/* ─── Animated Countdown Digit ─── */
const CountdownDigit = ({ value }: { value: number }) => {
  const display = String(value).padStart(2, "0");
  return (
    <div className="text-center">
      <AnimatePresence mode="wait">
        <motion.span
          key={display}
          initial={{ y: -20, opacity: 0, filter: "blur(4px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: 20, opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="block text-3xl md:text-4xl font-bold font-display text-primary-foreground tabular-nums leading-none"
        >
          {display}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

/* ─── Season 4 Image Carousel ─── */
const spotlightImages = [hackathonHero, hackathonEvent1, hackathonEvent2];

const SpotlightCarousel = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((p) => (p + 1) % spotlightImages.length), 4000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.img
          key={idx}
          src={spotlightImages[idx]}
          alt="Season 4 hackathon"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {spotlightImages.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? "w-5 bg-primary-foreground" : "w-1.5 bg-primary-foreground/40"}`} />
        ))}
      </div>
    </div>
  );
};

/* ─── Company logos for marquee ─── */
const partnerLogos = [
  { name: "Google", logo: "https://www.google.com/s2/favicons?domain=google.com&sz=64" },
  { name: "Microsoft", logo: "https://www.google.com/s2/favicons?domain=microsoft.com&sz=64" },
  { name: "Amazon", logo: "https://www.google.com/s2/favicons?domain=amazon.com&sz=64" },
  { name: "Razorpay", logo: "https://www.google.com/s2/favicons?domain=razorpay.com&sz=64" },
  { name: "Flipkart", logo: "https://www.google.com/s2/favicons?domain=flipkart.com&sz=64" },
  { name: "Swiggy", logo: "https://www.google.com/s2/favicons?domain=swiggy.com&sz=64" },
  { name: "PhonePe", logo: "https://www.google.com/s2/favicons?domain=phonepe.com&sz=64" },
  { name: "Infosys", logo: "https://www.google.com/s2/favicons?domain=infosys.com&sz=64" },
  { name: "Walmart", logo: "https://www.google.com/s2/favicons?domain=walmart.com&sz=64" },
  { name: "Deloitte", logo: "https://www.google.com/s2/favicons?domain=deloitte.com&sz=64" },
];
const doubledLogos = [...partnerLogos, ...partnerLogos];

/* ─── Current Spotlight ─── */
const CurrentSpotlight = () => {
  const deadlineDate = new Date("2025-08-15T00:00:00");
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = deadlineDate.getTime() - Date.now();
      if (diff <= 0) { setCountdown({ days: 0, hours: 0, mins: 0, secs: 0 }); return; }
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / (1000 * 60)) % 60),
        secs: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 text-center flex flex-col items-center">
          <SectionBadge label="Season 4 — Now Open" icon={Trophy} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl bg-primary overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row">
            {/* Left — Content */}
            <div className="flex-1 p-6 md:p-8 lg:p-10 flex flex-col justify-center gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-foreground/10 text-xs font-bold text-primary-foreground tracking-wider uppercase">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
                    <span className="relative rounded-full h-2 w-2 bg-green-400" />
                  </span>
                  Registration Live
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-foreground/10 text-xs font-semibold text-primary-foreground">
                  <Flame className="h-3.5 w-3.5 text-orange-300" /> Free Entry
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display text-primary-foreground leading-tight">
                Code Arena ·<br /><span className="text-primary-foreground/75">Season 4</span>
              </h2>
              <p className="text-primary-foreground/70 text-sm md:text-base max-w-lg leading-relaxed">
            <span className="block">Build AI tools for real hiring challenges.</span>
            <span className="block">Create something that matters.</span>
          </p>

              {/* Info pills — white bg */}
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: Calendar, text: "Aug 15–17, 2025" },
                  { icon: Laptop, text: "Online · Global" },
                  { icon: Users, text: "Teams of 1–4" },
                  { icon: Zap, text: "48hrs + 2wk build" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary-foreground text-primary text-xs font-medium">
                    <Icon className="h-3.5 w-3.5" />
                    {text}
                  </div>
                ))}
              </div>

              {/* Animated Countdown */}
              <div className="flex items-center gap-4">
                {[
                  { value: countdown.days, label: "DAYS" },
                  { value: countdown.hours, label: "HOURS" },
                  { value: countdown.mins, label: "MINS" },
                  { value: countdown.secs, label: "SECS" },
                ].map(({ value, label }, i) => (
                  <div key={label} className="flex items-center gap-4">
                    <div className="text-center">
                      <CountdownDigit value={value} />
                      <span className="text-[10px] text-primary-foreground/50 uppercase tracking-wider font-medium mt-1 block">{label}</span>
                    </div>
                    {i < 3 && <span className="text-2xl font-light text-primary-foreground/20 -mt-4">:</span>}
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-3">
                <Button size="default" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 gap-2 font-bold h-10 px-6 shadow-xl rounded-xl text-sm">
                  Register Now <ArrowRight className="h-5 w-5" />
                </Button>
                <span className="text-primary-foreground/50 text-sm mt-3 sm:mt-0 sm:self-center">2,340+ already registered</span>
              </div>

              {/* Channel Partner highlight */}
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary-foreground/[0.08] border border-primary-foreground/10 w-fit">
                <div className="h-7 w-7 rounded-md bg-primary-foreground flex items-center justify-center shrink-0">
                  <Zap className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-primary-foreground/50 uppercase tracking-wider font-medium">Channel Partner</p>
                  <p className="text-sm font-bold text-primary-foreground">I Am Talento</p>
                </div>
              </div>
            </div>

            {/* Right — Image Carousel */}
            <div className="lg:w-[42%] min-h-[250px] lg:min-h-0 p-2 lg:p-3">
              <SpotlightCarousel />
            </div>
          </div>

        </motion.div>

        {/* Company logos marquee — below banner */}
        <div className="relative mt-4 py-3 overflow-hidden rounded-xl bg-card border border-border">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-card to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-card to-transparent z-10" />
          <motion.div
            className="flex w-max gap-8 items-center px-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            {doubledLogos.map((p, i) => (
              <div key={`logo-${i}`} className="flex items-center gap-2 shrink-0">
                <img src={p.logo} alt={p.name} className="h-5 w-5 object-contain" loading="lazy" />
                <span className="text-muted-foreground text-xs font-medium whitespace-nowrap">{p.name}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Prize cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6">
          {prizes.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className={`rounded-2xl p-5 text-center ${
                i === 0
                  ? "bg-primary text-primary-foreground border-2 border-primary shadow-lg"
                  : "bg-card border border-border hover:border-primary/30 transition-colors"
              }`}
            >
              <span className="text-3xl block mb-2">{p.icon}</span>
              <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${i === 0 ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{p.label}</p>
              <p className={`text-lg font-bold font-display ${i === 0 ? "text-primary-foreground" : "text-foreground"}`}>{p.value}</p>
              <p className={`text-[11px] mt-1 leading-tight ${i === 0 ? "text-primary-foreground/50" : "text-muted-foreground"}`}>{p.extra}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── Why Different — Staggered Scroll Reveal ─── */
const WhyDifferent = () => (
  <section className="py-20 md:py-28 relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,hsl(var(--primary)/0.05),transparent_60%)]" />

    <div className="container px-4 md:px-6 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center flex flex-col items-center mb-14"
      >
        <SectionBadge label="Why This Hackathon" icon={Sparkles} />
        <h2 className="text-xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3">
          Not Just a Competition.<br />
          <span className="text-primary">A Career Launchpad.</span>
        </h2>
        <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto">
            <span className="block">Build stronger work and gain real visibility.</span>
            <span className="block">Discover six distinct benefits.</span>
          </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {whyDifferent.map(({ icon: Icon, title, desc }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.5,
              delay: i * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="group relative rounded-2xl border border-border bg-card p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
          >
            {/* Large number watermark */}
            <span className="absolute top-4 right-5 text-5xl font-bold font-display text-muted-foreground/[0.06] leading-none select-none group-hover:text-primary/[0.08] transition-colors duration-300">
              {String(i + 1).padStart(2, "0")}
            </span>

            <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
              <Icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
            </div>

            <p className="font-bold font-display text-sm text-foreground mb-1.5">{title}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>

            {/* Bottom accent line on hover */}
            <div className="absolute bottom-0 left-6 right-6 h-[2px] rounded-full bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Tracks / Industries ─── */
const TracksSection = () => {
  const [activeTab, setActiveTab] = useState(0);
  const active = industryTabs[activeTab];

  return (
    <section className="py-16 md:py-20">
      <div className="container px-4 md:px-6 text-center flex flex-col items-center">
        <SectionBadge label="Tracks & Industries" icon={Code} />
        <h2 className="text-xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3">
          Pick Your Track.<br /><span className="text-primary">Show Your Best.</span>
        </h2>
        <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto mb-8">
            <span className="block">Choose from five tracks and thirty categories.</span>
            <span className="block">Find the challenge that fits.</span>
          </p>

        {/* Tab row */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {industryTabs.map((t, i) => {
            const Icon = t.icon;
            const isActive = i === activeTab;
            return (
              <button
                key={t.tab}
                onClick={() => setActiveTab(i)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-accent text-muted-foreground hover:text-foreground hover:bg-accent/80 border border-border"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.tab}
              </button>
            );
          })}
          <button className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-primary hover:bg-primary/5 transition-colors">
            View All Industries <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Sub-categories grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl w-full"
          >
            {active.categories.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group rounded-xl border border-border bg-card p-5 text-left hover:border-primary/30 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary group-hover:scale-110 transition-all duration-200">
                  <active.icon className="h-4 w-4 text-primary group-hover:text-primary-foreground transition-colors duration-200" />
                </div>
                <p className="font-bold font-display text-sm text-foreground mb-1">{cat.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{cat.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

/* ─── How It Works — Flip Card ─── */
const FLIP_INTERVAL = 3000;

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, FLIP_INTERVAL);
    return () => clearInterval(id);
  }, []);

  const step = steps[activeStep];
  const Icon = step.icon;
  const bgClass = "bg-primary";

  return (
    <section className="py-20 md:py-28">
      <div className="container px-4 md:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 text-center flex flex-col items-center">
          <SectionBadge label="How It Works" icon={Zap} />
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3">
            From Zero to<br /><span className="text-primary">Finalist in 5 Steps</span>
          </h2>
        <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto mb-8">
            <span className="block">Register, build, submit, and present your work.</span>
            <span className="block">Reach the final in five steps.</span>
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-10 items-stretch mx-auto max-w-5xl">
          {/* Flip card */}
          <div className="w-full lg:w-[340px] shrink-0 flex" style={{ perspective: "1200px" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`rounded-3xl p-8 md:p-10 ${bgClass} shadow-2xl h-full flex flex-col justify-between`}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="h-14 w-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mb-6">
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-5xl md:text-6xl font-bold font-display text-white/30 block mb-2"
                >
                  {step.step}
                </motion.span>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl md:text-2xl font-bold font-display text-white mb-3"
                >
                  {step.title}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/70 text-sm leading-relaxed"
                >
                  {step.desc}
                </motion.p>

                {/* Progress bar */}
                <div className="mt-8 h-1 rounded-full bg-white/15 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-white/60"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: FLIP_INTERVAL / 1000, ease: "linear" }}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Step list */}
          <div className="flex-1 space-y-3">
            {steps.map(({ step: s, title, desc, icon: StepIcon }, i) => {
              const isActive = i === activeStep;
              return (
                <motion.button
                  key={s}
                  onClick={() => setActiveStep(i)}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className={`w-full text-left flex items-start gap-4 rounded-2xl p-5 transition-all duration-300 ${
                    isActive
                      ? "bg-accent border-2 border-primary/20 shadow-md"
                      : "border border-border bg-card hover:border-primary/10"
                  }`}
                >
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${
                    isActive ? "bg-primary" : "bg-accent"
                  }`}>
                    <StepIcon className={`h-5 w-5 transition-colors duration-300 ${isActive ? "text-primary-foreground" : "text-primary"}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-xs font-bold ${isActive ? "text-primary" : "text-muted-foreground"}`}>{s}</span>
                      <p className="text-sm font-bold font-display text-foreground">{title}</p>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="step-indicator"
                      className="ml-auto h-2 w-2 rounded-full bg-primary shrink-0 mt-4"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─── Circle Progress Ring ─── */
const CircleProgress = ({ pct, color, delay = 0 }: { pct: number; color: string; delay?: number }) => {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true });
  const size = 80;
  const stroke = 6;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;

  return (
    <svg ref={ref} width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mb-2">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth={stroke} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={isInView ? { strokeDashoffset: circumference * (1 - pct / 100) } : {}}
        transition={{ duration: 1.5, delay: delay + 0.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
      />
      <text x="50%" y="50%" textAnchor="middle" dy="0.35em" className="fill-foreground text-sm font-bold font-display">
        {pct}%
      </text>
    </svg>
  );
};

/* ─── Judging ─── */
const JudgingSection = () => (
  <section className="py-16 md:py-20">
    <div className="container px-4 md:px-6">
      <div className="text-center mb-12">
        <SectionBadge label="Judging Criteria" icon={Shield} />
        <h2 className="text-xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3">What the Judges<br /><span className="text-primary">Are Looking For</span></h2>
        <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto">
            <span className="block">See the five dimensions behind every score.</span>
            <span className="block">Your work leads the evaluation.</span>
          </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
        {judgingCriteria.map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.div key={c.title} initial={{ opacity: 0, y: 30, scale: 0.9 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }} whileHover={{ y: -6, scale: 1.03 }}
              className="rounded-2xl border border-border bg-card p-5 md:p-6 flex flex-col items-center text-center group hover:border-primary/30 hover:shadow-lg transition-shadow">
              <motion.div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4"
                whileHover={{ rotate: [0, -8, 8, 0] }} transition={{ duration: 0.5 }}>
                <Icon className="h-5 w-5 text-primary" />
              </motion.div>
              <CircleProgress pct={c.pct} color={c.color} delay={i * 0.1} />
              <p className="font-semibold font-display text-sm mb-1">{c.title}</p>
              <p className="text-[11px] text-muted-foreground leading-snug">{c.desc}</p>
            </motion.div>
          );
        })}
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }}
        className="mt-8 rounded-xl border border-border bg-card p-4 md:p-5 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <div className="flex justify-between text-xs font-semibold mb-2"><span>Total Score Breakdown</span><span className="text-primary">100%</span></div>
          <div className="h-3 w-full rounded-full bg-muted overflow-hidden flex">
            {judgingCriteria.map((c, i) => (
              <motion.div key={c.title} initial={{ width: 0 }} whileInView={{ width: `${c.pct}%` }} viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.8 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className={`h-full first:rounded-l-full last:rounded-r-full ${i % 2 === 0 ? "bg-primary" : "bg-[hsl(33,100%,50%)]"}`} />
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          {judgingCriteria.map((c, i) => (
            <div key={c.title} className="flex items-center gap-1.5">
              <div className={`h-2.5 w-2.5 rounded-full ${i % 2 === 0 ? "bg-primary" : "bg-[hsl(33,100%,50%)]"}`} />
              <span className="text-[10px] text-muted-foreground whitespace-nowrap">{c.title.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

/* ─── Hiring Partners ─── */
const HiringPartners = () => (
  <section className="py-4 md:py-6">
    <div className="container px-4 md:px-6">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="relative overflow-hidden rounded-xl bg-primary px-8 py-8 md:px-12 md:py-10">
        <div className="absolute top-0 right-0 w-60 h-60 rounded-full bg-primary-foreground/5 -translate-y-1/3 translate-x-1/4" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-foreground/20 text-sm font-semibold text-primary-foreground mb-4">
            <Users className="h-4 w-4" /> Hiring Partners
          </div>
          <h3 className="text-xl md:text-2xl font-bold font-display text-primary-foreground mb-1 text-center">Companies Hiring From This Hackathon</h3>
          <p className="text-sm text-primary-foreground/70 mb-6 text-center">These companies have committed to interviewing top performers.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {hiringPartners.map((p, i) => (
              <motion.span key={p.name} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}
                className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-primary-foreground text-foreground text-sm font-semibold font-display">
                <img src={p.logo} alt={p.name} className="h-5 w-5 object-contain" loading="lazy" />
                {p.name}
              </motion.span>
            ))}
            <span className="px-4 py-2.5 rounded-lg bg-primary-foreground/20 text-primary-foreground text-sm font-semibold">+ 190 more</span>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

/* ─── Past Winners — 3D Headshot + Bubble Carousel ─── */
const STORY_INTERVAL = 5000;
const PastWinners = () => {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    timerRef.current = setInterval(() => setActive(p => (p + 1) % pastWinners.length), STORY_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = (i: number) => {
    setActive(i);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setActive(p => (p + 1) % pastWinners.length), STORY_INTERVAL);
  };

  const w = pastWinners[active];

  return (
    <section className="py-16 md:py-20 overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <SectionBadge label="Success Stories" icon={Quote} />
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3">Where Are<br /><span className="text-primary">They Now?</span></h2>
        <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto mb-8">
            <span className="block">Meet participants who turned work into opportunity.</span>
            <span className="block">Their progress continued after.</span>
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Background glow */}
          <div className="absolute inset-0 rounded-3xl bg-primary/5 blur-3xl scale-110" />

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-3xl border border-border bg-card overflow-hidden"
            >
              <div className="flex flex-col md:flex-row items-center md:items-stretch">

                {/* Left — 3D Headshot */}
                <div className="relative w-full md:w-[280px] shrink-0 bg-primary flex items-center justify-center py-10 md:py-0" style={{ perspective: "800px" }}>
                  {/* Floating rings */}
                  <motion.div className="absolute w-48 h-48 rounded-full border-2 border-primary-foreground/10"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.1, 0.3] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
                  <motion.div className="absolute w-64 h-64 rounded-full border border-primary-foreground/5"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.05, 0.2] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} />

                  {/* 3D Headshot */}
                  <motion.div
                    initial={{ rotateY: -20, z: -50 }}
                    animate={{ rotateY: 0, z: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformStyle: "preserve-3d" }}
                    className="relative z-10"
                  >
                    <div className="relative">
                      <motion.img
                        src={w.img}
                        alt={w.name}
                        className="h-36 w-36 md:h-44 md:w-44 rounded-full object-cover border-4 border-primary-foreground/20 shadow-2xl"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      />
                      {/* Shadow under headshot */}
                      <motion.div
                        className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-28 h-4 rounded-full bg-black/20 blur-md"
                        animate={{ scaleX: [1, 0.85, 1], opacity: [0.4, 0.25, 0.4] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </div>

                    {/* Metric badge */}
                    <motion.div
                      className="absolute -bottom-2 -right-2 bg-[hsl(33,100%,50%)] text-white rounded-xl px-3 py-1.5 shadow-lg"
                      initial={{ scale: 0, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                    >
                      <p className="text-xs font-bold">{w.metric}</p>
                      <p className="text-[9px] opacity-80">{w.metricLabel}</p>
                    </motion.div>
                  </motion.div>

                  {/* Name & season below headshot on mobile */}
                  <div className="absolute bottom-4 text-center md:hidden">
                    <p className="text-sm font-bold font-display text-primary-foreground">{w.name}</p>
                    <p className="text-[10px] text-primary-foreground/70">{w.season}</p>
                  </div>
                </div>

                {/* Right — Testimonial Bubble */}
                <div className="flex-1 p-6 md:p-10 flex flex-col justify-center relative">
                  {/* Speech bubble tail pointing left */}
                  <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[10px]">
                    <div className="w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-r-[12px] border-r-border" />
                    <div className="absolute top-[1px] left-[1px] w-0 h-0 border-t-[11px] border-t-transparent border-b-[11px] border-b-transparent border-r-[11px] border-r-card" />
                  </div>

                  {/* Stars */}
                  <motion.div
                    className="flex items-center gap-1 mb-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {[...Array(5)].map((_, j) => (
                      <motion.div key={j} initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.4 + j * 0.08, type: "spring", stiffness: 300 }}>
                        <Star className="h-4 w-4 fill-[hsl(33,100%,50%)] text-[hsl(33,100%,50%)]" />
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Bubble testimonial */}
                  <motion.div
                    className="relative rounded-2xl bg-accent/50 border border-border p-5 md:p-6 mb-5"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Quote className="h-8 w-8 text-primary/15 absolute top-3 right-3" />
                    <motion.p
                      className="text-sm md:text-base text-foreground leading-relaxed font-medium relative z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      "{w.outcome}"
                    </motion.p>
                  </motion.div>

                  {/* Name, season, company — desktop */}
                  <motion.div
                    className="hidden md:flex items-center gap-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div>
                      <p className="text-sm font-bold font-display">{w.name}</p>
                      <p className="text-xs text-muted-foreground">{w.season}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2 bg-primary/10 rounded-lg px-3 py-1.5">
                      <Briefcase className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs font-semibold text-primary">{w.company}</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dot navigation + progress */}
          <div className="flex items-center justify-center gap-3 mt-8">
            {pastWinners.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} className="relative h-3 w-3 rounded-full">
                <div className={`absolute inset-0 rounded-full transition-colors ${i === active ? "bg-primary" : "bg-muted"}`} />
                {i === active && (
                  <motion.div
                    className="absolute inset-[-3px] rounded-full border-2 border-primary"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Auto-progress bar */}
          <div className="mt-4 max-w-xs mx-auto h-1 rounded-full bg-muted overflow-hidden">
            <motion.div
              key={active}
              className="h-full bg-primary rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: STORY_INTERVAL / 1000, ease: "linear" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─── Community ─── */
const CommunitySection = () => (
  <section className="py-16 md:py-20 bg-accent/30">
    <div className="container px-4 md:px-6 text-center flex flex-col items-center">
      <SectionBadge label="Community" icon={MessageCircle} />
      <h2 className="text-xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3">You're Not<br /><span className="text-primary">Competing Alone</span></h2>
        <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto mb-8">
            <span className="block">Build alongside mentors, peers, and experts.</span>
            <span className="block">Collaboration keeps you moving.</span>
          </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {communityPerks.map(({ icon: Icon, text }, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
            className={`rounded-xl p-5 flex items-start gap-3 ${i === 0 ? "bg-primary text-primary-foreground" : "border border-border bg-card hover:border-primary/30 transition-colors"}`}>
            <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${i === 0 ? "bg-primary-foreground/20" : "bg-accent"}`}>
              <Icon className={`h-4 w-4 ${i === 0 ? "text-primary-foreground" : "text-primary"}`} />
            </div>
            <p className={`text-sm font-medium ${i === 0 ? "text-primary-foreground" : ""}`}>{text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Past Seasons — Premium Redesign ─── */
const Confetti = () => {
  const particles = Array.from({ length: 24 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    size: 4 + Math.random() * 6,
    color: i % 3 === 0 ? "hsl(var(--primary))" : i % 3 === 1 ? "hsl(33,100%,50%)" : "hsl(48,100%,50%)",
    rotate: Math.random() * 360,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{ left: `${p.x}%`, width: p.size, height: p.size * 0.6, backgroundColor: p.color, rotate: p.rotate }}
          initial={{ top: "-5%", opacity: 1 }}
          animate={{ top: "110%", opacity: 0, rotate: p.rotate + 360 }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, repeatDelay: 3, ease: "easeIn" }}
        />
      ))}
    </div>
  );
};

const PastHackathons = () => (
  <section className="py-20 md:py-28 overflow-hidden relative">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,hsl(var(--primary)/0.04),transparent_50%)]" />

    <div className="container px-4 md:px-6 relative z-10">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14 text-center flex flex-col items-center">
        <SectionBadge label="Past Seasons" icon={Trophy} />
        <h2 className="text-xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3">
          Three Seasons. Thousands of<br />
          <span className="text-primary">Careers Accelerated.</span>
        </h2>
        <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto mb-8">
            <span className="block">Explore past projects, winners, and outcomes.</span>
            <span className="block">See the impact beyond prizes.</span>
          </p>
      </motion.div>

      <div className="space-y-8">
        {pastSeasons.map((s, i) => {
          const isOrange = s.accent === "orange";
          const bgClass = isOrange
            ? "bg-[hsl(33,100%,50%)]"
            : "bg-primary";

          return (
            <motion.div
              key={s.season}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-3xl overflow-hidden border border-border bg-card shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex flex-col lg:flex-row">
                {/* Left — Winner + Runner-ups */}
                <div className={`relative lg:w-[300px] shrink-0 ${bgClass} flex flex-col items-center justify-center p-8`}>
                  {i === 0 && <Confetti />}
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }} />

                  <div className="relative z-10 text-center">
                    {/* Winner */}
                    <div className="relative inline-block mb-3">
                      <img src={s.winner.img} alt={s.winner.name} className="h-28 w-28 rounded-2xl object-cover border-4 border-white/30 shadow-xl" />
                      <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-md">
                        <Trophy className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <p className="text-white font-bold font-display text-sm">{s.winner.name}</p>
                    <p className="text-white/60 text-[11px]">{s.winner.track}</p>
                    <p className="text-white/80 text-[10px] mt-1 font-medium px-2 py-0.5 rounded-full bg-white/10 inline-block">{s.winner.project}</p>

                    {/* Runner-ups */}
                    <div className="mt-5 pt-4 border-t border-white/15">
                      <p className="text-white/50 text-[10px] font-bold uppercase tracking-wider mb-3">Runner-ups</p>
                      <div className="flex items-center justify-center gap-3">
                        {s.runnerUps.map((r) => (
                          <div key={r.name} className="text-center">
                            <img src={r.img} alt={r.name} className="h-12 w-12 rounded-xl object-cover border-2 border-white/20 mx-auto mb-1.5" />
                            <p className="text-white text-[10px] font-semibold leading-tight">{r.name.split(" ")[0]}</p>
                            <p className="text-white/50 text-[9px]">{r.track}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right — Details */}
                <div className="flex-1 p-8 lg:p-10 flex flex-col justify-between gap-5">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-2xl md:text-3xl font-bold font-display text-foreground">{s.season}</h3>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold text-white tracking-wider uppercase ${bgClass}`}>
                          Completed
                        </span>
                      </div>
                      <p className={`text-lg font-bold font-display ${isOrange ? "text-[hsl(33,100%,50%)]" : "text-primary"}`}>
                        {s.hackathonTitle}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{s.date}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{s.duration}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{s.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-accent border border-border shrink-0">
                      <img src={s.conductorLogo} alt={s.conductor} className="h-7 w-7 object-contain" />
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Conducted by</p>
                        <p className="text-sm font-bold text-foreground">{s.conductor}</p>
                      </div>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { value: s.participants, label: "Participants" },
                      { value: s.prizes, label: "Prize Pool", highlight: true },
                      { value: s.hired, label: "Got Hired" },
                      { value: s.projects, label: "Projects Built" },
                    ].map((m) => (
                      <div key={m.label} className={`rounded-xl p-4 text-center ${m.highlight ? bgClass : "bg-accent"}`}>
                        <p className={`text-2xl font-bold font-display ${m.highlight ? "text-white" : "text-foreground"}`}>{m.value}</p>
                        <p className={`text-[11px] mt-0.5 font-medium ${m.highlight ? "text-white/70" : "text-muted-foreground"}`}>{m.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Winning project highlight */}
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-accent border border-border">
                    <div className={`h-8 w-8 rounded-lg ${bgClass} flex items-center justify-center shrink-0`}>
                      <Award className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Winning Project</p>
                      <p className="text-sm font-bold text-foreground">{s.winner.project}</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                        <Zap className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">I Am Talento</p>
                        <p className="text-[10px] text-muted-foreground">Official Platform Partner</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                      View Winners <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

/* ─── FAQ Section ─── */
const hackathonFaqs = [
  { q: "Who can participate in the hackathon?", a: "Anyone — students, working professionals, freelancers, and career switchers. All skill levels are welcome. You can participate solo or in a team of up to 4." },
  { q: "Is registration free?", a: "Yes! Registration is completely free. You only need to sign up on I Am Talento and register for the hackathon." },
  { q: "How are teams formed?", a: "You can form your own team or use our smart team-matching algorithm that pairs you with people who have complementary skills." },
  { q: "What tools or tech stack can I use?", a: "You're free to use any programming language, framework, or tool. There are no restrictions on your tech stack." },
  { q: "How is the hackathon judged?", a: "Projects are evaluated on Innovation (30%), Technical Execution (25%), Business Impact (20%), Design & UX (15%), and Presentation (10%) by industry experts." },
  { q: "Do employers really watch the hackathon?", a: "Yes — 200+ hiring managers from top companies observe submissions in real time. Outstanding teams receive direct interview invitations." },
  { q: "What do I get if I don't win?", a: "Every participant receives a verified certificate, a profile boost, and their submitted project is added to their I Am Talento profile for employer visibility." },
  { q: "Can I participate from anywhere?", a: "Absolutely. The hackathon is fully online and open to participants globally. All you need is a laptop and an internet connection." },
];

const HackathonFAQ = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="py-16 md:py-20">
      <div className="container px-4 md:px-6 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <SectionBadge label="FAQ" icon={MessageCircle} />
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15] mt-4 mb-3">
            Questions Builders Ask<br /><span className="text-primary">Before They Register</span>
          </h2>
          <p className="text-muted-foreground text-sm">Get clear answers about eligibility, teams, judging, deadlines, and what happens after submission —<br className="hidden md:block" />register with confidence.</p>
        </motion.div>

        <div className="space-y-3">
          {hackathonFaqs.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="rounded-xl border border-border bg-card overflow-hidden"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-4 md:p-5 text-left hover:bg-accent/50 transition-colors"
                >
                  <span className="text-sm md:text-base font-semibold text-foreground">{faq.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0 text-muted-foreground text-lg font-light"
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="px-4 md:px-5 pb-4 md:pb-5 text-sm text-muted-foreground leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ─── Final CTA ─── */
const FinalCTA = () => (
  <section className="py-16 md:py-20">
    <div className="container px-4 md:px-6">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="rounded-xl bg-accent p-8 md:p-12 text-center">
        <Trophy className="h-10 w-10 text-primary mx-auto mb-4" />
        <h2 className="text-xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3">Ready to Build?<br /><span className="text-primary">Get Noticed</span></h2>
        <p className="text-muted-foreground text-sm md:text-lg mb-6 max-w-2xl mx-auto">
            <span className="block">Create real projects and learn from experts.</span>
            <span className="block">Registration is free for everyone.</span>
          </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button className="bg-[hsl(33,100%,50%)] text-primary-foreground hover:bg-[hsl(33,100%,45%)] border-0 gap-2">Register Now — It's Free <ArrowRight className="h-4 w-4" /></Button>
          <Link to="/contact">
            <Button variant="outline" className="gap-2">Host a Hackathon <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

/* ─── Page ─── */
const Hackathons = () => (
  <>
    <Helmet>
      <title>Hackathons — Build, Compete & Get Hired | I Am Talento</title>
      <meta name="description" content="I Am Talento Hackathons — the fastest way to prove your skills, get noticed by 200+ hiring partners, and land real opportunities." />
    </Helmet>
    <Layout>
      <HackathonHero />
      <HackathonScheduleSection />
      <HackathonSocialProof />
      <HowItWorks />
      <CurrentSpotlight />
      <PastHackathons />
      <TicketCarousel />
      
      <WhyDifferent />
      <TracksSection />
      <JudgingSection />
      <HiringPartners />
      <PastWinners />
      <CommunitySection />
      <HackathonFAQ />
      <FinalCTA />
    </Layout>
  </>
);

export default Hackathons;
