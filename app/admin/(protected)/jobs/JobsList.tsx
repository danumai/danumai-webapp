"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import type { Job } from "@/lib/data/jobs";
import {
  deleteJobAction,
  toggleJobPublishedAction,
  moveJobAction,
  quickUpdateJobAction,
} from "./actions";

export default function JobsList({ jobs }: { jobs: Job[] }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (jobs.length === 0) {
    return <p className="text-sm text-mist">No jobs yet.</p>;
  }

  return (
    <ul className="divide-y hairline border-y hairline">
      {jobs.map((j, i) => (
        <li key={j.id} className="py-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <button
                onClick={() => startTransition(() => moveJobAction(j.id, "up"))}
                disabled={pending || i === 0}
                className="px-1 text-mist hover:text-paper disabled:opacity-25"
                aria-label="Move up"
              >
                ↑
              </button>
              <button
                onClick={() => startTransition(() => moveJobAction(j.id, "down"))}
                disabled={pending || i === jobs.length - 1}
                className="px-1 text-mist hover:text-paper disabled:opacity-25"
                aria-label="Move down"
              >
                ↓
              </button>
            </div>

            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 truncate font-display text-lg text-paper">
                {j.title}
                {!j.published && (
                  <span className="rounded-full border hairline px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] text-faint">
                    Draft
                  </span>
                )}
              </p>
              <p className="truncate text-xs text-faint">
                {j.team || "—"} · {j.location} · {j.type} · #{j.sortOrder}
              </p>
            </div>

            <button
              onClick={() =>
                startTransition(() => toggleJobPublishedAction(j.id, !j.published))
              }
              disabled={pending}
              className="text-xs text-mist hover:text-copper-soft disabled:opacity-50"
            >
              {j.published ? "Unpublish" : "Publish"}
            </button>
            <button
              onClick={() => setEditing(editing === j.id ? null : j.id)}
              className="text-sm text-mist hover:text-copper-soft"
            >
              {editing === j.id ? "Close" : "Quick edit"}
            </button>
            <Link
              href={`/admin/jobs/${j.id}/edit`}
              className="text-sm text-copper hover:text-copper-soft"
            >
              Edit
            </Link>
            <button
              onClick={() => {
                if (confirm(`Delete “${j.title}”? This can't be undone.`)) {
                  startTransition(() => deleteJobAction(j.id));
                }
              }}
              disabled={pending}
              className="text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
            >
              Delete
            </button>
          </div>

          {editing === j.id && (
            <QuickEdit
              job={j}
              pending={pending}
              onSave={(fields) =>
                startTransition(async () => {
                  await quickUpdateJobAction(j.id, fields);
                  setEditing(null);
                })
              }
            />
          )}
        </li>
      ))}
    </ul>
  );
}

function QuickEdit({
  job,
  pending,
  onSave,
}: {
  job: Job;
  pending: boolean;
  onSave: (fields: { title: string; team: string; sortOrder: number }) => void;
}) {
  const [title, setTitle] = useState(job.title);
  const [team, setTeam] = useState(job.team);
  const [sortOrder, setSortOrder] = useState(job.sortOrder);

  return (
    <div className="mt-4 grid gap-3 rounded-xl border hairline bg-ink-2/40 p-4 sm:grid-cols-[2fr_1.5fr_0.7fr_auto]">
      <label className="block text-sm">
        <span className="text-xs uppercase tracking-[0.15em] text-faint">Title</span>
        <input className="field mt-1" value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <label className="block text-sm">
        <span className="text-xs uppercase tracking-[0.15em] text-faint">Team</span>
        <input className="field mt-1" value={team} onChange={(e) => setTeam(e.target.value)} />
      </label>
      <label className="block text-sm">
        <span className="text-xs uppercase tracking-[0.15em] text-faint">Order</span>
        <input
          type="number"
          className="field mt-1"
          value={sortOrder}
          onChange={(e) => setSortOrder(Number(e.target.value))}
        />
      </label>
      <div className="flex items-end">
        <button
          onClick={() => onSave({ title, team, sortOrder })}
          disabled={pending}
          className="rounded-full bg-copper px-5 py-2.5 text-sm font-medium text-ink hover:bg-copper-soft disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
