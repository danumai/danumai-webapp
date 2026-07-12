import Link from "next/link";
import { listJobs } from "@/lib/data/jobs";
import JobsList from "./JobsList";

export default async function AdminJobsPage() {
  const jobs = await listJobs();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-copper">Jobs</p>
          <h1 className="mt-2 font-display text-3xl tracking-tight text-paper">
            Open roles
          </h1>
          <p className="mt-2 text-sm text-mist">
            Reorder with the arrows, publish/unpublish, or quick-edit inline.
          </p>
        </div>
        <Link
          href="/admin/jobs/new"
          className="rounded-full bg-copper px-5 py-2.5 text-sm font-medium text-ink hover:bg-copper-soft"
        >
          New job
        </Link>
      </div>

      <JobsList jobs={jobs} />
    </div>
  );
}
