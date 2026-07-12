"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import type { Story } from "@/lib/data/stories";
import {
  deleteStoryAction,
  toggleStoryPublishedAction,
  moveStoryAction,
  quickUpdateStoryAction,
} from "./actions";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function StoriesList({ stories }: { stories: Story[] }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (stories.length === 0) {
    return <p className="text-sm text-mist">No stories yet.</p>;
  }

  return (
    <ul className="divide-y hairline border-y hairline">
      {stories.map((s, i) => (
        <li key={s.id} className="py-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <button
                onClick={() => startTransition(() => moveStoryAction(s.id, "up"))}
                disabled={pending || i === 0}
                className="px-1 text-mist hover:text-paper disabled:opacity-25"
                aria-label="Move up"
              >
                ↑
              </button>
              <button
                onClick={() => startTransition(() => moveStoryAction(s.id, "down"))}
                disabled={pending || i === stories.length - 1}
                className="px-1 text-mist hover:text-paper disabled:opacity-25"
                aria-label="Move down"
              >
                ↓
              </button>
            </div>

            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 truncate font-display text-lg text-paper">
                {s.title}
                {!s.published && (
                  <span className="rounded-full border hairline px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] text-faint">
                    Draft
                  </span>
                )}
              </p>
              <p className="truncate text-xs text-faint">
                {s.category} · {formatDate(s.publishedAt)} · {s.readMinutes} min read · #
                {s.sortOrder}
              </p>
            </div>

            <button
              onClick={() =>
                startTransition(() => toggleStoryPublishedAction(s.id, !s.published))
              }
              disabled={pending}
              className="text-xs text-mist hover:text-copper-soft disabled:opacity-50"
            >
              {s.published ? "Unpublish" : "Publish"}
            </button>
            <button
              onClick={() => setEditing(editing === s.id ? null : s.id)}
              className="text-sm text-mist hover:text-copper-soft"
            >
              {editing === s.id ? "Close" : "Quick edit"}
            </button>
            <Link
              href={`/admin/stories/${s.id}/edit`}
              className="text-sm text-copper hover:text-copper-soft"
            >
              Edit
            </Link>
            <button
              onClick={() => {
                if (confirm(`Delete “${s.title}”? This can't be undone.`)) {
                  startTransition(() => deleteStoryAction(s.id, s.coverUrl));
                }
              }}
              disabled={pending}
              className="text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
            >
              Delete
            </button>
          </div>

          {editing === s.id && (
            <QuickEdit
              story={s}
              pending={pending}
              onSave={(fields) =>
                startTransition(async () => {
                  await quickUpdateStoryAction(s.id, fields);
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
  story,
  pending,
  onSave,
}: {
  story: Story;
  pending: boolean;
  onSave: (fields: { title: string; category: string; sortOrder: number }) => void;
}) {
  const [title, setTitle] = useState(story.title);
  const [category, setCategory] = useState(story.category);
  const [sortOrder, setSortOrder] = useState(story.sortOrder);

  return (
    <div className="mt-4 grid gap-3 rounded-xl border hairline bg-ink-2/40 p-4 sm:grid-cols-[2fr_1.5fr_0.7fr_auto]">
      <label className="block text-sm">
        <span className="text-xs uppercase tracking-[0.15em] text-faint">Title</span>
        <input className="field mt-1" value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <label className="block text-sm">
        <span className="text-xs uppercase tracking-[0.15em] text-faint">Category</span>
        <input
          className="field mt-1"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
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
          onClick={() => onSave({ title, category, sortOrder })}
          disabled={pending}
          className="rounded-full bg-copper px-5 py-2.5 text-sm font-medium text-ink hover:bg-copper-soft disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
