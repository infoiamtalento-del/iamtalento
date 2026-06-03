import { motion } from "framer-motion";
import { MapPin, Briefcase, Globe } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

const hackathons = [
  {
    company: "Google",
    logo: "https://www.google.com/s2/favicons?domain=google.com&sz=64",
    name: "Google Code Jam",
    location: "Global · Online",
    participants: "50,000+",
    date: "Mar 2025",
    openings: "85",
  },
  {
    company: "Microsoft",
    logo: "https://www.google.com/s2/favicons?domain=microsoft.com&sz=64",
    name: "Imagine Cup",
    location: "Seattle, USA",
    participants: "30,000+",
    date: "Apr 2025",
    openings: "62",
  },
  {
    company: "Amazon",
    logo: "https://www.google.com/s2/favicons?domain=amazon.com&sz=64",
    name: "AWS GameDay",
    location: "Bangalore, India",
    participants: "12,000+",
    date: "May 2025",
    openings: "120",
  },
  {
    company: "Flipkart",
    logo: "https://www.google.com/s2/favicons?domain=flipkart.com&sz=64",
    name: "GRiD 6.0",
    location: "Bangalore, India",
    participants: "25,000+",
    date: "Jun 2025",
    openings: "48",
  },
  {
    company: "Infosys",
    logo: "https://www.google.com/s2/favicons?domain=infosys.com&sz=64",
    name: "HackWithInfy",
    location: "Pan India · Online",
    participants: "200,000+",
    date: "Jul 2025",
    openings: "210",
  },
  {
    company: "TCS",
    logo: "https://www.google.com/s2/favicons?domain=tcs.com&sz=64",
    name: "CodeVita",
    location: "Global · Online",
    participants: "300,000+",
    date: "Aug 2025",
    openings: "340",
  },
  {
    company: "Walmart",
    logo: "https://www.google.com/s2/favicons?domain=walmart.com&sz=64",
    name: "Converge",
    location: "Bangalore, India",
    participants: "8,000+",
    date: "Sep 2025",
    openings: "55",
  },
  {
    company: "Razorpay",
    logo: "https://www.google.com/s2/favicons?domain=razorpay.com&sz=64",
    name: "FTX Hack",
    location: "Bangalore, India",
    participants: "5,000+",
    date: "Oct 2025",
    openings: "30",
  },
  {
    company: "Swiggy",
    logo: "https://www.google.com/s2/favicons?domain=swiggy.com&sz=64",
    name: "i3 Hackathon",
    location: "Bangalore, India",
    participants: "4,000+",
    date: "Nov 2025",
    openings: "22",
  },
  {
    company: "Meta",
    logo: "https://www.google.com/s2/favicons?domain=meta.com&sz=64",
    name: "Hacker Cup",
    location: "Global · Online",
    participants: "40,000+",
    date: "Sep 2025",
    openings: "75",
  },
  {
    company: "Atlassian",
    logo: "https://www.google.com/s2/favicons?domain=atlassian.com&sz=64",
    name: "Ship-It Day",
    location: "Sydney, Australia",
    participants: "3,000+",
    date: "Dec 2025",
    openings: "18",
  },
  {
    company: "Paytm",
    logo: "https://www.google.com/s2/favicons?domain=paytm.com&sz=64",
    name: "Build for India",
    location: "Noida, India",
    participants: "10,000+",
    date: "Jan 2026",
    openings: "40",
  },
];

const row1 = hackathons.slice(0, 6);
const row2 = hackathons.slice(6, 12);
const doubled1 = [...row1, ...row1];
const doubled2 = [...row2, ...row2];

type HackathonData = (typeof hackathons)[0];

const HackathonCard = ({ d }: { d: HackathonData }) => (
  <div className="flex items-center gap-4 whitespace-nowrap rounded-2xl border border-border bg-card px-5 py-4 shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:border-primary/20 transition-all duration-200 shrink-0">
    <div className="h-11 w-11 rounded-xl bg-accent flex items-center justify-center shrink-0 overflow-hidden">
      <img
        src={d.logo}
        alt={d.company}
        className="h-7 w-7 object-contain"
        loading="lazy"
      />
    </div>
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <p className="text-sm font-bold text-foreground truncate">{d.name}</p>
        <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
          {d.company}
        </span>
      </div>
      <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {d.location}
        </span>
        <span className="flex items-center gap-1 text-primary font-semibold">
          <Briefcase className="h-3 w-3" />
          {d.openings} open jobs
        </span>
      </div>
    </div>
  </div>
);

const HackathonSocialProof = () => (
  <section className="py-14 md:py-20 overflow-hidden border-b border-border/50">
    <div className="container px-4 md:px-6 mb-10 text-center flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col items-center"
      >
        <SectionBadge label="Who's Running Hackathons" icon={Globe} />
        <h2 className="text-3xl md:text-4xl font-bold font-display mb-3">
          Top Companies. <span className="text-primary">Real Challenges.</span>
        </h2>
        <p className="text-muted-foreground max-w-lg text-sm md:text-base">
          From global MNCs to India's fastest-growing startups — the biggest names run their hackathons here.
        </p>
      </motion.div>

      {/* Stats strip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap justify-center gap-6 mt-8"
      >
        {[
          { value: "120+", label: "Companies hosted" },
          { value: "500K+", label: "Total participants" },
          { value: "45+", label: "Countries represented" },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-3">
            <span className="text-2xl md:text-3xl font-bold font-display text-foreground">{s.value}</span>
            <span className="text-xs text-muted-foreground leading-tight max-w-[100px]">{s.label}</span>
          </div>
        ))}
      </motion.div>
    </div>

    {/* Marquee Row 1 → */}
    <div className="relative py-2">
      <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-background to-transparent z-10" />
      <div className="overflow-hidden">
        <motion.div
          className="flex w-max gap-4 px-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          {doubled1.map((d, i) => (
            <HackathonCard key={`r1-${i}`} d={d} />
          ))}
        </motion.div>
      </div>
    </div>

    {/* Marquee Row 2 ← */}
    <div className="relative py-2 mt-3">
      <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-background to-transparent z-10" />
      <div className="overflow-hidden">
        <motion.div
          className="flex w-max gap-4 px-4"
          animate={{ x: ["-50%", "0%"] }}
          transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
        >
          {doubled2.map((d, i) => (
            <HackathonCard key={`r2-${i}`} d={d} />
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

export default HackathonSocialProof;
