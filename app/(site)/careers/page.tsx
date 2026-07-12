import type { CSSProperties } from "react";
import type { Metadata } from "next";
import JobList from "@/components/careers/JobList";
import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";
import MagneticButton from "@/components/ui/MagneticButton";
import { listJobs } from "@/lib/data/jobs";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join Danumai — engineers, designers, and storytellers building ventures we own and operate ourselves.",
};

export default async function CareersPage() {
  // Falls back to JobList's built-in defaults if the database isn't
  // reachable (e.g. DATABASE_URL not configured yet).
  const jobs = await listJobs({ publishedOnly: true }).catch((err) => {
    console.error("Failed to load jobs", err);
    return undefined;
  });

  return (
    <>
      <section className="wash-emerald relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(55% 45% at 75% 15%, rgba(217,154,78,0.09), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-40 md:px-10 md:pt-48">
          <Reveal y={16}>
            <p className="text-xs uppercase tracking-[0.3em] text-copper">
              Careers
            </p>
          </Reveal>
          <WordReveal
            as="h1"
            text="Do the best work of your life, on things we actually own."
            accentWords={["own"]}
            delay={0.2}
            className="mt-6 max-w-3xl font-display text-4xl leading-[1.1] tracking-tight text-paper sm:text-5xl md:text-6xl"
          />
          <Reveal delay={0.8}>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-mist">
              Small team, long horizon, no client work. Every hour you spend
              here goes into products Danumai runs — which means your craft
              compounds instead of getting handed off.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-28 md:px-10">
        <Reveal>
          <h2 className="mb-8 text-xs uppercase tracking-[0.25em] text-faint">
            Open roles
          </h2>
        </Reveal>
        <JobList jobs={jobs} />
        <Reveal delay={0.2}>
          <div
            className="card card-hover card-topline group mt-16 p-8 md:p-10"
            style={{ "--card-accent": "#0d9488" } as CSSProperties}
          >
            <p className="font-display text-xl tracking-tight text-paper">
              Don&rsquo;t see your role?
            </p>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-mist">
              We hire for trajectory, not job descriptions. If you believe you
              belong under this roof, make the case.
            </p>
            <MagneticButton
              href="/contact?topic=Careers"
              className="glow-copper sheen mt-6 inline-block rounded-full bg-copper px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-copper-soft"
            >
              Write to us
            </MagneticButton>
          </div>
        </Reveal>
      </section>
    </>
  );
}
