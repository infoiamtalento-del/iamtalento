import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Helmet } from "react-helmet-async";
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
import { ProHeader } from "@/components/pro/ProHeader";
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
import { ProDrawers } from "@/components/pro/ProDrawers";
import { ProAiAssistant } from "@/components/pro/ProAiAssistant";
import { ProEmployerSidebar } from "@/components/pro/ProEmployerSidebar";
import { ProEmployerAccountView } from "@/components/pro/ProEmployerAccountView";

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
    localStorage.setItem("tq_" + key, JSON.stringify(val));
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

  const [activeView, setActiveView] = useState<ProView>(() =>
    currentRole === "employer" ? "dash" : "jobs"
  );
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
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    return DEFAULT_APPS;
  });

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
      return employerViews.includes(activeView) ? activeView : "dash";
    }
    return candidateViews.includes(activeView) ? activeView : "jobs";
  }, [currentRole, activeView]);

  // Drawer & Comparison States
  const [drawerState, setDrawerState] = useState<ProDrawerState>(null);
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
    setActiveView(role === "employer" ? "dash" : "jobs");
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
      c: jobData.c || "Super30",
      l: jobData.l || "Bengaluru",
      m: jobData.m || "Hybrid",
      ty: jobData.ty || "Full-time",
      e: jobData.e || 2,
      a: jobData.a || 15,
      b: jobData.b || 25,
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

  return (
    <div
      className="min-h-screen bg-[#f8fafd] text-slate-900 flex flex-col font-sans selection:bg-blue-500/20 selection:text-blue-700"
      style={{
        "--primary": "211.3 86.4% 37.5%",
        "--primary-foreground": "0 0% 100%",
        "--ring": "211.3 86.4% 37.5%",
        "--primary-glow": "211.3 86.4% 37.5%",
        "--accent": "211 40% 96%",
        "--accent-foreground": "211.3 86.4% 37.5%",
      } as React.CSSProperties}
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

      {/* Global Pro Header */}
      <ProHeader
        currentUser={currentUser}
        currentRole={currentRole}
        activeView={effectiveView}
        setActiveView={(view) => { setDrawerState(null); setActiveView(view); }}
        onSwitchRole={handleSwitchRole}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onSignOut={() => handleSwitchRole("candidate")}
        onSupport={() => setActiveView("support")}
        onOpenCertificate={() => setDrawerState({ type: "certificate", key: "verified" })}
        unreadCount={unreadCount}
        savedCount={savedCount}
        avatarSrc={getCandidatePhoto(currentUser.name)}
      />

      {/* Main Content View Switcher */}
      <main className={cn("flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8", currentRole === "employer" && "flex gap-7")}>
        {currentRole === "employer" && <ProEmployerSidebar activeView={effectiveView} onNavigate={(view) => { setDrawerState(null); setActiveView(view); }} onLogout={() => handleSwitchRole("candidate")} unreadCount={unreadCount} />}
        <div className="min-w-0 flex-1">
        {selectedJob ? <ProJobDetail key={selectedJob.id} job={selectedJob} user={currentUser} jobs={jobs} applications={apps} onBack={() => setDrawerState(null)} onOpenJob={(id) => { setDrawerState({ type: "job", id }); window.scrollTo({ top: 0 }); }} onApply={handleApplyJob} onSave={handleSaveJob} /> : (
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
                    onOpenDrawer={setDrawerState}
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
                    onOpenDrawer={setDrawerState}
                  />
                )}

                {effectiveView === "upd" && (
                  <ProNotificationsView
                    user={currentUser}
                    jobs={jobs}
                    applications={apps}
                    onOpenDrawer={setDrawerState}
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
                    onOpenDrawer={setDrawerState}
                    onNavigateToQuiz={() => setActiveView("profile")}
                  />
                )}

                {effectiveView === "wallet" && (
                  <ProWalletView
                    user={currentUser}
                    onUpdateWallet={handleUpdateWallet}
                    onOpenDrawer={setDrawerState}
                    onToast={addToast}
                  />
                )}

                {effectiveView === "port" && (
                  <ProPortfolioView
                    user={currentUser}
                    jobs={jobs}
                    onOpenDrawer={setDrawerState}
                    onToast={addToast}
                  />
                )}

                {effectiveView === "ver" && (
                  <ProVerifiedView
                    user={currentUser}
                    jobs={jobs}
                    onNavigate={(v) => setActiveView(v)}
                    onUpdateUser={handleUpdateUser}
                    onOpenDrawer={setDrawerState}
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
                {["account", "employer-assessments", "interviews", "advertise", "subscription", "settings"].includes(effectiveView) && <ProEmployerAccountView view={effectiveView} user={currentUser} onNavigate={setActiveView} />}
                {effectiveView === "support" && <ProSupportView onToast={addToast} />}
                {effectiveView === "payment-history" && <ProWalletView user={currentUser} onUpdateWallet={handleUpdateWallet} onOpenDrawer={setDrawerState} onToast={addToast} />}
                {effectiveView === "dash" && (
                  <ProDashboardView
                    user={currentUser}
                    jobs={jobs}
                    applications={apps}
                    onNavigate={(v) => setActiveView(v)}
                    onOpenDrawer={setDrawerState}
                    onAddSkill={() => {}}
                    onDuplicateJob={handleDuplicateJob}
                    onCloseJob={handleCloseJob}
                  />
                )}

                {(effectiveView === "pipe" ||
                  effectiveView === "post" ||
                  effectiveView === "talent" ||
                  effectiveView === "cp") && (
                  <ProEmployerViews
                    view={effectiveView}
                    user={currentUser}
                    jobs={jobs}
                    applications={apps}
                    onSaveCompanyProfile={(cp) => {
                      handleUpdateUser({ ...currentUser, cp });
                    }}
                    onPublishJob={handlePublishJob}
                    onUpdateApplicantStage={handleUpdateApplicantStage}
                    onBulkUpdateStage={handleBulkUpdateStage}
                    onBulkSendReview={handleBulkSendReview}
                    onOpenDrawer={setDrawerState}
                    onToast={addToast}
                  />
                )}

                {effectiveView === "notif" && (
                  <ProNotificationsView
                    user={currentUser}
                    jobs={jobs}
                    applications={apps}
                    onOpenDrawer={setDrawerState}
                    onMarkSeen={() => {
                      handleUpdateUser({ ...currentUser, seen: Date.now() });
                    }}
                  />
                )}

                {effectiveView === "wallet" && (
                  <ProWalletView
                    user={currentUser}
                    onUpdateWallet={handleUpdateWallet}
                    onOpenDrawer={setDrawerState}
                    onToast={addToast}
                  />
                )}

                {effectiveView === "port" && (
                  <ProPortfolioView
                    user={currentUser}
                    jobs={jobs}
                    onOpenDrawer={setDrawerState}
                    onToast={addToast}
                  />
                )}

                {effectiveView === "ver" && (
                  <ProVerifiedView
                    user={currentUser}
                    jobs={jobs}
                    onNavigate={(v) => setActiveView(v)}
                    onUpdateUser={handleUpdateUser}
                    onOpenDrawer={setDrawerState}
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
      <ProDrawers
        drawerState={drawerState?.type === "job" ? null : drawerState}
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
      />

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
