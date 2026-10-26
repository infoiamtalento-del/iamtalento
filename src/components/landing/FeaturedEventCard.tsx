import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ArrowRight, Users, Laptop, Flame, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import hackathonHero from "@/assets/hackathon-hero.jpg";
import hackathonEvent1 from "@/assets/hackathon-event-1.jpg";
import hackathonEvent2 from "@/assets/hackathon-event-2.jpg";

const spotlightImages = [hackathonHero, hackathonEvent1, hackathonEvent2];

const CountdownDigit = ({ value }: { value: number }) => {
  const display = String(value).padStart(2, "0");
  return (
    <div className="text-center">
      <AnimatePresence mode="wait">
        <motion.span
          key={display}
          initial={{ y: -20, opacity: 0, filter: "blur(4px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: 20, opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="block text-3xl md:text-4xl font-bold font-display text-primary-foreground tabular-nums leading-none"
        >
          {display}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

const SpotlightCarousel = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((p) => (p + 1) % spotlightImages.length), 4000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.img
          key={idx}
          src={spotlightImages[idx]}
          alt="Season 4 hackathon"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {spotlightImages.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? "w-5 bg-primary-foreground" : "w-1.5 bg-primary-foreground/40"}`} />
        ))}
      </div>
    </div>
  );
};

type FeaturedEventCardProps = {
  /** Route the Register Now button opens. Left empty, the button stays inert as on the homepage. */
  registerTo?: string;
  /** Pages restricted to the site palette swap the green/orange accents for brand blue. */
  monoAccents?: boolean;
};

export const FeaturedEventCard = ({ registerTo, monoAccents = false }: FeaturedEventCardProps) => {
  const deadlineDate = new Date("2025-08-15T00:00:00");
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = deadlineDate.getTime() - Date.now();
      if (diff <= 0) { setCountdown({ days: 0, hours: 0, mins: 0, secs: 0 }); return; }
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / (1000 * 60)) % 60),
        secs: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const registerClasses = "bg-primary-foreground text-primary hover:bg-primary-foreground/90 gap-2 font-bold h-10 px-6 shadow-xl rounded-xl text-sm";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl bg-primary overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 p-6 md:p-8 lg:p-10 flex flex-col justify-center gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-foreground/10 text-xs font-bold text-primary-foreground tracking-wider uppercase">
              <span className="relative flex h-2 w-2">
                <span className={`absolute inset-0 rounded-full animate-ping opacity-75 ${monoAccents ? "bg-primary-foreground" : "bg-green-400"}`} />
                <span className={`relative rounded-full h-2 w-2 ${monoAccents ? "bg-primary-foreground" : "bg-green-400"}`} />
              </span>
              Registration Live
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-foreground/10 text-xs font-semibold text-primary-foreground">
              <Flame className={`h-3.5 w-3.5 ${monoAccents ? "text-primary-foreground" : "text-orange-300"}`} /> Free Entry
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display text-primary-foreground leading-tight">
            Code Arena · Season 4
          </h2>
          <p className="text-primary-foreground/70 text-sm md:text-base max-w-lg leading-relaxed">
            Build AI-powered tools that solve real hiring, skilling, and workforce challenges. Ship something that matters.
          </p>

          <div className="flex flex-wrap gap-2">
            {[
              { icon: Calendar, text: "Aug 15–17, 2025" },
              { icon: Laptop, text: "Online · Global" },
              { icon: Users, text: "Teams of 1–4" },
              { icon: Zap, text: "48hrs + 2wk build" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary-foreground text-primary text-xs font-medium">
                <Icon className="h-3.5 w-3.5" />
                {text}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {[
              { value: countdown.days, label: "DAYS" },
              { value: countdown.hours, label: "HOURS" },
              { value: countdown.mins, label: "MINS" },
              { value: countdown.secs, label: "SECS" },
            ].map(({ value, label }, i) => (
              <div key={label} className="flex items-center gap-4">
                <div className="text-center">
                  <CountdownDigit value={value} />
                  <span className="text-[10px] text-primary-foreground/50 uppercase tracking-wider font-medium mt-1 block">{label}</span>
                </div>
                {i < 3 && <span className="text-2xl font-light text-primary-foreground/20 -mt-4">:</span>}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-3">
            {registerTo ? (
              <Button asChild size="default" className={registerClasses}>
                <Link to={registerTo}>Register Now <ArrowRight className="h-5 w-5" /></Link>
              </Button>
            ) : (
              <Button size="default" className={registerClasses}>
                Register Now <ArrowRight className="h-5 w-5" />
              </Button>
            )}
            <span className="text-primary-foreground/50 text-sm mt-3 sm:mt-0 sm:self-center">2,340+ already registered</span>
          </div>

          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary-foreground/[0.08] border border-primary-foreground/10 w-fit">
            <div className="h-7 w-7 rounded-md bg-primary-foreground flex items-center justify-center shrink-0">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-[10px] text-primary-foreground/50 uppercase tracking-wider font-medium">Channel Partner</p>
              <p className="text-sm font-bold text-primary-foreground">I Am Talento</p>
            </div>
          </div>
        </div>

        <div className="h-[250px] lg:h-auto lg:w-[42%] lg:min-h-0 p-2 lg:p-3">
          <SpotlightCarousel />
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturedEventCard;
