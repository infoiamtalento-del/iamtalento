import { Calendar, Mic, Radio, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SectionBadge from "@/components/ui/section-badge";

import eventIndustry from "@/assets/event-industry.jpg";
import eventMeetup from "@/assets/event-meetup.jpg";
import eventOnline from "@/assets/event-online.jpg";
import eventPodcast from "@/assets/event-podcast.jpg";

const events = [
  { icon: Calendar, title: "Industry Events", desc: "Network with hiring managers and peers at curated career events.", color: "bg-primary/10 text-primary", image: eventIndustry },
  { icon: Users, title: "Offline Meetups", desc: "In-person sessions in your city to practice, learn, and connect.", color: "bg-[hsl(33,100%,50%)]/10 text-[hsl(33,100%,50%)]", image: eventMeetup },
  { icon: Radio, title: "Online Events", desc: "Live webinars and workshops you can join from anywhere.", color: "bg-primary/10 text-primary", image: eventOnline },
  { icon: Mic, title: "Live Podcasts", desc: "Hear from industry leaders sharing career insights and tips.", color: "bg-[hsl(33,100%,50%)]/10 text-[hsl(33,100%,50%)]", image: eventPodcast },
];

const JobsEventsSection = () => (
  <section className="py-16 md:py-20 bg-accent/20">
    <div className="container px-4 md:px-6 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <SectionBadge label="Events & Meetups" icon={Calendar} />
        <h2 className="text-3xl md:text-4xl font-bold font-display mb-3">
          Grow Your Network,<br />
          <span className="text-primary">Grow Your Career</span>
        </h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
          Join curated events designed to connect you with opportunities and industry leaders.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-10">
        {events.map(({ icon: Icon, title, desc, color, image }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <Link to="/meetups" className="block rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 h-full group overflow-hidden">
              <div className="relative h-36 overflow-hidden">
                <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-5">
                <div className={`h-10 w-10 rounded-lg ${color} flex items-center justify-center mb-3`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold font-display mb-1">{title}</p>
                <p className="text-xs text-muted-foreground mb-3">{desc}</p>
                <span className="text-xs font-medium text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Explore <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <Link to="/meetups">
          <Button variant="outline" className="border-border gap-2">
            View All Events <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  </section>
);

export default JobsEventsSection;
