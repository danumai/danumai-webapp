import Link from "next/link";
import { listProjects } from "@/lib/data/projects";
import { listJobs } from "@/lib/data/jobs";
import { listStories } from "@/lib/data/stories";
import { listApplications, listContactMessages } from "@/lib/data/submissions";
import { SECTIONS } from "@/lib/content";

export default async function AdminDashboard() {
  const [projects, jobs, stories, applications, messages] = await Promise.all([
    listProjects(),
    listJobs(),
    listStories(),
    listApplications(),
    listContactMessages(),
  ]);

  const publishedProjects = projects.filter((p) => p.published).length;
  const publishedJobs = jobs.filter((j) => j.published).length;
  const publishedStories = stories.filter((s) => s.published).length;
  const totalPeople = applications.length + messages.length;
  const unreadPeople =
    applications.filter((a) => !a.read).length +
    messages.filter((m) => !m.read).length;

  const stats = [
    {
      label: "Projects",
      href: "/admin/projects",
      total: projects.length,
      sub: `${publishedProjects} shown · ${projects.length - publishedProjects} hidden`,
      blurb: "Ventures shown on the homepage.",
    },
    {
      label: "Jobs",
      href: "/admin/jobs",
      total: jobs.length,
      sub: `${publishedJobs} published · ${jobs.length - publishedJobs} draft`,
      blurb: "Open roles on the careers page.",
    },
    {
      label: "Stories",
      href: "/admin/stories",
      total: stories.length,
      sub: `${publishedStories} published · ${stories.length - publishedStories} draft`,
      blurb: "Posts on plans, goals, and vision.",
    },
    {
      label: "People",
      href: "/admin/people",
      total: totalPeople,
      sub: `${unreadPeople} unread · ${applications.length} applied · ${messages.length} messages`,
      blurb: "Applications and contact-form messages.",
    },
    {
      label: "Content sections",
      href: "/admin/content",
      total: SECTIONS.length,
      sub: "Homepage & footer copy",
      blurb: "Edit every section of the public site.",
    },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-copper">Overview</p>
          <h1 className="mt-2 font-display text-3xl tracking-tight text-paper">
            Dashboard
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/projects/new"
            className="rounded-full bg-copper px-4 py-2 text-sm font-medium text-ink hover:bg-copper-soft"
          >
            + New project
          </Link>
          <Link
            href="/admin/jobs/new"
            className="rounded-full border hairline px-4 py-2 text-sm text-paper hover:border-copper/40 hover:text-copper-soft"
          >
            + New job
          </Link>
          <Link
            href="/admin/stories/new"
            className="rounded-full border hairline px-4 py-2 text-sm text-paper hover:border-copper/40 hover:text-copper-soft"
          >
            + New story
          </Link>
          <Link
            href="/"
            target="_blank"
            className="rounded-full border hairline px-4 py-2 text-sm text-paper hover:border-copper/40 hover:text-copper-soft"
          >
            View site ↗
          </Link>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card card-hover p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-faint">{s.label}</p>
            <p className="mt-2 font-display text-4xl text-paper">{s.total}</p>
            <p className="mt-2 text-xs text-copper">{s.sub}</p>
            <p className="mt-3 text-sm text-mist">{s.blurb}</p>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="font-display text-lg text-paper">Edit site content</h2>
        <p className="mt-1 text-sm text-mist">
          Jump straight to any section of the public homepage or footer.
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {SECTIONS.map((s) => (
            <li key={s.key}>
              <Link
                href={`/admin/content/${s.key}`}
                className="inline-block rounded-full border hairline px-4 py-2 text-sm text-mist transition-colors hover:border-copper/40 hover:text-copper-soft"
              >
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
