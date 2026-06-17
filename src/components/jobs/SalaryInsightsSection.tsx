import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, TrendingUp, Trophy, Zap, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SectionBadge from "@/components/ui/section-badge";
import { cn } from "@/lib/utils";

// Base CTC (in INR LPA) for 0 years experience per role — market standard baselines
const roleBaselines: Record<string, { base: number; growth: number; label: string }> = {
  "software-engineer": { base: 6, growth: 0.18, label: "Software Engineer" },
  "data-scientist":    { base: 8, growth: 0.22, label: "Data Scientist" },
  "product-manager":   { base: 12, growth: 0.20, label: "Product Manager" },
  "ai-engineer":       { base: 10, growth: 0.25, label: "AI / ML Engineer" },
  "designer":          { base: 5, growth: 0.16, label: "Product Designer" },
  "marketer":          { base: 4.5, growth: 0.17, label: "Growth Marketer" },
  "devops":            { base: 7, growth: 0.19, label: "DevOps Engineer" },
  "data-analyst":      { base: 5, growth: 0.16, label: "Data Analyst" },
};

const experienceYears = [0, 1, 2, 3, 5, 7, 10, 12];

const formatINR = (lpa: number) => {
  if (lpa >= 100) return `₹${(lpa / 100).toFixed(2)} Cr`;
  return `₹${lpa.toFixed(1)} LPA`;
};

const SalaryInsightsSection = () => {
  const [role, setRole] = useState<string>("software-engineer");
  const [exp, setExp] = useState<number>(3);

  const { points, market, talento, lowest, highest } = useMemo(() => {
    const cfg = roleBaselines[role];
    const points = experienceYears.map(y => {
      const m = cfg.base * Math.pow(1 + cfg.growth, y);
      return { year: y, market: m, talento: m * 1.5 };
    });
    const market = cfg.base * Math.pow(1 + cfg.growth, exp);
    const talento = market * 1.5;
    return {
      points,
      market,
      talento,
      lowest: market * 0.7,
      highest: market * 1.6,
    };
  }, [role, exp]);

  // Build SVG paths
  const W = 560, H = 200, PAD = 20;
  const maxY = Math.max(...points.map(p => p.talento)) * 1.05;
  const xScale = (y: number) => PAD + (y / 12) * (W - PAD * 2);
  const yScale = (v: number) => H - PAD - (v / maxY) * (H - PAD * 2);

  const buildPath = (key: "market" | "talento") =>
    points.map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.year)} ${yScale(p[key])}`).join(" ");
  const buildArea = (key: "market" | "talento") =>
    `${buildPath(key)} L ${xScale(12)} ${H - PAD} L ${xScale(0)} ${H - PAD} Z`;

  return (
    <section className="py-16 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10">
          <SectionBadge label="Live Salary Intelligence" icon={LineChart} />
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold font-display mb-3"
          >
            Know Your Worth.<br />
            <span className="text-primary">Earn What You Deserve.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto"
          >
            <span className="font-semibold text-foreground">Compare salaries, explore growth trends, and negotiate with confidence</span> — powered by data from 50,000+ verified Talento offers.
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent/40 via-background to-warning/5 border border-border/60 shadow-xl"
        >
          {/* Decorative glows */}
          <div className="pointer-events-none absolute inset-0 -z-0">
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/10 blur-[120px]" />
            <div className="absolute -bottom-24 -right-10 w-96 h-96 rounded-full bg-warning/15 blur-[120px]" />
            <div
              className="absolute inset-0 opacity-[0.5]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)",
                backgroundSize: "44px 44px",
                maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
              }}
            />
          </div>

          <div className="relative z-10 p-6 md:p-10">
            {/* Inline badge row */}
            <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warning/10 text-warning border border-warning/20 text-xs font-medium">
                <Sparkles className="h-3.5 w-3.5" />
                Live Salary Intelligence — 50,000+ verified Talento offers
              </div>
              <Link
                to="/assessments"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 group"
              >
                Explore salary data
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>


            <div className="grid lg:grid-cols-[1fr_1.4fr] gap-8">
              {/* Left: Controls + stats */}
              <div className="space-y-5">
                {/* Role selector */}
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                    Job Role
                  </label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="bg-card text-foreground border border-border h-12 rounded-xl shadow-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(roleBaselines).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Experience slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs uppercase tracking-wider text-muted-foreground">
                      Years of Experience
                    </label>
                    <span className="text-sm font-semibold text-warning">{exp} {exp === 1 ? "yr" : "yrs"}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={12}
                    step={1}
                    value={exp}
                    onChange={(e) => setExp(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none bg-border accent-warning cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                      [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-warning
                      [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_hsl(var(--warning)/0.2)]"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>0</span><span>3</span><span>6</span><span>9</span><span>12+</span>
                  </div>
                </div>

                {/* Stat row */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <Stat label="Avg Market" value={formatINR(market)} />
                  <Stat label="Lowest" value={formatINR(lowest)} />
                  <Stat label="Highest" value={formatINR(highest)} />
                </div>
              </div>

              {/* Right: Chart + headline */}
              <div className="space-y-5">
                {/* Headline */}
                <div className="rounded-2xl bg-card border border-warning/30 p-5 shadow-sm relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-warning/10 via-transparent to-primary/5 pointer-events-none" />
                  <div className="relative flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-warning font-semibold uppercase tracking-wider mb-1">
                        <Trophy className="h-3.5 w-3.5" /> Talento Verified Earning Potential
                      </div>
                      <div className="font-display text-4xl md:text-5xl font-bold leading-tight text-foreground">
                        {formatINR(talento)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        That's <span className="text-warning font-semibold">1.5× the market standard</span> for
                        a {roleBaselines[role].label.toLowerCase()} with {exp} {exp === 1 ? "year" : "years"} of experience.
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-sm font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full">
                      <TrendingUp className="h-3.5 w-3.5" /> +{Math.round(((talento - market) / market) * 100)}%
                    </div>
                  </div>
                </div>

                {/* Chart */}
                <div className="rounded-2xl bg-card border border-border p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <div className="flex items-center gap-4">
                      <LegendDot color="hsl(var(--warning))" label="Talento" />
                      <LegendDot color="hsl(var(--muted-foreground))" label="Market" />
                    </div>
                    <span className="text-muted-foreground">CTC vs Experience</span>
                  </div>
                  <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
                    <defs>
                      <linearGradient id="talentoFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--warning))" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="hsl(var(--warning))" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="marketFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--muted-foreground))" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="hsl(var(--muted-foreground))" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Grid */}
                    {[0.25, 0.5, 0.75].map((t) => (
                      <line key={t} x1={PAD} x2={W - PAD} y1={PAD + t * (H - PAD * 2)} y2={PAD + t * (H - PAD * 2)}
                        stroke="hsl(var(--border))" strokeDasharray="3 4" />
                    ))}

                    {/* Market area + line */}
                    <path d={buildArea("market")} fill="url(#marketFill)" />
                    <path d={buildPath("market")} fill="none" stroke="hsl(var(--muted-foreground))" strokeOpacity="0.6" strokeWidth="2" strokeDasharray="4 4" />

                    {/* Talento area + line */}
                    <path d={buildArea("talento")} fill="url(#talentoFill)" />
                    <motion.path
                      d={buildPath("talento")}
                      fill="none"
                      stroke="hsl(var(--warning))"
                      strokeWidth="2.5"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    />

                    {/* Points */}
                    {points.map((p) => {
                      const active = p.year === exp;
                      return (
                        <g key={p.year}>
                          <circle cx={xScale(p.year)} cy={yScale(p.talento)} r={active ? 6 : 3.5}
                            fill="hsl(var(--warning))" stroke="hsl(var(--card))" strokeWidth={active ? 2 : 0} />
                          {active && (
                            <g>
                              <line x1={xScale(p.year)} x2={xScale(p.year)} y1={PAD} y2={H - PAD}
                                stroke="hsl(var(--warning))" strokeOpacity="0.4" strokeDasharray="2 3" />
                              <rect x={xScale(p.year) - 42} y={yScale(p.talento) - 32} width="84" height="22"
                                rx="6" fill="hsl(var(--warning))" />
                              <text x={xScale(p.year)} y={yScale(p.talento) - 17} textAnchor="middle"
                                fill="white" fontSize="11" fontWeight="700">
                                {formatINR(p.talento)}
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })}

                    {/* X labels */}
                    {points.map(p => (
                      <text key={`x-${p.year}`} x={xScale(p.year)} y={H - 4} textAnchor="middle"
                        fill="hsl(var(--muted-foreground))" fontSize="10">{p.year}y</text>
                    ))}
                  </svg>
                </div>
              </div>
            </div>


            {/* CTA */}
            <div className="mt-8 rounded-2xl border border-warning/40 bg-gradient-to-r from-warning/15 via-warning/5 to-transparent p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-warning/20 text-warning flex items-center justify-center shrink-0">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-lg md:text-xl font-bold mb-0.5 text-foreground">
                    Want to earn <span className="text-warning">even more</span>?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Take the Talento Verified Assessment and unlock premium offers from top employers actively hiring verified talent.
                  </p>
                </div>
              </div>
              <Button asChild size="lg" className="bg-warning text-warning-foreground hover:bg-warning/90 rounded-xl gap-2 shrink-0">
                <Link to="/assessments">
                  Take the Assessment <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className={cn("rounded-xl border border-border bg-card p-3 shadow-sm")}>
    <div className="text-base md:text-lg font-bold font-display text-foreground">{value}</div>
    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">{label}</div>
  </div>
);


const LegendDot = ({ color, label }: { color: string; label: string }) => (
  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
    <span className="h-2 w-2 rounded-full" style={{ background: color }} />
    {label}
  </span>
);

export default SalaryInsightsSection;
