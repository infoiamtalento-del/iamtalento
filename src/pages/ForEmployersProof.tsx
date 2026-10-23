import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import {
  ProofStrip, ProofHero, ProofTrustBar, ProblemSection, NewEraSection, TwoWaysSection, HowItWorksSection,
  TwoWeeksSection, ProductTourSection, LindaSection, ExplainableSection, CirReportSection, IntegritySection,
  ResponsibleAISection, ResultsSection, RoiSection, ComparisonSection, BuiltForTeamSection, ProofTestimonials,
  CandidateExperienceSection, ProofIntegrations, ProofPricing, PromiseSection, ProofFAQ, FinalCtaSection,
} from "@/components/employers/ProofEraSections";
import { PlatformSection } from "@/components/employers/EmployerShowcaseSections";

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
      <PlatformSection eyebrow="Product Ecosystem" first="One Platform. Six Products" second="to Make Hiring Smarter." description={<>Assess, proctor, brand, and interview without juggling separate tools.<br className="hidden md:block" /> Six capabilities, one connected workflow.</>} />
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
