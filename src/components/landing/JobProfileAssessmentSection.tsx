import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import SectionBadge from "@/components/ui/section-badge";

const profileSlides = [
  {
    title: "Build Your Professional Identity",
    description: "Showcase your skills, experience and career aspirations in a profile that recruiters trust.",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80",
  },
  {
    title: "Highlight Your Achievements",
    description: "Add certifications, projects, and verified credentials to stand out from the crowd.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
  },
  {
    title: "Get Discovered by Top Employers",
    description: "Your profile is matched with companies looking for talent exactly like you.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  },
];

const assessmentSlides = [
  {
    title: "AI-Powered Proctored Tests",
    description: "Prove your skills with secure, role-specific assessments tailored to your target job.",
    image: "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?w=800&q=80",
  },
  {
    title: "Benchmark Against Professionals",
    description: "See how you compare with real industry professionals and identify your growth areas.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
  },
  {
    title: "Earn Verified Certifications",
    description: "Get industry-recognized certificates that employers trust and value.",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
  },
];

const JobProfileAssessmentSection = () => {
  const [profileIndex, setProfileIndex] = useState(0);
  const [assessmentIndex, setAssessmentIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setProfileIndex((i) => (i + 1) % profileSlides.length);
      setAssessmentIndex((i) => (i + 1) % assessmentSlides.length);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  const currentProfile = profileSlides[profileIndex];
  const currentAssessment = assessmentSlides[assessmentIndex];

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <SectionBadge label="Get Started" icon={Briefcase} />
          <motion.h2
            className="text-3xl md:text-4xl font-bold font-display mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Your Path to <span className="text-primary">Career Success</span>
          </motion.h2>
          <p className="text-muted-foreground text-lg">
            Showcase who you are and prove what you can do — all in one place.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Job Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.96 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="bg-card border border-border/50 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="aspect-[16/10] relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={profileIndex}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <img
                    src={currentProfile.image}
                    alt={currentProfile.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                </motion.div>
              </AnimatePresence>

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold font-display">Create Your Job Profile</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  {currentProfile.description}
                </p>
              </div>
            </div>

            <div className="p-5 pt-3 flex flex-col gap-4">
              <div className="flex gap-1.5">
                {profileSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setProfileIndex(i)}
                    aria-label={`Show step ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      i === profileIndex ? "flex-1 bg-primary" : "w-3 bg-muted-foreground/20"
                    }`}
                  />
                ))}
              </div>

              <Button asChild size="lg" variant="outline" className="w-full h-11 gap-2">
                <Link to="/profile">
                  <FileText className="h-4 w-4" /> Create Your Job Profile
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Skill Assessment Card */}
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.96 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="bg-card border border-border/50 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="aspect-[16/10] relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={assessmentIndex}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <img
                    src={currentAssessment.image}
                    alt={currentAssessment.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                </motion.div>
              </AnimatePresence>

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Briefcase className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold font-display">Get Your Skill Assessment</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  {currentAssessment.description}
                </p>
              </div>
            </div>

            <div className="p-5 pt-3 flex flex-col gap-4">
              <div className="flex gap-1.5">
                {assessmentSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setAssessmentIndex(i)}
                    aria-label={`Show step ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      i === assessmentIndex ? "flex-1 bg-primary" : "w-3 bg-muted-foreground/20"
                    }`}
                  />
                ))}
              </div>

              <Button asChild size="lg" className="w-full h-11 gap-2">
                <Link to="/skill-assessment">
                  <Briefcase className="h-4 w-4" /> Take Your Skill Assessment
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default JobProfileAssessmentSection;
