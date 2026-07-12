import MagneticButton from "@/components/ui/MagneticButton";
import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";
import { DEFAULT_CONTENT, type CtaContent } from "@/lib/content";

export default function CTA({ content = DEFAULT_CONTENT.cta }: { content?: CtaContent }) {
  return (
    <section className="wash-coral border-t section-edge">
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-40 text-center md:px-10 md:pb-32 md:pt-56">
        <WordReveal
          text={content.heading}
          accentWords={content.accentWords}
          className="mx-auto max-w-3xl font-display text-3xl tracking-tight text-paper md:text-5xl"
        />
        <Reveal delay={0.3}>
          <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-mist">
            {content.body}
          </p>
        </Reveal>
        <Reveal delay={0.45}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton
              href={content.primaryHref}
              className="glow-copper sheen beam beam-always group inline-flex items-center gap-2 rounded-full bg-copper px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-copper-soft"
            >
              {content.primaryLabel}
              <span
                aria-hidden
                className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
              >
                →
              </span>
            </MagneticButton>
            <MagneticButton
              href={content.secondaryHref}
              className="sheen inline-block rounded-full border hairline px-7 py-3.5 text-sm text-paper transition-colors hover:border-copper/40 hover:text-copper-soft"
            >
              {content.secondaryLabel}
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
