"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";
import CountUp from "@/components/ui/CountUp";
import Reveal from "@/components/ui/Reveal";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { DEFAULT_CONTENT, type StatsContent } from "@/lib/content";

export default function Stats({
  content = DEFAULT_CONTENT.stats,
}: {
  content?: StatsContent;
}) {
  const stats = content.items;
  const reduce = useReducedMotion();

  return (
    <section className="section-band wash-gold border-t section-edge">
      <div className="mx-auto max-w-6xl px-6 py-14 md:px-10 md:py-24">
        <dl className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1} className="h-full">
              {/* Continuous, staggered idle float on an outer wrapper so the
                  grid gently breathes; the hover-lift transform lives on the
                  inner .card element, so the two never fight. */}
              <motion.div
                className="h-full"
                animate={reduce ? undefined : { y: [0, -8, 0] }}
                transition={{
                  duration: 5.5 + i * 0.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.35,
                }}
              >
                <SpotlightCard
                  className="card card-hover card-topline beam beam-always h-full p-4 sm:p-6 md:p-7"
                  style={
                    {
                      "--card-accent": s.accent,
                      "--beam-color": s.accent,
                      "--beam-color-2": `${s.accent}00`,
                      "--beam-width": "1.5px",
                    } as CSSProperties
                  }
                >
                  <span
                    aria-hidden
                    className="mb-3 block text-[11px] font-medium tracking-[0.2em] sm:mb-6 sm:text-xs"
                    style={{ color: s.accent }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <dd className="font-display text-3xl tracking-tight text-paper sm:text-5xl md:text-6xl">
                    <CountUp value={s.value} suffix={s.suffix} />
                  </dd>
                  <dt className="mt-2 text-xs leading-relaxed text-mist sm:mt-3 sm:text-sm">
                    {s.label}
                  </dt>
                </SpotlightCard>
              </motion.div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
