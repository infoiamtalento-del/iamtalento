import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SectionBadge from "@/components/ui/section-badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, MapPin, Clock, Users, ArrowRight, Code, Globe, Trophy,
  Zap, Star, CheckCircle, Play, Mic, Monitor, BookOpen, TrendingUp,
  Award, Target, Sparkles
} from "lucide-react";

import hackathonHero from "@/assets/hackathon-hero.jpg";
import webinarHero from "@/assets/webinar-hero.jpg";
import hackathonEvent1 from "@/assets/hackathon-event-1.jpg";
import hackathonEvent2 from "@/assets/hackathon-event-2.jpg";
import webinarSpeaker1 from "@/assets/webinar-speaker-1.jpg";
import webinarSpeaker2 from "@/assets/webinar-speaker-2.jpg";

/* ─── Data ─── */
const hackathonCategories = ["All", "AI/ML", "Web3", "FinTech", "HealthTech", "Open Innovation"];
const hackathons = [
  { title: "AI Innovation Challenge 2026", category: "AI/ML", date: "Apr 12–14, 2026", location: "Bangalore", prize: "₹5,00,000", teams: 120, status: "Registering", image: hackathonEvent1, featured: true },
  { title: "Web3 Builder Sprint", category: "Web3", date: "Apr 26–27, 2026", location: "Mumbai", prize: "₹3,00,000", teams: 80, status: "Registering", image: hackathonEvent2, featured: false },
  { title: "FinTech Disrupt Hack", category: "FinTech", date: "May 10–12, 2026", location: "Delhi NCR", prize: "₹4,00,000", teams: 100, status: "Coming Soon", image: hackathonEvent1, featured: true },
  { title: "HealthTech for Good", category: "HealthTech", date: "May 24–25, 2026", location: "Hyderabad", prize: "₹2,50,000", teams: 60, status: "Coming Soon", image: hackathonEvent2, featured: false },
  { title: "Open Innovation Hackathon", category: "Open Innovation", date: "Jun 7–9, 2026", location: "Chennai", prize: "₹3,50,000", teams: 90, status: "Coming Soon", image: hackathonEvent1, featured: false },
  { title: "GenAI Product Sprint", category: "AI/ML", date: "Jun 21–22, 2026", location: "Pune", prize: "₹4,50,000", teams: 110, status: "Coming Soon", image: hackathonEvent2, featured: true },
];

const hackathonStats = [
  { icon: Trophy, value: "50+", label: "Hackathons Hosted" },
  { icon: Users, value: "12,000+", label: "Participants" },
  { icon: Award, value: "₹2Cr+", label: "Prizes Awarded" },
  { icon: Star, value: "200+", label: "Hiring Partners" },
];

const hackathonPerks = [
  { icon: Trophy, title: "Win Cash Prizes", desc: "Compete for prize pools up to ₹5 lakhs per hackathon." },
  { icon: Target, title: "Get Hired", desc: "Top performers get fast-tracked interviews with hiring partners." },
  { icon: Code, title: "Build Real Products", desc: "Ship working prototypes in 48 hours with mentor support." },
  { icon: Users, title: "Team Matching", desc: "Find teammates with complementary skills through smart matching." },
  { icon: Zap, title: "Mentorship", desc: "Get guidance from industry experts throughout the event." },
  { icon: Award, title: "Certificates", desc: "Earn verified participation and winning certificates." },
];

const webinarCategories = ["All", "Career Growth", "Tech Deep-Dive", "Interview Prep", "Industry Insights", "Leadership"];
const webinars = [
  { title: "Cracking Product Interviews at FAANG", category: "Interview Prep", date: "Apr 5, 2026", time: "3:00 PM IST", speaker: "Priya Sharma", role: "Ex-Google PM", attendees: 2400, status: "Register Free", image: webinarSpeaker1, featured: true },
  { title: "Building AI-First Startups in 2026", category: "Tech Deep-Dive", date: "Apr 12, 2026", time: "4:00 PM IST", speaker: "Rahul Mehta", role: "CTO, TechScale", attendees: 1800, status: "Register Free", image: webinarSpeaker2, featured: true },
  { title: "From IC to Engineering Manager", category: "Career Growth", date: "Apr 19, 2026", time: "2:00 PM IST", speaker: "Ananya Desai", role: "VP Eng, CloudNova", attendees: 1500, status: "Register Free", image: webinarSpeaker1, featured: false },
  { title: "System Design Masterclass", category: "Tech Deep-Dive", date: "Apr 26, 2026", time: "5:00 PM IST", speaker: "Vikram Singh", role: "Staff Eng, Meta", attendees: 3200, status: "Register Free", image: webinarSpeaker2, featured: false },
  { title: "Salary Negotiation Playbook", category: "Career Growth", date: "May 3, 2026", time: "3:30 PM IST", speaker: "Neha Kapoor", role: "Career Coach", attendees: 2100, status: "Coming Soon", image: webinarSpeaker1, featured: false },
  { title: "The Future of Edge Computing", category: "Industry Insights", date: "May 10, 2026", time: "4:00 PM IST", speaker: "Arjun Nair", role: "AWS Solutions Architect", attendees: 1600, status: "Coming Soon", image: webinarSpeaker2, featured: false },
];

const webinarStats = [
  { icon: Monitor, value: "120+", label: "Webinars Conducted" },
  { icon: Users, value: "45,000+", label: "Attendees" },
  { icon: Mic, value: "80+", label: "Expert Speakers" },
  { icon: Star, value: "4.8/5", label: "Avg Rating" },
];

const webinarPerks = [
  { icon: Play, title: "Watch Replays", desc: "All webinars are recorded and available on demand." },
  { icon: BookOpen, title: "Free Resources", desc: "Get downloadable slides, cheat sheets, and templates." },
  { icon: Mic, title: "Live Q&A", desc: "Ask questions directly to speakers during the session." },
  { icon: TrendingUp, title: "Career Insights", desc: "Learn about trends and opportunities from leaders." },
  { icon: CheckCircle, title: "Certificates", desc: "Earn attendance certificates for every session." },
  { icon: Globe, title: "Join from Anywhere", desc: "100% online — attend from any device, any location." },
];

/* ─── Shared Components ─── */
const StatsBar = ({ stats }: { stats: typeof hackathonStats }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
    {stats.map(({ icon: Icon, value, label }) => (
      <motion.div key={label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="rounded-xl border border-border bg-card p-5">
        <Icon className="h-5 w-5 text-primary mb-2" />
        <p className="text-2xl font-bold font-display">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </motion.div>
    ))}
  </div>
);

const PerksGrid = ({ perks }: { perks: typeof hackathonPerks }) => (
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {perks.map(({ icon: Icon, title, desc }, i) => (
      <motion.div key={title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
        className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors">
        <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center mb-3">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <p className="font-semibold font-display text-sm mb-1">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </motion.div>
    ))}
  </div>
);

/* ─── Hackathons Tab ─── */
const HackathonsContent = () => {
  const [cat, setCat] = useState("All");
  const filtered = cat === "All" ? hackathons : hackathons.filter(h => h.category === cat);

  return (
    <div>
      <div className="relative rounded-xl overflow-hidden mb-12">
        <img src={hackathonHero} alt="Hackathon event" className="w-full h-64 md:h-80 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 to-foreground/20" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
          <Badge className="bg-primary text-primary-foreground border-0 w-fit mb-3">Season 3 — Now Open</Badge>
          <h2 className="text-2xl md:text-4xl font-bold font-display text-white mb-2">Build. Ship. Get Hired.</h2>
          <p className="text-white/80 text-sm md:text-base max-w-lg mb-4">Join India's most impactful hackathons — solve real problems, win prizes, and get noticed by top employers.</p>
          <div className="flex flex-wrap gap-3">
            <Link to="/hackathons">
              <Button className="bg-[hsl(33,100%,50%)] text-white hover:bg-[hsl(33,100%,45%)] border-0 gap-2">Explore Hackathons <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      </div>

      <StatsBar stats={hackathonStats} />

      <div className="mb-8">
        <SectionBadge label="Upcoming Hackathons" icon={Code} />
        <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Choose Your <span className="text-primary">Challenge</span></h2>
        <div className="flex flex-wrap gap-2 mt-4">
          {hackathonCategories.map(c => (
            <button key={c} onClick={() => setCat(c)} className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${cat === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}>{c}</button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={cat} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {filtered.map((h, i) => (
            <motion.div key={h.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card overflow-hidden hover:border-primary/30 hover:shadow-md transition-all group">
              <div className="relative h-40 overflow-hidden">
                <img src={h.image} alt={h.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {h.featured && <Badge className="absolute top-3 left-3 bg-[hsl(33,100%,50%)] text-white border-0">Featured</Badge>}
                <Badge className={`absolute top-3 right-3 border-0 ${h.status === "Registering" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{h.status}</Badge>
              </div>
              <div className="p-5">
                <p className="text-xs text-primary font-semibold mb-1">{h.category}</p>
                <p className="font-bold font-display text-sm mb-3">{h.title}</p>
                <div className="flex flex-col gap-1.5 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{h.date}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{h.location}</span>
                  <span className="flex items-center gap-1.5"><Trophy className="h-3.5 w-3.5" />Prize: {h.prize}</span>
                  <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{h.teams} teams</span>
                </div>
                <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border-0 gap-1">
                  {h.status === "Registering" ? "Register Now" : "Notify Me"} <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="mb-16">
        <SectionBadge label="Why Participate" icon={Sparkles} />
        <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">More Than Just <span className="text-primary">A Competition</span></h2>
        <PerksGrid perks={hackathonPerks} />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="rounded-xl bg-accent p-8 md:p-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold font-display mb-3">Ready to Hack?</h2>
        <p className="text-muted-foreground text-sm mb-6 max-w-lg mx-auto">Join thousands of developers competing, learning, and getting hired at India's best hackathons.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/hackathons">
            <Button className="bg-[hsl(33,100%,50%)] text-white hover:bg-[hsl(33,100%,45%)] border-0 gap-2">Browse All Hackathons <ArrowRight className="h-4 w-4" /></Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" className="border-border gap-2">Host a Hackathon <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

/* ─── Webinars Tab ─── */
const WebinarsContent = () => {
  const [cat, setCat] = useState("All");
  const filtered = cat === "All" ? webinars : webinars.filter(w => w.category === cat);

  return (
    <div>
      <div className="relative rounded-xl overflow-hidden mb-12">
        <img src={webinarHero} alt="Webinar setup" className="w-full h-64 md:h-80 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 to-foreground/20" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
          <Badge className="bg-primary text-primary-foreground border-0 w-fit mb-3">Live Every Week</Badge>
          <h2 className="text-2xl md:text-4xl font-bold font-display text-white mb-2">Learn from the Best, For Free.</h2>
          <p className="text-white/80 text-sm md:text-base max-w-lg mb-4">Expert-led webinars on career growth, tech deep-dives, and interview prep — join live or watch on demand.</p>
          <div className="flex flex-wrap gap-3">
            <Link to="/webinars">
              <Button className="bg-[hsl(33,100%,50%)] text-white hover:bg-[hsl(33,100%,45%)] border-0 gap-2">Explore Webinars <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      </div>

      <StatsBar stats={webinarStats} />

      <div className="mb-8">
        <SectionBadge label="Upcoming Webinars" icon={Monitor} />
        <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Expert Sessions, <span className="text-primary">Zero Cost</span></h2>
        <div className="flex flex-wrap gap-2 mt-4">
          {webinarCategories.map(c => (
            <button key={c} onClick={() => setCat(c)} className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${cat === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}>{c}</button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={cat} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {filtered.map((w, i) => (
            <motion.div key={w.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card overflow-hidden hover:border-primary/30 hover:shadow-md transition-all group">
              <div className="relative h-40 overflow-hidden">
                <img src={w.image} alt={w.title} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                {w.featured && <Badge className="absolute top-3 left-3 bg-[hsl(33,100%,50%)] text-white border-0">Featured</Badge>}
              </div>
              <div className="p-5">
                <p className="text-xs text-primary font-semibold mb-1">{w.category}</p>
                <p className="font-bold font-display text-sm mb-2">{w.title}</p>
                <div className="flex items-center gap-2 mb-3">
                  <img src={w.image} alt={w.speaker} className="h-6 w-6 rounded-full object-cover object-top" />
                  <div>
                    <p className="text-xs font-medium">{w.speaker}</p>
                    <p className="text-[10px] text-muted-foreground">{w.role}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{w.date}</span>
                  <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{w.time}</span>
                  <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{w.attendees.toLocaleString()} registered</span>
                </div>
                <Button size="sm" className={`w-full border-0 gap-1 ${w.status === "Register Free" ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground"}`}>
                  {w.status} <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="mb-16">
        <SectionBadge label="Why Attend" icon={Sparkles} />
        <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">What You <span className="text-primary">Get</span></h2>
        <PerksGrid perks={webinarPerks} />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="rounded-xl bg-accent p-8 md:p-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold font-display mb-3">Never Miss a Session</h2>
        <p className="text-muted-foreground text-sm mb-6 max-w-lg mx-auto">Subscribe to get notified about upcoming webinars and access exclusive recordings.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/webinars">
            <Button className="bg-[hsl(33,100%,50%)] text-white hover:bg-[hsl(33,100%,45%)] border-0 gap-2">View All Webinars <ArrowRight className="h-4 w-4" /></Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" className="border-border gap-2">Become a Speaker <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

/* ─── Main Page ─── */
const Meetups = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const typeParam = searchParams.get("type");
  const [activeTab, setActiveTab] = useState<"hackathons" | "webinars">(
    typeParam === "online" ? "webinars" : "hackathons"
  );

  useEffect(() => {
    if (typeParam === "online") setActiveTab("webinars");
    else if (typeParam === "offline") setActiveTab("hackathons");
  }, [typeParam]);

  const handleTabChange = (tab: "hackathons" | "webinars") => {
    setActiveTab(tab);
    setSearchParams({ type: tab === "hackathons" ? "offline" : "online" });
  };

  return (
    <>
      <Helmet>
        <title>Hackathons & Webinars — I Am Talento</title>
        <meta name="description" content="Join hackathons and webinars to build skills, win prizes, and get hired by top companies." />
      </Helmet>
      <Layout>
        <section className="pt-28 pb-20 md:pt-36 md:pb-28">
          <div className="container px-4 md:px-6">
            <div className="mb-8">
              <SectionBadge label="Events" icon={Calendar} />
              <h1 className="text-4xl md:text-5xl font-bold font-display mb-3">
                Hackathons &<br /><span className="text-primary">Webinars</span>
              </h1>
              <p className="text-muted-foreground text-base md:text-lg max-w-xl">
                Compete, learn, and connect — explore our curated events designed to accelerate your career.
              </p>
            </div>

            <div className="flex gap-2 mb-10 border-b border-border pb-4">
              <button onClick={() => handleTabChange("hackathons")}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${activeTab === "hackathons" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}>
                <Code className="h-4 w-4" /> Hackathons
              </button>
              <button onClick={() => handleTabChange("webinars")}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${activeTab === "webinars" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}>
                <Monitor className="h-4 w-4" /> Webinars
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                {activeTab === "hackathons" ? <HackathonsContent /> : <WebinarsContent />}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Meetups;
