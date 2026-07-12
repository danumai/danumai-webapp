"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/**
 * The oversized Danumai wordmark behind the footer, given a slow horizontal
 * parallax as the footer scrolls into view — the letters drift under the
 * content so the terminal band feels lit and alive rather than pinned. The
 * span keeps its CSS centering; only an inner wrapper is translated, so the
 * `translateX(-50%)` centering in `.footer-watermark` is never clobbered.
 */
export default function FooterWatermark() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <motion.div style={reduce ? undefined : { x }} className="absolute inset-0">
        <span className="footer-watermark">Danumai</span>
      </motion.div>
    </div>
  );
}
