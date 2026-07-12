"use client";

import { useActionState } from "react";
import type { Story } from "@/lib/data/stories";
import type { StoryFormState } from "./actions";

const initialState: StoryFormState = {};

/** YYYY-MM-DD for a `<input type="date">`, defaulting to today for new stories. */
function dateValue(iso?: string): string {
  const d = iso ? new Date(iso) : new Date();
  if (Number.isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
  return d.toISOString().slice(0, 10);
}

export default function StoryForm({
  story,
  action,
}: {
  story?: Story;
  action: (state: StoryFormState, formData: FormData) => Promise<StoryFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="mt-8 max-w-2xl space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-xs uppercase tracking-[0.15em] text-faint">Title</span>
          <input name="title" required defaultValue={story?.title} className="field mt-1.5" />
        </label>
        <label className="block text-sm">
          <span className="text-xs uppercase tracking-[0.15em] text-faint">
            Slug (optional, auto from title)
          </span>
          <input name="slug" defaultValue={story?.slug} className="field mt-1.5" />
        </label>
      </div>

      <label className="block text-sm">
        <span className="text-xs uppercase tracking-[0.15em] text-faint">Subtitle</span>
        <input
          name="subtitle"
          placeholder="A short line beneath the title"
          defaultValue={story?.subtitle}
          className="field mt-1.5"
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-3">
        <label className="block text-sm">
          <span className="text-xs uppercase tracking-[0.15em] text-faint">Category</span>
          <input
            name="category"
            list="story-categories"
            placeholder="e.g. Vision"
            defaultValue={story?.category ?? "Vision"}
            className="field mt-1.5"
          />
          <datalist id="story-categories">
            <option value="Vision" />
            <option value="Plans" />
            <option value="Goals" />
            <option value="Update" />
          </datalist>
        </label>
        <label className="block text-sm">
          <span className="text-xs uppercase tracking-[0.15em] text-faint">Accent color</span>
          <input
            name="accent"
            type="color"
            defaultValue={story?.accent ?? "#d99a4e"}
            className="field mt-1.5 h-11 p-1"
          />
        </label>
        <label className="block text-sm">
          <span className="text-xs uppercase tracking-[0.15em] text-faint">Posted date</span>
          <input
            name="publishedAt"
            type="date"
            defaultValue={dateValue(story?.publishedAt)}
            className="field mt-1.5"
          />
        </label>
      </div>

      <label className="block text-sm">
        <span className="text-xs uppercase tracking-[0.15em] text-faint">
          Excerpt (shown on the card &amp; used for the page description)
        </span>
        <textarea
          name="excerpt"
          rows={2}
          defaultValue={story?.excerpt}
          className="field mt-1.5 resize-y"
        />
      </label>

      <label className="block text-sm">
        <span className="text-xs uppercase tracking-[0.15em] text-faint">Body</span>
        <textarea
          name="body"
          rows={16}
          defaultValue={story?.body}
          className="field mt-1.5 resize-y font-mono text-[13px] leading-relaxed"
        />
        <span className="mt-1.5 block text-xs text-faint">
          Formatting: blank line = new paragraph, <code>## </code> = heading,{" "}
          <code>- </code> = bullet.
        </span>
      </label>

      <label className="block text-sm">
        <span className="text-xs uppercase tracking-[0.15em] text-faint">Cover image (optional)</span>
        {story?.coverUrl && (
          <div className="mt-2 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={story.coverUrl}
              alt=""
              className="h-16 w-24 rounded-lg border hairline object-cover"
            />
            <label className="flex items-center gap-2 text-xs text-mist">
              <input type="checkbox" name="removeCover" className="accent-copper" />
              Remove current cover
            </label>
          </div>
        )}
        <input
          name="cover"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          className="field mt-1.5"
        />
      </label>

      <div className="flex items-center gap-6">
        <label className="block text-sm">
          <span className="text-xs uppercase tracking-[0.15em] text-faint">Sort order</span>
          <input
            name="sortOrder"
            type="number"
            defaultValue={story?.sortOrder ?? 0}
            className="field mt-1.5"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-mist">
          <input
            type="checkbox"
            name="published"
            defaultChecked={story?.published ?? true}
            className="accent-copper"
          />
          Published (visible on /stories)
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
        {pending ? "Saving…" : "Save story"}
      </button>
    </form>
  );
}
