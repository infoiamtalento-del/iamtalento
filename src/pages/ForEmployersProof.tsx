import { Award, BarChart3, Clock, Timer, TrendingDown, Users } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import {
  ProofStrip, ProofHero, ProofTrustBar, TwoWaysSection, LindaSection,
  ProofPricing, PromiseSection, ProofFAQ, FinalCtaSection,
} from "@/components/employers/ProofEraSections";
import { PlatformSection, LindaShowcaseSection, TestimonialsSection, USPSection, PremiumSolutionsSection } from "@/components/employers/EmployerShowcaseSections";
import CareerIntelligencePackageHome from "@/components/landing/CareerIntelligencePackageHome";

const proofBenefits = [
  { icon: Timer, title: "Reduce Time-to-Hire", lead: "Hire Faster. Fill Positions Sooner.", text: "Automate first-round interviews and streamline candidate screening to accelerate your hiring workflow." },
  { icon: TrendingDown, title: "Reduce Hiring Costs", lead: "Save Manpower. Cut Repetitive Work.", text: "Reduce manual screening effort and repetitive interview hours so your recruitment team can focus on high-value hiring activities." },
  { icon: Award, title: "Hire Skills, Not Just Resumes", lead: "Look Beyond the CV.", text: "Use skill assessments, AI interview insights and candidate readiness reports to make better-informed hiring decisions." },
  { icon: Clock, title: "Interview 24/7 with AI", lead: "Your Hiring Doesn't Sleep.", text: "Let candidates complete AI-powered first-round interviews beyond office hours, without coordinating every interview manually." },
  { icon: Users, title: "Scale Hiring Without Scaling Your Team", lead: "More Candidates. Less Recruiter Workload.", text: "Streamline campus drives, bulk recruitment and high-volume screening with connected hiring tools." },
  { icon: BarChart3, title: "Make Smarter Hiring Decisions", lead: "Less Guesswork. More Hiring Confidence.", text: "Compare candidates using structured interview responses, relevant skill scores and assessment insights—all in one platform." },
];

/** Employer page v2: the sheet sections the client kept, in sheet order. */
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
      <USPSection eyebrow="Why TalentCIR" items={proofBenefits} />
      <CareerIntelligencePackageHome eyebrow="Candidate Intelligence Report" heading={{ first: "Why the CIR Report is a", second: "Game Changer in Talent Acquisition" }} description={<>Discover strengths, identify critical skill gaps, and benchmark candidates against<br className="hidden md:block" />relevant industry standards with an 8-in-1 Career Intelligence Report.</>} />
      <TestimonialsSection />
      <LindaSection />
      <PremiumSolutionsSection />
      <ProofPricing />
      <PromiseSection />
      <ProofFAQ />
      <FinalCtaSection />
    </Layout>
  </>
);

export default ForEmployersProof;
