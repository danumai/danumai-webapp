import type { CSSProperties } from "react";
import Link from "next/link";
import type { Story } from "@/lib/data/stories";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function StoryCard({ story }: { story: Story }) {
  return (
    <Link
      href={`/stories/${story.slug}`}
      className="card card-hover card-topline group flex flex-col overflow-hidden"
      style={{ "--card-accent": story.accent } as CSSProperties}
    >
      <div
        className="relative aspect-[16/9] w-full overflow-hidden"
        style={{
          background: story.coverUrl
            ? undefined
            : `linear-gradient(135deg, color-mix(in srgb, ${story.accent} 26%, transparent), transparent 70%)`,
        }}
      >
        {story.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={story.coverUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
          />
        ) : (
          <span
            aria-hidden
            className="absolute bottom-4 left-5 font-display text-5xl opacity-20"
            style={{ color: story.accent }}
          >
            {story.category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-7">
        <p
          className="text-xs uppercase tracking-[0.2em]"
          style={{ color: story.accent }}
        >
          {story.category}
        </p>
        <h3 className="mt-3 font-display text-xl leading-snug tracking-tight text-paper">
          {story.title}
        </h3>
        {story.excerpt && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-mist">
            {story.excerpt}
          </p>
        )}
        <p className="mt-5 flex items-center gap-2 text-xs text-faint">
          <span>{formatDate(story.publishedAt)}</span>
          {story.readMinutes > 0 && (
            <>
              <span aria-hidden>·</span>
              <span>{story.readMinutes} min read</span>
            </>
          )}
        </p>
      </div>
    </Link>
  );
}
