import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Calendar } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const posts = [
  { slug: "ai-hiring-bias-2026", title: "Eliminating Bias in AI Hiring: A 2026 Playbook", excerpt: "How leading companies are using debiased AI to build more diverse, high-performing teams.", category: "AI Ethics", date: "Feb 10, 2026" },
  { slug: "screening-vs-interviews", title: "Why AI Screening Outperforms Traditional Interviews", excerpt: "Data from 500K+ screenings reveals the limitations of unstructured interviews.", category: "Research", date: "Feb 5, 2026" },
  { slug: "custom-assessments-guide", title: "The Complete Guide to Custom Skill Assessments", excerpt: "How to build role-specific tests that predict on-the-job performance.", category: "Product", date: "Jan 28, 2026" },
  { slug: "talent-pool-strategy", title: "Building a Proactive Talent Pool Strategy", excerpt: "Move from reactive recruiting to proactive talent pipeline management with AI.", category: "Strategy", date: "Jan 20, 2026" },
  { slug: "hr-tech-stack-2026", title: "The Modern HR Tech Stack: What You Actually Need", excerpt: "Cut through the noise and build an HR technology stack that delivers ROI.", category: "Industry", date: "Jan 15, 2026" },
  { slug: "candidate-experience", title: "Candidate Experience: The Hidden Competitive Advantage", excerpt: "How top employers use AI to create a world-class candidate experience.", category: "Best Practice", date: "Jan 8, 2026" },
];

const categories = ["All", ...new Set(posts.map(p => p.category))];

const Blog = () => {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const filtered = posts.filter(p =>
    (cat === "All" || p.category === cat) &&
    (p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <Helmet>
        <title>Blog | I Am Talento | HR & Recruitment Insights</title>
        <meta name="description" content="Insights on AI hiring, talent screening, assessment strategies, and HR best practices from the I Am Talento team." />
      </Helmet>
      <Layout>
        <section className="pt-32 pb-24">
          <div className="container max-w-4xl">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">Blog</p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display leading-[1.15] mb-4">
                Talent Insights for<br /><span className="text-primary">Modern Hiring</span>
              </h1>
              <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto">
                <span className="block">Explore practical research and fresh strategies.</span>
                <span className="block">Make stronger hiring decisions.</span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search articles..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map(c => (
                  <button key={c} onClick={() => setCat(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${cat === c ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {filtered.map(({ slug, title, excerpt, category, date }) => (
                <article key={slug} className="group p-6 rounded-2xl bg-card border border-border/50 hover:shadow-xl hover:border-primary/20 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="text-xs">{category}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" />{date}</span>
                  </div>
                  <h2 className="text-lg font-semibold font-display mb-2 group-hover:text-primary transition-colors">
                    <Link to={`/blog/${slug}`}>{title}</Link>
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{excerpt}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Blog;
