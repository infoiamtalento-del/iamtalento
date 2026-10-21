import { Helmet } from "react-helmet-async";
import { Users, BarChart3, Clock, Zap, Plus, Bell, Settings, Home, Briefcase, FileText, LogOut, ChevronLeft, Search, UserCheck, ClipboardCheck, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const pipelineData = [
  { stage: "Applied", count: 2847 },
  { stage: "Screened", count: 1420 },
  { stage: "Assessed", count: 680 },
  { stage: "Interviewed", count: 245 },
  { stage: "Offered", count: 89 },
  { stage: "Hired", count: 67 },
];

const weeklyData = [
  { day: "Mon", applications: 420, screened: 380 },
  { day: "Tue", applications: 380, screened: 350 },
  { day: "Wed", applications: 510, screened: 490 },
  { day: "Thu", applications: 470, screened: 445 },
  { day: "Fri", applications: 390, screened: 370 },
];

const sourceData = [
  { name: "LinkedIn", value: 35, color: "hsl(var(--primary))" },
  { name: "Indeed", value: 25, color: "hsl(var(--primary-glow))" },
  { name: "Referrals", value: 20, color: "hsl(var(--success))" },
  { name: "Direct", value: 12, color: "hsl(var(--warning))" },
  { name: "Other", value: 8, color: "hsl(var(--muted-foreground))" },
];

const recentCandidates = [
  { name: "Sarah Chen", role: "Sr. Product Designer", score: 94, status: "Shortlisted", time: "2 min ago" },
  { name: "Marcus Wright", role: "Full Stack Engineer", score: 87, status: "In Assessment", time: "5 min ago" },
  { name: "Elena Rossi", role: "Data Scientist", score: 72, status: "Screened", time: "12 min ago" },
  { name: "James Park", role: "DevOps Engineer", score: 91, status: "Shortlisted", time: "18 min ago" },
  { name: "Priya Nair", role: "Product Manager", score: 68, status: "Rejected", time: "25 min ago" },
];

const sidebarItems = [
  { icon: Home, label: "Overview" },
  { icon: Users, label: "Candidates" },
  { icon: Briefcase, label: "Job Postings" },
  { icon: ClipboardCheck, label: "Assessments" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Search, label: "Talent Pool" },
  { icon: FileText, label: "Reports" },
  { icon: Settings, label: "Settings" },
];

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("Overview");

  return (
    <>
      <Helmet>
        <title>Dashboard | I Am Talento</title>
        <meta name="description" content="Manage candidates, screenings, assessments, and hiring analytics from the Talento dashboard." />
      </Helmet>
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <aside className={cn("flex flex-col border-r border-border bg-card transition-all duration-300", collapsed ? "w-16" : "w-60")}>
          <div className="flex items-center justify-between p-4 border-b border-border">
            {!collapsed && (
              <Link to="/" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                  <Zap className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-bold font-display text-sm">Talento</span>
              </Link>
            )}
            <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-lg hover:bg-accent transition-colors">
              <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
            </button>
          </div>
          <nav className="flex-1 p-2 space-y-1">
            {sidebarItems.map(({ icon: Icon, label }) => (
              <button
                key={label}
                onClick={() => setActiveItem(label)}
                className={cn(
                  "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-colors",
                  activeItem === label ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && label}
              </button>
            ))}
          </nav>
          <div className="p-2 border-t border-border">
            <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors">
              <LogOut className="h-4 w-4 shrink-0" />
              {!collapsed && "Back to Site"}
            </Link>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 overflow-auto">
          <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-border bg-card/80 backdrop-blur-sm">
            <div>
              <h1 className="text-xl font-bold font-display">Hiring Dashboard</h1>
              <p className="text-xs text-muted-foreground">Welcome back. Here's your pipeline overview.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button size="sm" variant="outline" className="gap-2"><Bell className="h-4 w-4" /><span className="hidden sm:inline">3 New</span></Button>
              <Button size="sm" className="gradient-primary border-0 gap-2"><Plus className="h-4 w-4" /> Post Job</Button>
            </div>
          </header>

          <div className="p-6 space-y-6">
            {/* Stat Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Users, label: "Total Candidates", value: "2,847", change: "+124 this week", changeColor: "text-success" },
                { icon: UserCheck, label: "Shortlisted", value: "342", change: "12% conversion", changeColor: "text-primary" },
                { icon: Clock, label: "Avg. Screening Time", value: "4.2s", change: "Per candidate", changeColor: "text-muted-foreground" },
                { icon: Target, label: "Open Positions", value: "18", change: "3 urgent fills", changeColor: "text-warning" },
              ].map(({ icon: Icon, label, value, change, changeColor }) => (
                <Card key={label} className="hover:shadow-md transition-shadow group">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center group-hover:gradient-primary transition-all duration-300">
                        <Icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold font-display">{value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{label}</p>
                    <p className={cn("text-[10px] mt-1 font-medium", changeColor)}>{change}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader><CardTitle className="text-base font-display">Hiring Pipeline Funnel</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={pipelineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="stage" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base font-display">Source Breakdown</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={sourceData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                        {sourceData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center mt-2">
                    {sourceData.map(({ name, value, color }) => (
                      <span key={name} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <span className="h-2 w-2 rounded-full" style={{ background: color }} />{name} ({value}%)
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Candidates */}
            <Card>
              <CardHeader><CardTitle className="text-base font-display">Recent AI Screenings</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border text-muted-foreground">
                      <th className="text-left py-3 font-medium">Candidate</th>
                      <th className="text-left py-3 font-medium">Applied For</th>
                      <th className="text-left py-3 font-medium">AI Score</th>
                      <th className="text-left py-3 font-medium">Status</th>
                      <th className="text-left py-3 font-medium">Screened</th>
                    </tr></thead>
                    <tbody>
                      {recentCandidates.map(({ name, role, score, status, time }) => (
                        <tr key={name} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                          <td className="py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold">
                                {name.split(" ").map(n => n[0]).join("")}
                              </div>
                              <span className="font-medium">{name}</span>
                            </div>
                          </td>
                          <td className="py-3 text-muted-foreground">{role}</td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                                <div className={cn("h-full rounded-full", score >= 90 ? "bg-success" : score >= 75 ? "bg-primary" : score >= 60 ? "bg-warning" : "bg-destructive")} style={{ width: `${score}%` }} />
                              </div>
                              <span className="text-xs font-bold">{score}%</span>
                            </div>
                          </td>
                          <td className="py-3">
                            <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full",
                              status === "Shortlisted" && "bg-success/10 text-success",
                              status === "In Assessment" && "bg-primary/10 text-primary",
                              status === "Screened" && "bg-warning/10 text-warning",
                              status === "Rejected" && "bg-destructive/10 text-destructive"
                            )}>
                              <span className={cn("h-1.5 w-1.5 rounded-full",
                                status === "Shortlisted" && "bg-success",
                                status === "In Assessment" && "bg-primary",
                                status === "Screened" && "bg-warning",
                                status === "Rejected" && "bg-destructive"
                              )} />
                              {status}
                            </span>
                          </td>
                          <td className="py-3 text-muted-foreground text-xs">{time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
