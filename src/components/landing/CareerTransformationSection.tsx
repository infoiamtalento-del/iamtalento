import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, MapPin, TrendingUp } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

type Profile = {
  name: string;
  headline: string;
  location: string;
  avatar: string;
  toCompany: string;
  toLogo: string;
  fromCompany: string;
  fromLogo: string;
  salaryFrom: string;
  salaryTo: string;
  hike: string;
};

const profiles: Profile[] = [
  {
    name: "Ananya Iyer",
    headline: "Performance Marketing Manager",
    location: "Bengaluru, India",
    avatar: "https://i.pravatar.cc/400?img=47",
    toCompany: "Razorpay",
    toLogo: "https://logo.clearbit.com/razorpay.com",
    fromCompany: "Wipro",
    fromLogo: "https://logo.clearbit.com/wipro.com",
    salaryFrom: "₹6 LPA",
    salaryTo: "₹18 LPA",
    hike: "+200%",
  },
  {
    name: "Rohan Verma",
    headline: "Senior Data Analyst",
    location: "Hyderabad, India",
    avatar: "https://i.pravatar.cc/400?img=12",
    toCompany: "Flipkart",
    toLogo: "https://logo.clearbit.com/flipkart.com",
    fromCompany: "Infosys",
    fromLogo: "https://logo.clearbit.com/infosys.com",
    salaryFrom: "₹8 LPA",
    salaryTo: "₹22 LPA",
    hike: "+175%",
  },
  {
    name: "Priya Nair",
    headline: "Product Manager",
    location: "Mumbai, India",
    avatar: "https://i.pravatar.cc/400?img=32",
    toCompany: "Swiggy",
    toLogo: "https://logo.clearbit.com/swiggy.com",
    fromCompany: "TCS",
    fromLogo: "https://logo.clearbit.com/tcs.com",
    salaryFrom: "₹10 LPA",
    salaryTo: "₹28 LPA",
    hike: "+180%",
  },
];

const ProfileCard = ({ p, i }: { p: Profile; i: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: i * 0.08 }}
    className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300"
  >
    {/* Big photo */}
    <div className="relative aspect-[4/5] bg-muted overflow-hidden">
      <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
      <div className="absolute top-3 right-3 h-7 w-7 rounded-full bg-card/95 backdrop-blur flex items-center justify-center shadow-sm">
        <BadgeCheck className="h-4 w-4 text-primary" />
      </div>
    </div>

    {/* Identity */}
    <div className="px-5 pt-5 pb-4">
      <h3 className="text-lg font-bold text-foreground">{p.name}</h3>
      <p className="text-sm text-muted-foreground mt-0.5">{p.headline}</p>
      <p className="text-xs text-muted-foreground/80 mt-1.5 flex items-center gap-1">
        <MapPin className="h-3 w-3" /> {p.location}
      </p>
    </div>

    {/* Transition: companies */}
    <div className="px-5 pb-4 flex items-center gap-3">
      <div className="flex-1 flex items-center gap-2 min-w-0">
        <div className="h-8 w-8 rounded-md bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0">
          <img src={p.fromLogo} alt={p.fromCompany} className="h-5 w-5 object-contain" onError={(e) => (e.currentTarget.style.display = "none")} />
        </div>
        <span className="text-xs text-muted-foreground truncate">{p.fromCompany}</span>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
      <div className="flex-1 flex items-center gap-2 min-w-0 justify-end">
        <span className="text-xs font-semibold text-foreground truncate">{p.toCompany}</span>
        <div className="h-8 w-8 rounded-md bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0">
          <img src={p.toLogo} alt={p.toCompany} className="h-5 w-5 object-contain" onError={(e) => (e.currentTarget.style.display = "none")} />
        </div>
      </div>
    </div>

    {/* Salary */}
    <div className="px-5 py-4 border-t border-border flex items-center justify-between">
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Package</p>
        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-sm text-muted-foreground line-through">{p.salaryFrom}</span>
          <span className="text-xl font-bold font-display text-foreground">{p.salaryTo}</span>
        </div>
      </div>
      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
        <TrendingUp className="h-3 w-3" />
        {p.hike}
      </div>
    </div>
  </motion.div>
);

const CareerTransformationSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <SectionBadge label="Career Transformation" icon={TrendingUp} />
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold font-display leading-tight"
          >
            Real Profiles. Real{" "}
            <span className="text-primary">Company Transitions</span>.
          </motion.h2>
          <p className="mt-3 text-muted-foreground">
            Professionals who used I Am Talento to switch companies, level up roles, and grow their package.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {profiles.map((p, i) => (
            <ProfileCard key={p.name} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CareerTransformationSection;
