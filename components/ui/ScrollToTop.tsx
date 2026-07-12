"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLenis } from "lenis/react";
import { useState } from "react";

/**
 * Floating "back to top" control that fades in once you're well down the page.
 * Scrolling is driven through the Lenis instance so the return glides with the
 * same smoothing as the rest of the site instead of a native jump. Carries the
 * beam ring so it reads as part of the lit interaction language.
 */
export default function ScrollToTop() {
  const [show, setShow] = useState(false);
  const reduce = useReducedMotion();
  const lenis = useLenis((instance) => {
    setShow(instance.scroll > 800);
  });

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          aria-label="Back to top"
          onClick={() => lenis?.scrollTo(0, { duration: 1.1 })}
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          whileHover={reduce ? undefined : { y: -3 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 26 }}
          className="beam group fixed bottom-6 right-6 z-[120] flex h-12 w-12 items-center justify-center rounded-full border hairline bg-ink/70 text-paper shadow-lg backdrop-blur-md transition-colors hover:border-copper/40 hover:text-copper-soft"
        >
          <span
            aria-hidden
            className="inline-block text-lg leading-none transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5"
          >
            ↑
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
