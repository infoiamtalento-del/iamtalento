import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Briefcase, MapPin, TrendingUp, Sparkles } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

type Profile = {
  name: string;
  headline: string;
  location: string;
  avatar: string;
  fromRole: string;
  fromCompany: string;
  fromLogo: string;
  toRole: string;
  toCompany: string;
  toLogo: string;
  salaryFrom: string;
  salaryTo: string;
  hike: string;
  pkg: string;
};

const profiles: Profile[] = [
  {
    name: "Ananya Iyer",
    headline: "Performance Marketing Manager · ex-Wipro",
    location: "Bengaluru, India",
    avatar: "https://i.pravatar.cc/240?img=47",
    fromRole: "SEO Executive",
    fromCompany: "Wipro",
    fromLogo: "https://logo.clearbit.com/wipro.com",
    toRole: "Performance Marketing Manager",
    toCompany: "Razorpay",
    toLogo: "https://logo.clearbit.com/razorpay.com",
    salaryFrom: "₹6 LPA",
    salaryTo: "₹18 LPA",
    hike: "+200%",
    pkg: "Growth Marketer Track",
  },
  {
    name: "Rohan Verma",
    headline: "Senior Data Analyst · ex-Infosys",
    location: "Hyderabad, India",
    avatar: "https://i.pravatar.cc/240?img=12",
    fromRole: "Business Analyst",
    fromCompany: "Infosys",
    fromLogo: "https://logo.clearbit.com/infosys.com",
    toRole: "Senior Data Analyst",
    toCompany: "Flipkart",
    toLogo: "https://logo.clearbit.com/flipkart.com",
    salaryFrom: "₹8 LPA",
    salaryTo: "₹22 LPA",
    hike: "+175%",
    pkg: "Data Pro Bootcamp",
  },
  {
    name: "Priya Nair",
    headline: "Product Manager · ex-TCS",
    location: "Mumbai, India",
    avatar: "https://i.pravatar.cc/240?img=32",
    fromRole: "Associate PM",
    fromCompany: "TCS",
    fromLogo: "https://logo.clearbit.com/tcs.com",
    toRole: "Product Manager",
    toCompany: "Swiggy",
    toLogo: "https://logo.clearbit.com/swiggy.com",
    salaryFrom: "₹10 LPA",
    salaryTo: "₹28 LPA",
    hike: "+180%",
    pkg: "PM Leadership Track",
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
    {/* Cover + avatar (LinkedIn style) */}
    <div className="relative h-24 bg-primary">
      <div className="absolute -bottom-12 left-5">
        <div className="relative">
          <img
            src={p.avatar}
            alt={p.name}
            className="h-24 w-24 rounded-full ring-4 ring-card object-cover bg-muted"
          />
          <div className="absolute bottom-1 right-1 h-6 w-6 rounded-full bg-card flex items-center justify-center">
            <BadgeCheck className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>
    </div>

    {/* Identity */}
    <div className="pt-14 px-5 pb-4 border-b border-border">
      <div className="flex items-center gap-1.5">
        <h3 className="text-base font-bold text-foreground">{p.name}</h3>
      </div>
      <p className="text-sm text-foreground/80 mt-0.5 leading-snug">{p.headline}</p>
      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
        <MapPin className="h-3 w-3" /> {p.location}
      </p>
    </div>

    {/* Experience */}
    <div className="px-5 py-4 border-b border-border">
      <p className="text-xs font-bold text-foreground/70 mb-3 uppercase tracking-wider flex items-center gap-1.5">
        <Briefcase className="h-3.5 w-3.5" /> Experience
      </p>

      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="h-10 w-10 rounded-md bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0">
            <img src={p.toLogo} alt={p.toCompany} className="h-7 w-7 object-contain" onError={(e) => (e.currentTarget.style.display = "none")} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold text-foreground truncate">{p.toRole}</p>
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">NEW</span>
            </div>
            <p className="text-xs text-muted-foreground truncate">{p.toCompany} · Full-time</p>
            <p className="text-[11px] text-muted-foreground/80">Present</p>
          </div>
        </div>

        <div className="flex">
          <div className="w-10 flex justify-center">
            <div className="h-4 w-px bg-border" />
          </div>
        </div>

        <div className="flex gap-3 opacity-80">
          <div className="h-10 w-10 rounded-md bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0">
            <img src={p.fromLogo} alt={p.fromCompany} className="h-7 w-7 object-contain" onError={(e) => (e.currentTarget.style.display = "none")} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{p.fromRole}</p>
            <p className="text-xs text-muted-foreground truncate">{p.fromCompany} · Full-time</p>
            <p className="text-[11px] text-muted-foreground/80">Past role</p>
          </div>
        </div>
      </div>
    </div>

    {/* Salary transformation */}
    <div className="px-5 py-4 flex items-center justify-between">
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Package</p>
        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-sm text-muted-foreground line-through">{p.salaryFrom}</span>
          <ArrowRight className="h-3 w-3 text-muted-foreground" />
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
