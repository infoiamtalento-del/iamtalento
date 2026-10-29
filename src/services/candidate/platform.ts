import { db, rpc, currentUserId, BackendError } from "@/services/db";

export interface AppNotification {
  id: string;
  kind: string;
  title: string;
  body: string | null;
  link: string | null;
  read_at: string | null;
  created_at: string;
}

export async function fetchNotifications(limit = 50): Promise<AppNotification[]> {
  const uid = await currentUserId();
  if (!uid) return [];
  const { data, error } = await db.from("notifications").select("*").eq("user_id", uid).order("created_at", { ascending: false }).limit(limit);
  if (error) throw error;
  return data as AppNotification[];
}
export const markNotificationsRead = (ids?: string[]) => rpc<number>("mark_notifications_read", { p_ids: ids ?? null });

export interface CandidateDashboard {
  applications: number; shortlisted: number; saved_jobs: number; unread: number; wallet: number;
  readiness: number | null; courses_in_progress: number;
  latest_cir: { id: string; score: number; tier: string; percentile: number } | null;
}
export const fetchDashboard = () => rpc<CandidateDashboard>("candidate_dashboard");

// ---------------- Learning ----------------
export interface Course {
  id: string; slug: string; title: string; subtitle: string | null; category: string | null; level: string;
  price_inr: number; original_price_inr: number | null; instructor_name: string | null; duration_hours: number | null;
  rating: number | null; learners_count: number; skills: string[]; is_free: boolean;
}
export interface Enrollment { id: string; course_id: string; status: string; progress_pct: number; completed_module_ids: string[] }

export async function fetchCourses(): Promise<Course[]> {
  const { data, error } = await db.from("lms_courses").select("*").eq("is_published", true).order("learners_count", { ascending: false });
  if (error) throw error;
  return data as Course[];
}
export async function fetchCourseBySlug(slug: string) {
  const { data, error } = await db.from("lms_courses").select("*, lms_modules(id, position, title, kind, duration_sec, is_preview)").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data as (Course & { lms_modules: { id: string; position: number; title: string; kind: string; duration_sec: number | null; is_preview: boolean }[] }) | null;
}
export async function fetchMyEnrollments(): Promise<Enrollment[]> {
  const uid = await currentUserId();
  if (!uid) return [];
  const { data, error } = await db.from("course_enrollments").select("*").eq("user_id", uid);
  if (error) throw error;
  return data as Enrollment[];
}
export const enrollInCourse = (courseId: string, orderId?: string) => rpc<Enrollment>("enroll_in_course", { p_course: courseId, p_order: orderId ?? null });
export const completeModule = (courseId: string, moduleId: string) => rpc<Enrollment>("complete_module", { p_course: courseId, p_module: moduleId });

// ---------------- Mentors ----------------
export interface MentorSlot { id: string; mentor_id: string; starts_at: string; ends_at: string; price_inr: number; mentor_profiles: { display_name: string; headline: string | null; expertise: string[]; rating: number | null } }
export async function fetchOpenSlots(): Promise<MentorSlot[]> {
  const { data, error } = await db.from("mentor_slots").select("*, mentor_profiles(display_name, headline, expertise, rating)")
    .eq("status", "open").gt("starts_at", new Date().toISOString()).order("starts_at").limit(60);
  if (error) throw error;
  return data as MentorSlot[];
}
export const bookMentorSlot = (slotId: string, topic?: string, orderId?: string) =>
  rpc("book_mentor_slot", { p_slot: slotId, p_topic: topic ?? null, p_order: orderId ?? null });
export const cancelMentorBooking = (bookingId: string) => rpc<void>("cancel_mentor_booking", { p_booking: bookingId });
export async function fetchMyBookings() {
  const uid = await currentUserId();
  if (!uid) return [];
  const { data, error } = await db.from("mentor_bookings").select("*, mentor_slots(starts_at, ends_at), mentor_profiles(display_name)").eq("user_id", uid).order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

// ---------------- Hackathons & events ----------------
export interface Hackathon {
  id: string; slug: string; title: string; description: string | null; industry: string | null; city: string | null;
  mode: string; format: string; starts_at: string; ends_at: string; registration_deadline: string | null;
  prize_pool_inr: number; entry_fee_inr: number; max_team_size: number; status: string;
}
export async function fetchHackathons(): Promise<Hackathon[]> {
  const { data, error } = await db.from("hackathons").select("*").neq("status", "draft").order("starts_at");
  if (error) throw error;
  return data as Hackathon[];
}
export const registerForHackathon = (id: string, teamName?: string, orderId?: string) =>
  rpc("register_for_hackathon", { p_hackathon: id, p_team_name: teamName ?? null, p_order: orderId ?? null });
export const joinHackathonTeam = (code: string) => rpc("join_hackathon_team", { p_invite_code: code });
export const submitHackathonProject = (id: string, title: string, description?: string, repoUrl?: string, demoUrl?: string) =>
  rpc("submit_hackathon_project", { p_hackathon: id, p_title: title, p_description: description ?? null, p_repo_url: repoUrl ?? null, p_demo_url: demoUrl ?? null });
export const registerForEvent = (kind: "podcast" | "webinar" | "networking" | "meetup", ref: string, city?: string) =>
  rpc("register_for_event", { p_kind: kind, p_ref: ref, p_city: city ?? null });

// ---------------- Freelancing ----------------
export interface Gig { id: string; title: string; description: string | null; client_name: string | null; budget_min: number; budget_max: number; duration_days: number | null; skills: string[]; created_at: string }
export interface GigProposal { id: string; gig_id: string; cover_note: string; bid_amount: number; status: string; created_at: string }
export async function fetchGigs(): Promise<Gig[]> {
  const { data, error } = await db.from("freelance_gigs").select("*").eq("status", "open").order("created_at", { ascending: false });
  if (error) throw error;
  return data as Gig[];
}
export async function fetchMyProposals(): Promise<GigProposal[]> {
  const uid = await currentUserId();
  if (!uid) return [];
  const { data, error } = await db.from("gig_proposals").select("*").eq("user_id", uid);
  if (error) throw error;
  return data as GigProposal[];
}
export const submitGigProposal = (gigId: string, coverNote: string, bid: number) =>
  rpc<GigProposal>("submit_gig_proposal", { p_gig: gigId, p_cover_note: coverNote, p_bid: bid });
export const withdrawGigProposal = (proposalId: string) => rpc<void>("withdraw_gig_proposal", { p_proposal: proposalId });

// ---------------- Analytics ----------------
export interface CandidateAnalytics {
  by_stage: Record<string, number>; applications_total: number; avg_match: number | null; profile_views_total: number;
  profile_views_30d: number; views_by_day: { day: string; views: number }[]; weekly_applications: { week: string; count: number }[];
  saved_jobs: number; assessments_completed: number; best_assessment: number | null; courses_completed: number; readiness: number | null;
}
export const fetchAnalytics = () => rpc<CandidateAnalytics>("candidate_analytics");

// ---------------- Support ----------------
export interface SupportTicket { id: string; category: string; subject: string; status: string; created_at: string; updated_at: string; support_messages?: { id: string; body: string; is_staff: boolean; created_at: string }[] }
export async function fetchTickets(): Promise<SupportTicket[]> {
  const { data, error } = await db.from("support_tickets").select("*, support_messages(id, body, is_staff, created_at)").order("updated_at", { ascending: false });
  if (error) throw error;
  return data as SupportTicket[];
}
export const createTicket = (category: string, subject: string, body: string) => rpc<SupportTicket>("create_support_ticket", { p_category: category, p_subject: subject, p_body: body });
export const replyTicket = (ticketId: string, body: string) => rpc("reply_support_ticket", { p_ticket: ticketId, p_body: body });

// ---------------- Identity verification ----------------
const ID_MIME = ["image/jpeg", "image/png", "application/pdf"];
export async function submitIdentity(idType: "aadhar" | "passport" | "driving_license", document: File, selfie: File, pan?: string) {
  const uid = await currentUserId();
  if (!uid) throw new BackendError("Please sign in to continue.");
  for (const f of [document, selfie]) {
    if (!ID_MIME.includes(f.type)) throw new BackendError("Upload a JPG, PNG or PDF file.");
    if (f.size > 10 * 1024 * 1024) throw new BackendError("Each file must be under 10 MB.");
  }
  const ext = (f: File) => (f.type === "application/pdf" ? "pdf" : f.type === "image/png" ? "png" : "jpg");
  const docPath = `${uid}/id-${Date.now()}.${ext(document)}`;
  const selfiePath = `${uid}/selfie-${Date.now()}.${ext(selfie)}`;
  for (const [path, file] of [[docPath, document], [selfiePath, selfie]] as const) {
    const { error } = await db.storage.from("identity-docs").upload(path, file, { contentType: file.type, upsert: true });
    if (error) throw new BackendError(error.message);
  }
  return rpc("submit_identity_verification", { p_id_type: idType, p_document_path: docPath, p_selfie_path: selfiePath, p_pan: pan ?? null });
}

// ---------------- Resume upload ----------------
export async function uploadResume(file: File): Promise<string> {
  const uid = await currentUserId();
  if (!uid) throw new BackendError("Please sign in to continue.");
  const okTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
  if (!okTypes.includes(file.type)) throw new BackendError("Upload a PDF or DOCX resume.");
  if (file.size > 5 * 1024 * 1024) throw new BackendError("Resume must be under 5 MB.");
  const path = `${uid}/resume-${Date.now()}.${file.type === "application/pdf" ? "pdf" : "docx"}`;
  const { error } = await db.storage.from("resumes").upload(path, file, { contentType: file.type, upsert: true });
  if (error) throw new BackendError(error.message);
  await rpc("save_candidate_profile", { p: { profile: { resume_path: path } } });
  return path;
}
export async function resumeDownloadUrl(path: string): Promise<string> {
  const { data, error } = await db.storage.from("resumes").createSignedUrl(path, 300);
  if (error || !data) throw new BackendError(error?.message ?? "Could not create a download link.");
  return data.signedUrl;
}

// ---------------- Registrations ----------------
export async function fetchMyHackathonRegistrations() {
  const uid = await currentUserId();
  if (!uid) return [];
  const { data, error } = await db.from("hackathon_registrations").select("*, hackathon_teams(name, invite_code)").eq("user_id", uid);
  if (error) throw error;
  return data as { id: string; hackathon_id: string; status: string; team_id: string | null; hackathon_teams: { name: string; invite_code: string } | null }[];
}
export async function fetchMyEventRegistrations() {
  const uid = await currentUserId();
  if (!uid) return [];
  const { data, error } = await db.from("event_registrations").select("*").eq("user_id", uid).order("created_at", { ascending: false });
  if (error) throw error;
  return data as { id: string; event_kind: string; event_ref: string; city: string | null; created_at: string }[];
}
