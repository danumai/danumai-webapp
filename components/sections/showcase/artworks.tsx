"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Hand-built CSS/SVG "exhibit artwork" for each venture — no stock imagery,
 * each one a living miniature of the product.
 */

export function ReelsArt() {
  const reduce = useReducedMotion();
  return (
    <div className="relative flex h-full items-center justify-center">
      {/* ambient stage light */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 70% at 50% 30%, rgba(217,154,78,0.10), transparent 70%)",
        }}
      />
      {/* phone */}
      <motion.div
        animate={reduce ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative h-[78%] max-h-105 w-auto aspect-[9/19] rounded-[2rem] border border-paper/15 bg-ink p-2 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]"
      >
        <div className="relative h-full w-full overflow-hidden rounded-[1.6rem] bg-ink-3">
          {/* "video" */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(160deg, #2a2116 0%, #1a1712 45%, #0c0b09 100%)",
            }}
          />
          <motion.div
            aria-hidden
            className="absolute -left-10 top-10 h-40 w-40 rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, rgba(217,154,78,0.25), transparent)",
            }}
            animate={reduce ? undefined : { x: [0, 14, 0], y: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* play badge */}
          <div className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2">
            <motion.div
              className="flex h-12 w-12 items-center justify-center rounded-full border border-paper/25 bg-ink/60 backdrop-blur-sm"
              animate={reduce ? undefined : { scale: [1, 1.08, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="ml-0.5 block h-0 w-0 border-y-[7px] border-l-[11px] border-y-transparent border-l-copper" />
            </motion.div>
          </div>
          {/* caption skeleton */}
          <div className="absolute inset-x-4 bottom-14 space-y-2">
            <div className="h-2 w-2/3 rounded-full bg-paper/25" />
            <div className="h-2 w-1/2 rounded-full bg-paper/15" />
          </div>
          {/* action rail */}
          <div className="absolute bottom-14 right-3 flex flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="block h-7 w-7 rounded-full border border-paper/20 bg-ink/50"
                animate={reduce ? undefined : { y: [0, -3, 0] }}
                transition={{
                  duration: 3,
                  delay: i * 0.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
          {/* episode progress */}
          <div className="absolute inset-x-4 bottom-4 flex gap-1.5">
            {[1, 0.7, 0.4, 0.15].map((w, i) => (
              <span
                key={i}
                className="relative h-1 flex-1 overflow-hidden rounded-full bg-paper/15"
              >
                {i === 0 && (
                  <motion.span
                    className="absolute inset-y-0 left-0 rounded-full bg-copper"
                    initial={{ width: "20%" }}
                    animate={reduce ? undefined : { width: ["20%", "90%", "20%"] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
                {i !== 0 && (
                  <span
                    className="absolute inset-y-0 left-0 rounded-full bg-paper/30"
                    style={{ width: `${w * 100}%` }}
                  />
                )}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function StudiosArt() {
  const reduce = useReducedMotion();
  const frames = [
    { rotate: -5, x: "-32%", scene: "SC 12", depth: 0 },
    { rotate: 0, x: "0%", scene: "SC 13", depth: 1 },
    { rotate: 5, x: "32%", scene: "SC 14", depth: 0 },
  ];
  return (
    <div className="relative flex h-full items-center justify-center">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 60% at 50% 45%, rgba(217,154,78,0.08), transparent 70%)",
        }}
      />
      <div className="relative h-[52%] w-[70%]">
        {frames.map((f, i) => (
          <motion.div
            key={f.scene}
            className="absolute left-1/2 top-1/2 aspect-[3/4] h-full -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-paper/12 bg-ink-3 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.8)]"
            style={{ zIndex: f.depth ? 10 : 5 }}
            initial={false}
            animate={
              reduce
                ? { rotate: f.rotate, x: `calc(-50% + ${f.x})` }
                : {
                    rotate: [f.rotate, f.rotate + 1.2, f.rotate],
                    x: `calc(-50% + ${f.x})`,
                    y: ["-50%", "-53%", "-50%"],
                  }
            }
            transition={{
              duration: 7,
              delay: i * 0.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: f.depth
                  ? "linear-gradient(150deg, #33271a, #14110d 70%)"
                  : "linear-gradient(150deg, #221b12, #100e0b 70%)",
              }}
            />
            <span className="absolute left-3 top-3 font-display text-[10px] tracking-[0.2em] text-copper/80">
              {f.scene}
            </span>
            <div className="absolute inset-x-3 bottom-3 space-y-1.5">
              <div className="h-1.5 w-3/4 rounded-full bg-paper/20" />
              <div className="h-1.5 w-1/2 rounded-full bg-paper/10" />
            </div>
            {/* sprocket holes */}
            <div className="absolute inset-y-2 left-1 flex flex-col justify-between">
              {[...Array(6)].map((_, j) => (
                <span key={j} className="block h-1 w-1 rounded-[2px] bg-paper/15" />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      {/* scrubber */}
      <div className="absolute inset-x-[14%] bottom-[10%]">
        <div className="relative h-px bg-paper/15">
          <motion.span
            className="absolute -top-[3px] h-[7px] w-[7px] rounded-full bg-copper"
            animate={reduce ? undefined : { left: ["4%", "92%", "4%"] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Fallback exhibit for admin-created ventures that don't have a hand-built
 * Art component: renders the uploaded image, or an initial-letter monogram
 * when no image has been uploaded yet.
 */
export function ImageArt({ imageUrl, name }: { imageUrl: string | null; name: string }) {
  if (!imageUrl) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="font-display text-5xl text-copper/30">
          {name.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={imageUrl} alt="" className="h-full w-full object-cover" />
  );
}

export function CareArt() {
  const reduce = useReducedMotion();
  const rows = [
    { w: "70%", t: "08:00" },
    { w: "55%", t: "11:30" },
    { w: "80%", t: "14:00" },
    { w: "45%", t: "18:15" },
  ];
  return (
    <div className="relative flex h-full items-center justify-center">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 60% at 45% 40%, rgba(217,154,78,0.08), transparent 70%)",
        }}
      />
      <motion.div
        animate={reduce ? undefined : { y: [0, -6, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-[68%] max-w-105 rounded-2xl border border-paper/12 bg-ink-3/90 p-5 shadow-[0_30px_70px_-28px_rgba(0,0,0,0.8)] backdrop-blur-sm md:p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="h-2 w-24 rounded-full bg-paper/25" />
            <div className="mt-2 h-2 w-16 rounded-full bg-paper/10" />
          </div>
          <motion.span
            className="flex h-9 w-9 items-center justify-center rounded-full border border-copper/40"
            animate={reduce ? undefined : { scale: [1, 1.06, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* heartbeat */}
            <svg viewBox="0 0 24 12" className="w-5" aria-hidden>
              <motion.path
                d="M0 6h6l2-4 3 8 2.5-4H24"
                fill="none"
                stroke="var(--color-copper)"
                strokeWidth={1.6}
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={reduce ? { pathLength: 1 } : { pathLength: [0, 1, 1], opacity: [1, 1, 0.2] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </svg>
          </motion.span>
        </div>
        <div className="mt-5 space-y-3">
          {rows.map((r, i) => (
            <motion.div
              key={r.t}
              className="flex items-center gap-3 rounded-lg border border-paper/8 bg-ink/60 px-3 py-2.5"
              initial={false}
              animate={reduce ? undefined : { opacity: [0.55, 1, 0.55] }}
              transition={{
                duration: 5,
                delay: i * 1.1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="text-[10px] tabular-nums tracking-wide text-copper/80">
                {r.t}
              </span>
              <span
                className="block h-1.5 rounded-full bg-paper/20"
                style={{ width: r.w }}
              />
              <span className="ml-auto block h-3.5 w-3.5 rounded-full border border-copper/50">
                <motion.span
                  className="block h-full w-full scale-50 rounded-full bg-copper"
                  initial={false}
                  animate={reduce ? undefined : { opacity: [0, 1, 0] }}
                  transition={{
                    duration: 5,
                    delay: i * 1.1 + 0.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
