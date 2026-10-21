import { motion } from "framer-motion";
import { HelpCircle, MessageCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SectionBadge from "@/components/ui/section-badge";

const faqs = [
  { q: "What happens if I don't pass the benchmark?", a: "You receive your full report regardless of your score. It includes your exact gaps and a roadmap to close them. You can retake after 30 days. Many candidates who retake improve significantly and unlock their badge." },
  { q: "Can employers see my score if I score low?", a: "No. Only candidates who meet the benchmark get public employer visibility. If you score below market, your report is private to you until you choose to retake." },
  { q: "How is this different from LinkedIn assessments or other online tests?", a: "I Am Talento assessments are proctored, identity-verified, and benchmarked against real industry data, not self-reported or gameable. Employers trust them because they can't be faked." },
  { q: "How long do I have to take the test after paying?", a: "30 days from the date of payment. You can schedule it any time within that window." },
  { q: "What if I face technical issues during the test?", a: "Our support team is available during all test windows. If a technical issue on our end disrupts your test, you get a free retake, no questions asked." },
  { q: "Is the assessment available for all industries and roles?", a: "We currently cover Technology, Marketing, Finance, HR, Operations, Design, and Sales, with new domains added every quarter." },
  { q: "Will my employer know I took this assessment?", a: "Not unless you share your profile or certificate with them. Your assessment activity is private until you choose to make it visible." },
];

const AssessmentFAQ = () => (
  <section className="bg-white py-16 md:py-20">
    <div className="container">
      <div className="grid md:grid-cols-5 gap-10">
        {/* Left — header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="md:col-span-2 md:sticky md:top-28 md:self-start"
        >
          <SectionBadge label="FAQ" icon={HelpCircle} />
          <h2 className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3 text-foreground">
            Questions Candidates<br />
            <span className="text-primary">Ask Before Starting</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-5 max-w-2xl">
            Can't find what you're looking for?
            <br className="hidden md:block" />
            Reach out to our support team.
          </p>
          <button
            className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 text-sm font-bold hover:bg-primary/90 transition-colors"
            style={{ borderRadius: 8 }}
          >
            <MessageCircle className="h-4 w-4" /> Chat with Support
          </button>
        </motion.div>

        {/* Right — accordion */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="md:col-span-3"
        >
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((f, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="bg-white px-5 data-[state=open]:shadow-sm transition-all"
                style={{ borderRadius: 12, border: "1px solid #E2E8F0" }}
              >
                <AccordionTrigger
                  className="text-sm font-semibold text-left hover:no-underline py-4"
                  style={{ color: "#0F172A" }}
                >
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-[13px] leading-relaxed pb-4" style={{ color: "#475569" }}>
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </div>
  </section>
);

export default AssessmentFAQ;
