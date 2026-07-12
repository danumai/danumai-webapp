import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/ui/Reveal";
import StoryBody from "@/components/stories/StoryBody";
import { getStoryBySlug } from "@/lib/data/stories";

export const dynamic = "force-dynamic";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStoryBySlug(slug).catch(() => null);
  if (!story || !story.published) return { title: "Story not found" };
  return {
    title: story.title,
    description: story.excerpt || story.subtitle || undefined,
    openGraph: {
      title: story.title,
      description: story.excerpt || story.subtitle || undefined,
      images: story.coverUrl ? [{ url: story.coverUrl }] : undefined,
    },
  };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug).catch(() => null);
  if (!story || !story.published) notFound();

  return (
    <article style={{ "--card-accent": story.accent } as CSSProperties}>
      <section className="wash-violet relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `radial-gradient(55% 45% at 75% 12%, color-mix(in srgb, ${story.accent} 12%, transparent), transparent 70%)`,
          }}
        />
        <div className="relative mx-auto max-w-3xl px-6 pb-14 pt-40 md:pt-48">
          <Reveal y={16}>
            <Link
              href="/stories"
              className="text-sm text-mist transition-colors hover:text-copper-soft"
            >
              ← All stories
            </Link>
          </Reveal>
          <Reveal y={16} delay={0.1}>
            <p className="mt-8 text-xs uppercase tracking-[0.3em]" style={{ color: story.accent }}>
              {story.category}
            </p>
          </Reveal>
          <Reveal y={18} delay={0.15}>
            <h1 className="mt-4 font-display text-4xl leading-[1.1] tracking-tight text-paper sm:text-5xl">
              {story.title}
            </h1>
          </Reveal>
          {story.subtitle && (
            <Reveal delay={0.3}>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-mist">
                {story.subtitle}
              </p>
            </Reveal>
          )}
          <Reveal delay={0.4}>
            <p className="mt-6 flex items-center gap-2 text-xs text-faint">
              <span>{formatDate(story.publishedAt)}</span>
              {story.readMinutes > 0 && (
                <>
                  <span aria-hidden>·</span>
                  <span>{story.readMinutes} min read</span>
                </>
              )}
            </p>
          </Reveal>
        </div>
      </section>

      {story.coverUrl && (
        <div className="mx-auto max-w-4xl px-6">
          <Reveal>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={story.coverUrl}
              alt=""
              className="w-full rounded-2xl border hairline object-cover"
            />
          </Reveal>
        </div>
      )}

      <section className="mx-auto max-w-3xl px-6 pb-28 pt-14">
        <Reveal>
          <StoryBody body={story.body} />
        </Reveal>

        <div className="mt-16 border-t hairline pt-8">
          <Link
            href="/stories"
            className="text-sm text-copper transition-colors hover:text-copper-soft"
          >
            ← Back to all stories
          </Link>
        </div>
      </section>
    </article>
  );
}
