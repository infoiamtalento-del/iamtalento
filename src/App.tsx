import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { lazy as reactLazy, Suspense, ComponentType, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Retry once with a full reload when a page chunk is stale after a new deploy.
const lazy = <T extends ComponentType<any>>(factory: () => Promise<{ default: T }>) =>
  reactLazy(() =>
    factory()
      .then((m) => {
        sessionStorage.removeItem("chunk-reload");
        return m;
      })
      .catch((err) => {
        if (!sessionStorage.getItem("chunk-reload")) {
          sessionStorage.setItem("chunk-reload", "1");
          window.location.reload();
          return new Promise<{ default: T }>(() => {});
        }
        throw err;
      })
  );
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
const CourseDetail = lazy(() => import("./pages/CourseDetail"));
const Resources = lazy(() => import("./pages/Resources"));
const Pricing = lazy(() => import("./pages/Pricing"));
const ForEmployers = lazy(() => import("./pages/ForEmployers"));
const ForEmployersV2 = lazy(() => import("./pages/ForEmployersV2"));
const ForEmployersProof = lazy(() => import("./pages/ForEmployersProof"));
const Auth = lazy(() => import("./pages/Auth"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const OnboardingWizard = lazy(() => import("./pages/OnboardingWizard"));
const ProfileBuilder = lazy(() => import("./pages/ProfileBuilder"));
const EmployerProfileBuilder = lazy(() => import("./pages/EmployerProfileBuilder"));
const MyProfile = lazy(() => import("./pages/MyProfile"));
const DemoProfile = lazy(() => import("./pages/DemoProfile"));
const SkillAssessment = lazy(() => import("./pages/SkillAssessment"));
const Podcasts = lazy(() => import("./pages/Podcasts"));
const Hackathons = lazy(() => import("./pages/Hackathons"));
const Hackathon2 = lazy(() => import("./pages/Hackathon2"));
const Hackathon3 = lazy(() => import("./pages/Hackathon3"));
const Networking = lazy(() => import("./pages/Networking"));
const AssessmentDiscovery = lazy(() => import("./pages/assessment/AssessmentDiscovery"));
const AssessmentDetail = lazy(() => import("./pages/assessment/AssessmentDetail"));
const AssessmentPreCheck = lazy(() => import("./pages/assessment/AssessmentPreCheck"));
const AssessmentPrepare = lazy(() => import("./pages/assessment/AssessmentPrepare"));
const AssessmentPractice = lazy(() => import("./pages/assessment/AssessmentPractice"));
const AssessmentTest = lazy(() => import("./pages/assessment/AssessmentTest"));
const AssessmentResult = lazy(() => import("./pages/assessment/AssessmentResult"));
const TalentoPro = lazy(() => import("./pages/TalentoPro"));
const Home2 = lazy(() => import("./pages/Home2"));
const Home3 = lazy(() => import("./pages/Home3"));
const AiGuidance = lazy(() => import("./pages/AiGuidance"));
const VerifyCredential = lazy(() => import("./pages/VerifyCredential"));
const PublicPortfolio = lazy(() => import("./pages/PublicPortfolio"));

const queryClient = new QueryClient();

const AuthRedirectListener = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Forward Supabase email confirmation / error fragments that land on `/` to `/auth/callback`
    if (location.pathname !== "/auth/callback" && location.pathname !== "/reset-password") {
      const hash = window.location.hash;
      const params = new URLSearchParams(location.search);
      const hasAuthHash = /access_token=|error_code=|error_description=/.test(hash);
      const hasAuthCode = location.pathname === "/" && params.has("code");
      if (hasAuthHash || hasAuthCode) {
        if (/type=recovery/.test(hash)) {
          navigate(`/reset-password${location.search}${hash}`, { replace: true });
        } else {
          navigate(`/auth/callback${location.search}${hash}`, { replace: true });
        }
      }
    }
  }, [location.pathname, location.search, navigate]);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        navigate("/reset-password", { replace: true });
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  return null;
};

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
          <Route path="/assessments/explore" element={<PageTransition><AssessmentDiscovery /></PageTransition>} />
          <Route path="/digital-marketing-fundamentals" element={<PageTransition><AssessmentDetail /></PageTransition>} />
          <Route path="/assessments/:assessmentId" element={<PageTransition><AssessmentDetail /></PageTransition>} />
          <Route path="/assessments/:assessmentId/prepare" element={<AssessmentPrepare />} />
          <Route path="/assessments/:assessmentId/practice/:subId/:mode" element={<AssessmentPractice />} />
          <Route path="/assessments/:assessmentId/pre-check" element={<AssessmentPreCheck />} />
          <Route path="/assessments/:assessmentId/test" element={<AssessmentTest />} />
          <Route path="/assessments/:assessmentId/result" element={<PageTransition><AssessmentResult /></PageTransition>} />
          <Route path="/jobs" element={<PageTransition><Jobs /></PageTransition>} />
          <Route path="/learning" element={<PageTransition><Learning /></PageTransition>} />
          <Route path="/learning/courses/ai-engineer-agentic-track" element={<PageTransition><CourseDetail /></PageTransition>} />
          <Route path="/learning/courses/:slug" element={<PageTransition><CourseDetail /></PageTransition>} />
          <Route path="/ai-guidance" element={<PageTransition><AiGuidance /></PageTransition>} />
          <Route path="/si-guidance" element={<PageTransition><AiGuidance /></PageTransition>} />
          <Route path="/meetups" element={<PageTransition><Hackathons /></PageTransition>} />
          <Route path="/hackathons" element={<PageTransition><Hackathons /></PageTransition>} />
          <Route path="/hackathon2" element={<PageTransition><Hackathon2 /></PageTransition>} />
          <Route path="/hackathon3" element={<PageTransition><Hackathon3 /></PageTransition>} />
          <Route path="/podcasts" element={<PageTransition><Podcasts /></PageTransition>} />
          <Route path="/webinars" element={<PageTransition><Podcasts /></PageTransition>} />
          <Route path="/podcast" element={<PageTransition><Podcasts /></PageTransition>} />
          <Route path="/resources" element={<PageTransition><Resources /></PageTransition>} />
          <Route path="/pricing" element={<PageTransition><Pricing /></PageTransition>} />
          <Route path="/for-employers" element={<PageTransition><ForEmployers /></PageTransition>} />
          <Route path="/employers-page-2" element={<PageTransition><ForEmployersProof /></PageTransition>} />
          <Route path="/for-employers-v2" element={<PageTransition><ForEmployersV2 /></PageTransition>} />
          <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
          <Route path="/auth/callback" element={<PageTransition><AuthCallback /></PageTransition>} />
          <Route path="/forgot-password" element={<PageTransition><ResetPassword /></PageTransition>} />
          <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />
          <Route path="/onboarding" element={<PageTransition><OnboardingWizard /></PageTransition>} />
          <Route path="/profile" element={<PageTransition><ProfileBuilder /></PageTransition>} />
          <Route path="/my-profile" element={<PageTransition><MyProfile /></PageTransition>} />
          <Route path="/employer-profile" element={<PageTransition><EmployerProfileBuilder /></PageTransition>} />
          <Route path="/demo-profile" element={<PageTransition><DemoProfile /></PageTransition>} />
          <Route path="/skill-assessment" element={<PageTransition><SkillAssessment /></PageTransition>} />
          <Route path="/networking" element={<PageTransition><Networking /></PageTransition>} />
          <Route path="/pro" element={<PageTransition><TalentoPro /></PageTransition>} />
          <Route path="/talento-pro" element={<PageTransition><TalentoPro /></PageTransition>} />
          <Route path="/home-2" element={<PageTransition><Home2 /></PageTransition>} />
          <Route path="/home2" element={<PageTransition><Home2 /></PageTransition>} />
          <Route path="/home-3" element={<PageTransition><Home3 /></PageTransition>} />
          <Route path="/home3" element={<PageTransition><Home3 /></PageTransition>} />
          <Route path="/verify/:token" element={<PageTransition><VerifyCredential /></PageTransition>} />
          <Route path="/u/:slug" element={<PageTransition><PublicPortfolio /></PageTransition>} />
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
            <AuthRedirectListener />
            <AnimatedRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ThemeProvider>
);

export default App;
