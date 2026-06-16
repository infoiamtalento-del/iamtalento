import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sparkles, Linkedin } from "lucide-react";

type Expert = {
  name: string;
  title: string;
  company: string;
  initials: string;
};

type Track = {
  id: string;
  label: string;
  experts: Expert[];
};

const make = (rows: [string, string, string][]): Expert[] =>
  rows.map(([name, title, company]) => ({
    name,
    title,
    company,
    initials: name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join(""),
  }));

const tracks: Track[] = [
  {
    id: "digital-marketing",
    label: "Digital Marketing",
    experts: make([
      ["Aarav Mehta", "Head of Growth", "Swiggy"],
      ["Neha Kapoor", "Performance Lead", "Nykaa"],
      ["Rohit Sen", "SEO Director", "HubSpot"],
      ["Priya Iyer", "Brand Strategist", "Cred"],
      ["Karan Shah", "Paid Media Lead", "Meta"],
      ["Tanya Roy", "Lifecycle Mgr", "Zomato"],
      ["Vikas Jain", "CRM Director", "Tata 1mg"],
      ["Sneha Rao", "Content Marketing", "Razorpay"],
      ["Ishaan Bose", "Analytics Head", "Flipkart"],
      ["Meera Joshi", "Influencer Lead", "Sugar"],
      ["Aditya Verma", "VP Marketing", "Groww"],
      ["Riya Nair", "Brand Manager", "Mamaearth"],
    ]),
  },
  {
    id: "content-writing",
    label: "Content Writing",
    experts: make([
      ["Ananya Das", "Editor-in-Chief", "Inc42"],
      ["Vikram Pillai", "Senior Writer", "The Ken"],
      ["Shreya Bhatt", "Content Lead", "Notion"],
      ["Arjun Mishra", "UX Writer", "Razorpay"],
      ["Pooja Gupta", "Brand Storyteller", "Zerodha"],
      ["Rahul Sinha", "Copy Director", "Ogilvy"],
      ["Divya Menon", "Tech Writer", "Atlassian"],
      ["Manish Kapoor", "Editorial Head", "YourStory"],
      ["Kavya Reddy", "Content Strategist", "Freshworks"],
      ["Saurabh Jain", "Long-form Writer", "Forbes India"],
      ["Tara Singh", "Newsletter Editor", "Substack"],
      ["Nikhil Roy", "Creative Director", "Dentsu"],
    ]),
  },
  {
    id: "data-science",
    label: "Data Science",
    experts: make([
      ["Dr. Rakesh Iyer", "Principal Scientist", "Amazon"],
      ["Anjali Sharma", "Lead Data Scientist", "Flipkart"],
      ["Harish Nair", "ML Researcher", "Google"],
      ["Sneha Patel", "Analytics Director", "Uber"],
      ["Aman Khan", "Data Science Lead", "Swiggy"],
      ["Ritu Agarwal", "Senior DS", "Microsoft"],
      ["Karthik Rao", "Applied Scientist", "Walmart"],
      ["Pallavi Joshi", "DS Manager", "PhonePe"],
      ["Yash Mehta", "ML Engineer", "Meta"],
      ["Ira Bhatia", "Quant Researcher", "Goldman Sachs"],
      ["Deepak Verma", "Head of AI", "Razorpay"],
      ["Smita Kulkarni", "Data Architect", "TCS"],
    ]),
  },
  {
    id: "banking-finance",
    label: "Banking & Finance",
    experts: make([
      ["Suresh Pillai", "VP Investment Bk.", "JPMorgan"],
      ["Ritika Doshi", "Risk Director", "HDFC Bank"],
      ["Amitabh Saxena", "CFO", "Lendingkart"],
      ["Naina Kapoor", "Equity Research", "Morgan Stanley"],
      ["Vivek Anand", "Treasury Head", "ICICI"],
      ["Mohini Rao", "Compliance Lead", "Axis Bank"],
      ["Rajat Mehra", "FP&A Director", "Razorpay"],
      ["Sunita Gokhale", "Credit Risk Lead", "Bajaj Finserv"],
      ["Aalok Bansal", "Investment Mgr", "Sequoia"],
      ["Tanvi Shah", "Audit Partner", "Deloitte"],
      ["Pranav Kohli", "Wealth Advisor", "Kotak"],
      ["Rachna Iyer", "Fintech Strategy", "Stripe"],
    ]),
  },
  {
    id: "software-development",
    label: "Software Development",
    experts: make([
      ["Arvind Subramanian", "Staff Engineer", "Google"],
      ["Pooja Bhattacharya", "Principal Eng", "Microsoft"],
      ["Rohan Desai", "Tech Lead", "Stripe"],
      ["Megha Wadhwa", "Engineering Mgr", "Atlassian"],
      ["Siddharth Bose", "Senior SDE", "Amazon"],
      ["Aisha Khan", "Frontend Lead", "Vercel"],
      ["Tejas Kulkarni", "Backend Architect", "Uber"],
      ["Niharika Roy", "Mobile Lead", "Swiggy"],
      ["Varun Trivedi", "DevOps Director", "Cloudflare"],
      ["Lakshmi Pillai", "Platform Eng", "Shopify"],
      ["Aman Verma", "Distributed Sys.", "Netflix"],
      ["Ishita Sen", "QA Director", "Adobe"],
    ]),
  },
  {
    id: "ai-engineering",
    label: "AI Engineering",
    experts: make([
      ["Dr. Karan Malhotra", "AI Research Lead", "OpenAI"],
      ["Shruti Kapadia", "LLM Engineer", "Anthropic"],
      ["Vivaan Shah", "MLOps Director", "Google DeepMind"],
      ["Maya Iyer", "Applied AI Lead", "Meta"],
      ["Rajeev Krishnan", "Sr. Research Sci.", "Microsoft Research"],
      ["Anika Bhardwaj", "Computer Vision", "Tesla"],
      ["Hemant Joshi", "NLP Engineer", "Hugging Face"],
      ["Priya Saxena", "AI Product Lead", "Cohere"],
      ["Aditya Rao", "Generative AI Eng.", "Stability AI"],
      ["Tanmay Ghosh", "RL Researcher", "Nvidia"],
      ["Sara D'Souza", "AI Safety Lead", "Scale AI"],
      ["Nakul Bansal", "Foundation Models", "Mistral"],
    ]),
  },
];

const AssessmentExpertsSection = () => {
  const [active, setActive] = useState(tracks[0].id);
  const current = tracks.find((t) => t.id === active)!;

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
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
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
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
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 max-w-6xl mx-auto animate-in fade-in duration-500"
        >
          {current.experts.map((e) => (
            <div
              key={e.name}
              className="group rounded-2xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 mb-4 ring-2 ring-primary/10 group-hover:ring-primary/30 transition">
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-semibold text-lg">
                    {e.initials}
                  </AvatarFallback>
                </Avatar>
                <p className="font-semibold text-sm truncate w-full">{e.name}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{e.title}</p>
                <p className="text-xs text-primary mt-1 font-medium">{e.company}</p>
                <Linkedin className="w-3.5 h-3.5 text-muted-foreground/50 mt-3 group-hover:text-primary transition" />
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
