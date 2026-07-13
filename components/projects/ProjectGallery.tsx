"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Gallery grid for a project page with a lightbox: click any image to view it
 * full-size, arrow keys / on-screen arrows to move between images, Escape,
 * the close button, or a backdrop click to close.
 *
 * The lightbox is rendered through a portal onto <body>. This matters because
 * the gallery sits inside a Reveal wrapper that applies a CSS `filter`, and any
 * ancestor with a transform/filter becomes the containing block for
 * `position: fixed` children — which would trap the overlay inside the gallery
 * box instead of covering the viewport.
 */
export default function ProjectGallery({
  images,
  name,
  accent,
}: {
  images: string[];
  name: string;
  accent: string;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (dir: 1 | -1) => {
      setOpen((cur) =>
        cur === null ? cur : (cur + dir + images.length) % images.length
      );
    },
    [images.length]
  );

  // Keyboard controls + lock background scroll while the lightbox is open.
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, step, close]);

  if (images.length === 0) return null;

  const lightbox = (
    <AnimatePresence>
      {open !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${name} gallery`}
          className="fixed inset-0 z-999 flex flex-col bg-ink/95 p-3 backdrop-blur-md sm:p-6"
          // The site hides the native pointer for its custom cursor, which the
          // overlay covers — restore a real cursor so the controls are usable.
          style={{ cursor: "zoom-out" }}
          onClick={close}
        >
          {/* Top bar: counter on the left, close on the right — kept above the
              image so nothing overlaps the picture, on mobile or desktop. */}
          <div className="flex w-full shrink-0 items-center justify-between gap-3">
            <span className="text-sm text-mist" style={{ cursor: "auto" }}>
              {open + 1} / {images.length}
            </span>
            <button
              type="button"
              onClick={close}
              aria-label="Close gallery"
              style={{ cursor: "pointer" }}
              className="flex h-10 w-10 items-center justify-center rounded-full border hairline bg-ink/60 text-mist transition-colors hover:text-paper sm:h-11 sm:w-11"
            >
              <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" className="h-5 w-5">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          {/* Image stage: fills the remaining height. The image scales up to
              fill this box (small images no longer look tiny) while staying
              clear of the controls. */}
          <div className="relative flex min-h-0 w-full flex-1 items-center justify-center py-3">
            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                aria-label="Previous image"
                style={{ cursor: "pointer" }}
                className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border hairline bg-ink/70 text-mist backdrop-blur-sm transition-colors hover:text-paper sm:h-11 sm:w-11"
              >
                <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M15 6l-6 6 6 6" />
                </svg>
              </button>
            )}

            <motion.img
              key={open}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              src={images[open]}
              alt={`${name} screenshot ${open + 1}`}
              style={{ cursor: "auto" }}
              // h-full/w-full + object-contain fills the stage, so small images
              // scale up to fit while staying inside the controls' bounds.
              className="h-full w-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                aria-label="Next image"
                style={{ cursor: "pointer" }}
                className="absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border hairline bg-ink/70 text-mist backdrop-blur-sm transition-colors hover:text-paper sm:h-11 sm:w-11"
              >
                <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Masonry via CSS columns: each screenshot keeps its natural aspect
          ratio, so portrait app shots and wide dashboards both display at their
          true proportions — nothing is cropped and nothing is letterboxed. The
          `break-inside-avoid` keeps a tile from splitting across a column. */}
      <div className="gap-3 [column-fill:balance] columns-2 sm:gap-4 md:columns-3">
        {images.map((url, i) => (
          <button
            key={url}
            type="button"
            onClick={() => setOpen(i)}
            className="group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-2xl border hairline bg-ink-3 focus-visible:outline-2 sm:mb-4"
            style={{ outlineColor: accent }}
            aria-label={`View ${name} image ${i + 1} of ${images.length}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`${name} screenshot ${i + 1}`}
              loading="lazy"
              className="block h-auto w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background: `linear-gradient(180deg, transparent 60%, ${accent}30)`,
              }}
            />
          </button>
        ))}
      </div>

      {mounted && createPortal(lightbox, document.body)}
    </>
  );
}
