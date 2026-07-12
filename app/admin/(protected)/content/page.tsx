import Link from "next/link";
import { SECTIONS } from "@/lib/content";

export default function AdminContentPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-copper">Content</p>
        <h1 className="mt-2 font-display text-3xl tracking-tight text-paper">
          Site content
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-mist">
          Edit the copy for every section of the public homepage and footer.
          Each section falls back to its built-in default until you save an
          override here.
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        {SECTIONS.map((s) => (
          <li key={s.key}>
            <Link href={`/admin/content/${s.key}`} className="card card-hover block p-6">
              <p className="font-display text-lg text-paper">{s.label}</p>
              <p className="mt-2 text-sm text-mist">{s.description}</p>
              <span className="mt-4 inline-block text-sm text-copper">Edit →</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
