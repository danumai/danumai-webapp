import Link from "next/link";
import { logout } from "../login/actions";
import AdminNavLink from "./AdminNavLink";

// Admin pages are session-gated and read live data on every request; never
// attempt to prerender them at build time.
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-ink text-paper">
      <header className="sticky top-0 z-50 border-b hairline bg-ink/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-6 py-4">
          <Link
            href="/admin"
            className="font-display text-lg tracking-tight text-paper"
          >
            Danumai <span className="text-copper">Admin</span>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <AdminNavLink href="/admin/projects">Projects</AdminNavLink>
            <AdminNavLink href="/admin/jobs">Jobs</AdminNavLink>
            <AdminNavLink href="/admin/stories">Stories</AdminNavLink>
            <AdminNavLink href="/admin/people">People</AdminNavLink>
            <AdminNavLink href="/admin/content">Content</AdminNavLink>
            <Link
              href="/"
              target="_blank"
              className="rounded-full px-3 py-1.5 text-mist transition-colors hover:text-copper-soft"
            >
              View site ↗
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-full px-3 py-1.5 text-mist transition-colors hover:text-copper-soft"
              >
                Log out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        {children}
      </main>
    </div>
  );
}
