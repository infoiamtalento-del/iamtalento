import { motion } from "framer-motion";
import { Star, Clock, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SectionBadge from "@/components/ui/section-badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import expertImg1 from "@/assets/expert-course-1.jpg";
import expertImg2 from "@/assets/expert-course-2.jpg";
import expertImg3 from "@/assets/expert-course-3.jpg";
import expertImg4 from "@/assets/expert-course-4.jpg";
import expertImg5 from "@/assets/experts/female-1.jpg";
import expertImg6 from "@/assets/experts/male-1.jpg";
import expertImg7 from "@/assets/experts/female-2.jpg";
import expertImg8 from "@/assets/experts/male-2.jpg";

const categories = ["All", "AI & ML", "Data Science", "Marketing", "Development", "Design", "Finance"];

const expertCourses = [
  // AI & ML
  { title: "AI Engineer Agentic Track: The Complete Agent & MCP Course", instructor: "Dr. Neha Sharma", image: expertImg1, avatar: "https://randomuser.me/api/portraits/women/44.jpg", rating: 4.7, ratings: "32,408", price: "₹529", originalPrice: "₹799", bestseller: true, category: "AI & ML" },
  { title: "Deep Learning A-Z 2026: Neural Networks & AI Masterclass", instructor: "Kirill Eremenko", image: expertImg3, avatar: "https://randomuser.me/api/portraits/men/32.jpg", rating: 4.6, ratings: "18,240", price: "₹649", originalPrice: "₹2,999", bestseller: true, category: "AI & ML" },
  { title: "Natural Language Processing with Transformers", instructor: "Dr. Priya Menon", image: expertImg2, avatar: "https://randomuser.me/api/portraits/women/68.jpg", rating: 4.8, ratings: "9,120", price: "₹599", originalPrice: "₹2,499", bestseller: false, category: "AI & ML" },
  { title: "Computer Vision & Image Recognition with PyTorch", instructor: "Raj Patel", image: expertImg4, avatar: "https://randomuser.me/api/portraits/men/75.jpg", rating: 4.5, ratings: "12,350", price: "₹579", originalPrice: "₹2,799", bestseller: false, category: "AI & ML" },
  { title: "Generative AI & LLM Fine-Tuning in Production", instructor: "Ananya Deshmukh", image: expertImg5, avatar: "https://randomuser.me/api/portraits/women/21.jpg", rating: 4.9, ratings: "24,610", price: "₹629", originalPrice: "₹3,199", bestseller: true, category: "AI & ML" },
  { title: "MLOps & Scalable AI Deployment with Docker & Kubernetes", instructor: "Siddharth Malhotra", image: expertImg6, avatar: "https://randomuser.me/api/portraits/men/41.jpg", rating: 4.7, ratings: "14,890", price: "₹549", originalPrice: "₹2,699", bestseller: false, category: "AI & ML" },
  { title: "Reinforcement Learning & Autonomous Decision Systems", instructor: "Dr. Aditi Kulkarni", image: expertImg7, avatar: "https://randomuser.me/api/portraits/women/54.jpg", rating: 4.6, ratings: "8,430", price: "₹599", originalPrice: "₹2,899", bestseller: false, category: "AI & ML" },
  { title: "Prompt Engineering & Enterprise RAG Architectures", instructor: "Varun Krishnan", image: expertImg8, avatar: "https://randomuser.me/api/portraits/men/62.jpg", rating: 4.8, ratings: "41,200", price: "₹499", originalPrice: "₹2,499", bestseller: true, category: "AI & ML" },

  // Data Science
  { title: "Ultimate AWS Certified Solutions Architect Associate 2026", instructor: "Stephane Maarek", image: expertImg3, avatar: "https://randomuser.me/api/portraits/men/22.jpg", rating: 4.7, ratings: "2,83,190", price: "₹579", originalPrice: "₹3,469", bestseller: true, category: "Data Science" },
  { title: "Data Science & Machine Learning Bootcamp with R", instructor: "Jose Portilla", image: expertImg1, avatar: "https://randomuser.me/api/portraits/men/46.jpg", rating: 4.6, ratings: "1,45,800", price: "₹499", originalPrice: "₹2,999", bestseller: true, category: "Data Science" },
  { title: "SQL for Data Analytics: Beginner to Advanced", instructor: "Amit Verma", image: expertImg4, avatar: "https://randomuser.me/api/portraits/men/51.jpg", rating: 4.8, ratings: "67,320", price: "₹449", originalPrice: "₹1,999", bestseller: false, category: "Data Science" },
  { title: "Statistics & Probability for Data Science with Python", instructor: "Dr. Kavita Rao", image: expertImg2, avatar: "https://randomuser.me/api/portraits/women/33.jpg", rating: 4.5, ratings: "22,100", price: "₹529", originalPrice: "₹2,499", bestseller: false, category: "Data Science" },
  { title: "Power BI & Tableau Executive Data Storytelling", instructor: "Nandini Iyer", image: expertImg5, avatar: "https://randomuser.me/api/portraits/women/29.jpg", rating: 4.8, ratings: "53,400", price: "₹529", originalPrice: "₹2,799", bestseller: true, category: "Data Science" },
  { title: "Apache Spark & Big Data Engineering with Databricks", instructor: "Harshvardhan Singh", image: expertImg6, avatar: "https://randomuser.me/api/portraits/men/33.jpg", rating: 4.7, ratings: "31,250", price: "₹649", originalPrice: "₹3,299", bestseller: false, category: "Data Science" },
  { title: "Time Series Forecasting & Predictive Analytics", instructor: "Dr. Shalini Nair", image: expertImg7, avatar: "https://randomuser.me/api/portraits/women/47.jpg", rating: 4.6, ratings: "19,800", price: "₹549", originalPrice: "₹2,599", bestseller: false, category: "Data Science" },
  { title: "Modern Data Stack: Snowflake, dbt & Airflow", instructor: "Pranav Kulkarni", image: expertImg8, avatar: "https://randomuser.me/api/portraits/men/71.jpg", rating: 4.8, ratings: "27,900", price: "₹599", originalPrice: "₹2,999", bestseller: true, category: "Data Science" },

  // Marketing
  { title: "Digital Marketing Masterclass: Get Your First 1,000 Customers", instructor: "Rohan Gupta", image: expertImg4, avatar: "https://randomuser.me/api/portraits/men/36.jpg", rating: 4.7, ratings: "2,81,991", price: "₹579", originalPrice: "₹3,469", bestseller: true, category: "Marketing" },
  { title: "SEO 2026: Complete Search Engine Optimization Certification", instructor: "Sneha Kapoor", image: expertImg2, avatar: "https://randomuser.me/api/portraits/women/25.jpg", rating: 4.6, ratings: "54,700", price: "₹499", originalPrice: "₹2,799", bestseller: true, category: "Marketing" },
  { title: "Social Media Marketing: Strategy & Content Creation", instructor: "Ankit Joshi", image: expertImg1, avatar: "https://randomuser.me/api/portraits/men/64.jpg", rating: 4.5, ratings: "38,900", price: "₹449", originalPrice: "₹1,999", bestseller: false, category: "Marketing" },
  { title: "Growth Hacking & Performance Marketing 2026", instructor: "Meghna Shah", image: expertImg3, avatar: "https://randomuser.me/api/portraits/women/52.jpg", rating: 4.4, ratings: "29,450", price: "₹399", originalPrice: "₹1,799", bestseller: false, category: "Marketing" },
  { title: "Meta & Google Ads Mastery: High-ROAS Paid Acquisition", instructor: "Ritika Bansal", image: expertImg5, avatar: "https://randomuser.me/api/portraits/women/63.jpg", rating: 4.8, ratings: "46,200", price: "₹549", originalPrice: "₹2,699", bestseller: true, category: "Marketing" },
  { title: "B2B SaaS Demand Generation & Account-Based Marketing", instructor: "Aditya Chawla", image: expertImg6, avatar: "https://randomuser.me/api/portraits/men/53.jpg", rating: 4.7, ratings: "21,300", price: "₹579", originalPrice: "₹2,899", bestseller: false, category: "Marketing" },
  { title: "GA4, Marketing Attribution & Funnel Analytics", instructor: "Divya Subramanian", image: expertImg7, avatar: "https://randomuser.me/api/portraits/women/39.jpg", rating: 4.6, ratings: "17,450", price: "₹499", originalPrice: "₹2,299", bestseller: false, category: "Marketing" },
  { title: "Brand Strategy & Copywriting That Converts", instructor: "Kabir Sengupta", image: expertImg8, avatar: "https://randomuser.me/api/portraits/men/81.jpg", rating: 4.8, ratings: "34,100", price: "₹479", originalPrice: "₹2,199", bestseller: true, category: "Marketing" },

  // Development
  { title: "100 Days of Code™: The Complete Python Pro Bootcamp", instructor: "Dr. Angela Yu", image: expertImg2, avatar: "https://randomuser.me/api/portraits/women/17.jpg", rating: 4.7, ratings: "4,14,685", price: "₹529", originalPrice: "₹3,199", bestseller: true, category: "Development" },
  { title: "The Complete JavaScript Course 2026: From Zero to Expert!", instructor: "Jonas Schmedtmann", image: expertImg1, avatar: "https://randomuser.me/api/portraits/men/11.jpg", rating: 4.8, ratings: "3,20,540", price: "₹549", originalPrice: "₹3,299", bestseller: true, category: "Development" },
  { title: "React, The Complete Guide 2026 (incl. Next.js & Redux)", instructor: "Maximilian Schwarzmüller", image: expertImg3, avatar: "https://randomuser.me/api/portraits/men/85.jpg", rating: 4.7, ratings: "2,90,100", price: "₹579", originalPrice: "₹3,469", bestseller: true, category: "Development" },
  { title: "Node.js, Express & MongoDB Bootcamp 2026", instructor: "Vikram Sinha", image: expertImg4, avatar: "https://randomuser.me/api/portraits/men/29.jpg", rating: 4.6, ratings: "78,200", price: "₹529", originalPrice: "₹2,999", bestseller: false, category: "Development" },
  { title: "System Design & Scalable Microservices Architecture", instructor: "Shruti Deshpande", image: expertImg5, avatar: "https://randomuser.me/api/portraits/women/26.jpg", rating: 4.9, ratings: "91,400", price: "₹649", originalPrice: "₹3,499", bestseller: true, category: "Development" },
  { title: "Go (Golang) for High-Performance Backend Systems", instructor: "Nikhil Tandon", image: expertImg6, avatar: "https://randomuser.me/api/portraits/men/48.jpg", rating: 4.7, ratings: "42,600", price: "₹549", originalPrice: "₹2,799", bestseller: false, category: "Development" },
  { title: "Full-Stack TypeScript with Next.js 15, Prisma & Tailwind", instructor: "Pallavi Hegde", image: expertImg7, avatar: "https://randomuser.me/api/portraits/women/74.jpg", rating: 4.8, ratings: "63,800", price: "₹579", originalPrice: "₹2,999", bestseller: true, category: "Development" },
  { title: "DevOps CI/CD Pipelines with GitHub Actions & Terraform", instructor: "Saurabh Chatterjee", image: expertImg8, avatar: "https://randomuser.me/api/portraits/men/67.jpg", rating: 4.6, ratings: "37,500", price: "₹529", originalPrice: "₹2,699", bestseller: false, category: "Development" },

  // Design
  { title: "The Complete Figma UI/UX Design Masterclass", instructor: "Meera Nair", image: expertImg5, avatar: "https://randomuser.me/api/portraits/women/71.jpg", rating: 4.8, ratings: "62,400", price: "₹499", originalPrice: "₹2,499", bestseller: true, category: "Design" },
  { title: "Graphic Design Bootcamp: Photoshop, Illustrator & InDesign", instructor: "Arjun Bhatia", image: expertImg4, avatar: "https://randomuser.me/api/portraits/men/42.jpg", rating: 4.5, ratings: "41,800", price: "₹449", originalPrice: "₹2,299", bestseller: false, category: "Design" },
  { title: "UX Research & Usability Testing: A Practical Guide", instructor: "Pooja Iyer", image: expertImg7, avatar: "https://randomuser.me/api/portraits/women/89.jpg", rating: 4.6, ratings: "18,900", price: "₹529", originalPrice: "₹2,199", bestseller: false, category: "Design" },
  { title: "Motion Design & Animation with After Effects", instructor: "Karan Mehta", image: expertImg6, avatar: "https://randomuser.me/api/portraits/men/58.jpg", rating: 4.7, ratings: "24,350", price: "₹579", originalPrice: "₹2,799", bestseller: true, category: "Design" },
  { title: "Design Systems at Scale: Tokens, Variables & Governance", instructor: "Tanvi Parekh", image: expertImg2, avatar: "https://randomuser.me/api/portraits/women/31.jpg", rating: 4.9, ratings: "35,200", price: "₹599", originalPrice: "₹2,999", bestseller: true, category: "Design" },
  { title: "Product Design Portfolio & Case Study Storytelling", instructor: "Devansh Ahuja", image: expertImg1, avatar: "https://randomuser.me/api/portraits/men/24.jpg", rating: 4.7, ratings: "28,400", price: "₹499", originalPrice: "₹2,499", bestseller: false, category: "Design" },
  { title: "3D Web & Interactive Experiences with Spline & Framer", instructor: "Ishita Sengupta", image: expertImg3, avatar: "https://randomuser.me/api/portraits/women/59.jpg", rating: 4.6, ratings: "15,700", price: "₹549", originalPrice: "₹2,699", bestseller: false, category: "Design" },
  { title: "Mobile App UI/UX for iOS & Android Design Guidelines", instructor: "Rishi Oberoi", image: expertImg8, avatar: "https://randomuser.me/api/portraits/men/79.jpg", rating: 4.8, ratings: "44,900", price: "₹529", originalPrice: "₹2,599", bestseller: true, category: "Design" },

  // Finance
  { title: "Financial Modeling & Valuation: Complete Beginner to Pro", instructor: "Dr. Sanjay Mohan", image: expertImg8, avatar: "https://randomuser.me/api/portraits/men/93.jpg", rating: 4.7, ratings: "72,600", price: "₹579", originalPrice: "₹3,199", bestseller: true, category: "Finance" },
  { title: "Stock Market Investing & Trading: Zero to Hero", instructor: "Ritu Sharma", image: expertImg7, avatar: "https://randomuser.me/api/portraits/women/38.jpg", rating: 4.5, ratings: "58,100", price: "₹499", originalPrice: "₹2,499", bestseller: true, category: "Finance" },
  { title: "Accounting & Bookkeeping for Small Business 2026", instructor: "Deepak Kulkarni", image: expertImg2, avatar: "https://randomuser.me/api/portraits/men/77.jpg", rating: 4.4, ratings: "33,200", price: "₹399", originalPrice: "₹1,799", bestseller: false, category: "Finance" },
  { title: "Personal Finance & Wealth Management Masterclass", instructor: "Nisha Agarwal", image: expertImg4, avatar: "https://randomuser.me/api/portraits/women/15.jpg", rating: 4.6, ratings: "45,700", price: "₹449", originalPrice: "₹2,299", bestseller: false, category: "Finance" },
  { title: "Investment Banking & Private Equity Deal Structuring", instructor: "Aarav Rajvanshi", image: expertImg6, avatar: "https://randomuser.me/api/portraits/men/19.jpg", rating: 4.8, ratings: "39,400", price: "₹649", originalPrice: "₹3,499", bestseller: true, category: "Finance" },
  { title: "Corporate FP&A, Budgeting & Executive Forecasting", instructor: "Swati Venkatesh", image: expertImg5, avatar: "https://randomuser.me/api/portraits/women/42.jpg", rating: 4.7, ratings: "26,800", price: "₹549", originalPrice: "₹2,799", bestseller: false, category: "Finance" },
  { title: "Algorithmic Trading & Quantitative Finance with Python", instructor: "Gaurav Nanda", image: expertImg1, avatar: "https://randomuser.me/api/portraits/men/56.jpg", rating: 4.8, ratings: "31,500", price: "₹599", originalPrice: "₹2,999", bestseller: true, category: "Finance" },
  { title: "Venture Capital Valuation & Startup Fundraising", instructor: "Radhika Menon", image: expertImg3, avatar: "https://randomuser.me/api/portraits/women/66.jpg", rating: 4.6, ratings: "19,200", price: "₹529", originalPrice: "₹2,599", bestseller: false, category: "Finance" },
];

const allFeaturedCourses = [
  expertCourses[0],  // Dr. Neha Sharma (expertImg1)
  expertCourses[8],  // Stephane Maarek (expertImg3)
  expertCourses[16], // Rohan Gupta (expertImg4)
  expertCourses[24], // Dr. Angela Yu (expertImg2)
  expertCourses[32], // Meera Nair (expertImg5)
  expertCourses[44], // Aarav Rajvanshi (expertImg6)
  expertCourses[41], // Ritu Sharma (expertImg7)
  expertCourses[40], // Dr. Sanjay Mohan (expertImg8)
];

const ExpertCoursesSection = () => {
  const [active, setActive] = useState("All");
  const navigate = useNavigate();
  // "All" shows 8 top expert profiles (two rows of 4); individual tabs show all 8 for that category
  const filtered = active === "All"
    ? allFeaturedCourses
    : expertCourses.filter((c) => c.category === active);

  return (
  <section className="py-16 md:py-20">
    <div className="container px-4 md:px-6">
      <div className="text-center mb-10">
        <SectionBadge label="Expert-Led" icon={Award} />
        <h2 className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3">
          Learn From Experts<br />
          <span className="text-primary">Build Real Skills</span>
        </h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
          <span className="block">Learn practical skills from working experts.</span>
          <span className="block">Gain real-world insight.</span>
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200",
              active === cat
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card text-foreground border-border hover:border-primary/30 hover:bg-accent"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filtered.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            onClick={() => navigate("/learning/courses/ai-engineer-agentic-track")}
            className="rounded-xl border bg-card overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          >
            {/* Thumbnail */}
            <div className="relative aspect-[5/4] overflow-hidden bg-slate-100">
              <img
                src={c.image}
                alt={c.title}
                className="w-full h-full object-cover object-[center_12%] group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Content */}
            <div className="p-5 space-y-3">
              <h3 className="font-bold font-display text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                {c.title}
              </h3>
              <div className="flex items-center gap-2">
                <img src={c.avatar} alt={c.instructor} className="h-6 w-6 rounded-full object-cover" />
                <p className="text-[11px] text-muted-foreground line-clamp-1">{c.instructor}</p>
              </div>

              {/* Bestseller + Rating row */}
              <div className="flex items-center gap-2 flex-wrap">
                {c.bestseller && (
                  <span className="text-[10px] font-bold bg-[hsl(33,100%,50%)]/15 text-[hsl(33,100%,40%)] px-2 py-0.5 rounded-sm border border-[hsl(33,100%,50%)]/30">
                    Bestseller
                  </span>
                )}
                <span className="text-xs font-bold text-foreground">{c.rating}</span>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className={cn(
                        "h-3 w-3",
                        j < Math.floor(c.rating)
                          ? "fill-[hsl(33,100%,50%)] text-[hsl(33,100%,50%)]"
                          : "text-muted"
                      )}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {c.ratings} ratings
                </span>
              </div>

              {/* Price row */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-base font-bold font-display">{c.price}</span>
                <span className="text-xs text-muted-foreground line-through">
                  {c.originalPrice}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link to="/learning#courses">
          <Button variant="outline" className="gap-2">
            View All Expert Courses <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  </section>
  );
};

export default ExpertCoursesSection;
