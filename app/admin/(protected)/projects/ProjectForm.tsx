"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/data/projects";
import type { ProjectFormState } from "./actions";
import { ImageArt } from "@/components/sections/showcase/artworks";
import GalleryPicker from "./GalleryPicker";

const initialState: ProjectFormState = {};

// The venture card's media frame is close to square, so a square cover fills it
// cleanly at typical desktop sizes. We render the crop at 1200×1200.
const CARD_SHAPE = { w: 1200, h: 1200 };

/**
 * Center-crop (cover) an image file to the venture-card shape and return a new
 * File, so the uploaded cover fills the card frame without letterbox bands.
 * SVGs are vector and already scale to any box, so they're passed through
 * untouched rather than rasterised.
 */
function fitToCardShape(file: File): Promise<File> {
  if (file.type === "image/svg+xml") return Promise.resolve(file);
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const targetRatio = CARD_SHAPE.w / CARD_SHAPE.h;
        const srcRatio = img.naturalWidth / img.naturalHeight;
        let sw = img.naturalWidth;
        let sh = img.naturalHeight;
        let sx = 0;
        let sy = 0;
        if (srcRatio > targetRatio) {
          // Source is wider than the frame → crop the sides.
          sw = img.naturalHeight * targetRatio;
          sx = (img.naturalWidth - sw) / 2;
        } else {
          // Source is taller → crop the top and bottom.
          sh = img.naturalWidth / targetRatio;
          sy = (img.naturalHeight - sh) / 2;
        }
        const canvas = document.createElement("canvas");
        canvas.width = CARD_SHAPE.w;
        canvas.height = CARD_SHAPE.h;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("no 2d context");
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, CARD_SHAPE.w, CARD_SHAPE.h);
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            if (!blob) {
              reject(new Error("toBlob failed"));
              return;
            }
            const base = file.name.replace(/\.[^.]+$/, "");
            resolve(new File([blob], `${base}-card.webp`, { type: "image/webp" }));
          },
          "image/webp",
          0.9
        );
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("image load failed"));
    };
    img.src = url;
  });
}

export default function ProjectForm({
  project,
  action,
}: {
  project?: Project;
  action: (state: ProjectFormState, formData: FormData) => Promise<ProjectFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  // Live preview of the cover image exactly as the site renders it, so admins
  // can see the card result before saving.
  const [coverPreview, setCoverPreview] = useState<string | null>(
    project?.imageUrl ?? null
  );
  const [coverRemoved, setCoverRemoved] = useState(false);
  // "Fit to card shape" crops the chosen image to the venture-card shape so it
  // fills the frame edge-to-edge; turn it off for a normal, untouched upload
  // (centered over a soft blur fill, which may leave thin bands). On by default
  // because a perfectly-fitted cover is what most admins want.
  const [fitToShape, setFitToShape] = useState(true);
  const [processing, setProcessing] = useState(false);

  const objectUrlRef = useRef<string | null>(null);
  const originalFileRef = useRef<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Revoke any object URL we created when the component unmounts.
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  function setPreviewUrlFrom(file: File | null) {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    if (file) {
      const url = URL.createObjectURL(file);
      objectUrlRef.current = url;
      setCoverPreview(url);
    } else {
      setCoverPreview(project?.imageUrl ?? null);
    }
  }

  // Replace the <input type="file"> contents so the server action uploads the
  // file we hand it (the cropped one when fitting) — same DataTransfer trick
  // the gallery picker uses.
  function putFileOnInput(file: File | null) {
    const input = inputRef.current;
    if (!input) return;
    const dt = new DataTransfer();
    if (file) dt.items.add(file);
    input.files = dt.files;
  }

  // Apply the current mode (fit vs. normal) to the originally-chosen file and
  // push the result to both the preview and the upload input.
  async function applyMode(fit: boolean) {
    const original = originalFileRef.current;
    if (!original) return;
    if (fit) {
      setProcessing(true);
      try {
        const cropped = await fitToCardShape(original);
        putFileOnInput(cropped);
        setPreviewUrlFrom(cropped);
      } catch {
        // Fall back to the untouched file if cropping fails for any reason.
        putFileOnInput(original);
        setPreviewUrlFrom(original);
      } finally {
        setProcessing(false);
      }
    } else {
      putFileOnInput(original);
      setPreviewUrlFrom(original);
    }
  }

  function onCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    originalFileRef.current = file;
    setCoverRemoved(false);
    if (file) {
      void applyMode(fitToShape);
    } else {
      setPreviewUrlFrom(null);
    }
  }

  function onFitToggle(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.checked;
    setFitToShape(next);
    void applyMode(next);
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
          ref={inputRef}
          name="image"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          onChange={onCoverChange}
          className="field mt-1.5"
        />

        {/* Fit-to-shape option: on by default so a chosen image is auto-cropped
            to fill the card; off uploads the original untouched. */}
        <label className="mt-2.5 flex items-start gap-2 text-xs text-mist">
          <input
            type="checkbox"
            checked={fitToShape}
            onChange={onFitToggle}
            className="mt-0.5 accent-copper"
          />
          <span>
            <strong className="text-paper">Fit to card shape</strong> — crop the
            image to fill the venture card edge-to-edge (recommended).{" "}
            <span className="text-faint">
              Uncheck to upload the original untouched (centered over a soft blur;
              may show thin bands).
            </span>
            {processing && <span className="ml-1 text-copper">Fitting…</span>}
          </span>
        </label>

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
            Recommended: a roughly <strong className="text-paper">square image
            (e.g. 1200 × 1200&nbsp;px)</strong>, under 8&nbsp;MB. With{" "}
            <strong className="text-paper">Fit to card shape</strong> on, any
            upload is auto-cropped to fill the frame below — toggle it to compare.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="mb-1.5 text-[11px] uppercase tracking-[0.15em] text-faint">
                Desktop card
              </p>
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl border hairline bg-ink-3">
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
