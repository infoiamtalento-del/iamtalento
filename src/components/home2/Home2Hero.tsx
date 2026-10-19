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
    <section className="h2-hero">
      <div className="h2-shell h2-hero-grid">
        <div className="h2-hero-copy">
          <span className="h2-eyebrow">SKILLS-FIRST RECRUITING & READINESS PLATFORM</span>
          <h1>
            India's Next Big Leap in Hiring Starts Here.
            <em>Learning. Skill Assessments. Job Hunt. All Connected.</em>
          </h1>
          <p className="h2-hero-lede">
            Talent CIR is building India's next-generation talent ecosystem—bringing learning, AI-powered skill
            assessments, and career opportunities together on one platform.
          </p>


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

        <div className="h2-hero-wheel-col flex justify-center">
          <SkillWheel portrait={photos.portraitRahul} portraitAlt="Rahul Sharma, Verified Full-Stack Developer" />
        </div>
      </div>
    </section>
  </div>
);

export default Home2Hero;
