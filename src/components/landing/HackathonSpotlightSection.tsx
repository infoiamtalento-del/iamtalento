import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ArrowRight, Trophy, Zap, Users, Laptop, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionBadge from "@/components/ui/section-badge";
import hackathonHero from "@/assets/hackathon-hero.jpg";
import hackathonEvent1 from "@/assets/hackathon-event-1.jpg";
import hackathonEvent2 from "@/assets/hackathon-event-2.jpg";

const prizes = [
  { icon: "🥇", label: "1st Place", value: "₹5,00,000", extra: "Fast-track interviews + Verified Badge + Feature" },
  { icon: "🥈", label: "2nd Place", value: "₹2,50,000", extra: "Interview Access + Badge" },
  { icon: "🥉", label: "3rd Place", value: "₹1,00,000", extra: "Badge" },
  { icon: "🏅", label: "Top 10", value: "Verified Badge", extra: "Employer Visibility + Certificate" },
  { icon: "🎖️", label: "All Participants", value: "Certificate", extra: "Profile boost" },
];

const partnerLogos = [
  { name: "Google", logo: "https://www.google.com/s2/favicons?domain=google.com&sz=64" },
  { name: "Microsoft", logo: "https://www.google.com/s2/favicons?domain=microsoft.com&sz=64" },
  { name: "Amazon", logo: "https://www.google.com/s2/favicons?domain=amazon.com&sz=64" },
  { name: "Razorpay", logo: "https://www.google.com/s2/favicons?domain=razorpay.com&sz=64" },
  { name: "Flipkart", logo: "https://www.google.com/s2/favicons?domain=flipkart.com&sz=64" },
  { name: "Swiggy", logo: "https://www.google.com/s2/favicons?domain=swiggy.com&sz=64" },
  { name: "PhonePe", logo: "https://www.google.com/s2/favicons?domain=phonepe.com&sz=64" },
  { name: "Infosys", logo: "https://www.google.com/s2/favicons?domain=infosys.com&sz=64" },
  { name: "Walmart", logo: "https://www.google.com/s2/favicons?domain=walmart.com&sz=64" },
  { name: "Deloitte", logo: "https://www.google.com/s2/favicons?domain=deloitte.com&sz=64" },
];
const doubledLogos = [...partnerLogos, ...partnerLogos];

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

const spotlightImages = [hackathonHero, hackathonEvent1, hackathonEvent2];

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

const HackathonSpotlightSection = () => {
  const navigate = useNavigate();
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

  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 text-center flex flex-col items-center">
          <SectionBadge label="Season 4 — Now Open" icon={Trophy} />
          <h2 className="mt-4 text-3xl md:text-4xl font-bold font-display text-foreground leading-tight">
            Compete. Build. Get Hired.
          </h2>
          <p className="mt-2 text-muted-foreground text-sm md:text-base max-w-xl">
            Join India's biggest coding competition. Win cash prizes, get verified, and unlock direct interviews with top tech companies.
          </p>
        </motion.div>

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
                    <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
                    <span className="relative rounded-full h-2 w-2 bg-green-400" />
                  </span>
                  Registration Live
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-foreground/10 text-xs font-semibold text-primary-foreground">
                  <Flame className="h-3.5 w-3.5 text-orange-300" /> Free Entry
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
                <Button size="default" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 gap-2 font-bold h-10 px-6 shadow-xl rounded-xl text-sm">
                  Register Now <ArrowRight className="h-5 w-5" />
                </Button>
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

            <div className="lg:w-[42%] min-h-[250px] lg:min-h-0 p-2 lg:p-3">
              <SpotlightCarousel />
            </div>
          </div>
        </motion.div>

        <div className="relative mt-4 py-3 overflow-hidden rounded-xl bg-card border border-border">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-card to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-card to-transparent z-10" />
          <motion.div
            className="flex w-max gap-8 items-center px-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            {doubledLogos.map((p, i) => (
              <div key={`logo-${i}`} className="flex items-center gap-2 shrink-0">
                <img src={p.logo} alt={p.name} className="h-5 w-5 object-contain" loading="lazy" />
                <span className="text-muted-foreground text-xs font-medium whitespace-nowrap">{p.name}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6">
          {prizes.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className={`rounded-2xl p-5 text-center ${
                i === 0
                  ? "bg-primary text-primary-foreground border-2 border-primary shadow-lg"
                  : "bg-card border border-border hover:border-primary/30 transition-colors"
              }`}
            >
              <span className="text-3xl block mb-2">{p.icon}</span>
              <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${i === 0 ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{p.label}</p>
              <p className={`text-lg font-bold font-display ${i === 0 ? "text-primary-foreground" : "text-foreground"}`}>{p.value}</p>
              <p className={`text-[11px] mt-1 leading-tight ${i === 0 ? "text-primary-foreground/50" : "text-muted-foreground"}`}>{p.extra}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 flex flex-col items-center text-center"
        >
          <Button
            onClick={() => navigate("/hackathons")}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 font-bold h-12 px-8 shadow-xl rounded-xl text-base"
          >
            Explore Hackathon <ArrowRight className="h-5 w-5" />
          </Button>
          <p className="mt-3 text-muted-foreground text-sm">Free entry · Open to all skill levels · Aug 15–17, 2025</p>
        </motion.div>
      </div>
    </section>
  );
};

export default HackathonSpotlightSection;
