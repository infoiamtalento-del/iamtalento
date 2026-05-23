import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, FileText, Sparkles, CheckCircle2, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import SectionBadge from "@/components/ui/section-badge";

const profileSlides = [
  {
    title: "Build Your Professional Identity",
    description: "Showcase your skills, experience and career aspirations in a profile recruiters trust.",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80",
  },
  {
    title: "Highlight Your Achievements",
    description: "Add certifications, projects, and verified credentials to stand out.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
  },
  {
    title: "Get Discovered by Top Employers",
    description: "Your profile is matched with companies looking for talent like you.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  },
];

const assessmentSlides = [
  {
    title: "AI-Powered Proctored Tests",
    description: "Prove your skills with secure, role-specific assessments tailored to your goal.",
    image: "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?w=800&q=80",
  },
  {
    title: "Benchmark Against Professionals",
    description: "See how you compare with real industry professionals and identify growth areas.",
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
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10 md:mb-14">
          <SectionBadge label="Get Started" icon={Sparkles} />
          <motion.h2
            className="text-3xl md:text-4xl font-bold font-display mb-3"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Your Path to<br />
            <span className="text-primary">Career Success</span>
          </motion.h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Showcase who you are and prove what you can do — all in one place.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {/* Job Profile Card — primary filled */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border bg-card text-card-foreground p-6 md:p-8 relative overflow-hidden group flex flex-col"
          >
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-primary/5 -translate-y-1/3 translate-x-1/4" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="inline-flex w-fit items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-primary text-xs font-semibold mb-4">
                <FileText className="h-3 w-3" /> Profile Builder
              </div>
              <h3 className="text-xl md:text-2xl font-bold font-display mb-2 leading-tight">
                Create Your Job Profile
              </h3>
              <p className="text-muted-foreground text-sm mb-5 max-w-sm min-h-[3em]">
                {currentProfile.description}
              </p>

              <div className="relative rounded-xl overflow-hidden border aspect-[16/10] mb-5">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={profileIndex}
                    src={currentProfile.image}
                    alt={currentProfile.title}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent" />
              </div>

              <div className="flex gap-1.5 mb-5">
                {profileSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setProfileIndex(i)}
                    aria-label={`Show slide ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      i === profileIndex ? "flex-1 bg-primary" : "w-3 bg-muted"
                    }`}
                  />
                ))}
              </div>

              <Button
                asChild
                className="mt-auto w-full bg-warning text-warning-foreground hover:bg-warning/90 gap-2 font-semibold rounded-full h-11"
              >

              <div className="flex gap-1.5 mb-5">
                {profileSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setProfileIndex(i)}
                    aria-label={`Show slide ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      i === profileIndex ? "flex-1 bg-primary-foreground" : "w-3 bg-primary-foreground/25"
                    }`}
                  />
                ))}
              </div>

              <Button
                asChild
                className="mt-auto w-full bg-warning text-warning-foreground hover:bg-warning/90 gap-2 font-semibold rounded-full h-11"
              >
                <Link to="/profile">
                  Create Your Profile <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Skill Assessment Card — bordered with primary accents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border bg-card p-6 md:p-8 group hover:border-primary/30 transition-colors flex flex-col"
          >
            <div className="inline-flex w-fit items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-primary text-xs font-semibold mb-4">
              <Briefcase className="h-3 w-3" /> Skill Assessment
            </div>
            <h3 className="text-xl md:text-2xl font-bold font-display mb-2 leading-tight">
              Get Your Skill Assessment
            </h3>
            <p className="text-muted-foreground text-sm mb-5 max-w-sm min-h-[3em]">
              {currentAssessment.description}
            </p>

            <div className="relative rounded-xl overflow-hidden border aspect-[16/10] mb-5">
              <AnimatePresence mode="wait">
                <motion.img
                  key={assessmentIndex}
                  src={currentAssessment.image}
                  alt={currentAssessment.title}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent" />
              <div className="absolute top-3 left-3 inline-flex items-center gap-1 bg-card/90 backdrop-blur rounded-full px-2.5 py-1 border">
                <CheckCircle2 className="h-3 w-3 text-primary" />
                <span className="text-[10px] font-bold">Verified</span>
              </div>
            </div>

            <div className="flex gap-1.5 mb-5">
              {assessmentSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setAssessmentIndex(i)}
                  aria-label={`Show slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === assessmentIndex ? "flex-1 bg-primary" : "w-3 bg-muted"
                  }`}
                />
              ))}
            </div>

            <Button
              asChild
              className="mt-auto w-full gap-2 font-semibold rounded-full h-11"
            >
              <Link to="/skill-assessment">
                Take Your Assessment <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default JobProfileAssessmentSection;
