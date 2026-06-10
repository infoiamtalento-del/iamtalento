import { motion } from "framer-motion";
import { Building2, Users, ShieldCheck, Target, MapPin, Briefcase } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

const hackathons = [
  { company: "Microsoft", logo: "https://www.google.com/s2/favicons?domain=microsoft.com&sz=64", name: "Imagine Cup", location: "Seattle, USA", openings: "62" },
  { company: "Amazon", logo: "https://www.google.com/s2/favicons?domain=amazon.com&sz=64", name: "AWS GameDay", location: "Bangalore, India", openings: "120" },
  { company: "Flipkart", logo: "https://www.google.com/s2/favicons?domain=flipkart.com&sz=64", name: "GRiD 6.0", location: "Bangalore, India", openings: "48" },
  { company: "Infosys", logo: "https://www.google.com/s2/favicons?domain=infosys.com&sz=64", name: "HackWithInfy", location: "Pan India · Online", openings: "210" },
  { company: "Google", logo: "https://www.google.com/s2/favicons?domain=google.com&sz=64", name: "Google Code Jam", location: "Global · Online", openings: "85" },
  { company: "TCS", logo: "https://www.google.com/s2/favicons?domain=tcs.com&sz=64", name: "CodeVita", location: "Global · Online", openings: "340" },
  { company: "Paytm", logo: "https://www.google.com/s2/favicons?domain=paytm.com&sz=64", name: "Build for India", location: "Noida, India", openings: "40" },
  { company: "Walmart", logo: "https://www.google.com/s2/favicons?domain=walmart.com&sz=64", name: "Converge", location: "Bangalore, India", openings: "55" },
  { company: "Razorpay", logo: "https://www.google.com/s2/favicons?domain=razorpay.com&sz=64", name: "FTX Hack", location: "Bangalore, India", openings: "30" },
  { company: "Swiggy", logo: "https://www.google.com/s2/favicons?domain=swiggy.com&sz=64", name: "i3 Hackathon", location: "Bangalore, India", openings: "22" },
  { company: "Meta", logo: "https://www.google.com/s2/favicons?domain=meta.com&sz=64", name: "Hacker Cup", location: "Global · Online", openings: "75" },
  { company: "Atlassian", logo: "https://www.google.com/s2/favicons?domain=atlassian.com&sz=64", name: "Ship-It Day", location: "Sydney, Australia", openings: "18" },
];

const row1 = hackathons.slice(0, 6);
const row2 = hackathons.slice(6, 12);
const doubled1 = [...row1, ...row1];
const doubled2 = [...row2, ...row2];

type HackathonData = (typeof hackathons)[0];

const HackathonCard = ({ d }: { d: HackathonData }) => (
  <div className="flex items-center gap-4 whitespace-nowrap rounded-2xl border border-border bg-card px-5 py-4 shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:border-primary/20 transition-all duration-200 shrink-0">
    <div className="h-11 w-11 rounded-xl bg-accent flex items-center justify-center shrink-0 overflow-hidden">
      <img src={d.logo} alt={d.company} className="h-7 w-7 object-contain" loading="lazy" />
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

const stats = [
  { icon: Building2, value: "5,00,000+", label: "Jobs Listed" },
  { icon: Users, value: "10,000+", label: "Candidates Screened" },
  { icon: ShieldCheck, value: "99%", label: "Proctoring Accuracy" },
  { icon: Target, value: "73%", label: "Faster Hiring" },
];

const JobsSocialProof = () => (
  <section className="py-16 md:py-24 border-y border-border/50 bg-card/30 relative overflow-hidden">
    <div className="container px-4 md:px-6 mb-10">
      <div className="text-center mb-4">
        <SectionBadge label="Social Proof" icon={Building2} />
      </div>
      <motion.h2
        className="text-center text-3xl md:text-4xl font-bold font-display mb-2"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Trusted by Hiring<br />
        <span className="text-primary">Leaders Worldwide</span>
      </motion.h2>
      <motion.p
        className="text-center text-sm md:text-base text-muted-foreground mb-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        Leading employers rely on IAmTalento for skills-first, proctored hiring at scale.
      </motion.p>

      {/* Stats row */}
      <div className="flex flex-wrap justify-center items-start gap-8 md:gap-16 mb-2">
        {stats.map(({ icon: Icon, value, label }, i) => (
          <motion.div
            key={label}
            className="text-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <Icon className="h-5 w-5 text-primary" />
              <p className="text-2xl md:text-3xl font-bold font-display">{value}</p>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">{label}</p>
          </motion.div>
        ))}
      </div>
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

export default JobsSocialProof;
