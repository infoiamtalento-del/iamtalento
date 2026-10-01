import { motion } from "framer-motion";
import { Award, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SectionBadge from "@/components/ui/section-badge";

import courseAiMl from "@/assets/course-ai-ml.jpg";
import courseData from "@/assets/course-data-analytics.jpg";
import courseMarketing from "@/assets/course-digital-marketing.jpg";

const certs = [
  { title: "Google AI", img: courseAiMl, org: "Google" },
  { title: "AWS Cloud", img: courseData, org: "Amazon" },
  { title: "Meta Marketing", img: courseMarketing, org: "Meta" },
];

const GetCertifiedSection = () => (
  <section className="py-16 md:py-20">
    <div className="container px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl bg-primary text-primary-foreground p-8 md:p-12 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/4" />
        <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
          <div>
            <SectionBadge label="Certifications" icon={Award} className="bg-white/10 text-white border-white/20" />
            <h2 className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3 text-white">
              Earn Trusted Certifications<br /><span className="text-white/75">Build Career Momentum</span>
            </h2>
            <p className="text-white/70 text-base md:text-lg max-w-2xl mb-6">
              <span className="block">Build your profile with credentials that make completed learning visible.</span>
              <span className="block">Turn new skills into trusted proof.</span>
            </p>
            <Link to="/learning#courses">
              <Button className="bg-warning text-warning-foreground hover:bg-warning/90 gap-2 font-semibold">
                Explore Certifications <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="flex gap-4 justify-center">
            {certs.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="w-28 md:w-32 rounded-xl overflow-hidden border border-white/10 bg-white"
              >
                <img src={c.img} alt={c.title} className="w-full h-20 object-cover" />
                <div className="p-2 text-center">
                  <p className="text-[10px] font-bold text-foreground">{c.title}</p>
                  <p className="text-[9px] text-muted-foreground">{c.org}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default GetCertifiedSection;
