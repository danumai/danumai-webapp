"use client";

import { useState, useTransition } from "react";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import type {
  Application,
  ApplicationStatus,
  ContactMessage,
} from "@/lib/data/submissions";
import { linkLabel } from "@/lib/applicationLinks";
import {
  toggleApplicationReadAction,
  setApplicationStatusAction,
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

const VIEWS: { key: ApplicationStatus; label: string }[] = [
  { key: "active", label: "Active" },
  { key: "favorite", label: "Top candidates" },
  { key: "rejected", label: "Rejected" },
  { key: "trash", label: "Trash" },
];

function ApplicationsList({ applications }: { applications: Application[] }) {
  const [pending, startTransition] = useTransition();
  const [job, setJob] = useState("all");
  const [view, setView] = useState<ApplicationStatus>("active");
  const toast = useToast();
  const confirm = useConfirm();

  const setStatus = (a: Application, status: ApplicationStatus, label: string) =>
    startTransition(async () => {
      try {
        await setApplicationStatusAction(a.id, status);
        toast(`${a.name} → ${label}`, "success");
      } catch {
        toast("Couldn't update. Try again.", "error");
      }
    });

  // applications arrive newest-first; number them oldest = #1, stable across filtering
  const numbers = new Map(
    applications.map((a, i) => [a.id, applications.length - i])
  );

  const inView = applications.filter((a) => a.status === view);
  const jobs = Array.from(
    new Set(inView.map((a) => a.jobTitle || "General application"))
  ).sort();
  const filtered =
    job === "all"
      ? inView
      : inView.filter((a) => (a.jobTitle || "General application") === job);

  if (applications.length === 0) {
    return <p className="text-sm text-mist">No applications yet.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {VIEWS.map((v) => {
          const active = view === v.key;
          const count = applications.filter((a) => a.status === v.key).length;
          return (
            <button
              key={v.key}
              type="button"
              onClick={() => {
                setView(v.key);
                setJob("all");
              }}
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-colors ${
                active ? "bg-copper/15 text-copper" : "text-mist hover:text-copper-soft"
              }`}
            >
              {v.label}
              <span className="text-xs text-faint">{count}</span>
            </button>
          );
        })}
      </div>
      <select
        value={job}
        onChange={(e) => setJob(e.target.value)}
        className="rounded-lg bg-copper/10 px-3 py-2 text-sm text-paper"
      >
        <option value="all">All jobs ({inView.length})</option>
        {jobs.map((j) => (
          <option key={j} value={j}>
            {j} ({inView.filter((a) => (a.jobTitle || "General application") === j).length})
          </option>
        ))}
      </select>
      {filtered.length === 0 ? (
        <p className="text-sm text-mist">Nothing here.</p>
      ) : (
    <ul className="space-y-4">
      {filtered.map((a) => (
        <li
          key={a.id}
          className={`card p-5 ${a.read ? "opacity-70" : ""}`}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="flex flex-wrap items-center gap-2 font-display text-lg text-paper">
                <span className="text-faint">#{numbers.get(a.id)}</span>
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
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-3 text-sm">
              <button
                onClick={() =>
                  startTransition(() =>
                    toggleApplicationReadAction(a.id, !a.read)
                  )
                }
                disabled={pending}
                className="text-mist hover:text-copper-soft disabled:opacity-50"
              >
                {a.read ? "Mark unread" : "Mark read"}
              </button>
              {a.status !== "favorite" && (
                <button
                  onClick={() => setStatus(a, "favorite", "Top candidates")}
                  disabled={pending}
                  className="text-copper hover:text-copper-soft disabled:opacity-50"
                >
                  ★ Top candidate
                </button>
              )}
              {a.status !== "rejected" && (
                <button
                  onClick={() => setStatus(a, "rejected", "Rejected")}
                  disabled={pending}
                  className="text-mist hover:text-copper-soft disabled:opacity-50"
                >
                  Reject
                </button>
              )}
              {a.status !== "active" && (
                <button
                  onClick={() => setStatus(a, "active", "Active")}
                  disabled={pending}
                  className="text-mist hover:text-copper-soft disabled:opacity-50"
                >
                  Restore
                </button>
              )}
              {a.status !== "trash" ? (
                <button
                  onClick={() => setStatus(a, "trash", "Trash")}
                  disabled={pending}
                  className="text-red-400 hover:text-red-300 disabled:opacity-50"
                >
                  Trash
                </button>
              ) : (
                <button
                  onClick={async () => {
                    const ok = await confirm({
                      title: "Delete permanently",
                      message: `Permanently delete application from ${a.name}?`,
                      confirmLabel: "Delete",
                      destructive: true,
                    });
                    if (!ok) return;
                    startTransition(async () => {
                      try {
                        await deleteApplicationAction(a.id);
                        toast(`Deleted application from ${a.name}`, "success");
                      } catch {
                        toast("Couldn't delete application. Try again.", "error");
                      }
                    });
                  }}
                  disabled={pending}
                  className="text-red-400 hover:text-red-300 disabled:opacity-50"
                >
                  Delete forever
                </button>
              )}
            </div>
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
          {a.links.length > 0 && (
            <ul className="mt-3 space-y-1">
              {a.links.map((link, i) => (
                <li key={`${link.type}-${i}`} className="break-words text-sm text-mist">
                  <span className="text-faint">{linkLabel(link.type)}: </span>
                  <a
                    href={link.value}
                    target="_blank"
                    rel="noreferrer"
                    className="text-copper hover:text-copper-soft"
                  >
                    {link.value}
                  </a>
                </li>
              ))}
            </ul>
          )}
          {a.note && (
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-mist">
              {a.note}
            </p>
          )}
        </li>
      ))}
    </ul>
      )}
    </div>
  );
}

function MessagesList({ messages }: { messages: ContactMessage[] }) {
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const confirm = useConfirm();

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
              onDelete={async () => {
                const ok = await confirm({
                  title: "Delete message",
                  message: `Delete message from ${m.name}?`,
                  confirmLabel: "Delete",
                  destructive: true,
                });
                if (!ok) return;
                startTransition(async () => {
                  try {
                    await deleteContactMessageAction(m.id);
                    toast(`Deleted message from ${m.name}`, "success");
                  } catch {
                    toast("Couldn't delete message. Try again.", "error");
                  }
                });
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
