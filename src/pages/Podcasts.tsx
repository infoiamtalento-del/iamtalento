import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mic, Headphones, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Clock, Users, ArrowRight, Calendar, Star, Radio, Mail, Quote, TrendingUp, Briefcase, Code, Lightbulb, Check, ChevronLeft, ChevronRight, RefreshCw, MessageCircle, BookOpen } from "lucide-react";
import podcastThumbnail from "@/assets/podcast-thumbnail.jpg";
import ep1 from "@/assets/podcast-episode-1.jpg";
import ep2 from "@/assets/podcast-episode-2.jpg";
import ep3 from "@/assets/podcast-episode-3.jpg";
import ep4 from "@/assets/podcast-episode-4.jpg";
import host1 from "@/assets/podcast-host-1.jpg";
import host2 from "@/assets/podcast-host-2.jpg";
import speakerMeera from "@/assets/speaker-meera.jpg";
import speakerArjun from "@/assets/speaker-arjun.jpg";
import speakerKavya from "@/assets/speaker-kavya.jpg";
import speakerRohan from "@/assets/speaker-rohan.jpg";
import wc1 from "@/assets/webinar-cover-1.jpg";
import wc2 from "@/assets/webinar-cover-2.jpg";
import wc3 from "@/assets/webinar-cover-3.jpg";
import maleHost from "@/assets/podcast-studio-male.jpg";
import femaleHost from "@/assets/podcast-studio-female.jpg";
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

const hosts = [
  { name: "Meera Sharma", role: "Career Strategist · TalentBridge", img: speakerMeera, episodes: 24 },
  { name: "Arjun Nair", role: "Tech Lead · CloudNova", img: speakerArjun, episodes: 18 },
  { name: "Kavya Iyer", role: "Industry Analyst · McKinsey", img: speakerKavya, episodes: 15 },
  { name: "Rohan Deshmukh", role: "Startup Coach · YC Alumni", img: speakerRohan, episodes: 21 },
  { name: "Priya Nair", role: "AI Consultant · ex-Google", img: host1, episodes: 12 },
  { name: "Rahul Mehta", role: "Eng Lead · Swiggy", img: host2, episodes: 19 },
];

const bundles = [
  { title: "Tech Career Accelerator", count: 6, price: "₹999", worth: "₹2,499", color: "bg-primary text-primary-foreground" },
  { title: "Job Search Masterclass", count: 5, price: "₹799", worth: "₹1,999", color: "bg-card border border-border" },
  { title: "Leadership Fast Track", count: 4, price: "₹899", worth: "₹1,999", color: "bg-card border border-border" },
];


const topics = [
  { label: "Career Growth", icon: TrendingUp, track: 3 },
  { label: "Job Search", icon: Briefcase, track: 0 },
  { label: "Interviews", icon: MessageCircle, track: 1 },
  { label: "Leadership", icon: Users, track: 3 },
  { label: "Technology", icon: Code, track: 2 },
  { label: "Career Change", icon: RefreshCw, track: 2 },
];
const stories = [
  { quote: "Used the exact salary script from one session, got ₹3 LPA more than the initial offer.", name: "Aditya S.", role: "SDE · Pune", image: maleHost },
  { quote: "Rewrote my resume after the ATS episode. Got 4 interview calls the next week.", name: "Sneha R.", role: "Marketing Manager · Mumbai", image: femaleHost },
  { quote: "As a fresher, the 30-day action plan from the guest actually worked.", name: "Karan M.", role: "Graduate · Delhi", image: ep3 },
];
function Heading({ label, first, second, description, tail, left = false }: { label: string; first: string; second: string; description: string; tail: string; left?: boolean }) {
  return <div className={`mb-10 ${left ? "text-left" : "text-center"}`}>
    <p className="text-primary text-xs font-bold uppercase mb-4">{label}</p>
    <h2 className="text-2xl md:text-4xl font-bold font-display leading-[1.15] text-foreground">{first}<br /><span className="text-primary">{second}</span></h2>
    <p className={`mt-4 text-sm md:text-base leading-relaxed text-muted-foreground ${left ? "" : "mx-auto"}`}>
      {description}{" "}<br className="hidden md:block" />{tail}
    </p>
  </div>;
}
const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
const fmt = (seconds: number) => Number.isFinite(seconds) ? `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, "0")}` : "0:00";

export default function Podcasts() {
  const [topic, setTopic] = useState("All");
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [audioError, setAudioError] = useState("");
  const [storyIndex, setStoryIndex] = useState(0);
  const [hostIndex, setHostIndex] = useState(0);
  const [liveFilter, setLiveFilter] = useState("All");
  const audioRef = useRef<HTMLAudioElement>(null);
  const track = active === null ? undefined : audioTracks[active];
  const story = stories[storyIndex];
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) { audio.volume = volume; audio.muted = muted; }
  }, [volume, muted, active]);
  const selectTrack = (index: number) => {
    audioRef.current?.pause(); setActive(index); setPlaying(false); setTime(0); setDuration(0); setAudioError("");
  };
  const toggleAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) audio.pause();
    else { try { await audio.play(); setAudioError(""); } catch { setAudioError("The audio preview could not load. Please try again."); } }
  };
  const filtered = topic === "All" ? audioTracks : audioTracks.filter((_, index) => index === topics.find(t => t.label === topic)?.track);
  const episodes = expanded ? filtered : filtered.slice(0, 3);
  const liveSessions = upcoming.filter(s => liveFilter === "All" || s.type === liveFilter).slice(0, 3);
  return <Layout>
    <Helmet>
      <title>Career Podcasts & Expert Conversations | I Am Talento</title>
      <meta name="description" content="Explore career conversations, expert podcast episodes and live webinars from I Am Talento." />
      <meta property="og:title" content="Career Podcasts | I Am Talento" />
      <meta property="og:description" content="Real conversations. Practical career insights. Discover expert episodes and webinars." />
    </Helmet>
    <div className="podcast-page bg-background text-foreground">
      <section className="pt-28 md:pt-36 pb-12 md:pb-16">
        <div className="container">
          <div className="grid lg:grid-cols-[1fr_2.35fr_1fr] gap-6 items-center">
            <img src={maleHost} width={768} height={1024} alt="Indian podcast host speaking into a studio microphone" className="hidden lg:block w-full aspect-[3/4] object-cover rounded-lg" />
            <div className="text-center py-4">
              <p className="text-primary font-bold text-xs uppercase mb-5 inline-flex items-center gap-2"><Mic className="w-4 h-4" /> I Am Talento Podcasts</p>
              <h1 className="text-3xl sm:text-4xl xl:text-5xl font-bold font-display leading-[1.12] text-foreground">Real Conversations<br /><span className="text-primary">Build Career Skills</span></h1>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed mt-5">Learn from industry experts and hiring leaders.{" "}<br className="hidden md:block" />Take your next step with confidence.</p>
              <div className="flex flex-wrap justify-center gap-3 mt-7">
                <Button size="lg" className="rounded-full px-6" onClick={() => selectTrack(0)}><Play className="fill-current" /> Listen to Latest Episode</Button>
                <Button size="lg" variant="outline" className="rounded-full px-6" onClick={() => scrollTo("episodes")}><Headphones /> Explore Episodes</Button>
              </div>
            </div>
            <img src={femaleHost} width={768} height={1024} alt="Indian podcast host in a bright recording studio" className="hidden lg:block w-full aspect-[3/4] object-cover rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-3 mt-6 lg:hidden">
            <img src={maleHost} width={768} height={1024} alt="Male podcast host" className="w-full aspect-square object-cover rounded-lg" />
            <img src={femaleHost} width={768} height={1024} alt="Female podcast host" className="w-full aspect-square object-cover rounded-lg" />
          </div>
        </div>
      </section>
      <section className="border-y border-border py-8">
        <div className="container grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[{ icon: Users, value: "50,000+", label: "Monthly listeners" }, { icon: Radio, value: "370+", label: "Episodes" }, { icon: Mic, value: "120+", label: "Guest experts" }, { icon: Star, value: "4.9/5", label: "Average rating" }].map(s => <div key={s.label} className="flex items-center justify-center gap-3"><s.icon className="text-primary w-6 h-6 shrink-0" /><div><p className="font-display font-bold text-xl md:text-2xl">{s.value}</p><p className="text-xs text-muted-foreground mt-1">{s.label}</p></div></div>)}
        </div>
      </section>
      <section className="py-16 md:py-24">
        <div className="container grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden group">
            <img src={podcastThumbnail} alt="A career conversation in the podcast studio" loading="lazy" className="h-full w-full object-cover" />
            <Button size="icon" aria-label="Play featured episode" onClick={() => selectTrack(0)} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full h-16 w-16"><Play className="fill-current" /></Button>
            <span className="absolute bottom-4 left-4 bg-podcast-ink text-podcast-paper rounded-full px-3 py-1 text-xs inline-flex items-center gap-2"><Headphones className="w-3 h-3" /> Featured conversation</span>
          </div>
          <div>
            <Heading label="Featured Episode" first="Why Your Resume" second="Gets Rejected" description="Discover what hiring teams look for in a resume." tail="Make your experience count." left />
            <div className="flex items-center gap-3 mb-7"><img src={host1} alt="Priya Sharma" loading="lazy" className="w-12 h-12 object-cover rounded-full" /><div><p className="font-semibold">Priya Sharma</p><p className="text-sm text-muted-foreground">Sr. HR Lead · Infosys</p></div></div>
            <div className="flex flex-wrap items-center gap-5"><Button size="lg" className="rounded-full" onClick={() => selectTrack(0)}>Listen Now <ArrowRight /></Button><span className="text-muted-foreground text-sm inline-flex items-center gap-2"><Clock className="h-4 w-4 text-primary" />34 min</span></div>
          </div>
        </div>
      </section>
      <section className="py-16 md:py-24 bg-secondary/60">
        <div className="container">
          <Heading label="Popular Topics" first="Conversations for Every" second="Career Stage" description="Explore the questions that shape your working life." tail="Find what matters to you." />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {topics.map(t => <Button key={t.label} variant="outline" aria-pressed={topic === t.label} onClick={() => { setTopic(t.label); setExpanded(true); scrollTo("episodes"); }} className={`h-32 flex-col whitespace-normal rounded-lg text-center p-4 ${topic === t.label ? "border-primary bg-primary/10" : "bg-card"}`}><t.icon className="text-primary mb-3 !h-7 !w-7" /><span className="font-semibold text-sm">{t.label}</span></Button>)}
          </div>
        </div>
      </section>
      <section id="episodes" className="py-16 md:py-24 scroll-mt-24">
        <div className="container">
          <div className="flex flex-wrap justify-between items-end gap-4"><Heading label="Latest Episodes" first="Fresh Perspectives Every" second="Time You Tune In" description="Career stories and practical ideas from experienced voices." tail="Listen at your own pace." left /><Button variant="link" onClick={() => { setTopic("All"); setExpanded(!expanded); }}>{expanded ? "Show Latest" : "View All Episodes"}<ArrowRight /></Button></div>
          <div className="flex flex-wrap gap-2 mb-6">{["All", ...topics.map(t => t.label)].map(t => <Button key={t} size="sm" variant={topic === t ? "default" : "outline"} className="rounded-full" aria-pressed={topic === t} onClick={() => setTopic(t)}>{t}</Button>)}</div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {episodes.map(t => <article key={t.id} className="border border-border rounded-lg overflow-hidden bg-card">
              <div className="relative aspect-video"><img src={t.cover} alt={t.title} loading="lazy" className="w-full h-full object-cover" /><Button size="icon" aria-label={`Play ${t.title}`} className="absolute bottom-3 left-3 rounded-full" onClick={() => selectTrack(audioTracks.indexOf(t))}><Play className="fill-current" /></Button><span className="absolute bottom-4 right-3 text-podcast-paper bg-podcast-ink/80 rounded-full px-3 py-1 text-xs">{t.duration}</span></div>
              <div className="p-5"><h3 className="text-base font-bold min-h-12 text-foreground">{t.title}</h3><p className="text-sm text-muted-foreground mt-2">{t.host}</p><Button variant="link" className="px-0 mt-3" onClick={() => selectTrack(audioTracks.indexOf(t))}>Listen to Episode <ArrowRight /></Button></div>
            </article>)}
          </div>
        </div>
      </section>
      <section className="py-16 md:py-24 bg-secondary/60">
        <div className="container grid lg:grid-cols-[1fr_2fr] gap-10">
          <div><Heading label="Meet Our Experts" first="Learn From the People" second="Who Have Done It" description="Meet practitioners who build, hire and lead teams." tail="Experience worth hearing." left /><div className="flex gap-2"><Button variant="outline" size="icon" aria-label="Previous experts" title="Previous experts" onClick={() => setHostIndex((hostIndex + hosts.length - 1) % hosts.length)}><ChevronLeft /></Button><Button variant="outline" size="icon" aria-label="Next experts" title="Next experts" onClick={() => setHostIndex((hostIndex + 1) % hosts.length)}><ChevronRight /></Button></div></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{Array.from({ length: 4 }, (_, i) => hosts[(hostIndex + i) % hosts.length]).map(h => <article key={h.name}><img src={h.img} alt={h.name} loading="lazy" className="aspect-[4/5] w-full object-cover rounded-lg mb-4" /><h3 className="text-sm font-bold text-foreground">{h.name}</h3><p className="text-xs text-muted-foreground mt-1 leading-relaxed">{h.role}</p><p className="text-xs text-primary mt-2">{h.episodes} episodes</p></article>)}</div>
        </div>
      </section>
      <section className="py-16 md:py-24">
        <div className="container"><Heading label="Why Listen" first="More Than Conversations" second="Real Career Insight" description="Honest experiences and practical ideas for your next move." tail="Leave with a fresh perspective." />
          <div className="grid md:grid-cols-3 gap-8 text-center">{[{ icon: Lightbulb, title: "Real Experiences", desc: "Learn from people who have been where you are." }, { icon: BookOpen, title: "Practical Advice", desc: "Find ideas you can bring into your everyday work." }, { icon: Briefcase, title: "Career Perspectives", desc: "Understand skills, roles and the decisions behind them." }].map(p => <div key={p.title}><p.icon className="text-primary h-8 w-8 mx-auto mb-4" /><h3 className="font-bold text-foreground">{p.title}</h3><p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">{p.desc}</p></div>)}</div>
        </div>
      </section>
      <section className="bg-secondary/60 py-16 md:py-24">
        <div className="container"><Heading label="Listener Stories" first="One Conversation Can" second="Change Your Perspective" description="See how listeners have put career advice into practice." tail="Small insights, meaningful steps." />
          <div className="grid md:grid-cols-[1fr_1.4fr] gap-8 lg:gap-14 items-center"><img src={story.image} alt={story.name} loading="lazy" className="w-full aspect-[4/3] object-cover rounded-lg" /><div><Quote className="text-primary h-8 w-8 mb-5" /><blockquote className="text-xl md:text-2xl leading-relaxed font-display">“{story.quote}”</blockquote><p className="font-bold mt-6">{story.name}</p><p className="text-sm text-muted-foreground mt-1">{story.role}</p><div className="flex items-center gap-3 mt-6"><Button variant="outline" size="icon" title="Previous story" aria-label="Previous listener story" onClick={() => setStoryIndex((storyIndex + stories.length - 1) % stories.length)}><ChevronLeft /></Button><span className="text-xs text-muted-foreground">{storyIndex + 1} / {stories.length}</span><Button variant="outline" size="icon" title="Next story" aria-label="Next listener story" onClick={() => setStoryIndex((storyIndex + 1) % stories.length)}><ChevronRight /></Button></div></div></div>
        </div>
      </section>
      <section className="py-16 md:py-24">
        <div className="container"><Heading label="Go Deeper" first="Build Your Skills With" second="Expert Learning Series" description="Explore focused collections built around your career goals." tail="Turn listening into learning." /><div className="grid md:grid-cols-3 gap-6">{bundles.map((b, i) => <article key={b.title} className={`rounded-lg border p-7 flex flex-col ${i === 1 ? "bg-podcast-ink text-podcast-paper border-podcast-ink" : "bg-card border-border"}`}><p className={`text-xs font-semibold uppercase ${i === 1 ? "text-podcast-paper/65" : "text-primary"}`}>{b.count} expert episodes</p><h3 className={`text-xl font-bold mt-4 mb-5 ${i === 1 ? "text-podcast-paper" : "text-foreground"}`}>{b.title}</h3><p className="text-3xl font-bold font-display mb-5">{b.price}<span className="text-sm line-through opacity-50 ml-3">{b.worth}</span></p><div className="space-y-3 text-sm mb-7">{["Focused career conversations", "Practical learning takeaways", "Learn at your own pace"].map(x => <p key={x} className="flex items-center gap-2"><Check className="text-primary w-4 h-4" />{x}</p>)}</div><Button asChild className="mt-auto rounded-full" variant={i === 1 ? "secondary" : "default"}><Link to="/learning">Explore Learning <ArrowRight /></Link></Button></article>)}</div></div>
      </section>
      <section id="live-sessions" className="py-16 md:py-24 bg-secondary/60 scroll-mt-24"><div className="container"><Heading label="Live Conversations" first="Join Experts for Your" second="Next Career Question" description="Explore the live podcast and webinar programme." tail="Bring your questions along." /><div className="flex flex-wrap justify-center gap-2 mb-8">{["All", "Live Podcast", "Webinar"].map(x => <Button key={x} variant={x === liveFilter ? "default" : "outline"} className="rounded-full" aria-pressed={liveFilter === x} onClick={() => setLiveFilter(x)}>{x}</Button>)}</div><div className="grid md:grid-cols-3 gap-6">{liveSessions.map(s => <article key={s.title} className="bg-card border border-border rounded-lg overflow-hidden"><img src={s.img} alt={s.title} loading="lazy" className="w-full aspect-video object-cover" /><div className="p-5"><p className="text-primary text-xs font-bold uppercase">{s.type}</p><h3 className="font-bold text-lg my-3 text-foreground">{s.title}</h3><p className="text-sm text-muted-foreground">{s.host} · {s.role}</p><Button asChild variant="link" className="px-0 mt-3"><Link to="/contact">Ask About This Session <ArrowRight /></Link></Button></div></article>)}</div></div></section>
      <section className="py-16 md:py-24"><div className="container max-w-3xl"><Heading label="FAQ" first="Everything to Know" second="Before You Listen" description="Answers to common questions about episodes and sessions." tail="Find your starting point." /><Accordion type="single" collapsible>{[{ q: "Can I explore episodes by topic?", a: "Yes. Choose a topic to see related episodes, or select All to browse the full selection." }, { q: "Can I listen directly on this page?", a: "The episode player includes playback, seeking and volume controls. Current audio previews use sample recordings; full podcast recordings will be added when available." }, { q: "Where can I find live webinars?", a: "Visit Live Conversations above and select the Webinar filter. Contact the team for availability and registration details." }, { q: "How do I explore a learning series?", a: "Choose Explore Learning on a series to visit the Learning page and discover the current courses and collections." }].map((f, i) => <AccordionItem value={`faq-${i}`} key={f.q}><AccordionTrigger className="text-left">{f.q}</AccordionTrigger><AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent></AccordionItem>)}</Accordion></div></section>
      <section className="py-12 md:py-16 bg-accent/50"><div className="container flex flex-col md:flex-row justify-between gap-8 items-center"><div><p className="text-primary text-xs font-bold uppercase mb-4">Stay In the Loop</p><h2 className="text-2xl md:text-4xl font-bold text-foreground leading-[1.15]">Make Room for Your<br /><span className="text-primary">Next Great Listen</span></h2><p className="text-sm text-muted-foreground mt-4">Discover new conversations and upcoming guests.{" "}<br className="hidden md:block" />Stay connected with I Am Talento.</p></div><div className="flex flex-wrap gap-3"><Button asChild size="lg" className="rounded-full"><Link to="/contact"><Mail />Get Episode Updates</Link></Button><Button size="lg" variant="outline" className="rounded-full" onClick={() => scrollTo("episodes")}>Browse Episodes <ArrowRight /></Button></div></div></section>
    </div>
    <Dialog open={active !== null} onOpenChange={open => { if (!open) { audioRef.current?.pause(); setActive(null); setPlaying(false); } }}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader><DialogTitle className="text-foreground">{track?.title}</DialogTitle></DialogHeader>
        {track && <><img src={track.cover} alt={track.title} className="w-full aspect-video object-cover rounded-lg" /><p className="text-sm text-muted-foreground">{track.host}</p><p className="text-xs text-muted-foreground">Audio preview · Sample recording</p>
          <audio ref={audioRef} src={track.src} preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onLoadedMetadata={e => setDuration(e.currentTarget.duration)} onTimeUpdate={e => setTime(e.currentTarget.currentTime)} onError={() => setAudioError("The audio preview could not load. Please try again.")} />
          <input aria-label="Seek audio" type="range" min="0" max={Number.isFinite(duration) && duration > 0 ? duration : 1} step="0.1" value={time} onChange={e => { const audio = audioRef.current; if (audio && Number.isFinite(audio.duration)) { audio.currentTime = Number(e.target.value); setTime(audio.currentTime); } }} className="w-full accent-primary" />
          <div className="flex justify-between text-xs text-muted-foreground tabular-nums"><span>{fmt(time)}</span><span>{duration ? fmt(duration) : track.duration}</span></div>
          <div className="flex items-center justify-between gap-2"><div className="flex items-center gap-1"><Button variant="ghost" size="icon" aria-label={muted ? "Unmute audio" : "Mute audio"} title={muted ? "Unmute" : "Mute"} onClick={() => setMuted(!muted)}>{muted ? <VolumeX /> : <Volume2 />}</Button><input aria-label="Audio volume" type="range" min="0" max="1" step="0.01" value={muted ? 0 : volume} onChange={e => { setVolume(Number(e.target.value)); setMuted(false); }} className="w-16 md:w-24 accent-primary" /></div><div className="flex items-center gap-2"><Button variant="ghost" size="icon" title="Previous episode" aria-label="Previous episode" onClick={() => selectTrack(((active ?? 0) + audioTracks.length - 1) % audioTracks.length)}><SkipBack /></Button><Button size="icon" className="rounded-full h-12 w-12" title={playing ? "Pause" : "Play"} aria-label={playing ? "Pause audio" : "Play audio"} onClick={toggleAudio}>{playing ? <Pause className="fill-current" /> : <Play className="fill-current" />}</Button><Button variant="ghost" size="icon" title="Next episode" aria-label="Next episode" onClick={() => selectTrack(((active ?? 0) + 1) % audioTracks.length)}><SkipForward /></Button></div></div>
          {audioError && <p role="alert" className="text-sm text-destructive">{audioError}</p>}
        </>}
      </DialogContent>
    </Dialog>
  </Layout>;
}
