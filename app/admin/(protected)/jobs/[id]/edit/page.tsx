import { notFound } from "next/navigation";
import { getJob } from "@/lib/data/jobs";
import JobForm from "../../JobForm";
import { updateJobAction } from "../../actions";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJob(id);
  if (!job) notFound();

  const boundAction = updateJobAction.bind(null, job.id);

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-copper">Jobs</p>
      <h1 className="mt-2 font-display text-3xl tracking-tight text-paper">
        Edit {job.title}
      </h1>
      <JobForm job={job} action={boundAction} />
    </div>
  );
}
