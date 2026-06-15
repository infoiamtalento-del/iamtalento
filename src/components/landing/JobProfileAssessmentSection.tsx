import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, FileText, Sparkles, CheckCircle2, Play, Search } from "lucide-react";
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

const jobsSlides = [
  {
    title: "Discover Roles That Match You",
    description: "Browse 100+ open jobs from top employers actively hiring verified talent.",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80",
  },
  {
    title: "Apply With Your Verified Profile",
    description: "Stand out with a credible profile and skill-backed proof employers trust.",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80",
  },
  {
    title: "Get Hired Faster",
    description: "Skip the noise — get matched directly with relevant opportunities.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
  },
];

const JobProfileAssessmentSection = () => {
  const [profileIndex, setProfileIndex] = useState(0);
  const [assessmentIndex, setAssessmentIndex] = useState(0);
  const [jobsIndex, setJobsIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setProfileIndex((i) => (i + 1) % profileSlides.length);
      setAssessmentIndex((i) => (i + 1) % assessmentSlides.length);
      setJobsIndex((i) => (i + 1) % jobsSlides.length);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  const currentProfile = profileSlides[profileIndex];
  const currentAssessment = assessmentSlides[assessmentIndex];
  const currentJobs = jobsSlides[jobsIndex];

  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 md:px-6 max-w-[1600px]">
        <div className="text-center mb-10 md:mb-14">
          <SectionBadge label="Get Verified. Get Hired" icon={Sparkles} />
          <motion.h2
            className="text-3xl md:text-4xl font-bold font-display mb-3"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            The Future of<br />
            <span className="text-primary">Hiring is Here</span>
          </motion.h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Showcase your skills, validate your expertise, and connect with employers who hire based on proven capabilities—not just resumes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1400px] mx-auto">
          {/* Job Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group relative bg-card rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border transition-all duration-300 hover:shadow-[0_20px_50px_rgba(245,158,11,0.12)] hover:-translate-y-1 flex flex-col aspect-square"
          >
            <div className="mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-warning/10 text-warning text-[10px] font-semibold tracking-wide uppercase">
                <FileText className="h-3 w-3" />
                Profile Builder
              </span>
            </div>

            <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-muted transition-transform duration-500 group-hover:scale-[1.02]">
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
              <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-xl pointer-events-none" />
            </div>

            <h3 className="text-base font-bold font-display text-foreground mb-1.5 leading-tight">
              Create Your Job Profile
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              Build a recruiter-ready profile in minutes — showcase skills, projects, and verified credentials.
            </p>

            <div className="mt-auto">
              <div className="flex gap-1 mb-3">
                {profileSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setProfileIndex(i)}
                    aria-label={`Show slide ${i + 1}`}
                    className={`h-1 rounded-full transition-all ${
                      i === profileIndex ? "w-6 bg-warning" : "w-1 bg-muted"
                    }`}
                  />
                ))}
              </div>

              <Button
                asChild
                className="w-full py-2.5 h-auto px-4 rounded-lg bg-warning hover:bg-warning/90 text-warning-foreground font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-2 shadow-md shadow-warning/20 active:scale-[0.98]"
              >
                <Link to="/profile">
                  Create Your Profile <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Skill Assessment Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group relative bg-card rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border transition-all duration-300 hover:shadow-[0_20px_50px_hsl(var(--primary)/0.12)] hover:-translate-y-1 flex flex-col aspect-square"
          >
            <div className="mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold tracking-wide uppercase">
                <Briefcase className="h-3 w-3" />
                Skill Assessment
              </span>
            </div>

            <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-muted transition-transform duration-500 group-hover:scale-[1.02]">
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
              <div className="absolute top-2 left-2">
                <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-card/95 backdrop-blur shadow-sm text-[9px] font-bold text-emerald-600 uppercase tracking-wider border border-white/50">
                  <CheckCircle2 className="h-2.5 w-2.5" />
                  Verified
                </span>
              </div>
              <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-xl pointer-events-none" />
            </div>

            <h3 className="text-base font-bold font-display text-foreground mb-1.5 leading-tight">
              Get Your Skill Assessment
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              Take AI-proctored tests, benchmark against pros, and earn verified, employer-trusted certifications.
            </p>

            <div className="mt-auto">
              <div className="flex gap-1 mb-3">
                {assessmentSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setAssessmentIndex(i)}
                    aria-label={`Show slide ${i + 1}`}
                    className={`h-1 rounded-full transition-all ${
                      i === assessmentIndex ? "w-6 bg-primary" : "w-1 bg-muted"
                    }`}
                  />
                ))}
              </div>

              <Button
                asChild
                className="w-full py-2.5 h-auto px-4 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-2 shadow-md shadow-primary/20 active:scale-[0.98]"
              >
                <Link to="/skill-assessment">
                  Take Your Assessment <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Browse Jobs Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="group relative bg-card rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border transition-all duration-300 hover:shadow-[0_20px_50px_hsl(var(--primary)/0.12)] hover:-translate-y-1 flex flex-col aspect-square"
          >
            <div className="mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-yellow-400/15 text-yellow-600 text-[10px] font-semibold tracking-wide uppercase">
                <Search className="h-3 w-3" />
                Browse Jobs
              </span>
            </div>

            <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-muted transition-transform duration-500 group-hover:scale-[1.02]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={jobsIndex}
                  src={currentJobs.image}
                  alt={currentJobs.title}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-xl pointer-events-none" />
            </div>

            <h3 className="text-base font-bold font-display text-foreground mb-1.5 leading-tight">
              Apply 100+ Jobs In One Click
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              Get matched with top employers actively hiring verified talent — apply faster, get hired sooner.
            </p>

            <div className="mt-auto">
              <div className="flex gap-1 mb-3">
                {jobsSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setJobsIndex(i)}
                    aria-label={`Show slide ${i + 1}`}
                    className={`h-1 rounded-full transition-all ${
                      i === jobsIndex ? "w-6 bg-yellow-400" : "w-1 bg-muted"
                    }`}
                  />
                ))}
              </div>

              <Button
                asChild
                className="w-full py-2.5 h-auto px-4 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-2 shadow-md shadow-yellow-400/20 active:scale-[0.98]"
              >
                <Link to="/jobs">
                  Browse Jobs <ArrowRight className="h-3.5 w-3.5" />
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
