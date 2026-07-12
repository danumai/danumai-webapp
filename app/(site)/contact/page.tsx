import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Suspense } from "react";
import ContactForm from "@/components/contact/ContactForm";
import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to Danumai — about the ventures, joining the team, or anything worth building.",
};

export default function ContactPage() {
  return (
    <>
      <section className="wash-indigo relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(55% 45% at 25% 10%, rgba(217,154,78,0.09), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-40 md:px-10 md:pt-48">
          <Reveal y={16}>
            <p className="text-xs uppercase tracking-[0.3em] text-copper">
              Contact
            </p>
          </Reveal>
          <WordReveal
            as="h1"
            text="Say the thing you're building toward."
            accentWords={["building"]}
            delay={0.2}
            className="mt-6 max-w-3xl font-display text-4xl leading-[1.1] tracking-tight text-paper sm:text-5xl md:text-6xl"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-28 md:px-10">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-[1fr_1.5fr]">
          <div className="md:sticky md:top-28 md:self-start">
            <Reveal>
              <div className="space-y-8">
                <div>
                  <h2 className="text-xs uppercase tracking-[0.25em] text-faint">
                    Email
                  </h2>
                  <a
                    href="mailto:hello@danumai.com"
                    className="link-line mt-3 inline-block font-display text-xl tracking-tight text-paper"
                  >
                    hello@danumai.com
                  </a>
                </div>
                <div>
                  <h2 className="text-xs uppercase tracking-[0.25em] text-faint">
                    Careers
                  </h2>
                  <a
                    href="mailto:careers@danumai.com"
                    className="link-line mt-3 inline-block font-display text-xl tracking-tight text-paper"
                  >
                    careers@danumai.com
                  </a>
                </div>
                <div>
                  <h2 className="text-xs uppercase tracking-[0.25em] text-faint">
                    Where
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-mist">
                    Dhaka, Bangladesh · Remote across time zones
                  </p>
                </div>
                <div
                  className="card p-6"
                  style={{ "--card-accent": "#e0402f" } as CSSProperties}
                >
                  <p className="text-sm leading-relaxed text-mist">
                    We read everything. Short and concrete beats long and
                    polished — tell us what you want to make happen.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div
              className="card p-7 md:p-10"
              style={{ "--card-accent": "#4f46e5" } as CSSProperties}
            >
              <Suspense fallback={null}>
                <ContactForm />
              </Suspense>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
