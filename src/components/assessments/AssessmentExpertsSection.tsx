import { useState } from "react";
import { Sparkles, Linkedin, Briefcase, Building2 } from "lucide-react";

type Expert = {
  name: string;
  title: string;
  company: string;
  initials: string;
  photo: string;
  years: number;
  prevCompanies: string[];
};

type Track = {
  id: string;
  label: string;
  experts: Omit<Expert, "initials" | "photo">[];
};

const hashToId = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return (h % 70) + 1;
};

const E = (
  name: string,
  title: string,
  company: string,
  years: number,
  prevCompanies: string[],
) => ({ name, title, company, years, prevCompanies });

const tracks: Track[] = [
  {
    id: "digital-marketing",
    label: "Digital Marketing",
    experts: [
      E("Aarav Mehta", "Head of Growth", "Swiggy", 12, ["Uber", "Ola"]),
      E("Neha Kapoor", "Performance Lead", "Nykaa", 10, ["Myntra", "Tata CLiQ"]),
      E("Rohit Sen", "SEO Director", "HubSpot", 14, ["Zomato", "MakeMyTrip"]),
      E("Priya Iyer", "Brand Strategist", "Cred", 9, ["Paytm", "Razorpay"]),
      E("Karan Shah", "Paid Media Lead", "Meta", 11, ["Google", "Dentsu"]),
      E("Tanya Roy", "Lifecycle Mgr", "Zomato", 8, ["Swiggy", "Dunzo"]),
      E("Vikas Jain", "CRM Director", "Tata 1mg", 13, ["Pharmeasy", "Netmeds"]),
      E("Sneha Rao", "Content Marketing", "Razorpay", 9, ["Cred", "Zerodha"]),
      E("Ishaan Bose", "Analytics Head", "Flipkart", 12, ["Amazon", "Walmart"]),
      E("Meera Joshi", "Influencer Lead", "Sugar", 7, ["Mamaearth", "Plum"]),
      E("Aditya Verma", "VP Marketing", "Groww", 15, ["Upstox", "Zerodha"]),
      E("Riya Nair", "Brand Manager", "Mamaearth", 8, ["The Moms Co.", "Nykaa"]),
    ],
  },
  {
    id: "content-writing",
    label: "Content Writing",
    experts: [
      E("Ananya Das", "Editor-in-Chief", "Inc42", 14, ["YourStory", "ET Prime"]),
      E("Vikram Pillai", "Senior Writer", "The Ken", 11, ["Mint", "Quartz"]),
      E("Shreya Bhatt", "Content Lead", "Notion", 9, ["Asana", "Figma"]),
      E("Arjun Mishra", "UX Writer", "Razorpay", 8, ["Stripe", "Cred"]),
      E("Pooja Gupta", "Brand Storyteller", "Zerodha", 10, ["Groww", "Upstox"]),
      E("Rahul Sinha", "Copy Director", "Ogilvy", 16, ["DDB", "Leo Burnett"]),
      E("Divya Menon", "Tech Writer", "Atlassian", 12, ["GitLab", "GitHub"]),
      E("Manish Kapoor", "Editorial Head", "YourStory", 13, ["TechCrunch", "Forbes"]),
      E("Kavya Reddy", "Content Strategist", "Freshworks", 10, ["Zoho", "Salesforce"]),
      E("Saurabh Jain", "Long-form Writer", "Forbes India", 15, ["Mint", "BS"]),
      E("Tara Singh", "Newsletter Editor", "Substack", 9, ["Medium", "Ghost"]),
      E("Nikhil Roy", "Creative Director", "Dentsu", 14, ["Wieden+Kennedy", "BBDO"]),
    ],
  },
  {
    id: "data-science",
    label: "Data Science",
    experts: [
      E("Dr. Rakesh Iyer", "Principal Scientist", "Amazon", 18, ["IBM Research", "Yahoo"]),
      E("Anjali Sharma", "Lead Data Scientist", "Flipkart", 12, ["Walmart Labs", "Myntra"]),
      E("Harish Nair", "ML Researcher", "Google", 14, ["DeepMind", "Microsoft"]),
      E("Sneha Patel", "Analytics Director", "Uber", 13, ["Lyft", "Airbnb"]),
      E("Aman Khan", "Data Science Lead", "Swiggy", 10, ["Zomato", "Ola"]),
      E("Ritu Agarwal", "Senior DS", "Microsoft", 11, ["LinkedIn", "Adobe"]),
      E("Karthik Rao", "Applied Scientist", "Walmart", 12, ["Target", "eBay"]),
      E("Pallavi Joshi", "DS Manager", "PhonePe", 9, ["Paytm", "Razorpay"]),
      E("Yash Mehta", "ML Engineer", "Meta", 10, ["Twitter", "Snap"]),
      E("Ira Bhatia", "Quant Researcher", "Goldman Sachs", 11, ["Morgan Stanley", "JPM"]),
      E("Deepak Verma", "Head of AI", "Razorpay", 13, ["Cred", "Flipkart"]),
      E("Smita Kulkarni", "Data Architect", "TCS", 16, ["Infosys", "Wipro"]),
    ],
  },
  {
    id: "banking-finance",
    label: "Banking & Finance",
    experts: [
      E("Suresh Pillai", "VP Investment Bk.", "JPMorgan", 17, ["Citi", "BofA"]),
      E("Ritika Doshi", "Risk Director", "HDFC Bank", 14, ["ICICI", "Axis"]),
      E("Amitabh Saxena", "CFO", "Lendingkart", 19, ["Capital Float", "PwC"]),
      E("Naina Kapoor", "Equity Research", "Morgan Stanley", 12, ["Credit Suisse", "UBS"]),
      E("Vivek Anand", "Treasury Head", "ICICI", 15, ["SBI", "HDFC"]),
      E("Mohini Rao", "Compliance Lead", "Axis Bank", 13, ["Kotak", "Yes Bank"]),
      E("Rajat Mehra", "FP&A Director", "Razorpay", 11, ["Flipkart", "Amazon"]),
      E("Sunita Gokhale", "Credit Risk Lead", "Bajaj Finserv", 14, ["HDFC", "Tata Capital"]),
      E("Aalok Bansal", "Investment Mgr", "Sequoia", 12, ["Accel", "Lightspeed"]),
      E("Tanvi Shah", "Audit Partner", "Deloitte", 16, ["EY", "KPMG"]),
      E("Pranav Kohli", "Wealth Advisor", "Kotak", 13, ["IIFL", "Edelweiss"]),
      E("Rachna Iyer", "Fintech Strategy", "Stripe", 10, ["PayPal", "Square"]),
    ],
  },
  {
    id: "software-development",
    label: "Software Development",
    experts: [
      E("Arvind Subramanian", "Staff Engineer", "Google", 16, ["Meta", "Twitter"]),
      E("Pooja Bhattacharya", "Principal Eng", "Microsoft", 15, ["Amazon", "Oracle"]),
      E("Rohan Desai", "Tech Lead", "Stripe", 12, ["Square", "Plaid"]),
      E("Megha Wadhwa", "Engineering Mgr", "Atlassian", 13, ["GitHub", "GitLab"]),
      E("Siddharth Bose", "Senior SDE", "Amazon", 11, ["Flipkart", "Myntra"]),
      E("Aisha Khan", "Frontend Lead", "Vercel", 9, ["Netlify", "Cloudflare"]),
      E("Tejas Kulkarni", "Backend Architect", "Uber", 14, ["Lyft", "DoorDash"]),
      E("Niharika Roy", "Mobile Lead", "Swiggy", 10, ["Zomato", "Dunzo"]),
      E("Varun Trivedi", "DevOps Director", "Cloudflare", 13, ["AWS", "Fastly"]),
      E("Lakshmi Pillai", "Platform Eng", "Shopify", 11, ["Stripe", "Square"]),
      E("Aman Verma", "Distributed Sys.", "Netflix", 14, ["Spotify", "Hulu"]),
      E("Ishita Sen", "QA Director", "Adobe", 15, ["Autodesk", "Salesforce"]),
    ],
  },
  {
    id: "ai-engineering",
    label: "AI Engineering",
    experts: [
      E("Dr. Karan Malhotra", "AI Research Lead", "OpenAI", 14, ["DeepMind", "FAIR"]),
      E("Shruti Kapadia", "LLM Engineer", "Anthropic", 9, ["OpenAI", "Google Brain"]),
      E("Vivaan Shah", "MLOps Director", "Google DeepMind", 12, ["Meta AI", "MSR"]),
      E("Maya Iyer", "Applied AI Lead", "Meta", 11, ["Apple", "Amazon"]),
      E("Rajeev Krishnan", "Sr. Research Sci.", "Microsoft Research", 16, ["IBM", "Adobe"]),
      E("Anika Bhardwaj", "Computer Vision", "Tesla", 10, ["Waymo", "Cruise"]),
      E("Hemant Joshi", "NLP Engineer", "Hugging Face", 8, ["Cohere", "Mistral"]),
      E("Priya Saxena", "AI Product Lead", "Cohere", 11, ["OpenAI", "Stripe"]),
      E("Aditya Rao", "Generative AI Eng.", "Stability AI", 9, ["Runway", "Midjourney"]),
      E("Tanmay Ghosh", "RL Researcher", "Nvidia", 13, ["DeepMind", "OpenAI"]),
      E("Sara D'Souza", "AI Safety Lead", "Scale AI", 10, ["Anthropic", "Meta"]),
      E("Nakul Bansal", "Foundation Models", "Mistral", 9, ["Hugging Face", "Google"]),
    ],
  },
];

const enrich = (e: Omit<Expert, "initials" | "photo">): Expert => ({
  ...e,
  initials: e.name.split(" ").map((n) => n[0]).slice(0, 2).join(""),
  photo: `https://i.pravatar.cc/360?img=${hashToId(e.name + e.company)}`,
});

const AssessmentExpertsSection = () => {
  const [active, setActive] = useState(tracks[0].id);
  const current = tracks.find((t) => t.id === active)!;
  const experts = current.experts.map(enrich);

  return (
    <section className="py-24 bg-gradient-to-b from-background via-primary/[0.02] to-background relative overflow-hidden">
      {/* decorative blobs */}
      <div className="absolute top-20 -left-32 w-72 h-72 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 -right-32 w-72 h-72 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5">
            <Sparkles className="w-4 h-4" />
            AI Assessments
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            AI Assessments <span className="text-primary">Prepared By</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Co-authored with industry leaders and senior practitioners — so every question maps to what really matters on the job.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-5xl mx-auto">
          {tracks.map((t) => {
            const isActive = t.id === active;
            return (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                    : "bg-card text-foreground border-border hover:border-primary/50 hover:text-primary"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div
          key={active}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto animate-in fade-in duration-500"
        >
          {experts.map((e) => (
            <div
              key={e.name}
              className="group relative rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Square image */}
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                  src={e.photo}
                  alt={e.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(ev) => {
                    (ev.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent" />
                {/* Years badge */}
                <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-background/95 backdrop-blur text-[11px] font-semibold text-primary shadow-sm">
                  <Briefcase className="w-3 h-3" />
                  {e.years}+ yrs
                </div>
                {/* Name + role overlaid */}
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <p className="font-semibold text-base leading-tight drop-shadow">{e.name}</p>
                  <p className="text-xs text-white/85 mt-0.5 line-clamp-1">{e.title}</p>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Currently</span>
                  <Linkedin className="w-3.5 h-3.5 text-muted-foreground/60 group-hover:text-primary transition" />
                </div>
                <p className="text-sm font-semibold text-primary -mt-2">{e.company}</p>

                <div className="pt-3 border-t border-border">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Building2 className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                      Previously
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {e.prevCompanies.map((c) => (
                      <span
                        key={c}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-foreground/80 font-medium"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-12">
          And <span className="text-primary font-semibold">300+ more experts</span> across every track on Talento.
        </p>
      </div>
    </section>
  );
};

export default AssessmentExpertsSection;
