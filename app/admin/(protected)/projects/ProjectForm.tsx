"use client";

import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/data/projects";
import type { ProjectFormState } from "./actions";
import { ImageArt } from "@/components/sections/showcase/artworks";
import GalleryPicker from "./GalleryPicker";
import CoverEditor, { type CoverCrop } from "./CoverEditor";

const initialState: ProjectFormState = {};

// Vector and animated formats upload untouched — cropping an SVG is pointless
// (it scales to any box) and cropping a GIF through a canvas would freeze it.
const skipsEditor = (type: string) =>
  type === "image/svg+xml" || type === "image/gif";

export default function ProjectForm({
  project,
  action,
}: {
  project?: Project;
  action: (state: ProjectFormState, formData: FormData) => Promise<ProjectFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  // What the preview card shows: the cropped cover exactly as the site
  // renders it (saved URL, or an object URL for a not-yet-saved crop).
  const [coverPreview, setCoverPreview] = useState<string | null>(
    project?.imageUrl ?? null
  );
  const [coverRemoved, setCoverRemoved] = useState(false);
  // The framing editor's session: which image it's framing and the framing to
  // restore. Null = closed.
  const [editor, setEditor] = useState<{
    src: string;
    name: string;
    initialCrop: CoverCrop | null;
  } | null>(null);
  // The crop applied in this form session (posted as hidden JSON so the server
  // can store it for later re-editing). Null = framing unchanged.
  const [appliedCrop, setAppliedCrop] = useState<CoverCrop | null>(null);

  // A freshly picked original file, kept so re-opening the editor always
  // frames the pristine upload — never a previous crop of it.
  const pendingOriginal = useRef<{ file: File; url: string } | null>(null);
  const freshApplied = useRef(false); // has the pending upload been framed yet?
  const previewUrlRef = useRef<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null); // posts the CROPPED file
  const originalInputRef = useRef<HTMLInputElement>(null); // posts the original

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      if (pendingOriginal.current) URL.revokeObjectURL(pendingOriginal.current.url);
    };
  }, []);

  const setPreviewFrom = useCallback(
    (file: File | null) => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
      if (file) {
        const url = URL.createObjectURL(file);
        previewUrlRef.current = url;
        setCoverPreview(url);
      } else {
        setCoverPreview(project?.imageUrl ?? null);
      }
    },
    [project?.imageUrl]
  );

  // Replace a file input's contents programmatically (DataTransfer trick), so
  // the plain server-action form posts the files we choose.
  const putFile = useCallback(
    (ref: React.RefObject<HTMLInputElement | null>, file: File | null) => {
      const input = ref.current;
      if (!input) return;
      const dt = new DataTransfer();
      if (file) dt.items.add(file);
      input.files = dt.files;
    },
    []
  );

  const dropPendingOriginal = useCallback(() => {
    if (pendingOriginal.current) {
      URL.revokeObjectURL(pendingOriginal.current.url);
      pendingOriginal.current = null;
    }
    freshApplied.current = false;
    putFile(originalInputRef, null);
  }, [putFile]);

  function onCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setCoverRemoved(false);
    setAppliedCrop(null);
    dropPendingOriginal();
    if (!file) {
      setEditor(null);
      setPreviewFrom(null);
      return;
    }
    if (skipsEditor(file.type)) {
      setEditor(null);
      setPreviewFrom(file);
      return;
    }
    // Raster upload: hold the original and open the framing editor on it.
    const url = URL.createObjectURL(file);
    pendingOriginal.current = { file, url };
    setPreviewFrom(file);
    setEditor({ src: url, name: file.name, initialCrop: null });
  }

  // Editor "Apply": the cropped file is what uploads as the cover; for a fresh
  // upload the pristine original rides along so framing stays editable later.
  const onApply = useCallback(
    (cropped: File, crop: CoverCrop) => {
      putFile(imageInputRef, cropped);
      if (pendingOriginal.current) {
        putFile(originalInputRef, pendingOriginal.current.file);
        freshApplied.current = true;
      }
      setAppliedCrop(crop);
      setPreviewFrom(cropped);
      setEditor(null);
    },
    [putFile, setPreviewFrom]
  );

  const onCancelEdit = useCallback(() => {
    // Backing out of a never-framed fresh upload discards it entirely, so the
    // form can't submit an unframed original by accident.
    if (pendingOriginal.current && !freshApplied.current) {
      putFile(imageInputRef, null);
      dropPendingOriginal();
      setPreviewFrom(null);
    }
    setEditor(null);
  }, [dropPendingOriginal, putFile, setPreviewFrom]);

  // Open the editor on the best available source: the pending upload if there
  // is one, otherwise the saved original (or, for covers saved before
  // originals were kept, the saved cover itself).
  const openAdjust = useCallback(() => {
    if (pendingOriginal.current) {
      setEditor({
        src: pendingOriginal.current.url,
        name: pendingOriginal.current.file.name,
        initialCrop: appliedCrop,
      });
      return;
    }
    if (!project?.imageUrl) return;
    const src = project.imageOriginalUrl ?? project.imageUrl;
    setEditor({
      src,
      name: project.name || "cover",
      // A saved crop is relative to the saved original — only restore it when
      // that original is what we're framing.
      initialCrop:
        appliedCrop ??
        (project.imageOriginalUrl ? project.imageCrop : null) ??
        null,
    });
  }, [appliedCrop, project]);

  const isVector = (url: string) => /\.svg(?:$|\?)/i.test(url);
  const previewUrl = coverRemoved ? null : coverPreview;
  const canAdjust =
    !coverRemoved &&
    (!!pendingOriginal.current ||
      (!!project?.imageUrl && !isVector(project.imageOriginalUrl ?? project.imageUrl)));

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
          ref={imageInputRef}
          name="image"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          onChange={onCoverChange}
          className="field mt-1.5"
        />
        {/* The pristine upload, posted alongside the crop so framing can be
            re-edited later without quality loss. Filled programmatically. */}
        <input ref={originalInputRef} name="imageOriginal" type="file" hidden />
        <input
          type="hidden"
          name="imageCrop"
          value={appliedCrop ? JSON.stringify(appliedCrop) : ""}
        />

        {editor && (
          <CoverEditor
            key={editor.src}
            src={editor.src}
            fileName={editor.name}
            initialCrop={editor.initialCrop}
            onApply={onApply}
            onCancel={onCancelEdit}
          />
        )}

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

        {/* Live preview: the cover in the exact 4:3 card frame the site uses. */}
        <div className="mt-3 rounded-xl border hairline bg-ink-3/40 p-4">
          <p className="text-xs uppercase tracking-[0.15em] text-faint">
            Card preview
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-mist">
            The venture card shows the cover in a{" "}
            <strong className="text-paper">4:3 frame</strong>, and the editor
            frames to that exact shape — what you see here is what the site
            shows.{" "}
            {canAdjust ? (
              <strong className="text-paper">
                Click the preview to adjust the framing.
              </strong>
            ) : (
              "Upload an image to get started."
            )}
          </p>

          <button
            type="button"
            onClick={canAdjust ? openAdjust : undefined}
            disabled={!canAdjust}
            aria-label={canAdjust ? "Adjust framing" : undefined}
            className={`group relative mt-4 block aspect-4/3 w-full max-w-sm overflow-hidden rounded-2xl border hairline bg-ink-3 ${
              canAdjust ? "cursor-pointer" : "cursor-default"
            }`}
          >
            <ImageArt imageUrl={previewUrl} name={project?.name || "Project"} />
            {canAdjust && (
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-ink/55 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="inline-flex items-center gap-1.5 rounded-full border hairline bg-ink/80 px-3 py-1.5 text-[11px] text-paper">
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3.5 w-3.5"
                  >
                    <path d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4" />
                  </svg>
                  Adjust framing
                </span>
              </span>
            )}
          </button>
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
