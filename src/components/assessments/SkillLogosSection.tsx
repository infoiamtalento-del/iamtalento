import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Code2, Brain, MessageCircle, Calculator, Wrench,
  GitBranch, Database, Cloud, Shield, Terminal,
  Users, Handshake, HeartHandshake, Target, Lightbulb,
  Mic, PenTool, BookOpen, Presentation, Languages,
  Percent, BarChart3, PieChart, Clock, Puzzle,
  Figma, Trello, Slack,
  MonitorSmartphone, FileCode, Cpu, Network, Lock,
  Workflow, Layers, Box, Palette, Clipboard,
  Eye, Scale, Gauge, Shapes, Blocks,
} from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

const categories = [
  { id: "technical", label: "Technical", icon: Code2 },
  { id: "behavioral", label: "Behavioral", icon: Brain },
  { id: "communication", label: "Communication", icon: MessageCircle },
  { id: "aptitude", label: "Aptitude", icon: Calculator },
  { id: "tools", label: "Tools & Platforms", icon: Wrench },
];

type SkillItem = {
  name: string;
  icon?: React.ElementType;
  logoUrl?: string;
};

const skillsByCategory: Record<string, SkillItem[]> = {
  technical: [
    { name: "Python", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
    { name: "JavaScript", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    { name: "React", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Java", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
    { name: "TypeScript", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
    { name: "Node.js", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name: "C++", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
    { name: "Go", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg" },
    { name: "Ruby", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg" },
    { name: "Swift", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg" },
    { name: "Kotlin", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg" },
    { name: "Rust", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg" },
    { name: "PHP", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
    { name: "SQL", icon: Database },
    { name: "MongoDB", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
    { name: "PostgreSQL", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
    { name: "Docker", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
    { name: "Kubernetes", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-original.svg" },
    { name: "AWS", icon: Cloud },
    { name: "Git", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
    { name: "Linux", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" },
    { name: "GraphQL", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg" },
    { name: "Redis", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" },
    { name: "Angular", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg" },
    { name: "Vue.js", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" },
    { name: "Django", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" },
    { name: "Flask", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg" },
    { name: "TensorFlow", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" },
    { name: "Cybersecurity", icon: Shield },
    { name: "APIs", icon: Network },
    { name: "CI/CD", icon: GitBranch },
    { name: "Microservices", icon: Layers },
    { name: "System Design", icon: Cpu },
  ],
  behavioral: [
    { name: "Leadership", icon: Users },
    { name: "Teamwork", icon: Handshake },
    { name: "Conflict Resolution", icon: HeartHandshake },
    { name: "Goal Setting", icon: Target },
    { name: "Critical Thinking", icon: Lightbulb },
    { name: "Decision Making", icon: Scale },
    { name: "Adaptability", icon: Workflow },
    { name: "Time Management", icon: Clock },
    { name: "Problem Solving", icon: Puzzle },
    { name: "Work Ethic", icon: Clipboard },
    { name: "Emotional Intelligence", icon: Eye },
    { name: "Accountability", icon: Shield },
    { name: "Stress Management", icon: Gauge },
    { name: "Initiative", icon: Target },
    { name: "Collaboration", icon: Users },
    { name: "Creativity", icon: Lightbulb },
    { name: "Resilience", icon: Shield },
    { name: "Mentoring", icon: BookOpen },
    { name: "Delegation", icon: Workflow },
    { name: "Negotiation", icon: Handshake },
    { name: "Growth Mindset", icon: Brain },
    { name: "Self-Awareness", icon: Eye },
    { name: "Empathy", icon: HeartHandshake },
    { name: "Feedback Handling", icon: MessageCircle },
  ],
  communication: [
    { name: "Public Speaking", icon: Mic },
    { name: "Technical Writing", icon: PenTool },
    { name: "Report Writing", icon: BookOpen },
    { name: "Presentations", icon: Presentation },
    { name: "Cross-Cultural", icon: Languages },
    { name: "Email Etiquette", icon: MessageCircle },
    { name: "Active Listening", icon: Eye },
    { name: "Storytelling", icon: BookOpen },
    { name: "Client Communication", icon: Users },
    { name: "Stakeholder Mgmt", icon: Handshake },
    { name: "Persuasion", icon: Target },
    { name: "Verbal Fluency", icon: Mic },
    { name: "Body Language", icon: Users },
    { name: "Negotiation", icon: Handshake },
    { name: "Clarity & Brevity", icon: PenTool },
    { name: "Documentation", icon: Clipboard },
    { name: "Conflict Comms", icon: HeartHandshake },
    { name: "Visual Comms", icon: Palette },
    { name: "Meeting Facilitation", icon: Presentation },
    { name: "Interview Skills", icon: Mic },
    { name: "Proposal Writing", icon: BookOpen },
    { name: "Social Media Comms", icon: MessageCircle },
    { name: "Crisis Comms", icon: Shield },
    { name: "Brand Voice", icon: PenTool },
  ],
  aptitude: [
    { name: "Quantitative", icon: Percent },
    { name: "Data Interpretation", icon: BarChart3 },
    { name: "Charts & Graphs", icon: PieChart },
    { name: "Logical Reasoning", icon: Brain },
    { name: "Pattern Recognition", icon: Shapes },
    { name: "Verbal Ability", icon: BookOpen },
    { name: "Numerical Ability", icon: Calculator },
    { name: "Abstract Reasoning", icon: Blocks },
    { name: "Spatial Reasoning", icon: Box },
    { name: "Speed & Accuracy", icon: Clock },
    { name: "Coding Aptitude", icon: Terminal },
    { name: "Analytical Skills", icon: Lightbulb },
    { name: "Probability", icon: Percent },
    { name: "Permutations", icon: Puzzle },
    { name: "Algebra", icon: Calculator },
    { name: "Geometry", icon: Shapes },
    { name: "Series & Sequences", icon: Blocks },
    { name: "Blood Relations", icon: Users },
    { name: "Direction Sense", icon: Target },
    { name: "Calendars", icon: Clock },
    { name: "Coding-Decoding", icon: Lock },
    { name: "Syllogisms", icon: Brain },
    { name: "Seating Arrangement", icon: Puzzle },
    { name: "Data Sufficiency", icon: BarChart3 },
  ],
  tools: [
    { name: "Figma", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
    { name: "VS Code", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
    { name: "Jira", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg" },
    { name: "Slack", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg" },
    { name: "Trello", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/trello/trello-plain.svg" },
    { name: "GitHub", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
    { name: "GitLab", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg" },
    { name: "Notion", icon: FileCode },
    { name: "Postman", icon: MonitorSmartphone },
    { name: "Jenkins", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg" },
    { name: "Terraform", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg" },
    { name: "Ansible", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ansible/ansible-original.svg" },
    { name: "Grafana", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg" },
    { name: "Selenium", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/selenium/selenium-original.svg" },
    { name: "Photoshop", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-original.svg" },
    { name: "Illustrator", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg" },
    { name: "Sketch", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sketch/sketch-original.svg" },
    { name: "Firebase", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" },
    { name: "Webpack", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webpack/webpack-original.svg" },
    { name: "npm", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg" },
    { name: "Nginx", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg" },
    { name: "Apache Kafka", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachekafka/apachekafka-original.svg" },
    { name: "Power BI", icon: BarChart3 },
    { name: "Tableau", icon: PieChart },
  ],
};

const LogoTile = ({ item }: { item: SkillItem }) => (
  <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border/50 bg-card p-4 hover:border-primary/30 hover:shadow-md transition-all duration-300 group">
    <div className="h-10 w-10 flex items-center justify-center">
      {item.logoUrl ? (
        <img src={item.logoUrl} alt={item.name} className="h-8 w-8 object-contain group-hover:scale-110 transition-transform duration-300" loading="lazy" />
      ) : item.icon ? (
        <item.icon className="h-7 w-7 text-primary group-hover:scale-110 transition-transform duration-300" />
      ) : null}
    </div>
    <span className="text-[11px] font-medium text-muted-foreground text-center leading-tight truncate w-full">{item.name}</span>
  </div>
);

const VerticalMarquee = ({ items, speed, reverse }: { items: SkillItem[]; speed: number; reverse?: boolean }) => {
  const repeated = [...items, ...items, ...items];
  return (
    <div className="overflow-hidden h-[480px] relative">
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
      <motion.div
        className="flex flex-col gap-3"
        animate={{ y: reverse ? ["-66.66%", "0%"] : ["0%", "-66.66%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {repeated.map((item, i) => (
          <LogoTile key={`${item.name}-${i}`} item={item} />
        ))}
      </motion.div>
    </div>
  );
};

const SkillLogosSection = () => {
  const [activeTab, setActiveTab] = useState("technical");
  const skills = skillsByCategory[activeTab] || [];

  // Split into 6 columns
  const colCount = 6;
  const columns: SkillItem[][] = Array.from({ length: colCount }, () => []);
  skills.forEach((s, i) => columns[i % colCount].push(s));

  return (
    <section className="py-16 md:py-20 overflow-hidden">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <SectionBadge label="Skills We Assess" icon={Code2} />
          <h2 className="text-3xl md:text-4xl font-bold font-display mt-3">
            Comprehensive Skill{" "}
            <span className="text-primary">Coverage</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg mt-2 max-w-xl mx-auto">
            From programming languages to soft skills — we assess what actually matters to employers.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <button
                key={c.id}
                onClick={() => setActiveTab(c.id)}
                className={`flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 border ${
                  activeTab === c.id
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                    : "bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {c.label}
              </button>
            );
          })}
        </div>

        {/* Vertical scrolling columns */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-3 md:grid-cols-6 gap-4"
          >
            {columns.map((col, ci) => (
              <VerticalMarquee
                key={`${activeTab}-${ci}`}
                items={col}
                speed={25 + ci * 3}
                reverse={ci % 2 === 1}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Bottom stat */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          <span className="font-bold text-foreground">200+</span> skills assessed across{" "}
          <span className="font-bold text-foreground">5 categories</span> — and growing every month.
        </motion.p>
      </div>
    </section>
  );
};

export default SkillLogosSection;
