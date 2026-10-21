import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  FileBarChart2,
  Lock,
  Play,
  ShieldCheck,
  Star,
  Timer,
  TrendingUp,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from "lucide-react";

import { siteLogo } from "@/assets/logo";
import Header from "@/components/home2/Header";
import Home2Hero from "@/components/home2/Home2Hero";
import {
  benefits,
  cirInside,
  compliance,
  employers,
  expectations,
  footerColumns,
  freeFeaturesVisual,
  hackathonHero,
  hackathonPartners,
  logoWall,
  photos,
  prizes,
  questionOptions,
  readinessPoints,
  readinessScores,
  reviews,
  stats,
  transformations,
  trustStrip,
} from "@/components/home2/data";
import "@/components/home2/home2.css";

const Home2 = () => {
  const [activeReviewTab, setActiveReviewTab] = useState<"Employers" | "Candidates">("Candidates");
  const [activeTransformation, setActiveTransformation] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(1);

  const filteredReviews = reviews.filter((r) => r.group === activeReviewTab);
  const currentTransformation = transformations[activeTransformation] || transformations[0];

  return (
    <div className="h2-root">
      <Helmet>
        <title>IAmTalento - Skills-First Hiring & Industry Readiness Platform</title>
        <meta
          name="description"
          content="Measure your Industry Readiness Score, benchmark against top talent, and get discovered by leading employers with verified, proctored assessments."
        />
      </Helmet>

      {/* Header */}
      <Header />

      {/* Trust Strip */}
      <section className="h2-trust" aria-label="Key platform metrics">
        <div className="h2-shell h2-trust-inner">
          {trustStrip.map((item, idx) => (
            <div key={idx} className="h2-trust-item">
              <span className="h2-trust-badge">
                <Check size={16} strokeWidth={3} />
              </span>
              <span>
                <strong>{item.value}</strong> {item.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Hero Section */}
      <Home2Hero />

      {/* Trusted By & Logos */}
      <section className="h2-trusted">
        <div className="h2-shell">
          <span className="h2-eyebrow text-center block">TRUSTED BY INDUSTRY LEADERS &amp; FORTUNE 500 COMPANIES</span>

          <div className="h2-logos">
            <div className="h2-logo-row">
              {logoWall.slice(0, 6).map((c) => (
                <div key={c.name} className="h2-logo-cell" title={c.name}>
                  <img src={c.src} alt={c.name} loading="lazy" />
                </div>
              ))}
            </div>
            <div className="h2-logo-row">
              {logoWall.slice(6, 12).map((c) => (
                <div key={c.name} className="h2-logo-cell" title={c.name}>
                  <img src={c.src} alt={c.name} loading="lazy" />
                </div>
              ))}
            </div>
          </div>

          <div className="h2-stats">
            {stats.map((st, i) => {
              const Icon = st.icon;
              return (
                <div key={i} className="h2-stat">
                  <div className="h2-stat-icon">
                    <Icon size={24} className="h2-red" />
                  </div>
                  <div>
                    <strong className="block text-3xl font-display font-semibold text-foreground">{st.value}</strong>
                    <div className="font-semibold text-sm">{st.label}</div>
                    <p className="text-xs text-muted-foreground mt-1">{st.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dark Readiness Section */}
      <section className="h2-dark">
        <div className="h2-shell h2-dark-grid">
          <div>
            <span className="h2-eyebrow">AI-POWERED ACCURACY</span>
            <h2 className="h2-big">
              Readiness Scores That <em>Employers Trust.</em>
            </h2>
            <p className="h2-dark-sub">
              Our 30-layer AI proctoring and calibrated competency benchmarks evaluate true job readiness, not just test scores.
            </p>
          </div>

          <div>
            <ul className="h2-rows">
              {readinessPoints.map((point, index) => (
                <li key={index}>
                  <span>0{index + 1}</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="h2-portrait-col">
            <div className="h2-portrait">
              <img src={photos.portraitPriya} alt="Priya Nair - Ready for hire" />
              <div className="h2-wheel-score" style={{ position: "absolute", bottom: -12, right: -12 }}>
                <b>88</b>
                <div>
                  <small>Verified score</small>
                  <span>Top 5% Talent</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Grid / Free Benefits */}
      <section className="h2-platform py-20">
        <div className="h2-shell">
          <div className="text-center max-w-2xl mx-auto">
            <span className="h2-eyebrow">WHAT YOU GET WITH TALENTO</span>
            <h2 className="text-3xl md:text-5xl font-display font-normal mt-3">
              Tools to Accelerate <em>Your Tech Career</em>
            </h2>
            <p className="text-muted-foreground mt-4 text-base">
              Everything you need to prove your expertise, optimize your resume, and connect with verified employers.
            </p>
          </div>

          <div className="h2-cards">
            {benefits.map((b, idx) => (
              <div key={idx} className="h2-card">
                <span className="h2-card-no">0{idx + 1}</span>
                <h3>{b.title}</h3>
                <p>{b.text}</p>
                <Link to={b.href} className="h2-link">
                  Explore feature <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Intelligence Report Preview */}
      <section className="h2-report py-20">
        <div className="h2-shell h2-report-grid">
          <div>
            <span className="h2-eyebrow">PROPRIETARY CIR ASSESSMENT</span>
            <h2 className="h2-big">
              Career Intelligence <em>Report (CIR)</em>
            </h2>
            <p className="h2-lede">
              A comprehensive 15-page diagnostic of your technical skills, domain strengths, salary potential, and personalized learning roadmap.
            </p>

            <ul className="mt-8 space-y-3">
              {cirInside.slice(0, 4).map((c, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check size={18} className="text-primary mt-1 flex-shrink-0" />
                  <div>
                    <strong className="text-sm font-semibold">{c.title}</strong>
                    <p className="text-xs text-muted-foreground">{c.text}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex gap-4">
              <Link to="/assessments" className="h2-btn h2-btn-primary">
                View Sample Report <FileBarChart2 size={16} />
              </Link>
            </div>
          </div>

          <div>
            <div className="h2-window">
              <div className="h2-window-bar">
                <div className="flex items-center gap-2">
                  <img src={siteLogo.url} alt="IAmTalento" className="h-6 w-auto" />
                  <small>Assessment Simulator</small>
                </div>
                <div className="h2-timer">
                  <Timer size={14} /> 14:32 remaining
                </div>
              </div>

              <div className="p-6">
                <span className="text-xs uppercase tracking-wider font-semibold text-primary">Question 4 of 30</span>
                <h4 className="text-lg font-medium mt-2">
                  Which data structure provides constant-time average case lookup and insertion?
                </h4>

                <div className="mt-6 space-y-2">
                  {questionOptions.map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedAnswer(i)}
                      className={`w-full text-left p-3.5 rounded-xl border text-sm flex items-center justify-between transition-all ${
                        selectedAnswer === i
                          ? "border-primary bg-primary/5 text-primary font-medium"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <span>{opt}</span>
                      {selectedAnswer === i && <Check size={16} className="text-primary" />}
                    </button>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Lock size={12} className="text-emerald-600" /> Proctored Screen &amp; Audio active
                  </span>
                  <span className="text-primary font-medium">Auto-saves on selection</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Red Transformation Band */}
      <section className="h2-band">
        <div className="h2-shell">
          <div className="h2-band-head">
            <div>
              <span className="h2-eyebrow">REAL CAREER GROWTH</span>
              <h2 className="h2-big">From Screened to Promoted.</h2>
              <p className="h2-band-sub">
                See how engineers and marketers unlocked 100%+ salary increases through verified benchmark credentials.
              </p>
            </div>

            <div className="hidden lg:flex gap-2">
              {transformations.map((t, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveTransformation(i)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    activeTransformation === i ? "bg-white text-primary" : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <div className="h2-panel mt-12 p-8 grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center border-r md:pr-8">
              <img
                src={currentTransformation.photo}
                alt={currentTransformation.name}
                className="w-28 h-28 rounded-full object-cover shadow-lg border-4 border-primary/20"
              />
              <h3 className="font-display text-xl font-semibold mt-4">{currentTransformation.name}</h3>
              <p className="text-sm text-muted-foreground">{currentTransformation.role}</p>
              <div className="mt-4 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-200">
                {currentTransformation.gain} Compensation Jump
              </div>
            </div>

            <div className="md:col-span-2 flex flex-col justify-center">
              <div className="grid grid-cols-2 gap-6 bg-muted/40 p-6 rounded-2xl border">
                <div>
                  <small className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Previous CTC ({currentTransformation.from})</small>
                  <div className="text-2xl font-display font-semibold text-muted-foreground mt-1">{currentTransformation.before}</div>
                </div>
                <div>
                  <small className="text-xs uppercase tracking-wider text-primary font-semibold">New Verified CTC</small>
                  <div className="text-3xl font-display font-semibold text-primary mt-1">{currentTransformation.after}</div>
                </div>
              </div>

              <p className="mt-6 text-sm text-foreground/80 leading-relaxed italic">
                "The CIR benchmark gave me the exact leverage needed during recruiter discussions. Rather than negotiating endlessly, the verified skill score proved my readiness upfront."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Employers */}
      <section className="h2-employers py-20">
        <div className="h2-shell">
          <div className="text-center max-w-2xl mx-auto">
            <span className="h2-eyebrow">NOW HIRING ON TALENTO</span>
            <h2 className="text-3xl md:text-5xl font-display font-normal mt-3">
              Top Companies Hiring <em>Directly</em>
            </h2>
            <p className="text-muted-foreground mt-4 text-base">
              Verified test scores grant direct interview pipeline access at leading tech companies.
            </p>
          </div>

          <div className="h2-emp-grid">
            {employers.map((emp) => (
              <div key={emp.name} className="h2-emp">
                <div className="h2-emp-logo">
                  <img src={emp.logo} alt={emp.name} />
                </div>
                <h3>
                  {emp.name}
                  <span>
                    <Star size={13} /> {emp.rating}
                  </span>
                </h3>
                <div className="h2-emp-meta">{emp.industry} · {emp.reviews} reviews</div>
                <p>{emp.tagline}</p>
                <div className="h2-emp-foot">
                  <span className="h2-emp-open">
                    <b>{emp.openings}</b> open roles
                  </span>
                  <Link to="/jobs" className="h2-link">
                    Apply <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hackathons / Code Arena */}
      <section className="h2-hack py-20">
        <div className="h2-shell">
          <div className="h2-hack-top">
            <div className="h2-hack-intro">
              <span className="h2-eyebrow">CODE ARENA SEASON 4</span>
              <h3 className="mt-3">Compete. Build. Win. Get Hired.</h3>
              <p className="text-muted-foreground text-sm mt-4">
                National level engineering competitions judged by engineering leaders from Google, Amazon &amp; Microsoft.
              </p>
              <div className="mt-8">
                <Link to="/hackathons" className="h2-btn h2-btn-primary">
                  Register for Season 4 <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            <div className="p-8 flex flex-col justify-center">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-primary mb-4">Season Prizes &amp; Fast-Track Passes</h4>
              <div className="space-y-3">
                {prizes.slice(0, 3).map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-3.5 rounded-xl border bg-white">
                    <div>
                      <strong className="block text-sm font-semibold">{p.label}</strong>
                      <span className="text-xs text-muted-foreground">{p.extra}</span>
                    </div>
                    <span className="font-display font-semibold text-primary">{p.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="h2-reviews py-20">
        <div className="h2-shell">
          <div className="text-center max-w-2xl mx-auto">
            <span className="h2-eyebrow">COMMUNITY VOICES</span>
            <h2 className="text-3xl md:text-5xl font-display font-normal mt-3">
              What Leaders &amp; Candidates <em>Say</em>
            </h2>

            <div className="h2-tabs">
              <button
                type="button"
                aria-selected={activeReviewTab === "Candidates"}
                onClick={() => setActiveReviewTab("Candidates")}
              >
                Candidates
              </button>
              <button
                type="button"
                aria-selected={activeReviewTab === "Employers"}
                onClick={() => setActiveReviewTab("Employers")}
              >
                Employers
              </button>
            </div>
          </div>

          <div className="h2-review-grid">
            {filteredReviews.map((r, idx) => (
              <div key={idx} className="h2-review">
                <div className="h2-stars">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} size={15} />
                  ))}
                </div>
                <blockquote>"{r.quote}"</blockquote>
                <footer>
                  <img src={r.photo} alt={r.name} />
                  <div>
                    <b>{r.name}</b>
                    <span>{r.role}</span>
                  </div>
                </footer>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="h2-final">
        <div className="h2-shell h2-final-grid">
          <div>
            <span className="h2-eyebrow">YOUR NEXT CAREER STEP</span>
            <h2>
              Ready to Prove Your <em>Industry Readiness?</em>
            </h2>
            <p className="h2-final-lede">
              Join over 50,000+ engineers, product managers, and growth specialists showcasing their verified potential on IAmTalento.
            </p>

            <div className="h2-final-actions">
              <Link to="/assessments/explore" className="h2-btn h2-btn-primary">
                Take Assessment Now <ArrowRight size={16} />
              </Link>
              <Link to="/for-employers" className="h2-btn h2-btn-ghost">
                Hire Verified Talent
              </Link>
            </div>

            <div className="h2-expect">
              <b>What You'll Achieve:</b>
              <ul>
                {expectations.map((exp, i) => (
                  <li key={i}>
                    <Check size={18} />
                    <span>{exp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="h2-final-visual">
            <div className="h2-photo">
              <img src={photos.expert1} alt="Verified Career Excellence" />
            </div>

            <div className="h2-final-badges">
              <b>Enterprise Trust &amp; Standards</b>
              <ul>
                {compliance.map((c, i) => (
                  <li key={i}>
                    <ShieldCheck size={13} /> {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="h2-footer">
        <div className="h2-shell">
          <div className="h2-footer-grid">
            <div className="h2-footer-brand">
              <Link to="/home-2">
                <img src={siteLogo.url} alt="IAmTalento" />
              </Link>
              <p>
                India's skills-first career platform. Verified readiness scores, proctored talent assessments, and direct hiring pipelines.
              </p>
              <div className="h2-social">
                <a href="#" aria-label="LinkedIn"><Linkedin size={18} /></a>
                <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
                <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
                <a href="#" aria-label="YouTube"><Youtube size={18} /></a>
              </div>
            </div>

            {footerColumns.map((col, idx) => (
              <div key={idx}>
                <h4>{col.title}</h4>
                <ul>
                  {col.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <Link to={link.href}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="h2-footer-bottom">
            <span>© {new Date().getFullYear()} IAmTalento. All rights reserved.</span>
            <span>Skills-First · Proctored &amp; Verified · AI-Driven</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home2;
