import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/ui/Reveal";
import ProjectGallery from "@/components/projects/ProjectGallery";
import { getProjectBySlug } from "@/lib/data/projects";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug).catch(() => null);
  if (!project || !project.published) return { title: "Project not found" };
  return {
    title: project.name,
    description: project.tagline || project.description || undefined,
    openGraph: {
      title: project.name,
      description: project.tagline || project.description || undefined,
      images: project.imageUrl ? [{ url: project.imageUrl }] : undefined,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug).catch(() => null);
  if (!project || !project.published) notFound();

  const accent = project.accent;
  // Cover first, then the gallery — one deduped list for the lightbox.
  const images = [
    ...(project.imageUrl ? [project.imageUrl] : []),
    ...project.gallery.filter((url) => url !== project.imageUrl),
  ];

  return (
    <article style={{ "--card-accent": accent } as CSSProperties}>
      <section className="wash-indigo relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `radial-gradient(55% 45% at 75% 12%, color-mix(in srgb, ${accent} 14%, transparent), transparent 70%)`,
          }}
        />
        <div className="relative mx-auto max-w-4xl px-6 pb-14 pt-40 md:pt-48">
          <Reveal y={16}>
            <Link
              href="/#ventures"
              className="text-sm text-mist transition-colors hover:text-copper-soft"
            >
              ← All ventures
            </Link>
          </Reveal>
          <Reveal y={16} delay={0.1}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {project.status && (
                <span
                  className="rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.15em]"
                  style={{
                    borderColor: `${accent}40`,
                    color: accent,
                    background: `${accent}12`,
                  }}
                >
                  {project.status}
                </span>
              )}
            </div>
          </Reveal>
          <Reveal y={18} delay={0.15}>
            <h1 className="mt-4 font-display text-4xl leading-[1.1] tracking-tight text-paper sm:text-5xl">
              {project.name}
            </h1>
          </Reveal>
          {project.tagline && (
            <Reveal delay={0.25}>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed" style={{ color: `${accent}cc` }}>
                {project.tagline}
              </p>
            </Reveal>
          )}
          {project.description && (
            <Reveal delay={0.35}>
              <p className="mt-6 max-w-2xl whitespace-pre-line text-base leading-relaxed text-mist">
                {project.description}
              </p>
            </Reveal>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-28 pt-6">
        {project.techStack.length > 0 && (
          <Reveal>
            <div className="mb-12">
              <p className="text-xs uppercase tracking-[0.3em] text-copper">Tech stack</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.techStack.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border px-3.5 py-1.5 text-sm text-mist"
                    style={{ borderColor: `${accent}35`, background: `${accent}0d` }}
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}

        {project.features.length > 0 && (
          <Reveal>
            <div className="mb-12">
              <p className="text-xs uppercase tracking-[0.3em] text-copper">Highlights</p>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {project.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm leading-relaxed text-mist">
                    <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accent }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}

        {images.length > 0 && (
          <Reveal>
            <div className="mb-12">
              <p className="text-xs uppercase tracking-[0.3em] text-copper">Gallery</p>
              <div className="mt-4">
                <ProjectGallery images={images} name={project.name} accent={accent} />
              </div>
            </div>
          </Reveal>
        )}

        <div className="mt-16 flex flex-wrap items-center justify-end gap-4 border-t hairline pt-8">
          <Link
            href={`/contact?topic=${encodeURIComponent(project.name)}`}
            className="rounded-full border px-5 py-2.5 text-sm transition-colors"
            style={{ borderColor: `${accent}50`, color: accent }}
          >
            Discuss this venture →
          </Link>
        </div>
      </section>
    </article>
  );
}
