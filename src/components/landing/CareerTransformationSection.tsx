import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Briefcase, MapPin, TrendingUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    avatar: "https://i.pravatar.cc/160?img=47",
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
    avatar: "https://i.pravatar.cc/160?img=12",
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
    avatar: "https://i.pravatar.cc/160?img=32",
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

const packages = [
  { name: "Growth Marketer Track", price: "₹14,999", duration: "12 weeks" },
  { name: "Data Pro Bootcamp", price: "₹19,999", duration: "16 weeks" },
  { name: "PM Leadership Track", price: "₹24,999", duration: "20 weeks" },
];

const ProfileCard = ({ p, i }: { p: Profile; i: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: i * 0.08 }}
    className="bg-card rounded-2xl border border-border shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300"
  >
    {/* Cover + avatar */}
    <div className="relative h-20 bg-gradient-to-r from-[#0a66c2] to-[#378fe9]">
      <div className="absolute -bottom-10 left-5">
        <div className="relative">
          <img
            src={p.avatar}
            alt={p.name}
            className="h-20 w-20 rounded-full ring-4 ring-card object-cover bg-muted"
          />
          <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-card flex items-center justify-center">
            <BadgeCheck className="h-5 w-5 text-[#0a66c2] fill-[#0a66c2]/10" />
          </div>
        </div>
      </div>
    </div>

    {/* Identity */}
    <div className="pt-12 px-5 pb-4 border-b border-border">
      <div className="flex items-center gap-1.5">
        <h3 className="text-base font-bold text-foreground">{p.name}</h3>
        <BadgeCheck className="h-4 w-4 text-[#0a66c2]" />
      </div>
      <p className="text-sm text-foreground/80 mt-0.5 leading-snug">{p.headline}</p>
      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
        <MapPin className="h-3 w-3" /> {p.location}
      </p>
    </div>

    {/* Experience – LinkedIn style */}
    <div className="px-5 py-4 border-b border-border">
      <p className="text-xs font-bold text-foreground/70 mb-3 uppercase tracking-wider flex items-center gap-1.5">
        <Briefcase className="h-3.5 w-3.5" /> Experience
      </p>

      <div className="space-y-3">
        {/* To (current) */}
        <div className="flex gap-3">
          <div className="h-10 w-10 rounded-md bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0">
            <img
              src={p.toLogo}
              alt={p.toCompany}
              className="h-7 w-7 object-contain"
              onError={(e) => ((e.currentTarget.style.display = "none"))}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold text-foreground truncate">{p.toRole}</p>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">NEW</span>
            </div>
            <p className="text-xs text-muted-foreground truncate">{p.toCompany} · Full-time</p>
            <p className="text-[11px] text-muted-foreground/80">Present</p>
          </div>
        </div>

        {/* Connector */}
        <div className="flex">
          <div className="w-10 flex justify-center">
            <div className="h-4 w-px bg-border" />
          </div>
        </div>

        {/* From */}
        <div className="flex gap-3 opacity-80">
          <div className="h-10 w-10 rounded-md bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0">
            <img
              src={p.fromLogo}
              alt={p.fromCompany}
              className="h-7 w-7 object-contain"
              onError={(e) => ((e.currentTarget.style.display = "none"))}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{p.fromRole}</p>
            <p className="text-xs text-muted-foreground truncate">{p.fromCompany} · Full-time</p>
            <p className="text-[11px] text-muted-foreground/80">Past role</p>
          </div>
        </div>
      </div>
    </div>

    {/* Transformation stats */}
    <div className="px-5 py-4 bg-muted/40">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Before</p>
          <p className="text-sm font-bold text-foreground/70 line-through">{p.salaryFrom}</p>
        </div>
        <ArrowRight className="h-4 w-4 text-primary shrink-0" />
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">After</p>
          <p className="text-sm font-bold text-foreground">{p.salaryTo}</p>
        </div>
        <div className="ml-auto inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold">
          <TrendingUp className="h-3 w-3" />
          {p.hike}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
          <Sparkles className="h-3 w-3" /> {p.pkg}
        </span>
        <button className="text-[11px] font-semibold text-[#0a66c2] hover:underline">
          View full story
        </button>
      </div>
    </div>
  </motion.div>
);

const CareerTransformationSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
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

        {/* Profiles */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {profiles.map((p, i) => (
            <ProfileCard key={p.name} p={p} i={i} />
          ))}
        </div>

        {/* Packages */}
        <div className="mt-14 max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-xl md:text-2xl font-bold font-display">
              Transition <span className="text-primary">Packages</span>
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Pick a track. Switch companies in 12–20 weeks.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {packages.map((pk, i) => (
              <motion.div
                key={pk.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl bg-card border border-border p-5 hover:border-primary/40 hover:shadow-lg transition-all flex flex-col"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-primary">
                  Package {i + 1}
                </p>
                <h4 className="mt-2 text-lg font-bold font-display text-foreground">
                  {pk.name}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">{pk.duration}</p>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-display text-foreground">{pk.price}</span>
                  <span className="text-xs text-muted-foreground">one-time</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-4 gap-1.5 self-start rounded-lg border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Explore <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 font-bold h-12 px-8 shadow-xl rounded-xl text-base"
            >
              Start Your Transition <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerTransformationSection;
