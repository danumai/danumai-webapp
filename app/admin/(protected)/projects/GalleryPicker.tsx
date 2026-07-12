"use client";

import { useEffect, useRef, useState } from "react";

const ACCEPT = "image/png,image/jpeg,image/webp,image/gif,image/svg+xml";

type Picked = { id: string; url: string; file: File };

/**
 * Multi-image picker for the project gallery. A native `<input multiple>`
 * REPLACES its selection every time it's opened, so you can't add images in
 * separate batches. This keeps an accumulating list instead: each "Add images"
 * click appends to the list (with thumbnails + per-image remove), and the real
 * files are written back onto a hidden `galleryImages` input via a DataTransfer
 * so the form submits every accumulated file.
 */
export default function GalleryPicker() {
  const submitRef = useRef<HTMLInputElement>(null);
  const pickRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<Picked[]>([]);

  // Revoke all preview object URLs on unmount.
  useEffect(
    () => () => {
      items.forEach((it) => URL.revokeObjectURL(it.url));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  function sync(next: Picked[]) {
    const dt = new DataTransfer();
    next.forEach((it) => dt.items.add(it.file));
    if (submitRef.current) submitRef.current.files = dt.files;
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const added = files.map((file) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      file,
    }));
    const next = [...items, ...added];
    setItems(next);
    sync(next);
    // Reset so choosing the same file again (or the next batch) still fires.
    e.target.value = "";
  }

  function remove(id: string) {
    const it = items.find((x) => x.id === id);
    if (it) URL.revokeObjectURL(it.url);
    const next = items.filter((x) => x.id !== id);
    setItems(next);
    sync(next);
  }

  return (
    <div className="mt-1.5">
      {/* Submitted by the form; kept in sync with `items`. */}
      <input ref={submitRef} type="file" name="galleryImages" multiple accept={ACCEPT} className="hidden" />
      {/* Used only to open the file dialog for each batch. */}
      <input ref={pickRef} type="file" multiple accept={ACCEPT} className="hidden" onChange={onPick} />

      <button
        type="button"
        onClick={() => pickRef.current?.click()}
        className="inline-flex items-center gap-2 rounded-full border hairline px-4 py-2 text-sm text-mist transition-colors hover:text-paper"
      >
        <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" className="h-4 w-4">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Add images
      </button>

      {items.length > 0 && (
        <>
          <ul className="mt-3 flex flex-wrap gap-3">
            {items.map((it) => (
              <li key={it.id} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={it.url}
                  alt=""
                  className="h-20 w-20 rounded-lg border hairline object-cover"
                />
                <button
                  type="button"
                  onClick={() => remove(it.id)}
                  aria-label="Remove this image"
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border hairline bg-ink text-mist transition-colors hover:text-paper"
                >
                  <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-3.5 w-3.5">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-faint">
            {items.length} new image{items.length === 1 ? "" : "s"} ready to upload.
          </p>
        </>
      )}
    </div>
  );
}
