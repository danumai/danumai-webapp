"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Reveals text line-by-line with a masked rise. Pass lines explicitly. */
export default function LineReveal({
  lines,
  className,
  lineClassName,
  delay = 0,
  as: Tag = "p",
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  as?: "h2" | "h3" | "p" | "blockquote";
}) {
  const reduce = useReducedMotion();
  return (
    <Tag className={className} aria-label={lines.join(" ")}>
      {lines.map((line, i) => (
        <span
          key={i}
          aria-hidden
          className="block overflow-hidden pb-[0.1em] -mb-[0.1em]"
        >
          <motion.span
            className={`block ${lineClassName ?? ""}`}
            initial={reduce ? { opacity: 0 } : { y: "115%" }}
            whileInView={reduce ? { opacity: 1 } : { y: "0%" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.9,
              delay: delay + i * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
