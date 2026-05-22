import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/landing/HeroSection";
import SocialProofBar from "@/components/landing/SocialProofBar";
import GapSection from "@/components/landing/GapSection";
import IndustryReadinessSection from "@/components/landing/IndustryReadinessSection";
import TrustAuthoritySection from "@/components/landing/TrustAuthoritySection";
import AssessmentIntegritySection from "@/components/landing/AssessmentIntegritySection";
import VideoSection from "@/components/landing/VideoSection";

import SkillCategoriesSection from "@/components/landing/SkillCategoriesSection";
import PlatformFeaturesSection from "@/components/landing/PlatformFeaturesSection";
import WhoIsItForSection from "@/components/landing/WhoIsItForSection";
import ComplianceSection from "@/components/landing/ComplianceSection";
import CTASection from "@/components/landing/CTASection";
import CandidateJourneySection from "@/components/landing/CandidateJourneySection";
import ReviewsMarquee from "@/components/landing/ReviewsMarquee";
import WebinarScheduleSection from "@/components/webinars/WebinarScheduleSection";

const Index = () => (
  <>
    <Helmet>
      <title>IAmTalento — AI-Powered Industry Readiness & Skill Intelligence Platform</title>
      <meta name="description" content="Measure your Industry Readiness Score. Benchmark against real professionals. Role-specific assessments, verified certifications, and AI-powered job matching." />
      <meta property="og:title" content="IAmTalento — You Don't Lack Talent. You Lack Proof." />
      <meta property="og:description" content="AI-powered Industry Readiness Score, secure proctored assessments, verified certifications, and smarter job matching." />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="IAmTalento — AI Industry Readiness Platform" />
      <meta name="twitter:description" content="Measure your Industry Readiness. Benchmark against real professionals. Improve with precision." />
    </Helmet>
    <Layout>
      <HeroSection />
      <SocialProofBar />
      <GapSection />
      <CandidateJourneySection />
      <IndustryReadinessSection />
      <TrustAuthoritySection />
      <AssessmentIntegritySection />
      
      <VideoSection />
      <PlatformFeaturesSection />
      <WhoIsItForSection />
      <SkillCategoriesSection />
      <ReviewsMarquee />
      <ComplianceSection />
      <WebinarScheduleSection />
      <CTASection />
    </Layout>
  </>
);

export default Index;
