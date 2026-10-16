import { motion } from "framer-motion";
import { useState } from "react";
import { Search, Clock, Users, Star, Code2, BarChart3, Palette, Megaphone, Database, Brain, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const domains = ["All", "Programming", "Data Science", "Design", "Marketing", "Finance", "HR"];

const assessments = [
  { name: "Python Developer Assessment", domain: "Programming", duration: "60 min", attempts: "12,340+", rating: "4.8", difficulty: "Intermediate", diffColor: "bg-yellow-100 text-yellow-700", icon: Code2, iconBg: "bg-gray-100" },
  { name: "Data Analytics Proficiency", domain: "Data Science", duration: "75 min", attempts: "8,920+", rating: "4.7", difficulty: "Advanced", diffColor: "bg-blue-50 text-blue-700", icon: BarChart3, iconBg: "bg-gray-100" },
  { name: "UI/UX Design Evaluation", domain: "Design", duration: "45 min", attempts: "6,450+", rating: "4.9", difficulty: "Beginner", diffColor: "bg-green-50 text-green-600", icon: Palette, iconBg: "bg-gray-100" },
  { name: "Digital Marketing Specialist", domain: "Marketing", duration: "50 min", attempts: "9,780+", rating: "4.6", difficulty: "Intermediate", diffColor: "bg-yellow-100 text-yellow-700", icon: Megaphone, iconBg: "bg-gray-100" },
  { name: "SQL & Database Management", domain: "Programming", duration: "55 min", attempts: "7,230+", rating: "4.8", difficulty: "Advanced", diffColor: "bg-blue-50 text-blue-700", icon: Database, iconBg: "bg-gray-100" },
  { name: "Machine Learning Fundamentals", domain: "Data Science", duration: "90 min", attempts: "5,100+", rating: "4.7", difficulty: "Advanced", diffColor: "bg-blue-50 text-blue-700", icon: Brain, iconBg: "bg-gray-100" },
];

const SelectAssessmentSection = () => {
  const [activeDomain, setActiveDomain] = useState("All");
  const filtered = activeDomain === "All" ? assessments : assessments.filter((a) => a.domain === activeDomain);

  return (
    <section style={{ background: "#F8FAFC" }} className="py-16 md:py-20">
      <div className="max-w-[1160px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span
            className="inline-block text-[11px] font-bold uppercase tracking-widest text-primary px-3 py-1 mb-3"
            style={{ background: "hsl(355 84% 54% / 0.08)", borderRadius: 100 }}
          >
            FIND YOUR ASSESSMENT
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-display leading-[1.15] text-foreground">
            Find the Right Assessment<br />
            <span className="text-primary">for Your Career</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mt-4">
            Explore proctored assessments across every domain and skill level.<br className="hidden md:block" />
            Pick one, prove your expertise, and stand out.
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <div className="bg-card rounded-2xl shadow-[0_8px_30px_-12px_hsl(var(--foreground)/0.15)] border border-border/60 p-3 flex flex-col md:flex-row md:items-center gap-2">
            {[
              { icon: Search, label: "What", type: "input", placeholder: "Skills, roles, or assessments" },
              { icon: Code2, label: "Domain", type: "select", placeholder: "Select domain", options: domains.filter((d) => d !== "All") },
              { icon: BarChart3, label: "Level", type: "select", placeholder: "Select level", options: ["Beginner", "Intermediate", "Advanced"] },
            ].map((f, idx) => (
              <div key={f.label} className={`flex items-center gap-3 flex-1 px-3 py-2 ${idx > 0 ? "md:border-l border-border" : ""}`}>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-foreground">{f.label}</div>
                  {f.type === "input" ? (
                    <input type="text" placeholder={f.placeholder} className="w-full bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground" />
                  ) : (
                    <select defaultValue="" className="w-full bg-transparent text-sm outline-none cursor-pointer text-muted-foreground">
                      <option value="" disabled>{f.placeholder}</option>
                      {f.options!.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  )}
                </div>
              </div>
            ))}
            <Button asChild className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-2">
              <Link to="/assessments/digital-marketing-fundamentals">
                <Search className="h-4 w-4" /> Search Assessments
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {domains.map((d) => (
            <button
              key={d}
              onClick={() => setActiveDomain(d)}
              className="text-xs font-medium px-3.5 py-1.5 transition-all duration-150"
              style={{
                borderRadius: 100,
                background: activeDomain === d ? "hsl(355 84% 54% / 0.1)" : "#F1F5F9",
                color: activeDomain === d ? "hsl(355 84% 54%)" : "#475569",
                border: activeDomain === d ? "1px solid hsl(355 84% 54% / 0.3)" : "1px solid transparent",
              }}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Assessment cards */}
        <div className="space-y-2">
          {filtered.map((a, i) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white flex items-center gap-4 px-5 py-4 group cursor-pointer"
              style={{
                borderRadius: 10,
                border: "1px solid #E2E8F0",
                transition: "border-color 200ms, box-shadow 200ms",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#CBD5E1";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#E2E8F0";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Icon */}
              <div
                className={`h-10 w-10 flex items-center justify-center shrink-0 ${a.iconBg}`}
                style={{ borderRadius: 8 }}
              >
                <a.icon className="h-5 w-5" style={{ color: "#0F172A" }} />
              </div>

              {/* Center info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[15px] font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0F172A" }}>
                    {a.name}
                  </span>
                  <span
                    className="text-[11px] font-medium px-2 py-0.5"
                    style={{ background: "#F1F5F9", borderRadius: 100, color: "#475569" }}
                  >
                    {a.domain}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[12px]" style={{ color: "#94A3B8" }}>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {a.duration}</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {a.attempts}</span>
                  <span className="flex items-center gap-1"><Star className="h-3 w-3" /> {a.rating}</span>
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`text-[12px] font-medium px-2.5 py-1 ${a.diffColor}`}
                  style={{ borderRadius: 100 }}
                >
                  {a.difficulty}
                </span>
                <Link
                  to="/assessments/explore"
                  className="text-[13px] font-bold text-primary px-4 py-2 flex items-center gap-1.5 transition-all duration-120 hover:bg-primary hover:text-white"
                  style={{ borderRadius: 6, border: "1px solid hsl(355 84% 54%)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                >
                  Take Test <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SelectAssessmentSection;
