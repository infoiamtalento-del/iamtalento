import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense } from "react";
import { ThemeProvider } from "next-themes";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./components/layout/PageTransition";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const Features = lazy(() => import("./pages/Features"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Blog = lazy(() => import("./pages/Blog"));
const Docs = lazy(() => import("./pages/Docs"));
const Changelog = lazy(() => import("./pages/Changelog"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Assessments = lazy(() => import("./pages/Assessments"));
const Jobs = lazy(() => import("./pages/Jobs"));
const Learning = lazy(() => import("./pages/Learning"));
const Resources = lazy(() => import("./pages/Resources"));
const Pricing = lazy(() => import("./pages/Pricing"));
const ForEmployers = lazy(() => import("./pages/ForEmployers"));
const ForEmployersV2 = lazy(() => import("./pages/ForEmployersV2"));
const Auth = lazy(() => import("./pages/Auth"));
const ProfileBuilder = lazy(() => import("./pages/ProfileBuilder"));
const EmployerProfileBuilder = lazy(() => import("./pages/EmployerProfileBuilder"));
const MyProfile = lazy(() => import("./pages/MyProfile"));
const DemoProfile = lazy(() => import("./pages/DemoProfile"));
const SkillAssessment = lazy(() => import("./pages/SkillAssessment"));
const Podcast = lazy(() => import("./pages/Podcast"));
const Hackathons = lazy(() => import("./pages/Hackathons"));
const Webinars = lazy(() => import("./pages/Webinars"));

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Suspense key={location.pathname} fallback={<div className="min-h-screen flex items-center justify-center"><div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Index /></PageTransition>} />
          <Route path="/features" element={<PageTransition><Features /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
          <Route path="/docs" element={<PageTransition><Docs /></PageTransition>} />
          <Route path="/changelog" element={<PageTransition><Changelog /></PageTransition>} />
          <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
          <Route path="/assessments" element={<PageTransition><Assessments /></PageTransition>} />
          <Route path="/jobs" element={<PageTransition><Jobs /></PageTransition>} />
          <Route path="/learning" element={<PageTransition><Learning /></PageTransition>} />
          <Route path="/meetups" element={<PageTransition><Hackathons /></PageTransition>} />
          <Route path="/hackathons" element={<PageTransition><Hackathons /></PageTransition>} />
          <Route path="/webinars" element={<PageTransition><Webinars /></PageTransition>} />
          <Route path="/resources" element={<PageTransition><Resources /></PageTransition>} />
          <Route path="/pricing" element={<PageTransition><Pricing /></PageTransition>} />
          <Route path="/for-employers" element={<PageTransition><ForEmployers /></PageTransition>} />
          <Route path="/for-employers-v2" element={<PageTransition><ForEmployersV2 /></PageTransition>} />
          <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
          <Route path="/profile" element={<PageTransition><ProfileBuilder /></PageTransition>} />
          <Route path="/my-profile" element={<PageTransition><MyProfile /></PageTransition>} />
          <Route path="/employer-profile" element={<PageTransition><EmployerProfileBuilder /></PageTransition>} />
          <Route path="/demo-profile" element={<PageTransition><DemoProfile /></PageTransition>} />
          <Route path="/skill-assessment" element={<PageTransition><SkillAssessment /></PageTransition>} />
          <Route path="/podcast" element={<PageTransition><Podcast /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ThemeProvider>
);

export default App;
