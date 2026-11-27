"use client";

import { useState, type FormEvent } from "react";
import { challenges, site } from "@/lib/content";

type Field = {
  name: string;
  label: string;
  type?: "text" | "tel" | "email" | "number" | "select" | "textarea";
  options?: string[];
  optional?: boolean;
  autoComplete?: string;
  wide?: boolean;
};

const contact: Field[] = [
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
];

const forms = {
  volunteer: {
    heading: "Volunteer registration",
    submit: "Register as a volunteer",
    fields: [
      { name: "name", label: "Full name", autoComplete: "name", wide: true },
      ...contact,
      { name: "area", label: "Area or city" },
      { name: "when", label: "When can you help?", type: "select", options: ["Before race day", "On race day", "Both"] },
      { name: "note", label: "Anything you would like to help with", type: "textarea", optional: true, wide: true },
    ],
  },
  organisation: {
    heading: "Sector Challenge registration",
    submit: "Register your organisation",
    fields: [
      { name: "organisation", label: "Organisation name", autoComplete: "organization", wide: true },
      { name: "challenge", label: "Challenge", type: "select", options: challenges.map((c) => c.name) },
      { name: "people", label: "Number of people", type: "number" },
      { name: "name", label: "HR lead’s name", autoComplete: "name", wide: true },
      ...contact,
    ],
  },
} satisfies Record<string, { heading: string; submit: string; fields: Field[] }>;

const inputClass =
  "mt-2 block w-full rounded-none border border-ink/30 bg-transparent px-4 py-3 text-base leading-[1.3] text-ink focus:border-ink focus:outline-2 focus:outline-offset-2 focus:outline-gold";

/**
 * Registration without a server: the answers become a WhatsApp message to the
 * team, which the visitor sends from their own phone. Nothing is stored here.
 */
export function RegisterForm({ kind }: { kind: keyof typeof forms }) {
  const form: { heading: string; submit: string; fields: Field[] } = forms[kind];
  const [link, setLink] = useState("");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const lines = form.fields.flatMap((f) => {
      const v = String(data.get(f.name) ?? "").trim();
      return v ? [`${f.label.replace(/\?$/, "")}: ${v}`] : [];
    });
    const message = [`Stallion Marathon: ${form.heading.toLowerCase()}`, "", ...lines].join("\n");
    const url = `https://wa.me/91${site.whatsapp}?text=${encodeURIComponent(message)}`;
    setLink(url);
    const tab = window.open(url, "_blank");
    if (tab) tab.opener = null;
  }

  return (
    <form onSubmit={onSubmit} aria-label={form.heading} className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
      {form.fields.map((f) => {
        const id = `${kind}-${f.name}`;
        const common = {
          id,
          name: f.name,
          required: !f.optional,
          autoComplete: f.autoComplete,
          className: inputClass,
        };
        return (
          <div key={f.name} className={f.wide ? "sm:col-span-2" : ""}>
            <label htmlFor={id} className="text-sm text-ink/70">
              {f.label}
              {f.optional && " (optional)"}
            </label>
            {f.type === "select" ? (
              <select {...common} defaultValue="">
                <option value="" disabled>
                  Choose one
                </option>
                {f.options?.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            ) : f.type === "textarea" ? (
              <textarea {...common} rows={3} maxLength={500} />
            ) : (
              <input
                {...common}
                type={f.type ?? "text"}
                maxLength={120}
                {...(f.type === "number" ? { min: 1, inputMode: "numeric" as const } : {})}
                {...(f.type === "tel"
                  ? { inputMode: "tel" as const, pattern: "[0-9+ \\(\\)\\-]{8,18}", title: "A phone number, digits only" }
                  : {})}
              />
            )}
          </div>
        );
      })}

      <div className="flex flex-col gap-4 sm:col-span-2">
        <button
          type="submit"
          className="label w-full cursor-pointer border-0 bg-[#3b1f8e] px-6 py-5 text-[#f8f3fe] transition-colors duration-300 hover:bg-[#f2b705] hover:text-[#1e1146] sm:w-fit sm:px-10"
        >
          {form.submit}
        </button>
        <p className="m-0 max-w-xl text-sm leading-[1.4] text-ink/70" aria-live="polite">
          {link ? (
            <>
              Your message is ready in WhatsApp. Press send there to finish.{" "}
              <a href={link} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                Open WhatsApp again
              </a>
              , or call{" "}
              <a href={`tel:+91${site.phone}`} className="underline underline-offset-4">
                {site.phoneDisplay}
              </a>
              .
            </>
          ) : (
            "This opens WhatsApp with your details filled in. Press send there to finish."
          )}
        </p>
      </div>
    </form>
  );
}
