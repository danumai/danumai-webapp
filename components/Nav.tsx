'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MagneticButton from '@/components/ui/MagneticButton';

const links = [
  { href: '/#ventures', label: 'Ventures' },
  { href: '/#approach', label: 'Approach' },
  { href: '/#services', label: 'Services' },
  { href: '/#labs', label: 'Labs' },
  { href: '/stories', label: 'Stories' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
];

type Bubble = { left: number; width: number; visible: boolean };

const PILL_TRANSITION = {
  type: 'spring',
  stiffness: 500,
  damping: 40,
  mass: 0.8,
} as const;

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bubble, setBubble] = useState<Bubble>({
    left: 0,
    width: 0,
    visible: false,
  });
  const [activeHref, setActiveHref] = useState<string | null>(null);
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const listRef = useRef<HTMLUListElement | null>(null);
  const hoveringRef = useRef(false);
  const pathname = usePathname();

  // Sticky bar: stays fixed at the top at all times. Past a small threshold
  // it picks up a translucent backdrop so content reads cleanly beneath it.
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Track which section is in view and sync the pill to it, unless the
  // user is actively hovering the nav (hover takes priority).
  useEffect(() => {
    if (pathname !== '/') {
      // On a dedicated page route (e.g. /contact, /careers), highlight the
      // matching nav item instead of tracking sections.
      const pageLink = links.find((link) => link.href === pathname);
      setActiveHref(pageLink ? pageLink.href : null);
      return;
    }

    const sectionLinks = links.filter((link) => link.href.startsWith('/#'));
    const sections = sectionLinks
      .map((link) => ({
        href: link.href,
        el: document.getElementById(link.href.slice(2)),
      }))
      .filter((s): s is { href: string; el: HTMLElement } => !!s.el);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const match = sections.find((s) => s.el === visible.target);
        if (match) setActiveHref(match.href);
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    sections.forEach((s) => observer.observe(s.el));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (hoveringRef.current) return;
    if (activeHref) {
      moveTo(activeHref);
    } else {
      setBubble((b) => ({ ...b, visible: false }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeHref]);

  // Close the mobile menu on any navigation.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const moveTo = (href: string) => {
    const el = itemRefs.current[href];
    const list = listRef.current;
    if (!el || !list) return;
    const elRect = el.getBoundingClientRect();
    const listRect = list.getBoundingClientRect();
    setBubble({
      left: elRect.left - listRect.left,
      width: elRect.width,
      visible: true,
    });
  };

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-110 transition-colors duration-500 ${
        scrolled || menuOpen
          ? 'border-b hairline bg-ink/80 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-10">
        <Link
          href="/"
          className="group font-display text-lg tracking-tight text-paper"
        >
          Danumai 
          <span className="inline-block text-copper transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-150 ml-1.5">
            Inc.
          </span>
        </Link>

        <svg className="absolute h-0 w-0" aria-hidden focusable="false">
          <defs>
            <filter id="nav-goo">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="4"
                result="blur"
              />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
                result="goo"
              />
              <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
          </defs>
        </svg>

        <div className="flex items-center gap-2 md:gap-5">
          <div className="relative hidden md:block">
            {/* goo bubble layer, isolated from the text so only the pill gets the liquid filter.
              Shapes must be solid alpha — the goo filter's threshold matrix crushes translucent
              fills to zero — so opacity is dimmed on the wrapper *after* the filter runs. */}
            <div
              className="pointer-events-none absolute inset-0 overflow-hidden opacity-40"
              style={{ filter: 'url(#nav-goo)' }}
            >
              {/* stable pill: critically damped spring, no overshoot */}
              <motion.div
                className="absolute top-1/2 h-9 -translate-y-1/2 rounded-full bg-nav-bubble"
                animate={{
                  left: bubble.left,
                  width: bubble.width,
                  opacity: bubble.visible ? 1 : 0,
                }}
                transition={{
                  left: PILL_TRANSITION,
                  width: PILL_TRANSITION,
                  opacity: { duration: 0.18 },
                }}
              />
            </div>

            <ul
              ref={listRef}
              className="relative flex items-center"
              onMouseLeave={() => {
                hoveringRef.current = false;
                if (activeHref) {
                  moveTo(activeHref);
                } else {
                  setBubble((b) => ({ ...b, visible: false }));
                }
              }}
            >
              {links.map((link) => (
                <li
                  key={link.href}
                  ref={(el) => {
                    itemRefs.current[link.href] = el;
                  }}
                >
                  <Link
                    href={link.href}
                    onMouseEnter={() => {
                      hoveringRef.current = true;
                      moveTo(link.href);
                    }}
                    className={`relative block px-4 py-2 text-sm transition-colors duration-300 hover:text-paper ${
                      activeHref === link.href ? 'text-paper' : 'text-mist'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <MagneticButton
            href="/contact"
            className="sheen hidden rounded-full border hairline px-5 py-2 text-sm text-paper transition-colors hover:border-copper/40 hover:text-copper-soft md:inline-block"
          >
            Get in touch
          </MagneticButton>

          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="relative -mr-2 flex h-10 w-10 items-center justify-center text-paper md:hidden"
          >
            <span className="sr-only">Menu</span>
            <span aria-hidden className="relative block h-4 w-6">
              <span
                className={`absolute left-0 block h-px w-6 bg-current transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  menuOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0.5'
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 block h-px w-6 -translate-y-1/2 bg-current transition-opacity duration-200 ${
                  menuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-6 bg-current transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  menuOpen
                    ? 'top-1/2 -translate-y-1/2 -rotate-45'
                    : 'bottom-0.5'
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile dropdown panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t hairline bg-ink/95 backdrop-blur-md md:hidden"
          >
            <ul className="mx-auto flex max-w-6xl flex-col px-6 py-4">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block py-3 text-base text-mist transition-colors hover:text-paper"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-3">
                <Link
                  href="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="sheen inline-block rounded-full border hairline px-5 py-2.5 text-sm text-paper transition-colors hover:border-copper/40 hover:text-copper-soft"
                >
                  Get in touch
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
