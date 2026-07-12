import ProjectForm from "../ProjectForm";
import { createProjectAction } from "../actions";

export default function NewProjectPage() {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-copper">Projects</p>
      <h1 className="mt-2 font-display text-3xl tracking-tight text-paper">
        New project
      </h1>
      <ProjectForm action={createProjectAction} />
    </div>
  );
}
