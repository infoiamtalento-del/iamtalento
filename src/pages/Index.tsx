import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/landing/HeroSection";
import SocialProofBar from "@/components/landing/SocialProofBar";
import IndustryReadinessSection from "@/components/landing/IndustryReadinessSection";
import TrustAuthoritySection from "@/components/landing/TrustAuthoritySection";
import VideoSection from "@/components/landing/VideoSection";

import SkillCategoriesSection from "@/components/landing/SkillCategoriesSection";
import WhoIsItForSection from "@/components/landing/WhoIsItForSection";
import ComplianceSection from "@/components/landing/ComplianceSection";
import CTASection from "@/components/landing/CTASection";
import CandidateJourneySection from "@/components/landing/CandidateJourneySection";
import ReviewsMarquee from "@/components/landing/ReviewsMarquee";
import JobProfileAssessmentSection from "@/components/landing/JobProfileAssessmentSection";
import HackathonSpotlightSection from "@/components/landing/HackathonSpotlightSection";
import FeaturedCompanies from "@/components/jobs/FeaturedCompanies";
import WebinarHowItWorksSection from "@/components/webinars/WebinarHowItWorksSection";
import HackathonSocialProof from "@/components/hackathons/HackathonSocialProof";
import CareerIntelligencePackageSection from "@/components/landing/CareerIntelligencePackageSection";
import CareerTransformationSection from "@/components/landing/CareerTransformationSection";

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
      <HackathonSocialProof />
      
      
      <JobProfileAssessmentSection />
      <CareerIntelligencePackageSection />
      <CareerTransformationSection />
      {/* <CandidateJourneySection /> */}
      <FeaturedCompanies />
      <IndustryReadinessSection />
      <TrustAuthoritySection />
      <HackathonSpotlightSection />
      
      
      <VideoSection />
      <WhoIsItForSection />
      <SkillCategoriesSection />
      <ReviewsMarquee />
      <ComplianceSection />
      <CTASection />
    </Layout>
  </>
);

export default Index;
