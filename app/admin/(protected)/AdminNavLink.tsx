"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Nav link that highlights when the current route is within its section. */
export default function AdminNavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1.5 transition-colors ${
        active
          ? "bg-copper/15 text-copper"
          : "text-mist hover:text-copper-soft"
      }`}
    >
      {children}
    </Link>
  );
}
