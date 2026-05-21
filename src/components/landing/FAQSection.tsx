import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

const faqs = [
  { q: "What is the Industry Readiness Score?", a: "The Industry Readiness Score is an AI-powered benchmark that evaluates your skills, experience, and domain knowledge against peers in your industry, role, and experience level. It tells you if you're Above Market, Market Ready, or Below Market — with specific strength areas, weaknesses, and a personalized growth roadmap." },
  { q: "How secure is the assessment?", a: "Our assessments use 20+ anti-cheating features including webcam eye proctoring, AI behavior detection, tab switch detection, paste detection, screenshot protection, code playback analysis, IP tracking, and identity verification. We are SOC 2 Type II, GDPR, EEOC, and ISO 27001 compliant." },
  { q: "Are the questions created by domain experts?", a: "Yes. Every assessment is built with questions designed by industry professionals with 10+ years of domain experience. Questions are regularly updated to match current industry standards. They are NOT generic AI-generated questions — they test real-world, practical skills." },
  { q: "Can I retake the assessment?", a: "Yes, you can retake assessments after a cooldown period to demonstrate improvement. Each attempt generates a new score, and employers can see your progression trajectory — which actually helps demonstrate growth mindset." },
  { q: "What do employers see when I apply?", a: "Employers see your Industry Readiness Score, Verified Skill Badge, skill breakdown (strengths and areas to improve), peer benchmark comparison, and assessment integrity verification. They do NOT see your personal information until you choose to share it." },
  { q: "What is the Verified Skill Badge?", a: "The Verified Skill Badge is earned after completing a proctored assessment. It signals to employers that your skills have been independently verified through a secure, anti-cheating-protected test. Candidates with badges get 2.4x more interview calls." },
  { q: "How does pricing work?", a: "Candidates can create profiles, take assessments, get their Industry Readiness Score, and earn Verified Badges. Employer plans are based on team size and usage — visit our Pricing page for details." },
  { q: "How does AI screening work for employers?", a: "Our AI evaluates candidates across 40+ dimensions — technical skills, experience depth, certifications, cultural fit, and career trajectory. It produces an explainable match score with detailed reasoning, helping hiring managers understand exactly why a candidate was recommended or flagged." },
  { q: "What data security measures are in place?", a: "We're SOC 2 Type II certified with end-to-end encryption, GDPR compliance, role-based access controls, and regular penetration testing. Candidate data is never sold or shared with third parties. All assessment sessions are encrypted and access-controlled." },
];

const FAQSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section ref={ref} className="py-16 md:py-20">
      <div className="container max-w-3xl">
        <div className="text-center mb-16">
          <SectionBadge label="FAQ" icon={HelpCircle} />
          <motion.h2
            className="text-3xl md:text-4xl font-bold font-display mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Got Questions?<br /><span className="text-primary">We've Got Answers.</span>
          </motion.h2>
          <p className="text-muted-foreground">Everything you need to know about IAmTalento — no jargon, no fluff.</p>
        </div>
        <div className={cn("transition-all duration-700", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map(({ q, a }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <AccordionItem
                  value={`faq-${i}`}
                  className="bg-card border border-border/50 rounded-xl px-6 data-[state=open]:shadow-lg data-[state=open]:border-primary/20 transition-all duration-300"
                >
                  <AccordionTrigger className="text-sm font-medium hover:no-underline text-left">{q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">{a}</AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
