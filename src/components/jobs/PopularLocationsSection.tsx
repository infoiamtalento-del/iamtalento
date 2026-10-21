import { motion } from "framer-motion";
import SectionBadge from "@/components/ui/section-badge";
import { MapPin } from "lucide-react";

const locations = [
  { city: "Bangalore, KA", jobs: "12,560 jobs", img: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&q=80" },
  { city: "Mumbai, MH", jobs: "10,420 jobs", img: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80" },
  { city: "Delhi, DL", jobs: "9,180 jobs", img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80" },
  { city: "Hyderabad, TS", jobs: "7,650 jobs", img: "https://images.unsplash.com/photo-1572445271230-a78b5944a659?w=600&q=80" },
  { city: "Pune, MH", jobs: "5,930 jobs", img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80" },
  { city: "Chennai, TN", jobs: "4,720 jobs", img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80" },
];

const PopularLocationsSection = () => {
  return (
    <section className="py-16 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10">
          <SectionBadge label="Job Locations" icon={MapPin} />
          <h2 className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3">
            Explore Jobs in India's<br />
            <span className="text-primary">Hottest Job Markets</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            From Bangalore and Mumbai to Delhi and Hyderabad,
            <br className="hidden md:block" />
            discover openings in the city you want to grow in.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {locations.map((loc, i) => (
            <motion.div
              key={loc.city}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="relative rounded-xl overflow-hidden cursor-pointer group h-40 shadow-md"
            >
              <img src={loc.img} alt={loc.city} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="text-sm font-semibold font-display">{loc.city}</p>
                <p className="text-xs text-white/85">{loc.jobs}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularLocationsSection;
