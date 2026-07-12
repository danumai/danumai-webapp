"use client";

import {
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

export type Principle = {
  title: string;
  body: string;
  accent: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;
/** How long each step holds the focus before the cycle advances. */
const DWELL = 3200;

/**
 * The three Danumai principles — Conceived / Built / Operated — as a live,
 * self-advancing stepper. Focus travels 01 → 02 → 03 and loops: the active
 * card lifts and lights its accent while the others recede, the conductor line
 * fills to the active node, and a progress bar times each step. Hovering any
 * card takes over the focus and pauses the cycle. Auto-advance and the ambient
 * pulses are disabled under prefers-reduced-motion.
 */
export default function PrincipleCards({
  principles,
}: {
  principles: Principle[];
}) {
  const reduce = useReducedMotion();
  const n = principles.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-advance the focus while idle. Hover pauses; reduced motion opts out.
  useEffect(() => {
    if (reduce || paused) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % n);
    }, DWELL);
    return () => window.clearInterval(id);
  }, [reduce, paused, n]);

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.26, delayChildren: 0.12 },
    },
  };

  return (
    <motion.div
      className="relative mt-14"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, margin: "-80px" }}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {principles.map((p, i) => (
          <Card
            key={p.title}
            principle={p}
            index={i}
            reduce={!!reduce}
            active={i === active}
            dimmed={!reduce && !paused && i !== active}
            paused={paused}
            count={n}
            onFocus={() => {
              setPaused(true);
              setActive(i);
            }}
            onBlur={() => setPaused(false)}
          />
        ))}
      </div>
    </motion.div>
  );
}

function Card({
  principle,
  index,
  count,
  reduce,
  active,
  dimmed,
  paused,
  onFocus,
  onBlur,
}: {
  principle: Principle;
  index: number;
  count: number;
  reduce: boolean;
  active: boolean;
  dimmed: boolean;
  paused: boolean;
  onFocus: () => void;
  onBlur: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { title, body, accent } = principle;

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  // Fan-deal entrance: the cards start gathered and twisted around a pivot at
  // their bottom edge (as if pinched between two fingers), then untwist and
  // spread out to their upright grid positions. `offset` is the card's signed
  // distance from the centre card, driving its initial rotation and drift.
  const offset = index - (count - 1) / 2;
  const item: Variants = {
    hidden: reduce
      ? { opacity: 0 }
      : {
          opacity: 0,
          y: 26,
          scale: 0.9,
          // Side cards fan outward and overlap the centre card, all pivoting
          // from a shared point at the bottom — a held hand of three cards.
          rotate: offset * 21,
          x: `${-offset * 76}%`,
          filter: "blur(6px)",
        },
    show: reduce
      ? { opacity: 1 }
      : {
          opacity: 1,
          y: 0,
          scale: 1,
          rotate: 0,
          x: "0%",
          filter: "blur(0px)",
          transition: { duration: 1.7, ease: EASE },
        },
  };

  // Whether the auto-progress bar should run: this card is the active step and
  // the cycle isn't paused/reduced.
  const timing = active && !paused && !reduce;

  return (
    <motion.div
      variants={item}
      // Centre card stacks on top while the fan is gathered.
      style={{ zIndex: 20 - Math.round(Math.abs(offset) * 4) }}
      className="relative h-full origin-[50%_100%]"
    >
      <motion.div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseEnter={onFocus}
        onMouseLeave={onBlur}
        onFocus={onFocus}
        onBlur={onBlur}
        tabIndex={0}
        style={{
          ["--card-accent" as string]: accent,
          // Crisp, playing-card corners instead of the default pill radius.
          borderRadius: "0.375rem",
          borderColor: active
            ? `color-mix(in srgb, ${accent} 55%, transparent)`
            : undefined,
        }}
        className="card card-topline group relative flex h-full flex-col overflow-hidden p-6 outline-none md:p-7"
        animate={
          reduce
            ? {}
            : {
                y: active ? -6 : 0,
                opacity: dimmed ? 0.5 : 1,
                filter: dimmed ? "blur(0.4px)" : "blur(0px)",
              }
        }
        transition={{ duration: 0.6, ease: EASE }}
      >
        {/* Accent spotlight — brightens while this step holds focus. */}
        <motion.span
          aria-hidden
          className="absolute inset-0 z-0 rounded-[inherit]"
          style={{
            background: `radial-gradient(320px circle at var(--mx,50%) var(--my,50%), color-mix(in srgb, ${accent} 20%, transparent), transparent 66%)`,
          }}
          animate={{ opacity: active ? 1 : 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        />

        <div className="relative z-10 flex h-full flex-col">
          {/* Index node — lights and rings out while active. */}
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            {active && !reduce && (
              <motion.span
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: accent }}
                initial={{ opacity: 0.5, scale: 1 }}
                animate={{ opacity: 0, scale: 3 }}
                transition={{
                  duration: 1.8,
                  ease: "easeOut",
                  repeat: Infinity,
                }}
              />
            )}
            <motion.span
              className="relative h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: accent }}
              animate={{
                boxShadow: active
                  ? `0 0 0 5px color-mix(in srgb, ${accent} 20%, transparent)`
                  : `0 0 0 4px color-mix(in srgb, ${accent} 10%, transparent)`,
                scale: active ? 1.15 : 1,
              }}
              transition={{ duration: 0.5, ease: EASE }}
            />
          </span>

          <div className="mt-5 flex items-baseline gap-3">
            <motion.span
              aria-hidden
              className="font-display text-5xl leading-none tracking-tight md:text-6xl"
              style={{
                color: "transparent",
                background: `linear-gradient(180deg, ${accent}, color-mix(in srgb, ${accent} 55%, var(--color-mist)))`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
              }}
              animate={{
                filter: active
                  ? `drop-shadow(0 10px 30px color-mix(in srgb, ${accent} 40%, transparent))`
                  : `drop-shadow(0 8px 26px color-mix(in srgb, ${accent} 10%, transparent))`,
              }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              {String(index + 1).padStart(2, "0")}
            </motion.span>
          </div>

          <h3 className="mt-5 text-xs font-medium uppercase tracking-[0.24em] text-paper">
            <span className="relative inline-block pb-2">
              {title}
              {/* underline that draws across the exact width of the title
                  while this card holds focus. */}
              <motion.span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-px origin-left"
                style={{ backgroundColor: accent }}
                animate={{ scaleX: active ? 1 : 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              />
            </span>
          </h3>

          <p className="mt-3 text-sm leading-relaxed text-mist">{body}</p>

          {/* Progress bar — anchored to the card foot; only the active step's
              accent fill is visible (no idle track), so quiet cards stay clean. */}
          <div className="mt-auto w-full pt-6">
            <motion.span
              className="block h-0.5 w-full origin-left rounded-full"
              style={{ backgroundColor: accent }}
              // Re-key on each activation so the fill remounts and restarts from 0.
              key={timing ? `run-${index}` : `idle-${index}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: active ? 1 : 0 }}
              transition={
                timing
                  ? { duration: DWELL / 1000, ease: "linear" }
                  : { duration: 0.4, ease: EASE }
              }
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
