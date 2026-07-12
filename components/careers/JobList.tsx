"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState, type CSSProperties } from "react";
import { sendApplication } from "@/app/(site)/careers/actions";
import SubmitButton, { type SubmitState } from "@/components/ui/SubmitButton";

type Job = {
  id: string;
  title: string;
  team: string;
  location: string;
  type: string;
  summary: string;
  points: string[];
};

// Fallback list shown if the database isn't reachable (e.g. DATABASE_URL not
// configured yet), so the careers page still renders something useful.
const defaultJobs: Job[] = [
  {
    id: "founding-product-engineer",
    title: "Founding Product Engineer",
    team: "Danumai Labs",
    location: "Dhaka · Remote",
    type: "Full-time",
    summary:
      "Own features end to end across BanglaReels and the shared platform — from data model to the last easing curve.",
    points: [
      "TypeScript, React, Next.js across web and mobile web",
      "You've shipped and operated products, not just built them",
      "Care about motion, accessibility, and the last 5% of polish",
    ],
  },
  {
    id: "motion-designer",
    title: "Product & Motion Designer",
    team: "Danumai Labs",
    location: "Remote",
    type: "Full-time",
    summary:
      "Define how Danumai products feel — a single design language spanning streaming, stories, and care.",
    points: [
      "Strong interaction and motion portfolio (Figma + prototypes)",
      "Comfortable working directly in the codebase with engineers",
      "Taste for restraint: one accent color, spacing over decoration",
    ],
  },
  {
    id: "content-producer",
    title: "Content Producer, Serials",
    team: "Danumai Studios",
    location: "Dhaka",
    type: "Contract → Full-time",
    summary:
      "Run vertical micro-drama productions from script to screen for BanglaReels.",
    points: [
      "Experience producing short-form or episodic video",
      "Fluent Bangla; deep feel for what the audience actually watches",
      "Scrappy: small crews, fast cycles, owned outcomes",
    ],
  },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function ApplyForm({ jobTitle }: { jobTitle: string }) {
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state !== "idle") return;
    const form = e.currentTarget;
    const data = new FormData(form);

    setState("loading");
    setError(null);
    const result = await sendApplication(jobTitle, data);
    if (result.status === "success") {
      setState("success");
      form.reset();
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
      <input
        name="portfolio"
        placeholder="Portfolio, GitHub, or best work (link)"
        aria-label="Portfolio link"
        className="field mt-4"
      />
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
                <span className="pl-[18px] text-xs uppercase tracking-[0.18em] text-faint">
                  {job.team} · {job.location} · {job.type}
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
