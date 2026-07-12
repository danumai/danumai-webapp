// Client-safe site-content model. This module has NO database imports, so it
// can be pulled into client components (for default values / types) as well as
// server code (for the admin editor and page rendering).
//
// Three things live here, kept in lock-step:
//   1. Per-section TypeScript types the components consume.
//   2. DEFAULT_CONTENT — the exact copy that used to be hardcoded in the
//      components, used as the fallback whenever the database has no override.
//   3. SECTIONS — a field schema that drives the generic admin editor, so a new
//      editable field is added in one place instead of hand-writing a form.

/* ------------------------------------------------------------------ types */

export type HeroContent = {
  badge: string;
  headline: string;
  accentWords: string[];
  subcopy: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
};

export type TickerContent = {
  ventures: string[];
  phrases: string[];
};

export type VenturesHeaderContent = {
  eyebrow: string;
  heading: string;
  accentWords: string[];
  intro: string;
};

export type StatItem = {
  value: number;
  suffix: string;
  label: string;
  accent: string;
};
export type StatsContent = { items: StatItem[] };

export type ApproachPrinciple = { n: string; title: string; body: string };
export type ApproachContent = {
  eyebrow: string;
  heading: string;
  accentWords: string[];
  principles: ApproachPrinciple[];
};

export type LabsCapability = {
  n: string;
  title: string;
  body: string;
  tags: string[];
  accent: string;
};
export type LabsContent = {
  eyebrow: string;
  heading: string;
  accentWords: string[];
  intro: string;
  capabilities: LabsCapability[];
};

export type ServiceCategory = {
  n: string;
  title: string;
  body: string;
  items: string[];
  accent: string;
};
export type ServicesContent = {
  eyebrow: string;
  heading: string;
  accentWords: string[];
  intro: string;
  categories: ServiceCategory[];
};

export type ManifestoCard = { title: string; body: string; accent: string };
export type ManifestoContent = {
  quoteLines: string[];
  resolveLines: string[];
  principleEyebrow: string;
  principleBody: string;
  cards: ManifestoCard[];
};

export type CtaContent = {
  heading: string;
  accentWords: string[];
  body: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
};

export type FooterLink = { label: string; href: string };
export type FooterContent = {
  blurb: string;
  ventures: FooterLink[];
  email: string;
  location: string;
  socials: FooterLink[];
};

export type SiteContent = {
  hero: HeroContent;
  ticker: TickerContent;
  ventures: VenturesHeaderContent;
  stats: StatsContent;
  approach: ApproachContent;
  services: ServicesContent;
  labs: LabsContent;
  manifesto: ManifestoContent;
  cta: CtaContent;
  footer: FooterContent;
};

export type SectionKey = keyof SiteContent;

/* --------------------------------------------------------------- defaults */

export const DEFAULT_CONTENT: SiteContent = {
  hero: {
    badge: "Danumai Inc. — building in 2026",
    headline: "A house of ventures, built and operated under one roof.",
    accentWords: ["ventures", "one", "roof"],
    subcopy:
      "We don’t build for clients. We build streaming, stories, and care technology for ourselves — engineered in-house by Danumai Labs, and run for the long haul.",
    primaryLabel: "Explore the ventures",
    primaryHref: "#ventures",
    secondaryLabel: "How we work",
    secondaryHref: "#approach",
  },
  ticker: {
    ventures: ["BanglaReels", "Danumai Studios", "Care Technology", "Danumai Labs"],
    phrases: [
      "Built for ourselves",
      "Operated for the long haul",
      "One roof, one engine",
      "No clients, by design",
    ],
  },
  ventures: {
    eyebrow: "Ventures",
    heading: "Three bets, one conviction.",
    accentWords: ["bets", "conviction"],
    intro:
      "Each venture stands on the same in-house platform — and each one is a product we run ourselves.",
  },
  stats: {
    items: [
      { value: 3, suffix: "", label: "Ventures in motion", accent: "#4f46e5" },
      { value: 1, suffix: "", label: "Shared platform beneath them", accent: "#e0402f" },
      { value: 300, suffix: "M+", label: "Bangla speakers we build for", accent: "#0d9488" },
      { value: 0, suffix: "", label: "Clients — by design", accent: "#d97706" },
    ],
  },
  approach: {
    eyebrow: "Approach",
    heading: "The way we choose to work.",
    accentWords: ["choose"],
    principles: [
      {
        n: "01",
        title: "We build for ourselves",
        body: "No client work, no agencies, no retainers. Every product we ship is one we own and operate — which means we live with every decision we make.",
      },
      {
        n: "02",
        title: "We operate what we build",
        body: "Shipping is the start, not the finish. The same team that engineers a product runs it in the market, so feedback loops are measured in days, not quarters.",
      },
      {
        n: "03",
        title: "One roof, shared engine",
        body: "Streaming, stories, and care technology look unrelated until you see the machinery underneath — shared infrastructure, shared design language, shared conviction.",
      },
      {
        n: "04",
        title: "Patience over hype",
        body: "We pick markets we understand deeply and commit for years. Compounding beats momentum, in products as in everything else.",
      },
    ],
  },
  services: {
    eyebrow: "Our Services",
    heading: "Branding, Design, Web Solutions.",
    accentWords: ["Design", "Solutions"],
    intro:
      "Danumai delivers tailored branding, innovative design, and custom web solutions that drive business growth. Our expertise in UI/UX design, video editing, digital marketing, and website development ensures seamless digital experiences that empower your brand to thrive in a competitive market.",
    categories: [
      {
        n: "01",
        title: "Video Editing",
        body: "Cinematic edits, motion, and sound that make every frame land.",
        items: [
          "Video Production",
          "Audio & Video Mastering",
          "Animations",
          "Transitions",
          "Professional Voice Over",
          "Royalty-Free Music",
        ],
        accent: "#e0402f",
      },
      {
        n: "02",
        title: "UI/UX Design",
        body: "Interfaces understood at a glance and loved in use.",
        items: [
          "SaaS Design",
          "Web Design",
          "Mobile App Design",
          "Software Design",
          "Wireframe",
          "Prototype",
        ],
        accent: "#4f46e5",
      },
      {
        n: "03",
        title: "Website Design",
        body: "Sites and stores engineered to convert, first pixel to checkout.",
        items: [
          "Landing Page",
          "eCommerce Solutions",
          "LMS Solutions",
          "Blog & Newspaper",
          "Custom Solutions",
        ],
        accent: "#0d9488",
      },
      {
        n: "04",
        title: "Graphic Design",
        body: "Identity systems that make a brand unmistakable everywhere.",
        items: [
          "Brand Identities",
          "Logo Design",
          "Stationery Design",
          "Social Media Design",
          "Design Solutions",
        ],
        accent: "#d97706",
      },
      {
        n: "05",
        title: "Digital Marketing",
        body: "Reach the right audience and climb the rankings that matter.",
        items: [
          "SEO",
          "SMM",
          "Facebook Ads",
          "Google Ads",
          "Google Ranking",
        ],
        accent: "#7c3aed",
      },
    ],
  },
  labs: {
    eyebrow: "Danumai Labs",
    heading: "The engineering room behind every venture.",
    accentWords: ["engineering", "room"],
    intro:
      "Not a department — the whole company’s build capability. Product, design, and engineering shipping from one shared codebase.",
    capabilities: [
      {
        n: "01",
        title: "Product engineering",
        body: "Full-stack, owned end to end — from the first line of code to what ships in production.",
        tags: ["Web", "Mobile", "Backend"],
        accent: "#d97706",
      },
      {
        n: "02",
        title: "Shared platform",
        body: "Auth, payments, media, and analytics — built once, hardened continuously, reused by every venture.",
        tags: ["Auth", "Payments", "Media"],
        accent: "#e0402f",
      },
      {
        n: "03",
        title: "Design system",
        body: "One visual language and component library spanning every Danumai product.",
        tags: ["Tokens", "Components", "Motion"],
        accent: "#0d9488",
      },
      {
        n: "04",
        title: "Applied AI",
        body: "Deployed where it earns its keep in the product experience — and nowhere else.",
        tags: ["Recsys", "Tooling", "Search"],
        accent: "#4f46e5",
      },
    ],
  },
  manifesto: {
    quoteLines: [
      "Most companies rent their future",
      "from someone else’s roadmap.",
    ],
    resolveLines: ["We decided to own ours."],
    principleEyebrow: "The Danumai principle",
    principleBody:
      "Every product under this roof is one we conceived, built, and still run ourselves — no client briefs, no borrowed vision.",
    cards: [
      {
        title: "Conceived",
        body: "Our own idea, not a client brief — every venture starts as a bet we chose to make.",
        accent: "#4f46e5",
      },
      {
        title: "Built",
        body: "Engineered in-house by Danumai Labs, on one shared platform we control end to end.",
        accent: "#c026d3",
      },
      {
        title: "Operated",
        body: "Run by us for the long haul — no borrowed vision, no exit-and-forget.",
        accent: "#d97706",
      },
    ],
  },
  cta: {
    heading: "Building something that belongs under this roof?",
    accentWords: ["roof"],
    body: "We’re always talking to engineers, storytellers, and operators who want to build for the long haul.",
    primaryLabel: "See open roles",
    primaryHref: "/careers",
    secondaryLabel: "Start a conversation",
    secondaryHref: "/contact",
  },
  footer: {
    blurb:
      "A house of ventures. We don’t build for clients — we build for ourselves, and we operate what we build.",
    ventures: [
      { label: "BanglaReels", href: "/#ventures" },
      { label: "Danumai Studios", href: "/#ventures" },
      { label: "Care Technology", href: "/#ventures" },
      { label: "Danumai Labs", href: "/#labs" },
    ],
    email: "hello@danumai.com",
    location: "Dhaka · Remote",
    socials: [
      { label: "LinkedIn", href: "https://www.linkedin.com/company/danumai" },
      { label: "X", href: "https://x.com/danumai" },
      { label: "GitHub", href: "https://github.com/danumai" },
      { label: "Instagram", href: "https://www.instagram.com/danumai" },
    ],
  },
};

/* ----------------------------------------------------------- editor schema */

export type FieldType = "text" | "textarea" | "number" | "color" | "list" | "group";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  help?: string;
  placeholder?: string;
  /** Sub-fields for a `group` (repeatable list of objects). */
  fields?: Field[];
  /** Singular noun for a group item, e.g. "stat" → "Add stat". */
  itemNoun?: string;
};

export type SectionSchema = {
  key: SectionKey;
  label: string;
  description: string;
  fields: Field[];
};

export const SECTIONS: SectionSchema[] = [
  {
    key: "hero",
    label: "Hero",
    description: "The first thing visitors see — headline, intro, and call-to-action buttons.",
    fields: [
      { name: "badge", label: "Badge text", type: "text" },
      { name: "headline", label: "Headline", type: "textarea" },
      { name: "accentWords", label: "Accent words", type: "list", help: "Words from the headline to highlight in copper (one per line)." },
      { name: "subcopy", label: "Supporting copy", type: "textarea" },
      { name: "primaryLabel", label: "Primary button label", type: "text" },
      { name: "primaryHref", label: "Primary button link", type: "text" },
      { name: "secondaryLabel", label: "Secondary button label", type: "text" },
      { name: "secondaryHref", label: "Secondary button link", type: "text" },
    ],
  },
  {
    key: "ticker",
    label: "Ticker",
    description: "The two scrolling marquee lanes between the hero and the ventures.",
    fields: [
      { name: "ventures", label: "Top lane (venture names)", type: "list" },
      { name: "phrases", label: "Bottom lane (phrases)", type: "list" },
    ],
  },
  {
    key: "ventures",
    label: "Ventures heading",
    description: "The heading above the venture cards. Manage the cards themselves under Projects.",
    fields: [
      { name: "eyebrow", label: "Eyebrow", type: "text" },
      { name: "heading", label: "Heading", type: "text" },
      { name: "accentWords", label: "Accent words", type: "list" },
      { name: "intro", label: "Intro", type: "textarea" },
    ],
  },
  {
    key: "stats",
    label: "Stats",
    description: "The four counting stat cards.",
    fields: [
      {
        name: "items",
        label: "Stats",
        type: "group",
        itemNoun: "stat",
        fields: [
          { name: "value", label: "Number", type: "number" },
          { name: "suffix", label: "Suffix", type: "text", placeholder: "e.g. M+" },
          { name: "label", label: "Label", type: "text" },
          { name: "accent", label: "Accent", type: "color" },
        ],
      },
    ],
  },
  {
    key: "approach",
    label: "Approach",
    description: "The timeline of working principles.",
    fields: [
      { name: "eyebrow", label: "Eyebrow", type: "text" },
      { name: "heading", label: "Heading", type: "text" },
      { name: "accentWords", label: "Accent words", type: "list" },
      {
        name: "principles",
        label: "Principles",
        type: "group",
        itemNoun: "principle",
        fields: [
          { name: "n", label: "Number", type: "text", placeholder: "01" },
          { name: "title", label: "Title", type: "text" },
          { name: "body", label: "Body", type: "textarea" },
        ],
      },
    ],
  },
  {
    key: "services",
    label: "Services",
    description: "The premium service catalogue — categories, each with a list of offerings.",
    fields: [
      { name: "eyebrow", label: "Eyebrow", type: "text" },
      { name: "heading", label: "Heading", type: "text" },
      { name: "accentWords", label: "Accent words", type: "list" },
      { name: "intro", label: "Intro", type: "textarea" },
      {
        name: "categories",
        label: "Categories",
        type: "group",
        itemNoun: "category",
        fields: [
          { name: "n", label: "Number", type: "text", placeholder: "01" },
          { name: "title", label: "Title", type: "text" },
          { name: "body", label: "Body", type: "textarea" },
          { name: "items", label: "Offerings", type: "list" },
          { name: "accent", label: "Accent", type: "color" },
        ],
      },
    ],
  },
  {
    key: "labs",
    label: "Danumai Labs",
    description: "The interactive capabilities console.",
    fields: [
      { name: "eyebrow", label: "Eyebrow", type: "text" },
      { name: "heading", label: "Heading", type: "text" },
      { name: "accentWords", label: "Accent words", type: "list" },
      { name: "intro", label: "Intro", type: "textarea" },
      {
        name: "capabilities",
        label: "Capabilities",
        type: "group",
        itemNoun: "capability",
        help: "The visual exhibit for each capability follows its position in this list.",
        fields: [
          { name: "n", label: "Number", type: "text", placeholder: "01" },
          { name: "title", label: "Title", type: "text" },
          { name: "body", label: "Body", type: "textarea" },
          { name: "tags", label: "Tags", type: "list" },
          { name: "accent", label: "Accent", type: "color" },
        ],
      },
    ],
  },
  {
    key: "manifesto",
    label: "Manifesto",
    description: "The centered pull-quote and principle cards.",
    fields: [
      { name: "quoteLines", label: "Quote lines", type: "list", help: "The dimmed opening lines (one per line)." },
      { name: "resolveLines", label: "Resolving lines", type: "list", help: "The highlighted closing lines (one per line)." },
      { name: "principleEyebrow", label: "Principle eyebrow", type: "text" },
      { name: "principleBody", label: "Principle body", type: "textarea" },
      {
        name: "cards",
        label: "Cards",
        type: "group",
        itemNoun: "card",
        fields: [
          { name: "title", label: "Title", type: "text" },
          { name: "body", label: "Body", type: "textarea" },
          { name: "accent", label: "Accent", type: "color" },
        ],
      },
    ],
  },
  {
    key: "cta",
    label: "Call to action",
    description: "The closing invitation above the footer.",
    fields: [
      { name: "heading", label: "Heading", type: "textarea" },
      { name: "accentWords", label: "Accent words", type: "list" },
      { name: "body", label: "Body", type: "textarea" },
      { name: "primaryLabel", label: "Primary button label", type: "text" },
      { name: "primaryHref", label: "Primary button link", type: "text" },
      { name: "secondaryLabel", label: "Secondary button label", type: "text" },
      { name: "secondaryHref", label: "Secondary button link", type: "text" },
    ],
  },
  {
    key: "footer",
    label: "Footer",
    description: "Footer blurb, links, contact details, and social profiles.",
    fields: [
      { name: "blurb", label: "Blurb", type: "textarea" },
      { name: "email", label: "Contact email", type: "text" },
      { name: "location", label: "Location", type: "text" },
      {
        name: "ventures",
        label: "Venture links",
        type: "group",
        itemNoun: "link",
        fields: [
          { name: "label", label: "Label", type: "text" },
          { name: "href", label: "Link", type: "text" },
        ],
      },
      {
        name: "socials",
        label: "Social links",
        type: "group",
        itemNoun: "social",
        help: "Recognized labels (LinkedIn, X, GitHub, Instagram) get their brand icon automatically.",
        fields: [
          { name: "label", label: "Label", type: "text" },
          { name: "href", label: "Link", type: "text" },
        ],
      },
    ],
  },
];

/* ---------------------------------------------------------------- helpers */

/** Coerce an arbitrary parsed-JSON value into a valid section object, using the
 *  schema for shape and DEFAULT_CONTENT for any missing/invalid field. Used by
 *  both the admin save action and the DB read path so bad data can never crash
 *  the public site. */
export function coerceSection<K extends SectionKey>(
  key: K,
  raw: unknown
): SiteContent[K] {
  const schema = SECTIONS.find((s) => s.key === key);
  const fallback = DEFAULT_CONTENT[key] as Record<string, unknown>;
  if (!schema || typeof raw !== "object" || raw === null) {
    return DEFAULT_CONTENT[key];
  }
  const input = raw as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const field of schema.fields) {
    out[field.name] = coerceField(field, input[field.name], fallback[field.name]);
  }
  return out as SiteContent[K];
}

function coerceField(field: Field, value: unknown, fallback: unknown): unknown {
  switch (field.type) {
    case "text":
    case "textarea":
    case "color":
      return typeof value === "string" ? value : String(fallback ?? "");
    case "number": {
      const n = typeof value === "number" ? value : Number(value);
      return Number.isFinite(n) ? n : Number(fallback ?? 0);
    }
    case "list":
      return Array.isArray(value)
        ? value.map((v) => String(v)).filter((v) => v.trim().length > 0)
        : (fallback as string[]) ?? [];
    case "group": {
      if (!Array.isArray(value)) return (fallback as unknown[]) ?? [];
      return value.map((item) => {
        const rec = (item ?? {}) as Record<string, unknown>;
        const obj: Record<string, unknown> = {};
        for (const sub of field.fields ?? []) {
          obj[sub.name] = coerceField(sub, rec[sub.name], subFallback(sub));
        }
        return obj;
      });
    }
    default:
      return fallback;
  }
}

function subFallback(field: Field): unknown {
  switch (field.type) {
    case "number":
      return 0;
    case "list":
      return [];
    default:
      return "";
  }
}
