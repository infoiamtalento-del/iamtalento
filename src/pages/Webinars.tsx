import { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SectionBadge from "@/components/ui/section-badge";
import { motion, useInView, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";
import {
  Calendar, Clock, Users, ArrowRight, Globe, Star, CheckCircle,
  Play, Mic, Monitor, BookOpen, TrendingUp, Sparkles, Target,
  FileText, Award, Zap, Quote, Package, Shield, Eye,
  Laptop, BarChart3, Palette, Sprout, Code
} from "lucide-react";

import webinarHero from "@/assets/webinar-hero.jpg";
import webinarHeroPerson from "@/assets/webinar-hero-person.jpg";
import WebinarSocialProof from "@/components/webinars/WebinarSocialProof";
import WebinarScheduleSection from "@/components/webinars/WebinarScheduleSection";
import webinarSpeaker1 from "@/assets/webinar-speaker-1.jpg";
import webinarSpeaker2 from "@/assets/webinar-speaker-2.jpg";
import webinarSpeaker3 from "@/assets/webinar-speaker-3.jpg";
import webinarSpeaker4 from "@/assets/webinar-speaker-4.jpg";
import webinarSpeaker5 from "@/assets/webinar-speaker-5.jpg";
import webinarSpeaker6 from "@/assets/webinar-speaker-6.jpg";
import webinarCover1 from "@/assets/webinar-cover-1.jpg";
import webinarCover2 from "@/assets/webinar-cover-2.jpg";
import webinarCover3 from "@/assets/webinar-cover-3.jpg";
import webinarCover4 from "@/assets/webinar-cover-4.jpg";
import webinarCover5 from "@/assets/webinar-cover-5.jpg";
import webinarCover6 from "@/assets/webinar-cover-6.jpg";

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
const categories = ["All", "Tech Skills", "Soft Skills", "Domain Knowledge", "Job Search Strategy", "Leadership"];

const webinars = [
  { title: "AI Tools Every Professional Must Know in 2025", desc: "Discover the latest AI tools transforming workflows across industries and learn how to leverage them for career growth.", date: "Apr 12", time: "6PM IST", speaker: "Priya Nair", credentials: "AI Consultant, ex-Google", duration: "90 min", seats: 47, price: "Free", certificate: true, image: webinarSpeaker1, cover: webinarCover1, category: "Tech Skills" },
  { title: "Full-Stack Career Roadmap: Junior to Senior in 24 Months", desc: "A step-by-step guide to accelerating your engineering career with the right projects, skills, and visibility.", date: "Apr 15", time: "7PM IST", speaker: "Rahul Mehta", credentials: "Engineering Lead, Swiggy", duration: "75 min", seats: 210, price: "Free", certificate: false, image: webinarSpeaker2, cover: webinarCover2, category: "Tech Skills" },
  { title: "Digital Marketing Mastery: SEO + Performance + Brand", desc: "Master the trifecta of digital marketing and learn strategies used by top D2C brands to scale.", date: "Apr 18", time: "6PM IST", speaker: "Ananya Verma", credentials: "CMO, D2C Brand", duration: "90 min", seats: 150, price: "₹299", certificate: true, image: webinarSpeaker3, cover: webinarCover3, category: "Domain Knowledge" },
  { title: "Interview Confidence Blueprint", desc: "Build unshakeable confidence with proven frameworks for behavioral and technical interviews.", date: "Apr 20", time: "5PM IST", speaker: "Vikram Rao", credentials: "Interview Coach", duration: "60 min", seats: 300, price: "Free", certificate: false, image: webinarSpeaker4, cover: webinarCover4, category: "Job Search Strategy" },
  { title: "Finance Careers in 2025: What's Hot, What's Not", desc: "Navigate the shifting finance landscape and identify the roles with the highest demand and growth potential.", date: "Apr 22", time: "7PM IST", speaker: "CA Nisha Kapoor", credentials: "Finance Expert", duration: "75 min", seats: 89, price: "Free", certificate: false, image: webinarSpeaker5, cover: webinarCover5, category: "Domain Knowledge" },
  { title: "Leadership Skills for Mid-Level Managers", desc: "Learn the essential leadership and communication skills that separate managers from true leaders.", date: "Apr 25", time: "6PM IST", speaker: "Deepak Sharma", credentials: "VP Operations", duration: "90 min", seats: 200, price: "₹499", certificate: true, image: webinarSpeaker6, cover: webinarCover6, category: "Leadership" },
];

const howItWorks = [
  { step: "01", title: "Register", desc: "Pick your webinar and secure your seat in under 60 seconds.", icon: CheckCircle },
  { step: "02", title: "Get Pre-Read", desc: "We send you context material 24 hours before so you arrive prepared.", icon: FileText },
  { step: "03", title: "Attend Live", desc: "Interact, ask questions, participate in polls, and learn in real time.", icon: Play },
  { step: "04", title: "Get Certified", desc: "Download your certificate and auto-add it to your I Am Talento profile.", icon: Award },
];

const differentiators = [
  { icon: Target, title: "Industry-Benchmarked Content", desc: "Every topic is chosen based on real skill gaps identified across 10,000+ candidates." },
  { icon: Zap, title: "Live Skill Challenges", desc: "Mid-session exercises test your understanding. Your score gets recorded on your profile." },
  { icon: CheckCircle, title: "Verified Expert Speakers", desc: "No influencers, no theory-only coaches — only practitioners with proven track records.", highlight: true },
  { icon: FileText, title: "Post-Webinar Action Kit", desc: "Templates, frameworks, checklists, and a 30-day implementation roadmap." },
  { icon: Award, title: "Recognized Certificates", desc: "Visible on your profile — employers can verify them in one click." },
  { icon: Users, title: "Small Cohorts", desc: "Sessions capped at 300 to ensure real interaction — not just watching." },
];

const webinarIndustryTabs = [
  {
    tab: "Tech & Engineering", icon: Laptop,
    categories: [
      { title: "System Design", desc: "Architecture, scaling, microservices" },
      { title: "Full Stack Development", desc: "React, Node.js, APIs, databases" },
      { title: "Cloud & DevOps", desc: "AWS, Docker, Kubernetes, CI/CD" },
      { title: "Mobile Engineering", desc: "iOS, Android, React Native, Flutter" },
      { title: "Cybersecurity", desc: "Pentesting, SIEM, threat modeling" },
      { title: "Blockchain & Web3", desc: "Smart contracts, DApps, DeFi" },
    ],
  },
  {
    tab: "Data & AI", icon: BarChart3,
    categories: [
      { title: "Machine Learning", desc: "Supervised, unsupervised, deep learning" },
      { title: "Data Engineering", desc: "Pipelines, ETL, Spark, Airflow" },
      { title: "NLP & LLMs", desc: "Transformers, RAG, prompt engineering" },
      { title: "Analytics & BI", desc: "Dashboards, SQL, Tableau, Power BI" },
      { title: "Computer Vision", desc: "Object detection, image segmentation" },
      { title: "MLOps", desc: "Model deployment, monitoring, versioning" },
    ],
  },
  {
    tab: "Design & UX", icon: Palette,
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
    tab: "Business & Strategy", icon: TrendingUp,
    categories: [
      { title: "Product Management", desc: "Roadmaps, PRDs, prioritization" },
      { title: "Growth Marketing", desc: "SEO, paid ads, funnel optimization" },
      { title: "Business Analysis", desc: "Requirements, process mapping, KPIs" },
      { title: "Consulting", desc: "Strategy frameworks, market sizing" },
      { title: "Leadership", desc: "Team management, strategic thinking" },
      { title: "Entrepreneurship", desc: "Pitch decks, GTM, fundraising" },
    ],
  },
  {
    tab: "Social Impact", icon: Sprout,
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

const attendeeStories = [
  { name: "Meera Joshi", role: "Business Analyst", quote: "Attended the Excel webinar on a Sunday. By Wednesday, I had automated 3 reports. My manager noticed immediately.", img: "https://randomuser.me/api/portraits/women/33.jpg" },
  { name: "Arjun Nair", role: "Software Developer", quote: "The System Design webinar gave me a framework I used directly in my next interview. Got the offer.", img: "https://randomuser.me/api/portraits/men/22.jpg" },
  { name: "Tanya Bose", role: "Fresh Graduate", quote: "I had zero confidence before the Interview Blueprint webinar. Two weeks later I had my first job.", img: "https://randomuser.me/api/portraits/women/68.jpg" },
];

const speakers = [
  { name: "Priya Nair", designation: "AI Consultant", company: "ex-Google", companyLogo: "https://www.google.com/s2/favicons?domain=google.com&sz=64", speciality: ["AI", "ML"], webinar: "AI Tools for Professionals", rating: 4.9, image: webinarSpeaker1, tab: "Tech" },
  { name: "Rahul Mehta", designation: "Engineering Lead", company: "Swiggy", companyLogo: "https://www.google.com/s2/favicons?domain=swiggy.com&sz=64", speciality: ["Full-Stack"], webinar: "Junior to Senior Roadmap", rating: 4.8, image: webinarSpeaker2, tab: "Tech" },
  { name: "Ananya Verma", designation: "CMO", company: "D2C Brand", companyLogo: "https://www.google.com/s2/favicons?domain=shopify.com&sz=64", speciality: ["Marketing", "SEO"], webinar: "Digital Marketing Mastery", rating: 4.7, image: webinarSpeaker3, tab: "Marketing" },
  { name: "Vikram Rao", designation: "Interview Coach", company: "Independent", companyLogo: "https://www.google.com/s2/favicons?domain=linkedin.com&sz=64", speciality: ["Interviews"], webinar: "Interview Blueprint", rating: 4.9, image: webinarSpeaker4, tab: "Coaching" },
];

const bundles = [
  { title: "Tech Career Accelerator", count: 5, price: "₹999", worth: "₹2,499" },
  { title: "Job Search Masterclass", count: 4, price: "₹799", worth: "₹1,999" },
  { title: "Leadership Fast Track", count: 4, price: "₹899", worth: "₹1,999" },
];

/* ─── HERO ─── */
const WebinarHero = () => (
  <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden bg-accent/30">
    <div className="absolute inset-0 -z-10">
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-[hsl(33,100%,50%)]/5 blur-[80px]" />
    </div>

    <div className="container px-4 md:px-6">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <SectionBadge label="Webinars" icon={Monitor} className="mb-6" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold font-display leading-[1.08] mb-6 tracking-tight"
          >
            Learn From the Best.
            <br />
            <span className="gradient-text">Apply It the Same Day.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed"
          >
            Deep-dive webinars on skills, hiring, and career growth — taught by verified industry experts.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="flex flex-wrap gap-3 mb-10">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-12 px-6 rounded-xl">
              Register for Next Webinar <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground gap-2 h-12 px-6 rounded-xl">
              <Calendar className="h-4 w-4" /> View Full Calendar
            </Button>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {[
              { icon: Monitor, text: "120+ webinars hosted" },
              { icon: Users, text: "85,000+ attendees" },
              { icon: Star, text: "4.8/5 avg rating" },
            ].map((chip) => (
              <span key={chip.text} className="inline-flex items-center gap-1.5 px-3 py-2 font-medium rounded-full bg-background border border-border">
                <chip.icon className="h-3.5 w-3.5 text-primary" />
                {chip.text}
              </span>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="relative hidden lg:block"
        >
          <div className="relative overflow-hidden rounded-2xl group cursor-pointer shadow-2xl" style={{ aspectRatio: "16 / 9" }}>
            <img src={webinarHeroPerson} alt="Expert conducting a webinar" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-foreground/10 group-hover:bg-foreground/20 transition-colors duration-300" />
            <motion.div whileHover={{ scale: 1.1 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 rounded-full bg-primary flex items-center justify-center shadow-xl">
              <Play className="h-7 w-7 text-primary-foreground fill-primary-foreground ml-0.5" />
            </motion.div>
            <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm px-4 py-3 shadow-lg rounded-xl border border-border">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mic className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground">Expert-Led Sessions</p>
                  <p className="text-xs font-bold text-primary">Live & Interactive</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);


/* ─── Upcoming Webinars ─── */
const UpcomingWebinars = () => {
  const [cat, setCat] = useState("All");
  const filtered = (cat === "All" ? webinars : webinars.filter(w => w.category === cat)).slice(0, 3);
  return (
    <section id="upcoming" className="py-20 md:py-24 bg-accent/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <SectionBadge label="Upcoming Webinars" icon={Calendar} />
          <h2 className="text-3xl md:text-4xl font-bold font-display mt-4 mb-3">What's Coming Up</h2>
          <p className="text-muted-foreground text-base max-w-md mx-auto">All webinars are live, interactive, and include Q&A.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map(c => (
            <button key={c} onClick={() => setCat(c)} className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${cat === c ? "bg-primary text-primary-foreground shadow-md" : "bg-background border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"}`}>{c}</button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={cat} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filtered.map((w, i) => (
              <motion.div key={w.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
                <div className="relative h-52 overflow-hidden">
                  <img src={w.cover} alt={w.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <Badge className="bg-primary text-primary-foreground border-0 text-[10px] font-bold shadow-md px-2.5 py-1">{w.date} · {w.time}</Badge>
                    {w.certificate && <Badge className="bg-[hsl(33,100%,50%)] text-white border-0 text-[10px] font-bold shadow-md px-2.5 py-1">Certificate</Badge>}
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="text-[11px] bg-background/90 backdrop-blur-sm text-foreground rounded-full px-3 py-1.5 flex items-center gap-1.5 font-semibold shadow-sm">
                      <Clock className="h-3.5 w-3.5 text-primary" />{w.duration}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <span className="inline-flex self-start items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-primary/10 text-primary mb-3">{w.category}</span>
                  <h3 className="font-bold font-display text-base leading-snug mb-4 line-clamp-2 group-hover:text-primary transition-colors">{w.title}</h3>

                  <div className="flex items-center gap-3 mb-4">
                    <img src={w.image} alt={w.speaker} className="h-11 w-11 rounded-full object-cover object-top shrink-0 ring-2 ring-primary/20" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold font-display truncate">{w.speaker}</p>
                      <p className="text-xs text-muted-foreground truncate">{w.credentials}</p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-2">{w.desc}</p>

                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-5 pb-4 border-b border-border">
                      <span className={`text-base font-bold ${w.price === "Free" ? "text-[hsl(152,60%,45%)]" : "text-foreground"}`}>{w.price === "Free" ? "Free" : w.price}</span>
                      <span className="text-xs text-muted-foreground font-medium">{w.seats} seats left</span>
                    </div>
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border-0 gap-2 h-11 text-sm font-bold rounded-xl">
                      Register Now <ArrowRight className="h-4 w-4" />
                    </Button>
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

/* ─── How It Works — Flip Card ─── */
const WEBINAR_FLIP_INTERVAL = 3000;

const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % howItWorks.length);
    }, WEBINAR_FLIP_INTERVAL);
    return () => clearInterval(id);
  }, []);

  const step = howItWorks[activeStep];
  const Icon = step.icon;

  return (
    <section className="py-20 md:py-24">
      <div className="container px-4 md:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14 text-center flex flex-col items-center">
          <SectionBadge label="How It Works" icon={Zap} />
          <h2 className="text-3xl md:text-4xl font-bold font-display mt-4 mb-3">
            From Registration to<br /><span className="text-primary">Real Skill in 4 Steps</span>
          </h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-10 items-stretch mx-auto max-w-5xl">
          <div className="w-full lg:w-[360px] shrink-0 flex" style={{ perspective: "1200px" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-3xl p-10 bg-primary shadow-2xl h-full flex flex-col justify-between w-full"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="h-14 w-14 rounded-2xl bg-primary-foreground/15 backdrop-blur-sm flex items-center justify-center mb-8">
                  <Icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="text-6xl font-bold font-display text-primary-foreground/25 block mb-3">{step.step}</motion.span>
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="text-2xl font-bold font-display text-primary-foreground mb-3">{step.title}</motion.p>
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                  className="text-primary-foreground/70 text-sm leading-relaxed">{step.desc}</motion.p>
                <div className="mt-10 h-1 rounded-full bg-primary-foreground/15 overflow-hidden">
                  <motion.div className="h-full rounded-full bg-primary-foreground/60"
                    initial={{ width: "0%" }} animate={{ width: "100%" }}
                    transition={{ duration: WEBINAR_FLIP_INTERVAL / 1000, ease: "linear" }} />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex-1 space-y-3">
            {howItWorks.map(({ step: s, title, desc, icon: StepIcon }, i) => {
              const isActive = i === activeStep;
              return (
                <motion.button key={s} onClick={() => setActiveStep(i)}
                  initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  className={`w-full text-left flex items-start gap-4 rounded-2xl p-5 transition-all duration-300 ${isActive ? "bg-accent border-2 border-primary/20 shadow-md" : "border border-border bg-card hover:border-primary/10"}`}>
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${isActive ? "bg-primary" : "bg-accent"}`}>
                    <StepIcon className={`h-5 w-5 transition-colors duration-300 ${isActive ? "text-primary-foreground" : "text-primary"}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold ${isActive ? "text-primary" : "text-muted-foreground"}`}>{s}</span>
                      <p className="text-sm font-bold font-display text-foreground">{title}</p>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                  {isActive && (
                    <motion.div layoutId="webinar-step-indicator"
                      className="ml-auto h-2.5 w-2.5 rounded-full bg-primary shrink-0 mt-4"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }} />
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

/* ─── Differentiators — Bento Grid ─── */
const DifferentiatorsSection = () => (
  <section className="py-20 md:py-24 bg-accent/30">
    <div className="container px-4 md:px-6">
      <div className="text-center mb-14">
        <SectionBadge label="Why We're Different" icon={Sparkles} />
        <h2 className="text-3xl md:text-4xl font-bold font-display mt-4 mb-3">Not Another Boring Webinar.<br /><span className="text-primary">Here's Why.</span></h2>
        <p className="text-muted-foreground text-base max-w-md mx-auto">Every session is designed to deliver real, measurable career impact.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {differentiators.map(({ icon: Icon, title, desc, highlight }, i) => (
          <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
            className={`rounded-2xl p-7 text-center transition-all duration-300 ${highlight ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20" : "bg-card border border-border hover:border-primary/20 hover:shadow-lg hover:-translate-y-0.5"}`}>
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center mx-auto mb-5 ${highlight ? "bg-primary-foreground/20" : "bg-accent"}`}>
              <Icon className={`h-5 w-5 ${highlight ? "text-primary-foreground" : "text-primary"}`} />
            </div>
            <p className="font-bold font-display text-base mb-2">{title}</p>
            <p className={`text-sm leading-relaxed ${highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Industries & Categories ─── */
const IndustriesSection = () => {
  const [activeTab, setActiveTab] = useState(0);
  const active = webinarIndustryTabs[activeTab];

  return (
    <section className="py-20 md:py-24">
      <div className="container px-4 md:px-6 text-center flex flex-col items-center">
        <SectionBadge label="Topics & Industries" icon={Code} />
        <h2 className="text-3xl md:text-4xl font-bold font-display mt-4 mb-3">
          A Webinar for Every<br /><span className="text-primary">Domain You Work In</span>
        </h2>
        <p className="text-muted-foreground max-w-lg text-base mb-10">
          Choose from 5 industry tracks and 30+ topics covered by expert practitioners.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {webinarIndustryTabs.map((t, i) => {
            const TabIcon = t.icon;
            const isActive = i === activeTab;
            return (
              <button key={t.tab} onClick={() => setActiveTab(i)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive ? "bg-primary text-primary-foreground shadow-md" : "bg-background text-muted-foreground hover:text-foreground border border-border hover:border-primary/30"}`}>
                <TabIcon className="h-4 w-4" />{t.tab}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-2 md:grid-cols-3 gap-5 max-w-4xl w-full">
            {active.categories.map((cat, i) => (
              <motion.div key={cat.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="group rounded-2xl border border-border bg-card p-6 text-left hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-200">
                  <active.icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors duration-200" />
                </div>
                <p className="font-bold font-display text-sm text-foreground mb-1.5">{cat.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{cat.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

/* ─── Attendee Stories ─── */
const AttendeeStories = () => (
  <section className="py-20 md:py-24 bg-accent/30">
    <div className="container px-4 md:px-6">
      <div className="text-center mb-14">
        <SectionBadge label="Real Outcomes" icon={TrendingUp} />
        <h2 className="text-3xl md:text-4xl font-bold font-display mt-4 mb-3">They Attended. <span className="text-primary">They Grew.</span></h2>
        <p className="text-muted-foreground text-base max-w-lg mx-auto">Thousands of professionals have transformed their careers after attending our expert-led webinars.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {attendeeStories.map((t, i) => (
          <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="rounded-2xl border border-border bg-card p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <Quote className="h-8 w-8 text-primary/15 mb-4" />
            <p className="text-sm text-foreground leading-relaxed mb-6">"{t.quote}"</p>
            <div className="flex items-center gap-1 mb-4">{[...Array(5)].map((_, j) => <Star key={j} className="h-3.5 w-3.5 fill-[hsl(33,100%,50%)] text-[hsl(33,100%,50%)]" />)}</div>
            <div className="border-t border-border pt-5 flex items-center gap-3">
              <img src={t.img} alt={t.name} className="h-11 w-11 rounded-full object-cover ring-2 ring-border" />
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

/* ─── Speaker Spotlight ─── */
const speakerTabs = ["All", "Tech", "Marketing", "Coaching"];
const SpeakerSpotlight = () => {
  const [activeTab, setActiveTab] = useState("All");
  const filtered = activeTab === "All" ? speakers : speakers.filter(s => s.tab === activeTab);

  return (
    <section className="py-20 md:py-24">
      <div className="container px-4 md:px-6 text-center flex flex-col items-center">
        <SectionBadge label="Featured Guests" icon={Users} />
        <h2 className="text-3xl md:text-4xl font-bold font-display mt-4 mb-2">
          Who's Speaking<br /><span className="text-primary">At Our Webinars</span>
        </h2>
        <p className="text-muted-foreground text-base mb-8">Industry veterans. Domain experts. All speaking to your growth.</p>
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {speakerTabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${activeTab === t ? "bg-primary text-primary-foreground shadow-md" : "bg-background border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"}`}>{t}</button>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filtered.map((s, i) => (
            <motion.div key={s.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -6 }} className="group cursor-pointer text-left">
              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-xl transition-shadow duration-300">
                <img src={s.image} alt={s.name} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center gap-1.5 text-primary-foreground text-[11px] font-medium">
                    <Mic className="h-3 w-3" /> {s.webinar}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3 w-3 fill-[hsl(33,100%,50%)] text-[hsl(33,100%,50%)]" />
                    <span className="text-xs font-bold text-primary-foreground">{s.rating}</span>
                  </div>
                </div>
              </div>
              <h3 className="text-sm font-bold font-display group-hover:text-primary transition-colors">{s.name}</h3>
              <div className="flex items-center gap-2 mt-1.5">
                <img src={s.companyLogo} alt={s.company} className="h-5 w-5 rounded object-contain" loading="lazy" />
                <p className="text-xs text-muted-foreground">{s.designation}, {s.company}</p>
              </div>
              <div className="mt-2.5">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold bg-primary/10 text-primary">{s.speciality[0]}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── Bundles ─── */
const BundlesSection = () => (
  <section className="py-6 md:py-10">
    <div className="container px-4 md:px-6">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="relative overflow-hidden rounded-2xl bg-primary px-8 py-10 md:px-14 md:py-12">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-primary-foreground/5 -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-primary-foreground/5 translate-y-1/3 -translate-x-1/4" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-foreground/20 text-sm font-semibold text-primary-foreground mb-5">
            <Package className="h-4 w-4" /> Learning Bundles
          </div>
          <h3 className="text-2xl md:text-3xl font-bold font-display text-primary-foreground mb-2">Go Deeper With a Learning Bundle</h3>
          <p className="text-sm text-primary-foreground/70 mb-10 max-w-lg">Save up to 60% when you bundle webinars by topic track.</p>
          <div className="grid md:grid-cols-3 gap-5">
            {bundles.map((b, i) => (
              <motion.div key={b.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="rounded-2xl bg-primary-foreground p-6 hover:shadow-lg transition-shadow duration-300">
                <h4 className="font-bold font-display text-foreground text-base mb-1.5">{b.title}</h4>
                <p className="text-xs text-muted-foreground mb-4">{b.count} webinars · Certificates + Lifetime access</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-bold font-display text-foreground">{b.price}</span>
                  <span className="text-sm text-muted-foreground line-through">{b.worth}</span>
                </div>
                <Button size="sm" className="w-full bg-[hsl(33,100%,50%)] text-primary-foreground hover:bg-[hsl(33,100%,45%)] border-0 gap-1 rounded-xl h-10">Get Bundle <ArrowRight className="h-3.5 w-3.5" /></Button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

/* ─── Trusted By Companies ─── */
const webinarPartners = [
  { name: "Google", logo: "https://www.google.com/s2/favicons?domain=google.com&sz=64" },
  { name: "Microsoft", logo: "https://www.google.com/s2/favicons?domain=microsoft.com&sz=64" },
  { name: "Amazon", logo: "https://www.google.com/s2/favicons?domain=amazon.com&sz=64" },
  { name: "Flipkart", logo: "https://www.google.com/s2/favicons?domain=flipkart.com&sz=64" },
  { name: "Swiggy", logo: "https://www.google.com/s2/favicons?domain=swiggy.com&sz=64" },
  { name: "Razorpay", logo: "https://www.google.com/s2/favicons?domain=razorpay.com&sz=64" },
  { name: "Zomato", logo: "https://www.google.com/s2/favicons?domain=zomato.com&sz=64" },
  { name: "Infosys", logo: "https://www.google.com/s2/favicons?domain=infosys.com&sz=64" },
  { name: "Deloitte", logo: "https://www.google.com/s2/favicons?domain=deloitte.com&sz=64" },
  { name: "Accenture", logo: "https://www.google.com/s2/favicons?domain=accenture.com&sz=64" },
  { name: "Adobe", logo: "https://www.google.com/s2/favicons?domain=adobe.com&sz=64" },
  { name: "Salesforce", logo: "https://www.google.com/s2/favicons?domain=salesforce.com&sz=64" },
];

const TrustedByBanner = () => (
  <section className="py-6 md:py-10">
    <div className="container px-4 md:px-6">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="relative overflow-hidden rounded-2xl bg-primary px-8 py-10 md:px-14 md:py-12">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-primary-foreground/5 -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-primary-foreground/5 translate-y-1/3 -translate-x-1/4" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-foreground/20 text-sm font-semibold text-primary-foreground mb-5">
            <Award className="h-4 w-4" /> Trusted By Industry Leaders
          </div>
          <h3 className="text-2xl md:text-3xl font-bold font-display text-primary-foreground mb-2 text-center">Professionals From These Companies Attend Our Webinars</h3>
          <p className="text-sm text-primary-foreground/70 mb-8 text-center max-w-lg">Join 85,000+ attendees from top companies who upskill with our expert-led sessions.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {webinarPartners.map((p, i) => (
              <motion.span key={p.name} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-primary-foreground text-foreground text-sm font-semibold font-display shadow-sm hover:shadow-md transition-shadow duration-200">
                <img src={p.logo} alt={p.name} className="h-5 w-5 object-contain" loading="lazy" />
                {p.name}
              </motion.span>
            ))}
            <span className="px-5 py-3 rounded-xl bg-primary-foreground/20 text-primary-foreground text-sm font-semibold">+ 200 more</span>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

/* ─── Metrics Countdown Banner ─── */
const webinarMetrics = [
  { label: "Webinars Hosted", target: 120, suffix: "+" },
  { label: "Hours of Content", target: 500, suffix: "+" },
  { label: "Professionals Trained", target: 85000, suffix: "+" },
  { label: "Avg Rating", target: 4.8, suffix: "/5", decimal: true },
];

const AnimatedMetric = ({ target, suffix = "", decimal = false }: { target: number; suffix?: string; decimal?: boolean }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => decimal ? v.toFixed(1) : Math.round(v).toLocaleString());
  const [display, setDisplay] = useState(decimal ? "0.0" : "0");

  useEffect(() => {
    if (isInView) { const c = animate(count, target, { duration: 2.5, ease: [0.22, 1, 0.36, 1] }); return c.stop; }
  }, [isInView, count, target]);

  useEffect(() => { const u = rounded.on("change", (v) => setDisplay(String(v))); return u; }, [rounded]);

  return <span ref={ref} className="tabular-nums">{display}{suffix}</span>;
};

const MetricsCountdownBanner = () => (
  <section className="relative overflow-hidden bg-primary py-16 md:py-20">
    {/* Decorative circles */}
    <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-primary-foreground/5 -translate-y-1/2 -translate-x-1/3" />
    <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-primary-foreground/5 translate-y-1/3 translate-x-1/4" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary-foreground/3" />

    <div className="container px-4 md:px-6 relative z-10">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-foreground/20 text-sm font-semibold text-primary-foreground mb-5">
            <TrendingUp className="h-4 w-4" /> Our Impact in Numbers
          </div>
          <h3 className="text-2xl md:text-4xl font-bold font-display text-primary-foreground mb-3">Webinars That Drive Real Growth</h3>
          <p className="text-sm md:text-base text-primary-foreground/70 max-w-lg mx-auto">Every session is designed to deliver measurable career outcomes.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 mb-14">
          {webinarMetrics.map((m, i) => (
            <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }} className="text-center">
              <p className="text-4xl md:text-6xl font-bold font-display text-primary-foreground mb-2">
                <AnimatedMetric target={m.target} suffix={m.suffix} decimal={m.decimal} />
              </p>
              <p className="text-[11px] md:text-xs text-primary-foreground/60 font-semibold uppercase tracking-[0.15em]">{m.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 gap-2 h-12 px-8 font-bold rounded-full shadow-lg">
            Browse All Webinars <ArrowRight className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 gap-2 h-12 px-8 font-bold rounded-full">
            <Calendar className="h-4 w-4" /> View Schedule
          </Button>
        </div>
      </motion.div>
    </div>
  </section>
);

/* ─── Final CTA ─── */
const FinalCTA = () => (
  <section className="py-20 md:py-24">
    <div className="container px-4 md:px-6">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="rounded-2xl bg-accent p-10 md:p-14 text-center">
        <Monitor className="h-12 w-12 text-primary mx-auto mb-5" />
        <h2 className="text-2xl md:text-3xl font-bold font-display mb-3">Never Miss a Session</h2>
        <p className="text-muted-foreground text-base mb-8 max-w-lg mx-auto">
          Subscribe to get notified about upcoming webinars and access exclusive recordings from past sessions.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button className="bg-[hsl(33,100%,50%)] text-primary-foreground hover:bg-[hsl(33,100%,45%)] border-0 gap-2 h-11 px-6 rounded-xl">See All Upcoming Webinars <ArrowRight className="h-4 w-4" /></Button>
          <Link to="/contact">
            <Button variant="outline" className="gap-2 h-11 px-6 rounded-xl">Become a Speaker <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

/* ─── Countdown Strip ─── */
const featuredWebinarCountdowns = [
  { title: "Cracking Product Interviews at FAANG", industry: "Interview Prep", date: new Date("2026-04-05T15:00:00+05:30") },
  { title: "Building AI-First Startups in 2026", industry: "Tech Deep-Dive", date: new Date("2026-04-12T16:00:00+05:30") },
  { title: "System Design Masterclass", industry: "Tech Deep-Dive", date: new Date("2026-04-26T17:00:00+05:30") },
];

const CountdownStrip = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const id = setInterval(() => setActiveIdx(prev => (prev + 1) % featuredWebinarCountdowns.length), 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, featuredWebinarCountdowns[activeIdx].date.getTime() - now);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [activeIdx]);

  const units = [
    { label: "DAYS", value: timeLeft.days },
    { label: "HOURS", value: timeLeft.hours },
    { label: "MINS", value: timeLeft.minutes },
    { label: "SECS", value: timeLeft.seconds },
  ];

  const current = featuredWebinarCountdowns[activeIdx];

  return (
    <div className="bg-primary text-primary-foreground">
      <div className="container px-4 md:px-6 py-3.5 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
        <div className="flex items-center gap-2.5 text-sm font-semibold min-w-0">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-foreground opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-foreground" />
          </span>
          <AnimatePresence mode="wait">
            <motion.span key={activeIdx} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.3 }} className="truncate">
              <span className="hidden md:inline opacity-80 mr-1.5">{current.industry} —</span>
              {current.title}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-3">
          {units.map((u) => (
            <div key={u.label} className="flex flex-col items-center">
              <motion.span key={`${activeIdx}-${u.label}-${u.value}`}
                initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="text-lg md:text-xl font-bold tabular-nums leading-none">
                {String(u.value).padStart(2, "0")}
              </motion.span>
              <span className="text-[10px] uppercase tracking-wider opacity-80">{u.label}</span>
            </div>
          ))}
        </div>

        <Button size="sm" variant="secondary" className="text-xs h-8 px-4 font-semibold rounded-lg" asChild>
          <Link to="/webinars#upcoming">Register Free <ArrowRight className="ml-1 h-3 w-3" /></Link>
        </Button>

        <div className="flex gap-1.5 sm:ml-1">
          {featuredWebinarCountdowns.map((_, i) => (
            <button key={i} onClick={() => setActiveIdx(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIdx ? "w-5 bg-primary-foreground" : "w-1.5 bg-primary-foreground/40"}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Page ─── */
const Webinars = () => (
  <>
    <Helmet>
      <title>Webinars — Learn From the Best | I Am Talento</title>
      <meta name="description" content="Deep-dive webinars on skills, hiring, and career growth — taught by verified industry experts. Register free and get certified." />
    </Helmet>
    <Layout>
      <WebinarHero />
      <CountdownStrip />
      <WebinarScheduleSection />
      <WebinarSocialProof />
      <HowItWorksSection />
      <TrustedByBanner />
      <SpeakerSpotlight />
      <UpcomingWebinars />
      <DifferentiatorsSection />
      <IndustriesSection />
      <AttendeeStories />
      <MetricsCountdownBanner />
      <BundlesSection />
      <FinalCTA />
    </Layout>
  </>
);

export default Webinars;
