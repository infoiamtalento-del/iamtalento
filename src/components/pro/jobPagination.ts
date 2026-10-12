export const JOBS_PER_PAGE = 20;
export function paginateJobs<T>(jobs: T[], page: number): T[] {
  const start = (Math.max(1, page) - 1) * JOBS_PER_PAGE;
  return jobs.slice(start, start + JOBS_PER_PAGE);
}