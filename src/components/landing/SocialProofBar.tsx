import { motion } from "framer-motion";
import { Star, Building2 } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

const companyLogos = [
  { name: "Google", logo: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" },
  { name: "Microsoft", logo: "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31" },
  { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/200px-Amazon_logo.svg.png" },
  { name: "Accenture", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Accenture.svg/200px-Accenture.svg.png" },
  { name: "IBM", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/200px-IBM_logo.svg.png" },
  { name: "Oracle", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Oracle_logo.svg/200px-Oracle_logo.svg.png" },
  { name: "Infosys", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Infosys_logo.svg/200px-Infosys_logo.svg.png" },
  { name: "TCS", logo: "https://companieslogo.com/img/orig/TCS.NS-7401f1bd.png?t=1720244494" },
  { name: "Capgemini", logo: "https://companieslogo.com/img/orig/CAP.PA-9b4110b0.png?t=1720244491" },
  
  { name: "Wipro", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Wipro_Primary_Logo_Color_RGB.svg/200px-Wipro_Primary_Logo_Color_RGB.svg.png" },
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
              className="max-h-7 md:max-h-10 max-w-full object-contain dark:brightness-0 dark:invert"
              loading="lazy"
            />
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default SocialProofBar;
