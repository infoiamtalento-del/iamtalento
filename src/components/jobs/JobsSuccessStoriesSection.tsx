import { motion } from "framer-motion";
import { Star } from "lucide-react";

const stories = [
  {
    quote: "Talento helped me find my dream job at Google. The process was smooth and the opportunities are amazing!",
    name: "Sarah Johnson",
    role: "Product Designer at Google",
    avatar: "https://i.pravatar.cc/100?img=47",
  },
  {
    quote: "I got hired at Microsoft through Talento. Best platform for job seekers!",
    name: "Mike Chen",
    role: "Software Engineer at Microsoft",
    avatar: "https://i.pravatar.cc/100?img=12",
  },
  {
    quote: "Found exactly what I was looking for. Great platform with quality opportunities.",
    name: "Emily Rodriguez",
    role: "Marketing Manager at Spotify",
    avatar: "https://i.pravatar.cc/100?img=32",
  },
];

const JobsSuccessStoriesSection = () => {
  return (
    <section className="py-16 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-2">Success Stories</h2>
          <p className="text-muted-foreground">Hear from professionals who found their dream jobs</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {stories.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-6 rounded-xl bg-card border border-border/50 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 text-primary fill-primary" />
                ))}
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed mb-5">"{s.quote}"</p>
              <div className="flex items-center gap-3">
                <img src={s.avatar} alt={s.name} className="h-10 w-10 rounded-full object-cover" loading="lazy" />
                <div>
                  <p className="text-sm font-semibold font-display">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobsSuccessStoriesSection;
