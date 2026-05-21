import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

import learnerPriya from "@/assets/learner-priya.jpg";
import learnerRahul from "@/assets/learner-rahul.jpg";
import learnerAnanya from "@/assets/learner-ananya.jpg";
import learnerVikram from "@/assets/learner-vikram.jpg";

const stories = [
  {
    name: "Priya Raghavan",
    photo: learnerPriya,
    prevRole: "Unemployed",
    currentRole: "Data Analyst at TCS",
    course: "Data Analytics Masterclass",
    quote: "I went from unemployed to a data analyst role in 6 weeks. The projects in the course literally became my portfolio.",
    rating: 5,
  },
  {
    name: "Rahul Mehta",
    photo: learnerRahul,
    prevRole: "Junior Developer",
    currentRole: "Senior Engineer at Infosys",
    course: "Python for Job-Ready Developers",
    quote: "The masterclass gave me confidence to crack a senior-level interview. Real questions, real preparation.",
    rating: 5,
  },
  {
    name: "Ananya Iyer",
    photo: learnerAnanya,
    prevRole: "Marketing Intern",
    currentRole: "Digital Marketing Lead at Swiggy",
    course: "Digital Marketing with AI Tools",
    quote: "This course didn't just teach theory — I built actual campaigns and landed my dream role within a month.",
    rating: 4,
  },
  {
    name: "Vikram Deshmukh",
    photo: learnerVikram,
    prevRole: "Fresher",
    currentRole: "ML Engineer at Flipkart",
    course: "AI for Non-Tech Professionals",
    quote: "As a non-CS grad, I was terrified of AI. This course broke it down beautifully and now I work in ML.",
    rating: 5,
  },
];

const LearnerStoriesSection = () => (
  <section className="py-16 md:py-20">
    <div className="container px-4 md:px-6">
      <div className="text-center mb-8">
        <SectionBadge label="Success Stories" icon={Quote} />
        <h2 className="text-3xl md:text-4xl font-bold font-display mb-3">
          See What Others Are Achieving<br />
          <span className="text-primary">Through Learning</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">Real stories from real learners who transformed their careers.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stories.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border bg-card p-5 space-y-3 hover:shadow-lg transition-shadow"
          >
            <Quote className="h-5 w-5 text-primary/30" />
            <p className="text-xs text-muted-foreground leading-relaxed italic">"{s.quote}"</p>
            <div className="flex items-center gap-1">
              {Array.from({ length: s.rating }).map((_, j) => (
                <Star key={j} className="h-3 w-3 fill-[hsl(33,100%,50%)] text-[hsl(33,100%,50%)]" />
              ))}
            </div>
            <div className="border-t pt-3 flex items-center gap-3">
              <img src={s.photo} alt={s.name} className="h-10 w-10 rounded-full object-cover" />
              <div>
                <p className="text-xs font-bold font-display">{s.name}</p>
                <p className="text-[10px] text-muted-foreground">{s.currentRole}</p>
              </div>
            </div>
            <p className="text-[10px] text-primary font-medium">{s.course}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default LearnerStoriesSection;
