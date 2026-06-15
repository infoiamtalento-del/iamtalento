import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Play, Quote, TrendingUp } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type Profile = {
  name: string;
  role: string;
  company: string;
  location: string;
  avatar: string;
  salaryFrom: string;
  salaryTo: string;
  hike: string;
  videoUrl: string;
};

const profiles: Profile[] = [
  {
    name: "Ananya Iyer",
    role: "Performance Marketing Manager",
    company: "ex-Wipro",
    location: "Bengaluru, India",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    salaryFrom: "₹6 LPA",
    salaryTo: "₹18 LPA",
    hike: "+200%",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    name: "Rohan Verma",
    role: "Senior Data Analyst",
    company: "ex-Infosys",
    location: "Hyderabad, India",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=800&q=80",
    salaryFrom: "₹8 LPA",
    salaryTo: "₹22 LPA",
    hike: "+175%",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    name: "Priya Nair",
    role: "Product Manager",
    company: "ex-TCS",
    location: "Mumbai, India",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80",
    salaryFrom: "₹10 LPA",
    salaryTo: "₹28 LPA",
    hike: "+180%",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
];

const ProfileCard = ({ p, i, onPlay }: { p: Profile; i: number; onPlay: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: i * 0.08 }}
    className="group relative rounded-3xl overflow-hidden bg-card shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col"
    onClick={onPlay}
  >
    {/* Portrait */}
    <div className="relative aspect-[4/5] overflow-hidden">
      <img
        src={p.avatar}
        alt={p.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {/* Location pill top-left */}
      <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/85 backdrop-blur-md shadow-sm">
        <MapPin className="h-3.5 w-3.5 text-foreground" />
        <span className="text-xs font-medium text-foreground">{p.location}</span>
      </div>

      {/* Subtle play button center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          type="button"
          aria-label={`Play ${p.name}'s testimonial`}
          className="w-14 h-14 rounded-full bg-black/35 backdrop-blur-sm text-white flex items-center justify-center ring-1 ring-white/40 transition-all duration-300 group-hover:scale-110 group-hover:bg-black/50"
        >
          <Play className="h-5 w-5 ml-0.5 fill-current" />
        </button>
      </div>
    </div>

    {/* Dark info panel */}
    <div className="relative bg-zinc-950 text-white p-6 pt-5 -mt-12 rounded-t-2xl">
      <Quote className="h-5 w-5 text-primary fill-primary mb-2" />
      <h3 className="text-xl font-bold font-display">{p.name}</h3>
      <p className="text-sm text-white/85 mt-1 leading-snug">{p.role}</p>
      <p className="text-sm text-white/65 leading-snug">{p.company}</p>

      <div className="mt-5 pt-4 border-t border-white/10 flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-white/60 font-bold mb-1.5">Package</p>
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-white/50 line-through">{p.salaryFrom}</span>
            <ArrowRight className="h-3.5 w-3.5 text-white/50" />
            <span className="text-xl font-bold font-display text-white">{p.salaryTo}</span>
          </div>
        </div>
        <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/20 text-primary text-xs font-bold">
          <TrendingUp className="h-3 w-3" />
          {p.hike}
        </div>
      </div>
    </div>

    {/* Red accent bar */}
    <div className="h-1 bg-primary" />
  </motion.div>
);

const CareerTransformationSection = () => {
  const [active, setActive] = useState<Profile | null>(null);

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <SectionBadge label="Career Transformation" icon={TrendingUp} />
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold font-display leading-tight"
          >
            Real Profiles.
            <br />
            Real <span className="text-primary">Company Transitions.</span>
          </motion.h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Professionals who used I Am Talento to switch companies, level up roles, and grow their package.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {profiles.map((p, i) => (
            <ProfileCard key={p.name} p={p} i={i} onPlay={() => setActive(p)} />
          ))}
        </div>
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-black border-0">
          <DialogTitle className="sr-only">{active?.name} testimonial</DialogTitle>
          {active && (
            <video
              key={active.videoUrl}
              src={active.videoUrl}
              controls
              autoPlay
              className="w-full aspect-video bg-black"
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default CareerTransformationSection;
