import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SectionBadge from "@/components/ui/section-badge";
import {
  Users, Calendar, MapPin, ArrowRight, Sparkles, Coffee, Building2,
  MessageSquare, Globe, Star, CheckCircle, Quote, HelpCircle, Handshake,
  Briefcase, Mic, Network, Target, TrendingUp, Award,
} from "lucide-react";

/* ───────── Data ───────── */
const stats = [
  { icon: Users, value: "25,000+", label: "Active Networkers" },
  { icon: Calendar, value: "350+", label: "Events Hosted" },
  { icon: Building2, value: "500+", label: "Partner Companies" },
  { icon: Globe, value: "30+", label: "Cities Worldwide" },
];

const formats = [
  { icon: Coffee, title: "Coffee Chats", desc: "1:1 curated intros with peers who match your goals and stage." },
  { icon: Users, title: "Roundtables", desc: "Small-group conversations led by industry operators and founders." },
  { icon: Mic, title: "Fireside Chats", desc: "Intimate Q&As with leaders from FAANG, unicorns, and rising startups." },
  { icon: Handshake, title: "Mixers & Socials", desc: "After-hours meetups for organic, low-pressure connections." },
  { icon: Building2, title: "Office Tours", desc: "Behind-the-scenes visits to top tech offices and innovation hubs." },
  { icon: Briefcase, title: "Industry Summits", desc: "Day-long deep dives with talks, demos, and hiring zones." },
];

const upcoming = [
  { title: "Founders & First Hires Mixer", city: "Bangalore", date: "Jun 28, 2026", time: "6:30 PM", spots: 80, tag: "Mixer" },
  { title: "Women in Tech Roundtable", city: "Mumbai", date: "Jul 5, 2026", time: "5:00 PM", spots: 30, tag: "Roundtable" },
  { title: "Product Leaders Coffee Chat", city: "Remote", date: "Jul 11, 2026", time: "4:00 PM", spots: 12, tag: "Coffee" },
  { title: "AI Builders Summit", city: "Delhi NCR", date: "Jul 19, 2026", time: "10:00 AM", spots: 250, tag: "Summit" },
  { title: "Design Systems Meetup", city: "Hyderabad", date: "Jul 26, 2026", time: "6:00 PM", spots: 60, tag: "Meetup" },
  { title: "Engineering Leaders Dinner", city: "Pune", date: "Aug 2, 2026", time: "7:30 PM", spots: 24, tag: "Dinner" },
];

const cities = [
  { name: "Bangalore", count: "120+ events" },
  { name: "Mumbai", count: "85+ events" },
  { name: "Delhi NCR", count: "70+ events" },
  { name: "Hyderabad", count: "55+ events" },
  { name: "Pune", count: "40+ events" },
  { name: "Chennai", count: "35+ events" },
  { name: "Remote", count: "200+ events" },
  { name: "Singapore", count: "20+ events" },
];

const howItWorks = [
  { step: "01", title: "Tell us your goals", desc: "Share what you're building, hiring for, or looking to learn." },
  { step: "02", title: "Get matched", desc: "We surface events and people aligned to your role, stage, and stack." },
  { step: "03", title: "Show up & connect", desc: "Attend in person or virtually — we handle the icebreakers." },
  { step: "04", title: "Keep the momentum", desc: "Follow-ups, intros, and recap notes land in your inbox." },
];

const stories = [
  { name: "Ananya Rao", role: "Senior PM at Razorpay", quote: "I met my current manager at a Product Roundtable. Three weeks later I had an offer in hand.", avatar: "https://i.pravatar.cc/120?img=47" },
  { name: "Karthik Iyer", role: "Founder, Loop AI", quote: "Found my co-founder and our first two engineers through Talento networking events. Game-changer.", avatar: "https://i.pravatar.cc/120?img=12" },
  { name: "Meera Joshi", role: "Staff Engineer, Swiggy", quote: "The fireside chats helped me build the confidence and clarity to negotiate a 40% pay jump.", avatar: "https://i.pravatar.cc/120?img=32" },
];

const partners = ["Google", "Microsoft", "Stripe", "Razorpay", "Swiggy", "Flipkart", "Zomato", "Notion", "Linear", "Figma", "Vercel", "Atlassian"];

const faqs = [
  { q: "Are networking events free?", a: "Most community meetups and coffee chats are free. Premium summits and curated dinners have a small ticket fee." },
  { q: "How do you match attendees?", a: "We use your profile, goals, and recent activity to recommend the rooms most likely to move your career forward." },
  { q: "Can I host my own event?", a: "Yes — apply to become a host and we'll help with venue, promotion, and attendee curation." },
  { q: "Do you run virtual events?", a: "Absolutely. Roughly half of our calendar is remote-friendly with live Q&A and breakout rooms." },
];

/* ───────── Page ───────── */
const Networking = () => (
  <Layout>
    <Helmet>
      <title>Networking Events | Talento</title>
      <meta name="description" content="Curated networking events, meetups, and mixers to grow your career, find collaborators, and meet hiring teams." />
    </Helmet>

    <main className="pt-28 pb-20">
      <div className="container max-w-6xl">

        {/* 1. Hero */}
        <section className="text-center mb-20">
          <SectionBadge label="Networking Events" icon={Network} />
          <h1 className="text-4xl md:text-6xl font-bold font-display tracking-tight mb-4">
            Meet the people who <span className="text-primary">move your career</span>.
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg mb-8">
            Curated mixers, roundtables, and meetups — engineered to put you in the same room as the operators, founders, and hiring managers you actually want to know.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" className="bg-[hsl(33,100%,50%)] text-white hover:bg-[hsl(33,100%,45%)] border-0 gap-2">
              Browse Events <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2">Host an Event</Button>
          </div>
        </section>

        {/* 2. Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
          {stats.map(({ icon: Icon, value, label }) => (
            <motion.div key={label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="rounded-xl border border-border bg-card p-6">
              <Icon className="h-5 w-5 text-primary mb-3" />
              <p className="text-2xl md:text-3xl font-bold font-display">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </motion.div>
          ))}
        </section>

        {/* 3. Event Formats */}
        <section className="mb-24">
          <SectionBadge label="Event Formats" icon={Sparkles} />
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-3">Six ways to <span className="text-primary">connect</span></h2>
          <p className="text-muted-foreground mb-8 max-w-2xl">From intimate coffee chats to full-day summits — pick the format that fits where you are right now.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {formats.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 hover:shadow-md transition-all">
                <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <p className="font-semibold font-display mb-1">{title}</p>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 4. Upcoming Events */}
        <section className="mb-24">
          <SectionBadge label="Upcoming Events" icon={Calendar} />
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-8">Save your seat at the <span className="text-primary">next room</span></h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {upcoming.map((e, i) => (
              <motion.div key={e.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 hover:shadow-md transition-all">
                <Badge className="bg-accent text-foreground border-0 mb-3">{e.tag}</Badge>
                <p className="font-bold font-display mb-3">{e.title}</p>
                <div className="flex flex-col gap-1.5 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{e.date} · {e.time}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{e.city}</span>
                  <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{e.spots} spots</span>
                </div>
                <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border-0 gap-1">
                  RSVP <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 5. Cities */}
        <section className="mb-24">
          <SectionBadge label="Where We Meet" icon={Globe} />
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-8">Cities with an <span className="text-primary">active scene</span></h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cities.map((c) => (
              <div key={c.name} className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors">
                <MapPin className="h-4 w-4 text-primary mb-2" />
                <p className="font-semibold font-display">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.count}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. How It Works */}
        <section className="mb-24">
          <SectionBadge label="How It Works" icon={Target} />
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-8">From signup to <span className="text-primary">signed offer</span></h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {howItWorks.map((s, i) => (
              <motion.div key={s.step} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card p-6">
                <p className="text-xs font-bold text-primary mb-3">{s.step}</p>
                <p className="font-semibold font-display mb-1">{s.title}</p>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 7. Success Stories */}
        <section className="mb-24">
          <SectionBadge label="Success Stories" icon={Award} />
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-8">Real rooms, <span className="text-primary">real outcomes</span></h2>
          <div className="grid md:grid-cols-3 gap-5">
            {stories.map((s, i) => (
              <motion.div key={s.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card p-6">
                <Quote className="h-5 w-5 text-primary mb-3" />
                <p className="text-sm mb-5">"{s.quote}"</p>
                <div className="flex items-center gap-3">
                  <img src={s.avatar} alt={s.name} className="h-10 w-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10">
            <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wide">Companies in the room</p>
            <div className="flex flex-wrap gap-2">
              {partners.map((p) => (
                <span key={p} className="px-3 py-1.5 rounded-full bg-muted text-xs font-medium">{p}</span>
              ))}
            </div>
          </div>
        </section>

        {/* 8. FAQ + CTA */}
        <section>
          <SectionBadge label="FAQ" icon={HelpCircle} />
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-8">Common <span className="text-primary">questions</span></h2>
          <div className="grid md:grid-cols-2 gap-5 mb-12">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-xl border border-border bg-card p-6">
                <p className="font-semibold font-display mb-2 flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  {f.q}
                </p>
                <p className="text-sm text-muted-foreground pl-6">{f.a}</p>
              </div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-2xl bg-accent p-10 md:p-14 text-center">
            <TrendingUp className="h-8 w-8 text-primary mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold font-display mb-3">Your next opportunity is one room away.</h2>
            <p className="text-muted-foreground text-sm mb-6 max-w-lg mx-auto">Join 25,000+ professionals turning conversations into careers.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button size="lg" className="bg-[hsl(33,100%,50%)] text-white hover:bg-[hsl(33,100%,45%)] border-0 gap-2">
                Browse All Events <ArrowRight className="h-4 w-4" />
              </Button>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="gap-2"><MessageSquare className="h-4 w-4" /> Talk to Us</Button>
              </Link>
            </div>
          </motion.div>
        </section>

      </div>
    </main>
  </Layout>
);

export default Networking;
