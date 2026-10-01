import { motion } from "framer-motion";
import { Star, Clock, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SectionBadge from "@/components/ui/section-badge";
import { cn } from "@/lib/utils";
import { useState } from "react";

import expertImg1 from "@/assets/expert-course-1.jpg";
import expertImg2 from "@/assets/expert-course-2.jpg";
import expertImg3 from "@/assets/expert-course-3.jpg";
import expertImg4 from "@/assets/expert-course-4.jpg";

const categories = ["All", "AI & ML", "Data Science", "Marketing", "Development", "Design", "Finance"];

const expertCourses = [
  // AI & ML
  { title: "AI Engineer Agentic Track: The Complete Agent & MCP Course", instructor: "Dr. Neha Sharma", image: expertImg1, avatar: "https://randomuser.me/api/portraits/women/44.jpg", rating: 4.7, ratings: "32,408", price: "₹529", originalPrice: "₹799", bestseller: true, category: "AI & ML" },
  { title: "Deep Learning A-Z 2026: Neural Networks & AI Masterclass", instructor: "Kirill Eremenko", image: expertImg3, avatar: "https://randomuser.me/api/portraits/men/32.jpg", rating: 4.6, ratings: "18,240", price: "₹649", originalPrice: "₹2,999", bestseller: true, category: "AI & ML" },
  { title: "Natural Language Processing with Transformers", instructor: "Dr. Priya Menon", image: expertImg2, avatar: "https://randomuser.me/api/portraits/women/68.jpg", rating: 4.8, ratings: "9,120", price: "₹599", originalPrice: "₹2,499", bestseller: false, category: "AI & ML" },
  { title: "Computer Vision & Image Recognition with PyTorch", instructor: "Raj Patel", image: expertImg4, avatar: "https://randomuser.me/api/portraits/men/75.jpg", rating: 4.5, ratings: "12,350", price: "₹579", originalPrice: "₹2,799", bestseller: false, category: "AI & ML" },

  // Data Science
  { title: "Ultimate AWS Certified Solutions Architect Associate 2026", instructor: "Stephane Maarek", image: expertImg3, avatar: "https://randomuser.me/api/portraits/men/22.jpg", rating: 4.7, ratings: "2,83,190", price: "₹579", originalPrice: "₹3,469", bestseller: true, category: "Data Science" },
  { title: "Data Science & Machine Learning Bootcamp with R", instructor: "Jose Portilla", image: expertImg1, avatar: "https://randomuser.me/api/portraits/men/46.jpg", rating: 4.6, ratings: "1,45,800", price: "₹499", originalPrice: "₹2,999", bestseller: true, category: "Data Science" },
  { title: "SQL for Data Analytics: Beginner to Advanced", instructor: "Amit Verma", image: expertImg4, avatar: "https://randomuser.me/api/portraits/men/51.jpg", rating: 4.8, ratings: "67,320", price: "₹449", originalPrice: "₹1,999", bestseller: false, category: "Data Science" },
  { title: "Statistics & Probability for Data Science with Python", instructor: "Dr. Kavita Rao", image: expertImg2, avatar: "https://randomuser.me/api/portraits/women/33.jpg", rating: 4.5, ratings: "22,100", price: "₹529", originalPrice: "₹2,499", bestseller: false, category: "Data Science" },

  // Marketing
  { title: "Digital Marketing Masterclass: Get Your First 1,000 Customers", instructor: "Rohan Gupta", image: expertImg4, avatar: "https://randomuser.me/api/portraits/men/36.jpg", rating: 4.7, ratings: "2,81,991", price: "₹579", originalPrice: "₹3,469", bestseller: true, category: "Marketing" },
  { title: "SEO 2026: Complete Search Engine Optimization Certification", instructor: "Sneha Kapoor", image: expertImg2, avatar: "https://randomuser.me/api/portraits/women/25.jpg", rating: 4.6, ratings: "54,700", price: "₹499", originalPrice: "₹2,799", bestseller: true, category: "Marketing" },
  { title: "Social Media Marketing: Strategy & Content Creation", instructor: "Ankit Joshi", image: expertImg1, avatar: "https://randomuser.me/api/portraits/men/64.jpg", rating: 4.5, ratings: "38,900", price: "₹449", originalPrice: "₹1,999", bestseller: false, category: "Marketing" },
  { title: "Growth Hacking & Performance Marketing 2026", instructor: "Meghna Shah", image: expertImg3, avatar: "https://randomuser.me/api/portraits/women/52.jpg", rating: 4.4, ratings: "29,450", price: "₹399", originalPrice: "₹1,799", bestseller: false, category: "Marketing" },

  // Development
  { title: "100 Days of Code™: The Complete Python Pro Bootcamp", instructor: "Dr. Angela Yu", image: expertImg2, avatar: "https://randomuser.me/api/portraits/women/17.jpg", rating: 4.7, ratings: "4,14,685", price: "₹529", originalPrice: "₹3,199", bestseller: true, category: "Development" },
  { title: "The Complete JavaScript Course 2026: From Zero to Expert!", instructor: "Jonas Schmedtmann", image: expertImg1, avatar: "https://randomuser.me/api/portraits/men/11.jpg", rating: 4.8, ratings: "3,20,540", price: "₹549", originalPrice: "₹3,299", bestseller: true, category: "Development" },
  { title: "React — The Complete Guide 2026 (incl. Next.js & Redux)", instructor: "Maximilian Schwarzmüller", image: expertImg3, avatar: "https://randomuser.me/api/portraits/men/85.jpg", rating: 4.7, ratings: "2,90,100", price: "₹579", originalPrice: "₹3,469", bestseller: true, category: "Development" },
  { title: "Node.js, Express & MongoDB Bootcamp 2026", instructor: "Vikram Sinha", image: expertImg4, avatar: "https://randomuser.me/api/portraits/men/29.jpg", rating: 4.6, ratings: "78,200", price: "₹529", originalPrice: "₹2,999", bestseller: false, category: "Development" },

  // Design
  { title: "The Complete Figma UI/UX Design Masterclass", instructor: "Meera Nair", image: expertImg2, avatar: "https://randomuser.me/api/portraits/women/71.jpg", rating: 4.8, ratings: "62,400", price: "₹499", originalPrice: "₹2,499", bestseller: true, category: "Design" },
  { title: "Graphic Design Bootcamp: Photoshop, Illustrator & InDesign", instructor: "Arjun Bhatia", image: expertImg4, avatar: "https://randomuser.me/api/portraits/men/42.jpg", rating: 4.5, ratings: "41,800", price: "₹449", originalPrice: "₹2,299", bestseller: false, category: "Design" },
  { title: "UX Research & Usability Testing: A Practical Guide", instructor: "Pooja Iyer", image: expertImg1, avatar: "https://randomuser.me/api/portraits/women/89.jpg", rating: 4.6, ratings: "18,900", price: "₹529", originalPrice: "₹2,199", bestseller: false, category: "Design" },
  { title: "Motion Design & Animation with After Effects", instructor: "Karan Mehta", image: expertImg3, avatar: "https://randomuser.me/api/portraits/men/58.jpg", rating: 4.7, ratings: "24,350", price: "₹579", originalPrice: "₹2,799", bestseller: true, category: "Design" },

  // Finance
  { title: "Financial Modeling & Valuation: Complete Beginner to Pro", instructor: "Dr. Sanjay Mohan", image: expertImg1, avatar: "https://randomuser.me/api/portraits/men/93.jpg", rating: 4.7, ratings: "72,600", price: "₹579", originalPrice: "₹3,199", bestseller: true, category: "Finance" },
  { title: "Stock Market Investing & Trading: Zero to Hero", instructor: "Ritu Sharma", image: expertImg3, avatar: "https://randomuser.me/api/portraits/women/38.jpg", rating: 4.5, ratings: "58,100", price: "₹499", originalPrice: "₹2,499", bestseller: true, category: "Finance" },
  { title: "Accounting & Bookkeeping for Small Business 2026", instructor: "Deepak Kulkarni", image: expertImg2, avatar: "https://randomuser.me/api/portraits/men/77.jpg", rating: 4.4, ratings: "33,200", price: "₹399", originalPrice: "₹1,799", bestseller: false, category: "Finance" },
  { title: "Personal Finance & Wealth Management Masterclass", instructor: "Nisha Agarwal", image: expertImg4, avatar: "https://randomuser.me/api/portraits/women/15.jpg", rating: 4.6, ratings: "45,700", price: "₹449", originalPrice: "₹2,299", bestseller: false, category: "Finance" },
];

const ExpertCoursesSection = () => {
  const [active, setActive] = useState("All");
  // "All" shows only top 4 bestsellers (one per category); individual tabs show all 4
  const filtered = active === "All"
    ? categories.slice(1, 5).map((cat) => expertCourses.find((c) => c.category === cat && c.bestseller)!).filter(Boolean)
    : expertCourses.filter((c) => c.category === active);

  return (
  <section className="py-16 md:py-20">
    <div className="container px-4 md:px-6">
      <div className="text-center mb-10">
        <SectionBadge label="Expert-Led" icon={Award} />
        <h2 className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3">
          Learn From Industry Experts<br />
          <span className="text-primary">Who Know the Work</span>
        </h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
          <span className="block">Learn practical skills from professionals who understand today’s roles.</span>
          <span className="block">Gain insight grounded in real work.</span>
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
            className="rounded-xl border bg-card overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          >
            {/* Thumbnail */}
            <div className="relative h-52 md:h-56 overflow-hidden">
              <img
                src={c.image}
                alt={c.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
