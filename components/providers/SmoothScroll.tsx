"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        smoothWheel: true,
        // Smoothly ease to in-page #anchors, clearing the fixed nav.
        anchors: { offset: -88 },
      }}
    >
      {children}
    </ReactLenis>
  );
}
