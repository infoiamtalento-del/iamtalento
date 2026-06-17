import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const articles = [
  {
    tag: "Career Tips",
    date: "May 15, 2024",
    title: "10 Tips for Acing Your Next Job Interview",
    img: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80",
  },
  {
    tag: "Resume",
    date: "May 12, 2024",
    title: "How to Write a Resume That Gets You Hired",
    img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
  },
  {
    tag: "Career Growth",
    date: "May 10, 2024",
    title: "Top Skills to Learn in 2024 and Beyond",
    img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
  },
];

const CareerResourcesSection = () => {
  return (
    <section className="py-16 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-2">Career Resources</h2>
          <p className="text-muted-foreground">Accelerate your career with expert advice</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {articles.map((a, i) => (
            <motion.article
              key={a.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl bg-card border border-border/50 overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
            >
              <div className="aspect-[16/9] overflow-hidden">
                <img src={a.img} alt={a.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-block text-[11px] font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">{a.tag}</span>
                  <span className="text-xs text-muted-foreground">{a.date}</span>
                </div>
                <h3 className="text-lg font-bold font-display mb-3 leading-snug">{a.title}</h3>
                <a className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all">
                  Read more <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CareerResourcesSection;
