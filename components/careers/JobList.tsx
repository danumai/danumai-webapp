"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState, type CSSProperties } from "react";
import { sendApplication } from "@/app/(site)/careers/actions";
import SubmitButton, { type SubmitState } from "@/components/ui/SubmitButton";
import {
  LINK_FIELDS,
  linkLabel,
  linkPlaceholder,
  isRepeatableLinkType,
} from "@/lib/applicationLinks";

type Job = {
  id: string;
  title: string;
  team: string;
  location: string;
  type: string;
  salary: string;
  summary: string;
  points: string[];
  perks: string[];
};

// Small inline icons (currentColor, 14px) for the single-line meta row —
// matches the stroke-icon style used elsewhere in the site.
const iconProps = {
  width: 14,
  height: 14,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const LocationIcon = () => (
  <svg {...iconProps} aria-hidden>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const SalaryIcon = () => (
  <svg {...iconProps} aria-hidden>
    <circle cx="8" cy="8" r="6" />
    <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
    <path d="M7 6h1v4" />
    <path d="m16.71 13.88.7.71-2.82 2.82" />
  </svg>
);

const TypeIcon = () => (
  <svg {...iconProps} aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const TeamIcon = () => (
  <svg {...iconProps} aria-hidden>
    <rect width="20" height="14" x="2" y="7" rx="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const CheckIcon = () => (
  <svg {...iconProps} width={12} height={12} aria-hidden>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const PlusIcon = () => (
  <svg {...iconProps} width={13} height={13} aria-hidden>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

function MetaItem({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
      <span className="text-copper/80">{icon}</span>
      {children}
    </span>
  );
}

// Fallback list shown if the database isn't reachable (e.g. DATABASE_URL not
// configured yet), so the careers page still renders something useful.
const DEFAULT_PERKS = ["2× festival bonus", "Lunch provided", "Device provided"];

const defaultJobs: Job[] = [
  {
    id: "senior-react-native-engineer",
    title: "Senior React Native Engineer — Video & Performance",
    team: "Danumai Labs",
    location: "Niketon, Dhaka · Onsite",
    type: "Full-time",
    salary: "BDT 50,000/mo",
    summary:
      "Own the video player and episode feed for our short-drama app — where viewers watch a short ad to unlock the next episode — and make it run smoothly on every phone.",
    points: [
      "3+ years of React Native, with production apps live on the Play Store / App Store",
      "Strong JavaScript/TypeScript and React fundamentals — hooks, rendering, state",
      "Hands-on video playback in React Native (react-native-video / ExoPlayer): preloading, caching, smooth feeds",
      "Proven performance work on low-end Android — startup, scrolling, memory, frame rate (FlatList/FlashList, Hermes, profiling)",
      "Integrate rewarded video ad SDKs (AdMob / AppLovin) into the watch-ad → unlock-episode flow",
      "Guide and review the work of our mid-level React Native engineers",
      "Nice to have: ad SDK integration, Reanimated, Expo/EAS, mobile CI",
    ],
    perks: DEFAULT_PERKS,
  },
  {
    id: "backend-engineer-nestjs",
    title: "Backend Engineer (NestJS) — Mid-Level",
    team: "Danumai Labs",
    location: "Niketon, Dhaka · Onsite",
    type: "Full-time",
    salary: "BDT 35,000–40,000/mo",
    summary:
      "Build the REST APIs behind our short-drama app in NestJS + TypeScript — content feeds, episode unlocks, user accounts, and the ad-reward platform.",
    points: [
      "2–4 years of backend development with Node.js + TypeScript",
      "Production experience with NestJS (or strong Express + TypeScript, ready to work in Nest)",
      "Solid NestJS basics: modules, dependency injection, DTO validation, guards",
      "Good PostgreSQL skills: schema design, joins, indexing, and efficient queries",
      "Verify rewarded-ad callbacks and unlock episodes reliably — webhooks/callbacks, JWT auth, API security",
      "Nice to have: Redis for caching and jobs, Docker, TypeORM/Prisma, high-traffic consumer APIs",
    ],
    perks: DEFAULT_PERKS,
  },
  {
    id: "react-native-engineer",
    title: "React Native Engineer — Mid-Level",
    team: "Danumai Labs",
    location: "Niketon, Dhaka · Onsite",
    type: "Full-time",
    salary: "BDT 30,000–35,000/mo",
    summary:
      "Ship user-facing app features every week — series pages, unlock screens, search, profiles, onboarding — turning Figma into clean UI for Android and iOS.",
    points: [
      "2–3 years of React Native with at least one production app shipped",
      "Strong JavaScript/TypeScript and React fundamentals — hooks, props/state, rendering",
      "React Navigation, REST API integration, async storage, forms and validation",
      "Convert Figma designs into clean, responsive UI for both Android and iOS",
      "An eye for UI detail and speed — we ship weekly",
      "Nice to have: Expo/EAS, Reanimated, push notifications (FCM), app release experience",
    ],
    perks: DEFAULT_PERKS,
  },
  {
    id: "fullstack-engineer-nextjs",
    title: "Fullstack Engineer (Next.js) — Mid-Level",
    team: "Danumai Labs",
    location: "Niketon, Dhaka · Onsite",
    type: "Full-time",
    salary: "BDT 35,000–40,000/mo",
    summary:
      "Build our internal tools in Next.js + TypeScript — content management, an ad campaign dashboard, and analytics views — wired to our NestJS backend and PostgreSQL.",
    points: [
      "2–4 years of web development with React; 1+ year with Next.js in production",
      "Strong TypeScript, with a clear grasp of server vs client components and SSR/SSG",
      "Comfortable with PostgreSQL (Prisma/TypeORM or SQL) and REST APIs",
      "Build clean, usable dashboards with Tailwind CSS — auth, forms, and data tables",
      "Create API routes / server actions connecting to the NestJS backend",
      "Nice to have: NestJS familiarity, charting (Recharts/Chart.js), file/media upload handling",
    ],
    perks: DEFAULT_PERKS,
  },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Monotonic id for link rows so React keeps stable keys as rows are added and
// removed — avoids calling Date.now() (impure) during an interaction.
let nextLinkKey = 0;

// Lets an applicant attach optional links (GitHub, LinkedIn, resume, …) without
// cluttering the form: nothing shows until they pick a field from the menu, and
// each added field can be removed again.
function LinksField({
  links,
  onChange,
}: {
  links: LinkRow[];
  onChange: (next: LinkRow[]) => void;
}) {
  // A type can be offered until it's been added, except the repeatable ones.
  const used = new Set(links.map((l) => l.type));
  const available = LINK_FIELDS.filter(
    (f) => isRepeatableLinkType(f.type) || !used.has(f.type)
  );

  const add = (type: string) => {
    if (!type) return;
    onChange([...links, { key: nextLinkKey++, type, value: "" }]);
  };
  const update = (key: number, value: string) =>
    onChange(links.map((l) => (l.key === key ? { ...l, value } : l)));
  const remove = (key: number) => onChange(links.filter((l) => l.key !== key));

  return (
    <div className="mt-5 space-y-4">
      {links.length > 0 && (
        <div className="space-y-2.5">
          {links.map((row) => (
            <div key={row.key} className="flex items-center gap-2.5">
              <span className="w-24 shrink-0 text-xs uppercase tracking-[0.12em] text-faint">
                {linkLabel(row.type)}
              </span>
              <input
                value={row.value}
                onChange={(e) => update(row.key, e.target.value)}
                placeholder={linkPlaceholder(row.type)}
                aria-label={linkLabel(row.type)}
                className="field flex-1"
              />
              <button
                type="button"
                onClick={() => remove(row.key)}
                aria-label={`Remove ${linkLabel(row.type)}`}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border hairline text-mist transition-colors hover:border-red-400/40 hover:text-red-400"
              >
                <span className="text-base leading-none" aria-hidden>
                  ×
                </span>
              </button>
            </div>
          ))}
        </div>
      )}

      {available.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-faint">
            Attach links — optional
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {available.map((f) => (
              <button
                key={f.type}
                type="button"
                onClick={() => add(f.type)}
                className="inline-flex items-center gap-1.5 rounded-full border hairline bg-ink-2/40 px-3 py-1.5 text-xs text-mist transition-colors hover:border-copper/40 hover:text-copper-soft"
              >
                <span className="text-copper" aria-hidden>
                  <PlusIcon />
                </span>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// A row in the applicant's chosen set of links. `key` is a stable client-side
// id so React can track rows as they're added/removed.
type LinkRow = { key: number; type: string; value: string };

function ApplyForm({ jobTitle }: { jobTitle: string }) {
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [links, setLinks] = useState<LinkRow[]>([]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state !== "idle") return;
    const form = e.currentTarget;
    const data = new FormData(form);
    data.set(
      "links",
      JSON.stringify(
        links
          .map((l) => ({ type: l.type, value: l.value.trim() }))
          .filter((l) => l.value)
      )
    );

    setState("loading");
    setError(null);
    const result = await sendApplication(jobTitle, data);
    if (result.status === "success") {
      setState("success");
      form.reset();
      setLinks([]);
      setTimeout(() => setState("idle"), 4000);
    } else {
      setState("idle");
      setError(result.message ?? "Something went wrong.");
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="card mt-8 p-5 md:p-6"
      style={{ "--card-accent": "#4f46e5" } as CSSProperties}
    >
      <p className="text-xs uppercase tracking-[0.2em] text-faint">
        Apply for this role
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <input
          name="name"
          required
          autoComplete="name"
          placeholder="Your name"
          aria-label="Your name"
          className="field"
        />
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          aria-label="Your email"
          className="field"
        />
      </div>
      <LinksField links={links} onChange={setLinks} />
      <textarea
        name="note"
        required
        rows={3}
        placeholder="Why you, why this role — three sentences is plenty."
        aria-label="Why you"
        className="field mt-4 resize-y"
      />
      <div className="mt-5">
        <SubmitButton
          state={state}
          idleLabel="Send application"
          successLabel="Sent — we'll reply soon"
        />
      </div>
      {error && (
        <p role="alert" className="mt-3 text-xs leading-relaxed text-red-400">
          {error}
        </p>
      )}
    </form>
  );
}

export default function JobList({ jobs = defaultJobs }: { jobs?: Job[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const reduce = useReducedMotion();

  return (
    <ul className="border-t hairline">
      {jobs.map((job, i) => {
        const isOpen = open === job.id;
        return (
          <motion.li
            key={job.id}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32 }}
            whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
            className="border-b hairline"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : job.id)}
              aria-expanded={isOpen}
              aria-controls={`job-${job.id}`}
              className="group flex w-full items-center justify-between gap-6 py-7 text-left transition-colors hover:text-copper-soft"
            >
              <span className="flex flex-col gap-1">
                <span className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="pulse-dot h-1.5 w-1.5 rounded-full bg-copper"
                  />
                  <span className="font-display text-xl tracking-tight text-paper transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 md:text-2xl">
                    {job.title}
                  </span>
                </span>
                <span className="flex flex-wrap items-center gap-x-3.5 gap-y-2 pl-[18px] text-xs text-faint">
                  {job.salary && (
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-copper/25 bg-copper/10 px-2.5 py-1 font-semibold tracking-normal text-copper-soft">
                      <SalaryIcon />
                      {job.salary}
                    </span>
                  )}
                  <MetaItem icon={<LocationIcon />}>{job.location}</MetaItem>
                  <MetaItem icon={<TypeIcon />}>{job.type}</MetaItem>
                  {job.team && <MetaItem icon={<TeamIcon />}>{job.team}</MetaItem>}
                </span>
              </span>
              <motion.span
                aria-hidden
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="text-xl text-mist"
              >
                +
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`job-${job.id}`}
                  initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  animate={
                    reduce
                      ? { opacity: 1 }
                      : { height: "auto", opacity: 1 }
                  }
                  exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.55, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="pb-8 pl-[18px] pr-4">
                    <p className="max-w-xl text-sm leading-relaxed text-mist">
                      {job.summary}
                    </p>
                    <ul className="mt-5 space-y-2.5">
                      {job.points.map((pt) => (
                        <li
                          key={pt}
                          className="flex gap-3 text-sm text-mist"
                        >
                          <span className="text-copper" aria-hidden>
                            —
                          </span>
                          {pt}
                        </li>
                      ))}
                    </ul>
                    {job.perks.length > 0 && (
                      <div className="mt-7">
                        <p className="text-xs uppercase tracking-[0.2em] text-faint">
                          Benefits &amp; perks
                        </p>
                        <ul className="mt-3 flex flex-wrap gap-2">
                          {job.perks.map((perk) => (
                            <li
                              key={perk}
                              className="inline-flex items-center gap-1.5 rounded-full border hairline bg-ink-2/40 px-3 py-1.5 text-xs text-mist"
                            >
                              <span className="text-copper" aria-hidden>
                                <CheckIcon />
                              </span>
                              {perk}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <ApplyForm jobTitle={job.title} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.li>
        );
      })}
    </ul>
  );
}
