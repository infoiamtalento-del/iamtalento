import React, { useState, useRef } from "react";
import {
  Headphones,
  FileText,
  Ticket,
  MessageCircleQuestion,
  ChevronRight,
  Paperclip,
  X,
  Mail,
  Clock,
  ShieldCheck,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import "./pro-support.css";

interface ProSupportViewProps {
  onToast: (msg: string) => void;
}

interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  created: string;
  status: "Resolved" | "In progress" | "Open";
  lastReply: string;
}

const CATEGORY_OPTIONS = ["Payments", "Certificates", "Profile", "Job Matches", "Technical Issue", "Other"];

const STATUS_STYLES: Record<SupportTicket["status"], string> = {
  Resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "In progress": "bg-amber-50 text-amber-700 border-amber-200",
  Open: "bg-sky-50 text-sky-700 border-sky-200",
};

const INITIAL_TICKETS: SupportTicket[] = [
  { id: "#TKT-0042", subject: "Payment not reflected in wallet", category: "Payments", created: "07 Oct 2026, 11:24 AM", status: "Resolved", lastReply: "Thanks for reaching out. The issue has been resolved." },
  { id: "#TKT-0037", subject: "Certificate not received", category: "Certificates", created: "05 Oct 2026, 04:16 PM", status: "In progress", lastReply: "We have escalated your request to the issuing team." },
  { id: "#TKT-0031", subject: "Profile verification pending", category: "Profile", created: "02 Oct 2026, 02:54 PM", status: "Resolved", lastReply: "Your profile has been verified. You are all set." },
];

const FAQS = [
  { q: "How do I add money to my wallet?", a: "Open the Wallet view from your profile menu, choose Add Money, pick any saved card, UPI or net-banking method, and confirm the amount. The balance updates instantly." },
  { q: "How do I get a certificate?", a: "Every proctored assessment you complete issues a verified credential automatically. Go to My Assessments and use Download Certificate, or open the credential drawer from your profile." },
  { q: "How do I get my profile verified?", a: "Complete the mandatory core assessments and at least one domain-specific test. Once your scores are proctored and reviewed, the Verified badge appears on your profile within 24 hours." },
  { q: "Why am I not getting job matches?", a: "Matches improve as your profile gets stronger. Add verified skills, complete assessments and keep your career preferences up to date so the AI match engine can rank you accurately." },
  { q: "How do I delete my account?", a: "Raise a ticket with the subject 'Account deletion' and our team will process it within 7 working days, after confirming your identity over email." },
  { q: "How long does it take to respond to a ticket?", a: "Most tickets receive a first reply within 24 hours on working days. High-priority payment or verification issues are usually answered the same day." },
];

const QUICK_LINKS = [
  { key: "articles", icon: FileText, title: "Help articles", desc: "Browse our detailed guides and FAQs for quick answers.", target: "faq" },
  { key: "tickets", icon: Ticket, title: "My tickets", desc: "View and track your support requests and their status.", target: "tickets" },
  { key: "contact", icon: Headphones, title: "Contact support", desc: "Chat or email our team for personal assistance.", target: "help" },
] as const;

export const ProSupportView: React.FC<ProSupportViewProps> = ({ onToast }) => {
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [touched, setTouched] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const sectionRefs = {
    faq: useRef<HTMLDivElement>(null),
    tickets: useRef<HTMLDivElement>(null),
    help: useRef<HTMLDivElement>(null),
  };

  const scrollTo = (key: (typeof QUICK_LINKS)[number]["target"]) => {
    sectionRefs[key].current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = () => {
    setTouched(true);
    if (!category || !subject.trim() || !message.trim()) return;
    const nextId = `#TKT-${String(43 + tickets.filter(t => t.id.startsWith("#TKT-")).length).padStart(4, "0")}`;
    const now = new Date();
    const created = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) + ", " +
      now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: true }).toUpperCase();
    setTickets((prev) => [
      { id: nextId, subject: subject.trim(), category, created, status: "Open", lastReply: "We have received your ticket and will reply soon." },
      ...prev,
    ]);
    setCategory("");
    setPriority("Medium");
    setSubject("");
    setMessage("");
    setFile(null);
    setTouched(false);
    onToast(`Ticket ${nextId} submitted. We'll reply within 24 hours.`);
    setTimeout(() => sectionRefs.tickets.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
  };

  const labelCls = "text-[11px] font-semibold text-muted-foreground";
  const inputCls = "h-10 rounded-xl border-input text-sm bg-card";
  const err = (v: string) => touched && !v.trim();

  return (
    <div className="pro-support space-y-5">
      {/* ── Hero ── */}
      <section className="sp-hero relative overflow-hidden rounded-3xl bg-primary px-7 py-8 md:px-9">
        <span className="absolute -top-16 -right-10 w-56 h-56 rounded-full bg-primary-foreground/10" />
        <span className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-primary-foreground/5" />
        <div className="relative z-10 flex items-center gap-4">
          <span className="grid place-items-center w-12 h-12 rounded-2xl bg-primary-foreground/15 text-primary-foreground shrink-0">
            <Headphones className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-primary-foreground">Support Center</h1>
            <p className="text-sm text-primary-foreground/85 mt-1">Find answers, track requests, or contact our team.</p>
          </div>
        </div>
      </section>

      {/* ── Quick links ── */}
      <section className="grid sm:grid-cols-3 gap-4">
        {QUICK_LINKS.map(({ key, icon: Icon, title, desc, target }) => (
          <button
            key={key}
            onClick={() => scrollTo(target)}
            className="group flex items-start gap-3.5 rounded-2xl border border-border bg-card p-4 text-left shadow-sm hover:border-primary/40 hover:shadow-md transition-all cursor-pointer"
          >
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-accent text-primary shrink-0">
              <Icon className="w-5 h-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-foreground">{title}</span>
              <span className="block text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</span>
            </span>
            <ChevronRight className="w-4 h-4 mt-1 shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </button>
        ))}
      </section>

      {/* ── Main grid ── */}
      <div className="grid lg:grid-cols-[1.35fr_1fr] gap-5 items-start">
        {/* Left column */}
        <div className="space-y-5 min-w-0">
          {/* Create a support ticket */}
          <section className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-accent text-primary shrink-0">
                <MessageCircleQuestion className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base font-display font-bold text-foreground">Create a support ticket</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Tell us what you need help with. We'll get back to you as soon as possible.</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-5">
              <div>
                <label className={labelCls}>Category <span className="text-destructive">*</span></label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={cn(inputCls, "mt-1 w-full px-3 cursor-pointer", err(category) && "border-destructive")}
                >
                  <option value="">Select category</option>
                  {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Priority <span className="text-destructive">*</span></label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)} className={cn(inputCls, "mt-1 w-full px-3 cursor-pointer")}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className={labelCls}>Subject <span className="text-destructive">*</span></label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Briefly describe your issue"
                className={cn(inputCls, "mt-1 w-full px-3", err(subject) && "border-destructive")}
              />
            </div>

            <div className="mt-4">
              <label className={labelCls}>Message <span className="text-destructive">*</span></label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 1000))}
                placeholder="Please provide detailed information about your issue…"
                className={cn("mt-1 w-full min-h-[110px] rounded-xl border border-input bg-card px-3 py-2.5 text-sm resize-y", err(message) && "border-destructive")}
              />
              <p className="text-[10px] text-muted-foreground text-right">{message.length}/1000</p>
            </div>

            <div className="mt-2 rounded-xl border border-dashed border-border bg-secondary/40 px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <Paperclip className="w-4 h-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground">Attach files (optional)</p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {file ? file.name : "Supports JPG, PNG, PDF (Max 5MB)"}
                  </p>
                </div>
              </div>
              {file ? (
                <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-destructive" onClick={() => setFile(null)}>
                  <X className="w-3.5 h-3.5" /> Remove
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="h-8 text-xs border-primary/40 text-primary hover:bg-accent" onClick={() => fileRef.current?.click()}>
                  Choose File
                </Button>
              )}
              <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f); e.target.value = ""; }} />
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-5">
              <Button className="h-10 px-5 gap-2 rounded-xl text-sm font-semibold" onClick={handleSubmit}>
                Submit ticket <ArrowRight className="w-4 h-4" />
              </Button>
              <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Clock className="w-3.5 h-3.5" /> Typical response time: within 24 hours
              </p>
            </div>
          </section>

          {/* Recent tickets */}
          <section ref={sectionRefs.tickets} className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-sm scroll-mt-24">
            <div className="flex items-start gap-3">
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-accent text-primary shrink-0">
                <Ticket className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base font-display font-bold text-foreground">Your recent tickets</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Track the requests you have raised with our team.</p>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-xs table-fixed">
                <thead>
                  <tr className="border-b border-border text-left text-[10px] uppercase tracking-wide text-muted-foreground">
                    <th className="py-2.5 pr-3 font-semibold">Ticket ID</th>
                    <th className="py-2.5 pr-3 font-semibold">Subject</th>
                    <th className="py-2.5 pr-3 font-semibold">Category</th>
                    <th className="py-2.5 pr-3 font-semibold">Created on</th>
                    <th className="py-2.5 pr-3 font-semibold">Status</th>
                    <th className="py-2.5 pr-3 font-semibold">Last reply</th>
                    <th className="py-2.5 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t) => (
                    <tr key={t.id} className="border-b border-border/60 last:border-0 hover:bg-secondary/40 transition-colors">
                      <td className="py-3 pr-3 font-semibold text-foreground">{t.id}</td>
                      <td className="py-3 pr-3 text-foreground">{t.subject}</td>
                      <td className="py-3 pr-3 text-muted-foreground">{t.category}</td>
                      <td className="py-3 pr-3 text-muted-foreground">{t.created}</td>
                      <td className="py-3 pr-3">
                        <span className={cn("inline-flex whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[10px] font-semibold", STATUS_STYLES[t.status])}>{t.status}</span>
                      </td>
                      <td className="py-3 pr-3 text-muted-foreground max-w-[180px] truncate">{t.lastReply}</td>
                      <td className="py-3 text-right">
                        <button className="inline-flex items-center gap-1 text-primary font-semibold hover:underline cursor-pointer whitespace-nowrap">
                          View details <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-muted-foreground mt-3">Click a ticket to open the conversation. Replies appear live.</p>
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-5 min-w-0">
          {/* FAQ */}
          <section ref={sectionRefs.faq} className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-sm scroll-mt-24">
            <div className="flex items-start gap-3">
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-accent text-primary shrink-0">
                <MessageCircleQuestion className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base font-display font-bold text-foreground">Frequently asked questions</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Quick answers to common questions.</p>
              </div>
            </div>

            <div className="mt-4 space-y-2.5">
              {FAQS.map((f, i) => (
                <div key={f.q} className="rounded-xl border border-border overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left text-xs font-semibold text-foreground hover:bg-accent/50 transition-colors cursor-pointer"
                    aria-expanded={openFaq === i}
                  >
                    <span>{f.q}</span>
                    <Plus className={cn("w-4 h-4 text-primary shrink-0 transition-transform duration-200", openFaq === i && "rotate-45")} />
                  </button>
                  {openFaq === i && (
                    <p className="px-4 pb-3.5 text-[11px] leading-relaxed text-muted-foreground">{f.a}</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Need more help */}
          <section ref={sectionRefs.help} className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-sm scroll-mt-24">
            <div className="flex items-start gap-3">
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-accent text-primary shrink-0">
                <Headphones className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base font-display font-bold text-foreground">Need more help?</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Our support team is always ready to assist you.</p>
              </div>
            </div>

            <div className="mt-4 space-y-3.5">
              <div className="flex items-start gap-3">
                <span className="grid place-items-center w-8 h-8 rounded-lg bg-accent text-primary shrink-0"><Mail className="w-4 h-4" /></span>
                <div>
                  <p className="text-xs font-semibold text-foreground">Email us</p>
                  <a href="mailto:support@iamtalento.app" className="text-xs font-semibold text-primary hover:underline">support@iamtalento.app</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="grid place-items-center w-8 h-8 rounded-lg bg-accent text-primary shrink-0"><Clock className="w-4 h-4" /></span>
                <div>
                  <p className="text-xs font-semibold text-foreground">Support hours</p>
                  <p className="flex items-center flex-wrap gap-2 text-xs text-muted-foreground">
                    Mon – Sat, 9 AM – 7 PM (IST)
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 text-[10px] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <Button className="w-full h-10 mt-5 gap-2 rounded-xl text-sm font-semibold" onClick={() => onToast("Our team will reach out to you shortly.")}>
              <Mail className="w-4 h-4" /> Contact support <ArrowRight className="w-4 h-4" />
            </Button>

            <p className="flex items-start gap-2 mt-4 text-[10px] leading-relaxed text-muted-foreground bg-accent/60 rounded-xl px-3 py-2.5">
              <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <span><b className="text-foreground">Your information is safe with us.</b> We respect your privacy and keep your data secure.</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
