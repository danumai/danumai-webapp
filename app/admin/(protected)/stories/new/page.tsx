import StoryForm from "../StoryForm";
import { createStoryAction } from "../actions";

export default function NewStoryPage() {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-copper">Stories</p>
      <h1 className="mt-2 font-display text-3xl tracking-tight text-paper">New story</h1>
      <StoryForm action={createStoryAction} />
    </div>
  );
}
