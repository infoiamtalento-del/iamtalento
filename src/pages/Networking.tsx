import { useState } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import communityPhoto from "@/assets/networking-community.jpg";
import panelPhoto from "@/assets/networking-panel.jpg";
import meetupPhoto from "@/assets/event-meetup.jpg";
import industryPhoto from "@/assets/event-industry.jpg";
import eventPhoto from "@/assets/event-networking.jpg";
import webinarPhoto from "@/assets/event-webinar.jpg";
import podcastPhoto from "@/assets/event-podcast.jpg";
import participantRohan from "@/assets/networking-participant-rohan.jpg";
import participantPriya from "@/assets/networking-participant-priya.jpg";
import participantArjun from "@/assets/networking-participant-arjun.jpg";
import participantSneha from "@/assets/networking-participant-sneha.jpg";
import arjunPhoto from "@/assets/speaker-arjun.jpg";
import kavyaPhoto from "@/assets/speaker-kavya.jpg";
import priyaPhoto from "@/assets/learner-priya.jpg";
import rahulPhoto from "@/assets/learner-rahul.jpg";
import ananyaPhoto from "@/assets/learner-ananya.jpg";
import vikramPhoto from "@/assets/learner-vikram.jpg";
import NetworkingCalendar from "@/components/networking/NetworkingCalendar";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SectionBadge from "@/components/ui/section-badge";
import {
  Users, Calendar, MapPin, ArrowLeft, ArrowRight, Sparkles, Coffee, Building2,
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
  { name: "Rohan Mehta", role: "VP Engineering · Stripe", img: participantRohan, category: "Engineering", topic: "Scaling Engineering Orgs" },
  { name: "Priya Nair", role: "Head of Product · Notion", img: participantPriya, category: "Product", topic: "Product-Led Growth" },
  { name: "Arjun Kapoor", role: "Founder · Loop AI", img: participantArjun, category: "AI", topic: "Building AI-First Startups" },
  { name: "Sneha Reddy", role: "Design Director · Figma", img: participantSneha, category: "Design", topic: "Design Systems at Scale" },
];
const hostCategories = ['All', 'Engineering', 'Product', 'AI', 'Design'];

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

const Heading = ({ label, first, second, description, tail, inverse = false }: { label: string; first: string; second: string; description: string; tail: string; inverse?: boolean }) => (
  <div className="text-center mb-10 md:mb-12">
    <p className={`text-xs uppercase font-semibold mb-3 ${inverse ? 'text-primary-foreground/80' : 'text-primary'}`}>{label}</p>
    <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl leading-[1.15] mb-4"><span className={inverse ? 'text-primary-foreground' : ''}>{first}</span><br /><span className={inverse ? 'text-primary-foreground' : 'text-primary'}>{second}</span></h2>
    <p className={`text-base md:text-lg leading-relaxed ${inverse ? 'text-primary-foreground/85' : 'text-muted-foreground'}`}>{description}{' '}<br className="hidden md:block" />{tail}</p>
  </div>
);

const connectionBenefits = [
  { icon: Users, title: 'Meet like-minded people', desc: 'Connect with professionals who share your interests and ambitions.' },
  { icon: MessageSquare, title: 'Learn from real experiences', desc: 'Hear useful lessons from people who have been there.' },
  { icon: Briefcase, title: 'Access new opportunities', desc: 'Discover collaborators, hiring teams and fresh perspectives.' },
  { icon: Calendar, title: 'Join exclusive events', desc: 'Find your place at coffee chats, roundtables and industry summits.' },
  { icon: Handshake, title: 'Find mentors', desc: 'Build meaningful relationships with experienced professionals.' },
  { icon: TrendingUp, title: 'Grow together', desc: 'Exchange ideas, support one another and keep moving forward.' },
];
const eventPhotos = [communityPhoto, panelPhoto, meetupPhoto, industryPhoto, communityPhoto, panelPhoto];
const memberPhotos = [priyaPhoto, rahulPhoto, ananyaPhoto, vikramPhoto, kavyaPhoto, arjunPhoto];
const galleryPhotos = [communityPhoto, panelPhoto, meetupPhoto, industryPhoto, eventPhoto, communityPhoto, panelPhoto, meetupPhoto, webinarPhoto, podcastPhoto].slice(0, 9);

const Networking = () => {
  const [showAll, setShowAll] = useState(false);
  const [city, setCity] = useState('All');
  const [memberStart, setMemberStart] = useState(0);
  const [hostFilter, setHostFilter] = useState('All');
  const filteredEvents = upcoming.filter(event => city === 'All' || event.city === city);
  const displayedEvents = showAll ? filteredEvents : filteredEvents.slice(0, 3);
  return (
    <Layout>
      <Helmet>
        <title>Networking Events | Talento</title>
        <meta name="description" content="Curated networking events, meetups, and mixers to grow your career, find collaborators, and meet hiring teams." />
      </Helmet>
      <main className="pt-28">
        <div className="container">
          {/* 1. Hero — with photo collage */}
        <section className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center mb-24">
          <div>
            <SectionBadge label="Networking Events" icon={Network} />
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold font-display leading-[1.15] mb-4">
              Meet People<br /><span className="text-primary">Who Move Careers</span>
            </h1>
            <p className="text-muted-foreground max-w-xl text-base md:text-lg mb-8">
              <span className="block">Meet founders, operators, and hiring teams.</span><span className="block">Build connections that move careers.</span>
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
            <motion.img initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} src={PHOTO.hero1} alt="Networking event" className="row-span-2 h-full w-full object-cover rounded-2xl shadow-xl shadow-foreground/25" />
            <motion.img initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} src={PHOTO.hero2} alt="Meetup" className="h-full w-full object-cover rounded-2xl shadow-xl shadow-foreground/25" />
            <motion.img initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} src={PHOTO.hero3} alt="Fireside chat" className="h-full w-full object-cover rounded-2xl shadow-xl shadow-foreground/25" />
          </div>
        </section>
        </div>

        <section className="border-y border-border/60 bg-muted/20 py-9 md:py-12">
          <div className="container grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ icon: Icon, value, label }) => <div key={label} className="flex items-center gap-3 md:gap-4"><Icon className="h-7 w-7 shrink-0 text-primary" /><div><p className="font-display text-xl md:text-3xl font-bold">{value}</p><p className="text-xs text-muted-foreground mt-1">{label}</p></div></div>)}
          </div>
        </section>

        <NetworkingCalendar />

        <section className="py-16 md:py-20 bg-accent/30">
          <div className="container">
            <Heading label="Real connections" first="Six Ways to Build" second="Real Connections" description="Make space for people, ideas and opportunities." tail="Build a network that matters." />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {connectionBenefits.map(({ icon: Icon, title, desc }) => <article key={title} className="flex gap-4 p-6 bg-card rounded-lg border border-border/40"><div className="h-12 w-12 shrink-0 flex items-center justify-center bg-accent text-primary rounded-full"><Icon className="h-6 w-6" /></div><div><h3 className="font-display font-semibold text-base mb-2">{title}</h3><p className="text-sm text-muted-foreground leading-relaxed">{desc}</p></div></article>)}
            </div>
          </div>
        </section>

        <section id="networking-events" className="py-16 md:py-20 scroll-mt-24">
          <div className="container">
            <Heading label="Upcoming events" first="Find Your Next Room" second="Make It Count" description="Explore gatherings built around your interests and goals." tail="Find your next conversation." />
            {city !== 'All' && <div className="flex items-center justify-center gap-3 mb-6"><span className="text-sm text-muted-foreground">{city}</span><Button variant="ghost" size="sm" onClick={() => setCity('All')}>Show all cities</Button></div>}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedEvents.map(event => { const index = upcoming.indexOf(event); return <article key={event.title} className="group rounded-lg overflow-hidden border border-border bg-card flex flex-col"><div className="relative aspect-[4/3] overflow-hidden"><img src={eventPhotos[index]} alt={event.title} loading="lazy" width={800} height={600} className="w-full h-full object-cover motion-safe:group-hover:scale-105 transition-transform duration-500" /><div className="absolute left-4 top-4 rounded-md bg-background px-3 py-2 text-center"><span className="block font-display font-bold text-xl leading-tight">{event.date.split(' ')[1].replace(',', '')}</span><span className="text-xs uppercase font-semibold text-primary">{event.date.split(' ')[0]}</span></div><Badge variant="secondary" className="absolute right-4 top-4">{event.tag}</Badge></div><div className="p-5 flex flex-col flex-1"><h3 className="font-display font-bold text-lg mb-4 min-h-14">{event.title}</h3><div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground mb-3"><span className="flex gap-1.5 items-center"><MapPin className="h-3.5 w-3.5 text-primary" />{event.city}</span><span className="flex gap-1.5 items-center"><Users className="h-3.5 w-3.5 text-primary" />{event.spots} spots</span></div><p className="text-xs text-muted-foreground mb-5">{event.date} · {event.time}</p><Button asChild className="mt-auto w-full gap-2"><Link to={`/contact?event=${encodeURIComponent(event.title)}`}>Ask About This Event <ArrowRight className="h-4 w-4" /></Link></Button></div></article> })}
            </div>
            {displayedEvents.length === 0 && <p className="text-center text-muted-foreground py-8">No events listed for {city} yet.</p>}
            <div className="text-center mt-8"><Button variant="ghost" className="text-primary gap-2" onClick={() => setShowAll(!showAll)}>{showAll ? 'Show Fewer Events' : 'View All Events'}<ArrowRight className="h-4 w-4" /></Button></div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-muted/20">
          <div className="container">
            <div className="flex justify-center mb-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-card border border-border px-4 py-1.5 text-sm font-semibold shadow-sm">
                <Sparkles className="h-4 w-4 text-primary" />Learn from people
              </span>
            </div>
            <h2 className="font-display font-bold text-3xl md:text-4xl leading-[1.15] text-center mb-4">Participants from<br /><span className="text-primary">Top Industries</span></h2>
            <p className="text-base md:text-lg text-muted-foreground text-center max-w-xl mx-auto mb-8">Hear from founders and leaders with practical experience.{' '}<br className="hidden md:block" />Learn directly from the source.</p>
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {hostCategories.map(category => (
                <button key={category} type="button" onClick={() => setHostFilter(category)} aria-pressed={hostFilter === category} className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${hostFilter === category ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground hover:border-primary/50'}`}>{category}</button>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {hosts.filter(host => hostFilter === 'All' || host.category === hostFilter).map(host => (
                <article key={host.name} className="w-[calc(50%-12px)] md:w-[calc(25%-18px)] text-center">
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/5] mb-5 border border-border/60">
                    <img src={host.img} alt={host.name} loading="lazy" width={480} height={600} className="w-full h-full object-cover" />
                    <div className="absolute left-3 bottom-3 flex items-center gap-2 rounded-lg bg-background/95 px-3 py-2 shadow-md text-left">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent"><Mic className="h-4 w-4 text-primary" /></span>
                      <span className="leading-tight">
                        <span className="block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Session</span>
                        <span className="block text-xs font-semibold">{host.topic}</span>
                      </span>
                    </div>
                  </div>
                  <h3 className="font-display font-semibold mb-1">{host.name}</h3>
                  <p className="text-xs text-muted-foreground">{host.role}</p>
                </article>
              ))}
            </div>
          </div>
        </section>


        <section className="py-16 md:py-20 bg-accent/20">
          <div className="container">
            <Heading label="Past events" first="Event Highlights" second="From Rooms We Filled" description="A look back at recent meetups, panels and mixers." tail="See what happened inside." />
            <article className="grid overflow-hidden rounded-2xl border border-border bg-card lg:grid-cols-[1.4fr_1fr] mb-6">
              <img src={communityPhoto} alt="Tech Leaders Meetup, Bengaluru" loading="lazy" width={1200} height={800} className="h-64 w-full object-cover sm:h-80 lg:h-full" />
              <div className="flex flex-col justify-center p-6 md:p-10">
                <p className="mb-3 text-xs font-semibold uppercase text-primary">Featured recap · Sep 2026</p>
                <h3 className="font-display text-2xl font-bold md:text-3xl">Tech Leaders Meetup</h3>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="h-4 w-4" />Bengaluru</p>
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">An evening of open roundtables on scaling engineering teams, followed by speed introductions between hiring managers and senior engineers.</p>
                <div className="mt-6 grid grid-cols-3 gap-4 border-y border-border py-5">
                  {[["320", "Attendees"], ["14", "Speakers"], ["90+", "Intros made"]].map(([v, l]) => <div key={l}><p className="font-display text-2xl font-bold text-primary">{v}</p><p className="text-xs text-muted-foreground">{l}</p></div>)}
                </div>
                <ul className="mt-5 space-y-2 text-sm">
                  {["Panel: Building teams that ship", "Live hiring roundtables", "Founders' after-hours mixer"].map((h) => <li key={h} className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" />{h}</li>)}
                </ul>
              </div>
            </article>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { img: panelPhoto, name: "Product Leaders Panel", city: "Mumbai", date: "Aug 2026", people: "180", note: "Product-led growth in India" },
                { img: meetupPhoto, name: "AI Builders Night", city: "Chennai", date: "Jul 2026", people: "240", note: "Live demos from 8 startups" },
                { img: industryPhoto, name: "HR & Culture Meet", city: "Delhi", date: "Jun 2026", people: "150", note: "Future of hybrid work" },
                { img: webinarPhoto, name: "Remote Careers Live", city: "Online", date: "May 2026", people: "1,200", note: "Q&A with global recruiters" },
              ].map((e) => (
                <article key={e.name} className="group overflow-hidden rounded-xl border border-border bg-card">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={e.img} alt={e.name} loading="lazy" width={800} height={600} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <Badge className="absolute left-3 top-3">{e.date}</Badge>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-semibold">{e.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{e.note}</p>
                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{e.city}</span>
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{e.people} attended</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container">
            <Heading label="Get started" first="From Your First RSVP" second="To a Real Connection" description="Find the right room and keep the conversation going." tail="Every step stays simple." />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorks.map((step, i) => <div key={step.step} className="text-center relative"><div className="w-12 h-12 bg-accent text-primary rounded-full mx-auto mb-5 flex items-center justify-center font-display font-bold">{step.step}</div>{i < 3 && <div className="hidden lg:block absolute top-6 left-[70%] w-[60%] border-t border-border" />}<h3 className="font-display font-semibold mb-2">{step.title}</h3><p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p></div>)}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-muted/20">
          <div className="container">
            <Heading label="This month's standouts" first="Meet Our Community" second="And Its Connectors" description="Celebrate members who bring people and ideas together." tail="Meet this month's standouts." />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
              {spotlight.map((_, i) => { const index = (i + memberStart) % spotlight.length; const person = spotlight[index]; return <article key={person.name} className="text-center"><img src={memberPhotos[index]} alt={person.name} loading="lazy" width={200} height={200} className="h-20 w-20 rounded-full object-cover mx-auto mb-4" /><h3 className="font-display text-sm font-semibold">{person.name}</h3><p className="text-xs text-muted-foreground mt-1 mb-2">{person.role}</p><p className="text-xs text-primary">{person.badge}</p></article> })}
            </div>
            <div className="flex gap-3 justify-center mt-8"><Button size="icon" variant="outline" aria-label="Previous community members" onClick={() => setMemberStart((memberStart + 5) % 6)}><ArrowLeft className="h-4 w-4" /></Button><Button size="icon" variant="outline" aria-label="Next community members" onClick={() => setMemberStart((memberStart + 1) % 6)}><ArrowRight className="h-4 w-4" /></Button></div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container">
            <Heading label="Real stories" first="Real Conversations" second="Meaningful Outcomes" description="Discover how one conversation opened a new door." tail="Every story starts with people." />
            <div className="grid md:grid-cols-3 gap-6">{stories.map((story, i) => <article key={story.name} className="p-6 rounded-lg border border-border bg-card"><Quote className="h-5 w-5 text-primary mb-4" /><p className="text-sm leading-relaxed text-muted-foreground mb-6">“{story.quote}”</p><div className="flex gap-3 items-center"><img src={memberPhotos[i]} alt={story.name} loading="lazy" width={80} height={80} className="h-10 w-10 rounded-full object-cover" /><div><h3 className="text-sm font-semibold">{story.name}</h3><p className="text-xs text-muted-foreground">{story.role}</p></div></div></article>)}</div>
            <p className="text-xs text-muted-foreground text-center mt-10 mb-5 uppercase">Companies in the room</p><div className="flex justify-center flex-wrap gap-x-8 gap-y-4">{partners.map(partner => <span key={partner} className="font-display font-semibold text-sm text-muted-foreground">{partner}</span>)}</div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-muted/20">
          <div className="container">
            <Heading label="FAQ" first="What You Need to Know" second="Before You Join" description="Find answers about event access, hosting and community." tail="Join with confidence." />
            <Accordion type="single" collapsible className="max-w-3xl mx-auto">{faqs.map((faq, i) => <AccordionItem value={`faq-${i}`} key={faq.q}><AccordionTrigger className="text-left font-display">{faq.q}</AccordionTrigger><AccordionContent className="text-muted-foreground leading-relaxed">{faq.a}</AccordionContent></AccordionItem>)}</Accordion>
          </div>
        </section>

        <section className="relative py-16 md:py-20 text-primary-foreground overflow-hidden">
          <img src={communityPhoto} alt="Professionals connecting at a community gathering" loading="lazy" width={1536} height={1024} className="absolute inset-0 w-full h-full object-cover" /><div className="absolute inset-0 bg-foreground/80" />
          <div className="container relative"><Heading inverse label="Join our community" first="Bring People Together" second="Host With Us" description="Share your expertise and bring your community together." tail="We help you shape the room." /><div className="flex flex-wrap justify-center gap-3"><Button asChild size="lg" className="gap-2"><Link to="/contact?interest=host-event">Host an Event<ArrowRight className="h-4 w-4" /></Link></Button><Button asChild size="lg" variant="secondary"><Link to="/contact">Learn More</Link></Button></div></div>
        </section>
      </main>
    </Layout>
  );
};
export default Networking;
