import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BrainCircuit,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code2,
  Handshake,
  Lightbulb,
  MapPin,
  MessageCircle,
  Play,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import hackathonHero from "@/assets/hackathon-hero.jpg";
import hackathonEvent1 from "@/assets/hackathon-event-1.jpg";
import hackathonEvent2 from "@/assets/hackathon-event-2.jpg";
import learnerAnanya from "@/assets/learner-ananya.jpg";
import learnerRahul from "@/assets/learner-rahul.jpg";
import learnerPriya from "@/assets/learner-priya.jpg";
import googleLogo from "@/assets/company-logos/google.svg";
import microsoftLogo from "@/assets/company-logos/microsoft.svg";
import amazonLogo from "@/assets/company-logos/amazon.svg";
import accentureLogo from "@/assets/company-logos/accenture.svg";
import infosysLogo from "@/assets/company-logos/infosys.svg";
import ibmLogo from "@/assets/company-logos/ibm.svg";

type SectionHeadingProps = {
  eyebrow: string;
  icon: typeof Trophy;
  first: string;
  second: string;
  descriptionFirst: string;
  descriptionSecond: string;
  align?: "left" | "center";
  inverse?: boolean;
};

const SectionHeading = ({
  eyebrow,
  icon: Icon,
  first,
  second,
  descriptionFirst,
  descriptionSecond,
  align = "center",
  inverse = false,
}: SectionHeadingProps) => (
  <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
    <div
      className={`mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] ${
        inverse ? "text-primary-foreground/75" : "text-primary"
      }`}
    >
      <Icon className="h-4 w-4" />
      {eyebrow}
    </div>
    <h2 className={`font-display text-3xl font-bold leading-[1.12] md:text-5xl ${inverse ? "text-primary-foreground" : "text-foreground"}`}>
      {first}
      <br />
      <span className={inverse ? "text-primary-foreground/70" : "text-primary"}>{second}</span>
    </h2>
    <p className={`mt-5 text-base leading-relaxed md:text-lg ${inverse ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
      {descriptionFirst}
      <br className="hidden md:block" />
      {descriptionSecond}
    </p>
  </div>
);

const challenges = [
  {
    title: "AI-Powered Resume Screener",
    category: "Artificial Intelligence",
    description: "Build a fair, explainable screening tool for high-volume hiring teams.",
    date: "Aug 15–17",
    prize: "₹5,00,000",
    image: hackathonHero,
  },
  {
    title: "FinTech Fraud Detection",
    category: "FinTech & Security",
    description: "Spot suspicious transaction patterns without slowing genuine customers.",
    date: "Sep 12–14",
    prize: "₹2,50,000",
    image: hackathonEvent1,
  },
  {
    title: "Accessible Learning Systems",
    category: "EdTech & Impact",
    description: "Create an inclusive learning experience for different abilities and devices.",
    date: "Oct 03–05",
    prize: "₹1,00,000",
    image: hackathonEvent2,
  },
];

const journey = [
  { icon: Code2, step: "01", title: "Participate", description: "Choose a live brief and build solo or with a team." },
  { icon: Award, step: "02", title: "Get Recognized", description: "Earn verified proof for the work you submit." },
  { icon: Handshake, step: "03", title: "Connect", description: "Meet mentors, judges, and hiring teams directly." },
  { icon: BriefcaseBusiness, step: "04", title: "Get Hired", description: "Turn standout performance into interview opportunities." },
];

const seasons = [
  { image: hackathonEvent2, label: "Campus Challenges", title: "Start where you study", text: "Local problem statements that uncover emerging talent." },
  { image: hackathonHero, label: "National Hackathon", title: "Compete on a bigger stage", text: "A flagship build sprint watched by hiring partners." },
  { image: hackathonEvent1, label: "Career Opportunities", title: "Keep the momentum", text: "Verified projects that stay visible after the event ends." },
];

const criteria = [
  { icon: BrainCircuit, title: "Problem Solving", text: "How clearly you frame and solve the challenge." },
  { icon: Code2, title: "Technical Skills", text: "Quality, reliability, and depth of execution." },
  { icon: Lightbulb, title: "Creativity", text: "Fresh thinking with a practical point of view." },
  { icon: Users, title: "Collaboration", text: "How effectively your team works and communicates." },
  { icon: Target, title: "Real-World Impact", text: "The value and scalability of your final solution." },
];

const testimonials = [
  {
    quote: "The hackathon gave my work a stage. A hiring manager reached out before the final results were announced.",
    name: "Ananya Rao",
    role: "Product Analyst, Bengaluru",
    image: learnerAnanya,
  },
  {
    quote: "I entered to test my skills and left with a verified project, a mentor, and two interview conversations.",
    name: "Rahul Mehta",
    role: "Software Engineer, Pune",
    image: learnerRahul,
  },
  {
    quote: "The brief felt like real work, not a classroom task. That made the feedback genuinely useful for my career.",
    name: "Priya Nair",
    role: "UX Designer, Kochi",
    image: learnerPriya,
  },
];

const partners = [
  { name: "Google", logo: googleLogo },
  { name: "Microsoft", logo: microsoftLogo },
  { name: "Amazon", logo: amazonLogo },
  { name: "Accenture", logo: accentureLogo },
  { name: "Infosys", logo: infosysLogo },
  { name: "IBM", logo: ibmLogo },
];

const faqs = [
  { question: "Who can join an I Am Talento hackathon?", answer: "Students, recent graduates, and working professionals can participate. Each challenge page lists any specific eligibility requirements." },
  { question: "Can I participate without a team?", answer: "Yes. You can enter solo or use the community to find teammates with complementary skills." },
  { question: "How are submissions evaluated?", answer: "Industry judges review problem solving, execution, creativity, collaboration, presentation, and real-world impact." },
  { question: "What do participants receive?", answer: "Eligible participants receive a certificate, verified project proof, expert feedback, and visibility with participating employers." },
];

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55 },
};

const Hackathons = () => {
  const [story, setStory] = useState(0);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const moveStory = (direction: number) => {
    setStory((current) => (current + direction + testimonials.length) % testimonials.length);
  };

  return (
    <Layout>
      <Helmet>
        <title>Hackathons & Challenges | I Am Talento</title>
        <meta name="description" content="Build real projects, compete in industry challenges, and get discovered by hiring teams through I Am Talento hackathons." />
        <meta property="og:title" content="Hackathons & Challenges | I Am Talento" />
        <meta property="og:description" content="Build real projects, compete in industry challenges, and get discovered by hiring teams." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <section className="bg-secondary/45 px-4 pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="container">
          <motion.div {...reveal} className="mx-auto max-w-4xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              <Sparkles className="h-4 w-4" /> Hackathons & Challenges
            </div>
            <h1 className="font-display text-4xl font-bold leading-[1.05] text-foreground sm:text-5xl md:text-7xl">
              Build What Matters.
              <br />
              <span className="text-primary">Get Seen for It.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-xl">
              Solve real industry challenges and put your skills in front of employers.
              <br className="hidden md:block" />
              Your next opportunity can begin with what you build.
            </p>
          </motion.div>

          <motion.div {...reveal} transition={{ duration: 0.65, delay: 0.1 }} className="relative mx-auto mt-12 min-h-[500px] max-w-6xl overflow-hidden rounded-lg bg-foreground shadow-2xl md:min-h-[620px]">
            <img src={hackathonHero} alt="Participants collaborating at an I Am Talento hackathon" className="absolute inset-0 h-full w-full object-cover opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/45 to-transparent" />
            <div className="relative z-10 flex min-h-[500px] flex-col justify-end p-6 md:min-h-[620px] md:p-14 lg:p-16">
              <div className="mb-5 flex flex-wrap items-center gap-3 text-sm text-primary-foreground/80">
                <span className="rounded-md bg-primary px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-foreground">Registration Open</span>
                <span>Online · Global</span>
                <span>Aug 15–17</span>
              </div>
              <h2 className="max-w-4xl font-display text-3xl font-bold leading-tight text-primary-foreground md:text-6xl">Code Arena · Season 4</h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-primary-foreground/75 md:text-xl">
                Build AI-powered tools for real hiring and workforce challenges.
                <br className="hidden md:block" />
                Ship something useful, verified, and ready to be seen.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" onClick={() => scrollTo("upcoming-hackathons")} className="h-12 rounded-md px-7 font-bold">
                  Join the Challenge <ArrowRight />
                </Button>
                <Button size="lg" variant="outline" onClick={() => scrollTo("how-it-works")} className="h-12 rounded-md border-primary-foreground/30 bg-primary-foreground/10 px-7 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground">
                  How It Works <Play />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="upcoming-hackathons" className="scroll-mt-24 py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <SectionHeading eyebrow="Upcoming Hackathons" icon={CalendarDays} first="Find Your Next" second="Challenge to Build." descriptionFirst="Pick a live brief that matches your ambition and strongest skills." descriptionSecond="Join the sprint, build your proof, and get noticed." />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {challenges.map((challenge, index) => (
              <motion.article key={challenge.title} {...reveal} transition={{ duration: 0.5, delay: index * 0.08 }} className="group flex overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl lg:flex-col">
                <div className="relative h-auto min-h-48 w-2/5 overflow-hidden lg:h-60 lg:w-full">
                  <img src={challenge.image} alt={challenge.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
                  <span className="absolute bottom-3 left-3 rounded bg-background/90 px-2.5 py-1 text-[10px] font-bold uppercase text-foreground backdrop-blur-sm">{challenge.category}</span>
                </div>
                <div className="flex min-w-0 flex-1 flex-col p-5 md:p-7">
                  <div className="mb-3 flex flex-wrap items-center gap-3 text-xs font-semibold text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-primary" />{challenge.date}</span>
                    <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary" />Online</span>
                  </div>
                  <h3 className="font-display text-xl font-bold leading-tight text-foreground md:text-2xl">{challenge.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{challenge.description}</p>
                  <div className="mt-6 flex items-end justify-between border-t border-border pt-5">
                    <div><p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Prize Pool</p><p className="mt-1 text-lg font-bold text-primary">{challenge.prize}</p></div>
                    <Button size="icon" aria-label={`View ${challenge.title}`} onClick={() => scrollTo("featured-event")} className="h-11 w-11 rounded-md"><ArrowRight /></Button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/35 py-10">
        <div className="container px-4 md:px-6">
          <p className="mb-7 text-center text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Challenges supported by leading teams</p>
          <div className="grid grid-cols-3 items-center gap-x-6 gap-y-8 md:grid-cols-6">
            {partners.map((partner) => (
              <div key={partner.name} className="flex items-center justify-center gap-2 opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0">
                <img src={partner.logo} alt="" className="h-7 w-7 object-contain" />
                <span className="hidden text-sm font-bold text-foreground sm:inline">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-24 py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <SectionHeading eyebrow="Your Journey" icon={ArrowRight} first="One Build Can Move" second="Your Career Forward." descriptionFirst="Every step turns participation into proof employers can understand." descriptionSecond="Build, earn recognition, and open the right conversations." />
          <div className="relative mt-12 grid gap-4 md:grid-cols-4">
            <div className="absolute left-[12%] right-[12%] top-10 hidden h-px bg-border md:block" />
            {journey.map(({ icon: Icon, step, title, description }, index) => (
              <motion.div key={title} {...reveal} transition={{ duration: 0.5, delay: index * 0.08 }} className="relative bg-background p-5 text-center">
                <div className="relative z-10 mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-primary/20 bg-accent text-primary shadow-sm">
                  <Icon className="h-7 w-7" />
                  <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{step}</span>
                </div>
                <h3 className="mt-5 font-display text-xl font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="featured-event" className="scroll-mt-24 bg-foreground py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <motion.div {...reveal} className="relative min-h-[360px] overflow-hidden rounded-lg md:min-h-[520px]">
              <img src={hackathonEvent1} alt="Teams presenting at the national hackathon" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4 text-primary-foreground">
                <div><p className="text-xs font-bold uppercase tracking-wider text-primary-foreground/60">Season 4</p><p className="mt-1 font-display text-2xl font-bold">The flagship build sprint</p></div>
                <div className="rounded-md bg-primary px-4 py-2 text-sm font-bold">₹10L prize pool</div>
              </div>
            </motion.div>
            <motion.div {...reveal} transition={{ duration: 0.55, delay: 0.1 }}>
              <SectionHeading align="left" inverse eyebrow="Featured Event" icon={Trophy} first="The National Stage" second="For Proven Builders." descriptionFirst="Join ambitious teams solving a live challenge for industry leaders." descriptionSecond="Your work is judged, verified, and shared with employers." />
              <div className="mt-8 grid grid-cols-2 gap-3 text-sm text-primary-foreground/80">
                {["48-hour sprint", "Expert mentors", "Live finalist pitch", "Verified project badge"].map((item) => (
                  <div key={item} className="flex items-center gap-2 border-b border-primary-foreground/15 pb-3"><CheckCircle2 className="h-4 w-4 text-primary" />{item}</div>
                ))}
              </div>
              <Button size="lg" onClick={() => scrollTo("upcoming-hackathons")} className="mt-9 h-12 rounded-md px-7 font-bold">Explore Events <ArrowRight /></Button>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-accent/40 py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <SectionHeading eyebrow="Beyond One Weekend" icon={Sparkles} first="A Year-Round Journey" second="Built Around Talent." descriptionFirst="Each season creates another chance to build, compete, and be seen." descriptionSecond="Stay active from your first brief to your next role." />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {seasons.map((season, index) => (
              <motion.article key={season.label} {...reveal} transition={{ duration: 0.5, delay: index * 0.08 }} className="overflow-hidden rounded-lg border border-border bg-background">
                <img src={season.image} alt={season.label} className="h-56 w-full object-cover" />
                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">{season.label}</p>
                  <h3 className="mt-2 font-display text-2xl font-bold">{season.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{season.text}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <motion.div {...reveal} className="relative overflow-hidden rounded-lg bg-primary px-6 py-12 text-center md:px-12 md:py-16">
            <MessageCircle className="mx-auto h-9 w-9 text-primary-foreground/70" />
            <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-primary-foreground md:text-5xl">More Than a Competition.<br /><span className="text-primary-foreground/70">A Community That Builds.</span></h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-primary-foreground/75 md:text-lg">Meet collaborators, mentors, and peers who keep sharing long after the final pitch.<br className="hidden md:block" /> Learn together, find your team, and keep creating.</p>
            <Button asChild size="lg" className="mt-8 h-12 rounded-md bg-background px-7 font-bold text-primary hover:bg-background/90"><Link to="/meetups">Join the Community <ArrowRight /></Link></Button>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/35 py-12">
        <div className="container grid grid-cols-2 gap-8 px-4 text-center md:grid-cols-4 md:px-6">
          {[['15K+', 'Participants'], ['200+', 'Hiring Partners'], ['50+', 'Live Events'], ['1,200+', 'Verified Projects']].map(([value, label]) => (
            <div key={label}><p className="font-display text-3xl font-bold text-primary md:text-4xl">{value}</p><p className="mt-1 text-sm text-muted-foreground">{label}</p></div>
          ))}
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <SectionHeading eyebrow="Judging Criteria" icon={ShieldCheck} first="Skills, Mindset, and" second="Real-World Impact." descriptionFirst="Judges look beyond the final screen to understand how you think." descriptionSecond="Every decision, trade-off, and result contributes." />
          <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
            {criteria.map(({ icon: Icon, title, text }, index) => (
              <motion.div key={title} {...reveal} transition={{ duration: 0.45, delay: index * 0.06 }} className="bg-background p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-accent text-primary"><Icon className="h-5 w-5" /></div>
                <h3 className="mt-5 font-display text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/40 py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <SectionHeading eyebrow="Builder Stories" icon={Users} first="Real Work Opened" second="Real Career Doors." descriptionFirst="Participants came to prove what they could do under pressure." descriptionSecond="They left with credibility, connections, and momentum." />
          <motion.div key={story} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="mx-auto mt-12 grid max-w-5xl overflow-hidden rounded-lg border border-border bg-background shadow-sm md:grid-cols-[0.75fr_1.25fr]">
            <img src={testimonials[story].image} alt={testimonials[story].name} className="h-72 w-full object-cover md:h-full" />
            <div className="flex flex-col justify-center p-7 md:p-12">
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-foreground"><MessageCircle className="h-5 w-5" /></div>
              <blockquote className="font-display text-2xl font-bold leading-snug text-foreground md:text-3xl">“{testimonials[story].quote}”</blockquote>
              <div className="mt-7"><p className="font-bold">{testimonials[story].name}</p><p className="text-sm text-muted-foreground">{testimonials[story].role}</p></div>
              <div className="mt-8 flex gap-2">
                <Button variant="outline" size="icon" aria-label="Previous story" onClick={() => moveStory(-1)}><ChevronLeft /></Button>
                <Button variant="outline" size="icon" aria-label="Next story" onClick={() => moveStory(1)}><ChevronRight /></Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container grid gap-10 px-4 md:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading align="left" eyebrow="Questions" icon={MessageCircle} first="Everything You Need" second="Before You Enter." descriptionFirst="Understand eligibility, teams, judging, and what you receive." descriptionSecond="Then choose your challenge and start building." />
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem value={`faq-${index}`} key={faq.question}>
                <AccordionTrigger className="text-left font-display text-base font-bold hover:text-primary hover:no-underline md:text-lg">{faq.question}</AccordionTrigger>
                <AccordionContent className="pr-8 leading-relaxed text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="px-4 pb-16 md:pb-24">
        <div className="container overflow-hidden rounded-lg bg-foreground px-6 py-14 text-center md:px-12 md:py-20">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground"><Trophy className="h-6 w-6" /></div>
          <h2 className="mt-6 font-display text-3xl font-bold leading-tight text-primary-foreground md:text-5xl">Ready to Build Something<br /><span className="text-primary">Employers Remember?</span></h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-primary-foreground/65 md:text-lg">Join a live challenge, prove your skills, and make your work visible.<br className="hidden md:block" /> Your next career conversation can start here.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" onClick={() => scrollTo("upcoming-hackathons")} className="h-12 rounded-md px-8 font-bold">Explore Hackathons <ArrowRight /></Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-md border-primary-foreground/25 bg-transparent px-8 font-bold text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"><Link to="/for-employers">Partner With Us</Link></Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Hackathons;