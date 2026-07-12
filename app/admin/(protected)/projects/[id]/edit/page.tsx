import { notFound } from "next/navigation";
import { getProject } from "@/lib/data/projects";
import ProjectForm from "../../ProjectForm";
import { updateProjectAction } from "../../actions";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  const boundAction = updateProjectAction.bind(null, project.id, project.imageUrl);

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-copper">Projects</p>
      <h1 className="mt-2 font-display text-3xl tracking-tight text-paper">
        Edit {project.name}
      </h1>
      <ProjectForm project={project} action={boundAction} />
    </div>
  );
}
