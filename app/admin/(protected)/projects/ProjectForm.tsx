"use client";

import { useActionState } from "react";
import type { Project } from "@/lib/data/projects";
import type { ProjectFormState } from "./actions";

const initialState: ProjectFormState = {};

export default function ProjectForm({
  project,
  action,
}: {
  project?: Project;
  action: (state: ProjectFormState, formData: FormData) => Promise<ProjectFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="mt-8 max-w-2xl space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-xs uppercase tracking-[0.15em] text-faint">Name</span>
          <input name="name" required defaultValue={project?.name} className="field mt-1.5" />
        </label>
        <label className="block text-sm">
          <span className="text-xs uppercase tracking-[0.15em] text-faint">
            Slug (optional, auto from name)
          </span>
          <input name="slug" defaultValue={project?.slug} className="field mt-1.5" />
        </label>
      </div>

      <label className="block text-sm">
        <span className="text-xs uppercase tracking-[0.15em] text-faint">Tagline</span>
        <input name="tagline" defaultValue={project?.tagline} className="field mt-1.5" />
      </label>

      <label className="block text-sm">
        <span className="text-xs uppercase tracking-[0.15em] text-faint">Description</span>
        <textarea
          name="description"
          rows={4}
          defaultValue={project?.description}
          className="field mt-1.5 resize-y"
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-3">
        <label className="block text-sm">
          <span className="text-xs uppercase tracking-[0.15em] text-faint">Status</span>
          <input
            name="status"
            placeholder="e.g. In development"
            defaultValue={project?.status}
            className="field mt-1.5"
          />
        </label>
        <label className="block text-sm">
          <span className="text-xs uppercase tracking-[0.15em] text-faint">Accent color</span>
          <input
            name="accent"
            type="color"
            defaultValue={project?.accent ?? "#d99a4e"}
            className="field mt-1.5 h-11 p-1"
          />
        </label>
        <label className="block text-sm">
          <span className="text-xs uppercase tracking-[0.15em] text-faint">Sort order</span>
          <input
            name="sortOrder"
            type="number"
            defaultValue={project?.sortOrder ?? 0}
            className="field mt-1.5"
          />
        </label>
      </div>

      <label className="flex items-center gap-2.5 text-sm text-mist">
        <input
          type="checkbox"
          name="published"
          defaultChecked={project?.published ?? true}
          className="accent-copper"
        />
        Published (visible on the homepage)
      </label>

      <label className="block text-sm">
        <span className="text-xs uppercase tracking-[0.15em] text-faint">
          Features (one per line)
        </span>
        <textarea
          name="features"
          rows={4}
          defaultValue={project?.features.join("\n")}
          className="field mt-1.5 resize-y"
        />
      </label>

      <label className="block text-sm">
        <span className="text-xs uppercase tracking-[0.15em] text-faint">Image</span>
        {project?.imageUrl && (
          <div className="mt-2 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.imageUrl}
              alt=""
              className="h-16 w-16 rounded-lg border hairline object-cover"
            />
            <label className="flex items-center gap-2 text-xs text-mist">
              <input type="checkbox" name="removeImage" className="accent-copper" />
              Remove current image
            </label>
          </div>
        )}
        <input
          name="image"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          className="field mt-1.5"
        />
      </label>

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
        {pending ? "Saving…" : "Save project"}
      </button>
    </form>
  );
}
