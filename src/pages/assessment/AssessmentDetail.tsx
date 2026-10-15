import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Check,
  Star,
  Users,
  Award,
  BookOpen,
  Briefcase,
  Play,
  Bookmark,
  ShoppingCart,
  ChevronDown,
  Sparkles,
  Smartphone,
  CreditCard,
  Landmark,
  Lock,
  Search,
  SlidersHorizontal,
  Compass,
  Palette,
  LineChart,
  Calendar,
  Layers,
  Code2,
  UserCheck,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { getAssessment, ASSESSMENTS } from "@/data/assessments";
import { savePaidOrder } from "@/data/practiceQuestions";
import { AssessmentHeroVisual } from "@/components/assessments/AssessmentHeroVisual";
import thumb from "@/assets/assessment-video-thumb.jpg";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Avatars
import expertFemale1 from "@/assets/experts/female-1.jpg";
import expertFemale2 from "@/assets/experts/female-2.jpg";
import expertFemale3 from "@/assets/experts/female-3.jpg";
import expertFemale4 from "@/assets/experts/female-4.jpg";
import expertFemale5 from "@/assets/experts/female-5.jpg";
import expertMale1 from "@/assets/experts/male-1.jpg";
import expertMale2 from "@/assets/experts/male-2.jpg";
import expertMale3 from "@/assets/experts/male-3.jpg";
import expertMale4 from "@/assets/experts/male-4.jpg";

interface SubDomainCourse {
  id: string;
  title: string;
  instructor: {
    name: string;
    role: string;
    avatar: string;
  };
  rating: number;
  reviews: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  originalPrice: number;
  discount: string;
  badge?: string;
  badgeColor?: "blue" | "green" | "slate" | "purple";
  tag: string;
  category: string;
  skills: string[];
  bannerColor: string;
}

const SUB_DOMAIN_COURSES: SubDomainCourse[] = [
  {
    id: "digital-marketing-fundamentals",
    title: "Digital Marketing Fundamentals",
    instructor: { name: "Sarah Johnson", role: "Digital Marketer", avatar: expertFemale1 },
    rating: 4.8,
    reviews: "2.1k",
    duration: "6h 20m",
    level: "Beginner",
    price: 1999,
    originalPrice: 3999,
    discount: "50% OFF",
    badge: "Bestseller",
    badgeColor: "blue",
    tag: "Core Test",
    category: "Marketing",
    skills: ["Campaign Planning", "Funnel Metrics", "Digital Strategy"],
    bannerColor: "from-blue-600 to-indigo-700",
  },
  {
    id: "social-media-marketing",
    title: "Social Media Marketing",
    instructor: { name: "David Kim", role: "Social Media Strategist", avatar: expertMale1 },
    rating: 4.7,
    reviews: "1.8k",
    duration: "5h",
    level: "Beginner",
    price: 1999,
    originalPrice: 3999,
    discount: "50% OFF",
    badge: "New",
    badgeColor: "green",
    tag: "Social Media",
    category: "Marketing",
    skills: ["Meta Ads", "LinkedIn Strategy", "Community Growth"],
    bannerColor: "from-rose-500 to-indigo-600",
  },
  {
    id: "google-analytics-4",
    title: "Google Analytics 4 & Funnels",
    instructor: { name: "Priya Sharma", role: "Data Analyst", avatar: expertFemale2 },
    rating: 4.9,
    reviews: "1.2k",
    duration: "4h",
    level: "Intermediate",
    price: 1999,
    originalPrice: 3999,
    discount: "50% OFF",
    badge: "High Demand",
    badgeColor: "purple",
    tag: "Analytics",
    category: "Analytics",
    skills: ["GA4 Events", "Custom Dimensions", "Attribution Modeling"],
    bannerColor: "from-blue-700 to-sky-600",
  },
  {
    id: "content-creation-strategy",
    title: "Content Creation & Strategy",
    instructor: { name: "Alex Carter", role: "Creative Director", avatar: expertMale2 },
    rating: 4.6,
    reviews: "980",
    duration: "5h",
    level: "Beginner",
    price: 1999,
    originalPrice: 3999,
    discount: "50% OFF",
    tag: "Content",
    category: "Marketing",
    skills: ["Copywriting", "Editorial Calendars", "Brand Voice"],
    bannerColor: "from-amber-600 to-orange-600",
  },
  {
    id: "email-marketing-mastery",
    title: "Email & CRM Marketing Mastery",
    instructor: { name: "Neha Verma", role: "Email Specialist", avatar: expertFemale3 },
    rating: 4.8,
    reviews: "872",
    duration: "4h",
    level: "Intermediate",
    price: 1999,
    originalPrice: 3999,
    discount: "50% OFF",
    tag: "Lifecycle",
    category: "Marketing",
    skills: ["Lifecycle Flows", "Segmentation", "Deliverability"],
    bannerColor: "from-purple-600 to-indigo-700",
  },
  {
    id: "seo-for-beginners",
    title: "SEO for Beginners & Technical",
    instructor: { name: "Rohit Sharma", role: "SEO Lead", avatar: expertMale3 },
    rating: 4.8,
    reviews: "1.4k",
    duration: "5h",
    level: "Beginner",
    price: 1999,
    originalPrice: 3999,
    discount: "50% OFF",
    badge: "Popular",
    badgeColor: "slate",
    tag: "SEO",
    category: "Marketing",
    skills: ["On-Page SEO", "Technical Audits", "Search Console"],
    bannerColor: "from-emerald-600 to-teal-700",
  },
  {
    id: "ui-ux-design-basics",
    title: "UI/UX Design Basics for Marketers",
    instructor: { name: "Sneha Iyer", role: "Product Designer", avatar: expertFemale4 },
    rating: 4.7,
    reviews: "1.1k",
    duration: "6h",
    level: "Beginner",
    price: 1999,
    originalPrice: 3999,
    discount: "50% OFF",
    tag: "Design",
    category: "Design",
    skills: ["Figma Wireframes", "UX Heuristics", "Landing Page Layouts"],
    bannerColor: "from-indigo-600 to-pink-600",
  },
  {
    id: "business-growth-strategy",
    title: "Business Growth & Funnel Strategy",
    instructor: { name: "Vikram Mehta", role: "Growth Architect", avatar: expertMale4 },
    rating: 4.6,
    reviews: "924",
    duration: "5h",
    level: "Intermediate",
    price: 1999,
    originalPrice: 3999,
    discount: "50% OFF",
    tag: "Strategy",
    category: "Business",
    skills: ["Unit Economics", "Funnel CRO", "Growth Loops"],
    bannerColor: "from-slate-700 to-slate-900",
  },
  {
    id: "google-ads-mastery",
    title: "Google Ads & PPC Mastery",
    instructor: { name: "Ananya Desai", role: "PPC Specialist", avatar: expertFemale5 },
    rating: 4.5,
    reviews: "755",
    duration: "4h",
    level: "Intermediate",
    price: 1999,
    originalPrice: 3999,
    discount: "50% OFF",
    tag: "Paid Search",
    category: "Marketing",
    skills: ["Search Campaigns", "Smart Bidding", "Negative Keywords"],
    bannerColor: "from-blue-600 to-emerald-600",
  },
];

const CATEGORIES = [
  { id: "All", label: "All", count: "12 courses" },
  { id: "Marketing", label: "Digital Marketing", count: "12 courses", icon: Compass },
  { id: "Analytics", label: "Data & Analytics", count: "8 courses", icon: LineChart },
  { id: "Design", label: "Design & Creative", count: "10 courses", icon: Palette },
  { id: "Business", label: "Business & Strategy", count: "7 courses", icon: Briefcase },
  { id: "Programming", label: "Programming", count: "6 courses", icon: Code2 },
];

const FEATURED_LEARNING_PATHS = [
  { title: "Digital Marketing Expert", courses: "8 courses", duration: "32h", learners: "2.4k learners", icon: Compass, color: "bg-blue-50 text-blue-700 border-blue-200" },
  { title: "Data & Analytics Pro", courses: "6 courses", duration: "24h", learners: "1.8k learners", icon: LineChart, color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { title: "UI/UX Designer", courses: "5 courses", duration: "20h", learners: "1.2k learners", icon: Palette, color: "bg-rose-50 text-rose-700 border-rose-200" },
  { title: "Business Growth Manager", courses: "7 courses", duration: "28h", learners: "960 learners", icon: Briefcase, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
];

const FEATURED_EXPERTS = [
  { name: "Sarah Johnson", title: "Digital Marketer", rating: 4.9, reviews: "1.2k", avatar: expertFemale1 },
  { name: "David Kim", title: "Social Media Strategist", rating: 4.8, reviews: "962", avatar: expertMale1 },
  { name: "Priya Sharma", title: "Data Analyst", rating: 4.8, reviews: "876", avatar: expertFemale2 },
  { name: "Alex Carter", title: "Creative Director", rating: 4.7, reviews: "764", avatar: expertMale2 },
  { name: "Neha Verma", title: "Email Specialist", rating: 4.6, reviews: "658", avatar: expertFemale3 },
];

const PAYMENT_METHODS = [
  { name: "UPI", icon: Smartphone, note: "GPay, PhonePe, Paytm, BHIM" },
  { name: "Credit / Debit Card", icon: CreditCard, note: "Visa, Mastercard, RuPay" },
  { name: "Net Banking", icon: Landmark, note: "All major Indian banks" },
];

const CURRICULUM_SECTIONS = [
  {
    title: "1. Introduction to Digital Marketing",
    lessons: "2 Lessons · 45m",
    items: [
      { title: "1.1 What is Digital Marketing?", duration: "12m", completed: true },
      { title: "1.2 Key Trends & Opportunities", duration: "33m", completed: true },
    ],
  },
  {
    title: "2. Social Media Marketing",
    lessons: "3 Lessons · 1h 10m",
    items: [
      { title: "2.1 Platform Overview & Demographics", duration: "20m", completed: true },
      { title: "2.2 Organic vs Paid Content Strategy", duration: "25m", completed: true },
      { title: "2.3 Paid Campaign Optimization", duration: "25m", completed: false },
    ],
  },
  {
    title: "3. SEO & Content Marketing",
    lessons: "3 Lessons · 1h 15m",
    items: [
      { title: "3.1 SEO Fundamentals & Crawlers", duration: "30m", completed: true },
      { title: "3.2 Keyword Research & Search Intent", duration: "25m", completed: false },
      { title: "3.3 High-Converting Content Strategy", duration: "20m", completed: false },
    ],
  },
  {
    title: "4. Analytics & Reporting",
    lessons: "2 Lessons · 50m",
    items: [
      { title: "4.1 Google Analytics 4 Setup & Events", duration: "25m", completed: false },
      { title: "4.2 Conversion Tracking & Funnels", duration: "25m", completed: false },
    ],
  },
];

const AssessmentDetail = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const baseAssessment = getAssessment(assessmentId);

  // Cart state: contains sub-domain / course IDs (each ₹1,999)
  const [cartIds, setCartIds] = useState<string[]>(() => [
    "digital-marketing-fundamentals",
  ]);

  // Saved bookmark items
  const [savedIds, setSavedIds] = useState<string[]>([]);

  // Selected filter and search
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<string>("UPI");

  // Preview dialog
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);

  // Active tab in right sidebar: 'overview' | 'curriculum' | 'reviews'
  const [sidebarTab, setSidebarTab] = useState<"overview" | "curriculum" | "reviews">("curriculum");
  const [expandedCurriculum, setExpandedCurriculum] = useState<number[]>([0, 1]);

  const toggleCurriculum = (index: number) => {
    setExpandedCurriculum((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Toggle Cart Item: Each assessment is ₹1,999
  const handleToggleCart = (id: string, title: string) => {
    if (cartIds.includes(id)) {
      setCartIds((prev) => prev.filter((item) => item !== id));
      toast.info(`Removed "${title}" from cart`);
    } else {
      setCartIds((prev) => [...prev, id]);
      toast.success(`Added "${title}" to cart (₹1,999)`);
    }
  };

  const handleToggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    toast.success(savedIds.includes(id) ? "Removed from saved" : "Saved to your list");
  };

  // Filter courses by category and search
  const filteredCourses = useMemo(() => {
    return SUB_DOMAIN_COURSES.filter((course) => {
      const matchesCategory =
        activeCategory === "All" || course.category === activeCategory;
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Cart financial totals: EACH ASSESSMENT IS ₹1,999
  const cartItems = SUB_DOMAIN_COURSES.filter((c) => cartIds.includes(c.id));
  const subtotal = cartItems.length * 1999;
  const originalSubtotal = cartItems.length * 3999;
  const savings = originalSubtotal - subtotal;

  const handleProceedToPayment = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Please select at least one assessment.");
      return;
    }
    const orderId = `CIR-${Date.now().toString(36).toUpperCase()}`;
    savePaidOrder(baseAssessment?.id || "digital-marketing-fundamentals", {
      orderId,
      subDomainIds: cartIds,
      total: subtotal,
      paidAt: Date.now(),
    });
    toast.success("Order confirmed! Preparing your proctored assessment.");
    navigate(`/assessments/${baseAssessment?.id || "digital-marketing-fundamentals"}/prepare`);
  };

  const scrollToCheckout = () => {
    const el = document.getElementById("checkout-card");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="min-h-screen bg-[#f8fafd] text-slate-900 font-sans selection:bg-blue-500/20 selection:text-blue-700"
      style={
        {
          "--primary": "211.3 86.4% 37.5%",
          "--primary-foreground": "0 0% 100%",
          "--ring": "211.3 86.4% 37.5%",
          "--accent": "211 40% 96%",
          "--accent-foreground": "211.3 86.4% 37.5%",
        } as React.CSSProperties
      }
    >
      <Helmet>
        <title>Digital Marketing Fundamentals — TalentCIR</title>
        <meta
          name="description"
          content="Build in-demand skills, work on real projects, and get certified with industry-recognized readiness scores."
        />
      </Helmet>

      {/* Main layout without left panels */}
      <Layout>
        {/* ===================== HERO SECTION ===================== */}
        <section className="relative overflow-hidden bg-white border-b border-border/80 pt-24 pb-12 sm:pt-28 sm:pb-16">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column (Copy, In-hero Search, Actions) */}
              <div className="lg:col-span-7">
                {/* Eyebrow badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[#0d5cb2] text-xs font-bold mb-4 shadow-2xs">
                  <Sparkles className="h-3.5 w-3.5 text-[#0d5cb2]" />
                  <span>Learn • Grow • Succeed</span>
                </div>

                {/* Main Heading */}
                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-4">
                  Digital Marketing{" "}
                  <span className="text-[#0d5cb2]">Fundamentals</span>
                </h1>

                {/* Subtitle */}
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mb-6">
                  Build in-demand skills, work on real proctored projects, and get mentored by industry experts.
                  Kickstart your career with a verified Career Intelligence Report.
                </p>

                {/* Meta Chips */}
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-6 text-xs sm:text-sm font-semibold text-slate-700">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/80">
                    <Clock className="h-4 w-4 text-[#0d5cb2]" />
                    <span>Self-paced / 6 weeks</span>
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/80">
                    <Briefcase className="h-4 w-4 text-[#0d5cb2]" />
                    <span>Beginner to Advanced</span>
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/80">
                    <Award className="h-4 w-4 text-[#0d5cb2]" />
                    <span>Certificate & CIR Report</span>
                  </span>
                </div>

                {/* In-Hero Search Input */}
                <div className="relative max-w-xl mb-6">
                  <div className="relative flex items-center">
                    <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for an assessment, skill, or topic..."
                      className="w-full h-11 pl-10 pr-24 rounded-full bg-slate-50 border border-slate-200/90 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0d5cb2]/30 focus:border-[#0d5cb2] transition-all shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById("explore-courses");
                        el?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="absolute right-1.5 h-8 px-4 rounded-full bg-[#0d5cb2] text-white text-xs font-bold hover:bg-[#0a4d96] transition-colors cursor-pointer"
                    >
                      Search
                    </button>
                  </div>
                </div>

                {/* Action CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    size="lg"
                    onClick={scrollToCheckout}
                    className="gap-2 font-bold cursor-pointer bg-[#0d5cb2] hover:bg-[#0a4d96] text-white shadow-md shadow-[#0d5cb2]/25 px-6 rounded-full"
                  >
                    <span>Start Learning</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setPreviewOpen(true)}
                    className="gap-2 font-semibold cursor-pointer bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-2xs rounded-full px-5"
                  >
                    <Play className="h-4 w-4 fill-slate-700 text-slate-700" />
                    <span>Watch Preview</span>
                  </Button>
                </div>
              </div>

              {/* Right Column: Visual Mockup */}
              <div className="lg:col-span-5 flex justify-center">
                <AssessmentHeroVisual onPlayPreview={() => setPreviewOpen(true)} />
              </div>
            </div>
          </div>
        </section>

        {/* ===================== STATS BAR ===================== */}
        <section className="border-b border-border/80 bg-white py-6">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="flex items-center gap-3.5 p-3 sm:p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50">
                <div className="h-10 w-10 rounded-xl bg-blue-100/80 text-[#0d5cb2] flex items-center justify-center shrink-0">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">5,000+</div>
                  <div className="text-xs text-slate-500 font-medium">Active Learners</div>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3 sm:p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50">
                <div className="h-10 w-10 rounded-xl bg-indigo-100/80 text-indigo-700 flex items-center justify-center shrink-0">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">200+</div>
                  <div className="text-xs text-slate-500 font-medium">Expert Instructors</div>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3 sm:p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50">
                <div className="h-10 w-10 rounded-xl bg-sky-100/80 text-sky-700 flex items-center justify-center shrink-0">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">50+</div>
                  <div className="text-xs text-slate-500 font-medium">Verified Assessments</div>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3 sm:p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50">
                <div className="h-10 w-10 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center shrink-0">
                  <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">4.8/5</div>
                  <div className="text-xs text-slate-500 font-medium">Average Rating</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== EXPLORE BY CATEGORY ===================== */}
        <section className="py-8 bg-[#f8fafd] border-b border-border/70">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">Explore by Category</h2>
                <p className="text-xs sm:text-sm text-slate-500">Find the right assessment for your career goals</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveCategory("All")}
                className="text-xs sm:text-sm font-bold text-[#0d5cb2] hover:underline"
              >
                View all →
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon || Compass;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      "p-3.5 rounded-2xl border transition-all cursor-pointer text-left flex flex-col justify-between",
                      isActive
                        ? "bg-white border-[#0d5cb2] ring-2 ring-[#0d5cb2]/20 shadow-sm"
                        : "bg-white/80 border-slate-200/80 hover:bg-white hover:border-slate-300 shadow-2xs"
                    )}
                  >
                    <div
                      className={cn(
                        "h-8 w-8 rounded-xl flex items-center justify-center mb-2.5",
                        isActive ? "bg-[#0d5cb2] text-white" : "bg-blue-50 text-[#0d5cb2]"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">{cat.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{cat.count}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===================== MAIN TWO-COLUMN CONTENT ===================== */}
        <section id="explore-courses" className="py-10 sm:py-14 bg-white">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* ================= LEFT / MAIN COLUMN (~65%) ================= */}
              <div className="lg:col-span-8 space-y-12">
                {/* Header with Filters */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                    <div>
                      <h2 className="font-display text-2xl font-bold text-slate-900">
                        {activeCategory === "All" ? "Popular Assessments & Sub-Domains" : `${activeCategory} Assessments`}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500">
                        Most in-demand technical tests, trusted by 5,000+ candidates · ₹1,999 each
                      </p>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                      {["All", "Marketing", "Analytics", "Design", "Business"].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setActiveCategory(cat)}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer",
                            activeCategory === cat
                              ? "bg-[#0d5cb2] text-white font-bold"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                          )}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sub-Domains Grid */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {filteredCourses.map((course) => {
                      const isInCart = cartIds.includes(course.id);
                      const isSaved = savedIds.includes(course.id);

                      return (
                        <div
                          key={course.id}
                          onClick={() => handleToggleCart(course.id, course.title)}
                          className={cn(
                            "group rounded-2xl border transition-all cursor-pointer overflow-hidden flex flex-col justify-between bg-white",
                            isInCart
                              ? "border-[#0d5cb2] ring-2 ring-[#0d5cb2]/20 shadow-md"
                              : "border-slate-200/90 hover:border-slate-300 hover:shadow-md"
                          )}
                        >
                          {/* Card Banner Preview */}
                          <div className={cn("relative h-32 w-full p-3 flex flex-col justify-between bg-gradient-to-br", course.bannerColor)}>
                            <div className="flex items-center justify-between">
                              {course.badge ? (
                                <span className="px-2 py-0.5 rounded-md bg-white/95 text-slate-900 font-bold text-[10px] uppercase tracking-wide shadow-2xs">
                                  {course.badge}
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-md bg-white/20 text-white font-semibold text-[10px] backdrop-blur-xs">
                                  {course.tag}
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={(e) => handleToggleSave(course.id, e)}
                                aria-label="Bookmark assessment"
                                className="h-7 w-7 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
                              >
                                <Bookmark className={cn("h-3.5 w-3.5", isSaved && "fill-white text-white")} />
                              </button>
                            </div>

                            {/* Skills preview on banner */}
                            <div className="flex flex-wrap gap-1">
                              {course.skills.slice(0, 2).map((skill) => (
                                <span key={skill} className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-black/30 text-white backdrop-blur-xs">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Card Body */}
                          <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="font-display text-sm font-bold text-slate-900 line-clamp-2 leading-tight group-hover:text-[#0d5cb2] transition-colors mb-2">
                                {course.title}
                              </h3>

                              {/* Instructor info */}
                              <div className="flex items-center gap-2 mb-3">
                                <img
                                  src={course.instructor.avatar}
                                  alt={course.instructor.name}
                                  className="h-6 w-6 rounded-full object-cover border border-slate-200"
                                />
                                <span className="text-xs text-slate-600 font-medium truncate">
                                  {course.instructor.name}
                                </span>
                              </div>

                              {/* Rating & Meta */}
                              <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pb-3 border-b border-slate-100">
                                <span className="flex items-center gap-1 font-bold text-slate-800">
                                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                  <span>{course.rating}</span>
                                  <span className="text-slate-400 font-normal">({course.reviews})</span>
                                </span>
                                <span>{course.duration}</span>
                                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold text-[10px]">
                                  {course.level}
                                </span>
                              </div>
                            </div>

                            {/* Price & Add to Cart button */}
                            <div className="mt-3 flex items-center justify-between gap-2 pt-1">
                              <div>
                                <div className="text-base font-extrabold text-slate-900 leading-none">
                                  ₹{course.price.toLocaleString("en-IN")}
                                </div>
                                <div className="text-[11px] text-slate-400 line-through mt-0.5">
                                  ₹{course.originalPrice.toLocaleString("en-IN")}
                                  <span className="text-emerald-600 font-bold ml-1 text-[10px]">50% OFF</span>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleCart(course.id, course.title);
                                }}
                                className={cn(
                                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                                  isInCart
                                    ? "bg-emerald-600 text-white shadow-xs"
                                    : "bg-blue-50 text-[#0d5cb2] hover:bg-[#0d5cb2] hover:text-white"
                                )}
                              >
                                {isInCart ? (
                                  <>
                                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                                    <span>Added</span>
                                  </>
                                ) : (
                                  <>
                                    <ShoppingCart className="h-3.5 w-3.5" />
                                    <span>Add to Cart</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Featured Learning Paths (from reference design) */}
                <div className="pt-4 border-t border-slate-200/80">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-display text-xl font-bold text-slate-900">Featured Learning Paths</h3>
                      <p className="text-xs sm:text-sm text-slate-500">Structured multi-course tracks to fast-track your promotion</p>
                    </div>
                    <span className="text-xs font-bold text-[#0d5cb2] cursor-pointer hover:underline">View all paths →</span>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    {FEATURED_LEARNING_PATHS.map((path) => {
                      const Icon = path.icon;
                      return (
                        <div
                          key={path.title}
                          className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
                        >
                          <div>
                            <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center mb-3 border", path.color)}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <h4 className="font-display text-sm font-bold text-slate-900 mb-1 leading-snug">{path.title}</h4>
                            <p className="text-xs text-slate-500 font-medium">{path.courses} · {path.duration}</p>
                          </div>
                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                            <span>{path.learners}</span>
                            <ArrowRight className="h-3.5 w-3.5 text-[#0d5cb2]" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Featured Experts Row (from reference design) */}
                <div className="pt-4 border-t border-slate-200/80">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="font-display text-xl font-bold text-slate-900">Featured Experts</h3>
                      <p className="text-xs sm:text-sm text-slate-500">Questions written and reviewed by leading practitioners</p>
                    </div>
                    <span className="text-xs font-bold text-[#0d5cb2] cursor-pointer hover:underline">View all experts →</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                    {FEATURED_EXPERTS.map((expert) => (
                      <div
                        key={expert.name}
                        className="rounded-2xl border border-slate-200/80 bg-white p-3.5 text-center shadow-2xs hover:shadow-md transition-shadow"
                      >
                        <img
                          src={expert.avatar}
                          alt={expert.name}
                          className="h-14 w-14 rounded-full mx-auto object-cover border-2 border-slate-100 shadow-2xs mb-2"
                        />
                        <div className="text-xs font-bold text-slate-900 truncate">{expert.name}</div>
                        <div className="text-[10.5px] text-slate-500 truncate mb-1">{expert.title}</div>
                        <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-800">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span>{expert.rating}</span>
                          <span className="text-slate-400 text-[10px] font-normal">({expert.reviews})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ================= RIGHT COLUMN (STICKY DETAIL & CART, ~35%) ================= */}
              <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                {/* Selected Course Overview Card (matching Image 1) */}
                <div className="rounded-2xl border border-slate-200/90 bg-white shadow-md overflow-hidden">
                  {/* Card Cover Banner */}
                  <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                    <img
                      src={thumb}
                      alt="Digital Marketing Fundamentals preview"
                      className="h-full w-full object-cover opacity-85"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
                    <span className="absolute top-3 left-3 rounded-full bg-[#0d5cb2] text-white text-[10px] font-extrabold uppercase px-2.5 py-1 tracking-wider shadow-xs">
                      Bestseller
                    </span>
                    <button
                      type="button"
                      onClick={() => setPreviewOpen(true)}
                      className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-slate-900 hover:bg-white transition-colors"
                    >
                      <Play className="h-3 w-3 fill-slate-900" />
                      <span>Preview</span>
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    <h3 className="font-display text-lg font-extrabold text-slate-900 leading-tight mb-2">
                      Digital Marketing Fundamentals
                    </h3>

                    {/* Instructor Row */}
                    <div className="flex items-center gap-2 mb-3">
                      <img
                        src={expertFemale1}
                        alt="Sarah Johnson"
                        className="h-7 w-7 rounded-full object-cover border border-slate-200"
                      />
                      <span className="text-xs font-semibold text-slate-700">Sarah Johnson · Marketing Lead</span>
                    </div>

                    {/* Meta Rating & Duration */}
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mb-4">
                      <span className="flex items-center gap-1 font-bold text-slate-900">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>4.8</span>
                        <span className="text-slate-400 font-normal">(2.1k reviews)</span>
                      </span>
                      <span>·</span>
                      <span>⏱ 6h 20m</span>
                      <span>·</span>
                      <span className="font-semibold text-slate-700">Beginner</span>
                    </div>

                    {/* Price Block: ₹1,999 */}
                    <div className="flex items-baseline gap-2 mb-4 pb-4 border-b border-slate-100">
                      <span className="font-display text-2xl font-black text-slate-900">₹1,999</span>
                      <span className="text-sm text-slate-400 line-through">₹3,999</span>
                      <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
                        50% OFF
                      </span>
                    </div>

                    {/* Add to Cart / Proceed Action */}
                    <div className="space-y-2 mb-4">
                      <Button
                        className="w-full h-11 gap-2 font-bold cursor-pointer bg-[#0d5cb2] hover:bg-[#0a4d96] text-white shadow-md shadow-[#0d5cb2]/25 rounded-xl"
                        onClick={scrollToCheckout}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span>{cartIds.includes("digital-marketing-fundamentals") ? "Proceed to Checkout" : "Add to Cart (₹1,999)"}</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full font-semibold cursor-pointer border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl"
                        onClick={() => toast.success("Added to your learning path!")}
                      >
                        Add to Learning Path
                      </Button>
                    </div>

                    {/* Tabs: Overview | Curriculum | Reviews */}
                    <div className="flex items-center justify-between border-b border-slate-200 text-xs font-bold text-slate-600 mb-3">
                      <button
                        type="button"
                        onClick={() => setSidebarTab("overview")}
                        className={cn(
                          "py-2 px-1 border-b-2 transition-colors cursor-pointer",
                          sidebarTab === "overview"
                            ? "border-[#0d5cb2] text-[#0d5cb2]"
                            : "border-transparent hover:text-slate-900"
                        )}
                      >
                        Overview
                      </button>
                      <button
                        type="button"
                        onClick={() => setSidebarTab("curriculum")}
                        className={cn(
                          "py-2 px-1 border-b-2 transition-colors cursor-pointer",
                          sidebarTab === "curriculum"
                            ? "border-[#0d5cb2] text-[#0d5cb2]"
                            : "border-transparent hover:text-slate-900"
                        )}
                      >
                        Curriculum
                      </button>
                      <button
                        type="button"
                        onClick={() => setSidebarTab("reviews")}
                        className={cn(
                          "py-2 px-1 border-b-2 transition-colors cursor-pointer",
                          sidebarTab === "reviews"
                            ? "border-[#0d5cb2] text-[#0d5cb2]"
                            : "border-transparent hover:text-slate-900"
                        )}
                      >
                        Reviews
                      </button>
                    </div>

                    {/* Tab Body: Curriculum Breakdown */}
                    {sidebarTab === "curriculum" && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1">
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" /> 12 Lessons · 6h 20m
                          </span>
                          <span className="text-[#0d5cb2]">Full Syllabus</span>
                        </div>

                        {CURRICULUM_SECTIONS.map((sec, idx) => {
                          const isExpanded = expandedCurriculum.includes(idx);
                          return (
                            <div key={sec.title} className="rounded-xl border border-slate-200/80 bg-slate-50/50 overflow-hidden">
                              <button
                                type="button"
                                onClick={() => toggleCurriculum(idx)}
                                className="w-full flex items-center justify-between p-2.5 text-left text-xs font-bold text-slate-800 hover:bg-slate-100/80 transition-colors cursor-pointer"
                              >
                                <span className="truncate pr-2">{sec.title}</span>
                                <ChevronDown className={cn("h-3.5 w-3.5 text-slate-400 transition-transform shrink-0", isExpanded && "rotate-180")} />
                              </button>

                              {isExpanded && (
                                <div className="px-3 pb-2.5 pt-1 space-y-1.5 border-t border-slate-200/60 bg-white">
                                  {sec.items.map((item) => (
                                    <div key={item.title} className="flex items-center justify-between text-[11px] text-slate-600">
                                      <span className="flex items-center gap-1.5 truncate pr-2">
                                        <CheckCircle2 className={cn("h-3 w-3 shrink-0", item.completed ? "text-emerald-500" : "text-slate-300")} />
                                        <span className="truncate">{item.title}</span>
                                      </span>
                                      <span className="text-slate-400 shrink-0 text-[10px]">{item.duration}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {sidebarTab === "overview" && (
                      <div className="text-xs text-slate-600 space-y-2">
                        <p>
                          This assessment tests real-world marketing capabilities across campaign architecture, performance marketing, GA4 attribution, and content strategy.
                        </p>
                        <ul className="space-y-1 text-[11px] font-medium text-slate-700">
                          <li className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                            <span>100% Proctored with camera & screen AI</span>
                          </li>
                          <li className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                            <span>Instant Career Intelligence Report (CIR)</span>
                          </li>
                          <li className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                            <span>Shareable score with top recruiters</span>
                          </li>
                        </ul>
                      </div>
                    )}

                    {sidebarTab === "reviews" && (
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between font-bold text-slate-800">
                          <span>Overall Rating</span>
                          <span className="text-amber-500 font-extrabold flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-amber-400" /> 4.8 / 5
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          "The practical questions on Google Ads and GA4 funnels are closest to actual agency work." — Rahul S., Growth Specialist
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Complete Payment & Start Card (from reference Image 2) */}
                <div id="checkout-card" className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-md">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                    <div>
                      <h4 className="font-display text-base font-bold text-slate-900">Complete Payment & Start</h4>
                      <p className="text-[11px] text-slate-500">Secure checkout with multiple payment options</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-blue-50 text-[#0d5cb2] flex items-center justify-center">
                      <ShoppingCart className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Cart Items List */}
                  <div className="space-y-2 mb-4">
                    <div className="text-xs font-bold text-slate-700">Selected Assessments ({cartItems.length}):</div>
                    {cartItems.length === 0 ? (
                      <div className="p-3 rounded-xl bg-slate-50 text-center text-xs text-slate-500">
                        No assessment selected. Tap "Add to Cart" on any course to add it.
                      </div>
                    ) : (
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {cartItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-50/80 border border-slate-200/60 text-xs"
                          >
                            <span className="font-semibold text-slate-800 truncate">{item.title}</span>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="font-bold text-slate-900">₹1,999</span>
                              <button
                                type="button"
                                onClick={() => handleToggleCart(item.id, item.title)}
                                aria-label="Remove item"
                                className="text-slate-400 hover:text-rose-600 transition-colors"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Summary Totals */}
                    <div className="pt-3 border-t border-slate-100 space-y-1 text-xs">
                      <div className="flex justify-between text-slate-500">
                        <span>Original Price</span>
                        <span className="line-through">₹{originalSubtotal.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>Discount Applied</span>
                        <span>-₹{savings.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between text-slate-900 font-extrabold text-base pt-1 border-t border-slate-100">
                        <span>Total Due</span>
                        <span className="text-[#0d5cb2]">₹{subtotal.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="space-y-1.5 mb-4">
                    <div className="text-xs font-bold text-slate-700 mb-1">Payment Method:</div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {PAYMENT_METHODS.map((pm) => (
                        <button
                          key={pm.name}
                          type="button"
                          onClick={() => setPaymentMethod(pm.name)}
                          className={cn(
                            "p-2 rounded-xl border text-center text-xs font-semibold transition-all cursor-pointer",
                            paymentMethod === pm.name
                              ? "bg-blue-50 border-[#0d5cb2] text-[#0d5cb2] font-bold"
                              : "border-slate-200 hover:border-slate-300 text-slate-600"
                          )}
                        >
                          <pm.icon className="h-4 w-4 mx-auto mb-1" />
                          <span className="block truncate text-[11px]">{pm.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Proceed to Pay Button */}
                  <Button
                    size="lg"
                    onClick={handleProceedToPayment}
                    disabled={cartItems.length === 0}
                    className="w-full gap-2 font-bold cursor-pointer bg-[#0d5cb2] hover:bg-[#0a4d96] text-white shadow-md shadow-[#0d5cb2]/25 rounded-xl h-11"
                  >
                    <Lock className="h-4 w-4" />
                    <span>Proceed to Pay (₹{subtotal.toLocaleString("en-IN")})</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>

                  <div className="mt-3 text-[11px] text-slate-400 text-center flex items-center justify-center gap-2">
                    <span>100% Secure</span>
                    <span>·</span>
                    <span>SSL Encrypted</span>
                    <span>·</span>
                    <span>Trusted Platform</span>
                  </div>
                </div>

                {/* Get Certified Banner (from reference Image 1) */}
                <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-br from-blue-50/60 to-indigo-50/40 p-4 shadow-2xs flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-[#0d5cb2] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Award className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900 leading-tight">Get Certified</div>
                    <div className="text-[11px] text-slate-600 mt-0.5">Showcase your verified score to top tech recruiters</div>
                  </div>
                  <Link
                    to="/assessments/explore"
                    className="text-xs font-bold text-[#0d5cb2] hover:underline shrink-0"
                  >
                    Explore →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Video Preview Modal */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-3xl overflow-hidden border-0 bg-black p-0">
            <DialogTitle className="sr-only">How the assessment works</DialogTitle>
            {previewOpen && (
              <video
                src="https://www.w3schools.com/html/mov_bbb.mp4"
                poster={thumb}
                controls
                autoPlay
                className="aspect-video w-full bg-black"
              />
            )}
          </DialogContent>
        </Dialog>
      </Layout>
    </div>
  );
};

export default AssessmentDetail;
