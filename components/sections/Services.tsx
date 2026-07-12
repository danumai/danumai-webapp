"use client";

import { useId, useState } from "react";
import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { DEFAULT_CONTENT, type ServicesContent, type ServiceCategory } from "@/lib/content";

export default function Services({
  content = DEFAULT_CONTENT.services,
}: {
  content?: ServicesContent;
}) {
  const categories = content.categories;
  if (categories.length === 0) return null;

  return (
    <section id="services" className="wash-gold scroll-mt-24 border-t section-edge">
      <div className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
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
            <p className="max-w-md text-sm leading-relaxed text-mist">
              {content.intro}
            </p>
          </Reveal>
        </div>

        {/* Catalogue grid */}
        <div className="mt-14 grid grid-cols-1 gap-5 md:mt-20 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <Reveal key={c.n} delay={0.06 * i}>
              <ServiceCard c={c} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ c }: { c: ServiceCategory }) {
  const [flipped, setFlipped] = useState(false);
  const backId = useId();
  // No detail points → nothing to flip to; the card stays the original static tile.
  const canFlip = Boolean(c.details?.length);

  // Soft radial highlight that tracks the cursor on whichever face is showing.
  const trackGlow = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  // Shared accent + beam custom properties — identical to the original card.
  const accentVars = {
    "--card-accent": c.accent,
    // animated halo border (revealed on hover) tinted to the card accent,
    // fading into transparency so it reads as a sweeping arc, not a ring
    "--beam-color": c.accent,
    "--beam-color-2": `${c.accent}00`,
    "--beam-width": "1.5px",
    "--beam-speed": "5.5s",
  } as React.CSSProperties;

  const frontBody = (
    <>
      <div className="flex items-baseline gap-3">
        <span
          className="font-display text-sm italic transition-transform duration-500 group-hover:-translate-y-0.5"
          style={{ color: c.accent }}
        >
          {c.n}
        </span>
        <h3 className="font-display text-xl tracking-tight text-paper md:text-2xl">
          {c.title}
        </h3>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-mist">{c.body}</p>

      <ul className="mt-6 flex flex-wrap gap-2">
        {c.items.map((item, i) => (
          <li
            key={item}
            className="service-chip rounded-full px-3 py-1 text-[11px] tracking-[0.04em] text-mist will-change-transform"
            style={{ transitionDelay: `${i * 40}ms` }}
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );

  // Original card, unchanged, when there's nothing to flip to.
  if (!canFlip) {
    return (
      <SpotlightCard
        style={accentVars}
        className="card card-hover card-topline beam flex h-full flex-col p-6 md:p-7"
      >
        {frontBody}
      </SpotlightCard>
    );
  }

  return (
    <div className={`flip ${flipped ? "is-flipped" : ""}`}>
      <div className="flip-inner">
        {/* ---- FRONT: the original card surface, class-for-class the same.
             accentVars live ON the .card element (not the wrapper): .card
             declares its own neutral --card-accent, which would beat an
             inherited value — inline here wins, exactly like the original. */}
        <div
          onMouseMove={trackGlow}
          onClick={() => setFlipped(true)}
          aria-hidden={flipped}
          style={accentVars}
          className="flip-face flip-front group card card-hover card-topline beam relative flex h-full cursor-pointer flex-col overflow-hidden p-6 md:p-7"
        >
          <span
            aria-hidden
            className="cursor-glow pointer-events-none absolute inset-0 z-0 rounded-[inherit]"
          />
          <div className="relative z-10 flex h-full flex-col">
            {frontBody}
            <div className="mt-auto pt-6">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFlipped(true);
                }}
                aria-expanded={flipped}
                aria-controls={backId}
                tabIndex={flipped ? -1 : 0}
                className="flip-toggle inline-flex items-center gap-2 rounded-full border border-hairline-strong/60 px-3.5 py-1.5 text-[11px] uppercase tracking-[0.18em] text-mist"
              >
                Details
                <ArrowIcon className="flip-toggle-icon" />
              </button>
            </div>
          </div>
        </div>

        {/* ---- BACK: the detailed description ---- */}
        <div
          id={backId}
          onMouseMove={trackGlow}
          onClick={() => setFlipped(false)}
          aria-hidden={!flipped}
          style={accentVars}
          className="flip-back flip-face group card card-topline beam relative flex h-full cursor-pointer flex-col overflow-hidden p-6 md:p-7"
        >
          <span
            aria-hidden
            className="cursor-glow pointer-events-none absolute inset-0 z-0 rounded-[inherit]"
          />
          <div className="relative z-10 flex h-full flex-col">
            <div className="flex items-baseline gap-3">
              <span
                className="font-display text-sm italic"
                style={{ color: c.accent }}
              >
                {c.n}
              </span>
              <h3 className="font-display text-lg tracking-tight text-paper md:text-xl">
                {c.title}
              </h3>
            </div>

            <ul className="mt-5 flex flex-col gap-3">
              {c.details?.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span
                    className="detail-badge mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full"
                    aria-hidden
                  >
                    <CheckIcon />
                  </span>
                  <span className="text-[13px] leading-relaxed text-mist">
                    {point}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-6">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFlipped(false);
                }}
                aria-expanded={flipped}
                aria-controls={backId}
                tabIndex={flipped ? 0 : -1}
                className="flip-toggle inline-flex items-center gap-2 rounded-full border border-hairline-strong/60 px-3.5 py-1.5 text-[11px] uppercase tracking-[0.18em] text-mist"
              >
                <ArrowIcon className="flip-toggle-icon flip-toggle-icon--back" />
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden viewBox="0 0 12 12" width="10" height="10" fill="none">
      <path
        d="M2.5 6.2 5 8.6l4.5-5.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      width="12"
      height="12"
      fill="none"
      className={className}
    >
      <path
        d="M3 8h9M8.5 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
