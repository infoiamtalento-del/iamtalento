import { Calendar, Code2, Radio, ArrowRight, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import eventNetworking from "@/assets/event-networking.jpg";
import eventHackathon from "@/assets/event-hackathon.jpg";
import eventWebinar from "@/assets/event-webinar.jpg";

const bonuses = [
  {
    icon: Calendar,
    title: "Networking Events",
    desc: "Curated meetups with hiring managers and peers.",
    image: eventNetworking,
    link: "/meetups",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Code2,
    title: "Hackathons",
    desc: "Build, compete and showcase your skills.",
    image: eventHackathon,
    link: "/hackathons",
    color: "bg-[hsl(33,100%,50%)]/10 text-[hsl(33,100%,50%)]",
  },
  {
    icon: Radio,
    title: "Online Webinars",
    desc: "Live workshops you can join from anywhere.",
    image: eventWebinar,
    link: "/webinars",
    color: "bg-primary/10 text-primary",
  },
];

const CareerBonusSection = () => (
  <section className="py-14 bg-background">
    <div className="container px-4 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
          <Gift className="w-3.5 h-3.5" />
          Additional Bonus
        </div>
        <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
          Plus, free access to <span className="text-primary">growth opportunities</span>
        </h3>
        <p className="text-muted-foreground text-sm mt-2 max-w-xl mx-auto">
          Every assessment unlocks these career-boosting perks at no extra cost.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {bonuses.map(({ icon: Icon, title, desc, image, link, color }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
          >
            <Link
              to={link}
              className="group block rounded-xl bg-card border border-border/60 hover:border-primary/40 hover:shadow-md transition-all overflow-hidden h-full"
            >
              <div className="relative h-28 overflow-hidden">
                <img
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`h-7 w-7 rounded-md ${color} flex items-center justify-center`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-sm font-semibold">{title}</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">{desc}</p>
                <span className="text-xs font-medium text-primary inline-flex items-center gap-1 group-hover:gap-1.5 transition-all">
                  Explore <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default CareerBonusSection;
