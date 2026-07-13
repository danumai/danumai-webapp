"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Normalized crop rect over the original image (all values 0..1). */
export type CoverCrop = { x: number; y: number; w: number; h: number };

// The venture card renders its media panel at 4:3 on every breakpoint, so the
// editor frame is locked to the same shape: what you frame here is exactly
// what the card shows — never re-cropped, never letterboxed.
const ASPECT = 4 / 3;
const MAX_OUT_W = 1600; // exported crop is at most 1600×1200 (never upscaled)
const MAX_ZOOM = 5;
// Below 1 the image no longer fills the frame — it floats smaller inside it
// with transparent padding, which the card renders as its own dark surface.
const MIN_ZOOM = 0.4;

const clampNum = (v: number, lo: number, hi: number) =>
  lo > hi ? (lo + hi) / 2 : Math.min(hi, Math.max(lo, v));

/** Center + zoom of the crop window, in source-image pixels. zoom 1 = the
 *  largest 4:3 window that fits inside the image. */
type View = { cx: number; cy: number; zoom: number };

function cropSize(img: HTMLImageElement, zoom: number) {
  const maxW = Math.min(img.naturalWidth, img.naturalHeight * ASPECT);
  const w = maxW / zoom;
  return { w, h: w / ASPECT };
}

function clampView(img: HTMLImageElement, v: View): View {
  const zoom = clampNum(v.zoom, MIN_ZOOM, MAX_ZOOM);
  const { w, h } = cropSize(img, zoom);
  // Zoomed in (frame smaller than image): the frame must stay on the image.
  // Zoomed out (frame larger): the image must stay inside the frame — the
  // same bounds with lo/hi swapped, so order the pair either way.
  return {
    zoom,
    cx: clampNum(
      v.cx,
      Math.min(w / 2, img.naturalWidth - w / 2),
      Math.max(w / 2, img.naturalWidth - w / 2)
    ),
    cy: clampNum(
      v.cy,
      Math.min(h / 2, img.naturalHeight - h / 2),
      Math.max(h / 2, img.naturalHeight - h / 2)
    ),
  };
}

function centeredView(img: HTMLImageElement): View {
  return { cx: img.naturalWidth / 2, cy: img.naturalHeight / 2, zoom: 1 };
}

function viewFromCrop(img: HTMLImageElement, crop: CoverCrop): View {
  const w = crop.w * img.naturalWidth;
  const maxW = Math.min(img.naturalWidth, img.naturalHeight * ASPECT);
  return clampView(img, {
    zoom: w > 0 ? maxW / w : 1,
    cx: (crop.x + crop.w / 2) * img.naturalWidth,
    cy: (crop.y + crop.h / 2) * img.naturalHeight,
  });
}

function cropFromView(img: HTMLImageElement, v: View): CoverCrop {
  const { w, h } = cropSize(img, v.zoom);
  return {
    x: (v.cx - w / 2) / img.naturalWidth,
    y: (v.cy - h / 2) / img.naturalHeight,
    w: w / img.naturalWidth,
    h: h / img.naturalHeight,
  };
}

/**
 * Cover framing editor. The stage IS the card frame (4:3): drag to position,
 * zoom with the slider or mouse wheel, then Apply to export. Cropping is
 * non-destructive — the parent keeps the original image and this component
 * receives it (plus the previously saved crop, if any) every time, so the
 * framing can be adjusted again later without quality loss.
 *
 * `src` must be same-origin (an object URL or `/api/media/*`) so the export
 * canvas isn't tainted. SVG/GIF never reach here — the parent uploads them
 * untouched.
 */
export default function CoverEditor({
  src,
  fileName,
  initialCrop,
  onApply,
  onCancel,
}: {
  src: string;
  fileName: string;
  initialCrop?: CoverCrop | null;
  onApply: (file: File, crop: CoverCrop) => void;
  onCancel: () => void;
}) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [failed, setFailed] = useState(false);
  const [view, setView] = useState<View | null>(null);
  const [busy, setBusy] = useState(false);
  const [stageW, setStageW] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number; cx: number; cy: number } | null>(
    null
  );

  // Load the source image and restore the saved framing (or center it).
  useEffect(() => {
    let alive = true;
    setImg(null);
    setView(null);
    setFailed(false);
    const image = new Image();
    image.onload = () => {
      if (!alive) return;
      setImg(image);
      setView(
        initialCrop && initialCrop.w > 0 && initialCrop.h > 0
          ? viewFromCrop(image, initialCrop)
          : centeredView(image)
      );
    };
    image.onerror = () => alive && setFailed(true);
    image.src = src;
    return () => {
      alive = false;
    };
    // initialCrop only matters at load time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  // Track the stage's rendered width so drag distances map to source pixels.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setStageW(el.clientWidth));
    ro.observe(el);
    setStageW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  // Wheel zoom, attached natively so preventDefault can stop page scroll.
  useEffect(() => {
    const el = stageRef.current;
    if (!el || !img) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setView((v) =>
        v ? clampView(img, { ...v, zoom: v.zoom * Math.exp(-e.deltaY * 0.002) }) : v
      );
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [img]);

  const ready = img && view && stageW > 0;
  const crop = ready ? cropSize(img, view.zoom) : null;
  // Screen px per source px at the current zoom.
  const scale = ready && crop ? stageW / crop.w : 1;

  function onPointerDown(e: React.PointerEvent) {
    if (!view) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY, cx: view.cx, cy: view.cy };
  }
  function onPointerMove(e: React.PointerEvent) {
    const d = dragRef.current;
    if (!d || !img) return;
    setView((v) =>
      v
        ? clampView(img, {
            ...v,
            cx: d.cx - (e.clientX - d.x) / scale,
            cy: d.cy - (e.clientY - d.y) / scale,
          })
        : v
    );
  }
  function onPointerUp(e: React.PointerEvent) {
    dragRef.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
  }

  const setZoom = useCallback(
    (zoom: number) => {
      if (!img) return;
      setView((v) => (v ? clampView(img, { ...v, zoom }) : v));
    },
    [img]
  );

  // Export the framed 4:3 region of the ORIGINAL image and hand it back.
  async function apply() {
    if (!img || !view) return;
    setBusy(true);
    try {
      const { w, h } = cropSize(img, view.zoom);
      const sx = view.cx - w / 2;
      const sy = view.cy - h / 2;
      const outW = Math.max(4, Math.min(MAX_OUT_W, Math.round(w)));
      const outH = Math.round((outW * 3) / 4);
      const canvas = document.createElement("canvas");
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas is unavailable.");
      ctx.imageSmoothingQuality = "high";
      // Draw the whole image scaled into frame space (rather than a source
      // rect) so a zoomed-out frame that extends past the image edges comes
      // out as transparent padding instead of relying on source clipping.
      const s = outW / w;
      ctx.drawImage(
        img,
        -sx * s,
        -sy * s,
        img.naturalWidth * s,
        img.naturalHeight * s
      );
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/webp", 0.92)
      );
      if (!blob) throw new Error("Could not encode the cropped image.");
      const base = (fileName.replace(/\.[^.]+$/, "") || "cover").slice(0, 80);
      onApply(
        new File([blob], `${base}-cover.webp`, { type: "image/webp" }),
        cropFromView(img, view)
      );
    } finally {
      setBusy(false);
    }
  }

  const outW = crop ? Math.min(MAX_OUT_W, Math.round(crop.w)) : 0;

  return (
    <div className="mt-3 rounded-xl border hairline bg-ink-3/40 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.15em] text-faint">
          Frame the cover
        </p>
        <button
          type="button"
          onClick={() => img && setView(centeredView(img))}
          className="text-[11px] text-copper hover:text-copper-soft"
        >
          Reset
        </button>
      </div>
      <p className="mt-1.5 text-xs leading-relaxed text-mist">
        This frame is the venture card, exactly — drag to position, zoom with
        the slider or mouse wheel. Zooming out past the fit point shrinks the
        image inside the frame; the space around it stays the card&rsquo;s own
        surface. Framing is saved with the original image, so you can come back
        and adjust it any time without losing quality.
      </p>

      <div className="mt-3 flex flex-col items-center gap-3">
        <div
          ref={stageRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onDoubleClick={() => img && setView(centeredView(img))}
          style={{ touchAction: "none" }}
          className="relative aspect-4/3 w-full max-w-md cursor-grab select-none overflow-hidden rounded-2xl border hairline bg-ink-3 active:cursor-grabbing"
        >
          {failed && (
            <div className="flex h-full items-center justify-center px-6 text-center text-xs text-mist">
              Couldn’t load this image. Try re-uploading it.
            </div>
          )}
          {!failed && !ready && (
            <div className="flex h-full items-center justify-center text-xs text-faint">
              Loading image…
            </div>
          )}
          {ready && crop && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                draggable={false}
                className="pointer-events-none absolute left-0 top-0 max-w-none"
                style={{
                  width: img.naturalWidth * scale,
                  height: img.naturalHeight * scale,
                  transform: `translate(${-(view.cx - crop.w / 2) * scale}px, ${
                    -(view.cy - crop.h / 2) * scale
                  }px)`,
                }}
              />
              {/* rule-of-thirds guides */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3"
              >
                {Array.from({ length: 9 }).map((_, i) => (
                  <span
                    key={i}
                    className="border-b border-r border-paper/10 nth-[3n]:border-r-0 nth-[n+7]:border-b-0"
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <label className="flex w-full max-w-md items-center gap-3 text-xs text-mist">
          <span className="text-faint">Zoom</span>
          <input
            type="range"
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={0.01}
            value={view?.zoom ?? 1}
            onChange={(e) => setZoom(Number(e.target.value))}
            disabled={!ready}
            className="flex-1 accent-copper"
          />
        </label>

        <div className="flex w-full max-w-md items-center justify-between gap-3">
          <p className="text-[11px] tabular-nums text-faint">
            {ready ? `Exports ${outW} × ${Math.round((outW * 3) / 4)}px` : " "}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full border hairline px-4 py-1.5 text-xs text-mist hover:text-paper"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={apply}
              disabled={!ready || busy}
              className="rounded-full bg-copper px-4 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-copper-soft disabled:opacity-60"
            >
              {busy ? "Applying…" : "Apply framing"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
