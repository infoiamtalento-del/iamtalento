import { motion } from "framer-motion";
import {
  Award, TrendingUp, Target, BrainCircuit, Gauge,
  Users, ShieldCheck, BarChart3, Building2, CheckCircle2,
} from "lucide-react";

const trustItems = [
  { icon: Award, title: "Expert-Vetted", desc: "Built by industry SMEs" },
  { icon: TrendingUp, title: "Always Current", desc: "Updated to latest standards" },
  { icon: Target, title: "Role-Specific", desc: "Mapped to job competencies" },
  { icon: BrainCircuit, title: "Real-World Tasks", desc: "Simulated workplace challenges" },
  { icon: Gauge, title: "Scientifically Validated", desc: "Psychometric principles" },
  { icon: Users, title: "Bias-Reduced", desc: "Standardized, fair scoring" },
  { icon: ShieldCheck, title: "Integrity-Protected", desc: "30-layer proctoring" },
  { icon: BarChart3, title: "Benchmarked", desc: "Comparative performance data" },
  { icon: Building2, title: "Enterprise-Ready", desc: "Scales to any org size" },
  { icon: CheckCircle2, title: "Quality Assured", desc: "Continuously refined" },
];

const CredibilityTrustSection = () => (
  <section className="py-20 bg-background">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl mx-auto mb-14"
      >
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 mb-4 rounded-full bg-primary/10 text-primary">
          <ShieldCheck className="h-3.5 w-3.5" /> Our Assessments
        </span>
        <h2 className="text-3xl md:text-4xl font-bold font-display mb-4 leading-tight">
          Credibility &amp;<br />
          <span className="text-primary">Trust</span>
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Built by the people who hire, lead, and build — so every score carries real weight.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-6xl mx-auto">
        {trustItems.map(({ icon: Icon, title, desc }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04, duration: 0.4 }}
            className="p-5 rounded-2xl bg-white border border-primary/10 hover:border-primary/25 hover:shadow-md transition-all duration-300 text-center group"
          >
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-sm font-bold font-display mb-1">{title}</h3>
            <p className="text-xs text-muted-foreground">{desc}</p>
          </motion.div>
        ))}
      </div>

      <p className="text-center mt-12 text-base font-semibold text-foreground">
        Built to replace guesswork with <span className="text-primary">measurable proof.</span>
      </p>
      <p className="text-center text-sm text-muted-foreground mt-1">
        Trusted by professionals. Recognized by employers.
      </p>
    </div>
  </section>
);

export default CredibilityTrustSection;
