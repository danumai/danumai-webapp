import Link from "next/link";
import { listStories } from "@/lib/data/stories";
import StoriesList from "./StoriesList";

export default async function AdminStoriesPage() {
  const stories = await listStories();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-copper">Stories</p>
          <h1 className="mt-2 font-display text-3xl tracking-tight text-paper">
            Editorial posts
          </h1>
          <p className="mt-2 text-sm text-mist">
            Long-form posts on plans, goals, and vision. Reorder with the arrows,
            publish/unpublish, or quick-edit inline.
          </p>
        </div>
        <Link
          href="/admin/stories/new"
          className="rounded-full bg-copper px-5 py-2.5 text-sm font-medium text-ink hover:bg-copper-soft"
        >
          New story
        </Link>
      </div>

      <StoriesList stories={stories} />
    </div>
  );
}
