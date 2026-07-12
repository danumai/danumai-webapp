import SmoothScroll from "@/components/providers/SmoothScroll";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import ScrollToTop from "@/components/ui/ScrollToTop";
import Cursor from "@/components/ui/Cursor";

/**
 * Marketing-site chrome. Everything under (site) — home, careers, contact —
 * gets the smooth scroll, custom cursor, scroll progress, nav, and footer.
 * The /admin section deliberately lives outside this group so it renders
 * with its own bare, app-style layout instead of the public site shell.
 */
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SmoothScroll>
      <Cursor />
      <ScrollProgress />
      <ScrollToTop />
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </SmoothScroll>
  );
}
