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
  Briefcase, Mic, Network, Target, TrendingUp, Award, Camera, Heart,
  Gift, Zap, Shield, Clock, PlayCircle, Instagram,
} from "lucide-react";

/* ───────── Photos (Unsplash) ───────── */
const PHOTO = {
  hero1: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=900&q=80",
  hero2: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80",
  hero3: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&q=80",
  hero4: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&q=80",
  event1: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&q=80",
  event2: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80",
  event3: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
  event4: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80",
  event5: "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&q=80",
  event6: "https://images.unsplash.com/photo-1559223607-a43c990c692c?w=800&q=80",
  gallery1: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&q=80",
  gallery2: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80",
  gallery3: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80",
  gallery4: "https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=600&q=80",
  gallery5: "https://images.unsplash.com/photo-1560439514-4e9645039924?w=600&q=80",
  gallery6: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80",
  gallery7: "https://images.unsplash.com/photo-1582653291997-079a1c04e0ae?w=600&q=80",
  gallery8: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&q=80",
};

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
  { title: "Founders & First Hires Mixer", city: "Bangalore", date: "Jun 28, 2026", time: "6:30 PM", spots: 80, tag: "Mixer", img: PHOTO.event1 },
  { title: "Women in Tech Roundtable", city: "Mumbai", date: "Jul 5, 2026", time: "5:00 PM", spots: 30, tag: "Roundtable", img: PHOTO.event2 },
  { title: "Product Leaders Coffee Chat", city: "Remote", date: "Jul 11, 2026", time: "4:00 PM", spots: 12, tag: "Coffee", img: PHOTO.event3 },
  { title: "AI Builders Summit", city: "Delhi NCR", date: "Jul 19, 2026", time: "10:00 AM", spots: 250, tag: "Summit", img: PHOTO.event4 },
  { title: "Design Systems Meetup", city: "Hyderabad", date: "Jul 26, 2026", time: "6:00 PM", spots: 60, tag: "Meetup", img: PHOTO.event5 },
  { title: "Engineering Leaders Dinner", city: "Pune", date: "Aug 2, 2026", time: "7:30 PM", spots: 24, tag: "Dinner", img: PHOTO.event6 },
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

/* ── NEW DATA ── */
const hosts = [
  { name: "Rohan Mehta", role: "VP Engineering · Stripe", img: "https://i.pravatar.cc/200?img=15", topic: "Scaling Engineering Orgs" },
  { name: "Priya Nair", role: "Head of Product · Notion", img: "https://i.pravatar.cc/200?img=45", topic: "Product-Led Growth" },
  { name: "Arjun Kapoor", role: "Founder · Loop AI", img: "https://i.pravatar.cc/200?img=22", topic: "Building AI-First Startups" },
  { name: "Sneha Reddy", role: "Design Director · Figma", img: "https://i.pravatar.cc/200?img=49", topic: "Design Systems at Scale" },
];

const perks = [
  { icon: Gift, title: "Curated guest list", desc: "No cold rooms — every attendee is vetted for relevance." },
  { icon: Zap, title: "Warm intros, fast", desc: "AI-matched conversations the moment you walk in." },
  { icon: Shield, title: "Safe & inclusive", desc: "Strict code of conduct with on-site community leads." },
  { icon: Clock, title: "Time-boxed", desc: "Most events wrap in 90 mins — designed for busy operators." },
  { icon: Heart, title: "Lasting community", desc: "Slack groups, follow-ups, and alumni meetups baked in." },
  { icon: PlayCircle, title: "Recap & replays", desc: "Miss it? Get notes, photos, and clips delivered next day." },
];

const moments = [
  PHOTO.gallery1, PHOTO.gallery2, PHOTO.gallery3, PHOTO.gallery4,
  PHOTO.gallery5, PHOTO.gallery6, PHOTO.gallery7, PHOTO.gallery8,
];

const spotlight = [
  { name: "Devika Shah", role: "Growth @ Razorpay", img: "https://i.pravatar.cc/200?img=44", badge: "Top Connector" },
  { name: "Ishaan Verma", role: "iOS @ Swiggy", img: "https://i.pravatar.cc/200?img=13", badge: "First-Timer Champ" },
  { name: "Tanya Bose", role: "Founder, Nimbl", img: "https://i.pravatar.cc/200?img=48", badge: "Host of the Month" },
  { name: "Vikram Anand", role: "PM @ Flipkart", img: "https://i.pravatar.cc/200?img=33", badge: "200+ Connections" },
  { name: "Aisha Khan", role: "Data Sci @ Zomato", img: "https://i.pravatar.cc/200?img=26", badge: "Roundtable Lead" },
  { name: "Nikhil Rao", role: "Eng @ Atlassian", img: "https://i.pravatar.cc/200?img=11", badge: "Mentor" },
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

        {/* 1. Hero — with photo collage */}
        <section className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center mb-24">
          <div>
            <SectionBadge label="Networking Events" icon={Network} />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display leading-[1.15] mb-4">
              Meet People Who Can Move<br /><span className="text-primary">Your Career Forward</span>
            </h1>
            <p className="text-muted-foreground max-w-xl text-base md:text-lg mb-8">
              Curated mixers, roundtables, and meetups put you alongside operators, founders, and hiring teams —<br className="hidden md:block" />meet the people who can move your career forward.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="bg-[hsl(33,100%,50%)] text-white hover:bg-[hsl(33,100%,45%)] border-0 gap-2">
                Browse Events <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2">Host an Event</Button>
            </div>
            <div className="flex items-center gap-3 mt-8">
              <div className="flex -space-x-2">
                {[47, 12, 32, 22, 45].map((id) => (
                  <img key={id} src={`https://i.pravatar.cc/80?img=${id}`} alt="" className="h-9 w-9 rounded-full border-2 border-background object-cover" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">25,000+</span> professionals already in the room</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 h-[460px]">
            <motion.img initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} src={PHOTO.hero1} alt="Networking event" className="row-span-2 h-full w-full object-cover rounded-2xl shadow-lg" />
            <motion.img initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} src={PHOTO.hero2} alt="Meetup" className="h-full w-full object-cover rounded-2xl shadow-lg" />
            <motion.img initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} src={PHOTO.hero3} alt="Fireside chat" className="h-full w-full object-cover rounded-2xl shadow-lg" />
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
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3">Six Meaningful Ways to Build<br /><span className="text-primary">Real Connections</span></h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mb-8">From intimate coffee chats to focused roundtables and full-day industry summits —<br className="hidden md:block" />choose the format that fits you best.</p>
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

        {/* 4. Upcoming Events — now with images */}
        <section className="mb-24">
          <SectionBadge label="Upcoming Events" icon={Calendar} />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3">Find the Next Room Worth<br /><span className="text-primary">Showing Up For</span></h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mb-8">Browse upcoming gatherings shaped around shared interests, real conversations, and useful introductions —<br className="hidden md:block" />reserve your place before seats fill.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {upcoming.map((e, i) => (
              <motion.div key={e.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card overflow-hidden hover:border-primary/30 hover:shadow-md transition-all group">
                <div className="relative h-44 overflow-hidden">
                  <img src={e.img} alt={e.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <Badge className="absolute top-3 left-3 bg-background/90 text-foreground border-0">{e.tag}</Badge>
                </div>
                <div className="p-6">
                  <p className="font-bold font-display mb-3">{e.title}</p>
                  <div className="flex flex-col gap-1.5 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{e.date} · {e.time}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{e.city}</span>
                    <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{e.spots} spots</span>
                  </div>
                  <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border-0 gap-1">
                    RSVP <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 5. NEW — Featured Hosts & Speakers */}
        <section className="mb-24">
          <SectionBadge label="Featured Hosts" icon={Mic} />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3">Learn Directly From the People<br /><span className="text-primary">Building What Is Next</span></h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mb-8">Meet operators, founders, and creators with practical lessons from building inside leading teams —<br className="hidden md:block" />hear what experience has taught them.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {hosts.map((h, i) => (
              <motion.div key={h.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="rounded-2xl overflow-hidden border border-border bg-card group">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img src={h.img} alt={h.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="font-bold font-display text-lg leading-tight">{h.name}</p>
                    <p className="text-xs opacity-90">{h.role}</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">Speaking on</p>
                  <p className="text-sm font-medium">{h.topic}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 6. NEW — Why You'll Love It (Perks) */}
        <section className="mb-24">
          <SectionBadge label="Why You'll Love It" icon={Heart} />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3">Designed for Conversations That Build<br /><span className="text-primary">Real Connections</span></h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mb-8">Every gathering is curated to make meeting the right people feel natural, focused, and worthwhile —<br className="hidden md:block" />without forced networking or crowded rooms.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {perks.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-all">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <p className="font-semibold font-display mb-1">{title}</p>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 7. Cities */}
        <section className="mb-24">
          <SectionBadge label="Where We Meet" icon={Globe} />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3">Explore Cities With a Growing<br /><span className="text-primary">Professional Community</span></h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mb-8">Find active professional communities across India and beyond, with new gatherings added regularly —<br className="hidden md:block" />connect wherever your career takes you.</p>
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

        {/* 8. NEW — Moments / Photo Gallery */}
        <section className="mb-24">
          <SectionBadge label="Moments" icon={Camera} />
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15]">Step Inside Our Most Recent<br /><span className="text-primary">Community Events</span></h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mb-8">See the conversations, introductions, and shared moments that make every gathering memorable —<br className="hidden md:block" />a look at the community in action.</p>
            <Button variant="outline" size="sm" className="gap-2"><Instagram className="h-4 w-4" /> See on Instagram</Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {moments.map((src, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                className={`relative overflow-hidden rounded-xl group ${i === 0 || i === 5 ? "row-span-2 aspect-[3/5]" : "aspect-square"}`}>
                <img src={src} alt="Event moment" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* 9. How It Works */}
        <section className="mb-24">
          <SectionBadge label="How It Works" icon={Target} />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3">From Your First RSVP to a<br /><span className="text-primary">Career-Changing Connection</span></h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mb-8">Tell us what matters, discover the right room, and continue the conversation after the event —<br className="hidden md:block" />we make every step feel simple.</p>
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

        {/* 10. NEW — Community Spotlight */}
        <section className="mb-24">
          <SectionBadge label="Community Spotlight" icon={Star} />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3">Meet the People Making This Month's<br /><span className="text-primary">Biggest Impact</span></h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mb-8">Celebrate members who welcome newcomers, share useful knowledge, and strengthen the community —<br className="hidden md:block" />these are this month's stand-outs.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {spotlight.map((p, i) => (
              <motion.div key={p.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="text-center">
                <div className="relative inline-block mb-3">
                  <img src={p.img} alt={p.name} className="h-24 w-24 rounded-full object-cover mx-auto border-4 border-card shadow-md" />
                  <span className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <Star className="h-3.5 w-3.5 fill-current" />
                  </span>
                </div>
                <p className="font-semibold text-sm leading-tight">{p.name}</p>
                <p className="text-xs text-muted-foreground mb-2">{p.role}</p>
                <Badge variant="secondary" className="text-[10px]">{p.badge}</Badge>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 11. Success Stories */}
        <section className="mb-24">
          <SectionBadge label="Success Stories" icon={Award} />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3">Real Conversations That Created<br /><span className="text-primary">Meaningful Outcomes</span></h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mb-8">See how one introduction, one honest conversation, or one shared room opened new possibilities —<br className="hidden md:block" />these stories started in person.</p>
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

        {/* 12. NEW — Become a Host CTA strip */}
        <section className="mb-24">
          <div className="relative rounded-3xl overflow-hidden">
            <img src={PHOTO.hero4} alt="Host an event" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
            <div className="relative grid md:grid-cols-2 gap-8 p-10 md:p-14 items-center">
              <div>
                <SectionBadge label="For Hosts" icon={Mic} />
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3">Bring Your Community Together<br /><span className="text-primary">Host With Us</span></h2>
                <p className="text-muted-foreground text-base md:text-lg max-w-2xl mb-6">We help shape the format, curate the guest list, secure the venue, and run the room —<br className="hidden md:block" />you bring the topic and community.</p>
                <div className="flex flex-wrap gap-3">
                  <Button size="lg" className="bg-[hsl(33,100%,50%)] text-white hover:bg-[hsl(33,100%,45%)] border-0 gap-2">Apply to Host <ArrowRight className="h-4 w-4" /></Button>
                  <Button size="lg" variant="outline">See Host Perks</Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 13. FAQ + CTA */}
        <section>
          <SectionBadge label="FAQ" icon={HelpCircle} />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3">Everything You Need to Know<br /><span className="text-primary">Before You Join</span></h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mb-8">Find quick answers about tickets, matching, virtual access, and hosting your own gathering —<br className="hidden md:block" />so you can join with confidence.</p>
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
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3">Your Next Opportunity Could Be<br /><span className="text-primary">One Room Away</span></h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-6">Join thousands of ambitious professionals turning thoughtful conversations into career momentum —<br className="hidden md:block" />your next connection starts here.</p>
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
