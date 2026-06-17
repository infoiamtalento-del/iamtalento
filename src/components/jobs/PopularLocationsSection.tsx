import { motion } from "framer-motion";

const locations = [
  { city: "San Francisco, CA", jobs: "12,560 jobs", img: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&q=80" },
  { city: "New York, NY", jobs: "9,230 jobs", img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80" },
  { city: "London, UK", jobs: "7,450 jobs", img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80" },
  { city: "Bangalore, IN", jobs: "6,780 jobs", img: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&q=80" },
  { city: "Berlin, DE", jobs: "4,320 jobs", img: "https://images.unsplash.com/photo-1587330979470-3016b6702d89?w=600&q=80" },
  { city: "Tokyo, JP", jobs: "3,890 jobs", img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80" },
];

const PopularLocationsSection = () => {
  return (
    <section className="py-16 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-2">Popular Job Locations</h2>
          <p className="text-muted-foreground">Find jobs in top cities around the world</p>
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
