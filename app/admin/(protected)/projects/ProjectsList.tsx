"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import type { Project } from "@/lib/data/projects";
import {
  deleteProjectAction,
  toggleProjectPublishedAction,
  moveProjectAction,
  quickUpdateProjectAction,
} from "./actions";

export default function ProjectsList({ projects }: { projects: Project[] }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (projects.length === 0) {
    return <p className="text-sm text-mist">No projects yet.</p>;
  }

  return (
    <ul className="divide-y hairline border-y hairline">
      {projects.map((p, i) => (
        <li key={p.id} className="py-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <button
                onClick={() => startTransition(() => moveProjectAction(p.id, "up"))}
                disabled={pending || i === 0}
                className="px-1 text-mist hover:text-paper disabled:opacity-25"
                aria-label="Move up"
              >
                ↑
              </button>
              <button
                onClick={() => startTransition(() => moveProjectAction(p.id, "down"))}
                disabled={pending || i === projects.length - 1}
                className="px-1 text-mist hover:text-paper disabled:opacity-25"
                aria-label="Move down"
              >
                ↓
              </button>
            </div>

            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border hairline bg-ink-3">
              {p.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 truncate font-display text-lg text-paper">
                {p.name}
                {!p.published && (
                  <span className="rounded-full border hairline px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] text-faint">
                    Hidden
                  </span>
                )}
              </p>
              <p className="truncate text-xs text-faint">
                {p.status || "—"} · {p.slug} · #{p.sortOrder}
              </p>
            </div>

            <button
              onClick={() =>
                startTransition(() => toggleProjectPublishedAction(p.id, !p.published))
              }
              disabled={pending}
              className="text-xs text-mist hover:text-copper-soft disabled:opacity-50"
            >
              {p.published ? "Hide" : "Show"}
            </button>
            <button
              onClick={() => setEditing(editing === p.id ? null : p.id)}
              className="text-sm text-mist hover:text-copper-soft"
            >
              {editing === p.id ? "Close" : "Quick edit"}
            </button>
            <Link
              href={`/admin/projects/${p.id}/edit`}
              className="text-sm text-copper hover:text-copper-soft"
            >
              Edit
            </Link>
            <button
              onClick={() => {
                if (confirm(`Delete “${p.name}”? This can't be undone.`)) {
                  startTransition(() => deleteProjectAction(p.id, p.imageUrl));
                }
              }}
              disabled={pending}
              className="text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
            >
              Delete
            </button>
          </div>

          {editing === p.id && (
            <QuickEdit
              project={p}
              pending={pending}
              onSave={(fields) =>
                startTransition(async () => {
                  await quickUpdateProjectAction(p.id, fields);
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
  project,
  pending,
  onSave,
}: {
  project: Project;
  pending: boolean;
  onSave: (fields: { name: string; status: string; sortOrder: number }) => void;
}) {
  const [name, setName] = useState(project.name);
  const [status, setStatus] = useState(project.status);
  const [sortOrder, setSortOrder] = useState(project.sortOrder);

  return (
    <div className="mt-4 grid gap-3 rounded-xl border hairline bg-ink-2/40 p-4 sm:grid-cols-[2fr_1.5fr_0.7fr_auto]">
      <label className="block text-sm">
        <span className="text-xs uppercase tracking-[0.15em] text-faint">Name</span>
        <input className="field mt-1" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label className="block text-sm">
        <span className="text-xs uppercase tracking-[0.15em] text-faint">Status</span>
        <input className="field mt-1" value={status} onChange={(e) => setStatus(e.target.value)} />
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
          onClick={() => onSave({ name, status, sortOrder })}
          disabled={pending}
          className="rounded-full bg-copper px-5 py-2.5 text-sm font-medium text-ink hover:bg-copper-soft disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
