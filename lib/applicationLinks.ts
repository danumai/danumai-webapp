// The catalog of optional links (GitHub, LinkedIn, resume, …) an applicant can
// attach to a job application.
// Shared by the public careers form (to render the "add a link" picker), the
// server action (to validate what was submitted), and the admin panel (to
// label each stored link). Keeping it in one plain module — no "use client"
// or "use server" — lets every layer agree on the same set of types.

export type ApplicationLink = {
  type: string;
  value: string;
};

export type LinkFieldDef = {
  type: string;
  label: string;
  placeholder: string;
};

export const LINK_FIELDS: readonly LinkFieldDef[] = [
  { type: "portfolio", label: "Portfolio", placeholder: "https://your-portfolio.com" },
  { type: "github", label: "GitHub", placeholder: "https://github.com/username" },
  { type: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/username" },
  { type: "resume", label: "Resume / CV", placeholder: "Link to your CV (PDF, Google Drive…)" },
  { type: "website", label: "Website", placeholder: "https://…" },
  { type: "twitter", label: "Twitter / X", placeholder: "https://x.com/username" },
  { type: "behance", label: "Behance", placeholder: "https://behance.net/username" },
  { type: "dribbble", label: "Dribbble", placeholder: "https://dribbble.com/username" },
  { type: "other", label: "Other link", placeholder: "https://…" },
] as const;

const FIELD_BY_TYPE = new Map(LINK_FIELDS.map((f) => [f.type, f]));

/** The type most people can add more than one of. */
const REPEATABLE = new Set(["other"]);

export function isRepeatableLinkType(type: string): boolean {
  return REPEATABLE.has(type);
}

export function linkFieldDef(type: string): LinkFieldDef | undefined {
  return FIELD_BY_TYPE.get(type);
}

export function linkLabel(type: string): string {
  return FIELD_BY_TYPE.get(type)?.label ?? "Link";
}

export function linkPlaceholder(type: string): string {
  return FIELD_BY_TYPE.get(type)?.placeholder ?? "https://…";
}

/**
 * Coerce an untrusted value (form payload, JSON column) into a clean list of
 * links: only known types, trimmed non-empty values, capped in count/length.
 */
export function normalizeApplicationLinks(input: unknown): ApplicationLink[] {
  if (!Array.isArray(input)) return [];
  const out: ApplicationLink[] = [];
  for (const item of input) {
    if (!item || typeof item !== "object") continue;
    const type = String((item as ApplicationLink).type ?? "");
    const value = String((item as ApplicationLink).value ?? "").trim();
    if (!FIELD_BY_TYPE.has(type) || !value) continue;
    out.push({ type, value: value.slice(0, 500) });
    if (out.length >= 12) break;
  }
  return out;
}
