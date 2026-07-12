"use client";

import { AnimatePresence, motion } from "framer-motion";

export type SubmitState = "idle" | "loading" | "success";

/**
 * Button that morphs through idle → spinner → drawn checkmark.
 * State is owned by the parent form.
 */
export default function SubmitButton({
  state,
  idleLabel,
  successLabel = "Sent — we'll reply soon",
  className = "",
}: {
  state: SubmitState;
  idleLabel: string;
  successLabel?: string;
  className?: string;
}) {
  return (
    <motion.button
      type="submit"
      disabled={state !== "idle"}
      whileTap={state === "idle" ? { scale: 0.965 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={`glow-copper sheen relative inline-flex min-w-44 items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3 text-sm font-medium transition-colors duration-500 ${
        state === "success"
          ? "bg-copper-soft text-ink"
          : "bg-copper text-ink hover:bg-copper-soft"
      } disabled:cursor-default ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {state === "idle" && (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="inline-flex items-center gap-2"
          >
            {idleLabel}
            <span aria-hidden>→</span>
          </motion.span>
        )}
        {state === "loading" && (
          <motion.span
            key="loading"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.2 }}
            className="inline-flex items-center"
            aria-label="Sending"
          >
            <motion.span
              className="block h-4 w-4 rounded-full border-2 border-ink/25 border-t-ink"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
            />
          </motion.span>
        )}
        {state === "success" && (
          <motion.span
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className="inline-flex items-center gap-2"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
              <motion.path
                d="M4 12.5l5 5L20 6.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
              />
            </svg>
            {successLabel}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
