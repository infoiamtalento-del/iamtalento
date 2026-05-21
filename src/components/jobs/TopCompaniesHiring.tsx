import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Briefcase } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";
import { Building2 } from "lucide-react";

const companies = [
{ name: "Google", logo: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png", industry: "Software & Tech", openings: 340 },
{ name: "Microsoft", logo: "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31", industry: "Software & Tech", openings: 285 },
{ name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/200px-Amazon_logo.svg.png", industry: "E-commerce", openings: 520 },
{ name: "Accenture", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Accenture.svg/200px-Accenture.svg.png", industry: "Consulting", openings: 410 },
{ name: "TCS", logo: "https://companieslogo.com/img/orig/TCS.NS-7401f1bd.png?t=1720244494", industry: "IT Services", openings: 680 },
{ name: "Infosys", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Infosys_logo.svg/200px-Infosys_logo.svg.png", industry: "IT Services", openings: 390 },
{ name: "Deloitte", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Deloitte.svg/200px-Deloitte.svg.png", industry: "Consulting", openings: 210 },
{ name: "Adobe", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Adobe_Corporate_Logo.png/200px-Adobe_Corporate_Logo.png", industry: "Software & Tech", openings: 155 },
{ name: "SAP", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/SAP_2011_logo.svg/200px-SAP_2011_logo.svg.png", industry: "Software & Tech", openings: 195 },
{ name: "Wipro", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Wipro_Primary_Logo_Color_RGB.svg/200px-Wipro_Primary_Logo_Color_RGB.svg.png", industry: "IT Services", openings: 310 }];


const TopCompaniesHiring = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
    setTimeout(checkScroll, 350);
  };

  return (
    <section className="py-16 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-8">
          <SectionBadge label="Top Employers" icon={Building2} />
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold font-display mb-3">

            Top Companies<br />
            <span className="text-primary">Hiring Freshers </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">

            Explore opportunities at leading companies actively hiring on our platform.
          </motion.p>
        </div>


        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>

          {companies.map((company, i) =>
          <motion.div
            key={company.name}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="min-w-[180px] md:min-w-[200px] p-5 rounded-xl bg-card border-2 border-border hover:border-primary/30 shadow-sm hover:shadow-lg transition-all duration-300 shrink-0 cursor-pointer group flex flex-col items-center text-center">

              <div className="h-14 w-full flex items-center justify-center mb-3">
                <img
                src={company.logo}
                alt={company.name}
                className="max-h-10 max-w-[120px] object-contain"
                loading="lazy" />

              </div>
              <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full mb-2">
                {company.industry}
              </span>
              <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                <Briefcase className="h-3 w-3 text-primary" />
                {company.openings} openings
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

};

export default TopCompaniesHiring;