import type { Metadata } from "next";
import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";
import StoryCard from "@/components/stories/StoryCard";
import { listPublishedStories } from "@/lib/data/stories";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Stories",
  description:
    "The thinking, plans, and goals behind the house of ventures — written by the team building it.",
};

export default async function StoriesPage() {
  // Falls back to an empty list if the database isn't reachable (e.g.
  // DATABASE_URL not configured yet), so the page still renders.
  const stories = await listPublishedStories().catch((err) => {
    console.error("Failed to load stories", err);
    return [];
  });

  return (
    <>
      <section className="wash-violet relative overflow-hidden">
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
            <p className="text-xs uppercase tracking-[0.3em] text-copper">Stories</p>
          </Reveal>
          <WordReveal
            as="h1"
            text="The thinking, plans, and goals behind the house."
            accentWords={["plans", "goals"]}
            delay={0.2}
            className="mt-6 max-w-3xl font-display text-4xl leading-[1.1] tracking-tight text-paper sm:text-5xl md:text-6xl"
          />
          <Reveal delay={0.8}>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-mist">
              Notes from inside Danumai — what we&rsquo;re building, why we chose
              it, and where each venture is headed. Written by the team that runs
              it, for the long haul.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-28 md:px-10">
        {stories.length === 0 ? (
          <Reveal>
            <p className="text-sm text-mist">No stories yet — check back soon.</p>
          </Reveal>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((story, i) => (
              <Reveal key={story.id} delay={Math.min(i * 0.08, 0.4)}>
                <StoryCard story={story} />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
