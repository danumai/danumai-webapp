import Hero from "@/components/Hero";
import Ticker from "@/components/sections/Ticker";
import VentureShowcase from "@/components/sections/VentureShowcase";
import Stats from "@/components/sections/Stats";
import Approach from "@/components/sections/Approach";
import Services from "@/components/sections/Services";
import Labs from "@/components/sections/Labs";
import Manifesto from "@/components/sections/Manifesto";
import CTA from "@/components/sections/CTA";
import { listProjects } from "@/lib/data/projects";
import { getSiteContent } from "@/lib/data/content";
import { DEFAULT_CONTENT } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Both fall back to built-in defaults if the database isn't reachable (e.g.
  // DATABASE_URL not configured yet), so the site still renders end to end.
  const [projects, content] = await Promise.all([
    listProjects({ publishedOnly: true }).catch((err) => {
      console.error("Failed to load projects", err);
      return undefined;
    }),
    getSiteContent().catch((err) => {
      console.error("Failed to load site content", err);
      return DEFAULT_CONTENT;
    }),
  ]);

  return (
    <>
      <Hero content={content.hero} />
      <Ticker content={content.ticker} />
      <VentureShowcase projects={projects} header={content.ventures} />
      <Stats content={content.stats} />
      <Approach content={content.approach} />
      <Services content={content.services} />
      <Labs content={content.labs} />
      <Manifesto content={content.manifesto} />
      <CTA content={content.cta} />
    </>
  );
}
