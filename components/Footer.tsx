import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import FooterWatermark from "@/components/FooterWatermark";
import FooterSocials from "@/components/FooterSocials";
import { getSection } from "@/lib/data/content";
import { DEFAULT_CONTENT } from "@/lib/content";

/** Small inline icon set — kept local so the footer has no icon dependency. */
function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className="footer-arrow h-3.5 w-3.5"
    >
      <path
        d="M4.5 11.5 11.5 4.5M6.5 4.5h5v5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="h-4 w-4">
      <rect
        x="2.5"
        y="4.5"
        width="15"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M3.5 6l6.5 4.5L16.5 6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="h-4 w-4">
      <path
        d="M10 17.5c3.5-3.6 5.5-6.4 5.5-9a5.5 5.5 0 1 0-11 0c0 2.6 2 5.4 5.5 9Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="8.5" r="1.9" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="h-4 w-4">
      <rect
        x="2.5"
        y="6.5"
        width="15"
        height="9.5"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M7 6.5V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 13 5v1.5M2.5 10.5h15"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="h-4 w-4">
      <path
        d="M10 5.5C8.5 4 6 3.75 4 4.25V15c2-.5 4.5-.25 6 1.25M10 5.5c1.5-1.5 4-1.75 6-1.25V15c-2-.5-4.5-.25-6 1.25M10 5.5V16.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="h-4 w-4">
      <path
        d="M4 4.5h12a1.5 1.5 0 0 1 1.5 1.5v6A1.5 1.5 0 0 1 16 13.5H8.5L5 16.5V13.5H4A1.5 1.5 0 0 1 2.5 12V6A1.5 1.5 0 0 1 4 4.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default async function Footer() {
  const content = await getSection("footer").catch(() => DEFAULT_CONTENT.footer);
  return (
    <footer id="contact" className="site-footer">
      <FooterWatermark />
      <Reveal y={24} className="relative mx-auto max-w-6xl px-6 py-24 md:px-10">
        <div className="grid grid-cols-1 gap-14 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="font-display text-2xl tracking-tight text-paper"
            >
              Danumai<span className="text-copper">.</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-mist">
              {content.blurb}
            </p>
            <div className="mt-7">
              <FooterSocials socials={content.socials} />
            </div>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-faint">
              Ventures
            </h3>
            <ul className="mt-5 space-y-3">
              {content.ventures.map((v) => (
                <li key={`${v.label}-${v.href}`}>
                  <a
                    href={v.href}
                    className="footer-nav-link group text-sm text-mist"
                  >
                    <span className="link-line">{v.label}</span>
                    <ArrowIcon />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-faint">
              Contact
            </h3>
            <ul className="mt-5 space-y-3.5">
              <li>
                <Link
                  href="/contact"
                  className="footer-nav-link group text-sm text-mist"
                >
                  <span className="footer-ico" aria-hidden>
                    <ChatIcon />
                  </span>
                  <span className="link-line">Contact us</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/stories"
                  className="footer-nav-link group text-sm text-mist"
                >
                  <span className="footer-ico" aria-hidden>
                    <BookIcon />
                  </span>
                  <span className="link-line">Stories</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="footer-nav-link group text-sm text-mist"
                >
                  <span className="footer-ico" aria-hidden>
                    <BriefcaseIcon />
                  </span>
                  <span className="link-line">Careers</span>
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${content.email}`}
                  className="footer-nav-link group text-sm text-mist"
                >
                  <span className="footer-ico" aria-hidden>
                    <MailIcon />
                  </span>
                  <span className="link-line">{content.email}</span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-faint">
                <span className="footer-ico" aria-hidden>
                  <PinIcon />
                </span>
                <span>{content.location}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-3 border-t hairline pt-8 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Danumai Inc. All rights reserved.</p>
          <p>Built in-house by Danumai Labs.</p>
        </div>
      </Reveal>
    </footer>
  );
}
