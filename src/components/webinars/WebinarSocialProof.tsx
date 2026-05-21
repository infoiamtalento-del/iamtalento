import { motion } from "framer-motion";
import { Briefcase, TrendingUp, Award, Users } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

const attendees = [
  { name: "Sneha Kulkarni", role: "Data Analyst → Lead Analyst", company: "Deloitte", avatar: "https://randomuser.me/api/portraits/women/44.jpg", outcome: "Promoted", companyLogo: "https://www.google.com/s2/favicons?domain=deloitte.com&sz=64" },
  { name: "Aman Gupta", role: "Fresher → SDE-1", company: "Flipkart", avatar: "https://randomuser.me/api/portraits/men/32.jpg", outcome: "Hired", companyLogo: "https://www.google.com/s2/favicons?domain=flipkart.com&sz=64" },
  { name: "Riya Patel", role: "Marketing Exec → Manager", company: "Swiggy", avatar: "https://randomuser.me/api/portraits/women/65.jpg", outcome: "Promoted", companyLogo: "https://www.google.com/s2/favicons?domain=swiggy.com&sz=64" },
  { name: "Karthik Reddy", role: "Support → Product Analyst", company: "Razorpay", avatar: "https://randomuser.me/api/portraits/men/45.jpg", outcome: "Career Switch", companyLogo: "https://www.google.com/s2/favicons?domain=razorpay.com&sz=64" },
  { name: "Pooja Sharma", role: "QA → Full Stack Dev", company: "Infosys", avatar: "https://randomuser.me/api/portraits/women/28.jpg", outcome: "Career Switch", companyLogo: "https://www.google.com/s2/favicons?domain=infosys.com&sz=64" },
  { name: "Rahul Jain", role: "Intern → SDE-2", company: "Google", avatar: "https://randomuser.me/api/portraits/men/22.jpg", outcome: "Hired", companyLogo: "https://www.google.com/s2/favicons?domain=google.com&sz=64" },
  { name: "Anita Das", role: "Student → Business Analyst", company: "TCS", avatar: "https://randomuser.me/api/portraits/women/50.jpg", outcome: "Hired", companyLogo: "https://www.google.com/s2/favicons?domain=tcs.com&sz=64" },
  { name: "Vikram Sinha", role: "Junior Dev → Tech Lead", company: "Walmart", avatar: "https://randomuser.me/api/portraits/men/55.jpg", outcome: "Promoted", companyLogo: "https://www.google.com/s2/favicons?domain=walmart.com&sz=64" },
  { name: "Meghna Roy", role: "Freelancer → PM", company: "Amazon", avatar: "https://randomuser.me/api/portraits/women/72.jpg", outcome: "Hired", companyLogo: "https://www.google.com/s2/favicons?domain=amazon.com&sz=64" },
  { name: "Deepak Verma", role: "Associate → Sr. Consultant", company: "Accenture", avatar: "https://randomuser.me/api/portraits/men/60.jpg", outcome: "Promoted", companyLogo: "https://www.google.com/s2/favicons?domain=accenture.com&sz=64" },
  { name: "Priya Menon", role: "Content Writer → SEO Lead", company: "Zomato", avatar: "https://randomuser.me/api/portraits/women/33.jpg", outcome: "Career Switch", companyLogo: "https://www.google.com/s2/favicons?domain=zomato.com&sz=64" },
  { name: "Arjun Nair", role: "Trainee → Cloud Engineer", company: "Microsoft", avatar: "https://randomuser.me/api/portraits/men/36.jpg", outcome: "Hired", companyLogo: "https://www.google.com/s2/favicons?domain=microsoft.com&sz=64" },
];

const row1 = attendees.slice(0, 6);
const row2 = attendees.slice(6, 12);
const doubled1 = [...row1, ...row1];
const doubled2 = [...row2, ...row2];

const outcomeColor: Record<string, string> = {
  Hired: "text-primary",
  Promoted: "text-[hsl(33,100%,50%)]",
  "Career Switch": "text-[hsl(160,60%,40%)]",
};

const AttendeeCard = ({ d }: { d: (typeof attendees)[0] }) => (
  <div className="flex items-center gap-4 whitespace-nowrap rounded-2xl border border-border bg-card px-5 py-6 shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:border-primary/20 transition-all duration-200 shrink-0">
    <img src={d.avatar} alt={d.name} className="h-14 w-14 rounded-full object-cover shrink-0" loading="lazy" />
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <p className="text-sm font-bold text-foreground truncate">{d.name}</p>
        <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-card border border-border shrink-0 ${outcomeColor[d.outcome] || "text-primary"}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {d.outcome}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mt-0.5">{d.role}</p>
      <div className="flex items-center gap-1.5 mt-1">
        <img src={d.companyLogo} alt={d.company} className="h-4 w-4 object-contain" loading="lazy" />
        <span className="text-[11px] font-medium text-muted-foreground">{d.company}</span>
      </div>
    </div>
  </div>
);

const stats = [
  { icon: Briefcase, value: "8,500+", label: "Career Outcomes", bg: "bg-primary" },
  { icon: TrendingUp, value: "73%", label: "Got Promoted/Hired", bg: "bg-[hsl(33,100%,50%)]" },
  { icon: Award, value: "45,000+", label: "Certificates Issued", bg: "bg-primary" },
  { icon: Users, value: "120+", label: "Sessions Completed", bg: "bg-[hsl(33,100%,50%)]" },
];

const WebinarSocialProof = () => (
  <section className="py-14 md:py-20 overflow-hidden border-b border-border/50">
    <div className="container px-4 md:px-6 mb-10">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <SectionBadge label="Real Outcomes" icon={TrendingUp} />
        <h2 className="text-3xl md:text-4xl font-bold font-display mb-3">
          They Attended. <span className="text-primary">They Grew.</span>
        </h2>
        <p className="text-muted-foreground max-w-lg text-sm md:text-base">
          Thousands of professionals have transformed their careers after attending our expert-led webinars.
        </p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            className={`rounded-xl p-5 ${s.bg} text-primary-foreground`}>
            <s.icon className="h-5 w-5 mb-2 opacity-80" />
            <p className="text-2xl font-bold font-display">{s.value}</p>
            <p className="text-xs opacity-80">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>

    {/* Marquee Row 1 → */}
    <div className="relative py-2">
      <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-background to-transparent z-10" />
      <div className="overflow-hidden">
        <motion.div className="flex w-max gap-4 px-4" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 55, repeat: Infinity, ease: "linear" }}>
          {doubled1.map((d, i) => <AttendeeCard key={`r1-${i}`} d={d} />)}
        </motion.div>
      </div>
    </div>

    {/* Marquee Row 2 ← */}
    <div className="relative py-2 mt-3">
      <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-background to-transparent z-10" />
      <div className="overflow-hidden">
        <motion.div className="flex w-max gap-4 px-4" animate={{ x: ["-50%", "0%"] }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }}>
          {doubled2.map((d, i) => <AttendeeCard key={`r2-${i}`} d={d} />)}
        </motion.div>
      </div>
    </div>
  </section>
);

export default WebinarSocialProof;
