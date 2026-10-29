import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, Briefcase, Building2, CheckCircle2, IndianRupee, Loader2, MapPin, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import {
  applyToJob,
  fetchMyApplications,
  fetchSavedJobIds,
  parseExperienceMax,
  searchLiveJobs,
  toggleSavedJob,
  type LiveJobResult,
} from "@/services/candidate/jobs";
import { backendErrorMessage } from "@/hooks/useCandidateBackend";

interface LiveJobResultsSectionProps {
  query: string;
  experience: string;
  location: string;
  skills: string[];
  onClearFilters: () => void;
}

const workModes = ["All", "Remote", "Hybrid", "Onsite"] as const;
const sortOptions = [
  { value: "recent", label: "Most Recent" },
  { value: "match", label: "Best Match" },
  { value: "salary", label: "Highest Salary" },
] as const;

const formatLpa = (min: number, max: number) => {
  if (!min && !max) return "Competitive";
  if (min && max) return `₹${min}–${max} LPA`;
  return `₹${max || min} LPA`;
};

const LiveJobResultsSection = ({
  query,
  experience,
  location,
  skills,
  onClearFilters,
}: LiveJobResultsSectionProps) => {
  const navigate = useNavigate();
  const { user } = useSupabaseUser();
  const [workMode, setWorkMode] = useState<(typeof workModes)[number]>("All");
  const [sort, setSort] = useState<(typeof sortOptions)[number]["value"]>("recent");
  const [jobs, setJobs] = useState<LiveJobResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [appliedIds, setAppliedIds] = useState<number[]>([]);
  const [busyJob, setBusyJob] = useState<string | null>(null);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await searchLiveJobs({
        query,
        workMode: workMode === "All" ? null : workMode,
        maxExp: parseExperienceMax(experience),
        location,
        skills,
        sort,
        limit: 12,
      });
      setJobs(res.items);
      setTotal(res.total);
    } catch (err) {
      toast.error(backendErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [query, workMode, experience, location, skills, sort]);

  useEffect(() => {
    void loadJobs();
  }, [loadJobs]);

  useEffect(() => {
    if (!user?.email) {
      setSavedIds([]);
      setAppliedIds([]);
      return;
    }
    void Promise.all([
      fetchSavedJobIds().catch(() => [] as number[]),
      fetchMyApplications(user.email, user.email.split("@")[0]).catch(() => []),
    ]).then(([saved, apps]) => {
      setSavedIds(saved);
      setAppliedIds(apps.map((a) => a.jid));
    });
  }, [user]);

  const handleSave = async (job: LiveJobResult) => {
    if (!user) {
      toast.info("Sign in to save jobs to your profile.");
      navigate("/auth");
      return;
    }
    setBusyJob(`save-${job.id}`);
    try {
      const nowSaved = await toggleSavedJob(job.id);
      setSavedIds((prev) => (nowSaved ? [...prev, job.id] : prev.filter((x) => x !== job.id)));
      toast.success(nowSaved ? `Saved ${job.t}` : `Removed ${job.t} from saved jobs`);
    } catch (err) {
      toast.error(backendErrorMessage(err));
    } finally {
      setBusyJob(null);
    }
  };

  const handleApply = async (job: LiveJobResult) => {
    if (!user) {
      toast.info("Sign in to apply with your verified profile.");
      navigate("/auth");
      return;
    }
    setBusyJob(`apply-${job.id}`);
    try {
      const res = await applyToJob(job.id);
      setAppliedIds((prev) => (prev.includes(job.id) ? prev : [...prev, job.id]));
      toast.success(
        res.match_score !== null && res.match_score !== undefined
          ? `Applied to ${job.t} at ${job.c} (Match score: ${Math.round(Number(res.match_score))}%)`
          : `Applied to ${job.t} at ${job.c}!`
      );
    } catch (err) {
      toast.error(backendErrorMessage(err));
    } finally {
      setBusyJob(null);
    }
  };

  const hasActiveFilters = Boolean(query || experience || location || skills.length > 0 || workMode !== "All");

  return (
    <section id="live-job-results" className="py-12 md:py-16 border-b border-border/60 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">
              Live Verified Openings
            </p>
            <h2 className="text-2xl md:text-3xl font-bold font-display">
              {loading ? "Searching openings…" : `${total} Active Role${total === 1 ? "" : "s"} Ready for You`}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-full border border-border bg-card p-1">
              {workModes.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setWorkMode(mode)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors",
                    workMode === mode
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>

            <label htmlFor="jobs-sort-select" className="sr-only">
              Sort jobs
            </label>
            <select
              id="jobs-sort-select"
              name="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="h-9 rounded-full border border-border bg-card px-3.5 text-xs font-semibold text-foreground"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {query && (
              <Badge variant="secondary" className="gap-1">
                Keyword: {query}
              </Badge>
            )}
            {experience && (
              <Badge variant="secondary" className="gap-1">
                Experience: {experience}
              </Badge>
            )}
            {location && (
              <Badge variant="secondary" className="gap-1">
                Location: {location}
              </Badge>
            )}
            {skills.map((s) => (
              <Badge key={s} variant="secondary">
                {s}
              </Badge>
            ))}
            <button
              type="button"
              onClick={() => {
                setWorkMode("All");
                onClearFilters();
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline ml-1"
            >
              <X className="h-3.5 w-3.5" /> Reset filters
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="rounded-2xl border border-border bg-card p-5 h-52 animate-pulse" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <p className="font-semibold text-base mb-1">No matching openings found</p>
            <p className="text-sm text-muted-foreground mb-4">
              Try broadening your keywords, work mode, or experience range.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setWorkMode("All");
                onClearFilters();
              }}
            >
              Show all active jobs
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => {
              const isSaved = savedIds.includes(job.id);
              const isApplied = appliedIds.includes(job.id);
              return (
                <article
                  key={job.uuid}
                  className="rounded-2xl border border-border bg-card p-5 flex flex-col justify-between gap-4 hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-bold font-display text-base leading-snug text-foreground">
                          {job.t}
                        </h3>
                        <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mt-0.5">
                          <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
                          {job.c}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label={isSaved ? `Remove ${job.t} from saved jobs` : `Save ${job.t}`}
                        disabled={busyJob === `save-${job.id}`}
                        onClick={() => handleSave(job)}
                        className={cn(
                          "h-8 w-8 rounded-full border flex items-center justify-center shrink-0 transition-colors",
                          isSaved
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:text-primary hover:border-primary/40"
                        )}
                      >
                        <Bookmark className={cn("h-4 w-4", isSaved && "fill-primary")} />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground my-3">
                      <span className="inline-flex items-center gap-1 bg-muted px-2.5 py-1 rounded-full">
                        <MapPin className="h-3 w-3 text-primary" /> {job.l} · {job.m}
                      </span>
                      <span className="inline-flex items-center gap-1 bg-muted px-2.5 py-1 rounded-full">
                        <Briefcase className="h-3 w-3 text-primary" /> {job.e === 0 ? "Fresher+" : `${job.e}+ yrs`}
                      </span>
                      <span className="inline-flex items-center gap-1 bg-muted px-2.5 py-1 rounded-full font-medium text-foreground">
                        <IndianRupee className="h-3 w-3 text-primary" /> {formatLpa(job.a, job.b)}
                      </span>
                    </div>

                    {job.sk.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {job.sk.slice(0, 4).map((skill) => (
                          <span
                            key={skill}
                            className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-primary/5 text-primary border border-primary/15"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                    {job.matchScore !== null ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                        <Sparkles className="h-3.5 w-3.5" /> {job.matchScore}% Match
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">{job.ty}</span>
                    )}

                    <div className="flex items-center gap-2 ml-auto">
                      {user && (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate("/talento-pro")}
                          className="text-xs h-8 px-2.5"
                        >
                          Pro View
                        </Button>
                      )}
                      <Button
                        type="button"
                        size="sm"
                        disabled={isApplied || busyJob === `apply-${job.id}`}
                        onClick={() => handleApply(job)}
                        className="h-8 px-4 text-xs gap-1.5"
                      >
                        {busyJob === `apply-${job.id}` ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : isApplied ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : null}
                        {isApplied ? "Applied" : "Apply Now"}
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default LiveJobResultsSection;
