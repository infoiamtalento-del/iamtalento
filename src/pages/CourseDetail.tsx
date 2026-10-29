import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight,
  Award,
  BarChart3,
  Bot,
  CalendarClock,
  ChevronDown,
  CirclePlay,
  ClipboardCheck,
  Clock,
  Crown,
  FileText,
  LayoutTemplate,
  Loader2,
  MessageCircle,
  NotebookPen,
  Play,
  Route,
  ShoppingCart,
  Star,
  Users,
  Video,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { defaultCourseImage, findLearningCourse } from "@/data/learningCourses";
import { CourseCurriculum, CoursePreviewDialog } from "@/components/learning/CourseCurriculum";
import { ExpertBookingSection } from "@/components/learning/ExpertBookingSection";
import {
  courseToolIconMap,
  defaultAiTrackTools,
  type CourseToolBadge,
} from "@/components/learning/CourseToolIcons";
import previewVideoUrl from "@/assets/ai-course-preview.webm";
import NotFound from "./NotFound";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import {
  completeModule,
  enrollInCourse,
  fetchCourseBySlug,
  fetchMyEnrollments,
  type Enrollment,
} from "@/services/candidate/platform";
import { createOrder, fetchWallet, payOrderWithWallet, payWithRazorpay } from "@/services/candidate/wallet";
import { backendErrorMessage } from "@/hooks/useCandidateBackend";

const defaultAiTrackCourse = {
  title: "AI Engineer Agentic Track",
  subtitle: "The Complete Agent & MCP Course",
  description:
    "Design, build and ship autonomous AI agents. Learn LLM tool use, the Model Context Protocol, multi-agent orchestration and production deployment through hands-on projects.",
  instructor: "Dr. Neha Sharma",
  role: "AI Engineer & Applied ML Researcher",
  rating: 4.7,
  ratings: "32,408",
  learners: "1,20,000+",
  price: "₹529",
  originalPrice: "₹799",
  discount: "34% OFF",
  tags: ["AI Agents", "MCP", "LLMs", "Python", "LangGraph", "RAG"],
};

const defaultHeroStats: { icon: LucideIcon; value: string; label: string }[] = [
  { icon: Clock, value: "40+ Hours", label: "Course Duration" },
  { icon: LayoutTemplate, value: "10+ Level", label: "Advanced Modules" },
  { icon: Wrench, value: "12+ Tools", label: "Industry Tools" },
];

interface CourseResourceCard {
  icon: LucideIcon;
  title: string;
  sub: string;
  eyebrow: string;
  category: string;
  detail: string;
  advantage: string;
  points: string[];
}

const defaultCourseResources: CourseResourceCard[] = [
  {
    icon: Video,
    title: "Mock Interview Videos",
    sub: "Learn how to answer real-world interview questions.",
    eyebrow: "Interview Prep",
    category: "Interview Practice",
    detail: "Watch real AI-engineer interviews and learn exactly how strong candidates answer.",
    advantage: "Interview Ready",
    points: [
      "Walkthroughs of real AI-engineer interviews",
      "Model answers for the toughest questions",
      "Tips straight from hiring managers",
    ],
  },
  {
    icon: FileText,
    title: "Interview Q&A PDF",
    sub: "Access curated questions and expert answers.",
    eyebrow: "Interview Prep",
    category: "Curated Question Bank",
    detail: "A downloadable bank of the questions this role actually gets asked.",
    advantage: "200+ Questions, Answered",
    points: [
      "Curated by working AI engineers",
      "Expert answers you can adapt",
      "Download, print and revise anywhere",
    ],
  },
  {
    icon: LayoutTemplate,
    title: "Blueprints & Templates",
    sub: "Use ready-to-apply professional resources.",
    eyebrow: "Resources",
    category: "Ready-to-Use Assets",
    detail: "Skip the blank page with blueprints and templates used in real projects.",
    advantage: "Ship Faster",
    points: [
      "Project blueprints with starter code",
      "Resume and portfolio templates",
      "Module-by-module checklists",
    ],
  },
  {
    icon: ClipboardCheck,
    title: "Practice Tests",
    sub: "Test your knowledge and identify weak areas.",
    eyebrow: "Assessment",
    category: "Know Where You Stand",
    detail: "Quizzes and mock tests after every module keep your learning honest.",
    advantage: "Test Yourself",
    points: [
      "A quiz after every module",
      "Full mock tests with scoring",
      "Instant weakness detection",
    ],
  },
  {
    icon: Users,
    title: "Community & Peers",
    sub: "Connect, collaborate, and learn with others.",
    eyebrow: "Network",
    category: "Never Learn Alone",
    detail: "Join a private community of learners building agents alongside you.",
    advantage: "Learn Together",
    points: [
      "Private learner community",
      "Peer reviews on your projects",
      "Group study and build channels",
    ],
  },
  {
    icon: MessageCircle,
    title: "Doubt Resolution",
    sub: "Get answers to your learning questions.",
    eyebrow: "Support",
    category: "Answers When You're Stuck",
    detail: "No question waits days for an answer — help is always close.",
    advantage: "Never Stuck",
    points: [
      "Answers within 24 hours",
      "Weekly live doubt sessions",
      "Searchable doubt archive",
    ],
  },
  {
    icon: Bot,
    title: "AI Learning Assistant",
    sub: "Ask questions and get instant answers as you learn.",
    eyebrow: "Co-Pilot",
    category: "Always-On AI Tutor",
    detail: "Ask questions and get instant explanations while you learn.",
    advantage: "24/7 Co-Pilot",
    points: [
      "Explains complex concepts in simple, relatable analogies",
      "Generates custom practice problems on the spot",
      "Supports multilingual queries in 5+ Indian languages",
    ],
  },
  {
    icon: NotebookPen,
    title: "Smart Notes & Summaries",
    sub: "Revise key concepts with AI-generated notes.",
    eyebrow: "AI Toolkit",
    category: "Notes That Write Themselves",
    detail: "Every lesson comes with clean AI notes so revision takes minutes, not hours.",
    advantage: "Revise in Minutes",
    points: [
      "AI-generated notes for every lesson",
      "Key-concept summaries",
      "Export to PDF for offline revision",
    ],
  },
  {
    icon: BarChart3,
    title: "Skill Gap Analysis",
    sub: "Discover areas where you need improvement.",
    eyebrow: "Insights",
    category: "See Your Gaps Clearly",
    detail: "A readiness score shows exactly which skills need work before you apply.",
    advantage: "Know Your Score",
    points: [
      "Benchmark against industry expectations",
      "Per-skill readiness scores",
      "A targeted plan to close each gap",
    ],
  },
  {
    icon: Route,
    title: "Personalised Learning Path",
    sub: "Follow a learning journey aligned with your goals.",
    eyebrow: "AI Toolkit",
    category: "Your Custom Route",
    detail: "A path built around your goal — skip what you know, focus on what you don't.",
    advantage: "Your Route",
    points: [
      "Path aligned to your career goal",
      "Skip lessons you already know",
      "Milestones to keep you on track",
    ],
  },
  {
    icon: CalendarClock,
    title: "Expert Office Hours",
    sub: "Get personalised guidance from industry professionals.",
    eyebrow: "Mentorship",
    category: "1:1 Mentor Access",
    detail: "Regular live sessions with your instructor and industry mentors.",
    advantage: "Talk to Experts",
    points: [
      "Live sessions with the instructor",
      "Priority queue for your doubts",
      "Career guidance from people who hire",
    ],
  },
  {
    icon: Award,
    title: "Completion Certificate",
    sub: "Showcase your completion and the skills you gained.",
    eyebrow: "Credential",
    category: "Proof of Your Skills",
    detail: "A verified certificate that hiring partners can actually trust.",
    advantage: "Verified Proof",
    points: [
      "Verified TalentCIR certificate",
      "Shareable on LinkedIn in one click",
      "Recognised by hiring partners",
    ],
  },
];

const defaultReviews = [
  {
    n: "Ananya Gupta",
    a: "https://randomuser.me/api/portraits/women/12.jpg",
    w: "2 weeks ago",
    t: "The MCP module alone was worth it. I shipped my first internal agent at work within a month.",
  },
  {
    n: "Rahul Mehta",
    a: "https://randomuser.me/api/portraits/men/14.jpg",
    w: "1 month ago",
    t: "Very well structured. Projects build on each other, so by the capstone everything clicks.",
  },
  {
    n: "Sneha Iyer",
    a: "https://randomuser.me/api/portraits/women/65.jpg",
    w: "2 months ago",
    t: "Clear explanations and up-to-date content. The evaluation section is rare in other courses.",
  },
];

const defaultFaqs = [
  {
    q: "Do I need prior AI experience?",
    a: "Basic Python is enough. We cover LLM fundamentals from the start.",
  },
  {
    q: "Are the projects included in the course?",
    a: "Yes, all 12 projects come with starter code and walkthroughs.",
  },
  {
    q: "Will I get a certificate?",
    a: "Yes, a verified TalentCIR certificate on completion.",
  },
  {
    q: "Can I ask doubts during the course?",
    a: "Yes, through the Q&A section and live doubt sessions.",
  },
  {
    q: "How long will I have access?",
    a: "You get lifetime access, including future updates.",
  },
  {
    q: "Is the course updated with the latest tools?",
    a: "Content is refreshed regularly as the agent ecosystem evolves.",
  },
];

const languageLabels: Record<string, string> = {
  EN: "English",
  HI: "Hindi",
  TA: "Tamil",
  TE: "Telugu",
};

const Stars = ({ v, size = "h-4 w-4" }: { v: number; size?: string }) => (
  <div className="flex items-center gap-0.5" aria-hidden="true">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={cn(size, i < Math.round(v) ? "fill-warning text-warning" : "text-muted")}
      />
    ))}
  </div>
);

type LiveCourseDetail = Awaited<ReturnType<typeof fetchCourseBySlug>>;

const CourseDetail = () => {
  const { slug, courseId } = useParams<{ slug?: string; courseId?: string }>();
  const activeSlug = slug ?? courseId ?? "ai-engineer-agentic-track";
  const catalogueCourse = findLearningCourse(activeSlug);
  const navigate = useNavigate();
  const { user } = useSupabaseUser();

  const [previewTitle, setPreviewTitle] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [liveCourse, setLiveCourse] = useState<LiveCourseDetail>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [busyAction, setBusyAction] = useState<string | null>(null);

  const dbSlug =
    activeSlug === "digital-marketing-with-ai-tools" ? "digital-marketing-with-ai" : activeSlug;

  const loadCourseState = useCallback(async () => {
    if (!user) {
      setEnrollment(null);
      return;
    }
    try {
      const c = await fetchCourseBySlug(dbSlug);
      setLiveCourse(c);
      if (c) {
        const [enrs, wal] = await Promise.all([
          fetchMyEnrollments().catch(() => [] as Enrollment[]),
          fetchWallet().catch(() => null),
        ]);
        setEnrollment(enrs.find((e) => e.course_id === c.id) ?? null);
        setWalletBalance(Number(wal?.bal ?? 0));
      } else {
        setEnrollment(null);
      }
    } catch {
      // Keep static catalogue fallback if offline
    }
  }, [dbSlug, user]);

  useEffect(() => {
    void loadCourseState();
  }, [loadCourseState]);

  if (!catalogueCourse && activeSlug !== "ai-engineer-agentic-track") {
    return <NotFound />;
  }

  const course = catalogueCourse
    ? {
        ...catalogueCourse,
        ratings: catalogueCourse.learners,
        discount:
          catalogueCourse.price === "Free"
            ? "Free Course"
            : `${Math.round(
                (1 -
                  Number(catalogueCourse.price.replace(/[^0-9]/g, "")) /
                    Number(catalogueCourse.originalPrice.replace(/[^0-9]/g, ""))) *
                  100,
              )}% OFF`,
      }
    : defaultAiTrackCourse;

  const heroImage = catalogueCourse?.image ?? defaultCourseImage;

  const heroStats = catalogueCourse
    ? [
        {
          icon: Clock,
          label: "Course Duration",
          value: catalogueCourse.duration.replace("hrs", "Hours"),
        },
        {
          icon: LayoutTemplate,
          label: "Advanced Modules",
          value: `${catalogueCourse.modules.length} Modules`,
        },
        {
          icon: Wrench,
          label: "Industry Tools",
          value: `${catalogueCourse.toolNames.length} Tools`,
        },
      ]
    : defaultHeroStats;

  const tools: CourseToolBadge[] = catalogueCourse
    ? catalogueCourse.toolNames.map((name) => ({
        name,
        ...(courseToolIconMap[name] ?? {}),
      }))
    : defaultAiTrackTools;

  const resources = catalogueCourse
    ? defaultCourseResources.map((item) => ({
        ...item,
        sub:
          item.title === "Mock Interview Videos"
            ? `Practise interview questions for ${catalogueCourse.subject}.`
            : item.title === "Blueprints & Templates"
              ? `Apply templates to build ${catalogueCourse.project}.`
              : item.title === "Practice Tests"
                ? `Check your understanding of ${catalogueCourse.tags.slice(0, 3).join(", ")}.`
                : item.title === "Expert Office Hours"
                  ? `Discuss your ${catalogueCourse.subject} questions with mentors.`
                  : item.sub,
      }))
    : defaultCourseResources;

  const faqs = catalogueCourse
    ? [
        { q: "What do I need before starting?", a: catalogueCourse.prerequisites },
        {
          q: "What will I build during this course?",
          a: `The course exercises lead to ${catalogueCourse.project}. You will document your approach and review your work against the learning goals.`,
        },
        {
          q: "Which tools will I practise with?",
          a: `You will work with ${catalogueCourse.toolNames.join(", ")}. Some optional services may require their own accounts or paid plans.`,
        },
        {
          q: "How long is the course?",
          a: `The planned course duration is ${catalogueCourse.duration}, organised into ${catalogueCourse.modules.length} modules. Allow additional time for exercises and your project.`,
        },
        {
          q: "Which languages are offered?",
          a: `The listing includes ${catalogueCourse.languages.map((lang) => languageLabels[lang] ?? lang).join(", ")}. Recordings and availability will be confirmed before launch.`,
        },
        {
          q: "Can I book a private expert session?",
          a: `Use Available Slots to explore the sample ${catalogueCourse.subject} mentoring calendar. Live sessions are not yet bookable.`,
        },
      ]
    : defaultFaqs;

  const reviews = catalogueCourse
    ? [
        {
          ...defaultReviews[0],
          t: `The exercises helped me connect ${catalogueCourse.tags[0]} with ${catalogueCourse.tags[1]} and approach my project with more confidence.`,
        },
        {
          ...defaultReviews[1],
          t: `Building ${catalogueCourse.project} made the lessons feel practical. The step-by-step structure helped me organise my work.`,
        },
        {
          ...defaultReviews[2],
          t: `I liked the clear explanations of ${catalogueCourse.tags[2]} and the opportunities to practise before moving to the next module.`,
        },
      ]
    : defaultReviews;

  const sortedLiveModules = liveCourse?.lms_modules
    ? liveCourse.lms_modules.slice().sort((a, b) => a.position - b.position)
    : [];

  const handleEnroll = async () => {
    if (!user) {
      navigate("/auth?mode=signup");
      return;
    }
    if (enrollment) {
      document.getElementById("course-curriculum")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (!liveCourse) {
      toast.info(`${course.title} enrolment is opening soon. Explore your active courses in Talento Pro.`);
      navigate("/talento-pro");
      return;
    }

    const priceNum = Number(liveCourse.price_inr);
    setBusyAction("enroll");
    try {
      let orderId: string | undefined;
      if (priceNum > 0) {
        const useWallet = walletBalance >= priceNum * 1.18;
        const order = await createOrder({
          itemType: "course",
          itemId: liveCourse.id,
          gateway: useWallet ? "wallet" : "razorpay",
          idempotencyKey: `course-${liveCourse.id}-${Math.floor(Date.now() / 120000)}`,
        });
        const paid =
          order.status === "entitled"
            ? order
            : useWallet
              ? await payOrderWithWallet(order.id)
              : await payWithRazorpay(order, {
                  name: user.email?.split("@")[0] ?? "Candidate",
                  email: user.email ?? "",
                });
        orderId = paid.id;
      }
      const nextEnrollment = await enrollInCourse(liveCourse.id, orderId);
      setEnrollment(nextEnrollment);
      await loadCourseState();
      toast.success(`Enrolled in ${course.title}! Start completing modules below.`);
      document.getElementById("course-curriculum")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      toast.error(backendErrorMessage(err));
    } finally {
      setBusyAction(null);
    }
  };

  const handleCompleteModule = async (moduleId: string) => {
    if (!liveCourse || !enrollment) return;
    setBusyAction(`mod-${moduleId}`);
    try {
      const updated = await completeModule(liveCourse.id, moduleId);
      setEnrollment(updated);
      toast.success(
        updated.status === "completed"
          ? "Course completed! Verified certificate added to your profile."
          : `Module completed (${Math.round(Number(updated.progress_pct))}% progress).`,
      );
    } catch (err) {
      toast.error(backendErrorMessage(err));
    } finally {
      setBusyAction(null);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      navigate("/auth?mode=signup");
      return;
    }
    void handleEnroll();
  };

  const handleWriteReview = () => {
    if (!user) {
      navigate("/auth?mode=signup");
      return;
    }
    toast.info("Complete at least one module in your enrolled course to submit a verified review.");
  };

  return (
    <>
      <Helmet>
        <title>{course.title} | TalentCIR Learning</title>
        <meta name="description" content={course.description} />
      </Helmet>

      <Layout>
        <section className="bg-cream pt-24 md:pt-28 pb-10">
          <div className="container px-4 md:px-6">
            {catalogueCourse && (
              <p className="mb-4 text-xs text-muted-foreground">
                Sample course outline and instructor profile. Course recordings, enrolment and mentor availability are
                pending confirmation.
              </p>
            )}

            <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground mb-6 flex gap-1.5 flex-wrap">
              <Link to="/" className="hover:text-primary">
                Home
              </Link>
              <span aria-hidden="true">›</span>
              <Link to="/learning" className="hover:text-primary">
                Learning
              </Link>
              <span aria-hidden="true">›</span>
              <span>{catalogueCourse?.category ?? "AI & ML"}</span>
              <span aria-hidden="true">›</span>
              <span className="text-foreground">{course.title}</span>
            </nav>

            <div className="grid lg:grid-cols-[1.15fr_0.9fr] gap-8 lg:items-stretch">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                    {catalogueCourse && !catalogueCourse.bestseller ? catalogueCourse.category : "Bestseller"}
                  </span>
                  <span className="text-xs text-muted-foreground">{course.learners} learners enrolled</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold font-display leading-[1.08] mb-2">{course.title}</h1>
                <p className="text-xl md:text-2xl font-display font-semibold text-primary mb-4">{course.subtitle}</p>
                <p className="text-muted-foreground mb-6 max-w-xl">{course.description}</p>

                <div className="flex items-center gap-3 mb-5">
                  <img
                    src={heroImage}
                    alt={course.instructor}
                    className="h-11 w-11 rounded-full object-cover object-top"
                  />
                  <div>
                    <p className="font-semibold text-sm">{course.instructor}</p>
                    <p className="text-xs text-muted-foreground">{course.role}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm mb-5">
                  <span className="flex items-center gap-1.5">
                    <Stars v={course.rating} /> <b>{course.rating}</b>{" "}
                    <span className="text-muted-foreground">({course.ratings} reviews)</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {course.learners} learners
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <BarChart3 className="h-4 w-4" />
                    {catalogueCourse?.level ?? "Intermediate"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-card border rounded-full px-3 py-1">
                      {tag}
                    </span>
                  ))}
                </div>

                <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-5 border-t border-border/70 pt-6" role="list">
                  {heroStats.map(({ icon: Icon, value, label }) => (
                    <li key={label} className="flex max-w-[190px] items-start gap-2.5">
                      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <div>
                        <strong className="block text-sm font-semibold">{label}</strong>
                        <span className="mt-0.5 block text-[12.5px] text-muted-foreground">{value}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-auto lg:h-full bg-muted shadow-lg">
                <img
                  src={heroImage}
                  alt={`${course.instructor} course preview`}
                  className="w-full h-full object-cover object-top"
                />
                <Button
                  onClick={() => setPreviewTitle("Course overview")}
                  variant="secondary"
                  size="icon"
                  className="absolute inset-0 m-auto h-16 w-16 rounded-full bg-card/95 flex items-center justify-center shadow-xl hover:scale-105 transition"
                  aria-label="Preview course"
                >
                  <Play className="h-6 w-6 text-primary fill-primary ml-1" />
                </Button>
                <span className="absolute bottom-4 left-4 text-xs font-medium bg-foreground/70 text-background rounded-full px-3 py-1.5 flex items-center gap-1.5">
                  <CirclePlay className="h-3.5 w-3.5" /> Preview Course
                </span>
              </div>
            </div>

            <div className="mt-10 rounded-2xl border bg-card p-6 md:p-7 shadow-sm flex flex-col gap-6 lg:flex-row lg:items-center">
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                {user ? (
                  <Button
                    type="button"
                    size="lg"
                    disabled={busyAction === "enroll"}
                    onClick={() => void handleEnroll()}
                    className="gap-2"
                  >
                    {busyAction === "enroll" && <Loader2 className="h-4 w-4 animate-spin" />}
                    {enrollment
                      ? enrollment.status === "completed"
                        ? "Review Curriculum"
                        : "Continue Learning"
                      : "Enroll Now"}
                  </Button>
                ) : (
                  <Button asChild size="lg">
                    <Link to="/auth?mode=signup">Enroll Now</Link>
                  </Button>
                )}

                <Button variant="outline" size="lg" className="gap-2" onClick={handleAddToCart}>
                  <ShoppingCart className="h-4 w-4" /> Add to Cart
                </Button>
              </div>

              {enrollment && (
                <div className="flex-1 max-w-xs">
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">
                    {enrollment.status === "completed"
                      ? "Completed · Verified certificate issued"
                      : `${Math.round(Number(enrollment.progress_pct))}% completed`}
                  </p>
                  <Progress value={Number(enrollment.progress_pct)} className="h-2" />
                </div>
              )}

              <div className="lg:text-right lg:ml-auto shrink-0">
                <div className="flex items-center gap-3 lg:justify-end mb-1">
                  <span className="text-3xl font-bold font-display">{course.price}</span>
                  <span className="text-muted-foreground line-through">{course.originalPrice}</span>
                  <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded">
                    {course.discount}
                  </span>
                </div>
                <p className="text-xs text-primary flex items-center gap-1 lg:justify-end">
                  <Clock className="h-3.5 w-3.5" />{" "}
                  {catalogueCourse ? "Listed course price · enrolment opening soon" : "Offer ends in 2 days"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="container px-4 md:px-6 py-14 space-y-16">
          {/* What You Get With This Course */}
          <section>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-3xl md:text-4xl font-bold font-display">
                What You Get With
                <br />
                <span className="text-primary">This Course</span>
              </h2>
              <p className="text-muted-foreground mt-3">
                Every course comes packed with 12 career-accelerating resources, AI tools, and 1:1 mentor support — all
                unlocked from day one.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {resources.map((item, idx) => (
                <div
                  key={item.title}
                  className="rounded-2xl border bg-card p-5 flex flex-col gap-3 hover:border-primary/40 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <item.icon className="h-5 w-5" />
                    </span>
                    <span className="text-[10px] font-semibold text-muted-foreground/70 tabular-nums">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary/70 mb-1">
                      {item.eyebrow}
                    </p>
                    <p className="text-sm font-semibold leading-snug">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Curriculum */}
          <CourseCurriculum
            key={`curriculum-${activeSlug}`}
            modules={catalogueCourse?.modules}
            onPreview={setPreviewTitle}
            enrollment={enrollment}
            liveModules={sortedLiveModules}
            busyAction={busyAction}
            onCompleteModule={(moduleId) => void handleCompleteModule(moduleId)}
          />

          {/* Tools You'll Work With */}
          <section>
            <h2 className="text-3xl font-bold font-display mb-1">Tools You'll Work With</h2>
            <p className="text-muted-foreground mb-6">
              {catalogueCourse
                ? `Build practical ${catalogueCourse.subject} skills with these industry tools.`
                : "Hands-on experience with the tools used by leading AI teams."}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {tools.map((tool) => (
                <div
                  key={tool.name}
                  className="rounded-xl border bg-card py-4 px-3 flex items-center justify-center gap-2.5 hover:border-primary/40 transition"
                >
                  {tool.img ? (
                    <img src={tool.img} alt={tool.name} className="h-5 w-auto shrink-0" />
                  ) : (
                    tool.icon && <tool.icon className="h-5 w-5 shrink-0" />
                  )}
                  <span className={cn("text-sm font-semibold whitespace-nowrap", tool.hideName && "sr-only")}>
                    {tool.name}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Meet Your Instructor */}
          <section>
            <h2 className="text-3xl font-bold font-display mb-6">Meet Your Instructor</h2>
            <div className="grid lg:grid-cols-[minmax(0,320px)_1fr] gap-10 items-stretch">
              <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
                <img
                  src={heroImage}
                  alt={course.instructor}
                  className="relative w-full h-80 lg:h-full rounded-2xl object-cover object-top"
                />
                <div className="absolute top-4 left-4 rounded-full bg-card/95 border border-border shadow-sm px-3 py-1.5 inline-flex items-center gap-1.5 text-xs font-semibold">
                  <Crown className="h-3.5 w-3.5 text-primary" /> Top Instructor
                </div>
                <div className="absolute bottom-4 right-4 rounded-xl bg-card/95 border border-border shadow-sm px-3 py-2 flex items-center gap-2">
                  <Stars v={course.rating} size="h-3.5 w-3.5" />
                  <span className="text-xs font-bold">{course.rating}</span>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold font-display">{course.instructor}</h3>
                <p className="text-sm text-primary font-semibold mb-4">{course.role}</p>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-xl">
                  {catalogueCourse?.bio ??
                    "Neha has spent over a decade building ML systems and now leads applied AI work on agentic products. She has trained more than 1,20,000 students and engineers worldwide. Before teaching full time, she shipped search and recommendation systems used by millions of people, and has taken LLM-powered features from prototype to production with teams of all sizes. Her sessions are built around the mistakes she has watched real teams make, so you learn what actually holds up once your agent is live in front of users — not just what works in a demo."}
                </p>

                <div className="grid grid-cols-3 gap-3 max-w-xl">
                  <div className="rounded-xl bg-card border border-border p-4">
                    <Users className="h-5 w-5 text-primary mb-2" />
                    <p className="text-lg font-bold leading-tight">{course.learners}</p>
                    <p className="text-xs text-muted-foreground">Students taught</p>
                  </div>
                  <div className="rounded-xl bg-card border border-border p-4">
                    <Clock className="h-5 w-5 text-primary mb-2" />
                    <p className="text-lg font-bold leading-tight">{catalogueCourse ? "Practical" : "10+ Years"}</p>
                    <p className="text-xs text-muted-foreground">
                      {catalogueCourse ? "Course-led guidance" : "Industry experience"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-card border border-border p-4">
                    <Star className="h-5 w-5 text-primary mb-2" />
                    <p className="text-lg font-bold leading-tight">{course.rating} / 5</p>
                    <p className="text-xs text-muted-foreground">Instructor rating</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Book Private Sessions with an Industry Expert */}
          <ExpertBookingSection
            key={`experts-${activeSlug}`}
            expertRoles={catalogueCourse?.expertRoles}
            subject={catalogueCourse?.subject}
          />

          {/* Student Reviews */}
          <section>
            <div className="flex flex-wrap items-end justify-between mb-6 gap-4">
              <div>
                <h2 className="text-3xl font-bold font-display mb-1">Student Reviews</h2>
                {catalogueCourse && (
                  <p className="text-xs text-muted-foreground mb-2">
                    Illustrative learner feedback — not verified testimonials.
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">{course.rating}</span>
                  <span className="text-sm text-muted-foreground">out of 5</span>
                  <Stars v={course.rating} />
                  <span className="text-sm text-muted-foreground">({course.ratings} reviews)</span>
                </div>
              </div>
              <Button variant="outline" onClick={handleWriteReview}>
                Write a Review
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {reviews.map((rev) => (
                <div key={rev.n} className="rounded-2xl border bg-card p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={rev.a} alt={rev.n} className="h-10 w-10 rounded-full" />
                    <div>
                      <p className="font-semibold text-sm">{rev.n}</p>
                      <div className="flex items-center gap-2">
                        <Stars v={5} size="h-3 w-3" />
                        <span className="text-xs text-muted-foreground">{rev.w}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{rev.t}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Frequently Asked Questions */}
          <section>
            <h2 className="text-3xl font-bold font-display mb-6">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {faqs.map((item, idx) => {
                const isOpen = openFaq === idx;
                const answerId = `course-faq-${idx}`;
                return (
                  <div key={item.q} className="rounded-xl border bg-card">
                    <Button
                      variant="ghost"
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between px-4 py-3.5 h-auto whitespace-normal text-left text-sm font-medium"
                    >
                      {item.q}
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 shrink-0 transition-transform motion-reduce:transition-none",
                          isOpen && "rotate-180",
                        )}
                      />
                    </Button>
                    {isOpen && (
                      <p id={answerId} className="px-4 pb-4 text-sm text-muted-foreground">
                        {item.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Bottom CTA */}
          <section className="rounded-2xl bg-primary text-primary-foreground p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold font-display mb-2">
                {catalogueCourse
                  ? `Start Your ${catalogueCourse.category} Journey Today`
                  : "Start Your AI Engineering Journey Today"}
              </h2>
              <p className="text-primary-foreground/80 max-w-xl">
                {catalogueCourse
                  ? `Build ${catalogueCourse.project} and take the next step in ${catalogueCourse.subject}.`
                  : "Learn from industry experts, build real agents and take your career to the next level."}
              </p>
            </div>
            {user ? (
              <Button
                type="button"
                variant="secondary"
                size="lg"
                disabled={busyAction === "enroll"}
                onClick={() => void handleEnroll()}
                className="gap-2 shrink-0"
              >
                {enrollment ? "Continue Learning" : "Enroll Now"} <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button asChild variant="secondary" size="lg" className="gap-2 shrink-0">
                <Link to="/auth?mode=signup">
                  Enroll Now <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </section>
        </div>
      </Layout>

      <CoursePreviewDialog
        title={previewTitle}
        onClose={() => setPreviewTitle(null)}
        videoUrl={previewVideoUrl}
        courseName={course.title}
      />
    </>
  );
};

export default CourseDetail;
