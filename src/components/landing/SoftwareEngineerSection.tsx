import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { Code2, BarChart3, Brain, Gauge, Terminal, Bug } from "lucide-react";

const features = [
  { icon: Terminal, title: "Live Coding Challenges", desc: "Real-world coding problems in your preferred language with time tracking." },
  { icon: Code2, title: "Code Playback & Review", desc: "Full session replay so employers see how you think, not just what you submit." },
  { icon: BarChart3, title: "Score Overlay", desc: "Real-time scoring against 50K+ engineers in similar roles and experience." },
  { icon: Brain, title: "Problem-Solving Analysis", desc: "AI evaluates your approach, not just correctness — patterns, efficiency, edge cases." },
  { icon: Gauge, title: "Confidence Meter", desc: "Behavioral analysis provides a confidence signal alongside technical scores." },
  { icon: Bug, title: "Debugging Proficiency", desc: "Targeted debugging challenges that test real production debugging skills." },
];

const SoftwareEngineerSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section ref={ref} className="py-28 bg-foreground text-background relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(hsl(var(--background)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--background)) 1px, transparent 1px)",
        backgroundSize: "24px 24px"
      }} />
      <div className="container">
        <div className={cn("text-center max-w-2xl mx-auto mb-16 transition-all duration-700", isVisible ? "opacity-100" : "opacity-0 translate-y-8")}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background/10 text-background/70 text-xs font-medium mb-4 border border-background/10">
            <Terminal className="h-3.5 w-3.5" /> Technical Deep-Dive
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Built for Real Problem Solvers</h2>
          <p className="text-background/60 text-lg">Not another generic quiz. This is how real engineering ability gets measured.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-background/5 border border-background/10 hover:bg-background/10 hover:border-background/20 transition-all duration-300 group"
            >
              <div className="h-11 w-11 rounded-xl bg-background/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors duration-300">
                <Icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <h3 className="text-base font-semibold font-display mb-2">{title}</h3>
              <p className="text-sm text-background/50 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Code editor mockup with confidence meter */}
        <div className="max-w-4xl mx-auto grid lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 rounded-2xl bg-background/5 border border-background/10 overflow-hidden"
          >
            <div className="h-8 bg-background/5 border-b border-background/10 flex items-center px-3 gap-1.5">
              <div className="h-2 w-2 rounded-full bg-destructive/40" />
              <div className="h-2 w-2 rounded-full bg-warning/40" />
              <div className="h-2 w-2 rounded-full bg-success/40" />
              <span className="text-[10px] text-background/30 ml-3 font-mono">solution.ts — Assessment</span>
            </div>
            <div className="p-4 font-mono text-xs text-background/50 leading-6">
              <span className="text-primary/70">function</span> <span className="text-background/80">findOptimalPath</span>(graph: Graph): Path {"{"}<br />
              &nbsp;&nbsp;<span className="text-primary/70">const</span> visited = <span className="text-primary/70">new</span> Set{"<"}Node{">"}();<br />
              &nbsp;&nbsp;<span className="text-primary/70">const</span> queue = <span className="text-primary/70">new</span> PriorityQueue();<br />
              &nbsp;&nbsp;queue.enqueue(graph.start, <span className="text-warning/70">0</span>);<br />
              <br />
              &nbsp;&nbsp;<span className="text-primary/70">while</span> (!queue.isEmpty()) {"{"}<br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-primary/70">const</span> current = queue.dequeue();<br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-background/30">// ... algorithm continues</span><br />
              &nbsp;&nbsp;{"}"}<br />
              {"}"}
            </div>
            <div className="h-8 bg-background/5 border-t border-background/10 flex items-center justify-between px-4">
              <span className="text-[10px] text-background/30">Time: 04:32 / 15:00</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-success/70">● Recording</span>
                <span className="text-[10px] text-background/30">Score: calculating...</span>
              </div>
            </div>
          </motion.div>

          {/* Side panel - Confidence & Score */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <div className="rounded-xl bg-background/5 border border-background/10 p-4">
              <p className="text-[10px] text-background/40 mb-2">Confidence</p>
              <div className="relative h-24 w-full flex items-end justify-center">
                <motion.div
                  className="w-full rounded-t gradient-primary"
                  initial={{ height: "20%" }}
                  whileInView={{ height: "82%" }}
                  transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
                  viewport={{ once: true }}
                />
              </div>
              <p className="text-center text-lg font-bold font-display text-background/80 mt-2">87%</p>
            </div>
            <div className="rounded-xl bg-background/5 border border-background/10 p-4">
              <p className="text-[10px] text-background/40 mb-1">Difficulty</p>
              <p className="text-xs font-semibold text-warning/80">Adaptive</p>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map(l => (
                  <div key={l} className={cn("h-1.5 flex-1 rounded-full", l <= 4 ? "gradient-primary" : "bg-background/10")} />
                ))}
              </div>
            </div>
            <div className="rounded-xl bg-background/5 border border-background/10 p-4">
              <p className="text-[10px] text-background/40 mb-1">Live Score</p>
              <p className="text-2xl font-bold font-display gradient-text">85</p>
              <p className="text-[9px] text-background/30">Top 18%</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SoftwareEngineerSection;
