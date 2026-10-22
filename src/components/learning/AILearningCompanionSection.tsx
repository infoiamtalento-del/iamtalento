import { motion } from "framer-motion";
import { Sparkles, Star, GraduationCap, MessageSquare, CheckCircle2, FileText, Target, Calendar } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

import female1 from "@/assets/experts/female-1.jpg";
import female2 from "@/assets/experts/female-2.jpg";
import female3 from "@/assets/experts/female-3.jpg";
import male1 from "@/assets/experts/male-1.jpg";
import male2 from "@/assets/experts/male-2.jpg";
import male3 from "@/assets/experts/male-3.jpg";
import learnerPriya from "@/assets/learner-priya.jpg";
import learnerRahul from "@/assets/learner-rahul.jpg";
import learnerAnanya from "@/assets/learner-ananya.jpg";
import projectThumb from "@/assets/hands-on-project-thumb.jpg";

const AILearningCompanionSection = () => {
  return (
    <section id="ai-companion" className="py-16 md:py-24 bg-[#FBF4EB]">
      <div className="container px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-14">
          <SectionBadge label="How AI Transforms Your Learning Experience" icon={Sparkles} />
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-4 text-slate-950"
          >
            Meet Your AI<br />
            <span className="text-primary">Learning Companion</span>
          </motion.h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Not just another chatbot. An intelligent learning assistant that helps you understand, practise and apply what you learn.
          </p>
        </div>

        {/* ─── 6 Preply-Style Editorial Cards (2 Rows of 3) ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* ─── CARD 1: Ask Anything About Your Lesson (Stacked Cascading Cards Visual) ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="bg-white border border-slate-900/80 rounded-md pt-7 px-7 pb-0 flex flex-col justify-between overflow-hidden shadow-xs"
          >
            <div>
              <div className="h-9 w-9 rounded-md bg-[#002C66] text-white font-display font-extrabold text-lg flex items-center justify-center mb-5">
                1
              </div>
              <h3 className="text-2xl sm:text-[28px] font-extrabold font-display tracking-tight text-slate-950 leading-[1.12] mb-3.5">
                Ask anything about your lesson.
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed mb-6">
                Stuck on a concept? Ask AI while watching the video. Get contextual explanations, practical examples and step-by-step guidance without leaving your lesson.
              </p>
            </div>

            {/* Bottom Visual: 3 Cascading Offset Cards (Exact Reference Card 1 Structure) */}
            <div className="relative pt-2 pb-4">
              {/* Top Card */}
              <div className="relative z-30 rounded-lg border border-slate-900/75 bg-white p-3 flex items-start gap-3 shadow-xs mr-4">
                <img
                  src={female1}
                  alt="Dr. Neha"
                  className="h-14 w-14 rounded-md object-cover object-top shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold font-display text-sm text-slate-950">
                      Dr. Neha · AI Lesson
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-xs font-extrabold text-slate-950">
                      <Star className="h-3 w-3 fill-slate-950 text-slate-950" /> 4.9
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5">
                    <GraduationCap className="h-3 w-3 shrink-0" /> Paused at 04:18 · RAG Indexing
                  </p>
                  <p className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5 leading-snug">
                    <MessageSquare className="h-3 w-3 shrink-0 text-[#002C66]" /> Instant step-by-step AI answer ready
                  </p>
                </div>
              </div>

              {/* Middle Offset Card */}
              <div className="relative z-20 -mt-2.5 ml-3 mr-1 rounded-lg border border-slate-900/65 bg-white p-3 flex items-start gap-3 shadow-xs">
                <img
                  src={female2}
                  alt="Kavitha"
                  className="h-12 w-12 rounded-md object-cover object-top shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-slate-600 flex items-center gap-1">
                    <GraduationCap className="h-3 w-3 shrink-0" /> Growth Marketing · 11:20
                  </p>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                    Explained attribution model with B2B example
                  </p>
                </div>
              </div>

              {/* Bottom Offset Card */}
              <div className="relative z-10 -mt-2.5 ml-6 rounded-lg border border-slate-900/55 bg-white p-2.5 flex items-start gap-3">
                <img
                  src={male1}
                  alt="Vikram"
                  className="h-10 w-10 rounded-md object-cover object-top shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-slate-600 truncate">
                    System Design · Contextual code walkthrough
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ─── CARD 2: Understand Difficult Concepts (Main Portrait + Overlapping PiP Frame) ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="bg-white border border-slate-900/80 rounded-md pt-7 px-7 pb-0 flex flex-col justify-between overflow-hidden shadow-xs"
          >
            <div>
              <div className="h-9 w-9 rounded-md bg-[#002C66] text-white font-display font-extrabold text-lg flex items-center justify-center mb-5">
                2
              </div>
              <h3 className="text-2xl sm:text-[28px] font-extrabold font-display tracking-tight text-slate-950 leading-[1.12] mb-3.5">
                Understand difficult concepts.
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed mb-6">
                Get complex topics explained in simple language. Ask for examples, alternative explanations or practical scenarios tailored to your learning needs.
              </p>
            </div>

            {/* Bottom Visual: Large Main Frame + Overlapping Right PiP Portrait (Exact Reference Card 2 Structure) */}
            <div className="relative h-60 mt-auto">
              {/* Main Instructor Frame */}
              <div className="absolute left-0 bottom-0 w-[84%] h-56 rounded-t-xl border-t border-x border-slate-900/80 overflow-hidden bg-[#F5EFE6]">
                <img
                  src={female3}
                  alt="Instructor explaining concept"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute bottom-2.5 left-2.5 bg-white/95 border border-slate-900/70 rounded-md px-2.5 py-1 text-[10px] font-bold text-slate-950 shadow-xs">
                  Simple Analogy Mode
                </div>
              </div>

              {/* Overlapping Right Learner PiP Frame */}
              <div className="absolute right-0 top-4 w-[42%] h-36 rounded-xl border border-slate-900/85 overflow-hidden bg-white shadow-md z-10">
                <img
                  src={learnerPriya}
                  alt="Learner understanding concept"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </motion.div>

          {/* ─── CARD 3: Test Your Knowledge (Fanned Horizontal Cascading Photo Slices) ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.16 }}
            className="bg-white border border-slate-900/80 rounded-md pt-7 px-7 pb-7 flex flex-col justify-between overflow-hidden shadow-xs"
          >
            <div>
              <div className="h-9 w-9 rounded-md bg-[#002C66] text-white font-display font-extrabold text-lg flex items-center justify-center mb-5">
                3
              </div>
              <h3 className="text-2xl sm:text-[28px] font-extrabold font-display tracking-tight text-slate-950 leading-[1.12] mb-3.5">
                Test your knowledge.
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed mb-6">
                Turn every lesson into an opportunity to practise. Generate quizzes, answer questions and understand where you need improvement.
              </p>
            </div>

            {/* Bottom Visual: Fanned Horizontal Slices (Exact Reference Card 3 Structure) */}
            <div className="relative h-44 flex items-stretch mt-auto">
              {/* Slice 1 */}
              <div className="w-8 rounded-l-xl border-y border-l border-slate-900/80 overflow-hidden shrink-0">
                <img
                  src={projectThumb}
                  alt=""
                  className="w-full h-full object-cover object-[20%_center] opacity-75"
                />
              </div>
              {/* Slice 2 */}
              <div className="w-8 -ml-1.5 rounded-l-xl border-y border-l border-slate-900/80 overflow-hidden shrink-0">
                <img
                  src={projectThumb}
                  alt=""
                  className="w-full h-full object-cover object-[35%_center] opacity-85"
                />
              </div>
              {/* Slice 3 */}
              <div className="w-8 -ml-1.5 rounded-l-xl border-y border-l border-slate-900/80 overflow-hidden shrink-0">
                <img
                  src={projectThumb}
                  alt=""
                  className="w-full h-full object-cover object-[50%_center] opacity-95"
                />
              </div>
              {/* Main Front Frame */}
              <div className="flex-1 -ml-1.5 rounded-xl border border-slate-900/85 overflow-hidden relative shadow-xs">
                <img
                  src={projectThumb}
                  alt="Practising with AI quizzes"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute bottom-2.5 right-2.5 bg-white/95 border border-slate-900/75 rounded-md px-2.5 py-1 text-[10px] font-extrabold text-slate-950 flex items-center gap-1 shadow-xs">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Quiz: 5/5 Mastery
                </div>
              </div>
            </div>
          </motion.div>

          {/* ─── CARD 4: Get Instant Learning Summaries (Stacked Cascading Summary Cards) ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="bg-white border border-slate-900/80 rounded-md pt-7 px-7 pb-0 flex flex-col justify-between overflow-hidden shadow-xs"
          >
            <div>
              <div className="h-9 w-9 rounded-md bg-[#002C66] text-white font-display font-extrabold text-lg flex items-center justify-center mb-5">
                4
              </div>
              <h3 className="text-2xl sm:text-[28px] font-extrabold font-display tracking-tight text-slate-950 leading-[1.12] mb-3.5">
                Get instant learning summaries.
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed mb-6">
                Review important concepts, key takeaways and lesson notes to reinforce your understanding and make revision easier.
              </p>
            </div>

            {/* Bottom Visual: 3 Cascading Summary Cards (Reference Card 1 Style) */}
            <div className="relative pt-2 pb-4">
              <div className="relative z-30 rounded-lg border border-slate-900/75 bg-white p-3 flex items-start gap-3 shadow-xs mr-4">
                <img
                  src={male2}
                  alt="Arjun"
                  className="h-14 w-14 rounded-md object-cover object-top shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold font-display text-sm text-slate-950">
                      Module 02 Summary
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-[11px] font-extrabold text-[#002C66]">
                      <FileText className="h-3 w-3" /> Saved
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    3 core formulas &amp; cohort benchmarks
                  </p>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    1-click revision cheat sheet ready
                  </p>
                </div>
              </div>

              <div className="relative z-20 -mt-2.5 ml-3 mr-1 rounded-lg border border-slate-900/65 bg-white p-3 flex items-start gap-3 shadow-xs">
                <img
                  src={male3}
                  alt="Saurabh"
                  className="h-12 w-12 rounded-md object-cover object-top shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold text-slate-900">
                    Valuation &amp; Cash Flow Notes
                  </p>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Key takeaways synced to your notebook
                  </p>
                </div>
              </div>

              <div className="relative z-10 -mt-2.5 ml-6 rounded-lg border border-slate-900/55 bg-white p-2.5 flex items-start gap-3">
                <img
                  src={female1}
                  alt="Neha"
                  className="h-10 w-10 rounded-md object-cover object-top shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-slate-600 truncate">
                    Transformer Architecture · 5 bullet summary
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ─── CARD 5: Track Your Learning Gaps (Main Portrait + Overlapping Gap Card) ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.28 }}
            className="bg-white border border-slate-900/80 rounded-md pt-7 px-7 pb-0 flex flex-col justify-between overflow-hidden shadow-xs"
          >
            <div>
              <div className="h-9 w-9 rounded-md bg-[#002C66] text-white font-display font-extrabold text-lg flex items-center justify-center mb-5">
                5
              </div>
              <h3 className="text-2xl sm:text-[28px] font-extrabold font-display tracking-tight text-slate-950 leading-[1.12] mb-3.5">
                Track your learning gaps.
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed mb-6">
                Identify topics that need more practice based on your quiz results and learning activity. Get recommendations on what to revisit next.
              </p>
            </div>

            {/* Bottom Visual: Large Frame + Overlapping PiP Portrait (Reference Card 2 Style) */}
            <div className="relative h-60 mt-auto">
              <div className="absolute left-0 bottom-0 w-[84%] h-56 rounded-t-xl border-t border-x border-slate-900/80 overflow-hidden bg-[#F5EFE6]">
                <img
                  src={learnerRahul}
                  alt="Learner tracking skill gaps"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute bottom-2.5 left-2.5 bg-white/95 border border-slate-900/70 rounded-md px-2.5 py-1 text-[10px] font-bold text-slate-950 flex items-center gap-1 shadow-xs">
                  <Target className="h-3 w-3 text-[#002C66]" /> Revisit Next: Lesson 4.2
                </div>
              </div>

              <div className="absolute right-0 top-4 w-[42%] h-36 rounded-xl border border-slate-900/85 overflow-hidden bg-white shadow-md z-10">
                <img
                  src={male1}
                  alt="Mentor guidance"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </motion.div>

          {/* ─── CARD 6: Prepare for Expert Sessions (Fanned Horizontal Slices) ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.36 }}
            className="bg-white border border-slate-900/80 rounded-md pt-7 px-7 pb-7 flex flex-col justify-between overflow-hidden shadow-xs"
          >
            <div>
              <div className="h-9 w-9 rounded-md bg-[#002C66] text-white font-display font-extrabold text-lg flex items-center justify-center mb-5">
                6
              </div>
              <h3 className="text-2xl sm:text-[28px] font-extrabold font-display tracking-tight text-slate-950 leading-[1.12] mb-3.5">
                Prepare for expert sessions.
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed mb-6">
                Let AI organise your unresolved questions and prepare a summary of the challenges you want to discuss with an industry expert.
              </p>
            </div>

            {/* Bottom Visual: Fanned Horizontal Slices (Reference Card 3 Style) */}
            <div className="relative h-44 flex items-stretch mt-auto">
              <div className="w-8 rounded-l-xl border-y border-l border-slate-900/80 overflow-hidden shrink-0">
                <img
                  src={learnerAnanya}
                  alt=""
                  className="w-full h-full object-cover object-[25%_top] opacity-75"
                />
              </div>
              <div className="w-8 -ml-1.5 rounded-l-xl border-y border-l border-slate-900/80 overflow-hidden shrink-0">
                <img
                  src={learnerAnanya}
                  alt=""
                  className="w-full h-full object-cover object-[40%_top] opacity-85"
                />
              </div>
              <div className="w-8 -ml-1.5 rounded-l-xl border-y border-l border-slate-900/80 overflow-hidden shrink-0">
                <img
                  src={learnerAnanya}
                  alt=""
                  className="w-full h-full object-cover object-[55%_top] opacity-95"
                />
              </div>
              <div className="flex-1 -ml-1.5 rounded-xl border border-slate-900/85 overflow-hidden relative shadow-xs">
                <img
                  src={learnerAnanya}
                  alt="Prepared for 1-to-1 expert consultation"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute bottom-2.5 right-2.5 bg-white/95 border border-slate-900/75 rounded-md px-2.5 py-1 text-[10px] font-extrabold text-slate-950 flex items-center gap-1 shadow-xs">
                  <Calendar className="h-3 w-3 text-[#002C66]" /> 1:1 Brief Ready
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AILearningCompanionSection;
