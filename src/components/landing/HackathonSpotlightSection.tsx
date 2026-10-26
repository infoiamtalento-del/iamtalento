import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionBadge from "@/components/ui/section-badge";
import FeaturedEventCard from "@/components/landing/FeaturedEventCard";

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

const HackathonSpotlightSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 text-center flex flex-col items-center">
          <SectionBadge label="Season 4: Now Open" icon={Trophy} />
          <h2 className="mt-4 text-3xl md:text-4xl font-bold font-display text-foreground leading-[1.15]">
            Compete. Build.
            <br />
            <span className="text-primary">Get Hired.</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-base md:text-lg max-w-2xl">
            Join India's biggest coding competition. Win cash prizes, earn your verified badge,
            <br className="hidden md:block" />
            and unlock direct interviews with top tech companies.
          </p>
        </motion.div>

        <FeaturedEventCard />

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
