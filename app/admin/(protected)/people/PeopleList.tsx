"use client";

import { useState, useTransition } from "react";
import type { Application, ContactMessage } from "@/lib/data/submissions";
import {
  toggleApplicationReadAction,
  deleteApplicationAction,
  toggleContactMessageReadAction,
  deleteContactMessageAction,
} from "./actions";

type Tab = "applications" | "messages";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function PeopleList({
  applications,
  messages,
}: {
  applications: Application[];
  messages: ContactMessage[];
}) {
  const [tab, setTab] = useState<Tab>("applications");
  const appUnread = applications.filter((a) => !a.read).length;
  const msgUnread = messages.filter((m) => !m.read).length;

  const tabs: { key: Tab; label: string; count: number; unread: number }[] = [
    {
      key: "applications",
      label: "Applications",
      count: applications.length,
      unread: appUnread,
    },
    {
      key: "messages",
      label: "Messages",
      count: messages.length,
      unread: msgUnread,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors ${
                active
                  ? "bg-copper/15 text-copper"
                  : "text-mist hover:text-copper-soft"
              }`}
            >
              {t.label}
              <span className="text-xs text-faint">{t.count}</span>
              {t.unread > 0 && (
                <span className="rounded-full bg-copper px-1.5 py-0.5 text-[10px] font-medium text-ink">
                  {t.unread}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {tab === "applications" ? (
        <ApplicationsList applications={applications} />
      ) : (
        <MessagesList messages={messages} />
      )}
    </div>
  );
}

function ApplicationsList({ applications }: { applications: Application[] }) {
  const [pending, startTransition] = useTransition();

  if (applications.length === 0) {
    return <p className="text-sm text-mist">No applications yet.</p>;
  }

  return (
    <ul className="space-y-4">
      {applications.map((a) => (
        <li
          key={a.id}
          className={`card p-5 ${a.read ? "opacity-70" : ""}`}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="flex flex-wrap items-center gap-2 font-display text-lg text-paper">
                {a.name}
                {!a.read && (
                  <span className="rounded-full bg-copper px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] text-ink">
                    New
                  </span>
                )}
              </p>
              <p className="mt-1 text-xs text-copper">
                {a.jobTitle || "General application"}
              </p>
              <p className="mt-1 text-xs text-faint">
                <a
                  href={`mailto:${a.email}`}
                  className="hover:text-copper-soft"
                >
                  {a.email}
                </a>
                {" · "}
                {formatDate(a.createdAt)}
              </p>
            </div>
            <RowActions
              read={a.read}
              pending={pending}
              onToggleRead={() =>
                startTransition(() =>
                  toggleApplicationReadAction(a.id, !a.read)
                )
              }
              onDelete={() => {
                if (confirm(`Delete application from ${a.name}?`)) {
                  startTransition(() => deleteApplicationAction(a.id));
                }
              }}
            />
          </div>
          {a.portfolio && (
            <p className="mt-3 break-words text-sm text-mist">
              <span className="text-faint">Work: </span>
              <a
                href={a.portfolio}
                target="_blank"
                rel="noreferrer"
                className="text-copper hover:text-copper-soft"
              >
                {a.portfolio}
              </a>
            </p>
          )}
          {a.note && (
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-mist">
              {a.note}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}

function MessagesList({ messages }: { messages: ContactMessage[] }) {
  const [pending, startTransition] = useTransition();

  if (messages.length === 0) {
    return <p className="text-sm text-mist">No messages yet.</p>;
  }

  return (
    <ul className="space-y-4">
      {messages.map((m) => (
        <li key={m.id} className={`card p-5 ${m.read ? "opacity-70" : ""}`}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="flex flex-wrap items-center gap-2 font-display text-lg text-paper">
                {m.name}
                {!m.read && (
                  <span className="rounded-full bg-copper px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] text-ink">
                    New
                  </span>
                )}
              </p>
              <p className="mt-1 text-xs text-copper">{m.topic}</p>
              <p className="mt-1 text-xs text-faint">
                <a
                  href={`mailto:${m.email}`}
                  className="hover:text-copper-soft"
                >
                  {m.email}
                </a>
                {" · "}
                {formatDate(m.createdAt)}
              </p>
            </div>
            <RowActions
              read={m.read}
              pending={pending}
              onToggleRead={() =>
                startTransition(() =>
                  toggleContactMessageReadAction(m.id, !m.read)
                )
              }
              onDelete={() => {
                if (confirm(`Delete message from ${m.name}?`)) {
                  startTransition(() => deleteContactMessageAction(m.id));
                }
              }}
            />
          </div>
          {m.message && (
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-mist">
              {m.message}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}

function RowActions({
  read,
  pending,
  onToggleRead,
  onDelete,
}: {
  read: boolean;
  pending: boolean;
  onToggleRead: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-4 text-sm">
      <button
        onClick={onToggleRead}
        disabled={pending}
        className="text-mist hover:text-copper-soft disabled:opacity-50"
      >
        {read ? "Mark unread" : "Mark read"}
      </button>
      <button
        onClick={onDelete}
        disabled={pending}
        className="text-red-400 hover:text-red-300 disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
