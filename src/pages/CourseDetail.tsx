import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Star, Users, BarChart3, Play, Clock, ShoppingCart, Infinity as InfinityIcon, Award, FolderKanban,
  Download, Smartphone, ShieldCheck, PlayCircle, Sparkles, CheckCircle2, ChevronDown, UserRound, ArrowRight, Crown, Loader2, Lock,
} from "lucide-react";
import { toast } from "sonner";
import expertImg from "@/assets/expert-course-1.jpg";
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

const defaultCourse = {
  title: "AI Engineer Agentic Track",
  subtitle: "The Complete Agent & MCP Course",
  description: "Design, build and ship autonomous AI agents. Learn LLM tool use, the Model Context Protocol, multi-agent orchestration and production deployment through hands-on projects.",
  instructor: "Dr. Neha Sharma",
  role: "AI Engineer & Applied ML Researcher",
  rating: 4.7,
  ratings: "32,408",
  learners: "1,20,000+",
  price: "Free",
  originalPrice: "₹3,999",
  discount: "100% OFF",
  category: "AI & ML",
  level: "Intermediate",
  tags: ["AI Agents", "MCP", "LLMs", "Python", "LangGraph", "RAG"],
};

const highlights = [
  { icon: PlayCircle, title: "45+ Video Lessons", sub: "14+ hours of content" },
  { icon: FolderKanban, title: "12 Real Projects", sub: "Build your portfolio" },
  { icon: Sparkles, title: "AI Tools Included", sub: "Learn with the latest stack" },
  { icon: Award, title: "Certificate", sub: "Verified on your profile" },
  { icon: Clock, title: "Lifetime Access", sub: "Learn at your pace" },
];

const includes = [
  { icon: InfinityIcon, label: "Lifetime access" },
  { icon: Award, label: "Verified certificate of completion" },
  { icon: FolderKanban, label: "Hands-on real-world projects" },
  { icon: Download, label: "Downloadable resources" },
  { icon: Smartphone, label: "Access on mobile & desktop" },
  { icon: ShieldCheck, label: "30-day money back guarantee" },
];

const outcomes = [
  "Understand how LLM agents plan, reason and act",
  "Build tools and servers with the Model Context Protocol",
  "Orchestrate multi-agent workflows with LangGraph",
  "Add memory and retrieval (RAG) to your agents",
  "Evaluate, monitor and debug agent behaviour",
  "Deploy agents to production with guardrails",
  "Build a real-world portfolio of agent projects",
  "Get career guidance and interview preparation",
];

const audience = [
  "Developers who want to move into AI engineering",
  "ML engineers looking to build agentic systems",
  "Product builders shipping AI features",
  "Freelancers who want to offer AI automation",
  "Students looking for practical AI skills",
];

const fallbackModules = [
  { t: "Introduction to AI Agents", l: 3, d: "45 mins", items: ["What makes an agent", "Agents vs. chatbots", "Course setup"] },
  { t: "LLM Fundamentals for Engineers", l: 4, d: "1 hr 20 mins", items: ["Tokens & context", "Prompting patterns", "Structured outputs", "Model selection"] },
  { t: "Tool Use & Function Calling", l: 5, d: "1 hr 30 mins", items: ["Defining tools", "Error handling", "Parallel calls", "Tool design", "Mini project"] },
  { t: "Model Context Protocol (MCP)", l: 5, d: "1 hr 45 mins", items: ["MCP architecture", "Building an MCP server", "Resources & prompts", "Auth", "Project"] },
  { t: "Memory & Retrieval (RAG)", l: 4, d: "1 hr 15 mins", items: ["Embeddings", "Vector stores", "Long-term memory", "Project"] },
  { t: "Multi-Agent Orchestration", l: 5, d: "1 hr 40 mins", items: ["Planner–executor", "LangGraph", "Handoffs", "State", "Project"] },
  { t: "Evaluation & Observability", l: 4, d: "1 hr 10 mins", items: ["Eval sets", "Tracing", "Cost & latency", "Regression tests"] },
  { t: "Deploying Agents to Production", l: 4, d: "1 hr 15 mins", items: ["APIs & queues", "Guardrails", "Scaling", "Security"] },
  { t: "Capstone: Build Your Own Agent", l: 4, d: "1 hr 30 mins", items: ["Scoping", "Build", "Evaluate", "Present"] },
  { t: "Bonus: Career & Interview Guidance", l: 3, d: "45 mins", items: ["Portfolio", "Interview prep", "Freelancing"] },
];

const tools = ["OpenAI", "Claude", "Gemini", "LangChain", "LangGraph", "MCP", "Pinecone", "Hugging Face", "Python", "FastAPI", "Docker", "GitHub"];

const reviews = [
  { n: "Ananya Gupta", a: "https://randomuser.me/api/portraits/women/12.jpg", w: "2 weeks ago", t: "The MCP module alone was worth it. I shipped my first internal agent at work within a month." },
  { n: "Rahul Mehta", a: "https://randomuser.me/api/portraits/men/14.jpg", w: "1 month ago", t: "Very well structured. Projects build on each other, so by the capstone everything clicks." },
  { n: "Sneha Iyer", a: "https://randomuser.me/api/portraits/women/65.jpg", w: "2 months ago", t: "Clear explanations and up-to-date content. The evaluation section is rare in other courses." },
];

const faqs = [
  { q: "Do I need prior AI experience?", a: "Basic Python is enough. We cover LLM fundamentals from the start." },
  { q: "Are the projects included in the course?", a: "Yes, all hands-on projects come with starter code and walkthroughs." },
  { q: "Will I get a certificate?", a: "Yes, completing 100% of modules issues a verified TalentCIR certificate directly onto your profile." },
  { q: "Can I ask doubts during the course?", a: "Yes, through the Q&A section and live mentor sessions." },
  { q: "How long will I have access?", a: "You get lifetime access, including future updates." },
  { q: "Is the course updated with the latest tools?", a: "Content is refreshed regularly as the ecosystem evolves." },
];

const Stars = ({ v, size = "h-4 w-4" }: { v: number; size?: string }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={cn(size, i < Math.round(v) ? "fill-[hsl(33,100%,50%)] text-[hsl(33,100%,50%)]" : "text-muted")} />
    ))}
  </div>
);

type LiveCourseDetail = Awaited<ReturnType<typeof fetchCourseBySlug>>;

const CourseDetail = () => {
  const { slug = "ai-engineer-agentic-track" } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const { user } = useSupabaseUser();
  const [open, setOpen] = useState<number | null>(0);
  const [faq, setFaq] = useState<number | null>(null);
  const [allOpen, setAllOpen] = useState(false);

  const [liveCourse, setLiveCourse] = useState<LiveCourseDetail>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [busyAction, setBusyAction] = useState<string | null>(null);

  const loadCourseState = useCallback(async () => {
    try {
      const c = await fetchCourseBySlug(slug);
      setLiveCourse(c);
      if (user && c) {
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
      // Keep static fallback if offline
    }
  }, [slug, user]);

  useEffect(() => {
    void loadCourseState();
  }, [loadCourseState]);

  const priceNum = liveCourse ? Number(liveCourse.price_inr) : 0;
  const origPriceNum = liveCourse?.original_price_inr ? Number(liveCourse.original_price_inr) : 3999;
  const discountPct =
    origPriceNum > priceNum && origPriceNum > 0
      ? `${Math.round(((origPriceNum - priceNum) / origPriceNum) * 100)}% OFF`
      : defaultCourse.discount;

  const course = {
    title: liveCourse?.title ?? defaultCourse.title,
    subtitle: liveCourse?.subtitle ?? defaultCourse.subtitle,
    description: defaultCourse.description,
    instructor: liveCourse?.instructor_name ?? defaultCourse.instructor,
    role: defaultCourse.role,
    rating: liveCourse?.rating ? Number(liveCourse.rating) : defaultCourse.rating,
    ratings: defaultCourse.ratings,
    learners: liveCourse?.learners_count ? Number(liveCourse.learners_count).toLocaleString("en-IN") : defaultCourse.learners,
    price: liveCourse ? (priceNum === 0 ? "Free" : `₹${priceNum.toLocaleString("en-IN")}`) : defaultCourse.price,
    originalPrice: `₹${origPriceNum.toLocaleString("en-IN")}`,
    discount: discountPct,
    category: liveCourse?.category ?? defaultCourse.category,
    level: liveCourse?.level ?? defaultCourse.level,
    tags: liveCourse?.skills && liveCourse.skills.length > 0 ? liveCourse.skills : defaultCourse.tags,
  };

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
      navigate("/talento-pro");
      return;
    }

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
          : `Module completed (${Math.round(Number(updated.progress_pct))}% progress).`
      );
    } catch (err) {
      toast.error(backendErrorMessage(err));
    } finally {
      setBusyAction(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>{course.title} | TalentCIR Learning</title>
        <meta name="description" content={course.description} />
      </Helmet>
      <Layout>
        {/* Hero */}
        <section className="bg-[hsl(var(--cream))] pt-24 md:pt-28 pb-10">
          <div className="container px-4 md:px-6">
            <nav className="text-xs text-muted-foreground mb-6 flex gap-1.5 flex-wrap">
              <Link to="/" className="hover:text-primary">Home</Link><span>›</span>
              <Link to="/learning" className="hover:text-primary">Learning</Link><span>›</span>
              <span>{course.category}</span><span>›</span>
              <span className="text-foreground">{course.title}</span>
            </nav>

            <div className="grid lg:grid-cols-[1.15fr_0.9fr_0.85fr] gap-8 items-start">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full">Bestseller</span>
                  <span className="text-xs text-muted-foreground">{course.learners} learners enrolled</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold font-display leading-[1.08] mb-2">{course.title}</h1>
                <p className="text-xl md:text-2xl font-display font-semibold text-primary mb-4">{course.subtitle}</p>
                <p className="text-muted-foreground mb-6 max-w-xl">{course.description}</p>
                <div className="flex items-center gap-3 mb-5">
                  <img src={expertImg} alt={course.instructor} className="h-11 w-11 rounded-full object-cover object-top" />
                  <div>
                    <p className="font-semibold text-sm">{course.instructor}</p>
                    <p className="text-xs text-muted-foreground">{course.role}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm mb-5">
                  <span className="flex items-center gap-1.5"><Stars v={course.rating} /> <b>{course.rating}</b> <span className="text-muted-foreground">({course.ratings} reviews)</span></span>
                  <span className="flex items-center gap-1.5 text-muted-foreground"><Users className="h-4 w-4" />{course.learners} learners</span>
                  <span className="flex items-center gap-1.5 text-muted-foreground capitalize"><BarChart3 className="h-4 w-4" />{course.level}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((t) => <span key={t} className="text-xs bg-card border rounded-full px-3 py-1">{t}</span>)}
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-muted shadow-lg">
                <img src={expertImg} alt={`${course.instructor} course preview`} className="w-full h-full object-cover object-top" />
                <button
                  type="button"
                  onClick={() => document.getElementById("course-curriculum")?.scrollIntoView({ behavior: "smooth" })}
                  className="absolute inset-0 m-auto h-16 w-16 rounded-full bg-card/95 flex items-center justify-center shadow-xl hover:scale-105 transition"
                  aria-label="Preview course curriculum"
                >
                  <Play className="h-6 w-6 text-primary fill-primary ml-1" />
                </button>
                <span className="absolute bottom-4 left-4 text-xs font-medium bg-foreground/70 text-background rounded-full px-3 py-1.5 flex items-center gap-1.5">
                  <PlayCircle className="h-3.5 w-3.5" /> Preview Course
                </span>
              </div>

              <div className="rounded-2xl border bg-card p-6 shadow-sm lg:sticky lg:top-24">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-3xl font-bold font-display">{course.price}</span>
                  {course.price !== course.originalPrice && (
                    <span className="text-muted-foreground line-through">{course.originalPrice}</span>
                  )}
                  <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded">{course.discount}</span>
                </div>
                <p className="text-xs text-primary flex items-center gap-1 mb-5">
                  <Clock className="h-3.5 w-3.5" />
                  {enrollment
                    ? enrollment.status === "completed"
                      ? "Completed · Verified certificate issued"
                      : `${Math.round(Number(enrollment.progress_pct))}% completed`
                    : priceNum === 0
                      ? "Free instant enrollment"
                      : "Instant lifetime access (+18% GST at checkout)"}
                </p>

                {enrollment && (
                  <div className="mb-4">
                    <Progress value={Number(enrollment.progress_pct)} className="h-2" />
                  </div>
                )}

                <Button
                  type="button"
                  disabled={busyAction === "enroll"}
                  onClick={handleEnroll}
                  className="w-full mb-3 gap-2"
                  size="lg"
                >
                  {busyAction === "enroll" && <Loader2 className="h-4 w-4 animate-spin" />}
                  {enrollment
                    ? enrollment.status === "completed"
                      ? "Review Curriculum"
                      : "Continue Learning"
                    : priceNum === 0
                      ? "Enroll for Free"
                      : `Enroll Now (${course.price})`}
                </Button>

                {user ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/talento-pro")}
                    className="w-full gap-2 mb-6"
                    size="lg"
                  >
                    <Award className="h-4 w-4" /> Open Learning Dashboard
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/auth")}
                    className="w-full gap-2 mb-6"
                    size="lg"
                  >
                    <ShoppingCart className="h-4 w-4" /> Sign In to Track Progress
                  </Button>
                )}

                <ul className="space-y-3">
                  {includes.map(({ icon: I, label }) => (
                    <li key={label} className="flex items-center gap-3 text-sm"><I className="h-4 w-4 text-muted-foreground" />{label}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10 rounded-2xl border bg-card grid grid-cols-2 md:grid-cols-5 gap-6 p-6">
              {highlights.map(({ icon: I, title, sub }) => (
                <div key={title} className="flex items-center gap-3">
                  <I className="h-7 w-7 text-primary shrink-0" />
                  <div><p className="text-sm font-semibold">{title}</p><p className="text-xs text-muted-foreground">{sub}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="container px-4 md:px-6 py-14 space-y-16">
          {/* What you'll learn */}
          <section className="grid lg:grid-cols-[1.6fr_1fr] gap-8">
            <div>
              <h2 className="text-3xl font-bold font-display mb-2">What You'll Learn</h2>
              <p className="text-muted-foreground mb-6">Gain in-demand skills and hands-on experience building production-ready projects.</p>
              <ul className="grid sm:grid-cols-2 gap-4">
                {outcomes.map((o) => <li key={o} className="flex gap-2.5 text-sm"><CheckCircle2 className="h-5 w-5 text-primary shrink-0" />{o}</li>)}
              </ul>
            </div>
            <div className="rounded-2xl bg-primary/5 border border-primary/10 p-6">
              <h3 className="font-bold font-display mb-4">Who is this course for?</h3>
              <ul className="space-y-4">
                {audience.map((a) => <li key={a} className="flex gap-3 text-sm"><UserRound className="h-5 w-5 text-primary shrink-0" />{a}</li>)}
              </ul>
            </div>
          </section>

          {/* Curriculum */}
          <section id="course-curriculum">
            <div className="flex items-end justify-between mb-5 gap-4">
              <div>
                <h2 className="text-3xl font-bold font-display mb-1">Course Curriculum</h2>
                <p className="text-sm text-muted-foreground">
                  {enrollment && sortedLiveModules.length > 0
                    ? `${sortedLiveModules.length} tracked modules • Complete all modules to earn your verified certificate`
                    : "10 modules • 41 lessons • 14+ hours of content"}
                </p>
              </div>
              {!(enrollment && sortedLiveModules.length > 0) && (
                <button type="button" onClick={() => setAllOpen(!allOpen)} className="text-sm font-medium text-primary hover:underline">
                  {allOpen ? "Collapse All" : "Expand All"}
                </button>
              )}
            </div>

            {enrollment && sortedLiveModules.length > 0 ? (
              <div className="space-y-2.5">
                {sortedLiveModules.map((m, i) => {
                  const isDone = enrollment?.completed_module_ids.includes(m.id) ?? false;
                  const isLocked = !enrollment && !m.is_preview;
                  const mins = m.duration_sec ? Math.max(1, Math.round(m.duration_sec / 60)) : 20;
                  return (
                    <div
                      key={m.id}
                      className="rounded-xl border bg-card px-4 py-3.5 flex flex-wrap items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span
                          className={cn(
                            "text-xs font-bold rounded-md h-8 w-8 flex items-center justify-center shrink-0",
                            isDone ? "bg-emerald-500 text-white" : "text-primary bg-primary/10"
                          )}
                        >
                          {isDone ? <CheckCircle2 className="h-4 w-4" /> : String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate">{m.title}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {m.kind} • {mins} mins{m.is_preview ? " • Free Preview" : ""}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-auto">
                        {isDone ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                          </span>
                        ) : enrollment ? (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={busyAction === `mod-${m.id}`}
                            onClick={() => handleCompleteModule(m.id)}
                            className="gap-1.5"
                          >
                            {busyAction === `mod-${m.id}` ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Play className="h-3.5 w-3.5" />
                            )}
                            Mark Complete
                          </Button>
                        ) : m.is_preview ? (
                          <span className="text-xs font-semibold text-primary">Preview Unlocked</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Lock className="h-3.5 w-3.5" /> Enroll to unlock
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2">
                {fallbackModules.map((m, i) => {
                  const isOpen = allOpen || open === i;
                  return (
                    <div key={m.t} className="rounded-xl border bg-card">
                      <button type="button" onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center gap-4 px-4 py-3.5 text-left">
                        <span className="text-xs font-bold text-primary bg-primary/10 rounded-md h-8 w-8 flex items-center justify-center shrink-0">{String(i + 1).padStart(2, "0")}</span>
                        <span className="flex-1 font-semibold text-sm">{m.t}</span>
                        <span className="hidden sm:block text-xs text-muted-foreground">{m.l} lessons • {m.d}</span>
                        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                      </button>
                      {isOpen && (
                        <ul className="px-4 pb-4 pl-16 space-y-2">
                          {m.items.map((it) => <li key={it} className="flex items-center gap-2 text-sm text-muted-foreground"><PlayCircle className="h-4 w-4" />{it}</li>)}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Tools */}
          <section>
            <h2 className="text-3xl font-bold font-display mb-1">Tools You'll Work With</h2>
            <p className="text-muted-foreground mb-6">Hands-on experience with the tools used by leading engineering and analytics teams.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {tools.map((t) => <div key={t} className="rounded-xl border bg-card py-4 text-center text-sm font-semibold hover:border-primary/40 transition">{t}</div>)}
            </div>
          </section>

          {/* Instructor */}
          <section>
            <h2 className="text-3xl font-bold font-display mb-6">Meet Your Instructor</h2>
            <div className="grid lg:grid-cols-[1.7fr_1fr] gap-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <img src={expertImg} alt={course.instructor} className="w-full sm:w-48 h-56 rounded-2xl object-cover object-top" />
                <div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full mb-2"><Crown className="h-3.5 w-3.5" />Top Instructor</span>
                  <h3 className="text-2xl font-bold font-display">{course.instructor}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{course.role}</p>
                  <div className="flex gap-8 mb-4">
                    <div><p className="font-bold">1,20,000+</p><p className="text-xs text-muted-foreground">Students</p></div>
                    <div><p className="font-bold">10+ Years</p><p className="text-xs text-muted-foreground">Experience</p></div>
                    <div><p className="font-bold">{course.rating}</p><p className="text-xs text-muted-foreground">Instructor rating</p></div>
                  </div>
                  <p className="text-sm text-muted-foreground">Industry practitioner who has built production systems at scale and mentored over 1,20,000 learners and engineers across India.</p>
                </div>
              </div>
              <div className="rounded-2xl bg-primary/5 border border-primary/10 p-5 space-y-3">
                <h4 className="font-semibold text-sm">What students say</h4>
                {reviews.slice(0, 2).map((r) => (
                  <div key={r.n} className="rounded-xl bg-card p-4 text-sm">
                    <p className="text-muted-foreground mb-2">"{r.t}"</p>
                    <div className="flex items-center gap-2"><img src={r.a} alt="" className="h-6 w-6 rounded-full" /><span className="font-medium text-xs">{r.n}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Reviews */}
          <section>
            <div className="flex items-end justify-between mb-6 gap-4">
              <div>
                <h2 className="text-3xl font-bold font-display mb-1">Student Reviews</h2>
                <div className="flex items-center gap-2"><span className="text-3xl font-bold">{course.rating}</span><span className="text-sm text-muted-foreground">out of 5</span><Stars v={course.rating} /><span className="text-sm text-muted-foreground">({course.ratings} reviews)</span></div>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {reviews.map((r) => (
                <div key={r.n} className="rounded-2xl border bg-card p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={r.a} alt={r.n} className="h-10 w-10 rounded-full" />
                    <div><p className="font-semibold text-sm">{r.n}</p><div className="flex items-center gap-2"><Stars v={5} size="h-3 w-3" /><span className="text-xs text-muted-foreground">{r.w}</span></div></div>
                  </div>
                  <p className="text-sm text-muted-foreground">{r.t}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-3xl font-bold font-display mb-6">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {faqs.map((f, i) => (
                <div key={f.q} className="rounded-xl border bg-card">
                  <button type="button" onClick={() => setFaq(faq === i ? null : i)} className="w-full flex items-center justify-between px-4 py-3.5 text-left text-sm font-medium">
                    {f.q}<ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform", faq === i && "rotate-180")} />
                  </button>
                  {faq === i && <p className="px-4 pb-4 text-sm text-muted-foreground">{f.a}</p>}
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-2xl bg-primary text-primary-foreground p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold font-display mb-2">Start Your Learning Journey Today</h2>
              <p className="text-primary-foreground/80 max-w-xl">Learn from industry experts, build real projects and earn a verified certificate on your profile.</p>
            </div>
            <Button type="button" onClick={handleEnroll} disabled={busyAction === "enroll"} variant="secondary" size="lg" className="gap-2 shrink-0">
              {enrollment ? "Continue Learning" : "Enroll Now"} <ArrowRight className="h-4 w-4" />
            </Button>
          </section>
        </div>
      </Layout>
    </>
  );
};

export default CourseDetail;
