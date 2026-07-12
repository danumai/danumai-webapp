import Link from "next/link";
import { notFound } from "next/navigation";
import { SECTIONS, type SectionKey } from "@/lib/content";
import { getSection } from "@/lib/data/content";
import SectionForm from "./SectionForm";

export default async function EditSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const schema = SECTIONS.find((s) => s.key === section);
  if (!schema) notFound();

  const value = await getSection(section as SectionKey);

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/content" className="text-sm text-mist hover:text-copper-soft">
          ← All sections
        </Link>
        <p className="mt-4 text-xs uppercase tracking-[0.3em] text-copper">Content</p>
        <h1 className="mt-2 font-display text-3xl tracking-tight text-paper">
          {schema.label}
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-mist">{schema.description}</p>
      </div>

      <SectionForm
        sectionKey={schema.key}
        fields={schema.fields}
        initialValue={value as Record<string, unknown>}
      />
    </div>
  );
}
