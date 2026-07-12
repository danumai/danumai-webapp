import Link from "next/link";
import { listProjects } from "@/lib/data/projects";
import ProjectsList from "./ProjectsList";

export default async function AdminProjectsPage() {
  const projects = await listProjects();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-copper">Projects</p>
          <h1 className="mt-2 font-display text-3xl tracking-tight text-paper">
            Ventures
          </h1>
          <p className="mt-2 text-sm text-mist">
            Reorder with the arrows, show/hide from the homepage, or quick-edit inline.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="rounded-full bg-copper px-5 py-2.5 text-sm font-medium text-ink hover:bg-copper-soft"
        >
          New project
        </Link>
      </div>

      <ProjectsList projects={projects} />
    </div>
  );
}
