"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { DEFAULT_CONTENT, type FooterLink } from "@/lib/content";

// Brand glyphs keyed by (lowercased) label, so admin-managed socials keep their
// icon. Anything unrecognized falls back to a generic link glyph.
const ICONS: Record<string, ReactNode> = {
  linkedin: (
    <path d="M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0ZM.25 8.25h4.5V24H.25V8.25ZM8 8.25h4.31v2.15h.06c.6-1.14 2.07-2.34 4.26-2.34 4.56 0 5.4 3 5.4 6.9V24h-4.5v-6.14c0-1.47-.03-3.36-2.05-3.36-2.05 0-2.36 1.6-2.36 3.25V24H8V8.25Z" />
  ),
  x: (
    <path d="M18.24 2.25h3.31l-7.23 8.26L22.85 21.75h-6.63l-5.2-6.79-5.94 6.79H1.77l7.73-8.84L1.15 2.25h6.8l4.7 6.2 5.59-6.2Zm-1.16 17.52h1.83L7.01 4.13H5.05L17.08 19.77Z" />
  ),
  github: (
    <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.55v-2.1c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.06 11.06 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.27 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.2.66.8.55A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
  ),
  instagram: (
    <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.42.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.42 2.23.05 1.27.07 1.65.07 4.85s-.02 3.58-.07 4.85c-.06 1.17-.26 1.8-.42 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.42-1.27.05-1.65.07-4.85.07s-3.58-.02-4.85-.07c-1.17-.06-1.8-.26-2.23-.42a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.42-2.23-.05-1.27-.07-1.65-.07-4.85s.02-3.58.07-4.85c.06-1.17.26-1.8.42-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.42 1.27-.06 1.65-.07 4.85-.07ZM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.12 1.38A5.86 5.86 0 0 0 .63 4.14c-.3.76-.5 1.64-.56 2.9C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.12.66.66 1.33 1.08 2.12 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.86 5.86 0 0 0 2.12-1.38 5.86 5.86 0 0 0 1.38-2.12c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.86 5.86 0 0 0-1.38-2.12A5.86 5.86 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0Zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84Zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4Zm6.41-10.85a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44Z" />
  ),
};

const FALLBACK_ICON = (
  <path d="M8.5 12a3.5 3.5 0 0 1 3.5-3.5h2a3.5 3.5 0 1 1 0 7h-2M15.5 12a3.5 3.5 0 0 1-3.5 3.5h-2a3.5 3.5 0 1 1 0-7h2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
);

export default function FooterSocials({
  socials = DEFAULT_CONTENT.footer.socials,
}: {
  socials?: FooterLink[];
}) {
  const reduce = useReducedMotion();

  return (
    <ul className="flex flex-wrap items-center gap-3">
      {socials.map((s, i) => (
        <motion.li
          key={s.label}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            duration: 0.5,
            delay: 0.05 * i,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <motion.a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className="social-chip group"
            whileHover={reduce ? undefined : { y: -4 }}
            whileTap={reduce ? undefined : { scale: 0.94 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-[18px] w-[18px]"
              aria-hidden
            >
              {ICONS[s.label.toLowerCase()] ?? FALLBACK_ICON}
            </svg>
          </motion.a>
        </motion.li>
      ))}
    </ul>
  );
}
