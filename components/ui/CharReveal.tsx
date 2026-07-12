"use client";

import { motion, useReducedMotion } from "framer-motion";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Word-level "settle" reveal for the hero headline: each word rises a touch
 * and resolves from a soft blur, staggered left-to-right. No overflow masking,
 * so italics, descenders and side-bearings are never clipped.
 */
export default function CharReveal({
  text,
  className,
  delay = 0,
  accentWords = [],
  as: Tag = "h1",
}: {
  text: string;
  className?: string;
  delay?: number;
  accentWords?: string[];
  as?: "h1" | "h2";
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  return (
    <Tag className={`text-balance ${className ?? ""}`} aria-label={text}>
      {words.map((word, wi) => {
        const accent = accentWords.includes(word.replace(/[.,?]/g, ""));
        return (
          // Space rendered as a separate node between words so it stays a real
          // break opportunity — words wrap cleanly instead of overflowing.
          <span key={wi}>
            <motion.span
              aria-hidden
              className={`inline-block will-change-[transform,filter] ${
                accent ? "accent-word" : ""
              }`}
              initial={
                reduce
                  ? { opacity: 0 }
                  : { opacity: 0, y: "0.42em", filter: "blur(10px)" }
              }
              animate={
                reduce
                  ? { opacity: 1 }
                  : { opacity: 1, y: "0em", filter: "blur(0px)" }
              }
              transition={{
                duration: 1.05,
                delay: delay + wi * 0.055,
                ease: EASE,
              }}
            >
              {word}
            </motion.span>
            {wi < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </Tag>
  );
}
