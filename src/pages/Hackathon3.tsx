import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, BarChart3, BrainCircuit, Briefcase, CheckCircle2, Code2, Cpu, Eye, Gavel, HeartPulse, Landmark, Megaphone, Newspaper, Search, Sparkles, Target, Trophy, Users } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import arena from '@/assets/hackathon-arena-hero.jpg';
import hero from '@/assets/hackathon-hero.jpg';
import event1 from '@/assets/hackathon-event-1.jpg';
import event2 from '@/assets/hackathon-event-2.jpg';
import './hackathon2.css';

const navItems = [['Overview', 'ht3-overview'], ['Industries', 'ht3-industries'], ['Upcoming Events', 'ht3-upcoming'], ['Prizes', 'ht3-prizes'], ['Hall of Fame', 'ht3-fame'], ['Talent Auction', 'ht3-auction'], ['Sponsors', 'ht3-sponsors'], ['FAQs', 'ht3-faq']];
const trust = ['Industry-Sponsored Challenges', 'Multiple Industry Domains', 'Metropolitan City Events', 'National Media Recognition', 'Exclusive Talent Discovery', 'Employer Hiring Opportunities'];
const benefits = [
  { icon: Code2, title: 'Compete', text: 'Solve practical challenges that test your abilities.' },
  { icon: Award, title: 'Get Recognised', text: 'Showcase your achievements through winner profiles and media opportunities.' },
  { icon: Briefcase, title: 'Get Hired', text: 'Connect with employers looking for proven talent.' },
];
const industries = [
  { icon: BrainCircuit, title: 'AI & Data Science', text: 'Build intelligent solutions, analyse data, and solve complex problems.', cta: 'Explore AI Hackathons' },
  { icon: Code2, title: 'IT & Software Development', text: 'Showcase coding, software engineering, and product development skills.', cta: 'Explore IT Hackathons' },
  { icon: Megaphone, title: 'Digital Marketing & Growth', text: 'Demonstrate SEO, performance marketing, analytics, and growth strategy.', cta: 'Explore Marketing Hackathons' },
  { icon: Landmark, title: 'Finance & FinTech', text: 'Tackle financial analysis, business modelling, and fintech challenges.', cta: 'Explore Finance Hackathons' },
  { icon: Cpu, title: 'Engineering & Robotics', text: 'Turn technical knowledge into practical prototypes and innovative solutions.', cta: 'Explore Engineering Hackathons' },
  { icon: HeartPulse, title: 'Healthcare & Life Sciences', text: 'Explore healthcare innovation, health technology, and research challenges.', cta: 'Explore Healthcare Hackathons' },
];
const moreIndustries = ['Sales', 'Business Management', 'Design', 'Supply Chain', 'Human Resources', 'Sustainability', 'Entrepreneurship'];
const events = [
  { name: 'National AI Innovation Hackathon', industry: 'AI & Data Science', city: 'Bengaluru', format: 'Team / Individual', deadline: 'Registration Open', prize: '₹50,000' },
  { name: 'FinTech Builders Challenge', industry: 'Finance & FinTech', city: 'Mumbai', format: 'Team', deadline: 'Opening Soon', prize: '₹50,000' },
  { name: 'Growth Marketing Sprint', industry: 'Digital Marketing & Growth', city: 'Delhi', format: 'Individual', deadline: 'Opening Soon', prize: '₹50,000' },
];
const steps = [
  ['01', 'Discover & Register', 'Choose an industry hackathon, review the eligibility criteria, and register individually or as a team.'],
  ['02', 'Take on Real-World Challenges', 'Work on practical problems inspired by industry needs and sponsor-defined challenge statements.'],
  ['03', 'Demonstrate Your Skills', 'Present your solution, showcase your thinking, and demonstrate your capabilities to the judging panel.'],
  ['04', 'Win & Get Recognised', "Earn prizes and achievement credentials. Eligible winners may be featured in media coverage and TalentCIR's Hall of Fame."],
  ['05', 'Get Discovered by Employers', 'With your consent, your verified achievements and professional profile can be showcased to participating employers.'],
  ['06', 'Unlock Hiring Opportunities', "Connect with employers through TalentCIR's Talent Auction marketplace, where companies can express interest and submit hiring offers."],
];
const prizes = [
  { label: 'Champion', amount: '₹50,000', items: ["Winner's certificate", 'Featured winner profile', 'Media and PR opportunities', 'Employer discovery opportunities'] },
  { label: 'Runner-Up', amount: '₹2,50,000', items: ['Runner-up recognition', 'Achievement certificate', 'Profile visibility opportunities', 'Employer discovery opportunities'] },
];
const media = ['Newspaper features and winner announcements', 'Digital PR publications and online media coverage', 'Winner interviews and professional success stories', 'TalentCIR Hall of Fame profiles', 'Social media and industry community features', 'Employer-facing achievement showcases'];
const auction = [
  ['Verified Profiles', 'Candidates showcase their skills, credentials, projects, and competition results.'],
  ['Employer Discovery', 'Participating companies search and shortlist relevant candidates.'],
  ['Competitive Offers', 'Employers submit salary offers or take part in transparent offer-based bidding, subject to platform rules.'],
  ['Candidate Choice', 'Candidates review opportunities, compare terms, and decide which offers to accept.'],
  ['Hiring Completion', 'Employers and candidates complete interviews, verification, and onboarding.'],
];
const sponsorPerks = [
  { icon: Search, title: 'Discover High-Potential Talent', text: 'Observe participants solving challenges relevant to your business and identify promising candidates.' },
  { icon: Eye, title: 'Build Employer Brand Visibility', text: 'Showcase your organisation through event branding, sponsor profiles, and agreed promotional campaigns.' },
  { icon: Target, title: 'Set Real Industry Challenges', text: "Bring business problems to the competition and evaluate the quality of participants' solutions." },
  { icon: Users, title: 'Engage Future Professionals', text: 'Interact with emerging talent, participate in judging, and explore suitable candidates for open roles.' },
];
const employerBenefits = ['Discover hackathon winners and high-performing participants.', 'Access candidate profiles with skills, portfolios, and competition credentials.', 'Filter talent by industry, role, skill set, location, and experience.', 'Shortlist candidates and initiate interview requests.', 'Submit hiring offers through the Talent Auction marketplace.', 'Track candidate engagement and recruitment progress.'];
const winners = [
  { image: event1, award: 'Champion', title: 'AI & Data Science', meta: 'Bengaluru · 2026' },
  { image: event2, award: 'Runner-Up', title: 'Finance & FinTech', meta: 'Mumbai · 2026' },
  { image: hero, award: 'Champion', title: 'Digital Marketing & Growth', meta: 'Delhi · 2026' },
];
const judgeProfile = ['Name, role, and company', 'Area of expertise', 'Industry experience', 'Hackathons or challenges evaluated'];
const faqs = [
  ['Who can participate in TalentCIR Hackathons?', 'Students, graduates and working professionals can participate, subject to the eligibility criteria listed on each hackathon.'],
  ['Are the hackathons conducted across India?', 'Yes. Competitions are held across metropolitan cities in India, with some events open to online participation.'],
  ['What prizes can participants win?', 'Cash prizes, certificates, featured winner profiles, media opportunities and employer discovery. Sponsor prizes vary by event.'],
  ['How are winners selected?', 'An industry judging panel evaluates every submission using transparent, challenge-specific criteria.'],
  ['Will winners be featured in newspapers and online PR?', 'Selected winners can receive media and PR opportunities. Placements depend on the event and editorial selection.'],
  ['What is the Talent Auction marketplace?', 'A dedicated hiring space where verified hackathon performers and participating employers connect through a structured offer process.'],
  ['Can employers bid to hire hackathon winners?', 'Employers can submit competitive offers under platform rules. Candidates always choose which offer, if any, to accept.'],
  ['Do I need to pay to participate?', 'Fees depend on the hackathon. Each event page shows whether registration is free or paid.'],
  ['How can my company sponsor a hackathon?', 'Select Become a Sponsor and our partnerships team will share the sponsorship deck and next steps.'],
];
const logos = ['google', 'microsoft', 'amazon', 'flipkart', 'infosys', 'tcs'];

function Heading({ eyebrow, first, second, description }: { eyebrow: string; first: string; second?: string; description?: string }) {
  return <div className="ht2-heading"><span className="ht2-eyebrow">{eyebrow}</span><h2 className="ht2-title">{first}{second && <><br /><span className="text-primary">{second}</span></>}</h2>{description && <p className="ht2-copy">{description}</p>}</div>;
}
function Cta({ label, to = '/auth?mode=signup', outline = false, secondary = false }: { label: string; to?: string; outline?: boolean; secondary?: boolean }) {
  return <Button asChild variant={secondary ? 'secondary' : outline ? 'outline' : 'default'} className="rounded-full gap-2"><Link to={to}>{label}<ArrowRight className="h-4 w-4" /></Link></Button>;
}

export default function Hackathon3() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });

  return <Layout><Helmet>
    <title>Hackathons · Compete. Get Recognised. Get Hired. | TalentCIR</title>
    <meta name="description" content="India-wide industry hackathons by TalentCIR: real challenges, cash prizes, national recognition and hiring through Talent Auction." />
    <meta property="og:title" content="Hackathons · Compete. Get Recognised. Get Hired. | TalentCIR" />
    <meta property="og:description" content="Compete in industry hackathons, earn recognition and get discovered by employers." />
    <meta property="og:type" content="website" /><meta name="twitter:card" content="summary_large_image" />
  </Helmet><div className="hackathon2">
    {/* 1. Hero */}
    <section id="ht3-overview" className="ht2-hero ht2-tint scroll-mt-24"><div className="container ht2-wrap">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="h2-root"><div className="h2-hero ht3-hero-copy" style={{ padding: 0, minHeight: 0, display: 'block', background: 'transparent' }}><div className="h2-hero-copy"><span className="h2-eyebrow">India-Wide Industry Hackathons</span><h1>Compete with the Best.<span className="h2-hero-accent">Get Recognised. Get Hired.</span><em>Real-World Challenges. Cash Prizes. National Recognition. All Connected.</em></h1><p className="h2-hero-lede">Prove your skills through real-world industry challenges. Compete with top talent, win exciting cash prizes, earn national media recognition, and get discovered by leading companies through TalentCIR.</p><div className="h2-hero-actions"><button type="button" className="h2-btn h2-btn-primary" onClick={() => scrollTo('ht3-upcoming')}>Explore Hackathons<ArrowRight /></button><button type="button" className="h2-btn h2-btn-ghost" onClick={() => scrollTo('ht3-sponsors')}>Become a Sponsor</button></div><p className="h2-hero-trust">Win <span>cash prizes</span>, earn <span>national media recognition</span> and get discovered by leading companies.</p><ul className="h2-hero-chips">{benefits.map(({ icon: Icon, title, text }) => <li key={title}><Icon size={20} /><div><b className="block text-sm font-semibold">{title}</b><span>{text}</span></div></li>)}</ul></div></div></div>
        <div className="relative"><img src={arena} className="ht2-hero-image" alt="Participants competing at a TalentCIR hackathon" /><div className="absolute bottom-5 left-5 rounded-md bg-card px-4 py-3"><p className="text-xs text-muted-foreground">Pan-India</p><p className="font-bold text-primary">City Competitions</p></div></div>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">{[['₹50,000', 'Champion Prize*'], ['₹2,50,000', 'Runner-Up Prize*'], ['Pan-India', 'City Competitions']].map(([value, label]) => <div className="ht2-surface rounded-md p-5" key={label}><p className="text-xs text-muted-foreground">{label}</p><p className="mt-2 font-display text-3xl font-bold">{value}</p></div>)}</div>
      <p className="mt-3 text-xs text-muted-foreground">*Prize amounts vary by event and are confirmed on each hackathon page.</p>
    </div></section>

    {/* Page navigation */}
    <nav aria-label="Hackathon sections" className="ht2-surface ht2-line"><div className="container ht2-wrap flex gap-2 overflow-x-auto py-3">{navItems.map(([label, id]) => <button key={id} type="button" onClick={() => scrollTo(id)} className="ht2-pill whitespace-nowrap px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-primary">{label}</button>)}</div></nav>

    {/* 2. Trust strip */}
    <div className="ht2-ribbon ht2-soft"><div className="ht2-marquee">{[0, 1].map(repeat => <div key={repeat} aria-hidden={repeat === 1} className="flex items-center gap-12">{trust.map(item => <span className="flex items-center gap-12 whitespace-nowrap text-sm font-medium" key={item}>{item}<Sparkles className="h-4 w-4 text-primary" /></span>)}</div>)}</div></div>

    {/* 3. Introduction */}
    <section className="ht2-band ht2-dark"><div className="container ht2-wrap grid items-center gap-10 md:grid-cols-2"><div><span className="ht2-eyebrow">More than a hackathon</span><h2 className="ht2-title">Where Skills<br />Meet Opportunity.</h2><p className="ht2-copy">TalentCIR Hackathons discover, evaluate, and celebrate exceptional talent across industries. Participants compete in real-world challenges built around industry needs, while leading companies engage with emerging professionals.</p><p className="ht2-copy">From the competition floor to national media coverage and the Talent Auction marketplace, we turn demonstrated skills into meaningful career opportunities.</p><div className="mt-7 grid gap-5 sm:grid-cols-3">{benefits.map(({ icon: Icon, title, text }) => <div key={title}><Icon className="h-6 w-6" /><p className="mt-3 font-bold">{title}</p><p className="mt-1 text-xs opacity-75">{text}</p></div>)}</div></div><img src={event1} className="ht2-photo" alt="Participants presenting solutions at a hackathon" loading="lazy" /></div></section>
    <div className="container ht2-wrap py-8"><div className="flex flex-wrap items-center justify-between gap-6">{logos.map(logo => <img key={logo} src={`/company-logos/${logo}.svg`} alt={logo} className="h-9 w-24 object-contain" loading="lazy" />)}</div></div>

    {/* 4. Industries */}
    <section id="ht3-industries" className="ht2-band ht2-surface scroll-mt-24"><div className="container ht2-wrap"><Heading eyebrow="Explore hackathons by industry" first="One Platform. Every Industry." second="Endless Possibilities." description="Discover competitions that match your skills, interests, and career ambitions." /><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{industries.map(({ icon: Icon, title, text, cta }) => <article key={title} className="ht2-tint ht2-track-card rounded-md p-7"><Icon className="mb-6 h-10 w-10 text-primary" /><h3 className="text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p><button type="button" onClick={() => scrollTo('ht3-upcoming')} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">{cta}<ArrowRight className="h-4 w-4" /></button></article>)}</div><div className="mt-7 flex flex-wrap items-center gap-2"><span className="mr-2 text-sm text-muted-foreground">Also coming:</span>{moreIndustries.map(item => <span key={item} className="ht2-pill border border-border px-3 py-1 text-xs font-medium">{item}</span>)}</div><div className="mt-8"><Button variant="outline" className="rounded-full" onClick={() => scrollTo('ht3-upcoming')}>View All Industry Hackathons<ArrowRight className="h-4 w-4" /></Button></div></div></section>

    {/* 5. Upcoming */}
    <section id="ht3-upcoming" className="ht2-band ht2-soft scroll-mt-24"><div className="container ht2-wrap"><Heading eyebrow="Upcoming hackathons" first="Your Next Big Opportunity" second="Starts Here." description="Find an upcoming competition, explore its challenges, and register to showcase your skills." /><div className="border-t border-border">{events.map((event, index) => <div key={event.name} className="ht2-event-row ht2-line grid items-center py-6"><img src={[hero, event2, event1][index]} alt="" className="h-[100px] rounded-md object-cover" loading="lazy" /><div><p className="text-xs font-semibold uppercase text-primary">{event.deadline}</p><h3 className="mt-1 text-xl font-bold">{event.name}</h3><p className="mt-1 text-sm text-muted-foreground">{event.industry} · {event.city} · {event.format}</p></div><p><span className="block text-xs text-muted-foreground">Champion prize</span><span className="font-bold">{event.prize}</span></p><Cta label="View Details" to={`/auth?${new URLSearchParams({ mode: 'signup', event: event.name })}`} outline /></div>)}</div></div></section>

    {/* 6. How it works */}
    <section className="ht2-band ht2-surface"><div className="container ht2-wrap"><Heading eyebrow="How it works" first="From Registration" second="to Recognition." description="Six clear steps take you from your first registration to real hiring opportunities." /><div className="grid gap-6 md:grid-cols-3">{steps.slice(0, 3).map(([n, title, text]) => <article key={n} className="ht2-tint rounded-md p-7"><span className="text-xs text-primary">STEP {n}</span><h3 className="mt-2 text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p></article>)}</div><div className="mt-7 grid gap-5 md:grid-cols-3">{steps.slice(3).map(([n, title, text]) => <div key={n} className="flex gap-5 border-t border-border py-5"><span className="text-2xl font-bold text-primary">{n}</span><div><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-muted-foreground">{text}</p></div></div>)}</div></div></section>

    {/* 7. Prizes */}
    <section id="ht3-prizes" className="ht2-band ht2-tint scroll-mt-24"><div className="container ht2-wrap"><Heading eyebrow="Prizes & rewards" first="Great Skills Deserve" second="Great Recognition." description="Compete for cash prizes, professional recognition, and opportunities that can accelerate your career." /><div className="grid gap-6 md:grid-cols-2">{prizes.map((prize, index) => <article key={prize.label} className={`rounded-md p-8 ${index === 0 ? 'ht2-dark' : 'ht2-surface'}`}><Trophy className="h-8 w-8" /><p className="mt-5 text-xs font-semibold uppercase opacity-75">{prize.label}</p><p className="mt-2 font-display text-5xl font-bold">{prize.amount}</p><ul className="mt-6 space-y-3">{prize.items.map(item => <li key={item} className="flex items-center gap-3 text-sm"><CheckCircle2 className="h-4 w-4 shrink-0" />{item}</li>)}</ul></article>)}</div><p className="mt-6 text-sm text-muted-foreground">Additional rewards may include sponsor prizes, mentorship, interview opportunities, and industry networking, depending on the event.</p></div></section>

    {/* 8. Media & PR */}
    <section className="ht2-band ht2-surface"><div className="container ht2-wrap"><div className="ht2-feature-grid grid items-center md:grid-cols-2"><img src={event2} alt="Hackathon winners on stage" className="ht2-photo" loading="lazy" /><div><span className="ht2-eyebrow">National media & PR spotlight</span><h2 className="ht2-title">Your Achievement Deserves<br /><span className="text-primary">a National Audience.</span></h2><p className="ht2-copy">Winning a TalentCIR Hackathon is more than a competition result. It's a chance to showcase your capabilities, accomplishments, and professional potential. Selected winners can receive:</p><ul className="mt-6 grid gap-3 sm:grid-cols-2">{media.map(item => <li key={item} className="flex gap-3 text-sm"><Newspaper className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{item}</li>)}</ul><div className="mt-7"><Button className="rounded-full" onClick={() => scrollTo('ht3-fame')}>Explore the Hall of Fame<ArrowRight className="h-4 w-4" /></Button></div></div></div></div></section>

    {/* 9. Talent Auction */}
    <section id="ht3-auction" className="ht2-band ht2-dark scroll-mt-24"><div className="container ht2-wrap"><div className="grid gap-10 lg:grid-cols-2"><div><span className="ht2-eyebrow">TalentCIR exclusive concept</span><h2 className="ht2-title">Where Top Talent Attracts<br />Top Employers.</h2><p className="ht2-copy">Your skills create value. Your achievements open doors. Talent Auction brings exceptional hackathon performers and participating employers together in one dedicated hiring ecosystem.</p><p className="ht2-copy">Employers discover verified winner profiles, assess skills and achievements, express hiring interest, and submit competitive offers through a structured process. Candidates always choose.</p><div className="mt-7 flex flex-wrap gap-3"><Cta label="Explore Talent Auction" secondary /><Button asChild variant="outline" className="rounded-full border-current bg-transparent text-current hover:bg-card hover:text-primary"><Link to="/for-employers">Hire Winning Talent<ArrowRight className="h-4 w-4" /></Link></Button></div></div><ol className="space-y-0">{auction.map(([title, text], index) => <li key={title} className="flex gap-5 border-t border-current/20 py-5" style={{ borderColor: 'hsl(var(--hackathon-on-dark) / .2)' }}><span className="text-2xl font-bold opacity-60">0{index + 1}</span><div><h3 className="font-bold">{title}</h3><p className="mt-1 text-sm opacity-75">{text}</p></div></li>)}</ol></div></div></section>

    {/* 10. Sponsors */}
    <section id="ht3-sponsors" className="ht2-band ht2-surface scroll-mt-24"><div className="container ht2-wrap"><Heading eyebrow="For corporate sponsors" first="Don't Just Hire Talent." second="Discover It Before Everyone Else." description="Partner with TalentCIR to create industry challenges, build your employer brand, and engage with high-potential candidates through practical competitions." /><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">{sponsorPerks.map(({ icon: Icon, title, text }) => <article key={title} className="ht2-tint rounded-md p-7"><Icon className="mb-6 h-9 w-9 text-primary" /><h3 className="text-lg font-bold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p></article>)}</div><div className="mt-8 flex flex-wrap gap-3"><Cta label="Become a Corporate Sponsor" to="/contact" /><Cta label="Request the Sponsorship Deck" to="/contact" outline /></div></div></section>

    {/* 11. Employers */}
    <section className="ht2-band ht2-tint"><div className="container ht2-wrap"><div className="ht2-feature-grid grid items-center md:grid-cols-2"><div><span className="ht2-eyebrow">For employers & recruiters</span><h2 className="ht2-title">Hire Proven Performers,<br /><span className="text-primary">Not Just Resumes.</span></h2><p className="ht2-copy">TalentCIR gives employers a new way to discover talent through demonstrated performance, industry challenges, and verified achievements.</p><ul className="mt-6 space-y-3">{employerBenefits.map(item => <li key={item} className="flex gap-3 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{item}</li>)}</ul><div className="mt-7 flex flex-wrap gap-3"><Cta label="Start Hiring with TalentCIR" to="/for-employers" /><Cta label="Explore Employer Plans" to="/pricing?tab=employers" outline /></div></div><img src={hero} alt="Employers reviewing hackathon submissions" className="ht2-photo" loading="lazy" /></div></div></section>

    {/* 12. Hall of Fame */}
    <section id="ht3-fame" className="ht2-band ht2-surface scroll-mt-24"><div className="container ht2-wrap"><Heading eyebrow="Winners hall of fame" first="Meet the Talent" second="That Stood Out." description="Celebrate exceptional performers who turned their skills into recognised achievements." /><div className="grid gap-6 md:grid-cols-3">{winners.map(winner => <article key={winner.title} className="ht2-tint overflow-hidden rounded-md"><img src={winner.image} alt={`${winner.title} hackathon winners`} className="h-56 w-full object-cover" loading="lazy" /><div className="p-6"><p className="flex items-center gap-2 text-xs font-semibold uppercase text-primary"><Award className="h-4 w-4" />{winner.award}</p><h3 className="mt-2 text-lg font-bold">{winner.title}</h3><p className="mt-1 text-sm text-muted-foreground">{winner.meta}</p></div></article>)}</div><div className="mt-8"><Cta label="View All Winners" outline /></div></div></section>

    {/* 13. Judges */}
    <section className="ht2-band ht2-tint"><div className="container ht2-wrap grid items-center gap-10 md:grid-cols-2"><div><span className="ht2-eyebrow">Hackathon judges & industry experts</span><h2 className="ht2-title">Evaluated by People Who<br /><span className="text-primary">Understand the Industry.</span></h2><p className="ht2-copy">Industry leaders, experienced professionals, technical specialists, and subject-matter experts evaluate every performance using transparent, challenge-specific criteria.</p><div className="mt-7"><Cta label="Become a Judge" to="/contact" /></div></div><div className="ht2-surface rounded-md p-8"><Gavel className="h-9 w-9 text-primary" /><h3 className="mt-5 text-lg font-bold">Every judge profile shows</h3><ul className="mt-5 space-y-3">{judgeProfile.map(item => <li key={item} className="flex items-center gap-3 text-sm"><BarChart3 className="h-4 w-4 shrink-0 text-primary" />{item}</li>)}</ul></div></div></section>

    {/* 14. FAQ */}
    <section id="ht3-faq" className="ht2-band ht2-surface scroll-mt-24"><div className="container ht2-wrap grid gap-10 lg:grid-cols-[1fr_1.4fr]"><Heading eyebrow="Frequently asked questions" first="Questions," second="Answered." description="Everything you need to know before you compete, sponsor or hire." /><Accordion type="single" collapsible>{faqs.map(([q, a], i) => <AccordionItem key={q} value={`faq-${i}`}><AccordionTrigger className="text-left">{q}</AccordionTrigger><AccordionContent className="text-muted-foreground">{a}</AccordionContent></AccordionItem>)}</Accordion></div></section>

    {/* 15. Final CTA */}
    <section className="ht2-band ht2-dark"><div className="container ht2-wrap text-center"><span className="ht2-eyebrow">Compete → Get Recognised → Get Hired</span><h2 className="ht2-title">Your Next Opportunity<br />Could Start Here.</h2><p className="ht2-copy mx-auto">Compete with purpose. Showcase your skills. Earn recognition. Connect with the companies shaping your future.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Cta label="Register for a Hackathon" secondary /><Button asChild variant="outline" className="rounded-full border-current bg-transparent text-current hover:bg-card hover:text-primary"><Link to="/contact">Partner with TalentCIR<ArrowRight className="h-4 w-4" /></Link></Button></div></div></section>
  </div></Layout>;
}
