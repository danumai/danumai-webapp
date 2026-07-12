"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { sendContactMessage } from "@/app/(site)/contact/actions";
import SubmitButton, { type SubmitState } from "@/components/ui/SubmitButton";

const topics = [
  "General",
  "BanglaReels",
  "Danumai Studios",
  "Care Technology",
  "Careers",
  "Press",
];

export default function ContactForm() {
  const params = useSearchParams();
  const preset = params.get("topic");
  const [topic, setTopic] = useState(
    preset && topics.includes(preset) ? preset : "General"
  );
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state !== "idle") return;
    const form = e.currentTarget;
    const data = new FormData(form);
    data.set("topic", topic);

    setState("loading");
    setError(null);
    const result = await sendContactMessage(data);
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
    <form onSubmit={onSubmit} className="space-y-5">
      <div role="radiogroup" aria-label="Topic" className="flex flex-wrap gap-2">
        {topics.map((t) => {
          const selected = t === topic;
          return (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setTopic(t)}
              className={`relative rounded-full px-4 py-2 text-xs transition-colors duration-300 ${
                selected ? "text-ink" : "text-mist hover:text-paper"
              }`}
            >
              {selected && (
                <motion.span
                  layoutId="topic-pill"
                  className="absolute inset-0 rounded-full bg-copper"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span
                className={`relative ${selected ? "" : "rounded-full"}`}
              >
                {t}
              </span>
              {!selected && (
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full border hairline"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-2 block text-xs uppercase tracking-[0.15em] text-faint">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            required
            autoComplete="name"
            placeholder="Your name"
            className="field"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-2 block text-xs uppercase tracking-[0.15em] text-faint">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="field"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-2 block text-xs uppercase tracking-[0.15em] text-faint">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder="What's on your mind?"
          className="field resize-y"
        />
      </div>

      <SubmitButton
        state={state}
        idleLabel="Send message"
        successLabel="Sent — we'll reply soon"
      />
      {error && (
        <p role="alert" className="text-xs leading-relaxed text-red-400">
          {error}
        </p>
      )}
      <p className="text-xs leading-relaxed text-faint">
        Goes straight to hello@danumai.com so we can write back.
      </p>
    </form>
  );
}
