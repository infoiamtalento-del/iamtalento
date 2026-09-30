import { useState } from "react";
import { Sparkles, Linkedin, Briefcase, Building2 } from "lucide-react";

const COMPANY_DOMAINS: Record<string, string> = {
  Swiggy: "swiggy.com", Uber: "uber.com", Ola: "olacabs.com", Nykaa: "nykaa.com",
  Myntra: "myntra.com", "Tata CLiQ": "tatacliq.com", HubSpot: "hubspot.com",
  Zomato: "zomato.com", MakeMyTrip: "makemytrip.com", Cred: "cred.club",
  Paytm: "paytm.com", Razorpay: "razorpay.com", Meta: "meta.com", Google: "google.com",
  Dentsu: "dentsu.com", Dunzo: "dunzo.com", "Tata 1mg": "1mg.com",
  Pharmeasy: "pharmeasy.in", Netmeds: "netmeds.com", Zerodha: "zerodha.com",
  Flipkart: "flipkart.com", Amazon: "amazon.com", Walmart: "walmart.com",
  Sugar: "sugarcosmetics.com", Mamaearth: "mamaearth.in", Plum: "plumgoodness.com",
  Groww: "groww.in", Upstox: "upstox.com", "The Moms Co.": "themomsco.com",
  Inc42: "inc42.com", YourStory: "yourstory.com", "ET Prime": "economictimes.indiatimes.com",
  "The Ken": "the-ken.com", Mint: "livemint.com", Quartz: "qz.com",
  Notion: "notion.so", Asana: "asana.com", Figma: "figma.com", Stripe: "stripe.com",
  Ogilvy: "ogilvy.com", DDB: "ddb.com", "Leo Burnett": "leoburnett.com",
  Atlassian: "atlassian.com", GitLab: "gitlab.com", GitHub: "github.com",
  TechCrunch: "techcrunch.com", Forbes: "forbes.com", "Forbes India": "forbesindia.com",
  Freshworks: "freshworks.com", Zoho: "zoho.com", Salesforce: "salesforce.com",
  BS: "business-standard.com", Substack: "substack.com", Medium: "medium.com",
  Ghost: "ghost.org", "Wieden+Kennedy": "wk.com", BBDO: "bbdo.com",
  "IBM Research": "ibm.com", Yahoo: "yahoo.com", "Walmart Labs": "walmart.com",
  DeepMind: "deepmind.com", Microsoft: "microsoft.com", Lyft: "lyft.com",
  Airbnb: "airbnb.com", LinkedIn: "linkedin.com", Adobe: "adobe.com",
  Target: "target.com", eBay: "ebay.com", PhonePe: "phonepe.com",
  Twitter: "twitter.com", Snap: "snap.com", "Goldman Sachs": "goldmansachs.com",
  "Morgan Stanley": "morganstanley.com", JPM: "jpmorgan.com", TCS: "tcs.com",
  Infosys: "infosys.com", Wipro: "wipro.com", JPMorgan: "jpmorgan.com",
  Citi: "citi.com", BofA: "bankofamerica.com", "HDFC Bank": "hdfcbank.com",
  ICICI: "icicibank.com", Axis: "axisbank.com", "Axis Bank": "axisbank.com",
  Lendingkart: "lendingkart.com", "Capital Float": "capitalfloat.com", PwC: "pwc.com",
  "Credit Suisse": "credit-suisse.com", UBS: "ubs.com", SBI: "sbi.co.in",
  HDFC: "hdfcbank.com", Kotak: "kotak.com", "Yes Bank": "yesbank.in",
  "Bajaj Finserv": "bajajfinserv.in", "Tata Capital": "tatacapital.com",
  Sequoia: "sequoiacap.com", Accel: "accel.com", Lightspeed: "lsvp.com",
  Deloitte: "deloitte.com", EY: "ey.com", KPMG: "kpmg.com",
  IIFL: "iifl.com", Edelweiss: "edelweissfin.com", PayPal: "paypal.com",
  Square: "squareup.com", Oracle: "oracle.com", Plaid: "plaid.com",
  Vercel: "vercel.com", Netlify: "netlify.com", Cloudflare: "cloudflare.com",
  AWS: "aws.amazon.com", Fastly: "fastly.com", DoorDash: "doordash.com",
  Netflix: "netflix.com", Spotify: "spotify.com", Hulu: "hulu.com",
  Shopify: "shopify.com", Autodesk: "autodesk.com", OpenAI: "openai.com",
  Anthropic: "anthropic.com", "Google Brain": "google.com",
  "Google DeepMind": "deepmind.com", "Meta AI": "ai.meta.com", MSR: "microsoft.com",
  FAIR: "ai.meta.com", Apple: "apple.com", IBM: "ibm.com",
  "Microsoft Research": "microsoft.com", Tesla: "tesla.com", Waymo: "waymo.com",
  Cruise: "getcruise.com", "Hugging Face": "huggingface.co", Cohere: "cohere.com",
  Mistral: "mistral.ai", Runway: "runwayml.com", Midjourney: "midjourney.com",
  Nvidia: "nvidia.com", "Scale AI": "scale.com", "Stability AI": "stability.ai",
};

const logoUrl = (name: string) => {
  const d = COMPANY_DOMAINS[name];
  return d ? `https://www.google.com/s2/favicons?domain=${d}&sz=64` : null;
};

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
              className="group relative rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Square image */}
              <div className="relative aspect-square overflow-hidden bg-muted shrink-0">
                <img
                  src={e.photo}
                  alt={e.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(ev) => {
                    (ev.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
                {/* Experience badge — half width, on image bottom */}
                <div className="absolute bottom-3 left-3 w-1/2 flex items-center gap-2 px-3 py-2 rounded-lg bg-background/90 backdrop-blur-md border border-primary/30 shadow-lg">
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/15 text-primary shrink-0">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div className="leading-tight min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Experience</p>
                    <p className="text-base font-bold text-foreground truncate">
                      {e.years}+ <span className="text-xs font-medium text-muted-foreground">yrs</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex flex-col">
                {/* Name + title */}
                <div className="mb-3 pl-0.5">
                  <p className="font-bold text-lg leading-tight text-foreground">{e.name}</p>
                  <div className="mt-1">
                    <p className="text-[13px] uppercase tracking-wider font-semibold text-primary line-clamp-1">{e.title}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Currently</span>
                  <Linkedin className="w-4 h-4 text-muted-foreground/60 group-hover:text-primary transition" />
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  {logoUrl(e.company) && (
                    <img
                      src={logoUrl(e.company)!}
                      alt={e.company}
                      loading="lazy"
                      className="w-6 h-6 rounded object-contain bg-white ring-1 ring-border"
                      onError={(ev) => ((ev.currentTarget as HTMLImageElement).style.display = "none")}
                    />
                  )}
                  <p className="text-base font-semibold text-primary truncate">{e.company}</p>
                </div>

                <div className="pt-3 mt-3 border-t border-border">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                      Previously
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {e.prevCompanies.map((c) => (
                      <span
                        key={c}
                        className="inline-flex items-center gap-1.5 text-[13px] pl-1 pr-2 py-1 rounded-md bg-muted text-foreground/80 font-medium"
                      >
                        {logoUrl(c) && (
                          <img
                            src={logoUrl(c)!}
                            alt={c}
                            loading="lazy"
                            className="w-4 h-4 rounded-sm object-contain bg-white"
                            onError={(ev) => ((ev.currentTarget as HTMLImageElement).style.display = "none")}
                          />
                        )}
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
