import { notFound } from "next/navigation";
import { getStory } from "@/lib/data/stories";
import StoryForm from "../../StoryForm";
import { updateStoryAction } from "../../actions";

export default async function EditStoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const story = await getStory(id);
  if (!story) notFound();

  const boundAction = updateStoryAction.bind(null, story.id, story.coverUrl);

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-copper">Stories</p>
      <h1 className="mt-2 font-display text-3xl tracking-tight text-paper">
        Edit {story.title}
      </h1>
      <StoryForm story={story} action={boundAction} />
    </div>
  );
}
