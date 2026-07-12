// Server-side renderer for a story's plain-text body. No markdown dependency —
// we support just enough structure to keep long-form posts readable:
//   • blank line              → new paragraph
//   • line starting "## "     → subheading (h2)
//   • consecutive "- " lines  → bullet list
// Inline "**bold**" spans are honored within paragraphs and list items.

import type { ReactNode } from "react";

function renderInline(text: string): ReactNode[] {
  // Split on **bold** while keeping the delimiters' content.
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={i} className="font-medium text-paper">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function StoryBody({ body }: { body: string }) {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];

  let paragraph: string[] = [];
  let bullets: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    const text = paragraph.join(" ").trim();
    if (text) {
      blocks.push(
        <p key={`p-${blocks.length}`} className="text-mist">
          {renderInline(text)}
        </p>
      );
    }
    paragraph = [];
  };

  const flushBullets = () => {
    if (bullets.length === 0) return;
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="list-disc space-y-2 pl-5 text-mist marker:text-copper">
        {bullets.map((b, i) => (
          <li key={i}>{renderInline(b)}</li>
        ))}
      </ul>
    );
    bullets = [];
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.trim() === "") {
      flushParagraph();
      flushBullets();
      continue;
    }
    if (line.startsWith("## ")) {
      flushParagraph();
      flushBullets();
      blocks.push(
        <h2
          key={`h-${blocks.length}`}
          className="pt-2 font-display text-2xl tracking-tight text-paper"
        >
          {renderInline(line.slice(3).trim())}
        </h2>
      );
      continue;
    }
    if (line.startsWith("- ")) {
      flushParagraph();
      bullets.push(line.slice(2).trim());
      continue;
    }
    flushBullets();
    paragraph.push(line.trim());
  }
  flushParagraph();
  flushBullets();

  return (
    <div className="space-y-6 text-base leading-relaxed [&_h2]:mt-4">{blocks}</div>
  );
}
