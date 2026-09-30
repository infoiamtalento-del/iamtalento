import { useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, Quote, ShieldCheck, ArrowLeft, ArrowRight } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";
import { Button } from "@/components/ui/button";

type Story = {
  initials: string;
  name: string;
  city: string;
  role: string;
  company: string;
  score: number;
  quote: string;
};

const stories: Story[] = [
  // Page 1
  { initials: "PR", name: "Priya R.", city: "Mumbai", role: "Product Mgmt", company: "Swiggy", score: 91, quote: "The assessment helped me discover my strengths and land my dream role." },
  { initials: "NK", name: "Nikhil K.", city: "Chennai", role: "Python / ML", company: "Flipkart", score: 94, quote: "Verified profile got me shortlisted faster and the process was smooth." },
  { initials: "SA", name: "Sneha A.", city: "Hyderabad", role: "UI / UX", company: "Google", score: 87, quote: "The insights were spot on. It changed my career direction." },
  { initials: "RS", name: "Rahul S.", city: "Delhi", role: "Data Science", company: "Microsoft", score: 92, quote: "Got matched with roles that actually fit my skills — not just keywords." },
  { initials: "AM", name: "Ananya M.", city: "Bengaluru", role: "Frontend Dev", company: "Amazon", score: 89, quote: "Cleared three rounds in a week. Talento's verified badge made the difference." },
  { initials: "AV", name: "Arjun V.", city: "Pune", role: "Cloud / DevOps", company: "Infosys", score: 90, quote: "Recruiters reached out to me first. I never had to chase a single application." },
  { initials: "MJ", name: "Meera J.", city: "Kolkata", role: "Marketing", company: "Zomato", score: 88, quote: "Detailed report showed me exactly where to focus and improve." },
  { initials: "KD", name: "Karan D.", city: "Ahmedabad", role: "DevOps", company: "Atlassian", score: 92, quote: "Cleared interviews faster — the prep roadmap was a game changer." },
  { initials: "RT", name: "Riya T.", city: "Gurgaon", role: "Frontend / React", company: "Adobe", score: 95, quote: "Talento turned my skills into a story recruiters actually noticed." },
  // Page 2
  { initials: "VP", name: "Vikram P.", city: "Noida", role: "Cloud / AWS", company: "Infosys", score: 90, quote: "The structured feedback helped me close every skill gap I had." },
  { initials: "IB", name: "Ishita B.", city: "Jaipur", role: "Content Strategy", company: "HubSpot", score: 86, quote: "My portfolio finally reflects what I can actually do at work." },
  { initials: "AN", name: "Aditya N.", city: "Indore", role: "Android Dev", company: "Paytm", score: 92, quote: "Got 3 offers in a month after sharing my verified score." },
  { initials: "TG", name: "Tanvi G.", city: "Surat", role: "Business Analyst", company: "Deloitte", score: 88, quote: "The clarity I got from the report was honestly priceless." },
  { initials: "RM", name: "Rohan M.", city: "Chandigarh", role: "QA Automation", company: "Wipro", score: 89, quote: "Recruiters trusted my profile because the score was independent." },
  { initials: "PK", name: "Pooja K.", city: "Lucknow", role: "HR Analytics", company: "Accenture", score: 87, quote: "Made my career pivot smooth and credible — highly recommend." },
  { initials: "SF", name: "Sahil F.", city: "Bhopal", role: "iOS Dev", company: "Swiggy", score: 93, quote: "Landed my first remote role thanks to the verified badge." },
  { initials: "NL", name: "Neha L.", city: "Coimbatore", role: "Product Design", company: "Razorpay", score: 91, quote: "The assessment is the most honest mirror of your skills." },
  { initials: "DC", name: "Devansh C.", city: "Nagpur", role: "Full Stack", company: "Zoho", score: 94, quote: "Loved how the report mapped directly to actual job roles." },
  // Page 3
  { initials: "SR", name: "Sanya R.", city: "Mumbai", role: "Growth Marketing", company: "CRED", score: 92, quote: "My verified score opened doors I didn't even know existed." },
  { initials: "HV", name: "Harsh V.", city: "Bengaluru", role: "ML Engineer", company: "Meta", score: 96, quote: "The depth of the assessment pushed me to actually level up." },
  { initials: "DS", name: "Divya S.", city: "Chennai", role: "Data Analyst", company: "PhonePe", score: 89, quote: "Clear, fair, and actionable — exactly what I needed." },
  { initials: "MT", name: "Manish T.", city: "Hyderabad", role: "Backend / Go", company: "Uber", score: 91, quote: "Recruiters stopped asking for proof — the badge spoke for itself." },
  { initials: "KI", name: "Kavya I.", city: "Pune", role: "UX Research", company: "Atlassian", score: 90, quote: "Felt seen for my real skills, not just my resume." },
  { initials: "YO", name: "Yash O.", city: "Delhi", role: "Cybersecurity", company: "PwC", score: 93, quote: "Made the switch into security thanks to the role mapping." },
  { initials: "TN", name: "Tara N.", city: "Kochi", role: "Mobile Dev", company: "Razorpay", score: 88, quote: "Quick, rigorous, and genuinely helpful for my growth." },
  { initials: "AB", name: "Aman B.", city: "Patna", role: "SDET", company: "Microsoft", score: 92, quote: "The benchmark report gave me real confidence in interviews." },
  { initials: "LP", name: "Lavanya P.", city: "Mysore", role: "Product Ops", company: "Freshworks", score: 89, quote: "The career roadmap was the best part — totally personal." },
];

const PAGE_SIZE = 9;

const JobsSuccessStoriesSection = () => {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(stories.length / PAGE_SIZE);
  const visible = stories.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const go = (dir: 1 | -1) => setPage((p) => (p + dir + totalPages) % totalPages);

  return (
    <section className="py-16 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <SectionBadge label="Success Stories" icon={ShieldCheck} />
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3"
          >
            1000+ Success Stories<br />
            <span className="text-primary">and counting</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto"
          >
            Real people, real assessments, real offers —
            <br className="hidden md:block" />
            careers accelerated through verified skills.
          </motion.p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div
            key={page}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500"
          >
            {visible.map((s, i) => (
              <motion.article
                key={`${page}-${s.name}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="group p-6 rounded-2xl bg-card border border-border/60 hover:border-primary/40 hover:shadow-lg transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-sm font-bold font-display text-foreground/70 shrink-0">
                    {s.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold font-display text-foreground">{s.name}</p>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <BadgeCheck className="h-3 w-3" /> Hired
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.city}</p>
                  </div>
                </div>

                {/* Role row */}
                <div className="flex items-end justify-between gap-4 pb-4 border-b border-dashed border-border">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Role</p>
                    <p className="text-sm font-semibold text-foreground">{s.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{s.company}</p>
                    <p className="text-sm font-semibold">
                      <span className="text-primary">{s.score}</span>
                      <span className="text-muted-foreground">/100</span>
                    </p>
                  </div>
                </div>

                {/* Quote */}
                <div className="pt-4 flex gap-3">
                  <Quote className="h-4 w-4 text-primary/40 shrink-0 mt-0.5" />
                  <p className="text-sm italic text-muted-foreground leading-relaxed">
                    {s.quote}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Arrows + pagination */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <Button
              variant="outline"
              size="icon"
              onClick={() => go(-1)}
              className="h-11 w-11 rounded-full"
              aria-label="Previous stories"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  aria-label={`Go to page ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === page ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => go(1)}
              className="h-11 w-11 rounded-full"
              aria-label="Next stories"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobsSuccessStoriesSection;
