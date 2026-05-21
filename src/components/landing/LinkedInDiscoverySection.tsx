import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { Award, Eye, UserCheck, MessageSquare, ArrowRight, Star, TrendingUp, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SectionBadge from "@/components/ui/section-badge";

const profiles = [
  { name: "Ankit Verma", role: "Full-Stack Engineer", score: 88, company: "Ex-Razorpay", skills: ["React", "Node.js", "AWS"], position: "Above Market", img: "https://randomuser.me/api/portraits/men/52.jpg" },
  { name: "Sneha Iyer", role: "Data Scientist", score: 91, company: "Ex-Flipkart", skills: ["Python", "TensorFlow", "SQL"], position: "Top 8%", img: "https://randomuser.me/api/portraits/women/63.jpg" },
  { name: "Rahul Mehta", role: "Product Manager", score: 79, company: "Ex-Paytm", skills: ["Strategy", "Analytics", "Agile"], position: "At Market", img: "https://randomuser.me/api/portraits/men/74.jpg" },
  { name: "Priya Singh", role: "DevOps Engineer", score: 85, company: "Ex-Infosys", skills: ["K8s", "Terraform", "CI/CD"], position: "Above Market", img: "https://randomuser.me/api/portraits/women/85.jpg" },
];

const recruiterPhotos = [
  "https://randomuser.me/api/portraits/women/30.jpg",
  "https://randomuser.me/api/portraits/men/40.jpg",
  "https://randomuser.me/api/portraits/women/50.jpg",
  "https://randomuser.me/api/portraits/men/60.jpg",
  "https://randomuser.me/api/portraits/women/70.jpg",
];

const LinkedInDiscoverySection = () => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section ref={ref} className="py-28">
      <div className="container">
        <div className={cn("text-center max-w-2xl mx-auto mb-16 transition-all duration-700", isVisible ? "opacity-100" : "opacity-0 translate-y-8")}>
          <SectionBadge label="Get Discovered" icon={Search} />
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Stop Applying. Start Getting Found.</h2>
          <p className="text-muted-foreground text-lg mb-6">Your verified profile puts you in front of recruiters who trust data over résumé claims.</p>

          <div className="flex items-center justify-center gap-3">
            <div className="flex -space-x-2">
              {recruiterPhotos.map((src, i) => (
                <img key={i} src={src} alt="Recruiter" className="h-7 w-7 rounded-full border-2 border-background object-cover" />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">12,000+ recruiters actively hiring</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {profiles.map(({ name, role, score, company, skills, position, img }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-xl transition-all duration-300 flex items-center gap-5 group"
            >
              <div className="relative shrink-0">
                <img src={img} alt={name} className="h-14 w-14 rounded-full object-cover border-2 border-accent" />
                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-success border-2 border-card flex items-center justify-center">
                  <Award className="h-3 w-3 text-success-foreground" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold truncate">{name}</p>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-[10px] font-semibold shrink-0">
                    <Award className="h-3 w-3" /> Verified
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{role} · {company}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {skills.map(s => (
                    <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-medium">{s}</span>
                  ))}
                </div>
              </div>

              <div className="text-center shrink-0">
                <p className="text-xl font-bold font-display gradient-text">{score}</p>
                <p className="text-[9px] text-muted-foreground">Readiness</p>
                <div className="inline-flex items-center gap-0.5 mt-1 text-[8px] text-success font-semibold">
                  <TrendingUp className="h-2.5 w-2.5" /> {position}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center hover:gradient-primary transition-all cursor-pointer">
                  <Eye className="h-4 w-4 text-primary" />
                </div>
                <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center hover:gradient-primary transition-all cursor-pointer">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/assessments">
            <Button size="lg" className="gradient-primary border-0 shadow-glow hover:opacity-90 gap-2 h-12 px-8">
              Build My Verified Profile <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LinkedInDiscoverySection;
