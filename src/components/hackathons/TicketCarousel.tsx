import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Users, ArrowRight, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionBadge from "@/components/ui/section-badge";

import ticketImg1 from "@/assets/hackathon-ticket-1.jpg";
import ticketImg2 from "@/assets/hackathon-ticket-2.jpg";
import ticketImg3 from "@/assets/hackathon-ticket-3.jpg";

const events = [
  {
    title: "Code Arena",
    subtitle: "Season 4",
    date: "Aug 15–17, 2025",
    time: "48 Hours Non-Stop",
    location: "Bangalore, India",
    venue: "Koramangala Tech Park",
    spotsLeft: 120,
    totalSpots: 500,
    tag: "REGISTERING NOW",
    image: ticketImg1,
  },
  {
    title: "HackFest",
    subtitle: "Awards Night",
    date: "Sep 20, 2025",
    time: "6:00 PM IST",
    location: "Mumbai, India",
    venue: "BKC Convention Centre",
    spotsLeft: 45,
    totalSpots: 200,
    tag: "VIP ACCESS",
    image: ticketImg2,
  },
  {
    title: "Builder's",
    subtitle: "Meetup",
    date: "Oct 5, 2025",
    time: "10:00 AM IST",
    location: "Delhi NCR, India",
    venue: "Cyber Hub, Gurgaon",
    spotsLeft: 80,
    totalSpots: 150,
    tag: "FREE ENTRY",
    image: ticketImg3,
  },
];

const AUTOPLAY_MS = 5000;

const TicketCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (dir: 1 | -1) => {
      setDirection(dir);
      setCurrent((prev) => (prev + dir + events.length) % events.length);
    },
    [],
  );

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, go]);

  const ev = events[current];
  const spotsPercent = ((ev.totalSpots - ev.spotsLeft) / ev.totalSpots) * 100;

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 400 : -400, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d > 0 ? -400 : 400, opacity: 0, scale: 0.95 }),
  };

  return (
    <section className="py-16 md:py-20 overflow-hidden">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center flex flex-col items-center"
        >
          <SectionBadge label="Upcoming Events" icon={Calendar} />
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-3">
            Grab Your <span className="text-primary">Spot</span>
          </h2>
          <p className="text-muted-foreground max-w-md">
            Limited spots. Real competitions. Don't miss out.
          </p>
        </motion.div>

        {/* Banner */}
        <div
          className="relative max-w-[960px] mx-auto"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden bg-primary shadow-lg">
                {/* LEFT — Details */}
                <div className="md:w-[55%] p-8 md:p-10 lg:p-12 flex flex-col justify-between gap-6">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-foreground/15 text-[10px] font-bold text-primary-foreground tracking-widest uppercase mb-5">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inset-0 rounded-full bg-primary-foreground animate-ping opacity-75" />
                        <span className="relative rounded-full h-1.5 w-1.5 bg-primary-foreground" />
                      </span>
                      {ev.tag}
                    </span>

                    <h3 className="text-4xl md:text-5xl font-bold font-display text-primary-foreground leading-[1.05] tracking-tight">
                      {ev.title}
                    </h3>
                    <p className="text-2xl md:text-3xl font-bold font-display text-primary-foreground/70 leading-tight mt-1">
                      {ev.subtitle}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3 text-primary-foreground/90 text-[13px]">
                      <Calendar className="h-4 w-4 text-primary-foreground/60" />
                      <span className="font-medium">{ev.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-primary-foreground/90 text-[13px]">
                      <Clock className="h-4 w-4 text-primary-foreground/60" />
                      <span>{ev.time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-primary-foreground/90 text-[13px]">
                      <MapPin className="h-4 w-4 text-primary-foreground/60" />
                      <span>{ev.venue}, {ev.location}</span>
                    </div>

                    {/* Spots progress */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-[11px] text-primary-foreground/70 mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <Users className="h-3 w-3" />
                          <span className="font-semibold text-primary-foreground">{ev.spotsLeft}</span> spots left
                        </span>
                        <span>{ev.totalSpots} total</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-primary-foreground/15 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-primary-foreground/80"
                          initial={{ width: 0 }}
                          animate={{ width: `${spotsPercent}%` }}
                          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                        />
                      </div>
                    </div>

                    <div className="pt-3">
                      <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 gap-2 font-bold h-11 px-7">
                        Reserve My Spot <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* RIGHT — Image */}
                <div className="relative md:w-[45%] min-h-[220px] md:min-h-0">
                  <img
                    src={ev.image}
                    alt={`${ev.title} ${ev.subtitle}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-transparent hidden md:block" />
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/40 to-transparent md:hidden" />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => go(-1)}
              className="h-10 w-10 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              {events.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > current ? 1 : -1);
                    setCurrent(i);
                  }}
                  className="relative h-2 rounded-full bg-primary/20 transition-all duration-500"
                  style={{ width: i === current ? 28 : 8 }}
                >
                  {i === current && (
                    <motion.div
                      layoutId="ticket-dot"
                      className="absolute inset-0 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => go(1)}
              className="h-10 w-10 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TicketCarousel;
