import { prisma } from "@/lib/prisma";
import {
  DEFAULT_CONTENT,
  SECTIONS,
  coerceSection,
  type SectionKey,
  type SiteContent,
} from "@/lib/content";

/** The whole site's editable content, with every section falling back to its
 *  built-in default whenever the database has no (or invalid) override. Never
 *  throws for content reasons — callers can still choose to catch DB errors. */
export async function getSiteContent(): Promise<SiteContent> {
  const rows = await prisma.siteContent.findMany({ select: { key: true, value: true } });
  const overrides = new Map(rows.map((r) => [r.key, r.value]));

  const out: Record<string, unknown> = {};
  for (const section of SECTIONS) {
    const key = section.key;
    out[key] = overrides.has(key)
      ? coerceSection(key, overrides.get(key))
      : DEFAULT_CONTENT[key];
  }
  return out as SiteContent;
}

/** Content for a single section. Cheap enough for a per-component fetch. */
export async function getSection<K extends SectionKey>(
  key: K
): Promise<SiteContent[K]> {
  const row = await prisma.siteContent.findUnique({
    where: { key },
    select: { value: true },
  });
  return row ? coerceSection(key, row.value) : DEFAULT_CONTENT[key];
}

/** Upsert one section's content. The value is coerced against the schema first,
 *  so only well-formed data is ever persisted. */
export async function updateSection<K extends SectionKey>(
  key: K,
  raw: unknown
): Promise<void> {
  const value = coerceSection(key, raw) as object;
  await prisma.siteContent.upsert({
    where: { key },
    create: { key, value },
    update: { value, updatedAt: new Date() },
  });
}
