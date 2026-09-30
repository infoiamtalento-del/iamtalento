import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, MapPin, Play, TrendingUp } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type Profile = {
  name: string;
  headline: string;
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
    headline: "Performance Marketing Manager · ex-Wipro",
    location: "Bengaluru, India",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    salaryFrom: "₹6 LPA",
    salaryTo: "₹18 LPA",
    hike: "+200%",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    name: "Rohan Verma",
    headline: "Senior Data Analyst · ex-Infosys",
    location: "Hyderabad, India",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=800&q=80",
    salaryFrom: "₹8 LPA",
    salaryTo: "₹22 LPA",
    hike: "+175%",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    name: "Priya Nair",
    headline: "Product Manager · ex-TCS",
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
    className="group relative h-[560px] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer"
    onClick={onPlay}
  >
    {/* Full-height portrait */}
    <img
      src={p.avatar}
      alt={p.name}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
    />

    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10" />

    {/* Verified badge */}
    <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md shadow-md">
      <BadgeCheck className="h-3.5 w-3.5 text-primary" />
      <span className="text-[10px] font-bold uppercase tracking-wider text-foreground">Verified</span>
    </div>

    {/* Play button */}
    <div className="absolute inset-0 flex items-center justify-center">
      <button
        type="button"
        aria-label={`Play ${p.name}'s testimonial`}
        className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-2xl ring-8 ring-white/10 transition-all duration-300 group-hover:scale-110 group-hover:ring-white/20"
      >
        <Play className="h-7 w-7 ml-1 fill-current" />
      </button>
    </div>

    {/* Bottom info */}
    <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
      <div className="space-y-1">
        <h3 className="text-2xl font-bold font-display text-white">{p.name}</h3>
        <p className="text-sm text-white/80">{p.headline}</p>
        <p className="text-xs text-white/60 flex items-center gap-1 pt-0.5">
          <MapPin className="h-3 w-3" /> {p.location}
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/15">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/70 font-bold mb-1">Package</p>
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-white/60 line-through">{p.salaryFrom}</span>
              <ArrowRight className="h-3 w-3 text-white/60" />
              <span className="text-xl font-bold font-display text-white">{p.salaryTo}</span>
            </div>
          </div>
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-md">
            <TrendingUp className="h-3 w-3" />
            {p.hike}
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const CareerTransformationSection = () => {
  const [active, setActive] = useState<Profile | null>(null);

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <SectionBadge label="Career Transformation" icon={TrendingUp} />
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold font-display leading-[1.15]"
          >
            Real Profiles.
            <br />
            <span className="text-primary">Real Company Transitions.</span>
          </motion.h2>
          <p className="mt-4 text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Real professionals who used I Am Talento to switch companies, level up into bigger roles, and grow their packages.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
