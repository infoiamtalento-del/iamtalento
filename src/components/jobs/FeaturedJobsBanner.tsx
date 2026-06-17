import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import googleLogo from "@/assets/company-logos/google.svg";
import microsoftLogo from "@/assets/company-logos/microsoft.svg";
import amazonLogo from "@/assets/company-logos/amazon.svg";
import oracleLogo from "@/assets/company-logos/oracle.svg";

const jobs = [
  { title: "Senior UI/UX Designer", company: "Google", location: "Remote", logo: googleLogo },
  { title: "Full Stack Developer", company: "Microsoft", location: "New York, NY", logo: microsoftLogo },
  { title: "Product Manager", company: "Amazon", location: "Remote", logo: amazonLogo },
  { title: "Data Scientist", company: "Oracle", location: "Bangalore, IN", logo: oracleLogo },
];

const FeaturedJobsBanner = () => {
  return (
    <section className="py-10">
      <div className="container px-4 md:px-6">
        <div className="bg-primary text-white rounded-2xl p-6 md:p-8 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold font-display text-white">Featured Jobs</h2>
              <p className="text-white/80 text-sm mt-1">Handpicked opportunities from top companies</p>
            </div>
            <Button variant="secondary" className="bg-card text-primary hover:bg-card/90 gap-2 self-start md:self-auto">
              View all jobs <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {jobs.map((job, i) => (
              <motion.div
                key={job.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl p-4 cursor-pointer transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-card flex items-center justify-center shrink-0 p-1.5">
                    <img src={job.logo} alt={job.company} className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm font-display truncate text-white">{job.title}</h3>
                    <p className="text-xs text-white/80 truncate">{job.company} · {job.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobsBanner;
