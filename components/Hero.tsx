"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import CharReveal from "@/components/ui/CharReveal";
import MagneticButton from "@/components/ui/MagneticButton";
import { DEFAULT_CONTENT, type HeroContent } from "@/lib/content";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Breathing light field: golden spotlight and rose magenta beams on the
// warm prism light canvas.
const ORB_A = "rgba(217,143,31,0.20)";
const ORB_B = "rgba(217,54,127,0.14)";

export default function Hero({ content = DEFAULT_CONTENT.hero }: { content?: HeroContent }) {
  const reduce = useReducedMotion();

  // Mouse-driven ambient parallax (springed so it settles, never snaps).
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 50, damping: 20, mass: 1.2 });
  const smy = useSpring(my, { stiffness: 50, damping: 20, mass: 1.2 });
  const lightX = useTransform(smx, (v) => v * 60);
  const lightY = useTransform(smy, (v) => v * 40);
  const textX = useTransform(smx, (v) => v * -8);
  const textY = useTransform(smy, (v) => v * -5);
  // A second, stronger parallax plane — the supporting copy + CTAs sit
  // "closer" than the headline, so a small cursor move separates the layers
  // into real depth instead of one flat card sliding.
  const nearX = useTransform(smx, (v) => v * -18);
  const nearY = useTransform(smy, (v) => v * -11);

  // Scroll-driven exit: the hero doesn't just fade — it recedes. Content
  // drifts up, scales down a hair, and softly defocuses, so leaving the hero
  // reads as a cinematic pull-back handing the stage to the next act. The
  // light field pushes the opposite way and dims, deepening the parallax.
  const { scrollY } = useScroll();
  const exitY = useTransform(scrollY, [0, 700], [0, -90]);
  const exitScale = useTransform(scrollY, [0, 700], [1, 0.955]);
  const exitOpacity = useTransform(scrollY, [0, 600], [1, 0.2]);
  const exitBlurPx = useTransform(scrollY, [0, 700], [0, 7]);
  const exitFilter = useMotionTemplate`blur(${exitBlurPx}px)`;
  const fieldY = useTransform(scrollY, [0, 700], [0, 120]);
  const fieldScale = useTransform(scrollY, [0, 700], [1, 1.15]);

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduce) return;
    const { innerWidth, innerHeight } = window;
    mx.set(e.clientX / innerWidth - 0.5);
    my.set(e.clientY / innerHeight - 0.5);
  };

  return (
    <section
      onMouseMove={onMouseMove}
      className="relative flex min-h-svh flex-col justify-center overflow-hidden"
    >
      {/* Aurora + grid substrate */}
      <div aria-hidden className="aurora" />
      <div aria-hidden className="absolute inset-0 bg-grid" />

      {/* Ambient light field — follows the cursor, breathes on its own, and
          drifts down + swells as the page scrolls so it parallaxes against the
          receding copy. */}
      <motion.div
        aria-hidden
        style={
          reduce
            ? undefined
            : { x: lightX, y: fieldY, scale: fieldScale }
        }
        className="absolute inset-0"
      >
        <motion.div
          aria-hidden
          className="absolute inset-0"
          style={reduce ? undefined : { y: lightY }}
        >
        <motion.div
          className="absolute right-[-10%] top-[-15%] h-[70vh] w-[70vw] rounded-full"
          style={{
            background: `radial-gradient(closest-side, ${ORB_A}, transparent 70%)`,
          }}
          animate={reduce ? undefined : { scale: [1, 1.08, 1], opacity: [1, 0.85, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-20%] left-[-10%] h-[55vh] w-[55vw] rounded-full"
          style={{
            background: `radial-gradient(closest-side, ${ORB_B}, transparent 70%)`,
          }}
          animate={reduce ? undefined : { scale: [1, 1.12, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        </motion.div>
      </motion.div>

      <motion.div
        style={reduce ? undefined : { x: textX, y: textY }}
        className="relative mx-auto w-full max-w-6xl px-6 pt-28 pb-16 md:px-10"
      >
        <motion.div
          style={
            reduce
              ? { opacity: exitOpacity }
              : {
                  y: exitY,
                  scale: exitScale,
                  opacity: exitOpacity,
                  filter: exitFilter,
                }
          }
        >
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
            className="inline-flex items-center gap-2.5 rounded-full border border-hairline bg-ink-2/60 py-1.5 pl-2.5 pr-4 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-copper/50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-copper" />
            </span>
            <span className="text-[11px] uppercase tracking-[0.25em] text-mist">
              {content.badge}
            </span>
          </motion.div>

          <CharReveal
            text={content.headline}
            accentWords={content.accentWords}
            delay={0.35}
            className="text-hero mt-6 max-w-4xl font-display tracking-tight text-paper"
          />

          {/* Near plane: the copy + CTAs share a stronger cursor parallax than
              the headline, so they float a step forward of it. */}
          <motion.div style={reduce ? undefined : { x: nearX, y: nearY }}>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.35, ease: EASE }}
            className="mt-8 max-w-xl text-base leading-relaxed text-mist md:text-lg"
          >
            {content.subcopy}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.35, ease: EASE }}
            className="relative z-10 mt-10 flex flex-wrap items-center gap-3"
          >
            <MagneticButton
              href={content.primaryHref}
              strength={0.15}
              className="glow-copper sheen beam beam-always group inline-flex items-center gap-2 rounded-full bg-copper px-6 py-3 text-sm font-medium text-ink transition-[background-color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-copper-soft"
            >
              {content.primaryLabel}
              <span
                aria-hidden
                className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
              >
                →
              </span>
            </MagneticButton>

            <MagneticButton
              href={content.secondaryHref}
              strength={0.12}
              className="group relative z-10 inline-flex items-center gap-2 rounded-full border border-hairline bg-ink px-6 py-3 text-sm font-medium text-mist backdrop-blur-sm transition-[color,background-color,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-paper/20 hover:bg-ink-2 hover:text-paper"
            >
              {content.secondaryLabel}
            </MagneticButton>
          </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
      >
        <span className="text-[11px] uppercase tracking-[0.25em] text-faint">
          Scroll
        </span>
        <span className="relative block h-9 w-px overflow-hidden bg-paper/10">
          <motion.span
            className="absolute left-0 top-0 h-3 w-px bg-copper"
            animate={
              reduce
                ? undefined
                : { y: [0, 24, 24], opacity: [0, 1, 0] }
            }
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.85, 1],
            }}
          />
        </span>
      </motion.div>
    </section>
  );
}
