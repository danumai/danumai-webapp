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
          className="fixed inset-0 z-999 flex flex-col items-center justify-center bg-ink/95 p-4 backdrop-blur-md sm:p-8"
          // The site hides the native pointer for its custom cursor, which the
          // overlay covers — restore a real cursor so the controls are usable.
          style={{ cursor: "zoom-out" }}
          onClick={close}
        >
          {/* Close — always visible, top-right of the viewport */}
          <button
            type="button"
            onClick={close}
            aria-label="Close gallery"
            style={{ cursor: "pointer" }}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border hairline bg-ink/60 text-mist transition-colors hover:text-paper sm:right-6 sm:top-6"
          >
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              className="h-5 w-5"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          {/* Prev / Next arrows flanking the image */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                aria-label="Previous image"
                style={{ cursor: "pointer" }}
                className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border hairline bg-ink/60 text-mist transition-colors hover:text-paper sm:left-6"
              >
                <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M15 6l-6 6 6 6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                aria-label="Next image"
                style={{ cursor: "pointer" }}
                className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border hairline bg-ink/60 text-mist transition-colors hover:text-paper sm:right-6"
              >
                <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            </>
          )}

          {/* Fixed-size stage so object-contain scales the image UP to fill it
              (a low-res image no longer shows as a tiny stamp); the transparent
              contain area is invisible against the dark backdrop. */}
          <motion.img
            key={open}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            src={images[open]}
            alt={`${name} screenshot ${open + 1}`}
            style={{ cursor: "auto" }}
            className="h-[82svh] w-[min(92vw,1200px)] rounded-2xl border hairline object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          <p className="mt-4 text-sm text-mist">
            {open + 1} / {images.length}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        {images.map((url, i) => (
          <button
            key={url}
            type="button"
            onClick={() => setOpen(i)}
            className="group relative aspect-4/3 overflow-hidden rounded-2xl border hairline bg-ink-3 focus-visible:outline-2"
            style={{ outlineColor: accent }}
            aria-label={`View ${name} image ${i + 1} of ${images.length}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`${name} screenshot ${i + 1}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
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
