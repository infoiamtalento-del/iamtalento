import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BadgeCheck, Quote, Sparkles, TrendingUp, Star } from "lucide-react";

type Story = {
  name: string;
  city: string;
  role: string;
  company: string;
  score: number;
  quote: string;
  initials: string;
  accent: string;
};

const stories: Story[] = [
  { name: "Priya R.", city: "Mumbai", role: "Product Mgmt", company: "Swiggy", score: 91, quote: "The assessment helped me discover my strengths and land my dream role.", initials: "PR", accent: "from-rose-500 to-orange-500" },
  { name: "Nikhil K.", city: "Chennai", role: "Python / ML", company: "Flipkart", score: 94, quote: "Verified profile got me shortlisted faster and the process was smooth.", initials: "NK", accent: "from-blue-500 to-cyan-500" },
  { name: "Sneha A.", city: "Hyderabad", role: "UI / UX", company: "Google", score: 87, quote: "The insights were spot on. It changed my career direction.", initials: "SA", accent: "from-violet-500 to-fuchsia-500" },
  { name: "Rahul S.", city: "Delhi", role: "Vue.js", company: "Microsoft", score: 90, quote: "From confused to confident — Talento made it possible!", initials: "RS", accent: "from-emerald-500 to-teal-500" },
  { name: "Ananya M.", city: "Bengaluru", role: "Data Science", company: "Amazon", score: 93, quote: "Recruiters reached out within a week of completing my assessment.", initials: "AM", accent: "from-amber-500 to-orange-500" },
  { name: "Arjun V.", city: "Pune", role: "Backend / Node", company: "Razorpay", score: 89, quote: "The verified badge added instant credibility to my profile.", initials: "AV", accent: "from-indigo-500 to-blue-500" },
  { name: "Meera J.", city: "Kolkata", role: "Marketing", company: "Zomato", score: 88, quote: "Detailed report showed me exactly where to focus and improve.", initials: "MJ", accent: "from-pink-500 to-rose-500" },
  { name: "Karan D.", city: "Ahmedabad", role: "DevOps", company: "Atlassian", score: 92, quote: "Cleared interviews faster — the prep roadmap was a game changer.", initials: "KD", accent: "from-sky-500 to-indigo-500" },
  { name: "Riya T.", city: "Gurgaon", role: "Frontend / React", company: "Adobe", score: 95, quote: "Talento turned my skills into a story recruiters actually noticed.", initials: "RT", accent: "from-fuchsia-500 to-purple-500" },
];

const SuccessStoriesCarousel = () => {
  return (
    <section className="relative py-28 overflow-hidden bg-gradient-to-b from-background via-primary/[0.03] to-background">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-20 left-1/4 w-[480px] h-[480px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-[420px] h-[420px] rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:42px_42px]"
        />
      </div>

      <div className="container relative mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20 backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            Success Stories
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-5 leading-[1.1]">
            1000+ Success Stories{" "}
            <span className="bg-gradient-to-r from-primary via-rose-500 to-fuchsia-500 bg-clip-text text-transparent">
              and counting
            </span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Real people, real assessments, real offers — careers accelerated through verified skills and data-driven guidance.
          </p>
        </div>

        {/* Mini stat bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 mb-14 text-sm">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="font-semibold">94%</span>
            <span className="text-muted-foreground">hire rate</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="font-semibold">4.9/5</span>
            <span className="text-muted-foreground">avg rating</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border">
            <BadgeCheck className="w-4 h-4 text-primary" />
            <span className="font-semibold">18,731+</span>
            <span className="text-muted-foreground">verified pros</span>
          </div>
        </div>

        {/* Carousel */}
        <Carousel opts={{ align: "start", loop: true }} className="max-w-6xl mx-auto">
          <CarouselContent className="-ml-4">
            {stories.map((s) => (
              <CarouselItem key={s.name} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="group relative h-full">
                  {/* Hover gradient halo */}
                  <div className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${s.accent} opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500`} />
                  <div className="relative h-full rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-primary/10">
                    {/* Top accent line */}
                    <div className={`absolute top-0 left-6 right-6 h-px bg-gradient-to-r ${s.accent} opacity-60`} />

                    {/* Header */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className="relative">
                        <div className={`absolute -inset-0.5 rounded-full bg-gradient-to-br ${s.accent} opacity-70 blur-[2px]`} />
                        <Avatar className="relative h-12 w-12 border-2 border-background">
                          <AvatarFallback className={`bg-gradient-to-br ${s.accent} text-white font-bold text-sm`}>
                            {s.initials}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold truncate">{s.name}</p>
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <BadgeCheck className="w-3 h-3" /> Hired
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{s.city}</p>
                      </div>
                    </div>

                    {/* Role & score */}
                    <div className="flex items-center justify-between mb-5 pb-5 border-b border-dashed border-border">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-1">Role</p>
                        <p className="text-sm font-semibold">{s.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-1">{s.company}</p>
                        <p className="text-sm font-bold">
                          <span className={`bg-gradient-to-r ${s.accent} bg-clip-text text-transparent text-base`}>
                            {s.score}
                          </span>
                          <span className="text-muted-foreground font-medium">/100</span>
                        </p>
                      </div>
                    </div>

                    {/* Quote */}
                    <div className="relative">
                      <Quote className="absolute -top-1 -left-1 w-5 h-5 text-primary/30 fill-primary/10" />
                      <p className="text-sm text-foreground/80 leading-relaxed pl-6 italic">
                        {s.quote}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-5 h-11 w-11 border-border bg-card shadow-lg hover:bg-primary hover:text-primary-foreground hover:border-primary" />
          <CarouselNext className="hidden md:flex -right-5 h-11 w-11 border-border bg-card shadow-lg hover:bg-primary hover:text-primary-foreground hover:border-primary" />
        </Carousel>
      </div>
    </section>
  );
};

export default SuccessStoriesCarousel;
