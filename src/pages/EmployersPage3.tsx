import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  ArrowRight, Award, BadgeCheck, Brain, Briefcase, Building2, CalendarDays, ChevronDown, Code2, Cpu, Gavel,
  HeartPulse, Landmark, Megaphone, MapPin, Medal, Newspaper, Search, Trophy, Users, Target, Eye, Handshake,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import heroImg from "@/assets/hackathon-arena-hero.jpg";
import introImg from "@/assets/hackathon-event-1.jpg";
import mediaImg from "@/assets/hackathon-event-2.jpg";
import sponsorImg from "@/assets/event-industry.jpg";
import w1 from "@/assets/learner-ananya.jpg";
import w2 from "@/assets/learner-rahul.jpg";
import w3 from "@/assets/learner-priya.jpg";
import w4 from "@/assets/learner-vikram.jpg";
import j1 from "@/assets/speaker-arjun.jpg";
import j2 from "@/assets/speaker-kavya.jpg";
import j3 from "@/assets/speaker-meera.jpg";
import j4 from "@/assets/speaker-rohan.jpg";

const REGISTER = "/auth";
const SPONSOR = "/employer-profile";
const reveal = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.15 }, transition: { duration: 0.55 } };

const Heading = ({ eyebrow, first, second, sub, invert, align = "center" }: { eyebrow: string; first: string; second?: string; sub?: string; invert?: boolean; align?: "center" | "left" }) => (
  <motion.div {...reveal} className={align === "center" ? "mx-auto max-w-4xl text-center" : "max-w-xl"}>
    <p className={cn("mb-3 text-xs font-bold uppercase tracking-[0.18em]", invert ? "text-primary-foreground/70" : "text-primary")}>{eyebrow}</p>
    <h2 className={cn("mb-5 font-display text-3xl font-bold leading-[1.15] sm:text-4xl lg:text-[2.75rem]", invert && "text-primary-foreground")}>
      {first}{second && <><br /><span className={invert ? "text-primary-foreground/80" : "text-primary"}>{second}</span></>}
    </h2>
    {sub && <p className={cn("text-sm leading-relaxed md:text-base", invert ? "text-primary-foreground/80" : "text-muted-foreground")}>{sub}</p>}
  </motion.div>
);

const Cta = ({ to, label, outline, invert }: { to: string; label: string; outline?: boolean; invert?: boolean }) => (
  <Button asChild size="lg" variant={outline ? "outline" : invert ? "secondary" : "default"}
    className={cn("h-12 gap-2 px-7 font-bold", outline && invert && "border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10", outline && !invert && "border-primary text-primary")}>
    <Link to={to}>{label} {!outline && <ArrowRight className="h-4 w-4" />}</Link>
  </Button>
);

const Box = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <motion.div {...reveal} className={cn("rounded-2xl border border-border bg-card p-6 shadow-sm md:p-10", className)}>{children}</motion.div>
);

const Section = ({ id, children, className }: { id?: string; children: React.ReactNode; className?: string }) => (
  <section id={id} className={cn("scroll-mt-28 py-16 md:py-24", className)}><div className="container">{children}</div></section>
);

/* 1. Hero */
const Hero = () => (
  <section id="overview" className="bg-background pb-16 pt-[110px] md:pb-24 md:pt-[130px]">
    <div className="container grid items-center gap-11 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="[container-type:inline-size]">
        <p className="text-xs font-bold uppercase tracking-[0.13em] text-primary">India-Wide Industry Hackathons</p>
        <h1 className="mt-5 font-sans text-[clamp(28px,6.3cqw,55px)] font-bold leading-[1.16] tracking-[-0.01em]">
          Compete with the Best.
          <span className="block text-primary">Get Recognised. Get Hired.</span>
        </h1>
        <p className="mt-6 max-w-[620px] text-[clamp(16px,1.15vw,18px)] leading-[1.625] text-foreground/75">
          Prove your skills through real-world industry challenges. Compete with top talent, win exciting cash prizes, earn national media recognition, and get discovered by leading companies through TalentCIR.
        </p>
        <div className="mt-10 flex flex-wrap gap-5">
          <Button asChild className="h-[52px] min-w-[190px] gap-3 px-[22px] text-[15px] font-bold"><a href="#upcoming">Explore Hackathons <ArrowRight className="h-4 w-4" /></a></Button>
          <Button asChild variant="outline" className="h-[52px] min-w-[190px] border-primary px-[22px] text-[15px] font-bold text-primary"><a href="#sponsors">Become a Sponsor</a></Button>
        </div>
        <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-border pt-[26px]">
          {[{ icon: Trophy, t: "₹50,000", s: "Champion Prize*" }, { icon: Medal, t: "₹2,50,000", s: "Runner-Up Prize*" }, { icon: MapPin, t: "Pan-India", s: "City Competitions" }].map(({ icon: Icon, t, s }) => (
            <li key={s} className="flex items-start gap-2.5"><Icon className="mt-0.5 h-5 w-5 text-primary" /><div><strong className="block font-display text-lg font-bold text-primary">{t}</strong><span className="text-[12.5px] text-muted-foreground">{s}</span></div></li>
          ))}
        </ul>
        <p className="mt-4 text-[11px] text-muted-foreground">*Prize amounts to be confirmed before publication.</p>
      </motion.div>
      <motion.figure initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.7 }} className="relative">
        <img src={heroImg} alt="Participants competing at a TalentCIR hackathon" className="aspect-[4/3] w-full rounded-2xl object-cover shadow-xl" />
        <div className="absolute -bottom-5 left-5 flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold shadow-lg">
          <BadgeCheck className="h-4 w-4 text-primary" /> Compete → Get Recognised → Get Hired
        </div>
      </motion.figure>
    </div>
  </section>
);

/* Sticky in-page nav */
const navItems = [["overview", "Overview"], ["industries", "Industries"], ["upcoming", "Upcoming Events"], ["prizes", "Prizes"], ["hall-of-fame", "Hall of Fame"], ["talent-auction", "Talent Auction"], ["sponsors", "Sponsors"], ["faqs", "FAQs"]];
const PageNav = () => (
  <div className="sticky top-[72px] z-30 border-y border-border bg-card/95 backdrop-blur">
    <div className="container flex items-center gap-6 overflow-x-auto py-3 text-sm font-medium">
      {navItems.map(([id, l]) => <a key={id} href={`#${id}`} className="shrink-0 text-muted-foreground transition hover:text-primary">{l}</a>)}
      <Link to={REGISTER} className="ml-auto shrink-0 rounded-md bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground">Register</Link>
    </div>
  </div>
);

/* 2. Trust strip */
const Trust = () => (
  <Section className="!py-12">
    <Box className="text-center">
      <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">Why participants and employers trust TalentCIR Hackathons</p>
      <div className="flex flex-wrap justify-center gap-3">
        {[[Building2, "Industry-Sponsored Challenges"], [Briefcase, "Multiple Industry Domains"], [MapPin, "Metropolitan City Events"], [Newspaper, "National Media Recognition"], [Search, "Exclusive Talent Discovery"], [Handshake, "Employer Hiring Opportunities"]].map(([Icon, t]) => {
          const I = Icon as typeof Building2;
          return <span key={t as string} className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium"><I className="h-4 w-4 text-primary" /> {t as string}</span>;
        })}
      </div>
    </Box>
  </Section>
);

/* 3. Intro */
const Intro = () => (
  <Section>
    <div className="grid items-center gap-10 lg:grid-cols-2">
      <motion.img {...reveal} src={introImg} alt="Teams solving an industry challenge" className="aspect-[5/4] w-full rounded-2xl object-cover shadow-lg" />
      <Box>
        <Heading align="left" eyebrow="More Than a Hackathon" first="Where Skills" second="Meet Opportunity." />
        <p className="text-sm leading-relaxed text-muted-foreground md:text-base">TalentCIR Hackathons discover, evaluate and celebrate exceptional talent across industries. Participants solve real-world challenges built around industry needs, while leading companies identify high-potential candidates.</p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">From the competition floor to national media coverage and the Talent Auction marketplace, we turn demonstrated skills into career opportunities.</p>
        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          {[[Target, "Compete", "Solve practical challenges that test your abilities."], [Award, "Get Recognised", "Showcase achievements through winner profiles and media."], [Briefcase, "Get Hired", "Connect with employers looking for proven talent."]].map(([Icon, t, d]) => {
            const I = Icon as typeof Target;
            return <div key={t as string} className="rounded-xl bg-secondary/50 p-4"><I className="h-5 w-5 text-primary" /><p className="mt-2 font-semibold">{t as string}</p><p className="mt-1 text-xs text-muted-foreground">{d as string}</p></div>;
          })}
        </div>
      </Box>
    </div>
  </Section>
);

/* 4. Industries */
const industries = [
  { icon: Brain, t: "AI & Data Science", d: "Build intelligent solutions, analyse data, and solve complex problems.", c: "Explore AI Hackathons" },
  { icon: Code2, t: "IT & Software Development", d: "Showcase coding, software engineering, and product development skills.", c: "Explore IT Hackathons" },
  { icon: Megaphone, t: "Digital Marketing & Growth", d: "Demonstrate SEO, performance marketing, analytics, and growth strategy.", c: "Explore Marketing Hackathons" },
  { icon: Landmark, t: "Finance & FinTech", d: "Tackle financial analysis, business modelling, and fintech challenges.", c: "Explore Finance Hackathons" },
  { icon: Cpu, t: "Engineering & Robotics", d: "Turn technical knowledge into practical prototypes and innovative solutions.", c: "Explore Engineering Hackathons" },
  { icon: HeartPulse, t: "Healthcare & Life Sciences", d: "Explore healthcare innovation, health technology, and research challenges.", c: "Explore Healthcare Hackathons" },
];
const Industries = () => (
  <Section id="industries">
    <Heading eyebrow="Explore Hackathons by Industry" first="One Platform. Every Industry." second="Endless Possibilities." sub="Discover competitions that match your skills, interests, and career ambitions." />
    <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {industries.map(({ icon: Icon, t, d, c }, i) => (
        <motion.a {...reveal} key={t} href="#upcoming" className="group rounded-xl border border-border bg-card p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10"><Icon className="h-5 w-5 text-primary" /></span><span className="font-display text-sm font-semibold text-primary/60">0{i + 1}</span></div>
          <h3 className="mt-5 font-display text-xl font-bold">{t}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{d}</p>
          <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">{c} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
        </motion.a>
      ))}
    </div>
    <p className="mt-8 text-center text-sm text-muted-foreground">Also coming: Sales, Business Management, Design, Supply Chain, Human Resources, Sustainability and Entrepreneurship.</p>
    <div className="mt-6 flex justify-center"><Cta to={REGISTER} label="View All Industry Hackathons" outline /></div>
  </Section>
);

/* 5. Upcoming */
const events = [
  { n: "National AI Innovation Hackathon", ind: "AI & Data Science", city: "Bengaluru", date: "Dates to be announced", deadline: "Registration open", prize: "₹50,000", slots: "Team / Individual" },
  { n: "FinTech Build Challenge", ind: "Finance & FinTech", city: "Mumbai", date: "Dates to be announced", deadline: "Opening soon", prize: "₹50,000", slots: "Teams of 2–4" },
  { n: "Growth Marketing Sprint", ind: "Digital Marketing", city: "Delhi", date: "Dates to be announced", deadline: "Opening soon", prize: "₹50,000", slots: "Individual" },
];
const Upcoming = () => (
  <Section id="upcoming">
    <Heading eyebrow="Upcoming Hackathons" first="Your Next Big Opportunity" second="Starts Here." sub="Find an upcoming competition, explore its challenges, and register to showcase your skills." />
    <div className="mt-12 grid gap-5 lg:grid-cols-3">
      {events.map((e, i) => (
        <motion.div {...reveal} key={e.n} className={cn("flex flex-col rounded-2xl border p-7 shadow-sm", i === 0 ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card")}>
          <span className={cn("w-fit rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider", i === 0 ? "bg-primary-foreground/15" : "bg-primary/10 text-primary")}>{e.deadline}</span>
          <h3 className="mt-4 font-display text-xl font-bold">{e.n}</h3>
          <p className={cn("mt-1 text-sm", i === 0 ? "text-primary-foreground/75" : "text-muted-foreground")}>{e.ind} · {e.city} · {e.slots}</p>
          <ul className={cn("mt-5 space-y-2 text-sm", i === 0 ? "text-primary-foreground/85" : "text-foreground/80")}>
            <li className="flex gap-2"><CalendarDays className="h-4 w-4 shrink-0" /> {e.date}</li>
            <li className="flex gap-2"><MapPin className="h-4 w-4 shrink-0" /> {e.city}, venue to be announced</li>
            <li className="flex gap-2"><Users className="h-4 w-4 shrink-0" /> Open to students and professionals</li>
          </ul>
          <div className={cn("mt-auto flex items-end justify-between border-t pt-5", i === 0 ? "border-primary-foreground/20" : "border-border")} style={{ marginTop: 24 }}>
            <div><p className={cn("text-[11px] uppercase tracking-wider", i === 0 ? "text-primary-foreground/60" : "text-muted-foreground")}>Champion prize</p><p className="font-display text-2xl font-bold">{e.prize}</p></div>
            <Link to={REGISTER} className="inline-flex items-center gap-1 text-sm font-semibold">View Details <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </motion.div>
      ))}
    </div>
    <p className="mt-6 text-center text-xs text-muted-foreground">Events shown are illustrative examples, not confirmed scheduled events.</p>
  </Section>
);

/* 6. How it works */
const steps = [
  ["Discover & Register", "Choose an industry hackathon, review eligibility, and register individually or as a team."],
  ["Take on Real-World Challenges", "Work on practical problems inspired by sponsor-defined challenge statements."],
  ["Demonstrate Your Skills", "Present your solution and showcase your thinking to the judging panel."],
  ["Win & Get Recognised", "Earn prizes and credentials. Eligible winners may feature in media and the Hall of Fame."],
  ["Get Discovered by Employers", "With your consent, verified achievements are showcased to participating employers."],
  ["Unlock Hiring Opportunities", "Connect with employers through the Talent Auction marketplace and receive offers."],
];
const HowItWorks = () => (
  <section className="bg-primary py-16 text-primary-foreground md:py-24">
    <div className="container">
      <Heading invert eyebrow="How It Works" first="From Registration" second="to Recognition." />
      <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-primary-foreground/20 bg-primary-foreground/15 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map(([t, d], i) => (
          <motion.div {...reveal} key={t} className="bg-primary p-7">
            <span className="font-display text-3xl font-bold text-primary-foreground/40">0{i + 1}</span>
            <h3 className="mt-3 font-display text-lg font-bold">{t}</h3>
            <p className="mt-2 text-sm text-primary-foreground/75">{d}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* 7. Prizes */
const Prizes = () => (
  <Section id="prizes">
    <Heading eyebrow="Prizes & Rewards" first="Great Skills Deserve" second="Great Recognition." sub="Compete for cash prizes, professional recognition, and opportunities that can accelerate your career." />
    <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-2">
      {[
        { l: "Champion", a: "₹50,000", p: ["Winner's certificate", "Featured winner profile", "Media and PR opportunities", "Employer discovery opportunities"], dark: true },
        { l: "Runner-Up", a: "₹2,50,000", p: ["Runner-up recognition", "Achievement certificate", "Profile visibility opportunities", "Employer discovery opportunities"] },
      ].map((x) => (
        <motion.div {...reveal} key={x.l} className={cn("rounded-2xl border p-8 shadow-sm md:p-10", x.dark ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card")}>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em]"><Trophy className="h-4 w-4" /> {x.l}</div>
          <p className="mt-4 font-display text-5xl font-bold">{x.a}<span className="text-lg align-top">*</span></p>
          <ul className="mt-6 space-y-2.5 text-sm">{x.p.map((i) => <li key={i} className="flex gap-2"><BadgeCheck className="h-4 w-4 shrink-0" /> {i}</li>)}</ul>
        </motion.div>
      ))}
    </div>
    <p className="mt-6 text-center text-sm text-muted-foreground">Additional rewards may include sponsor prizes, mentorship, interview opportunities and industry networking, depending on the event.</p>
  </Section>
);

/* 8. Media */
const Media = () => (
  <Section>
    <Box className="grid items-center gap-10 p-0 md:p-0 lg:grid-cols-2 overflow-hidden">
      <div className="p-6 md:p-10">
        <Heading align="left" eyebrow="National Media & PR Spotlight" first="Your Achievement Deserves" second="a National Audience." sub="Winning a TalentCIR Hackathon is more than a result. It's a chance to showcase your capabilities and professional potential." />
        <ul className="grid gap-3 sm:grid-cols-2">
          {["Newspaper features and winner announcements", "Digital PR and online media coverage", "Winner interviews and success stories", "TalentCIR Hall of Fame profiles", "Social media and community features", "Employer-facing achievement showcases"].map((i) => (
            <li key={i} className="flex gap-2 text-sm"><Newspaper className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {i}</li>
          ))}
        </ul>
        <a href="#hall-of-fame" className="mt-7 inline-flex items-center gap-1 text-sm font-semibold text-primary">Explore the Hall of Fame <ArrowRight className="h-4 w-4" /></a>
        <p className="mt-4 text-xs text-muted-foreground">Media placements are subject to editorial selection unless contracted.</p>
      </div>
      <img src={mediaImg} alt="Hackathon winners on stage" className="h-full min-h-[320px] w-full object-cover" />
    </Box>
  </Section>
);

/* 9. Talent Auction */
const auctionSteps = [
  ["Verified Profiles", "Candidates showcase skills, credentials, projects and competition results."],
  ["Employer Discovery", "Participating companies search and shortlist relevant candidates."],
  ["Competitive Offers", "Employers submit salary offers through transparent, rule-based bidding."],
  ["Candidate Choice", "Candidates review opportunities, compare terms and decide which to accept."],
  ["Hiring Completion", "Employers and candidates complete interviews, verification and onboarding."],
];
const Auction = () => (
  <section id="talent-auction" className="scroll-mt-28 bg-primary py-16 text-primary-foreground md:py-24">
    <div className="container grid gap-12 lg:grid-cols-2 lg:gap-16">
      <div>
        <Heading align="left" invert eyebrow="TalentCIR Exclusive Concept" first="Where Top Talent Attracts" second="Top Employers." />
        <p className="font-semibold">Your skills create value. Your achievements open doors.</p>
        <p className="mt-3 text-sm leading-relaxed text-primary-foreground/80 md:text-base">The Talent Auction marketplace brings exceptional hackathon performers and participating employers together. Employers discover verified winner profiles, express hiring interest and submit competitive offers through a structured process.</p>
        <div className="mt-8 flex flex-wrap gap-4"><Cta invert to={REGISTER} label="Explore Talent Auction" /><Cta invert outline to={SPONSOR} label="Hire Winning Talent" /></div>
        <p className="mt-6 text-xs text-primary-foreground/60">Candidate consent, privacy and freedom to choose an offer are central to every auction.</p>
      </div>
      <motion.ol {...reveal} className="rounded-2xl border border-primary-foreground/20">
        {auctionSteps.map(([t, d], i) => (
          <li key={t} className="flex gap-4 border-b border-primary-foreground/15 p-5 last:border-0">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-foreground text-sm font-bold text-primary">{i + 1}</span>
            <div><p className="font-semibold">{t}</p><p className="mt-1 text-sm text-primary-foreground/75">{d}</p></div>
          </li>
        ))}
      </motion.ol>
    </div>
  </section>
);

/* 10. Sponsors */
const Sponsors = () => (
  <Section id="sponsors">
    <Heading eyebrow="For Corporate Sponsors" first="Don't Just Hire Talent." second="Discover It Before Everyone Else." sub="Partner with TalentCIR to create industry challenges, build your employer brand and engage high-potential candidates." />
    <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <motion.img {...reveal} src={sponsorImg} alt="Corporate sponsors at an industry event" className="h-full min-h-[300px] w-full rounded-2xl object-cover" />
      <Box>
        <p className="mb-5 font-display text-lg font-bold">Why sponsor a TalentCIR Hackathon?</p>
        <div className="grid gap-5 sm:grid-cols-2">
          {[[Eye, "Discover High-Potential Talent", "Watch participants solve challenges relevant to your business."], [Megaphone, "Build Employer Brand Visibility", "Event branding, sponsor profiles and agreed campaigns."], [Target, "Set Real Industry Challenges", "Bring business problems and evaluate solution quality."], [Users, "Engage Future Professionals", "Join judging and explore candidates for open roles."]].map(([Icon, t, d]) => {
            const I = Icon as typeof Eye;
            return <div key={t as string}><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><I className="h-5 w-5 text-primary" /></span><p className="mt-3 font-semibold">{t as string}</p><p className="mt-1 text-sm text-muted-foreground">{d as string}</p></div>;
          })}
        </div>
        <div className="mt-8 flex flex-wrap gap-4"><Cta to={SPONSOR} label="Become a Corporate Sponsor" /><Cta outline to={SPONSOR} label="Request the Sponsorship Deck" /></div>
      </Box>
    </div>
  </Section>
);

/* 11. Employers */
const Employers = () => (
  <Section>
    <Box className="grid gap-10 lg:grid-cols-2">
      <div>
        <Heading align="left" eyebrow="For Employers & Recruiters" first="Hire Proven Performers," second="Not Just Resumes." sub="TalentCIR gives employers a new way to discover talent through demonstrated performance, industry challenges and verified achievements." />
        <div className="flex flex-wrap gap-4"><Cta to={SPONSOR} label="Start Hiring with TalentCIR" /><Cta outline to="/pricing?tab=employers" label="Explore Employer Plans" /></div>
      </div>
      <ul className="grid gap-3">
        {["Discover hackathon winners and high-performing participants.", "Access profiles with skills, portfolios and competition credentials.", "Filter talent by industry, role, skill set, location and experience.", "Shortlist candidates and initiate interview requests.", "Submit hiring offers through the Talent Auction marketplace.", "Track candidate engagement and recruitment progress."].map((t, i) => (
          <li key={t} className="flex items-center gap-4 rounded-xl border border-border bg-background p-4 text-sm"><span className="font-display font-bold text-primary">0{i + 1}</span> {t}</li>
        ))}
      </ul>
    </Box>
  </Section>
);

/* 12. Hall of fame */
const winners = [
  { n: "Ananya Rao", h: "AI Innovation Hackathon", c: "Bengaluru · 2026", a: "Champion", img: w1 },
  { n: "Rahul Verma", h: "FinTech Build Challenge", c: "Mumbai · 2026", a: "Runner-Up", img: w2 },
  { n: "Priya Nair", h: "Growth Marketing Sprint", c: "Delhi · 2026", a: "Champion", img: w3 },
  { n: "Vikram Shah", h: "Robotics Prototype Cup", c: "Pune · 2026", a: "Runner-Up", img: w4 },
];
const HallOfFame = () => (
  <Section id="hall-of-fame">
    <Heading eyebrow="Winners Hall of Fame" first="Meet the Talent" second="That Stood Out." sub="Celebrate exceptional performers who turned their skills into recognised achievements." />
    <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {winners.map((w) => (
        <motion.div {...reveal} key={w.n} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <img src={w.img} alt={w.n} className="aspect-square w-full object-cover" />
          <div className="p-5">
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">{w.a}</span>
            <p className="mt-3 font-display text-lg font-bold">{w.n}</p>
            <p className="text-sm text-muted-foreground">{w.h}</p>
            <p className="mt-1 text-xs text-muted-foreground">{w.c}</p>
          </div>
        </motion.div>
      ))}
    </div>
    <p className="mt-6 text-center text-xs text-muted-foreground">Sample profiles shown for layout. Real winners will appear after verified results.</p>
    <div className="mt-6 flex justify-center"><Cta outline to={REGISTER} label="View All Winners" /></div>
  </Section>
);

/* 13. Judges */
const judges = [
  { n: "Arjun Mehta", r: "Head of Data Science", e: "AI & Analytics", img: j1 },
  { n: "Kavya Iyer", r: "VP Engineering", e: "Software & Product", img: j2 },
  { n: "Meera Kapoor", r: "Marketing Director", e: "Growth & Brand", img: j3 },
  { n: "Rohan Desai", r: "FinTech Founder", e: "Finance & FinTech", img: j4 },
];
const Judges = () => (
  <Section>
    <Box>
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <Heading align="left" eyebrow="Judges & Industry Experts" first="Evaluated by People Who" second="Understand the Industry." sub="Industry leaders, technical specialists and subject-matter experts evaluate every submission using transparent, challenge-specific criteria." />
          <Cta to={SPONSOR} label="Become a Judge" />
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {judges.map((j) => (
            <div key={j.n} className="text-center">
              <img src={j.img} alt={j.n} className="mx-auto aspect-[3/4] w-full rounded-xl object-cover" />
              <p className="mt-3 text-sm font-semibold">{j.n}</p>
              <p className="text-xs text-muted-foreground">{j.r}</p>
              <p className="text-[11px] font-medium text-primary">{j.e}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-6 text-xs text-muted-foreground">Sample judges shown; only confirmed judges will be published.</p>
    </Box>
  </Section>
);

/* 14. FAQ */
const faqs = [
  ["Who can participate in TalentCIR Hackathons?", "Students, graduates and working professionals can take part, subject to each event's eligibility criteria."],
  ["Are the hackathons conducted across India?", "Yes. Events run in major metropolitan cities across India, with some online formats."],
  ["What prizes can participants win?", "Cash prizes for champions and runners-up, plus certificates, profile visibility and employer discovery opportunities."],
  ["How are winners selected?", "Industry judges score submissions against transparent, challenge-specific criteria."],
  ["Will winners be featured in newspapers and online PR?", "Selected winners may receive media and PR opportunities, subject to editorial selection."],
  ["What is the Talent Auction marketplace?", "A hiring marketplace where employers discover verified winners and submit structured offers."],
  ["Can employers bid to hire hackathon winners?", "Employers can submit competitive offers under defined platform rules. Candidates always choose freely."],
  ["Do I need to pay to participate?", "Fees vary by event and are shown clearly on each hackathon's details page."],
  ["How can my company sponsor a hackathon?", "Choose Become a Sponsor and our partnerships team will share the sponsorship deck."],
];
const Faq = () => {
  const [open, setOpen] = useState(0);
  return (
    <Section id="faqs">
      <Heading eyebrow="Frequently Asked Questions" first="Everything You Need" second="to Know." />
      <div className="mx-auto mt-10 max-w-3xl space-y-3">
        {faqs.map(([q, a], i) => (
          <div key={q} className="rounded-xl border border-border bg-card">
            <button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold">
              {q}<ChevronDown className={cn("h-4 w-4 shrink-0 text-primary transition", open === i && "rotate-180")} />
            </button>
            {open === i && <p className="px-5 pb-5 text-sm text-muted-foreground">{a}</p>}
          </div>
        ))}
      </div>
    </Section>
  );
};

/* 15. Final CTA */
const FinalCta = () => (
  <Section>
    <motion.div {...reveal} className="rounded-2xl bg-primary px-6 py-14 text-center text-primary-foreground md:px-16">
      <Gavel className="mx-auto h-8 w-8 text-primary-foreground/70" />
      <h2 className="mt-4 font-display text-3xl font-bold md:text-[2.75rem] md:leading-tight">Your Next Opportunity<br />Could Start Here.</h2>
      <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/80">Compete with purpose. Showcase your skills. Earn recognition. Connect with the companies shaping your future.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-4"><Cta invert to={REGISTER} label="Register for a Hackathon" /><Cta invert outline to={SPONSOR} label="Partner with TalentCIR" /></div>
    </motion.div>
  </Section>
);

const EmployersPage3 = () => (
  <>
    <Helmet>
      <title>TalentCIR Hackathons | Compete, Get Recognised, Get Hired</title>
      <meta name="description" content="India-wide industry hackathons: compete in real challenges, win prizes, earn media recognition and get hired through the TalentCIR Talent Auction." />
      <meta property="og:title" content="TalentCIR Hackathons" />
      <meta property="og:description" content="Compete with the best. Get recognised. Get hired." />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
    </Helmet>
    <Layout>
      <Hero />
      <PageNav />
      <Trust />
      <Intro />
      <Industries />
      <Upcoming />
      <HowItWorks />
      <Prizes />
      <Media />
      <Auction />
      <Sponsors />
      <Employers />
      <HallOfFame />
      <Judges />
      <Faq />
      <FinalCta />
    </Layout>
  </>
);

export default EmployersPage3;
