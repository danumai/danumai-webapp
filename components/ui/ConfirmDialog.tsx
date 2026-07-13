"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

type ConfirmOptions = {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Style the confirm button as a destructive (red) action. */
  destructive?: boolean;
};

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

/**
 * Imperative confirmation dialog. Returns a promise that resolves to `true`
 * when the user confirms and `false` when they cancel — a drop-in async
 * replacement for the browser's window.confirm().
 */
export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within <ConfirmProvider>");
  return ctx;
}

type Pending = ConfirmOptions & { resolve: (value: boolean) => void };

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [pending, setPending] = useState<Pending | null>(null);
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback<ConfirmFn>((options) => {
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
      setPending({ ...options, resolve });
    });
  }, []);

  const close = useCallback((value: boolean) => {
    resolveRef.current?.(value);
    resolveRef.current = null;
    setPending(null);
  }, []);

  // Escape cancels, Enter confirms while the dialog is open.
  useEffect(() => {
    if (!pending) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(false);
      if (e.key === "Enter") close(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pending, close]);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <AnimatePresence>
        {pending && (
          <motion.div
            className="fixed inset-0 z-[110] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div
              className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
              onClick={() => close(false)}
            />
            <motion.div
              role="alertdialog"
              aria-modal="true"
              aria-label={pending.title ?? "Confirm"}
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="relative w-full max-w-sm rounded-2xl border hairline bg-ink-2 p-6 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)]"
            >
              {pending.title && (
                <h2 className="font-display text-lg text-paper">
                  {pending.title}
                </h2>
              )}
              <p className="mt-1 text-sm leading-relaxed text-mist">
                {pending.message}
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => close(false)}
                  className="rounded-full px-4 py-2 text-sm text-mist transition-colors hover:text-paper"
                >
                  {pending.cancelLabel ?? "Cancel"}
                </button>
                <button
                  autoFocus
                  onClick={() => close(true)}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                    pending.destructive
                      ? "bg-red-500/90 text-paper hover:bg-red-500"
                      : "bg-copper text-ink hover:bg-copper-soft"
                  }`}
                >
                  {pending.confirmLabel ?? "Confirm"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  );
}
