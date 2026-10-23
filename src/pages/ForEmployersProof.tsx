import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import {
  ProofStrip, ProofHero, ProofTrustBar, ProblemSection, NewEraSection, TwoWaysSection, HowItWorksSection,
  TwoWeeksSection, ProductTourSection, LindaSection, ExplainableSection, CirReportSection, IntegritySection,
  ResponsibleAISection, ResultsSection, RoiSection, ComparisonSection, BuiltForTeamSection, ProofTestimonials,
  CandidateExperienceSection, ProofIntegrations, ProofPricing, PromiseSection, ProofFAQ, FinalCtaSection,
} from "@/components/employers/ProofEraSections";
import { PlatformSection, LindaShowcaseSection, TestimonialsSection } from "@/components/employers/EmployerShowcaseSections";
import CareerIntelligencePackageHome from "@/components/landing/CareerIntelligencePackageHome";

/** Section order follows the "Employer Page v2: The New Era" content sheet exactly. */
const ForEmployersProof = () => (
  <>
    <Helmet>
      <title>For Employers | Hire on Proof, Not Promises | TalentCIR</title>
      <meta name="description" content="TalentCIR tests, interviews and verifies every candidate with AI, then hands your team a ranked shortlist with the evidence attached." />
      <meta property="og:title" content="TalentCIR for Employers | The New Era of Hiring" />
      <meta property="og:description" content="Hire the people who can prove it: proctored assessments, AI interviews and verified CIR reports." />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
    </Helmet>
    <Layout>
      <ProofStrip />
      <ProofHero />
      <ProofTrustBar />
      <TwoWaysSection />
      <PlatformSection eyebrow="Product Ecosystem" first="1 Platform. 6 Products" second="to Make Hiring Smarter." description={<>Assess, proctor, brand, and interview without juggling separate tools.<br className="hidden md:block" /> Six capabilities, one connected workflow.</>} />
      <LindaShowcaseSection />
      <CareerIntelligencePackageHome eyebrow="Candidate Intelligence Report" heading={{ first: "Why the CIR Report is a", second: "Game Changer in Talent Acquisition" }} description={<>Discover strengths, identify critical skill gaps, and benchmark candidates against<br className="hidden md:block" />relevant industry standards with an 8-in-1 Career Intelligence Report.</>} />
      <TestimonialsSection />
      <ProblemSection />
      <NewEraSection />
      <HowItWorksSection />
      <TwoWeeksSection />
      <ProductTourSection />
      <LindaSection />
      <ExplainableSection />
      <CirReportSection />
      <IntegritySection />
      <ResponsibleAISection />
      <ResultsSection />
      <RoiSection />
      <ComparisonSection />
      <BuiltForTeamSection />
      <ProofTestimonials />
      <CandidateExperienceSection />
      <ProofIntegrations />
      <ProofPricing />
      <PromiseSection />
      <ProofFAQ />
      <FinalCtaSection />
    </Layout>
  </>
);

export default ForEmployersProof;
