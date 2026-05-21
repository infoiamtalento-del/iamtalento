import { Video, Sparkles, Cable, PaintBucket, FileUp, Wand2, Crosshair, Library, Earth, Bot, Mic2, ClipboardList, Building2 } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const groupA = [
  { icon: Video, title: "Video Interviews", desc: "Live & automated video interviews with AI-powered analysis and recording." },
  { icon: Sparkles, title: "AI Auto-Scoring", desc: "Instant, unbiased candidate scoring across multiple evaluation dimensions." },
  { icon: Cable, title: "40+ ATS Integrations", desc: "Seamlessly connects with your existing applicant tracking systems." },
  { icon: PaintBucket, title: "Custom Branding", desc: "White-label assessments that match your company's look and feel." },
  { icon: FileUp, title: "Assessment Importing", desc: "Import your existing tests and question banks in minutes." },
  { icon: Wand2, title: "AI Assessment Builder", desc: "Generate role-specific assessments from job descriptions using AI." },
];

const groupB = [
  { icon: Crosshair, title: "Hard & Soft Skills", desc: "Evaluate technical expertise alongside communication and leadership." },
  { icon: Library, title: "Library or Build Your Own", desc: "Choose from 200+ ready-made assessments or create custom ones." },
  { icon: Earth, title: "Role & Industry Coverage", desc: "Comprehensive coverage across 50+ industries and thousands of roles." },
  { icon: Bot, title: "AI Proficiency Tests", desc: "Measure candidates' ability to effectively leverage AI tools." },
  { icon: Mic2, title: "Voice Originality Testing", desc: "Detect AI-generated responses with voice pattern analysis." },
  { icon: ClipboardList, title: "Detailed AI Reports", desc: "Auto-scored results with granular breakdowns and hiring recommendations." },
];

const CardGrid = ({ items, delay = 0 }: { items: typeof groupA; delay?: number }) => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map(({ icon: Icon, title, desc }, i) => (
        <div
          key={title}
          className={cn(
            "group p-5 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
          style={{ transitionDelay: `${(i + delay) * 80}ms` }}
        >
          <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center mb-3 group-hover:bg-primary transition-colors duration-300">
            <Icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
          </div>
          <h4 className="font-semibold font-display text-sm mb-1">{title}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
        </div>
      ))}
    </div>
  );
};

const EmployerScreeningSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container">
        <div
          ref={ref}
          className={cn("text-center max-w-2xl mx-auto mb-14 transition-all duration-700", isVisible ? "opacity-100" : "opacity-0 translate-y-6")}
        >
          <SectionBadge label="For Employers" icon={Building2} />
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Hire Smarter. Screen Faster.</h2>
          <p className="text-muted-foreground leading-relaxed">
            Automate mass-screening with AI-powered assessments, video interviews, and seamless ATS integration — all in one platform.
          </p>
        </div>

        <div className="space-y-12">
          <div>
            <h3 className="text-lg font-semibold font-display mb-5 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Automate Your Hiring Pipeline
            </h3>
            <CardGrid items={groupA} />
          </div>

          <div>
            <h3 className="text-lg font-semibold font-display mb-5 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Evaluate What Matters
            </h3>
            <CardGrid items={groupB} delay={6} />
          </div>
        </div>

        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <Link to="/contact">Start Screening Talent</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EmployerScreeningSection;
