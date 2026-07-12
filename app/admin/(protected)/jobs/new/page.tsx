import JobForm from "../JobForm";
import { createJobAction } from "../actions";

export default function NewJobPage() {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-copper">Jobs</p>
      <h1 className="mt-2 font-display text-3xl tracking-tight text-paper">New job</h1>
      <JobForm action={createJobAction} />
    </div>
  );
}
