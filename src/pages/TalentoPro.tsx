import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  ProJob,
  ProCandidate,
  ProApplication,
  ProUser,
  SEED_JOBS_RAW,
  DEFAULT_USERS,
  DEFAULT_APPS,
  CANDIDATES_SEED,
  STAGES,
} from "@/data/proData";

import { getCandidatePhoto } from "@/data/portalAssets";
import { ProView, ProDrawerState } from "@/components/pro/proTypes";
import Navbar from "@/components/layout/Navbar";
import { ProCandidateAccountMenu } from "@/components/pro/ProCandidateAccountMenu";
import { ProEmployerAccountMenu } from "@/components/pro/ProEmployerAccountMenu";
import { ProJobsView } from "@/components/pro/ProJobsView";
import { ProJobDetail } from "@/components/pro/ProJobDetail";
import { ProProfileView } from "@/components/pro/ProProfileView";
import { ProDashboardView } from "@/components/pro/ProDashboardView";
import { ProApplicationsView } from "@/components/pro/ProApplicationsView";
import { ProNotificationsView } from "@/components/pro/ProNotificationsView";
import { ProCertificationsView } from "@/components/pro/ProCertificationsView";
import { ProResumeBuilderView } from "@/components/pro/ProResumeBuilderView";
import { ProWalletView } from "@/components/pro/ProWalletView";
import { ProPortfolioView } from "@/components/pro/ProPortfolioView";
import { ProVerifiedView } from "@/components/pro/ProVerifiedView";
import { ProSupportView } from "@/components/pro/ProSupportView";
import { ProDiscoverView } from "@/components/pro/ProDiscoverView";
import { ProEmployerViews } from "@/components/pro/ProEmployerViews";
import { ProEmployerProfileView } from "@/components/pro/ProEmployerProfileView";
import { ProDrawers } from "@/components/pro/ProDrawers";
import { ProAiAssistant } from "@/components/pro/ProAiAssistant";
import { ProEmployerJobPosting } from "@/components/pro/ProEmployerJobPosting";
import { ProEmployerPipeline } from "@/components/pro/ProEmployerPipeline";
import { ProEmployerNotifications } from "@/components/pro/ProEmployerNotifications";
import { ProEmployerMyAccount } from "@/components/pro/ProEmployerMyAccount";
import { ProEmployerDemoServices } from "@/components/pro/ProEmployerDemoServices";
import { ProEmployerCandidateDetail } from "@/components/pro/ProEmployerCandidateDetail";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DEMO_EMPLOYER_JOBS, DEMO_EMPLOYER_APPS, INITIAL_EMPLOYER_DEMO, createDemoApplication, type EmployerDemoState } from "@/data/employerDemo";

interface ToastMessage {
  id: number;
  text: string;
}

const loadStorage = <T,>(key: string, defaultVal: T): T => {
  try {
    const val = localStorage.getItem("tq_" + key);
    return val ? JSON.parse(val) : defaultVal;
  } catch {
    return defaultVal;
  }
};

const saveStorage = <T,>(key: string, val: T): void => {
  try {
    const serialized = JSON.stringify(val);
    if (localStorage.getItem("tq_" + key) !== serialized) localStorage.setItem("tq_" + key, serialized);
  } catch (e) {
    console.error("Storage error:", e);
  }
};

const normalizeUsers = (raw: any): Record<string, ProUser> => {
  const result: Record<string, ProUser> = { ...DEFAULT_USERS };
  const mergeUser = (base: ProUser, incoming: any): ProUser => {
    if (!incoming || typeof incoming !== "object") return base;
    const isCand = base.role === "candidate" || incoming.role === "candidate";
    const name = isCand && (incoming.name === "Arjun Mehta" || !incoming.name) ? base.name : incoming.name;
    const sk = isCand && base.sk ? [...new Set([...(base.sk || []), ...(incoming.sk || [])])] : incoming.sk || base.sk;
    return {
      ...base,
      ...incoming,
      name,
      sk,
      ce: incoming.ce && incoming.ce.length ? incoming.ce : base.ce,
      wal: incoming.wal && incoming.wal.bal ? incoming.wal : base.wal,
    };
  };

  if (Array.isArray(raw)) {
    raw.forEach((u) => {
      if (u && u.email) {
        const base = DEFAULT_USERS[u.email] || result[u.email] || u;
        result[u.email] = mergeUser(base, u);
      }
    });
  } else if (raw && typeof raw === "object") {
    Object.entries(raw).forEach(([k, u]: [string, any]) => {
      if (u && typeof u === "object") {
        const base = DEFAULT_USERS[k] || result[k] || u;
        result[k] = mergeUser(base, u);
      }
    });
  }
  return result;
};

const TalentoPro: React.FC = () => {
  // Navigation & Shell State
  const [sessionEmail, setSessionEmail] = useState<string>(() => {
    const s = loadStorage("sess", "demo.candidate@talento.app");
    return s && typeof s === "string" ? s : "demo.candidate@talento.app";
  });

  const [users, setUsers] = useState<Record<string, ProUser>>(() => {
    const raw = loadStorage("users", DEFAULT_USERS);
    return normalizeUsers(raw);
  });

  const currentUser: ProUser = useMemo(() => {
    if (users && users[sessionEmail]) return users[sessionEmail];
    if (sessionEmail && sessionEmail.includes("employer")) {
      return users["demo.employer@talento.app"] || DEFAULT_USERS["demo.employer@talento.app"];
    }
    return (
      users["demo.candidate@talento.app"] ||
      DEFAULT_USERS["demo.candidate@talento.app"] ||
      Object.values(users)[0] ||
      DEFAULT_USERS["demo.candidate@talento.app"]
    );
  }, [users, sessionEmail]);

  const currentRole: "candidate" | "employer" = currentUser.role || "candidate";

  const [searchParams, setSearchParams] = useSearchParams();
  const [activeView, setActiveView] = useState<ProView>(() => {
    const fromParam = searchParams.get("view") as ProView | null;
    if (fromParam) return fromParam;
    return currentRole === "employer" ? "cp" : "jobs";
  });

  useEffect(() => {
    const fromParam = searchParams.get("view") as ProView | null;
    if (fromParam) {
      setActiveView(fromParam);
    }
  }, [searchParams]);

  const [editingCp, setEditingCp] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Storage Synced Jobs & Applications
  const INITIAL_JOBS: ProJob[] = useMemo(() => {
    return SEED_JOBS_RAW.map((s, i) => ({
      id: i + 1,
      t: s[0],
      c: s[1],
      l: s[2],
      m: s[3],
      ty: s[4],
      e: s[5],
      a: s[6],
      b: s[7],
      sk: s[8],
      at: Date.now() - (s[9] || 0) * 86400000,
      by:
        s[1] === "Super30"
          ? "demo.employer@talento.app"
          : "hr@" + s[1].toLowerCase().replace(/[^a-z]/g, "") + ".com",
    }));
  }, []);

  const [jobs, setJobs] = useState<ProJob[]>(() => {
    try {
      const val = localStorage.getItem("tq_jobs");
      if (!val) return INITIAL_JOBS;
      const parsed = JSON.parse(val);
      if (
        Array.isArray(parsed) &&
        parsed.length > 0 &&
        typeof parsed[0] === "object" &&
        parsed[0] !== null &&
        typeof parsed[0].t === "string" &&
        Array.isArray(parsed[0].sk)
      ) {
        return parsed;
      }
    } catch {}
    return INITIAL_JOBS;
  });

  const [apps, setApps] = useState<ProApplication[]>(() => {
    try {
      const val = localStorage.getItem("tq_apps");
      if (!val) return DEFAULT_APPS;
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) {
        return parsed.filter((a) => a && a.id !== 1001 && a.id !== 1002);
      }
    } catch {}
    return DEFAULT_APPS;
  });

  const [employerDemo, setEmployerDemo] = useState<EmployerDemoState>(() => loadStorage("employer_demo", INITIAL_EMPLOYER_DEMO));
  const [simulateLive, setSimulateLive] = useState(false);
  useEffect(() => { saveStorage("employer_demo", employerDemo); }, [employerDemo]);
  useEffect(() => {
    if (currentRole !== "employer" || sessionEmail !== "demo.employer@talento.app" || loadStorage("employer_seed_v1", false)) return;
    setJobs(previous => [...previous, ...DEMO_EMPLOYER_JOBS.filter(job => !previous.some(j => j.id === job.id))]);
    setApps(previous => [...previous, ...DEMO_EMPLOYER_APPS.filter(app => !previous.some(a => a.id === app.id))]);
    saveStorage("employer_seed_v1", true);
  }, [currentRole, sessionEmail]);
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (!event.newValue) return;
      try {
        if (event.key === "tq_jobs") setJobs(JSON.parse(event.newValue));
        if (event.key === "tq_apps") setApps(JSON.parse(event.newValue));
        if (event.key === "tq_users") setUsers(normalizeUsers(JSON.parse(event.newValue)));
        if (event.key === "tq_employer_demo") setEmployerDemo(JSON.parse(event.newValue));
      } catch { /* Ignore unrelated or malformed browser storage. */ }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  // Effective view validation so invalid/mismatched view never renders blank
  const candidateViews: ProView[] = [
    "jobs",
    "saved",
    "profile",
    "dash",
    "applied",
    "upd",
    "disc",
    "resume",
    "cert",
    "wallet",
    "port",
    "ver",
    "support",
  ];

  const employerViews: ProView[] = [
    "dash",
    "pipe",
    "talent",
    "post",
    "cp",
    "notif",
    "wallet",
    "port",
    "ver",
    "account",
    "employer-assessments",
    "interviews",
    "advertise",
    "subscription",
    "payment-history",
    "settings",
    "support",
  ];

  const effectiveView: ProView = useMemo(() => {
    if (currentRole === "employer") {
      return employerViews.includes(activeView) ? activeView : "cp";
    }
    return candidateViews.includes(activeView) ? activeView : "jobs";
  }, [currentRole, activeView]);

  // Drawer & Comparison States
  const [drawerState, setDrawerState] = useState<ProDrawerState>(null);
  useEffect(() => {
    if (currentRole !== "employer") return;
    const applicant = searchParams.get("applicant");
    const candidate = searchParams.get("candidate");
    if (applicant) setDrawerState({ type: "applicant", id: Number(applicant) });
    else if (candidate) setDrawerState({ type: "candidate", name: candidate, jobId: Number(searchParams.get("job")) || undefined });
    else setDrawerState(previous => previous?.type === "applicant" || previous?.type === "candidate" ? null : previous);
  }, [searchParams, currentRole]);
  const openDrawer = (drawer: ProDrawerState) => {
    setDrawerState(drawer);
    if (currentRole === "employer" && (drawer?.type === "applicant" || drawer?.type === "candidate")) {
      const params = new URLSearchParams({ view: effectiveView });
      if (drawer.type === "applicant") params.set("applicant", String(drawer.id));
      else { params.set("candidate", drawer.name); if (drawer.jobId) params.set("job", String(drawer.jobId)); }
      setSearchParams(params);
      window.scrollTo({ top: 0 });
    }
  };
  const closeCandidate = () => { setDrawerState(null); setSearchParams({ view: effectiveView }); window.scrollTo({ top: 0 }); };
  const [aiOpen, setAiOpen] = useState(false);
  const [compareJobs, setCompareJobs] = useState<number[]>([]);
  const [compareCandidates, setCompareCandidates] = useState<string[]>([]);

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((text: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const simulateApplication = useCallback(() => {
    const ownedJobs = jobs.filter(job => job.by === sessionEmail);
    if (!ownedJobs.length) { addToast("Publish a job before simulating an application."); return; }
    const job = ownedJobs[0];
    const available = CANDIDATES_SEED.findIndex((candidate) => !apps.some(a => a.jid === job.id && a.name === candidate.n));
    if (available < 0) { addToast("Every sample candidate has applied to this job. Publish another job to continue."); return; }
    setApps(previous => [createDemoApplication(available, job.id, Date.now()), ...previous]);
    addToast(`Simulated new application from ${CANDIDATES_SEED[available].n}.`);
  }, [jobs, apps, sessionEmail, addToast]);
  useEffect(() => {
    if (!simulateLive || currentRole !== "employer") return;
    const interval = setInterval(simulateApplication, 20000);
    return () => clearInterval(interval);
  }, [simulateLive, currentRole, simulateApplication]);

  // Save to storage on updates
  useEffect(() => {
    saveStorage("sess", sessionEmail);
  }, [sessionEmail]);

  useEffect(() => {
    saveStorage("users", users);
  }, [users]);

  useEffect(() => {
    saveStorage("jobs", jobs);
  }, [jobs]);

  useEffect(() => {
    saveStorage("apps", apps);
  }, [apps]);

  // Dark mode toggle
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Automated 24-hour SLA update checker
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const updated = apps.map((a) => {
        // If pending for >24 hours and no update sent yet
        if ((!a.upd || a.upd.length === 0) && now - a.at > 86400000 && a.st === "Applied") {
          return {
            ...a,
            upd: [
              {
                msg: "Autonomous 24h SLA update: Hiring team has reviewed your profile. Pipeline stage remains active.",
                at: now,
                auto: true,
              },
            ],
          };
        }
        return a;
      });
      setApps(updated);
    }, 60000);

    return () => clearInterval(interval);
  }, [apps]);

  // Account / Role Switcher
  const handleSwitchRole = (role: "candidate" | "employer") => {
    const email = role === "employer" ? "demo.employer@talento.app" : "demo.candidate@talento.app";
    setSessionEmail(email);
    setActiveView(role === "employer" ? "cp" : "jobs");
    setEditingCp(false);
    setDrawerState(null);
    addToast(`Switched account to ${role === "employer" ? "Super30 (Employer)" : "Vignesh (Candidate)"}`);
  };

  // User Profile updater
  const handleUpdateUser = (updatedUser: ProUser) => {
    setUsers((prev) => ({
      ...prev,
      [sessionEmail]: updatedUser,
    }));
  };

  // Job Actions
  const handleApplyJob = (jobId: number, coverNote?: string) => {
    const existing = apps.find((a) => a.jid === jobId && a.who === sessionEmail);
    if (existing) {
      addToast("You have already applied to this opening.");
      return;
    }

    const newApp: ProApplication = {
      id: Date.now(),
      jid: jobId,
      who: sessionEmail,
      name: currentUser.name,
      exp: currentUser.exp || 3,
      sk: currentUser.sk || [],
      ce: currentUser.ce || [],
      as: currentUser.as || {},
      st: "Applied",
      at: Date.now(),
      cn: coverNote || "",
      upd: [
        {
          msg: "Application received. 24-hour review SLA activated.",
          at: Date.now(),
          auto: true,
        },
      ],
    };

    setApps((prev) => [newApp, ...prev]);
    addToast("Application submitted! 24h review SLA active.");
  };

  const handleWithdrawApplication = (appId: number) => {
    setApps((prev) => prev.filter((a) => a.id !== appId));
    addToast("Application withdrawn successfully.");
  };

  const handleSaveJob = (jobId: number) => {
    const saved = currentUser.saved || [];
    const isSaved = saved.includes(jobId);
    const newSaved = isSaved ? saved.filter((id) => id !== jobId) : [...saved, jobId];

    handleUpdateUser({
      ...currentUser,
      saved: newSaved,
    });

    addToast(isSaved ? "Job removed from saved." : "Job bookmarked to saved!");
  };

  // Applicant & Pipeline Actions (Employer)
  const handleUpdateApplicantStage = (appId: number, stage: string) => {
    const validStage = STAGES.find((value) => value === stage);
    if (!validStage) return;
    setApps((prev) =>
      prev.map((a) => {
        if (a.id === appId) {
          return {
            ...a,
            st: validStage,
            upd: [
              ...(a.upd || []),
              {
                msg: `Candidate status updated to "${stage}" by hiring manager.`,
                at: Date.now(),
              },
            ],
          };
        }
        return a;
      })
    );
    addToast(`Applicant moved to ${stage}`);
  };

  const handleSendApplicantUpdate = (appId: number, message: string) => {
    setApps((prev) =>
      prev.map((a) => {
        if (a.id === appId) {
          return {
            ...a,
            upd: [
              ...(a.upd || []),
              {
                msg: message,
                at: Date.now(),
              },
            ],
          };
        }
        return a;
      })
    );
  };

  const handleScheduleInterview = (appId: number, dateStr: string) => {
    setApps((prev) =>
      prev.map((a) => {
        if (a.id === appId) {
          return {
            ...a,
            iv: dateStr,
            st: "Interview",
            upd: [
              ...(a.upd || []),
              {
                msg: `Interview round scheduled for ${dateStr}.`,
                at: Date.now(),
              },
            ],
          };
        }
        return a;
      })
    );
  };

  const handleSaveRecruiterNote = (appId: number, note: string) => {
    setApps((prev) =>
      prev.map((a) => {
        if (a.id === appId) {
          return { ...a, note };
        }
        return a;
      })
    );
  };

  const handleBulkUpdateStage = (appIds: number[], stage: string) => {
    const validStage = STAGES.find((value) => value === stage);
    if (!validStage) return;
    setApps((prev) =>
      prev.map((a) => {
        if (appIds.includes(a.id)) {
          return {
            ...a,
            st: validStage,
            upd: [
              ...(a.upd || []),
              {
                msg: `Candidate stage moved to ${stage}.`,
                at: Date.now(),
              },
            ],
          };
        }
        return a;
      })
    );
    addToast(`Updated ${appIds.length} applicants to ${stage}`);
  };

  const handleBulkSendReview = (appIds: number[]) => {
    setApps((prev) =>
      prev.map((a) => {
        if (appIds.includes(a.id)) {
          return {
            ...a,
            upd: [
              ...(a.upd || []),
              {
                msg: "Your application is under active review by the technical hiring team.",
                at: Date.now(),
              },
            ],
          };
        }
        return a;
      })
    );
    addToast(`Sent 24h SLA review updates to ${appIds.length} applicants!`);
  };

  // Job Publishing & Management
  const handlePublishJob = (jobData: Partial<ProJob>) => {
    const newJob: ProJob = {
      id: Date.now(),
      t: jobData.t || "Software Engineer",
      description: jobData.description,
      c: jobData.c || "Super30",
      l: jobData.l || "Bengaluru",
      m: jobData.m || "Hybrid",
      ty: jobData.ty || "Full-time",
      e: jobData.e ?? 2,
      a: jobData.a ?? 15,
      b: jobData.b ?? 25,
      sk: jobData.sk || ["React", "TypeScript"],
      at: Date.now(),
      by: sessionEmail,
    };

    setJobs((prev) => [newJob, ...prev]);
    setActiveView("dash");
  };

  const handleDuplicateJob = (jobId: number) => {
    const target = jobs.find((j) => j.id === jobId);
    if (!target) return;
    const cloned: ProJob = {
      ...target,
      id: Date.now(),
      t: `${target.t} (Copy)`,
      at: Date.now(),
    };
    setJobs((prev) => [cloned, ...prev]);
    addToast(`Duplicated job listing "${cloned.t}"`);
  };

  const handleCloseJob = (jobId: number) => {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
    addToast("Job listing closed.");
  };

  // Wallet updates
  const handleUpdateWallet = (newBalance: number, newTx: any) => {
    const wal = currentUser.wal || { bal: 0, hist: [] };
    const updatedUser: ProUser = {
      ...currentUser,
      wal: {
        ...wal,
        bal: newBalance,
        hist: [newTx, ...(wal.hist || [])],
      },
    };
    handleUpdateUser(updatedUser);
  };

  // Unread badge count
  const unreadCount = useMemo(() => {
    const lastSeen = currentUser.seen || 0;
    if (currentRole === "employer") {
      const myJobs = jobs.filter((j) => j.by === sessionEmail);
      return apps.filter((a) => myJobs.some((j) => j.id === a.jid) && a.at > lastSeen).length;
    }
    return apps
      .filter((a) => a.who === sessionEmail)
      .flatMap((a) => a.upd || [])
      .filter((u) => u.at > lastSeen).length;
  }, [apps, jobs, sessionEmail, currentRole, currentUser.seen]);

  // Saved count
  const savedCount = (currentUser.saved || []).length;
  const selectedJob = drawerState?.type === "job" ? jobs.find(job => job.id === drawerState.id) : undefined;

  const candidatePage = currentRole === "employer" && (drawerState?.type === "applicant" || drawerState?.type === "candidate") ? drawerState : null;
  const selectedApplicant = candidatePage?.type === "applicant" ? apps.find(a => a.id === candidatePage.id && jobs.some(j => j.id === a.jid && j.by === sessionEmail)) : undefined;
  const selectedCandidate = candidatePage?.type === "candidate" ? CANDIDATES_SEED.find(c => c.n === candidatePage.name) : undefined;
  return (
    <div
      className={cn("min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary", currentRole === "employer" && (candidatePage || effectiveView === "employer-assessments") && "employer-reference-shell")}
    >
      <Helmet>
        <title>
          {currentRole === "employer"
            ? "Employer Recruiter Studio — Talento Pro"
            : "Verified Engineering Career Hub — Talento Pro"}
        </title>
        <meta
          name="description"
          content="Talento Pro connects verified candidates and employers with autonomous 24-hour review SLA guarantees, ATS resume builder, and proctored technical test scores."
        />
      </Helmet>

      {/* Site Main Menu Nav */}
      <Navbar
        userProfile={{
          name: currentUser.name,
          email: currentUser.email,
          avatarSrc: getCandidatePhoto(currentUser.name),
          role: currentRole,
        }}
        onSignOut={() => localStorage.removeItem("tq_sess")}
        accountMenu={currentRole === "candidate" ? (onSignOut) => (
          <ProCandidateAccountMenu
            name={currentUser.name}
            avatarSrc={getCandidatePhoto(currentUser.name)}
            activeView={effectiveView}
            unreadCount={unreadCount}
            isDarkMode={isDarkMode}
            onNavigate={(view) => { setDrawerState(null); setActiveView(view); window.scrollTo({ top: 0 }); }}
            onCertificate={() => setDrawerState({ type: "certificate", key: "overall" })}
            onToggleTheme={() => setIsDarkMode((value) => !value)}
            onSignOut={onSignOut}
          />
        ) : (onSignOut) => (
          <ProEmployerAccountMenu
            name={currentUser.name}
            activeView={effectiveView}
            unreadCount={unreadCount}
            onNavigate={(view) => { setDrawerState(null); setSearchParams({ view }); setEditingCp(false); setActiveView(view); window.scrollTo({ top: 0 }); }}
            onSignOut={onSignOut}
          />
        )}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 container w-full pt-24 pb-8">
        {currentRole === "employer" && <div className="mb-6 flex flex-wrap items-center gap-4 border-b border-border pb-4"><div className="mr-auto"><p className="text-sm font-semibold text-primary">Demo workspace · Sample data</p><p className="mt-1 text-xs text-muted-foreground">Simulated activity only. No real messages, AI sessions or charges.</p></div><label className="flex items-center gap-2 text-xs"><Switch aria-label="Simulate live activity" checked={simulateLive} onCheckedChange={setSimulateLive} />Simulate live activity</label><Button size="sm" variant="outline" onClick={simulateApplication}>Simulate new application</Button></div>}
        <div className="min-w-0 flex-1">
        {candidatePage ? (selectedApplicant || selectedCandidate ? <ProEmployerCandidateDetail key={JSON.stringify(candidatePage)} application={selectedApplicant} candidate={selectedCandidate} job={jobs.find(j => j.id === (selectedApplicant?.jid || (candidatePage.type === "candidate" ? candidatePage.jobId : undefined)))} onBack={closeCandidate} onToast={addToast} onSave={(id, changes, message, interview) => { setApps(previous => previous.map(a => a.id === id ? { ...a, ...changes, st: interview ? "Interview" : changes.st, iv: interview || a.iv, upd: [...(a.upd || []), ...(a.st !== changes.st ? [{ msg: `Candidate status updated to "${changes.st}".`, at: Date.now() }] : []), ...(message.trim() ? [{ msg: message.trim(), at: Date.now() }] : []), ...(interview ? [{ msg: `Interview round scheduled for ${interview}.`, at: Date.now() }] : [])] } : a)); addToast("Application changes saved. Demo updates only; no message sent."); }} /> : <div className="py-12"><p>Candidate not found in this workspace.</p><Button onClick={closeCandidate} variant="outline" className="mt-4">Back to Candidates</Button></div>) : selectedJob ? <ProJobDetail key={selectedJob.id} job={selectedJob} user={currentUser} jobs={jobs} applications={apps} onBack={() => setDrawerState(null)} onOpenJob={(id) => { setDrawerState({ type: "job", id }); window.scrollTo({ top: 0 }); }} onApply={handleApplyJob} onSave={handleSaveJob} /> : (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentRole}-${effectiveView}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {/* CANDIDATE VIEWS */}
            {currentRole === "candidate" && (
              <>
                {effectiveView === "jobs" && (
                  <ProJobsView
                    user={currentUser}
                    jobs={jobs}
                    applications={apps}
                    onOpenJob={(jobId) => setDrawerState({ type: "job", id: jobId })}
                    onApplyJob={handleApplyJob}
                    onSaveJob={handleSaveJob}
                    onCompareToggle={(jobId) => {
                      setCompareJobs((prev) =>
                        prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
                      );
                    }}
                    compareSelection={compareJobs}
                    onOpenCompareDrawer={() => setDrawerState({ type: "compare-jobs" })}
                    onToast={addToast}
                  />
                )}

                {effectiveView === "saved" && (
                  <ProJobsView
                    user={currentUser}
                    jobs={jobs}
                    applications={apps}
                    initialOnlySaved={true}
                    onOpenJob={(jobId) => setDrawerState({ type: "job", id: jobId })}
                    onApplyJob={handleApplyJob}
                    onSaveJob={handleSaveJob}
                    onCompareToggle={(jobId) => {
                      setCompareJobs((prev) =>
                        prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
                      );
                    }}
                    compareSelection={compareJobs}
                    onOpenCompareDrawer={() => setDrawerState({ type: "compare-jobs" })}
                    onToast={addToast}
                  />
                )}

                {effectiveView === "profile" && (
                  <ProProfileView
                    user={currentUser}
                    onSaveProfile={handleUpdateUser}
                    onToast={addToast}
                  />
                )}

                {effectiveView === "dash" && (
                  <ProDashboardView
                    user={currentUser}
                    jobs={jobs}
                    applications={apps}
                    onNavigate={(v) => setActiveView(v)}
                    onOpenDrawer={openDrawer}
                    onAddSkill={(skill) => {
                      const currentSkills = currentUser.sk || [];
                      if (!currentSkills.includes(skill)) {
                        handleUpdateUser({
                          ...currentUser,
                          sk: [...currentSkills, skill],
                        });
                        addToast(`Added "${skill}" to your skills!`);
                      }
                    }}
                  />
                )}

                {effectiveView === "applied" && (
                  <ProApplicationsView
                    user={currentUser}
                    jobs={jobs}
                    applications={apps}
                    onWithdrawApplication={handleWithdrawApplication}
                    onOpenDrawer={openDrawer}
                  />
                )}

                {effectiveView === "upd" && (
                  <ProNotificationsView
                    user={currentUser}
                    jobs={jobs}
                    applications={apps}
                    onOpenDrawer={openDrawer}
                    onMarkSeen={() => {
                      handleUpdateUser({
                        ...currentUser,
                        seen: Date.now(),
                      });
                    }}
                  />
                )}

                {effectiveView === "disc" && (
                  <ProDiscoverView
                    user={currentUser}
                    jobs={jobs}
                    applications={apps}
                    onApplyJob={handleApplyJob}
                    onSaveJob={handleSaveJob}
                    onToast={addToast}
                  />
                )}

                {effectiveView === "resume" && (
                  <ProResumeBuilderView
                    user={currentUser}
                    jobs={jobs}
                    onSaveUser={handleUpdateUser}
                    onToast={addToast}
                  />
                )}

                {effectiveView === "cert" && (
                  <ProCertificationsView
                    user={currentUser}
                    onAddCertification={(certStr) => {
                      const current = currentUser.ce || [];
                      handleUpdateUser({ ...currentUser, ce: [...current, certStr] });
                      addToast("Certification added to your profile!");
                    }}
                    onRemoveCertification={(index) => {
                      const current = currentUser.ce || [];
                      handleUpdateUser({ ...currentUser, ce: current.filter((_, i) => i !== index) });
                      addToast("Certification removed.");
                    }}
                    onOpenDrawer={openDrawer}
                    onNavigateToQuiz={() => { window.location.href = "/assessments/explore"; }}
                  />
                )}

                {effectiveView === "wallet" && (
                  <ProWalletView
                    user={currentUser}
                    onUpdateWallet={handleUpdateWallet}
                    onOpenDrawer={openDrawer}
                    onToast={addToast}
                  />
                )}

                {effectiveView === "port" && (
                  <ProPortfolioView
                    user={currentUser}
                    jobs={jobs}
                    onOpenDrawer={openDrawer}
                    onToast={addToast}
                    onUpdateUser={handleUpdateUser}
                  />
                )}

                {effectiveView === "ver" && (
                  <ProVerifiedView
                    user={currentUser}
                    jobs={jobs}
                    onNavigate={(v) => setActiveView(v)}
                    onUpdateUser={handleUpdateUser}
                    onOpenDrawer={openDrawer}
                    onToast={addToast}
                  />
                )}

                {effectiveView === "support" && (
                  <ProSupportView onToast={addToast} />
                )}
              </>
            )}

            {/* EMPLOYER VIEWS */}
            {currentRole === "employer" && (
              <>
                {effectiveView === "account" && <ProEmployerMyAccount user={currentUser} jobs={jobs} applications={apps} onNavigate={setActiveView} />}
                {["employer-assessments", "interviews", "advertise", "subscription", "settings", "payment-history"].includes(effectiveView) && <ProEmployerDemoServices view={effectiveView} user={currentUser} jobs={jobs} applications={apps} state={employerDemo} onChange={(next) => { setEmployerDemo(next); setApps(previous => previous.map(app => { const result = next.assessments.find(r => r.candidate === app.name && r.status === "Completed" && r.score !== undefined); return result ? { ...app, as: { ...app.as, [result.name]: result.score ?? 0 } } : app; })); }} onNavigate={setActiveView} onOpenDrawer={openDrawer} onToast={addToast} onUpdateUser={handleUpdateUser} onSamplePayment={(description) => { handleUpdateWallet(currentUser.wal?.bal || 0, { id: `DEMO-${Date.now()}`, at: Date.now(), type: "debit", amt: 0, desc: description, via: "Simulation", st: "Demo only" }); addToast("Demo plan activated; sample receipt added. No charge."); }} />}
                {effectiveView === "post" && <ProEmployerJobPosting user={currentUser} onPublishJob={handlePublishJob} onToast={addToast} />}
                {effectiveView === "pipe" && <ProEmployerPipeline user={currentUser} jobs={jobs} applications={apps} onOpenDrawer={openDrawer} onBulkUpdateStage={handleBulkUpdateStage} onBulkSendReview={handleBulkSendReview} />}
                {effectiveView === "support" && <ProSupportView onToast={addToast} demoAccount={currentUser.email} />}
                {effectiveView === "dash" && (
                  <ProDashboardView
                    user={currentUser}
                    jobs={jobs}
                    applications={apps}
                    onNavigate={(v) => setActiveView(v)}
                    onOpenDrawer={openDrawer}
                    onAddSkill={() => {}}
                    onDuplicateJob={handleDuplicateJob}
                    onCloseJob={handleCloseJob}
                  />
                )}

                {effectiveView === "cp" && !editingCp && (
                  <ProEmployerProfileView
                    user={currentUser}
                    jobs={jobs}
                    onEdit={() => setEditingCp(true)}
                    onToast={addToast}
                    onOpenJob={(id) => setDrawerState({ type: "job", id })}
                  />
                )}

                {(effectiveView === "talent" ||
                  (effectiveView === "cp" && editingCp)) && (
                  <ProEmployerViews
                    view={effectiveView}
                    user={currentUser}
                    jobs={jobs}
                    applications={apps}
                    onSaveCompanyProfile={(cp) => {
                      handleUpdateUser({ ...currentUser, cp });
                      setEditingCp(false);
                    }}
                    onPublishJob={handlePublishJob}
                    onUpdateApplicantStage={handleUpdateApplicantStage}
                    onBulkUpdateStage={handleBulkUpdateStage}
                    onBulkSendReview={handleBulkSendReview}
                    onOpenDrawer={openDrawer}
                    onToast={addToast}
                  />
                )}

                {effectiveView === "notif" && (
                  <ProEmployerNotifications
                    user={currentUser}
                    jobs={jobs}
                    applications={apps}
                    onOpenDrawer={openDrawer}
                    onNavigate={setActiveView}
                    onMarkSeen={() => {
                      handleUpdateUser({ ...currentUser, seen: Date.now() });
                    }}
                  />
                )}

                {effectiveView === "wallet" && (
                  <ProWalletView
                    user={currentUser}
                    onUpdateWallet={handleUpdateWallet}
                    onOpenDrawer={openDrawer}
                    onToast={addToast}
                  />
                )}

                {effectiveView === "port" && (
                  <ProPortfolioView
                    user={currentUser}
                    jobs={jobs}
                    onOpenDrawer={openDrawer}
                    onToast={addToast}
                  />
                )}

                {effectiveView === "ver" && (
                  <ProVerifiedView
                    user={currentUser}
                    jobs={jobs}
                    onNavigate={(v) => setActiveView(v)}
                    onUpdateUser={handleUpdateUser}
                    onOpenDrawer={openDrawer}
                    onToast={addToast}
                  />
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
        )}
        </div>
      </main>

      {/* Global Drawers & Modals */}
      {drawerState && <ProDrawers
        key={JSON.stringify(drawerState)}
        drawerState={drawerState?.type === "job" || candidatePage ? null : drawerState}
        user={currentUser}
        jobs={jobs}
        applications={apps}
        selectedCompareJobs={compareJobs}
        selectedCompareCandidates={compareCandidates}
        onClose={() => setDrawerState(null)}
        onApplyJob={handleApplyJob}
        onSaveJob={handleSaveJob}
        onUpdateApplicantStage={handleUpdateApplicantStage}
        onSendApplicantUpdate={handleSendApplicantUpdate}
        onScheduleInterview={handleScheduleInterview}
        onSaveRecruiterNote={handleSaveRecruiterNote}
        onToast={addToast}
      />}

      {/* Floating AI Assistant Copilot */}
      <ProAiAssistant
        user={currentUser}
        jobs={jobs}
        applications={apps}
        open={aiOpen}
        onOpenChange={setAiOpen}
      />

      {/* Toast Notifications */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="bg-card text-foreground border border-border/80 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-medium pointer-events-auto"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="flex-1">{toast.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TalentoPro;
