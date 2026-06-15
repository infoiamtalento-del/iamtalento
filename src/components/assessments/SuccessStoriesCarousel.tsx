import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BadgeCheck, Quote } from "lucide-react";

type Story = {
  name: string;
  city: string;
  role: string;
  company: string;
  score: number;
  quote: string;
  initials: string;
};

const stories: Story[] = [
  { name: "Priya R.", city: "Mumbai", role: "Product Mgmt", company: "Swiggy", score: 91, quote: "The assessment helped me discover my strengths and land my dream role.", initials: "PR" },
  { name: "Nikhil K.", city: "Chennai", role: "Python / ML", company: "Flipkart", score: 94, quote: "Verified profile got me shortlisted faster and the process was smooth.", initials: "NK" },
  { name: "Sneha A.", city: "Hyderabad", role: "UI / UX", company: "Google", score: 87, quote: "The insights were spot on. It changed my career direction.", initials: "SA" },
  { name: "Rahul S.", city: "Delhi", role: "Vue.js", company: "Microsoft", score: 90, quote: "From confused to confident — Talento made it possible!", initials: "RS" },
  { name: "Ananya M.", city: "Bengaluru", role: "Data Science", company: "Amazon", score: 93, quote: "Recruiters reached out within a week of completing my assessment.", initials: "AM" },
  { name: "Arjun V.", city: "Pune", role: "Backend / Node", company: "Razorpay", score: 89, quote: "The verified badge added instant credibility to my profile.", initials: "AV" },
  { name: "Meera J.", city: "Kolkata", role: "Marketing", company: "Zomato", score: 88, quote: "Detailed report showed me exactly where to focus and improve.", initials: "MJ" },
  { name: "Karan D.", city: "Ahmedabad", role: "DevOps", company: "Atlassian", score: 92, quote: "Cleared interviews faster — the prep roadmap was a game changer.", initials: "KD" },
  { name: "Riya T.", city: "Gurgaon", role: "Frontend / React", company: "Adobe", score: 95, quote: "Talento turned my skills into a story recruiters actually noticed.", initials: "RT" },
];

const SuccessStoriesCarousel = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5">
            <BadgeCheck className="w-4 h-4" />
            Success Stories
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            1000+ Success Stories <span className="text-primary">and counting</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Real people, real assessments, real offers — careers accelerated through verified skills and data-driven guidance.
          </p>
        </div>

        <Carousel opts={{ align: "start", loop: true }} className="max-w-6xl mx-auto">
          <CarouselContent className="-ml-4">
            {stories.map((s) => (
              <CarouselItem key={s.name} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="h-full rounded-2xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-5">
                    <Avatar className="h-12 w-12 border border-border">
                      <AvatarFallback className="bg-muted text-foreground font-semibold">{s.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold truncate">{s.name}</p>
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          <BadgeCheck className="w-3 h-3" /> Hired
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{s.city}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-5 pb-5 border-b border-border">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-0.5">Role</p>
                      <p className="text-sm font-medium">{s.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-0.5">{s.company}</p>
                      <p className="text-sm font-semibold">
                        <span className="text-primary">{s.score}</span>
                        <span className="text-muted-foreground">/100</span>
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <Quote className="absolute -top-1 -left-1 w-4 h-4 text-primary/30" />
                    <p className="text-sm text-muted-foreground leading-relaxed pl-5 italic">
                      {s.quote}
                    </p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4" />
          <CarouselNext className="hidden md:flex -right-4" />
        </Carousel>
      </div>
    </section>
  );
};

export default SuccessStoriesCarousel;
