import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Quote, ArrowLeft, ArrowRight } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

import learnerPriya from "@/assets/learner-priya.jpg";
import learnerRahul from "@/assets/learner-rahul.jpg";
import learnerAnanya from "@/assets/learner-ananya.jpg";
import learnerVikram from "@/assets/learner-vikram.jpg";
import participantPriya from "@/assets/networking-participant-priya.jpg";
import participantArjun from "@/assets/networking-participant-arjun.jpg";
import participantSneha from "@/assets/networking-participant-sneha.jpg";
import participantRohan from "@/assets/networking-participant-rohan.jpg";
import speakerKavya from "@/assets/speaker-kavya.jpg";
import speakerMeera from "@/assets/speaker-meera.jpg";
import speakerArjun from "@/assets/speaker-arjun.jpg";
import speakerRohan from "@/assets/speaker-rohan.jpg";
import female1 from "@/assets/experts/female-1.jpg";
import female2 from "@/assets/experts/female-2.jpg";
import female3 from "@/assets/experts/female-3.jpg";
import female4 from "@/assets/experts/female-4.jpg";
import female5 from "@/assets/experts/female-5.jpg";
import female6 from "@/assets/experts/female-6.jpg";
import male1 from "@/assets/experts/male-1.jpg";
import male2 from "@/assets/experts/male-2.jpg";
import male3 from "@/assets/experts/male-3.jpg";
import male4 from "@/assets/experts/male-4.jpg";
import male5 from "@/assets/experts/male-5.jpg";
import male6 from "@/assets/experts/male-6.jpg";

type Story = {
  name: string;
  city: string;
  role: string;
  company: string;
  score: number;
  quote: string;
  initials: string;
  avatar: string;
};

const stories: Story[] = [
  // Page 1
  { name: "Priya R.", city: "Mumbai", role: "Product Mgmt", company: "Swiggy", score: 91, quote: "The assessment helped me discover my strengths and land my dream role.", initials: "PR", avatar: learnerPriya },
  { name: "Nikhil K.", city: "Chennai", role: "Python / ML", company: "Flipkart", score: 94, quote: "Verified profile got me shortlisted faster and the process was smooth.", initials: "NK", avatar: male1 },
  { name: "Sneha A.", city: "Hyderabad", role: "UI / UX", company: "Google", score: 87, quote: "The insights were spot on. It changed my career direction.", initials: "SA", avatar: participantSneha },
  { name: "Rahul S.", city: "Delhi", role: "Vue.js", company: "Microsoft", score: 90, quote: "From confused to confident, Talento made it possible!", initials: "RS", avatar: learnerRahul },
  { name: "Ananya M.", city: "Bengaluru", role: "Data Science", company: "Amazon", score: 93, quote: "Recruiters reached out within a week of completing my assessment.", initials: "AM", avatar: learnerAnanya },
  { name: "Arjun V.", city: "Pune", role: "Backend / Node", company: "Razorpay", score: 89, quote: "The verified badge added instant credibility to my profile.", initials: "AV", avatar: speakerArjun },
  { name: "Meera J.", city: "Kolkata", role: "Marketing", company: "Zomato", score: 88, quote: "Detailed report showed me exactly where to focus and improve.", initials: "MJ", avatar: speakerMeera },
  { name: "Karan D.", city: "Ahmedabad", role: "DevOps", company: "Atlassian", score: 92, quote: "Cleared interviews faster, the prep roadmap was a game changer.", initials: "KD", avatar: male2 },
  { name: "Riya T.", city: "Gurgaon", role: "Frontend / React", company: "Adobe", score: 95, quote: "Talento turned my skills into a story recruiters actually noticed.", initials: "RT", avatar: female1 },
  // Page 2
  { name: "Vikram P.", city: "Noida", role: "Cloud / AWS", company: "Infosys", score: 90, quote: "The structured feedback helped me close every skill gap I had.", initials: "VP", avatar: learnerVikram },
  { name: "Ishita B.", city: "Jaipur", role: "Content Strategy", company: "HubSpot", score: 86, quote: "My portfolio finally reflects what I can actually do at work.", initials: "IB", avatar: female2 },
  { name: "Aditya N.", city: "Indore", role: "Android Dev", company: "Paytm", score: 92, quote: "Got 3 offers in a month after sharing my verified score.", initials: "AN", avatar: male3 },
  { name: "Tanvi G.", city: "Surat", role: "Business Analyst", company: "Deloitte", score: 88, quote: "The clarity I got from the report was honestly priceless.", initials: "TG", avatar: female3 },
  { name: "Rohan M.", city: "Chandigarh", role: "QA Automation", company: "Wipro", score: 89, quote: "Recruiters trusted my profile because the score was independent.", initials: "RM", avatar: speakerRohan },
  { name: "Pooja K.", city: "Lucknow", role: "HR Analytics", company: "Accenture", score: 87, quote: "Made my career pivot smooth and credible, highly recommend.", initials: "PK", avatar: female4 },
  { name: "Sahil F.", city: "Bhopal", role: "iOS Dev", company: "Swiggy", score: 93, quote: "Landed my first remote role thanks to the verified badge.", initials: "SF", avatar: male4 },
  { name: "Neha L.", city: "Coimbatore", role: "Product Design", company: "Razorpay", score: 91, quote: "The assessment is the most honest mirror of your skills.", initials: "NL", avatar: female5 },
  { name: "Devansh C.", city: "Nagpur", role: "Full Stack", company: "Zoho", score: 94, quote: "Loved how the report mapped directly to actual job roles.", initials: "DC", avatar: male5 },
  // Page 3
  { name: "Sanya R.", city: "Mumbai", role: "Growth Marketing", company: "CRED", score: 92, quote: "My verified score opened doors I didn't even know existed.", initials: "SR", avatar: female6 },
  { name: "Harsh V.", city: "Bengaluru", role: "ML Engineer", company: "Meta", score: 96, quote: "The depth of the assessment pushed me to actually level up.", initials: "HV", avatar: male6 },
  { name: "Divya S.", city: "Chennai", role: "Data Analyst", company: "PhonePe", score: 89, quote: "Clear, fair, and actionable, exactly what I needed.", initials: "DS", avatar: participantPriya },
  { name: "Manish T.", city: "Hyderabad", role: "Backend / Go", company: "Uber", score: 91, quote: "Recruiters stopped asking for proof, the badge spoke for itself.", initials: "MT", avatar: participantArjun },
  { name: "Kavya I.", city: "Pune", role: "UX Research", company: "Atlassian", score: 90, quote: "Felt seen for my real skills, not just my resume.", initials: "KI", avatar: speakerKavya },
  { name: "Yash O.", city: "Delhi", role: "Cybersecurity", company: "PwC", score: 93, quote: "Made the switch into security thanks to the role mapping.", initials: "YO", avatar: male1 },
  { name: "Tara N.", city: "Kochi", role: "Mobile Dev", company: "Razorpay", score: 88, quote: "Quick, rigorous, and genuinely helpful for my growth.", initials: "TN", avatar: female1 },
  { name: "Aman B.", city: "Patna", role: "SDET", company: "Microsoft", score: 92, quote: "The benchmark report gave me real confidence in interviews.", initials: "AB", avatar: male2 },
  { name: "Lavanya P.", city: "Mysore", role: "Product Ops", company: "Freshworks", score: 89, quote: "The career roadmap was the best part, totally personal.", initials: "LP", avatar: female2 },
  // Page 4
  { name: "Rajat H.", city: "Bhubaneswar", role: "Data Engineer", company: "Walmart", score: 94, quote: "Verified skills got me past resume screens almost instantly.", initials: "RH", avatar: male3 },
  { name: "Simran K.", city: "Amritsar", role: "Brand Design", company: "Nykaa", score: 87, quote: "It's the only score I've shared that recruiters trusted on sight.", initials: "SK", avatar: female3 },
  { name: "Varun E.", city: "Goa", role: "AI Research", company: "OpenAI", score: 97, quote: "The rigor matched the bar of top global teams. Loved it.", initials: "VE", avatar: male4 },
  { name: "Niharika S.", city: "Vizag", role: "Sales Ops", company: "Salesforce", score: 88, quote: "Switched domains confidently with the readiness report.", initials: "NS", avatar: female4 },
  { name: "Omkar W.", city: "Nashik", role: "Java / Spring", company: "TCS", score: 90, quote: "Was a non-CS grad, this proved my skills better than any degree.", initials: "OW", avatar: male5 },
  { name: "Aisha Z.", city: "Hyderabad", role: "Content Design", company: "Notion", score: 91, quote: "The assessment respected my time and gave real signals.", initials: "AZ", avatar: female5 },
  { name: "Pranav Q.", city: "Pune", role: "SRE", company: "Atlassian", score: 93, quote: "Cracked SRE interviews with the scenario practice it suggested.", initials: "PQ", avatar: male6 },
  { name: "Bhumi X.", city: "Ranchi", role: "Finance Analyst", company: "Goldman Sachs", score: 89, quote: "Standardized score made cross-city hiring actually fair for me.", initials: "BX", avatar: female6 },
  { name: "Naveen U.", city: "Trichy", role: "Embedded Systems", company: "Qualcomm", score: 92, quote: "Niche skills finally got the spotlight they deserved.", initials: "NU", avatar: participantRohan },
  // Page 5
  { name: "Ritika Y.", city: "Dehradun", role: "Frontend / Next.js", company: "Vercel", score: 95, quote: "Got referred internally after recruiters saw the verified score.", initials: "RY", avatar: female1 },
  { name: "Siddharth A.", city: "Vadodara", role: "Solutions Architect", company: "AWS", score: 94, quote: "The role-fit map nailed exactly where I should apply.", initials: "SA", avatar: male1 },
  { name: "Mehak J.", city: "Shimla", role: "Customer Success", company: "Zendesk", score: 88, quote: "Career switch from support to CS, made simple and credible.", initials: "MJ", avatar: female2 },
  { name: "Tushar G.", city: "Raipur", role: "Blockchain Dev", company: "Polygon", score: 91, quote: "Niche assessments here are seriously the best I've taken.", initials: "TG", avatar: male2 },
  { name: "Ira D.", city: "Madurai", role: "Product Manager", company: "Stripe", score: 96, quote: "From IC to PM, the gap analysis made the leap real.", initials: "ID", avatar: female3 },
  { name: "Aryan B.", city: "Jodhpur", role: "Game Dev", company: "Ubisoft", score: 90, quote: "Verified portfolio + score = my fastest interview cycle ever.", initials: "AB", avatar: male3 },
  { name: "Sneh F.", city: "Faridabad", role: "Marketing Ops", company: "HubSpot", score: 87, quote: "Honest, structured, and finally a credential that travels.", initials: "SF", avatar: female4 },
  { name: "Ojas R.", city: "Guwahati", role: "Platform Engineer", company: "Cloudflare", score: 93, quote: "Got real interview leads within days, not weeks.", initials: "OR", avatar: male4 },
  { name: "Pari M.", city: "Varanasi", role: "Data Science", company: "Spotify", score: 92, quote: "The proctoring made me trust my own score for the first time.", initials: "PM", avatar: female5 },
];

const PAGE_SIZE = 9;

const SuccessStoriesCarousel = () => {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(stories.length / PAGE_SIZE);
  const visible = stories.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const go = (dir: 1 | -1) => setPage((p) => (p + dir + totalPages) % totalPages);

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <SectionBadge label="Success Stories" icon={BadgeCheck} />
          <h2 className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-4">
            1000+ Success Stories<br />
            <span className="text-primary">and counting</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Real people, real assessments, real offers,
            <br className="hidden md:block" />
            careers accelerated by verified skills.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div
            key={page}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in duration-500"
          >
            {visible.map((s) => (
              <div
                key={s.name}
                className="h-full rounded-2xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-5">
                  <Avatar className="h-12 w-12 border border-border shadow-xs shrink-0">
                    <AvatarImage src={s.avatar} alt={s.name} className="object-cover object-top" />
                    <AvatarFallback className="bg-muted text-foreground font-semibold">{s.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold truncate">{s.name}</p>
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <BadgeCheck className="w-3 h-3" /> Hired
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{s.city}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-5 pb-5 border-b border-border">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-0.5">Role</p>
                    <p className="text-sm font-medium">{s.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-0.5">{s.company}</p>
                    <p className="text-sm font-semibold">
                      <span className="text-primary">{s.score}</span>
                      <span className="text-muted-foreground">/100</span>
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <Quote className="absolute -top-1 -left-1 w-4 h-4 text-primary/30" />
                  <p className="text-sm text-muted-foreground leading-relaxed pl-5 italic">{s.quote}</p>
                </div>
              </div>
            ))}
          </div>

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

export default SuccessStoriesCarousel;
