"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Hand-built animated "exhibits" for the Danumai Labs console — one living
 * miniature per capability, in the same craft language as the venture
 * artworks. Each accepts the capability accent and gates motion on
 * prefers-reduced-motion.
 */

type ExhibitProps = { accent: string };

const ease = [0.16, 1, 0.3, 1] as const;

/* ---------- 01 · Product engineering — editor → pipeline ---------- */
export function ProductExhibit({ accent }: ExhibitProps) {
  const reduce = useReducedMotion();
  const lines = [
    { indent: 0, w: "58%" },
    { indent: 1, w: "72%" },
    { indent: 2, w: "46%" },
    { indent: 2, w: "63%" },
    { indent: 1, w: "38%" },
    { indent: 0, w: "52%" },
  ];
  const stages = ["build", "test", "ship"];
  return (
    <div className="flex h-full w-full flex-col gap-3">
      {/* editor */}
      <div className="relative flex-1 overflow-hidden rounded-xl border hairline bg-ink-3/80">
        <div className="flex items-center gap-1.5 border-b hairline px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-paper/20" />
          <span className="h-2 w-2 rounded-full bg-paper/20" />
          <span className="h-2 w-2 rounded-full bg-paper/20" />
          <span className="ml-2 font-display text-[10px] tracking-[0.18em] text-mist">
            app/ship.ts
          </span>
        </div>
        <div className="space-y-2.5 p-4">
          {lines.map((l, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-3 text-right text-[9px] tabular-nums text-faint">
                {i + 1}
              </span>
              <motion.span
                className="block h-2 rounded-full"
                style={{
                  marginLeft: l.indent * 14,
                  background:
                    i === 2
                      ? accent
                      : "color-mix(in srgb, var(--color-paper) 22%, transparent)",
                }}
                initial={{ width: 0, opacity: 0 }}
                animate={
                  reduce
                    ? { width: l.w, opacity: 1 }
                    : { width: l.w, opacity: [0, 1] }
                }
                transition={{ duration: 0.5, delay: 0.15 + i * 0.14, ease }}
              />
            </div>
          ))}
          {/* caret */}
          {!reduce && (
            <motion.span
              className="ml-6 mt-0.5 inline-block h-3.5 w-[2px]"
              style={{ background: accent }}
              animate={{ opacity: [1, 1, 0, 0] }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          )}
        </div>
      </div>
      {/* pipeline */}
      <div className="flex items-center gap-2 rounded-xl border hairline bg-ink-3/60 px-3 py-3">
        {stages.map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-2">
            <motion.span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[9px]"
              style={{ borderColor: `${accent}55`, color: accent }}
              initial={{ opacity: 0.3 }}
              animate={
                reduce
                  ? { opacity: 1 }
                  : { opacity: [0.3, 1, 1], borderColor: [`${accent}33`, accent, `${accent}66`] }
              }
              transition={{
                duration: 2.4,
                delay: 0.6 + i * 0.5,
                repeat: reduce ? 0 : Infinity,
                repeatDelay: 1.4,
                ease,
              }}
            >
              ✓
            </motion.span>
            <span className="text-[10px] uppercase tracking-[0.14em] text-mist">
              {s}
            </span>
            {i < stages.length - 1 && (
              <span className="relative mx-1 h-px flex-1 overflow-hidden bg-paper/10">
                {!reduce && (
                  <motion.span
                    className="absolute inset-y-0 left-0 w-6 rounded-full"
                    style={{ background: `linear-gradient(90deg, transparent, ${accent})` }}
                    animate={{ left: ["-10%", "100%"] }}
                    transition={{
                      duration: 1.6,
                      delay: 1 + i * 0.5,
                      repeat: Infinity,
                      repeatDelay: 2,
                      ease,
                    }}
                  />
                )}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- 02 · Shared platform — hub & spokes service mesh ---------- */
export function PlatformExhibit({ accent }: ExhibitProps) {
  const reduce = useReducedMotion();
  const nodes = [
    { label: "Auth", x: 18, y: 20 },
    { label: "Payments", x: 82, y: 26 },
    { label: "Media", x: 20, y: 80 },
    { label: "Analytics", x: 80, y: 78 },
  ];
  const cx = 50;
  const cy = 50;
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border hairline bg-ink-3/70">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {nodes.map((n, i) => (
          <g key={n.label}>
            <line
              x1={cx}
              y1={cy}
              x2={n.x}
              y2={n.y}
              stroke={`${accent}33`}
              strokeWidth={0.4}
            />
            {!reduce && (
              <motion.circle
                r={0.9}
                fill={accent}
                initial={{ cx, cy }}
                animate={{ cx: [cx, n.x], cy: [cy, n.y], opacity: [0, 1, 0] }}
                transition={{
                  duration: 1.8,
                  delay: i * 0.45,
                  repeat: Infinity,
                  repeatDelay: 1.2,
                  ease,
                }}
              />
            )}
          </g>
        ))}
      </svg>

      {/* center hub */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="flex h-14 w-14 items-center justify-center rounded-2xl border text-center font-display text-[9px] leading-tight tracking-wide"
          style={{
            borderColor: `${accent}66`,
            color: accent,
            background: `radial-gradient(circle at 50% 30%, ${accent}22, transparent 70%), var(--color-ink-3)`,
          }}
          animate={reduce ? undefined : { boxShadow: [`0 0 0 0 ${accent}00`, `0 0 22px 2px ${accent}44`, `0 0 0 0 ${accent}00`] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        >
          Shared
          <br />
          platform
        </motion.div>
      </div>

      {/* satellite services */}
      {nodes.map((n, i) => (
        <motion.div
          key={n.label}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-lg border px-2.5 py-1 text-[10px] tracking-wide backdrop-blur-sm"
          style={{
            left: `${n.x}%`,
            top: `${n.y}%`,
            borderColor: `${accent}40`,
            color: "var(--color-paper)",
            background: "color-mix(in srgb, var(--color-ink) 55%, transparent)",
          }}
          animate={reduce ? undefined : { y: [0, i % 2 ? 3 : -3, 0] }}
          transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
        >
          {n.label}
        </motion.div>
      ))}
    </div>
  );
}

/* ---------- 03 · Design system — tokens & components ---------- */
export function DesignSystemExhibit({ accent }: ExhibitProps) {
  const reduce = useReducedMotion();
  const swatches = ["#d97706", "#e0402f", "#0d9488", "#4f46e5", "#181920"];
  return (
    <div className="flex h-full w-full flex-col gap-3">
      {/* token palette */}
      <div className="rounded-xl border hairline bg-ink-3/70 p-4">
        <span className="text-[9px] uppercase tracking-[0.18em] text-faint">
          Tokens
        </span>
        <div className="mt-2.5 flex gap-2">
          {swatches.map((c, i) => (
            <motion.span
              key={c}
              className="h-8 flex-1 rounded-md border border-paper/10"
              style={{ background: c }}
              initial={{ scaleY: 0.4, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease }}
            />
          ))}
        </div>
      </div>

      {/* component previews */}
      <div className="grid flex-1 grid-cols-2 gap-3">
        <div className="flex flex-col justify-center gap-2.5 rounded-xl border hairline bg-ink-3/70 p-4">
          <span className="text-[9px] uppercase tracking-[0.18em] text-faint">
            Button
          </span>
          <motion.span
            className="inline-flex w-fit items-center rounded-full px-3.5 py-1.5 text-[10px] font-medium text-ink"
            style={{ background: accent }}
            animate={reduce ? undefined : { boxShadow: [`0 0 0 0 ${accent}00`, `0 0 0 4px ${accent}22`, `0 0 0 0 ${accent}00`] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            Ship it →
          </motion.span>
          <span className="mt-1 inline-flex w-fit items-center rounded-full border px-3.5 py-1.5 text-[10px] text-mist" style={{ borderColor: `${accent}44` }}>
            Secondary
          </span>
        </div>
        <div className="flex flex-col justify-center gap-2 rounded-xl border hairline bg-ink-3/70 p-4">
          <span className="text-[9px] uppercase tracking-[0.18em] text-faint">
            Field
          </span>
          <div
            className="relative flex h-8 items-center rounded-lg border px-2.5"
            style={{ borderColor: `${accent}55` }}
          >
            <div className="h-1.5 w-1/2 rounded-full bg-paper/25" />
            {!reduce && (
              <motion.span
                className="absolute left-2.5 h-4 w-[2px]"
                style={{ background: accent }}
                animate={{ opacity: [1, 0, 1], left: ["0.6rem", "3rem", "0.6rem"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
          </div>
          <div className="mt-1 space-y-1.5">
            <div className="h-1.5 w-full rounded-full bg-paper/15" />
            <div className="h-1.5 w-3/4 rounded-full bg-paper/10" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- 04 · Applied AI — semantic search ---------- */
export function AppliedAIExhibit({ accent }: ExhibitProps) {
  const reduce = useReducedMotion();
  const results = [
    { w: "82%", score: 0.98 },
    { w: "68%", score: 0.94 },
    { w: "74%", score: 0.89 },
  ];
  const dots = [
    { x: 22, y: 30 },
    { x: 34, y: 62 },
    { x: 48, y: 24 },
    { x: 40, y: 44 },
    { x: 60, y: 58 },
    { x: 70, y: 34 },
  ];
  return (
    <div className="flex h-full w-full flex-col gap-3">
      {/* query bar */}
      <div
        className="flex items-center gap-2.5 rounded-xl border px-3 py-2.5"
        style={{ borderColor: `${accent}44` }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" strokeLinecap="round" />
        </svg>
        <div className="relative flex-1">
          <div className="h-1.5 w-2/5 rounded-full" style={{ background: `${accent}aa` }} />
          {!reduce && (
            <motion.span
              className="absolute top-1/2 h-3 w-[2px] -translate-y-1/2"
              style={{ background: accent }}
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
            />
          )}
        </div>
      </div>

      {/* embedding field */}
      <div className="relative h-16 overflow-hidden rounded-xl border hairline bg-ink-3/60">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {dots.map((d, i) => (
            <motion.circle
              key={i}
              r={1.4}
              fill={i < 3 ? accent : `${accent}66`}
              initial={{ cx: d.x, cy: d.y }}
              animate={reduce ? undefined : { cx: [d.x, d.x + (i % 2 ? 4 : -4), d.x], cy: [d.y, d.y + (i % 3 ? -3 : 3), d.y] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
          <motion.circle
            cx={41}
            cy={44}
            r={16}
            fill="none"
            stroke={`${accent}44`}
            strokeWidth={0.3}
            animate={reduce ? undefined : { r: [10, 20, 10], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* ranked results */}
      <div className="flex-1 space-y-2">
        {results.map((r, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-2.5 rounded-lg border hairline bg-ink-3/50 px-3 py-2"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.15, ease }}
          >
            <span className="text-[9px] tabular-nums" style={{ color: accent }}>
              {r.score.toFixed(2)}
            </span>
            <div className="h-1.5 rounded-full bg-paper/20" style={{ width: r.w }} />
            <span className="ml-auto h-2 w-2 rounded-full" style={{ background: i === 0 ? accent : `${accent}44` }} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
