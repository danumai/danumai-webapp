"use client";

import { useActionState } from "react";
import type { Job } from "@/lib/data/jobs";
import type { JobFormState } from "./actions";

const initialState: JobFormState = {};

export default function JobForm({
  job,
  action,
}: {
  job?: Job;
  action: (state: JobFormState, formData: FormData) => Promise<JobFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="mt-8 max-w-2xl space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-xs uppercase tracking-[0.15em] text-faint">Title</span>
          <input name="title" required defaultValue={job?.title} className="field mt-1.5" />
        </label>
        <label className="block text-sm">
          <span className="text-xs uppercase tracking-[0.15em] text-faint">
            Slug (optional, auto from title)
          </span>
          <input name="slug" defaultValue={job?.slug} className="field mt-1.5" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <label className="block text-sm">
          <span className="text-xs uppercase tracking-[0.15em] text-faint">Team</span>
          <input name="team" defaultValue={job?.team} className="field mt-1.5" />
        </label>
        <label className="block text-sm">
          <span className="text-xs uppercase tracking-[0.15em] text-faint">Location</span>
          <input name="location" defaultValue={job?.location} className="field mt-1.5" />
        </label>
        <label className="block text-sm">
          <span className="text-xs uppercase tracking-[0.15em] text-faint">Type</span>
          <input
            name="type"
            placeholder="e.g. Full-time"
            defaultValue={job?.type}
            className="field mt-1.5"
          />
        </label>
      </div>

      <label className="block text-sm">
        <span className="text-xs uppercase tracking-[0.15em] text-faint">Summary</span>
        <textarea
          name="summary"
          rows={3}
          defaultValue={job?.summary}
          className="field mt-1.5 resize-y"
        />
      </label>

      <label className="block text-sm">
        <span className="text-xs uppercase tracking-[0.15em] text-faint">
          Requirements (one per line)
        </span>
        <textarea
          name="points"
          rows={4}
          defaultValue={job?.points.join("\n")}
          className="field mt-1.5 resize-y"
        />
      </label>

      <div className="flex items-center gap-6">
        <label className="block text-sm">
          <span className="text-xs uppercase tracking-[0.15em] text-faint">Sort order</span>
          <input
            name="sortOrder"
            type="number"
            defaultValue={job?.sortOrder ?? 0}
            className="field mt-1.5"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-mist">
          <input
            type="checkbox"
            name="published"
            defaultChecked={job?.published ?? true}
            className="accent-copper"
          />
          Published (visible on careers page)
        </label>
      </div>

      {state.error && (
        <p role="alert" className="text-sm leading-relaxed text-red-400">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-copper px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-copper-soft disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save job"}
      </button>
    </form>
  );
}
