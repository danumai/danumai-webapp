"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Bespoke cursor for fine-pointer devices: a precise accent dot that tracks
 * exactly, trailed by a springy ring that swells over interactive targets and
 * compresses on press. Falls back to the native cursor on touch / reduced
 * motion (the component renders nothing and never hides the system pointer).
 */
// Halo fill follows the primary accent: royal indigo on the Cinematic
// Prism light canvas.
const HALO = "rgba(67,64,189,0.10)";
const HALO_OFF = "rgba(67,64,189,0)";

export default function Cursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [down, setDown] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 320, damping: 28, mass: 0.55 });
  const ringY = useSpring(y, { stiffness: 320, damping: 28, mass: 0.55 });

  useEffect(() => {
    if (reduce) return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mq.matches) return;

    setEnabled(true);
    document.body.classList.add("cursor-active");

    const INTERACTIVE = 'a, button, [role="radio"], input, textarea, [data-cursor="hover"]';
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as HTMLElement | null;
      setHovering(!!target?.closest(INTERACTIVE));
    };
    const dn = () => setDown(true);
    const up = () => setDown(false);
    const leave = () => {
      x.set(-100);
      y.set(-100);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", dn);
    window.addEventListener("mouseup", up);
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      document.body.classList.remove("cursor-active");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", dn);
      window.removeEventListener("mouseup", up);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, [reduce, x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* trailing ring */}
      <motion.div
        aria-hidden
        style={{ x: ringX, y: ringY }}
        className="pointer-events-none fixed left-0 top-0 z-[300]"
      >
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-copper/70"
          animate={{
            width: hovering ? 52 : 30,
            height: hovering ? 52 : 30,
            opacity: hovering ? 1 : 0.55,
            backgroundColor: hovering ? HALO : HALO_OFF,
            scale: down ? 0.82 : 1,
          }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
        />
      </motion.div>

      {/* precise dot */}
      <motion.div
        aria-hidden
        style={{ x, y }}
        className="pointer-events-none fixed left-0 top-0 z-[300]"
      >
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-copper-soft"
          animate={{
            width: hovering ? 5 : 7,
            height: hovering ? 5 : 7,
            scale: down ? 0.7 : 1,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 24 }}
        />
      </motion.div>
    </>
  );
}
