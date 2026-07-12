"use client";

import { useActionState, useState } from "react";
import type { Field, SectionKey } from "@/lib/content";
import { saveSectionAction, type SectionFormState } from "../actions";

const initialState: SectionFormState = {};

type Value = Record<string, unknown>;

export default function SectionForm({
  sectionKey,
  fields,
  initialValue,
}: {
  sectionKey: SectionKey;
  fields: Field[];
  initialValue: Value;
}) {
  const [value, setValue] = useState<Value>(initialValue);
  const boundAction = saveSectionAction.bind(null, sectionKey);
  const [state, formAction, pending] = useActionState(boundAction, initialState);

  const setField = (name: string, v: unknown) =>
    setValue((prev) => ({ ...prev, [name]: v }));

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <input type="hidden" name="payload" value={JSON.stringify(value)} />

      {fields.map((field) => (
        <FieldRow
          key={field.name}
          field={field}
          value={value[field.name]}
          onChange={(v) => setField(field.name, v)}
        />
      ))}

      {state.error && (
        <p role="alert" className="text-sm text-red-400">
          {state.error}
        </p>
      )}
      {state.ok && !pending && (
        <p className="text-sm text-emerald-400">Saved. The live site is updated.</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-copper px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-copper-soft disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}

function Labelled({
  label,
  help,
  children,
}: {
  label: string;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="text-xs uppercase tracking-[0.15em] text-faint">{label}</span>
      {help && <span className="mt-1 block text-xs text-mist/70">{help}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function FieldRow({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  switch (field.type) {
    case "text":
      return (
        <Labelled label={field.label} help={field.help}>
          <input
            className="field"
            placeholder={field.placeholder}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
          />
        </Labelled>
      );
    case "textarea":
      return (
        <Labelled label={field.label} help={field.help}>
          <textarea
            rows={3}
            className="field resize-y"
            placeholder={field.placeholder}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
          />
        </Labelled>
      );
    case "number":
      return (
        <Labelled label={field.label} help={field.help}>
          <input
            type="number"
            className="field"
            value={Number(value ?? 0)}
            onChange={(e) => onChange(Number(e.target.value))}
          />
        </Labelled>
      );
    case "color":
      return (
        <Labelled label={field.label} help={field.help}>
          <div className="flex items-center gap-2">
            <input
              type="color"
              className="field h-11 w-14 shrink-0 p-1"
              value={String(value ?? "#d99a4e")}
              onChange={(e) => onChange(e.target.value)}
            />
            <input
              className="field"
              value={String(value ?? "")}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        </Labelled>
      );
    case "list":
      return (
        <Labelled label={field.label} help={field.help ?? "One per line."}>
          <textarea
            rows={4}
            className="field resize-y"
            value={(Array.isArray(value) ? value : []).join("\n")}
            onChange={(e) => onChange(e.target.value.split("\n"))}
          />
        </Labelled>
      );
    case "group":
      return (
        <GroupField field={field} value={value} onChange={onChange} />
      );
    default:
      return null;
  }
}

function emptyItem(fields: Field[]): Value {
  const obj: Value = {};
  for (const f of fields) {
    obj[f.name] = f.type === "number" ? 0 : f.type === "list" ? [] : "";
  }
  return obj;
}

function GroupField({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const items: Value[] = Array.isArray(value) ? (value as Value[]) : [];
  const subFields = field.fields ?? [];
  const noun = field.itemNoun ?? "item";

  const update = (next: Value[]) => onChange(next);
  const setItem = (idx: number, subName: string, v: unknown) =>
    update(items.map((it, i) => (i === idx ? { ...it, [subName]: v } : it)));
  const add = () => update([...items, emptyItem(subFields)]);
  const remove = (idx: number) => update(items.filter((_, i) => i !== idx));
  const move = (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[idx], next[j]] = [next[j], next[idx]];
    update(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.15em] text-faint">{field.label}</span>
        <button
          type="button"
          onClick={add}
          className="rounded-full border hairline px-3 py-1 text-xs text-copper hover:text-copper-soft"
        >
          + Add {noun}
        </button>
      </div>
      {field.help && <p className="text-xs text-mist/70">{field.help}</p>}

      {items.length === 0 && (
        <p className="text-sm text-mist">No {noun}s yet.</p>
      )}

      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="rounded-xl border hairline bg-ink-2/40 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs text-faint">
                {noun} {idx + 1}
              </span>
              <div className="flex items-center gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => move(idx, -1)}
                  disabled={idx === 0}
                  className="rounded px-2 py-1 text-mist hover:text-paper disabled:opacity-30"
                  aria-label="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(idx, 1)}
                  disabled={idx === items.length - 1}
                  className="rounded px-2 py-1 text-mist hover:text-paper disabled:opacity-30"
                  aria-label="Move down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="rounded px-2 py-1 text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {subFields.map((sub) => (
                <FieldRow
                  key={sub.name}
                  field={sub}
                  value={item[sub.name]}
                  onChange={(v) => setItem(idx, sub.name, v)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
