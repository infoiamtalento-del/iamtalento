import { motion } from "framer-motion";
import { Star, Building2 } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";
import googleLogo from "@/assets/company-logos/google.svg";
import microsoftLogo from "@/assets/company-logos/microsoft.svg";
import amazonLogo from "@/assets/company-logos/amazon.svg";
import accentureLogo from "@/assets/company-logos/accenture.svg";
import ibmLogo from "@/assets/company-logos/ibm.svg";
import oracleLogo from "@/assets/company-logos/oracle.svg";
import infosysLogo from "@/assets/company-logos/infosys.svg";
import tcsLogo from "@/assets/company-logos/tcs.svg";
import capgeminiLogo from "@/assets/company-logos/capgemini.svg";
import wiproLogo from "@/assets/company-logos/wipro.svg";

const companyLogos = [
  { name: "Google", logo: googleLogo },
  { name: "Microsoft", logo: microsoftLogo },
  { name: "Amazon", logo: amazonLogo },
  { name: "Accenture", logo: accentureLogo },
  { name: "IBM", logo: ibmLogo },
  { name: "Oracle", logo: oracleLogo },
  { name: "Infosys", logo: infosysLogo },
  { name: "TCS", logo: tcsLogo },
  { name: "Capgemini", logo: capgeminiLogo },
  { name: "Wipro", logo: wiproLogo },
];

const marqueeLogos = [...companyLogos, ...companyLogos];

const avatarPhotos = [
  "https://randomuser.me/api/portraits/women/23.jpg",
  "https://randomuser.me/api/portraits/men/45.jpg",
  "https://randomuser.me/api/portraits/women/56.jpg",
  "https://randomuser.me/api/portraits/men/67.jpg",
  "https://randomuser.me/api/portraits/women/78.jpg",
  "https://randomuser.me/api/portraits/men/12.jpg",
];

const SocialProofBar = () => (
  <section className="py-12 md:py-16 border-y border-border/50 bg-card/30 relative overflow-hidden">
    <div className="container px-4 md:px-6 mb-10">
      <div className="text-center mb-4">
        <SectionBadge label="Social Proof" icon={Building2} />
      </div>
      <motion.h3
        className="text-center text-xl md:text-2xl lg:text-3xl font-bold font-display tracking-tight mb-2"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Recognized by Industry Leaders
      </motion.h3>
      <motion.p
        className="text-center text-sm md:text-base text-muted-foreground mb-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        Trusted by professionals at the world's top companies
      </motion.p>

      <div className="flex flex-wrap justify-center items-center gap-6 md:gap-14 mb-10">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2.5">
            {avatarPhotos.map((src, i) => (
              <img key={i} src={src} alt="Professional" className="h-9 w-9 md:h-11 md:w-11 rounded-full border-2 border-background object-cover" />
            ))}
          </div>
          <div>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-primary fill-primary" />
              ))}
              <span className="text-sm font-bold ml-1.5">4.9</span>
            </div>
            <p className="text-xs text-muted-foreground">500K+ Profiles Assessed</p>
          </div>
        </div>

        <div className="h-10 w-px bg-border hidden sm:block" />

        <div className="text-center">
          <p className="text-xl md:text-3xl font-bold font-display">12,000+</p>
          <p className="text-xs md:text-sm text-muted-foreground">Employers Trust Us</p>
        </div>

        <div className="h-10 w-px bg-border hidden sm:block" />

        <div className="text-center">
          <p className="text-xl md:text-3xl font-bold font-display">98.5%</p>
          <p className="text-xs md:text-sm text-muted-foreground">Score Accuracy</p>
        </div>
      </div>
    </div>

    {/* Logo Marquee */}
    <div className="overflow-hidden relative mt-16">
      <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-background to-transparent z-10" />
      <motion.div
        className="flex w-max gap-10 md:gap-16 px-8 items-center"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
      >
        {marqueeLogos.map((company, i) => (
          <div
            key={i}
            className="flex items-center justify-center h-10 md:h-14 w-28 md:w-40 shrink-0 opacity-70 hover:opacity-100 transition-all duration-500"
          >
            <img
              src={company.logo}
              alt={company.name}
              className="max-h-7 md:max-h-10 max-w-full object-contain"
              loading="lazy"
            />
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default SocialProofBar;
