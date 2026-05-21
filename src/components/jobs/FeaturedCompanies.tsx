import { motion } from "framer-motion";
import { Star, Briefcase, ArrowRight } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const companiesRow1 = [
  { name: "Google", logo: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png", rating: 4.5, reviews: "12.4K+", tagline: "Organize the world's information.", industry: "Software & Tech", openings: 340 },
  { name: "Microsoft", logo: "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31", rating: 4.3, reviews: "18.2K+", tagline: "Empowering every person on the planet.", industry: "Software & Tech", openings: 285 },
  { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/200px-Amazon_logo.svg.png", rating: 3.9, reviews: "27.1K+", tagline: "Work hard. Have fun. Make history.", industry: "E-commerce & Retail", openings: 520 },
  { name: "Accenture", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Accenture.svg/200px-Accenture.svg.png", rating: 4.0, reviews: "41.3K+", tagline: "Global professional services firm.", industry: "Consulting", openings: 410 },
];

const companiesRow2 = [
  { name: "TCS", logo: "https://companieslogo.com/img/orig/TCS.NS-7401f1bd.png?t=1720244494", rating: 3.8, reviews: "55K+", tagline: "Building on Belief.", industry: "IT Services", openings: 680 },
  { name: "IBM", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/200px-IBM_logo.svg.png", rating: 4.0, reviews: "15.6K+", tagline: "Let's create something that changes everything.", industry: "Software & Tech", openings: 275 },
  { name: "Cognizant", logo: "https://companieslogo.com/img/orig/CTSH-82a8444b.png?t=1720244491", rating: 3.8, reviews: "29K+", tagline: "Intuition engineered.", industry: "IT Services", openings: 445 },
  { name: "Oracle", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Oracle_logo.svg/200px-Oracle_logo.svg.png", rating: 4.1, reviews: "9.8K+", tagline: "Hardware and software, engineered to work together.", industry: "Software & Tech", openings: 230 },
];

type Company = typeof companiesRow1[number];

const CompanyCard = ({ company, delay }: { company: Company; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="rounded-xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300 group flex flex-col"
  >
    <div className="h-24 flex items-center justify-center border-b border-border/30 bg-accent/30 rounded-t-xl px-6">
      <img src={company.logo} alt={company.name} className="max-h-10 max-w-[140px] object-contain" loading="lazy" />
    </div>
    <div className="p-4 flex flex-col flex-1 items-center text-center">
      <h3 className="text-sm font-bold font-display mb-1">{company.name}</h3>
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 text-warning fill-warning" />
          <span className="text-xs font-semibold">{company.rating}</span>
        </div>
        <span className="text-[10px] text-muted-foreground">{company.reviews} reviews</span>
      </div>
      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full mb-2">
        {company.industry}
      </span>
      <p className="text-xs text-muted-foreground mb-3 line-clamp-2 flex-1">{company.tagline}</p>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-3">
        <Briefcase className="h-3.5 w-3.5 text-primary" />
        {company.openings} active openings
      </div>
      <Button variant="outline" size="sm" className="w-full text-xs border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
        View jobs
      </Button>
    </div>
  </motion.div>
);

const FeaturedCompanies = () => {
  return (
    <section className="py-16 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10">
          <SectionBadge label="Featured Employers" icon={Building2} />
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold font-display mb-3"
          >
            Featured Companies<br />
            <span className="text-primary">Actively Hiring</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto"
          >
            Top-rated employers with verified openings — find your next opportunity.
          </motion.p>
        </div>

        {/* Row 1 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {companiesRow1.map((company, i) => (
            <CompanyCard key={company.name} company={company} delay={i * 0.05} />
          ))}
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {companiesRow2.map((company, i) => (
            <CompanyCard key={company.name} company={company} delay={i * 0.05} />
          ))}
        </div>

        {/* View all */}
        <div className="text-center mt-10">
          <Link to="/jobs">
            <Button variant="outline" className="border-border gap-2">
              View all companies <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCompanies;
