"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Card surface that tracks the cursor: a soft radial highlight (the `.cursor-glow`
 * utility, driven by --mx/--my) follows the pointer and fades in on hover. Pass
 * card styling via `className`; the wrapper adds the group + clipping needed for
 * the glow to sit under the content and respect rounded corners.
 */
export default function SpotlightCard({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      style={style}
      className={`group relative overflow-hidden ${className}`}
    >
      <span
        aria-hidden
        className="cursor-glow absolute inset-0 z-0 rounded-[inherit]"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
