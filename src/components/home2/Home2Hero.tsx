import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SkillWheel from "./SkillWheel";
import { heroBenefits, photos } from "./data";
import "./home2.css";

/**
 * The Home 2 hero, packaged so it can live on other pages.
 * Wrapped in `.h2-root` because the h2-* styles hang their colour
 * variables off that class.
 */
const Home2Hero = () => (
  <div className="h2-root">
    <section
      className="h2-hero !overflow-visible"
      style={{
        paddingTop: "clamp(120px, 12vw, 168px)",
        paddingBottom: "clamp(60px, 6vw, 96px)",
        overflow: "visible",
      }}
    >
      <div className="h2-shell h2-hero-grid items-center">
        <div className="h2-hero-copy">
          <span className="h2-eyebrow">A NEW ERA OF HIRING TALENTS</span>
          <h1>
            India's Next Big Leap
            <span className="h2-hero-accent">in Hiring Starts Here.</span>
            <em>Learning. Skill Assessments. Job Hunt. All Connected.</em>
          </h1>
          <p className="h2-hero-lede">
            Talent CIR is building India's next-generation talent ecosystem—bringing learning, AI-powered skill
            assessments, and Talent Hunt together on one platform.
          </p>

          <div className="h2-hero-actions">
            <Link to="/assessments/explore" className="h2-btn h2-btn-primary">
              Take Free Assessment
              <ArrowRight />
            </Link>
            <Link to="/jobs" className="h2-btn h2-btn-ghost">
              Browse 5,00,000+ Jobs
            </Link>
          </div>

          <p className="h2-hero-trust">
            Over <span>10,000+ candidates screened</span> and <span>500+ top employers</span> hiring on verified competency.
          </p>

          <ul className="h2-hero-chips">
            {heroBenefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <li key={i}>
                  <Icon size={20} className="h2-red" />
                  <div>
                    <strong className="block text-sm font-semibold">{b.title}</strong>
                    <span className="text-xs text-muted-foreground">{b.sub}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="h2-hero-wheel-col flex justify-center overflow-visible">
          <div className="w-full max-w-[520px] [&_.h2-wheel]:my-0 [&_.h2-wheel]:overflow-visible">
            <SkillWheel portrait={photos.portraitRahul} portraitAlt="Rahul Sharma, Verified Full-Stack Developer" />
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default Home2Hero;
