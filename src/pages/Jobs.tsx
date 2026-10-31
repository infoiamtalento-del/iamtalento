import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import JobsHeroSection from "@/components/landing/JobsHeroSection";
import JobsSocialProof from "@/components/jobs/JobsSocialProof";
import FreeFeaturesSection from "@/components/landing/FreeFeaturesSection";
import FeaturedCompanies from "@/components/jobs/FeaturedCompanies";
import TopCategoriesSection from "@/components/jobs/TopCategoriesSection";
import FeaturedJobsBanner from "@/components/jobs/FeaturedJobsBanner";
import ExperienceLevelsSection from "@/components/jobs/ExperienceLevelsSection";
import PopularLocationsSection from "@/components/jobs/PopularLocationsSection";
import RemoteJobsSection from "@/components/jobs/RemoteJobsSection";
import JobsEventsSection from "@/components/jobs/JobsEventsSection";
import JobAlertsBanner from "@/components/jobs/JobAlertsBanner";
import JobsSuccessStoriesSection from "@/components/jobs/JobsSuccessStoriesSection";
import ResumeToolkitSection from "@/components/jobs/ResumeToolkitSection";

const Jobs = () => {
  return (
    <>
      <Helmet>
        <title>Browse Jobs | Talent CIR</title>
        <meta name="description" content="Your complete AI-powered career ecosystem to prove your potential, discover relevant opportunities, and connect with employers." />
      </Helmet>
      <Layout>
        {/* Hero Search */}
        <JobsHeroSection />

        {/* Trusted by companies marquee */}
        <JobsSocialProof />

        {/* Premium Features @ Zero Cost — 12 Reasons */}
        <FreeFeaturesSection />

        {/* Top Categories */}
        <TopCategoriesSection />

        {/* Featured Jobs banner (Handpicked Openings from Top Companies) */}
        <FeaturedJobsBanner />

        {/* Featured Companies (Top Employers Prefer Verified Talent) */}
        <FeaturedCompanies />

        {/* Jobs by Experience Level */}
        <ExperienceLevelsSection />

        {/* Popular Job Locations */}
        <PopularLocationsSection />

        {/* Remote Jobs */}
        <RemoteJobsSection />

        {/* Success Stories */}
        <JobsSuccessStoriesSection />

        {/* AI Tools to Get You Hired */}
        <ResumeToolkitSection />

        {/* Get Job Alerts email banner */}
        <JobAlertsBanner />

        {/* Events & Meetups */}
        <JobsEventsSection />
      </Layout>
    </>
  );
};

export default Jobs;
