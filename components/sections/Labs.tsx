"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";
import {
  AppliedAIExhibit,
  DesignSystemExhibit,
  PlatformExhibit,
  ProductExhibit,
} from "./labs/exhibits";
import { DEFAULT_CONTENT, type LabsContent, type LabsCapability } from "@/lib/content";

type Capability = {
  n: string;
  title: string;
  body: string;
  tags: readonly string[];
  /** Cinematic Prism family used on the light canvas. */
  accent: string;
  Exhibit: ComponentType<{ accent: string }>;
};

// The bespoke visual exhibits are code, not content — each capability is paired
// with one by its position in the list, so editors can retitle/reorder the
// capabilities while the art follows along.
const EXHIBITS: ComponentType<{ accent: string }>[] = [
  ProductExhibit,
  PlatformExhibit,
  DesignSystemExhibit,
  AppliedAIExhibit,
];

function toCapabilities(items: LabsCapability[]): Capability[] {
  return items.map((c, i) => ({
    n: c.n,
    title: c.title,
    body: c.body,
    tags: c.tags,
    accent: c.accent,
    Exhibit: EXHIBITS[i % EXHIBITS.length],
  }));
}

const CYCLE_MS = 5200;
const ease = [0.16, 1, 0.3, 1] as const;

export default function Labs({
  content = DEFAULT_CONTENT.labs,
}: {
  content?: LabsContent;
}) {
  const capabilities = toCapabilities(content.capabilities);
  const count = capabilities.length;
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  // Auto-advance through capabilities; pause on hover/focus or reduced motion.
  useEffect(() => {
    if (reduce || paused) return;
    timer.current = setTimeout(
      () => setActive((a) => (a + 1) % count),
      CYCLE_MS,
    );
    return clear;
  }, [active, paused, reduce, clear, count]);

  const select = (i: number) => {
    clear();
    setActive(i);
  };

  if (count === 0) return null;
  const current = capabilities[Math.min(active, count - 1)];
  const accent = current.accent;

  return (
    <section id="labs" className="wash-emerald scroll-mt-24 border-t section-edge">
      <div className="mx-auto max-w-6xl px-6 pt-24 pb-12 md:px-10 md:pt-32 md:pb-14">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <Reveal>
              <p className="text-xs uppercase tracking-[0.3em] text-copper">
                {content.eyebrow}
              </p>
            </Reveal>
            <WordReveal
              text={content.heading}
              accentWords={content.accentWords}
              className="mt-5 max-w-2xl font-display text-3xl tracking-tight text-paper md:text-5xl"
            />
          </div>
          <Reveal delay={0.25}>
            <p className="max-w-xs text-sm leading-relaxed text-mist">
              {content.intro}
            </p>
          </Reveal>
        </div>

        {/* Interactive console */}
        <Reveal delay={0.15}>
          <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
            className="mt-14 grid grid-cols-1 gap-4 md:mt-20 md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] md:gap-6"
          >
            {/* Left — selectable capability stack */}
            <ul className="flex flex-col gap-2.5">
              {capabilities.map((c, i) => (
                <LayerRow
                  key={c.n}
                  c={c}
                  accent={c.accent}
                  active={i === active}
                  paused={paused}
                  reduce={!!reduce}
                  onSelect={() => select(i)}
                />
              ))}
            </ul>

            {/* Right — live viewport */}
            <div
              style={
                {
                  borderColor: `${accent}33`,
                  background: `radial-gradient(120% 90% at 100% 0%, ${accent}18, transparent 55%), var(--color-surface)`,
                  boxShadow: `0 44px 110px -46px var(--app-venture-drop), 0 0 0 1px ${accent}1a inset`,
                  transition: "border-color 0.6s ease, background 0.6s ease",
                  "--beam-color": accent,
                  "--beam-color-2": `${accent}00`,
                  "--beam-width": "1.5px",
                  "--beam-speed": "6s",
                } as React.CSSProperties
              }
              className="beam beam-always relative flex min-h-105 flex-col overflow-hidden rounded-3xl border p-4 sm:p-5 md:p-6"
            >
              {/* chrome bar */}
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-paper/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-paper/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-paper/15" />
                <span
                  className="ml-2 font-display text-[11px] tracking-[0.16em] transition-colors duration-500"
                  style={{ color: accent }}
                >
                  labs/{current.title.toLowerCase().replace(/ /g, "-")}
                </span>
                <span className="ml-auto text-[10px] tabular-nums text-faint">
                  {current.n} / {String(capabilities.length).padStart(2, "0")}
                </span>
              </div>

              {/* exhibit stage */}
              <div className="relative flex-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.n}
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
                    transition={{ duration: 0.45, ease }}
                    className="absolute inset-0"
                  >
                    <current.Exhibit accent={accent} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function LayerRow({
  c,
  accent,
  active,
  paused,
  reduce,
  onSelect,
}: {
  c: Capability;
  accent: string;
  active: boolean;
  paused: boolean;
  reduce: boolean;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={active}
        style={{
          borderColor: active ? `${accent}4d` : "var(--color-hairline)",
          background: active
            ? `radial-gradient(140% 100% at 0% 0%, ${accent}16, transparent 60%), var(--color-surface)`
            : "transparent",
        }}
        className="group relative block w-full overflow-hidden rounded-2xl border p-5 text-left transition-colors duration-500 hover:border-paper/15"
      >
        {/* active accent rail */}
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-[3px] origin-top transition-transform duration-500"
          style={{
            background: accent,
            transform: `scaleY(${active ? 1 : 0})`,
          }}
        />
        {/* auto-advance progress underline */}
        {active && !reduce && !paused && (
          <motion.span
            aria-hidden
            className="absolute bottom-0 left-0 h-px"
            style={{ background: accent }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: CYCLE_MS / 1000, ease: "linear" }}
          />
        )}

        <div className="flex items-baseline gap-3">
          <span
            className="font-display text-sm italic transition-colors duration-500"
            style={{ color: active ? accent : "var(--color-faint)" }}
          >
            {c.n}
          </span>
          <h3
            className="font-display text-lg tracking-tight transition-colors duration-500 md:text-xl"
            style={{
              color: active ? "var(--color-paper)" : "var(--color-mist)",
            }}
          >
            {c.title}
          </h3>
          <span
            aria-hidden
            className="ml-auto translate-x-1 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100"
            style={{ color: accent, opacity: active ? 1 : undefined }}
          >
            →
          </span>
        </div>

        {/* body + tags reveal only when active — keeps the stack calm */}
        <div
          className="grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            gridTemplateRows: active ? "1fr" : "0fr",
            opacity: active ? 1 : 0,
          }}
        >
          <div className="overflow-hidden">
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-mist">
              {c.body}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {c.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-mist"
                  style={{
                    borderColor: `${accent}2e`,
                    background: `${accent}0d`,
                  }}
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </button>
    </li>
  );
}
