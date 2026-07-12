"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/data/projects";
import type { ProjectFormState } from "./actions";
import { ImageArt } from "@/components/sections/showcase/artworks";
import GalleryPicker from "./GalleryPicker";

const initialState: ProjectFormState = {};

export default function ProjectForm({
  project,
  action,
}: {
  project?: Project;
  action: (state: ProjectFormState, formData: FormData) => Promise<ProjectFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  // Live preview of the cover image exactly as the site renders it (uncropped,
  // over a soft blurred fill), so admins can see the card result before saving.
  const [coverPreview, setCoverPreview] = useState<string | null>(
    project?.imageUrl ?? null
  );
  const [coverRemoved, setCoverRemoved] = useState(false);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    // Revoke any object URL we created when the component unmounts.
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  function onCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    if (file) {
      const url = URL.createObjectURL(file);
      objectUrlRef.current = url;
      setCoverPreview(url);
      setCoverRemoved(false);
    } else {
      setCoverPreview(project?.imageUrl ?? null);
    }
  }

  const previewUrl = coverRemoved ? null : coverPreview;
  const previewName = project?.name || "Project";

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
        <span className="text-xs uppercase tracking-[0.15em] text-faint">
          Tech stack (one per line, shown on the project page)
        </span>
        <textarea
          name="techStack"
          rows={4}
          placeholder={"Next.js\nPostgreSQL\nAWS"}
          defaultValue={project?.techStack.join("\n")}
          className="field mt-1.5 resize-y"
        />
      </label>

      <div className="block text-sm">
        <span className="text-xs uppercase tracking-[0.15em] text-faint">Cover image</span>

        <input
          name="image"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          onChange={onCoverChange}
          className="field mt-1.5"
        />

        {project?.imageUrl && (
          <label className="mt-2 flex items-center gap-2 text-xs text-mist">
            <input
              type="checkbox"
              name="removeImage"
              className="accent-copper"
              onChange={(e) => setCoverRemoved(e.target.checked)}
            />
            Remove current image
          </label>
        )}

        {/* Recommended size + live preview of how it lands on the site */}
        <div className="mt-3 rounded-xl border hairline bg-ink-3/40 p-4">
          <p className="text-xs uppercase tracking-[0.15em] text-faint">
            Preview on site
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-mist">
            Recommended: a <strong className="text-paper">landscape image,
            1600 × 1200&nbsp;px (4:3)</strong>, under 8&nbsp;MB. The image is never
            cropped — it’s centered and any gaps are filled with a soft blur — so
            a 4:3 shot fills the venture-card frame most cleanly.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="mb-1.5 text-[11px] uppercase tracking-[0.15em] text-faint">
                Desktop card
              </p>
              <div className="relative aspect-5/4 w-full overflow-hidden rounded-2xl border hairline bg-ink-3">
                <ImageArt imageUrl={previewUrl} name={previewName} />
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-[11px] uppercase tracking-[0.15em] text-faint">
                Mobile card
              </p>
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border hairline bg-ink-3">
                <ImageArt imageUrl={previewUrl} name={previewName} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="block text-sm">
        <span className="text-xs uppercase tracking-[0.15em] text-faint">
          Gallery images (shown on the project page)
        </span>
        {project && project.gallery.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-3">
            {project.gallery.map((url) => (
              <li key={url} className="flex flex-col items-center gap-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt=""
                  className="h-16 w-16 rounded-lg border hairline object-cover"
                />
                <label className="flex items-center gap-1.5 text-[11px] text-mist">
                  <input
                    type="checkbox"
                    name="removeGalleryImage"
                    value={url}
                    className="accent-copper"
                  />
                  Remove
                </label>
              </li>
            ))}
          </ul>
        )}
        <GalleryPicker />
        <p className="mt-2 text-xs text-faint">
          Click “Add images” as many times as you like to build up the gallery —
          new picks are added, not replaced. Tick “Remove” above to drop an
          existing image.
        </p>
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
        {pending ? "Saving…" : "Save project"}
      </button>
    </form>
  );
}
