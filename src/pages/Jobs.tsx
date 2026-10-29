import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import JobsHeroSection, { type JobsHeroSearchParams } from "@/components/landing/JobsHeroSection";
import LiveJobResultsSection from "@/components/jobs/LiveJobResultsSection";
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
import AICareerSuiteSection from "@/components/jobs/AICareerSuiteSection";

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<JobsHeroSearchParams>(() => ({
    query: searchParams.get("q") ?? "",
    experience: searchParams.get("exp") ?? "",
    location: searchParams.get("loc") ?? "",
    skills: searchParams.get("skills") ? searchParams.get("skills")!.split(",").filter(Boolean) : [],
  }));

  const handleSearch = (next: JobsHeroSearchParams) => {
    setFilters(next);
    const sp = new URLSearchParams();
    if (next.query.trim()) sp.set("q", next.query.trim());
    if (next.experience) sp.set("exp", next.experience);
    if (next.location.trim()) sp.set("loc", next.location.trim());
    if (next.skills.length > 0) sp.set("skills", next.skills.join(","));
    setSearchParams(sp, { replace: true });
  };

  const handleClearFilters = () => {
    setFilters({ query: "", experience: "", location: "", skills: [] });
    setSearchParams({}, { replace: true });
  };

  return (
    <>
      <Helmet>
        <title>Jobs | I Am Talento</title>
        <meta name="description" content="Find your dream job. AI-powered job matching based on your verified skill profile." />
      </Helmet>
      <Layout>
        {/* Hero Search */}
        <JobsHeroSection
          initialQuery={filters.query}
          initialExperience={filters.experience}
          initialLocation={filters.location}
          onSearch={handleSearch}
        />

        {/* Live Searchable Job Openings from PostgreSQL / Supabase */}
        <LiveJobResultsSection
          query={filters.query}
          experience={filters.experience}
          location={filters.location}
          skills={filters.skills}
          onClearFilters={handleClearFilters}
        />

        {/* Trusted by companies marquee */}
        <JobsSocialProof />

        {/* Comprehensive AI Career Tools Carousel */}
        <AICareerSuiteSection />

        {/* Unlock 8 FREE Career Benefits */}
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
