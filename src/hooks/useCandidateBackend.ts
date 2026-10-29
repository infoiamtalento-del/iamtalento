import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { ProApplication, ProJob } from "@/data/proData";
import {
  applyToJob, fetchJobs, fetchMyApplications, fetchSavedJobIds, isBackendJob, toggleSavedJob, withdrawApplication,
} from "@/services/candidate/jobs";
import { fetchWallet, type WalletState } from "@/services/candidate/wallet";
import { fetchNotifications, markNotificationsRead, type AppNotification } from "@/services/candidate/platform";
import { BackendError, db } from "@/services/db";

interface Options {
  /** Shell identity used to label mirrored applications. */
  email: string;
  name: string;
  /** Only load private candidate data for candidate sessions. */
  isCandidate: boolean;
}

export interface CandidateBackend {
  /** Supabase auth user id; null means the demo/local shell is in use. */
  userId: string | null;
  jobs: ProJob[] | null;
  apps: ProApplication[] | null;
  savedIds: number[] | null;
  wallet: WalletState | null;
  notifications: AppNotification[];
  unread: number;
  ready: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  refreshWallet: () => Promise<void>;
  apply: (jobId: number, coverNote?: string) => Promise<void>;
  withdraw: (appId: number) => Promise<void>;
  toggleSave: (jobId: number) => Promise<boolean>;
  markRead: (ids?: string[]) => Promise<void>;
  isLiveJob: (jobId: number) => boolean;
}

/**
 * Bridges the Pro shell to Supabase. Public jobs load for everyone. Private data
 * (applications, saved jobs, wallet, notifications) loads only for a real signed-in
 * candidate, so demo accounts stay fully local and never touch real data.
 */
export function useCandidateBackend({ email, name, isCandidate }: Options): CandidateBackend {
  const [userId, setUserId] = useState<string | null>(null);
  const [jobs, setJobs] = useState<ProJob[] | null>(null);
  const [apps, setApps] = useState<ProApplication[] | null>(null);
  const [savedIds, setSavedIds] = useState<number[] | null>(null);
  const [wallet, setWallet] = useState<WalletState | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const identity = useRef({ email, name });
  identity.current = { email, name };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUserId(data.session?.user.id ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUserId(session?.user.id ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  const loadPublic = useCallback(async () => {
    try {
      const list = await fetchJobs();
      setJobs(list.length ? list : null);
      setError(null);
    } catch (e) {
      // Backend not migrated yet or offline: the shell keeps working on local seed data.
      setJobs(null);
      setError(e instanceof Error ? e.message : "Backend unavailable");
    }
  }, []);

  const loadPrivate = useCallback(async () => {
    if (!userId || !isCandidate) {
      setApps(null); setSavedIds(null); setWallet(null); setNotifications([]);
      return;
    }
    try {
      const [a, s, w, n] = await Promise.all([
        fetchMyApplications(identity.current.email, identity.current.name),
        fetchSavedJobIds(),
        fetchWallet(),
        fetchNotifications(),
      ]);
      setApps(a); setSavedIds(s); setWallet(w); setNotifications(n);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load your data");
    }
  }, [userId, isCandidate]);

  useEffect(() => {
    let alive = true;
    (async () => {
      await loadPublic();
      await loadPrivate();
      if (alive) setReady(true);
    })();
    return () => { alive = false; };
  }, [loadPublic, loadPrivate]);

  // Realtime: stage changes, notifications and wallet movements arrive without a reload.
  useEffect(() => {
    if (!userId || !isCandidate) return;
    const channel = db
      .channel(`candidate-${userId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` }, () => void loadPrivate())
      .on("postgres_changes", { event: "*", schema: "public", table: "job_applications", filter: `candidate_id=eq.${userId}` }, () => void loadPrivate())
      .subscribe();
    return () => { void db.removeChannel(channel); };
  }, [userId, isCandidate, loadPrivate]);

  const refresh = useCallback(async () => { await loadPublic(); await loadPrivate(); }, [loadPublic, loadPrivate]);
  const refreshWallet = useCallback(async () => {
    if (userId && isCandidate) setWallet(await fetchWallet());
  }, [userId, isCandidate]);

  const apply = useCallback(async (jobId: number, coverNote?: string) => {
    await applyToJob(jobId, coverNote);
    await loadPrivate();
  }, [loadPrivate]);

  const withdraw = useCallback(async (appId: number) => {
    await withdrawApplication(appId);
    await loadPrivate();
  }, [loadPrivate]);

  const toggleSave = useCallback(async (jobId: number) => {
    const nowSaved = await toggleSavedJob(jobId);
    setSavedIds((prev) => {
      const set = new Set(prev ?? []);
      if (nowSaved) set.add(jobId); else set.delete(jobId);
      return [...set];
    });
    return nowSaved;
  }, []);

  const markRead = useCallback(async (ids?: string[]) => {
    await markNotificationsRead(ids);
    setNotifications((prev) => prev.map((n) => (!ids || ids.includes(n.id) ? { ...n, read_at: n.read_at ?? new Date().toISOString() } : n)));
  }, []);

  const unread = useMemo(() => notifications.filter((n) => !n.read_at).length, [notifications]);

  return {
    userId, jobs, apps, savedIds, wallet, notifications, unread, ready, error,
    refresh, refreshWallet, apply, withdraw, toggleSave, markRead, isLiveJob: isBackendJob,
  };
}

export const backendErrorMessage = (e: unknown): string =>
  e instanceof BackendError || e instanceof Error ? e.message : "Something went wrong. Please try again.";
