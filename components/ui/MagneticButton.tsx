"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import Link from "next/link";
import { useRef, type ReactNode } from "react";

// Client-side navigation for internal routes; a plain anchor keeps the
// magnetic behaviour for #hash targets and mailto:/external links.
const MotionLink = motion.create(Link);

/**
 * Anchor that behaves like a physical object: it magnetically drifts a few
 * pixels toward the cursor, compresses on press, and springs back on release.
 * Pair with the `.sheen` utility for the light-sweep reflection.
 */
export default function MagneticButton({
  href,
  children,
  className,
  strength = 0.25,
  target,
  rel,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  strength?: number;
  target?: string;
  rel?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 240, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 240, damping: 18, mass: 0.6 });

  const onMouseMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
  };

  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const isInternal = href.startsWith("/") && !href.startsWith("//");
  const shared = {
    ref,
    onMouseMove,
    onMouseLeave,
    style: { x: sx, y: sy },
    whileHover: reduce ? undefined : { y: -2 },
    whileTap: reduce ? undefined : { scale: 0.965 },
    transition: { type: "spring", stiffness: 400, damping: 22 },
    className,
    target,
    rel,
  } as const;

  if (isInternal) {
    return (
      <MotionLink href={href} {...shared}>
        {children}
      </MotionLink>
    );
  }

  return (
    <motion.a href={href} {...shared}>
      {children}
    </motion.a>
  );
}
