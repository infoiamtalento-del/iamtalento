import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
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
import { clearDemoOnlySession, isDemoOnlySession } from "@/services/authSession";
import { Building2 } from "lucide-react";
import { ProView, ProDrawerState } from "@/components/pro/proTypes";
import Navbar from "@/components/layout/Navbar";
import { ProEmployerSidebar } from "@/components/pro/ProEmployerSidebar";
import { ProCandidateAccountMenu } from "@/components/pro/ProCandidateAccountMenu";
import { ProEmployerAccountMenu } from "@/components/pro/ProEmployerAccountMenu";
import { LiveNotifications } from "@/components/pro/live/LiveNotifications";
import { LiveSupport } from "@/components/pro/live/LiveSupport";
import { LiveVerification } from "@/components/pro/live/LiveVerification";
import { LivePayments } from "@/components/pro/live/LivePayments";
import { LiveLearning } from "@/components/pro/live/LiveLearning";
import { LiveEventsCommunity } from "@/components/pro/live/LiveEventsCommunity";
import { LiveFreelancing } from "@/components/pro/live/LiveFreelancing";
import { LiveAnalytics } from "@/components/pro/live/LiveAnalytics";
import { LiveReadinessSkillGap } from "@/components/pro/live/LiveReadinessSkillGap";
import { LiveMockInterviewHub } from "@/components/pro/live/LiveMockInterviewHub";
import { LiveMyResume } from "@/components/pro/live/LiveMyResume";
import OnboardingWizard from "@/pages/OnboardingWizard";
import { ProEmployeeServices } from "@/components/pro/ProEmployeeServices";
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
import { ProEmployeeMyAccount } from "@/components/pro/ProEmployeeMyAccount";
import { ProEmployerDemoServices } from "@/components/pro/ProEmployerDemoServices";
import { ProEmployerCandidateDetail } from "@/components/pro/ProEmployerCandidateDetail";
import { Button } from "@/components/ui/button";
import { DEMO_EMPLOYER_JOBS, DEMO_EMPLOYER_APPS, INITIAL_EMPLOYER_DEMO, createDemoApplication, type EmployerDemoState } from "@/data/employerDemo";
import { useCandidateBackend, backendErrorMessage } from "@/hooks/useCandidateBackend";
import { createOrder, payWithRazorpay } from "@/services/candidate/wallet";
import { rpc, db } from "@/services/db";
import { fromProUser, loadLiveProfile, saveLiveProfile, toProUser } from "@/services/candidate/profile";
import { getEmployerProfile, saveEmployerProfile } from "@/services/employer/profile";
import { createJob, publishJob } from "@/services/employer/jobs";

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
    const name = isCand && (incoming.name === "Arjun Mehta" || incoming.name === "Vignesh" || !incoming.name) ? base.name : incoming.name;
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState<Record<string, ProUser>>(() => {
    const raw = loadStorage("users", DEFAULT_USERS);
    return normalizeUsers(raw);
  });

  const [sessionEmail, setSessionEmail] = useState<string>(() => {
    const stored = loadStorage("sess", "demo.candidate@talento.app");
    const validStored = stored && typeof stored === "string" ? stored : "demo.candidate@talento.app";
    const fromRole = new URLSearchParams(window.location.search).get("role");
    if (fromRole === "employer") {
      if (!isDemoOnlySession() && users[validStored]?.role === "employer") return validStored;
      return "demo.employer@talento.app";
    }
    if (fromRole === "employee" || fromRole === "candidate") {
      if (!isDemoOnlySession() && validStored !== "demo.candidate@talento.app" && users[validStored]?.role !== "employer") {
        return validStored;
      }
      return "demo.candidate@talento.app";
    }
    return validStored;
  });

  const demoOnly = isDemoOnlySession();

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

  const [activeView, setActiveView] = useState<ProView>(() => {
    const fromParam = searchParams.get("view") as ProView | null;
    if (fromParam) return fromParam;
    return "dash";
  });

  useEffect(() => {
    const fromParam = searchParams.get("view") as ProView | null;
    if (fromParam) {
      setActiveView(fromParam);
    }
    const roleParam = searchParams.get("role");
    if (roleParam === "employer" && users[sessionEmail]?.role !== "employer") {
      setSessionEmail("demo.employer@talento.app");
      saveStorage("sess", "demo.employer@talento.app");
    } else if ((roleParam === "employee" || roleParam === "candidate") && users[sessionEmail]?.role === "employer") {
      setSessionEmail("demo.candidate@talento.app");
      saveStorage("sess", "demo.candidate@talento.app");
    }
  }, [searchParams, sessionEmail, users]);

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
    } catch (_err) {
      /* ignore invalid JSON in storage */
    }
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
    } catch (_err) {
      /* ignore invalid JSON in storage */
    }
    return DEFAULT_APPS;
  });

  // Supabase bridge: public jobs for everyone; applications, saved jobs, wallet and
  // notifications only for a real signed-in candidate (demo accounts stay local).
  const backend = useCandidateBackend({
    email: sessionEmail,
    name: currentUser.name,
    isCandidate: currentRole === "candidate" && !demoOnly,
  });
  const liveCandidate = Boolean(backend.userId) && currentRole === "candidate" && !demoOnly;

  useEffect(() => {
    const live = backend.jobs;
    if (!live) return;
    setJobs((previous) => [
      ...live,
      ...previous.filter((job) => !job.by.startsWith("hr@") && !backend.isLiveJob(job.id)),
    ]);
  }, [backend.jobs]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!liveCandidate || !backend.apps) return;
    const mirrored = backend.apps;
    setApps((previous) => [...mirrored, ...previous.filter((a) => a.who !== sessionEmail)]);
  }, [backend.apps, liveCandidate, sessionEmail]);

  useEffect(() => {
    if (!liveCandidate) return;
    const { savedIds, wallet } = backend;
    setUsers((previous) => {
      const base = previous[sessionEmail];
      if (!base) return previous;
      const next: ProUser = { ...base };
      if (savedIds) next.saved = savedIds;
      if (wallet) next.wal = { ...(base.wal || { bal: 0 }), bal: wallet.bal, hist: wallet.hist, tx: wallet.hist };
      return { ...previous, [sessionEmail]: next };
    });
  }, [backend.savedIds, backend.wallet, liveCandidate, sessionEmail]); // eslint-disable-line react-hooks/exhaustive-deps

  // Real signed-in candidates: load their profile from Supabase, then save edits back (debounced).
  const [liveEmail, setLiveEmail] = useState<string | null>(null);
  const [liveBooting, setLiveBooting] = useState(false);
  const lastSavedProfile = useRef("");
  const sessionEmailRef = useRef(sessionEmail);
  sessionEmailRef.current = sessionEmail;
  const usersRef = useRef(users);
  usersRef.current = users;

  useEffect(() => {
    if (!backend.userId || demoOnly) { setLiveEmail(null); setLiveBooting(false); return; }
    let alive = true;
    setLiveBooting(true);
    (async () => {
      try {
        const { data: roles } = await db.from("user_roles").select("role").eq("user_id", backend.userId);
        const isEmployer = (roles ?? []).some((r: { role: string }) => r.role === "employer") && !(roles ?? []).some((r: { role: string }) => r.role === "employee");
        if (isEmployer) {
          const empProfile = await getEmployerProfile();
          if (alive && empProfile) {
            const email = empProfile.official_email || `${backend.userId}@employer.local`;
            const user: ProUser = {
              ...(usersRef.current[email] ?? usersRef.current["recruiter@acme.inc"] ?? {}),
              email,
              role: "employer",
              name: empProfile.contact_name || empProfile.company_name || "Employer",
              cp: {
                name: empProfile.company_name,
                about: empProfile.description || undefined,
                mission: empProfile.mission || undefined,
                ind: empProfile.industry || undefined,
                size: empProfile.num_employees || undefined,
                hq: empProfile.hq_city || empProfile.address || undefined,
                site: empProfile.website || undefined,
                ben: empProfile.benefits || [],
              },
            };
            setUsers((prev) => ({ ...prev, [email]: user }));
            setLiveEmail(email);
            setSessionEmail(email);
            saveStorage("sess", email);
          }
          return;
        }
        const live = await loadLiveProfile();
        if (!alive || !live) return;
        const email = live.profile.email || `${backend.userId}@live.local`;
        const user = toProUser(live, usersRef.current[email]);
        lastSavedProfile.current = JSON.stringify(fromProUser(user));
        setUsers((prev) => ({ ...prev, [email]: user }));
        setLiveEmail(email);
        const current = sessionEmailRef.current;
        if (current === "demo.candidate@talento.app" || current === email) {
          setSessionEmail(email);
          saveStorage("sess", email);
        }
      } catch {
        /* Backend unavailable: the shell keeps working with local demo data. */
      } finally {
        if (alive) setLiveBooting(false);
      }
    })();
    return () => { alive = false; };
  }, [backend.userId, demoOnly]);

  const reloadLiveCandidate = useCallback(async () => {
    if (!backend.userId || demoOnly) return;
    try {
      const live = await loadLiveProfile();
      if (!live) return;
      const email = live.profile.email || `${backend.userId}@live.local`;
      const user = toProUser(live, usersRef.current[email]);
      lastSavedProfile.current = JSON.stringify(fromProUser(user));
      setUsers((prev) => ({ ...prev, [email]: user }));
    } catch {
      /* ignore transient refresh failure */
    }
  }, [backend.userId, demoOnly]);

  useEffect(() => {
    if (!liveEmail || sessionEmail !== liveEmail) return;
    const user = users[liveEmail];
    if (!user) return;
    const payload = JSON.stringify(fromProUser(user));
    if (payload === lastSavedProfile.current) return;
    const timer = setTimeout(() => {
      lastSavedProfile.current = payload;
      saveLiveProfile(user).catch((e) => {
        lastSavedProfile.current = "";
        addToast(backendErrorMessage(e));
      });
    }, 1200);
    return () => clearTimeout(timer);
  }, [users, liveEmail, sessionEmail]); // eslint-disable-line react-hooks/exhaustive-deps

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
    "account",
    "dash",
    "profile",
    "edit-profile",
    "readiness",
    "mock-interview",
    "my-resume",
    "settings",
    "cert",
    "my-certifications",
    "learning-mentors",
    "freelancing",
    "port",
    "resume",
    "events-community",
    "notif",
    "analytics",
    "payment-history",
    "support",
    "cp",
    "post",
    "pipe",
    "employer-assessments",
    "advertise",
    "corporate-learning",
    "jobs",
    "saved",
    "applied",
    "upd",
    "disc",
    "wallet",
    "ver",
  ];

  const employerViews: ProView[] = [
    "account",
    "dash",
    "cp",
    "post",
    "pipe",
    "employer-assessments",
    "notif",
    "advertise",
    "corporate-learning",
    "payment-history",
    "support",
    "talent",
    "interviews",
    "subscription",
    "settings",
    "wallet",
    "port",
    "ver",
  ];

  const effectiveView: ProView = useMemo(() => {
    if (currentRole === "employer") {
      return employerViews.includes(activeView) ? activeView : "account";
    }
    return candidateViews.includes(activeView) ? activeView : "account";
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
    // Signed-in candidates live in the database; keep their personal data out of localStorage.
    if (liveEmail) {
      const { [liveEmail]: _omit, ...rest } = users;
      saveStorage("users", rest);
    } else {
      saveStorage("users", users);
    }
  }, [users, liveEmail]);

  useEffect(() => {
    saveStorage("jobs", jobs);
  }, [jobs]);

  useEffect(() => {
    saveStorage("apps", liveEmail ? apps.filter((a) => a.who !== liveEmail) : apps);
  }, [apps, liveEmail]);

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
    addToast(`Switched account to ${role === "employer" ? "Super30 (Employer)" : "Yogesh (Candidate)"}`);
  };

  // User Profile updater
  const handleUpdateUser = (incoming: ProUser) => {
    // A signed-in candidate's email belongs to their auth account and cannot be edited here.
    const updatedUser = liveEmail && sessionEmail === liveEmail ? { ...incoming, email: sessionEmail } : incoming;
    if (updatedUser.email && updatedUser.email !== sessionEmail) {
      setUsers((prev) => {
        const next = { ...prev };
        delete next[sessionEmail];
        next[updatedUser.email] = updatedUser;
        return next;
      });
      setApps((prev) =>
        prev.map((a) => (a.who === sessionEmail ? { ...a, who: updatedUser.email, name: updatedUser.name } : a))
      );
      setJobs((prev) =>
        prev.map((j) => (j.by === sessionEmail ? { ...j, by: updatedUser.email } : j))
      );
      setSessionEmail(updatedUser.email);
    } else {
      setUsers((prev) => ({
        ...prev,
        [sessionEmail]: updatedUser,
      }));
    }
  };

  // Job Actions
  const handleApplyJob = (jobId: number, coverNote?: string) => {
    const existing = apps.find((a) => a.jid === jobId && a.who === sessionEmail);
    if (existing) {
      addToast("You have already applied to this opening.");
      return;
    }

    if (liveCandidate && backend.isLiveJob(jobId)) {
      backend
        .apply(jobId, coverNote)
        .then(() => addToast("Application submitted! 24h review SLA active."))
        .catch((e) => addToast(backendErrorMessage(e)));
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
    if (liveCandidate && backend.apps?.some((a) => a.id === appId)) {
      backend
        .withdraw(appId)
        .then(() => addToast("Application withdrawn successfully."))
        .catch((e) => addToast(backendErrorMessage(e)));
      return;
    }
    setApps((prev) => prev.filter((a) => a.id !== appId));
    addToast("Application withdrawn successfully.");
  };

  const handleSaveJob = (jobId: number) => {
    if (liveCandidate && backend.isLiveJob(jobId)) {
      backend
        .toggleSave(jobId)
        .then((saved) => addToast(saved ? "Job bookmarked to saved!" : "Job removed from saved."))
        .catch((e) => addToast(backendErrorMessage(e)));
      return;
    }
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
  const handlePublishJob = async (jobData: Partial<ProJob>) => {
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

    // Persist to server if employer is signed in
    if (backend.userId && currentUser.role === "employer") {
      try {
        const created = await createJob({
          designation: newJob.t,
          job_description: newJob.description || `${newJob.t} role at ${newJob.c}`,
          job_location: newJob.l,
          work_mode: newJob.m,
          job_type: newJob.ty,
          salary_min: newJob.a,
          salary_max: newJob.b,
          experience_min: newJob.e,
          skills: newJob.sk,
        });
        await publishJob(created.id);
        addToast("Job published and live on server!");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        addToast(`Server sync notice: ${msg}`);
      }
    }
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

  // Live wallet: real Razorpay checkout + server-side ledger (signed-in candidates only)
  const handleLiveTopUp = async (amount: number) => {
    try {
      const order = await createOrder({ itemType: "wallet_topup", amount, gateway: "razorpay" });
      await payWithRazorpay(order, { name: currentUser.name, email: currentUser.email });
      await backend.refreshWallet();
      addToast(`Added ?${amount} to your wallet.`);
    } catch (e) {
      addToast(backendErrorMessage(e));
    }
  };

  const handleLiveSpend = async (serviceKey: string, title: string) => {
    try {
      await rpc("purchase_service", { p_key: serviceKey });
      await backend.refreshWallet();
      addToast(`Purchased "${title}".`);
    } catch (e) {
      addToast(backendErrorMessage(e));
    }
  };

  // Unread badge count
  const unreadCount = useMemo(() => {
    if (liveCandidate) return backend.unread;
    const lastSeen = currentUser.seen || 0;
    if (currentRole === "employer") {
      const myJobs = jobs.filter((j) => j.by === sessionEmail);
      return apps.filter((a) => myJobs.some((j) => j.id === a.jid) && a.at > lastSeen).length;
    }
    return apps
      .filter((a) => a.who === sessionEmail)
      .flatMap((a) => a.upd || [])
      .filter((u) => u.at > lastSeen).length;
  }, [apps, jobs, sessionEmail, currentRole, currentUser.seen, liveCandidate, backend.unread]);

  // Saved count
  const savedCount = (currentUser.saved || []).length;
  const selectedJob = drawerState?.type === "job" ? jobs.find(job => job.id === drawerState.id) : undefined;

  const candidatePage = currentRole === "employer" && (drawerState?.type === "applicant" || drawerState?.type === "candidate") ? drawerState : null;
  const selectedApplicant = candidatePage?.type === "applicant" ? apps.find(a => a.id === candidatePage.id && jobs.some(j => j.id === a.jid && j.by === sessionEmail)) : undefined;
  const selectedCandidate = candidatePage?.type === "candidate" ? CANDIDATES_SEED.find(c => c.n === candidatePage.name) : undefined;

  const navigateProView = useCallback(
    (view: ProView) => {
      setDrawerState(null);
      setSearchParams(currentRole === "employer" ? { view, role: "employer" } : { view });
      setEditingCp(false);
      setActiveView(view);
      window.scrollTo({ top: 0 });
    },
    [currentRole, setSearchParams]
  );

  return (
    <div
      className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary"
    >
      <Helmet>
        <title>
          {currentRole === "employer"
            ? "Employer Recruiter Studio | Talento Pro"
            : "Verified Engineering Career Hub | Talento Pro"}
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
          avatarSrc: currentUser.avatar || (liveCandidate ? undefined : getCandidatePhoto(currentUser.name)),
          role: currentRole,
        }}
        onSignOut={() => { clearDemoOnlySession(); localStorage.removeItem("tq_sess"); localStorage.removeItem("tq_users"); localStorage.removeItem("tq_apps"); }}
        accountMenu={(onNavbarSignOut) => {
          const userPhoto = currentUser.avatar || (liveCandidate ? undefined : getCandidatePhoto(currentUser.name));
          const navView = (view: ProView) => {
            setDrawerState(null);
            setSearchParams(currentRole === "employer" ? { view, role: "employer" } : { view });
            setEditingCp(false);
            setActiveView(view);
            window.scrollTo({ top: 0 });
          };
          if (currentRole === "employer") {
            return (
              <ProEmployerAccountMenu
                name={currentUser.name}
                avatarSrc={userPhoto}
                roleLabel="Employer Workspace"
                activeView={effectiveView}
                unreadCount={unreadCount}
                onNavigate={navView}
                onSignOut={onNavbarSignOut}
              />
            );
          }
          return (
            <ProCandidateAccountMenu
              name={currentUser.name}
              avatarSrc={userPhoto}
              activeView={effectiveView}
              unreadCount={unreadCount}
              isDarkMode={isDarkMode}
              onNavigate={navView}
              onCertificate={() => navView("my-certifications")}
              onToggleTheme={() => setIsDarkMode((d) => !d)}
              onSignOut={onNavbarSignOut}
            />
          );
        }}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 w-full min-h-screen pt-16 pb-12 lg:pl-64 xl:pl-72 flex flex-col">
        {/* Left Side Dashboard Sidebar (Fixed) */}
        <ProEmployerSidebar
          activeView={effectiveView}
          unreadCount={unreadCount}
          userName={currentUser.name}
          userAvatar={currentUser.avatar || (liveCandidate ? undefined : getCandidatePhoto(currentUser.name))}
          userRole={currentRole === "employer" ? "Employer Workspace" : "Employee Workspace"}
          isEmployer={currentRole === "employer"}
          onNavigate={(view) => {
            setDrawerState(null);
            setSearchParams(currentRole === "employer" ? { view, role: "employer" } : { view });
            setEditingCp(false);
            setActiveView(view);
            window.scrollTo({ top: 0 });
          }}
          onLogout={async () => {
            localStorage.removeItem("tq_sess");
            await db.auth.signOut().catch(() => {});
            window.location.href = "/auth";
          }}
        />

        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-6 min-w-0 flex-1">
          <div className="mb-6 flex flex-wrap items-center gap-4 border-b border-border pb-4">
            <div className="mr-auto">
              <p className="text-sm font-semibold text-primary">Workspace · {currentUser.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Real-time pipeline &amp; dashboard</p>
            </div>
          </div>
        {candidatePage ? (selectedApplicant || selectedCandidate ? <ProEmployerCandidateDetail key={JSON.stringify(candidatePage)} application={selectedApplicant} candidate={selectedCandidate} job={jobs.find(j => j.id === (selectedApplicant?.jid || (candidatePage.type === "candidate" ? candidatePage.jobId : undefined)))} onBack={closeCandidate} onToast={addToast} onSave={(id, changes, message, interview) => { setApps(previous => previous.map(a => a.id === id ? { ...a, ...changes, st: interview ? "Interview" : changes.st, iv: interview || a.iv, upd: [...(a.upd || []), ...(a.st !== changes.st ? [{ msg: `Candidate status updated to "${changes.st}".`, at: Date.now() }] : []), ...(message.trim() ? [{ msg: message.trim(), at: Date.now() }] : []), ...(interview ? [{ msg: `Interview round scheduled for ${interview}.`, at: Date.now() }] : [])] } : a)); addToast("Application changes saved. Demo updates only; no message sent."); }} /> : <div className="py-12"><p>Candidate not found in this workspace.</p><Button onClick={closeCandidate} variant="outline" className="mt-4">Back to Candidates</Button></div>) : selectedJob ? <ProJobDetail key={selectedJob.id} job={selectedJob} user={currentUser} jobs={jobs} applications={apps} onBack={() => setDrawerState(null)} onOpenJob={(id) => { setDrawerState({ type: "job", id }); window.scrollTo({ top: 0 }); }} onApply={handleApplyJob} onSave={handleSaveJob} /> : (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentRole}-${effectiveView}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {/* WORKSPACE & DASHBOARD VIEWS (ACCESSIBLE TO BOTH EMPLOYEE & EMPLOYER) */}
            {(effectiveView === "account" || (effectiveView === "settings" && currentRole === "candidate")) && (
              currentRole === "employer" ? (
                <ProEmployerMyAccount
                  user={currentUser}
                  jobs={jobs}
                  applications={apps}
                  onNavigate={navigateProView}
                  onUpdateUser={handleUpdateUser}
                  onToast={addToast}
                />
              ) : (
                <ProEmployeeMyAccount
                  user={currentUser}
                  jobs={jobs}
                  applications={apps}
                  isLive={liveCandidate}
                  initialTab={effectiveView === "settings" ? "settings" : "info"}
                  onNavigate={navigateProView}
                  onUpdateUser={handleUpdateUser}
                  onToast={addToast}
                />
              )
            )}

            {effectiveView === "dash" && (
              <ProDashboardView
                user={currentUser}
                jobs={jobs}
                applications={apps}
                onNavigate={navigateProView}
                onOpenDrawer={openDrawer}
                onAddSkill={(skill) => {
                  if (!(currentUser.sk || []).includes(skill)) {
                    handleUpdateUser({ ...currentUser, sk: [...(currentUser.sk || []), skill] });
                    addToast(`Added "${skill}" to your profile!`);
                  }
                }}
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

            {(effectiveView === "talent" || (effectiveView === "cp" && editingCp)) && (
              <ProEmployerViews
                view={effectiveView}
                user={currentUser}
                jobs={jobs}
                applications={apps}
                onSaveCompanyProfile={async (cp) => {
                  handleUpdateUser({ ...currentUser, cp });
                  setEditingCp(false);
                  try {
                    await saveEmployerProfile({
                      company_name: cp.name,
                      description: cp.about,
                      mission: cp.mission,
                      industry: cp.ind,
                      num_employees: cp.size,
                      hq_city: cp.hq,
                      website: cp.site,
                      benefits: cp.ben,
                    });
                  } catch {
                    /* offline or local demo mode: state remains in memory */
                  }
                }}
                onPublishJob={handlePublishJob}
                onUpdateApplicantStage={handleUpdateApplicantStage}
                onBulkUpdateStage={handleBulkUpdateStage}
                onBulkSendReview={handleBulkSendReview}
                onOpenDrawer={openDrawer}
                onToast={addToast}
              />
            )}

            {effectiveView === "post" && (
              <ProEmployerJobPosting user={currentUser} onPublishJob={handlePublishJob} onToast={addToast} />
            )}

            {effectiveView === "pipe" && (
              <ProEmployerPipeline
                user={currentUser}
                jobs={jobs}
                applications={apps}
                onOpenDrawer={openDrawer}
                onBulkUpdateStage={handleBulkUpdateStage}
                onBulkSendReview={handleBulkSendReview}
              />
            )}

            {(["employer-assessments", "interviews", "advertise", "subscription", "corporate-learning"].includes(effectiveView) ||
              (effectiveView === "settings" && currentRole === "employer") ||
              (effectiveView === "payment-history" && currentRole === "employer")) && (
              <ProEmployerDemoServices
                view={effectiveView}
                user={currentUser}
                jobs={jobs}
                applications={apps}
                state={employerDemo}
                onChange={(next) => {
                  setEmployerDemo(next);
                  setApps(previous => previous.map(app => {
                    const result = next.assessments.find(r => r.candidate === app.name && r.status === "Completed" && r.score !== undefined);
                    return result ? { ...app, as: { ...app.as, [result.name]: result.score ?? 0 } } : app;
                  }));
                }}
                onNavigate={setActiveView}
                onOpenDrawer={openDrawer}
                onToast={addToast}
                onUpdateUser={handleUpdateUser}
                onSamplePayment={(description) => {
                  handleUpdateWallet(currentUser.wal?.bal || 0, {
                    id: `DEMO-${Date.now()}`,
                    at: Date.now(),
                    type: "debit",
                    amt: 0,
                    desc: description,
                    via: "Simulation",
                    st: "Demo only",
                  });
                  addToast("Demo plan activated; sample receipt added. No charge.");
                }}
              />
            )}

            {effectiveView === "payment-history" && currentRole === "candidate" && (
              liveCandidate ? (
                <LivePayments />
              ) : (
                <ProWalletView
                  user={currentUser}
                  onUpdateWallet={handleUpdateWallet}
                  onOpenDrawer={openDrawer}
                  onToast={addToast}
                />
              )
            )}

            {effectiveView === "notif" && currentRole === "employer" && (
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

            {effectiveView === "support" && (
              liveCandidate ? (
                <LiveSupport onToast={addToast} />
              ) : (
                <ProSupportView onToast={addToast} demoAccount={currentUser.email} />
              )
            )}

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
                isLive={liveCandidate}
                onSaveProfile={handleUpdateUser}
                onNavigate={navigateProView}
                onProfileReloaded={reloadLiveCandidate}
                onToast={addToast}
              />
            )}

            {effectiveView === "edit-profile" && (
              <OnboardingWizard
                embedded
                onSaved={reloadLiveCandidate}
                onNavigatePro={navigateProView}
              />
            )}

            {effectiveView === "readiness" && (
              <LiveReadinessSkillGap
                fallbackUser={currentUser}
                onUpdateFallbackUser={handleUpdateUser}
                onNavigate={navigateProView}
                onToast={addToast}
              />
            )}

            {effectiveView === "mock-interview" && (
              <LiveMockInterviewHub onToast={addToast} />
            )}

            {effectiveView === "my-resume" && (
              <LiveMyResume
                fallbackUser={currentUser}
                onNavigate={navigateProView}
                onToast={addToast}
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

            {(effectiveView === "upd" || (effectiveView === "notif" && currentRole === "candidate")) && (
              liveCandidate ? (
                <LiveNotifications
                  notifications={backend.notifications}
                  onMarkRead={backend.markRead}
                  onNavigate={(v) => {
                    setSearchParams({ view: v });
                    setActiveView(v);
                    window.scrollTo({ top: 0 });
                  }}
                  onToast={addToast}
                />
              ) : (
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
              )
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

            {(effectiveView === "cert" || effectiveView === "my-certifications") && (
              <ProCertificationsView
                user={currentUser}
                mode={effectiveView === "my-certifications" ? "certifications" : "assessments"}
                isLive={liveCandidate}
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
                onNavigate={(v) => {
                  setSearchParams({ view: v });
                  setActiveView(v);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onUpdateUser={handleUpdateUser}
                onToast={addToast}
              />
            )}

            {effectiveView === "wallet" && (
              <ProWalletView
                user={currentUser}
                onUpdateWallet={handleUpdateWallet}
                onLiveTopUp={liveCandidate ? handleLiveTopUp : undefined}
                onLiveSpend={liveCandidate ? handleLiveSpend : undefined}
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
                onNavigate={setActiveView}
              />
            )}

            {effectiveView === "ver" && (
              liveCandidate ? (
                <LiveVerification
                  onToast={addToast}
                  onNavigate={(v) => {
                    setSearchParams({ view: v });
                    setActiveView(v);
                    window.scrollTo({ top: 0 });
                  }}
                />
              ) : (
                <ProVerifiedView
                  user={currentUser}
                  jobs={jobs}
                  onNavigate={(v) => setActiveView(v)}
                  onUpdateUser={handleUpdateUser}
                  onOpenDrawer={openDrawer}
                  onToast={addToast}
                />
              )
            )}

            {effectiveView === "learning-mentors" && liveCandidate && (
              <LiveLearning
                onToast={addToast}
                walletBalance={currentUser.wal?.bal ?? 0}
                onWalletChanged={backend.refreshWallet}
                userName={currentUser.name}
                userEmail={currentUser.email}
              />
            )}

            {effectiveView === "events-community" && liveCandidate && (
              <LiveEventsCommunity
                onToast={addToast}
                walletBalance={currentUser.wal?.bal ?? 0}
                onWalletChanged={backend.refreshWallet}
                userName={currentUser.name}
                userEmail={currentUser.email}
              />
            )}

            {effectiveView === "freelancing" && liveCandidate && (
              <LiveFreelancing onToast={addToast} />
            )}

            {effectiveView === "analytics" && liveCandidate && (
              <LiveAnalytics onToast={addToast} />
            )}

            {!liveCandidate &&
              (effectiveView === "learning-mentors" ||
                effectiveView === "freelancing" ||
                effectiveView === "events-community" ||
                effectiveView === "analytics") && (
              <ProEmployeeServices
                view={effectiveView}
                userName={currentUser.name}
                onNavigate={(v) => {
                  setSearchParams({ view: v });
                  setActiveView(v);
                  window.scrollTo({ top: 0 });
                }}
                onToast={addToast}
              />
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
