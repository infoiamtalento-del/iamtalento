import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const bundles = [
  { name: "Starter Bundle", tests: "Technical + Behavioral", price: 2999, original: 3998, best: "freshers & junior professionals", popular: false, savings: 999 },
  { name: "Professional Bundle", tests: "Technical + Behavioral + Communication", price: 3999, original: 5997, best: "mid-level professionals", popular: false, savings: 1998 },
  { name: "Domain Expert", tests: "Technical + Behavioral + 1 Domain Test", price: 3999, original: 5997, best: "specialists proving deep expertise", popular: false, savings: 1998 },
  { name: "Full Verification", tests: "All 4 Core Tests", price: 4999, original: 7996, best: "maximum employer visibility", popular: true, savings: 2997 },
];

const included = [
  "Full Industry Readiness Report",
  "Verified Badge (if benchmark met)",
  "Employer-visible profile",
  "Certificate download",
  "30-day test window",
  "Score valid for 12 months",
];

const PricingBundles = () => (
  <section className="bg-white py-16 md:py-20">
    <div className="max-w-[1160px] mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <span
          className="inline-block text-[11px] font-bold uppercase tracking-widest text-primary px-3 py-1 mb-3"
          style={{ background: "hsl(355 84% 54% / 0.08)", borderRadius: 100 }}
        >
          PRICING
        </span>
        <h2
          className="text-[26px] md:text-[30px] font-bold mb-2"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0F172A" }}
        >
          Invest Once. Benefit for{" "}
          <span className="text-primary">12 Months.</span>
        </h2>
        <p className="text-sm" style={{ color: "#475569" }}>
          Single Test: <span className="font-bold" style={{ color: "#0F172A" }}>₹1,999</span> per assessment
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {bundles.map((b, i) => (
          <motion.div
            key={b.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className={`relative bg-white p-6 flex flex-col ${b.popular ? "ring-2 ring-primary" : ""}`}
            style={{
              borderRadius: 12,
              border: b.popular ? "none" : "1px solid #E2E8F0",
              transition: "box-shadow 200ms, transform 200ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.07)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {b.popular && (
              <span
                className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-3 py-1 flex items-center gap-1 shadow-md"
                style={{ borderRadius: 100 }}
              >
                <Star className="h-3 w-3" /> MOST POPULAR
              </span>
            )}
            <h3 className="text-[15px] font-bold mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0F172A" }}>
              {b.name}
            </h3>
            <p className="text-xs mb-4" style={{ color: "#6B7280" }}>{b.tests}</p>
            <div className="flex items-end gap-2 mb-1">
              <span className="text-2xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0F172A" }}>
                ₹{b.price.toLocaleString()}
              </span>
              <span className="text-sm line-through" style={{ color: "#CBD5E1" }}>₹{b.original.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-primary mb-3">
              <Sparkles className="h-3 w-3" /> Save ₹{b.savings.toLocaleString()}
            </div>
            <p className="text-xs mb-5" style={{ color: "#94A3B8" }}>Best for {b.best}</p>
            <Button
              className={`mt-auto gap-2 text-sm font-bold h-10 ${b.popular ? "bg-primary hover:bg-primary/90 text-white" : "bg-white text-primary border-primary hover:bg-primary hover:text-white"}`}
              variant={b.popular ? "default" : "outline"}
              style={{ borderRadius: 8 }}
            >
              Choose Bundle <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Included in all */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white p-6"
        style={{ borderRadius: 12, border: "1px solid #E2E8F0" }}
      >
        <p className="text-[15px] font-bold text-center mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0F172A" }}>
          All Bundles Include
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {included.map((item) => (
            <span key={item} className="flex items-center gap-2 text-sm" style={{ color: "#475569" }}>
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> {item}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default PricingBundles;
