import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import AssessmentIntegritySection from "@/components/landing/AssessmentIntegritySection";
import TrustAuthoritySection from "@/components/landing/TrustAuthoritySection";
import WhoIsItForSection from "@/components/landing/WhoIsItForSection";
import JobsEventsSection from "@/components/jobs/JobsEventsSection";

// 1. Hook
import AssessmentHero from "@/components/assessments/AssessmentHero";
import AssessmentSocialProof from "@/components/assessments/AssessmentSocialProof";
import AssessmentMarqueeSection from "@/components/assessments/AssessmentMarqueeSection";
import ProblemSolutionAccordion from "@/components/assessments/ProblemSolutionAccordion";

// 2. Problem → Solution
import WhyItMattersTimeline from "@/components/assessments/WhyItMattersTimeline";
import BuiltDifferentSection from "@/components/assessments/BuiltDifferentSection";


// 3. How it works → Explore
import HowItWorksSection from "@/components/assessments/HowItWorksSection";

import SelectAssessmentSection from "@/components/assessments/SelectAssessmentSection";

// 4. Trust & Integrity
import ProctoringSection from "@/components/assessments/ProctoringSection";
import ResultsReportSection from "@/components/assessments/ResultsReportSection";
import LiveLeaderboardSection from "@/components/assessments/LiveLeaderboardSection";

// 5. The Reward
import VerifiedBadgeSection from "@/components/assessments/VerifiedBadgeSection";
import DigitalSkillPassportSection from "@/components/landing/DigitalSkillPassportSection";
import VerifiedBadgeBentoSection from "@/components/assessments/VerifiedBadgeBentoSection";
import DreamCareerCTABanner from "@/components/assessments/DreamCareerCTABanner";

// 6. Social proof → Convert
import SocialProofStats from "@/components/assessments/SocialProofStats";
import CandidateStories from "@/components/assessments/CandidateStories";
import PhoneMockupSection from "@/components/assessments/PhoneMockupSection";
import PricingBundles from "@/components/assessments/PricingBundles";
import AssessmentFAQ from "@/components/assessments/AssessmentFAQ";
import AssessmentFinalCTA from "@/components/assessments/AssessmentFinalCTA";
import ComplianceSection from "@/components/landing/ComplianceSection";

const Assessments = () => (
  <>
    <Helmet>
      <title>Skill Assessments — I Am Talento</title>
      <meta name="description" content="Take AI-powered, proctored skill assessments to validate your industry readiness, earn a verified badge, and unlock better job opportunities." />
    </Helmet>
    <Layout>
      {/* ── 1. HOOK ── */}
      <AssessmentHero />
      <SocialProofStats />
      <AssessmentSocialProof />
      <VerifiedBadgeSection />
      <HowItWorksSection />
      <DigitalSkillPassportSection />
      <DreamCareerCTABanner />

      
      <ProblemSolutionAccordion />
      <AssessmentIntegritySection />
      <SelectAssessmentSection />

      {/* ── 2. CREDIBILITY & TRUST ── */}
      <TrustAuthoritySection />
      <WhoIsItForSection />

      {/* ── 3. HOW IT WORKS → EXPLORE ── */}
      
      
      <JobsEventsSection />

      {/* ── 4. TRUST & INTEGRITY ── */}
      <ProctoringSection />

      {/* ── 6. SOCIAL PROOF → CONVERT ── */}
      <CandidateStories />
      <PhoneMockupSection />
      <PricingBundles />
      <AssessmentFAQ />
      <AssessmentFinalCTA />
      <ComplianceSection />
    </Layout>
  </>
);

export default Assessments;
