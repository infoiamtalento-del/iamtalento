import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { Laptop, LineChart, Repeat2, GraduationCap, Briefcase, Rocket, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SectionBadge from "@/components/ui/section-badge";

const audiences = [
  { icon: GraduationCap, title: "Fresh Graduates", desc: "Get scored before your first job. Stand out from thousands with verified proof.", count: "80K+" },
  { icon: Briefcase, title: "Mid-Level Professionals", desc: "5-10 years in? Find out if you're ahead, behind, or right where you should be.", count: "35K+" },
  { icon: Repeat2, title: "Career Switchers", desc: "Prove your transferable skills. Close the credibility gap before your first interview.", count: "20K+" },
  { icon: LineChart, title: "Managers", desc: "Leadership, strategy, execution — validate the skills that define senior impact.", count: "15K+" },
  { icon: Rocket, title: "Founders", desc: "Know your gaps. Build a team that complements them. Lead with self-awareness.", count: "8K+" },
  { icon: Laptop, title: "Developers", desc: "Validate your coding ability with real-world challenges — not textbook theory.", count: "50K+" },
];

const WhoIsItForSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section ref={ref} className="py-16 md:py-20">
      <div className="container">
        <div className={cn("text-center max-w-2xl mx-auto mb-16 transition-all duration-700", isVisible ? "opacity-100" : "opacity-0 translate-y-8")}>
          <SectionBadge label="Who Is It For" icon={Users} />
          <motion.h2
            className="text-3xl md:text-4xl font-bold font-display mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Built for Every Stage<br />of <span className="text-primary">Your Career</span>
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            Whether you're writing your first line of code or leading a 200-person team — there's an assessment for you.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {audiences.map(({ icon: Icon, title, desc, count }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              whileHover={{ y: -6, boxShadow: "0 20px 60px -15px hsl(var(--primary) / 0.12)" }}
              className="group p-6 rounded-2xl bg-card border border-border/50 hover:shadow-xl hover:border-primary/20 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-[9px] font-bold">
                {count} users
              </div>
              <div className="h-11 w-11 rounded-xl bg-accent flex items-center justify-center mb-4 group-hover:gradient-primary transition-all duration-300">
                <Icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <h3 className="text-base font-semibold font-display mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Link to="/assessments">
            <Button size="lg" className="bg-[hsl(33,100%,50%)] text-white hover:bg-[hsl(33,100%,45%)] border-0 gap-2 h-12 px-8">
              Find My Assessment
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default WhoIsItForSection;
