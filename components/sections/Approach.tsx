"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";
import { DEFAULT_CONTENT, type ApproachContent } from "@/lib/content";

export default function Approach({
  content = DEFAULT_CONTENT.approach,
}: {
  content?: ApproachContent;
}) {
  const principles = content.principles;
  const listRef = useRef<HTMLOListElement>(null);
  const lastNodeRef = useRef<HTMLLIElement>(null);
  const reduce = useReducedMotion();
  // Spine ends exactly at the last node's dot rather than the list's bottom
  // edge, so it never dangles into the next section — regardless of how the
  // copy wraps on narrow screens. Measured on mount and on any resize.
  const [spineHeight, setSpineHeight] = useState<number>(0);
  useEffect(() => {
    const measure = () => {
      const ol = listRef.current;
      const last = lastNodeRef.current;
      if (!ol || !last) return;
      // Distance from the list top to the last node's dot centre.
      setSpineHeight(last.offsetTop + 7);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (listRef.current) ro.observe(listRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);
  // Timeline spine grows with reading position.
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 0.75", "end 0.55"],
  });
  const lineScale = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    restDelta: 0.001,
  });

  return (
    <section id="approach" className="section-band wash-cyan scroll-mt-24 border-t section-edge">
      <div className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_1.6fr]">
          <div className="md:sticky md:top-28 md:self-start">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.3em] text-copper">
                {content.eyebrow}
              </p>
            </Reveal>
            <WordReveal
              text={content.heading}
              accentWords={content.accentWords}
              className="mt-5 font-display text-3xl tracking-tight text-paper md:text-4xl"
            />
          </div>

          <div className="relative">
            {/* Growing spine — height is measured to stop at the last node's
                dot, so the timeline terminates cleanly and never bleeds into
                the next section on any screen size. */}
            <div
              aria-hidden
              style={{ height: spineHeight || undefined }}
              className="absolute left-[7px] top-[0.4em] w-px bg-paper/8"
            />
            <motion.div
              aria-hidden
              style={{
                height: spineHeight || undefined,
                ...(reduce ? { scaleY: 1 } : { scaleY: lineScale }),
              }}
              className="absolute left-[7px] top-[0.4em] w-px origin-top bg-copper/60"
            />

            <ol ref={listRef} className="space-y-0">
              {principles.map((p, i) => (
                <PrincipleNode
                  key={p.n}
                  p={p}
                  i={i}
                  n={principles.length}
                  progress={lineScale}
                  reduce={!!reduce}
                  liRef={
                    i === principles.length - 1 ? lastNodeRef : undefined
                  }
                />
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

/* A single timeline entry that lights as the spine reaches it. The spine's
   growth (`progress`, 0→1 across the list) is compared against this node's
   fractional position, so the dot fills + haloes and the copy resolves from
   dim exactly as the copper line arrives — a reading spotlight moving down the
   principles rather than four independent pop-ins. */
function PrincipleNode({
  p,
  i,
  n,
  progress,
  reduce,
  liRef,
}: {
  p: { n: string; title: string; body: string };
  i: number;
  n: number;
  progress: MotionValue<number>;
  reduce: boolean;
  liRef?: React.Ref<HTMLLIElement>;
}) {
  const isLast = i === n - 1;
  // Where this node sits along the spine, 0..1.
  const at = n > 1 ? i / (n - 1) : 0;
  // Smooth 0→1 as the spine crosses this node.
  const lit = useTransform(
    progress,
    [Math.max(0, at - 0.06), Math.min(1, at + 0.02)],
    [0, 1],
  );
  const dotScale = useTransform(lit, [0, 1], [0.5, 1]);
  const haloOpacity = useTransform(lit, [0, 1], [0, 0.5]);
  const copyOpacity = useTransform(lit, [0, 1], [0.42, 1]);
  const copyX = useTransform(lit, [0, 1], [14, 0]);

  return (
    <li ref={liRef} className="relative pl-12">
      {/* dot: fills + haloes as the spine arrives */}
      <span
        aria-hidden
        className="absolute left-0 top-[0.4em] block h-[15px] w-[15px] rounded-full border border-copper/60 bg-ink-2"
      >
        <motion.span
          style={reduce ? undefined : { opacity: haloOpacity }}
          className="absolute -inset-2 rounded-full bg-copper/30 blur-sm"
        />
        <motion.span
          style={reduce ? undefined : { scale: dotScale }}
          className="absolute inset-[4px] rounded-full bg-copper"
        />
      </span>
      <motion.div
        style={
          reduce ? undefined : { opacity: copyOpacity, x: copyX }
        }
        className={isLast ? "" : "pb-14"}
      >
        <span className="font-display text-sm text-copper">{p.n}</span>
        <h3 className="mt-2 font-display text-xl tracking-tight text-paper md:text-2xl">
          {p.title}
        </h3>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-mist">
          {p.body}
        </p>
      </motion.div>
    </li>
  );
}
