import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import LearningHeroSection from "@/components/learning/LearningHeroSection";

import CoursePerksSection from "@/components/learning/CoursePerksSection";
import PricingBannerSection from "@/components/learning/PricingBannerSection";
import TrendingCoursesSection from "@/components/learning/TrendingCoursesSection";
import WhyChooseLearningSection from "@/components/learning/WhyChooseLearningSection";

import LearnerStoriesSection from "@/components/learning/LearnerStoriesSection";
import GetCertifiedSection from "@/components/learning/GetCertifiedSection";


import LearnInLanguageSection from "@/components/learning/LearnInLanguageSection";
import MasterclassesSection from "@/components/learning/MasterclassesSection";
import HandsOnProjectsSection from "@/components/learning/HandsOnProjectsSection";
import GrowthTrackerSection from "@/components/learning/GrowthTrackerSection";
import CertificatesSection from "@/components/learning/CertificatesSection";
import ResumeStrengthSection from "@/components/learning/ResumeStrengthSection";
import LearningCTASection from "@/components/learning/LearningCTASection";
import ExpertCoursesSection from "@/components/learning/ExpertCoursesSection";

const Learning = () => (
  <>
    <Helmet>
      <title>Learning | I Am Talento</title>
      <meta name="description" content="AI-powered courses built for the real world. Learn skills that get you hired with personalized learning roadmaps, verified certificates, and real-world projects." />
    </Helmet>
    <Layout>
      <LearningHeroSection />
      <LearnInLanguageSection />
      <WhyChooseLearningSection />
      <TrendingCoursesSection />
      <ExpertCoursesSection />
      <PricingBannerSection />
      <HandsOnProjectsSection />
      <CoursePerksSection />
      
      <GrowthTrackerSection />
      <LearnerStoriesSection />
      <GetCertifiedSection />

      <MasterclassesSection />
      <CertificatesSection />
      <ResumeStrengthSection />
      <LearningCTASection />
    </Layout>
  </>
);

export default Learning;
