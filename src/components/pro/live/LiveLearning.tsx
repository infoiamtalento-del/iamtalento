import React, { useState } from "react";
import { BookOpen, CalendarClock, Video, Loader2, CheckCircle2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ProHero } from "../ProHero";
import { useAsync } from "@/hooks/useAsync";
import {
  bookMentorSlot, cancelMentorBooking, completeModule, enrollInCourse, fetchCourseBySlug, fetchCourses, fetchMyBookings, fetchMyEnrollments, fetchOpenSlots,
  type Course,
} from "@/services/candidate/platform";
import { createOrder, payOrderWithWallet, payWithRazorpay } from "@/services/candidate/wallet";
import { backendErrorMessage } from "@/hooks/useCandidateBackend";

const inr = (n: number) => (Number(n) === 0 ? "Free" : "₹" + Number(n).toLocaleString("en-IN"));
type Detail = Awaited<ReturnType<typeof fetchCourseBySlug>>;

export const LiveLearning: React.FC<{ onToast: (m: string) => void; walletBalance: number; onWalletChanged: () => void; userName: string; userEmail: string }> = ({
  onToast, walletBalance, onWalletChanged, userName, userEmail,
}) => {
  const courses = useAsync(fetchCourses);
  const enrollments = useAsync(fetchMyEnrollments);
  const slots = useAsync(fetchOpenSlots);
  const bookings = useAsync(fetchMyBookings);
  const [busy, setBusy] = useState<string | null>(null);
  const [detail, setDetail] = useState<Detail>(null);
  const [tab, setTab] = useState<"courses" | "mentors">("courses");

  const enrolled = (id: string) => enrollments.data?.find((e) => e.course_id === id);

  /** Free items enrol directly; paid items go through an order (wallet when affordable, otherwise Razorpay). */
  const withPayment = async (itemType: "course" | "mentor_session", itemId: string, price: number, finish: (orderId?: string) => Promise<unknown>, key: string) => {
    setBusy(key);
    try {
      let orderId: string | undefined;
      if (price > 0) {
        const useWallet = walletBalance >= price * 1.18;
        const order = await createOrder({ itemType, itemId, gateway: useWallet ? "wallet" : "razorpay", idempotencyKey: `${itemType}-${itemId}-${Math.floor(Date.now() / 120000)}` });
        const paid = order.status === "entitled" ? order : useWallet ? await payOrderWithWallet(order.id) : await payWithRazorpay(order, { name: userName, email: userEmail });
        orderId = paid.id;
        onWalletChanged();
      }
      await finish(orderId);
      return true;
    } catch (e) { onToast(backendErrorMessage(e)); return false; }
    finally { setBusy(null); }
  };

  const enroll = async (c: Course) => {
    if (await withPayment("course", c.id, Number(c.price_inr), (o) => enrollInCourse(c.id, o), `c-${c.id}`)) {
      onToast(`Enrolled in ${c.title}.`);
      await enrollments.reload();
      setDetail(await fetchCourseBySlug(c.slug));
    }
  };

  const open = async (c: Course) => setDetail(await fetchCourseBySlug(c.slug).catch(() => null));
  const done = async (courseId: string, moduleId: string) => {
    setBusy(`m-${moduleId}`);
    try {
      const e = await completeModule(courseId, moduleId);
      await enrollments.reload();
      onToast(e.status === "completed" ? "Course completed. Certificate added to your profile." : `Progress saved (${Math.round(Number(e.progress_pct))}%).`);
    } catch (err) { onToast(backendErrorMessage(err)); } finally { setBusy(null); }
  };

  const book = async (s: NonNullable<typeof slots.data>[number]) => {
    if (await withPayment("mentor_session", s.id, Number(s.price_inr), (o) => bookMentorSlot(s.id, undefined, o), `s-${s.id}`)) {
      onToast("1:1 session booked.");
      await Promise.all([slots.reload(), bookings.reload()]);
    }
  };

  if (detail) {
    const e = enrolled(detail.id);
    const mods = detail.lms_modules.slice().sort((a, b) => a.position - b.position);
    return (
      <div className="space-y-5">
        <button type="button" className="text-sm text-primary hover:underline" onClick={() => setDetail(null)}>← All courses</button>
        <ProHero icon={<BookOpen />} title={detail.title} subtitle={detail.subtitle ?? undefined}
          aside={e ? <div className="w-56"><p className="text-xs text-white/80 mb-1">{Math.round(Number(e.progress_pct))}% complete</p><Progress value={Number(e.progress_pct)} /></div> : undefined} />
        {!e && <Button disabled={busy === `c-${detail.id}`} onClick={() => enroll(detail)}>{busy === `c-${detail.id}` ? <Loader2 className="h-4 w-4 animate-spin" /> : Number(detail.price_inr) === 0 ? "Enrol for free" : `Enrol for ${inr(detail.price_inr)} + GST`}</Button>}
        <ol className="rounded-2xl border border-border bg-card divide-y divide-border">
          {mods.map((m) => {
            const isDone = e?.completed_module_ids.includes(m.id);
            const locked = !e && !m.is_preview;
            return (
              <li key={m.id} className="flex items-center gap-3 px-4 py-3">
                <span className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${isDone ? "bg-emerald-500 text-white" : "bg-secondary"}`}>{isDone ? <CheckCircle2 className="h-4 w-4" /> : m.position}</span>
                <span className="flex-1"><span className="block text-sm font-semibold">{m.title}</span><span className="text-xs text-muted-foreground capitalize">{m.kind}{m.duration_sec ? ` · ${Math.round(m.duration_sec / 60)} min` : ""}{m.is_preview ? " · Preview" : ""}</span></span>
                {!locked && !isDone && e && <Button size="sm" variant="outline" disabled={busy === `m-${m.id}`} onClick={() => done(detail.id, m.id)}><Play className="h-3.5 w-3.5 mr-1" />Mark complete</Button>}
                {locked && <span className="text-xs text-muted-foreground">Enrol to unlock</span>}
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProHero icon={<BookOpen />} title="Learning & Mentors" subtitle="Courses with tracked progress and verified certificates, plus 1:1 sessions with industry mentors."
        aside={<div className="flex rounded-full bg-white/15 p-1 text-sm">{(["courses", "mentors"] as const).map((t) => <button key={t} type="button" onClick={() => setTab(t)} className={`rounded-full px-4 py-1.5 font-semibold capitalize ${tab === t ? "bg-white text-primary" : "text-white"}`}>{t}</button>)}</div>} />

      {tab === "courses" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.data?.map((c) => {
            const e = enrolled(c.id);
            return (
              <div key={c.id} className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">{c.category} · {c.level}</p>
                <h3 className="font-semibold leading-snug">{c.title}</h3>
                <p className="text-xs text-muted-foreground">{c.instructor_name}{c.duration_hours ? ` · ${c.duration_hours} hrs` : ""}</p>
                <div className="mt-auto pt-2">
                  {e ? <><Progress value={Number(e.progress_pct)} className="mb-2" /><Button size="sm" className="w-full" onClick={() => open(c)}>{e.status === "completed" ? "Review course" : "Continue"}</Button></>
                    : <div className="flex items-center justify-between gap-2"><span className="font-bold">{inr(c.price_inr)}</span><Button size="sm" variant="outline" onClick={() => open(c)}>View</Button></div>}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-6">
          {(bookings.data?.length ?? 0) > 0 && (
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-sm font-semibold mb-2">Your sessions</p>
              <ul className="space-y-2">
                {(bookings.data as any[]).filter((b) => b.status === "confirmed").map((b) => (
                  <li key={b.id} className="flex items-center gap-3 text-sm"><Video className="h-4 w-4 text-primary" />
                    <span className="flex-1">{b.mentor_profiles?.display_name} · {new Date(b.mentor_slots.starts_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>
                    <Button size="sm" variant="ghost" onClick={async () => { try { await cancelMentorBooking(b.id); onToast("Session cancelled."); await Promise.all([bookings.reload(), slots.reload()]); } catch (e) { onToast(backendErrorMessage(e)); } }}>Cancel</Button></li>
                ))}
              </ul>
            </div>
          )}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {slots.data?.slice(0, 12).map((s) => (
              <div key={s.id} className="rounded-2xl border border-border bg-card p-4">
                <p className="font-semibold">{s.mentor_profiles.display_name}</p>
                <p className="text-xs text-muted-foreground mb-2">{s.mentor_profiles.headline}</p>
                <p className="flex items-center gap-1.5 text-sm"><CalendarClock className="h-4 w-4 text-primary" />{new Date(s.starts_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>
                <div className="mt-3 flex items-center justify-between"><span className="font-bold">{inr(s.price_inr)}</span>
                  <Button size="sm" disabled={busy === `s-${s.id}`} onClick={() => book(s)}>{busy === `s-${s.id}` ? <Loader2 className="h-4 w-4 animate-spin" /> : "Book"}</Button></div>
              </div>
            ))}
            {slots.data?.length === 0 && <p className="text-sm text-muted-foreground">No open slots right now. Check back soon.</p>}
          </div>
        </div>
      )}
    </div>
  );
};
