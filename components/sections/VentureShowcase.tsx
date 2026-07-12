"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, type CSSProperties, type ComponentType } from "react";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";
import { CareArt, ImageArt, ReelsArt, StudiosArt } from "./showcase/artworks";
import type { Project } from "@/lib/data/projects";
import { DEFAULT_CONTENT, type VenturesHeaderContent } from "@/lib/content";

type Venture = {
  index: string;
  name: string;
  tagline: string;
  description: string;
  status: string;
  features: string[];
  accent: string;
  Art: ComponentType;
};

// Hand-built exhibits for the three original ventures, keyed by slug — kept
// so admin-managed content for these three still gets the bespoke art.
const HAND_BUILT_ART: Record<string, ComponentType> = {
  banglareels: ReelsArt,
  "danumai-studios": StudiosArt,
  "care-technology": CareArt,
};

const defaultVentures: Venture[] = [
  {
    index: "01",
    name: "BanglaReels",
    tagline: "Short-form streaming for the Bangla-speaking world",
    description:
      "A vertical micro-drama platform built for how 300 million people actually watch — serialized stories, episode by episode, in their own language.",
    status: "In development",
    features: ["Vertical serials", "Episode unlocks", "Creator tooling", "Offline-first"],
    accent: "#e11d48", // crimson rose
    Art: ReelsArt,
  },
  {
    index: "02",
    name: "Danumai Studios",
    tagline: "Original stories, produced in-house",
    description:
      "The content engine behind our platforms. We write, produce, and own the serials we stream — no licensing, no middlemen, full creative control.",
    status: "In development",
    features: ["Writers' room", "Vertical-first production", "Owned IP", "Fast cycles"],
    accent: "#7c3aed", // creative violet
    Art: StudiosArt,
  },
  {
    index: "03",
    name: "Care Technology",
    tagline: "Software for the people who look after people",
    description:
      "Tools that give caregivers time back — scheduling, coordination, and communication built around the realities of care work, not around billing codes.",
    status: "Research",
    features: ["Shift coordination", "Family updates", "Care logs", "Gentle reminders"],
    accent: "#0d9488", // studio teal
    Art: CareArt,
  },
];

function toVentures(projects: Project[]): Venture[] {
  return projects.map((p, i) => ({
    index: String(i + 1).padStart(2, "0"),
    name: p.name,
    tagline: p.tagline,
    description: p.description,
    status: p.status,
    features: p.features,
    accent: p.accent,
    Art:
      HAND_BUILT_ART[p.slug] ??
      (() => <ImageArt imageUrl={p.imageUrl} name={p.name} />),
  }));
}

export default function VentureShowcase({
  projects,
  header = DEFAULT_CONTENT.ventures,
}: {
  projects?: Project[];
  header?: VenturesHeaderContent;
}) {
  const ventures = projects && projects.length > 0 ? toVentures(projects) : defaultVentures;
  const N = ventures.length;
  const trackUnits = (N - 1) * CHUNK; // e.g. 2.1 → 210vh for 3 cards
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLDivElement>(null);

  // Progress through the card list — drives each card's arrival, dwell,
  // and settle-back entirely via JS transforms (see DeckCard below).
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start start", "end end"],
  });

  const headerEl = (
    <div>
      <Reveal>
        <p className="text-xs uppercase tracking-[0.3em] text-copper">{header.eyebrow}</p>
      </Reveal>
      <WordReveal
        text={header.heading}
        accentWords={header.accentWords}
        className="mt-4 max-w-2xl font-display text-3xl tracking-tight text-paper md:text-5xl"
      />
      <Reveal delay={0.25}>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-mist sm:text-base">
          {header.intro}
        </p>
      </Reveal>
    </div>
  );

  // Reduced-motion / no-JS-friendly fallback: a plain stacked list.
  if (reduce) {
    return (
      <section id="ventures" className="wash-indigo scroll-mt-24">
        <div className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
          {headerEl}
          <div className="mt-20 flex flex-col gap-8">
            {ventures.map((v) => (
              <VentureCard key={v.name} v={v} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="ventures" className="relative scroll-mt-24">
      {/* Pinned wash: a viewport-tall gradient layer that sticks in place while
          the deck scrolls, so the background holds steady instead of sliding
          and shifting shade as the tall track passes behind it. It's masked to
          fade out top and bottom, and — crucially — the wrapper fills the
          section and clips (overflow-hidden), so the indigo is physically
          bounded to the ventures section and can never hang below into Stats
          or Approach once the sticky release parks it at the section's end. */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          aria-hidden
          className="wash-indigo sticky left-0 top-0 h-svh w-full [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]"
        />
      </div>

      {/* Scroll-driven deck: header and cards are pinned together in one
          stage, so the copy stays put instead of leaving dead space behind
          once it scrolls out of view. Track height = travel budget, no
          dead scroll. */}
      <div
        ref={listRef}
        style={{ height: `${trackUnits * 100}vh` }}
        className="relative"
      >
        <div className="isolate sticky top-0 flex h-svh flex-col justify-center gap-8 overflow-hidden py-16 md:gap-16 md:py-32">
          <div className="mx-auto w-full max-w-6xl px-6 md:px-10">{headerEl}</div>
          <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
            <div className="relative h-108 sm:h-120 md:h-[min(30rem,72svh)]">
              {ventures.map((v, i) => (
                <DeckCard
                  key={v.name}
                  v={v}
                  i={i}
                  n={N}
                  trackUnits={trackUnits}
                  progress={scrollYProgress}
                />
              ))}
            </div>

            {/* Deck progress — one pill per venture, the active one stretching
                and lighting to its own accent as its card takes the front. */}
            <div className="mt-8 flex items-center justify-center gap-2.5">
              {ventures.map((v, i) => (
                <DeckDot
                  key={v.name}
                  i={i}
                  n={N}
                  accent={v.accent}
                  trackUnits={trackUnits}
                  progress={scrollYProgress}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- deck timing ----------
   The track is measured in "units" (1 unit ≈ 100vh of scroll). Each
   incoming card gets TRAVEL units of movement plus DWELL units at rest,
   so the deck finishes with a short hold and releases without dead space. */
const TRAVEL = 0.7;
const DWELL = 0.35;
const CHUNK = TRAVEL + DWELL;

const ENTER_FROM = 620; // px below its slot a card starts
const PEEK = 16; // px of tinted top edge each buried card shows
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
// How far card j (j ≥ 1) has travelled into place, 0..1.
const arrival = (p: number, j: number, trackUnits: number) =>
  j <= 0 ? 1 : clamp01((p * trackUnits - (j - 1) * CHUNK) / TRAVEL);

function DeckCard({
  v,
  i,
  n,
  trackUnits,
  progress,
}: {
  v: Venture;
  i: number;
  n: number;
  trackUnits: number;
  progress: MotionValue<number>;
}) {
  // Depth = how many later cards have landed on top (continuous 0..N-1-i).
  // The front card is always full size; buried cards recede up + back so
  // only their tinted top edge peeks above the card in front.
  const y = useTransform(progress, (p) => {
    const enter = i === 0 ? 0 : (1 - arrival(p, i, trackUnits)) * ENTER_FROM;
    let depth = 0;
    for (let j = i + 1; j < n; j++) depth += arrival(p, j, trackUnits);
    return enter - depth * PEEK;
  });
  const scale = useTransform(progress, (p) => {
    let depth = 0;
    for (let j = i + 1; j < n; j++) depth += arrival(p, j, trackUnits);
    return 1 - depth * 0.04;
  });
  const dim = useTransform(progress, (p) => {
    let depth = 0;
    for (let j = i + 1; j < n; j++) depth += arrival(p, j, trackUnits);
    return Math.min(0.55, depth * 0.38);
  });

  return (
    <motion.div
      style={{ y, scale, zIndex: i + 1 }}
      className="absolute inset-0 origin-top will-change-transform"
    >
      <div className="relative h-full">
        <VentureCard v={v} />
        {/* veil: buried cards read clearly as behind, tint still visible */}
        <motion.div
          aria-hidden
          style={{ opacity: dim }}
          className="pointer-events-none absolute inset-0 rounded-3xl bg-ink"
        />
      </div>
    </motion.div>
  );
}

/* ---------- deck progress dot ----------
   "Frontness" of card i is how far it has arrived minus how far the next card
   has arrived — a smooth 0..1 that peaks when card i owns the front of the
   deck. The pill widens and lights to the venture's accent at its peak. */
function DeckDot({
  i,
  n,
  accent,
  trackUnits,
  progress,
}: {
  i: number;
  n: number;
  accent: string;
  trackUnits: number;
  progress: MotionValue<number>;
}) {
  const frontness = useTransform(progress, (p) => {
    const here = arrival(p, i, trackUnits);
    const next = i + 1 < n ? arrival(p, i + 1, trackUnits) : 0;
    return clamp01(here - next);
  });
  const width = useTransform(frontness, [0, 1], [8, 30]);
  const opacity = useTransform(frontness, [0, 1], [0.3, 1]);
  const bg = useTransform(frontness, (f) =>
    f > 0.5 ? accent : "currentColor",
  );

  return (
    <motion.span
      aria-hidden
      style={{ width, opacity, backgroundColor: bg }}
      className="h-2 rounded-full text-mist"
    />
  );
}

/* ---------- the venture card itself ---------- */
function VentureCard({ v }: { v: Venture }) {
  const accent = v.accent;
  const cardBg = `radial-gradient(120% 90% at 100% 0%, ${accent}70, transparent 68%), linear-gradient(158deg, ${accent}48, ${accent}24 55%, transparent 88%), linear-gradient(0deg, ${accent}16, ${accent}16), var(--color-surface)`;
  const cardBorder = `${accent}70`;
  const cardRing = `${accent}45`;
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Cursor-driven 3D tilt: the card leans a few degrees toward the pointer and
  // springs back level on exit, so it reads as a physical panel catching the
  // light rather than a flat rectangle. Held subtle so the copy stays legible.
  // The transform lives on an outer wrapper, leaving the tinted card surface as
  // the plane that tilts.
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const spring = { stiffness: 160, damping: 18, mass: 0.5 } as const;
  const srotX = useSpring(rotX, spring);
  const srotY = useSpring(rotY, spring);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
    if (reduce) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotY.set((px - 0.5) * 13);
    rotX.set((0.5 - py) * 13);
  };
  const onMouseLeave = () => {
    rotX.set(0);
    rotY.set(0);
  };

  return (
    <motion.div
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        rotateX: reduce ? 0 : srotX,
        rotateY: reduce ? 0 : srotY,
        transformPerspective: 1200,
      }}
      className="h-full will-change-transform"
    >
    <div
      ref={ref}
      style={{
        borderColor: cardBorder,
        background: cardBg,
        boxShadow: `0 44px 110px -42px var(--app-venture-drop), 0 1px 0 0 var(--app-card-inset) inset, 0 0 0 1px ${cardRing} inset`,
        // beam ring inherits this venture's own accent, so the lit edge that
        // sweeps the card on hover is coloured to the card, not the brand default
        "--beam-color": accent,
        "--beam-color-2": `${accent}00`,
        "--beam-width": "1.5px",
      } as CSSProperties}
      className="beam group relative grid h-full grid-cols-1 gap-4 overflow-hidden rounded-3xl border p-4 sm:gap-6 sm:p-5 md:grid-cols-2 md:gap-8 md:p-6"
    >
      {/* accent spotlight that trails the cursor */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(340px circle at var(--mx, 50%) var(--my, 50%), ${accent}24, transparent 62%)`,
        }}
      />

      {/* accent hairline along the top edge — what peeks when stacked */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        }}
      />

      {/* Art */}
      <div className="relative z-10 h-32 overflow-hidden rounded-2xl border hairline bg-ink-3 sm:h-44 md:h-full md:max-h-80">
        <v.Art />
      </div>

      {/* Copy */}
      <div className="relative z-10 flex flex-col justify-center">
        <div className="flex items-center justify-between gap-3">
          <span className="font-display text-xs" style={{ color: accent }}>
            {v.index}
          </span>
          <span
            className="rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.15em] backdrop-blur-sm"
            style={{
              borderColor: `${accent}40`,
              color: accent,
              background: `${accent}12`,
            }}
          >
            {v.status}
          </span>
        </div>
        <h3 className="mt-1.5 font-display text-xl tracking-tight text-paper sm:text-2xl md:mt-2 md:text-[1.75rem]">
          {v.name}
        </h3>
        <p className="mt-1 text-xs sm:text-sm" style={{ color: `${accent}cc` }}>
          {v.tagline}
        </p>
        <p className="mt-2.5 max-w-md text-sm leading-relaxed text-mist line-clamp-3 md:mt-3 md:line-clamp-none">
          {v.description}
        </p>
        <ul className="mt-4 flex flex-wrap gap-1.5 sm:gap-2 md:mt-5">
          {v.features.map((f) => (
            <li
              key={f}
              className="venture-pill rounded-full border px-3 py-1 text-xs text-mist sm:px-3.5 sm:py-1.5"
              style={{ "--pill": accent } as CSSProperties}
            >
              {f}
            </li>
          ))}
        </ul>
        <Link
          href={`/contact?topic=${encodeURIComponent(v.name)}`}
          className="group mt-4 inline-flex w-fit items-center gap-2 text-sm transition-colors md:mt-6"
          style={{ color: accent }}
        >
          Discuss this venture
          <span
            aria-hidden
            className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>
    </div>
    </motion.div>
  );
}

